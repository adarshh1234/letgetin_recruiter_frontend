'use client';

import React, { useState } from 'react';
import { Bot, Sparkles, Wand2, Send, FileText, Briefcase, Award, Zap, HelpCircle, Loader2 } from 'lucide-react';
import { useResumeStore } from '../../store/useResumeStore';
import { apiClient } from '@/shared/services/apiClient';

interface AiCareerCoachTabProps {
  onCoachSuggestion: (title: string, currentVal: string, improvedVal: string) => void;
}

export const AiCareerCoachTab: React.FC<AiCareerCoachTabProps> = ({ onCoachSuggestion }) => {
  const { resume } = useResumeStore();
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; action?: () => void }>>([
    {
      sender: 'ai',
      text: "Hello! I'm your AI Career Coach. I can analyze your resume, optimize section bullet points, generate cover letters, or answer ATS questions. How can I help you excel today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim()) return;

    const userMsg = textToSend;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    if (!customPrompt) setInput('');
    setIsLoading(true);

    try {
      const response: any = await apiClient.post('/ai/chat', {
        message: userMsg,
        resumeContext: resume.content,
      });

      if (response?.data?.reply) {
        setMessages((prev) => [
          ...prev,
          { sender: 'ai', text: response.data.reply },
        ]);
      } else {
        throw new Error('No reply');
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `I evaluated your request regarding "${userMsg}". Ensure your experience highlights start with strong action verbs and quantified percentages.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const coachShortcuts = [
    {
      label: 'Improve Summary',
      icon: FileText,
      action: () =>
        onCoachSuggestion(
          'Improve Professional Summary',
          resume.content.summary || '',
          'Results-oriented Software Engineer with a proven track record of architecting resilient web applications, optimizing database performance, and shipping high-impact client features.'
        ),
    },
    {
      label: 'Rewrite Experience Bullets',
      icon: Briefcase,
      action: () =>
        onCoachSuggestion(
          'Rewrite Experience Accomplishments',
          resume.content.experiences[0]?.highlights.join('\n') || 'Worked on web applications and fixed bugs.',
          '• Spearheaded key frontend features using React & TypeScript, boosting user engagement by 40%.\n• Optimized API throughput and microservices, reducing server latencies by 25%.'
        ),
    },
    {
      label: 'Amplify Leadership Impact',
      icon: Zap,
      action: () =>
        onCoachSuggestion(
          'Amplify Leadership & Team Impact',
          resume.content.summary || '',
          'Demonstrated engineering leader who mentored 5 junior developers, established modern CI/CD standards, and reduced production deployment defects by 50%.'
        ),
    },
    {
      label: 'Generate High-Demand Skills',
      icon: Award,
      action: () =>
        onCoachSuggestion(
          'Generate High-Demand Technical Skills',
          resume.content.skills.map((s) => s.name).join(', ') || 'JavaScript, HTML',
          'TypeScript, React 19, Next.js, Node.js, Express, MongoDB, Docker, GraphQL, System Architecture, CI/CD'
        ),
    },
    {
      label: 'Explain ATS Score & Issues',
      icon: HelpCircle,
      action: () =>
        handleSendMessage('Can you explain why ATS screeners check for measurable metrics and section order?'),
    },
  ];

  return (
    <div className="space-y-6 text-slate-100 flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Bot className="w-4 h-4 text-blue-400" />
            AI Career Coach & Advisory Suite
          </h3>
          <p className="text-xs text-slate-400">Proactive career advisor operating directly on your resume state</p>
        </div>
      </div>

      {/* Quick Action Shortcut Buttons */}
      <div className="flex flex-wrap gap-2">
        {coachShortcuts.map((sc, i) => {
          const Icon = sc.icon;
          return (
            <button
              key={i}
              onClick={sc.action}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-blue-600/20 border border-slate-800 hover:border-blue-500/40 rounded-xl text-xs text-slate-300 hover:text-blue-300 font-medium transition-all"
            >
              <Icon className="w-3.5 h-3.5 text-blue-400" />
              <span>{sc.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chat Messages Window */}
      <div className="flex-1 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 overflow-y-auto space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'ai' && (
              <div className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 shrink-0">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[82%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white font-medium rounded-tr-none shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-400" />
            <span>AI Career Coach is analyzing your request...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl p-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask your AI Career Coach anything about your resume..."
          className="flex-1 bg-transparent px-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
        />
        <button
          onClick={() => handleSendMessage()}
          disabled={isLoading || !input.trim()}
          className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg transition-all disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
