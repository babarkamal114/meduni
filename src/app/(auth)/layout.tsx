import Link from 'next/link';
import { AuthMarketingPanel } from '@/components/auth/auth-marketing-panel';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden lg:block">
        <AuthMarketingPanel />
      </div>
      <div className="relative flex flex-col items-center justify-center px-6 py-12 lg:px-12">
        <div className="mb-8 flex w-full max-w-md items-center justify-between lg:absolute lg:top-12 lg:right-12 lg:mb-0 lg:max-w-none">
          <Link href="/" className="font-serif text-lg font-medium text-slate-900">
            MedUni
          </Link>
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-700">
            ← Home
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}

