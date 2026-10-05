"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileQuestion,
  Code2,
  ChevronLeft,
  ChevronRight,
  Eye,
  BookmarkCheck,
  Send,
  Sparkles,
  HelpCircle,
  RefreshCw,
  Sun,
  Moon,
} from "lucide-react";
import { toast } from "sonner";
import { domainAssessmentService } from "@/features/domainAssessment/services/domainAssessmentService";
import { DomainAssessment, AssessmentQuestion } from "@/features/domainAssessment/types";

export default function CandidatePreviewAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const [assessment, setAssessment] = useState<DomainAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [simulatedTime, setSimulatedTime] = useState<number>(3600);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showScorecardModal, setShowScorecardModal] = useState(false);

  // Theme state: 'dark' | 'light'
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("letgetin_test_theme") as "dark" | "light" | null;
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
      }
    } catch {}
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("letgetin_test_theme", next);
      } catch {}
      return next;
    });
  };

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await domainAssessmentService.getAssessmentById(id);
        setAssessment(data);
        setSimulatedTime((data.timeLimitMinutes || 60) * 60);

        // Prepopulate starter codes
        const initialAns: Record<string, string> = {};
        data.questions?.forEach((q) => {
          if (q.starterCode) initialAns[q.id] = q.starterCode;
        });
        setAnswers(initialAns);
      } catch (err: any) {
        toast.error("Failed to load assessment for preview");
      } finally {
        setLoading(false);
      }
    }
    if (id) loadData();
  }, [id]);

  // Timer simulation countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedTime((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-alt/20 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-ink-soft">Loading candidate preview...</p>
        </div>
      </div>
    );
  }

  if (!assessment || !assessment.questions || assessment.questions.length === 0) {
    return (
      <div className="min-h-screen bg-surface-alt/20 p-8 flex items-center justify-center">
        <div className="bg-surface rounded-3xl p-8 text-center border border-border max-w-md space-y-4">
          <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
          <h2 className="text-lg font-bold text-ink">No Questions in Assessment</h2>
          <p className="text-xs text-ink-soft">
            Add or generate questions before previewing the candidate experience.
          </p>
          <Link
            href={`/recruiter/domain-assessments/${id}/questions`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold"
          >
            ← Go to Question Studio
          </Link>
        </div>
      </div>
    );
  }

  const currentQ = assessment.questions[currentIdx];
  const answeredCount = Object.keys(answers).filter((k) => (answers[k] || "").trim().length > 0).length;

  const handleSelectAnswer = (qId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: val }));
  };

  const toggleReview = (qId: string) => {
    setMarkedForReview((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${theme === "dark" ? "portal-dark dark bg-slate-950 text-slate-100" : "portal-light bg-slate-50 text-slate-900"}`}>
      {/* Top Preview Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/30 px-6 py-2.5 flex items-center justify-between text-xs text-amber-800 dark:text-amber-200">
        <div className="flex items-center gap-2 font-medium">
          <Eye className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong className="font-bold">Recruiter Sandbox Mode:</strong> You are previewing how candidates experience this assessment. Responses are not saved to candidate analytics.
          </span>
        </div>

        <Link
          href={`/recruiter/domain-assessments/${id}`}
          className="underline font-bold text-amber-900 dark:text-amber-100 hover:text-ink shrink-0"
        >
          Exit Preview
        </Link>
      </div>

      {/* Test Interface Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md gap-2 sm:gap-4 relative">
        {/* Left: Assessment Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-brand text-primary-foreground flex items-center justify-center font-bold text-sm shadow-glow shrink-0">
            🧪
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-white line-clamp-1">{assessment.title}</h1>
            <p className="text-[11px] text-slate-400 truncate">
              Question {currentIdx + 1} of {assessment.questions.length} • Domain: {assessment.domain}
            </p>
          </div>
        </div>

        {/* Middle: Centered Countdown Timer */}
        <div className="shrink-0 flex items-center justify-center px-1 sm:px-4">
          <div className="flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs sm:text-sm font-mono font-black text-slate-100 shadow-sm">
            <Clock className="w-4 h-4 text-primary-glow" />
            <span className="tracking-wider">{formatTimer(simulatedTime)}</span>
            <span className="text-[10px] text-slate-400 hidden md:inline font-sans font-medium uppercase tracking-wider pl-1 border-l border-slate-700">
              Simulated
            </span>
          </div>
        </div>

        {/* Right: Theme Toggle & Finish Test Button */}
        <div className="flex items-center justify-end gap-2.5 sm:gap-3 flex-1 min-w-0">
          {/* Light / Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer flex items-center justify-center shrink-0"
            aria-label="Toggle light and dark mode"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 bg-gradient-brand text-primary-foreground text-xs font-bold rounded-xl shadow-glow hover:scale-105 transition cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Finish Test</span>
            <span className="sm:hidden">Finish</span>
          </button>
        </div>
      </div>

      {/* Main Test Body */}
      <div className="flex-1 max-w-6xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Question Card */}
        <div className="lg:col-span-8 bg-surface rounded-2xl p-6 border border-border/80 shadow-sm space-y-6">
          {/* Question Meta */}
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary-glow font-bold text-xs flex items-center justify-center">
                {currentIdx + 1}
              </span>
              <span className="text-xs font-bold text-ink uppercase tracking-wide">
                {currentQ.type.replace("_", " ")}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="px-2 py-0.5 rounded-full bg-surface-alt font-medium text-ink-soft border border-border">
                {currentQ.skill}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold">
                {currentQ.points || 10} Points
              </span>
            </div>
          </div>

          {/* Question Statement */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-ink">{currentQ.title}</h2>
            <p className="text-xs md:text-sm text-ink leading-relaxed whitespace-pre-line font-medium">
              {currentQ.question}
            </p>
          </div>

          {/* Context scenario (if any) */}
          {currentQ.context && (
            <div className="p-3.5 rounded-xl bg-surface-alt/40 border border-border/60 text-xs text-ink-soft space-y-1">
              <span className="font-bold text-ink block">Scenario Details:</span>
              <p>{currentQ.context}</p>
            </div>
          )}

          {/* Answering Area */}
          <div className="pt-2">
            {currentQ.type === "mcq" && currentQ.options && (
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-ink-soft block uppercase tracking-wider">
                  Select your answer:
                </label>
                {currentQ.options.map((opt) => {
                  const selected = answers[currentQ.id] === opt.id;
                  return (
                    <label
                      key={opt.id}
                      onClick={() => handleSelectAnswer(currentQ.id, opt.id)}
                      className={`p-3.5 rounded-xl border-2 transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        selected
                          ? "border-primary bg-primary/[0.04] text-primary font-bold shadow-sm"
                          : "border-border/80 hover:border-primary/40 bg-surface-alt/20 text-ink"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs uppercase ${
                            selected
                              ? "bg-primary text-white"
                              : "bg-surface border border-border text-ink-soft"
                          }`}
                        >
                          {opt.id.replace("opt_", "")}
                        </span>
                        <span className="text-xs">{opt.text}</span>
                      </div>
                      {selected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                    </label>
                  );
                })}
              </div>
            )}

            {(currentQ.type === "coding" || currentQ.type === "debugging") && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-ink-soft">
                  <span className="flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-primary-glow" />
                    <span>Candidate Code Editor ({currentQ.language || "javascript"}):</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSelectAnswer(currentQ.id, currentQ.starterCode || "")}
                    className="text-[11px] text-primary-glow hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset Starter Code</span>
                  </button>
                </div>
                <textarea
                  value={answers[currentQ.id] || ""}
                  onChange={(e) => handleSelectAnswer(currentQ.id, e.target.value)}
                  rows={8}
                  placeholder="// Write your solution here..."
                  className="w-full p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-primary resize-y"
                />
              </div>
            )}

            {(currentQ.type === "architecture" ||
              currentQ.type === "system_design" ||
              currentQ.type === "short_answer") && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-ink-soft block uppercase tracking-wider">
                  Your Architectural Proposal & Technical Solution:
                </label>
                <textarea
                  value={answers[currentQ.id] || ""}
                  onChange={(e) => handleSelectAnswer(currentQ.id, e.target.value)}
                  rows={8}
                  placeholder="Detail your component design, communication protocols, caching strategies, and resilience considerations..."
                  className="w-full p-3.5 bg-surface-alt/40 border border-border rounded-xl text-xs md:text-sm text-ink focus:outline-none focus:border-primary resize-y font-sans leading-relaxed"
                />
              </div>
            )}
          </div>

          {/* Bottom Question Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-border/60 text-xs">
            <button
              type="button"
              onClick={() => toggleReview(currentQ.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                markedForReview[currentQ.id]
                  ? "bg-amber-500/10 text-amber-600 border-amber-500/40 font-bold"
                  : "bg-surface-alt text-ink-soft hover:text-ink border-border"
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>{markedForReview[currentQ.id] ? "Marked for Review" : "Mark for Review"}</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentIdx((prev) => Math.max(prev - 1, 0))}
                disabled={currentIdx === 0}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-surface border border-border hover:bg-surface-alt text-ink disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setCurrentIdx((prev) => Math.min(prev + 1, assessment.questions.length - 1))
                }
                disabled={currentIdx === assessment.questions.length - 1}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-primary text-white font-bold hover:scale-105 transition disabled:opacity-30 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Question Palette */}
        <div className="lg:col-span-4 bg-surface rounded-2xl p-6 border border-border/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <h3 className="text-xs font-bold text-ink uppercase tracking-wider">Question Palette</h3>
            <span className="text-xs font-bold text-primary-glow">
              {answeredCount}/{assessment.questions.length} Answered
            </span>
          </div>

          {/* Palette Grid */}
          <div className="grid grid-cols-5 gap-2">
            {assessment.questions.map((q, idx) => {
              const isCurrent = idx === currentIdx;
              const hasAnswer = (answers[q.id] || "").trim().length > 0;
              const isMarked = markedForReview[q.id];

              return (
                <button
                  key={q.id || idx}
                  type="button"
                  onClick={() => setCurrentIdx(idx)}
                  className={`w-full aspect-square rounded-xl flex items-center justify-center font-bold text-xs transition-all relative cursor-pointer ${
                    isCurrent
                      ? "ring-2 ring-primary ring-offset-2 bg-primary text-white font-black shadow-md"
                      : isMarked
                      ? "bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/50"
                      : hasAnswer
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                      : "bg-surface-alt/60 text-ink-soft hover:text-ink border border-border"
                  }`}
                >
                  <span>{idx + 1}</span>
                  {isMarked && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute top-1 right-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="space-y-2 pt-3 border-t border-border/60 text-[11px] text-ink-soft">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500 inline-block" />
              <span>Answered ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-500 inline-block" />
              <span>Marked for Review ({Object.values(markedForReview).filter(Boolean).length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-surface-alt border border-border inline-block" />
              <span>Unvisited / Unanswered ({assessment.questions.length - answeredCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary-glow flex items-center justify-center mx-auto text-xl font-bold">
              🚀
            </div>
            <h3 className="text-base font-bold text-ink">Finish Candidate Test Preview?</h3>
            <p className="text-xs text-ink-soft">
              You have answered {answeredCount} out of {assessment.questions.length} questions. In preview mode, submitting triggers a simulated automated scorecard evaluation.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 bg-surface-alt text-xs font-semibold rounded-xl text-ink"
              >
                Return to Test
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSubmitModal(false);
                  setShowScorecardModal(true);
                }}
                className="px-5 py-2 bg-gradient-brand text-primary-foreground text-xs font-bold rounded-xl shadow-glow"
              >
                Submit & View Scorecard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Scorecard Preview Modal */}
      {showScorecardModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">🏆</span>
                <h3 className="text-base font-bold text-ink">Simulated Candidate Scorecard</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowScorecardModal(false)}
                className="p-1 rounded-lg text-ink-soft hover:text-ink"
              >
                ✕
              </button>
            </div>

            <div className="text-center space-y-2 py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-2xl flex items-center justify-center mx-auto border-2 border-emerald-500/30">
                85%
              </div>
              <div className="text-xs font-extrabold uppercase tracking-wide text-emerald-600">
                Verdict: Strong Hire
              </div>
              <p className="text-xs text-ink-soft">
                Demonstrated high acuity in system architecture and clean, robust problem-solving logic.
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-border/60 text-xs">
              <div className="font-bold text-ink">Skill Domain Breakdown:</div>
              {(assessment.skillAreas || []).slice(0, 4).map((skill, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-ink-soft">{skill}</span>
                  <span className="font-bold text-ink">{80 + (idx * 5) % 15}%</span>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2.5 pt-3 border-t border-border/60 text-xs">
              <button
                type="button"
                onClick={() => setShowScorecardModal(false)}
                className="px-4 py-2 bg-surface-alt rounded-xl font-bold text-ink"
              >
                Close Preview
              </button>
              <Link
                href={`/recruiter/domain-assessments/${id}`}
                className="px-4 py-2 bg-gradient-brand text-primary-foreground font-bold rounded-xl shadow-glow"
              >
                Back to Assessment
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
