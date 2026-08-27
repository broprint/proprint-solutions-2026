'use client';

import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/data/catalog';

type CartItem = { slug:string; quantity:number };
const CART_KEY = 'proprint-cart-v1';

export function AddToCartButton({ product }: { product:Product }) {
  const router = useRouter();

  function addToCart() {
    const raw = window.localStorage.getItem(CART_KEY);
    let items: CartItem[] = [];
    try { items = raw ? JSON.parse(raw) : []; } catch { items = []; }

    const existing = items.find((item) => item.slug === product.slug);
    if (existing) existing.quantity += 1;
    else items.push({ slug: product.slug, quantity: 1 });

    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('proprint-cart-updated'));
    router.push('/cart');
  }

  return <button onClick={addToCart} className="rounded-full bg-[#f47b20] px-6 py-3.5 font-black text-white shadow-sm transition hover:-translate-y-0.5">
    <ShoppingCart className="mr-2 inline" size={17}/>Add to Cart
  </button>;
}
