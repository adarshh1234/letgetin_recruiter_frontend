export type EntityType = "company" | "institution" | "startup";

export interface OrgFormMeta {
  entity: EntityType;
  label: string;
  regLabel: string;
  typeLabel: string;
  typeOptions: string[];
  sizeLabel: string;
  sizeOptions: string[];
  valuationLabel: string;
  leaderLabel: string;
  urlPlaceholder: string;
}

export type EmploymentType = "full-time" | "part-time" | "contract" | "internship" | "freelance";
export type WorkplaceType = "remote" | "hybrid" | "onsite";
export type RecruiterJobStage = "open" | "shortlisting" | "interview" | "review" | "completed";

export type PipelineSection = "resumeMatch" | "assessment" | "aiInterview";

export type AssessmentRoundType =
  | "general"
  | "coding"
  | "custom_test"
  | "custom_interview"
  | "custom_domain"
  | "general_aptitude"
  | "technical_test"
  | "rapid_round"
  | "ai_assessment"
  | "ai_chat"
  | "ai_voice"
  | "domain"
  | "skills"
  | "technical"
  | "rapid_question"
  | (string & {});

export type GeneralAssessmentQuestionType = "mcq" | "short_answer" | "scenario";

export interface GeneralAssessmentConfig {
  questionTypes: GeneralAssessmentQuestionType[];
  mcq?: {
    questionCount?: number;
    difficulty?: "beginner" | "intermediate" | "advanced" | "mixed";
  };
  shortAnswer?: {
    questionCount?: number;
  };
  scenario?: {
    questionCount?: number;
  };
  durationMinutes?: number;
  passingScore?: number;
  [key: string]: unknown;
}

export interface CodingAssessmentConfig {
  problemCount?: number;
  durationMinutes?: number;
  languages?: string[];
  passingScore?: number;
  [key: string]: unknown;
}

export interface AssessmentRoundConfig {
  id: string;
  type: AssessmentRoundType;
  order: number;
  name: string;
  enabled: boolean;
  date?: string;
  startTime?: string;
  endTime?: string;
  durationHours?: number | string;
  config?: Record<string, unknown>;
}

export interface JobAssessmentConfig {
  enabled: boolean;
  rounds: AssessmentRoundConfig[];
}

export interface PipelineOptions {
  matchVolume: string | null;
  resumeMatch: boolean;
  resumeMatchTypes: string[];
  checkResumeVerification?: boolean;
  onlineTestSource?: "ai" | "question_bank";
  assessment: boolean;
  assessmentTypes: string[];
  aiInterview: boolean;
  aiInterviewTypes: string[];
  humanInterview?: boolean;
  humanInterviewTypes?: string[];
  roundOrder?: string[];
  listAsJob?: boolean;
  featuredJob?: boolean;
  listInLandingPage?: boolean;
  listInRecentlyPosted?: boolean;
  screeningSchedule?: {
    date?: string;
    startTime?: string;
    endTime?: string;
    durationHours?: number | string;
  };
  technicalSchedule?: {
    date?: string;
    startTime?: string;
    endTime?: string;
    durationHours?: number | string;
  };
  videoSchedule?: {
    date?: string;
    startTime?: string;
    endTime?: string;
    durationHours?: number | string;
  };
  linguisticTest?: LinguisticTestConfig;
  psychometricGeniusTest?: PsychometricGeniusTestConfig;
}

export interface LinguisticTestConfig {
  enabled: boolean;
  language?: string;
  speak?: boolean;
  read?: boolean;
  write?: boolean;
  fluencyScore?: number;
  expertiseScore?: number;
  nativeSpeaker?: boolean;
  certificateType?: string;
  certificateScore?: string;
}

export interface PsychometricGeniusTestConfig {
  psychometricEnabled?: boolean;
  geniusEnabled?: boolean;
  psychometricSchedule?: {
    date?: string;
    startTime?: string;
    endTime?: string;
    durationMinutes?: number;
  };
  geniusSchedule?: {
    date?: string;
    startTime?: string;
    endTime?: string;
    durationMinutes?: number;
  };
  psychometricDuration?: number;
  geniusDuration?: number;
}

