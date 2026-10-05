import { create } from 'zustand';
import { MongoStorage } from '@/features/resume/storage/mongo';
import { ProfileService, ProfileData } from '@/features/profile/services/profileService';
import { aiApplyService } from '../services/aiApplyService';
import { coverLetterService } from '../services/coverLetterService';
import { STEPS, TOTAL_STEPS } from '../config/steps.config';
import {
  AiApplyPreferences,
  AiApplySuggestions,
  AiApplyResumeOption,
  AiApplyCoverLetterOption,
  ApplyForJobsResult,
  ContactChannel,
  createInitialPreferences,
  MatchedJobItem,
  AiApplyBatchSession,
} from '../types';
import { IResume } from '@/features/resume/types';

function mapIResumeToOption(r: IResume): AiApplyResumeOption {
  return {
    id: r.id,
    title: r.title,
    headline: r.content?.personalInfo?.headline,
    templateId: r.templateId,
    atsScore: r.atsScore,
    updatedAt: r.updatedAt,
  };
}

let pollingTimer: NodeJS.Timeout | null = null;

interface AiApplyStoreState {
  currentStep: number; // 0 = Introduction, 1..TOTAL_STEPS = wizard steps
  preferences: AiApplyPreferences;
  aiSuggestions: AiApplySuggestions | null;
  profile: ProfileData | null;
  resumes: AiApplyResumeOption[];
  coverLetters: AiApplyCoverLetterOption[];
  hydrated: boolean;
  isHydrating: boolean;
  isSaving: boolean;
  isApplying: boolean;
  applyResult: ApplyForJobsResult | null;
  error: string | null;

  // Matched Jobs & Batch Apply state
  matchedJobs: MatchedJobItem[];
  isFetchingMatchedJobs: boolean;
  matchedJobsTotal: number;
  selectedJobIds: string[];
  appliedJobIds: string[];
  candidateProfileMeta: {
    headline?: string;
    skillsCount: number;
    skills: string[];
    hasEmbedding: boolean;
    embeddingStatus: string;
  } | null;
  batchMinScore: number;
  batchSearchQuery: string;
  permissionGranted: boolean;

  // Active Batch Applying Session
  activeBatchSession: AiApplyBatchSession | null;
  isPollingBatch: boolean;
  batchActionLoading: boolean;

  hydrate: () => Promise<void>;
  setField: <K extends keyof AiApplyPreferences>(key: K, value: AiApplyPreferences[K]) => void;
  goToStep: (step: number) => void;
  nextStep: () => Promise<void>;
  prevStep: () => void;
  addResume: (resume: AiApplyResumeOption) => void;
  addCoverLetter: (coverLetter: AiApplyCoverLetterOption) => void;
  submitApply: () => Promise<void>;

  // Batch actions
  fetchMatchedJobs: () => Promise<void>;
  toggleJobSelection: (jobId: string) => void;
  selectAllJobs: () => void;
  deselectAllJobs: () => void;
  selectTopN: (n: number) => void;
  setPermissionGranted: (granted: boolean) => void;
  setBatchMinScore: (score: number) => void;
  setBatchSearchQuery: (query: string) => void;
  startBatchApply: (batchSize?: number) => Promise<void>;
  pauseBatch: () => Promise<void>;
  resumeBatch: () => Promise<void>;
  cancelBatch: () => Promise<void>;
  stopPolling: () => void;
  resetSession: () => void;
  reset: () => void;
}

