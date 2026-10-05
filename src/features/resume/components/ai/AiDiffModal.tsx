'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, X, ArrowRight, ShieldAlert } from 'lucide-react';

interface AiDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  currentValue: string;
  improvedValue: string;
  onAccept: (acceptedValue: string) => void;
}

export const AiDiffModal: React.FC<AiDiffModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  currentValue,
  improvedValue,
  onAccept,
}) => {
  if (!isOpen) return null;

  const handleAccept = () => {
    onAccept(improvedValue);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden"
        >
          {/* Top Decorative Banner */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-200 transition-colors rounded-full hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100">{title}</h2>
              <p className="text-xs text-slate-400">
                {subtitle || 'Review and approve AI recommendations before applying them to your resume'}
              </p>
            </div>
          </div>

          {/* Side by Side Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
            {/* Current Version */}
            <div className="flex flex-col bg-slate-950/70 border border-slate-800 rounded-xl p-5 relative">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Current Version
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  Active State
                </span>
              </div>
              <div className="flex-1 text-sm text-slate-300 font-sans leading-relaxed whitespace-pre-wrap">
                {currentValue || <em className="text-slate-500 italic">No existing text provided</em>}
              </div>
            </div>

            {/* Improved Version */}
            <div className="flex flex-col bg-gradient-to-b from-blue-950/30 to-indigo-950/20 border border-blue-500/30 rounded-xl p-5 relative shadow-inner">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-blue-500/20">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Improved Version
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-medium">
                  Recommended
                </span>
              </div>
              <div className="flex-1 text-sm text-slate-100 font-sans leading-relaxed whitespace-pre-wrap">
                {improvedValue}
              </div>
            </div>
          </div>

          {/* User Approval Note */}
          <div className="flex items-center gap-2 p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400 mb-6">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>AI changes are only committed to your resume when you explicitly click <strong>Accept</strong>.</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Reject Change</span>
            </button>
            <button
              onClick={handleAccept}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
            >
              <Check className="w-4 h-4" />
              <span>Accept & Apply to Resume</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
