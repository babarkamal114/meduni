import { Quote } from 'lucide-react';
import { Reveal } from '@/components/marketing/reveal';
import { SectionHeading } from '@/components/marketing/section-heading';
import { cn } from '@/lib/utils/cn';

const TESTIMONIALS = [
  {
    quote:
      'The webinars are brilliant for exam revision. I watch the replay before OSCEs and the quizzes help me identify weak areas fast.',
    name: 'Priya Kaur',
    title: 'Final Year Medical Student, UCL',
    initials: 'PK',
  },
  {
    quote:
      'Having all my webinar tickets and replays in one place is a game-changer. I revisit sessions whenever I need to refresh a topic.',
    name: 'Dr. James Chen',
    title: 'Cardiology Registrar',
    initials: 'JC',
  },
  {
    quote:
      'Case studies and module quizzes fit perfectly around my schedule. The certificates are a great addition to my portfolio.',
    name: 'Dr. Sarah Mitchell',
    title: 'Foundation Year Doctor',
    initials: 'SM',
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
            eyebrow="What learners say"
            title={
              <>
                Trusted by <span className="italic grad-text">students and professionals</span>
              </>
            }
            description="See how MedUni supports exam preparation and continuous learning."
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
