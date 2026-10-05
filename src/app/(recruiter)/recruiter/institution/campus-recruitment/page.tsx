"use client";

import React from "react";
import Link from "next/link";
import { Building2, Sparkles, KanbanSquare, CalendarDays, Users, Award, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";

export default function InstitutionCampusRecruitmentPage() {
  const activeDrives = [
    {
      company: "Google India",
      role: "Software Development Engineer - I",
      stage: "Interviews Active",
      date: "Oct 12 - Oct 14, 2026",
      shortlisted: 42,
      applied: 380,
      hall: "Audi-1 & Tech Lab 4",
    },
    {
      company: "Microsoft",
      role: "Full Stack Cloud Engineer",
      stage: "Pre-Placement Talk (PPT)",
      date: "Oct 18, 2026",
      shortlisted: 120,
      applied: 410,
      hall: "Main Auditorium",
    },
    {
      company: "Texas Instruments",
      role: "Analog / VLSI Engineer",
      stage: "Online Assessment",
      date: "Oct 22, 2026",
      shortlisted: 65,
      applied: 240,
      hall: "Computer Labs A & B",
    },
    {
      company: "Goldman Sachs",
      role: "Quantitative Analyst",
      stage: "Offer Release",
      date: "Completed",
      shortlisted: 14,
      applied: 310,
      hall: "Executive Boardroom",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Campus Recruitment</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Season 2026-27
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Coordinate ongoing placement drives, company presentations, stage funnels, and auditorium slot allocations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/recruiter/institution/campus-recruitment/kanban"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface border border-border text-ink hover:text-primary-glow text-xs font-bold transition cursor-pointer"
          >
            <KanbanSquare className="w-4 h-4 text-primary-glow" />
            <span>Drive Kanban</span>
          </Link>
          <Link
            href="/recruiter/institution/campus-recruitment/calendar"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-brand text-primary-foreground text-xs font-bold shadow-glow hover:opacity-95 transition cursor-pointer"
          >
            <CalendarDays className="w-4 h-4" />
            <span>Schedule Calendar</span>
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Active Drives</span>
          <p className="text-2xl font-black text-ink mt-1">18 Companies</p>
          <span className="text-[11px] text-emerald-500 font-semibold">On campus this week</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Offers Released</span>
          <p className="text-2xl font-black text-emerald-500 mt-1">214 Letters</p>
          <span className="text-[11px] text-ink-soft">42 Dream offers</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Interviews Today</span>
          <p className="text-2xl font-black text-primary-glow mt-1">84 Slots</p>
          <span className="text-[11px] text-ink-soft">In 6 designated halls</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Batch Eligible</span>
          <p className="text-2xl font-black text-ink mt-1">540 / 620</p>
          <span className="text-[11px] text-emerald-500 font-semibold">87% Student clearance</span>
        </div>
      </div>

      {/* Active Campus Drives Table */}
      <div className="rounded-2xl border border-border bg-surface p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-ink">Scheduled & Ongoing Recruitment Drives</h2>
          <span className="text-xs text-ink-soft">{activeDrives.length} drives tracked</span>
        </div>

        <div className="space-y-3">
          {activeDrives.map((d, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-surface-alt/50 border border-border/80 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-primary/40 transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-ink">{d.company}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary/20 bg-primary/10 text-primary-glow">
                    {d.stage}
                  </span>
                </div>
                <p className="text-xs text-ink-soft">{d.role} &bull; <strong className="text-ink font-semibold">{d.hall}</strong></p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center text-xs">
                <div>
                  <span className="text-ink-soft block text-[10px]">Applied</span>
                  <span className="font-bold text-ink">{d.applied}</span>
                </div>
                <div>
                  <span className="text-ink-soft block text-[10px]">Shortlisted</span>
                  <span className="font-bold text-primary-glow">{d.shortlisted}</span>
                </div>
                <div className="hidden sm:block">
                  <span className="text-ink-soft block text-[10px]">Dates</span>
                  <span className="font-medium text-ink">{d.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center">
                <Link
                  href="/recruiter/institution/campus-recruitment/kanban"
                  className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary-glow text-xs font-bold hover:bg-primary/20 transition cursor-pointer"
                >
                  View Pipeline
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
