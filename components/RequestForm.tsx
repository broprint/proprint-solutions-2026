'use client';

import { FormEvent, useState } from 'react';
import { usePathname } from 'next/navigation';
import { CheckCircle2, Info, Loader2 } from 'lucide-react';

type Props = {
  mode: 'service' | 'quote';
  product?: string;
  sku?: string;
  requestKind?: 'price' | 'availability' | 'business';
};

export function RequestForm({ mode, product = '', sku = '', requestKind = 'business' }: Props) {
  const pathname = usePathname();
  const ar = pathname === '/ar' || pathname.startsWith('/ar/');
  const T = (en:string, arabic:string) => ar ? arabic : en;
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
      if (!response.ok) throw new Error(result.error || T('Submission failed','فشل إرسال الطلب'));

      setReference(result.reference || '');
      setMessage(result.delivery === 'demo'
        ? T('Demo submission recorded successfully. Email delivery will be enabled after management approval and domain configuration.','تم تسجيل الطلب التجريبي بنجاح. سيتم تفعيل إرسال البريد الإلكتروني بعد موافقة الإدارة وإعداد النطاق.')
        : T('Your request has been submitted successfully.','تم إرسال طلبك بنجاح.'));
      setStatus('success');
      formElement.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : T('Unable to submit your request.','تعذر إرسال طلبك.'));
      setStatus('error');
    }
  }

  const defaultMessage = hasProduct
    ? requestKind === 'availability'
      ? T(`Please confirm availability and expected delivery for ${product}${sku ? ` (${sku})` : ''}.`,`يرجى تأكيد توفر ${product}${sku ? ` (${sku})` : ''} وموعد التوصيل المتوقع.`)
      : T(`Please provide pricing and availability for ${product}${sku ? ` (${sku})` : ''}.`,`يرجى تزويدي بالسعر ومدى توفر ${product}${sku ? ` (${sku})` : ''}.`)
    : undefined;

  return <form onSubmit={submit} className="grid gap-4 rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm sm:p-7 md:grid-cols-2">
    <div className="md:col-span-2 rounded-2xl bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-800"><Info className={ar?'ml-2 inline':'mr-2 inline'} size={15}/><b>{T('Management demo:','نسخة تجريبية للإدارة:')}</b> {T('submissions generate a reference number now; live email routing will be enabled after domain approval.','يتم الآن إنشاء رقم مرجعي للطلبات، وسيتم تفعيل إرسال البريد الإلكتروني بعد اعتماد النطاق.')}</div>
    {hasProduct && <div className="md:col-span-2 rounded-2xl border border-blue-100 bg-white px-4 py-4"><div className="text-[10px] font-black uppercase tracking-[.16em] text-[#0b5cff]">{T('Selected Product','المنتج المحدد')}</div><div className="mt-1 font-black text-slate-900">{product}</div>{sku && <div className="mt-1 text-xs font-bold text-slate-500">{T('SKU / Model','رمز المنتج / الموديل')}: {sku}</div>}<input type="hidden" name="equipment" value={equipment}/></div>}
    <input name="name" required autoComplete="name" className="form-field" placeholder={isService ? T('Name / Company','الاسم / الشركة') : T('Name','الاسم')} />
    {!isService && <input name="company" autoComplete="organization" className="form-field" placeholder={T('Company','الشركة')} />}
    <input name="phone" required autoComplete="tel" className="form-field" placeholder={T('Phone','الهاتف')} />
    <input name="email" type="email" autoComplete="email" className="form-field" placeholder={T('Email','البريد الإلكتروني')} />
    {isService ? <>
      <input name="equipment" className="form-field md:col-span-2" placeholder={T('Equipment / Model','الجهاز / الموديل')} />
      <select name="requirement" required className="form-field md:col-span-2" defaultValue=""><option value="" disabled>{T('Service type','نوع الخدمة')}</option><option value="Printer / MFP">{T('Printer / MFP','طابعة / جهاز متعدد الوظائف')}</option><option value="Plotter / Wide Format">{T('Plotter / Wide Format','بلوتر / طباعة كبيرة الحجم')}</option><option value="Laptop / Desktop">{T('Laptop / Desktop','لابتوب / كمبيوتر مكتبي')}</option><option value="Onsite IT Support">{T('Onsite IT Support','دعم IT في الموقع')}</option><option value="AMC Support">{T('AMC Support','دعم عقد الصيانة')}</option><option value="Other Hardware">{T('Other Hardware','جهاز آخر')}</option></select>
    </> : <>
      <select name="requirement" required className="form-field md:col-span-2" defaultValue={requirementDefault}><option value="" disabled>{T('Select requirement','اختر المتطلب')}</option><option value="Product Purchase">{T('Product Purchase','شراء منتجات')}</option><option value="Product Price Request">{T('Product Price Request','طلب سعر منتج')}</option><option value="Product Availability">{T('Product Availability','التحقق من توفر المنتج')}</option><option value="Corporate / Bulk Procurement">{T('Corporate / Bulk Procurement','مشتريات الشركات والكميات')}</option><option value="Printing & Plotting Solution">{T('Printing & Plotting Solution','حلول الطباعة والبلوتر')}</option><option value="AMC">{T('AMC','عقود الصيانة')}</option><option value="Service Center">{T('Service Center','مركز الصيانة')}</option><option value="Enterprise IT / Field Services">{T('Enterprise IT / Field Services','تقنية المعلومات والخدمات الميدانية للشركات')}</option></select>
      <input name="quantity" className="form-field md:col-span-2" placeholder={hasProduct ? T('Quantity required (optional)','الكمية المطلوبة (اختياري)') : T('Estimated quantity / number of assets (optional)','الكمية التقديرية / عدد الأجهزة (اختياري)')} />
    </>}
    <textarea name="message" required className="form-field min-h-36 md:col-span-2" defaultValue={defaultMessage} placeholder={isService ? T('Describe the issue','صف المشكلة') : T('Tell us about products, locations, equipment, support scope or project requirements','أخبرنا عن المنتجات أو المواقع أو الأجهزة أو نطاق الدعم أو متطلبات المشروع')} />
    <button type="submit" disabled={status==='sending'} className={`rounded-full px-6 py-3.5 font-black text-white md:col-span-2 ${isService?'bg-[#0b5cff]':'bg-[#f47b20]'} disabled:cursor-not-allowed disabled:opacity-60`}>
      {status==='sending' ? <><Loader2 className={ar?'ml-2 inline animate-spin':'mr-2 inline animate-spin'} size={17}/>{T('Submitting...','جارٍ الإرسال...')}</> : isService ? T('Submit Service Request','إرسال طلب الصيانة') : requestKind === 'availability' ? T('Submit Availability Request','إرسال طلب التوفر') : requestKind === 'price' ? T('Submit Price Request','إرسال طلب السعر') : T('Submit Quote Request','إرسال طلب عرض السعر')}
    </button>
    {(status==='success'||status==='error') && <div aria-live="polite" className={`md:col-span-2 rounded-2xl p-4 text-sm ${status==='success'?'bg-emerald-50 text-emerald-800':'bg-red-50 text-red-700'}`}>
      {status==='success' && <CheckCircle2 className={ar?'ml-2 inline':'mr-2 inline'} size={17}/>} {message}
      {reference && <div className="mt-2 font-black">{T('Reference','الرقم المرجعي')}: {reference}</div>}
    </div>}
  </form>;
}
