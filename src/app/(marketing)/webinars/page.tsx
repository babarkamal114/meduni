import type { Metadata } from 'next';
import { getWebinars } from '@/lib/data/webinars';
import { Reveal } from '@/components/marketing/reveal';
import { SectionHeading } from '@/components/marketing/section-heading';
import { MarketingWebinarCard } from '@/components/marketing/webinar-card';

export const metadata: Metadata = {
  title: 'Webinars',
  description: 'Browse upcoming expert-led clinical medicine webinars from MedUni.',
};

export default async function WebinarsPage(): Promise<React.ReactElement> {
  const all = await getWebinars();
  const UPCOMING = all.filter((w) => w.status === 'live' || w.status === 'upcoming');
  const RECORDED = all.filter((w) => w.status === 'recorded');
  return (
    <div className="py-32 sec-tint min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal className="max-w-2xl mb-20">
          <SectionHeading
            eyebrow="Upcoming webinars"
            title={
              <>
                Clinical sessions built for <span className="italic grad-text">exam readiness</span>
              </>
            }
            description="Explore upcoming MedUni webinars led by clinicians and specialists, with focused outcomes designed to strengthen practical understanding."
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
