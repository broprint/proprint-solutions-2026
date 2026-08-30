'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, Laptop, Printer, Server, Network, Ruler } from 'lucide-react';
import { useEffect, useState } from 'react';

const slides = [
  {
    title: 'Printing & Plotting',
    text: 'Reliable printers and precision large-format solutions for every business.',
    href: '/shop?category=Printers%20%26%20MFPs',
    cta: 'Shop Printing',
    icons: [Printer, Printer, Ruler],
  },
  {
    title: 'Business Computing',
    text: 'Powerful laptops and computers for productive teams and modern workplaces.',
    href: '/shop?category=Computers',
    cta: 'Shop Computers',
    icons: [Laptop, Laptop, Laptop],
  },
  {
    title: 'Servers & Infrastructure',
    text: 'Servers, storage and networking solutions built for dependable business IT.',
    href: '/shop?category=Servers%20%26%20Storage',
    cta: 'Shop Infrastructure',
    icons: [Server, Network, Server],
  },
] as const;

const ROTATE_MS = 10 * 60 * 1000;

export function HomeHeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActive((value) => (value + 1) % slides.length), ROTATE_MS);
    return () => window.clearInterval(timer);
  }, []);

  const slide = slides[active];
  const previous = () => setActive((value) => (value - 1 + slides.length) % slides.length);
  const next = () => setActive((value) => (value + 1) % slides.length);

  return (
    <div className="relative hidden lg:block">
      <div className="absolute -inset-12 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-gradient-to-br from-white/[.09] to-blue-500/[.05] p-7 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="absolute inset-0 hero-grid opacity-20" />
        <div className="relative">
          <div className="mb-6 flex items-start justify-between gap-5">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[.2em] text-blue-300">ProPrint Product Carousel</div>
              <h2 className="mt-2 text-2xl font-black tracking-[-.03em]">{slide.title}</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">{slide.text}</p>
            </div>
            <Link href={slide.href} className="shrink-0 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-xs font-black text-blue-200 transition hover:bg-blue-500/20">
              {slide.cta} →
            </Link>
          </div>

          <div className="relative flex h-64 items-end justify-center overflow-hidden rounded-[1.7rem] border border-blue-400/20 bg-gradient-to-b from-[#08254d] to-[#061321] px-12 pb-8">
            <div className="absolute bottom-5 left-[12%] right-[12%] h-12 rounded-[50%] border border-blue-400/50 bg-blue-500/10 shadow-[0_0_40px_rgba(59,130,246,.45)]" />
            <div className="relative z-10 flex items-end justify-center gap-5">
              {slide.icons.map((Icon, index) => (
                <div key={index} className={`flex items-center justify-center rounded-[1.5rem] border border-white/15 bg-white/[.08] shadow-xl backdrop-blur ${index === 1 ? 'h-40 w-40' : 'h-32 w-32'}`}>
                  <Icon size={index === 1 ? 88 : 68} strokeWidth={1.2} className="text-[#57a7ff] drop-shadow-[0_0_18px_rgba(87,167,255,.45)]" />
                </div>
              ))}
            </div>

            <button type="button" onClick={previous} aria-label="Previous carousel slide" className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-[#061321]/80 p-2.5 text-white transition hover:bg-[#0b5cff]">
              <ChevronLeft size={20} />
            </button>
            <button type="button" onClick={next} aria-label="Next carousel slide" className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-[#061321]/80 p-2.5 text-white transition hover:bg-[#0b5cff]">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2" aria-label="Carousel slides">
            {slides.map((item, index) => (
              <button key={item.title} type="button" onClick={() => setActive(index)} aria-label={`Show ${item.title}`} aria-current={index === active ? 'true' : undefined} className={`h-2.5 rounded-full transition-all ${index === active ? 'w-7 bg-[#57a7ff]' : 'w-2.5 bg-white/30 hover:bg-white/50'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
