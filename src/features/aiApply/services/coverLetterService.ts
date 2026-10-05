import { apiClient } from '@/shared/services/apiClient';
import { AiApplyCoverLetterOption } from '../types';

interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface RawCoverLetter {
  _id: string;
  title: string;
  content: string;
  updatedAt?: string;
}

function mapCoverLetter(raw: RawCoverLetter): AiApplyCoverLetterOption {
  return { id: raw._id, title: raw.title, content: raw.content, updatedAt: raw.updatedAt };
}

export const coverLetterService = {
  async list(): Promise<AiApplyCoverLetterOption[]> {
    try {
      const res = await apiClient.get<never, ApiResponse<{ coverLetters: RawCoverLetter[] }>>('/cover-letters');
      return (res.data.coverLetters || []).map(mapCoverLetter);
    } catch (error) {
      console.warn('coverLetterService.list error (returning empty list):', error);
      return [];
    }
  },

  async create(data: { title: string; content: string }): Promise<AiApplyCoverLetterOption> {
    const res = await apiClient.post<never, ApiResponse<{ coverLetter: RawCoverLetter }>>('/cover-letters', data);
    return mapCoverLetter(res.data.coverLetter);
  },

  async update(id: string, data: { title?: string; content?: string }): Promise<AiApplyCoverLetterOption> {
    const res = await apiClient.patch<never, ApiResponse<{ coverLetter: RawCoverLetter }>>(`/cover-letters/${id}`, data);
    return mapCoverLetter(res.data.coverLetter);
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/cover-letters/${id}`);
  },
};
