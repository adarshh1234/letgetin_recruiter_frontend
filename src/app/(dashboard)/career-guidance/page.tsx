"use client";

import React, { useState } from "react";
import { Compass, Bot, UserCheck, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CareerGuidancePage() {
  const [activeTab, setActiveTab] = useState<"ai" | "personal">("ai");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-glow text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>Career Guidance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Navigate Your Dream Career
        </h1>
        <p className="text-sm text-ink-soft max-w-2xl">
          Get hyper-personalized roadmaps, 1-on-1 industry mentoring, and AI-driven counseling.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          onClick={() => setActiveTab("ai")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "ai"
              ? "bg-gradient-brand text-primary-foreground shadow-glow"
              : "text-ink-soft hover:text-ink hover:bg-surface-alt"
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>AI</span>
        </button>

        <button
          onClick={() => setActiveTab("personal")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === "personal"
              ? "bg-gradient-brand text-primary-foreground shadow-glow"
              : "text-ink-soft hover:text-ink hover:bg-surface-alt"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Personal</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "ai" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface p-6 rounded-3xl border border-border/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary-glow">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink">AI Career Roadmap</h3>
              <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                Adaptive role matching and step-by-step career milestones curated by AI based on your skill graph.
              </p>
            </div>
            <Link
              href="/ai-apply"
              className="inline-flex items-center gap-2 text-xs font-bold text-primary-glow hover:underline pt-2"
            >
              <span>Explore AI Recommendations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-surface p-6 rounded-3xl border border-border/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink">Smart Career Chatbot</h3>
              <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                24/7 instant guidance on resumes, interview preparation, salary negotiation, and course selection.
              </p>
            </div>
            <Link
              href="/geniustest"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-500 hover:underline pt-2"
            >
              <span>Start AI Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface p-6 rounded-3xl border border-border/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink">1-on-1 Mentor Sessions</h3>
              <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                Book private sessions with top industry professionals, hiring managers, and certified career coaches.
              </p>
            </div>
            <Link
              href="/network"
              className="inline-flex items-center gap-2 text-xs font-bold text-purple-500 hover:underline pt-2"
            >
              <span>Find Mentors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-surface p-6 rounded-3xl border border-border/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary-glow">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink">Mock Interviews & Review</h3>
              <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                Practice real technical and behavioral interview scenarios with actionable, personalized feedback.
              </p>
            </div>
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 text-xs font-bold text-primary-glow hover:underline pt-2"
            >
              <span>Schedule Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
