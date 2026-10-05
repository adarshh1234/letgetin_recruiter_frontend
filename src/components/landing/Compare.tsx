import React from "react";
import { X, Sparkles, CheckCircle2 } from "lucide-react";
import SectionHeader from "./SectionHeader";

export function Compare() {
  return (
    <section id="compare" className="py-20 md:py-28 px-4 sm:px-6 bg-surface/50">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Why LetGetIn"
          desc="It's a professional identity layer where your actions, verified skills, and community participation are your credentials."
        >
          {/* Not a  */}

          <span className="text-gradient-brand">"BEYOND A RESUME"</span>
        </SectionHeader>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-surface rounded-2xl p-6 border border-border">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary-glow font-bold text-sm">
                OT
              </div>
              <h3 className="font-bold text-ink">Others</h3>
              <span className="ml-auto text-xs font-medium text-destructive bg-destructive/10 px-2.5 py-1 rounded-full">
                Problem
              </span>
            </div>
            <ul className="space-y-2.5 text-sm text-ink-soft">
              {[
                ['"Claims" not proof', "— CVs are self-reported"],
                ["Spammy feeds,", "low engagement"],
                ["No", "transparency for candidates"],
                ["Hiring bias", "from profiles"],
              ].map(([a, b]) => (
                <li key={a} className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-destructive/70 shrink-0 mt-0.5" />
                  <span>
                    <span className="font-medium text-ink">{a}</span> {b}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-brand rounded-2xl p-6 shadow-elegant">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-white">LetGetIn</h3>
              <span className="ml-auto text-xs font-medium text-success bg-white/15 px-2.5 py-1 rounded-full">
                Solution
              </span>
            </div>
            <ul className="space-y-2.5 text-sm text-white/85">
              {[
                ["Verified skill profiles", "— AI interviews + portfolios"],
                ["Gamified challenges", "+ live events that boost prospects"],
                ["Live analytics", "— views, ranking, improvement tips"],
                ["Blind screening", "+ bias-detection AI"],
              ].map(([a, b]) => (
                <li key={a} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                  <span>
                    <span className="font-semibold text-white">{a}</span> {b}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Compare;
