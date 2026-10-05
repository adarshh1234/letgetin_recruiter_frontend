"use client";

import React from "react";
import {
  Brain,
  Edit3,
  BarChart2,
  MessageSquare,
  User,
  Share2,
  Star,
  TrendingUp,
  Briefcase,
  BookOpen,
  Flame,
  PieChart,
  Lightbulb,
  ChevronRight,
  Zap,
  Sparkles,
} from "lucide-react";
import { GeniusTestLayout } from "@/features/geniustest/components/GeniusTestLayout";
import { RadarChartSVG } from "@/features/geniustest/components/RadarChartSVG";

export default function GeniusTestPage() {
  const dmttTraits = [
    { label: "Linguistic", val: 73, color: "bg-emerald-500" },
    { label: "Logical-Math", val: 47, color: "bg-indigo-500" },
    { label: "Spatial", val: 52, color: "bg-primary-glow" },
    { label: "Kinesthetic", val: 55, color: "bg-teal-500" },
    { label: "Musical", val: 58, color: "bg-purple-500" },
    { label: "Interpersonal", val: 52, color: "bg-pink-500" },
    { label: "Intrapersonal", val: 68, color: "bg-amber-500" },
    { label: "Naturalistic", val: 41, color: "bg-emerald-600" },
  ];

  const skillPowerTraits = [
    { label: "AI Readiness", val: 82, color: "bg-gradient-brand" },
    { label: "Critical Thinking", val: 76, color: "bg-primary-glow" },
    { label: "Collaborative Team Dynamics", val: 69, color: "bg-teal-500" },
    { label: "Digital Literacy", val: 88, color: "bg-purple-600" },
  ];

  const strengthsList = [
    "Analytical Thinking",
    "Quick Learning",
    "Problem Solving",
    "Creativity",
  ];

  const improveList = [
    "Time Management",
    "Public Speaking",
    "Leadership",
    "Consistency",
  ];

  const careersList = [
    "Software Developer",
    "Data Analyst",
    "AI/ML Engineer",
    "Product Manager",
  ];

  const coursesList = [
    "Full Stack Development",
    "Data Science & AI",
    "Cloud Computing",
    "Product Management",
  ];

  const assessmentCards = [
    {
      title: "Big Five Personality",
      icon: Flame,
      iconBg: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    },
    {
      title: "DISC Behavioral Style",
      icon: PieChart,
      iconBg: "bg-primary/10 text-primary-glow border-primary/20",
    },
    {
      title: "IQ Assessment",
      icon: Lightbulb,
      iconBg: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    },
    {
      title: "EQ Assessment",
      icon: Brain,
      iconBg: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    },
  ];

  return (
    <GeniusTestLayout>
      <div className="space-y-6 max-w-[1400px] mx-auto pb-10">
        {/* 1. HERO / INTRO CARD */}
        <div className="bg-surface border border-border rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-brand text-primary-foreground flex items-center justify-center shrink-0 shadow-glow">
              <Brain className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-ink font-extrabold text-lg sm:text-xl tracking-tight leading-tight">
                  EduTalent : NeuroCareerOS
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                  <Sparkles className="w-2.5 h-2.5 text-primary-glow" /> AI Standardized
                </span>
              </div>
              <p className="text-ink-soft text-xs font-semibold mt-1">
                AI-Powered DMTT Neural Mapping & global skill standardization
              </p>
              <p className="text-ink-soft text-xs font-semibold">
                Hyper-personalised career & course road map
              </p>
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-2xl px-4 py-3 text-center shadow-xs shrink-0 self-stretch md:self-auto flex items-center justify-center">
            <span className="text-primary-glow font-bold text-xs max-w-[180px] leading-snug">
              Unlock Your Potential with AI Intelligence
            </span>
          </div>
        </div>

        {/* 2. MAIN ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 text-xs font-bold bg-gradient-brand text-primary-foreground px-6 py-2.5 rounded-full shadow-elegant hover:shadow-glow transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Take Assessment</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 text-xs font-semibold bg-surface border border-border text-ink hover:bg-surface-alt hover:text-primary-glow px-6 py-2.5 rounded-full shadow-2xs transition-all cursor-pointer"
          >
            <BarChart2 className="w-3.5 h-3.5 text-primary-glow" />
            <span>View My Report</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 text-xs font-semibold bg-surface border border-border text-ink hover:bg-surface-alt hover:text-primary-glow px-6 py-2.5 rounded-full shadow-2xs transition-all cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-primary-glow" />
            <span>AI Counsellor</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 text-xs font-semibold bg-surface border border-border text-ink hover:bg-surface-alt hover:text-primary-glow px-6 py-2.5 rounded-full shadow-2xs transition-all cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-primary-glow" />
            <span>Self-Assessment</span>
          </button>
        </div>

        {/* 3. MAIN DASHBOARD CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Main Column (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Personality Overview & DMTT Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Personality Overview Card */}
              <div className="bg-surface border border-border rounded-3xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-4">
                    <div className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 text-primary-glow flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <h3 className="text-ink font-bold text-sm">
                      Personality Overview
                    </h3>
                  </div>

                  <div className="text-center py-2">
                    <div className="w-14 h-14 bg-gradient-brand text-primary-foreground rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-glow">
                      <User className="w-7 h-7" />
                    </div>
                    <span className="text-ink-soft text-xs font-semibold block">
                      Your Personality Type
                    </span>
                    <h4 className="text-gradient-brand font-extrabold text-xl mt-0.5 tracking-tight">
                      Analytical Thinker
                    </h4>
                  </div>
                </div>

                <p className="text-ink-soft text-xs text-center leading-relaxed mt-3 px-2 font-medium">
                  You have a logical and curious mindset with strong
                  problem-solving abilities and a keen interest in technology
                  and innovation.
                </p>
              </div>

              {/* DMTT - Neural Fingerprint Card */}
              <div className="bg-surface border border-border rounded-3xl p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 text-primary-glow flex items-center justify-center">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <h3 className="text-ink font-bold text-sm">
                      DMTT - Neural Fingerprint
                    </h3>
                  </div>
                  <span className="bg-primary/10 text-primary-glow border border-primary/20 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    5% ready
                  </span>
                </div>

                {/* Progress bars grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-3 mt-2">
                  {dmttTraits.map((trait) => (
                    <div key={trait.label} className="space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-ink">
                        <span>{trait.label}</span>
                        <span className="text-ink-soft">{trait.val}%</span>
                      </div>
                      <div className="w-full bg-surface-alt border border-border/40 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${trait.color}`}
                          style={{ width: `${trait.val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4 Insight Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* Your Strengths */}
              <div className="bg-surface border border-border rounded-2xl p-4 shadow-xs hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-primary-glow fill-primary-glow" />
                  <h4 className="text-ink font-bold text-xs">
                    Your Strengths
                  </h4>
                </div>
                <ul className="space-y-2 text-xs font-semibold text-ink-soft">
                  {strengthsList.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="text-ink">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Areas to Improve */}
              <div className="bg-surface border border-border rounded-2xl p-4 shadow-xs hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-rose-500" />
                  <h4 className="text-ink font-bold text-xs">
                    Areas to Improve
                  </h4>
                </div>
                <ul className="space-y-2 text-xs font-semibold text-ink-soft">
                  {improveList.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span className="text-ink">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Careers */}
              <div className="bg-surface border border-border rounded-2xl p-4 shadow-xs hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Briefcase className="w-4 h-4 text-primary-glow" />
                  <h4 className="text-ink font-bold text-xs">
                    Recommended Careers
                  </h4>
                </div>
                <ul className="space-y-2 text-xs font-semibold text-ink-soft">
                  {careersList.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-glow shrink-0" />
                      <span className="text-ink">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommended Courses */}
              <div className="bg-surface border border-border rounded-2xl p-4 shadow-xs hover:border-primary/30 transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-purple-500" />
                  <h4 className="text-ink font-bold text-xs">
                    Recommended Courses
                  </h4>
                </div>
                <ul className="space-y-2 text-xs font-semibold text-ink-soft">
                  {coursesList.map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                      <span className="text-ink">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom 4 Assessment Quick Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {assessmentCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.title}
                    className="bg-surface border border-border rounded-2xl p-3.5 shadow-xs flex items-center justify-between hover:shadow-glow hover:border-primary/40 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl border ${card.iconBg} flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-ink font-bold text-xs tracking-tight group-hover:text-primary-glow transition-colors">
                        {card.title}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-ink-soft group-hover:translate-x-0.5 group-hover:text-primary-glow transition-all" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (4 cols): Brain Mapping & Skill Power */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-surface border border-border rounded-3xl p-5 shadow-xs space-y-5">
              {/* Brain Mapping Header & Radar Chart */}
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 text-primary-glow flex items-center justify-center">
                    <Brain className="w-4 h-4" />
                  </div>
                  <h3 className="text-ink font-bold text-sm sm:text-base">
                    Brain Mapping
                  </h3>
                </div>

                <RadarChartSVG />
              </div>

              <div className="border-t border-border pt-4">
                {/* Skill Power & Adaptive Traits Header */}
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-primary-glow fill-primary-glow" />
                  <h4 className="text-ink font-bold text-xs sm:text-sm">
                    Skill Power & Adaptive Traits
                  </h4>
                </div>

                {/* Progress Bars */}
                <div className="space-y-3.5">
                  {skillPowerTraits.map((trait) => (
                    <div key={trait.label} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-ink">
                        <span>{trait.label}</span>
                        <span className="text-ink-soft">{trait.val}%</span>
                      </div>
                      <div className="w-full bg-surface-alt border border-border/40 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${trait.color}`}
                          style={{ width: `${trait.val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GeniusTestLayout>
  );
}
