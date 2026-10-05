"use client";

import React from "react";
import {
  TrendingUp,
  Clock,
  UserPlus,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { NetworkSummary, NetworkContact } from "../types/network.types";

interface NetworkInsightsSidebarProps {
  summary: NetworkSummary | null;
  recommended: NetworkContact[];
  onSelectContact: (contact: NetworkContact) => void;
  onToggleConnect: (contactId: string) => void;
}

export function NetworkInsightsSidebar({
  summary,
  recommended,
  onSelectContact,
  onToggleConnect,
}: NetworkInsightsSidebarProps) {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div className="space-y-4">
      {/* 1. Network Insights Card */}
      <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary-glow" />
          <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
            Network Insights
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-surface-alt border border-border/80">
            <span className="text-[10px] uppercase font-semibold text-ink-soft block">
              Network Size
            </span>
            <span className="text-lg font-black text-ink">
              {summary?.totalNetwork || 28}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-0.5">
              +12 this month
            </span>
          </div>

          <div className="p-3 rounded-xl bg-surface-alt border border-border/80">
            <span className="text-[10px] uppercase font-semibold text-ink-soft block">
              Active Relationships
            </span>
            <span className="text-lg font-black text-ink">
              {summary?.activeRelationships || 6}
            </span>
            <span className="text-[10px] text-primary-glow font-bold block mt-0.5">
              High Value
            </span>
          </div>

          <div className="p-3 rounded-xl bg-surface-alt border border-border/80">
            <span className="text-[10px] uppercase font-semibold text-ink-soft block">
              New Connections
            </span>
            <span className="text-lg font-black text-ink">
              {summary?.newConnectionsThisMonth || 8}
            </span>
            <span className="text-[10px] text-ink-soft font-medium block mt-0.5">
              Inbound & Outbound
            </span>
          </div>

          <div className="p-3 rounded-xl bg-surface-alt border border-border/80">
            <span className="text-[10px] uppercase font-semibold text-ink-soft block">
              Follow-ups Due
            </span>
            <span className="text-lg font-black text-amber-600 dark:text-amber-400">
              {summary?.insights.followUpsDue || 3}
            </span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block mt-0.5">
              Action Required
            </span>
          </div>
        </div>
      </div>

      {/* 2. Upcoming Follow-ups */}
      <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
            Upcoming Follow-ups
          </h3>
        </div>

        <div className="space-y-2">
          <div className="p-2.5 rounded-xl bg-surface-alt border border-border/80 flex items-start gap-2.5">
            <div className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-ink truncate">Vikramaditya Mehta</p>
              <p className="text-[11px] text-ink-soft">Send follow-up on backend architecture</p>
              <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 block mt-0.5">
                Due Tomorrow
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-alt border border-border/80 flex items-start gap-2.5">
            <div className="p-1 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-ink truncate">Arjun Nambiar</p>
              <p className="text-[11px] text-ink-soft">Prepare slides for AI Strategy sync</p>
              <span className="text-[10px] font-semibold text-cyan-600 dark:text-cyan-400 block mt-0.5">
                In 2 days
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. People You May Know */}
      <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-primary-glow" />
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
              People You May Know
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          {recommended.slice(0, 3).map((person) => (
            <div
              key={person._id}
              className="flex items-center justify-between gap-2.5 p-2 rounded-xl hover:bg-surface-alt transition"
            >
              <div
                onClick={() => onSelectContact(person)}
                className="flex items-center gap-2.5 min-w-0 cursor-pointer flex-1"
              >
                {person.avatarUrl ? (
                  <img
                    src={person.avatarUrl}
                    alt={person.name}
                    className="w-9 h-9 rounded-full object-cover border border-border shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-primary/10 text-primary-glow font-bold text-xs flex items-center justify-center border border-primary/20 shrink-0">
                    {getInitials(person.name)}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-bold text-ink hover:text-primary-glow transition truncate">
                    {person.name}
                  </p>
                  <p className="text-[10px] text-ink-soft truncate">{person.company}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onToggleConnect(person._id)}
                className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-primary/10 text-primary-glow hover:bg-primary hover:text-primary-foreground border border-primary/20 transition shrink-0 cursor-pointer"
              >
                {person.connectionStatus === "connected"
                  ? "Connected"
                  : person.connectionStatus === "pending"
                  ? "Pending"
                  : "Connect"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
