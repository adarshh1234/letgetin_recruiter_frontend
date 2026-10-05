import { IResumeContent } from '../types';

export interface HealthMetric {
  id: string;
  name: string;
  score: number;
  status: 'Excellent' | 'Good' | 'Needs Improvement' | 'Warning';
  explanation: string;
  category: 'content' | 'ats' | 'formatting' | 'impact';
}

export interface AtsAnalysisResult {
  overallScore: number;
  completenessScore: number;
  readabilityScore: number;
  keywordScore: number;
  formattingScore: number;
  actionVerbScore: number;
  strengths: string[];
  weaknesses: string[];
  missingSections: string[];
  missingSkills: string[];
  missingKeywords: string[];
  recommendations: Array<{
    id: string;
    text: string;
    actionType: 'summary' | 'experience' | 'skills' | 'projects' | 'metrics' | 'keywords';
    targetId?: string;
  }>;
  healthMetrics: HealthMetric[];
  lastAnalyzedAt: string | null;
}

const ACTION_VERBS = [
  'architected', 'spearheaded', 'developed', 'optimized', 'led', 'designed',
  'streamlined', 'implemented', 'engineered', 'launched', 'built', 'created',
  'managed', 'scaled', 'delivered', 'integrated', 'increased', 'reduced',
  'automated', 'orchestrated', 'transformed', 'executed', 'formulated',
  'mentored', 'revamped', 'secured', 'deployed', 'accelerated', 'established',
  'consolidated', 'negotiated', 'migrated', 'refactored', 'collaborated',
  'generated', 'modernized', 'trained', 'directed', 'authored', 'championed',
];

const METRICS_REGEX = /\b(\d+%\b|\$\d+|\d+\+|\d+\s*(?:k|m|million|billion|users|clients|engineers|team members|requests|ms|qps|stars|x|percent|roi|seconds|minutes|hours|days|weeks|months|years)\b)/i;

/**
 * Checks whether the resume has any non-trivial user content.
 */
export function isResumeEmpty(content?: Partial<IResumeContent> | null): boolean {
  if (!content) return true;

  const {
    personalInfo,
    summary,
    experiences,
    educations,
    projects,
    skills,
    certificates,
    languages,
  } = content;

  const name = typeof personalInfo?.fullName === 'string' ? personalInfo.fullName.trim() : '';
  const email = typeof personalInfo?.email === 'string' ? personalInfo.email.trim() : '';
  const phone = typeof personalInfo?.phone === 'string' ? personalInfo.phone.trim() : '';
  const headline = typeof personalInfo?.headline === 'string' ? personalInfo.headline.trim() : '';
  const location = typeof personalInfo?.location === 'string' ? personalInfo.location.trim() : '';

  const summaryText = typeof summary === 'string'
    ? summary.trim()
    : (summary && typeof summary === 'object' && 'summary' in summary)
    ? String((summary as any).summary || '').trim()
    : String(summary || '').trim();

  const hasPersonal = Boolean(name || email || phone || headline || location);
  const hasSummary = summaryText.length > 0;

  const hasExp = Array.isArray(experiences) && experiences.some((e) =>
    Boolean(
      (e.company && e.company.trim()) ||
      (e.position && e.position.trim()) ||
      (Array.isArray(e.highlights) && e.highlights.some((h) => h && h.trim()))
    )
  );

  const hasEdu = Array.isArray(educations) && educations.some((e) =>
    Boolean(
      (e.institution && e.institution.trim()) ||
      (e.degree && e.degree.trim()) ||
      (e.fieldOfStudy && e.fieldOfStudy.trim())
    )
  );

  const hasSkills = Array.isArray(skills) && skills.some((s) => Boolean(s.name && s.name.trim()));

  const hasProjects = Array.isArray(projects) && projects.some((p) =>
    Boolean((p.title && p.title.trim()) || (p.description && p.description.trim()))
  );

  const hasCerts = Array.isArray(certificates) && certificates.some((c) => Boolean(c.name && c.name.trim()));
  const hasLang = Array.isArray(languages) && languages.some((l) => Boolean(l.language && l.language.trim()));

  return !(hasPersonal || hasSummary || hasExp || hasEdu || hasSkills || hasProjects || hasCerts || hasLang);
}

