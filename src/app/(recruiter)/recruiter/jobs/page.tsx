"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  PlusCircle,
  RefreshCw,
  Sparkles,
  KanbanSquare,
  TrendingUp,
  ListChecks,
  CheckCircle2,
  AlertTriangle,
  Award,
  Layers,
  ArrowRight,
  ChevronRight,
  Filter,
  Eye,
  Sliders,
  FileText,
  Brain,
  UserCheck,
  Target,
  Loader2,
  X,
  FileCheck2,
  GitCommit,
  PauseCircle,
} from "lucide-react";
import { toast } from "sonner";
import { recruiterService } from "@/features/recruiter/services/recruiterService";
import { RecruiterJob } from "@/features/recruiter/types";
import { hiringEngineService } from "@/features/hiringEngine/services/hiringEngineService";
import {
  IFunnelMetricsReport,
  IStageMetrics,
  HiringEngineCandidate,
  PopulatedUser,
  PopulatedResume,
  FunnelHealthState,
  IHiringFunnelConfig,
} from "@/features/hiringEngine/types/hiringEngine.types";
import { CandidateDetailDrawer } from "@/features/hiringEngine/components/CandidateDetailDrawer";
import {
  ConfirmActionModal,
  ConfirmModalType,
} from "@/features/hiringEngine/components/ConfirmActionModal";
import { InitPipelineModal } from "@/features/hiringEngine/components/InitPipelineModal";
import { JobsSidebar } from "@/features/recruiter/components/JobsSidebar";

type ActiveTab = "timeline" | "kanban" | "resume-screening" | "final-shortlist" | "candidates";

const STAGE_TYPE_ICONS: Record<string, typeof FileText> = {
  resume_match: FileText,
  assessment: Sliders,
  ai_interview: Brain,
  manual_review: UserCheck,
  human_interview: UserCheck,
};

const isOnlineTestStage = (stage: IStageMetrics) => {
  const type = (stage.stageType || stage.assessmentType || "").toLowerCase();
  const id = (stage.stageId || "").toLowerCase();
  const name = (stage.stageName || "").toLowerCase();
  return (
    type === "general_aptitude" ||
    type === "technical_test" ||
    type === "rapid_round" ||
    id.includes("general_aptitude") ||
    id.includes("technical_test") ||
    id.includes("rapid_round") ||
    name.includes("aptitude") ||
    name.includes("technical test") ||
    name.includes("rapid round") ||
    name.includes("online test")
  );
};

const isAiAssessmentStage = (stage: IStageMetrics) => {
  const type = (stage.stageType || stage.assessmentType || "").toLowerCase();
  const id = (stage.stageId || "").toLowerCase();
  const name = (stage.stageName || "").toLowerCase();
  return (
    type === "ai_assessment" ||
    type === "ai_chat" ||
    type === "ai_voice" ||
    id.includes("ai_assessment") ||
    id.includes("ai_chat") ||
    id.includes("ai_voice") ||
    name.includes("ai assessment") ||
    name.includes("ai chat") ||
    name.includes("ai voice")
  );
};

const PIPELINE_TABS: {
  id: ActiveTab;
  name: string;
  icon: typeof GitCommit;
  badge: string;
}[] = [
  { id: "timeline", name: "Hiring Timeline", icon: GitCommit, badge: "Funnel" },
  { id: "kanban", name: "Kanban", icon: KanbanSquare, badge: "Live" },
  { id: "resume-screening", name: "Resume Shortlisting", icon: FileCheck2, badge: "Qualification" },
  { id: "final-shortlist", name: "Final Shortlist", icon: Award, badge: "Decisions" },
  { id: "candidates", name: "Candidate Listing", icon: ListChecks, badge: "Directory" },
];

