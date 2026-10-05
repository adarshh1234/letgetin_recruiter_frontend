"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Check,
  Loader2,
  RefreshCw,
  Sparkles,
  Zap,
  X,
  FileText,
  GraduationCap,
  Briefcase,
  Crown,
  PlusCircle,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  FileQuestion,
  Users,
  Code,
  Plus,
  Trash2,
  AlertTriangle,
  Megaphone,
  Edit3,
  Calendar,
  Clock,
  Video,
  Globe,
  Languages,
  Mic,
  BookOpen,
  PenTool,
  BrainCircuit,
  Lightbulb,
  Award,
  MessageSquare,
  Bot,
  UserCheck,
} from "lucide-react";
import { recruiterService } from "@/features/recruiter/services/recruiterService";
import { useRecruiterStore } from "@/features/recruiter/store/useRecruiterStore";
import { BuyCreditsModal } from "@/features/recruiter/components/BuyCreditsModal";
import { UpgradePlanModal } from "@/features/recruiter/components/UpgradePlanModal";
import { AIAssistPanel } from "@/features/recruiter/components/AIAssistPanel";
import { CustomQuestionModal, CustomQuestionItem } from "@/features/recruiter/components/CustomQuestionModal";
import {
  RoundQuestionConfigModal,
  ConfiguredQuestionItem,
} from "@/features/recruiter/components/RoundQuestionConfigModal";
import {
  CustomRoundModal,
  CustomCandidateRound,
  CustomRoundCategory,
} from "@/features/recruiter/components/CustomRoundModal";
import { AIWritingAssistant } from "@/features/aiWriting/components/AIWritingAssistant";
import { SkillRequirementsInput } from "@/features/recruiter/components/SkillRequirementsInput";
import {
  RoundScheduleSelector,
  RoundSchedule,
  calculateRoundHours,
} from "@/features/recruiter/components/RoundScheduleSelector";
import {
  AssessmentRoundConfig,
  CreditPack,
  EducationLevel,
  EmploymentType,
  GeneralAssessmentQuestionType,
  GeneratedJobContent,
  JobRequirements,
  JobSkillRequirement,
  SkillProficiency,
  MatchVolumeOption,
  PipelineOptions,
  PipelineSection,
  PipelineSubOptionsCatalog,
  WorkplaceType,
} from "@/features/recruiter/types";

const EDUCATION_LEVEL_OPTIONS: { value: EducationLevel; label: string }[] = [
  { value: "none", label: "No specific requirement" },
  { value: "high_school", label: "High School" },
  { value: "associate", label: "Associate Degree" },
  { value: "diploma", label: "Diploma" },
  { value: "bachelor", label: "Bachelor's Degree" },
  { value: "master", label: "Master's Degree" },
  { value: "doctorate", label: "Doctorate / Ph.D." },
  { value: "other", label: "Other / Equivalent" },
];

const EMPLOYMENT_TYPES: { value: EmploymentType; label: string }[] = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
];

const WORKPLACE_TYPES: { value: WorkplaceType; label: string }[] = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
];

const SECTION_META: Record<PipelineSection, { label: string; description: string }> = {
  resumeMatch: { label: "Resume Shortlisting", description: "Automatically rank applicants against this job" },
  assessment: { label: "Assessment", description: "Send an assessment to shortlisted candidates" },
  aiInterview: { label: "AI Interview", description: "Run an AI-driven candidate interview" },
};

