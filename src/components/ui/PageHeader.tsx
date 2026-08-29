import React from 'react';
import { ArrowRight } from 'lucide-react';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  copy?: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ eyebrow, title, copy, children }) => {
  return (
    <section className="border-b border-lube-border bg-warm-ivory">
      <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-8 lg:py-24">
        <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-editorial text-clay">
          <span className="h-px w-8 bg-clay" aria-hidden="true" />
          {eyebrow}
        </p>
        <h1 className="mt-5 max-w-3xl font-display text-4xl font-medium leading-[1.1] tracking-headline sm:text-5xl lg:text-[3.5rem]">
          {title}
        </h1>
        {copy && (
          <p className="mt-6 max-w-xl border-l-2 border-lube-border pl-5 text-base leading-relaxed text-secondary-text lg:text-lg">
            {copy}
          </p>
        )}
        {children}
      </div>
    </section>
  );
};

export const CTAButtonGroup: React.FC<{
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}> = ({ primaryLabel, onPrimary, secondaryLabel, onSecondary }) => (
  <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
    <button
      onClick={onPrimary}
      className="group inline-flex items-center justify-center gap-2 rounded-full bg-clay px-8 py-4 text-sm font-medium text-white transition-colors hover:bg-clay-dark focus:outline-none focus:ring-2 focus:ring-clay/50"
    >
      {primaryLabel}
      <ArrowRight size={16} strokeWidth={2} className="transition-transform group-hover:translate-x-1" />
    </button>
    {secondaryLabel && onSecondary && (
      <button
        onClick={onSecondary}
        className="inline-flex items-center justify-center rounded-full border border-dark-graphite/30 bg-soft-white px-8 py-4 text-sm font-medium text-dark-graphite transition-colors hover:border-dark-graphite focus:outline-none focus:ring-2 focus:ring-clay/50"
      >
        {secondaryLabel}
      </button>
    )}
  </div>
);
