import Link from 'next/link';
import { getWebinars } from '@/lib/data/webinars';
import { getModules, getCaseStudies, getContentItems } from '@/lib/data/learning';
import { createAdminClient } from '@/lib/supabase/admin';
import { Video, BookOpen, GraduationCap, FileText, Users, Ticket, TrendingUp } from 'lucide-react';

async function getAdminStats() {
  const supabase = createAdminClient();

  const [usersResult, registrationsResult, recentUsersResult] = await Promise.all([
    (supabase as any).from('profiles').select('id', { count: 'exact', head: true }),
    (supabase as any).from('webinar_registrations').select('id', { count: 'exact', head: true }),
    (supabase as any)
      .from('profiles')
      .select('id, full_name, email, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  return {
    totalUsers: usersResult.count ?? 0,
    totalRegistrations: registrationsResult.count ?? 0,
    recentUsers: (recentUsersResult.data ?? []) as Array<{
      id: string;
      full_name: string | null;
      email: string;
      created_at: string;
    }>,
  };
}

export default async function AdminDashboardPage(): Promise<React.ReactElement> {
  const [webinars, modules, caseStudies, contentItems, stats] = await Promise.all([
    getWebinars(),
    getModules(),
    getCaseStudies(),
    getContentItems(),
    getAdminStats(),
  ]);

  const contentCards = [
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
        Platform overview and content management.
      </p>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-xl border border-black/[0.06] bg-white p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-500/10">
              <Users className="h-5 w-5 text-teal-600" strokeWidth={1.5} />
            </div>
            <span className="text-sm text-slate-600">Total Users</span>
          </div>
          <p className="font-serif text-3xl text-slate-900">{stats.totalUsers}</p>
        </div>
        <div className="rounded-xl border border-black/[0.06] bg-white p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10">
              <Ticket className="h-5 w-5 text-indigo-600" strokeWidth={1.5} />
            </div>
            <span className="text-sm text-slate-600">Webinar Registrations</span>
          </div>
          <p className="font-serif text-3xl text-slate-900">{stats.totalRegistrations}</p>
        </div>
        <div className="rounded-xl border border-black/[0.06] bg-white p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10">
              <TrendingUp className="h-5 w-5 text-emerald-600" strokeWidth={1.5} />
            </div>
            <span className="text-sm text-slate-600">Total Content</span>
          </div>
          <p className="font-serif text-3xl text-slate-900">
            {webinars.length + modules.length + caseStudies.length + contentItems.length}
          </p>
        </div>
      </div>

      <h2 className="font-serif text-xl text-slate-800 mb-4">Content Management</h2>
      <div className="grid gap-4 sm:grid-cols-2 mb-8">
        {contentCards.map((card) => {
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

      {stats.recentUsers.length > 0 && (
        <>
          <h2 className="font-serif text-xl text-slate-800 mb-4">Recent Signups</h2>
          <div className="rounded-xl border border-black/[0.06] bg-white overflow-hidden">
            <div className="divide-y divide-slate-100">
              {stats.recentUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">
                      {u.full_name || 'Unnamed user'}
                    </p>
                    <p className="text-xs text-slate-500">{u.email}</p>
                  </div>
                  <p className="text-xs text-slate-400">
                    {new Date(u.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
