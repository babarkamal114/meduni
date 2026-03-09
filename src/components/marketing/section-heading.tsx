import { cn } from '@/lib/utils/cn';

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
}: SectionHeadingProps): React.ReactElement {
  return (
    <div className={cn('max-w-2xl', className)}>
      <span className="text-xs font-mono text-teal-600 uppercase tracking-[.3em] mb-4 block">
        {eyebrow}
      </span>
      <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-tight text-slate-900 mb-6">
        {title}
      </h2>
      {description ? (
        <p className="text-slate-600 text-lg leading-relaxed">{description}</p>
      ) : null}
    </div>
  );
}
