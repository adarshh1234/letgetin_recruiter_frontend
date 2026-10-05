import { apiClient } from '@/shared/services/apiClient';
import {
  BulkDecisionInput,
  RecordDecisionInput,
  ResumeScreeningCandidateListResponse,
  ResumeScreeningDetail,
  ResumeScreeningFilters,
  ResumeScreeningStats,
} from '../types/resumeScreening.types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const resumeScreeningService = {
  /**
   * Fetch candidate list for resume screening with server-side filters & pagination
   */
  async getCandidates(
    jobId: string,
    filters?: ResumeScreeningFilters
  ): Promise<ResumeScreeningCandidateListResponse> {
    const res = await apiClient.get<never, ApiResponse<ResumeScreeningCandidateListResponse>>(
      `/resume-screening/jobs/${jobId}/candidates`,
      { params: filters }
    );
    return res.data;
  },

  /**
   * Fetch authoritative summary statistics for the recruiter Resume Shortlisting header
   */
  async getStats(jobId: string): Promise<ResumeScreeningStats> {
    const res = await apiClient.get<never, ApiResponse<ResumeScreeningStats>>(
      `/resume-screening/jobs/${jobId}/stats`
    );
    return res.data;
  },

  /**
   * Fetch full candidate detail including parsed resume and AI scorecard for drawer review
   */
  async getApplicationDetail(applicationId: string): Promise<ResumeScreeningDetail> {
    const res = await apiClient.get<never, ApiResponse<ResumeScreeningDetail>>(
      `/resume-screening/applications/${applicationId}`
    );
    return res.data;
  },

  /**
   * Record recruiter decision: 'shortlisted' (advances to qualified pool), 'needs_review', or 'rejected'
   */
  async recordDecision(
    applicationId: string,
    input: RecordDecisionInput
  ): Promise<any> {
    const res = await apiClient.post<never, ApiResponse<any>>(
      `/resume-screening/applications/${applicationId}/decision`,
      input
    );
    return res.data;
  },

  /**
   * Record bulk decisions for multiple candidates at once
   */
  async recordBulkDecision(
    jobId: string,
    input: BulkDecisionInput
  ): Promise<{ updatedCount: number }> {
    const res = await apiClient.post<never, ApiResponse<{ updatedCount: number }>>(
      `/resume-screening/jobs/${jobId}/bulk-decision`,
      input
    );
    return res.data;
  },

  /**
   * Trigger or retry on-demand AI resume evaluation
   */
  async evaluateResume(applicationId: string): Promise<any> {
    const res = await apiClient.post<never, ApiResponse<any>>(
      `/resume-screening/applications/${applicationId}/evaluate`
    );
    return res.data;
  },
};
