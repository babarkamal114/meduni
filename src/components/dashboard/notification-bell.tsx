'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { getNotifications, markNotificationRead } from '@/app/dashboard/actions/notifications';
import type { NotificationWithRead } from '@/lib/data/notifications';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

function formatRelativeTime(createdAt: string): string {
  const d = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

interface NotificationBellProps {
  userId: string | null;
}

export function NotificationBell({ userId }: NotificationBellProps): React.ReactElement {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationWithRead[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const list = await getNotifications();
    setNotifications(list);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (!userId) return;
    const supabase = createBrowserSupabaseClient();
    const channel = supabase
      .channel('notifications-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        () => {
          fetchNotifications();
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchNotifications]);

  const handleOpen = async (n: NotificationWithRead) => {
    if (!userId) return;
    await markNotificationRead(n.id);
    setNotifications((prev) =>
      prev.map((x) => (x.id === n.id ? { ...x, read_at: new Date().toISOString() } : x))
    );
    router.push(n.link);
  };

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-black/5"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5 text-slate-500" strokeWidth={1.5} />
          {unreadCount > 0 && (
            <span
              className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-[#f8f6f1] bg-red-500 px-1 text-[10px] font-medium text-white"
              aria-hidden
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[360px] max-h-[400px] overflow-hidden flex flex-col bg-white text-slate-900 border-slate-200 p-0"
      >
        <div className="border-b border-slate-200 px-4 py-3">
          <h3 className="text-sm font-semibold text-slate-900">Notifications</h3>
          <p className="text-xs text-slate-500 mt-0.5">Last 7 days</p>
        </div>
        <div className="overflow-y-auto flex-1 max-h-[320px]">
          {loading ? (
            <div className="px-4 py-6 text-center text-sm text-slate-500">Loading…</div>
          ) : notifications.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-slate-500">No notifications</div>
          ) : (
            <ul className="py-1">
              {notifications.map((n) => (
                <li key={n.id} className={!n.read_at ? 'bg-teal-50/50' : ''}>
                  <div className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{n.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {formatRelativeTime(n.created_at)}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="shrink-0 text-teal-600 hover:text-teal-700 hover:bg-teal-100"
                      onClick={() => handleOpen(n)}
                    >
                      Open
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
