'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ProductVisual } from '@/components/ProductVisual';
import type { Product } from '@/data/catalog';

export function ProductGallery({ product }: { product: Product }) {
  const images = product.images?.filter(Boolean) ?? [];
  const [selectedImage, setSelectedImage] = useState(images[0] ?? product.image);

  if (images.length === 0 && !product.image) {
    return (
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <ProductVisual icon={product.icon} imageAlt={product.imageAlt || product.name} />
      </div>
    );
  }

  const gallery = images.length > 0 ? images : product.image ? [product.image] : [];

  return (
    <div>
      <div className="relative h-[360px] overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm md:h-[460px]">
        {selectedImage && (
          <Image
            src={selectedImage}
            alt={product.imageAlt || product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 52vw"
            className="object-contain p-8"
          />
        )}
      </div>

      {gallery.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {gallery.map((image, index) => {
            const selected = image === selectedImage;
            return (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => setSelectedImage(image)}
                aria-label={`View product image ${index + 1}`}
                className={`relative aspect-square overflow-hidden rounded-xl border bg-white transition ${selected ? 'border-[#0b5cff] ring-2 ring-blue-100' : 'border-slate-200 hover:border-slate-400'}`}
              >
                <Image
                  src={image}
                  alt={`${product.imageAlt || product.name} ${index + 1}`}
                  fill
                  sizes="120px"
                  className="object-contain p-2"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
