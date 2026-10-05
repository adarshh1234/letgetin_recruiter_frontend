'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Building2,
  MapPin,
  DollarSign,
  Sparkles,
  Search,
  Loader2,
  Calendar,
  FileText,
  Trash2,
  ChevronRight,
  CheckCircle2,
  Clock,
  MessageSquare,
  Award,
  XCircle,
  Layers,
  Zap,
  GraduationCap,
  Gift,
  Check,
  Globe,
  Tag,
  AlertCircle,
  X,
} from 'lucide-react';
import { applicationService } from '../services/applicationService';
import { ApplicationItem, ApplicationStats, ApplicationStatus } from '../types';
import { resolveCandidateStatus } from '../utils/candidateStatusResolver';
import { ApplicationTrackingModal } from './ApplicationTrackingModal';

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; bg: string; border: string; icon: React.ComponentType<{ className?: string }> }
> = {
  submitted: {
    label: 'Submitted',
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    icon: Clock,
  },
  reviewing: {
    label: 'Under Review',
    color: 'text-amber-700 dark:text-amber-300',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    icon: MessageSquare,
  },
  shortlisted: {
    label: 'Shortlisted',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    icon: CheckCircle2,
  },
  interviewing: {
    label: 'Interviewing',
    color: 'text-purple-700 dark:text-purple-300',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    icon: Calendar,
  },
  offered: {
    label: 'Offer Received',
    color: 'text-emerald-700 dark:text-emerald-300',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    icon: Award,
  },
  rejected: {
    label: 'Not Selected',
    color: 'text-destructive',
    bg: 'bg-destructive/10',
    border: 'border-destructive/20',
    icon: XCircle,
  },
  failed: {
    label: 'Failed',
    color: 'text-destructive',
    bg: 'bg-destructive/10',
    border: 'border-destructive/20',
    icon: XCircle,
  },
};

