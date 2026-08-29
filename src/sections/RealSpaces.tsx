import React from 'react';
import { SectionHeading } from '../components/ui/SectionHeading';

export const RealSpaces: React.FC = () => {
  return (
    <section className="bg-warm-ivory">
      <div className="mx-auto max-w-[1320px] px-5 py-20 sm:px-8 lg:py-28">
        <SectionHeading
          eyebrow="In Real Spaces"
          title="Designed to Belong in the Space"
          copy="A well-designed piece should not compete with its surroundings. It should become part of them — supporting the architecture, the people, and the way the space is used."
          align="center"
        />

        <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-[62fr_38fr] lg:gap-6">
          <figure className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] bg-light-stone shadow-soft lg:aspect-auto lg:min-h-[520px]">
            <img
              src="/assets/photo_2026-08-08_22-57-55.jpg"
              alt="A furnished living space where furniture sits naturally within warm architecture"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </figure>

          <div className="grid grid-cols-1 gap-5 lg:gap-6">
            <figure className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-light-stone">
              <img
                src="/assets/photo_2026-08-08_22-58-19.jpg"
                alt="Detail of a calm dining corner with natural materials"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </figure>
            <figcaption className="border-l-2 border-clay/60 pl-5 text-sm leading-relaxed text-secondary-text lg:mt-2">
              From a single statement chair to a complete environment — the same quiet logic of
              proportion and material carries through every Lube piece.
            </figcaption>
          </div>
        </div>
      </div>
    </section>
  );
};
