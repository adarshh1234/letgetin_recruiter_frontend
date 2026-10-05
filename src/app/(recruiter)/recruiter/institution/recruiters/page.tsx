"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Building2, Loader2, Pencil, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { institutionService } from "@/features/institution/services/institutionService";
import { AddRecruiterInput, InstitutionRecruiter, RecruiterLinkStatus, RecruiterRequirement } from "@/features/institution/types";

const emptyForm: AddRecruiterInput = {
  company: "",
  contactPerson: "",
  email: "",
  phone: "",
  industry: "",
  status: "active",
};

const STATUS_BADGE: Record<RecruiterLinkStatus, string> = {
  active: "bg-emerald-500/10 text-emerald-600",
  pending: "bg-amber-500/10 text-amber-600",
  inactive: "bg-ink-soft/10 text-ink-soft",
};

interface DraftRequirement extends RecruiterRequirement {
  tempKey: string;
}

export default function InstitutionRecruitersPage() {
  const [recruiters, setRecruiters] = useState<InstitutionRecruiter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddRecruiterInput>(emptyForm);
  const [requirements, setRequirements] = useState<DraftRequirement[]>([]);
  const [reqDraft, setReqDraft] = useState({ title: "", openings: "", notes: "" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    institutionService
      .getRecruiters()
      .then(setRecruiters)
      .catch(() => setError("Unable to load recruiters. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setRequirements([]);
    setReqDraft({ title: "", openings: "", notes: "" });
    setFormError(null);
    setShowForm(true);
  };

  const openEditForm = (r: InstitutionRecruiter) => {
    setEditingId(r._id);
    setForm({
      company: r.company,
      contactPerson: r.contactPerson || "",
      email: r.email,
      phone: r.phone || "",
      industry: r.industry || "",
      status: r.status,
    });
    setRequirements(r.requirements.map((req) => ({ ...req, tempKey: req._id || crypto.randomUUID() })));
    setReqDraft({ title: "", openings: "", notes: "" });
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => setShowForm(false);

  const addRequirementRow = () => {
    if (!reqDraft.title.trim()) return;
    setRequirements((prev) => [
      ...prev,
      {
        tempKey: crypto.randomUUID(),
        title: reqDraft.title.trim(),
        openings: reqDraft.openings ? Number(reqDraft.openings) : undefined,
        notes: reqDraft.notes.trim() || undefined,
      },
    ]);
    setReqDraft({ title: "", openings: "", notes: "" });
  };

  const removeRequirementRow = (tempKey: string) => {
    setRequirements((prev) => prev.filter((r) => r.tempKey !== tempKey));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.company?.trim() || !form.email?.trim()) {
      setFormError("Company and email are required.");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        requirements: requirements.map(({ title, openings, notes }) => ({ title, openings, notes })),
      };
      if (editingId) {
        await institutionService.updateRecruiter(editingId, payload);
      } else {
        await institutionService.addRecruiter(payload);
      }
      setShowForm(false);
      load();
    } catch (err: unknown) {
      setFormError((err as { message?: string })?.message || "Failed to save recruiter.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this recruiter?")) return;
    try {
      await institutionService.deleteRecruiter(id);
      setRecruiters((prev) => prev.filter((r) => r._id !== id));
    } catch {
      setError("Failed to remove recruiter. Please try again.");
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight">Recruiters</h1>
          <p className="text-ink-soft mt-1 text-sm">Manage your recruiters and their hiring requirements.</p>
        </div>
        <button
          onClick={openAddForm}
          className="inline-flex items-center gap-2 text-xs font-semibold bg-gradient-brand text-primary-foreground px-4 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition"
        >
          <Plus className="w-3.5 h-3.5" /> Add Recruiter
        </button>
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
            <h2 className="text-sm font-bold text-ink">{editingId ? "Edit Recruiter" : "Add Recruiter"}</h2>
            <button onClick={closeForm} className="text-ink-soft hover:text-ink">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="block text-sm font-medium text-ink mb-1.5">Company *</span>
                <input
                  className="input-base"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  required
                />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-ink mb-1.5">Contact Person</span>
                <input
                  className="input-base"
                  value={form.contactPerson}
                  onChange={(e) => setForm({ ...form, contactPerson: e.target.value })}
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
                <span className="block text-sm font-medium text-ink mb-1.5">Phone</span>
                <input
                  className="input-base"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-ink mb-1.5">Industry</span>
                <input
                  className="input-base"
                  value={form.industry}
                  onChange={(e) => setForm({ ...form, industry: e.target.value })}
                />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-ink mb-1.5">Status</span>
                <select
                  className="input-base"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as RecruiterLinkStatus })}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
            </div>

            <div>
              <span className="block text-sm font-medium text-ink mb-1.5">Requirements</span>
              <div className="grid grid-cols-1 sm:grid-cols-[1.5fr_0.7fr_1.5fr_auto] gap-2">
                <input
                  className="input-base"
                  placeholder="Role title, e.g. Backend Engineer"
                  value={reqDraft.title}
                  onChange={(e) => setReqDraft({ ...reqDraft, title: e.target.value })}
                />
                <input
                  type="number"
                  min={0}
                  className="input-base"
                  placeholder="Openings"
                  value={reqDraft.openings}
                  onChange={(e) => setReqDraft({ ...reqDraft, openings: e.target.value })}
                />
                <input
                  className="input-base"
                  placeholder="Notes (optional)"
                  value={reqDraft.notes}
                  onChange={(e) => setReqDraft({ ...reqDraft, notes: e.target.value })}
                />
                <button
                  type="button"
                  onClick={addRequirementRow}
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold border border-border text-ink px-3.5 py-2 rounded-xl hover:bg-surface-alt transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              {requirements.length > 0 && (
                <div className="mt-3 border border-border rounded-xl divide-y divide-border">
                  {requirements.map((req) => (
                    <div key={req.tempKey} className="flex items-center justify-between gap-3 px-3.5 py-2.5">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-ink truncate">
                          {req.title}
                          {req.openings != null && (
                            <span className="ml-2 text-[10px] font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full">
                              {req.openings} opening{req.openings === 1 ? "" : "s"}
                            </span>
                          )}
                        </div>
                        {req.notes && <div className="text-[11px] text-ink-soft truncate">{req.notes}</div>}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeRequirementRow(req.tempKey)}
                        className="text-ink-soft hover:text-destructive p-1.5 rounded-lg hover:bg-destructive/5 transition shrink-0"
                        aria-label="Remove requirement"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {formError && <p className="text-sm text-destructive">{formError}</p>}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 text-xs font-semibold bg-gradient-brand text-primary-foreground px-5 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                {editingId ? "Save Changes" : "Add Recruiter"}
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
        {loading ? (
          <div className="p-10 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary-glow" />
          </div>
        ) : recruiters.length === 0 ? (
          <div className="p-10 text-center">
            <Building2 className="w-8 h-8 text-ink-soft mx-auto mb-3" />
            <p className="text-sm text-ink-soft">No recruiters added yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-ink-soft border-b border-border">
                  <th className="px-5 py-3">Company</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Industry</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Requirements</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recruiters.map((r) => (
                  <tr key={r._id}>
                    <td className="px-5 py-3 font-semibold text-ink">{r.company}</td>
                    <td className="px-5 py-3 text-ink-soft">{r.contactPerson || "—"}</td>
                    <td className="px-5 py-3 text-ink-soft">{r.email}</td>
                    <td className="px-5 py-3 text-ink-soft">{r.industry || "—"}</td>
                    <td className="px-5 py-3">
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_BADGE[r.status]}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-ink-soft">
                      {r.requirements.length > 0 ? `${r.requirements.length} requirement${r.requirements.length === 1 ? "" : "s"}` : "—"}
                    </td>
                    <td className="px-5 py-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => openEditForm(r)}
                        className="text-ink-soft hover:text-ink p-1.5 rounded-lg hover:bg-surface-alt transition"
                        aria-label="Edit recruiter"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="text-ink-soft hover:text-destructive p-1.5 rounded-lg hover:bg-destructive/5 transition"
                        aria-label="Remove recruiter"
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
    </div>
  );
}
