import { SolutionSlot } from '../solutions';
import React from 'react';
import { SEO } from '../components/ui/SEO';
import { Calendar, ArrowRight } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';

interface BookingPageProps {
  onContact: () => void;
  onRequestQuote: () => void;
}

interface CoreBookingFallbackProps {
  onContact: () => void;
}

export const CoreBookingFallback: React.FC<CoreBookingFallbackProps> = ({ onContact }) => {
  return (
    <div
      className="border border-lube-border bg-soft-white p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm"
      data-testid="core-booking-fallback"
    >
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-clay/10 text-clay mb-6">
        <Calendar size={28} strokeWidth={1.75} />
      </div>
      <h2 className="text-xl font-semibold tracking-headline text-dark-graphite sm:text-2xl mb-3">
        Online Studio Booking Unavailable
      </h2>
      <p className="mx-auto max-w-md text-sm leading-relaxed text-secondary-text mb-8">
        Online self-service booking for private showroom walkthroughs and joinery consultations is currently offline. Our studio team is available directly to arrange your private design session.
      </p>
      <button
        type="button"
        onClick={onContact}
        className="group inline-flex items-center justify-center gap-2 rounded-full bg-clay px-8 py-3.5 text-xs font-semibold uppercase tracking-editorial text-white hover:bg-clay-dark active:scale-[0.98] transition-all"
      >
        Contact Studio Team
        <ArrowRight size={14} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
};

export const BookingPage: React.FC<BookingPageProps> = ({ onContact }) => {
  return (
    <>
      <SEO
        title="Book a Consultation"
        description="Schedule a private showroom appointment or custom furniture consultation with the Lube Furniture design team."
        canonicalUrl="/booking"
      />
      <PageHeader
        eyebrow="Consultation"
        title="Studio Design Sessions"
        copy="Reserve an in-studio consultation with our joinery specialists and space planners for your residential or commercial project."
      />

      <section className="bg-warm-ivory py-16 sm:py-24">
        <div className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <div className="mx-auto max-w-2xl">
            <SolutionSlot
              name="booking:widget"
              fallback={<CoreBookingFallback onContact={onContact} />}
              props={{ roomType: 'Living & Dining Environments' }}
            />
          </div>
        </div>
      </section>
    </>
  );
};
