const TYPE_TITLES = {
  general_enquiry: 'NEW GENERAL ENQUIRY',
  supply_quote: 'NEW SUPPLY QUOTE',
  project_bulk: 'NEW PROJECT / BULK SUPPLY REQUEST',
  import_logistics: 'NEW IMPORT & LOGISTICS REQUEST',
};

const TYPE_ALIASES = {
  contact: 'general_enquiry',
  general_enquiry: 'general_enquiry',
  quote: 'supply_quote',
  supply_quote: 'supply_quote',
  project: 'project_bulk',
  project_bulk: 'project_bulk',
  import: 'import_logistics',
  import_logistics: 'import_logistics',
};

function clean(value, max) {
  if (value == null) return '';
  return String(value)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim()
    .slice(0, max || 1500);
}

function normalizeType(type, intent) {
  const key = clean(type, 40).toLowerCase();
  const intentKey = clean(intent, 40).toLowerCase();
  if ((key === 'quote' || key === 'supply_quote') && (intentKey === 'import' || intentKey === 'import_logistics')) {
    return 'import_logistics';
  }
  return TYPE_ALIASES[key] || '';
}

function row(label, value) {
  const text = clean(value, 1500);
  if (!text) return '';
  return label + ': ' + text;
}

function section(title, lines) {
  const kept = lines.filter(Boolean);
  if (!kept.length) return '';
  return title + '\n' + kept.join('\n');
}

function block(title, value) {
  const text = clean(value, 2000);
  if (!text) return '';
  return title + '\n' + text;
}

function displayDate(value) {
  const text = clean(value, 40);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  const parts = text.split('-').map(Number);
  const dt = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(dt);
}

function submittedAt(date) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Lagos',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date || new Date());
}

function customerLines(data) {
  return [
    row('Name', data.contactPerson || data.name),
    row('Company', data.company),
    row('Phone', data.phone),
    row('Email', data.email),
    row('Country', data.country),
  ];
}

function requestLines(data) {
  return [
    row('Product', data.product),
    row('Category', data.category),
    row('Quantity', data.quantity),
    row('Unit', data.unit),
    row('Preferred source', data.source),
    row('Grade', data.grade),
    row('Dimensions', data.dimensions),
    row('Brand', data.brand),
    row('Packaging', data.packaging),
  ];
}

function machineryLines(data) {
  return [
    row('Machine type', data.machineType),
    row('Brand preference', data.machineBrand),
    row('Model', data.model),
    row('Condition', data.condition),
    row('Year', data.year),
    row('Capacity', data.capacity),
    row('Intended use', data.intendedUse),
  ];
}

function movementLines(data) {
  return [
    row('Origin', data.origin),
    row('Containers', data.containers),
    row('Port of discharge', data.portOfDischarge),
    row('Destination', data.deliveryLocation || data.projectLocation),
    row('Shipping terms', data.shippingTerms),
    row('Required timeline', data.timeline),
  ];
}

function formatNotification(type, data, meta) {
  const title = TYPE_TITLES[type];
  if (!title) return '';
  const info = data || {};
  const parts = [
    '━━━━━━━━━━━━━━━━━━━━',
    title,
    'IAM INTERNATIONAL LOGISTICS',
    '━━━━━━━━━━━━━━━━━━━━',
  ];

  if (type === 'general_enquiry') {
    parts.push(section('CUSTOMER', [
      row('Name', info.contactPerson || info.name),
      row('Company', info.company),
      row('Phone', info.phone),
      row('Email', info.email),
    ]));
    parts.push(block('MESSAGE', info.message));
  } else if (type === 'supply_quote') {
    parts.push(section('CUSTOMER', customerLines(info)));
    parts.push(section('REQUEST', requestLines(info)));
    parts.push(block('SPECIFICATION', info.specification));
    parts.push(section('MACHINERY', machineryLines(info)));
    parts.push(section('IMPORT / SHIPPING', movementLines(info).filter((line) => !line.startsWith('Destination:'))));
    parts.push(section('DELIVERY', [
      row('Location', info.deliveryLocation),
      row('Required date', displayDate(info.deliveryDate)),
    ]));
    parts.push(block('BUDGET', info.budget));
    parts.push(block('ADDITIONAL REQUIREMENTS', info.message));
  } else if (type === 'project_bulk') {
    parts.push(section('CUSTOMER', customerLines(info)));
    parts.push(section('REQUEST', [
      row('Project', info.projectName),
      row('Project location', info.projectLocation),
      row('Product', info.product),
      row('Category', info.category),
      row('Quantity', info.quantity),
      row('Unit', info.unit),
      row('Preferred source', info.source),
    ]));
    parts.push(block('TECHNICAL SPECIFICATION', info.specification));
    parts.push(section('DELIVERY', [
      row('Location', info.deliveryLocation),
      row('Required date', displayDate(info.deliveryDate)),
      row('Schedule', info.schedule),
    ]));
    parts.push(block('BUDGET', info.budget));
    parts.push(block('ADDITIONAL REQUIREMENTS', info.message));
  } else if (type === 'import_logistics') {
    parts.push(section('CUSTOMER', customerLines(info)));
    parts.push(section('GOODS', [
      row('Goods', info.product),
      row('Category', info.category),
      row('Quantity', info.quantity),
      row('Unit', info.unit),
      row('Preferred source', info.source),
    ]));
    parts.push(block('SPECIFICATION', info.specification));
    parts.push(section('MOVEMENT', movementLines(info)));
    parts.push(section('DELIVERY', [
      row('Required date', displayDate(info.deliveryDate)),
    ]));
    parts.push(block('ADDITIONAL INFORMATION', info.message));
  }

  const attachment = clean(meta && meta.attachmentName, 120);
  if (attachment) parts.push('ATTACHMENT\n' + attachment);

  parts.push(
    [
      'Source: IAM Website',
      'Submitted: ' + submittedAt(meta && meta.submittedAt),
      'Reference: ' + clean(meta && meta.submissionId, 40),
    ].join('\n')
  );

  return parts.filter(Boolean).join('\n\n').slice(0, 4096);
}

