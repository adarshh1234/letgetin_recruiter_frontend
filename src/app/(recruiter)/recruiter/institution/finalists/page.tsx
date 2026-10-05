"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ClipboardCheck, Sparkles, Download, Search, CheckCircle2, Award, DollarSign, Building2, Eye } from "lucide-react";

export default function InstitutionFinalistsPage() {
  const [search, setSearch] = useState("");

  const finalists = [
    {
      id: "fin-1",
      name: "Rohan Verma",
      rollNo: "22CS104",
      department: "Computer Science & Engg",
      company: "Google India",
      role: "Software Development Engineer - I",
      ctc: "₹54.0 LPA",
      offerCategory: "Super Dream",
      dateOffered: "Oct 14, 2026",
      loiDoc: "LOI_GOOGLE_22CS104.pdf",
    },
    {
      id: "fin-2",
      name: "Ananya Deshmukh",
      rollNo: "22EC089",
      department: "Electronics & Communication",
      company: "Texas Instruments",
      role: "VLSI Hardware Engineer",
      ctc: "₹30.5 LPA",
      offerCategory: "Super Dream",
      dateOffered: "Oct 10, 2026",
      loiDoc: "LOI_TI_22EC089.pdf",
    },
    {
      id: "fin-3",
      name: "Vikram Malhotra",
      rollNo: "22ME051",
      department: "Mechanical Engineering",
      company: "Tata Motors Commercial",
      role: "Graduate Engineer Trainee (GET)",
      ctc: "₹12.5 LPA",
      offerCategory: "Dream",
      dateOffered: "Oct 04, 2026",
      loiDoc: "LOI_TATAMOTORS_22ME051.pdf",
    },
    {
      id: "fin-4",
      name: "Sneha Mukherjee",
      rollNo: "22IT032",
      department: "Information Technology",
      company: "Deloitte US-India",
      role: "Cyber Risk Advisory Analyst",
      ctc: "₹16.0 LPA",
      offerCategory: "Dream",
      dateOffered: "Sep 30, 2026",
      loiDoc: "LOI_DELOITTE_22IT032.pdf",
    },
  ];

  const filtered = finalists.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.rollNo.toLowerCase().includes(search.toLowerCase()) ||
      f.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Finalists & Offers</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Confirmed Placed Students
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Maintain confirmed campus job offers, official letters of intent (LOI), and accreditation placement records.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-brand text-primary-foreground text-xs sm:text-sm font-bold shadow-glow hover:opacity-95 transition cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export NAAC / NIRF Dossier</span>
        </button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Total Offers Rolled</span>
          <p className="text-2xl font-black text-emerald-500 mt-1">214 Placed</p>
          <span className="text-[11px] text-ink-soft">78% of registered cohort</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Super Dream Offers</span>
          <p className="text-2xl font-black text-primary-glow mt-1">42 CTC &gt; ₹25L</p>
          <span className="text-[11px] text-emerald-500 font-semibold">+14 vs last year</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Average Package</span>
          <p className="text-2xl font-black text-ink mt-1">₹14.2 LPA</p>
          <span className="text-[11px] text-ink-soft">Median: ₹11.5 LPA</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Highest CTC</span>
          <p className="text-2xl font-black text-primary-glow mt-1">₹54.0 LPA</p>
          <span className="text-[11px] text-ink-soft">Google India SDE-1</span>
        </div>
      </div>

      {/* Finalists Table */}
      <div className="rounded-2xl border border-border bg-surface shadow-xs overflow-hidden">
        <div className="p-4 border-b border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-sm font-extrabold text-ink">Official Placement Confirmation Ledger</h2>
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              type="text"
              placeholder="Search candidate, company or roll..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-alt/60 border border-border text-xs text-ink placeholder:text-ink-soft focus:outline-none focus:border-primary"
            />
          </div>
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
                  <span className="text-[10px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                    {item.offerCategory}
                  </span>
                </div>
                <p className="text-xs text-ink-soft">{item.department} &bull; Offered on: {item.dateOffered}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right text-xs">
                  <span className="font-extrabold text-ink block">{item.company}</span>
                  <span className="text-[11px] text-ink-soft">{item.role}</span>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black text-emerald-500 block">{item.ctc}</span>
                  <span className="text-[10px] text-ink-soft font-mono truncate max-w-[120px] block">{item.loiDoc}</span>
                </div>

                <button
                  type="button"
                  className="px-3 py-1.5 rounded-xl bg-surface border border-border text-ink hover:text-primary-glow text-xs font-bold transition cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View LOI</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
