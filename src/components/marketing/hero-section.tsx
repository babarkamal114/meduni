import Link from 'next/link';
import { GlowButton } from '@/components/marketing/glow-button';
import { ArrowUpRight } from 'lucide-react';

export function HeroSection(): React.ReactElement {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden hero-bg">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-32 left-10 w-72 h-72 bg-teal-500/5 rounded-full blur-[120px] fl-s" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/[.03] rounded-full blur-[150px] fl-m" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-teal-500/[.04]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-teal-500/[.06]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-teal-500/[.08]" />
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center">
          <div className="fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/5 border border-teal-500/10 text-sm text-teal-600 mb-8">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            Clinical webinars for exam-ready learning
          </div>
          <h1 className="fade-up d1 font-serif text-5xl sm:text-6xl lg:text-8xl leading-[1.05]  text-slate-900 mb-8">
            Master Clinical Medicine
            <br />
            <span className="grad-text italic [font-family:var(--font-instrument-serif),Georgia,serif]">with Expert-Led Webinars</span>
          </h1>
          <p className="fade-up d2 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-12">
            High-yield, affordable online sessions that bridge textbook
            knowledge and real-world clinical excellence. MedUni connects
            medical students with expert clinicians across core disciplines to
            deepen understanding and support exam readiness.
          </p>
          <div className="fade-up d3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <GlowButton
              href="/webinars"
              className="group px-8 py-4 flex items-center gap-2 text-lg"
            >
              Explore Webinars
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </GlowButton>
            <Link
              href="/sign-up"
              className="px-8 py-4 rounded-full border border-slate-200 text-slate-500 hover:text-teal-600 hover:border-teal-500/30 transition-all font-medium text-lg"
            >
              Join Now - Free Registration &amp; Weekly Quiz
            </Link>
          </div>
          <div className="fade-up d4 grid grid-cols-3 gap-8 mt-20 pt-12 border-t border-black/5 max-w-lg mx-auto">
            <div className="text-center">
              <div className="font-serif text-3xl sm:text-4xl text-teal-600">
                NHS
              </div>
              <div className="text-xs text-slate-600 mt-1 uppercase tracking-widest">
                Expert-Led
              </div>
            </div>
            <div className="text-center">
              <div className="font-serif text-3xl sm:text-4xl text-teal-600">
                Real
              </div>
              <div className="text-xs text-slate-600 mt-1 uppercase tracking-widest">
                Case-Based
              </div>
            </div>
            <div className="text-center">
              <div className="font-serif text-3xl sm:text-4xl text-teal-600">
                OSCE
              </div>
              <div className="text-xs text-slate-600 mt-1 uppercase tracking-widest">
                Exam-Focused
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 fade-in d5">
        <div className="w-6 h-10 rounded-full border-2 border-slate-200 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-3 rounded-full bg-teal-500 animate-bounce" />
        </div>
      </div>
    </section>
  );
}
