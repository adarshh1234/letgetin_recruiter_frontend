'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useAiApplyStore } from '../store/useAiApplyStore';
import { SalaryRangeInput } from './ui/SalaryRangeInput';
import { LocationPicker } from './ui/LocationPicker';
import { IndustryMultiSelect } from './ui/IndustryMultiSelect';
import { EmploymentTypeToggle } from './ui/EmploymentTypeToggle';
import { AiSuggestionBadge } from './ui/AiSuggestionBadge';

export function Step4YourPriorities() {
  const preferences = useAiApplyStore((s) => s.preferences);
  const setField = useAiApplyStore((s) => s.setField);
  const aiSuggestions = useAiApplyStore((s) => s.aiSuggestions);

  const hasSalarySuggestion =
    aiSuggestions?.salaryMin !== undefined && aiSuggestions?.salaryMax !== undefined && preferences.salaryMin === undefined;

  return (
    <div className="space-y-7">
      <h2 className="text-lg font-bold text-ink">Your Priorities</h2>

      {/* Salary */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-ink">What is your salary expectation?</label>
        {hasSalarySuggestion && (
          <AiSuggestionBadge
            label={`AI suggestion: ${aiSuggestions?.salaryCurrency || 'INR'} ${aiSuggestions?.salaryMin?.toLocaleString()} - ${aiSuggestions?.salaryMax?.toLocaleString()}`}
            onUse={() => {
              setField('salaryMin', aiSuggestions?.salaryMin);
              setField('salaryMax', aiSuggestions?.salaryMax);
              if (aiSuggestions?.salaryCurrency) setField('salaryCurrency', aiSuggestions.salaryCurrency);
            }}
          />
        )}
        <SalaryRangeInput
          min={preferences.salaryMin}
          max={preferences.salaryMax}
          currency={preferences.salaryCurrency || 'INR'}
          onChange={(min, max) => {
            setField('salaryMin', min);
            setField('salaryMax', max);
          }}
          onCurrencyChange={(c) => setField('salaryCurrency', c)}
        />
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-ink">Preferred location</label>
        <LocationPicker
          country={preferences.preferredCountry || ''}
          state={preferences.preferredState || ''}
          location={preferences.preferredLocation || ''}
          onChangeCountry={(v) => setField('preferredCountry', v)}
          onChangeState={(v) => setField('preferredState', v)}
          onChangeLocation={(v) => setField('preferredLocation', v)}
        />
      </div>

      {/* Willing to relocate */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-ink">Willing to relocate</label>
        <div className="flex items-center gap-2">
          {(['yes', 'no'] as const).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => setField('willingToRelocate', opt)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition cursor-pointer ${
                preferences.willingToRelocate === opt
                  ? 'bg-primary/10 border-primary-glow text-ink ring-2 ring-primary-glow/30'
                  : 'bg-surface border-border text-ink-soft hover:border-primary-glow/40'
              }`}
            >
              <span className="capitalize">{opt}</span>
              {preferences.willingToRelocate === opt && <CheckCircle2 className="w-4 h-4 text-primary" />}
            </button>
          ))}
        </div>
      </div>

      {/* Industry preference */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-ink">Industry preference</label>
        <p className="text-[11px] text-ink-soft">Choose industries you prefer to work in</p>
        {aiSuggestions && aiSuggestions.industries.length > 0 && preferences.industries.length === 0 && (
          <AiSuggestionBadge
            label={`AI Suggested: ${aiSuggestions.industries.join(', ')}`}
            onUse={() => setField('industries', aiSuggestions.industries)}
          />
        )}
        <IndustryMultiSelect selected={preferences.industries} onChange={(v) => setField('industries', v)} />
      </div>

      {/* Type of work */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-ink">Type of work</label>
        <EmploymentTypeToggle value={preferences.employmentType} onChange={(v) => setField('employmentType', v)} />
      </div>

      {/* Joining date */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-ink">When you are ready to join</label>
        {aiSuggestions?.joiningDate && !preferences.joiningDate && (
          <AiSuggestionBadge
            label={`AI suggestion: ${aiSuggestions.joiningDate}`}
            onUse={() => setField('joiningDate', aiSuggestions.joiningDate)}
          />
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setField('joiningDate', 'ASAP')}
            className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition cursor-pointer ${
              preferences.joiningDate === 'ASAP'
                ? 'bg-primary/10 border-primary-glow text-ink ring-2 ring-primary-glow/30'
                : 'bg-surface border-border text-ink-soft hover:border-primary-glow/40'
            }`}
          >
            ASAP
          </button>
          <input
            type="date"
            value={preferences.joiningDate && preferences.joiningDate !== 'ASAP' ? preferences.joiningDate : ''}
            onChange={(e) => setField('joiningDate', e.target.value)}
            className="flex-1 input-base text-xs px-3 py-2 bg-surface text-ink"
          />
        </div>
      </div>
    </div>
  );
}
