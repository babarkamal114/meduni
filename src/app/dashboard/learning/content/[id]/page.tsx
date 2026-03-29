import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getContentById, getContentQuizPassedIds } from '@/lib/data/learning';
import { getUser } from '@/lib/auth/getUser';
import { ContentView } from '@/components/dashboard/learning/content-view';
import { submitContentQuizAttempt } from '../../actions';

interface ContentPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ retake?: string }>;
}

export default async function ContentPage({
  params,
  searchParams,
}: ContentPageProps): Promise<React.ReactElement> {
  const { id } = await params;
  const { retake } = await searchParams;
  const user = await getUser();
  const [content, passedIds] = await Promise.all([
    getContentById(id),
    user ? getContentQuizPassedIds(user.id) : Promise.resolve(new Set<string>()),
  ]);

  if (!content) notFound();

  const isQuiz = content.type === 'quiz';
  const hasPassed = isQuiz && passedIds.has(id);
  const showPassedView = hasPassed && retake !== '1';

  return (
    <div className="px-6 lg:px-8 py-8 max-w-[900px]">
      <Link
        href="/dashboard/learning"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600 mb-6"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to My Learning
      </Link>
      <ContentView
        content={content}
        passedView={showPassedView}
        recordContentQuizAction={showPassedView ? undefined : submitContentQuizAttempt}
      />
    </div>
  );
}
