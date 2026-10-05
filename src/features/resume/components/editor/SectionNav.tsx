'use client';

import React from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { useAtsAnalysis } from '../../hooks/useAtsAnalysis';
import { User, FileText, Briefcase, GraduationCap, FolderGit2, Wrench, Award, Languages, Settings, ShieldCheck } from 'lucide-react';

export const SECTIONS = [
  { id: 'personalInfo', label: 'Personal Details', shortLabel: 'Personal', icon: User },
  { id: 'summary', label: 'Summary', shortLabel: 'Summary', icon: FileText },
  { id: 'experiences', label: 'Work Experience', shortLabel: 'Experience', icon: Briefcase },
  { id: 'educations', label: 'Education', shortLabel: 'Education', icon: GraduationCap },
  { id: 'projects', label: 'Projects', shortLabel: 'Projects', icon: FolderGit2 },
  { id: 'skills', label: 'Skills & Tech', shortLabel: 'Skills', icon: Wrench },
  { id: 'certificates', label: 'Certificates', shortLabel: 'Certificates', icon: Award },
  { id: 'languages', label: 'Languages', shortLabel: 'Languages', icon: Languages },
  { id: 'settings', label: 'Styling & Font', shortLabel: 'Settings', icon: Settings },
  { id: 'ats', label: 'ATS Score & Advisory', shortLabel: 'ATS Score', icon: ShieldCheck },
];

export const SectionNav: React.FC = () => {
  const { resume, activeSection, setActiveSection } = useResumeStore();
  const { result } = useAtsAnalysis();

  const currentScore = result?.overallScore ?? resume.atsScore ?? 0;

  return (
    <div className="w-full bg-surface/80 backdrop-blur border border-border rounded-2xl p-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar shadow-sm select-none">
      {SECTIONS.map((sec) => {
        const Icon = sec.icon;
        const isActive = activeSection === sec.id;
        return (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
              isActive
                ? 'bg-gradient-brand text-primary-foreground font-bold shadow-elegant'
                : 'text-ink-soft hover:text-ink hover:bg-surface-alt'
            }`}
            title={sec.label}
          >
            <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-primary-foreground' : 'text-ink-soft'}`} />
            <span>{sec.shortLabel}</span>
            {sec.id === 'ats' && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-primary/10 text-primary-glow border border-primary/20'
                }`}
              >
                {currentScore}%
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

