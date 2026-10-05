import { DemoModalSubmission } from '../types/landing.types';

export interface SubmissionResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    mode: string;
    timestamp: string;
  };
}

export const leadService = {
  /**
   * Submit a lead capture / demo access request
   */
  async submitDemoRequest(payload: DemoModalSubmission): Promise<SubmissionResponse> {
    // Isolated service layer for production CRM / webhook integration
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: 'Access granted. Skill verification credentials dispatched.',
          data: {
            email: payload.email,
            mode: payload.mode,
            timestamp: new Date().toISOString()
          }
        });
      }, 600);
    });
  }
};
