"use client";

import React, { useState } from "react";
import { Award, Sparkles, DollarSign, ExternalLink, Calendar, CheckCircle2, Clock } from "lucide-react";

export default function StartupGrantsPage() {
  const [filter, setFilter] = useState("all");

  const grants = [
    {
      name: "Google for Startups Cloud Program",
      provider: "Google Cloud",
      category: "Cloud Credits",
      grantAmount: "$100,000 Credits",
      status: "Eligible to Apply",
      deadline: "Rolling 2026",
      equity: "0% (Non-dilutive)",
      description: "Cloud infrastructure credits, Gemini AI model credits, and dedicated Google tech advisor access.",
      link: "https://cloud.google.com/startup",
    },
    {
      name: "AWS Activate Founders Program",
      provider: "Amazon Web Services",
      category: "Cloud & AI Compute",
      grantAmount: "$25,000 - $100,000",
      status: "Application Under Review",
      deadline: "September 30, 2026",
      equity: "0% (Non-dilutive)",
      description: "AWS cloud credits, business support plan, Bedrock API credits, and architecture reviews.",
      link: "https://aws.amazon.com/activate/",
    },
    {
      name: "Microsoft for Startups Founders Hub",
      provider: "Microsoft",
      category: "Compute & AI Credits",
      grantAmount: "Up to $150,000",
      status: "Approved & Active",
      deadline: "Ongoing",
      equity: "0% (Non-dilutive)",
      description: "Azure credits, free GitHub Enterprise, OpenAI & Copilot credits, and LinkedIn ads vouchers.",
      link: "https://foundershub.startups.microsoft.com/",
    },
    {
      name: "Innovate AI DeepTech Grant",
      provider: "Global Tech Innovation Fund",
      category: "Cash Grant",
      grantAmount: "$75,000 Direct Cash",
      status: "Shortlisted",
      deadline: "November 15, 2026",
      equity: "0% (Non-dilutive)",
      description: "Unconditional R&D research grant for open source AI and frontier engineering prototypes.",
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Grants</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Non-Dilutive Capital
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Discover, track, and apply for corporate non-dilutive innovation grants, cloud compute credits, and research vouchers.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Approved & Active Value</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">$150,000</p>
          <span className="text-[11px] text-ink-soft">Azure & OpenAI credits unlocked</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Applications in Pipeline</span>
          <p className="text-2xl font-black text-primary-glow mt-1">2 Pending</p>
          <span className="text-[11px] text-ink-soft">Estimated potential: $175,000</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Equity Diluted</span>
          <p className="text-2xl font-black text-ink mt-1">0%</p>
          <span className="text-[11px] text-emerald-400 font-semibold">100% Founder Retained</span>
        </div>
      </div>

      {/* Grant Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {grants.map((grant, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-border bg-surface hover:border-primary/40 transition-all shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-brand text-primary-foreground flex items-center justify-center font-bold text-sm shadow-glow">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-ink">{grant.name}</h3>
                  <span className="text-[11px] text-ink-soft">{grant.provider} &bull; {grant.category}</span>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  grant.status.includes("Approved")
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    : grant.status.includes("Review")
                    ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                    : "text-primary-glow bg-primary/10 border-primary/20"
                }`}
              >
                {grant.status}
              </span>
            </div>

            <p className="text-xs text-ink-soft line-clamp-2">{grant.description}</p>

            <div className="p-3 rounded-xl bg-surface-alt/60 border border-border/70 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-ink-soft">Value:</span>
                <span className="font-bold text-ink">{grant.grantAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Equity Requirement:</span>
                <span className="font-semibold text-emerald-400">{grant.equity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Next Deadline:</span>
                <span className="font-medium text-ink">{grant.deadline}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <a
                href={grant.link}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-primary-glow hover:underline inline-flex items-center gap-1"
              >
                <span>Program Guidelines</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary-glow text-xs font-bold hover:bg-primary/20 transition cursor-pointer"
              >
                Manage Grant
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
