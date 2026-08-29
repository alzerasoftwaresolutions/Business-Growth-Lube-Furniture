import React from 'react';
import { ArrowRight } from 'lucide-react';

interface StartWithSpaceProps {
  onRequestQuote: () => void;
  onContact: () => void;
}

export const StartWithSpace: React.FC<StartWithSpaceProps> = ({ onRequestQuote, onContact }) => {
  return (
    <section className="bg-warm-ivory">
      <div className="mx-auto max-w-[1320px] px-5 py-20 sm:px-8 lg:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[50fr_50fr] lg:items-center lg:gap-20">
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-light-stone shadow-soft lg:aspect-[5/6]">
              <img
                src="/assets/photo_2026-08-08_22-57-32.jpg"
                alt="An open interior space with natural light, ready to be furnished"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div className="absolute -right-4 -top-4 hidden h-32 w-32 border border-clay/30 lg:block" aria-hidden="true" />
          </div>

          <div className="order-1 lg:order-2">
            <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-editorial text-clay">
              <span className="h-px w-8 bg-clay" aria-hidden="true" />
              Begin Your Project
            </p>
            <h2 className="mt-5 text-3xl font-semibold leading-[1.15] tracking-headline sm:text-4xl lg:text-[2.75rem]">
              Start With the Space
            </h2>
            <p className="mt-6 max-w-lg border-l-2 border-lube-border pl-5 text-base leading-relaxed text-secondary-text lg:text-lg">
              The right furniture begins with understanding the space it belongs to. Tell us what
              you're working with, what you need, and what you're imagining. We'll help you find the
              right place to start.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                onClick={onRequestQuote}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-clay px-8 py-4 text-sm font-medium text-white transition-colors hover:bg-clay-dark focus:outline-none focus:ring-2 focus:ring-clay/50"
              >
                Request a Quote
                <ArrowRight size={16} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
              </button>
              <button
                onClick={onContact}
                className="inline-flex items-center justify-center rounded-full border border-dark-graphite/30 bg-soft-white px-8 py-4 text-sm font-medium text-dark-graphite transition-colors hover:border-dark-graphite focus:outline-none focus:ring-2 focus:ring-clay/50"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
