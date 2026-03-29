import { Reveal } from '@/components/marketing/reveal';
import { GlowButton } from '@/components/marketing/glow-button';
import { ArrowRight } from 'lucide-react';

export function CtaStrip(): React.ReactElement {
  return (
    <section className="py-24 sec-tint border-y border-black/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal className="max-w-2xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-slate-900 mb-4">
            Ready to join a live webinar?
          </h2>
          <p className="text-slate-600 text-lg mb-8">
            Register free, explore upcoming sessions, and build clinical confidence with expert-led teaching.
          </p>
          <GlowButton href="/webinars" className="inline-flex gap-2 text-lg px-8 py-4">
            View Upcoming Sessions
            <ArrowRight className="w-5 h-5" />
          </GlowButton>
        </Reveal>
      </div>
    </section>
  );
}
