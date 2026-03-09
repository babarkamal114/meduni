export type WebinarStatus = 'live' | 'upcoming' | 'recorded';

export const CARD_GRADIENTS = [
  'from-rose-300 to-rose-100',
  'from-teal-400 to-teal-200',
  'from-violet-400 to-violet-200',
  'from-amber-400 to-amber-200',
  'from-sky-400 to-sky-200',
  'from-emerald-400 to-emerald-200',
  'from-fuchsia-400 to-fuchsia-200',
  'from-indigo-400 to-indigo-200',
  'from-cyan-400 to-cyan-200',
  'from-orange-400 to-orange-200',
  'from-lime-400 to-lime-200',
  'from-blue-400 to-blue-200',
] as const;

export function getCardGradient(id: string): string {
  const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return CARD_GRADIENTS[Math.abs(index) % CARD_GRADIENTS.length];
}

export interface MockWebinar {
  id: string;
  slug: string;
  title: string;
  expert: string;
  duration: string;
  price: string;
  status: WebinarStatus;
  statusLabel: string;
  gradientClass: string;
  ctaLabel: string;
  purchased: boolean;
  dateLabel: string;
  hasReplay: boolean;
  scheduledAt: string | null;
}

export const MOCK_WEBINARS: MockWebinar[] = [
  {
    id: '1',
    slug: 'cardiology-update-2025',
    title: 'Cardiology Update 2025',
    expert: 'Dr. James Carter',
    duration: '1.5 hours',
    price: '£29.99',
    status: 'live',
    statusLabel: 'Live Tomorrow',
    gradientClass: 'from-rose-100 to-rose-50',
    ctaLabel: 'Get Ticket',
    purchased: true,
    dateLabel: 'Tomorrow, 7:00 PM',
    hasReplay: false,
    scheduledAt: null,
  },
  {
    id: '2',
    slug: 'paediatric-emergencies',
    title: 'Paediatric Emergencies',
    expert: 'Dr. Lisa Nguyen',
    duration: '2 hours',
    price: '£34.99',
    status: 'upcoming',
    statusLabel: 'In 5 days',
    gradientClass: 'from-teal-100 to-teal-50',
    ctaLabel: 'Get Ticket',
    purchased: true,
    dateLabel: 'Fri 24 Jan, 6:30 PM',
    hasReplay: false,
    scheduledAt: null,
  },
  {
    id: '3',
    slug: 'mental-health-primary-care',
    title: 'Mental Health in Primary Care',
    expert: 'Prof. Alan Brooks',
    duration: '1.5 hours',
    price: '£24.99',
    status: 'upcoming',
    statusLabel: 'In 2 weeks',
    gradientClass: 'from-violet-100 to-violet-50',
    ctaLabel: 'Get Ticket',
    purchased: false,
    dateLabel: 'Mon 3 Feb, 7:00 PM',
    hasReplay: false,
    scheduledAt: null,
  },
  {
    id: '4',
    slug: 'emergency-medicine-masterclass',
    title: 'Emergency Medicine Masterclass',
    expert: 'Dr. Sarah Patel',
    duration: '1h 45m',
    price: '£19.99',
    status: 'recorded',
    statusLabel: 'Recorded',
    gradientClass: 'from-amber-100 to-amber-50',
    ctaLabel: 'Watch Now',
    purchased: true,
    dateLabel: 'Recorded',
    hasReplay: true,
    scheduledAt: null,
  },
  {
    id: '5',
    slug: 'diabetes-management-2025',
    title: 'Diabetes Management 2025',
    expert: 'Dr. Raj Mehta',
    duration: '2 hours',
    price: '£22.99',
    status: 'recorded',
    statusLabel: 'Recorded',
    gradientClass: 'from-sky-100 to-sky-50',
    ctaLabel: 'Watch Now',
    purchased: false,
    dateLabel: 'Recorded',
    hasReplay: true,
    scheduledAt: null,
  },
  {
    id: '6',
    slug: 'surgical-skills-bootcamp',
    title: 'Surgical Skills Bootcamp',
    expert: 'Mr. David Lee',
    duration: '3 hours',
    price: '£49.99',
    status: 'upcoming',
    statusLabel: 'Feb 15',
    gradientClass: 'from-emerald-100 to-emerald-50',
    ctaLabel: 'Get Ticket',
    purchased: false,
    dateLabel: 'Sat 15 Feb, 10:00 AM',
    hasReplay: false,
    scheduledAt: null,
  },
];

export function getWebinarBySlug(slug: string): MockWebinar | undefined {
  return MOCK_WEBINARS.find((w) => w.slug === slug);
}

export function getPurchasedWebinars(): MockWebinar[] {
  return MOCK_WEBINARS.filter((w) => w.purchased);
}
