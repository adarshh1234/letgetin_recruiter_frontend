'use client';

import React from 'react';
import { Compass, Sparkles, RefreshCw, Cpu, CheckCircle2 } from 'lucide-react';
import { CandidateProfileSummary } from '../types/job.types';

interface ExploreHeroProps {
  candidateProfile?: CandidateProfileSummary;
  onSyncProfile: () => void;
  isSyncing: boolean;
}

export const ExploreHero: React.FC<ExploreHeroProps> = ({
  candidateProfile,
  onSyncProfile,
  isSyncing,
}) => {
  const skillsCount = candidateProfile?.skillsCount || candidateProfile?.skills?.length || 0;
  const headline = candidateProfile?.headline || 'Your Professional Profile';
  const hasEmbedding = candidateProfile?.hasEmbedding;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-brand p-6 sm:p-8 text-white shadow-elegant">
      {/* Background Decorative Blur Orbs */}
      <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
      <div className="absolute right-1/3 -bottom-20 w-60 h-60 rounded-full bg-primary-glow/20 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl space-y-3">
          {/* Tag Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/15 border border-white/25 px-3 py-1 rounded-full backdrop-blur-xs">
              <Compass className="w-3.5 h-3.5" />
              AI Job Explorer
            </span>

            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-500/20 border border-emerald-300/30 text-emerald-100 px-3 py-1 rounded-full">
              <Cpu className="w-3.5 h-3.5 text-emerald-300" />
              AI Smart Match {hasEmbedding ? 'Active' : 'Syncing'}
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Opportunities matched to your skills
          </h1>

          <p className="text-white/85 text-xs sm:text-sm leading-relaxed">
            Ranked intelligently by analyzing your resume content, skills, and experience against verified active career roles.
          </p>

          {/* Candidate Profile Highlight */}
          {skillsCount > 0 && (
            <div className="pt-1 flex items-center gap-2 flex-wrap text-xs text-white/90">
              <span className="font-semibold text-white flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                {skillsCount} Skills Detected:
              </span>
              <span className="text-white/75 truncate max-w-md">
                {candidateProfile?.skills?.slice(0, 5).join(', ')}
                {skillsCount > 5 && ` +${skillsCount - 5} more`}
              </span>
            </div>
          )}
        </div>

        {/* Sync Profile Action Card */}
        <div className="shrink-0 flex flex-col items-start md:items-end gap-3 bg-white/10 border border-white/20 p-4 rounded-2xl backdrop-blur-md">
          <div className="text-left md:text-right">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-white/70">Candidate Target</span>
            <p className="font-bold text-sm text-white truncate max-w-[220px]">{headline}</p>
          </div>

          <button
            type="button"
            onClick={onSyncProfile}
            disabled={isSyncing}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-white text-ink font-bold px-4 py-2 rounded-xl text-xs hover:bg-white/90 hover:shadow-lg transition-all active:scale-95 disabled:opacity-75 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-primary ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Refreshing AI Match...' : 'Re-sync Profile'}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
