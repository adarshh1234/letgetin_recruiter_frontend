"use client";

import React, { useState } from "react";
import { Send, Sparkles, Mail, UserCheck, BarChart3, RefreshCw, Plus, CheckCircle2, Play, Pause } from "lucide-react";

export default function StartupAutoOutreachPage() {
  const [activeCampaigns, setActiveCampaigns] = useState([
    {
      id: "camp-1",
      name: "Seed Round - Tier 1 Angel Syndicates",
      status: "Active",
      channel: "Email Sequence",
      prospects: 142,
      contacted: 98,
      opened: "64%",
      replies: "22%",
      scheduledCalls: 9,
    },
    {
      id: "camp-2",
      name: "Fintech & SaaS Early VC Partners",
      status: "Active",
      channel: "LinkedIn & Email Multi-touch",
      prospects: 85,
      contacted: 40,
      opened: "71%",
      replies: "28%",
      scheduledCalls: 6,
    },
    {
      id: "camp-3",
      name: "Strategic Corporate Angels (Founders)",
      status: "Paused",
      channel: "Personalized Video Intro",
      prospects: 30,
      contacted: 30,
      opened: "85%",
      replies: "40%",
      scheduledCalls: 7,
    },
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Auto OutReach</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> AI Hyper-Personalized
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Automate personalized cold email and LinkedIn investor outreach sequences with dynamic thesis matching.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-brand text-primary-foreground text-xs sm:text-sm font-bold shadow-glow hover:opacity-95 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Launch Campaign</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <div className="flex items-center justify-between text-xs text-ink-soft mb-1">
            <span>Total Sent</span>
            <Send className="w-4 h-4 text-primary-glow" />
          </div>
          <p className="text-2xl font-black text-ink">168</p>
          <span className="text-[11px] text-emerald-500 font-semibold">+34 this week</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border">
          <div className="flex items-center justify-between text-xs text-ink-soft mb-1">
            <span>Avg Open Rate</span>
            <Mail className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-ink">68.4%</p>
          <span className="text-[11px] text-emerald-500 font-semibold">Top 5% benchmark</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border">
          <div className="flex items-center justify-between text-xs text-ink-soft mb-1">
            <span>Reply Rate</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-ink">27.2%</p>
          <span className="text-[11px] text-emerald-500 font-semibold">46 warm replies</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border">
          <div className="flex items-center justify-between text-xs text-ink-soft mb-1">
            <span>Pitch Meetings</span>
            <BarChart3 className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-ink">22</p>
          <span className="text-[11px] text-primary-glow font-semibold">Calls locked</span>
        </div>
      </div>

      {/* Campaign List */}
      <div className="rounded-2xl border border-border bg-surface p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-ink">Active Outreach Workflows</h2>
          <span className="text-xs text-ink-soft">{activeCampaigns.length} running</span>
        </div>

        <div className="space-y-3">
          {activeCampaigns.map((camp) => (
            <div
              key={camp.id}
              className="p-4 rounded-xl bg-surface-alt/50 border border-border/80 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/40 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-ink">{camp.name}</h3>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      camp.status === "Active"
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                        : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                    }`}
                  >
                    {camp.status}
                  </span>
                </div>
                <p className="text-xs text-ink-soft">{camp.channel}</p>
              </div>

              <div className="grid grid-cols-4 gap-4 text-center text-xs">
                <div>
                  <span className="text-ink-soft block text-[10px]">Contacted</span>
                  <span className="font-bold text-ink">{camp.contacted}/{camp.prospects}</span>
                </div>
                <div>
                  <span className="text-ink-soft block text-[10px]">Opens</span>
                  <span className="font-bold text-indigo-400">{camp.opened}</span>
                </div>
                <div>
                  <span className="text-ink-soft block text-[10px]">Replies</span>
                  <span className="font-bold text-emerald-400">{camp.replies}</span>
                </div>
                <div>
                  <span className="text-ink-soft block text-[10px]">Meetings</span>
                  <span className="font-bold text-primary-glow">{camp.scheduledCalls}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  type="button"
                  onClick={() =>
                    setActiveCampaigns((prev) =>
                      prev.map((c) =>
                        c.id === camp.id
                          ? { ...c, status: c.status === "Active" ? "Paused" : "Active" }
                          : c
                      )
                    )
                  }
                  className="p-2 rounded-lg bg-surface border border-border text-ink hover:text-primary-glow transition cursor-pointer"
                  title={camp.status === "Active" ? "Pause" : "Resume"}
                >
                  {camp.status === "Active" ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary-glow text-xs font-semibold hover:bg-primary/20 transition cursor-pointer"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
