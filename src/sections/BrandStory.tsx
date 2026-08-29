import React from 'react';
import { Compass, Layers, Armchair } from 'lucide-react';

interface BrandStoryProps {
  onExploreCollections: () => void;
}

const principles = [
  {
    icon: Compass,
    title: 'Purposeful Design',
    copy: 'Every form begins with a reason.',
  },
  {
    icon: Layers,
    title: 'Considered Materials',
    copy: 'Materials selected for character, performance, and longevity.',
  },
  {
    icon: Armchair,
    title: 'Everyday Function',
    copy: 'Furniture designed to work beautifully in real life.',
  },
];

export const BrandStory: React.FC<BrandStoryProps> = ({ onExploreCollections }) => {
  return (
    <section className="bg-warm-ivory">
      <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[55fr_45fr] lg:items-center lg:gap-20">
          <div>
            <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-editorial text-clay">
              <span className="h-px w-8 bg-clay" aria-hidden="true" />
              OUR APPROACH
            </p>

            <h2 className="mt-5 max-w-xl font-display text-3xl font-medium leading-[1.15] tracking-headline sm:text-4xl lg:text-[2.75rem]">
              Designed Around the Way Spaces Are Lived
            </h2>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-secondary-text lg:text-lg">
              Furniture is more than an object in a room. It shapes how people move, gather, work,
              rest, and experience a space. Our approach begins with understanding those moments and
              creating pieces that support them with clarity, comfort, and purpose.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {principles.map(({ icon: Icon, title, copy }) => (
                <div
                  key={title}
                  className="rounded-[1.25rem] border border-lube-border bg-soft-white p-5 transition-shadow duration-300 hover:shadow-soft"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-clay-subtle">
                    <Icon size={18} strokeWidth={1.75} className="text-clay-dark" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 text-sm font-semibold tracking-tight text-dark-graphite">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-secondary-text">{copy}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-light-stone shadow-soft">
              <img
                src="/assets/photo_2026-08-08_23-00-01.jpg"
                alt="A quiet interior corner showing a considered arrangement of furniture and natural materials"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <button
              onClick={onExploreCollections}
              className="group absolute -bottom-6 left-6 inline-flex items-center gap-2 rounded-full border border-dark-graphite/30 bg-soft-white px-6 py-3.5 text-xs font-semibold uppercase tracking-editorial text-dark-graphite shadow-lift transition-colors hover:border-dark-graphite focus:outline-none focus:ring-2 focus:ring-clay/50"
            >
              See the Collections
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
