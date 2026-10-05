"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, KanbanSquare, Users, DollarSign, Plus, Briefcase } from "lucide-react";

interface CampusJobItem {
  id: string;
  title: string;
  company: string;
  packageText: string;
  applicants: number;
  deadline: string;
}

export default function InstitutionJobsKanbanPage() {
  const [stages, setStages] = useState<Record<string, CampusJobItem[]>>({
    draft: [
      { id: "j-1", title: "Cloud Platform Associate", company: "Oracle India", packageText: "₹16 LPA", applicants: 0, deadline: "Nov 30" },
    ],
    open: [
      { id: "j-2", title: "Software Engineer SDE-1", company: "Google India", packageText: "₹54 LPA", applicants: 420, deadline: "Oct 15" },
      { id: "j-3", title: "Graduate Trainee Engineer", company: "Larsen & Toubro", packageText: "₹8.5 LPA", applicants: 290, deadline: "Oct 20" },
    ],
    screening: [
      { id: "j-4", title: "Technology Analyst", company: "Deloitte USI", packageText: "₹14 LPA", applicants: 310, deadline: "Oct 10" },
      { id: "j-5", title: "Embedded Firmware Dev", company: "Texas Instruments", packageText: "₹28 LPA", applicants: 180, deadline: "Oct 12" },
    ],
    interview: [
      { id: "j-6", title: "Quantitative Trading Analyst", company: "Goldman Sachs", packageText: "₹36 LPA", applicants: 45, deadline: "Active" },
    ],
    closed: [
      { id: "j-7", title: "Product Consultant", company: "PwC India", packageText: "₹12 LPA", applicants: 190, deadline: "Finished" },
    ],
  });

  const columns = [
    { key: "draft", title: "Draft / Approvals", color: "text-ink-soft bg-surface-alt" },
    { key: "open", title: "Open for Applications", color: "text-blue-500 bg-blue-500/10" },
    { key: "screening", title: "Screening & Assessments", color: "text-amber-500 bg-amber-500/10" },
    { key: "interview", title: "Interviews Active", color: "text-primary-glow bg-primary/10" },
    { key: "closed", title: "Drive Closed & Offers", color: "text-emerald-500 bg-emerald-500/10" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-6 max-w-7xl mx-auto">
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
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Jobs Kanban</h1>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Visual recruitment pipeline organizing active campus postings from draft to final offer distribution.
          </p>
        </div>

        <Link
          href="/recruiter/institution/jobs/create"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-brand text-primary-foreground text-xs font-bold shadow-glow hover:opacity-95 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Campus Job</span>
        </Link>
      </div>

      {/* Board */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <div key={col.key} className="p-3.5 rounded-2xl bg-surface border border-border space-y-3 min-w-[220px]">
            <div className="flex items-center justify-between pb-2 border-b border-border/70">
              <span className="text-xs font-bold text-ink truncate">{col.title}</span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${col.color}`}>
                {stages[col.key].length}
              </span>
            </div>

            <div className="space-y-2.5">
              {stages[col.key].map((job) => (
                <div
                  key={job.id}
                  className="p-3.5 rounded-xl bg-surface-alt/60 border border-border hover:border-primary/40 transition shadow-2xs space-y-2 cursor-grab"
                >
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs font-bold text-ink leading-snug">{job.title}</h4>
                    <span className="text-[10px] font-black text-primary-glow shrink-0">{job.packageText}</span>
                  </div>

                  <p className="text-[11px] font-semibold text-ink-soft truncate">{job.company}</p>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-ink-soft border-t border-border/60">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-primary-glow" />
                      <span>{job.applicants} Applied</span>
                    </span>
                    <span className="font-medium text-ink">{job.deadline}</span>
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
