import { apiClient } from '@/shared/services/apiClient';
import { AiApplyAssistResponse } from '../types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export const aiApplyAiService = {
  async getStatusSuggestion(): Promise<AiApplyAssistResponse> {
    const res = await apiClient.post<never, ApiResponse<AiApplyAssistResponse>>('/ai/ai-apply-assist', {
      action: 'status_suggestion',
    });
    return res.data;
  },

  async getTitleExpansion(seedTitle: string): Promise<AiApplyAssistResponse> {
    const res = await apiClient.post<never, ApiResponse<AiApplyAssistResponse>>('/ai/ai-apply-assist', {
      action: 'title_expansion',
      seedTitle,
    });
    return res.data;
  },
};
