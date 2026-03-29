import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getCaseStudyById } from '@/lib/data/learning';
import { CaseStudyForm } from '../../case-study-form';
import { updateCaseStudy } from '../../../actions';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminCaseStudyEditPage({ params }: EditPageProps): Promise<React.ReactElement> {
  const { id } = await params;
  const caseStudy = await getCaseStudyById(id);
  if (!caseStudy) notFound();

  return (
    <div>
      <Link
        href="/admin/learning/case-studies"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to Case Studies
      </Link>
      <h1 className="font-serif text-3xl text-slate-900 mb-1">Edit Case Study</h1>
      <p className="text-slate-600 text-sm mb-8">Update case study details.</p>
      <CaseStudyForm action={updateCaseStudy} initialValues={caseStudy} />
    </div>
  );
}
