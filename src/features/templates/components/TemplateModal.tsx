'use client';

import React from 'react';
import { useResumeStore } from '../../resume/store/useResumeStore';
import { getTemplateComponent } from '../registry';
import { X, Check, LayoutTemplate, ShieldCheck, Sparkles } from 'lucide-react';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface TemplateDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  atsScore: string;
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'modern-sleek',
    name: 'Modern Sleek',
    category: 'Tech & Product',
    description: 'Two-column layout with vibrant primary accents, perfect for tech roles.',
    atsScore: '96% ATS Score',
  },
  {
    id: 'classic-ats',
    name: 'Classic ATS',
    category: '100% ATS Optimized',
    description: 'Traditional single-column format guaranteed to pass automated ATS screeners.',
    atsScore: '99% ATS Score',
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    category: 'Creative & Design',
    description: 'Monochrome typography-driven design with spacious margins and clean divider lines.',
    atsScore: '94% ATS Score',
  },
  {
    id: 'executive-pro',
    name: 'Executive Pro',
    category: 'Leadership & Senior',
    description: 'Commanding header with bold section blocks built for senior management & directors.',
    atsScore: '97% ATS Score',
  },
];

export const TemplateModal: React.FC<TemplateModalProps> = ({ isOpen, onClose }) => {
  const { resume, updateTemplateId } = useResumeStore();

  if (!isOpen) return null;

  const currentTemplateId = resume.templateId || 'modern-sleek';

  const handleSelect = (id: string) => {
    updateTemplateId(id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-sm animate-fade-up">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-elegant overflow-hidden">
        {/* Small & Clean Modal Header */}
        <div className="p-4 bg-surface border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4 text-primary-glow" />
            <h3 className="text-sm font-bold text-ink">Choose Resume Template</h3>
            <span className="text-[10px] font-medium text-ink-soft bg-surface-alt px-2 py-0.5 rounded-full border border-border">
              Live Preview
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition-colors"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Templates Grid with Actual Live Rendered Cards */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-5 scrollbar-thin scrollbar-thumb-border bg-background/50">
          {TEMPLATES.map((tpl) => {
            const isSelected = currentTemplateId === tpl.id;
            const TemplateComp = getTemplateComponent(tpl.id);

            return (
              <div
                key={tpl.id}
                onClick={() => handleSelect(tpl.id)}
                className={`group relative rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden p-4 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-surface border-primary-glow ring-2 ring-primary-glow/40 shadow-glow'
                    : 'bg-surface border-border hover:border-primary/40 hover:shadow-elegant'
                }`}
              >
                {/* Real Live Rendered Resume Preview Card */}
                <div className="w-full h-56 bg-slate-100 rounded-xl border border-border/80 mb-3 overflow-hidden relative group-hover:scale-[1.01] transition-transform select-none pointer-events-none flex items-start justify-center p-2">
                  {/* Selected Badge Indicator */}
                  {isSelected && (
                    <div className="absolute top-3 right-3 bg-gradient-brand text-primary-foreground text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 z-20 pointer-events-none">
                      <Check className="w-3 h-3" /> Active
                    </div>
                  )}

                  {/* Scaled Real Template Container */}
                  <div
                    className="origin-top transform scale-[0.24] xs:scale-[0.27] shadow-md bg-white rounded-sm pointer-events-none"
                    style={{
                      width: '210mm',
                      minHeight: '297mm',
                    }}
                  >
                    <TemplateComp resume={resume} />
                  </div>
                </div>

                {/* Template Details */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-ink">{tpl.name}</h4>
                    <span className="text-[10px] font-semibold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                      {tpl.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-ink-soft leading-relaxed mb-3">
                    {tpl.description}
                  </p>
                </div>

                {/* Card Footer */}
                <div className="flex items-center justify-between pt-2.5 border-t border-border">
                  <span className="text-[10px] font-semibold text-success flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> {tpl.atsScore}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelect(tpl.id);
                    }}
                    className={`text-xs font-semibold px-3.5 py-1.5 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-gradient-brand text-primary-foreground shadow-elegant'
                        : 'bg-surface-alt hover:bg-surface text-ink border border-border'
                    }`}
                  >
                    {isSelected ? 'Selected' : 'Use Template'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
