"use client";

import React, { useCallback, useEffect, useState } from "react";
import { AlertTriangle, GraduationCap, Loader2, Plus, Sparkles, Trash2, X } from "lucide-react";
import { institutionService } from "@/features/institution/services/institutionService";
import { CreateTrainingProgramInput, SkillGap, TrainingProgram } from "@/features/institution/types";

const emptyForm: CreateTrainingProgramInput = { name: "", scheduledDate: "", attendees: undefined, notes: "" };

export default function InstitutionTrainingPage() {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [insights, setInsights] = useState<{ kind: "suggestion" | "warning"; text: string }[]>([]);
  const [skillGaps, setSkillGaps] = useState<SkillGap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateTrainingProgramInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    Promise.all([institutionService.getTrainingPrograms(), institutionService.getTrainingInsights()])
      .then(([programsRes, insightsRes]) => {
        setPrograms(programsRes);
        setInsights(insightsRes.insights);
        setSkillGaps(insightsRes.skillGaps);
      })
      .catch(() => setError("Unable to load training data. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.name.trim()) {
      setFormError("Program name is required.");
      return;
    }
    setSaving(true);
    try {
      await institutionService.addTrainingProgram({
        ...form,
        attendees: form.attendees ? Number(form.attendees) : undefined,
      });
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err: unknown) {
      setFormError((err as { message?: string })?.message || "Failed to schedule program.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await institutionService.deleteTrainingProgram(id);
      setPrograms((prev) => prev.filter((p) => p._id !== id));
    } catch {
      setError("Failed to remove program. Please try again.");
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink tracking-tight">Training &amp; Employability</h1>
        <p className="text-ink-soft mt-1 text-sm">Skill-gap insights and scheduled training programs.</p>
      </div>

      {error && <div className="bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-3 text-sm text-destructive">{error}</div>}

      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary-glow" />
          <h2 className="text-sm font-bold text-ink">Skill Gap Analysis</h2>
        </div>
        <div className="bg-surface border border-border rounded-2xl shadow-elegant p-5 sm:p-6">
          {loading ? (
            <div className="p-6 flex justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-primary-glow" />
            </div>
          ) : insights.length === 0 ? (
            <p className="text-sm text-ink-soft text-center py-6">
              {skillGaps.length === 0
                ? "Skill gap insights will appear once your students and connected recruiters' jobs both have listed skills."
                : "No significant skill gaps detected right now."}
            </p>
          ) : (
            <div className="space-y-2.5">
              {insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3 px-3.5 py-3 rounded-xl border-l-4 border-l-amber-500 bg-amber-500/5">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
                  <p className="text-sm text-ink leading-relaxed">{insight.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-primary-glow" />
            <h2 className="text-sm font-bold text-ink">Scheduled Programs</h2>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 text-xs font-semibold bg-gradient-brand text-primary-foreground px-4 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition"
          >
            <Plus className="w-3.5 h-3.5" /> Schedule Program
          </button>
        </div>

        <div className="bg-surface border border-border rounded-2xl shadow-elegant p-5 sm:p-6">
          {loading ? (
            <div className="p-6 flex justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-primary-glow" />
            </div>
          ) : programs.length === 0 ? (
            <p className="text-sm text-ink-soft text-center py-6">No training programs scheduled yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {programs.map((p) => (
                <div key={p._id} className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-ink text-sm truncate">{p.name}</div>
                    <div className="text-[11px] text-ink-soft mt-0.5">
                      {p.scheduledDate ? new Date(p.scheduledDate).toLocaleDateString() : "No date set"}
                      {p.attendees ? ` · ${p.attendees} attendees` : ""}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="text-ink-soft hover:text-destructive p-1.5 rounded-lg hover:bg-destructive/5 transition shrink-0"
                    aria-label="Remove program"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface border border-border rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-ink text-base">Schedule Training Program</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-ink-soft hover:text-ink hover:bg-surface-alt rounded-xl transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3.5">
              <label className="block">
                <span className="block text-sm font-medium text-ink mb-1.5">Training Program *</span>
                <input className="input-base" placeholder="e.g. Aptitude Bootcamp" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-ink mb-1.5">Schedule</span>
                <input type="date" className="input-base" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-ink mb-1.5">Attendees</span>
                <input
                  type="number"
                  min={0}
                  className="input-base"
                  placeholder="Number of students"
                  value={form.attendees ?? ""}
                  onChange={(e) => setForm({ ...form, attendees: e.target.value ? Number(e.target.value) : undefined })}
                />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-ink mb-1.5">Notes</span>
                <textarea className="input-base min-h-[70px]" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </label>
              {formError && <p className="text-sm text-destructive">{formError}</p>}
              <div className="flex justify-end gap-3 pt-1">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-xs font-bold text-ink-soft hover:text-ink rounded-xl transition">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-gradient-brand text-primary-foreground font-bold text-xs px-5 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition disabled:opacity-60"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
