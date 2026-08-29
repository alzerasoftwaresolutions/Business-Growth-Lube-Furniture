import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onView: (product: Product) => void;
  variant?: 'large' | 'compact';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onView, variant = 'compact' }) => {
  const isLarge = variant === 'large';

  return (
    <article
      className={`group flex flex-col bg-soft-white border border-lube-border rounded-[1.25rem] p-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift focus-within:ring-2 focus-within:ring-clay/50 ${
        isLarge ? 'md:flex-row md:items-stretch md:p-4' : ''
      }`}
    >
      <div
        className={`relative overflow-hidden rounded-xl bg-light-stone ${
          isLarge ? 'aspect-[4/3] md:aspect-auto md:w-[56%] md:min-h-[460px]' : 'aspect-square'
        }`}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-warm-ivory/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-editorial text-dark-graphite shadow-sm">
            {product.badge}
          </span>
        )}
      </div>

      <div className={`flex flex-1 flex-col ${isLarge ? 'md:p-6 lg:p-8 md:justify-center' : 'p-3 pt-4'}`}>
        <h3 className={`font-semibold tracking-tight ${isLarge ? 'font-display text-2xl md:text-3xl font-medium tracking-headline' : 'text-base'}`}>
          {product.name}
        </h3>
        <p className={`mt-2 leading-relaxed text-secondary-text ${isLarge ? 'max-w-md text-base' : 'line-clamp-2 text-sm'}`}>
          {product.shortDescription}
        </p>

        <div className={`flex items-center justify-between gap-3 ${isLarge ? 'mt-8' : 'mt-auto pt-4'}`}>
          <button
            onClick={() => onView(product)}
            className="inline-flex items-center gap-1.5 rounded-full bg-clay px-4 py-2 text-xs font-semibold uppercase tracking-editorial text-white transition-colors hover:bg-clay-dark focus:outline-none focus:ring-2 focus:ring-clay/50"
          >
            View Product
            <ArrowUpRight size={13} strokeWidth={2} />
          </button>
        </div>
      </div>
    </article>
  );
};
