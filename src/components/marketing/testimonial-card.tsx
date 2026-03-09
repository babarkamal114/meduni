import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';

export interface TestimonialCardProps {
  quote: string;
  name: string;
  title: string;
  backgroundImageUrl?: string;
  className?: string;
}

export function TestimonialCard({
  quote,
  name,
  title,
  backgroundImageUrl,
  className,
}: TestimonialCardProps): React.ReactElement {
  return (
    <Card
      className={cn(
        'relative overflow-hidden border-0',
        'hover:scale-105 transition-all duration-200',
        'aspect-square shadow-lg shadow-black/50',
        className
      )}
    >
      {/* Background Image */}
      {backgroundImageUrl && (
        <div className="absolute inset-0 z-0">
          <Image
            src={backgroundImageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
      )}
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 z-10 bg-black/30" />

      {/* Content */}
      <CardContent className="relative z-20 p-6 h-full flex flex-col justify-end ">
        {/* Quote */}
        <p className="text-white/90 text-sm md:text-base leading-relaxed italic">
          &quot;{quote}&quot;
        </p>

        {/* Author Info */}
        <div className="flex flex-col">
          <p className="text-white font-bold text-base mb-1">{name}</p>
          <p className="text-white/80 text-sm">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}

