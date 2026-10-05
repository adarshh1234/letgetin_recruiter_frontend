"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Award, Building2, Plus, ShieldCheck, FileText, CheckCircle2, Users } from "lucide-react";

export default function InstitutionApprenticeshipsPage() {
  const schemes = [
    {
      id: "app-1",
      enterprise: "Bharat Electronics Limited (BEL)",
      scheme: "NATS (National Apprenticeship Training Scheme)",
      cadre: "Graduate Engineering Apprentice (GEA)",
      quota: 45,
      stipend: "₹18,500 / month (Govt subsidy linked)",
      duration: "1 Year Statutory Apprenticeship",
      status: "Active Portal Enrollment",
    },
    {
      id: "app-2",
      enterprise: "Larsen & Toubro Heavy Civil Infrastructure",
      scheme: "NAPS (Apprenticeship Promotion Scheme)",
      cadre: "Civil & Mechanical Engineering Trainee",
      quota: 60,
      stipend: "₹21,000 / month",
      duration: "1 Year On-Site Apprenticeship",
      status: "Contracts Dispatched",
    },
    {
      id: "app-3",
      enterprise: "Schneider Electric India",
      scheme: "Industry Apprentice Program",
      cadre: "Electrical & Industrial Automation",
      quota: 30,
      stipend: "₹24,000 / month",
      duration: "1 Year Apprenticeship",
      status: "Interview Phase",
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
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Apprenticeships Portal</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> NATS & NAPS Framework
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Oversee statutory graduate apprenticeships, stipend DBT subsidies, and Ministry of Education portal registrations.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-brand text-primary-foreground text-xs sm:text-sm font-bold shadow-glow hover:opacity-95 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Register Apprenticeship Contract</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Registered Apprentices</span>
          <p className="text-2xl font-black text-ink mt-1">135 Graduates</p>
          <span className="text-[11px] text-emerald-500 font-semibold">Enrolled on NATS/NAPS</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Govt Subsidy Disbursed</span>
          <p className="text-2xl font-black text-emerald-500 mt-1">₹14.2 Lakhs</p>
          <span className="text-[11px] text-ink-soft">Direct Benefit Transfer claims</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">PSU / Corporate Tie-ups</span>
          <p className="text-2xl font-black text-primary-glow mt-1">16 Enterprises</p>
          <span className="text-[11px] text-ink-soft">Core engineering & tech</span>
        </div>
      </div>

      {/* Apprenticeship Listings */}
      <div className="grid grid-cols-1 gap-4">
        {schemes.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl border border-border bg-surface hover:border-primary/40 transition-all shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-brand text-primary-foreground flex items-center justify-center font-bold text-sm shadow-glow shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-ink">{item.enterprise}</h3>
                  <span className="text-[11px] text-ink-soft">{item.scheme} &bull; {item.cadre}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full self-start sm:self-auto">
                {item.status}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-alt/60 border border-border/70 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-ink-soft text-[10px] block">Approved Quota</span>
                <span className="font-bold text-ink">{item.quota} Trainee Seats</span>
              </div>
              <div>
                <span className="text-ink-soft text-[10px] block">Monthly Stipend</span>
                <span className="font-bold text-emerald-500">{item.stipend}</span>
              </div>
              <div>
                <span className="text-ink-soft text-[10px] block">Period</span>
                <span className="font-medium text-ink">{item.duration}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary-glow text-xs font-bold hover:bg-primary/20 transition cursor-pointer"
              >
                View Trainee Roster
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
