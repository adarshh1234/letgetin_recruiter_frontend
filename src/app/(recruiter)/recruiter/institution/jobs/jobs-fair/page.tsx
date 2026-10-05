"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Building2, Users, Plus, Award, Calendar, MapPin, CheckCircle2, Ticket } from "lucide-react";

export default function InstitutionJobsFairPage() {
  const booths = [
    {
      boothNo: "Booth A-01",
      company: "Google India & Cloud Labs",
      industry: "Big Tech & AI",
      openPositions: 18,
      roles: ["Cloud Architect", "Software Engineer", "UX Designer"],
      location: "Grand Exhibition Hall 1",
      interviewsConducted: 46,
      offersGiven: 6,
    },
    {
      boothNo: "Booth A-04",
      company: "Bosch Global Software Technologies",
      industry: "Automotive & Embedded Systems",
      openPositions: 35,
      roles: ["Embedded C Developer", "ADAS Vision Engineer"],
      location: "Grand Exhibition Hall 1",
      interviewsConducted: 72,
      offersGiven: 14,
    },
    {
      boothNo: "Booth B-02",
      company: "Goldman Sachs & Morgan Stanley Pavilion",
      industry: "Investment Banking & FinTech",
      openPositions: 22,
      roles: ["Risk Analyst", "Quantitative Dev", "Financial Tech"],
      location: "Hall 2 (North Wing)",
      interviewsConducted: 58,
      offersGiven: 9,
    },
    {
      boothNo: "Booth C-07",
      company: "Razorpay / Swiggy / Zepto (Unicorn Hub)",
      industry: "High-Growth Startups",
      openPositions: 40,
      roles: ["Backend SDE", "Product Operations", "Growth Analyst"],
      location: "Innovation Arena",
      interviewsConducted: 89,
      offersGiven: 18,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/recruiter/institution/jobs"
              className="p-1.5 rounded-xl border border-border bg-surface text-ink-soft hover:text-ink hover:bg-surface-alt transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Annual Mega Jobs Fair</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Live Campus Fair 2026
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Coordinate multi-company recruitment pavilions, student digital passes, and instant walk-in on-spot offers.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-brand text-primary-foreground text-xs sm:text-sm font-bold shadow-glow hover:opacity-95 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register Employer Booth</span>
        </button>
      </div>

      {/* Fair Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Registered Employers</span>
          <p className="text-2xl font-black text-ink mt-1">45 Booths</p>
          <span className="text-[11px] text-emerald-500 font-semibold">Across 8 Tech Sectors</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Student Entry Passes</span>
          <p className="text-2xl font-black text-primary-glow mt-1">1,480 Passes</p>
          <span className="text-[11px] text-ink-soft">Verified digital QR passes</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Live Interviews Today</span>
          <p className="text-2xl font-black text-ink mt-1">265 Walk-ins</p>
          <span className="text-[11px] text-emerald-500 font-semibold">In designated interview cabins</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">On-Spot Offers Rolled</span>
          <p className="text-2xl font-black text-emerald-500 mt-1">47 LOIs Issued</p>
          <span className="text-[11px] text-ink-soft">Instant letters of intent</span>
        </div>
      </div>

      {/* Booths Grid */}
      <div className="rounded-2xl border border-border bg-surface p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-ink">Participating Recruiter Booths</h2>
          <span className="text-xs text-ink-soft">Live Status</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {booths.map((b, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-border bg-surface hover:border-primary/40 transition-all shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-black text-primary-glow bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                    {b.boothNo}
                  </span>
                  <h3 className="text-sm font-extrabold text-ink mt-1.5">{b.company}</h3>
                  <span className="text-[11px] text-ink-soft">{b.industry} &bull; {b.location}</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  {b.openPositions} Vacancies
                </span>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {b.roles.map((r, rIdx) => (
                  <span key={rIdx} className="text-[10px] bg-surface-alt border border-border/80 text-ink px-2 py-0.5 rounded-md font-medium">
                    {r}
                  </span>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-surface-alt/60 border border-border/70 text-xs flex items-center justify-between">
                <div>
                  <span className="text-ink-soft text-[10px] block">Walk-in Interviews</span>
                  <span className="font-bold text-ink">{b.interviewsConducted} Candidates</span>
                </div>
                <div>
                  <span className="text-ink-soft text-[10px] block">On-Spot Offers</span>
                  <span className="font-black text-emerald-500">{b.offersGiven} Issued</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary-glow text-xs font-bold hover:bg-primary/20 transition cursor-pointer"
                >
                  Manage Booth Queue
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
