"use client";

import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
} from "date-fns";
import { Plus, Video, Clock, Check } from "lucide-react";
import {
  CalendarItem,
  CalendarColorTheme,
  useCalendarStore,
} from "@/features/recruiter/store/useCalendarStore";

interface CalendarMonthViewProps {
  anchorDate: Date;
  onSelectDate: (dateStr: string) => void;
  onQuickAddTask: (dateStr: string) => void;
  onQuickAddEvent: (dateStr: string) => void;
}

const WEEKDAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const THEME_CHIP_STYLES: Record<
  CalendarColorTheme,
  {
    bg: string;
    border: string;
    text: string;
    dot: string;
  }
> = {
  green: {
    bg: "bg-emerald-500/10 hover:bg-emerald-500/15",
    border: "border-emerald-500/30",
    text: "text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  teal: {
    bg: "bg-cyan-500/10 hover:bg-cyan-500/15",
    border: "border-cyan-500/30",
    text: "text-cyan-600 dark:text-cyan-400",
    dot: "bg-cyan-500",
  },
  blue: {
    bg: "bg-primary/10 hover:bg-primary/15",
    border: "border-primary/30",
    text: "text-primary-glow",
    dot: "bg-primary",
  },
  slate: {
    bg: "bg-slate-500/10 hover:bg-slate-500/15",
    border: "border-slate-500/30",
    text: "text-slate-600 dark:text-slate-400",
    dot: "bg-slate-400",
  },
};

export function CalendarMonthView({
  anchorDate,
  onSelectDate,
  onQuickAddTask,
  onQuickAddEvent,
}: CalendarMonthViewProps) {
  const {
    items,
    moveItemDate,
    hideCompleted,
    selectedProjectId,
    selectedPriority,
    searchQuery,
    setActiveItemId,
  } = useCalendarStore();

  const [dragOverDate, setDragOverDate] = useState<string | null>(null);

  // Month grid interval calculations
  const monthStart = startOfMonth(anchorDate);
  const monthEnd = endOfMonth(anchorDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 }); // Sunday end
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const handleDragOver = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverDate(dateStr);
  };

  const handleDragLeave = () => {
    setDragOverDate(null);
  };

  const handleDrop = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    setDragOverDate(null);
    const itemId = e.dataTransfer.getData("text/plain");
    if (itemId) {
      moveItemDate(itemId, dateStr);
    }
  };

  const handleItemDragStart = (e: React.DragEvent, id: string) => {
    e.stopPropagation();
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden select-none">
      {/* Weekday Header Row */}
      <div className="grid grid-cols-7 border-b border-border bg-surface/50 shrink-0">
        {WEEKDAY_HEADERS.map((dayName, idx) => (
          <div
            key={dayName}
            className={`py-2 px-3 text-center text-xs font-bold ${
              idx >= 5 ? "text-ink-soft/70" : "text-ink"
            }`}
          >
            {dayName}
          </div>
        ))}
      </div>

      {/* 7x5 or 7x6 Month Cells Grid */}
      <div className="flex-1 grid grid-cols-7 grid-rows-5 lg:grid-rows-6 min-h-0 bg-border gap-px overflow-y-auto">
        {calendarDays.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const dayNumber = format(day, "d");
          const isCurMonth = isSameMonth(day, anchorDate);
          const isTodayDate = isToday(day);
          const isSelected = isSameDay(day, anchorDate);
          const isHoveredDrag = dragOverDate === dateStr;

          // Filter items for this specific day
          const dayItems = items.filter((item) => {
            if (item.date !== dateStr) return false;
            if (hideCompleted && item.status === "done") return false;
            if (selectedProjectId !== "all" && item.projectId !== selectedProjectId) return false;
            if (selectedPriority !== "all" && item.priority !== selectedPriority) return false;
            if (searchQuery.trim()) {
              const q = searchQuery.toLowerCase();
              const matchTitle = item.title.toLowerCase().includes(q);
              const matchDesc = item.description?.toLowerCase().includes(q) || false;
              if (!matchTitle && !matchDesc) return false;
            }
            return true;
          });

          return (
            <div
              key={dateStr}
              onDragOver={(e) => handleDragOver(e, dateStr)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, dateStr)}
              onClick={() => onSelectDate(dateStr)}
              className={`flex flex-col min-h-[90px] p-1.5 sm:p-2 bg-surface hover:bg-surface-alt/40 transition-colors group relative ${
                !isCurMonth ? "opacity-40 bg-surface-alt/20" : ""
              } ${isHoveredDrag ? "bg-primary/10 ring-2 ring-primary ring-inset" : ""} ${
                isSelected ? "ring-1 ring-primary/40" : ""
              }`}
            >
              {/* Day Cell Header (Date number + Quick Add Button) */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-xs font-bold flex items-center justify-center transition ${
                    isTodayDate
                      ? "w-6 h-6 rounded-full bg-gradient-brand text-primary-foreground font-black shadow-glow"
                      : isCurMonth
                      ? "text-ink"
                      : "text-ink-soft/60"
                  }`}
                >
                  {dayNumber}
                </span>

                {/* Quick Add Button on Cell Hover */}
                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickAddEvent(dateStr);
                    }}
                    className="w-5 h-5 rounded-md hover:bg-surface-alt text-ink-soft hover:text-primary-glow flex items-center justify-center transition cursor-pointer"
                    title="Add Event"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Items List (Compact Chips) */}
              <div className="flex-1 overflow-y-auto space-y-1 scrollbar-none">
                {dayItems.slice(0, 3).map((item) => {
                  let themeKey: CalendarColorTheme = item.themeColor || "teal";
                  if (!item.themeColor) {
                    if (item.projectId === "growth" || item.projectId === "recruitment") {
                      themeKey = "blue";
                    } else if (item.projectId === "ops" || item.projectId === "campus") {
                      themeKey = "green";
                    } else {
                      themeKey = "teal";
                    }
                  }
                  const chipTheme = THEME_CHIP_STYLES[themeKey] || THEME_CHIP_STYLES.teal;
                  const isDone = item.status === "done";
                  const isEvent = item.type === "event";

                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleItemDragStart(e, item.id)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveItemId(item.id);
                      }}
                      className={`px-1.5 py-0.5 rounded-md text-[10.5px] font-medium border flex items-center gap-1 cursor-grab active:cursor-grabbing transition shadow-2xs truncate select-none ${
                        chipTheme.bg
                      } ${chipTheme.border} ${chipTheme.text} ${
                        isDone ? "opacity-50 line-through" : ""
                      }`}
                      title={`${item.title}${item.startTime ? ` (${item.startTime})` : ""}`}
                    >
                      {/* Left Dot or Icon */}
                      {isEvent ? (
                        <Video className="w-2.5 h-2.5 shrink-0" />
                      ) : (
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${chipTheme.dot}`} />
                      )}

                      {/* Time if available */}
                      {item.startTime && (
                        <span className="font-mono text-[9.5px] opacity-80 shrink-0">
                          {item.startTime}
                        </span>
                      )}

                      {/* Title */}
                      <span className="truncate">{item.title}</span>
                    </div>
                  );
                })}

                {/* Overflow Badge if > 3 items */}
                {dayItems.length > 3 && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDate(dateStr);
                    }}
                    className="text-[9.5px] font-bold text-ink-soft hover:text-primary-glow px-1 cursor-pointer transition"
                  >
                    +{dayItems.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
