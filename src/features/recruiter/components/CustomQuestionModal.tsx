"use client";

import React, { useState } from "react";
import { X, Plus, Check, Code, FileQuestion, Trash2, HelpCircle } from "lucide-react";

export interface CustomQuestionItem {
  id: string;
  target: "ai_online_test" | "ai_assessment";
  type: "mcq" | "coding";
  question: string;
  options?: { id: string; text: string }[];
  correctOptionId?: string;
  codingDetails?: {
    difficulty?: "easy" | "medium" | "hard";
    sampleInput?: string;
    sampleOutput?: string;
  };
  points?: number;
}

interface CustomQuestionModalProps {
  open: boolean;
  onClose: () => void;
  target: "ai_online_test" | "ai_assessment";
  onAddQuestion: (question: CustomQuestionItem) => void;
}

export function CustomQuestionModal({
  open,
  onClose,
  target,
  onAddQuestion,
}: CustomQuestionModalProps) {
  const [questionType, setQuestionType] = useState<"mcq" | "coding">(
    target === "ai_assessment" ? "mcq" : "mcq"
  );
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState([
    { id: "opt_a", text: "" },
    { id: "opt_b", text: "" },
    { id: "opt_c", text: "" },
    { id: "opt_d", text: "" },
  ]);
  const [correctOptionId, setCorrectOptionId] = useState("opt_a");

  // Coding problem fields
  const [codingDifficulty, setCodingDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [sampleInput, setSampleInput] = useState("");
  const [sampleOutput, setSampleOutput] = useState("");
  const [points, setPoints] = useState(target === "ai_online_test" ? 1 : 5);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleOptionChange = (id: string, text: string) => {
    setOptions((prev) => prev.map((opt) => (opt.id === id ? { ...opt, text } : opt)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!questionText.trim()) {
      setError("Please enter the question text or problem description.");
      return;
    }

    if (questionType === "mcq") {
      const filledOptions = options.filter((o) => o.text.trim().length > 0);
      if (filledOptions.length < 2) {
        setError("Please provide at least 2 options for the MCQ question.");
        return;
      }
      const correctOpt = options.find((o) => o.id === correctOptionId);
      if (!correctOpt || !correctOpt.text.trim()) {
        setError("The correct option cannot be an empty option.");
        return;
      }

      onAddQuestion({
        id: `cq_${Date.now().toString(36)}`,
        target,
        type: "mcq",
        question: questionText.trim(),
        options: options.filter((o) => o.text.trim().length > 0),
        correctOptionId,
        points,
      });
    } else {
      onAddQuestion({
        id: `cq_${Date.now().toString(36)}`,
        target,
        type: "coding",
        question: questionText.trim(),
        codingDetails: {
          difficulty: codingDifficulty,
          sampleInput: sampleInput.trim(),
          sampleOutput: sampleOutput.trim(),
        },
        points,
      });
    }

    // Reset form
    setQuestionText("");
    setOptions([
      { id: "opt_a", text: "" },
      { id: "opt_b", text: "" },
      { id: "opt_c", text: "" },
      { id: "opt_d", text: "" },
    ]);
    setSampleInput("");
    setSampleOutput("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-surface border border-border rounded-3xl shadow-2xl p-6 sm:p-7 my-auto max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary-glow shrink-0">
            {target === "ai_online_test" ? (
              <FileQuestion className="w-5 h-5" />
            ) : (
              <Code className="w-5 h-5" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-ink">
              Add Custom Question
            </h2>
            <p className="text-xs text-ink-soft">
              {target === "ai_online_test"
                ? "Target: AI Online Test (MCQ)"
                : "Target: AI Assessment (Aptitude & Coding)"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Question Type selector (for AI Assessment) */}
          {target === "ai_assessment" && (
            <div>
              <label className="text-xs font-semibold text-ink block mb-1.5">Question Category</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setQuestionType("mcq")}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    questionType === "mcq"
                      ? "bg-gradient-brand text-white border-transparent shadow-xs"
                      : "bg-surface text-ink-soft border-border hover:text-ink"
                  }`}
                >
                  <FileQuestion className="w-3.5 h-3.5" />
                  <span>Aptitude (MCQ)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setQuestionType("coding")}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    questionType === "coding"
                      ? "bg-gradient-brand text-white border-transparent shadow-xs"
                      : "bg-surface text-ink-soft border-border hover:text-ink"
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Coding Challenge</span>
                </button>
              </div>
            </div>
          )}

          {/* Question Title / Description */}
          <div>
            <label className="text-xs font-semibold text-ink block mb-1.5">
              {questionType === "mcq" ? "Question Text" : "Problem Statement / Title"}
            </label>
            <textarea
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              placeholder={
                questionType === "mcq"
                  ? "e.g. Which of the following data structures has O(1) average lookup time?"
                  : "e.g. Write a function that finds the longest palindromic substring in a given string."
              }
              className="input-base min-h-[90px] text-xs resize-y"
              required
            />
          </div>

          {/* MCQ Options */}
          {questionType === "mcq" && (
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-ink">
                  Answer Options & Correct Choice
                </label>
                <span className="text-[11px] text-ink-soft">
                  Select the radio button for the correct answer
                </span>
              </div>

              <div className="space-y-2">
                {options.map((opt, idx) => (
                  <div key={opt.id} className="flex items-center gap-2.5">
                    <label className="flex items-center gap-1.5 cursor-pointer shrink-0">
                      <input
                        type="radio"
                        name="correctOption"
                        checked={correctOptionId === opt.id}
                        onChange={() => setCorrectOptionId(opt.id)}
                        className="w-4 h-4 text-primary focus:ring-primary/30"
                      />
                      <span className="text-xs font-bold text-ink uppercase w-5">
                        {String.fromCharCode(65 + idx)}:
                      </span>
                    </label>
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => handleOptionChange(opt.id, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + idx)} text`}
                      className="input-base text-xs py-1.5 flex-1"
                    />
                    {correctOptionId === opt.id && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-md shrink-0">
                        Correct
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Coding Problem Specific Details */}
          {questionType === "coding" && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-semibold text-ink block mb-1">Difficulty Level</label>
                <select
                  value={codingDifficulty}
                  onChange={(e) => setCodingDifficulty(e.target.value as "easy" | "medium" | "hard")}
                  className="input-base text-xs py-1.5"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-ink block mb-1">Sample Input</label>
                  <textarea
                    value={sampleInput}
                    onChange={(e) => setSampleInput(e.target.value)}
                    placeholder="e.g. s = &quot;babad&quot;"
                    className="input-base text-xs py-1.5 font-mono min-h-[60px]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-ink block mb-1">Sample Output</label>
                  <textarea
                    value={sampleOutput}
                    onChange={(e) => setSampleOutput(e.target.value)}
                    placeholder="e.g. &quot;bab&quot;"
                    className="input-base text-xs py-1.5 font-mono min-h-[60px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Points */}
          <div className="pt-1">
            <label className="text-xs font-semibold text-ink block mb-1">Points / Score Weight</label>
            <input
              type="number"
              min={1}
              max={100}
              value={points}
              onChange={(e) => setPoints(Math.max(1, parseInt(e.target.value) || 1))}
              className="input-base text-xs py-1.5 w-28"
            />
          </div>

          {error && (
            <p className="text-xs text-destructive bg-destructive/5 border border-destructive/20 rounded-xl px-3 py-2 font-medium">
              ⚠️ {error}
            </p>
          )}

          {/* Modal Actions */}
          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-brand shadow-sm hover:opacity-95 transition hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Question</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
