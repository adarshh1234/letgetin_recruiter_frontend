"use client";

import React from "react";
import {
  Clock,
  Video,
} from "lucide-react";
import {
  CalendarItem,
  CalendarColorTheme,
  DEFAULT_PROJECTS,
  useCalendarStore,
} from "@/features/recruiter/store/useCalendarStore";

interface CalendarItemCardProps {
  item: CalendarItem;
}

const THEME_STYLES: Record<
  CalendarColorTheme,
  {
    leftBar: string;
    badgeBg: string;
    badgeText: string;
    borderAccent: string;
  }
> = {
  green: {
    leftBar: "bg-emerald-500",
    badgeBg: "bg-emerald-500/10",
    badgeText: "text-emerald-600 dark:text-emerald-400",
    borderAccent: "hover:border-emerald-500/40",
  },
  teal: {
    leftBar: "bg-cyan-500",
    badgeBg: "bg-cyan-500/10",
    badgeText: "text-cyan-600 dark:text-cyan-400",
    borderAccent: "hover:border-cyan-500/40",
  },
  blue: {
    leftBar: "bg-primary",
    badgeBg: "bg-primary/10",
    badgeText: "text-primary-glow",
    borderAccent: "hover:border-primary/40",
  },
  slate: {
    leftBar: "bg-slate-400 dark:bg-slate-500",
    badgeBg: "bg-slate-500/10",
    badgeText: "text-slate-600 dark:text-slate-400",
    borderAccent: "hover:border-slate-500/40",
  },
};

export function CalendarItemCard({ item }: CalendarItemCardProps) {
  const { toggleItemDone, setActiveItemId } = useCalendarStore();

  let themeKey: CalendarColorTheme = item.themeColor || "teal";
  if (!item.themeColor) {
    if (item.projectId === "growth" || item.projectId === "recruitment") {
      themeKey = "blue";
    } else if (item.projectId === "ops" || item.projectId === "campus" || item.projectId === "engineering") {
      themeKey = "green";
    } else if (item.projectId === "funding") {
      themeKey = "teal";
    } else {
      themeKey = "slate";
    }
  }

  const theme = THEME_STYLES[themeKey] || THEME_STYLES.teal;
  const isDone = item.status === "done";
  const isEvent = item.type === "event";

  const hours = Math.floor((item.durationMinutes || 30) / 60);
  const mins = (item.durationMinutes || 30) % 60;
  const durationText = `${hours}:${mins < 10 ? `0${mins}` : mins}h`;

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", item.id);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => setActiveItemId(item.id)}
      className={`p-3 pl-3.5 rounded-2xl bg-surface border border-border ${theme.borderAccent} hover:shadow-md transition-all duration-150 cursor-grab active:cursor-grabbing group shadow-2xs flex flex-col justify-between select-none relative overflow-hidden ${
        isDone ? "opacity-60 saturate-50" : ""
      }`}
    >
      {/* Left Color Accent Stripe */}
      <div className={`absolute top-0 bottom-0 left-0 w-1 ${theme.leftBar}`} />

      {/* Title with Emoji or Icon */}
      <div className="flex items-start gap-1.5">
        {item.iconEmoji ? (
          <span className="text-[13px] leading-tight shrink-0 select-none">
            {item.iconEmoji}
          </span>
        ) : isEvent ? (
          <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5 text-primary-glow" />
        ) : null}

        <h4 className="text-[12px] font-semibold leading-snug tracking-tight text-ink flex-1">
          {item.title}
        </h4>
      </div>

      {/* Sub-row: Duration and event time / meeting tag */}
      <div className="flex items-center justify-between gap-1 pt-2 text-[11px] font-mono">
        <span className="text-ink-soft">{durationText}</span>

        <div className="flex items-center gap-1 font-sans">
          {isEvent && item.startTime && (
            <span className="text-[10px] font-medium bg-surface-alt border border-border/80 px-1.5 py-0.5 rounded-md text-ink-soft">
              {item.startTime} {item.endTime ? `– ${item.endTime}` : ""}
            </span>
          )}

          {item.meetingLink && (
            <span className="text-[9.5px] font-bold bg-primary/10 border border-primary/20 text-primary-glow px-1.5 py-0.5 rounded-md flex items-center gap-1">
              <Video className="w-2.5 h-2.5" />
              <span>Join</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
