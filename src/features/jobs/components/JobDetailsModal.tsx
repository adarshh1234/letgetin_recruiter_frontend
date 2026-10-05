'use client';

import React, { useState } from 'react';
import {
  X,
  Building2,
  MapPin,
  DollarSign,
  Briefcase,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Gift,
  GraduationCap,
  Clock,
  Send,
  Share2,
  Check,
} from 'lucide-react';
import { IJob } from '../types/job.types';

interface JobDetailsModalProps {
  job: IJob | null;
  onClose: () => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({ job, onClose }) => {
  const [applied, setApplied] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!job) return null;

  const match = job.matchScore || 70;
  const matchedSkills = job.matchedSkills || [];
  const missingSkills = job.missingSkills || [];

  const handleApply = () => {
    if (job.applicationUrl && job.applicationUrl.startsWith('http')) {
      window.open(job.applicationUrl, '_blank', 'noopener,noreferrer');
    }
    setApplied(true);
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const initials = job.company.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div
        className="bg-card border border-border rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-border/80 flex items-start justify-between gap-4 bg-surface-alt/40 relative">
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-gradient-brand text-white font-bold text-lg grid place-items-center shrink-0 shadow-md shadow-primary/20">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-extrabold text-lg sm:text-xl text-ink leading-tight">{job.title}</h2>
                <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <Sparkles className="w-3 h-3 fill-current" />
                  {match}% Match
                </span>
              </div>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-ink-soft mt-1.5 flex-wrap font-medium">
                <span className="flex items-center gap-1 text-ink font-semibold">
                  <Building2 className="w-3.5 h-3.5 text-primary" /> {job.company.name}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {job.location.city ? `${job.location.city}, ${job.location.country}` : job.location.country}
                </span>
                <span>•</span>
                <span className="capitalize">{job.workplaceType}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl border border-border text-ink-soft hover:text-ink hover:bg-surface-alt transition"
              title="Share job link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl border border-border text-ink-soft hover:text-ink hover:bg-surface-alt transition"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-ink">
          {/* AI Match Analysis Card */}
          <div className="rounded-2xl bg-gradient-to-br from-primary/5 via-surface-alt to-primary/10 border border-primary/20 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-ink">
                <Sparkles className="w-4 h-4 text-primary-glow" />
                AI Resume Alignment Score: <span className="text-primary">{match}%</span>
              </div>
              <span className="text-xs text-ink-soft">Smart AI Profile Match</span>
            </div>

            {/* Matched Skills */}
            <div>
              <div className="text-xs font-semibold text-ink-soft mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Matched Skills ({matchedSkills.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {matchedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 inline-flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            {missingSkills.length > 0 && (
              <div>
                <div className="text-xs font-semibold text-ink-soft mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Skills you could highlight or develop ({missingSkills.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="text-xs font-medium px-2.5 py-1 rounded-lg bg-secondary text-ink-soft border border-border"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Details Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-surface-alt border border-border/70">
              <span className="text-[11px] text-ink-soft font-medium flex items-center gap-1">
                <DollarSign className="w-3 h-3 text-emerald-600" /> Compensation
              </span>
              <p className="font-bold text-xs sm:text-sm text-ink mt-1">
                {job.salary?.currency === 'INR'
                  ? `₹${(job.salary.min / 100000).toFixed(0)}–${(job.salary.max / 100000).toFixed(0)} LPA`
                  : `$${Math.round((job.salary?.min || 0) / 1000)}k–$${Math.round((job.salary?.max || 0) / 1000)}k`}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-alt border border-border/70">
              <span className="text-[11px] text-ink-soft font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 text-blue-600" /> Experience
              </span>
              <p className="font-bold text-xs sm:text-sm text-ink mt-1">
                {job.minimumExperience}–{job.maximumExperience || job.minimumExperience + 3} Years
              </p>
            </div>

            <div className="p-3 rounded-xl bg-surface-alt border border-border/70">
              <span className="text-[11px] text-ink-soft font-medium flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-purple-600" /> Employment
              </span>
              <p className="font-bold text-xs sm:text-sm text-ink mt-1 capitalize">{job.employmentType}</p>
            </div>

            <div className="p-3 rounded-xl bg-surface-alt border border-border/70">
              <span className="text-[11px] text-ink-soft font-medium flex items-center gap-1">
                <GraduationCap className="w-3 h-3 text-amber-600" /> Education
              </span>
              <p className="font-bold text-xs text-ink mt-1 truncate">
                {job.educationRequirements || "Bachelor's Degree"}
              </p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-base font-bold text-ink mb-2">About the Role</h3>
            <p className="text-ink-soft leading-relaxed">{job.description}</p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities && job.responsibilities.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-ink mb-2.5">Key Responsibilities</h3>
              <ul className="space-y-2">
                {job.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-ink-soft leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-ink mb-2.5">Requirements & Qualifications</h3>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-ink-soft leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && job.benefits.length > 0 && (
            <div>
              <h3 className="text-base font-bold text-ink mb-2.5 flex items-center gap-2">
                <Gift className="w-4 h-4 text-purple-600" /> Perks & Benefits
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {job.benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-surface-alt border border-border/60 text-xs text-ink flex items-center gap-2"
                  >
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-border/80 bg-surface-alt/40 flex items-center justify-between gap-4">
          <div className="text-xs text-ink-soft hidden sm:block">
            Posted {new Date(job.publishedAt).toLocaleDateString()} • Source: {job.source}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-border font-semibold text-xs sm:text-sm text-ink-soft hover:bg-surface-alt transition"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleApply}
              className="flex-1 sm:flex-initial bg-gradient-brand text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm hover:shadow-glow transition-all flex items-center justify-center gap-2"
            >
              {applied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Applied (Demo)</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Apply Now</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
