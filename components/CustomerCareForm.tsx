'use client';

import { FormEvent, useEffect, useState } from 'react';
import { CheckCircle2, Info, Loader2, MapPin, PackageSearch, Truck } from 'lucide-react';

const serviceLabels = { warranty: 'Warranty Support', pickup: 'Pickup & Delivery', status: 'Repair Status' } as const;
type ServiceKey = keyof typeof serviceLabels;

export function CustomerCareForm({ initialService = 'warranty' }: { initialService?: ServiceKey }) {
  const [service, setService] = useState<ServiceKey>(initialService);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [reference, setReference] = useState('');
  useEffect(() => setService(initialService), [initialService]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const formElement = event.currentTarget; setStatus('sending'); setMessage(''); setReference('');
    const form = new FormData(formElement); const body = Object.fromEntries(form.entries());
    try {
      const response = await fetch('/api/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...body, type: 'service', requirement: `${serviceLabels[service]} - Customer Care`, message: `${serviceLabels[service]} request. ${String(body.message || '')}` }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Submission failed');
      setReference(result.reference || ''); setStatus('success'); setMessage(result.delivery === 'demo' ? 'Request recorded for the management demo. Live service-desk routing will be enabled after production approval.' : 'Your request has been submitted to ProPrint.'); formElement.reset();
    } catch (error) { setStatus('error'); setMessage(error instanceof Error ? error.message : 'Unable to submit your request.'); }
  }

  const guidance = service === 'pickup'
    ? { icon: Truck, title: 'Request a Kuwait pickup', text: 'Enter the collection address, Google Maps location, equipment and preferred date. ProPrint will confirm pickup availability, timing and any applicable charge before dispatch.' }
    : service === 'status'
      ? { icon: PackageSearch, title: 'Request a repair update', text: 'Enter the ProPrint service reference or repair receipt number whenever possible. This demo sends a status enquiry; it does not display live workshop data yet.' }
      : { icon: Info, title: 'Warranty assistance', text: 'Provide the brand, exact model and serial/product number. Manufacturer warranty eligibility is determined by the manufacturer.' };
  const GuidanceIcon = guidance.icon;

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7 md:grid-cols-2">
      <div className="md:col-span-2 rounded-2xl bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-800"><Info className="mr-2 inline" size={15}/><b>Management demo:</b> warranty, pickup and repair-status enquiries are request based until the live service system is connected.</div>
      <div className="md:col-span-2 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#0b5cff] shadow-sm"><GuidanceIcon size={19}/></div><div><div className="font-black text-slate-900">{guidance.title}</div><p className="mt-1 text-xs leading-5 text-slate-500">{guidance.text}</p></div></div>
      <label className="md:col-span-2 text-sm font-black text-slate-700">Service required<select value={service} onChange={(e) => { setService(e.target.value as ServiceKey); setStatus('idle'); setMessage(''); setReference(''); }} className="form-field mt-2 w-full"><option value="warranty">Warranty Support</option><option value="pickup">Pickup & Delivery</option><option value="status">Repair Status</option></select></label>
      <input name="name" required autoComplete="name" className="form-field" placeholder="Name / Company *" /><input name="phone" required autoComplete="tel" className="form-field" placeholder="Kuwait phone *" /><input name="email" type="email" autoComplete="email" className="form-field" placeholder="Email" /><input name="equipment" className="form-field" placeholder="Equipment / exact model" />
      {service === 'warranty' && <><input name="brand" className="form-field" placeholder="Brand" /><input name="serial" className="form-field" placeholder="Serial / product number" /></>}
      {service === 'pickup' && <>
        <input name="area" required className="form-field" placeholder="Kuwait area *" />
        <input name="block" className="form-field" placeholder="Block / street" />
        <input name="building" className="form-field" placeholder="Building / office / floor" />
        <input name="googleLocation" type="url" inputMode="url" className="form-field" placeholder="Google Maps location link" />
        <input name="preferredDate" type="date" className="form-field md:col-span-2" aria-label="Preferred pickup date" />
        <div className="md:col-span-2 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-xs leading-5 text-blue-900"><MapPin className="mr-2 inline" size={15}/><b>Google location:</b> Open Google Maps, choose the pickup location, tap Share, copy the link and paste it above. This helps the ProPrint team find the exact collection point.</div>
        <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-bold text-slate-600">Pickup is for Kuwait locations only. Availability, timing and charges are confirmed by ProPrint.</div>
      </>}
      {service === 'status' && <><input name="serviceReference" required className="form-field md:col-span-2" placeholder="ProPrint service reference / repair receipt number *" /><div className="md:col-span-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900"><b>No reference?</b> Enter your phone number above and explain when the equipment was submitted, the device model and any name/company shown on the receipt. ProPrint can use those details to identify the job.</div></>}
      <textarea name="message" required className="form-field min-h-32 md:col-span-2" placeholder={service === 'warranty' ? 'Tell us what warranty support you need' : service === 'pickup' ? 'Describe the device, fault, quantity and any collection instructions' : 'Tell us what repair update you need or add identifying details'} />
      <button type="submit" disabled={status === 'sending'} className="rounded-full bg-[#0b5cff] px-6 py-3.5 font-black text-white transition hover:bg-[#084bcf] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 md:col-span-2 disabled:opacity-60">{status === 'sending' ? <><Loader2 className="mr-2 inline animate-spin" size={17}/>Submitting...</> : service === 'pickup' ? 'Request Pickup Confirmation' : service === 'status' ? 'Request Repair Status Update' : 'Submit Warranty Support Request'}</button>
      {(status === 'success' || status === 'error') && <div aria-live="polite" className={`md:col-span-2 rounded-2xl p-4 text-sm ${status === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}>{status === 'success' && <CheckCircle2 className="mr-2 inline" size={17}/>} {message}{reference && <div className="mt-2 font-black">Reference: {reference}</div>}</div>}
    </form>
  );
}