export interface PipelineSubOption {
  key: string;
  label: string;
}

export interface PipelineSubOptionsCatalog {
  resumeMatch: PipelineSubOption[];
  assessment: PipelineSubOption[];
  aiInterview: PipelineSubOption[];
}

export interface MatchVolumeOption {
  key: string;
  label: string;
  credits: number;
}

export type ApplicationCollectionStatus =
  | "collecting"
  | "ready"
  | "extended"
  | "started"
  | "insufficient"
  | "closed";

export interface ApplicationCollectionInfo {
  idealIntake: number;
  minimumIntake: number;
  actualQualifiedCount: number;
  initialDeadline?: string;
  currentDeadline?: string;
  autoExtensionEnabled: boolean;
  extensionDurationDays: number;
  maxExtensions: number;
  extensionsUsed: number;
  autoStartEnabled: boolean;
  status: ApplicationCollectionStatus;
}

export interface CollectionStatusReport {
  jobId: string;
  jobTitle: string;
  idealIntake: number;
  minimumIntake: number;
  actualQualifiedCount: number;
  finalShortlistTarget: number;
  initialDeadline?: string;
  currentDeadline?: string;
  deadline?: string;
  autoExtensionEnabled: boolean;
  extensionDurationDays: number;
  maxExtensions: number;
  extensionsUsed: number;
  autoStartEnabled: boolean;
  status: ApplicationCollectionStatus;
  funnelHealth: "healthy" | "constrained" | "starved";
  canStartPipeline: boolean;
  idealFunnel: {
    totalFunnelIntakeTarget: number;
    stages: Array<{
      stageId: string;
      stageName: string;
      stageType: string;
      targetCount: number;
      deadlineHours: number;
      autoAdvanceScoreThreshold: number;
    }>;
  };
  operationalFunnel: {
    totalFunnelIntakeTarget: number;
    stages: Array<{
      stageId: string;
      stageName: string;
      stageType: string;
      targetCount: number;
      deadlineHours: number;
      autoAdvanceScoreThreshold: number;
    }>;
    estimatedFinalYield: number;
    deficit: number;
  };
}

export interface RecruiterJob {
  _id: string;
  title: string;
  company: { name: string; logo?: string; website?: string };
  description: string;
  responsibilities?: string[];
  requirements?: string[];
  skills: string[];
  experienceLevel?: string;
  minimumExperience?: number;
  maximumExperience?: number;
  employmentType: EmploymentType;
  workplaceType: WorkplaceType;
  location: { city?: string; state?: string; country: string; remote: boolean };
  salaryText?: string;
  status: string;
  recruiterStage?: RecruiterJobStage;
  pipelineOptions?: PipelineOptions;
  assessment?: JobAssessmentConfig;
  rounds?: string[];
  roundOrder?: string[];
  stages?: any[];
  creditsCost?: number;
  applicantCount?: number;
  eligibilityMinPercent?: number;
  expiresAt?: string;
  finalShortlistTarget?: number;
  applicationCollection?: ApplicationCollectionInfo;
  hiringEngineEnabled?: boolean;
  hiringEngineConfigId?: string;
  structuredRequirements?: JobRequirements;
  createdAt: string;
  updatedAt: string;
}

export type EducationLevel =
  | 'none'
  | 'high_school'
  | 'associate'
  | 'diploma'
  | 'bachelor'
  | 'master'
  | 'doctorate'
  | 'other';

export type SkillProficiency = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface JobSkillRequirement {
  name: string;
  proficiency: SkillProficiency;
}

export interface JobEducationRequirement {
  minimumLevel?: EducationLevel;
  fields?: string[];
}

export interface JobRequirements {
  requiredSkills: (JobSkillRequirement | string)[];
  preferredSkills: string[];
  minimumExperienceYears?: number;
  maximumExperienceYears?: number;
  education?: JobEducationRequirement;
}

