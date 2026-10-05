"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Award, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { institutionService } from "@/features/institution/services/institutionService";
import { PlacementEntry } from "@/features/institution/types";

export default function InstitutionPlacementsPage() {
  const [entries, setEntries] = useState<PlacementEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingId, setMarkingId] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    institutionService
      .getPlacements()
      .then(setEntries)
      .catch(() => setError("Unable to load placements. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const markPlaced = async (studentId: string) => {
    setMarkingId(studentId);
    try {
      await institutionService.updateStudent(studentId, { status: "placed" });
      setEntries((prev) => prev.map((e) => (e.studentId === studentId ? { ...e, status: "placed" } : e)));
    } catch {
      setError("Failed to update placement status. Please try again.");
    } finally {
      setMarkingId(null);
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink tracking-tight">Placements</h1>
        <p className="text-ink-soft mt-1 text-sm">Offers and confirmed placements among your students.</p>
      </div>

      {error && (
        <div className="flex items-center justify-between gap-3 bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-3 text-sm text-destructive">
          <span>{error}</span>
          <button onClick={load} className="inline-flex items-center gap-1.5 font-semibold shrink-0 hover:underline">
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      <div className="bg-surface border border-border rounded-2xl shadow-elegant overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary-glow" />
          </div>
        ) : entries.length === 0 ? (
          <div className="p-10 text-center">
            <Award className="w-8 h-8 text-ink-soft mx-auto mb-3" />
            <p className="text-sm text-ink-soft">No placements recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-ink-soft border-b border-border">
                  <th className="px-5 py-3">Student</th>
                  <th className="px-5 py-3">Company</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Offer Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {entries.map((e) => (
                  <tr key={e.studentId}>
                    <td className="px-5 py-3">
                      <div className="font-semibold text-ink">{e.studentName}</div>
                      <div className="text-[11px] text-ink-soft">{e.studentEmail}</div>
                    </td>
                    <td className="px-5 py-3 text-ink-soft">{e.companyName || "—"}</td>
                    <td className="px-5 py-3 text-ink-soft">{e.jobTitle || "—"}</td>
                    <td className="px-5 py-3 text-ink-soft">
                      {e.offerDate ? new Date(e.offerDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          e.status === "placed" ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary-glow"
                        }`}
                      >
                        {e.status === "placed" ? "Placed" : "Offered"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {e.status !== "placed" && (
                        <button
                          onClick={() => markPlaced(e.studentId)}
                          disabled={markingId === e.studentId}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-glow hover:underline disabled:opacity-60"
                        >
                          {markingId === e.studentId ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          )}
                          Mark as Placed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
