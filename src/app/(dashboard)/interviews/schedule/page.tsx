"use client";

import React, { useState, useRef, useEffect } from "react";
import { Plus, X, ChevronDown, Calendar, Settings } from "lucide-react";

interface TaskItem {
  id: string;
  title: string;
  category?: string;
}

interface Column {
  id: string;
  title: string;
  tasks: TaskItem[];
}

const CATEGORY_OPTIONS = [
  { id: "operational", name: "Operational", color: "bg-[#D0E2FF]" },
  { id: "technical", name: "Technical", color: "bg-[#F8D468]" },
  { id: "strategic", name: "Strategic", color: "bg-[#C8F0BE]" },
  { id: "hiring", name: "Hiring", color: "bg-[#FCAAA6]" },
  { id: "financial", name: "Financial", color: "bg-[#D1D5DB]" },
];

export default function InterviewSchedulePage() {
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "new",
      title: "New task",
      tasks: [],
    },
    {
      id: "scheduled",
      title: "Scheduled",
      tasks: [],
    },
    {
      id: "in-progress",
      title: "In Progress",
      tasks: [],
    },
    {
      id: "completed",
      title: "Completed",
      tasks: [],
    },
  ]);

  const [isAddingNewTask, setIsAddingNewTask] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("operational");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Calendar State
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 11, 18)); // Defaults to Dec 18 matching screenshot
  const [selectedDate, setSelectedDate] = useState<number | null>(18);
  const [includeTime, setIncludeTime] = useState(false);
  const [timeValue, setTimeValue] = useState("10:00 AM");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysOfWeek = [
    { name: "Mo", isWeekend: false },
    { name: "Tu", isWeekend: false },
    { name: "We", isWeekend: false },
    { name: "Th", isWeekend: false },
    { name: "Fr", isWeekend: false },
    { name: "Sa", isWeekend: true },
    { name: "Su", isWeekend: true },
  ];

  // Helper for generating days in current month view
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7; // Monday-indexed

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  const handleSaveTask = () => {
    if (!taskName.trim()) {
      setIsAddingNewTask(false);
      return;
    }

    setColumns((prev) =>
      prev.map((col) =>
        col.id === "new"
          ? {
              ...col,
              tasks: [
                ...col.tasks,
                {
                  id: Date.now().toString(),
                  title: taskName.trim(),
                  category: selectedCategory,
                },
              ],
            }
          : col
      )
    );
    setTaskName("");
    setIsAddingNewTask(false);
    setIsDropdownOpen(false);
    setIsCalendarOpen(false);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white text-slate-900 select-none flex flex-col font-sans">
      {/* Top Bar with + button */}
      <div className="py-3 px-6 sm:px-8 flex items-center justify-end">
        <button
          type="button"
          onClick={() => setIsAddingNewTask(true)}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#1b3a5b] hover:bg-[#122840] text-white flex items-center justify-center shadow-sm transition-transform active:scale-95 cursor-pointer"
          title="Add new task"
        >
          <Plus className="w-5 h-5 text-white stroke-[2.5]" />
        </button>
      </div>

      {/* 4-Column Table-style Board Container */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 divide-y-2 md:divide-y-0 md:divide-x-2 divide-slate-300 border-t-2 border-slate-300 min-h-[700px]">
        {columns.map((col) => (
          <div key={col.id} className="flex flex-col min-h-full">
            {/* Column Header */}
            <div className="py-4 px-4 text-center border-b-2 border-slate-300 flex items-center justify-center">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                {col.title}
              </h2>
            </div>

            {/* Column Tasks Content Area */}
            <div className="p-4 sm:p-5 space-y-3.5 flex-1">
              {/* Inline Task Creation Card in "New task" column */}
              {col.id === "new" && isAddingNewTask && (
                <div className="relative bg-[#D6E6F5] rounded-2xl p-4 shadow-sm border border-[#BED7EE] animate-in fade-in zoom-in-98 duration-150">
                  {/* Close button on top-right */}
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingNewTask(false);
                      setTaskName("");
                      setIsDropdownOpen(false);
                    }}
                    className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-[#99B7D4] hover:bg-[#85A6C7] text-slate-700 flex items-center justify-center shadow-xs transition-colors cursor-pointer z-10"
                  >
                    <X className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>

                  {/* Task Name Input */}
                  <div className="mb-6 pt-1">
                    <input
                      type="text"
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveTask();
                        if (e.key === "Escape") {
                          setIsAddingNewTask(false);
                          setTaskName("");
                          setIsDropdownOpen(false);
                        }
                      }}
                      placeholder="Task name"
                      autoFocus
                      className="w-full bg-transparent text-sm sm:text-[15px] font-normal text-slate-800 placeholder:text-slate-600 outline-none"
                    />
                  </div>

                  {/* Bottom Action Row */}
                  <div className="flex items-center justify-between pt-1">
                    {/* Icon Badges */}
                    <div className="flex items-center gap-2">
                      {/* Dropdown / Chevron icon with menu */}
                      <div className="relative" ref={dropdownRef}>
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen((prev) => !prev)}
                          className="w-7 h-7 rounded-full border border-slate-500/60 text-slate-700 flex items-center justify-center hover:bg-white/40 transition-colors cursor-pointer"
                        >
                          <ChevronDown className="w-4 h-4 stroke-[2]" />
                        </button>

                        {/* Dropdown Menu Popup */}
                        {isDropdownOpen && (
                          <div className="absolute left-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                            <div className="space-y-1">
                              {CATEGORY_OPTIONS.map((cat) => (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCategory(cat.id);
                                    setIsDropdownOpen(false);
                                  }}
                                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-sm transition-colors cursor-pointer ${
                                    selectedCategory === cat.id
                                      ? "bg-slate-100/90 text-slate-900 font-medium"
                                      : "text-slate-700 hover:bg-slate-50"
                                  }`}
                                >
                                  <span
                                    className={`w-3.5 h-3.5 rounded-sm ${cat.color} shrink-0`}
                                  />
                                  <span>{cat.name}</span>
                                </button>
                              ))}
                            </div>

                            <div className="my-1.5 border-t border-slate-100" />

                            <button
                              type="button"
                              onClick={() => setIsDropdownOpen(false)}
                              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                            >
                              <Settings className="w-4 h-4 text-slate-600 stroke-[1.8]" />
                              <span>Edit Type</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Calendar icon with working calendar popup */}
                      <div className="relative" ref={calendarRef}>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCalendarOpen((prev) => !prev);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-7 h-7 rounded-full border text-slate-700 flex items-center justify-center hover:bg-white/40 transition-colors cursor-pointer ${
                            selectedDate
                              ? "border-blue-600 bg-white/50 text-blue-700"
                              : "border-slate-500/60"
                          }`}
                          title="Set due date"
                        >
                          <Calendar className="w-3.5 h-3.5 stroke-[2]" />
                        </button>

                        {/* Calendar Popup */}
                        {isCalendarOpen && (
                          <div className="absolute left-0 top-full mt-2 w-[270px] bg-[#D7E7F6] rounded-2xl shadow-xl border border-[#BED7EE] p-4.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                            {/* Month Header */}
                            <div className="flex items-center justify-end mb-4">
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setCurrentDate(
                                      new Date(year, month - 1, 1)
                                    )
                                  }
                                  className="w-5 h-5 rounded-full hover:bg-black/10 flex items-center justify-center text-slate-700 text-xs cursor-pointer"
                                >
                                  ‹
                                </button>
                                <span className="bg-black text-white text-xs font-semibold px-3.5 py-1 rounded-lg shadow-xs">
                                  {monthNames[month]}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setCurrentDate(
                                      new Date(year, month + 1, 1)
                                    )
                                  }
                                  className="w-5 h-5 rounded-full hover:bg-black/10 flex items-center justify-center text-slate-700 text-xs cursor-pointer"
                                >
                                  ›
                                </button>
                              </div>
                            </div>

                            {/* Days of Week Header */}
                            <div className="grid grid-cols-7 text-center gap-1 mb-2">
                              {daysOfWeek.map((day) => (
                                <span
                                  key={day.name}
                                  className={`text-xs font-medium py-0.5 ${
                                    day.isWeekend
                                      ? "text-[#0070F3]"
                                      : "text-slate-700"
                                  }`}
                                >
                                  {day.name}
                                </span>
                              ))}
                            </div>

                            {/* Calendar Days Grid */}
                            <div className="grid grid-cols-7 text-center gap-1 mb-4">
                              {calendarDays.map((day, idx) => {
                                if (day === null) {
                                  return <div key={`empty-${idx}`} className="w-7 h-7" />;
                                }
                                const isSelected = selectedDate === day;
                                return (
                                  <button
                                    key={`day-${day}`}
                                    type="button"
                                    onClick={() => setSelectedDate(day)}
                                    className={`w-7 h-7 mx-auto rounded-lg text-xs font-medium flex items-center justify-center transition-colors cursor-pointer ${
                                      isSelected
                                        ? "bg-black text-white font-bold shadow-2xs"
                                        : "text-slate-700 hover:bg-white/60"
                                    }`}
                                  >
                                    {day}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Time input expandable if toggled */}
                            {includeTime && (
                              <div className="mb-3 px-1">
                                <input
                                  type="time"
                                  value={timeValue}
                                  onChange={(e) => setTimeValue(e.target.value)}
                                  className="w-full bg-white px-2 py-1 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none"
                                />
                              </div>
                            )}

                            {/* Bottom Actions */}
                            <div className="flex items-center justify-between pt-1">
                              <button
                                type="button"
                                onClick={() => setIncludeTime((prev) => !prev)}
                                className="bg-white text-slate-700 text-xs px-3 py-1.5 rounded-lg shadow-2xs hover:bg-slate-50 border border-slate-200/60 font-medium transition-colors cursor-pointer"
                              >
                                {includeTime ? "Remove Time" : "Add Time"}
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedDate(null);
                                  setIsCalendarOpen(false);
                                }}
                                className="bg-white text-slate-700 text-xs px-3 py-1.5 rounded-lg shadow-2xs hover:bg-slate-50 border border-slate-200/60 font-medium transition-colors cursor-pointer"
                              >
                                No Due Date
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Assignee badge */}
                      <div className="w-7 h-7 rounded-full bg-[#2A65C7] text-white flex items-center justify-center text-xs font-bold shadow-2xs">
                        K
                      </div>
                    </div>

                    {/* Save Button */}
                    <button
                      type="button"
                      onClick={handleSaveTask}
                      className="px-5 py-1.5 rounded-xl bg-[#1B3A5B] hover:bg-[#122840] text-white text-xs sm:text-[13px] font-bold shadow-sm transition-colors cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}

              {/* Task Items */}
              {col.tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white border border-slate-200/90 rounded-xl p-3.5 px-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:border-slate-300 transition-all"
                >
                  <p className="text-[13px] font-normal text-slate-700 leading-snug">
                    {task.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
