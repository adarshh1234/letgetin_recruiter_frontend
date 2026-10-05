"use client";

import React, { useState } from "react";
import Link from "next/link";
import { UserCheck, Sparkles, Search, Filter, Download, CheckCircle2, Clock, XCircle, Building2 } from "lucide-react";

export default function InstitutionTrackApplicantPage() {
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState("all");

  const applicants = [
    {
      id: "app-1",
      name: "Rohan Verma",
      rollNo: "22CS104",
      department: "CSE",
      cgpa: 9.42,
      company: "Google India",
      role: "SDE-1",
      stage: "Selected",
      statusColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      appliedOn: "Oct 01, 2026",
    },
    {
      id: "app-2",
      name: "Ananya Deshmukh",
      rollNo: "22EC089",
      department: "ECE",
      cgpa: 9.15,
      company: "Texas Instruments",
      role: "VLSI Hardware Engineer",
      stage: "Technical Round 2",
      statusColor: "text-primary-glow bg-primary/10 border-primary/20",
      appliedOn: "Oct 04, 2026",
    },
    {
      id: "app-3",
      name: "Karthik Subramanian",
      rollNo: "22IT045",
      department: "IT",
      cgpa: 8.85,
      company: "Microsoft",
      role: "Cloud Engineer",
      stage: "Online Assessment",
      statusColor: "text-blue-500 bg-blue-500/10 border-blue-500/20",
      appliedOn: "Oct 08, 2026",
    },
    {
      id: "app-4",
      name: "Pooja Reddy",
      rollNo: "22CS077",
      department: "CSE",
      cgpa: 8.6,
      company: "Deloitte USI",
      role: "Technology Analyst",
      stage: "HR Round Scheduled",
      statusColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
      appliedOn: "Oct 02, 2026",
    },
    {
      id: "app-5",
      name: "Vikram Malhotra",
      rollNo: "22ME051",
      department: "Mechanical",
      cgpa: 8.1,
      company: "Tata Motors",
      role: "GET - Automotive",
      stage: "Selected",
      statusColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      appliedOn: "Sep 28, 2026",
    },
  ];

  const filtered = applicants.filter((a) => {
    const matchQuery =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      a.company.toLowerCase().includes(search.toLowerCase());
    const matchStage = filterStage === "all" || a.stage.toLowerCase().includes(filterStage.toLowerCase());
    return matchQuery && matchStage;
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Track Applicant</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Live Candidate Tracking
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Monitor real-time applicant progression across all active campus recruitment drives, tests, and interview rounds.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface border border-border text-ink hover:text-primary-glow text-xs sm:text-sm font-bold transition cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-primary-glow" />
          <span>Export All Tracking (CSV)</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            type="text"
            placeholder="Search by student, roll no or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface border border-border text-xs text-ink placeholder:text-ink-soft focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {["all", "selected", "technical", "assessment", "hr"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilterStage(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                filterStage === st
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-surface border border-border text-ink-soft hover:text-ink"
              }`}
            >
              {st === "all" ? "All Stages" : st.charAt(0).toUpperCase() + st.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Applicants List Table */}
      <div className="rounded-2xl border border-border bg-surface shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border/80 flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-ink">Active Student Applicants</h2>
          <span className="text-xs text-ink-soft">{filtered.length} matching</span>
        </div>

        <div className="divide-y divide-border/60">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-surface-alt/40 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-ink">{item.name}</span>
                  <span className="text-xs font-mono text-ink-soft">({item.rollNo})</span>
                  <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    {item.cgpa} CGPA
                  </span>
                </div>
                <p className="text-xs text-ink-soft">{item.department} &bull; Applied: {item.appliedOn}</p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right text-xs">
                  <span className="font-extrabold text-ink block">{item.company}</span>
                  <span className="text-[11px] text-ink-soft">{item.role}</span>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${item.statusColor}`}>
                  {item.stage}
                </span>

                <button
                  type="button"
                  className="px-3 py-1.5 rounded-xl bg-surface border border-border text-ink hover:text-primary-glow text-xs font-bold transition cursor-pointer"
                >
                  Dossier
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
