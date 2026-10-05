import { apiClient } from '../../../shared/services/apiClient';

export type SectionType = 'personal' | 'contacts' | 'education' | 'experience' | 'skills';
export type VerificationStatus = 'verified' | 'pending' | 'rejected' | 'unsubmitted';

export interface VerificationDocument {
  _id: string;
  userId: string;
  section: SectionType;
  documentType: string;
  cloudinary: {
    originalName: string;
    cloudinaryPublicId: string;
    cloudinaryUrl: string;
    mimeType: string;
    size: number;
    uploadedAt: string;
  };
  verification: {
    status: VerificationStatus;
    confidence: number;
    reviewedBy?: string;
    reviewedAt?: string;
    reason?: string;
  };
  ai: {
    summary: string;
    issues: string[];
    extractedFields?: Record<string, any>;
  };
  createdAt: string;
}

export interface VerificationResponse {
  documents: VerificationDocument[];
  sections: Record<
    SectionType,
    { status: VerificationStatus; documentsCount: number; lastUploadedAt?: string }
  >;
  stats: {
    verificationPercent: number;
    verifiedCount: number;
    pendingCount: number;
    rejectedCount: number;
    totalDocuments: number;
  };
  timeline: Array<{
    id: string;
    section: SectionType;
    documentType: string;
    originalName: string;
    status: VerificationStatus;
    timestamp: string;
    summary: string;
  }>;
}

export class VerificationService {
  /**
   * Fetch verification status & document list
   */
  static async getVerifications(): Promise<VerificationResponse> {
    const res = await apiClient.get<never, { success: boolean; data: VerificationResponse }>(
      '/profile/verifications'
    );
    return res.data;
  }

  /**
   * Fetch single verification document status by ID
   */
  static async getVerificationById(id: string): Promise<VerificationDocument> {
    const res = await apiClient.get<never, { success: boolean; data: VerificationDocument }>(
      `/profile/verifications/${id}`
    );
    return res.data;
  }

  /**
   * Upload supporting document for verification
   */
  static async uploadDocument(
    file: File,
    section: SectionType,
    documentType: string,
    profileContext?: Record<string, any>
  ): Promise<VerificationDocument> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('section', section);
    formData.append('documentType', documentType);
    if (profileContext) {
      formData.append('profileContext', JSON.stringify(profileContext));
    }

    const res = await apiClient.post<never, { success: boolean; data: VerificationDocument }>(
      '/profile/verifications/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return res.data;
  }

  /**
   * Delete verification document
   */
  static async deleteDocument(id: string): Promise<boolean> {
    await apiClient.delete(`/profile/verifications/${id}`);
    return true;
  }

  /**
   * Admin / manual update status override
   */
  static async updateStatus(
    id: string,
    status: VerificationStatus,
    reason?: string
  ): Promise<VerificationDocument> {
    const res = await apiClient.patch<never, { success: boolean; data: VerificationDocument }>(
      `/profile/verifications/${id}/status`,
      { status, reason }
    );
    return res.data;
  }
}
