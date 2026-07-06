import Link from 'next/link';
import { GraduationCap, Home, BookOpen, Video } from 'lucide-react';

export default function NotFound(): React.ReactElement {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20 bg-[#f8f6f1]">
      <div className="max-w-lg text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700">
          <GraduationCap className="h-8 w-8 text-white" />
        </div>
        <h1 className="font-serif text-5xl text-slate-900 mb-3">404</h1>
        <p className="text-lg text-slate-600 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
          >
            <Home className="h-4 w-4" />
            Go home
          </Link>
          <Link
            href="/webinars"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-medium text-slate-600 hover:text-teal-600 hover:border-teal-500/30 transition-all"
          >
            <Video className="h-4 w-4" />
            Browse webinars
          </Link>
          <Link
            href="/dashboard/learning"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-6 py-3 text-sm font-medium text-slate-600 hover:text-teal-600 hover:border-teal-500/30 transition-all"
          >
            <BookOpen className="h-4 w-4" />
            My Learning
          </Link>
        </div>
      </div>
    </main>
  );
}
