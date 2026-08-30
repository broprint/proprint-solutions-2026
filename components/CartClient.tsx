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

function hasFiniteStock(product:Product){
  return (product.stock==='In stock'||product.stock==='Low stock') && typeof product.stockQuantity==='number';
}

function maxQuantity(product:Product){
  return hasFiniteStock(product)?Math.max(0,product.stockQuantity??0):null;
}

export function CartClient({ products }:{ products:Product[] }){
  const [items,setItems]=useState<CartItem[]>([]);
  const [loaded,setLoaded]=useState(false);

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

  const lines=useMemo(()=>items.map(item=>({item,product:products.find(p=>p.slug===item.slug)})).filter(line=>line.product) as {item:CartItem;product:Product}[],[items,products]);
  const subtotal=lines.reduce((sum,{item,product})=>{const value=parsePrice(product.price);return sum+(value??0)*item.quantity;},0);
  const hasQuoteOnly=lines.some(({product})=>parsePrice(product.price)===null);

  if(!loaded) return <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-sm text-slate-500">Loading cart…</div>;

  if(!lines.length) return <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
    <ShoppingCart className="text-[#0b5cff]" size={34}/><h2 className="mt-4 text-2xl font-black">Your cart is empty</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">Add products from the shop to see them here. This cart persists on this device until you clear it.</p><Link href="/shop" className="mt-7 inline-flex items-center rounded-full bg-[#061321] px-6 py-3 font-black text-white">Continue Shopping <ArrowRight className="ml-2" size={16}/></Link>
  </div>;

  return <div className="space-y-4">{lines.map(({item,product})=>{
    const unit=parsePrice(product.price);
    const max=maxQuantity(product);
    const atLimit=max!==null&&item.quantity>=max;
    return <div key={product.slug} className="grid gap-5 rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[150px_1fr_auto] sm:items-center">
      <div className="overflow-hidden rounded-2xl border border-slate-100"><ProductVisual icon={product.icon} image={product.image} imageAlt={product.imageAlt||product.name} compact/></div>
      <div><div className="text-[10px] font-black uppercase tracking-[.14em] text-slate-400">{product.brand} • {product.category}</div><Link href={`/products/${product.slug}`} className="mt-1 block text-lg font-black text-slate-900 hover:text-[#0b5cff]">{product.name}</Link><div className="mt-2 text-sm font-black">{product.price}</div>{max!==null&&<div className="mt-1 text-xs font-bold text-slate-500">{max} available</div>}<div className="mt-4 inline-flex items-center rounded-full border border-slate-200"><button onClick={()=>change(product.slug,-1)} className="p-2.5" aria-label="Decrease quantity"><Minus size={14}/></button><span className="min-w-10 text-center text-sm font-black">{item.quantity}</span><button onClick={()=>change(product.slug,1)} disabled={atLimit} className="p-2.5 disabled:cursor-not-allowed disabled:text-slate-300" aria-label={atLimit?'Maximum available quantity reached':'Increase quantity'}><Plus size={14}/></button></div>{atLimit&&<p className="mt-2 text-xs font-bold text-amber-700">Maximum available stock reached.</p>}</div>
      <div className="flex items-center justify-between gap-4 sm:block sm:text-right"><div className="font-black">{unit!==null?`KD ${(unit*item.quantity).toFixed(3)}`:'Quote'}</div><button onClick={()=>remove(product.slug)} className="mt-3 inline-flex items-center gap-1 text-xs font-black text-red-600"><Trash2 size={14}/>Remove</button></div>
    </div>})}
    <div className="rounded-[1.5rem] bg-slate-100 p-6"><div className="flex items-center justify-between text-sm text-slate-500"><span>Indicative subtotal</span><span className="text-xl font-black text-slate-900">KD {subtotal.toFixed(3)}</span></div>{hasQuoteOnly&&<p className="mt-2 text-xs text-slate-500">Quote-only products are not included in the numeric subtotal.</p>}</div>
  </div>;
}
