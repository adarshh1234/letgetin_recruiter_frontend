"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Sparkles,
  Plus,
  Trash2,
  Edit3,
  MoveUp,
  MoveDown,
  CheckCircle2,
  Code2,
  FileQuestion,
  Layers,
  Save,
  Check,
  X,
  AlertCircle,
  Eye,
  Loader2,
  Terminal,
} from "lucide-react";
import { toast } from "sonner";
import { domainAssessmentService } from "@/features/domainAssessment/services/domainAssessmentService";
import {
  DomainAssessment,
  AssessmentQuestion,
  QuestionType,
  TestingMode,
} from "@/features/domainAssessment/types";

export default function QuestionManagementStudioPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

  const [assessment, setAssessment] = useState<DomainAssessment | null>(null);
  const [questions, setQuestions] = useState<AssessmentQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isGeneratingMore, setIsGeneratingMore] = useState(false);

  // Question editing modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<AssessmentQuestion | null>(null);

  // Form states for modal
  const [formTitle, setFormTitle] = useState("");
  const [formPrompt, setFormPrompt] = useState("");
  const [formType, setFormType] = useState<QuestionType>("mcq");
  const [formMode, setFormMode] = useState<TestingMode>("coding");
  const [formSkill, setFormSkill] = useState("");
  const [formPoints, setFormPoints] = useState(10);
  const [formInstructions, setFormInstructions] = useState("");
  const [formContext, setFormContext] = useState("");
  const [formStarterCode, setFormStarterCode] = useState("");
  const [formLanguage, setFormLanguage] = useState("javascript");
  const [formExpectedAnswer, setFormExpectedAnswer] = useState("");

  // MCQ options state
  const [mcqOptions, setMcqOptions] = useState<Array<{ id: string; text: string }>>([
    { id: "opt_a", text: "" },
    { id: "opt_b", text: "" },
    { id: "opt_c", text: "" },
    { id: "opt_d", text: "" },
  ]);
  const [correctOptionId, setCorrectOptionId] = useState("opt_a");

  // Load Assessment & Questions
  const loadData = async () => {
    try {
      setLoading(true);
      const data = await domainAssessmentService.getAssessmentById(id);
      setAssessment(data);
      setQuestions(data.questions || []);
    } catch (err: any) {
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadData();
  }, [id]);

  // Save questions changes to backend
  const saveQuestions = async (updatedList: AssessmentQuestion[]) => {
    try {
      setSaving(true);
      const updated = await domainAssessmentService.updateAssessment(id, {
        questions: updatedList,
      });
      setAssessment(updated);
      setQuestions(updated.questions || []);
      toast.success("Questions updated successfully!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to save questions");
    } finally {
      setSaving(false);
    }
  };

  // AI Generate More Questions
  const handleGenerateMore = async () => {
    if (!assessment) return;
    try {
      setIsGeneratingMore(true);
      toast.loading("AI is generating 3 new questions...", { id: "gen-more" });

      const newBatch = await domainAssessmentService.generateQuestions({
        domain: assessment.domain,
        role: assessment.role,
        skillAreas: assessment.skillAreas,
        difficulty: assessment.difficulty,
        testingModes: assessment.testingModes,
        count: 3,
        jobDescription: assessment.jobDescription,
        customInstructions: assessment.customInstructions,
      });

      const startOrder = questions.length + 1;
      const formatted = newBatch.map((q, idx) => ({
        ...q,
        id: `q_${Date.now()}_${idx}`,
        order: startOrder + idx,
      }));

      const combined = [...questions, ...formatted];
      await saveQuestions(combined);
      toast.dismiss("gen-more");
      toast.success("3 new questions added to the assessment!");
    } catch (err: any) {
      toast.dismiss("gen-more");
      toast.error("Failed to generate additional questions");
    } finally {
      setIsGeneratingMore(false);
    }
  };

  // Reorder question Up
  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const reordered = [...questions];
    const temp = reordered[idx];
    reordered[idx] = reordered[idx - 1];
    reordered[idx - 1] = temp;
    reordered.forEach((q, i) => (q.order = i + 1));
    saveQuestions(reordered);
  };

  // Reorder question Down
  const moveDown = (idx: number) => {
    if (idx === questions.length - 1) return;
    const reordered = [...questions];
    const temp = reordered[idx];
    reordered[idx] = reordered[idx + 1];
    reordered[idx + 1] = temp;
    reordered.forEach((q, i) => (q.order = i + 1));
    saveQuestions(reordered);
  };

  // Delete question
  const handleDelete = (qId: string) => {
    if (!confirm("Are you sure you want to remove this question?")) return;
    const filtered = questions.filter((q) => q.id !== qId);
    filtered.forEach((q, i) => (q.order = i + 1));
    saveQuestions(filtered);
  };

  // Open modal to add new question
  const handleOpenAddModal = () => {
    setEditingQuestion(null);
    setFormTitle("");
    setFormPrompt("");
    setFormType("mcq");
    setFormMode(assessment?.testingModes?.[0] || "coding");
    setFormSkill(assessment?.skillAreas?.[0] || "Core Technical");
    setFormPoints(10);
    setFormInstructions("");
    setFormContext("");
    setFormStarterCode("");
    setFormLanguage("javascript");
    setFormExpectedAnswer("");
    setMcqOptions([
      { id: "opt_a", text: "" },
      { id: "opt_b", text: "" },
      { id: "opt_c", text: "" },
      { id: "opt_d", text: "" },
    ]);
    setCorrectOptionId("opt_a");
    setIsModalOpen(true);
  };

  // Open modal to edit existing question
  const handleOpenEditModal = (q: AssessmentQuestion) => {
    setEditingQuestion(q);
    setFormTitle(q.title || "");
    setFormPrompt(q.question || "");
    setFormType(q.type || "mcq");
    setFormMode(q.testingMode || "coding");
    setFormSkill(q.skill || "");
    setFormPoints(q.points || 10);
    setFormInstructions(q.instructions || "");
    setFormContext(q.context || "");
    setFormStarterCode(q.starterCode || "");
    setFormLanguage(q.language || "javascript");
    setFormExpectedAnswer(q.expectedAnswer || "");

    if (q.options && q.options.length > 0) {
      setMcqOptions(q.options);
      setCorrectOptionId(q.correctOptionId || q.options[0].id);
    } else {
      setMcqOptions([
        { id: "opt_a", text: "" },
        { id: "opt_b", text: "" },
        { id: "opt_c", text: "" },
        { id: "opt_d", text: "" },
      ]);
      setCorrectOptionId("opt_a");
    }

    setIsModalOpen(true);
  };

  // Save Modal
  const handleModalSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPrompt.trim()) {
      toast.error("Please enter a question prompt.");
      return;
    }

    const payload: AssessmentQuestion = {
      id: editingQuestion?.id || `q_${Date.now()}`,
      order: editingQuestion?.order || questions.length + 1,
      title: formTitle.trim() || `Question ${editingQuestion?.order || questions.length + 1}`,
      question: formPrompt.trim(),
      type: formType,
      testingMode: formMode,
      skill: formSkill.trim() || "General Engineering",
      difficulty: assessment?.difficulty || "mid",
      points: Number(formPoints) || 10,
      instructions: formInstructions.trim(),
      context: formContext.trim(),
      starterCode: formStarterCode,
      language: formLanguage,
      options: formType === "mcq" ? mcqOptions : undefined,
      correctOptionId: formType === "mcq" ? correctOptionId : undefined,
      expectedAnswer: formExpectedAnswer.trim(),
    };

    let updatedList: AssessmentQuestion[];
    if (editingQuestion) {
      updatedList = questions.map((q) => (q.id === editingQuestion.id ? payload : q));
    } else {
      updatedList = [...questions, payload];
    }

    setIsModalOpen(false);
    saveQuestions(updatedList);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-alt/20 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-ink-soft">Loading Question Studio...</p>
        </div>
      </div>
    );
  }

  const totalPoints = questions.reduce((sum, q) => sum + (q.points || 10), 0);

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
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black tracking-tight text-ink">Question Management Studio</h1>
              <span className="text-xs font-bold text-primary-glow bg-primary/10 px-2.5 py-0.5 rounded-full capitalize">
                {assessment?.domain}
              </span>
            </div>
            <p className="text-xs md:text-sm text-ink-soft mt-0.5">
              {questions.length} Questions • {totalPoints} Total Points • Level:{" "}
              <span className="capitalize font-semibold text-ink">{assessment?.difficulty}</span>
            </p>
          </div>
        </div>

        {/* Studio Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleGenerateMore}
            disabled={isGeneratingMore}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 border border-purple-500/30 text-xs font-bold transition disabled:opacity-50 cursor-pointer"
          >
            {isGeneratingMore ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>AI Generate More</span>
          </button>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-3.5 py-2 bg-surface border border-border hover:bg-surface-alt text-xs font-bold rounded-xl transition text-ink cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Question</span>
          </button>

          <Link
            href={`/recruiter/domain-assessments/${id}/preview`}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-brand text-primary-foreground text-xs font-bold rounded-xl shadow-glow hover:scale-105 transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Candidate Preview →</span>
          </Link>
        </div>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="bg-surface rounded-3xl p-12 text-center border border-border max-w-lg mx-auto space-y-4 shadow-sm">
          <FileQuestion className="w-12 h-12 text-primary-glow mx-auto" />
          <h2 className="text-lg font-bold text-ink">No questions yet</h2>
          <p className="text-xs text-ink-soft">
            Use AI Generation to quickly populate questions tailored to your testing modes and skill areas, or manually add your own custom questions.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleGenerateMore}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-brand text-primary-foreground text-xs font-bold rounded-xl shadow-glow"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate with AI</span>
            </button>
            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-surface border border-border text-xs font-bold rounded-xl text-ink"
            >
              Add Manually
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 max-w-5xl mx-auto">
          {questions.map((q, qIdx) => {
            return (
              <div
                key={q.id || qIdx}
                className="bg-surface rounded-2xl p-5 border border-border/80 shadow-sm space-y-3.5 transition hover:border-primary/40 group"
              >
                {/* Question Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-surface-alt font-black text-xs text-ink flex items-center justify-center border border-border">
                      {qIdx + 1}
                    </span>
                    <h3 className="text-sm font-bold text-ink">{q.title || `Question ${qIdx + 1}`}</h3>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 px-2.5 py-0.5 rounded-full uppercase">
                      Mode: {q.testingMode}
                    </span>

                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full uppercase">
                      Type: {q.type}
                    </span>

                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      {q.points || 10} pts
                    </span>

                    <span className="text-[10px] font-semibold text-ink-soft bg-surface-alt px-2 py-0.5 rounded-full border border-border">
                      {q.skill}
                    </span>

                    {/* Reorder & Action Buttons */}
                    <div className="flex items-center gap-1 pl-2 border-l border-border/60">
                      <button
                        type="button"
                        onClick={() => moveUp(qIdx)}
                        disabled={qIdx === 0}
                        className="p-1 rounded hover:bg-surface-alt text-ink-soft hover:text-ink disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => moveDown(qIdx)}
                        disabled={qIdx === questions.length - 1}
                        className="p-1 rounded hover:bg-surface-alt text-ink-soft hover:text-ink disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(q)}
                        className="p-1 rounded hover:bg-surface-alt text-ink-soft hover:text-primary-glow cursor-pointer"
                        title="Edit Question"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(q.id)}
                        className="p-1 rounded hover:bg-surface-alt text-ink-soft hover:text-rose-500 cursor-pointer"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Question Prompt */}
                <div className="text-xs md:text-sm text-ink leading-relaxed whitespace-pre-line font-medium">
                  {q.question}
                </div>

                {/* Context (if any) */}
                {q.context && (
                  <div className="text-xs bg-surface-alt/40 p-3 rounded-xl border border-border/60 text-ink-soft">
                    <span className="font-bold text-ink block mb-0.5">Context / Scenario:</span>
                    {q.context}
                  </div>
                )}

                {/* MCQ Options preview */}
                {q.type === "mcq" && q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt) => {
                      const isCorrect = q.correctOptionId === opt.id;
                      return (
                        <div
                          key={opt.id}
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                            isCorrect
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-bold"
                              : "bg-surface-alt/30 border-border text-ink"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-surface border border-border flex items-center justify-center font-bold text-[10px]">
                              {opt.id.replace("opt_", "").toUpperCase()}
                            </span>
                            <span>{opt.text}</span>
                          </div>
                          {isCorrect && (
                            <span className="text-[10px] text-emerald-600 uppercase font-black">
                              Correct ✓
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Starter Code snippet preview */}
                {(q.type === "coding" || q.type === "debugging") && q.starterCode && (
                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-ink-soft flex items-center gap-1.5">
                      <Code2 className="w-3.5 h-3.5 text-primary-glow" />
                      <span>Starter Code ({q.language || "javascript"}):</span>
                    </div>
                    <pre className="p-3 bg-slate-950 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto border border-slate-800">
                      <code>{q.starterCode}</code>
                    </pre>
                  </div>
                )}

                {/* Expected Answer / Evaluation criteria */}
                {q.expectedAnswer && (
                  <div className="text-[11px] bg-amber-500/5 border border-amber-500/20 p-2.5 rounded-xl text-amber-700 dark:text-amber-300">
                    <span className="font-bold block">Evaluation Rubric & Benchmark:</span>
                    <span>{q.expectedAnswer}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-surface border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h2 className="text-base font-bold text-ink">
                {editingQuestion ? "Edit Assessment Question" : "Add Custom Question"}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-ink-soft hover:text-ink hover:bg-surface-alt"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleModalSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-ink-soft block mb-1">Question Title</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Distributed Caching Strategy"
                    className="w-full px-3 py-2 bg-surface-alt/40 border border-border rounded-xl text-ink focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-ink-soft block mb-1">Target Skill Area</label>
                  <input
                    type="text"
                    value={formSkill}
                    onChange={(e) => setFormSkill(e.target.value)}
                    placeholder="e.g. System Design, Databases"
                    className="w-full px-3 py-2 bg-surface-alt/40 border border-border rounded-xl text-ink focus:outline-none focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-ink-soft block mb-1">Question Type</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as QuestionType)}
                    className="w-full px-3 py-2 bg-surface-alt/40 border border-border rounded-xl text-ink focus:outline-none focus:border-primary capitalize"
                  >
                    <option value="mcq">Multiple Choice (MCQ)</option>
                    <option value="coding">Live Coding Challenge</option>
                    <option value="architecture">Software Architecture</option>
                    <option value="system_design">System Design</option>
                    <option value="debugging">Code Debugging</option>
                    <option value="short_answer">Short Answer</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-ink-soft block mb-1">Testing Mode</label>
                  <select
                    value={formMode}
                    onChange={(e) => setFormMode(e.target.value as TestingMode)}
                    className="w-full px-3 py-2 bg-surface-alt/40 border border-border rounded-xl text-ink focus:outline-none focus:border-primary capitalize"
                  >
                    <option value="coding">Live Coding</option>
                    <option value="architecture">Software Architecture</option>
                    <option value="system">System Design</option>
                    <option value="debugging">Code Debugging</option>
                    <option value="database">Database & API</option>
                    <option value="security">Security</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-ink-soft block mb-1">Points</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formPoints}
                    onChange={(e) => setFormPoints(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-surface-alt/40 border border-border rounded-xl text-ink focus:outline-none focus:border-primary font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-ink-soft block mb-1">Question Statement *</label>
                <textarea
                  value={formPrompt}
                  onChange={(e) => setFormPrompt(e.target.value)}
                  rows={3}
                  placeholder="Detail the technical challenge or problem statement..."
                  className="w-full px-3 py-2 bg-surface-alt/40 border border-border rounded-xl text-ink focus:outline-none focus:border-primary font-sans"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-ink-soft block mb-1">
                  Context / Scenario (Optional)
                </label>
                <textarea
                  value={formContext}
                  onChange={(e) => setFormContext(e.target.value)}
                  rows={2}
                  placeholder="Architectural scenario, system setup, or dataset background..."
                  className="w-full px-3 py-2 bg-surface-alt/40 border border-border rounded-xl text-ink focus:outline-none focus:border-primary font-sans"
                />
              </div>

              {/* MCQ Options */}
              {formType === "mcq" && (
                <div className="space-y-2.5 pt-2 border-t border-border/60">
                  <label className="font-bold text-ink block">Multiple Choice Options</label>
                  {mcqOptions.map((opt, oIdx) => (
                    <div key={opt.id} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correct_option"
                        checked={correctOptionId === opt.id}
                        onChange={() => setCorrectOptionId(opt.id)}
                        className="w-4 h-4 text-emerald-500 accent-emerald-500 cursor-pointer"
                        title="Mark as Correct Option"
                      />
                      <span className="w-6 font-bold uppercase">{opt.id.replace("opt_", "")}</span>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => {
                          const updated = [...mcqOptions];
                          updated[oIdx].text = e.target.value;
                          setMcqOptions(updated);
                        }}
                        placeholder={`Option ${opt.id.replace("opt_", "").toUpperCase()} text...`}
                        className="flex-1 px-3 py-1.5 bg-surface-alt/40 border border-border rounded-xl text-ink focus:outline-none focus:border-primary"
                        required
                      />
                    </div>
                  ))}
                  <p className="text-[11px] text-ink-soft">
                    Select the radio button beside the correct answer.
                  </p>
                </div>
              )}

              {/* Code Editor for Coding / Debugging */}
              {(formType === "coding" || formType === "debugging") && (
                <div className="space-y-2 pt-2 border-t border-border/60">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-ink">Starter Code</label>
                    <select
                      value={formLanguage}
                      onChange={(e) => setFormLanguage(e.target.value)}
                      className="px-2 py-1 bg-surface-alt border border-border rounded-lg text-ink font-mono text-[11px]"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="python">Python</option>
                      <option value="sql">SQL</option>
                    </select>
                  </div>
                  <textarea
                    value={formStarterCode}
                    onChange={(e) => setFormStarterCode(e.target.value)}
                    rows={4}
                    placeholder="// Starter template or buggy code..."
                    className="w-full p-3 bg-slate-950 text-slate-200 border border-slate-800 rounded-xl font-mono text-xs focus:outline-none focus:border-primary"
                  />
                </div>
              )}

              {/* Expected Answer */}
              {formType !== "mcq" && (
                <div className="space-y-1 pt-2 border-t border-border/60">
                  <label className="font-bold text-ink">Expected Answer / Evaluation Rubric</label>
                  <textarea
                    value={formExpectedAnswer}
                    onChange={(e) => setFormExpectedAnswer(e.target.value)}
                    rows={2}
                    placeholder="Criteria evaluated by AI for full marks..."
                    className="w-full px-3 py-2 bg-surface-alt/40 border border-border rounded-xl text-ink focus:outline-none focus:border-primary font-sans"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-surface border border-border rounded-xl text-ink font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-brand text-primary-foreground font-bold rounded-xl shadow-glow"
                >
                  {editingQuestion ? "Save Question" : "Add Question"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