function enabled() {
  return String(process.env.WHATSAPP_ENABLED || '').toLowerCase() === 'true';
}

function missingConfig() {
  return ['WHATSAPP_ACCESS_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID', 'WHATSAPP_RECIPIENT_NUMBER'].filter((key) => {
    return !clean(process.env[key], 400);
  });
}

function logEvent(entry) {
  console.log(JSON.stringify(entry));
}

async function postText(body) {
  const version = clean(process.env.WHATSAPP_API_VERSION, 20) || 'v22.0';
  const phoneId = clean(process.env.WHATSAPP_PHONE_NUMBER_ID, 40);
  const token = String(process.env.WHATSAPP_ACCESS_TOKEN || '');
  const to = String(process.env.WHATSAPP_RECIPIENT_NUMBER || '').replace(/\D/g, '');
  const url = 'https://graph.facebook.com/' + version + '/' + phoneId + '/messages';
  const controller = new AbortController();
  const timer = setTimeout(function () { controller.abort(); }, 15000);
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: to,
        type: 'text',
        text: { preview_url: false, body: body },
      }),
      signal: controller.signal,
    });
    const raw = await res.text();
    let json = null;
    try { json = raw ? JSON.parse(raw) : null; } catch (e) { json = null; }
    if (!res.ok) {
      const message = json && json.error && json.error.message ? json.error.message : 'HTTP ' + res.status;
      const error = new Error(clean(message, 300) || 'WhatsApp request failed');
      error.status = res.status;
      throw error;
    }
    const messageId = json && json.messages && json.messages[0] ? json.messages[0].id : '';
    return { status: res.status, messageId: clean(messageId, 80) };
  } finally {
    clearTimeout(timer);
  }
}

async function sendWhatsAppNotification(options) {
  const type = normalizeType(options && options.type, options && options.intent);
  const submissionId = clean(options && options.submissionId, 40) || 'unknown';
  const at = new Date().toISOString();
  if (!type) {
    logEvent({ channel: 'whatsapp', status: 'invalid_type', submissionId: submissionId, at: at });
    return { ok: false, status: 'invalid_type' };
  }
  if (!enabled()) {
    logEvent({ channel: 'whatsapp', status: 'disabled', type: type, submissionId: submissionId, at: at });
    return { ok: true, status: 'disabled' };
  }
  const missing = missingConfig();
  if (missing.length) {
    logEvent({
      channel: 'whatsapp',
      status: 'not_configured',
      type: type,
      submissionId: submissionId,
      at: at,
      missing: missing,
    });
    return { ok: false, status: 'not_configured' };
  }
  const text = formatNotification(type, options.data || {}, {
    attachmentName: options.attachmentName,
    submissionId: submissionId,
    submittedAt: options.submittedAt,
  });
  try {
    const result = await postText(text);
    logEvent({
      channel: 'whatsapp',
      status: 'sent',
      type: type,
      submissionId: submissionId,
      at: at,
      httpStatus: result.status,
      messageId: result.messageId,
    });
    return { ok: true, status: 'sent' };
  } catch (err) {
    const aborted = err && err.name === 'AbortError';
    logEvent({
      channel: 'whatsapp',
      status: 'failed',
      type: type,
      submissionId: submissionId,
      at: at,
      error: aborted ? 'timeout' : clean(err && err.message, 300),
    });
    return { ok: false, status: 'failed' };
  }
}

module.exports = {
  normalizeType: normalizeType,
  formatNotification: formatNotification,
  sendWhatsAppNotification: sendWhatsAppNotification,
};
