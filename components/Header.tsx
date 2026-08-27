"use client";
import Link from 'next/link';
import { Menu, Search, ShoppingCart, X } from 'lucide-react';
import { useState } from 'react';

const nav = [
  ['Products','/#products'],['Solutions','/#solutions'],['Services','/service'],['AMC','/amc'],['Enterprise IT','/enterprise'],['Brands','/#brands'],['About','/about'],['Contact','/contact']
];

export function Header(){
 const [open,setOpen]=useState(false);
 return <>
  <div className="bg-[#061321] text-white"><div className="container flex min-h-9 items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-[.13em]"><span>Technology • Printing • Infrastructure • Service</span><span className="hidden sm:block text-slate-300">Kuwait-wide sales & support</span></div></div>
  <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
   <div className="container flex min-h-[76px] items-center gap-3 sm:gap-5">
    <Link href="/" className="shrink-0" aria-label="ProPrint Solutions home"><img src="/proprint-logo.png" alt="ProPrint Solutions" className="h-auto w-[155px] object-contain sm:w-[188px]"/></Link>
    <nav className="hidden flex-1 items-center justify-center gap-4 text-[12px] font-bold text-slate-700 xl:flex xl:gap-5 xl:text-[13px]">{nav.map(([label,href])=><Link key={label} href={href} className="transition hover:text-[#0b5cff]">{label}</Link>)}</nav>
    <div className="ml-auto flex items-center gap-2">
      <div className="hidden h-11 w-56 items-center rounded-full border border-slate-200 bg-slate-50 px-4 2xl:flex"><Search size={17} className="text-slate-400"/><input aria-label="Search products" className="w-full bg-transparent px-2 text-sm outline-none" placeholder="Search products..."/></div>
      <Link href="/quote" className="hidden rounded-full border border-slate-200 px-4 py-3 text-sm font-black text-slate-800 transition hover:border-[#0b5cff] hover:text-[#0b5cff] lg:inline-flex">Request Quote</Link>
      <Link href="/shop" className="hidden rounded-full bg-[#f47b20] px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 sm:inline-flex">Shop Online</Link>
      <Link href="/cart" aria-label="Cart" className="hidden rounded-xl border border-slate-200 p-2.5 md:block"><ShoppingCart size={19}/></Link>
      <button aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(!open)} className="rounded-xl border border-slate-200 p-2.5 xl:hidden">{open?<X size={21}/>:<Menu size={21}/>}</button>
    </div>
   </div>
   <div className="hidden border-t border-slate-100 lg:block"><div className="container flex h-11 items-center gap-7 overflow-x-auto whitespace-nowrap text-[11px] font-black uppercase tracking-[.08em] text-slate-600"><Link href="/shop">Computers</Link><Link href="/shop">Printing</Link><Link href="/shop">Plotters</Link><Link href="/shop">Networking</Link><Link href="/shop">Servers & Storage</Link><Link href="/shop">Accessories</Link><Link href="/service">Service Center</Link><Link href="/amc">AMC</Link><Link href="/enterprise">Enterprise IT</Link></div></div>
   {open&&<div className="border-t bg-white xl:hidden"><div className="container grid gap-1 py-4 text-sm font-bold">{nav.map(([label,href])=><Link onClick={()=>setOpen(false)} className="rounded-xl px-3 py-3 hover:bg-slate-50" key={label} href={href}>{label}</Link>)}<div className="mt-3 grid grid-cols-2 gap-2"><Link onClick={()=>setOpen(false)} className="rounded-xl bg-[#0b5cff] px-3 py-3 text-center text-white" href="/quote">Request Quote</Link><Link onClick={()=>setOpen(false)} className="rounded-xl bg-[#f47b20] px-3 py-3 text-center text-white" href="/shop">Shop Online</Link></div><Link onClick={()=>setOpen(false)} className="mt-1 rounded-xl border border-slate-200 px-3 py-3 text-center" href="/cart">View Cart</Link></div></div>}
  </header>
 </>;
}
