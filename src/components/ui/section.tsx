import * as React from 'react';
import { cn } from '@/lib/utils/cn';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, padding = 'lg', ...props }, ref) => {
    const paddingClasses = {
      none: '',
      sm: 'py-8',
      md: 'py-12',
      lg: 'py-16',
      xl: 'py-24',
    };

    return (
      <section
        ref={ref}
        className={cn(paddingClasses[padding], className)}
        {...props}
      />
    );
  }
);

Section.displayName = 'Section';

export { Section };

