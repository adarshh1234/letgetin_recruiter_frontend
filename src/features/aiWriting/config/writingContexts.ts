import { AIWritingAction, AIWritingContext } from '../types';

// UI-facing mirror of the backend's writingContexts.config.ts allowed-action lists.
// Keep this list in sync with the backend — it only controls which buttons are shown;
// the backend independently re-validates every action/context pair server-side.

export const ACTION_LABELS: Record<AIWritingAction, string> = {
  improve: 'Improve Writing',
  rewrite: 'Rewrite / Paraphrase',
  professional: 'Make Professional',
  expand: 'Expand Text',
  shorten: 'Shorten Text',
  grammar: 'Fix Grammar & Spelling',
  simplify: 'Simplify Language',
  humanize: 'Humanize Text',
  'tone-formal': 'Tone: Formal',
  'tone-friendly': 'Tone: Friendly',
  'tone-persuasive': 'Tone: Persuasive',
  'tone-confident': 'Tone: Confident',
  'translate-es': 'Translate: Spanish',
  'translate-fr': 'Translate: French',
  'translate-de': 'Translate: German',
  'translate-hi': 'Translate: Hindi',
  'translate-zh': 'Translate: Chinese',
  'translate-ja': 'Translate: Japanese',
  summarize: 'Summarize Text',
  analyze: 'Writing & Tone Analysis',
  generate: 'Generate Text',
  custom: 'Custom Instruction',
  'ats-optimize': 'ATS Optimize',
  'quantify-impact': 'Quantify Impact',
  personalize: 'Personalize',
  'suggest-skills': 'Suggest Skills',
};

const QUILLBOT_FULL_ACTIONS: AIWritingAction[] = [
  'improve',
  'rewrite',
  'professional',
  'grammar',
  'simplify',
  'expand',
  'shorten',
  'humanize',
  'tone-formal',
  'tone-friendly',
  'tone-persuasive',
  'tone-confident',
  'translate-es',
  'translate-fr',
  'translate-de',
  'translate-hi',
  'translate-zh',
  'translate-ja',
  'summarize',
  'analyze',
  'custom',
  'generate',
];

export const CONTEXT_ACTIONS: Record<AIWritingContext, AIWritingAction[]> = {
  'job-description': QUILLBOT_FULL_ACTIONS,
  'company-about': QUILLBOT_FULL_ACTIONS,
  'startup-about': QUILLBOT_FULL_ACTIONS,
  'institution-about': QUILLBOT_FULL_ACTIONS,
  'candidate-bio': QUILLBOT_FULL_ACTIONS,
  'resume-summary': ['improve', 'rewrite', 'ats-optimize', 'professional', 'shorten'],
  'resume-experience': ['improve', 'rewrite', 'quantify-impact', 'ats-optimize'],
  'resume-project': ['improve', 'rewrite', 'expand', 'shorten'],
  'cover-letter': ['generate', 'improve', 'personalize', 'professional', 'shorten'],
  skills: ['suggest-skills'],
};

export const CONTEXT_LABELS: Record<AIWritingContext, string> = {
  'job-description': 'Job Description',
  'company-about': 'About Company',
  'startup-about': 'About Startup',
  'institution-about': 'About Institution',
  'candidate-bio': 'Candidate Bio',
  'resume-summary': 'Resume Summary',
  'resume-experience': 'Resume Experience',
  'resume-project': 'Resume Project',
  'cover-letter': 'Cover Letter',
  skills: 'Skills',
};

export const MAX_TEXT_LENGTH = 6000;
export const MAX_INSTRUCTION_LENGTH = 300;
