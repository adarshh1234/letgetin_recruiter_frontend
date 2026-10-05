"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  FileCheck,
  Search,
  SlidersHorizontal,
  Download,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award,
  Building2,
  GraduationCap,
  Briefcase,
  Fingerprint,
  FileText,
  Mail,
  Phone,
  MapPin,
  X,
  Check,
  Copy,
  Calendar,
  Lock,
  ArrowRight,
  BadgeCheck,
  Filter,
} from "lucide-react";
import { MOCK_VERIFIED_RESUMES } from "@/features/hiringPipeline/data/mockPipelineData";
import { VerifiedResumeCandidate } from "@/features/hiringPipeline/types/pipeline.types";

export default function VerifiedResumesPage() {
  const [candidates, setCandidates] = useState<VerifiedResumeCandidate[]>(
    MOCK_VERIFIED_RESUMES
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("All");
  const [selectedRole, setSelectedRole] = useState<string>("All");
  const [selectedCandidate, setSelectedCandidate] =
    useState<VerifiedResumeCandidate | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const copyHash = (hash: string) => {
    navigator.clipboard?.writeText(hash);
    showToast("Verification hash copied to clipboard!");
  };

  // Filter candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.appliedRole.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.currentCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesTier =
        selectedTier === "All" || c.verificationTier === selectedTier;

      const matchesRole =
        selectedRole === "All" || c.appliedRole === selectedRole;

      return matchesSearch && matchesTier && matchesRole;
    });
  }, [candidates, searchQuery, selectedTier, selectedRole]);

  const roles = [
    "All",
    "Senior Full Stack Engineer",
    "Staff AI/ML Engineer",
    "Lead Product Designer",
    "DevOps & Infrastructure Lead",
  ];

  const tierCounts = useMemo(() => {
    return {
      all: candidates.length,
      platinum: candidates.filter((c) => c.verificationTier === "Platinum").length,
      gold: candidates.filter((c) => c.verificationTier === "Gold").length,
      silver: candidates.filter((c) => c.verificationTier === "Silver").length,
    };
  }, [candidates]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-ink text-surface shadow-2xl text-xs font-semibold animate-in fade-in slide-in-from-bottom-3">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-border/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-ink-soft mb-2">
            <span>Recruiter</span>
            <ChevronRight className="w-3 h-3 text-ink-soft/60" />
            <span className="font-semibold text-primary">Verified Resumes</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              Verified Resumes
            </h1>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Trust Certified
            </span>
          </div>
          <p className="text-sm text-ink-soft mt-1">
            Pre-authenticated candidate dossiers with cryptographically verified employment records, government IDs, and degree credentials.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => showToast("Exported verified talent roster (CSV + Hash Log)")}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-border bg-surface hover:bg-surface-alt text-xs font-semibold text-ink shadow-xs transition"
          >
            <Download className="w-3.5 h-3.5 text-ink-soft" />
            <span>Export Verified Roster</span>
          </button>
        </div>
      </div>

      {/* Tier Quick Filter Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-surface-alt/70 border border-border rounded-2xl w-fit max-w-full overflow-x-auto shadow-xs">
        <button
          onClick={() => setSelectedTier("All")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
            selectedTier === "All"
              ? "bg-surface text-primary shadow-xs border border-border/60"
              : "text-ink-soft hover:text-ink hover:bg-surface/50"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>All Verified</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-primary/10 text-primary font-extrabold">
            {tierCounts.all}
          </span>
        </button>

        <button
          onClick={() => setSelectedTier("Platinum")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
            selectedTier === "Platinum"
              ? "bg-surface text-purple-600 dark:text-purple-400 shadow-xs border border-border/60"
              : "text-ink-soft hover:text-ink hover:bg-surface/50"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-500" />
          <span>Platinum Tier</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-extrabold">
            {tierCounts.platinum}
          </span>
        </button>

        <button
          onClick={() => setSelectedTier("Gold")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
            selectedTier === "Gold"
              ? "bg-surface text-amber-600 dark:text-amber-400 shadow-xs border border-border/60"
              : "text-ink-soft hover:text-ink hover:bg-surface/50"
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>Gold Tier</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-extrabold">
            {tierCounts.gold}
          </span>
        </button>

        <button
          onClick={() => setSelectedTier("Silver")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-2 ${
            selectedTier === "Silver"
              ? "bg-surface text-blue-600 dark:text-blue-400 shadow-xs border border-border/60"
              : "text-ink-soft hover:text-ink hover:bg-surface/50"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
          <span>Silver Tier</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold">
            {tierCounts.silver}
          </span>
        </button>
      </div>

      {/* Trust & Verification KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-surface border border-border/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-ink-soft font-semibold">
            <span>Verified Candidates</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-ink mt-2">
            {candidates.length} Profiles
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
            0% credential discrepancy
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-ink-soft font-semibold">
            <span>Identity & BG Check</span>
            <Fingerprint className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-black text-ink mt-2">100% Cleared</div>
          <div className="text-[11px] text-ink-soft mt-0.5">
            Government & Biometric verified
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-ink-soft font-semibold">
            <span>Skill Authenticity</span>
            <Sparkles className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-black text-ink mt-2">98.5% Score</div>
          <div className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-0.5">
            Proctored code assessments
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-surface border border-border/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-ink-soft font-semibold">
            <span>Turnaround Time</span>
            <Building2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-ink mt-2">&lt; 24 Hours</div>
          <div className="text-[11px] text-ink-soft mt-0.5">
            Automated verification SLA
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-surface border border-border space-y-3 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-ink-soft absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by candidate, skill, employer, university..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface-alt/60 border border-border rounded-xl text-xs text-ink placeholder:text-ink-soft/70 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Role Filter */}
            <div className="flex items-center gap-1.5 text-xs text-ink-soft font-semibold">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Role:</span>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-1.5 bg-surface border border-border rounded-xl text-xs font-bold text-ink outline-none focus:ring-1 focus:ring-primary cursor-pointer"
              >
                {roles.map((r) => (
                  <option key={r} value={r}>
                    {r === "All" ? "All Requisitions" : r}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* VERIFIED RESUMES LISTING */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-ink flex items-center gap-2">
            <span>Verified Candidate Roster</span>
            <span className="text-xs font-semibold text-ink-soft">
              ({filteredCandidates.length} Candidates)
            </span>
          </h2>
          <span className="text-xs text-ink-soft hidden sm:inline">
            Each profile contains tamper-proof verification hashes & certificates
          </span>
        </div>

        {filteredCandidates.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-surface border border-border">
            <ShieldCheck className="w-10 h-10 text-ink-soft mx-auto mb-2 opacity-60" />
            <h3 className="text-sm font-bold text-ink">No verified candidates found</h3>
            <p className="text-xs text-ink-soft mt-1">
              Try adjusting your search terms or filter selection.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedTier("All");
                setSelectedRole("All");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-surface-alt border border-border text-xs font-bold text-ink hover:bg-surface transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCandidates.map((c) => {
              const tierColor =
                c.verificationTier === "Platinum"
                  ? "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/25"
                  : c.verificationTier === "Gold"
                  ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/25"
                  : "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/25";

              return (
                <div
                  key={c.id}
                  className="rounded-2xl bg-surface border border-border hover:border-emerald-500/40 p-5 shadow-xs hover:shadow-md transition-all space-y-4 group"
                >
                  {/* Top Candidate Bar */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Avatar with Verified Checkmark */}
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-primary/20 to-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-ink font-black text-base shadow-xs">
                          {c.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      </div>

                      {/* Name & Contact */}
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-extrabold text-ink group-hover:text-primary transition-colors">
                            {c.name}
                          </h3>
                          <span
                            className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${tierColor}`}
                          >
                            {c.verificationTier} Tier
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-ink-soft">
                          {c.appliedRole}
                        </p>
                        <p className="text-[11px] text-ink-soft/80 flex items-center gap-1 mt-0.5">
                          <Briefcase className="w-3 h-3" /> {c.currentCompany} ({c.experience})
                        </p>
                      </div>
                    </div>

                    {/* Trust Score Pill */}
                    <div className="text-right shrink-0">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {c.trustScore}% Trust
                      </div>
                      <div className="text-[10px] text-ink-soft font-semibold mt-1">
                        {c.matchScore}% Match
                      </div>
                    </div>
                  </div>

                  {/* Summary Snippet */}
                  <p className="text-xs text-ink-soft leading-relaxed line-clamp-2">
                    {c.summary}
                  </p>

                  {/* 4 Multi-Point Verification Badges */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                    <div className="p-2 rounded-xl bg-surface-alt/70 border border-border flex flex-col justify-between">
                      <div className="flex items-center gap-1 font-bold text-ink">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span>Identity</span>
                      </div>
                      <span className="text-[9px] text-ink-soft truncate mt-1">
                        {c.checks.identity.badge}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-surface-alt/70 border border-border flex flex-col justify-between">
                      <div className="flex items-center gap-1 font-bold text-ink">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span>Work History</span>
                      </div>
                      <span className="text-[9px] text-ink-soft truncate mt-1">
                        {c.checks.employment.badge}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-surface-alt/70 border border-border flex flex-col justify-between">
                      <div className="flex items-center gap-1 font-bold text-ink">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span>Education</span>
                      </div>
                      <span className="text-[9px] text-ink-soft truncate mt-1">
                        {c.checks.education.badge}
                      </span>
                    </div>

                    <div className="p-2 rounded-xl bg-surface-alt/70 border border-border flex flex-col justify-between">
                      <div className="flex items-center gap-1 font-bold text-ink">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span>Skills & Code</span>
                      </div>
                      <span className="text-[9px] text-ink-soft truncate mt-1">
                        {c.checks.skills.badge}
                      </span>
                    </div>
                  </div>

                  {/* Cryptographic Hash Bar */}
                  <div className="p-2 rounded-xl bg-surface-alt/40 border border-border/70 flex items-center justify-between text-[11px] text-ink-soft">
                    <div className="flex items-center gap-1.5 truncate max-w-[80%]">
                      <Lock className="w-3 h-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="font-mono text-[10px] truncate">
                        Hash: {c.verificationHash}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyHash(c.verificationHash)}
                      className="p-1 text-ink-soft hover:text-ink transition"
                      title="Copy Verification Hash"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Actions & Resume Link */}
                  <div className="border-t border-border/70 pt-3 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          showToast(`Downloading verified resume: ${c.resumeFileName}`)
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-alt text-xs font-bold text-ink shadow-2xs transition"
                      >
                        <FileCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="truncate max-w-[150px]">{c.resumeFileName}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedCandidate(c)}
                        className="px-3 py-1.5 rounded-xl border border-border bg-surface hover:bg-surface-alt text-xs font-bold text-ink shadow-2xs transition"
                      >
                        Certificate
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          showToast(
                            `Fast-tracked ${c.name} directly into interview pipeline!`
                          )
                        }
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-bold shadow-2xs transition"
                      >
                        <span>Fast-Track</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* VERIFICATION CERTIFICATE MODAL */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-surface border border-border rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header Banner */}
            <div className="text-center pb-4 border-b border-border space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 flex items-center justify-center mx-auto shadow-xs">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-ink tracking-tight">
                Certificate of Credential Verification
              </h2>
              <p className="text-xs text-ink-soft max-w-md mx-auto">
                Issued by LetGetIn Trust & Compliance Verification Engine. All listed credentials are corroborated with primary sources.
              </p>
            </div>

            {/* Candidate Credentials Overview */}
            <div className="p-4 rounded-2xl bg-surface-alt/70 border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-ink">
                  {selectedCandidate.name}
                </h3>
                <p className="text-xs text-ink-soft">
                  {selectedCandidate.appliedRole} • {selectedCandidate.experience}
                </p>
                <p className="text-[11px] text-ink-soft mt-1">
                  {selectedCandidate.currentCompany}
                </p>
              </div>

              <div className="text-center sm:text-right">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  {selectedCandidate.trustScore}% Verified Trust Index
                </span>
                <div className="text-[11px] text-ink-soft mt-1">
                  Certified on {selectedCandidate.verificationDate}
                </div>
              </div>
            </div>

            {/* Primary Source Verification Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
                Corroborated Primary Records
              </h4>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl border border-border bg-surface flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Fingerprint className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-ink">
                        Government Identity Verification
                      </h5>
                      <p className="text-[11px] text-ink-soft mt-0.5">
                        Provider: {selectedCandidate.checks.identity.provider}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    PASSED
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-surface flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-ink">
                        Employment & Tenure Audit
                      </h5>
                      <p className="text-[11px] text-ink-soft mt-0.5">
                        Provider: {selectedCandidate.checks.employment.provider}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    PASSED
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-surface flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <GraduationCap className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-ink">
                        University Degree & Academic Records
                      </h5>
                      <p className="text-[11px] text-ink-soft mt-0.5">
                        Provider: {selectedCandidate.checks.education.provider}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    PASSED
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-surface flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-ink">
                        Technical Skill & Coding Rigor Assessment
                      </h5>
                      <p className="text-[11px] text-ink-soft mt-0.5">
                        Provider: {selectedCandidate.checks.skills.provider}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    PASSED
                  </span>
                </div>
              </div>
            </div>

            {/* Cryptographic Signature */}
            <div className="p-3 rounded-xl bg-surface-alt/60 border border-border font-mono text-[10px] text-ink-soft break-all">
              <span className="font-bold text-ink">Digital Certificate Digest: </span>
              {selectedCandidate.verificationHash}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-ink hover:bg-surface-alt transition"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    showToast("Verification certificate downloaded as PDF")
                  }
                  className="px-4 py-2 rounded-xl border border-border bg-surface hover:bg-surface-alt text-xs font-bold text-ink shadow-xs transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>

                <button
                  onClick={() => {
                    showToast(
                      `Added verified candidate ${selectedCandidate.name} to active requisitions!`
                    );
                    setSelectedCandidate(null);
                  }}
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-hover text-surface text-xs font-bold shadow-xs transition"
                >
                  Confirm Candidate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
