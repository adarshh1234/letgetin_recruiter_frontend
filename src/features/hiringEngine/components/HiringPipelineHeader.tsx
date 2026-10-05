"use client";

import React from "react";
import {
  Sparkles,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  PauseCircle,
  Briefcase,
  Users,
  Target,
  Award,
  Layers,
  ChevronRight,
  PlusCircle,
} from "lucide-react";
import { IFunnelMetricsReport, FunnelHealthState } from "../types/hiringEngine.types";
import { RecruiterJob } from "@/features/recruiter/types";

interface HiringPipelineHeaderProps {
  jobs: RecruiterJob[];
  selectedJobId: string;
  onSelectJob: (jobId: string) => void;
  metrics: IFunnelMetricsReport | null;
  loadingMetrics: boolean;
  onRefresh: () => void;
  onInitPipelineClick?: () => void;
}

export function HiringPipelineHeader({
  jobs,
  selectedJobId,
  onSelectJob,
  metrics,
  loadingMetrics,
  onRefresh,
  onInitPipelineClick,
}: HiringPipelineHeaderProps) {
  const selectedJob = jobs.find((j) => j._id === selectedJobId);

  const health = metrics?.health || "healthy";
  const shortlisted = metrics?.currentShortlistedCount || 0;
  const target = metrics?.finalShortlistTarget || 1;
  const progressPercent = Math.min(100, Math.round((shortlisted / target) * 100));

  const getHealthBadge = (h: FunnelHealthState) => {
    switch (h) {
      case "healthy":
        return {
          icon: CheckCircle2,
          text: "Healthy Pipeline",
          className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        };
      case "starved":
        return {
          icon: AlertTriangle,
          text: "Pool Starved — Reserve Depleted",
          className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        };
      case "paused":
        return {
          icon: PauseCircle,
          text: "Pipeline Paused",
          className: "bg-slate-500/10 text-slate-600 border-slate-500/20",
        };
      case "completed":
        return {
          icon: Award,
          text: "Shortlist Target Achieved",
          className: "bg-purple-500/10 text-purple-600 border-purple-500/20",
        };
      default:
        return {
          icon: CheckCircle2,
          text: "Active",
          className: "bg-primary/10 text-primary-glow border-primary/20",
        };
    }
  };

  const healthBadge = getHealthBadge(health);
  const HealthIcon = healthBadge.icon;

  return (
    <div className="space-y-6 pb-6 border-b border-border/80">
      {/* Top Breadcrumb & Job Selector */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-ink-soft mb-1.5">
            <span>Recruiter</span>
            <ChevronRight className="w-3 h-3 text-ink-soft/60" />
            <span>Hiring Pipeline</span>
            {selectedJob && (
              <>
                <ChevronRight className="w-3 h-3 text-ink-soft/60" />
                <span className="font-semibold text-primary">{selectedJob.title}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              {metrics?.jobTitle || selectedJob?.title || "Hiring Pipeline"}
            </h1>
            {metrics && (
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${healthBadge.className}`}
              >
                <HealthIcon className="w-3.5 h-3.5" />
                <span>{healthBadge.text}</span>
              </span>
            )}
          </div>
          <p className="text-xs text-ink-soft mt-1">
            Autonomous stage-by-stage candidate journey, dynamic reserve refills, and AI evaluation.
          </p>
        </div>

        {/* Right Controls: Job Dropdown & Refresh */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Job Dropdown */}
          <div className="relative">
            <select
              value={selectedJobId}
              onChange={(e) => onSelectJob(e.target.value)}
              className="px-3.5 py-2.5 bg-surface border border-border rounded-xl text-xs font-bold text-ink shadow-xs focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer pr-8 max-w-xs truncate"
            >
              {jobs.length === 0 ? (
                <option value="">No Active Jobs Found</option>
              ) : (
                jobs.map((j) => (
                  <option key={j._id} value={j._id}>
                    {j.title} {j.status !== "active" ? `(${j.status})` : ""}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={loadingMetrics || !selectedJobId}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-alt text-xs font-semibold text-ink shadow-xs transition disabled:opacity-50"
            title="Refresh pipeline metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-ink-soft ${loadingMetrics ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Init Pipeline Button (if not configured yet) */}
          {!metrics && !loadingMetrics && onInitPipelineClick && (
            <button
              type="button"
              onClick={onInitPipelineClick}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 transition"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Initialize Pipeline</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics Banner (Rendered when metrics are available) */}
      {metrics && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-surface border border-border shadow-xs">
          <div className="p-3 rounded-xl bg-surface-alt/40 border border-border/60">
            <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-primary" />
              Final Shortlist Target
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-extrabold text-ink">
                {shortlisted} / {target}
              </span>
              <span className="text-xs text-primary font-bold">({progressPercent}%)</span>
            </div>
            <div className="w-full bg-border/60 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="h-full bg-primary transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-alt/40 border border-border/60">
            <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              Primary Active
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-extrabold text-emerald-600">
                {metrics.primaryPoolSize}
              </span>
              <span className="text-xs text-ink-soft">in active stages</span>
            </div>
            <p className="text-[10px] text-ink-soft/70 mt-1.5 line-clamp-1">
              Screening & interviews in progress
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface-alt/40 border border-border/60">
            <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              Reserve Pool
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-extrabold text-amber-600">
                {metrics.reservePoolSize}
              </span>
              <span className="text-xs text-ink-soft">backups available</span>
            </div>
            <p className="text-[10px] text-ink-soft/70 mt-1.5 line-clamp-1">
              Automated refills on no-show/failure
            </p>
          </div>

          <div className="p-3 rounded-xl bg-surface-alt/40 border border-border/60">
            <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-purple-600" />
              Qualified Intake Quota
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-extrabold text-purple-600">
                {metrics.actualQualifiedCount ?? metrics.totalApplicants} / {metrics.totalFunnelIntakeTarget}
              </span>
            </div>
            <p className="text-[10px] text-ink-soft/70 mt-1.5 line-clamp-1">
              Authoritative qualified intake to yield {target} hire{target > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      )}

      {/* Starved Alert Notice if health === 'starved' */}
      {metrics?.health === "starved" && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-800 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <div className="space-y-0.5">
            <strong className="font-bold">Candidate Pool Needs Sourcing</strong>
            <p className="text-ink-soft dark:text-amber-300/80 leading-relaxed">
              {metrics.healthReason ||
                "A stage deficit is detected but the reserve candidate pool is exhausted. Sourcing more applicants or promoting the job posting is recommended to keep the funnel full."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
