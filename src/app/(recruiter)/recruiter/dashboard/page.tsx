"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Briefcase, Clock3, PlusCircle, RefreshCw, Target, Users, Sparkles } from "lucide-react";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { UserProfile } from "@/features/auth/services/authService";
import { useRecruiterStore } from "@/features/recruiter/store/useRecruiterStore";
import { recruiterService } from "@/features/recruiter/services/recruiterService";
import { OrgProfile, RecruiterOverview } from "@/features/recruiter/types";
import { DashboardMetricCard } from "@/features/recruiter/components/DashboardMetricCard";
import { DashboardRecentActivity } from "@/features/recruiter/components/DashboardRecentActivity";
import { DashboardTopMatches } from "@/features/recruiter/components/DashboardTopMatches";
import { DashboardAIInsights } from "@/features/recruiter/components/DashboardAIInsights";
import { DashboardCandidateFunnel } from "@/features/recruiter/components/DashboardCandidateFunnel";
import { InstitutionDashboard } from "@/features/institution/components/InstitutionDashboard";

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
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm animate-pulse h-64">
      <div className="h-4 w-32 bg-surface-alt rounded mb-5" />
      <div className="space-y-3">
        <div className="h-3 w-full bg-surface-alt rounded" />
        <div className="h-3 w-5/6 bg-surface-alt rounded" />
        <div className="h-3 w-2/3 bg-surface-alt rounded" />
      </div>
    </div>
  );
}

export default function RecruiterDashboardPage() {
  const { user } = useAuthStore();
  const { orgProfile } = useRecruiterStore();

  if (orgProfile?.entity === "institution") {
    return <InstitutionDashboard />;
  }

  return <CompanyStartupDashboard user={user} orgProfile={orgProfile} />;
}

function CompanyStartupDashboard({
  user,
  orgProfile,
}: {
  user: UserProfile | null;
  orgProfile: OrgProfile | null;
}) {
  const [overview, setOverview] = useState<RecruiterOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    recruiterService
      .getOverview()
      .then(setOverview)
      .catch(() => setError("Unable to load dashboard data. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const orgName = orgProfile?.name || user?.fullName || "Recruiter";
  const entityLabel = orgProfile?.entity ? orgProfile.entity.charAt(0).toUpperCase() + orgProfile.entity.slice(1) : null;
  const kpis = overview?.kpis;
  const hasJobs = (kpis?.openRoles ?? 0) > 0 || (overview?.recentActivity.length ?? 0) > 0;

  const completionPercentage = useMemo(() => {
    if (!orgProfile) return 0;
    const checklist = [
      !!orgProfile.name?.trim(),
      !!orgProfile.website?.trim(),
      !!orgProfile.industry?.trim(),
      !!orgProfile.employees?.trim(),
      !!(orgProfile.headquarters?.trim() || orgProfile.address?.trim()),
      !!orgProfile.ceoName?.trim(),
      !!orgProfile.founded?.trim(),
      !!(orgProfile.revenue?.trim() || orgProfile.valuation?.trim()),
      !!(orgProfile.bio?.trim() || orgProfile.description?.trim()),
      !!orgProfile.whyJoinUs?.trim(),
    ];
    return Math.round((checklist.filter(Boolean).length / checklist.length) * 100);
  }, [orgProfile]);

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-brand rounded-2xl shadow-elegant p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {entityLabel && (
            <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wide text-primary-foreground/90 bg-white/15 px-2.5 py-1 rounded-full mb-2.5">
              {entityLabel}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-foreground tracking-tight">
            Welcome, {orgName}
          </h1>
          <p className="text-primary-foreground/80 mt-1 text-sm">Here&apos;s how your hiring is performing today.</p>
        </div>
        <Link
          href="/recruiter/jobs/create"
          className="inline-flex items-center justify-center gap-2 text-xs font-semibold bg-white text-ink px-5 py-3 rounded-xl shadow-elegant hover:shadow-glow transition-all hover:scale-[1.02] active:scale-95 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Create a new job
        </Link>
      </div>

      {/* Profile Completion Progress Card */}
      {completionPercentage < 100 && (
        <div className="bg-surface border border-border rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary-glow font-bold text-xs shrink-0">
              {completionPercentage}%
            </div>
            <div>
              <div className="text-sm font-bold text-ink flex items-center gap-2">
                Complete your company profile
                <span className="text-[10px] font-semibold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full">
                  Recommended
                </span>
              </div>
              <p className="text-xs text-ink-soft mt-0.5">
                Add CEO, realistic company size, revenue, headquarters, and why join us to attract top talent.
              </p>
            </div>
          </div>

          <Link
            href="/recruiter/profile"
            className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-primary-glow bg-primary/5 hover:bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl transition shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" /> Auto-fill with AI
          </Link>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between gap-3 bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-3 text-sm text-destructive">
          <span>{error}</span>
          <button
            onClick={load}
            className="inline-flex items-center gap-1.5 font-semibold shrink-0 hover:underline"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {/* KPI Metrics */}
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
              icon={Briefcase}
              label="Open Roles"
              value={kpis && kpis.openRoles > 0 ? kpis.openRoles : null}
              context={kpis?.openRolesContext}
              emptyText="No jobs listed yet. Create your first job to start hiring."
            />
            <DashboardMetricCard
              icon={Users}
              label="Active Candidates"
              value={kpis && kpis.activeCandidates > 0 ? kpis.activeCandidates : null}
              emptyText="Candidates will appear here once applicants apply to your jobs."
            />
            <DashboardMetricCard
              icon={Clock3}
              label="Avg. Time-to-Fill"
              value={kpis?.avgTimeToFillDays != null ? `${kpis.avgTimeToFillDays}d` : null}
              emptyText="Time-to-fill will be calculated after your first role is successfully filled."
            />
            <DashboardMetricCard
              icon={Target}
              label="AI Match Rate"
              value={kpis?.aiMatchRate != null ? `${kpis.aiMatchRate}%` : null}
              context={kpis?.aiMatchRate != null ? "Semantic ranking accuracy" : undefined}
              emptyText="Available after candidate matching."
            />
          </>
        )}
      </div>

      {!loading && !hasJobs && !error && (
        <div className="bg-surface border border-border rounded-2xl shadow-elegant p-8 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <PlusCircle className="w-7 h-7 text-primary-glow" />
          </div>
          <h2 className="text-lg font-bold text-ink">Post your first job</h2>
          <p className="text-sm text-ink-soft mt-1.5 max-w-sm">
            Create a job posting to start receiving applicants and sourcing candidates.
          </p>
          <Link
            href="/recruiter/jobs/create"
            className="inline-flex items-center gap-2 mt-6 text-xs font-semibold bg-gradient-brand text-primary-foreground px-6 py-3 rounded-xl shadow-elegant hover:shadow-glow transition-all hover:scale-[1.02] active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            Create your first job
          </Link>
        </div>
      )}

      {/* Recruitment Overview */}
      <div>
        <h2 className="text-sm font-bold text-ink mb-3">Recruitment Overview</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {loading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            overview && (
              <>
                <DashboardRecentActivity items={overview.recentActivity} />
                <DashboardTopMatches items={overview.topMatches} />
              </>
            )
          )}
        </div>
      </div>

      {/* AI Insights */}
      {loading ? <CardSkeleton /> : overview && <DashboardAIInsights items={overview.aiInsights} />}

      {/* Pipeline & Funnel */}
      {loading ? (
        <CardSkeleton />
      ) : (
        overview && <DashboardCandidateFunnel funnel={overview.funnel} insights={overview.funnelInsights} />
      )}
    </div>
  );
}
