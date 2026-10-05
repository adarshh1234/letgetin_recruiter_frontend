"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  FileQuestion,
  Code2,
  ChevronLeft,
  ChevronRight,
  Send,
  Sparkles,
  ShieldCheck,
  Award,
  RefreshCw,
  BookmarkCheck,
  Laptop,
  Check,
  HelpCircle,
  Loader2,
  Sun,
  Moon,
} from "lucide-react";
import { toast } from "sonner";
import { domainAssessmentService } from "@/features/domainAssessment/services/domainAssessmentService";
import {
  AssessmentQuestion,
  AssessmentAttempt,
  AttemptEvaluation,
} from "@/features/domainAssessment/types";

export default function CandidateAssessmentTakePage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  // Phases: 'onboarding' | 'in_progress' | 'completed'
  const [phase, setPhase] = useState<"onboarding" | "in_progress" | "completed">("onboarding");

  // Candidate input
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [isStarting, setIsStarting] = useState(false);

  // Active Session state
  const [attemptId, setAttemptId] = useState<string>("");
  const [assessmentMeta, setAssessmentMeta] = useState<any>(null);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({});
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(3600);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<AttemptEvaluation | null>(null);

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

  // Initial Assessment details fetch for Onboarding
  const [loadingInitial, setLoadingInitial] = useState(true);

  useEffect(() => {
    async function loadMeta() {
      try {
        setLoadingInitial(true);
        const data = await domainAssessmentService.getAssessmentById(id);
        setAssessmentMeta(data);
        setTimeRemainingSeconds((data.timeLimitMinutes || 60) * 60);
      } catch (err: any) {
        toast.error("Could not load assessment details");
      } finally {
        setLoadingInitial(false);
      }
    }
    if (id) loadMeta();
  }, [id]);

  // Live countdown timer
  useEffect(() => {
    if (phase !== "in_progress") return;

    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmitOnExpiry();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  const handleAutoSubmitOnExpiry = async () => {
    toast.error("Time has expired! Submitting your answers automatically...", { duration: 6000 });
    handleSubmitTest();
  };

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Start Attempt
  const handleStartAttempt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName.trim() || !candidateEmail.trim()) {
      toast.error("Please enter your name and email address to begin.");
      return;
    }

    try {
      setIsStarting(true);
      const res = await domainAssessmentService.startAttempt(id, {
        candidateName: candidateName.trim(),
        candidateEmail: candidateEmail.trim(),
      });

      setAttemptId(res.attemptId);

      // Load session questions
      const sessionData = await domainAssessmentService.getAttempt(res.attemptId);
      setQuestions(sessionData.assessment.questions || []);

      const initialAnswers: Record<string, string> = {};
      sessionData.assessment.questions?.forEach((q: any) => {
        if (q.starterCode) initialAnswers[q.id] = q.starterCode;
      });
      setAnswers(initialAnswers);

      if (sessionData.attempt.remainingSeconds) {
        setTimeRemainingSeconds(sessionData.attempt.remainingSeconds);
      }

      setPhase("in_progress");
      toast.success("Assessment started! Good luck.");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to start assessment");
    } finally {
      setIsStarting(false);
    }
  };

  // Answer change & debounce auto-save
  const handleAnswerChange = async (questionId: string, val: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: val }));

    try {
      setIsAutoSaving(true);
      await domainAssessmentService.saveAnswer(attemptId, {
        questionId,
        answer: val,
      });
    } catch (err) {
      // silent background save catch
    } finally {
      setIsAutoSaving(false);
    }
  };

  const toggleReview = (questionId: string) => {
    setMarkedForReview((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  // Submit test
  const handleSubmitTest = async () => {
    try {
      setIsSubmitting(true);
      setShowSubmitModal(false);
      toast.loading("Submitting and evaluating your assessment...", { id: "sub-eval" });

      const evaluation = await domainAssessmentService.submitAttempt(attemptId);
      setEvaluationResult(evaluation);
      setPhase("completed");
      toast.dismiss("sub-eval");
      toast.success("Assessment completed and evaluated!");
    } catch (err: any) {
      toast.dismiss("sub-eval");
      toast.error(err.response?.data?.message || "Submission error. Please retry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Preparing assessment session...</p>
        </div>
      </div>
    );
  }

  // 1. ONBOARDING LANDING PHASE
  if (phase === "onboarding") {
    return (
      <div className={`min-h-screen flex flex-col justify-between p-6 md:p-12 transition-colors duration-200 ${theme === "dark" ? "portal-dark dark bg-slate-950 text-slate-100" : "portal-light bg-slate-50 text-slate-900"}`}>
        {/* Brand header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-base shadow-lg shadow-emerald-500/20">
              L
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-white text-base">LetGetIn</span>
              <span className="text-[10px] text-slate-400 block -mt-0.5">Domain Skills Testing</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">
              Secure Candidate Testing Session
            </span>
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
          </div>
        </div>

        {/* Hero Card */}
        <div className="max-w-2xl mx-auto w-full my-auto py-8">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-xl space-y-6">
            <div className="space-y-2 text-center">
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-wider">
                {assessmentMeta?.domain || "Technical"} Assessment
              </span>
              <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                {assessmentMeta?.title || "Domain Specific Assessment"}
              </h1>
              <p className="text-xs md:text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                Role: <strong className="text-slate-200">{assessmentMeta?.role || "Engineering Candidate"}</strong> • Time Limit:{" "}
                <strong className="text-slate-200">{assessmentMeta?.timeLimitMinutes || 60} Minutes</strong> • Benchmark:{" "}
                <strong className="text-slate-200">{assessmentMeta?.passingPercentage || 70}%</strong>
              </p>
            </div>

            {/* Assessment Rules */}
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs text-slate-300">
              <div className="font-bold text-white flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Test Instructions & Integrity Policies:</span>
              </div>
              <ul className="space-y-1.5 list-disc pl-5 text-[11.5px] text-slate-400">
                <li>This test contains multiple question formats including live coding, architecture proposals, and conceptual challenges.</li>
                <li>Your answers are continuously auto-saved. You can navigate between questions freely using the question palette.</li>
                <li>The test timer will run continuously. If time expires, your answers will be automatically submitted.</li>
                <li>Ensure a stable internet connection. Avoid closing or refreshing the browser window.</li>
              </ul>
            </div>

            {/* Candidate Info Form */}
            <form onSubmit={handleStartAttempt} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="e.g. Sarah Connor"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={candidateEmail}
                    onChange={(e) => setCandidateEmail(e.target.value)}
                    placeholder="e.g. sarah@example.com"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-emerald-500 transition"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isStarting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm tracking-wide shadow-lg shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] transition cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isStarting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>Begin Assessment →</span>
              </button>
            </form>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-500">
          Powered by LetGetIn Domain Assessment Engine. All Rights Reserved.
        </div>
      </div>
    );
  }

  // 3. COMPLETED SCORECARD PHASE
  if (phase === "completed") {
    const passed = evaluationResult?.passed ?? false;
    const scorePct = evaluationResult?.percentage ?? 0;

    return (
      <div className={`min-h-screen flex flex-col justify-between p-6 md:p-12 transition-colors duration-200 ${theme === "dark" ? "portal-dark dark bg-slate-950 text-slate-100" : "portal-light bg-slate-50 text-slate-900"}`}>
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-base">
              L
            </div>
            <span className="font-extrabold tracking-tight text-white">LetGetIn Assessment</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-emerald-400 font-bold">Evaluation Complete</span>
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
          </div>
        </div>

        <div className="max-w-2xl mx-auto w-full my-auto py-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl space-y-6">
            <div className="text-center space-y-3">
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center font-black text-3xl mx-auto border-4 shadow-xl ${
                  passed
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-emerald-500/10"
                    : "bg-rose-500/10 border-rose-500 text-rose-400 shadow-rose-500/10"
                }`}
              >
                {scorePct}%
              </div>

              <div>
                <span
                  className={`text-xs font-black uppercase px-3 py-1 rounded-full ${
                    passed
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  }`}
                >
                  {passed ? "Benchmark Passed" : "Benchmark Not Met"}
                </span>
                <h2 className="text-xl md:text-2xl font-black text-white mt-2">
                  Verdict: {(evaluationResult?.verdict || "evaluated").replace("_", " ").toUpperCase()}
                </h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                  {evaluationResult?.summary}
                </p>
              </div>
            </div>

            {/* Skill Breakdown */}
            {evaluationResult?.skillBreakdown && evaluationResult.skillBreakdown.length > 0 && (
              <div className="space-y-2.5 pt-2 border-t border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Domain Skill Breakdown
                </h4>
                <div className="space-y-2 text-xs">
                  {evaluationResult.skillBreakdown.map((sb, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-slate-200">{sb.skill}</span>
                        <span className="text-emerald-400 font-mono font-bold">{sb.percentage}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${sb.percentage}%` }}
                        />
                      </div>
                      {sb.feedback && <p className="text-[11px] text-slate-400">{sb.feedback}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths & Growth Areas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-1.5">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Key Strengths</span>
                </span>
                <ul className="space-y-1 text-[11px] text-slate-300">
                  {(evaluationResult?.strengths || ["Consistent problem-solving"]).map((s, idx) => (
                    <li key={idx}>• {s}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-1.5">
                <span className="font-bold text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span>Areas to Refine</span>
                </span>
                <ul className="space-y-1 text-[11px] text-slate-300">
                  {(evaluationResult?.gaps || ["Edge case performance"]).map((g, idx) => (
                    <li key={idx}>• {g}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="text-center pt-4 border-t border-slate-800 text-xs text-slate-400">
              Your results have been securely recorded and sent to the recruiter for hiring review.
            </div>
          </div>
        </div>

        <div className="text-center text-[11px] text-slate-500">
          Powered by LetGetIn Domain Assessment Engine. All Rights Reserved.
        </div>
      </div>
    );
  }

  // 2. ACTIVE TEST IN PROGRESS PHASE
  const currentQ = questions[currentIdx] || {
    id: "q_1",
    title: "Question 1",
    question: "Loading question...",
    type: "mcq",
    skill: "General",
    points: 10,
  };

  const answeredCount = Object.keys(answers).filter((k) => (answers[k] || "").trim().length > 0).length;

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-200 ${theme === "dark" ? "portal-dark dark bg-slate-950 text-slate-100" : "portal-light bg-slate-50 text-slate-900"}`}>
      {/* Top Test Session Header */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md gap-2 sm:gap-4 relative">
        {/* Left: Assessment Title & Candidate */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-sm shrink-0">
            L
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-white line-clamp-1">{assessmentMeta?.title}</h1>
            <p className="text-[11px] text-slate-400 truncate">
              Question {currentIdx + 1} of {questions.length} • Candidate: {candidateName}
            </p>
          </div>
        </div>

        {/* Middle: Centered Countdown Timer */}
        <div className="shrink-0 flex items-center justify-center px-1 sm:px-4">
          <div
            className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-2xl border text-xs sm:text-sm font-mono font-black transition-colors ${
              timeRemainingSeconds < 300
                ? "bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse scale-105"
                : timeRemainingSeconds < 600
                ? "bg-amber-500/20 text-amber-400 border-amber-500/40"
                : "bg-slate-950 text-slate-200 border-slate-800"
            }`}
          >
            <Clock className="w-4 h-4 text-emerald-400" />
            <span className="tracking-wider">{formatTimer(timeRemainingSeconds)}</span>
            <span className="text-[10px] text-slate-400 hidden md:inline font-sans font-medium uppercase tracking-wider pl-1 border-l border-slate-700">
              Remaining
            </span>
          </div>
        </div>

        {/* Right: Controls & Light/Dark Mode */}
        <div className="flex items-center justify-end gap-2.5 sm:gap-3 flex-1 min-w-0">
          {/* Auto-save indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            {isAutoSaving ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-emerald-400" />
                <span>Auto-saving...</span>
              </>
            ) : (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span>All answers saved</span>
              </>
            )}
          </div>

          {/* Theme Toggle Button */}
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
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-xs font-black rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition cursor-pointer shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Submit Test</span>
            <span className="sm:hidden">Submit</span>
          </button>
        </div>
      </div>

      {/* Main Test Layout */}
      <div className="flex-1 max-w-6xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Question Card */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-6 shadow-xl">
          {/* Question Meta */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-xs flex items-center justify-center">
                {currentIdx + 1}
              </span>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {currentQ.type?.replace("_", " ")}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-slate-400 border border-slate-800 font-medium">
                {currentQ.skill}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold">
                {currentQ.points || 10} Points
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white">{currentQ.title}</h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-line font-medium">
              {currentQ.question}
            </p>
          </div>

          {/* Context scenario (if any) */}
          {currentQ.context && (
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1">
              <span className="font-bold text-slate-200 block">Scenario Context:</span>
              <p>{currentQ.context}</p>
            </div>
          )}

          {/* Answering Area */}
          <div className="pt-2">
            {currentQ.type === "mcq" && currentQ.options && (
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                  Select your answer:
                </label>
                {currentQ.options.map((opt) => {
                  const selected = answers[currentQ.id] === opt.id;
                  return (
                    <label
                      key={opt.id}
                      onClick={() => handleAnswerChange(currentQ.id, opt.id)}
                      className={`p-3.5 rounded-xl border-2 transition-all flex items-center justify-between gap-3 cursor-pointer ${
                        selected
                          ? "border-emerald-500 bg-emerald-500/10 text-emerald-300 font-bold shadow-sm"
                          : "border-slate-800 hover:border-slate-700 bg-slate-950/40 text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs uppercase ${
                            selected
                              ? "bg-emerald-500 text-slate-950 font-black"
                              : "bg-slate-900 border border-slate-700 text-slate-400"
                          }`}
                        >
                          {opt.id.replace("opt_", "")}
                        </span>
                        <span className="text-xs">{opt.text}</span>
                      </div>
                      {selected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                    </label>
                  );
                })}
              </div>
            )}

            {(currentQ.type === "coding" || currentQ.type === "debugging") && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>IDE Code Editor ({currentQ.language || "javascript"}):</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAnswerChange(currentQ.id, currentQ.starterCode || "")}
                    className="text-[11px] text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset Starter Code</span>
                  </button>
                </div>
                <textarea
                  value={answers[currentQ.id] || ""}
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                  rows={10}
                  placeholder="// Implement your solution here..."
                  className="w-full p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500 resize-y leading-relaxed"
                />
              </div>
            )}

            {(currentQ.type === "architecture" ||
              currentQ.type === "system_design" ||
              currentQ.type === "short_answer") && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
                  Your Architectural Solution & Proposal:
                </label>
                <textarea
                  value={answers[currentQ.id] || ""}
                  onChange={(e) => handleAnswerChange(currentQ.id, e.target.value)}
                  rows={9}
                  placeholder="Detail your component design, communication protocols, caching strategies, and resilience considerations..."
                  className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl text-xs md:text-sm text-slate-200 focus:outline-none focus:border-emerald-500 resize-y font-sans leading-relaxed"
                />
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => toggleReview(currentQ.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition cursor-pointer ${
                markedForReview[currentQ.id]
                  ? "bg-amber-500/10 text-amber-400 border-amber-500/40 font-bold"
                  : "bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800"
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
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-200 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrentIdx((prev) => Math.min(prev + 1, questions.length - 1))}
                disabled={currentIdx === questions.length - 1}
                className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition disabled:opacity-30 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Question Palette */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">Question Palette</h3>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              {answeredCount}/{questions.length} Answered
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
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
                      ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-900 bg-emerald-500 text-slate-950 font-black shadow-lg"
                      : isMarked
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/50"
                      : hasAnswer
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
                  }`}
                >
                  <span>{idx + 1}</span>
                  {isMarked && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-1 right-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Palette Legend */}
          <div className="space-y-2 pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500/30 border border-emerald-500 inline-block" />
              <span>Answered ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-500 inline-block" />
              <span>Marked for Review ({Object.values(markedForReview).filter(Boolean).length})</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-slate-950 border border-slate-800 inline-block" />
              <span>Unanswered ({questions.length - answeredCount})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
              🚀
            </div>
            <h3 className="text-base font-bold text-white">Ready to Submit Your Assessment?</h3>
            <p className="text-xs text-slate-400">
              You have completed {answeredCount} out of {questions.length} questions. Once submitted, your answers cannot be modified.
            </p>
            <div className="flex justify-center gap-3 pt-2 text-xs">
              <button
                type="button"
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-semibold rounded-xl"
              >
                Return to Test
              </button>
              <button
                type="button"
                onClick={handleSubmitTest}
                disabled={isSubmitting}
                className="px-5 py-2 bg-emerald-500 text-slate-950 font-black rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Yes, Submit Final Answers"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
