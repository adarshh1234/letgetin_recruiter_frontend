import React from "react";
import { Lightbulb, CheckCircle2, AlertTriangle, Sparkles } from "lucide-react";
import { RecruiterOverview } from "../types";

const KIND_STYLE: Record<string, { icon: typeof Lightbulb; className: string; iconClassName: string }> = {
  suggestion: { icon: Lightbulb, className: "border-l-primary bg-primary/5", iconClassName: "text-primary-glow" },
  success: { icon: CheckCircle2, className: "border-l-emerald-500 bg-emerald-500/5", iconClassName: "text-emerald-600" },
  warning: { icon: AlertTriangle, className: "border-l-destructive bg-destructive/5", iconClassName: "text-destructive" },
};

export function DashboardAIInsights({ items }: { items: RecruiterOverview["aiInsights"] }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-primary-glow" />
        <h2 className="text-sm font-bold text-ink">AI Insights &amp; Intelligence</h2>
      </div>

      <div className="bg-surface border border-border rounded-2xl shadow-elegant p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-primary-glow" />
            <h3 className="text-xs font-bold text-ink uppercase tracking-wide">AI-Powered Recommendations</h3>
          </div>
          {items.length > 0 && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Live
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-ink-soft text-center py-6">
            AI insights will appear as recruitment activity builds.
          </p>
        ) : (
          <div className="space-y-2.5">
            {items.map((insight, i) => {
              const style = KIND_STYLE[insight.kind] || KIND_STYLE.suggestion;
              const Icon = style.icon;
              return (
                <div
                  key={i}
                  className={`flex items-start gap-3 px-3.5 py-3 rounded-xl border-l-4 ${style.className}`}
                >
                  <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${style.iconClassName}`} />
                  <p className="text-sm text-ink leading-relaxed">{insight.text}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
