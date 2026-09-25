import Link from 'next/link';
import { ArrowLeft, BadgeCheck, ExternalLink, PackageCheck, Truck } from 'lucide-react';
import { CustomerCareForm } from '@/components/CustomerCareForm';

export const metadata = { title: 'خدمة العملاء', description: 'دعم الضمان وطلبات الاستلام والتوصيل والاستفسار عن حالة الإصلاح لدى ProPrint Solutions الكويت.' };

type ServiceKey = 'warranty' | 'pickup' | 'status';

const warrantyLinks = [
  { brand:'HP', label:'التحقق من ضمان HP', href:'https://support.hp.com/emea_middle_east-en/check-warranty', hint:'الرقم التسلسلي + بلد/منطقة الشراء', support:'علامة تدعمها ProPrint' },
  { brand:'Lenovo', label:'التحقق من ضمان Lenovo', href:'https://support.lenovo.com/kw/en/warranty-upgrade-and-services/', hint:'أجهزة الكمبيوتر ومحطات العمل والخوادم وأجهزة Lenovo الأخرى', support:'علامة تدعمها ProPrint' },
  { brand:'Dell', label:'ضمان ودعم Dell', href:'https://www.dell.com/support/home/en-kw', hint:'استخدم Service Tag أو Product ID', support:'علامة تدعمها ProPrint' },
  { brand:'Epson', label:'التحقق من ضمان Epson', href:'https://warrantycheck.epson.eu/', hint:'استخدم الرقم التسلسلي لجهاز Epson', support:'علامة تدعمها ProPrint' },
  { brand:'Apple', label:'التحقق من تغطية Apple', href:'https://checkcoverage.apple.com/?locale=en_KW', hint:'استخدم الرقم التسلسلي لجهاز Apple', support:'بوابة الشركة المصنعة الرسمية' },
  { brand:'Samsung', label:'معلومات ضمان Samsung', href:'https://www.samsung.com/ae/support/apps-services/how-to-check-my-warranty-information/', hint:'قد يلزم حساب Samsung أو IMEI أو الرقم التسلسلي', support:'بوابة الشركة المصنعة الرسمية' },
  { brand:'Xiaomi', label:'معلومات ضمان Xiaomi', href:'https://www.mi.com/ae-en/support/warranty/', hint:'معلومات الضمان والخدمة الرسمية من Xiaomi', support:'بوابة الشركة المصنعة الرسمية' },
  { brand:'Acer', label:'دعم Acer', href:'https://www.acer.com/ae-en/support', hint:'دعم المنتجات والضمان وموارد الخدمة', support:'بوابة الشركة المصنعة الرسمية' },
  { brand:'ASUS', label:'دعم ASUS', href:'https://www.asus.com/me-en/support/', hint:'دعم المنتجات والضمان وموارد الإصلاح', support:'بوابة الشركة المصنعة الرسمية' },
  { brand:'MSI', label:'ضمان ودعم MSI', href:'https://www.msi.com/support', hint:'يشمل الاستعلام عن حالة الضمان ودعم الإصلاح', support:'بوابة الشركة المصنعة الرسمية' },
  { brand:'Canon', label:'دعم Canon الشرق الأوسط', href:'https://en.canon-me.com/support/', hint:'دعم المنتجات وموارد الخدمة لمعدات Canon', support:'بوابة الشركة المصنعة الرسمية' },
  { brand:'Brother', label:'دعم Brother الخليج', href:'https://www.brother.ae/en/support', hint:'تسجيل المنتج وشروط الضمان ودعم الخدمة', support:'بوابة الشركة المصنعة الرسمية' },
  { brand:'Huawei', label:'التحقق من ضمان Huawei الكويت', href:'https://consumer.huawei.com/kw-en/support/warranty-query/', hint:'أدخل الرقم التسلسلي للاستعلام عن الضمان والخدمة', support:'بوابة الكويت الرسمية للشركة المصنعة' },
  { brand:'Microsoft Surface', label:'ضمان وخدمة Microsoft', href:'https://support.microsoft.com/en-US/accounts-billing/manage/check-your-microsoft-warranty-and-create-service-orders', hint:'سجّل جهاز Surface أو حدده لعرض تغطية الضمان', support:'بوابة الشركة المصنعة الرسمية' },
];

