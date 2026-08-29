import React, { useEffect, useState } from 'react';
import { X, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../../types';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onRequestQuote: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onRequestQuote,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const images = product?.gallery?.length ? product.gallery : [product?.image].filter(Boolean) as string[];

  useEffect(() => {
    if (product) {
      document.body.style.overflow = 'hidden';
      setActiveImageIndex(0);
      setLightboxIndex(0);
      setLightboxOpen(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [product]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxOpen) setLightboxOpen(false);
        else onClose();
      }
      if (lightboxOpen && images.length > 1) {
        if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev + 1) % images.length);
        if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, lightboxOpen, images.length]);

  if (!product) return null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % images.length);
  };
  
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[100] flex items-end justify-center bg-dark-graphite/60 backdrop-blur-sm sm:items-center sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-label={`${product.name} details`}
        onClick={onClose}
      >
        <div
          className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto bg-warm-ivory shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            aria-label="Close product details"
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center bg-warm-ivory/80 text-secondary-text backdrop-blur transition-colors hover:bg-light-stone hover:text-dark-graphite"
          >
            <X size={20} strokeWidth={1.75} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="flex flex-col border-r border-lube-border bg-light-stone">
              <div 
                className="relative aspect-[4/3] flex-1 cursor-pointer md:aspect-auto md:min-h-[480px]"
                onClick={() => {
                  setLightboxIndex(activeImageIndex);
                  setLightboxOpen(true);
                }}
                title="Click to enlarge"
              >
                <img
                  src={images[activeImageIndex]}
                  alt={product.name}
                  className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
                />
              </div>
              
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto border-t border-lube-border bg-warm-ivory p-4 md:p-6 scrollbar-hide">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative h-20 w-20 shrink-0 overflow-hidden bg-light-stone focus:outline-none focus:ring-2 focus:ring-clay ${
                        idx === activeImageIndex ? 'ring-2 ring-clay' : 'opacity-60 transition-opacity hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col p-6 sm:p-10 bg-warm-ivory">
              {product.contextTag && (
                <p className="text-xs font-medium uppercase tracking-editorial text-clay">
                  {product.contextTag}
                </p>
              )}
              <h2 className="mt-2 text-3xl font-semibold tracking-headline">{product.name}</h2>
              <p className="mt-4 text-sm leading-relaxed text-secondary-text md:text-base">
                {product.fullDescription}
              </p>

              <dl className="mt-8 space-y-5 border-t border-lube-border pt-8">
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-editorial text-secondary-text">
                    Materials
                  </dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-dark-graphite">
                    {product.materials.join(' · ')}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] font-semibold uppercase tracking-editorial text-secondary-text">
                    Dimensions
                  </dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-dark-graphite">{product.dimensions}</dd>
                </div>
              </dl>

              <div className="mt-auto pt-10">
                <button
                  onClick={() => onRequestQuote(product)}
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-clay px-8 py-4 text-sm font-medium text-white transition-colors hover:bg-clay-dark focus:outline-none focus:ring-2 focus:ring-clay/50 sm:w-auto"
                >
                  Request a Quote for this Piece
                  <ArrowRight size={16} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-dark-graphite/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Close lightbox"
            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center text-white/70 transition-colors hover:text-white focus:outline-none md:right-8 md:top-8"
          >
            <X size={32} strokeWidth={1.5} />
          </button>
          
          <img
            src={images[lightboxIndex]}
            alt={product.name}
            className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          
          {images.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-white/70 transition-colors hover:text-white focus:outline-none md:left-8"
                aria-label="Previous image"
              >
                <ChevronLeft size={40} strokeWidth={1.5} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-white/70 transition-colors hover:text-white focus:outline-none md:right-8"
                aria-label="Next image"
              >
                <ChevronRight size={40} strokeWidth={1.5} />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};
