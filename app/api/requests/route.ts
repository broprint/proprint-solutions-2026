import { NextResponse } from 'next/server';
import { getStoreProducts } from '@/lib/products';

const allowedTypes = new Set(['service', 'quote', 'order']);

type CartInput = { slug?: unknown; quantity?: unknown };

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
  const code = type === 'service' ? 'SRV' : type === 'order' ? 'ORD' : 'QTE';
  return `PP-${code}-${stamp}-${random}`;
}

function parsePrice(price: string) {
  const match = price.match(/KD\s*([0-9.]+)/i);
  return match ? Number(match[1]) : null;
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
    let message = clean(body.message, 4000);
    let cartItems: Array<{ slug:string; name:string; sku?:string; quantity:number; unitPrice:number|null; lineTotal:number|null }> = [];
    let cartSubtotal: number | null = null;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and phone are required.' }, { status: 400 });
    }
    if (email && !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (type === 'order') {
      const rawItems = Array.isArray(body.cart) ? (body.cart as CartInput[]).slice(0, 30) : [];
      if (!rawItems.length) return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });

      const products = await getStoreProducts();
      for (const raw of rawItems) {
        const slug = clean(raw.slug, 180);
        const product = products.find((item) => item.slug === slug);
        if (!product) continue;

        let requested = Math.max(1, Math.floor(Number(raw.quantity) || 1));
        if ((product.stock === 'In stock' || product.stock === 'Low stock') && typeof product.stockQuantity === 'number') {
          requested = Math.min(requested, Math.max(0, product.stockQuantity));
        }
        if (requested <= 0) continue;

        const unitPrice = parsePrice(product.price);
        cartItems.push({
          slug: product.slug,
          name: product.name,
          sku: product.sku,
          quantity: requested,
          unitPrice,
          lineTotal: unitPrice === null ? null : Number((unitPrice * requested).toFixed(3)),
        });
      }

      if (!cartItems.length) return NextResponse.json({ error: 'No valid products were found in your cart.' }, { status: 400 });
      cartSubtotal = Number(cartItems.reduce((sum, item) => sum + (item.lineTotal ?? 0), 0).toFixed(3));
      const cartSummary = cartItems.map((item) => `${item.quantity} × ${item.name}${item.sku ? ` (${item.sku})` : ''}${item.lineTotal === null ? ' — Request Quote' : ` — KD ${item.lineTotal.toFixed(3)}`}`).join('\n');
      message = `${message ? `${message}\n\n` : ''}Cart:\n${cartSummary}\n\nIndicative subtotal: KD ${cartSubtotal.toFixed(3)}${cartItems.some((item) => item.lineTotal === null) ? ' + quote-only items' : ''}`.slice(0, 8000);
    } else if (!message) {
      return NextResponse.json({ error: 'Details are required.' }, { status: 400 });
    }

    const ref = reference(type);
    const submittedAt = new Date().toISOString();
    const payload = { ref, type, submittedAt, name, phone, email, company, requirement, equipment, quantity, message, cartItems, cartSubtotal };

    const webhook = process.env.PROPRINT_REQUEST_WEBHOOK_URL;
    const resendKey = process.env.RESEND_API_KEY;
    const requestEmails = (process.env.PROPRINT_REQUEST_EMAIL || '')
      .split(',')
      .map((address) => address.trim())
      .filter((address) => /^\S+@\S+\.\S+$/.test(address));
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

    if (resendKey && requestEmails.length) {
      const title = type === 'service' ? 'Service Request' : type === 'order' ? 'Order / Final Quote Request' : 'Quote Request';
      const rows = [
        ['Reference', ref], ['Submitted', submittedAt], ['Name', name], ['Company', company], ['Phone', phone], ['Email', email],
        ['Requirement / Service Type', requirement], ['Equipment / Model', equipment], ['Quantity / Assets', quantity], ['Details', message]
      ].filter(([, value]) => value);
      const html = `<h2>New ProPrint ${title}</h2><table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;border-color:#e2e8f0">${rows.map(([label,value])=>`<tr><td><strong>${escapeHtml(label)}</strong></td><td style="white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join('')}</table>`;
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: fromEmail, to: requestEmails, subject: `${title} ${ref} — ${name}`, html, reply_to: email || undefined }),
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
