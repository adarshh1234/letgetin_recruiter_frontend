export type InstitutionStudentStatus = "active" | "placed" | "pending";

export interface InstitutionStudent {
  _id: string;
  institutionOrgId: string;
  name: string;
  email: string;
  course: string;
  year?: string;
  skills: string[];
  status: InstitutionStudentStatus;
  candidateUserId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentInput {
  name: string;
  email: string;
  course: string;
  year?: string;
  skills?: string[];
  status?: InstitutionStudentStatus;
}

export interface BulkUploadResult {
  imported: number;
  failed: { row: number; reason: string }[];
  duplicates: number;
}

export type RecruiterLinkStatus = "active" | "pending" | "inactive";

export interface RecruiterRequirement {
  _id?: string;
  title: string;
  openings?: number;
  notes?: string;
}

export interface InstitutionRecruiter {
  _id: string;
  institutionOrgId: string;
  company: string;
  contactPerson?: string;
  email: string;
  phone?: string;
  industry?: string;
  status: RecruiterLinkStatus;
  requirements: RecruiterRequirement[];
  connectedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddRecruiterInput {
  company: string;
  contactPerson?: string;
  email: string;
  phone?: string;
  industry?: string;
  status?: RecruiterLinkStatus;
  requirements?: RecruiterRequirement[];
}

export type UpdateRecruiterInput = Partial<AddRecruiterInput>;

export type ApplicationPipelineStatus =
  | "submitted"
  | "reviewing"
  | "shortlisted"
  | "interviewing"
  | "offered"
  | "rejected"
  | "failed";

export interface PipelineEntry {
  applicationId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  status: ApplicationPipelineStatus;
  matchScore?: number;
  appliedAt: string;
}

export interface PlacementEntry {
  studentId: string;
  studentName: string;
  studentEmail: string;
  jobTitle?: string;
  companyName?: string;
  offerDate?: string;
  status: InstitutionStudentStatus;
}

export type InstitutionEventType = "interview_drive" | "aptitude_test" | "campus_visit" | "meeting" | "other";

export interface InstitutionEvent {
  _id: string;
  institutionOrgId: string;
  title: string;
  date: string;
  type: InstitutionEventType;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEventInput {
  title: string;
  date: string;
  type?: InstitutionEventType;
  notes?: string;
}

export type InstitutionTaskPriority = "Low" | "Medium" | "High";

export interface InstitutionTask {
  _id: string;
  institutionOrgId: string;
  name: string;
  estimatedTime?: string;
  priority: InstitutionTaskPriority;
  done: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  name: string;
  estimatedTime?: string;
  priority?: InstitutionTaskPriority;
}

export interface InstitutionReports {
  placementRate: number | null;
  totalStudents: number;
  studentsPlaced: number;
  totalApplications: number;
  shortlisted: number;
  interviews: number;
  offers: number;
  averageSalary: number | null;
  activeRecruiters: number;
  openJobs: number;
}

export interface SkillGap {
  skill: string;
  demandCount: number;
  studentsWithSkill: number;
  gapCount: number;
}

export interface TrainingInsightsResponse {
  insights: { kind: "suggestion" | "warning"; text: string }[];
  skillGaps: SkillGap[];
}

export interface TrainingProgram {
  _id: string;
  institutionOrgId: string;
  name: string;
  scheduledDate?: string;
  attendees?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTrainingProgramInput {
  name: string;
  scheduledDate?: string;
  attendees?: number;
  notes?: string;
}

export interface InstitutionPolicy {
  _id: string;
  institutionOrgId: string;
  oneStudentOneJob: boolean;
  dreamOfferOption: boolean;
  banPeriodDays: number;
  additionalRules?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdatePolicyInput {
  oneStudentOneJob?: boolean;
  dreamOfferOption?: boolean;
  banPeriodDays?: number;
  additionalRules?: string;
}

export interface InstitutionOverview {
  kpis: {
    totalStudents: number;
    activeRecruiters: number;
    openJobs: number;
    studentsPlaced: number;
    offersRolled: number;
    placementRate: number | null;
  };
  recentActivity: { event: string; detail: string; date: string }[];
  aiInsights: { kind: "suggestion" | "success" | "warning"; text: string }[];
}
