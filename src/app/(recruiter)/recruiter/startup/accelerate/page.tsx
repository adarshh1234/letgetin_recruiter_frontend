"use client";

import React from "react";
import { Rocket, Target, Users, Calendar, Award, ExternalLink, Sparkles } from "lucide-react";

export default function StartupAcceleratePage() {
  const accelerators = [
    {
      name: "Y Combinator",
      cohort: "Winter 2026 Batch",
      status: "Applications Open",
      checkSize: "$500,000",
      focus: "High-growth tech startups globally",
      deadline: "October 15, 2026",
      website: "https://www.ycombinator.com",
    },
    {
      name: "Techstars",
      cohort: "Spring Cohort",
      status: "Mentorship Phase",
      checkSize: "$120,000",
      focus: "Industry-specific accelerator tracks",
      deadline: "Rolling Deadline",
      website: "https://www.techstars.com",
    },
    {
      name: "Sequoia Surge",
      cohort: "Surge 11",
      status: "Shortlisting",
      checkSize: "$1M - $3M",
      focus: "Early-stage India & Southeast Asia startups",
      deadline: "November 30, 2026",
      website: "https://surgeahead.com",
    },
    {
      name: "Antler Global",
      cohort: "Pre-Seed Program",
      status: "Interviews Active",
      checkSize: "$150,000",
      focus: "Day zero founder matching & co-founder lab",
      deadline: "Open Now",
      website: "https://www.antler.co",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Accelerate</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Startup Growth
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Top-tier venture acceleration programs, cohort milestones, demo day prep, and partner mentor networks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accelerators.map((acc, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-border bg-surface hover:border-primary/40 transition-all shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-brand text-primary-foreground flex items-center justify-center font-black text-sm shadow-glow">
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-ink">{acc.name}</h3>
                  <span className="text-[11px] text-ink-soft">{acc.cohort}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                {acc.status}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-alt/60 border border-border/70 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-ink-soft">Investment Size:</span>
                <span className="font-bold text-ink">{acc.checkSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Next Deadline:</span>
                <span className="font-semibold text-primary-glow">{acc.deadline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Focus:</span>
                <span className="text-ink truncate max-w-[200px]">{acc.focus}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <a
                href={acc.website}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-primary-glow hover:underline inline-flex items-center gap-1"
              >
                <span>Program Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl bg-gradient-brand text-primary-foreground text-xs font-bold shadow-xs hover:scale-105 transition cursor-pointer"
              >
                Track Application
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
