import React, { useState } from 'react';
import { SEO } from '../components/ui/SEO';
import { PageHeader, CTAButtonGroup } from '../components/ui/PageHeader';
import { ProductCard } from '../components/products/ProductCard';
import { collectionsData } from '../data/collections';
import { productsData } from '../data/products';
import { Product } from '../types';

interface CollectionsPageProps {
  initialCollection?: string;
  onRequestQuote: () => void;
  onViewProduct: (product: Product) => void;
}

export const CollectionsPage: React.FC<CollectionsPageProps> = ({
  initialCollection,
  onRequestQuote,
  onViewProduct,
}) => {
  const [activeId, setActiveId] = useState<string>(initialCollection ?? 'living');
  const active = collectionsData.find((c) => c.id === activeId) ?? collectionsData[0];
  const activeProducts = productsData.filter((p) => p.collectionId === active.id);

  return (
    <>
      <SEO
        title="Furniture Collections"
        description="Browse our curated furniture collections. Handcrafted pieces organized for modern living rooms, bedrooms, dining spaces, and executive workspaces."
        canonicalUrl="/collections"
      />
      <PageHeader
        eyebrow="Collections"
        title="Furniture Organized by the Way You Live"
        copy="Four collections, one approach. Browse pieces designed for living rooms, bedrooms, dining spaces, and modern workspaces."
      />

      <section className="bg-warm-ivory">
        <div className="mx-auto max-w-[1320px] px-5 py-14 sm:px-8 lg:py-20">
          <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by collection">
            {collectionsData.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={activeId === c.id}
                onClick={() => setActiveId(c.id)}
                className={`px-5 py-2.5 text-xs font-semibold uppercase tracking-editorial transition-colors focus:outline-none focus:ring-2 focus:ring-clay/50 ${
                  activeId === c.id
                    ? 'bg-dark-graphite text-warm-ivory'
                    : 'border border-lube-border bg-soft-white text-secondary-text hover:border-dark-graphite hover:text-dark-graphite'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[38fr_62fr] lg:gap-12">
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <figure className="relative aspect-[4/3] overflow-hidden bg-light-stone">
                <img src={active.image} alt={`${active.name} collection`} className="absolute inset-0 h-full w-full object-cover" />
              </figure>
              <p className="mt-6 text-[11px] font-semibold uppercase tracking-editorial text-clay">
                {active.itemCountLabel}
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-headline">{active.name}</h2>
              <p className="mt-1 text-sm font-medium text-walnut">{active.tagline}</p>
              <p className="mt-4 text-sm leading-relaxed text-secondary-text">{active.description}</p>
            </aside>

            <div>
              {activeProducts.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {activeProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onView={onViewProduct} />
                  ))}
                </div>
              ) : (
                <p className="border border-lube-border bg-soft-white p-8 text-sm leading-relaxed text-secondary-text">
                  Pieces from the {active.name} collection are being documented. Request a quote and
                  our team will share the current range with you directly.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-lube-border bg-light-stone/50">
        <div className="mx-auto max-w-[1320px] px-5 py-16 text-center sm:px-8 lg:py-20">
          <h2 className="text-2xl font-semibold tracking-headline sm:text-3xl">Looking for something specific?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-secondary-text">
            Tell us about your space and we'll point you to the right pieces — or design around them.
          </p>
          <div className="flex justify-center">
            <CTAButtonGroup primaryLabel="Request a Quote" onPrimary={onRequestQuote} />
          </div>
        </div>
      </section>
    </>
  );
};
