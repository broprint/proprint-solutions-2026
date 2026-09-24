import Link from 'next/link';
import { ArrowLeft, BadgeCheck, Building2, CheckCircle2, Headphones, Laptop, Network, Printer, Ruler, Server, ShieldCheck, ShoppingBag, Wrench } from 'lucide-react';

const categories=[
  [Laptop,'أجهزة الكمبيوتر','أجهزة لابتوب وكمبيوتر للأعمال والاستخدام المهني.'],
  [Printer,'الطباعة','طابعات وأجهزة متعددة الوظائف ومستلزمات الطباعة.'],
  [Ruler,'البلوتر والطباعة كبيرة الحجم','حلول الطباعة كبيرة الحجم للأعمال والهندسة.'],
  [Network,'الشبكات','معدات الشبكات والاتصال للشركات.'],
  [Server,'الخوادم والتخزين','حلول الخوادم والتخزين والبنية التحتية.'],
  [ShoppingBag,'الإكسسوارات','إكسسوارات وملحقات تقنية للاستخدام اليومي.'],
] as const;

export default function ArabicHome(){
 return <main dir="rtl" lang="ar" className="text-right">
  <section className="relative overflow-hidden bg-[#061321] text-white">
   <div className="hero-grid absolute inset-0 opacity-40"/>
   <div className="container relative grid min-h-[620px] items-center gap-12 py-16 lg:grid-cols-2">
    <div>
     <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/[.06] px-4 py-2 text-[11px] font-black tracking-wide text-blue-200">متجر بروبرنت الإلكتروني • الكويت</div>
     <h1 className="max-w-3xl text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl">كل ما تحتاجه في تقنية المعلومات.<br/><span className="text-[#57a7ff]">مع ProPrint في مكان واحد.</span></h1>
     <p className="mt-6 max-w-2xl text-lg leading-9 text-slate-300">تسوّق أجهزة الكمبيوتر والطابعات والبلوتر ومعدات الشبكات والتخزين والإكسسوارات، مع خدمات التركيب والصيانة والدعم الفني وحلول الشركات من ProPrint.</p>
     <div className="mt-8 flex flex-wrap gap-3">
      <Link href="/ar/shop" className="rounded-full bg-[#0b5cff] px-6 py-3.5 font-black text-white">تصفح المنتجات <ArrowLeft className="mr-2 inline" size={17}/></Link>
      <Link href="/ar/quote" className="rounded-full bg-[#f47b20] px-6 py-3.5 font-black text-white">اطلب عرض سعر</Link>
      <Link href="/ar/service" className="rounded-full border border-white/20 bg-white/10 px-6 py-3.5 font-black text-white">طلب صيانة</Link>
     </div>
     <div className="mt-9 flex flex-wrap gap-6 text-sm font-bold text-slate-400"><span><CheckCircle2 className="ml-1 inline text-blue-400" size={15}/>منتجات أصلية</span><span><CheckCircle2 className="ml-1 inline text-blue-400" size={15}/>دعم ما بعد البيع</span><span><CheckCircle2 className="ml-1 inline text-blue-400" size={15}/>خدمات للشركات</span></div>
    </div>
    <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#0b5cff]/30 to-[#061321] p-10 shadow-2xl">
      <ShieldCheck size={48} className="text-[#57a7ff]"/><h2 className="mt-8 text-3xl font-black">ProPrint Solutions الكويت</h2>
      <p className="mt-4 text-lg leading-9 text-slate-300">منتجات تقنية، حلول طباعة، بنية تحتية، صيانة ودعم ميداني للشركات في الكويت.</p>
      <Link href="/" className="mt-8 inline-flex rounded-full border border-white/20 px-5 py-3 text-sm font-black">English</Link>
    </div>
   </div>
  </section>
  <section className="border-b bg-white"><div className="container grid md:grid-cols-3">{[[BadgeCheck,'تقنية أصلية','منتجات من علامات تقنية رائدة.'],[ShieldCheck,'دعم احترافي','خبرة فنية تتجاوز عملية البيع.'],[Headphones,'خدمة ميدانية في الكويت','دعم فني ومؤسسي في مواقع العملاء.']].map(([Icon,title,text])=>{const I=Icon as any;return <div key={title as string} className="flex gap-4 border-slate-100 px-4 py-7 md:border-l"><I className="shrink-0 text-[#0b5cff]"/><div><b>{title as string}</b><p className="mt-1 text-sm text-slate-500">{text as string}</p></div></div>})}</div></section>
  <section className="py-20"><div className="container"><div className="text-[11px] font-black tracking-wide text-[#0b5cff]">تسوّق حسب الفئة</div><h2 className="mt-3 text-4xl font-black">كل احتياجاتك التقنية</h2><p className="mt-4 max-w-2xl leading-8 text-slate-600">مجموعة واسعة من منتجات تقنية المعلومات مدعومة بخدمات ProPrint في المبيعات والتركيب والدعم الفني.</p><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{categories.map(([Icon,title,text])=>{const I=Icon;return <Link href="/ar/shop" key={title} className="category-card group"><div className="category-icon"><I size={29}/></div><div><h3 className="text-lg font-black">{title}</h3><p className="mt-1 text-sm leading-7 text-slate-500">{text}</p><span className="mt-4 inline-block text-xs font-black text-[#0b5cff]">عرض المنتجات ←</span></div></Link>})}</div></div></section>
  <section className="bg-[#061321] py-20 text-white"><div className="container grid gap-10 lg:grid-cols-2"><div><div className="text-[11px] font-black text-blue-300">مركز خدمات ProPrint</div><h2 className="mt-3 text-4xl font-black">نحن ندعم ما نبيعه — وأكثر.</h2><p className="mt-5 leading-8 text-slate-300">خدمات فنية احترافية للطابعات والبلوتر وأجهزة الكمبيوتر ومعدات تقنية المعلومات للشركات.</p><Link href="/ar/service" className="mt-7 inline-flex rounded-full bg-[#0b5cff] px-6 py-3 font-black">اطلب خدمة</Link></div><div className="grid gap-3 sm:grid-cols-2">{['صيانة الطابعات والبلوتر','دعم أجهزة اللابتوب والكمبيوتر','التركيب والإعداد','دعم الضمان وقطع الغيار','الصيانة الوقائية','عقود الصيانة السنوية AMC'].map(x=><div key={x} className="rounded-2xl border border-white/10 bg-white/[.05] p-4 font-bold"><CheckCircle2 className="ml-2 inline text-[#57a7ff]" size={17}/>{x}</div>)}</div></div></section>
  <section className="py-20"><div className="container"><div className="text-[11px] font-black text-[#0b5cff]">تقنية المعلومات وخدمات الشركات</div><h2 className="mt-3 text-4xl font-black">قدرات ميدانية لبيئات الشركات.</h2><p className="mt-5 max-w-3xl leading-8 text-slate-600">دعم تقنية المعلومات في الموقع، والهندسة الميدانية، وخدمات الأجهزة، والنشر والتجهيز لبيئات الشركات في جميع أنحاء الكويت.</p><Link href="/ar/enterprise" className="mt-7 inline-flex rounded-full bg-[#061321] px-6 py-3.5 font-black text-white">خدمات الشركات <ArrowLeft className="mr-2"/></Link></div></section>
 </main>
}
