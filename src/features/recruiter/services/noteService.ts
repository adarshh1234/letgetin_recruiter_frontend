import { apiClient } from "@/shared/services/apiClient";
import { TaskmiteNote } from "../store/useTaskmiteNotesStore";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const noteService = {
  async getNotes(search?: string): Promise<TaskmiteNote[]> {
    const res = await apiClient.get<never, ApiResponse<TaskmiteNote[]>>("/notes", {
      params: search ? { search } : undefined,
    });
    return res.data;
  },

  async getNoteById(id: string): Promise<TaskmiteNote> {
    const res = await apiClient.get<never, ApiResponse<TaskmiteNote>>(`/notes/${id}`);
    return res.data;
  },

  async createNote(payload: Partial<TaskmiteNote>): Promise<TaskmiteNote> {
    const res = await apiClient.post<never, ApiResponse<TaskmiteNote>>("/notes", payload);
    return res.data;
  },

  async updateNote(id: string, updates: Partial<TaskmiteNote>): Promise<TaskmiteNote> {
    const res = await apiClient.patch<never, ApiResponse<TaskmiteNote>>(`/notes/${id}`, updates);
    return res.data;
  },

  async deleteNote(id: string): Promise<void> {
    await apiClient.delete<never, ApiResponse<null>>(`/notes/${id}`);
  },
};
