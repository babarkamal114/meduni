import { Reveal } from '@/components/marketing/reveal';
import { SectionHeading } from '@/components/marketing/section-heading';

const STEPS = [
  {
    step: 'Step 1',
    title: 'Browse',
    description:
      'Explore webinars by specialty and date. Find sessions that match your learning goals.',
    alignRight: false,
  },
  {
    step: 'Step 2',
    title: 'Register',
    description:
      'Create an account and secure your place. Simple checkout with secure payment.',
    alignRight: true,
  },
  {
    step: 'Step 3',
    title: 'Attend',
    description:
      'Join live on the day or watch the replay at your convenience. Fit learning around your schedule.',
    alignRight: false,
  },
  {
    step: 'Step 4',
    title: 'Access',
    description:
      'Replays and materials stay in your dashboard. Revisit anytime with lifetime access.',
    alignRight: true,
  },
];

export function TimelineSection(): React.ReactElement {
  return (
    <section id="timeline" className="py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal className="text-center mb-20">
          <div className="max-w-2xl mx-auto">
            <SectionHeading
              eyebrow="How it works"
              title={
                <>
                  From browsing to <span className="italic grad-text">replay</span>
                </>
              }
              description="Your journey from discovery to certification in four simple steps."
            />
          </div>
        </Reveal>
        <div className="max-w-3xl mx-auto relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px tl-line" />
          {STEPS.map((item, i) => (
            <Reveal
              key={item.step}
              className={`relative flex items-center ${item.alignRight ? 'mb-16 justify-end' : 'mb-16'}`}
              style={{ transitionDelay: `${0.05 + i * 0.1}s` }}
            >
              <div
                className={`w-full md:w-1/2 pl-20 md:pl-0 ${item.alignRight ? 'md:pl-12' : 'md:pr-12 md:text-right'}`}
              >
                <div className="bg-white rounded-2xl p-6 border border-black/[.06] shadow-sm hover:shadow-md hover:border-teal-500/20 transition-all">
                  <span className="text-xs font-mono text-teal-600 uppercase tracking-wider">
                    {item.step}
                  </span>
                  <h3 className="font-serif text-xl text-slate-800 mt-2 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm">{item.description}</p>
                </div>
              </div>
              <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-teal-500 border-4 border-[#fdfcfa] tl-dot" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
