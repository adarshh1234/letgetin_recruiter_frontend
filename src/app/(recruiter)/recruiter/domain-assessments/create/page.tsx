"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Briefcase,
  Sliders,
  Settings2,
  Plus,
  X,
  Code2,
  Cpu,
  Shield,
  Database,
  Terminal,
  FileText,
  AlertCircle,
  Loader2,
  Layers,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { domainAssessmentService } from "@/features/domainAssessment/services/domainAssessmentService";
import {
  DOMAIN_OPTIONS,
  TESTING_MODE_CARDS,
  DIFFICULTY_LEVELS,
  TIME_LIMIT_OPTIONS,
  ALL_SKILL_TAGS,
} from "@/features/domainAssessment/constants";
import { AssessmentDifficulty, TestingMode } from "@/features/domainAssessment/types";
import { apiClient } from "@/shared/services/apiClient";

export default function CreateDomainAssessmentPage() {
  const router = useRouter();

  // Job selection state
  const [existingJobs, setExistingJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [loadingJobs, setLoadingJobs] = useState(false);

  // Configuration Mode: 'ai' | 'manual'
  const [configMode, setConfigMode] = useState<"ai" | "manual">("ai");

  // Core Assessment State
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [domain, setDomain] = useState<string>("fullstack");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    "Programming",
    "Software Architecture",
    "Databases",
  ]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [difficulty, setDifficulty] = useState<AssessmentDifficulty>("mid");
  const [timeLimit, setTimeLimit] = useState<number>(60);
  const [selectedModes, setSelectedModes] = useState<TestingMode[]>([
    "coding",
    "architecture",
    "system",
  ]);

  // AI Configuration Details
  const [aiSummary, setAiSummary] = useState<{
    summary: string;
    rounds: TestingMode[];
    skills: string[];
    difficulty: AssessmentDifficulty;
    timeLimit: number;
  } | null>(null);

  // Options
  const [allowCompilation, setAllowCompilation] = useState(true);
  const [enableAiHints, setEnableAiHints] = useState(true);
  const [recordScreen, setRecordScreen] = useState(false);
  const [autoEvaluateRubrics, setAutoEvaluateRubrics] = useState(true);
  const [customInstructions, setCustomInstructions] = useState("");

  // Loading flags
  const [isAutoConfiguring, setIsAutoConfiguring] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch recruiter's existing jobs (from /jobs/mine, fallback to /jobs)
  useEffect(() => {
    async function loadJobs() {
      try {
        setLoadingJobs(true);
        let list: any[] = [];
        try {
          const res: any = await apiClient.get("/jobs/mine");
          const extracted = res.data?.jobs || (Array.isArray(res.data) ? res.data : []) || res.jobs || [];
          if (Array.isArray(extracted) && extracted.length > 0) {
            list = extracted;
          }
        } catch {
          // Fallback to /jobs
        }

        if (list.length === 0) {
          try {
            const resAll: any = await apiClient.get("/jobs");
            const extracted = resAll.data?.jobs || (Array.isArray(resAll.data) ? resAll.data : []) || resAll.jobs || [];
            if (Array.isArray(extracted) && extracted.length > 0) {
              list = extracted;
            }
          } catch (e) {
            console.warn("Could not fetch jobs:", e);
          }
        }

        setExistingJobs(list);
      } finally {
        setLoadingJobs(false);
      }
    }
    loadJobs();
  }, []);

  // When recruiter selects an existing job
  const handleJobSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const jId = e.target.value;
    setSelectedJobId(jId);
    if (!jId) {
      setSelectedJob(null);
      return;
    }

    const matched = existingJobs.find((j) => (j._id || j.id) === jId);
    if (matched) {
      setSelectedJob(matched);
      setJobTitle(matched.title || "");

      // Compile rich JD combining description, requirements, responsibilities
      let fullJd = matched.description || matched.summary || "";
      if (Array.isArray(matched.responsibilities) && matched.responsibilities.length > 0) {
        fullJd += "\n\nKey Responsibilities:\n" + matched.responsibilities.map((r: string) => `• ${r}`).join("\n");
      }
      if (Array.isArray(matched.requirements) && matched.requirements.length > 0) {
        fullJd += "\n\nTechnical Requirements:\n" + matched.requirements.map((r: string) => `• ${r}`).join("\n");
      }
      setJobDescription(fullJd.trim());

      // If job has defined skills, pre-populate
      if (Array.isArray(matched.skills) && matched.skills.length > 0) {
        setSelectedSkills(matched.skills);
      }

      toast.info(`Loaded JD from "${matched.title}"`);
    }
  };

  // AI Auto-Configure: Analyzes JD to automatically select rounds and skills
  const handleAutoConfigure = async () => {
    if (!jobDescription.trim() && !jobTitle.trim()) {
      toast.error("Please select an existing job or enter a Job Title & Description first.");
      return;
    }

    try {
      setIsAutoConfiguring(true);
      const res = await domainAssessmentService.autoConfigure({
        jobTitle,
        jobDescription,
        domain,
      });

      if (res) {
        if (res.domain) setDomain(res.domain);
        if (res.skillAreas && res.skillAreas.length > 0) {
          setSelectedSkills(res.skillAreas);
        }
        if (res.difficulty) setDifficulty(res.difficulty);
        if (res.timeLimitMinutes) setTimeLimit(res.timeLimitMinutes);
        if (res.testingModes && res.testingModes.length > 0) {
          setSelectedModes(res.testingModes);
        }
        if (res.customInstructions) setCustomInstructions(res.customInstructions);

        // Store AI summary for visual banner
        setAiSummary({
          summary: res.summary || "Rounds and skills selected to match role requirements.",
          rounds: res.testingModes || ["coding", "architecture", "system"],
          skills: res.skillAreas || selectedSkills,
          difficulty: res.difficulty || "mid",
          timeLimit: res.timeLimitMinutes || 60,
        });

        setConfigMode("ai");

        toast.success("AI Auto-Configured Assessment!", {
          description: `Selected ${res.testingModes?.length || 3} rounds and ${res.skillAreas?.length || 5} skill sets from JD.`,
        });
      }
    } catch (err: any) {
      toast.error("AI auto-configuration failed. You can configure manually below.");
    } finally {
      setIsAutoConfiguring(false);
    }
  };

  // Toggle skill tag
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Add custom skill
  const handleAddCustomSkill = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && customSkillInput.trim()) {
      e.preventDefault();
      const trimmed = customSkillInput.trim();
      if (!selectedSkills.includes(trimmed)) {
        setSelectedSkills([...selectedSkills, trimmed]);
      }
      setCustomSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter((s) => s !== skill));
  };

  // Toggle testing mode / assessment round
  const toggleMode = (modeId: TestingMode) => {
    if (selectedModes.includes(modeId)) {
      if (selectedModes.length === 1) {
        toast.error("Please keep at least one assessment round active.");
        return;
      }
      setSelectedModes(selectedModes.filter((m) => m !== modeId));
    } else {
      setSelectedModes([...selectedModes, modeId]);
    }
  };

  // Map difficulty slider
  const sliderDifficultyVal =
    DIFFICULTY_LEVELS.find((d) => d.value === difficulty)?.sliderValue || 3;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    const matched = DIFFICULTY_LEVELS.find((d) => d.sliderValue === val);
    if (matched) setDifficulty(matched.value);
  };

  // Submit & Save Draft
  const handleSaveDraft = async () => {
    if (!jobTitle.trim()) {
      toast.error("Please enter a role or assessment title.");
      return;
    }

    try {
      setIsSubmitting(true);
      const title = `${jobTitle.trim()} Domain Assessment`;
      const assessment = await domainAssessmentService.createAssessment({
        title,
        role: jobTitle.trim(),
        jobId: selectedJobId || undefined,
        jobTitle: jobTitle.trim(),
        jobDescription: jobDescription || "Domain specific skills assessment",
        domain,
        skillAreas: selectedSkills,
        difficulty,
        timeLimitMinutes: timeLimit,
        testingModes: selectedModes,
        options: {
          allowCodeCompilation: allowCompilation,
          enableAiHints: enableAiHints,
          recordScreen: recordScreen,
          autoEvaluateRubrics: autoEvaluateRubrics,
        },
        customInstructions,
        status: "draft",
        questions: [],
      });

      toast.success("Assessment draft saved successfully!");
      router.push(`/recruiter/domain-assessments/${assessment.id || assessment.assessmentId}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to create assessment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate Questions & Proceed to Question Management Studio
  const handleGenerateQuestions = async () => {
    if (!jobTitle.trim()) {
      toast.error("Please enter a role or assessment title.");
      return;
    }
    if (selectedSkills.length === 0) {
      toast.error("Please select or add at least one skill area.");
      return;
    }
    if (selectedModes.length === 0) {
      toast.error("Please select at least one assessment round.");
      return;
    }

    try {
      setIsSubmitting(true);
      toast.loading("Generating domain assessment questions with AI...", { id: "gen-q" });

      // 1. Generate questions tailored to the selected rounds & skills
      const questions = await domainAssessmentService.generateQuestions({
        domain,
        role: jobTitle,
        skillAreas: selectedSkills,
        difficulty,
        testingModes: selectedModes,
        count: Math.max(selectedModes.length * 2, 4),
        jobDescription,
        customInstructions,
      });

      // 2. Create assessment with questions
      const title = `${jobTitle.trim()} Domain Assessment`;
      const assessment = await domainAssessmentService.createAssessment({
        title,
        role: jobTitle.trim(),
        jobId: selectedJobId || undefined,
        jobTitle: jobTitle.trim(),
        jobDescription: jobDescription || "Domain specific skills assessment",
        domain,
        skillAreas: selectedSkills,
        difficulty,
        timeLimitMinutes: timeLimit,
        testingModes: selectedModes,
        options: {
          allowCodeCompilation: allowCompilation,
          enableAiHints: enableAiHints,
          recordScreen: recordScreen,
          autoEvaluateRubrics: autoEvaluateRubrics,
        },
        customInstructions,
        status: "ready",
        questions,
      });

      toast.dismiss("gen-q");
      toast.success("Questions generated successfully! Review & edit in the Question Studio.");
      router.push(`/recruiter/domain-assessments/${assessment.id || assessment.assessmentId}/questions`);
    } catch (err: any) {
      toast.dismiss("gen-q");
      toast.error(err.response?.data?.message || "Failed to generate assessment questions");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-alt/20 p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-3">
            <Link
              href="/recruiter/domain-assessments"
              className="p-2 rounded-xl bg-surface border border-border hover:bg-surface-alt transition text-ink-soft hover:text-ink"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-ink flex items-center gap-2">
                <span>Create Domain Specific Assessment</span>
                <span className="text-[10px] bg-primary/20 text-primary-glow px-2.5 py-0.5 rounded-full font-bold uppercase">
                  Standalone Module
                </span>
              </h1>
              <p className="text-xs md:text-sm text-ink-soft mt-0.5">
                Select an existing job or enter a custom role, configure rounds & skills via AI or manually, and generate candidate questions.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="px-4 py-2.5 bg-surface border border-border hover:bg-surface-alt text-xs font-bold rounded-xl transition text-ink cursor-pointer"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={handleGenerateQuestions}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-brand text-primary-foreground text-xs font-bold rounded-xl shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>Generate Questions & Proceed →</span>
          </button>
        </div>
      </div>

      {/* Step 1: Select Existing Job or Input JD */}
      <div className="bg-surface rounded-2xl p-6 border border-border/80 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary-glow flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h2 className="text-base font-bold text-ink">Job & Description Selection</h2>
              <p className="text-xs text-ink-soft">
                Choose an existing job from your database or enter a role and job description.
              </p>
            </div>
          </div>

          {/* Mode Switch Pills */}
          <div className="flex items-center bg-surface-alt/60 p-1 rounded-xl border border-border text-xs">
            <button
              type="button"
              onClick={() => setConfigMode("ai")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                configMode === "ai"
                  ? "bg-primary text-white shadow-sm"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Configure</span>
            </button>
            <button
              type="button"
              onClick={() => setConfigMode("manual")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                configMode === "manual"
                  ? "bg-primary text-white shadow-sm"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Manual Configure</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Select Existing Job */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-ink-soft block">
              Select Existing Job (From Current Jobs)
            </label>
            <select
              value={selectedJobId}
              onChange={handleJobSelect}
              disabled={loadingJobs}
              className="w-full px-3.5 py-2.5 bg-surface-alt/40 border border-border rounded-xl text-xs md:text-sm text-ink focus:outline-none focus:border-primary transition"
            >
              <option value="">-- Choose from existing posted jobs --</option>
              {existingJobs.map((j) => (
                <option key={j._id || j.id} value={j._id || j.id}>
                  {j.title} {j.company?.name ? `• ${j.company.name}` : ""}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-ink-soft">
              Selecting a job automatically imports its title, responsibilities, and requirements.
            </p>
          </div>

          {/* Role / Job Title */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-ink-soft block">
              Assessment Role Title *
            </label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Senior Full Stack Engineer, Cloud Architect, Backend Lead..."
              className="w-full px-3.5 py-2.5 bg-surface-alt/40 border border-border rounded-xl text-xs md:text-sm text-ink focus:outline-none focus:border-primary transition font-medium"
            />
            <p className="text-[11px] text-ink-soft">
              Title used to brand the assessment and candidate scorecard.
            </p>
          </div>
        </div>

        {/* Job Description Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-ink-soft block">
              Job Description & Skill Requirements
            </label>
            {selectedJob && (
              <span className="text-[11px] text-emerald-500 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Imported from {selectedJob.title}</span>
              </span>
            )}
          </div>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={5}
            placeholder="Paste your job description, required technical competencies, framework versions, and architectural expectations here..."
            className="w-full px-3.5 py-2.5 bg-surface-alt/40 border border-border rounded-xl text-xs md:text-sm text-ink focus:outline-none focus:border-primary transition resize-y font-sans leading-relaxed"
          />
        </div>

        {/* Action Bar for AI vs Manual Configure */}
        <div className="p-4 rounded-xl bg-surface-alt/40 border border-border/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-ink flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span>AI Auto-Configure with Google Gemini</span>
            </div>
            <p className="text-xs text-ink-soft">
              AI reads the Job Description above and automatically selects the assessment rounds and technical skill sets.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleAutoConfigure}
              disabled={isAutoConfiguring}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 text-xs font-bold transition shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isAutoConfiguring ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Wand2 className="w-3.5 h-3.5" />
              )}
              <span>AI Configure Rounds & Skills</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setConfigMode("manual");
                toast.info("Switched to manual configuration mode.");
              }}
              className="px-4 py-2.5 rounded-xl bg-surface border border-border hover:bg-surface-alt text-xs font-bold text-ink transition cursor-pointer"
            >
              Manual Configure
            </button>
          </div>
        </div>

        {/* AI Configuration Applied Banner */}
        {aiSummary && (
          <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-3 animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>AI Configuration Applied from Job Description</span>
              </div>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300">
                {aiSummary.rounds.length} Rounds • {aiSummary.skills.length} Skills
              </span>
            </div>

            <p className="text-xs text-ink/80 leading-relaxed">
              {aiSummary.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
              <div className="bg-surface/80 p-3 rounded-xl border border-purple-500/20">
                <div className="font-bold text-ink mb-1.5 flex items-center gap-1.5">
                  <span>Selected Assessment Rounds:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {aiSummary.rounds.map((r) => {
                    const matchedCard = TESTING_MODE_CARDS.find((c) => c.id === r);
                    return (
                      <span
                        key={r}
                        className="px-2.5 py-1 rounded-lg bg-surface-alt font-semibold text-ink text-[11px] border border-border"
                      >
                        {matchedCard ? `${matchedCard.icon} ${matchedCard.title}` : r}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="bg-surface/80 p-3 rounded-xl border border-purple-500/20">
                <div className="font-bold text-ink mb-1.5 flex items-center gap-1.5">
                  <span>Extracted Technical Skill Sets:</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {aiSummary.skills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary-glow font-semibold text-[11px] border border-primary/20"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-ink-soft italic">
              Tip: You can freely adjust or fine-tune any round or skill below before generating questions.
            </p>
          </div>
        )}
      </div>

      {/* Step 2: Assessment Rounds & Skill Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel: Parameters & Skills */}
        <div className="lg:col-span-5 bg-surface rounded-2xl p-6 border border-border/80 shadow-sm space-y-6">
          <div className="border-b border-border/60 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-base font-bold text-ink">
              <span className="text-lg">⚙️</span>
              <h2>Test Parameters & Skills</h2>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-surface-alt text-ink-soft">
              {configMode === "ai" ? "AI Assisted" : "Manual Mode"}
            </span>
          </div>

          {/* Domain Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-ink-soft block">
              Primary Technical Domain
            </label>
            <select
              value={domain}
              onChange={(e) => {
                const nextDomain = e.target.value;
                setDomain(nextDomain);
                const matched = DOMAIN_OPTIONS.find((d) => d.value === nextDomain);
                if (matched && !aiSummary) {
                  setSelectedSkills(matched.defaultSkills);
                }
              }}
              className="w-full px-3.5 py-2.5 bg-surface-alt/40 border border-border rounded-xl text-xs md:text-sm text-ink focus:outline-none focus:border-primary transition capitalize font-medium"
            >
              {DOMAIN_OPTIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* Skill Areas */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                Skill Sets to Test ({selectedSkills.length})
              </label>
              <span className="text-[11px] text-primary-glow font-bold">
                {selectedSkills.length} selected
              </span>
            </div>

            {/* Currently Selected Skills with remove badges */}
            <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-surface-alt/30 border border-border min-h-[50px] items-center">
              {selectedSkills.length === 0 ? (
                <span className="text-xs text-ink-soft">No skills selected yet. Click skills below or type custom ones.</span>
              ) : (
                selectedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-white shadow-xs"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="hover:opacity-75 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              )}
            </div>

            {/* Common Skill Tags to click */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-ink-soft font-semibold block">Click to toggle common skills:</span>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                {ALL_SKILL_TAGS.map((skill) => {
                  const active = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer border ${
                        active
                          ? "bg-primary/10 text-primary-glow border-primary/30 font-bold"
                          : "bg-surface-alt/50 border-border text-ink-soft hover:text-ink hover:border-primary/40"
                      }`}
                    >
                      {active ? `✓ ${skill}` : `+ ${skill}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Skill Input */}
            <div className="pt-1">
              <input
                type="text"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={handleAddCustomSkill}
                placeholder="+ Type custom skill and hit Enter..."
                className="w-full px-3 py-2 bg-surface-alt/40 border border-dashed border-border rounded-xl text-xs text-ink focus:outline-none focus:border-primary transition"
              />
            </div>
          </div>

          {/* Difficulty Level Slider */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                Difficulty Level
              </label>
              <span className="text-xs font-bold text-primary-glow capitalize">
                {difficulty}
              </span>
            </div>

            <div className="space-y-2">
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={sliderDifficultyVal}
                onChange={handleSliderChange}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-500 accent-primary"
              />
              <div className="flex justify-between text-[11px] font-semibold text-ink-soft">
                {DIFFICULTY_LEVELS.map((d) => (
                  <span
                    key={d.value}
                    className={`cursor-pointer ${
                      difficulty === d.value ? "text-primary-glow font-bold" : ""
                    }`}
                    onClick={() => setDifficulty(d.value)}
                  >
                    {d.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Time Limit Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-ink-soft block">
              Test Duration (Time Limit)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {TIME_LIMIT_OPTIONS.map((opt) => {
                const active = timeLimit === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setTimeLimit(opt.value)}
                    className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                      active
                        ? "bg-primary text-white border-primary shadow-sm font-bold"
                        : "bg-surface-alt/40 border-border text-ink hover:border-primary/50"
                    }`}
                  >
                    <div className="text-xs font-bold">{opt.label}</div>
                    <div
                      className={`text-[10px] mt-0.5 ${
                        active ? "text-white/80" : "text-ink-soft"
                      }`}
                    >
                      {opt.tier}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Candidate Options Checklist */}
          <div className="space-y-2.5 pt-2 border-t border-border/60">
            <label className="text-xs font-bold uppercase tracking-wider text-ink-soft block">
              Assessment Experience Options
            </label>
            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer text-ink font-medium">
                <input
                  type="checkbox"
                  checked={allowCompilation}
                  onChange={(e) => setAllowCompilation(e.target.checked)}
                  className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                />
                <span>Allow code compilation & test case running</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-ink font-medium">
                <input
                  type="checkbox"
                  checked={enableAiHints}
                  onChange={(e) => setEnableAiHints(e.target.checked)}
                  className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                />
                <span>Enable AI-powered contextual hints</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-ink font-medium">
                <input
                  type="checkbox"
                  checked={recordScreen}
                  onChange={(e) => setRecordScreen(e.target.checked)}
                  className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                />
                <span>Proctoring (record screen & keystrokes)</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-ink font-medium">
                <input
                  type="checkbox"
                  checked={autoEvaluateRubrics}
                  onChange={(e) => setAutoEvaluateRubrics(e.target.checked)}
                  className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                />
                <span>Automated AI evaluation against rubric criteria</span>
              </label>
            </div>
          </div>

          {/* Custom Instructions */}
          <div className="space-y-2 pt-2 border-t border-border/60">
            <label className="text-xs font-bold uppercase tracking-wider text-ink-soft block">
              Custom Candidate Instructions (Optional)
            </label>
            <textarea
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              rows={2}
              placeholder="e.g. Focus on clean code, handle edge cases, and describe your architectural trade-offs..."
              className="w-full px-3 py-2 bg-surface-alt/40 border border-border rounded-xl text-xs text-ink focus:outline-none focus:border-primary transition resize-y font-sans"
            />
          </div>
        </div>

        {/* Right Panel: Assessment Rounds (Testing Modes) */}
        <div className="lg:col-span-7 bg-surface rounded-2xl p-6 border border-border/80 shadow-sm space-y-6">
          <div className="border-b border-border/60 pb-3 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-base font-bold text-ink">
                <span className="text-lg">🧪</span>
                <h2>Assessment Rounds / Evaluation Modes</h2>
              </div>
              <p className="text-xs text-ink-soft mt-1">
                Select the rounds that candidates will complete. AI can auto-select these from the JD or you can toggle manually.
              </p>
            </div>

            <span className="text-xs font-bold text-primary-glow bg-primary/10 px-2.5 py-1 rounded-full">
              {selectedModes.length} Selected
            </span>
          </div>

          {/* Interactive Rounds Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TESTING_MODE_CARDS.map((card) => {
              const isSelected = selectedModes.includes(card.id);
              return (
                <div
                  key={card.id}
                  onClick={() => toggleMode(card.id)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between group ${
                    isSelected
                      ? "border-primary bg-primary/[0.04] shadow-md shadow-primary/5"
                      : "border-border/80 hover:border-primary/50 bg-surface"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="w-10 h-10 rounded-xl bg-surface-alt flex items-center justify-center text-xl shadow-sm">
                        {card.icon}
                      </div>

                      <span
                        className="text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: card.badgeBg,
                          color: card.badgeColor,
                        }}
                      >
                        {card.badge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-ink group-hover:text-primary-glow transition">
                        {card.title}
                      </h3>
                      <p className="text-xs text-ink-soft mt-1 leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 mt-3 border-t border-border/60 flex items-center justify-between text-xs font-bold text-primary-glow">
                    <span className="flex items-center gap-1.5">
                      {isSelected ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                          <span>Included in Test</span>
                        </>
                      ) : (
                        <span className="text-ink-soft font-normal">+ Click to Add Round</span>
                      )}
                    </span>
                    <span className="text-base group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ready to Generate Questions Bar */}
          <div className="p-4 rounded-xl bg-surface-alt/40 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-1">
              <div className="font-bold text-ink flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Ready to Generate Assessment</span>
              </div>
              <p className="text-ink-soft">
                Will generate real questions across {selectedModes.length} rounds ({selectedModes.join(", ")}) and {selectedSkills.length} skills with {timeLimit} min timer.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGenerateQuestions}
              disabled={isSubmitting}
              className="px-4 py-2.5 bg-gradient-brand text-primary-foreground font-bold rounded-xl shadow-glow hover:scale-105 transition shrink-0 flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5" />
              )}
              <span>Generate Questions with AI →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
