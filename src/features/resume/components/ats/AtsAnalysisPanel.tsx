'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Activity, Target, Bot, ChevronRight, ChevronLeft, Sparkles, RefreshCw, Wand2 } from 'lucide-react';
import { useAtsAnalysis } from '../../hooks/useAtsAnalysis';
import { AtsScoreMeter } from './AtsScoreMeter';
import { HealthDashboard } from './HealthDashboard';
import { JobMatcher } from './JobMatcher';
import { AiCareerCoachTab } from './AiCareerCoachTab';
import { AiDiffModal } from '../ai/AiDiffModal';
import { useResumeStore } from '../../store/useResumeStore';
import { apiClient } from '@/shared/services/apiClient';

interface AtsAnalysisPanelProps {
  isEmbedded?: boolean;
}

export const AtsAnalysisPanel: React.FC<AtsAnalysisPanelProps> = ({ isEmbedded = false }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'ats' | 'health' | 'jobMatch' | 'coach'>('ats');

  // AI Diff Modal State
  const [diffModal, setDiffModal] = useState<{
    isOpen: boolean;
    title: string;
    subtitle?: string;
    currentValue: string;
    improvedValue: string;
    onAccept: (val: string) => void;
  }>({
    isOpen: false,
    title: '',
    currentValue: '',
    improvedValue: '',
    onAccept: () => {},
  });

  const { isAnalyzing, result, userMode, setUserMode, runAtsAnalysis } = useAtsAnalysis();
  const { resume, updateSummary, updateExperience, addSkill } = useResumeStore();

  // Helper trigger for AI recommendations
  const handleImproveAction = async (actionType: 'summary' | 'experience' | 'skills' | 'projects' | 'metrics' | 'keywords') => {
    if (actionType === 'summary') {
      const currentSummary = resume.content.summary || '';
      try {
        const res: any = await apiClient.post('/ai/improve-summary', {
          currentSummary,
          targetRole: resume.content.personalInfo.headline || 'Software Professional',
        });
        const suggestions = res?.data?.suggestions || [];
        const improved = suggestions[0] || 'Results-driven software engineer with proven experience building scalable, high-performance web systems and optimizing user engagement.';

        setDiffModal({
          isOpen: true,
          title: 'AI Executive Summary Improvement',
          subtitle: 'Review the proposed high-impact summary before applying to your resume.',
          currentValue: currentSummary,
          improvedValue: improved,
          onAccept: (acceptedVal) => {
            updateSummary(acceptedVal);
            runAtsAnalysis();
          },
        });
      } catch {
        setDiffModal({
          isOpen: true,
          title: 'AI Executive Summary Improvement',
          currentValue: currentSummary,
          improvedValue: 'Results-driven software engineer with proven experience building scalable, high-performance web systems and optimizing user engagement.',
          onAccept: (acceptedVal) => {
            updateSummary(acceptedVal);
            runAtsAnalysis();
          },
        });
      }
    } else if (actionType === 'experience' || actionType === 'metrics') {
      const firstExp = resume.content.experiences[0];
      const currentBullets = firstExp?.highlights.join('\n') || 'Developed web applications.';
      setDiffModal({
        isOpen: true,
        title: 'AI Experience Bullet Point Optimization',
        subtitle: 'Incorporate strong action verbs and quantified percentage achievements.',
        currentValue: currentBullets,
        improvedValue: '• Spearheaded frontend micro-services architecture using TypeScript and React, boosting web performance by 35%.\n• Architected RESTful API endpoints, handling 5M daily requests with 99.99% uptime.',
        onAccept: (acceptedVal) => {
          if (firstExp) {
            updateExperience(firstExp.id, {
              highlights: acceptedVal.split('\n').map((line) => line.replace(/^•\s*/, '').trim()).filter(Boolean),
            });
            runAtsAnalysis();
          }
        },
      });
    } else if (actionType === 'skills' || actionType === 'keywords') {
      const currentSkills = resume.content.skills.map((s) => s.name).join(', ');
      setDiffModal({
        isOpen: true,
        title: 'AI Technical Skill Keyword Optimization',
        subtitle: 'Add high-value industry keywords to optimize your ATS rank.',
        currentValue: currentSkills,
        improvedValue: currentSkills + ', Docker, CI/CD Pipelines, System Design, GraphQL, Redis',
        onAccept: () => {
          ['Docker', 'CI/CD Pipelines', 'System Design'].forEach((skName) => {
            addSkill({ id: `skill-${Date.now()}-${Math.random()}`, name: skName, category: 'Technical', level: 4 });
          });
          runAtsAnalysis();
        },
      });
    }
  };

  const handleTailorAction = (tailoredSummary: string, tailoredBullets: string[]) => {
    setDiffModal({
      isOpen: true,
      title: '1-Click Job Tailored Resume Optimization',
      subtitle: 'Align your executive summary and bullets directly with target job requirements.',
      currentValue: resume.content.summary || '',
      improvedValue: tailoredSummary,
      onAccept: (acceptedVal) => {
        updateSummary(acceptedVal);
        if (resume.content.experiences[0] && tailoredBullets.length > 0) {
          updateExperience(resume.content.experiences[0].id, {
            highlights: tailoredBullets,
          });
        }
        runAtsAnalysis();
      },
    });
  };

  const handleCoachSuggestion = (title: string, currentVal: string, improvedVal: string) => {
    setDiffModal({
      isOpen: true,
      title,
      currentValue: currentVal,
      improvedValue: improvedVal,
      onAccept: (val) => {
        updateSummary(val);
        runAtsAnalysis();
      },
    });
  };

  if (isEmbedded) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-400" />
            <div>
              <h2 className="text-base font-bold text-slate-100">Open Resume ATS & Career Intelligence</h2>
              <p className="text-xs text-slate-400">Live score & optimization engine for your active resume</p>
            </div>
          </div>
          <button
            onClick={() => runAtsAnalysis()}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin text-blue-400' : ''}`} />
            <span>Re-analyze</span>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-slate-950/80 border border-slate-800 p-1 rounded-xl text-xs">
          <button
            onClick={() => setActiveTab('ats')}
            className={`flex-1 py-2 flex items-center justify-center gap-1.5 font-semibold rounded-lg transition-all ${
              activeTab === 'ats' ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ATS Score</span>
          </button>
          <button
            onClick={() => setActiveTab('health')}
            className={`flex-1 py-2 flex items-center justify-center gap-1.5 font-semibold rounded-lg transition-all ${
              activeTab === 'health' ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Health</span>
          </button>
          <button
            onClick={() => setActiveTab('jobMatch')}
            className={`flex-1 py-2 flex items-center justify-center gap-1.5 font-semibold rounded-lg transition-all ${
              activeTab === 'jobMatch' ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Job Match</span>
          </button>
          <button
            onClick={() => setActiveTab('coach')}
            className={`flex-1 py-2 flex items-center justify-center gap-1.5 font-semibold rounded-lg transition-all ${
              activeTab === 'coach' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Coach</span>
          </button>
        </div>

        {/* Tab Body */}
        <div>
          {activeTab === 'ats' && (
            <AtsScoreMeter
              result={result}
              isAnalyzing={isAnalyzing}
              onImproveAction={handleImproveAction}
              onRunAnalysis={runAtsAnalysis}
            />
          )}
          {activeTab === 'health' && <HealthDashboard metrics={result?.healthMetrics || []} />}
          {activeTab === 'jobMatch' && <JobMatcher onTailorAction={handleTailorAction} />}
          {activeTab === 'coach' && <AiCareerCoachTab onCoachSuggestion={handleCoachSuggestion} />}
        </div>

        <AiDiffModal
          isOpen={diffModal.isOpen}
          onClose={() => setDiffModal((prev) => ({ ...prev, isOpen: false }))}
          title={diffModal.title}
          subtitle={diffModal.subtitle}
          currentValue={diffModal.currentValue}
          improvedValue={diffModal.improvedValue}
          onAccept={diffModal.onAccept}
        />
      </div>
    );
  }


  return (
    <>
      {/* Right-Side Permanent ATS Docking Panel */}
      <motion.aside
        initial={{ width: 380 }}
        animate={{ width: isOpen ? 380 : 50 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col h-full bg-slate-900/95 border-l border-slate-800 z-20 shrink-0 relative overflow-hidden"
      >
        {/* Panel Collapse Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-4 left-3 z-30 p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors border border-slate-700 shadow-md"
          title={isOpen ? 'Collapse ATS Panel' : 'Expand ATS Panel'}
        >
          {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {isOpen ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Header Toolbar */}
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between pl-12 bg-slate-950/40">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <h2 className="text-sm font-bold text-slate-100">AI ATS & Career Intelligence</h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => runAtsAnalysis()}
                  disabled={isAnalyzing}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                  title="Re-analyze ATS"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin text-blue-400' : ''}`} />
                </button>
              </div>
            </div>

            {/* Intelligence Status Bar */}
            <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Engine Status:</span>
              <span className="text-sky-400 font-medium">On-Demand AI ATS Analyzer</span>
            </div>

            {/* Navigation Tabs */}
            <div className="flex bg-slate-950/80 border-b border-slate-800 px-2 py-1 text-xs">
              <button
                onClick={() => setActiveTab('ats')}
                className={`flex-1 py-2 flex items-center justify-center gap-1.5 font-semibold rounded-lg transition-all ${
                  activeTab === 'ats'
                    ? 'bg-slate-800 text-blue-400 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ATS Score</span>
              </button>

              <button
                onClick={() => setActiveTab('health')}
                className={`flex-1 py-2 flex items-center justify-center gap-1.5 font-semibold rounded-lg transition-all ${
                  activeTab === 'health'
                    ? 'bg-slate-800 text-blue-400 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Health</span>
              </button>

              <button
                onClick={() => setActiveTab('jobMatch')}
                className={`flex-1 py-2 flex items-center justify-center gap-1.5 font-semibold rounded-lg transition-all ${
                  activeTab === 'jobMatch'
                    ? 'bg-slate-800 text-indigo-400 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Job Match</span>
              </button>

              <button
                onClick={() => setActiveTab('coach')}
                className={`flex-1 py-2 flex items-center justify-center gap-1.5 font-semibold rounded-lg transition-all ${
                  activeTab === 'coach'
                    ? 'bg-slate-800 text-emerald-400 border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>Coach</span>
              </button>
            </div>

            {/* Tab Content Body */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-800">
              {activeTab === 'ats' && (
                <AtsScoreMeter
                  result={result}
                  isAnalyzing={isAnalyzing}
                  onImproveAction={handleImproveAction}
                  onRunAnalysis={runAtsAnalysis}
                />
              )}

              {activeTab === 'health' && (
                <HealthDashboard metrics={result?.healthMetrics || []} />
              )}

              {activeTab === 'jobMatch' && (
                <JobMatcher onTailorAction={handleTailorAction} />
              )}

              {activeTab === 'coach' && (
                <AiCareerCoachTab onCoachSuggestion={handleCoachSuggestion} />
              )}
            </div>
          </div>
        ) : (
          /* Collapsed Sidebar Strip */
          <div className="flex flex-col items-center pt-16 gap-6 text-slate-400">
            <button
              onClick={() => { setIsOpen(true); setActiveTab('ats'); }}
              className="p-2 hover:bg-slate-800 hover:text-blue-400 rounded-xl transition-colors"
              title="ATS Compliance Score"
            >
              <ShieldCheck className="w-5 h-5" />
            </button>
            <button
              onClick={() => { setIsOpen(true); setActiveTab('health'); }}
              className="p-2 hover:bg-slate-800 hover:text-blue-400 rounded-xl transition-colors"
              title="Health Dashboard"
            >
              <Activity className="w-5 h-5" />
            </button>
            <button
              onClick={() => { setIsOpen(true); setActiveTab('jobMatch'); }}
              className="p-2 hover:bg-slate-800 hover:text-indigo-400 rounded-xl transition-colors"
              title="Job Description Matcher"
            >
              <Target className="w-5 h-5" />
            </button>
            <button
              onClick={() => { setIsOpen(true); setActiveTab('coach'); }}
              className="p-2 hover:bg-slate-800 hover:text-emerald-400 rounded-xl transition-colors"
              title="AI Career Coach"
            >
              <Bot className="w-5 h-5" />
            </button>
          </div>
        )}
      </motion.aside>

      {/* Mobile Accordion Container */}
      <div className="block lg:hidden bg-slate-900 border-t border-slate-800 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            ATS Analysis Score: {result?.overallScore ?? 0}/100
          </span>
          <button
            onClick={() => handleImproveAction('summary')}
            className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
          >
            <Wand2 className="w-3 h-3" /> Improve AI
          </button>
        </div>
      </div>

      {/* Accept / Reject Comparison Dialog */}
      <AiDiffModal
        isOpen={diffModal.isOpen}
        onClose={() => setDiffModal((prev) => ({ ...prev, isOpen: false }))}
        title={diffModal.title}
        subtitle={diffModal.subtitle}
        currentValue={diffModal.currentValue}
        improvedValue={diffModal.improvedValue}
        onAccept={diffModal.onAccept}
      />
    </>
  );
};
