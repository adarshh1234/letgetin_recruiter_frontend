"use client";

import React, { useState } from "react";
import {
  BookOpenCheck,
  Languages,
  GraduationCap,
  Landmark,
  Brain,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function SkillEnhancementPage() {
  const [activeTab, setActiveTab] = useState<
    "edupie" | "language" | "short-term" | "admissions" | "geniuspie"
  >("edupie");

  const tabs = [
    { id: "edupie" as const, name: "Edupye.com", icon: BookOpenCheck, href: "/edupie" },
    { id: "language" as const, name: "Language+", icon: Languages, href: "/skills/language" },
    { id: "short-term" as const, name: "Short Term Courses", icon: GraduationCap, href: "/skills/short-term" },
    { id: "admissions" as const, name: "Admissions", icon: Landmark, href: "/skills/admissions" },
    { id: "geniuspie" as const, name: "Geniuspie.com", icon: Brain, href: "/skills/geniuspie" },
  ];

  const modules = [
    {
      id: "edupie",
      title: "Edupye Learning Suite",
      description: "Personalized AI learning paths, skill gap analysis, and interactive video curriculum.",
      icon: BookOpenCheck,
      href: "/edupie",
      badge: "AI Powered",
      cta: "Explore Edupye",
    },
    {
      id: "language",
      title: "Language+ Fluency",
      description: "Business communication mastery, corporate English, and multi-lingual language certifications.",
      icon: Languages,
      href: "/skills/language",
      badge: "Language",
      cta: "Explore Language+",
    },
    {
      id: "short-term",
      title: "Short Term Intensive Courses",
      description: "Fast-track technical bootcamps, executive masterclasses, and hands-on micro-credentials.",
      icon: GraduationCap,
      href: "/skills/short-term",
      badge: "Bootcamps",
      cta: "View Courses",
    },
    {
      id: "admissions",
      title: "Global Admissions & Degrees",
      description: "Direct university applications, higher education degree programs, and global credit transfers.",
      icon: Landmark,
      href: "/skills/admissions",
      badge: "University",
      cta: "Explore Admissions",
    },
    {
      id: "geniuspie",
      title: "Geniuspie Cognitive Hub",
      description: "Advanced psychometric testing, cognitive intelligence tracking, and gamified skill challenges.",
      icon: Brain,
      href: "/skills/geniuspie",
      badge: "Cognitive",
      cta: "Explore Geniuspie",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-glow text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Skill Enhancement Hub</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          Accelerate Your Professional Growth
        </h1>
        <p className="text-sm text-ink-soft max-w-2xl">
          Upgrade your skill set with AI learning paths, global certifications, intensive bootcamps, and degree programs.
        </p>
      </div>

      {/* Tabs Row */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-gradient-brand text-primary-foreground shadow-glow"
                  : "text-ink-soft hover:text-ink hover:bg-surface-alt"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => {
          const Icon = mod.icon;
          const isSelected = activeTab === mod.id;
          return (
            <div
              key={mod.id}
              className={`p-6 rounded-3xl border transition-all flex flex-col justify-between group ${
                isSelected
                  ? "bg-surface border-primary/40 shadow-glow ring-2 ring-primary/20"
                  : "bg-surface border-border/80 hover:border-primary/40 hover:shadow-glow"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary-glow group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary-glow bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                    {mod.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h2 className="text-base font-bold text-ink group-hover:text-primary-glow transition-colors">
                    {mod.title}
                  </h2>
                  <p className="text-xs text-ink-soft leading-relaxed">
                    {mod.description}
                  </p>
                </div>
              </div>

              <Link
                href={mod.href}
                className="mt-6 flex items-center justify-between px-4 py-2.5 rounded-xl bg-surface-alt hover:bg-gradient-brand hover:text-primary-foreground text-ink text-xs font-semibold transition-all group-hover:shadow-md"
              >
                <span>{mod.cta}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
