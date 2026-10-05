import { create } from "zustand";
import { taskService, TaskFilterParams } from "../services/taskService";

export type CalendarItemType = "task" | "event";
export type CalendarPriority = "urgent" | "high" | "medium" | "low";
export type CalendarStatus = "todo" | "in_progress" | "done";
export type CalendarColorTheme = "green" | "teal" | "blue" | "slate";

export interface CalendarSubtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface CalendarProject {
  id: string;
  name: string;
  color: string;
  badgeBg: string;
  badgeText: string;
}

export interface CalendarParticipant {
  name: string;
  isMe?: boolean;
  avatar?: string;
}

export interface CalendarItem {
  id: string;
  type: CalendarItemType;
  title: string;
  description?: string;
  date: string | null; // YYYY-MM-DD or null if in Waiting List
  dueDate?: string | null; // YYYY-MM-DD
  startTime?: string; // e.g. "11:00"
  endTime?: string; // e.g. "12:00"
  durationMinutes: number; // e.g. 15, 30, 45, 60, 90
  estimatedTime?: string; // e.g. "0h", "30m", "1h", "2h"
  status: CalendarStatus;
  priority: CalendarPriority;
  projectId: string;
  typeName?: string;
  themeColor?: CalendarColorTheme;
  iconEmoji?: string;
  workspaceName?: string;
  participants?: CalendarParticipant[];
  repeats?: boolean;
  tags?: string[];
  attachments?: { name: string; size: string; url?: string }[];
  isWaitingList?: boolean;
  assignee: {
    name: string;
    avatar?: string;
    role?: string;
  };
  subtasks: CalendarSubtask[];
  meetingLink?: string;
  location?: string;
  createdAt: string;
}

export const DEFAULT_PROJECTS: CalendarProject[] = [
  {
    id: "strategic",
    name: "Strategic",
    color: "#10b981",
    badgeBg: "bg-emerald-500/15 border-emerald-500/30",
    badgeText: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "operational",
    name: "Operational",
    color: "#06b6d4",
    badgeBg: "bg-cyan-500/15 border-cyan-500/30",
    badgeText: "text-cyan-600 dark:text-cyan-400",
  },
  {
    id: "health",
    name: "Health",
    color: "#3b82f6",
    badgeBg: "bg-blue-500/15 border-blue-500/30",
    badgeText: "text-blue-600 dark:text-blue-400",
  },
  {
    id: "home",
    name: "Home and family",
    color: "#8b5cf6",
    badgeBg: "bg-purple-500/15 border-purple-500/30",
    badgeText: "text-purple-600 dark:text-purple-400",
  },
  {
    id: "recruitment",
    name: "Talent & Hiring",
    color: "#3b82f6",
    badgeBg: "bg-blue-500/15 border-blue-500/30",
    badgeText: "text-blue-500",
  },
  {
    id: "campus",
    name: "Campus Drives",
    color: "#8b5cf6",
    badgeBg: "bg-purple-500/15 border-purple-500/30",
    badgeText: "text-purple-500",
  },
  {
    id: "engineering",
    name: "Product & Tech",
    color: "#10b981",
    badgeBg: "bg-emerald-500/15 border-emerald-500/30",
    badgeText: "text-emerald-500",
  },
  {
    id: "growth",
    name: "Growth & Marketing",
    color: "#f59e0b",
    badgeBg: "bg-amber-500/15 border-amber-500/30",
    badgeText: "text-amber-500",
  },
  {
    id: "funding",
    name: "Fundraising & VCs",
    color: "#06b6d4",
    badgeBg: "bg-cyan-500/15 border-cyan-500/30",
    badgeText: "text-cyan-500",
  },
  {
    id: "ops",
    name: "Operations & HR",
    color: "#ec4899",
    badgeBg: "bg-pink-500/15 border-pink-500/30",
    badgeText: "text-pink-500",
  },
];

interface CalendarStore {
  items: CalendarItem[];
  projects: CalendarProject[];
  waitingListOpen: boolean;
  selectedDate: string; // YYYY-MM-DD
  viewMode: "week" | "day" | "month" | "board";
  selectedProjectId: string | "all";
  selectedPriority: string | "all";
  hideCompleted: boolean;
  searchQuery: string;
  activeItemId: string | null;
  toolsTab: "calendar" | "tasks" | "notes";
  toolsSidebarOpen: boolean;

  // Actions
  setWaitingListOpen: (open: boolean) => void;
  toggleWaitingList: () => void;
  setSelectedDate: (date: string) => void;
  setViewMode: (mode: "week" | "day" | "month" | "board") => void;
  setSelectedProjectId: (id: string | "all") => void;
  setSelectedPriority: (p: string | "all") => void;
  setHideCompleted: (hide: boolean) => void;
  setSearchQuery: (query: string) => void;
  setActiveItemId: (id: string | null) => void;
  setToolsTab: (tab: "calendar" | "tasks" | "notes") => void;
  setToolsSidebarOpen: (open: boolean) => void;
  toggleToolsSidebar: () => void;

  // Server Synchronization
  isLoading: boolean;
  fetchTasks: (params?: TaskFilterParams) => Promise<void>;

  // CRUD
  addItem: (item: Omit<CalendarItem, "id" | "createdAt">) => CalendarItem;
  updateItem: (id: string, updates: Partial<CalendarItem>) => void;
  deleteItem: (id: string) => void;
  toggleItemDone: (id: string) => void;
  moveItemDate: (id: string, targetDate: string | null) => void;
  toggleSubtask: (itemId: string, subtaskId: string) => void;
  addSubtask: (itemId: string, title: string) => void;
  deleteSubtask: (itemId: string, subtaskId: string) => void;
}

