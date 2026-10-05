'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Building2,
  MapPin,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Search,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
  Loader2,
  CheckSquare,
  Square,
  Briefcase,
  Send,
} from 'lucide-react';
import { useAiApplyStore } from '../store/useAiApplyStore';
import { MatchedJobItem } from '../types';
import { BatchApplyingHUD } from './BatchApplyingHUD';

export function Step7MatchedJobsReview() {
  const matchedJobs = useAiApplyStore((s) => s.matchedJobs);
  const isFetching = useAiApplyStore((s) => s.isFetchingMatchedJobs);
  const matchedTotal = useAiApplyStore((s) => s.matchedJobsTotal);
  const selectedJobIds = useAiApplyStore((s) => s.selectedJobIds);
  const toggleJobSelection = useAiApplyStore((s) => s.toggleJobSelection);
  const selectAllJobs = useAiApplyStore((s) => s.selectAllJobs);
  const deselectAllJobs = useAiApplyStore((s) => s.deselectAllJobs);
  const selectTopN = useAiApplyStore((s) => s.selectTopN);
  const permissionGranted = useAiApplyStore((s) => s.permissionGranted);
  const setPermissionGranted = useAiApplyStore((s) => s.setPermissionGranted);
  const batchMinScore = useAiApplyStore((s) => s.batchMinScore);
  const setBatchMinScore = useAiApplyStore((s) => s.setBatchMinScore);
  const batchSearchQuery = useAiApplyStore((s) => s.batchSearchQuery);
  const setBatchSearchQuery = useAiApplyStore((s) => s.setBatchSearchQuery);
  const startBatchApply = useAiApplyStore((s) => s.startBatchApply);
  const batchActionLoading = useAiApplyStore((s) => s.batchActionLoading);
  const activeBatchSession = useAiApplyStore((s) => s.activeBatchSession);
  const fetchMatchedJobs = useAiApplyStore((s) => s.fetchMatchedJobs);
  const candidateProfileMeta = useAiApplyStore((s) => s.candidateProfileMeta);
  const preferences = useAiApplyStore((s) => s.preferences);

  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);
  const [workplaceFilter, setWorkplaceFilter] = useState<'all' | 'remote' | 'hybrid' | 'onsite'>('all');

  useEffect(() => {
    if (matchedJobs.length === 0 && !isFetching) {
      fetchMatchedJobs();
    }
  }, [matchedJobs.length, isFetching, fetchMatchedJobs]);

  // If a batch session is active, show the Live Batch Monitor HUD
  if (activeBatchSession) {
    return <BatchApplyingHUD />;
  }

  // Filter jobs by search and workplace locally for snappy feel
  const filteredJobs = matchedJobs.filter((job) => {
    if (workplaceFilter !== 'all' && job.workplaceType !== workplaceFilter) {
      return false;
    }
    if (batchSearchQuery.trim()) {
      const q = batchSearchQuery.toLowerCase();
      const matchTitle = job.title?.toLowerCase().includes(q);
      const matchCompany = job.company?.name?.toLowerCase().includes(q);
      const matchSkill = job.skills?.some((s) => s.toLowerCase().includes(q));
      const matchLocation =
        job.location?.city?.toLowerCase().includes(q) || job.location?.country?.toLowerCase().includes(q);
      if (!matchTitle && !matchCompany && !matchSkill && !matchLocation) return false;
    }
    return true;
  });

  const selectedCount = selectedJobIds.length;
  const totalBatches = Math.ceil(selectedCount / 10);
  const avgMatchScore =
    matchedJobs.length > 0
      ? Math.round(matchedJobs.reduce((acc, j) => acc + (j.matchScore || 0), 0) / matchedJobs.length)
      : 88;

  return (
    <div className="space-y-6">
      {/* Step Header & AI Matching Overview */}
      <div className="p-5 rounded-2xl bg-gradient-brand text-white shadow-elegant space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">AI Matching Engine & Auto-Apply</h2>
              <p className="text-xs text-white/80">
                Smart AI matched your resume, skills, and preferences with top open job opportunities.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/resume?tab=jobs"
              className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-xs text-white transition flex items-center gap-1.5 cursor-pointer"
            >
              <Briefcase className="w-3 h-3" />
              <span>Applied Jobs</span>
            </Link>
            <span className="text-[11px] font-bold px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-xs text-white">
              ⚡ 10 Jobs / Batch
            </span>
          </div>
        </div>

        {/* Quick KPI Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-white/10 text-center">
          <div className="p-2 rounded-xl bg-white/5">
            <div className="text-[10px] uppercase font-bold text-white/70">Matched Jobs</div>
            <div className="text-lg font-black text-white">{matchedJobs.length}</div>
          </div>
          <div className="p-2 rounded-xl bg-white/5">
            <div className="text-[10px] uppercase font-bold text-white/70">Avg Match Score</div>
            <div className="text-lg font-black text-emerald-300">{avgMatchScore}%</div>
          </div>
          <div className="p-2 rounded-xl bg-white/5">
            <div className="text-[10px] uppercase font-bold text-white/70">Selected to Apply</div>
            <div className="text-lg font-black text-white">{selectedCount}</div>
          </div>
          <div className="p-2 rounded-xl bg-white/5">
            <div className="text-[10px] uppercase font-bold text-white/70">Estimated Batches</div>
            <div className="text-lg font-black text-white">
              {totalBatches} {totalBatches === 1 ? 'batch' : 'batches'}
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-surface border border-border rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-soft absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search matched jobs by title, company, or skills..."
              value={batchSearchQuery}
              onChange={(e) => setBatchSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-surface-alt/50 text-xs font-medium text-ink placeholder:text-ink-soft/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-glow"
            />
          </div>

          {/* Workplace Filter */}
          <div className="flex items-center gap-1 bg-surface-alt/70 p-1 rounded-xl border border-border text-xs font-semibold">
            {(['all', 'remote', 'hybrid', 'onsite'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setWorkplaceFilter(type)}
                className={`px-2.5 py-1 rounded-lg capitalize transition cursor-pointer ${
                  workplaceFilter === type
                    ? 'bg-surface text-ink shadow-xs font-bold'
                    : 'text-ink-soft hover:text-ink'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Score Threshold & Batch Selection Shortcuts */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/60 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-ink-soft text-[11px] uppercase tracking-wider">Min Score:</span>
            {[55, 70, 80, 90].map((score) => (
              <button
                key={score}
                type="button"
                onClick={() => setBatchMinScore(score)}
                className={`px-2.5 py-1 rounded-lg border font-bold text-[11px] transition cursor-pointer ${
                  batchMinScore === score
                    ? 'bg-primary text-white border-primary shadow-xs'
                    : 'bg-surface border-border text-ink-soft hover:border-primary-glow/40'
                }`}
              >
                {score}%+
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-ink-soft text-[11px] uppercase tracking-wider">Presets:</span>
            <button
              type="button"
              onClick={() => selectTopN(10)}
              className="px-2.5 py-1 rounded-lg border border-border bg-surface hover:bg-surface-alt text-ink font-bold text-[11px] transition cursor-pointer"
            >
              Top 10
            </button>
            <button
              type="button"
              onClick={() => selectTopN(20)}
              className="px-2.5 py-1 rounded-lg border border-border bg-surface hover:bg-surface-alt text-ink font-bold text-[11px] transition cursor-pointer"
            >
              Top 20
            </button>
            <button
              type="button"
              onClick={() => selectAllJobs()}
              className="px-2.5 py-1 rounded-lg border border-border bg-surface hover:bg-surface-alt text-ink font-bold text-[11px] transition cursor-pointer"
            >
              Select All
            </button>
            <button
              type="button"
              onClick={() => deselectAllJobs()}
              className="px-2.5 py-1 rounded-lg border border-border bg-surface hover:bg-surface-alt text-ink-soft hover:text-ink text-[11px] transition cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Matched Job Cards List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <span>Matched Job Opportunities</span>
            <span className="text-xs text-ink-soft font-normal">
              ({filteredJobs.length} {filteredJobs.length === 1 ? 'position' : 'positions'})
            </span>
          </h3>
          <span className="text-xs font-bold text-primary">
            {selectedCount} selected for application
          </span>
        </div>

        {isFetching ? (
          <div className="py-16 text-center space-y-3 bg-surface border border-border rounded-2xl">
            <Loader2 className="w-8 h-8 text-primary-glow animate-spin mx-auto" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-ink">Analyzing Job Matches & Profile Alignment...</p>
              <p className="text-xs text-ink-soft">
                Finding the best opportunities tailored to your career profile.
              </p>
            </div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-12 text-center space-y-2 bg-surface border border-border rounded-2xl p-6">
            <AlertCircle className="w-8 h-8 text-ink-soft mx-auto" />
            <p className="text-sm font-bold text-ink">No matching jobs found with current filter</p>
            <p className="text-xs text-ink-soft">
              Try lowering the minimum match score or clearing the search query.
            </p>
            <button
              type="button"
              onClick={() => {
                setBatchMinScore(55);
                setBatchSearchQuery('');
              }}
              className="mt-2 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-glow transition cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {filteredJobs.map((job) => {
              const isSelected = selectedJobIds.includes(String(job._id));
              const isExpanded = expandedJobId === String(job._id);
              const isAlreadyApplied = job.isAlreadyApplied;

              return (
                <div
                  key={String(job._id)}
                  className={`rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-surface border-primary-glow/60 shadow-xs ring-1 ring-primary-glow/20'
                      : 'bg-surface/80 border-border hover:border-border/80'
                  } ${isAlreadyApplied ? 'opacity-70' : ''}`}
                >
                  <div className="p-4 flex items-start gap-3.5">
                    {/* Checkbox */}
                    <button
                      type="button"
                      disabled={isAlreadyApplied}
                      onClick={() => toggleJobSelection(String(job._id))}
                      className="mt-0.5 text-ink hover:text-primary transition cursor-pointer disabled:cursor-not-allowed shrink-0"
                    >
                      {isAlreadyApplied ? (
                        <CheckCircle2 className="w-5 h-5 text-ink-soft/40" />
                      ) : isSelected ? (
                        <CheckSquare className="w-5 h-5 text-primary" />
                      ) : (
                        <Square className="w-5 h-5 text-ink-soft/50" />
                      )}
                    </button>

                    {/* Job Details */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-ink hover:text-primary transition truncate">
                              {job.title}
                            </h4>
                            {isAlreadyApplied && (
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-surface-alt text-ink-soft border border-border">
                                Already Applied
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft font-medium mt-0.5">
                            <span className="flex items-center gap-1 text-ink font-semibold">
                              <Building2 className="w-3.5 h-3.5 text-ink-soft" />
                              {job.company?.name || 'Company'}
                            </span>
                            {job.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-ink-soft" />
                                {job.location.city
                                  ? `${job.location.city}, ${job.location.country}`
                                  : job.location.country || 'Remote'}
                              </span>
                            )}
                            {job.salary?.max ? (
                              <span className="flex items-center gap-1 text-ink font-semibold">
                                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                                {job.salary.currency || 'INR'}{' '}
                                {job.salary.min ? `${job.salary.min.toLocaleString()} - ` : ''}
                                {job.salary.max.toLocaleString()} / {job.salary.period || 'yr'}
                              </span>
                            ) : null}
                          </div>
                        </div>

                        {/* Match Score Badge */}
                        <div className="flex items-center gap-1.5 shrink-0 self-start">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 ${
                              job.matchScore >= 85
                                ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20'
                                : job.matchScore >= 70
                                ? 'bg-primary/10 text-primary border border-primary/20'
                                : 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20'
                            }`}
                          >
                            <Sparkles className="w-3 h-3" />
                            {job.matchScore}% Match
                          </span>
                        </div>
                      </div>

                      {/* Skills match tags */}
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {job.matchedSkills && job.matchedSkills.length > 0 ? (
                            job.matchedSkills.slice(0, 5).map((skill) => (
                              <span
                                key={skill}
                                className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/15"
                              >
                                ✓ {skill}
                              </span>
                            ))
                          ) : (
                            job.skills.slice(0, 4).map((skill) => (
                              <span
                                key={skill}
                                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-surface-alt text-ink-soft border border-border"
                              >
                                {skill}
                              </span>
                            ))
                          )}
                          {job.skills.length > 5 && (
                            <span className="text-[11px] text-ink-soft font-medium pl-1">
                              +{job.skills.length - 5} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Expandable Match Reason Accordion */}
                      {isExpanded && (
                        <div className="pt-2 mt-2 border-t border-border text-xs space-y-2 text-ink-soft bg-surface-alt/40 p-3 rounded-xl">
                          {job.description && (
                            <p className="line-clamp-3 text-ink leading-relaxed">
                              {job.description}
                            </p>
                          )}
                          {job.matchReasons && job.matchReasons.length > 0 && (
                            <div className="space-y-1">
                              <span className="font-bold text-ink text-[11px] uppercase tracking-wider">
                                AI Match Analysis:
                              </span>
                              <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                                {job.matchReasons.map((reason, idx) => (
                                  <li key={idx}>{reason}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {job.missingSkills && job.missingSkills.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1 pt-1">
                              <span className="text-[11px] font-bold text-ink-soft">Missing skills:</span>
                              {job.missingSkills.slice(0, 4).map((s) => (
                                <span
                                  key={s}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-surface border border-border text-ink-soft"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-0.5">
                        <button
                          type="button"
                          onClick={() => setExpandedJobId(isExpanded ? null : String(job._id))}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:text-primary-glow transition cursor-pointer"
                        >
                          <span>{isExpanded ? 'Hide Details' : 'Why AI Matched This'}</span>
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>

                        <span className="text-[10px] font-semibold text-ink-soft uppercase">
                          {job.workplaceType || 'Remote'} · {job.employmentType || 'Full-Time'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* AI Autonomous Application Permission & Launch Card */}
      <div className="bg-surface border-2 border-primary-glow/30 rounded-2xl p-5 sm:p-6 space-y-4 shadow-elegant">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-ink">
              AI Autonomous Application Permission
            </h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              Our intelligent system applies to jobs in optimized batches with smart pacing
              to guarantee ATS deliverability and avoid portal spam filters.
            </p>
          </div>
        </div>

        {/* Benefits Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-surface-alt/70 border border-border/80 flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary shrink-0" />
            <span className="font-semibold text-ink">Automated Smart Batches</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-alt/70 border border-border/80 flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold text-ink">Anti-Spam Rate Control</span>
          </div>
          <div className="p-2.5 rounded-xl bg-surface-alt/70 border border-border/80 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary shrink-0" />
            <span className="font-semibold text-ink">Tailored ATS Submissions</span>
          </div>
        </div>

        {/* Permission Checkbox */}
        <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={permissionGranted}
              onChange={(e) => setPermissionGranted(e.target.checked)}
              className="w-4 h-4 mt-0.5 text-primary rounded border-border focus:ring-primary cursor-pointer shrink-0"
            />
            <span className="text-xs font-semibold text-ink leading-relaxed">
              I authorize ResumeBuildAI's Autonomous Agent to automatically apply to the{' '}
              <strong className="text-primary">{selectedCount} selected jobs</strong> in{' '}
              <strong className="text-primary">{totalBatches} batches (10 jobs / batch)</strong> on my behalf.
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          disabled={!permissionGranted || selectedCount === 0 || batchActionLoading}
          onClick={() => startBatchApply(10)}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-gradient-brand text-white font-black text-sm shadow-elegant hover:shadow-glow transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          {batchActionLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Launching Automated Batches...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-white" />
              <span>
                Grant Permission & Auto-Apply ({selectedCount} Jobs · {totalBatches} {totalBatches === 1 ? 'Batch' : 'Batches'})
              </span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
