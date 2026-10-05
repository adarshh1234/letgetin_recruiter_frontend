"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  FileCheck2,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Sparkles,
  ArrowRight,
  Loader2,
  Briefcase,
  Layers,
  ChevronRight,
  X,
  RotateCcw,
  Check,
  Award,
  AlertTriangle,
  GraduationCap,
  Building,
  Calendar,
  Phone,
  Mail,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";
import { HiringPipelineNavTabs } from "@/components/recruiter/HiringPipelineNavTabs";
import { recruiterService } from "@/features/recruiter/services/recruiterService";
import { JobsSidebar } from "@/features/recruiter/components/JobsSidebar";
import { resumeScreeningService } from "@/features/recruiter/services/resumeScreeningService";
import {
  ResumeDecision,
  ResumeScreeningCandidateItem,
  ResumeScreeningDetail,
  ResumeScreeningStats,
} from "@/features/recruiter/types/resumeScreening.types";
import { RecruiterJob } from "@/features/recruiter/types";

export default function ResumeScreeningPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramJobId = searchParams.get("jobId");

  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>(paramJobId || "");
  const [loadingJobs, setLoadingJobs] = useState(true);

  // Stats and candidate list from authoritative backend
  const [stats, setStats] = useState<ResumeScreeningStats | null>(null);
  const [candidates, setCandidates] = useState<ResumeScreeningCandidateItem[]>([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [totalCandidates, setTotalCandidates] = useState(0);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [decisionFilter, setDecisionFilter] = useState<ResumeDecision | "all">("all");
  const [minScoreFilter, setMinScoreFilter] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Drawer review state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [candidateDetail, setCandidateDetail] = useState<ResumeScreeningDetail | null>(null);
  const [drawerNotes, setDrawerNotes] = useState("");
  const [actionInProgress, setActionInProgress] = useState(false);

  // 1. Fetch recruiter jobs
  useEffect(() => {
    recruiterService
      .getMyJobs()
      .then((data) => {
        const jobList = data || [];
        setJobs(jobList);
        if (jobList.length > 0) {
          const matching = (paramJobId && jobList.find((j) => j._id === paramJobId)) || jobList[0];
          setSelectedJobId(matching._id);
        } else {
          setSelectedJobId("");
        }
      })
      .catch((err) => {
        console.error("Failed to load recruiter jobs:", err);
        toast.error("Failed to load your jobs");
      })
      .finally(() => setLoadingJobs(false));
  }, [paramJobId]);

  // Sync selected job with URL query param
  const handleSelectJob = (id: string) => {
    setSelectedJobId(id);
    setSelectedIds([]);
    setCurrentPage(1);
    router.replace(`/recruiter/hiring-pipeline/resume-screening?jobId=${id}`);
  };

  // 2. Fetch authoritative stats and candidate list for the job
  const loadJobData = useCallback(async () => {
    if (!selectedJobId) return;
    setLoadingCandidates(true);
    try {
      const [statsRes, listRes] = await Promise.all([
        resumeScreeningService.getStats(selectedJobId),
        resumeScreeningService.getCandidates(selectedJobId, {
          decision: decisionFilter,
          search: searchQuery.trim() || undefined,
          minScore: minScoreFilter,
          page: currentPage,
          limit: 20,
        }),
      ]);
      setStats(statsRes);
      setCandidates(listRes.candidates || []);
      setTotalCandidates(listRes.total || 0);
      setTotalPages(listRes.totalPages || 1);
    } catch (err: any) {
      console.error("Failed to fetch resume screening data:", err);
      toast.error(err?.response?.data?.message || err?.message || "Failed to load screening candidates.");
    } finally {
      setLoadingCandidates(false);
    }
  }, [selectedJobId, decisionFilter, searchQuery, minScoreFilter, currentPage]);

  useEffect(() => {
    loadJobData();
  }, [loadJobData]);

  // 3. Open Candidate Drawer & fetch full scorecard
  const handleOpenDrawer = async (applicationId: string) => {
    setSelectedCandidateId(applicationId);
    setDrawerOpen(true);
    setDrawerLoading(true);
    setDrawerNotes("");
    try {
      const detail = await resumeScreeningService.getApplicationDetail(applicationId);
      setCandidateDetail(detail);
      setDrawerNotes(detail.decisionNotes || "");
    } catch (err: any) {
      console.error("Error loading candidate evaluation detail:", err);
      toast.error("Failed to load detailed scorecard");
    } finally {
      setDrawerLoading(false);
    }
  };

  // 4. Record single recruiter decision
  const handleRecordDecision = async (
    applicationId: string,
    decision: "shortlisted" | "rejected" | "needs_review",
    notes?: string
  ) => {
    setActionInProgress(true);
    try {
      await resumeScreeningService.recordDecision(applicationId, {
        decision,
        notes: notes || drawerNotes,
      });

      const labelMap = {
        shortlisted: "Candidate Qualified & Shortlisted for Funnel",
        rejected: "Candidate Rejected at Resume Stage",
        needs_review: "Candidate Marked as Needs Review",
      };
      toast.success(labelMap[decision]);

      // Refresh authoritative data
      await loadJobData();

      if (drawerOpen && selectedCandidateId === applicationId) {
        // Update local drawer state
        setCandidateDetail((prev) =>
          prev
            ? {
                ...prev,
                decision,
                decisionNotes: notes || drawerNotes,
                decidedAt: new Date().toISOString(),
              }
            : null
        );
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to record decision.");
    } finally {
      setActionInProgress(false);
    }
  };

  // 5. Bulk Decisions
  const handleBulkDecision = async (decision: "shortlisted" | "rejected" | "needs_review") => {
    if (!selectedJobId || selectedIds.length === 0) return;
    setBulkActionLoading(true);
    try {
      const res = await resumeScreeningService.recordBulkDecision(selectedJobId, {
        applicationIds: selectedIds,
        decision,
      });
      toast.success(`Updated ${res.updatedCount} candidate(s) to ${decision.replace("_", " ")}`);
      setSelectedIds([]);
      await loadJobData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to process bulk decisions.");
    } finally {
      setBulkActionLoading(false);
    }
  };

  // Toggle select candidate for bulk actions
  const toggleSelectCandidate = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === candidates.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(candidates.map((c) => c.applicationId));
    }
  };

  const currentJob = useMemo(() => jobs.find((j) => j._id === selectedJobId), [jobs, selectedJobId]);

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-background">
      <JobsSidebar
        jobs={jobs}
        selectedJobId={selectedJobId}
        loadingJobs={loadingJobs}
        onSelectJob={handleSelectJob}
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-surface-alt/40">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="p-2 rounded-xl bg-primary/10 text-primary-glow border border-primary/20">
              <FileCheck2 className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black text-ink tracking-tight">Resume Shortlisting</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
              Qualification Layer
            </span>
          </div>
          <p className="text-xs text-ink-soft">
            Evaluate and shortlist qualified applicants before dynamic hiring rounds begin. Only candidates with status{" "}
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">Resume Shortlisted</span> enter the Hiring Engine.
          </p>
        </div>

        {/* Job Selector */}
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-ink-soft shrink-0" />
          <select
            id="jobSelector"
            value={selectedJobId}
            onChange={(e) => handleSelectJob(e.target.value)}
            disabled={loadingJobs}
            className="text-xs font-bold text-ink bg-surface border border-border/80 rounded-xl px-3 py-2 shadow-xs focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer min-w-[240px]"
          >
            {loadingJobs ? (
              <option>Loading your jobs...</option>
            ) : jobs.length === 0 ? (
              <option value="">No active jobs posted</option>
            ) : (
              jobs.map((job) => (
                <option key={job._id} value={job._id}>
                  {job.title} ({job.recruiterStage || job.status || "active"})
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {/* Navigation Tabs (Resume Screening -> Timeline -> Kanban -> Candidates) */}
      <HiringPipelineNavTabs jobId={selectedJobId} />

      {/* Authoritative Funnel Readiness Alert Banner */}
      {stats && (
        <div
          className={`mb-6 p-4 rounded-2xl border transition-all ${
            stats.isFunnelStarted
              ? "bg-indigo-50/70 dark:bg-indigo-950/20 border-indigo-200/80 dark:border-indigo-800/40"
              : stats.isReadyForFunnel
              ? "bg-emerald-50/70 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-800/40"
              : "bg-amber-50/70 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-800/40"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-xl mt-0.5 ${
                  stats.isFunnelStarted
                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                    : stats.isReadyForFunnel
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                }`}
              >
                {stats.isFunnelStarted ? (
                  <Layers className="w-5 h-5" />
                ) : stats.isReadyForFunnel ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-ink">
                    {stats.isFunnelStarted
                      ? "Hiring Funnel Currently In Progress"
                      : stats.isReadyForFunnel
                      ? "Funnel Intake Quota Met - Ready to Launch"
                      : "Collecting & Shortlisting Qualified Applicants"}
                  </h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      stats.isFunnelStarted
                        ? "bg-indigo-200/60 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                        : stats.isReadyForFunnel
                        ? "bg-emerald-200/60 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200"
                        : "bg-amber-200/60 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                    }`}
                  >
                    Collection: {stats.collectionStatus.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-ink-soft mt-1">
                  Authoritative Qualified Count:{" "}
                  <strong className="text-ink font-semibold">
                    {stats.actualQualifiedCount} candidate{stats.actualQualifiedCount !== 1 ? "s" : ""}
                  </strong>{" "}
                  qualified (Minimum Required: {stats.minimumIntakeRequired} • Ideal Target: {stats.idealIntakeTarget}).
                  {!stats.isFunnelStarted && !stats.isReadyForFunnel && (
                    <span className="text-amber-700 dark:text-amber-400 font-medium ml-1">
                      (Shortlist at least {Math.max(0, stats.minimumIntakeRequired - stats.actualQualifiedCount)} more to proceed)
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/recruiter/hiring-pipeline/timeline?jobId=${selectedJobId}`}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-surface text-ink border border-border/80 hover:bg-surface-alt shadow-xs transition-all"
              >
                <span>View Hiring Timeline</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Authoritative Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        <div className="p-3.5 rounded-2xl bg-surface border border-border/80 shadow-xs">
          <span className="text-[11px] font-bold text-ink-soft block uppercase tracking-wider">Total Applied</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-ink">{stats?.totalApplications ?? "-"}</span>
            <span className="text-[11px] text-ink-soft">applicants</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface border border-border/80 shadow-xs">
          <span className="text-[11px] font-bold text-ink-soft block uppercase tracking-wider">Pending Review</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-slate-700 dark:text-slate-200">{stats?.pendingReview ?? "-"}</span>
            <span className="text-[11px] text-slate-500">awaiting</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-surface border border-border/80 shadow-xs">
          <span className="text-[11px] font-bold text-ink-soft block uppercase tracking-wider">AI Evaluated</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-primary-glow">{stats?.aiReviewed ?? "-"}</span>
            <span className="text-[11px] text-primary/70">scorecards</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block uppercase tracking-wider">
              Resume Shortlisted
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-1">
            <span className="text-xl font-black text-emerald-700 dark:text-emerald-400">{stats?.shortlisted ?? "-"}</span>
            <span className="text-[10px] font-bold text-emerald-600/80 uppercase">Qualified</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300 block uppercase tracking-wider">
              Needs Review
            </span>
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-amber-700 dark:text-amber-400">{stats?.needsReview ?? "-"}</span>
            <span className="text-[11px] text-amber-600/80">flagged</span>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/50 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-rose-800 dark:text-rose-300 block uppercase tracking-wider">
              Rejected
            </span>
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black text-rose-700 dark:text-rose-400">{stats?.rejected ?? "-"}</span>
            <span className="text-[11px] text-rose-600/80">disqualified</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-surface border border-border/80 rounded-2xl p-4 shadow-xs mb-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Decision Status Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-surface-alt rounded-xl w-fit max-w-full overflow-x-auto">
            {(
              [
                { key: "all", label: "All Applicants" },
                { key: "pending", label: "Pending Review" },
                { key: "shortlisted", label: "Shortlisted (Qualified)" },
                { key: "needs_review", label: "Needs Review" },
                { key: "rejected", label: "Rejected" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setDecisionFilter(tab.key);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  decisionFilter === tab.key
                    ? "bg-surface text-ink shadow-xs"
                    : "text-ink-soft hover:text-ink hover:bg-surface/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-ink-soft absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search candidate name or skill..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full text-xs bg-surface border border-border/80 rounded-xl pl-9 pr-4 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-ink-soft"
            />
          </div>
        </div>
      </div>

      {/* Floating Bulk Action Bar when candidates are selected */}
      {selectedIds.length > 0 && (
        <div className="sticky top-4 z-20 mb-4 flex items-center justify-between gap-4 p-3 bg-ink text-surface rounded-2xl shadow-lg border border-border/20 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/20 text-white">
              {selectedIds.length} candidate{selectedIds.length > 1 ? "s" : ""} selected
            </span>
            <span className="text-xs text-slate-300 hidden sm:inline">Apply bulk decision across selection:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={bulkActionLoading}
              onClick={() => handleBulkDecision("shortlisted")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Shortlist (Qualify)</span>
            </button>
            <button
              type="button"
              disabled={bulkActionLoading}
              onClick={() => handleBulkDecision("needs_review")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white transition-all disabled:opacity-50"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Needs Review</span>
            </button>
            <button
              type="button"
              disabled={bulkActionLoading}
              onClick={() => handleBulkDecision("rejected")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all disabled:opacity-50"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reject</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Candidate Table */}
      <div className="bg-surface border border-border/80 rounded-2xl overflow-hidden shadow-xs">
        {loadingCandidates ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
            <span className="text-xs font-medium text-ink-soft">Loading screening candidates...</span>
          </div>
        ) : candidates.length === 0 ? (
          <div className="py-20 text-center px-4">
            <FileCheck2 className="w-10 h-10 text-ink-soft mx-auto mb-3 opacity-40" />
            <h3 className="text-sm font-bold text-ink">No candidates match the filter criteria</h3>
            <p className="text-xs text-ink-soft mt-1">
              {decisionFilter !== "all"
                ? `No candidates with decision status '${decisionFilter}' found.`
                : "No applications submitted for this job yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/80 bg-surface-alt/40 text-[11px] font-bold text-ink-soft uppercase tracking-wider">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={selectedIds.length === candidates.length && candidates.length > 0}
                      onChange={toggleSelectAll}
                      className="rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">AI Score & Rec</th>
                  <th className="py-3 px-4">Key Skills Match</th>
                  <th className="py-3 px-4">Decision Status</th>
                  <th className="py-3 px-4 text-right">Recruiter Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-xs">
                {candidates.map((cand) => {
                  const evalData = cand.evaluation;
                  const score = cand.matchScore || evalData?.overallScore || 0;
                  const rec = evalData?.recommendation || (score >= 75 ? "strong_match" : score >= 50 ? "potential_match" : "not_recommended");

                  const isShortlisted = cand.decision === "shortlisted";
                  const isRejected = cand.decision === "rejected";
                  const isNeedsReview = cand.decision === "needs_review";

                  return (
                    <tr
                      key={cand.applicationId}
                      className={`hover:bg-surface-alt/50 transition-colors ${
                        selectedIds.includes(cand.applicationId) ? "bg-primary/5" : ""
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(cand.applicationId)}
                          onChange={() => toggleSelectCandidate(cand.applicationId)}
                          className="rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                        />
                      </td>

                      {/* Candidate Column */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-surface-alt border border-border/80 flex items-center justify-center font-bold text-ink text-xs shrink-0 overflow-hidden">
                            {cand.candidate.avatarUrl ? (
                              <img src={cand.candidate.avatarUrl} alt={cand.candidate.fullName || "Candidate"} className="w-full h-full object-cover" />
                            ) : (
                              (cand.candidate.fullName || cand.candidate.username || "C").charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-ink hover:text-primary transition-colors cursor-pointer" onClick={() => handleOpenDrawer(cand.applicationId)}>
                              {cand.candidate.fullName || cand.candidate.username || "Candidate"}
                            </div>
                            <div className="text-[11px] text-ink-soft">
                              {cand.candidate.email || "No email provided"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* AI Score & Recommendation */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded-lg text-xs font-black ${
                              score >= 75
                                ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                                : score >= 50
                                ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                                : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                            }`}
                          >
                            {score}%
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              rec === "strong_match"
                                ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
                                : rec === "potential_match"
                                ? "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"
                                : "bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300"
                            }`}
                          >
                            {rec === "strong_match"
                              ? "Strong Match"
                              : rec === "potential_match"
                              ? "Potential Match"
                              : "Not Recommended"}
                          </span>
                        </div>
                      </td>

                      {/* Key Skills Match */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="flex flex-wrap gap-1">
                          {(evalData?.matchedSkills || []).slice(0, 3).map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20"
                            >
                              ✓ {skill}
                            </span>
                          ))}
                          {(evalData?.missingSkills || []).slice(0, 2).map((skill, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20"
                            >
                              ✗ {skill}
                            </span>
                          ))}
                          {(!evalData?.matchedSkills || evalData.matchedSkills.length === 0) && (
                            <span className="text-[11px] text-ink-soft italic">Pending evaluation</span>
                          )}
                        </div>
                      </td>

                      {/* Current Decision Status Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            isShortlisted
                              ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                              : isNeedsReview
                              ? "bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800"
                              : isRejected
                              ? "bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700"
                          }`}
                        >
                          {isShortlisted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          {isNeedsReview && <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
                          {isRejected && <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                          {!isShortlisted && !isNeedsReview && !isRejected && <Sparkles className="w-3.5 h-3.5 text-slate-500" />}
                          <span>
                            {isShortlisted
                              ? "Resume Shortlisted (Qualified)"
                              : isNeedsReview
                              ? "Needs Review"
                              : isRejected
                              ? "Rejected"
                              : "Pending Decision"}
                          </span>
                        </span>
                      </td>

                      {/* Recruiter 1-Click Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1-Click Shortlist */}
                          <button
                            type="button"
                            title="Shortlist (Qualify for Hiring Engine)"
                            disabled={actionInProgress || isShortlisted}
                            onClick={() => handleRecordDecision(cand.applicationId, "shortlisted")}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isShortlisted
                                ? "bg-emerald-100 text-emerald-700 border-emerald-300 cursor-default opacity-80"
                                : "hover:bg-emerald-50 text-emerald-600 border-border/80 hover:border-emerald-400"
                            }`}
                          >
                            <Check className="w-4 h-4" />
                          </button>

                          {/* 1-Click Needs Review */}
                          <button
                            type="button"
                            title="Mark as Needs Review"
                            disabled={actionInProgress || isNeedsReview}
                            onClick={() => handleRecordDecision(cand.applicationId, "needs_review")}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isNeedsReview
                                ? "bg-amber-100 text-amber-700 border-amber-300 cursor-default opacity-80"
                                : "hover:bg-amber-50 text-amber-600 border-border/80 hover:border-amber-400"
                            }`}
                          >
                            <AlertCircle className="w-4 h-4" />
                          </button>

                          {/* 1-Click Reject */}
                          <button
                            type="button"
                            title="Reject Candidate"
                            disabled={actionInProgress || isRejected}
                            onClick={() => handleRecordDecision(cand.applicationId, "rejected")}
                            className={`p-1.5 rounded-lg border transition-all ${
                              isRejected
                                ? "bg-rose-100 text-rose-700 border-rose-300 cursor-default opacity-80"
                                : "hover:bg-rose-50 text-rose-600 border-border/80 hover:border-rose-400"
                            }`}
                          >
                            <X className="w-4 h-4" />
                          </button>

                          {/* View Full Scorecard Drawer */}
                          <button
                            type="button"
                            onClick={() => handleOpenDrawer(cand.applicationId)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-surface-alt hover:bg-surface border border-border/80 text-ink transition-all ml-1 shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5 text-ink-soft" />
                            <span>Scorecard</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Server-side Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-border/80 flex items-center justify-between text-xs text-ink-soft">
            <span>
              Showing {candidates.length} of {totalCandidates} applicants
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 rounded-lg border border-border/80 font-bold hover:bg-surface-alt disabled:opacity-40 transition-all"
              >
                Previous
              </button>
              <span className="font-semibold text-ink">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1.5 rounded-lg border border-border/80 font-bold hover:bg-surface-alt disabled:opacity-40 transition-all"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Candidate Scorecard & Resume Detail Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-surface h-full shadow-2xl flex flex-col border-l border-border animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-primary/10 text-primary-glow border border-primary/20">
                  <FileCheck2 className="w-5 h-5" />
                </span>
                <div>
                  <h2 className="text-base font-bold text-ink">Resume Screening Scorecard</h2>
                  <p className="text-xs text-ink-soft">
                    Detailed AI evaluation breakdown & original parsed resume
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-lg hover:bg-surface-alt text-ink-soft hover:text-ink transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {drawerLoading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  <span className="text-xs text-ink-soft">Loading candidate evaluation...</span>
                </div>
              ) : candidateDetail ? (
                <>
                  {/* Candidate Bio Card */}
                  <div className="p-4 rounded-2xl bg-surface-alt/60 border border-border flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-lg font-black text-primary-glow shrink-0">
                        {(candidateDetail.candidate.fullName || "C").charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-ink">
                          {candidateDetail.candidate.fullName || candidateDetail.candidate.username}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-ink-soft mt-1">
                          {candidateDetail.candidate.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3.5 h-3.5" />
                              {candidateDetail.candidate.email}
                            </span>
                          )}
                          {candidateDetail.candidate.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5" />
                              {candidateDetail.candidate.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Current Decision Tag */}
                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase text-ink-soft block mb-1">Current Status</span>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                          candidateDetail.decision === "shortlisted"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                            : candidateDetail.decision === "needs_review"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                            : candidateDetail.decision === "rejected"
                            ? "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                            : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {candidateDetail.decision.toUpperCase().replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {/* AI Structured Evaluation Scorecard */}
                  {candidateDetail.evaluation ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-primary-glow" />
                          <span>Structured AI Evaluation Scorecard</span>
                        </h4>
                        <span className="text-[11px] text-ink-soft">
                          Evaluated: {new Date(candidateDetail.evaluation.evaluatedAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Score Metrics Grid */}
                      {candidateDetail.evaluation.breakdown ? (
                        <div className="space-y-2.5">
                          <div className="p-3.5 rounded-xl bg-surface border border-border flex items-center justify-between shadow-xs">
                            <span className="text-xs font-bold text-ink uppercase tracking-wider">Canonical Match</span>
                            <span className="text-2xl font-black text-primary-glow">
                              {candidateDetail.evaluation.overallScore}%
                            </span>
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            <div className="p-2.5 rounded-xl bg-surface border border-border text-center shadow-xs">
                              <span className="text-[10px] font-bold text-ink-soft uppercase block">Required Skills</span>
                              <span className="text-base font-bold text-emerald-600 mt-0.5 block">
                                {candidateDetail.evaluation.breakdown.requiredSkillsScore}%
                              </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-surface border border-border text-center shadow-xs">
                              <span className="text-[10px] font-bold text-ink-soft uppercase block">Preferred Skills</span>
                              <span className="text-base font-bold text-teal-600 mt-0.5 block">
                                {candidateDetail.evaluation.breakdown.preferredSkillsScore}%
                              </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-surface border border-border text-center shadow-xs">
                              <span className="text-[10px] font-bold text-ink-soft uppercase block">Experience</span>
                              <span className="text-base font-bold text-indigo-600 mt-0.5 block">
                                {candidateDetail.evaluation.breakdown.experienceScore}%
                              </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-surface border border-border text-center shadow-xs">
                              <span className="text-[10px] font-bold text-ink-soft uppercase block">Education</span>
                              <span className="text-base font-bold text-blue-600 mt-0.5 block">
                                {candidateDetail.evaluation.breakdown.educationScore}%
                              </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-surface border border-border text-center shadow-xs">
                              <span className="text-[10px] font-bold text-ink-soft uppercase block">Semantic Match</span>
                              <span className="text-base font-bold text-purple-600 mt-0.5 block">
                                {candidateDetail.evaluation.breakdown.semanticScore}%
                              </span>
                            </div>
                            <div className="p-2.5 rounded-xl bg-surface border border-border text-center shadow-xs">
                              <span className="text-[10px] font-bold text-ink-soft uppercase block">Role Relevance</span>
                              <span className="text-base font-bold text-amber-600 mt-0.5 block">
                                {candidateDetail.evaluation.breakdown.roleRelevanceScore}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3.5 rounded-xl bg-surface border border-border text-center shadow-xs">
                            <span className="text-[10px] font-bold text-ink-soft uppercase block">Overall Match</span>
                            <span className="text-2xl font-black text-primary-glow mt-0.5 block">
                              {candidateDetail.evaluation.overallScore}%
                            </span>
                          </div>
                          <div className="p-3.5 rounded-xl bg-surface border border-border text-center shadow-xs">
                            <span className="text-[10px] font-bold text-ink-soft uppercase block">Skills Match</span>
                            <span className="text-2xl font-black text-emerald-600 mt-0.5 block">
                              {candidateDetail.evaluation.skillsMatchScore}%
                            </span>
                          </div>
                          <div className="p-3.5 rounded-xl bg-surface border border-border text-center shadow-xs">
                            <span className="text-[10px] font-bold text-ink-soft uppercase block">Experience Match</span>
                            <span className="text-2xl font-black text-indigo-600 mt-0.5 block">
                              {candidateDetail.evaluation.experienceMatchScore}%
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Strengths & Weaknesses */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50">
                          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block mb-2 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Key Strengths
                          </span>
                          <ul className="space-y-1.5 text-xs text-ink/80 list-disc list-inside">
                            {candidateDetail.evaluation.strengths.map((str, idx) => (
                              <li key={idx}>{str}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="p-4 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50">
                          <span className="text-xs font-bold text-rose-800 dark:text-rose-300 block mb-2 flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" /> Areas to Probe / Gaps
                          </span>
                          <ul className="space-y-1.5 text-xs text-ink/80 list-disc list-inside">
                            {candidateDetail.evaluation.weaknesses.map((weak, idx) => (
                              <li key={idx}>{weak}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Matched vs Missing Skills breakdown */}
                      <div className="space-y-2 p-4 rounded-xl bg-surface border border-border">
                        <div>
                          <span className="text-xs font-bold text-ink block mb-1.5">Matched Required Skills</span>
                          <div className="flex flex-wrap gap-1.5">
                            {candidateDetail.evaluation.matchedSkills.map((s, idx) => (
                              <span
                                key={idx}
                                className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                              >
                                ✓ {s}
                              </span>
                            ))}
                            {candidateDetail.evaluation.matchedSkills.length === 0 && (
                              <span className="text-xs text-ink-soft italic">No direct required skills matched</span>
                            )}
                          </div>
                        </div>

                        {candidateDetail.evaluation.matchedPreferredSkills && candidateDetail.evaluation.matchedPreferredSkills.length > 0 && (
                          <div className="pt-2">
                            <span className="text-xs font-bold text-ink block mb-1.5">Matched Preferred Skills</span>
                            <div className="flex flex-wrap gap-1.5">
                              {candidateDetail.evaluation.matchedPreferredSkills.map((s, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/20"
                                >
                                  ★ {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="pt-2">
                          <span className="text-xs font-bold text-ink block mb-1.5">Missing Core Skills</span>
                          <div className="flex flex-wrap gap-1.5">
                            {candidateDetail.evaluation.missingSkills.map((s, idx) => (
                              <span
                                key={idx}
                                className="text-xs font-semibold px-2.5 py-0.5 rounded-md bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20"
                              >
                                ✗ {s}
                              </span>
                            ))}
                            {candidateDetail.evaluation.missingSkills.length === 0 && (
                              <span className="text-xs text-emerald-600 font-medium">All core job skills present</span>
                            )}
                          </div>
                        </div>

                        {candidateDetail.evaluation.explanations && candidateDetail.evaluation.explanations.length > 0 && (
                          <div className="pt-3 border-t border-border mt-3">
                            <span className="text-xs font-bold text-ink block mb-1.5">Evaluation Explanations</span>
                            <ul className="space-y-1 text-xs text-ink-soft">
                              {candidateDetail.evaluation.explanations.map((exp, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <span className="text-primary-glow font-bold">•</span>
                                  <span>{exp}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 rounded-2xl bg-surface-alt border border-border text-center">
                      <Sparkles className="w-8 h-8 text-primary mx-auto mb-2 opacity-50" />
                      <p className="text-xs text-ink-soft">AI scorecard not yet generated for this candidate.</p>
                      <button
                        type="button"
                        onClick={() => candidateDetail && resumeScreeningService.evaluateResume(candidateDetail.applicationId).then(loadJobData)}
                        className="mt-3 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-primary text-white hover:bg-primary-glow transition-all"
                      >
                        Generate Scorecard Now
                      </button>
                    </div>
                  )}

                  {/* Parsed Resume Content Section */}
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-ink-soft" />
                      <span>Parsed Resume Content</span>
                    </h4>

                    {candidateDetail.resume?.content ? (
                      <div className="space-y-4 p-4 rounded-xl bg-surface border border-border">
                        {candidateDetail.resume.content.summary && (
                          <div>
                            <span className="text-xs font-bold text-ink block mb-1">Executive Summary</span>
                            <p className="text-xs text-ink-soft leading-relaxed">
                              {candidateDetail.resume.content.summary}
                            </p>
                          </div>
                        )}

                        {candidateDetail.resume.content.experience && candidateDetail.resume.content.experience.length > 0 && (
                          <div className="space-y-2 pt-2 border-t border-border/60">
                            <span className="text-xs font-bold text-ink block mb-1">Work History</span>
                            {candidateDetail.resume.content.experience.map((exp, idx) => (
                              <div key={idx} className="text-xs p-2.5 rounded-lg bg-surface-alt/50 border border-border/50">
                                <div className="font-bold text-ink flex items-center justify-between">
                                  <span>{exp.title}</span>
                                  <span className="text-[11px] text-ink-soft">{exp.duration || exp.startDate}</span>
                                </div>
                                <div className="text-[11px] text-primary/80 font-medium">{exp.company}</div>
                                {exp.description && <p className="text-ink-soft mt-1 line-clamp-2">{exp.description}</p>}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-surface-alt border border-border text-center text-xs text-ink-soft">
                        Resume parsed text details unavailable.
                      </div>
                    )}
                  </div>

                  {/* Decision Notes Input */}
                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-bold text-ink block">Recruiter Decision Notes</label>
                    <textarea
                      rows={3}
                      placeholder="Add qualification review notes or rationale..."
                      value={drawerNotes}
                      onChange={(e) => setDrawerNotes(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl bg-surface border border-border focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-ink-soft"
                    />
                  </div>
                </>
              ) : null}
            </div>

            {/* Drawer Action Bar */}
            {candidateDetail && (
              <div className="p-4 border-t border-border bg-surface flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={actionInProgress}
                  onClick={() => handleRecordDecision(candidateDetail.applicationId, "rejected", drawerNotes)}
                  className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-all text-center disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  type="button"
                  disabled={actionInProgress}
                  onClick={() => handleRecordDecision(candidateDetail.applicationId, "needs_review", drawerNotes)}
                  className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-all text-center disabled:opacity-50"
                >
                  Needs Review
                </button>
                <button
                  type="button"
                  disabled={actionInProgress}
                  onClick={() => handleRecordDecision(candidateDetail.applicationId, "shortlisted", drawerNotes)}
                  className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all text-center shadow-xs disabled:opacity-50"
                >
                  Shortlist (Qualify)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
