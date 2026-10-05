import { AiApplyPreferences } from '../types';

export interface StepDefinition {
  key: string;
  title: string;
  isValid: (prefs: AiApplyPreferences) => boolean;
}

function isYesNoDescribeAnswered(v: { value: 'yes' | 'no' | null; description?: string }): boolean {
  if (!v.value) return false;
  if (v.value === 'yes') return Boolean(v.description && v.description.trim().length > 0);
  return true;
}

export const STEPS: StepDefinition[] = [
  {
    key: 'status',
    title: 'Current Status',
    isValid: (p) => Boolean(p.currentStatus),
  },
  {
    key: 'jobTitle',
    title: 'Desired Job Title',
    isValid: (p) => p.desiredJobTitles.length >= 1,
  },
  {
    key: 'resumeCoverLetter',
    title: 'Resume & Cover Letter',
    isValid: (p) => Boolean(p.resumeId),
  },
  {
    key: 'priorities',
    title: 'Your Priorities',
    isValid: (p) =>
      typeof p.salaryMin === 'number' &&
      typeof p.salaryMax === 'number' &&
      Boolean(p.preferredCountry && p.preferredCountry.trim().length > 0) &&
      Boolean(p.willingToRelocate) &&
      p.industries.length >= 1 &&
      Boolean(p.employmentType) &&
      Boolean(p.joiningDate),
  },
  {
    key: 'personalPriorities',
    title: 'Your Personal Priorities',
    isValid: (p) =>
      isYesNoDescribeAnswered(p.hasDisabilityOrChronicCondition) &&
      isYesNoDescribeAnswered(p.hasMedicalConditionNeedsAttention) &&
      Boolean(p.okWithShiftJobs) &&
      isYesNoDescribeAnswered(p.hasAllergies),
  },
  {
    key: 'communication',
    title: 'Communication Preference',
    isValid: (p) => p.contactChannels.length >= 1 && Boolean(p.contactTiming),
  },
  {
    key: 'matchedJobs',
    title: 'Matched Jobs & Auto-Apply',
    isValid: (p) => Boolean(p.resumeId && p.desiredJobTitles.length >= 1),
  },
];

export const TOTAL_STEPS = STEPS.length;
