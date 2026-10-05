'use client';

import { useAtsStore, AtsAnalysisResult, HealthMetric } from '../store/useAtsStore';

export type { AtsAnalysisResult, HealthMetric };

/**
 * Hook for consuming on-demand ATS analysis.
 * Strictly triggers on user action ("Analyze resume" click) with the latest updated resume state.
 * Never runs automatically on timers or background change events.
 */
export const useAtsAnalysis = () => {
  const isAnalyzing = useAtsStore((state) => state.isAnalyzing);
  const result = useAtsStore((state) => state.result);
  const hasAnalyzed = useAtsStore((state) => state.hasAnalyzed);
  const isStale = useAtsStore((state) => state.isStale);
  const lastAnalyzedAt = useAtsStore((state) => state.lastAnalyzedAt);
  const runAtsAnalysis = useAtsStore((state) => state.runAtsAnalysis);
  const resetAts = useAtsStore((state) => state.resetAts);

  return {
    isAnalyzing,
    result,
    hasAnalyzed,
    isStale,
    lastAnalyzedAt,
    runAtsAnalysis,
    resetAts,
    // Backwards compatibility if needed
    userMode: 'manual' as const,
    setUserMode: (_mode: 'auto' | 'manual') => {},
  };
};
