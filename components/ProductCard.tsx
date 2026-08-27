import Link from 'next/link';
import { ArrowRight, ShoppingCart } from 'lucide-react';
import type { Product } from '@/data/catalog';
import { ProductVisual } from './ProductVisual';

export function ProductCard({ product }: { product:Product }) {
  return <article className="group overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
    <div className="relative">
      <ProductVisual icon={product.icon}/>
      {product.badge && <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[9px] font-black tracking-widest text-[#0b5cff] shadow-sm">{product.badge}</span>}
    </div>
    <div className="p-5">
      <div className="text-[10px] font-black uppercase tracking-[.14em] text-slate-400">{product.brand} • {product.category}</div>
      <h3 className="mt-2 min-h-12 font-black text-slate-900">{product.name}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{product.specs.join(' • ')}</p>
      <div className="mt-5 flex items-center justify-between gap-3"><b className="text-lg">{product.price}</b><Link href={`/products/${product.slug}`} className="rounded-full bg-[#071525] px-4 py-2 text-xs font-black text-white">View <ArrowRight className="ml-1 inline" size={13}/></Link></div>
    </div>
  </article>;
}
