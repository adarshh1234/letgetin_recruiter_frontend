"use client";

import React, { useState } from "react";
import { GripVertical, Plus, X, ChevronUp, ChevronDown, Check, Code, FileQuestion } from "lucide-react";
import {
  AssessmentRoundConfig,
  AssessmentRoundType,
  GeneralAssessmentQuestionType,
} from "../types";
import {
  RoundScheduleSelector,
  calculateRoundHours,
} from "./RoundScheduleSelector";

export interface AssessmentConfigCardProps {
  enabled: boolean;
  onToggleEnabled: (enabled: boolean) => void;
  rounds: AssessmentRoundConfig[];
  onChangeRounds: (rounds: AssessmentRoundConfig[]) => void;
  subOptionCost?: number;
}

interface RoundTypeMeta {
  type: AssessmentRoundType;
  buttonLabel: string;
  defaultName: string;
  subtitle: string;
  icon: typeof FileQuestion;
}

const AVAILABLE_ROUND_TYPES: RoundTypeMeta[] = [
  {
    type: "general",
    buttonLabel: "General Assessment",
    defaultName: "General Assessment",
    subtitle: "MCQ • Short Answer • Scenario",
    icon: FileQuestion,
  },
  {
    type: "coding",
    buttonLabel: "Coding Assessment",
    defaultName: "Coding Assessment",
    subtitle: "Coding Problems",
    icon: Code,
  },
];

const QUESTION_TYPES: { key: GeneralAssessmentQuestionType; label: string; shortLabel: string }[] = [
  { key: "mcq", label: "Multiple Choice (MCQ)", shortLabel: "MCQ" },
  { key: "short_answer", label: "Short Answer", shortLabel: "Short Answer" },
  { key: "scenario", label: "Scenario-Based", shortLabel: "Scenario" },
];

