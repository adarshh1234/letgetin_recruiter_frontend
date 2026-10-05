"use client";

import React, { useState } from "react";
import Link from "next/link";
import { KanbanSquare, CalendarDays, Building2, Users, DollarSign, Clock, CheckCircle2, ChevronRight, ArrowLeft } from "lucide-react";

interface DriveCard {
  id: string;
  company: string;
  role: string;
  ctc: string;
  date: string;
  shortlistedCount: number;
}

export default function CampusRecruitmentKanbanPage() {
  const [columns, setColumns] = useState<Record<string, DriveCard[]>>({
    invited: [
      { id: "d-1", company: "Cisco Systems", role: "Network Software Engineer", ctc: "₹24 LPA", date: "Nov 24", shortlistedCount: 180 },
      { id: "d-2", company: "Adobe India", role: "Product Developer", ctc: "₹38 LPA", date: "Nov 28", shortlistedCount: 120 },
    ],
    ppt: [
      { id: "d-3", company: "Microsoft", role: "Software Engineer - SDE", ctc: "₹48 LPA", date: "Oct 18", shortlistedCount: 290 },
      { id: "d-4", company: "Morgan Stanley", role: "Tech Analyst", ctc: "₹28 LPA", date: "Oct 20", shortlistedCount: 140 },
    ],
    assessment: [
      { id: "d-5", company: "Texas Instruments", role: "Embedded Systems", ctc: "₹30 LPA", date: "Oct 22", shortlistedCount: 85 },
      { id: "d-6", company: "Amazon AWS", role: "Cloud Support Associate", ctc: "₹22 LPA", date: "Oct 25", shortlistedCount: 160 },
    ],
    interview: [
      { id: "d-7", company: "Google India", role: "SWE - I", ctc: "₹54 LPA", date: "Oct 14", shortlistedCount: 32 },
      { id: "d-8", company: "Flipkart", role: "UI/UX Engineer", ctc: "₹26 LPA", date: "Oct 16", shortlistedCount: 24 },
    ],
    offered: [
      { id: "d-9", company: "Goldman Sachs", role: "Quantitative Analyst", ctc: "₹36 LPA", date: "Oct 08", shortlistedCount: 14 },
      { id: "d-10", company: "Deloitte", role: "Risk Analyst", ctc: "₹15 LPA", date: "Oct 05", shortlistedCount: 48 },
    ],
  });

  const columnHeaders = [
    { key: "invited", label: "Invited & Requested", count: columns.invited.length, color: "text-amber-500 bg-amber-500/10" },
    { key: "ppt", label: "PPT Scheduled", count: columns.ppt.length, color: "text-blue-500 bg-blue-500/10" },
    { key: "assessment", label: "Online Assessment", count: columns.assessment.length, color: "text-indigo-500 bg-indigo-500/10" },
    { key: "interview", label: "Interviews Active", count: columns.interview.length, color: "text-primary-glow bg-primary/10" },
    { key: "offered", label: "Offer Released", count: columns.offered.length, color: "text-emerald-500 bg-emerald-500/10" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/recruiter/institution/campus-recruitment"
              className="p-1.5 rounded-xl border border-border bg-surface text-ink-soft hover:text-ink hover:bg-surface-alt transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Campus Recruitment Kanban</h1>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Visual stage-by-stage pipeline for visiting campus recruitment partners and placement drives.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/recruiter/institution/campus-recruitment/calendar"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface border border-border text-ink hover:text-primary-glow text-xs font-bold transition"
          >
            <CalendarDays className="w-4 h-4 text-primary-glow" />
            <span>Switch to Calendar</span>
          </Link>
        </div>
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {columnHeaders.map((col) => (
          <div key={col.key} className="p-3.5 rounded-2xl bg-surface border border-border space-y-3 min-w-[220px]">
            <div className="flex items-center justify-between pb-2 border-b border-border/70">
              <span className="text-xs font-bold text-ink truncate">{col.label}</span>
              <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${col.color}`}>
                {col.count}
              </span>
            </div>

            <div className="space-y-2.5">
              {columns[col.key].map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-surface-alt/60 border border-border hover:border-primary/40 transition shadow-2xs space-y-2 cursor-grab active:cursor-grabbing"
                >
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs font-bold text-ink leading-snug">{item.company}</h4>
                    <span className="text-[10px] font-black text-primary-glow shrink-0">{item.ctc}</span>
                  </div>

                  <p className="text-[11px] text-ink-soft truncate">{item.role}</p>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-ink-soft border-t border-border/60">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-primary-glow" />
                      <span>{item.shortlistedCount} Candidates</span>
                    </span>
                    <span className="font-semibold text-ink">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
