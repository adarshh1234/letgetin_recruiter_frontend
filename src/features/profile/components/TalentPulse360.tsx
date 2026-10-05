"use client";

import React from "react";
import { Sparkles, AlertTriangle, Zap, BarChart3, CheckCircle2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

// Static content for the Talent Pulse 360 scorecard. Kept separate from the JSX below so it can be
// swapped for real API data later without touching the presentation. The same `verticals` array
// drives the bottom detail cards AND both chart cards - single source of truth, no duplicated numbers.
export const talentPulseData = {
  header: {
    title: "TalentPulse 360",
    subtitle: "AI-augmented candidate intelligence | multi-dimensional scorecard",
  },
  overallScore: 66.5,
  overallScoreMax: 100,
  actionRequired: {
    message: "3 missed verticals below benchmark (65 pts) — test needed to unlock full score",
    ctaLabel: "Perform all missed tests",
  },
  verticals: [
    {
      id: "educationalFoundations",
      label: "Educational Foundations & Academic Pedigree",
      score: 56.3,
      isMissed: true,
      metrics: [
        { label: "Core Qualification", value: 70 },
        { label: "Institution Tier/Reputation", value: 50 },
        { label: "GPA/Academic Consistency", value: 45 },
        { label: "Specializations", value: 60 },
      ],
    },
    {
      id: "verifiedSkillSets",
      label: "Verified Skill Sets (Hard Assets)",
      score: 80,
      isMissed: false,
      metrics: [
        { label: "Technical Proficiency", value: 80 },
        { label: "Certifications", value: 75 },
        { label: "Domain Expertise", value: 85 },
      ],
    },
    {
      id: "professionalPerformance",
      label: "Professional Performance History",
      score: 58.8,
      isMissed: true,
      metrics: [
        { label: "Performance Appraisal Scores", value: 60 },
        { label: "Quantifiable Achievements", value: 55 },
        { label: "Promotion Velocity", value: 50 },
        { label: "Reference Veracity", value: 70 },
      ],
    },
  ],
};

const missedVerticalPills = [
  ...talentPulseData.verticals.filter((v) => v.isMissed).map((v) => v.label),
  "Psychometric",
];

const chartConfig: ChartConfig = {
  score: { label: "Score", color: "var(--primary)" },
};

function ScoreRing({ score, max }: { score: number; max: number }) {
  const size = 76;
  const stroke = 7;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, score / max));
  const offset = circumference * (1 - progress);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} className="stroke-border" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          stroke="var(--primary)"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-extrabold text-ink">{score}</span>
      </div>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="text-ink-soft flex-1 min-w-0">{label}</span>
      <div className="w-24 sm:w-32 h-1.5 rounded-full bg-surface-alt overflow-hidden shrink-0">
        <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
      </div>
      <span className="font-bold text-ink w-7 text-right shrink-0">{value}</span>
    </div>
  );
}

export function TalentPulse360() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-xs flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2.5 min-w-0">
          <Sparkles className="w-5 h-5 text-primary-glow shrink-0" />
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold text-ink">{talentPulseData.header.title}</h2>
            <p className="text-xs text-ink-soft mt-0.5">{talentPulseData.header.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <ScoreRing score={talentPulseData.overallScore} max={talentPulseData.overallScoreMax} />
          <div className="text-xs">
            <div className="font-extrabold text-ink text-base">
              {talentPulseData.overallScore}
              <span className="text-ink-soft font-medium text-xs"> /{talentPulseData.overallScoreMax}</span>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wide text-ink-soft">Overall Score</div>
          </div>
        </div>
      </div>

      {/* Action Required Banner */}
      <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 sm:p-5 space-y-3">
        <div className="flex items-start gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wide text-white bg-amber-500 rounded-full px-2.5 py-1 shrink-0">
            <AlertTriangle className="w-3 h-3" />
            Action Required
          </span>
          <p className="text-xs sm:text-sm text-ink flex-1 min-w-[200px]">
            <strong>3 missed verticals</strong> below benchmark (65 pts) — test needed to unlock full score
          </p>
        </div>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex flex-wrap gap-2">
            {missedVerticalPills.map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-700 bg-amber-500/10 border border-amber-500/25 rounded-full px-3 py-1"
              >
                <AlertTriangle className="w-3 h-3" />
                {label}
              </span>
            ))}
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 bg-amber-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-elegant hover:shadow-glow transition-all cursor-pointer shrink-0"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{talentPulseData.actionRequired.ctaLabel}</span>
          </button>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-xs">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-primary-glow" />
            Vertical Score Snapshot (Best-in-class comparison)
          </h3>
          <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
            <BarChart data={talentPulseData.verticals} margin={{ left: 0, right: 8 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis dataKey="label" tickFormatter={(v: string) => v.split(" ")[0]} tickLine={false} axisLine={false} fontSize={11} />
              <YAxis domain={[0, 100]} tickLine={false} axisLine={false} fontSize={11} width={28} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="score" fill="var(--color-score)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 shadow-xs">
          <h3 className="text-sm font-bold text-ink flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-primary-glow" />
            Radar: Multi-axis competency profile
          </h3>
          <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
            <RadarChart data={talentPulseData.verticals}>
              <PolarGrid />
              <PolarAngleAxis dataKey="label" tickFormatter={(v: string) => v.split(" ")[0]} fontSize={11} />
              <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Radar dataKey="score" fill="var(--color-score)" fillOpacity={0.35} stroke="var(--color-score)" />
            </RadarChart>
          </ChartContainer>
        </div>
      </div>

      {/* Vertical Detail Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {talentPulseData.verticals.map((vertical) => (
          <div
            key={vertical.id}
            className={`bg-surface border rounded-2xl p-5 space-y-4 ${
              vertical.isMissed ? "border-amber-500/30 border-l-4 border-l-amber-500" : "border-border"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <h4 className="text-sm font-bold text-ink leading-snug">{vertical.label}</h4>
              <span className="shrink-0 text-sm font-extrabold text-primary bg-primary/10 border border-primary/20 rounded-full w-11 h-11 flex items-center justify-center">
                {vertical.score}
              </span>
            </div>

            <div className="space-y-2.5">
              {vertical.metrics.map((metric) => (
                <MetricRow key={metric.label} label={metric.label} value={metric.value} />
              ))}
            </div>

            {!vertical.isMissed && (
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-border text-[11px]">
                <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  On track — verified
                </span>
                <span className="text-ink-soft font-medium">No action needed</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TalentPulse360;
