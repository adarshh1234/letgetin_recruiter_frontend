'use client';

import React from 'react';
import { Rocket, ArrowRight } from 'lucide-react';
import { useAiApplyStore } from '../store/useAiApplyStore';

export function IntroScreen() {
  const nextStep = useAiApplyStore((s) => s.nextStep);

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 space-y-6 max-w-lg mx-auto">
      <div className="w-16 h-16 rounded-3xl bg-gradient-brand text-white flex items-center justify-center shadow-glow">
        <Rocket className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-ink">Auto Apply to Jobs</h1>
        <p className="text-sm text-ink-soft leading-relaxed">
          Let AI apply to matching jobs for you automatically and get hired faster.
        </p>
      </div>
      <button
        type="button"
        onClick={() => nextStep()}
        className="inline-flex items-center gap-2 bg-gradient-brand text-white font-bold text-sm px-6 py-3 rounded-xl shadow-elegant hover:shadow-glow transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
      >
        <span>Apply with AI</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
