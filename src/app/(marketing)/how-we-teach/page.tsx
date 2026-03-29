import type { Metadata } from 'next';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Brain,
  MessageSquare,
  PlayCircle,
  Workflow,
} from 'lucide-react';
import { GlowButton } from '@/components/marketing/glow-button';
import { Reveal } from '@/components/marketing/reveal';
import { SectionHeading } from '@/components/marketing/section-heading';

const LEARNING_POINTS = [
  {
    title: 'Systematic approach to acute vertigo',
    description: 'Build a clear clinical framework for rapid bedside assessment.',
    icon: Brain,
  },
  {
    title: 'Differentiating peripheral vs central causes',
    description: 'Recognise red flags and pattern differences that change management.',
    icon: Brain,
  },
  {
    title: 'Evidence-based management',
    description: 'Apply investigation and treatment steps using practical algorithms.',
    icon: Workflow,
  },
  {
    title: 'OSCE communication strategies',
    description: 'Explain findings and management plans with structure and confidence.',
    icon: MessageSquare,
  },
  {
    title: 'Common pitfalls',
    description: 'Avoid the mistakes that cost marks in exams and clinical stations.',
    icon: AlertTriangle,
  },
];

const MCQ_OPTIONS = [
  'Peripheral vestibular neuritis',
  'Benign paroxysmal positional vertigo',
  'Posterior circulation stroke',
  'Labyrinthitis',
];

const OSCE_POINTS = [
  'Focused history of onset, triggers, hearing symptoms, and neurological red flags',
  'Structured examination with gait, eye movements, and bedside vestibular assessment',
  'Clear explanation of differential diagnosis and escalation plan',
  'Safe communication of urgent management priorities',
];

export const metadata: Metadata = {
  title: 'How We Teach',
  description:
    'See how MedUni transforms complex clinical topics into practical, exam-ready teaching using the vertigo module example.',
};

export default function HowWeTeachPage(): React.ReactElement {
  return (
    <div className="py-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal className="max-w-3xl mb-16">
          <SectionHeading
            eyebrow="How We Teach"
            title={
              <>
                From complex topics to <span className="italic grad-text">exam-ready skills</span>
              </>
            }
            description="See how MedUni structures a clinical webinar so students leave with a practical framework, stronger recall, and clearer exam technique."
          />
        </Reveal>

        <Reveal>
          <section className="card rounded-[2rem] p-8 sm:p-10 mb-24">
            <div className="aspect-video rounded-[1.5rem] bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(20,184,166,0.22),_transparent_55%)]" />
              <div className="relative z-10 text-center px-6">
                <div className="w-20 h-20 rounded-full bg-white/10 border border-white/15 mx-auto flex items-center justify-center mb-6">
                  <PlayCircle className="w-10 h-10 text-white" />
                </div>
                <p className="text-white text-xl sm:text-2xl font-serif max-w-2xl">
                  See how we transform complex clinical topics into exam-ready
                  skills
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mt-5">
              Vertigo module preview: structured teaching, clinical reasoning,
              and OSCE-focused communication in one session.
            </p>
          </section>
        </Reveal>

        <section className="mb-24">
          <Reveal className="max-w-2xl mb-12">
            <SectionHeading
              eyebrow="What you will learn"
              title={
                <>
                  Vertigo teaching that is <span className="italic grad-text">clinically usable</span>
                </>
              }
            />
          </Reveal>
          <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6">
            {LEARNING_POINTS.map((point, index) => {
              const Icon = point.icon;
              return (
                <Reveal
                  key={point.title}
                  style={{ transitionDelay: `${index * 0.05}s` }}
                >
                  <div className="card rounded-3xl p-6 h-full">
                    <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-5">
                      <Icon className="w-6 h-6 text-teal-600" />
                    </div>
                    <h3 className="font-serif text-xl text-slate-900 mb-3">
                      {point.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </section>

        <div className="grid lg:grid-cols-2 gap-6 mb-24">
          <Reveal>
            <section className="card rounded-3xl p-8 h-full">
              <span className="text-xs font-mono text-teal-600 uppercase tracking-[.3em]">
                Sample Case + MCQ
              </span>
              <h2 className="font-serif text-3xl text-slate-900 mt-4 mb-6">
                Case-based reasoning in action
              </h2>
              <div className="rounded-3xl bg-slate-50 border border-slate-200 p-6 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">
                    Vestibular system diagram
                  </div>
                  <div className="rounded-2xl border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500">
                    Patient silhouette
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-6 mb-6">
                <p className="text-sm font-semibold text-slate-700 mb-4">
                  A 65-year-old presents with acute vertigo, vomiting, and gait
                  unsteadiness. Which diagnosis must be excluded first?
                </p>
                <ul className="space-y-3">
                  {MCQ_OPTIONS.map((option) => (
                    <li
                      key={option}
                      className={`rounded-xl px-4 py-3 text-sm ${
                        option === 'Posterior circulation stroke'
                          ? 'bg-teal-50 border border-teal-200 text-teal-700'
                          : 'bg-white border border-slate-200 text-slate-600'
                      }`}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-slate-50 p-6">
                <h3 className="font-semibold text-slate-800 mb-4">
                  Stepwise evidence-based management
                </h3>
                <ul className="space-y-3">
                  <li className="text-sm text-slate-600">1. Identify central red flags immediately.</li>
                  <li className="text-sm text-slate-600">2. Perform focused bedside neurological and vestibular assessment.</li>
                  <li className="text-sm text-slate-600">3. Escalate urgent imaging when stroke is suspected.</li>
                  <li className="text-sm text-slate-600">4. Tailor treatment once peripheral causes are safely confirmed.</li>
                </ul>
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="card rounded-3xl p-8 h-full flex flex-col">
              <span className="text-xs font-mono text-teal-600 uppercase tracking-[.3em]">
                OSCE Station Card
              </span>
              <h2 className="font-serif text-3xl text-slate-900 mt-4 mb-6">
                Scenario + marking rubric
              </h2>
              <div className="rounded-2xl bg-slate-50 p-6 mb-6">
                <p className="text-sm text-slate-600 leading-relaxed">
                  You are the junior doctor assessing a patient in the emergency
                  department with sudden onset dizziness. Take a focused
                  history, explain your differential diagnosis, and outline your
                  immediate management plan.
                </p>
              </div>
              <div className="space-y-4 flex-1">
                {OSCE_POINTS.map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-4 rounded-2xl bg-slate-50 p-5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-5 h-5 text-teal-600" />
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {point}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact"
                  className="px-6 py-3 rounded-full border border-slate-200 text-slate-600 hover:text-teal-600 hover:border-teal-500/30 transition-all font-medium text-sm"
                >
                  Download OSCE Checklist
                </Link>
                <GlowButton href="/webinars" className="inline-flex gap-2 text-sm">
                  Register Now - GBP 20 per participant
                  <ArrowRight className="w-4 h-4" />
                </GlowButton>
              </div>
            </section>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
