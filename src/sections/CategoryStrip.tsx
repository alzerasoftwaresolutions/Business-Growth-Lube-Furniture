import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { collectionsData } from '../data/collections';

interface CategoryStripProps {
  onExploreCollection: (collectionId: string) => void;
}

export const CategoryStrip: React.FC<CategoryStripProps> = ({ onExploreCollection }) => {
  return (
    <section className="bg-warm-ivory" aria-label="Browse by collection">
      <div className="mx-auto max-w-[1320px] px-5 py-12 sm:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {collectionsData.map((collection) => (
            <button
              key={collection.id}
              onClick={() => onExploreCollection(collection.id)}
              className="group flex items-center gap-4 rounded-2xl border border-lube-border bg-soft-white p-3 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-clay/40 hover:shadow-soft focus:outline-none focus:ring-2 focus:ring-clay/50"
            >
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-light-stone sm:h-16 sm:w-16">
                <img
                  src={collection.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold tracking-tight text-dark-graphite">
                  {collection.name}
                </span>
                <span className="mt-0.5 block text-xs text-secondary-text">{collection.itemCountLabel}</span>
              </span>
              <ArrowUpRight
                size={16}
                strokeWidth={1.75}
                className="shrink-0 text-secondary-text transition-colors group-hover:text-clay"
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
