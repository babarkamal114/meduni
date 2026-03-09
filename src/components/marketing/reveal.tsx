'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

type Variant = 'up' | 'left' | 'right';

interface RevealProps {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  style?: React.CSSProperties;
}

export function Reveal({
  children,
  variant = 'up',
  className,
  style,
}: RevealProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const variantClass =
    variant === 'left'
      ? 'reveal-left'
      : variant === 'right'
        ? 'reveal-right'
        : 'reveal';

  return (
    <div ref={ref} className={cn(variantClass, className)} style={style}>
      {children}
    </div>
  );
}
