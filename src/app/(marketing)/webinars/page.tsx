import type { Metadata } from 'next';
import Link from 'next/link';
import { Video } from 'lucide-react';
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

  if (all.length === 0) {
    return (
      <div className="py-32 sec-tint min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <Reveal className="max-w-2xl mb-20">
            <SectionHeading
              eyebrow="Webinars"
              title={
                <>
                  Clinical sessions built for <span className="italic grad-text">exam readiness</span>
                </>
              }
              description="Explore MedUni webinars led by clinicians and specialists."
            />
          </Reveal>
          <Reveal>
            <div className="card rounded-2xl p-12 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center mx-auto mb-6">
                <Video className="w-8 h-8 text-teal-600" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl text-slate-800 mb-2">No webinars yet</h3>
              <p className="text-slate-600 text-sm mb-6">
                New expert-led sessions are added regularly. Check back soon or get in touch to be notified.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-teal-600 text-white font-medium text-sm hover:bg-teal-700 transition-colors"
              >
                Get notified
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    );
  }

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

        {UPCOMING.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {UPCOMING.map((webinar, i) => (
              <Reveal key={webinar.id} style={{ transitionDelay: `${i * 0.1}s` }}>
                <MarketingWebinarCard webinar={webinar} />
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal>
            <div className="card rounded-2xl p-10 text-center max-w-md mx-auto mb-20">
              <Video className="w-10 h-10 text-teal-500/40 mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="font-serif text-lg text-slate-700 mb-1">No upcoming webinars</h3>
              <p className="text-slate-500 text-sm">Check back soon for new expert-led sessions.</p>
            </div>
          </Reveal>
        )}

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
