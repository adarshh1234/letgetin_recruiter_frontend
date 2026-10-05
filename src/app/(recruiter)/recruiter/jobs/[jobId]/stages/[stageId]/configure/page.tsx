"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Edit3,
  Clock,
  Award,
  Layers,
  ShieldCheck,
  Calendar,
  BookOpen,
  HelpCircle,
  Loader2,
  Save,
  Check,
  ExternalLink,
  ChevronRight,
  Sliders,
  RefreshCw,
  FileQuestion,
  Upload,
  Download,
  FileSpreadsheet,
  CheckSquare,
  Square,
  Shuffle,
  FileUp,
  Filter,
  FileText,
  X,
  Zap,
  Timer,
  Briefcase,
  Code2,
  MessageSquare,
  Mic,
  Volume2,
  Bot,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { hiringEngineService } from "@/features/hiringEngine/services/hiringEngineService";
import { recruiterService } from "@/features/recruiter/services/recruiterService";
import { domainAssessmentService } from "@/features/domainAssessment/services/domainAssessmentService";
import { ConfiguredQuestionItem } from "@/features/recruiter/components/RoundQuestionConfigModal";
import { RecruiterJob } from "@/features/recruiter/types";

export default function StageConfigurationPage() {
  const params = useParams();
  const router = useRouter();

  const jobId = (Array.isArray(params?.jobId) ? params.jobId[0] : params?.jobId) || "";
  const stageId = (Array.isArray(params?.stageId) ? params.stageId[0] : params?.stageId) || "";

  // Data states
  const [job, setJob] = useState<RecruiterJob | null>(null);
  const [stage, setStage] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [stageName, setStageName] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [passingScore, setPassingScore] = useState(70);
  const [deadlineHours, setDeadlineHours] = useState(48);
  const [questions, setQuestions] = useState<ConfiguredQuestionItem[]>([]);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleStartTime, setScheduleStartTime] = useState("");
  const [scheduleEndTime, setScheduleEndTime] = useState("");

  // Question Creation Mode ('upload' | 'ai')
  const [creationMode, setCreationMode] = useState<"upload" | "ai">("upload");

  // AI Question Generation states
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiCount, setAiCount] = useState(10);
  const [aiDifficulty, setAiDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [aiFocusTopic, setAiFocusTopic] = useState("");
  const [aiQuestionFormat, setAiQuestionFormat] = useState<"mcq" | "descriptive" | "rapid" | "mixed">("mixed");

  // 5-Tier Role Blueprint Context for Technical Test AI Generation (Title -> Exp -> JD -> Responsibilities -> Skills)
  const [jobTitleText, setJobTitleText] = useState("");
  const [jobExperienceText, setJobExperienceText] = useState("");
  const [jobSkillsText, setJobSkillsText] = useState("");
  const [jobDescriptionText, setJobDescriptionText] = useState("");
  const [jobResponsibilitiesText, setJobResponsibilitiesText] = useState("");
  const [originalJobTitle, setOriginalJobTitle] = useState("");
  const [originalJobExperience, setOriginalJobExperience] = useState("");
  const [originalJobSkills, setOriginalJobSkills] = useState("");
  const [originalJobDescription, setOriginalJobDescription] = useState("");
  const [originalJobResponsibilities, setOriginalJobResponsibilities] = useState("");
  const [isJdModalOpen, setIsJdModalOpen] = useState(false);
  const [isJdCustomized, setIsJdCustomized] = useState(false);

  // General Aptitude Sections ('mcq' | 'descriptive' | 'rapid' | 'all')
  const [activeSection, setActiveSection] = useState<"mcq" | "descriptive" | "rapid" | "all">("mcq");
  const [rapidTimeLimitSeconds, setRapidTimeLimitSeconds] = useState<number>(30);

  // Manual Question Modal states
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualType, setManualType] = useState<"mcq" | "descriptive" | "rapid">("mcq");
  const [manualTimeLimitSeconds, setManualTimeLimitSeconds] = useState(30);
  const [manualQuestion, setManualQuestion] = useState("");
  const [manualPoints, setManualPoints] = useState(10);
  const [manualDifficulty, setManualDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [manualSampleAnswer, setManualSampleAnswer] = useState("");
  const [manualRubric, setManualRubric] = useState("");
  const [manualOptions, setManualOptions] = useState([
    { id: "A", text: "" },
    { id: "B", text: "" },
    { id: "C", text: "" },
    { id: "D", text: "" },
  ]);
  const [manualCorrectOptionId, setManualCorrectOptionId] = useState("A");

  const isAiChatStage = Boolean(
    stage?.assessmentType === "ai_chat" ||
    stageId?.includes("ai_chat") ||
    stageName.toLowerCase().includes("ai chat") ||
    (stageName.toLowerCase().includes("chat") && (stageId?.includes("ai") || stageName.toLowerCase().includes("ai")))
  );

  const isAiVoiceStage = Boolean(
    stage?.assessmentType === "ai_voice" ||
    stageId?.includes("ai_voice") ||
    stageName.toLowerCase().includes("ai voice") ||
    (stageName.toLowerCase().includes("voice") && (stageId?.includes("ai") || stageName.toLowerCase().includes("ai")))
  );

  const isAiAssessment = Boolean(
    isAiChatStage ||
    isAiVoiceStage ||
    stage?.assessmentType === "ai_assessment" ||
    stage?.stageType === "ai_interview" ||
    stage?.stageType === "ai_assessment" ||
    stageId?.includes("ai_assessment") ||
    stageId?.includes("ai_interview") ||
    stageName.toLowerCase().includes("ai assessment") ||
    stageName.toLowerCase().includes("ai interview")
  );

  // AI Assessment specific states
  const [aiModalities, setAiModalities] = useState<("chat" | "voice")[]>(["chat", "voice"]);
  const [aiInterviewTopics, setAiInterviewTopics] = useState<string[]>([]);
  const [newTopicInput, setNewTopicInput] = useState("");
  const [aiSystemPromptGuidance, setAiSystemPromptGuidance] = useState("");

  const handleSelectAiRoundType = (roundType: "chat" | "voice") => {
    setAiModalities([roundType]);
    toast.success(`Configured as ${roundType === "voice" ? "AI Voice Assessment Round" : "AI Chat Assessment Round"}.`);
  };

  const handleAddTopic = () => {
    if (!newTopicInput.trim()) return;
    setAiInterviewTopics((prev) => [...prev, newTopicInput.trim()]);
    setNewTopicInput("");
    toast.success("Interview topic added.");
  };

  const handleRemoveTopic = (index: number) => {
    setAiInterviewTopics((prev) => prev.filter((_, idx) => idx !== index));
    toast.info("Topic removed.");
  };

  const isGeneralAptitude = Boolean(
    stage?.assessmentType === "general_aptitude" ||
    stage?.stageType === "general_aptitude" ||
    stageId?.includes("general_aptitude") ||
    stageName.toLowerCase().includes("aptitude") ||
    (stageName.toLowerCase().includes("general") && !stageName.toLowerCase().includes("technical"))
  );

  const isTechnicalTest = Boolean(
    stage?.assessmentType === "technical_test" ||
    stage?.stageType === "technical_test" ||
    stageId?.includes("technical_test") ||
    stageName.toLowerCase().includes("technical test") ||
    stageName.toLowerCase().includes("tech test")
  );

  const isRapidRound = Boolean(
    stage?.assessmentType === "rapid_round" ||
    stage?.stageType === "rapid_round" ||
    stageId?.includes("rapid_round") ||
    stageName.toLowerCase().includes("rapid round") ||
    stageName.toLowerCase().includes("rapid")
  );

  // The 3-section question configuration window is dedicated strictly for the Online Test section
  const isOnlineTestRound = !isAiAssessment && (isGeneralAptitude || isTechnicalTest || isRapidRound);
  const isAptitudeRound = isOnlineTestRound;
  // Technical Test, Rapid Round, and AI Assessment are grounded in the 5-tier Role Blueprint (Job Title -> Exp -> JD -> Responsibilities -> Skills)
  const isRoleGroundedRound = isTechnicalTest || isRapidRound || isAiAssessment;

  const getQuestionSection = useCallback((q: ConfiguredQuestionItem): "mcq" | "descriptive" | "rapid" => {
    if (q.section === "rapid" || q.type === "rapid" || Boolean(q.timeLimitSeconds)) return "rapid";
    if (q.section === "descriptive" || q.type === "descriptive" || (!q.options || q.options.length < 2)) return "descriptive";
    return "mcq";
  }, []);

  const mcqQuestions = questions.filter((q) => getQuestionSection(q) === "mcq");
  const descriptiveQuestions = questions.filter((q) => getQuestionSection(q) === "descriptive");
  const rapidQuestions = questions.filter((q) => getQuestionSection(q) === "rapid");

  const displayedQuestions =
    isRapidRound
      ? questions
      : !isAptitudeRound || activeSection === "all"
      ? questions
      : activeSection === "mcq"
      ? mcqQuestions
      : activeSection === "descriptive"
      ? descriptiveQuestions
      : rapidQuestions;

  const handleApplyRapidSecondsToAll = (seconds: number) => {
    const validSec = Math.max(5, seconds);
    setRapidTimeLimitSeconds(validSec);
    setManualTimeLimitSeconds(validSec);
    setQuestions((prev) =>
      prev.map((q) => {
        if (getQuestionSection(q) === "rapid") {
          return { ...q, timeLimitSeconds: validSec };
        }
        return q;
      })
    );
    toast.success(`Set rapid question timer to ${validSec} seconds!`);
  };

  // Question Bank Upload states
  const [uploading, setUploading] = useState(false);
  const [uploadedPool, setUploadedPool] = useState<ConfiguredQuestionItem[]>([]);
  const [uploadedFilename, setUploadedFilename] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [customPickCount, setCustomPickCount] = useState<number>(30);
  const [activeTab, setActiveTab] = useState<"questions" | "settings">("questions");

  // Load stage and job details
  const loadData = useCallback(async () => {
    if (!jobId || !stageId) return;
    try {
      setLoading(true);
      const [stageRes, jobData] = await Promise.all([
        hiringEngineService.getStageDetails(jobId, stageId).catch(() => null),
        recruiterService.getMyJobById(jobId).catch(async () => {
          const list = await recruiterService.getMyJobs().catch(() => []);
          return (list || []).find((j: any) => j._id === jobId) || null;
        }),
      ]);

      const foundJob = jobData;
      setJob(foundJob);

      if (foundJob) {
        const title = foundJob.title || "";
        const jd = foundJob.description || "";
        const resp = Array.isArray(foundJob.responsibilities)
          ? foundJob.responsibilities.join("\n")
          : typeof foundJob.responsibilities === "string"
          ? foundJob.responsibilities
          : "";
        const skills = Array.isArray(foundJob.skills) ? foundJob.skills.join(", ") : "";

        // Format structured experience string
        const minExp = foundJob.minimumExperience ?? foundJob.structuredRequirements?.minimumExperienceYears;
        const maxExp = foundJob.maximumExperience ?? foundJob.structuredRequirements?.maximumExperienceYears;
        const expLvl = foundJob.experienceLevel ? String(foundJob.experienceLevel).toUpperCase() : "";
        let expFormatted = "";
        if (minExp !== undefined && maxExp !== undefined && minExp > 0) {
          expFormatted = `${minExp} - ${maxExp} years${expLvl ? ` (${expLvl})` : ""}`;
        } else if (minExp !== undefined && minExp > 0) {
          expFormatted = `${minExp}+ years${expLvl ? ` (${expLvl})` : ""}`;
        } else if (expLvl) {
          expFormatted = `${expLvl} Level`;
        } else {
          expFormatted = "3-5 years (Mid-Level)";
        }

        setJobTitleText(title);
        setOriginalJobTitle(title);
        setJobExperienceText(expFormatted);
        setOriginalJobExperience(expFormatted);
        setJobSkillsText(skills);
        setOriginalJobSkills(skills);
        setJobDescriptionText(jd);
        setOriginalJobDescription(jd);
        setJobResponsibilitiesText(resp);
        setOriginalJobResponsibilities(resp);
      }

      if (stageRes) {
        setStage(stageRes);
        setStageName(stageRes.stageName || "Assessment Stage");
        setDurationMinutes(stageRes.durationMinutes || 30);
        setPassingScore(stageRes.passingScore || stageRes.autoAdvanceScoreThreshold || 70);
        setDeadlineHours(stageRes.deadlineHours || 48);

        if (stageRes.schedule) {
          setScheduleDate(stageRes.schedule.date || "");
          setScheduleStartTime(stageRes.schedule.startTime || "");
          setScheduleEndTime(stageRes.schedule.endTime || "");
        }

        const roundMatch = foundJob?.assessment?.rounds?.find(
          (r: any) =>
            r.id === stageId ||
            r.roundId === stageId ||
            r.type === stageRes.assessmentType ||
            r.roundType === stageRes.assessmentType
        );
        const existingQuestions =
          stageRes.config?.customQuestions || (roundMatch?.config as any)?.customQuestions || [];
        setQuestions(existingQuestions);

        const firstRapidQ = existingQuestions.find(
          (q: any) => q.section === "rapid" || q.type === "rapid" || Boolean(q.timeLimitSeconds)
        );
        const savedRapidTime =
          stageRes.config?.rapidTimeLimitSeconds ||
          (roundMatch?.config as any)?.rapidTimeLimitSeconds ||
          firstRapidQ?.timeLimitSeconds ||
          30;
        setRapidTimeLimitSeconds(savedRapidTime);
        setManualTimeLimitSeconds(savedRapidTime);

        const isRapidStage = Boolean(
          stageRes.assessmentType === "rapid_round" ||
          stageRes.stageType === "rapid_round" ||
          stageId?.includes("rapid") ||
          stageRes.stageName?.toLowerCase().includes("rapid")
        );
        if (isRapidStage) {
          setActiveSection("rapid");
          setAiQuestionFormat("rapid");
          setManualType("rapid");
        }

        // AI Assessment configuration loading
        const isCurrentChat =
          stageRes.assessmentType === "ai_chat" ||
          stageId?.includes("ai_chat") ||
          stageRes.stageName?.toLowerCase().includes("ai chat") ||
          (stageRes.stageName?.toLowerCase().includes("chat") && (stageId?.includes("ai") || stageRes.stageName?.toLowerCase().includes("ai")));

        const isCurrentVoice =
          stageRes.assessmentType === "ai_voice" ||
          stageId?.includes("ai_voice") ||
          stageRes.stageName?.toLowerCase().includes("ai voice") ||
          (stageRes.stageName?.toLowerCase().includes("voice") && (stageId?.includes("ai") || stageRes.stageName?.toLowerCase().includes("ai")));

        if (isCurrentChat) {
          setAiModalities(["chat"]);
        } else if (isCurrentVoice) {
          setAiModalities(["voice"]);
        } else {
          const savedModalities =
            stageRes.config?.modalities || (roundMatch?.config as any)?.modalities;
          if (Array.isArray(savedModalities) && savedModalities.length > 0) {
            setAiModalities(savedModalities.includes("voice") && !savedModalities.includes("chat") ? ["voice"] : ["chat"]);
          }
        }

        const savedTopics =
          stageRes.config?.topics || (roundMatch?.config as any)?.topics;
        if (Array.isArray(savedTopics) && savedTopics.length > 0) {
          setAiInterviewTopics(savedTopics);
        } else if (
          isCurrentChat ||
          isCurrentVoice ||
          stageRes.assessmentType === "ai_assessment" ||
          stageRes.stageType === "ai_interview" ||
          stageId?.includes("ai_assessment") ||
          stageRes.stageName?.toLowerCase().includes("ai assessment")
        ) {
          if (isCurrentVoice) {
            setAiInterviewTopics([
              `System Architecture & High-Level Design Trade-offs (${foundJob?.title || "Target Role"})`,
              "Spoken Technical Explanation, Problem Deconstruction & Communication Clarity",
              "Production Incident Management & Real-Time Troubleshooting Scenarios",
              "Engineering Leadership, Mentorship & Situational Ownership",
            ]);
          } else if (isCurrentChat) {
            setAiInterviewTopics([
              `Hands-on Technical Stack Proficiency & Syntax Reasoning (${foundJob?.title || "Core Tech"})`,
              "Real-World Problem Solving, Algorithmic Logic & Edge Cases",
              "Code Quality, Refactoring, Modularity & Unit Testing",
              "Daily Engineering Deliverables, Git Workflows & Ownership",
            ]);
          } else {
            setAiInterviewTopics([
              `Hands-on Technical Stack Proficiency (${foundJob?.title || "Core Tech"})`,
              "Real-World Problem Solving & Architecture Design",
              "Debugging, Incident Troubleshooting & Code Quality",
              "Core Deliverables, Daily Responsibilities & Ownership",
            ]);
          }
        }

        const savedGuidance =
          stageRes.config?.promptGuidance || (roundMatch?.config as any)?.promptGuidance;
        if (savedGuidance) {
          setAiSystemPromptGuidance(String(savedGuidance));
        }

        const savedAiDifficulty =
          stageRes.config?.difficulty || (roundMatch?.config as any)?.difficulty;
        if (savedAiDifficulty) {
          setAiDifficulty(savedAiDifficulty);
        }

        const savedAiCount =
          stageRes.config?.questionCount || stageRes.questionCount || (roundMatch?.config as any)?.questionCount;
        if (savedAiCount) {
          setAiCount(Number(savedAiCount));
        }
      } else if (foundJob) {
        const round = foundJob.assessment?.rounds?.find(
          (r: any) => r.id === stageId || r.roundId === stageId || r.type === stageId
        );
        if (round) {
          const pseudoStage = {
            stageId: round.id || stageId,
            stageName: round.name || "Assessment Stage",
            stageType: "assessment",
            assessmentType: round.type,
            durationMinutes: (round.config as any)?.durationMinutes || 30,
            passingScore: (round.config as any)?.passingScore || 70,
            config: round.config || {},
          };
          setStage(pseudoStage);
          setStageName(round.name || "Assessment Stage");
          setDurationMinutes((round.config as any)?.durationMinutes || 30);
          setPassingScore((round.config as any)?.passingScore || 70);
          const existingQuestions = (round.config as any)?.customQuestions || [];
          setQuestions(existingQuestions);
          const firstRapidQ = existingQuestions.find(
            (q: any) => q.section === "rapid" || q.type === "rapid" || Boolean(q.timeLimitSeconds)
          );
          const savedRapidTime =
            (round.config as any)?.rapidTimeLimitSeconds ||
            firstRapidQ?.timeLimitSeconds ||
            30;
          setRapidTimeLimitSeconds(savedRapidTime);
          setManualTimeLimitSeconds(savedRapidTime);

          const isRapidStage = Boolean(
            round.type === "rapid_round" ||
            stageId?.includes("rapid") ||
            round.name?.toLowerCase().includes("rapid")
          );
          if (isRapidStage) {
            setActiveSection("rapid");
            setAiQuestionFormat("rapid");
            setManualType("rapid");
          }

          const isFallbackChat =
            round.type === "ai_chat" ||
            stageId?.includes("ai_chat") ||
            round.name?.toLowerCase().includes("ai chat") ||
            (round.name?.toLowerCase().includes("chat") && (stageId?.includes("ai") || round.name?.toLowerCase().includes("ai")));

          const isFallbackVoice =
            round.type === "ai_voice" ||
            stageId?.includes("ai_voice") ||
            round.name?.toLowerCase().includes("ai voice") ||
            (round.name?.toLowerCase().includes("voice") && (stageId?.includes("ai") || round.name?.toLowerCase().includes("ai")));

          if (isFallbackChat) {
            setAiModalities(["chat"]);
          } else if (isFallbackVoice) {
            setAiModalities(["voice"]);
          } else if (Array.isArray((round.config as any)?.modalities) && (round.config as any).modalities.length > 0) {
            const mods = (round.config as any).modalities;
            setAiModalities(mods.includes("voice") && !mods.includes("chat") ? ["voice"] : ["chat"]);
          }

          if (Array.isArray((round.config as any)?.topics) && (round.config as any).topics.length > 0) {
            setAiInterviewTopics((round.config as any).topics);
          } else if (
            isFallbackChat ||
            isFallbackVoice ||
            round.type === "ai_assessment" ||
            stageId?.includes("ai_assessment") ||
            round.name?.toLowerCase().includes("ai assessment")
          ) {
            if (isFallbackVoice) {
              setAiInterviewTopics([
                `System Architecture & High-Level Design Trade-offs (${foundJob.title || "Target Role"})`,
                "Spoken Technical Explanation, Problem Deconstruction & Communication Clarity",
                "Production Incident Management & Real-Time Troubleshooting Scenarios",
                "Engineering Leadership, Mentorship & Situational Ownership",
              ]);
            } else if (isFallbackChat) {
              setAiInterviewTopics([
                `Hands-on Technical Stack Proficiency & Syntax Reasoning (${foundJob.title || "Core Tech"})`,
                "Real-World Problem Solving, Algorithmic Logic & Edge Cases",
                "Code Quality, Refactoring, Modularity & Unit Testing",
                "Daily Engineering Deliverables, Git Workflows & Ownership",
              ]);
            } else {
              setAiInterviewTopics([
                `Hands-on Technical Stack Proficiency (${foundJob.title || "Core Tech"})`,
                "Real-World Problem Solving & Architecture Design",
                "Debugging, Incident Troubleshooting & Code Quality",
                "Core Deliverables, Daily Responsibilities & Ownership",
              ]);
            }
          }
          if ((round.config as any)?.promptGuidance) {
            setAiSystemPromptGuidance(String((round.config as any).promptGuidance));
          }
          if ((round.config as any)?.difficulty) {
            setAiDifficulty((round.config as any).difficulty);
          }
          if ((round.config as any)?.questionCount) {
            setAiCount(Number((round.config as any).questionCount));
          }
        }
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to load stage configuration");
    } finally {
      setLoading(false);
    }
  }, [jobId, stageId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // AI Generation Handler
  const handleGenerateAIQuestions = async (overrideDifficulty?: any) => {
    const resolvedDifficulty: "easy" | "medium" | "hard" =
      overrideDifficulty === "easy" || overrideDifficulty === "medium" || overrideDifficulty === "hard"
        ? overrideDifficulty
        : aiDifficulty;
    try {
      setAiGenerating(true);
      const roundType = stage?.assessmentType || stage?.stageType || "general_aptitude";

      let targetSection: "mcq" | "descriptive" | "rapid" | undefined = undefined;
      let targetFormat: "mcq" | "descriptive" | "rapid" | "mixed" = aiQuestionFormat;

      if (isRapidRound) {
        targetSection = "rapid";
        targetFormat = "rapid";
      } else if (isAptitudeRound && activeSection !== "all") {
        targetSection = activeSection;
        targetFormat = activeSection;
      }

      const isRapidTarget = targetSection === "rapid" || targetFormat === "rapid";
      const resolvedSkills = jobSkillsText
        ? jobSkillsText
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : job?.skills || [];

      const generated = await domainAssessmentService.generateRoundQuestions({
        roundType,
        roundName: stageName,
        jobTitle: jobTitleText || job?.title || "Professional Role",
        skills: resolvedSkills,
        experience: jobExperienceText,
        difficulty: resolvedDifficulty,
        count: aiCount,
        focusTopic: aiFocusTopic,
        section: targetSection,
        questionFormat: targetFormat,
        timeLimitSeconds: isRapidTarget || isRapidRound ? rapidTimeLimitSeconds : undefined,
        jobDescription: isRoleGroundedRound ? jobDescriptionText : undefined,
        jobResponsibilities: isRoleGroundedRound ? jobResponsibilitiesText : undefined,
      });

      if (generated && generated.length > 0) {
        const tagged = generated.map((g) => {
          const isRapid = g.section === "rapid" || targetSection === "rapid" || g.type === "rapid" || isRapidRound;
          return {
            ...g,
            section: isRapidRound ? "rapid" : (g.section || targetSection || undefined),
            timeLimitSeconds: isRapid ? g.timeLimitSeconds || rapidTimeLimitSeconds || 30 : g.timeLimitSeconds,
          };
        });

        if (isRapidRound) {
          setQuestions(tagged);
          toast.success(
            `Generated ${tagged.length} rapid-fire speed questions (${rapidTimeLimitSeconds}s timer) based on ${jobTitleText || "Role"}, ${jobExperienceText}, JD & Responsibilities!`
          );
        } else if (isAptitudeRound && activeSection !== "all") {
          setQuestions((prev) => {
            const others = prev.filter((p) => getQuestionSection(p) !== activeSection);
            return [...others, ...tagged];
          });
          const sectionLabel = activeSection === "mcq" ? "MCQ" : activeSection === "descriptive" ? "Descriptive" : "Rapid Round";
          toast.success(
            isRoleGroundedRound
              ? `Generated ${tagged.length} ${sectionLabel} questions tailored to ${jobTitleText || "Role"} (${jobExperienceText})!`
              : `Generated ${tagged.length} ${sectionLabel} questions with AI!`
          );
        } else {
          setQuestions(tagged);
          toast.success(
            isRoleGroundedRound
              ? `Generated ${tagged.length} questions based on ${jobTitleText || "Role"}, ${jobExperienceText}, JD & Responsibilities!`
              : `Generated ${tagged.length} questions with AI!`
          );
        }
      } else {
        toast.info("No questions returned. You can author questions manually.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to generate AI questions.");
    } finally {
      setAiGenerating(false);
    }
  };

  // Add Manual Question Handler
  const handleAddManualQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualQuestion.trim()) {
      toast.error("Please enter a question prompt.");
      return;
    }

    if (manualType === "mcq" || manualType === "rapid") {
      const filledOptions = manualOptions.filter((opt) => opt.text.trim());
      if (filledOptions.length < 2) {
        toast.error("Please provide at least 2 options for this question.");
        return;
      }
    } else {
      if (!manualSampleAnswer.trim()) {
        toast.error("Please provide a model answer or key steps for scoring.");
        return;
      }
    }

    const assignedSection = isRapidRound ? "rapid" : (isAptitudeRound && activeSection !== "all" ? activeSection : manualType);
    const resolvedType = isRapidRound ? "rapid" : manualType;

    const newQ: ConfiguredQuestionItem = {
      id: `custom-q-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      section: assignedSection,
      type: resolvedType,
      question: manualQuestion.trim(),
      points: manualPoints || 10,
      difficulty: manualDifficulty,
      ...(resolvedType === "mcq" || resolvedType === "rapid"
        ? {
            options: manualOptions.filter((o) => o.text.trim()),
            correctOptionId: manualCorrectOptionId,
            timeLimitSeconds: resolvedType === "rapid" ? manualTimeLimitSeconds || rapidTimeLimitSeconds || 30 : undefined,
          }
        : {
            options: [],
            sampleAnswer: manualSampleAnswer.trim(),
            evaluationRubric: manualRubric.trim() || undefined,
          }),
    };

    setQuestions((prev) => [...prev, newQ]);
    const typeLabel = isRapidRound ? "Rapid Speed" : manualType === "descriptive" ? "Descriptive" : manualType === "rapid" ? "Rapid Round" : "Multiple Choice";
    toast.success(`Added ${typeLabel} question!`);

    // Reset fields
    setManualQuestion("");
    setManualSampleAnswer("");
    setManualRubric("");
    setManualPoints(10);
    setShowManualModal(false);
  };

  // Handle Question Bank File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await hiringEngineService.uploadStageQuestions(jobId, stageId, file);

      if (res && res.questions && res.questions.length > 0) {
        setUploadedPool(res.questions);
        setUploadedFilename(res.filename || file.name);

        // By default, select up to 30 or full pool
        const defaultPick = Math.min(30, res.questions.length);
        const initialSelected = new Set<string>(res.questions.slice(0, defaultPick).map((q: any) => q.id));
        setSelectedIds(initialSelected);

        toast.success(`Successfully parsed ${res.totalQuestions} questions from ${file.name}!`);
      } else {
        toast.error("No valid questions could be parsed from this file.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to upload and parse question bank file.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  // Sample or pick random N questions from uploaded pool
  const handlePickRandom = (count: number) => {
    if (uploadedPool.length === 0) return;
    const targetCount = Math.min(count, uploadedPool.length);
    const shuffled = [...uploadedPool].sort(() => 0.5 - Math.random());
    const pickedIds = new Set<string>(shuffled.slice(0, targetCount).map((q) => q.id));
    setSelectedIds(pickedIds);
    toast.info(`Selected ${targetCount} random questions from the uploaded bank!`);
  };

  // Toggle selection for a single question
  const handleToggleQuestion = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Select all or deselect all
  const handleSelectAll = () => {
    if (selectedIds.size === uploadedPool.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(uploadedPool.map((q) => q.id)));
    }
  };

  // Import selected questions into active stage bank
  const handleImportSelected = (mode: "replace" | "append" = "replace") => {
    const selectedList = uploadedPool.filter((q) => selectedIds.has(q.id));
    if (selectedList.length === 0) {
      toast.error("Please select at least 1 question to import.");
      return;
    }

    const targetSection = isRapidRound ? "rapid" : (isAptitudeRound && activeSection !== "all" ? activeSection : undefined);
    const tagged = selectedList.map((q) => ({
      ...q,
      section: isRapidRound ? "rapid" : (q.section || targetSection),
      type: isRapidRound || targetSection === "rapid" ? ("rapid" as const) : targetSection === "descriptive" ? ("descriptive" as const) : q.type,
      timeLimitSeconds: isRapidRound || targetSection === "rapid" ? q.timeLimitSeconds || rapidTimeLimitSeconds || 30 : q.timeLimitSeconds,
    }));

    if (mode === "replace") {
      if (isRapidRound) {
        setQuestions(tagged);
      } else if (isAptitudeRound && activeSection !== "all") {
        setQuestions((prev) => {
          const others = prev.filter((p) => getQuestionSection(p) !== activeSection);
          return [...others, ...tagged];
        });
      } else {
        setQuestions(tagged);
      }
    } else {
      setQuestions((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newOnes = tagged.filter((s) => !existingIds.has(s.id));
        return [...prev, ...newOnes];
      });
    }

    const sectionLabel = isRapidRound
      ? `into Rapid Round (${rapidTimeLimitSeconds}s speed)`
      : isAptitudeRound && activeSection !== "all"
      ? `into Section ${activeSection.toUpperCase()}`
      : `into stage question bank`;
    toast.success(`Imported ${tagged.length} questions ${sectionLabel}!`);
  };

  // Download Sample Template
  const handleDownloadTemplate = async (format: "excel" | "csv") => {
    try {
      const blob = await hiringEngineService.downloadSampleTemplate(jobId, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `question_bank_template.${format === "csv" ? "csv" : "xlsx"}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success(`Downloaded sample ${format.toUpperCase()} template!`);
    } catch (err: any) {
      toast.error("Failed to download template. Please try again.");
    }
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    toast.info("Question removed.");
  };

  // Open live candidate test portal preview (captures draft questions/topics into sessionStorage)
  const handleOpenPreview = () => {
    if (typeof window !== "undefined") {
      try {
        const roundType = isGeneralAptitude
          ? "general_aptitude"
          : isTechnicalTest
          ? "technical_test"
          : isRapidRound
          ? "rapid_round"
          : isAiChatStage || (isAiAssessment && aiModalities.includes("chat"))
          ? "ai_chat"
          : isAiVoiceStage || (isAiAssessment && aiModalities.includes("voice"))
          ? "ai_voice"
          : stage?.stageType || "general_aptitude";

        const roundAssessmentType = isGeneralAptitude
          ? "general_aptitude"
          : isTechnicalTest
          ? "technical_test"
          : isRapidRound
          ? "rapid_round"
          : isAiChatStage || (isAiAssessment && aiModalities.includes("chat"))
          ? "ai_chat"
          : isAiVoiceStage || (isAiAssessment && aiModalities.includes("voice"))
          ? "ai_voice"
          : stage?.assessmentType || "general_aptitude";

        const isActuallyAi = isAiAssessment && !isGeneralAptitude && !isTechnicalTest && !isRapidRound;

        sessionStorage.setItem(
          `stage_preview_${jobId}_${stageId}`,
          JSON.stringify({
            stageName,
            durationMinutes,
            passingScore,
            stageType: roundType,
            assessmentType: roundAssessmentType,
            isGeneralAptitude,
            isTechnicalTest,
            isRapidRound,
            isAiAssessment: isActuallyAi,
            modality: aiModalities.includes("voice") ? "voice" : "chat",
            modalities: isActuallyAi ? (aiModalities.includes("voice") ? ["voice"] : ["chat"]) : [],
            difficulty: aiDifficulty,
            topics: isActuallyAi ? aiInterviewTopics : [],
            customQuestions: questions,
          })
        );
      } catch (e) {
        console.warn("Failed to store preview draft in sessionStorage", e);
      }
    }
    window.open(`/assessment/take?jobId=${jobId}&stageId=${stageId}&preview=true`, "_blank");
  };

  // Save & Confirm Stage Configuration
  const handleSaveAndConfirm = async () => {
    if (questions.length === 0) {
      if (!confirm("No questions have been configured yet. Do you still want to confirm this stage configuration?")) {
        return;
      }
    }

    try {
      setSaving(true);
      await hiringEngineService.updateStageConfig(jobId, stageId, {
        stageName,
        durationMinutes,
        passingScore,
        autoAdvanceScoreThreshold: passingScore,
        deadlineHours,
        schedule: {
          date: scheduleDate,
          startTime: scheduleStartTime,
          endTime: scheduleEndTime,
        },
        customQuestions: questions,
        config: {
          isConfigured: true,
          configuredAt: new Date().toISOString(),
          totalQuestions: questions.length,
          rapidTimeLimitSeconds: rapidTimeLimitSeconds,
          difficulty: aiDifficulty,
        },
      });

      toast.success(`Stage '${stageName}' configuration confirmed and saved!`);
      router.push(`/recruiter/jobs?jobId=${jobId}&tab=timeline`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update stage configuration.");
    } finally {
      setSaving(false);
    }
  };

  // Save & Confirm AI Assessment Stage Configuration
  const handleSaveAiAssessment = async () => {
    if (aiModalities.length === 0) {
      toast.error("Please select an AI round format (Chat or Voice).");
      return;
    }

    try {
      setSaving(true);
      await hiringEngineService.updateStageConfig(jobId, stageId, {
        stageName,
        durationMinutes,
        passingScore,
        autoAdvanceScoreThreshold: passingScore,
        deadlineHours,
        questionCount: aiCount,
        schedule: {
          date: scheduleDate,
          startTime: scheduleStartTime,
          endTime: scheduleEndTime,
        },
        config: {
          isConfigured: true,
          configuredAt: new Date().toISOString(),
          modality: aiModalities.includes("voice") ? "voice" : "chat",
          modalities: aiModalities.includes("voice") ? ["voice"] : ["chat"],
          difficulty: aiDifficulty,
          questionCount: aiCount,
          durationMinutes: durationMinutes,
          passingScore: passingScore,
          topics: aiInterviewTopics,
          promptGuidance: aiSystemPromptGuidance,
          blueprint: {
            jobTitle: jobTitleText,
            experience: jobExperienceText,
            skills: jobSkillsText,
            description: jobDescriptionText,
            responsibilities: jobResponsibilitiesText,
          },
        },
      });

      toast.success(`AI Assessment configuration for '${stageName}' confirmed and saved!`);
      router.push(`/recruiter/jobs?jobId=${jobId}&tab=timeline`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update AI Assessment configuration.");
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateAiTopics = async (overrideDifficulty?: any) => {
    const resolvedDifficulty: "easy" | "medium" | "hard" =
      overrideDifficulty === "easy" || overrideDifficulty === "medium" || overrideDifficulty === "hard"
        ? overrideDifficulty
        : aiDifficulty;
    try {
      setAiGenerating(true);
      const resolvedSkills = jobSkillsText
        ? jobSkillsText
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : job?.skills || [];

      const roundTypeForGen = isAiChatStage ? "ai_chat" : isAiVoiceStage ? "ai_voice" : "ai_assessment";
      const roundNameForGen = stageName || (isAiChatStage ? "AI Chat Assessment" : isAiVoiceStage ? "AI Voice Assessment" : "AI Assessment");

      const generated = await domainAssessmentService.generateRoundQuestions({
        roundType: roundTypeForGen,
        roundName: roundNameForGen,
        jobTitle: jobTitleText || job?.title || "Professional Role",
        skills: resolvedSkills,
        experience: jobExperienceText,
        difficulty: resolvedDifficulty,
        count: aiCount,
        section: "descriptive",
        questionFormat: "descriptive",
        jobDescription: jobDescriptionText,
        jobResponsibilities: jobResponsibilitiesText,
      });

      if (Array.isArray(generated) && generated.length > 0) {
        const topics = generated.map((g: any) => g.question || g.title).filter(Boolean);
        if (topics.length > 0) {
          setAiInterviewTopics(topics);
          toast.success(
            `Generated ${topics.length} ${resolvedDifficulty.toUpperCase()} interview topics grounded in JD & responsibilities!`
          );
          return;
        }
      }

      // Grounded topic fallback tailored by resolvedDifficulty
      const fallbackTopics =
        resolvedDifficulty === "easy"
          ? [
              `Core Programming Fundamentals & Syntax Mastery (${resolvedSkills.slice(0, 3).join(", ") || "Stack"})`,
              `Basic Data Structures, Arrays & Object Traversal for ${jobTitleText || "Junior Developers"}`,
              `Clean Code Principles, Code Formatting & Readable Logic`,
              `Standard Error Handling, Try-Catch & Input Validation`,
              `Foundational Daily Deliverables & Team Collaboration`,
            ]
          : resolvedDifficulty === "hard"
          ? [
              `Advanced System Architecture & Distributed Systems (${resolvedSkills.slice(0, 3).join(", ") || "Stack"})`,
              `High-Concurrency Bottlenecks, Deadlocks & Thread Safety for ${jobTitleText || "Senior Architects"}`,
              `Scalability Trade-Offs: Latency, Throughput, Partitioning & Caching Strategies`,
              `Fault-Tolerant Incident Recovery, Circuit Breakers & Chaos Engineering`,
              `Technical Leadership, Long-Term Technical Debt & Architecture Governance`,
            ]
          : [
              `Core Technical & Architectural Proficiency (${resolvedSkills.slice(0, 3).join(", ") || "Stack"})`,
              `Real-World Problem Solving & Engineering Design for ${jobTitleText || "this role"}`,
              `Database Optimization, Indexing & API Contracts (${jobExperienceText})`,
              `Debugging, Concurrency & Incident Troubleshooting`,
              `Execution of Daily Deliverables, Code Quality & Feature Ownership`,
            ];

      setAiInterviewTopics(fallbackTopics);
      toast.success(`Generated role-grounded ${resolvedDifficulty.toUpperCase()} interview agenda topics!`);
    } catch (err: any) {
      const resolvedSkills = jobSkillsText
        ? jobSkillsText
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : job?.skills || [];
      const fallbackTopics =
        resolvedDifficulty === "easy"
          ? [
              `Core Programming Fundamentals & Syntax Mastery (${resolvedSkills.slice(0, 3).join(", ") || "Stack"})`,
              `Basic Data Structures, Arrays & Object Traversal for ${jobTitleText || "Junior Developers"}`,
              `Clean Code Principles, Code Formatting & Readable Logic`,
              `Standard Error Handling, Try-Catch & Input Validation`,
              `Foundational Daily Deliverables & Team Collaboration`,
            ]
          : resolvedDifficulty === "hard"
          ? [
              `Advanced System Architecture & Distributed Systems (${resolvedSkills.slice(0, 3).join(", ") || "Stack"})`,
              `High-Concurrency Bottlenecks, Deadlocks & Thread Safety for ${jobTitleText || "Senior Architects"}`,
              `Scalability Trade-Offs: Latency, Throughput, Partitioning & Caching Strategies`,
              `Fault-Tolerant Incident Recovery, Circuit Breakers & Chaos Engineering`,
              `Technical Leadership, Long-Term Technical Debt & Architecture Governance`,
            ]
          : [
              `Core Technical & Architectural Proficiency (${resolvedSkills.slice(0, 3).join(", ") || "Stack"})`,
              `Real-World Problem Solving & Engineering Design for ${jobTitleText || "this role"}`,
              `Database Optimization, Indexing & API Contracts (${jobExperienceText})`,
              `Debugging, Concurrency & Incident Troubleshooting`,
              `Execution of Daily Deliverables, Code Quality & Feature Ownership`,
            ];
      setAiInterviewTopics(fallbackTopics);
      toast.info(`Generated ${resolvedDifficulty.toUpperCase()} interview agenda topics based on your blueprint.`);
    } finally {
      setAiGenerating(false);
    }
  };

  // Render Modal: View & Edit Role Blueprint Context (Title, Exp, Skills, JD, Responsibilities)
  const renderRoleBlueprintModal = () => {
    if (!isJdModalOpen) return null;
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-surface border border-border rounded-3xl p-6 max-w-3xl w-full shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
                <Sliders className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-ink">
                  {isAiAssessment
                    ? "AI Assessment Role Blueprint Studio"
                    : isRapidRound
                    ? "Rapid Round Role Blueprint Studio"
                    : "Technical Test Role Blueprint Studio"}
                </h3>
                <p className="text-[11px] text-ink-soft">
                  {isAiAssessment
                    ? "Review and customize the 5 core parameters used by AI to generate conversational interview agenda seeds and evaluation rubrics."
                    : isRapidRound
                    ? "Review and customize the 5 core parameters used by AI to generate rapid-fire speed questions for this stage."
                    : "Review and customize the 5 core parameters used by AI to generate technical questions for this stage."}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsJdModalOpen(false)}
              className="p-1.5 rounded-lg text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 text-xs overflow-y-auto pr-1">
            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-[11px] space-y-1.5">
              <p className="font-bold text-ink flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>5-Tier AI Generation Calibration Order:</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-ink-soft text-[11px] leading-relaxed">
                <div><strong>1. Job Title:</strong> Establishes domain &amp; industry terminology.</div>
                <div><strong>2. Experience:</strong> Calibrates difficulty &amp; architectural depth.</div>
                <div><strong>3. Job Description:</strong> Anchors problem space &amp; company context.</div>
                <div><strong>4. Key Responsibilities:</strong> Drives real-world deliverables testing.</div>
                <div className="sm:col-span-2"><strong>5. Skills Set:</strong> Dictates required languages, frameworks, databases, and tooling.</div>
              </div>
            </div>

            {/* Row: Job Title & Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* 1. Job Title */}
              <div>
                <label className="text-[11px] font-bold text-ink-soft block mb-1 flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                  <span>1. Target Job Title</span>
                </label>
                <input
                  type="text"
                  value={jobTitleText}
                  onChange={(e) => {
                    setJobTitleText(e.target.value);
                    setIsJdCustomized(true);
                  }}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full bg-surface-alt/40 border border-border rounded-xl px-3 py-2 text-xs text-ink outline-none focus:border-primary font-semibold"
                />
              </div>

              {/* 2. Experience Level & Presets */}
              <div>
                <label className="text-[11px] font-bold text-ink-soft block mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>2. Target Experience Level &amp; Seniority</span>
                </label>
                <input
                  type="text"
                  value={jobExperienceText}
                  onChange={(e) => {
                    setJobExperienceText(e.target.value);
                    setIsJdCustomized(true);
                  }}
                  placeholder="e.g. 5+ years (Senior Level)"
                  className="w-full bg-surface-alt/40 border border-border rounded-xl px-3 py-2 text-xs text-ink outline-none focus:border-primary font-semibold mb-1.5"
                />
                <div className="flex flex-wrap items-center gap-1">
                  <span className="text-[10px] text-ink-soft mr-1 font-medium">Quick presets:</span>
                  {[
                    "0-2 years (Junior / Entry)",
                    "3-5 years (Mid-Level)",
                    "5-8 years (Senior)",
                    "8+ years (Lead / Architect)",
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setJobExperienceText(preset);
                        setIsJdCustomized(true);
                      }}
                      className={`text-[10px] px-2 py-0.5 rounded-md border transition cursor-pointer ${
                        jobExperienceText === preset
                          ? "bg-primary text-white border-primary font-bold"
                          : "bg-surface hover:bg-surface-alt border-border text-ink-soft"
                      }`}
                    >
                      {preset.split(" ")[0]} {preset.includes("Junior") ? "Junior" : preset.includes("Mid") ? "Mid" : preset.includes("Senior") ? "Senior" : "Lead"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Required Skills & Tech Stack */}
            <div>
              <label className="text-[11px] font-bold text-ink-soft block mb-1 flex items-center gap-1">
                <Code2 className="w-3.5 h-3.5 text-purple-600" />
                <span>5. Skills Set &amp; Tech Stack (Comma separated)</span>
              </label>
              <input
                type="text"
                value={jobSkillsText}
                onChange={(e) => {
                  setJobSkillsText(e.target.value);
                  setIsJdCustomized(true);
                }}
                placeholder="e.g. React, Node.js, TypeScript, PostgreSQL, Docker, AWS, GraphQL"
                className="w-full bg-surface-alt/40 border border-border rounded-xl px-3 py-2 text-xs text-ink outline-none focus:border-primary"
              />
              {jobSkillsText && (
                <div className="flex flex-wrap items-center gap-1 pt-1.5">
                  {jobSkillsText
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                    .map((sk, sidx) => (
                      <span
                        key={sidx}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20"
                      >
                        {sk}
                      </span>
                    ))}
                </div>
              )}
            </div>

            {/* 3. Job Description Textarea */}
            <div>
              <label className="text-[11px] font-bold text-ink-soft block mb-1 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-ink-soft" />
                <span>3. Job Description (Role Scope, Architecture &amp; Context)</span>
              </label>
              <textarea
                rows={4}
                value={jobDescriptionText}
                onChange={(e) => {
                  setJobDescriptionText(e.target.value);
                  setIsJdCustomized(true);
                }}
                placeholder="Paste or edit the job description..."
                className="w-full bg-surface-alt/40 border border-border rounded-xl p-3 text-xs text-ink outline-none focus:border-primary placeholder:text-ink-soft/50 font-normal leading-relaxed"
              />
            </div>

            {/* 4. Key Responsibilities Textarea */}
            <div>
              <label className="text-[11px] font-bold text-ink-soft block mb-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-ink-soft" />
                <span>4. Key Responsibilities &amp; Deliverables (One per line)</span>
              </label>
              <textarea
                rows={4}
                value={jobResponsibilitiesText}
                onChange={(e) => {
                  setJobResponsibilitiesText(e.target.value);
                  setIsJdCustomized(true);
                }}
                placeholder={"e.g. Design and implement microservices in Node.js\nOptimize PostgreSQL database queries and indexes\nBuild responsive UI in React & Tailwind..."}
                className="w-full bg-surface-alt/40 border border-border rounded-xl p-3 text-xs text-ink outline-none focus:border-primary placeholder:text-ink-soft/50 font-normal leading-relaxed font-mono"
              />
            </div>

            {/* Modal Action Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-border shrink-0">
              <button
                type="button"
                onClick={() => {
                  setJobTitleText(originalJobTitle);
                  setJobExperienceText(originalJobExperience);
                  setJobSkillsText(originalJobSkills);
                  setJobDescriptionText(originalJobDescription);
                  setJobResponsibilitiesText(originalJobResponsibilities);
                  setIsJdCustomized(false);
                  toast.info("Reset to original Job Post parameters.");
                }}
                className="text-xs text-ink-soft hover:text-ink font-semibold cursor-pointer"
              >
                Reset to Original Job Post
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsJdModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-soft hover:bg-surface-alt transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsJdModalOpen(false);
                    toast.success(
                      isAiAssessment
                        ? "Applied Role Blueprint context to AI Interviewer!"
                        : "Applied Role Blueprint context to AI question generation!"
                    );
                  }}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply Blueprint &amp; Done</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs font-semibold text-ink-soft">Loading stage configuration details...</p>
      </div>
    );
  }

  if (!isOnlineTestRound && !isAiAssessment) {
    const isInterview =
      stage?.stageType?.includes("interview") ||
      stage?.assessmentType?.includes("interview") ||
      stageId?.includes("interview") ||
      stageName.toLowerCase().includes("interview");

    const isBv =
      stage?.stageType?.includes("background") ||
      stageId?.includes("background") ||
      stageName.toLowerCase().includes("verification");

    return (
      <div className="min-h-screen bg-background text-ink p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-ink-soft">
          <Link href={`/recruiter/jobs?jobId=${jobId}&tab=timeline`} className="hover:text-ink transition flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Hiring Timeline</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-ink-soft/40" />
          <span className="text-ink-soft">{job?.title || "Job Requisition"}</span>
          <ChevronRight className="w-3.5 h-3.5 text-ink-soft/40" />
          <span className="font-bold text-ink">{stageName}</span>
        </div>

        {/* Warning / Guidance Card */}
        <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-border text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto border border-amber-500/20 shadow-xs">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="space-y-2.5 max-w-lg mx-auto">
            <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-surface-alt border border-border text-ink-soft uppercase tracking-wider">
              {stageName}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-ink">
              Dedicated to Online Test Rounds
            </h2>
            <p className="text-xs text-ink-soft leading-relaxed">
              This 3-section question configuration studio (MCQ, Descriptive, and Rapid Round) is designed strictly for the <strong>Online Test section</strong>:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-blue-500/10 text-blue-600 border border-blue-500/20">
                1. General Aptitude
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-purple-500/10 text-purple-600 border border-purple-500/20">
                2. Technical Test
              </span>
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
                3. Rapid Round
              </span>
            </div>
            <p className="text-xs text-ink-soft leading-relaxed pt-2">
              {isInterview
                ? "Interview rounds are evaluated through live panels, calendar scheduling, and structured interviewer rubrics in the Interview Schedule Hub."
                : isBv
                ? "Background verification rounds are managed through document verification and candidate status tracking in the Background Verification Hub."
                : "Other assessment stages operate via their respective specialized studios."}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3 border-t border-border">
            {isInterview && (
              <Link
                href="/recruiter/interview-schedule"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-sm hover:bg-primary-hover transition"
              >
                <Calendar className="w-4 h-4" />
                <span>Go to Interview Schedule Hub</span>
              </Link>
            )}
            {isBv && (
              <Link
                href="/recruiter/background-verification"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-bold text-xs shadow-sm hover:bg-primary-hover transition"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Go to Background Verification Hub</span>
              </Link>
            )}
            <Link
              href={`/recruiter/jobs/${jobId}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-alt hover:bg-border text-ink font-bold text-xs transition"
            >
              <span>Back to Job Overview</span>
            </Link>
            <Link
              href={`/recruiter/jobs?jobId=${jobId}&tab=timeline`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface border border-border hover:bg-surface-alt text-ink font-bold text-xs transition"
            >
              <span>Back to Hiring Timeline</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isAiAssessment) {
    return (
      <div className="min-h-screen bg-background text-ink p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-ink-soft">
          <Link href={`/recruiter/jobs?jobId=${jobId}&tab=timeline`} className="hover:text-ink transition flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Hiring Timeline</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-ink-soft/40" />
          <span className="text-ink-soft">{job?.title || "Job Requisition"}</span>
          <ChevronRight className="w-3.5 h-3.5 text-ink-soft/40" />
          <span className="font-bold text-ink">{stageName}</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-500/20 ml-1">
            AI Assessment Round
          </span>
        </div>

        {/* AI Assessment Studio Content */}
        <div className="space-y-6">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600/10 via-purple-500/5 to-indigo-600/10 border border-violet-500/25 p-6 sm:p-8 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-violet-600 text-white uppercase tracking-wider shadow-xs">
                    {isAiChatStage
                      ? "AI Chat Assessment"
                      : isAiVoiceStage
                      ? "AI Voice Assessment"
                      : "Conversational AI Round"}
                  </span>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-surface border border-violet-500/30 text-violet-700 dark:text-violet-300 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-violet-600" />
                    <span>
                      {isAiChatStage
                        ? "Interactive Text Chat Mode"
                        : isAiVoiceStage
                        ? "Voice-to-Voice Audio Stream"
                        : aiModalities.length === 2
                        ? "Chat + Voice Active"
                        : aiModalities.includes("voice")
                        ? "Voice-Only Active"
                        : "Chat-Only Active"}
                    </span>
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-ink tracking-tight">
                  {isAiChatStage
                    ? `AI Chat Assessment Studio: ${stageName}`
                    : isAiVoiceStage
                    ? `AI Voice Assessment Studio: ${stageName}`
                    : `AI Assessment Studio: ${stageName}`}
                </h1>
                <p className="text-xs text-ink-soft leading-relaxed">
                  {isAiChatStage
                    ? "Configure conversational turn-by-turn text chat interview sessions with real-time AI evaluation, code snippet validation, and probing questions grounded in the JD."
                    : isAiVoiceStage
                    ? "Configure natural spoken voice-to-voice interview sessions powered by bidirectional real-time audio streaming and speech evaluation."
                    : "Configure conversational turn-by-turn AI interview sessions supporting text Chat and Voice-to-Voice interviews. The AI interviewer dynamically evaluates candidates against your Job Description, Key Responsibilities, and Experience Level."}
                </p>
              </div>

              {/* Quick Summary Pill Box & Preview Button */}
              <div className="flex flex-wrap sm:flex-col items-center sm:items-end gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={handleOpenPreview}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-700 dark:text-violet-300 hover:bg-violet-500/20 text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                  <span>Preview Candidate View</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </button>
                <div className="flex sm:flex-col items-center sm:items-end gap-2 bg-surface/80 border border-border/80 rounded-2xl p-2.5 text-xs">
                  <div className="text-right">
                    <span className="text-[10px] font-medium text-ink-soft block">Target Duration</span>
                    <span className="font-extrabold text-ink">{durationMinutes} Minutes</span>
                  </div>
                  <div className="text-right sm:border-t sm:border-border/60 sm:pt-1">
                    <span className="text-[10px] font-medium text-ink-soft block">Passing Score</span>
                    <span className="font-extrabold text-emerald-600">{passingScore}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 1. ROUND FORMAT (AI Chat Assessment vs AI Voice Assessment) */}
          <div className="bg-surface border border-border rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
            {isAiChatStage ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center font-bold text-xs">
                        1
                      </div>
                      <h2 className="text-base font-extrabold text-ink">
                        Round Format: AI Chat Assessment
                      </h2>
                    </div>
                    <p className="text-xs text-ink-soft mt-1 ml-9">
                      This stage is configured as a dedicated <strong>AI Chat Assessment Round</strong>. Candidates communicate with the AI interviewer via real-time conversational messaging and code submissions.
                    </p>
                  </div>

                  <div className="text-xs font-bold px-3 py-1 rounded-xl bg-violet-500/10 border border-violet-500/30 text-violet-700 dark:text-violet-300">
                    Dedicated Chat Round Locked
                  </div>
                </div>

                <div className="p-5 rounded-2xl border bg-violet-500/5 border-violet-500 shadow-sm ring-1 ring-violet-500/20 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-violet-600 text-white shadow-md shadow-violet-500/25">
                        <MessageSquare className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-ink">Conversational Chat Assessment</h3>
                        <span className="text-[10px] font-semibold text-violet-600 dark:text-violet-400">
                          Interactive Text Chatting &amp; Code Input Mode
                        </span>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-lg border bg-violet-600 border-violet-600 text-white flex items-center justify-center shrink-0 mt-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>

                  <p className="text-xs text-ink-soft leading-relaxed">
                    Candidate participates in a real-time text chat interview. The AI asks situational and technical questions,
                    prompts for explanations or code snippets, and provides multi-turn conversational evaluation.
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-medium text-ink-soft">
                    <span className="px-2 py-0.5 rounded-md bg-surface border border-border">Turn-by-turn chat</span>
                    <span className="px-2 py-0.5 rounded-md bg-surface border border-border">Code &amp; syntax input</span>
                    <span className="px-2 py-0.5 rounded-md bg-surface border border-border">AI instant rubric</span>
                  </div>
                </div>
              </div>
            ) : isAiVoiceStage ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-xs">
                        1
                      </div>
                      <h2 className="text-base font-extrabold text-ink">
                        Round Format: AI Voice-to-Voice Assessment
                      </h2>
                    </div>
                    <p className="text-xs text-ink-soft mt-1 ml-9">
                      This stage is configured as a dedicated <strong>AI Voice Assessment Round</strong>. Candidates converse with the AI interviewer verbally via bidirectional audio streaming.
                    </p>
                  </div>

                  <div className="text-xs font-bold px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300">
                    Dedicated Voice Round Locked
                  </div>
                </div>

                <div className="p-5 rounded-2xl border bg-emerald-500/5 border-emerald-500 shadow-sm ring-1 ring-emerald-500/20 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-emerald-600 text-white shadow-md shadow-emerald-500/25">
                        <Mic className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-ink">Voice-to-Voice Live Interview</h3>
                        <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                          Real-Time Audio Stream (Gemini Live)
                        </span>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-lg border bg-emerald-600 border-emerald-600 text-white flex items-center justify-center shrink-0 mt-1">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  </div>

                  <p className="text-xs text-ink-soft leading-relaxed">
                    Candidate speaks directly with the AI interviewer using native voice-to-voice streaming.
                    Evaluates spoken technical communication, conceptual articulation, problem framing, and real-time verbal reasoning.
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-medium text-ink-soft">
                    <span className="px-2 py-0.5 rounded-md bg-surface border border-border">Bidirectional audio</span>
                    <span className="px-2 py-0.5 rounded-md bg-surface border border-border">Fluency &amp; reasoning</span>
                    <span className="px-2 py-0.5 rounded-md bg-surface border border-border">Low-latency conversation</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center font-bold text-xs">
                        1
                      </div>
                      <h2 className="text-base font-extrabold text-ink">
                        Select AI Assessment Round Type
                      </h2>
                    </div>
                    <p className="text-xs text-ink-soft mt-1 ml-9">
                      Select whether this stage operates as an <strong>AI Chat Assessment Round</strong> or an <strong>AI Voice Assessment Round</strong>.
                    </p>
                  </div>

                  <div className="text-xs font-bold px-3 py-1 rounded-xl bg-surface-alt border border-border text-ink-soft">
                    {aiModalities.includes("voice") ? "Voice Assessment Round" : "Chat Assessment Round"}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  {/* Chat Assessment Card */}
                  <div
                    onClick={() => handleSelectAiRoundType("chat")}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer select-none space-y-3 relative ${
                      aiModalities.includes("chat") && !aiModalities.includes("voice")
                        ? "bg-violet-500/5 border-violet-500 shadow-sm ring-1 ring-violet-500/20"
                        : "bg-surface-alt/30 border-border hover:border-border-hover opacity-70"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition ${
                            aiModalities.includes("chat") && !aiModalities.includes("voice")
                              ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                              : "bg-surface border border-border text-ink-soft"
                          }`}
                        >
                          <MessageSquare className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-ink">AI Chat Assessment Round</h3>
                          <span className="text-[10px] font-semibold text-violet-600 dark:text-violet-400">
                            Interactive Text Chat &amp; Coding Mode
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition shrink-0 mt-1 ${
                          aiModalities.includes("chat") && !aiModalities.includes("voice")
                            ? "bg-violet-600 border-violet-600 text-white"
                            : "border-border bg-surface"
                        }`}
                      >
                        {aiModalities.includes("chat") && !aiModalities.includes("voice") && (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-ink-soft leading-relaxed">
                      Candidate participates in a real-time text chat interview. The AI asks situational and technical questions,
                      prompts for explanations or code snippets, and provides multi-turn conversational evaluation.
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-medium text-ink-soft">
                      <span className="px-2 py-0.5 rounded-md bg-surface border border-border">Turn-by-turn chat</span>
                      <span className="px-2 py-0.5 rounded-md bg-surface border border-border">Code &amp; syntax input</span>
                      <span className="px-2 py-0.5 rounded-md bg-surface border border-border">AI instant rubric</span>
                    </div>
                  </div>

                  {/* Voice-to-Voice Interview Card */}
                  <div
                    onClick={() => handleSelectAiRoundType("voice")}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer select-none space-y-3 relative ${
                      aiModalities.includes("voice")
                        ? "bg-emerald-500/5 border-emerald-500 shadow-sm ring-1 ring-emerald-500/20"
                        : "bg-surface-alt/30 border-border hover:border-border-hover opacity-70"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition ${
                            aiModalities.includes("voice")
                              ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/25"
                              : "bg-surface border border-border text-ink-soft"
                          }`}
                        >
                          <Mic className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-ink">AI Voice Assessment Round</h3>
                          <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            Real-Time Audio Stream (Gemini Live)
                          </span>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition shrink-0 mt-1 ${
                          aiModalities.includes("voice")
                            ? "bg-emerald-600 border-emerald-600 text-white"
                            : "border-border bg-surface"
                        }`}
                      >
                        {aiModalities.includes("voice") && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    <p className="text-xs text-ink-soft leading-relaxed">
                      Candidate speaks directly with the AI interviewer using native voice-to-voice streaming.
                      Evaluates spoken technical communication, conceptual articulation, problem framing, and real-time verbal reasoning.
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] font-medium text-ink-soft">
                      <span className="px-2 py-0.5 rounded-md bg-surface border border-border">Bidirectional audio</span>
                      <span className="px-2 py-0.5 rounded-md bg-surface border border-border">Fluency &amp; reasoning</span>
                      <span className="px-2 py-0.5 rounded-md bg-surface border border-border">Low-latency conversation</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Selected round banner */}
            <div className="p-3.5 rounded-2xl bg-surface-alt/50 border border-border/80 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-violet-600 shrink-0" />
                <span className="text-ink-soft">
                  Selected Assessment Round:{" "}
                  <strong className="text-ink">
                    {aiModalities.includes("voice")
                      ? "AI Voice Assessment Round (Voice-to-Voice Streaming)"
                      : "AI Chat Assessment Round (Conversational Text Interview)"}
                  </strong>
                </span>
              </div>
              <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400 shrink-0">
                {aiModalities.includes("voice") ? "VOICE ROUND" : "CHAT ROUND"}
              </span>
            </div>
          </div>

          {/* 2. SESSION PARAMETERS & CALIBRATION */}
          <div className="bg-surface border border-border rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h2 className="text-base font-extrabold text-ink">
                Session Duration &amp; Calibration Rules
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1 text-xs">
              {/* Duration Minutes */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-ink-soft flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  <span>Assessment Duration</span>
                </label>
                <select
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 30)}
                  className="w-full bg-surface-alt/40 border border-border rounded-xl px-3 py-2 text-xs text-ink outline-none focus:border-primary font-semibold"
                >
                  <option value={15}>15 Minutes (Express)</option>
                  <option value={20}>20 Minutes</option>
                  <option value={30}>30 Minutes (Standard)</option>
                  <option value={45}>45 Minutes (In-Depth)</option>
                  <option value={60}>60 Minutes (Comprehensive)</option>
                </select>
                <span className="text-[10px] text-ink-soft block">
                  Time limit allocated for the interactive interview session.
                </span>
              </div>

              {/* Number of Questions / Topics */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-ink-soft flex items-center gap-1">
                  <FileQuestion className="w-3.5 h-3.5 text-amber-500" />
                  <span>Number of Questions / Topics</span>
                </label>
                <select
                  value={aiCount}
                  onChange={(e) => setAiCount(parseInt(e.target.value) || 8)}
                  className="w-full bg-surface-alt/40 border border-border rounded-xl px-3 py-2 text-xs text-ink outline-none focus:border-primary font-semibold"
                >
                  <option value={5}>5 Core Questions</option>
                  <option value={8}>8 Questions (Balanced)</option>
                  <option value={10}>10 Questions</option>
                  <option value={12}>12 Questions (Thorough)</option>
                  <option value={15}>15 Questions</option>
                </select>
                <span className="text-[10px] text-ink-soft block">
                  Target count of topic seeds explored by the AI interviewer.
                </span>
              </div>

              {/* Difficulty */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-ink-soft flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-purple-600" />
                  <span>Interview Difficulty</span>
                  <span className="ml-auto text-[10px] font-semibold text-purple-600 dark:text-purple-400">
                    Applies to AI Questions
                  </span>
                </label>
                <select
                  value={aiDifficulty}
                  onChange={async (e) => {
                    const newDiff = e.target.value as "easy" | "medium" | "hard";
                    setAiDifficulty(newDiff);
                    toast.info(`Difficulty updated to ${newDiff.toUpperCase()}. Recalibrating AI interview questions...`);
                    await handleGenerateAiTopics(newDiff);
                  }}
                  className="w-full bg-surface-alt/40 border border-border rounded-xl px-3 py-2 text-xs text-ink outline-none focus:border-primary font-semibold"
                >
                  <option value="easy">Easy (Foundational / Junior)</option>
                  <option value="medium">Medium (Mid-Level Practical)</option>
                  <option value="hard">Hard (Senior / Architectural)</option>
                </select>
                <span className="text-[10px] text-ink-soft block">
                  {aiDifficulty === "easy"
                    ? "Focus on fundamental knowledge and core concepts."
                    : aiDifficulty === "hard"
                    ? "Focus on high-scale tradeoffs and concurrency."
                    : "Balanced real-world problem solving and patterns."}
                </span>
              </div>

              {/* Passing Score Threshold */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-ink-soft flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Passing Score Threshold</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={40}
                    max={100}
                    value={passingScore}
                    onChange={(e) => setPassingScore(Math.min(100, Math.max(40, parseInt(e.target.value) || 70)))}
                    className="w-full bg-surface-alt/40 border border-border rounded-xl px-3 py-2 text-xs text-ink outline-none focus:border-primary font-bold pr-8"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-ink-soft font-bold">%</span>
                </div>
                <span className="text-[10px] text-ink-soft block">
                  Score required to automatically advance to the next pipeline stage.
                </span>
              </div>
            </div>
          </div>

          {/* 3. 5-TIER ROLE BLUEPRINT GROUNDING */}
          <div className="bg-surface border border-border rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center font-bold text-xs">
                    3
                  </div>
                  <h2 className="text-base font-extrabold text-ink">
                    5-Tier Role Blueprint Grounding
                  </h2>
                </div>
                <p className="text-xs text-ink-soft mt-1 ml-9">
                  The AI interviewer strictly derives questions, conversational follow-ups, and grading rubrics from these 5 role parameters:
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsJdModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 text-violet-700 dark:text-violet-300 font-bold text-xs border border-violet-500/25 transition cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{isJdCustomized ? "Edit Customized Blueprint" : "Customize Role Blueprint"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
              {/* 1. Job Title & 2. Experience */}
              <div className="p-3.5 rounded-2xl bg-surface-alt/40 border border-border space-y-1.5">
                <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">
                  1 &amp; 2. Role Title &amp; Target Experience
                </span>
                <p className="font-extrabold text-ink text-sm">
                  {jobTitleText || job?.title || "Professional Role"}
                </p>
                <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20">
                  {jobExperienceText || "3-5 years (Mid-Level)"}
                </span>
              </div>

              {/* 5. Required Skills */}
              <div className="p-3.5 rounded-2xl bg-surface-alt/40 border border-border space-y-1.5">
                <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">
                  5. Required Skills Set &amp; Tech Stack
                </span>
                <div className="flex flex-wrap gap-1 max-h-12 overflow-y-auto">
                  {jobSkillsText
                    ? jobSkillsText
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean)
                        .map((sk, sidx) => (
                          <span
                            key={sidx}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20"
                          >
                            {sk}
                          </span>
                        ))
                    : <span className="text-[11px] text-ink-soft">Core languages &amp; frameworks</span>}
                </div>
              </div>

              {/* 3. Job Description */}
              <div className="p-3.5 rounded-2xl bg-surface-alt/40 border border-border space-y-1">
                <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">
                  3. Job Description (Scope &amp; Context)
                </span>
                <p className="text-[11px] text-ink line-clamp-3 leading-relaxed">
                  {jobDescriptionText || "No job description specified. Click Customize Role Blueprint to add."}
                </p>
              </div>

              {/* 4. Key Responsibilities */}
              <div className="p-3.5 rounded-2xl bg-surface-alt/40 border border-border space-y-1">
                <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block">
                  4. Key Responsibilities &amp; Deliverables
                </span>
                <p className="text-[11px] text-ink line-clamp-3 leading-relaxed font-mono">
                  {jobResponsibilitiesText || "No key responsibilities specified. Click Customize Role Blueprint to add."}
                </p>
              </div>
            </div>
          </div>

          {/* 4. INTERVIEW AGENDA & TOPICS */}
          <div className="bg-surface border border-border rounded-3xl p-6 sm:p-7 space-y-4 shadow-xs">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-violet-500/10 text-violet-600 flex items-center justify-center font-bold text-xs">
                    4
                  </div>
                  <h2 className="text-base font-extrabold text-ink">
                    Interview Agenda &amp; Question Seeds
                  </h2>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                      aiDifficulty === "easy"
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                        : aiDifficulty === "hard"
                        ? "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20"
                        : "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20"
                    }`}
                  >
                    Calibrated: {aiDifficulty.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-ink-soft mt-1 ml-9">
                  The specific technical modules and deliverables the AI will explore during the Chat and Voice session.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleGenerateAiTopics()}
                disabled={aiGenerating}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-sm transition cursor-pointer disabled:opacity-50"
              >
                {aiGenerating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>{aiGenerating ? "Generating Topics..." : `Regenerate ${aiDifficulty.toUpperCase()} Topics with AI`}</span>
              </button>
            </div>

            {/* Topics List */}
            <div className="space-y-2 pt-1">
              {aiInterviewTopics.map((topic, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-surface-alt/40 border border-border hover:border-violet-500/30 transition text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-violet-500/10 text-violet-700 dark:text-violet-300 flex items-center justify-center font-bold text-[11px] shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-ink font-medium leading-relaxed truncate">{topic}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTopic(idx)}
                    className="p-1.5 rounded-lg text-ink-soft hover:text-red-500 hover:bg-red-500/10 transition cursor-pointer shrink-0"
                    title="Remove Topic"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {aiInterviewTopics.length === 0 && (
                <div className="p-6 rounded-2xl bg-surface-alt/30 border border-dashed border-border text-center space-y-2">
                  <p className="text-xs text-ink-soft">No interview topics added yet.</p>
                  <button
                    type="button"
                    onClick={() => handleGenerateAiTopics()}
                    className="text-xs font-bold text-violet-600 hover:underline cursor-pointer"
                  >
                    Click here to generate agenda topics with AI
                  </button>
                </div>
              )}
            </div>

            {/* Add Custom Topic Input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newTopicInput}
                onChange={(e) => setNewTopicInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTopic();
                  }
                }}
                placeholder="Add a custom topic or specific interview seed question..."
                className="flex-1 bg-surface-alt/40 border border-border rounded-xl px-3 py-2 text-xs text-ink outline-none focus:border-violet-500"
              />
              <button
                type="button"
                onClick={handleAddTopic}
                className="px-4 py-2 rounded-xl bg-surface border border-border hover:bg-surface-alt text-ink text-xs font-bold transition cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Topic</span>
              </button>
            </div>

            {/* Optional AI System Prompt Guidance */}
            <div className="space-y-1.5 pt-2 border-t border-border">
              <label className="text-[11px] font-bold text-ink-soft block flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                <span>Special AI Interviewer Guidelines &amp; Directives (Optional)</span>
              </label>
              <textarea
                rows={2}
                value={aiSystemPromptGuidance}
                onChange={(e) => setAiSystemPromptGuidance(e.target.value)}
                placeholder="e.g. Focus specifically on handling database connection pool exhaustion and microservice recovery..."
                className="w-full bg-surface-alt/40 border border-border rounded-xl p-3 text-xs text-ink outline-none focus:border-violet-500 leading-relaxed"
              />
              <span className="text-[10px] text-ink-soft block">
                These instructions will be included in the AI interviewer system prompt for both Chat and Voice modes.
              </span>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between gap-4 p-4 rounded-3xl bg-surface border border-border shadow-xs flex-wrap">
            <Link
              href={`/recruiter/jobs?jobId=${jobId}&tab=timeline`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-ink-soft hover:bg-surface-alt hover:text-ink transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Pipeline Timeline</span>
            </Link>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleOpenPreview}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-alt text-ink font-bold text-xs transition shadow-xs cursor-pointer"
              >
                <Eye className="w-4 h-4 text-violet-600" />
                <span>Preview Candidate Portal</span>
                <ExternalLink className="w-3.5 h-3.5 text-ink-soft" />
              </button>

              <button
                type="button"
                onClick={handleSaveAiAssessment}
                disabled={saving || aiModalities.length === 0}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-white font-extrabold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                <span>{saving ? "Saving AI Configuration..." : "Save & Confirm AI Assessment"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal: View & Edit Role Blueprint Context */}
        {renderRoleBlueprintModal()}
      </div>
    );
  }

  const isConfigured = Boolean(
    stage?.config?.isConfigured || (questions && questions.length > 0)
  );

  return (
    <div className="min-h-screen bg-background text-ink p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-ink-soft">
        <Link href={`/recruiter/jobs?jobId=${jobId}&tab=timeline`} className="hover:text-ink transition flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Hiring Timeline</span>
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-ink-soft/40" />
        <span className="text-ink-soft">{job?.title || "Job Requisition"}</span>
        <ChevronRight className="w-3.5 h-3.5 text-ink-soft/40" />
        <span className="font-bold text-ink">{stageName}</span>
      </div>

      {/* Hero Header */}
      <div className="bg-surface border border-border rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20 shadow-xs">
            <Sliders className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-surface-alt border border-border text-ink-soft uppercase tracking-wider">
                STAGE {stage?.order || 1}
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-ink tracking-tight">{stageName}</h1>
              {isConfigured ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" />
                  Configured &amp; Confirmed ({questions.length} Qs)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 animate-pulse">
                  <AlertTriangle className="w-3 h-3" />
                  Questions Not Configured Yet
                </span>
              )}
            </div>
            <p className="text-xs text-ink-soft">
              Configure question banks, timing parameters, passing criteria, and proctor rules for candidates qualified into this stage.
            </p>
          </div>
        </div>

        {/* Quick Save / Preview buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleOpenPreview}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface border border-border hover:bg-surface-alt text-ink font-semibold text-xs transition cursor-pointer shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-purple-600" />
            <span>Preview Candidate Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-ink-soft" />
          </button>
          <button
            type="button"
            onClick={handleSaveAndConfirm}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-brand text-white font-extrabold text-xs shadow-md hover:opacity-95 transition cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Confirm &amp; Save Configuration</span>
          </button>
        </div>
      </div>

      {/* Tabs: Questions vs Rules */}
      <div className="flex items-center gap-2 border-b border-border pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("questions")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === "questions"
              ? "bg-primary text-white shadow-xs"
              : "text-ink-soft hover:text-ink hover:bg-surface-alt"
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Stage Question Bank ({questions.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === "settings"
              ? "bg-primary text-white shadow-xs"
              : "text-ink-soft hover:text-ink hover:bg-surface-alt"
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Stage Rules, Timing &amp; Proctoring</span>
        </button>
      </div>

      {activeTab === "questions" ? (
        <div className="space-y-6">
          {/* Dedicated Rapid Round Studio Bar */}
          {isRapidRound ? (
            <div className="p-4 sm:p-5 rounded-2xl bg-surface border border-amber-500/30 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0 border border-amber-500/25">
                    <Zap className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-extrabold text-ink">
                        Rapid Round Configuration Studio
                      </h3>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                        Dedicated Speed Round
                      </span>
                    </div>
                    <p className="text-xs text-ink-soft mt-0.5">
                      Dedicated to fast-response speed questions evaluated under a strict timer, calibrated directly to the job role, JD, and key responsibilities.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-300">
                    Total Rapid Questions: <strong>{questions.length}</strong> Qs
                  </span>
                </div>
              </div>

              {/* Rapid Question Timer Settings Bar */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-ink">Per-Question Speed Timer</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300">
                        {rapidTimeLimitSeconds}s per question
                      </span>
                    </div>
                    <p className="text-[11px] text-ink-soft">
                      Select a speed preset or enter custom seconds for candidate answer submission.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
                  <span className="text-[11px] font-semibold text-ink-soft mr-1">Presets:</span>
                  {[10, 15, 20, 30, 45, 60, 90, 120].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleApplyRapidSecondsToAll(s)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        rapidTimeLimitSeconds === s
                          ? "bg-amber-600 text-white shadow-2xs ring-2 ring-amber-500/30"
                          : "bg-surface hover:bg-surface-alt border border-border text-ink"
                      }`}
                    >
                      {s}s
                    </button>
                  ))}
                  <div className="flex items-center gap-1 pl-1">
                    <input
                      type="number"
                      min={5}
                      max={300}
                      value={rapidTimeLimitSeconds}
                      onChange={(e) => {
                        const val = Math.max(5, parseInt(e.target.value) || 30);
                        handleApplyRapidSecondsToAll(val);
                      }}
                      className="w-16 bg-surface border border-amber-500/30 rounded-lg px-2 py-1 text-xs text-ink font-bold text-center outline-none"
                    />
                    <span className="text-[11px] font-semibold text-ink-soft">sec</span>
                  </div>
                </div>
              </div>
            </div>
          ) : isAptitudeRound ? (
            /* Multi-Section Selector Bar for General Aptitude & Technical Test */
            <div className="p-4 rounded-2xl bg-surface border border-border shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-2.5">
                <div>
                  <h3 className="text-sm font-black text-ink flex items-center gap-2">
                    <Layers className="w-4 h-4 text-primary" />
                    <span>
                      {isGeneralAptitude
                        ? "General Aptitude Sections"
                        : isTechnicalTest
                        ? "Technical Test Sections"
                        : `${stageName} Sections (Online Test)`}
                    </span>
                  </h3>
                  <p className="text-xs text-ink-soft">
                    Configure questions for each section individually via AI Generation, Question Bank File Upload, or Manual authoring.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-surface-alt border border-border text-ink">
                    Round Total: <strong>{questions.length}</strong> Qs
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveSection("all")}
                    className={`text-xs font-bold px-2.5 py-1 rounded-lg transition cursor-pointer ${
                      activeSection === "all"
                        ? "bg-ink text-surface"
                        : "text-ink-soft hover:text-ink hover:bg-surface-alt"
                    }`}
                  >
                    View All ({questions.length})
                  </button>
                </div>
              </div>

              {/* 3 Interactive Section Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {/* Section 1: Multiple Choice Questions (MCQ) */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection("mcq");
                    setAiQuestionFormat("mcq");
                    setManualType("mcq");
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between gap-3 ${
                    activeSection === "mcq"
                      ? "bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/30"
                      : "bg-surface-alt/40 hover:bg-surface-alt border-border text-ink"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-black text-xs ${
                        activeSection === "mcq" ? "bg-white/20 text-white" : "bg-blue-500/10 text-blue-600"
                      }`}
                    >
                      1
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black truncate">1. Multiple Choice (MCQ)</p>
                      <p
                        className={`text-[10px] truncate ${
                          activeSection === "mcq" ? "text-blue-100" : "text-ink-soft"
                        }`}
                      >
                        {isTechnicalTest
                          ? "Technical Concepts & Architecture"
                          : "Quantitative & Reasoning"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-black px-2 py-0.5 rounded-full shrink-0 ${
                      activeSection === "mcq" ? "bg-white/20 text-white" : "bg-blue-500/10 text-blue-600"
                    }`}
                  >
                    {mcqQuestions.length} Qs
                  </span>
                </button>

                {/* Section 2: Descriptive */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection("descriptive");
                    setAiQuestionFormat("descriptive");
                    setManualType("descriptive");
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between gap-3 ${
                    activeSection === "descriptive"
                      ? "bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-500/30"
                      : "bg-surface-alt/40 hover:bg-surface-alt border-border text-ink"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-black text-xs ${
                        activeSection === "descriptive" ? "bg-white/20 text-white" : "bg-purple-500/10 text-purple-600"
                      }`}
                    >
                      2
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black truncate">2. Descriptive Round</p>
                      <p
                        className={`text-[10px] truncate ${
                          activeSection === "descriptive" ? "text-purple-100" : "text-ink-soft"
                        }`}
                      >
                        {isTechnicalTest
                          ? "Code Implementation / System Design"
                          : "Analytical / Written Proof"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-black px-2 py-0.5 rounded-full shrink-0 ${
                      activeSection === "descriptive" ? "bg-white/20 text-white" : "bg-purple-500/10 text-purple-600"
                    }`}
                  >
                    {descriptiveQuestions.length} Qs
                  </span>
                </button>

                {/* Section 3: Rapid Round */}
                <button
                  type="button"
                  onClick={() => {
                    setActiveSection("rapid");
                    setAiQuestionFormat("rapid");
                    setManualType("rapid");
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between gap-3 ${
                    activeSection === "rapid"
                      ? "bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-500/30"
                      : "bg-surface-alt/40 hover:bg-surface-alt border-border text-ink"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-black text-xs ${
                        activeSection === "rapid" ? "bg-white/20 text-white" : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      3
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-black truncate flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>3. Rapid Question Round</span>
                      </p>
                      <p
                        className={`text-[10px] truncate ${
                          activeSection === "rapid" ? "text-amber-100" : "text-ink-soft"
                        }`}
                      >
                        {isTechnicalTest
                          ? "Rapid Technical Blitz"
                          : "Speed Math & Logic"}{" "}
                        ({rapidTimeLimitSeconds}s)
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-black px-2 py-0.5 rounded-full shrink-0 ${
                      activeSection === "rapid" ? "bg-white/20 text-white" : "bg-amber-500/10 text-amber-600"
                    }`}
                  >
                    {rapidQuestions.length} Qs
                  </span>
                </button>
              </div>

              {/* Rapid Round Speed & Timer Settings Bar (when activeSection is rapid in multi-section stage) */}
              {activeSection === "rapid" && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex flex-col md:flex-row md:items-center justify-between gap-3 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
                      <Zap className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-ink">Rapid Question Timer Settings</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300">
                          {rapidTimeLimitSeconds}s per question
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-soft">
                        Select a speed preset or enter custom seconds for each rapid-fire question.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
                    <span className="text-[11px] font-semibold text-ink-soft mr-1">Presets:</span>
                    {[10, 15, 20, 30, 45, 60, 90, 120].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleApplyRapidSecondsToAll(s)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                          rapidTimeLimitSeconds === s
                            ? "bg-amber-600 text-white shadow-2xs ring-2 ring-amber-500/30"
                            : "bg-surface hover:bg-surface-alt border border-border text-ink"
                        }`}
                      >
                        {s}s
                      </button>
                    ))}
                    <div className="flex items-center gap-1 pl-1">
                      <input
                        type="number"
                        min={5}
                        max={300}
                        value={rapidTimeLimitSeconds}
                        onChange={(e) => {
                          const val = Math.max(5, parseInt(e.target.value) || 30);
                          handleApplyRapidSecondsToAll(val);
                        }}
                        className="w-16 bg-surface border border-amber-500/30 rounded-lg px-2 py-1 text-xs text-ink font-bold text-center outline-none"
                      />
                      <span className="text-[11px] font-semibold text-ink-soft">sec</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Mode Switch: Upload Question Bank vs AI Generation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-1.5 bg-surface-alt/60 rounded-2xl border border-border">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setCreationMode("upload")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  creationMode === "upload"
                    ? "bg-surface text-primary shadow-xs border border-border"
                    : "text-ink-soft hover:text-ink hover:bg-surface/50"
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Question Bank (Excel / CSV / PDF / Word / JSON)</span>
              </button>
              <button
                type="button"
                onClick={() => setCreationMode("ai")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  creationMode === "ai"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-ink-soft hover:text-ink hover:bg-surface/50"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Generate with AI</span>
              </button>
            </div>

            {creationMode === "upload" && (
              <div className="flex items-center gap-2 px-2 text-xs">
                <span className="text-[11px] font-semibold text-ink-soft">Sample templates:</span>
                <button
                  type="button"
                  onClick={() => handleDownloadTemplate("excel")}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>Excel (.xlsx)</span>
                </button>
                <span className="text-border">|</span>
                <button
                  type="button"
                  onClick={() => handleDownloadTemplate("csv")}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 hover:underline cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                  <span>CSV (.csv)</span>
                </button>
              </div>
            )}
          </div>

          {/* Creation Mode 1: Upload Question Bank */}
          {creationMode === "upload" && (
            <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
              {/* Drag & Drop Upload Zone */}
              <div className="relative border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-2xl p-6 text-center bg-surface-alt/20 group">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv,.json,.pdf,.docx"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                    {uploading ? (
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    ) : (
                      <FileUp className="w-6 h-6 text-primary" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink">
                      {uploading ? "Parsing Question Bank Document..." : "Click or drag & drop Question Bank document here"}
                    </p>
                    <p className="text-xs text-ink-soft mt-0.5">
                      Supports <strong>Excel (.xlsx)</strong>, <strong>CSV (.csv)</strong>, <strong>PDF (.pdf)</strong>, <strong>Word (.docx)</strong>, or <strong>JSON (.json)</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* If questions parsed from file */}
              {uploadedPool.length > 0 && (
                <div className="p-4 rounded-xl bg-surface-alt/40 border border-border space-y-4 animate-in fade-in duration-200">
                  {/* Sampling Toolbar: 10, 30, 60 or custom selection */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-surface p-3.5 rounded-xl border border-border">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          {uploadedPool.length} Questions Found
                        </span>
                        <span className="text-xs font-bold text-ink truncate max-w-[200px]" title={uploadedFilename}>
                          File: {uploadedFilename}
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-soft">
                        Quickly sample a subset of questions using the presets below or customize your selection:
                      </p>
                    </div>

                    {/* 1-Click Sampling Preset Buttons */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handlePickRandom(10)}
                        className="px-2.5 py-1.5 rounded-lg bg-surface border border-border hover:border-primary/40 hover:bg-primary/5 text-ink text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Shuffle className="w-3 h-3 text-primary" />
                        <span>Pick 10 Random</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePickRandom(30)}
                        className="px-2.5 py-1.5 rounded-lg bg-surface border border-border hover:border-primary/40 hover:bg-primary/5 text-ink text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Shuffle className="w-3 h-3 text-primary" />
                        <span>Pick 30 Random</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePickRandom(60)}
                        className="px-2.5 py-1.5 rounded-lg bg-surface border border-border hover:border-primary/40 hover:bg-primary/5 text-ink text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <Shuffle className="w-3 h-3 text-primary" />
                        <span>Pick 60 Random</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleSelectAll}
                        className="px-2.5 py-1.5 rounded-lg bg-surface border border-border hover:bg-surface-alt text-ink text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        {selectedIds.size === uploadedPool.length ? (
                          <Square className="w-3 h-3 text-ink-soft" />
                        ) : (
                          <CheckSquare className="w-3 h-3 text-primary" />
                        )}
                        <span>{selectedIds.size === uploadedPool.length ? "Deselect All" : "Select All"}</span>
                      </button>

                      {/* Custom Count Picker */}
                      <div className="flex items-center gap-1 pl-2 border-l border-border">
                        <input
                          type="number"
                          min={1}
                          max={uploadedPool.length}
                          value={customPickCount}
                          onChange={(e) => setCustomPickCount(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-14 bg-surface border border-border rounded-lg px-2 py-1 text-xs text-ink text-center font-bold outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handlePickRandom(customPickCount)}
                          className="px-2 py-1 rounded-lg bg-surface-alt border border-border hover:bg-border text-ink text-xs font-semibold cursor-pointer"
                        >
                          Pick Custom
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Confirmation & Import Bar */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <span className="text-xs font-bold text-ink">
                      Selected <span className="text-primary">{selectedIds.size}</span> of {uploadedPool.length} questions
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleImportSelected("append")}
                        disabled={selectedIds.size === 0}
                        className="px-3.5 py-1.5 rounded-xl bg-surface border border-border hover:bg-surface-alt text-ink text-xs font-bold disabled:opacity-40 transition cursor-pointer"
                      >
                        + Append ({selectedIds.size})
                      </button>
                      <button
                        type="button"
                        onClick={() => handleImportSelected("replace")}
                        disabled={selectedIds.size === 0}
                        className="px-4 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs disabled:opacity-40 transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Import & Replace Stage Bank ({selectedIds.size})</span>
                      </button>
                    </div>
                  </div>

                  {/* Collapsible/Scrollable Preview of Uploaded Questions with Checkboxes */}
                  <div className="max-h-60 overflow-y-auto rounded-xl border border-border divide-y divide-border bg-surface text-xs">
                    {uploadedPool.map((q, idx) => {
                      const isSelected = selectedIds.has(q.id);
                      return (
                        <div
                          key={q.id || idx}
                          onClick={() => handleToggleQuestion(q.id)}
                          className={`p-3 flex items-start gap-3 cursor-pointer transition select-none ${
                            isSelected ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-surface-alt/50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleQuestion(q.id)}
                            className="mt-0.5 rounded text-primary focus:ring-primary cursor-pointer"
                          />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold text-ink">
                                {idx + 1}. {q.question}
                              </span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-alt text-ink-soft shrink-0">
                                {q.points || 10} pts
                              </span>
                            </div>
                            {q.type === "descriptive" || (!q.options || q.options.length === 0) ? (
                              <div className="pt-1 flex items-center gap-2">
                                <span className="text-[10px] font-bold text-purple-600 bg-purple-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <FileText className="w-2.5 h-2.5" /> Descriptive / Analytical
                                </span>
                                {q.sampleAnswer && (
                                  <span className="text-[10px] text-ink-soft truncate max-w-sm">
                                    Model: {q.sampleAnswer}
                                  </span>
                                )}
                              </div>
                            ) : (
                              q.options && q.options.length > 0 && (
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1 text-[11px] text-ink-soft">
                                  {q.options.map((opt: any) => (
                                    <div
                                      key={opt.id}
                                      className={`truncate ${
                                        opt.id === q.correctOptionId ? "text-emerald-600 font-bold" : ""
                                      }`}
                                    >
                                      {opt.id}. {opt.text} {opt.id === q.correctOptionId ? "✓" : ""}
                                    </div>
                                  ))}
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Creation Mode 2: AI Generator Card */}
          {creationMode === "ai" && (() => {
            return (
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-500/10 via-indigo-500/5 to-primary/10 border border-purple-500/20 shadow-xs space-y-4 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-600 flex items-center justify-center font-bold shrink-0">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-extrabold text-ink">
                          {isRapidRound
                            ? `Generate Rapid Round Speed Questions (${rapidTimeLimitSeconds}s Timed - JD Grounded)`
                            : isTechnicalTest
                            ? activeSection === "mcq"
                              ? "Generate Technical MCQs (JD & Responsibilities Grounded)"
                              : activeSection === "descriptive"
                              ? "Generate Technical Descriptive Challenges (JD Grounded)"
                              : activeSection === "rapid"
                              ? "Generate Rapid Technical Blitz Questions (JD Grounded)"
                              : "Generate Technical Test Questions (JD Grounded)"
                            : isGeneralAptitude
                            ? activeSection === "mcq"
                              ? "Generate Multiple Choice Questions (MCQ) with AI"
                              : activeSection === "descriptive"
                              ? "Generate Descriptive Questions with AI"
                              : activeSection === "rapid"
                              ? "Generate Rapid Question Round with AI"
                              : "Generate General Aptitude Questions with AI"
                            : "Generate Questions with AI"}
                        </h3>
                        {isRoleGroundedRound ? (
                          <span className="text-[10px] font-extrabold text-purple-700 dark:text-purple-300 bg-purple-500/15 border border-purple-500/25 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            JD &amp; Responsibilities Grounded
                          </span>
                        ) : isGeneralAptitude ? (
                          <span className="text-[10px] font-extrabold text-purple-700 bg-purple-500/15 border border-purple-500/25 px-2 py-0.5 rounded-full">
                            Non-Technical
                          </span>
                        ) : null}
                      </div>
                      <p className="text-xs text-ink-soft">
                        {isRapidRound
                          ? `Generates rapid-fire speed assessment questions (${rapidTimeLimitSeconds}s per question) directly evaluated against the Job Description, Key Responsibilities, and Technical Stack of ${job?.title || "this position"}. Review or edit the blueprint below.`
                          : isTechnicalTest
                          ? `Questions are directly generated from the Job Description, Key Responsibilities, and Technical Stack of ${job?.title || "this position"}. Review or edit the context below.`
                          : isGeneralAptitude
                          ? activeSection === "mcq"
                            ? "Generates 100% non-technical Quantitative Aptitude (arithmetic, percentages, work & time) and Logical Reasoning multiple-choice questions with 4 options."
                            : activeSection === "descriptive"
                            ? "Generates non-technical analytical, case-based, and mathematical aptitude problems requiring step-by-step written calculations and proofs."
                            : activeSection === "rapid"
                            ? `Generates fast-paced speed arithmetic, rapid pattern matching, and quick reasoning questions timed at ${rapidTimeLimitSeconds} seconds each.`
                            : "Generates 100% non-technical Quantitative Aptitude and Logical Reasoning questions."
                          : `Automatically construct high-fidelity questions aligned with ${job?.title || "this position"}.`}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleGenerateAIQuestions()}
                    disabled={aiGenerating}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50 self-start sm:self-auto"
                  >
                    {aiGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>{aiGenerating ? "Generating Questions..." : "Generate with AI"}</span>
                  </button>
                </div>

                {/* Technical Test / Rapid Round: 5-Tier Role Blueprint Context Banner */}
                {isRoleGroundedRound && (
                  <div className="p-4 rounded-xl bg-surface border border-purple-500/30 space-y-3 shadow-2xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Sliders className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-bold text-ink">Role Blueprint Grounding</span>
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/25 flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              5-Tier Blueprint Linked
                            </span>
                            {isJdCustomized && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/25">
                                Customized for Question Generation
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-ink-soft mt-0.5">
                            Questions are calibrated in strict order: <strong className="text-ink">Job Title</strong> → <strong className="text-ink">Experience Level</strong> → <strong className="text-ink">Job Description</strong> → <strong className="text-ink">Key Responsibilities</strong> → <strong className="text-ink">Skills Set</strong>.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                        <button
                          type="button"
                          onClick={() => setIsJdModalOpen(true)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface hover:bg-surface-alt border border-border text-ink font-bold text-xs shadow-2xs transition cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-primary" />
                          <span>View / Edit Role Blueprint</span>
                        </button>
                        {isJdCustomized && (
                          <button
                            type="button"
                            onClick={() => {
                              setJobTitleText(originalJobTitle);
                              setJobExperienceText(originalJobExperience);
                              setJobSkillsText(originalJobSkills);
                              setJobDescriptionText(originalJobDescription);
                              setJobResponsibilitiesText(originalJobResponsibilities);
                              setIsJdCustomized(false);
                              toast.info("Reset to original Job Post parameters.");
                            }}
                            className="text-[11px] text-ink-soft hover:text-rose-500 underline cursor-pointer"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>

                    {/* 5-Tier Blueprint Overview Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-1 text-xs">
                      {/* 1. Target Role & Experience */}
                      <div className="p-2.5 rounded-lg bg-surface-alt/50 border border-border/80 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider flex items-center gap-1">
                            <Briefcase className="w-3 h-3 text-primary" />
                            1. Job Title &amp; 2. Experience
                          </span>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                            {jobExperienceText || "Mid-Level"}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-ink truncate">
                          {jobTitleText || job?.title || "Engineering Role"}
                        </p>
                      </div>

                      {/* 5. Required Skills & Tech Stack */}
                      <div className="p-2.5 rounded-lg bg-surface-alt/50 border border-border/80 space-y-1">
                        <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider flex items-center gap-1">
                          <Code2 className="w-3 h-3 text-purple-600" />
                          5. Skills Set &amp; Tech Stack
                        </span>
                        <div className="flex flex-wrap items-center gap-1 overflow-hidden max-h-6">
                          {jobSkillsText
                            ? jobSkillsText
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean)
                                .slice(0, 6)
                                .map((sk, sidx) => (
                                  <span
                                    key={sidx}
                                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300"
                                  >
                                    {sk}
                                  </span>
                                ))
                            : <span className="text-[11px] text-ink-soft">Core languages & frameworks</span>}
                        </div>
                      </div>

                      {/* 3. Job Description */}
                      <div className="p-2.5 rounded-lg bg-surface-alt/50 border border-border/80">
                        <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block mb-1">
                          3. Job Description (Scope &amp; Context):
                        </span>
                        <p className="text-[11px] text-ink line-clamp-2 leading-relaxed">
                          {jobDescriptionText || "No job description specified. Click Edit to add."}
                        </p>
                      </div>

                      {/* 4. Key Responsibilities */}
                      <div className="p-2.5 rounded-lg bg-surface-alt/50 border border-border/80">
                        <span className="text-[10px] font-bold text-ink-soft uppercase tracking-wider block mb-1">
                          4. Key Responsibilities &amp; Deliverables:
                        </span>
                        <p className="text-[11px] text-ink line-clamp-2 leading-relaxed">
                          {jobResponsibilitiesText || "No key responsibilities specified. Click Edit to add."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI Settings Controls */}
                <div
                  className={`grid grid-cols-1 sm:grid-cols-2 ${
                    isRapidRound || activeSection === "rapid" || aiQuestionFormat === "rapid" ? "lg:grid-cols-5" : "lg:grid-cols-4"
                  } gap-3 pt-2 border-t border-purple-500/20 text-xs`}
                >
                  <div>
                    <label className="text-[11px] font-bold text-ink-soft block mb-1">Question Count</label>
                    <select
                      value={aiCount}
                      onChange={(e) => setAiCount(parseInt(e.target.value) || 10)}
                      className="w-full bg-surface border border-border rounded-xl px-3 py-1.5 text-xs text-ink outline-none"
                    >
                      <option value={5}>5 Questions</option>
                      <option value={10}>10 Questions (Recommended)</option>
                      <option value={15}>15 Questions</option>
                      <option value={20}>20 Questions</option>
                      <option value={30}>30 Questions</option>
                      <option value={60}>60 Questions</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-ink-soft block mb-1">Question Format</label>
                    {isRapidRound ? (
                      <div className="w-full bg-surface-alt/70 border border-amber-500/30 rounded-xl px-3 py-1.5 text-xs text-amber-700 dark:text-amber-300 font-bold flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 fill-current text-amber-600" />
                        <span>Rapid Speed ({rapidTimeLimitSeconds}s Timed)</span>
                      </div>
                    ) : (
                      <select
                        value={aiQuestionFormat}
                        onChange={(e) => setAiQuestionFormat(e.target.value as any)}
                        className="w-full bg-surface border border-border rounded-xl px-3 py-1.5 text-xs text-ink outline-none font-medium"
                      >
                        {isAptitudeRound ? (
                          <>
                            <option value="mcq">Multiple Choice Only (MCQ)</option>
                            <option value="descriptive">Descriptive Only (Analytical / Proof)</option>
                            <option value="rapid">Rapid Speed Round ({rapidTimeLimitSeconds}s Timed)</option>
                            <option value="mixed">Mixed (All Formats)</option>
                          </>
                        ) : (
                          <>
                            <option value="mixed">Mixed (MCQ + Descriptive)</option>
                            <option value="mcq">Multiple Choice Only (MCQ)</option>
                            <option value="descriptive">Descriptive Only (Analytical / Proof)</option>
                          </>
                        )}
                      </select>
                    )}
                  </div>

                  {(isRapidRound || activeSection === "rapid" || aiQuestionFormat === "rapid") && (
                    <div>
                      <label className="text-[11px] font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1 mb-1">
                        <Zap className="w-3 h-3 fill-current" />
                        Speed Timer per Question
                      </label>
                      <select
                        value={rapidTimeLimitSeconds}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 30;
                          handleApplyRapidSecondsToAll(val);
                        }}
                        className="w-full bg-surface border border-amber-500/30 rounded-xl px-3 py-1.5 text-xs text-ink font-bold outline-none cursor-pointer"
                      >
                        <option value={10}>10 Seconds (Speed Blitz)</option>
                        <option value={15}>15 Seconds (Blitz)</option>
                        <option value={20}>20 Seconds (Fast)</option>
                        <option value={30}>30 Seconds (Default Standard)</option>
                        <option value={45}>45 Seconds (Moderate)</option>
                        <option value={60}>60 Seconds (1 Minute)</option>
                        <option value={90}>90 Seconds (1.5 Mins)</option>
                        <option value={120}>120 Seconds (2 Minutes)</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="text-[11px] font-bold text-ink-soft block mb-1">Difficulty</label>
                    <select
                      value={aiDifficulty}
                      onChange={async (e) => {
                        const newDiff = e.target.value as "easy" | "medium" | "hard";
                        setAiDifficulty(newDiff);
                        if (questions.length > 0) {
                          toast.info(`Difficulty switched to ${newDiff.toUpperCase()}. Recalibrating test questions...`);
                          await handleGenerateAIQuestions(newDiff);
                        } else {
                          toast.info(`Difficulty set to ${newDiff.toUpperCase()}.`);
                        }
                      }}
                      className="w-full bg-surface border border-border rounded-xl px-3 py-1.5 text-xs text-ink outline-none"
                    >
                      <option value="easy">Easy (Fundamentals)</option>
                      <option value="medium">Medium (Standard)</option>
                      <option value="hard">Hard (Advanced Application)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-ink-soft block mb-1">Custom Topic Focus (Optional)</label>
                    <input
                      type="text"
                      placeholder={
                        isRapidRound
                          ? "e.g. Quick code output, Syntax trivia, API lookup, Rapid debugging"
                          : isTechnicalTest
                          ? "e.g. Data Structures, React hooks, SQL optimization, REST API design"
                          : "e.g. Work & Time, Number Series, Syllogisms, Profit & Loss"
                      }
                      value={aiFocusTopic}
                      onChange={(e) => setAiFocusTopic(e.target.value)}
                      className="w-full bg-surface border border-border rounded-xl px-3 py-1.5 text-xs text-ink outline-none placeholder:text-ink-soft/50"
                    />
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Active Questions Header & Random Pooling Banner */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-ink">
                  {isRapidRound
                    ? "Active Rapid-Fire Speed Questions"
                    : isAptitudeRound
                    ? activeSection === "mcq"
                      ? "Active Questions - Section 1: Multiple Choice (MCQ)"
                      : activeSection === "descriptive"
                      ? "Active Questions - Section 2: Descriptive Round"
                      : activeSection === "rapid"
                      ? "Active Questions - Section 3: Rapid Question Round"
                      : "Active Questions - All Sections"
                    : "Active Questions in Stage Bank"}
                </span>
                <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {displayedQuestions.length} {displayedQuestions.length === 1 ? "Question" : "Questions"}
                </span>
                {!isRapidRound && isAptitudeRound && activeSection !== "all" && (
                  <span className="text-[11px] text-ink-soft">
                    (Round Total: <strong>{questions.length}</strong>)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (isRapidRound) {
                      setManualType("rapid");
                      setManualTimeLimitSeconds(rapidTimeLimitSeconds);
                    } else if (isAptitudeRound && activeSection !== "all") {
                      setManualType(activeSection);
                    }
                    setShowManualModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface border border-border hover:border-primary/50 text-ink text-xs font-bold transition shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-primary" />
                  <span>
                    + Add{" "}
                    {isRapidRound
                      ? "Rapid Speed"
                      : isAptitudeRound && activeSection !== "all"
                      ? activeSection === "mcq"
                        ? "MCQ"
                        : activeSection === "descriptive"
                        ? "Descriptive"
                        : "Rapid"
                      : ""}{" "}
                    Question Manually
                  </span>
                </button>

                {displayedQuestions.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const sectionLabel =
                        isRapidRound ? "Rapid Round" : (isAptitudeRound && activeSection !== "all" ? activeSection.toUpperCase() : "all");
                      if (confirm(`Clear ${sectionLabel} questions for this stage?`)) {
                        if (isRapidRound) {
                          setQuestions([]);
                        } else if (isAptitudeRound && activeSection !== "all") {
                          setQuestions((prev) => prev.filter((p) => getQuestionSection(p) !== activeSection));
                        } else {
                          setQuestions([]);
                        }
                      }
                    }}
                    className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 hover:underline cursor-pointer pl-1"
                  >
                    Clear {isRapidRound ? "Rapid Round" : (isAptitudeRound && activeSection !== "all" ? `${activeSection.toUpperCase()}` : "Active")} Questions
                  </button>
                )}
              </div>
            </div>

            {/* If Rapid Round: Speed & Timing Directive Banner */}
            {isRapidRound && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-150">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold shrink-0">
                    <Zap className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-ink">Rapid-Fire Speed Round Active</p>
                    <p className="text-[11px] text-ink-soft">
                      Candidates will be evaluated under a strict {rapidTimeLimitSeconds}s per question countdown. Questions test practical speed and problem solving based on {jobTitleText || "the job profile"}, JD, and responsibilities.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-extrabold px-3 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{rapidTimeLimitSeconds}s Countdown</span>
                  </span>
                </div>
              </div>
            )}

            {/* Explanatory Info Card: How 100+ Question Pools Work in Assessments */}
            <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <Shuffle className="w-4 h-4" />
              </div>
              <div className="text-xs space-y-1">
                <p className="font-bold text-ink">Handling 100+ Question Banks & Anti-Cheating</p>
                <p className="text-ink-soft leading-relaxed text-[11px]">
                  {isRapidRound
                    ? "You can keep 100+ rapid-fire questions in your question bank or pick only 10, 30, or 60. When you keep a large pool (e.g. 100 questions), our testing engine will automatically select a unique pseudo-random draw for each candidate based on their application ID. This prevents cheating and answer leakage across candidates!"
                    : "You can keep 100+ questions across the 3 sections or pick only 10, 30, or 60. When you keep a large pool (e.g. 100 questions), our testing engine will automatically select a unique pseudo-random draw for each candidate based on their application ID. This prevents cheating and answer leakage across candidates!"}
                </p>
              </div>
            </div>
          </div>

          {/* Question List View */}
          {displayedQuestions.length === 0 ? (
            <div className="p-12 text-center bg-surface border border-dashed border-border rounded-3xl space-y-3">
              <FileQuestion className="w-10 h-10 text-ink-soft/40 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-ink">
                  {isRapidRound
                    ? "No Rapid Round Speed Questions Configured Yet"
                    : `No ${isAptitudeRound && activeSection !== "all" ? `${activeSection.toUpperCase()}` : ""} Questions Configured Yet`}
                </h4>
                <p className="text-xs text-ink-soft max-w-sm mx-auto">
                  {isRapidRound
                    ? `Click "Generate with AI" to auto-create ${rapidTimeLimitSeconds}s speed questions grounded in the JD and responsibilities, or upload a question bank.`
                    : 'Click "Generate with AI" to auto-create questions, or add questions manually.'}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedQuestions.map((q, idx) => {
                const qSection = getQuestionSection(q);
                const isRapid = qSection === "rapid";
                const isDescriptive = qSection === "descriptive";

                return (
                  <div key={q.id || idx} className="p-4 rounded-2xl bg-surface border border-border hover:border-primary/30 transition shadow-2xs space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="w-6 h-6 rounded-lg bg-surface-alt text-ink font-bold text-xs flex items-center justify-center shrink-0 border border-border">
                          {idx + 1}
                        </span>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-ink leading-relaxed">{q.question}</p>
                          <div className="flex items-center gap-2">
                            {isRapidRound || isRapid ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const current = q.timeLimitSeconds || rapidTimeLimitSeconds || 30;
                                  const input = prompt("Enter timer in seconds for this question:", String(current));
                                  if (input !== null) {
                                    const parsed = Math.max(5, parseInt(input) || 30);
                                    setQuestions((prev) =>
                                      prev.map((item) => (item.id === q.id ? { ...item, timeLimitSeconds: parsed } : item))
                                    );
                                    toast.success(`Updated timer for question #${idx + 1} to ${parsed}s!`);
                                  }
                                }}
                                className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 border border-amber-500/20 inline-flex items-center gap-1 cursor-pointer transition"
                                title="Click to adjust timer for this individual question"
                              >
                                <Zap className="w-3 h-3 fill-current" />
                                <span>{isRapidRound ? "Rapid Speed" : "3. Rapid Round"} ({q.timeLimitSeconds || rapidTimeLimitSeconds || 30}s speed)</span>
                                <Edit3 className="w-2.5 h-2.5 opacity-60" />
                              </button>
                            ) : isDescriptive ? (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 border border-purple-500/20 inline-flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                2. Descriptive / Analytical
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 inline-flex items-center gap-1">
                                <CheckSquare className="w-3 h-3" />
                                1. Multiple Choice (MCQ)
                              </span>
                            )}
                            {q.difficulty && (
                              <span className="text-[10px] font-semibold text-ink-soft uppercase">
                                {q.difficulty}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-primary/10 text-primary-glow border border-primary/20">
                          {q.points || 10} pts
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-1.5 rounded-lg text-ink-soft hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                          title="Delete Question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* If Descriptive Question: Display Model Solution & Rubric */}
                    {isDescriptive ? (
                      <div className="space-y-2.5 pl-8 pt-1 text-xs">
                        {q.sampleAnswer && (
                          <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/15">
                            <span className="font-bold text-purple-700 dark:text-purple-300 block text-[11px] mb-1">
                              Model Solution / Step-by-Step Working:
                            </span>
                            <p className="text-ink-soft whitespace-pre-wrap leading-relaxed font-mono text-[11px]">
                              {q.sampleAnswer}
                            </p>
                          </div>
                        )}
                        {q.evaluationRubric && (
                          <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/15 text-[11px]">
                            <span className="font-bold text-amber-700 dark:text-amber-300 block mb-1">
                              Evaluation Rubric &amp; Grading Criteria:
                            </span>
                            <p className="text-ink-soft whitespace-pre-wrap leading-relaxed">
                              {q.evaluationRubric}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Options display for MCQ & Rapid */
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pl-8">
                        {q.options?.map((opt) => {
                          const isCorrect =
                            opt.id === q.correctOptionId ||
                            (q.correctOptionId && opt.text && q.correctOptionId.toLowerCase() === opt.text.toLowerCase());

                          return (
                            <div
                              key={opt.id}
                              className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 ${
                                isCorrect
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold"
                                  : "bg-surface-alt/40 border-border text-ink-soft"
                              }`}
                            >
                              <span className="truncate">
                                <strong className="mr-1.5 text-ink">{opt.id}.</strong>
                                {opt.text}
                              </span>
                              {isCorrect && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-emerald-600 bg-emerald-500/20 px-1.5 py-0.2 rounded-full shrink-0">
                                  <Check className="w-2.5 h-2.5" /> Correct
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Settings & Proctoring Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Timing & Scoring */}
          <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-ink flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              Timing &amp; Passing Thresholds
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-bold text-ink-soft block mb-1">
                  Stage Duration (Minutes)
                </label>
                <input
                  type="number"
                  min={5}
                  max={240}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 30)}
                  className="w-full bg-surface-alt/50 border border-border rounded-xl px-3 py-2 text-xs text-ink outline-none"
                />
                <span className="text-[10px] text-ink-soft mt-1 block">
                  Candidates will have exactly {durationMinutes} minutes with an active countdown clock.
                </span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-soft block mb-1">
                  Passing Score Required (%)
                </label>
                <input
                  type="number"
                  min={10}
                  max={100}
                  value={passingScore}
                  onChange={(e) => setPassingScore(parseInt(e.target.value) || 70)}
                  className="w-full bg-surface-alt/50 border border-border rounded-xl px-3 py-2 text-xs text-ink outline-none"
                />
                <span className="text-[10px] text-ink-soft mt-1 block">
                  Candidates scoring &gt;= {passingScore}% will automatically advance to the next pipeline round.
                </span>
              </div>

              <div>
                <label className="text-[11px] font-bold text-ink-soft block mb-1">
                  Candidate Deadline (Hours)
                </label>
                <input
                  type="number"
                  min={1}
                  max={168}
                  value={deadlineHours}
                  onChange={(e) => setDeadlineHours(parseInt(e.target.value) || 48)}
                  className="w-full bg-surface-alt/50 border border-border rounded-xl px-3 py-2 text-xs text-ink outline-none"
                />
                <span className="text-[10px] text-ink-soft mt-1 block">
                  Candidates must complete the test within {deadlineHours} hours of invitation.
                </span>
              </div>

              {isAptitudeRound && (
                <div className="pt-2 border-t border-border space-y-1.5">
                  <label className="text-[11px] font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 fill-current" />
                    <span>Section 3: Rapid Question Round Timer (Seconds per Question)</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      type="number"
                      min={5}
                      max={300}
                      value={rapidTimeLimitSeconds}
                      onChange={(e) => {
                        const val = Math.max(5, parseInt(e.target.value) || 30);
                        handleApplyRapidSecondsToAll(val);
                      }}
                      className="w-24 bg-surface-alt/50 border border-amber-500/30 rounded-xl px-3 py-2 text-xs text-ink font-bold outline-none"
                    />
                    <div className="flex flex-wrap items-center gap-1">
                      {[15, 20, 30, 45, 60, 90].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleApplyRapidSecondsToAll(s)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            rapidTimeLimitSeconds === s
                              ? "bg-amber-600 text-white shadow-2xs"
                              : "bg-surface-alt/60 hover:bg-surface-alt border border-border text-ink"
                          }`}
                        >
                          {s}s
                        </button>
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] text-ink-soft block">
                    Candidates will have exactly {rapidTimeLimitSeconds} seconds per question in the Rapid Question Round.
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Proctoring & Security Rules */}
          <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-ink flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Proctoring &amp; Anti-Cheat Rules
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1">
                <div className="flex items-center gap-2 text-emerald-600 font-bold">
                  <Check className="w-3.5 h-3.5" />
                  <span>Full-Screen Enforcement Active</span>
                </div>
                <p className="text-[11px] text-ink-soft">
                  Candidates must enter full-screen mode to begin. Questions are locked if they attempt to exit full-screen.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-1">
                <div className="flex items-center gap-2 text-amber-600 font-bold">
                  <Check className="w-3.5 h-3.5" />
                  <span>Tab-Switch Detection (Max 3 Strikes)</span>
                </div>
                <p className="text-[11px] text-ink-soft">
                  Detects window blur and tab switching. On the 3rd infraction, the test is automatically submitted with violation flags.
                </p>
              </div>

              <div className="p-3 rounded-xl border border-border bg-surface-alt/40 space-y-1">
                <div className="flex items-center gap-2 text-ink font-bold">
                  <Check className="w-3.5 h-3.5 text-primary" />
                  <span>Copy/Paste &amp; Right-Click Disabled</span>
                </div>
                <p className="text-[11px] text-ink-soft">
                  Restricts copying question text, developer tools shortcuts, and context menu inspections.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Confirmation Bar */}
      <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-surface/95 backdrop-blur-md border border-border shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-bold text-ink">Stage Summary:</span>
          <span className="text-ink-soft">
            {questions.length} Questions · {durationMinutes} mins · {passingScore}% to pass
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenPreview}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-surface border border-border hover:bg-surface-alt text-ink font-semibold text-xs transition cursor-pointer shadow-xs"
          >
            <Eye className="w-3.5 h-3.5 text-purple-600" />
            <span>Preview Candidate Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-ink-soft" />
          </button>
          <Link
            href={`/recruiter/jobs?jobId=${jobId}&tab=timeline`}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSaveAndConfirm}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-brand text-white font-black text-xs shadow-md hover:opacity-95 transition cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>Confirm &amp; Save Stage Configuration</span>
          </button>
        </div>
      </div>

      {/* Manual Add Question Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface border border-border rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-4 my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-ink">Add Question to Stage Bank</h3>
                  <p className="text-[11px] text-ink-soft">Create a custom descriptive problem or multiple choice question</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowManualModal(false)}
                className="p-1.5 rounded-lg text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddManualQuestion} className="space-y-4 text-xs">
              {/* Type Switcher */}
              <div>
                <label className="text-[11px] font-bold text-ink-soft block mb-1.5">Section / Question Type</label>
                {isRapidRound ? (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                      <Zap className="w-4 h-4 fill-current" />
                      <span className="text-xs font-black">Rapid-Fire Speed Question</span>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300">
                      Dedicated Speed Round
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setManualType("mcq")}
                      className={`py-2 px-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        manualType === "mcq"
                          ? "bg-primary/10 border-primary text-primary shadow-2xs"
                          : "bg-surface-alt/40 border-border text-ink-soft hover:bg-surface-alt"
                      }`}
                    >
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>1. MCQ</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setManualType("descriptive")}
                      className={`py-2 px-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        manualType === "descriptive"
                          ? "bg-purple-500/10 border-purple-500 text-purple-600 dark:text-purple-300 shadow-2xs"
                          : "bg-surface-alt/40 border-border text-ink-soft hover:bg-surface-alt"
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>2. Descriptive</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setManualType("rapid")}
                      className={`py-2 px-2.5 rounded-xl border font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        manualType === "rapid"
                          ? "bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 shadow-2xs"
                          : "bg-surface-alt/40 border-border text-ink-soft hover:bg-surface-alt"
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                      <span>3. Rapid Round</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Rapid Countdown Config */}
              {manualType === "rapid" && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                    <Zap className="w-4 h-4 fill-current shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold">Speed Countdown Timer per Question</p>
                      <p className="text-[10px] text-ink-soft">Candidates must submit answer within this time window</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 self-start sm:self-auto">
                    <div className="flex items-center gap-1">
                      {[15, 20, 30, 45, 60].map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => setManualTimeLimitSeconds(sec)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold cursor-pointer transition ${
                            manualTimeLimitSeconds === sec
                              ? "bg-amber-600 text-white shadow-2xs"
                              : "bg-surface hover:bg-surface-alt border border-amber-500/30 text-ink"
                          }`}
                        >
                          {sec}s
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      min={5}
                      max={180}
                      value={manualTimeLimitSeconds}
                      onChange={(e) => setManualTimeLimitSeconds(parseInt(e.target.value) || 30)}
                      className="w-14 bg-surface border border-amber-500/30 rounded-lg px-1.5 py-1 text-xs text-ink font-bold text-center"
                    />
                    <span className="text-[11px] font-bold text-amber-700 dark:text-amber-300">sec</span>
                  </div>
                </div>
              )}

              {/* Question Statement */}
              <div>
                <label className="text-[11px] font-bold text-ink-soft block mb-1">
                  Question Prompt / Problem Statement *
                </label>
                <textarea
                  required
                  rows={3}
                  value={manualQuestion}
                  onChange={(e) => setManualQuestion(e.target.value)}
                  placeholder={
                    manualType === "descriptive"
                      ? isTechnicalTest
                        ? "e.g. Implement an LRU Cache with O(1) get and put operations in TypeScript or Python. Explain your time complexity."
                        : "e.g. A factory has two machines, X and Y... At what time will the batch finish? Show all working."
                      : manualType === "rapid"
                      ? isTechnicalTest
                        ? "e.g. In JavaScript, what is the output of typeof NaN? (Answer within 20s)"
                        : "e.g. What is 15% of 240? (Answer within 30 seconds)"
                      : isTechnicalTest
                      ? "e.g. Which HTTP status code represents 'Conflict'?"
                      : "e.g. If 15 workers complete a project in 12 days, how many days will 20 workers take?"
                  }
                  className="w-full bg-surface-alt/40 border border-border rounded-xl p-3 text-xs text-ink outline-none focus:border-primary placeholder:text-ink-soft/50 font-normal leading-relaxed"
                />
              </div>

              {/* Points & Difficulty */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-ink-soft block mb-1">Points</label>
                  <input
                    type="number"
                    min={1}
                    max={100}
                    value={manualPoints}
                    onChange={(e) => setManualPoints(parseInt(e.target.value) || 10)}
                    className="w-full bg-surface-alt/40 border border-border rounded-xl px-3 py-2 text-xs text-ink outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-ink-soft block mb-1">Difficulty</label>
                  <select
                    value={manualDifficulty}
                    onChange={(e) => setManualDifficulty(e.target.value as any)}
                    className="w-full bg-surface-alt/40 border border-border rounded-xl px-3 py-2 text-xs text-ink outline-none"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Conditional Inputs: Descriptive vs MCQ */}
              {manualType === "descriptive" ? (
                <div className="space-y-3 p-3.5 rounded-2xl bg-purple-500/5 border border-purple-500/20">
                  <div>
                    <label className="text-[11px] font-bold text-purple-700 dark:text-purple-300 block mb-1">
                      Model Solution / Key Steps *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={manualSampleAnswer}
                      onChange={(e) => setManualSampleAnswer(e.target.value)}
                      placeholder="Detail the complete mathematical working, intermediate equations, or deduction steps..."
                      className="w-full bg-surface border border-purple-500/20 rounded-xl p-3 text-xs text-ink outline-none focus:border-purple-500 placeholder:text-ink-soft/50 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-amber-700 dark:text-amber-300 block mb-1">
                      Grading Rubric / Criteria (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={manualRubric}
                      onChange={(e) => setManualRubric(e.target.value)}
                      placeholder="e.g. 50% for correct intermediate formula, 50% for final numerical answer."
                      className="w-full bg-surface border border-amber-500/20 rounded-xl p-3 text-xs text-ink outline-none focus:border-amber-500 placeholder:text-ink-soft/50"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 p-3.5 rounded-2xl bg-surface-alt/40 border border-border">
                  <label className="text-[11px] font-bold text-ink-soft block mb-1">
                    {manualType === "rapid"
                      ? "Rapid Question Options (Select the correct option radio button)"
                      : "Multiple Choice Options (Select the correct option radio button)"}
                  </label>
                  {manualOptions.map((opt, idx) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctOptionRadio"
                        checked={manualCorrectOptionId === opt.id}
                        onChange={() => setManualCorrectOptionId(opt.id)}
                        className="text-primary focus:ring-primary cursor-pointer"
                        title="Mark as correct answer"
                      />
                      <span className="w-5 text-center font-bold text-xs text-ink">{opt.id}.</span>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => {
                          const val = e.target.value;
                          setManualOptions((prev) =>
                            prev.map((o, i) => (i === idx ? { ...o, text: val } : o))
                          );
                        }}
                        placeholder={`Option ${opt.id} text...`}
                        className="flex-1 bg-surface border border-border rounded-xl px-3 py-1.5 text-xs text-ink outline-none focus:border-primary"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-soft hover:bg-surface-alt transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-xs transition cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Add Question to Bank</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View & Edit Role Blueprint Context (Title, Exp, Skills, JD, Responsibilities) */}
      {renderRoleBlueprintModal()}
    </div>
  );
}
