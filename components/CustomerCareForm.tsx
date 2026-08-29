'use client';

import { FormEvent, useEffect, useState } from 'react';
import { CheckCircle2, Info, Loader2 } from 'lucide-react';

const serviceLabels = {
  warranty: 'Warranty Support',
  pickup: 'Pickup & Delivery',
  status: 'Repair Status',
} as const;

type ServiceKey = keyof typeof serviceLabels;

export function CustomerCareForm({ initialService = 'warranty' }: { initialService?: ServiceKey }) {
  const [service, setService] = useState<ServiceKey>(initialService);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [reference, setReference] = useState('');

  useEffect(() => setService(initialService), [initialService]);

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
        body: JSON.stringify({
          ...body,
          type: 'service',
          requirement: `${serviceLabels[service]} - Customer Care`,
          message: `${serviceLabels[service]} request. ${String(body.message || '')}`,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Submission failed');

      setReference(result.reference || '');
      setStatus('success');
      setMessage(result.delivery === 'demo'
        ? 'Request recorded for the management demo. Live service-desk routing will be enabled after production approval.'
        : 'Your request has been submitted to ProPrint.');
      formElement.reset();
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Unable to submit your request.');
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7 md:grid-cols-2">
      <div className="md:col-span-2 rounded-2xl bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-800"><Info className="mr-2 inline" size={15}/><b>Management demo:</b> warranty, pickup and repair-status enquiries are request based until the live service system is connected.</div>

      <label className="md:col-span-2 text-sm font-black text-slate-700">Service required
        <select value={service} onChange={(e) => setService(e.target.value as ServiceKey)} className="form-field mt-2 w-full">
          <option value="warranty">Warranty Support</option>
          <option value="pickup">Pickup & Delivery</option>
          <option value="status">Repair Status</option>
        </select>
      </label>

      <input name="name" required autoComplete="name" className="form-field" placeholder="Name / Company *" />
      <input name="phone" required autoComplete="tel" className="form-field" placeholder="Kuwait phone *" />
      <input name="email" type="email" autoComplete="email" className="form-field" placeholder="Email" />
      <input name="equipment" className="form-field" placeholder="Equipment / model" />

      {service === 'warranty' && <>
        <input name="brand" className="form-field" placeholder="Brand (HP, Lenovo, Dell, Epson...)" />
        <input name="serial" className="form-field" placeholder="Serial / product number" />
      </>}

      {service === 'pickup' && <>
        <input name="area" required className="form-field" placeholder="Kuwait area *" />
        <input name="preferredDate" className="form-field" placeholder="Preferred pickup date" />
      </>}

      {service === 'status' && <input name="serviceReference" className="form-field md:col-span-2" placeholder="ProPrint service reference / repair receipt number" />}

      <textarea name="message" required className="form-field min-h-32 md:col-span-2" placeholder={service === 'warranty' ? 'Tell us what warranty support you need' : service === 'pickup' ? 'Describe the device, fault and pickup details' : 'Tell us what repair or service you are checking'} />

      <button type="submit" disabled={status === 'sending'} className="rounded-full bg-[#0b5cff] px-6 py-3.5 font-black text-white md:col-span-2 disabled:opacity-60">
        {status === 'sending' ? <><Loader2 className="mr-2 inline animate-spin" size={17}/>Submitting...</> : `Submit ${serviceLabels[service]} Request`}
      </button>

      {(status === 'success' || status === 'error') && <div aria-live="polite" className={`md:col-span-2 rounded-2xl p-4 text-sm ${status === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}>
        {status === 'success' && <CheckCircle2 className="mr-2 inline" size={17}/>} {message}
        {reference && <div className="mt-2 font-black">Reference: {reference}</div>}
      </div>}
    </form>
  );
}
