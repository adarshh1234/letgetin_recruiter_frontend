import { apiClient } from '@/shared/services/apiClient';
import {
  AiApplyPreferences,
  AiApplySuggestions,
  ApplyForJobsResult,
  MatchedJobsResponse,
  AiApplyBatchSession,
  StartBatchApplyResponse,
} from '../types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const aiApplyService = {
  async getPreferences(): Promise<{ preferences: AiApplyPreferences | null; aiSuggestions: AiApplySuggestions }> {
    const res = await apiClient.get<never, ApiResponse<{ preferences: AiApplyPreferences | null; aiSuggestions: AiApplySuggestions }>>(
      '/ai-apply/preferences'
    );
    return res.data;
  },

  async savePreferences(data: Partial<AiApplyPreferences>): Promise<AiApplyPreferences> {
    const res = await apiClient.put<never, ApiResponse<{ preferences: AiApplyPreferences }>>(
      '/ai-apply/preferences',
      data
    );
    return res.data.preferences;
  },

  async getMatchedJobs(params?: {
    minScore?: number;
    limit?: number;
    page?: number;
    search?: string;
  }): Promise<MatchedJobsResponse> {
    const res = await apiClient.get<never, ApiResponse<MatchedJobsResponse>>('/ai-apply/matches', {
      params,
    });
    return res.data;
  },

  async startBatchApply(params: {
    jobIds?: string[];
    limit?: number;
    batchSize?: number;
  }): Promise<StartBatchApplyResponse> {
    const res = await apiClient.post<never, ApiResponse<StartBatchApplyResponse>>('/ai-apply/batch/start', params);
    return res.data;
  },

  async getBatchStatus(sessionId: string): Promise<AiApplyBatchSession> {
    const res = await apiClient.get<never, ApiResponse<AiApplyBatchSession>>(`/ai-apply/batch/status/${sessionId}`);
    return res.data;
  },

  async getActiveBatchSession(): Promise<AiApplyBatchSession | null> {
    const res = await apiClient.get<never, ApiResponse<AiApplyBatchSession | null>>('/ai-apply/batch/active');
    return res.data;
  },

  async pauseBatchApply(sessionId: string): Promise<AiApplyBatchSession> {
    const res = await apiClient.post<never, ApiResponse<AiApplyBatchSession>>(`/ai-apply/batch/pause/${sessionId}`);
    return res.data;
  },

  async resumeBatchApply(sessionId: string): Promise<AiApplyBatchSession> {
    const res = await apiClient.post<never, ApiResponse<AiApplyBatchSession>>(`/ai-apply/batch/resume/${sessionId}`);
    return res.data;
  },

  async cancelBatchApply(sessionId: string): Promise<AiApplyBatchSession> {
    const res = await apiClient.post<never, ApiResponse<AiApplyBatchSession>>(`/ai-apply/batch/cancel/${sessionId}`);
    return res.data;
  },

  async applyForJobs(): Promise<ApplyForJobsResult> {
    const res = await apiClient.post<never, ApiResponse<ApplyForJobsResult>>('/ai-apply/apply', {});
    return res.data;
  },
};
