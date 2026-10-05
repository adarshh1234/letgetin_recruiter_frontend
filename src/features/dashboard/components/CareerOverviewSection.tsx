'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  Send,
  Sparkles,
  Zap,
  TrendingUp,
  Layers,
  Award,
  Clock,
  MessageSquare,
  Calendar,
  XCircle,
  Heart,
  ChevronRight,
  ArrowUpRight,
  RefreshCw,
  Plus,
  Compass,
  CalendarClock,
  CheckCircle2,
  Building2,
  MapPin,
  DollarSign,
  ArrowRight,
  FileText,
  Trash2,
  LayoutGrid,
} from 'lucide-react';
import { applicationService } from '@/features/applications/services/applicationService';
import { ApplicationItem, ApplicationStats, ApplicationStatus } from '@/features/applications/types';
import { resolveCandidateStatus } from '@/features/applications/utils/candidateStatusResolver';
import { ApplicationTrackingModal } from '@/features/applications/components/ApplicationTrackingModal';
import { StorageProviderFactory } from '@/features/resume/storage/factory';
import { IResume } from '@/features/resume/types';
import { useAuthStore } from '@/features/auth/store/useAuthStore';
import { JobDetailsModal } from '@/features/jobs/components/JobDetailsModal';
import { IJob } from '@/features/jobs/types/job.types';
import { jobService } from '@/features/jobs/services/jobService';

