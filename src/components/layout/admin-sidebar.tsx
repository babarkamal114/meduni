'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import {
  LayoutDashboard,
  Video,
  BookOpen,
  FileText,
  GraduationCap,
  ExternalLink,
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/webinars', label: 'Webinars', icon: Video },
  { href: '/admin/learning/modules', label: 'Modules', icon: BookOpen },
  { href: '/admin/learning/case-studies', label: 'Case Studies', icon: GraduationCap },
  { href: '/admin/content', label: 'Content', icon: FileText },
];

export function AdminSidebar(): React.ReactElement {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-[260px] flex-col border-r border-black/[0.06] bg-white">
      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="border-b border-black/5 p-6">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-teal-700">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="font-serif text-xl text-slate-900">MedUni Admin</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition-all duration-250',
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
          <div className="my-4 border-t border-black/5 pt-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-slate-500 transition-all duration-250 hover:bg-teal-500/5 hover:text-teal-600"
            >
              <ExternalLink className="h-5 w-5 shrink-0" strokeWidth={1.5} />
              View site
            </Link>
          </div>
        </nav>
      </div>
    </aside>
  );
}
