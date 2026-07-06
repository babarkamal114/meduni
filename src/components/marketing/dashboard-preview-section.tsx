import { Check, Video } from 'lucide-react';
import { Reveal } from '@/components/marketing/reveal';
import { SectionHeading } from '@/components/marketing/section-heading';

const CHECKLIST = [
  {
    title: 'Live, interactive small-group sessions',
    description: 'Join focused teaching sessions designed to make participation and discussion easy.',
  },
  {
    title: 'Expert-led webinars',
    description: 'Learn with attending physicians, consultants, and clinicians who teach from practice.',
  },
  {
    title: 'Recordings and notes for every session',
    description: 'Review each webinar anytime with individual access to recordings and comprehensive notes.',
  },
  {
    title: 'Discounted group rates',
    description: 'Flexible pricing for teams, university groups, and organised student cohorts.',
  },
  {
    title: 'Attendance certificate',
    description: 'Receive a certificate for every session to support your academic and professional journey.',
  },
];

export function DashboardPreviewSection(): React.ReactElement {
  return (
    <section id="mission" className="py-32 sec-tint">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16 items-center">
          <Reveal variant="left">
            <SectionHeading
              eyebrow="Our mission"
              title={
                <>
                  Flexible, theme-based learning <br />
                  <span className="italic grad-text">that fits your schedule</span>
                </>
              }
              description="MedUni exists to help medical students learn in a way that is practical, affordable, and aligned with clinical excellence. Every webinar is designed to advance your medical career without forcing your learning around a rigid schedule."
            />
            <div className="space-y-5 mt-10">
              {CHECKLIST.map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-1">
                      {item.title}
                    </h4>
                    <p className="text-slate-600 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal variant="right">
            <div className="bg-white rounded-3xl p-5 sm:p-6 relative border border-black/[.06] shadow-xl shadow-teal-500/5">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-300" />
                <div className="w-3 h-3 rounded-full bg-yellow-300" />
                <div className="w-3 h-3 rounded-full bg-green-300" />
                <div className="flex-1 h-7 rounded-lg bg-slate-50 ml-4 flex items-center px-3">
                  <span className="text-xs text-slate-600 font-mono">
                    meduni.co.uk/dashboard
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                  <div>
                    <div className="text-xs text-slate-600 mb-1">
                      Student profile
                    </div>
                    <div className="font-serif text-lg text-slate-800">
                      Sara Malik
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-sm font-bold text-white">
                    SM
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 text-center">
                    <div className="font-serif text-2xl text-teal-600">08</div>
                    <div className="text-xs text-slate-600 uppercase tracking-wider">
                      Sessions
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 text-center">
                    <div className="font-serif text-2xl text-teal-600">08</div>
                    <div className="text-xs text-slate-600 uppercase tracking-wider">
                      Notes
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 text-center">
                    <div className="font-serif text-2xl text-teal-600">04</div>
                    <div className="text-xs text-slate-600 uppercase tracking-wider">
                      Certificates
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50">
                  <div className="text-xs text-slate-600 mb-3 uppercase tracking-wider">
                    Upcoming webinar
                  </div>
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center">
                      <Video className="w-6 h-6 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-slate-700">
                        Sudden Death Due to Cardiac Causes
                      </div>
                      <div className="text-xs text-slate-600">
                        Next session — see dashboard for details
                      </div>
                    </div>
                    <div className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 text-xs font-medium mt-1 sm:mt-0">
                      Zoom
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
