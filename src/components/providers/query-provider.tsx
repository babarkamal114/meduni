'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

const defaultOptions = {
  defaultOptions: {
    queries: { staleTime: 60 * 1000, retry: 1 },
  },
};

export function QueryProvider({
  children,
}: Readonly<{ children: React.ReactNode }>): React.ReactElement {
  const [client] = useState(() => new QueryClient(defaultOptions));
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
