import {
  Stethoscope,
  FileText,
  BadgeCheck,
  Globe2,
} from 'lucide-react';
import { Reveal } from '@/components/marketing/reveal';
import { FeatureCard } from '@/components/marketing/feature-card';
import { SectionHeading } from '@/components/marketing/section-heading';

const FEATURES = [
  {
    icon: <Stethoscope className="w-7 h-7 text-teal-600" />,
    title: 'Learn from Experts',
    description:
      'UK-trained NHS consultants and specialists make complex clinical topics clear, practical, and relevant.',
  },
  {
    icon: <FileText className="w-7 h-7 text-teal-600" />,
    title: 'Case-Based Curriculum',
    description:
      'Real patient cases and evidence-based clinical algorithms help you apply knowledge with confidence.',
  },
  {
    icon: <BadgeCheck className="w-7 h-7 text-teal-600" />,
    title: 'Exam-Focused Strategies',
    description:
      'Targeted preparation for OSCEs, clinical presentations, and MCQs with practical strategies that work.',
  },
  {
    icon: <Globe2 className="w-7 h-7 text-teal-600" />,
    title: 'Global Community',
    description:
      'Join students from the UK, the Middle East, and beyond with accessible pricing and Zoom delivery.',
  },
];

const DELAYS = ['0.05s', '0.1s', '0.15s', '0.2s'];

export function FeaturesSection(): React.ReactElement {
  return (
    <section id="features" className="py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal className="max-w-2xl mb-20">
          <SectionHeading
            eyebrow="What makes our webinars unique"
            title={
              <>
                Expert teaching built for <span className="italic grad-text">clinical progress</span>
              </>
            }
            description="Practical, focused sessions designed to bridge classroom theory with real-world clinical performance."
          />
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} style={{ transitionDelay: DELAYS[i] }}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                className="h-full"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
