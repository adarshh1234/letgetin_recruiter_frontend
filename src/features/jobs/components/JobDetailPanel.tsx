"use client";

import React, { useState } from "react";
import {
  Building2,
  MapPin,
  Briefcase,
  Clock,
  Bookmark,
  Share2,
  Check,
  CheckCircle2,
  Circle,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Gift,
  GraduationCap,
  Zap,
  AlertCircle,
  DollarSign,
  Send,
  Calendar,
  PanelLeftClose,
  Maximize2,
  Minimize2,
  X,
  Percent,
} from "lucide-react";
import { IJob } from "../types/job.types";

interface JobDetailPanelProps {
  job: IJob | null;
  onClose?: () => void;
  isSaved?: boolean;
  onToggleSave?: (jobId: string) => void;
  onStartApplication: (job: IJob) => void;
  isApplied?: boolean;
  appliedSource?: "ai_apply" | "manual";
  isPanelCollapsed?: boolean;
  onTogglePanel?: () => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const JobDetailPanel: React.FC<JobDetailPanelProps> = ({
  job,
  onClose,
  isSaved = false,
  onToggleSave,
  onStartApplication,
  isApplied = false,
  appliedSource,
  isPanelCollapsed = false,
  onTogglePanel,
  isExpanded = false,
  onToggleExpand,
}) => {
  const [copied, setCopied] = useState(false);
  const [isApplicationAccordionOpen, setIsApplicationAccordionOpen] =
    useState(true);

  if (!job) {
    return (
      <div className="h-full min-h-[500px] rounded-3xl border border-dashed border-border bg-card/60 p-12 flex flex-col items-center justify-center text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary grid place-items-center">
          <Briefcase className="w-7 h-7" />
        </div>
        <h3 className="font-extrabold text-base text-ink">
          Select a Role to View Details
        </h3>
        <p className="text-xs text-ink-soft max-w-xs">
          Click any role from the left list to view requirements, salary, team
          insights, and start your application.
        </p>
      </div>
    );
  }

  const match = job.matchScore || 75;
  const matchedSkills = job.matchedSkills || [];
  const missingSkills = job.missingSkills || [];

  // Match score tone
  const matchTone =
    match >= 85
      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60"
      : match >= 70
        ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60"
        : "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/60 dark:text-slate-300 dark:border-slate-800";

  // Format Salary / Rate
  const formatRate = () => {
    if (!job.salary || (!job.salary.min && !job.salary.max)) {
      return { main: "Competitive", sub: "Based on experience" };
    }
    const { min, max, currency, period } = job.salary;
    const periodLabel =
      period === "yearly"
        ? "per year"
        : period === "monthly"
          ? "per month"
          : "per hour";

    if (currency === "INR") {
      const minLPA = (min / 100000).toFixed(min % 100000 === 0 ? 0 : 1);
      const maxLPA = (max / 100000).toFixed(max % 100000 === 0 ? 0 : 1);
      return { main: `₹${minLPA}–${maxLPA} LPA`, sub: periodLabel };
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
    return { main: `${symbol}${minK}–${maxK}`, sub: periodLabel };
  };

  const rate = formatRate();

  const companyInitial = (job.company.name || "C").charAt(0).toUpperCase();
  const isDeadlinePassed = !!job.expiresAt && new Date(job.expiresAt).getTime() < Date.now();
  const stepsCompleted = isApplied ? 1 : 0;
  const progressPercent = isApplied ? 20 : 0;

  return (
    <div className="bg-card border border-border rounded-3xl flex flex-col h-full shadow-sm overflow-hidden relative">
      {/* Top Action Bar with Two Left Control Icons & Right Actions */}
      <div className="p-3.5 sm:p-4 border-b border-border/80 flex items-center justify-between bg-surface-alt/30 shrink-0">
        {/* Left Area: Two Small Minimal Icons (Panel Toggle & Expand) + Role ID */}
        <div className="flex items-center gap-2">
          {/* Icon 1: Panel / Layout Toggle (Closes details & returns to 3 columns) */}
          {onTogglePanel && (
            <button
              type="button"
              onClick={onTogglePanel}
              className="p-1.5 rounded-lg border border-border/70 text-ink-soft hover:text-ink hover:bg-surface-alt/70 transition cursor-pointer"
              title="Close details & show 3 columns of jobs"
              aria-label="Close details and show 3 columns of jobs"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}

          <div className="h-4 w-px bg-border/80 mx-0.5 hidden sm:block" />

          {/* Role ID Tag */}
        </div>
      </div>

      {/* Main Scrollable Content (Hidden Scrollbar, Fully Scrollable) */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 no-scrollbar">
        {/* Title, Match Badge, Rate Header */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full border shadow-2xs ${matchTone}`}
                >
                  <Sparkles className="w-3.5 h-3.5 fill-current" />
                  {match}% Match
                </span>

                {isApplied && (
                  appliedSource === "ai_apply" ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shadow-2xs">
                      <Zap className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                      AI Auto-Applied
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shadow-2xs">
                      <Send className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      Manual Applied
                    </span>
                  )
                )}

                {job.workplaceType === "remote" && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
                    100% Remote
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight leading-tight">
                {job.title}
              </h1>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap text-xs sm:text-sm text-ink-soft font-medium">
                <span className="inline-flex items-center gap-1.5 font-semibold text-ink">
                  <Building2 className="w-4 h-4 text-primary" />
                  {job.company.name}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-ink-soft" />
                  {job.location.city
                    ? `${job.location.city}, ${job.location.country}`
                    : job.location.country}
                </span>
                <span>•</span>
                <span className="capitalize">
                  {job.employmentType} contract
                </span>
              </div>
            </div>

            {/* Large Rate Block */}
            <div className="sm:text-right shrink-0">
              <div className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                {rate.main}
              </div>
              {rate.sub && (
                <div className="text-xs font-semibold text-ink-soft mt-0.5">
                  {rate.sub}
                </div>
              )}
            </div>
          </div>

          {/* Quick Specs 4-Box Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-alt/50 border border-border/80 rounded-2xl p-4">
            <div>
              <span className="text-[11px] text-ink-soft font-semibold uppercase tracking-wider flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                Compensation
              </span>
              <p className="font-extrabold text-sm sm:text-base text-ink mt-1">
                {rate.main}
              </p>
              <p className="text-[10px] text-ink-soft">{rate.sub}</p>
            </div>

            <div>
              <span className="text-[11px] text-ink-soft font-semibold uppercase tracking-wider flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                Experience
              </span>
              <p className="font-bold text-sm sm:text-base text-ink mt-1 capitalize">
                {job.experienceLevel}
              </p>
              <p className="text-[10px] text-ink-soft">
                {job.minimumExperience}+ years min
              </p>
            </div>

            <div>
              <span className="text-[11px] text-ink-soft font-semibold uppercase tracking-wider flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                Workplace
              </span>
              <p className="font-bold text-sm sm:text-base text-ink mt-1 capitalize">
                {job.workplaceType}
              </p>
              <p className="text-[10px] text-ink-soft">
                {job.location.country}
              </p>
            </div>

            <div>
              <span className="text-[11px] text-ink-soft font-semibold uppercase tracking-wider flex items-center gap-1">
                <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                Education
              </span>
              <p className="font-bold text-xs sm:text-sm text-ink mt-1 truncate">
                {job.educationRequirements || "Bachelor's"}
              </p>
              <p className="text-[10px] text-ink-soft">or equivalent</p>
            </div>

            {job.eligibilityMinPercent != null && (
              <div>
                <span className="text-[11px] text-ink-soft font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5 text-rose-600" />
                  Eligibility
                </span>
                <p className="font-bold text-sm sm:text-base text-ink mt-1">{job.eligibilityMinPercent}%+</p>
                <p className="text-[10px] text-ink-soft">minimum required</p>
              </div>
            )}

            {job.expiresAt && (
              <div>
                <span className="text-[11px] text-ink-soft font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-orange-600" />
                  Deadline
                </span>
                <p className="font-bold text-sm sm:text-base text-ink mt-1">
                  {(() => {
                    const d = new Date(job.expiresAt);
                    const dd = String(d.getDate()).padStart(2, "0");
                    const mm = String(d.getMonth() + 1).padStart(2, "0");
                    return `${dd}-${mm}-${d.getFullYear()}`;
                  })()}
                </p>
                <p className="text-[10px] text-ink-soft">
                  {new Date(job.expiresAt).getTime() < Date.now() ? "Applications closed" : "apply before this date"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Company Card */}
        <div className="p-4 rounded-2xl bg-surface-alt/40 border border-border flex items-center justify-between gap-3">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-brand text-white font-bold text-lg grid place-items-center shrink-0 shadow-sm shadow-primary/20">
              {companyInitial}
            </div>
            <div className="min-w-0">
              <p className="text-xs text-ink-soft font-semibold">
                Posted by {job.company.name}
              </p>
              <a
                href={
                  job.company.website
                    ? job.company.website.startsWith("http")
                      ? job.company.website
                      : `https://${job.company.website}`
                    : "#"
                }
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-ink hover:text-primary transition flex items-center gap-1 mt-0.5"
              >
                <span>
                  {job.company.website ||
                    `${job.company.name.toLowerCase().replace(/\s+/g, "")}.com`}
                </span>
                <ExternalLink className="w-3 h-3 text-ink-soft" />
              </a>
            </div>
          </div>

          {job.publishedAt && (
            <div className="text-right text-[11px] text-ink-soft shrink-0">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Posted
              </span>
              <span className="font-medium text-ink">
                {new Date(job.publishedAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* AI Match Fit Breakdown */}
        <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-surface-alt to-primary/10 border border-primary/20 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-sm text-ink">
              <Sparkles className="w-4 h-4 text-primary-glow" />
              <span>AI Profile Fit Analysis</span>
            </div>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
              {match}% Match
            </span>
          </div>

          {/* Match Reasons Highlight */}
          {job.matchReasons && job.matchReasons.length > 0 && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
              <Zap className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <span>{job.matchReasons[0]}</span>
            </div>
          )}

          {/* Matched Skills */}
          <div>
            <div className="text-xs font-semibold text-ink-soft mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Matched Skills ({matchedSkills.length})
            </div>
            <div className="flex flex-wrap gap-1.5">
              {matchedSkills.map((skill) => (
                <span
                  key={skill}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 inline-flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  {skill}
                </span>
              ))}
              {matchedSkills.length === 0 && (
                <span className="text-xs text-ink-soft italic">
                  General background alignment
                </span>
              )}
            </div>
          </div>

          {/* Missing Skills */}
          {missingSkills.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-ink-soft mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                Recommended skills to highlight ({missingSkills.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-medium px-2.5 py-1 rounded-lg bg-secondary text-ink-soft border border-border"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Application Progress Accordion */}
        <div className="rounded-2xl border border-border overflow-hidden bg-card">
          <button
            type="button"
            onClick={() =>
              setIsApplicationAccordionOpen(!isApplicationAccordionOpen)
            }
            className="w-full p-4 sm:p-5 flex items-center justify-between gap-3 hover:bg-surface-alt/40 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-sm sm:text-base text-ink">
                Application
              </h3>
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  isApplied
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                    : "bg-surface-alt text-ink-soft border border-border"
                }`}
              >
                {isApplied ? "In review" : "Not started"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-ink-soft">
                {stepsCompleted} of 5 steps completed ({progressPercent}%)
              </span>
              {isApplicationAccordionOpen ? (
                <ChevronUp className="w-4 h-4 text-ink-soft" />
              ) : (
                <ChevronDown className="w-4 h-4 text-ink-soft" />
              )}
            </div>
          </button>

          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-secondary">
            <div
              className="h-full bg-[#5345ec] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* 5 Application Steps */}
          {isApplicationAccordionOpen && (
            <div className="p-4 sm:p-5 space-y-3.5 border-t border-border/70 bg-surface-alt/10">
              {/* Step 1: Resume */}
              <div className="flex items-center justify-between py-1 text-xs sm:text-sm">
                <div>
                  <p className="font-bold text-ink">Resume</p>
                  <p className="text-[11px] text-ink-soft">
                    {isApplied ? "Resume profile attached" : "Not done"}
                  </p>
                </div>
                {isApplied ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-border shrink-0" />
                )}
              </div>

              {/* Step 2: Domain Expert Interview */}
              <div className="flex items-center justify-between py-1 text-xs sm:text-sm border-t border-border/50 pt-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-ink">
                      Domain Expert Interview
                    </p>
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-surface-alt text-ink-soft border border-border">
                      CORE
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-soft">Not done</p>
                </div>
                <Circle className="w-5 h-5 text-border shrink-0" />
              </div>

              {/* Step 3: Project Assessment */}
              <div className="flex items-center justify-between py-1 text-xs sm:text-sm border-t border-border/50 pt-3">
                <div>
                  <p className="font-bold text-ink">Project Assessment</p>
                  <p className="text-[11px] text-ink-soft">Not done</p>
                </div>
                <Circle className="w-5 h-5 text-border shrink-0" />
              </div>

              {/* Step 4: Availability */}
              <div className="flex items-center justify-between py-1 text-xs sm:text-sm border-t border-border/50 pt-3">
                <div>
                  <p className="font-bold text-ink">Availability</p>
                  <p className="text-[11px] text-ink-soft">Not done</p>
                </div>
                <Circle className="w-5 h-5 text-border shrink-0" />
              </div>

              {/* Step 5: Work Authorization */}
              <div className="flex items-center justify-between py-1 text-xs sm:text-sm border-t border-border/50 pt-3">
                <div>
                  <p className="font-bold text-ink">Work Authorization</p>
                  <p className="text-[11px] text-ink-soft">Not done</p>
                </div>
                <Circle className="w-5 h-5 text-border shrink-0" />
              </div>

              {/* Step Note */}
              <div className="mt-3 p-3 rounded-xl bg-surface-alt/60 border border-border/60 flex items-start gap-2.5 text-xs text-ink-soft leading-relaxed">
                <Info className="w-4 h-4 text-primary-glow shrink-0 mt-0.5" />
                <span>
                  All application steps are reused whenever another role
                  requires the same step, so you never have to upload your
                  resume or take the same interview twice.
                </span>
              </div>
            </div>
          )}
        </div>

        {/* About the Role */}
        <div className="space-y-3">
          <h3 className="font-bold text-base text-ink">About the Role</h3>
          <p className="text-xs sm:text-sm text-ink-soft leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>

        {/* Skills Alignment */}
        {job.skills && job.skills.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold text-base text-ink">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => {
                const isMatched = matchedSkills.some(
                  (s) => s.toLowerCase() === skill.toLowerCase(),
                );
                return (
                  <span
                    key={skill}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 ${
                      isMatched
                        ? "bg-primary/10 text-primary border-primary/30"
                        : "bg-surface-alt text-ink border-border"
                    }`}
                  >
                    {isMatched && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                    )}
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Key Responsibilities */}
        {job.responsibilities && job.responsibilities.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold text-base text-ink">
              Key Responsibilities
            </h3>
            <ul className="space-y-2.5">
              {job.responsibilities.map((resp, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-ink-soft leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5345ec] mt-2 shrink-0" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Requirements */}
        {job.requirements && job.requirements.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold text-base text-ink">Requirements</h3>
            <ul className="space-y-2.5">
              {job.requirements.map((req, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-ink-soft leading-relaxed"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Benefits & Perks */}
        {job.benefits && job.benefits.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-bold text-base text-ink flex items-center gap-2">
              <Gift className="w-4 h-4 text-purple-600" /> Perks & Benefits
            </h3>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {job.benefits.map((benefit, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-surface-alt/60 border border-border/70 text-xs text-ink font-medium flex items-center gap-2.5"
                >
                  <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Bar (Unobscured, Fully Sticky) */}
      <div className="p-4 sm:p-5 border-t border-border bg-card/95 backdrop-blur-xs sticky bottom-0 z-10 shrink-0 flex items-center gap-3">
        <button
          type="button"
          onClick={() => !isDeadlinePassed && onStartApplication(job)}
          disabled={isDeadlinePassed}
          title={isDeadlinePassed ? "The application deadline for this job has passed." : undefined}
          className={`flex-1 py-3.5 px-6 rounded-2xl font-bold text-sm text-white shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 ${
            isDeadlinePassed
              ? "bg-ink-soft/40 cursor-not-allowed"
              : isApplied
                ? "bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                : "bg-gradient-brand hover:bg-[#4335dc] cursor-pointer"
          }`}
        >
          {isDeadlinePassed ? (
            <span>Applications Closed</span>
          ) : isApplied ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {appliedSource === "ai_apply"
                  ? "Applied via AI Auto-Apply (In Review)"
                  : "Application Submitted via Manual Apply (In Review)"}
              </span>
            </>
          ) : (
            <>
              <span>Start application</span>
              <ExternalLink className="w-4 h-4 ml-1" />
            </>
          )}
        </button>

        {onToggleSave && (
          <button
            type="button"
            onClick={() => onToggleSave(job._id)}
            className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-center ${
              isSaved
                ? "bg-primary/10 border-primary text-primary"
                : "border-border text-ink-soft hover:text-ink hover:bg-surface-alt"
            }`}
            title={isSaved ? "Saved to Bookmarks" : "Save Job"}
            aria-label={isSaved ? "Saved to Bookmarks" : "Save Job"}
          >
            <Bookmark
              className={`w-5 h-5 ${
                isSaved ? "fill-primary text-primary" : ""
              }`}
            />
          </button>
        )}
      </div>
    </div>
  );
};
