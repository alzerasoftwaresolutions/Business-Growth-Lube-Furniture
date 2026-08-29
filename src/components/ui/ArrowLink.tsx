import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ArrowLinkProps {
  label: string;
  onClick?: () => void;
  dark?: boolean;
  className?: string;
}

export const ArrowLink: React.FC<ArrowLinkProps> = ({ label, onClick, dark = false, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`group inline-flex items-center gap-2 text-sm font-medium tracking-tight transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-clay/50 ${
        dark ? 'text-warm-ivory hover:text-clay-light' : 'text-dark-graphite hover:text-clay'
      } ${className}`}
    >
      <span className="border-b border-transparent group-hover:border-current pb-0.5 transition-all">
        {label}
      </span>
      <ArrowRight size={16} strokeWidth={1.75} className="transition-transform duration-200 group-hover:translate-x-1" />
    </button>
  );
};
