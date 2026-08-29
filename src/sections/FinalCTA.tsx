import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FinalCTAProps {
  onRequestQuote: () => void;
  onExploreCollections: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onRequestQuote, onExploreCollections }) => {
  return (
    <section className="bg-warm-ivory">
      <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:py-24">
        <div className="rounded-[2rem] bg-clay px-6 py-16 text-center sm:px-12 lg:py-24">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-medium leading-[1.15] tracking-headline text-white sm:text-4xl lg:text-5xl">
            Have a Space in Mind?
          </h2>
          <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-white/85 lg:text-lg">
            Let's talk about the furniture that belongs in it.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={onRequestQuote}
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-clay px-8 py-4 text-sm font-medium text-white transition-colors hover:bg-clay-dark focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              Request a Quote
              <ArrowRight size={16} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={onExploreCollections}
              className="inline-flex items-center justify-center rounded-full border border-dark-graphite/30 bg-soft-white px-8 py-4 text-sm font-medium text-dark-graphite transition-colors hover:border-dark-graphite focus:outline-none focus:ring-2 focus:ring-clay/50"
            >
              Explore Collections
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
