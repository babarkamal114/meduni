import { cn } from '@/lib/utils/cn';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  iconClassName?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  className,
  iconClassName,
}: FeatureCardProps): React.ReactElement {
  return (
    <div
      className={cn(
        'card rounded-2xl p-8',
        className
      )}
    >
      <div
        className={cn(
          'ic w-14 h-14 rounded-xl bg-teal-500/10 flex items-center justify-center mb-6',
          iconClassName
        )}
      >
        {icon}
      </div>
      <h3 className="font-serif text-xl text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
