'use client';

import React from 'react';
import { Search, SlidersHorizontal, X, ArrowUpDown, Sparkles } from 'lucide-react';
import { JobFilterParams, WorkplaceType, ExperienceLevel, EmploymentType } from '../types/job.types';

interface JobFiltersProps {
  filters: JobFilterParams;
  onChange: (newFilters: JobFilterParams) => void;
  onReset: () => void;
  totalResults: number;
}

export const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  onChange,
  onReset,
  totalResults,
}) => {
  const workplaceOptions: Array<{ label: string; value: WorkplaceType | 'all' }> = [
    { label: 'All Workplaces', value: 'all' },
    { label: 'Remote', value: 'remote' },
    { label: 'Hybrid', value: 'hybrid' },
    { label: 'Onsite', value: 'onsite' },
  ];

  const experienceOptions: Array<{ label: string; value: ExperienceLevel | 'all' }> = [
    { label: 'All Levels', value: 'all' },
    { label: 'Junior (1-2y)', value: 'junior' },
    { label: 'Mid-Level (3-5y)', value: 'mid' },
    { label: 'Senior (5+y)', value: 'senior' },
    { label: 'Lead / Staff', value: 'lead' },
  ];

  const hasActiveFilters =
    !!filters.search ||
    (filters.workplaceType && filters.workplaceType !== 'all') ||
    (filters.experienceLevel && filters.experienceLevel !== 'all') ||
    (filters.employmentType && filters.employmentType !== 'all') ||
    (filters.minScore && filters.minScore > 0);

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Top Search Bar & Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-ink-soft absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => onChange({ ...filters, search: e.target.value, page: 1 })}
            placeholder="Search by title, skills (e.g. React, Node.js), company, or city..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-border bg-surface-alt/60 text-ink placeholder:text-ink-soft/60 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChange({ ...filters, search: '', page: 1 })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative min-w-[170px]">
            <ArrowUpDown className="w-3.5 h-3.5 text-ink-soft absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={filters.sort || 'recommended'}
              onChange={(e) => onChange({ ...filters, sort: e.target.value as any, page: 1 })}
              aria-label="Sort job recommendations"
              className="w-full pl-8 pr-8 py-2.5 rounded-xl border border-border bg-surface-alt/60 text-ink text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary appearance-none cursor-pointer"
            >
              <option value="recommended">Best AI Match</option>
              <option value="recent">Most Recent</option>
              <option value="salary">Highest Salary</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-2.5 rounded-xl border border-border text-ink-soft hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5 transition"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/50">
        <span className="text-xs font-semibold text-ink-soft mr-1 flex items-center gap-1">
          <SlidersHorizontal className="w-3 h-3" /> Filters:
        </span>

        {/* Workplace Chips */}
        {workplaceOptions.map((opt) => {
          const isSelected = (filters.workplaceType || 'all') === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange({ ...filters, workplaceType: opt.value, page: 1 })}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                isSelected
                  ? 'bg-primary text-white border-primary shadow-xs'
                  : 'bg-surface-alt text-ink border-border hover:bg-secondary'
              }`}
            >
              {opt.label}
            </button>
          );
        })}

        {/* Min Match 80%+ Quick Filter */}
        <button
          type="button"
          onClick={() =>
            onChange({
              ...filters,
              minScore: filters.minScore === 80 ? undefined : 80,
              page: 1,
            })
          }
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition inline-flex items-center gap-1 ${
            filters.minScore === 80
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
              : 'bg-surface-alt text-emerald-700 dark:text-emerald-400 border-emerald-300/60 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          High Match (80%+)
        </button>

        {/* Experience Dropdown */}
        <select
          value={filters.experienceLevel || 'all'}
          onChange={(e) => onChange({ ...filters, experienceLevel: e.target.value as any, page: 1 })}
          aria-label="Filter by experience level"
          className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-border bg-surface-alt text-ink focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
        >
          {experienceOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Result Count Indicator */}
        <div className="ml-auto text-xs text-ink-soft font-medium">
          Found <span className="font-bold text-ink">{totalResults}</span> roles
        </div>
      </div>
    </div>
  );
};
