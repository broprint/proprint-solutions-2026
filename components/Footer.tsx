'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clock3, Mail, MapPin, Phone } from 'lucide-react';

export function Footer(){
  const pathname=usePathname();
  const ar=pathname==='/ar'||pathname.startsWith('/ar/');
  const href=(path:string)=>ar?`/ar${path}`:path;
  const T=(en:string,arabic:string)=>ar?arabic:en;
  return <footer className="bg-[#061321] text-white" dir={ar?'rtl':'ltr'}>
  <div className="border-b border-white/10 bg-white/[.03]">
    <div className="container grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className="flex gap-3"><MapPin className="mt-0.5 shrink-0 text-[#57a7ff]" size={18}/><div><b className="text-sm">{T('Service Center','مركز الصيانة')}</b><p className="mt-1 text-xs leading-5 text-slate-400">{T('Galleria Building 57, behind Lulu, Mezzanine Office No. 1, Gate #3, Al-Dajeej 13095, Kuwait','مبنى جاليريا 57، خلف لولو، الميزانين مكتب رقم 1، بوابة رقم 3، الضجيج 13095، الكويت')}</p></div></div>
      <div className="flex gap-3"><Phone className="mt-0.5 shrink-0 text-[#57a7ff]" size={18}/><div><b className="text-sm">{T('Call ProPrint','اتصل بـ ProPrint')}</b><p className="mt-1 text-xs leading-5 text-slate-400" dir="ltr">+965 24333201</p></div></div>
      <div className="flex gap-3"><Mail className="mt-0.5 shrink-0 text-[#57a7ff]" size={18}/><div><b className="text-sm">{T('Email Support','البريد الإلكتروني للدعم')}</b><p className="mt-1 text-xs leading-5 text-slate-400" dir="ltr">support@proprintsolutions.net</p></div></div>
      <div className="flex gap-3"><Clock3 className="mt-0.5 shrink-0 text-[#57a7ff]" size={18}/><div><b className="text-sm">{T('Working Hours','ساعات العمل')}</b><p className="mt-1 text-xs leading-5 text-slate-400">{T('Sunday–Thursday: 8:00 AM–5:00 PM','الأحد–الخميس: 8:00 ص–5:00 م')}<br/>{T('Saturday: 8:00 AM–1:00 PM','السبت: 8:00 ص–1:00 م')}<br/>{T('Friday: Closed','الجمعة: مغلق')}</p></div></div>
    </div>
  </div>
  <div className="container grid gap-10 py-14 md:grid-cols-5">
    <div className="md:col-span-1"><div className="rounded-2xl bg-white p-3 inline-block"><img src="/proprint-logo.png" alt="ProPrint Solutions" className="w-[175px]"/></div><p className="mt-4 max-w-xs text-sm leading-6 text-slate-300">{T('Technology products, printing solutions, infrastructure and technical services for Kuwait.','منتجات تقنية وحلول طباعة وبنية تحتية وخدمات فنية في الكويت.')}</p><div className="mt-4 flex gap-4 text-xs font-bold text-slate-400"><Link href={href('/about')}>{T('About','من نحن')}</Link><Link href={href('/contact')}>{T('Contact','اتصل بنا')}</Link></div></div>
    <div><h3 className="font-bold">{T('Products','المنتجات')}</h3><div className="mt-4 space-y-2 text-sm text-slate-300"><Link className="block" href={href('/shop')}>{T('Laptops & PCs','أجهزة اللابتوب والكمبيوتر')}</Link><Link className="block" href={href('/shop')}>{T('Printers & Plotters','الطابعات والبلوتر')}</Link><Link className="block" href={href('/shop')}>{T('Networking','الشبكات')}</Link><Link className="block" href={href('/shop')}>{T('Servers & Storage','الخوادم والتخزين')}</Link><Link className="block" href={href('/shop')}>{T('Accessories','الإكسسوارات')}</Link></div></div>
    <div><h3 className="font-bold">{T('Services','الخدمات')}</h3><div className="mt-4 space-y-2 text-sm text-slate-300"><Link className="block" href={href('/service')}>{T('Service Center','مركز الصيانة')}</Link><Link className="block" href={href('/amc')}>{T('AMC','عقود الصيانة')}</Link><Link className="block" href={href('/enterprise')}>{T('Enterprise Field Services','خدمات تقنية المعلومات للشركات')}</Link><Link className="block" href={href('/quote')}>{T('Business Quote','عرض سعر للشركات')}</Link></div></div>
    <div><h3 className="font-bold">{T('Customer Care','خدمة العملاء')}</h3><div className="mt-4 space-y-2 text-sm text-slate-300"><Link className="block" href={ar?"/ar/customer-care?service=warranty":"/customer-care?service=warranty"}>{T('Warranty Support','دعم الضمان')}</Link><Link className="block" href={ar?"/ar/customer-care?service=pickup":"/customer-care?service=pickup"}>{T('Pickup & Delivery','الاستلام والتوصيل')}</Link><Link className="block" href={ar?"/ar/customer-care?service=status":"/customer-care?service=status"}>{T('Repair Status','حالة الإصلاح')}</Link><Link className="block" href={href('/service')}>{T('Book a Repair','احجز خدمة إصلاح')}</Link></div></div>
    <div><h3 className="font-bold">{T('Contact','اتصل بنا')}</h3><div className="mt-4 space-y-2 text-sm text-slate-300"><p>{T('Galleria Building 57, behind Lulu, Mezzanine Office No. 1, Gate #3, Al-Dajeej 13095, Kuwait','مبنى جاليريا 57، خلف لولو، الميزانين مكتب رقم 1، بوابة رقم 3، الضجيج 13095، الكويت')}</p><p dir="ltr">+965 24333201</p><p dir="ltr">support@proprintsolutions.net</p><Link className="inline-block pt-3 font-bold text-white" href={href('/contact')}>{T('Contact ProPrint →','تواصل مع ProPrint ←')}</Link></div></div>
  </div>
  <div className="border-t border-white/10"><div className="container flex flex-col gap-2 py-5 text-xs text-slate-400 md:flex-row md:justify-between"><span>{T('© 2026 ProPrint Solutions. All rights reserved.','© 2026 ProPrint Solutions. جميع الحقوق محفوظة.')}</span><span>{T('Technology • Printing • Infrastructure • Service','التقنية • الطباعة • البنية التحتية • الخدمات')}</span></div></div>
</footer>}