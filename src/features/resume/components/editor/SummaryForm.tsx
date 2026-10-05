import React, { useRef, useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { FileText, Sparkles } from 'lucide-react';
import { AiSummaryModal } from '../ai/AiSummaryModal';
import { AIWritingAssistant } from '@/features/aiWriting/components/AIWritingAssistant';

export const SummaryForm: React.FC = () => {
  const { resume, updateSummary, setActiveResumeContext } = useResumeStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const summaryRef = useRef<HTMLTextAreaElement>(null);

  const headline = resume.content.personalInfo.headline || 'Software Professional';
  const summaryVal = resume.content.summary;
  const summaryText = typeof summaryVal === 'string'
    ? summaryVal
    : (summaryVal && typeof summaryVal === 'object' && 'currentSummary' in summaryVal)
    ? String((summaryVal as any).currentSummary || '')
    : (summaryVal && typeof summaryVal === 'object' && 'summary' in summaryVal)
    ? String((summaryVal as any).summary || '')
    : String(summaryVal || '');

  return (
    <div className="space-y-4 bg-surface p-5 rounded-2xl border border-border shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-border gap-3">
        <div>
          <h3 className="text-sm font-bold text-ink flex items-center gap-2">
            <FileText className="w-4 h-4 text-primary-glow" />
            Professional Summary
          </h3>
          <p className="text-xs text-ink-soft mt-0.5">
            Targeting Role: <span className="text-primary-glow font-semibold">{headline}</span>
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 text-xs text-primary-foreground bg-gradient-brand px-4 py-2 rounded-xl transition-all font-semibold shadow-elegant hover:shadow-glow"
        >
          <Sparkles className="w-4 h-4" />
          <span>Write Summary with AI</span>
        </button>
      </div>

      <div>
        <textarea
          ref={summaryRef}
          rows={6}
          value={summaryText}
          onFocus={() =>
            setActiveResumeContext({
              section: 'summary',
              field: 'summary',
              value: summaryText,
            })
          }
          onChange={(e) => {
            updateSummary(e.target.value);
            setActiveResumeContext({
              section: 'summary',
              field: 'summary',
              value: e.target.value,
            });
          }}
          placeholder="Write a compelling 3-4 sentence summary of your experience, key skills, and engineering accomplishments..."
          className="input-base text-xs leading-relaxed resize-y"
        />
        <div className="flex justify-between items-center mt-1.5 text-[11px] text-ink-soft">
          <span>Tip: Click &quot;Write Summary with AI&quot; to pick templates or generate tailored variations.</span>
          <span>{summaryText.length} characters</span>
        </div>
        {summaryText.trim().length > 0 && (
          <div className="mt-2">
            <AIWritingAssistant
              value={summaryText}
              context="resume-summary"
              metadata={{ targetRole: headline }}
              textareaRef={summaryRef}
              onApply={(next) => {
                updateSummary(next);
                setActiveResumeContext({ section: 'summary', field: 'summary', value: next });
              }}
              label="AI Improve"
            />
          </div>
        )}
      </div>

      {/* AI Summary & Template Modal */}
      <AiSummaryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
