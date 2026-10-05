'use client';

import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Sparkles,
  Zap,
  MoreVertical,
  Trash2,
  Send,
  Calendar,
  Award,
  Clock,
  Heart,
  ChevronRight,
  FileText,
  StickyNote,
} from 'lucide-react';
import { ApplicationStatus } from '@/features/applications/types';

export interface KanbanJobItem {
  _id: string; // application ID or saved job ID
  jobId: string;
  stage: 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected';
  title: string;
  company: {
    name: string;
    logo?: string;
    website?: string;
  };
  location?: {
    city?: string;
    state?: string;
    country?: string;
    remote?: boolean;
  };
  salary?: {
    min: number;
    max: number;
    currency: string;
    period: string;
  };
  workplaceType?: string;
  employmentType?: string;
  experienceLevel?: string;
  matchScore: number;
  source: 'ai_apply' | 'manual' | 'saved';
  applicationStatus?: ApplicationStatus;
  appliedAt?: string;
  savedAt?: string;
  notes?: string;
  resumeTitle?: string;
  skills?: string[];
  responsibilities?: string[];
  requirements?: string[];
  preferredQualifications?: string[];
  benefits?: string[];
  applicationUrl?: string;
  description?: string;
}

interface KanbanJobCardProps {
  job: KanbanJobItem;
  onSelect: (job: KanbanJobItem) => void;
  onMoveStage: (job: KanbanJobItem, newStage: 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected') => void;
  onDelete: (job: KanbanJobItem) => void;
  onApplyNow?: (job: KanbanJobItem) => void;
}

const STAGES: Array<{ id: KanbanJobItem['stage']; label: string; icon: React.ComponentType<{ className?: string }> }> = [
  { id: 'saved', label: 'Saved', icon: Heart },
  { id: 'applied', label: 'Applied', icon: Send },
  { id: 'interviewing', label: 'Interviewing', icon: Calendar },
  { id: 'offered', label: 'Offered', icon: Award },
  { id: 'rejected', label: 'Rejected', icon: Trash2 },
];

export const KanbanJobCard: React.FC<KanbanJobCardProps> = ({
  job,
  onSelect,
  onMoveStage,
  onDelete,
  onApplyNow,
}) => {
  const [showStageMenu, setShowStageMenu] = useState(false);

  const formatSalary = () => {
    if (!job.salary || (!job.salary.min && !job.salary.max)) {
      return null;
    }
    const { min, max, currency, period } = job.salary;
    const periodLabel = period === 'yearly' ? '/yr' : period === 'monthly' ? '/mo' : '/hr';

    if (currency === 'INR') {
      const minLPA = min ? (min / 100000).toFixed(min % 100000 === 0 ? 0 : 1) : '';
      const maxLPA = max ? (max / 100000).toFixed(max % 100000 === 0 ? 0 : 1) : '';
      return minLPA && maxLPA ? `₹${minLPA}–${maxLPA} LPA` : maxLPA ? `₹${maxLPA} LPA` : 'Competitive';
    }

    const symbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : `${currency} `;
    const minK = min >= 1000 ? `${Math.round(min / 1000)}k` : min;
    const maxK = max >= 1000 ? `${Math.round(max / 1000)}k` : max;
    return minK && maxK ? `${symbol}${minK}–${maxK}${periodLabel}` : `${symbol}${maxK}${periodLabel}`;
  };

  const salaryString = formatSalary();
  const companyInitial = job.company?.name ? job.company.name.charAt(0).toUpperCase() : 'C';

  const dateLabel = job.appliedAt
    ? `Applied ${new Date(job.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
    : job.savedAt
      ? `Saved ${new Date(job.savedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
      : 'Active';

  return (
    <div
      onClick={() => onSelect(job)}
      className="group relative bg-surface border border-border hover:border-primary/50 rounded-2xl p-4 transition-all duration-200 shadow-2xs hover:shadow-xs cursor-pointer space-y-3 select-none"
    >
      {/* Top row: Company Avatar + Title + Stage mover menu */}
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-surface-alt border border-border flex items-center justify-center text-ink font-black text-xs shrink-0 group-hover:border-primary/40 transition">
            {companyInitial}
          </div>

          <div className="min-w-0 space-y-0.5">
            <h4 className="text-xs sm:text-sm font-bold text-ink group-hover:text-primary transition line-clamp-1">
              {job.title}
            </h4>
            <div className="flex items-center gap-1.5 text-[11px] text-ink-soft font-semibold truncate">
              <Building2 className="w-3 h-3 text-ink-soft shrink-0" />
              <span className="truncate">{job.company?.name || 'Company'}</span>
            </div>
          </div>
        </div>

        {/* Stage Mover Menu Button */}
        <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => setShowStageMenu((prev) => !prev)}
            className="p-1 rounded-lg text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
            title="Move stage / actions"
            aria-label="Job actions"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showStageMenu && (
            <div className="absolute right-0 top-full mt-1 w-44 p-1.5 bg-surface dark:bg-slate-900 border border-border dark:border-slate-800 rounded-xl shadow-xl z-30 animate-in fade-in zoom-in-95 duration-100 text-xs">
              <div className="px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-ink-soft border-b border-border/50">
                Move Stage
              </div>
              <div className="py-1 space-y-0.5">
                {STAGES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    disabled={job.stage === s.id}
                    onClick={() => {
                      setShowStageMenu(false);
                      onMoveStage(job, s.id);
                    }}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left font-semibold transition cursor-pointer ${
                      job.stage === s.id
                        ? 'bg-primary/10 text-primary opacity-60 cursor-default'
                        : 'text-ink-soft hover:text-ink hover:bg-surface-alt'
                    }`}
                  >
                    <s.icon className="w-3.5 h-3.5" />
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>

              <div className="border-t border-border/50 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowStageMenu(false);
                    onDelete(job);
                  }}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left font-semibold text-destructive hover:bg-destructive/10 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{job.stage === 'saved' ? 'Remove from Saved' : 'Withdraw Application'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Badges & Meta info */}
      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
        {/* Match score badge */}
        {job.matchScore > 0 && (
          <span className="inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px]">
            <Sparkles className="w-2.5 h-2.5" />
            {job.matchScore}%
          </span>
        )}

        {/* Location badge */}
        {job.location && (
          <span className="inline-flex items-center gap-1 text-ink-soft font-medium bg-surface-alt/70 px-2 py-0.5 rounded-full border border-border text-[10px]">
            <MapPin className="w-2.5 h-2.5" />
            {job.location.remote ? 'Remote' : job.location.city || job.location.country || 'Flexible'}
          </span>
        )}

        {/* Salary badge */}
        {salaryString && (
          <span className="inline-flex items-center font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded-full text-[10px]">
            {salaryString}
          </span>
        )}

        {/* Source badge */}
        {job.source === 'ai_apply' ? (
          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-primary/10 text-primary border border-primary/20">
            <Zap className="w-2.5 h-2.5" /> AI Apply
          </span>
        ) : job.source === 'manual' ? (
          <span className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.2 rounded-md bg-surface-alt text-ink-soft border border-border">
            Direct
          </span>
        ) : null}
      </div>

      {/* Footer details */}
      <div className="pt-2 border-t border-border/70 flex items-center justify-between gap-2 text-[11px] text-ink-soft">
        <div className="flex items-center gap-2 truncate font-medium">
          <Clock className="w-3 h-3 shrink-0" />
          <span className="truncate">{dateLabel}</span>
        </div>

        {/* Notes indicator if any */}
        {job.notes && (
          <div className="flex items-center gap-1 text-amber-500 font-bold shrink-0" title={job.notes}>
            <StickyNote className="w-3 h-3" />
            <span className="text-[10px]">Notes</span>
          </div>
        )}

        {/* Saved Stage: Apply Now button */}
        {job.stage === 'saved' && onApplyNow && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onApplyNow(job);
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-brand text-white font-bold text-[10px] shadow-2xs hover:shadow-xs transition cursor-pointer shrink-0"
          >
            <span>Apply</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};
