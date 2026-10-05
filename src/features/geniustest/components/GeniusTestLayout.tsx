"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Brain,
  Home,
  LayoutGrid,
  Edit3,
  BrainCircuit,
  Puzzle,
  Compass,
  Users,
  Layers,
  BookOpen,
  Lightbulb,
  Heart,
  TrendingUp,
  Globe,
  BarChart2,
  MessageSquare,
  Target,
  Bell,
  Menu,
  X,
  ArrowLeft,
  ChevronRight,
  ChevronsUpDown,
} from "lucide-react";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

interface GeniusTestLayoutProps {
  children: React.ReactNode;
}

export function GeniusTestLayout({ children }: GeniusTestLayoutProps) {
  const { user } = useAuthStore();
  const [activeSidebarItem, setActiveSidebarItem] = useState("Home");
  const [activeTopTab, setActiveTopTab] = useState("Home");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const sidebarNavItems = [
    { name: "Home", shortDesc: "Overview & summary", icon: Home },
    { name: "Dash Board", shortDesc: "Performance analytics", icon: LayoutGrid },
    { name: "Take Assessment", shortDesc: "Adaptive skill tests", icon: Edit3 },
    { name: "DMTT", shortDesc: "Neural fingerprint", icon: BrainCircuit },
    { name: "Raven's progressive matrices", shortDesc: "Abstract reasoning", icon: Puzzle },
    { name: "Holland code", shortDesc: "Career interest RIASEC", icon: Compass },
    { name: "Big five personality", shortDesc: "OCEAN dimensions", icon: Users },
    { name: "DISC Behavioral style", shortDesc: "Workplace dynamics", icon: Layers },
    { name: "Aptitude", shortDesc: "Cognitive assessment", icon: BookOpen },
    { name: "IQ", shortDesc: "Intelligence quotient", icon: Lightbulb },
    { name: "EQ", shortDesc: "Emotional intelligence", icon: Heart },
    { name: "A2", shortDesc: "Advanced analytics", icon: TrendingUp },
    { name: "Language", shortDesc: "Verbal proficiency", icon: Globe },
  ];

  const topNavTabs = [
    { name: "Home", icon: Home },
    { name: "My Report", icon: BarChart2 },
    { name: "AI Counselling", icon: MessageSquare },
    { name: "Career Match", icon: Target },
  ];

  const displayName = user?.fullName || user?.username || "Candidate";
  const firstName = displayName.split(" ")[0] || "Candidate";
  const email = user?.email || "";
  const firstLetter = (displayName || email || "N").charAt(0).toUpperCase();
  const avatarUrl = user?.avatarUrl || user?.avatar;

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-surface border-r border-border select-none shadow-xs">
      {/* 1. Header: Back Button & Branding */}
      <div className="p-3.5 border-b border-border space-y-3">
        {/* Back to Main LetGetIn App Button */}
        <div className="flex items-center justify-between">
          <Link
            href="/explore"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-primary-glow bg-primary/10 hover:bg-primary/15 border border-primary/20 transition-all group shadow-2xs"
            title="Return to Main Workspace Dashboard"
          >
            <ArrowLeft className="w-4 h-4 text-primary-glow group-hover:-translate-x-0.5 transition-transform" />
            <span className="truncate">Back</span>
          </Link>

          {/* Mobile Close Button */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden ml-2 p-1.5 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition"
            aria-label="Close Genius Test Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Module Title Header */}
        <div className="flex items-center gap-2.5 px-1 pt-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center text-primary-foreground font-extrabold shadow-glow shrink-0">
            <Brain className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xs font-extrabold text-ink tracking-tight truncate leading-tight">
              Genius Test
            </h1>
            <span className="text-[10px] font-semibold text-ink-soft truncate block">
              NeuroCareerOS
            </span>
          </div>
        </div>
      </div>

      {/* 2. Navigation Items Section */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1 scrollbar-thin">
        <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-ink-soft">
          Assessments & Modules
        </div>

        {sidebarNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSidebarItem === item.name;
          return (
            <button
              key={item.name}
              type="button"
              onClick={() => {
                setActiveSidebarItem(item.name);
                setMobileSidebarOpen(false);
              }}
              className={`w-full group relative flex items-center gap-2.5 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer text-left ${
                isActive
                  ? "bg-gradient-brand text-primary-foreground shadow-glow font-bold"
                  : "text-ink-soft hover:text-ink hover:bg-surface-alt/70"
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive
                    ? "text-primary-foreground"
                    : "text-ink-soft group-hover:text-primary-glow"
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="truncate font-semibold">{item.name}</div>
                {!isActive && (
                  <div className="text-[9.5px] text-ink-soft/70 truncate group-hover:text-ink-soft transition">
                    {item.shortDesc}
                  </div>
                )}
              </div>
              {isActive && (
                <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-80" />
              )}
            </button>
          );
        })}
      </div>

      {/* 3. User Identity SaaS Footer (Matching Main LetGetIn Sidebar) */}
      <div className="border-t border-border bg-surface-alt/40 p-2.5">
        <Link
          href="/profile"
          className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-surface-alt transition-all group cursor-pointer border border-transparent hover:border-border/60 text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              {avatarUrl ? (
                <div className="w-8 h-8 rounded-xl overflow-hidden ring-1 ring-border shadow-2xs">
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-gradient-brand text-primary-foreground font-extrabold text-xs flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
                  {firstLetter}
                </div>
              )}
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-surface" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-ink truncate group-hover:text-primary-glow transition-colors">
                {displayName}
              </div>
              <div className="text-[10px] text-ink-soft truncate">
                {email || "Candidate"}
              </div>
            </div>
          </div>
          <ChevronsUpDown className="w-4 h-4 text-ink-soft shrink-0 group-hover:text-ink transition" />
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background text-foreground font-sans">
      {/* Desktop Dedicated Inner Genius Test Sidebar */}
      <aside className="hidden lg:block w-64 lg:w-60 shrink-0 sticky top-0 h-screen z-30 transition-all duration-300">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs animate-in fade-in"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative z-10 w-64 h-full animate-in slide-in-from-left duration-200">
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* Main Genius Test Workspace Shell */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navigation Header (Styled matching LetGetIn header system) */}
        <header className="sticky top-0 z-20 bg-surface/80 backdrop-blur-md border-b border-border px-4 sm:px-6 h-14 flex items-center justify-between shadow-2xs">
          {/* Mobile Menu Trigger & Horizontal Navigation Tabs */}
          <div className="flex items-center gap-3 sm:gap-4 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-border text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
              aria-label="Open Genius Test Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-none py-1">
              {topNavTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTopTab === tab.name;
                return (
                  <button
                    key={tab.name}
                    type="button"
                    onClick={() => setActiveTopTab(tab.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
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
            </nav>
          </div>

          {/* Right Header Badges */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              className="p-2 rounded-xl border border-border text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-ink-soft" />
            </button>

            <Link
              href="/profile"
              className="w-8 h-8 rounded-xl bg-gradient-brand text-primary-foreground font-extrabold text-xs flex items-center justify-center shadow-glow select-none hover:scale-105 transition-transform"
              title="View Profile"
            >
              {firstLetter}
            </Link>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
