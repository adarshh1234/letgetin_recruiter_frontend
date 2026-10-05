"use client";

import React, { useState, useEffect, useCallback } from "react";
import { jobService } from "@/features/jobs/services/jobService";

import {
  IJob,
  JobFilterParams,
  CandidateProfileSummary,
} from "@/features/jobs/types/job.types";
import { JobCard } from "@/features/jobs/components/JobCard";
import { JobDetailPanel } from "@/features/jobs/components/JobDetailPanel";
import { JobApplyModal } from "@/features/jobs/components/JobApplyModal";
import { JobFilters } from "@/features/jobs/components/JobFilters";
import { ExploreHero } from "@/features/jobs/components/ExploreHero";
import { AIChat } from "@/features/aiAssistant/components/AIChat";
import {
  Sparkles,
  Globe,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Layers,
  CheckCircle2,
} from "lucide-react";

import { applicationService } from "@/features/applications/services/applicationService";

type TabMode = "recommendations" | "all" | "saved";

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<TabMode>("recommendations");
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [candidateProfile, setCandidateProfile] = useState<
    CandidateProfileSummary | undefined
  >();
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pagination & Filter state
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<JobFilterParams>({
    page: 1,
    limit: 12,
    sort: "recommended",
    workplaceType: "all",
    experienceLevel: "all",
    employmentType: "all",
  });

  // Selected Job for Split View (null = 3-column grid view)
  const [selectedJob, setSelectedJob] = useState<IJob | null>(null);

  // Full-width expand state for details panel
  const [isExpanded, setIsExpanded] = useState(false);

  // Apply Modal State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [jobToApply, setJobToApply] = useState<IJob | null>(null);

  // Applied Jobs Tracking (Synced with Database & local cache)
  const [appliedJobIds, setAppliedJobIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("resumebuildai_applied_jobs");
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Applied Source Map (AI Apply vs Manual Apply)
  const [appliedSourceMap, setAppliedSourceMap] = useState<
    Record<string, "ai_apply" | "manual">
  >(() => {
    if (typeof window !== "undefined") {
      try {
        const recordsStr = localStorage.getItem(
          "resumebuildai_applied_records",
        );
        const records: any[] = recordsStr ? JSON.parse(recordsStr) : [];
        const map: Record<string, "ai_apply" | "manual"> = {};
        records.forEach((r) => {
          const id = r.job?._id || r.jobId;
          if (id) {
            map[id] = r.source === "ai_apply" ? "ai_apply" : "manual";
          }
        });
        return map;
      } catch {
        return {};
      }
    }
    return {};
  });

  // Saved Jobs in localStorage
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("resumebuildai_saved_jobs");
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Sync applied jobs from database on mount
  useEffect(() => {
    let isCancelled = false;
    const syncAppliedJobsFromDb = async () => {
      try {
        const res = await applicationService.getApplications({ limit: 100 });
        if (!isCancelled && res?.applications) {
          const dbAppliedIds = res.applications
            .map((app) => {
              if (typeof app.job === "object" && app.job?._id) {
                return String(app.job._id);
              }
              return (app as any).jobId ? String((app as any).jobId) : null;
            })
            .filter(Boolean) as string[];

          if (dbAppliedIds.length > 0) {
            setAppliedJobIds((prev) => {
              const merged = Array.from(new Set([...prev, ...dbAppliedIds]));
              if (typeof window !== "undefined") {
                localStorage.setItem(
                  "resumebuildai_applied_jobs",
                  JSON.stringify(merged),
                );
              }
              return merged;
            });
          }
        }
      } catch (err) {
        console.warn("Could not sync applied jobs from database:", err);
      }
    };

    syncAppliedJobsFromDb();

    return () => {
      isCancelled = true;
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sync applied jobs from backend API on mount
  useEffect(() => {
    let isCancelled = false;
    const fetchAppliedHistory = async () => {
      try {
        const appRes = await applicationService.getApplications({ limit: 100 });
        const apps = appRes.applications || [];
        if (!isCancelled && apps.length > 0) {
          const backendIds: string[] = [];
          const sourceMap: Record<string, "ai_apply" | "manual"> = {};

          apps.forEach((a) => {
            const id = a.job?._id || a._id;
            if (id) {
              backendIds.push(id);
              sourceMap[id] = a.source === "ai_apply" ? "ai_apply" : "manual";
            }
          });

          setAppliedJobIds((prev) => {
            const combined = Array.from(new Set([...prev, ...backendIds]));
            if (typeof window !== "undefined") {
              localStorage.setItem(
                "resumebuildai_applied_jobs",
                JSON.stringify(combined),
              );
            }
            return combined;
          });

          setAppliedSourceMap((prev) => ({
            ...prev,
            ...sourceMap,
          }));
        }
      } catch (err) {
        console.warn("Could not fetch applied history from API:", err);
      }
    };

    fetchAppliedHistory();
    return () => {
      isCancelled = true;
    };
  }, []);

  const handleToggleSave = (jobId: string) => {
    setSavedJobIds((prev) => {
      const next = prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId];
      if (typeof window !== "undefined") {
        localStorage.setItem("resumebuildai_saved_jobs", JSON.stringify(next));
      }
      return next;
    });
  };

  const handleApplicationSuccess = (
    jobId: string,
    appliedJob?: IJob | null,
    createdApp?: any,
  ) => {
    setAppliedJobIds((prev) => {
      const next = prev.includes(jobId) ? prev : [...prev, jobId];
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "resumebuildai_applied_jobs",
          JSON.stringify(next),
        );
      }
      return next;
    });
    showToast("Application submitted successfully and saved to database!");
  };

  // Fetch jobs based on current tab and filters
  const fetchJobs = useCallback(
    async (isCancelledCheck: () => boolean = () => false) => {
      setIsLoading(true);
      setError(null);

      try {
        if (activeTab === "recommendations") {
          const data = await jobService.getRecommendations(filters);
          if (!isCancelledCheck()) {
            const jobList = data?.jobs || (Array.isArray(data) ? data : []);
            setJobs(jobList);
            setTotal(data?.total ?? jobList.length);
            setTotalPages(data?.totalPages ?? 1);
            setCandidateProfile(data?.candidateProfile);
          }
        } else if (activeTab === "all") {
          const data = await jobService.getJobs(filters);
          if (!isCancelledCheck()) {
            const jobList = data?.jobs || (Array.isArray(data) ? data : []);
            setJobs(jobList);
            setTotal(data?.total ?? jobList.length);
            setTotalPages(data?.totalPages ?? 1);
          }
        } else if (activeTab === "saved") {
          const data = await jobService.getJobs({ limit: 100 });
          if (!isCancelledCheck()) {
            const jobList = data?.jobs || (Array.isArray(data) ? data : []);
            const filtered = jobList.filter((j: any) =>
              savedJobIds.includes(j._id),
            );
            setJobs(filtered);
            setTotal(filtered.length);
            setTotalPages(1);
          }
        }
      } catch (err: any) {
        if (!isCancelledCheck()) {
          console.error("Failed to load jobs:", err);
          const errMsg =
            err?.error?.message ||
            err?.message ||
            (typeof err === "string"
              ? err
              : "Unable to connect to job recommendation service. Please check your backend connection.");
          setError(errMsg);
        }
      } finally {
        if (!isCancelledCheck()) {
          setIsLoading(false);
        }
      }
    },
    [activeTab, filters, activeTab === "saved" ? savedJobIds : null],
  );

  useEffect(() => {
    let isCancelled = false;
    fetchJobs(() => isCancelled);

    return () => {
      isCancelled = true;
    };
  }, [fetchJobs]);

  const handleSyncProfile = async () => {
    setIsSyncing(true);
    try {
      await jobService.syncProfile();
      await fetchJobs();
      showToast("Candidate profile & AI match re-synced!");
    } catch (err: any) {
      console.warn("Sync profile warning:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      page: 1,
      limit: 12,
      sort: "recommended",
      workplaceType: "all",
      experienceLevel: "all",
      employmentType: "all",
      search: "",
      minScore: undefined,
    });
  };

  const handleOpenApplyModal = (job: IJob) => {
    setJobToApply(job);
    setIsApplyModalOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#5345ec] text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Banner with Candidate Profile Insights */}
      <ExploreHero
        candidateProfile={candidateProfile}
        onSyncProfile={handleSyncProfile}
        isSyncing={isSyncing}
      />

      {/* Tabs Bar & Quick Switcher */}
      <div className="flex items-center justify-between gap-4 border-b border-border/80 pb-3 flex-wrap">
        <div className="flex items-center gap-2 bg-surface-alt/70 p-1 rounded-2xl border border-border/60">
          <button
            type="button"
            onClick={() => {
              setActiveTab("recommendations");
              setFilters((f) => ({ ...f, page: 1, sort: "recommended" }));
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "recommendations"
                ? "bg-card text-primary shadow-xs border border-border/80"
                : "text-ink-soft hover:text-ink hover:bg-card/50"
            }`}
          >
            <Sparkles className="w-4 h-4 text-primary-glow" />
            <span>AI Matches For You</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("all");
              setFilters((f) => ({ ...f, page: 1, sort: "recent" }));
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "all"
                ? "bg-card text-primary shadow-xs border border-border/80"
                : "text-ink-soft hover:text-ink hover:bg-card/50"
            }`}
          >
            <Globe className="w-4 h-4 text-blue-500" />
            <span>Browse All Roles</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab("saved");
              setFilters((f) => ({ ...f, page: 1 }));
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === "saved"
                ? "bg-card text-primary shadow-xs border border-border/80"
                : "text-ink-soft hover:text-ink hover:bg-card/50"
            }`}
          >
            <Bookmark className="w-4 h-4 text-amber-500" />
            <span>Saved Roles ({savedJobIds.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      {activeTab !== "saved" && (
        <JobFilters
          filters={filters}
          onChange={(newFilters) => setFilters(newFilters)}
          onReset={handleResetFilters}
          totalResults={total}
        />
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchJobs()}
            className="font-semibold underline hover:no-underline text-xs cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Main Content Area: 3-Column Grid OR 1-Column Split View */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-card border border-border p-5 space-y-4 animate-pulse h-80 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-surface-alt" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-surface-alt rounded w-3/4" />
                    <div className="h-3 bg-surface-alt rounded w-1/2" />
                  </div>
                </div>
                <div className="h-16 bg-surface-alt/60 rounded-xl mt-4" />
                <div className="flex gap-2 pt-2">
                  <div className="h-6 w-16 bg-surface-alt rounded-lg" />
                  <div className="h-6 w-20 bg-surface-alt rounded-lg" />
                  <div className="h-6 w-14 bg-surface-alt rounded-lg" />
                </div>
              </div>
              <div className="h-9 bg-surface-alt rounded-xl" />
            </div>
          ))}
        </div>
      ) : jobs.length > 0 ? (
        selectedJob ? (
          /* ============================================================
             SPLIT VIEW: 1-COLUMN SCROLLABLE LIST (LEFT) + DETAILS (RIGHT)
             ============================================================ */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-in fade-in duration-200">
            {/* Left 1-Column Job List (Hidden scrollbar, fully scrollable) */}
            {!isExpanded && (
              <div className="lg:col-span-5 xl:col-span-4 space-y-3 max-h-[calc(100vh-140px)] overflow-y-auto pr-1 no-scrollbar">
                {jobs.map((job) => {
                  const isSelected = selectedJob._id === job._id;
                  const isApplied = appliedJobIds.includes(job._id);
                  const isSaved = savedJobIds.includes(job._id);

                  return (
                    <JobCard
                      key={job._id}
                      job={job}
                      isSelected={isSelected}
                      onSelect={(j) => setSelectedJob(j)}
                      isSaved={isSaved}
                      onToggleSave={handleToggleSave}
                      isApplied={isApplied}
                      appliedSource={
                        appliedSourceMap[job._id] ||
                        (isApplied ? "manual" : undefined)
                      }
                      layoutMode="compact"
                    />
                  );
                })}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-border pt-3 mt-3">
                    <p className="text-[11px] text-ink-soft">
                      Page{" "}
                      <span className="font-bold text-ink">{filters.page}</span>{" "}
                      of{" "}
                      <span className="font-bold text-ink">{totalPages}</span>
                    </p>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={(filters.page || 1) <= 1}
                        onClick={() =>
                          setFilters((f) => ({
                            ...f,
                            page: Math.max(1, (f.page || 1) - 1),
                          }))
                        }
                        className="p-1 rounded-lg border border-border text-ink-soft hover:text-ink hover:bg-surface-alt disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                        aria-label="Previous Page"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>

                      <span className="text-xs font-semibold px-2 py-0.5 bg-surface-alt rounded border border-border text-ink">
                        {filters.page}
                      </span>

                      <button
                        type="button"
                        disabled={(filters.page || 1) >= totalPages}
                        onClick={() =>
                          setFilters((f) => ({
                            ...f,
                            page: Math.min(totalPages, (f.page || 1) + 1),
                          }))
                        }
                        className="p-1 rounded-lg border border-border text-ink-soft hover:text-ink hover:bg-surface-alt disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                        aria-label="Next Page"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Right Job Details Panel (Panel toggle button closes details & shows 3 columns) */}
            <div
              className={`${
                isExpanded ? "lg:col-span-12" : "lg:col-span-7 xl:col-span-8"
              } sticky top-4 max-h-[calc(100vh-140px)] flex flex-col`}
            >
              <JobDetailPanel
                job={selectedJob}
                onClose={() => setSelectedJob(null)}
                isSaved={savedJobIds.includes(selectedJob._id)}
                onToggleSave={handleToggleSave}
                onStartApplication={handleOpenApplyModal}
                isApplied={appliedJobIds.includes(selectedJob._id)}
                appliedSource={
                  appliedSourceMap[selectedJob._id] ||
                  (appliedJobIds.includes(selectedJob._id)
                    ? "manual"
                    : undefined)
                }
                onTogglePanel={() => setSelectedJob(null)}
                isExpanded={isExpanded}
                onToggleExpand={() => setIsExpanded(!isExpanded)}
              />
            </div>
          </div>
        ) : (
          /* ============================================================
             3-COLUMN GRID VIEW OF ALL JOBS
             ============================================================ */
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {jobs.map((job) => {
                const isApplied = appliedJobIds.includes(job._id);
                const isSaved = savedJobIds.includes(job._id);

                return (
                  <JobCard
                    key={job._id}
                    job={job}
                    isSelected={false}
                    onSelect={(j) => setSelectedJob(j)}
                    isSaved={isSaved}
                    onToggleSave={handleToggleSave}
                    isApplied={isApplied}
                    appliedSource={
                      appliedSourceMap[job._id] ||
                      (isApplied ? "manual" : undefined)
                    }
                    layoutMode="grid"
                  />
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border pt-4 mt-6">
                <p className="text-xs text-ink-soft">
                  Showing page{" "}
                  <span className="font-bold text-ink">{filters.page}</span> of{" "}
                  <span className="font-bold text-ink">{totalPages}</span> (
                  {total} total roles)
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={(filters.page || 1) <= 1}
                    onClick={() =>
                      setFilters((f) => ({
                        ...f,
                        page: Math.max(1, (f.page || 1) - 1),
                      }))
                    }
                    className="p-2 rounded-xl border border-border text-ink-soft hover:text-ink hover:bg-surface-alt disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                    aria-label="Previous Page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-xs font-bold px-3 py-1.5 bg-surface-alt rounded-xl border border-border text-ink">
                    {filters.page}
                  </span>

                  <button
                    type="button"
                    disabled={(filters.page || 1) >= totalPages}
                    onClick={() =>
                      setFilters((f) => ({
                        ...f,
                        page: Math.min(totalPages, (f.page || 1) + 1),
                      }))
                    }
                    className="p-2 rounded-xl border border-border text-ink-soft hover:text-ink hover:bg-surface-alt disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                    aria-label="Next Page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center space-y-4 max-w-lg mx-auto my-12">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary grid place-items-center mx-auto">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="font-extrabold text-lg text-ink">No roles found</h3>
          <p className="text-sm text-ink-soft">
            {activeTab === "saved"
              ? "You have not saved any jobs yet. Browse recommendations and bookmark roles you want to apply for later."
              : "No jobs match your current search and filter criteria. Try adjusting filters or clearing search terms."}
          </p>
          {activeTab !== "saved" && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 bg-primary text-white font-semibold text-xs px-4 py-2.5 rounded-xl hover:bg-primary-deep transition shadow-xs cursor-pointer"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}

      {/* Multi-Step Application Modal */}
      <JobApplyModal
        isOpen={isApplyModalOpen}
        job={jobToApply}
        allJobs={jobs}
        onClose={() => {
          setIsApplyModalOpen(false);
          setJobToApply(null);
        }}
        onSuccess={handleApplicationSuccess}
      />

      {/* Contextual AI Assistant */}
      <AIChat
        context="explore"
        contextPayload={{ selectedJobId: selectedJob?._id }}
      />
    </div>
  );
}
