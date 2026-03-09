import {
  Video,
  PlayCircle,
  BookOpen,
  Sparkles,
  CreditCard,
  ShieldCheck,
} from 'lucide-react';
import { Reveal } from '@/components/marketing/reveal';
import { FeatureCard } from '@/components/marketing/feature-card';
import { SectionHeading } from '@/components/marketing/section-heading';

const FEATURES = [
  {
    icon: <Video className="w-7 h-7 text-teal-600" />,
    title: 'Live Webinars',
    description:
      'Host and sell expert-led medical webinars with integrated Zoom, automated reminders, and real-time attendance tracking.',
  },
  {
    icon: <PlayCircle className="w-7 h-7 text-teal-600" />,
    title: 'On-Demand Replays',
    description:
      'Missed a session? Purchase on-demand access and stream recordings securely from your personalised dashboard.',
  },
  {
    icon: <BookOpen className="w-7 h-7 text-teal-600" />,
    title: 'Weekly Content',
    description:
      'Case studies, quizzes, lecture summaries, and downloadable resources published weekly to keep learning continuous.',
  },
  {
    icon: <Sparkles className="w-7 h-7 text-teal-600" />,
    title: 'AI Chatbot',
    description:
      '24/7 AI-powered support for FAQs, technical help, and AI-generated webinar summaries — always available.',
  },
  {
    icon: <CreditCard className="w-7 h-7 text-teal-600" />,
    title: 'Secure Payments',
    description:
      'Stripe and PayPal integration with real-time validation, automated receipts, and branded email confirmations.',
  },
  {
    icon: <ShieldCheck className="w-7 h-7 text-teal-600" />,
    title: 'GDPR & Security',
    description:
      'Row-level security, JWT tokens, CSRF/XSS prevention, and full UK data protection compliance built-in.',
  },
];

const DELAYS = ['0.05s', '0.1s', '0.15s', '0.2s', '0.25s', '0.3s'];

export function FeaturesSection(): React.ReactElement {
  return (
    <section id="features" className="py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal className="max-w-2xl mb-20">
          <SectionHeading
            eyebrow="Platform Features"
            title={
              <>
                Everything you need to <span className="italic grad-text">teach & learn</span>
              </>
            }
            description="A comprehensive suite of tools built on modern infrastructure, designed for medical education excellence."
          />
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} style={{ transitionDelay: DELAYS[i] }}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
