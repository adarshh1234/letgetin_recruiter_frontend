"use client";

import React, { useState } from "react";
import { Megaphone, Sparkles, TrendingUp, Users, Target, Rocket, BarChart3, ArrowUpRight } from "lucide-react";

export default function StartupMarketingPlusPage() {
  const campaigns = [
    {
      name: "Product Hunt Global Launch Sprint",
      type: "Product Launch",
      status: "Scheduled",
      target: "#1 Product of the Day",
      traction: "1,240 Upvote Hunters queued",
      reach: "85k Potential impressions",
      conversion: "Est. 2,400 Signups",
    },
    {
      name: "Founder-Led Thought Leadership on X & LinkedIn",
      type: "Organic Brand",
      status: "Active",
      target: "50k Monthly Impressions",
      traction: "34.8k impressions (68%)",
      reach: "Founders, CTOs, Investors",
      conversion: "420 Demo signups",
    },
    {
      name: "Viral Referral & Waitlist Loop",
      type: "Product-Led Growth",
      status: "Active",
      target: "K-Factor > 1.25",
      traction: "Current K-Factor: 1.34",
      reach: "12,400 active invitees",
      conversion: "31% invite activation",
    },
    {
      name: "Developer Community AI Hackathon Sponsorship",
      type: "Ecosystem DevRel",
      status: "Completed",
      target: "300 Submissions",
      traction: "348 Projects submitted",
      reach: "4,500 builders",
      conversion: "1,800 API keys generated",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Marketing+</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Growth Hacking & PLG
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Accelerate top-of-funnel customer acquisition with viral referral engines, Product Hunt launches, and founder branding.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-brand text-primary-foreground text-xs sm:text-sm font-bold shadow-glow hover:opacity-95 transition cursor-pointer self-start sm:self-auto"
        >
          <Rocket className="w-4 h-4" />
          <span>New Growth Sprint</span>
        </button>
      </div>

      {/* Metrics overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Viral K-Factor</span>
          <p className="text-2xl font-black text-ink mt-1">1.34</p>
          <span className="text-[11px] text-emerald-400 font-semibold">&gt; 1.0 Exponential loop</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">CAC (Customer Acquisition)</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">$14.20</p>
          <span className="text-[11px] text-emerald-400 font-semibold">-32% vs industry avg</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">LTV / CAC Ratio</span>
          <p className="text-2xl font-black text-primary-glow mt-1">5.8x</p>
          <span className="text-[11px] text-ink-soft">Healthy SaaS unit economics</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Monthly Organic Reach</span>
          <p className="text-2xl font-black text-ink mt-1">112k</p>
          <span className="text-[11px] text-emerald-400 font-semibold">+41% MoM growth</span>
        </div>
      </div>

      {/* Growth Sprints */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {campaigns.map((camp, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-border bg-surface hover:border-primary/40 transition-all shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-brand text-primary-foreground flex items-center justify-center font-bold text-sm shadow-glow">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-ink">{camp.name}</h3>
                  <span className="text-[11px] text-ink-soft">{camp.type}</span>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  camp.status === "Active"
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    : camp.status === "Scheduled"
                    ? "text-primary-glow bg-primary/10 border-primary/20"
                    : "text-ink-soft bg-surface-alt border-border"
                }`}
              >
                {camp.status}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-alt/60 border border-border/70 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-ink-soft">Objective:</span>
                <span className="font-bold text-ink">{camp.target}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Current Progress:</span>
                <span className="font-semibold text-primary-glow">{camp.traction}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Conversion Impact:</span>
                <span className="font-semibold text-emerald-400">{camp.conversion}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-ink-soft">Target Audience: {camp.reach}</span>
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary-glow text-xs font-bold hover:bg-primary/20 transition cursor-pointer"
              >
                Sprint Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
