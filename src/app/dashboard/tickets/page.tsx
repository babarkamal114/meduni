import { getUser } from '@/lib/auth/getUser';
import { TicketCard } from '@/components/dashboard/ticket-card';
import { EmptyState } from '@/components/dashboard/empty-state';
import { Ticket } from 'lucide-react';
import { createServerClient } from '@/lib/supabase/server';
import type { WebinarsRow } from '@/types/database';

async function getUserTickets(userId: string) {
  const supabase = await createServerClient();
  const { data: registrations, error } = await supabase
    .from('webinar_registrations')
    .select('id, webinar_id, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !registrations?.length) return [];

  const webinarIds = (registrations as { id: string; webinar_id: string; created_at: string }[]).map((r) => r.webinar_id);
  const { data: webinars } = await supabase
    .from('webinars')
    .select('*')
    .in('id', webinarIds);

  if (!webinars?.length) return [];

  const webinarMap = new Map<string, WebinarsRow>();
  for (const w of webinars as WebinarsRow[]) {
    webinarMap.set(w.id, w);
  }

  return (registrations as { id: string; webinar_id: string; created_at: string }[])
    .map((reg) => {
      const w = webinarMap.get(reg.webinar_id);
      if (!w) return null;

      const status = w.status === 'recorded' ? 'completed' as const
        : w.status === 'live' ? 'live' as const
        : 'upcoming' as const;

      const statusLabel = w.status === 'recorded' ? 'Completed'
        : w.status === 'live' ? 'Live Now'
        : w.status_label ?? 'Upcoming';

      const actionLabel = w.status === 'recorded' ? 'Watch Replay'
        : w.status === 'live' ? 'Join Webinar'
        : 'View Details';

      const dateLabel = w.scheduled_at
        ? new Date(w.scheduled_at).toLocaleDateString('en-GB', {
            weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
          })
        : 'TBA';

      const meta = [
        w.duration ?? null,
        'Zoom',
      ].filter(Boolean).join(' · ');

      return {
        slug: w.slug,
        title: w.title,
        expert: w.expert ?? 'MedUni Expert',
        date: dateLabel,
        meta,
        orderId: `#MU-${reg.id.slice(0, 8).toUpperCase()}`,
        status,
        statusLabel,
        actionLabel,
      };
    })
    .filter(Boolean) as Array<{
      slug: string;
      title: string;
      expert: string;
      date: string;
      meta: string;
      orderId: string;
      status: 'live' | 'upcoming' | 'completed';
      statusLabel: string;
      actionLabel: string;
    }>;
}

export default async function DashboardTicketsPage(): Promise<React.ReactElement> {
  const user = await getUser();
  if (!user) {
    return (
      <div className="px-6 lg:px-8 py-8">
        <p className="text-slate-600">Sign in to see your tickets.</p>
      </div>
    );
  }

  const tickets = await getUserTickets(user.id);

  return (
    <div className="px-6 lg:px-8 py-8 max-w-[1400px]">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-slate-900 mb-1">My Tickets</h1>
        <p className="text-slate-600 text-sm">
          Your purchased webinar tickets and event access
        </p>
      </div>
      {tickets.length === 0 ? (
        <EmptyState
          icon={Ticket}
          title="No tickets yet"
          description="Browse our webinars and purchase a ticket to get started."
          actionLabel="Browse Webinars"
          actionHref="/dashboard/webinars"
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.slug} {...ticket} />
          ))}
        </div>
      )}
    </div>
  );
}
