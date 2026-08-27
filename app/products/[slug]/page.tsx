import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, ChevronRight, Headphones, ShieldCheck, Truck, Wrench } from 'lucide-react';
import { ProductVisual } from '@/components/ProductVisual';
import { ProductCard } from '@/components/ProductCard';
import { AddToCartButton } from '@/components/AddToCartButton';
import { products } from '@/data/catalog';

export function generateStaticParams(){return products.map(p=>({slug:p.slug}));}

export default async function ProductPage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const product=products.find(p=>p.slug===slug);
  if(!product)notFound();
  const quoteOnly=product.price.toLowerCase().includes('quote');
  const related=products.filter(p=>p.slug!==product.slug && (p.category===product.category || p.brand===product.brand)).slice(0,3);

  return <main>
    <section className="border-b bg-white py-5"><div className="container flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500"><Link href="/shop" className="hover:text-[#0b5cff]">Shop</Link><ChevronRight size={13}/><span>{product.category}</span><ChevronRight size={13}/><span className="text-slate-900">{product.name}</span></div></section>

    <section className="py-12"><div className="container"><div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr]">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"><ProductVisual icon={product.icon} image={product.image} imageAlt={product.imageAlt || product.name}/></div>
      <div>
        {product.badge && <span className="inline-flex rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-black tracking-widest text-[#0b5cff]">{product.badge}</span>}
        <div className="mt-4 text-[11px] font-black uppercase tracking-[.16em] text-[#0b5cff]">{product.brand} • {product.category}</div>
        <h1 className="mt-3 text-4xl font-black tracking-[-.04em] md:text-5xl">{product.name}</h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">Business-ready technology supplied with access to ProPrint installation, configuration and after-sales support in Kuwait.</p>
        <div className="mt-6 flex flex-wrap items-end gap-3"><div className="text-3xl font-black">{product.price}</div>{!quoteOnly && <span className="pb-1 text-xs font-bold text-slate-400">Indicative demo price</span>}</div>
        {product.sku && <div className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Reference SKU: {product.sku}</div>}

        <div className="mt-7 grid gap-3 sm:grid-cols-2">{product.specs.map(x=><div key={x} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold"><CheckCircle2 size={17} className="text-[#0b5cff]"/>{x}</div>)}</div>

        <div className="mt-8 flex flex-wrap gap-3">{!quoteOnly && <AddToCartButton product={product}/>}<Link href="/quote" className="rounded-full bg-[#061321] px-6 py-3.5 font-black text-white">Request Business Quote</Link></div>

        <div className="mt-8 grid grid-cols-2 gap-3 text-xs font-bold text-slate-600 sm:grid-cols-4">
          <div className="rounded-xl bg-slate-100 p-3"><Truck size={17} className="mb-2 text-[#0b5cff]"/>Kuwait delivery</div>
          <div className="rounded-xl bg-slate-100 p-3"><Wrench size={17} className="mb-2 text-[#0b5cff]"/>Installation</div>
          <div className="rounded-xl bg-slate-100 p-3"><ShieldCheck size={17} className="mb-2 text-[#0b5cff]"/>After-sales</div>
          <div className="rounded-xl bg-slate-100 p-3"><Headphones size={17} className="mb-2 text-[#0b5cff]"/>Business support</div>
        </div>
      </div>
    </div></div></section>

    <section className="bg-[#061321] py-12 text-white"><div className="container grid gap-6 md:grid-cols-[1fr_auto] md:items-center"><div><div className="text-[10px] font-black uppercase tracking-[.18em] text-blue-300">More than product supply</div><h2 className="mt-2 text-2xl font-black">Need deployment, configuration or AMC with this purchase?</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">ProPrint can combine eligible hardware supply with professional installation, endpoint deployment, onsite service and ongoing maintenance support.</p></div><div className="flex flex-wrap gap-3"><Link href="/service" className="rounded-full bg-white px-5 py-3 text-sm font-black text-[#061321]">Service Center</Link><Link href="/quote" className="rounded-full bg-[#f47b20] px-5 py-3 text-sm font-black text-white">Build a Business Quote</Link></div></div></section>

    {related.length>0 && <section className="py-14"><div className="container"><div className="flex items-end justify-between gap-4"><div><div className="text-[10px] font-black uppercase tracking-[.18em] text-[#0b5cff]">Continue shopping</div><h2 className="mt-2 text-3xl font-black">Related products</h2></div><Link href="/shop" className="text-sm font-black text-[#0b5cff]">View all products →</Link></div><div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{related.map(p=><ProductCard key={p.slug} product={p}/>)}</div></div></section>}
  </main>;
}
