"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  UserX,
  FileText,
  Brain,
  Sparkles,
  Loader2,
  ShieldCheck,
  Copy,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import {
  HiringEngineCandidate,
  ICandidateStageHistory,
  PopulatedUser,
  PopulatedResume,
} from "../types/hiringEngine.types";
import { hiringEngineService } from "../services/hiringEngineService";

interface CandidateDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  candidate: HiringEngineCandidate | null;
  onAdvanceClick?: (candidate: HiringEngineCandidate) => void;
  onFailClick?: (candidate: HiringEngineCandidate) => void;
}

export function CandidateDetailDrawer({
  isOpen,
  onClose,
  jobId,
  candidate,
  onAdvanceClick,
  onFailClick,
}: CandidateDetailDrawerProps) {
  const [history, setHistory] = useState<ICandidateStageHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (!isOpen || !candidate || !jobId) return;

    setLoadingHistory(true);
    hiringEngineService
      .getCandidateHistory(jobId, candidate._id)
      .then((res) => setHistory(res || []))
      .catch((err) => {
        console.error("Failed to load candidate stage history:", err);
        setHistory([]);
      })
      .finally(() => setLoadingHistory(false));
  }, [isOpen, candidate, jobId]);

  if (!isOpen || !candidate) return null;

  const user = typeof candidate.userId === "object" ? (candidate.userId as PopulatedUser) : null;
  const resume = typeof candidate.resumeId === "object" ? (candidate.resumeId as PopulatedResume) : null;

  const candidateName = user?.fullName || user?.username || "Candidate";
  const candidateEmail = user?.email || "No email available";
  const candidatePhone = user?.phone;

  const isDisqualified =
    candidate.stageStatus === "failed" ||
    candidate.stageStatus === "no_show" ||
    candidate.poolType === "disqualified";

  const isFinalShortlisted = candidate.status === "shortlisted" || candidate.stageStatus === "passed";

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-surface border-l border-border h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-border/80 flex items-center justify-between bg-surface-alt/40">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-lg border border-primary/20 shadow-xs">
              {(candidateName?.[0] || "C").toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-ink">{candidateName}</h2>
                {candidate.poolType ? (
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                      candidate.poolType === "primary"
                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                        : candidate.poolType === "reserve"
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        : "bg-rose-500/10 text-rose-600 border-rose-500/20"
                    }`}
                  >
                    {String(candidate.poolType).toUpperCase()} POOL
                  </span>
                ) : (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full border bg-surface-alt text-ink-soft border-border">
                    CANDIDATE
                  </span>
                )}
              </div>
              <p className="text-xs text-ink-soft mt-0.5">{candidateEmail}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Metric Badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-surface-alt/60 border border-border/70 text-center">
              <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">Match Score</span>
              <span className="text-lg font-extrabold text-primary-glow mt-0.5 block">
                {candidate.matchScore !== undefined ? `${Math.round(candidate.matchScore)}%` : "—"}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-alt/60 border border-border/70 text-center">
              <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">Assessment</span>
              <span className="text-lg font-extrabold text-ink mt-0.5 block">
                {candidate.assessmentScore !== undefined ? `${candidate.assessmentScore}/100` : "—"}
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-surface-alt/60 border border-border/70 text-center">
              <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">AI Interview</span>
              <span className="text-lg font-extrabold text-ink mt-0.5 block">
                {candidate.aiScore !== undefined ? `${candidate.aiScore}/100` : "—"}
              </span>
            </div>
          </div>

          {/* Current Status Overview */}
          <div className="p-4 rounded-xl bg-surface-alt/40 border border-border/70 space-y-3">
            <h4 className="text-xs font-extrabold text-ink uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Current Stage Status
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-ink-soft block text-[11px]">Current Stage</span>
                <span className="font-bold text-ink capitalize">
                  {candidate.currentStageId ? candidate.currentStageId.replace(/_/g, " ") : "Initial Intake"}
                </span>
              </div>
              <div>
                <span className="text-ink-soft block text-[11px]">Stage Status</span>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    candidate.stageStatus === "passed"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : candidate.stageStatus === "failed"
                      ? "bg-rose-500/10 text-rose-600"
                      : candidate.stageStatus === "no_show"
                      ? "bg-amber-500/10 text-amber-600"
                      : "bg-blue-500/10 text-blue-600"
                  }`}
                >
                  {candidate.stageStatus || "invited"}
                </span>
              </div>
              {candidate.stageDeadline && (
                <div className="col-span-2 pt-1 border-t border-border/50 flex items-center justify-between">
                  <span className="text-ink-soft text-[11px] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Stage Deadline:
                  </span>
                  <span className="font-semibold text-ink text-[11px]">
                    {new Date(candidate.stageDeadline).toLocaleString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}

              {/* Assessment link quick actions */}
              <div className="col-span-2 pt-2 border-t border-border/50 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const origin = typeof window !== "undefined" ? window.location.origin : "";
                    const testUrl = `${origin}/assessment/take?applicationId=${candidate._id}&stageId=${encodeURIComponent(candidate.currentStageId || 'stage_general_aptitude')}&jobId=${encodeURIComponent(jobId)}`;
                    navigator.clipboard.writeText(testUrl);
                    toast.success("Candidate assessment test link copied to clipboard!");
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface border border-border hover:bg-surface-alt text-ink text-[11px] font-semibold transition cursor-pointer shadow-2xs"
                >
                  <Copy className="w-3 h-3 text-ink-soft" />
                  <span>Copy Test Link</span>
                </button>
                <a
                  href={`/assessment/take?applicationId=${candidate._id}&stageId=${encodeURIComponent(candidate.currentStageId || 'stage_general_aptitude')}&jobId=${encodeURIComponent(jobId)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline font-semibold"
                >
                  <span>Preview Test Room</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-2 text-xs">
            <h4 className="text-xs font-extrabold text-ink uppercase tracking-wider">Candidate Details</h4>
            <div className="p-3.5 rounded-xl border border-border/70 space-y-2 bg-surface">
              <div className="flex items-center gap-2 text-ink-soft">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span className="text-ink font-medium">{candidateEmail}</span>
              </div>
              {candidatePhone && (
                <div className="flex items-center gap-2 text-ink-soft">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span className="text-ink font-medium">{candidatePhone}</span>
                </div>
              )}
              {resume?.title && (
                <div className="flex items-center gap-2 text-ink-soft">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span className="text-ink font-medium">{resume.title}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-ink-soft">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                <span>Applied: {new Date(candidate.appliedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Immutable Journey Timeline */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-ink uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                Immutable Stage Journey ({history.length} events)
              </h4>
              {loadingHistory && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
            </div>

            {loadingHistory ? (
              <div className="p-8 text-center text-xs text-ink-soft">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-primary" />
                Loading audit trail...
              </div>
            ) : history.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-border text-center text-xs text-ink-soft">
                No stage history transitions recorded yet for this candidate.
              </div>
            ) : (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                {history.map((item, idx) => {
                  const isPass = item.status === "passed";
                  const isFail = item.status === "failed";
                  const isNoShow = item.status === "no_show";

                  return (
                    <div key={item._id || idx} className="relative group">
                      {/* Timeline Dot */}
                      <div
                        className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-surface ${
                          isPass
                            ? "border-emerald-500 text-emerald-600"
                            : isFail
                            ? "border-rose-500 text-rose-600"
                            : isNoShow
                            ? "border-amber-500 text-amber-600"
                            : "border-blue-500 text-blue-600"
                        }`}
                      >
                        {isPass ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : isFail ? (
                          <XCircle className="w-3 h-3" />
                        ) : isNoShow ? (
                          <AlertTriangle className="w-3 h-3" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-3.5 rounded-xl border border-border/80 bg-surface-alt/40 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-ink">
                            Stage {item.stageIndex}: {item.stageName}
                          </span>
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.2 rounded-full ${
                              isPass
                                ? "bg-emerald-500/10 text-emerald-600"
                                : isFail
                                ? "bg-rose-500/10 text-rose-600"
                                : isNoShow
                                ? "bg-amber-500/10 text-amber-600"
                                : "bg-blue-500/10 text-blue-600"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>

                        {item.score !== undefined && (
                          <div className="text-[11px] text-ink-soft">
                            Score: <strong className="text-ink">{item.score}/100</strong>
                          </div>
                        )}

                        {item.notes && (
                          <p className="text-[11px] text-ink-soft leading-relaxed italic">
                            &ldquo;{item.notes}&rdquo;
                          </p>
                        )}

                        <div className="flex items-center justify-between text-[10px] text-ink-soft/70 pt-1 border-t border-border/40">
                          <span>
                            Entered: {new Date(item.enteredAt).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {item.completedAt && (
                            <span>
                              Completed: {new Date(item.completedAt).toLocaleTimeString(undefined, {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-border bg-surface flex items-center justify-between gap-3">
          <div className="text-xs text-ink-soft">
            {isFinalShortlisted ? (
              <span className="font-bold text-purple-600 flex items-center gap-1">
                <Award className="w-4 h-4" /> Candidate is Final Shortlisted!
              </span>
            ) : isDisqualified ? (
              <span className="text-rose-600 font-semibold">Candidate Disqualified</span>
            ) : (
              <span>Recruiter Manual Controls</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {!isDisqualified && onFailClick && (
              <button
                type="button"
                onClick={() => onFailClick(candidate)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-500/30 text-rose-600 hover:bg-rose-500/10 text-xs font-semibold transition"
              >
                <UserX className="w-3.5 h-3.5" />
                <span>Fail Candidate</span>
              </button>
            )}

            {!isDisqualified && !isFinalShortlisted && onAdvanceClick && (
              <button
                type="button"
                onClick={() => onAdvanceClick(candidate)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold shadow-xs transition"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Advance Stage</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
