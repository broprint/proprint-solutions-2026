import Link from 'next/link';
import { ArrowRight, CheckCircle2, PackageCheck, ShieldCheck } from 'lucide-react';
import type { Product } from '@/data/catalog';
import { ProductVisual } from './ProductVisual';

export function ProductCard({ product }: { product:Product }) {
  const quoteOnly = product.price.toLowerCase().includes('quote');
  const available = product.stock || (quoteOnly ? 'Quote only' : 'Available');
  return <article className="group overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
    <div className="relative">
      <ProductVisual icon={product.icon} image={product.image} imageAlt={product.imageAlt || product.name}/>
      {product.badge && <span className="absolute left-4 top-4 z-30 rounded-full bg-white px-3 py-1 text-[9px] font-black tracking-widest text-[#0b5cff] shadow-sm">{product.badge}</span>}
    </div>
    <div className="p-5">
      <div className="flex items-center justify-between gap-3"><div className="text-[10px] font-black uppercase tracking-[.14em] text-slate-400">{product.brand} • {product.category}</div><span className="flex items-center gap-1 text-[10px] font-black text-emerald-600"><CheckCircle2 size={12}/>{available}</span></div>
      <h3 className="mt-2 min-h-12 text-[17px] font-black leading-6 text-slate-900">{product.name}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{product.specs.join(' • ')}</p>
      {product.sku && <div className="mt-2 text-[9px] font-bold uppercase tracking-wider text-slate-400">SKU: {product.sku}</div>}
      <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-bold text-slate-500"><span className="rounded-full bg-slate-100 px-2.5 py-1"><ShieldCheck className="mr-1 inline" size={11}/>Support</span><span className="rounded-full bg-slate-100 px-2.5 py-1"><PackageCheck className="mr-1 inline" size={11}/>Delivery</span></div>
      <div className="mt-5 flex items-end justify-between gap-3"><div><div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{quoteOnly?'Business pricing':'Indicative demo price'}</div><b className="mt-1 block text-lg">{product.price}</b></div><Link href={`/products/${product.slug}`} className="rounded-full bg-[#071525] px-4 py-2.5 text-xs font-black text-white transition group-hover:bg-[#0b5cff]">View Product <ArrowRight className="ml-1 inline" size={13}/></Link></div>
    </div>
  </article>;
}