export default async function CustomerCarePage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const params = await searchParams;
  const requested = params.service;
  const initialService: ServiceKey = requested === 'pickup' || requested === 'status' ? requested : 'warranty';
  const directToForm = requested === 'pickup' || requested === 'status' || requested === 'warranty';

  return (
    <div className="bg-slate-50 text-right" dir="rtl" lang="ar">
      <section className="bg-[#061321] py-16 text-white">
        <div className="container">
          <Link href="/ar" className="inline-flex items-center gap-2 text-sm font-bold text-blue-200"><ArrowLeft size={16}/>العودة إلى ProPrint</Link>
          <div className="mt-8 max-w-3xl">
            <div className="text-[11px] font-black uppercase tracking-[.2em] text-[#57a7ff]">خدمة عملاء ProPrint</div>
            <h1 className="mt-3 text-4xl font-black tracking-[-.04em] sm:text-5xl">دعم الضمان والاستلام والتوصيل وحالة الصيانة في مكان واحد.</h1>
            <p className="mt-5 max-w-2xl leading-7 text-slate-300">استخدم بوابات الضمان الرسمية للشركات المصنعة للعلامات المدعومة وغير المدعومة، أو أرسل بيانات الجهاز إلى ProPrint للمساعدة. حالة الضمان يحددها المصنع وليست هذه المنصة.</p>
          </div>
        </div>
      </section>

      {!directToForm && <section className="py-16">
        <div className="container">
          <div className="mb-10 rounded-[2rem] border border-blue-100 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start gap-3">
              <BadgeCheck className="mt-1 shrink-0 text-[#0b5cff]" size={28}/>
              <div>
                <div className="text-[11px] font-black uppercase tracking-[.18em] text-[#0b5cff]">بوابات الشركات المصنعة الرسمية</div>
                <h2 className="mt-2 text-2xl font-black tracking-[-.03em]">تحقق من ضمان جهازك</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">اختر العلامة التجارية لفتح موقع الضمان أو الدعم الرسمي في نافذة جديدة. هذه الروابط متاحة لتسهيل الخدمة وتشمل شركات مصنعة خارج العلامات التي تدعمها ProPrint حالياً.</p>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {warrantyLinks.map((item) => (
                <a key={item.brand} href={item.href} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-blue-300 hover:bg-blue-50">
                  <div className="flex items-center justify-between gap-3"><span className="text-lg font-black text-slate-900">{item.brand}</span><ExternalLink size={16} className="text-[#0b5cff]"/></div>
                  <div className="mt-2 text-sm font-black text-[#0b5cff]">{item.label}</div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{item.hint}</p>
                  <div className="mt-3 text-[10px] font-black uppercase tracking-[.12em] text-slate-400">{item.support}</div>
                </a>
              ))}
            </div>
            <p className="mt-5 text-xs leading-5 text-slate-500">نتائج الضمان والأهلية الإقليمية وشروط الخدمة تخضع للشركة المصنعة المعنية. وجود رابط للشركة المصنعة لا يعني أن ProPrint مزود ضمان معتمد لتلك العلامة. إذا احتجت مساعدة في تحديد المنتج أو ترتيب خدمة متاحة عبر ProPrint، أرسل طلب دعم ضمان أدناه.</p>
          </div>
        </div>
      </section>}

      <section id="customer-care-form" className={directToForm ? 'scroll-mt-6 py-8 sm:py-10' : 'scroll-mt-6 pb-16'}>
        <div className="container">
          {directToForm && <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 text-sm font-bold text-slate-700">أنت في المكان الصحيح. أكمل طلب {initialService === 'pickup' ? 'الاستلام والتوصيل' : initialService === 'status' ? 'حالة الإصلاح' : 'دعم الضمان'} أدناه.</div>}
          <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr]">
            <div className="space-y-4">
              {[
                [BadgeCheck, 'دعم الضمان', 'أدخل العلامة التجارية والموديل والرقم التسلسلي أو رقم المنتج للحصول على إرشادات الضمان أو ما بعد الضمان.'],
                [Truck, 'الاستلام والتوصيل', 'اطلب استلام الأجهزة المؤهلة من موقع داخل الكويت. تؤكد ProPrint توفر الخدمة وأي رسوم قبل التنفيذ.'],
                [PackageCheck, 'حالة الإصلاح', 'استخدم الرقم المرجعي لخدمة ProPrint أو رقم إيصال الإصلاح لطلب تحديث الحالة.'],
              ].map(([Icon, title, text]) => { const I = Icon as typeof BadgeCheck; return <div key={title as string} className="rounded-2xl border border-slate-200 bg-white p-5"><I className="text-[#0b5cff]"/><h2 className="mt-3 font-black">{title as string}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{text as string}</p></div>; })}
            </div>
            <CustomerCareForm initialService={initialService} locale="ar"/>
          </div>
        </div>
      </section>
    </div>
  );
}
