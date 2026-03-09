'use client';

import Link from 'next/link';
import { logoutAction } from '@/app/(auth)/actions/logout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Settings, Menu, Bell, Search } from 'lucide-react';

interface DashboardTopbarProps {
  user: {
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  } | null;
  onMenuClick: () => void;
}

export function DashboardTopbar({ user, onMenuClick }: DashboardTopbarProps): React.ReactElement {
  const initials = user?.full_name
    ? user.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? 'U';

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-[#f8f6f1]/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-black/5 lg:hidden"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5 text-slate-600" strokeWidth={2} />
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" strokeWidth={2} />
            <input
              type="text"
              placeholder="Search webinars, courses..."
              className="h-10 w-full max-w-[320px] rounded-xl border border-transparent bg-slate-100 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-500 focus:border-teal-500/30 focus:bg-white focus:shadow-[0_0_0_3px_rgba(13,148,136,0.08)]"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-black/5"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-slate-500" strokeWidth={1.5} />
            <span className="absolute right-0 top-0 h-2 w-2 rounded-full border-2 border-[#f8f6f1] bg-red-500" />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full p-0 transition-all hover:ring-2 hover:ring-primary hover:ring-offset-2"
              >
                <Avatar className="h-9 w-9 transition-transform hover:scale-105">
                  <AvatarImage
                    src={user?.avatar_url ?? undefined}
                    alt={user?.full_name ?? user?.email}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-teal-500 to-teal-700 text-xs font-bold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.full_name ?? 'User'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link
                href="/dashboard/settings"
                className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
              <Link
                href="/dashboard/settings"
                className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
              <DropdownMenuSeparator />
              <form action={logoutAction} className="w-full">
                <button type="submit" className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </button>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
