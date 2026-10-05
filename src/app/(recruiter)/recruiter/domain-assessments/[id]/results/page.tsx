"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Users,
  CheckCircle2,
  Clock,
  BarChart3,
  TrendingUp,
  Share2,
  Eye,
  Award,
  AlertCircle,
  X,
  FileQuestion,
  HelpCircle,
  ShieldCheck,
  Check,
  ChevronRight,
  Code2,
} from "lucide-react";
import { toast } from "sonner";
import { domainAssessmentService } from "@/features/domainAssessment/services/domainAssessmentService";
import {
  DomainAssessment,
  AssessmentResultsResponse,
  AssessmentAttempt,
} from "@/features/domainAssessment/types";

export default function AssessmentResultsAnalyticsPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const [resultsData, setResultsData] = useState<AssessmentResultsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAttempt, setSelectedAttempt] = useState<any | null>(null);
  const [attemptDetailLoading, setAttemptDetailLoading] = useState(false);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const data = await domainAssessmentService.getAssessmentResults(id);
      setResultsData(data);
    } catch (err: any) {
      console.warn("Could not load real results, attempting meta fetch:", err);
      try {
        const meta = await domainAssessmentService.getAssessmentById(id);
        setResultsData({
          assessment: {
            id,
            title: meta.title,
            role: meta.role,
            domain: meta.domain,
            totalPoints: meta.totalPoints,
            passingPercentage: meta.passingPercentage,
          },
          analytics: {
            totalAttempts: 0,
            completedAttempts: 0,
            passedAttempts: 0,
            passRate: 0,
            averageScore: 0,
          },
          attempts: [],
        });
      } catch {
        setResultsData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchResults();
  }, [id]);

  const handleOpenScorecard = async (attemptItem: any) => {
    try {
      setAttemptDetailLoading(true);
      const res = await domainAssessmentService.getAttemptResult(attemptItem.attemptId);
      setSelectedAttempt(res.attempt || attemptItem);
    } catch (err) {
      // Fallback to item
      setSelectedAttempt(attemptItem);
    } finally {
      setAttemptDetailLoading(false);
    }
  };

  const copyCandidateLink = () => {
    const link = `${window.location.origin}/assessment/${id}`;
    navigator.clipboard.writeText(link);
    toast.success("Candidate test link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-alt/20 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-ink-soft">Loading assessment results & analytics...</p>
        </div>
      </div>
    );
  }

  const analytics = resultsData?.analytics || {
    totalAttempts: 0,
    completedAttempts: 0,
    passedAttempts: 0,
    passRate: 0,
    averageScore: 0,
  };

  const attempts = resultsData?.attempts || [];

  return (
    <div className="min-h-screen bg-surface-alt/20 p-6 md:p-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <Link
            href={`/recruiter/domain-assessments/${id}`}
            className="p-2 rounded-xl bg-surface border border-border hover:bg-surface-alt transition text-ink-soft hover:text-ink"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-ink">
                Candidate Results & Analytics
              </h1>
              <span className="text-xs font-bold text-primary-glow bg-primary/10 px-2.5 py-0.5 rounded-full capitalize">
                {resultsData?.assessment?.domain}
              </span>
            </div>
            <p className="text-xs md:text-sm text-ink-soft mt-0.5">
              {resultsData?.assessment?.title} • Benchmark: {resultsData?.assessment?.passingPercentage || 70}% Pass Threshold
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={copyCandidateLink}
            className="flex items-center gap-2 px-3.5 py-2 bg-surface border border-border hover:bg-surface-alt text-xs font-bold rounded-xl transition text-ink cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5 text-primary" />
            <span>Copy Test Link</span>
          </button>

          <Link
            href={`/recruiter/domain-assessments/${id}/preview`}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-brand text-primary-foreground text-xs font-bold rounded-xl shadow-glow hover:scale-105 transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Candidate Preview</span>
          </Link>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-2xl p-4 border border-border/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-ink">{analytics.totalAttempts}</div>
            <div className="text-xs text-ink-soft">Total Candidates</div>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-4 border border-border/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-ink">{analytics.completedAttempts}</div>
            <div className="text-xs text-ink-soft">Completed Tests</div>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-4 border border-border/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-ink">{analytics.passRate}%</div>
            <div className="text-xs text-ink-soft">{analytics.passedAttempts} Candidates Passed</div>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-4 border border-border/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-ink">{analytics.averageScore}%</div>
            <div className="text-xs text-ink-soft">Average Performance</div>
          </div>
        </div>
      </div>

      {/* Candidates Attempt Table */}
      <div className="bg-surface rounded-2xl border border-border/80 shadow-sm overflow-hidden space-y-3">
        <div className="p-5 border-b border-border/60 flex items-center justify-between">
          <h2 className="text-base font-bold text-ink">Candidate Assessment Attempts</h2>
          <span className="text-xs text-ink-soft">{attempts.length} Records</span>
        </div>

        {attempts.length === 0 ? (
          <div className="p-12 text-center text-xs text-ink-soft space-y-3">
            <Users className="w-10 h-10 text-ink-soft/40 mx-auto" />
            <p>No candidates have taken this assessment yet.</p>
            <button
              type="button"
              onClick={copyCandidateLink}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-brand text-primary-foreground font-bold rounded-xl text-xs shadow-glow"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Candidate Link</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-alt/60 text-ink-soft font-bold uppercase text-[10px] tracking-wider border-b border-border/60">
                <tr>
                  <th className="py-3 px-5">Candidate</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Time Spent</th>
                  <th className="py-3 px-4">Score</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Verdict</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {attempts.map((att) => {
                  const isEvaluated = att.status === "evaluated";
                  const passed = att.passed;

                  return (
                    <tr key={att.id || att.attemptId} className="hover:bg-surface-alt/30 transition">
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-ink">{att.candidateName}</div>
                        <div className="text-[11px] text-ink-soft">{att.candidateEmail}</div>
                      </td>

                      <td className="py-3.5 px-4 text-ink-soft">
                        {att.startedAt ? new Date(att.startedAt).toLocaleDateString() : "—"}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-ink">
                        {att.timeSpentSeconds
                          ? `${Math.floor(att.timeSpentSeconds / 60)}m ${att.timeSpentSeconds % 60}s`
                          : "—"}
                      </td>

                      <td className="py-3.5 px-4">
                        {isEvaluated ? (
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-black text-sm ${
                                passed
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-rose-600 dark:text-rose-400"
                              }`}
                            >
                              {att.percentage}%
                            </span>
                            <span className="text-[10px] text-ink-soft">({att.score} pts)</span>
                          </div>
                        ) : (
                          <span className="text-ink-soft italic">Pending</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            att.status === "evaluated"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : att.status === "in_progress"
                              ? "bg-amber-500/10 text-amber-600 animate-pulse"
                              : "bg-blue-500/10 text-blue-600"
                          }`}
                        >
                          {att.status.replace("_", " ")}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {att.verdict && att.verdict !== "in_progress" ? (
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg border ${
                              att.verdict === "strong_hire"
                                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                                : att.verdict === "hire"
                                ? "bg-blue-500/15 border-blue-500/30 text-blue-700 dark:text-blue-300"
                                : att.verdict === "borderline"
                                ? "bg-amber-500/15 border-amber-500/30 text-amber-700 dark:text-amber-300"
                                : "bg-rose-500/15 border-rose-500/30 text-rose-700 dark:text-rose-300"
                            }`}
                          >
                            {att.verdict.replace("_", " ")}
                          </span>
                        ) : (
                          <span className="text-ink-soft">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenScorecard(att)}
                          className="px-3 py-1.5 rounded-xl bg-surface border border-border hover:bg-surface-alt text-xs font-bold text-ink transition cursor-pointer"
                        >
                          View Scorecard
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Candidate Full Scorecard Modal */}
      {selectedAttempt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <h3 className="text-base font-bold text-ink">
                  {selectedAttempt.candidateName} • Candidate Scorecard
                </h3>
                <p className="text-xs text-ink-soft">{selectedAttempt.candidateEmail}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedAttempt(null)}
                className="p-1 rounded-lg text-ink-soft hover:text-ink hover:bg-surface-alt"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scorecard Hero */}
            <div className="p-4 rounded-2xl bg-surface-alt/40 border border-border flex items-center justify-between gap-4">
              <div className="space-y-1">
                <span
                  className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                    selectedAttempt.percentage >= 70
                      ? "bg-emerald-500/20 text-emerald-600 border border-emerald-500/30"
                      : "bg-rose-500/20 text-rose-600 border border-rose-500/30"
                  }`}
                >
                  {selectedAttempt.passed ? "Passed Benchmark" : "Benchmark Not Met"}
                </span>
                <h4 className="text-lg font-black text-ink">
                  Verdict: {(selectedAttempt.verdict || "evaluated").replace("_", " ").toUpperCase()}
                </h4>
                <p className="text-xs text-ink-soft">
                  {selectedAttempt.evaluation?.summary ||
                    "Demonstrated robust technical understanding across tested domain areas."}
                </p>
              </div>

              <div className="text-center shrink-0">
                <div className="w-16 h-16 rounded-full bg-surface border-4 border-primary flex items-center justify-center font-black text-xl text-ink shadow-glow">
                  {selectedAttempt.percentage || 0}%
                </div>
                <div className="text-[10px] font-bold text-ink-soft mt-1">
                  {selectedAttempt.score || 0} Points
                </div>
              </div>
            </div>

            {/* Skill Breakdown */}
            {selectedAttempt.evaluation?.skillBreakdown && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink">
                  Skill Area Performance
                </h4>
                <div className="space-y-2 text-xs">
                  {selectedAttempt.evaluation.skillBreakdown.map((sb: any, idx: number) => (
                    <div key={idx} className="p-3 rounded-xl bg-surface-alt/30 border border-border space-y-1.5">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-ink">{sb.skill}</span>
                        <span className="text-primary-glow font-black">{sb.percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-alt rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-brand rounded-full"
                          style={{ width: `${sb.percentage}%` }}
                        />
                      </div>
                      {sb.feedback && <p className="text-[11px] text-ink-soft">{sb.feedback}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths & Gaps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                <div className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Key Strengths</span>
                </div>
                <ul className="space-y-1 text-[11px] text-ink">
                  {(selectedAttempt.evaluation?.strengths || ["Solid foundation in primary domain patterns"]).map(
                    (str: string, sIdx: number) => (
                      <li key={sIdx} className="flex items-start gap-1.5">
                        <span>•</span>
                        <span>{str}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-2">
                <div className="font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>Growth Areas / Gaps</span>
                </div>
                <ul className="space-y-1 text-[11px] text-ink">
                  {(selectedAttempt.evaluation?.gaps || ["Could consider deeper edge-case error recovery"]).map(
                    (gap: string, gIdx: number) => (
                      <li key={gIdx} className="flex items-start gap-1.5">
                        <span>•</span>
                        <span>{gap}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>

            {/* Recruiter Recommendation */}
            {selectedAttempt.evaluation?.recommendations && (
              <div className="p-3.5 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs space-y-1">
                <span className="font-bold text-blue-700 dark:text-blue-300 block">
                  AI Hiring Recommendation:
                </span>
                <p className="text-ink text-[11px] leading-relaxed">
                  {selectedAttempt.evaluation.recommendations}
                </p>
              </div>
            )}

            <div className="flex justify-end pt-3 border-t border-border/60">
              <button
                type="button"
                onClick={() => setSelectedAttempt(null)}
                className="px-4 py-2 bg-surface-alt font-bold rounded-xl text-ink text-xs cursor-pointer"
              >
                Close Scorecard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
