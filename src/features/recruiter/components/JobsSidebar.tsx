"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  PlusCircle,
  Target,
  Loader2,
  X,
} from "lucide-react";
import { recruiterService } from "@/features/recruiter/services/recruiterService";
import { RecruiterJob } from "@/features/recruiter/types";

export interface JobsSidebarProps {
  jobs?: RecruiterJob[];
  selectedJobId?: string;
  loadingJobs?: boolean;
  onSelectJob?: (jobId: string) => void;
  baseHref?: string;
  className?: string;
}

export function JobsSidebar({
  jobs: externalJobs,
  selectedJobId,
  loadingJobs: externalLoading,
  onSelectJob,
  baseHref,
  className = "",
}: JobsSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlJobId = searchParams.get("jobId");

  const [internalJobs, setInternalJobs] = useState<RecruiterJob[]>([]);
  const [internalLoading, setInternalLoading] = useState(false);
  const [jobSearch, setJobSearch] = useState("");
  const [jobStatusFilter, setJobStatusFilter] = useState<"all" | "active" | "draft" | "closed">("all");

  const isExternallyControlled = externalJobs !== undefined;
  const rawJobs = isExternallyControlled ? externalJobs : internalJobs;
  const loading = isExternallyControlled ? (externalLoading ?? false) : internalLoading;

  // Fetch jobs if not externally provided
  useEffect(() => {
    if (isExternallyControlled) return;

    let mounted = true;
    setInternalLoading(true);
    recruiterService
      .getMyJobs()
      .then((data) => {
        if (!mounted) return;
        const sorted = (data || []).sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeB - timeA;
        });
        setInternalJobs(sorted);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setInternalLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [isExternallyControlled]);

  // Sort jobs from current created to previous one (descending createdAt)
  const sortedJobs = useMemo(() => {
    return [...(rawJobs || [])].sort((a, b) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
  }, [rawJobs]);

  // Filter jobs by search and status
  const filteredJobs = useMemo(() => {
    return sortedJobs.filter((job) => {
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
  }, [sortedJobs, jobSearch, jobStatusFilter]);

  const activeId = selectedJobId || urlJobId || (sortedJobs.length > 0 ? sortedJobs[0]._id : "");

  const handleCardClick = (jobId: string) => {
    if (onSelectJob) {
      onSelectJob(jobId);
    } else if (baseHref) {
      if (baseHref.includes("[jobId]")) {
        router.push(baseHref.replace("[jobId]", jobId));
      } else {
        router.push(`${baseHref}?jobId=${jobId}`);
      }
    } else {
      router.replace(`?jobId=${jobId}`, { scroll: false });
    }
  };

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
    <aside
      className={`w-full lg:w-[380px] xl:w-[410px] shrink-0 border-r border-border bg-surface flex flex-col h-auto lg:h-[calc(100vh-4rem)] overflow-hidden shadow-xs ${className}`}
    >
      {/* Side Menu Header */}
      <div className="p-4 border-b border-border/70 space-y-3 bg-surface shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-primary-glow" />
            <h2 className="text-sm font-bold text-ink">Job Requisitions</h2>
          </div>
          <Link
            href="/recruiter/jobs/create"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-primary/10 text-primary-glow hover:bg-primary/20 transition cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Job</span>
          </Link>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-ink-soft absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search jobs by title, skill, location..."
            value={jobSearch}
            onChange={(e) => setJobSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 text-xs bg-surface-alt/70 border border-border rounded-xl text-ink outline-none focus:ring-2 focus:ring-primary/20 transition placeholder:text-ink-soft/70"
          />
          {jobSearch && (
            <button
              type="button"
              onClick={() => setJobSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills & Chronological Hint */}
        <div className="flex items-center justify-between gap-1 pt-0.5">
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
            {(["all", "active", "draft", "closed"] as const).map((filterKey) => (
              <button
                key={filterKey}
                type="button"
                onClick={() => setJobStatusFilter(filterKey)}
                className={`text-[10.5px] font-semibold px-2 py-0.5 rounded-lg capitalize transition cursor-pointer shrink-0 ${
                  jobStatusFilter === filterKey
                    ? "bg-primary text-white shadow-xs font-bold"
                    : "bg-surface-alt text-ink-soft hover:text-ink hover:bg-surface-alt/80 border border-border/60"
                }`}
              >
                {filterKey}
              </button>
            ))}
          </div>
          <span className="text-[10px] text-ink-soft shrink-0">
            Latest to Oldest
          </span>
        </div>
      </div>

      {/* Scrollable Job Cards List (Current Created to Previous One) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y-0">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-center gap-2 text-ink-soft">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <span className="text-xs">Loading job requisitions...</span>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="py-14 px-4 text-center space-y-3">
            <div className="w-10 h-10 rounded-xl bg-surface-alt flex items-center justify-center mx-auto text-ink-soft">
              <Search className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-bold text-ink">No matching jobs found</p>
              <p className="text-[11px] text-ink-soft">
                {jobSearch ? "Try clearing search filters." : "Post your first job to start."}
              </p>
            </div>
            {jobSearch ? (
              <button
                type="button"
                onClick={() => {
                  setJobSearch("");
                  setJobStatusFilter("all");
                }}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Clear search
              </button>
            ) : (
              <Link
                href="/recruiter/jobs/create"
                className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Create a Job</span>
              </Link>
            )}
          </div>
        ) : (
          filteredJobs.map((job, index) => {
            const isSelected = job._id === activeId;
            const isCurrentCreated = index === 0 && !jobSearch && jobStatusFilter === "all";
            const createdDate = formatDate(job.createdAt);
            const endDate =
              formatDate(job.applicationCollection?.currentDeadline) ||
              formatDate(job.expiresAt) ||
              "Rolling intake";

            const locationStr =
              [job.location?.city, job.location?.country].filter(Boolean).join(", ") ||
              (job.location?.remote ? "Remote" : "Global");

            const statusColor =
              job.status === "active" || job.status === "open"
                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                : job.status === "draft"
                ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                : "bg-slate-500/10 text-slate-600 border-slate-500/20";

            return (
              <div
                key={job._id}
                onClick={() => handleCardClick(job._id)}
                className={`relative rounded-2xl p-3.5 transition-all cursor-pointer border text-left group ${
                  isSelected
                    ? "border-primary bg-primary/5 dark:bg-primary/10 shadow-sm ring-2 ring-primary/25"
                    : "border-border bg-surface hover:bg-surface-alt/60 hover:border-border/80"
                }`}
              >
                {/* Active Indicator Bar on Left Edge */}
                {isSelected && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-gradient-brand rounded-r" />
                )}

                <div className="space-y-2">
                  {/* Top: Chronological Tag & Status Badge */}
                  <div className="flex items-center justify-between gap-1.5">
                    <span
                      className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-md border ${
                        isCurrentCreated
                          ? "bg-primary text-white border-transparent shadow-2xs"
                          : "bg-surface-alt text-ink-soft border-border"
                      }`}
                    >
                      {isCurrentCreated ? "★ Current Created" : `Job #${filteredJobs.length - index}`}
                    </span>

                    <span
                      className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border capitalize shrink-0 ${statusColor}`}
                    >
                      {job.status || "active"}
                    </span>
                  </div>

                  {/* Job Title */}
                  <div>
                    <h3
                      className={`text-xs sm:text-sm font-bold truncate ${
                        isSelected ? "text-primary font-black" : "text-ink group-hover:text-primary transition"
                      }`}
                      title={job.title}
                    >
                      {job.title}
                    </h3>
                    <p className="text-[10.5px] text-ink-soft truncate mt-0.5">
                      {job.company?.name || "Letgetin Recruitment"}
                    </p>
                  </div>

                  {/* Location & Workplace */}
                  <div className="flex items-center gap-1.5 text-[11px] text-ink-soft">
                    <MapPin className="w-3 h-3 text-ink-soft shrink-0" />
                    <span className="truncate">{locationStr}</span>
                    <span>•</span>
                    <span className="capitalize px-1 py-0.2 rounded bg-surface-alt text-[9.5px] font-semibold text-ink-soft shrink-0">
                      {job.workplaceType || "Remote"}
                    </span>
                  </div>

                  {/* Created Date and End Date */}
                  <div className="grid grid-cols-2 gap-1.5 text-[10.5px] pt-1.5 border-t border-border/50 text-ink-soft">
                    <div className="flex items-center gap-1 truncate">
                      <Calendar className="w-3 h-3 text-ink-soft/80 shrink-0" />
                      <span className="truncate">
                        {createdDate ? `Created: ${createdDate}` : "Created: Recent"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 truncate justify-end">
                      <Clock className="w-3 h-3 text-ink-soft/80 shrink-0" />
                      <span className="truncate font-medium text-ink-soft">
                        {endDate.startsWith("Rolling") ? endDate : `End: ${endDate}`}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Details (Applicants, Target) */}
                  <div className="flex items-center justify-between gap-2 pt-0.5 text-[10.5px]">
                    <div className="flex items-center gap-1 text-primary-glow font-bold">
                      <Users className="w-3 h-3" />
                      <span>{job.applicantCount ?? 0} applicants</span>
                    </div>
                    <div className="flex items-center gap-1 text-ink-soft">
                      <Target className="w-3 h-3 text-amber-500" />
                      <span>Target: {job.finalShortlistTarget || 10}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
