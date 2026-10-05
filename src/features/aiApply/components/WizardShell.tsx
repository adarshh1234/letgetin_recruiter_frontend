'use client';

import React, { useEffect } from 'react';
import { ArrowLeft, ArrowRight, Loader2, PartyPopper } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useAiApplyStore } from '../store/useAiApplyStore';
import { STEPS, TOTAL_STEPS } from '../config/steps.config';
import { IntroScreen } from './IntroScreen';
import { Step1CurrentStatus } from './Step1CurrentStatus';
import { Step2DesiredJobTitle } from './Step2DesiredJobTitle';
import { Step3ResumeCoverLetter } from './Step3ResumeCoverLetter';
import { Step4YourPriorities } from './Step4YourPriorities';
import { Step5PersonalPriorities } from './Step5PersonalPriorities';
import { Step6CommunicationPreference } from './Step6CommunicationPreference';
import { Step7MatchedJobsReview } from './Step7MatchedJobsReview';
import { BatchApplyingHUD } from './BatchApplyingHUD';

const STEP_COMPONENTS = [
  Step1CurrentStatus,
  Step2DesiredJobTitle,
  Step3ResumeCoverLetter,
  Step4YourPriorities,
  Step5PersonalPriorities,
  Step6CommunicationPreference,
  Step7MatchedJobsReview,
];

export function WizardShell() {
  const currentStep = useAiApplyStore((s) => s.currentStep);
  const preferences = useAiApplyStore((s) => s.preferences);
  const hydrate = useAiApplyStore((s) => s.hydrate);
  const hydrated = useAiApplyStore((s) => s.hydrated);
  const isHydrating = useAiApplyStore((s) => s.isHydrating);
  const isSaving = useAiApplyStore((s) => s.isSaving);
  const activeBatchSession = useAiApplyStore((s) => s.activeBatchSession);
  const applyResult = useAiApplyStore((s) => s.applyResult);
  const error = useAiApplyStore((s) => s.error);
  const nextStep = useAiApplyStore((s) => s.nextStep);
  const prevStep = useAiApplyStore((s) => s.prevStep);

  useEffect(() => {
    if (!hydrated && !isHydrating) {
      hydrate();
    }
  }, [hydrated, isHydrating, hydrate]);

  if (!hydrated) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <Loader2 className="w-8 h-8 text-primary-glow animate-spin" />
        <p className="text-sm font-medium text-ink-soft">Loading your profile and matching models...</p>
      </div>
    );
  }

  // If there's an active BullMQ batch session running or completed
  if (activeBatchSession) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <BatchApplyingHUD />
      </div>
    );
  }

  if (applyResult) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-6 space-y-5 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
          <PartyPopper className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-ink">AI Apply is activated!</h2>
          <p className="text-sm text-ink-soft">
            {applyResult.appliedCount > 0
              ? `We applied to ${applyResult.appliedCount} matching job${applyResult.appliedCount === 1 ? '' : 's'} on your behalf.`
              : 'No matching jobs were found right now. We will keep applying as new matches appear.'}
          </p>
        </div>
        {applyResult.jobs.length > 0 && (
          <div className="w-full space-y-1.5 text-left">
            {applyResult.jobs.slice(0, 8).map((job) => (
              <div key={job.jobId} className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-surface border border-border text-xs">
                <span className="font-semibold text-ink truncate">{job.title}{job.company ? ` · ${job.company}` : ''}</span>
                <span className="text-primary font-bold shrink-0">{job.matchScore}% match</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (currentStep === 0) {
    return <IntroScreen />;
  }

  const stepIndex = currentStep - 1;
  const StepComponent = STEP_COMPONENTS[stepIndex];
  const stepDef = STEPS[stepIndex];
  const isLastStep = currentStep === TOTAL_STEPS;
  const isValid = stepDef ? stepDef.isValid(preferences) : true;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-bold text-ink-soft">
          <span>
            Step {currentStep} of {TOTAL_STEPS}
          </span>
          <span>{stepDef?.title}</span>
        </div>
        <Progress value={(currentStep / TOTAL_STEPS) * 100} />
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs">{error}</div>
      )}

      {/* Active step */}
      <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-xs">
        {StepComponent && <StepComponent />}
      </div>

      {/* Footer Navigation (only for steps 1-6; Step 7 has its own dedicated permission & launch CTA) */}
      {!isLastStep && (
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => prevStep()}
            disabled={currentStep === 1}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-soft hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed px-3 py-2 rounded-xl transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={() => nextStep()}
            disabled={!isValid || isSaving}
            className="inline-flex items-center gap-2 bg-gradient-brand text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Continue</span>}
            {!isSaving && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      )}

      {isLastStep && (
        <div className="flex items-center justify-start gap-3">
          <button
            type="button"
            onClick={() => prevStep()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-soft hover:text-ink px-3 py-2 rounded-xl transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Preferences</span>
          </button>
        </div>
      )}
    </div>
  );
}
