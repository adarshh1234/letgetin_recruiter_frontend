import { create } from "zustand";
import { IResumeContent } from "@/features/resume/types";
import { useResumeStore } from "@/features/resume/store/useResumeStore";
import { tailoringService } from "../services/tailoringService";
import { TailoringSession, TailoringSuggestion, TailoringSuggestionStatus } from "../types";
import { applyAcceptedSuggestions } from "../utils/applySuggestions";

interface TailorResumeState {
  session: TailoringSession | null;
  originalContent: IResumeContent | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
    showChanges: boolean;
  setShowChanges: (value: boolean) => void;
  
  loadOrCreateSession: (resumeId: string, jobDescription: string) => Promise<void>;
  loadExistingSession: (sessionId: string) => Promise<void>;
  setSuggestionStatus: (suggestionId: string, status: TailoringSuggestionStatus, proposedText?: string) => Promise<void>;
  addChatSuggestion: (suggestion: Omit<TailoringSuggestion, "id" | "status">) => Promise<void>;
  finalize: () => Promise<{ resumeId: string; isNew: boolean } | null>;
  discard: () => Promise<void>;
  reset: () => void;
}

function applyWorkingPreview(originalContent: IResumeContent, suggestions: TailoringSuggestion[]) {
  const { resume, setResume } = useResumeStore.getState();
  const workingContent = applyAcceptedSuggestions(originalContent, suggestions);
  setResume({ ...resume, content: workingContent });
}

export const useTailorResumeStore = create<TailorResumeState>((set, get) => ({
  session: null,
  originalContent: null,
  isLoading: false,
  isSaving: false,
  error: null,

    showChanges: false,

  setShowChanges: (value) => set({ showChanges: value }),

  loadOrCreateSession: async (resumeId: string, jobDescription: string) => {
    // Every fresh entry into the Tailor Resume flow (JD -> resume selection -> analysis)
    // always starts a brand new session - it must never resume a prior abandoned journey's
    // JD/suggestions/state. Resuming an in-progress session across a refresh is handled
    // separately by loadExistingSession, which is only reached via an explicit ?tailor=
    // session id already present in the URL for the current journey.
    set({ isLoading: true, error: null });
    try {
      const session = await tailoringService.createSession(resumeId, jobDescription);
      const { resume } = useResumeStore.getState();
      useResumeStore.getState().setTailorModeActive(true);
      set({ session, originalContent: resume.content, isLoading: false });
      applyWorkingPreview(resume.content, session.suggestions);
    } catch (err) {
      const apiError = err as { error?: { message?: string }; message?: string };
      set({
        isLoading: false,
        error: apiError?.error?.message || apiError?.message || "Failed to analyze resume against this job description.",
      });
    }
  },

  loadExistingSession: async (sessionId: string) => {
    set({ isLoading: true, error: null });
    try {
      const session = await tailoringService.getSession(sessionId);
      const { resume } = useResumeStore.getState();
      useResumeStore.getState().setTailorModeActive(true);
      set({ session, originalContent: resume.content, isLoading: false });
      applyWorkingPreview(resume.content, session.suggestions);
    } catch (err) {
      const apiError = err as { error?: { message?: string }; message?: string };
      set({
        isLoading: false,
        error: apiError?.error?.message || apiError?.message || "Failed to load tailoring session.",
      });
    }
  },

  setSuggestionStatus: async (suggestionId, status, proposedText) => {
    const { session, originalContent } = get();
    if (!session || !originalContent) return;

    const updatedSuggestions = session.suggestions.map((s) =>
      s.id === suggestionId ? { ...s, status, proposedText: proposedText ?? s.proposedText } : s
    );
    set({ session: { ...session, suggestions: updatedSuggestions } });
    applyWorkingPreview(originalContent, updatedSuggestions);

    try {
      await tailoringService.updateSuggestions(session._id, [{ id: suggestionId, status, proposedText }]);
    } catch (err) {
      console.warn("Failed to persist suggestion status:", err);
    }
  },

  addChatSuggestion: async (suggestion) => {
    const { session, originalContent } = get();
    if (!session || !originalContent) return;

    const newSuggestion: TailoringSuggestion = {
      ...suggestion,
      id: `chat-sug-${Date.now()}`,
      status: "accepted",
    };
    const updatedSuggestions = [newSuggestion, ...session.suggestions];
    set({ session: { ...session, suggestions: updatedSuggestions } });
    applyWorkingPreview(originalContent, updatedSuggestions);

    try {
      await tailoringService.updateSuggestions(session._id, [
        {
          id: newSuggestion.id,
          status: newSuggestion.status,
          proposedText: newSuggestion.proposedText,
          section: newSuggestion.section,
          itemId: newSuggestion.itemId,
          changeType: newSuggestion.changeType,
          originalText: newSuggestion.originalText,
          reason: newSuggestion.reason,
          relatedKeywords: newSuggestion.relatedKeywords,
        },
      ]);
    } catch (err) {
      console.warn("Failed to persist chat-sourced suggestion:", err);
    }
  },

  finalize: async () => {
    const { session } = get();
    if (!session) return null;
    set({ isSaving: true, error: null });
    try {
      // If the candidate renamed the resume while tailoring (e.g. via the editor's title
      // field), that's treated as "save as a new resume" - the backend compares this against
      // the original resume's stored title to decide whether to create a new one.
      const currentTitle = useResumeStore.getState().resume.title;
      const result = await tailoringService.finalizeSession(session._id, currentTitle);
      useResumeStore.getState().setTailorModeActive(false);
      await useResumeStore.getState().loadResume(result.resumeId);
      set({ isSaving: false, session: null, originalContent: null });
      return result;
    } catch (err) {
      const apiError = err as { error?: { message?: string }; message?: string };
      set({
        isSaving: false,
        error: apiError?.error?.message || apiError?.message || "Failed to save tailored resume.",
      });
      return null;
    }
  },

  discard: async () => {
    const { session } = get();
    useResumeStore.getState().setTailorModeActive(false);
    if (session) {
      const resumeId = session.sourceResumeId;
      try {
        await tailoringService.discardSession(session._id);
      } catch (err) {
        console.warn("Failed to discard tailoring session:", err);
      }
      // Reload from the server to discard any locally-staged accepted-but-unsaved preview.
      await useResumeStore.getState().loadResume(resumeId);
    }
    set({ session: null, originalContent: null, error: null });
  },

  reset: () => set({ 
       session: null,
    originalContent: null,
    isLoading: false,
    isSaving: false,
    error: null,
    showChanges: false,
   }),
}));
