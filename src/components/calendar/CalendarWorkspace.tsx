"use client";

import React, { useState, useEffect } from "react";
import {
  format,
  addDays,
  subDays,
  startOfWeek,
  parseISO,
  addMonths,
  subMonths,
} from "date-fns";
import { CalendarDayColumn } from "./CalendarDayColumn";
import { CalendarMonthView } from "./CalendarMonthView";
import { CalendarItemModal } from "./CalendarItemModal";
import { CalendarDatePickerPopover } from "./CalendarDatePickerPopover";
import { CalendarWaitingList } from "./CalendarWaitingList";
import {
  CalendarItem,
  useCalendarStore,
} from "@/features/recruiter/store/useCalendarStore";
import { useRecruiterStore } from "@/features/recruiter/store/useRecruiterStore";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  Bell,
  X,
  Calendar as CalendarIcon,
} from "lucide-react";

export interface CalendarWorkspaceProps {
  title?: string;
  subtitle?: string;
  badgeLabel?: string;
  defaultView?: "week" | "day" | "month" | "board";
  moduleContext?: "company" | "startup" | "institution";
}

export function CalendarWorkspace({
  title,
  subtitle,
  badgeLabel,
  defaultView,
  moduleContext,
}: CalendarWorkspaceProps = {}) {
  const {
    items,
    selectedDate,
    setSelectedDate,
    viewMode,
    setViewMode,
    activeItemId,
    setActiveItemId,
    searchQuery,
    setSearchQuery,
    fetchTasks,
  } = useCalendarStore();

  useEffect(() => {
    fetchTasks().catch(() => {});
  }, [fetchTasks]);

  const { orgProfile } = useRecruiterStore();
  const { user } = useAuthStore();
  const activeEntity = moduleContext || orgProfile?.entity || "company";

  // Create Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"task" | "event">("event");
  const [modalDate, setModalDate] = useState<string>("2026-09-10");

  // Date picker popover state
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  // Search input visible state
  const [searchOpen, setSearchOpen] = useState(false);

  // Current anchor date calculation
  const currentAnchor = parseISO(selectedDate || format(new Date(), "yyyy-MM-dd"));
  const isMonthMode = viewMode === "month";
  const isWeekMode = viewMode === "week";
  const weekStart = startOfWeek(currentAnchor, { weekStartsOn: 1 }); // Monday
  const displayDays = isWeekMode
    ? Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)) // 7 days Mon - Sun
    : Array.from({ length: 4 }, (_, i) => addDays(currentAnchor, i)); // 4 rolling days starting from current anchor

  const monthYearLabel = format(currentAnchor, "MMMM yyyy");

  const handlePrevDays = () => {
    if (isMonthMode) {
      const prev = subMonths(currentAnchor, 1);
      setSelectedDate(format(prev, "yyyy-MM-dd"));
    } else {
      const shift = isWeekMode ? 7 : 1;
      const prev = subDays(currentAnchor, shift);
      setSelectedDate(format(prev, "yyyy-MM-dd"));
    }
  };

  const handleNextDays = () => {
    if (isMonthMode) {
      const next = addMonths(currentAnchor, 1);
      setSelectedDate(format(next, "yyyy-MM-dd"));
    } else {
      const shift = isWeekMode ? 7 : 1;
      const next = addDays(currentAnchor, shift);
      setSelectedDate(format(next, "yyyy-MM-dd"));
    }
  };

  const handleQuickAdd = (type: "task" | "event", dateStr?: string) => {
    setActiveItemId(null);
    setModalType(type);
    setModalDate(dateStr || selectedDate);
    setModalOpen(true);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] lg:h-screen bg-background text-foreground overflow-hidden select-none font-sans">
      {/* ===== 1. TOP HEADER BAR (+ Add new, Today v, Search, Bell, Avatar) ===== */}
      <header className="h-14 px-4 sm:px-6 bg-surface border-b border-border flex items-center justify-between shrink-0 relative z-30 shadow-2xs">
        {/* Left Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* "+ Add new" Brand Gradient Pill Button */}
          <button
            type="button"
            onClick={() => handleQuickAdd("event")}
            className="px-4 py-1.5 rounded-full bg-gradient-brand hover:opacity-95 text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-glow transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add new</span>
          </button>

          {/* "Today ∨" Dropdown Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDatePickerOpen(!datePickerOpen)}
              className="px-3.5 py-1.5 rounded-full bg-surface-alt hover:bg-surface border border-border text-xs font-bold text-ink flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <span>Today</span>
              {datePickerOpen ? (
                <ChevronUp className="w-3.5 h-3.5 text-ink-soft" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-ink-soft" />
              )}
            </button>

            {/* Dual-Pane Month & Day Grid Popover */}
            <CalendarDatePickerPopover
              isOpen={datePickerOpen}
              onClose={() => setDatePickerOpen(false)}
              anchorDate={selectedDate}
              onSelectDate={(newDate) => setSelectedDate(newDate)}
            />
          </div>
        </div>

        {/* Right Controls: Search, Notifications Bell, User Avatar */}
        <div className="flex items-center gap-2.5">
          {searchOpen ? (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-alt border border-border">
              <Search className="w-3.5 h-3.5 text-ink-soft" />
              <input
                type="text"
                placeholder="Search tasks & events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-ink placeholder:text-ink-soft/60 focus:outline-none w-36 sm:w-48"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-ink-soft hover:text-ink"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="w-8 h-8 rounded-full bg-surface-alt hover:bg-surface border border-border text-ink-soft hover:text-ink flex items-center justify-center transition cursor-pointer shadow-2xs"
              title="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            className="w-8 h-8 rounded-full bg-surface-alt hover:bg-surface border border-border text-ink-soft hover:text-ink flex items-center justify-center transition cursor-pointer relative shadow-2xs"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
          </button>

          {/* Avatar matching LetGetIn branding */}
          <div className="w-8 h-8 rounded-full bg-gradient-brand text-primary-foreground flex items-center justify-center text-xs font-black shadow-glow ring-1 ring-primary/20">
            {user?.fullName?.charAt(0) || "D"}
          </div>
        </div>
      </header>

      {/* ===== 2. MAIN PLANNER WORKSPACE (Waiting List + Day Columns) ===== */}
      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Backlog / Waiting List */}
        <CalendarWaitingList />

        {/* Day Columns Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
          {/* Date Strip Header: Month/Year, Navigation, Today Jump, and View Mode */}
          <div className="px-4 py-2 bg-surface/70 backdrop-blur-xs border-b border-border flex items-center justify-between shrink-0 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-ink min-w-[100px]">
                {monthYearLabel}
              </span>

              <button
                type="button"
                onClick={handlePrevDays}
                className="p-1 rounded-lg hover:bg-surface-alt text-ink-soft hover:text-ink transition cursor-pointer"
                title={isWeekMode ? "Previous week" : "Previous day"}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNextDays}
                className="p-1 rounded-lg hover:bg-surface-alt text-ink-soft hover:text-ink transition cursor-pointer"
                title={isWeekMode ? "Next week" : "Next day"}
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setSelectedDate(format(new Date(), "yyyy-MM-dd"))}
                className="px-2 py-0.5 text-[11px] font-semibold rounded-md border border-border bg-surface hover:bg-surface-alt text-ink-soft hover:text-ink transition cursor-pointer"
              >
                Today
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* View Mode Toggle: Month (Normal Calendar) vs Week (7D) vs 4-Day */}
              <div className="flex items-center p-0.5 rounded-lg bg-surface-alt border border-border text-[11px]">
                <button
                  type="button"
                  onClick={() => setViewMode("month")}
                  className={`px-2.5 py-0.5 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
                    isMonthMode
                      ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                      : "text-ink-soft hover:text-ink font-medium"
                  }`}
                  title="Normal Calendar (Month Grid)"
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>Month</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("week")}
                  className={`px-2.5 py-0.5 rounded-md transition cursor-pointer ${
                    isWeekMode
                      ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                      : "text-ink-soft hover:text-ink font-medium"
                  }`}
                >
                  Week (7D)
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("day")}
                  className={`px-2.5 py-0.5 rounded-md transition cursor-pointer ${
                    viewMode === "day"
                      ? "bg-primary text-primary-foreground font-bold shadow-2xs"
                      : "text-ink-soft hover:text-ink font-medium"
                  }`}
                >
                  4-Day
                </button>
              </div>
            </div>
          </div>

          {/* Main Planner Content: Month Grid View OR Day Columns Grid */}
          {isMonthMode ? (
            <CalendarMonthView
              anchorDate={currentAnchor}
              onSelectDate={(dt) => setSelectedDate(dt)}
              onQuickAddTask={(dt) => handleQuickAdd("task", dt)}
              onQuickAddEvent={(dt) => handleQuickAdd("event", dt)}
            />
          ) : (
            <main className="flex-1 flex overflow-x-auto overflow-y-hidden bg-background">
              {displayDays.map((d) => {
                const dateStr = format(d, "yyyy-MM-dd");
                const dayNum = format(d, "d");
                const weekdayLabel = format(d, "EEE");
                const isSelected = selectedDate === dateStr;

                return (
                  <CalendarDayColumn
                    key={dateStr}
                    dateStr={dateStr}
                    dayNum={dayNum}
                    weekdayLabel={weekdayLabel}
                    isSelected={isSelected}
                    onSelectColumn={() => setSelectedDate(dateStr)}
                    onQuickAddTask={(dt) => handleQuickAdd("task", dt)}
                    onQuickAddEvent={(dt) => handleQuickAdd("event", dt)}
                  />
                );
              })}
            </main>
          )}
        </div>
      </div>

      {/* ===== 3. CREATE / EDIT EVENT & TASK MODAL ===== */}
      <CalendarItemModal
        itemId={activeItemId}
        isOpen={modalOpen || activeItemId !== null}
        onClose={() => {
          setModalOpen(false);
          setActiveItemId(null);
        }}
        defaultDate={modalDate}
        defaultType={modalType}
      />
    </div>
  );
}
