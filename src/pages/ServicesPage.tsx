import React from 'react';
import { SEO } from '../components/ui/SEO';
import { Check } from 'lucide-react';
import { PageHeader, CTAButtonGroup } from '../components/ui/PageHeader';
import { servicesData } from '../data/services';
import { ServicesFAQ } from '../sections/ServicesFAQ';

interface ServicesPageProps {
  onRequestQuote: () => void;
  onContact: () => void;
}

const stageLabels: Record<string, string> = {
  '01': 'Start Here',
  '02': 'Grow Further',
  '03': 'Go Commercial'
};

export const ServicesPage: React.FC<ServicesPageProps> = ({ onRequestQuote, onContact }) => {
  return (
    <>
      <SEO
        title="Services & Consultation"
        description="From single room furniture consultations to complete commercial hospitality solutions. Discover how Lube Furniture can help bring your vision to life."
        canonicalUrl="/services"
      />
      <PageHeader
        eyebrow="Services"
        title="From First Idea to Finished Space"
        copy="Furniture decisions are easier with the right support. Lube offers consultation, curated solutions, and contract-grade programs for commercial environments."
      />

      <section className="bg-warm-ivory">
        <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:py-24">
          <p className="mx-auto mb-16 max-w-3xl text-center text-sm leading-relaxed text-secondary-text md:text-base">
            Most clients start with a conversation, then move into a full furniture solution, and for larger operations, scale into an ongoing commercial program.
          </p>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {servicesData.map((service) => (
              <article key={service.id} className="flex flex-col rounded-2xl border border-lube-border bg-soft-white p-8 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-6 flex items-center gap-4">
                  <div className="inline-flex bg-dark-graphite px-4 py-2 text-xs font-semibold tracking-editorial text-warm-ivory">
                    {service.number}
                  </div>
                  {stageLabels[service.number] && (
                    <span className="text-xs uppercase tracking-editorial text-clay">
                      {stageLabels[service.number]}
                    </span>
                  )}
                </div>
                
                <div className="flex flex-1 flex-col">
                  <h2 className="text-xl font-semibold tracking-headline sm:text-2xl">{service.title}</h2>
                  <p className="mt-1.5 text-sm font-medium text-walnut">{service.tagline}</p>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-secondary-text">
                    {service.description}
                  </p>

                  <ul className="mt-7 space-y-3 border-t border-lube-border pt-6">
                  {service.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-3 text-sm text-dark-graphite">
                      <Check size={16} strokeWidth={2} className="mt-0.5 shrink-0 text-clay" />
                      {detail}
                    </li>
                  ))}
                </ul>

                <p className="mt-6 text-xs uppercase tracking-editorial text-secondary-text">
                  Suited to: <span className="font-medium normal-case tracking-normal text-dark-graphite">{service.suitableFor}</span>
                </p>
              </div>
            </article>
          ))}
          </div>
        </div>
      </section>

      <ServicesFAQ />

      <section className="border-t border-lube-border bg-light-stone/50">
        <div className="mx-auto max-w-[1320px] px-5 py-16 text-center sm:px-8 lg:py-20">
          <h2 className="text-2xl font-semibold tracking-headline sm:text-3xl">Not sure where to begin?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-secondary-text">
            Start with a conversation. We'll help you shape the brief.
          </p>
          <div className="flex justify-center">
            <CTAButtonGroup primaryLabel="Request a Quote" onPrimary={onRequestQuote} secondaryLabel="Contact Us" onSecondary={onContact} />
          </div>
        </div>
      </section>
    </>
  );
};
