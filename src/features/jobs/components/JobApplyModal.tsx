"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Briefcase,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Loader2,
  FileText,
  AlertCircle,
  ChevronDown,
  Plus,
} from "lucide-react";
import { IJob } from "../types/job.types";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { applicationService } from "@/features/applications/services/applicationService";
import { ProfileService } from "@/features/profile/services/profileService";
import { StorageProviderFactory } from "@/features/resume/storage/factory";
import { IResume } from "@/features/resume/types";

interface JobApplyModalProps {
  isOpen: boolean;
  job: IJob | null;
  allJobs?: IJob[];
  onClose: () => void;
  onSuccess: (jobId: string, appliedJob?: IJob | null, createdApp?: any) => void;
}

export const JobApplyModal: React.FC<JobApplyModalProps> = ({
  isOpen,
  job,
  allJobs = [],
  onClose,
  onSuccess,
}) => {
  const router = useRouter();
  const { user } = useAuthStore();

  const [step, setStep] = useState<"form" | "recommendations">("form");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [noLinkedin, setNoLinkedin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [academicPercentage, setAcademicPercentage] = useState<number | undefined>(undefined);

  // Resume state
  const [resumes, setResumes] = useState<IResume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [isLoadingResumes, setIsLoadingResumes] = useState(true);
  const [isChangingResume, setIsChangingResume] = useState(false);

  // Pre-fill user details and fetch user resumes when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep("form");
      setErrorMsg(null);
      setFullName(user?.fullName || user?.username || "");
      setEmail(user?.email || "");
      setLinkedinUrl("");
      setNoLinkedin(false);
      setIsChangingResume(false);

      ProfileService.getProfile()
        .then((p) => setAcademicPercentage(p.academicPercentage))
        .catch(() => setAcademicPercentage(undefined));

      setIsLoadingResumes(true);
      const provider = StorageProviderFactory.getProvider();
      provider
        .list()
        .then((list) => {
          const validList = Array.isArray(list) ? list : [];
          setResumes(validList);
          if (validList.length > 0) {
            const active = validList.find((r) => r.isActive) || validList[0];
            setSelectedResumeId(active.id || (active as any)._id || "");
          } else {
            setSelectedResumeId("");
          }
        })
        .catch((err) => {
          console.warn("Failed to fetch resumes in apply modal:", err);
          setResumes([]);
          setSelectedResumeId("");
        })
        .finally(() => {
          setIsLoadingResumes(false);
        });
    }
  }, [isOpen, user]);

  if (!isOpen || !job) return null;

  const currentResume = resumes.find(
    (r) => (r.id || (r as any)._id) === selectedResumeId
  ) || resumes[0];

  // Format Salary / Rate for header
  const formatRate = () => {
    if (!job.salary || (!job.salary.min && !job.salary.max))
      return "$50-$60 per hour";
    const { min, max, currency, period } = job.salary;
    const periodLabel =
      period === "yearly"
        ? "per year"
        : period === "monthly"
          ? "per month"
          : "per hour";
    const symbol = currency === "INR" ? "₹" : "$";
    if (currency === "INR") {
      const minLPA = (min / 100000).toFixed(0);
      const maxLPA = (max / 100000).toFixed(0);
      return `₹${minLPA}–${maxLPA} LPA`;
    }
    const minK = min >= 1000 ? `${Math.round(min / 1000)}k` : min;
    const maxK = max >= 1000 ? `${Math.round(max / 1000)}k` : max;
    return `${symbol}${minK}-$${maxK} ${periodLabel}`;
  };

  // Filter other recommended roles for Step 2
  const otherRoles = allJobs.filter((j) => j._id !== job._id).slice(0, 3);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (resumes.length === 0) {
      setErrorMsg("You must have a resume to apply. Please create a resume first.");
      return;
    }

    if (!fullName.trim()) {
      setErrorMsg("Full legal name is required.");
      return;
    }
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      setErrorMsg("A valid email address is required.");
      return;
    }
    if (!noLinkedin && !linkedinUrl.trim()) {
      setErrorMsg(
        'Please enter your LinkedIn profile URL or check "I don\'t have a LinkedIn".',
      );
      return;
    }

    const ineligibleReason = isTargetIneligible(job);
    if (ineligibleReason) {
      setErrorMsg(ineligibleReason);
      return;
    }

    // Move to step 2 ("Before you apply")
    setStep("recommendations");
  };

  const isTargetIneligible = (targetJob: IJob | undefined): string | null => {
    if (!targetJob) return null;
    if (targetJob.expiresAt && new Date(targetJob.expiresAt).getTime() < Date.now()) {
      return "Applications for this job have closed.";
    }
    if (
      targetJob.eligibilityMinPercent != null &&
      academicPercentage != null &&
      academicPercentage < targetJob.eligibilityMinPercent
    ) {
      return `You do not meet the minimum eligibility requirement (${targetJob.eligibilityMinPercent}%) for this job.`;
    }
    return null;
  };

  const handleFinalizeApplication = async (targetJobId?: string) => {
    if (resumes.length === 0) {
      setErrorMsg("You must have a resume to apply. Please create a resume first.");
      return;
    }

    const targetId = targetJobId || job._id;
    const targetJob = targetId === job._id ? job : allJobs.find((j) => j._id === targetId);

    setErrorMsg(null);
    const ineligibleReason = isTargetIneligible(targetJob);
    if (ineligibleReason) {
      setErrorMsg(ineligibleReason);
      return;
    }

    setIsSubmitting(true);
    try {
      await applicationService.createApplication({
        jobId: targetId,
        resumeId: selectedResumeId || undefined,
        source: "manual",
        status: "submitted",
      });
      onSuccess(targetId);
      onClose();
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to submit application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-card border border-border rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden relative max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition z-10 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
            {step === "form" ? (
              /* ============================================================
                 STEP 1: INITIAL APPLICATION FORM + RESUME SELECTION
                 ============================================================ */
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-ink tracking-tight pr-8">
                    {job.title}
                  </h2>
                  <p className="text-sm font-semibold text-ink-soft mt-1">
                    {formatRate()}
                  </p>
                </div>

                <div className="border-t border-border/70" />

                {/* Resume Status / Selector Section */}
                {isLoadingResumes ? (
                  <div className="p-4 rounded-2xl bg-surface-alt animate-pulse flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-border" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 bg-border rounded w-1/3" />
                      <div className="h-3 bg-border rounded w-1/2" />
                    </div>
                  </div>
                ) : resumes.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-ink">Resume Required to Apply</p>
                        <p className="text-[11px] text-ink-soft mt-0.5">
                          You haven&apos;t created or uploaded any resume yet. You must have an active resume to submit a job application.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        router.push("/builder");
                      }}
                      className="w-full bg-gradient-brand text-primary-foreground text-xs font-bold py-2.5 px-4 rounded-xl shadow-elegant hover:shadow-glow transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Your Resume Now</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-surface-alt/70 border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-ink-soft">
                        Applying with Resume
                      </span>
                      {resumes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setIsChangingResume(!isChangingResume)}
                          className="text-[11px] font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
                        >
                          <span>{isChangingResume ? "Done" : "Change Resume"}</span>
                          <ChevronDown className={`w-3 h-3 transition-transform ${isChangingResume ? "rotate-180" : ""}`} />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-brand flex items-center justify-center text-primary-foreground font-bold shrink-0 shadow-xs">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-ink truncate">
                            {currentResume?.title || "Untitled Resume"}
                          </p>
                          {currentResume?.isActive && (
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full shrink-0">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-ink-soft truncate">
                          {currentResume?.content?.personalInfo?.headline || "Software Professional"}
                        </p>
                      </div>
                    </div>

                    {/* Resume Selector Dropdown (if multiple resumes) */}
                    {isChangingResume && resumes.length > 1 && (
                      <div className="pt-2 border-t border-border/60 space-y-1.5 animate-in fade-in duration-150">
                        <p className="text-[10px] font-bold text-ink-soft">Select which resume to submit:</p>
                        <div className="space-y-1 max-h-36 overflow-y-auto">
                          {resumes.map((r) => {
                            const rId = r.id || (r as any)._id;
                            const isSelected = rId === selectedResumeId;
                            return (
                              <button
                                key={rId}
                                type="button"
                                onClick={() => {
                                  setSelectedResumeId(rId);
                                  setIsChangingResume(false);
                                }}
                                className={`w-full text-left p-2 rounded-xl text-xs font-semibold flex items-center justify-between transition cursor-pointer ${
                                  isSelected
                                    ? "bg-primary/10 border border-primary/30 text-primary font-bold"
                                    : "bg-surface hover:bg-surface-alt border border-border text-ink"
                                }`}
                              >
                                <span className="truncate">{r.title}</span>
                                {r.isActive && (
                                  <span className="text-[9px] text-emerald-600 bg-emerald-500/10 px-1.5 py-0.2 rounded-full shrink-0 ml-2">
                                    Default Active
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold">
                      {errorMsg}
                    </div>
                  )}

                  {/* Full legal name */}
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1.5">
                      Full legal name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="w-full input-base text-sm py-2.5 px-3.5 focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="w-full input-base text-sm py-2.5 px-3.5 focus:ring-2 focus:ring-primary/40"
                    />
                  </div>

                  {/* LinkedIn URL */}
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1.5">
                      LinkedIn URL *
                    </label>
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://www.linkedin.com/in/..."
                      disabled={noLinkedin}
                      className="w-full input-base text-sm py-2.5 px-3.5 disabled:opacity-50 disabled:bg-surface-alt focus:ring-2 focus:ring-primary/40"
                    />

                    {/* Checkbox: I don't have a LinkedIn */}
                    <label className="flex items-center gap-2 mt-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={noLinkedin}
                        onChange={(e) => {
                          setNoLinkedin(e.target.checked);
                          if (e.target.checked) setLinkedinUrl("");
                        }}
                        className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                      />
                      <span className="text-xs text-ink-soft font-medium">
                        I don&apos;t have a LinkedIn
                      </span>
                    </label>
                  </div>

                  {/* Submit Action */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={resumes.length === 0}
                      className="w-full bg-gradient-brand hover:bg-[#4335dc] text-white font-bold py-3 px-5 rounded-2xl transition-all shadow-md active:scale-[0.99] cursor-pointer text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Start application
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* ============================================================
                 STEP 2: BEFORE YOU APPLY (INTERSTITIAL) + RESUME SELECTOR
                 ============================================================ */
              <div className="space-y-6 text-center">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-ink tracking-tight">
                    Before you apply
                  </h2>
                  <p className="text-xs sm:text-sm text-ink-soft mt-1.5">
                    Here are other open roles you might want to consider.
                  </p>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold text-left">
                    {errorMsg}
                  </div>
                )}

                {/* CURRENT RESUME BAR IN BEFORE YOU APPLY */}
                <div className="p-3.5 rounded-2xl bg-surface-alt border border-border text-left space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-ink-soft">
                      Current Resume Attached
                    </span>
                    {resumes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setIsChangingResume(!isChangingResume)}
                        className="text-[11px] font-bold text-primary hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span>{isChangingResume ? "Done" : "Change Resume"}</span>
                        <ChevronDown className={`w-3 h-3 transition-transform ${isChangingResume ? "rotate-180" : ""}`} />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-brand flex items-center justify-center text-primary-foreground font-bold shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-bold text-ink truncate">
                          {currentResume?.title || "Untitled Resume"}
                        </p>
                        {currentResume?.isActive && (
                          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.2 rounded-full shrink-0">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-ink-soft truncate">
                        {currentResume?.content?.personalInfo?.headline || "Software Professional"}
                      </p>
                    </div>
                  </div>

                  {/* Multi-Resume Selector in Step 2 */}
                  {isChangingResume && resumes.length > 1 && (
                    <div className="pt-2 border-t border-border space-y-1 animate-in fade-in duration-150">
                      <p className="text-[10px] font-bold text-ink-soft">Switch resume for this application:</p>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {resumes.map((r) => {
                          const rId = r.id || (r as any)._id;
                          const isSelected = rId === selectedResumeId;
                          return (
                            <button
                              key={rId}
                              type="button"
                              onClick={() => {
                                setSelectedResumeId(rId);
                                setIsChangingResume(false);
                              }}
                              className={`w-full text-left p-1.5 px-2.5 rounded-lg text-xs flex items-center justify-between transition cursor-pointer ${
                                isSelected
                                  ? "bg-primary/10 border border-primary/30 text-primary font-bold"
                                  : "bg-surface hover:bg-surface-alt/80 border border-border text-ink"
                              }`}
                            >
                              <span className="truncate">{r.title}</span>
                              {r.isActive && (
                                <span className="text-[9px] text-emerald-600 bg-emerald-500/10 px-1.5 py-0.2 rounded-full shrink-0 ml-2">
                                  Default Active
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Other Roles Hiring Now */}
                <div className="text-left space-y-3">
                  <p className="text-xs font-bold text-ink-soft uppercase tracking-wider">
                    Other roles hiring now:
                  </p>

                  <div className="border border-border rounded-2xl divide-y divide-border overflow-hidden bg-surface-alt/30">
                    {otherRoles.length > 0 ? (
                      otherRoles.map((role) => (
                        <div
                          key={role._id}
                          onClick={() => handleFinalizeApplication(role._id)}
                          className="p-4 flex items-center justify-between gap-3 hover:bg-surface-alt cursor-pointer transition group"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl border border-border bg-card grid place-items-center shrink-0 text-ink-soft group-hover:text-primary transition">
                              <Briefcase className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs sm:text-sm font-bold text-ink truncate group-hover:text-primary transition">
                                {role.title}
                              </p>
                              <p className="text-[11px] text-ink-soft capitalize mt-0.5">
                                {role.employmentType}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-ink-soft/60 group-hover:text-primary group-hover:translate-x-1 transition shrink-0" />
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-xs text-ink-soft text-center">
                        No other immediate roles found.
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleFinalizeApplication()}
                    className="w-full py-3 px-4 rounded-2xl border border-border font-bold text-xs sm:text-sm text-ink hover:bg-surface-alt transition cursor-pointer"
                  >
                    Keep browsing
                  </button>

                  <button
                    type="button"
                    onClick={() => handleFinalizeApplication()}
                    disabled={isSubmitting || resumes.length === 0}
                    className="w-full py-3 px-4 rounded-2xl bg-[#5345ec] hover:bg-[#4335dc] font-bold text-xs sm:text-sm text-white shadow-md transition active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <span>Continue to this role</span>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
