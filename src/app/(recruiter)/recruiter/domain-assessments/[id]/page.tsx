"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Edit3,
  FileQuestion,
  Eye,
  BarChart3,
  Share2,
  CheckCircle2,
  Clock,
  Layers,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Laptop,
  Archive,
  Trash2,
  Check,
  Code2,
} from "lucide-react";
import { toast } from "sonner";
import { domainAssessmentService } from "@/features/domainAssessment/services/domainAssessmentService";
import { DomainAssessment } from "@/features/domainAssessment/types";
import { TESTING_MODE_CARDS } from "@/features/domainAssessment/constants";

export default function DomainAssessmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const [assessment, setAssessment] = useState<DomainAssessment | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAssessment = async () => {
    try {
      setLoading(true);
      const data = await domainAssessmentService.getAssessmentById(id);
      setAssessment(data);
    } catch (err: any) {
      toast.error("Failed to load assessment details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchAssessment();
  }, [id]);

  const handlePublish = async () => {
    if (!assessment) return;
    try {
      const updated = await domainAssessmentService.publishAssessment(id);
      toast.success("Assessment is now published! Candidates can access the test link.");
      setAssessment(updated);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to publish assessment");
    }
  };

  const handleArchive = async () => {
    if (!assessment) return;
    try {
      const updated = await domainAssessmentService.archiveAssessment(id);
      toast.info("Assessment archived.");
      setAssessment(updated);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to archive assessment");
    }
  };

  const copyCandidateLink = () => {
    if (!assessment) return;
    const link = `${window.location.origin}/assessment/${assessment.assessmentId || assessment.id}`;
    navigator.clipboard.writeText(link);
    toast.success("Candidate test link copied to clipboard!", {
      description: link,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-alt/20 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-ink-soft">Loading assessment details...</p>
        </div>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-surface-alt/20 p-8 flex items-center justify-center">
        <div className="bg-surface rounded-3xl p-8 text-center border border-border max-w-md space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-ink">Assessment Not Found</h2>
          <p className="text-xs text-ink-soft">
            The requested domain assessment does not exist or may have been deleted.
          </p>
          <Link
            href="/recruiter/domain-assessments"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold"
          >
            ← Back to Assessments
          </Link>
        </div>
      </div>
    );
  }

  const isPublished = assessment.status === "published";

  return (
    <div className="min-h-screen bg-surface-alt/20 p-6 md:p-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/recruiter/domain-assessments"
            className="p-2 rounded-xl bg-surface border border-border hover:bg-surface-alt transition text-ink-soft hover:text-ink"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-ink">{assessment.title}</h1>
              <span
                className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                  isPublished
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : assessment.status === "archived"
                    ? "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                    : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                }`}
              >
                {assessment.status}
              </span>
            </div>
            <p className="text-xs md:text-sm text-ink-soft mt-0.5">
              Role: <span className="font-semibold text-ink">{assessment.role}</span> • Domain:{" "}
              <span className="capitalize font-semibold text-ink">{assessment.domain}</span> • Level:{" "}
              <span className="capitalize font-semibold text-ink">{assessment.difficulty}</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {isPublished && (
            <button
              type="button"
              onClick={copyCandidateLink}
              className="flex items-center gap-2 px-3.5 py-2 bg-surface border border-border hover:bg-surface-alt text-xs font-bold rounded-xl transition text-ink cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-primary" />
              <span>Copy Test Link</span>
            </button>
          )}

          {!isPublished && assessment.status !== "archived" && (
            <button
              type="button"
              onClick={handlePublish}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-brand text-primary-foreground text-xs font-bold rounded-xl shadow-glow hover:scale-105 transition cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Publish Assessment</span>
            </button>
          )}

          <Link
            href={`/recruiter/domain-assessments/${assessment.id}/preview`}
            className="flex items-center gap-2 px-3.5 py-2 bg-surface border border-border hover:bg-surface-alt text-xs font-bold rounded-xl transition text-ink"
          >
            <Eye className="w-3.5 h-3.5 text-amber-500" />
            <span>Candidate Preview</span>
          </Link>

          <Link
            href={`/recruiter/domain-assessments/${assessment.id}/questions`}
            className="flex items-center gap-2 px-3.5 py-2 bg-surface border border-border hover:bg-surface-alt text-xs font-bold rounded-xl transition text-ink"
          >
            <FileQuestion className="w-3.5 h-3.5 text-blue-500" />
            <span>Questions ({assessment.questionsCount || 0})</span>
          </Link>

          <Link
            href={`/recruiter/domain-assessments/${assessment.id}/results`}
            className="flex items-center gap-2 px-3.5 py-2 bg-surface border border-border hover:bg-surface-alt text-xs font-bold rounded-xl transition text-ink"
          >
            <BarChart3 className="w-3.5 h-3.5 text-purple-500" />
            <span>Results</span>
          </Link>

          <Link
            href={`/recruiter/domain-assessments/${assessment.id}/edit`}
            className="p-2 rounded-xl bg-surface border border-border hover:bg-surface-alt text-ink-soft hover:text-ink transition"
            title="Edit Assessment Settings"
          >
            <Edit3 className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Overview Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-2xl p-4 border border-border/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <FileQuestion className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-ink">{assessment.questionsCount || 0} Questions</div>
            <div className="text-xs text-ink-soft">{assessment.totalPoints || 0} Total Points</div>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-4 border border-border/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-ink">{assessment.timeLimitMinutes || 60} Minutes</div>
            <div className="text-xs text-ink-soft">Test Time Limit</div>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-4 border border-border/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-ink">{assessment.passingPercentage || 70}%</div>
            <div className="text-xs text-ink-soft">Passing Benchmark</div>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-4 border border-border/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-extrabold text-ink">{assessment.attemptsCount || 0} Attempts</div>
            <div className="text-xs text-ink-soft">
              {assessment.averageScore ? `${assessment.averageScore}% Avg Score` : "No attempts yet"}
            </div>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Configuration Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Testing Modes Card */}
          <div className="bg-surface rounded-2xl p-6 border border-border/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h2 className="text-base font-bold text-ink">Active Testing Modes</h2>
              <span className="text-xs text-ink-soft">
                {assessment.testingModes?.length || 0} Modes Configured
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(assessment.testingModes || []).map((modeId) => {
                const card = TESTING_MODE_CARDS.find((c) => c.id === modeId);
                return (
                  <div
                    key={modeId}
                    className="p-3.5 rounded-xl border border-border/80 bg-surface-alt/40 flex items-start gap-3"
                  >
                    <span className="text-xl shrink-0">{card?.icon || "💻"}</span>
                    <div>
                      <div className="text-xs font-bold text-ink">{card?.title || modeId}</div>
                      <div className="text-[11px] text-ink-soft mt-0.5 line-clamp-2">
                        {card?.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skill Areas */}
          <div className="bg-surface rounded-2xl p-6 border border-border/80 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-ink border-b border-border/60 pb-3">
              Evaluated Skill Areas
            </h2>
            <div className="flex flex-wrap gap-2">
              {(assessment.skillAreas || []).map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="px-3 py-1.5 rounded-xl bg-surface-alt border border-border text-xs font-semibold text-ink"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Job Description Context */}
          {assessment.jobDescription && (
            <div className="bg-surface rounded-2xl p-6 border border-border/80 shadow-sm space-y-3">
              <h2 className="text-base font-bold text-ink border-b border-border/60 pb-3">
                Job Context & Requirements
              </h2>
              <p className="text-xs text-ink leading-relaxed whitespace-pre-line bg-surface-alt/40 p-4 rounded-xl border border-border/60">
                {assessment.jobDescription}
              </p>
            </div>
          )}
        </div>

        {/* Right: Test Questions Preview & Options */}
        <div className="lg:col-span-5 space-y-6">
          {/* Test Parameters Card */}
          <div className="bg-surface rounded-2xl p-6 border border-border/80 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-ink border-b border-border/60 pb-3">
              Test Security & Evaluation Options
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span className="text-ink-soft">Code Execution IDE:</span>
                <span className="font-bold text-ink">
                  {assessment.options?.allowCodeCompilation ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span className="text-ink-soft">AI-Powered Hints:</span>
                <span className="font-bold text-ink">
                  {assessment.options?.enableAiHints ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span className="text-ink-soft">Proctoring & Screen Recording:</span>
                <span className="font-bold text-ink">
                  {assessment.options?.recordScreen ? "Enabled" : "Disabled"}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span className="text-ink-soft">Rubric Auto-Evaluation:</span>
                <span className="font-bold text-ink">
                  {assessment.options?.autoEvaluateRubrics ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>
          </div>

          {/* Questions Snippet & Manage Link */}
          <div className="bg-surface rounded-2xl p-6 border border-border/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h2 className="text-base font-bold text-ink">Questions Overview</h2>
              <Link
                href={`/recruiter/domain-assessments/${assessment.id}/questions`}
                className="text-xs text-primary-glow font-bold hover:underline"
              >
                Manage All ({assessment.questionsCount || 0}) →
              </Link>
            </div>

            {(!assessment.questions || assessment.questions.length === 0) ? (
              <div className="text-center py-6 text-xs text-ink-soft space-y-3">
                <p>No questions added to this assessment yet.</p>
                <Link
                  href={`/recruiter/domain-assessments/${assessment.id}/questions`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-brand text-primary-foreground font-bold rounded-xl shadow-glow text-xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate Questions with AI</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                {assessment.questions.slice(0, 5).map((q, qIdx) => (
                  <div
                    key={q.id || qIdx}
                    className="p-3 rounded-xl bg-surface-alt/40 border border-border/80 space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-ink line-clamp-1">{q.title || `Question ${qIdx + 1}`}</span>
                      <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full shrink-0 uppercase">
                        {q.type} • {q.points || 10} pts
                      </span>
                    </div>
                    <p className="text-ink-soft text-[11px] line-clamp-2">{q.question}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
