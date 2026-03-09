'use client';

import { useState, useCallback } from 'react';
import { DashboardSidebar } from '@/components/layout/dashboard-sidebar';
import { DashboardTopbar } from '@/components/layout/dashboard-topbar';

interface DashboardShellProps {
  user: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    role: string;
  } | null;
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps): React.ReactElement {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="flex min-h-screen bg-[#f8f6f1]">
      <div
        className="fixed inset-0 z-40 bg-black/30 transition-opacity lg:hidden"
        style={{
          opacity: sidebarOpen ? 1 : 0,
          visibility: sidebarOpen ? 'visible' : 'hidden',
          pointerEvents: sidebarOpen ? 'auto' : 'none',
        }}
        onClick={closeSidebar}
        aria-hidden="true"
      />
      <DashboardSidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={closeSidebar}
      />
      <div className="flex flex-1 flex-col min-h-screen lg:ml-[260px] w-0 min-w-0">
        <DashboardTopbar user={user} onMenuClick={openSidebar} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