export function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<'recent' | 'matchScore'>('recent');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);
  const [trackingModalApp, setTrackingModalApp] = useState<ApplicationItem | null>(null);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await applicationService.getApplications({
        page,
        limit: 20,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        source: sourceFilter !== 'all' ? sourceFilter : undefined,
        search: searchQuery.trim() || undefined,
        sort: sortOption,
      });

      setApplications(res.applications);
      setStats(res.stats);
      setTotalPages(res.pagination.totalPages);
      setTotalCount(res.pagination.total);
    } catch (err) {
      console.warn('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, sourceFilter, searchQuery, sortOption]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleDelete = async (appId: string) => {
    if (!confirm('Are you sure you want to withdraw or remove this application record?')) return;
    try {
      await applicationService.deleteApplication(appId);
      setApplications((prev) => prev.filter((a) => a._id !== appId));
      if (selectedApp?._id === appId) setSelectedApp(null);
      setTotalCount((c) => Math.max(0, c - 1));
    } catch (err) {
      console.warn('Failed to delete application:', err);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-ink tracking-tight">Applied Job Status</h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {totalCount} Applied
            </span>
          </div>
          <p className="text-xs text-ink-soft mt-1">
            Real-time status tracking for all your automated AI & direct job applications.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/ai-apply"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-brand text-white font-bold text-xs shadow-elegant hover:shadow-glow transition cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-white" />
            <span>Apply to More Jobs</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-surface border border-border space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="text-[11px] font-bold uppercase tracking-wider">Total Applied</span>
            <Briefcase className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-black text-ink">{stats?.total || 0}</div>
          <div className="text-[11px] text-ink-soft">
            {stats?.appliedThisWeek || 0} applications this week
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="text-[11px] font-bold uppercase tracking-wider">AI Auto-Applied</span>
            <Sparkles className="w-4 h-4 text-primary-glow" />
          </div>
          <div className="text-2xl font-black text-primary-glow">{stats?.aiApplied || 0}</div>
          <div className="text-[11px] text-ink-soft">Smart automated batches</div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="text-[11px] font-bold uppercase tracking-wider">Avg Match Score</span>
            <Layers className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">
            {stats?.avgMatchScore || 0}%
          </div>
          <div className="text-[11px] text-ink-soft">Profile alignment match</div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-ink-soft">
            <span className="text-[11px] font-bold uppercase tracking-wider">Interviewing / Offers</span>
            <Award className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-600">
            {(stats?.interviewing || 0) + (stats?.offered || 0)}
          </div>
          <div className="text-[11px] text-ink-soft">Managed by hiring teams</div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-surface border border-border rounded-2xl p-4 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-soft absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by job title, company, or location..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-surface-alt/50 text-xs font-medium text-ink placeholder:text-ink-soft/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-glow"
            />
          </div>

          {/* Source Filter */}
          <div className="flex items-center gap-1.5 shrink-0">
            <select
              value={sourceFilter}
              onChange={(e) => {
                setSourceFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-border bg-surface text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="all">All Sources</option>
              <option value="ai_apply">🤖 AI Auto-Apply</option>
              <option value="manual">Manual Application</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-border bg-surface text-xs font-semibold text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
            >
              <option value="recent">Newest Applied</option>
              <option value="matchScore">Highest Match Score</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none pt-1 border-t border-border/60">
          {[
            { id: 'all', label: 'All Applications', count: stats?.total },
            { id: 'submitted', label: 'Submitted', count: stats?.submitted },
            { id: 'reviewing', label: 'Under Review', count: stats?.reviewing },
            { id: 'shortlisted', label: 'Shortlisted', count: stats?.shortlisted },
            { id: 'interviewing', label: 'Interviewing', count: stats?.interviewing },
            { id: 'offered', label: 'Offered', count: stats?.offered },
            { id: 'rejected', label: 'Not Selected', count: stats?.rejected },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setStatusFilter(tab.id);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-primary text-white font-bold shadow-xs'
                  : 'bg-surface-alt/70 text-ink-soft hover:text-ink hover:bg-surface-alt'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    statusFilter === tab.id
                      ? 'bg-white/20 text-white font-bold'
                      : 'bg-surface border border-border text-ink-soft font-semibold'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="py-20 text-center space-y-3 bg-surface border border-border rounded-2xl">
          <Loader2 className="w-8 h-8 text-primary-glow animate-spin mx-auto" />
          <p className="text-xs font-medium text-ink-soft">Loading applied job statuses...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="py-16 text-center space-y-4 bg-surface border border-border rounded-2xl p-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-bold text-ink">No applied jobs found</h3>
            <p className="text-xs text-ink-soft">
              {searchQuery || statusFilter !== 'all'
                ? 'No applications match your active filter criteria.'
                : 'You have not submitted any job applications yet. Use AI Apply to auto-match and apply in batches of 10!'}
            </p>
          </div>
          <Link
            href="/ai-apply"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-brand text-white font-bold text-xs shadow-elegant hover:shadow-glow transition cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>Start AI Auto-Apply</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const candidateStatus = resolveCandidateStatus(app);
            const formattedDate = new Date(app.appliedAt || app.createdAt).toLocaleDateString(
              undefined,
              {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              }
            );

            return (
              <div
                key={app._id}
                className="p-4 sm:p-5 rounded-2xl bg-surface border border-border hover:border-primary-glow/30 transition-all shadow-xs space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-surface-alt border border-border flex items-center justify-center text-ink font-bold text-sm shrink-0">
                      {app.job?.company?.name?.charAt(0) || 'C'}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm sm:text-base font-bold text-ink hover:text-primary transition truncate">
                          {app.job?.title || 'Job Position'}
                        </h3>
                        {app.source === 'ai_apply' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" />
                            AI Auto-Apply
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-alt text-ink-soft border border-border">
                            Manual
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-soft font-medium">
                        <span className="flex items-center gap-1 text-ink font-semibold">
                          <Building2 className="w-3.5 h-3.5 text-ink-soft" />
                          {app.job?.company?.name || 'Company'}
                        </span>
                        {app.job?.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-ink-soft" />
                            {app.job.location.city
                              ? `${app.job.location.city}, ${app.job.location.country}`
                              : app.job.location.country || 'Remote Eligible'}
                          </span>
                        )}
                        {app.job?.salary?.max ? (
                          <span className="flex items-center gap-1 text-ink font-semibold">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                            {app.job.salary.currency || 'INR'}{' '}
                            {app.job.salary.min ? `${app.job.salary.min.toLocaleString()} - ` : ''}
                            {app.job.salary.max.toLocaleString()}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  {/* Read-Only Status Badge & Match Score */}
                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                    {app.matchScore > 0 && (
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {app.matchScore}% Match
                      </span>
                    )}

                    {/* Dynamic Candidate Status Badge */}
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 shadow-2xs ${candidateStatus.badgeClass}`}
                    >
                      <span>{candidateStatus.label}</span>
                    </span>
                  </div>
                </div>

                {/* Footer details */}
                <div className="pt-2 border-t border-border/70 flex flex-wrap items-center justify-between gap-3 text-xs text-ink-soft">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Applied on {formattedDate}
                    </span>
                    {app.resume && (
                      <span className="flex items-center gap-1 text-ink font-medium">
                        <FileText className="w-3.5 h-3.5 text-primary" />
                        {app.resume.title || 'Attached Resume'}
                      </span>
                    )}
                    {app.stageDeadline && (app.stageStatus === 'invited' || app.stageStatus === 'started') && (
                      <span className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Clock className="w-3.5 h-3.5" />
                        Deadline: {new Date(app.stageDeadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {(app.stageStatus === 'invited' || app.stageStatus === 'started') ? (
                      <Link
                        href={`/assessment/take?applicationId=${app._id}&stageId=${encodeURIComponent(app.currentStageId || 'stage_general_aptitude')}&jobId=${encodeURIComponent(app.job?._id || '')}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs shadow-xs transition cursor-pointer animate-pulse"
                      >
                        <Sparkles className="w-3.5 h-3.5 fill-black" />
                        <span>Take Assessment</span>
                      </Link>
                    ) : candidateStatus.actionRequired ? (
                      <button
                        type="button"
                        onClick={() => setTrackingModalApp(app)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shadow-xs transition cursor-pointer animate-pulse"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{candidateStatus.actionLabel || 'Action Required'}</span>
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setTrackingModalApp(app)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary hover:text-white text-primary font-bold text-xs border border-primary/20 transition cursor-pointer"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Track Application</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedApp(app)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-alt hover:bg-surface-alt/80 text-ink font-bold text-xs border border-border transition cursor-pointer"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(app._id)}
                      className="p-1.5 rounded-xl text-ink-soft hover:text-destructive hover:bg-destructive/10 transition cursor-pointer"
                      title="Withdraw application record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pt-4 flex items-center justify-between text-xs text-ink-soft">
              <span>
                Page {page} of {totalPages}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-alt disabled:opacity-40 disabled:cursor-not-allowed text-ink font-semibold cursor-pointer"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-alt disabled:opacity-40 disabled:cursor-not-allowed text-ink font-semibold cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Comprehensive Full Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface border border-border rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-gradient-brand text-white flex items-center justify-center text-lg font-black shrink-0 shadow-glow">
                  {selectedApp.job?.company?.name?.charAt(0) || 'J'}
                </div>
                <div className="space-y-1 min-w-0">
                  <h3 className="text-lg sm:text-xl font-black text-ink tracking-tight">
                    {selectedApp.job?.title || 'Job Details'}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-ink-soft font-medium">
                    <span className="font-bold text-ink flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-ink-soft" />
                      {selectedApp.job?.company?.name}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-ink-soft" />
                      {selectedApp.job?.location?.city
                        ? `${selectedApp.job.location.city}, ${selectedApp.job.location.country}`
                        : selectedApp.job?.location?.country || 'Remote Eligible'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="p-2 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Dynamic Status & Interactive Tracker CTA */}
            {(() => {
              const selStatus = resolveCandidateStatus(selectedApp);
              return (
                <div className="p-4 rounded-2xl bg-surface-alt/60 border border-border space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="text-[11px] font-bold text-ink-soft uppercase tracking-wider">
                        Current Application Status
                      </div>
                      <div className="text-sm font-bold text-ink flex items-center gap-2 mt-0.5">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${selStatus.badgeClass}`}>
                          {selStatus.label}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setTrackingModalApp(selectedApp)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs shadow-xs transition cursor-pointer self-start sm:self-auto"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>View Live Funnel Timeline</span>
                    </button>
                  </div>
                  <p className="text-xs text-ink-soft leading-relaxed">
                    {selStatus.description}
                  </p>
                </div>
              );
            })()}

            {/* Dynamic Status Follow-Up Action Banners */}
            {(selectedApp.stageStatus === 'invited' || selectedApp.stageStatus === 'started') && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-500/30 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 shadow-xs border border-amber-500/30">
                    <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold text-ink">Assessment Round Active</h4>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500 text-black shadow-xs">
                        Action Required
                      </span>
                    </div>
                    <p className="text-xs text-ink-soft leading-relaxed">
                      You are invited to complete the <strong>{selectedApp.currentStageId ? selectedApp.currentStageId.replace(/_/g, ' ') : 'Assessment Round'}</strong>. Complete your proctored evaluation before the deadline to qualify for the next stage.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Link
                    href={`/assessment/take?applicationId=${selectedApp._id}&stageId=${encodeURIComponent(selectedApp.currentStageId || 'stage_general_aptitude')}&jobId=${encodeURIComponent(selectedApp.job?._id || '')}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-black text-xs shadow-md transition cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 fill-black" />
                    <span>Enter Proctored Assessment Room &rarr;</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setTrackingModalApp(selectedApp)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface border border-border hover:bg-surface-alt text-ink font-semibold text-xs transition cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5 text-ink-soft" />
                    <span>View Funnel Timeline</span>
                  </button>
                </div>
              </div>
            )}

            {selectedApp.status === 'interviewing' && (
              <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-600 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-sm font-bold text-ink">Interview Stage Active</h4>
                    <p className="text-xs text-ink-soft leading-relaxed">
                      You have been invited for an interview! Sharpen your answers with real-time AI voice practice or check your upcoming timeline.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <Link
                    href={`/interviews/ai-practice?role=${encodeURIComponent(selectedApp.job?.title || '')}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Launch AI Interview Practice</span>
                  </Link>
                  <Link
                    href="/calendar"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface border border-border hover:bg-surface-alt text-ink font-semibold text-xs transition cursor-pointer"
                  >
                    <Calendar className="w-3.5 h-3.5 text-ink-soft" />
                    <span>View Calendar</span>
                  </Link>
                </div>
              </div>
            )}

            {selectedApp.status === 'shortlisted' && (
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-2">
                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Application Shortlisted!</span>
                </div>
                <p className="text-xs text-ink-soft leading-relaxed">
                  Your profile met the key qualifications. Get ahead by exploring mock interview questions tailored to {selectedApp.job?.title || 'this role'}.
                </p>
                <div className="pt-1">
                  <Link
                    href={`/interviews/ai-practice?role=${encodeURIComponent(selectedApp.job?.title || '')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Rehearse Role Questions</span>
                  </Link>
                </div>
              </div>
            )}

            {selectedApp.status === 'offered' && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 font-bold text-sm">
                  <Award className="w-5 h-5 text-emerald-600" />
                  <span>Congratulations! Job Offer Received</span>
                </div>
                <p className="text-xs text-ink-soft leading-relaxed">
                  You have received an employment offer from {selectedApp.job?.company?.name || 'the hiring organization'}. Review the compensation and position requirements below.
                </p>
              </div>
            )}

            {/* Application Overview Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-surface-alt/70 border border-border/80 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-ink-soft block">Application Status</span>
                {(() => {
                  const meta = STATUS_CONFIG[selectedApp.status] || STATUS_CONFIG.submitted;
                  const Icon = meta.icon;
                  return (
                    <span className={`text-xs font-bold inline-flex items-center gap-1 ${meta.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {meta.label}
                    </span>
                  );
                })()}
              </div>

              <div className="p-3 rounded-2xl bg-surface-alt/70 border border-border/80 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-ink-soft block">Match Score</span>
                <span className="text-xs font-black text-emerald-600 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  {selectedApp.matchScore}% Match
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-surface-alt/70 border border-border/80 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-ink-soft block">Application Source</span>
                <span className="text-xs font-bold text-ink flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-primary" />
                  {selectedApp.source === 'ai_apply' ? 'AI Auto-Apply' : 'Manual'}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-surface-alt/70 border border-border/80 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-ink-soft block">Date Applied</span>
                <span className="text-xs font-bold text-ink">
                  {new Date(selectedApp.appliedAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Key Job Metadata Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-surface border border-border text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-ink-soft flex items-center gap-1">
                  <Globe className="w-3 h-3" /> Workplace Type
                </span>
                <span className="font-bold text-ink capitalize">
                  {selectedApp.job?.workplaceType || 'Remote / Flexible'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-ink-soft flex items-center gap-1">
                  <Briefcase className="w-3 h-3" /> Employment
                </span>
                <span className="font-bold text-ink capitalize">
                  {selectedApp.job?.employmentType || 'Full-Time'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-ink-soft flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> Compensation
                </span>
                <span className="font-bold text-emerald-600">
                  {selectedApp.job?.salary?.max
                    ? `${selectedApp.job.salary.currency || 'INR'} ${selectedApp.job.salary.min ? `${selectedApp.job.salary.min.toLocaleString()} - ` : ''}${selectedApp.job.salary.max.toLocaleString()} / ${selectedApp.job.salary.period || 'year'}`
                    : 'Competitive Salary'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-ink-soft flex items-center gap-1">
                  <Award className="w-3 h-3" /> Experience Level
                </span>
                <span className="font-bold text-ink capitalize">
                  {selectedApp.job?.experienceLevel || 'Mid-Senior Level'}{' '}
                  {selectedApp.job?.minimumExperience !== undefined
                    ? `(${selectedApp.job.minimumExperience}${selectedApp.job.maximumExperience ? `-${selectedApp.job.maximumExperience}` : '+'} yrs)`
                    : ''}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-ink-soft flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" /> Education
                </span>
                <span className="font-bold text-ink">
                  {selectedApp.job?.educationRequirements || "Bachelor's Degree or Equivalent"}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-ink-soft flex items-center gap-1">
                  <FileText className="w-3 h-3" /> Resume Submitted
                </span>
                <span className="font-bold text-primary truncate block">
                  {selectedApp.resume?.title || 'Selected Career Resume'}
                </span>
              </div>
            </div>

            {/* Required Skills Chips */}
            {selectedApp.job?.skills && selectedApp.job.skills.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-primary" />
                  Required Technologies & Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedApp.job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-1 rounded-xl bg-surface-alt border border-border text-ink font-semibold text-xs flex items-center gap-1"
                    >
                      <Check className="w-3 h-3 text-primary" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Core Responsibilities */}
            {selectedApp.job?.responsibilities && selectedApp.job.responsibilities.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Key Responsibilities
                </h4>
                <ul className="space-y-1.5 text-xs text-ink-soft leading-relaxed p-3.5 rounded-2xl bg-surface-alt/40 border border-border">
                  {selectedApp.job.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Qualifications / Requirements */}
            {selectedApp.job?.requirements && selectedApp.job.requirements.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-primary" />
                  Job Requirements & Qualifications
                </h4>
                <ul className="space-y-1.5 text-xs text-ink-soft leading-relaxed p-3.5 rounded-2xl bg-surface-alt/40 border border-border">
                  {selectedApp.job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Preferred Qualifications */}
            {selectedApp.job?.preferredQualifications &&
              selectedApp.job.preferredQualifications.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                    Preferred Qualifications
                  </h4>
                  <ul className="space-y-1.5 text-xs text-ink-soft leading-relaxed p-3.5 rounded-2xl bg-surface-alt/40 border border-border">
                    {selectedApp.job.preferredQualifications.map((pref, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                        <span>{pref}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            {/* Benefits & Perks */}
            {selectedApp.job?.benefits && selectedApp.job.benefits.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-amber-600" />
                  Benefits & Perks
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedApp.job.benefits.map((benefit, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-surface-alt border border-border text-xs text-ink font-medium flex items-center gap-2"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full Job Description */}
            {selectedApp.job?.description && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
                  Complete Job Description
                </h4>
                <div className="p-4 rounded-2xl bg-surface-alt/40 border border-border text-xs text-ink-soft leading-relaxed whitespace-pre-line max-h-56 overflow-y-auto scrollbar-thin">
                  {selectedApp.job.description}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-4 border-t border-border flex items-center justify-between">
              <span className="text-[11px] text-ink-soft">
                Application ID: <span className="font-mono text-ink">{selectedApp._id}</span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-glow transition cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Application Tracking Modal */}
      {trackingModalApp && (
        <ApplicationTrackingModal
          application={trackingModalApp}
          onClose={() => setTrackingModalApp(null)}
        />
      )}
    </div>
  );
}
