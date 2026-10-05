"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Search,
  Users,
  ChevronRight,
  ArrowRight,
  FileText,
  Building2,
  CheckCircle2,
  GraduationCap,
  MapPin,
  Mail,
  Phone,
  Zap,
  TrendingUp,
  Bookmark,
  Settings,
  Bell,
  Home,
  Rocket,
  Gamepad2,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { HubLayout } from "@/features/myhub/components/HubLayout";

export default function MyHubPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState("Home");

  // User Profile data with safe fallbacks
  const displayName = user?.fullName || user?.username || "Adarsh10";
  const firstName = displayName.split(" ")[0] || "Candidate";
  const email = user?.email || "adarsh10@example.com";
  const phone = user?.phone || "+91 98765 43210";
  const firstLetter = (displayName || email || "A").charAt(0).toUpperCase();
  const avatarUrl = user?.avatarUrl || user?.avatar;

  const topNavTabs = [
    { name: "Home", icon: Home, href: "/myhub" },
    { name: "AI Apply", icon: Rocket, href: "/ai-apply" },
    { name: "Score Game", icon: Gamepad2, href: "/skills" },
    { name: "Institutions", icon: Building2, href: "/explore" },
    { name: "Startups", icon: Rocket, href: "/explore" },
    { name: "Companies", icon: Briefcase, href: "/explore" },
  ];

  const quickActionCards = [
    {
      title: "Post A Job",
      desc: "Create and share opportunities",
      icon: Briefcase,
      iconBg: "bg-primary/10 text-primary-glow border-primary/20",
      href: "/resume",
    },
    {
      title: "Find CVs",
      desc: "Search talented candidates",
      icon: Search,
      iconBg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
      href: "/explore",
    },
    {
      title: "Recruit Pro",
      desc: "Smarter hiring with AI",
      icon: Users,
      iconBg: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      href: "/ai-apply",
    },
  ];

  const newsItems = [
    {
      id: 1,
      category: "Career Insights",
      date: "Dec 10, 2024",
      title: "Top Skills in Demand for 2025",
      snippet: "Explore the most in-demand skills shaping the future of work.",
      imageUrl:
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=200&auto=format&fit=crop&q=80",
    },
    {
      id: 2,
      category: "Product Update",
      date: "Dec 8, 2024",
      title: "LetGetIn Launches AI Apply",
      snippet: "Apply to multiple jobs with one click using AI.",
      imageUrl:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=80",
    },
    {
      id: 3,
      category: "Success Story",
      date: "Dec 5, 2024",
      title: "From Campus to Career",
      snippet: "How a student landed a dream job through LetGetIn.",
      imageUrl:
        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200&auto=format&fit=crop&q=80",
    },
  ];

  const quickActionLinks = [
    {
      label: "Improve My Score",
      icon: TrendingUp,
      href: "/skills",
    },
    {
      label: "Track Applications",
      icon: FileText,
      href: "/applications",
    },
    {
      label: "Saved Jobs",
      icon: Bookmark,
      href: "/explore",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/profile",
    },
  ];

  return (
    <HubLayout>
      <div className="min-h-full flex flex-col bg-background text-foreground select-none pb-12">
      {/* 1. TOP SUB-NAV HEADER */}
      <div className="bg-surface/80 backdrop-blur-md border-b border-border px-4 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-10 shadow-2xs">
        {/* Horizontal Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1">
          {topNavTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.name;
            return (
              <button
                key={tab.name}
                type="button"
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-gradient-brand text-primary-foreground font-bold shadow-glow"
                    : "text-ink-soft hover:text-ink hover:bg-surface-alt"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? "text-primary-foreground" : "text-primary-glow"
                  }`}
                />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right Action Icons & User Badge */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <Link
            href="/explore"
            className="p-2 rounded-xl border border-border text-ink-soft hover:text-ink hover:bg-surface-alt transition"
            title="Search Opportunities"
          >
            <Search className="w-4 h-4" />
          </Link>

          <button
            type="button"
            className="p-2 rounded-xl border border-border text-ink-soft hover:text-ink hover:bg-surface-alt transition relative cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-surface" />
          </button>

          <Link
            href="/profile"
            className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-2xl hover:bg-surface-alt border border-transparent hover:border-border/60 transition group cursor-pointer"
          >
            {avatarUrl ? (
              <div className="w-7 h-7 rounded-xl overflow-hidden ring-1 ring-border shadow-2xs">
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-xl bg-gradient-brand text-primary-foreground font-extrabold text-xs flex items-center justify-center shadow-glow">
                {firstLetter}
              </div>
            )}
            <span className="text-xs font-bold text-ink hidden sm:block truncate max-w-[100px]">
              {displayName}
            </span>
          </Link>
        </div>
      </div>

      {/* 2. MAIN DASHBOARD CONTENT */}
      <div className="p-4 sm:p-6 max-w-[1600px] mx-auto w-full space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ========================================== */}
          {/* LEFT / MAIN COLUMN (6 Columns on xl)      */}
          {/* ========================================== */}
          <div className="lg:col-span-12 xl:col-span-6 space-y-6">
            {/* Welcome Banner */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                Welcome back, {firstName}!
              </h1>
              <p className="text-xs sm:text-sm text-ink-soft mt-1 font-medium">
                Here&apos;s what&apos;s happening in your career journey today.
              </p>
            </div>

            {/* 3 Quick Action Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {quickActionCards.map((card) => {
                const Icon = card.icon;
                return (
                  <Link
                    key={card.title}
                    href={card.href}
                    className="bg-surface border border-border rounded-3xl p-4 sm:p-5 shadow-xs hover:shadow-glow hover:border-primary/40 transition-all group flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div
                        className={`w-10 h-10 rounded-2xl border ${card.iconBg} flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <ChevronRight className="w-4 h-4 text-ink-soft group-hover:translate-x-0.5 group-hover:text-primary-glow transition-all mt-1" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-ink group-hover:text-primary-glow transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-[11px] text-ink-soft mt-0.5 leading-snug">
                        {card.desc}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Central Feature Hero Card ("Let's build your future") */}
            <div className="bg-surface border border-border rounded-3xl p-8 sm:p-12 text-center shadow-xs flex flex-col items-center justify-center relative overflow-hidden group">
              {/* Background ambient light */}
              <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-primary-glow/5 rounded-full blur-3xl" />

              {/* Central 3D Styled Briefcase Graphic */}
              <div className="relative mb-6">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-brand text-primary-foreground flex items-center justify-center shadow-elegant group-hover:scale-105 transition-transform duration-300">
                  <div className="relative flex flex-col items-center justify-center">
                    <Briefcase className="w-14 h-14 text-white drop-shadow-md" />
                    <Sparkles className="w-5 h-5 text-primary-glow absolute -top-2 -right-2 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Title & Subtitle */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                Let&apos;s build your future
              </h2>
              <p className="text-xs sm:text-sm text-ink-soft max-w-md mt-2.5 mb-7 leading-relaxed font-medium">
                Post jobs, find candidates, collaborate with institutions and
                manage your career ecosystem — all in one place.
              </p>

              {/* Primary Action Button */}
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold bg-gradient-brand text-primary-foreground px-8 py-3.5 rounded-full shadow-elegant hover:shadow-glow transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* ========================================== */}
          {/* CENTER-RIGHT COLUMN (3 Columns on xl)      */}
          {/* ========================================== */}
          <div className="lg:col-span-6 xl:col-span-3 space-y-6">
            {/* News Card */}
            <div className="bg-surface border border-border rounded-3xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 text-primary-glow flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="text-ink font-extrabold text-sm">News</h3>
                </div>
                <button
                  type="button"
                  className="text-xs font-bold text-primary-glow hover:underline cursor-pointer"
                >
                  View All
                </button>
              </div>

              {/* News List */}
              <div className="space-y-3.5 divide-y divide-border/60">
                {newsItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-3 group cursor-pointer ${
                      idx > 0 ? "pt-3.5" : ""
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-border bg-surface-alt">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-[10px] font-semibold text-ink-soft mb-0.5">
                        <span className="text-primary-glow font-bold">
                          {item.category}
                        </span>
                        <span>{item.date}</span>
                      </div>
                      <h4 className="text-xs font-bold text-ink leading-snug group-hover:text-primary-glow transition-colors line-clamp-1">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-ink-soft mt-0.5 line-clamp-2 leading-relaxed">
                        {item.snippet}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Card */}
            <div className="bg-surface border border-border rounded-3xl p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="relative shrink-0">
                  {avatarUrl ? (
                    <div className="w-12 h-12 rounded-2xl overflow-hidden ring-1 ring-border shadow-xs">
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-2xl bg-gradient-brand text-primary-foreground font-extrabold text-base flex items-center justify-center shadow-glow">
                      {firstLetter}
                    </div>
                  )}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-surface" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-extrabold text-ink truncate">
                    {displayName}
                  </h3>
                  <span className="inline-flex items-center text-[10px] font-semibold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full mt-0.5">
                    Student
                  </span>
                </div>
              </div>

              {/* Profile Details List */}
              <div className="space-y-2.5 pt-1 text-xs text-ink-soft">
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-4 h-4 text-primary-glow shrink-0" />
                  <span className="truncate">B.Tech Computer Science</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-primary-glow shrink-0" />
                  <span className="truncate">Bangalore, India</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-primary-glow shrink-0" />
                  <span className="truncate">{email}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-primary-glow shrink-0" />
                  <span className="truncate">{phone}</span>
                </div>
              </div>

              <Link
                href="/profile"
                className="w-full block text-center py-2.5 rounded-xl border border-border hover:border-primary/40 bg-surface-alt/60 hover:bg-surface-alt text-ink font-bold text-xs transition-all shadow-2xs cursor-pointer"
              >
                Edit Profile
              </Link>
            </div>
          </div>

          {/* ========================================== */}
          {/* FAR-RIGHT COLUMN (3 Columns on xl)         */}
          {/* ========================================== */}
          <div className="lg:col-span-6 xl:col-span-3 space-y-6">
            {/* My Company / Institute Card */}
            <div className="bg-surface border border-border rounded-3xl p-5 shadow-xs space-y-3.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 text-primary-glow flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="text-ink font-extrabold text-sm">
                  My Company / Institute
                </h3>
              </div>

              {/* Building Image Banner */}
              <div className="h-28 w-full rounded-2xl overflow-hidden border border-border bg-slate-100 relative shadow-2xs">
                <img
                  src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=80"
                  alt="LetGetIn Technologies"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Company Info */}
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-extrabold text-ink">
                    LetGetIn Technologies
                  </h4>
                  <CheckCircle2 className="w-4 h-4 text-primary-glow shrink-0" />
                </div>
                <p className="text-[11px] text-ink-soft mt-0.5">
                  Innovation for a better tomorrow
                </p>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 py-2 border-y border-border/60 text-center">
                <div>
                  <span className="text-xs font-extrabold text-ink block">
                    250+
                  </span>
                  <span className="text-[10px] text-ink-soft font-semibold">
                    Employees
                  </span>
                </div>
                <div>
                  <span className="text-xs font-extrabold text-ink block">
                    15
                  </span>
                  <span className="text-[10px] text-ink-soft font-semibold">
                    Openings
                  </span>
                </div>
                <div>
                  <span className="text-xs font-extrabold text-ink block">
                    4.8
                  </span>
                  <span className="text-[10px] text-ink-soft font-semibold">
                    Rating
                  </span>
                </div>
              </div>

              <Link
                href="/explore"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/15 border border-primary/20 text-primary-glow font-bold text-xs transition-all shadow-2xs cursor-pointer"
              >
                <span>View Company Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-surface border border-border rounded-3xl p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 text-primary-glow flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-ink font-extrabold text-sm">
                  Quick Actions
                </h3>
              </div>

              <div className="space-y-1.5">
                {quickActionLinks.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.label}
                      href={action.href}
                      className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-surface-alt border border-transparent hover:border-border/60 text-xs font-semibold text-ink transition-all group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-primary-glow group-hover:scale-110 transition-transform" />
                        <span>{action.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-ink-soft group-hover:translate-x-0.5 group-hover:text-primary-glow transition-all" />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Learning & Growth Card */}
            <div className="bg-surface border border-border rounded-3xl p-5 shadow-xs space-y-3.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-primary/10 border border-primary/20 text-primary-glow flex items-center justify-center">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="text-ink font-extrabold text-sm">
                  Learning & Growth
                </h3>
              </div>

              <p className="text-xs text-ink-soft font-medium">
                Keep learning, keep growing!
              </p>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-ink">Overall Progress</span>
                  <span className="text-primary-glow">60%</span>
                </div>
                <div className="w-full bg-surface-alt border border-border/40 h-2.5 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-brand w-[60%]" />
                </div>
              </div>

              <Link
                href="/edupie"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary/10 hover:bg-primary/15 border border-primary/20 text-primary-glow font-bold text-xs transition-all shadow-2xs cursor-pointer"
              >
                <span>Explore Courses</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      </div>
    </HubLayout>
  );
}
