'use client';

import React from 'react';
import { Zap, Sparkles } from 'lucide-react';
import { AssistantMode } from '../types';

interface AIChatModeSelectorProps {
  mode: AssistantMode;
  onChange: (mode: AssistantMode) => void;
  disabled?: boolean;
}

export function AIChatModeSelector({ mode, onChange, disabled }: AIChatModeSelectorProps) {
  return (
    <div className="flex items-center gap-1 p-0.5 bg-surface-alt/90 rounded-xl border border-border/80">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange('instant')}
        title="Instant: Fast, direct answers with essential context"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
          mode === 'instant'
            ? 'bg-surface text-primary shadow-2xs font-bold'
            : 'text-ink-soft hover:text-ink'
        }`}
      >
        <Zap className="w-3 h-3" />
        <span>Instant</span>
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange('expert')}
        title="Expert: Thorough, cross-referenced analysis with deeper reasoning"
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
          mode === 'expert'
            ? 'bg-surface text-primary shadow-2xs font-bold'
            : 'text-ink-soft hover:text-ink'
        }`}
      >
        <Sparkles className="w-3 h-3" />
        <span>Expert</span>
      </button>
    </div>
  );
}

