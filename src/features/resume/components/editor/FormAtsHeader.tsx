"use client";

import React from "react";
import { useAtsAnalysis } from "../../hooks/useAtsAnalysis";
import { useResumeStore } from "../../store/useResumeStore";
import {
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export const FormAtsHeader: React.FC = () => {
  const { isAnalyzing, result, hasAnalyzed, isStale, runAtsAnalysis } =
    useAtsAnalysis();
  const { resume } = useResumeStore();

  // If analyzed, use result score; otherwise fallback to resume's stored atsScore or 0
  const score = result?.overallScore ?? resume.atsScore ?? 0;

  const handleAnalyzeClick = async () => {
    await runAtsAnalysis();
  };

  const getScoreColorBadge = (s: number) => {
    if (s === 0) return "text-slate-500 bg-slate-100 border-slate-200";
    if (s >= 80) return "text-emerald-700 bg-emerald-100 border-emerald-300";
    if (s >= 65) return "text-sky-700 bg-sky-100 border-sky-300";
    if (s >= 40) return "text-amber-700 bg-amber-100 border-amber-300";
    return "text-rose-700 bg-rose-100 border-rose-300";
  };

  const getScoreProgressColor = (s: number) => {
    if (s === 0) return "bg-slate-300";
    if (s >= 80) return "bg-emerald-500";
    if (s >= 65) return "bg-sky-500";
    if (s >= 40) return "bg-amber-500";
    return "bg-rose-500";
  };

  const getScoreStatusLabel = (s: number, analyzed: boolean) => {
    if (!analyzed && s === 0) return "Click 'Analyze resume' to score";
    if (s === 0) return "Empty resume (0/100)";
    if (s >= 85) return "Excellent ATS Match";
    if (s >= 70) return "Good ATS Score";
    if (s >= 50) return "Fair — Needs Optimization";
    return "Low ATS Match — Action Needed";
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm mb-4 space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Sparkles className="w-4 h-4 text-primary-glow" />
        <span className="text-xs font-bold text-ink">Resume Analysis</span>
      </div>

      <div className="bg-sky-50/50 border border-sky-100 rounded-2xl p-4 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-brand flex items-center justify-center text-white shadow-sm shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    ATS Resume Intelligence
                  </h3>
                  {isStale && hasAnalyzed && (
                    <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                      Edits made • Ready to re-analyze
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Analyze your current resume data to get an instant ATS score,
                  prioritized fixes, and keyword gaps.
                </p>
              </div>
            </div>

            <button
              onClick={handleAnalyzeClick}
              disabled={isAnalyzing}
              className="px-4 py-2.5 bg-gradient-brand hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-60 cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isAnalyzing ? "animate-spin" : ""}`}
              />
              <span>
                {isAnalyzing
                  ? "Analyzing..."
                  : hasAnalyzed
                    ? "Re-analyze resume"
                    : "Analyze resume"}
              </span>
            </button>
          </div>

          {/* Live ATS Score Metric Bar */}
          <div className="pt-2.5 border-t border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-600" />
              <span className="font-semibold text-slate-700">
                ATS Match Score:
              </span>
              <span
                className={`font-extrabold px-2.5 py-0.5 rounded-full border text-xs ${getScoreColorBadge(
                  score,
                )}`}
              >
                {score}%
              </span>
              <span className="text-[11px] text-slate-500 hidden sm:inline">
                • {getScoreStatusLabel(score, hasAnalyzed || score > 0)}
              </span>
            </div>
            <div className="w-full sm:w-1/3 bg-slate-200 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${getScoreProgressColor(
                  score,
                )}`}
                style={{ width: `${Math.max(score > 0 ? 6 : 0, score)}%` }}
              />
            </div>
          </div>
        </div>
    </div>
  );
};
