export type ResumeDecision = 'pending' | 'shortlisted' | 'needs_review' | 'rejected';

export type ResumeScreeningStatus = 'pending' | 'ai_reviewing' | 'ai_reviewed';

export type EvaluationRecommendation = 'strong_match' | 'potential_match' | 'not_recommended';

export interface IMatchScoreBreakdown {
  requiredSkillsScore: number;
  preferredSkillsScore: number;
  experienceScore: number;
  educationScore: number;
  semanticScore: number;
  roleRelevanceScore: number;
}

export interface IResumeEvaluation {
  overallScore: number;
  skillsMatchScore: number;
  experienceMatchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  weaknesses: string[];
  recommendation: EvaluationRecommendation;
  evaluatedAt: string | Date;
  isAiEvaluated: boolean;
  breakdown?: IMatchScoreBreakdown;
  matchedPreferredSkills?: string[];
  missingRequiredSkills?: string[];
  explanations?: string[];
}

export interface CandidateUserSummary {
  _id: string;
  fullName?: string;
  username?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface CandidateResumeSummary {
  _id: string;
  title: string;
  atsScore?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ResumeScreeningCandidateItem {
  applicationId: string;
  jobId: string;
  jobTitle?: string;
  candidate: CandidateUserSummary;
  resume: CandidateResumeSummary | null;
  appliedAt: string | Date;
  source: string;
  screeningStatus: ResumeScreeningStatus;
  decision: ResumeDecision;
  decidedAt?: string | Date;
  decisionNotes?: string;
  evaluation?: IResumeEvaluation;
  matchScore: number;
}

export interface ResumeScreeningStats {
  totalApplications: number;
  pendingReview: number;
  aiReviewed: number;
  shortlisted: number; // Qualified candidates passed resume screening
  needsReview: number;
  rejected: number;
  minimumIntakeRequired: number;
  idealIntakeTarget: number;
  isReadyForFunnel: boolean;
  actualQualifiedCount: number;
  collectionStatus: string;
  isFunnelStarted: boolean;
}

export interface ResumeScreeningFilters {
  decision?: ResumeDecision | 'all';
  screeningStatus?: ResumeScreeningStatus | 'all';
  search?: string;
  minScore?: number;
  page?: number;
  limit?: number;
  sortBy?: 'score' | 'appliedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface ResumeScreeningCandidateListResponse {
  candidates: ResumeScreeningCandidateItem[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export interface RecordDecisionInput {
  decision: 'shortlisted' | 'rejected' | 'needs_review';
  notes?: string;
}

export interface BulkDecisionInput {
  applicationIds: string[];
  decision: 'shortlisted' | 'rejected' | 'needs_review';
  notes?: string;
}

export interface ResumeScreeningDetail {
  applicationId: string;
  job: {
    _id: string;
    title: string;
    company?: { name: string };
    skills?: string[];
    minimumExperience?: number;
    maximumExperience?: number;
    eligibilityMinPercent?: number;
  };
  candidate: CandidateUserSummary;
  resume: {
    _id: string;
    title: string;
    content?: {
      summary?: string;
      skills?: Array<{ name: string; level?: string } | string>;
      experience?: Array<{
        title: string;
        company: string;
        duration?: string;
        startDate?: string;
        endDate?: string;
        description?: string;
      }>;
      education?: Array<{
        institution: string;
        degree: string;
        fieldOfStudy?: string;
        graduationYear?: string | number;
      }>;
    };
    atsScore?: number;
  } | null;
  evaluation: IResumeEvaluation | null;
  decision: ResumeDecision;
  decidedAt?: string | Date;
  decisionNotes?: string;
}
