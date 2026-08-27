import { HardDrive, Laptop, Monitor, Network, Printer, Ruler } from 'lucide-react';

const map = { laptop:Laptop, printer:Printer, plotter:Ruler, monitor:Monitor, network:Network, storage:HardDrive } as const;

export function ProductVisual({ icon, compact=false }: { icon:keyof typeof map; compact?:boolean }) {
  const Icon = map[icon];
  return <div className={`product-visual ${compact ? 'h-40' : 'h-56'}`}>
    <div className="product-glow" />
    <div className="product-platform" />
    <Icon className="relative z-10 text-[#0b5cff] drop-shadow-xl" size={compact ? 66 : 88} strokeWidth={1.35}/>
  </div>;
}
