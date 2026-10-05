"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Search,
  Briefcase,
  Heart,
  Send,
  CalendarClock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Zap,
  Compass,
  Filter,
  ArrowUpDown,
  Building2,
  MapPin,
  Sparkles,
  FileText,
  Clock,
  X,
  Plus,
  StickyNote,
  ExternalLink,
  ChevronRight,
  LayoutGrid,
  List,
  Layers,
} from "lucide-react";
import { KanbanColumn, KanbanColumnConfig } from "./KanbanColumn";
import { KanbanJobCard, KanbanJobItem } from "./KanbanJobCard";
import { applicationService } from "@/features/applications/services/applicationService";
import {
  ApplicationItem,
  ApplicationStatus,
} from "@/features/applications/types";
import { jobService } from "../services/jobService";
import { IJob } from "../types/job.types";
import { JobApplyModal } from "./JobApplyModal";
import { useRouter } from "next/navigation";

interface JobsBoardProps {
  onSwitchTab?: (
    tab: "overview" | "kanban" | "calendar" | "jobs" | "resume" | "coverLetter" | "videoProfile",
  ) => void;
  initialStageFilter?: string;
  initialViewMode?: "kanban" | "list";
}

export function JobsBoard({
  onSwitchTab,
  initialStageFilter = "all",
  initialViewMode = "kanban",
}: JobsBoardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [savedJobs, setSavedJobs] = useState<KanbanJobItem[]>([]);
  const [allRecommendedJobs, setAllRecommendedJobs] = useState<IJob[]>([]);

  // Stage Tab Filter State
  const [activeStageTab, setActiveStageTab] = useState<string>(
    initialStageFilter || "all",
  );
  const [viewMode, setViewMode] = useState<"kanban" | "list">(initialViewMode || "kanban");

  useEffect(() => {
    if (initialViewMode) {
      setViewMode(initialViewMode);
    }
  }, [initialViewMode]);

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [companyFilter, setCompanyFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortOption, setSortOption] = useState<
    "newest" | "oldest" | "matchScore" | "company"
  >("newest");

  // Detail Modal & Apply Modal State
  const [selectedJob, setSelectedJob] = useState<KanbanJobItem | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [applyJobTarget, setApplyJobTarget] = useState<IJob | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialStageFilter) {
      setActiveStageTab(initialStageFilter);
    }
  }, [initialStageFilter]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // 1. Fetch live data (applications + saved jobs + catalog)
  const fetchBoardData = useCallback(async () => {
    setLoading(true);
    try {
      // A. Fetch applications
      const appRes = await applicationService.getApplications({
        limit: 100,
        sort: "recent",
      });
      const apps = appRes.applications || [];
      setApplications(apps);

      // B. Fetch jobs catalog / recommendations to resolve saved jobs
      let recJobs: IJob[] = [];
      try {
        const jobsRes = await jobService.getRecommendations({ limit: 50 });
        recJobs = jobsRes.jobs || [];
        setAllRecommendedJobs(recJobs);
      } catch (recErr) {
        console.warn("Failed to load recommended jobs for saved list:", recErr);
      }

      // C. Resolve saved jobs from localStorage
      if (typeof window !== "undefined") {
        try {
          const savedStr = localStorage.getItem("resumebuildai_saved_jobs");
          const savedIds: string[] = savedStr ? JSON.parse(savedStr) : [];

          // Map saved IDs to full job objects
          const savedItems: KanbanJobItem[] = savedIds.map((id) => {
            const matchedJob = recJobs.find((j) => j._id === id);
            return {
              _id: `saved_${id}`,
              jobId: id,
              stage: "saved",
              title: matchedJob?.title || "Saved Job Position",
              company: {
                name: matchedJob?.company?.name || "Company",
                logo: matchedJob?.company?.logo,
                website: matchedJob?.company?.website,
              },
              location: matchedJob?.location,
              salary: matchedJob?.salary,
              workplaceType: matchedJob?.workplaceType,
              employmentType: matchedJob?.employmentType,
              experienceLevel: matchedJob?.experienceLevel,
              matchScore: matchedJob?.matchScore || 80,
              source: "saved",
              savedAt: new Date().toISOString(),
              skills: matchedJob?.skills || [],
              responsibilities: matchedJob?.responsibilities || [],
              requirements: matchedJob?.requirements || [],
              preferredQualifications:
                matchedJob?.preferredQualifications || [],
              benefits: matchedJob?.benefits || [],
              applicationUrl: matchedJob?.applicationUrl || "",
              description: matchedJob?.description || "",
            };
          });
          setSavedJobs(savedItems);
        } catch {
          setSavedJobs([]);
        }
      }
    } catch (err) {
      console.warn("Failed to fetch board data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBoardData();
  }, [fetchBoardData]);

  // 2. Map applications to KanbanJobItems
  const applicationItems = useMemo<KanbanJobItem[]>(() => {
    return applications.map((app) => {
      let stage: KanbanJobItem["stage"] = "applied";
      if (app.status === "interviewing") stage = "interviewing";
      else if (app.status === "offered") stage = "offered";
      else if (app.status === "rejected" || app.status === "failed")
        stage = "rejected";
      else stage = "applied";

      return {
        _id: app._id,
        jobId: app.job?._id || app._id,
        stage,
        title: app.job?.title || "Job Position",
        company: {
          name: app.job?.company?.name || "Company",
          logo: app.job?.company?.logo,
          website: app.job?.company?.website,
        },
        location: app.job?.location,
        salary: app.job?.salary,
        workplaceType: app.job?.workplaceType,
        employmentType: app.job?.employmentType,
        experienceLevel: app.job?.experienceLevel,
        matchScore: app.matchScore || 75,
        source: app.source || "manual",
        applicationStatus: app.status,
        appliedAt: app.appliedAt || app.createdAt,
        notes: app.notes || "",
        resumeTitle: app.resume?.title || "Attached Resume",
        skills: app.job?.skills || [],
        responsibilities: app.job?.responsibilities || [],
        requirements: app.job?.requirements || [],
        preferredQualifications: app.job?.preferredQualifications || [],
        benefits: app.job?.benefits || [],
        applicationUrl: app.job?.applicationUrl || "",
        description: app.job?.description || "",
      };
    });
  }, [applications]);

  // 3. Combined all items
  const allItems = useMemo<KanbanJobItem[]>(() => {
    return [...savedJobs, ...applicationItems];
  }, [savedJobs, applicationItems]);

  // 4. Extract unique companies for filter dropdown
  const uniqueCompanies = useMemo(() => {
    const set = new Set<string>();
    allItems.forEach((item) => {
      if (item.company?.name) set.add(item.company.name);
    });
    return Array.from(set).sort();
  }, [allItems]);

  // 5. Apply filters & sorting
  const filteredAndSortedItems = useMemo(() => {
    let result = [...allItems];

    // Stage Tab Filter
    if (activeStageTab !== "all") {
      result = result.filter((item) => item.stage === activeStageTab);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.company?.name?.toLowerCase().includes(q) ||
          item.location?.city?.toLowerCase().includes(q) ||
          item.skills?.some((s) => s.toLowerCase().includes(q)),
      );
    }

    // Company filter
    if (companyFilter !== "all") {
      result = result.filter((item) => item.company?.name === companyFilter);
    }

    // Date filter
    if (dateFilter !== "all") {
      const now = new Date().getTime();
      result = result.filter((item) => {
        const itemDateStr = item.appliedAt || item.savedAt;
        if (!itemDateStr) return true;
        const itemTime = new Date(itemDateStr).getTime();
        const diffHours = (now - itemTime) / (1000 * 60 * 60);

        if (dateFilter === "24h") return diffHours <= 24;
        if (dateFilter === "7d") return diffHours <= 24 * 7;
        if (dateFilter === "30d") return diffHours <= 24 * 30;
        return true;
      });
    }

    // Sort
    result.sort((a, b) => {
      if (sortOption === "newest") {
        const dateA = new Date(a.appliedAt || a.savedAt || 0).getTime();
        const dateB = new Date(b.appliedAt || b.savedAt || 0).getTime();
        return dateB - dateA;
      }
      if (sortOption === "oldest") {
        const dateA = new Date(a.appliedAt || a.savedAt || 0).getTime();
        const dateB = new Date(b.appliedAt || b.savedAt || 0).getTime();
        return dateA - dateB;
      }
      if (sortOption === "matchScore") {
        return (b.matchScore || 0) - (a.matchScore || 0);
      }
      if (sortOption === "company") {
        return (a.company?.name || "").localeCompare(b.company?.name || "");
      }
      return 0;
    });

    return result;
  }, [
    allItems,
    activeStageTab,
    searchQuery,
    companyFilter,
    dateFilter,
    sortOption,
  ]);

  // Counts per stage
  const savedCount = allItems.filter((i) => i.stage === "saved").length;
  const appliedCount = allItems.filter((i) => i.stage === "applied").length;
  const interviewingCount = allItems.filter(
    (i) => i.stage === "interviewing",
  ).length;
  const offeredCount = allItems.filter((i) => i.stage === "offered").length;
  const rejectedCount = allItems.filter((i) => i.stage === "rejected").length;

  // Group by Column Stage for Kanban
  const jobsByColumn: Record<KanbanColumnConfig["id"], KanbanJobItem[]> =
    useMemo(() => {
      return {
        saved: filteredAndSortedItems.filter((i) => i.stage === "saved"),
        applied: filteredAndSortedItems.filter((i) => i.stage === "applied"),
        interviewing: filteredAndSortedItems.filter(
          (i) => i.stage === "interviewing",
        ),
        offered: filteredAndSortedItems.filter((i) => i.stage === "offered"),
        rejected: filteredAndSortedItems.filter((i) => i.stage === "rejected"),
      };
    }, [filteredAndSortedItems]);

  const totalFilteredCount = filteredAndSortedItems.length;
  const grandTotalCount = allItems.length;

  // Stage change handler
  const handleMoveStage = async (
    job: KanbanJobItem,
    newStage: KanbanJobItem["stage"],
  ) => {
    if (job.stage === newStage) return;

    // A. If moving FROM Saved TO an application stage
    if (job.stage === "saved") {
      try {
        let appStatus: ApplicationStatus = "submitted";
        if (newStage === "interviewing") appStatus = "interviewing";
        else if (newStage === "offered") appStatus = "offered";
        else if (newStage === "rejected") appStatus = "rejected";

        // 1. Create in backend
        const createdApp = await applicationService.createApplication({
          jobId: job.jobId,
          status: appStatus,
          matchScore: job.matchScore,
          source: "manual",
        });

        // 2. Remove from saved jobs in localStorage
        if (typeof window !== "undefined") {
          try {
            const savedStr = localStorage.getItem("resumebuildai_saved_jobs");
            const savedIds: string[] = savedStr ? JSON.parse(savedStr) : [];
            const next = savedIds.filter((id) => id !== job.jobId);
            localStorage.setItem(
              "resumebuildai_saved_jobs",
              JSON.stringify(next),
            );
          } catch {}
        }

        // 3. Update local state
        setSavedJobs((prev) => prev.filter((j) => j.jobId !== job.jobId));
        setApplications((prev) => [
          createdApp,
          ...prev.filter((a) => a._id !== createdApp._id),
        ]);
        showToast(`Job moved to ${newStage.toUpperCase()} stage!`);
      } catch (err) {
        console.warn("Failed to move saved job to application stage:", err);
        showToast("Failed to update stage. Please try again.");
      }
      return;
    }

    // B. If moving between application stages
    try {
      let targetStatus: ApplicationStatus = "submitted";
      if (newStage === "interviewing") targetStatus = "interviewing";
      else if (newStage === "offered") targetStatus = "offered";
      else if (newStage === "rejected") targetStatus = "rejected";
      else if (newStage === "applied") targetStatus = "submitted";

      // Optimistic update
      setApplications((prev) =>
        prev.map((app) =>
          app._id === job._id ? { ...app, status: targetStatus } : app,
        ),
      );

      if (selectedJob?._id === job._id) {
        setSelectedJob((prev) =>
          prev
            ? { ...prev, stage: newStage, applicationStatus: targetStatus }
            : null,
        );
      }

      await applicationService.updateStatus(job._id, targetStatus);
      showToast(`Status updated to ${newStage.toUpperCase()}!`);
    } catch (err) {
      console.warn("Failed to update application status:", err);
      showToast("Failed to update status.");
      fetchBoardData(); // Revert on failure
    }
  };

  // Delete / Withdraw handler
  const handleDeleteJob = async (job: KanbanJobItem) => {
    if (job.stage === "saved") {
      if (typeof window !== "undefined") {
        try {
          const savedStr = localStorage.getItem("resumebuildai_saved_jobs");
          const savedIds: string[] = savedStr ? JSON.parse(savedStr) : [];
          const next = savedIds.filter((id) => id !== job.jobId);
          localStorage.setItem(
            "resumebuildai_saved_jobs",
            JSON.stringify(next),
          );
        } catch {}
      }
      setSavedJobs((prev) => prev.filter((j) => j.jobId !== job.jobId));
      if (selectedJob?._id === job._id) setSelectedJob(null);
      showToast("Removed from saved jobs.");
      return;
    }

    if (
      !confirm(
        "Are you sure you want to withdraw or remove this application record?",
      )
    )
      return;

    try {
      await applicationService.deleteApplication(job._id);
      setApplications((prev) => prev.filter((a) => a._id !== job._id));
      if (selectedJob?._id === job._id) setSelectedJob(null);
      showToast("Application record withdrawn.");
    } catch (err) {
      console.warn("Failed to delete application:", err);
      showToast("Failed to remove application.");
    }
  };

  // Open apply modal for saved job
  const handleApplySavedJob = (job: KanbanJobItem) => {
    const jobObj: IJob = {
      _id: job.jobId,
      title: job.title,
      company: job.company,
      description: job.description || "",
      responsibilities: job.responsibilities || [],
      requirements: job.requirements || [],
      preferredQualifications: job.preferredQualifications || [],
      skills: job.skills || [],
      experienceLevel: (job.experienceLevel as any) || "mid",
      minimumExperience: 1,
      employmentType: (job.employmentType as any) || "full-time",
      workplaceType: (job.workplaceType as any) || "remote",
      location: {
        city: job.location?.city,
        state: job.location?.state,
        country: job.location?.country || "Remote",
        remote: job.location?.remote ?? true,
      },
      salary: {
        min: job.salary?.min || 0,
        max: job.salary?.max || 0,
        currency: job.salary?.currency || "INR",
        period: (job.salary?.period as any) || "yearly",
      },
      benefits: job.benefits || [],
      applicationUrl: job.applicationUrl || "",
      source: "manual",
      publishedAt: job.savedAt || new Date().toISOString(),
      matchScore: job.matchScore || 80,
      matchedSkills: job.skills?.slice(0, 4) || [],
      missingSkills: [],
      matchReasons: [],
    };
    setApplyJobTarget(jobObj);
    setIsApplyModalOpen(true);
  };

  // Select job to view details modal
  const handleSelectJob = (job: KanbanJobItem) => {
    setSelectedJob(job);
    setNotesDraft(job.notes || "");
  };

  // Save notes handler
  const handleSaveNotes = async () => {
    if (!selectedJob || selectedJob.stage === "saved") return;
    setIsSavingNotes(true);
    try {
      await applicationService.updateStatus(
        selectedJob._id,
        selectedJob.applicationStatus || "submitted",
        notesDraft,
      );
      setApplications((prev) =>
        prev.map((a) =>
          a._id === selectedJob._id ? { ...a, notes: notesDraft } : a,
        ),
      );
      setSelectedJob((prev) => (prev ? { ...prev, notes: notesDraft } : null));
      showToast("Interview notes saved successfully.");
    } catch (err) {
      console.warn("Failed to save notes:", err);
      showToast("Failed to save notes.");
    } finally {
      setIsSavingNotes(false);
    }
  };

  const JOB_STATUS_COLUMNS: KanbanColumnConfig[] = [
    {
      id: "saved",
      title: "Saved",
      icon: Heart,
      accentClass: "bg-indigo-500",
      iconWrapClass: "text-indigo-500",
      emptyTitle: "No saved jobs yet",
      emptyDescription: "Jobs you bookmark from Explore will appear here.",
      emptyCtaLabel: "Explore Opportunities",
      onEmptyCtaClick: () => router.push("/explore"),
    },
    {
      id: "applied",
      title: "Applied",
      icon: Send,
      accentClass: "bg-cyan-500",
      iconWrapClass: "text-cyan-500",
      emptyTitle: "No applied jobs yet",
      emptyDescription:
        "Jobs you apply to directly or via AI will appear here.",
      emptyCtaLabel: "Start AI Auto-Apply",
      onEmptyCtaClick: () => router.push("/ai-apply"),
    },
    {
      id: "interviewing",
      title: "Interviewing",
      icon: CalendarClock,
      accentClass: "bg-blue-500",
      iconWrapClass: "text-blue-500",
      emptyTitle: "No interviews yet",
      emptyDescription: "Jobs with active interview rounds will appear here.",
    },
    {
      id: "offered",
      title: "Offered",
      icon: CheckCircle2,
      accentClass: "bg-emerald-500",
      iconWrapClass: "text-emerald-500",
      emptyTitle: "No offers yet",
      emptyDescription:
        "Jobs where you receive an official offer will appear here.",
    },
    {
      id: "rejected",
      title: "Rejected",
      icon: XCircle,
      accentClass: "bg-rose-500",
      iconWrapClass: "text-rose-500",
      emptyTitle: "No rejected jobs",
      emptyDescription:
        "Archived applications no longer progressing will appear here.",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 p-3.5 px-4 rounded-2xl bg-ink text-white font-bold text-xs shadow-2xl border border-white/20 animate-in slide-in-from-top duration-200 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-primary-glow" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight">
            My Jobs
          </h1>
          <p className="text-xs text-ink-soft mt-1">
            Track your applications across each stage ·{" "}
            <span className="font-bold text-ink">{grandTotalCount} jobs</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle (Kanban vs Single-Stage List) */}
          <div className="bg-surface border border-border rounded-xl p-1 flex items-center gap-1 shadow-2xs">
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                viewMode === "kanban"
                  ? "bg-primary text-white shadow-2xs"
                  : "text-ink-soft hover:text-ink"
              }`}
              title="Kanban Board View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kanban</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                viewMode === "list"
                  ? "bg-primary text-white shadow-2xs"
                  : "text-ink-soft hover:text-ink"
              }`}
              title="List / Stage Focus View"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          <button
            type="button"
            onClick={fetchBoardData}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface border border-border text-ink-soft hover:text-ink hover:bg-surface-alt font-semibold text-xs transition cursor-pointer shadow-2xs"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
            />
            <span>Sync</span>
          </button>

          <button
            type="button"
            onClick={() => router.push("/ai-apply")}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-brand text-white font-bold text-xs shadow-xs hover:shadow-glow transition cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>AI Auto-Apply</span>
          </button>
        </div>
      </div>

      {/* 6 Interactive Stage Selection Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          // {
          //   id: 'all',
          //   label: 'All Stages',
          //   count: grandTotalCount,
          //   icon: Layers,
          //   accentColor: 'from-primary to-primary-glow',
          //   iconWrapClass: 'text-primary bg-primary/10 border-primary/20',
          //   borderColor: 'hover:border-primary/40',
          //   activeClass: 'ring-2 ring-primary border-primary/40 bg-primary/5 dark:bg-primary/10 shadow-xs',
          //   description: 'All pipeline jobs',
          // },
          {
            id: "saved",
            label: "Saved",
            count: savedCount,
            icon: Heart,
            accentColor: "from-indigo-500 to-purple-600",
            iconWrapClass:
              "text-indigo-500 bg-indigo-500/10 border-indigo-500/20",
            borderColor: "hover:border-indigo-500/40",
            activeClass:
              "ring-2 ring-indigo-500 border-indigo-500/40 bg-indigo-500/5 dark:bg-indigo-500/10 shadow-xs",
            description: "Bookmarked jobs",
          },
          {
            id: "applied",
            label: "Applied",
            count: appliedCount,
            icon: Send,
            accentColor: "from-cyan-500 to-blue-600",
            iconWrapClass: "text-cyan-500 bg-cyan-500/10 border-cyan-500/20",
            borderColor: "hover:border-cyan-500/40",
            activeClass:
              "ring-2 ring-cyan-500 border-cyan-500/40 bg-cyan-500/5 dark:bg-cyan-500/10 shadow-xs",
            description: "Submitted & review",
          },
          {
            id: "interviewing",
            label: "Interviewing",
            count: interviewingCount,
            icon: CalendarClock,
            accentColor: "from-blue-500 to-indigo-600",
            iconWrapClass: "text-blue-500 bg-blue-500/10 border-blue-500/20",
            borderColor: "hover:border-blue-500/40",
            activeClass:
              "ring-2 ring-blue-500 border-blue-500/40 bg-blue-500/5 dark:bg-blue-500/10 shadow-xs",
            description: "Active rounds",
          },
          {
            id: "offered",
            label: "Offered",
            count: offeredCount,
            icon: CheckCircle2,
            accentColor: "from-emerald-500 to-teal-600",
            iconWrapClass:
              "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
            borderColor: "hover:border-emerald-500/40",
            activeClass:
              "ring-2 ring-emerald-500 border-emerald-500/40 bg-emerald-500/5 dark:bg-emerald-500/10 shadow-xs",
            description: "Job offers",
          },
          {
            id: "rejected",
            label: "Rejected",
            count: rejectedCount,
            icon: XCircle,
            accentColor: "from-rose-500 to-red-600",
            iconWrapClass: "text-rose-500 bg-rose-500/10 border-rose-500/20",
            borderColor: "hover:border-rose-500/40",
            activeClass:
              "ring-2 ring-rose-500 border-rose-500/40 bg-rose-500/5 dark:bg-rose-500/10 shadow-xs",
            description: "Closed / archived",
          },
        ].map((card) => {
          const Icon = card.icon;
          const isActive = activeStageTab === card.id;

          return (
            <button
              key={card.id}
              type="button"
              onClick={() => setActiveStageTab(card.id)}
              className={`group relative bg-surface border rounded-2xl p-3.5 sm:p-4 text-left transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between space-y-2 select-none ${
                isActive
                  ? card.activeClass
                  : `border-border ${card.borderColor} hover:bg-surface-alt/40 shadow-2xs`
              }`}
            >
              {/* Top Accent Line */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.accentColor}`}
              />

              <div className="flex items-center justify-between gap-1.5 pt-0.5">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center border ${card.iconWrapClass} shrink-0 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                {isActive && (
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-md bg-primary text-white">
                    Active
                  </span>
                )}
              </div>

              <div className="space-y-0.5 min-w-0">
                <div
                  className={`text-xl sm:text-2xl font-black tracking-tight ${isActive ? "text-primary" : "text-ink"}`}
                >
                  {card.count}
                </div>
                <div className="text-xs font-bold text-ink truncate">
                  {card.label}
                </div>
                <p className="text-[10px] text-ink-soft truncate">
                  {card.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search / Filter Bar */}
      {/* <div className="bg-surface border border-border rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shadow-2xs">
     
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-ink-soft absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search jobs or companies..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border bg-surface-alt/50 text-xs font-medium text-ink placeholder:text-ink-soft/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-glow"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          aria-label="Filter by company"
          className="text-xs font-semibold px-3 py-2 rounded-xl border border-border bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
          <option value="all">All companies</option>
          {uniqueCompanies.map((comp) => (
            <option key={comp} value={comp}>
              {comp}
            </option>
          ))}
        </select>

   
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          aria-label="Filter by date"
          className="text-xs font-semibold px-3 py-2 rounded-xl border border-border bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
          <option value="all">Any date</option>
          <option value="24h">Past 24 hours</option>
          <option value="7d">Past 7 days</option>
          <option value="30d">Past 30 days</option>
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as any)}
          aria-label="Sort jobs"
          className="text-xs font-semibold px-3 py-2 rounded-xl border border-border bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="matchScore">Highest match score</option>
          <option value="company">Company (A-Z)</option>
        </select>

    
        <div className="text-xs text-ink-soft font-bold whitespace-nowrap px-1 self-center">
          {totalFilteredCount} of {grandTotalCount}
        </div>
      </div>  */}

      {/* Main Board View: Kanban or List */}
      {viewMode === "kanban" && activeStageTab === "all" ? (
        /* 5-Column Kanban Board */
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4 -mx-1 px-1 sm:overflow-visible scrollbar-thin">
          {/* {JOB_STATUS_COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              config={column}
              jobs={jobsByColumn[column.id]}
              onSelectJob={handleSelectJob}
              onMoveStage={handleMoveStage}
              onDeleteJob={handleDeleteJob}
              onApplySavedJob={handleApplySavedJob}
            />
          ))} */}
        </div>
      ) : (
        /* Single Stage Focus / Filtered Grid List View */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink capitalize flex items-center gap-2">
              <span>
                {activeStageTab === "all"
                  ? "All Tracked Jobs"
                  : `${activeStageTab} Jobs`}
              </span>
              <span className="text-xs text-ink-soft">
                ({totalFilteredCount})
              </span>
            </h3>
            {activeStageTab !== "all" && (
              <button
                type="button"
                onClick={() => setActiveStageTab("all")}
                className="text-xs font-bold text-primary hover:text-primary-glow cursor-pointer"
              >
                Reset to All Stages
              </button>
            )}
          </div>

          {filteredAndSortedItems.length === 0 ? (
            <div className="py-16 text-center bg-surface border border-dashed border-border rounded-3xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-surface-alt border border-border flex items-center justify-center mx-auto text-ink-soft">
                <Briefcase className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-ink">
                No jobs found in this view
              </p>
              <p className="text-xs text-ink-soft max-w-sm mx-auto">
                No jobs match the current stage and search criteria. Explore
                more jobs or adjust your search filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveStageTab("all");
                  setSearchQuery("");
                  setCompanyFilter("all");
                }}
                className="px-4 py-2 rounded-xl bg-surface-alt border border-border text-xs font-bold text-ink hover:bg-surface transition cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredAndSortedItems.map((job) => (
                <KanbanJobCard
                  key={job._id || job.jobId}
                  job={job}
                  onSelect={handleSelectJob}
                  onMoveStage={handleMoveStage}
                  onDelete={handleDeleteJob}
                  onApplyNow={handleApplySavedJob}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Job Details & Interview Notes Modal */}
      {/* {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div
            className="bg-surface border border-border rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin"
            onClick={(e) => e.stopPropagation()}
          >
       
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-brand text-white flex items-center justify-center text-lg font-black shrink-0 shadow-glow">
                  {selectedJob.company?.name?.charAt(0) || "J"}
                </div>
                <div className="space-y-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-black text-ink tracking-tight">
                    {selectedJob.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-ink-soft font-medium">
                    <span className="font-bold text-ink flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-ink-soft" />
                      {selectedJob.company?.name}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-ink-soft" />
                      {selectedJob.location?.remote
                        ? "Remote"
                        : selectedJob.location?.city ||
                          selectedJob.location?.country ||
                          "Flexible"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="p-2 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-surface-alt/70 border border-border/80 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-ink-soft block">
                  Current Stage
                </span>
                <span className="text-xs font-bold text-ink capitalize flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  {selectedJob.stage}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-surface-alt/70 border border-border/80 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-ink-soft block">
                  Match Score
                </span>
                <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                  {selectedJob.matchScore}% Match
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-surface-alt/70 border border-border/80 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-ink-soft block">
                  Source
                </span>
                <span className="text-xs font-bold text-ink capitalize">
                  {selectedJob.source === "ai_apply"
                    ? "AI Auto-Apply"
                    : selectedJob.source}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-surface-alt/70 border border-border/80 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-ink-soft block">
                  Date Tracked
                </span>
                <span className="text-xs font-bold text-ink">
                  {new Date(
                    selectedJob.appliedAt || selectedJob.savedAt || new Date(),
                  ).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>


            <div className="p-3.5 rounded-2xl bg-surface-alt/40 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs font-bold text-ink">
                Move to different stage:
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {(
                  [
                    "saved",
                    "applied",
                    "interviewing",
                    "offered",
                    "rejected",
                  ] as const
                ).map((stageKey) => (
                  <button
                    key={stageKey}
                    type="button"
                    disabled={selectedJob.stage === stageKey}
                    onClick={() => handleMoveStage(selectedJob, stageKey)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                      selectedJob.stage === stageKey
                        ? "bg-primary text-white shadow-xs opacity-60 cursor-default"
                        : "bg-surface border border-border text-ink-soft hover:text-ink hover:bg-surface-alt"
                    }`}
                  >
                    {stageKey}
                  </button>
                ))}
              </div>
            </div>

         
            {selectedJob.stage !== "saved" && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <StickyNote className="w-3.5 h-3.5 text-amber-500" />
                    Interview & Candidate Notes
                  </h4>
                  <button
                    type="button"
                    disabled={isSavingNotes}
                    onClick={handleSaveNotes}
                    className="text-xs font-bold text-primary hover:text-primary-glow cursor-pointer disabled:opacity-50"
                  >
                    {isSavingNotes ? "Saving..." : "Save Notes"}
                  </button>
                </div>
                <textarea
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Record interviewer names, salary expectations, interview schedule, questions asked, or follow-ups..."
                  className="w-full h-24 p-3 rounded-2xl border border-border bg-surface-alt/50 text-xs text-ink placeholder:text-ink-soft/70 focus:outline-none focus:ring-2 focus:ring-primary/20 scrollbar-thin"
                />
              </div>
            )}

         
            {selectedJob.skills && selectedJob.skills.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
                  Required Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-xl bg-surface-alt border border-border text-ink font-semibold text-xs"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

       
            {selectedJob.description && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
                  Job Description
                </h4>
                <div className="p-3.5 rounded-2xl bg-surface-alt/40 border border-border text-xs text-ink-soft leading-relaxed max-h-48 overflow-y-auto scrollbar-thin whitespace-pre-line">
                  {selectedJob.description}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleDeleteJob(selectedJob)}
                className="text-xs font-bold text-destructive hover:bg-destructive/10 px-3 py-2 rounded-xl transition cursor-pointer"
              >
                {selectedJob.stage === "saved"
                  ? "Remove from Saved"
                  : "Withdraw Record"}
              </button>

              <div className="flex items-center gap-2">
                {selectedJob.stage === "saved" && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedJob(null);
                      handleApplySavedJob(selectedJob);
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-brand text-white text-xs font-bold shadow-xs hover:shadow-glow transition cursor-pointer"
                  >
                    Apply Now
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="px-4 py-2 rounded-xl bg-surface-alt hover:bg-surface-alt/80 text-ink text-xs font-bold transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Apply Modal for Saved Job */}
      {/* <JobApplyModal
        isOpen={isApplyModalOpen}
        job={applyJobTarget}
        allJobs={allRecommendedJobs}
        onClose={() => setIsApplyModalOpen(false)}
        onSuccess={async (jobId) => {
          showToast("Application submitted successfully!");
          fetchBoardData();
        }}
      /> */}
    </div>
  );
}
