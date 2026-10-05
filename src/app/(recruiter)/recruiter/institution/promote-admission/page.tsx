"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TrendingUp, Sparkles, Megaphone, Users, Award, Plus, CheckCircle2, ArrowUpRight, BarChart3 } from "lucide-react";

export default function InstitutionPromoteAdmissionPage() {
  const campaigns = [
    {
      id: "adm-1",
      title: "B.Tech Admissions 2027: Record ₹54 LPA Placement Campaign",
      platform: "Meta & Google Display Network",
      headline: "Study Engineering with 88% Placement Guarantee & Global MNC Recruiter Tie-ups",
      leads: 640,
      applications: 182,
      reach: "240k Impressions",
      budget: "₹85,000",
      status: "Active Campaign",
    },
    {
      id: "adm-2",
      title: "MBA & PGDM Executive Placement Showcase",
      platform: "LinkedIn Sponsored InMail",
      headline: "Accelerate Your Leadership Career: Average Package ₹14.5 LPA with Top Consultancies",
      leads: 290,
      applications: 94,
      reach: "85k Impressions",
      budget: "₹60,000",
      status: "Active Campaign",
    },
    {
      id: "adm-3",
      title: "Virtual Campus Tour & Open House Webinar",
      platform: "YouTube & Instagram Live",
      headline: "Meet Our Placement Director & Student Achievers at Google & Microsoft",
      leads: 410,
      applications: 140,
      reach: "110k Views",
      budget: "₹35,000",
      status: "Completed",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Promote Admission</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Placement-Driven Enrollment
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Leverage verified student placement statistics, highest CTC packages, and corporate tie-ups to attract prospective student admissions.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-brand text-primary-foreground text-xs sm:text-sm font-bold shadow-glow hover:opacity-95 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Launch Admission Campaign</span>
        </button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Student Inquiries Generated</span>
          <p className="text-2xl font-black text-ink mt-1">1,340 Leads</p>
          <span className="text-[11px] text-emerald-500 font-semibold">+34% vs last admission cycle</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Verified Applications</span>
          <p className="text-2xl font-black text-primary-glow mt-1">416 Forms</p>
          <span className="text-[11px] text-ink-soft">31% lead conversion rate</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Cost Per Qualified Lead</span>
          <p className="text-2xl font-black text-emerald-500 mt-1">₹134</p>
          <span className="text-[11px] text-emerald-500 font-semibold">Low CAC benchmark</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Campaign Reach</span>
          <p className="text-2xl font-black text-ink mt-1">435k</p>
          <span className="text-[11px] text-ink-soft">Targeting Class XII & Final Year</span>
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="rounded-2xl border border-border bg-surface p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-ink">Active Enrollment & Admission Campaigns</h2>
          <span className="text-xs text-ink-soft">{campaigns.length} running</span>
        </div>

        <div className="space-y-3">
          {campaigns.map((camp) => (
            <div
              key={camp.id}
              className="p-4 rounded-xl bg-surface-alt/50 border border-border/80 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/40 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-ink">{camp.title}</h3>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    {camp.status}
                  </span>
                </div>
                <p className="text-xs text-primary-glow font-semibold">{camp.headline}</p>
                <p className="text-[11px] text-ink-soft">{camp.platform}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center text-xs">
                <div>
                  <span className="text-ink-soft block text-[10px]">Inquiries</span>
                  <span className="font-bold text-ink">{camp.leads}</span>
                </div>
                <div>
                  <span className="text-ink-soft block text-[10px]">Applications</span>
                  <span className="font-bold text-emerald-500">{camp.applications}</span>
                </div>
                <div>
                  <span className="text-ink-soft block text-[10px]">Spend</span>
                  <span className="font-medium text-ink">{camp.budget}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary-glow text-xs font-bold hover:bg-primary/20 transition cursor-pointer"
                >
                  Analytics & Leads
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