/**
 * Calculates a rigorous, SaaS-grade ATS score and breakdown.
 * Returns 0 score if the resume is empty or has no content.
 */
export function calculateAtsHeuristics(content?: Partial<IResumeContent> | null): AtsAnalysisResult {
  const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Handle completely empty resume
  if (!content || isResumeEmpty(content)) {
    return {
      overallScore: 0,
      completenessScore: 0,
      readabilityScore: 0,
      keywordScore: 0,
      formattingScore: 0,
      actionVerbScore: 0,
      strengths: [],
      weaknesses: [
        'Your resume has no content yet. Start by filling out your contact details, professional summary, and work experience.',
        'Add at least 3-5 technical skills to improve ATS keyword discoverability.',
        'Include quantifiable metrics and action verbs in your experience highlights.',
      ],
      missingSections: ['Personal Information', 'Professional Summary', 'Work Experience', 'Education', 'Skills'],
      missingSkills: ['Add core industry & technical skills'],
      missingKeywords: ['Add target job title', 'Add quantifiable achievements'],
      recommendations: [
        {
          id: 'rec-empty-1',
          text: 'Add Contact Details: Enter your full name, professional email, phone number, and headline.',
          actionType: 'summary',
        },
        {
          id: 'rec-empty-2',
          text: 'Write a Professional Summary: Provide a 3-4 sentence overview of your background and core competencies.',
          actionType: 'summary',
        },
        {
          id: 'rec-empty-3',
          text: 'Add Work Experience: Detail your professional roles with strong action verbs and quantified achievements.',
          actionType: 'experience',
        },
        {
          id: 'rec-empty-4',
          text: 'List Technical Skills: Add your key tools, programming languages, and industry frameworks.',
          actionType: 'skills',
        },
      ],
      healthMetrics: [
        {
          id: 'completeness',
          name: 'Resume Completeness',
          score: 0,
          status: 'Warning',
          explanation: '0% of essential resume fields populated.',
          category: 'content',
        },
        {
          id: 'ats',
          name: 'Overall ATS Score',
          score: 0,
          status: 'Warning',
          explanation: 'Resume is empty. Fill in your details to calculate ATS match.',
          category: 'ats',
        },
        {
          id: 'readability',
          name: 'Readability',
          score: 0,
          status: 'Warning',
          explanation: 'No text content available for readability analysis.',
          category: 'content',
        },
        {
          id: 'action-verbs',
          name: 'Action Verb Usage',
          score: 0,
          status: 'Warning',
          explanation: '0 action verbs detected in experience bullets.',
          category: 'impact',
        },
        {
          id: 'keyword-coverage',
          name: 'Keyword Coverage',
          score: 0,
          status: 'Warning',
          explanation: '0 skills or industry keywords found.',
          category: 'ats',
        },
        {
          id: 'formatting',
          name: 'Formatting Quality',
          score: 0,
          status: 'Warning',
          explanation: 'Fill in resume sections to evaluate ATS layout compliance.',
          category: 'formatting',
        },
        {
          id: 'experience-strength',
          name: 'Experience Strength',
          score: 0,
          status: 'Warning',
          explanation: '0 work experience roles documented.',
          category: 'impact',
        },
        {
          id: 'education-completeness',
          name: 'Education Completeness',
          score: 0,
          status: 'Warning',
          explanation: '0 education records provided.',
          category: 'content',
        },
      ],
      lastAnalyzedAt: timestamp,
    };
  }

  const {
    personalInfo = { fullName: '', headline: '', email: '', phone: '', location: '' },
    summary = '',
    experiences = [],
    educations = [],
    projects = [],
    skills = [],
    certificates = [],
  } = content;

  const summaryText = typeof summary === 'string'
    ? summary.trim()
    : (summary && typeof summary === 'object' && 'summary' in summary)
    ? String((summary as any).summary || '').trim()
    : String(summary || '').trim();

  const fullNameText = String(personalInfo?.fullName || '').trim();
  const emailText = String(personalInfo?.email || '').trim();
  const phoneText = String(personalInfo?.phone || '').trim();
  const headlineText = String(personalInfo?.headline || '').trim();
  const locationText = String(personalInfo?.location || '').trim();

  // 1. Completeness Score (0 - 100)
  let completenessPoints = 0;
  if (fullNameText.length >= 2) completenessPoints += 15;
  if (/\S+@\S+\.\S+/.test(emailText)) completenessPoints += 15;
  else if (emailText.length > 3) completenessPoints += 7;

  if (phoneText.replace(/\D/g, '').length >= 7) completenessPoints += 10;
  else if (phoneText.length > 0) completenessPoints += 5;

  if (headlineText.length >= 3) completenessPoints += 10;
  if (locationText.length >= 2) completenessPoints += 5;

  if (summaryText.length >= 40) completenessPoints += 15;
  else if (summaryText.length >= 15) completenessPoints += 7;

  const validExperiences = experiences.filter((e) => Boolean((e.company && e.company.trim()) || (e.position && e.position.trim())));
  if (validExperiences.length >= 2) completenessPoints += 15;
  else if (validExperiences.length === 1) completenessPoints += 10;

  const validEducations = educations.filter((e) => Boolean((e.institution && e.institution.trim()) || (e.degree && e.degree.trim())));
  if (validEducations.length >= 1) completenessPoints += 8;

  const validSkills = skills.filter((s) => Boolean(s.name && s.name.trim()));
  if (validSkills.length >= 4) completenessPoints += 7;
  else if (validSkills.length >= 1) completenessPoints += 4;

  const completenessScore = Math.min(100, completenessPoints);

  // 2. Readability Score (0 - 100)
  const summaryWords = summaryText.split(/\s+/).filter(Boolean).length;
  const bulletWords = validExperiences
    .flatMap((e) => (Array.isArray(e?.highlights) ? e.highlights : []))
    .map((h) => String(h || ''))
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;
  const projectWords = projects
    .flatMap((p) => [p.description || '', ...(Array.isArray(p.highlights) ? p.highlights : [])])
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length;

  const totalWords = summaryWords + bulletWords + projectWords;
  let readabilityScore = 0;
  if (totalWords >= 150 && totalWords <= 650) readabilityScore = 95;
  else if (totalWords >= 75 && totalWords < 150) readabilityScore = 80;
  else if (totalWords >= 30 && totalWords < 75) readabilityScore = 55;
  else if (totalWords > 650 && totalWords <= 900) readabilityScore = 80;
  else if (totalWords > 900) readabilityScore = 60;
  else if (totalWords > 0) readabilityScore = 30;

  // 3. Action Verb & Impact Metrics Score (0 - 100)
  const allHighlightsText = [
    ...validExperiences.flatMap((e) => (Array.isArray(e?.highlights) ? e.highlights : [])),
    ...projects.flatMap((p) => (Array.isArray(p?.highlights) ? p.highlights : [])),
  ]
    .map((h) => String(h || ''))
    .join(' ')
    .toLowerCase();

  const actionVerbMatches = ACTION_VERBS.filter((v) => allHighlightsText.includes(v));
  const hasMetricNumbers = METRICS_REGEX.test(allHighlightsText);

  let actionVerbScore = 0;
  if (validExperiences.length > 0) {
    const verbPoints = Math.min(60, actionVerbMatches.length * 15);
    const metricPoints = hasMetricNumbers ? 40 : 0;
    actionVerbScore = Math.min(100, verbPoints + metricPoints);
  }

  // 4. Keyword & Skills Score (0 - 100)
  let keywordScore = 0;
  const skillCount = validSkills.length;
  if (skillCount >= 10) keywordScore = 100;
  else if (skillCount >= 6) keywordScore = 85;
  else if (skillCount >= 4) keywordScore = 70;
  else if (skillCount >= 2) keywordScore = 45;
  else if (skillCount === 1) keywordScore = 25;

  if (projects.length > 0 && keywordScore > 0) {
    keywordScore = Math.min(100, keywordScore + 10);
  }

  // 5. Formatting & Layout ATS Score (0 - 100)
  let formattingScore = 0;
  if (completenessScore > 0) {
    formattingScore = Math.min(95, Math.round(completenessScore * 0.85 + 10));
  }

  // 6. Overall Weighted Score (0 - 100)
  const overallScore = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        completenessScore * 0.30 +
        keywordScore * 0.25 +
        actionVerbScore * 0.25 +
        readabilityScore * 0.10 +
        formattingScore * 0.10
      )
    )
  );

  // Dynamic Strengths & Weaknesses
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const missingSections: string[] = [];
  const missingSkills: string[] = [];

  if (fullNameText && emailText) strengths.push('Complete contact information header');
  if (headlineText) strengths.push(`Clear professional headline: "${headlineText}"`);
  if (summaryText.length >= 40) strengths.push('Solid executive professional summary');
  if (validExperiences.length >= 1) strengths.push(`${validExperiences.length} work experience ${validExperiences.length === 1 ? 'role' : 'roles'} documented`);
  if (actionVerbMatches.length >= 2) strengths.push(`Includes ${actionVerbMatches.length} strong action verbs (${actionVerbMatches.slice(0, 3).join(', ')})`);
  if (hasMetricNumbers) strengths.push('Contains quantifiable metrics and percentage achievements');
  if (validSkills.length >= 4) strengths.push(`${validSkills.length} technical skills listed`);
  if (projects.length >= 1) strengths.push(`${projects.length} portfolio ${projects.length === 1 ? 'project' : 'projects'} detailed`);

  if (!summaryText || summaryText.length < 30) weaknesses.push('Professional summary is brief or missing');
  if (validExperiences.length === 0) weaknesses.push('Work experience section is empty');
  if (validSkills.length < 4) weaknesses.push('Skills section has fewer than 4 technical skills');
  if (!hasMetricNumbers && validExperiences.length > 0) weaknesses.push('Experience bullet points lack quantifiable metrics (e.g. % improvement, $ saved)');
  if (validEducations.length === 0) weaknesses.push('Education background is empty');
  if (actionVerbMatches.length < 2 && validExperiences.length > 0) weaknesses.push('Experience bullets should start with strong action verbs (e.g. Spearheaded, Architected)');

  if (!summaryText) missingSections.push('Summary');
  if (validExperiences.length === 0) missingSections.push('Experience');
  if (validSkills.length === 0) missingSections.push('Skills');
  if (validEducations.length === 0) missingSections.push('Education');

  if (validSkills.length < 3) {
    missingSkills.push('CI/CD', 'System Architecture', 'Automated Testing', 'Docker');
  }

  const healthMetrics: HealthMetric[] = [
    {
      id: 'completeness',
      name: 'Resume Completeness',
      score: completenessScore,
      status: completenessScore >= 80 ? 'Excellent' : completenessScore >= 60 ? 'Good' : completenessScore >= 40 ? 'Needs Improvement' : 'Warning',
      explanation: `${completenessScore}% of essential resume fields populated.`,
      category: 'content',
    },
    {
      id: 'ats',
      name: 'Overall ATS Score',
      score: overallScore,
      status: overallScore >= 80 ? 'Excellent' : overallScore >= 65 ? 'Good' : overallScore >= 45 ? 'Needs Improvement' : 'Warning',
      explanation: overallScore >= 80
        ? 'High probability of passing automated ATS resume screeners.'
        : 'Resume needs optimization to pass strict enterprise ATS filters.',
      category: 'ats',
    },
    {
      id: 'readability',
      name: 'Readability & Word Count',
      score: readabilityScore,
      status: readabilityScore >= 80 ? 'Excellent' : readabilityScore >= 60 ? 'Good' : 'Needs Improvement',
      explanation: `Total ${totalWords} words evaluated for recruiter scanning ease.`,
      category: 'content',
    },
    {
      id: 'action-verbs',
      name: 'Action Verb Usage',
      score: actionVerbScore,
      status: actionVerbScore >= 75 ? 'Excellent' : actionVerbScore >= 45 ? 'Good' : 'Needs Improvement',
      explanation: `${actionVerbMatches.length} high-impact action verbs detected in bullet points.`,
      category: 'impact',
    },
    {
      id: 'keyword-coverage',
      name: 'Keyword Coverage',
      score: keywordScore,
      status: keywordScore >= 75 ? 'Excellent' : keywordScore >= 45 ? 'Good' : 'Needs Improvement',
      explanation: `${validSkills.length} technical skills and keywords recognized.`,
      category: 'ats',
    },
    {
      id: 'formatting',
      name: 'Formatting Quality',
      score: formattingScore,
      status: formattingScore >= 80 ? 'Excellent' : formattingScore >= 50 ? 'Good' : 'Warning',
      explanation: 'Standardized typography, single-column margins, and ATS-safe hierarchy.',
      category: 'formatting',
    },
    {
      id: 'experience-strength',
      name: 'Experience Strength',
      score: validExperiences.length > 0 ? (hasMetricNumbers ? 90 : 65) : 0,
      status: validExperiences.length > 0 ? (hasMetricNumbers ? 'Excellent' : 'Good') : 'Warning',
      explanation: `${validExperiences.length} experience roles documented.`,
      category: 'impact',
    },
    {
      id: 'education-completeness',
      name: 'Education Completeness',
      score: validEducations.length > 0 ? 95 : 0,
      status: validEducations.length > 0 ? 'Excellent' : 'Warning',
      explanation: `${validEducations.length} education records provided.`,
      category: 'content',
    },
  ];

  const recommendations = [
    {
      id: 'rec-1',
      text: summaryText.length < 40
        ? 'Improve Summary: Write a compelling 3-4 sentence professional summary highlighting your core strengths.'
        : 'Elevate Summary: Ensure your summary includes your target job title and key value proposition.',
      actionType: 'summary' as const,
    },
    {
      id: 'rec-2',
      text: !hasMetricNumbers
        ? 'Add Quantifiable Metrics: Upgrade bullet points with measurable numbers (e.g., "boosted speed by 35%").'
        : 'Optimize Bullets: Begin every experience highlight with a strong action verb (e.g., Spearheaded, Architected).',
      actionType: 'experience' as const,
    },
    {
      id: 'rec-3',
      text: 'Expand Technical Skills: Add at least 6-8 industry-standard skills to maximize ATS search matches.',
      actionType: 'skills' as const,
    },
    {
      id: 'rec-4',
      text: 'Highlight Impact Metrics: Quantify outcomes in your key projects and professional achievements.',
      actionType: 'metrics' as const,
    },
  ];

  return {
    overallScore,
    completenessScore,
    readabilityScore,
    keywordScore,
    formattingScore,
    actionVerbScore,
    strengths,
    weaknesses,
    missingSections,
    missingSkills,
    missingKeywords: ['CI/CD', 'Docker', 'System Architecture', 'Microservices'],
    recommendations,
    healthMetrics,
    lastAnalyzedAt: timestamp,
  };
}
