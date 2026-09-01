'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ChevronDown, PackageCheck, ShieldCheck } from 'lucide-react';
import type { Product } from '@/data/catalog';
import { ProductVisual } from './ProductVisual';
import { ShopAddToCartButton } from './ShopAddToCartButton';

const SPEC_PREVIEW_COUNT = 5;

export function ProductCard({ product }: { product:Product }) {
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const quoteOnly = product.priceOnRequest || product.stock === 'Quote only' || product.price.toLowerCase().includes('quote');
  const inStock = (product.stock === 'In stock' || product.stock === 'Low stock') && (product.stockQuantity ?? 0) > 0;
  const orderable = product.stock === 'Available on order';
  const canBuy = !quoteOnly && (inStock || orderable);
  const available = product.stock || (quoteOnly ? 'Quote only' : 'Available');
  const availabilityClass = product.stock === 'Out of stock' || product.stock === 'Request availability'
    ? 'text-slate-500'
    : product.stock === 'Low stock' || product.stock === 'Available on order'
      ? 'text-amber-600'
      : 'text-emerald-600';
  const needsEnquiry = quoteOnly || product.stock === 'Request availability' || product.stock === 'Out of stock';
  const hasMoreSpecs = product.specs.length > SPEC_PREVIEW_COUNT;
  const visibleSpecs = showAllSpecs ? product.specs : product.specs.slice(0, SPEC_PREVIEW_COUNT);

  return <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
    <div className="relative">
      <ProductVisual icon={product.icon} image={product.image} imageAlt={product.imageAlt || product.name}/>
      {product.badge && <span className="absolute left-4 top-4 z-30 rounded-full bg-white px-3 py-1 text-[9px] font-black tracking-widest text-[#0b5cff] shadow-sm">{product.badge}</span>}
    </div>
    <div className="flex flex-1 flex-col p-5">
      <div className="flex min-h-8 items-start justify-between gap-3"><div className="text-[10px] font-black uppercase tracking-[.14em] text-slate-400">{product.brand} • {product.category}</div><span className={`flex shrink-0 items-center gap-1 text-[10px] font-black ${availabilityClass}`}><CheckCircle2 size={12}/>{available}{inStock && product.stockQuantity!==undefined ? ` · ${product.stockQuantity}` : ''}</span></div>
      <h3 className="mt-2 min-h-[4.5rem] text-[17px] font-black leading-6 text-slate-900">{product.name}</h3>

      <div className="mt-2 min-h-[10.75rem] border-t border-slate-100 pt-3">
        <ul className="space-y-1 text-sm leading-5 text-slate-500">
          {visibleSpecs.map((spec, index) => <li key={`${spec}-${index}`} className="before:mr-2 before:content-['•']">{spec}</li>)}
        </ul>
        {hasMoreSpecs && <button type="button" onClick={()=>setShowAllSpecs(value=>!value)} className="mt-2 inline-flex items-center gap-1 text-xs font-black text-[#0b5cff] hover:text-[#084bcf]" aria-expanded={showAllSpecs}>{showAllSpecs ? 'See less' : 'See more'} <ChevronDown size={14} className={`transition-transform ${showAllSpecs ? 'rotate-180' : ''}`}/></button>}
      </div>

      <div className="mt-auto">
        {product.sku && <div className="mt-3 min-h-4 text-[9px] font-bold uppercase tracking-wider text-slate-400">SKU: {product.sku}</div>}
        {!product.sku && <div className="mt-3 min-h-4" />}
        <div className="mt-3 flex min-h-7 flex-wrap gap-2 text-[10px] font-bold text-slate-500"><span className="rounded-full bg-slate-100 px-2.5 py-1"><ShieldCheck className="mr-1 inline" size={11}/>Support</span><span className="rounded-full bg-slate-100 px-2.5 py-1"><PackageCheck className="mr-1 inline" size={11}/>Delivery</span></div>
        <div className="mt-5 min-h-12"><div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{quoteOnly?'Business pricing':'Price'}</div><b className="mt-1 block text-lg">{product.price}</b></div>
        <div className="mt-4 grid min-h-10 grid-cols-2 items-stretch gap-2">
          {canBuy && <ShopAddToCartButton product={product} className="w-full justify-center whitespace-nowrap px-2"/>}
          {needsEnquiry && <Link href={`/products/${product.slug}`} className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-full border border-[#0b5cff] bg-white px-2 py-2.5 text-[11px] font-black text-[#0b5cff] transition hover:bg-blue-50">{quoteOnly ? 'Request Price' : 'Check Availability'} <ArrowRight className="ml-1 shrink-0" size={12}/></Link>}
          <Link href={`/products/${product.slug}`} aria-label={`View details for ${product.name}`} className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-full bg-[#0b5cff] px-2 py-2.5 text-[11px] font-black text-white shadow-sm transition hover:bg-[#084bcf] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b5cff] focus-visible:ring-offset-2">View Details <ArrowRight className="ml-1 shrink-0" size={12}/></Link>
        </div>
      </div>
    </div>
  </article>;
}
