"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Briefcase, CheckCircle2, Loader2, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { recruiterService } from "@/features/recruiter/services/recruiterService";
import { CreateJobInput, EmploymentType, RecruiterJob } from "@/features/recruiter/types";

const emptyForm: CreateJobInput = {
  title: "",
  companyName: "",
  employmentType: "full-time",
  eligibilityMinPercent: undefined,
  skills: [],
  deadline: "",
  description: "",
};

function formatDateDMY(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  return `${dd}-${mm}-${d.getFullYear()}`;
}

export default function InstitutionJobsPage() {
  // Jobs the institution posts and manages itself, reusing the same POST /jobs, GET /jobs/mine
  // and DELETE /jobs/mine/:id endpoints Company/Startup use.
  const [myJobs, setMyJobs] = useState<RecruiterJob[]>([]);
  const [myJobsLoading, setMyJobsLoading] = useState(true);
  const [myJobsError, setMyJobsError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateJobInput>(emptyForm);
  const [skillsInput, setSkillsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [postSuccess, setPostSuccess] = useState<string | null>(null);

  const loadMyJobs = useCallback(() => {
    setMyJobsLoading(true);
    setMyJobsError(null);
    recruiterService
      .getMyJobs()
      .then(setMyJobs)
      .catch(() => setMyJobsError("Unable to load your postings. Please try again."))
      .finally(() => setMyJobsLoading(false));
  }, []);

  useEffect(() => {
    loadMyJobs();
  }, [loadMyJobs]);

  const openForm = () => {
    setForm(emptyForm);
    setSkillsInput("");
    setFormError(null);
    setPostSuccess(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setFormError(null);
  };

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.title?.trim() || !form.companyName?.trim()) {
      setFormError("Title and Company are required.");
      return;
    }
    setSaving(true);
    try {
      const skills = skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const created = await recruiterService.createJob({
        ...form,
        title: form.title.trim(),
        companyName: form.companyName?.trim(),
        description: form.description?.trim() || "",
        skills,
        eligibilityMinPercent: form.eligibilityMinPercent ? Number(form.eligibilityMinPercent) : undefined,
        deadline: form.deadline || undefined,
      });
      setShowForm(false);
      setPostSuccess(`"${created.title}" was posted successfully.`);
      loadMyJobs();
    } catch (err: unknown) {
      setFormError((err as { message?: string })?.message || "Failed to post job. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMyJob = async (id: string) => {
    if (!confirm("Delete this job posting? This cannot be undone.")) return;
    try {
      await recruiterService.deleteJob(id);
      setMyJobs((prev) => prev.filter((j) => j._id !== id));
      setPostSuccess("Job deleted successfully.");
    } catch {
      setMyJobsError("Failed to delete job. Please try again.");
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight">Jobs</h1>
          <p className="text-ink-soft mt-1 text-sm">Jobs you've posted directly for your students.</p>
        </div>
        <button
          onClick={openForm}
          className="inline-flex items-center gap-2 text-xs font-semibold bg-gradient-brand text-primary-foreground px-4 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition"
        >
          <Plus className="w-3.5 h-3.5" /> Post Job
        </button>
      </div>

      {postSuccess && (
        <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3.5 py-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {postSuccess}
        </div>
      )}

      {myJobsError && (
        <div className="flex items-center justify-between gap-3 bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-3 text-sm text-destructive">
          <span>{myJobsError}</span>
          <button onClick={loadMyJobs} className="inline-flex items-center gap-1.5 font-semibold shrink-0 hover:underline">
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {showForm && (
        <div className="bg-surface border border-border rounded-2xl shadow-elegant p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink">Post Job</h2>
            <button onClick={closeForm} className="text-ink-soft hover:text-ink">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handlePostJob} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-sm font-medium text-ink mb-1.5">Title *</span>
              <input
                className="input-base"
                placeholder="e.g. Software Engineer"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-ink mb-1.5">Company *</span>
              <input
                className="input-base"
                placeholder="e.g. TechCorp"
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                required
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-ink mb-1.5">Type</span>
              <select
                className="input-base"
                value={form.employmentType}
                onChange={(e) => setForm({ ...form, employmentType: e.target.value as EmploymentType })}
              >
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-ink mb-1.5">Eligibility (min %)</span>
              <input
                type="number"
                min={0}
                max={100}
                className="input-base"
                placeholder="e.g. 60"
                value={form.eligibilityMinPercent ?? ""}
                onChange={(e) =>
                  setForm({ ...form, eligibilityMinPercent: e.target.value ? Number(e.target.value) : undefined })
                }
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="block text-sm font-medium text-ink mb-1.5">Skills Required</span>
              <input
                className="input-base"
                placeholder="Comma-separated, e.g. Python, Java, React"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-ink mb-1.5">Deadline</span>
              <input
                type="date"
                className="input-base"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="block text-sm font-medium text-ink mb-1.5">Description</span>
              <textarea
                className="input-base min-h-[90px]"
                placeholder="Brief description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </label>

            {formError && <p className="sm:col-span-2 text-sm text-destructive">{formError}</p>}

            <div className="sm:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 text-xs font-semibold bg-gradient-brand text-primary-foreground px-5 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                Post Job
              </button>
              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="text-xs font-semibold text-ink-soft hover:text-ink px-4 py-2.5 disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-surface border border-border rounded-2xl shadow-elegant overflow-hidden">
        {myJobsLoading ? (
          <div className="p-10 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary-glow" />
          </div>
        ) : myJobs.length === 0 ? (
          <div className="p-10 text-center">
            <Briefcase className="w-8 h-8 text-ink-soft mx-auto mb-3" />
            <p className="text-sm text-ink-soft">No jobs posted yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-ink-soft border-b border-border">
                  <th className="px-5 py-3">#</th>
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">Company</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Eligibility</th>
                  <th className="px-5 py-3">Deadline</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {myJobs.map((job, idx) => (
                  <tr key={job._id}>
                    <td className="px-5 py-3 text-ink-soft">{idx + 1}</td>
                    <td className="px-5 py-3 font-semibold text-ink">{job.title}</td>
                    <td className="px-5 py-3 text-ink-soft">{job.company?.name || "—"}</td>
                    <td className="px-5 py-3 text-ink-soft capitalize">{job.employmentType}</td>
                    <td className="px-5 py-3 text-ink-soft">
                      {job.eligibilityMinPercent != null ? `${job.eligibilityMinPercent}%` : "—"}
                    </td>
                    <td className="px-5 py-3 text-ink-soft">{formatDateDMY(job.expiresAt)}</td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => handleDeleteMyJob(job._id)}
                        className="text-ink-soft hover:text-destructive p-1.5 rounded-lg hover:bg-destructive/5 transition"
                        aria-label="Delete job"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {!myJobsLoading && myJobs.length > 0 && (
        <p className="text-xs text-ink-soft">{myJobs.length} job{myJobs.length === 1 ? "" : "s"}</p>
      )}
    </div>
  );
}
