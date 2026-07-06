import Link from 'next/link';
import Image from 'next/image';
import { siteConfig } from '@/config/site';

export function Footer(): React.ReactElement {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-16 border-t border-black/5 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Image
                src="/images/med-uni-logo.png"
                alt={`${siteConfig.name} logo`}
                width={184}
                height={56}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
              Expert-led clinical medicine webinars for medical students,
              designed to bridge textbook learning with practical exam-ready
              performance.
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
              <Link
                href={`mailto:${siteConfig.contactEmail}`}
                className="block text-sm text-slate-600 hover:text-teal-600 transition-colors"
              >
                {siteConfig.contactEmail}
              </Link>
              <span className="block text-sm text-slate-500">United Kingdom</span>
              <span className="block text-sm text-slate-500">GDPR Compliant</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-black/5 gap-4">
          <p className="text-xs text-slate-500">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/contact"
              className="text-xs text-slate-500 hover:text-teal-600 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/contact"
              className="text-xs text-slate-500 hover:text-teal-600 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
