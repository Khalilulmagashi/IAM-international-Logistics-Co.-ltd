const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');
const whatsapp = require('./services/whatsapp');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '8mb' }));

const publicDir = path.join(__dirname, '..');
app.use(express.static(publicDir));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'iam-international-logistics-backend' });
});

function isPlaceholder(val) {
  if (!val) return true;
  const v = String(val).toLowerCase();
  if (v.includes('your-provider.com')) return true;
  if (v.includes('your_smtp_username')) return true;
  if (v.includes('your_smtp_password')) return true;
  if (v.includes('you@example.com')) return true;
  if (v.includes('your-domain.com')) return true;
  return false;
}

function smtpReady() {
  const to = process.env.CONTACT_TO_EMAIL;
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      to &&
      !isPlaceholder(process.env.SMTP_HOST) &&
      !isPlaceholder(process.env.SMTP_USER) &&
      !isPlaceholder(process.env.SMTP_PASS) &&
      !isPlaceholder(to)
  );
}

const recentHits = new Map();

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded) return forwarded.split(',')[0].trim();
  return req.socket.remoteAddress || 'unknown';
}

function rateLimited(req) {
  const ip = clientIp(req);
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const list = (recentHits.get(ip) || []).filter(function (time) { return now - time < windowMs; });
  if (list.length >= 12) {
    recentHits.set(ip, list);
    return true;
  }
  list.push(now);
  recentHits.set(ip, list);
  return false;
}

function submissionId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function safeAttachment(attachment) {
  if (!attachment || typeof attachment !== 'object') return null;
  const name = String(attachment.name || '').replace(/[^\w.\- ()]/g, '_').slice(0, 120);
  const data = typeof attachment.data === 'string' ? attachment.data.replace(/\s/g, '') : '';
  if (!name) return null;
  if (data && data.length > 8 * 1024 * 1024) {
    const error = new Error('Attachment is too large.');
    error.statusCode = 400;
    throw error;
  }
  if (data && !/^[A-Za-z0-9+/=]+$/.test(data)) {
    const error = new Error('Attachment could not be read.');
    error.statusCode = 400;
    throw error;
  }
  return { name: name, type: String(attachment.type || '').slice(0, 80), data: data };
}

function pick(body, keys) {
  const out = {};
  keys.forEach((k) => {
    if (body[k] != null && String(body[k]).trim() !== '') out[k] = String(body[k]).trim();
  });
  return out;
}

async function sendEnquiry(subject, fields, attachment) {
  if (!smtpReady()) {
    console.log('Enquiry (SMTP not configured):', { subject, fields, attachment: attachment ? attachment.name : null });
    return { simulated: true };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });

  const text = Object.entries(fields)
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');

  const mail = {
    from: process.env.CONTACT_FROM_EMAIL || fields.email || 'no-reply@iamcorperate.com',
    to: process.env.CONTACT_TO_EMAIL,
    subject,
    text,
  };

  if (attachment && attachment.data && attachment.name) {
    mail.attachments = [
      {
        filename: String(attachment.name).replace(/[^\w.\- ()]/g, '_').slice(0, 120),
        content: Buffer.from(attachment.data, 'base64'),
      },
    ];
  }

  await transporter.sendMail(mail);
  return { simulated: false };
}

const CUSTOMER_MESSAGE = 'Thank you. Your request has been received by IAM International Logistics. Our team will review the details and contact you shortly.';

async function notify(type, fields, attachment, intent) {
  const id = submissionId();
  await whatsapp.sendWhatsAppNotification({
    type: type,
    intent: intent,
    data: fields,
    submissionId: id,
    attachmentName: attachment ? attachment.name : '',
  });
  return id;
}

app.post('/api/contact', async (req, res) => {
  if (rateLimited(req)) {
    return res.status(429).json({ ok: false, error: 'Please wait a few minutes before sending another request.' });
  }
  const { name, phone, email, message } = req.body || {};
  if (!name || !phone || !message) {
    return res.status(400).json({ ok: false, error: 'Missing required fields.' });
  }
  try {
    const fields = pick({ name, phone, email, message }, ['name', 'phone', 'email', 'message']);
    const result = await sendEnquiry(`Website contact from ${name}`, fields);
    await notify('contact', fields);
    res.json({ ok: true, simulated: result.simulated, message: CUSTOMER_MESSAGE });
  } catch (err) {
    console.error(err && err.message ? err.message : 'contact failed');
    res.status(500).json({ ok: false, error: 'Failed to send message.' });
  }
});

app.post('/api/enquiry', async (req, res) => {
  if (rateLimited(req)) {
    return res.status(429).json({ ok: false, error: 'Please wait a few minutes before sending another request.' });
  }
  const body = req.body || {};
  const type = whatsapp.normalizeType(body.type || body.intent || 'quote', body.intent);
  if (!type) {
    return res.status(400).json({ ok: false, error: 'This request could not be accepted.' });
  }
  const phone = body.phone;
  const contactPerson = body.contactPerson || body.name;
  if (!phone || !contactPerson) {
    return res.status(400).json({ ok: false, error: 'Contact person and phone are required.' });
  }
  if (type === 'general_enquiry' && !body.message) {
    return res.status(400).json({ ok: false, error: 'A message is required.' });
  }
  if (type !== 'general_enquiry' && !body.product && !body.company) {
    return res.status(400).json({ ok: false, error: 'Company or product required.' });
  }

  const fields = pick(body, [
    'type',
    'intent',
    'company',
    'contactPerson',
    'name',
    'phone',
    'email',
    'country',
    'product',
    'category',
    'specification',
    'grade',
    'dimensions',
    'quantity',
    'unit',
    'packaging',
    'deliveryLocation',
    'deliveryDate',
    'source',
    'origin',
    'containers',
    'portOfDischarge',
    'shippingTerms',
    'timeline',
    'budget',
    'message',
    'projectName',
    'projectLocation',
    'schedule',
    'machineType',
    'brand',
    'machineBrand',
    'model',
    'condition',
    'year',
    'capacity',
    'intendedUse',
  ]);

  let attachment = null;
  try {
    attachment = safeAttachment(body.attachment);
    const result = await sendEnquiry(`IAM website ${type} — ${contactPerson}`, fields, attachment);
    await notify(type, fields, attachment, body.intent);
    res.json({ ok: true, simulated: result.simulated, message: CUSTOMER_MESSAGE });
  } catch (err) {
    const status = err && err.statusCode ? err.statusCode : 500;
    console.error(err && err.message ? err.message : 'enquiry failed');
    res.status(status).json({
      ok: false,
      error: status === 400 ? err.message : 'Failed to send enquiry.',
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`IAM International Logistics server running at http://localhost:${PORT}`);
  console.log(`On the same Wi-Fi, open http://<this-computer-ip>:${PORT} from a phone`);
});