export function normalizeFrontendSkill(s: JobSkillRequirement | string): JobSkillRequirement {
  if (typeof s === 'string') {
    return { name: s.trim(), proficiency: 'intermediate' };
  }
  return {
    name: s.name.trim(),
    proficiency: s.proficiency || 'intermediate',
  };
}

export function normalizeFrontendPreferredSkill(s: unknown): string {
  if (!s) return '';
  if (typeof s === 'string') return s.trim();
  if (typeof s === 'object' && s !== null && 'name' in s && typeof (s as any).name === 'string') {
    return (s as any).name.trim();
  }
  return '';
}

export interface GeneratedJobContent {
  description: string;
  skills: string[];
}

export interface CreateJobInput {
  title: string;
  companyName?: string;
  location?: string;
  employmentType?: EmploymentType;
  workplaceType?: WorkplaceType;
  salaryText?: string;
  skills?: string[];
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  minimumExperience?: number;
  maximumExperience?: number;
  structuredRequirements?: JobRequirements;
  eligibilityMinPercent?: number;
  deadline?: string;
  saveAsDraft?: boolean;
  finalShortlistTarget?: number;
  idealIntake?: number;
  minimumIntake?: number;
  collectionDurationDays?: number;
  autoExtensionEnabled?: boolean;
  extensionDurationDays?: number;
  maxExtensions?: number;
  autoStartEnabled?: boolean;
  rounds?: string[];
  roundOrder?: string[];
  stages?: any[];
  humanInterview?: boolean;
  humanInterviewTypes?: string[];
  pipelineOptions?: PipelineOptions;
  assessment?: JobAssessmentConfig;
  listAsJob?: boolean;
  featuredJob?: boolean;
  listInLandingPage?: boolean;
  listInRecentlyPosted?: boolean;
  checkResumeVerification?: boolean;
  linguisticTest?: LinguisticTestConfig;
  psychometricGeniusTest?: PsychometricGeniusTestConfig;
}


