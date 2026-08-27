'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { ProductVisual } from '@/components/ProductVisual';
import type { Product } from '@/data/catalog';

type CartItem = { slug:string; quantity:number };
const CART_KEY = 'proprint-cart-v1';

function parsePrice(price:string){
  const match=price.match(/KD\s*([0-9.]+)/i);
  return match?Number(match[1]):null;
}

export function CartClient({ products }:{ products:Product[] }){
  const [items,setItems]=useState<CartItem[]>([]);
  const [loaded,setLoaded]=useState(false);

  useEffect(()=>{
    try{
      const raw=window.localStorage.getItem(CART_KEY);
      setItems(raw?JSON.parse(raw):[]);
    }catch{setItems([]);}
    setLoaded(true);
  },[]);

  function save(next:CartItem[]){
    setItems(next);
    window.localStorage.setItem(CART_KEY,JSON.stringify(next));
    window.dispatchEvent(new Event('proprint-cart-updated'));
  }

  function change(slug:string,delta:number){
    const next=items.map(item=>item.slug===slug?{...item,quantity:item.quantity+delta}:item).filter(item=>item.quantity>0);
    save(next);
  }

  function remove(slug:string){save(items.filter(item=>item.slug!==slug));}

  const lines=useMemo(()=>items.map(item=>({item,product:products.find(p=>p.slug===item.slug)})).filter(line=>line.product) as {item:CartItem;product:Product}[],[items,products]);
  const subtotal=lines.reduce((sum,{item,product})=>{const value=parsePrice(product.price);return sum+(value??0)*item.quantity;},0);
  const hasQuoteOnly=lines.some(({product})=>parsePrice(product.price)===null);

  if(!loaded) return <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-sm text-slate-500">Loading cart…</div>;

  if(!lines.length) return <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
    <ShoppingCart className="text-[#0b5cff]" size={34}/><h2 className="mt-4 text-2xl font-black">Your cart is empty</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Add products from the shop to see them here. This demo cart persists on this device until you clear it.</p><Link href="/shop" className="mt-7 inline-flex items-center rounded-full bg-[#061321] px-6 py-3 font-black text-white">Continue Shopping <ArrowRight className="ml-2" size={16}/></Link>
  </div>;

  return <div className="space-y-4">{lines.map(({item,product})=>{
    const unit=parsePrice(product.price);
    return <div key={product.slug} className="grid gap-5 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[150px_1fr_auto] sm:items-center">
      <div className="overflow-hidden rounded-2xl border border-slate-100"><ProductVisual icon={product.icon} image={product.image} imageAlt={product.imageAlt||product.name} compact/></div>
      <div><div className="text-[10px] font-black uppercase tracking-[.14em] text-slate-400">{product.brand} • {product.category}</div><Link href={`/products/${product.slug}`} className="mt-1 block text-lg font-black text-slate-900 hover:text-[#0b5cff]">{product.name}</Link><div className="mt-2 text-sm font-black">{product.price}</div><div className="mt-4 inline-flex items-center rounded-full border border-slate-200"><button onClick={()=>change(product.slug,-1)} className="p-2.5" aria-label="Decrease quantity"><Minus size={14}/></button><span className="min-w-10 text-center text-sm font-black">{item.quantity}</span><button onClick={()=>change(product.slug,1)} className="p-2.5" aria-label="Increase quantity"><Plus size={14}/></button></div></div>
      <div className="flex items-center justify-between gap-4 sm:block sm:text-right"><div className="font-black">{unit!==null?`KD ${(unit*item.quantity).toFixed(3)}`:'Quote'}</div><button onClick={()=>remove(product.slug)} className="mt-3 inline-flex items-center gap-1 text-xs font-black text-red-600"><Trash2 size={14}/>Remove</button></div>
    </div>})}
    <div className="rounded-[1.5rem] bg-slate-100 p-6"><div className="flex items-center justify-between text-sm text-slate-500"><span>Indicative subtotal</span><span className="text-xl font-black text-slate-900">KD {subtotal.toFixed(3)}</span></div>{hasQuoteOnly&&<p className="mt-2 text-xs text-slate-500">Quote-only products are not included in the numeric subtotal.</p>}</div>
  </div>;
}
