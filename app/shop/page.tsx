import Link from 'next/link';
import { ArrowRight, BadgeCheck, Building2, Headphones, Truck } from 'lucide-react';
import { ShopCatalog } from '@/components/ShopCatalog';
import { getStoreProducts } from '@/lib/products';

const trustItems = [
  [BadgeCheck, 'Genuine products', 'Technology from trusted brands'],
  [Truck, 'Kuwait delivery', 'Delivery options for local orders'],
  [Headphones, 'After-sales support', 'Service Center and technical support'],
  [Building2, 'Business procurement', 'Bulk quotes, deployment and AMC'],
] as const;

export default async function ShopPage() {
  const products = await getStoreProducts();

  return (
    <main>
      <section className="relative overflow-hidden bg-[#061321] py-16 text-white md:py-20">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-40 w-80 rounded-full bg-orange-500/10 blur-3xl" />
        <div className="container relative">
          <div className="text-[11px] font-black uppercase tracking-[.22em] text-blue-200">ProPrint Online Store · Kuwait</div>
          <h1 className="mt-4 max-w-4xl text-5xl font-black tracking-[-.05em] md:text-7xl">Everything IT. <span className="text-[#55a8ff]">One ProPrint.</span></h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">Shop business laptops, printers, plotters, networking, storage and accessories — backed by ProPrint installation, service and enterprise support.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#catalog" className="rounded-full bg-[#f47b20] px-6 py-3 text-sm font-black text-white shadow-lg shadow-orange-950/20">Browse Products</a>
            <Link href="/quote" className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-black text-white backdrop-blur">Request Business Quote</Link>
          </div>
        </div>
      </section>

      <section className="border-b bg-white">
        <div className="container grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map(([Icon, title, text]) => (
            <div key={title} className="flex gap-3 bg-white px-5 py-5">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0b5cff]"><Icon size={19}/></div>
              <div><div className="text-sm font-black text-slate-900">{title}</div><div className="mt-1 text-xs leading-5 text-slate-500">{text}</div></div>
            </div>
          ))}
        </div>
      </section>

      <div id="catalog"><ShopCatalog products={products}/></div>

      <section className="pb-20">
        <div className="container grid gap-5 lg:grid-cols-2">
          <div className="rounded-[2rem] bg-[#071525] p-8 text-white md:p-10">
            <div className="text-[10px] font-black uppercase tracking-[.2em] text-blue-200">For business</div>
            <h2 className="mt-3 text-3xl font-black tracking-[-.03em]">Buying multiple devices?</h2>
            <p className="mt-3 max-w-lg leading-7 text-slate-300">Request corporate pricing for bulk orders, device deployment, installation, networking and ongoing AMC support.</p>
            <Link href="/quote" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#f47b20] px-6 py-3 text-sm font-black text-white">Request Business Quote <ArrowRight size={15}/></Link>
          </div>
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 md:p-10">
            <div className="text-[10px] font-black uppercase tracking-[.2em] text-[#0b5cff]">ProPrint advantage</div>
            <h2 className="mt-3 text-3xl font-black tracking-[-.03em]">Buy it. Install it. Support it.</h2>
            <p className="mt-3 max-w-lg leading-7 text-slate-600">The online store connects directly to ProPrint's Service Center, onsite support and maintenance capabilities — giving customers one technology partner beyond the initial purchase.</p>
            <Link href="/service" className="mt-7 inline-flex items-center gap-2 text-sm font-black text-[#0b5cff]">Explore Service & Support <ArrowRight size={15}/></Link>
          </div>
        </div>
      </section>
    </main>
  );
}
