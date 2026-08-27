'use client';

import { FormEvent, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';

type Props = { mode: 'service' | 'quote' };

export function RequestForm({ mode }: Props) {
  const [status, setStatus] = useState<'idle'|'sending'|'success'|'error'>('idle');
  const [message, setMessage] = useState('');
  const [reference, setReference] = useState('');

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
        ? 'Request captured in demo mode. Live email/webhook delivery still needs to be configured.'
        : 'Your request has been submitted successfully.');
      setStatus('success');
      formElement.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to submit your request.');
      setStatus('error');
    }
  }

  const isService = mode === 'service';

  return <form onSubmit={submit} className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm md:grid-cols-2">
    <input name="name" required className="form-field" placeholder={isService ? 'Name / Company' : 'Name'} />
    {!isService && <input name="company" className="form-field" placeholder="Company" />}
    <input name="phone" required className="form-field" placeholder="Phone" />
    <input name="email" type="email" className="form-field" placeholder="Email" />
    {isService ? <>
      <input name="equipment" className="form-field md:col-span-2" placeholder="Equipment / Model" />
      <select name="requirement" className="form-field md:col-span-2" defaultValue=""><option value="" disabled>Service type</option><option>Printer / MFP</option><option>Plotter / Wide Format</option><option>Laptop / Desktop</option><option>Onsite IT Support</option><option>AMC Support</option><option>Other Hardware</option></select>
    </> : <>
      <select name="requirement" className="form-field md:col-span-2" defaultValue=""><option value="" disabled>Select requirement</option><option>Product Purchase</option><option>Corporate / Bulk Procurement</option><option>Printing & Plotting Solution</option><option>AMC</option><option>Service Center</option><option>Enterprise IT / Field Services</option></select>
      <input name="quantity" className="form-field md:col-span-2" placeholder="Estimated quantity / number of assets (optional)" />
    </>}
    <textarea name="message" required className="form-field min-h-36 md:col-span-2" placeholder={isService ? 'Describe the issue' : 'Tell us about products, locations, equipment, support scope or project requirements'} />
    <button disabled={status==='sending'} className={`rounded-full px-6 py-3.5 font-black text-white md:col-span-2 ${isService?'bg-[#0b5cff]':'bg-[#f47b20]'} disabled:opacity-60`}>
      {status==='sending' ? <><Loader2 className="mr-2 inline animate-spin" size={17}/>Submitting...</> : isService ? 'Submit Service Request' : 'Submit Quote Request'}
    </button>
    {(status==='success'||status==='error') && <div className={`md:col-span-2 rounded-2xl p-4 text-sm ${status==='success'?'bg-emerald-50 text-emerald-800':'bg-red-50 text-red-700'}`}>
      {status==='success' && <CheckCircle2 className="mr-2 inline" size={17}/>} {message}
      {reference && <div className="mt-2 font-black">Reference: {reference}</div>}
    </div>}
  </form>;
}
