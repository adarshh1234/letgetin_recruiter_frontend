import { apiClient } from '@/shared/services/apiClient';

export type DriveCategory = 'pdf' | 'image' | 'document' | 'archive' | 'audio' | 'video' | 'other';

export interface DriveFile {
  _id: string;
  userId: string;
  originalName: string;
  mimeType: string;
  size: number;
  category: DriveCategory;
  cloudinary: {
    publicId: string;
    url: string;
    secureUrl: string;
    format: string;
    resourceType: string;
  };
  starred: boolean;
  tags: string[];
  description?: string;
  source?: 'drive' | 'profile' | 'resume';
  section?: string;
  documentType?: string;
  verificationStatus?: string;
  resumeId?: string;
  atsScore?: number;
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StorageStats {
  totalLimitBytes: number;
  usedBytes: number;
  remainingBytes: number;
  usedPercentage: number;
  fileCount: number;
  categoryBreakdown: Record<DriveCategory, number>;
  sourcesBreakdown?: {
    drive: number;
    profile: number;
    resume: number;
  };
}

export interface DriveFilesResponse {
  files: DriveFile[];
  stats: StorageStats;
}

export class DriveService {
  /**
   * Fetch user drive files and storage stats
   */
  static async getDriveFiles(params?: {
    search?: string;
    category?: string;
    source?: string;
    starred?: boolean;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<DriveFilesResponse> {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category && params.category !== 'all') query.append('category', params.category);
    if (params?.source && params.source !== 'all') query.append('source', params.source);
    if (params?.starred) query.append('starred', 'true');
    if (params?.sortBy) query.append('sortBy', params.sortBy);
    if (params?.sortOrder) query.append('sortOrder', params.sortOrder);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await apiClient.get<never, { success: boolean; data: DriveFilesResponse }>(
      `/drive${queryString}`
    );
    return res.data;
  }

  /**
   * Upload file to user drive
   */
  static async uploadFile(
    file: File,
    onProgress?: (percent: number) => void
  ): Promise<{ file: DriveFile; stats: StorageStats }> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await apiClient.post<never, { success: boolean; data: { file: DriveFile; stats: StorageStats } }>(
      '/drive/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          }
        },
      }
    );
    return res.data;
  }

  /**
   * Delete file by ID
   */
  static async deleteFile(id: string): Promise<{ deletedId: string; stats: StorageStats }> {
    const res = await apiClient.delete<never, { success: boolean; data: { deletedId: string; stats: StorageStats } }>(
      `/drive/${id}`
    );
    return res.data;
  }

  /**
   * Toggle star status for file
   */
  static async toggleStar(id: string): Promise<DriveFile> {
    const res = await apiClient.patch<never, { success: boolean; data: DriveFile }>(
      `/drive/${id}/star`
    );
    return res.data;
  }

  /**
   * Update file details
   */
  static async updateFile(
    id: string,
    updates: { originalName?: string; description?: string; tags?: string[] }
  ): Promise<DriveFile> {
    const res = await apiClient.patch<never, { success: boolean; data: DriveFile }>(
      `/drive/${id}`,
      updates
    );
    return res.data;
  }
}
