import { create } from 'zustand';
import { apiClient } from '@/shared/services/apiClient';
import { useResumeStore } from './useResumeStore';
import { calculateAtsHeuristics, isResumeEmpty, AtsAnalysisResult, HealthMetric } from '../utils/atsHeuristics';

export type { AtsAnalysisResult, HealthMetric };

interface AtsState {
  isAnalyzing: boolean;
  result: AtsAnalysisResult | null;
  hasAnalyzed: boolean;
  isStale: boolean;
  lastAnalyzedAt: string | null;
  error: string | null;

  runAtsAnalysis: (targetJobDescription?: string) => Promise<AtsAnalysisResult>;
  setStale: (stale?: boolean) => void;
  resetAts: () => void;
}

export const useAtsStore = create<AtsState>((set) => ({
  isAnalyzing: false,
  result: null,
  hasAnalyzed: false,
  isStale: false,
  lastAnalyzedAt: null,
  error: null,

  setStale: (stale = true) => set({ isStale: stale }),

  resetAts: () =>
    set({
      isAnalyzing: false,
      result: null,
      hasAnalyzed: false,
      isStale: false,
      lastAnalyzedAt: null,
      error: null,
    }),

  runAtsAnalysis: async (targetJobDescription?: string) => {
    set({ isAnalyzing: true, error: null });

    // Always fetch the freshest resume content directly from store state
    const currentResume = useResumeStore.getState().resume;
    const content = currentResume.content;
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Strict check for empty resume content -> score MUST be 0
    if (isResumeEmpty(content)) {
      const emptyResult = calculateAtsHeuristics(content);
      useResumeStore.getState().updateAtsScore?.(0);
      set({
        isAnalyzing: false,
        result: emptyResult,
        hasAnalyzed: true,
        isStale: false,
        lastAnalyzedAt: timestamp,
      });
      return emptyResult;
    }

    // 2. Calculate baseline heuristic locally with updated data
    const heuristic = calculateAtsHeuristics(content);

    try {
      const response: any = await apiClient.post('/ai/ats-analyze', {
        resumeContent: content,
        targetJobDescription,
      });

      const aiData = response?.data;
      let finalResult: AtsAnalysisResult;

      if (aiData && typeof aiData.score === 'number') {
        const calibratedScore = Math.min(100, Math.max(0, Math.round(aiData.score)));
        finalResult = {
          ...heuristic,
          overallScore: calibratedScore,
          missingKeywords:
            Array.isArray(aiData.missingKeywords) && aiData.missingKeywords.length > 0
              ? aiData.missingKeywords
              : heuristic.missingKeywords,
          strengths:
            Array.isArray(aiData.recommendations) && aiData.recommendations.length > 0
              ? [...heuristic.strengths]
              : heuristic.strengths,
          lastAnalyzedAt: timestamp,
        };
      } else {
        finalResult = {
          ...heuristic,
          lastAnalyzedAt: timestamp,
        };
      }

      useResumeStore.getState().updateAtsScore?.(finalResult.overallScore);
      set({
        isAnalyzing: false,
        result: finalResult,
        hasAnalyzed: true,
        isStale: false,
        lastAnalyzedAt: timestamp,
      });
      return finalResult;
    } catch (error: any) {
      console.warn('[useAtsStore] AI ATS analysis API fallback to client heuristic engine:', error);
      const fallbackResult: AtsAnalysisResult = {
        ...heuristic,
        lastAnalyzedAt: timestamp,
      };

      useResumeStore.getState().updateAtsScore?.(fallbackResult.overallScore);
      set({
        isAnalyzing: false,
        result: fallbackResult,
        hasAnalyzed: true,
        isStale: false,
        lastAnalyzedAt: timestamp,
      });
      return fallbackResult;
    }
  },
}));
