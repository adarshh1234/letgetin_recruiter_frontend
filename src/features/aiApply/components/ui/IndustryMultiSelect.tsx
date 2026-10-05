'use client';

import React, { useState } from 'react';
import { X, Search } from 'lucide-react';

const INDUSTRY_OPTIONS = [
  'Information Technology',
  'SaaS',
  'Finance',
  'Healthcare',
  'E-commerce',
  'Education',
  'Manufacturing',
  'Marketing',
  'Consulting',
  'Telecommunications',
  'Media & Entertainment',
  'Real Estate',
  'Automotive',
  'Government',
  'Non-profit',
];

interface IndustryMultiSelectProps {
  selected: string[];
  onChange: (industries: string[]) => void;
}

export function IndustryMultiSelect({ selected, onChange }: IndustryMultiSelectProps) {
  const [query, setQuery] = useState('');

  const filtered = INDUSTRY_OPTIONS.filter(
    (opt) => !selected.includes(opt) && opt.toLowerCase().includes(query.toLowerCase())
  );

  const addIndustry = (industry: string) => {
    if (!selected.includes(industry)) {
      onChange([...selected, industry]);
    }
    setQuery('');
  };

  const removeIndustry = (industry: string) => {
    onChange(selected.filter((i) => i !== industry));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      addIndustry(query.trim());
    }
  };

  return (
    <div className="space-y-2.5">
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((industry) => (
            <span
              key={industry}
              className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-xl bg-primary/10 text-primary border border-primary/20"
            >
              {industry}
              <button type="button" onClick={() => removeIndustry(industry)} className="hover:text-primary-deep cursor-pointer">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <Search className="w-3.5 h-3.5 text-ink-soft absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search industries..."
          className="w-full input-base text-xs pl-9 py-2 bg-surface text-ink"
        />
      </div>

      {query && filtered.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {filtered.slice(0, 8).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => addIndustry(opt)}
              className="text-[11px] font-semibold px-2.5 py-1.5 rounded-xl border border-border bg-surface-alt/60 text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
            >
              + {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
