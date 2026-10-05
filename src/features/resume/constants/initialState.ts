import { IResume } from '../types';

export const INITIAL_RESUME_STATE: IResume = {
  id: '',
  title: 'Software Engineer Resume',
  templateId: 'modern-sleek',
  content: {
    personalInfo: {
      fullName: 'Alex Rivera',
      headline: 'Senior Full Stack Engineer',
      email: 'alex.rivera@example.com',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      websiteUrl: 'https://alexrivera.dev',
    },
    summary:
      'Passionate Senior Full Stack Engineer with 6+ years of experience crafting high-performance, responsive web applications. Specialized in TypeScript, React, Next.js, and Node.js microservices. Proven track record of scaling user-facing applications to millions of monthly active users while delivering exceptional UI/UX.',
    experiences: [
      {
        id: 'exp-1',
        company: 'Vercel',
        position: 'Senior Frontend Engineer',
        location: 'San Francisco, CA',
        startDate: '2022-03',
        endDate: 'Present',
        isCurrent: true,
        highlights: [
          'Spearheaded the development of Next.js App Router developer experience tools, reducing page transition latency by 35%.',
          'Architected reusable component design system adopted across 15+ engineering teams.',
          'Mentored 6 junior and mid-level engineers through code reviews and bi-weekly architecture workshops.',
        ],
      },
      {
        id: 'exp-2',
        company: 'Stripe',
        position: 'Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2019-06',
        endDate: '2022-02',
        isCurrent: false,
        highlights: [
          'Engineered real-time billing analytics dashboard used by over 50,000 active Stripe Merchant accounts.',
          'Optimized database query performance for high-throughput payment event streams.',
        ],
      },
    ],
    educations: [
      {
        id: 'edu-1',
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        fieldOfStudy: 'Computer Science & Engineering',
        startDate: '2015-08',
        endDate: '2019-05',
        isCurrent: false,
        gradeScore: '3.9 GPA',
      },
    ],
    projects: [
      {
        id: 'proj-1',
        title: 'ResumeBuildai Engine',
        subtitle: 'AI-Powered Resume Builder & Template Compiler',
        link: 'https://github.com/example/resumebuildai',
        startDate: '2023-01',
        endDate: 'Present',
        technologies: ['Next.js', 'React', 'TypeScript', 'Zustand', 'MongoDB'],
        highlights: [
          'Implemented zero-latency live preview canvas using Zustand state synchronization.',
          'Integrated Gemini AI for real-time bullet point rewriting and ATS optimization.',
        ],
      },
    ],
    skills: [
      { id: 'skill-1', name: 'TypeScript', category: 'Languages', level: 5 },
      { id: 'skill-2', name: 'React 19 & Next.js 15', category: 'Frontend', level: 5 },
      { id: 'skill-3', name: 'Node.js & Express', category: 'Backend', level: 4 },
      { id: 'skill-4', name: 'MongoDB & PostgreSQL', category: 'Databases', level: 4 },
      { id: 'skill-5', name: 'TailwindCSS & Shadcn UI', category: 'Frontend', level: 5 },
    ],
    certificates: [
      {
        id: 'cert-1',
        name: 'AWS Certified Solutions Architect - Associate',
        issuer: 'Amazon Web Services',
        issueDate: '2023-04',
      },
    ],
    languages: [
      { id: 'lang-1', language: 'English', proficiency: 'Native' },
      { id: 'lang-2', language: 'Spanish', proficiency: 'Fluent' },
    ],
    references: [],
    socialLinks: [
      { id: 'soc-1', platform: 'GitHub', url: 'https://github.com/alexrivera' },
      { id: 'soc-2', platform: 'LinkedIn', url: 'https://linkedin.com/in/alexrivera' },
    ],
    customSections: [],
  },
  settings: {
    primaryColor: '#0f172a',
    fontFamily: 'Inter',
    fontSize: 'md',
    lineSpacing: 'normal',
    sectionOrder: ['summary', 'experiences', 'educations', 'projects', 'skills', 'certificates', 'languages'],
  },
};

export const BLANK_RESUME_STATE: IResume = {
  id: '',
  title: 'My Resume',
  templateId: 'modern-sleek',
  content: {
    personalInfo: {
      fullName: '',
      headline: '',
      email: '',
      phone: '',
      location: '',
      websiteUrl: '',
    },
    summary: '',
    experiences: [],
    educations: [],
    projects: [],
    skills: [],
    certificates: [],
    languages: [],
    references: [],
    socialLinks: [],
    customSections: [],
  },
  settings: {
    primaryColor: '#3b82f6',
    fontFamily: 'Inter',
    fontSize: 'md',
    lineSpacing: 'normal',
    sectionOrder: ['personalInfo', 'summary', 'experiences', 'educations', 'projects', 'skills'],
  },
};

