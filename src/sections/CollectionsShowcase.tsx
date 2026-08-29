import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { CollectionFeature } from '../components/collections/CollectionFeature';
import { collectionsData } from '../data/collections';

interface CollectionsShowcaseProps {
  onExploreCollection: (collectionId: string) => void;
}

export const CollectionsShowcase: React.FC<CollectionsShowcaseProps> = ({ onExploreCollection }) => {
  return (
    <section id="collections" className="border-y border-lube-border bg-light-stone/50">
      <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Collections"
            title="Collections for the Way You Live"
            copy="Different spaces ask for different things. Explore furniture designed for living, sleeping, dining, and working — connected by the same approach to proportion, material, comfort, and function."
          />
          <button
            onClick={() => onExploreCollection('living')}
            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-dark-graphite/30 bg-soft-white px-6 py-3 text-xs font-semibold uppercase tracking-editorial text-dark-graphite transition-colors hover:border-dark-graphite focus:outline-none focus:ring-2 focus:ring-clay/50"
          >
            View All Collections
            <ArrowRight size={14} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-12 lg:gap-6">
          {collectionsData.map((collection) => (
            <CollectionFeature
              key={collection.id}
              collection={collection}
              onExplore={onExploreCollection}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
