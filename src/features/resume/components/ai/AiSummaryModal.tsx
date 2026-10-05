'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Wand2,
  X,
  Briefcase,
  Code,
  TrendingUp,
  Shuffle,
  ArrowRight,
  Bot,
  FileText,
} from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { useAiCoachStore } from '../../store/useAiCoachStore';

export interface SUMMARY_TEMPLATE_ITEM {
  id: string;
  title: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  templateFormat: string;
}

export const SUMMARY_TEMPLATES: SUMMARY_TEMPLATE_ITEM[] = [
  {
    id: 'technical',
    title: 'Technical Specialist',
    badge: 'Specialized & Hands-on',
    icon: Code,
    description: 'Focuses on deep technical stack expertise, robust API development, latency optimization, and code quality.',
    templateFormat: 'Detail-oriented [Job Title] with [X] years of experience specializing in [Core Skills & Tech Stack]. Proven track record of optimizing application latency, building resilient APIs, and engineering clean, maintainable codebases.',
  },
  {
    id: 'executive',
    title: 'Executive & Leader',
    badge: 'Senior & Lead Roles',
    icon: Briefcase,
    description: 'Emphasizes strategic leadership, system architecture scaling, and cross-functional engineering management.',
    templateFormat: 'Results-driven [Job Title] with [X] years of experience building scalable high-performance systems and leading cross-functional teams. Specialized in [Core Skills], with a track record of driving technical excellence and delivering high-impact initiatives.',
  },
  {
    id: 'impact',
    title: 'Growth & Impact',
    badge: 'Metrics & Performance',
    icon: TrendingUp,
    description: 'Highlights percentage metrics, performance optimizations, rapid product delivery, and business growth.',
    templateFormat: 'Innovative [Job Title] with [X] years of experience focused on delivering high-impact software solutions. Demonstrated success in optimizing system performance by [X]%, streamlining core workflows, and driving business growth through [Key Skills].',
  },
  {
    id: 'versatile',
    title: 'Career Switcher & Versatile',
    badge: 'Adaptable & Agile',
    icon: Shuffle,
    description: 'Emphasizes rapid learning agility, cross-domain problem solving, and versatile technical execution.',
    templateFormat: 'Versatile [Job Title / Professional] with a strong foundation in [Core Competencies], software engineering, and agile execution. Passionate about utilizing [Tech Stack] to deliver elegant, user-centric software solutions.',
  },
];

interface AiSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiSummaryModal: React.FC<AiSummaryModalProps> = ({ isOpen, onClose }) => {
  const { resume, updateSummary } = useResumeStore();
  const { triggerSummaryGenerationAi, setAppliedNotice } = useAiCoachStore();

  const rawHeadline = resume.content.personalInfo?.headline;
  const headline = typeof rawHeadline === 'string'
    ? rawHeadline
    : (rawHeadline && typeof rawHeadline === 'object' && 'headline' in rawHeadline)
    ? String((rawHeadline as any).headline)
    : 'Software Professional';

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('technical');
  const [customContext, setCustomContext] = useState<string>('');

  if (!isOpen) return null;

  const selectedTemplate =
    SUMMARY_TEMPLATES.find((t) => t.id === selectedTemplateId) || SUMMARY_TEMPLATES[0];

  // Send template request to AI Agent in Chat drawer
  const handleSendToAiAgent = () => {
    triggerSummaryGenerationAi({
      templateStyle: selectedTemplate.title,
      customContext: customContext.trim() ? customContext.trim() : undefined,
    });
    onClose();
  };

  // Direct template insertion
  const handleUseRawTemplate = () => {
    const skillsList = (resume.content.skills || [])
      .map((s) => (typeof s === 'string' ? s : s?.name || ''))
      .filter(Boolean)
      .slice(0, 4)
      .join(', ') || 'Software Architecture';

    let text = selectedTemplate.templateFormat
      .replace(/\[Job Title[^\]]*\]/g, headline || 'Software Engineer')
      .replace(/\[Core Skills[^\]]*\]/g, skillsList)
      .replace(/\[Tech Stack[^\]]*\]/g, skillsList)
      .replace(/\[Core Competencies\]/g, skillsList);

    if (customContext.trim()) {
      text += ` ${customContext.trim()}`;
    }

    updateSummary(text);
    setAppliedNotice('Inserted template draft into Professional Summary!');
    setTimeout(() => setAppliedNotice(null), 3000);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          className="relative w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-elegant overflow-hidden my-6 flex flex-col"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border bg-surface-alt/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-brand text-primary-foreground flex items-center justify-center shadow-xs shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-ink flex items-center gap-2">
                  Choose Summary Template for AI Coach
                </h2>
                <p className="text-xs text-ink-soft mt-0.5">
                  Select your preferred style. The AI Coach will analyze your resume context in chat, ask any missing questions, and craft your summary.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-ink-soft hover:text-ink hover:bg-surface-alt rounded-lg transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 space-y-5">
            {/* Step 1: Choose Template */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5 text-primary-glow" />
                Select Summary Template Style
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {SUMMARY_TEMPLATES.map((tmpl) => {
                  const IconComp = tmpl.icon;
                  const isSelected = selectedTemplateId === tmpl.id;
                  return (
                    <button
                      key={tmpl.id}
                      type="button"
                      onClick={() => setSelectedTemplateId(tmpl.id)}
                      className={`text-left p-3.5 rounded-xl border transition-all space-y-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-primary/10 border-primary-glow shadow-xs ring-1 ring-primary-glow'
                          : 'bg-surface border-border hover:border-primary-glow/40 hover:bg-surface-alt'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-ink flex items-center gap-1.5">
                          <IconComp className={`w-4 h-4 ${isSelected ? 'text-primary-glow' : 'text-ink-soft'}`} />
                          {tmpl.title}
                        </span>
                        <span className="text-[9px] font-semibold bg-surface-alt text-ink-soft border border-border px-1.5 py-0.5 rounded">
                          {tmpl.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-ink-soft leading-normal">
                        {tmpl.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Template Preview Snippet */}
            <div className="p-3 bg-surface-alt/60 border border-border rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-primary-glow uppercase tracking-wider block">
                Template Architecture:
              </span>
              <p className="text-xs text-ink-soft italic leading-relaxed">
                &ldquo;{selectedTemplate.templateFormat}&rdquo;
              </p>
            </div>

            {/* Step 2: Custom Instructions / Target Goal (Optional) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-ink flex items-center justify-between">
                <span>Add Extra Context or Target Instructions (Optional)</span>
                <span className="text-[10px] text-ink-soft font-normal">e.g. Target company, special achievements</span>
              </label>
              <textarea
                rows={2}
                value={customContext}
                onChange={(e) => setCustomContext(e.target.value)}
                placeholder="e.g. Highlight 3+ years in fintech and AWS cloud architecture..."
                className="input-base text-xs leading-relaxed resize-y"
              />
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="p-4 border-t border-border bg-surface-alt/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleUseRawTemplate}
              className="w-full sm:w-auto text-xs font-semibold text-ink-soft hover:text-ink px-4 py-2 rounded-xl border border-border hover:bg-surface transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Use Draft Template Directly</span>
            </button>

            <button
              type="button"
              onClick={handleSendToAiAgent}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-brand text-primary-foreground text-xs font-bold rounded-xl transition-all shadow-elegant hover:shadow-glow cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Take Template to AI Chat Agent</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
