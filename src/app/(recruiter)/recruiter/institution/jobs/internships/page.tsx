"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, GraduationCap, Building2, Plus, FileCheck, CheckCircle2, Clock, Users } from "lucide-react";

export default function InstitutionInternshipsPage() {
  const internships = [
    {
      id: "int-1",
      company: "Google Summer of Code / Google India",
      role: "Software Engineering Intern",
      duration: "6 Months (Jan - June 2027)",
      stipend: "₹1,25,000 / month",
      ppoOffered: "PPO Eligible (85% Historical)",
      department: "Computer Science & Engg",
      enrolledStudents: 14,
      nocStatus: "Approved & Issued",
    },
    {
      id: "int-2",
      company: "Morgan Stanley Technology",
      role: "Summer Technology Analyst",
      duration: "2 Months (May - July 2026)",
      stipend: "₹85,000 / month",
      ppoOffered: "Fast-track FTE Conversion",
      department: "CSE, IT & Math/Computing",
      enrolledStudents: 22,
      nocStatus: "Approved & Issued",
    },
    {
      id: "int-3",
      company: "Texas Instruments Embedded Lab",
      role: "VLSI Design & Hardware Intern",
      duration: "6 Months",
      stipend: "₹65,000 / month",
      ppoOffered: "PPO Subject to Defense",
      department: "Electronics & Communication",
      enrolledStudents: 12,
      nocStatus: "Under Faculty Review",
    },
    {
      id: "int-4",
      company: "Swiggy Core Logistics",
      role: "Data Science & ML Intern",
      duration: "3 Months",
      stipend: "₹50,000 / month",
      ppoOffered: "Top 20% Conversion",
      department: "All Engineering Branches",
      enrolledStudents: 18,
      nocStatus: "Approved & Issued",
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
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Internships & PPO Portal</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Semester & Summer Interns
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Track student industrial internships, monthly stipend disbursements, College NOC approvals, and PPO conversions.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-brand text-primary-foreground text-xs sm:text-sm font-bold shadow-glow hover:opacity-95 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Internship Drive</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Students in Active Internships</span>
          <p className="text-2xl font-black text-ink mt-1">186 Interns</p>
          <span className="text-[11px] text-emerald-500 font-semibold">Across 42 partner companies</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">PPO Conversions to Date</span>
          <p className="text-2xl font-black text-emerald-500 mt-1">74 Pre-Placement Offers</p>
          <span className="text-[11px] text-ink-soft">Full-time employment secured</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Average Monthly Stipend</span>
          <p className="text-2xl font-black text-primary-glow mt-1">₹68,500 / mo</p>
          <span className="text-[11px] text-ink-soft">Highest: ₹1.5L / mo</span>
        </div>
      </div>

      {/* Internships List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {internships.map((item) => (
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
                  <h3 className="text-sm font-extrabold text-ink">{item.company}</h3>
                  <span className="text-[11px] text-ink-soft">{item.role}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                {item.nocStatus}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-alt/60 border border-border/70 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-ink-soft">Stipend:</span>
                <span className="font-extrabold text-primary-glow">{item.stipend}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Duration:</span>
                <span className="font-semibold text-ink">{item.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">PPO Potential:</span>
                <span className="text-emerald-500 font-medium">{item.ppoOffered}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Enrolled Interns:</span>
                <span className="font-bold text-ink">{item.enrolledStudents} Students</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-ink-soft">{item.department}</span>
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary-glow text-xs font-bold hover:bg-primary/20 transition cursor-pointer"
              >
                Manage NOCs
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
