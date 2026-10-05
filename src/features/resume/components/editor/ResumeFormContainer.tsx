'use client';

import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { PersonalInfoForm } from './PersonalInfoForm';
import { SummaryForm } from './SummaryForm';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { ProjectsForm } from './ProjectsForm';
import { SkillsForm } from './SkillsForm';
import { CertificatesForm } from './CertificatesForm';
import { LanguagesForm } from './LanguagesForm';
import { LinksForm } from './LinksForm';
import { CustomSectionsForm } from './CustomSectionsForm';
import { TemplateSettingsForm } from './TemplateSettingsForm';
import { AtsAnalysisPanel } from '../ats/AtsAnalysisPanel';
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Wrench,
  Award,
  Languages,
  Link2,
  LayoutGrid,
  Settings,
  ChevronDown,
  ChevronUp,
  Lightbulb,
} from 'lucide-react';

interface AccordionSectionProps {
  id: string;
  title: string;
  icon: React.ElementType;
  tips?: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  id,
  title,
  icon: Icon,
  tips,
  isOpen,
  onToggle,
  children,
}) => {
  const [showTips, setShowTips] = useState(false);

  return (
    <div
      id={`section-${id}`}
      className={`bg-surface border border-border rounded-2xl shadow-xs mb-3 transition-all ${
        isOpen ? 'overflow-visible' : 'overflow-hidden'
      }`}
    >
      {/* Accordion Header */}
      <div
        onClick={onToggle}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50/80 transition-colors select-none rounded-t-2xl"
      >
        <div className="flex items-center gap-2.5">
          <Icon className="w-4 h-4 text-sky-600" />
          <h3 className="text-sm font-bold text-slate-800">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      {/* Accordion Content */}
      {isOpen && (
        <div className="px-4 pb-4 space-y-3 pt-1 border-t border-border/60">
          {/* Tips and Recommendations Sub-accordion */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl overflow-hidden text-xs">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowTips(!showTips);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-slate-600 font-semibold hover:bg-slate-100/70 transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>Tips and Recommendations</span>
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showTips ? 'rotate-180' : ''}`} />
            </button>

            {showTips && (
              <div className="px-3 pb-2.5 pt-1 text-[11px] text-slate-500 space-y-1 bg-white border-t border-slate-200/60 leading-relaxed">
                <p>• {tips || 'Keep details concise, action-oriented, and quantified with measurable achievements.'}</p>
                <p>• Ensure formatting aligns with automated ATS scanning parsers for best rank.</p>
              </div>
            )}
          </div>

          <div>{children}</div>
        </div>
      )}
    </div>
  );
};

export const ResumeFormContainer: React.FC = () => {
  const { activeSection, setActiveSection } = useResumeStore();

  // Keep track of which accordion sections are open
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personalInfo: true,
    summary: true,
    experiences: true,
    educations: true,
    projects: false,
    skills: false,
    certificates: false,
    languages: false,
    links: false,
    customSections: false,
    settings: false,
  });

  const toggleSection = (secId: string) => {
    setActiveSection(secId);
    setOpenSections((prev) => ({
      ...prev,
      [secId]: !prev[secId],
    }));
  };

  if (activeSection === 'ats') {
    return <AtsAnalysisPanel isEmbedded={true} />;
  }

  return (
    <div className="space-y-3 pb-8">
      {/* 1. Personal Information */}
      <AccordionSection
        id="personalInfo"
        title="Personal Information"
        icon={User}
        tips="Include clear contact information, your job title, professional email, phone number, and LinkedIn/portfolio links."
        isOpen={openSections.personalInfo}
        onToggle={() => toggleSection('personalInfo')}
      >
        <PersonalInfoForm />
      </AccordionSection>

      {/* 2. Professional Summary */}
      <AccordionSection
        id="summary"
        title="Professional Summary"
        icon={FileText}
        tips="Provide a 3-4 sentence elevator pitch highlighting key skills, total years of experience, and top technical achievements."
        isOpen={openSections.summary}
        onToggle={() => toggleSection('summary')}
      >
        <SummaryForm />
      </AccordionSection>

      {/* 3. Work Experience */}
      <AccordionSection
        id="experiences"
        title="Work Experience"
        icon={Briefcase}
        tips="Use strong action verbs (e.g., Spearheaded, Architected, Reduced) and quantify achievements with percentages, ROI, or user counts."
        isOpen={openSections.experiences}
        onToggle={() => toggleSection('experiences')}
      >
        <ExperienceForm />
      </AccordionSection>

      {/* 4. Education */}
      <AccordionSection
        id="educations"
        title="Education"
        icon={GraduationCap}
        tips="List degree title, university name, graduation year, and relevant academic distinctions or honors."
        isOpen={openSections.educations}
        onToggle={() => toggleSection('educations')}
      >
        <EducationForm />
      </AccordionSection>

      {/* 5. Projects */}
      <AccordionSection
        id="projects"
        title="Projects"
        icon={FolderGit2}
        tips="Showcase technical projects demonstrating your core skills, live URLs, repository links, and impact."
        isOpen={openSections.projects}
        onToggle={() => toggleSection('projects')}
      >
        <ProjectsForm />
      </AccordionSection>

      {/* 6. Skills */}
      <AccordionSection
        id="skills"
        title="Skills"
        icon={Wrench}
        tips="Group technical tools, programming languages, frameworks, and methodologies to boost ATS keyword matching."
        isOpen={openSections.skills}
        onToggle={() => toggleSection('skills')}
      >
        <SkillsForm />
      </AccordionSection>

      {/* 7. Certificates */}
      <AccordionSection
        id="certificates"
        title="Certificates"
        icon={Award}
        tips="Add official certifications, license numbers, and issuing organizations (AWS, Google, PMP, etc.)."
        isOpen={openSections.certificates}
        onToggle={() => toggleSection('certificates')}
      >
        <CertificatesForm />
      </AccordionSection>

      {/* 8. Languages */}
      <AccordionSection
        id="languages"
        title="Languages"
        icon={Languages}
        tips="List spoken languages and proficiency levels (Native, Full Professional, Conversational)."
        isOpen={openSections.languages}
        onToggle={() => toggleSection('languages')}
      >
        <LanguagesForm />
      </AccordionSection>

      {/* 9. Websites & Links */}
      <AccordionSection
        id="links"
        title="Links"
        icon={Link2}
        tips="Add links to your portfolio, GitHub, LinkedIn, or personal website. These will open in a new tab when clicked in the resume."
        isOpen={openSections.links}
        onToggle={() => toggleSection('links')}
      >
        <LinksForm />
      </AccordionSection>

      {/* 10. Custom Sections */}
      <AccordionSection
        id="customSections"
        title="Custom Sections"
        icon={LayoutGrid}
        tips="Create your own sections (e.g. Publications, Hobbies, Conferences, Awards, Volunteering). They appear in your resume preview."
        isOpen={openSections.customSections}
        onToggle={() => toggleSection('customSections')}
      >
        <CustomSectionsForm />
      </AccordionSection>

      {/* 11. Template Settings */}
      <AccordionSection
        id="settings"
        title="Template & Styling"
        icon={Settings}
        tips="Customize font sizes, primary theme accent colors, and line spacing parameters."
        isOpen={openSections.settings}
        onToggle={() => toggleSection('settings')}
      >
        <TemplateSettingsForm />
      </AccordionSection>
    </div>
  );
};

