'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCaseStudyById } from '@/lib/mock/learning';

export default function CaseStudyPage(): React.ReactElement {
  const params = useParams();
  const id = params.id as string;
  const caseStudy = useMemo(() => getCaseStudyById(id), [id]);

  const [currentStepId, setCurrentStepId] = useState<string | null>(
    caseStudy?.steps[0]?.id ?? null
  );

  const currentStep = useMemo(() => {
    if (!caseStudy || !currentStepId) return null;
    return caseStudy.steps.find((s) => s.id === currentStepId) ?? null;
  }, [caseStudy, currentStepId]);

  const isOutcome = currentStepId === 'outcome';
  const outcome = caseStudy?.outcome;

  const handleChoice = useCallback(
    (nextStepId: string) => {
      setCurrentStepId(nextStepId);
    },
    []
  );

  const handleRestart = useCallback(() => {
    setCurrentStepId(caseStudy?.steps[0]?.id ?? null);
  }, [caseStudy?.steps]);

  if (!caseStudy) {
    return (
      <div className="px-6 lg:px-8 py-8 max-w-[800px]">
        <Link
          href="/dashboard/learning"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600 mb-6"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Back to My Learning
        </Link>
        <p className="text-slate-600">Case study not found.</p>
      </div>
    );
  }

  const stepIndex = caseStudy.steps.findIndex((s) => s.id === currentStepId);
  const totalSteps = caseStudy.steps.filter((s) => s.choices.length > 0).length;

  return (
    <div className="px-6 lg:px-8 py-8 max-w-[800px]">
      <div className="flex items-center justify-between gap-4 mb-8">
        <Link
          href="/dashboard/learning"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-teal-600"
        >
          <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
          Back to My Learning
        </Link>
        {!isOutcome && stepIndex >= 0 && (
          <span className="text-xs font-mono text-slate-500">
            Step {Math.min(stepIndex + 1, totalSteps)} of {totalSteps}
          </span>
        )}
      </div>

      {isOutcome && outcome ? (
        <div className="rounded-2xl border border-teal-100 bg-teal-50/50 p-6">
          <h2 className="font-serif text-xl text-teal-800 mb-3">{outcome.title}</h2>
          <p className="text-slate-700 text-sm leading-relaxed mb-6">
            {outcome.body}
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="sm">
              <Link href="/dashboard/learning">Back to My Learning</Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRestart}
              className="inline-flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
              Restart case
            </Button>
          </div>
        </div>
      ) : currentStep ? (
        <>
          <h1 className="font-serif text-2xl text-slate-900 mb-2">
            {caseStudy.title}
          </h1>
          <p className="text-slate-600 text-sm mb-6">{caseStudy.description}</p>
          <div className="rounded-2xl border border-black/5 bg-white p-6">
            <h2 className="font-serif text-lg text-slate-800 mb-4">
              {currentStep.title}
            </h2>
            <p className="text-slate-700 text-sm leading-relaxed mb-6">
              {currentStep.narrative}
            </p>
            <div className="space-y-3">
              {currentStep.choices.map((choice) => (
                <Button
                  key={choice.id}
                  variant="secondary"
                  className="w-full justify-start text-left h-auto py-3 px-4"
                  onClick={() => handleChoice(choice.nextStepId)}
                >
                  {choice.label}
                </Button>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
