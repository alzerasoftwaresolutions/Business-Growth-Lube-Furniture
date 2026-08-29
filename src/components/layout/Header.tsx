import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { PageType } from '../../types';

interface HeaderProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
  onRequestQuote: () => void;
}

const navItems: Array<{ label: string; page: PageType }> = [
  { label: 'Home', page: 'home' },
  { label: 'Collections', page: 'collections' },
  { label: 'Services', page: 'services' },
  { label: 'About', page: 'about' },
  { label: 'Contact', page: 'contact' },
];

export const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate, onRequestQuote }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (page: PageType) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b border-lube-border bg-warm-ivory transition-shadow duration-300 ${
        scrolled ? 'shadow-[0_4px_24px_-12px_rgba(37,35,33,0.12)]' : ''
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-5 sm:px-8">
        <button
          onClick={() => handleNavigate('home')}
          className="flex items-baseline gap-1.5 focus:outline-none"
          aria-label="Lube Furniture — Home"
        >
          <span className="font-display text-xl font-semibold tracking-headline text-dark-graphite">LUBE</span>
          <span className="font-display text-xl font-light tracking-headline text-secondary-text">Furniture</span>
        </button>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => handleNavigate(item.page)}
              aria-current={currentPage === item.page ? 'page' : undefined}
              className={`relative pb-1 text-sm tracking-tight transition-colors focus:outline-none ${
                currentPage === item.page
                  ? 'font-medium text-dark-graphite'
                  : 'text-secondary-text hover:text-dark-graphite'
              }`}
            >
              {item.label}
              <span
                className={`absolute -bottom-0.5 left-0 h-px bg-clay transition-all duration-300 ${
                  currentPage === item.page ? 'w-full' : 'w-0'
                }`}
              />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onRequestQuote}
            className="hidden rounded-full bg-clay px-5 py-2.5 text-xs font-semibold uppercase tracking-editorial text-white transition-colors hover:bg-clay-dark focus:outline-none focus:ring-2 focus:ring-clay/50 sm:inline-flex"
          >
            Request a Quote
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center text-dark-graphite lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} strokeWidth={1.75} /> : <Menu size={22} strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          className="border-t border-lube-border bg-warm-ivory px-5 pb-6 pt-2 lg:hidden"
          aria-label="Mobile navigation"
        >
          {navItems.map((item) => (
            <button
              key={item.page}
              onClick={() => handleNavigate(item.page)}
              className={`block w-full py-3.5 text-left text-base tracking-tight ${
                currentPage === item.page
                  ? 'font-medium text-clay'
                  : 'text-dark-graphite'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              setMobileOpen(false);
              onRequestQuote();
            }}
            className="mt-3 w-full rounded-full bg-clay px-5 py-3.5 text-xs font-semibold uppercase tracking-editorial text-white transition-colors hover:bg-clay-dark"
          >
            Request a Quote
          </button>
        </nav>
      )}
    </header>
  );
};
