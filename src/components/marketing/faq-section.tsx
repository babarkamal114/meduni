'use client';

import { Reveal } from '@/components/marketing/reveal';
import { SectionHeading } from '@/components/marketing/section-heading';
import { cn } from '@/lib/utils/cn';
import { ChevronDown } from 'lucide-react';

const FAQ_ITEMS = [
  {
    question: 'How much do webinars cost?',
    answer:
      'We use pay-per-webinar pricing, typically £25–£49 depending on topic and length. There are no subscriptions. Each purchase includes live attendance and on-demand replay access.',
  },
  {
    question: 'Do I get CPD certificates?',
    answer:
      'Yes. Where applicable, CPD certificates are available after completing eligible webinars or modules. You can view and download them from your Certificates page in the dashboard.',
  },
  {
    question: 'Can I watch a webinar after it’s finished?',
    answer:
      'Yes. Replay access is included with your ticket. You can stream recordings anytime from your dashboard under Webinars, and materials stay available for you to revisit.',
  },
  {
    question: 'How do I access my purchases?',
    answer:
      'After signing up and purchasing a ticket, everything appears in your dashboard: upcoming webinars under Webinars and My Tickets, replays in the webinar library, and learning content under My Learning.',
  },
];

function FaqItem({
  question,
  answer,
  isLast,
}: {
  question: string;
  answer: string;
  isLast: boolean;
}): React.ReactElement {
  return (
    <details
      className={cn(
        'group border-b border-slate-200',
        !isLast && 'mb-2'
      )}
    >
      <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer list-none text-left font-medium text-slate-800 hover:text-teal-600 transition-colors">
        <span>{question}</span>
        <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <p className="pb-5 text-slate-600 text-sm leading-relaxed">{answer}</p>
    </details>
  );
}

export function FaqSection(): React.ReactElement {
  return (
    <section id="faq" className="py-32 sec-tint">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <Reveal className="max-w-2xl mb-20">
          <SectionHeading
            eyebrow="FAQ"
            title={
              <>
                Common <span className="italic grad-text">questions</span>
              </>
            }
            description="Quick answers about pricing, access, and your dashboard."
          />
        </Reveal>
        <Reveal>
          <div className="max-w-2xl">
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem
                key={item.question}
                question={item.question}
                answer={item.answer}
                isLast={i === FAQ_ITEMS.length - 1}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
