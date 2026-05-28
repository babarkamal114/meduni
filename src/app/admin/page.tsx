import Link from 'next/link';
import { getWebinars } from '@/lib/data/webinars';
import { getModules, getCaseStudies, getContentItems } from '@/lib/data/learning';
import { Video, BookOpen, GraduationCap, FileText } from 'lucide-react';

export default async function AdminDashboardPage(): Promise<React.ReactElement> {
  const [webinars, modules, caseStudies, contentItems] = await Promise.all([
    getWebinars(),
    getModules(),
    getCaseStudies(),
    getContentItems(),
  ]);
  const cards = [
    {
      href: '/admin/webinars',
      label: 'Webinars',
      description: 'Create and manage webinars',
      count: webinars.length,
      icon: Video,
    },
    {
      href: '/admin/learning/modules',
      label: 'Modules',
      description: 'Build modules and steps',
      count: modules.length,
      icon: BookOpen,
    },
    {
      href: '/admin/learning/case-studies',
      label: 'Case Studies',
      description: 'Maintain interactive scenarios',
      count: caseStudies.length,
      icon: GraduationCap,
    },
    {
      href: '/admin/content',
      label: 'Content',
      description: 'Upload PDFs, videos, and quizzes',
      count: contentItems.length,
      icon: FileText,
    },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-slate-900 mb-1">Admin Dashboard</h1>
      <p className="mb-8 text-sm text-slate-600">
        Choose what you want to manage. Each section uses simple step-by-step forms.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="rounded-xl border border-black/[0.06] bg-white p-5 transition hover:border-teal-300 hover:bg-teal-50/30"
            >
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10">
                  <Icon className="h-5 w-5 text-teal-600" strokeWidth={1.5} />
                </div>
                <span className="font-serif text-xl text-slate-800">{card.label}</span>
              </div>
              <p className="text-sm text-slate-600">{card.description}</p>
              <p className="mt-3 text-sm font-semibold text-teal-700">{card.count} items</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
