"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Award, Briefcase, GraduationCap, RefreshCw, TrendingUp, UserPlus, Users } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useRecruiterStore } from "@/features/recruiter/store/useRecruiterStore";
import { institutionService } from "../services/institutionService";
import { InstitutionOverview } from "../types";
import { DashboardMetricCard } from "@/features/recruiter/components/DashboardMetricCard";
import { DashboardAIInsights } from "@/features/recruiter/components/DashboardAIInsights";

function MetricSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm animate-pulse">
      <div className="w-8 h-8 rounded-xl bg-surface-alt mb-2.5" />
      <div className="h-6 w-16 bg-surface-alt rounded mb-1.5" />
      <div className="h-3 w-20 bg-surface-alt rounded" />
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm animate-pulse h-56">
      <div className="h-4 w-32 bg-surface-alt rounded mb-5" />
      <div className="space-y-3">
        <div className="h-3 w-full bg-surface-alt rounded" />
        <div className="h-3 w-5/6 bg-surface-alt rounded" />
        <div className="h-3 w-2/3 bg-surface-alt rounded" />
      </div>
    </div>
  );
}

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "1d ago";
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export function InstitutionDashboard() {
  const { user } = useAuthStore();
  const { orgProfile } = useRecruiterStore();
  const [overview, setOverview] = useState<InstitutionOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    institutionService
      .getOverview()
      .then(setOverview)
      .catch(() => setError("Unable to load dashboard data. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const orgName = orgProfile?.name || user?.fullName || "Institution";
  const kpis = overview?.kpis;
  const hasStudents = (kpis?.totalStudents ?? 0) > 0;

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      <div className="bg-gradient-brand rounded-2xl shadow-elegant p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wide text-primary-foreground/90 bg-white/15 px-2.5 py-1 rounded-full mb-2.5">
            Institution
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-foreground tracking-tight">
            Welcome, {orgName}
          </h1>
          <p className="text-primary-foreground/80 mt-1 text-sm">Here&apos;s how your placement cell is performing today.</p>
        </div>
        <Link
          href="/recruiter/institution/students"
          className="inline-flex items-center justify-center gap-2 text-xs font-semibold bg-white text-ink px-5 py-3 rounded-xl shadow-elegant hover:shadow-glow transition-all hover:scale-[1.02] active:scale-95 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          Add a student
        </Link>
      </div>

      {error && (
        <div className="flex items-center justify-between gap-3 bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-3 text-sm text-destructive">
          <span>{error}</span>
          <button onClick={load} className="inline-flex items-center gap-1.5 font-semibold shrink-0 hover:underline">
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          <>
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
          </>
        ) : (
          <>
            <DashboardMetricCard
              icon={Users}
              label="Total Students"
              value={kpis && kpis.totalStudents > 0 ? kpis.totalStudents : null}
              emptyText="No students added yet."
            />
            <DashboardMetricCard
              icon={Briefcase}
              label="Active Recruiters"
              value={kpis && kpis.activeRecruiters > 0 ? kpis.activeRecruiters : null}
              emptyText="No active recruiters yet."
            />
            <DashboardMetricCard
              icon={GraduationCap}
              label="Open Jobs"
              value={kpis && kpis.openJobs > 0 ? kpis.openJobs : null}
              emptyText="No jobs posted yet."
            />
            <DashboardMetricCard
              icon={Award}
              label="Students Placed"
              value={kpis && kpis.studentsPlaced > 0 ? kpis.studentsPlaced : null}
              context={kpis?.placementRate != null ? `${kpis.placementRate}% placement rate` : undefined}
              emptyText="No placements recorded yet."
            />
          </>
        )}
      </div>

      {!loading && !hasStudents && !error && (
        <div className="bg-surface border border-border rounded-2xl shadow-elegant p-8 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <UserPlus className="w-7 h-7 text-primary-glow" />
          </div>
          <h2 className="text-lg font-bold text-ink">Build your student roster</h2>
          <p className="text-sm text-ink-soft mt-1.5 max-w-sm">
            Your placement dashboard will populate as students, recruiters and jobs are added.
          </p>
          <Link
            href="/recruiter/institution/students"
            className="inline-flex items-center gap-2 mt-6 text-xs font-semibold bg-gradient-brand text-primary-foreground px-6 py-3 rounded-xl shadow-elegant hover:shadow-glow transition-all hover:scale-[1.02] active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            Add your first student
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {loading ? (
          <CardSkeleton />
        ) : (
          <div className="bg-surface border border-border rounded-2xl shadow-elegant p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-primary-glow" />
              <h2 className="text-sm font-bold text-ink">Recent Activity</h2>
            </div>
            {!overview || overview.recentActivity.length === 0 ? (
              <p className="text-sm text-ink-soft text-center py-8">
                No recent activity. Your activity will appear here as students, recruiters and jobs are added.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {overview.recentActivity.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-3 text-sm">
                    <div className="min-w-0">
                      <div className="font-semibold text-ink truncate">{item.event}</div>
                      <div className="text-[11px] text-ink-soft mt-0.5 truncate">{item.detail}</div>
                    </div>
                    <span className="shrink-0 text-[10px] text-ink-soft">{timeAgo(item.date)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {loading ? <CardSkeleton /> : <DashboardAIInsights items={overview?.aiInsights || []} />}
      </div>
    </div>
  );
}
