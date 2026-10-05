"use client";

import React, { useState } from "react";
import { Handshake, Sparkles, Building2, Plus, Search, ExternalLink, Calendar, CheckCircle2, ShieldCheck, Mail, Phone } from "lucide-react";

export default function InstitutionCompaniesOnboardPage() {
  const [search, setSearch] = useState("");

  const companies = [
    {
      id: "comp-1",
      name: "Microsoft India",
      tier: "Super Dream (₹35L - ₹52L)",
      mouStatus: "Active Partner (3-Year MOU)",
      driveDate: "October 14, 2026",
      openRoles: ["SDE-1", "Cloud Solutions Architect"],
      spocName: "Rajesh Kumar (Campus HR Lead)",
      spocEmail: "rajesh.k@microsoft.com",
      status: "Drive Slot Locked",
    },
    {
      id: "comp-2",
      name: "Deloitte US-India",
      tier: "Dream (₹14L - ₹20L)",
      mouStatus: "Active Partner",
      driveDate: "November 02, 2026",
      openRoles: ["Technology Analyst", "Cyber Risk Specialist"],
      spocName: "Neha Sharma (University Relations)",
      spocEmail: "nsharma@deloitte.com",
      status: "Shortlisting Active",
    },
    {
      id: "comp-3",
      name: "Qualcomm Wireless",
      tier: "Super Dream (₹28L - ₹40L)",
      mouStatus: "Active Partner",
      driveDate: "November 18, 2026",
      openRoles: ["Embedded Modem Engineer", "DSP Systems"],
      spocName: "Amitabh Sen (Engineering Recruiting)",
      spocEmail: "asen@qualcomm.com",
      status: "Invited",
    },
    {
      id: "comp-4",
      name: "Tata Consultancy Services (TCS Digital)",
      tier: "Core / Prime (₹7L - ₹11L)",
      mouStatus: "MOU Renewed",
      driveDate: "September 28, 2026",
      openRoles: ["Digital Innovator", "Systems Engineer"],
      spocName: "Sunita Nair (Regional TPO Lead)",
      spocEmail: "sunita.n@tcs.com",
      status: "Slot Confirmed",
    },
  ];

  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.tier.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Companys Onboard</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Corporate Relations & MOUs
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Manage corporate recruiters, campus recruitment MOUs, slot allocations, and company SPOC contacts.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-brand text-primary-foreground text-xs sm:text-sm font-bold shadow-glow hover:opacity-95 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Onboard New Recruiter</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Onboarded Corporate Partners</span>
          <p className="text-2xl font-black text-ink mt-1">128 Recruiter MOUs</p>
          <span className="text-[11px] text-emerald-500 font-semibold">Tier-1 & Fortune 500 Enterprises</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Upcoming Campus Drive Slots</span>
          <p className="text-2xl font-black text-primary-glow mt-1">34 Drives Locked</p>
          <span className="text-[11px] text-ink-soft">Season 2026-27 Autumn & Winter</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Average Super Dream Package</span>
          <p className="text-2xl font-black text-emerald-500 mt-1">₹38.5 LPA</p>
          <span className="text-[11px] text-ink-soft">Top 15 tech recruiters</span>
        </div>
      </div>

      {/* Search & Companies Feed */}
      <div className="rounded-2xl border border-border bg-surface p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-base font-extrabold text-ink">Active Corporate Recruiter Network</h2>
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              type="text"
              placeholder="Search partner company or tier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-surface-alt/60 border border-border text-xs text-ink placeholder:text-ink-soft focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((comp) => (
            <div
              key={comp.id}
              className="p-5 rounded-2xl border border-border bg-surface hover:border-primary/40 transition-all shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-brand text-primary-foreground flex items-center justify-center font-bold text-sm shadow-glow">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-ink">{comp.name}</h3>
                    <span className="text-[11px] font-bold text-primary-glow">{comp.tier}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  {comp.status}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-alt/60 border border-border/70 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-ink-soft">Drive Date:</span>
                  <span className="font-bold text-ink">{comp.driveDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">MOU Status:</span>
                  <span className="font-semibold text-emerald-500">{comp.mouStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-soft">SPOC Lead:</span>
                  <span className="text-ink">{comp.spocName}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 flex-wrap">
                {comp.openRoles.map((role, rIdx) => (
                  <span key={rIdx} className="text-[10px] bg-primary/10 border border-primary/20 text-primary-glow px-2 py-0.5 rounded-md font-semibold">
                    {role}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-border/60">
                <span className="text-[11px] text-ink-soft flex items-center gap-1">
                  <Mail className="w-3 h-3 text-primary-glow" /> {comp.spocEmail}
                </span>
                <button
                  type="button"
                  className="px-3 py-1.5 rounded-xl bg-surface border border-border text-ink hover:text-primary-glow text-xs font-bold transition cursor-pointer"
                >
                  Manage Drive
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
