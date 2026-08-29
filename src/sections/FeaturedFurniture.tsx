import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { ProductCard } from '../components/products/ProductCard';
import { productsData } from '../data/products';
import { Product } from '../types';

interface FeaturedFurnitureProps {
  onViewProduct: (product: Product) => void;
}

export const FeaturedFurniture: React.FC<FeaturedFurnitureProps> = ({ onViewProduct }) => {
  const mainFeatured = productsData.find((p) => p.isMainFeatured) ?? productsData[0];
  const supporting = productsData.filter((p) => p.id !== mainFeatured.id && p.isFeatured).slice(0, 3);

  return (
    <section className="bg-warm-ivory">
      <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Featured Furniture"
            title="A Closer Look"
            copy="Explore a selection of pieces from the Lube Furniture collection. Each design brings together considered proportions, materials, comfort, and function."
          />
        </div>

        <div className="mt-12 space-y-5 lg:space-y-6">
          <ProductCard product={mainFeatured} onView={onViewProduct} variant="large" />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {supporting.map((product) => (
              <ProductCard key={product.id} product={product} onView={onViewProduct} />
            ))}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => onViewProduct(supporting[0] ?? mainFeatured)}
            className="group inline-flex items-center gap-2 rounded-full border border-dark-graphite/30 bg-soft-white px-7 py-3.5 text-xs font-semibold uppercase tracking-editorial text-dark-graphite transition-colors hover:border-dark-graphite focus:outline-none focus:ring-2 focus:ring-clay/50"
          >
            Explore More Pieces
            <ArrowRight size={14} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};
