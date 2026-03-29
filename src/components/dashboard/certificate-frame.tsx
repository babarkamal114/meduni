import { Award } from 'lucide-react';
import type { CertificateData } from '@/lib/data/learning';
import { format } from 'date-fns';

function CornerFlourish({ className = 'h-16 w-16 sm:h-20 sm:w-20 text-teal-300' }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M0 40 Q20 20 40 40 T80 40 M0 50 Q25 30 50 50 T80 50 M0 60 Q30 40 60 60" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M40 0 Q20 20 40 40 T40 80 M50 0 Q30 25 50 50 T50 80 M60 0 Q40 30 60 60" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

function CornerFlourishTR() {
  return (
    <svg viewBox="0 0 80 80" className="h-16 w-16 sm:h-20 sm:w-20 text-teal-300" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M80 40 Q60 20 40 40 T0 40 M80 50 Q55 30 30 50 T0 50 M80 60 Q50 40 20 60" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M40 80 Q20 60 40 40 T40 0 M50 80 Q30 55 50 30 T50 0 M60 80 Q40 50 60 20" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

function CornerFlourishBR() {
  return (
    <svg viewBox="0 0 80 80" className="h-16 w-16 sm:h-20 sm:w-20 text-teal-300 rotate-[270deg]" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M80 40 Q60 20 40 40 T0 40 M80 50 Q55 30 30 50 T0 50 M80 60 Q50 40 20 60" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M40 80 Q20 60 40 40 T40 0 M50 80 Q30 55 50 30 T50 0 M60 80 Q40 50 60 20" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
    </svg>
  );
}

const CERTIFICATE_ASPECT = 841.89 / 595.28;

export interface CertificateFrameProps {
  data: CertificateData;
  verifyUrl: string;
  siteName: string;
  className?: string;
}

export function CertificateFrame({ data, verifyUrl, siteName, className }: CertificateFrameProps): React.ReactElement {
  const dateFormatted = format(new Date(data.certifiedAt), 'd MMMM yyyy');

  return (
    <div
      className={`w-full mx-auto bg-white print:shadow-none relative overflow-hidden ${className ?? ''}`}
      style={{ aspectRatio: CERTIFICATE_ASPECT, maxHeight: 'calc(100vh - 8rem)' }}
    >
      <div className="absolute inset-0 border-[3px] border-teal-500 print:border-teal-600">
        <div className="absolute inset-3 sm:inset-4 border-2 border-teal-200 print:border-teal-300 flex flex-col">
          <div className="absolute top-2 left-2 opacity-80">
            <CornerFlourish />
          </div>
          <div className="absolute top-2 right-2 opacity-80">
            <CornerFlourishTR />
          </div>
          <div className="absolute bottom-2 left-2 opacity-80 rotate-180">
            <CornerFlourish />
          </div>
          <div className="absolute bottom-2 right-2 opacity-80">
            <CornerFlourishBR />
          </div>

          <div className="flex-1 flex flex-col justify-center items-center text-center px-6 sm:px-12 md:px-20 py-8">
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-slate-900 font-bold tracking-tight mb-1">
              CERTIFICATE
            </h1>
            <p className="text-sm sm:text-base md:text-lg font-serif text-teal-600 uppercase tracking-[0.2em] mb-8">
              of completion
            </p>

            <p className="text-xs sm:text-sm text-slate-500 uppercase tracking-widest mb-6">
              The following award is given to
            </p>

            <p className="font-serif text-xl sm:text-2xl md:text-3xl text-slate-900 font-medium mb-2">
              {data.userName}
            </p>
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="w-4 h-4 rounded-full border-2 border-teal-500 shrink-0" aria-hidden />
              <span className="h-0.5 w-24 sm:w-32 bg-teal-500" aria-hidden />
              <span className="h-0.5 flex-1 max-w-[120px] sm:max-w-[180px] bg-teal-500" aria-hidden />
              <span className="h-0.5 w-24 sm:w-32 bg-teal-500" aria-hidden />
              <span className="w-4 h-4 rounded-full border-2 border-teal-500 shrink-0" aria-hidden />
            </div>

            <p className="text-sm text-slate-600 max-w-xl mb-4">
              This certificate is presented in recognition of successful completion of the module{' '}
              <span className="font-serif font-medium text-teal-700">{data.moduleTitle}</span> and demonstrated competence in the subject matter.
            </p>

            <p className="text-xs text-slate-500 mb-10">
              Completed on {dateFormatted}
            </p>

            <div className="flex items-end justify-center gap-8 sm:gap-16">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-teal-600 uppercase tracking-wider mb-1">Authorised by</span>
                <span className="w-28 sm:w-36 h-0.5 bg-teal-400" aria-hidden />
              </div>
              <div className="flex flex-col items-center justify-end">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-teal-500 flex items-center justify-center bg-teal-50/80 mb-2 print:bg-teal-50">
                  <Award className="w-7 h-7 sm:w-8 sm:h-8 text-teal-600" strokeWidth={1.5} aria-hidden />
                </div>
                <span className="text-[10px] text-teal-600 font-medium">{siteName}</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-teal-600 uppercase tracking-wider mb-1">Date</span>
                <span className="w-28 sm:w-36 h-0.5 bg-teal-400" aria-hidden />
              </div>
            </div>

            <p className="text-[10px] text-slate-400 mt-8">
              Verify at {verifyUrl}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
