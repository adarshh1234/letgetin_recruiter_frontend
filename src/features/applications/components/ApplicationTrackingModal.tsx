'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  X,
  Briefcase,
  Building2,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ChevronRight,
  FileText,
  Loader2,
  ArrowUpRight,
  ShieldCheck,
  Check,
  Video,
  Code,
  Users,
  Award,
  HelpCircle,
} from 'lucide-react';
import { ApplicationItem, CandidateTrackingResponse, CandidateFunnelStage } from '../types';
import { applicationService } from '../services/applicationService';
import { resolveCandidateStatus } from '../utils/candidateStatusResolver';

interface ApplicationTrackingModalProps {
  application: ApplicationItem;
  onClose: () => void;
}

export function ApplicationTrackingModal({ application, onClose }: ApplicationTrackingModalProps) {
  const [trackingData, setTrackingData] = useState<CandidateTrackingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadTracking() {
      setLoading(true);
      setError(null);
      try {
        const data = await applicationService.getApplicationTracking(application._id);
        if (isMounted) {
          setTrackingData(data);
        }
      } catch (err: any) {
        console.error('Failed to load application tracking:', err);
        if (isMounted) {
          setError(err?.response?.data?.message || err?.message || 'Failed to load tracking details');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadTracking();
    return () => {
      isMounted = false;
    };
  }, [application._id]);

  const app = trackingData?.application || application;
  const stages = trackingData?.funnelStages || [];
  const history = trackingData?.stageHistory || [];
  const candidateStatus = resolveCandidateStatus(app, stages);

  const getStageIcon = (type: string) => {
    switch (type) {
      case 'assessment':
        return Code;
      case 'ai_interview':
        return Sparkles;
      case 'human_interview':
        return Video;
      case 'manual_review':
        return Users;
      default:
        return Briefcase;
    }
  };

  const formatDeadlineRemaining = (deadlineDate?: string | null) => {
    if (!deadlineDate) return null;
    const diffMs = new Date(deadlineDate).getTime() - Date.now();
    if (diffMs <= 0) return 'Window closed';
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) {
      return `${days}d ${hours % 24}h remaining`;
    }
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m remaining`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div
        className="relative w-full max-w-3xl bg-surface border border-border rounded-3xl shadow-2xl my-8 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex items-start justify-between gap-4 shrink-0 bg-surface">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border shadow-2xs ${candidateStatus.badgeClass}`}>
                {candidateStatus.label}
              </span>
              {app.source === 'ai_apply' && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI Apply
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight">
              {app.job?.title || 'Job Application'}
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-soft">
              <span className="flex items-center gap-1 font-semibold text-ink">
                <Building2 className="w-3.5 h-3.5 text-ink-soft" />
                {app.job?.company?.name || 'Company'}
              </span>
              {app.job?.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {app.job.location.city ? `${app.job.location.city}, ` : ''}{app.job.location.country || 'Remote'}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Applied {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Status Explanation Banner */}
          <div className="p-4 rounded-2xl bg-surface-alt/60 border border-border/80 flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-ink">{candidateStatus.label}</h4>
              <p className="text-xs text-ink-soft leading-relaxed">{candidateStatus.description}</p>
            </div>
          </div>

          {loading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
              <p className="text-xs font-medium text-ink-soft">Loading dynamic timeline...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-xs space-y-2">
              <div className="flex items-center gap-2 font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>Could not load detailed tracking</span>
              </div>
              <p>{error}</p>
            </div>
          ) : (
            <>
              {/* Dynamic Job-Configured Funnel Stages */}
              {stages.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-ink tracking-tight flex items-center gap-2">
                      <span>Dynamic Hiring Stages</span>
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-surface-alt text-ink-soft border border-border">
                        {stages.length} {stages.length === 1 ? 'Stage' : 'Stages'} Total
                      </span>
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {stages.map((stg, index) => {
                      const StageIcon = getStageIcon(stg.stageType);
                      const currentIdx = typeof app.currentStageIndex === 'number' ? app.currentStageIndex : -1;
                      const isPast = currentIdx > index || app.finalShortlistDecision === 'offered' || app.finalShortlistDecision === 'hired';
                      const isCurrent = currentIdx === index;
                      const isFuture = currentIdx < index && !isPast;

                      // Check stage history entry
                      const histEntry = history.find((h) => h.stageId === stg.stageId || h.stageIndex === index);
                      const stageStatusLabel =
                        isPast
                          ? 'Completed'
                          : isCurrent
                          ? app.stageStatus === 'invited'
                            ? 'Action Required'
                            : app.stageStatus === 'started'
                            ? 'In Progress'
                            : app.stageStatus === 'no_show'
                            ? 'Window Expired'
                            : app.stageStatus === 'failed'
                            ? 'Not Selected'
                            : 'Active'
                          : 'Upcoming';

                      const remainingTime = isCurrent && app.stageDeadline ? formatDeadlineRemaining(app.stageDeadline) : null;

                      return (
                        <div
                          key={stg.stageId || index}
                          className={`p-4 rounded-2xl border transition-all ${
                            isCurrent
                              ? 'bg-primary/5 border-primary/30 shadow-xs'
                              : isPast
                              ? 'bg-surface border-emerald-500/20'
                              : 'bg-surface-alt/30 border-border opacity-70'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3 min-w-0">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                  isPast
                                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                    : isCurrent
                                    ? 'bg-primary text-white shadow-xs'
                                    : 'bg-surface-alt text-ink-soft border border-border'
                                }`}
                              >
                                {isPast ? (
                                  <Check className="w-5 h-5 stroke-[2.5]" />
                                ) : (
                                  <StageIcon className="w-5 h-5" />
                                )}
                              </div>

                              <div className="space-y-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">
                                    Stage {stg.order || index + 1}
                                  </span>
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                      isPast
                                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                        : isCurrent
                                        ? app.stageStatus === 'invited'
                                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse'
                                          : 'bg-primary/10 text-primary border-primary/20'
                                        : 'bg-surface-alt text-ink-soft border-border'
                                    }`}
                                  >
                                    {stageStatusLabel}
                                  </span>
                                </div>

                                <h4 className="text-sm font-bold text-ink truncate">{stg.stageName}</h4>

                                {histEntry?.completedAt && (
                                  <p className="text-[11px] text-ink-soft">
                                    Completed on {new Date(histEntry.completedAt).toLocaleString()}
                                  </p>
                                )}

                                {remainingTime && (
                                  <p className="text-xs font-medium text-amber-400 flex items-center gap-1 pt-0.5">
                                    <Clock className="w-3.5 h-3.5" />
                                    <span>Deadline: {remainingTime}</span>
                                  </p>
                                )}
                              </div>
                            </div>

                            {/* Action Button for Active Stage */}
                            {isCurrent && app.stageStatus === 'invited' && (
                              <div className="shrink-0 self-center">
                                {stg.stageType === 'ai_interview' ? (
                                  <Link
                                    href={`/interviews/ai-practice?role=${encodeURIComponent(app.job?.title || '')}`}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                                  >
                                    <span>Join Interview</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                  </Link>
                                ) : stg.stageType === 'assessment' || stg.stageType === 'custom' ? (
                                  <Link
                                    href={`/assessment/take?applicationId=${app._id}&stageId=${encodeURIComponent(stg.stageId)}&jobId=${encodeURIComponent(app.job?._id || '')}`}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-brand hover:opacity-95 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                                  >
                                    <span>Take Assessment</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                  </Link>
                                ) : (
                                  <Link
                                    href={`/assessment/take?applicationId=${app._id}&stageId=${encodeURIComponent(stg.stageId)}&jobId=${encodeURIComponent(app.job?._id || '')}`}
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                                  >
                                    <span>Begin Stage</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                  </Link>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Standby Notice (If in Reserve Pool) */}
              {app.poolType === 'reserve' && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                    <Clock className="w-4 h-4" />
                    <span>Application on Standby (Reserve Pool)</span>
                  </div>
                  <p className="text-xs text-amber-200/80 leading-relaxed">
                    Your profile met qualifications and has been placed on active standby. In our adaptive hiring process,
                    candidates from reserve are invited automatically whenever interview capacity expands. No action is required
                    from you right now.
                  </p>
                </div>
              )}

              {/* Formal Offer Banner */}
              {(app.finalShortlistDecision === 'offered' || app.finalShortlistDecision === 'hired') && (
                <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center gap-2.5 text-emerald-400 font-black text-sm">
                    <Award className="w-5 h-5" />
                    <span>
                      {app.finalShortlistDecision === 'hired'
                        ? 'Candidate Offer Accepted & Confirmed'
                        : 'Official Employment Offer Extended!'}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-200/90 leading-relaxed">
                    {app.finalShortlistDecision === 'hired'
                      ? 'You have been officially confirmed for this role. Your recruiter will contact you regarding onboarding materials.'
                      : 'The employer has formally selected you for hire! Review your offer details and follow up with the hiring manager.'}
                  </p>
                  {app.offeredAt && (
                    <p className="text-[11px] text-emerald-400/80 font-medium">
                      Offer timestamp: {new Date(app.offeredAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}

              {/* Sanitized Audit Log Timeline */}
              {history.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-sm font-bold text-ink tracking-tight flex items-center gap-2">
                    <Clock className="w-4 h-4 text-ink-soft" />
                    <span>Activity & Milestones</span>
                  </h3>

                  <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                    {history.map((hist, i) => {
                      const isComplete = hist.status === 'completed' || hist.status === 'passed';
                      return (
                        <div key={i} className="relative space-y-1">
                          <div
                            className={`absolute -left-[23px] top-1 w-3.5 h-3.5 rounded-full border-2 border-surface ${
                              isComplete ? 'bg-emerald-500' : 'bg-primary'
                            }`}
                          />
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-bold text-ink">
                              {hist.stageName} — {hist.status.replace('_', ' ').toUpperCase()}
                            </span>
                            <span className="text-[10px] text-ink-soft font-medium">
                              {new Date(hist.enteredAt).toLocaleString()}
                            </span>
                          </div>
                          {hist.completedAt && (
                            <p className="text-[11px] text-ink-soft">
                              Completed: {new Date(hist.completedAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Attached Documents */}
              <div className="p-4 rounded-2xl bg-surface-alt/40 border border-border/80 space-y-2">
                <h4 className="text-xs font-bold text-ink uppercase tracking-wider">Submitted Credentials</h4>
                <div className="flex flex-wrap items-center gap-3 text-xs text-ink-soft">
                  {app.resume && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border text-ink font-medium">
                      <FileText className="w-3.5 h-3.5 text-primary" />
                      <span>{app.resume.title || 'Resume Document'}</span>
                    </div>
                  )}
                  {app.coverLetter && (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border text-ink font-medium">
                      <FileText className="w-3.5 h-3.5 text-purple-400" />
                      <span>{app.coverLetter.title || 'Cover Letter'}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-border flex items-center justify-end gap-3 shrink-0 bg-surface">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-surface-alt hover:bg-surface-alt/80 text-ink font-bold text-xs border border-border transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
