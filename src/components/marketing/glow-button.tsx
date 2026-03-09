import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

interface GlowButtonProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function GlowButton({
  href,
  children,
  className,
  ...props
}: GlowButtonProps): React.ReactElement {
  return (
    <Link
      href={href}
      className={cn(
        'glow-btn inline-flex items-center justify-center gap-2 px-6 py-2.5 sm:px-8 sm:py-4 bg-teal-600 text-white font-semibold text-sm sm:text-lg rounded-full relative z-10 transition-all',
        className
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

interface GlowButtonButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export function GlowButtonSubmit({
  children,
  className,
  ...props
}: GlowButtonButtonProps): React.ReactElement {
  return (
    <button
      type="submit"
      className={cn(
        'glow-btn w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-teal-600 text-white font-semibold rounded-full relative z-10 text-lg',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
