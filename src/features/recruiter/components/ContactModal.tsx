"use client";

import React, { useState } from "react";
import { Loader2, Mail, Phone, X } from "lucide-react";
import { recruiterService } from "../services/recruiterService";
import { SourcedCandidate } from "../types";

interface ContactModalProps {
  candidate: SourcedCandidate;
  onClose: () => void;
  onRevealed: (candidateUserId: string, email?: string, phone?: string, newBalance?: number) => void;
  onInsufficientCredits: () => void;
}

export function ContactModal({ candidate, onClose, onRevealed, onInsufficientCredits }: ContactModalProps) {
  const [isRevealing, setIsRevealing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReveal = async () => {
    setError(null);
    setIsRevealing(true);
    try {
      const result = await recruiterService.revealContact(candidate.candidateUserId);
      onRevealed(candidate.candidateUserId, result.email, result.phone, result.balance);
    } catch (err: unknown) {
      const message = (err as { message?: string })?.message || "";
      if (message.toLowerCase().includes("insufficient")) {
        onInsufficientCredits();
      } else {
        setError(message || "Failed to reveal contact.");
      }
    } finally {
      setIsRevealing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-surface border border-border rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-ink">{candidate.name}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-soft hover:text-ink hover:bg-surface-alt transition"
            aria-label="Close"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-background">
            <Mail className="w-4 h-4 text-primary-glow shrink-0" />
            <span className="text-sm text-ink truncate">{candidate.email || "—"}</span>
          </div>
          <div className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-background">
            <Phone className="w-4 h-4 text-primary-glow shrink-0" />
            <span className="text-sm text-ink truncate">{candidate.phone || "—"}</span>
          </div>
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2 mt-4">
            {error}
          </p>
        )}

        {!candidate.contactRevealed && (
          <button
            type="button"
            onClick={handleReveal}
            disabled={isRevealing}
            className="w-full mt-5 bg-gradient-brand text-primary-foreground font-semibold px-6 py-3 rounded-xl shadow-elegant hover:shadow-glow transition-all disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {isRevealing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Revealing...
              </>
            ) : (
              <>Reveal Contact (5 credits)</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
