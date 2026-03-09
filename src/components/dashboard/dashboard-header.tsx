'use client';

import { motion } from 'framer-motion';
import { fadeInUp } from '@/lib/utils/animations';

interface DashboardHeaderProps {
  user: {
    full_name: string | null;
  } | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps): React.ReactElement {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="mb-8"
    >
      <h1 className="text-3xl font-bold">
        Welcome back{user?.full_name ? `, ${user.full_name}` : ''}!
      </h1>
      <p className="mt-2 text-muted-foreground">
        Here&apos;s an overview of your MedUni account
      </p>
    </motion.div>
  );
}