export function AssessmentConfigCard({
  enabled,
  onToggleEnabled,
  rounds,
  onChangeRounds,
  subOptionCost = 10,
}: AssessmentConfigCardProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const selectedTypes = new Set(rounds.map((r) => r.type));

  const handleAddRound = (meta: RoundTypeMeta) => {
    if (selectedTypes.has(meta.type)) return;

    const defaultConfig: Record<string, unknown> =
      meta.type === "general"
        ? {
            questionTypes: ["mcq", "short_answer", "scenario"],
            mcq: { questionCount: 15, difficulty: "mixed" },
            shortAnswer: { questionCount: 5 },
            scenario: { questionCount: 3 },
            durationMinutes: 60,
            passingScore: 70,
          }
        : {};

    const newRound: AssessmentRoundConfig = {
      id: `round_${meta.type}_${Date.now().toString(36)}`,
      type: meta.type,
      order: rounds.length + 1,
      name: meta.defaultName,
      enabled: true,
      date: "",
      startTime: meta.type === "general" ? "10:00" : "14:00",
      endTime: meta.type === "general" ? "11:00" : "15:30",
      durationHours: meta.type === "general" ? 1 : 1.5,
      config: defaultConfig,
    };

    const nextRounds = [...rounds, newRound].map((r, idx) => ({
      ...r,
      order: idx + 1,
    }));
    onChangeRounds(nextRounds);
  };

  const handleRemoveRound = (typeToRemove: AssessmentRoundType) => {
    const nextRounds = rounds
      .filter((r) => r.type !== typeToRemove)
      .map((r, idx) => ({
        ...r,
        order: idx + 1,
      }));
    onChangeRounds(nextRounds);
  };

  const handleToggleQuestionType = (
    roundId: string,
    questionType: GeneralAssessmentQuestionType
  ) => {
    const updated = rounds.map((r) => {
      if (r.id !== roundId || r.type !== "general") return r;

      const currentTypes = (r.config?.questionTypes as GeneralAssessmentQuestionType[]) || [
        "mcq",
        "short_answer",
        "scenario",
      ];
      let nextTypes: GeneralAssessmentQuestionType[];

      if (currentTypes.includes(questionType)) {
        // Enforce at least one question type must remain selected
        if (currentTypes.length <= 1) return r;
        nextTypes = currentTypes.filter((t) => t !== questionType);
      } else {
        nextTypes = [...currentTypes, questionType];
      }

      return {
        ...r,
        config: {
          ...r.config,
          questionTypes: nextTypes,
        },
      };
    });

    onChangeRounds(updated);
  };

  const handleUpdateQuestionCount = (
    roundId: string,
    qType: GeneralAssessmentQuestionType,
    count: number
  ) => {
    const updated = rounds.map((r) => {
      if (r.id !== roundId || r.type !== "general") return r;
      const key = qType === "mcq" ? "mcq" : qType === "short_answer" ? "shortAnswer" : "scenario";
      const existingSub = (r.config?.[key] as Record<string, unknown>) || {};
      return {
        ...r,
        config: {
          ...r.config,
          [key]: {
            ...existingSub,
            questionCount: count,
          },
        },
      };
    });
    onChangeRounds(updated);
  };

  const handleUpdateDuration = (roundId: string, minutes: number) => {
    const updated = rounds.map((r) => {
      if (r.id !== roundId || r.type !== "general") return r;
      return {
        ...r,
        config: {
          ...r.config,
          durationMinutes: minutes,
        },
      };
    });
    onChangeRounds(updated);
  };

  const handleUpdatePassingScore = (roundId: string, score: number) => {
    const updated = rounds.map((r) => {
      if (r.id !== roundId || r.type !== "general") return r;
      return {
        ...r,
        config: {
          ...r.config,
          passingScore: score,
        },
      };
    });
    onChangeRounds(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    const reordered = [...rounds];
    const temp = reordered[index - 1];
    reordered[index - 1] = reordered[index];
    reordered[index] = temp;

    const normalized = reordered.map((r, idx) => ({
      ...r,
      order: idx + 1,
    }));
    onChangeRounds(normalized);
  };

  const handleMoveDown = (index: number) => {
    if (index >= rounds.length - 1) return;
    const reordered = [...rounds];
    const temp = reordered[index + 1];
    reordered[index + 1] = reordered[index];
    reordered[index] = temp;

    const normalized = reordered.map((r, idx) => ({
      ...r,
      order: idx + 1,
    }));
    onChangeRounds(normalized);
  };

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", `${index}`);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...rounds];
    const [movedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(dropIndex, 0, movedItem);

    const normalized = reordered.map((r, idx) => ({
      ...r,
      order: idx + 1,
    }));

    onChangeRounds(normalized);
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const formatGeneralSubtitle = (round: AssessmentRoundConfig) => {
    const qTypes = (round.config?.questionTypes as GeneralAssessmentQuestionType[]) || [
      "mcq",
      "short_answer",
      "scenario",
    ];
    const labels = qTypes.map((t) => {
      const match = QUESTION_TYPES.find((q) => q.key === t);
      return match ? match.shortLabel : t;
    });
    return labels.join(" • ") || "No question types selected";
  };

  return (
    <div
      className={`rounded-2xl border transition-all ${
        enabled ? "border-primary/40 bg-surface shadow-xs" : "border-border bg-background"
      }`}
    >
      {/* Header / Toggle */}
      <label className="flex items-start gap-3.5 p-4 sm:p-5 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onToggleEnabled(e.target.checked)}
          className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary/30 accent-primary cursor-pointer"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <span className="text-base font-bold text-ink">Assessment</span>
            {enabled && rounds.length > 0 && (
              <span className="text-xs font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full shrink-0">
                {rounds.length * subOptionCost} credits
              </span>
            )}
          </div>
          <p className="text-xs text-ink-soft mt-0.5">
            Configure assessment rounds for shortlisted candidates: General Assessment (MCQ, Short Answer, Scenario) and Coding Assessment.
          </p>
        </div>
      </label>

      {/* Expanded Configuration Panel */}
      {enabled && (
        <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-1 space-y-5 border-t border-border/70">
          {/* 1. Select Assessment Rounds */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-ink uppercase tracking-wider">
                Select Assessment Rounds
              </span>
              <span className="text-[11px] text-ink-soft">Choose up to 2 distinct assessment rounds</span>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {AVAILABLE_ROUND_TYPES.map((meta) => {
                const isSelected = selectedTypes.has(meta.type);
                const Icon = meta.icon;
                return (
                  <button
                    key={meta.type}
                    type="button"
                    disabled={isSelected}
                    onClick={() => handleAddRound(meta)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
                      isSelected
                        ? "bg-surface-alt border-border text-ink-soft/60 cursor-not-allowed opacity-60"
                        : "bg-surface hover:bg-primary/10 border-border hover:border-primary/40 text-ink hover:text-primary cursor-pointer active:scale-95 shadow-xs"
                    }`}
                  >
                    {isSelected ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Plus className="w-3.5 h-3.5 text-primary" />
                    )}
                    <Icon className="w-3.5 h-3.5 opacity-70" />
                    <span>{meta.buttonLabel}</span>
                    {isSelected && (
                      <span className="text-[10px] text-emerald-600 font-normal ml-0.5">Added</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Selected Rounds & Reordering */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-ink uppercase tracking-wider">
                Selected Assessment Rounds {rounds.length > 0 && `(${rounds.length})`}
              </span>
              {rounds.length > 1 && (
                <span className="text-[11px] text-ink-soft hidden sm:inline">
                  Drag ☰ or use arrows to reorder
                </span>
              )}
            </div>

            {rounds.length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-amber-500/30 bg-amber-500/5 text-center">
                <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                  ⚠️ At least one assessment round is required. Click an assessment round above to add it.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {rounds.map((round, index) => {
                  const isDragging = draggedIndex === index;
                  const isOver = dragOverIndex === index;
                  const isGeneral = round.type === "general";
                  const selectedQuestionTypes = isGeneral
                    ? (round.config?.questionTypes as GeneralAssessmentQuestionType[]) || [
                        "mcq",
                        "short_answer",
                        "scenario",
                      ]
                    : [];

                  return (
                    <div
                      key={round.id || round.type}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`p-3.5 rounded-xl border bg-surface transition ${
                        isDragging
                          ? "opacity-40 border-dashed border-primary"
                          : isOver
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/30 shadow-xs"
                      }`}
                    >
                      {/* Top Row: Drag Handle, Title, Order, Actions */}
                      <div className="flex items-center justify-between gap-3">
                        {/* Left: Drag handle & Round title */}
                        <div className="flex items-center gap-3 min-w-0">
                          <button
                            type="button"
                            tabIndex={-1}
                            aria-label="Drag handle"
                            className="text-ink-soft hover:text-ink cursor-grab active:cursor-grabbing p-0.5 rounded touch-none"
                          >
                            <GripVertical className="w-4 h-4" />
                          </button>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-ink shrink-0">
                                {index + 1}.
                              </span>
                              <span className="text-sm font-bold text-ink truncate">
                                {round.name}
                              </span>
                            </div>
                            <p className="text-[11px] text-ink-soft mt-0.5">
                              {isGeneral ? formatGeneralSubtitle(round) : "Coding Problems"}
                            </p>
                          </div>
                        </div>

                        {/* Right: Accessible up/down reorder controls & Remove */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            aria-label={`Move ${round.name} up`}
                            disabled={index === 0}
                            onClick={() => handleMoveUp(index)}
                            className="p-1 rounded-lg text-ink-soft hover:text-ink hover:bg-surface-alt disabled:opacity-20 disabled:cursor-not-allowed transition"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Move ${round.name} down`}
                            disabled={index === rounds.length - 1}
                            onClick={() => handleMoveDown(index)}
                            className="p-1 rounded-lg text-ink-soft hover:text-ink hover:bg-surface-alt disabled:opacity-20 disabled:cursor-not-allowed transition"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>

                          <div className="w-px h-4 bg-border mx-1" />

                          <button
                            type="button"
                            aria-label={`Remove ${round.name}`}
                            onClick={() => handleRemoveRound(round.type)}
                            className="p-1.5 rounded-lg text-ink-soft hover:text-destructive hover:bg-destructive/10 transition cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* General Assessment Question Types Configuration */}
                      {isGeneral && (
                        <div className="mt-3 pt-3 border-t border-border/60 pl-7">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                              Question Types (Components)
                            </span>
                            <span className="text-[10px] text-ink-soft">
                              At least one required
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            {QUESTION_TYPES.map((qt) => {
                              const isChecked = selectedQuestionTypes.includes(qt.key);
                              const isOnlyOneChecked = isChecked && selectedQuestionTypes.length === 1;

                              return (
                                <label
                                  key={qt.key}
                                  className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-lg border text-xs cursor-pointer select-none transition ${
                                    isChecked
                                      ? "bg-primary/5 border-primary/30 text-ink font-semibold"
                                      : "bg-surface-alt/60 border-border text-ink-soft hover:bg-surface-alt"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    disabled={isOnlyOneChecked}
                                    onChange={() => handleToggleQuestionType(round.id, qt.key)}
                                    className="w-3.5 h-3.5 rounded text-primary focus:ring-primary/20 accent-primary cursor-pointer disabled:cursor-not-allowed"
                                  />
                                  <span>{qt.label}</span>
                                </label>
                              );
                            })}
                          </div>

                          {/* Configuration subsection */}
                          <div className="mt-3.5 pt-3 border-t border-border/50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">
                                Configuration
                              </span>
                              <span className="text-[10px] text-ink-soft">
                                Question count, duration & passing threshold
                              </span>
                            </div>

                            {/* Question counts for enabled types */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
                              {selectedQuestionTypes.includes("mcq") && (
                                <div className="p-2 rounded-lg border border-border/60 bg-surface-alt/30">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-semibold text-ink">MCQ</span>
                                    <span className="text-[10px] text-ink-soft">Questions</span>
                                  </div>
                                  <input
                                    type="number"
                                    min={1}
                                    max={100}
                                    value={(round.config?.mcq as any)?.questionCount ?? 15}
                                    onChange={(e) =>
                                      handleUpdateQuestionCount(
                                        round.id,
                                        "mcq",
                                        Math.max(1, parseInt(e.target.value) || 1)
                                      )
                                    }
                                    className="w-full px-2 py-1 text-xs font-medium rounded-md border border-border bg-surface text-ink focus:outline-hidden focus:border-primary/50"
                                  />
                                </div>
                              )}

                              {selectedQuestionTypes.includes("short_answer") && (
                                <div className="p-2 rounded-lg border border-border/60 bg-surface-alt/30">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-semibold text-ink">Short Answer</span>
                                    <span className="text-[10px] text-ink-soft">Questions</span>
                                  </div>
                                  <input
                                    type="number"
                                    min={1}
                                    max={50}
                                    value={(round.config?.shortAnswer as any)?.questionCount ?? 5}
                                    onChange={(e) =>
                                      handleUpdateQuestionCount(
                                        round.id,
                                        "short_answer",
                                        Math.max(1, parseInt(e.target.value) || 1)
                                      )
                                    }
                                    className="w-full px-2 py-1 text-xs font-medium rounded-md border border-border bg-surface text-ink focus:outline-hidden focus:border-primary/50"
                                  />
                                </div>
                              )}

                              {selectedQuestionTypes.includes("scenario") && (
                                <div className="p-2 rounded-lg border border-border/60 bg-surface-alt/30">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs font-semibold text-ink">Scenario-Based</span>
                                    <span className="text-[10px] text-ink-soft">Questions</span>
                                  </div>
                                  <input
                                    type="number"
                                    min={1}
                                    max={25}
                                    value={(round.config?.scenario as any)?.questionCount ?? 3}
                                    onChange={(e) =>
                                      handleUpdateQuestionCount(
                                        round.id,
                                        "scenario",
                                        Math.max(1, parseInt(e.target.value) || 1)
                                      )
                                    }
                                    className="w-full px-2 py-1 text-xs font-medium rounded-md border border-border bg-surface text-ink focus:outline-hidden focus:border-primary/50"
                                  />
                                </div>
                              )}
                            </div>

                            {/* Duration & Passing Score */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                              <div className="p-2 rounded-lg border border-border/60 bg-surface-alt/30">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-semibold text-ink">Duration</span>
                                  <span className="text-[10px] text-ink-soft">minutes</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    min={5}
                                    max={480}
                                    step={5}
                                    value={(round.config?.durationMinutes as number) ?? 60}
                                    onChange={(e) =>
                                      handleUpdateDuration(
                                        round.id,
                                        Math.max(1, parseInt(e.target.value) || 1)
                                      )
                                    }
                                    className="w-full px-2 py-1 text-xs font-medium rounded-md border border-border bg-surface text-ink focus:outline-hidden focus:border-primary/50"
                                  />
                                  <span className="text-xs text-ink-soft shrink-0">min</span>
                                </div>
                              </div>

                              <div className="p-2 rounded-lg border border-border/60 bg-surface-alt/30">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-semibold text-ink">Passing Score</span>
                                  <span className="text-[10px] text-ink-soft">0–100%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number"
                                    min={0}
                                    max={100}
                                    value={(round.config?.passingScore as number) ?? 70}
                                    onChange={(e) =>
                                      handleUpdatePassingScore(
                                        round.id,
                                        Math.max(0, Math.min(100, parseInt(e.target.value) || 0))
                                      )
                                    }
                                    className="w-full px-2 py-1 text-xs font-medium rounded-md border border-border bg-surface text-ink focus:outline-hidden focus:border-primary/50"
                                  />
                                  <span className="text-xs text-ink-soft shrink-0">%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Schedule & Timing (Date, Start Time, End Time & Live Hours Calculation) */}
                      <div className="mt-3 pt-3 border-t border-border/60 pl-7">
                        <RoundScheduleSelector
                          label={`${round.name} Schedule & Timing`}
                          schedule={{
                            date: round.date || "",
                            startTime: round.startTime || "",
                            endTime: round.endTime || "",
                          }}
                          onChange={(nextSchedule) => {
                            const timing = calculateRoundHours(nextSchedule.startTime, nextSchedule.endTime);
                            const updated = rounds.map((r) =>
                              r.id === round.id
                                ? {
                                    ...r,
                                    date: nextSchedule.date,
                                    startTime: nextSchedule.startTime,
                                    endTime: nextSchedule.endTime,
                                    durationHours: timing.hours > 0 ? timing.hours : undefined,
                                  }
                                : r
                            );
                            onChangeRounds(updated);
                          }}
                          onDurationChange={(mins) => {
                            handleUpdateDuration(round.id, mins);
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
