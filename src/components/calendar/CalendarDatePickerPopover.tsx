"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  format,
  getDaysInMonth,
  startOfMonth,
  getDay,
  isSameDay,
  parseISO,
} from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";

interface CalendarDatePickerPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  anchorDate: string; // YYYY-MM-DD
  onSelectDate: (dateStr: string) => void;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS_OF_WEEK = ["S", "M", "T", "W", "T", "F", "S"];

export function CalendarDatePickerPopover({
  isOpen,
  onClose,
  anchorDate,
  onSelectDate,
}: CalendarDatePickerPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const activeMonthRef = useRef<HTMLButtonElement>(null);

  // Parse anchor date safely (default 2026-09-10)
  const getParsedAnchor = () => {
    try {
      const p = parseISO(anchorDate || "2026-09-10");
      return isNaN(p.getTime()) ? new Date(2026, 8, 10) : p;
    } catch {
      return new Date(2026, 8, 10);
    }
  };

  const [viewDate, setViewDate] = useState<Date>(getParsedAnchor());

  // Always reset viewDate to anchorDate when popover opens
  useEffect(() => {
    if (isOpen) {
      const parsed = getParsedAnchor();
      setViewDate(parsed);
      // Auto-scroll to active month button after modal renders
      setTimeout(() => {
        if (activeMonthRef.current) {
          activeMonthRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
        }
      }, 50);
    }
  }, [isOpen, anchorDate]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const selectedParsed = getParsedAnchor();
  const currentViewYear = viewDate.getFullYear();
  const currentViewMonth = viewDate.getMonth();

  // Days grid calculation
  const startDayOfMonth = getDay(startOfMonth(viewDate)); // 0 = Sun
  const totalDays = getDaysInMonth(viewDate);
  const todayObj = new Date(2026, 8, 10); // Sep 10, 2026

  const handleSelectDay = (dayNum: number) => {
    const newDate = new Date(currentViewYear, currentViewMonth, dayNum);
    onSelectDate(format(newDate, "yyyy-MM-dd"));
    onClose();
  };

  const handlePrevYear = () => {
    setViewDate(new Date(currentViewYear - 1, currentViewMonth, 1));
  };

  const handleNextYear = () => {
    setViewDate(new Date(currentViewYear + 1, currentViewMonth, 1));
  };

  const handleSelectMonth = (monthIndex: number) => {
    setViewDate(new Date(currentViewYear, monthIndex, 1));
  };

  return (
    <div
      ref={popoverRef}
      className="absolute top-full mt-2 left-0 z-50 w-[380px] bg-surface border border-border rounded-2xl shadow-2xl flex overflow-hidden text-xs select-none animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Left Pane: Month Selector with Year Navigator */}
      <div className="w-36 bg-surface-alt/70 border-r border-border flex flex-col">
        {/* Year Navigator at Top */}
        <div className="flex items-center justify-between px-2.5 py-2 border-b border-border/70 bg-surface/50">
          <button
            type="button"
            onClick={handlePrevYear}
            className="p-1 rounded-lg hover:bg-surface text-ink-soft hover:text-ink cursor-pointer transition"
            title="Previous Year"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="font-black text-ink text-xs tracking-tight">
            {currentViewYear}
          </span>
          <button
            type="button"
            onClick={handleNextYear}
            className="p-1 rounded-lg hover:bg-surface text-ink-soft hover:text-ink cursor-pointer transition"
            title="Next Year"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Scrollable Month List */}
        <div className="p-2 flex flex-col gap-1 max-h-[300px] overflow-y-auto scrollbar-thin">
          {MONTH_NAMES.map((monthName, idx) => {
            const isCurrentView = currentViewMonth === idx;

            return (
              <button
                key={idx}
                ref={isCurrentView ? activeMonthRef : undefined}
                type="button"
                onClick={() => handleSelectMonth(idx)}
                className={`px-3 py-1.5 rounded-xl text-left font-medium transition cursor-pointer flex items-center justify-between ${
                  isCurrentView
                    ? "bg-surface text-ink font-bold shadow-2xs border border-border/80"
                    : "text-ink-soft hover:text-ink hover:bg-surface/60"
                }`}
              >
                <span>{isCurrentView ? `${monthName.slice(0, 3)} ${currentViewYear}` : monthName}</span>
                {isCurrentView && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Pane: Day Grid & Footer */}
      <div className="flex-1 p-3.5 flex flex-col bg-surface justify-between">
        <div>
          {/* Days of week */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-ink-soft text-[11px] pb-2 border-b border-border">
            {DAYS_OF_WEEK.map((d, i) => (
              <span key={i}>{d}</span>
            ))}
          </div>

          {/* Calendar days grid */}
          <div className="grid grid-cols-7 gap-1 text-center pt-2 items-center">
            {/* Empty cells before 1st of month */}
            {Array.from({ length: startDayOfMonth }).map((_, i) => (
              <span key={`empty-${i}`} className="w-7 h-7" />
            ))}

            {/* Days 1..N */}
            {Array.from({ length: totalDays }).map((_, i) => {
              const dayNum = i + 1;
              const thisDayDate = new Date(currentViewYear, currentViewMonth, dayNum);
              const isSelected = isSameDay(thisDayDate, selectedParsed);
              const isToday = isSameDay(thisDayDate, todayObj);

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => handleSelectDay(dayNum)}
                  className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center font-medium transition text-xs cursor-pointer ${
                    isSelected
                      ? "bg-gradient-brand text-primary-foreground font-extrabold shadow-glow"
                      : isToday
                      ? "border-2 border-primary text-primary-glow font-bold"
                      : "text-ink hover:bg-surface-alt font-medium"
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer: Jump to Today shortcut */}
        <div className="pt-2.5 mt-2 border-t border-border flex items-center justify-between text-[11px]">
          <button
            type="button"
            onClick={() => {
              onSelectDate("2026-09-10");
              onClose();
            }}
            className="text-primary-glow hover:underline font-bold flex items-center gap-1 cursor-pointer"
          >
            <CalendarIcon className="w-3 h-3" />
            <span>Today (Sep 10)</span>
          </button>

          <span className="text-[10px] text-ink-soft font-mono">
            {format(viewDate, "MMMM yyyy")}
          </span>
        </div>
      </div>
    </div>
  );
}
