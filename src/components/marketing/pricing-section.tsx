import { Check } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/marketing/reveal';
import { SectionHeading } from '@/components/marketing/section-heading';

const INCLUSIONS = [
  'Live attendance or watch anytime',
  'Replay access included',
  'Downloadable materials & resources',
  'CPD certificate where applicable',
];

interface PricingSectionProps {
  displayText?: string;
  description?: string;
}

export function PricingSection({
  displayText = 'From £3',
  description = 'Pay per webinar. Affordable sessions from just £3. No subscriptions.',
}: PricingSectionProps): React.ReactElement {
  return (
    <section id="pricing" className="py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal className="text-center mb-20">
          <div className="max-w-2xl mx-auto">
            <SectionHeading
              eyebrow="Pricing"
              title={
                <>
                  Simple pricing for <span className="italic grad-text">learning</span>
                </>
              }
              description={description}
            />
          </div>
        </Reveal>
        <Reveal>
          <div className="max-w-2xl mx-auto">
            <div className="pf rounded-3xl p-8 sm:p-10 relative overflow-hidden">
              <div className="absolute top-6 right-6">
                <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 text-xs font-mono uppercase tracking-wider">
                  Per webinar
                </span>
              </div>
              <div className="mb-8 pr-20">
                <div className="font-serif text-6xl sm:text-7xl grad-text mb-2">
                  {displayText}
                </div>
                <div className="text-slate-600 text-sm">
                  One-time purchase · Live + replay access
                </div>
              </div>
              <div className="space-y-3 mb-10">
                {INCLUSIONS.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-teal-600" />
                    </div>
                    <span className="text-sm text-slate-500">{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/webinars"
                  className="glow-btn flex-1 block text-center px-8 py-4 bg-teal-600 text-white font-semibold rounded-full relative z-10 text-lg"
                >
                  Browse webinars
                </Link>
                <Link
                  href="/#contact"
                  className="flex-1 block text-center px-8 py-4 rounded-full border border-slate-200 text-slate-500 hover:text-teal-600 hover:border-teal-500/30 transition-all font-medium text-lg"
                >
                  Questions?
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
