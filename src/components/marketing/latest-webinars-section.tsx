import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/marketing/reveal';
import { SectionHeading } from '@/components/marketing/section-heading';
import { GlowButton } from '@/components/marketing/glow-button';
import { MarketingWebinarCard } from '@/components/marketing/webinar-card';
import type { Webinar } from '@/lib/data/webinars';

interface LatestWebinarsSectionProps {
  webinars?: Webinar[];
}

export function LatestWebinarsSection({ webinars = [] }: LatestWebinarsSectionProps): React.ReactElement {
  const upcoming = webinars.filter((w) => w.status === 'live' || w.status === 'upcoming').slice(0, 3);
  return (
    <section id="webinars" className="py-32 sec-tint">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal className="mb-20">
          <div className="max-w-2xl">
            <SectionHeading
              eyebrow="Upcoming webinars"
              title={
                <>
                  Upcoming <span className="italic grad-text">sessions</span>
                </>
              }
              description="Join focused clinical webinars led by expert clinicians and explore the sessions currently open for registration."
            />
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {upcoming.map((webinar, i) => (
            <Reveal key={webinar.id} style={{ transitionDelay: `${i * 0.1}s` }}>
              <MarketingWebinarCard webinar={webinar} />
            </Reveal>
          ))}
        </div>
        <Reveal className="text-center">
          <GlowButton href="/webinars" className="inline-flex">
            View all webinars
            <ArrowRight className="w-5 h-5" />
          </GlowButton>
        </Reveal>
      </div>
    </section>
  );
}
