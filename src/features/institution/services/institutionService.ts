import { apiClient } from "@/shared/services/apiClient";
import {
  AddRecruiterInput,
  BulkUploadResult,
  CreateEventInput,
  CreateStudentInput,
  CreateTaskInput,
  CreateTrainingProgramInput,
  InstitutionEvent,
  InstitutionOverview,
  InstitutionPolicy,
  InstitutionRecruiter,
  InstitutionReports,
  InstitutionStudent,
  InstitutionTask,
  PipelineEntry,
  PlacementEntry,
  TrainingInsightsResponse,
  TrainingProgram,
  UpdatePolicyInput,
  UpdateRecruiterInput,
} from "../types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const institutionService = {
  async getOverview(): Promise<InstitutionOverview> {
    const res = await apiClient.get<never, ApiResponse<InstitutionOverview>>("/institution/overview");
    return res.data;
  },

  async getStudents(): Promise<InstitutionStudent[]> {
    const res = await apiClient.get<never, ApiResponse<InstitutionStudent[]>>("/institution/students");
    return res.data;
  },

  async addStudent(payload: CreateStudentInput): Promise<InstitutionStudent> {
    const res = await apiClient.post<never, ApiResponse<InstitutionStudent>>("/institution/students", payload);
    return res.data;
  },

  async updateStudent(id: string, payload: Partial<CreateStudentInput>): Promise<InstitutionStudent> {
    const res = await apiClient.put<never, ApiResponse<InstitutionStudent>>(`/institution/students/${id}`, payload);
    return res.data;
  },

  async deleteStudent(id: string): Promise<void> {
    await apiClient.delete(`/institution/students/${id}`);
  },

  async bulkUploadStudents(file: File): Promise<BulkUploadResult> {
    const formData = new FormData();
    formData.append("file", file);
    const res = await apiClient.post<never, ApiResponse<BulkUploadResult>>(
      "/institution/students/bulk-upload",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
  },

  async getRecruiters(): Promise<InstitutionRecruiter[]> {
    const res = await apiClient.get<never, ApiResponse<InstitutionRecruiter[]>>("/institution/recruiters");
    return res.data;
  },

  async addRecruiter(payload: AddRecruiterInput): Promise<InstitutionRecruiter> {
    const res = await apiClient.post<never, ApiResponse<InstitutionRecruiter>>("/institution/recruiters", payload);
    return res.data;
  },

  async updateRecruiter(id: string, payload: UpdateRecruiterInput): Promise<InstitutionRecruiter> {
    const res = await apiClient.patch<never, ApiResponse<InstitutionRecruiter>>(`/institution/recruiters/${id}`, payload);
    return res.data;
  },

  async deleteRecruiter(id: string): Promise<void> {
    await apiClient.delete(`/institution/recruiters/${id}`);
  },

  async getPipeline(): Promise<PipelineEntry[]> {
    const res = await apiClient.get<never, ApiResponse<PipelineEntry[]>>("/institution/pipeline");
    return res.data;
  },

  async getPlacements(): Promise<PlacementEntry[]> {
    const res = await apiClient.get<never, ApiResponse<PlacementEntry[]>>("/institution/placements");
    return res.data;
  },

  async getEvents(year?: number, month?: number): Promise<InstitutionEvent[]> {
    const res = await apiClient.get<never, ApiResponse<InstitutionEvent[]>>("/institution/events", {
      params: year && month ? { year, month } : undefined,
    });
    return res.data;
  },

  async addEvent(payload: CreateEventInput): Promise<InstitutionEvent> {
    const res = await apiClient.post<never, ApiResponse<InstitutionEvent>>("/institution/events", payload);
    return res.data;
  },

  async deleteEvent(id: string): Promise<void> {
    await apiClient.delete(`/institution/events/${id}`);
  },

  async getTasks(): Promise<InstitutionTask[]> {
    const res = await apiClient.get<never, ApiResponse<InstitutionTask[]>>("/institution/tasks");
    return res.data;
  },

  async addTask(payload: CreateTaskInput): Promise<InstitutionTask> {
    const res = await apiClient.post<never, ApiResponse<InstitutionTask>>("/institution/tasks", payload);
    return res.data;
  },

  async updateTask(id: string, payload: { done?: boolean; name?: string }): Promise<InstitutionTask> {
    const res = await apiClient.patch<never, ApiResponse<InstitutionTask>>(`/institution/tasks/${id}`, payload);
    return res.data;
  },

  async deleteTask(id: string): Promise<void> {
    await apiClient.delete(`/institution/tasks/${id}`);
  },

  async getReports(): Promise<InstitutionReports> {
    const res = await apiClient.get<never, ApiResponse<InstitutionReports>>("/institution/reports");
    return res.data;
  },

  async getTrainingInsights(): Promise<TrainingInsightsResponse> {
    const res = await apiClient.get<never, ApiResponse<TrainingInsightsResponse>>("/institution/training/insights");
    return res.data;
  },

  async getTrainingPrograms(): Promise<TrainingProgram[]> {
    const res = await apiClient.get<never, ApiResponse<TrainingProgram[]>>("/institution/training/programs");
    return res.data;
  },

  async addTrainingProgram(payload: CreateTrainingProgramInput): Promise<TrainingProgram> {
    const res = await apiClient.post<never, ApiResponse<TrainingProgram>>("/institution/training/programs", payload);
    return res.data;
  },

  async deleteTrainingProgram(id: string): Promise<void> {
    await apiClient.delete(`/institution/training/programs/${id}`);
  },

  async getPolicy(): Promise<InstitutionPolicy> {
    const res = await apiClient.get<never, ApiResponse<InstitutionPolicy>>("/institution/policy");
    return res.data;
  },

  async updatePolicy(payload: UpdatePolicyInput): Promise<InstitutionPolicy> {
    const res = await apiClient.put<never, ApiResponse<InstitutionPolicy>>("/institution/policy", payload);
    return res.data;
  },
};
