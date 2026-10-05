"use client";

import React, { useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, X, ArrowRight, UserX, RefreshCw } from "lucide-react";

export type ConfirmModalType = "advance" | "fail" | "refill";

interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: ConfirmModalType;
  title: string;
  description: string;
  candidateName?: string;
  stageName?: string;
  loading?: boolean;
  onConfirm: (payload: { score?: number; notes?: string; reason?: string; count?: number }) => Promise<void>;
}

export function ConfirmActionModal({
  isOpen,
  onClose,
  type,
  title,
  description,
  candidateName,
  stageName,
  loading = false,
  onConfirm,
}: ConfirmActionModalProps) {
  const [score, setScore] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [refillCount, setRefillCount] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm({
        score: score ? Number(score) : undefined,
        notes: notes.trim() || undefined,
        reason: reason.trim() || undefined,
        count: refillCount,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const isDestructive = type === "fail";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-border/70">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl ${
                isDestructive
                  ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                  : type === "advance"
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
              }`}
            >
              {isDestructive ? (
                <UserX className="w-4 h-4" />
              ) : type === "advance" ? (
                <ArrowRight className="w-4 h-4" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </div>
            <h3 className="text-sm font-extrabold text-ink">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-ink-soft hover:text-ink hover:bg-surface-alt transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-ink-soft leading-relaxed">{description}</p>

          {candidateName && (
            <div className="p-3 bg-surface-alt/70 rounded-xl border border-border/70 text-xs">
              <span className="text-ink-soft">Candidate: </span>
              <strong className="text-ink font-bold">{candidateName}</strong>
              {stageName && (
                <>
                  <span className="mx-2 text-ink-soft">•</span>
                  <span className="text-ink-soft">Stage: </span>
                  <strong className="text-ink font-bold">{stageName}</strong>
                </>
              )}
            </div>
          )}

          {type === "advance" && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-semibold text-ink block mb-1">
                  Stage Evaluation Score (Optional, 0–100)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g. 85"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-surface border border-border rounded-xl text-ink outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink block mb-1">
                  Evaluation Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Strong technical performance, clear communication"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-surface border border-border rounded-xl text-ink outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>
            </div>
          )}

          {type === "fail" && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-semibold text-ink block mb-1">
                  Reason for Failure / Rejection (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Did not meet minimum rubric score for system design"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-surface border border-border rounded-xl text-ink outline-none focus:ring-2 focus:ring-rose-500/20 resize-none"
                />
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px]">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>If auto-refill is enabled, the backend will automatically promote the top reserve candidate to fill this seat.</span>
              </div>
            </div>
          )}

          {type === "refill" && (
            <div className="space-y-3 pt-1">
              <div>
                <label className="text-xs font-semibold text-ink block mb-1">
                  Number of Reserve Candidates to Promote
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={refillCount}
                  onChange={(e) => setRefillCount(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 text-xs bg-surface border border-border rounded-xl text-ink outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t border-border/70 bg-surface-alt/30">
          <button
            type="button"
            onClick={onClose}
            disabled={loading || submitting}
            className="px-3.5 py-2 rounded-xl border border-border text-xs font-semibold text-ink hover:bg-surface-alt transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading || submitting}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-xs transition disabled:opacity-50 ${
              isDestructive
                ? "bg-rose-600 text-white hover:bg-rose-700"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {submitting || loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : isDestructive ? (
              <>
                <UserX className="w-3.5 h-3.5" />
                <span>Confirm Failure</span>
              </>
            ) : type === "advance" ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Confirm Advance</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Promote Candidates</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
