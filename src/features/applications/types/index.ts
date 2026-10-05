export type ApplicationStatus =
  | 'submitted'
  | 'reviewing'
  | 'shortlisted'
  | 'interviewing'
  | 'offered'
  | 'rejected'
  | 'failed';

export type ApplicationSource = 'ai_apply' | 'manual';

export interface ApplicationJobDetail {
  _id: string;
  title: string;
  company: {
    name: string;
    logo?: string;
    website?: string;
  };
  location?: {
    city?: string;
    state?: string;
    country?: string;
    remote?: boolean;
  };
  salary?: {
    min: number;
    max: number;
    currency: string;
    period: string;
  };
  experienceLevel?: string;
  minimumExperience?: number;
  maximumExperience?: number;
  employmentType?: string;
  workplaceType?: string;
  skills?: string[];
  responsibilities?: string[];
  requirements?: string[];
  preferredQualifications?: string[];
  educationRequirements?: string;
  benefits?: string[];
  applicationUrl?: string;
  description?: string;
  status?: string;
  publishedAt?: string;
}

export interface ApplicationItem {
  _id: string;
  job: ApplicationJobDetail | null;
  resume: { _id: string; title: string } | null;
  coverLetter: { _id: string; title: string } | null;
  source: ApplicationSource;
  status: ApplicationStatus;
  matchScore: number;
  notes: string;
  appliedAt: string;
  createdAt: string;
  // Authoritative Hiring Engine & Dynamic Funnel fields
  resumeScreeningStatus?: 'pending' | 'ai_reviewing' | 'ai_reviewed';
  resumeDecision?: 'pending' | 'shortlisted' | 'rejected' | 'needs_review';
  poolType?: 'primary' | 'reserve' | 'disqualified' | null;
  currentStageIndex?: number;
  currentStageId?: string;
  stageStatus?: 'invited' | 'started' | 'completed' | 'passed' | 'failed' | 'no_show' | null;
  stageDeadline?: string | null;
  invitedAt?: string | null;
  stageStartedAt?: string | null;
  stageCompletedAt?: string | null;
  finalShortlistDecision?: 'pending' | 'shortlisted' | 'offered' | 'hired' | 'rejected' | 'on_hold' | null;
  offeredAt?: string | null;
  hiredAt?: string | null;
}

export interface CandidateFunnelStage {
  stageId: string;
  stageName: string;
  stageType: 'resume_match' | 'assessment' | 'ai_interview' | 'manual_review' | 'human_interview' | string;
  order: number;
  deadlineHours?: number;
}

export interface CandidateStageHistoryItem {
  stageId: string;
  stageName: string;
  stageIndex: number;
  status: 'invited' | 'started' | 'completed' | 'passed' | 'failed' | 'no_show';
  enteredAt: string;
  completedAt?: string;
  promotedFromReserve?: boolean;
}

export interface CandidateTrackingResponse {
  application: ApplicationItem;
  funnelStages: CandidateFunnelStage[];
  stageHistory: CandidateStageHistoryItem[];
}

export type CandidateDisplayStateKey =
  | 'application_submitted'
  | 'application_under_review'
  | 'not_selected_resume'
  | 'selected_for_hiring_process'
  | 'on_standby'
  | 'action_required'
  | 'in_progress'
  | 'stage_completed'
  | 'not_selected_stage'
  | 'missed_stage'
  | 'final_review'
  | 'offer_received'
  | 'offer_accepted'
  | 'hired'
  | 'withdrawn';

export interface CandidateDisplayState {
  key: CandidateDisplayStateKey;
  label: string;
  badgeVariant: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive' | 'info';
  badgeClass: string;
  description: string;
  stageName?: string;
  actionRequired?: boolean;
  actionLabel?: string;
  actionUrl?: string;
}

export interface ApplicationStats {
  total: number;
  submitted: number;
  reviewing: number;
  shortlisted: number;
  interviewing: number;
  offered: number;
  rejected: number;
  aiApplied: number;
  manualApplied: number;
  avgMatchScore: number;
  appliedThisWeek: number;
}

export interface ApplicationsResponse {
  applications: ApplicationItem[];
  stats: ApplicationStats;
  recentBatches: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
