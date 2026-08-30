'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/data/catalog';

type CartItem = { slug: string; quantity: number };
const CART_KEY = 'proprint-cart-v1';

function maxQuantity(product:Product){
  if((product.stock==='In stock'||product.stock==='Low stock')&&typeof product.stockQuantity==='number') return Math.max(0,product.stockQuantity);
  return null;
}

export function ShopAddToCartButton({ product }: { product: Product }) {
  const [status, setStatus] = useState<'idle'|'added'|'limit'>('idle');

  function addToCart() {
    const raw = window.localStorage.getItem(CART_KEY);
    let items: CartItem[] = [];
    try { items = raw ? JSON.parse(raw) : []; } catch { items = []; }

    const max=maxQuantity(product);
    const existing = items.find((item) => item.slug === product.slug);
    const current=Math.max(0,Number(existing?.quantity)||0);
    if(max!==null&&current>=max){
      setStatus('limit');
      window.setTimeout(()=>setStatus('idle'),1800);
      return;
    }

    if (existing) existing.quantity = max===null?current+1:Math.min(current+1,max);
    else items.push({ slug: product.slug, quantity: 1 });

    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('proprint-cart-updated'));
    setStatus('added');
    window.setTimeout(() => setStatus('idle'), 1600);
  }

  return <button type="button" onClick={addToCart} className="inline-flex items-center rounded-full bg-[#f47b20] px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-[#dc6815]">
    <ShoppingCart className="mr-1.5" size={14}/>{status==='added'?'Added to Cart':status==='limit'?'Stock Limit Reached':'Add to Cart'}
  </button>;
}
