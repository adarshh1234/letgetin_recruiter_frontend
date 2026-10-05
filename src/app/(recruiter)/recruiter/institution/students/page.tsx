"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, RefreshCw, Trash2, UploadCloud, Users, X } from "lucide-react";
import { institutionService } from "@/features/institution/services/institutionService";
import { CreateStudentInput, InstitutionStudent, InstitutionStudentStatus } from "@/features/institution/types";
import { StudentBulkUploadModal } from "@/features/institution/components/StudentBulkUploadModal";

const STATUS_BADGE: Record<InstitutionStudentStatus, string> = {
  active: "bg-primary/10 text-primary-glow",
  placed: "bg-emerald-500/10 text-emerald-600",
  pending: "bg-amber-500/10 text-amber-600",
};

const emptyForm: CreateStudentInput = { name: "", email: "", course: "", year: "", skills: [], status: "active" };

export default function InstitutionStudentsPage() {
  const [students, setStudents] = useState<InstitutionStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [form, setForm] = useState<CreateStudentInput>(emptyForm);
  const [skillsInput, setSkillsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    institutionService
      .getStudents()
      .then(setStudents)
      .catch(() => setError("Unable to load students. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.name.trim() || !form.email.trim() || !form.course.trim()) {
      setFormError("Name, email and course are required.");
      return;
    }
    setSaving(true);
    try {
      const skills = skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      await institutionService.addStudent({ ...form, skills });
      setForm(emptyForm);
      setSkillsInput("");
      setShowForm(false);
      load();
    } catch (err: unknown) {
      setFormError((err as { message?: string })?.message || "Failed to add student.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this student from your roster?")) return;
    try {
      await institutionService.deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch {
      setError("Failed to remove student. Please try again.");
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight">Students</h1>
          <p className="text-ink-soft mt-1 text-sm">Manage your student roster and bulk imports.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBulkUpload(true)}
            className="inline-flex items-center gap-2 text-xs font-semibold border border-border text-ink px-4 py-2.5 rounded-xl hover:bg-surface-alt transition"
          >
            <UploadCloud className="w-3.5 h-3.5" /> Bulk Upload
          </button>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 text-xs font-semibold bg-gradient-brand text-primary-foreground px-4 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition"
          >
            <Plus className="w-3.5 h-3.5" /> Add Student
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center justify-between gap-3 bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-3 text-sm text-destructive">
          <span>{error}</span>
          <button onClick={load} className="inline-flex items-center gap-1.5 font-semibold shrink-0 hover:underline">
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {showForm && (
        <div className="bg-surface border border-border rounded-2xl shadow-elegant p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-ink">Add Student</h2>
            <button onClick={() => setShowForm(false)} className="text-ink-soft hover:text-ink">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-sm font-medium text-ink mb-1.5">Full Name *</span>
              <input
                className="input-base"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-ink mb-1.5">Email *</span>
              <input
                type="email"
                className="input-base"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-ink mb-1.5">Course *</span>
              <input
                className="input-base"
                value={form.course}
                onChange={(e) => setForm({ ...form, course: e.target.value })}
                required
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-ink mb-1.5">Year</span>
              <input
                className="input-base"
                placeholder="e.g. 3rd Year"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: e.target.value })}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="block text-sm font-medium text-ink mb-1.5">Skills</span>
              <input
                className="input-base"
                placeholder="Comma-separated, e.g. Python, React"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-ink mb-1.5">Status</span>
              <select
                className="input-base"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as InstitutionStudentStatus })}
              >
                <option value="active">Active</option>
                <option value="placed">Placed</option>
                <option value="pending">Pending</option>
              </select>
            </label>

            {formError && <p className="sm:col-span-2 text-sm text-destructive">{formError}</p>}

            <div className="sm:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 text-xs font-semibold bg-gradient-brand text-primary-foreground px-5 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                Add Student
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-surface border border-border rounded-2xl shadow-elegant overflow-hidden">
        {loading ? (
          <div className="p-10 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary-glow" />
          </div>
        ) : students.length === 0 ? (
          <div className="p-10 text-center">
            <Users className="w-8 h-8 text-ink-soft mx-auto mb-3" />
            <p className="text-sm text-ink-soft">No students added yet. Add students or upload a file.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-ink-soft border-b border-border">
                  <th className="px-5 py-3">Student</th>
                  <th className="px-5 py-3">Course</th>
                  <th className="px-5 py-3">Year</th>
                  <th className="px-5 py-3">Skills</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((s) => (
                  <tr key={s._id}>
                    <td className="px-5 py-3">
                      <div className="font-semibold text-ink">{s.name}</div>
                      <div className="text-[11px] text-ink-soft">{s.email}</div>
                    </td>
                    <td className="px-5 py-3 text-ink-soft">{s.course}</td>
                    <td className="px-5 py-3 text-ink-soft">{s.year || "—"}</td>
                    <td className="px-5 py-3">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {s.skills.length > 0 ? (
                          s.skills.slice(0, 3).map((skill) => (
                            <span key={skill} className="text-[10px] bg-surface-alt text-ink-soft px-2 py-0.5 rounded-full">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-ink-soft">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${STATUS_BADGE[s.status]}`}>
                        {s.status.charAt(0).toUpperCase() + s.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="text-ink-soft hover:text-destructive p-1.5 rounded-lg hover:bg-destructive/5 transition"
                        aria-label="Remove student"
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
      {!loading && students.length > 0 && (
        <p className="text-xs text-ink-soft">{students.length} student{students.length === 1 ? "" : "s"}</p>
      )}

      <StudentBulkUploadModal
        isOpen={showBulkUpload}
        onClose={() => setShowBulkUpload(false)}
        onSuccess={load}
      />
    </div>
  );
}
