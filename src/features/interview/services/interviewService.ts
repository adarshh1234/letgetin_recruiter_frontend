import { apiClient } from '@/shared/services/apiClient';
import {
  Interview,
  InterviewStage,
  CreateInterviewInput,
  GenerateAiQuestionsInput,
  EvaluateSessionInput,
  AiQuestion,
  AiScorecard,
} from '../types';

export const interviewService = {
  /**
   * List interviews with optional stage and search filtering
   */
  async getInterviews(params?: { stage?: InterviewStage; date?: string; search?: string }): Promise<Interview[]> {
    const res: any = await apiClient.get('/interviews', { params });
    return res.data || [];
  },

  /**
   * Get an interview by ID
   */
  async getInterviewById(id: string): Promise<Interview> {
    const res: any = await apiClient.get(`/interviews/${id}`);
    return res.data;
  },

  /**
   * Schedule a new interview
   */
  async createInterview(input: CreateInterviewInput): Promise<Interview> {
    const res: any = await apiClient.post('/interviews', input);
    return res.data;
  },

  /**
   * Update interview fields
   */
  async updateInterview(id: string, input: Partial<CreateInterviewInput>): Promise<Interview> {
    const res: any = await apiClient.put(`/interviews/${id}`, input);
    return res.data;
  },

  /**
   * Update interview stage (Kanban drag & drop or select)
   */
  async updateStage(id: string, stage: InterviewStage): Promise<Interview> {
    const res: any = await apiClient.patch(`/interviews/${id}/stage`, { stage });
    return res.data;
  },

  /**
   * Submit interview panel feedback & score
   */
  async submitFeedback(id: string, score: number, feedbackNotes: string): Promise<Interview> {
    const res: any = await apiClient.post(`/interviews/${id}/feedback`, { score, feedbackNotes });
    return res.data;
  },

  /**
   * Delete an interview
   */
  async deleteInterview(id: string): Promise<void> {
    await apiClient.delete(`/interviews/${id}`);
  },

  /**
   * Generate role-specific interview questions via Gemini AI
   */
  async generateAiQuestions(input: GenerateAiQuestionsInput): Promise<AiQuestion[]> {
    const res: any = await apiClient.post('/interviews/ai/questions', input);
    return res.data || [];
  },

  /**
   * Evaluate candidate interview answers via Gemini AI
   */
  async evaluateSession(input: EvaluateSessionInput): Promise<AiScorecard> {
    const res: any = await apiClient.post('/interviews/ai/evaluate', input);
    return res.data;
  },
};
