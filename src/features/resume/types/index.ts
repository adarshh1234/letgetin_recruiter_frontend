export interface IPersonalInfo {
  fullName: string;
  headline: string;
  email: string;
  phone: string;
  location: string;
  websiteUrl?: string;
  avatarUrl?: string;
}

export interface IExperience {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  highlights: string[];
}

export interface IEducation {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  gradeScore?: string;
}

export interface IProject {
  id: string;
  title: string;
  subtitle?: string;
  link?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  highlights: string[];
  technologies: string[];
}

export interface ISkill {
  id: string;
  name: string;
  category?: string;
  level: number; // 1-5
}

export interface ICertificate {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string;
}

export interface ILanguage {
  id: string;
  language: string;
  proficiency: 'Native' | 'Fluent' | 'Proficient' | 'Intermediate' | 'Basic';
}

export interface IReference {
  id: string;
  name: string;
  company: string;
  position: string;
  email?: string;
  phone?: string;
}

export interface ISocialLink {
  id: string;
  platform: string;
  url: string;
  label?: string;
  useLabelAsLink?: boolean;
}

export interface ICustomSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  date?: string;
  description?: string;
}

export interface ICustomSection {
  id: string;
  title: string;
  items: ICustomSectionItem[];
}

export interface ITemplateSettings {
  primaryColor: string;
  fontFamily: string;
  fontSize: 'sm' | 'md' | 'lg';
  lineSpacing: 'compact' | 'normal' | 'relaxed';
  sectionOrder: string[];
}

export interface IResumeContent {
  personalInfo: IPersonalInfo;
  summary: string;
  experiences: IExperience[];
  educations: IEducation[];
  projects: IProject[];
  skills: ISkill[];
  certificates: ICertificate[];
  languages: ILanguage[];
  references: IReference[];
  socialLinks: ISocialLink[];
  customSections?: ICustomSection[];
}

export interface IResume {
  id: string;
  userId?: string;
  templateId: string;
  title: string;
  content: IResumeContent;
  settings: ITemplateSettings;
  atsScore?: number;
  isPublic?: boolean;
  starred?: boolean;
  isActive?: boolean;
  shareToken?: string;
  createdAt?: string;
  updatedAt?: string;
}
