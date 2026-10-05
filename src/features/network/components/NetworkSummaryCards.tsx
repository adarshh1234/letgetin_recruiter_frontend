"use client";

import React from "react";
import {
  Users,
  UserPlus,
  Send,
  MessageSquare,
  Calendar,
  Handshake,
  TrendingUp,
  Award,
} from "lucide-react";
import { NetworkSummary } from "../types/network.types";

interface NetworkSummaryCardsProps {
  summary: NetworkSummary | null;
  loading?: boolean;
}

export function NetworkSummaryCards({
  summary,
  loading = false,
}: NetworkSummaryCardsProps) {
  const total = summary?.totalNetwork ?? 0;
  const newConn = summary?.newConnectionsThisMonth ?? 0;
  const contacted = summary?.contacted ?? 0;
  const responded = summary?.responded ?? 0;
  const meetings = summary?.meetings ?? 0;
  const activeRel = summary?.activeRelationships ?? 0;

  const responseRate = contacted > 0 ? Math.round((responded / contacted) * 100) : 0;
  const activePercent = total > 0 ? Math.min(Math.round((activeRel / total) * 100), 100) : 0;

  const cards = [
    {
      title: "Total Network",
      value: loading ? "..." : total.toLocaleString(),
      subtitle: `${newConn} added recently`,
      icon: Users,
      badge: summary?.insights.networkGrowthRate || "+12%",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "New Connections",
      value: loading ? "..." : `+${newConn}`,
      subtitle: "Active this month",
      icon: UserPlus,
      badge: "Inbound & Outbound",
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      title: "Contacted",
      value: loading ? "..." : contacted.toString(),
      subtitle: "Outreach initiated",
      icon: Send,
      badge: "In pipeline",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    {
      title: "Responded",
      value: loading ? "..." : responded.toString(),
      subtitle: `${responseRate}% response rate`,
      icon: MessageSquare,
      badge: "High Engagement",
      color: "text-violet-600 dark:text-violet-400",
      bgColor: "bg-violet-500/10",
      borderColor: "border-violet-500/20",
    },
    {
      title: "Meetings",
      value: loading ? "..." : meetings.toString(),
      subtitle: `${summary?.insights.upcomingMeetings || 1} upcoming`,
      icon: Calendar,
      badge: "Scheduled / Held",
      color: "text-cyan-600 dark:text-cyan-400",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
    },
    {
      title: "Active Relationships",
      value: loading ? "..." : activeRel.toString(),
      subtitle: "Mentors, Leads & Partners",
      icon: Handshake,
      badge: "Core Alliances",
      color: "text-rose-600 dark:text-rose-400",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
    },
  ];

  return (
    <div className="space-y-4">
      {/* 6 KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-all hover:shadow-xs group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft truncate">
                  {card.title}
                </span>
                <div className={`p-1.5 rounded-xl ${card.bgColor} ${card.color} shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>

              <div>
                <div className="text-xl sm:text-2xl font-black text-ink tracking-tight mb-1">
                  {card.value}
                </div>
                <div className="flex items-center justify-between text-[11px] text-ink-soft">
                  <span className="truncate">{card.subtitle}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Network Pipeline Health Bar */}
      <div className="p-4 rounded-2xl bg-surface border border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary-glow" />
            <span className="text-xs font-bold text-ink">
              Network Conversion & Engagement Depth
            </span>
            <span className="text-[11px] text-ink-soft hidden sm:inline">
              ({activeRel} of {total} relationships at top active tier)
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold text-ink-soft">
            <span className="text-primary-glow font-bold">{responseRate}% Response Rate</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              {activePercent}% Core Conversion
            </span>
          </div>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-surface-alt overflow-hidden flex">
          <div
            className="bg-blue-500 h-full transition-all"
            style={{ width: `${Math.min((summary?.stageCounts?.discover || 0) * 10, 20)}%` }}
            title="Discover"
          />
          <div
            className="bg-emerald-500 h-full transition-all"
            style={{ width: `${Math.min((summary?.stageCounts?.connected || 0) * 10, 25)}%` }}
            title="Connected"
          />
          <div
            className="bg-amber-500 h-full transition-all"
            style={{ width: `${Math.min((summary?.stageCounts?.contacted || 0) * 10, 20)}%` }}
            title="Contacted"
          />
          <div
            className="bg-violet-500 h-full transition-all"
            style={{ width: `${Math.min((summary?.stageCounts?.engaged || 0) * 10, 15)}%` }}
            title="Engaged"
          />
          <div
            className="bg-cyan-500 h-full transition-all"
            style={{ width: `${Math.min((summary?.stageCounts?.meeting || 0) * 10, 10)}%` }}
            title="Meeting"
          />
          <div
            className="bg-rose-500 h-full transition-all"
            style={{ width: `${Math.min((summary?.stageCounts?.relationship || 0) * 10, 15)}%` }}
            title="Active Relationship"
          />
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[10px] text-ink-soft">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" /> Discover
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Connected
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Contacted
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-violet-500" /> Engaged
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-500" /> Meeting
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Relationship
          </span>
        </div>
      </div>
    </div>
  );
}
