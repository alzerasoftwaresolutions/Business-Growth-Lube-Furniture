import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Send } from 'lucide-react';
import { PageType } from '../../types';

interface FooterProps {
  onNavigate: (page: PageType) => void;
  onExploreCollection: (collectionId: string) => void;
}

const collectionLinks = ['Living', 'Bedroom', 'Dining', 'Office'];
const serviceLinks = ['Furniture Consultation', 'Furniture Solutions', 'Commercial & Hospitality'];

export const Footer: React.FC<FooterProps> = ({ onNavigate, onExploreCollection }) => {
  return (
    <footer className="bg-dark-graphite text-warm-ivory">
      <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_3fr]">
          <div className="lg:pr-8">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-semibold tracking-headline">LUBE</span>
              <span className="font-display text-2xl font-light tracking-headline text-warm-ivory/60">Furniture</span>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-warm-ivory/60">
              Thoughtfully designed furniture for homes, workspaces, and environments where people
              gather, live, and work.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-warm-ivory/70">
              <li className="flex items-center gap-3">
                <Mail size={15} strokeWidth={1.75} className="shrink-0 text-clay-light" />
                <span>hello@lubefurniture.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} strokeWidth={1.75} className="shrink-0 text-clay-light" />
                <span>+00 000 000 0000</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={15} strokeWidth={1.75} className="mt-0.5 shrink-0 text-clay-light" />
                <span>Showroom & Studio — Address Line, City</span>
              </li>
            </ul>

            <div className="mt-8 flex items-center gap-3">
              {[
                { Icon: Instagram, label: 'Instagram', href: '#' },
                { Icon: Facebook, label: 'Facebook', href: '#' },
                { Icon: Send, label: 'Telegram', href: '#' },
                { Icon: Mail, label: 'Email', href: 'mailto:hello@lubefurniture.com' },
              ].map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center border border-warm-ivory/15 text-warm-ivory/60 transition-colors hover:border-clay hover:text-clay-light"
                >
                  <Icon size={17} strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:gap-8 lg:gap-12">
            <nav aria-label="Footer company">
              <h3 className="text-[11px] font-semibold uppercase tracking-editorial text-warm-ivory/40">
                Company
              </h3>
              <ul className="mt-5 space-y-3">
                {['Home', 'Collections', 'Services', 'About', 'Contact'].map((page) => (
                  <li key={page}>
                    <button
                      onClick={() => onNavigate(page.toLowerCase() as PageType)}
                      className="text-sm text-warm-ivory/70 transition-colors hover:text-clay-light"
                    >
                      {page}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Footer collections">
              <h3 className="text-[11px] font-semibold uppercase tracking-editorial text-warm-ivory/40">
                Collections
              </h3>
              <ul className="mt-5 space-y-3">
                {collectionLinks.map((name) => (
                  <li key={name}>
                    <button
                      onClick={() => onExploreCollection(name.toLowerCase())}
                      className="text-sm text-warm-ivory/70 transition-colors hover:text-clay-light"
                    >
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Footer services">
              <h3 className="text-[11px] font-semibold uppercase tracking-editorial text-warm-ivory/40">
                Services
              </h3>
              <ul className="mt-5 space-y-3">
                {serviceLinks.map((name) => (
                  <li key={name}>
                    <button
                      onClick={() => onNavigate('services')}
                      className="text-left text-sm text-warm-ivory/70 transition-colors hover:text-clay-light"
                    >
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-warm-ivory/10 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-warm-ivory/40">© {new Date().getFullYear()} Lube Furniture. All rights reserved.</p>
          <p className="text-xs text-warm-ivory/40">Furniture for modern spaces.</p>
        </div>
      </div>
    </footer>
  );
};
