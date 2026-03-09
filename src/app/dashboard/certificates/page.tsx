import { CertificateCard } from '@/components/dashboard/certificate-card';
import { GraduationCap, Award } from 'lucide-react';

export default function DashboardCertificatesPage(): React.ReactElement {
  return (
    <div className="px-6 lg:px-8 py-8 max-w-[1400px]">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-slate-900 mb-1">Certificates</h1>
        <p className="text-slate-600 text-sm">
          Your earned certificates and CPD points
        </p>
      </div>
      <div className="grid sm:grid-cols-2 gap-6">
        <CertificateCard
          title="Dermatology Masterclass"
          completedDate="10 Jan 2025"
          cpdPoints={2}
          icon={<GraduationCap strokeWidth={1.5} />}
          iconBg="bg-teal-50"
        />
        <CertificateCard
          title="Diabetes Management"
          completedDate="28 Dec 2024"
          cpdPoints={3}
          icon={<Award strokeWidth={1.5} />}
          iconBg="bg-amber-50"
        />
      </div>
    </div>
  );
}
