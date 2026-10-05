"use client";

import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import {
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Zap,
  Sparkles,
  FileText,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Compass,
  Plus,
  Check,
  Trash2,
  ExternalLink,
  Clock,
  AlertCircle,
  FileCheck,
  TrendingUp,
  Eye,
  Loader2,
  HardDrive,
  Pencil,
  ChevronDown,
  Search,
  Laptop,
  Palette,
  Award,
  X,
  Lock,
  Send,
  KeyRound,
  BrainCircuit,
  Languages,
  Lightbulb,
  UserPlus,
  FolderKanban,
  Wallet,
  Link2,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AuthService } from "@/features/auth/services/authService";
import {
  VerificationService,
  VerificationResponse,
  VerificationDocument,
  SectionType,
  VerificationStatus,
} from "@/features/profile/services/verificationService";
import {
  ProfileService,
  ProfileData,
  Track,
  Mode,
  EducationItem,
  ExperienceItem,
} from "@/features/profile/services/profileService";
import { VerificationBadge } from "@/features/profile/components/VerificationBadge";
import { SectionVerificationModal } from "@/features/profile/components/SectionVerificationModal";
import { DocumentViewerModal } from "@/features/profile/components/DocumentViewerModal";
import { AIChat } from "@/features/aiAssistant/components/AIChat";
import { ComingSoon } from "@/components/common/ComingSoon";
import { NeuroCareer360 } from "@/features/profile/components/NeuroCareer360";
import { TalentPulse360 } from "@/features/profile/components/TalentPulse360";
import { AIWritingAssistant } from "@/features/aiWriting/components/AIWritingAssistant";
import { QuillBotTextarea } from "@/features/aiWriting/components/QuillBotTextarea";
import { toast } from "sonner";

export type { Track, Mode, EducationItem, ExperienceItem, ProfileData };

export type SectionId =
  | "overview"
  | "personal"
  | "contacts"
  | "education"
  | "experience"
  | "skills"
  | "generate"
  | "talentPulse360"
  | "neuroCareer360"
  | "languagePlus"
  | "careerSolutionsPlus"
  | "referrals"
  | "projects"
  | "earnings"
  | "credentials"
  | "connections"
  | "myHr";

const DEFAULT_PROFILE: ProfileData = {
  track: "experienced",
  mode: "manual",
  resumeName: null,
  contact: {
    fullName: "",
    phone: "",
    city: "",
    country: "India",
    linkedin: "",
    email: "",
    streetAddress: "",
    state: "",
    postalCode: "",
  },
  personal: {
    firstName: "",
    lastName: "",
    headline: "",
    dob: "",
    bio: "",
  },
  education: {
    institution: "",
    degree: "",
    startYear: "",
    endYear: "",
    certificateUrl: "",
  },
  educationsList: [],
  experience: {
    company: "",
    title: "",
    start: "",
    end: "",
    highlights: "",
  },
  experiencesList: [],
  skills: [],
  videoName: null,
};

/* --- Circular Progress Ring --- */
function ProgressRing({ percent, label }: { percent: number; label?: string }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-24 h-24 flex flex-col items-center justify-center">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 96 96">
        <circle
          cx="48"
          cy="48"
          r={radius}
          className="stroke-white/20"
          strokeWidth="8"
          fill="transparent"
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          className="stroke-white transition-all duration-700 ease-out"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-xl font-extrabold text-white block">{percent}%</span>
        {label && <span className="text-[9px] uppercase tracking-wider text-white/80">{label}</span>}
      </div>
    </div>
  );
}

/* --- TipCard --- */
function TipCard({
  icon: Icon,
  title,
  body,
  onClick,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`p-5 rounded-2xl bg-surface border border-border shadow-xs space-y-2 select-none transition-all ${
        onClick ? "cursor-pointer hover:border-primary-glow/50 hover:shadow-sm" : ""
      }`}
    >
      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary-glow flex items-center justify-center">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-bold text-ink text-sm">{title}</h3>
      <p className="text-xs text-ink-soft leading-relaxed">{body}</p>
    </div>
  );
}

/* --- PreviewCard --- */
function PreviewCard({
  title,
  icon: Icon,
  filled,
  filledTitle,
  filledSubtitle,
  emptyText,
  cta,
  onCta,
  verifiedStatus,
}: {
  title: string;
  icon: React.ElementType;
  filled: boolean;
  filledTitle?: string;
  filledSubtitle?: string;
  emptyText: string;
  cta: string;
  onCta: () => void;
  verifiedStatus?: VerificationStatus;
}) {
  return (
    <div className="p-5 rounded-2xl bg-surface border border-border shadow-xs flex flex-col justify-between space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary-glow flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-ink text-sm">{title}</h3>
        </div>
        {verifiedStatus && <VerificationBadge status={verifiedStatus} size="sm" />}
      </div>

      {filled ? (
        <div className="space-y-1">
          <p className="font-bold text-ink text-sm">{filledTitle || "Title Specified"}</p>
          <p className="text-xs text-ink-soft">{filledSubtitle}</p>
        </div>
      ) : (
        <p className="text-xs text-ink-soft italic">{emptyText}</p>
      )}

      <button
        onClick={onCta}
        className="w-full text-xs font-semibold text-primary-glow hover:text-primary py-2 px-3 rounded-xl border border-primary/20 hover:bg-primary/5 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
      >
        <span>{cta}</span>
      </button>
    </div>
  );
}

/* --- Section Layout Utilities --- */
function SectionHeader({
  title,
  subtitle,
  status,
  onOpenVerify,
  action,
}: {
  title: string;
  subtitle: string;
  status?: VerificationStatus;
  onOpenVerify?: () => void;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mb-2">
      <div>
        <h2 className="text-xl font-extrabold text-ink tracking-tight">{title}</h2>
        <p className="text-xs text-ink-soft mt-0.5">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        {action}
        {status && (
          <div
            onClick={onOpenVerify}
            className={onOpenVerify ? "cursor-pointer hover:scale-105 transition" : ""}
            title={onOpenVerify ? "Click to open verification modal" : undefined}
          >
            <VerificationBadge status={status} size="lg" />
          </div>
        )}
      </div>
    </div>
  );
}

function VerificationButton({
  status,
  documentsCount = 0,
  onClick,
}: {
  status: VerificationStatus;
  documentsCount?: number;
  onClick: () => void;
}) {
  if (status === "verified") {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/50"
        title="Section is verified. Click to view or manage verification documents."
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>Verified</span>
        {documentsCount > 0 && (
          <span className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] px-1.5 py-0.5 rounded-full font-extrabold">
            {documentsCount}
          </span>
        )}
      </button>
    );
  }

  if (status === "rejected") {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:border-rose-500/50 animate-pulse"
        title="Verification was rejected. Click to view issues and re-upload supporting documents."
      >
        <XCircle className="w-4 h-4 text-rose-500 shrink-0" />
        <span>Rejected</span>
        {documentsCount > 0 && (
          <span className="bg-rose-500/20 text-rose-700 dark:text-rose-300 text-[10px] px-1.5 py-0.5 rounded-full font-extrabold">
            {documentsCount}
          </span>
        )}
      </button>
    );
  }

  if (status === "pending") {
    return (
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs bg-amber-500/15 hover:bg-amber-500/25 text-amber-600 dark:text-amber-300 border border-amber-500/30 ring-1 ring-amber-500/20"
        title="Document verification is in progress. Click to check live status."
      >
        <Loader2 className="w-4 h-4 text-amber-500 animate-spin shrink-0" />
        <span>Verifying...</span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs bg-secondary hover:bg-primary/10 text-ink-soft hover:text-primary-glow border border-border hover:border-primary-glow/40"
      title="Upload supporting documents to get verified"
    >
      <ShieldCheck className="w-4 h-4 text-primary-glow shrink-0" />
      <span>Verify Details</span>
      {documentsCount > 0 && (
        <span className="bg-secondary text-ink-soft text-[10px] px-1.5 py-0.5 rounded-full">
          {documentsCount}
        </span>
      )}
    </button>
  );
}

function Card({
  icon: Icon,
  iconColor = "text-primary-glow",
  title,
  verifiedStatus,
  children,
}: {
  icon: React.ElementType;
  iconColor?: string;
  title: string;
  verifiedStatus?: VerificationStatus;
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl bg-secondary flex items-center justify-center ${iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-ink text-sm">{title}</h3>
        </div>
        {verifiedStatus && <VerificationBadge status={verifiedStatus} size="sm" />}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-semibold text-ink-soft">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-ink-soft/70">{hint}</p>}
    </div>
  );
}

