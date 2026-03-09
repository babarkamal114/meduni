import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
  href?: string;
}

const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(
  (
    {
      className,
      variant = 'default',
      size = 'md',
      asChild = false,
      href,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
      default:
        'bg-teal-600 text-white hover:bg-teal-700',
      secondary:
        'bg-slate-100 text-slate-700 hover:bg-slate-200',
      outline:
        'border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-700',
      ghost: 'hover:bg-slate-100 hover:text-slate-900 text-slate-700',
      link: 'underline-offset-4 hover:underline text-teal-600',
    };

    const sizes = {
      sm: 'py-1.5 px-3 text-xs',
      md: 'py-2 px-4 text-sm',
      lg: 'py-2.5 px-6 text-base',
    };

    const buttonClasses = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      className
    );

    if (asChild || href) {
      return (
        <Link
          className={buttonClasses}
          href={href || '#'}
          ref={ref as React.ForwardedRef<HTMLAnchorElement>}
        >
          {children}
        </Link>
      );
    }

    return (
      <button
        className={buttonClasses}
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };

