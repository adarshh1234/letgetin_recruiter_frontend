'use client';

import React, { useState } from 'react';
import { Plus, X, Sparkles } from 'lucide-react';
import { useAiApplyStore } from '../store/useAiApplyStore';
import { aiApplyAiService } from '../services/aiApplyAiService';
import { AiUnavailableNotice } from './ui/AiUnavailableNotice';

export function Step2DesiredJobTitle() {
  const preferences = useAiApplyStore((s) => s.preferences);
  const setField = useAiApplyStore((s) => s.setField);

  const [inputValue, setInputValue] = useState('');
  const [suggestedTitles, setSuggestedTitles] = useState<string[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [aiUnavailable, setAiUnavailable] = useState(false);

  const commitTitle = (title: string) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    if (!preferences.desiredJobTitles.includes(trimmed)) {
      setField('desiredJobTitles', [...preferences.desiredJobTitles, trimmed]);
    }
    setInputValue('');
    fetchSuggestions(trimmed);
  };

  const fetchSuggestions = (seedTitle: string) => {
    setIsLoadingSuggestions(true);
    setAiUnavailable(false);
    aiApplyAiService
      .getTitleExpansion(seedTitle)
      .then((res) => {
        if (res.aiUnavailable) {
          setAiUnavailable(true);
          return;
        }
        const titles = (res.suggestedTitles || []).filter(
          (t) =>
            !preferences.desiredJobTitles.some((d) => d.toLowerCase() === t.toLowerCase()) &&
            !dismissed.some((d) => d.toLowerCase() === t.toLowerCase())
        );
        setSuggestedTitles((prev) => Array.from(new Set([...prev, ...titles])));
      })
      .catch(() => setAiUnavailable(true))
      .finally(() => setIsLoadingSuggestions(false));
  };

  const acceptSuggestion = (title: string) => {
    setField('desiredJobTitles', [...preferences.desiredJobTitles, title]);
    setSuggestedTitles((prev) => prev.filter((t) => t !== title));
  };

  const rejectSuggestion = (title: string) => {
    setSuggestedTitles((prev) => prev.filter((t) => t !== title));
    setDismissed((prev) => [...prev, title]);
  };

  const removeTitle = (title: string) => {
    setField(
      'desiredJobTitles',
      preferences.desiredJobTitles.filter((t) => t !== title)
    );
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-ink">What is your desired job title?</h2>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commitTitle(inputValue);
            }
          }}
          placeholder="Type job title here"
          className="flex-1 input-base text-sm px-3.5 py-2.5 bg-surface text-ink"
        />
        <button
          type="button"
          onClick={() => commitTitle(inputValue)}
          disabled={!inputValue.trim()}
          className="p-2.5 rounded-xl bg-gradient-brand text-white shadow-elegant disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {preferences.desiredJobTitles.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {preferences.desiredJobTitles.map((title) => (
            <span
              key={title}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20"
            >
              {title}
              <button type="button" onClick={() => removeTitle(title)} className="hover:text-primary-deep cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {isLoadingSuggestions && (
        <div className="h-8 w-2/3 rounded-xl bg-surface-alt/60 animate-pulse" />
      )}

      {!isLoadingSuggestions && suggestedTitles.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold text-ink-soft flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-primary-glow" />
            AI suggestions
          </p>
          <div className="flex flex-wrap gap-1.5">
            {suggestedTitles.map((title) => (
              <span
                key={title}
                className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-dashed border-primary/40 text-ink-soft bg-surface"
              >
                {title}
                <button
                  type="button"
                  onClick={() => acceptSuggestion(title)}
                  title="Add this title"
                  className="text-emerald-600 hover:text-emerald-700 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => rejectSuggestion(title)}
                  title="Dismiss"
                  className="text-ink-soft hover:text-rose-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {aiUnavailable && <AiUnavailableNotice />}
    </div>
  );
}
