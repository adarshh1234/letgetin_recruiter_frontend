import React from "react";
import { type LucideIcon } from "lucide-react";

interface DashboardMetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number | null;
  context?: string;
  emptyText?: string;
}

export function DashboardMetricCard({ icon: Icon, label, value, context, emptyText }: DashboardMetricCardProps) {
  const isEmpty = value === null || value === undefined;

  return (
    <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm">
      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center mb-2.5">
        <Icon className="w-4 h-4 text-primary-glow" />
      </div>
      {isEmpty ? (
        <div className="text-xs text-ink-soft leading-snug min-h-[2.5rem] flex items-end">
          {emptyText || "Not enough data yet"}
        </div>
      ) : (
        <div className="text-xl font-extrabold text-ink">{value}</div>
      )}
      <div className="text-[11px] text-ink-soft mt-0.5">{label}</div>
      {!isEmpty && context && <div className="text-[10px] text-primary-glow font-semibold mt-1">{context}</div>}
    </div>
  );
}
