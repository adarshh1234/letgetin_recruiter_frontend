"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Award,
  Search,
  Filter,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  UserX,
  Send,
  PauseCircle,
  Eye,
  Briefcase,
  Layers,
  Sparkles,
  Sliders,
  Brain,
  FileText,
  UserCheck,
  ChevronRight,
  ShieldCheck,
  X,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Loader2,
  Check,
  FileBadge,
  User,
  History,
} from "lucide-react";
import { toast } from "sonner";
import { HiringPipelineNavTabs } from "@/components/recruiter/HiringPipelineNavTabs";
import { JobsSidebar } from "@/features/recruiter/components/JobsSidebar";
import { hiringEngineService } from "@/features/hiringEngine/services/hiringEngineService";
import { recruiterService } from "@/features/recruiter/services/recruiterService";
import {
  IFinalShortlistResponse,
  IFinalistCandidate,
  FinalDecision,
} from "@/features/hiringEngine/types/hiringEngine.types";
import { RecruiterJob } from "@/features/recruiter/types";

export default function FinalShortlistPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlJobId = searchParams.get("jobId");

  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>(urlJobId || "");
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingReport, setLoadingReport] = useState(false);
  const [report, setReport] = useState<IFinalShortlistResponse | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | FinalDecision>("all");

  // Review Drawer & Decision Modal
  const [selectedCandidate, setSelectedCandidate] = useState<IFinalistCandidate | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [decisionModal, setDecisionModal] = useState<{
    isOpen: boolean;
    candidate: IFinalistCandidate | null;
    decision: "offered" | "on_hold" | "rejected" | null;
    notes: string;
    submitting: boolean;
  }>({
    isOpen: false,
    candidate: null,
    decision: null,
    notes: "",
    submitting: false,
  });

  // Load recruiter jobs
  useEffect(() => {
    async function loadJobs() {
      try {
        setLoadingJobs(true);
        const jobList = await recruiterService.getMyJobs();
        setJobs(jobList || []);

        if (!selectedJobId && jobList.length > 0) {
          const firstJobId = jobList[0]._id;
          setSelectedJobId(firstJobId);
          router.replace(`/recruiter/hiring-pipeline/final-shortlist?jobId=${firstJobId}`);
        }
      } catch (err: any) {
        toast.error("Failed to load recruiter jobs.");
      } finally {
        setLoadingJobs(false);
      }
    }
    loadJobs();
  }, [router, selectedJobId]);

  // Load Final Shortlist data for selected job
  const loadFinalShortlistData = useCallback(async () => {
    if (!selectedJobId) return;
    try {
      setLoadingReport(true);
      const data = await hiringEngineService.getFinalShortlist(selectedJobId);
      setReport(data);
    } catch (err: any) {
      const isNotFound =
        err?.response?.status === 404 ||
        err?.statusCode === 404 ||
        err?.status === 404 ||
        err?.error?.code === "NOT_FOUND";

      if (isNotFound) {
        setReport(null);
      } else {
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Failed to load final shortlist candidates."
        );
      }
    } finally {
      setLoadingReport(false);
    }
  }, [selectedJobId]);

  useEffect(() => {
    loadFinalShortlistData();
  }, [loadFinalShortlistData]);

  const handleSelectJob = (newJobId: string) => {
    setSelectedJobId(newJobId);
    router.push(`/recruiter/hiring-pipeline/final-shortlist?jobId=${newJobId}`);
  };

  const selectedJob = jobs.find((j) => j._id === selectedJobId);

  // Open Decision Dialog
  const handleOpenDecisionModal = (
    candidate: IFinalistCandidate,
    decision: "offered" | "on_hold" | "rejected"
  ) => {
    setDecisionModal({
      isOpen: true,
      candidate,
      decision,
      notes: "",
      submitting: false,
    });
  };

  // Submit Final Decision
  const handleConfirmDecision = async () => {
    if (!decisionModal.candidate || !decisionModal.decision || !selectedJobId) return;
    try {
      setDecisionModal((prev) => ({ ...prev, submitting: true }));
      await hiringEngineService.recordFinalDecision(
        selectedJobId,
        decisionModal.candidate.applicationId,
        {
          decision: decisionModal.decision,
          notes: decisionModal.notes,
        }
      );

      const decisionLabels: Record<string, string> = {
        offered: "Formal job offer extended to candidate",
        on_hold: "Candidate placed on hold",
        rejected: "Candidate rejected from final consideration",
      };

      toast.success(decisionLabels[decisionModal.decision] || "Decision updated successfully.");
      setDecisionModal({ isOpen: false, candidate: null, decision: null, notes: "", submitting: false });

      // If drawer was open for this candidate, close or refresh
      if (selectedCandidate?.applicationId === decisionModal.candidate.applicationId) {
        setIsDrawerOpen(false);
      }

      await loadFinalShortlistData();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to record final decision."
      );
      setDecisionModal((prev) => ({ ...prev, submitting: false }));
    }
  };

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    if (!report?.candidates) return [];
    return report.candidates.filter((c) => {
      const name = c.candidate?.fullName || c.candidate?.username || "";
      const email = c.candidate?.email || "";
      const title = c.resume?.title || "";

      const matchesSearch =
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        title.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ? true : c.finalShortlistDecision === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [report?.candidates, searchQuery, statusFilter]);

  const target = report?.finalShortlistTarget || 1;
  const currentCount = report?.currentShortlistedCount || 0;
  const targetPercent = Math.min(100, Math.round((currentCount / target) * 100));

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-background">
      {/* Unified Left Sidebar for all Jobs & Sub-menus */}
      <JobsSidebar
        jobs={jobs}
        selectedJobId={selectedJobId}
        loadingJobs={loadingJobs}
        onSelectJob={handleSelectJob}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Hiring Pipeline Universal Navigation */}
        <HiringPipelineNavTabs jobId={selectedJobId} />

      {/* Top Header & Job Switcher */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 text-xs text-ink-soft mb-1.5">
            <span>Recruiter</span>
            <ChevronRight className="w-3 h-3 text-ink-soft/60" />
            <span>Hiring Pipeline</span>
            <ChevronRight className="w-3 h-3 text-ink-soft/60" />
            <span className="font-semibold text-primary">Final Shortlist</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight flex items-center gap-2.5">
              <Award className="w-7 h-7 text-purple-600" />
              <span>Final Shortlist</span>
            </h1>

            {report && (
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-purple-500/10 text-purple-600 border border-purple-500/20">
                {currentCount} / {target} Final Target
              </span>
            )}
          </div>
          <p className="text-xs text-ink-soft mt-1">
            Authoritative decision dashboard for candidates who passed all configured dynamic funnel stages.
          </p>
        </div>

        {/* Job Selector & Refresh Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={selectedJobId}
              onChange={(e) => handleSelectJob(e.target.value)}
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

          <button
            type="button"
            onClick={loadFinalShortlistData}
            disabled={loadingReport || !selectedJobId}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-alt text-xs font-semibold text-ink shadow-xs transition disabled:opacity-50"
            title="Refresh final shortlist"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-ink-soft ${loadingReport ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      {report && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3.5 rounded-2xl bg-surface border border-border shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-purple-600" />
              Finalists
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-ink">{report.stats.totalFinalists}</span>
              <span className="text-[11px] text-ink-soft">/ {target} target</span>
            </div>
            <div className="w-full bg-border/60 h-1.5 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${targetPercent}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface border border-border shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              Pending Review
            </span>
            <div className="text-xl font-extrabold text-blue-600">{report.stats.pendingReview}</div>
            <p className="text-[10px] text-ink-soft">Awaiting recruiter action</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface border border-border shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-purple-600" />
              Offers Sent
            </span>
            <div className="text-xl font-extrabold text-purple-600">{report.stats.offersSent}</div>
            <p className="text-[10px] text-ink-soft">Offer extended to candidate</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface border border-border shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider flex items-center gap-1.5">
              <PauseCircle className="w-3.5 h-3.5 text-amber-600" />
              On Hold
            </span>
            <div className="text-xl font-extrabold text-amber-600">{report.stats.onHold}</div>
            <p className="text-[10px] text-ink-soft">Paused for evaluation</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface border border-border shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider flex items-center gap-1.5">
              <UserX className="w-3.5 h-3.5 text-rose-600" />
              Rejected
            </span>
            <div className="text-xl font-extrabold text-rose-600">{report.stats.rejected}</div>
            <p className="text-[10px] text-ink-soft">Declined in final round</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface border border-border shadow-xs space-y-1">
            <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Hired
            </span>
            <div className="text-xl font-extrabold text-emerald-600">{report.stats.hired}</div>
            <p className="text-[10px] text-ink-soft">Offer accepted & hired</p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-surface border border-border rounded-2xl shadow-xs">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {[
            { key: "all", label: "All Finalists" },
            { key: "pending", label: "Pending Review" },
            { key: "offered", label: "Offers Sent" },
            { key: "on_hold", label: "On Hold" },
            { key: "rejected", label: "Rejected" },
            { key: "hired", label: "Hired" },
          ].map((tab) => {
            const isActive = statusFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-ink-soft hover:text-ink hover:bg-surface-alt"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search finalist by name, role, email..."
            className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-surface-alt/60 border border-border rounded-xl text-ink placeholder:text-ink-soft/70 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {loadingJobs || loadingReport ? (
        <div className="p-16 text-center space-y-3 bg-surface border border-border rounded-2xl shadow-xs">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-xs font-semibold text-ink-soft">Loading verified finalists and stage scores...</p>
        </div>
      ) : !report ? (
        <div className="p-12 text-center space-y-4 bg-surface border border-dashed border-border rounded-2xl shadow-xs max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center mx-auto border border-purple-500/20">
            <Award className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-ink">No Hiring Pipeline Configured</h3>
            <p className="text-xs text-ink-soft max-w-md mx-auto">
              This job requisition does not have an active hiring pipeline yet. Configure stages on the timeline or Kanban board to start funnel progression.
            </p>
          </div>
          <Link
            href={`/recruiter/hiring-pipeline/timeline?jobId=${selectedJobId}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 transition"
          >
            <span>Configure Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="p-12 text-center space-y-3 bg-surface border border-dashed border-border rounded-2xl shadow-xs max-w-xl mx-auto">
          <Award className="w-10 h-10 text-ink-soft mx-auto" />
          <h3 className="text-base font-extrabold text-ink">No Finalists Found</h3>
          <p className="text-xs text-ink-soft max-w-md mx-auto">
            {report.candidates.length === 0
              ? "No candidates have completed the final stage of the funnel yet. Once candidates pass the final stage, they will appear here for recruiter review and offer extension."
              : "No candidates match the current status filter or search query."}
          </p>
          {report.candidates.length === 0 && (
            <Link
              href={`/recruiter/hiring-pipeline/kanban?jobId=${selectedJobId}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-alt hover:bg-surface border border-border text-xs font-bold text-ink shadow-xs transition"
            >
              <span>Inspect Kanban Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      ) : (
        /* Finalist Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCandidates.map((candidate) => {
            const user = candidate.candidate;
            const name = user.fullName || user.username || "Candidate";
            const email = user.email;
            const phone = user.phone;
            const resume = candidate.resume;
            const decision = candidate.finalShortlistDecision || "pending";

            return (
              <div
                key={candidate.applicationId}
                className="bg-surface border border-border hover:border-primary/40 rounded-2xl p-5 shadow-xs transition-all hover:shadow-md flex flex-col justify-between space-y-4 group"
              >
                {/* Header & Badges */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-extrabold text-sm border border-purple-500/20 shrink-0">
                        {(name?.[0] || "C").toUpperCase()}
                      </div>
                      <div className="truncate">
                        <h3 className="text-sm font-extrabold text-ink truncate group-hover:text-primary transition-colors">
                          {name}
                        </h3>
                        <p className="text-xs text-ink-soft truncate">{resume?.title || "Candidate Profile"}</p>
                      </div>
                    </div>

                    {/* Decision State Badge */}
                    <FinalDecisionBadge decision={decision} />
                  </div>

                  {/* Contact Info Snippet */}
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-ink-soft pt-1">
                    {email && (
                      <span className="flex items-center gap-1 truncate max-w-[170px]" title={email}>
                        <Mail className="w-3 h-3 shrink-0" />
                        <span className="truncate">{email}</span>
                      </span>
                    )}
                    {phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 shrink-0" />
                        <span>{phone}</span>
                      </span>
                    )}
                  </div>

                  {/* Key Scores & Ranks */}
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
                    <div className="p-2 rounded-xl bg-surface-alt/60 border border-border/60">
                      <span className="text-[10px] text-ink-soft font-bold block">Resume Score</span>
                      <span className="text-sm font-extrabold text-ink">
                        {Math.round(candidate.resumeScore)}%
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-purple-500/5 border border-purple-500/20">
                      <span className="text-[10px] text-purple-600 font-bold block">Composite Rank</span>
                      <span className="text-sm font-extrabold text-purple-600">
                        {Math.round(candidate.compositeRank)}
                      </span>
                    </div>
                  </div>

                  {/* Completed Dynamic Rounds with Scores */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">
                      Completed Stages ({candidate.completedStages.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {candidate.completedStages.length === 0 ? (
                        <span className="text-[11px] text-ink-soft italic">Final stage verified</span>
                      ) : (
                        candidate.completedStages.map((stage) => (
                          <span
                            key={stage.stageId}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface-alt border border-border text-[10px] font-semibold text-ink"
                          >
                            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="truncate max-w-[110px]">{stage.stageName}</span>
                            {stage.score !== undefined && (
                              <strong className="text-primary font-bold">({stage.score})</strong>
                            )}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Final Shortlist Date */}
                  <div className="flex items-center gap-1.5 text-[10px] text-ink-soft pt-1">
                    <Calendar className="w-3 h-3 text-ink-soft/70" />
                    <span>
                      Final Shortlisted:{" "}
                      {new Date(candidate.finalShortlistDate).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Recruiter Action Buttons (PART 3 & 4) */}
                <div className="pt-3 border-t border-border/60 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCandidate(candidate);
                      setIsDrawerOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-alt hover:bg-surface border border-border text-xs font-bold text-ink shadow-xs transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-primary" />
                    <span>View Profile</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {decision === "pending" && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleOpenDecisionModal(candidate, "on_hold")}
                          className="px-2.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-500/20 transition"
                          title="Put candidate on hold"
                        >
                          Hold
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDecisionModal(candidate, "rejected")}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-500/20 transition"
                          title="Reject candidate"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDecisionModal(candidate, "offered")}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 transition"
                        >
                          <Send className="w-3 h-3" />
                          <span>Extend Offer</span>
                        </button>
                      </>
                    )}

                    {decision === "offered" && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCandidate(candidate);
                          setIsDrawerOpen(true);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-600 border border-purple-500/20 text-xs font-bold"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Offer Extended</span>
                      </button>
                    )}

                    {decision === "on_hold" && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleOpenDecisionModal(candidate, "rejected")}
                          className="px-2.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-500/20 transition"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenDecisionModal(candidate, "offered")}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 transition"
                        >
                          <Send className="w-3 h-3" />
                          <span>Resume Review & Offer</span>
                        </button>
                      </>
                    )}

                    {decision === "rejected" && (
                      <span className="text-xs font-bold text-rose-600 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
                        Rejected
                      </span>
                    )}

                    {decision === "hired" && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCandidate(candidate);
                          setIsDrawerOpen(true);
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-bold"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>View Hired Candidate</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Decision Confirmation Modal */}
      {decisionModal.isOpen && decisionModal.candidate && decisionModal.decision && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-xl overflow-hidden space-y-4 p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                    decisionModal.decision === "offered"
                      ? "bg-purple-500/10 text-purple-600"
                      : decisionModal.decision === "on_hold"
                      ? "bg-amber-500/10 text-amber-600"
                      : "bg-rose-500/10 text-rose-600"
                  }`}
                >
                  {decisionModal.decision === "offered" ? (
                    <Send className="w-5 h-5" />
                  ) : decisionModal.decision === "on_hold" ? (
                    <PauseCircle className="w-5 h-5" />
                  ) : (
                    <UserX className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-ink capitalize">
                    {decisionModal.decision === "offered"
                      ? "Extend Job Offer"
                      : decisionModal.decision === "on_hold"
                      ? "Place Finalist On Hold"
                      : "Reject Finalist"}
                  </h3>
                  <p className="text-xs text-ink-soft">
                    Candidate:{" "}
                    <strong className="text-ink">
                      {decisionModal.candidate.candidate.fullName ||
                        decisionModal.candidate.candidate.username}
                    </strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() =>
                  setDecisionModal({ isOpen: false, candidate: null, decision: null, notes: "", submitting: false })
                }
                className="p-1 rounded-lg text-ink-soft hover:text-ink hover:bg-surface-alt transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-ink-soft leading-relaxed">
              {decisionModal.decision === "offered"
                ? "This will update the finalist's decision to 'Offer Extended' and record the offer timestamp. The candidate can subsequently review and accept terms."
                : decisionModal.decision === "on_hold"
                ? "This marks the candidate as 'On Hold' while other candidates or budget are finalized."
                : "This marks the finalist as rejected and removes them from active offer consideration."}
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-ink">Recruiter Decision Notes (Optional)</label>
              <textarea
                value={decisionModal.notes}
                onChange={(e) => setDecisionModal((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Enter offer terms, salary, committee feedback, or rejection reason..."
                rows={3}
                className="w-full p-2.5 text-xs bg-surface-alt/60 border border-border rounded-xl text-ink focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={() =>
                  setDecisionModal({ isOpen: false, candidate: null, decision: null, notes: "", submitting: false })
                }
                className="px-4 py-2 rounded-xl text-xs font-bold text-ink-soft hover:bg-surface-alt transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={decisionModal.submitting}
                onClick={handleConfirmDecision}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition disabled:opacity-50 ${
                  decisionModal.decision === "offered"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : decisionModal.decision === "on_hold"
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {decisionModal.submitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Check className="w-3.5 h-3.5" />
                )}
                <span>
                  {decisionModal.decision === "offered"
                    ? "Confirm Offer"
                    : decisionModal.decision === "on_hold"
                    ? "Confirm Hold"
                    : "Confirm Rejection"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Drawer (PART 4) */}
      {selectedCandidate && (
        <FinalistReviewDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          candidate={selectedCandidate}
          onDecisionClick={(dec) => handleOpenDecisionModal(selectedCandidate, dec)}
        />
      )}
      </div>
    </div>
  );
}

// Subcomponent: Decision Badge
function FinalDecisionBadge({ decision }: { decision: FinalDecision }) {
  switch (decision) {
    case "pending":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-500/10 text-blue-600 border border-blue-500/20 shrink-0">
          <Clock className="w-3 h-3" />
          <span>Pending Review</span>
        </span>
      );
    case "offered":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-purple-500/10 text-purple-600 border border-purple-500/20 shrink-0">
          <Send className="w-3 h-3" />
          <span>Offer Extended</span>
        </span>
      );
    case "on_hold":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500/10 text-amber-600 border border-amber-500/20 shrink-0">
          <PauseCircle className="w-3 h-3" />
          <span>On Hold</span>
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-500/10 text-rose-600 border border-rose-500/20 shrink-0">
          <UserX className="w-3 h-3" />
          <span>Rejected</span>
        </span>
      );
    case "hired":
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shrink-0">
          <CheckCircle2 className="w-3 h-3" />
          <span>Hired</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-surface-alt text-ink-soft border border-border shrink-0">
          <span>{decision}</span>
        </span>
      );
  }
}

// Subcomponent: Finalist Review Drawer (PART 4)
function FinalistReviewDrawer({
  isOpen,
  onClose,
  candidate,
  onDecisionClick,
}: {
  isOpen: boolean;
  onClose: () => void;
  candidate: IFinalistCandidate;
  onDecisionClick: (decision: "offered" | "on_hold" | "rejected") => void;
}) {
  if (!isOpen) return null;

  const user = candidate.candidate;
  const name = user.fullName || user.username || "Candidate";
  const resume = candidate.resume;
  const evalData = candidate.resumeEvaluation;
  const history = candidate.relevantStageHistory || [];
  const decision = candidate.finalShortlistDecision || "pending";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-surface border-l border-border h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-border/80 flex items-start justify-between gap-4 bg-surface-alt/30">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-extrabold text-base border border-purple-500/20 shrink-0">
              {(name?.[0] || "C").toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-ink">{name}</h2>
                <FinalDecisionBadge decision={decision} />
              </div>
              <p className="text-xs text-ink-soft mt-0.5">{resume?.title || "Candidate Profile"}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 scrollbar-thin">
          {/* Candidate Profile Summary */}
          <div className="p-4 rounded-2xl bg-surface-alt/40 border border-border/80 space-y-3">
            <h3 className="text-xs font-bold text-ink-soft uppercase tracking-wider">Candidate Contact & Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 text-ink">
                <Mail className="w-4 h-4 text-ink-soft shrink-0" />
                <span className="truncate">{user.email || "No email on file"}</span>
              </div>
              <div className="flex items-center gap-2 text-ink">
                <Phone className="w-4 h-4 text-ink-soft shrink-0" />
                <span>{user.phone || "No phone on file"}</span>
              </div>
            </div>
          </div>

          {/* Composite Matching & Resume AI Evaluation */}
          <div className="p-4 rounded-2xl bg-surface-alt/40 border border-border/80 space-y-3">
            <h3 className="text-xs font-bold text-ink-soft uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Resume AI Evaluation & Matching
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-surface border border-border text-center">
                <span className="text-[10px] text-ink-soft font-bold block">Resume Match Score</span>
                <span className="text-xl font-extrabold text-primary">
                  {Math.round(candidate.resumeScore)}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-surface border border-border text-center">
                <span className="text-[10px] text-ink-soft font-bold block">Composite Rank</span>
                <span className="text-xl font-extrabold text-purple-600">
                  {Math.round(candidate.compositeRank)}
                </span>
              </div>
            </div>

            {evalData && (
              <div className="space-y-3 pt-2">
                {evalData.recommendation && (
                  <div className="text-xs">
                    <span className="text-ink-soft font-semibold">AI Recommendation: </span>
                    <span className="font-extrabold uppercase text-purple-600">{evalData.recommendation}</span>
                  </div>
                )}

                {evalData.strengths && evalData.strengths.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-ink-soft block mb-1">Key Strengths:</span>
                    <ul className="list-disc list-inside text-xs text-ink space-y-0.5">
                      {evalData.strengths.map((s: string, idx: number) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {evalData.weaknesses && evalData.weaknesses.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-ink-soft block mb-1">Areas for Development:</span>
                    <ul className="list-disc list-inside text-xs text-ink space-y-0.5">
                      {evalData.weaknesses.map((w: string, idx: number) => (
                        <li key={idx}>{w}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Dynamic Stage-by-Stage Results & Scores (PART 4) */}
          <div className="p-4 rounded-2xl bg-surface-alt/40 border border-border/80 space-y-3">
            <h3 className="text-xs font-bold text-ink-soft uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-purple-600" />
              Dynamic Stage Results
            </h3>

            <div className="space-y-2.5">
              {candidate.completedStages.length === 0 ? (
                <p className="text-xs text-ink-soft italic">No stage evaluation logs recorded.</p>
              ) : (
                candidate.completedStages.map((st) => (
                  <div
                    key={st.stageId}
                    className="p-3 rounded-xl bg-surface border border-border flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-ink">{st.stageName}</h4>
                        {st.notes && <p className="text-[11px] text-ink-soft line-clamp-1">{st.notes}</p>}
                      </div>
                    </div>
                    {st.score !== undefined && (
                      <span className="font-extrabold text-sm text-primary px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
                        Score: {st.score}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Immutable Stage History Timeline */}
          <div className="p-4 rounded-2xl bg-surface-alt/40 border border-border/80 space-y-3">
            <h3 className="text-xs font-bold text-ink-soft uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-ink-soft" />
              Stage Audit History
            </h3>

            <div className="space-y-3 pl-2 border-l-2 border-border/80">
              {history.map((h, i) => (
                <div key={i} className="relative pl-4 text-xs space-y-0.5">
                  <div className="absolute -left-[17px] top-1 w-2.5 h-2.5 rounded-full bg-primary border-2 border-surface" />
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-ink">{h.stageName || "Funnel Stage"}</span>
                    <span className="text-[10px] text-ink-soft capitalize px-1.5 py-0.2 rounded-md bg-surface border border-border">
                      {h.status}
                    </span>
                  </div>
                  {h.notes && <p className="text-[11px] text-ink-soft">{h.notes}</p>}
                  {h.enteredAt && (
                    <span className="text-[10px] text-ink-soft/70 block">
                      {new Date(h.enteredAt).toLocaleString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-5 border-t border-border/80 bg-surface flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-ink-soft hover:bg-surface-alt transition"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            {decision !== "rejected" && (
              <button
                type="button"
                onClick={() => onDecisionClick("rejected")}
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-bold border border-rose-500/20 transition"
              >
                Reject Finalist
              </button>
            )}

            {decision !== "on_hold" && decision !== "hired" && (
              <button
                type="button"
                onClick={() => onDecisionClick("on_hold")}
                className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-500/20 transition"
              >
                Put On Hold
              </button>
            )}

            {decision !== "offered" && decision !== "hired" && (
              <button
                type="button"
                onClick={() => onDecisionClick("offered")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Extend Formal Offer</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
