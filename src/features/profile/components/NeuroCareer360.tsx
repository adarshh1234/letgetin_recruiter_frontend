"use client";

import React, { useState } from "react";
import {
  Fingerprint,
  Puzzle,
  Palette,
  Dna,
  Pencil,
  FileText,
  BarChart3,
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

// Static content for the Neuro Career 360 experience. Kept separate from the JSX below so it can
// be swapped for real API/report data later without touching the presentation.
export const neuroCareerData = {
  header: {
    title: "EduTalent · Neuro-Career OS",
    subtitle:
      "AI-powered DMIT neural mapping + 6 global gold-standard tests → hyper-personalised career & course roadmap",
  },
  dmit: {
    heading: "1. DMIT – Neural Fingerprint Mapping",
    weight: "5% weight",
    description: "Simulated neural network: select fingerprint type & ridge density → predicts 8 multiple intelligences.",
    fingerprintOptions: [
      { id: "loop", label: "Loop", description: "creative, linguistic" },
      { id: "whorl", label: "Whorl", description: "logical, analytical" },
      { id: "arch", label: "Arch", description: "practical, naturalistic" },
    ],
    defaultFingerprintId: "loop",
    ridgeDensity: { min: 1, max: 10, default: 5 },
    runButtonLabel: "Run DMIT Neural Net",
    resultLabel: "Default DMIT (Loop pattern, ridge 5):",
    resultStats: [
      { label: "Linguistic", value: 78 },
      { label: "Logical-Math", value: 48 },
      { label: "Spatial", value: 52 },
      { label: "Bodily-Kinesthetic", value: 52 },
      { label: "Musical", value: 61 },
      { label: "Interpersonal", value: 82 },
      { label: "Intrapersonal", value: 68 },
      { label: "Naturalistic", value: 43 },
    ],
  },
  ravens: {
    heading: "Raven's Progressive Matrices",
    weight: "20%",
    description: "Abstract reasoning (2 questions demo). Score /10 transformed to 0-100.",
    questions: [
      { id: "q1", label: "Q1: Which pattern completes the series?", hint: "*Correct = Pattern A" },
      { id: "q2", label: "Q2: Find missing piece:", hint: "*Correct = Pattern B" },
    ],
  },
  holland: {
    heading: "Holland Code (RIASEC) – Interests",
    weight: "15%",
    description: "Rate 6 items (1=dislike, 5=love)",
    items: [
      { id: "realistic", label: "Realistic (hands-on, building)" },
      { id: "investigative", label: "Investigative (science, research)" },
      { id: "artistic", label: "Artistic (creative, design)" },
      { id: "social", label: "Social (helping, teaching)" },
      { id: "enterprising", label: "Enterprising (leading, persuading)" },
      { id: "conventional", label: "Conventional (organizing, data)" },
    ],
  },
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs text-ink-soft">
      <span className="shrink-0">{label}:</span>
      <span className="font-bold text-ink">{value}%</span>
    </div>
  );
}

