"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Briefcase, Users, Plus, CheckCircle2, Award, TrendingUp } from "lucide-react";

export default function InstitutionJuniorTraineePage() {
  const traineeTracks = [
    {
      id: "jt-1",
      company: "Tata Motors Commercial Vehicles",
      programName: "Graduate Engineer Trainee (GET) 2026",
      stream: "Mechanical, Electrical, Production",
      ctcTrainee: "₹9.5 LPA",
      ctcConfirmed: "₹12.5 LPA (Post 1-Year Confirmation)",
      batchEnrolled: 28,
      status: "Recruiting Active",
    },
    {
      id: "jt-2",
      company: "Wipro Technologies (Elite NLTH)",
      programName: "Project Engineer / Junior Tech Trainee",
      stream: "CSE, IT, ECE, MCA",
      ctcTrainee: "₹6.5 LPA",
      ctcConfirmed: "₹8.0 LPA",
      batchEnrolled: 64,
      status: "Drive Completed",
    },
    {
      id: "jt-3",
      company: "HDFC Bank Corporate Office",
      programName: "Management Trainee (MT) - Wholesale Banking",
      stream: "MBA / PGDM & B.Tech+MBA",
      ctcTrainee: "₹14.0 LPA",
      ctcConfirmed: "₹16.5 LPA",
      batchEnrolled: 16,
      status: "Interview Round 2",
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
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Junior Trainee Programs</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> GET & MT Career Tracks
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Track entry-level Graduate Engineer Trainee (GET) and Management Trainee (MT) pipeline tracks and permanent role conversions.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-brand text-primary-foreground text-xs sm:text-sm font-bold shadow-glow hover:opacity-95 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Trainee Track</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Active Trainee Placements</span>
          <p className="text-2xl font-black text-ink mt-1">108 Hired GETs/MTs</p>
          <span className="text-[11px] text-emerald-500 font-semibold">Across 22 core employers</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Confirmation Rate</span>
          <p className="text-2xl font-black text-emerald-500 mt-1">94% Retention</p>
          <span className="text-[11px] text-ink-soft">Converted to full executive roles</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Avg Trainee Compensation</span>
          <p className="text-2xl font-black text-primary-glow mt-1">₹10.2 LPA</p>
          <span className="text-[11px] text-ink-soft">Includes post-probation bumps</span>
        </div>
      </div>

      {/* Trainee Tracks Feed */}
      <div className="grid grid-cols-1 gap-4">
        {traineeTracks.map((tr) => (
          <div
            key={tr.id}
            className="p-5 rounded-2xl border border-border bg-surface hover:border-primary/40 transition-all shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-brand text-primary-foreground flex items-center justify-center font-bold text-sm shadow-glow shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-ink">{tr.programName}</h3>
                  <span className="text-[11px] font-bold text-primary-glow">{tr.company} &bull; {tr.stream}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full self-start sm:self-auto">
                {tr.status}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-alt/60 border border-border/70 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-ink-soft text-[10px] block">Training Package:</span>
                <span className="font-bold text-ink">{tr.ctcTrainee}</span>
              </div>
              <div>
                <span className="text-ink-soft text-[10px] block">Post-Confirmation CTC:</span>
                <span className="font-bold text-emerald-500">{tr.ctcConfirmed}</span>
              </div>
              <div>
                <span className="text-ink-soft text-[10px] block">Selected Cadre:</span>
                <span className="font-semibold text-primary-glow">{tr.batchEnrolled} Students</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary-glow text-xs font-bold hover:bg-primary/20 transition cursor-pointer"
              >
                Trainee Dossiers
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
