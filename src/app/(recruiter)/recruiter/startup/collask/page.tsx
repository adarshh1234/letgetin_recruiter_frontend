"use client";

import React, { useState } from "react";
import { Handshake, Sparkles, MessageSquare, Tag, Users, Share2, Plus, CheckCircle2, ArrowRight } from "lucide-react";

export default function StartupCollaskPage() {
  const [filter, setFilter] = useState("all");

  const asks = [
    {
      id: "ask-1",
      startup: "HealthStack AI (Seed stage)",
      founder: "Aditi S. (Founder & CEO)",
      type: "Warm Intro Request",
      tag: "Intros",
      title: "Looking for warm intros to Hospital CIOs & Chief Medical Officers in Bengaluru",
      reward: "Offering free AI workflow audit & $1,000 cloud credits to connector",
      responses: 5,
      postedAgo: "2 hours ago",
    },
    {
      id: "ask-2",
      startup: "LogiFlow Tech (Series A)",
      founder: "Rahul V. (CTO)",
      type: "GPU Compute Cluster Sharing",
      tag: "Infrastructure",
      title: "Surplus 8x H100 GPU cluster available on spot instance discount for 3 weeks",
      reward: "60% below standard AWS cloud pricing for fellow portfolio startups",
      responses: 11,
      postedAgo: "5 hours ago",
    },
    {
      id: "ask-3",
      startup: "FinGuard (Pre-seed)",
      founder: "Priya M. (Co-founder)",
      type: "Barter Partnership",
      tag: "Co-Marketing",
      title: "Co-marketing webinar & newsletter swap targeting 4,000+ early-stage fintech founders",
      reward: "Cross-featured newsletter blast + joint press mention",
      responses: 8,
      postedAgo: "1 day ago",
    },
    {
      id: "ask-4",
      startup: "DevPilot (Seed)",
      founder: "Karthik R. (Founder)",
      type: "Fractional Talent Ask",
      tag: "Hiring & Advice",
      title: "Seeking 2 hours/week fractional US SOC2 compliance lead for audit preparation",
      reward: "Advisory equity grant or competitive consulting retainer",
      responses: 4,
      postedAgo: "2 days ago",
    },
  ];

  const filteredAsks =
    filter === "all" ? asks : asks.filter((a) => a.tag.toLowerCase() === filter.toLowerCase());

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Collask</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Founder Asks & Ecosystem Syndicate
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Exchange warm intros, pool GPU compute clusters, barter perks, and collaborate with peer venture founders.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-brand text-primary-foreground text-xs sm:text-sm font-bold shadow-glow hover:opacity-95 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post an Ask or Offer</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["all", "Intros", "Infrastructure", "Co-Marketing", "Hiring & Advice"].map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setFilter(tag)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              filter === tag
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-surface border border-border text-ink-soft hover:text-ink"
            }`}
          >
            {tag === "all" ? "All Syndicate Asks" : tag}
          </button>
        ))}
      </div>

      {/* Asks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAsks.map((ask) => (
          <div
            key={ask.id}
            className="p-5 rounded-2xl border border-border bg-surface hover:border-primary/40 transition-all shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-brand text-primary-foreground flex items-center justify-center font-bold text-sm shadow-glow">
                  <Handshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-ink">{ask.startup}</h3>
                  <span className="text-[11px] text-ink-soft">{ask.founder} &bull; {ask.postedAgo}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                {ask.type}
              </span>
            </div>

            <p className="text-xs font-bold text-ink leading-relaxed">{ask.title}</p>

            <div className="p-3 rounded-xl bg-surface-alt/60 border border-border/70 text-xs space-y-1">
              <span className="text-ink-soft block text-[10px]">Ecosystem Barter / Reward:</span>
              <p className="text-emerald-400 font-semibold">{ask.reward}</p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-ink-soft flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-primary-glow" />
                <span>{ask.responses} fellow founders responded</span>
              </span>
              <button
                type="button"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary-glow text-xs font-bold hover:bg-primary/20 transition cursor-pointer"
              >
                <span>Connect & Help</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
