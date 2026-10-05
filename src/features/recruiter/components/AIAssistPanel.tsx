"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Lightbulb,
  Wand2,
  Check,
  X,
  Bot,
  Zap,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

export interface AIAssistPanelProps {
  step: 1 | 2 | 3 | 4;
  jobTitle?: string;
  onApplySuggestion?: (type: "skills" | "pipeline" | "funnel" | "promotion") => void;
  onDraftWithAi?: () => void;
  isGenerating?: boolean;
}

export function AIAssistPanel({
  step,
  jobTitle = "",
  onApplySuggestion,
  onDraftWithAi,
  isGenerating = false,
}: AIAssistPanelProps) {
  // Suggestion states per step
  const [suggestionState, setSuggestionState] = useState<Record<number, "idle" | "accepted" | "rejected">>({
    1: "idle",
    2: "idle",
    3: "idle",
    4: "idle",
  });

  const currentSuggestionState = suggestionState[step];

  const handleAccept = () => {
    setSuggestionState((prev) => ({ ...prev, [step]: "accepted" }));
    if (step === 1 && onApplySuggestion) onApplySuggestion("skills");
    if (step === 2 && onApplySuggestion) onApplySuggestion("pipeline");
    if (step === 3 && onApplySuggestion) onApplySuggestion("funnel");
    if (step === 4 && onApplySuggestion) onApplySuggestion("promotion");
  };

  const handleReject = () => {
    setSuggestionState((prev) => ({ ...prev, [step]: "rejected" }));
  };

  const handleReset = () => {
    setSuggestionState((prev) => ({ ...prev, [step]: "idle" }));
  };

  return (
    <div className="bg-surface border border-border rounded-2xl shadow-elegant p-5 sm:p-6 space-y-5 lg:sticky lg:top-6">
      {/* Header bar of AI Assist */}
      <div className="flex items-center justify-between border-b border-border pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center text-white shadow-xs">
            <Bot className="w-4.5 h-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-ink">AI Hiring Copilot</h2>
              <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <p className="text-[11px] text-ink-soft">Real-time role & pipeline intelligence</p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-semibold text-ink-soft bg-surface-alt px-2.5 py-1 rounded-lg">
          <span>Step {step} of 4</span>
        </div>
      </div>

      {/* Row 1: AI Help */}
      <div className="rounded-xl border border-border bg-gradient-to-br from-primary/5 via-surface to-surface-alt/30 p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-primary-glow">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink">AI Help</h3>
          </div>
          <span className="text-[10px] font-medium text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full">
            Contextual Guide
          </span>
        </div>

        {step === 1 && (
          <div className="space-y-2">
            <p className="text-xs text-ink-soft leading-relaxed">
              AI parses your job title against market benchmarks. Fill in the title to get auto-generated job descriptions, role responsibilities, and essential skill suggestions.
            </p>
            {onDraftWithAi && (
              <button
                type="button"
                onClick={onDraftWithAi}
                disabled={!jobTitle.trim() || isGenerating}
                className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-primary-glow border border-primary/25 bg-primary/5 hover:bg-primary/10 py-1.5 px-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {isGenerating ? "Generating description..." : "Auto-Draft Description with AI"}
              </button>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-1.5">
            <p className="text-xs text-ink-soft leading-relaxed">
              Configure multi-stage candidate vetting. AI recommends pairing automated <strong>Resume Shortlisting</strong> with an <strong>AI Online Test (MCQ)</strong>, <strong>Screening &amp; Technical Interviews</strong>, and an <strong>AI Assessment (Aptitude &amp; Coding)</strong>.
            </p>
            <div className="flex items-center gap-1 text-[11px] text-primary-glow font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Proctored automated rounds reduce hiring turnaround by 58%.</span>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-1.5">
            <p className="text-xs text-ink-soft leading-relaxed">
              Calibrate candidate intake targets and job promotion. Activating <strong>Standard Job Listing</strong> and <strong>Featured Job Listing</strong> maximizes role discovery across candidate search and talent pool feeds.
            </p>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Featured listings yield 3.2x more qualified applicants within 48h.</span>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-1.5">
            <p className="text-xs text-ink-soft leading-relaxed">
              Review your complete credit breakdown and current subscription plan. Publishing deducts credits only for chosen features — draft savings are always free.
            </p>
            <div className="flex items-center gap-1 text-[11px] text-primary-glow font-medium">
              <Zap className="w-3.5 h-3.5" />
              <span>Transparent credit breakdown with real-time balance tracking.</span>
            </div>
          </div>
        )}
      </div>

      {/* Row 2: Tips */}
      <div className="rounded-xl border border-border bg-surface p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-amber-400/15 flex items-center justify-center text-amber-500">
              <Lightbulb className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink">Recruiter Tips</h3>
          </div>
          <span className="text-[10px] font-medium text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full">
            Best Practices
          </span>
        </div>

        {step === 1 && (
          <ul className="space-y-2 text-xs text-ink-soft">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold shrink-0">•</span>
              <span><strong>Skill density:</strong> 4–6 core required skills yield 42% higher candidate match accuracy than long lists.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold shrink-0">•</span>
              <span><strong>Experience:</strong> Leave minimum experience at 0 for entry-level or fresher accessibility.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold shrink-0">•</span>
              <span><strong>Transparency:</strong> Stating clear salary ranges improves qualified application rates by 2.5x.</span>
            </li>
          </ul>
        )}

        {step === 2 && (
          <ul className="space-y-2 text-xs text-ink-soft">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold shrink-0">•</span>
              <span><strong>AI Online Test:</strong> Standardized MCQ tests filter core knowledge rapidly with zero grading delays.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold shrink-0">•</span>
              <span><strong>Interviews:</strong> Combine a 15-min Screening with a Technical Interview for high signal before offer.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold shrink-0">•</span>
              <span><strong>AI Assessment:</strong> Aptitude &amp; Coding challenges verify practical competence beyond resumes.</span>
            </li>
          </ul>
        )}

        {step === 3 && (
          <ul className="space-y-2 text-xs text-ink-soft">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold shrink-0">•</span>
              <span><strong>Intake buffer:</strong> Set Ideal Intake to 1.5x of your final shortlist to absorb dropouts.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold shrink-0">•</span>
              <span><strong>Job Promotion:</strong> Combining Standard + Featured listings provides top-of-feed placement.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold shrink-0">•</span>
              <span><strong>Auto-Extension:</strong> A 3-day extension prevents closing roles when applicants apply on weekends.</span>
            </li>
          </ul>
        )}

        {step === 4 && (
          <ul className="space-y-2 text-xs text-ink-soft">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold shrink-0">•</span>
              <span><strong>Zero Waste:</strong> Credits are only deducted when you publish; draft jobs cost 0 credits.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold shrink-0">•</span>
              <span><strong>Bulk Savings:</strong> Top-up credit packs provide up to 25% discount per credit.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 font-bold shrink-0">•</span>
              <span><strong>Plan Upgrades:</strong> Growth Pro and Enterprise tiers include generous recurring monthly credits.</span>
            </li>
          </ul>
        )}
      </div>

      {/* Row 3: AI Suggestion with Accept & Reject */}
      <div className="rounded-xl border border-primary/25 bg-primary/5 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-primary/15 flex items-center justify-center text-primary-glow">
              <Wand2 className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink">AI Suggestion</h3>
          </div>
          <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full">
            Recommended
          </span>
        </div>

        {/* Suggestion Content per Step */}
        {currentSuggestionState === "idle" && (
          <div className="space-y-3">
            {step === 1 && (
              <p className="text-xs text-ink leading-relaxed">
                Add <strong>&ldquo;Problem Solving&rdquo;</strong>, <strong>&ldquo;Agile Collaboration&rdquo;</strong>, and <strong>&ldquo;System Design&rdquo;</strong> to preferred skills to attract top-tier candidates.
              </p>
            )}

            {step === 2 && (
              <p className="text-xs text-ink leading-relaxed">
                Enable both <strong>AI Online Test (MCQ)</strong> and <strong>AI Assessment (Aptitude &amp; Coding)</strong> for a complete candidate evaluation.
              </p>
            )}

            {step === 3 && (
              <p className="text-xs text-ink leading-relaxed">
                Set <strong>Minimum Intake: 8</strong> and enable <strong>Featured Job Listing</strong> for maximum applicant velocity.
              </p>
            )}

            {step === 4 && (
              <p className="text-xs text-ink leading-relaxed">
                Review your credit allocation and ensure a healthy credit reserve for ongoing applicant evaluation.
              </p>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleAccept}
                className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-gradient-brand hover:opacity-95 py-2 px-3 rounded-xl shadow-sm transition hover:scale-[1.02] active:scale-95 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                Accept
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-ink-soft bg-surface border border-border hover:text-ink hover:bg-surface-alt py-2 px-3 rounded-xl transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                Reject
              </button>
            </div>
          </div>
        )}

        {currentSuggestionState === "accepted" && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2 animate-fade-in">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
              <span>Suggestion Applied!</span>
            </div>
            <p className="text-[11px] text-ink-soft">
              The recommended parameters have been automatically updated in your form.
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="text-[11px] font-semibold text-primary-glow hover:underline inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset suggestion
            </button>
          </div>
        )}

        {currentSuggestionState === "rejected" && (
          <div className="p-3 rounded-xl bg-surface border border-border text-center space-y-1.5 animate-fade-in">
            <p className="text-xs text-ink-soft">Suggestion dismissed for this step.</p>
            <button
              type="button"
              onClick={handleReset}
              className="text-[11px] font-semibold text-primary-glow hover:underline inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reconsider suggestion
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
