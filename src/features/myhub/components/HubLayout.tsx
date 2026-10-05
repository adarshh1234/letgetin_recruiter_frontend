"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Building2,
  UserCheck,
  MessageSquare,
  GraduationCap,
  Mail,
  Folder,
  Code2,
  Monitor,
  Gamepad2,
  ArrowLeft,
  ChevronRight,
  ChevronsUpDown,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Logo } from "@/components/landing/Logo";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

interface HubLayoutProps {
  children: React.ReactNode;
}

export function HubLayout({ children }: HubLayoutProps) {
  const { user } = useAuthStore();
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const hubNavItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/myhub" },
    { name: "My Hub", icon: Users, href: "/myhub" },
    { name: "My Company / Startup", icon: Building2, href: "/myhub" },
    { name: "My HR", icon: UserCheck, href: "/myhub" },
    { name: "Chat with HR", icon: MessageSquare, href: "/myhub" },
    { name: "Learning & Development", icon: GraduationCap, href: "/edupie" },
    { name: "Mail", icon: Mail, href: "/myhub" },
    { name: "Projects", icon: Folder, href: "/myhub" },
    { name: "GitLab", icon: Code2, href: "/myhub" },
    { name: "AI Virtual Computer", icon: Monitor, href: "/myhub" },
    { name: "Games", icon: Gamepad2, href: "/skills" },
  ];

  const displayName = user?.fullName || user?.username || "Adarsh10";
  const firstName = displayName.split(" ")[0] || "Candidate";
  const email = user?.email || "adarsh10@example.com";
  const firstLetter = (displayName || email || "A").charAt(0).toUpperCase();
  const avatarUrl = user?.avatarUrl || user?.avatar;

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-surface border-r border-border select-none shadow-xs">
      {/* 1. Brand Header & Back Button */}
      <div className="p-3.5 border-b border-border space-y-3">
        {/* Back to Main Application Button */}
        <div className="flex items-center justify-between">
          <Link
            href="/explore"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-primary-glow bg-primary/10 hover:bg-primary/15 border border-primary/20 transition-all group shadow-2xs"
            title="Return to Main Workspace"
          >
            <ArrowLeft className="w-4 h-4 text-primary-glow group-hover:-translate-x-0.5 transition-transform" />
            <span className="truncate">Back</span>
          </Link>

          {/* Mobile Drawer Close */}
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="lg:hidden ml-2 p-1.5 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition"
            aria-label="Close Hub Sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Brand Logo & Minimize Toggle */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5">
            <Logo href="/myhub" />
          </div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
            title={isCollapsed ? "Expand Sidebar" : "Minimize Sidebar"}
            aria-label="Toggle Sidebar"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-4 h-4 text-primary-glow" />
            ) : (
              <PanelLeftClose className="w-4 h-4 text-ink-soft hover:text-primary-glow" />
            )}
          </button>
        </div>
      </div>

      {/* 2. Hub-Specific Navigation Items */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1 scrollbar-thin">
        <div className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-widest text-ink-soft">
          Hub Workspace
        </div>

        <nav className="space-y-1">
          {hubNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.name;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => {
                  setActiveItem(item.name);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full group relative flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all cursor-pointer text-left ${
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
                </div>
                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-80" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. User Identity Footer */}
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
                {email}
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
      {/* Desktop Dedicated Hub Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 sticky top-0 h-screen z-30 transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64 lg:w-60"
        }`}
      >
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

      {/* Main Hub Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
