import React from "react";
import { X, Sparkles, CheckCircle2 } from "lucide-react";
import SectionHeader from "./SectionHeader";

export function ProblemSolution() {
  const problems = [
    ["CVs are self-reported —", "no proof"],
    ["Hiring is", "biased by pedigree & connections"],
    ["Candidates are", "passive — waiting to be found"],
    ["No", "transparency on fit or progress"],
  ];
  const solutions = [
    ["Verified Proof of Work", "— AI interviews + portfolios"],
    ["Blind skill screening", "— zero bias, pure merit"],
    ["Companies bid for you", "— you're in control"],
    ["Live analytics", "— see your ranking, get tips"],
  ];
  return (
    <section id="features" className="py-20 md:py-28 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="The Shift"
          desc={
            <>
              Companies waste <span className="font-semibold text-ink">80% of time</span> on
              unqualified candidates. Great talent gets lost in the noise.{" "}
              <span className="font-semibold text-ink">LetGetIn fixes this.</span>
            </>
          }
        >
          CVs are broken.
          <br />
          <span className="text-gradient-brand">Trust is broken.</span>
        </SectionHeader>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-surface rounded-3xl p-8 border border-border card-hover">
            <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center mb-5">
              <X className="w-6 h-6 text-destructive" />
            </div>
            <h3 className="text-xl font-bold text-ink mb-3">The Old Way</h3>
            <ul className="space-y-3 text-ink-soft">
              {problems.map(([a, b]) => (
                <li key={a} className="flex items-start gap-3">
                  <X className="w-5 h-5 text-destructive/70 shrink-0 mt-0.5" />
                  <span>
                    {a} <span className="font-medium text-ink">{b}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-brand rounded-3xl p-8 shadow-elegant card-hover">
            <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-5 backdrop-blur-sm">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">The LetGetIn Way</h3>
            <ul className="space-y-3 text-white/85">
              {solutions.map(([a, b]) => (
                <li key={a} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
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

export default ProblemSolution;
