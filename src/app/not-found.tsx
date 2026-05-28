import Link from 'next/link';

export default function NotFound(): React.ReactElement {
  return (
    <main className="min-h-[60vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-semibold text-slate-900 mb-3">Page not found</h1>
        <p className="text-slate-600 mb-6">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition-colors"
        >
          Go to home
        </Link>
      </div>
    </main>
  );
}
