'use client';

import { FormEvent, useEffect, useState } from 'react';
import { CheckCircle2, Info, Loader2, MapPin, PackageSearch, Truck } from 'lucide-react';

const serviceLabels = { warranty: 'Warranty Support', pickup: 'Pickup & Delivery', status: 'Repair Status' } as const;
const serviceLabelsAr = { warranty: 'دعم الضمان', pickup: 'الاستلام والتوصيل', status: 'حالة الإصلاح' } as const;
type ServiceKey = keyof typeof serviceLabels;

export function CustomerCareForm({ initialService = 'warranty', locale = 'en' }: { initialService?: ServiceKey; locale?: 'en'|'ar' }) {
  const ar=locale==='ar'; const T=(en:string,arabic:string)=>ar?arabic:en;
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
      const result = await response.json(); if (!response.ok) throw new Error(result.error || T('Submission failed','فشل إرسال الطلب'));
      setReference(result.reference || ''); setStatus('success'); setMessage(result.delivery === 'demo' ? T('Request recorded for the management demo. Live service-desk routing will be enabled after production approval.','تم تسجيل الطلب في النسخة التجريبية للإدارة. سيتم تفعيل التوجيه المباشر لمركز الخدمة بعد اعتماد الإنتاج.') : T('Your request has been submitted to ProPrint.','تم إرسال طلبك إلى ProPrint.')); formElement.reset();
    } catch (error) { setStatus('error'); setMessage(error instanceof Error ? error.message : T('Unable to submit your request.','تعذر إرسال طلبك.')); }
  }

  const guidance = service === 'pickup'
    ? { icon: Truck, title: T('Request a Kuwait pickup','طلب استلام داخل الكويت'), text: T('Enter the collection address, Google Maps location, equipment and preferred date. ProPrint will confirm pickup availability, timing and any applicable charge before dispatch.','أدخل عنوان الاستلام ورابط Google Maps والجهاز والتاريخ المفضل. ستؤكد ProPrint توفر الاستلام والموعد وأي رسوم قبل الإرسال.') }
    : service === 'status'
      ? { icon: PackageSearch, title: T('Request a repair update','طلب تحديث حالة الإصلاح'), text: T('Enter the ProPrint service reference or repair receipt number whenever possible. This demo sends a status enquiry; it does not display live workshop data yet.','أدخل الرقم المرجعي لخدمة ProPrint أو رقم إيصال الإصلاح إن أمكن. ترسل هذه النسخة استفساراً عن الحالة ولا تعرض بيانات الورشة المباشرة بعد.') }
      : { icon: Info, title: T('Warranty assistance','مساعدة الضمان'), text: T('Provide the brand, exact model and serial/product number. Manufacturer warranty eligibility is determined by the manufacturer.','أدخل العلامة التجارية والموديل الدقيق والرقم التسلسلي أو رقم المنتج. أهلية الضمان تحددها الشركة المصنعة.') };
  const GuidanceIcon = guidance.icon;

  return (
    <form onSubmit={submit} dir={ar?'rtl':'ltr'} className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7 md:grid-cols-2">
      <div className="md:col-span-2 rounded-2xl bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-800"><Info className={ar?'ml-2 inline':'mr-2 inline'} size={15}/><b>{T('Management demo:','نسخة تجريبية للإدارة:')}</b> {T('warranty, pickup and repair-status enquiries are request based until the live service system is connected.','استفسارات الضمان والاستلام وحالة الإصلاح تعتمد على الطلبات حتى يتم ربط نظام الخدمة المباشر.')}</div>
      <div className="md:col-span-2 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-[#0b5cff] shadow-sm"><GuidanceIcon size={19}/></div><div><div className="font-black text-slate-900">{guidance.title}</div><p className="mt-1 text-xs leading-5 text-slate-500">{guidance.text}</p></div></div>
      <label className="md:col-span-2 text-sm font-black text-slate-700">{T('Service required','الخدمة المطلوبة')}<select value={service} onChange={(e) => { setService(e.target.value as ServiceKey); setStatus('idle'); setMessage(''); setReference(''); }} className="form-field mt-2 w-full"><option value="warranty">{T('Warranty Support','دعم الضمان')}</option><option value="pickup">{T('Pickup & Delivery','الاستلام والتوصيل')}</option><option value="status">{T('Repair Status','حالة الإصلاح')}</option></select></label>
      <input name="name" required autoComplete="name" className="form-field" placeholder={T('Name / Company *','الاسم / الشركة *')} /><input name="phone" required autoComplete="tel" className="form-field" placeholder={T('Kuwait phone *','رقم الهاتف في الكويت *')} /><input name="email" type="email" autoComplete="email" className="form-field" placeholder={T('Email','البريد الإلكتروني')} /><input name="equipment" className="form-field" placeholder={T('Equipment / exact model','الجهاز / الموديل الدقيق')} />
      {service === 'warranty' && <><input name="brand" className="form-field" placeholder={T('Brand','العلامة التجارية')} /><input name="serial" className="form-field" placeholder={T('Serial / product number','الرقم التسلسلي / رقم المنتج')} /></>}
      {service === 'pickup' && <>
        <input name="area" required className="form-field" placeholder={T('Kuwait area *','المنطقة في الكويت *')} />
        <input name="block" className="form-field" placeholder={T('Block / street','القطعة / الشارع')} />
        <input name="building" className="form-field" placeholder={T('Building / office / floor','المبنى / المكتب / الطابق')} />
        <input name="googleLocation" type="url" inputMode="url" className="form-field" placeholder={T('Google Maps location link','رابط الموقع على Google Maps')} />
        <input name="preferredDate" type="date" className="form-field md:col-span-2" aria-label={T('Preferred pickup date','تاريخ الاستلام المفضل')} />
        <div className="md:col-span-2 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-xs leading-5 text-blue-900"><MapPin className={ar?'ml-2 inline':'mr-2 inline'} size={15}/><b>{T('Google location:','موقع Google:')}</b> {T('Open Google Maps, choose the pickup location, tap Share, copy the link and paste it above. This helps the ProPrint team find the exact collection point.','افتح Google Maps وحدد موقع الاستلام ثم اضغط مشاركة وانسخ الرابط والصقه أعلاه. يساعد ذلك فريق ProPrint في الوصول إلى نقطة الاستلام بدقة.')}</div>
        <div className="md:col-span-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-bold text-slate-600">{T('Pickup is for Kuwait locations only. Availability, timing and charges are confirmed by ProPrint.','خدمة الاستلام متاحة للمواقع داخل الكويت فقط. تؤكد ProPrint التوفر والموعد والرسوم.')}</div>
      </>}
      {service === 'status' && <><input name="serviceReference" required className="form-field md:col-span-2" placeholder={T('ProPrint service reference / repair receipt number *','الرقم المرجعي لخدمة ProPrint / رقم إيصال الإصلاح *')} /><div className="md:col-span-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900"><b>{T('No reference?','ليس لديك رقم مرجعي؟')}</b> {T('Enter your phone number above and explain when the equipment was submitted, the device model and any name/company shown on the receipt. ProPrint can use those details to identify the job.','أدخل رقم هاتفك أعلاه واذكر متى تم تسليم الجهاز وموديله والاسم أو الشركة الظاهرة على الإيصال. يمكن لـ ProPrint استخدام هذه البيانات لتحديد طلب الصيانة.')}</div></>}
      <textarea name="message" required className="form-field min-h-32 md:col-span-2" placeholder={service === 'warranty' ? T('Tell us what warranty support you need','أخبرنا بنوع دعم الضمان الذي تحتاجه') : service === 'pickup' ? T('Describe the device, fault, quantity and any collection instructions','صف الجهاز والعطل والكمية وأي تعليمات للاستلام') : T('Tell us what repair update you need or add identifying details','أخبرنا بالتحديث المطلوب عن الإصلاح أو أضف بيانات تساعد على تحديد الطلب')} />
      <button type="submit" disabled={status === 'sending'} className="rounded-full bg-[#0b5cff] px-6 py-3.5 font-black text-white transition hover:bg-[#084bcf] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 md:col-span-2 disabled:opacity-60">{status === 'sending' ? <><Loader2 className={ar?'ml-2 inline animate-spin':'mr-2 inline animate-spin'} size={17}/>{T('Submitting...','جارٍ الإرسال...')}</> : service === 'pickup' ? T('Request Pickup Confirmation','طلب تأكيد الاستلام') : service === 'status' ? T('Request Repair Status Update','طلب تحديث حالة الإصلاح') : T('Submit Warranty Support Request','إرسال طلب دعم الضمان')}</button>
      {(status === 'success' || status === 'error') && <div aria-live="polite" className={`md:col-span-2 rounded-2xl p-4 text-sm ${status === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}>{status === 'success' && <CheckCircle2 className={ar?'ml-2 inline':'mr-2 inline'} size={17}/>} {message}{reference && <div className="mt-2 font-black">{T('Reference','الرقم المرجعي')}: {reference}</div>}</div>}
    </form>
  );
}
