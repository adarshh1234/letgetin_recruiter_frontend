"use client";

import React from "react";
import { Building, MapPin, Sparkles, CheckCircle2, ShieldCheck, Laptop, Users } from "lucide-react";

export default function StartupIncubatorPage() {
  const incubators = [
    {
      name: "T-Hub Innovation Centre",
      city: "Hyderabad, India",
      type: "State-backed Deeptech Hub",
      facilities: ["AI & IoT Hardware Prototyping Lab", "AWS & GCP Cloud Credits ($100k)", "Legal & Patent Retainers"],
      activeCohort: "Batch 14",
    },
    {
      name: "C-CAMP (Centre for Cellular and Molecular Platforms)",
      city: "Bangalore, India",
      type: "BioTech & HealthTech Incubator",
      facilities: ["Wet lab & spectrometry suites", "BIRAC seed grant facilitation", "Regulatory clinical validation"],
      activeCohort: "Cohort 2026",
    },
    {
      name: "IIT Madras Research Park (Incubation Cell)",
      city: "Chennai, India",
      type: "Academic & Deep Science Ecosystem",
      facilities: ["Faculty joint research fellows", "Advanced manufacturing sandboxes", "Govt seed fund allocation"],
      activeCohort: "Active",
    },
    {
      name: "NSRCEL (IIM Bangalore)",
      city: "Bangalore, India",
      type: "Business Model & Venture Scaler",
      facilities: ["Go-to-market advisory", "Angel syndicate demo sessions", "Corporate pilot partnerships"],
      activeCohort: "Venture Launchpad",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-6 max-w-6xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Incubator Hub</h1>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
            <Sparkles className="w-3 h-3" /> Facilities & Labs
          </span>
        </div>
        <p className="text-xs sm:text-sm text-ink-soft mt-1">
          Access specialized lab infrastructure, academic joint-programs, physical co-working hubs, and ecosystem grants.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {incubators.map((inc, i) => (
          <div key={i} className="p-5 rounded-2xl border border-border bg-surface shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary-glow flex items-center justify-center">
                  <Building className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-ink">{inc.name}</h3>
                  <div className="flex items-center gap-1 text-[11px] text-ink-soft">
                    <MapPin className="w-3 h-3" />
                    <span>{inc.city}</span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {inc.activeCohort}
              </span>
            </div>

            <p className="text-xs text-ink-soft font-semibold">{inc.type}</p>

            <div className="space-y-1.5 pt-1">
              {inc.facilities.map((fac, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-ink">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{fac}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-border/70 flex justify-end">
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary-glow text-xs font-bold transition cursor-pointer"
              >
                Request Lab Access / Intro
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
