"use client";

import React, { useMemo } from "react";
import { Calendar, Clock, Timer, AlertCircle } from "lucide-react";

export interface RoundSchedule {
  date: string;
  startTime: string;
  endTime: string;
}

export interface TimingCalculation {
  minutes: number;
  hours: number;
  formatted: string;
  isValid: boolean;
  error?: string;
}

/**
 * Calculates duration in minutes and hours between start and end times.
 * Formats user-facing duration like "1 hr 30 mins (1.5 hrs)" or "2 hrs".
 */
export function calculateRoundHours(startTime?: string, endTime?: string): TimingCalculation {
  if (!startTime || !endTime) {
    return { minutes: 0, hours: 0, formatted: "", isValid: true };
  }

  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);

  if (isNaN(startH) || isNaN(startM) || isNaN(endH) || isNaN(endM)) {
    return { minutes: 0, hours: 0, formatted: "", isValid: false, error: "Invalid time format" };
  }

  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;
  const diffMinutes = endMinutes - startMinutes;

  if (diffMinutes <= 0) {
    return {
      minutes: 0,
      hours: 0,
      formatted: "",
      isValid: false,
      error: "End time must be after start time",
    };
  }

  const hoursDecimal = Math.round((diffMinutes / 60) * 10) / 10;
  const wholeHours = Math.floor(diffMinutes / 60);
  const remainingMinutes = diffMinutes % 60;

  let formatted = "";
  if (wholeHours > 0 && remainingMinutes > 0) {
    formatted = `${wholeHours} hr${wholeHours > 1 ? "s" : ""} ${remainingMinutes} min${remainingMinutes > 1 ? "s" : ""} (${hoursDecimal} hrs)`;
  } else if (wholeHours > 0) {
    formatted = `${wholeHours} hr${wholeHours > 1 ? "s" : ""}`;
  } else {
    formatted = `${remainingMinutes} mins (${hoursDecimal} hrs)`;
  }

  return {
    minutes: diffMinutes,
    hours: hoursDecimal,
    formatted,
    isValid: true,
  };
}

export interface RoundScheduleSelectorProps {
  label?: string;
  schedule: RoundSchedule;
  onChange: (schedule: RoundSchedule) => void;
  onDurationChange?: (minutes: number, hours: number) => void;
  className?: string;
  description?: string;
}

export function RoundScheduleSelector({
  label = "Round Schedule & Timing",
  schedule,
  onChange,
  onDurationChange,
  className = "",
  description,
}: RoundScheduleSelectorProps) {
  const timing = useMemo(
    () => calculateRoundHours(schedule.startTime, schedule.endTime),
    [schedule.startTime, schedule.endTime]
  );

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);

  const handleTimeChange = (type: "startTime" | "endTime", value: string) => {
    const nextSchedule = { ...schedule, [type]: value };
    onChange(nextSchedule);

    const nextTiming = calculateRoundHours(
      type === "startTime" ? value : schedule.startTime,
      type === "endTime" ? value : schedule.endTime
    );
    if (nextTiming.isValid && nextTiming.minutes > 0 && onDurationChange) {
      onDurationChange(nextTiming.minutes, nextTiming.hours);
    }
  };

  return (
    <div
      className={`p-3.5 rounded-xl bg-surface-alt/40 border border-border/80 space-y-2.5 transition-all ${className}`}
    >
      {/* Header with Title and Live Duration Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-primary-glow" />
          <span className="text-xs font-bold text-ink">{label}</span>
        </div>

        {/* Calculated Hours Badge */}
        {timing.isValid && timing.formatted ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full shadow-xs">
            <Timer className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            Duration: {timing.formatted}
          </span>
        ) : timing.error ? (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3" />
            {timing.error}
          </span>
        ) : (
          <span className="text-[11px] text-ink-soft">
            Select date, start &amp; end time
          </span>
        )}
      </div>

      {description && (
        <p className="text-[11px] text-ink-soft">{description}</p>
      )}

      {/* Inputs: Date, Start Time, End Time */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        <div>
          <label className="text-[11px] font-medium text-ink-soft block mb-1">
            Assessment Date
          </label>
          <input
            type="date"
            min={todayStr}
            value={schedule.date}
            onChange={(e) => onChange({ ...schedule, date: e.target.value })}
            className="input-base text-xs py-1.5 w-full cursor-pointer"
          />
        </div>

        <div>
          <label className="text-[11px] font-medium text-ink-soft block mb-1">
            Start Time
          </label>
          <input
            type="time"
            value={schedule.startTime}
            onChange={(e) => handleTimeChange("startTime", e.target.value)}
            className="input-base text-xs py-1.5 w-full cursor-pointer"
          />
        </div>

        <div>
          <label className="text-[11px] font-medium text-ink-soft block mb-1">
            End Time
          </label>
          <input
            type="time"
            value={schedule.endTime}
            onChange={(e) => handleTimeChange("endTime", e.target.value)}
            className="input-base text-xs py-1.5 w-full cursor-pointer"
          />
        </div>
      </div>

      {/* Calculated Hours Summary Bar */}
      {timing.isValid && timing.hours > 0 && (
        <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-border/50">
          <span className="text-ink-soft flex items-center gap-1">
            <Clock className="w-3 h-3 text-primary-glow" />
            Scheduled Window:
          </span>
          <span className="font-bold text-primary-glow">
            {timing.hours} hr{timing.hours === 1 ? "" : "s"} ({timing.minutes} mins)
          </span>
        </div>
      )}
    </div>
  );
}
