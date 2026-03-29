import type { Metadata } from 'next';
import { ArrowRight, Cog, Lightbulb, TriangleAlert } from 'lucide-react';
import { GlowButton } from '@/components/marketing/glow-button';
import { Reveal } from '@/components/marketing/reveal';
import { SectionHeading } from '@/components/marketing/section-heading';

const CHALLENGES = [
  'Superficial understanding',
  'Insufficient clinical exposure',
  'Underdeveloped exam technique',
  'Confidence-anxiety cycle',
];

const STRATEGIES = [
  'Active learning',
  'Master the format',
  'Bridge clinical gaps',
];

const MEDUNI_SUPPORT = [
  'Expert-led discussions',
  'Structured prep and rubric training',
  'Deliberate practice',
  'Confidence-building for global learners',
];

export const metadata: Metadata = {
  title: 'Beyond Knowledge - Exam Success',
  description:
    'Learn why medical students struggle in exams and how MedUni helps build confident, exam-ready clinical performance.',
};

function DetailCard({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}): React.ReactElement {
  return (
    <div className="card rounded-3xl p-8">
      <div className="w-14 h-14 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h2 className="font-serif text-2xl text-slate-900 mb-5">{title}</h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="text-slate-600 text-sm leading-relaxed">
            <span className="text-teal-600 mr-2">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ExamSuccessPage(): React.ReactElement {
  return (
    <div className="py-32 sec-tint min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <Reveal variant="left">
            <SectionHeading
              eyebrow="Beyond Knowledge"
              title={
                <>
                  Why students struggle <br />
                  <span className="italic grad-text">and how to succeed</span>
                </>
              }
              description="Exam performance is a skill. Learn the strategies that move you from passive understanding to confident clinical presentation."
            />
            <div className="mt-10">
              <GlowButton href="/webinars" className="inline-flex gap-2">
                Start Your Exam Prep
                <ArrowRight className="w-5 h-5" />
              </GlowButton>
            </div>
          </Reveal>
          <Reveal variant="right">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="card rounded-3xl p-8 min-h-[320px] flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono text-rose-600 uppercase tracking-[.3em]">
                    Before
                  </span>
                  <h3 className="font-serif text-3xl text-slate-900 mt-4 mb-4">
                    Stressed and uncertain
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Fragmented revision, low confidence, and unclear exam
                    technique often leave students unsure how to perform under
                    pressure.
                  </p>
                </div>
                <div className="mt-8 rounded-2xl bg-rose-50 p-5 text-sm text-rose-700">
                  Knowledge alone is not enough.
                </div>
              </div>
              <div className="card rounded-3xl p-8 min-h-[320px] flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono text-teal-600 uppercase tracking-[.3em]">
                    After
                  </span>
                  <h3 className="font-serif text-3xl text-slate-900 mt-4 mb-4">
                    Calm and exam-ready
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Structured preparation helps students recognise patterns,
                    communicate clearly, and apply clinical reasoning with
                    confidence.
                  </p>
                </div>
                <div className="mt-8 rounded-2xl bg-teal-50 p-5 text-sm text-teal-700">
                  Strategy turns knowledge into performance.
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Reveal>
            <DetailCard
              icon={<TriangleAlert className="w-7 h-7 text-teal-600" />}
              title="Core Challenges"
              items={CHALLENGES}
            />
          </Reveal>
          <Reveal>
            <DetailCard
              icon={<Cog className="w-7 h-7 text-teal-600" />}
              title="Strategic Approach"
              items={STRATEGIES}
            />
          </Reveal>
          <Reveal>
            <DetailCard
              icon={<Lightbulb className="w-7 h-7 text-teal-600" />}
              title="How MedUni Helps"
              items={MEDUNI_SUPPORT}
            />
          </Reveal>
        </div>
      </div>
    </div>
  );
}
