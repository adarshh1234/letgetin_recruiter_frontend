import { IResume } from '@/features/resume/types';
import { BLANK_RESUME_STATE } from '@/features/resume/constants/initialState';
import { mapProfileToResumeContent } from '@/features/resume/utils/profileSync';
import { MongoStorage } from '@/features/resume/storage/mongo';
import { ProfileData } from '@/features/profile/services/profileService';
import { AiApplyResumeOption } from '../types';

/**
 * Creates a new resume prefilled from the candidate's actual profile data and persists it
 * via the same API the resume builder itself uses. Never fabricates content - only maps
 * existing profile fields (experience/education/skills/contact) into resume content shape.
 */
export async function quickCreateResumeFromProfile(profile: ProfileData): Promise<AiApplyResumeOption> {
  const content = mapProfileToResumeContent(profile);
  const draft: IResume = {
    id: '',
    title: profile.personal?.headline ? `${profile.personal.headline} Resume` : 'My Resume',
    templateId: 'modern-sleek',
    content,
    settings: BLANK_RESUME_STATE.settings,
  };

  const saved = await new MongoStorage().save(draft);

  return {
    id: saved.id,
    title: saved.title,
    headline: saved.content?.personalInfo?.headline,
    templateId: saved.templateId,
    atsScore: saved.atsScore,
    updatedAt: saved.updatedAt,
  };
}
