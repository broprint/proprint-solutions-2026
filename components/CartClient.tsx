'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Minus, Plus, Send, ShoppingCart, Trash2 } from 'lucide-react';
import { ProductVisual } from '@/components/ProductVisual';
import type { Product } from '@/data/catalog';

type CartItem = { slug:string; quantity:number };
const CART_KEY = 'proprint-cart-v1';

function parsePrice(price:string){
  const match=price.match(/KD\s*([0-9.]+)/i);
  return match?Number(match[1]):null;
}

function hasFiniteStock(product:Product){
  return (product.stock==='In stock'||product.stock==='Low stock') && typeof product.stockQuantity==='number';
}

function maxQuantity(product:Product){
  return hasFiniteStock(product)?Math.max(0,product.stockQuantity??0):null;
}

export function CartClient({ products }:{ products:Product[] }){
  const [items,setItems]=useState<CartItem[]>([]);
  const [loaded,setLoaded]=useState(false);
  const [submitting,setSubmitting]=useState(false);
  const [submitError,setSubmitError]=useState('');
  const [reference,setReference]=useState('');
  const [delivery,setDelivery]=useState('');

  useEffect(()=>{
    try{
      const raw=window.localStorage.getItem(CART_KEY);
      const parsed:CartItem[]=raw?JSON.parse(raw):[];
      const sanitized=parsed.map(item=>{
        const product=products.find(p=>p.slug===item.slug);
        if(!product)return null;
        const max=maxQuantity(product);
        const requested=Math.max(1,Math.floor(Number(item.quantity)||1));
        return {slug:item.slug,quantity:max===null?requested:Math.min(requested,max)};
      }).filter((item):item is CartItem=>!!item&&item.quantity>0);
      setItems(sanitized);
      if(JSON.stringify(parsed)!==JSON.stringify(sanitized)){
        window.localStorage.setItem(CART_KEY,JSON.stringify(sanitized));
        window.dispatchEvent(new Event('proprint-cart-updated'));
      }
    }catch{setItems([]);}
    setLoaded(true);
  },[products]);

  function save(next:CartItem[]){
    setItems(next);
    window.localStorage.setItem(CART_KEY,JSON.stringify(next));
    window.dispatchEvent(new Event('proprint-cart-updated'));
  }

  function change(slug:string,delta:number){
    const product=products.find(p=>p.slug===slug);
    if(!product)return;
    const max=maxQuantity(product);
    const next=items.map(item=>{
      if(item.slug!==slug)return item;
      const requested=item.quantity+delta;
      return {...item,quantity:max===null?requested:Math.min(requested,max)};
    }).filter(item=>item.quantity>0);
    save(next);
  }

  function remove(slug:string){save(items.filter(item=>item.slug!==slug));}

  async function submitOrder(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    setSubmitting(true);
    setSubmitError('');
    setReference('');
    const form=new FormData(event.currentTarget);
    try{
      const response=await fetch('/api/requests',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          type:'order',
          name:String(form.get('name')||''),
          company:String(form.get('company')||''),
          phone:String(form.get('phone')||''),
          email:String(form.get('email')||''),
          message:String(form.get('message')||''),
          cart:items,
        }),
      });
      const result=await response.json();
      if(!response.ok) throw new Error(result.error||'Unable to submit your request.');
      setReference(result.reference||'Submitted');
      setDelivery(result.delivery||'');
      save([]);
    }catch(error){
      setSubmitError(error instanceof Error?error.message:'Unable to submit your request.');
    }finally{
      setSubmitting(false);
    }
  }

  const lines=useMemo(()=>items.map(item=>({item,product:products.find(p=>p.slug===item.slug)})).filter(line=>line.product) as {item:CartItem;product:Product}[],[items,products]);
  const subtotal=lines.reduce((sum,{item,product})=>{const value=parsePrice(product.price);return sum+(value??0)*item.quantity;},0);
  const hasQuoteOnly=lines.some(({product})=>parsePrice(product.price)===null);

  if(!loaded) return <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-sm text-slate-500">Loading cart…</div>;

  if(reference) return <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-8 shadow-sm">
    <CheckCircle2 className="text-emerald-600" size={38}/><h2 className="mt-4 text-2xl font-black text-slate-900">Request received</h2><p className="mt-3 text-sm leading-7 text-slate-700">Thank you. ProPrint can now review the requested products, confirm final stock, pricing and delivery, and contact you using the details submitted.</p><div className="mt-5 rounded-2xl bg-white p-4 text-sm"><span className="font-bold text-slate-500">Reference</span><div className="mt-1 text-lg font-black text-slate-900">{reference}</div>{delivery==='demo'&&<p className="mt-2 text-xs font-bold text-amber-700">Test mode: live request delivery is not configured yet.</p>}</div><Link href="/shop" className="mt-6 inline-flex items-center rounded-full bg-[#061321] px-6 py-3 font-black text-white">Continue Shopping <ArrowRight className="ml-2" size={16}/></Link>
  </div>;

  if(!lines.length) return <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
    <ShoppingCart className="text-[#0b5cff]" size={34}/><h2 className="mt-4 text-2xl font-black">Your cart is empty</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Add products from the shop to see them here. This cart persists on this device until you clear it.</p><Link href="/shop" className="mt-7 inline-flex items-center rounded-full bg-[#061321] px-6 py-3 font-black text-white">Continue Shopping <ArrowRight className="ml-2" size={16}/></Link>
  </div>;

  return <div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Link href="/shop" className="inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:border-[#0b5cff] hover:text-[#0b5cff]"><ArrowLeft className="mr-2" size={16}/>Continue Shopping</Link>
      <span className="text-xs font-bold text-slate-500">Your cart is saved while you browse.</span>
    </div>
    {lines.map(({item,product})=>{
      const unit=parsePrice(product.price);
      const max=maxQuantity(product);
      const atLimit=max!==null&&item.quantity>=max;
      return <div key={product.slug} className="grid gap-5 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[150px_1fr_auto] sm:items-center">
        <div className="overflow-hidden rounded-2xl border border-slate-100"><ProductVisual icon={product.icon} image={product.image} imageAlt={product.imageAlt||product.name} compact/></div>
        <div><div className="text-[10px] font-black uppercase tracking-[.14em] text-slate-400">{product.brand} • {product.category}</div><Link href={`/products/${product.slug}`} className="mt-1 block text-lg font-black text-slate-900 hover:text-[#0b5cff]">{product.name}</Link><div className="mt-2 text-sm font-black">{product.price}</div>{max!==null&&<div className="mt-1 text-xs font-bold text-slate-500">{max} available</div>}<div className="mt-4 inline-flex items-center rounded-full border border-slate-200"><button onClick={()=>change(product.slug,-1)} className="p-2.5" aria-label="Decrease quantity"><Minus size={14}/></button><span className="min-w-10 text-center text-sm font-black">{item.quantity}</span><button onClick={()=>change(product.slug,1)} disabled={atLimit} className="p-2.5 disabled:cursor-not-allowed disabled:text-slate-300" aria-label={atLimit?'Maximum available quantity reached':'Increase quantity'}><Plus size={14}/></button></div>{atLimit&&<p className="mt-2 text-xs font-bold text-amber-700">Maximum available stock reached.</p>}</div>
        <div className="flex items-center justify-between gap-4 sm:block sm:text-right"><div className="font-black">{unit!==null?`KD ${(unit*item.quantity).toFixed(3)}`:'Quote'}</div><button onClick={()=>remove(product.slug)} className="mt-3 inline-flex items-center gap-1 text-xs font-black text-red-600"><Trash2 size={14}/>Remove</button></div>
      </div>
    })}
    <div className="rounded-[1.5rem] bg-slate-100 p-6"><div className="flex items-center justify-between text-sm text-slate-500"><span>Indicative subtotal</span><span className="text-xl font-black text-slate-900">KD {subtotal.toFixed(3)}</span></div>{hasQuoteOnly&&<p className="mt-2 text-xs text-slate-500">Quote-only products are not included in the numeric subtotal.</p>}</div>

    <form onSubmit={submitOrder} className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="text-[10px] font-black uppercase tracking-[.16em] text-[#0b5cff]">No online payment required</div>
      <h2 className="mt-2 text-2xl font-black text-slate-900">Request Order / Get Final Quote</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Send this cart to ProPrint. We will confirm final stock, price, delivery timing and any installation requirements before processing the order.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-bold text-slate-700">Name *<input name="name" required maxLength={120} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-[#0b5cff]" placeholder="Your name"/></label>
        <label className="text-sm font-bold text-slate-700">Company<input name="company" maxLength={180} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-[#0b5cff]" placeholder="Company name (optional)"/></label>
        <label className="text-sm font-bold text-slate-700">Kuwait Mobile *<input name="phone" required maxLength={60} inputMode="tel" className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-[#0b5cff]" placeholder="+965 ..."/></label>
        <label className="text-sm font-bold text-slate-700">Email<input name="email" type="email" maxLength={180} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-[#0b5cff]" placeholder="name@company.com"/></label>
      </div>
      <label className="mt-4 block text-sm font-bold text-slate-700">Notes<textarea name="message" maxLength={4000} rows={4} className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 font-normal outline-none focus:border-[#0b5cff]" placeholder="Delivery location, preferred timing, installation needs or other notes..."/></label>
      {submitError&&<div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{submitError}</div>}
      <button disabled={submitting} type="submit" className="mt-5 inline-flex items-center rounded-full bg-[#f47b20] px-6 py-3.5 font-black text-white shadow-sm transition hover:bg-[#dc6815] disabled:cursor-not-allowed disabled:opacity-60"><Send className="mr-2" size={17}/>{submitting?'Submitting…':'Send Order / Quote Request'}</button>
      <p className="mt-3 text-xs leading-5 text-slate-500">Submitting this form does not make a payment or automatically reserve stock. ProPrint will confirm the order first.</p>
    </form>

    <div className="pt-1"><Link href="/shop" className="inline-flex items-center rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-800 transition hover:border-[#0b5cff] hover:text-[#0b5cff]"><ArrowLeft className="mr-2" size={16}/>Continue Shopping</Link></div>
  </div>;
}
