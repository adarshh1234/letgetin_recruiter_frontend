"use client";

import React from "react";
import {
  Building2,
  MapPin,
  DollarSign,
  Briefcase,
  Sparkles,
  Bookmark,
  CheckCircle2,
  Zap,
  ArrowRight,
  Send,
} from "lucide-react";
import { IJob } from "../types/job.types";

interface JobCardProps {
  job: IJob;
  onSelect: (job: IJob) => void;
  isSaved?: boolean;
  onToggleSave?: (jobId: string) => void;
  isSelected?: boolean;
  isApplied?: boolean;
  appliedSource?: "ai_apply" | "manual";
  layoutMode?: "grid" | "compact";
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onSelect,
  isSaved = false,
  onToggleSave,
  isSelected = false,
  isApplied = false,
  appliedSource,
  layoutMode = "grid",
}) => {
  const match = job.matchScore || 75;

  // Visual match tone
  const matchTone =
    match >= 85
      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60"
      : match >= 70
        ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60"
        : "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/60 dark:text-slate-300 dark:border-slate-800";

  const workplaceTone =
    job.workplaceType === "remote"
      ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800"
      : job.workplaceType === "hybrid"
        ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800"
        : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300";

  // Format Salary
  const formatSalary = () => {
    if (!job.salary || (!job.salary.min && !job.salary.max)) {
      return "Competitive";
    }
    const { min, max, currency, period } = job.salary;
    const periodLabel =
      period === "yearly" ? "/yr" : period === "monthly" ? "/mo" : "/hr";

    if (currency === "INR") {
      const minLPA = (min / 100000).toFixed(min % 100000 === 0 ? 0 : 1);
      const maxLPA = (max / 100000).toFixed(max % 100000 === 0 ? 0 : 1);
      return `₹${minLPA}–${maxLPA} LPA`;
    }

    const symbol =
      currency === "USD"
        ? "$"
        : currency === "EUR"
          ? "€"
          : currency === "GBP"
            ? "£"
            : `${currency} `;
    const minK = min >= 1000 ? `${Math.round(min / 1000)}k` : min;
    const maxK = max >= 1000 ? `${Math.round(max / 1000)}k` : max;
    return `${symbol}${minK}–${maxK}${periodLabel}`;
  };

  // Company avatar fallback initials
  const initials = (job.company.name || "C")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const matchedSkills = job.matchedSkills || [];

  // COMPACT LAYOUT (FOR 1-COLUMN SPLIT-VIEW MODE)
  if (layoutMode === "compact") {
    return (
      <article
        onClick={() => onSelect(job)}
        className={`group rounded-2xl border transition-all duration-200 p-4 flex flex-col justify-between relative cursor-pointer ${
          isSelected
            ? "bg-primary/[0.04] border-primary ring-2 ring-primary/25 shadow-sm"
            : "bg-card border-border/80 hover:border-primary/40 hover:bg-surface-alt/40 shadow-2xs"
        }`}
      >
        {/* Active side indicator */}
        {isSelected && (
          <div className="absolute left-0 top-3 bottom-3 w-1 bg-primary rounded-r-full" />
        )}

        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-2.5">
            <div className="flex items-start gap-3 min-w-0">
              <div
                className={`w-10 h-10 rounded-xl font-bold text-xs grid place-items-center shrink-0 shadow-2xs transition-transform duration-200 ${
                  isSelected
                    ? "bg-gradient-brand text-white"
                    : "bg-gradient-brand text-white group-hover:scale-105"
                }`}
              >
                {initials}
              </div>

              <div className="min-w-0">
                <h4
                  className={`font-bold text-sm leading-snug line-clamp-1 transition-colors ${
                    isSelected
                      ? "text-primary font-extrabold"
                      : "text-ink group-hover:text-primary"
                  }`}
                  title={job.title}
                >
                  {job.title}
                </h4>
                <p className="text-xs text-ink-soft flex items-center gap-1 mt-0.5 font-medium">
                  <span className="truncate max-w-[130px]">
                    {job.company.name}
                  </span>
                  <span className="text-border">•</span>
                  <span className="capitalize">{job.experienceLevel}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {isApplied && (
                appliedSource === "ai_apply" ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shadow-2xs">
                    <Zap className="w-2.5 h-2.5 text-purple-600 dark:text-purple-400" />
                    AI Applied
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-2xs">
                    <Send className="w-2.5 h-2.5 text-blue-600 dark:text-blue-400" />
                    Manual Applied
                  </span>
                )
              )}

              <span
                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border shadow-2xs ${matchTone}`}
              >
                <Sparkles className="w-3 h-3 fill-current" />
                {match}%
              </span>
            </div>
          </div>

          {/* Compact Info Row */}
          <div className="mt-3 flex items-center justify-between gap-2 text-xs text-ink-soft bg-surface-alt/60 px-2.5 py-1.5 rounded-lg border border-border/40">
            <div className="flex items-center gap-1 font-bold text-ink truncate">
              <DollarSign className="w-3 h-3 text-emerald-600 shrink-0" />
              <span className="truncate">{formatSalary()}</span>
            </div>

            <div className="flex items-center gap-1 text-[11px] truncate">
              <MapPin className="w-3 h-3 text-ink-soft/70 shrink-0" />
              <span className="truncate">
                {job.location.city
                  ? `${job.location.city}`
                  : job.location.country}
              </span>
            </div>

            <span
              className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border shrink-0 ${workplaceTone}`}
            >
              {job.workplaceType}
            </span>
          </div>

          {/* Skills tags preview */}
          <div className="mt-2.5 flex flex-wrap gap-1">
            {job.skills.slice(0, 3).map((skill) => {
              const isMatched = matchedSkills.some(
                (s) => s.toLowerCase() === skill.toLowerCase(),
              );
              return (
                <span
                  key={skill}
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-md inline-flex items-center gap-0.5 border ${
                    isMatched
                      ? "bg-primary/10 text-primary border-primary/20 font-semibold"
                      : "bg-surface-alt text-ink-soft border-border/60"
                  }`}
                >
                  {isMatched && (
                    <CheckCircle2 className="w-2.5 h-2.5 text-primary shrink-0" />
                  )}
                  <span className="truncate max-w-[80px]">{skill}</span>
                </span>
              );
            })}
            {job.skills.length > 3 && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-surface-alt text-ink-soft border border-border/60">
                +{job.skills.length - 3}
              </span>
            )}
          </div>
        </div>
      </article>
    );
  }

  // STANDARD 3-COLUMN GRID LAYOUT
  return (
    <article
      onClick={() => onSelect(job)}
      className={`group rounded-2xl bg-card border transition-all duration-300 p-5 flex flex-col justify-between relative overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-elegant ${
        isSelected
          ? "border-primary ring-2 ring-primary/20 shadow-md"
          : "border-border/80 hover:border-primary/50 shadow-xs"
      }`}
    >
      {/* Top Accent Stripe for high match */}
      {match >= 88 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-primary to-primary-glow" />
      )}

      <div>
        {/* Header: Company Avatar & Title & Match Pill */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-brand text-white font-bold text-sm grid place-items-center shrink-0 shadow-xs shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
              {initials}
            </div>

            <div className="min-w-0">
              <h3
                className="font-bold text-base text-ink group-hover:text-primary transition-colors line-clamp-1"
                title={job.title}
              >
                {job.title}
              </h3>
              <p className="text-xs text-ink-soft flex items-center gap-1.5 mt-0.5 font-medium">
                <Building2 className="w-3.5 h-3.5 text-primary-glow shrink-0" />
                <span className="truncate max-w-[120px] sm:max-w-[150px]">
                  {job.company.name}
                </span>
                <span className="text-border">•</span>
                <span className="capitalize">{job.experienceLevel}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {isApplied && (
              appliedSource === "ai_apply" ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shadow-xs">
                  <Zap className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  AI Applied
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-xs">
                  <Send className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  Manual Applied
                </span>
              )
            )}

            <span
              className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full border shadow-xs ${matchTone}`}
            >
              <Sparkles className="w-3 h-3 fill-current" />
              {match}%
            </span>
          </div>
        </div>

        {/* 2x2 Meta Grid */}
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-ink-soft bg-surface-alt/70 p-3 rounded-xl border border-border/50">
          <div className="inline-flex items-center gap-1.5 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-ink-soft/70 shrink-0" />
            <span className="truncate">
              {job.location.city
                ? `${job.location.city}, ${job.location.country}`
                : job.location.country}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 min-w-0 font-bold text-ink">
            <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{formatSalary()}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 min-w-0">
            <Briefcase className="w-3.5 h-3.5 text-ink-soft/70 shrink-0" />
            <span className="truncate capitalize">{job.employmentType}</span>
          </div>

          <div className="inline-flex items-center gap-1.5 min-w-0">
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border ${workplaceTone}`}
            >
              {job.workplaceType}
            </span>
          </div>
        </div>

        {/* Match Reason Highlight */}
        {job.matchReasons && job.matchReasons.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            <Zap className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate">{job.matchReasons[0]}</span>
          </div>
        )}

        {/* Skills Alignment Tags */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((skill) => {
            const isMatched = matchedSkills.some(
              (s) => s.toLowerCase() === skill.toLowerCase(),
            );
            return (
              <span
                key={skill}
                className={`text-[11px] font-medium px-2 py-0.5 rounded-lg inline-flex items-center gap-1 border transition ${
                  isMatched
                    ? "bg-primary/10 text-primary border-primary/25 font-semibold"
                    : "bg-surface-alt text-ink-soft border-border"
                }`}
              >
                {isMatched && (
                  <CheckCircle2 className="w-2.5 h-2.5 text-primary shrink-0" />
                )}
                <span className="truncate max-w-[90px]">{skill}</span>
              </span>
            );
          })}
          {job.skills.length > 4 && (
            <span className="text-[11px] font-medium px-1.5 py-0.5 rounded-lg bg-surface-alt text-ink-soft border border-border">
              +{job.skills.length - 4}
            </span>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="mt-4 flex items-center gap-2 pt-3 border-t border-border/70">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(job);
          }}
          className={`flex-1 font-semibold px-3 py-2 rounded-xl text-xs transition-all duration-200 flex items-center justify-center gap-1.5 border group/btn cursor-pointer ${
            isApplied
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20"
              : "bg-surface-alt hover:bg-primary hover:text-white text-ink border-border hover:border-primary"
          }`}
        >
          {isApplied ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                {appliedSource === "ai_apply"
                  ? "AI Applied • View Status"
                  : "Manual Applied • View Status"}
              </span>
            </>
          ) : (
            <>
              <span>View Details & Apply</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>

        {onToggleSave && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(job._id);
            }}
            aria-label={isSaved ? "Remove from saved" : "Save job"}
            className={`w-9 h-9 grid place-items-center rounded-xl border transition-all duration-200 cursor-pointer ${
              isSaved
                ? "bg-primary/10 border-primary text-primary shadow-xs"
                : "border-border text-ink-soft hover:bg-surface-alt hover:text-ink"
            }`}
          >
            <Bookmark
              className={`w-4 h-4 ${isSaved ? "fill-primary text-primary" : ""}`}
            />
          </button>
        )}
      </div>
    </article>
  );
};
