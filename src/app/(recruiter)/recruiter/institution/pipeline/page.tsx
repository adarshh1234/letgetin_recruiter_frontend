"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Info, KanbanSquare, Loader2, RefreshCw } from "lucide-react";
import { institutionService } from "@/features/institution/services/institutionService";
import { ApplicationPipelineStatus, PipelineEntry } from "@/features/institution/types";

const COLUMNS: { key: ApplicationPipelineStatus[]; label: string; badgeClass: string }[] = [
  { key: ["submitted", "reviewing"], label: "Applied", badgeClass: "bg-primary/10 text-primary-glow" },
  { key: ["shortlisted"], label: "Shortlisted", badgeClass: "bg-amber-500/10 text-amber-600" },
  { key: ["interviewing"], label: "Interviewing", badgeClass: "bg-purple-500/10 text-purple-600" },
  { key: ["offered"], label: "Offered", badgeClass: "bg-emerald-500/10 text-emerald-600" },
  { key: ["rejected", "failed"], label: "Not Selected", badgeClass: "bg-ink-soft/10 text-ink-soft" },
];

export default function InstitutionPipelinePage() {
  const [entries, setEntries] = useState<PipelineEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    institutionService
      .getPipeline()
      .then(setEntries)
      .catch(() => setError("Unable to load the pipeline. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink tracking-tight">Placement Pipeline</h1>
        <p className="text-ink-soft mt-1 text-sm">Real-time application status for your linked students.</p>
      </div>

      <div className="flex items-start gap-2.5 bg-primary/5 border border-primary/15 rounded-xl px-4 py-3 text-xs text-ink-soft">
        <Info className="w-4 h-4 text-primary-glow shrink-0 mt-0.5" />
        <span>
          This view is read-only — application status is managed by the hiring company. Only students linked to a
          platform account with matching applications appear here.
        </span>
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
      ) : entries.length === 0 ? (
        <div className="bg-surface border border-border rounded-2xl shadow-elegant p-10 text-center">
          <KanbanSquare className="w-8 h-8 text-ink-soft mx-auto mb-3" />
          <p className="text-sm text-ink-soft">No active applications yet.</p>
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {COLUMNS.map((col) => {
            const items = entries.filter((e) => col.key.includes(e.status));
            return (
              <div key={col.label} className="bg-surface-alt/40 rounded-2xl p-3.5 border border-border min-w-[240px] flex-1">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3 className="text-xs font-bold text-ink">{col.label}</h3>
                  <span className="text-[10px] font-bold bg-surface text-ink-soft px-2 py-0.5 rounded-full">{items.length}</span>
                </div>
                <div className="space-y-2.5">
                  {items.map((item) => (
                    <div key={item.applicationId} className="bg-surface border border-border rounded-xl p-3 shadow-sm">
                      <div className="text-xs font-bold text-ink truncate">{item.studentName}</div>
                      <div className="text-[11px] text-ink-soft mt-0.5 truncate">{item.jobTitle}</div>
                      <div className="text-[11px] text-ink-soft truncate">{item.companyName}</div>
                      {typeof item.matchScore === "number" && (
                        <span className={`inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full ${col.badgeClass}`}>
                          {item.matchScore}% match
                        </span>
                      )}
                    </div>
                  ))}
                  {items.length === 0 && <p className="text-[11px] text-ink-soft text-center py-4">—</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
