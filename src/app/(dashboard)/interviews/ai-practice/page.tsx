"use client";

import React, { useState } from "react";
import {
  Bot,
  Video,
  Sparkles,
  Mic,
  Play,
  Clock,
  Target,
  Award,
  Layers,
  BarChart2,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function AIInterviewPracticePage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "mock" ? "mock" : "practice";
  const [activeTab, setActiveTab] = useState<"practice" | "mock">(initialTab);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-glow text-xs font-semibold">
          <Bot className="w-3.5 h-3.5" />
          <span>AI Interview Suite</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          AI Interview Practice & Mock Simulations
        </h1>
        <p className="text-sm text-ink-soft max-w-2xl">
          Sharpen your answers with real-time AI voice evaluation, industry question banks, and realistic full-length hiring manager simulations.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("practice")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "practice"
              ? "bg-gradient-brand text-primary-foreground shadow-glow"
              : "text-ink-soft hover:text-ink hover:bg-surface-alt"
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>AI Interview Practice</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("mock")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "mock"
              ? "bg-gradient-brand text-primary-foreground shadow-glow"
              : "text-ink-soft hover:text-ink hover:bg-surface-alt"
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Mockup Interview</span>
        </button>
      </div>

      {/* Tab 1: AI Interview Practice */}
      {activeTab === "practice" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-surface p-6 rounded-3xl border border-border/80 shadow-xs space-y-4 hover:border-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary-glow">
                <Mic className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-ink">Voice AI Practice</h3>
                <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                  Real-time interactive voice conversation evaluating your speech clarity, pacing, confidence, and keyword relevance.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className="text-[11px] font-semibold text-primary-glow">100+ Topics</span>
                <span className="text-xs font-bold text-primary-glow flex items-center gap-1">
                  Start Practice <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-3xl border border-border/80 shadow-xs space-y-4 hover:border-emerald-500/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-ink">Technical & Coding Rounds</h3>
                <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                  Deep-dive role-specific technical questions tailored to software engineering, product, marketing, and data domains.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className="text-[11px] font-semibold text-emerald-500">Adaptive Difficulty</span>
                <span className="text-xs font-bold text-emerald-500 flex items-center gap-1">
                  Explore Drills <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            <div className="bg-surface p-6 rounded-3xl border border-border/80 shadow-xs space-y-4 hover:border-purple-500/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                <BarChart2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-ink">Instant AI Scoring & STAR Feedback</h3>
                <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                  Automated feedback reports with structured recommendations on Situation, Task, Action, and Result framing.
                </p>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className="text-[11px] font-semibold text-purple-500">Scorecard Analytics</span>
                <span className="text-xs font-bold text-purple-500 flex items-center gap-1">
                  View Analytics <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>

          {/* Quick Practice Starter Section */}
          <div className="bg-gradient-to-r from-primary/10 via-surface to-primary/5 p-6 rounded-3xl border border-primary/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary-glow" />
                <h4 className="text-sm font-bold text-ink">Ready for a quick 5-minute warm up?</h4>
              </div>
              <p className="text-xs text-ink-soft">
                Answer 3 random behavioral questions tailored to your target job profile.
              </p>
            </div>
            <button
              type="button"
              className="px-5 py-2.5 rounded-xl bg-gradient-brand text-primary-foreground font-bold text-xs shadow-glow hover:scale-105 transition-all shrink-0 cursor-pointer"
            >
              Start Rapid Drill
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Mockup Interview */}
      {activeTab === "mock" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface p-6 rounded-3xl border border-border/80 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary-glow">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink">Simulated Hiring Manager Interview</h3>
                <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                  Experience full 30 to 45 minute end-to-end simulated company interviews with realistic hiring manager personas and follow-up probing.
                </p>
              </div>
              <ul className="space-y-2 pt-2 text-xs text-ink-soft">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Full-length 30-45 min camera & mic session</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Real company question banks (Google, Amazon, Meta, etc.)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Comprehensive hiring committee evaluation report</span>
                </li>
              </ul>
              <button
                type="button"
                className="w-full mt-2 py-3 rounded-xl bg-gradient-brand text-primary-foreground font-bold text-xs shadow-glow hover:scale-[1.02] transition-all cursor-pointer"
              >
                Launch Mock Simulation
              </button>
            </div>

            <div className="bg-surface p-6 rounded-3xl border border-border/80 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-ink">Custom Scenario Setup</h3>
                <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                  Configure custom role requirements, seniority level, interviewer demeanor (friendly, rigorous, rapid-fire), and technical scope.
                </p>
              </div>
              <ul className="space-y-2 pt-2 text-xs text-ink-soft">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Paste job description for tailored questions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Select interviewer personality & strictness</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Download video recording & timestamped transcript</span>
                </li>
              </ul>
              <button
                type="button"
                className="w-full mt-2 py-3 rounded-xl bg-surface-alt hover:bg-surface-alt/80 border border-border text-ink font-bold text-xs transition-all cursor-pointer"
              >
                Configure Custom Scenario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