const STORAGE_KEY = "letgetin_planner_items_v3";

function loadSavedItems(): CalendarItem[] {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (item: CalendarItem) =>
              item &&
              typeof item.id === "string" &&
              !item.id.startsWith("wl-") &&
              !item.id.startsWith("item-wed-") &&
              !item.id.startsWith("item-sat-")
          );
        }
      }
    } catch {}
  }
  return [];
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  items: loadSavedItems(),
  projects: DEFAULT_PROJECTS,
  waitingListOpen: true,
  selectedDate: "2026-09-10",
  viewMode: "week",
  selectedProjectId: "all",
  selectedPriority: "all",
  hideCompleted: false,
  searchQuery: "",
  activeItemId: null,
  toolsTab: "calendar",
  toolsSidebarOpen: true,
  isLoading: false,

  fetchTasks: async (params?: TaskFilterParams) => {
    try {
      set({ isLoading: true });
      const serverTasks = await taskService.getTasks(params);
      if (serverTasks && Array.isArray(serverTasks)) {
        set((state) => {
          const serverIds = new Set(serverTasks.map((t) => t.id));
          const localOnly = state.items.filter(
            (i) => i.id.startsWith("item-") && !serverIds.has(i.id)
          );
          const merged = [...serverTasks, ...localOnly];
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          }
          return { items: merged, isLoading: false };
        });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  setWaitingListOpen: (open) => set({ waitingListOpen: open }),
  toggleWaitingList: () => set((s) => ({ waitingListOpen: !s.waitingListOpen })),
  setSelectedDate: (date) => set({ selectedDate: date }),
  setViewMode: (viewMode) => set({ viewMode }),
  setSelectedProjectId: (selectedProjectId) => set({ selectedProjectId }),
  setSelectedPriority: (selectedPriority) => set({ selectedPriority }),
  setHideCompleted: (hideCompleted) => set({ hideCompleted }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setActiveItemId: (activeItemId) => set({ activeItemId }),
  setToolsTab: (toolsTab) => set({ toolsTab }),
  setToolsSidebarOpen: (toolsSidebarOpen) => set({ toolsSidebarOpen }),
  toggleToolsSidebar: () => set((s) => ({ toolsSidebarOpen: !s.toolsSidebarOpen })),

  addItem: (data) => {
    const tempId = `item-${Date.now()}`;
    const newItem: CalendarItem = {
      ...data,
      id: tempId,
      createdAt: new Date().toISOString(),
    };
    set((state) => {
      const updated = [newItem, ...state.items];
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return { items: updated };
    });

    // Background server creation
    taskService
      .createTask(data)
      .then((serverTask) => {
        if (serverTask && serverTask.id) {
          set((state) => {
            const updated = state.items.map((it) =>
              it.id === tempId ? { ...it, id: serverTask.id } : it
            );
            if (typeof window !== "undefined") {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            }
            return { items: updated };
          });
        }
      })
      .catch(() => {});

    return newItem;
  },

  updateItem: (id, updates) => {
    set((state) => {
      const updated = state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      );
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return { items: updated };
    });

    if (!id.startsWith("item-")) {
      taskService.updateTask(id, updates).catch(() => {});
    }
  },

  deleteItem: (id) => {
    set((state) => {
      const updated = state.items.filter((item) => item.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return { items: updated, activeItemId: state.activeItemId === id ? null : state.activeItemId };
    });

    if (!id.startsWith("item-")) {
      taskService.deleteTask(id).catch(() => {});
    }
  },

  toggleItemDone: (id) => {
    let nextStatus: CalendarStatus = "done";
    set((state) => {
      const updated = state.items.map((item) => {
        if (item.id !== id) return item;
        nextStatus = item.status === "done" ? "todo" : "done";
        return { ...item, status: nextStatus };
      });
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return { items: updated };
    });

    if (!id.startsWith("item-")) {
      taskService.updateTaskStatus(id, nextStatus).catch(() => {});
    }
  },

  moveItemDate: (id, targetDate) => {
    set((state) => {
      const updated = state.items.map((item) =>
        item.id === id ? { ...item, date: targetDate } : item
      );
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return { items: updated };
    });

    if (!id.startsWith("item-")) {
      taskService
        .updateTask(id, {
          date: targetDate,
          isWaitingList: targetDate === null,
        })
        .catch(() => {});
    }
  },

  toggleSubtask: (itemId, subtaskId) => {
    set((state) => {
      const updated = state.items.map((item) => {
        if (item.id !== itemId) return item;
        const subtasks = item.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        return { ...item, subtasks };
      });
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return { items: updated };
    });
  },

  addSubtask: (itemId, title) => {
    if (!title.trim()) return;
    set((state) => {
      const updated = state.items.map((item) => {
        if (item.id !== itemId) return item;
        const newSub: CalendarSubtask = {
          id: `st-${Date.now()}`,
          title: title.trim(),
          completed: false,
        };
        return { ...item, subtasks: [...item.subtasks, newSub] };
      });
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return { items: updated };
    });
  },

  deleteSubtask: (itemId, subtaskId) => {
    set((state) => {
      const updated = state.items.map((item) => {
        if (item.id !== itemId) return item;
        return {
          ...item,
          subtasks: item.subtasks.filter((st) => st.id !== subtaskId),
        };
      });
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return { items: updated };
    });
  },
}));
