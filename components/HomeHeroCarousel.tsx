'use client';

import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

const slides = [
  {
    title: 'Reliable Printing for Every Business',
    text: 'Professional printers and multifunction solutions for productive workplaces.',
    href: '/shop?category=Printers%20%26%20MFPs',
    cta: 'Shop Printers',
    image: 'https://www.buydig.com/shop/product-image.aspx?picId=591897&size=500',
    imageAlt: 'HP business multifunction printer',
  },
  {
    title: 'Powerful Technology Built for Success',
    text: 'Business laptops designed for performance, mobility and everyday reliability.',
    href: '/shop?category=Computers',
    cta: 'Shop Computers',
    image: 'https://kr-media.apjonlinecdn.com/catalog/product/B/9/B94E9PT-11_T1739342255.png',
    imageAlt: 'HP business laptop',
  },
  {
    title: 'Stronger Infrastructure for Your Business',
    text: 'Enterprise server platforms for dependable business infrastructure and growth.',
    href: '/shop?category=Servers%20%26%20Storage',
    cta: 'Shop Infrastructure',
    image: 'https://www.hpe.com/content/dam/hpe/shared-publishing/images-norend/marquee-png/HPE-Smart-Choice-servers-600x528.png',
    imageAlt: 'HPE ProLiant server lineup',
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
          <div className="mb-5 flex items-start justify-between gap-5">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[.2em] text-blue-300">ProPrint Online Store · Kuwait</div>
              <h2 className="mt-2 max-w-sm text-2xl font-black tracking-[-.03em]">{slide.title}</h2>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">{slide.text}</p>
            </div>
            <Link href={slide.href} className="shrink-0 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-xs font-black text-blue-200 transition hover:bg-blue-500/20">
              {slide.cta} →
            </Link>
          </div>

          <div className="relative h-64 overflow-hidden rounded-[1.7rem] border border-blue-400/20 bg-gradient-to-b from-[#0a2b58] to-[#061321]">
            <div className="absolute inset-x-[10%] bottom-5 h-12 rounded-[50%] border border-blue-400/50 bg-blue-500/10 shadow-[0_0_45px_rgba(59,130,246,.55)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(37,99,235,.3),transparent_48%)]" />
            <div className="absolute inset-5 flex items-center justify-center">
              <div className="relative flex h-full w-[72%] items-center justify-center overflow-hidden rounded-3xl bg-white/[.96] shadow-2xl">
                <img src={slide.image} alt={slide.imageAlt} className="h-full w-full object-contain p-5" />
              </div>
            </div>

            <button type="button" onClick={previous} aria-label="Previous carousel slide" className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-[#061321]/85 p-2.5 text-white transition hover:bg-[#0b5cff]">
              <ChevronLeft size={20} />
            </button>
            <button type="button" onClick={next} aria-label="Next carousel slide" className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-[#061321]/85 p-2.5 text-white transition hover:bg-[#0b5cff]">
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