export default function CreateJobPage() {
  const router = useRouter();
  const { orgProfile } = useRecruiterStore();

  // Step state: 1 = Role Definition, 2 = Pipeline & Assessment, 3 = Funnel & Promotion, 4 = Credits & Payment
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: Role Basics & Structured Requirements
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [employmentType, setEmploymentType] = useState<EmploymentType>("full-time");
  const [workplaceType, setWorkplaceType] = useState<WorkplaceType>("remote");
  const [salaryText, setSalaryText] = useState("");
  const [description, setDescription] = useState("");
  const [responsibilitiesText, setResponsibilitiesText] = useState("");
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  const [requiredSkills, setRequiredSkills] = useState<JobSkillRequirement[]>([]);
  const [preferredSkills, setPreferredSkills] = useState<string[]>([]);
  const [minimumExperience, setMinimumExperience] = useState("");
  const [maximumExperience, setMaximumExperience] = useState("");
  const [educationLevel, setEducationLevel] = useState<EducationLevel>("none");
  const [educationFieldsText, setEducationFieldsText] = useState("");

  const handleRequiredSkillsChange = (newSkills: JobSkillRequirement[]) => {
    setRequiredSkills(newSkills);
    const requiredLowers = new Set(newSkills.map((s) => s.name.toLowerCase()));
    setPreferredSkills((prev) => prev.filter((s) => !requiredLowers.has(s.toLowerCase())));
  };

  const handlePreferredSkillsChange = (newSkills: string[]) => {
    const requiredLowers = new Set(requiredSkills.map((s) => s.name.toLowerCase()));
    const filtered = newSkills.filter((s) => !requiredLowers.has(s.toLowerCase()));
    setPreferredSkills(filtered);
  };

  const [isGeneratingContent, setIsGeneratingContent] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [pendingGeneratedContent, setPendingGeneratedContent] = useState<GeneratedJobContent | null>(null);
  const [hasAiGeneratedContent, setHasAiGeneratedContent] = useState(false);

  // Step 2: Hiring Pipeline & Assessments
  const [matchVolume, setMatchVolume] = useState<string | null>(null);
  const [customRatioError, setCustomRatioError] = useState<string | null>(null);

  // Resume shortlisting
  const [resumeMatchEnabled, setResumeMatchEnabled] = useState(true);
  const [checkResumeVerification, setCheckResumeVerification] = useState(false);
  const [selectedSubOptions, setSelectedSubOptions] = useState<Record<PipelineSection, Set<string>>>({
    resumeMatch: new Set(),
    assessment: new Set(),
    aiInterview: new Set(),
  });

  // Assessment Module 1: Online test (AI or Question bank)
  const [onlineTestEnabled, setOnlineTestEnabled] = useState(false);
  const [onlineTestSource, setOnlineTestSource] = useState<"ai" | "question_bank">("ai");

  // Online test sub-rounds: General Aptitude, Technical Test, Rapid Round
  const [onlineGeneralAptitudeEnabled, setOnlineGeneralAptitudeEnabled] = useState(true);
  const [onlineGeneralAptitudeSchedule, setOnlineGeneralAptitudeSchedule] = useState<RoundSchedule>({
    date: "",
    startTime: "10:00",
    endTime: "10:45",
  });
  const [onlineGeneralAptitudeDuration, setOnlineGeneralAptitudeDuration] = useState(45);
  const [onlineGeneralAptitudeQuestions, setOnlineGeneralAptitudeQuestions] = useState(15);
  const [onlineGeneralAptitudePassScore, setOnlineGeneralAptitudePassScore] = useState(70);

  const [onlineTechnicalTestEnabled, setOnlineTechnicalTestEnabled] = useState(true);
  const [onlineTechnicalTestSchedule, setOnlineTechnicalTestSchedule] = useState<RoundSchedule>({
    date: "",
    startTime: "11:00",
    endTime: "11:45",
  });
  const [onlineTechnicalTestDuration, setOnlineTechnicalTestDuration] = useState(45);
  const [onlineTechnicalTestQuestions, setOnlineTechnicalTestQuestions] = useState(20);
  const [onlineTechnicalTestPassScore, setOnlineTechnicalTestPassScore] = useState(70);

  const [onlineRapidRoundEnabled, setOnlineRapidRoundEnabled] = useState(false);
  const [onlineRapidRoundSchedule, setOnlineRapidRoundSchedule] = useState<RoundSchedule>({
    date: "",
    startTime: "12:00",
    endTime: "12:20",
  });
  const [onlineRapidRoundDuration, setOnlineRapidRoundDuration] = useState(20);
  const [onlineRapidRoundQuestions, setOnlineRapidRoundQuestions] = useState(10);
  const [onlineRapidRoundPassScore, setOnlineRapidRoundPassScore] = useState(60);

  const [onlineTestCustomQuestions, setOnlineTestCustomQuestions] = useState<CustomQuestionItem[]>([]);

  // Assessment Module 2: Interview (Screening, Technical & Video)
  const [interviewEnabled, setInterviewEnabled] = useState(false);
  const [screeningInterviewEnabled, setScreeningInterviewEnabled] = useState(true);
  const [technicalInterviewEnabled, setTechnicalInterviewEnabled] = useState(true);
  const [videoInterviewEnabled, setVideoInterviewEnabled] = useState(false);
  const [screeningDuration, setScreeningDuration] = useState(20);
  const [technicalDuration, setTechnicalDuration] = useState(45);
  const [videoDuration, setVideoDuration] = useState(30);

  // Assessment Module 3: Domain specific test (no Basic Aptitude or Coding Test)
  const [domainSpecificEnabled, setDomainSpecificEnabled] = useState(false);
  const [domainSpecificSchedule, setDomainSpecificSchedule] = useState<RoundSchedule>({
    date: "",
    startTime: "15:00",
    endTime: "16:00",
  });
  const [domainSpecificDuration, setDomainSpecificDuration] = useState(60);
  const [domainSpecificPassingScore, setDomainSpecificPassingScore] = useState(75);
  const [domainSpecificQuestions, setDomainSpecificQuestions] = useState(10);
  const [domainCustomQuestions, setDomainCustomQuestions] = useState<CustomQuestionItem[]>([]);

  // Assessment Section Rounds: AI Chat Assessment, AI Voice Assessment, Domain, Skills, Technical, Rapid Question Round
  type RapidInterviewMode = "ai_online_interview" | "manual_online_interview";

  // 1. AI Chat Assessment Round
  const [assessmentAiChatEnabled, setAssessmentAiChatEnabled] = useState(false);
  const [assessmentAiChatQuestionCount, setAssessmentAiChatQuestionCount] = useState(8);
  const [assessmentAiChatDifficulty, setAssessmentAiChatDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [assessmentAiChatSchedule, setAssessmentAiChatSchedule] = useState<RoundSchedule>({
    date: "",
    startTime: "14:00",
    endTime: "14:45",
  });
  const [assessmentAiChatDuration, setAssessmentAiChatDuration] = useState(45);
  const [assessmentAiChatPassScore, setAssessmentAiChatPassScore] = useState(70);

  // 2. AI Voice Assessment Round
  const [assessmentAiVoiceEnabled, setAssessmentAiVoiceEnabled] = useState(false);
  const [assessmentAiVoiceQuestionCount, setAssessmentAiVoiceQuestionCount] = useState(6);
  const [assessmentAiVoiceDifficulty, setAssessmentAiVoiceDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [assessmentAiVoiceSchedule, setAssessmentAiVoiceSchedule] = useState<RoundSchedule>({
    date: "",
    startTime: "15:00",
    endTime: "15:30",
  });
  const [assessmentAiVoiceDuration, setAssessmentAiVoiceDuration] = useState(30);
  const [assessmentAiVoicePassScore, setAssessmentAiVoicePassScore] = useState(70);

  const [assessmentDomainEnabled, setAssessmentDomainEnabled] = useState(false);
  const [assessmentDomainSchedule, setAssessmentDomainSchedule] = useState<RoundSchedule>({
    date: "",
    startTime: "15:00",
    endTime: "15:45",
  });
  const [assessmentDomainDuration, setAssessmentDomainDuration] = useState(45);
  const [assessmentDomainPassScore, setAssessmentDomainPassScore] = useState(70);

  const [assessmentSkillsEnabled, setAssessmentSkillsEnabled] = useState(false);
  const [assessmentSkillsSchedule, setAssessmentSkillsSchedule] = useState<RoundSchedule>({
    date: "",
    startTime: "16:00",
    endTime: "16:30",
  });
  const [assessmentSkillsDuration, setAssessmentSkillsDuration] = useState(30);
  const [assessmentSkillsPassScore, setAssessmentSkillsPassScore] = useState(70);

  const [assessmentTechnicalEnabled, setAssessmentTechnicalEnabled] = useState(false);
  const [assessmentTechnicalSchedule, setAssessmentTechnicalSchedule] = useState<RoundSchedule>({
    date: "",
    startTime: "16:45",
    endTime: "17:30",
  });
  const [assessmentTechnicalDuration, setAssessmentTechnicalDuration] = useState(45);
  const [assessmentTechnicalPassScore, setAssessmentTechnicalPassScore] = useState(75);

  const [assessmentRapidEnabled, setAssessmentRapidEnabled] = useState(false);
  const [assessmentRapidInterviewType, setAssessmentRapidInterviewType] = useState<RapidInterviewMode>("ai_online_interview");
  const [assessmentRapidSchedule, setAssessmentRapidSchedule] = useState<RoundSchedule>({
    date: "",
    startTime: "17:45",
    endTime: "18:05",
  });
  const [assessmentRapidDuration, setAssessmentRapidDuration] = useState(20);
  const [assessmentRapidPassScore, setAssessmentRapidPassScore] = useState(65);


  // Custom question modal state
  const [customQuestionModalTarget, setCustomQuestionModalTarget] = useState<"ai_online_test" | "ai_assessment" | null>(null);

  // Dedicated Round Question Review & AI Configuration State
  const [roundQuestionModal, setRoundQuestionModal] = useState<{
    open: boolean;
    roundId: string;
    roundType: string;
    roundName: string;
    durationMinutes?: number;
    passingScore?: number;
  }>({
    open: false,
    roundId: "",
    roundType: "",
    roundName: "",
  });

  const [roundQuestionsMap, setRoundQuestionsMap] = useState<Record<string, ConfiguredQuestionItem[]>>({});

  const handleOpenRoundQuestionConfig = (
    roundId: string,
    roundType: string,
    roundName: string,
    durationMinutes?: number,
    passingScore?: number
  ) => {
    setRoundQuestionModal({
      open: true,
      roundId,
      roundType,
      roundName,
      durationMinutes,
      passingScore,
    });
  };

  const handleSaveRoundQuestions = (questions: ConfiguredQuestionItem[]) => {
    const rId = roundQuestionModal.roundId;
    setRoundQuestionsMap((prev) => ({ ...prev, [rId]: questions }));

    if (rId === "round_general_aptitude" || rId === "online_test") {
      setOnlineTestCustomQuestions(questions as any);
    } else if (rId === "round_domain_specific" || rId === "domain_specific") {
      setDomainCustomQuestions(questions as any);
    }
  };

  const handleAddCustomQuestion = (question: CustomQuestionItem) => {
    if (question.target === "ai_online_test") {
      setOnlineTestCustomQuestions((prev) => [...prev, question]);
    } else {
      setDomainCustomQuestions((prev) => [...prev, question]);
    }
  };

  const handleRemoveCustomQuestion = (target: "ai_online_test" | "ai_assessment", id: string) => {
    if (target === "ai_online_test") {
      setOnlineTestCustomQuestions((prev) => prev.filter((q) => q.id !== id));
    } else {
      setDomainCustomQuestions((prev) => prev.filter((q) => q.id !== id));
    }
  };

  // Schedule state for Interview (Screening, Technical, Video)
  const [screeningSchedule, setScreeningSchedule] = useState<RoundSchedule>({
    date: "",
    startTime: "11:00",
    endTime: "11:20",
  });

  const [technicalSchedule, setTechnicalSchedule] = useState<RoundSchedule>({
    date: "",
    startTime: "14:00",
    endTime: "14:45",
  });

  const [videoSchedule, setVideoSchedule] = useState<RoundSchedule>({
    date: "",
    startTime: "16:00",
    endTime: "16:30",
  });

  // Custom candidate rounds state (for Test, Interview, and Domain Specific Test)
  const [customRounds, setCustomRounds] = useState<CustomCandidateRound[]>([]);
  const [customRoundModalCategory, setCustomRoundModalCategory] = useState<CustomRoundCategory | null>(null);
  const [editingCustomRound, setEditingCustomRound] = useState<CustomCandidateRound | null>(null);

  const handleOpenAddCustomRound = (category: CustomRoundCategory) => {
    // If the parent category is not enabled, automatically activate it
    if (category === "test" && !onlineTestEnabled) setOnlineTestEnabled(true);
    if (category === "interview" && !interviewEnabled) setInterviewEnabled(true);
    if (category === "domain" && !domainSpecificEnabled) setDomainSpecificEnabled(true);

    setEditingCustomRound(null);
    setCustomRoundModalCategory(category);
  };

  const handleOpenEditCustomRound = (round: CustomCandidateRound) => {
    setEditingCustomRound(round);
    setCustomRoundModalCategory(round.category);
  };

  const handleSaveCustomRound = (round: CustomCandidateRound) => {
    setCustomRounds((prev) => {
      const idx = prev.findIndex((r) => r.id === round.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = round;
        return next;
      }
      return [...prev, round];
    });
  };

  const handleRemoveCustomRound = (roundId: string) => {
    setCustomRounds((prev) => prev.filter((r) => r.id !== roundId));
  };

  const handleToggleCustomRound = (roundId: string) => {
    setCustomRounds((prev) =>
      prev.map((r) => (r.id === roundId ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const renderCustomRoundCard = (round: CustomCandidateRound) => {
    const timing = calculateRoundHours(round.schedule.startTime, round.schedule.endTime);
    return (
      <div
        key={round.id}
        className={`p-3.5 rounded-xl border transition ${
          round.enabled
            ? "bg-surface border-border shadow-xs"
            : "bg-surface-alt/40 border-border/60 opacity-60"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <label className="flex items-start gap-2.5 cursor-pointer flex-1 min-w-0 select-none">
            <input
              type="checkbox"
              checked={round.enabled}
              onChange={() => handleToggleCustomRound(round.id)}
              className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-primary/30 cursor-pointer"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-ink">{round.name}</span>
                <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full capitalize">
                  {round.category === "test"
                    ? round.testFormat || "Custom Test"
                    : round.category === "interview"
                    ? round.interviewType?.replace("_", " ") || "Interview"
                    : round.domainArea || "Domain"}
                </span>
                {round.testingMode && (
                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded capitalize">
                    {round.testingMode.replace("_", " ")}
                  </span>
                )}
              </div>

              {round.description && (
                <p className="text-[11px] text-ink-soft mt-0.5 line-clamp-1">{round.description}</p>
              )}

              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-ink-soft flex-wrap">
                <span className="flex items-center gap-1 font-medium text-ink">
                  <Clock className="w-3 h-3 text-primary-glow" />
                  {round.durationMinutes} mins
                </span>
                {round.questionCount && <span>• {round.questionCount} Questions</span>}
                {round.passingScore && <span>• Pass: {round.passingScore}%</span>}
                {round.schedule.date ? (
                  <span className="flex items-center gap-1 text-primary-glow font-medium">
                    <Calendar className="w-3 h-3" />
                    {round.schedule.date} ({round.schedule.startTime} - {round.schedule.endTime}
                    {timing.formatted ? ` • ${timing.formatted}` : ""})
                  </span>
                ) : (
                  <span className="text-ink-soft italic">No date scheduled</span>
                )}
              </div>
            </div>
          </label>

          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full mr-1">
              10 credits
            </span>
            <button
              type="button"
              onClick={() => handleOpenEditCustomRound(round)}
              className="p-1.5 rounded-lg text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
              title="Edit Round"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => handleRemoveCustomRound(round.id)}
              className="p-1.5 rounded-lg text-ink-soft hover:text-destructive hover:bg-destructive/10 transition cursor-pointer"
              title="Remove Round"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  };


  // Step 3: Candidate Collection & Funnel Targets
  const [finalShortlistTarget, setFinalShortlistTarget] = useState<number>(10);
  const [idealIntake, setIdealIntake] = useState<number>(15);
  const [minimumIntake, setMinimumIntake] = useState<number>(8);
  const [collectionDurationDays, setCollectionDurationDays] = useState<number>(7);
  const [autoExtensionEnabled, setAutoExtensionEnabled] = useState<boolean>(true);
  const [extensionDurationDays, setExtensionDurationDays] = useState<number>(3);
  const [maxExtensions, setMaxExtensions] = useState<number>(2);
  const [autoStartEnabled, setAutoStartEnabled] = useState<boolean>(false);

  // Step 3: Job Listings & Promotion (10 credits each)
  const [listAsJob, setListAsJob] = useState<boolean>(true);
  const [featuredJob, setFeaturedJob] = useState<boolean>(false);
  const [listInLandingPage, setListInLandingPage] = useState<boolean>(false);
  const [listInRecentlyPosted, setListInRecentlyPosted] = useState<boolean>(false);

  // Step 3: Linguistic Test (Optional)
  const [linguisticTestEnabled, setLinguisticTestEnabled] = useState(false);
  const [linguisticSpeak, setLinguisticSpeak] = useState(true);
  const [linguisticRead, setLinguisticRead] = useState(true);
  const [linguisticWrite, setLinguisticWrite] = useState(true);
  const [linguisticFluencyScore, setLinguisticFluencyScore] = useState<number>(80);
  const [linguisticExpertiseScore, setLinguisticExpertiseScore] = useState<number>(85);
  const [linguisticNative, setLinguisticNative] = useState(false);
  const [linguisticCertType, setLinguisticCertType] = useState("IELTS");
  const [linguisticCertScore, setLinguisticCertScore] = useState("7.5+");

  // Step 3: Psychometric Test & Genius Test (Optional rounds enabled via checkbox)
  const [psychometricEnabled, setPsychometricEnabled] = useState<boolean>(false);
  const [psychometricSchedule, setPsychometricSchedule] = useState<RoundSchedule>({
    date: "",
    startTime: "10:00",
    endTime: "10:45",
  });
  const [psychometricDuration, setPsychometricDuration] = useState<number>(45);

  const [geniusEnabled, setGeniusEnabled] = useState<boolean>(false);
  const [geniusSchedule, setGeniusSchedule] = useState<RoundSchedule>({
    date: "",
    startTime: "11:00",
    endTime: "11:45",
  });
  const [geniusDuration, setGeniusDuration] = useState<number>(45);

  // Step 4: Publish Confirmation Popup Modal
  const [publishConfirmModalOpen, setPublishConfirmModalOpen] = useState(false);

  // Credits & Billing
  const [balance, setBalance] = useState<number | null>(null);
  const [subOptionsCatalog, setSubOptionsCatalog] = useState<PipelineSubOptionsCatalog | null>(null);
  const [subOptionCost, setSubOptionCost] = useState(10);
  const [matchVolumeOptions, setMatchVolumeOptions] = useState<MatchVolumeOption[]>([]);
  const [packs, setPacks] = useState<CreditPack[]>([]);
  const [buyModalOpen, setBuyModalOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [loadingCredits, setLoadingCredits] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const loadCredits = () => {
    setLoadingCredits(true);
    recruiterService
      .getCredits()
      .then((res) => {
        setBalance(res.balance);
        setSubOptionsCatalog(res.pipelineSubOptions);
        setSubOptionCost(res.subOptionCost);
        setMatchVolumeOptions(res.matchVolumeOptions);
        setPacks(res.packs);
      })
      .catch(() => {})
      .finally(() => setLoadingCredits(false));
  };

  useEffect(() => {
    loadCredits();
  }, []);

  const applyGeneratedContent = (content: GeneratedJobContent) => {
    setDescription(content.description);
    if (content.skills && content.skills.length > 0) {
      const mapped: JobSkillRequirement[] = content.skills.map((sk) => ({
        name: sk.trim(),
        proficiency: "intermediate" as SkillProficiency,
      }));
      handleRequiredSkillsChange(mapped);
    }
    setHasAiGeneratedContent(true);
    setPendingGeneratedContent(null);
  };

  const handleGenerateContent = async () => {
    if (!title.trim()) return;
    setGenerationError(null);
    setIsGeneratingContent(true);
    try {
      const content = await recruiterService.generateJobContent({
        title: title.trim(),
        employmentType,
        workplaceType,
        location: location.trim() || undefined,
      });

      if (!content) {
        setGenerationError("AI generation is temporarily unavailable. You can still fill this in manually.");
        return;
      }

      const hasExistingContent = description.trim().length > 0 || requiredSkills.length > 0 || preferredSkills.length > 0;
      if (hasExistingContent) {
        setPendingGeneratedContent(content);
      } else {
        applyGeneratedContent(content);
      }
    } catch (err: unknown) {
      setGenerationError((err as { message?: string })?.message || "AI generation is temporarily unavailable. You can still fill this in manually.");
    } finally {
      setIsGeneratingContent(false);
    }
  };

  const toggleSubOption = (section: PipelineSection, key: string) => {
    setSelectedSubOptions((prev) => {
      const next = new Set(prev[section]);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return { ...prev, [section]: next };
    });
  };

  // AI Assist smart suggestions handler
  const handleApplySuggestion = (type: "skills" | "pipeline" | "funnel" | "promotion") => {
    if (type === "skills") {
      const recommended = ["Problem Solving", "Agile Collaboration", "System Design"];
      setPreferredSkills((prev) => Array.from(new Set([...prev, ...recommended])));
    } else if (type === "pipeline") {
      setOnlineTestEnabled(true);
      setOnlineGeneralAptitudeEnabled(true);
      setOnlineTechnicalTestEnabled(true);
      setInterviewEnabled(true);
      setScreeningInterviewEnabled(true);
      setTechnicalInterviewEnabled(true);
      setVideoInterviewEnabled(true);
      setDomainSpecificEnabled(true);
      setAssessmentAiChatEnabled(true);
      setAssessmentAiVoiceEnabled(true);
    } else if (type === "funnel") {
      setMinimumIntake(8);
      setIdealIntake(15);
      setAutoStartEnabled(true);
      setFeaturedJob(true);
    } else if (type === "promotion") {
      setListAsJob(true);
      setFeaturedJob(true);
      setListInLandingPage(true);
      setListInRecentlyPosted(true);
    }
  };

  // Live Credit Calculations
  const summaryLines = useMemo(() => {
    const lines: { key: string; label: string; cost: number }[] = [];

    if (matchVolume) {
      const opt = matchVolumeOptions.find((o) => o.key === matchVolume);
      if (opt) {
        lines.push({ key: `matchVolume:${opt.key}`, label: `Candidate Match ${opt.label}`, cost: opt.credits });
      } else if (matchVolume.startsWith("1:")) {
        lines.push({ key: `matchVolume:${matchVolume}`, label: `Candidate Match ${matchVolume} (Custom)`, cost: 10 });
      }
    }

    if (resumeMatchEnabled) {
      lines.push({ key: "resumeMatch", label: "Resume Shortlisting", cost: subOptionCost });
    }

    if (checkResumeVerification) {
      lines.push({ key: "checkResumeVerification", label: "Check Resume Verification", cost: subOptionCost });
    }

    if (onlineTestEnabled) {
      const sourceLabel = onlineTestSource === "ai" ? "AI" : "Question Bank";
      if (onlineGeneralAptitudeEnabled) {
        const timing = calculateRoundHours(onlineGeneralAptitudeSchedule.startTime, onlineGeneralAptitudeSchedule.endTime);
        const scheduleTag = onlineGeneralAptitudeSchedule.date
          ? ` (${onlineGeneralAptitudeSchedule.date}, ${onlineGeneralAptitudeSchedule.startTime}-${onlineGeneralAptitudeSchedule.endTime} • ${timing.hours > 0 ? `${timing.hours}h` : `${onlineGeneralAptitudeDuration}m`})`
          : ` (${onlineGeneralAptitudeDuration}m)`;
        lines.push({
          key: "onlineTest:generalAptitude",
          label: `Online Test: General Aptitude [${sourceLabel}]${scheduleTag}`,
          cost: subOptionCost,
        });
      }
      if (onlineTechnicalTestEnabled) {
        const timing = calculateRoundHours(onlineTechnicalTestSchedule.startTime, onlineTechnicalTestSchedule.endTime);
        const scheduleTag = onlineTechnicalTestSchedule.date
          ? ` (${onlineTechnicalTestSchedule.date}, ${onlineTechnicalTestSchedule.startTime}-${onlineTechnicalTestSchedule.endTime} • ${timing.hours > 0 ? `${timing.hours}h` : `${onlineTechnicalTestDuration}m`})`
          : ` (${onlineTechnicalTestDuration}m)`;
        lines.push({
          key: "onlineTest:technicalTest",
          label: `Online Test: Technical Test [${sourceLabel}]${scheduleTag}`,
          cost: subOptionCost,
        });
      }
      if (onlineRapidRoundEnabled) {
        const timing = calculateRoundHours(onlineRapidRoundSchedule.startTime, onlineRapidRoundSchedule.endTime);
        const scheduleTag = onlineRapidRoundSchedule.date
          ? ` (${onlineRapidRoundSchedule.date}, ${onlineRapidRoundSchedule.startTime}-${onlineRapidRoundSchedule.endTime} • ${timing.hours > 0 ? `${timing.hours}h` : `${onlineRapidRoundDuration}m`})`
          : ` (${onlineRapidRoundDuration}m)`;
        lines.push({
          key: "onlineTest:rapidRound",
          label: `Online Test: Rapid Round [${sourceLabel}]${scheduleTag}`,
          cost: subOptionCost,
        });
      }
      if (!onlineGeneralAptitudeEnabled && !onlineTechnicalTestEnabled && !onlineRapidRoundEnabled) {
        lines.push({
          key: "onlineTest:base",
          label: `Online Test [${sourceLabel}]`,
          cost: subOptionCost,
        });
      }
    }

    if (assessmentAiChatEnabled) {
      const timing = calculateRoundHours(assessmentAiChatSchedule.startTime, assessmentAiChatSchedule.endTime);
      const scheduleTag = assessmentAiChatSchedule.date
        ? ` (${assessmentAiChatSchedule.date}, ${assessmentAiChatSchedule.startTime}-${assessmentAiChatSchedule.endTime} • ${timing.hours > 0 ? `${timing.hours}h` : `${assessmentAiChatDuration}m`})`
        : ` (${assessmentAiChatDuration}m)`;
      lines.push({
        key: "assessment:aiChat",
        label: `Assessment: AI Chat Assessment${scheduleTag}`,
        cost: subOptionCost,
      });
    }

    if (assessmentAiVoiceEnabled) {
      const timing = calculateRoundHours(assessmentAiVoiceSchedule.startTime, assessmentAiVoiceSchedule.endTime);
      const scheduleTag = assessmentAiVoiceSchedule.date
        ? ` (${assessmentAiVoiceSchedule.date}, ${assessmentAiVoiceSchedule.startTime}-${assessmentAiVoiceSchedule.endTime} • ${timing.hours > 0 ? `${timing.hours}h` : `${assessmentAiVoiceDuration}m`})`
        : ` (${assessmentAiVoiceDuration}m)`;
      lines.push({
        key: "assessment:aiVoice",
        label: `Assessment: AI Voice Assessment${scheduleTag}`,
        cost: subOptionCost,
      });
    }

    if (assessmentDomainEnabled) {
      const timing = calculateRoundHours(assessmentDomainSchedule.startTime, assessmentDomainSchedule.endTime);
      const scheduleTag = assessmentDomainSchedule.date
        ? ` (${assessmentDomainSchedule.date}, ${assessmentDomainSchedule.startTime}-${assessmentDomainSchedule.endTime} • ${timing.hours > 0 ? `${timing.hours}h` : `${assessmentDomainDuration}m`})`
        : ` (${assessmentDomainDuration}m)`;
      lines.push({
        key: "assessment:domain",
        label: `Assessment: Domain Round${scheduleTag}`,
        cost: subOptionCost,
      });
    }

    if (assessmentSkillsEnabled) {
      const timing = calculateRoundHours(assessmentSkillsSchedule.startTime, assessmentSkillsSchedule.endTime);
      const scheduleTag = assessmentSkillsSchedule.date
        ? ` (${assessmentSkillsSchedule.date}, ${assessmentSkillsSchedule.startTime}-${assessmentSkillsSchedule.endTime} • ${timing.hours > 0 ? `${timing.hours}h` : `${assessmentSkillsDuration}m`})`
        : ` (${assessmentSkillsDuration}m)`;
      lines.push({
        key: "assessment:skills",
        label: `Assessment: Skills Round${scheduleTag}`,
        cost: subOptionCost,
      });
    }

    if (assessmentTechnicalEnabled) {
      const timing = calculateRoundHours(assessmentTechnicalSchedule.startTime, assessmentTechnicalSchedule.endTime);
      const scheduleTag = assessmentTechnicalSchedule.date
        ? ` (${assessmentTechnicalSchedule.date}, ${assessmentTechnicalSchedule.startTime}-${assessmentTechnicalSchedule.endTime} • ${timing.hours > 0 ? `${timing.hours}h` : `${assessmentTechnicalDuration}m`})`
        : ` (${assessmentTechnicalDuration}m)`;
      lines.push({
        key: "assessment:technical",
        label: `Assessment: Technical Round${scheduleTag}`,
        cost: subOptionCost,
      });
    }

    if (assessmentRapidEnabled) {
      const timing = calculateRoundHours(assessmentRapidSchedule.startTime, assessmentRapidSchedule.endTime);
      const scheduleTag = assessmentRapidSchedule.date
        ? ` (${assessmentRapidSchedule.date}, ${assessmentRapidSchedule.startTime}-${assessmentRapidSchedule.endTime} • ${timing.hours > 0 ? `${timing.hours}h` : `${assessmentRapidDuration}m`})`
        : ` (${assessmentRapidDuration}m)`;
      const modeLabel = assessmentRapidInterviewType === "ai_online_interview" ? "AI Online Interview" : "Manual Online Interview";
      lines.push({
        key: "assessment:rapidQuestion",
        label: `Assessment: Rapid Question Round [${modeLabel}]${scheduleTag}`,
        cost: subOptionCost,
      });
    }

    if (interviewEnabled) {
      if (screeningInterviewEnabled) {
        const timing = calculateRoundHours(screeningSchedule.startTime, screeningSchedule.endTime);
        const scheduleTag = screeningSchedule.date
          ? ` (${screeningSchedule.date}, ${screeningSchedule.startTime}-${screeningSchedule.endTime} • ${timing.hours > 0 ? `${timing.hours}h` : `${screeningDuration}m`})`
          : ` (${screeningDuration}m)`;
        lines.push({
          key: "interview:screening",
          label: `Screening Interview${scheduleTag}`,
          cost: subOptionCost,
        });
      }
      if (technicalInterviewEnabled) {
        const timing = calculateRoundHours(technicalSchedule.startTime, technicalSchedule.endTime);
        const scheduleTag = technicalSchedule.date
          ? ` (${technicalSchedule.date}, ${technicalSchedule.startTime}-${technicalSchedule.endTime} • ${timing.hours > 0 ? `${timing.hours}h` : `${technicalDuration}m`})`
          : ` (${technicalDuration}m)`;
        lines.push({
          key: "interview:technical",
          label: `Technical Interview${scheduleTag}`,
          cost: subOptionCost,
        });
      }
      if (videoInterviewEnabled) {
        const timing = calculateRoundHours(videoSchedule.startTime, videoSchedule.endTime);
        const scheduleTag = videoSchedule.date
          ? ` (${videoSchedule.date}, ${videoSchedule.startTime}-${videoSchedule.endTime} • ${timing.hours > 0 ? `${timing.hours}h` : `${videoDuration}m`})`
          : ` (${videoDuration}m)`;
        lines.push({
          key: "interview:video",
          label: `Video Interview${scheduleTag}`,
          cost: subOptionCost,
        });
      }
    }

    if (domainSpecificEnabled) {
      const timing = calculateRoundHours(domainSpecificSchedule.startTime, domainSpecificSchedule.endTime);
      const scheduleTag = domainSpecificSchedule.date
        ? ` (${domainSpecificSchedule.date}, ${domainSpecificSchedule.startTime}-${domainSpecificSchedule.endTime} • ${timing.hours > 0 ? `${timing.hours}h` : `${domainSpecificDuration}m`})`
        : ` (${domainSpecificDuration}m)`;
      lines.push({
        key: "assessment:domainSpecific",
        label: `Domain Specific Test${scheduleTag}`,
        cost: subOptionCost,
      });
    }

    // Custom candidate rounds (10 credits per active round)
    customRounds
      .filter((r) => r.enabled)
      .forEach((r) => {
        const timing = calculateRoundHours(r.schedule.startTime, r.schedule.endTime);
        const scheduleTag = r.schedule.date
          ? ` (${r.schedule.date}, ${r.schedule.startTime}-${r.schedule.endTime}${timing.formatted ? ` • ${timing.formatted}` : ""})`
          : ` (${r.durationMinutes}m)`;
        const catLabel =
          r.category === "test"
            ? "Custom Test"
            : r.category === "interview"
            ? "Custom Interview"
            : "Custom Domain Test";
        lines.push({
          key: `custom_round:${r.id}`,
          label: `${catLabel}: ${r.name}${scheduleTag}`,
          cost: subOptionCost,
        });
      });

    if (listAsJob) {
      lines.push({ key: "promotion:listing", label: "Standard Job Listing", cost: 10 });
    }

    if (featuredJob) {
      lines.push({ key: "promotion:featured", label: "Featured Job Promotion", cost: 10 });
    }

    if (listInLandingPage) {
      lines.push({ key: "promotion:landingPage", label: "List in Landing Page", cost: 10 });
    }

    if (listInRecentlyPosted) {
      lines.push({ key: "promotion:recentlyPosted", label: "List in Recently Posted Section", cost: 10 });
    }

    return lines;
  }, [
    matchVolume,
    matchVolumeOptions,
    resumeMatchEnabled,
    checkResumeVerification,
    onlineTestEnabled,
    onlineTestSource,
    onlineGeneralAptitudeEnabled,
    onlineGeneralAptitudeSchedule,
    onlineGeneralAptitudeDuration,
    onlineTechnicalTestEnabled,
    onlineTechnicalTestSchedule,
    onlineTechnicalTestDuration,
    onlineRapidRoundEnabled,
    onlineRapidRoundSchedule,
    onlineRapidRoundDuration,
    interviewEnabled,
    screeningInterviewEnabled,
    screeningSchedule,
    screeningDuration,
    technicalInterviewEnabled,
    technicalSchedule,
    technicalDuration,
    videoInterviewEnabled,
    videoSchedule,
    videoDuration,
    domainSpecificEnabled,
    domainSpecificSchedule,
    domainSpecificDuration,
    assessmentAiChatEnabled,
    assessmentAiChatSchedule,
    assessmentAiChatDuration,
    assessmentAiVoiceEnabled,
    assessmentAiVoiceSchedule,
    assessmentAiVoiceDuration,
    assessmentDomainEnabled,
    assessmentDomainSchedule,
    assessmentDomainDuration,
    assessmentSkillsEnabled,
    assessmentSkillsSchedule,
    assessmentSkillsDuration,
    assessmentTechnicalEnabled,
    assessmentTechnicalSchedule,
    assessmentTechnicalDuration,
    assessmentRapidEnabled,
    assessmentRapidInterviewType,
    assessmentRapidSchedule,
    assessmentRapidDuration,
    customRounds,
    listAsJob,
    featuredJob,
    listInLandingPage,
    listInRecentlyPosted,
    subOptionCost,
  ]);

  const totalCost = summaryLines.reduce((sum, l) => sum + l.cost, 0);
  const balanceAfterPublish = balance != null ? balance - totalCost : null;
  const hasInsufficientCredits = balance != null && totalCost > balance;

  const buildAssessmentRounds = (): AssessmentRoundConfig[] => {
    const rounds: AssessmentRoundConfig[] = [];

    if (onlineTestEnabled) {
      if (onlineGeneralAptitudeEnabled) {
        const timing = calculateRoundHours(onlineGeneralAptitudeSchedule.startTime, onlineGeneralAptitudeSchedule.endTime);
        rounds.push({
          id: "round_general_aptitude",
          type: "general_aptitude",
          order: rounds.length + 1,
          name: "General Aptitude",
          enabled: true,
          date: onlineGeneralAptitudeSchedule.date || undefined,
          startTime: onlineGeneralAptitudeSchedule.startTime || undefined,
          endTime: onlineGeneralAptitudeSchedule.endTime || undefined,
          durationHours: timing.hours > 0 ? timing.hours : undefined,
          config: {
            source: onlineTestSource,
            questionCount: onlineGeneralAptitudeQuestions,
            durationMinutes: onlineGeneralAptitudeDuration,
            passingScore: onlineGeneralAptitudePassScore,
            customQuestions: roundQuestionsMap["round_general_aptitude"] || onlineTestCustomQuestions,
            schedule: {
              date: onlineGeneralAptitudeSchedule.date,
              startTime: onlineGeneralAptitudeSchedule.startTime,
              endTime: onlineGeneralAptitudeSchedule.endTime,
              durationHours: timing.hours,
              durationFormatted: timing.formatted,
            },
          },
        });
      }

      if (onlineTechnicalTestEnabled) {
        const timing = calculateRoundHours(onlineTechnicalTestSchedule.startTime, onlineTechnicalTestSchedule.endTime);
        rounds.push({
          id: "round_technical_test",
          type: "technical_test",
          order: rounds.length + 1,
          name: "Technical Test",
          enabled: true,
          date: onlineTechnicalTestSchedule.date || undefined,
          startTime: onlineTechnicalTestSchedule.startTime || undefined,
          endTime: onlineTechnicalTestSchedule.endTime || undefined,
          durationHours: timing.hours > 0 ? timing.hours : undefined,
          config: {
            source: onlineTestSource,
            questionCount: onlineTechnicalTestQuestions,
            durationMinutes: onlineTechnicalTestDuration,
            passingScore: onlineTechnicalTestPassScore,
            customQuestions: roundQuestionsMap["round_technical_test"],
            schedule: {
              date: onlineTechnicalTestSchedule.date,
              startTime: onlineTechnicalTestSchedule.startTime,
              endTime: onlineTechnicalTestSchedule.endTime,
              durationHours: timing.hours,
              durationFormatted: timing.formatted,
            },
          },
        });
      }

      if (onlineRapidRoundEnabled) {
        const timing = calculateRoundHours(onlineRapidRoundSchedule.startTime, onlineRapidRoundSchedule.endTime);
        rounds.push({
          id: "round_rapid_round",
          type: "rapid_round",
          order: rounds.length + 1,
          name: "Rapid Round",
          enabled: true,
          date: onlineRapidRoundSchedule.date || undefined,
          startTime: onlineRapidRoundSchedule.startTime || undefined,
          endTime: onlineRapidRoundSchedule.endTime || undefined,
          durationHours: timing.hours > 0 ? timing.hours : undefined,
          config: {
            source: onlineTestSource,
            questionCount: onlineRapidRoundQuestions,
            durationMinutes: onlineRapidRoundDuration,
            passingScore: onlineRapidRoundPassScore,
            customQuestions: roundQuestionsMap["round_rapid_round"],
            schedule: {
              date: onlineRapidRoundSchedule.date,
              startTime: onlineRapidRoundSchedule.startTime,
              endTime: onlineRapidRoundSchedule.endTime,
              durationHours: timing.hours,
              durationFormatted: timing.formatted,
            },
          },
        });
      }

      // If Online Test is enabled but no sub-rounds were checked, provide general_aptitude as default
      if (!onlineGeneralAptitudeEnabled && !onlineTechnicalTestEnabled && !onlineRapidRoundEnabled) {
        rounds.push({
          id: "round_general_aptitude",
          type: "general_aptitude",
          order: rounds.length + 1,
          name: "Online Test",
          enabled: true,
          config: {
            source: onlineTestSource,
            durationMinutes: 45,
            passingScore: 70,
          },
        });
      }
    }

    // Assessment Section Rounds
    // 1. AI Chat Assessment Round
    if (assessmentAiChatEnabled) {
      const timing = calculateRoundHours(assessmentAiChatSchedule.startTime, assessmentAiChatSchedule.endTime);
      rounds.push({
        id: "round_ai_chat",
        type: "ai_chat",
        order: rounds.length + 1,
        name: "AI Chat Assessment",
        enabled: true,
        date: assessmentAiChatSchedule.date || undefined,
        startTime: assessmentAiChatSchedule.startTime || undefined,
        endTime: assessmentAiChatSchedule.endTime || undefined,
        durationHours: timing.hours > 0 ? timing.hours : undefined,
        config: {
          modality: "chat",
          modalities: ["chat"],
          durationMinutes: assessmentAiChatDuration,
          questionCount: assessmentAiChatQuestionCount,
          difficulty: assessmentAiChatDifficulty,
          passingScore: assessmentAiChatPassScore,
          customQuestions: roundQuestionsMap["round_ai_chat"] || undefined,
          topics: roundQuestionsMap["round_ai_chat"]?.length
            ? roundQuestionsMap["round_ai_chat"].map((q) => q.question)
            : [
                "System State Management, Concurrency & Data Flow Patterns",
                "API Contract Design, Schema Validation & Database Query Optimization",
                "Asynchronous Workflows, Memory Leak Prevention & Error Boundaries",
                "Automated Testing Strategy, CI/CD Pipeline & Production Resilience",
              ],
          schedule: {
            date: assessmentAiChatSchedule.date,
            startTime: assessmentAiChatSchedule.startTime,
            endTime: assessmentAiChatSchedule.endTime,
            durationHours: timing.hours,
            durationFormatted: timing.formatted,
          },
        },
      });
    }

    // 2. AI Voice Assessment Round
    if (assessmentAiVoiceEnabled) {
      const timing = calculateRoundHours(assessmentAiVoiceSchedule.startTime, assessmentAiVoiceSchedule.endTime);
      rounds.push({
        id: "round_ai_voice",
        type: "ai_voice",
        order: rounds.length + 1,
        name: "AI Voice Assessment",
        enabled: true,
        date: assessmentAiVoiceSchedule.date || undefined,
        startTime: assessmentAiVoiceSchedule.startTime || undefined,
        endTime: assessmentAiVoiceSchedule.endTime || undefined,
        durationHours: timing.hours > 0 ? timing.hours : undefined,
        config: {
          modality: "voice",
          modalities: ["voice"],
          durationMinutes: assessmentAiVoiceDuration,
          questionCount: assessmentAiVoiceQuestionCount,
          difficulty: assessmentAiVoiceDifficulty,
          passingScore: assessmentAiVoicePassScore,
          customQuestions: roundQuestionsMap["round_ai_voice"] || undefined,
          topics: roundQuestionsMap["round_ai_voice"]?.length
            ? roundQuestionsMap["round_ai_voice"].map((q) => q.question)
            : [
                "Verbal Architecture Walkthrough & System Scalability Trade-offs",
                "Live Production Outage Verbal Triage & Root Cause Articulation",
                "Engineering Leadership, Resolving Technical Disagreements & Mentorship",
                "Communicating Technical Debt & Architectural Decisions to Non-Technical Stakeholders",
              ],
          schedule: {
            date: assessmentAiVoiceSchedule.date,
            startTime: assessmentAiVoiceSchedule.startTime,
            endTime: assessmentAiVoiceSchedule.endTime,
            durationHours: timing.hours,
            durationFormatted: timing.formatted,
          },
        },
      });
    }

    if (assessmentDomainEnabled) {
      const timing = calculateRoundHours(assessmentDomainSchedule.startTime, assessmentDomainSchedule.endTime);
      rounds.push({
        id: "round_domain",
        type: "domain",
        order: rounds.length + 1,
        name: "Assessment: Domain Round",
        enabled: true,
        date: assessmentDomainSchedule.date || undefined,
        startTime: assessmentDomainSchedule.startTime || undefined,
        endTime: assessmentDomainSchedule.endTime || undefined,
        durationHours: timing.hours > 0 ? timing.hours : undefined,
        config: {
          durationMinutes: assessmentDomainDuration,
          passingScore: assessmentDomainPassScore,
          schedule: {
            date: assessmentDomainSchedule.date,
            startTime: assessmentDomainSchedule.startTime,
            endTime: assessmentDomainSchedule.endTime,
            durationHours: timing.hours,
            durationFormatted: timing.formatted,
          },
        },
      });
    }

    if (assessmentSkillsEnabled) {
      const timing = calculateRoundHours(assessmentSkillsSchedule.startTime, assessmentSkillsSchedule.endTime);
      rounds.push({
        id: "round_skills",
        type: "skills",
        order: rounds.length + 1,
        name: "Assessment: Skills Round",
        enabled: true,
        date: assessmentSkillsSchedule.date || undefined,
        startTime: assessmentSkillsSchedule.startTime || undefined,
        endTime: assessmentSkillsSchedule.endTime || undefined,
        durationHours: timing.hours > 0 ? timing.hours : undefined,
        config: {
          durationMinutes: assessmentSkillsDuration,
          passingScore: assessmentSkillsPassScore,
          schedule: {
            date: assessmentSkillsSchedule.date,
            startTime: assessmentSkillsSchedule.startTime,
            endTime: assessmentSkillsSchedule.endTime,
            durationHours: timing.hours,
            durationFormatted: timing.formatted,
          },
        },
      });
    }

    if (assessmentTechnicalEnabled) {
      const timing = calculateRoundHours(assessmentTechnicalSchedule.startTime, assessmentTechnicalSchedule.endTime);
      rounds.push({
        id: "round_technical",
        type: "technical",
        order: rounds.length + 1,
        name: "Assessment: Technical Round",
        enabled: true,
        date: assessmentTechnicalSchedule.date || undefined,
        startTime: assessmentTechnicalSchedule.startTime || undefined,
        endTime: assessmentTechnicalSchedule.endTime || undefined,
        durationHours: timing.hours > 0 ? timing.hours : undefined,
        config: {
          durationMinutes: assessmentTechnicalDuration,
          passingScore: assessmentTechnicalPassScore,
          schedule: {
            date: assessmentTechnicalSchedule.date,
            startTime: assessmentTechnicalSchedule.startTime,
            endTime: assessmentTechnicalSchedule.endTime,
            durationHours: timing.hours,
            durationFormatted: timing.formatted,
          },
        },
      });
    }

    if (assessmentRapidEnabled) {
      const timing = calculateRoundHours(assessmentRapidSchedule.startTime, assessmentRapidSchedule.endTime);
      rounds.push({
        id: "round_rapid_question",
        type: "rapid_question",
        order: rounds.length + 1,
        name: `Assessment: Rapid Question Round (${assessmentRapidInterviewType === "ai_online_interview" ? "AI Online Interview" : "Manual Online Interview"})`,
        enabled: true,
        date: assessmentRapidSchedule.date || undefined,
        startTime: assessmentRapidSchedule.startTime || undefined,
        endTime: assessmentRapidSchedule.endTime || undefined,
        durationHours: timing.hours > 0 ? timing.hours : undefined,
        config: {
          interviewMode: assessmentRapidInterviewType,
          durationMinutes: assessmentRapidDuration,
          passingScore: assessmentRapidPassScore,
          schedule: {
            date: assessmentRapidSchedule.date,
            startTime: assessmentRapidSchedule.startTime,
            endTime: assessmentRapidSchedule.endTime,
            durationHours: timing.hours,
            durationFormatted: timing.formatted,
          },
        },
      });
    }

    // Interview Section Rounds (Screening, Technical & Video)
    if (interviewEnabled) {
      if (screeningInterviewEnabled) {
        const timing = calculateRoundHours(screeningSchedule.startTime, screeningSchedule.endTime);
        rounds.push({
          id: "round_screening_interview",
          type: "screening_interview" as any,
          order: rounds.length + 1,
          name: "Screening Interview",
          enabled: true,
          date: screeningSchedule.date || undefined,
          startTime: screeningSchedule.startTime || undefined,
          endTime: screeningSchedule.endTime || undefined,
          durationHours: timing.hours > 0 ? timing.hours : undefined,
          config: {
            durationMinutes: screeningDuration,
            schedule: {
              date: screeningSchedule.date,
              startTime: screeningSchedule.startTime,
              endTime: screeningSchedule.endTime,
              durationHours: timing.hours,
              durationFormatted: timing.formatted,
            },
          },
        });
      }

      if (technicalInterviewEnabled) {
        const timing = calculateRoundHours(technicalSchedule.startTime, technicalSchedule.endTime);
        rounds.push({
          id: "round_technical_interview",
          type: "technical_interview" as any,
          order: rounds.length + 1,
          name: "Technical Interview",
          enabled: true,
          date: technicalSchedule.date || undefined,
          startTime: technicalSchedule.startTime || undefined,
          endTime: technicalSchedule.endTime || undefined,
          durationHours: timing.hours > 0 ? timing.hours : undefined,
          config: {
            durationMinutes: technicalDuration,
            schedule: {
              date: technicalSchedule.date,
              startTime: technicalSchedule.startTime,
              endTime: technicalSchedule.endTime,
              durationHours: timing.hours,
              durationFormatted: timing.formatted,
            },
          },
        });
      }

      if (videoInterviewEnabled) {
        const timing = calculateRoundHours(videoSchedule.startTime, videoSchedule.endTime);
        rounds.push({
          id: "round_video_interview",
          type: "video_interview" as any,
          order: rounds.length + 1,
          name: "Video Interview",
          enabled: true,
          date: videoSchedule.date || undefined,
          startTime: videoSchedule.startTime || undefined,
          endTime: videoSchedule.endTime || undefined,
          durationHours: timing.hours > 0 ? timing.hours : undefined,
          config: {
            durationMinutes: videoDuration,
            schedule: {
              date: videoSchedule.date,
              startTime: videoSchedule.startTime,
              endTime: videoSchedule.endTime,
              durationHours: timing.hours,
              durationFormatted: timing.formatted,
            },
          },
        });
      }
    }

    if (domainSpecificEnabled) {
      const timing = calculateRoundHours(domainSpecificSchedule.startTime, domainSpecificSchedule.endTime);
      rounds.push({
        id: "round_domain_specific",
        type: "domain_specific" as any,
        order: rounds.length + 1,
        name: "Domain Specific Test",
        enabled: true,
        date: domainSpecificSchedule.date || undefined,
        startTime: domainSpecificSchedule.startTime || undefined,
        endTime: domainSpecificSchedule.endTime || undefined,
        durationHours: timing.hours > 0 ? timing.hours : undefined,
        config: {
          questionCount: domainSpecificQuestions,
          durationMinutes: domainSpecificDuration,
          passingScore: domainSpecificPassingScore,
          customQuestions: roundQuestionsMap["round_domain_specific"] || domainCustomQuestions,
          schedule: {
            date: domainSpecificSchedule.date,
            startTime: domainSpecificSchedule.startTime,
            endTime: domainSpecificSchedule.endTime,
            durationHours: timing.hours,
            durationFormatted: timing.formatted,
          },
        },
      });
    }

    // Custom Candidate Assessment Rounds (Test, Interview, Domain)
    customRounds
      .filter((r) => r.enabled)
      .forEach((r) => {
        const timing = calculateRoundHours(r.schedule.startTime, r.schedule.endTime);
        const roundType =
          r.category === "test"
            ? "custom_test"
            : r.category === "interview"
            ? "custom_interview"
            : "custom_domain";

        rounds.push({
          id: r.id,
          type: roundType as any,
          order: rounds.length + 1,
          name: r.name,
          enabled: true,
          date: r.schedule.date || undefined,
          startTime: r.schedule.startTime || undefined,
          endTime: r.schedule.endTime || undefined,
          durationHours: timing.hours > 0 ? timing.hours : undefined,
          config: {
            category: r.category,
            description: r.description,
            durationMinutes: r.durationMinutes,
            schedule: {
              date: r.schedule.date,
              startTime: r.schedule.startTime,
              endTime: r.schedule.endTime,
              durationHours: timing.hours,
              durationFormatted: timing.formatted,
            },
            ...(r.category === "test"
              ? {
                  testFormat: r.testFormat,
                  questionCount: r.questionCount,
                  passingScore: r.passingScore,
                }
              : {}),
            ...(r.category === "interview"
              ? {
                  interviewType: r.interviewType,
                  interviewerRole: r.interviewerRole,
                }
              : {}),
            ...(r.category === "domain"
              ? {
                  domainArea: r.domainArea,
                  testingMode: r.testingMode,
                  passingScore: r.passingScore,
                  instructions: r.instructions,
                }
              : {}),
          },
        });
      });

    return rounds;
  };

  const buildPipelineOptions = (): PipelineOptions => {
    const rounds = buildAssessmentRounds();
    const interviewTypes: string[] = [];
    if (interviewEnabled) {
      if (screeningInterviewEnabled) interviewTypes.push("screening");
      if (technicalInterviewEnabled) interviewTypes.push("technical");
      if (videoInterviewEnabled) interviewTypes.push("video");
    }

    const screeningTiming = calculateRoundHours(screeningSchedule.startTime, screeningSchedule.endTime);
    const technicalTiming = calculateRoundHours(technicalSchedule.startTime, technicalSchedule.endTime);
    const videoTiming = calculateRoundHours(videoSchedule.startTime, videoSchedule.endTime);

    return {
      matchVolume,
      resumeMatch: resumeMatchEnabled,
      resumeMatchTypes: Array.from(selectedSubOptions.resumeMatch),
      checkResumeVerification,
      onlineTestSource,
      assessment: rounds.length > 0,
      assessmentTypes: rounds.map((r) => r.type),
      aiInterview: interviewEnabled && interviewTypes.length > 0,
      aiInterviewTypes: interviewTypes,
      listAsJob,
      featuredJob,
      listInLandingPage,
      listInRecentlyPosted,
      screeningSchedule: screeningInterviewEnabled ? {
        date: screeningSchedule.date || undefined,
        startTime: screeningSchedule.startTime || undefined,
        endTime: screeningSchedule.endTime || undefined,
        durationHours: screeningTiming.hours > 0 ? screeningTiming.hours : undefined,
      } : undefined,
      technicalSchedule: technicalInterviewEnabled ? {
        date: technicalSchedule.date || undefined,
        startTime: technicalSchedule.startTime || undefined,
        endTime: technicalSchedule.endTime || undefined,
        durationHours: technicalTiming.hours > 0 ? technicalTiming.hours : undefined,
      } : undefined,
      videoSchedule: videoInterviewEnabled ? {
        date: videoSchedule.date || undefined,
        startTime: videoSchedule.startTime || undefined,
        endTime: videoSchedule.endTime || undefined,
        durationHours: videoTiming.hours > 0 ? videoTiming.hours : undefined,
      } : undefined,
      linguisticTest: {
        enabled: linguisticTestEnabled,
        speak: linguisticSpeak,
        read: linguisticRead,
        write: linguisticWrite,
        fluencyScore: linguisticFluencyScore,
        expertiseScore: linguisticExpertiseScore,
        nativeSpeaker: linguisticNative,
        certificateType: linguisticCertType,
        certificateScore: linguisticCertScore,
      },
      psychometricGeniusTest: {
        psychometricEnabled,
        geniusEnabled,
        psychometricSchedule: psychometricEnabled ? {
          date: psychometricSchedule.date || undefined,
          startTime: psychometricSchedule.startTime || undefined,
          endTime: psychometricSchedule.endTime || undefined,
          durationMinutes: psychometricDuration || undefined,
        } : undefined,
        geniusSchedule: geniusEnabled ? {
          date: geniusSchedule.date || undefined,
          startTime: geniusSchedule.startTime || undefined,
          endTime: geniusSchedule.endTime || undefined,
          durationMinutes: geniusDuration || undefined,
        } : undefined,
        psychometricDuration: psychometricEnabled ? psychometricDuration : undefined,
        geniusDuration: geniusEnabled ? geniusDuration : undefined,
      },
    };
  };

  const validateStep1 = () => {
    if (!title.trim()) {
      setLocalError("Job title is required before proceeding.");
      return false;
    }
    setLocalError(null);
    return true;
  };

  const validateStep2 = () => {
    if (customRatioError) {
      setLocalError(customRatioError);
      return false;
    }
    setLocalError(null);
    return true;
  };

  const validateStep3 = () => {
    if (finalShortlistTarget <= 0) {
      setLocalError("Final shortlist target must be at least 1.");
      return false;
    }
    if (idealIntake < finalShortlistTarget) {
      setLocalError("Ideal candidate intake should be at least equal to the final shortlist target.");
      return false;
    }
    setLocalError(null);
    return true;
  };

  const validateCommonFields = () => {
    if (!title.trim()) {
      setLocalError("Job title is required.");
      return false;
    }
    if (customRatioError) {
      setLocalError(customRatioError);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    setLocalError(null);
    if (!validateCommonFields()) return;

    const minExpNum = minimumExperience.trim() !== "" ? Number(minimumExperience) : undefined;
    const maxExpNum = maximumExperience.trim() !== "" ? Number(maximumExperience) : undefined;

    if (minExpNum !== undefined && (isNaN(minExpNum) || minExpNum < 0)) {
      setLocalError("Minimum experience must be a non-negative number.");
      return;
    }
    if (maxExpNum !== undefined && (isNaN(maxExpNum) || maxExpNum < 0)) {
      setLocalError("Maximum experience must be a non-negative number.");
      return;
    }
    if (minExpNum !== undefined && maxExpNum !== undefined && maxExpNum < minExpNum) {
      setLocalError("Maximum experience cannot be less than minimum experience.");
      return;
    }

    if (hasInsufficientCredits) {
      setLocalError("Insufficient credits. Please buy more credits before publishing.");
      return;
    }

    const eduFieldsList = educationFieldsText
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    const structuredRequirements: JobRequirements = {
      requiredSkills,
      preferredSkills,
      minimumExperienceYears: minExpNum,
      maximumExperienceYears: maxExpNum,
      education: {
        minimumLevel: educationLevel,
        fields: eduFieldsList,
      },
    };

    const allSkills = Array.from(new Set([...requiredSkills.map((s) => s.name), ...preferredSkills]));

    const responsibilitiesList = responsibilitiesText
      .split("\n")
      .map((r) => r.replace(/^[-•*]\s*/, "").trim())
      .filter(Boolean);

    const rounds = buildAssessmentRounds();

    setIsSubmitting(true);
    try {
      const job = await recruiterService.createJob({
        title: title.trim(),
        location: location.trim(),
        employmentType,
        workplaceType,
        salaryText: salaryText.trim(),
        skills: allSkills,
        description: description.trim(),
        responsibilities: responsibilitiesList,
        minimumExperience: minExpNum,
        maximumExperience: maxExpNum,
        structuredRequirements,
        assessment: {
          enabled: rounds.length > 0,
          rounds,
        },
        checkResumeVerification,
        pipelineOptions: buildPipelineOptions(),
        listAsJob,
        featuredJob,
        listInLandingPage,
        listInRecentlyPosted,
        linguisticTest: {
          enabled: linguisticTestEnabled,
          speak: linguisticSpeak,
          read: linguisticRead,
          write: linguisticWrite,
          fluencyScore: linguisticFluencyScore,
          expertiseScore: linguisticExpertiseScore,
          nativeSpeaker: linguisticNative,
          certificateType: linguisticCertType,
          certificateScore: linguisticCertScore,
        },
        psychometricGeniusTest: {
          psychometricEnabled,
          geniusEnabled,
          psychometricSchedule: psychometricEnabled ? {
            date: psychometricSchedule.date || undefined,
            startTime: psychometricSchedule.startTime || undefined,
            endTime: psychometricSchedule.endTime || undefined,
            durationMinutes: psychometricDuration || undefined,
          } : undefined,
          geniusSchedule: geniusEnabled ? {
            date: geniusSchedule.date || undefined,
            startTime: geniusSchedule.startTime || undefined,
            endTime: geniusSchedule.endTime || undefined,
            durationMinutes: geniusDuration || undefined,
          } : undefined,
          psychometricDuration: psychometricEnabled ? psychometricDuration : undefined,
          geniusDuration: geniusEnabled ? geniusDuration : undefined,
        },
        finalShortlistTarget: finalShortlistTarget > 0 ? finalShortlistTarget : 10,
        idealIntake: idealIntake > 0 ? idealIntake : 15,
        minimumIntake: minimumIntake > 0 ? minimumIntake : 8,
        collectionDurationDays: collectionDurationDays > 0 ? collectionDurationDays : 7,
        autoExtensionEnabled,
        extensionDurationDays: extensionDurationDays > 0 ? extensionDurationDays : 3,
        maxExtensions: maxExtensions >= 0 ? maxExtensions : 2,
        autoStartEnabled,
      });
      router.push(`/recruiter/jobs/${job._id}`);
    } catch (err: unknown) {
      setLocalError((err as { message?: string })?.message || "Failed to create job.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setLocalError(null);
    if (!validateCommonFields()) return;

    const minExpNum = minimumExperience.trim() !== "" ? Number(minimumExperience) : undefined;
    const maxExpNum = maximumExperience.trim() !== "" ? Number(maximumExperience) : undefined;

    if (minExpNum !== undefined && (isNaN(minExpNum) || minExpNum < 0)) {
      setLocalError("Minimum experience must be a non-negative number.");
      return;
    }
    if (maxExpNum !== undefined && (isNaN(maxExpNum) || maxExpNum < 0)) {
      setLocalError("Maximum experience must be a non-negative number.");
      return;
    }
    if (minExpNum !== undefined && maxExpNum !== undefined && maxExpNum < minExpNum) {
      setLocalError("Maximum experience cannot be less than minimum experience.");
      return;
    }

    const eduFieldsList = educationFieldsText
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    const structuredRequirements: JobRequirements = {
      requiredSkills,
      preferredSkills,
      minimumExperienceYears: minExpNum,
      maximumExperienceYears: maxExpNum,
      education: {
        minimumLevel: educationLevel,
        fields: eduFieldsList,
      },
    };

    const allSkills = Array.from(new Set([...requiredSkills.map((s) => s.name), ...preferredSkills]));

    const responsibilitiesList = responsibilitiesText
      .split("\n")
      .map((r) => r.replace(/^[-•*]\s*/, "").trim())
      .filter(Boolean);

    const rounds = buildAssessmentRounds();

    setIsSavingDraft(true);
    try {
      const job = await recruiterService.createJob({
        title: title.trim(),
        location: location.trim(),
        employmentType,
        workplaceType,
        salaryText: salaryText.trim(),
        skills: allSkills,
        description: description.trim(),
        responsibilities: responsibilitiesList,
        minimumExperience: minExpNum,
        maximumExperience: maxExpNum,
        structuredRequirements,
        saveAsDraft: true,
        assessment: {
          enabled: rounds.length > 0,
          rounds,
        },
        checkResumeVerification,
        pipelineOptions: buildPipelineOptions(),
        listAsJob,
        featuredJob,
        listInLandingPage,
        listInRecentlyPosted,
        linguisticTest: {
          enabled: linguisticTestEnabled,
          speak: linguisticSpeak,
          read: linguisticRead,
          write: linguisticWrite,
          fluencyScore: linguisticFluencyScore,
          expertiseScore: linguisticExpertiseScore,
          nativeSpeaker: linguisticNative,
          certificateType: linguisticCertType,
          certificateScore: linguisticCertScore,
        },
        psychometricGeniusTest: {
          psychometricEnabled,
          geniusEnabled,
          psychometricSchedule: psychometricEnabled ? {
            date: psychometricSchedule.date || undefined,
            startTime: psychometricSchedule.startTime || undefined,
            endTime: psychometricSchedule.endTime || undefined,
            durationMinutes: psychometricDuration || undefined,
          } : undefined,
          geniusSchedule: geniusEnabled ? {
            date: geniusSchedule.date || undefined,
            startTime: geniusSchedule.startTime || undefined,
            endTime: geniusSchedule.endTime || undefined,
            durationMinutes: geniusDuration || undefined,
          } : undefined,
          psychometricDuration: psychometricEnabled ? psychometricDuration : undefined,
          geniusDuration: geniusEnabled ? geniusDuration : undefined,
        },
        finalShortlistTarget: finalShortlistTarget > 0 ? finalShortlistTarget : 10,
        idealIntake: idealIntake > 0 ? idealIntake : 15,
        minimumIntake: minimumIntake > 0 ? minimumIntake : 8,
        collectionDurationDays: collectionDurationDays > 0 ? collectionDurationDays : 7,
        autoExtensionEnabled,
        extensionDurationDays: extensionDurationDays > 0 ? extensionDurationDays : 3,
        maxExtensions: maxExtensions >= 0 ? maxExtensions : 2,
        autoStartEnabled,
      });
      router.push(`/recruiter/jobs/${job._id}`);
    } catch (err: unknown) {
      setLocalError((err as { message?: string })?.message || "Failed to save draft.");
    } finally {
      setIsSavingDraft(false);
    }
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Top Header Banner in Letgetin UI Blue Style */}
      <div className="relative overflow-hidden bg-gradient-brand rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-9 shadow-elegant text-white border border-white/10">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-primary-glow/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-32 bg-white/5 rotate-12 blur-2xl pointer-events-none" />

        {/* Divided by half: Left side (Page details) & Right side (Mockup UI content) */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* Left Column: What page is this & description */}
          <div className="space-y-3.5">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white/90 bg-white/15 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 shadow-xs">
              <Briefcase className="w-3.5 h-3.5 text-white" />
              <span>{orgProfile?.name ? `${orgProfile.name} · Role Studio` : "Letgetin Recruitment · Role Studio"}</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Create a New Job
              </h1>
              <p className="text-white/80 mt-2 text-sm sm:text-base leading-relaxed max-w-xl">
                Configure your tailored hiring pipeline for this role. Customize AI candidate matching volume, automated assessments, and interactive interviews with pay-per-feature precision.
              </p>
            </div>

            {/* Feature Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 bg-white/10 border border-white/15 px-3 py-1 rounded-lg backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" /> AI Description
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 bg-white/10 border border-white/15 px-3 py-1 rounded-lg backdrop-blur-xs">
                <Zap className="w-3.5 h-3.5 text-amber-300" /> Auto-Shortlisting
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/90 bg-white/10 border border-white/15 px-3 py-1 rounded-lg backdrop-blur-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" /> Proctored Rounds
              </span>
            </div>
          </div>

          {/* Right Column: Mockup UI with Current Plan, Upgrade Plan button & Credit summary / balance */}
          <div>
            <div className="bg-white/12 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center shrink-0 shadow-xs">
                    <Crown className="w-5 h-5 text-amber-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                        Current Plan
                      </span>
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-300 bg-emerald-500/25 border border-emerald-400/30 px-1.5 py-0.5 rounded-full">
                        <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" /> Active
                      </span>
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-white truncate">
                      Growth Recruiter Pro
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setUpgradeModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-ink hover:bg-white/90 px-3.5 py-2 rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-95 shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Upgrade Plan
                </button>
              </div>

              <div className="h-px bg-white/15" />

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-400/20 border border-cyan-300/30 flex items-center justify-center shrink-0 shadow-xs">
                    <Zap className="w-5 h-5 text-cyan-300" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-white/70 block">
                      Credit Balance
                    </span>
                    <span className="text-lg sm:text-xl font-black text-white">
                      {loadingCredits ? "…" : `${balance ?? 0} Credits`}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setBuyModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/25 px-3.5 py-2 rounded-xl transition-all hover:scale-[1.02] active:scale-95 shrink-0 cursor-pointer"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-white" />
                  Buy credits
                </button>
              </div>

              <div className="bg-black/25 border border-white/10 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/80">Role Pipeline Cost</span>
                  <span className="font-extrabold text-white">{totalCost} credits</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      hasInsufficientCredits ? "bg-rose-400" : "bg-cyan-300"
                    }`}
                    style={{
                      width: `${
                        balance && balance > 0
                          ? Math.min(100, Math.max(8, (totalCost / balance) * 100))
                          : totalCost > 0
                          ? 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-white/70">
                  <span>
                    Balance after publish:{" "}
                    <strong className="text-white font-semibold">
                      {balanceAfterPublish != null ? `${balanceAfterPublish} cr` : "—"}
                    </strong>
                  </span>
                  <span
                    className={
                      hasInsufficientCredits
                        ? "text-rose-300 font-semibold"
                        : "text-emerald-300 font-semibold"
                    }
                  >
                    {hasInsufficientCredits ? "Low balance" : "Ready"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Step Wizard Navigation */}
      <div className="bg-surface border border-border rounded-2xl p-2 shadow-xs flex items-center justify-between gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setStep(1)}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            step === 1
              ? "bg-gradient-brand text-white shadow-sm"
              : step > 1
              ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
              : "text-ink-soft hover:text-ink hover:bg-surface-alt"
          }`}
        >
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              step === 1
                ? "bg-white/20 text-white"
                : step > 1
                ? "bg-emerald-500 text-white"
                : "bg-surface-alt text-ink-soft border border-border"
            }`}
          >
            {step > 1 ? <Check className="w-3 h-3" /> : "1"}
          </span>
          <span className="truncate">1. Role Definition</span>
        </button>

        <ChevronRight className="w-4 h-4 text-ink-soft/40 shrink-0" />

        <button
          type="button"
          onClick={() => {
            if (validateStep1()) setStep(2);
          }}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            step === 2
              ? "bg-gradient-brand text-white shadow-sm"
              : step > 2
              ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
              : "text-ink-soft hover:text-ink hover:bg-surface-alt"
          }`}
        >
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              step === 2
                ? "bg-white/20 text-white"
                : step > 2
                ? "bg-emerald-500 text-white"
                : "bg-surface-alt text-ink-soft border border-border"
            }`}
          >
            {step > 2 ? <Check className="w-3 h-3" /> : "2"}
          </span>
          <span className="truncate">2. Pipeline &amp; Assessment</span>
        </button>

        <ChevronRight className="w-4 h-4 text-ink-soft/40 shrink-0" />

        <button
          type="button"
          onClick={() => {
            if (validateStep1() && validateStep2()) setStep(3);
          }}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            step === 3
              ? "bg-gradient-brand text-white shadow-sm"
              : step > 3
              ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
              : "text-ink-soft hover:text-ink hover:bg-surface-alt"
          }`}
        >
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              step === 3
                ? "bg-white/20 text-white"
                : step > 3
                ? "bg-emerald-500 text-white"
                : "bg-surface-alt text-ink-soft border border-border"
            }`}
          >
            {step > 3 ? <Check className="w-3 h-3" /> : "3"}
          </span>
          <span className="truncate">3. Funnel &amp; Promotion</span>
        </button>

        <ChevronRight className="w-4 h-4 text-ink-soft/40 shrink-0" />

        <button
          type="button"
          onClick={() => {
            if (validateStep1() && validateStep2() && validateStep3()) setStep(4);
          }}
          className={`flex-1 min-w-[130px] flex items-center justify-center gap-2.5 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            step === 4
              ? "bg-gradient-brand text-white shadow-sm"
              : "text-ink-soft hover:text-ink hover:bg-surface-alt"
          }`}
        >
          <span
            className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
              step === 4
                ? "bg-white/20 text-white"
                : "bg-surface-alt text-ink-soft border border-border"
            }`}
          >
            4
          </span>
          <span className="truncate">4. Credits &amp; Payment</span>
        </button>
      </div>

      {/* Main Section Divided in Two: Left (Forms / Config) + Right (AI Assist Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column */}
        <div className="space-y-6">
          {/* STEP 1: Job Information, Job Description, Job Requirements */}
          {step === 1 && (
            <>
              {/* 1. Job Information */}
              <div className="bg-surface border border-border rounded-2xl shadow-elegant p-6 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Briefcase className="w-4 h-4 text-primary-glow" />
                  <h2 className="text-sm font-bold text-ink uppercase tracking-wider">Job Information</h2>
                </div>

                <Field label="Job title">
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Accountant, Nurse Practitioner, Software Engineer"
                    className="input-base"
                    required
                  />
                </Field>

                <div className="flex items-center justify-between gap-3 flex-wrap -mt-1">
                  <p className="text-xs text-ink-soft">
                    {hasAiGeneratedContent
                      ? "Description and skills were AI-generated — review and edit before publishing."
                      : "Enter a job title, then let AI draft a description and skill suggestions."}
                  </p>
                  <button
                    type="button"
                    onClick={handleGenerateContent}
                    disabled={!title.trim() || isGeneratingContent}
                    className="shrink-0 inline-flex items-center gap-1.5 text-xs font-semibold text-primary-glow border border-primary/30 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isGeneratingContent ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" /> {hasAiGeneratedContent ? "Regenerate with AI" : "Generate with AI"}
                      </>
                    )}
                  </button>
                </div>

                {generationError && (
                  <p className="text-xs text-ink-soft bg-surface-alt/60 border border-border rounded-lg px-3 py-2">
                    {generationError}
                  </p>
                )}

                {pendingGeneratedContent && (
                  <div className="p-3 rounded-xl border border-primary/30 bg-primary/5">
                    <p className="text-xs font-semibold text-ink mb-2">
                      Replace your current description and skills with AI-generated content?
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => applyGeneratedContent(pendingGeneratedContent)}
                        className="text-xs font-semibold text-primary-foreground bg-gradient-brand px-3 py-1.5 rounded-lg cursor-pointer"
                      >
                        Use AI content
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingGeneratedContent(null)}
                        className="text-xs font-semibold text-ink-soft hover:text-ink px-3 py-1.5 rounded-lg cursor-pointer"
                      >
                        Keep mine
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Location">
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Mumbai, India or London, UK"
                      className="input-base"
                    />
                  </Field>
                  <Field label="Salary">
                    <input
                      type="text"
                      value={salaryText}
                      onChange={(e) => setSalaryText(e.target.value)}
                      placeholder="e.g. ₹15L – ₹22L / year or Competitive"
                      className="input-base"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Employment type">
                    <select
                      value={employmentType}
                      onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
                      className="input-base"
                    >
                      {EMPLOYMENT_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Workplace type">
                    <select
                      value={workplaceType}
                      onChange={(e) => setWorkplaceType(e.target.value as WorkplaceType)}
                      className="input-base"
                    >
                      {WORKPLACE_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
              </div>

              {/* 2. Job Description */}
              <div className="bg-surface border border-border rounded-2xl shadow-elegant p-6 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-primary-glow" />
                  <h2 className="text-sm font-bold text-ink uppercase tracking-wider">Job Description</h2>
                </div>

                <label className="block">
                  <span className="flex items-center gap-2 text-sm font-medium text-ink mb-1.5">
                    Description
                    {hasAiGeneratedContent && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full">
                        <Sparkles className="w-2.5 h-2.5" /> AI-generated
                      </span>
                    )}
                  </span>
                  <textarea
                    ref={descriptionRef}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Overview of the role, department, mission, and working environment"
                    className="input-base min-h-[120px] resize-y"
                  />
                  {description.trim().length > 0 && (
                    <div className="mt-2">
                      <AIWritingAssistant
                        value={description}
                        context="job-description"
                        metadata={{ jobTitle: title }}
                        textareaRef={descriptionRef}
                        onApply={setDescription}
                        label="AI Improve"
                      />
                    </div>
                  )}
                </label>

                <label className="block">
                  <span className="block text-sm font-medium text-ink mb-1.5">Responsibilities</span>
                  <textarea
                    value={responsibilitiesText}
                    onChange={(e) => setResponsibilitiesText(e.target.value)}
                    placeholder="Key daily responsibilities and deliverables (one per line)"
                    className="input-base min-h-[100px] resize-y"
                  />
                  <p className="text-[11px] text-ink-soft mt-1">Separate distinct duties on new lines or with bullet points.</p>
                </label>
              </div>

              {/* 3. Job Requirements */}
              <div className="bg-surface border border-border rounded-2xl shadow-elegant p-6 space-y-5">
                <div className="flex items-center justify-between gap-2 border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-primary-glow" />
                    <h2 className="text-sm font-bold text-ink uppercase tracking-wider">Job Requirements</h2>
                  </div>
                  <span className="text-[11px] text-ink-soft font-normal">Industry-neutral & flexible</span>
                </div>

                {/* Required Skills */}
                <SkillRequirementsInput
                  label="Required Skills & Competencies"
                  description="Essential qualifications candidates must possess."
                  skills={requiredSkills}
                  onSkillsChange={handleRequiredSkillsChange}
                  showProficiency={true}
                  addButtonText="+ Add required skill"
                  placeholder="Search catalogue or type custom skill (e.g. Java, React, SQL)..."
                  badgeTone="primary"
                />

                {/* Preferred Skills */}
                <SkillRequirementsInput
                  label="Preferred / Nice-to-Have Skills"
                  description="Helpful competencies that provide an advantage but are not mandatory."
                  skills={preferredSkills}
                  onSkillsChange={handlePreferredSkillsChange}
                  disallowedSkills={requiredSkills}
                  showProficiency={false}
                  addButtonText="+ Add preferred skill"
                  placeholder="Search catalogue or type custom skill (e.g. Docker, AWS, Redis)..."
                  badgeTone="neutral"
                />

                {/* Experience Range */}
                <div>
                  <span className="block text-sm font-medium text-ink mb-1.5">Experience Range (Years)</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-ink-soft block mb-1">Minimum (years)</label>
                      <input
                        type="number"
                        min={0}
                        max={50}
                        value={minimumExperience}
                        onChange={(e) => setMinimumExperience(e.target.value)}
                        placeholder="e.g. 0 for fresher, 2 for mid"
                        className="input-base"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-ink-soft block mb-1">Maximum (years)</label>
                      <input
                        type="number"
                        min={0}
                        max={50}
                        value={maximumExperience}
                        onChange={(e) => setMaximumExperience(e.target.value)}
                        placeholder="e.g. 5 (leave blank for any max)"
                        className="input-base"
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-ink-soft mt-1">
                    Optional. Leave blank if there is no strict experience requirement. Supports 0 for fresher roles.
                  </p>
                </div>

                {/* Education Requirements */}
                <div className="space-y-3">
                  <span className="block text-sm font-medium text-ink mb-0.5">Education Requirements</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Minimum Education Level">
                      <select
                        value={educationLevel}
                        onChange={(e) => setEducationLevel(e.target.value as EducationLevel)}
                        className="input-base"
                      >
                        {EDUCATION_LEVEL_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Accepted Fields of Study (Optional)">
                      <input
                        type="text"
                        value={educationFieldsText}
                        onChange={(e) => setEducationFieldsText(e.target.value)}
                        placeholder="e.g. Accounting, Finance or Nursing"
                        className="input-base"
                      />
                    </Field>
                  </div>
                  <p className="text-[11px] text-ink-soft">
                    Leave fields empty to accept candidates from all academic backgrounds.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* STEP 2: Candidate Matching Volume, Resume Shortlisting, Assessment with Test, Interview & Domain Specific Test */}
          {step === 2 && (
            <>
              {/* Candidate Matching Volume */}
              <div className="bg-surface border border-border rounded-2xl shadow-elegant p-6 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-primary-glow" />
                  <h2 className="text-sm font-bold text-ink uppercase tracking-wider">Candidate Matching Volume</h2>
                </div>

                <MatchVolumeSection
                  options={matchVolumeOptions}
                  selected={matchVolume}
                  onSelect={setMatchVolume}
                  customRatioError={customRatioError}
                  setCustomRatioError={setCustomRatioError}
                />
              </div>

              {/* Resume Shortlisting */}
              <div className="bg-surface border border-border rounded-2xl shadow-elegant p-6 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-primary-glow" />
                  <h2 className="text-sm font-bold text-ink uppercase tracking-wider">Resume Shortlisting</h2>
                </div>

                <PipelineSectionCard
                  section="resumeMatch"
                  meta={SECTION_META.resumeMatch}
                  subOptions={subOptionsCatalog?.resumeMatch || []}
                  subOptionCost={subOptionCost}
                  enabled={resumeMatchEnabled}
                  onToggleEnabled={setResumeMatchEnabled}
                  selectedKeys={selectedSubOptions.resumeMatch}
                  onToggleSubOption={(key) => toggleSubOption("resumeMatch", key)}
                />

                {/* Check Resume Verification Checkbox Card */}
                <div
                  className={`p-4 rounded-xl border transition ${
                    checkResumeVerification
                      ? "border-primary/40 bg-primary/5 shadow-xs"
                      : "border-border bg-background hover:border-border/80"
                  }`}
                >
                  <label className="flex items-start gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={checkResumeVerification}
                      onChange={(e) => setCheckResumeVerification(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-primary/30 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          <span className="text-xs font-bold text-ink">Check Resume Verification</span>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            Verification
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                          10 credits
                        </span>
                      </div>
                      <p className="text-xs text-ink-soft mt-1">
                        AI-powered resume authenticity and credential verification validating candidate employment history, education records, and resume consistency.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Assessment Section: AI Online Test, Interview (Screening & Technical), AI Assessment */}
              <div className="bg-surface border border-border rounded-2xl shadow-elegant p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-primary-glow" />
                    <h2 className="text-sm font-bold text-ink uppercase tracking-wider">Candidate Assessment Rounds</h2>
                  </div>
                  <span className="text-[11px] text-ink-soft">10 credits per active round</span>
                </div>

                <p className="text-xs text-ink-soft">
                  Select candidate assessment stages for this role: Online tests, Assessments (AI, Domain, Skills, Technical, Rapid Question), Interviews (Screening, Technical &amp; Video), and Domain-specific evaluations.
                </p>

                {/* Timeline Configuration Info Banner */}
                <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-3">
                  <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div className="text-xs text-ink space-y-0.5">
                    <p className="font-bold text-primary-glow">Configure Questions Now or Later in the Hiring Timeline</p>
                    <p className="text-ink-soft">
                      You can select the rounds needed for this role now and publish. Questions, passing thresholds, and AI proctoring can be reviewed and confirmed stage-by-stage in the <strong>Hiring Timeline</strong> after publishing. Any rounds not yet configured will be clearly marked with a &quot;Configure Round&quot; button.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Option 1: Online test */}
                  <div
                    className={`rounded-xl border transition ${
                      onlineTestEnabled ? "border-primary/40 bg-primary/5 p-4" : "border-border bg-background p-4"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <label className="flex items-start gap-3 cursor-pointer select-none flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={onlineTestEnabled}
                          onChange={(e) => setOnlineTestEnabled(e.target.checked)}
                          className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary/30 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <FileQuestion className="w-4 h-4 text-primary-glow" />
                            <span className="text-sm font-bold text-ink">Online test</span>
                            <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full capitalize">
                              {onlineTestSource === "ai" ? "AI Generated" : "Question Bank"}
                            </span>
                          </div>
                          <p className="text-xs text-ink-soft mt-0.5">
                            Automated online testing rounds covering general aptitude, technical capabilities, and rapid-fire evaluations.
                          </p>
                        </div>
                      </label>

                      {/* Options: AI or Question bank to the right of title */}
                      <div className="flex items-center gap-1 p-0.5 rounded-lg bg-surface border border-border shadow-xs shrink-0">
                        <button
                          type="button"
                          onClick={() => setOnlineTestSource("ai")}
                          className={`px-2.5 py-1 rounded-md font-semibold text-xs transition cursor-pointer flex items-center gap-1 ${
                            onlineTestSource === "ai"
                              ? "bg-primary text-white shadow-xs"
                              : "text-ink-soft hover:text-ink hover:bg-surface-alt"
                          }`}
                        >
                          <Sparkles className="w-3 h-3" />
                          AI
                        </button>
                        <button
                          type="button"
                          onClick={() => setOnlineTestSource("question_bank")}
                          className={`px-2.5 py-1 rounded-md font-semibold text-xs transition cursor-pointer flex items-center gap-1 ${
                            onlineTestSource === "question_bank"
                              ? "bg-primary text-white shadow-xs"
                              : "text-ink-soft hover:text-ink hover:bg-surface-alt"
                          }`}
                        >
                          <BookOpen className="w-3 h-3" />
                          Question bank
                        </button>
                      </div>
                    </div>

                    {onlineTestEnabled && (
                      <div className="mt-4 pt-3 border-t border-border/70 space-y-4">
                        <div className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-primary/10 text-primary-glow text-xs font-semibold">
                          <span className="flex items-center gap-1.5">
                            <Check className="w-3.5 h-3.5" />
                            Test Source: {onlineTestSource === "ai" ? "AI-Curated Assessment" : "Question Bank"}
                          </span>
                          <span className="text-[10px] bg-white text-primary-glow px-2 py-0.5 rounded-md font-bold shadow-xs">
                            Auto-Proctored
                          </span>
                        </div>

                        <p className="text-xs text-ink-soft font-medium">
                          Select the rounds to include in this Online test:
                        </p>

                        {/* The 3 selectable rounds: General Aptitude, Technical Test, Rapid Round */}
                        <div className="space-y-3">
                          {/* Round 1: General Aptitude */}
                          <div
                            className={`p-3.5 rounded-xl border transition ${
                              onlineGeneralAptitudeEnabled
                                ? "border-primary/30 bg-white shadow-xs"
                                : "border-border bg-surface-alt/40"
                            }`}
                          >
                            <label className="flex items-start gap-2.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={onlineGeneralAptitudeEnabled}
                                onChange={(e) => setOnlineGeneralAptitudeEnabled(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-primary/30 cursor-pointer"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-bold text-ink">General Aptitude</span>
                                  <span className="text-[10px] font-bold text-primary-glow">10 credits</span>
                                </div>
                                <p className="text-[11px] text-ink-soft mt-0.5">
                                  Evaluates logical reasoning, quantitative problem solving, and verbal aptitude.
                                </p>
                              </div>
                            </label>

                            {onlineGeneralAptitudeEnabled && (
                              <div className="mt-3 pt-2 border-t border-border/70 space-y-3">
                                <RoundScheduleSelector
                                  label="General Aptitude Schedule & Timing"
                                  schedule={onlineGeneralAptitudeSchedule}
                                  onChange={setOnlineGeneralAptitudeSchedule}
                                  onDurationChange={(mins) => setOnlineGeneralAptitudeDuration(mins)}
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  <div>
                                    <label className="text-[11px] font-medium text-ink-soft block mb-1">Questions</label>
                                    <input
                                      type="number"
                                      min={5}
                                      max={60}
                                      value={onlineGeneralAptitudeQuestions}
                                      onChange={(e) => setOnlineGeneralAptitudeQuestions(Math.max(5, parseInt(e.target.value) || 5))}
                                      className="input-base text-xs py-1.5"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[11px] font-medium text-ink-soft block mb-1">Duration (mins)</label>
                                    <input
                                      type="number"
                                      min={10}
                                      max={180}
                                      value={onlineGeneralAptitudeDuration}
                                      onChange={(e) => setOnlineGeneralAptitudeDuration(Math.max(10, parseInt(e.target.value) || 10))}
                                      className="input-base text-xs py-1.5"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[11px] font-medium text-ink-soft block mb-1">Pass Score (%)</label>
                                    <input
                                      type="number"
                                      min={30}
                                      max={100}
                                      value={onlineGeneralAptitudePassScore}
                                      onChange={(e) => setOnlineGeneralAptitudePassScore(Math.max(30, parseInt(e.target.value) || 30))}
                                      className="input-base text-xs py-1.5"
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-2.5 border-t border-border/60">
                                  <div className="flex items-center gap-1.5 text-[11px] text-ink-soft">
                                    <BookOpen className="w-3.5 h-3.5 text-primary-glow" />
                                    <span>Questions:</span>
                                    <strong className="text-ink">
                                      {(roundQuestionsMap["round_general_aptitude"]?.length || onlineTestCustomQuestions.length) > 0
                                        ? `${roundQuestionsMap["round_general_aptitude"]?.length || onlineTestCustomQuestions.length} configured`
                                        : "AI auto-generated on test start"}
                                    </strong>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleOpenRoundQuestionConfig(
                                        "round_general_aptitude",
                                        "general_aptitude",
                                        "General Aptitude Test",
                                        onlineGeneralAptitudeDuration,
                                        onlineGeneralAptitudePassScore
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-primary-glow bg-primary/10 hover:bg-primary/20 border border-primary/20 transition cursor-pointer"
                                  >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Configure &amp; Review Questions</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Round 2: Technical Test */}
                          <div
                            className={`p-3.5 rounded-xl border transition ${
                              onlineTechnicalTestEnabled
                                ? "border-primary/30 bg-white shadow-xs"
                                : "border-border bg-surface-alt/40"
                            }`}
                          >
                            <label className="flex items-start gap-2.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={onlineTechnicalTestEnabled}
                                onChange={(e) => setOnlineTechnicalTestEnabled(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-primary/30 cursor-pointer"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-bold text-ink">Technical Test</span>
                                  <span className="text-[10px] font-bold text-primary-glow">10 credits</span>
                                </div>
                                <p className="text-[11px] text-ink-soft mt-0.5">
                                  In-depth technical conceptual and application assessment aligned with role competencies.
                                </p>
                              </div>
                            </label>

                            {onlineTechnicalTestEnabled && (
                              <div className="mt-3 pt-2 border-t border-border/70 space-y-3">
                                <RoundScheduleSelector
                                  label="Technical Test Schedule & Timing"
                                  schedule={onlineTechnicalTestSchedule}
                                  onChange={setOnlineTechnicalTestSchedule}
                                  onDurationChange={(mins) => setOnlineTechnicalTestDuration(mins)}
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  <div>
                                    <label className="text-[11px] font-medium text-ink-soft block mb-1">Questions</label>
                                    <input
                                      type="number"
                                      min={5}
                                      max={60}
                                      value={onlineTechnicalTestQuestions}
                                      onChange={(e) => setOnlineTechnicalTestQuestions(Math.max(5, parseInt(e.target.value) || 5))}
                                      className="input-base text-xs py-1.5"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[11px] font-medium text-ink-soft block mb-1">Duration (mins)</label>
                                    <input
                                      type="number"
                                      min={15}
                                      max={180}
                                      value={onlineTechnicalTestDuration}
                                      onChange={(e) => setOnlineTechnicalTestDuration(Math.max(15, parseInt(e.target.value) || 15))}
                                      className="input-base text-xs py-1.5"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[11px] font-medium text-ink-soft block mb-1">Pass Score (%)</label>
                                    <input
                                      type="number"
                                      min={30}
                                      max={100}
                                      value={onlineTechnicalTestPassScore}
                                      onChange={(e) => setOnlineTechnicalTestPassScore(Math.max(30, parseInt(e.target.value) || 30))}
                                      className="input-base text-xs py-1.5"
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-2.5 border-t border-border/60">
                                  <div className="flex items-center gap-1.5 text-[11px] text-ink-soft">
                                    <BookOpen className="w-3.5 h-3.5 text-primary-glow" />
                                    <span>Questions:</span>
                                    <strong className="text-ink">
                                      {roundQuestionsMap["round_technical_test"]?.length > 0
                                        ? `${roundQuestionsMap["round_technical_test"].length} configured`
                                        : "AI auto-generated on test start"}
                                    </strong>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleOpenRoundQuestionConfig(
                                        "round_technical_test",
                                        "technical_test",
                                        "Technical Test",
                                        onlineTechnicalTestDuration,
                                        onlineTechnicalTestPassScore
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-primary-glow bg-primary/10 hover:bg-primary/20 border border-primary/20 transition cursor-pointer"
                                  >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Configure &amp; Review Questions</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Round 3: Rapid Round */}
                          <div
                            className={`p-3.5 rounded-xl border transition ${
                              onlineRapidRoundEnabled
                                ? "border-primary/30 bg-white shadow-xs"
                                : "border-border bg-surface-alt/40"
                            }`}
                          >
                            <label className="flex items-start gap-2.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={onlineRapidRoundEnabled}
                                onChange={(e) => setOnlineRapidRoundEnabled(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-primary/30 cursor-pointer"
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-bold text-ink">Rapid Round</span>
                                  <span className="text-[10px] font-bold text-primary-glow">10 credits</span>
                                </div>
                                <p className="text-[11px] text-ink-soft mt-0.5">
                                  Fast-paced timed round testing candidate reflexes, rapid decision-making, and fundamental knowledge.
                                </p>
                              </div>
                            </label>

                            {onlineRapidRoundEnabled && (
                              <div className="mt-3 pt-2 border-t border-border/70 space-y-3">
                                <RoundScheduleSelector
                                  label="Rapid Round Schedule & Timing"
                                  schedule={onlineRapidRoundSchedule}
                                  onChange={setOnlineRapidRoundSchedule}
                                  onDurationChange={(mins) => setOnlineRapidRoundDuration(mins)}
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  <div>
                                    <label className="text-[11px] font-medium text-ink-soft block mb-1">Questions</label>
                                    <input
                                      type="number"
                                      min={5}
                                      max={30}
                                      value={onlineRapidRoundQuestions}
                                      onChange={(e) => setOnlineRapidRoundQuestions(Math.max(5, parseInt(e.target.value) || 5))}
                                      className="input-base text-xs py-1.5"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[11px] font-medium text-ink-soft block mb-1">Duration (mins)</label>
                                    <input
                                      type="number"
                                      min={5}
                                      max={60}
                                      value={onlineRapidRoundDuration}
                                      onChange={(e) => setOnlineRapidRoundDuration(Math.max(5, parseInt(e.target.value) || 5))}
                                      className="input-base text-xs py-1.5"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[11px] font-medium text-ink-soft block mb-1">Pass Score (%)</label>
                                    <input
                                      type="number"
                                      min={30}
                                      max={100}
                                      value={onlineRapidRoundPassScore}
                                      onChange={(e) => setOnlineRapidRoundPassScore(Math.max(30, parseInt(e.target.value) || 30))}
                                      className="input-base text-xs py-1.5"
                                    />
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-2.5 border-t border-border/60">
                                  <div className="flex items-center gap-1.5 text-[11px] text-ink-soft">
                                    <BookOpen className="w-3.5 h-3.5 text-primary-glow" />
                                    <span>Questions:</span>
                                    <strong className="text-ink">
                                      {roundQuestionsMap["round_rapid_round"]?.length > 0
                                        ? `${roundQuestionsMap["round_rapid_round"].length} configured`
                                        : "AI auto-generated on test start"}
                                    </strong>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleOpenRoundQuestionConfig(
                                        "round_rapid_round",
                                        "rapid_round",
                                        "Rapid Round",
                                        onlineRapidRoundDuration,
                                        onlineRapidRoundPassScore
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-primary-glow bg-primary/10 hover:bg-primary/20 border border-primary/20 transition cursor-pointer"
                                  >
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>Configure &amp; Review Questions</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Custom Questions for Online Test */}
                        <div className="pt-2 border-t border-border/70 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-ink">
                              Custom Questions ({onlineTestCustomQuestions.length})
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenRoundQuestionConfig(
                                    "round_general_aptitude",
                                    "general_aptitude",
                                    "Online Test (General Aptitude)",
                                    onlineGeneralAptitudeDuration,
                                    onlineGeneralAptitudePassScore
                                  )
                                }
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-glow border border-primary/30 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-xl transition cursor-pointer"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                Configure with AI / Review All
                              </button>
                              <button
                                type="button"
                                onClick={() => setCustomQuestionModalTarget("ai_online_test")}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-glow border border-primary/30 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-xl transition cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Add Custom Question
                              </button>
                            </div>
                          </div>

                          {onlineTestCustomQuestions.length > 0 ? (
                            <div className="space-y-2">
                              {onlineTestCustomQuestions.map((q, idx) => (
                                <div
                                  key={q.id}
                                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-surface border border-border text-xs"
                                >
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-ink">Q{idx + 1}:</span>
                                      <span className="font-medium text-ink truncate">{q.question}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-ink-soft">
                                      <span>{q.options?.length || 0} options</span>
                                      <span>•</span>
                                      <span className="text-emerald-600 font-semibold">
                                        Correct: {q.correctOptionId?.replace("opt_", "Option ").toUpperCase()}
                                      </span>
                                      <span>•</span>
                                      <span>{q.points || 1} pts</span>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveCustomQuestion("ai_online_test", q.id)}
                                    className="p-1.5 rounded-lg text-ink-soft hover:text-destructive hover:bg-destructive/10 transition cursor-pointer shrink-0"
                                    aria-label="Remove question"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-ink-soft">
                              No custom questions added yet. Questions will be generated or pulled from {onlineTestSource === "ai" ? "AI generation" : "the question bank"}.
                            </p>
                          )}
                        </div>

                        {/* Custom Test Rounds */}
                        <div className="pt-3 border-t border-border/70 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                                <span>Custom Test Rounds</span>
                                {customRounds.filter((r) => r.category === "test").length > 0 && (
                                  <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full">
                                    {customRounds.filter((r) => r.category === "test").length}
                                  </span>
                                )}
                              </span>
                              <p className="text-[11px] text-ink-soft">
                                Add specialized test rounds (e.g. Cognitive Ability, Verbal Reasoning).
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleOpenAddCustomRound("test")}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-glow border border-primary/30 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-xl transition cursor-pointer shrink-0"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Custom Test Round</span>
                            </button>
                          </div>

                          {customRounds.filter((r) => r.category === "test").length > 0 ? (
                            <div className="space-y-2">
                              {customRounds
                                .filter((r) => r.category === "test")
                                .map((round) => renderCustomRoundCard(round))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-ink-soft italic">
                              No custom test rounds added yet. Click &quot;Add Custom Test Round&quot; to configure additional test stages.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Option 2: Assessment */}
                  <div className="rounded-xl border border-border bg-background p-4 space-y-4">
                    <div className="flex items-center justify-between border-b border-border/70 pb-3">
                      <div className="flex items-center gap-2">
                        <BrainCircuit className="w-4 h-4 text-primary-glow" />
                        <span className="text-sm font-bold text-ink">Assessment</span>
                        <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full">
                          AI &amp; Competency Rounds
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                        10 credits / round
                      </span>
                    </div>

                    <p className="text-xs text-ink-soft">
                      Comprehensive evaluation rounds covering AI Chat Assessment, AI Voice Assessment, Domain, Skills, Technical, and Rapid Question Round.
                    </p>

                    <div className="space-y-3.5">
                      {/* 1. AI Chat Assessment Round */}
                      <div
                        className={`rounded-xl border transition ${
                          assessmentAiChatEnabled ? "border-blue-500/40 bg-blue-500/5 p-4 shadow-xs" : "border-border bg-surface-alt/40 p-4"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <label className="flex items-start gap-3 cursor-pointer select-none flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={assessmentAiChatEnabled}
                              onChange={(e) => setAssessmentAiChatEnabled(e.target.checked)}
                              className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500/30 cursor-pointer"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <MessageSquare className="w-4 h-4 text-blue-500" />
                                  <span className="text-sm font-bold text-ink">AI Chat Assessment</span>
                                  <span className="text-[10px] font-bold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-full">
                                    Conversational Chat Round
                                  </span>
                                </div>
                                <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                                  10 credits
                                </span>
                              </div>
                              <p className="text-xs text-ink-soft mt-0.5">
                                Dedicated interactive text-based chat interview with real-time AI evaluation, code/syntax input, and turn-by-turn probing.
                              </p>
                            </div>
                          </label>
                        </div>

                        {assessmentAiChatEnabled && (
                          <div className="mt-4 pt-3 border-t border-border/70 space-y-3.5">
                            <RoundScheduleSelector
                              label="AI Chat Assessment Schedule & Timing"
                              schedule={assessmentAiChatSchedule}
                              onChange={setAssessmentAiChatSchedule}
                              onDurationChange={(mins) => setAssessmentAiChatDuration(mins)}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                              <div>
                                <label className="text-[11px] font-medium text-ink-soft block mb-1">Duration (mins)</label>
                                <input
                                  type="number"
                                  min={10}
                                  max={120}
                                  value={assessmentAiChatDuration}
                                  onChange={(e) => setAssessmentAiChatDuration(Math.max(10, parseInt(e.target.value) || 10))}
                                  className="input-base text-xs py-1.5"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-medium text-ink-soft block mb-1">Questions / Topics</label>
                                <input
                                  type="number"
                                  min={3}
                                  max={30}
                                  value={assessmentAiChatQuestionCount}
                                  onChange={(e) => setAssessmentAiChatQuestionCount(Math.max(3, parseInt(e.target.value) || 3))}
                                  className="input-base text-xs py-1.5"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-medium text-ink-soft block mb-1">Difficulty</label>
                                <select
                                  value={assessmentAiChatDifficulty}
                                  onChange={(e) => setAssessmentAiChatDifficulty(e.target.value as any)}
                                  className="input-base text-xs py-1.5"
                                >
                                  <option value="easy">Easy (Foundations)</option>
                                  <option value="medium">Medium (Standard)</option>
                                  <option value="hard">Hard (Advanced Depth)</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-[11px] font-medium text-ink-soft block mb-1">Passing Score (%)</label>
                                <input
                                  type="number"
                                  min={30}
                                  max={100}
                                  value={assessmentAiChatPassScore}
                                  onChange={(e) => setAssessmentAiChatPassScore(Math.max(30, parseInt(e.target.value) || 30))}
                                  className="input-base text-xs py-1.5"
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2.5 border-t border-border/60">
                              <div className="flex items-center gap-1.5 text-[11px] text-ink-soft">
                                <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                                <span>Chat Topics / Questions:</span>
                                <strong className="text-ink">
                                  {roundQuestionsMap["round_ai_chat"]?.length > 0
                                    ? `${roundQuestionsMap["round_ai_chat"].length} configured`
                                    : "AI auto-generated software engineering topics"}
                                </strong>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenRoundQuestionConfig(
                                    "round_ai_chat",
                                    "ai_chat",
                                    "AI Chat Assessment",
                                    assessmentAiChatDuration,
                                    assessmentAiChatPassScore
                                  )
                                }
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-blue-600 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 transition cursor-pointer"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Configure &amp; Review Chat Questions</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 2. AI Voice Assessment Round */}
                      <div
                        className={`rounded-xl border transition ${
                          assessmentAiVoiceEnabled ? "border-emerald-500/40 bg-emerald-500/5 p-4 shadow-xs" : "border-border bg-surface-alt/40 p-4"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <label className="flex items-start gap-3 cursor-pointer select-none flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={assessmentAiVoiceEnabled}
                              onChange={(e) => setAssessmentAiVoiceEnabled(e.target.checked)}
                              className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500/30 cursor-pointer"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <Mic className="w-4 h-4 text-emerald-500" />
                                  <span className="text-sm font-bold text-ink">AI Voice Assessment</span>
                                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                    Voice-to-Voice Round
                                  </span>
                                </div>
                                <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                                  10 credits
                                </span>
                              </div>
                              <p className="text-xs text-ink-soft mt-0.5">
                                Dedicated real-time voice-to-voice interview evaluating spoken technical communication, conceptual articulation, and verbal reasoning.
                              </p>
                            </div>
                          </label>
                        </div>

                        {assessmentAiVoiceEnabled && (
                          <div className="mt-4 pt-3 border-t border-border/70 space-y-3.5">
                            <RoundScheduleSelector
                              label="AI Voice Assessment Schedule & Timing"
                              schedule={assessmentAiVoiceSchedule}
                              onChange={setAssessmentAiVoiceSchedule}
                              onDurationChange={(mins) => setAssessmentAiVoiceDuration(mins)}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                              <div>
                                <label className="text-[11px] font-medium text-ink-soft block mb-1">Duration (mins)</label>
                                <input
                                  type="number"
                                  min={10}
                                  max={120}
                                  value={assessmentAiVoiceDuration}
                                  onChange={(e) => setAssessmentAiVoiceDuration(Math.max(10, parseInt(e.target.value) || 10))}
                                  className="input-base text-xs py-1.5"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-medium text-ink-soft block mb-1">Questions / Topics</label>
                                <input
                                  type="number"
                                  min={3}
                                  max={20}
                                  value={assessmentAiVoiceQuestionCount}
                                  onChange={(e) => setAssessmentAiVoiceQuestionCount(Math.max(3, parseInt(e.target.value) || 3))}
                                  className="input-base text-xs py-1.5"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-medium text-ink-soft block mb-1">Difficulty</label>
                                <select
                                  value={assessmentAiVoiceDifficulty}
                                  onChange={(e) => setAssessmentAiVoiceDifficulty(e.target.value as any)}
                                  className="input-base text-xs py-1.5"
                                >
                                  <option value="easy">Easy (Foundations)</option>
                                  <option value="medium">Medium (Standard)</option>
                                  <option value="hard">Hard (Advanced Depth)</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-[11px] font-medium text-ink-soft block mb-1">Passing Score (%)</label>
                                <input
                                  type="number"
                                  min={30}
                                  max={100}
                                  value={assessmentAiVoicePassScore}
                                  onChange={(e) => setAssessmentAiVoicePassScore(Math.max(30, parseInt(e.target.value) || 30))}
                                  className="input-base text-xs py-1.5"
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-2.5 border-t border-border/60">
                              <div className="flex items-center gap-1.5 text-[11px] text-ink-soft">
                                <Mic className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Spoken Topics / Questions:</span>
                                <strong className="text-ink">
                                  {roundQuestionsMap["round_ai_voice"]?.length > 0
                                    ? `${roundQuestionsMap["round_ai_voice"].length} configured`
                                    : "AI auto-generated verbal communication scenarios"}
                                </strong>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenRoundQuestionConfig(
                                    "round_ai_voice",
                                    "ai_voice",
                                    "AI Voice Assessment",
                                    assessmentAiVoiceDuration,
                                    assessmentAiVoicePassScore
                                  )
                                }
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 transition cursor-pointer"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Configure &amp; Review Voice Questions</span>
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 2. Domain Round */}
                      <div
                        className={`rounded-xl border transition ${
                          assessmentDomainEnabled ? "border-primary/40 bg-primary/5 p-4" : "border-border bg-surface-alt/40 p-4"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <label className="flex items-start gap-3 cursor-pointer select-none flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={assessmentDomainEnabled}
                              onChange={(e) => setAssessmentDomainEnabled(e.target.checked)}
                              className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary/30 cursor-pointer"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <Briefcase className="w-4 h-4 text-blue-500" />
                                  <span className="text-sm font-bold text-ink">Domain</span>
                                  <span className="text-[10px] font-bold text-blue-600 bg-blue-500/10 px-2 py-0.5 rounded-full">
                                    Domain Competency
                                  </span>
                                </div>
                                <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                                  10 credits
                                </span>
                              </div>
                              <p className="text-xs text-ink-soft mt-0.5">
                                Specific domain capability assessment testing role competency and domain-specific knowledge.
                              </p>
                            </div>
                          </label>
                        </div>

                        {assessmentDomainEnabled && (
                          <div className="mt-4 pt-3 border-t border-border/70 space-y-3.5">
                            <RoundScheduleSelector
                              label="Domain Round Schedule & Timing"
                              schedule={assessmentDomainSchedule}
                              onChange={setAssessmentDomainSchedule}
                              onDurationChange={(mins) => setAssessmentDomainDuration(mins)}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="text-[11px] font-medium text-ink-soft block mb-1">Duration (mins)</label>
                                <input
                                  type="number"
                                  min={15}
                                  max={120}
                                  value={assessmentDomainDuration}
                                  onChange={(e) => setAssessmentDomainDuration(Math.max(15, parseInt(e.target.value) || 15))}
                                  className="input-base text-xs py-1.5"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-medium text-ink-soft block mb-1">Passing Score (%)</label>
                                <input
                                  type="number"
                                  min={30}
                                  max={100}
                                  value={assessmentDomainPassScore}
                                  onChange={(e) => setAssessmentDomainPassScore(Math.max(30, parseInt(e.target.value) || 30))}
                                  className="input-base text-xs py-1.5"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 3. Skills Round */}
                      <div
                        className={`rounded-xl border transition ${
                          assessmentSkillsEnabled ? "border-primary/40 bg-primary/5 p-4" : "border-border bg-surface-alt/40 p-4"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <label className="flex items-start gap-3 cursor-pointer select-none flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={assessmentSkillsEnabled}
                              onChange={(e) => setAssessmentSkillsEnabled(e.target.checked)}
                              className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary/30 cursor-pointer"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <Lightbulb className="w-4 h-4 text-amber-500" />
                                  <span className="text-sm font-bold text-ink">Skills</span>
                                  <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                                    Skill Assessment
                                  </span>
                                </div>
                                <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                                  10 credits
                                </span>
                              </div>
                              <p className="text-xs text-ink-soft mt-0.5">
                                Practical validation of essential technical and soft skills for the target role.
                              </p>
                            </div>
                          </label>
                        </div>

                        {assessmentSkillsEnabled && (
                          <div className="mt-4 pt-3 border-t border-border/70 space-y-3.5">
                            <RoundScheduleSelector
                              label="Skills Round Schedule & Timing"
                              schedule={assessmentSkillsSchedule}
                              onChange={setAssessmentSkillsSchedule}
                              onDurationChange={(mins) => setAssessmentSkillsDuration(mins)}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="text-[11px] font-medium text-ink-soft block mb-1">Duration (mins)</label>
                                <input
                                  type="number"
                                  min={15}
                                  max={90}
                                  value={assessmentSkillsDuration}
                                  onChange={(e) => setAssessmentSkillsDuration(Math.max(15, parseInt(e.target.value) || 15))}
                                  className="input-base text-xs py-1.5"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-medium text-ink-soft block mb-1">Passing Score (%)</label>
                                <input
                                  type="number"
                                  min={30}
                                  max={100}
                                  value={assessmentSkillsPassScore}
                                  onChange={(e) => setAssessmentSkillsPassScore(Math.max(30, parseInt(e.target.value) || 30))}
                                  className="input-base text-xs py-1.5"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 4. Technical Round */}
                      <div
                        className={`rounded-xl border transition ${
                          assessmentTechnicalEnabled ? "border-primary/40 bg-primary/5 p-4" : "border-border bg-surface-alt/40 p-4"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <label className="flex items-start gap-3 cursor-pointer select-none flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={assessmentTechnicalEnabled}
                              onChange={(e) => setAssessmentTechnicalEnabled(e.target.checked)}
                              className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary/30 cursor-pointer"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <Code className="w-4 h-4 text-emerald-500" />
                                  <span className="text-sm font-bold text-ink">Technical</span>
                                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                    Technical Evaluation
                                  </span>
                                </div>
                                <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                                  10 credits
                                </span>
                              </div>
                              <p className="text-xs text-ink-soft mt-0.5">
                                Deep-dive technical assessment covering algorithmic thinking, architectural design, and problem analysis.
                              </p>
                            </div>
                          </label>
                        </div>

                        {assessmentTechnicalEnabled && (
                          <div className="mt-4 pt-3 border-t border-border/70 space-y-3.5">
                            <RoundScheduleSelector
                              label="Technical Round Schedule & Timing"
                              schedule={assessmentTechnicalSchedule}
                              onChange={setAssessmentTechnicalSchedule}
                              onDurationChange={(mins) => setAssessmentTechnicalDuration(mins)}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="text-[11px] font-medium text-ink-soft block mb-1">Duration (mins)</label>
                                <input
                                  type="number"
                                  min={15}
                                  max={120}
                                  value={assessmentTechnicalDuration}
                                  onChange={(e) => setAssessmentTechnicalDuration(Math.max(15, parseInt(e.target.value) || 15))}
                                  className="input-base text-xs py-1.5"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-medium text-ink-soft block mb-1">Passing Score (%)</label>
                                <input
                                  type="number"
                                  min={30}
                                  max={100}
                                  value={assessmentTechnicalPassScore}
                                  onChange={(e) => setAssessmentTechnicalPassScore(Math.max(30, parseInt(e.target.value) || 30))}
                                  className="input-base text-xs py-1.5"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 5. Rapid Question Round */}
                      <div
                        className={`rounded-xl border transition ${
                          assessmentRapidEnabled ? "border-primary/40 bg-primary/5 p-4" : "border-border bg-surface-alt/40 p-4"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <label className="flex items-start gap-3 cursor-pointer select-none flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={assessmentRapidEnabled}
                              onChange={(e) => setAssessmentRapidEnabled(e.target.checked)}
                              className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary/30 cursor-pointer"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <Zap className="w-4 h-4 text-amber-500" />
                                  <span className="text-sm font-bold text-ink">Rapid Question Round</span>
                                  <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded-full">
                                    Rapid-Fire
                                  </span>
                                </div>
                                <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                                  10 credits
                                </span>
                              </div>
                              <p className="text-xs text-ink-soft mt-0.5">
                                Timed rapid question round testing spontaneous answers, instincts, and quick problem resolution.
                              </p>
                            </div>
                          </label>
                        </div>

                        {assessmentRapidEnabled && (
                          <div className="mt-4 pt-3 border-t border-border/70 space-y-3.5">
                            {/* Interview Mode: AI Online Interview or Manual Online Interview */}
                            <div className="flex items-center justify-between gap-3 flex-wrap">
                              <div>
                                <span className="text-xs font-semibold text-ink">Interview Mode:</span>
                                <p className="text-[11px] text-ink-soft">Select AI-facilitated or manual interviewer</p>
                              </div>
                              <div className="inline-flex rounded-lg border border-border bg-surface-alt/40 p-0.5">
                                <button
                                  type="button"
                                  onClick={() => setAssessmentRapidInterviewType("ai_online_interview")}
                                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                                    assessmentRapidInterviewType === "ai_online_interview"
                                      ? "bg-primary text-white shadow-xs"
                                      : "text-ink-soft hover:text-ink"
                                  }`}
                                >
                                  <Bot className="w-3.5 h-3.5" />
                                  Ai Online Interview
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setAssessmentRapidInterviewType("manual_online_interview")}
                                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                                    assessmentRapidInterviewType === "manual_online_interview"
                                      ? "bg-primary text-white shadow-xs"
                                      : "text-ink-soft hover:text-ink"
                                  }`}
                                >
                                  <UserCheck className="w-3.5 h-3.5" />
                                  Manual Online Interview
                                </button>
                              </div>
                            </div>

                            <RoundScheduleSelector
                              label="Rapid Round Schedule & Timing"
                              schedule={assessmentRapidSchedule}
                              onChange={setAssessmentRapidSchedule}
                              onDurationChange={(mins) => setAssessmentRapidDuration(mins)}
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="text-[11px] font-medium text-ink-soft block mb-1">Duration (mins)</label>
                                <input
                                  type="number"
                                  min={5}
                                  max={45}
                                  value={assessmentRapidDuration}
                                  onChange={(e) => setAssessmentRapidDuration(Math.max(5, parseInt(e.target.value) || 5))}
                                  className="input-base text-xs py-1.5"
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-medium text-ink-soft block mb-1">Passing Score (%)</label>
                                <input
                                  type="number"
                                  min={30}
                                  max={100}
                                  value={assessmentRapidPassScore}
                                  onChange={(e) => setAssessmentRapidPassScore(Math.max(30, parseInt(e.target.value) || 30))}
                                  className="input-base text-xs py-1.5"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Option 3: Interview (Screening, Technical & Video) */}
                  <div
                    className={`rounded-xl border transition ${
                      interviewEnabled ? "border-primary/40 bg-primary/5 p-4" : "border-border bg-background p-4"
                    }`}
                  >
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={interviewEnabled}
                        onChange={(e) => setInterviewEnabled(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary/30"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-indigo-500" />
                            <span className="text-sm font-bold text-ink">Interview (Screening, Technical &amp; Video)</span>
                          </div>
                          <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                            10 credits / round
                          </span>
                        </div>
                        <p className="text-xs text-ink-soft mt-0.5">
                          Automated candidate interview rounds covering behavioral screening, deep technical evaluation, and video presentation.
                        </p>
                      </div>
                    </label>

                    {interviewEnabled && (
                      <div className="mt-4 pt-3 border-t border-border/70 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {/* Screening Interview Sub-card */}
                          <div
                            className={`p-3.5 rounded-xl border transition ${
                              screeningInterviewEnabled
                                ? "border-primary/30 bg-white shadow-xs"
                                : "border-border bg-surface-alt/40"
                            }`}
                          >
                            <label className="flex items-start gap-2.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={screeningInterviewEnabled}
                                onChange={(e) => setScreeningInterviewEnabled(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-primary/30"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-ink">Screening Interview</span>
                                  <span className="text-[10px] font-bold text-primary-glow">10 credits</span>
                                </div>
                                <p className="text-[11px] text-ink-soft mt-0.5">
                                  AI video screening for communication, culture fit, career motivations, and background.
                                </p>
                              </div>
                            </label>

                            {screeningInterviewEnabled && (
                              <div className="mt-3 pt-2 border-t border-border/70 space-y-2.5">
                                <RoundScheduleSelector
                                  label="Screening Schedule & Timing"
                                  schedule={screeningSchedule}
                                  onChange={setScreeningSchedule}
                                  onDurationChange={(mins) => setScreeningDuration(mins)}
                                />
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-medium text-ink-soft">Session Duration</span>
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="number"
                                      min={10}
                                      max={45}
                                      value={screeningDuration}
                                      onChange={(e) => setScreeningDuration(Math.max(10, parseInt(e.target.value) || 10))}
                                      className="input-base text-xs py-1 w-16 text-center"
                                    />
                                    <span className="text-[11px] text-ink-soft">mins</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Technical Interview Sub-card */}
                          <div
                            className={`p-3.5 rounded-xl border transition ${
                              technicalInterviewEnabled
                                ? "border-primary/30 bg-white shadow-xs"
                                : "border-border bg-surface-alt/40"
                            }`}
                          >
                            <label className="flex items-start gap-2.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={technicalInterviewEnabled}
                                onChange={(e) => setTechnicalInterviewEnabled(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-primary/30"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-ink">Technical Interview</span>
                                  <span className="text-[10px] font-bold text-primary-glow">10 credits</span>
                                </div>
                                <p className="text-[11px] text-ink-soft mt-0.5">
                                  Deep-dive AI technical interview evaluating core domain knowledge, coding logic, and system architecture.
                                </p>
                              </div>
                            </label>

                            {technicalInterviewEnabled && (
                              <div className="mt-3 pt-2 border-t border-border/70 space-y-2.5">
                                <RoundScheduleSelector
                                  label="Technical Schedule & Timing"
                                  schedule={technicalSchedule}
                                  onChange={setTechnicalSchedule}
                                  onDurationChange={(mins) => setTechnicalDuration(mins)}
                                />
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-medium text-ink-soft">Session Duration</span>
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="number"
                                      min={20}
                                      max={90}
                                      value={technicalDuration}
                                      onChange={(e) => setTechnicalDuration(Math.max(20, parseInt(e.target.value) || 20))}
                                      className="input-base text-xs py-1 w-16 text-center"
                                    />
                                    <span className="text-[11px] text-ink-soft">mins</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Video Interview Sub-card */}
                          <div
                            className={`p-3.5 rounded-xl border transition ${
                              videoInterviewEnabled
                                ? "border-primary/30 bg-white shadow-xs"
                                : "border-border bg-surface-alt/40"
                            }`}
                          >
                            <label className="flex items-start gap-2.5 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={videoInterviewEnabled}
                                onChange={(e) => setVideoInterviewEnabled(e.target.checked)}
                                className="mt-0.5 w-4 h-4 rounded text-primary focus:ring-primary/30"
                              />
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-bold text-ink">Video Interview</span>
                                    <span className="inline-flex items-center gap-1 text-[9px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-1.5 py-0.5 rounded-full">
                                      <Video className="w-2.5 h-2.5 text-indigo-500" /> Video
                                    </span>
                                  </div>
                                  <span className="text-[10px] font-bold text-primary-glow">10 credits</span>
                                </div>
                                <p className="text-[11px] text-ink-soft mt-0.5">
                                  Candidate one-way video interview recording responses to dynamic questions, assessing presentation and verbal communication.
                                </p>
                              </div>
                            </label>

                            {videoInterviewEnabled && (
                              <div className="mt-3 pt-2 border-t border-border/70 space-y-2.5">
                                <RoundScheduleSelector
                                  label="Video Interview Schedule & Timing"
                                  schedule={videoSchedule}
                                  onChange={setVideoSchedule}
                                  onDurationChange={(mins) => setVideoDuration(mins)}
                                />
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] font-medium text-ink-soft">Session Duration</span>
                                  <div className="flex items-center gap-1.5">
                                    <input
                                      type="number"
                                      min={10}
                                      max={60}
                                      value={videoDuration}
                                      onChange={(e) => setVideoDuration(Math.max(10, parseInt(e.target.value) || 10))}
                                      className="input-base text-xs py-1 w-16 text-center"
                                    />
                                    <span className="text-[11px] text-ink-soft">mins</span>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Custom Interview Rounds */}
                        <div className="mt-4 pt-3 border-t border-border/70 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                                <span>Custom Interview Rounds</span>
                                {customRounds.filter((r) => r.category === "interview").length > 0 && (
                                  <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full">
                                    {customRounds.filter((r) => r.category === "interview").length}
                                  </span>
                                )}
                              </span>
                              <p className="text-[11px] text-ink-soft">
                                Add specialized interview stages (e.g. Hiring Manager, System Architecture, Culture Fit, Executive).
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleOpenAddCustomRound("interview")}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-glow border border-primary/30 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-xl transition cursor-pointer shrink-0"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Custom Interview Round</span>
                            </button>
                          </div>

                          {customRounds.filter((r) => r.category === "interview").length > 0 ? (
                            <div className="space-y-2">
                              {customRounds
                                .filter((r) => r.category === "interview")
                                .map((round) => renderCustomRoundCard(round))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-ink-soft italic">
                              No custom interview rounds added yet. Click &quot;Add Custom Interview Round&quot; to configure managerial, culture, or panel interviews.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Option 4: Domain specific test */}
                  <div
                    className={`rounded-xl border transition ${
                      domainSpecificEnabled ? "border-primary/40 bg-primary/5 p-4" : "border-border bg-background p-4"
                    }`}
                  >
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={domainSpecificEnabled}
                        onChange={(e) => setDomainSpecificEnabled(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary/30 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Code className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm font-bold text-ink">Domain specific test</span>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                              Domain Focus
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                            10 credits
                          </span>
                        </div>
                        <p className="text-xs text-ink-soft mt-0.5">
                          Targeted domain-specific evaluation assessing specialized domain expertise, job-specific problem scenarios, and hands-on competence.
                        </p>
                      </div>
                    </label>

                    {domainSpecificEnabled && (
                      <div className="mt-4 pt-3 border-t border-border/70 space-y-4">
                        {/* Domain Specific Test Schedule & Timing */}
                        <RoundScheduleSelector
                          label="Domain Specific Test Schedule & Timing"
                          schedule={domainSpecificSchedule}
                          onChange={setDomainSpecificSchedule}
                          onDurationChange={(mins) => setDomainSpecificDuration(mins)}
                          description="Select scheduled assessment date, start time, and end time. Total duration in hours is calculated automatically."
                        />

                        {/* Duration, Questions & Passing score */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-[11px] font-medium text-ink-soft block mb-1">Questions</label>
                            <input
                              type="number"
                              min={5}
                              max={50}
                              value={domainSpecificQuestions}
                              onChange={(e) => setDomainSpecificQuestions(Math.max(5, parseInt(e.target.value) || 5))}
                              className="input-base text-xs py-1.5"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-medium text-ink-soft block mb-1">Total Duration (mins)</label>
                            <input
                              type="number"
                              min={15}
                              max={180}
                              value={domainSpecificDuration}
                              onChange={(e) => setDomainSpecificDuration(Math.max(15, parseInt(e.target.value) || 15))}
                              className="input-base text-xs py-1.5"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-medium text-ink-soft block mb-1">Passing Score (%)</label>
                            <input
                              type="number"
                              min={40}
                              max={100}
                              value={domainSpecificPassingScore}
                              onChange={(e) => setDomainSpecificPassingScore(Math.max(40, parseInt(e.target.value) || 40))}
                              className="input-base text-xs py-1.5"
                            />
                          </div>
                        </div>

                        {/* Custom Questions for Domain Specific Test */}
                        <div className="pt-2 border-t border-border/70 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-ink">
                              Custom Domain Challenges ({domainCustomQuestions.length})
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenRoundQuestionConfig(
                                    "round_domain_specific",
                                    "domain_specific",
                                    "Domain Specific Test",
                                    domainSpecificDuration,
                                    domainSpecificPassingScore
                                  )
                                }
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-glow border border-primary/30 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-xl transition cursor-pointer"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                Configure with AI / Review
                              </button>
                              <button
                                type="button"
                                onClick={() => setCustomQuestionModalTarget("ai_assessment")}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-glow border border-primary/30 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-xl transition cursor-pointer"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Add Custom Challenge
                              </button>
                            </div>
                          </div>

                          {domainCustomQuestions.length > 0 ? (
                            <div className="space-y-2">
                              {domainCustomQuestions.map((q, idx) => (
                                <div
                                  key={q.id}
                                  className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-surface border border-border text-xs"
                                >
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-ink">#{idx + 1}:</span>
                                      <span className="font-medium text-ink truncate">{q.question}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-ink-soft">
                                      <span className="font-semibold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px]">
                                        {q.type === "coding" ? "Scenario Challenge" : "Domain Question"}
                                      </span>
                                      <span>•</span>
                                      <span>{q.points || 5} pts</span>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveCustomQuestion("ai_assessment", q.id)}
                                    className="p-1.5 rounded-lg text-ink-soft hover:text-destructive hover:bg-destructive/10 transition cursor-pointer shrink-0"
                                    aria-label="Remove question"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-ink-soft">
                              No custom questions added yet. AI will auto-curate specialized domain challenges tailored to the role.
                            </p>
                          )}
                        </div>

                        {/* Custom Domain Specific Rounds */}
                        <div className="pt-3 border-t border-border/70 space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                                <span>Custom Domain Specific Rounds</span>
                                {customRounds.filter((r) => r.category === "domain").length > 0 && (
                                  <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full">
                                    {customRounds.filter((r) => r.category === "domain").length}
                                  </span>
                                )}
                              </span>
                              <p className="text-[11px] text-ink-soft">
                                Add tailored technical challenges (e.g. Case Study, Practical Assignment).
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleOpenAddCustomRound("domain")}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-glow border border-primary/30 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 rounded-xl transition cursor-pointer shrink-0"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add Custom Domain Round</span>
                            </button>
                          </div>

                          {customRounds.filter((r) => r.category === "domain").length > 0 ? (
                            <div className="space-y-2">
                              {customRounds
                                .filter((r) => r.category === "domain")
                                .map((round) => renderCustomRoundCard(round))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-ink-soft italic">
                              No custom domain rounds added yet. Click &quot;Add Custom Domain Round&quot; to configure practical domain-specific assignments.
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* STEP 3: Candidate Collection & Funnel Targets + Credit Summary */}
          {step === 3 && (
            <>
              {/* Section 1 in Step 3: Linguistic Test (Optional) */}
              <div className="bg-surface border border-border rounded-2xl shadow-elegant p-6 space-y-5 transition-all">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20">
                      <Languages className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-ink uppercase tracking-wider">Linguistic Test (Optional)</h2>
                        <span className="text-[10px] font-bold text-teal-700 dark:text-teal-300 bg-teal-500/15 border border-teal-500/30 px-2 py-0.5 rounded-full">
                          Optional
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-soft">
                        Assess candidate multi-modal communication proficiency (speak, read, write), fluency &amp; expertise scores, native language background, and certification benchmarks.
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={linguisticTestEnabled}
                      onChange={(e) => setLinguisticTestEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600"></div>
                  </label>
                </div>

                {!linguisticTestEnabled ? (
                  <div className="p-4 rounded-xl bg-surface-alt/40 border border-border/80 flex items-center justify-between gap-4">
                    <p className="text-xs text-ink-soft">
                      <span className="font-semibold text-ink">Linguistic testing is optional and currently disabled.</span> Enable this section if this position requires verified speaking, reading, writing fluency or international certificate scores (e.g. IELTS, TOEFL, CEFR).
                    </p>
                    <button
                      type="button"
                      onClick={() => setLinguisticTestEnabled(true)}
                      className="shrink-0 px-3 py-1.5 text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 rounded-lg border border-teal-500/30 transition cursor-pointer"
                    >
                      Enable Linguistic Test
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 pt-1">
                    {/* Modalities Selection: Speak, Read, Write */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-ink">
                          Evaluation Modalities (Select Speak, Read, Write)
                        </label>
                        <span className="text-[10px] text-ink-soft">Select all applicable modules</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* Speak */}
                        <div
                          onClick={() => setLinguisticSpeak(!linguisticSpeak)}
                          className={`p-3.5 rounded-xl border transition cursor-pointer select-none flex items-start gap-3 ${
                            linguisticSpeak
                              ? "border-teal-500/50 bg-teal-500/5 shadow-xs"
                              : "border-border bg-surface-alt/30 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={linguisticSpeak}
                            onChange={(e) => setLinguisticSpeak(e.target.checked)}
                            className="mt-0.5 w-4 h-4 rounded text-teal-600 focus:ring-teal-500/30"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 font-bold text-xs text-ink">
                              <Mic className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                              <span>Speak</span>
                            </div>
                            <p className="text-[11px] text-ink-soft mt-0.5">
                              Oral clarity, accent comprehension, pronunciation &amp; live conversational response.
                            </p>
                          </div>
                        </div>

                        {/* Read */}
                        <div
                          onClick={() => setLinguisticRead(!linguisticRead)}
                          className={`p-3.5 rounded-xl border transition cursor-pointer select-none flex items-start gap-3 ${
                            linguisticRead
                              ? "border-teal-500/50 bg-teal-500/5 shadow-xs"
                              : "border-border bg-surface-alt/30 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={linguisticRead}
                            onChange={(e) => setLinguisticRead(e.target.checked)}
                            className="mt-0.5 w-4 h-4 rounded text-teal-600 focus:ring-teal-500/30"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 font-bold text-xs text-ink">
                              <BookOpen className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                              <span>Read</span>
                            </div>
                            <p className="text-[11px] text-ink-soft mt-0.5">
                              Technical comprehension, skimming speed, critical inference &amp; text analysis.
                            </p>
                          </div>
                        </div>

                        {/* Write */}
                        <div
                          onClick={() => setLinguisticWrite(!linguisticWrite)}
                          className={`p-3.5 rounded-xl border transition cursor-pointer select-none flex items-start gap-3 ${
                            linguisticWrite
                              ? "border-teal-500/50 bg-teal-500/5 shadow-xs"
                              : "border-border bg-surface-alt/30 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={linguisticWrite}
                            onChange={(e) => setLinguisticWrite(e.target.checked)}
                            className="mt-0.5 w-4 h-4 rounded text-teal-600 focus:ring-teal-500/30"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 font-bold text-xs text-ink">
                              <PenTool className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                              <span>Write</span>
                            </div>
                            <p className="text-[11px] text-ink-soft mt-0.5">
                              Professional syntax, business documentation, vocabulary breadth &amp; grammatical rigor.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Fluency Score % & Expertise Score % */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                      {/* Fluency Score */}
                      <div className="p-3.5 rounded-xl bg-surface-alt/50 border border-border space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-ink">
                            Minimum Fluency Score (%)
                          </label>
                          <span className="text-xs font-extrabold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-md">
                            {linguisticFluencyScore}%
                          </span>
                        </div>
                        <p className="text-[11px] text-ink-soft">
                          Candidate speech pacing, conversational fluidity, and natural pacing.
                        </p>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min={0}
                            max={100}
                            step={5}
                            value={linguisticFluencyScore}
                            onChange={(e) => setLinguisticFluencyScore(Number(e.target.value))}
                            className="w-full accent-teal-600"
                          />
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={linguisticFluencyScore}
                            onChange={(e) => setLinguisticFluencyScore(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                            className="w-16 px-2 py-1 text-xs font-bold text-center rounded-lg bg-surface border border-border text-ink"
                          />
                        </div>
                      </div>

                      {/* Expertise Score */}
                      <div className="p-3.5 rounded-xl bg-surface-alt/50 border border-border space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-ink">
                            Minimum Expertise Score (%)
                          </label>
                          <span className="text-xs font-extrabold text-teal-600 dark:text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-md">
                            {linguisticExpertiseScore}%
                          </span>
                        </div>
                        <p className="text-[11px] text-ink-soft">
                          Command of complex terminology, idiomatic expressions, and professional register.
                        </p>
                        <div className="flex items-center gap-3">
                          <input
                            type="range"
                            min={0}
                            max={100}
                            step={5}
                            value={linguisticExpertiseScore}
                            onChange={(e) => setLinguisticExpertiseScore(Number(e.target.value))}
                            className="w-full accent-teal-600"
                          />
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={linguisticExpertiseScore}
                            onChange={(e) => setLinguisticExpertiseScore(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                            className="w-16 px-2 py-1 text-xs font-bold text-center rounded-lg bg-surface border border-border text-ink"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Native Speaker Option & Certificate Score */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                      {/* Option to Select Native */}
                      <div
                        onClick={() => setLinguisticNative(!linguisticNative)}
                        className={`p-3.5 rounded-xl border transition cursor-pointer select-none flex items-start gap-3 ${
                          linguisticNative
                            ? "border-teal-500/40 bg-teal-500/5 shadow-xs"
                            : "border-border bg-surface-alt/40 hover:bg-surface-alt/60"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={linguisticNative}
                          onChange={(e) => setLinguisticNative(e.target.checked)}
                          className="mt-1 w-4 h-4 rounded text-teal-600 focus:ring-teal-500/30"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 font-bold text-xs text-ink">
                            <Award className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                            <span>Native Speaker Required / Preferred</span>
                          </div>
                          <p className="text-[11px] text-ink-soft mt-1 leading-relaxed">
                            Candidate must possess native or bilingual mother-tongue proficiency for client-facing or regional operations.
                          </p>
                        </div>
                      </div>

                      {/* Certificate Score (IELTS, etc.) */}
                      <div className="p-3.5 rounded-xl bg-surface-alt/40 border border-border space-y-2">
                        <label className="text-xs font-bold text-ink block">
                          Certificate Score Requirement (e.g. IELTS, TOEFL, CEFR)
                        </label>
                        <div className="flex items-center gap-2">
                          <select
                            value={linguisticCertType}
                            onChange={(e) => setLinguisticCertType(e.target.value)}
                            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-surface border border-border text-ink focus:outline-none focus:border-teal-500"
                          >
                            <option value="IELTS">IELTS</option>
                            <option value="TOEFL">TOEFL (iBT)</option>
                            <option value="CEFR">CEFR Level</option>
                            <option value="Cambridge">Cambridge English</option>
                            <option value="PTE">PTE Academic</option>
                            <option value="Other">Other Certificate</option>
                          </select>
                          <input
                            type="text"
                            placeholder={
                              linguisticCertType === "IELTS"
                                ? "e.g. 7.5+ Band"
                                : linguisticCertType === "TOEFL"
                                ? "e.g. 100+ score"
                                : linguisticCertType === "CEFR"
                                ? "e.g. C1 or C2"
                                : "Minimum score / grade"
                            }
                            value={linguisticCertScore}
                            onChange={(e) => setLinguisticCertScore(e.target.value)}
                            className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-surface border border-border text-ink focus:outline-none focus:border-teal-500"
                          />
                        </div>
                        <p className="text-[10px] text-ink-soft">
                          Candidates can submit or verify credentials from accredited international testing providers.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section 2 in Step 3: Psychometric Test & Genius Test */}
              <div className="bg-surface border border-border rounded-2xl shadow-elegant p-6 space-y-5 transition-all">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-500/20">
                      <BrainCircuit className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-ink uppercase tracking-wider">Psychometric Test &amp; Genius Test</h2>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                            psychometricEnabled || geniusEnabled
                              ? "text-purple-700 dark:text-purple-300 bg-purple-500/15 border-purple-500/30"
                              : "text-ink-soft bg-surface-alt border-border"
                          }`}
                        >
                          {psychometricEnabled && geniusEnabled
                            ? "2 of 2 Active in Pipeline"
                            : psychometricEnabled
                            ? "Psychometric Active in Pipeline"
                            : geniusEnabled
                            ? "Genius Test Active in Pipeline"
                            : "Optional · Excluded from Pipeline"}
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-soft">
                        Select only if you want candidates to undergo these rounds. Unselected assessments will not create stages in the candidate hiring pipeline.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-1">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Psychometric Test Card */}
                    <div
                      className={`p-4 rounded-xl border transition-all space-y-3 ${
                        psychometricEnabled
                          ? "border-purple-500/40 bg-purple-500/5 shadow-xs"
                          : "border-border bg-surface-alt/30 hover:border-purple-500/30"
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={psychometricEnabled}
                            onChange={(e) => setPsychometricEnabled(e.target.checked)}
                            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500/30 cursor-pointer"
                          />
                          <div className="flex items-center gap-1.5 font-bold text-xs text-ink">
                            <BrainCircuit className="w-3.5 h-3.5 text-purple-500" />
                            <span>Psychometric Assessment</span>
                          </div>
                        </label>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition ${
                            psychometricEnabled
                              ? "text-purple-700 dark:text-purple-300 bg-purple-500/15 border-purple-500/30"
                              : "text-ink-soft bg-surface-alt border-border"
                          }`}
                        >
                          {psychometricEnabled ? "✓ Active in Pipeline" : "Excluded from Pipeline"}
                        </span>
                      </div>

                      <p className="text-[11px] text-ink-soft leading-relaxed">
                        Evaluates candidate psychological workplace behavior, situational judgment (SJT), emotional resilience, and cultural alignment.
                      </p>

                      {!psychometricEnabled ? (
                        <div className="p-3 rounded-lg bg-surface/80 border border-dashed border-border flex items-center justify-between gap-3 text-xs">
                          <span className="text-[11px] text-ink-soft">
                            Click checkbox or button to include Psychometric stage in candidate pipeline.
                          </span>
                          <button
                            type="button"
                            onClick={() => setPsychometricEnabled(true)}
                            className="shrink-0 px-2.5 py-1 text-[11px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 rounded-lg border border-purple-500/25 transition cursor-pointer"
                          >
                            + Enable in Pipeline
                          </button>
                        </div>
                      ) : (
                        <div className="pt-2 border-t border-border/70 space-y-2.5 animate-in fade-in duration-200">
                          <RoundScheduleSelector
                            label="Psychometric Schedule &amp; Timing"
                            schedule={psychometricSchedule}
                            onChange={setPsychometricSchedule}
                            onDurationChange={(mins) => setPsychometricDuration(mins)}
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-medium text-ink-soft">Assessment Duration</span>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min={15}
                                max={180}
                                value={psychometricDuration}
                                onChange={(e) => setPsychometricDuration(Math.max(15, parseInt(e.target.value) || 15))}
                                className="input-base text-xs py-1 w-16 text-center"
                              />
                              <span className="text-[11px] text-ink-soft">mins</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Genius Test Card */}
                    <div
                      className={`p-4 rounded-xl border transition-all space-y-3 ${
                        geniusEnabled
                          ? "border-amber-500/40 bg-amber-500/5 shadow-xs"
                          : "border-border bg-surface-alt/30 hover:border-amber-500/30"
                      }`}
                    >
                      <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={geniusEnabled}
                            onChange={(e) => setGeniusEnabled(e.target.checked)}
                            className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500/30 cursor-pointer"
                          />
                          <div className="flex items-center gap-1.5 font-bold text-xs text-ink">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                            <span>Genius Test (Cognitive IQ)</span>
                          </div>
                        </label>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition ${
                            geniusEnabled
                              ? "text-amber-700 dark:text-amber-300 bg-amber-500/15 border-amber-500/30"
                              : "text-ink-soft bg-surface-alt border-border"
                          }`}
                        >
                          {geniusEnabled ? "✓ Active in Pipeline" : "Excluded from Pipeline"}
                        </span>
                      </div>

                      <p className="text-[11px] text-ink-soft leading-relaxed">
                        Measures numerical reasoning, abstract pattern recognition, spatial logic, and rapid algorithmic problem-solving horsepower.
                      </p>

                      {!geniusEnabled ? (
                        <div className="p-3 rounded-lg bg-surface/80 border border-dashed border-border flex items-center justify-between gap-3 text-xs">
                          <span className="text-[11px] text-ink-soft">
                            Click checkbox or button to include Genius Test stage in candidate pipeline.
                          </span>
                          <button
                            type="button"
                            onClick={() => setGeniusEnabled(true)}
                            className="shrink-0 px-2.5 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg border border-amber-500/25 transition cursor-pointer"
                          >
                            + Enable in Pipeline
                          </button>
                        </div>
                      ) : (
                        <div className="pt-2 border-t border-border/70 space-y-2.5 animate-in fade-in duration-200">
                          <RoundScheduleSelector
                            label="Genius Test Schedule &amp; Timing"
                            schedule={geniusSchedule}
                            onChange={setGeniusSchedule}
                            onDurationChange={(mins) => setGeniusDuration(mins)}
                          />
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-medium text-ink-soft">Assessment Duration</span>
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min={15}
                                max={180}
                                value={geniusDuration}
                                onChange={(e) => setGeniusDuration(Math.max(15, parseInt(e.target.value) || 15))}
                                className="input-base text-xs py-1 w-16 text-center"
                              />
                              <span className="text-[11px] text-ink-soft">mins</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Security & Anti-Cheating Guarantee Banner */}
                  <div className="p-3 rounded-xl bg-surface-alt/60 border border-border flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-ink-soft">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>
                        {psychometricEnabled || geniusEnabled
                          ? "AI screen proctoring, multi-monitor check & randomized dynamic question banks enabled for selected tests."
                          : "Proctoring ready. Select either test above to activate automated proctored rounds in the candidate pipeline."}
                      </span>
                    </div>
                    <span
                      className={`text-[11px] font-bold border px-2 py-0.5 rounded-full shrink-0 ${
                        psychometricEnabled || geniusEnabled
                          ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                          : "text-ink-soft bg-surface-alt border-border"
                      }`}
                    >
                      {psychometricEnabled || geniusEnabled ? "Proctoring Active" : "Proctoring Standby"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 3 in Step 3: Candidate Collection & Funnel Targets */}
              <div className="bg-surface border border-border rounded-2xl shadow-elegant p-6 space-y-5">
                <div className="flex items-center gap-2 border-b border-border pb-3">
                  <Sparkles className="w-4 h-4 text-primary-glow" />
                  <h2 className="text-sm font-bold text-ink uppercase tracking-wider">Candidate Collection & Funnel Targets</h2>
                </div>

                {/* 3 Core Target Inputs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1.5 shadow-xs">
                    <label htmlFor="finalShortlistTarget" className="text-xs font-bold text-ink block">
                      Final Shortlist Target
                    </label>
                    <input
                      id="finalShortlistTarget"
                      type="number"
                      min={1}
                      max={100}
                      value={finalShortlistTarget}
                      onChange={(e) => {
                        const val = Math.max(1, parseInt(e.target.value) || 1);
                        setFinalShortlistTarget(val);
                        setIdealIntake(Math.max(val, Math.ceil(val * 1.5)));
                        setMinimumIntake(Math.max(1, Math.ceil(val * 0.8)));
                      }}
                      className="w-full px-3 py-1.5 text-sm font-bold rounded-lg bg-surface-alt border border-border text-ink focus:outline-none focus:border-primary text-center"
                    />
                    <p className="text-[10px] text-ink-soft leading-tight">
                      Target candidates to reach your final hiring shortlist.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1.5 shadow-xs">
                    <label htmlFor="idealIntake" className="text-xs font-bold text-ink block">
                      Ideal Candidate Intake
                    </label>
                    <input
                      id="idealIntake"
                      type="number"
                      min={1}
                      max={300}
                      value={idealIntake}
                      onChange={(e) => setIdealIntake(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3 py-1.5 text-sm font-bold rounded-lg bg-surface-alt border border-border text-ink focus:outline-none focus:border-primary text-center"
                    />
                    <p className="text-[10px] text-ink-soft leading-tight">
                      Target qualified intake volume to run through assessment rounds.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1.5 shadow-xs">
                    <label htmlFor="minimumIntake" className="text-xs font-bold text-ink block">
                      Minimum Candidate Intake
                    </label>
                    <input
                      id="minimumIntake"
                      type="number"
                      min={1}
                      max={300}
                      value={minimumIntake}
                      onChange={(e) => setMinimumIntake(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-3 py-1.5 text-sm font-bold rounded-lg bg-surface-alt border border-border text-ink focus:outline-none focus:border-primary text-center"
                    />
                    <p className="text-[10px] text-ink-soft leading-tight">
                      Minimum intake required before automated pipeline starts.
                    </p>
                  </div>
                </div>

                {/* Window & Extension Settings */}
                <div className="pt-2 border-t border-border/80 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label htmlFor="collectionDurationDays" className="text-xs font-semibold text-ink block mb-1">
                      Collection Window
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        id="collectionDurationDays"
                        type="number"
                        min={1}
                        max={60}
                        value={collectionDurationDays}
                        onChange={(e) => setCollectionDurationDays(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 px-3 py-1.5 text-xs font-semibold rounded-lg bg-surface border border-border text-ink text-center"
                      />
                      <span className="text-xs text-ink-soft">days</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-ink block mb-1">
                      Auto-Extend Window
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer pt-0.5">
                      <input
                        type="checkbox"
                        checked={autoExtensionEnabled}
                        onChange={(e) => setAutoExtensionEnabled(e.target.checked)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary/30"
                      />
                      <span className="text-xs text-ink-soft">
                        {autoExtensionEnabled ? "Enabled if under minimum" : "Disabled"}
                      </span>
                    </label>
                  </div>

                  {autoExtensionEnabled && (
                    <div className="flex items-center gap-3">
                      <div>
                        <label className="text-[11px] font-medium text-ink-soft block mb-1">Extend By</label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={1}
                            max={30}
                            value={extensionDurationDays}
                            onChange={(e) => setExtensionDurationDays(Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-14 px-2 py-1 text-xs font-semibold rounded-lg bg-surface border border-border text-center text-ink"
                          />
                          <span className="text-[11px] text-ink-soft">d</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] font-medium text-ink-soft block mb-1">Max Times</label>
                        <input
                          type="number"
                          min={1}
                          max={5}
                          value={maxExtensions}
                          onChange={(e) => setMaxExtensions(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-14 px-2 py-1 text-xs font-semibold rounded-lg bg-surface border border-border text-center text-ink"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Auto-Start Pipeline Setting */}
                <div className="pt-2 border-t border-border/80 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-ink block">Auto-Start Pipeline</span>
                    <p className="text-[11px] text-ink-soft">
                      Automatically start the funnel as soon as minimum intake ({minimumIntake}) is reached.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={autoStartEnabled}
                      onChange={(e) => setAutoStartEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>

              {/* Job Listings / Promote Job Section */}
              <div className="bg-surface border border-border rounded-2xl shadow-elegant p-6 space-y-5">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Megaphone className="w-4 h-4 text-primary-glow" />
                    <h2 className="text-sm font-bold text-ink uppercase tracking-wider">Job Listings &amp; Promotion</h2>
                  </div>
                  <span className="text-xs font-bold text-primary-glow bg-primary/10 px-2.5 py-1 rounded-full">
                    {(listAsJob ? 10 : 0) + (featuredJob ? 10 : 0) + (listInLandingPage ? 10 : 0) + (listInRecentlyPosted ? 10 : 0)} Credits
                  </span>
                </div>

                <p className="text-xs text-ink-soft">
                  Maximize candidate reach and application volume. Select the promotion channels that best fit this role:
                </p>

                <div className="space-y-3">
                  {/* Checkbox 1: List as Job Listing */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-xl border transition cursor-pointer select-none ${
                      listAsJob
                        ? "border-primary/40 bg-primary/5 shadow-xs"
                        : "border-border bg-background hover:bg-surface-alt/40"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={listAsJob}
                      onChange={(e) => setListAsJob(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary/30"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs sm:text-sm font-bold text-ink">List as Standard Job Listing</span>
                        <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                          10 credits
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-ink-soft mt-1 leading-relaxed">
                        Publish role directly to the Letgetin public job directory, active candidate job board, and candidate search feeds.
                      </p>
                    </div>
                  </label>

                  {/* Checkbox 2: Featured Job Listing */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-xl border transition cursor-pointer select-none ${
                      featuredJob
                        ? "border-amber-500/40 bg-amber-500/5 shadow-xs"
                        : "border-border bg-background hover:bg-surface-alt/40"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={featuredJob}
                      onChange={(e) => setFeaturedJob(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-amber-500 focus:ring-amber-500/30"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-bold text-ink">Featured Job Listing</span>
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 rounded-full">
                            <Sparkles className="w-2.5 h-2.5 text-amber-500" /> Featured
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full shrink-0">
                          10 credits
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-ink-soft mt-1 leading-relaxed">
                        Prominently highlighted with a &ldquo;Featured&rdquo; badge, pinned at the top of category searches, and recommended to active applicants for 3x higher visibility.
                      </p>
                    </div>
                  </label>

                  {/* Checkbox 3: List in Landing Page */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-xl border transition cursor-pointer select-none ${
                      listInLandingPage
                        ? "border-emerald-500/40 bg-emerald-500/5 shadow-xs"
                        : "border-border bg-background hover:bg-surface-alt/40"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={listInLandingPage}
                      onChange={(e) => setListInLandingPage(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500/30"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-bold text-ink">List in Landing Page</span>
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 rounded-full">
                            <Globe className="w-2.5 h-2.5 text-emerald-500" /> Landing Page
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">
                          10 credits
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-ink-soft mt-1 leading-relaxed">
                        Showcase prominently on the Letgetin homepage hero and discovery showcase, capturing active visitors and candidate impressions directly.
                      </p>
                    </div>
                  </label>

                  {/* Checkbox 4: List in Recently Posted Section */}
                  <label
                    className={`flex items-start gap-3.5 p-4 rounded-xl border transition cursor-pointer select-none ${
                      listInRecentlyPosted
                        ? "border-cyan-500/40 bg-cyan-500/5 shadow-xs"
                        : "border-border bg-background hover:bg-surface-alt/40"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={listInRecentlyPosted}
                      onChange={(e) => setListInRecentlyPosted(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500/30"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-bold text-ink">List in Recently Posted Section</span>
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 px-1.5 py-0.5 rounded-full">
                            <Clock className="w-2.5 h-2.5 text-cyan-500" /> Recently Posted
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full shrink-0">
                          10 credits
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-ink-soft mt-1 leading-relaxed">
                        Pin in the live &ldquo;Recently Posted Jobs&rdquo; banner feed and instant candidate job alerts for immediate applications.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-surface-alt/60 border border-border text-xs text-ink-soft">
                  <span>Selected promotion channel cost:</span>
                  <span className="font-bold text-ink">
                    {(listAsJob ? 10 : 0) + (featuredJob ? 10 : 0) + (listInLandingPage ? 10 : 0) + (listInRecentlyPosted ? 10 : 0)} credits
                  </span>
                </div>
              </div>
            </>
          )}

          {/* STEP 4: Credits & Payment */}
          {step === 4 && (
            <>
              {/* Card 1: Credit Summary & Breakdown */}
              <div className="bg-surface border border-border rounded-2xl shadow-elegant p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-primary-glow" />
                    <h2 className="text-sm font-bold text-ink uppercase tracking-wider">Credit Summary &amp; Review</h2>
                  </div>
                  <span className="text-xs font-bold text-primary-glow bg-primary/10 px-2.5 py-1 rounded-full">
                    {totalCost} Total Credits
                  </span>
                </div>

                {summaryLines.length === 0 ? (
                  <p className="text-xs text-ink-soft py-2">
                    No paid pipeline or promotion steps selected — this job will be free to publish.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {summaryLines.map((l) => (
                      <div
                        key={l.key}
                        className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-surface-alt/70 border border-border text-ink"
                      >
                        <span>{l.label}</span>
                        <span className="text-primary-glow font-bold">{l.cost} credits</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-3 border-t border-border space-y-2">
                  <div className="flex items-center justify-between text-xs text-ink-soft">
                    <span>Available Credit Balance</span>
                    <span className="font-bold text-ink">{loadingCredits ? "…" : `${balance ?? 0} credits`}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-ink-soft">
                    <span>Role Pipeline &amp; Promotion Cost</span>
                    <span className="font-extrabold text-ink">{totalCost} credits</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-bold pt-1 border-t border-border/60">
                    <span className="text-ink">Balance After Publish</span>
                    <span className={hasInsufficientCredits ? "text-destructive font-bold" : "text-emerald-600 font-bold"}>
                      {balanceAfterPublish != null ? `${balanceAfterPublish} credits` : "—"}
                    </span>
                  </div>
                </div>

                {hasInsufficientCredits && (
                  <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 space-y-2">
                    <p className="text-xs text-destructive font-semibold">
                      Insufficient credit balance. You need {totalCost - (balance ?? 0)} more credits to publish this role.
                    </p>
                    <button
                      type="button"
                      onClick={() => setBuyModalOpen(true)}
                      className="w-full inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-primary text-white py-2 px-3 rounded-lg shadow-sm hover:opacity-95 cursor-pointer"
                    >
                      <PlusCircle className="w-3.5 h-3.5" /> Buy More Credits
                    </button>
                  </div>
                )}
              </div>

              {/* Card 2: Current Plan & Upgrade Plan Card */}
              <div className="bg-surface border border-border rounded-2xl shadow-elegant p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <div className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-amber-500" />
                    <h2 className="text-sm font-bold text-ink uppercase tracking-wider">Current Plan &amp; Upgrade</h2>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active Plan
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-primary/5 via-surface-alt/60 to-surface border border-border flex-wrap sm:flex-nowrap">
                  <div className="space-y-1 min-w-0">
                    <div className="text-xs font-semibold text-ink-soft uppercase tracking-wider">Subscription Tier</div>
                    <div className="text-base font-extrabold text-ink truncate">Growth Recruiter Pro</div>
                    <p className="text-xs text-ink-soft">
                      Includes multi-stage proctored testing, AI interviews, and automated candidate funnels.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setUpgradeModalOpen(true)}
                    className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold bg-gradient-brand text-white px-4 py-2.5 rounded-xl shadow-sm hover:scale-[1.02] active:scale-95 transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                    Upgrade Plan
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-ink-soft">
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-alt/40 border border-border/70">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Multi-stage proctored assessments</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-alt/40 border border-border/70">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Automated candidate funneling</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-alt/40 border border-border/70">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>AI ATS resume shortlisting</span>
                  </div>
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-alt/40 border border-border/70">
                    <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span>Standard &amp; Featured job promotion</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Local Error Message */}
          {localError && (
            <p className="text-xs text-destructive bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-3 font-semibold">
              ⚠️ {localError}
            </p>
          )}

          {/* Bottom Navigation Buttons */}
          <div className="pt-4 border-t border-border flex items-center justify-between gap-4">
            {step === 1 && (
              <>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isSavingDraft || isSubmitting}
                  className="text-xs font-semibold text-ink-soft hover:text-ink px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-alt transition cursor-pointer disabled:opacity-50"
                >
                  {isSavingDraft ? "Saving draft…" : "Save as draft"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (validateStep1()) setStep(2);
                  }}
                  className="inline-flex items-center gap-2 text-xs font-bold bg-gradient-brand text-white px-5 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition hover:scale-[1.02] active:scale-95 cursor-pointer"
                >
                  <span>Next: Pipeline &amp; Assessments</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft hover:text-ink px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-alt transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Role Details</span>
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={isSavingDraft || isSubmitting}
                    className="text-xs font-semibold text-ink-soft hover:text-ink px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-alt transition cursor-pointer disabled:opacity-50"
                  >
                    {isSavingDraft ? "Saving…" : "Save draft"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep2()) setStep(3);
                    }}
                    className="inline-flex items-center gap-2 text-xs font-bold bg-gradient-brand text-white px-5 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <span>Next: Funnel &amp; Promotion</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft hover:text-ink px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-alt transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Pipeline</span>
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={isSavingDraft || isSubmitting}
                    className="text-xs font-semibold text-ink-soft hover:text-ink px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-alt transition cursor-pointer disabled:opacity-50"
                  >
                    {isSavingDraft ? "Saving…" : "Save draft"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep3()) setStep(4);
                    }}
                    className="inline-flex items-center gap-2 text-xs font-bold bg-gradient-brand text-white px-5 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <span>Next: Credits &amp; Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft hover:text-ink px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-alt transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Funnel &amp; Promotion</span>
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    disabled={isSavingDraft || isSubmitting}
                    className="text-xs font-semibold text-ink-soft hover:text-ink px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-alt transition cursor-pointer disabled:opacity-50"
                  >
                    {isSavingDraft ? "Saving…" : "Save draft"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (validateCommonFields()) {
                        setPublishConfirmModalOpen(true);
                      }
                    }}
                    disabled={isSubmitting || isSavingDraft || loadingCredits}
                    className="inline-flex items-center gap-2 text-xs font-bold bg-gradient-brand text-white px-6 py-3 rounded-xl shadow-elegant hover:shadow-glow transition hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    Publish Job · {totalCost} credits
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right Column: AI Assist Panel (Active across all 3 steps) */}
        <div>
          <AIAssistPanel
            step={step}
            jobTitle={title}
            onApplySuggestion={handleApplySuggestion}
            onDraftWithAi={handleGenerateContent}
            isGenerating={isGeneratingContent}
          />
        </div>
      </div>

      {/* Credit & Plan Modals */}
      <BuyCreditsModal
        open={buyModalOpen}
        onClose={() => setBuyModalOpen(false)}
        packs={packs}
        onPurchased={(newBalance) => setBalance(newBalance)}
      />

      <UpgradePlanModal
        open={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        currentPlanId="growth"
      />

      <CustomQuestionModal
        open={customQuestionModalTarget !== null}
        onClose={() => setCustomQuestionModalTarget(null)}
        target={customQuestionModalTarget || "ai_online_test"}
        onAddQuestion={handleAddCustomQuestion}
      />

      <RoundQuestionConfigModal
        open={roundQuestionModal.open}
        onClose={() => setRoundQuestionModal((prev) => ({ ...prev, open: false }))}
        roundId={roundQuestionModal.roundId}
        roundType={roundQuestionModal.roundType}
        roundName={roundQuestionModal.roundName}
        durationMinutes={roundQuestionModal.durationMinutes}
        passingScore={roundQuestionModal.passingScore}
        jobTitle={title}
        skills={Array.from(new Set([...requiredSkills.map((s) => s.name), ...preferredSkills]))}
        initialQuestions={roundQuestionsMap[roundQuestionModal.roundId] || []}
        onSaveQuestions={handleSaveRoundQuestions}
      />

      {/* Custom Candidate Round Modal (for Test, Interview, Domain Specific Test) */}
      <CustomRoundModal
        isOpen={customRoundModalCategory !== null}
        category={customRoundModalCategory}
        initialData={editingCustomRound}
        onClose={() => {
          setCustomRoundModalCategory(null);
          setEditingCustomRound(null);
        }}
        onSave={handleSaveCustomRound}
      />

      {/* Pre-Flight Job Publish Confirmation Modal */}
      {publishConfirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-surface border border-border rounded-2xl sm:rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-7 space-y-5 animate-scale-in relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border pb-3.5">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    hasInsufficientCredits
                      ? "bg-destructive/15 text-destructive border border-destructive/30"
                      : "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30"
                  }`}
                >
                  {hasInsufficientCredits ? (
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-emerald-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">
                    {hasInsufficientCredits ? "Insufficient Credit Balance" : "Confirm Job Publication"}
                  </h3>
                  <p className="text-xs text-ink-soft">
                    {hasInsufficientCredits
                      ? "Additional credits needed before publishing this role"
                      : "Review your credit breakdown and finalize publication"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPublishConfirmModalOpen(false)}
                className="p-1.5 rounded-lg text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* If Insufficient Credits */}
            {hasInsufficientCredits ? (
              <div className="space-y-4">
                {/* Red Alert Banner */}
                <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-destructive">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Insufficient Credits to Publish</span>
                  </div>
                  <p className="text-xs text-destructive font-medium leading-relaxed">
                    You do not have enough credits to activate the selected pipeline and promotion options. You need{" "}
                    <strong>{totalCost - (balance ?? 0)} more credits</strong> to proceed.
                  </p>
                </div>

                {/* Breakdown Table with Red Highlights */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-destructive block">
                    Pipeline &amp; Promotion Breakdown:
                  </span>
                  <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                    {summaryLines.map((line) => (
                      <div
                        key={line.key}
                        className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-destructive/5 border border-destructive/20 text-ink"
                      >
                        <span className="font-medium">{line.label}</span>
                        <span className="text-destructive font-bold">{line.cost} credits</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Balance Stats in Red */}
                <div className="p-3.5 rounded-xl bg-surface-alt border border-destructive/30 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-ink-soft">
                    <span>Total Required Credits:</span>
                    <span className="font-bold text-destructive text-sm">{totalCost} credits</span>
                  </div>
                  <div className="flex items-center justify-between text-ink-soft">
                    <span>Current Available Balance:</span>
                    <span className="font-bold text-ink">{balance ?? 0} credits</span>
                  </div>
                  <div className="flex items-center justify-between font-bold pt-1.5 border-t border-border text-destructive">
                    <span>Credits Needed to Top Up:</span>
                    <span className="px-2 py-0.5 rounded-md bg-destructive/15 border border-destructive/30 text-xs font-black">
                      +{totalCost - (balance ?? 0)} credits
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-destructive leading-relaxed">
                  Purchase a credit pack to top up your balance immediately, or adjust your selected pipeline and promotion options.
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPublishConfirmModalOpen(false)}
                    className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-ink-soft border border-border bg-surface hover:bg-surface-alt transition cursor-pointer"
                  >
                    Adjust Options
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPublishConfirmModalOpen(false);
                      setBuyModalOpen(true);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-destructive hover:bg-destructive/90 shadow-md transition hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    Buy Credits Now
                  </button>
                </div>
              </div>
            ) : (
              /* If User HAS Enough Credits */
              <div className="space-y-4">
                <p className="text-xs text-ink-soft leading-relaxed">
                  Publishing this role will deduct <strong>{totalCost} credits</strong> from your account and activate automated candidate matching and selected promotion channels.
                </p>

                {/* Breakdown List */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft block">
                    Selected Pipeline &amp; Promotion Breakdown:
                  </span>
                  <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                    {summaryLines.map((line) => (
                      <div
                        key={line.key}
                        className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-surface-alt/70 border border-border text-ink"
                      >
                        <span className="font-medium">{line.label}</span>
                        <span className="text-primary-glow font-bold">{line.cost} credits</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Balance Summary Box */}
                <div className="p-3.5 rounded-xl bg-surface-alt border border-border space-y-2 text-xs">
                  <div className="flex items-center justify-between text-ink-soft">
                    <span>Total Role Cost:</span>
                    <span className="font-bold text-ink">{totalCost} credits</span>
                  </div>
                  <div className="flex items-center justify-between text-ink-soft">
                    <span>Current Available Balance:</span>
                    <span className="font-bold text-ink">{balance ?? 0} credits</span>
                  </div>
                  <div className="flex items-center justify-between font-bold pt-1.5 border-t border-border text-ink">
                    <span>Balance After Publish:</span>
                    <span className="text-emerald-600 font-extrabold text-sm">
                      {balanceAfterPublish != null ? `${balanceAfterPublish} credits` : "—"}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setPublishConfirmModalOpen(false)}
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold text-ink-soft border border-border bg-surface hover:bg-surface-alt transition cursor-pointer disabled:opacity-50"
                  >
                    Back to Review
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await handleSubmit();
                      setPublishConfirmModalOpen(false);
                    }}
                    disabled={isSubmitting}
                    className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-brand shadow-elegant hover:shadow-glow transition hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Confirm &amp; Publish Job
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function MatchVolumeSection({
  options,
  selected,
  onSelect,
  customRatioError,
  setCustomRatioError,
}: {
  options: MatchVolumeOption[];
  selected: string | null;
  onSelect: (key: string | null) => void;
  customRatioError: string | null;
  setCustomRatioError: (err: string | null) => void;
}) {
  const isPredefined = options.some((o) => o.key === selected);
  const isCustomSelected = !!(selected && !isPredefined && selected.startsWith("1:"));
  const initialCustomNum = isCustomSelected ? selected.replace(/^1:/, "") : "";
  const [customDenominator, setCustomDenominator] = useState(initialCustomNum);
  const [isCustomMode, setIsCustomMode] = useState(isCustomSelected);

  const handleCustomChange = (val: string) => {
    setCustomDenominator(val);
    const clean = val.trim();
    if (!clean) {
      setCustomRatioError("Custom ratio is required (e.g. 1:5, 1:9, up to 1:10).");
      onSelect(null);
      return;
    }

    const num = parseInt(clean, 10);
    if (isNaN(num) || num <= 0) {
      setCustomRatioError("Please enter a valid positive number for the ratio.");
      onSelect(null);
    } else if (num > 10) {
      setCustomRatioError(`Custom ratio 1:${num} exceeds maximum allowed ratio 1:10. Please choose a ratio between 1:1 and 1:10.`);
      onSelect(null);
    } else {
      setCustomRatioError(null);
      onSelect(`1:${num}`);
    }
  };

  const handleSelectPredefined = (key: string) => {
    setIsCustomMode(false);
    setCustomRatioError(null);
    onSelect(key);
  };

  const handleSelectCustomMode = () => {
    setIsCustomMode(true);
    if (customDenominator.trim()) {
      handleCustomChange(customDenominator);
    } else {
      setCustomDenominator("5");
      setCustomRatioError(null);
      onSelect("1:5");
    }
  };

  return (
    <div className={`rounded-xl border transition ${selected ? "border-primary/30 bg-primary/5" : "border-border bg-background"}`}>
      <div className="p-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-ink">Candidate Match Volume</span>
          {selected && (
            <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
              {isPredefined ? options.find((o) => o.key === selected)?.credits : 10} credits
            </span>
          )}
        </div>
        <p className="text-xs text-ink-soft mt-0.5">
          How many candidates should be matched against this job (choose one or enter a custom ratio up to 1:10)
        </p>

        <div className="mt-3 space-y-1.5">
          {options.map((opt) => {
            const active = !isCustomMode && selected === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => handleSelectPredefined(opt.key)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg border text-sm transition cursor-pointer ${
                  active
                    ? "border-primary/40 bg-white shadow-sm font-semibold text-ink"
                    : "border-transparent text-ink-soft hover:bg-surface-alt/60"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      active ? "border-primary" : "border-border"
                    }`}
                  >
                    {active && <span className="w-2 h-2 rounded-full bg-gradient-brand" />}
                  </span>
                  {opt.label}
                </span>
                <span className={active ? "text-primary-glow font-bold" : "text-ink-soft/70"}>{opt.credits} credits</span>
              </button>
            );
          })}

          {/* Custom Ratio Option (up to 1:10) */}
          <div
            className={`rounded-lg border text-sm transition ${
              isCustomMode
                ? "border-primary/40 bg-white shadow-sm p-3 font-semibold text-ink"
                : "border-transparent p-2 text-ink-soft hover:bg-surface-alt/60"
            }`}
          >
            <button
              type="button"
              role="radio"
              aria-checked={isCustomMode}
              onClick={handleSelectCustomMode}
              className="w-full flex items-center justify-between gap-3 cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <span
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    isCustomMode ? "border-primary" : "border-border"
                  }`}
                >
                  {isCustomMode && <span className="w-2 h-2 rounded-full bg-gradient-brand" />}
                </span>
                <span>Custom Ratio <span className="text-xs font-normal text-ink-soft">(up to 1:10, e.g. 1:5, 1:9)</span></span>
              </span>
              <span className={isCustomMode ? "text-primary-glow font-bold text-xs" : "text-ink-soft/70 text-xs"}>
                10 credits
              </span>
            </button>

            {isCustomMode && (
              <div className="mt-2.5 pl-6 pt-2 border-t border-border/60">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-ink">Ratio:</span>
                  <span className="text-xs font-bold text-primary-glow bg-primary/10 px-2 py-1 rounded-md">1 :</span>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={customDenominator}
                    onChange={(e) => handleCustomChange(e.target.value)}
                    placeholder="5"
                    className="w-20 px-2.5 py-1 text-xs font-semibold bg-background border border-border rounded-md focus:border-primary focus:outline-hidden"
                  />
                  <span className="text-[11px] text-ink-soft">
                    {customDenominator ? `(1 candidate selected per ${customDenominator} matches)` : ""}
                  </span>
                </div>

                {customRatioError && (
                  <p className="text-xs text-destructive bg-destructive/5 border border-destructive/20 rounded-md px-2.5 py-1.5 mt-2 font-normal">
                    ⚠️ {customRatioError}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PipelineSectionCard({
  meta,
  subOptions,
  subOptionCost,
  enabled,
  onToggleEnabled,
  selectedKeys,
  onToggleSubOption,
}: {
  section: PipelineSection;
  meta: { label: string; description: string };
  subOptions: { key: string; label: string }[];
  subOptionCost: number;
  enabled: boolean;
  onToggleEnabled: (v: boolean) => void;
  selectedKeys: Set<string>;
  onToggleSubOption: (key: string) => void;
}) {
  const selectedCount = selectedKeys.size;

  return (
    <div className={`rounded-xl border transition ${enabled ? "border-primary/30 bg-primary/5" : "border-border bg-background"}`}>
      <label className="flex items-start gap-3 p-3 cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onToggleEnabled(e.target.checked)}
          className="mt-0.5 w-4 h-4 accent-primary"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-ink">{meta.label}</span>
            {enabled && selectedCount > 0 && (
              <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                {selectedCount * subOptionCost} credits
              </span>
            )}
          </div>
          <p className="text-xs text-ink-soft mt-0.5">{meta.description}</p>
        </div>
      </label>

      {enabled && subOptions.length > 0 && (
        <div className="px-3 pb-3 pt-1 flex flex-wrap gap-2">
          {subOptions.map((opt) => {
            const active = selectedKeys.has(opt.key);
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => onToggleSubOption(opt.key)}
                aria-pressed={active}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition cursor-pointer ${
                  active
                    ? "bg-gradient-brand text-primary-foreground border-transparent shadow-sm"
                    : "bg-surface text-ink-soft border-border hover:text-ink hover:border-primary/30"
                }`}
              >
                <span
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border ${
                    active ? "bg-white/20 border-white/40" : "border-border"
                  }`}
                >
                  {active && <Check className="w-2.5 h-2.5" />}
                </span>
                {opt.label}
                <span className={active ? "text-primary-foreground/80" : "text-ink-soft/70"}>· {subOptionCost}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
