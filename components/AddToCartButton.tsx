'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/data/catalog';

type CartItem = { slug:string; quantity:number };
const CART_KEY = 'proprint-cart-v1';

function maxQuantity(product:Product){
  if((product.stock==='In stock'||product.stock==='Low stock')&&typeof product.stockQuantity==='number') return Math.max(0,product.stockQuantity);
  return null;
}

export function AddToCartButton({ product }: { product:Product }) {
  const pathname=usePathname(); const ar=pathname==='/ar'||pathname.startsWith('/ar/');
  const router = useRouter();
  const [limitReached,setLimitReached]=useState(false);

  function addToCart() {
    const raw = window.localStorage.getItem(CART_KEY);
    let items: CartItem[] = [];
    try { items = raw ? JSON.parse(raw) : []; } catch { items = []; }

    const max=maxQuantity(product);
    const existing = items.find((item) => item.slug === product.slug);
    const current=Math.max(0,Number(existing?.quantity)||0);
    if(max!==null&&current>=max){
      setLimitReached(true);
      window.setTimeout(()=>setLimitReached(false),1800);
      return;
    }

    if (existing) existing.quantity = max===null?current+1:Math.min(current+1,max);
    else items.push({ slug: product.slug, quantity: 1 });

    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('proprint-cart-updated'));
    router.push(ar?'/ar/cart':'/cart');
  }

  return <button onClick={addToCart} className="rounded-full bg-[#f47b20] px-6 py-3.5 font-black text-white shadow-sm transition hover:-translate-y-0.5">
    <ShoppingCart className="mr-2 inline" size={17}/>{limitReached?(ar?'تم بلوغ حد المخزون':'Stock Limit Reached'):(ar?'أضف إلى السلة':'Add to Cart')}
  </button>;
}
