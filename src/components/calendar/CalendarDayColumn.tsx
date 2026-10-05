"use client";

import React, { useState } from "react";
import {
  Check,
  Calendar,
} from "lucide-react";
import {
  CalendarItem,
  useCalendarStore,
} from "@/features/recruiter/store/useCalendarStore";
import { CalendarItemCard } from "./CalendarItemCard";

interface CalendarDayColumnProps {
  dateStr: string; // YYYY-MM-DD
  dayNum: string; // e.g. "9", "10"
  weekdayLabel: string; // e.g. "Wed", "Thu"
  isSelected: boolean;
  onSelectColumn: () => void;
  onQuickAddTask: (dateStr: string) => void;
  onQuickAddEvent: (dateStr: string) => void;
}

export function CalendarDayColumn({
  dateStr,
  dayNum,
  weekdayLabel,
  isSelected,
  onSelectColumn,
  onQuickAddTask,
  onQuickAddEvent,
}: CalendarDayColumnProps) {
  const { items, moveItemDate, hideCompleted, selectedProjectId, selectedPriority, searchQuery } =
    useCalendarStore();

  const [isDragOver, setIsDragOver] = useState(false);

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

  const totalMinutes = dayItems.reduce((acc, item) => acc + (item.durationMinutes || 30), 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  const timeString = `${hours}:${mins < 10 ? `0${mins}` : mins}h`;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const itemId = e.dataTransfer.getData("text/plain");
    if (itemId) {
      moveItemDate(itemId, dateStr);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-1 min-w-[220px] flex flex-col h-full border-r border-border transition-colors select-none ${
        isDragOver ? "bg-primary/5 ring-1 ring-primary/40" : ""
      }`}
    >
      {/* Column Header */}
      <div
        onClick={onSelectColumn}
        className="px-3 pt-2.5 pb-2 flex flex-col cursor-pointer border-b border-border group bg-surface/50 hover:bg-surface transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold text-ink">
            <span className="text-sm sm:text-base font-black">{dayNum}</span>
            <span className="text-xs sm:text-sm font-semibold text-ink-soft">{weekdayLabel}</span>
          </div>

          {totalMinutes > 0 && (
            <span className="text-[11px] font-mono text-ink-soft">
              {timeString}
            </span>
          )}
        </div>

        {/* Active Brand Indicator Underline */}
        <div className="pt-1.5 -mb-2">
          {isSelected ? (
            <div className="h-[2.5px] bg-gradient-brand rounded-full w-full shadow-glow animate-in fade-in duration-200" />
          ) : (
            <div className="h-[2.5px] bg-transparent rounded-full w-full group-hover:bg-border" />
          )}
        </div>
      </div>

      {/* Cards List Area */}
      <div className="flex-1 p-2.5 space-y-2 overflow-y-auto scrollbar-thin">
        {dayItems.map((item) => (
          <CalendarItemCard key={item.id} item={item} />
        ))}

        {dayItems.length === 0 && (
          <div className="h-28 border border-dashed border-border rounded-2xl flex flex-col items-center justify-center text-center p-3 text-ink-soft/60 text-[11px] bg-surface-alt/20">
            <span>No tasks or events</span>
          </div>
        )}

        {/* Circular Action Buttons at bottom of column */}
        <div className="flex items-center justify-center gap-2 pt-2 pb-1">
          <button
            type="button"
            onClick={() => onQuickAddTask(dateStr)}
            className="w-7 h-7 rounded-full border border-border hover:border-primary hover:text-primary-glow text-ink-soft bg-surface hover:bg-surface-alt flex items-center justify-center transition cursor-pointer shadow-2xs"
            title="Quick add task"
          >
            <Check className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => onQuickAddEvent(dateStr)}
            className="w-7 h-7 rounded-full border border-border hover:border-primary hover:text-primary-glow text-ink-soft bg-surface hover:bg-surface-alt flex items-center justify-center transition cursor-pointer shadow-2xs"
            title="Quick add event"
          >
            <Calendar className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
