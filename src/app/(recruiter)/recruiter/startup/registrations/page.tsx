"use client";

import React, { useState } from "react";
import { ShieldCheck, Sparkles, Upload, Download, ExternalLink, Calendar, CheckCircle2 } from "lucide-react";

export default function StartupRegistrationsPage() {
  const registrations = [
    {
      name: "DPIIT Startup India Recognition",
      regNumber: "DIPP129845",
      authority: "Department for Promotion of Industry and Internal Trade",
      validity: "Active (Valid for 10 Years)",
      issuedOn: "March 04, 2025",
      benefits: "Income tax exemption 80-IAC eligible, SISFS seed grants, 80% IPR rebate",
      status: "Active & Certified",
    },
    {
      name: "Goods & Services Tax (GST)",
      regNumber: "29AAAAA0000A1Z5",
      authority: "Goods & Services Tax Network (GSTN)",
      validity: "Perpetual Regular Taxpayer",
      issuedOn: "February 18, 2025",
      benefits: "Interstate invoicing, input tax credit claims, automated e-invoicing",
      status: "Active",
    },
    {
      name: "Udyam MSME Registration",
      regNumber: "UDYAM-KR-03-0098712",
      authority: "Ministry of Micro, Small and Medium Enterprises",
      validity: "Micro Enterprise (Lifetime)",
      issuedOn: "February 25, 2025",
      benefits: "Collateral-free bank credit (CGTMSE), priority government procurement",
      status: "Active",
    },
    {
      name: "Trademark Application (Brand & Logo)",
      regNumber: "TM App #5892104 (Class 42 & 9)",
      authority: "Trade Marks Registry of India",
      validity: "Examination Completed - Journal Published",
      issuedOn: "April 10, 2025",
      benefits: "Exclusive nationwide brand protection, IP asset valuation",
      status: "In Process",
    },
    {
      name: "Karnataka Shops & Commercial Establishments",
      regNumber: "K-EST-BLR-89210",
      authority: "Department of Labour",
      validity: "Renewed through Dec 2026",
      issuedOn: "March 01, 2025",
      benefits: "Statutory employee workplace compliance, flexible working hours",
      status: "Active",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Registrations</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Compliance & Licenses
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Maintain statutory startup licenses, DPIIT certificates, Udyam MSME badges, and trademark registry status.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-brand text-primary-foreground text-xs sm:text-sm font-bold shadow-glow hover:opacity-95 transition cursor-pointer self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Add Registration</span>
        </button>
      </div>

      {/* Registrations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {registrations.map((reg, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-border bg-surface hover:border-primary/40 transition-all shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-brand text-primary-foreground flex items-center justify-center font-bold text-sm shadow-glow">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-ink">{reg.name}</h3>
                  <span className="text-[11px] text-ink-soft">{reg.authority}</span>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  reg.status.includes("Active")
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                }`}
              >
                {reg.status}
              </span>
            </div>

            <p className="text-xs text-ink-soft line-clamp-2">{reg.benefits}</p>

            <div className="p-3 rounded-xl bg-surface-alt/60 border border-border/70 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-ink-soft">Reg / Certificate ID:</span>
                <span className="font-bold text-ink">{reg.regNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Validity:</span>
                <span className="font-semibold text-emerald-400">{reg.validity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Issued On:</span>
                <span className="text-ink">{reg.issuedOn}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                className="text-xs font-bold text-primary-glow hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View Certificate</span>
                <ExternalLink className="w-3 h-3" />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface border border-border text-ink hover:text-primary-glow text-xs font-bold transition cursor-pointer"
              >
                <Download className="w-3 h-3" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
