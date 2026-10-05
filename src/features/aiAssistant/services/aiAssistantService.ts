import { apiClient } from '@/shared/services/apiClient';
import { AssistantContextType, AssistantMode, AssistantContextPayload, AssistantResponseData } from '../types';

export interface AssistantChatRequestBody {
  message: string;
  context: AssistantContextType;
  mode: AssistantMode;
  contextPayload?: AssistantContextPayload;
  conversationHistory?: Array<{ sender: string; text: string }>;
}

export const aiAssistantService = {
  async chat(body: AssistantChatRequestBody): Promise<AssistantResponseData> {
    const res = await apiClient.post<never, { success: boolean; data: AssistantResponseData }>('/ai/assistant', {
      ...body,
      stream: false,
    });
    return res.data;
  },
};
