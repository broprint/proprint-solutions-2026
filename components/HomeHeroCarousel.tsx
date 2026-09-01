'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const slides = [
  {
    title: 'Printers & MFPs',
    href: '/shop?category=Printers%20%26%20MFPs',
    image: 'https://http2.mlstatic.com/D_NQ_NP_965572-MLU78084574980_082024-F.jpg',
    imageAlt: 'HP LaserJet Pro MFP 4103fdw business printer',
    fit: 'contain',
  },
  {
    title: 'Plotters & Wide Format',
    href: '/shop?category=Plotters%20%26%20Wide%20Format',
    image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Plotter%20%28HP%29%20%2815427738336%29.jpg',
    imageAlt: 'HP large-format plotter',
    fit: 'cover',
  },
  {
    title: 'Business Computers',
    href: '/shop?category=Computers',
    image: 'https://kr-media.apjonlinecdn.com/catalog/product/B/9/B94E9PT-11_T1739342255.png',
    imageAlt: 'HP business laptop',
    fit: 'contain',
  },
  {
    title: 'Networking',
    href: '/shop?category=Networking',
    image: 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Cisco%20Catalyst%204506-E%20Switch%20001.jpg',
    imageAlt: 'Cisco Catalyst enterprise network switch',
    fit: 'cover',
  },
  {
    title: 'Servers & Storage',
    href: '/shop?category=Servers%20%26%20Storage',
    image: 'https://www.hpe.com/content/dam/hpe/shared-publishing/images-norend/marquee-png/HPE-Smart-Choice-servers-600x528.png',
    imageAlt: 'HPE ProLiant server lineup',
    fit: 'contain',
  },
] as const;

const ROTATE_MS = 10 * 1000;

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
      <div className="relative overflow-hidden rounded-[2rem] border border-blue-300/20 bg-[#071b36] shadow-2xl shadow-black/30">
        <div className="absolute inset-0 hero-grid opacity-20" />

        <Link
          href={slide.href}
          className="group relative block h-[470px] overflow-hidden"
          aria-label={`Shop ${slide.title}`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_65%_45%,rgba(11,92,255,.38),transparent_55%)]" />
          <div className="absolute inset-x-[6%] bottom-10 h-16 rounded-[50%] border border-blue-400/50 bg-blue-500/10 shadow-[0_0_70px_rgba(59,130,246,.7)]" />

          <img
            key={slide.image}
            src={slide.image}
            alt={slide.imageAlt}
            className={`absolute inset-0 h-full w-full transition duration-700 ${
              slide.fit === 'cover'
                ? 'object-cover scale-[1.08] group-hover:scale-[1.11]'
                : 'object-contain p-5 scale-[1.12] group-hover:scale-[1.16]'
            }`}
          />

          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#061321] via-[#061321]/70 to-transparent" />
          <div className="absolute bottom-6 left-6 rounded-full border border-blue-300/25 bg-[#061321]/80 px-4 py-2 text-xs font-black uppercase tracking-[.14em] text-blue-100 backdrop-blur-md">
            {slide.title}
          </div>
        </Link>

        <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 items-center justify-center gap-2 rounded-full bg-[#061321]/75 px-3 py-2 backdrop-blur" aria-label="Carousel position">
          {slides.map((item, index) => (
            <span
              key={item.title}
              aria-hidden="true"
              className={`h-2.5 rounded-full transition-all duration-500 ${index === active ? 'w-7 bg-[#57a7ff]' : 'w-2.5 bg-white/45'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
