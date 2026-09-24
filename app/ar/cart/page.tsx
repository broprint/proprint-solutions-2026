import Link from 'next/link';
import { Building2, LockKeyhole } from 'lucide-react';
import { CartClient } from '@/components/CartClient';
import { getArabicStoreProducts } from '@/lib/products';

export default async function ArabicCartPage(){
 const products=await getArabicStoreProducts();
 return <main dir="rtl" lang="ar" className="text-right">
  <section className="bg-[#061321] py-12 text-white"><div className="container">
   <div className="text-[10px] font-black text-blue-300">متجر ProPrint</div>
   <h1 className="mt-2 text-4xl font-black">سلة التسوق</h1>
   <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">يتم حفظ المنتجات المضافة إلى سلتك على هذا الجهاز. تؤكد ProPrint المخزون النهائي والسعر والتوصيل قبل معالجة الطلب.</p>
  </div></section>
  <section className="py-14"><div className="container grid gap-7 lg:grid-cols-[1fr_360px]">
   <CartClient products={products}/>
   <aside className="h-fit rounded-[2rem] bg-slate-100 p-7">
    <h2 className="text-xl font-black">مشتريات للشركات؟</h2>
    <p className="mt-2 text-sm leading-6 text-slate-600">لشراء عدة أجهزة أو مشاريع التجهيز والتركيب أو عقود الصيانة، اطلب عرض سعر للشركات.</p>
    <Link href="/ar/quote" className="mt-5 flex items-center justify-center rounded-full bg-[#f47b20] px-5 py-3 font-black text-white"><Building2 className="ml-2" size={17}/>اطلب عرض سعر</Link>
    <div className="mt-6 border-t border-slate-200 pt-5 text-xs leading-6 text-slate-500"><div className="flex items-center gap-2 font-bold text-slate-700"><LockKeyhole size={15}/>كتالوج تديره ProPrint</div><p className="mt-2">تدير ProPrint المنتجات والأسعار والتوفر من خلال كتالوج الموقع.</p></div>
   </aside>
  </div></section>
 </main>
}