interface CareerOverviewSectionProps {
  onSwitchTab?: (tab: 'overview' | 'kanban' | 'calendar' | 'jobs' | 'resume' | 'coverLetter' | 'videoProfile', stageFilter?: string) => void;
  onOpenCreateResume?: () => void;
}

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; color: string; bg: string; border: string; icon: React.ComponentType<{ className?: string }> }
> = {
  submitted: {
    label: 'Submitted',
    color: 'text-primary-glow',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
    icon: Clock,
  },
  reviewing: {
    label: 'Under Review',
    color: 'text-amber-500 dark:text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    icon: MessageSquare,
  },
  shortlisted: {
    label: 'Shortlisted',
    color: 'text-blue-500 dark:text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    icon: CheckCircle2,
  },
  interviewing: {
    label: 'Interviewing',
    color: 'text-purple-500 dark:text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20',
    icon: Calendar,
  },
  offered: {
    label: 'Offer Received',
    color: 'text-emerald-500 dark:text-emerald-400',
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

export function CareerOverviewSection({ onSwitchTab, onOpenCreateResume }: CareerOverviewSectionProps) {
  const { user } = useAuthStore();
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [stats, setStats] = useState<ApplicationStats | null>(null);
  const [recentBatches, setRecentBatches] = useState<any[]>([]);
  const [savedJobsList, setSavedJobsList] = useState<IJob[]>([]);
  const [savedJobsCount, setSavedJobsCount] = useState<number>(0);
  const [resumes, setResumes] = useState<IResume[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobForModal, setSelectedJobForModal] = useState<IJob | null>(null);
  const [trackingModalApp, setTrackingModalApp] = useState<ApplicationItem | null>(null);

  const handleDelete = async (appId: string) => {
    if (!confirm('Are you sure you want to withdraw or remove this application record?')) return;
    try {
      await applicationService.deleteApplication(appId);
      setApplications((prev) => prev.filter((a) => a._id !== appId));
      if (trackingModalApp?._id === appId) setTrackingModalApp(null);
    } catch (err) {
      console.warn('Failed to delete application:', err);
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Fetch applications & backend stats
      const appRes = await applicationService.getApplications({ limit: 100, sort: 'recent' });
      setApplications(appRes.applications || []);
      setStats(appRes.stats || null);
      setRecentBatches(appRes.recentBatches || []);

      // 2. Fetch saved jobs list from localStorage + job recommendations
      if (typeof window !== 'undefined') {
        try {
          const savedStr = localStorage.getItem('resumebuildai_saved_jobs');
          const savedIds: string[] = savedStr ? JSON.parse(savedStr) : [];
          setSavedJobsCount(savedIds.length);

          if (savedIds.length > 0) {
            try {
              const recRes = await jobService.getRecommendations({ limit: 50 });
              const matched = (recRes.jobs || []).filter((j) => savedIds.includes(j._id));
              setSavedJobsList(matched);
            } catch {}
          }
        } catch {
          setSavedJobsCount(0);
        }
      }

      // 3. Fetch resumes list
      try {
        const provider = StorageProviderFactory.getProvider();
        const resumeList = await provider.list();
        setResumes(Array.isArray(resumeList) ? resumeList : []);
      } catch (resumeErr) {
        console.warn('Failed to load resumes for overview:', resumeErr);
      }
    } catch (err) {
      console.warn('Failed to load overview data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const totalApplications = stats?.total || applications.length || 0;
  const interviewingCount = stats?.interviewing || applications.filter((a) => a.status === 'interviewing').length || 0;
  const offeredCount = stats?.offered || applications.filter((a) => a.status === 'offered').length || 0;
  const rejectedCount = stats?.rejected || applications.filter((a) => a.status === 'rejected' || a.status === 'failed').length || 0;
  const appliedCount = totalApplications - interviewingCount - offeredCount - rejectedCount;
  const avgMatchScore = stats?.avgMatchScore || 82;
  const aiAppliedCount = stats?.aiApplied || applications.filter((a) => a.source === 'ai_apply').length || 0;
  const manualAppliedCount = stats?.manualApplied || applications.filter((a) => a.source === 'manual').length || 0;
  const appliedThisWeek = stats?.appliedThisWeek || 0;

  // Filter applications by stage for stage cards
  const appliedApps = applications.filter((a) => a.status === 'submitted' || a.status === 'reviewing');
  const interviewingApps = applications.filter((a) => a.status === 'interviewing');
  const offeredApps = applications.filter((a) => a.status === 'offered');
  const rejectedApps = applications.filter((a) => a.status === 'rejected' || a.status === 'failed');

  // Simple clean stage cards configuration
  const STAGE_CARDS = [
    {
      id: 'saved',
      title: 'Saved',
      count: savedJobsCount,
      icon: Heart,
      accentColor: 'from-indigo-500 to-purple-600',
      iconWrapClass: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
      borderColor: 'hover:border-indigo-500/50',
      badgeClass: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
      description: 'Bookmarked opportunities',
    },
    {
      id: 'applied',
      title: 'Applied',
      count: Math.max(0, appliedCount),
      icon: Send,
      accentColor: 'from-cyan-500 to-blue-600',
      iconWrapClass: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
      borderColor: 'hover:border-cyan-500/50',
      badgeClass: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20',
      description: 'Submitted & under review',
    },
    {
      id: 'interviewing',
      title: 'Interviewing',
      count: interviewingCount,
      icon: CalendarClock,
      accentColor: 'from-blue-500 to-indigo-600',
      iconWrapClass: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      borderColor: 'hover:border-blue-500/50',
      badgeClass: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      description: 'Active interview processes',
    },
    {
      id: 'offered',
      title: 'Offered',
      count: offeredCount,
      icon: CheckCircle2,
      accentColor: 'from-emerald-500 to-teal-600',
      iconWrapClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      borderColor: 'hover:border-emerald-500/50',
      badgeClass: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      description: 'Offers & salary packages',
    },
    {
      id: 'rejected',
      title: 'Rejected',
      count: rejectedCount,
      icon: XCircle,
      accentColor: 'from-rose-500 to-red-600',
      iconWrapClass: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      borderColor: 'hover:border-rose-500/50',
      badgeClass: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      description: 'Closed or archived jobs',
    },
  ];

  const handleOpenApplicationDetails = (app: ApplicationItem) => {
    if (!app.job) return;
    const jobObj: IJob = {
      _id: app.job._id || app._id,
      title: app.job.title || 'Job Position',
      company: {
        name: app.job.company?.name || 'Company',
        logo: app.job.company?.logo,
        website: app.job.company?.website,
      },
      description: app.job.description || '',
      responsibilities: app.job.responsibilities || [],
      requirements: app.job.requirements || [],
      preferredQualifications: app.job.preferredQualifications || [],
      skills: app.job.skills || [],
      experienceLevel: (app.job.experienceLevel as any) || 'mid',
      minimumExperience: app.job.minimumExperience || 1,
      maximumExperience: app.job.maximumExperience,
      employmentType: (app.job.employmentType as any) || 'full-time',
      workplaceType: (app.job.workplaceType as any) || 'remote',
      location: {
        city: app.job.location?.city,
        state: app.job.location?.state,
        country: app.job.location?.country || 'Remote',
        remote: app.job.location?.remote ?? true,
      },
      salary: {
        min: app.job.salary?.min || 0,
        max: app.job.salary?.max || 0,
        currency: app.job.salary?.currency || 'INR',
        period: (app.job.salary?.period as any) || 'yearly',
      },
      educationRequirements: app.job.educationRequirements,
      benefits: app.job.benefits || [],
      applicationUrl: app.job.applicationUrl || '',
      source: app.source || 'ai_apply',
      publishedAt: app.job.publishedAt || app.appliedAt,
      matchScore: app.matchScore || 80,
      matchedSkills: app.job.skills?.slice(0, 5) || [],
      missingSkills: [],
      matchReasons: ['Profile alignment matches target keywords'],
    };
    setSelectedJobForModal(jobObj);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. SaaS Hero Banner */}
      <div className="bg-gradient-brand rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-elegant relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-[radial-gradient(ellipse_at_top_right,_var(--primary-glow)_0%,_transparent_70%)] pointer-events-none" />

        <div className="relative space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-glow bg-white/10 backdrop-blur-xs px-3 py-1 rounded-full w-fit border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-primary-glow" /> AI Career & Application Command Center
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}!
          </h1>

          <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
            You have <span className="font-bold text-white">{totalApplications + savedJobsCount} total opportunities</span> tracked — including <span className="font-bold text-white">{totalApplications} submitted applications</span> with an average ATS match of{' '}
            <span className="font-bold text-emerald-300">{avgMatchScore}%</span>.
          </p>
        </div>

        {/* Quick Hero Actions */}
        <div className="relative flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            href="/ai-apply"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-ink font-extrabold text-xs shadow-md hover:bg-white/90 hover:scale-102 transition cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-primary fill-primary" />
            <span>Launch AI Auto-Apply</span>
          </Link>

          <button
            type="button"
            onClick={() => onSwitchTab?.('jobs')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/20 backdrop-blur-xs transition cursor-pointer"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Open Kanban Board</span>
          </button>
        </div>
      </div>

      {/* 2. Interactive Stage Cards Grid (The Main Feature!) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-ink tracking-tight flex items-center gap-2">
              <Layers className="w-4 h-4 text-primary" /> Application Stages & Job Pipeline
            </h2>
            <p className="text-xs text-ink-soft">
              Click any stage card to open and manage those jobs in the board.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchData}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft hover:text-ink px-2.5 py-1 rounded-xl bg-surface-alt border border-border transition cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
        </div>

        {/* Stage Cards (5 Simple Clean Compact Cards) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {STAGE_CARDS.map((stage) => {
            const Icon = stage.icon;

            return (
              <div
                key={stage.id}
                onClick={() => onSwitchTab?.('jobs', stage.id)}
                className={`group relative bg-surface border border-border ${stage.borderColor} rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden space-y-3.5 select-none`}
              >
                {/* Top Accent Gradient Line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stage.accentColor}`} />

                <div className="flex items-center justify-between gap-2 pt-0.5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${stage.iconWrapClass} shadow-2xs shrink-0 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${stage.badgeClass}`}>
                    Stage
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-black text-ink tracking-tight group-hover:text-primary transition">
                    {stage.count}
                  </div>
                  <div className="text-xs font-bold text-ink">
                    {stage.title}
                  </div>
                  <p className="text-[11px] text-ink-soft leading-tight">
                    {stage.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs font-bold text-primary group-hover:text-primary-glow transition">
                  <span>View {stage.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. KPI Quick Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-surface border border-border space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-ink-soft text-[10px] font-extrabold uppercase tracking-wider">
            <span>Total Applied</span>
            <Briefcase className="w-3.5 h-3.5 text-primary" />
          </div>
          <div className="text-2xl font-black text-ink">{totalApplications}</div>
          <div className="text-[11px] text-ink-soft flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            <span>{appliedThisWeek} submitted this week</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-ink-soft text-[10px] font-extrabold uppercase tracking-wider">
            <span>AI Auto-Applied</span>
            <Sparkles className="w-3.5 h-3.5 text-primary-glow" />
          </div>
          <div className="text-2xl font-black text-primary-glow">{aiAppliedCount}</div>
          <div className="text-[11px] text-ink-soft font-medium">Smart automated batches</div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-ink-soft text-[10px] font-extrabold uppercase tracking-wider">
            <span>Avg Match Score</span>
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{avgMatchScore}%</div>
          <div className="text-[11px] text-ink-soft font-medium">Profile alignment match</div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border space-y-1 shadow-2xs">
          <div className="flex items-center justify-between text-ink-soft text-[10px] font-extrabold uppercase tracking-wider">
            <span>Active Resumes</span>
            <Award className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">{resumes.length}</div>
          <div className="text-[11px] text-ink-soft font-medium">ATS-optimized formats</div>
        </div>
      </div>

      {/* 4. Two-Column Analytics & Recent Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Applications Feed (2 cols) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-surface border border-border space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-3">
            <div>
              <h3 className="text-base font-extrabold text-ink tracking-tight flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Recent Applications Activity
              </h3>
              <p className="text-xs text-ink-soft mt-0.5">Latest submitted applications, real-time stage milestones & updates.</p>
            </div>

            {/* Quick Navigation to Kanban & Calendar */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => onSwitchTab?.('kanban')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-alt hover:bg-primary/10 hover:text-primary text-ink-soft font-bold text-xs border border-border transition cursor-pointer"
                title="Switch to Kanban Board view"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Kanban Board</span>
              </button>
              <button
                type="button"
                onClick={() => onSwitchTab?.('calendar')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-alt hover:bg-primary/10 hover:text-primary text-ink-soft font-bold text-xs border border-border transition cursor-pointer"
                title="Switch to Calendar view"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Calendar</span>
              </button>
              <Link
                href="/applications"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary hover:text-white text-primary font-bold text-xs border border-primary/20 transition cursor-pointer"
              >
                <span>View All</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {applications.length === 0 ? (
            <div className="text-center py-10 px-4 bg-surface-alt/30 border border-dashed border-border rounded-2xl space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Briefcase className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-ink">No applications submitted yet</p>
              <p className="text-[11px] text-ink-soft max-w-xs mx-auto">
                Use AI Auto-Apply or browse opportunities to submit your first application.
              </p>
              <Link
                href="/ai-apply"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-brand text-white font-bold text-xs shadow-xs hover:shadow-glow transition cursor-pointer"
              >
                <Zap className="w-3 h-3 fill-white" />
                <span>Start AI Auto-Apply</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 6).map((app) => {
                const candidateStatus = resolveCandidateStatus(app);
                const formattedDate = new Date(app.appliedAt || app.createdAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

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
                            <h4
                              onClick={() => handleOpenApplicationDetails(app)}
                              className="text-sm sm:text-base font-bold text-ink hover:text-primary transition truncate cursor-pointer"
                            >
                              {app.job?.title || 'Job Position'}
                            </h4>
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

                      {/* Status Badge & Match Score */}
                      <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                        {app.matchScore > 0 && (
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {app.matchScore}% Match
                          </span>
                        )}

                        <span
                          className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 shadow-2xs ${candidateStatus.badgeClass}`}
                        >
                          <span>{candidateStatus.label}</span>
                        </span>
                      </div>
                    </div>

                    {/* Footer details & Action Buttons */}
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
                        {candidateStatus.actionRequired && (
                          <button
                            type="button"
                            onClick={() => setTrackingModalApp(app)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shadow-xs transition cursor-pointer animate-pulse"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>{candidateStatus.actionLabel || 'Action Required'}</span>
                          </button>
                        )}
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
                          onClick={() => handleOpenApplicationDetails(app)}
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
            </div>
          )}
        </div>

        {/* Right Column: Quick Career Shortcuts & AI Runs (1 col) */}
        <div className="space-y-6">
          <div className="p-5 sm:p-6 rounded-3xl bg-surface border border-border space-y-3 shadow-xs">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink-soft">
              Career Shortcuts
            </h3>

            <div className="space-y-2">
              <Link
                href="/ai-apply"
                className="flex items-center justify-between p-3 rounded-2xl bg-surface-alt/60 hover:bg-primary/10 hover:border-primary/30 border border-border transition group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-xs">
                    <Zap className="w-4 h-4 fill-white" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-ink group-hover:text-primary transition">Auto-Apply 10 Jobs</div>
                    <div className="text-[10px] text-ink-soft">Smart automated batches</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-ink-soft group-hover:text-primary transition" />
              </Link>

              <Link
                href="/explore"
                className="flex items-center justify-between p-3 rounded-2xl bg-surface-alt/60 hover:bg-primary/10 hover:border-primary/30 border border-border transition group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-surface-alt border border-border flex items-center justify-center text-primary-glow">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-ink group-hover:text-primary transition">Explore Opportunities</div>
                    <div className="text-[10px] text-ink-soft">Find thousands of matched roles</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-ink-soft group-hover:text-primary transition" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  if (onOpenCreateResume) onOpenCreateResume();
                  else onSwitchTab?.('resume');
                }}
                className="w-full flex items-center justify-between p-3 rounded-2xl bg-surface-alt/60 hover:bg-primary/10 hover:border-primary/30 border border-border transition group cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-surface-alt border border-border flex items-center justify-center text-primary">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-ink group-hover:text-primary transition">Create ATS Resume</div>
                    <div className="text-[10px] text-ink-soft">ATS-optimized templates</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-ink-soft group-hover:text-primary transition" />
              </button>
            </div>
          </div>

          {/* AI Apply Batch Sessions */}
          <div className="p-5 sm:p-6 rounded-3xl bg-surface border border-border space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-ink-soft">
                Recent AI Apply Runs
              </h3>
              <Link href="/ai-apply" className="text-[11px] font-bold text-primary hover:text-primary-glow">
                Launch
              </Link>
            </div>

            {recentBatches.length === 0 ? (
              <div className="text-center py-6 px-3 bg-surface-alt/30 border border-dashed border-border rounded-2xl space-y-2">
                <Sparkles className="w-6 h-6 text-primary-glow mx-auto opacity-70" />
                <p className="text-xs font-bold text-ink">No automated batches yet</p>
                <p className="text-[10px] text-ink-soft leading-relaxed">
                  Run AI Auto-Apply to dispatch tailored applications automatically with smart delivery.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {recentBatches.map((batch: any, index: number) => {
                  const isCompleted = batch.status === 'completed';
                  return (
                    <div key={batch._id || index} className="p-3 rounded-2xl bg-surface-alt/50 border border-border space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-ink">Batch #{recentBatches.length - index}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            isCompleted ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20' : 'bg-primary/10 text-primary border border-primary/20'
                          }`}
                        >
                          {batch.status || 'completed'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-ink-soft">
                        <span>{batch.totalJobs || 10} jobs targeted</span>
                        <span>{batch.successCount || batch.appliedJobs?.length || 10} applied</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Embedded Job Details Modal */}
      <JobDetailsModal
        job={selectedJobForModal}
        onClose={() => setSelectedJobForModal(null)}
      />

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
