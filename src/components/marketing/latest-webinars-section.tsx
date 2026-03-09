import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/marketing/reveal';
import { SectionHeading } from '@/components/marketing/section-heading';
import { GlowButton } from '@/components/marketing/glow-button';
import { MarketingWebinarCard } from '@/components/marketing/webinar-card';
import { MOCK_WEBINARS } from '@/lib/data/mock-webinars';

const UPCOMING = MOCK_WEBINARS.filter(
  (w) => w.status === 'live' || w.status === 'upcoming'
).slice(0, 3);

export function LatestWebinarsSection(): React.ReactElement {
  return (
    <section id="webinars" className="py-32 sec-tint">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal className="mb-20">
          <div className="max-w-2xl">
            <SectionHeading
              eyebrow="Upcoming webinars"
              title={
                <>
                  Latest <span className="italic grad-text">sessions</span>
                </>
              }
              description="Expert-led medical education webinars. Join live or watch the replay at your convenience."
            />
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {UPCOMING.map((webinar, i) => (
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
