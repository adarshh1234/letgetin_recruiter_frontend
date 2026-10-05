"use client";

import React, { useState } from "react";
import { GraduationCap, Sparkles, Building2, BookOpen, Users, Award, Plus, CheckCircle2, ExternalLink } from "lucide-react";

export default function StartupAcmasoPage() {
  const partnerships = [
    {
      id: "ac-1",
      institution: "IIT Bombay - Centre of Excellence in AI",
      type: "Research Partnership & Joint Lab",
      fellows: "4 M.Tech / PhD Scholars",
      focus: "Domain-Specific LLM Fine-Tuning & Quantization",
      status: "Active MOU",
      deliverable: "Co-authored research paper & shared provisional patent",
    },
    {
      id: "ac-2",
      institution: "IIIT Hyderabad - Foundation for Tech & Innovation",
      type: "Sponsored Capstone Cohort",
      fellows: "8 Final-Year Engineers",
      focus: "Computer Vision & Edge Model Inference",
      status: "Active Semester",
      deliverable: "Working MVP prototype & pre-placement intern offers",
    },
    {
      id: "ac-3",
      institution: "BITS Pilani - Technology Business Incubator",
      type: "Incubation & Student Founder Fellowship",
      fellows: "2 Student Entrepreneur Teams",
      focus: "Algorithmic Market Intelligence",
      status: "MOU Signed",
      deliverable: "Testing sandbox access & industry mentorship",
    },
    {
      id: "ac-4",
      institution: "Indian Institute of Science (IISc) Bengaluru",
      type: "Tech Transfer & DeepTech Advisory",
      fellows: "Faculty Advisory Board",
      focus: "Autonomous Agent Safety & Verification",
      status: "Review Stage",
      deliverable: "Specialized mathematical proofs for security claims",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Acmaso</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Academic & Institute Partnerships
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Collaborate with top universities, sponsor research capstones, recruit PhD researchers, and co-develop frontier intellectual property.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-brand text-primary-foreground text-xs sm:text-sm font-bold shadow-glow hover:opacity-95 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Academic MOU</span>
        </button>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Partner Universities</span>
          <p className="text-2xl font-black text-ink mt-1">4 Institutes</p>
          <span className="text-[11px] text-emerald-400 font-semibold">Tier-1 IITs, IIITs & BITS</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Sponsored Research Fellows</span>
          <p className="text-2xl font-black text-primary-glow mt-1">12 Scholars</p>
          <span className="text-[11px] text-ink-soft">Active in joint lab initiatives</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Talent Conversion</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">85%</p>
          <span className="text-[11px] text-ink-soft">Fellows accepting full-time offers</span>
        </div>
      </div>

      {/* Partnerships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {partnerships.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl border border-border bg-surface hover:border-primary/40 transition-all shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-brand text-primary-foreground flex items-center justify-center font-bold text-sm shadow-glow">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-ink">{item.institution}</h3>
                  <span className="text-[11px] text-ink-soft">{item.type}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                {item.status}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-alt/60 border border-border/70 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-ink-soft">Research Focus:</span>
                <span className="font-semibold text-ink truncate max-w-[200px]">{item.focus}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Sponsored Fellows:</span>
                <span className="font-medium text-ink">{item.fellows}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Key Milestone:</span>
                <span className="font-medium text-emerald-400 truncate max-w-[200px]">{item.deliverable}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-ink-soft">Joint Lab Access Active</span>
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary-glow text-xs font-bold hover:bg-primary/20 transition cursor-pointer"
              >
                Partnership Hub
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
