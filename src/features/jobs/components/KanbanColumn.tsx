'use client';

import React from 'react';
import { LucideIcon, Plus, ArrowRight } from 'lucide-react';
import { KanbanJobCard, KanbanJobItem } from './KanbanJobCard';

export interface KanbanColumnConfig {
  id: 'saved' | 'applied' | 'interviewing' | 'offered' | 'rejected';
  title: string;
  icon: LucideIcon;
  accentClass: string;
  iconWrapClass: string;
  emptyTitle: string;
  emptyDescription: string;
  emptyCtaLabel?: string;
  emptyCtaHref?: string;
  onEmptyCtaClick?: () => void;
}

interface KanbanColumnProps {
  config: KanbanColumnConfig;
  jobs: KanbanJobItem[];
  onSelectJob: (job: KanbanJobItem) => void;
  onMoveStage: (job: KanbanJobItem, newStage: KanbanJobItem['stage']) => void;
  onDeleteJob: (job: KanbanJobItem) => void;
  onApplySavedJob?: (job: KanbanJobItem) => void;
}

export function KanbanColumn({
  config,
  jobs,
  onSelectJob,
  onMoveStage,
  onDeleteJob,
  onApplySavedJob,
}: KanbanColumnProps) {
  const Icon = config.icon;

  return (
    <div className="flex flex-col w-[290px] sm:w-full shrink-0 bg-surface-alt/40 border border-border rounded-2xl overflow-hidden shadow-2xs">
      {/* Top Color Accent Line */}
      <div className={`h-1.5 w-full ${config.accentClass}`} />

      {/* Column Header */}
      <div className="flex items-center justify-between px-4 pt-3.5 pb-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${config.iconWrapClass}`} />
          <h3 className="text-sm font-bold text-ink">{config.title}</h3>
        </div>
        <span className="text-[11px] font-extrabold text-ink-soft bg-surface border border-border rounded-full min-w-[24px] h-[24px] flex items-center justify-center px-1.5 shadow-2xs">
          {jobs.length}
        </span>
      </div>

      {/* Column Body / Cards List */}
      <div className="flex-1 px-3 pb-3 space-y-3 min-h-[380px] max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-thin">
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center gap-2.5 py-12 px-2">
            <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center text-ink-soft/70 shadow-2xs">
              <Icon className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-ink">{config.emptyTitle}</p>
            <p className="text-[11px] text-ink-soft leading-relaxed max-w-[200px]">
              {config.emptyDescription}
            </p>

            {config.emptyCtaLabel && (
              <button
                type="button"
                onClick={config.onEmptyCtaClick}
                className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-bold text-primary hover:text-primary-glow px-3 py-1.5 rounded-xl bg-surface border border-border hover:border-primary/30 transition cursor-pointer"
              >
                <span>{config.emptyCtaLabel}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <KanbanJobCard
                key={job._id || job.jobId}
                job={job}
                onSelect={onSelectJob}
                onMoveStage={onMoveStage}
                onDelete={onDeleteJob}
                onApplyNow={onApplySavedJob}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
