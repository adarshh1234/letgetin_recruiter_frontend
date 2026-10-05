"use client";

import React, { useState } from "react";
import { Landmark, Sparkles, ExternalLink, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

export default function StartupGovtSchemesPage() {
  const schemes = [
    {
      title: "Startup India Seed Fund Scheme (SISFS)",
      agency: "DPIIT & Ministry of Commerce & Industry",
      benefit: "Up to ₹50 Lakhs (Grants & Convertible Debentures)",
      eligibility: "DPIIT Recognized, incorporated < 2 years, prototype ready",
      status: "Application Ready",
      purpose: "Proof of Concept, prototype development, product trials, and commercialization.",
      link: "https://seedfund.startupindia.gov.in/",
    },
    {
      title: "Section 80-IAC Tax Exemption",
      agency: "Inter-Ministerial Board (IMB)",
      benefit: "100% Tax Holiday for 3 consecutive financial years",
      eligibility: "Private Limited/LLP incorporated between 2016-2025, turnover < ₹100 Cr",
      status: "In Progress",
      purpose: "Full corporate income tax relief to reinvest profits into R&D and hiring.",
      link: "https://www.startupindia.gov.in/",
    },
    {
      title: "MeitY TIDE 2.0 Tech Incubator Scheme",
      agency: "Ministry of Electronics & Information Technology",
      benefit: "Grant-in-aid up to ₹7 Lakhs / EIR ₹30k/mo",
      eligibility: "Startups working in IoT, AI, Blockchain, Cybersecurity",
      status: "Partner Center Shortlisted",
      purpose: "Support tech entrepreneurs working on national digital transformation solutions.",
      link: "https://meitystartuphub.in/",
    },
    {
      title: "Patent & Trademark Fast-Track Rebate",
      agency: "Controller General of Patents, Designs and Trade Marks (CGPDTM)",
      benefit: "80% rebate on patent fees & 50% on trademark fees",
      eligibility: "All DPIIT registered startups",
      status: "Claimed & Approved",
      purpose: "Drastically lowered official IP filing costs with fast-tracked examination.",
      link: "https://ipindia.gov.in/",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Govt Schemes</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Startup India & Sovereign Subsidies
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Access central & state government incubation grants, DPIIT seed funding, tax exemptions, and fast-track IPR rebates.
          </p>
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">DPIIT Recognition</span>
          <div className="flex items-center gap-2 mt-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <p className="text-lg font-black text-ink">Verified Entity</p>
          </div>
          <span className="text-[11px] text-ink-soft">Eligible for all central startup schemes</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Disbursed Subsidies</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">₹4.2 Lakhs</p>
          <span className="text-[11px] text-ink-soft">Patent fee rebates & prototype subsidies</span>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Under Review / Pipeline</span>
          <p className="text-2xl font-black text-primary-glow mt-1">₹50 Lakhs</p>
          <span className="text-[11px] text-ink-soft">SISFS Seed Round with partner incubator</span>
        </div>
      </div>

      {/* Schemes list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schemes.map((scheme, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-border bg-surface hover:border-primary/40 transition-all shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-brand text-primary-foreground flex items-center justify-center font-bold text-sm shadow-glow">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-ink">{scheme.title}</h3>
                  <span className="text-[11px] text-ink-soft">{scheme.agency}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                {scheme.status}
              </span>
            </div>

            <p className="text-xs text-ink-soft line-clamp-2">{scheme.purpose}</p>

            <div className="p-3 rounded-xl bg-surface-alt/60 border border-border/70 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-ink-soft">Financial Aid:</span>
                <span className="font-bold text-ink">{scheme.benefit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Eligibility:</span>
                <span className="font-medium text-ink truncate max-w-[220px]">{scheme.eligibility}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <a
                href={scheme.link}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-primary-glow hover:underline inline-flex items-center gap-1"
              >
                <span>Official Scheme Portal</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary-glow text-xs font-bold hover:bg-primary/20 transition cursor-pointer"
              >
                Apply via Incubator
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
