import Link from 'next/link';
import { ArrowRight, CheckCircle2, PackageCheck, ShieldCheck } from 'lucide-react';
import type { Product } from '@/data/catalog';
import { ProductVisual } from './ProductVisual';
import { ShopAddToCartButton } from './ShopAddToCartButton';

export function ProductCard({ product }: { product:Product }) {
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

  return <article className="group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
    <div className="relative">
      <ProductVisual icon={product.icon} image={product.image} imageAlt={product.imageAlt || product.name}/>
      {product.badge && <span className="absolute left-4 top-4 z-30 rounded-full bg-white px-3 py-1 text-[9px] font-black tracking-widest text-[#0b5cff] shadow-sm">{product.badge}</span>}
    </div>
    <div className="p-5">
      <div className="flex items-center justify-between gap-3"><div className="text-[10px] font-black uppercase tracking-[.14em] text-slate-400">{product.brand} • {product.category}</div><span className={`flex items-center gap-1 text-[10px] font-black ${availabilityClass}`}><CheckCircle2 size={12}/>{available}{inStock && product.stockQuantity!==undefined ? ` · ${product.stockQuantity}` : ''}</span></div>
      <h3 className="mt-2 min-h-12 text-[17px] font-black leading-6 text-slate-900">{product.name}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{product.specs.join(' • ')}</p>
      {product.sku && <div className="mt-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">SKU: {product.sku}</div>}
      <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold text-slate-500"><span className="rounded-full bg-slate-100 px-2.5 py-1"><ShieldCheck className="mr-1 inline" size={11}/>Support</span><span className="rounded-full bg-slate-100 px-2.5 py-1"><PackageCheck className="mr-1 inline" size={11}/>Delivery</span></div>
      <div className="mt-5"><div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{quoteOnly?'Business pricing':'Price'}</div><b className="mt-1 block text-lg">{product.price}</b></div>
      <div className="mt-4 flex flex-wrap gap-2">
        {canBuy && <ShopAddToCartButton product={product}/>} 
        <Link href={`/products/${product.slug}`} aria-label={`View details for ${product.name}`} className="inline-flex items-center rounded-full bg-[#0b5cff] px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:bg-[#084bcf] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0b5cff] focus-visible:ring-offset-2">{quoteOnly ? 'Request Price' : product.stock === 'Request availability' || product.stock === 'Out of stock' ? 'Check Availability' : 'View Details'} <ArrowRight className="ml-1" size={13}/></Link>
      </div>
    </div>
  </article>;
}
