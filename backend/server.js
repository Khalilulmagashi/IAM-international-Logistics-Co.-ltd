const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const nodemailer = require('nodemailer');

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

app.post('/api/contact', async (req, res) => {
  const { name, phone, email, message } = req.body || {};
  if (!name || !phone || !message) {
    return res.status(400).json({ ok: false, error: 'Missing required fields.' });
  }
  try {
    const result = await sendEnquiry(`Website contact from ${name}`, {
      name,
      phone,
      email: email || 'N/A',
      message,
    });
    res.json({
      ok: true,
      simulated: result.simulated,
      message: result.simulated
        ? 'Message received (email sending not configured on server).'
        : 'Message sent successfully.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Failed to send message.' });
  }
});

app.post('/api/enquiry', async (req, res) => {
  const body = req.body || {};
  const type = String(body.type || body.intent || 'quote');
  const phone = body.phone;
  const contactPerson = body.contactPerson || body.name;
  if (!phone || !contactPerson) {
    return res.status(400).json({ ok: false, error: 'Contact person and phone are required.' });
  }
  if ((type === 'quote' || type === 'project') && !body.product && !body.company) {
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

  try {
    const result = await sendEnquiry(`IAM website ${type} — ${contactPerson}`, fields, body.attachment);
    res.json({
      ok: true,
      simulated: result.simulated,
      message: result.simulated
        ? 'Enquiry received (email sending not configured on server).'
        : 'Enquiry sent successfully.',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: 'Failed to send enquiry.' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`IAM International Logistics server running at http://localhost:${PORT}`);
  console.log(`On the same Wi-Fi, open http://<this-computer-ip>:${PORT} from a phone`);
});
