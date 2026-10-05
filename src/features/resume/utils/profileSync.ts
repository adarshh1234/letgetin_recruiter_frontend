import { IResume, IResumeContent, ISkill, IEducation, IExperience } from '../types';
import { ProfileData, EducationItem, ExperienceItem } from '@/features/profile/services/profileService';

/**
 * Maps a User Profile into Resume Content structure
 */
export function mapProfileToResumeContent(
  profile: ProfileData,
  currentContent?: Partial<IResumeContent>
): IResumeContent {
  const fullName =
    `${profile.personal?.firstName || ''} ${profile.personal?.lastName || ''}`.trim() ||
    profile.contact?.fullName ||
    '';
  const location = [profile.contact?.city, profile.contact?.country].filter(Boolean).join(', ');

  const skills: ISkill[] = (profile.skills || []).map((name, idx) => ({
    id: `skill-${idx + 1}`,
    name,
    category: 'Technical',
    level: 4,
  }));

  const educations: IEducation[] = (profile.educationsList || []).map((edu, idx) => ({
    id: edu.id || `edu-${idx + 1}`,
    institution: edu.institution || '',
    degree: edu.degree || '',
    fieldOfStudy: edu.degree || '',
    startDate: edu.startYear || '',
    endDate: edu.endYear || '',
    isCurrent: edu.endYear?.toLowerCase() === 'present',
  }));

  const experiences: IExperience[] = (profile.experiencesList || []).map((exp, idx) => ({
    id: exp.id || `exp-${idx + 1}`,
    company: exp.company || '',
    position: exp.title || '',
    startDate: exp.start || '',
    endDate: exp.end || 'Present',
    isCurrent: exp.end?.toLowerCase() === 'present',
    highlights:
      typeof exp.highlights === 'string'
        ? exp.highlights.split('\n').filter(Boolean)
        : Array.isArray(exp.highlights)
        ? exp.highlights
        : [],
  }));

  const preferredEmail =
    profile.contact?.resumeEmail ||
    profile.contact?.alternateEmail ||
    profile.contact?.email ||
    currentContent?.personalInfo?.email ||
    '';

  return {
    personalInfo: {
      fullName: fullName || currentContent?.personalInfo?.fullName || '',
      headline: profile.personal?.headline || currentContent?.personalInfo?.headline || '',
      email: preferredEmail,
      phone: profile.contact?.phone || currentContent?.personalInfo?.phone || '',
      location: location || currentContent?.personalInfo?.location || '',
      websiteUrl: profile.contact?.linkedin || currentContent?.personalInfo?.websiteUrl || '',
      avatarUrl: currentContent?.personalInfo?.avatarUrl || '',
    },
    summary: profile.personal?.bio || currentContent?.summary || '',
    experiences: experiences.length > 0 ? experiences : currentContent?.experiences || [],
    educations: educations.length > 0 ? educations : currentContent?.educations || [],
    projects: currentContent?.projects || [],
    skills: skills.length > 0 ? skills : currentContent?.skills || [],
    certificates: currentContent?.certificates || [],
    languages: currentContent?.languages || [],
    references: currentContent?.references || [],
    socialLinks:
      currentContent?.socialLinks && currentContent.socialLinks.length > 0
        ? currentContent.socialLinks
        : profile.contact?.linkedin
        ? [{ id: 'soc-1', platform: 'LinkedIn', url: profile.contact.linkedin }]
        : [],
  };
}

/**
 * Maps Resume Content into User Profile Data structure
 * Keeps primary login email intact while saving any resume-specific email to alternateEmail / resumeEmail
 */
export function mapResumeToProfileData(
  resume: IResume,
  currentProfile?: Partial<ProfileData>
): ProfileData {
  const content = resume.content || ({} as IResumeContent);
  const personalInfo = content.personalInfo || { fullName: '', headline: '', email: '', phone: '', location: '' };
  const fullName = (personalInfo.fullName || '').trim();
  const nameParts = fullName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  const skills = (content.skills || [])
    .map((s) => (typeof s === 'string' ? s : s?.name))
    .filter(Boolean);

  const educationsList: EducationItem[] = (content.educations || []).map((edu, idx) => ({
    id: edu.id || `edu-${idx + 1}`,
    institution: edu.institution || '',
    degree: edu.degree || edu.fieldOfStudy || '',
    startYear: edu.startDate || '',
    endYear: edu.endDate || '',
    certificateUrl: '',
  }));

  const experiencesList: ExperienceItem[] = (content.experiences || []).map((exp, idx) => ({
    id: exp.id || `exp-${idx + 1}`,
    company: exp.company || '',
    title: exp.position || '',
    start: exp.startDate || '',
    end: exp.endDate || 'Present',
    highlights: Array.isArray(exp.highlights)
      ? exp.highlights.join('\n')
      : String(exp.highlights || ''),
  }));

  // Preserve primary account email, and if resume email differs, store in resumeEmail & alternateEmail
  const primaryAccountEmail = currentProfile?.contact?.email || '';
  const resumeSpecificEmail = personalInfo.email?.trim() || '';
  const alternateEmail =
    resumeSpecificEmail && resumeSpecificEmail !== primaryAccountEmail
      ? resumeSpecificEmail
      : currentProfile?.contact?.alternateEmail || currentProfile?.contact?.resumeEmail || '';

  return {
    track: currentProfile?.track || 'experienced',
    mode: currentProfile?.mode || 'resume',
    resumeName: resume.title || currentProfile?.resumeName || null,
    videoName: currentProfile?.videoName || null,
    contact: {
      fullName,
      phone: personalInfo.phone || currentProfile?.contact?.phone || '',
      city: personalInfo.location || currentProfile?.contact?.city || '',
      country: currentProfile?.contact?.country || 'India',
      linkedin: personalInfo.websiteUrl || currentProfile?.contact?.linkedin || '',
      email: primaryAccountEmail || (resumeSpecificEmail && !alternateEmail ? resumeSpecificEmail : ''),
      alternateEmail: alternateEmail,
      resumeEmail: resumeSpecificEmail,
      streetAddress: currentProfile?.contact?.streetAddress || '',
      state: currentProfile?.contact?.state || '',
      postalCode: currentProfile?.contact?.postalCode || '',
    },
    personal: {
      firstName,
      lastName,
      headline: personalInfo.headline || currentProfile?.personal?.headline || '',
      dob: currentProfile?.personal?.dob || '',
      bio: content.summary || currentProfile?.personal?.bio || '',
    },
    education: educationsList[0] || {
      institution: '',
      degree: '',
      startYear: '',
      endYear: '',
      certificateUrl: '',
    },
    educationsList,
    experience: experiencesList[0] || {
      company: '',
      title: '',
      start: '',
      end: '',
      highlights: '',
    },
    experiencesList,
    skills,
  };
}
