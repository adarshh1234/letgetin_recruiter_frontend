import React from "react";
import { Star } from "lucide-react";
import { RecruiterOverview } from "../types";

export function DashboardTopMatches({ items }: { items: RecruiterOverview["topMatches"] }) {
  return (
    <div className="bg-surface border border-border rounded-2xl shadow-elegant p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-4 h-4 text-primary-glow" />
        <h2 className="text-sm font-bold text-ink">Top AI Matches</h2>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-ink-soft text-center py-8">
          AI matches will appear once candidates apply to your jobs.
        </p>
      ) : (
        <div className="space-y-1">
          {items.map((m, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-brand text-primary-foreground font-bold text-xs flex items-center justify-center shrink-0">
                {m.candidateName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-ink truncate">{m.candidateName}</div>
                <div className="text-[11px] text-ink-soft truncate">
                  {m.headline || m.jobTitle}
                  {m.yearsOfExperience ? ` · ${m.yearsOfExperience} yrs` : ""}
                </div>
              </div>
              <span className="shrink-0 text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full">
                {m.matchScore}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
