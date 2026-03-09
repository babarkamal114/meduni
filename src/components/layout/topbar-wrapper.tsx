'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface TopbarWrapperProps {
  children: ReactNode;
}

export function TopbarWrapper({ children }: TopbarWrapperProps): React.ReactElement {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      {children}
    </motion.header>
  );
}

