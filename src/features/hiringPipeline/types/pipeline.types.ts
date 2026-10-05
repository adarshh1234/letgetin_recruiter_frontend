import { LucideIcon } from "lucide-react";

export type PipelineStageId =
  | "resume-gathering"
  | "resume-shortlisting"
  | "interview-round-1"
  | "interview-round-2"
  | "final-shortlist"
  | "hired";

export interface PipelineStage {
  id: PipelineStageId;
  stepNumber: number;
  name: string;
  shortName: string;
  count: number;
  description: string;
  status: "Active" | "In Progress" | "Scheduled" | "Reviewing" | "Completed";
  progressPercent: number;
  conversionRate: string;
  avgDays: string;
  colorTheme: {
    badge: string;
    border: string;
    iconBg: string;
    iconColor: string;
    progressBar: string;
    lightBg: string;
  };
}

export type CandidateStatus =
  | "Active"
  | "Under Review"
  | "Interview Scheduled"
  | "Pending Feedback"
  | "In Progress"
  | "Reviewing"
  | "Offer Extended"
  | "Hired"
  | "Archived";

export interface PipelineCandidate {
  id: string;
  name: string;
  avatarUrl?: string;
  email: string;
  phone: string;
  location: string;
  appliedRole: string;
  stageId: PipelineStageId;
  stageName: string;
  experience: string;
  currentCompany: string;
  matchScore: number;
  skills: string[];
  status: CandidateStatus;
  appliedDate: string;
  lastActivity: string;
  rating: number;
  interviewer?: string;
  notesCount: number;
}

export interface PipelineSummaryMetrics {
  totalSourced: number;
  totalCandidates?: number;
  activeInFunnel: number;
  avgTimeToHireDays: number;
  offerAcceptanceRate: number;
}

export interface VerificationCheck {
  status: "Verified" | "In Review" | "Pending";
  provider: string;
  verifiedAt: string;
  badge: string;
}

export interface VerifiedResumeCandidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  appliedRole: string;
  currentCompany: string;
  experience: string;
  matchScore: number;
  trustScore: number;
  verificationTier: "Platinum" | "Gold" | "Silver";
  verificationHash: string;
  verificationDate: string;
  skills: string[];
  resumeFileName: string;
  fileSize: string;
  checks: {
    identity: VerificationCheck;
    employment: VerificationCheck;
    education: VerificationCheck;
    skills: VerificationCheck;
  };
  summary: string;
}
