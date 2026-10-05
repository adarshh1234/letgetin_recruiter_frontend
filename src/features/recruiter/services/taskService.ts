import { apiClient } from "@/shared/services/apiClient";
import { CalendarItem, CalendarStatus } from "../store/useCalendarStore";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface TaskFilterParams {
  status?: string;
  projectId?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  type?: string;
  isWaitingList?: boolean;
  search?: string;
}

export const taskService = {
  async getTasks(params?: TaskFilterParams): Promise<CalendarItem[]> {
    const res = await apiClient.get<never, ApiResponse<CalendarItem[]>>("/tasks", {
      params,
    });
    return res.data;
  },

  async getTaskById(id: string): Promise<CalendarItem> {
    const res = await apiClient.get<never, ApiResponse<CalendarItem>>(`/tasks/${id}`);
    return res.data;
  },

  async createTask(payload: Partial<CalendarItem>): Promise<CalendarItem> {
    const res = await apiClient.post<never, ApiResponse<CalendarItem>>("/tasks", payload);
    return res.data;
  },

  async updateTask(id: string, updates: Partial<CalendarItem>): Promise<CalendarItem> {
    const res = await apiClient.patch<never, ApiResponse<CalendarItem>>(`/tasks/${id}`, updates);
    return res.data;
  },

  async updateTaskStatus(id: string, status: CalendarStatus): Promise<CalendarItem> {
    const res = await apiClient.patch<never, ApiResponse<CalendarItem>>(`/tasks/${id}/status`, {
      status,
    });
    return res.data;
  },

  async deleteTask(id: string): Promise<void> {
    await apiClient.delete<never, ApiResponse<null>>(`/tasks/${id}`);
  },
};
