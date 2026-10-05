import { create } from 'zustand';
import {
  IResume,
  IPersonalInfo,
  IExperience,
  IEducation,
  IProject,
  ISkill,
  ICertificate,
  ILanguage,
  ISocialLink,
  ITemplateSettings,
  ICustomSection,
  ICustomSectionItem,
} from '../types';
import { INITIAL_RESUME_STATE, BLANK_RESUME_STATE } from '../constants/initialState';
import { ResumeNormalizationService } from '../services/ResumeNormalizationService';
import { mapProfileToResumeContent, mapResumeToProfileData } from '../utils/profileSync';
import { ProfileService, ProfileData } from '@/features/profile/services/profileService';

import { StorageProviderFactory } from '../storage/factory';

export type SaveStatus = 'idle' | 'unsaved' | 'saving' | 'saved' | 'error';

export interface ActiveResumeContext {
  section?: string;
  itemId?: string;
  field?: string;
  value?: string;
  position?: string;
  company?: string;
  title?: string;
  bulletIndex?: number;
  [key: string]: unknown;
}

interface ResumeStoreState {
  resume: IResume;
  isDirty: boolean;
  saveStatus: SaveStatus;
  lastSavedAt: string | null;
  activeSection: string;
  activeResumeContext: ActiveResumeContext | null;
  // While true, useAutosave skips persisting changes - set during an in-review Tailor Resume
  // session so staged/pending suggestion previews never silently overwrite the saved resume.
  isTailorModeActive: boolean;

  // Section Navigation & Focus
  setActiveSection: (section: string) => void;
  setActiveResumeContext: (ctx: ActiveResumeContext | null) => void;
  setTailorModeActive: (active: boolean) => void;

  // Header & Title Actions
  updateTitle: (title: string) => void;
  updateTemplateId: (templateId: string) => void;

  // Personal Info Actions
  updatePersonalInfo: (personalInfo: Partial<IPersonalInfo>) => void;

  // Summary Actions
  updateSummary: (summary: string) => void;
  
  // Experience Actions
  addExperience: (experience: IExperience) => void;
  updateExperience: (id: string, experience: Partial<IExperience>) => void;
  removeExperience: (id: string) => void;
  reorderExperiences: (experiences: IExperience[]) => void;

  // Education Actions
  addEducation: (education: IEducation) => void;
  updateEducation: (id: string, education: Partial<IEducation>) => void;
  removeEducation: (id: string) => void;
  reorderEducations: (educations: IEducation[]) => void;

  // Project Actions
  addProject: (project: IProject) => void;
  updateProject: (id: string, project: Partial<IProject>) => void;
  removeProject: (id: string) => void;
  reorderProjects: (projects: IProject[]) => void;

  // Skill Actions
  addSkill: (skill: ISkill | string) => void;
  updateSkill: (id: string, skill: Partial<ISkill>) => void;
  removeSkill: (id: string) => void;

  // Certificate Actions
  addCertificate: (certificate: ICertificate) => void;
  updateCertificate: (id: string, certificate: Partial<ICertificate>) => void;
  removeCertificate: (id: string) => void;
  reorderCertificates: (certificates: ICertificate[]) => void;

  // Language Actions
  addLanguage: (language: ILanguage) => void;
  updateLanguage: (id: string, language: Partial<ILanguage>) => void;
  removeLanguage: (id: string) => void;
  reorderLanguages: (languages: ILanguage[]) => void;

  // Custom Section Actions
  addCustomSection: (section: ICustomSection) => void;
  updateCustomSection: (id: string, section: Partial<ICustomSection>) => void;
  removeCustomSection: (id: string) => void;
  addCustomSectionItem: (sectionId: string, item?: Partial<ICustomSectionItem>) => void;
  updateCustomSectionItem: (sectionId: string, itemId: string, item: Partial<ICustomSectionItem>) => void;
  removeCustomSectionItem: (sectionId: string, itemId: string) => void;

  // Social Link Actions
  addSocialLink: (socialLink: ISocialLink) => void;
  updateSocialLink: (id: string, socialLink: Partial<ISocialLink>) => void;
  removeSocialLink: (id: string) => void;

  // Settings Actions
  updateSettings: (settings: Partial<ITemplateSettings>) => void;

  // ATS Score Action
  updateAtsScore: (atsScore: number) => void;

  // Full Replacement (e.g. AI Accept or Restore)
  setResume: (resume: IResume) => void;

  // Profile Bidirectional Synchronization
  syncFromProfile: (profileData?: ProfileData) => Promise<void>;
  syncToProfile: () => Promise<void>;

  // Storage Synchronization & Persistence
  saveResume: (isAuthenticated?: boolean) => Promise<void>;
  loadResume: (id: string, isAuthenticated?: boolean) => Promise<void>;
  resetToDefault: () => void;
  resetToBlank: () => void;
}

