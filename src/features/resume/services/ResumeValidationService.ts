import { z } from 'zod';
import { IResumeContent } from '../types';

export const personalInfoSchema = z.object({
  fullName: z.string().default('Candidate Name'),
  headline: z.string().default('Software Professional'),
  email: z.string().default(''),
  phone: z.string().default(''),
  location: z.string().default(''),
  websiteUrl: z.string().default(''),
});

export const experienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().default('Company Name'),
  position: z.string().default('Position Title'),
  location: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default('Present'),
  isCurrent: z.boolean().default(false),
  highlights: z.array(z.string()).default([]),
});

export const educationSchema = z.object({
  id: z.string().optional(),
  institution: z.string().default('University Name'),
  degree: z.string().default('Degree'),
  fieldOfStudy: z.string().default('Field of Study'),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
  isCurrent: z.boolean().default(false),
  gradeScore: z.string().optional(),
});

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().default('Project Title'),
  subtitle: z.string().default(''),
  link: z.string().default(''),
  startDate: z.string().default(''),
  endDate: z.string().default(''),
  description: z.string().default(''),
  highlights: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
});

export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().default('Skill'),
  category: z.string().default('Technical'),
  level: z.number().min(1).max(5).default(4),
});

export const certificateSchema = z.object({
  id: z.string().optional(),
  name: z.string().default('Certificate Name'),
  issuer: z.string().default('Issuer'),
  issueDate: z.string().default(''),
});

export const languageSchema = z.object({
  id: z.string().optional(),
  language: z.string().default('English'),
  proficiency: z.string().default('Native'),
});

export const resumeContentSchema = z.object({
  personalInfo: personalInfoSchema,
  summary: z.string().default(''),
  experiences: z.array(experienceSchema).default([]),
  educations: z.array(educationSchema).default([]),
  projects: z.array(projectSchema).default([]),
  skills: z.array(skillSchema).default([]),
  certificates: z.array(certificateSchema).default([]),
  languages: z.array(languageSchema).default([]),
  references: z.array(z.any()).default([]),
  socialLinks: z.array(z.any()).default([]),
});

export class ResumeValidationService {
  static validate(rawObj: unknown): IResumeContent {
    if (!rawObj || typeof rawObj !== 'object') {
      throw new Error('Invalid resume payload format.');
    }

    const parseResult = resumeContentSchema.safeParse(rawObj);

    if (parseResult.success) {
      return parseResult.data as IResumeContent;
    }

    // Auto-repair missing fields or arrays
    const obj = rawObj as Record<string, any>;
    return {
      personalInfo: {
        fullName: typeof obj.personalInfo?.fullName === 'string' ? obj.personalInfo.fullName : 'Candidate Name',
        headline: typeof obj.personalInfo?.headline === 'string' ? obj.personalInfo.headline : 'Professional',
        email: typeof obj.personalInfo?.email === 'string' ? obj.personalInfo.email : '',
        phone: typeof obj.personalInfo?.phone === 'string' ? obj.personalInfo.phone : '',
        location: typeof obj.personalInfo?.location === 'string' ? obj.personalInfo.location : '',
        websiteUrl: typeof obj.personalInfo?.websiteUrl === 'string' ? obj.personalInfo.websiteUrl : '',
      },
      summary: typeof obj.summary === 'string' ? obj.summary : '',
      experiences: Array.isArray(obj.experiences)
        ? obj.experiences.map((exp: any, i: number) => ({
            id: exp.id || `exp-${i + 1}`,
            company: String(exp.company || 'Company'),
            position: String(exp.position || 'Title'),
            location: String(exp.location || ''),
            startDate: String(exp.startDate || ''),
            endDate: String(exp.endDate || 'Present'),
            isCurrent: Boolean(exp.isCurrent),
            highlights: Array.isArray(exp.highlights) ? exp.highlights.map(String) : [],
          }))
        : [],
      educations: Array.isArray(obj.educations)
        ? obj.educations.map((edu: any, i: number) => ({
            id: edu.id || `edu-${i + 1}`,
            institution: String(edu.institution || 'University'),
            degree: String(edu.degree || 'Degree'),
            fieldOfStudy: String(edu.fieldOfStudy || ''),
            startDate: String(edu.startDate || ''),
            endDate: String(edu.endDate || ''),
            isCurrent: Boolean(edu.isCurrent),
          }))
        : [],
      projects: Array.isArray(obj.projects)
        ? obj.projects.map((proj: any, i: number) => ({
            id: proj.id || `proj-${i + 1}`,
            title: String(proj.title || 'Project'),
            subtitle: String(proj.subtitle || ''),
            link: String(proj.link || ''),
            startDate: String(proj.startDate || ''),
            endDate: String(proj.endDate || ''),
            description: String(proj.description || ''),
            highlights: Array.isArray(proj.highlights) ? proj.highlights.map(String) : [],
            technologies: Array.isArray(proj.technologies) ? proj.technologies.map(String) : [],
          }))
        : [],
      skills: Array.isArray(obj.skills)
        ? obj.skills.map((s: any, i: number) => ({
            id: s.id || `skill-${i + 1}`,
            name: typeof s === 'string' ? s : String(s.name || 'Skill'),
            category: String(s.category || 'Technical'),
            level: typeof s.level === 'number' ? Math.min(5, Math.max(1, s.level)) : 4,
          }))
        : [],
      certificates: Array.isArray(obj.certificates)
        ? obj.certificates.map((c: any, i: number) => ({
            id: c.id || `cert-${i + 1}`,
            name: String(c.name || 'Certificate'),
            issuer: String(c.issuer || ''),
            issueDate: String(c.issueDate || ''),
          }))
        : [],
      languages: Array.isArray(obj.languages)
        ? obj.languages.map((l: any, i: number) => ({
            id: l.id || `lang-${i + 1}`,
            language: String(l.language || 'English'),
            proficiency: (String(l.proficiency || 'Fluent') as any),
          }))
        : [],
      references: [],
      socialLinks: [],
    };
  }
}
