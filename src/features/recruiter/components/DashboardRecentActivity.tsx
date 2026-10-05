import React from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import { RecruiterOverview } from "../types";

const STAGE_BADGE: Record<string, { label: string; className: string }> = {
  open: { label: "Active", className: "bg-primary/10 text-primary-glow" },
  shortlisting: { label: "Shortlisting", className: "bg-amber-500/10 text-amber-600" },
  interview: { label: "Interview", className: "bg-purple-500/10 text-purple-600" },
  review: { label: "Review", className: "bg-amber-500/10 text-amber-600" },
  completed: { label: "Closed", className: "bg-ink-soft/10 text-ink-soft" },
};

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diffMs / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "1d ago";
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

export function DashboardRecentActivity({ items }: { items: RecruiterOverview["recentActivity"] }) {
  return (
    <div className="bg-surface border border-border rounded-2xl shadow-elegant p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-primary-glow" />
        <h2 className="text-sm font-bold text-ink">Recent Activity</h2>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-ink-soft text-center py-8">
          No recruitment activity yet. Your activity will appear here when candidates apply or jobs are updated.
        </p>
      ) : (
        <div className="divide-y divide-border">
          {items.map((item) => {
            const badge = STAGE_BADGE[item.stage] || STAGE_BADGE.open;
            return (
              <Link
                key={item.jobId}
                href={`/recruiter/jobs/${item.jobId}`}
                className="flex items-center justify-between py-3 text-sm hover:bg-surface-alt/50 -mx-2 px-2 rounded-lg transition"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-ink truncate">{item.title}</div>
                  <div className="text-[11px] text-ink-soft mt-0.5">
                    {item.applicantCount} applicant{item.applicantCount === 1 ? "" : "s"} · {timeAgo(item.updatedAt)}
                  </div>
                </div>
                <span className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-full ${badge.className}`}>
                  {badge.label}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