export const useAiApplyStore = create<AiApplyStoreState>((set, get) => ({
  currentStep: 0,
  preferences: createInitialPreferences(),
  aiSuggestions: null,
  profile: null,
  resumes: [],
  coverLetters: [],
  hydrated: false,
  isHydrating: false,
  isSaving: false,
  isApplying: false,
  applyResult: null,
  error: null,

  // Matched Jobs State
  matchedJobs: [],
  isFetchingMatchedJobs: false,
  matchedJobsTotal: 0,
  selectedJobIds: [],
  appliedJobIds: [],
  candidateProfileMeta: null,
  batchMinScore: 55,
  batchSearchQuery: '',
  permissionGranted: false,

  // Active Batch Session
  activeBatchSession: null,
  isPollingBatch: false,
  batchActionLoading: false,

  hydrate: async () => {
    if (get().isHydrating) return;
    set({ isHydrating: true, error: null });

    try {
      const [preferencesResult, profile, resumes, coverLetters, activeBatch] = await Promise.all([
        aiApplyService.getPreferences(),
        ProfileService.getProfile(),
        new MongoStorage().list(),
        coverLetterService.list(),
        aiApplyService.getActiveBatchSession().catch(() => null),
      ]);

      const merged = createInitialPreferences();

      // 1. Saved AI Apply preferences win for every field they cover
      if (preferencesResult.preferences) {
        Object.assign(merged, preferencesResult.preferences);
      }

      // 2. Profile passthrough only for fields still empty
      if (!merged.preferredCountry) merged.preferredCountry = profile.contact?.country || '';
      if (!merged.preferredState) merged.preferredState = profile.contact?.state || '';
      if (!merged.preferredLocation) merged.preferredLocation = profile.contact?.city || '';
      if (merged.contactChannels.length === 0) {
        const channels: ContactChannel[] = [];
        if (profile.contact?.email) channels.push('email');
        if (profile.contact?.phone) channels.push('mobile');
        merged.contactChannels = channels;
      }

      const hasActiveBatch = activeBatch && ['queued', 'processing', 'paused'].includes(activeBatch.status);

      set({
        preferences: merged,
        aiSuggestions: preferencesResult.aiSuggestions,
        profile,
        resumes: resumes.map(mapIResumeToOption),
        coverLetters,
        activeBatchSession: activeBatch,
        isHydrating: false,
        hydrated: true,
      });

      if (hasActiveBatch) {
        get().goToStep(7);
        // Start polling active batch
        startBatchPollingLoop(activeBatch._id, set, get);
      }
    } catch (err) {
      console.warn('[useAiApplyStore] hydrate failed:', err);
      set({
        isHydrating: false,
        hydrated: true,
        error: 'We could not load your saved data. You can still fill the wizard manually.',
      });
    }
  },

  setField: (key, value) =>
    set((state) => ({ preferences: { ...state.preferences, [key]: value } })),

  goToStep: (step) => {
    const targetStep = Math.max(0, Math.min(step, TOTAL_STEPS));
    set({ currentStep: targetStep });
    if (targetStep === 7) {
      get().fetchMatchedJobs();
    }
  },

  nextStep: async () => {
    const { currentStep, preferences } = get();

    if (currentStep >= 1 && currentStep <= TOTAL_STEPS) {
      const stepDef = STEPS[currentStep - 1];
      if (stepDef && !stepDef.isValid(preferences)) return;
    }

    set({ isSaving: true });
    try {
      await aiApplyService.savePreferences(preferences);
    } catch (err) {
      console.warn('[useAiApplyStore] autosave failed:', err);
    } finally {
      set({ isSaving: false });
    }

    const next = Math.min(currentStep + 1, TOTAL_STEPS);
    set({ currentStep: next });

    if (next === 7) {
      get().fetchMatchedJobs();
    }
  },

  prevStep: () => set((state) => ({ currentStep: Math.max(0, state.currentStep - 1) })),

  addResume: (resume) =>
    set((state) => ({
      resumes: [resume, ...state.resumes],
      preferences: { ...state.preferences, resumeId: resume.id },
    })),

  addCoverLetter: (coverLetter) =>
    set((state) => ({
      coverLetters: [coverLetter, ...state.coverLetters],
      preferences: { ...state.preferences, coverLetterId: coverLetter.id },
    })),

  fetchMatchedJobs: async () => {
    set({ isFetchingMatchedJobs: true, error: null });
    const { batchMinScore, batchSearchQuery } = get();

    try {
      const result = await aiApplyService.getMatchedJobs({
        minScore: batchMinScore,
        search: batchSearchQuery.trim() || undefined,
        limit: 50,
      });

      const selectableIds = result.jobs
        .filter((j) => !j.isAlreadyApplied)
        .map((j) => String(j._id));

      set({
        matchedJobs: result.jobs,
        matchedJobsTotal: result.total,
        candidateProfileMeta: result.candidateProfile,
        appliedJobIds: result.appliedJobIds,
        selectedJobIds: selectableIds, // default select all unapplied matches
        isFetchingMatchedJobs: false,
      });
    } catch (err: any) {
      set({
        isFetchingMatchedJobs: false,
        error: err?.message || 'Failed to fetch matched jobs from database.',
      });
    }
  },

  toggleJobSelection: (jobId: string) =>
    set((state) => {
      const exists = state.selectedJobIds.includes(jobId);
      return {
        selectedJobIds: exists
          ? state.selectedJobIds.filter((id) => id !== jobId)
          : [...state.selectedJobIds, jobId],
      };
    }),

  selectAllJobs: () =>
    set((state) => ({
      selectedJobIds: state.matchedJobs.filter((j) => !j.isAlreadyApplied).map((j) => String(j._id)),
    })),

  deselectAllJobs: () => set({ selectedJobIds: [] }),

  selectTopN: (n: number) =>
    set((state) => {
      const unapplied = state.matchedJobs.filter((j) => !j.isAlreadyApplied);
      return {
        selectedJobIds: unapplied.slice(0, n).map((j) => String(j._id)),
      };
    }),

  setPermissionGranted: (granted: boolean) => set({ permissionGranted: granted }),

  setBatchMinScore: (score: number) => {
    set({ batchMinScore: score });
    get().fetchMatchedJobs();
  },

  setBatchSearchQuery: (query: string) => {
    set({ batchSearchQuery: query });
  },

  startBatchApply: async (batchSize = 10) => {
    const { selectedJobIds, preferences } = get();

    if (selectedJobIds.length === 0) {
      set({ error: 'Please select at least one job to apply for.' });
      return;
    }

    set({ batchActionLoading: true, error: null });

    try {
      // Save freshest preferences first
      await aiApplyService.savePreferences(preferences);

      const response = await aiApplyService.startBatchApply({
        jobIds: selectedJobIds,
        batchSize,
      });

      // Initial batch session representation
      const initialSession: AiApplyBatchSession = {
        _id: response.sessionId,
        status: 'queued',
        totalJobs: response.totalJobs,
        totalBatches: response.totalBatches,
        batchSize: response.batchSize,
        currentBatch: 0,
        appliedCount: 0,
        skippedDuplicates: 0,
        failedCount: 0,
        appliedJobs: [],
        startedAt: new Date().toISOString(),
      };

      set({
        activeBatchSession: initialSession,
        batchActionLoading: false,
        isPollingBatch: true,
      });

      // Start high-performance polling loop
      startBatchPollingLoop(response.sessionId, set, get);
    } catch (err: any) {
      const apiError = err as { error?: { message?: string }; message?: string };
      set({
        batchActionLoading: false,
        error: apiError?.error?.message || apiError?.message || 'Failed to start AI Batch Apply. Please try again.',
      });
    }
  },

  pauseBatch: async () => {
    const { activeBatchSession } = get();
    if (!activeBatchSession) return;
    set({ batchActionLoading: true });
    try {
      const updated = await aiApplyService.pauseBatchApply(activeBatchSession._id);
      set({ activeBatchSession: updated, batchActionLoading: false });
    } catch (err: any) {
      set({ batchActionLoading: false, error: err?.message || 'Failed to pause batch apply.' });
    }
  },

  resumeBatch: async () => {
    const { activeBatchSession } = get();
    if (!activeBatchSession) return;
    set({ batchActionLoading: true });
    try {
      const updated = await aiApplyService.resumeBatchApply(activeBatchSession._id);
      set({ activeBatchSession: updated, batchActionLoading: false, isPollingBatch: true });
      startBatchPollingLoop(activeBatchSession._id, set, get);
    } catch (err: any) {
      set({ batchActionLoading: false, error: err?.message || 'Failed to resume batch apply.' });
    }
  },

  cancelBatch: async () => {
    const { activeBatchSession } = get();
    if (!activeBatchSession) return;
    set({ batchActionLoading: true });
    try {
      const updated = await aiApplyService.cancelBatchApply(activeBatchSession._id);
      if (pollingTimer) {
        clearInterval(pollingTimer);
        pollingTimer = null;
      }
      set({ activeBatchSession: updated, batchActionLoading: false, isPollingBatch: false });
    } catch (err: any) {
      set({ batchActionLoading: false, error: err?.message || 'Failed to cancel batch apply.' });
    }
  },

  stopPolling: () => {
    if (pollingTimer) {
      clearInterval(pollingTimer);
      pollingTimer = null;
    }
    set({ isPollingBatch: false });
  },

  resetSession: () => {
    if (pollingTimer) {
      clearInterval(pollingTimer);
      pollingTimer = null;
    }
    set({ activeBatchSession: null, isPollingBatch: false, permissionGranted: false });
    get().fetchMatchedJobs();
  },

  submitApply: async () => {
    set({ isApplying: true, error: null });
    try {
      await aiApplyService.savePreferences(get().preferences);
      const result = await aiApplyService.applyForJobs();
      set({ applyResult: result, isApplying: false });
    } catch (err) {
      const apiError = err as { error?: { message?: string }; message?: string };
      set({
        isApplying: false,
        error: apiError?.error?.message || apiError?.message || 'Failed to apply for jobs. Please try again.',
      });
    }
  },

  reset: () => {
    if (pollingTimer) {
      clearInterval(pollingTimer);
      pollingTimer = null;
    }
    set({
      currentStep: 0,
      preferences: createInitialPreferences(),
      aiSuggestions: null,
      hydrated: false,
      applyResult: null,
      activeBatchSession: null,
      isPollingBatch: false,
      error: null,
    });
  },
}));

function startBatchPollingLoop(
  sessionId: string,
  set: (partial: Partial<AiApplyStoreState> | ((state: AiApplyStoreState) => Partial<AiApplyStoreState>)) => void,
  get: () => AiApplyStoreState
) {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }

  const poll = async () => {
    try {
      const latest = await aiApplyService.getBatchStatus(sessionId);
      set({ activeBatchSession: latest });

      if (['completed', 'cancelled', 'failed'].includes(latest.status)) {
        if (pollingTimer) {
          clearInterval(pollingTimer);
          pollingTimer = null;
        }
        set({ isPollingBatch: false });
      }
    } catch (err) {
      console.warn('[useAiApplyStore] Polling error:', err);
    }
  };

  // Poll immediately, then every 1500ms
  poll();
  pollingTimer = setInterval(poll, 1500);
}
