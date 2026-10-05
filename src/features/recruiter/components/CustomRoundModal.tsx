"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Clock,
  Calendar,
  Check,
  FileQuestion,
  Users,
  Code,
  Shield,
  Database,
  Cpu,
  Sparkles,
  HelpCircle,
  FileCode2,
} from "lucide-react";
import {
  RoundScheduleSelector,
  RoundSchedule,
  calculateRoundHours,
} from "./RoundScheduleSelector";

export type CustomRoundCategory = "test" | "interview" | "domain";

export interface CustomCandidateRound {
  id: string;
  category: CustomRoundCategory;
  name: string;
  description: string;
  schedule: RoundSchedule;
  durationMinutes: number;
  enabled: boolean;
  // Test category fields
  questionCount?: number;
  passingScore?: number;
  testFormat?: "mcq" | "short_answer" | "numerical" | "mixed";
  // Interview category fields
  interviewType?:
    | "behavioral"
    | "technical"
    | "managerial"
    | "culture_fit"
    | "executive"
    | "system_design"
    | "peer_panel"
    | "hr";
  interviewerRole?: "ai_interviewer" | "hiring_team" | "hybrid";
  // Domain category fields
  domainArea?: string;
  testingMode?:
    | "coding"
    | "architecture"
    | "system"
    | "debugging"
    | "database"
    | "security"
    | "project_submission";
  instructions?: string;
}

interface CustomRoundModalProps {
  isOpen: boolean;
  category: CustomRoundCategory | null;
  initialData?: CustomCandidateRound | null;
  onClose: () => void;
  onSave: (round: CustomCandidateRound) => void;
}

const PRESETS: Record<CustomRoundCategory, string[]> = {
  test: [
    "Cognitive Ability Test",
    "English & Verbal Proficiency Assessment",
    "Quantitative & Logical Reasoning Quiz",
    "Product & Analytical Aptitude Test",
  ],
  interview: [
    "Hiring Manager Interview",
    "System Architecture & Design Round",
    "Culture Fit & Values Discussion",
    "Executive / Leadership Interview",
    "Peer Panel / Team Chemistry Round",
  ],
  domain: [
    "Take-Home Architecture Assignment",
    "Live Full-Stack Debugging Challenge",
    "Database Schema & Query Optimization",
    "Security Audit & Threat Modeling Round",
    "Frontend Component Implementation Challenge",
  ],
};

const DOMAIN_AREAS = [
  "Fullstack",
  "Frontend",
  "Backend",
  "System Architecture",
  "Databases & Data Engineering",
  "Cloud & DevOps",
  "Security & Infrastructure",
  "Mobile (iOS/Android)",
  "Machine Learning & AI",
];

