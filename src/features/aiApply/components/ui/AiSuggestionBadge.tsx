'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface AiSuggestionBadgeProps {
  label: string;
  reason?: string;
  onUse?: () => void;
  useLabel?: string;
}

export function AiSuggestionBadge({ label, reason, onUse, useLabel = 'Use this' }: AiSuggestionBadgeProps) {
  return (
    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-primary/5 border border-primary/20">
      <div className="w-6 h-6 rounded-lg bg-gradient-brand text-white flex items-center justify-center shrink-0 mt-0.5">
        <Sparkles className="w-3.5 h-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-ink">{label}</p>
        {reason && <p className="text-[11px] text-ink-soft mt-0.5">{reason}</p>}
      </div>
      {onUse && (
        <button
          type="button"
          onClick={onUse}
          className="shrink-0 text-[11px] font-bold text-primary hover:text-primary-deep px-2.5 py-1 rounded-lg hover:bg-primary/10 transition cursor-pointer"
        >
          {useLabel}
        </button>
      )}
    </div>
  );
}
