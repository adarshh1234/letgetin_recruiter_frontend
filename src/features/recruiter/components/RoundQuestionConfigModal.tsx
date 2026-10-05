"use client";

import React, { useState } from "react";
import {
  X,
  Plus,
  Sparkles,
  Trash2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Loader2,
  BookOpen,
  Layers,
  Check,
  Award,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { domainAssessmentService } from "@/features/domainAssessment/services/domainAssessmentService";

export interface ConfiguredQuestionItem {
  id: string;
  target?: "ai_online_test" | "ai_assessment";
  section?: "mcq" | "descriptive" | "rapid";
  type: "mcq" | "coding" | "short_answer" | "descriptive" | "rapid";
  question: string;
  options?: Array<{ id: string; text: string }>;
  correctOptionId?: string;
  points?: number;
  timeLimitSeconds?: number;
  explanation?: string;
  sampleAnswer?: string;
  evaluationRubric?: string;
  difficulty?: "easy" | "medium" | "hard";
}

interface RoundQuestionConfigModalProps {
  open: boolean;
  onClose: () => void;
  roundId: string;
  roundType: string;
  roundName: string;
  durationMinutes?: number;
  passingScore?: number;
  jobTitle?: string;
  skills?: string[];
  initialQuestions?: ConfiguredQuestionItem[];
  onSaveQuestions: (questions: ConfiguredQuestionItem[]) => void;
}

export function RoundQuestionConfigModal({
  open,
  onClose,
  roundId,
  roundType,
  roundName,
  durationMinutes = 30,
  passingScore = 70,
  jobTitle = "Software Engineer",
  skills = [],
  initialQuestions = [],
  onSaveQuestions,
}: RoundQuestionConfigModalProps) {
  const [questions, setQuestions] = useState<ConfiguredQuestionItem[]>(initialQuestions);
  const [activeTab, setActiveTab] = useState<"ai_generator" | "manual_add">("ai_generator");

  // AI Generator Form State
  const [aiCount, setAiCount] = useState<number>(5);
  const [aiDifficulty, setAiDifficulty] = useState<string>("mid");
  const [isGenerating, setIsGenerating] = useState(false);

  // Manual Add Form State
  const [newQuestionText, setNewQuestionText] = useState("");
  const [options, setOptions] = useState([
    { id: "opt_a", text: "" },
    { id: "opt_b", text: "" },
    { id: "opt_c", text: "" },
    { id: "opt_d", text: "" },
  ]);
  const [correctOptionId, setCorrectOptionId] = useState("opt_a");
  const [newPoints, setNewPoints] = useState(1);
  const [newExplanation, setNewExplanation] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  // Sync initial questions when modal opens
  React.useEffect(() => {
    if (open) {
      setQuestions(initialQuestions || []);
      setFormError(null);
    }
  }, [open, initialQuestions]);

  if (!open) return null;

  // Handle AI Question Generation
  const handleGenerateAI = async () => {
    try {
      setIsGenerating(true);
      toast.loading(`Generating ${aiCount} questions for ${roundName}...`, { id: "gen-round-q" });

      const generated = await domainAssessmentService.generateRoundQuestions({
        roundType,
        roundName,
        jobTitle,
        skills,
        difficulty: aiDifficulty,
        count: aiCount,
      });

      if (Array.isArray(generated) && generated.length > 0) {
        setQuestions((prev) => [...prev, ...generated]);
        toast.dismiss("gen-round-q");
        toast.success(`Generated ${generated.length} high-quality questions for ${roundName}!`);
      } else {
        toast.dismiss("gen-round-q");
        toast.error("No questions were generated. Please try again or add manually.");
      }
    } catch (err: any) {
      toast.dismiss("gen-round-q");
      toast.error(err.response?.data?.message || "Failed to generate questions via AI.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Manual Question Add
  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newQuestionText.trim()) {
      setFormError("Question text is required.");
      return;
    }

    const filledOptions = options.filter((o) => o.text.trim().length > 0);
    if (filledOptions.length < 2) {
      setFormError("Please provide at least 2 options for this multiple-choice question.");
      return;
    }

    const correct = options.find((o) => o.id === correctOptionId);
    if (!correct || !correct.text.trim()) {
      setFormError("The selected correct answer cannot be empty.");
      return;
    }

    const created: ConfiguredQuestionItem = {
      id: `cq_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
      target: "ai_online_test",
      type: "mcq",
      question: newQuestionText.trim(),
      options: options.filter((o) => o.text.trim().length > 0),
      correctOptionId,
      points: Math.max(1, newPoints),
      explanation: newExplanation.trim() || undefined,
    };

    setQuestions((prev) => [...prev, created]);
    toast.success("Question added to round!");

    // Reset form
    setNewQuestionText("");
    setOptions([
      { id: "opt_a", text: "" },
      { id: "opt_b", text: "" },
      { id: "opt_c", text: "" },
      { id: "opt_d", text: "" },
    ]);
    setCorrectOptionId("opt_a");
    setNewPoints(1);
    setNewExplanation("");
  };

  const handleOptionChange = (id: string, text: string) => {
    setOptions((prev) => prev.map((o) => (o.id === id ? { ...o, text } : o)));
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  const handleSaveAndApply = () => {
    onSaveQuestions(questions);
    toast.success(`Saved ${questions.length} questions for ${roundName}`);
    onClose();
  };

  const totalPoints = questions.reduce((acc, q) => acc + (q.points || 1), 0);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-surface border border-border rounded-3xl shadow-2xl p-6 sm:p-7 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-glow shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-ink">{roundName}</h2>
                <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  {roundType.replace(/_/g, " ")}
                </span>
              </div>
              <p className="text-xs text-ink-soft mt-0.5">
                Configure, auto-generate with AI, or manually review test questions for this round.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden sm:inline-flex text-[11px] font-medium text-ink-soft bg-surface-alt border border-border px-2.5 py-1 rounded-xl">
              ⏱️ {durationMinutes} mins
            </span>
            <span className="hidden sm:inline-flex text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
              🎯 Pass: {passingScore}%
            </span>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 py-4 overflow-y-auto flex-1 pr-1">
          {/* Left Column: Generator / Add Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Tabs */}
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-surface-alt border border-border rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab("ai_generator")}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === "ai_generator"
                    ? "bg-gradient-brand text-white shadow-xs"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Generator</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("manual_add")}
                className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                  activeTab === "manual_add"
                    ? "bg-gradient-brand text-white shadow-xs"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Manual Question</span>
              </button>
            </div>

            {/* AI Generator Panel */}
            {activeTab === "ai_generator" && (
              <div className="p-4 rounded-2xl bg-surface-alt/60 border border-border/80 space-y-3.5">
                <div className="flex items-center gap-2 text-xs font-bold text-ink">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>AI Examination Engine</span>
                </div>
                <p className="text-[11px] text-ink-soft leading-relaxed">
                  Leverages AI to generate acute, tailored problem statements aligned with{" "}
                  <strong>{jobTitle}</strong> competencies.
                </p>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] font-semibold text-ink block mb-1">
                      Difficulty Level
                    </label>
                    <select
                      value={aiDifficulty}
                      onChange={(e) => setAiDifficulty(e.target.value)}
                      className="input-base text-xs py-1.5"
                    >
                      <option value="junior">Entry / Junior</option>
                      <option value="mid">Mid-Level</option>
                      <option value="senior">Senior</option>
                      <option value="lead">Principal / Lead</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-ink block mb-1">
                      Question Count
                    </label>
                    <select
                      value={aiCount}
                      onChange={(e) => setAiCount(parseInt(e.target.value) || 5)}
                      className="input-base text-xs py-1.5"
                    >
                      <option value={3}>3 Questions</option>
                      <option value={5}>5 Questions</option>
                      <option value={8}>8 Questions</option>
                      <option value={10}>10 Questions</option>
                    </select>
                  </div>
                </div>

                {skills.length > 0 && (
                  <div>
                    <label className="text-[11px] font-semibold text-ink block mb-1">
                      Context Skills
                    </label>
                    <div className="flex flex-wrap gap-1">
                      {skills.slice(0, 4).map((sk) => (
                        <span
                          key={sk}
                          className="text-[10px] font-medium bg-primary/10 text-primary-glow px-2 py-0.5 rounded-md"
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleGenerateAI}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-brand shadow-sm hover:opacity-95 transition disabled:opacity-50 cursor-pointer"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Generating with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate {aiCount} Questions Now</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Manual Add Panel */}
            {activeTab === "manual_add" && (
              <form onSubmit={handleAddManual} className="p-4 rounded-2xl bg-surface-alt/60 border border-border/80 space-y-3">
                <div>
                  <label className="text-[11px] font-semibold text-ink block mb-1">
                    Question Statement
                  </label>
                  <textarea
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="Enter the question or problem statement..."
                    className="input-base text-xs min-h-[70px] resize-y"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-semibold text-ink">Options</label>
                    <span className="text-[10px] text-ink-soft">Select radio for correct answer</span>
                  </div>
                  {options.map((opt, idx) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctRadio"
                        checked={correctOptionId === opt.id}
                        onChange={() => setCorrectOptionId(opt.id)}
                        className="w-3.5 h-3.5 text-primary cursor-pointer shrink-0"
                      />
                      <span className="text-xs font-bold text-ink-soft w-4 shrink-0">
                        {String.fromCharCode(65 + idx)}:
                      </span>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + idx)} text`}
                        className="input-base text-xs py-1 flex-1"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <label className="text-[11px] font-semibold text-ink block mb-1">
                      Score Points
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={newPoints}
                      onChange={(e) => setNewPoints(Math.max(1, parseInt(e.target.value) || 1))}
                      className="input-base text-xs py-1"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-ink block mb-1">
                      Explanation (Optional)
                    </label>
                    <input
                      type="text"
                      value={newExplanation}
                      onChange={(e) => setNewExplanation(e.target.value)}
                      placeholder="Why this answer is correct"
                      className="input-base text-xs py-1"
                    />
                  </div>
                </div>

                {formError && (
                  <p className="text-[11px] text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-2 font-medium">
                    ⚠️ {formError}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-white bg-gradient-brand shadow-sm hover:opacity-95 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Question to Round</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Questions Review List (7 cols) */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-primary-glow" />
                <span className="text-xs font-bold text-ink">
                  Configured Questions ({questions.length})
                </span>
              </div>
              <div className="text-[11px] font-semibold text-ink-soft">
                Total Score Weight: <strong className="text-primary-glow">{totalPoints} pts</strong>
              </div>
            </div>

            {questions.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-border/80 bg-surface-alt/30 text-center">
                <BookOpen className="w-8 h-8 text-ink-soft mb-2 stroke-1" />
                <p className="text-xs font-bold text-ink">No questions in this round yet</p>
                <p className="text-[11px] text-ink-soft max-w-xs mt-1">
                  Use the AI Generator on the left or add your custom questions to formulate this assessment round.
                </p>
              </div>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[500px] pr-1">
                {questions.map((q, idx) => (
                  <div
                    key={q.id || `q_${idx}`}
                    className="p-3.5 rounded-2xl bg-surface border border-border/90 hover:border-primary/40 transition shadow-2xs space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-primary/10 text-primary-glow font-bold text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <span className="text-[11px] font-bold text-ink uppercase tracking-wider">
                          {q.points || 1} {q.points === 1 ? "pt" : "pts"}
                        </span>
                        {(q.section === "rapid" || q.type === "rapid" || Boolean(q.timeLimitSeconds)) && (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-500/10 border border-amber-500/25 px-1.5 py-0.2 rounded-full">
                            ⚡ Rapid ({q.timeLimitSeconds || 30}s)
                          </span>
                        )}
                        {(q.section === "descriptive" || q.type === "descriptive" || (!q.options || q.options.length === 0)) && (
                          <span className="text-[10px] font-bold text-purple-600 bg-purple-500/10 border border-purple-500/25 px-1.5 py-0.2 rounded-full">
                            Descriptive
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1 rounded-lg text-ink-soft hover:text-destructive hover:bg-destructive/10 transition cursor-pointer"
                        title="Delete question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs font-medium text-ink leading-relaxed">
                      {q.question}
                    </p>

                    {/* Options Preview */}
                    {q.options && q.options.length > 0 && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                        {q.options.map((opt) => {
                          const isCorrect = q.correctOptionId === opt.id;
                          return (
                            <div
                              key={opt.id}
                              className={`flex items-center gap-2 p-2 rounded-xl text-[11px] border transition ${
                                isCorrect
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300 font-semibold"
                                  : "bg-surface-alt/40 border-border/60 text-ink-soft"
                              }`}
                            >
                              <div
                                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0 ${
                                  isCorrect
                                    ? "bg-emerald-500 text-white"
                                    : "bg-border text-ink-soft"
                                }`}
                              >
                                {isCorrect ? "✓" : ""}
                              </div>
                              <span className="truncate">{opt.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {q.explanation && (
                      <p className="text-[10px] text-ink-soft italic bg-surface-alt/50 p-2 rounded-lg border border-border/40">
                        💡 {q.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border pt-4 flex items-center justify-between gap-3">
          <div className="text-xs text-ink-soft">
            {questions.length === 0 ? (
              <span>⚠️ At least 1 question is recommended before publishing</span>
            ) : (
              <span>
                Ready: <strong>{questions.length} questions</strong> configured for candidate testing.
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAndApply}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-brand shadow-sm hover:opacity-95 transition hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save &amp; Apply Questions ({questions.length})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