export function NeuroCareer360() {
  const [fingerprintId, setFingerprintId] = useState(neuroCareerData.dmit.defaultFingerprintId);
  const [ridgeDensity, setRidgeDensity] = useState(neuroCareerData.dmit.ridgeDensity.default);
  const [ravenAnswers, setRavenAnswers] = useState<Record<string, string>>({});
  const [hollandRatings, setHollandRatings] = useState<Record<string, number>>(
    Object.fromEntries(neuroCareerData.holland.items.map((item) => [item.id, 3]))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-brand text-white flex items-center justify-center shrink-0 shadow-glow">
            <Dna className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold text-ink">{neuroCareerData.header.title}</h2>
            <p className="text-xs text-ink-soft mt-1">{neuroCareerData.header.subtitle}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-border">
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-gradient-brand text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition-all cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Take Assessments</span>
          </button>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
            <FileText className="w-3.5 h-3.5 text-primary-glow" />
            <span>Product Plan &amp; Algorithm</span>
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft">
            <BarChart3 className="w-3.5 h-3.5 text-primary-glow" />
            <span>My Report</span>
          </span>
        </div>
      </div>

      {/* DMIT - Neural Fingerprint Mapping */}
      <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-primary-glow" />
            <h3 className="text-sm font-bold text-ink">{neuroCareerData.dmit.heading}</h3>
            <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5">
              {neuroCareerData.dmit.weight}
            </span>
          </div>
          <p className="text-xs text-ink-soft mt-1">{neuroCareerData.dmit.description}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {neuroCareerData.dmit.fingerprintOptions.map((opt) => {
            const isSelected = fingerprintId === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setFingerprintId(opt.id)}
                className={`px-4 py-3 rounded-xl border text-center transition cursor-pointer ${
                  isSelected
                    ? "bg-primary/10 border-primary-glow ring-2 ring-primary-glow/30"
                    : "bg-surface-alt/60 border-border hover:border-primary-glow/40"
                }`}
              >
                <div className="text-sm font-bold text-ink">{opt.label}</div>
                <div className="text-[11px] text-ink-soft mt-0.5">{opt.description}</div>
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-ink">
            Ridge Density ({neuroCareerData.dmit.ridgeDensity.min}=low → {neuroCareerData.dmit.ridgeDensity.max}=high) : {ridgeDensity}
          </label>
          <Slider
            min={neuroCareerData.dmit.ridgeDensity.min}
            max={neuroCareerData.dmit.ridgeDensity.max}
            step={1}
            value={[ridgeDensity]}
            onValueChange={(next) => {
              if (Array.isArray(next) && next.length > 0) setRidgeDensity(next[0]);
            }}
          />
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 bg-gradient-brand text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition-all cursor-pointer"
        >
          <Dna className="w-3.5 h-3.5" />
          <span>{neuroCareerData.dmit.runButtonLabel}</span>
        </button>

        <div className="bg-surface-alt/60 border border-border rounded-xl p-4 space-y-2">
          <p className="text-xs font-bold text-ink">🚀 {neuroCareerData.dmit.resultLabel}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
            {neuroCareerData.dmit.resultStats.map((stat) => (
              <ScoreBar key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>
        </div>
      </div>

      {/* Raven's Progressive Matrices + Holland Code */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <Puzzle className="w-4 h-4 text-primary-glow" />
              <h3 className="text-sm font-bold text-ink">{neuroCareerData.ravens.heading}</h3>
              <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5">
                {neuroCareerData.ravens.weight}
              </span>
            </div>
            <p className="text-xs text-ink-soft mt-1">{neuroCareerData.ravens.description}</p>
          </div>

          <div className="space-y-4">
            {neuroCareerData.ravens.questions.map((q) => (
              <div key={q.id} className="space-y-1.5">
                <label className="text-xs font-semibold text-ink">{q.label}</label>
                <select
                  value={ravenAnswers[q.id] || ""}
                  onChange={(e) => setRavenAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                  className="input-base text-xs py-2 px-3 bg-surface text-ink font-medium w-full"
                >
                  <option value="" disabled>
                    Select
                  </option>
                  <option value="a">Pattern A</option>
                  <option value="b">Pattern B</option>
                  <option value="c">Pattern C</option>
                  <option value="d">Pattern D</option>
                </select>
                <p className="text-[11px] text-emerald-600 font-semibold">{q.hint}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary-glow" />
              <h3 className="text-sm font-bold text-ink">{neuroCareerData.holland.heading}</h3>
              <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 rounded-full px-2 py-0.5">
                {neuroCareerData.holland.weight}
              </span>
            </div>
            <p className="text-xs text-ink-soft mt-1">{neuroCareerData.holland.description}</p>
          </div>

          <div className="space-y-4">
            {neuroCareerData.holland.items.map((item) => (
              <div key={item.id} className="space-y-1.5">
                <label className="text-xs font-semibold text-ink">{item.label}:</label>
                <Slider
                  min={1}
                  max={5}
                  step={1}
                  value={[hollandRatings[item.id]]}
                  onValueChange={(next) => {
                    if (Array.isArray(next) && next.length > 0) {
                      setHollandRatings((prev) => ({ ...prev, [item.id]: next[0] }));
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NeuroCareer360;
