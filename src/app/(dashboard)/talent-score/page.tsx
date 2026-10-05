"use client";

import React, { useState } from "react";
import {
  Trophy,
  Zap,
  Sparkles,
  TrendingUp,
  Award,
  ShieldCheck,
  Target,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Flame,
  Star,
  Layers,
} from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function TalentScorePage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "boost" ? "boost" : "score";
  const [activeTab, setActiveTab] = useState<"score" | "boost">(initialTab);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-glow text-xs font-semibold">
          <Trophy className="w-3.5 h-3.5" />
          <span>Talent & Readiness Suite</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Talent Score & Profile Boost
        </h1>
        <p className="text-sm text-ink-soft max-w-2xl">
          Track your comprehensive AI-computed skill rating and activate targeted boosts to accelerate recruiter discovery.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("score")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "score"
              ? "bg-gradient-brand text-primary-foreground shadow-glow"
              : "text-ink-soft hover:text-ink hover:bg-surface-alt"
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Talent Score</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("boost")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "boost"
              ? "bg-gradient-brand text-primary-foreground shadow-glow"
              : "text-ink-soft hover:text-ink hover:bg-surface-alt"
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Talent Boost</span>
        </button>
      </div>

      {/* Tab 1: Talent Score */}
      {activeTab === "score" && (
        <div className="space-y-6">
          {/* Main Score Hero Card */}
          <div className="bg-surface p-6 sm:p-8 rounded-3xl border border-border/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Candidate Benchmark
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-ink">
                Overall Talent Readiness Index
              </h2>
              <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
                Calculated across technical assessments, resume verified achievements, interview performance, and domain certifications.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center p-6 bg-surface-alt/60 rounded-3xl border border-border/60 shrink-0 w-full md:w-56 text-center">
              <span className="text-[10px] font-extrabold text-ink-soft uppercase tracking-widest">Global Score</span>
              <div className="text-4xl sm:text-5xl font-black text-primary-glow my-1 tracking-tight">
                88<span className="text-xl font-bold text-ink-soft">/100</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> Top 6% in Domain
              </span>
            </div>
          </div>

          {/* Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-surface p-6 rounded-3xl border border-border/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary-glow">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-ink">Technical Competency</h3>
              <p className="text-xs text-ink-soft leading-relaxed">
                Strong proficiency across frontend frameworks, cloud infrastructure, and state management.
              </p>
              <div className="pt-2">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-ink">Rating</span>
                  <span className="text-primary-glow">92%</span>
                </div>
                <div className="w-full bg-surface-alt rounded-full h-2">
                  <div className="bg-primary-glow h-2 rounded-full w-[92%]" />
                </div>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-3xl border border-border/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-ink">Interview Simulation</h3>
              <p className="text-xs text-ink-soft leading-relaxed">
                High clarity in communication, STAR structure adherence, and problem breakdown ability.
              </p>
              <div className="pt-2">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-ink">Rating</span>
                  <span className="text-emerald-500">85%</span>
                </div>
                <div className="w-full bg-surface-alt rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full w-[85%]" />
                </div>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-3xl border border-border/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-ink">Portfolio & Credentials</h3>
              <p className="text-xs text-ink-soft leading-relaxed">
                Verified repositories, production accomplishments, and completed certification milestones.
              </p>
              <div className="pt-2">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-ink">Rating</span>
                  <span className="text-purple-500">89%</span>
                </div>
                <div className="w-full bg-surface-alt rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full w-[89%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Talent Boost */}
      {activeTab === "boost" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface p-6 sm:p-7 rounded-3xl border border-border/80 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink">Recruiter Search Spotlight</h3>
                <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                  Feature your profile at the top of recruiter candidate searches for matching job titles in your region.
                </p>
              </div>
              <ul className="space-y-2 pt-2 text-xs text-ink-soft">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>3x higher profile impressions from top hiring companies</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Instant verified badge on job applications</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Direct recruiter outreach notifications</span>
                </li>
              </ul>
              <button
                type="button"
                className="w-full mt-2 py-3 rounded-xl bg-gradient-brand text-primary-foreground font-bold text-xs shadow-glow hover:scale-[1.02] transition-all cursor-pointer"
              >
                Activate Search Spotlight
              </button>
            </div>

            <div className="bg-surface p-6 sm:p-7 rounded-3xl border border-border/80 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary-glow">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink">Fast-Track Application Priority</h3>
                <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                  Send your AI Apply submissions directly to the top of hiring manager review pipelines.
                </p>
              </div>
              <ul className="space-y-2 pt-2 text-xs text-ink-soft">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary-glow shrink-0" />
                  <span>Skip initial screening filters with score guarantee</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary-glow shrink-0" />
                  <span>Personalized cover letter and portfolio highlights</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary-glow shrink-0" />
                  <span>24-hour application status response guarantee</span>
                </li>
              </ul>
              <button
                type="button"
                className="w-full mt-2 py-3 rounded-xl bg-surface-alt hover:bg-surface-alt/80 border border-border text-ink font-bold text-xs transition-all cursor-pointer"
              >
                Enable Priority Fast-Track
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
