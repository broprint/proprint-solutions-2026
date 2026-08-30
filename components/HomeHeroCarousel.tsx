'use client';

import Link from 'next/link';
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
    title: 'Large-Format Printing Made Simple',
    text: 'Professional plotters for CAD drawings, technical plans, posters and large-format business printing.',
    href: '/shop?category=Plotters%20%26%20Wide%20Format',
    cta: 'Shop Plotters',
    image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Plotter%20%28HP%29%20%2815427738336%29.jpg',
    imageAlt: 'HP large-format plotter',
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
    title: 'Connect Every Part of Your Business',
    text: 'Switching, routing and network infrastructure for fast, secure and dependable connectivity.',
    href: '/shop?category=Networking',
    cta: 'Shop Networking',
    image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Cisco%20Catalyst%204506-E%20Switch%20001.jpg',
    imageAlt: 'Cisco Catalyst enterprise network switch',
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
    const timer = window.setInterval(() => {
      setActive((value) => (value + 1) % slides.length);
    }, ROTATE_MS);

    return () => window.clearInterval(timer);
  }, []);

  const slide = slides[active];

  return (
    <div className="relative hidden lg:block">
      <div className="absolute -inset-12 rounded-full bg-blue-500/20 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-gradient-to-br from-white/[.09] to-blue-500/[.05] p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
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

          <div className="relative h-[340px] overflow-hidden rounded-[1.7rem] border border-blue-400/20 bg-gradient-to-b from-[#0a2b58] to-[#061321]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(37,99,235,.34),transparent_48%)]" />
            <div className="absolute inset-x-[7%] bottom-5 h-14 rounded-[50%] border border-blue-400/50 bg-blue-500/10 shadow-[0_0_55px_rgba(59,130,246,.6)]" />
            <div className="absolute inset-3 flex items-center justify-center">
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[1.35rem] bg-white/[.97] shadow-2xl">
                <img
                  key={slide.image}
                  src={slide.image}
                  alt={slide.imageAlt}
                  className="h-full w-full object-contain p-3 transition-opacity duration-700"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2" aria-label="Carousel position">
            {slides.map((item, index) => (
              <span
                key={item.title}
                aria-hidden="true"
                className={`h-2.5 rounded-full transition-all duration-500 ${index === active ? 'w-7 bg-[#57a7ff]' : 'w-2.5 bg-white/30'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
