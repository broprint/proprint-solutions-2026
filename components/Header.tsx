"use client";
import Link from 'next/link';
import { Menu, Search, ShoppingCart, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { products } from '@/data/catalog';

const nav = [
  ['Products','/#products'],['Solutions','/#solutions'],['Services','/service'],['AMC','/amc'],['Enterprise IT','/enterprise'],['Brands','/#brands'],['About','/about'],['Contact','/contact']
];

const CART_KEY = 'proprint-cart-v1';
type CartItem = { slug:string; quantity:number };

function readCartCount() {
  if (typeof window === 'undefined') return 0;
  try {
    const items: CartItem[] = JSON.parse(window.localStorage.getItem(CART_KEY) || '[]');
    return items.reduce((total, item) => total + Math.max(0, Number(item.quantity) || 0), 0);
  } catch {
    return 0;
  }
}

export function Header(){
 const [open,setOpen]=useState(false);
 const [cartCount,setCartCount]=useState(0);
 const [searchQuery,setSearchQuery]=useState('');
 const [searchOpen,setSearchOpen]=useState(false);

 const searchResults=useMemo(()=>{
   const q=searchQuery.trim().toLowerCase();
   if(!q) return [];
   return products.filter(product=>[
     product.name,
     product.brand,
     product.category,
     product.sku || '',
     ...product.specs,
   ].join(' ').toLowerCase().includes(q)).slice(0,6);
 },[searchQuery]);

 useEffect(()=>{
   const sync=()=>setCartCount(readCartCount());
   sync();
   window.addEventListener('proprint-cart-updated',sync);
   window.addEventListener('storage',sync);
   return ()=>{
     window.removeEventListener('proprint-cart-updated',sync);
     window.removeEventListener('storage',sync);
   };
 },[]);

 const closeSearch=()=>{
   setSearchOpen(false);
   setSearchQuery('');
 };

 return <>
  <div className="bg-[#061321] text-white"><div className="container flex min-h-9 items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-[.13em]"><span>Technology • Printing • Infrastructure • Service</span><span className="hidden sm:block text-slate-300">Kuwait-wide sales & support</span></div></div>
  <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
   <div className="container flex min-h-[76px] items-center gap-3 sm:gap-5">
    <Link href="/" className="shrink-0" aria-label="ProPrint Solutions home"><img src="/proprint-logo.png" alt="ProPrint Solutions" className="h-auto w-[155px] object-contain sm:w-[188px]"/></Link>
    <nav className="hidden flex-1 items-center justify-center gap-4 whitespace-nowrap text-[12px] font-bold text-slate-700 xl:flex xl:gap-5 xl:text-[13px]">{nav.map(([label,href])=><Link key={label} href={href} className="shrink-0 transition hover:text-[#0b5cff]">{label}</Link>)}</nav>
    <div className="ml-auto flex items-center gap-2">
      <div className="relative hidden 2xl:block">
        <div className="flex h-11 w-56 items-center rounded-full border border-slate-200 bg-slate-50 px-4 transition focus-within:border-blue-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100">
          <Search size={17} className="shrink-0 text-slate-400"/>
          <input
            aria-label="Search products"
            value={searchQuery}
            onChange={e=>{setSearchQuery(e.target.value);setSearchOpen(true)}}
            onFocus={()=>setSearchOpen(true)}
            onKeyDown={e=>{if(e.key==='Escape')setSearchOpen(false)}}
            className="w-full bg-transparent px-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            placeholder="Search products..."
            autoComplete="off"
          />
          {searchQuery&&<button type="button" onClick={closeSearch} aria-label="Clear product search" className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700"><X size={14}/></button>}
        </div>
        {searchOpen&&searchQuery.trim()&&<div className="absolute right-0 top-[calc(100%+10px)] z-[70] w-[360px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/15">
          {searchResults.length>0?<>
            <div className="border-b border-slate-100 px-4 py-2.5 text-[10px] font-black uppercase tracking-[.14em] text-slate-400">Product matches</div>
            <div className="max-h-[360px] overflow-y-auto">
              {searchResults.map(product=><Link key={product.slug} href={`/products/${product.slug}`} onClick={closeSearch} className="block border-b border-slate-100 px-4 py-3 transition last:border-0 hover:bg-blue-50">
                <div className="flex items-start justify-between gap-3">
                  <div><div className="text-sm font-black text-slate-900">{product.name}</div><div className="mt-1 text-xs text-slate-500">{product.brand} • {product.category}</div><div className="mt-1 text-[11px] text-slate-400">{product.specs.slice(0,3).join(' • ')}</div></div>
                  <div className="shrink-0 text-xs font-black text-[#0b5cff]">View</div>
                </div>
              </Link>)}
            </div>
            <Link href="/shop" onClick={closeSearch} className="block bg-slate-50 px-4 py-3 text-center text-xs font-black text-[#0b5cff] transition hover:bg-blue-50">Browse all products →</Link>
          </>:<div className="p-5 text-center"><div className="text-sm font-black text-slate-900">No matching products found</div><p className="mt-1 text-xs leading-5 text-slate-500">Try a brand, category, model or specification.</p><Link href="/shop" onClick={closeSearch} className="mt-3 inline-flex rounded-full bg-[#0b5cff] px-4 py-2 text-xs font-black text-white">Browse Shop</Link></div>}
        </div>}
      </div>
      <Link href="/quote" className="hidden rounded-full border border-slate-200 px-4 py-3 text-sm font-black text-slate-800 transition hover:border-[#0b5cff] hover:text-[#0b5cff] lg:inline-flex">Request Quote</Link>
      <Link href="/shop" className="hidden rounded-full bg-[#f47b20] px-5 py-3 text-sm font-black text-white shadow-lg shadow-orange-500/20 transition hover:-translate-y-0.5 sm:inline-flex">Shop Online</Link>
      <Link href="/cart" aria-label={`Cart with ${cartCount} item${cartCount===1?'':'s'}`} className="relative hidden rounded-xl border border-slate-200 p-2.5 md:block">
        <ShoppingCart size={19}/>
        {cartCount>0&&<span className="absolute -right-2 -top-2 grid min-h-5 min-w-5 place-items-center rounded-full bg-[#f47b20] px-1 text-[10px] font-black leading-none text-white shadow-sm">{cartCount>99?'99+':cartCount}</span>}
      </Link>
      <button aria-label={open?'Close menu':'Open menu'} aria-expanded={open} onClick={()=>setOpen(!open)} className="rounded-xl border border-slate-200 p-2.5 xl:hidden">{open?<X size={21}/>:<Menu size={21}/>}</button>
    </div>
   </div>
   <div className="hidden border-t border-slate-100 lg:block"><div className="container flex h-11 items-center gap-7 overflow-x-auto whitespace-nowrap text-[11px] font-black uppercase tracking-[.08em] text-slate-600"><Link href="/shop">Computers</Link><Link href="/shop">Printing</Link><Link href="/shop">Plotters</Link><Link href="/shop">Networking</Link><Link href="/shop">Servers & Storage</Link><Link href="/shop">Accessories</Link><Link href="/service">Service Center</Link><Link href="/amc">AMC</Link><Link href="/enterprise">Enterprise IT</Link></div></div>
   {open&&<div className="border-t bg-white xl:hidden"><div className="container grid gap-1 py-4 text-sm font-bold">{nav.map(([label,href])=><Link onClick={()=>setOpen(false)} className="rounded-xl px-3 py-3 hover:bg-slate-50" key={label} href={href}>{label}</Link>)}<div className="mt-3 grid grid-cols-2 gap-2"><Link onClick={()=>setOpen(false)} className="rounded-xl bg-[#0b5cff] px-3 py-3 text-center text-white" href="/quote">Request Quote</Link><Link onClick={()=>setOpen(false)} className="rounded-xl bg-[#f47b20] px-3 py-3 text-center text-white" href="/shop">Shop Online</Link></div><Link onClick={()=>setOpen(false)} className="mt-1 rounded-xl border border-slate-200 px-3 py-3 text-center" href="/cart">View Cart{cartCount>0?` (${cartCount})`:''}</Link></div></div>}
  </header>
 </>;
}
