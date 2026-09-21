import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CheckCircle2, Headphones, ShieldCheck, Truck, Wrench } from 'lucide-react';
import { ProductGallery } from '@/components/ProductGallery';
import { AddToCartButton } from '@/components/AddToCartButton';
import { getStoreProducts } from '@/lib/products';

const stockArabic:Record<string,string>={
 'In stock':'متوفر','Low stock':'كمية محدودة','Available on order':'متوفر بالطلب',
 'Request availability':'تحقق من التوفر','Out of stock':'غير متوفر حالياً','Quote only':'السعر عند الطلب'
};

export default async function ArabicProductPage({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params; const products=await getStoreProducts(); const product=products.find(p=>p.slug===slug); if(!product)notFound();
 const quoteOnly=product.priceOnRequest||product.stock==='Quote only';
 const inStock=(product.stock==='In stock'||product.stock==='Low stock')&&(product.stockQuantity??0)>0;
 const orderable=product.stock==='Available on order';
 const canAdd=!quoteOnly&&(inStock||orderable);
 const quoteHref=`/ar/quote?product=${encodeURIComponent(product.name)}&sku=${encodeURIComponent(product.sku??'')}#request`;
 return <main dir="rtl" lang="ar" className="text-right">
  <section className="border-b bg-white py-5"><div className="container flex flex-wrap items-center gap-2 text-xs font-bold text-slate-500"><Link href="/ar/shop" className="hover:text-[#0b5cff]">المتجر</Link><span>←</span><span>{product.category}</span><span>←</span><span className="text-slate-900">{product.name}</span></div></section>
  <section className="py-12"><div className="container grid gap-10 lg:grid-cols-[1.05fr_.95fr]"><ProductGallery product={product}/><div>
   <div className="text-[11px] font-black text-[#0b5cff]">{product.brand} • {product.category}</div>
   <h1 className="mt-3 text-4xl font-black md:text-5xl">{product.name}</h1>
   <p className="mt-4 max-w-xl text-sm leading-8 text-slate-600">منتج تقني للأعمال مع إمكانية الاستفادة من خدمات ProPrint للتركيب والإعداد ودعم ما بعد البيع في الكويت.</p>
   <div className="mt-6 text-3xl font-black">{product.price}</div>
   {product.sku&&<div className="mt-2 text-[10px] font-bold text-slate-400">رمز المنتج: {product.sku}</div>}
   {product.stock&&<div className="mt-3 text-sm font-black text-slate-600">التوفر: {stockArabic[product.stock]||product.stock}{inStock&&product.stockQuantity!==undefined?` • ${product.stockQuantity} متوفر`:''}</div>}
   <div className="mt-7 grid gap-3 sm:grid-cols-2">{product.specs.map(x=><div key={x} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold"><CheckCircle2 size={17} className="text-[#0b5cff]"/>{x}</div>)}</div>
   <div className="mt-8 flex flex-wrap gap-3">{canAdd&&<AddToCartButton product={product}/>}<Link href={quoteHref} className="rounded-full bg-[#061321] px-6 py-3.5 font-black text-white">{quoteOnly?'اطلب السعر':'اطلب عرض سعر'}</Link></div>
   <div className="mt-8 grid grid-cols-2 gap-3 text-xs font-bold text-slate-600 sm:grid-cols-4"><div className="rounded-xl bg-slate-100 p-3"><Truck size={17} className="mb-2 text-[#0b5cff]"/>توصيل الكويت</div><div className="rounded-xl bg-slate-100 p-3"><Wrench size={17} className="mb-2 text-[#0b5cff]"/>التركيب</div><div className="rounded-xl bg-slate-100 p-3"><ShieldCheck size={17} className="mb-2 text-[#0b5cff]"/>ما بعد البيع</div><div className="rounded-xl bg-slate-100 p-3"><Headphones size={17} className="mb-2 text-[#0b5cff]"/>دعم الشركات</div></div>
  </div></div></section>
 </main>
}
