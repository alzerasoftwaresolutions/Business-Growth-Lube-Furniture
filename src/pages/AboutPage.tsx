import React from 'react';
import { SEO } from '../components/ui/SEO';
import { PencilRuler, Layers, Headset } from 'lucide-react';
import { PageHeader, CTAButtonGroup } from '../components/ui/PageHeader';

interface AboutPageProps {
  onRequestQuote: () => void;
  onExploreCollections: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onRequestQuote, onExploreCollections }) => {
  return (
    <>
      <SEO
        title="About Us"
        description="Learn about Lube Furniture's commitment to purposeful design, honest materials, and expert craftsmanship for homes and workspaces."
        canonicalUrl="/about"
      />
      <PageHeader
        eyebrow="About"
        title="A Furniture Brand Built on Consideration"
        copy="Lube Furniture designs and supplies furniture for homes, workspaces, and shared environments — with an emphasis on proportion, material honesty, and everyday function."
      />

      <section className="bg-warm-ivory">
        <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:py-24">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[55fr_45fr] lg:gap-20">
            <div className="space-y-6 text-base leading-relaxed text-secondary-text">
              <p>
                We believe furniture should earn its place in a room. Every Lube piece begins with
                the way a space is actually used — how people gather around a table, how a bedroom
                feels at the end of the day, how a workspace supports focus.
              </p>
              <p>
                Our collections span living, bedroom, dining, and office environments, connected by
                a consistent design language: clean architectural lines, natural materials, and
                construction chosen for longevity rather than novelty.
              </p>
              <p>
                Beyond the catalog, we work directly with homeowners, designers, and businesses to
                shape complete furniture solutions — from a single statement piece to full
                commercial fit-outs.
              </p>

              <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
                {[
                  { icon: PencilRuler, term: 'Design', desc: 'Purposeful forms with no decorative excess.' },
                  { icon: Layers, term: 'Materials', desc: 'Solid timber, natural textiles, honest finishes.' },
                  { icon: Headset, term: 'Support', desc: 'Consultation and solutions for any scale of space.' },
                ].map((item) => (
                  <div key={item.term} className="flex flex-col rounded-xl bg-soft-white p-6 shadow-sm border border-lube-border">
                    <item.icon className="mb-5 h-6 w-6 text-clay" strokeWidth={1.5} />
                    <h3 className="text-sm font-semibold tracking-tight text-dark-graphite">{item.term}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-secondary-text">{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Additional Supporting Photo */}
              <figure className="mt-12 relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-light-stone">
                <img
                  src="/assets/photo_2026-08-08_22-56-56.jpg"
                  alt="A bright, warm detail shot of furniture in a natural light setting"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </figure>
            </div>

            <figure className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-light-stone">
              <img
                src="/assets/photo_2026-08-08_22-59-55.jpg"
                alt="A calm, well-proportioned interior furnished with natural materials"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </figure>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="border-t border-lube-border bg-warm-ivory">
        <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:py-24">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[3fr_7fr] md:items-center md:gap-16">
            <div className="relative aspect-square w-full max-w-[280px] mx-auto md:mx-0 overflow-hidden rounded-2xl bg-light-stone">
              <img
                src="/assets/photo_2023-12-02_21-09-18.jpg"
                alt="Mubarak Abdu, Founder & CEO"
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
            <div>
              <blockquote className="text-xl leading-relaxed text-dark-graphite sm:text-2xl">
                "Every piece we make starts with how a space is actually lived in. I don't believe furniture should shout for attention — it should quietly earn its place, day after day. That's the standard I hold every design to."
              </blockquote>
              <div className="mt-8">
                <p className="font-display text-lg font-medium tracking-tight text-dark-graphite">Mubarak Abdu</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-editorial text-clay">Founder & CEO</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar Section */}
      <section className="border-t border-b border-lube-border bg-warm-ivory">
        <div className="mx-auto max-w-[1320px] px-5 py-8 sm:px-8 lg:py-10">
          <div className="grid grid-cols-2 gap-y-8 divide-x-0 md:grid-cols-4 md:divide-x md:divide-lube-border">
            <div className="flex flex-col items-center text-center px-4">
              <span className="font-display text-3xl sm:text-4xl font-medium text-clay">10+</span>
              <span className="mt-3 text-[10px] font-semibold uppercase tracking-editorial text-dark-graphite">Years Designing</span>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <span className="font-display text-3xl sm:text-4xl font-medium text-clay">500+</span>
              <span className="mt-3 text-[10px] font-semibold uppercase tracking-editorial text-dark-graphite">Projects Delivered</span>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <span className="font-display text-3xl sm:text-4xl font-medium text-clay">Trusted</span>
              <span className="mt-3 text-[10px] font-semibold uppercase tracking-editorial text-dark-graphite">By Homeowners & Hospitality Brands</span>
            </div>
            <div className="flex flex-col items-center text-center px-4">
              <span className="font-display text-3xl sm:text-4xl font-medium text-clay">Handmade</span>
              <span className="mt-3 text-[10px] font-semibold uppercase tracking-editorial text-dark-graphite">To Order</span>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-lube-border bg-light-stone/50">
        <div className="mx-auto max-w-[1320px] px-5 py-16 text-center sm:px-8 lg:py-20">
          <h2 className="text-2xl font-semibold tracking-headline sm:text-3xl">See what consideration looks like</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-secondary-text">
            Browse the collections or start a conversation about your space.
          </p>
          <div className="flex justify-center">
            <CTAButtonGroup primaryLabel="Request a Quote" onPrimary={onRequestQuote} secondaryLabel="Explore Collections" onSecondary={onExploreCollections} />
          </div>
        </div>
      </section>
    </>
  );
};
