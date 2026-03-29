import { notFound } from 'next/navigation';
import { getCaseStudyById } from '@/lib/data/learning';
import { CaseStudyView } from '@/components/dashboard/case-study-view';

interface CaseStudyPageProps {
  params: Promise<{ id: string }>;
}

export default async function CaseStudyPage({ params }: CaseStudyPageProps): Promise<React.ReactElement> {
  const { id } = await params;
  const caseStudy = await getCaseStudyById(id);
  if (!caseStudy) notFound();
  return <CaseStudyView caseStudy={caseStudy} />;
}
