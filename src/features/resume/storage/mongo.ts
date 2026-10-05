import { IStorageProvider } from './types';
import { IResume } from '../types';
import { apiClient } from '../../../shared/services/apiClient';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export class MongoStorage implements IStorageProvider {
  async save(resume: IResume): Promise<IResume> {
    try {
      if (resume.id) {
        // Patch existing resume
        const response = await apiClient.patch<never, ApiResponse<{ resume: IResume }>>(
          `/resumes/${resume.id}`,
          {
            title: resume.title,
            templateId: resume.templateId,
            content: resume.content,
            settings: resume.settings,
          }
        );
        return response?.data?.resume || resume;
      } else {
        // Create new MongoDB resume
        const response = await apiClient.post<never, ApiResponse<{ resume: IResume }>>('/resumes', {
          title: resume.title,
          templateId: resume.templateId,
          content: resume.content,
          settings: resume.settings,
        });
        return response?.data?.resume || resume;
      }
    } catch (error) {
      console.error('MongoStorage save error:', error);
      throw error;
    }
  }

  async load(id: string): Promise<IResume | null> {
    try {
      const response = await apiClient.get<never, ApiResponse<{ resume: IResume }>>(`/resumes/${id}`);
      return response?.data?.resume || null;
    } catch (error) {
      console.error('MongoStorage load error:', error);
      return null;
    }
  }

  async list(): Promise<IResume[]> {
    try {
      const response = await apiClient.get<never, ApiResponse<{ resumes: IResume[] }>>('/resumes');
      return response?.data?.resumes || [];
    } catch (error) {
      console.warn('MongoStorage list error (returning empty list):', error);
      return [];
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await apiClient.delete(`/resumes/${id}`);
    } catch (error) {
      console.error('MongoStorage delete error:', error);
      throw error;
    }
  }

  async setActive(id: string): Promise<IResume> {
    try {
      const response = await apiClient.patch<never, ApiResponse<{ resume: IResume }>>(`/resumes/${id}/active`);
      return response?.data?.resume;
    } catch (error) {
      console.error('MongoStorage setActive error:', error);
      throw error;
    }
  }
}
