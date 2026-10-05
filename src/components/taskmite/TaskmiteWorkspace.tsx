"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Table as TableIcon,
  KanbanSquare,
  SlidersHorizontal,
  Search,
  Bell,
  X,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Settings,
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Clock,
  User,
  GripVertical,
  Check,
  Filter,
  CheckSquare,
  FileText,
} from "lucide-react";
import {
  CalendarItem,
  CalendarStatus,
  DEFAULT_PROJECTS,
  useCalendarStore,
} from "@/features/recruiter/store/useCalendarStore";
import { useRecruiterStore } from "@/features/recruiter/store/useRecruiterStore";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { TaskmiteCreateTaskModal } from "./TaskmiteCreateTaskModal";
import { TaskmiteNotesView } from "./TaskmiteNotesView";
import { useTaskmiteNotesStore } from "@/features/recruiter/store/useTaskmiteNotesStore";

export interface TaskmiteWorkspaceProps {
  title?: string;
  subtitle?: string;
  badgeLabel?: string;
}

const TYPE_CONFIG: Record<
  string,
  { label: string; badgeBg: string; colorDot: string }
> = {
  strategic: {
    label: "Strategic",
    badgeBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30",
    colorDot: "bg-emerald-500",
  },
  operational: {
    label: "Operational",
    badgeBg: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30",
    colorDot: "bg-cyan-500",
  },
  health: {
    label: "Health",
    badgeBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30",
    colorDot: "bg-blue-500",
  },
  home: {
    label: "Home and family",
    badgeBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30",
    colorDot: "bg-purple-500",
  },
  recruitment: {
    label: "Talent & Hiring",
    badgeBg: "bg-primary/15 text-primary-glow border border-primary/30",
    colorDot: "bg-primary",
  },
  campus: {
    label: "Campus Drives",
    badgeBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30",
    colorDot: "bg-amber-500",
  },
  engineering: {
    label: "Product & Tech",
    badgeBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30",
    colorDot: "bg-emerald-500",
  },
  funding: {
    label: "Fundraising",
    badgeBg: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30",
    colorDot: "bg-cyan-500",
  },
};

