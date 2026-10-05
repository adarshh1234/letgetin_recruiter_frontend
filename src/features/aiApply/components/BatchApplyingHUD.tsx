'use client';

import React from 'react';
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Pause,
  Play,
  XCircle,
  Building2,
  MapPin,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import { useAiApplyStore } from '../store/useAiApplyStore';
import { Progress } from '@/components/ui/progress';

export function BatchApplyingHUD() {
  const session = useAiApplyStore((s) => s.activeBatchSession);
  const isPolling = useAiApplyStore((s) => s.isPollingBatch);
  const loading = useAiApplyStore((s) => s.batchActionLoading);
  const pauseBatch = useAiApplyStore((s) => s.pauseBatch);
  const resumeBatch = useAiApplyStore((s) => s.resumeBatch);
  const cancelBatch = useAiApplyStore((s) => s.cancelBatch);
  const resetSession = useAiApplyStore((s) => s.resetSession);

  if (!session) return null;

  const total = session.totalJobs || 1;
  const processed = (session.appliedCount || 0) + (session.skippedDuplicates || 0) + (session.failedCount || 0);
  const percentage = Math.min(100, Math.round((processed / total) * 100));

  const isCompleted = session.status === 'completed';
  const isPaused = session.status === 'paused';
  const isCancelled = session.status === 'cancelled';
  const isProcessing = session.status === 'processing' || session.status === 'queued';

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div
        className={`p-5 rounded-2xl border transition-all ${
          isCompleted
            ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-950 dark:text-emerald-200'
            : isPaused
            ? 'bg-amber-500/5 border-amber-500/20 text-amber-950 dark:text-amber-200'
            : isCancelled
            ? 'bg-destructive/5 border-destructive/20 text-destructive'
            : 'bg-primary/5 border-primary/20 text-ink'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isCompleted
                  ? 'bg-emerald-500/20 text-emerald-600'
                  : isPaused
                  ? 'bg-amber-500/20 text-amber-600'
                  : isCancelled
                  ? 'bg-destructive/20 text-destructive'
                  : 'bg-primary/20 text-primary-glow animate-pulse'
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : isPaused ? (
                <Pause className="w-5 h-5" />
              ) : isCancelled ? (
                <XCircle className="w-5 h-5" />
              ) : (
                <Loader2 className="w-5 h-5 animate-spin" />
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-ink">
                  {isCompleted
                    ? 'AI Auto-Apply Complete!'
                    : isPaused
                    ? 'AI Auto-Apply Paused'
                    : isCancelled
                    ? 'AI Auto-Apply Cancelled'
                    : `Applying to Jobs (Batch ${session.currentBatch || 1} of ${session.totalBatches || 1})`}
                </h3>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300'
                      : isPaused
                      ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                      : isCancelled
                      ? 'bg-destructive/20 text-destructive'
                      : 'bg-primary/20 text-primary font-semibold'
                  }`}
                >
                  {session.status}
                </span>
              </div>
              <p className="text-xs text-ink-soft">
                {isCompleted
                  ? `Successfully processed all ${session.totalJobs} jobs across ${session.totalBatches} batches (10 jobs per batch).`
                  : isPaused
                  ? 'Application dispatch is paused. You can resume anytime.'
                  : isCancelled
                  ? 'Batch session was stopped.'
                  : 'Smart AI is submitting applications in batches of 10 with paced delivery.'}
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {isProcessing && (
              <>
                <button
                  type="button"
                  onClick={() => pauseBatch()}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface text-ink text-xs font-semibold hover:bg-surface-alt transition cursor-pointer disabled:opacity-50"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </button>
                <button
                  type="button"
                  onClick={() => cancelBatch()}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-xs font-semibold hover:bg-destructive/20 transition cursor-pointer disabled:opacity-50"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Stop</span>
                </button>
              </>
            )}

            {isPaused && (
              <>
                <button
                  type="button"
                  onClick={() => resumeBatch()}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-glow transition cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Resume</span>
                </button>
                <button
                  type="button"
                  onClick={() => cancelBatch()}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-xs font-semibold hover:bg-destructive/20 transition cursor-pointer disabled:opacity-50"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Stop</span>
                </button>
              </>
            )}

            {(isCompleted || isCancelled) && (
              <button
                type="button"
                onClick={() => resetSession()}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface border border-border text-ink text-xs font-bold hover:bg-surface-alt transition cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Run New Apply</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-bold text-ink">
            <span>
              Progress: {processed} / {session.totalJobs} jobs ({percentage}%)
            </span>
            <span>
              Batch {session.currentBatch || 1} of {session.totalBatches || 1}
            </span>
          </div>
          <Progress value={percentage} className="h-2.5" />
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-surface border border-border text-center space-y-0.5">
          <div className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">Total Targets</div>
          <div className="text-xl font-black text-ink">{session.totalJobs}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-surface border border-border text-center space-y-0.5">
          <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Applied</div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{session.appliedCount}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-surface border border-border text-center space-y-0.5">
          <div className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">Duplicates Skipped</div>
          <div className="text-xl font-black text-ink-soft">{session.skippedDuplicates}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-surface border border-border text-center space-y-0.5">
          <div className="text-[11px] font-bold text-primary uppercase tracking-wider">Batch Size</div>
          <div className="text-xl font-black text-primary">10 / batch</div>
        </div>
      </div>

      {/* Live Application Stream Feed */}
      <div className="bg-surface border border-border rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <h4 className="text-sm font-bold text-ink">Live Application Activity Feed</h4>
          </div>
          <span className="text-xs text-ink-soft font-medium">
            {session.appliedJobs?.length || 0} applications logged
          </span>
        </div>

        {(!session.appliedJobs || session.appliedJobs.length === 0) ? (
          <div className="py-8 text-center space-y-2">
            <Loader2 className="w-6 h-6 text-primary-glow animate-spin mx-auto" />
            <p className="text-xs text-ink-soft font-medium">
              Initializing smart delivery... Dispatching Batch 1 (10 jobs)
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {session.appliedJobs.map((item, idx) => (
              <div
                key={`${item.jobId}-${idx}`}
                className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border/80 bg-surface-alt/40 hover:bg-surface-alt transition text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                      item.status === 'applied'
                        ? 'bg-emerald-500/10 text-emerald-600'
                        : item.status === 'skipped_duplicate'
                        ? 'bg-amber-500/10 text-amber-600'
                        : 'bg-destructive/10 text-destructive'
                    }`}
                  >
                    {item.status === 'applied' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : item.status === 'skipped_duplicate' ? (
                      <AlertCircle className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="font-bold text-ink truncate">{item.title}</div>
                    <div className="text-[11px] text-ink-soft flex items-center gap-2 truncate">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-ink-soft/70" />
                        {item.company}
                      </span>
                      {item.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-ink-soft/70" />
                          {item.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10">
                    {item.matchScore}% Match
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                      item.status === 'applied'
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                        : item.status === 'skipped_duplicate'
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                        : 'bg-destructive/10 text-destructive'
                    }`}
                  >
                    {item.status === 'applied'
                      ? 'Applied'
                      : item.status === 'skipped_duplicate'
                      ? 'Already Applied'
                      : 'Failed'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {isCompleted && (
          <div className="pt-3 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-ink-soft">
              All applications are saved to your account and trackable in your Applications dashboard.
            </p>
            <Link
              href="/applications"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-brand text-white font-bold text-xs shadow-elegant hover:shadow-glow transition cursor-pointer"
            >
              <span>View Applied Jobs Status</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
