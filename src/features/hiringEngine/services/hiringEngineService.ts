import { apiClient } from '@/shared/services/apiClient';
import {
  IHiringFunnelConfig,
  IFunnelMetricsReport,
  StageCandidatesResponse,
  ICandidateStageHistory,
  AdvanceCandidatePayload,
  FailCandidatePayload,
  RefillStagePayload,
  HiringEngineCandidate,
  IFinalShortlistResponse,
  RecordFinalDecisionPayload,
  FinalDecision,
} from '../types/hiringEngine.types';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

export const hiringEngineService = {
  /**
   * GET /api/recruiter/jobs/:jobId/hiring-engine/config
   * Retrieves the current pipeline configuration and stage definitions.
   */
  async getPipelineConfig(jobId: string): Promise<IHiringFunnelConfig> {
    const res = await apiClient.get<never, ApiResponse<IHiringFunnelConfig>>(
      `/recruiter/jobs/${jobId}/hiring-engine/config`
    );
    return res.data;
  },

  /**
   * GET /api/recruiter/jobs/:jobId/hiring-engine/funnel-metrics
   * Retrieves real-time funnel health, target vs active candidates, deficit, and stage breakdowns.
   */
  async getFunnelMetrics(jobId: string): Promise<IFunnelMetricsReport> {
    const res = await apiClient.get<never, ApiResponse<IFunnelMetricsReport>>(
      `/recruiter/jobs/${jobId}/hiring-engine/funnel-metrics`
    );
    return res.data;
  },

  /**
   * GET /api/recruiter/jobs/:jobId/hiring-engine/stages/:stageId
   * Retrieves full details and custom questions for a stage.
   */
  async getStageDetails(jobId: string, stageId: string): Promise<any> {
    const res = await apiClient.get<never, ApiResponse<any>>(
      `/recruiter/jobs/${jobId}/hiring-engine/stages/${stageId}`
    );
    return res.data;
  },

  /**
   * PUT /api/recruiter/jobs/:jobId/hiring-engine/stages/:stageId
   * Updates stage rules, duration, passing score, questions, and mark configured.
   */
  async updateStageConfig(
    jobId: string,
    stageId: string,
    payload: {
      stageName?: string;
      durationMinutes?: number;
      passingScore?: number;
      questionCount?: number;
      deadlineHours?: number;
      autoAdvanceScoreThreshold?: number;
      schedule?: any;
      customQuestions?: any[];
      config?: Record<string, unknown>;
    }
  ): Promise<{ success: boolean; stage: any }> {
    const res = await apiClient.put<never, ApiResponse<{ success: boolean; stage: any }>>(
      `/recruiter/jobs/${jobId}/hiring-engine/stages/${stageId}`,
      payload
    );
    return res.data;
  },

  /**
   * GET /api/recruiter/jobs/:jobId/hiring-engine/stages/:stageId/candidates
   * Lists primary and reserve candidates for a specific stage.
   */
  async getStageCandidates(jobId: string, stageId: string): Promise<StageCandidatesResponse> {
    const res = await apiClient.get<never, ApiResponse<StageCandidatesResponse>>(
      `/recruiter/jobs/${jobId}/hiring-engine/stages/${stageId}/candidates`
    );
    return res.data;
  },

  /**
   * GET /api/recruiter/jobs/:jobId/hiring-engine/candidates/:applicationId/history
   * Retrieves the immutable audit log for a candidate's stage transitions.
   */
  async getCandidateHistory(jobId: string, applicationId: string): Promise<ICandidateStageHistory[]> {
    const res = await apiClient.get<never, ApiResponse<ICandidateStageHistory[]>>(
      `/recruiter/jobs/${jobId}/hiring-engine/candidates/${applicationId}/history`
    );
    return res.data;
  },

  /**
   * POST /api/recruiter/jobs/:jobId/hiring-engine/candidates/:applicationId/advance
   * Advances a candidate to the next stage or final shortlist.
   */
  async advanceCandidate(
    jobId: string,
    applicationId: string,
    payload?: AdvanceCandidatePayload
  ): Promise<{ application: HiringEngineCandidate; nextStageId: string | null; isFinalShortlist: boolean }> {
    const res = await apiClient.post<
      never,
      ApiResponse<{ application: HiringEngineCandidate; nextStageId: string | null; isFinalShortlist: boolean }>
    >(`/recruiter/jobs/${jobId}/hiring-engine/candidates/${applicationId}/advance`, payload || {});
    return res.data;
  },

  /**
   * POST /api/recruiter/jobs/:jobId/hiring-engine/candidates/:applicationId/fail
   * Marks candidate as failed and triggers dynamic refill from reserves if deficit exists.
   */
  async failCandidate(
    jobId: string,
    applicationId: string,
    payload?: FailCandidatePayload
  ): Promise<{
    application: HiringEngineCandidate;
    promotedCount: number;
    promotedCandidates: HiringEngineCandidate[];
    message?: string;
  }> {
    const res = await apiClient.post<
      never,
      ApiResponse<{
        application: HiringEngineCandidate;
        promotedCount: number;
        promotedCandidates: HiringEngineCandidate[];
      }>
    >(`/recruiter/jobs/${jobId}/hiring-engine/candidates/${applicationId}/fail`, payload || {});
    return {
      ...res.data,
      message: res.message,
    };
  },

  /**
   * POST /api/recruiter/jobs/:jobId/hiring-engine/stages/:stageId/refill
   * Manually pulls from reserve candidates into primary pool.
   */
  async refillStage(
    jobId: string,
    stageId: string,
    payload?: RefillStagePayload
  ): Promise<{
    promotedCount: number;
    promotedCandidates: HiringEngineCandidate[];
    message?: string;
  }> {
    const res = await apiClient.post<
      never,
      ApiResponse<{
        promotedCount: number;
        promotedCandidates: HiringEngineCandidate[];
      }>
    >(`/recruiter/jobs/${jobId}/hiring-engine/stages/${stageId}/refill`, payload || {});
    return {
      ...res.data,
      message: res.message,
    };
  },

  /**
   * POST /api/recruiter/jobs/:jobId/hiring-engine/config
   * Initializes or reconfigures the hiring funnel.
   */
  async configurePipeline(
    jobId: string,
    payload: {
      finalShortlistTarget: number;
      stages: Array<{
        stageId: string;
        stageName: string;
        stageType: string;
        order: number;
        expectedAttendanceRate: number;
        expectedPassRate: number;
        deadlineHours?: number;
        autoAdvanceScoreThreshold?: number;
      }>;
    }
  ): Promise<{ config: IHiringFunnelConfig; initialMetrics: IFunnelMetricsReport }> {
    const res = await apiClient.post<
      never,
      ApiResponse<{ config: IHiringFunnelConfig; initialMetrics: IFunnelMetricsReport }>
    >(`/recruiter/jobs/${jobId}/hiring-engine/config`, payload);
    return res.data;
  },

  /**
   * GET /api/recruiter/jobs/:jobId/hiring-engine/final-shortlist
   * Retrieves all verified finalists who completed the final configured stage, with stage scores and decision state.
   */
  async getFinalShortlist(jobId: string): Promise<IFinalShortlistResponse> {
    const res = await apiClient.get<never, ApiResponse<IFinalShortlistResponse>>(
      `/recruiter/jobs/${jobId}/hiring-engine/final-shortlist`
    );
    return res.data;
  },

  /**
   * POST /api/recruiter/jobs/:jobId/hiring-engine/final-shortlist/:applicationId/decision
   * Records a recruiter decision on a finalist: 'offered' | 'on_hold' | 'rejected'.
   */
  async recordFinalDecision(
    jobId: string,
    applicationId: string,
    payload: RecordFinalDecisionPayload
  ): Promise<{
    application: any;
    decision: FinalDecision;
    status: string;
    offeredAt?: string;
    hiredAt?: string;
  }> {
    const res = await apiClient.post<
      never,
      ApiResponse<{
        application: any;
        decision: FinalDecision;
        status: string;
        offeredAt?: string;
        hiredAt?: string;
      }>
    >(`/recruiter/jobs/${jobId}/hiring-engine/final-shortlist/${applicationId}/decision`, payload);
    return res.data;
  },

  /**
   * POST /api/recruiter/jobs/:jobId/hiring-engine/stages/:stageId/upload-questions
   * Uploads an Excel (.xlsx/.xls), CSV (.csv), JSON, PDF, or Word document to parse into questions.
   */
  async uploadStageQuestions(
    jobId: string,
    stageId: string,
    file: File
  ): Promise<{
    success: boolean;
    totalQuestions: number;
    questions: any[];
    filename: string;
    format: string;
  }> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await apiClient.post<
      never,
      ApiResponse<{
        totalQuestions: number;
        questions: any[];
        filename: string;
        format: string;
      }>
    >(`/recruiter/jobs/${jobId}/hiring-engine/stages/${stageId}/upload-questions`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      ...res.data,
    };
  },

  /**
   * GET /api/recruiter/jobs/:jobId/hiring-engine/sample-question-template?format=excel|csv
   * Downloads a sample question bank template.
   */
  async downloadSampleTemplate(jobId: string, format: 'excel' | 'csv' = 'excel'): Promise<Blob> {
    const res = await apiClient.get<never, Blob>(
      `/recruiter/jobs/${jobId}/hiring-engine/sample-question-template?format=${format}`,
      { responseType: 'blob' as any }
    );
    return res;
  },
};
