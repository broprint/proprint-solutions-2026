import Image from 'next/image';
import { HardDrive, Laptop, Monitor, Network, Printer, Ruler } from 'lucide-react';

const map = { laptop:Laptop, printer:Printer, plotter:Ruler, monitor:Monitor, network:Network, storage:HardDrive } as const;
const labels = { laptop:'Business Computing', printer:'Office Printing', plotter:'Large Format', monitor:'Displays', network:'Networking', storage:'Storage' } as const;

export function ProductVisual({ icon, compact=false, image, imageAlt='' }: { icon:keyof typeof map; compact?:boolean; image?:string; imageAlt?:string }) {
  const Icon = map[icon];

  if (image) {
    return <div className={`relative overflow-hidden bg-white ${compact ? 'h-36 sm:h-44' : 'h-60'}`}>
      <div className="absolute left-3 top-3 z-20 rounded-full border border-blue-100 bg-white/95 px-2.5 py-1 text-[8px] font-black uppercase tracking-[.12em] text-[#0b5cff] shadow-sm sm:left-4 sm:top-4 sm:px-3 sm:text-[9px]">{labels[icon]}</div>
      <div className="relative h-full w-full p-4 sm:p-7">
        <Image src={image} alt={imageAlt} fill sizes={compact ? '(max-width: 768px) 100vw, 320px' : '(max-width: 768px) 100vw, 600px'} className="object-contain p-5 sm:p-7" />
      </div>
    </div>;
  }

  return <div className={`product-visual relative overflow-hidden ${compact ? 'h-36 sm:h-44' : 'h-60'}`}>
    <div className="product-glow" />
    <div className="absolute inset-x-6 bottom-5 h-8 rounded-[50%] bg-slate-900/10 blur-md" />
    <div className="absolute left-3 top-3 z-20 rounded-full border border-blue-100 bg-white/90 px-2.5 py-1 text-[8px] font-black uppercase tracking-[.12em] text-[#0b5cff] shadow-sm backdrop-blur sm:left-4 sm:top-4 sm:px-3 sm:text-[9px]">{labels[icon]}</div>
    <div className="relative z-10 flex h-full items-center justify-center">
      <div className={`relative flex items-center justify-center rounded-[2rem] border border-white/70 bg-white/80 shadow-2xl shadow-blue-900/10 backdrop-blur ${compact ? 'h-24 w-36 sm:h-28 sm:w-40' : 'h-36 w-48'}`}>
        <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-blue-400/20 via-transparent to-orange-400/20" />
        <Icon className="relative z-10 text-[#0b5cff] drop-shadow-xl" size={compact ? 58 : 88} strokeWidth={1.35}/>
      </div>
    </div>
    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-100/80 to-transparent" />
  </div>;
}