export interface ApplicantResume {
  _id?: string;
  id?: string;
  title?: string;
  templateId?: string;
  content?: {
    personalInfo?: {
      fullName?: string;
      headline?: string;
      email?: string;
      phone?: string;
      location?: string;
      websiteUrl?: string;
      avatarUrl?: string;
    };
    summary?: string;
    experiences?: Array<{
      id?: string;
      company?: string;
      position?: string;
      location?: string;
      startDate?: string;
      endDate?: string;
      isCurrent?: boolean;
      highlights?: string[] | string;
    }>;
    educations?: Array<{
      id?: string;
      institution?: string;
      degree?: string;
      fieldOfStudy?: string;
      startDate?: string;
      endDate?: string;
      gradeScore?: string;
    }>;
    skills?: Array<string | { id?: string; name: string; level?: number }>;
    projects?: Array<{
      id?: string;
      title: string;
      subtitle?: string;
      link?: string;
      startDate?: string;
      endDate?: string;
      description?: string;
      highlights?: string[];
      technologies?: string[];
    }>;
    certificates?: Array<{
      id?: string;
      name: string;
      issuer: string;
      issueDate?: string;
      credentialUrl?: string;
    }>;
    languages?: Array<{
      id?: string;
      language: string;
      proficiency?: string;
    }>;
    socialLinks?: Array<{
      platform?: string;
      url: string;
      label?: string;
    }>;
  };
  settings?: Record<string, any>;
  atsScore?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Applicant {
  _id: string;
  candidate: {
    _id?: string;
    fullName?: string;
    username?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
    avatar?: string;
  } | null;
  resume: ApplicantResume | null;
  status: string;
  matchScore: number;
  assessmentScore?: number;
  aiScore?: number;
  notes: string;
  appliedAt: string;
}

export interface CreditPack {
  id: string;
  credits: number;
  price: number;
  best?: boolean;
}

export interface SourcedCandidate {
  candidateUserId: string;
  name: string;
  avatarUrl?: string;
  headline?: string;
  location?: string;
  skills?: string[];
  summary?: string;
  experiences?: any[];
  educations?: any[];
  projects?: any[];
  certificates?: any[];
  languages?: any[];
  socialLinks?: any[];
  yearsOfExperience?: number;
  matchScore: number;
  email?: string;
  phone?: string;
  contactRevealed: boolean;
  resume?: ApplicantResume | null;
  candidate?: {
    _id?: string;
    fullName?: string;
    username?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
  } | null;
}

export interface AllApplicant {
  _id: string;
  jobId: string;
  jobTitle: string;
  candidate: {
    _id?: string;
    fullName?: string;
    username?: string;
    email?: string;
    phone?: string;
    avatarUrl?: string;
    avatar?: string;
  } | null;
  resume: ApplicantResume | null;
  status: string;
  matchScore: number;
  assessmentScore?: number;
  aiScore?: number;
  appliedAt: string;
}

export interface RecruiterOverview {
  kpis: {
    openRoles: number;
    openRolesContext?: string;
    activeCandidates: number;
    avgTimeToFillDays: number | null;
    aiMatchRate: number | null;
    credits: number;
  };
  recentActivity: {
    jobId: string;
    title: string;
    applicantCount: number;
    stage: string;
    updatedAt: string;
  }[];
  topMatches: {
    candidateName: string;
    headline?: string;
    yearsOfExperience?: number;
    jobTitle: string;
    matchScore: number;
  }[];
  funnel: { stage: string; label: string; count: number }[];
  aiInsights: { kind: "suggestion" | "success" | "warning"; text: string }[];
  funnelInsights: { kind: "success" | "warning"; text: string }[];
}

export interface OrgProfile {
  _id?: string;
  ownerUserId?: string;
  entity: EntityType;
  name: string;
  address?: string;
  headquarters?: string;
  orgType?: string;
  employees?: string;
  valuation?: string;
  revenue?: string;
  ceoName?: string;
  ceoEmail?: string;
  phone?: string;
  industry?: string;
  founded?: string;
  website?: string;
  registrationId?: string;
  bio?: string;
  description?: string;
  whyJoinUs?: string;
  googleMapsUrl?: string;
  mapLocation?: {
    address?: string;
    lat?: number;
    lng?: number;
    placeId?: string;
  };
  // Startup specific fields
  founders?: string;
  foundingTheme?: string;
  sector?: string;
  productDetails?: string;
  productLink?: string;
  fundraiser?: string;
  // Institution specific fields (HTML Specification)
  mission?: string;
  vision?: string;
  values?: string;
  campusContext?: string;
  legalStatus?: string;
  governingBody?: string;
  executiveLeadership?: string;
  orgStructure?: string;
  academicPrograms?: string;
  academicCalendar?: string;
  gradingScale?: string;
  graduationRequirements?: string;
  totalEnrollment?: string;
  averageClassSize?: string;
  graduationRate?: string;
  placementRate?: string;
  internationalStudents?: string;
  scholarshipRecipients?: string;
  diversityInclusion?: string;
  testScores?: string;
  totalFaculty?: string;
  facultyAdvancedDegrees?: string;
  studentTeacherRatio?: string;
  supportStaffCount?: string;
  facultyExperience?: string;
  professionalDevelopment?: string;
  campusArea?: string;
  laboratories?: string;
  libraryResources?: string;
  artsRecreation?: string;
  itInfrastructure?: string;
  campusAccessibility?: string;
  accreditations?: string;
  awardsHonors?: string;
  membershipsAffiliations?: string;
  tuitionFeeSchedule?: string;
  financialAidAvailable?: string;
  endowmentBudget?: string;
  academicSupportServices?: string;
  wellnessSocialSupport?: string;
  extracurricularClubs?: string;
  transportationHousing?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type OrgAutofillFields = Partial<
  Pick<
    OrgProfile,
    | "name"
    | "address"
    | "headquarters"
    | "orgType"
    | "employees"
    | "valuation"
    | "revenue"
    | "ceoName"
    | "ceoEmail"
    | "founded"
    | "industry"
    | "registrationId"
    | "bio"
    | "description"
    | "whyJoinUs"
    | "website"
    | "founders"
    | "foundingTheme"
    | "sector"
    | "productDetails"
    | "productLink"
    | "fundraiser"
  >
>;
