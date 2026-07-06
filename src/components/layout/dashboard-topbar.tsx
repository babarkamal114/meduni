'use client';

import { useState } from 'react';
import Link from 'next/link';
import { logoutAction } from '@/app/(auth)/actions/logout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Settings, Menu } from 'lucide-react';
import { NotificationBell } from '@/components/dashboard/notification-bell';

interface DashboardTopbarProps {
  user: {
    id: string;
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  } | null;
  onMenuClick: () => void;
}

function getInitials(user: DashboardTopbarProps['user']): string {
  if (user?.full_name?.trim()) {
    const firstWord = user.full_name.trim().split(/\s+/)[0];
    return (firstWord?.[0] ?? '').toUpperCase() || 'U';
  }
  return user?.email?.[0]?.toUpperCase() ?? 'U';
}

export function DashboardTopbar({ user, onMenuClick }: DashboardTopbarProps): React.ReactElement {
  const [avatarError, setAvatarError] = useState(false);
  const initials = getInitials(user);
  const showAvatarImage = user?.avatar_url?.trim() && !avatarError;

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
        </div>
        <div className="flex items-center gap-3">
          <NotificationBell userId={user?.id ?? null} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full p-0 transition-all hover:ring-2 hover:ring-primary hover:ring-offset-2"
              >
                <Avatar className="h-9 w-9 transition-transform hover:scale-105">
                  {showAvatarImage && (
                    <AvatarImage
                      src={user!.avatar_url!}
                      alt={user?.full_name ?? user?.email}
                      onError={() => setAvatarError(true)}
                    />
                  )}
                  <AvatarFallback className="bg-gradient-to-br from-teal-500 to-teal-700 text-xs font-bold text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white text-slate-900 border-slate-200" align="end">
              <DropdownMenuLabel className="font-normal text-slate-900">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-slate-900">
                    {user?.full_name ?? 'User'}
                  </p>
                  <p className="text-xs leading-none text-slate-600">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-200" />
              <Link
                href="/dashboard/settings"
                className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm text-slate-900 outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
              <Link
                href="/dashboard/settings"
                className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm text-slate-900 outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100"
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
              <DropdownMenuSeparator className="bg-slate-200" />
              <form action={logoutAction} className="w-full">
                <button type="submit" className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm text-slate-900 outline-none transition-colors hover:bg-slate-100 focus:bg-slate-100">
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
