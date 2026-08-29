import Link from 'next/link';
import { Clock3, Mail, MapPin, Phone } from 'lucide-react';

export function Footer(){return <footer className="bg-[#061321] text-white">
  <div className="border-b border-white/10 bg-white/[.03]">
    <div className="container grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
      <div className="flex gap-3"><MapPin className="mt-0.5 shrink-0 text-[#57a7ff]" size={18}/><div><b className="text-sm">Service Center</b><p className="mt-1 text-xs leading-5 text-slate-400">Galleria Building 57, behind Lulu, Mezzanine Office No. 1, Gate #3, Al-Dajeej 13095, Kuwait</p></div></div>
      <div className="flex gap-3"><Phone className="mt-0.5 shrink-0 text-[#57a7ff]" size={18}/><div><b className="text-sm">Call ProPrint</b><p className="mt-1 text-xs leading-5 text-slate-400">+965 24333201</p></div></div>
      <div className="flex gap-3"><Mail className="mt-0.5 shrink-0 text-[#57a7ff]" size={18}/><div><b className="text-sm">Email Support</b><p className="mt-1 text-xs leading-5 text-slate-400">support@proprintsolutions.net</p></div></div>
      <div className="flex gap-3"><Clock3 className="mt-0.5 shrink-0 text-[#57a7ff]" size={18}/><div><b className="text-sm">Working Hours</b><p className="mt-1 text-xs leading-5 text-slate-400">Sunday–Thursday: 8:00 AM–5:00 PM<br/>Saturday: 8:00 AM–1:00 PM<br/>Friday: Closed</p></div></div>
    </div>
  </div>

  <div className="container grid gap-10 py-14 md:grid-cols-5">
    <div className="md:col-span-1"><div className="rounded-2xl bg-white p-3 inline-block"><img src="/proprint-logo.png" alt="ProPrint Solutions" className="w-[175px]"/></div><p className="mt-4 max-w-xs text-sm leading-6 text-slate-300">Technology products, printing solutions, infrastructure and technical services for Kuwait.</p><div className="mt-4 flex gap-4 text-xs font-bold text-slate-400"><Link href="/about">About</Link><Link href="/contact">Contact</Link></div></div>
    <div><h3 className="font-bold">Products</h3><div className="mt-4 space-y-2 text-sm text-slate-300"><Link className="block" href="/shop">Laptops & PCs</Link><Link className="block" href="/shop">Printers & Plotters</Link><Link className="block" href="/shop">Networking</Link><Link className="block" href="/shop">Servers & Storage</Link><Link className="block" href="/shop">Accessories</Link></div></div>
    <div><h3 className="font-bold">Services</h3><div className="mt-4 space-y-2 text-sm text-slate-300"><Link className="block" href="/service">Service Center</Link><Link className="block" href="/amc">AMC</Link><Link className="block" href="/enterprise">Enterprise Field Services</Link><Link className="block" href="/quote">Business Quote</Link></div></div>
    <div><h3 className="font-bold">Customer Care</h3><div className="mt-4 space-y-2 text-sm text-slate-300"><Link className="block" href="/customer-care?service=warranty">Warranty Support</Link><Link className="block" href="/customer-care?service=pickup">Pickup & Delivery</Link><Link className="block" href="/customer-care?service=status">Repair Status</Link><Link className="block" href="/service">Book a Repair</Link></div></div>
    <div><h3 className="font-bold">Contact</h3><div className="mt-4 space-y-2 text-sm text-slate-300"><p>Galleria Building 57, behind Lulu, Mezzanine Office No. 1, Gate #3, Al-Dajeej 13095, Kuwait</p><p>+965 24333201</p><p>support@proprintsolutions.net</p><Link className="inline-block pt-3 font-bold text-white" href="/contact">Contact ProPrint →</Link></div></div>
  </div>
  <div className="border-t border-white/10"><div className="container flex flex-col gap-2 py-5 text-xs text-slate-400 md:flex-row md:justify-between"><span>© 2026 ProPrint Solutions. All rights reserved.</span><span>Technology • Printing • Infrastructure • Service</span></div></div>
</footer>}
