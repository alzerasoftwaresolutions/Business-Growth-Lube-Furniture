import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  copy?: string;
  align?: 'left' | 'center';
  dark?: boolean;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  copy,
  align = 'left',
  dark = false,
  className = '',
}) => {
  return (
    <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''} ${className}`}>
      {eyebrow && (
        <p className={`text-xs font-medium uppercase tracking-editorial mb-4 ${dark ? 'text-clay-light' : 'text-clay'}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`font-display text-3xl font-medium leading-[1.15] tracking-headline text-balance md:text-4xl lg:text-[2.75rem] ${dark ? 'text-warm-ivory' : 'text-dark-graphite'}`}>
        {title}
      </h2>
      {copy && (
        <p className={`mt-5 text-base md:text-lg leading-relaxed ${dark ? 'text-warm-ivory/70' : 'text-secondary-text'}`}>
          {copy}
        </p>
      )}
    </div>
  );
};
