import { CertificateCard } from '@/components/dashboard/certificate-card';
import { EmptyState } from '@/components/dashboard/empty-state';
import { GraduationCap } from 'lucide-react';
import { getCertificationsWithDetails } from '@/lib/data/learning';
import { getUser } from '@/lib/auth/getUser';
import { format } from 'date-fns';

export default async function DashboardCertificatesPage(): Promise<React.ReactElement> {
  const user = await getUser();
  const certs = user?.id ? await getCertificationsWithDetails(user.id) : [];

  return (
    <div className="px-6 lg:px-8 py-8 max-w-[1400px]">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-slate-900 mb-1">Certificates</h1>
        <p className="text-slate-600 text-sm">
          Your earned certificates
        </p>
      </div>
      {certs.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No certificates yet"
          description="Complete modules and pass their quizzes to earn your first certificate."
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {certs.map((c) => (
            <CertificateCard
              key={c.module_id}
              title={c.module_title}
              completedDate={format(new Date(c.certified_at), 'd MMM yyyy')}
              icon={<GraduationCap strokeWidth={1.5} />}
              iconBg="bg-teal-50"
              viewHref={`/dashboard/learning/certificate/${c.module_slug}`}
              downloadHref={`/api/certificates/${c.module_slug}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
