import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'dark' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-clay/50 rounded-full tracking-tight';

  const variantStyles = {
    primary: 'bg-clay text-white hover:bg-clay-dark active:bg-clay-dark shadow-sm',
    secondary: 'bg-light-stone text-dark-graphite hover:bg-lube-border active:bg-lube-border',
    dark: 'bg-dark-graphite text-warm-ivory hover:bg-black active:bg-black',
    outline: 'border border-dark-graphite text-dark-graphite hover:bg-dark-graphite hover:text-warm-ivory',
    ghost: 'text-dark-graphite hover:bg-light-stone/50'
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs uppercase tracking-wider',
    md: 'px-6 py-3 text-sm font-medium',
    lg: 'px-8 py-4 text-base font-medium'
  };

  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      {...props}
    >
      <span>{children}</span>
      {icon && <span className="ml-2.5 transition-transform group-hover:translate-x-1">{icon}</span>}
    </button>
  );
};
