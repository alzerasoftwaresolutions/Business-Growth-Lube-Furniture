import React from 'react';
import { TreePine, Layers, Hammer, Droplet } from 'lucide-react';
import { SectionHeading } from '../components/ui/SectionHeading';
import { materialsData } from '../data/materials';

const iconMap: Record<string, React.ElementType> = {
  Wood: TreePine,
  Fabric: Layers,
  Joinery: Hammer,
  Finish: Droplet
};

export const MaterialsCraft: React.FC = () => {
  return (
    <section className="border-y border-lube-border bg-soft-white">
      <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:py-24">
        <SectionHeading
          eyebrow="Materials & Craft"
          title="The Details Matter"
          copy="Material, texture, proportion, joinery, and finish all influence how a piece looks, feels, and performs over time."
        />

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {materialsData.map((material) => {
            const Icon = iconMap[material.category] || TreePine;
            return (
              <article
                key={material.id}
                className="group flex flex-col rounded-[1.25rem] border border-lube-border bg-warm-ivory p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              >
                <Icon size={32} strokeWidth={1.25} className="mb-6 text-clay" />
                <h3 className="text-base font-semibold tracking-tight text-dark-graphite">{material.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-secondary-text">{material.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
