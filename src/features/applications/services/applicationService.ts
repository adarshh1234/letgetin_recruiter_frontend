import { apiClient } from '@/shared/services/apiClient';
import { ApplicationsResponse, ApplicationItem, ApplicationStatus, CandidateTrackingResponse } from '../types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const applicationService = {
  async getApplications(params?: {
    page?: number;
    limit?: number;
    status?: string;
    source?: string;
    search?: string;
    sort?: string;
  }): Promise<ApplicationsResponse> {
    const res = await apiClient.get<never, ApiResponse<ApplicationsResponse>>('/applications', {
      params,
    });
    return res.data;
  },

  async getApplicationTracking(applicationId: string): Promise<CandidateTrackingResponse> {
    const res = await apiClient.get<never, ApiResponse<CandidateTrackingResponse>>(
      `/applications/${applicationId}/tracking`
    );
    return res.data;
  },

  async createApplication(payload: {
    jobId: string;
    resumeId?: string;
    coverLetterId?: string;
    notes?: string;
    source?: 'ai_apply' | 'manual';
    status?: ApplicationStatus;
    matchScore?: number;
  }): Promise<ApplicationItem> {
    const res = await apiClient.post<never, ApiResponse<ApplicationItem>>('/applications', payload);
    return res.data;
  },

  async updateStatus(
    applicationId: string,
    status: ApplicationStatus,
    notes?: string
  ): Promise<ApplicationItem> {
    const res = await apiClient.patch<never, ApiResponse<ApplicationItem>>(
      `/applications/${applicationId}/status`,
      { status, notes }
    );
    return res.data;
  },

  async deleteApplication(applicationId: string): Promise<{ success: boolean }> {
    const res = await apiClient.delete<never, ApiResponse<{ success: boolean }>>(
      `/applications/${applicationId}`
    );
    return res.data;
  },
};

