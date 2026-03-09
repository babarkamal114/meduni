'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils/cn';
import { Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

export interface WebinarCardProps {
  webinar: {
    id: string;
    slug: string;
    title: string;
    expert_name: string;
    expert_avatar?: string | null;
    scheduled_at: string;
    duration_minutes: number;
    price_gbp: number;
    thumbnail_url?: string | null;
    topic: string;
    status?: string;
  };
  userHasAccess?: boolean;
  variant?: 'grid' | 'list';
}

export function WebinarCard({
  webinar,
  userHasAccess = false,
  variant = 'grid',
}: WebinarCardProps): React.ReactElement {
  const scheduledDate = new Date(webinar.scheduled_at);
  const isUpcoming = scheduledDate > new Date();

  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card
        className={cn(
          'overflow-hidden transition-all duration-300 h-full flex flex-col',
          'hover:shadow-xl hover:border-primary/50',
          variant === 'list' && 'flex-row'
        )}
      >
        <Link href={`/webinars/${webinar.slug}`} className="relative block">
          <div className={cn(
            'relative aspect-video bg-muted',
            variant === 'list' && 'w-64 flex-shrink-0'
          )}>
            {webinar.thumbnail_url ? (
              <Image
                src={webinar.thumbnail_url}
                alt={webinar.title}
                fill
                className="object-cover"
                sizes={variant === 'list' ? '256px' : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <span className="text-4xl text-muted-foreground">
                  {webinar.title[0]}
                </span>
              </div>
            )}
            {userHasAccess && (
              <Badge className="absolute top-2 right-2 bg-green-600">
                Owned
              </Badge>
            )}
            {webinar.status && (
              <Badge
                variant="secondary"
                className="absolute top-2 left-2"
              >
                {webinar.status}
              </Badge>
            )}
          </div>
        </Link>

        <CardContent className={cn(
          'p-4 flex-1 flex flex-col',
          variant === 'list' && 'flex-1'
        )}>
          <div className="flex items-start justify-between gap-2 mb-2">
            <Badge variant="secondary">{webinar.topic}</Badge>
            {!userHasAccess && (
              <span className="text-lg font-bold text-primary">
                £{webinar.price_gbp.toFixed(2)}
              </span>
            )}
          </div>

          <h3 className="font-semibold text-lg mt-2 mb-3 line-clamp-2">
            {webinar.title}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-8 w-8">
              {webinar.expert_avatar && (
                <AvatarImage src={webinar.expert_avatar} alt={webinar.expert_name} />
              )}
              <AvatarFallback className="text-xs">
                {webinar.expert_name[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {webinar.expert_name}
            </span>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-auto">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{format(scheduledDate, 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{webinar.duration_minutes} min</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            className="w-full"
            variant={userHasAccess ? 'secondary' : 'default'}
            asChild
          >
            <Link href={`/webinars/${webinar.slug}`}>
              {userHasAccess ? 'View Details' : 'Learn More'}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