function SaveBar({
  isEditing,
  onToggleEdit,
  onSave,
  onCancel,
  isSaving,
  onOpenVerify,
  verificationStatus = "unsubmitted",
  documentsCount = 0,
  editText = "Edit Details",
  saveText = "Save changes",
  hideEdit = false,
}: {
  isEditing?: boolean;
  onToggleEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
  onOpenVerify?: () => void;
  verificationStatus?: VerificationStatus;
  documentsCount?: number;
  editText?: string;
  saveText?: string;
  hideEdit?: boolean;
}) {
  return (
    <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      <span className="text-xs text-ink-soft">
        {isEditing
          ? "Editing mode active — remember to save your updates"
          : "Verified credentials enhance your profile score"}
      </span>
      <div className="flex items-center gap-2.5 justify-end flex-wrap">
        {onOpenVerify && (
          <VerificationButton
            status={verificationStatus}
            documentsCount={documentsCount}
            onClick={onOpenVerify}
          />
        )}

        {!hideEdit && (
          <>
            {!isEditing ? (
              <button
                type="button"
                onClick={onToggleEdit}
                className="inline-flex items-center gap-1.5 bg-secondary hover:bg-secondary/80 text-ink font-semibold px-4 py-2 rounded-xl text-xs border border-border hover:border-primary-glow/40 transition cursor-pointer shadow-xs"
              >
                <Pencil className="w-3.5 h-3.5 text-primary-glow" />
                <span>{editText}</span>
              </button>
            ) : (
              <>
                {onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSaving}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-ink-soft hover:text-ink border border-border hover:bg-secondary transition cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="button"
                  onClick={onSave}
                  disabled={isSaving}
                  className="bg-gradient-brand text-white font-semibold px-5 py-2 rounded-xl text-xs shadow-elegant hover:shadow-glow transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 shrink-0"
                >
                  {isSaving ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>{saveText}</span>
                    </>
                  )}
                </button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EmptyList({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="p-8 rounded-2xl border border-dashed border-border text-center space-y-1 bg-surface/50">
      <p className="font-bold text-ink text-sm">{title}</p>
      <p className="text-xs text-ink-soft">{subtitle}</p>
    </div>
  );
}

/* --- OVERVIEW SECTION ENHANCED --- */
function Overview({
  profile,
  verificationData,
  onNavigate,
  onCompleteProfile,
  onViewDoc,
}: {
  profile: ProfileData;
  verificationData?: VerificationResponse | null;
  onNavigate: (s: SectionId) => void;
  onCompleteProfile: () => void;
  onViewDoc?: (doc: VerificationDocument) => void;
}) {
  const checks = useMemo(() => {
    const hasContact =
      !!profile.contact.fullName.trim() && !!profile.contact.phone.trim();
    const hasEducation =
      !!profile.education.institution.trim() || profile.educationsList.length > 0;
    const hasExperience =
      profile.track === "fresher"
        ? true
        : !!profile.experience.company.trim() || profile.experiencesList.length > 0;
    const hasSkills = profile.skills.length > 0;
    const hasVideo = !!profile.videoName;
    return [
      { key: "contact", label: "Contact details", done: hasContact, section: "contacts" as SectionId },
      { key: "education", label: "Education", done: hasEducation, section: "education" as SectionId },
      {
        key: "experience",
        label: profile.track === "fresher" ? "Experience (skipped)" : "Work experience",
        done: hasExperience,
        section: "experience" as SectionId,
      },
      { key: "skills", label: "Skills", done: hasSkills, section: "skills" as SectionId },
      { key: "video", label: "Intro video (optional)", done: hasVideo, section: "personal" as SectionId, optional: true },
    ];
  }, [profile]);

  const requiredChecks = checks.filter((c) => !("optional" in c && c.optional));
  const profilePercent = Math.round(
    (requiredChecks.filter((c) => c.done).length / requiredChecks.length) * 100
  );

  const verificationPercent = verificationData?.stats.verificationPercent ?? 0;
  const verifiedCount = verificationData?.stats.verifiedCount ?? 0;
  const pendingCount = verificationData?.stats.pendingCount ?? 0;
  const rejectedCount = verificationData?.stats.rejectedCount ?? 0;
  const totalDocs = verificationData?.stats.totalDocuments ?? 0;
  const timeline = verificationData?.timeline || [];

  const displayName =
    profile.contact.fullName.trim().split(" ")[0] ||
    profile.personal.firstName.trim() ||
    "there";

  const getSectionDocStatus = (sec: SectionType): VerificationStatus => {
    return verificationData?.sections?.[sec]?.status || "unsubmitted";
  };

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Welcome + Progress Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-brand p-6 sm:p-8 text-white shadow-elegant">
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
        <div className="relative grid lg:grid-cols-[1fr_auto_auto] gap-6 items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome back, {displayName}!
              </h1>
              <span className="text-xs font-semibold bg-white/20 backdrop-blur px-3 py-1 rounded-full border border-white/25">
                {profile.track === "experienced"
                  ? "Experienced"
                  : profile.track === "fresher"
                  ? "Fresher"
                  : "Candidate"}
              </span>
            </div>
            <p className="text-white/85 max-w-xl text-sm">
              Profile Completion: <strong>{profilePercent}%</strong> • Identity Verification:{" "}
              <strong>{verificationPercent}%</strong> ({verifiedCount} of 5 sections verified)
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <button
                onClick={onCompleteProfile}
                className="inline-flex items-center gap-2 bg-white text-primary font-semibold px-4 py-2 rounded-full text-sm hover:shadow-glow transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-primary-glow" />
                {profilePercent === 100 ? "Review profile" : "Continue profile"}
              </button>
              <button
                onClick={() => onNavigate("generate")}
                className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white font-semibold px-4 py-2 rounded-full text-sm hover:bg-white/25 transition cursor-pointer"
              >
                <FileText className="w-4 h-4" /> Generate CV
              </button>
            </div>
          </div>

          {/* Progress Rings */}
          <div className="flex items-center gap-4 justify-self-center lg:justify-self-end">
            <ProgressRing percent={profilePercent} label="Profile" />
            <ProgressRing percent={verificationPercent} label="Verified" />
          </div>
        </div>
      </section>

      {/* Verification Status Summary Grid */}
      <section className="grid sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-ink">{verifiedCount} / 5</p>
            <p className="text-xs text-ink-soft">Verified Sections</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-ink">{pendingCount}</p>
            <p className="text-xs text-ink-soft">Pending Review</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-surface border border-border shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xl font-extrabold text-ink">{rejectedCount}</p>
            <p className="text-xs text-ink-soft">Rejected Documents</p>
          </div>
        </div>
        <Link
          href="/drive?category=profile"
          className="p-4 rounded-2xl bg-surface border border-border hover:border-primary-glow/50 shadow-xs flex items-center justify-between gap-3 group transition"
          title="View and manage all your documents in Cloud Drive"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary-glow flex items-center justify-center group-hover:scale-105 transition">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-ink">{totalDocs}</p>
              <p className="text-xs text-ink-soft">Total Documents</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary-glow group-hover:underline">
            <HardDrive className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Drive</span>
          </span>
        </Link>
      </section>

      {/* Profile Checklist & Verification Statuses */}
      <section className="rounded-2xl bg-surface border border-border p-6 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-bold text-ink">Profile & Verification Checklist</h2>
            <p className="text-sm text-ink-soft">
              Complete profile sections and upload documents for credential verification.
            </p>
          </div>
          <span className="text-xs font-semibold text-ink-soft">
            {requiredChecks.filter((c) => c.done).length} of {requiredChecks.length} done
          </span>
        </div>
        <div className="mt-4 h-2 rounded-full bg-secondary overflow-hidden">
          <div
            className="h-full bg-gradient-brand transition-all duration-500"
            style={{ width: `${profilePercent}%` }}
          />
        </div>
        <ul className="mt-5 divide-y divide-border">
          {checks.map((c) => {
            const secStatus = getSectionDocStatus(c.section as SectionType);
            return (
              <li key={c.key} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  {c.done ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <span className="w-5 h-5 rounded-full border-2 border-border" />
                  )}
                  <span className={c.done ? "text-ink font-medium text-sm" : "text-ink-soft text-sm"}>
                    {c.label}
                  </span>
                  {"optional" in c && c.optional && (
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-ink-soft/70 bg-secondary px-1.5 py-0.5 rounded">
                      Optional
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <VerificationBadge status={secStatus} size="sm" />
                  <button
                    onClick={() => onNavigate(c.section)}
                    className="text-sm font-semibold text-primary-glow hover:underline cursor-pointer"
                  >
                    {c.done ? "Edit & Verify" : "Add"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Verification Timeline Card */}
      {timeline.length > 0 && (
        <section className="rounded-2xl bg-surface border border-border p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-ink flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-glow" /> Verification Timeline
          </h2>
          <div className="relative border-l border-border ml-3 space-y-4 pl-4">
            {timeline.map((item) => {
              const matchingDoc = verificationData?.documents?.find((d) => d._id === item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => matchingDoc && onViewDoc?.(matchingDoc)}
                  className={`relative space-y-1 ${matchingDoc ? "cursor-pointer group hover:bg-secondary/40 p-2 rounded-xl transition" : ""}`}
                  title={matchingDoc ? "Click to view document in modal" : undefined}
                >
                  <div className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary-glow" />
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="font-bold text-ink text-xs group-hover:text-primary-glow transition">
                      {item.documentType.replace(/_/g, " ").toUpperCase()} ({item.section})
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-ink-soft">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                      <VerificationBadge status={item.status} size="sm" />
                      {matchingDoc && (
                        <span className="p-1 text-ink-soft group-hover:text-primary-glow">
                          <Eye className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-ink-soft">{item.originalName}</p>
                  {item.summary && (
                    <p className="text-[11px] text-ink bg-secondary/40 p-2 rounded-lg mt-1">
                      {item.summary}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Preview Cards */}
      <section className="grid md:grid-cols-2 gap-4">
        <PreviewCard
          title="Work Experience"
          icon={Briefcase}
          filled={!!profile.experience.company.trim() || profile.experiencesList.length > 0}
          filledTitle={profile.experience.title || profile.experiencesList[0]?.title}
          filledSubtitle={profile.experience.company || profile.experiencesList[0]?.company}
          emptyText={
            profile.track === "fresher"
              ? "You've marked yourself as a fresher"
              : "No work experience added yet"
          }
          cta={profile.track === "fresher" ? "Add an internship" : "Add your first role"}
          onCta={() => onNavigate("experience")}
          verifiedStatus={getSectionDocStatus("experience")}
        />
        <PreviewCard
          title="Education"
          icon={GraduationCap}
          filled={!!profile.education.institution.trim() || profile.educationsList.length > 0}
          filledTitle={profile.education.degree || profile.educationsList[0]?.degree}
          filledSubtitle={profile.education.institution || profile.educationsList[0]?.institution}
          emptyText="No education added yet"
          cta="Add your first degree"
          onCta={() => onNavigate("education")}
          verifiedStatus={getSectionDocStatus("education")}
        />
      </section>
    </div>
  );
}

/* --- PERSONAL DETAILS SECTION --- */
function PersonalSection({
  profile,
  verificationDocs,
  verificationStatus,
  onUpdate,
  onSave,
  isSaving,
  onRefreshVerifications,
  onViewDoc,
}: {
  profile: ProfileData;
  verificationDocs: VerificationDocument[];
  verificationStatus: VerificationStatus;
  onUpdate: (updater: (prev: ProfileData) => ProfileData) => void;
  onSave: (dataToSave?: ProfileData) => void;
  isSaving?: boolean;
  onRefreshVerifications: () => void;
  onViewDoc?: (doc: VerificationDocument) => void;
}) {
  const { personal, experience } = profile;
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(personal);

  useEffect(() => {
    setDraft(personal);
  }, [personal]);

  const handleStartEdit = () => {
    setDraft(personal);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(personal);
    setIsEditing(false);
  };

  const handleSave = () => {
    const updatedProfile: ProfileData = {
      ...profile,
      personal: draft,
      contact: {
        ...profile.contact,
        fullName: `${draft.firstName} ${draft.lastName}`.trim(),
      },
    };
    onUpdate(() => updatedProfile);
    onSave(updatedProfile);
    toast.success("Personal details saved successfully!");
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <SectionHeader
        title="Personal Details"
        subtitle="Your public profile and personal identity information."
        status={verificationStatus}
        onOpenVerify={() => setIsVerifyOpen(true)}
      />

      <Card icon={User} iconColor="text-primary-glow" title="Basic Info" verifiedStatus={verificationStatus}>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="First name">
            <input
              type="text"
              className={`input-base ${!isEditing ? "bg-secondary/40 text-ink/90 cursor-default" : ""}`}
              value={draft.firstName}
              disabled={!isEditing}
              onChange={(e) => setDraft((prev) => ({ ...prev, firstName: e.target.value }))}
              placeholder="First name"
            />
          </Field>
          <Field label="Last name">
            <input
              type="text"
              className={`input-base ${!isEditing ? "bg-secondary/40 text-ink/90 cursor-default" : ""}`}
              value={draft.lastName}
              disabled={!isEditing}
              onChange={(e) => setDraft((prev) => ({ ...prev, lastName: e.target.value }))}
              placeholder="Last name"
            />
          </Field>
          <Field label="Headline" hint="One line describing your professional identity.">
            <input
              type="text"
              className={`input-base ${!isEditing ? "bg-secondary/40 text-ink/90 cursor-default" : ""}`}
              value={draft.headline || experience.title || ""}
              disabled={!isEditing}
              onChange={(e) => setDraft((prev) => ({ ...prev, headline: e.target.value }))}
              placeholder="e.g. Senior Full-Stack Engineer"
            />
          </Field>
          <Field label="Date of birth">
            <input
              type="date"
              className={`input-base ${!isEditing ? "bg-secondary/40 text-ink/90 cursor-default" : ""}`}
              value={draft.dob || ""}
              disabled={!isEditing}
              onChange={(e) => setDraft((prev) => ({ ...prev, dob: e.target.value }))}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Bio">
              {isEditing ? (
                <QuillBotTextarea
                  value={draft.bio || ""}
                  onChange={(e) => setDraft((prev) => ({ ...prev, bio: e.target.value }))}
                  onApply={(next) => setDraft((prev) => ({ ...prev, bio: next }))}
                  context="candidate-bio"
                  metadata={{
                    fullName: `${draft.firstName} ${draft.lastName}`.trim(),
                    targetRole: draft.headline || experience.title || "",
                  }}
                  placeholder="Tell recruiters what makes you, you."
                  rows={4}
                />
              ) : (
                <textarea
                  rows={4}
                  className="input-base bg-secondary/40 text-ink/90 cursor-default"
                  value={draft.bio || ""}
                  disabled
                  placeholder="Tell recruiters what makes you, you."
                />
              )}
            </Field>
          </div>
        </div>
        <SaveBar
          isEditing={isEditing}
          onToggleEdit={handleStartEdit}
          onCancel={handleCancel}
          onSave={handleSave}
          isSaving={isSaving}
          onOpenVerify={() => setIsVerifyOpen(true)}
          verificationStatus={verificationStatus}
          documentsCount={verificationDocs.length}
        />
      </Card>

      {/* Verification Document Pipeline Modal */}
      <SectionVerificationModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        section="personal"
        title="Personal Identity (Passport, Driving License, PAN)"
        documents={verificationDocs}
        status={verificationStatus}
        profileData={personal}
        onRefresh={onRefreshVerifications}
        onViewDoc={onViewDoc}
      />
    </div>
  );
}

/* --- CONTACT DETAILS SECTION --- */
function ContactsSection({
  profile,
  verificationDocs,
  verificationStatus,
  onUpdate,
  onSave,
  isSaving,
  onRefreshVerifications,
  onViewDoc,
}: {
  profile: ProfileData;
  verificationDocs: VerificationDocument[];
  verificationStatus: VerificationStatus;
  onUpdate: (updater: (prev: ProfileData) => ProfileData) => void;
  onSave: (dataToSave?: ProfileData) => void;
  isSaving?: boolean;
  onRefreshVerifications: () => void;
  onViewDoc?: (doc: VerificationDocument) => void;
}) {
  const { contact } = profile;
  const { user, fetchCurrentUser } = useAuthStore();
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(contact);

  // Email OTP Verification State
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpCode, setEmailOtpCode] = useState("");
  const [isSendingEmailOtp, setIsSendingEmailOtp] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [emailCooldown, setEmailCooldown] = useState(0);

  // Alternate Email OTP Verification State
  const [altEmailOtpSent, setAltEmailOtpSent] = useState(false);
  const [altEmailOtpCode, setAltEmailOtpCode] = useState("");
  const [isSendingAltEmailOtp, setIsSendingAltEmailOtp] = useState(false);
  const [isVerifyingAltEmail, setIsVerifyingAltEmail] = useState(false);
  const [altEmailCooldown, setAltEmailCooldown] = useState(0);

  // Phone OTP Verification State
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtpCode, setPhoneOtpCode] = useState("");
  const [isSendingPhoneOtp, setIsSendingPhoneOtp] = useState(false);
  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);
  const [phoneCooldown, setPhoneCooldown] = useState(0);

  // Cooldown timers
  useEffect(() => {
    if (emailCooldown > 0) {
      const timer = setTimeout(() => setEmailCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [emailCooldown]);

  useEffect(() => {
    if (altEmailCooldown > 0) {
      const timer = setTimeout(() => setAltEmailCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [altEmailCooldown]);

  useEffect(() => {
    if (phoneCooldown > 0) {
      const timer = setTimeout(() => setPhoneCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [phoneCooldown]);

  useEffect(() => {
    setDraft(contact);
  }, [contact]);

  const registeredEmail = user?.email || contact.email || "";
  const isEmailVerified = Boolean(
    user?.emailVerified || user?.isEmailVerified || user?.provider === "google"
  );
  const currentAltEmail = draft.alternateEmail || draft.resumeEmail || "";
  const isAltEmailVerified =
    Boolean(contact.alternateEmailVerified || contact.resumeEmailVerified) &&
    Boolean(currentAltEmail && currentAltEmail === (contact.alternateEmail || contact.resumeEmail));
  const isPhoneVerified = Boolean(user?.phoneVerified);

  const handleStartEdit = () => {
    setDraft(contact);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraft(contact);
    setIsEditing(false);
  };

  const handleSave = () => {
    const updatedProfile: ProfileData = {
      ...profile,
      contact: {
        ...draft,
        email: registeredEmail, // Enforce locked account email
      },
    };
    onUpdate(() => updatedProfile);
    onSave(updatedProfile);
    toast.success("Contact details saved successfully!");
    setIsEditing(false);
  };

  // Email OTP Actions
  const handleSendEmailOtp = async () => {
    if (!registeredEmail) {
      toast.error("No registered email address found.");
      return;
    }
    setIsSendingEmailOtp(true);
    try {
      const res = await AuthService.sendProfileEmailOtp();
      setEmailOtpSent(true);
      setEmailCooldown(res.cooldown || 60);
      toast.success(`Verification code sent to ${registeredEmail}`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to send email verification OTP.");
    } finally {
      setIsSendingEmailOtp(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!emailOtpCode || emailOtpCode.trim().length !== 6) {
      toast.error("Please enter the 6-digit OTP received in your email.");
      return;
    }
    setIsVerifyingEmail(true);
    try {
      await AuthService.verifyProfileEmailOtp(emailOtpCode.trim());
      await fetchCurrentUser(true);
      setEmailOtpSent(false);
      setEmailOtpCode("");
      toast.success("Email address successfully verified via OTP!");
    } catch (err: any) {
      toast.error(err?.message || "Invalid or expired OTP code.");
    } finally {
      setIsVerifyingEmail(false);
    }
  };

  // Alternate Email OTP Actions
  const handleSendAltEmailOtp = async () => {
    const emailToVerify = draft.alternateEmail?.trim() || draft.resumeEmail?.trim();
    if (!emailToVerify || !emailToVerify.includes("@")) {
      toast.error("Please enter a valid alternate email address before requesting OTP.");
      return;
    }
    setIsSendingAltEmailOtp(true);
    try {
      const res = await AuthService.sendProfileAlternateEmailOtp(emailToVerify);
      setAltEmailOtpSent(true);
      setAltEmailCooldown(res.cooldown || 60);
      toast.success(`Verification code sent to ${emailToVerify}`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to send alternate email verification OTP.");
    } finally {
      setIsSendingAltEmailOtp(false);
    }
  };

  const handleVerifyAltEmailOtp = async () => {
    const emailToVerify = draft.alternateEmail?.trim() || draft.resumeEmail?.trim();
    if (!emailToVerify || !emailToVerify.includes("@")) {
      toast.error("Please provide a valid alternate email address.");
      return;
    }
    if (!altEmailOtpCode || altEmailOtpCode.trim().length !== 6) {
      toast.error("Please enter the 6-digit OTP code received in your alternate email.");
      return;
    }
    setIsVerifyingAltEmail(true);
    try {
      await AuthService.verifyProfileAlternateEmailOtp(emailToVerify, altEmailOtpCode.trim());
      setAltEmailOtpSent(false);
      setAltEmailOtpCode("");
      onUpdate((prev) => ({
        ...prev,
        contact: {
          ...prev.contact,
          alternateEmail: emailToVerify,
          resumeEmail: emailToVerify,
          alternateEmailVerified: true,
          resumeEmailVerified: true,
        },
      }));
      toast.success("Alternate / Resume email successfully verified via OTP!");
    } catch (err: any) {
      toast.error(err?.message || "Invalid or expired OTP code.");
    } finally {
      setIsVerifyingAltEmail(false);
    }
  };

  // Phone OTP Actions
  const handleSendPhoneOtp = async () => {
    const phoneToVerify = draft.phone?.trim() || contact.phone?.trim();
    if (!phoneToVerify || phoneToVerify.length < 8) {
      toast.error("Please enter a valid phone number before requesting OTP.");
      return;
    }
    setIsSendingPhoneOtp(true);
    try {
      const res = await AuthService.sendProfilePhoneOtp(phoneToVerify);
      setPhoneOtpSent(true);
      setPhoneCooldown(res.cooldown || 60);
      toast.success(`Verification code sent to ${phoneToVerify} via WhatsApp!`);
    } catch (err: any) {
      toast.error(err?.message || "Failed to send WhatsApp verification OTP.");
    } finally {
      setIsSendingPhoneOtp(false);
    }
  };

  const handleVerifyPhoneOtp = async () => {
    const phoneToVerify = draft.phone?.trim() || contact.phone?.trim();
    if (!phoneOtpCode || phoneOtpCode.trim().length !== 6) {
      toast.error("Please enter the 6-digit OTP code received on WhatsApp.");
      return;
    }
    setIsVerifyingPhone(true);
    try {
      await AuthService.verifyProfilePhoneOtp(phoneToVerify, phoneOtpCode.trim());
      await fetchCurrentUser(true);
      setPhoneOtpSent(false);
      setPhoneOtpCode("");
      onUpdate((prev) => ({
        ...prev,
        contact: { ...prev.contact, phone: phoneToVerify },
      }));
      toast.success("Phone number successfully verified via WhatsApp OTP!");
    } catch (err: any) {
      toast.error(err?.message || "Invalid or expired WhatsApp OTP code.");
    } finally {
      setIsVerifyingPhone(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <SectionHeader
        title="Contact Details"
        subtitle="How recruiters and companies can reach you. Login email is locked, while resume email and phone are verified via OTP."
        status={verificationStatus}
        onOpenVerify={() => setIsVerifyOpen(true)}
      />

      {/* 1. PRIMARY REGISTERED ACCOUNT EMAIL (LOCKED) */}
      <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-primary-glow">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-ink text-sm">Primary Login Email</h3>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-secondary text-ink-soft flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Account Email
                </span>
              </div>
            </div>
          </div>
          {isEmailVerified ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{user?.provider === "google" ? "Verified (Google)" : "Verified via OTP"}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Unverified</span>
            </span>
          )}
        </div>

        <Field
          label="Registered Email Address"
          hint="Your registered account email address. It is immutable and cannot be modified by resume imports."
        >
          <div className="relative">
            <input
              className="input-base bg-secondary/60 cursor-not-allowed text-ink font-semibold pr-10"
              value={registeredEmail}
              disabled
            />
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-soft">
              <Lock className="w-4 h-4" />
            </div>
          </div>
        </Field>

        {/* OTP Verification Prompt for Unverified Email */}
        {!isEmailVerified && (
          <div className="pt-2 border-t border-border/50 space-y-3">
            {!emailOtpSent ? (
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-ink-soft">
                  Verify your account email with a one-time passcode.
                </span>
                <button
                  type="button"
                  onClick={handleSendEmailOtp}
                  disabled={isSendingEmailOtp || emailCooldown > 0}
                  className="inline-flex items-center gap-1.5 bg-gradient-brand text-white font-semibold px-4 py-2 rounded-xl text-xs hover:shadow-glow transition cursor-pointer disabled:opacity-50"
                >
                  {isSendingEmailOtp ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>{emailCooldown > 0 ? `Resend in ${emailCooldown}s` : "Verify via Email OTP"}</span>
                </button>
              </div>
            ) : (
              <div className="bg-secondary/30 p-4 rounded-xl border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink">
                    Enter the 6-digit OTP code sent to {registeredEmail}:
                  </span>
                  {emailCooldown > 0 && (
                    <span className="text-[11px] text-ink-soft">Resend in {emailCooldown}s</span>
                  )}
                </div>
                <div className="flex items-center gap-2 max-w-sm">
                  <input
                    type="text"
                    maxLength={6}
                    value={emailOtpCode}
                    onChange={(e) => setEmailOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 6-digit OTP"
                    className="input-base tracking-widest text-center text-base font-bold py-2"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyEmailOtp}
                    disabled={isVerifyingEmail || emailOtpCode.length !== 6}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isVerifyingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm OTP"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. ALTERNATE / RESUME EMAIL FIELD WITH STRICT OTP VERIFICATION */}
      <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-primary-glow">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-ink text-sm">Alternate / Resume Email</h3>
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-secondary text-ink-soft">
                  Resume Contact
                </span>
              </div>
            </div>
          </div>
          {isAltEmailVerified ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Verified via OTP</span>
            </span>
          ) : currentAltEmail ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Unverified</span>
            </span>
          ) : null}
        </div>

        <Field
          label="Resume Contact Email"
          hint="Optional secondary email specifically displayed on generated resumes and used for recruiter applications."
        >
          <input
            className={`input-base ${!isEditing ? "bg-secondary/40 text-ink/90 cursor-default" : ""}`}
            value={draft.alternateEmail || draft.resumeEmail || ""}
            disabled={!isEditing}
            onChange={(e) =>
              setDraft((prev) => ({
                ...prev,
                alternateEmail: e.target.value,
                resumeEmail: e.target.value,
              }))
            }
            placeholder="e.g. professional.contact@gmail.com"
          />
        </Field>

        {/* OTP Verification Prompt for Unverified Alternate Email */}
        {Boolean(currentAltEmail && !isAltEmailVerified) && (
          <div className="pt-2 border-t border-border/50 space-y-3">
            {!altEmailOtpSent ? (
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-ink-soft">
                  Verify your alternate resume email with a one-time passcode.
                </span>
                <button
                  type="button"
                  onClick={handleSendAltEmailOtp}
                  disabled={isSendingAltEmailOtp || altEmailCooldown > 0}
                  className="inline-flex items-center gap-1.5 bg-gradient-brand text-white font-semibold px-4 py-2 rounded-xl text-xs hover:shadow-glow transition cursor-pointer disabled:opacity-50"
                >
                  {isSendingAltEmailOtp ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>{altEmailCooldown > 0 ? `Resend in ${altEmailCooldown}s` : "Verify via Email OTP"}</span>
                </button>
              </div>
            ) : (
              <div className="bg-secondary/30 p-4 rounded-xl border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink">
                    Enter the 6-digit OTP code sent to {currentAltEmail}:
                  </span>
                  {altEmailCooldown > 0 && (
                    <span className="text-[11px] text-ink-soft">Resend in {altEmailCooldown}s</span>
                  )}
                </div>
                <div className="flex items-center gap-2 max-w-sm">
                  <input
                    type="text"
                    maxLength={6}
                    value={altEmailOtpCode}
                    onChange={(e) => setAltEmailOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 6-digit OTP"
                    className="input-base tracking-widest text-center text-base font-bold py-2"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyAltEmailOtp}
                    disabled={isVerifyingAltEmail || altEmailOtpCode.length !== 6}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isVerifyingAltEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm OTP"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. MOBILE PHONE NUMBER WITH STRICT OTP VERIFICATION */}
      <div className="p-6 rounded-2xl bg-surface border border-border shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-[oklch(0.6_0.18_160)]">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-ink text-sm">Mobile Phone Number</h3>
          </div>
          {isPhoneVerified ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Verified via OTP</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              <span>Unverified</span>
            </span>
          )}
        </div>

        <Field label="Phone Number" hint="Mobile number used for SMS alerts, recruiter calls, and WhatsApp updates.">
          <input
            className={`input-base ${!isEditing ? "bg-secondary/40 text-ink/90 cursor-default" : ""}`}
            value={draft.phone}
            disabled={!isEditing}
            onChange={(e) => setDraft((prev) => ({ ...prev, phone: e.target.value }))}
            placeholder="+91 98765 43210"
          />
        </Field>

        {/* WhatsApp OTP Verification Prompt */}
        {!isPhoneVerified && (
          <div className="pt-2 border-t border-border/50 space-y-3">
            {!phoneOtpSent ? (
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-ink-soft">
                  Verify your mobile number with a WhatsApp OTP code.
                </span>
                <button
                  type="button"
                  onClick={handleSendPhoneOtp}
                  disabled={isSendingPhoneOtp || phoneCooldown > 0}
                  className="inline-flex items-center gap-1.5 bg-gradient-brand text-white font-semibold px-4 py-2 rounded-xl text-xs hover:shadow-glow transition cursor-pointer disabled:opacity-50"
                >
                  {isSendingPhoneOtp ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Phone className="w-3.5 h-3.5" />
                  )}
                  <span>{phoneCooldown > 0 ? `Resend in ${phoneCooldown}s` : "Verify via WhatsApp OTP"}</span>
                </button>
              </div>
            ) : (
              <div className="bg-secondary/30 p-4 rounded-xl border border-border space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-ink">
                    Enter the 6-digit WhatsApp OTP sent to {draft.phone}:
                  </span>
                  {phoneCooldown > 0 && (
                    <span className="text-[11px] text-ink-soft">Resend in {phoneCooldown}s</span>
                  )}
                </div>
                <div className="flex items-center gap-2 max-w-sm">
                  <input
                    type="text"
                    maxLength={6}
                    value={phoneOtpCode}
                    onChange={(e) => setPhoneOtpCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 6-digit OTP"
                    className="input-base tracking-widest text-center text-base font-bold py-2"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyPhoneOtp}
                    disabled={isVerifyingPhone || phoneOtpCode.length !== 6}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {isVerifyingPhone ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm OTP"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. ADDRESS & PORTFOLIO LINKS */}
      <Card
        icon={MapPin}
        iconColor="text-[oklch(0.6_0.22_25)]"
        title="Address & Links"
        verifiedStatus={verificationStatus}
      >
        <div className="grid gap-4">
          <Field label="Street Address">
            <input
              className={`input-base ${!isEditing ? "bg-secondary/40 text-ink/90 cursor-default" : ""}`}
              value={draft.streetAddress || ""}
              disabled={!isEditing}
              onChange={(e) => setDraft((prev) => ({ ...prev, streetAddress: e.target.value }))}
              placeholder="Street Address / Flat No."
            />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="City">
              <input
                className={`input-base ${!isEditing ? "bg-secondary/40 text-ink/90 cursor-default" : ""}`}
                value={draft.city}
                disabled={!isEditing}
                onChange={(e) => setDraft((prev) => ({ ...prev, city: e.target.value }))}
                placeholder="e.g. Bengaluru"
              />
            </Field>
            <Field label="State / Province">
              <input
                className={`input-base ${!isEditing ? "bg-secondary/40 text-ink/90 cursor-default" : ""}`}
                value={draft.state || ""}
                disabled={!isEditing}
                onChange={(e) => setDraft((prev) => ({ ...prev, state: e.target.value }))}
                placeholder="e.g. Karnataka"
              />
            </Field>
            <Field label="Country">
              <input
                className={`input-base ${!isEditing ? "bg-secondary/40 text-ink/90 cursor-default" : ""}`}
                value={draft.country}
                disabled={!isEditing}
                onChange={(e) => setDraft((prev) => ({ ...prev, country: e.target.value }))}
                placeholder="India"
              />
            </Field>
            <Field label="Postal Code">
              <input
                className={`input-base ${!isEditing ? "bg-secondary/40 text-ink/90 cursor-default" : ""}`}
                value={draft.postalCode || ""}
                disabled={!isEditing}
                onChange={(e) => setDraft((prev) => ({ ...prev, postalCode: e.target.value }))}
                placeholder="560001"
              />
            </Field>
          </div>
          <Field label="LinkedIn / Portfolio">
            <input
              className={`input-base ${!isEditing ? "bg-secondary/40 text-ink/90 cursor-default" : ""}`}
              value={draft.linkedin}
              disabled={!isEditing}
              onChange={(e) => setDraft((prev) => ({ ...prev, linkedin: e.target.value }))}
              placeholder="https://linkedin.com/in/username"
            />
          </Field>
        </div>
        <SaveBar
          isEditing={isEditing}
          onToggleEdit={handleStartEdit}
          onCancel={handleCancel}
          onSave={handleSave}
          isSaving={isSaving}
          onOpenVerify={() => setIsVerifyOpen(true)}
          verificationStatus={verificationStatus}
          documentsCount={verificationDocs.length}
        />
      </Card>

      {/* Verification Document Pipeline Modal */}
      <SectionVerificationModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        section="contacts"
        title="Contact Proof (Government ID, Address Proof)"
        documents={verificationDocs}
        status={verificationStatus}
        profileData={contact}
        onRefresh={onRefreshVerifications}
        onViewDoc={onViewDoc}
      />
    </div>
  );
}

/* --- CATEGORIZED DEGREE DROPDOWN OPTIONS --- */
const DEGREE_CATEGORIES = [
  {
    group: "Engineering & Technology",
    options: [
      "B.Tech in Computer Science & Engineering",
      "B.Tech in Information Technology",
      "B.Tech in Artificial Intelligence & Machine Learning",
      "B.Tech in Data Science",
      "B.Tech in Electronics & Communication",
      "B.Tech in Mechanical Engineering",
      "B.Tech in Civil Engineering",
      "B.Tech in Electrical Engineering",
      "B.E. in Computer Engineering",
      "B.E. in Information Science",
      "M.Tech in Computer Science",
      "M.Tech in Software Engineering",
    ],
  },
  {
    group: "Computer Applications & IT",
    options: [
      "Bachelor of Computer Applications (BCA)",
      "Master of Computer Applications (MCA)",
      "B.S. in Computer Science",
      "M.S. in Computer Science",
      "B.Sc in Computer Science",
      "B.Sc in Information Technology",
      "B.Sc in Data Science",
      "M.Sc in Information Technology",
    ],
  },
  {
    group: "Business, Commerce & Management",
    options: [
      "Bachelor of Business Administration (BBA)",
      "Master of Business Administration (MBA)",
      "Executive MBA",
      "Post Graduate Diploma in Management (PGDM)",
      "Bachelor of Commerce (B.Com)",
      "Bachelor of Commerce (Honours)",
      "Master of Commerce (M.Com)",
      "Chartered Accountant (CA)",
    ],
  },
  {
    group: "Sciences, Design & Arts",
    options: [
      "Bachelor of Science (B.Sc)",
      "Master of Science (M.Sc)",
      "Bachelor of Arts (B.A.)",
      "Master of Arts (M.A.)",
      "B.A. in Economics",
      "Bachelor of Design (B.Des)",
      "Bachelor of Fine Arts (BFA)",
    ],
  },
  {
    group: "Schooling & Diplomas",
    options: [
      "Diploma in Computer Engineering",
      "Polytechnic Diploma",
      "High School Diploma (12th Grade)",
      "Secondary School Certificate (10th Grade)",
      "Ph.D. / Doctorate",
    ],
  },
];

const ALL_DEGREE_PRESETS = DEGREE_CATEGORIES.flatMap((c) => c.options);

/* --- LUXURY CUSTOM DEGREE SELECT DROPDOWN --- */
function DegreeDropdownSelect({
  value,
  onChange,
  degreeType,
  onDegreeTypeChange,
}: {
  value: string;
  onChange: (val: string) => void;
  degreeType: "preset" | "custom";
  onDegreeTypeChange: (type: "preset" | "custom") => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return DEGREE_CATEGORIES;
    const query = searchQuery.toLowerCase();
    return DEGREE_CATEGORIES.map((category) => ({
      ...category,
      options: category.options.filter((opt) => opt.toLowerCase().includes(query)),
    })).filter((category) => category.options.length > 0);
  }, [searchQuery]);

  const selectedDisplay =
    degreeType === "custom"
      ? value ? `Custom: ${value}` : "Custom Degree (Typing...)"
      : value || "Select Degree / Course...";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`input-base w-full flex items-center justify-between text-left cursor-pointer transition-all duration-200 ${
          isOpen ? "ring-2 ring-primary/40 border-primary shadow-glow-sm bg-surface" : "hover:border-primary/50"
        } ${!value ? "text-ink-soft" : "text-ink font-medium"}`}
      >
        <span className="truncate flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-lg bg-primary/10 flex items-center justify-center text-primary-glow shrink-0">
            <GraduationCap className="w-3.5 h-3.5" />
          </div>
          <span className="truncate">{selectedDisplay}</span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-ink-soft shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary-glow" : ""
          }`}
        />
      </button>

      {/* Floating Menu Popover */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl bg-surface/98 backdrop-blur-xl border border-border shadow-2xl overflow-hidden animate-fade-in p-2.5 max-h-80 flex flex-col">
          {/* Search bar inside dropdown */}
          <div className="relative mb-2 shrink-0">
            <Search className="w-3.5 h-3.5 text-ink-soft absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search degrees (e.g. CS, MBA, B.Tech)..."
              className="w-full bg-secondary/50 border border-border rounded-xl pl-9 pr-7 py-2 text-xs text-ink placeholder:text-ink-soft focus:outline-none focus:border-primary/60 focus:bg-surface transition"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink text-xs p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Custom Degree Action */}
          <div className="shrink-0 pb-2 mb-1.5 border-b border-border/80">
            <button
              type="button"
              onClick={() => {
                onDegreeTypeChange("custom");
                if (ALL_DEGREE_PRESETS.includes(value)) {
                  onChange("");
                }
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                degreeType === "custom"
                  ? "bg-gradient-brand text-white shadow-xs"
                  : "bg-primary/5 text-primary-glow hover:bg-primary/10 border border-primary/20"
              }`}
            >
              <Pencil className="w-3.5 h-3.5 shrink-0" />
              <div className="flex-1 truncate">
                <p className="font-semibold">Type Custom Degree / Course</p>
                <p className={`text-[10px] ${degreeType === "custom" ? "text-white/80" : "text-ink-soft"}`}>
                  Enter any non-listed degree manually
                </p>
              </div>
              {degreeType === "custom" && <Check className="w-3.5 h-3.5 shrink-0" />}
            </button>
          </div>

          {/* Categorized Options List */}
          <div className="overflow-y-auto space-y-3 pr-1 scrollbar-thin flex-1">
            {filteredCategories.length === 0 ? (
              <div className="p-4 text-center text-xs text-ink-soft space-y-2">
                <p>No matching degrees found for &quot;{searchQuery}&quot;</p>
                <button
                  type="button"
                  onClick={() => {
                    onDegreeTypeChange("custom");
                    onChange(searchQuery);
                    setIsOpen(false);
                  }}
                  className="text-xs text-primary-glow font-semibold hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Use &quot;{searchQuery}&quot; as Custom Degree
                </button>
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div key={category.group} className="space-y-1">
                  <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink-soft bg-secondary/40 rounded-lg flex items-center gap-1.5">
                    {category.group === "Engineering & Technology" && <GraduationCap className="w-3 h-3 text-violet-500" />}
                    {category.group === "Computer Applications & IT" && <Laptop className="w-3 h-3 text-blue-500" />}
                    {category.group === "Business, Commerce & Management" && <Briefcase className="w-3 h-3 text-amber-500" />}
                    {category.group === "Sciences, Design & Arts" && <Palette className="w-3 h-3 text-pink-500" />}
                    {category.group === "Schooling & Diplomas" && <Award className="w-3 h-3 text-emerald-500" />}
                    <span>{category.group}</span>
                  </div>
                  <div className="space-y-0.5 pt-0.5">
                    {category.options.map((opt) => {
                      const isSelected = degreeType === "preset" && value === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            onDegreeTypeChange("preset");
                            onChange(opt);
                            setIsOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs transition flex items-center justify-between cursor-pointer group ${
                            isSelected
                              ? "bg-primary text-white font-semibold shadow-xs"
                              : "text-ink hover:bg-secondary/80 hover:text-primary-glow"
                          }`}
                        >
                          <span className="truncate pr-2">{opt}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* --- EDUCATION SECTION --- */
function EducationSection({
  profile,
  verificationDocs,
  verificationStatus,
  onUpdate,
  onSave,
  isSaving,
  onRefreshVerifications,
  onViewDoc,
}: {
  profile: ProfileData;
  verificationDocs: VerificationDocument[];
  verificationStatus: VerificationStatus;
  onUpdate: (updater: (prev: ProfileData) => ProfileData) => void;
  onSave: (dataToSave?: ProfileData) => void;
  isSaving?: boolean;
  onRefreshVerifications: () => void;
  onViewDoc?: (doc: VerificationDocument) => void;
}) {
  const list = profile.educationsList || [];
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [percentDraft, setPercentDraft] = useState(profile.academicPercentage?.toString() ?? "");
  const [savingPercent, setSavingPercent] = useState(false);

  useEffect(() => {
    setPercentDraft(profile.academicPercentage?.toString() ?? "");
  }, [profile.academicPercentage]);

  const handleSavePercent = () => {
    const value = percentDraft.trim() === "" ? undefined : Number(percentDraft);
    if (value !== undefined && (isNaN(value) || value < 0 || value > 100)) {
      toast.error("Academic percentage must be a number between 0 and 100.");
      return;
    }
    setSavingPercent(true);
    const updatedProfile: ProfileData = { ...profile, academicPercentage: value };
    onUpdate(() => updatedProfile);
    onSave(updatedProfile);
    toast.success("Academic percentage saved.");
    setSavingPercent(false);
  };

  const [institution, setInstitution] = useState("");
  const [degree, setDegree] = useState("");
  const [degreeType, setDegreeType] = useState<"preset" | "custom">("preset");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [certificateUrl, setCertificateUrl] = useState("");
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  const resetForm = () => {
    setInstitution("");
    setDegree("");
    setDegreeType("preset");
    setStartYear("");
    setEndYear("");
    setCertificateUrl("");
    setIsAdding(false);
    setEditingId(null);
  };

  const handleStartAdd = () => {
    resetForm();
    setIsAdding(true);
  };

  const handleStartEdit = (edu: EducationItem) => {
    setEditingId(edu.id);
    setInstitution(edu.institution);
    setDegree(edu.degree);
    const isKnown = ALL_DEGREE_PRESETS.includes(edu.degree);
    setDegreeType(isKnown ? "preset" : (edu.degree ? "custom" : "preset"));
    setStartYear(edu.startYear);
    setEndYear(edu.endYear);
    setCertificateUrl(edu.certificateUrl || "");
    setIsAdding(false);
  };

  const handleSaveDegree = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution.trim() || !degree.trim()) {
      toast.error("Please enter both an institution and degree name.");
      return;
    }

    if (editingId) {
      // Editing existing degree
      const updatedList = list.map((item) =>
        item.id === editingId
          ? {
              ...item,
              institution: institution.trim(),
              degree: degree.trim(),
              startYear: startYear.trim() || "2020",
              endYear: endYear.trim() || "2024",
              certificateUrl: certificateUrl.trim(),
            }
          : item
      );

      const top = updatedList[0] || { institution: "", degree: "", startYear: "", endYear: "", certificateUrl: "" };
      const updatedProfile: ProfileData = {
        ...profile,
        education: top,
        educationsList: updatedList,
      };

      onUpdate(() => updatedProfile);
      onSave(updatedProfile);
      toast.success("Education credential updated successfully!");
      resetForm();
    } else {
      // Adding new degree
      const newItem: EducationItem = {
        id: `edu-${Date.now()}`,
        institution: institution.trim(),
        degree: degree.trim(),
        startYear: startYear.trim() || "2020",
        endYear: endYear.trim() || "2024",
        certificateUrl: certificateUrl.trim(),
      };

      const updatedList = [newItem, ...list];
      const updatedProfile: ProfileData = {
        ...profile,
        education: {
          institution: newItem.institution,
          degree: newItem.degree,
          startYear: newItem.startYear,
          endYear: newItem.endYear,
          certificateUrl: newItem.certificateUrl,
        },
        educationsList: updatedList,
      };

      onUpdate(() => updatedProfile);
      onSave(updatedProfile);
      toast.success("New education degree added successfully!");
      resetForm();
    }
  };

  const handleRemove = (id: string) => {
    const newList = list.filter((item) => item.id !== id);
    const top = newList[0] || { institution: "", degree: "", startYear: "", endYear: "", certificateUrl: "" };
    const updatedProfile: ProfileData = {
      ...profile,
      education: top,
      educationsList: newList,
    };
    onUpdate(() => updatedProfile);
    onSave(updatedProfile);
    toast.success("Education degree removed");
    if (editingId === id) resetForm();
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <SectionHeader
        title="Education"
        subtitle="Add every degree and certification — verified ones earn extra points."
        status={verificationStatus}
        onOpenVerify={() => setIsVerifyOpen(true)}
        action={
          !isAdding && !editingId ? (
            <button
              type="button"
              onClick={handleStartAdd}
              className="inline-flex items-center gap-1.5 bg-gradient-brand text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-xs hover:shadow-glow transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Education</span>
            </button>
          ) : null
        }
      />

      {/* Academic Percentage — a single, overall figure used to check job eligibility requirements */}
      <Card icon={GraduationCap} iconColor="text-primary-glow" title="Academic Percentage">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1 max-w-[200px]">
            <Field label="Overall percentage" hint="Used to check eligibility for jobs that specify a minimum percentage.">
              <input
                type="number"
                min={0}
                max={100}
                step="0.01"
                className="input-base"
                placeholder="e.g. 75"
                value={percentDraft}
                onChange={(e) => setPercentDraft(e.target.value)}
              />
            </Field>
          </div>
          <button
            type="button"
            onClick={handleSavePercent}
            disabled={savingPercent}
            className="bg-gradient-brand text-white font-semibold px-5 py-2.5 rounded-xl text-xs shadow-elegant hover:shadow-glow transition cursor-pointer disabled:opacity-60 shrink-0"
          >
            Save
          </button>
        </div>
      </Card>

      {/* Add / Edit Form Card */}
      {(isAdding || editingId) && (
        <Card
          icon={GraduationCap}
          iconColor="text-[oklch(0.55_0.22_285)]"
          title={editingId ? "Edit Education" : "Add Education"}
        >
          <form onSubmit={handleSaveDegree} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Institution / University">
                <input
                  className="input-base"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. Stanford University"
                  required
                />
              </Field>

              <Field
                label="Degree / Qualification"
                hint="Click to select from standard degrees or type custom."
              >
                <DegreeDropdownSelect
                  value={degree}
                  onChange={(val) => setDegree(val)}
                  degreeType={degreeType}
                  onDegreeTypeChange={(t) => setDegreeType(t)}
                />
              </Field>

              {/* Custom Degree Input Field */}
              {degreeType === "custom" && (
                <div className="sm:col-span-2 animate-fade-in p-3.5 rounded-2xl bg-primary/5 border border-primary/20 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary-glow flex items-center gap-1.5">
                      <Pencil className="w-3.5 h-3.5" /> Custom Degree Title
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setDegreeType("preset");
                        setDegree("");
                      }}
                      className="text-[11px] text-ink-soft hover:text-ink underline cursor-pointer"
                    >
                      Choose from standard dropdown
                    </button>
                  </div>
                  <input
                    className="input-base bg-surface"
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. B.S. in Computational Neuroscience & AI"
                    required
                    autoFocus
                  />
                </div>
              )}

              <Field label="Start year">
                <input
                  className="input-base"
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value)}
                  placeholder="2020"
                />
              </Field>
              <Field label="End year (or Expected)">
                <input
                  className="input-base"
                  value={endYear}
                  onChange={(e) => setEndYear(e.target.value)}
                  placeholder="2024"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field
                  label="Certificate URL / Link"
                  hint="Upload a link to your official certificate or marksheet."
                >
                  <input
                    className="input-base"
                    value={certificateUrl}
                    onChange={(e) => setCertificateUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </Field>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={resetForm}
                disabled={isSaving}
                className="px-4 py-2 text-xs font-semibold text-ink-soft hover:text-ink rounded-xl border border-border hover:bg-secondary transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 bg-gradient-brand text-white font-semibold px-5 py-2 rounded-xl text-xs shadow-elegant hover:shadow-glow transition cursor-pointer disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{editingId ? "Save Changes" : "Add Education"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Render list of added degrees */}
      {list.map((edu) => (
        <Card
          key={edu.id}
          icon={GraduationCap}
          iconColor="text-[oklch(0.55_0.22_285)]"
          title={edu.degree || "Your Degree"}
          verifiedStatus={verificationStatus}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-ink text-sm">{edu.institution}</p>
              <p className="text-xs text-ink-soft mt-1">
                {edu.startYear} — {edu.endYear || "Present"}
              </p>
              {edu.certificateUrl && (
                <a
                  href={edu.certificateUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary-glow font-semibold mt-2.5 hover:underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> View Certificate
                </a>
              )}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handleStartEdit(edu)}
                className="text-ink-soft hover:text-primary-glow p-2 rounded-xl hover:bg-secondary border border-border transition cursor-pointer"
                title="Edit degree"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleRemove(edu.id)}
                className="text-ink-soft hover:text-rose-500 p-2 rounded-xl hover:bg-rose-50 border border-border transition cursor-pointer"
                title="Delete degree"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </Card>
      ))}

      {list.length === 0 && !isAdding && !editingId && (
        <div className="p-8 rounded-2xl border border-dashed border-border text-center space-y-3 bg-surface/50">
          <GraduationCap className="w-8 h-8 text-ink-soft mx-auto opacity-50" />
          <div className="space-y-1">
            <p className="font-bold text-ink text-sm">No education added yet</p>
            <p className="text-xs text-ink-soft">Once added, degrees will show up here with verification status.</p>
          </div>
          <button
            type="button"
            onClick={handleStartAdd}
            className="inline-flex items-center gap-1.5 bg-secondary hover:bg-border text-ink font-semibold px-4 py-2 rounded-xl text-xs border border-border transition cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-primary-glow" />
            <span>Add Your First Degree</span>
          </button>
        </div>
      )}

      {/* Section Footer Bar */}
      <SaveBar
        hideEdit
        onOpenVerify={() => setIsVerifyOpen(true)}
        verificationStatus={verificationStatus}
        documentsCount={verificationDocs.length}
      />

      {/* Verification Document Pipeline Modal */}
      <SectionVerificationModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        section="education"
        title="Education Credentials Verification (Degree Certificate, Marksheet, Transcript)"
        documents={verificationDocs}
        status={verificationStatus}
        profileData={profile.education}
        onRefresh={onRefreshVerifications}
        onViewDoc={onViewDoc}
      />
    </div>
  );
}


/* --- WORK EXPERIENCE SECTION --- */
function ExperienceSection({
  profile,
  verificationDocs,
  verificationStatus,
  onUpdate,
  onSave,
  isSaving,
  onRefreshVerifications,
  onViewDoc,
}: {
  profile: ProfileData;
  verificationDocs: VerificationDocument[];
  verificationStatus: VerificationStatus;
  onUpdate: (updater: (prev: ProfileData) => ProfileData) => void;
  onSave: (dataToSave?: ProfileData) => void;
  isSaving?: boolean;
  onRefreshVerifications: () => void;
  onViewDoc?: (doc: VerificationDocument) => void;
}) {
  const list = profile.experiencesList || [];
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [highlights, setHighlights] = useState("");
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  const resetForm = () => {
    setCompany("");
    setTitle("");
    setStart("");
    setEnd("");
    setHighlights("");
    setIsAdding(false);
    setEditingId(null);
  };

  const handleStartAdd = () => {
    resetForm();
    setIsAdding(true);
  };

  const handleStartEdit = (exp: ExperienceItem) => {
    setEditingId(exp.id);
    setCompany(exp.company);
    setTitle(exp.title);
    setStart(exp.start);
    setEnd(exp.end);
    setHighlights(exp.highlights || "");
    setIsAdding(false);
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !title.trim()) {
      toast.error("Please enter both a company name and job title.");
      return;
    }

    if (editingId) {
      // Edit existing role
      const updatedList = list.map((item) =>
        item.id === editingId
          ? {
              ...item,
              company: company.trim(),
              title: title.trim(),
              start: start || "2022-01",
              end: end || "Present",
              highlights: highlights.trim(),
            }
          : item
      );

      const top = updatedList[0] || { company: "", title: "", start: "", end: "", highlights: "" };
      const updatedProfile: ProfileData = {
        ...profile,
        experience: top,
        experiencesList: updatedList,
      };

      onUpdate(() => updatedProfile);
      onSave(updatedProfile);
      toast.success("Work experience updated successfully!");
      resetForm();
    } else {
      // Add new role
      const newItem: ExperienceItem = {
        id: `exp-${Date.now()}`,
        company: company.trim(),
        title: title.trim(),
        start: start || "2022-01",
        end: end || "Present",
        highlights: highlights.trim(),
      };

      const updatedList = [newItem, ...list];
      const updatedProfile: ProfileData = {
        ...profile,
        experience: {
          company: newItem.company,
          title: newItem.title,
          start: newItem.start,
          end: newItem.end,
          highlights: newItem.highlights,
        },
        experiencesList: updatedList,
      };

      onUpdate(() => updatedProfile);
      onSave(updatedProfile);
      toast.success("New work experience added successfully!");
      resetForm();
    }
  };

  const handleRemove = (id: string) => {
    const newList = list.filter((item) => item.id !== id);
    const top = newList[0] || { company: "", title: "", start: "", end: "", highlights: "" };
    const updatedProfile: ProfileData = {
      ...profile,
      experience: top,
      experiencesList: newList,
    };
    onUpdate(() => updatedProfile);
    onSave(updatedProfile);
    toast.success("Work experience removed");
    if (editingId === id) resetForm();
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <SectionHeader
        title="Work Experience"
        subtitle="Every role you've held. Verified experiences unlock offers."
        status={verificationStatus}
        onOpenVerify={() => setIsVerifyOpen(true)}
        action={
          !isAdding && !editingId ? (
            <button
              type="button"
              onClick={handleStartAdd}
              className="inline-flex items-center gap-1.5 bg-gradient-brand text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-xs hover:shadow-glow transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Role</span>
            </button>
          ) : null
        }
      />

      {/* Add / Edit Form Card */}
      {(isAdding || editingId) && (
        <Card
          icon={Briefcase}
          iconColor="text-[oklch(0.65_0.18_45)]"
          title={editingId ? "Edit Work Experience" : "Add Work Experience"}
        >
          <form onSubmit={handleSaveRole} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Company">
                <input
                  className="input-base"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  required
                />
              </Field>
              <Field label="Job title">
                <input
                  className="input-base"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  required
                />
              </Field>
              <Field label="Start date">
                <input
                  type="month"
                  className="input-base"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                />
              </Field>
              <Field label="End date">
                <input
                  type="month"
                  className="input-base"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Highlights">
                  <textarea
                    rows={4}
                    className="input-base"
                    value={highlights}
                    onChange={(e) => setHighlights(e.target.value)}
                    placeholder="Shipped features, led projects, improved performance..."
                  />
                </Field>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-border flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={resetForm}
                disabled={isSaving}
                className="px-4 py-2 text-xs font-semibold text-ink-soft hover:text-ink rounded-xl border border-border hover:bg-secondary transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 bg-gradient-brand text-white font-semibold px-5 py-2 rounded-xl text-xs shadow-elegant hover:shadow-glow transition cursor-pointer disabled:opacity-60"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{editingId ? "Save Changes" : "Add Role"}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* Render list of added experiences */}
      {list.map((exp) => (
        <Card
          key={exp.id}
          icon={Briefcase}
          iconColor="text-[oklch(0.65_0.18_45)]"
          title={exp.title || "Your Role"}
          verifiedStatus={verificationStatus}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-ink text-sm">{exp.company}</p>
              <p className="text-xs text-ink-soft mt-1">
                {exp.start || "—"} → {exp.end || "Present"}
              </p>
              {exp.highlights && <p className="text-xs text-ink mt-3 whitespace-pre-line leading-relaxed">{exp.highlights}</p>}
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={() => handleStartEdit(exp)}
                className="text-ink-soft hover:text-primary-glow p-2 rounded-xl hover:bg-secondary border border-border transition cursor-pointer"
                title="Edit role"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleRemove(exp.id)}
                className="text-ink-soft hover:text-rose-500 p-2 rounded-xl hover:bg-rose-50 border border-border transition cursor-pointer"
                title="Delete role"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>
      ))}

      {list.length === 0 && !isAdding && !editingId && (
        <div className="p-8 rounded-2xl border border-dashed border-border text-center space-y-3 bg-surface/50">
          <Briefcase className="w-8 h-8 text-ink-soft mx-auto opacity-50" />
          <div className="space-y-1">
            <p className="font-bold text-ink text-sm">No work experience added yet</p>
            <p className="text-xs text-ink-soft">Your roles will appear here once added.</p>
          </div>
          <button
            type="button"
            onClick={handleStartAdd}
            className="inline-flex items-center gap-1.5 bg-secondary hover:bg-border text-ink font-semibold px-4 py-2 rounded-xl text-xs border border-border transition cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-primary-glow" />
            <span>Add Your First Role</span>
          </button>
        </div>
      )}

      {/* Section Footer Bar */}
      <SaveBar
        hideEdit
        onOpenVerify={() => setIsVerifyOpen(true)}
        verificationStatus={verificationStatus}
        documentsCount={verificationDocs.length}
      />

      {/* Verification Document Pipeline Modal */}
      <SectionVerificationModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        section="experience"
        title="Experience Proof (Experience Letter, Offer Letter, Relieving Letter, Salary Slip)"
        documents={verificationDocs}
        status={verificationStatus}
        profileData={profile.experience}
        onRefresh={onRefreshVerifications}
        onViewDoc={onViewDoc}
      />
    </div>
  );
}


/* --- SKILLS SECTION --- */
function SkillsSection({
  profile,
  verificationDocs,
  verificationStatus,
  onUpdate,
  onSave,
  isSaving,
  onRefreshVerifications,
  onViewDoc,
}: {
  profile: ProfileData;
  verificationDocs: VerificationDocument[];
  verificationStatus: VerificationStatus;
  onUpdate: (updater: (prev: ProfileData) => ProfileData) => void;
  onSave: (dataToSave?: ProfileData) => void;
  isSaving?: boolean;
  onRefreshVerifications: () => void;
  onViewDoc?: (doc: VerificationDocument) => void;
}) {
  const [newSkill, setNewSkill] = useState("");
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const suggested = [
    "React",
    "TypeScript",
    "Node.js",
    "Next.js",
    "Python",
    "SQL",
    "Tailwind CSS",
    "Figma",
    "AWS",
    "Docker",
    "GraphQL",
    "System Design",
    "MongoDB",
    "PostgreSQL",
  ].filter((s) => !profile.skills.includes(s));

  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (!trimmed) return;
    if (profile.skills.includes(trimmed)) {
      toast.info(`"${trimmed}" is already added to your skills.`);
      return;
    }

    const updatedProfile: ProfileData = {
      ...profile,
      skills: [...profile.skills, trimmed],
    };
    onUpdate(() => updatedProfile);
    setNewSkill("");
    onSave(updatedProfile);
    toast.success(`Skill "${trimmed}" added!`);
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const updatedProfile: ProfileData = {
      ...profile,
      skills: profile.skills.filter((s) => s !== skillToRemove),
    };
    onUpdate(() => updatedProfile);
    onSave(updatedProfile);
    toast.success(`Skill "${skillToRemove}" removed`);
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <SectionHeader
        title="Skills"
        subtitle="Add skills and upload certificates to earn verification badges."
        status={verificationStatus}
        onOpenVerify={() => setIsVerifyOpen(true)}
      />

      {profile.skills.length > 0 && (
        <Card
          icon={Zap}
          iconColor="text-[oklch(0.5_0.2_265)]"
          title={`Your Skills (${profile.skills.length})`}
          verifiedStatus={verificationStatus}
        >
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-2 text-sm px-3.5 py-1.5 rounded-full bg-gradient-brand text-white font-semibold shadow-xs"
              >
                <span>{s}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(s)}
                  className="hover:text-rose-200 transition cursor-pointer"
                  title={`Remove ${s}`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        </Card>
      )}

      <Card icon={Zap} iconColor="text-[oklch(0.5_0.2_265)]" title="Add a skill">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddSkill(newSkill);
          }}
          className="flex gap-3"
        >
          <input
            className="input-base flex-1"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="e.g. React, Node.js, Python"
          />
          <button
            type="submit"
            disabled={isSaving || !newSkill.trim()}
            className="bg-gradient-brand text-white font-semibold px-5 rounded-xl text-sm hover:shadow-glow transition cursor-pointer shrink-0 disabled:opacity-60"
          >
            Add Skill
          </button>
        </form>

        {suggested.length > 0 && (
          <>
            <p className="text-xs font-semibold text-ink-soft mt-5 mb-2">SUGGESTED SKILLS</p>
            <div className="flex flex-wrap gap-2">
              {suggested.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleAddSkill(s)}
                  className="text-sm px-3 py-1.5 rounded-full border border-border bg-secondary/50 text-ink hover:bg-secondary transition cursor-pointer font-medium"
                >
                  + {s}
                </button>
              ))}
            </div>
          </>
        )}
      </Card>

      {profile.skills.length === 0 && (
        <EmptyList
          title="No skills added yet"
          subtitle="Skills you add will show verification status here."
        />
      )}

      {/* Section Footer Bar */}
      <SaveBar
        hideEdit
        onOpenVerify={() => setIsVerifyOpen(true)}
        verificationStatus={verificationStatus}
        documentsCount={verificationDocs.length}
      />

      {/* Verification Document Pipeline Modal */}
      <SectionVerificationModal
        isOpen={isVerifyOpen}
        onClose={() => setIsVerifyOpen(false)}
        section="skills"
        title="Skill Verification (Certification PDFs, Course Certificates)"
        documents={verificationDocs}
        status={verificationStatus}
        profileData={{ skills: profile.skills }}
        onRefresh={onRefreshVerifications}
        onViewDoc={onViewDoc}
      />
    </div>
  );
}

/* --- MAIN PROFILE PAGE WITH FULL IDENTITY VERIFICATION SYSTEM --- */
export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "unsaved" | "saving" | "saved" | "error">("idle");
  const [previewDoc, setPreviewDoc] = useState<VerificationDocument | null>(null);
  const tabScrollRef = useRef<HTMLDivElement>(null);

  // References for debounced auto-save & concurrency safety
  const initialLoadedRef = React.useRef(false);
  const lastSavedJsonRef = React.useRef<string>("");
  const autoSaveTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  // Verification state from backend
  const [verificationData, setVerificationData] = useState<VerificationResponse | null>(null);

  // Fetch verification documents & statuses from backend
  const fetchVerifications = useCallback(async () => {
    try {
      const data = await VerificationService.getVerifications();
      setVerificationData(data);
    } catch (err) {
      console.warn("Failed to fetch verification status from server:", err);
    }
  }, []);

  useEffect(() => {
    fetchVerifications();
  }, [fetchVerifications]);

  // Global polling for pending documents across all sections
  useEffect(() => {
    const hasPending = (verificationData?.documents || []).some(
      (doc) => doc.verification.status === "pending"
    );
    if (!hasPending) return;

    const interval = setInterval(() => {
      fetchVerifications();
    }, 3000);

    return () => clearInterval(interval);
  }, [verificationData, fetchVerifications]);

  // Profile data state persisted in local state & pre-populated from user store & loaded from DB
  const [profile, setProfile] = useState<ProfileData>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user_profile_data");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback
        }
      }
    }
    return DEFAULT_PROFILE;
  });

  const profileRef = React.useRef(profile);
  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  // Fetch profile from database on initial load
  const fetchProfile = useCallback(async () => {
    try {
      const dbProfile = await ProfileService.getProfile();
      if (dbProfile) {
        setProfile((prev) => {
          const merged: ProfileData = {
            ...prev,
            ...dbProfile,
            personal: { ...prev.personal, ...(dbProfile.personal || {}) },
            contact: { ...prev.contact, ...(dbProfile.contact || {}) },
            education: { ...prev.education, ...(dbProfile.education || {}) },
            educationsList: dbProfile.educationsList || prev.educationsList || [],
            experience: { ...prev.experience, ...(dbProfile.experience || {}) },
            experiencesList: dbProfile.experiencesList || prev.experiencesList || [],
            skills: dbProfile.skills || prev.skills || [],
          };
          if (typeof window !== "undefined") {
            localStorage.setItem("user_profile_data", JSON.stringify(merged));
          }
          lastSavedJsonRef.current = JSON.stringify(merged);
          return merged;
        });
      }
    } catch (err) {
      console.warn("Failed to load profile from database:", err);
    } finally {
      initialLoadedRef.current = true;
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Sync logged in user name/email if present
  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        contact: {
          ...prev.contact,
          fullName: prev.contact.fullName || user.fullName || user.username || "",
          email: user.email || prev.contact.email || "",
        },
        personal: {
          ...prev.personal,
          firstName: prev.personal.firstName || (user.fullName ? user.fullName.split(" ")[0] : ""),
          lastName: prev.personal.lastName || (user.fullName ? user.fullName.split(" ").slice(1).join(" ") : ""),
        },
      }));
    }
  }, [user]);

  // Handle Save to DB with deduplication and state tracking
  const handleSave = useCallback(async (dataToSave?: ProfileData) => {
    // Clear any pending debounce timer when explicit or auto-save triggers
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
      autoSaveTimerRef.current = null;
    }

    const target = dataToSave || profileRef.current;
    const targetJson = JSON.stringify(target);

    // Skip redundant network request if already identical to what is in database
    if (targetJson === lastSavedJsonRef.current && lastSavedJsonRef.current !== "") {
      setSaveStatus("idle");
      return;
    }

    setIsSaving(true);
    setSaveStatus("saving");

    if (typeof window !== "undefined") {
      localStorage.setItem("user_profile_data", targetJson);
    }

    try {
      const updated = await ProfileService.updateProfile(target);
      if (updated) {
        setProfile((prev) => ({
          ...prev,
          ...updated,
        }));
        lastSavedJsonRef.current = JSON.stringify({ ...target, ...updated });
      } else {
        lastSavedJsonRef.current = targetJson;
      }
      setSaveStatus("saved");
      setTimeout(() => {
        setSaveStatus((curr) => (curr === "saved" ? "idle" : curr));
      }, 3000);
    } catch (err: any) {
      console.error("Failed to save profile to database:", err);
      setSaveStatus("error");
      const errorMsg = err?.message || "Failed to save profile to database.";
      toast.error(errorMsg);
    } finally {
      setIsSaving(false);
    }
  }, []);

  // Frontend Debounced Auto-Save: Coalesces rapid keystrokes/updates into a single request
  useEffect(() => {
    if (!initialLoadedRef.current) return;

    const currentStr = JSON.stringify(profile);
    if (currentStr === lastSavedJsonRef.current) {
      return;
    }

    setSaveStatus("unsaved");

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      handleSave();
    }, 1200);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [profile, handleSave]);

  const handleNavigate = (sec: SectionId) => {
    if (sec === "generate") {
      router.push("/builder");
    } else {
      setActiveSection(sec);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // "Overview" and the ten newly-requested top-level My Profile options - plain (non-grouped) tabs.
  const OVERVIEW_SECTION = { id: "overview" as SectionId, label: "Overview", icon: Compass };
  const NEW_TOP_LEVEL_SECTIONS = [
    { id: "talentPulse360" as SectionId, label: "Talent Pulse 360", icon: TrendingUp },
    { id: "neuroCareer360" as SectionId, label: "Neuro Career 360", icon: BrainCircuit },
    { id: "languagePlus" as SectionId, label: "Language+", icon: Languages },
    { id: "careerSolutionsPlus" as SectionId, label: "Career Solutions+", icon: Lightbulb },
    { id: "referrals" as SectionId, label: "Referrals", icon: UserPlus },
    { id: "projects" as SectionId, label: "Projects", icon: FolderKanban },
    { id: "earnings" as SectionId, label: "Earnings", icon: Wallet },
    { id: "credentials" as SectionId, label: "Credentials", icon: Award },
    { id: "connections" as SectionId, label: "Connections", icon: Link2 },
    { id: "myHr" as SectionId, label: "My HR", icon: Building2 },
  ];

  // All pre-existing My Profile options, now grouped under the "Personal Details" dropdown.
  // Ids/labels are unchanged from before this reorganization.
  const PERSONAL_DETAILS_CHILDREN = [
    { id: "personal" as SectionId, label: "Personal Details", icon: User },
    { id: "contacts" as SectionId, label: "Contact Details", icon: Mail },
    { id: "experience" as SectionId, label: "Work Experience", icon: Briefcase },
    { id: "education" as SectionId, label: "Education", icon: GraduationCap },
    { id: "skills" as SectionId, label: "Skills", icon: Zap },
  ];
  const isPersonalDetailsActive = PERSONAL_DETAILS_CHILDREN.some((c) => c.id === activeSection);

  const renderPlainTab = (sec: { id: SectionId; label: string; icon: typeof Compass }) => {
    const Icon = sec.icon;
    const isActive = activeSection === sec.id;
    return (
      <button
        key={sec.id}
        onClick={() => handleNavigate(sec.id)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
          isActive
            ? "bg-gradient-brand text-white shadow-elegant"
            : "text-ink-soft hover:text-ink hover:bg-secondary/60"
        }`}
      >
        <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-primary-glow"}`} />
        <span>{sec.label}</span>
      </button>
    );
  };

  const renderSubTab = (child: { id: SectionId; label: string; icon: typeof Compass }) => {
    const ChildIcon = child.icon;
    const isChildActive = activeSection === child.id;
    const childStatus = getSectionStatus(child.id as SectionType);
    return (
      <button
        key={child.id}
        onClick={() => handleNavigate(child.id)}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
          isChildActive
            ? "bg-primary/15 text-primary border border-primary/30"
            : "text-ink-soft hover:text-ink hover:bg-surface border border-transparent"
        }`}
      >
        <ChildIcon className={`w-3.5 h-3.5 ${isChildActive ? "text-primary" : "text-primary-glow"}`} />
        <span>{child.label}</span>
        {childStatus !== "unsubmitted" && (
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              childStatus === "verified" ? "bg-emerald-400" : childStatus === "pending" ? "bg-amber-400" : "bg-rose-400"
            }`}
          />
        )}
      </button>
    );
  };

  const scrollTabsBy = (direction: 1 | -1) => {
    tabScrollRef.current?.scrollBy({ left: direction * 220, behavior: "smooth" });
  };

  const getSectionDocs = (sec: SectionType): VerificationDocument[] => {
    return (verificationData?.documents || []).filter((d) => d.section === sec);
  };

  const getSectionStatus = (sec: SectionType): VerificationStatus => {
    return verificationData?.sections?.[sec]?.status || "unsubmitted";
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Top Header Navigation Tabs with Live Auto-Save Status */}
      <div className="bg-surface border border-border rounded-2xl p-2 shadow-xs flex items-center gap-2 select-none">
        {/* Scroll Left */}
        <button
          type="button"
          onClick={() => scrollTabsBy(-1)}
          aria-label="Scroll navigation left"
          className="hidden sm:flex shrink-0 p-1.5 rounded-lg text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div ref={tabScrollRef} className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth flex-1 min-w-0">
          {renderPlainTab(OVERVIEW_SECTION)}

          {/* Personal Details - plain tab; selecting it reveals a sub-nav row below with its options */}
          <button
            onClick={() => handleNavigate("personal")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              isPersonalDetailsActive
                ? "bg-gradient-brand text-white shadow-elegant"
                : "text-ink-soft hover:text-ink hover:bg-secondary/60"
            }`}
          >
            <User className={`w-4 h-4 ${isPersonalDetailsActive ? "text-white" : "text-primary-glow"}`} />
            <span>Personal Details</span>
          </button>

          {NEW_TOP_LEVEL_SECTIONS.map((sec) => renderPlainTab(sec))}
        </div>

        {/* Scroll Right */}
        <button
          type="button"
          onClick={() => scrollTabsBy(1)}
          aria-label="Scroll navigation right"
          className="hidden sm:flex shrink-0 p-1.5 rounded-lg text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Live Auto-Save Indicator */}
        <div className="hidden lg:flex items-center pl-3 ml-1 border-l border-border shrink-0">
          {saveStatus === "saving" && (
            <span className="inline-flex items-center gap-1.5 text-xs text-amber-500 font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </span>
          )}
          {saveStatus === "saved" && (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-500 font-medium animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Saved to cloud</span>
            </span>
          )}
          {saveStatus === "unsaved" && (
            <span className="inline-flex items-center gap-1.5 text-xs text-ink-soft font-medium">
              <Clock className="w-3.5 h-3.5" />
              <span>Unsaved changes</span>
            </span>
          )}
          {saveStatus === "error" && (
            <span className="inline-flex items-center gap-1.5 text-xs text-rose-500 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Save error</span>
            </span>
          )}
        </div>
      </div>

      {/* Personal Details Sub-Navigation - shown only while a Personal Details option is active */}
      {isPersonalDetailsActive && (
        <div className="bg-surface-alt/40 border border-border rounded-2xl p-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar -mt-3">
          {PERSONAL_DETAILS_CHILDREN.map((child) => renderSubTab(child))}
        </div>
      )}

      {/* Main Section Render Area */}
      <div>
        {activeSection === "overview" && (
          <Overview
            profile={profile}
            verificationData={verificationData}
            onNavigate={handleNavigate}
            onCompleteProfile={() => handleNavigate("contacts")}
            onViewDoc={(doc) => setPreviewDoc(doc)}
          />
        )}

        {activeSection === "personal" && (
          <PersonalSection
            profile={profile}
            verificationDocs={getSectionDocs("personal")}
            verificationStatus={getSectionStatus("personal")}
            onUpdate={setProfile}
            onSave={handleSave}
            isSaving={isSaving}
            onRefreshVerifications={fetchVerifications}
          />
        )}

        {activeSection === "contacts" && (
          <ContactsSection
            profile={profile}
            verificationDocs={getSectionDocs("contacts")}
            verificationStatus={getSectionStatus("contacts")}
            onUpdate={setProfile}
            onSave={handleSave}
            isSaving={isSaving}
            onRefreshVerifications={fetchVerifications}
          />
        )}

        {activeSection === "education" && (
          <EducationSection
            profile={profile}
            verificationDocs={getSectionDocs("education")}
            verificationStatus={getSectionStatus("education")}
            onUpdate={setProfile}
            onSave={handleSave}
            isSaving={isSaving}
            onRefreshVerifications={fetchVerifications}
          />
        )}

        {activeSection === "experience" && (
          <ExperienceSection
            profile={profile}
            verificationDocs={getSectionDocs("experience")}
            verificationStatus={getSectionStatus("experience")}
            onUpdate={setProfile}
            onSave={handleSave}
            isSaving={isSaving}
            onRefreshVerifications={fetchVerifications}
          />
        )}

        {activeSection === "skills" && (
          <SkillsSection
            profile={profile}
            verificationDocs={getSectionDocs("skills")}
            verificationStatus={getSectionStatus("skills")}
            onUpdate={setProfile}
            onSave={handleSave}
            isSaving={isSaving}
            onRefreshVerifications={fetchVerifications}
          />
        )}

        {activeSection === "neuroCareer360" && <NeuroCareer360 />}
        {activeSection === "talentPulse360" && <TalentPulse360 />}

        {NEW_TOP_LEVEL_SECTIONS.filter((sec) => sec.id !== "neuroCareer360" && sec.id !== "talentPulse360").map((sec) =>
          activeSection === sec.id ? <ComingSoon key={sec.id} title={sec.label} icon={sec.icon} /> : null
        )}
      </div>

      {/* Global Document Viewer Modal */}
      <DocumentViewerModal document={previewDoc} onClose={() => setPreviewDoc(null)} />

      {/* Contextual AI Assistant */}
      <AIChat
        context="profile"
        contextPayload={{
          activeProfileSection: activeSection,
          activeProfileContext: profile,
        }}
      />
    </div>
  );
}
