import { apiClient } from '../../../shared/services/apiClient';

export type Track = 'fresher' | 'experienced';
export type Mode = 'resume' | 'manual';

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  startYear: string;
  endYear: string;
  certificateUrl?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  title: string;
  start: string;
  end: string;
  highlights: string;
}

export interface ProfileData {
  track: Track | null;
  mode: Mode | null;
  resumeName: string | null;
  contact: {
    fullName: string;
    phone: string;
    city: string;
    country: string;
    linkedin: string;
    email?: string;
    alternateEmail?: string;
    resumeEmail?: string;
    alternateEmailVerified?: boolean;
    resumeEmailVerified?: boolean;
    streetAddress?: string;
    state?: string;
    postalCode?: string;
  };
  personal: {
    firstName: string;
    lastName: string;
    headline: string;
    dob: string;
    bio: string;
  };
  education: {
    institution: string;
    degree: string;
    startYear: string;
    endYear: string;
    certificateUrl?: string;
  };
  educationsList: EducationItem[];
  experience: {
    company: string;
    title: string;
    start: string;
    end: string;
    highlights: string;
  };
  experiencesList: ExperienceItem[];
  skills: string[];
  academicPercentage?: number;
  videoName: string | null;
}

export class ProfileService {
  /**
   * Fetch current user's profile from database
   */
  static async getProfile(): Promise<ProfileData> {
    const res = await apiClient.get<never, { success: boolean; data: ProfileData }>('/profile');
    return res.data;
  }

  /**
   * Save / update user's profile to database
   */
  static async updateProfile(data: Partial<ProfileData>): Promise<ProfileData> {
    const res = await apiClient.put<never, { success: boolean; data: ProfileData; message?: string }>(
      '/profile',
      data
    );
    return res.data;
  }
}
