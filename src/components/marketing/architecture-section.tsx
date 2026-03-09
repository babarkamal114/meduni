import { Users, CalendarCheck, ShieldCheck } from 'lucide-react';
import { Reveal } from '@/components/marketing/reveal';
import { SectionHeading } from '@/components/marketing/section-heading';

const CARDS = [
  {
    icon: Users,
    title: 'Expert-led',
    tag: 'SPECIALISTS & CONSULTANTS',
    description:
      'Learn from practising specialists and consultants. Evidence-based content designed for busy healthcare professionals.',
  },
  {
    icon: CalendarCheck,
    title: 'Flexible learning',
    tag: 'CPD-READY',
    description:
      'Join live or watch the replay at your convenience. CPD points and certificates where applicable. Fit learning around your schedule.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & yours',
    tag: 'REPLAYS & MATERIALS',
    description:
      'Lifetime replay access and downloadable materials in your dashboard. GDPR compliant and built for UK healthcare.',
  },
];

export function ArchitectureSection(): React.ReactElement {
  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal className="text-center mb-20">
          <div className="max-w-2xl mx-auto">
            <SectionHeading
              eyebrow="Why MedUni"
              title={
                <>
                  Learn with <span className="italic grad-text">confidence</span>
                </>
              }
              description="Expert-led medical education that fits your schedule and meets professional standards."
            />
          </div>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {CARDS.map((item) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title}>
                <div className="card rounded-2xl p-8 text-center">
                  <div className="ic w-20 h-20 mx-auto mb-6 rounded-2xl bg-teal-500/10 flex items-center justify-center">
                    <Icon className="w-10 h-10 text-teal-600" />
                  </div>
                  <h3 className="font-serif text-xl text-slate-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs font-mono text-teal-700 mb-4">
                    {item.tag}
                  </p>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
