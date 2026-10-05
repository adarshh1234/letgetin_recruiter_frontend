"use client";

import React, { useCallback, useEffect, useState } from "react";
import { CheckSquare, Loader2, Plus, Trash2, X } from "lucide-react";
import { institutionService } from "@/features/institution/services/institutionService";
import { CreateTaskInput, InstitutionTask, InstitutionTaskPriority } from "@/features/institution/types";

const PRIORITY_BADGE: Record<InstitutionTaskPriority, string> = {
  Low: "bg-ink-soft/10 text-ink-soft",
  Medium: "bg-amber-500/10 text-amber-600",
  High: "bg-destructive/10 text-destructive",
};

const emptyForm: CreateTaskInput = { name: "", estimatedTime: "", priority: "Medium" };

export default function InstitutionTasksPage() {
  const [tasks, setTasks] = useState<InstitutionTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateTaskInput>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    institutionService
      .getTasks()
      .then(setTasks)
      .catch(() => setError("Unable to load tasks. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.name.trim()) {
      setFormError("Task name is required.");
      return;
    }
    setSaving(true);
    try {
      await institutionService.addTask(form);
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err: unknown) {
      setFormError((err as { message?: string })?.message || "Failed to add task.");
    } finally {
      setSaving(false);
    }
  };

  const toggleDone = async (task: InstitutionTask) => {
    setTasks((prev) => prev.map((t) => (t._id === task._id ? { ...t, done: !t.done } : t)));
    try {
      await institutionService.updateTask(task._id, { done: !task.done });
    } catch {
      setTasks((prev) => prev.map((t) => (t._id === task._id ? { ...t, done: task.done } : t)));
      setError("Failed to update task. Please try again.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await institutionService.deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch {
      setError("Failed to remove task. Please try again.");
    }
  };

  return (
    <div className="p-6 sm:p-10 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-ink tracking-tight">Tasks</h1>
          <p className="text-ink-soft mt-1 text-sm">Keep track of your placement cell to-dos.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 text-xs font-semibold bg-gradient-brand text-primary-foreground px-4 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition"
        >
          <Plus className="w-3.5 h-3.5" /> Add Task
        </button>
      </div>

      {error && <div className="bg-destructive/5 border border-destructive/20 rounded-xl px-4 py-3 text-sm text-destructive">{error}</div>}

      <div className="bg-surface border border-border rounded-2xl shadow-elegant p-5 sm:p-6">
        {loading ? (
          <div className="p-10 flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-primary-glow" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-10">
            <CheckSquare className="w-8 h-8 text-ink-soft mx-auto mb-3" />
            <p className="text-sm text-ink-soft">No tasks yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div key={task._id} className="flex items-center gap-3 px-3.5 py-3 bg-surface-alt/40 border border-border rounded-xl">
                <button
                  onClick={() => toggleDone(task)}
                  className={`w-5 h-5 rounded-md border-2 shrink-0 flex items-center justify-center transition ${
                    task.done ? "bg-primary-glow border-primary-glow text-primary-foreground" : "border-border"
                  }`}
                  aria-label={task.done ? "Mark as not done" : "Mark as done"}
                >
                  {task.done && "✓"}
                </button>
                <div className={`flex-1 min-w-0 text-sm font-medium ${task.done ? "line-through text-ink-soft" : "text-ink"}`}>
                  {task.name}
                </div>
                {task.estimatedTime && (
                  <span className="text-[10px] text-ink-soft bg-surface px-2 py-1 rounded-full shrink-0">{task.estimatedTime}</span>
                )}
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${PRIORITY_BADGE[task.priority]}`}>
                  {task.priority}
                </span>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-ink-soft hover:text-destructive p-1 rounded-lg hover:bg-destructive/5 transition shrink-0"
                  aria-label="Remove task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-surface border border-border rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-ink text-base">Add Task</h3>
              <button onClick={() => setShowForm(false)} className="p-1.5 text-ink-soft hover:text-ink hover:bg-surface-alt rounded-xl transition">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddTask} className="space-y-3.5">
              <label className="block">
                <span className="block text-sm font-medium text-ink mb-1.5">Task Name *</span>
                <input className="input-base" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-ink mb-1.5">Estimated Time</span>
                <input className="input-base" placeholder="e.g. 2h" value={form.estimatedTime} onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })} />
              </label>
              <label className="block">
                <span className="block text-sm font-medium text-ink mb-1.5">Priority</span>
                <select className="input-base" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as InstitutionTaskPriority })}>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
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
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
