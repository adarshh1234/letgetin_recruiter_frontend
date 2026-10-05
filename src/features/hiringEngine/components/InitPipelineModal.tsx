"use client";

import React, { useState } from "react";
import { Sparkles, X, Loader2, CheckCircle2, Sliders } from "lucide-react";
import { toast } from "sonner";
import { hiringEngineService } from "../services/hiringEngineService";

interface InitPipelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle?: string;
  onSuccess: () => void;
}

export function InitPipelineModal({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  onSuccess,
}: InitPipelineModalProps) {
  const [shortlistTarget, setShortlistTarget] = useState<number>(5);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobId) return;

    setLoading(true);
    try {
      await hiringEngineService.configurePipeline(jobId, {
        finalShortlistTarget: shortlistTarget,
        stages: [
          {
            stageId: "resume_screening",
            stageName: "Resume Screening",
            stageType: "resume_match",
            order: 1,
            expectedAttendanceRate: 0.9,
            expectedPassRate: 0.5,
            deadlineHours: 48,
            autoAdvanceScoreThreshold: 70,
          },
          {
            stageId: "technical_assessment",
            stageName: "Technical Assessment",
            stageType: "assessment",
            order: 2,
            expectedAttendanceRate: 0.85,
            expectedPassRate: 0.6,
            deadlineHours: 48,
            autoAdvanceScoreThreshold: 75,
          },
          {
            stageId: "ai_interview",
            stageName: "AI Video Interview",
            stageType: "ai_interview",
            order: 3,
            expectedAttendanceRate: 0.8,
            expectedPassRate: 0.5,
            deadlineHours: 48,
            autoAdvanceScoreThreshold: 80,
          },
        ],
      });

      toast.success("Hiring Engine successfully initialized for this position!");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(
        err?.error?.message ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to initialize pipeline"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-border/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary-glow border border-primary/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-ink">Initialize Hiring Engine</h3>
              <p className="text-xs text-ink-soft line-clamp-1">{jobTitle || "Job Requisition"}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-soft hover:text-ink hover:bg-surface-alt transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <p className="text-xs text-ink-soft leading-relaxed">
            The LetGetIn Hiring Engine calculates mathematical stage quotas backwards from your target hires,
            automatically partitions applicants into <strong>primary</strong> and <strong>reserve</strong> pools,
            and handles automated refills when candidates fail or withdraw.
          </p>

          <div className="space-y-2">
            <label className="text-xs font-bold text-ink flex items-center justify-between">
              <span>Final Shortlist Target (Candidates to Hire)</span>
              <span className="text-primary font-extrabold text-sm">{shortlistTarget} candidates</span>
            </label>
            <input
              type="range"
              min="1"
              max="25"
              step="1"
              value={shortlistTarget}
              onChange={(e) => setShortlistTarget(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-ink-soft/70">
              <span>1 candidate</span>
              <span>10 candidates</span>
              <span>25 candidates</span>
            </div>
          </div>

          <div className="space-y-3 rounded-xl bg-surface-alt/70 p-4 border border-border/80">
            <span className="text-xs font-bold text-ink flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-primary" />
              Standard Configured Funnel Stages
            </span>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                <span className="font-semibold text-ink">Stage 1: Resume Screening</span>
                <span className="text-ink-soft">Threshold: 70% match</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                <span className="font-semibold text-ink">Stage 2: Technical Assessment</span>
                <span className="text-ink-soft">Threshold: 75/100</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="font-semibold text-ink">Stage 3: AI Video Interview</span>
                <span className="text-ink-soft">Threshold: 80/100</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-border text-xs font-semibold text-ink hover:bg-surface-alt transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Configuring Pipeline...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Activate Hiring Engine</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
