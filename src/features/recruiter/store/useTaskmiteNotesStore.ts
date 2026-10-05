import { create } from "zustand";
import { noteService } from "../services/noteService";

export interface TaskmiteNote {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  workspaceName?: string;
  tags?: string[];
  pinned?: boolean;
}

interface TaskmiteNotesState {
  notes: TaskmiteNote[];
  activeNoteId: string | null;
  searchQuery: string;
  isLoading: boolean;
  setSearchQuery: (query: string) => void;
  setActiveNoteId: (id: string | null) => void;
  fetchNotes: (search?: string) => Promise<void>;
  addNote: (title?: string, content?: string) => string;
  updateNote: (id: string, updates: Partial<TaskmiteNote>) => void;
  deleteNote: (id: string) => void;
}

const STORAGE_KEY = "letgetin_taskmite_notes_v2";

const loadInitialNotes = (): TaskmiteNote[] => {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (n) => !["note-1", "note-2", "note-3"].includes(n.id)
        );
      }
    }
  } catch {
    // fallback
  }
  return [];
};

export const useTaskmiteNotesStore = create<TaskmiteNotesState>((set, get) => {
  const initial = loadInitialNotes();
  return {
    notes: initial,
    activeNoteId: initial.length > 0 ? initial[0].id : null,
    searchQuery: "",
    isLoading: false,

  setSearchQuery: (query) => set({ searchQuery: query }),

  setActiveNoteId: (id) => set({ activeNoteId: id }),

  fetchNotes: async (search?: string) => {
    try {
      set({ isLoading: true });
      const serverNotes = await noteService.getNotes(search);
      if (serverNotes && Array.isArray(serverNotes) && serverNotes.length > 0) {
        set((state) => {
          const activeExists = serverNotes.some((n) => n.id === state.activeNoteId);
          const nextActive = activeExists ? state.activeNoteId : serverNotes[0].id;
          if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(serverNotes));
          }
          return { notes: serverNotes, activeNoteId: nextActive, isLoading: false };
        });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },

  addNote: (title = "New note", content = "") => {
    const tempId = `note-${Date.now()}`;
    const newNote: TaskmiteNote = {
      id: tempId,
      title,
      content,
      updatedAt: "Today",
      workspaceName: "Personal Workspace",
      tags: [],
    };

    set((state) => {
      const updated = [newNote, ...state.notes];
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return { notes: updated, activeNoteId: newNote.id };
    });

    // Background server creation
    noteService
      .createNote({ title, content, workspaceName: "Personal Workspace" })
      .then((serverNote) => {
        if (serverNote && serverNote.id) {
          set((state) => {
            const updated = state.notes.map((n) =>
              n.id === tempId ? { ...n, id: serverNote.id } : n
            );
            if (typeof window !== "undefined") {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            }
            return {
              notes: updated,
              activeNoteId:
                state.activeNoteId === tempId ? serverNote.id : state.activeNoteId,
            };
          });
        }
      })
      .catch(() => {
        // Fallback already saved locally
      });

    return newNote.id;
  },

  updateNote: (id, updates) => {
    set((state) => {
      const updated = state.notes.map((note) =>
        note.id === id
          ? {
              ...note,
              ...updates,
              updatedAt: "Today",
            }
          : note
      );
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return { notes: updated };
    });

    // Sync to backend if valid DB ID
    if (!id.startsWith("note-")) {
      noteService.updateNote(id, updates).catch(() => {});
    }
  },

  deleteNote: (id) => {
    set((state) => {
      const updated = state.notes.filter((n) => n.id !== id);
      const nextActive = updated.length > 0 ? updated[0].id : null;
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      }
      return { notes: updated, activeNoteId: nextActive };
    });

    if (!id.startsWith("note-")) {
      noteService.deleteNote(id).catch(() => {});
    }
  },
};
});
