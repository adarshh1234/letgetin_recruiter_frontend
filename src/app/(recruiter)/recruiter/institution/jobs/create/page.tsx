"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PlusCircle, ArrowLeft, Sparkles, Building2, Briefcase, GraduationCap, CheckCircle2, DollarSign, Calendar } from "lucide-react";
import { recruiterService } from "@/features/recruiter/services/recruiterService";

export default function InstitutionCreateJobPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    companyName: "",
    employmentType: "full-time" as "full-time" | "internship",
    eligibilityMinPercent: 70,
    skills: "",
    salaryText: "",
    deadline: "",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.companyName.trim()) {
      setError("Please specify job title and hiring company.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const skillsArray = form.skills.split(",").map((s) => s.trim()).filter(Boolean);
      await recruiterService.createJob({
        title: form.title.trim(),
        companyName: form.companyName.trim(),
        employmentType: form.employmentType,
        eligibilityMinPercent: form.eligibilityMinPercent,
        salaryText: form.salaryText.trim(),
        deadline: form.deadline,
        skills: skillsArray,
        description: form.description.trim(),
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/recruiter/institution/jobs");
      }, 1500);
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || "Failed to publish campus job.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/recruiter/institution/jobs"
          className="p-1.5 rounded-xl border border-border bg-surface text-ink-soft hover:text-ink hover:bg-surface-alt transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">Post Campus Drive Job</h1>
          <p className="text-xs sm:text-sm text-ink-soft">
            Publish a campus placement opening with academic eligibility criteria and department filters.
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span>Campus job published successfully! Redirecting to Jobs...</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-bold">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl border border-border bg-surface shadow-xs space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">Job / Role Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Graduate Engineer Trainee (GET)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-alt border border-border text-xs text-ink focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">Hiring Company Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Infosys / Google India"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-alt border border-border text-xs text-ink focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">Employment Type</label>
            <select
              value={form.employmentType}
              onChange={(e) => setForm({ ...form, employmentType: e.target.value as "full-time" | "internship" })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-alt border border-border text-xs text-ink focus:outline-none focus:border-primary"
            >
              <option value="full-time">Full-Time Placement</option>
              <option value="internship">Internship + PPO</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">CTC Package / Stipend</label>
            <input
              type="text"
              placeholder="e.g. ₹18 LPA / ₹50k/mo"
              value={form.salaryText}
              onChange={(e) => setForm({ ...form, salaryText: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-alt border border-border text-xs text-ink focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">Min Academic % / CGPA</label>
            <input
              type="number"
              min="0"
              max="100"
              placeholder="e.g. 70"
              value={form.eligibilityMinPercent}
              onChange={(e) => setForm({ ...form, eligibilityMinPercent: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-alt border border-border text-xs text-ink focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">Key Skills / Competencies</label>
            <input
              type="text"
              placeholder="e.g. Java, Python, SQL, DSA (comma separated)"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-alt border border-border text-xs text-ink focus:outline-none focus:border-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink">Application Deadline</label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-alt border border-border text-xs text-ink focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-ink">Job Description & Drive Rounds</label>
          <textarea
            rows={4}
            placeholder="Include role responsibilities, eligibility criteria, and selection rounds (PPT, Online Assessment, Tech Interview, HR)..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-surface-alt border border-border text-xs text-ink focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/recruiter/institution/jobs"
            className="px-4 py-2 rounded-xl bg-surface border border-border text-ink hover:text-ink-soft text-xs font-bold transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-brand text-primary-foreground text-xs font-bold shadow-glow hover:opacity-95 transition cursor-pointer disabled:opacity-50"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{saving ? "Publishing..." : "Publish Job Posting"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
