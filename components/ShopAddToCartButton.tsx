'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '@/data/catalog';

type CartItem = { slug: string; quantity: number };
const CART_KEY = 'proprint-cart-v1';

export function ShopAddToCartButton({ product }: { product: Product }) {
  const [added, setAdded] = useState(false);

  function addToCart() {
    const raw = window.localStorage.getItem(CART_KEY);
    let items: CartItem[] = [];
    try { items = raw ? JSON.parse(raw) : []; } catch { items = []; }

    const existing = items.find((item) => item.slug === product.slug);
    if (existing) existing.quantity += 1;
    else items.push({ slug: product.slug, quantity: 1 });

    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
    window.dispatchEvent(new Event('proprint-cart-updated'));
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  }

  return <button type="button" onClick={addToCart} className="inline-flex items-center rounded-full bg-[#f47b20] px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-[#dc6815]">
    <ShoppingCart className="mr-1.5" size={14}/>{added ? 'Added to Cart' : 'Add to Cart'}
  </button>;
}
