import { Quote } from 'lucide-react';
import { Reveal } from '@/components/marketing/reveal';
import { SectionHeading } from '@/components/marketing/section-heading';
import { cn } from '@/lib/utils/cn';

const TESTIMONIALS = [
  {
    quote:
      'The dashboard made it easy to track my progress. I completed three modules and got my CPD certificates without chasing anyone.',
    name: 'Dr. Sarah Mitchell',
    title: 'GP, London',
    initials: 'SM',
  },
  {
    quote:
      'I love having all my webinar tickets and replays in one place. The AI summaries save me hours when I need to revisit a session.',
    name: 'Dr. James Chen',
    title: 'Cardiology Registrar',
    initials: 'JC',
  },
  {
    quote:
      'Case studies and quizzes in My Learning fit perfectly around my schedule. The platform feels built for busy clinicians.',
    name: 'Dr. Emma Watson',
    title: 'Paediatrician',
    initials: 'EW',
  },
];

const DELAYS = ['0s', '0.1s', '0.2s'];

function TestimonialBlock({
  quote,
  name,
  title,
  initials,
  className,
}: {
  quote: string;
  name: string;
  title: string;
  initials: string;
  className?: string;
}): React.ReactElement {
  return (
    <div
      className={cn(
        'card rounded-2xl p-8 h-full flex flex-col border-l-4 border-l-teal-500/50',
        'hover:border-l-teal-500 transition-colors duration-200',
        className
      )}
    >
      <Quote className="w-10 h-10 text-teal-500/30 mb-6 flex-shrink-0" aria-hidden />
      <blockquote className="font-serif text-lg text-slate-700 leading-relaxed mb-8 flex-1">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <footer className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-semibold text-teal-600">{initials}</span>
        </div>
        <div>
          <p className="font-semibold text-slate-800">{name}</p>
          <p className="text-sm text-slate-500">{title}</p>
        </div>
      </footer>
    </div>
  );
}

export function TestimonialsSection(): React.ReactElement {
  return (
    <section id="testimonials" className="py-32 sec-tint">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal className="max-w-2xl mb-20">
          <SectionHeading
            eyebrow="What clinicians say"
            title={
              <>
                Trusted by <span className="italic grad-text">medical professionals</span>
              </>
            }
            description="See how the platform supports continuous learning and CPD."
          />
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} style={{ transitionDelay: DELAYS[i] }}>
              <TestimonialBlock
                quote={t.quote}
                name={t.name}
                title={t.title}
                initials={t.initials}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
