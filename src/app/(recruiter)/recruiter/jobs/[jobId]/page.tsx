"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Loader2,
  MapPin,
  Search,
  User,
  FileText,
  Calendar,
  Sparkles,
  ArrowLeft,
  Users,
  Briefcase,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Play,
  ArrowRight,
  ShieldAlert,
  Sliders,
} from "lucide-react";
import { toast } from "sonner";
import { recruiterService } from "@/features/recruiter/services/recruiterService";
import { Applicant, RecruiterJob, CollectionStatusReport } from "@/features/recruiter/types";
import { ApplicantResumeModal } from "@/features/recruiter/components/ApplicantResumeModal";
import { CandidateProfileModal } from "@/features/recruiter/components/CandidateProfileModal";
import { JobsSidebar } from "@/features/recruiter/components/JobsSidebar";

const STATUS_OPTIONS = ["submitted", "reviewing", "shortlisted", "interviewing", "offered", "rejected"];

export default function JobDetailPage() {
  const router = useRouter();
  const params = useParams<{ jobId: string }>();
  const jobId = params.jobId;

  const [job, setJob] = useState<RecruiterJob | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [collectionReport, setCollectionReport] = useState<CollectionStatusReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingCollection, setLoadingCollection] = useState(false);
  const [startingPipeline, setStartingPipeline] = useState(false);
  const [extendingDeadline, setExtendingDeadline] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedApplicantForResume, setSelectedApplicantForResume] = useState<Applicant | null>(null);
  const [selectedApplicantForProfile, setSelectedApplicantForProfile] = useState<Applicant | null>(null);

  const loadCollectionStatus = (id: string) => {
    setLoadingCollection(true);
    recruiterService
      .getApplicationCollection(id)
      .then((rep) => setCollectionReport(rep))
      .catch((err) => console.warn("Could not load collection report:", err))
      .finally(() => setLoadingCollection(false));
  };

  useEffect(() => {
    if (!jobId) return;
    if (jobId === "create") {
      router.replace("/recruiter/jobs/create");
      return;
    }
    Promise.all([recruiterService.getMyJobById(jobId), recruiterService.getApplicantsForJob(jobId)])
      .then(([jobData, applicantsData]) => {
        setJob(jobData);
        setApplicants(applicantsData);
        if (jobData.hiringEngineEnabled || jobData.applicationCollection) {
          loadCollectionStatus(jobId);
        }
      })
      .finally(() => setLoading(false));
  }, [jobId, router]);

  const handleStartPipeline = async () => {
    if (!jobId) return;
    setStartingPipeline(true);
    try {
      const res = await recruiterService.startApplicationCollection(jobId);
      if (res.started) {
        toast.success("Adaptive Hiring Pipeline started successfully! Stage 1 candidates invited.");
      } else {
        toast.info("Pipeline was already started.");
      }
      loadCollectionStatus(jobId);
      const updatedJob = await recruiterService.getMyJobById(jobId);
      setJob(updatedJob);
    } catch (err: any) {
      toast.error(err?.message || "Failed to start pipeline.");
    } finally {
      setStartingPipeline(false);
    }
  };

  const handleExtendDeadline = async () => {
    if (!jobId) return;
    setExtendingDeadline(true);
    try {
      const res = await recruiterService.extendApplicationCollection(jobId);
      if (res.extended) {
        toast.success(`Application window extended to ${new Date(res.newDeadline).toLocaleDateString()}.`);
      } else {
        toast.warning("Could not extend application window.");
      }
      loadCollectionStatus(jobId);
      const updatedJob = await recruiterService.getMyJobById(jobId);
      setJob(updatedJob);
    } catch (err: any) {
      toast.error(err?.message || "Failed to extend window.");
    } finally {
      setExtendingDeadline(false);
    }
  };

  const handleStatusChange = async (applicationId: string, status: string) => {
    setUpdatingId(applicationId);
    try {
      const updated = await recruiterService.updateApplicantStatus(applicationId, status);
      setApplicants((prev) => prev.map((a) => (a._id === applicationId ? { ...a, ...updated } : a)));
      if (selectedApplicantForResume?._id === applicationId) {
        setSelectedApplicantForResume((prev) => (prev ? { ...prev, ...updated, status } : null));
      }
      if (selectedApplicantForProfile?._id === applicationId) {
        setSelectedApplicantForProfile((prev) => (prev ? { ...prev, ...updated, status } : null));
      }

      // Friendly UI workflow toasts
      if (status === "interviewing") {
        toast.success("Moved to Interviewing! Click 'Schedule' to book an interview slot on your calendar.");
      } else if (status === "shortlisted") {
        toast.success("Candidate shortlisted! Ready for AI screening or live interview.");
      } else if (status === "offered") {
        toast.success("Candidate moved to Offered! Review in Finalist board.");
      } else {
        toast.success(`Application status updated to ${status}.`);
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to update applicant status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-ink-soft">
        <Loader2 className="w-6 h-6 animate-spin text-primary-glow" />
      </div>
    );
  }

  if (!job) {
    return <div className="p-10 text-center text-ink-soft text-sm">Job not found.</div>;
  }

  return (
    <div className="w-full min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-background">
      <JobsSidebar
        selectedJobId={jobId}
        onSelectJob={(id) => router.push(`/recruiter/jobs/${id}`)}
      />
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
      {/* Breadcrumbs & Quick Pipeline Links */}
      <div className="mb-5 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs font-semibold text-ink-soft">
          <Link
            href="/recruiter/jobs"
            className="hover:text-primary-glow flex items-center gap-1 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Jobs Board
          </Link>
          <span>/</span>
          <span className="text-ink font-bold truncate max-w-[200px] sm:max-w-xs">{job.title}</span>
        </div>

        {/* Action Bridges into the rest of the Recruiter Suite */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href={`/recruiter/jobs?tab=timeline&jobId=${jobId}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-glow bg-primary/10 border border-primary/20 hover:bg-primary/20 px-3 py-1.5 rounded-xl transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Hiring Pipeline</span>
          </Link>
          <Link
            href="/recruiter/track"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft hover:text-ink bg-surface border border-border px-3 py-1.5 rounded-xl transition"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Track Pipeline</span>
          </Link>
          <Link
            href="/recruiter/interview-schedule"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1.5 rounded-xl transition"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Interview Schedule</span>
          </Link>
        </div>
      </div>

      {/* Hero Job Banner */}
      <div className="bg-surface border border-border rounded-2xl shadow-elegant p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary-glow border border-primary/20 capitalize">
                {job.recruiterStage || "Active Listing"}
              </span>
              {((job as any).department || job.employmentType) && (
                <span className="text-[11px] font-medium text-ink-soft bg-surface-alt px-2 py-0.5 rounded-full border border-border">
                  {(job as any).department || job.employmentType}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-extrabold text-ink tracking-tight">{job.title}</h1>
            <div className="flex items-center gap-3 text-sm text-ink-soft mt-1.5 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {job.location?.country || "Remote"}
              </span>
              {job.salaryText && <span>· {job.salaryText}</span>}
              <span className="flex items-center gap-1 font-semibold text-ink">
                <Users className="w-3.5 h-3.5" />
                {applicants.length} Total Applied
              </span>
            </div>
          </div>
          <Link
            href={`/recruiter/cv-search?jobId=${job._id}`}
            className="inline-flex items-center gap-2 text-xs font-semibold bg-surface-alt border border-border text-ink px-4 py-2.5 rounded-xl hover:bg-surface hover:border-primary/30 transition shadow-xs"
          >
            <Search className="w-4 h-4 text-primary-glow" />
            Source Matching CVs
          </Link>
        </div>
        {job.structuredRequirements?.requiredSkills && job.structuredRequirements.requiredSkills.length > 0 ? (
          <div className="mt-4 space-y-2.5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft block mb-1.5">
                Required Skills
              </span>
              <div className="flex flex-wrap gap-1.5">
                {job.structuredRequirements.requiredSkills.map((sk: any, i: number) => {
                  const name = typeof sk === "string" ? sk : sk.name;
                  const prof = typeof sk === "string" ? null : sk.proficiency;
                  return (
                    <span
                      key={name || i}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg"
                    >
                      <span>{name}</span>
                      {prof && (
                        <span className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface/80 text-ink-soft border border-border">
                          {prof}
                        </span>
                      )}
                    </span>
                  );
                })}
              </div>
            </div>
            {job.structuredRequirements.preferredSkills && job.structuredRequirements.preferredSkills.length > 0 && (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft block mb-1.5">
                  Preferred Skills
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {job.structuredRequirements.preferredSkills.map((sk: any, i: number) => {
                    const name = typeof sk === "string" ? sk : sk.name;
                    return (
                      <span
                        key={name || i}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-ink bg-surface-alt border border-border px-2.5 py-1 rounded-lg"
                      >
                        <span>{name}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : job.skills && job.skills.length > 0 ? (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {job.skills.map((s) => (
              <span
                key={s}
                className="text-[10px] font-semibold text-primary-glow bg-primary/10 px-2 py-1 rounded-full"
              >
                {s}
              </span>
            ))}
          </div>
        ) : null}

        {job.assessment?.enabled && job.assessment.rounds && job.assessment.rounds.length > 0 && (
          <div className="mt-4 pt-3.5 border-t border-border/70">
            <span className="text-[11px] font-bold uppercase tracking-wider text-ink-soft block mb-1.5">
              Assessment Pipeline ({job.assessment.rounds.length} {job.assessment.rounds.length === 1 ? 'Round' : 'Rounds'})
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {job.assessment.rounds.map((round, idx) => (
                <React.Fragment key={round.id || round.type}>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-primary/10 border border-primary/20 text-primary-glow px-2.5 py-1 rounded-lg">
                    <span className="text-[10px] font-bold opacity-75">{idx + 1}.</span>
                    <span>
                      {round.name}
                      {round.type === "general" && Array.isArray((round.config as any)?.questionTypes) && (
                        <span className="text-[10px] font-normal opacity-80 ml-1">
                          ({((round.config as any).questionTypes as string[]).map((t) => t.replace("_", " ")).join(", ")})
                        </span>
                      )}
                    </span>
                  </span>
                  {idx < (job.assessment?.rounds?.length ?? 0) - 1 && (
                    <span className="text-xs text-ink-soft/60 font-medium">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>

      {(collectionReport || job.applicationCollection || job.hiringEngineEnabled) && (
        <div className="bg-surface border border-border rounded-2xl shadow-elegant p-6 mb-6 space-y-5">
          {/* Header row: Title + State Badge */}
          <div className="flex items-start justify-between gap-4 flex-wrap pb-4 border-b border-border/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary-glow shrink-0 border border-primary/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-ink tracking-tight">Application Collection & Hiring Funnel</h2>
                <p className="text-xs text-ink-soft">
                  {collectionReport?.status === "started"
                    ? "Autonomous hiring pipeline is active. Primary and Reserve candidate pools are engaged."
                    : "Collecting and evaluating candidate applications against your configured eligibility targets."}
                </p>
              </div>
            </div>

            {/* Visual State Badge for the 10 recruiter states */}
            {(() => {
              const status = collectionReport?.status || (job.applicationCollection?.status ?? "collecting");
              const health = collectionReport?.funnelHealth || "healthy";

              let badgeText = "COLLECTING CANDIDATES";
              let badgeStyle = "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";

              if (status === "started") {
                if (health === "constrained") {
                  badgeText = "CONSTRAINED POOL";
                  badgeStyle = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
                } else {
                  badgeText = "HIRING PIPELINE ACTIVE";
                  badgeStyle = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
                }
              } else if (status === "ready") {
                badgeText = "READY TO START";
                badgeStyle = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
              } else if (status === "extended") {
                badgeText = "APPLICATION WINDOW EXTENDED";
                badgeStyle = "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
              } else if (status === "insufficient") {
                badgeText = "INSUFFICIENT CANDIDATES";
                badgeStyle = "bg-destructive/10 text-destructive border-destructive/20";
              } else if (status === "closed") {
                badgeText = "JOB CLOSED";
                badgeStyle = "bg-surface-alt text-ink-soft border-border";
              } else if (status === "collecting" && collectionReport && collectionReport.actualQualifiedCount < collectionReport.minimumIntake) {
                badgeText = "WAITING FOR CANDIDATES";
                badgeStyle = "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
              }

              return (
                <span className={`text-[11px] uppercase font-extrabold px-3 py-1 rounded-full border ${badgeStyle}`}>
                  {badgeText}
                </span>
              );
            })()}
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Final Target */}
            <div className="p-3.5 rounded-xl bg-surface-alt/60 border border-border space-y-1">
              <span className="text-[10px] uppercase font-bold text-ink-soft block">Final Shortlist Target</span>
              <div className="text-xl font-extrabold text-ink">
                {collectionReport?.finalShortlistTarget || job.finalShortlistTarget || 10}
              </div>
              <p className="text-[10px] text-ink-soft">Target shortlisted finalists</p>
            </div>

            {/* Ideal Intake */}
            <div className="p-3.5 rounded-xl bg-surface-alt/60 border border-border space-y-1">
              <span className="text-[10px] uppercase font-bold text-ink-soft block">Ideal Intake</span>
              <div className="text-xl font-extrabold text-ink">
                {collectionReport?.idealIntake || job.applicationCollection?.idealIntake || 15}
              </div>
              <p className="text-[10px] text-ink-soft">Recommended statistical pool</p>
            </div>

            {/* Minimum Intake */}
            <div className="p-3.5 rounded-xl bg-surface-alt/60 border border-border space-y-1">
              <span className="text-[10px] uppercase font-bold text-ink-soft block">Minimum Intake</span>
              <div className="text-xl font-extrabold text-ink">
                {collectionReport?.minimumIntake || job.applicationCollection?.minimumIntake || 8}
              </div>
              <p className="text-[10px] text-ink-soft">Required to start pipeline</p>
            </div>

            {/* Actual Qualified */}
            <div className="p-3.5 rounded-xl bg-primary/5 border border-primary/20 space-y-1">
              <span className="text-[10px] uppercase font-bold text-primary-glow block">Qualified Candidates</span>
              <div className="text-xl font-extrabold text-ink flex items-center gap-1.5">
                <span>{collectionReport?.actualQualifiedCount ?? applicants.length}</span>
                {collectionReport && collectionReport.actualQualifiedCount >= collectionReport.minimumIntake && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                )}
              </div>
              <p className="text-[10px] text-ink-soft">Eligible & screened applicants</p>
            </div>
          </div>

          {/* Progress Bars */}
          {collectionReport && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Progress to Minimum */}
              <div className="p-3 rounded-xl bg-surface-alt/40 border border-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-ink flex items-center gap-1.5">
                    Progress to Minimum Intake
                    {collectionReport.actualQualifiedCount >= collectionReport.minimumIntake && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        Met ✓
                      </span>
                    )}
                  </span>
                  <span className="font-bold text-ink">
                    {collectionReport.actualQualifiedCount} / {collectionReport.minimumIntake}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all rounded-full"
                    style={{
                      width: `${Math.min(100, Math.round((collectionReport.actualQualifiedCount / Math.max(1, collectionReport.minimumIntake)) * 100))}%`,
                    }}
                  />
                </div>
              </div>

              {/* Progress to Ideal */}
              <div className="p-3 rounded-xl bg-surface-alt/40 border border-border space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-ink">Progress to Ideal Intake</span>
                  <span className="font-bold text-ink">
                    {collectionReport.actualQualifiedCount} / {collectionReport.idealIntake}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all rounded-full"
                    style={{
                      width: `${Math.min(100, Math.round((collectionReport.actualQualifiedCount / Math.max(1, collectionReport.idealIntake)) * 100))}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Collection Metadata & Deadline Strip */}
          <div className="flex items-center justify-between gap-4 flex-wrap text-xs text-ink-soft pt-1">
            <div className="flex items-center gap-4 flex-wrap">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5 text-ink-soft" />
                <span>Application Deadline:</span>
                <strong className="text-ink">
                  {collectionReport?.currentDeadline
                    ? new Date(collectionReport.currentDeadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : job.expiresAt
                    ? new Date(job.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "No deadline set"}
                </strong>
              </span>

              <span className="flex items-center gap-1.5 font-medium">
                <span>Auto-Extension:</span>
                <strong className="text-ink">
                  {collectionReport?.autoExtensionEnabled ?? job.applicationCollection?.autoExtensionEnabled ? "Enabled" : "Disabled"}
                </strong>
                <span>
                  ({collectionReport?.extensionsUsed ?? job.applicationCollection?.extensionsUsed ?? 0} /{" "}
                  {collectionReport?.maxExtensions ?? job.applicationCollection?.maxExtensions ?? 2} used)
                </span>
              </span>
            </div>

            {/* Manual Extension Trigger */}
            {collectionReport?.status !== "started" && collectionReport?.status !== "closed" && job.status !== "closed" && (
              <button
                type="button"
                onClick={handleExtendDeadline}
                disabled={extendingDeadline}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-alt hover:bg-surface border border-border text-xs font-semibold text-ink transition disabled:opacity-50 cursor-pointer"
              >
                {extendingDeadline ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Clock className="w-3.5 h-3.5" />}
                <span>Extend Window (+3d)</span>
              </button>
            )}
          </div>

          {/* Constrained / Starved Warnings */}
          {collectionReport?.funnelHealth === "constrained" && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                <strong>Capacity Warning:</strong> Current qualified candidate pool ({collectionReport.actualQualifiedCount}) is below the ideal intake ({collectionReport.idealIntake}) and cannot guarantee the configured final shortlist target ({collectionReport.finalShortlistTarget}). The system will recalculate an adaptive funnel using available candidates.
              </div>
            </div>
          )}

          {collectionReport?.funnelHealth === "starved" && collectionReport.status === "insufficient" && (
            <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/25 flex items-start gap-3">
              <ShieldAlert className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <div className="text-xs text-destructive leading-relaxed">
                <strong>Insufficient Qualified Candidates:</strong> The application deadline has passed with fewer candidates ({collectionReport.actualQualifiedCount}) than the minimum intake ({collectionReport.minimumIntake}). The pipeline cannot guarantee stage progression. Recommended actions: extend the application window manually, broaden matching criteria, or source additional candidates.
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between gap-4 flex-wrap pt-2 border-t border-border/80">
            {collectionReport?.status === "started" ? (
              <div className="flex items-center justify-between w-full gap-3 flex-wrap">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Pipeline is running autonomously
                </span>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/recruiter/jobs?tab=kanban&jobId=${jobId}`}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-surface border border-border text-ink hover:bg-surface-alt transition shadow-xs flex items-center gap-1.5"
                  >
                    <span>Kanban Board</span>
                  </Link>
                  <Link
                    href={`/recruiter/jobs?tab=timeline&jobId=${jobId}`}
                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-brand text-primary-foreground hover:shadow-glow transition shadow-xs flex items-center gap-1.5"
                  >
                    <span>Funnel Timeline</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full gap-4 flex-wrap">
                <p className="text-xs text-ink-soft">
                  {collectionReport && collectionReport.actualQualifiedCount >= collectionReport.minimumIntake
                    ? `Minimum intake reached (${collectionReport.actualQualifiedCount}/${collectionReport.minimumIntake}). The adaptive funnel can be launched now.`
                    : `Need ${Math.max(0, (collectionReport?.minimumIntake || 8) - (collectionReport?.actualQualifiedCount || 0))} more qualified candidates before the funnel can safely start.`}
                </p>

                <button
                  type="button"
                  onClick={handleStartPipeline}
                  disabled={
                    startingPipeline ||
                    (collectionReport != null && collectionReport.actualQualifiedCount < collectionReport.minimumIntake)
                  }
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-brand text-primary-foreground hover:shadow-glow transition shadow-xs flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {startingPipeline ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Recalculating & Launching…</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Adaptive Hiring Pipeline</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Assessment Rounds & Pipeline Stages Section */}
      {job.assessment?.rounds && job.assessment.rounds.length > 0 && (
        <div className="bg-surface border border-border rounded-2xl shadow-elegant p-6 mb-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border/80 pb-3 flex-wrap gap-2">
            <div>
              <h2 className="text-sm font-bold text-ink uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary-glow" />
                <span>Candidate Assessment Rounds ({job.assessment.rounds.length})</span>
              </h2>
              <p className="text-xs text-ink-soft mt-0.5">
                Review and configure questions, passing marks, and schedules for each assessment stage before or during candidate progression.
              </p>
            </div>
            <Link
              href={`/recruiter/jobs?tab=timeline&jobId=${jobId}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-glow bg-primary/10 border border-primary/20 hover:bg-primary/20 px-3 py-1.5 rounded-xl transition"
            >
              <span>View in Hiring Timeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {job.assessment.rounds.map((round: any, idx: number) => {
              const roundStageId = round.id || round.roundId || `round_${round.type}`;
              const roundType = (round.type || round.roundType || "").toLowerCase();
              const roundId = (roundStageId || "").toLowerCase();
              const roundName = (round.name || "").toLowerCase();

              const isAiChat =
                roundType === "ai_chat" ||
                roundId.includes("ai_chat") ||
                roundName.includes("ai chat") ||
                (roundName.includes("chat") && (roundType.includes("ai") || roundName.includes("ai")));

              const isAiVoice =
                roundType === "ai_voice" ||
                roundId.includes("ai_voice") ||
                roundName.includes("ai voice") ||
                (roundName.includes("voice") && (roundType.includes("ai") || roundName.includes("ai")));

              const isAiAssessment =
                isAiChat ||
                isAiVoice ||
                roundType === "ai_assessment" ||
                roundType === "ai_interview" ||
                roundId.includes("ai_assessment") ||
                roundName.includes("ai assessment") ||
                roundName.includes("ai interview");

              const isOnlineTest =
                !isAiAssessment &&
                (roundType === "general_aptitude" ||
                  roundType === "technical_test" ||
                  roundType === "rapid_round" ||
                  roundId.includes("general_aptitude") ||
                  roundId.includes("technical_test") ||
                  roundId.includes("rapid_round") ||
                  roundName.includes("aptitude") ||
                  roundName.includes("technical test") ||
                  roundName.includes("rapid round") ||
                  roundName.includes("online test"));

              const isInterview =
                !isAiAssessment &&
                (roundType.includes("interview") ||
                  roundId.includes("interview") ||
                  roundName.includes("interview"));

              const isConfigured = Boolean(
                round.config?.isConfigured ||
                  (Array.isArray(round.config?.customQuestions) && round.config.customQuestions.length > 0)
              );
              const isAiConfigured = Boolean(
                round.config?.isConfigured ||
                  (Array.isArray(round.config?.modalities) && round.config.modalities.length > 0)
              );
              const qCount = round.config?.customQuestions?.length || round.config?.totalQuestions || 0;

              return (
                <div
                  key={roundStageId || idx}
                  className="p-4 rounded-xl border border-border bg-surface-alt/40 hover:bg-surface-alt/70 transition flex items-center justify-between gap-4 flex-wrap"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-ink">{round.name || round.type}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary-glow border border-primary/20 capitalize">
                          {round.type?.replace(/_/g, " ")}
                        </span>
                        {isAiAssessment ? (
                          isAiConfigured ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-600 border border-violet-500/20 flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-violet-600" />
                              <span>Configured ({isAiChat ? "Chat" : isAiVoice ? "Voice" : ((round.config?.modalities as string[]) || ["chat", "voice"]).join(" + ")})</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 border border-amber-500/30 flex items-center gap-1 animate-pulse">
                              <AlertTriangle className="w-3 h-3 text-amber-500" />
                              <span>{isAiChat ? "Chat Settings Pending" : isAiVoice ? "Voice Settings Pending" : "AI Settings Pending"}</span>
                            </span>
                          )
                        ) : isOnlineTest ? (
                          isConfigured ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Configured ({qCount} Qs)</span>
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 border border-amber-500/30 flex items-center gap-1 animate-pulse">
                              <AlertTriangle className="w-3 h-3 text-amber-500" />
                              <span>Questions Not Configured Yet</span>
                            </span>
                          )
                        ) : isInterview ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-blue-600" />
                            <span>Live Interview Session</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-alt text-ink-soft border border-border flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>Automated Evaluation</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-ink-soft mt-1">
                        Duration: <strong>{round.config?.durationMinutes || 30} mins</strong> · Passing Threshold:{" "}
                        <strong>{round.config?.passingScore || 70}%</strong>
                        {round.config?.schedule?.date && (
                          <span> · Scheduled: {round.config.schedule.date}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {isAiAssessment ? (
                    <Link
                      href={`/recruiter/jobs/${jobId}/stages/${roundStageId}/configure`}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                        isAiConfigured
                          ? "bg-surface border border-violet-500/30 hover:bg-violet-500/10 text-violet-700"
                          : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-95 text-white shadow-md animate-pulse"
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>
                        {isAiConfigured
                          ? isAiChat
                            ? "Edit AI Chat"
                            : isAiVoice
                            ? "Edit AI Voice"
                            : "Edit AI Assessment"
                          : isAiChat
                          ? "Configure AI Chat"
                          : isAiVoice
                          ? "Configure AI Voice"
                          : "Configure AI Assessment"}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : isOnlineTest ? (
                    <Link
                      href={`/recruiter/jobs/${jobId}/stages/${roundStageId}/configure`}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                        isConfigured
                          ? "bg-surface border border-border hover:bg-surface-alt text-ink"
                          : "bg-amber-500 hover:bg-amber-600 text-black shadow-md animate-pulse"
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>{isConfigured ? "Edit Questions & Rules" : "Configure Round"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : isInterview ? (
                    <Link
                      href="/recruiter/interview-schedule"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 border border-blue-500/25 transition shadow-xs cursor-pointer"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Interview Schedule</span>
                    </Link>
                  ) : (
                    <Link
                      href="/recruiter/domain-assessments"
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-surface border border-border hover:bg-surface-alt text-ink transition shadow-xs cursor-pointer"
                    >
                      <span>Domain Studio</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Applicants List Section */}
      <div className="bg-surface border border-border rounded-2xl shadow-elegant p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-ink">
            Applicants & Candidates ({applicants.length})
          </h2>
          <span className="text-xs text-ink-soft">
            Review, screen via AI, or schedule live interviews directly
          </span>
        </div>

        {applicants.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-2xl p-6">
            <Briefcase className="w-8 h-8 text-ink-soft mx-auto mb-2 opacity-50" />
            <p className="text-sm font-semibold text-ink mb-1">No applicants yet for this listing</p>
            <p className="text-xs text-ink-soft max-w-sm mx-auto mb-4">
              Share the job with candidates or use CV Search to proactively source matching profiles.
            </p>
            <Link
              href={`/recruiter/cv-search?jobId=${job._id}`}
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-primary text-primary-foreground px-4 py-2 rounded-xl shadow-glow hover:scale-105 transition"
            >
              <Search className="w-3.5 h-3.5" />
              Source Candidates Now
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applicants.map((a) => {
              const candidateName = a.candidate?.fullName || a.candidate?.username || "Candidate";
              const candidateEmail = a.candidate?.email || "";

              return (
                <div
                  key={a._id}
                  className="flex items-center justify-between gap-3 p-4 rounded-xl border border-border bg-surface hover:bg-surface-alt/50 transition flex-wrap group shadow-xs"
                >
                  {/* Clickable Candidate Identity */}
                  <div
                    onClick={() => setSelectedApplicantForProfile(a)}
                    className="flex items-center gap-3 min-w-0 cursor-pointer"
                  >
                    {a.candidate?.avatarUrl ? (
                      <img
                        src={a.candidate.avatarUrl}
                        alt={candidateName}
                        className="w-10 h-10 rounded-full object-cover ring-1 ring-border group-hover:ring-primary transition shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-brand text-primary-foreground font-bold text-xs flex items-center justify-center shadow-glow group-hover:scale-105 transition shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-ink truncate group-hover:text-primary transition flex items-center gap-2">
                        <span>{candidateName}</span>
                        <span className="text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                          {a.matchScore || 0}% match
                        </span>
                      </div>
                      <div className="text-xs text-ink-soft truncate flex items-center gap-1.5 mt-0.5">
                        <span className="font-medium text-ink">{a.resume?.title || "Applied Resume"}</span>
                        {candidateEmail && <span>· {candidateEmail}</span>}
                      </div>
                    </div>
                  </div>

                  {/* 1-Click Action Bridges to the rest of the Recruiter Suite */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {/* View Resume Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedApplicantForResume(a)}
                      className="inline-flex items-center gap-1 text-xs font-semibold bg-surface-alt hover:bg-surface text-ink px-2.5 py-1.5 rounded-xl border border-border transition cursor-pointer"
                      title="Inspect PDF resume"
                    >
                      <FileText className="w-3.5 h-3.5 text-primary-glow" />
                      <span className="hidden sm:inline">Resume</span>
                    </button>

                    {/* AI Assessment / Screening Bridge */}
                    <Link
                      href={`/recruiter/ai-interview?candidate=${encodeURIComponent(
                        candidateName
                      )}&role=${encodeURIComponent(job.title)}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-500/10 hover:bg-amber-600 text-amber-600 dark:text-amber-400 hover:text-white border border-amber-500/20 px-2.5 py-1.5 rounded-xl transition cursor-pointer"
                      title="Run automated Gemini AI technical screening test"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Screen</span>
                    </Link>

                    {/* Schedule Live Interview Bridge */}
                    <Link
                      href={`/recruiter/interview-schedule?candidateName=${encodeURIComponent(
                        candidateName
                      )}&candidateEmail=${encodeURIComponent(
                        candidateEmail
                      )}&position=${encodeURIComponent(
                        job.title
                      )}&department=${encodeURIComponent(
                        (job as any).department || "Engineering"
                      )}&autoOpen=true`}
                      className="inline-flex items-center gap-1 text-xs font-semibold bg-purple-500/10 hover:bg-purple-600 text-purple-600 dark:text-purple-400 hover:text-white border border-purple-500/20 px-2.5 py-1.5 rounded-xl transition cursor-pointer"
                      title="Book slot on Google Meet / Zoom / Teams with automatic calendar sync"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Schedule</span>
                    </Link>

                    {/* Pipeline Status Selector */}
                    <select
                      value={a.status}
                      disabled={updatingId === a._id}
                      onChange={(e) => handleStatusChange(a._id, e.target.value)}
                      className="text-xs font-semibold bg-surface-alt border border-border rounded-xl px-2.5 py-1.5 capitalize disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Candidate Profile Modal */}
      <CandidateProfileModal
        isOpen={!!selectedApplicantForProfile}
        applicant={selectedApplicantForProfile}
        candidate={selectedApplicantForProfile?.candidate || null}
        onClose={() => setSelectedApplicantForProfile(null)}
        onViewResume={() => {
          setSelectedApplicantForResume(selectedApplicantForProfile);
          setSelectedApplicantForProfile(null);
        }}
        onStatusChange={handleStatusChange}
        isUpdatingStatus={updatingId === selectedApplicantForProfile?._id}
      />

      {/* Actual Applicant PDF Resume Modal */}
      <ApplicantResumeModal
        isOpen={!!selectedApplicantForResume}
        applicant={selectedApplicantForResume}
        onClose={() => setSelectedApplicantForResume(null)}
        onStatusChange={handleStatusChange}
        isUpdatingStatus={updatingId === selectedApplicantForResume?._id}
      />
        </div>
      </div>
    </div>
  );
}
