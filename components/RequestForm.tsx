'use client';

import { FormEvent, useState } from 'react';
import { CheckCircle2, Info, Loader2 } from 'lucide-react';

type Props = {
  mode: 'service' | 'quote';
  product?: string;
  sku?: string;
  requestKind?: 'price' | 'availability' | 'business';
};

export function RequestForm({ mode, product = '', sku = '', requestKind = 'business' }: Props) {
  const [status, setStatus] = useState<'idle'|'sending'|'success'|'error'>('idle');
  const [message, setMessage] = useState('');
  const [reference, setReference] = useState('');
  const isService = mode === 'service';
  const hasProduct = !isService && Boolean(product);
  const equipment = [product, sku ? `SKU: ${sku}` : ''].filter(Boolean).join(' — ');
  const requirementDefault = requestKind === 'availability'
    ? 'Product Availability'
    : requestKind === 'price'
      ? 'Product Price Request'
      : hasProduct ? 'Product Purchase' : '';

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setStatus('sending');
    setMessage('');
    setReference('');

    const form = new FormData(formElement);
    const body = Object.fromEntries(form.entries());

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, type: mode })
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Submission failed');

      setReference(result.reference || '');
      setMessage(result.delivery === 'demo'
        ? 'Demo submission recorded successfully. Email delivery will be enabled after management approval and domain configuration.'
        : 'Your request has been submitted successfully.');
      setStatus('success');
      formElement.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to submit your request.');
      setStatus('error');
    }
  }

  const defaultMessage = hasProduct
    ? requestKind === 'availability'
      ? `Please confirm availability and expected delivery for ${product}${sku ? ` (${sku})` : ''}.`
      : `Please provide pricing and availability for ${product}${sku ? ` (${sku})` : ''}.`
    : undefined;

  return <form onSubmit={submit} className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7 md:grid-cols-2">
    <div className="md:col-span-2 rounded-2xl bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-800"><Info className="mr-2 inline" size={15}/><b>Management demo:</b> submissions generate a reference number now; live email routing will be enabled after domain approval.</div>
    {hasProduct && <div className="md:col-span-2 rounded-2xl border border-blue-100 bg-white px-4 py-4"><div className="text-[10px] font-black uppercase tracking-[.16em] text-[#0b5cff]">Selected Product</div><div className="mt-1 font-black text-slate-900">{product}</div>{sku && <div className="mt-1 text-xs font-bold text-slate-500">SKU / Model: {sku}</div>}<input type="hidden" name="equipment" value={equipment}/></div>}
    <input name="name" required autoComplete="name" className="form-field" placeholder={isService ? 'Name / Company' : 'Name'} />
    {!isService && <input name="company" autoComplete="organization" className="form-field" placeholder="Company" />}
    <input name="phone" required autoComplete="tel" className="form-field" placeholder="Phone" />
    <input name="email" type="email" autoComplete="email" className="form-field" placeholder="Email" />
    {isService ? <>
      <input name="equipment" className="form-field md:col-span-2" placeholder="Equipment / Model" />
      <select name="requirement" required className="form-field md:col-span-2" defaultValue=""><option value="" disabled>Service type</option><option>Printer / MFP</option><option>Plotter / Wide Format</option><option>Laptop / Desktop</option><option>Onsite IT Support</option><option>AMC Support</option><option>Other Hardware</option></select>
    </> : <>
      <select name="requirement" required className="form-field md:col-span-2" defaultValue={requirementDefault}><option value="" disabled>Select requirement</option><option>Product Purchase</option><option>Product Price Request</option><option>Product Availability</option><option>Corporate / Bulk Procurement</option><option>Printing & Plotting Solution</option><option>AMC</option><option>Service Center</option><option>Enterprise IT / Field Services</option></select>
      <input name="quantity" className="form-field md:col-span-2" placeholder={hasProduct ? 'Quantity required (optional)' : 'Estimated quantity / number of assets (optional)'} />
    </>}
    <textarea name="message" required className="form-field min-h-36 md:col-span-2" defaultValue={defaultMessage} placeholder={isService ? 'Describe the issue' : 'Tell us about products, locations, equipment, support scope or project requirements'} />
    <button type="submit" disabled={status==='sending'} className={`rounded-full px-6 py-3.5 font-black text-white md:col-span-2 ${isService?'bg-[#0b5cff]':'bg-[#f47b20]'} disabled:cursor-not-allowed disabled:opacity-60`}>
      {status==='sending' ? <><Loader2 className="mr-2 inline animate-spin" size={17}/>Submitting...</> : isService ? 'Submit Service Request' : requestKind === 'availability' ? 'Submit Availability Request' : requestKind === 'price' ? 'Submit Price Request' : 'Submit Quote Request'}
    </button>
    {(status==='success'||status==='error') && <div aria-live="polite" className={`md:col-span-2 rounded-2xl p-4 text-sm ${status==='success'?'bg-emerald-50 text-emerald-800':'bg-red-50 text-red-700'}`}>
      {status==='success' && <CheckCircle2 className="mr-2 inline" size={17}/>} {message}
      {reference && <div className="mt-2 font-black">Reference: {reference}</div>}
    </div>}
  </form>;
}
