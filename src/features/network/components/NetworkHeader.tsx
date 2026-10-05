"use client";

import React from "react";
import {
  Kanban,
  Users,
  Plus,
  Sparkles,
  Share2,
  Download,
  Flame,
  Layers,
} from "lucide-react";

interface NetworkHeaderProps {
  activeTab: "kanban" | "network";
  onTabChange: (tab: "kanban" | "network") => void;
  onOpenAddModal: () => void;
  totalNetworkCount: number;
}

export function NetworkHeader({
  activeTab,
  onTabChange,
  onOpenAddModal,
  totalNetworkCount,
}: NetworkHeaderProps) {
  return (
    <div className="border-b border-border bg-surface/60 backdrop-blur-md sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Top bar: Badges & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary-glow border border-primary/20">
                <Flame className="w-3.5 h-3.5 text-primary-glow animate-pulse" />
                Active Network Hub
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-surface-alt text-ink-soft border border-border">
                Target: 50+ High-Value Alliances
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live Sync
              </span>
            </div>

            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-ink">
                Professional Network
              </h1>
              <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-surface-alt border border-border text-ink-soft">
                {totalNetworkCount} Contacts
              </span>
            </div>

            <p className="text-xs sm:text-sm text-ink-soft font-normal max-w-2xl">
              {activeTab === "kanban"
                ? "Manage and track your professional relationships from discovery to active collaboration across pipeline stages."
                : "Discover professionals relevant to your career, startup, and industry goals, and manage your connections."}
            </p>
          </div>

          {/* Right Action buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold hover:bg-primary/90 shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Contact</span>
            </button>
          </div>
        </div>

        {/* Segmented Tab Switcher */}
        <div className="mt-5 flex items-center justify-between border-t border-border pt-3">
          <div className="inline-flex p-1 rounded-xl bg-surface-alt border border-border">
            <button
              type="button"
              onClick={() => onTabChange("kanban")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "kanban"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-ink-soft hover:text-ink hover:bg-surface"
              }`}
            >
              <Kanban className="w-4 h-4" />
              <span>Kanban Funnel</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange("network")}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "network"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-ink-soft hover:text-ink hover:bg-surface"
              }`}
            >
              <Users className="w-4 h-4" />
              <span>My Network</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-ink-soft font-medium">
            <Sparkles className="w-3.5 h-3.5 text-primary-glow" />
            <span>AI-Assisted Relationship Intelligence</span>
          </div>
        </div>
      </div>
    </div>
  );
}