export function TaskmiteWorkspace({
  title = "Taskmite Workspace & Productivity",
  subtitle = "Sprint task delegation, backlog waiting list, time estimation, and team capacity planning.",
  badgeLabel = "Taskmite",
}: TaskmiteWorkspaceProps) {
  const {
    items,
    toggleItemDone,
    updateItem,
    deleteItem,
    fetchTasks,
  } = useCalendarStore();

  const { user } = useAuthStore();

  useEffect(() => {
    fetchTasks().catch(() => {});
  }, [fetchTasks]);

  // Tools Tab: 'tasks' or 'notes' (Only tasks and notes in Taskmite Tools sub-sidebar)
  const [toolsTab, setToolsTab] = useState<"tasks" | "notes">("tasks");
  const [toolsSidebarOpen, setToolsSidebarOpen] = useState(true);

  // Notes Store
  const { addNote, setSearchQuery: setNotesSearchQuery } = useTaskmiteNotesStore();

  // View state: 'table' or 'kanban'
  const [activeView, setActiveView] = useState<"table" | "kanban">("table");

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [modalDefaultStatus, setModalDefaultStatus] = useState<CalendarStatus>("in_progress");

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false);

  // Collapsible Sections in Table View
  const [openTasksExpanded, setOpenTasksExpanded] = useState(true);
  const [completedTasksExpanded, setCompletedTasksExpanded] = useState(true);

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return items.filter((item) => {
      // Must be a task
      if (item.type !== "task") return false;

      // Filter by type
      if (filterType !== "all" && item.projectId !== filterType) {
        return false;
      }

      // Filter by status
      if (filterStatus !== "all" && item.status !== filterStatus) {
        return false;
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q) || false;
        if (!matchTitle && !matchDesc) return false;
      }

      return true;
    });
  }, [items, filterType, filterStatus, searchQuery]);

  const openTasks = useMemo(
    () => filteredTasks.filter((t) => t.status !== "done"),
    [filteredTasks]
  );

  const completedTasks = useMemo(
    () => filteredTasks.filter((t) => t.status === "done"),
    [filteredTasks]
  );

  const handleOpenCreateModal = (defaultSt: CalendarStatus = "in_progress") => {
    setSelectedItemId(null);
    setModalDefaultStatus(defaultSt);
    setModalOpen(true);
  };

  const handleOpenEditModal = (id: string) => {
    setSelectedItemId(id);
    setModalOpen(true);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDropOnStatus = (e: React.DragEvent, targetStatus: CalendarStatus) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("text/plain");
    if (itemId) {
      updateItem(itemId, { status: targetStatus });
    }
  };

  const getTypeInfo = (item: CalendarItem) => {
    if (item.typeName) {
      const matchKey = Object.keys(TYPE_CONFIG).find(
        (k) => TYPE_CONFIG[k].label.toLowerCase() === item.typeName?.toLowerCase()
      );
      if (matchKey) return TYPE_CONFIG[matchKey];
      return {
        label: item.typeName,
        badgeBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30",
        colorDot: "bg-emerald-500",
      };
    }

    return (
      TYPE_CONFIG[item.projectId] || {
        label: "Strategic",
        badgeBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30",
        colorDot: "bg-emerald-500",
      }
    );
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] lg:h-screen bg-background text-foreground overflow-hidden select-none font-sans">
      {/* ===== 1. TOOLS SUB-SIDEBAR (Only Tasks and Notes as requested) ===== */}
      {toolsSidebarOpen && (
        <aside className="w-44 sm:w-48 bg-surface border-r border-border flex flex-col justify-between shrink-0 z-20 select-none transition-all duration-200">
          <div className="flex flex-col">
            {/* Tools Header */}
            <div className="h-14 px-4 flex items-center border-b border-border">
              <span className="font-bold text-xs text-ink-soft uppercase tracking-wider">
                Tools
              </span>
            </div>

            {/* Tools Nav Menu (Only Tasks & Notes) */}
            <div className="p-3 space-y-1.5">
              <button
                type="button"
                onClick={() => setToolsTab("tasks")}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition cursor-pointer ${
                  toolsTab === "tasks"
                    ? "bg-primary/15 text-primary-glow border border-primary/30 shadow-2xs"
                    : "text-ink-soft hover:text-ink hover:bg-surface-alt border border-transparent"
                }`}
              >
                <CheckSquare className="w-4 h-4" />
                <span>Tasks</span>
              </button>

              <button
                type="button"
                onClick={() => setToolsTab("notes")}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition cursor-pointer ${
                  toolsTab === "notes"
                    ? "bg-primary/15 text-primary-glow border border-primary/30 shadow-2xs"
                    : "text-ink-soft hover:text-ink hover:bg-surface-alt border border-transparent"
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Notes</span>
              </button>
            </div>
          </div>

          {/* Bottom: < Hide tools (Screenshot Reference) */}
          <div className="p-3 border-t border-border">
            <button
              type="button"
              onClick={() => setToolsSidebarOpen(false)}
              className="w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold text-ink-soft hover:text-ink hover:bg-surface-alt flex items-center gap-2 transition cursor-pointer"
              title="Hide tools"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Hide tools</span>
            </button>
          </div>
        </aside>
      )}

      {/* ===== 2. MAIN WORKSPACE CONTAINER ===== */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="h-14 px-4 sm:px-6 bg-surface border-b border-border flex items-center justify-between shrink-0 relative z-30 shadow-2xs">
          {/* Left Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Show tools toggle button when sidebar is collapsed */}
            {!toolsSidebarOpen && (
              <button
                type="button"
                onClick={() => setToolsSidebarOpen(true)}
                className="p-1.5 rounded-xl bg-surface-alt hover:bg-surface border border-border text-ink-soft hover:text-ink transition cursor-pointer mr-1"
                title="Show tools"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {/* "+ Add new" Brand Button */}
            <button
              type="button"
              onClick={() => {
                if (toolsTab === "tasks") {
                  handleOpenCreateModal("in_progress");
                } else {
                  addNote("New note", "");
                }
              }}
              className="px-4 py-1.5 rounded-full bg-gradient-brand hover:opacity-95 text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-glow transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add new</span>
            </button>

            {/* If tasks tab is active: show Table/Kanban toggles & Filter popover */}
            {toolsTab === "tasks" && (
              <>
                {/* View Switcher: Table View vs Kanban Board (Screenshot 2) */}
                <div className="flex items-center bg-surface-alt p-0.5 rounded-full border border-border">
                  <button
                    type="button"
                    onClick={() => setActiveView("table")}
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      activeView === "table"
                        ? "bg-surface text-ink shadow-2xs border border-border/80"
                        : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                    <span>Table view</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveView("kanban")}
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                      activeView === "kanban"
                        ? "bg-surface text-ink shadow-2xs border border-border/80"
                        : "text-ink-soft hover:text-ink"
                    }`}
                  >
                    <KanbanSquare className="w-3.5 h-3.5" />
                    <span>Kanban board</span>
                  </button>
                </div>

                {/* Filter Popover Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setFilterPopoverOpen(!filterPopoverOpen)}
                    className={`w-8 h-8 rounded-full border flex items-center justify-center transition cursor-pointer ${
                      filterType !== "all" || filterStatus !== "all"
                        ? "bg-primary/15 border-primary/30 text-primary-glow"
                        : "bg-surface-alt hover:bg-surface border-border text-ink-soft hover:text-ink shadow-2xs"
                    }`}
                    title="Filter Tasks"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                  </button>

                  {/* Filter Dropdown Popover */}
                  {filterPopoverOpen && (
                    <div className="absolute top-full mt-2 left-0 z-50 w-64 p-3 bg-surface border border-border rounded-2xl shadow-xl space-y-3 animate-in fade-in zoom-in-95 text-xs">
                      <div className="flex items-center justify-between pb-2 border-b border-border">
                        <span className="font-bold text-ink flex items-center gap-1.5">
                          <Filter className="w-3.5 h-3.5 text-primary-glow" />
                          <span>Filter Tasks</span>
                        </span>
                        {(filterType !== "all" || filterStatus !== "all") && (
                          <button
                            type="button"
                            onClick={() => {
                              setFilterType("all");
                              setFilterStatus("all");
                            }}
                            className="text-[10px] font-bold text-primary-glow hover:underline"
                          >
                            Reset
                          </button>
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-ink-soft text-[11px]">Type</label>
                        <select
                          value={filterType}
                          onChange={(e) => setFilterType(e.target.value)}
                          className="w-full px-2 py-1.5 rounded-xl border border-border bg-surface-alt text-ink focus:outline-none"
                        >
                          <option value="all">All Types</option>
                          <option value="strategic">Strategic</option>
                          <option value="operational">Operational</option>
                          <option value="health">Health</option>
                          <option value="home">Home and family</option>
                          <option value="recruitment">Talent & Hiring</option>
                          <option value="campus">Campus Drives</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-ink-soft text-[11px]">Status</label>
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="w-full px-2 py-1.5 rounded-xl border border-border bg-surface-alt text-ink focus:outline-none"
                        >
                          <option value="all">All Statuses</option>
                          <option value="in_progress">In Progress</option>
                          <option value="todo">Scheduled / Todo</option>
                          <option value="done">Completed</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Right Controls: Search, Notifications Bell, User Avatar */}
          <div className="flex items-center gap-2.5">
            {searchOpen ? (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-alt border border-border">
                <Search className="w-3.5 h-3.5 text-ink-soft" />
                <input
                  type="text"
                  placeholder={toolsTab === "tasks" ? "Search tasks..." : "Search notes..."}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    if (toolsTab === "notes") {
                      setNotesSearchQuery(e.target.value);
                    }
                  }}
                  className="bg-transparent text-xs text-ink placeholder:text-ink-soft/60 focus:outline-none w-36 sm:w-48"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                    if (toolsTab === "notes") setNotesSearchQuery("");
                  }}
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

            {/* User Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-brand text-primary-foreground flex items-center justify-center text-xs font-black shadow-glow ring-1 ring-primary/20">
              {user?.fullName?.charAt(0) || "D"}
            </div>
          </div>
        </header>

        {/* ===== 3. BODY CONTENT: TASKS OR NOTES ===== */}
        {toolsTab === "tasks" ? (
          <main className="flex-1 overflow-y-auto bg-background p-4 sm:p-6">
        {activeView === "table" ? (
          <div className="space-y-6 max-w-[1500px] mx-auto">
            {/* --- GROUP 1: OPEN TASKS (Screenshot 2) --- */}
            <div className="rounded-2xl bg-surface border border-border shadow-2xs overflow-hidden">
              {/* Group Header: "v Open tasks (25)" */}
              <button
                type="button"
                onClick={() => setOpenTasksExpanded(!openTasksExpanded)}
                className="w-full px-4 py-3 bg-surface hover:bg-surface-alt/50 border-b border-border flex items-center justify-between text-left transition cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  {openTasksExpanded ? (
                    <ChevronDown className="w-4 h-4 text-ink-soft" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-ink-soft" />
                  )}
                  <span className="text-sm font-bold text-ink">
                    Open tasks
                  </span>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-surface-alt border border-border text-ink-soft">
                    {openTasks.length}
                  </span>
                </div>
              </button>

              {/* Table Body */}
              {openTasksExpanded && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border bg-surface-alt/40 text-ink-soft font-semibold text-[11px]">
                        <th className="py-2.5 px-4 font-bold w-[45%]">Task Title</th>
                        <th className="py-2.5 px-3 font-bold w-[13%]">Status</th>
                        <th className="py-2.5 px-3 font-bold w-[14%]">Type</th>
                        <th className="py-2.5 px-3 font-bold w-[10%]">Due date</th>
                        <th className="py-2.5 px-3 font-bold w-[8%]">Priority</th>
                        <th className="py-2.5 px-3 font-bold w-[10%]">Assignee</th>
                        <th className="py-2.5 px-3 text-right">
                          <Settings className="w-3.5 h-3.5 text-ink-soft inline-block" />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {openTasks.map((task) => {
                        const typeInfo = getTypeInfo(task);

                        return (
                          <tr
                            key={task.id}
                            onClick={() => handleOpenEditModal(task.id)}
                            className="hover:bg-surface-alt/60 transition-colors cursor-pointer group select-none"
                          >
                            {/* Title with checkbox & emoji */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItemDone(task.id);
                                  }}
                                  className="w-4 h-4 rounded-md border border-border bg-surface hover:border-primary flex items-center justify-center transition cursor-pointer text-transparent hover:text-primary"
                                >
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </button>

                                {task.iconEmoji && (
                                  <span className="text-sm shrink-0">
                                    {task.iconEmoji}
                                  </span>
                                )}

                                <span className="font-semibold text-ink truncate group-hover:text-primary-glow transition-colors">
                                  {task.title}
                                </span>

                                {task.subtasks && task.subtasks.length > 0 && (
                                  <span className="text-[10px] text-ink-soft font-mono px-1.5 py-0.2 rounded bg-surface-alt border border-border shrink-0">
                                    {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
                                  </span>
                                )}
                              </div>
                            </td>

                            {/* Status */}
                            <td className="py-3 px-3">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                                <CalendarIcon className="w-3 h-3 text-blue-500" />
                                <span>{task.status === "in_progress" ? "In Progress" : "Scheduled"}</span>
                              </span>
                            </td>

                            {/* Type (Screenshot 2: Strategic, Home and family, Health) */}
                            <td className="py-3 px-3">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${typeInfo.badgeBg}`}
                              >
                                <span className={`w-2 h-2 rounded-full ${typeInfo.colorDot}`} />
                                <span className="truncate">{typeInfo.label}</span>
                              </span>
                            </td>

                            {/* Due date */}
                            <td className="py-3 px-3 text-ink-soft font-mono text-[11px]">
                              {task.dueDate ? task.dueDate : "–"}
                            </td>

                            {/* Priority */}
                            <td className="py-3 px-3 text-ink-soft text-[11px]">
                              {task.priority ? (
                                <span className="capitalize">{task.priority}</span>
                              ) : (
                                "–"
                              )}
                            </td>

                            {/* Assignee */}
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-full bg-gradient-brand flex items-center justify-center text-[10px] text-primary-foreground font-bold shrink-0">
                                  {task.assignee?.name?.charAt(0) || "M"}
                                </div>
                                <span className="text-ink font-medium truncate">
                                  {task.assignee?.name || "Me"}
                                </span>
                              </div>
                            </td>

                            {/* Actions / settings */}
                            <td className="py-3 px-3 text-right">
                              <ChevronRight className="w-3.5 h-3.5 text-ink-soft opacity-0 group-hover:opacity-100 transition inline-block" />
                            </td>
                          </tr>
                        );
                      })}

                      {openTasks.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-ink-soft">
                            No open tasks match the current filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* --- GROUP 2: COMPLETED TASKS --- */}
            {completedTasks.length > 0 && (
              <div className="rounded-2xl bg-surface border border-border shadow-2xs overflow-hidden">
                <button
                  type="button"
                  onClick={() => setCompletedTasksExpanded(!completedTasksExpanded)}
                  className="w-full px-4 py-3 bg-surface hover:bg-surface-alt/50 border-b border-border flex items-center justify-between text-left transition cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2">
                    {completedTasksExpanded ? (
                      <ChevronDown className="w-4 h-4 text-ink-soft" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-ink-soft" />
                    )}
                    <span className="text-sm font-bold text-ink">
                      Completed tasks
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-surface-alt border border-border text-ink-soft">
                      {completedTasks.length}
                    </span>
                  </div>
                </button>

                {completedTasksExpanded && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <tbody className="divide-y divide-border/60">
                        {completedTasks.map((task) => (
                          <tr
                            key={task.id}
                            onClick={() => handleOpenEditModal(task.id)}
                            className="hover:bg-surface-alt/60 transition-colors cursor-pointer group select-none opacity-60"
                          >
                            <td className="py-3 px-4 w-[45%]">
                              <div className="flex items-center gap-2.5">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleItemDone(task.id);
                                  }}
                                  className="w-4 h-4 rounded-md bg-emerald-500 border border-emerald-500 text-white flex items-center justify-center transition cursor-pointer"
                                >
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </button>
                                {task.iconEmoji && (
                                  <span className="text-sm shrink-0">
                                    {task.iconEmoji}
                                  </span>
                                )}
                                <span className="font-semibold text-ink line-through truncate">
                                  {task.title}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-3 w-[13%]">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                <span>Done</span>
                              </span>
                            </td>
                            <td className="py-3 px-3 w-[14%]">
                              <span className="text-ink-soft">{task.typeName || "General"}</span>
                            </td>
                            <td className="py-3 px-3 w-[10%] text-ink-soft font-mono text-[11px]">
                              {task.dueDate || "–"}
                            </td>
                            <td className="py-3 px-3 w-[8%] text-ink-soft text-[11px]">
                              {task.priority || "–"}
                            </td>
                            <td className="py-3 px-3 w-[10%]">
                              <span className="text-ink-soft">{task.assignee?.name || "Me"}</span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <ChevronRight className="w-3.5 h-3.5 text-ink-soft opacity-0 group-hover:opacity-100 transition inline-block" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* --- KANBAN BOARD VIEW --- */
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full min-h-[500px]">
            {[
              { id: "backlog", label: "Backlog / Unscheduled", status: "todo" as CalendarStatus, filterUnscheduled: true },
              { id: "todo", label: "To Do", status: "todo" as CalendarStatus, filterUnscheduled: false },
              { id: "in_progress", label: "In Progress", status: "in_progress" as CalendarStatus, filterUnscheduled: false },
              { id: "done", label: "Completed", status: "done" as CalendarStatus, filterUnscheduled: false },
            ].map((col) => {
              const colTasks = filteredTasks.filter((t) => {
                if (col.filterUnscheduled) {
                  return t.date === null && t.status !== "done";
                }
                if (col.id === "todo") {
                  return t.date !== null && t.status === "todo";
                }
                return t.status === col.status;
              });

              return (
                <div
                  key={col.id}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                  }}
                  onDrop={(e) => handleDropOnStatus(e, col.status)}
                  className="flex flex-col bg-surface border border-border rounded-2xl p-3 shadow-2xs space-y-3"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-ink text-xs">{col.label}</span>
                      <span className="text-[10px] font-extrabold px-2 py-0.2 rounded-full bg-surface-alt border border-border text-ink-soft">
                        {colTasks.length}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleOpenCreateModal(col.status)}
                      className="p-1 rounded-lg hover:bg-surface-alt text-ink-soft hover:text-ink transition cursor-pointer"
                      title="Add Task"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Column Task Cards */}
                  <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[calc(100vh-14rem)] pr-0.5">
                    {colTasks.map((task) => {
                      const typeInfo = getTypeInfo(task);

                      return (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          onClick={() => handleOpenEditModal(task.id)}
                          className="p-3 rounded-xl bg-surface-alt/70 hover:bg-surface border border-border hover:border-primary/40 transition cursor-grab active:cursor-grabbing text-xs space-y-2 group shadow-2xs"
                        >
                          <div className="flex items-start justify-between gap-1.5">
                            <div className="flex items-center gap-1.5 font-semibold text-ink">
                              {task.iconEmoji && <span>{task.iconEmoji}</span>}
                              <span className="truncate">{task.title}</span>
                            </div>
                            <GripVertical className="w-3.5 h-3.5 text-ink-soft/40 opacity-0 group-hover:opacity-100 transition shrink-0" />
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-1">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeInfo.badgeBg}`}>
                              {typeInfo.label}
                            </span>

                            <div className="flex items-center gap-1.5 text-[10px] text-ink-soft">
                              {task.estimatedTime && (
                                <span className="flex items-center gap-0.5 font-mono">
                                  <Clock className="w-2.5 h-2.5" />
                                  <span>{task.estimatedTime}</span>
                                </span>
                              )}
                              <div className="w-4 h-4 rounded-full bg-gradient-brand flex items-center justify-center text-[8px] text-primary-foreground font-bold">
                                {task.assignee?.name?.charAt(0) || "M"}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {colTasks.length === 0 && (
                      <div className="h-28 border border-dashed border-border rounded-xl flex items-center justify-center text-ink-soft/50 text-[11px]">
                        No tasks
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    ) : (
      <TaskmiteNotesView />
    )}
  </div>

  {/* ===== 4. CREATE / EDIT TASK MODAL ===== */}
  <TaskmiteCreateTaskModal
    itemId={selectedItemId}
    isOpen={modalOpen}
    onClose={() => {
      setModalOpen(false);
      setSelectedItemId(null);
    }}
    defaultStatus={modalDefaultStatus}
  />
</div>
);
}
