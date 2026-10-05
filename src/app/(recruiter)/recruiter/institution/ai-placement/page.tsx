"use client";

import React, { useState } from "react";
import { Sparkles, Users, Building2, CheckCircle2, TrendingUp, Search, Filter, ArrowUpRight, Zap, Target } from "lucide-react";

export default function InstitutionAiPlacementPage() {
  const [selectedBatch, setSelectedBatch] = useState("2026");
  const [searchQuery, setSearchQuery] = useState("");

  const recommendations = [
    {
      id: "rec-1",
      candidateName: "Rohan Verma",
      rollNo: "22CS104",
      department: "Computer Science & Engg",
      cgpa: 9.42,
      skills: ["PyTorch", "Next.js", "System Design", "Go"],
      matchCompany: "Google India",
      role: "Software Development Engineer - I",
      matchScore: 97,
      readiness: "Interview Ready",
      eligibility: "Eligible (0 Backlogs)",
    },
    {
      id: "rec-2",
      candidateName: "Ananya Deshmukh",
      rollNo: "22EC089",
      department: "Electronics & Comm",
      cgpa: 9.15,
      skills: ["Embedded C", "VLSI", "Verilog", "Python"],
      matchCompany: "Texas Instruments",
      role: "Analog & Firmware Engineer",
      matchScore: 94,
      readiness: "Assessment Passed",
      eligibility: "Eligible (0 Backlogs)",
    },
    {
      id: "rec-3",
      candidateName: "Karthik Subramanian",
      rollNo: "22IT045",
      department: "Information Technology",
      cgpa: 8.85,
      skills: ["AWS", "Docker", "Kubernetes", "TypeScript"],
      matchCompany: "Atlassian",
      role: "Cloud Site Reliability Engineer",
      matchScore: 92,
      readiness: "Mock Cleared",
      eligibility: "Eligible (0 Backlogs)",
    },
    {
      id: "rec-4",
      candidateName: "Sneha Mukherjee",
      rollNo: "22ME032",
      department: "Mechanical & Robotics",
      cgpa: 8.9,
      skills: ["CAD/CAM", "MATLAB", "ROS2", "Robotics"],
      matchCompany: "Tesla India / Ather Energy",
      role: "Vehicle Architecture Engineer",
      matchScore: 91,
      readiness: "Review Pending",
      eligibility: "Eligible (0 Backlogs)",
    },
  ];

  const filtered = recommendations.filter(
    (r) =>
      r.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.matchCompany.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">AI Placement</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Autonomous Campus Matcher
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Automate student-recruiter job matching, batch eligibility criteria screening, and predictive placement offers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="px-3 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-ink cursor-pointer"
          >
            <option value="2026">Batch of 2026 (Final Year)</option>
            <option value="2027">Batch of 2027 (Pre-Final Year)</option>
          </select>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-brand text-primary-foreground text-xs font-bold shadow-glow hover:opacity-95 transition cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Run Match Engine</span>
          </button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <div className="flex items-center justify-between text-xs text-ink-soft mb-1">
            <span>Placed / Eligible</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black text-ink">486 / 620</p>
          <span className="text-[11px] text-emerald-500 font-semibold">78.4% Placement rate</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border">
          <div className="flex items-center justify-between text-xs text-ink-soft mb-1">
            <span>Highest Package</span>
            <TrendingUp className="w-4 h-4 text-primary-glow" />
          </div>
          <p className="text-2xl font-black text-primary-glow">₹54.2 LPA</p>
          <span className="text-[11px] text-ink-soft">Average: ₹12.8 LPA</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border">
          <div className="flex items-center justify-between text-xs text-ink-soft mb-1">
            <span>Visiting Recruiters</span>
            <Building2 className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black text-ink">142 Companies</p>
          <span className="text-[11px] text-emerald-500 font-semibold">+28 new MNCs</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border">
          <div className="flex items-center justify-between text-xs text-ink-soft mb-1">
            <span>AI Matches Generated</span>
            <Target className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black text-ink">1,890</p>
          <span className="text-[11px] text-primary-glow font-semibold">92% accuracy index</span>
        </div>
      </div>

      {/* Recommendations Feed */}
      <div className="rounded-2xl border border-border bg-surface p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-extrabold text-ink">High-Affinity AI Placement Matches</h2>
            <p className="text-xs text-ink-soft">Students ranked by recruiter JD benchmarks and technical acuity.</p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              type="text"
              placeholder="Search candidate, branch or company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-alt/60 border border-border text-xs text-ink placeholder:text-ink-soft focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-surface-alt/50 border border-border/80 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/40 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-ink">{item.candidateName}</h3>
                  <span className="text-[11px] font-mono text-ink-soft">({item.rollNo})</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    {item.cgpa} CGPA
                  </span>
                </div>
                <p className="text-xs text-ink-soft">{item.department}</p>
                <div className="flex items-center gap-1.5 flex-wrap pt-1">
                  {item.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="text-[10px] bg-surface border border-border px-2 py-0.5 rounded-md text-ink-soft font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface border border-border/70 text-xs min-w-[240px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-ink-soft text-[10px]">Matched Company:</span>
                  <span className="font-extrabold text-ink">{item.matchCompany}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-soft text-[10px]">Role:</span>
                  <span className="font-medium text-ink truncate max-w-[150px]">{item.role}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-border/60">
                  <span className="text-ink-soft text-[10px]">Compatibility:</span>
                  <span className="font-black text-primary-glow text-sm">{item.matchScore}% Match</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary-glow text-xs font-bold hover:bg-primary/20 transition cursor-pointer"
                >
                  Forward to Recruiter
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
