export type FunnelStageType = 'resume_match' | 'assessment' | 'ai_interview' | 'manual_review' | 'human_interview';
export type FunnelConfigStatus = 'draft' | 'active' | 'completed' | 'paused';
export type FunnelHealthState = 'healthy' | 'starved' | 'paused' | 'completed';

export interface IFunnelStage {
  stageId: string;
  stageName: string;
  stageType: FunnelStageType;
  assessmentType?: string;
  order: number;
  expectedAttendanceRate: number;
  expectedPassRate: number;
  targetCount: number;
  deadlineHours: number;
  autoAdvanceScoreThreshold: number;
  autoRefillEnabled: boolean;
  durationMinutes?: number;
  passingScore?: number;
  questionCount?: number;
  schedule?: {
    date?: string;
    startTime?: string;
    endTime?: string;
    durationHours?: number | string;
    durationFormatted?: string;
  };
  config?: Record<string, any>;
}

export interface IHiringFunnelConfig {
  _id?: string;
  jobId: string;
  orgId?: string;
  finalShortlistTarget: number;
  stages: IFunnelStage[];
  status: FunnelConfigStatus;
  totalFunnelIntakeTarget: number;
  currentShortlistedCount: number;
  lastCalculatedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IStageMetrics {
  stageId: string;
  stageName: string;
  stageType: string;
  assessmentType?: string;
  order: number;
  targetCount: number;
  activeCount: number;
  invitedCount: number;
  startedCount: number;
  passedCount: number;
  failedCount: number;
  noShowCount: number;
  deficit: number;
  reserveAvailable: number;
  durationMinutes?: number;
  passingScore?: number;
  questionCount?: number;
  isConfigured?: boolean;
  schedule?: any;
  config?: Record<string, any>;
}

export interface IFunnelMetricsReport {
  jobId: string;
  jobTitle: string;
  finalShortlistTarget: number;
  currentShortlistedCount: number;
  totalFunnelIntakeTarget: number;
  actualQualifiedCount?: number;
  totalApplicants: number;
  primaryPoolSize: number;
  reservePoolSize: number;
  health: FunnelHealthState;
  healthReason?: string;
  stages: IStageMetrics[];
}

export type FinalDecision = 'pending' | 'offered' | 'on_hold' | 'rejected' | 'hired';

export interface IFinalistCompletedStage {
  stageId: string;
  stageName: string;
  stageIndex: number;
  status: string;
  score?: number;
  completedAt?: string;
  notes?: string;
}

export interface IFinalistCandidate {
  applicationId: string;
  jobId: string;
  candidate: PopulatedUser;
  resume?: {
    _id: string;
    title?: string;
    atsScore?: number;
    content?: string;
  } | null;
  resumeScore: number;
  compositeRank: number;
  completedStages: IFinalistCompletedStage[];
  stageScores: {
    matchScore?: number;
    assessmentScore?: number;
    aiScore?: number;
  };
  finalShortlistDate: string;
  finalShortlistDecision: FinalDecision;
  offeredAt?: string;
  hiredAt?: string;
  relevantStageHistory?: any[];
  resumeEvaluation?: any;
  notes?: string;
}

export interface IFinalShortlistStats {
  totalFinalists: number;
  pendingReview: number;
  offersSent: number;
  onHold: number;
  rejected: number;
  hired: number;
}

export interface IFinalShortlistResponse {
  jobId: string;
  jobTitle: string;
  finalShortlistTarget: number;
  currentShortlistedCount: number;
  stats: IFinalShortlistStats;
  candidates: IFinalistCandidate[];
}

export interface RecordFinalDecisionPayload {
  decision: 'offered' | 'on_hold' | 'rejected';
  notes?: string;
}

export interface PopulatedUser {
  _id: string;
  fullName?: string;
  username?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface PopulatedResume {
  _id: string;
  title?: string;
  atsScore?: number;
  createdAt?: string;
}

export type CandidatePoolType = 'primary' | 'reserve' | 'disqualified';
export type CandidateStageStatus = 'invited' | 'started' | 'passed' | 'failed' | 'no_show';

export interface HiringEngineCandidate {
  _id: string;
  userId: PopulatedUser | string;
  jobId: string;
  resumeId?: PopulatedResume | string;
  matchScore?: number;
  compositeRank?: number;
  poolType: CandidatePoolType;
  currentStageIndex?: number;
  currentStageId?: string;
  stageStatus?: CandidateStageStatus;
  stageDeadline?: string;
  assessmentScore?: number;
  aiScore?: number;
  status: string; // ATS status (submitted, shortlisted, rejected, etc.)
  appliedAt: string;
  invitedAt?: string;
  stageStartedAt?: string;
  stageCompletedAt?: string;
}

export interface StageCandidatesResponse {
  stageId: string;
  primary: HiringEngineCandidate[];
  reserve: HiringEngineCandidate[];
}

export interface ICandidateStageHistory {
  _id: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  stageId: string;
  stageName: string;
  stageIndex: number;
  status: CandidateStageStatus;
  score?: number;
  evaluationDetails?: Record<string, any>;
  promotedFromReserve?: boolean;
  notes?: string;
  enteredAt: string;
  completedAt?: string;
}

export interface AdvanceCandidatePayload {
  score?: number;
  notes?: string;
  evaluationDetails?: Record<string, any>;
}

export interface FailCandidatePayload {
  reason?: string;
}

export interface RefillStagePayload {
  count?: number;
}
