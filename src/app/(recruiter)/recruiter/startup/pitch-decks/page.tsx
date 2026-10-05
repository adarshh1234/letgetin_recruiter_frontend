"use client";

import React, { useState } from "react";
import { Presentation, Sparkles, Upload, Share2, Eye, Download, BarChart2, Clock, Copy, Check } from "lucide-react";

export default function StartupPitchDecksPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const decks = [
    {
      id: "deck-1",
      title: "Seed Round Master Deck 2026",
      version: "v3.4 (Updated Financial Model)",
      slides: 14,
      updatedAt: "2 days ago",
      views: 89,
      avgTimeSpent: "4m 12s",
      completionRate: "78%",
      shareUrl: "https://letgetin.com/deck/seed-v3-4-secret",
    },
    {
      id: "deck-2",
      title: "1-Pager Investor Memo & Executive Teaser",
      version: "v2.1 (Non-Confidential)",
      slides: 2,
      updatedAt: "1 week ago",
      views: 245,
      avgTimeSpent: "1m 45s",
      completionRate: "92%",
      shareUrl: "https://letgetin.com/deck/teaser-v2",
    },
    {
      id: "deck-3",
      title: "Demo Day 3-Minute Lightning Deck",
      version: "v1.0 (Cohort Finals)",
      slides: 7,
      updatedAt: "3 weeks ago",
      views: 112,
      avgTimeSpent: "2m 50s",
      completionRate: "84%",
      shareUrl: "https://letgetin.com/deck/demoday-fast",
    },
    {
      id: "deck-4",
      title: "Technical Architecture & AI Moat Deep Dive",
      version: "v1.2 (Due Diligence Appendix)",
      slides: 18,
      updatedAt: "Last month",
      views: 34,
      avgTimeSpent: "6m 30s",
      completionRate: "65%",
      shareUrl: "https://letgetin.com/deck/tech-moat-appendix",
    },
  ];

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Pitch Decks</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Tracked Investor Decks
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Manage pitch deck revisions, generate DocSend-style tracked investor share links, and inspect engagement analytics.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-brand text-primary-foreground text-xs sm:text-sm font-bold shadow-glow hover:opacity-95 transition cursor-pointer self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New Deck</span>
        </button>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Total Unique Investor Views</span>
          <p className="text-2xl font-black text-ink mt-1">480 Views</p>
          <span className="text-[11px] text-emerald-400 font-semibold">+68 in last 7 days</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Avg Investor Read Time</span>
          <p className="text-2xl font-black text-primary-glow mt-1">3m 48s</p>
          <span className="text-[11px] text-ink-soft">High engagement benchmark</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Completion Through Ask</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">81%</p>
          <span className="text-[11px] text-ink-soft">Reached financial ask slide</span>
        </div>
      </div>

      {/* Decks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {decks.map((deck) => (
          <div
            key={deck.id}
            className="p-5 rounded-2xl border border-border bg-surface hover:border-primary/40 transition-all shadow-xs space-y-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-brand text-primary-foreground flex items-center justify-center font-bold text-sm shadow-glow">
                  <Presentation className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-ink">{deck.title}</h3>
                  <span className="text-[11px] text-ink-soft">{deck.version} &bull; {deck.slides} Slides</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                {deck.updatedAt}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-surface-alt/60 border border-border/70 text-center text-xs">
              <div>
                <span className="text-ink-soft block text-[10px]">Views</span>
                <span className="font-bold text-ink">{deck.views}</span>
              </div>
              <div>
                <span className="text-ink-soft block text-[10px]">Avg Time</span>
                <span className="font-bold text-ink">{deck.avgTimeSpent}</span>
              </div>
              <div>
                <span className="text-ink-soft block text-[10px]">Completion</span>
                <span className="font-bold text-emerald-400">{deck.completionRate}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleCopy(deck.id, deck.shareUrl)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary-glow text-xs font-bold hover:bg-primary/20 transition cursor-pointer"
              >
                {copiedId === deck.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedId === deck.id ? "Link Copied!" : "Copy Tracked Link"}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-1.5 rounded-lg bg-surface border border-border text-ink hover:text-primary-glow transition cursor-pointer"
                  title="View Analytics"
                >
                  <BarChart2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-1.5 rounded-lg bg-surface border border-border text-ink hover:text-primary-glow transition cursor-pointer"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