export function CustomRoundModal({
  isOpen,
  category,
  initialData,
  onClose,
  onSave,
}: CustomRoundModalProps) {
  if (!isOpen || !category) return null;

  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [durationMinutes, setDurationMinutes] = useState(initialData?.durationMinutes || 45);
  const [schedule, setSchedule] = useState<RoundSchedule>(
    initialData?.schedule || {
      date: "",
      startTime: "10:00",
      endTime: "10:45",
    }
  );

  // Test specifics
  const [testFormat, setTestFormat] = useState<"mcq" | "short_answer" | "numerical" | "mixed">(
    initialData?.testFormat || "mcq"
  );
  const [questionCount, setQuestionCount] = useState(initialData?.questionCount || 15);
  const [passingScore, setPassingScore] = useState(initialData?.passingScore || 70);

  // Interview specifics
  const [interviewType, setInterviewType] = useState<
    "behavioral" | "technical" | "managerial" | "culture_fit" | "executive" | "system_design" | "peer_panel" | "hr"
  >(initialData?.interviewType || "managerial");
  const [interviewerRole, setInterviewerRole] = useState<"ai_interviewer" | "hiring_team" | "hybrid">(
    initialData?.interviewerRole || "ai_interviewer"
  );

  // Domain specifics
  const [domainArea, setDomainArea] = useState(initialData?.domainArea || "Fullstack");
  const [testingMode, setTestingMode] = useState<
    "coding" | "architecture" | "system" | "debugging" | "database" | "security" | "project_submission"
  >(initialData?.testingMode || "coding");
  const [instructions, setInstructions] = useState(initialData?.instructions || "");

  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens or initialData changes
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description || "");
      setDurationMinutes(initialData.durationMinutes || 45);
      setSchedule(initialData.schedule || { date: "", startTime: "10:00", endTime: "10:45" });
      if (initialData.testFormat) setTestFormat(initialData.testFormat);
      if (initialData.questionCount) setQuestionCount(initialData.questionCount);
      if (initialData.passingScore) setPassingScore(initialData.passingScore);
      if (initialData.interviewType) setInterviewType(initialData.interviewType);
      if (initialData.interviewerRole) setInterviewerRole(initialData.interviewerRole);
      if (initialData.domainArea) setDomainArea(initialData.domainArea);
      if (initialData.testingMode) setTestingMode(initialData.testingMode);
      if (initialData.instructions) setInstructions(initialData.instructions);
    } else {
      setName("");
      setDescription("");
      setDurationMinutes(category === "interview" ? 30 : 45);
      setSchedule({ date: "", startTime: "10:00", endTime: "10:45" });
      setTestFormat("mcq");
      setQuestionCount(15);
      setPassingScore(70);
      setInterviewType(category === "interview" ? "managerial" : "behavioral");
      setInterviewerRole("ai_interviewer");
      setDomainArea("Fullstack");
      setTestingMode("coding");
      setInstructions("");
    }
    setError(null);
  }, [initialData, category, isOpen]);

  const handlePresetSelect = (presetName: string) => {
    setName(presetName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter a name for this custom round.");
      return;
    }

    const roundId = initialData?.id || `custom_${category}_${Date.now()}`;
    const roundData: CustomCandidateRound = {
      id: roundId,
      category,
      name: name.trim(),
      description: description.trim(),
      schedule,
      durationMinutes: Math.max(10, durationMinutes),
      enabled: initialData ? initialData.enabled : true,
    };

    if (category === "test") {
      roundData.testFormat = testFormat;
      roundData.questionCount = questionCount;
      roundData.passingScore = passingScore;
    } else if (category === "interview") {
      roundData.interviewType = interviewType;
      roundData.interviewerRole = interviewerRole;
    } else if (category === "domain") {
      roundData.domainArea = domainArea;
      roundData.testingMode = testingMode;
      roundData.passingScore = passingScore;
      roundData.instructions = instructions.trim();
    }

    onSave(roundData);
    onClose();
  };

  const getHeaderInfo = () => {
    switch (category) {
      case "test":
        return {
          title: initialData ? "Edit Custom Test Round" : "Add Custom Test Round",
          badge: "Online Test",
          icon: <FileQuestion className="w-5 h-5 text-primary-glow" />,
          desc: "Create an online aptitude, cognitive, or customized evaluation test round.",
        };
      case "interview":
        return {
          title: initialData ? "Edit Custom Interview Round" : "Add Custom Interview Round",
          badge: "Interview Stage",
          icon: <Users className="w-5 h-5 text-indigo-500" />,
          desc: "Add a managerial, system architecture, or specialized candidate interview round.",
        };
      case "domain":
        return {
          title: initialData ? "Edit Custom Domain Specific Round" : "Add Custom Domain Specific Round",
          badge: "Domain Assessment",
          icon: <Code className="w-5 h-5 text-emerald-500" />,
          desc: "Configure a specialized hands-on challenge, take-home project, or architectural evaluation.",
        };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col bg-surface border border-border rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-border bg-surface-alt/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center border border-border shadow-xs">
              {headerInfo.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-ink">{headerInfo.title}</h3>
                <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full">
                  {headerInfo.badge}
                </span>
              </div>
              <p className="text-xs text-ink-soft mt-0.5">{headerInfo.desc}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold">
              {error}
            </div>
          )}

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-ink-soft block">
              Quick Suggestions / Presets
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PRESETS[category].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium transition cursor-pointer ${
                    name === preset
                      ? "bg-primary text-white border-primary shadow-xs font-bold"
                      : "bg-surface-alt/60 border-border text-ink hover:border-primary/40 hover:text-primary-glow"
                  }`}
                >
                  + {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Round Name */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-ink-soft block">
              Round Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Hiring Manager Interview, Cognitive Ability Test, System Design Take-Home..."
              className="w-full px-3.5 py-2.5 bg-surface-alt/40 border border-border rounded-xl text-xs md:text-sm text-ink focus:outline-none focus:border-primary transition font-medium"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-ink-soft block">
              Round Purpose & Focus
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Brief description of what competencies, traits, or deliverables are evaluated in this round..."
              className="w-full px-3 py-2 bg-surface-alt/40 border border-border rounded-xl text-xs text-ink focus:outline-none focus:border-primary transition resize-y"
            />
          </div>

          {/* Category-specific options */}
          {category === "test" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-surface-alt/30 border border-border">
              <div>
                <label className="text-[11px] font-semibold text-ink-soft block mb-1">Test Format</label>
                <select
                  value={testFormat}
                  onChange={(e) => setTestFormat(e.target.value as any)}
                  className="w-full px-2.5 py-2 bg-surface border border-border rounded-lg text-xs text-ink"
                >
                  <option value="mcq">Multiple Choice (MCQ)</option>
                  <option value="short_answer">Short Answer</option>
                  <option value="numerical">Quantitative / Numerical</option>
                  <option value="mixed">Mixed Format</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-ink-soft block mb-1">Questions</label>
                <input
                  type="number"
                  min={5}
                  max={60}
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Math.max(5, parseInt(e.target.value) || 5))}
                  className="w-full px-2.5 py-2 bg-surface border border-border rounded-lg text-xs text-ink"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-ink-soft block mb-1">Passing Score (%)</label>
                <input
                  type="number"
                  min={40}
                  max={100}
                  value={passingScore}
                  onChange={(e) => setPassingScore(Math.max(40, parseInt(e.target.value) || 40))}
                  className="w-full px-2.5 py-2 bg-surface border border-border rounded-lg text-xs text-ink"
                />
              </div>
            </div>
          )}

          {category === "interview" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-surface-alt/30 border border-border">
              <div>
                <label className="text-[11px] font-semibold text-ink-soft block mb-1">Interview Type</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value as any)}
                  className="w-full px-2.5 py-2 bg-surface border border-border rounded-lg text-xs text-ink"
                >
                  <option value="managerial">Managerial & Leadership</option>
                  <option value="system_design">System Design & Architecture</option>
                  <option value="technical">Specialized Technical</option>
                  <option value="culture_fit">Culture Fit & Values</option>
                  <option value="executive">Executive / Founder Round</option>
                  <option value="peer_panel">Peer Panel / Team Chemistry</option>
                  <option value="hr">HR & Compensation</option>
                  <option value="behavioral">Behavioral Evaluation</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-ink-soft block mb-1">Interviewer Mode</label>
                <select
                  value={interviewerRole}
                  onChange={(e) => setInterviewerRole(e.target.value as any)}
                  className="w-full px-2.5 py-2 bg-surface border border-border rounded-lg text-xs text-ink"
                >
                  <option value="ai_interviewer">AI Video Interviewer</option>
                  <option value="hiring_team">Hiring Team / Panel (Human)</option>
                  <option value="hybrid">Hybrid (AI Co-pilot + Human)</option>
                </select>
              </div>
            </div>
          )}

          {category === "domain" && (
            <div className="space-y-3 p-3.5 rounded-xl bg-surface-alt/30 border border-border">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-ink-soft block mb-1">Technical Domain Area</label>
                  <select
                    value={domainArea}
                    onChange={(e) => setDomainArea(e.target.value)}
                    className="w-full px-2.5 py-2 bg-surface border border-border rounded-lg text-xs text-ink capitalize"
                  >
                    {DOMAIN_AREAS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-ink-soft block mb-1">Evaluation Mode</label>
                  <select
                    value={testingMode}
                    onChange={(e) => setTestingMode(e.target.value as any)}
                    className="w-full px-2.5 py-2 bg-surface border border-border rounded-lg text-xs text-ink"
                  >
                    <option value="coding">Live Coding & Algorithms</option>
                    <option value="architecture">Software Architecture Scenario</option>
                    <option value="system">Distributed System Design</option>
                    <option value="debugging">Bug Fix & Refactoring Challenge</option>
                    <option value="database">Database Schema & Query Challenge</option>
                    <option value="security">Security Audit & Mitigation</option>
                    <option value="project_submission">Project / Take-Home Submission</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-ink-soft block mb-1">
                  Candidate Instructions / Problem Statement (Optional)
                </label>
                <textarea
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  rows={2}
                  placeholder="e.g. Design a multi-region caching layer handling 100K RPS. Detail eviction policies and resilience trade-offs..."
                  className="w-full px-3 py-2 bg-surface border border-border rounded-lg text-xs text-ink resize-y"
                />
              </div>
            </div>
          )}

          {/* Schedule Timing (Date, Start Time, End Time & Calculated Hours) */}
          <div className="pt-2 border-t border-border">
            <RoundScheduleSelector
              label={`${headerInfo.badge} Schedule & Timing`}
              schedule={schedule}
              onChange={setSchedule}
              onDurationChange={(mins) => setDurationMinutes(mins)}
              description="Specify the scheduled round date and time window. The total duration in hours is calculated automatically."
            />
          </div>

          {/* Session Duration & Credits Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-2 text-ink">
              <Clock className="w-4 h-4 text-primary-glow" />
              <span className="font-semibold text-xs">Duration: {durationMinutes} mins</span>
            </div>
            <span className="text-[11px] font-bold text-primary-glow bg-primary/10 px-2.5 py-0.5 rounded-full">
              10 credits upon publishing
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface border border-border hover:bg-surface-alt text-ink font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-brand text-primary-foreground font-bold shadow-glow hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? "Update Round" : "Add Round"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
