import Link from 'next/link';
import { Stethoscope, FileText, BadgeCheck } from 'lucide-react';
import { siteConfig } from '@/config/site';

const BULLETS = [
  {
    icon: Stethoscope,
    text: 'Expert-led clinical webinars from UK-NHS consultants',
  },
  {
    icon: FileText,
    text: 'Case-based learning for OSCEs and clinical exams',
  },
  {
    icon: BadgeCheck,
    text: 'Track progress and access replays in your dashboard',
  },
];

export function AuthMarketingPanel(): React.ReactElement {
  return (
    <div className="relative flex min-h-screen flex-col justify-between bg-slate-900 px-8 py-12 lg:px-12">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-teal-600/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-teal-500/10" />
      </div>

      <div className="relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-serif text-xl font-medium text-white"
        >
          {siteConfig.name}
        </Link>
      </div>

      <div className="relative z-10 max-w-md">
        <h1 className="font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl">
          Clinical medicine learning, built for exam success
        </h1>
        <p className="mt-4 text-slate-400">
          {siteConfig.description}
        </p>
        <ul className="mt-10 space-y-5">
          {BULLETS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400">
                <Icon className="h-4 w-4" />
              </span>
              <span className="text-slate-300">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative z-10 text-sm text-slate-500">
        <Link href="/" className="hover:text-teal-400 transition-colors">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
