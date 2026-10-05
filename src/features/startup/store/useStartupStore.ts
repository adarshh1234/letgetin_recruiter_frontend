import { create } from 'zustand';
import { startupService } from '../services/startupService';
import {
  FundraisingStage,
  FundraisingSummary,
  Investor,
  InvestorDeal,
  StartupProfileResponse,
  RoundConfig,
} from '../types';

interface StartupState {
  profile: StartupProfileResponse | null;
  summary: FundraisingSummary | null;
  deals: InvestorDeal[];
  investors: Investor[];
  investorsTotal: number;
  investorsPage: number;
  investorsTotalPages: number;

  isLoadingDeals: boolean;
  isLoadingInvestors: boolean;
  isLoadingSummary: boolean;
  isSaving: boolean;
  error: string | null;

  loadProfile: () => Promise<StartupProfileResponse | null>;
  updateProfile: (payload: {
    name?: string;
    website?: string;
    industry?: string;
    sector?: string;
    description?: string;
    location?: string;
    founded?: string;
    employees?: string;
    founders?: string;
    fundraisingProfile?: Partial<RoundConfig>;
  }) => Promise<StartupProfileResponse>;

  loadSummary: () => Promise<FundraisingSummary | null>;
  loadDeals: () => Promise<InvestorDeal[]>;
  createDeal: (payload: {
    investorId?: string;
    fundName: string;
    fundLogoText?: string;
    tier?: string;
    leadPartner?: string;
    partnerRole?: string;
    partnerEmail?: string;
    linkedinUrl?: string;
    stage?: string;
    checkSize?: number;
    checkSizeText?: string;
    focusTags?: string[];
    notes?: string;
    recentDeal?: string;
  }) => Promise<InvestorDeal>;

  moveDealStage: (dealId: string, newStage: FundraisingStage) => Promise<void>;
  updateDeal: (dealId: string, updates: Partial<InvestorDeal>) => Promise<InvestorDeal>;
  deleteDeal: (dealId: string) => Promise<void>;
  addDealActivity: (
    dealId: string,
    activity: { type: 'note' | 'email' | 'meeting' | 'call' | 'data_room'; note: string }
  ) => Promise<InvestorDeal>;

  loadInvestors: (params?: {
    search?: string;
    type?: string;
    sector?: string;
    stage?: string;
    page?: number;
    limit?: number;
  }) => Promise<void>;

  clearError: () => void;
}

export const useStartupStore = create<StartupState>((set, get) => ({
  profile: null,
  summary: null,
  deals: [],
  investors: [],
  investorsTotal: 0,
  investorsPage: 1,
  investorsTotalPages: 1,

  isLoadingDeals: false,
  isLoadingInvestors: false,
  isLoadingSummary: false,
  isSaving: false,
  error: null,

  loadProfile: async () => {
    try {
      const data = await startupService.getFundraisingProfile();
      set({ profile: data });
      return data;
    } catch (err: unknown) {
      console.warn('Failed to load startup profile:', err);
      return null;
    }
  },

  updateProfile: async (payload) => {
    set({ isSaving: true, error: null });
    try {
      const updated = await startupService.updateFundraisingProfile(payload);
      set({ profile: updated, isSaving: false });
      // Refresh summary KPIs after round config change
      get().loadSummary();
      return updated;
    } catch (err: unknown) {
      const msg = (err as any)?.message || 'Failed to update fundraising profile';
      set({ error: msg, isSaving: false });
      throw new Error(msg);
    }
  },

  loadSummary: async () => {
    set({ isLoadingSummary: true });
    try {
      const data = await startupService.getFundraisingSummary();
      set({ summary: data, isLoadingSummary: false });
      return data;
    } catch (err: unknown) {
      console.warn('Failed to load fundraising summary:', err);
      set({ isLoadingSummary: false });
      return null;
    }
  },

  loadDeals: async () => {
    set({ isLoadingDeals: true });
    try {
      const deals = await startupService.listPipelineDeals();
      set({ deals, isLoadingDeals: false });
      return deals;
    } catch (err: unknown) {
      console.warn('Failed to load deals:', err);
      set({ isLoadingDeals: false });
      return [];
    }
  },

  createDeal: async (payload) => {
    set({ isSaving: true });
    try {
      const deal = await startupService.createPipelineDeal(payload);
      set((state) => ({
        deals: [deal, ...state.deals],
        isSaving: false,
      }));
      get().loadSummary();
      return deal;
    } catch (err: unknown) {
      const msg = (err as any)?.message || 'Failed to add deal to pipeline';
      set({ error: msg, isSaving: false });
      throw new Error(msg);
    }
  },

  /**
   * Optimistic drag-and-drop stage movement with rollback on server failure
   */
  moveDealStage: async (dealId, newStage) => {
    const previousDeals = [...get().deals];
    const targetDeal = previousDeals.find((d) => (d._id || d.id) === dealId);
    if (!targetDeal || targetDeal.stage === newStage) return;

    // Optimistic UI state
    set({
      deals: previousDeals.map((d) =>
        (d._id || d.id) === dealId ? { ...d, stage: newStage, lastTouch: 'Stage updated' } : d
      ),
    });

    try {
      const serverDeal = await startupService.updatePipelineDeal(dealId, { stage: newStage });
      // Update with server state (including new activity entry)
      set((state) => ({
        deals: state.deals.map((d) => ((d._id || d.id) === dealId ? serverDeal : d)),
      }));
      get().loadSummary();
    } catch (err: unknown) {
      // Rollback on network failure
      console.error('Failed to sync stage update, rolling back:', err);
      set({ deals: previousDeals, error: 'Failed to update deal stage. Rolled back.' });
    }
  },

  updateDeal: async (dealId, updates) => {
    set({ isSaving: true });
    try {
      const updated = await startupService.updatePipelineDeal(dealId, updates);
      set((state) => ({
        deals: state.deals.map((d) => ((d._id || d.id) === dealId ? updated : d)),
        isSaving: false,
      }));
      get().loadSummary();
      return updated;
    } catch (err: unknown) {
      const msg = (err as any)?.message || 'Failed to update deal';
      set({ error: msg, isSaving: false });
      throw new Error(msg);
    }
  },

  deleteDeal: async (dealId) => {
    const previousDeals = [...get().deals];
    set({
      deals: previousDeals.filter((d) => (d._id || d.id) !== dealId),
    });

    try {
      await startupService.deletePipelineDeal(dealId);
      get().loadSummary();
    } catch (err: unknown) {
      console.error('Failed to delete deal, rolling back:', err);
      set({ deals: previousDeals, error: 'Failed to delete deal' });
      throw err;
    }
  },

  addDealActivity: async (dealId, activity) => {
    try {
      const updated = await startupService.addDealActivity(dealId, activity);
      set((state) => ({
        deals: state.deals.map((d) => ((d._id || d.id) === dealId ? updated : d)),
      }));
      return updated;
    } catch (err: unknown) {
      const msg = (err as any)?.message || 'Failed to log activity';
      set({ error: msg });
      throw new Error(msg);
    }
  },

  loadInvestors: async (params = {}) => {
    set({ isLoadingInvestors: true });
    try {
      const res = await startupService.listInvestors(params);
      set({
        investors: res.investors,
        investorsTotal: res.total,
        investorsPage: res.page,
        investorsTotalPages: res.totalPages,
        isLoadingInvestors: false,
      });
    } catch (err: unknown) {
      console.warn('Failed to load investors:', err);
      set({ isLoadingInvestors: false });
    }
  },

  clearError: () => set({ error: null }),
}));
