import Link from 'next/link';
import { Building2, LockKeyhole } from 'lucide-react';
import { CartClient } from '@/components/CartClient';
import { products } from '@/data/catalog';

export default function CartPage(){return <main>
<section className="bg-[#061321] py-12 text-white"><div className="container"><div className="text-[10px] font-black uppercase tracking-[.18em] text-blue-300">ProPrint Shop</div><h1 className="mt-2 text-4xl font-black tracking-[-.04em]">Your Cart</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Products added during this demo are stored locally on the current device. Live payment, stock validation and order processing can later be connected to Shopify.</p></div></section>
<section className="py-14"><div className="container grid gap-7 lg:grid-cols-[1fr_360px]">
<CartClient products={products}/>
<aside className="h-fit rounded-[2rem] bg-slate-100 p-7"><h2 className="text-xl font-black">Business purchase?</h2><p className="mt-2 text-sm leading-6 text-slate-600">For multiple units, project deployment, installation or AMC, request a corporate quotation instead of standard checkout.</p><Link href="/quote" className="mt-5 flex items-center justify-center rounded-full bg-[#f47b20] px-5 py-3 font-black text-white"><Building2 className="mr-2" size={17}/>Request Quote</Link><div className="mt-6 border-t border-slate-200 pt-5 text-xs leading-6 text-slate-500"><div className="flex items-center gap-2 font-bold text-slate-700"><LockKeyhole size={15}/>Commerce-ready architecture</div><p className="mt-2">Shopify can handle payment, inventory and order processing while ProPrint retains its corporate website and customer service workflows.</p></div></aside>
</div></section>
</main>}
