import React, { useState } from 'react';
import { SEO } from '../components/ui/SEO';
import { Mail, Phone, MapPin, Check } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';

interface ContactPageProps {
  onRequestQuote: () => void;
}

const inputClass =
  'w-full border border-lube-border bg-soft-white px-4 py-3 text-sm text-dark-graphite placeholder:text-secondary-text/60 focus:border-clay focus:outline-none focus:ring-1 focus:ring-clay transition-colors rounded-none';

export const ContactPage: React.FC<ContactPageProps> = ({ onRequestQuote }) => {
  const [sent, setSent] = useState(false);

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with Lube Furniture. Have questions about our pieces or need a custom consultation? Contact our design team today."
        canonicalUrl="/contact"
      />
      <PageHeader
        eyebrow="Contact"
        title="Let's Talk About Your Space"
        copy="Questions about a piece, a collection, or a full project? Send a message and our team will respond within one business day."
      />

      <section className="bg-warm-ivory">
        <div className="mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[45fr_55fr] lg:gap-20 lg:py-24">
          <div>
            <h2 className="text-xl font-semibold tracking-headline">Reach us directly</h2>
            <ul className="mt-6 space-y-5 text-sm text-secondary-text">
              <li className="flex items-center gap-3">
                <Mail size={17} strokeWidth={1.75} className="shrink-0 text-clay" />
                hello@lubefurniture.com
              </li>
              <li className="flex items-center gap-3">
                <Phone size={17} strokeWidth={1.75} className="shrink-0 text-clay" />
                +00 000 000 0000
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={17} strokeWidth={1.75} className="mt-0.5 shrink-0 text-clay" />
                Showroom & Studio — Address Line, City
              </li>
            </ul>

            <div className="mt-8 overflow-hidden rounded-[1.25rem] border border-lube-border shadow-sm">
              <iframe
                title="Lube Furniture Location"
                src="https://maps.google.com/maps?q=XPG4%2B58G+Mariyam+sefer+China+camp(+Ayer+Tena),+Addis+Ababa&t=&z=14&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="320"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="mt-10 border-t border-lube-border pt-8">
              <h3 className="text-sm font-semibold tracking-tight text-dark-graphite">Ready for a quotation?</h3>
              <p className="mt-2 text-sm leading-relaxed text-secondary-text">
                Skip the back-and-forth — submit your project details through our quote request.
              </p>
              <button
                onClick={onRequestQuote}
                className="mt-5 inline-flex items-center justify-center rounded-full bg-clay px-6 py-3 text-xs font-semibold uppercase tracking-editorial text-white transition-colors hover:bg-clay-dark focus:outline-none focus:ring-2 focus:ring-clay/50"
              >
                Request a Quote
              </button>
            </div>
          </div>

          <div className="border border-lube-border bg-soft-white p-6 sm:p-10">
            {sent ? (
              <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-clay/10">
                  <Check size={28} strokeWidth={2} className="text-clay" />
                </div>
                <h2 className="mt-6 text-2xl font-semibold tracking-headline">Message Sent</h2>
                <p className="mt-3 max-w-xs text-sm leading-relaxed text-secondary-text">
                  Thanks for reaching out. We'll get back to you within one business day.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
              >
                <div>
                  <label htmlFor="ct-name" className="mb-1.5 block text-xs font-medium uppercase tracking-editorial text-secondary-text">
                    Name *
                  </label>
                  <input id="ct-name" required placeholder="Your name" className={inputClass} />
                </div>
                <div>
                  <label htmlFor="ct-email" className="mb-1.5 block text-xs font-medium uppercase tracking-editorial text-secondary-text">
                    Email *
                  </label>
                  <input id="ct-email" type="email" required placeholder="you@example.com" className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="ct-subject" className="mb-1.5 block text-xs font-medium uppercase tracking-editorial text-secondary-text">
                    Subject *
                  </label>
                  <input id="ct-subject" required placeholder="What is this about?" className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="ct-message" className="mb-1.5 block text-xs font-medium uppercase tracking-editorial text-secondary-text">
                    Message *
                  </label>
                  <textarea id="ct-message" required rows={5} placeholder="Tell us about your space or question." className={`${inputClass} resize-none`} />
                </div>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full justify-center rounded-full bg-clay px-8 py-4 text-sm font-medium text-white transition-colors hover:bg-clay-dark focus:outline-none focus:ring-2 focus:ring-clay/50"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
