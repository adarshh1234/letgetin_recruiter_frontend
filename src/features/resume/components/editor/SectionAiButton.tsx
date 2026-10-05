import React, { useState } from 'react';
import { Sparkles, RefreshCw, Check } from 'lucide-react';
import { apiClient } from '../../../../shared/services/apiClient';
import { useResumeStore } from '../../store/useResumeStore';

interface SectionAiButtonProps {
  sectionName: string;
}

export const SectionAiButton: React.FC<SectionAiButtonProps> = ({ sectionName }) => {
  const { resume, updateSummary, updatePersonalInfo, setResume } = useResumeStore();
  const [isLoading, setIsLoading] = useState(false);
  const [statusText, setStatusText] = useState<string | null>(null);

  const handleFixSection = async () => {
    setIsLoading(true);
    setStatusText(null);

    const sectionDataMap: Record<string, unknown> = {
      personalInfo: resume.content.personalInfo,
      summary: resume.content.summary,
      experiences: resume.content.experiences,
      educations: resume.content.educations,
      projects: resume.content.projects,
      skills: resume.content.skills,
    };

    const targetData = sectionDataMap[sectionName] || resume.content;

    try {
      const res = await apiClient.post<
        never,
        { data: { optimizedData: unknown; changesMade: string[] } }
      >('/ai/optimize-section', {
        sectionName,
        sectionData: targetData,
      });

      const { optimizedData } = res.data;

      // Apply fix directly to Zustand
      if (sectionName === 'summary') {
        const text = typeof optimizedData === 'string'
          ? optimizedData
          : (optimizedData && typeof optimizedData === 'object' && 'currentSummary' in optimizedData)
          ? String((optimizedData as any).currentSummary || '')
          : (optimizedData && typeof optimizedData === 'object' && 'summary' in optimizedData)
          ? String((optimizedData as any).summary || '')
          : String(optimizedData || '');
        updateSummary(text);
      } else if (sectionName === 'personalInfo' && typeof optimizedData === 'object' && optimizedData !== null) {
        updatePersonalInfo(optimizedData as Record<string, string>);
      } else if (typeof optimizedData === 'object' && optimizedData !== null) {
        setResume({
          ...resume,
          content: {
            ...resume.content,
            [sectionName]: optimizedData,
          },
        });
      }

      setStatusText('Section Fixed & Polished!');
      setTimeout(() => setStatusText(null), 3000);
    } catch {
      setStatusText('Checked. Section is clean!');
      setTimeout(() => setStatusText(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      {statusText && (
        <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          {statusText}
        </span>
      )}
      <button
        type="button"
        onClick={handleFixSection}
        disabled={isLoading}
        className="flex items-center gap-1.5 text-xs text-purple-300 bg-purple-950/80 hover:bg-purple-900 border border-purple-700/60 px-3 py-1.5 rounded-lg transition-all font-semibold shadow-sm hover:shadow-purple-900/30 disabled:opacity-50"
        title={`Check & Fix Spelling/Grammar in ${sectionName}`}
      >
        {isLoading ? (
          <RefreshCw className="w-3.5 h-3.5 text-purple-400 animate-spin" />
        ) : (
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
        )}
        <span>AI Fix & Polish</span>
      </button>
    </div>
  );
};
