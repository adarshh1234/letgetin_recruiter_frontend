"use client";

import React, { useState } from "react";
import { FileCheck, Sparkles, Upload, Download, Eye, FileText, CheckCircle2, Clock } from "lucide-react";

export default function StartupIncorporationDocumentsPage() {
  const [docs, setDocs] = useState([
    {
      id: "inc-1",
      title: "Certificate of Incorporation (CoI)",
      type: "PDF Document",
      size: "1.4 MB",
      issuedBy: "Ministry of Corporate Affairs (MCA)",
      uploadDate: "Feb 12, 2025",
      status: "Verified",
      cin: "U72900KA2025PTC123456",
    },
    {
      id: "inc-2",
      title: "Memorandum of Association (MoA)",
      type: "Signed Legal Charter",
      size: "2.8 MB",
      issuedBy: "MCA / SPICe+ e-MoA",
      uploadDate: "Feb 12, 2025",
      status: "Verified",
      cin: "Clause 3A Objectives",
    },
    {
      id: "inc-3",
      title: "Articles of Association (AoA)",
      type: "Internal Corporate Governance",
      size: "3.1 MB",
      issuedBy: "MCA / SPICe+ e-AoA",
      uploadDate: "Feb 12, 2025",
      status: "Verified",
      cin: "Table F Compliant",
    },
    {
      id: "inc-4",
      title: "Company PAN & TAN Allotment Letter",
      type: "Income Tax Department",
      size: "820 KB",
      issuedBy: "NSDL / Protean eGov",
      uploadDate: "Feb 14, 2025",
      status: "Verified",
      cin: "AAACO1234F",
    },
    {
      id: "inc-5",
      title: "First Board Resolution (Bank Account & Auditor)",
      type: "Corporate Resolution",
      size: "650 KB",
      issuedBy: "Founding Board of Directors",
      uploadDate: "Feb 20, 2025",
      status: "Verified",
      cin: "Res #01/2025",
    },
  ]);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Incorporation Documents</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Legal Vault
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Official charter papers, SPICe+ incorporation certificates, MoA, AoA, and founding board governance records.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-brand text-primary-foreground text-xs sm:text-sm font-bold shadow-glow hover:opacity-95 transition cursor-pointer self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Grid of Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map((doc) => (
          <div
            key={doc.id}
            className="p-5 rounded-2xl border border-border bg-surface hover:border-primary/40 transition-all shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-brand text-primary-foreground flex items-center justify-center font-bold text-sm shadow-glow">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-ink">{doc.title}</h3>
                  <span className="text-[11px] text-ink-soft">{doc.issuedBy}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> {doc.status}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-surface-alt/60 border border-border/70 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-ink-soft">Doc Identifier / Reference:</span>
                <span className="font-bold text-ink truncate max-w-[200px]">{doc.cin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">File Info:</span>
                <span className="text-ink">{doc.type} &bull; {doc.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink-soft">Uploaded:</span>
                <span className="text-ink-soft">{doc.uploadDate}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                className="text-xs font-bold text-primary-glow hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview Document</span>
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border text-ink hover:text-primary-glow text-xs font-bold transition cursor-pointer"
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
