import { apiClient } from '@/shared/services/apiClient';
import {
  AllApplicant,
  Applicant,
  CollectionStatusReport,
  CreateJobInput,
  CreditPack,
  EmploymentType,
  EntityType,
  GeneratedJobContent,
  MatchVolumeOption,
  OrgAutofillFields,
  OrgFormMeta,
  OrgProfile,
  PipelineSubOptionsCatalog,
  RecruiterJob,
  RecruiterJobStage,
  RecruiterOverview,
  SourcedCandidate,
  WorkplaceType,
} from '../types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const recruiterService = {
  async getOrgFormMeta(entity: EntityType): Promise<OrgFormMeta> {
    const res = await apiClient.get<never, ApiResponse<{ meta: OrgFormMeta }>>('/recruiter/org-meta', {
      params: { entity },
    });
    return res.data.meta;
  },

  async getOrgProfile(): Promise<OrgProfile | null> {
    const res = await apiClient.get<never, ApiResponse<{ profile: OrgProfile | null }>>('/recruiter/org');
    return res.data.profile;
  },

  async saveOrgProfile(payload: Omit<OrgProfile, '_id' | 'ownerUserId' | 'createdAt' | 'updatedAt'>): Promise<OrgProfile> {
    const res = await apiClient.put<never, ApiResponse<{ profile: OrgProfile }>>('/recruiter/org', payload);
    return res.data.profile;
  },

  async autofillOrgProfile(url: string, entity: EntityType): Promise<OrgAutofillFields> {
    const res = await apiClient.post<never, ApiResponse<{ fields: OrgAutofillFields; sourceUrl: string }>>(
      '/recruiter/org/autofill',
      { url, entity }
    );
    return res.data.fields;
  },

  async createJob(payload: CreateJobInput): Promise<RecruiterJob> {
    const res = await apiClient.post<never, ApiResponse<RecruiterJob>>('/jobs', payload);
    return res.data;
  },

  async generateJobContent(payload: {
    title: string;
    employmentType?: EmploymentType;
    workplaceType?: WorkplaceType;
    location?: string;
  }): Promise<GeneratedJobContent | null> {
    const res = await apiClient.post<never, ApiResponse<{ content: GeneratedJobContent | null }>>(
      '/jobs/ai-assist/generate',
      payload
    );
    return res.data.content;
  },

  async getMyJobs(): Promise<RecruiterJob[]> {
    const res = await apiClient.get<never, ApiResponse<RecruiterJob[]>>('/jobs/mine');
    return res.data;
  },

  async getMyJobById(jobId: string): Promise<RecruiterJob> {
    const res = await apiClient.get<never, ApiResponse<RecruiterJob>>(`/jobs/mine/${jobId}`);
    return res.data;
  },

  async deleteJob(jobId: string): Promise<void> {
    await apiClient.delete(`/jobs/mine/${jobId}`);
  },

  async updateJobStage(jobId: string, stage: RecruiterJobStage): Promise<RecruiterJob> {
    const res = await apiClient.patch<never, ApiResponse<RecruiterJob>>(`/jobs/${jobId}/stage`, { stage });
    return res.data;
  },

  async getApplicantsForJob(jobId: string): Promise<Applicant[]> {
    const res = await apiClient.get<never, ApiResponse<Applicant[]>>(`/applications/job/${jobId}`);
    return res.data;
  },

  async updateApplicantStatus(applicationId: string, status: string, notes?: string): Promise<Applicant> {
    const res = await apiClient.patch<never, ApiResponse<Applicant>>(`/applications/${applicationId}/recruiter-status`, {
      status,
      notes,
    });
    return res.data;
  },

  async getAllApplicants(): Promise<AllApplicant[]> {
    const res = await apiClient.get<never, ApiResponse<AllApplicant[]>>('/applications/recruiter/all');
    return res.data;
  },

  async getCredits(): Promise<{
    balance: number;
    packs: CreditPack[];
    pipelineSubOptions: PipelineSubOptionsCatalog;
    subOptionCost: number;
    matchVolumeOptions: MatchVolumeOption[];
  }> {
    const res = await apiClient.get<
      never,
      ApiResponse<{
        balance: number;
        packs: CreditPack[];
        pipelineSubOptions: PipelineSubOptionsCatalog;
        subOptionCost: number;
        matchVolumeOptions: MatchVolumeOption[];
      }>
    >('/recruiter/credits');
    return res.data;
  },

  async purchaseCredits(packId: string): Promise<{ balance: number }> {
    const res = await apiClient.post<never, ApiResponse<{ balance: number }>>('/recruiter/credits/purchase', { packId });
    return res.data;
  },

  async revealContact(candidateUserId: string): Promise<{ email?: string; phone?: string; balance: number }> {
    const res = await apiClient.post<never, ApiResponse<{ email?: string; phone?: string; balance: number }>>(
      `/recruiter/candidates/${candidateUserId}/reveal-contact`
    );
    return res.data;
  },

  async searchCandidates(params: { jobId?: string; query?: string }): Promise<SourcedCandidate[]> {
    const res = await apiClient.get<never, ApiResponse<SourcedCandidate[]>>('/recruiter/candidates/search', {
      params,
    });
    return res.data;
  },

  async getOverview(): Promise<RecruiterOverview> {
    const res = await apiClient.get<never, ApiResponse<RecruiterOverview>>('/recruiter/overview');
    return res.data;
  },

  async getApplicationCollection(jobId: string): Promise<CollectionStatusReport> {
    const res = await apiClient.get<never, ApiResponse<CollectionStatusReport>>(
      `/recruiter/jobs/${jobId}/application-collection`
    );
    return res.data;
  },

  async startApplicationCollection(jobId: string): Promise<{ started: boolean; alreadyStarted: boolean }> {
    const res = await apiClient.post<never, ApiResponse<{ started: boolean; alreadyStarted: boolean }>>(
      `/recruiter/jobs/${jobId}/application-collection/start`
    );
    return res.data;
  },

  async extendApplicationCollection(
    jobId: string,
    days?: number
  ): Promise<{ extended: boolean; newDeadline: string; extensionsUsed: number; maxExtensions: number }> {
    const res = await apiClient.post<
      never,
      ApiResponse<{ extended: boolean; newDeadline: string; extensionsUsed: number; maxExtensions: number }>
    >(`/recruiter/jobs/${jobId}/application-collection/extend`, { days });
    return res.data;
  },
};
