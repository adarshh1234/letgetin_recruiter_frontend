export type TailoringSection = "summary" | "experience" | "skills" | "projects";
export type TailoringChangeType = "addition" | "replacement" | "rewrite";
export type TailoringSuggestionStatus = "pending" | "accepted" | "declined" | "edited";

export interface TailoringSuggestion {
  id: string;
  section: TailoringSection;
  itemId?: string;
  changeType: TailoringChangeType;
  originalText: string;
  proposedText: string;
  reason: string;
  relatedKeywords: string[];
  status: TailoringSuggestionStatus;
}

export interface MissingSection {
  section: TailoringSection;
  reason: string;
}

export interface TailoringSession {
  _id: string;
  userId: string;
  sourceResumeId: string;
  jobDescription: string;
  matchScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  missingSkills: string[];
  recommendedImprovements: string[];
  suggestions: TailoringSuggestion[];
  missingSections: MissingSection[];
  status: "active" | "completed";
  createdAt: string;
  updatedAt: string;
}
