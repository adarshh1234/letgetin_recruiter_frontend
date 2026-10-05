import { apiClient } from '@/shared/services/apiClient';
import {
  DomainAssessment,
  AutoConfigureInput,
  AutoConfigureOutput,
  GenerateQuestionsInput,
  AssessmentQuestion,
  AssessmentAttempt,
  AssessmentResultsResponse,
  AttemptEvaluation,
  ChatTurnInput,
  ChatTurnOutput,
  EvaluateChatSessionInput,
  ChatSessionEvaluation,
} from '../types';

export const domainAssessmentService = {
  /**
   * AI Auto-Configure test settings based on Role & Job Description
   */
  async autoConfigure(input: AutoConfigureInput): Promise<AutoConfigureOutput> {
    const res: any = await apiClient.post('/domain-assessments/auto-configure', input);
    return res.data;
  },

  /**
   * AI Question Generation tailored to domain and testing modes
   */
  async generateQuestions(input: GenerateQuestionsInput): Promise<AssessmentQuestion[]> {
    const res: any = await apiClient.post('/domain-assessments/generate-questions', input);
    return res.data || [];
  },

  /**
   * AI Question Generation tailored to specific round types (General Aptitude, Technical Test, Rapid Round, etc.)
   */
  async generateRoundQuestions(input: {
    roundType: string;
    roundName?: string;
    jobTitle?: string;
    skills?: string[];
    difficulty?: string;
    count?: number;
    focusTopic?: string;
    section?: 'mcq' | 'descriptive' | 'rapid';
    questionFormat?: 'mcq' | 'descriptive' | 'rapid' | 'mixed';
    timeLimitSeconds?: number;
    experience?: string;
    jobDescription?: string;
    jobResponsibilities?: string | string[];
  }): Promise<any[]> {
    const res: any = await apiClient.post('/domain-assessments/generate-round-questions', input);
    return res.data || [];
  },

  /**
   * Create a new assessment
   */
  async createAssessment(data: Partial<DomainAssessment>): Promise<DomainAssessment> {
    const res: any = await apiClient.post('/domain-assessments', data);
    return res.data;
  },

  /**
   * List assessments with optional filters
   */
  async getAssessments(params?: {
    status?: string;
    domain?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{ assessments: DomainAssessment[]; total: number; page: number; totalPages: number }> {
    const res: any = await apiClient.get('/domain-assessments', { params });
    return res;
  },

  /**
   * Get single assessment by ID or assessmentId
   */
  async getAssessmentById(id: string): Promise<DomainAssessment> {
    const res: any = await apiClient.get(`/domain-assessments/${id}`);
    return res.data;
  },

  /**
   * Update assessment
   */
  async updateAssessment(id: string, data: Partial<DomainAssessment>): Promise<DomainAssessment> {
    const res: any = await apiClient.put(`/domain-assessments/${id}`, data);
    return res.data;
  },

  /**
   * Delete or archive assessment
   */
  async deleteAssessment(id: string): Promise<boolean> {
    await apiClient.delete(`/domain-assessments/${id}`);
    return true;
  },

  /**
   * Publish assessment (draft -> published)
   */
  async publishAssessment(id: string): Promise<DomainAssessment> {
    const res: any = await apiClient.post(`/domain-assessments/${id}/publish`);
    return res.data;
  },

  /**
   * Archive assessment
   */
  async archiveAssessment(id: string): Promise<DomainAssessment> {
    const res: any = await apiClient.post(`/domain-assessments/${id}/archive`);
    return res.data;
  },

  /**
   * Start a candidate attempt session
   */
  async startAttempt(
    assessmentId: string,
    candidateData: { candidateName: string; candidateEmail: string }
  ): Promise<{ attemptId: string; assessmentId: string; status: string; timeLimitMinutes: number }> {
    const res: any = await apiClient.post(`/domain-assessments/${assessmentId}/attempt`, candidateData);
    return res.data;
  },

  /**
   * Get candidate attempt and sanitized questions
   */
  async getAttempt(attemptId: string): Promise<{ attempt: AssessmentAttempt; assessment: Partial<DomainAssessment> }> {
    const res: any = await apiClient.get(`/domain-assessments/attempts/${attemptId}`);
    return res.data;
  },

  /**
   * Candidate auto-save single answer
   */
  async saveAnswer(
    attemptId: string,
    data: { questionId: string; answer: string; language?: string; timeSpentSeconds?: number }
  ): Promise<boolean> {
    await apiClient.post(`/domain-assessments/attempts/${attemptId}/answer`, data);
    return true;
  },

  /**
   * Submit candidate attempt for evaluation
   */
  async submitAttempt(attemptId: string): Promise<AttemptEvaluation> {
    const res: any = await apiClient.post(`/domain-assessments/attempts/${attemptId}/submit`);
    return res.data;
  },

  /**
   * Candidate get scorecard / attempt result
   */
  async getAttemptResult(attemptId: string): Promise<{ attempt: AssessmentAttempt; assessment: Partial<DomainAssessment> }> {
    const res: any = await apiClient.get(`/domain-assessments/attempts/${attemptId}/result`);
    return res.data;
  },

  /**
   * Recruiter: Get all candidate attempt results for an assessment
   */
  async getAssessmentResults(id: string): Promise<AssessmentResultsResponse> {
    const res: any = await apiClient.get(`/domain-assessments/${id}/results`);
    return res.data;
  },

  /**
   * Candidate / Recruiter: Process turn in AI Chat Assessment
   */
  async chatTurn(input: ChatTurnInput): Promise<ChatTurnOutput> {
    const res: any = await apiClient.post('/domain-assessments/chat-turn', input);
    return res.data;
  },

  /**
   * Candidate / Recruiter: Strictly evaluate full AI Chat Assessment session
   */
  async evaluateChatSession(input: EvaluateChatSessionInput): Promise<ChatSessionEvaluation> {
    const res: any = await apiClient.post('/domain-assessments/evaluate-chat-session', input);
    return res.data;
  },
};
