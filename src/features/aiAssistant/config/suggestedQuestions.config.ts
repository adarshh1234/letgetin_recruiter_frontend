import { AssistantContextType, AssistantMode } from '../types';

export const SUGGESTED_QUESTIONS: Record<AssistantContextType, Record<AssistantMode, string[]>> = {
  explore: {
    instant: ['What are my strongest skills?', 'What jobs best match my background?'],
    expert: ['Give me a detailed career summary', 'What skill gaps should I close for senior roles?'],
  },
  profile: {
    instant: ['What skills are listed on my profile?', 'What is my profile completeness?', 'Summarize my work experience'],
    expert: ['How can I optimize my profile for recruiter search?', 'Suggest impactful bullet improvements', 'What certifications should I prioritize?'],
  },
  resume: {
    instant: ['What are the strongest parts of my resume?', 'What key skills are missing?'],
    expert: ['How can I make my resume 90%+ ATS-friendly?', 'Suggest metrics-driven bullet rewrites for my work experience'],
  },
  drive: {
    instant: ['What documents do I have saved?', 'Find credentials related to my experience'],
    expert: ['Summarize my uploaded certifications and files', 'Compare my resume against uploaded job descriptions'],
  },
};

export const CONTEXT_LABELS: Record<AssistantContextType, string> = {
  explore: 'Explore AI',
  profile: 'Profile AI',
  resume: 'Resume AI',
  drive: 'Drive AI',
};

export const CONTEXT_SUBTITLES: Record<AssistantContextType, string> = {
  explore: 'Job market & opportunities copilot',
  profile: 'Career identity & profile coach',
  resume: 'ATS & resume optimization copilot',
  drive: 'Document analysis & files copilot',
};

export const CONTEXT_GREETINGS: Record<AssistantContextType, string> = {
  explore: "Hi! Ask me anything about your matched opportunities, market trends, or recommended skills.",
  profile: "Hi! Ask me anything about your profile completeness, experience phrasing, or skills enhancement.",
  resume: 'Hi! Ask me anything about your active resume, ATS score, bullet phrasing, or tailoring.',
  drive: 'Hi! Ask me about your uploaded documents, certificates, or comparative document insights.',
};

export const CONTEXT_STATUS_BADGES: Record<AssistantContextType, { normal: string; search: string; thinking: string }> = {
  explore: {
    normal: 'Market & jobs indexed',
    search: 'Cross-searched opportunities',
    thinking: 'Deep market reasoning complete',
  },
  profile: {
    normal: 'Profile verified & analyzed',
    search: 'Full profile records searched',
    thinking: 'Deep career assessment complete',
  },
  resume: {
    normal: 'Resume sections analyzed',
    search: 'Cross-referenced resumes & ATS keywords',
    thinking: 'Deep ATS & metric reasoning complete',
  },
  drive: {
    normal: 'Drive files inspected',
    search: 'Deep document search complete',
    thinking: 'Document synthesis reasoning complete',
  },
};

export const CONTEXT_THOUGHT_SUMMARIES: Record<AssistantContextType, { normal: string; search: string; thinking: string }> = {
  explore: {
    normal: 'Synthesized job market benchmarks, candidate background, and skill compatibility factors.',
    search: 'Cross-searched explore listings, job role requirements, and current profile competencies.',
    thinking: 'Executed deep multi-variable reasoning comparing industry seniority, requisite skills, and strategic career moves.',
  },
  profile: {
    normal: 'Evaluated current profile sections, work history completeness, and skill taxonomy.',
    search: 'Deep-indexed profile accomplishments, education milestones, certificates, and portfolio references.',
    thinking: 'Conducted step-by-step career path reasoning, identifying recruiter search optics and high-leverage profile enhancements.',
  },
  resume: {
    normal: 'Analyzed resume layout, action verb density, section hierarchy, and ATS parseability.',
    search: 'Scanned all resume sections against target job criteria, ATS keywords, and measurable impact metrics.',
    thinking: 'Formulated multi-step reasoning: 1) ATS score assessment, 2) quantifiable bullet impact analysis, 3) tailored keyword placement recommendations.',
  },
  drive: {
    normal: 'Read active documents, summaries, and extracted text blocks to provide accurate grounded responses.',
    search: 'Extensively searched across all uploaded document contents, file metadata, and resume archives.',
    thinking: 'Synthesized multi-document evidence, cross-referencing claims and extracting relevant citations.',
  },
};

