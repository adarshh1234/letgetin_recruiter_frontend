'use client';

import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface SuggestedQuestionsProps {
  questions: string[];
  onSelect: (question: string) => void;
  disabled?: boolean;
}

export function SuggestedQuestions({ questions, onSelect, disabled }: SuggestedQuestionsProps) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 py-1">
      {questions.map((q) => (
        <button
          key={q}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(q)}
          className="group inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-alt text-ink-soft hover:text-ink transition-all duration-150 hover:border-primary/30 shadow-2xs hover:shadow-xs active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-left"
        >
          <Sparkles className="w-3 h-3 text-primary/70 group-hover:text-primary transition-colors shrink-0" />
          <span className="leading-tight">{q}</span>
          <ArrowUpRight className="w-3 h-3 text-ink-soft/50 group-hover:text-ink transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0 opacity-0 group-hover:opacity-100" />
        </button>
      ))}
    </div>
  );
}

