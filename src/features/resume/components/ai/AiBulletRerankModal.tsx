'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Minus, Plus, Bot, ArrowRight, SlidersHorizontal } from 'lucide-react';

interface AiBulletRerankModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string; // e.g. "Senior Software Engineer at Acme Corp" or "Project Title"
  currentCount: number;
  initialTargetCount?: number;
  onConfirm: (targetCount: number, customContext?: string) => void;
}

export const AiBulletRerankModal: React.FC<AiBulletRerankModalProps> = ({
  isOpen,
  onClose,
  title,
  currentCount,
  initialTargetCount = 3,
  onConfirm,
}) => {
  const [targetCount, setTargetCount] = useState<number>(initialTargetCount);
  const [customFocus, setCustomFocus] = useState<string>('');

  if (!isOpen) return null;

  const handleIncrement = () => {
    setTargetCount((prev) => Math.min(6, prev + 1));
  };

  const handleDecrement = () => {
    setTargetCount((prev) => Math.max(1, prev - 1));
  };

  const handleApplyToChatAgent = () => {
    onConfirm(targetCount, customFocus.trim() ? customFocus.trim() : undefined);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-elegant overflow-hidden my-6"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-border bg-surface-alt/50">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-brand text-primary-foreground flex items-center justify-center shadow-xs shrink-0 mt-0.5">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-ink">
                  AI Bullet Point Generator & Reasoner
                </h3>
                <p className="text-xs text-ink-soft mt-0.5 leading-relaxed">
                  Targeting: <span className="font-semibold text-primary-glow">{title}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-ink-soft hover:text-ink hover:bg-surface-alt rounded-lg transition-colors cursor-pointer shrink-0 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-5">
            {/* Bullet Count Stepper */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-primary-glow" />
                  1. How many bullet points do you need?
                </label>
                <span className="text-[10px] font-semibold text-ink-soft bg-surface-alt px-2 py-0.5 rounded border border-border">
                  1 to 6 Bullets
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={targetCount <= 1}
                  className="w-10 h-10 rounded-xl bg-surface border border-border hover:bg-surface-alt disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-ink font-bold text-base transition-colors cursor-pointer shadow-xs"
                  title="Decrease count"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="w-20 h-10 rounded-xl bg-surface-alt border border-border flex items-center justify-center text-base font-extrabold text-ink shadow-inner">
                  {targetCount} {targetCount === 1 ? 'bullet' : 'bullets'}
                </div>

                <button
                  type="button"
                  onClick={handleIncrement}
                  disabled={targetCount >= 6}
                  className="w-10 h-10 rounded-xl bg-surface border border-border hover:bg-surface-alt disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center text-ink font-bold text-base transition-colors cursor-pointer shadow-xs"
                  title="Increase count"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Optional Custom Context / Metrics */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-ink flex items-center justify-between">
                <span>2. Key Focus or Quantifiable Metric (Optional)</span>
                <span className="text-[10px] text-ink-soft font-normal">e.g. % speedup, users, tech stack</span>
              </label>
              <textarea
                rows={2}
                value={customFocus}
                onChange={(e) => setCustomFocus(e.target.value)}
                placeholder="e.g. Reduced API latency by 35%, deployed with Docker & AWS, led 4 engineers..."
                className="input-base text-xs leading-relaxed resize-y"
              />
            </div>

            {/* Status Information Box */}
            <div className="p-3.5 bg-surface-alt/60 border border-border rounded-xl text-xs space-y-1">
              <div className="text-ink-soft flex items-center justify-between">
                <span>Current bullet count on card:</span>
                <span className="font-semibold text-ink">{currentCount}</span>
              </div>
              <div className="text-primary-glow font-semibold text-[11px] pt-1 border-t border-border/50">
                AI Coach Agent will analyze your context in chat and generate {targetCount} high-converting, recruiter-ready bullet points.
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 p-4 border-t border-border bg-surface-alt/30">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-ink-soft hover:text-ink bg-surface hover:bg-surface-alt border border-border rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleApplyToChatAgent}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-primary-foreground bg-gradient-brand hover:shadow-glow rounded-xl shadow-elegant transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Take {targetCount} Bullets to AI Coach Agent</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
