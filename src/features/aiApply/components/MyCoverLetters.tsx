"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Mail, Plus, Trash2, Loader2 } from "lucide-react";
import { coverLetterService } from "../services/coverLetterService";
import { AiApplyCoverLetterOption } from "../types";

export function MyCoverLetters() {
  const [coverLetters, setCoverLetters] = useState<AiApplyCoverLetterOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newTitle, setNewTitle] = useState("New Cover Letter");
  const [newContent, setNewContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadCoverLetters = useCallback(async () => {
    setIsLoading(true);
    const list = await coverLetterService.list();
    setCoverLetters(list);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadCoverLetters();
  }, [loadCoverLetters]);

  const handleCreate = async () => {
    setIsSaving(true);
    try {
      const created = await coverLetterService.create({
        title: newTitle || "Untitled Cover Letter",
        content: newContent,
      });
      setCoverLetters((prev) => [created, ...prev]);
      setShowNewForm(false);
      setNewTitle("New Cover Letter");
      setNewContent("");
    } catch (err) {
      console.warn("Failed to create cover letter:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    try {
      await coverLetterService.remove(id);
      setCoverLetters((prev) => prev.filter((cl) => cl.id !== id));
    } catch (err) {
      console.warn("Failed to delete cover letter:", err);
    } finally {
      setBusyId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-surface/50 border border-border rounded-3xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-ink-soft font-medium">
          {coverLetters.length} cover letter{coverLetters.length === 1 ? "" : "s"}
        </p>
        {!showNewForm && (
          <button
            type="button"
            onClick={() => setShowNewForm(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-deep cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Cover Letter</span>
          </button>
        )}
      </div>

      {showNewForm && (
        <div className="space-y-2.5 p-4 rounded-2xl border border-border bg-surface">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Cover letter title"
            className="input-base text-sm"
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Write your cover letter..."
            rows={6}
            className="input-base text-sm resize-none"
          />
          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowNewForm(false)}
              disabled={isSaving}
              className="text-xs font-semibold text-ink-soft hover:text-ink px-3 py-1.5 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={isSaving}
              className="text-xs font-bold text-white bg-gradient-brand px-4 py-2 rounded-xl shadow-elegant disabled:opacity-50 cursor-pointer"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      )}

      {coverLetters.length === 0 ? (
        <div className="text-center py-20 bg-surface/40 border border-dashed border-border rounded-3xl space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center text-primary-foreground mx-auto shadow-glow">
            <Mail className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-ink">No Cover Letters Yet</h3>
          <p className="text-xs text-ink-soft max-w-sm mx-auto leading-relaxed">
            You haven&apos;t created any cover letters yet.
          </p>
          <button
            onClick={() => setShowNewForm(true)}
            className="bg-gradient-brand text-primary-foreground text-xs font-semibold px-6 py-3 rounded-xl shadow-elegant hover:shadow-glow transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Create Your First Cover Letter
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {coverLetters.map((cl) => (
            <div
              key={cl.id}
              className="bg-surface border border-border rounded-2xl p-4 space-y-3 flex flex-col shadow-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary-glow flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <p className="text-sm font-bold text-ink truncate" title={cl.title}>
                    {cl.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(cl.id)}
                  disabled={busyId === cl.id}
                  title="Delete cover letter"
                  className="p-1.5 text-ink-soft hover:text-rose-600 rounded-lg hover:bg-rose-500/10 transition cursor-pointer disabled:opacity-50 shrink-0"
                >
                  {busyId === cl.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="text-xs text-ink-soft leading-relaxed line-clamp-4 flex-1">
                {cl.content || "No content yet."}
              </p>
              {cl.updatedAt && (
                <p className="text-[10px] text-ink-soft/70">
                  Updated {new Date(cl.updatedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
