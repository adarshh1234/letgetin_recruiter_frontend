import { apiClient } from "@/shared/services/apiClient";
import { TailoringSession, TailoringSuggestion, TailoringSuggestionStatus } from "../types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export type SuggestionUpdatePayload = {
  id: string;
  status: TailoringSuggestionStatus;
  proposedText?: string;
} & Partial<Pick<TailoringSuggestion, "section" | "itemId" | "changeType" | "originalText" | "reason" | "relatedKeywords">>;

export const tailoringService = {
  async createSession(resumeId: string, jobDescription: string): Promise<TailoringSession> {
    const res = await apiClient.post<never, ApiResponse<{ session: TailoringSession }>>("/tailoring/sessions", {
      resumeId,
      jobDescription,
    });
    return res.data.session;
  },

  async getSession(id: string): Promise<TailoringSession> {
    const res = await apiClient.get<never, ApiResponse<{ session: TailoringSession }>>(`/tailoring/sessions/${id}`);
    return res.data.session;
  },

  async getActiveSessionForResume(resumeId: string): Promise<TailoringSession | null> {
    try {
      const res = await apiClient.get<never, ApiResponse<{ session: TailoringSession | null }>>(
        `/tailoring/sessions/active?resumeId=${encodeURIComponent(resumeId)}`
      );
      return res.data.session;
    } catch {
      return null;
    }
  },

  async updateSuggestions(sessionId: string, updates: SuggestionUpdatePayload[]): Promise<TailoringSession> {
    const res = await apiClient.patch<never, ApiResponse<{ session: TailoringSession }>>(`/tailoring/sessions/${sessionId}`, {
      suggestions: updates,
    });
    return res.data.session;
  },

  async finalizeSession(sessionId: string, title?: string): Promise<{ resumeId: string; isNew: boolean }> {
    const res = await apiClient.post<never, ApiResponse<{ resumeId: string; isNew: boolean }>>(
      `/tailoring/sessions/${sessionId}/finalize`,
      { title }
    );
    return res.data;
  },

  async discardSession(sessionId: string): Promise<void> {
    await apiClient.delete(`/tailoring/sessions/${sessionId}`);
  },
};
