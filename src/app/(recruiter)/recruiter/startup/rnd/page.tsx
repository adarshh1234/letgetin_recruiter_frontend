"use client";

import React, { useState } from "react";
import { FlaskConical, Sparkles, Cpu, GitBranch, ShieldCheck, Plus, CheckCircle2, Clock } from "lucide-react";

export default function StartupRnDPage() {
  const experiments = [
    {
      id: "rnd-1",
      title: "Multimodal Agentic Reasoning Framework",
      stage: "Benchmarking",
      techStack: "PyTorch & Gemini 2.5 Flash",
      lead: "AI Core Research Team",
      progress: "84%",
      patentStatus: "Provisional Patent Filed",
      impact: "Reduces inference latency by 42% while improving reasoning accuracy.",
    },
    {
      id: "rnd-2",
      title: "Zero-Knowledge Proof Verification for Candidate Creds",
      stage: "Prototype Testing",
      techStack: "Rust & Circom Circuits",
      lead: "Cryptography & Security Guild",
      progress: "65%",
      patentStatus: "Prior Art Search Complete",
      impact: "Enables instant background verification without exposing sensitive student PII.",
    },
    {
      id: "rnd-3",
      title: "Low-Latency Edge Model Quantization (4-bit)",
      stage: "Active Sprint",
      techStack: "ONNX & WebAssembly (WASM)",
      lead: "Platform & Infra Guild",
      progress: "92%",
      patentStatus: "Trade Secret Protected",
      impact: "Runs client-side semantic matching in the browser with 0ms server roundtrips.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">R&D</h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3" /> Frontier Tech & IP Lab
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Track prototype engineering sprints, AI model fine-tuning benchmarks, and provisional patent disclosures.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-brand text-primary-foreground text-xs sm:text-sm font-bold shadow-glow hover:opacity-95 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Experiment</span>
        </button>
      </div>

      {/* R&D Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Patents & IP Disclosures</span>
          <div className="flex items-center gap-2 mt-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <p className="text-2xl font-black text-ink">3 Provisional</p>
          </div>
          <span className="text-[11px] text-emerald-400 font-semibold">Fast-track examination under DPIIT</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Active R&D Pipelines</span>
          <p className="text-2xl font-black text-primary-glow mt-1">6 Projects</p>
          <span className="text-[11px] text-ink-soft">Core algorithms & edge inference</span>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border">
          <span className="text-xs text-ink-soft">Compute Budget Allocated</span>
          <p className="text-2xl font-black text-ink mt-1">$45k Cloud</p>
          <span className="text-[11px] text-emerald-400 font-semibold">Funded via non-dilutive grants</span>
        </div>
      </div>

      {/* Projects */}
      <div className="grid grid-cols-1 gap-4">
        {experiments.map((exp) => (
          <div
            key={exp.id}
            className="p-5 rounded-2xl border border-border bg-surface hover:border-primary/40 transition-all shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-brand text-primary-foreground flex items-center justify-center font-bold text-sm shadow-glow shrink-0">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-ink">{exp.title}</h3>
                  <span className="text-[11px] text-ink-soft">{exp.lead} &bull; {exp.techStack}</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full self-start sm:self-auto">
                {exp.stage}
              </span>
            </div>

            <p className="text-xs text-ink-soft">{exp.impact}</p>

            <div className="p-3 rounded-xl bg-surface-alt/60 border border-border/70 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-ink-soft">IP Status:</span>
                <span className="font-bold text-emerald-400">{exp.patentStatus}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-ink-soft">Milestone Completion:</span>
                <div className="w-32 bg-border h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: exp.progress }} />
                </div>
                <span className="font-bold text-ink text-[11px]">{exp.progress}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl bg-surface border border-border text-ink hover:text-primary-glow text-xs font-bold transition cursor-pointer"
              >
                View Benchmark Logs
              </button>
              <button
                type="button"
                className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary-glow text-xs font-bold hover:bg-primary/20 transition cursor-pointer"
              >
                Sprint Roadmap
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
