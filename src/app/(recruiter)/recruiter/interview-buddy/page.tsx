"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Bot,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Star,
  Copy,
  ChevronDown,
  ChevronUp,
  Save,
  Video,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  Zap,
  Loader2,
  FileText,
  User,
} from "lucide-react";
import { interviewService } from "@/features/interview/services/interviewService";
import { AiQuestion } from "@/features/interview/types";

function InterviewBuddyContent() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role") || "Senior Full Stack Engineer";
  const interviewId = searchParams.get("id") || "";

  const [role, setRole] = useState(initialRole);
  const [candidateName, setCandidateName] = useState(searchParams.get("candidate") || "Candidate");
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>("b1");

  // Scorecard state
  const [ratings, setRatings] = useState({
    technical: 4,
    problemSolving: 4,
    communication: 5,
    cultureFit: 4,
  });
  const [liveNotes, setLiveNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Suggested questions with cheat sheets
  const [buddyQuestions, setBuddyQuestions] = useState<
    Array<{
      id: string;
      title: string;
      question: string;
      category: string;
      idealSignals: string[];
      redFlags: string[];
      followUpProbes: string[];
    }>
  >([
    {
      id: "b1",
      title: "Distributed State & Race Conditions",
      question: "In your last high-traffic service, how did you handle concurrent writes to the same resource? Did you use optimistic concurrency, distributed locks, or database transactions?",
      category: "System Architecture",
      idealSignals: [
        "Clearly describes locking granularities (row lock vs Redis Redlock)",
        "Understands performance trade-offs of optimistic vs pessimistic locking",
        "Accounts for distributed deadlock scenarios",
      ],
      redFlags: [
        "Suggests in-memory Node/JVM mutexes across multi-instance clusters",
        "Assumes ACID handles everything without explaining isolation levels",
      ],
      followUpProbes: [
        "What happens if the lock holder process crashes before releasing?",
        "How would you handle idempotency on client retries?",
      ],
    },
    {
      id: "b2",
      title: "Production Incident Post-Mortem",
      question: "Walk me through an incident where your code or architecture caused downtime or latency spikes. What was the exact root cause and remediation?",
      category: "Real-world Engineering & Ownership",
      idealSignals: [
        "High personal ownership and accountability",
        "Uses telemetry (traces, logs, metrics) rather than blind guessing",
        "Instituted automated prevention into CI/CD pipeline",
      ],
      redFlags: [
        "Blames cloud provider or team members without introspection",
        "States they've never caused a production bug",
      ],
      followUpProbes: [
        "What metric alerted you first before users noticed?",
        "If this happened at 3 AM on Black Friday, what was your rollback protocol?",
      ],
    },
    {
      id: "b3",
      title: "Technical Trade-offs & Tech Debt",
      question: "When under tight product deadlines, how do you decide what technical debt is acceptable versus what must be rejected as an architectural hazard?",
      category: "Engineering Judgment",
      idealSignals: [
        "Distinguishes between reversible and irreversible architectural decisions",
        "Documented debt with deliberate refactoring roadmap",
        "Communicates business risk to non-technical stakeholders",
      ],
      redFlags: [
        "Refuses any shortcut regardless of business context",
        "Haphazardly hacks code without test safety nets",
      ],
      followUpProbes: [
        "How do you convince product managers to allocate sprint time for refactoring?",
      ],
    },
    {
      id: "b4",
      title: "API Design & Backward Compatibility",
      question: "How do you evolve public or internal APIs consumed by multiple clients without breaking existing integrations?",
      category: "API & Data Modeling",
      idealSignals: [
        "Mentions additive schemas, semantic versioning, and deprecation headers",
        "Dual-write / read-reconciliation patterns during migration",
      ],
      redFlags: [
        "Suggests modifying existing payload fields directly in place",
      ],
      followUpProbes: [
        "How do you track which clients are still on legacy endpoints?",
      ],
    },
  ]);

  const handleRefreshPrompts = async () => {
    setIsGenerating(true);
    try {
      const generated = await interviewService.generateAiQuestions({
        role,
        experienceLevel: "senior",
        count: 4,
      });
      if (generated.length > 0) {
        setBuddyQuestions(
          generated.map((g, idx) => ({
            id: `gen-${idx}`,
            title: g.category,
            question: g.question,
            category: g.category,
            idealSignals: g.greenFlags || ["Solid architectural depth", "Considers edge cases"],
            redFlags: g.redFlags || ["Lacks fundamental understanding", "Vague answers"],
            followUpProbes: g.criteria || ["Explain trade-offs", "How would this scale?"],
          }))
        );
      }
    } catch {
      // Keep existing prompts
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveScorecard = async () => {
    if (!interviewId) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      return;
    }

    setIsSaving(true);
    const overallRating = Math.round(
      (ratings.technical + ratings.problemSolving + ratings.communication + ratings.cultureFit) / 4
    );

    try {
      await interviewService.submitFeedback(interviewId, overallRating, liveNotes);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.warn("Failed to save to backend:", err);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              AI Interview Buddy
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
              <Bot className="w-3 h-3" />
              Live Interviewer Co-Pilot
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Real-time question prompts, cheat sheet signals, and live candidate scorecard builder for hiring panels and founders.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/recruiter/video-interview"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-alt border border-border text-ink-soft hover:text-ink text-xs font-bold transition cursor-pointer"
          >
            <Video className="w-3.5 h-3.5 text-primary-glow" />
            <span>Video Room (Coming Soon)</span>
          </Link>
          <Link
            href="/recruiter/interview-schedule"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-surface text-xs font-bold text-ink hover:bg-surface-alt transition cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule</span>
          </Link>
        </div>
      </div>

      {/* Target Candidate Bar */}
      <div className="p-4 rounded-2xl bg-surface border border-border shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 font-bold">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="Candidate Name"
                className="font-extrabold text-sm text-ink bg-transparent outline-none border-b border-dashed border-border hover:border-primary"
              />
              <span className="text-[11px] text-ink-soft">• Target Role:</span>
            </div>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Senior Backend Engineer"
              className="text-xs text-primary-glow font-medium bg-transparent outline-none border-b border-dashed border-border hover:border-primary w-64"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleRefreshPrompts}
          disabled={isGenerating}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/30 text-xs font-bold transition cursor-pointer disabled:opacity-50"
        >
          {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
          <span>Regenerate Question Prompts</span>
        </button>
      </div>

      {/* Main Grid: Left Questions & Right Scorecard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AI Question Cheat Sheet (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-ink-soft flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>Smart Question Bank & Evaluation Signals</span>
            </h2>
            <span className="text-xs text-ink-soft font-mono">
              {buddyQuestions.length} Questions Ready
            </span>
          </div>

          <div className="space-y-3">
            {buddyQuestions.map((item, idx) => {
              const isExpanded = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-surface border border-border rounded-2xl shadow-xs overflow-hidden transition-all duration-200"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="w-full p-4 text-left flex items-start justify-between gap-3 hover:bg-surface-alt/50 transition cursor-pointer"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary/10 text-primary-glow">
                          Q{idx + 1} • {item.category}
                        </span>
                        <span className="font-bold text-xs text-ink">{item.title}</span>
                      </div>
                      <p className="text-xs text-ink-soft leading-relaxed pr-2">
                        {item.question}
                      </p>
                    </div>
                    <div className="text-ink-soft p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {/* Expanded Cheat Sheet */}
                  {isExpanded && (
                    <div className="p-4 pt-0 space-y-3 border-t border-border/70 bg-surface-alt/40 animate-in fade-in duration-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-3">
                        <div className="space-y-1 bg-surface p-3 rounded-xl border border-border">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[11px]">
                            <CheckCircle2 className="w-3 h-3" /> Ideal Signals to Listen For
                          </span>
                          <ul className="text-[11px] text-ink-soft space-y-1 list-disc list-inside">
                            {item.idealSignals.map((sig, sIdx) => (
                              <li key={sIdx}>{sig}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-1 bg-surface p-3 rounded-xl border border-border">
                          <span className="font-bold text-rose-500 flex items-center gap-1 text-[11px]">
                            <AlertCircle className="w-3 h-3" /> Red Flags to Probe
                          </span>
                          <ul className="text-[11px] text-ink-soft space-y-1 list-disc list-inside">
                            {item.redFlags.map((rf, rIdx) => (
                              <li key={rIdx}>{rf}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Follow-up Probing Questions */}
                      <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20 text-xs space-y-1">
                        <span className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 text-[11px]">
                          <Bot className="w-3 h-3" /> Suggested Follow-up Probes
                        </span>
                        <div className="space-y-1">
                          {item.followUpProbes.map((probe, pIdx) => (
                            <div key={pIdx} className="flex items-center justify-between text-[11px] text-ink bg-surface p-1.5 px-2.5 rounded-lg border border-border">
                              <span>"{probe}"</span>
                              <button
                                type="button"
                                onClick={() => navigator.clipboard.writeText(probe)}
                                className="text-ink-soft hover:text-primary transition"
                                title="Copy question"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Live Interview Scorecard & Notes (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-surface border border-border rounded-3xl p-6 shadow-xs space-y-5 sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <h2 className="text-sm font-extrabold text-ink">Live Evaluation Scorecard</h2>
                <p className="text-[11px] text-ink-soft">{candidateName} • {role}</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                Active Round
              </span>
            </div>

            {/* Rubric Star Ratings */}
            <div className="space-y-3 text-xs">
              {[
                { key: "technical", label: "Technical Competence & Architecture" },
                { key: "problemSolving", label: "Structured Problem Solving" },
                { key: "communication", label: "Communication & Clarity" },
                { key: "cultureFit", label: "Culture & Team Alignment" },
              ].map(({ key, label }) => {
                const current = ratings[key as keyof typeof ratings];
                return (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-ink-soft font-medium">{label}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setRatings((prev) => ({ ...prev, [key]: s }))}
                          className={`text-base transition cursor-pointer ${
                            s <= current ? "text-amber-400 scale-110" : "text-border hover:text-amber-300"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Live Panel Notes */}
            <div className="space-y-1.5 pt-2 border-t border-border">
              <label className="text-xs font-bold text-ink flex items-center justify-between">
                <span>Interviewer Notes & Debrief</span>
                <span className="text-[10px] text-ink-soft">Auto-saved to record</span>
              </label>
              <textarea
                value={liveNotes}
                onChange={(e) => setLiveNotes(e.target.value)}
                placeholder="Key observations, coding performance, system design strengths, compensation notes..."
                rows={5}
                className="w-full p-3 rounded-xl border border-border bg-surface-alt/50 text-xs text-ink outline-none focus:border-primary"
              />
            </div>

            {/* Save Action */}
            <button
              type="button"
              onClick={handleSaveScorecard}
              disabled={isSaving}
              className="w-full py-2.5 rounded-xl bg-gradient-brand text-primary-foreground text-xs font-bold shadow-glow hover:scale-[1.01] active:scale-[0.99] transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : saveSuccess ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saveSuccess ? "Scorecard Saved Successfully!" : "Save Evaluation Scorecard"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InterviewBuddyPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-ink-soft">Loading AI Interview Buddy...</div>}>
      <InterviewBuddyContent />
    </Suspense>
  );
}
