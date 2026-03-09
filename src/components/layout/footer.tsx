import Link from 'next/link';
import { GraduationCap } from 'lucide-react';
import { siteConfig } from '@/config/site';

export function Footer(): React.ReactElement {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-16 border-t border-black/5 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="font-serif text-2xl text-slate-900">
                {siteConfig.name}
              </span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
              Next-generation medical education platform. Expert-led webinars,
              AI-powered learning tools, and a seamless digital experience.
            </p>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[.2em] text-slate-500 mb-4">
              Platform
            </h4>
            <div className="space-y-3">
              {siteConfig.navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-slate-600 hover:text-teal-600 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-[.2em] text-slate-500 mb-4">
              Contact
            </h4>
            <div className="space-y-3">
              <a
                href={`mailto:${siteConfig.contactEmail}`}
                className="block text-sm text-slate-600 hover:text-teal-600 transition-colors"
              >
                {siteConfig.contactEmail}
              </a>
              <span className="block text-sm text-slate-500">United Kingdom</span>
              <span className="block text-sm text-slate-500">GDPR Compliant</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-black/5 gap-4">
          <p className="text-xs text-slate-500">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">
            Built by{' '}
            <a
              href="#"
              className="text-teal-600 hover:text-teal-700 transition-colors"
            >
              DevBeam
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
