"use client";

import React, { useState } from "react";
import { Folder, Sparkles, Upload, Download, Eye, FileText, Lock, ShieldCheck } from "lucide-react";

export default function StartupOtherDocumentsPage() {
  const [category, setCategory] = useState("all");

  const documents = [
    {
      id: "doc-1",
      title: "Cap Table & Equity Ownership Ledger",
      category: "Equity",
      type: "Excel / PDF",
      size: "2.1 MB",
      restricted: true,
      lastUpdated: "Yesterday",
      description: "Fully diluted cap table, founder vesting schedules, options pool, and SAFE conversions.",
    },
    {
      id: "doc-2",
      title: "Employee Stock Option Plan (ESOP) 2025 Scheme",
      category: "HR & Legal",
      type: "Legal Document",
      size: "1.8 MB",
      restricted: false,
      lastUpdated: "3 weeks ago",
      description: "Board-approved 10% ESOP pool rules, 1-year cliff, and 4-year linear vesting framework.",
    },
    {
      id: "doc-3",
      title: "Standard YC Post-Money SAFE Agreement Template",
      category: "Financing",
      type: "SAFE Agreement",
      size: "450 KB",
      restricted: true,
      lastUpdated: "1 month ago",
      description: "Valuation cap $8M SAFE contract for incoming pre-seed syndicate angels.",
    },
    {
      id: "doc-4",
      title: "Proprietary IP Assignment & Founder NDA",
      category: "Legal",
      type: "Signed Agreement",
      size: "980 KB",
      restricted: false,
      lastUpdated: "Feb 2025",
      description: "All intellectual property, codebase, and patents assigned unconditionally to the company.",
    },
    {
      id: "doc-5",
      title: "Audited Financial Statements FY24-25",
      category: "Finance",
      type: "Audit Report",
      size: "3.4 MB",
      restricted: true,
      lastUpdated: "May 2025",
      description: "Statutory chartered accountant balance sheet, P&L statement, and auditor notes.",
    },
  ];

  const filteredDocs =
    category === "all" ? documents : documents.filter((d) => d.category.toLowerCase() === category.toLowerCase());

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Other Documents</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Data Room Vault
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Maintain Cap Tables, SAFE agreements, ESOP grant schemes, audited balance sheets, and IP covenants.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-brand text-primary-foreground text-xs sm:text-sm font-bold shadow-glow hover:opacity-95 transition cursor-pointer self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Add to Data Room</span>
        </button>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["all", "Equity", "Financing", "HR & Legal", "Finance"].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
              category === cat
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-surface border border-border text-ink-soft hover:text-ink"
            }`}
          >
            {cat === "all" ? "All Documents" : cat}
          </button>
        ))}
      </div>

      {/* Docs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl border border-border bg-surface hover:border-primary/40 transition-all shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-brand text-primary-foreground flex items-center justify-center font-bold text-sm shadow-glow">
                  <Folder className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-ink">{doc.title}</h3>
                  <span className="text-[11px] text-ink-soft">{doc.category} &bull; {doc.size}</span>
                </div>
              </div>
              {doc.restricted && (
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Confidential
                </span>
              )}
            </div>

            <p className="text-xs text-ink-soft line-clamp-2">{doc.description}</p>

            <div className="p-3 rounded-xl bg-surface-alt/60 border border-border/70 text-xs flex items-center justify-between">
              <span className="text-ink-soft">Last Updated:</span>
              <span className="font-semibold text-ink">{doc.lastUpdated}</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                className="text-xs font-bold text-primary-glow hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View File</span>
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface border border-border text-ink hover:text-primary-glow text-xs font-bold transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
