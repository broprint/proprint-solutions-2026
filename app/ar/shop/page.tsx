import Link from 'next/link';
import { BadgeCheck, Building2, Headphones, Truck } from 'lucide-react';
import { ShopCatalog } from '@/components/ShopCatalog';
import { getStoreProducts } from '@/lib/products';

const trustItems=[
 [BadgeCheck,'منتجات أصلية','تقنية من علامات تجارية موثوقة'],
 [Truck,'توصيل داخل الكويت','خيارات توصيل للطلبات المحلية'],
 [Headphones,'دعم ما بعد البيع','مركز صيانة ودعم فني'],
 [Building2,'مشتريات الشركات','عروض للكميات والتركيب وعقود الصيانة'],
] as const;

export default async function ArabicShopPage({searchParams}:{searchParams:Promise<{category?:string}>}){
 const products=await getStoreProducts();
 const params=await searchParams;
 const initialCategory=params.category?.trim()||'All';
 return <main dir="rtl" lang="ar" className="text-right">
  <section className="relative overflow-hidden bg-[#061321] py-16 text-white md:py-20"><div className="container relative">
   <div className="text-[11px] font-black tracking-wide text-blue-200">متجر ProPrint الإلكتروني • الكويت</div>
   <h1 className="mt-4 max-w-4xl text-5xl font-black md:text-7xl">كل ما تحتاجه في تقنية المعلومات. <span className="text-[#55a8ff]">ProPrint واحد.</span></h1>
   <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">تسوّق أجهزة الكمبيوتر والطابعات والبلوتر ومعدات الشبكات والتخزين والإكسسوارات، مع خدمات التركيب والصيانة والدعم الفني من ProPrint.</p>
   <div className="mt-8 flex flex-wrap gap-3"><a href="#catalog" className="rounded-full bg-[#f47b20] px-6 py-3 text-sm font-black">تصفح المنتجات</a><Link href="/ar/quote" className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-black">اطلب عرض سعر للشركات</Link></div>
  </div></section>
  <section className="border-b bg-white"><div className="container grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-4">{trustItems.map(([Icon,title,text])=><div key={title} className="flex gap-3 bg-white px-5 py-5"><div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-[#0b5cff]"><Icon size={19}/></div><div><div className="text-sm font-black">{title}</div><div className="mt-1 text-xs leading-5 text-slate-500">{text}</div></div></div>)}</div></section>
  <div id="catalog"><ShopCatalog products={products} initialCategory={initialCategory}/></div>
  <section className="pb-20"><div className="container rounded-[2rem] bg-[#071525] p-8 text-white md:p-10"><div className="text-[10px] font-black text-blue-200">للشركات</div><h2 className="mt-3 text-3xl font-black">هل تحتاج إلى شراء عدة أجهزة؟</h2><p className="mt-3 max-w-2xl leading-8 text-slate-300">اطلب أسعار الشركات للطلبات الكبيرة وخدمات التركيب والنشر والشبكات وعقود الصيانة السنوية.</p><Link href="/ar/quote" className="mt-7 inline-flex rounded-full bg-[#f47b20] px-6 py-3 text-sm font-black">اطلب عرض سعر</Link></div></section>
 </main>
}
