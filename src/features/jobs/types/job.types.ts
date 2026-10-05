export type ExperienceLevel = 'internship' | 'entry' | 'junior' | 'mid' | 'senior' | 'lead';
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'internship' | 'freelance';
export type WorkplaceType = 'remote' | 'hybrid' | 'onsite';

export interface IJob {
  _id: string;
  title: string;
  company: {
    name: string;
    logo?: string;
    website?: string;
  };
  description: string;
  responsibilities: string[];
  requirements: string[];
  preferredQualifications: string[];
  skills: string[];
  experienceLevel: ExperienceLevel;
  minimumExperience: number;
  maximumExperience?: number;
  employmentType: EmploymentType;
  workplaceType: WorkplaceType;
  location: {
    city?: string;
    state?: string;
    country: string;
    remote: boolean;
  };
  salary: {
    min: number;
    max: number;
    currency: string;
    period: 'yearly' | 'monthly' | 'hourly';
  };
  educationRequirements?: string;
  benefits: string[];
  applicationUrl: string;
  source: string;
  publishedAt: string;
  eligibilityMinPercent?: number;
  expiresAt?: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  matchReasons: string[];
  vectorScore?: number;
}

export interface CandidateProfileSummary {
  headline?: string;
  skillsCount: number;
  skills: string[];
  hasEmbedding: boolean;
  embeddingStatus: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface RecommendationResponse {
  success: boolean;
  data: {
    jobs: IJob[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    candidateProfile: CandidateProfileSummary;
  };
  message?: string;
}

export interface JobsListResponse {
  success: boolean;
  data: {
    jobs: IJob[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
}

export interface JobFilterParams {
  search?: string;
  workplaceType?: WorkplaceType | 'all';
  employmentType?: EmploymentType | 'all';
  experienceLevel?: ExperienceLevel | 'all';
  country?: string;
  minScore?: number;
  page?: number;
  limit?: number;
  sort?: 'recommended' | 'recent' | 'salary';
}
