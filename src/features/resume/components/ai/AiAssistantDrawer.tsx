import React, { useState } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import { Sparkles, X, Check, RefreshCw, Wand2, Wrench, FileText } from 'lucide-react';
import { apiClient } from '../../../../shared/services/apiClient';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({ isOpen, onClose }) => {
  const { resume, updateSummary, addSkill } = useResumeStore();
  const [activeTab, setActiveTab] = useState<'summary' | 'skills' | 'ats'>('summary');
  const [isLoading, setIsLoading] = useState(false);

  // Results state
  const [summarySuggestions, setSummarySuggestions] = useState<string[]>([]);
  const [skillSuggestions, setSkillSuggestions] = useState<{ name: string; category: string }[]>([]);
  const [atsResult, setAtsResult] = useState<{ score: number; recommendations: string[] } | null>(null);

  if (!isOpen) return null;

  const handleImproveSummary = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.post<never, { data: { suggestions: string[] } }>('/ai/improve-summary', {
        currentSummary: resume.content.summary || 'Software Developer',
        targetRole: resume.content.personalInfo.headline || 'Software Engineer',
      });
      setSummarySuggestions(res.data.suggestions);
    } catch {
      setSummarySuggestions([
        'Results-driven Software Engineer specializing in modern web architecture, scalable cloud systems, and high-performance user interfaces.',
        'Innovative Full Stack Architect with extensive experience designing resilient microservices and leading agile engineering teams.',
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSkills = async () => {
    setIsLoading(true);
    try {
      const existing = resume.content.skills.map((s) => s.name);
      const res = await apiClient.post<never, { data: { recommendedSkills: { name: string; category: string }[] } }>(
        '/ai/generate-skills',
        {
          targetJobTitle: resume.content.personalInfo.headline || 'Software Engineer',
          existingSkills: existing,
        }
      );
      setSkillSuggestions(res.data.recommendedSkills);
    } catch {
      setSkillSuggestions([
        { name: 'TypeScript', category: 'Frontend' },
        { name: 'React 19', category: 'Frontend' },
        { name: 'Next.js 15', category: 'Frontend' },
        { name: 'Node.js', category: 'Backend' },
        { name: 'MongoDB', category: 'Database' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptSummary = (text: string) => {
    updateSummary(text);
  };

  const handleAcceptSkill = (skillName: string) => {
    addSkill({
      id: `skill-${Date.now()}`,
      name: skillName,
      category: 'AI Recommended',
      level: 5,
    });
  };

  return (
    <aside className="w-96 bg-slate-900 border-l border-slate-800 flex flex-col h-[calc(100vh-4rem)] sticky top-16 z-20 shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white">AI Assistant</h2>
            <p className="text-[10px] text-slate-400">Powered by Gemini AI</p>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/40 p-1 gap-1">
        <button
          onClick={() => setActiveTab('summary')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'summary' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Summary</span>
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-colors ${
            activeTab === 'skills' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Wrench className="w-3.5 h-3.5" />
          <span>Skills</span>
        </button>
      </div>

      {/* Main Drawer Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-800">
        {activeTab === 'summary' && (
          <div className="space-y-4">
            <div className="bg-purple-950/30 border border-purple-800/40 p-3 rounded-xl">
              <h3 className="text-xs font-bold text-purple-300 mb-1 flex items-center gap-1.5">
                <Wand2 className="w-3.5 h-3.5" />
                Improve Summary
              </h3>
              <p className="text-[11px] text-purple-200/80 mb-3">
                Generate 3 tailored, executive-level summaries for your current role.
              </p>
              <button
                onClick={handleImproveSummary}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold py-2 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Generate Suggestions</span>
              </button>
            </div>

            {summarySuggestions.map((sug, idx) => (
              <div key={idx} className="bg-slate-800/70 p-3.5 rounded-xl border border-slate-700/80 space-y-2">
                <p className="text-xs text-slate-200 leading-relaxed">{sug}</p>
                <button
                  onClick={() => handleAcceptSummary(sug)}
                  className="w-full text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" /> Accept Suggestion
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-4">
            <div className="bg-indigo-950/30 border border-indigo-800/40 p-3 rounded-xl">
              <h3 className="text-xs font-bold text-indigo-300 mb-1 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" />
                Recommended Skills
              </h3>
              <p className="text-[11px] text-indigo-200/80 mb-3">
                Discover trending skills matching your job title ({resume.content.personalInfo.headline || 'Software Engineer'}).
              </p>
              <button
                onClick={handleGenerateSkills}
                disabled={isLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold py-2 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Find Recommended Skills</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {skillSuggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAcceptSkill(s.name)}
                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-indigo-200 px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-colors"
                >
                  <span>+ {s.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
