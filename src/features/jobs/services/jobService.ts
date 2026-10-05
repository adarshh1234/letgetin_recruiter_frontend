import { apiClient } from '@/shared/services/apiClient';
import {
  RecommendationResponse,
  JobsListResponse,
  JobFilterParams,
  IJob,
} from '../types/job.types';

// In-flight request deduplication map to prevent simultaneous duplicate HTTP calls
const inFlightRequests = new Map<string, Promise<any>>();

export const jobService = {
  /**
   * Fetches personalized AI-recommended jobs for the current authenticated user.
   * Deduplicates concurrent in-flight requests.
   */
  async getRecommendations(params: JobFilterParams = {}): Promise<RecommendationResponse['data']> {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.workplaceType && params.workplaceType !== 'all') queryParams.append('workplaceType', params.workplaceType);
    if (params.employmentType && params.employmentType !== 'all') queryParams.append('employmentType', params.employmentType);
    if (params.experienceLevel && params.experienceLevel !== 'all') queryParams.append('experienceLevel', params.experienceLevel);
    if (params.country) queryParams.append('country', params.country);
    if (params.minScore) queryParams.append('minScore', params.minScore.toString());
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.sort) queryParams.append('sort', params.sort);

    const url = `/jobs/recommendations?${queryParams.toString()}`;

    if (inFlightRequests.has(url)) {
      return inFlightRequests.get(url)!;
    }

    const requestPromise = (async () => {
      try {
        const response = (await apiClient.get(url)) as any;
        if (response && response.data) {
          return response.data;
        }
        return response;
      } finally {
        inFlightRequests.delete(url);
      }
    })();

    inFlightRequests.set(url, requestPromise);
    return requestPromise;
  },

  /**
   * Browse all jobs with search and filters.
   * Deduplicates concurrent in-flight requests.
   */
  async getJobs(params: JobFilterParams = {}): Promise<JobsListResponse['data']> {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.workplaceType && params.workplaceType !== 'all') queryParams.append('workplaceType', params.workplaceType);
    if (params.employmentType && params.employmentType !== 'all') queryParams.append('employmentType', params.employmentType);
    if (params.experienceLevel && params.experienceLevel !== 'all') queryParams.append('experienceLevel', params.experienceLevel);
    if (params.country) queryParams.append('country', params.country);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const url = `/jobs?${queryParams.toString()}`;

    if (inFlightRequests.has(url)) {
      return inFlightRequests.get(url)!;
    }

    const requestPromise = (async () => {
      try {
        const response = (await apiClient.get(url)) as any;
        if (response && response.data) {
          return response.data;
        }
        return response;
      } finally {
        inFlightRequests.delete(url);
      }
    })();

    inFlightRequests.set(url, requestPromise);
    return requestPromise;
  },

  /**
   * Get single job details
   */
  async getJobById(jobId: string): Promise<IJob> {
    const response = (await apiClient.get(`/jobs/${jobId}`)) as unknown as { success: boolean; data: IJob };
    return response.data;
  },

  /**
   * Force sync candidate profile with latest resume
   */
  async syncProfile(): Promise<void> {
    await apiClient.post('/jobs/sync-profile', {});
  },
};
