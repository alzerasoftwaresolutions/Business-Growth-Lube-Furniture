import React from 'react';
import { ArrowRight } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { servicesData } from '../data/services';

interface ServicesBridgeProps {
  onExploreServices: () => void;
  onRequestQuote: () => void;
}

export const ServicesBridge: React.FC<ServicesBridgeProps> = ({ onExploreServices, onRequestQuote }) => {
  return (
    <section className="border-y border-lube-border bg-light-stone/50">
      <div className="mx-auto max-w-[1320px] px-5 py-20 sm:px-8 lg:py-28">
        <SectionHeading
          eyebrow="Services"
          title="More Than Choosing a Piece"
          copy="Every space has different requirements. Whether you're furnishing a home, developing a workplace, or planning a larger environment, Lube can help you move from an idea to the right furniture solution."
        />

        <div className="mt-14 grid grid-cols-1 border-t border-lube-border md:grid-cols-3">
          {servicesData.map((service) => (
            <article
              key={service.id}
              className="group flex flex-col border-b border-lube-border px-0 py-10 md:border-b-0 md:px-8 md:first:pl-0 md:last:pr-0"
            >
              <span className="text-sm font-semibold tracking-editorial text-clay">{service.number}</span>
              <h3 className="mt-4 text-xl font-semibold tracking-headline text-dark-graphite">
                {service.title}
              </h3>
              <p className="mt-2 text-sm font-medium text-walnut">{service.tagline}</p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-secondary-text">
                {service.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            onClick={onExploreServices}
            className="group inline-flex items-center justify-center gap-2 rounded-full border border-dark-graphite/30 bg-soft-white px-8 py-4 text-sm font-medium text-dark-graphite transition-colors hover:border-dark-graphite focus:outline-none focus:ring-2 focus:ring-clay/50"
          >
            Explore Services
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
    </section>
  );
};