export default function RecruiterJobsBoardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlJobId = searchParams.get("jobId");
  const urlTab = searchParams.get("tab") as ActiveTab | null;

  // Job Listing state
  const [jobs, setJobs] = useState<RecruiterJob[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>(urlJobId || "");
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [jobSearch, setJobSearch] = useState("");
  const [jobStatusFilter, setJobStatusFilter] = useState<"all" | "active" | "draft" | "closed">("all");

  // Pipeline Data for Selected Job
  const [metrics, setMetrics] = useState<IFunnelMetricsReport | null>(null);
  const [pipelineConfig, setPipelineConfig] = useState<IHiringFunnelConfig | null>(null);
  const [stageCandidates, setStageCandidates] = useState<
    Record<string, { primary: HiringEngineCandidate[]; reserve: HiringEngineCandidate[] }>
  >({});
  const [loadingPipeline, setLoadingPipeline] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>(urlTab || "timeline");

  // Candidate Search & Filter
  const [candidateSearch, setCandidateSearch] = useState("");
  const [candidateStatusFilter, setCandidateStatusFilter] = useState("all");

  // Modals & Drawers
  const [selectedCandidate, setSelectedCandidate] = useState<HiringEngineCandidate | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showInitModal, setShowInitModal] = useState(false);
  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean;
    type: ConfirmModalType;
    title: string;
    description: string;
    candidate?: HiringEngineCandidate;
    stageId?: string;
    stageName?: string;
  }>({
    isOpen: false,
    type: "advance",
    title: "",
    description: "",
  });

  // 1. Fetch Recruiter Jobs and sort from current created to previous one (newest to oldest)
  const loadJobs = useCallback(async () => {
    setLoadingJobs(true);
    try {
      const data = await recruiterService.getMyJobs();
      // Sort strictly from current created to previous one (descending createdAt)
      const sorted = (data || []).sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return timeB - timeA;
      });
      setJobs(sorted);

      if (sorted.length > 0) {
        // If urlJobId exists and matches, keep it. Otherwise default to sorted[0] (the current created job)
        const found =
          (urlJobId && sorted.find((j) => j._id === urlJobId)) ||
          (selectedJobId && sorted.find((j) => j._id === selectedJobId)) ||
          sorted[0];
        setSelectedJobId(found._id);
      } else {
        setSelectedJobId("");
      }
    } catch (err: unknown) {
      toast.error("Failed to load jobs.");
    } finally {
      setLoadingJobs(false);
    }
  }, [urlJobId, selectedJobId]);

  useEffect(() => {
    loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Fetch Hiring Pipeline metrics & candidates when selectedJobId changes
  const loadPipelineData = useCallback(async () => {
    if (!selectedJobId) {
      setMetrics(null);
      setPipelineConfig(null);
      setStageCandidates({});
      return;
    }

    setLoadingPipeline(true);
    try {
      const [metricsData, configData] = await Promise.all([
        hiringEngineService.getFunnelMetrics(selectedJobId),
        hiringEngineService.getPipelineConfig(selectedJobId).catch(() => null),
      ]);

      setMetrics(metricsData);
      setPipelineConfig(configData);

      if (metricsData?.stages && metricsData.stages.length > 0) {
        const stageResults = await Promise.all(
          metricsData.stages.map((stage) =>
            hiringEngineService
              .getStageCandidates(selectedJobId, stage.stageId)
              .catch(() => ({ stageId: stage.stageId, primary: [], reserve: [] }))
          )
        );

        const candMap: Record<string, { primary: HiringEngineCandidate[]; reserve: HiringEngineCandidate[] }> = {};
        stageResults.forEach((res) => {
          candMap[res.stageId] = {
            primary: res.primary || [],
            reserve: res.reserve || [],
          };
        });
        setStageCandidates(candMap);
      } else {
        setStageCandidates({});
      }
    } catch (err: any) {
      const isNotFound =
        err?.response?.status === 404 ||
        err?.statusCode === 404 ||
        err?.status === 404 ||
        err?.error?.code === "NOT_FOUND";

      if (isNotFound) {
        setMetrics(null);
        setPipelineConfig(null);
        setStageCandidates({});
      } else {
        console.warn("Pipeline data not loaded for job:", selectedJobId, err);
      }
    } finally {
      setLoadingPipeline(false);
    }
  }, [selectedJobId]);

  useEffect(() => {
    loadPipelineData();
  }, [loadPipelineData]);

  // Handle selecting a job from the side menu
  const handleSelectJob = (jobId: string) => {
    setSelectedJobId(jobId);
    router.replace(`/recruiter/jobs?jobId=${jobId}&tab=${activeTab}`, { scroll: false });
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (selectedJobId) {
      router.replace(`/recruiter/jobs?jobId=${selectedJobId}&tab=${tab}`, { scroll: false });
    }
  };

  // Find currently highlighted job
  const selectedJob = useMemo(
    () => jobs.find((j) => j._id === selectedJobId),
    [jobs, selectedJobId]
  );

  // Filter Jobs in the side menu (preserves current created to previous one order)
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const query = jobSearch.toLowerCase().trim();
      const matchesSearch =
        !query ||
        job.title?.toLowerCase().includes(query) ||
        job.skills?.some((s) => s.toLowerCase().includes(query)) ||
        job.location?.city?.toLowerCase().includes(query) ||
        job.location?.country?.toLowerCase().includes(query);

      const status = job.status?.toLowerCase() || "active";
      const matchesStatus =
        jobStatusFilter === "all" ||
        (jobStatusFilter === "active" && (status === "active" || status === "open")) ||
        (jobStatusFilter === "draft" && status === "draft") ||
        (jobStatusFilter === "closed" && (status === "closed" || status === "archived"));

      return matchesSearch && matchesStatus;
    });
  }, [jobs, jobSearch, jobStatusFilter]);

  // Filter candidates for stage columns
  const filterCandidates = (list: HiringEngineCandidate[]) => {
    return list.filter((c) => {
      const user = typeof c.userId === "object" ? (c.userId as PopulatedUser) : null;
      const name = (user?.fullName || user?.username || "").toLowerCase();
      const email = (user?.email || "").toLowerCase();
      const query = candidateSearch.toLowerCase().trim();

      const matchesSearch = !query || name.includes(query) || email.includes(query);
      const matchesStatus = candidateStatusFilter === "all" || c.stageStatus === candidateStatusFilter;

      return matchesSearch && matchesStatus;
    });
  };

  // All candidates flattened for Candidate Listing Tab
  const allCandidatesList = useMemo(() => {
    const list: { candidate: HiringEngineCandidate; stageName: string }[] = [];
    if (!metrics?.stages) return list;

    metrics.stages.forEach((stage) => {
      const pool = stageCandidates[stage.stageId];
      if (pool) {
        pool.primary.forEach((c) => list.push({ candidate: c, stageName: stage.stageName }));
        pool.reserve.forEach((c) => list.push({ candidate: c, stageName: `${stage.stageName} (Reserve)` }));
      }
    });
    return list;
  }, [metrics, stageCandidates]);

  // Modal actions (Advance, Fail, Refill)
  const handleOpenAdvanceModal = (candidate: HiringEngineCandidate, stageName?: string) => {
    const user = typeof candidate.userId === "object" ? (candidate.userId as PopulatedUser) : null;
    const name = user?.fullName || user?.username || "Candidate";
    setConfirmModalState({
      isOpen: true,
      type: "advance",
      title: "Advance Candidate to Next Stage",
      description: `Advance ${name} to the next evaluation stage. If this is the final stage, they will reach the shortlist.`,
      candidate,
      stageName,
    });
  };

  const handleOpenFailModal = (candidate: HiringEngineCandidate, stageName?: string) => {
    const user = typeof candidate.userId === "object" ? (candidate.userId as PopulatedUser) : null;
    const name = user?.fullName || user?.username || "Candidate";
    setConfirmModalState({
      isOpen: true,
      type: "fail",
      title: "Disqualify Candidate",
      description: `Mark ${name} as failed. If auto-refill is active, a reserve candidate will be immediately promoted.`,
      candidate,
      stageName,
    });
  };

  const handleOpenRefillModal = (stageId: string, stageName: string) => {
    setConfirmModalState({
      isOpen: true,
      type: "refill",
      title: `Refill Pool: ${stageName}`,
      description: `Promote reserve pool candidates into this stage's active primary pool to cover the deficit.`,
      stageId,
      stageName,
    });
  };

  const handleExecuteModalAction = async (payload: {
    score?: number;
    notes?: string;
    reason?: string;
    count?: number;
  }) => {
    if (!selectedJobId) return;

    try {
      if (confirmModalState.type === "advance" && confirmModalState.candidate) {
        const res = await hiringEngineService.advanceCandidate(
          selectedJobId,
          confirmModalState.candidate._id,
          { score: payload.score, notes: payload.notes }
        );
        toast.success(
          res.isFinalShortlist
            ? "Candidate successfully added to Final Shortlist!"
            : "Candidate advanced to next stage."
        );
      } else if (confirmModalState.type === "fail" && confirmModalState.candidate) {
        const res = await hiringEngineService.failCandidate(
          selectedJobId,
          confirmModalState.candidate._id,
          { reason: payload.reason }
        );
        if (res.promotedCount > 0) {
          toast.success(
            `Candidate failed. Automatically promoted ${res.promotedCount} reserve candidate(s).`
          );
        } else {
          toast.success("Candidate marked as failed.");
        }
      } else if (confirmModalState.type === "refill" && confirmModalState.stageId) {
        const res = await hiringEngineService.refillStage(
          selectedJobId,
          confirmModalState.stageId,
          { count: payload.count }
        );
        if (res.promotedCount > 0) {
          toast.success(`Successfully promoted ${res.promotedCount} reserve candidate(s).`);
        } else {
          toast.info("No reserve candidates available or needed.");
        }
      }

      await loadPipelineData();
      setIsDrawerOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Action failed.");
    }
  };

  // Health badge helper
  const getHealthBadge = (health: FunnelHealthState) => {
    switch (health) {
      case "healthy":
        return {
          icon: CheckCircle2,
          text: "Healthy Pipeline",
          className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        };
      case "starved":
        return {
          icon: AlertTriangle,
          text: "Reserve Starved",
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

  const healthBadge = getHealthBadge(metrics?.health || "healthy");
  const HealthIcon = healthBadge.icon;

  // Format date helper
  const formatDate = (isoString?: string) => {
    if (!isoString) return null;
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return null;
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return null;
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col bg-background">
      {/* Main 2-Column Split Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {/* ================================================================= */}
        {/* LEFT SIDE MENU: Listing Jobs from Current Created to Previous One */}
        {/* ================================================================= */}
        <JobsSidebar
          jobs={jobs}
          selectedJobId={selectedJobId}
          loadingJobs={loadingJobs}
          onSelectJob={handleSelectJob}
        />

        {/* ================================================================= */}
        {/* RIGHT COLUMN: The Authentic Hiring Pipeline Menu UI               */}
        {/* ================================================================= */}
        <main className="flex-1 flex flex-col h-auto lg:h-[calc(100vh-4rem)] overflow-y-auto bg-background/50 p-4 sm:p-6 lg:p-8 min-w-0 space-y-6">
          {!selectedJob ? (
            /* Empty State */
            <div className="my-auto p-12 text-center space-y-5 bg-surface border border-dashed border-border rounded-3xl max-w-lg mx-auto shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20">
                <Briefcase className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-extrabold text-ink">No Job Requisitions Found</h3>
                <p className="text-xs text-ink-soft max-w-sm mx-auto leading-relaxed">
                  Post your first job listing to activate the automated hiring pipeline and begin tracking candidate progression.
                </p>
              </div>
              <Link
                href="/recruiter/jobs/create"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-brand text-white text-xs font-bold shadow-md hover:opacity-95 transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New Job</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* ============================================================= */}
              {/* 1. AUTHENTIC HIRING PIPELINE HEADER                           */}
              {/* ============================================================= */}
              <div className="space-y-6 pb-6 border-b border-border/80">
                {/* Breadcrumb & Title Row */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-ink-soft mb-1.5">
                      <span>Recruiter</span>
                      <ChevronRight className="w-3 h-3 text-ink-soft/60" />
                      <span>Hiring Pipeline</span>
                      <ChevronRight className="w-3 h-3 text-ink-soft/60" />
                      <span className="font-semibold text-primary">{selectedJob.title}</span>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                        {metrics?.jobTitle || selectedJob.title}
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
                      Autonomous stage-by-stage candidate journey, mathematical capacity budgeting, and AI evaluation.
                    </p>
                  </div>

                  {/* Actions & Refresh */}
                  <div className="flex items-center gap-2.5 flex-wrap shrink-0">
                    <Link
                      href="/recruiter/jobs/create"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-brand text-primary-foreground shadow-glow hover:opacity-95 transition"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Create Job</span>
                    </Link>

                    <Link
                      href={`/recruiter/jobs/${selectedJob._id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-surface border border-border text-ink hover:bg-surface-alt shadow-xs transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Job Details</span>
                    </Link>

                    <button
                      type="button"
                      onClick={loadPipelineData}
                      disabled={loadingPipeline}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-surface hover:bg-surface-alt text-xs font-semibold text-ink shadow-xs transition disabled:opacity-50 cursor-pointer"
                      title="Refresh pipeline metrics"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 text-ink-soft ${loadingPipeline ? "animate-spin" : ""}`} />
                      <span>Refresh</span>
                    </button>

                    {!metrics && !loadingPipeline && (
                      <button
                        type="button"
                        onClick={() => setShowInitModal(true)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-xs hover:bg-primary/90 transition cursor-pointer"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Initialize Pipeline</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 4 Metric Cards (Shortlist Target, In Pipeline, Stages, Funnel Health) */}
                {metrics && (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Shortlist Target Quota */}
                    <div className="bg-surface p-4 rounded-2xl border border-border/80 shadow-xs space-y-1">
                      <div className="flex items-center justify-between text-xs text-ink-soft font-semibold">
                        <span>Shortlist Target</span>
                        <Target className="w-4 h-4 text-primary-glow" />
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-ink">
                          {metrics.currentShortlistedCount}
                        </span>
                        <span className="text-xs text-ink-soft">/ {metrics.finalShortlistTarget} candidates</span>
                      </div>
                      <div className="w-full bg-surface-alt h-1.5 rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-gradient-brand rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round((metrics.currentShortlistedCount / metrics.finalShortlistTarget) * 100)
                            )}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* In Pipeline (Active vs Reserve) */}
                    <div className="bg-surface p-4 rounded-2xl border border-border/80 shadow-xs space-y-1">
                      <div className="flex items-center justify-between text-xs text-ink-soft font-semibold">
                        <span>In Pipeline</span>
                        <Users className="w-4 h-4 text-indigo-500" />
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-ink">
                          {metrics.stages?.reduce((acc, s) => acc + s.activeCount, 0) || 0}
                        </span>
                        <span className="text-xs text-emerald-600 font-bold">Active Primary</span>
                      </div>
                      <span className="text-[11px] text-ink-soft block">
                        +{metrics.stages?.reduce((acc, s) => acc + s.reserveAvailable, 0) || 0} in reserve pool
                      </span>
                    </div>

                    {/* Active Stages in Pipeline */}
                    <div className="bg-surface p-4 rounded-2xl border border-border/80 shadow-xs space-y-1">
                      <div className="flex items-center justify-between text-xs text-ink-soft font-semibold">
                        <span>Active Stages</span>
                        <Layers className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-ink">{metrics.stages?.length || 0}</span>
                        <span className="text-xs text-ink-soft">evaluation rounds</span>
                      </div>
                      <span className="text-[11px] text-ink-soft block truncate">
                        Deficit: {metrics.stages?.reduce((acc, s) => acc + s.deficit, 0) || 0} candidates
                      </span>
                    </div>

                    {/* Funnel Health */}
                    <div className="bg-surface p-4 rounded-2xl border border-border/80 shadow-xs space-y-1">
                      <div className="flex items-center justify-between text-xs text-ink-soft font-semibold">
                        <span>Funnel Health</span>
                        <HealthIcon className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div className="pt-1">
                        <span
                          className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${healthBadge.className}`}
                        >
                          <HealthIcon className="w-3 h-3" />
                          <span>{healthBadge.text}</span>
                        </span>
                      </div>
                      <span className="text-[10px] text-ink-soft block mt-0.5">
                        Auto-monitoring &amp; refill
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* ============================================================= */}
              {/* 2. AUTHENTIC HIRING PIPELINE NAVIGATION TABS                  */}
              {/* ============================================================= */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-1.5 p-1 bg-surface-alt/80 border border-border/80 rounded-2xl w-fit max-w-full overflow-x-auto shadow-xs">
                  {PIPELINE_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => handleTabChange(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                          isActive
                            ? "bg-surface text-primary shadow-xs border border-border/60"
                            : "text-ink-soft hover:text-ink hover:bg-surface/50"
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${isActive ? "text-primary-glow" : "text-ink-soft"}`} />
                        <span>{tab.name}</span>
                        {tab.badge && (
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                              isActive
                                ? "bg-primary/10 text-primary-glow"
                                : "bg-surface text-ink-soft"
                            }`}
                          >
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Candidate Search / Status Filter (shown when on Kanban, Directory or Shortlist) */}
                {metrics && activeTab !== "timeline" && (
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-56 sm:w-64">
                      <Search className="w-3 h-3 text-ink-soft absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search candidate name or email..."
                        value={candidateSearch}
                        onChange={(e) => setCandidateSearch(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 text-xs bg-surface border border-border rounded-xl text-ink outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <select
                      value={candidateStatusFilter}
                      onChange={(e) => setCandidateStatusFilter(e.target.value)}
                      className="px-2.5 py-1.5 text-xs bg-surface border border-border rounded-xl text-ink outline-none cursor-pointer"
                    >
                      <option value="all">All Statuses</option>
                      <option value="invited">Invited</option>
                      <option value="started">Started</option>
                      <option value="passed">Passed</option>
                      <option value="failed">Failed</option>
                      <option value="no_show">No-Show</option>
                    </select>
                  </div>
                )}
              </div>

              {/* ============================================================= */}
              {/* 3. DYNAMIC CONTENT ACCORDING TO ACTIVE PIPELINE TAB           */}
              {/* ============================================================= */}
              {loadingPipeline ? (
                <div className="p-16 text-center space-y-3 bg-surface border border-border rounded-3xl shadow-xs">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                  <p className="text-xs font-semibold text-ink-soft">Loading candidate pipeline &amp; stages...</p>
                </div>
              ) : !metrics ? (
                /* Uninitialized State */
                <div className="p-12 text-center space-y-5 bg-surface border border-dashed border-border rounded-3xl shadow-xs max-w-xl mx-auto">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto border border-primary/20">
                    <Sparkles className="w-7 h-7" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-extrabold text-ink">
                      Hiring Pipeline Not Initialized
                    </h3>
                    <p className="text-xs text-ink-soft leading-relaxed max-w-md mx-auto">
                      Activate automated candidate progression, stage capacity budgeting, and automatic reserve refills for{" "}
                      <strong className="text-ink">{selectedJob.title}</strong>.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowInitModal(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-brand text-white text-xs font-bold shadow-md hover:opacity-95 transition cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Initialize Stage Pipeline</span>
                  </button>
                </div>
              ) : activeTab === "timeline" ? (
                /* ----------------------------------------------------------- */
                /* TAB 1: HIRING TIMELINE (Visual Stage Progression Journey)   */
                /* ----------------------------------------------------------- */
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-extrabold text-ink flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        Configured Stage Progression Journey
                      </h2>
                      <p className="text-xs text-ink-soft mt-0.5">
                        Calculated backwards from final shortlist quota of {metrics.finalShortlistTarget} candidate
                        {metrics.finalShortlistTarget > 1 ? "s" : ""}. Click any stage to inspect candidates.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTabChange("kanban")}
                      className="flex items-center gap-1 text-xs font-bold text-primary hover:underline cursor-pointer"
                    >
                      <span>View Kanban Board</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Connected Stage Progression Cards */}
                  <div className="space-y-4">
                    {metrics.stages.map((stage: IStageMetrics, index: number) => {
                      const Icon = STAGE_TYPE_ICONS[stage.stageType] || FileText;
                      const hasDeficit = stage.deficit > 0;
                      const fillPercentage =
                        stage.targetCount > 0
                          ? Math.min(100, Math.round((stage.activeCount / stage.targetCount) * 100))
                          : 0;

                      return (
                        <div key={stage.stageId} className="flex flex-col items-center">
                          <div className="w-full bg-surface border border-border hover:border-primary/40 rounded-2xl p-5 shadow-xs transition-all hover:shadow-md group">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                              {/* Stage Identity */}
                              <div className="flex items-start gap-3.5">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-extrabold text-base border border-primary/20 shrink-0 group-hover:scale-105 transition-transform">
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-surface-alt border border-border text-ink-soft">
                                      STAGE {stage.order}
                                    </span>
                                    <h3 className="text-base font-extrabold text-ink">{stage.stageName}</h3>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary-glow border border-primary/20 capitalize">
                                      {stage.stageType.replace(/_/g, " ")}
                                    </span>

                                    {/* Configuration Status Badge */}
                                    {stage.stageType === "resume_match" ? (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                                        ATS Resume Screening
                                      </span>
                                    ) : stage.isConfigured || (stage.questionCount && stage.questionCount > 0) ? (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
                                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                        <span>
                                          Configured ({stage.questionCount || 0} Qs · {stage.durationMinutes || 30}m · {stage.passingScore || 70}%)
                                        </span>
                                      </span>
                                    ) : (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 border border-amber-500/30 flex items-center gap-1 animate-pulse">
                                        <AlertTriangle className="w-3 h-3 text-amber-500" />
                                        <span>Questions Not Configured Yet</span>
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-ink-soft mt-1">
                                    Intake Target: <strong className="text-ink font-bold">{stage.targetCount}</strong> | Active:{" "}
                                    <strong className="text-ink font-bold">{stage.activeCount}</strong>
                                    {stage.stageType !== "resume_match" && (
                                      <span className="ml-2 text-ink-soft">
                                        · Passing Score: <strong className="text-ink">{stage.passingScore || 70}%</strong>
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>

                              {/* Real Candidate Counts Breakdown */}
                              <div className="flex flex-wrap items-center gap-2 text-xs">
                                <div className="px-3 py-1.5 rounded-xl bg-surface-alt/80 border border-border/70 text-center">
                                  <span className="text-[10px] text-ink-soft block font-bold">Target</span>
                                  <span className="text-sm font-extrabold text-ink">{stage.targetCount}</span>
                                </div>
                                <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                                  <span className="text-[10px] text-emerald-600 block font-bold">Passed</span>
                                  <span className="text-sm font-extrabold text-emerald-600">{stage.passedCount}</span>
                                </div>
                                <div className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center">
                                  <span className="text-[10px] text-blue-600 block font-bold">Invited</span>
                                  <span className="text-sm font-extrabold text-blue-600">{stage.invitedCount}</span>
                                </div>
                                <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center">
                                  <span className="text-[10px] text-rose-600 block font-bold">Failed</span>
                                  <span className="text-sm font-extrabold text-rose-600">{stage.failedCount}</span>
                                </div>
                                <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-center">
                                  <span className="text-[10px] text-amber-600 block font-bold">No-Show</span>
                                  <span className="text-sm font-extrabold text-amber-600">{stage.noShowCount}</span>
                                </div>
                                <div className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                                  <span className="text-[10px] text-purple-600 block font-bold">Reserve</span>
                                  <span className="text-sm font-extrabold text-purple-600">{stage.reserveAvailable}</span>
                                </div>
                              </div>

                              {/* Stage Actions */}
                              <div className="flex items-center gap-2 lg:border-l lg:border-border/70 lg:pl-5 shrink-0 flex-wrap sm:flex-nowrap">
                                {(() => {
                                  if (isOnlineTestStage(stage)) {
                                    const isConfigured = Boolean(stage.isConfigured || (stage.questionCount && stage.questionCount > 0));
                                    return (
                                      <Link
                                        href={`/recruiter/jobs/${selectedJobId}/stages/${stage.stageId}/configure`}
                                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                                          isConfigured
                                            ? "bg-surface border border-border hover:bg-surface-alt text-ink"
                                            : "bg-amber-500 hover:bg-amber-600 text-black shadow-md animate-pulse"
                                        }`}
                                      >
                                        <Sliders className="w-3.5 h-3.5" />
                                        <span>{isConfigured ? "Edit Questions & Rules" : "Configure Round"}</span>
                                      </Link>
                                    );
                                  }

                                  if (isAiAssessmentStage(stage)) {
                                    const isConfigured = Boolean(stage.isConfigured || (stage.config as any)?.isConfigured);
                                    return (
                                      <Link
                                        href={`/recruiter/jobs/${selectedJobId}/stages/${stage.stageId}/configure`}
                                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                                          isConfigured
                                            ? "bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-500/20"
                                            : "bg-purple-600 hover:bg-purple-700 text-white shadow-md animate-pulse"
                                        }`}
                                      >
                                        <Sparkles className="w-3.5 h-3.5" />
                                        <span>{isConfigured ? "Edit AI Assessment" : "Configure AI Assessment"}</span>
                                      </Link>
                                    );
                                  }

                                  const type = (stage.stageType || stage.assessmentType || "").toLowerCase();
                                  const id = (stage.stageId || "").toLowerCase();
                                  const name = (stage.stageName || "").toLowerCase();

                                  if (type.includes("interview") || id.includes("interview") || name.includes("interview")) {
                                    return (
                                      <Link
                                        href="/recruiter/interview-schedule"
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 border border-blue-500/25 transition shadow-xs cursor-pointer"
                                      >
                                        <Calendar className="w-3.5 h-3.5" />
                                        <span>Interview Hub</span>
                                      </Link>
                                    );
                                  }

                                  if (id.includes("background_verification") || name.includes("verification")) {
                                    return (
                                      <Link
                                        href="/recruiter/background-verification"
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 border border-emerald-500/25 transition shadow-xs cursor-pointer"
                                      >
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        <span>BGC Hub</span>
                                      </Link>
                                    );
                                  }

                                  if (id.includes("onboarding") || name.includes("onboarding")) {
                                    return (
                                      <Link
                                        href="/recruiter/onboarding"
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-primary/10 hover:bg-primary/20 text-primary border border-primary/25 transition shadow-xs cursor-pointer"
                                      >
                                        <Users className="w-3.5 h-3.5" />
                                        <span>Onboarding Hub</span>
                                      </Link>
                                    );
                                  }

                                  if (type === "domain" || type === "skills" || id.includes("domain") || id.includes("skills")) {
                                    return (
                                      <Link
                                        href="/recruiter/domain-assessments"
                                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-surface border border-border hover:bg-surface-alt text-ink transition shadow-xs cursor-pointer"
                                      >
                                        <Layers className="w-3.5 h-3.5" />
                                        <span>Domain Studio</span>
                                      </Link>
                                    );
                                  }

                                  return null;
                                })()}

                                <button
                                  type="button"
                                  onClick={() => handleTabChange("kanban")}
                                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-alt hover:bg-surface border border-border text-xs font-bold text-ink shadow-xs transition cursor-pointer"
                                >
                                  <span>Inspect</span>
                                  <ArrowRight className="w-3.5 h-3.5 text-primary" />
                                </button>
                              </div>
                            </div>

                            {/* Stage Progress Bar */}
                            <div className="mt-4 pt-3 border-t border-border/50">
                              <div className="flex items-center justify-between text-[11px] mb-1.5">
                                <span className="text-ink-soft font-semibold">
                                  Active Capacity: {stage.activeCount} / {stage.targetCount} ({fillPercentage}%)
                                </span>
                                {hasDeficit ? (
                                  <span className="text-amber-600 font-bold flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" /> Deficit of {stage.deficit} candidate(s)
                                  </span>
                                ) : (
                                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Quota Met
                                  </span>
                                )}
                              </div>
                              <div className="w-full bg-surface-alt h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    hasDeficit ? "bg-amber-500" : "bg-emerald-500"
                                  }`}
                                  style={{ width: `${fillPercentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : activeTab === "kanban" ? (
                /* ----------------------------------------------------------- */
                /* TAB 2: KANBAN BOARD                                         */
                /* ----------------------------------------------------------- */
                <div className="flex gap-4 overflow-x-auto pb-4 pt-1 items-start min-h-[500px] scrollbar-thin">
                  {metrics.stages.map((stage: IStageMetrics) => {
                    const pool = stageCandidates[stage.stageId] || { primary: [], reserve: [] };
                    const filteredPrimary = filterCandidates(pool.primary);
                    const filteredReserve = filterCandidates(pool.reserve);
                    const hasDeficit = stage.deficit > 0;

                    return (
                      <div
                        key={stage.stageId}
                        className="w-76 sm:w-80 shrink-0 bg-surface-alt/30 border border-border rounded-2xl flex flex-col max-h-[720px] transition-all shadow-xs"
                      >
                        {/* Column Header */}
                        <div className="p-3.5 border-b border-border/80 bg-surface rounded-t-2xl space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md bg-surface-alt border border-border text-ink-soft">
                                #{stage.order}
                              </span>
                              <h3
                                className="text-xs font-extrabold text-ink truncate max-w-[160px]"
                                title={stage.stageName}
                              >
                                {stage.stageName}
                              </h3>
                            </div>
                            <span className="text-xs font-extrabold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                              {stage.activeCount ?? pool.primary.length}/{stage.targetCount}
                            </span>
                          </div>

                          {/* Stage Configuration Quick Link */}
                          {(() => {
                            if (isOnlineTestStage(stage)) {
                              return (
                                <div className="flex items-center justify-between pt-0.5">
                                  {stage.isConfigured || (stage.questionCount && stage.questionCount > 0) ? (
                                    <Link
                                      href={`/recruiter/jobs/${selectedJobId}/stages/${stage.stageId}/configure`}
                                      className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/20 flex items-center gap-1 transition"
                                      title="Edit questions & stage rules"
                                    >
                                      <CheckCircle2 className="w-2.5 h-2.5" />
                                      <span>Configured ({stage.questionCount || 0} Qs)</span>
                                    </Link>
                                  ) : (
                                    <Link
                                      href={`/recruiter/jobs/${selectedJobId}/stages/${stage.stageId}/configure`}
                                      className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 px-2 py-0.5 rounded-md border border-amber-500/30 flex items-center gap-1 animate-pulse transition"
                                      title="Questions not configured yet. Click to configure!"
                                    >
                                      <AlertTriangle className="w-2.5 h-2.5 text-amber-600" />
                                      <span>Configure Round</span>
                                    </Link>
                                  )}
                                  <span className="text-[10px] text-ink-soft">
                                    Pass: <strong className="text-ink">{stage.passingScore || 70}%</strong>
                                  </span>
                                </div>
                              );
                            }

                            const id = (stage.stageId || "").toLowerCase();
                            const type = (stage.stageType || stage.assessmentType || "").toLowerCase();
                            const name = (stage.stageName || "").toLowerCase();

                            if (type.includes("interview") || id.includes("interview") || name.includes("interview")) {
                              return (
                                <div className="flex items-center justify-between pt-0.5">
                                  <Link
                                    href="/recruiter/interview-schedule"
                                    className="text-[10px] font-bold text-blue-600 bg-blue-500/10 hover:bg-blue-500/20 px-2 py-0.5 rounded-md border border-blue-500/20 flex items-center gap-1 transition"
                                  >
                                    <Calendar className="w-2.5 h-2.5" />
                                    <span>Interview Hub</span>
                                  </Link>
                                  <span className="text-[10px] text-ink-soft">Live Panel</span>
                                </div>
                              );
                            }

                            if (id.includes("background_verification") || name.includes("verification")) {
                              return (
                                <div className="flex items-center justify-between pt-0.5">
                                  <Link
                                    href="/recruiter/background-verification"
                                    className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded-md border border-emerald-500/20 flex items-center gap-1 transition"
                                  >
                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                    <span>BGC Hub</span>
                                  </Link>
                                  <span className="text-[10px] text-ink-soft">Verification</span>
                                </div>
                              );
                            }

                            if (id.includes("onboarding") || name.includes("onboarding")) {
                              return (
                                <div className="flex items-center justify-between pt-0.5">
                                  <Link
                                    href="/recruiter/onboarding"
                                    className="text-[10px] font-bold text-primary bg-primary/10 hover:bg-primary/20 px-2 py-0.5 rounded-md border border-primary/20 flex items-center gap-1 transition"
                                  >
                                    <Users className="w-2.5 h-2.5" />
                                    <span>Onboarding</span>
                                  </Link>
                                  <span className="text-[10px] text-ink-soft">Offers</span>
                                </div>
                              );
                            }

                            return (
                              <div className="flex items-center justify-between pt-0.5">
                                <span className="text-[10px] font-semibold text-ink-soft">
                                  {stage.stageType === "resume_match" ? "Automated Matching" : "Stage Active"}
                                </span>
                                {stage.passingScore ? (
                                  <span className="text-[10px] text-ink-soft">
                                    Pass: <strong className="text-ink">{stage.passingScore}%</strong>
                                  </span>
                                ) : null}
                              </div>
                            );
                          })()}

                          {/* Quota Progress */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] text-ink-soft">
                              <span>Target: {stage.targetCount}</span>
                              {hasDeficit ? (
                                <span className="text-amber-600 font-bold">Deficit: {stage.deficit}</span>
                              ) : (
                                <span className="text-emerald-600 font-bold">Full</span>
                              )}
                            </div>
                            <div className="w-full bg-surface-alt h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                  hasDeficit ? "bg-amber-500" : "bg-emerald-500"
                                }`}
                                style={{
                                  width: `${Math.min(
                                    100,
                                    Math.round(
                                      ((stage.activeCount ?? pool.primary.length) / stage.targetCount) * 100
                                    )
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>

                          {/* Refill Button if deficit and reserve exists */}
                          {hasDeficit && pool.reserve.length > 0 && (
                            <button
                              type="button"
                              onClick={() => handleOpenRefillModal(stage.stageId, stage.stageName)}
                              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/20 text-[10px] font-bold transition cursor-pointer"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Refill from Reserve ({pool.reserve.length} ready)</span>
                            </button>
                          )}
                        </div>

                        {/* Column Candidate Cards List */}
                        <div className="p-2.5 overflow-y-auto flex-1 space-y-3 scrollbar-thin">
                          {/* Primary Candidates */}
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-[10px] px-1 font-bold text-ink uppercase tracking-wider">
                              <span className="flex items-center gap-1 text-emerald-600">
                                <CheckCircle2 className="w-3 h-3" />
                                Primary ({filteredPrimary.length})
                              </span>
                            </div>

                            {filteredPrimary.length === 0 ? (
                              <div className="p-3 rounded-xl border border-dashed border-border/80 text-center text-[10px] text-ink-soft bg-surface/50">
                                No active candidates in this stage.
                              </div>
                            ) : (
                              filteredPrimary.map((candidate) => (
                                <CandidateCard
                                  key={candidate._id}
                                  candidate={candidate}
                                  stageName={stage.stageName}
                                  isPrimary={true}
                                  onCardClick={() => {
                                    setSelectedCandidate(candidate);
                                    setIsDrawerOpen(true);
                                  }}
                                  onAdvance={() => handleOpenAdvanceModal(candidate, stage.stageName)}
                                  onFail={() => handleOpenFailModal(candidate, stage.stageName)}
                                />
                              ))
                            )}
                          </div>

                          {/* Reserve Pool Candidates */}
                          <div className="space-y-2 pt-2 border-t border-border/60">
                            <div className="flex items-center justify-between text-[10px] px-1 font-bold text-ink-soft uppercase tracking-wider">
                              <span className="flex items-center gap-1 text-amber-600">
                                <Layers className="w-3 h-3" />
                                Reserve Pool ({filteredReserve.length})
                              </span>
                            </div>

                            {filteredReserve.length === 0 ? (
                              <div className="p-2.5 rounded-xl border border-dashed border-border/60 text-center text-[10px] text-ink-soft bg-surface/30">
                                No candidates in reserve.
                              </div>
                            ) : (
                              filteredReserve.map((candidate) => (
                                <CandidateCard
                                  key={candidate._id}
                                  candidate={candidate}
                                  stageName={stage.stageName}
                                  isPrimary={false}
                                  onCardClick={() => {
                                    setSelectedCandidate(candidate);
                                    setIsDrawerOpen(true);
                                  }}
                                  onAdvance={() => handleOpenAdvanceModal(candidate, stage.stageName)}
                                  onFail={() => handleOpenFailModal(candidate, stage.stageName)}
                                />
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Final Shortlist Destination Column */}
                  <div className="w-76 sm:w-80 shrink-0 bg-gradient-to-b from-purple-500/10 via-primary/5 to-surface-alt/30 border border-purple-500/30 rounded-2xl flex flex-col max-h-[720px] shadow-xs">
                    <div className="p-3.5 border-b border-purple-500/20 bg-surface/90 rounded-t-2xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-purple-600" />
                          <h3 className="text-xs font-extrabold text-ink">Final Shortlist</h3>
                        </div>
                        <span className="text-xs font-extrabold text-purple-600 px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                          {metrics.currentShortlistedCount}/{metrics.finalShortlistTarget}
                        </span>
                      </div>
                      <p className="text-[10px] text-ink-soft">
                        Candidates completing all stages ready for final offer extension.
                      </p>
                    </div>

                    <div className="p-6 flex-1 flex flex-col items-center justify-center text-center space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 flex items-center justify-center border border-purple-500/20 shadow-xs">
                        <Award className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-extrabold text-ink">
                          {metrics.currentShortlistedCount} Finalist
                          {metrics.currentShortlistedCount === 1 ? "" : "s"} Qualified
                        </h4>
                        <p className="text-[11px] text-ink-soft max-w-[200px] mx-auto">
                          Review candidate reports, benchmark interview scores, and extend offers.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleTabChange("final-shortlist")}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gradient-brand text-white text-xs font-bold shadow-xs hover:opacity-95 transition cursor-pointer"
                      >
                        <span>View Final Shortlist</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : activeTab === "resume-screening" ? (
                /* ----------------------------------------------------------- */
                /* TAB 3: RESUME SHORTLISTING (Qualification Stage Overview)   */
                /* ----------------------------------------------------------- */
                <div className="bg-surface border border-border rounded-3xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-ink flex items-center gap-2">
                        <FileCheck2 className="w-5 h-5 text-primary" />
                        Stage 1: Resume Shortlisting &amp; Qualification
                      </h3>
                      <p className="text-xs text-ink-soft mt-0.5">
                        Automated ATS matching and semantic credential verification for incoming candidate applications.
                      </p>
                    </div>
                    <Link
                      href={`/recruiter/hiring-pipeline/resume-screening?jobId=${selectedJobId}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-primary text-white shadow-xs hover:bg-primary/90 transition"
                    >
                      <span>Open Screening Suite</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                    <div className="p-4 rounded-2xl bg-surface-alt/60 border border-border space-y-1">
                      <span className="text-[11px] font-bold text-ink-soft">Matching Quota Target</span>
                      <p className="text-2xl font-black text-ink">{metrics.totalApplicants}</p>
                      <span className="text-[10px] text-ink-soft">Total applications collected</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                      <span className="text-[11px] font-bold text-emerald-600">Qualified For Stage 1</span>
                      <p className="text-2xl font-black text-emerald-600">{metrics.actualQualifiedCount || metrics.primaryPoolSize}</p>
                      <span className="text-[10px] text-emerald-600/80">Passed ATS threshold</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-1">
                      <span className="text-[11px] font-bold text-purple-600">Reserve Backlog</span>
                      <p className="text-2xl font-black text-purple-600">{metrics.reservePoolSize}</p>
                      <span className="text-[10px] text-purple-600/80">Available for dynamic refill</span>
                    </div>
                  </div>

                  <p className="text-xs text-ink-soft leading-relaxed pt-2 border-t border-border/60">
                    Candidates who meet the threshold score are automatically invited to Stage 2 ({metrics.stages?.[1]?.stageName || "Assessments"}). You can inspect individual resumes or adjust minimum passing percentages in the Screening Suite.
                  </p>
                </div>
              ) : activeTab === "final-shortlist" ? (
                /* ----------------------------------------------------------- */
                /* TAB 4: FINAL SHORTLIST                                      */
                /* ----------------------------------------------------------- */
                <div className="bg-surface border border-border rounded-3xl p-6 shadow-xs space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-extrabold text-ink flex items-center gap-2">
                        <Award className="w-5 h-5 text-purple-600" />
                        Final Shortlisted Candidates
                      </h3>
                      <p className="text-xs text-ink-soft mt-0.5">
                        Candidates who successfully passed all {metrics.stages.length} pipeline evaluation stages.
                      </p>
                    </div>
                    <Link
                      href={`/recruiter/hiring-pipeline/final-shortlist?jobId=${selectedJobId}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-brand text-white shadow-xs hover:opacity-95 transition"
                    >
                      <span>Full Finalist Management</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-ink">
                        {metrics.currentShortlistedCount} of {metrics.finalShortlistTarget} Finalists Qualified
                      </span>
                      <p className="text-[11px] text-ink-soft">
                        Target quota is {Math.round((metrics.currentShortlistedCount / metrics.finalShortlistTarget) * 100)}% complete.
                      </p>
                    </div>
                    <span className="text-sm font-black text-purple-600 px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20">
                      Quota: {metrics.finalShortlistTarget}
                    </span>
                  </div>

                  <div className="text-xs text-ink-soft leading-relaxed">
                    View full candidate decision sheets, benchmark candidate test performances, send formal job offers, or record final hiring outcomes in the Finalist Management portal.
                  </div>
                </div>
              ) : (
                /* ----------------------------------------------------------- */
                /* TAB 5: CANDIDATE LISTING (Directory Table)                  */
                /* ----------------------------------------------------------- */
                <div className="bg-surface border border-border rounded-2xl shadow-xs overflow-hidden">
                  <div className="p-4 border-b border-border/70 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-ink">All Pipeline Candidates</h3>
                      <p className="text-[11px] text-ink-soft">
                        Showing {allCandidatesList.length} candidate(s) currently being evaluated across all stages.
                      </p>
                    </div>
                  </div>

                  {allCandidatesList.length === 0 ? (
                    <div className="p-8 text-center text-xs text-ink-soft">
                      No candidates currently assigned to this pipeline.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-surface-alt/60 text-ink-soft font-semibold border-b border-border text-[11px]">
                          <tr>
                            <th className="py-2.5 px-4">Candidate</th>
                            <th className="py-2.5 px-3">Current Stage</th>
                            <th className="py-2.5 px-3">Status</th>
                            <th className="py-2.5 px-3">Match Score</th>
                            <th className="py-2.5 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {allCandidatesList.map(({ candidate, stageName }) => {
                            const user =
                              typeof candidate.userId === "object" ? (candidate.userId as PopulatedUser) : null;
                            const name = user?.fullName || user?.username || "Candidate";
                            const email = user?.email || "No email";

                            return (
                              <tr key={candidate._id} className="hover:bg-surface-alt/40 transition">
                                <td className="py-3 px-4">
                                  <div className="font-bold text-ink">{name}</div>
                                  <div className="text-[11px] text-ink-soft">{email}</div>
                                </td>
                                <td className="py-3 px-3">
                                  <span className="font-medium text-ink">{stageName}</span>
                                </td>
                                <td className="py-3 px-3">
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary-glow capitalize">
                                    {candidate.stageStatus || "Active"}
                                  </span>
                                </td>
                                <td className="py-3 px-3">
                                  <span className="font-bold text-emerald-600">
                                    {candidate.matchScore !== undefined ? `${candidate.matchScore}%` : "—"}
                                  </span>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedCandidate(candidate);
                                      setIsDrawerOpen(true);
                                    }}
                                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-surface-alt hover:bg-surface border border-border text-ink transition cursor-pointer"
                                  >
                                    <Eye className="w-3 h-3" />
                                    <span>Profile</span>
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
              )}
            </div>
          )}
        </main>
      </div>

      {/* Candidate Detail Drawer */}
      <CandidateDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        jobId={selectedJobId}
        candidate={selectedCandidate}
        onAdvanceClick={(c) => handleOpenAdvanceModal(c)}
        onFailClick={(c) => handleOpenFailModal(c)}
      />

      {/* Confirmation Modal */}
      <ConfirmActionModal
        isOpen={confirmModalState.isOpen}
        onClose={() => setConfirmModalState((prev) => ({ ...prev, isOpen: false }))}
        type={confirmModalState.type}
        title={confirmModalState.title}
        description={confirmModalState.description}
        candidateName={
          confirmModalState.candidate
            ? typeof confirmModalState.candidate.userId === "object"
              ? (confirmModalState.candidate.userId as PopulatedUser)?.fullName
              : "Candidate"
            : undefined
        }
        stageName={confirmModalState.stageName}
        onConfirm={handleExecuteModalAction}
      />

      {/* Init Pipeline Modal */}
      <InitPipelineModal
        isOpen={showInitModal}
        onClose={() => setShowInitModal(false)}
        jobId={selectedJobId}
        jobTitle={selectedJob?.title}
        onSuccess={loadPipelineData}
      />
    </div>
  );
}

// Subcomponent: Candidate Card inside Kanban Columns
function CandidateCard({
  candidate,
  stageName,
  isPrimary,
  onCardClick,
  onAdvance,
  onFail,
}: {
  candidate: HiringEngineCandidate;
  stageName: string;
  isPrimary: boolean;
  onCardClick: () => void;
  onAdvance: () => void;
  onFail: () => void;
}) {
  const user = typeof candidate.userId === "object" ? (candidate.userId as PopulatedUser) : null;
  const name = user?.fullName || user?.username || "Candidate";
  const email = user?.email;

  const isFailed = candidate.stageStatus === "failed";
  const isPassed = candidate.stageStatus === "passed";

  return (
    <div
      onClick={onCardClick}
      className={`p-3 rounded-xl border transition-all cursor-pointer shadow-2xs hover:shadow-xs group space-y-2 ${
        isPrimary
          ? "bg-surface border-border hover:border-primary/50"
          : "bg-surface/60 border-border/70 hover:border-amber-500/40 opacity-90 hover:opacity-100"
      }`}
    >
      {/* Top: Name & Pool Badge */}
      <div className="flex items-start justify-between gap-1.5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-ink truncate group-hover:text-primary transition" title={name}>
              {name}
            </span>
            {candidate.matchScore !== undefined && (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded shrink-0">
                {candidate.matchScore}%
              </span>
            )}
          </div>
          {email && <p className="text-[10px] text-ink-soft truncate">{email}</p>}
        </div>

        <span
          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full border shrink-0 ${
            isPrimary
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              : "bg-amber-500/10 text-amber-600 border-amber-500/20"
          }`}
        >
          {isPrimary ? "Primary" : "Reserve"}
        </span>
      </div>

      {/* Stage Status */}
      <div className="flex items-center justify-between text-[10px] text-ink-soft pt-1 border-t border-border/50">
        <span className="capitalize font-medium">Status: {candidate.stageStatus || "Invited"}</span>
        {(candidate.assessmentScore ?? candidate.aiScore ?? candidate.matchScore) !== undefined && (
          <span className="font-bold text-ink">
            Score: {candidate.assessmentScore ?? candidate.aiScore ?? candidate.matchScore}
          </span>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div
        className="flex items-center gap-1.5 pt-1"
        onClick={(e) => e.stopPropagation()} // Prevent opening drawer
      >
        <button
          type="button"
          onClick={onAdvance}
          disabled={isFailed}
          className="flex-1 py-1 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-500/20 transition disabled:opacity-40 cursor-pointer text-center"
        >
          Advance
        </button>
        <button
          type="button"
          onClick={onFail}
          disabled={isFailed || isPassed}
          className="py-1 px-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 text-[10px] font-bold border border-rose-500/20 transition disabled:opacity-40 cursor-pointer text-center"
        >
          Disqualify
        </button>
      </div>
    </div>
  );
}
