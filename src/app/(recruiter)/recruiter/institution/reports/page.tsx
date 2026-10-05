"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Award, BarChart3, Briefcase, IndianRupee, Loader2, Percent, RefreshCw, Users } from "lucide-react";
import { institutionService } from "@/features/institution/services/institutionService";
import { InstitutionReports } from "@/features/institution/types";
import { DashboardMetricCard } from "@/features/recruiter/components/DashboardMetricCard";

export default function InstitutionReportsPage() {
  const [reports, setReports] = useState<InstitutionReports | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    institutionService
      .getReports()
      .then(setReports)
      .catch(() => setError("Unable to load reports. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const hasEnoughData = (reports?.totalStudents ?? 0) > 0;

  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink tracking-tight">Analytics &amp; Reports</h1>
        <p className="text-ink-soft mt-1 text-sm">Real placement performance across your roster.</p>
      </div>

      {error && (
        <div className="flex items-center justify-between gap-3 bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-3 text-sm text-destructive">
          <span>{error}</span>
          <button onClick={load} className="inline-flex items-center gap-1.5 font-semibold shrink-0 hover:underline">
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="p-10 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary-glow" />
        </div>
      ) : !hasEnoughData ? (
        <div className="bg-surface border border-border rounded-2xl shadow-elegant p-10 text-center">
          <BarChart3 className="w-8 h-8 text-ink-soft mx-auto mb-3" />
          <p className="text-sm text-ink-soft">Reports will become available as placement activity grows.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <DashboardMetricCard
              icon={Percent}
              label="Placement Rate"
              value={reports?.placementRate != null ? `${reports.placementRate}%` : null}
              emptyText="Not enough placement data yet."
            />
            <DashboardMetricCard
              icon={IndianRupee}
              label="Average Salary"
              value={reports?.averageSalary != null ? `₹${reports.averageSalary.toLocaleString("en-IN")}` : null}
              emptyText="Not enough offer data yet."
            />
            <DashboardMetricCard
              icon={Award}
              label="Total Offers"
              value={reports && reports.offers > 0 ? reports.offers : null}
              emptyText="No offers yet."
            />
            <DashboardMetricCard
              icon={Users}
              label="Students Placed"
              value={reports && reports.studentsPlaced > 0 ? reports.studentsPlaced : null}
              emptyText="No placements yet."
            />
          </div>

          <div className="bg-surface border border-border rounded-2xl shadow-elegant p-5 sm:p-6">
            <h2 className="text-sm font-bold text-ink mb-4">Application Funnel</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-xl font-extrabold text-ink">{reports?.totalApplications ?? 0}</div>
                <div className="text-[11px] text-ink-soft mt-0.5">Applications</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-ink">{reports?.shortlisted ?? 0}</div>
                <div className="text-[11px] text-ink-soft mt-0.5">Shortlisted</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-ink">{reports?.interviews ?? 0}</div>
                <div className="text-[11px] text-ink-soft mt-0.5">Interviews</div>
              </div>
              <div>
                <div className="text-xl font-extrabold text-ink">{reports?.offers ?? 0}</div>
                <div className="text-[11px] text-ink-soft mt-0.5">Offers</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <DashboardMetricCard
              icon={Briefcase}
              label="Active Recruiters"
              value={reports && reports.activeRecruiters > 0 ? reports.activeRecruiters : null}
              emptyText="No active recruiters yet."
            />
            <DashboardMetricCard
              icon={Briefcase}
              label="Open Jobs"
              value={reports && reports.openJobs > 0 ? reports.openJobs : null}
              emptyText="No jobs posted yet."
            />
          </div>
        </>
      )}
    </div>
  );
}
