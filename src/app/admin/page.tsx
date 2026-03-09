import Link from 'next/link';
import { MOCK_WEBINARS } from '@/lib/data/mock-webinars';
import { MODULES, CASE_STUDIES, WEEKLY_MATERIALS } from '@/lib/mock/learning';
import { Video, BookOpen, GraduationCap, FileText } from 'lucide-react';

const cards = [
  {
    href: '/admin/webinars',
    label: 'Manage Webinars',
    count: MOCK_WEBINARS.length,
    icon: Video,
  },
  {
    href: '/admin/learning/modules',
    label: 'Manage Modules',
    count: MODULES.length,
    icon: BookOpen,
  },
  {
    href: '/admin/learning/case-studies',
    label: 'Manage Case Studies',
    count: CASE_STUDIES.length,
    icon: GraduationCap,
  },
  {
    href: '/admin/content',
    label: 'Manage Content',
    count: WEEKLY_MATERIALS.length,
    icon: FileText,
  },
];

export default function AdminDashboardPage(): React.ReactElement {
  return (
    <div>
      <h1 className="font-serif text-3xl text-slate-900 mb-1">Admin</h1>
      <p className="text-slate-600 text-sm mb-8">
        Manage webinars, learning modules, case studies, and weekly content. Changes will persist once Supabase is integrated.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-2xl border border-black/[0.06] bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-teal-500/20"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10">
                  <Icon className="h-5 w-5 text-teal-600" strokeWidth={1.5} />
                </div>
                <span className="font-serif text-xl text-slate-800">{card.label}</span>
              </div>
              <p className="text-2xl font-semibold text-teal-600">{card.count}</p>
              <p className="text-xs text-slate-400 mt-1">items</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
