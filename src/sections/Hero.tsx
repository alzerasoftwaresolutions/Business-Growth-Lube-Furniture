import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  onExploreCollections: () => void;
  onRequestQuote: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreCollections, onRequestQuote }) => {
  return (
    <section className="border-b border-lube-border bg-warm-ivory">
      <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-5 pb-16 pt-12 sm:px-8 lg:min-h-[calc(100vh-72px)] lg:grid-cols-[46fr_54fr] lg:items-center lg:gap-16 lg:pb-24 lg:pt-16">
        <div className="order-2 lg:order-1">
          <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-editorial text-clay">
            <span className="h-px w-8 bg-clay" aria-hidden="true" />
            NEW COLLECTION
          </p>

          <h1 className="mt-6 font-display text-[2.75rem] font-medium leading-[1.06] tracking-headline text-dark-graphite sm:text-6xl lg:text-[4.25rem]">
            Furniture Designed
            <br />
            for{' '}
            <em className="font-display font-medium italic text-clay">Modern Spaces</em>
          </h1>

          <p className="mt-7 max-w-lg text-base leading-relaxed text-secondary-text lg:text-lg">
            Thoughtfully designed furniture for homes, workspaces, and environments where people
            gather, live, and work. Lube brings together considered form, practical function, and a
            refined approach to materials.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              onClick={onExploreCollections}
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-dark-graphite/30 bg-soft-white px-8 py-4 text-sm font-medium text-dark-graphite transition-all hover:border-dark-graphite focus:outline-none focus:ring-2 focus:ring-clay/50"
            >
              Explore Collections
              <ArrowRight size={16} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={onRequestQuote}
              className="inline-flex items-center justify-center rounded-full bg-clay px-8 py-4 text-sm font-medium text-white transition-colors hover:bg-clay-dark focus:outline-none focus:ring-2 focus:ring-clay/50"
            >
              Request a Quote
            </button>
          </div>
        </div>

        <div className="relative order-1 lg:order-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-light-stone shadow-soft lg:aspect-[5/6]">
            <img
              src="/assets/photo_2026-08-08_22-59-08.jpg"
              alt="A warm modern living space with neutral upholstered furniture and natural light"
              className="absolute inset-0 h-full w-full object-cover"
              fetchPriority="high"
            />
          </div>

          <button
            onClick={onExploreCollections}
            className="group absolute -bottom-6 left-5 flex items-center gap-4 rounded-2xl bg-soft-white p-4 pr-6 text-left shadow-lift transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-clay/50 sm:left-8"
          >
            <img
              src="/assets/photo_2026-08-08_22-57-55.jpg"
              alt=""
              aria-hidden="true"
              className="h-14 w-14 rounded-xl object-cover"
            />
            <span>
              <span className="block text-sm font-semibold tracking-tight text-dark-graphite">
                The Living Collection
              </span>
              <span className="mt-0.5 inline-flex items-center gap-1.5 text-xs font-medium text-clay">
                Explore the look
                <ArrowRight size={13} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
              </span>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
