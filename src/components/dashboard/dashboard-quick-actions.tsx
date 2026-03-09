'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, TrendingUp, Clock, Award } from 'lucide-react';
import Link from 'next/link';
import { fadeInUp, staggerContainer } from '@/lib/utils/animations';
import { cn } from '@/lib/utils/cn';

const quickActions = [
  {
    title: 'Continue Learning',
    description: 'Resume your last watched webinar',
    icon: Clock,
    href: '/dashboard/learning',
    badge: 'New',
    color: 'primary' as const,
  },
  {
    title: 'Your Progress',
    description: 'Track your learning journey',
    icon: TrendingUp,
    href: '/dashboard/progress',
    badge: null,
    color: 'secondary' as const,
  },
  {
    title: 'Achievements',
    description: 'View your earned badges',
    icon: Award,
    href: '/dashboard/achievements',
    badge: '3',
    color: 'default' as const,
  },
];

export function DashboardQuickActions(): React.ReactElement {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="grid gap-4 md:grid-cols-3"
    >
      {quickActions.map((action) => {
        const Icon = action.icon;
        return (
          <motion.div key={action.title} variants={fadeInUp}>
            <Card className={cn(
              'transition-all duration-300',
              'hover:shadow-lg hover:-translate-y-1 hover:border-primary/50',
              'group cursor-pointer'
            )}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-primary/10 p-2 group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  {action.badge && (
                    <Badge variant={action.color === 'primary' ? 'default' : 'secondary'}>
                      {action.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="mt-4">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="ghost" className="w-full group/btn">
                  <Link href={action.href} className="flex items-center justify-center">
                    View
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

