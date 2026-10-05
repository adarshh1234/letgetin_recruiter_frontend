'use client';

import React from 'react';
import { useAiApplyStore } from '../store/useAiApplyStore';
import { YesNoDescribe } from '../types';

// NOTE: This step intentionally has zero AI involvement anywhere - no AI service is imported,
// no suggestion/prefill logic exists. Every field here must be answered directly by the candidate.

interface YesNoQuestionProps {
  question: string;
  value: YesNoDescribe;
  onChange: (value: YesNoDescribe) => void;
}

function YesNoQuestion({ question, value, onChange }: YesNoQuestionProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-ink">{question}</label>
      <div className="flex items-center gap-2">
        {(['yes', 'no'] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange({ value: opt, description: opt === 'no' ? '' : value.description })}
            className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-semibold capitalize transition cursor-pointer ${
              value.value === opt
                ? 'bg-primary/10 border-primary-glow text-ink ring-2 ring-primary-glow/30'
                : 'bg-surface border-border text-ink-soft hover:border-primary-glow/40'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
      {value.value === 'yes' && (
        <textarea
          value={value.description || ''}
          onChange={(e) => onChange({ ...value, description: e.target.value })}
          placeholder="Please describe..."
          rows={2}
          className="w-full input-base text-xs px-3 py-2 bg-surface text-ink resize-none"
        />
      )}
    </div>
  );
}

export function Step5PersonalPriorities() {
  const preferences = useAiApplyStore((s) => s.preferences);
  const setField = useAiApplyStore((s) => s.setField);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-ink">Your Personal Priorities</h2>

      <YesNoQuestion
        question="Do you have any disability or chronic condition that limits your major life activities?"
        value={preferences.hasDisabilityOrChronicCondition}
        onChange={(v) => setField('hasDisabilityOrChronicCondition', v)}
      />

      <YesNoQuestion
        question="Any medical conditions required special attention"
        value={preferences.hasMedicalConditionNeedsAttention}
        onChange={(v) => setField('hasMedicalConditionNeedsAttention', v)}
      />

      <div className="space-y-2">
        <label className="text-sm font-semibold text-ink">Shift jobs</label>
        <div className="flex items-center gap-2">
          {(['yes', 'no'] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setField('okWithShiftJobs', opt)}
              className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-semibold capitalize transition cursor-pointer ${
                preferences.okWithShiftJobs === opt
                  ? 'bg-primary/10 border-primary-glow text-ink ring-2 ring-primary-glow/30'
                  : 'bg-surface border-border text-ink-soft hover:border-primary-glow/40'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <YesNoQuestion
        question="Allergic to any"
        value={preferences.hasAllergies}
        onChange={(v) => setField('hasAllergies', v)}
      />
    </div>
  );
}
