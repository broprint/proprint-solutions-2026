import { NextResponse } from 'next/server';

const allowedTypes = new Set(['service', 'quote']);

function clean(value: unknown, max = 2000) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[char] || char));
}

function reference(type: string) {
  const date = new Date();
  const stamp = `${date.getUTCFullYear()}${String(date.getUTCMonth()+1).padStart(2,'0')}${String(date.getUTCDate()).padStart(2,'0')}`;
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `PP-${type === 'service' ? 'SRV' : 'QTE'}-${stamp}-${random}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const type = clean(body.type, 20).toLowerCase();
    if (!allowedTypes.has(type)) return NextResponse.json({ error: 'Invalid request type.' }, { status: 400 });

    const name = clean(body.name, 120);
    const phone = clean(body.phone, 60);
    const email = clean(body.email, 180);
    const company = clean(body.company, 180);
    const requirement = clean(body.requirement, 180);
    const equipment = clean(body.equipment, 220);
    const quantity = clean(body.quantity, 100);
    const message = clean(body.message, 4000);

    if (!name || !phone || !message) {
      return NextResponse.json({ error: 'Name, phone and details are required.' }, { status: 400 });
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const ref = reference(type);
    const submittedAt = new Date().toISOString();
    const payload = { ref, type, submittedAt, name, phone, email, company, requirement, equipment, quantity, message };

    const webhook = process.env.PROPRINT_REQUEST_WEBHOOK_URL;
    const resendKey = process.env.RESEND_API_KEY;
    const requestEmail = process.env.PROPRINT_REQUEST_EMAIL;
    const fromEmail = process.env.PROPRINT_FROM_EMAIL || 'ProPrint Website <onboarding@resend.dev>';

    if (webhook) {
      const webhookResponse = await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!webhookResponse.ok) throw new Error('Webhook delivery failed');
      return NextResponse.json({ ok: true, reference: ref, delivery: 'webhook' });
    }

    if (resendKey && requestEmail) {
      const title = type === 'service' ? 'Service Request' : 'Quote Request';
      const rows = [
        ['Reference', ref], ['Submitted', submittedAt], ['Name', name], ['Company', company], ['Phone', phone], ['Email', email],
        ['Requirement / Service Type', requirement], ['Equipment / Model', equipment], ['Quantity / Assets', quantity], ['Details', message]
      ].filter(([, value]) => value);
      const html = `<h2>New ProPrint ${title}</h2><table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;border-color:#e2e8f0">${rows.map(([label,value])=>`<tr><td><strong>${escapeHtml(label)}</strong></td><td>${escapeHtml(value)}</td></tr>`).join('')}</table>`;
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: fromEmail, to: [requestEmail], subject: `${title} ${ref} — ${name}`, html, reply_to: email || undefined }),
      });
      if (!emailResponse.ok) throw new Error('Email delivery failed');
      return NextResponse.json({ ok: true, reference: ref, delivery: 'email' });
    }

    console.info('PROPRINT_REQUEST_DEMO', payload);
    return NextResponse.json({ ok: true, reference: ref, delivery: 'demo', warning: 'Live delivery is not configured yet.' });
  } catch (error) {
    console.error('Request submission error', error);
    return NextResponse.json({ error: 'Unable to submit your request right now. Please try again.' }, { status: 500 });
  }
}
