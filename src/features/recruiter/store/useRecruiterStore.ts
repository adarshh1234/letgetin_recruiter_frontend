import { create } from 'zustand';
import { recruiterService } from '../services/recruiterService';
import { EntityType, OrgFormMeta, OrgProfile } from '../types';

interface RecruiterState {
  orgProfile: OrgProfile | null;
  orgProfileStatus: 'idle' | 'loading' | 'loaded' | 'error';
  orgFormMeta: Partial<Record<EntityType, OrgFormMeta>>;
  error: string | null;

  loadOrgProfile: () => Promise<OrgProfile | null>;
  saveOrgProfile: (
    data: Omit<OrgProfile, '_id' | 'ownerUserId' | 'createdAt' | 'updatedAt'>
  ) => Promise<OrgProfile>;
  loadOrgFormMeta: (entity: EntityType) => Promise<OrgFormMeta>;
  clearError: () => void;
}

export const useRecruiterStore = create<RecruiterState>((set, get) => ({
  orgProfile: null,
  orgProfileStatus: 'idle',
  orgFormMeta: {},
  error: null,

  loadOrgProfile: async () => {
    set({ orgProfileStatus: 'loading', error: null });
    try {
      const profile = await recruiterService.getOrgProfile();
      set({ orgProfile: profile, orgProfileStatus: 'loaded' });
      return profile;
    } catch (err: unknown) {
      const errorMsg =
        (err as { error?: { message?: string } })?.error?.message ||
        (err as { message?: string })?.message ||
        'Failed to load organization profile';
      set({ error: errorMsg, orgProfileStatus: 'error' });
      throw new Error(errorMsg);
    }
  },

  saveOrgProfile: async (data) => {
    set({ error: null });
    try {
      const profile = await recruiterService.saveOrgProfile(data);
      set({ orgProfile: profile, orgProfileStatus: 'loaded' });
      return profile;
    } catch (err: unknown) {
      const errorMsg =
        (err as { error?: { message?: string } })?.error?.message ||
        (err as { message?: string })?.message ||
        'Failed to save organization profile';
      set({ error: errorMsg });
      throw new Error(errorMsg);
    }
  },

  loadOrgFormMeta: async (entity) => {
    const cached = get().orgFormMeta[entity];
    if (cached) return cached;
    const meta = await recruiterService.getOrgFormMeta(entity);
    set((state) => ({ orgFormMeta: { ...state.orgFormMeta, [entity]: meta } }));
    return meta;
  },

  clearError: () => set({ error: null }),
}));
