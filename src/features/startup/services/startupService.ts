import { apiClient } from '@/shared/services/apiClient';
import {
  FundraisingSummary,
  Investor,
  InvestorDeal,
  StartupProfileResponse,
  RoundConfig,
  DealActivity,
} from '../types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
  page?: number;
  totalPages?: number;
}

export const startupService = {
  /**
   * Fetch startup company information & fundraising round profile
   */
  async getFundraisingProfile(): Promise<StartupProfileResponse> {
    const res = await apiClient.get<never, ApiResponse<StartupProfileResponse>>('/startup/fundraising');
    return res.data;
  },

  /**
   * Update startup company information & fundraising round profile
   */
  async updateFundraisingProfile(payload: {
    name?: string;
    website?: string;
    industry?: string;
    sector?: string;
    description?: string;
    location?: string;
    founded?: string;
    employees?: string;
    founders?: string;
    fundraisingProfile?: Partial<RoundConfig>;
  }): Promise<StartupProfileResponse> {
    const res = await apiClient.patch<never, ApiResponse<StartupProfileResponse>>('/startup/fundraising', payload);
    return res.data;
  },

  /**
   * Fetch live fundraising metrics & KPI statistics
   */
  async getFundraisingSummary(): Promise<FundraisingSummary> {
    const res = await apiClient.get<never, ApiResponse<FundraisingSummary>>('/startup/fundraising/summary');
    return res.data;
  },

  /**
   * Search and filter verified investor directory with explainable match scores
   */
  async listInvestors(params: {
    search?: string;
    type?: string;
    sector?: string;
    stage?: string;
    page?: number;
    limit?: number;
  } = {}): Promise<{ investors: Investor[]; total: number; page: number; totalPages: number }> {
    const res = await apiClient.get<never, ApiResponse<Investor[]>>('/startup/investors', { params });
    return {
      investors: res.data || [],
      total: res.total || 0,
      page: res.page || 1,
      totalPages: res.totalPages || 1,
    };
  },

  /**
   * Fetch single investor details with deep-dive thesis and match report
   */
  async getInvestorById(id: string): Promise<Investor> {
    const res = await apiClient.get<never, ApiResponse<Investor>>(`/startup/investors/${id}`);
    return res.data;
  },

  /**
   * Fetch all pipeline deals for the founder's active round
   */
  async listPipelineDeals(): Promise<InvestorDeal[]> {
    const res = await apiClient.get<never, ApiResponse<InvestorDeal[]>>('/startup/pipeline');
    return res.data || [];
  },

  /**
   * Add an investor to the fundraising pipeline
   */
  async createPipelineDeal(payload: {
    investorId?: string;
    fundName: string;
    fundLogoText?: string;
    tier?: string;
    leadPartner?: string;
    partnerRole?: string;
    partnerEmail?: string;
    linkedinUrl?: string;
    stage?: string;
    checkSize?: number;
    checkSizeText?: string;
    focusTags?: string[];
    notes?: string;
    recentDeal?: string;
  }): Promise<InvestorDeal> {
    const res = await apiClient.post<never, ApiResponse<InvestorDeal>>('/startup/pipeline', payload);
    return res.data;
  },

  /**
   * Update deal stage (drag-and-drop), check size, probability, or notes
   */
  async updatePipelineDeal(dealId: string, updates: Partial<InvestorDeal>): Promise<InvestorDeal> {
    const res = await apiClient.patch<never, ApiResponse<InvestorDeal>>(`/startup/pipeline/${dealId}`, updates);
    return res.data;
  },

  /**
   * Delete or archive a deal from the pipeline
   */
  async deletePipelineDeal(dealId: string): Promise<{ success: boolean }> {
    const res = await apiClient.delete<never, ApiResponse<{ success: boolean }>>(`/startup/pipeline/${dealId}`);
    return res.data;
  },

  /**
   * Add a manual founder note or touchpoint to a deal's activity timeline
   */
  async addDealActivity(
    dealId: string,
    activity: { type: 'note' | 'email' | 'meeting' | 'call' | 'data_room'; note: string }
  ): Promise<InvestorDeal> {
    const res = await apiClient.post<never, ApiResponse<InvestorDeal>>(
      `/startup/pipeline/${dealId}/activity`,
      activity
    );
    return res.data;
  },

  /**
   * Generate hyper-personalized cold pitch email using Gemini AI
   */
  async generateAIPersonalizedPitch(payload: {
    investorId?: string;
    dealId?: string;
    investorName?: string;
    investorFirm?: string;
    partnerName?: string;
    tone?: 'executive' | 'conversational' | 'data_driven';
  }): Promise<{ subject: string; emailBody: string; talkingPoints: string[] }> {
    const res = await apiClient.post<never, ApiResponse<{ subject: string; emailBody: string; talkingPoints: string[] }>>(
      '/startup/ai/personalized-pitch',
      payload
    );
    return res.data;
  },
};
