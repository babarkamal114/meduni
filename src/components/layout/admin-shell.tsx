'use client';

import { useState, useCallback } from 'react';
import { AdminSidebar } from '@/components/layout/admin-sidebar';
import { Menu } from 'lucide-react';

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps): React.ReactElement {
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
      <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      <main className="flex-1 flex flex-col min-h-screen lg:ml-[260px] w-0 min-w-0">
        <header className="sticky top-0 z-30 flex h-14 items-center border-b border-black/5 bg-[#f8f6f1]/80 backdrop-blur-xl px-6 lg:hidden">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-black/5"
            onClick={openSidebar}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-slate-600" strokeWidth={2} />
          </button>
          <span className="ml-3 font-serif text-lg text-slate-900">Admin</span>
        </header>
        <div className="flex-1 p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
