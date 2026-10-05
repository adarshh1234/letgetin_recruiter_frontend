"use client";

import React, { useState } from "react";
import { Loader2, X, Zap } from "lucide-react";
import { recruiterService } from "../services/recruiterService";
import { CreditPack } from "../types";

interface BuyCreditsModalProps {
  open: boolean;
  onClose: () => void;
  packs: CreditPack[];
  onPurchased: (newBalance: number) => void;
}

export function BuyCreditsModal({ open, onClose, packs, onPurchased }: BuyCreditsModalProps) {
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handlePurchase = async (packId: string) => {
    setError(null);
    setPurchasingId(packId);
    try {
      const { balance } = await recruiterService.purchaseCredits(packId);
      onPurchased(balance);
      onClose();
    } catch (err: unknown) {
      setError((err as { message?: string })?.message || "Purchase failed.");
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-surface border border-border rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
              <Zap className="w-4.5 h-4.5 text-primary-glow" />
            </div>
            <h2 className="text-lg font-bold text-ink">Buy Credits</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-ink-soft hover:text-ink hover:bg-surface-alt transition"
            aria-label="Close"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {packs.map((pack) => (
            <button
              key={pack.id}
              type="button"
              disabled={purchasingId !== null}
              onClick={() => handlePurchase(pack.id)}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition text-left disabled:opacity-60 ${
                pack.best
                  ? "border-primary/40 bg-primary/5"
                  : "border-border hover:bg-surface-alt/60"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-ink">{pack.credits} credits</span>
                  {pack.best && (
                    <span className="text-[9px] font-bold text-primary-glow bg-primary/10 px-1.5 py-0.5 rounded-full">
                      Best Value
                    </span>
                  )}
                </div>
                <div className="text-xs text-ink-soft mt-0.5">₹{pack.price.toLocaleString()}</div>
              </div>
              {purchasingId === pack.id ? (
                <Loader2 className="w-4 h-4 animate-spin text-primary-glow" />
              ) : (
                <span className="text-xs font-semibold text-primary-glow">Buy</span>
              )}
            </button>
          ))}
        </div>

        {error && (
          <p className="text-sm text-destructive bg-destructive/5 border border-destructive/20 rounded-lg px-3 py-2 mt-4">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
