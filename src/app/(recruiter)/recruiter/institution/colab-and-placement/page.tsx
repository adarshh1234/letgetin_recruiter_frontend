"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Handshake, Sparkles, Building2, Users, Plus, Award, Calendar, CheckCircle2, ArrowRight } from "lucide-react";

export default function InstitutionColabAndPlacementPage() {
  const consortiums = [
    {
      id: "pool-1",
      title: "State Engineering College Placement Consortium",
      partners: "6 Partner Institutes (Tier-2 & Tier-3 Hub)",
      combinedStudents: 3200,
      recruiterHost: "Amazon AWS & Cognizant Pool Drive",
      date: "Nov 04 - Nov 06, 2026",
      status: "Registration Open",
      description: "Pooled campus placement drive allowing joint batch assessment in our Central Tech Park.",
    },
    {
      id: "pool-2",
      title: "FinTech & Banking Shared Campus Drive",
      partners: "4 Regional Business Schools",
      combinedStudents: 650,
      recruiterHost: "HDFC, ICICI & Axis Bank Joint Drive",
      date: "Nov 12, 2026",
      status: "MOU Signed",
      description: "Co-hosted management trainee hiring panel with shared video assessment infrastructure.",
    },
    {
      id: "pool-3",
      title: "National Inter-College AI Hackathon & Placement Arena",
      partners: "12 Engineering Campuses",
      combinedStudents: 1800,
      recruiterHost: "NVIDIA / Microsoft Reactor",
      date: "Dec 01 - Dec 03, 2026",
      status: "Shortlisting Projects",
      description: "Hackathon project evaluations directly leading to pre-placement interview bypass.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Colab and Placement</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Inter-College Placement Pool
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Pool campus placement drives with peer colleges, attract mega tier-1 employers, and share recruitment test infrastructure.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-brand text-primary-foreground text-xs sm:text-sm font-bold shadow-glow hover:opacity-95 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Form Placement Consortium</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Active Partner Colleges</span>
          <p className="text-2xl font-black text-ink mt-1">18 Institutions</p>
          <span className="text-[11px] text-emerald-500 font-semibold">Shared placement consortiums</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Combined Pool Talent</span>
          <p className="text-2xl font-black text-primary-glow mt-1">5,650 Students</p>
          <span className="text-[11px] text-ink-soft">High volume attracts Tier-1 MNCs</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Pooled Mega Drives Locked</span>
          <p className="text-2xl font-black text-emerald-500 mt-1">8 Joint Drives</p>
          <span className="text-[11px] text-ink-soft">Season 2026-27</span>
        </div>
      </div>

      {/* Consortiums List */}
      <div className="grid grid-cols-1 gap-4">
        {consortiums.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-2xl border border-border bg-surface hover:border-primary/40 transition-all shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-brand text-primary-foreground flex items-center justify-center font-bold text-sm shadow-glow shrink-0">
                  <Handshake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-ink">{c.title}</h3>
                  <span className="text-[11px] text-ink-soft">{c.partners}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full self-start sm:self-auto">
                {c.status}
              </span>
            </div>

            <p className="text-xs text-ink-soft leading-relaxed">{c.description}</p>

            <div className="p-3 rounded-xl bg-surface-alt/60 border border-border/70 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-ink-soft text-[10px] block">Corporate Host:</span>
                <span className="font-bold text-ink">{c.recruiterHost}</span>
              </div>
              <div>
                <span className="text-ink-soft text-[10px] block">Combined Talent:</span>
                <span className="font-semibold text-primary-glow">{c.combinedStudents} Candidates</span>
              </div>
              <div>
                <span className="text-ink-soft text-[10px] block">Date:</span>
                <span className="font-medium text-ink">{c.date}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary-glow text-xs font-bold hover:bg-primary/20 transition cursor-pointer"
              >
                <span>Consortium Dashboard</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
