'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight, Laptop, Network, Printer, Ruler, Server, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';

const slides = [
  {
    title: 'Printers',
    text: 'Business printers, MFPs and office printing solutions.',
    href: '/shop?category=Printers%20%26%20MFPs#catalog',
    Icon: Printer,
  },
  {
    title: 'Laptops',
    text: 'Business laptops and computers for work and productivity.',
    href: '/shop?category=Computers#catalog',
    Icon: Laptop,
  },
  {
    title: 'Servers',
    text: 'Servers and storage for reliable business infrastructure.',
    href: '/shop?category=Servers%20%26%20Storage#catalog',
    Icon: Server,
  },
  {
    title: 'Networking',
    text: 'Networking solutions to keep your business connected.',
    href: '/shop?category=Networking#catalog',
    Icon: Network,
  },
  {
    title: 'Plotters',
    text: 'Professional large-format printing and plotting solutions.',
    href: '/shop?category=Plotters%20%26%20Wide%20Format#catalog',
    Icon: Ruler,
  },
];

export function HeroCategoryCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 3800);
    return () => window.clearInterval(timer);
  }, [paused]);

  const previous = () => setActive((current) => (current - 1 + slides.length) % slides.length);
  const next = () => setActive((current) => (current + 1) % slides.length);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Shop product categories"
    >
      <div className="absolute -inset-10 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[.09] to-blue-500/[.08] p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-2 text-[10px] font-black uppercase tracking-[.14em] text-blue-100">
            <ShieldCheck size={15} className="text-[#57a7ff]" />
            Quality Products · Trusted Support
          </div>
          <div className="hidden text-[10px] font-black uppercase tracking-[.16em] text-slate-400 sm:block">Explore Categories</div>
        </div>

        <div className="relative min-h-[360px] overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#061a32]/80">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(11,92,255,.28),transparent_55%)]" />
          <div className="absolute inset-x-10 bottom-12 h-px bg-gradient-to-r from-transparent via-blue-300/70 to-transparent shadow-[0_0_22px_rgba(87,167,255,.9)]" />

          {slides.map(({ title, text, href, Icon }, index) => {
            const offset = (index - active + slides.length) % slides.length;
            const visible = offset === 0;
            return (
              <div
                key={title}
                className={`absolute inset-0 flex items-center justify-center px-14 py-8 transition-all duration-700 ease-out ${
                  visible ? 'translate-x-0 scale-100 opacity-100' : offset === 1 ? 'translate-x-16 scale-95 opacity-0' : '-translate-x-16 scale-95 opacity-0'
                }`}
                aria-hidden={!visible}
              >
                <Link href={href} tabIndex={visible ? 0 : -1} className="group flex w-full max-w-[420px] flex-col items-center text-center">
                  <div className="relative flex h-44 w-full items-center justify-center rounded-[1.7rem] border border-blue-300/20 bg-gradient-to-b from-blue-400/10 to-white/[.03] shadow-inner">
                    <div className="absolute h-32 w-32 rounded-full bg-blue-500/20 blur-2xl transition group-hover:bg-blue-400/30" />
                    <Icon size={112} strokeWidth={1.05} className="relative text-[#57a7ff] drop-shadow-[0_0_22px_rgba(87,167,255,.35)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105" />
                  </div>
                  <div className="mt-5 text-[11px] font-black uppercase tracking-[.2em] text-[#57a7ff]">Shop Category</div>
                  <h3 className="mt-1 text-3xl font-black tracking-[-.03em] text-white">{title}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-300">{text}</p>
                  <span className="mt-4 rounded-full border border-white/15 bg-white/[.07] px-4 py-2 text-xs font-black text-white transition group-hover:border-blue-300/40 group-hover:bg-[#0b5cff]">Browse {title} →</span>
                </Link>
              </div>
            );
          })}

          <button type="button" onClick={previous} aria-label="Previous category" className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-[#061321]/80 p-3 text-white shadow-lg backdrop-blur transition hover:bg-[#0b5cff]">
            <ChevronLeft size={22} />
          </button>
          <button type="button" onClick={next} aria-label="Next category" className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-[#061321]/80 p-3 text-white shadow-lg backdrop-blur transition hover:bg-[#0b5cff]">
            <ChevronRight size={22} />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2" aria-label="Carousel pagination">
          {slides.map((slide, index) => (
            <button
              type="button"
              key={slide.title}
              onClick={() => setActive(index)}
              aria-label={`Show ${slide.title}`}
              aria-current={index === active ? 'true' : undefined}
              className={`h-2 rounded-full transition-all ${index === active ? 'w-7 bg-[#57a7ff]' : 'w-2 bg-white/30 hover:bg-white/60'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
