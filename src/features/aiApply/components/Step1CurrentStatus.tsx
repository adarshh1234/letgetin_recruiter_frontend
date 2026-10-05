'use client';

import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useAiApplyStore } from '../store/useAiApplyStore';
import { aiApplyAiService } from '../services/aiApplyAiService';
import { AiSuggestionBadge } from './ui/AiSuggestionBadge';
import { AiUnavailableNotice } from './ui/AiUnavailableNotice';
import { CurrentStatus } from '../types';

const STATUS_OPTIONS: { value: CurrentStatus; label: string }[] = [
  { value: 'employed_happy', label: 'Employed and happy' },
  { value: 'unemployed', label: 'Unemployed' },
  { value: 'urgently_looking', label: 'Urgently looking for job' },
  { value: 'employed_switching', label: 'Employed and looking for a job switch' },
  { value: 'employed_higher_opportunities', label: 'Employed but looking for higher opportunities' },
];

export function Step1CurrentStatus() {
  const preferences = useAiApplyStore((s) => s.preferences);
  const setField = useAiApplyStore((s) => s.setField);

  const [suggestion, setSuggestion] = useState<{ status: CurrentStatus; reason: string } | null>(null);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [aiUnavailable, setAiUnavailable] = useState(false);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (preferences.currentStatus || hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    setIsLoadingSuggestion(true);
    aiApplyAiService
      .getStatusSuggestion()
      .then((res) => {
        if (res.aiUnavailable || !res.suggestedStatus) {
          setAiUnavailable(res.aiUnavailable);
          return;
        }
        setSuggestion({ status: res.suggestedStatus, reason: res.statusReason || '' });
      })
      .catch(() => setAiUnavailable(true))
      .finally(() => setIsLoadingSuggestion(false));
  }, [preferences.currentStatus]);

  const suggestedLabel = suggestion ? STATUS_OPTIONS.find((o) => o.value === suggestion.status)?.label : undefined;

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-ink">Describe your current status</h2>
      </div>

      {isLoadingSuggestion && (
        <div className="h-14 rounded-xl bg-surface-alt/60 animate-pulse" />
      )}

      {!isLoadingSuggestion && suggestion && !preferences.currentStatus && (
        <AiSuggestionBadge
          label={`AI suggestion: Based on your current profile, "${suggestedLabel}" appears closest match.`}
          reason={suggestion.reason}
          onUse={() => setField('currentStatus', suggestion.status)}
        />
      )}

      {!isLoadingSuggestion && aiUnavailable && <AiUnavailableNotice />}

      <div className="space-y-2">
        {STATUS_OPTIONS.map((opt) => {
          const isSelected = preferences.currentStatus === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setField('currentStatus', opt.value)}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-left text-sm font-semibold transition cursor-pointer ${
                isSelected
                  ? 'bg-primary/10 border-primary-glow text-ink ring-2 ring-primary-glow/30'
                  : 'bg-surface border-border text-ink-soft hover:border-primary-glow/40 hover:text-ink'
              }`}
            >
              <span>{opt.label}</span>
              {isSelected && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