export const useResumeStore = create<ResumeStoreState>((set, get) => ({
  resume: INITIAL_RESUME_STATE,
  isDirty: false,
  saveStatus: 'idle',
  lastSavedAt: null,
  activeSection: 'personalInfo',
  activeResumeContext: null,
  isTailorModeActive: false,

  setActiveSection: (section) => set({ activeSection: section }),
  setActiveResumeContext: (ctx) => set({ activeResumeContext: ctx }),
  setTailorModeActive: (active) => set({ isTailorModeActive: active }),

  updateTitle: (title) =>
    set((state) => ({
      resume: { ...state.resume, title },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  updateTemplateId: (templateId) =>
    set((state) => ({
      resume: { ...state.resume, templateId },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  updatePersonalInfo: (info) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          personalInfo: { ...state.resume.content.personalInfo, ...info },
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  updateSummary: (summary) =>
    set((state) => {
      const summaryText = ResumeNormalizationService.cleanWhitespace(summary);
      return {
        resume: {
          ...state.resume,
          content: { ...state.resume.content, summary: summaryText },
        },
        isDirty: true,
        saveStatus: 'unsaved',
      };
    }),

  addExperience: (experience) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          experiences: [
            ...state.resume.content.experiences,
            {
              ...experience,
              highlights: (experience.highlights || []).map((h) =>
                typeof h === 'string' ? h : ResumeNormalizationService.cleanWhitespace(h)
              ),
            },
          ],
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  updateExperience: (id, experience) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          experiences: state.resume.content.experiences.map((exp) => {
            if (exp.id !== id) return exp;
            const updated = { ...exp, ...experience };
            if (updated.highlights) {
              updated.highlights = updated.highlights.map((h) =>
                typeof h === 'string' ? h : ResumeNormalizationService.cleanWhitespace(h)
              );
            }
            return updated;
          }),
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  removeExperience: (id) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          experiences: state.resume.content.experiences.filter((exp) => exp.id !== id),
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  reorderExperiences: (experiences) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: { ...state.resume.content, experiences },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  addEducation: (education) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          educations: [...state.resume.content.educations, education],
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  updateEducation: (id, education) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          educations: state.resume.content.educations.map((edu) =>
            edu.id === id ? { ...edu, ...education } : edu
          ),
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  removeEducation: (id) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          educations: state.resume.content.educations.filter((edu) => edu.id !== id),
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  reorderEducations: (educations) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          educations,
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  addProject: (project) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          projects: [
            ...state.resume.content.projects,
            {
              ...project,
              highlights: (project.highlights || []).map((h) =>
                typeof h === 'string' ? h : ResumeNormalizationService.cleanWhitespace(h)
              ),
            },
          ],
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  updateProject: (id, project) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          projects: state.resume.content.projects.map((proj) => {
            if (proj.id !== id) return proj;
            const updated = { ...proj, ...project };
            if (updated.highlights) {
              updated.highlights = updated.highlights.map((h) =>
                typeof h === 'string' ? h : ResumeNormalizationService.cleanWhitespace(h)
              );
            }
            return updated;
          }),
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  removeProject: (id) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          projects: state.resume.content.projects.filter((proj) => proj.id !== id),
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  reorderProjects: (projects) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          projects,
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  addSkill: (skill) =>
    set((state) => {
      const existing = state.resume.content.skills || [];
      const skillName = (typeof skill === 'string' ? skill : skill.name || '').trim();
      if (!skillName) return state;

      const isDuplicate = existing.some(
        (s) => (typeof s === 'string' ? s : s.name || '').trim().toLowerCase() === skillName.toLowerCase()
      );
      if (isDuplicate) return state;

      const newSkill: ISkill = typeof skill === 'string'
        ? { id: `skill-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`, name: skillName, category: 'Technical Skills', level: 5 }
        : { ...skill, name: skillName };

      return {
        resume: {
          ...state.resume,
          content: {
            ...state.resume.content,
            skills: [...existing, newSkill],
          },
        },
        isDirty: true,
        saveStatus: 'unsaved',
      };
    }),

  updateSkill: (id, skill) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          skills: state.resume.content.skills.map((s) => (s.id === id ? { ...s, ...skill } : s)),
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  removeSkill: (id) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          skills: state.resume.content.skills.filter((s) => s.id !== id),
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  addCertificate: (certificate) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          certificates: [...state.resume.content.certificates, certificate],
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  updateCertificate: (id, certificate) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          certificates: state.resume.content.certificates.map((c) =>
            c.id === id ? { ...c, ...certificate } : c
          ),
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  removeCertificate: (id) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          certificates: state.resume.content.certificates.filter((c) => c.id !== id),
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  reorderCertificates: (certificates) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          certificates,
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  addLanguage: (language) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          languages: [...state.resume.content.languages, language],
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  updateLanguage: (id, language) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          languages: state.resume.content.languages.map((l) =>
            l.id === id ? { ...l, ...language } : l
          ),
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  removeLanguage: (id) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          languages: state.resume.content.languages.filter((l) => l.id !== id),
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  reorderLanguages: (languages) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          languages,
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  // Custom Section Actions
  addCustomSection: (section) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          customSections: [...(state.resume.content.customSections || []), section],
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  updateCustomSection: (id, section) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          customSections: (state.resume.content.customSections || []).map((s) =>
            s.id === id ? { ...s, ...section } : s
          ),
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  removeCustomSection: (id) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          customSections: (state.resume.content.customSections || []).filter((s) => s.id !== id),
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  addCustomSectionItem: (sectionId, item) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          customSections: (state.resume.content.customSections || []).map((s) => {
            if (s.id !== sectionId) return s;
            const newItem: ICustomSectionItem = {
              id: `item-${Date.now()}`,
              title: '',
              subtitle: '',
              date: '',
              description: '',
              ...item,
            };
            return { ...s, items: [...(s.items || []), newItem] };
          }),
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  updateCustomSectionItem: (sectionId, itemId, item) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          customSections: (state.resume.content.customSections || []).map((s) => {
            if (s.id !== sectionId) return s;
            return {
              ...s,
              items: (s.items || []).map((it) => (it.id === itemId ? { ...it, ...item } : it)),
            };
          }),
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  removeCustomSectionItem: (sectionId, itemId) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          customSections: (state.resume.content.customSections || []).map((s) => {
            if (s.id !== sectionId) return s;
            return {
              ...s,
              items: (s.items || []).filter((it) => it.id !== itemId),
            };
          }),
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  addSocialLink: (socialLink) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          socialLinks: [...state.resume.content.socialLinks, socialLink],
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  updateSocialLink: (id, socialLink) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          socialLinks: state.resume.content.socialLinks.map((s) =>
            s.id === id ? { ...s, ...socialLink } : s
          ),
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  removeSocialLink: (id) =>
    set((state) => ({
      resume: {
        ...state.resume,
        content: {
          ...state.resume.content,
          socialLinks: state.resume.content.socialLinks.filter((s) => s.id !== id),
        },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  updateSettings: (settings) =>
    set((state) => ({
      resume: {
        ...state.resume,
        settings: { ...state.resume.settings, ...settings },
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  updateAtsScore: (atsScore: number) =>
    set((state) => ({
      resume: {
        ...state.resume,
        atsScore,
      },
      isDirty: true,
      saveStatus: 'unsaved',
    })),

  setResume: (resume) => {
    const normalizedContent = ResumeNormalizationService.normalize(resume.content);
    const cleanedResume = { ...resume, content: normalizedContent };
    set({
      resume: cleanedResume,
      isDirty: false,
      saveStatus: 'saved',
    });
  },

  syncFromProfile: async (profileData?: ProfileData) => {
    try {
      let profile = profileData;
      if (!profile) {
        profile = await ProfileService.getProfile();
      }
      if (profile) {
        const { resume } = get();
        const updatedContent = mapProfileToResumeContent(profile, resume.content);
        const normalized = ResumeNormalizationService.normalize(updatedContent);
        set({
          resume: { ...resume, content: normalized },
          isDirty: true,
          saveStatus: 'unsaved',
        });
      }
    } catch (err) {
      console.warn('Failed to sync from profile:', err);
    }
  },

  syncToProfile: async () => {
    try {
      const { resume } = get();
      const profileData = mapResumeToProfileData(resume);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_profile_data', JSON.stringify(profileData));
      }
      await ProfileService.updateProfile(profileData);
    } catch (err) {
      console.warn('Failed to sync to profile:', err);
    }
  },

  saveResume: async () => {
    const { resume } = get();
    set({ saveStatus: 'saving' });
    try {
      const provider = StorageProviderFactory.getProvider();
      const savedResume = await provider.save(resume);

      // Mirror fresh resume content into local profile cache for immediate reactivity
      try {
        const mappedProfile = mapResumeToProfileData(savedResume);
        if (typeof window !== 'undefined') {
          localStorage.setItem('user_profile_data', JSON.stringify(mappedProfile));
        }
      } catch {
        // non-fatal
      }

      set({
        resume: savedResume,
        isDirty: false,
        saveStatus: 'saved',
        lastSavedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    } catch (error) {
      console.error('Failed to save resume:', error);
      set({ saveStatus: 'error' });
    }
  },

  loadResume: async (id) => {
    set({ saveStatus: 'saving' });
    try {
      const provider = StorageProviderFactory.getProvider();
      const loaded = await provider.load(id);

      if (loaded) {
        const normalizedContent = ResumeNormalizationService.normalize(loaded.content);
        // Mirror loaded resume content into local profile cache
        try {
          const mappedProfile = mapResumeToProfileData({ ...loaded, content: normalizedContent });
          if (typeof window !== 'undefined') {
            localStorage.setItem('user_profile_data', JSON.stringify(mappedProfile));
          }
        } catch {
          // non-fatal
        }

        set({
          resume: { ...loaded, content: normalizedContent },
          isDirty: false,
          saveStatus: 'saved',
        });
      } else {
        set({ saveStatus: 'idle' });
      }
    } catch (error) {
      console.error('Failed to load resume:', error);
      set({ saveStatus: 'error' });
    }
  },

  resetToDefault: () =>
    set({
      resume: INITIAL_RESUME_STATE,
      isDirty: false,
      saveStatus: 'idle',
      lastSavedAt: null,
    }),

  resetToBlank: () =>
    set({
      resume: BLANK_RESUME_STATE,
      isDirty: false,
      saveStatus: 'idle',
      lastSavedAt: null,
    }),
}));

