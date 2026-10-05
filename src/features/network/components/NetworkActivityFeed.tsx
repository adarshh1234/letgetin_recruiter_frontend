"use client";

import React from "react";
import {
  Bell,
  CheckCircle2,
  Eye,
  Calendar,
  UserPlus,
  ArrowRight,
  TrendingUp,
  MessageSquare,
} from "lucide-react";
import { NetworkActivity } from "../types/network.types";

interface NetworkActivityFeedProps {
  activities: NetworkActivity[];
  onSelectActivityContact?: (contactName: string) => void;
}

export function NetworkActivityFeed({
  activities,
  onSelectActivityContact,
}: NetworkActivityFeedProps) {
  const getActivityIcon = (type: NetworkActivity["activityType"]) => {
    switch (type) {
      case "connection_accepted":
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      case "followed_you":
        return <UserPlus className="w-3.5 h-3.5 text-blue-500" />;
      case "profile_view":
        return <Eye className="w-3.5 h-3.5 text-violet-500" />;
      case "meeting_completed":
        return <Calendar className="w-3.5 h-3.5 text-cyan-500" />;
      case "stage_moved":
        return <TrendingUp className="w-3.5 h-3.5 text-amber-500" />;
      default:
        return <Bell className="w-3.5 h-3.5 text-primary-glow" />;
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const diff = Date.now() - new Date(dateStr).getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours < 1) return "Just now";
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-surface border border-border space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary-glow" />
          <h3 className="text-xs font-bold text-ink uppercase tracking-wider">
            Recent Network Activity
          </h3>
        </div>
        <span className="text-[11px] text-ink-soft">Real-time</span>
      </div>

      <div className="space-y-2.5">
        {activities.slice(0, 5).map((act) => (
          <div
            key={act._id}
            className="p-2.5 rounded-xl bg-surface-alt/70 hover:bg-surface-alt border border-border/70 transition flex items-start gap-2.5"
          >
            <div className="p-1.5 rounded-lg bg-surface border border-border shrink-0 mt-0.5">
              {getActivityIcon(act.activityType)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs text-ink leading-snug">
                <span className="font-bold">{act.contactName}</span> {act.description}
              </p>
              <span className="text-[10px] text-ink-soft block mt-0.5">
                {formatTime(act.createdAt)}
              </span>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <p className="text-xs text-ink-soft text-center py-4">No recent activity</p>
        )}
      </div>
    </div>
  );
}
