'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import {
  LayoutDashboard,
  Video,
  BookOpen,
  Ticket,
  GraduationCap,
  Activity,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react';
import { logoutAction } from '@/app/(auth)/actions/logout';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/webinars', label: 'Webinars', icon: Video },
  { href: '/dashboard/learning', label: 'My Learning', icon: BookOpen },
  { href: '/dashboard/tickets', label: 'My Tickets', icon: Ticket },
  { href: '/dashboard/certificates', label: 'Certificates', icon: GraduationCap },
  { href: '/dashboard/activity', label: 'Activity', icon: Activity },
];

interface DashboardSidebarProps {
  user: {
    full_name: string | null;
    email: string;
    avatar_url: string | null;
    role?: 'member' | 'admin';
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DashboardSidebar({
  user,
  isOpen,
  onClose,
}: DashboardSidebarProps): React.ReactElement {
  const pathname = usePathname();

  const initials = user?.full_name
    ? user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? 'U';

  return (
    <>
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-[260px] flex-col border-r border-black/[0.06] bg-white transition-transform duration-300 ease-out lg:translate-x-0',
          'flex',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="border-b border-black/5 p-6">
            <Link
              href="/"
              className="flex items-center gap-3"
              onClick={onClose}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="font-serif text-xl text-slate-900">MedUni</span>
            </Link>
          </div>
          <nav className="flex-1 space-y-1 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== '/dashboard' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'sidebar-link flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all duration-250',
                    isActive
                      ? 'bg-teal-500/10 font-semibold text-teal-600 [&_svg]:text-teal-600'
                      : 'text-slate-500 hover:bg-teal-500/5 hover:text-teal-600'
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" strokeWidth={1.5} />
                  {item.label}
                </Link>
              );
            })}
            {(user?.role?.toString().toLowerCase() === 'admin') && (
              <Link
                href="/admin"
                onClick={onClose}
                className={cn(
                  'sidebar-link flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all duration-250',
                  pathname?.startsWith('/admin')
                    ? 'bg-teal-500/10 font-semibold text-teal-600 [&_svg]:text-teal-600'
                    : 'text-slate-500 hover:bg-teal-500/5 hover:text-teal-600'
                )}
              >
                <Shield className="h-5 w-5 shrink-0" strokeWidth={1.5} />
                Admin
              </Link>
            )}
            <div className="my-4 mb-2 px-4">
              <div className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                Account
              </div>
            </div>
            <Link
              href="/dashboard/settings"
              onClick={onClose}
              className={cn(
                'sidebar-link flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all duration-250',
                pathname === '/dashboard/settings'
                  ? 'bg-teal-500/10 font-semibold text-teal-600 [&_svg]:text-teal-600'
                  : 'text-slate-500 hover:bg-teal-500/5 hover:text-teal-600'
              )}
            >
              <Settings className="h-5 w-5 shrink-0" strokeWidth={1.5} />
              Settings
            </Link>
            <form action={logoutAction} className="block">
              <button
                type="submit"
                className="sidebar-link flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm text-slate-500 transition-all duration-250 hover:bg-teal-500/5 hover:text-teal-600"
              >
                <LogOut className="h-5 w-5 shrink-0" strokeWidth={1.5} />
                Sign Out
              </button>
            </form>
          </nav>
          {user && (
            <div className="border-t border-black/5 p-4">
              <div className="flex items-center gap-3 rounded-lg p-2">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 text-xs font-bold text-white">
                  {initials}
                </div>
                <div className="min-w-0 flex-1 truncate">
                  <div className="truncate text-sm font-medium text-slate-800">
                    {user.full_name ?? 'User'}
                  </div>
                  <div className="truncate text-xs text-slate-600">
                    {user.email}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
