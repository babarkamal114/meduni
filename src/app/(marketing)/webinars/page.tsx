import type { Metadata } from 'next';
import { MOCK_WEBINARS } from '@/lib/data/mock-webinars';
import { Reveal } from '@/components/marketing/reveal';
import { SectionHeading } from '@/components/marketing/section-heading';
import { MarketingWebinarCard } from '@/components/marketing/webinar-card';

export const metadata: Metadata = {
  title: 'Webinars',
  description: 'Browse our upcoming medical education webinars',
};

const UPCOMING = MOCK_WEBINARS.filter(
  (w) => w.status === 'live' || w.status === 'upcoming'
);
const RECORDED = MOCK_WEBINARS.filter((w) => w.status === 'recorded');

export default function WebinarsPage(): React.ReactElement {
  return (
    <div className="py-32 sec-tint min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal className="max-w-2xl mb-20">
          <SectionHeading
            eyebrow="Upcoming webinars"
            title={
              <>
                Expert-led <span className="italic grad-text">sessions</span>
              </>
            }
            description="Join live or watch replays. Book your place and access everything from your dashboard."
          />
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {UPCOMING.map((webinar, i) => (
            <Reveal key={webinar.id} style={{ transitionDelay: `${i * 0.1}s` }}>
              <MarketingWebinarCard webinar={webinar} />
            </Reveal>
          ))}
        </div>

        {RECORDED.length > 0 && (
          <>
            <Reveal className="max-w-2xl mb-12">
              <SectionHeading
                eyebrow="Recorded"
                title={
                  <>
                    Watch <span className="italic grad-text">anytime</span>
                  </>
                }
                description="Buy once and stream at your convenience."
              />
            </Reveal>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {RECORDED.map((webinar, i) => (
                <Reveal
                  key={webinar.id}
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <MarketingWebinarCard webinar={webinar} />
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
