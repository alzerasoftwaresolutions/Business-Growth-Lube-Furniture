import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Collection } from '../../types';

interface CollectionFeatureProps {
  collection: Collection;
  onExplore: (collectionId: string) => void;
}

const sizeClasses: Record<Collection['editorialSize'], string> = {
  large: 'md:col-span-7 md:row-span-2 aspect-[4/3] md:aspect-auto md:min-h-[560px]',
  small: 'md:col-span-5 aspect-[4/3] md:aspect-auto md:min-h-[268px]',
  wide: 'md:col-span-5 aspect-[16/9] md:aspect-auto md:min-h-[268px]',
  medium: 'md:col-span-12 aspect-[16/9] md:aspect-auto md:min-h-[320px]'
};

export const CollectionFeature: React.FC<CollectionFeatureProps> = ({ collection, onExplore }) => {
  return (
    <article
      className={`group relative overflow-hidden rounded-[1.5rem] bg-light-stone cursor-pointer transition-shadow duration-300 hover:shadow-lift focus-within:ring-2 focus-within:ring-clay/50 ${sizeClasses[collection.editorialSize]}`}
      onClick={() => onExplore(collection.id)}
      tabIndex={0}
      role="button"
      aria-label={`Explore the ${collection.name} collection`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onExplore(collection.id);
        }
      }}
    >
      <img
        src={collection.image}
        alt={`${collection.name} collection`}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-graphite/80 via-dark-graphite/20 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <p className="text-[11px] font-medium uppercase tracking-editorial text-warm-ivory/70">
          {collection.itemCountLabel}
        </p>
        <h3 className="mt-1.5 text-2xl md:text-3xl font-semibold tracking-headline text-warm-ivory">
          {collection.name}
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-warm-ivory/80 opacity-0 max-h-0 transition-all duration-500 group-hover:opacity-100 group-hover:max-h-24 overflow-hidden">
          {collection.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-editorial text-warm-ivory">
          <span className="border-b border-warm-ivory/40 pb-0.5 transition-colors group-hover:border-clay-light group-hover:text-clay-light">
            Explore {collection.name}
          </span>
          <ArrowRight size={14} strokeWidth={2} className="transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
};
