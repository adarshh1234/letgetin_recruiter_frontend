import React from "react";
import { Filter, CheckCircle2, AlertTriangle, RefreshCw } from "lucide-react";
import { RecruiterOverview } from "../types";

export function DashboardCandidateFunnel({
  funnel,
  insights,
}: {
  funnel: RecruiterOverview["funnel"];
  insights: RecruiterOverview["funnelInsights"];
}) {
  const maxCount = Math.max(1, ...funnel.map((f) => f.count));
  const hasData = funnel.some((f) => f.count > 0);

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Filter className="w-4 h-4 text-primary-glow" />
        <h2 className="text-sm font-bold text-ink">Pipeline &amp; Funnel</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-surface border border-border rounded-2xl shadow-elegant p-5 sm:p-6">
          <h3 className="text-xs font-bold text-ink uppercase tracking-wide mb-4">Candidate Funnel</h3>

          {!hasData ? (
            <p className="text-sm text-ink-soft text-center py-8">
              Your candidate funnel will appear here once candidates apply.
            </p>
          ) : (
            <div className="space-y-3">
              {funnel.map((f) => (
                <div key={f.stage} className="flex items-center gap-3">
                  <div className="w-24 shrink-0 text-xs font-semibold text-ink-soft">{f.label}</div>
                  <div className="flex-1 h-2.5 rounded-full bg-surface-alt overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-brand transition-all"
                      style={{ width: `${Math.max(4, (f.count / maxCount) * 100)}%` }}
                    />
                  </div>
                  <div className="w-10 shrink-0 text-right text-sm font-bold text-ink">{f.count}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 sm:p-6">
          <h3 className="text-xs font-bold text-ink uppercase tracking-wide mb-4">AI Funnel Insights</h3>

          {insights.length === 0 ? (
            <p className="text-sm text-ink-soft">
              AI funnel insights will appear as your candidate pipeline grows.
            </p>
          ) : (
            <div className="space-y-3">
              {insights.map((insight, i) => {
                const Icon = insight.kind === "success" ? CheckCircle2 : AlertTriangle;
                const iconClass = insight.kind === "success" ? "text-emerald-600" : "text-destructive";
                return (
                  <div key={i} className="flex items-start gap-2.5">
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${iconClass}`} />
                    <p className="text-xs text-ink leading-relaxed">{insight.text}</p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex items-center gap-1.5 text-[10px] text-ink-soft mt-4 pt-4 border-t border-primary/10">
            <RefreshCw className="w-3 h-3" />
            Updates as your pipeline changes
          </div>
        </div>
      </div>
    </div>
  );
}
