// Must stay in sync with the backend's src/modules/ai/config/writingContexts.config.ts

export type AIWritingAction =
  | 'improve'
  | 'rewrite'
  | 'professional'
  | 'expand'
  | 'shorten'
  | 'grammar'
  | 'simplify'
  | 'humanize'
  | 'tone-formal'
  | 'tone-friendly'
  | 'tone-persuasive'
  | 'tone-confident'
  | 'translate-es'
  | 'translate-fr'
  | 'translate-de'
  | 'translate-hi'
  | 'translate-zh'
  | 'translate-ja'
  | 'summarize'
  | 'analyze'
  | 'generate'
  | 'custom'
  | 'ats-optimize'
  | 'quantify-impact'
  | 'personalize'
  | 'suggest-skills';

export type AIWritingContext =
  | 'job-description'
  | 'company-about'
  | 'startup-about'
  | 'institution-about'
  | 'candidate-bio'
  | 'resume-summary'
  | 'resume-experience'
  | 'resume-project'
  | 'cover-letter'
  | 'skills';

export interface AIWritingRequest {
  action: AIWritingAction;
  context: AIWritingContext;
  text?: string;
  instruction?: string;
  metadata?: Record<string, string>;
}
