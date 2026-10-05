"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Code2,
  FileQuestion,
  Users,
  Eye,
  Edit3,
  BarChart3,
  MoreVertical,
  Share2,
  Archive,
  Trash2,
  ExternalLink,
  Layers,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Laptop,
} from "lucide-react";
import { toast } from "sonner";
import { domainAssessmentService } from "@/features/domainAssessment/services/domainAssessmentService";
import { DomainAssessment } from "@/features/domainAssessment/types";
import { DOMAIN_OPTIONS, TESTING_MODE_CARDS } from "@/features/domainAssessment/constants";

export default function DomainAssessmentsListPage() {
  const router = useRouter();
  const [assessments, setAssessments] = useState<DomainAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [domainFilter, setDomainFilter] = useState<string>("all");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const res = await domainAssessmentService.getAssessments({
        status: statusFilter,
        domain: domainFilter,
        search: searchQuery,
      });
      setAssessments(res.assessments || []);
    } catch (err: any) {
      console.warn("Failed to load assessments from API:", err);
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, [statusFilter, domainFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAssessments();
  };

  const handlePublish = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await domainAssessmentService.publishAssessment(id);
      toast.success("Assessment published successfully! Candidates can now take this test.");
      fetchAssessments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to publish assessment");
    }
  };

  const handleArchive = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await domainAssessmentService.archiveAssessment(id);
      toast.info("Assessment archived.");
      fetchAssessments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to archive assessment");
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this assessment?")) return;
    try {
      await domainAssessmentService.deleteAssessment(id);
      toast.success("Assessment deleted.");
      fetchAssessments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete assessment");
    }
  };

  const copyCandidateLink = (assessment: DomainAssessment, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = `${window.location.origin}/assessment/${assessment.assessmentId || assessment.id}`;
    navigator.clipboard.writeText(link);
    toast.success("Candidate test link copied to clipboard!", {
      description: link,
    });
  };

  // Metrics
  const stats = useMemo(() => {
    const total = assessments.length;
    const published = assessments.filter((a) => a.status === "published").length;
    const totalAttempts = assessments.reduce((acc, a) => acc + (a.attemptsCount || 0), 0);
    const scores = assessments.filter((a) => (a.averageScore || 0) > 0);
    const avgScore = scores.length > 0 ? Math.round(scores.reduce((acc, a) => acc + (a.averageScore || 0), 0) / scores.length) : 0;
    return { total, published, totalAttempts, avgScore };
  }, [assessments]);

  return (
    <div className="min-h-screen bg-surface-alt/20 p-6 md:p-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center text-primary-foreground shadow-glow">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-ink">
                Domain Specific Assessments
              </h1>
              <p className="text-xs md:text-sm text-ink-soft">
                Standalone engineering & domain assessment studio. Design, test, and benchmark candidate skills.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/recruiter/domain-assessments/create"
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-brand text-primary-foreground text-xs md:text-sm font-bold rounded-xl shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Assessment</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-surface rounded-2xl p-4 border border-border/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-ink">{stats.total}</div>
            <div className="text-xs text-ink-soft">Total Assessments</div>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-4 border border-border/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-ink">{stats.published}</div>
            <div className="text-xs text-ink-soft">Published & Active</div>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-4 border border-border/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-ink">{stats.totalAttempts}</div>
            <div className="text-xs text-ink-soft">Candidate Attempts</div>
          </div>
        </div>

        <div className="bg-surface rounded-2xl p-4 border border-border/80 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-ink">{stats.avgScore}%</div>
            <div className="text-xs text-ink-soft">Average Pass Score</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface p-4 rounded-2xl border border-border/80 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assessments by role, domain, skills..."
            className="w-full pl-9 pr-4 py-2 bg-surface-alt/50 border border-border rounded-xl text-xs md:text-sm text-ink focus:outline-none focus:border-primary transition"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Tabs */}
          <div className="flex items-center p-1 bg-surface-alt rounded-xl border border-border text-xs">
            {["all", "published", "draft", "archived"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition ${
                  statusFilter === st
                    ? "bg-surface text-ink shadow-sm font-bold"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Domain Dropdown */}
          <select
            value={domainFilter}
            onChange={(e) => setDomainFilter(e.target.value)}
            aria-label="Filter by Domain"
            className="px-3 py-2 bg-surface border border-border rounded-xl text-xs text-ink focus:outline-none focus:border-primary transition"
          >
            <option value="all">All Domains</option>
            {DOMAIN_OPTIONS.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Assessments Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-ink-soft">Loading domain assessments...</p>
        </div>
      ) : assessments.length === 0 ? (
        <div className="bg-surface rounded-3xl p-12 text-center border border-border/80 shadow-sm max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary-glow flex items-center justify-center mx-auto text-2xl">
            🧪
          </div>
          <h3 className="text-lg font-bold text-ink">No assessments found</h3>
          <p className="text-xs text-ink-soft">
            {searchQuery || statusFilter !== "all" || domainFilter !== "all"
              ? "No assessments match your active filters. Try clearing your search query."
              : "You haven't created any domain assessments yet. Build your first role-specific test to evaluate candidates."}
          </p>
          <Link
            href="/recruiter/domain-assessments/create"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-brand text-primary-foreground text-xs font-bold rounded-xl shadow-glow hover:scale-105 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create Assessment</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((item) => {
            const isPublished = item.status === "published";
            const isDraft = item.status === "draft" || item.status === "ready";
            const isArchived = item.status === "archived";

            return (
              <div
                key={item.id}
                className="bg-surface rounded-2xl border border-border/80 hover:border-primary/50 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden group"
              >
                {/* Card Top */}
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        isPublished
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : isDraft
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                          : "bg-slate-500/10 text-slate-500 border border-slate-500/20"
                      }`}
                    >
                      {item.status}
                    </span>

                    <span className="text-[11px] font-semibold text-ink-soft capitalize flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-primary/60 inline-block" />
                      {item.domain}
                    </span>
                  </div>

                  <div>
                    <Link
                      href={`/recruiter/domain-assessments/${item.id}`}
                      className="text-base font-bold text-ink group-hover:text-primary-glow transition line-clamp-1"
                    >
                      {item.title}
                    </Link>
                    <p className="text-xs text-ink-soft mt-1 line-clamp-1">
                      {item.role || "Technical Role"} • Level:{" "}
                      <span className="capitalize font-semibold text-ink">{item.difficulty}</span>
                    </p>
                  </div>

                  {/* Skills tags preview */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {(item.skillAreas || []).slice(0, 3).map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="text-[10.5px] px-2 py-0.5 rounded-lg bg-surface-alt text-ink font-medium border border-border/60"
                      >
                        {skill}
                      </span>
                    ))}
                    {(item.skillAreas || []).length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-lg bg-surface-alt/70 text-ink-soft">
                        +{item.skillAreas.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Badges / Metrics */}
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60 text-center">
                    <div className="bg-surface-alt/50 p-2 rounded-xl">
                      <div className="text-xs font-bold text-ink">{item.questionsCount || 0}</div>
                      <div className="text-[10px] text-ink-soft">Questions</div>
                    </div>
                    <div className="bg-surface-alt/50 p-2 rounded-xl">
                      <div className="text-xs font-bold text-ink">{item.timeLimitMinutes || 60}m</div>
                      <div className="text-[10px] text-ink-soft">Duration</div>
                    </div>
                    <div className="bg-surface-alt/50 p-2 rounded-xl">
                      <div className="text-xs font-bold text-ink">{item.attemptsCount || 0}</div>
                      <div className="text-[10px] text-ink-soft">Attempts</div>
                    </div>
                  </div>
                </div>

                {/* Card Actions Bottom */}
                <div className="p-3 bg-surface-alt/30 border-t border-border flex items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/recruiter/domain-assessments/${item.id}`}
                      className="px-2.5 py-1.5 rounded-lg hover:bg-surface text-ink font-medium transition flex items-center gap-1"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </Link>

                    <Link
                      href={`/recruiter/domain-assessments/${item.id}/questions`}
                      className="px-2.5 py-1.5 rounded-lg hover:bg-surface text-ink font-medium transition flex items-center gap-1"
                      title="Manage Questions"
                    >
                      <FileQuestion className="w-3.5 h-3.5" />
                      <span>Questions</span>
                    </Link>

                    <Link
                      href={`/recruiter/domain-assessments/${item.id}/results`}
                      className="px-2.5 py-1.5 rounded-lg hover:bg-surface text-ink font-medium transition flex items-center gap-1"
                      title="Candidate Results"
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-blue-500" />
                      <span>Results</span>
                    </Link>
                  </div>

                  <div className="flex items-center gap-1">
                    {isPublished && (
                      <button
                        type="button"
                        onClick={(e) => copyCandidateLink(item, e)}
                        className="p-1.5 rounded-lg hover:bg-surface text-ink-soft hover:text-primary-glow transition"
                        title="Copy Candidate Test Link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <Link
                      href={`/recruiter/domain-assessments/${item.id}/preview`}
                      className="p-1.5 rounded-lg hover:bg-surface text-ink-soft hover:text-ink transition"
                      title="Preview Test"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={`/recruiter/domain-assessments/${item.id}/edit`}
                      className="p-1.5 rounded-lg hover:bg-surface text-ink-soft hover:text-ink transition"
                      title="Edit Assessment"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
