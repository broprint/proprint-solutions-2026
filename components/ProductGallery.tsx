'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Minus, Plus, X } from 'lucide-react';
import { ProductVisual } from '@/components/ProductVisual';
import type { Product } from '@/data/catalog';

export function ProductGallery({ product }: { product: Product }) {
  const images = product.images?.filter(Boolean) ?? [];
  const gallery = images.length > 0 ? images : product.image ? [product.image] : [];
  const [selectedImage, setSelectedImage] = useState(gallery[0] ?? product.image);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoom, setZoom] = useState(1);

  const selectedIndex = Math.max(0, gallery.findIndex(image => image === selectedImage));

  const showImage = (index: number) => {
    if (!gallery.length) return;
    const normalized = (index + gallery.length) % gallery.length;
    setSelectedImage(gallery[normalized]);
    setZoom(1);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setZoom(1);
  };

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeLightbox();
      if (event.key === 'ArrowLeft' && gallery.length > 1) showImage(selectedIndex - 1);
      if (event.key === 'ArrowRight' && gallery.length > 1) showImage(selectedIndex + 1);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxOpen, selectedIndex, gallery.length]);

  if (images.length === 0 && !product.image) {
    return <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm"><ProductVisual icon={product.icon} imageAlt={product.imageAlt || product.name}/></div>;
  }

  return <div>
    <button type="button" onClick={() => setLightboxOpen(true)} aria-label={`Enlarge ${product.name} image`} className="group relative block h-[360px] w-full cursor-zoom-in overflow-hidden rounded-[2rem] border border-slate-200 bg-white text-left shadow-sm md:h-[460px]">
      {selectedImage&&<Image src={selectedImage} alt={product.imageAlt || product.name} fill priority sizes="(max-width: 1024px) 100vw, 52vw" className="object-contain p-8"/>}
      <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-4 py-2 text-xs font-black text-white shadow-lg backdrop-blur transition group-hover:bg-slate-900"><Maximize2 size={15}/> Click to enlarge</span>
    </button>

    {gallery.length>1&&<div className="mt-4 grid grid-cols-5 gap-3">{gallery.map((image,index)=>{const selected=image===selectedImage;return <button key={`${image}-${index}`} type="button" onClick={()=>{setSelectedImage(image);setZoom(1);}} aria-label={`View product image ${index+1}`} className={`relative aspect-square overflow-hidden rounded-xl border bg-white transition ${selected?'border-[#0b5cff] ring-2 ring-blue-100':'border-slate-200 hover:border-slate-400'}`}><Image src={image} alt={`${product.imageAlt || product.name} ${index+1}`} fill sizes="120px" className="object-contain p-2"/></button>;})}</div>}

    {lightboxOpen&&selectedImage&&<div role="dialog" aria-modal="true" aria-label={`${product.name} image viewer`} className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 p-4 md:p-8" onClick={closeLightbox}>
      <div className="absolute right-4 top-4 z-20 flex items-center gap-2" onClick={event=>event.stopPropagation()}>
        <button type="button" onClick={()=>setZoom(value=>Math.max(1,value-0.5))} disabled={zoom<=1} aria-label="Zoom out" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow disabled:opacity-40"><Minus size={20}/></button>
        <span className="min-w-14 rounded-full bg-white px-3 py-2 text-center text-xs font-black text-slate-900 shadow">{Math.round(zoom*100)}%</span>
        <button type="button" onClick={()=>setZoom(value=>Math.min(3,value+0.5))} disabled={zoom>=3} aria-label="Zoom in" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow disabled:opacity-40"><Plus size={20}/></button>
        <button type="button" onClick={closeLightbox} aria-label="Close image viewer" className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-900 shadow"><X size={22}/></button>
      </div>

      {gallery.length>1&&<><button type="button" onClick={event=>{event.stopPropagation();showImage(selectedIndex-1);}} aria-label="Previous image" className="absolute left-3 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-900 shadow md:left-6"><ChevronLeft size={26}/></button><button type="button" onClick={event=>{event.stopPropagation();showImage(selectedIndex+1);}} aria-label="Next image" className="absolute right-3 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-900 shadow md:right-6"><ChevronRight size={26}/></button></>}

      <div className="relative h-[78vh] w-[88vw] overflow-auto" onClick={event=>event.stopPropagation()}>
        <div className="relative h-full w-full transition-transform duration-200" style={{transform:`scale(${zoom})`}}><Image src={selectedImage} alt={product.imageAlt || product.name} fill sizes="95vw" className="object-contain" priority/></div>
      </div>
      {gallery.length>1&&<div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/95 px-4 py-2 text-xs font-black text-slate-900 shadow">{selectedIndex+1} / {gallery.length}</div>}
    </div>}
  </div>;
}
