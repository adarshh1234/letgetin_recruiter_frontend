"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Clock,
  Sliders,
  Settings2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { domainAssessmentService } from "@/features/domainAssessment/services/domainAssessmentService";
import { DomainAssessment, AssessmentDifficulty, TestingMode } from "@/features/domainAssessment/types";
import {
  DOMAIN_OPTIONS,
  TESTING_MODE_CARDS,
  DIFFICULTY_LEVELS,
  TIME_LIMIT_OPTIONS,
  ALL_SKILL_TAGS,
} from "@/features/domainAssessment/constants";

export default function EditDomainAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const [assessment, setAssessment] = useState<DomainAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [role, setRole] = useState("");
  const [domain, setDomain] = useState("fullstack");
  const [difficulty, setDifficulty] = useState<AssessmentDifficulty>("mid");
  const [timeLimit, setTimeLimit] = useState(60);
  const [passingPercentage, setPassingPercentage] = useState(70);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedModes, setSelectedModes] = useState<TestingMode[]>([]);
  const [allowCompilation, setAllowCompilation] = useState(true);
  const [enableAiHints, setEnableAiHints] = useState(true);
  const [recordScreen, setRecordScreen] = useState(false);
  const [autoEvaluateRubrics, setAutoEvaluateRubrics] = useState(true);
  const [customInstructions, setCustomInstructions] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await domainAssessmentService.getAssessmentById(id);
        setAssessment(data);
        setTitle(data.title || "");
        setRole(data.role || "");
        setDomain(data.domain || "fullstack");
        setDifficulty(data.difficulty || "mid");
        setTimeLimit(data.timeLimitMinutes || 60);
        setPassingPercentage(data.passingPercentage || 70);
        setSelectedSkills(data.skillAreas || []);
        setSelectedModes(data.testingModes || ["coding", "architecture"]);
        setAllowCompilation(data.options?.allowCodeCompilation ?? true);
        setEnableAiHints(data.options?.enableAiHints ?? true);
        setRecordScreen(data.options?.recordScreen ?? false);
        setAutoEvaluateRubrics(data.options?.autoEvaluateRubrics ?? true);
        setCustomInstructions(data.customInstructions || "");
      } catch (err: any) {
        toast.error("Failed to load assessment");
      } finally {
        setLoading(false);
      }
    }
    if (id) loadData();
  }, [id]);

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const toggleMode = (mode: TestingMode) => {
    if (selectedModes.includes(mode)) {
      if (selectedModes.length === 1) {
        toast.error("At least one testing mode must remain selected.");
        return;
      }
      setSelectedModes(selectedModes.filter((m) => m !== mode));
    } else {
      setSelectedModes([...selectedModes, mode]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title cannot be blank.");
      return;
    }

    try {
      setSaving(true);
      await domainAssessmentService.updateAssessment(id, {
        title,
        role,
        domain,
        difficulty,
        timeLimitMinutes: timeLimit,
        passingPercentage,
        skillAreas: selectedSkills,
        testingModes: selectedModes,
        options: {
          allowCodeCompilation: allowCompilation,
          enableAiHints: enableAiHints,
          recordScreen: recordScreen,
          autoEvaluateRubrics: autoEvaluateRubrics,
        },
        customInstructions,
      });

      toast.success("Assessment updated successfully!");
      router.push(`/recruiter/domain-assessments/${id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update assessment");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-alt/20 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-ink-soft">Loading assessment settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-alt/20 p-6 md:p-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <Link
            href={`/recruiter/domain-assessments/${id}`}
            className="p-2 rounded-xl bg-surface border border-border hover:bg-surface-alt transition text-ink-soft hover:text-ink"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-ink">Edit Assessment Settings</h1>
            <p className="text-xs md:text-sm text-ink-soft">
              Modify configuration, pass score benchmark, testing modes, and candidate options.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-brand text-primary-foreground text-xs font-bold rounded-xl shadow-glow hover:scale-105 transition disabled:opacity-50 cursor-pointer"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-7 bg-surface rounded-2xl p-6 border border-border/80 shadow-sm space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-ink-soft block mb-1.5">
                Assessment Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-surface-alt/40 border border-border rounded-xl text-xs md:text-sm text-ink focus:outline-none focus:border-primary transition font-semibold"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-ink-soft block mb-1.5">
                  Target Role
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-alt/40 border border-border rounded-xl text-xs md:text-sm text-ink focus:outline-none focus:border-primary transition"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-ink-soft block mb-1.5">
                  Domain
                </label>
                <select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-surface-alt/40 border border-border rounded-xl text-xs md:text-sm text-ink focus:outline-none focus:border-primary transition capitalize"
                >
                  {DOMAIN_OPTIONS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-ink-soft block mb-1.5">
                  Difficulty Level
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as AssessmentDifficulty)}
                  className="w-full px-3.5 py-2.5 bg-surface-alt/40 border border-border rounded-xl text-xs md:text-sm text-ink focus:outline-none focus:border-primary transition capitalize"
                >
                  {DIFFICULTY_LEVELS.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-ink-soft block mb-1.5">
                  Time Limit (Minutes)
                </label>
                <select
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-surface-alt/40 border border-border rounded-xl text-xs md:text-sm text-ink focus:outline-none focus:border-primary transition"
                >
                  {TIME_LIMIT_OPTIONS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label} ({t.tier})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-ink-soft block mb-1.5">
                  Passing Score (%)
                </label>
                <input
                  type="number"
                  min="40"
                  max="100"
                  value={passingPercentage}
                  onChange={(e) => setPassingPercentage(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-surface-alt/40 border border-border rounded-xl text-xs md:text-sm text-ink focus:outline-none focus:border-primary transition font-bold"
                />
              </div>
            </div>

            {/* Skill Tags */}
            <div className="space-y-2 pt-3 border-t border-border/60">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-soft block">
                Evaluated Skill Areas
              </label>
              <div className="flex flex-wrap gap-2">
                {ALL_SKILL_TAGS.map((skill) => {
                  const active = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer border ${
                        active
                          ? "bg-primary text-white border-primary shadow-sm font-semibold"
                          : "bg-surface-alt/60 border-border text-ink-soft hover:border-primary/50 hover:text-ink"
                      }`}
                    >
                      {skill}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Instructions */}
            <div className="space-y-2 pt-3 border-t border-border/60">
              <label className="text-xs font-bold uppercase tracking-wider text-ink-soft block">
                Custom Instructions for Candidates
              </label>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                rows={3}
                placeholder="Specific guidance for candidates..."
                className="w-full px-3.5 py-2.5 bg-surface-alt/40 border border-border rounded-xl text-xs md:text-sm text-ink focus:outline-none focus:border-primary transition resize-y font-sans"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Modes & Checkboxes */}
        <div className="lg:col-span-5 space-y-6">
          {/* Modes selection */}
          <div className="bg-surface rounded-2xl p-6 border border-border/80 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-ink border-b border-border/60 pb-3">
              Included Testing Modes
            </h2>
            <div className="space-y-2.5">
              {TESTING_MODE_CARDS.map((card) => {
                const isSelected = selectedModes.includes(card.id);
                return (
                  <div
                    key={card.id}
                    onClick={() => toggleMode(card.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? "border-primary bg-primary/[0.04] font-semibold"
                        : "border-border/80 bg-surface hover:border-primary/50 text-ink-soft"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{card.icon}</span>
                      <span className="text-xs text-ink">{card.title}</span>
                    </div>

                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                        isSelected
                          ? "bg-primary text-white"
                          : "border border-border text-transparent"
                      }`}
                    >
                      ✓
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Options */}
          <div className="bg-surface rounded-2xl p-6 border border-border/80 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-ink border-b border-border/60 pb-3">
              Security & Evaluation Flags
            </h2>
            <div className="space-y-3 text-xs">
              <label className="flex items-center gap-2.5 cursor-pointer text-ink font-medium">
                <input
                  type="checkbox"
                  checked={allowCompilation}
                  onChange={(e) => setAllowCompilation(e.target.checked)}
                  className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                />
                <span>Allow code compilation & execution</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-ink font-medium">
                <input
                  type="checkbox"
                  checked={enableAiHints}
                  onChange={(e) => setEnableAiHints(e.target.checked)}
                  className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                />
                <span>Enable AI-powered hints</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-ink font-medium">
                <input
                  type="checkbox"
                  checked={recordScreen}
                  onChange={(e) => setRecordScreen(e.target.checked)}
                  className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                />
                <span>Record screen & keystrokes (proctoring)</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-ink font-medium">
                <input
                  type="checkbox"
                  checked={autoEvaluateRubrics}
                  onChange={(e) => setAutoEvaluateRubrics(e.target.checked)}
                  className="w-4 h-4 rounded text-primary accent-primary cursor-pointer"
                />
                <span>Auto-evaluate with rubric criteria</span>
              </label>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
