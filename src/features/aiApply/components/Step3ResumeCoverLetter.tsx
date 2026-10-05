'use client';

import React, { useRef, useState } from 'react';
import { CheckCircle2, Plus, Loader2, ExternalLink, FileText, Mail } from 'lucide-react';
import { useAiApplyStore } from '../store/useAiApplyStore';
import { quickCreateResumeFromProfile } from '../services/resumeQuickCreate';
import { coverLetterService } from '../services/coverLetterService';
import { AiSuggestionBadge } from './ui/AiSuggestionBadge';
import { AIWritingAssistant } from '@/features/aiWriting/components/AIWritingAssistant';

export function Step3ResumeCoverLetter() {
  const preferences = useAiApplyStore((s) => s.preferences);
  const setField = useAiApplyStore((s) => s.setField);
  const resumes = useAiApplyStore((s) => s.resumes);
  const coverLetters = useAiApplyStore((s) => s.coverLetters);
  const aiSuggestions = useAiApplyStore((s) => s.aiSuggestions);
  const profile = useAiApplyStore((s) => s.profile);
  const addResume = useAiApplyStore((s) => s.addResume);
  const addCoverLetter = useAiApplyStore((s) => s.addCoverLetter);

  const [isCreatingResume, setIsCreatingResume] = useState(false);
  const [showNewCoverLetter, setShowNewCoverLetter] = useState(false);
  const [newTitle, setNewTitle] = useState('New Cover Letter');
  const [newContent, setNewContent] = useState('');
  const [isSavingCoverLetter, setIsSavingCoverLetter] = useState(false);
  const newContentRef = useRef<HTMLTextAreaElement>(null);

  const handleCreateResume = async () => {
    if (!profile) return;
    setIsCreatingResume(true);
    try {
      const created = await quickCreateResumeFromProfile(profile);
      addResume(created);
    } catch (err) {
      console.warn('Failed to create resume:', err);
    } finally {
      setIsCreatingResume(false);
    }
  };

  const handleSaveCoverLetter = async () => {
    setIsSavingCoverLetter(true);
    try {
      const created = await coverLetterService.create({ title: newTitle || 'Untitled Cover Letter', content: newContent });
      addCoverLetter(created);
      setShowNewCoverLetter(false);
      setNewTitle('New Cover Letter');
      setNewContent('');
    } catch (err) {
      console.warn('Failed to create cover letter:', err);
    } finally {
      setIsSavingCoverLetter(false);
    }
  };

  const recommendedResume = resumes.find((r) => r.id === aiSuggestions?.resumeId);
  const recommendedCoverLetter = coverLetters.find((c) => c.id === aiSuggestions?.coverLetterId);

  return (
    <div className="space-y-8">
      {/* Resumes */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-ink">Attach resumes for the application and prioritize it</h2>

        {recommendedResume && preferences.resumeId !== recommendedResume.id && (
          <AiSuggestionBadge
            label={`✨ AI Recommended: ${recommendedResume.title}`}
            reason="This resume appears to be the strongest match for your selected job titles."
            onUse={() => setField('resumeId', recommendedResume.id)}
          />
        )}

        <div className="space-y-2">
          {resumes.map((resume) => {
            const isSelected = preferences.resumeId === resume.id;
            const isRecommended = aiSuggestions?.resumeId === resume.id;
            return (
              <div
                key={resume.id}
                onClick={() => setField('resumeId', resume.id)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-left cursor-pointer transition ${
                  isSelected
                    ? 'bg-primary/10 border-primary-glow ring-2 ring-primary-glow/30'
                    : 'bg-surface border-border hover:border-primary-glow/40'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-4 h-4 text-ink-soft shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">
                      {resume.title}
                      {isRecommended && <span className="ml-1.5 text-[10px] font-bold text-primary">✨ Recommended</span>}
                    </p>
                    {resume.headline && <p className="text-[11px] text-ink-soft truncate">{resume.headline}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={`/builder?id=${resume.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-[11px] font-semibold text-primary hover:text-primary-deep inline-flex items-center gap-1"
                  >
                    Review & edit <ExternalLink className="w-3 h-3" />
                  </a>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleCreateResume}
          disabled={isCreatingResume || !profile}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-deep disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isCreatingResume ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{isCreatingResume ? 'Creating from your profile...' : 'Create New Resume'}</span>
        </button>
      </div>

      {/* Cover Letters */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-ink">Attach cover letter</h2>

        {recommendedCoverLetter && preferences.coverLetterId !== recommendedCoverLetter.id && (
          <AiSuggestionBadge
            label={`✨ AI Recommended: ${recommendedCoverLetter.title}`}
            reason="This cover letter appears to be the strongest match for your selected job titles."
            onUse={() => setField('coverLetterId', recommendedCoverLetter.id)}
          />
        )}

        <div className="space-y-2">
          {coverLetters.map((cl) => {
            const isSelected = preferences.coverLetterId === cl.id;
            const isRecommended = aiSuggestions?.coverLetterId === cl.id;
            return (
              <div
                key={cl.id}
                onClick={() => setField('coverLetterId', cl.id)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-left cursor-pointer transition ${
                  isSelected
                    ? 'bg-primary/10 border-primary-glow ring-2 ring-primary-glow/30'
                    : 'bg-surface border-border hover:border-primary-glow/40'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Mail className="w-4 h-4 text-ink-soft shrink-0" />
                  <p className="text-sm font-semibold text-ink truncate">
                    {cl.title}
                    {isRecommended && <span className="ml-1.5 text-[10px] font-bold text-primary">✨ Recommended</span>}
                  </p>
                </div>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
              </div>
            );
          })}
        </div>

        {!showNewCoverLetter ? (
          <button
            type="button"
            onClick={() => setShowNewCoverLetter(true)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-deep cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Blank Cover Letter</span>
          </button>
        ) : (
          <div className="space-y-2 p-3.5 rounded-xl border border-border bg-surface">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Cover letter title"
              className="w-full input-base text-xs px-3 py-2 bg-surface-alt/60 text-ink"
            />
            <textarea
              ref={newContentRef}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Write your cover letter..."
              rows={6}
              className="w-full input-base text-xs px-3 py-2 bg-surface-alt/60 text-ink resize-none"
            />
            <div className="flex items-center justify-between gap-2">
              <AIWritingAssistant
                value={newContent}
                context="cover-letter"
                textareaRef={newContentRef}
                onApply={setNewContent}
                label={newContent.trim() ? 'AI Improve' : 'Generate with AI'}
              />
              <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowNewCoverLetter(false)}
                className="text-xs font-semibold text-ink-soft hover:text-ink px-3 py-1.5 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCoverLetter}
                disabled={isSavingCoverLetter}
                className="text-xs font-bold text-white bg-gradient-brand px-3.5 py-1.5 rounded-lg shadow-elegant disabled:opacity-50 cursor-pointer"
              >
                {isSavingCoverLetter ? 'Saving...' : 'Save'}
              </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
