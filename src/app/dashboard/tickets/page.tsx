import { TicketCard } from '@/components/dashboard/ticket-card';

export default function DashboardTicketsPage(): React.ReactElement {
  return (
    <div className="px-6 lg:px-8 py-8 max-w-[1400px]">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-slate-900 mb-1">My Tickets</h1>
        <p className="text-slate-600 text-sm">
          Your purchased webinar tickets and event access
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <TicketCard
          slug="cardiology-update-2025"
          title="Cardiology Update 2025"
          expert="Dr. James Carter"
          date="Tomorrow, 7:00 PM GMT"
          meta="1.5 hours · Zoom · Seat #047"
          orderId="#MU-2025-0847"
          status="live"
          statusLabel="Live Tomorrow"
          actionLabel="Join Webinar"
        />
        <TicketCard
          slug="paediatric-emergencies"
          title="Paediatric Emergencies"
          expert="Dr. Lisa Nguyen"
          date="Fri 24 Jan, 6:30 PM GMT"
          meta="2 hours · Zoom · Seat #112"
          orderId="#MU-2025-0851"
          status="upcoming"
          statusLabel="In 5 days"
          actionLabel="View Details"
          gradient="linear-gradient(135deg, #6366f1, #4f46e5)"
        />
        <TicketCard
          slug="emergency-medicine-masterclass"
          title="Emergency Medicine Masterclass"
          expert="Dr. Sarah Patel"
          date="10 Jan, 7:00 PM GMT"
          meta="1.5 hours · Attended · Certificate issued"
          orderId="#MU-2025-0790"
          status="completed"
          statusLabel="Completed"
          actionLabel="Watch Replay"
        />
      </div>
    </div>
  );
}
