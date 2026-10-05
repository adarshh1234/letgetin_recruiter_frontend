"use client";

import React, { useState } from "react";
import { HeartPulse, Sparkles, Shield, Activity, Users, Smile, Calendar, Plus, CheckCircle2 } from "lucide-react";

export default function StartupCuremasoPage() {
  const [wellnessPrograms, setWellnessPrograms] = useState([
    {
      id: "cure-1",
      title: "Comprehensive Startup Health & OPD Cover",
      provider: "Plum / Care Health",
      category: "Group Health Insurance",
      enrolled: "18 Team Members",
      coverage: "₹5,00,000 per employee + OPD",
      status: "Active Policy",
    },
    {
      id: "cure-2",
      title: "Founder & Core Team Burnout Prevention Lab",
      provider: "MindPeers / In-House",
      category: "Mental Well-being & Therapy",
      enrolled: "12 Sessions Booked",
      coverage: "Unlimited 1:1 confidential counseling",
      status: "Active Benefit",
    },
    {
      id: "cure-3",
      title: "Remote Ergonomic & Fitness Wellness Stipend",
      provider: "LetGetIn Flex Benefits",
      category: "Lifestyle Allowance",
      enrolled: "100% Workforce",
      coverage: "₹3,500/mo gym & ergonomic reimbursement",
      status: "Monthly Cycle",
    },
    {
      id: "cure-4",
      title: "Annual Executive Preventative Health Screening",
      provider: "Apollo Health Checks",
      category: "Full Body Diagnostic",
      enrolled: "All Full-Time Employees",
      coverage: "Comprehensive 82-parameter panel",
      status: "Scheduled Q4",
    },
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Curemaso</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Startup Health & Wellness Suite
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Care for your startup crew with group health plans, mental wellness support, ergonomic care, and preventative screenings.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-brand text-primary-foreground text-xs sm:text-sm font-bold shadow-glow hover:opacity-95 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Health Plan</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <div className="flex items-center justify-between text-xs text-ink-soft mb-1">
            <span>Insured Lives</span>
            <Users className="w-4 h-4 text-primary-glow" />
          </div>
          <p className="text-2xl font-black text-ink">18</p>
          <span className="text-[11px] text-emerald-400 font-semibold">100% Team Protected</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border">
          <div className="flex items-center justify-between text-xs text-ink-soft mb-1">
            <span>Wellness Index</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-ink">92/100</p>
          <span className="text-[11px] text-emerald-400 font-semibold">Low burnout risk</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border">
          <div className="flex items-center justify-between text-xs text-ink-soft mb-1">
            <span>Claims Settled</span>
            <Shield className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-ink">100%</p>
          <span className="text-[11px] text-ink-soft">Cashless network</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border">
          <div className="flex items-center justify-between text-xs text-ink-soft mb-1">
            <span>Mental Care Pulse</span>
            <Smile className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-ink">4.9/5</p>
          <span className="text-[11px] text-primary-glow font-semibold">High team satisfaction</span>
        </div>
      </div>

      {/* Program list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {wellnessPrograms.map((prog) => (
          <div
            key={prog.id}
            className="p-5 rounded-2xl border border-border bg-surface hover:border-primary/40 transition-all shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-brand text-primary-foreground flex items-center justify-center font-bold text-sm shadow-glow">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-ink">{prog.title}</h3>
                  <span className="text-[11px] text-ink-soft">{prog.provider} &bull; {prog.category}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                {prog.status}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-alt/60 border border-border/70 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-ink-soft">Cover Details:</span>
                <span className="font-bold text-ink">{prog.coverage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Enrollment:</span>
                <span className="font-semibold text-primary-glow">{prog.enrolled}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl bg-surface border border-border text-ink hover:text-primary-glow text-xs font-bold transition cursor-pointer"
              >
                Claim Support
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary-glow text-xs font-bold hover:bg-primary/20 transition cursor-pointer"
              >
                Manage Policy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
