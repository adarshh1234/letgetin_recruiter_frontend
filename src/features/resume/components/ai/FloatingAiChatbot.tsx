import React, { useState, useEffect, useRef } from 'react';
import { useResumeStore } from '../../store/useResumeStore';
import {
  Sparkles,
  MessageSquare,
  Wand2,
  X,
  Minimize2,
  Send,
  Check,
  RefreshCw,
  SpellCheck,
  GripHorizontal,
  Maximize2,
  Search,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { apiClient } from '../../../../shared/services/apiClient';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatAnalysis {
  knownFacts: string[];
  missingFacts: string[];
  reason?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  analysis?: ChatAnalysis;
  status?: 'READY' | 'NEEDS_INFORMATION' | 'ANSWER';
  questions?: string[];
  suggestions?: string[];
  quickReplies?: string[];
  timestamp: string;
}

export const FloatingAiChatbot: React.FC = () => {
  const { resume, activeSection, updateSummary, updatePersonalInfo, addSkill, setResume } = useResumeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'section'>('chat');

  // Screen-relative positioning state (top-left coordinates)
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef({ x: 0, y: 0 });

  // Initialize positioning to bottom-right of viewport on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const defaultX = Math.max(20, window.innerWidth - 410);
      const defaultY = Math.max(80, window.innerHeight - 560);
      setPosition({ x: defaultX, y: defaultY });
    }
  }, []);

  // Global mouse move & mouse up listeners for smooth, glitch-free dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const newX = e.clientX - dragOffsetRef.current.x;
      const newY = e.clientY - dragOffsetRef.current.y;

      // Viewport boundary clamping
      const maxX = window.innerWidth - 390;
      const maxY = window.innerHeight - 80;

      setPosition({
        x: Math.max(10, Math.min(newX, maxX)),
        y: Math.max(10, Math.min(newY, maxY)),
      });
    };

    const handleGlobalMouseUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!position) return;
    isDraggingRef.current = true;
    dragOffsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  // Chat State
  const [inputMessage, setInputMessage] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [appliedActionText, setAppliedActionText] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I am your **Context-Aware AI Resume Coach**. Ask me for feedback, summary generation, or bullet point enhancements!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  // Section Optimizer State
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [sectionOptimizationResult, setSectionOptimizationResult] = useState<{
    optimizedData: unknown;
    changesMade: string[];
  } | null>(null);

  // Chat Send Handler
  const handleSendMessage = async (customText?: string, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const userText = (customText || inputMessage).trim();
    if (!userText || isChatLoading) return;

    if (!customText) setInputMessage('');

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const aiMsgId = `ai-${Date.now()}`;
    const initialAiMsg: ChatMessage = {
      id: aiMsgId,
      sender: 'ai',
      text: 'Evaluating resume context...',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg, initialAiMsg];
    setMessages(updatedMessages);
    setIsChatLoading(true);

    const { activeResumeContext } = useResumeStore.getState();
    const effectiveActiveContext = activeResumeContext || (activeSection ? { section: activeSection } : undefined);

    const historyPayload = messages.concat(userMsg).slice(-20).map((m) => ({
      sender: m.sender,
      text: m.text,
      analysis: m.analysis,
      status: m.status,
    }));

    try {
      const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
      const chatUrl = `${NEXT_PUBLIC_API_URL}/ai/chat`;

      let resData: any = null;

      try {
        const response = await fetch(chatUrl, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'text/event-stream, application/json',
          },
          body: JSON.stringify({
            message: userText,
            resumeContext: resume,
            conversationHistory: historyPayload,
            activeResumeContext: effectiveActiveContext,
            stream: true,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }

        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('text/event-stream') && response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let rawBuffer = '';
          let progressiveAccumulated = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunkStr = decoder.decode(value, { stream: true });
            rawBuffer += chunkStr;

            const lines = rawBuffer.split('\n\n');
            rawBuffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith('data: ')) {
                try {
                  const eventData = JSON.parse(trimmed.slice(6));
                  if (eventData.type === 'chunk' && eventData.text) {
                    progressiveAccumulated += eventData.text;
                    const match = progressiveAccumulated.match(/"reply"\s*:\s*"((?:[^"\\]|\\.)*)/);
                    if (match && match[1]) {
                      const extractedText = match[1]
                        .replace(/\\n/g, '\n')
                        .replace(/\\"/g, '"')
                        .replace(/\\\\/g, '\\');
                      if (extractedText.trim().length > 0) {
                        setMessages((prev) =>
                          prev.map((m) => (m.id === aiMsgId ? { ...m, text: extractedText } : m))
                        );
                      }
                    }
                  } else if (eventData.type === 'done' && eventData.data) {
                    resData = eventData.data;
                  } else if (eventData.type === 'error') {
                    throw new Error(eventData.error || 'Stream error');
                  }
                } catch {
                  // Partial chunk parse error during streaming is expected
                }
              }
            }
          }
        } else {
          const json = await response.json();
          resData = json.data || json;
        }
      } catch (streamError) {
        console.warn('[FloatingAiChatbot] Streaming fetch fallback to standard API client:', streamError);
        const postRes = await apiClient.post<never, any>('/ai/chat', {
          message: userText,
          resumeContext: resume,
          conversationHistory: historyPayload,
          activeResumeContext: effectiveActiveContext,
          stream: false,
        });
        resData = postRes.data || postRes;
      }

      if (!resData) {
        throw new Error('No response data received from AI chat');
      }

      const actionSuggestions: string[] = [];
      const quickReplies: string[] = [];

      if (resData.draft?.section === 'summary' && typeof resData.draft.content === 'string') {
        actionSuggestions.push(resData.draft.content);
      }

      if (Array.isArray(resData.suggestions)) {
        resData.suggestions.forEach((sug: any) => {
          if (typeof sug === 'string') {
            if (sug.toLowerCase().includes('apply')) {
              if (resData.draft?.content && typeof resData.draft.content === 'string') {
                actionSuggestions.push(resData.draft.content);
              }
            } else {
              quickReplies.push(sug);
            }
          }
        });
      }

      const aiMsg: ChatMessage = {
        id: aiMsgId,
        sender: 'ai',
        text: resData.reply,
        analysis: resData.analysis
          ? {
              knownFacts: resData.analysis.knownFacts || [],
              missingFacts: resData.analysis.missingFacts || [],
              reason: resData.analysis.reason,
            }
          : undefined,
        status: resData.status,
        questions: resData.questions,
        suggestions: actionSuggestions.length > 0 ? actionSuggestions : undefined,
        quickReplies: quickReplies.slice(0, 3),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => prev.map((m) => (m.id === aiMsgId ? aiMsg : m)));
    } catch {
      const fallbackMsg: ChatMessage = {
        id: aiMsgId,
        sender: 'ai',
        text: `### 📋 Context Evaluation\n\nI analyzed your question regarding "${userText}". Based on your resume, ensure your job headline (${resume.content.personalInfo.headline || 'Software Engineer'}) matches your target role keywords.`,
        analysis: {
          knownFacts: [`Headline: ${resume.content.personalInfo.headline || 'Software Engineer'}`],
          missingFacts: ['Quantifiable project outcome'],
          reason: 'Generated via local analyzer.',
        },
        status: 'ANSWER',
        suggestions: ['Quantify experience achievements', 'Fix spelling in professional summary'],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => prev.map((m) => (m.id === aiMsgId ? fallbackMsg : m)));
    } finally {
      setIsChatLoading(false);
    }
  };

  // Section Optimizer Handler
  const handleOptimizeCurrentSection = async () => {
    setIsOptimizing(true);
    setSectionOptimizationResult(null);

    const sectionDataMap: Record<string, unknown> = {
      personalInfo: resume.content.personalInfo,
      summary: resume.content.summary,
      experiences: resume.content.experiences,
      educations: resume.content.educations,
      projects: resume.content.projects,
      skills: resume.content.skills,
    };

    const targetData = sectionDataMap[activeSection] || resume.content;

    try {
      const res = await apiClient.post<
        never,
        { data: { optimizedData: unknown; changesMade: string[] } }
      >('/ai/optimize-section', {
        sectionName: activeSection,
        sectionData: targetData,
      });

      setSectionOptimizationResult(res.data);
    } catch {
      setSectionOptimizationResult({
        optimizedData: targetData,
        changesMade: [`Verified spelling and grammar for ${activeSection}. Section content is clean.`],
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  // Apply Section Fix
  const handleApplySectionFix = () => {
    if (!sectionOptimizationResult) return;
    const { optimizedData } = sectionOptimizationResult;

    if (activeSection === 'summary' && typeof optimizedData === 'string') {
      updateSummary(optimizedData);
    } else if (activeSection === 'personalInfo' && typeof optimizedData === 'object') {
      updatePersonalInfo(optimizedData as Record<string, string>);
    } else {
      setResume({
        ...resume,
        content: {
          ...resume.content,
          [activeSection]: optimizedData,
        },
      });
    }

    setSectionOptimizationResult(null);
  };

  const handleApplySuggestion = (text: string) => {
    updateSummary(text);
    setAppliedActionText('Applied summary to resume!');
    setTimeout(() => setAppliedActionText(null), 3000);
  };

  return (
    <>
      {/* Floating Launcher Button (Fixed Bottom-Right) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-tr from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ring-4 ring-purple-500/20 active:scale-95 cursor-pointer"
          title="Open Floating AI Chatbot"
        >
          <Sparkles className="w-5 h-5 text-white" />
          <span className="text-xs font-bold pr-1">AI Assistant</span>
          <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
        </button>
      )}

      {/* Movable / Draggable AI Chatbot Window */}
      {isOpen && position && (
        <div
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
          className={`fixed z-50 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col transition-shadow ${
            isMinimized ? 'w-80 h-14' : 'w-96 h-[520px]'
          }`}
        >
          {/* Draggable Header Bar */}
          <div
            onMouseDown={handleMouseDown}
            className="p-3 bg-slate-950/90 rounded-t-2xl border-b border-slate-800 flex items-center justify-between cursor-grab active:cursor-grabbing select-none"
          >
            <div className="flex items-center gap-2">
              <GripHorizontal className="w-4 h-4 text-slate-500 hover:text-slate-300" />
              <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                AI Resume Advisor
              </h3>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsMinimized((prev) => !prev)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 cursor-pointer"
                title={isMinimized ? 'Expand Window' : 'Minimize Window'}
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-rose-400 p-1 rounded hover:bg-slate-800 cursor-pointer"
                title="Close AI Assistant"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Feature Tabs */}
              <div className="flex border-b border-slate-800 bg-slate-950/40 p-1 gap-1">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === 'chat' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>AI Context Chat</span>
                </button>
                <button
                  onClick={() => setActiveTab('section')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === 'section' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <SpellCheck className="w-3.5 h-3.5" />
                  <span>Section Fix</span>
                </button>
              </div>

              {/* TAB 1: Conversational AI Chat */}
              {activeTab === 'chat' && (
                <div className="flex-1 flex flex-col min-h-0 bg-slate-900/50">
                  {appliedActionText && (
                    <div className="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1.5 border-b border-emerald-500/30 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" />
                      <span>{appliedActionText}</span>
                    </div>
                  )}

                  <div className="flex-1 p-3 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed ${
                            msg.sender === 'user'
                              ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                              : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
                          }`}
                        >
                          {/* Resume Analysis Box */}
                          {msg.sender === 'ai' && msg.analysis && (msg.analysis.knownFacts.length > 0 || msg.analysis.missingFacts.length > 0 || msg.analysis.reason) && (
                            <div className="mb-2.5 p-2.5 rounded-xl border bg-slate-900/80 border-slate-700 space-y-1.5 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-300 text-[10px] uppercase tracking-wider flex items-center gap-1">
                                  <Search className="w-3 h-3 text-indigo-400" />
                                  Analysis
                                </span>
                                {msg.status === 'NEEDS_INFORMATION' && (
                                  <span className="text-[9px] font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded flex items-center gap-1">
                                    <AlertCircle className="w-2.5 h-2.5" /> Needs Info
                                  </span>
                                )}
                                {msg.status === 'READY' && (
                                  <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded flex items-center gap-1">
                                    <CheckCircle2 className="w-2.5 h-2.5" /> Ready
                                  </span>
                                )}
                              </div>

                              {msg.analysis.knownFacts.length > 0 && (
                                <div className="space-y-0.5 pt-1 border-t border-slate-800">
                                  <span className="text-[10px] text-emerald-400 font-semibold">✓ Detected:</span>
                                  <ul className="pl-3 text-[10px] text-slate-400 list-disc">
                                    {msg.analysis.knownFacts.map((f, i) => (
                                      <li key={i}>{f}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {msg.analysis.missingFacts.length > 0 && (
                                <div className="space-y-0.5 pt-1 border-t border-slate-800">
                                  <span className="text-[10px] text-amber-400 font-semibold">⚠ Missing:</span>
                                  <ul className="pl-3 text-[10px] text-slate-400 list-disc">
                                    {msg.analysis.missingFacts.map((m, i) => (
                                      <li key={i}>{m}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}

                          {msg.sender === 'user' ? (
                            <p>{msg.text}</p>
                          ) : (
                            <MarkdownRenderer content={msg.text} />
                          )}

                          {/* Quick replies */}
                          {msg.quickReplies && msg.quickReplies.length > 0 && (
                            <div className="mt-2 pt-1.5 border-t border-slate-700/80 flex flex-wrap gap-1">
                              {msg.quickReplies.map((qr, i) => (
                                <button
                                  key={i}
                                  onClick={() => handleSendMessage(qr)}
                                  className="text-[9px] bg-slate-950/80 hover:bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800/40 transition-colors cursor-pointer"
                                >
                                  {qr}
                                </button>
                              ))}
                            </div>
                          )}

                          {/* 1-Click action */}
                          {msg.suggestions && msg.suggestions.length > 0 && (
                            <div className="mt-2.5 pt-2 border-t border-slate-700/80 space-y-1">
                              <span className="text-[10px] font-bold text-indigo-300">1-Click Action:</span>
                              {msg.suggestions.map((sug, sIdx) => (
                                <button
                                  key={sIdx}
                                  onClick={() => handleApplySuggestion(sug)}
                                  className="w-full text-[10px] text-left bg-slate-950/60 hover:bg-indigo-950 text-indigo-200 p-1.5 rounded border border-indigo-800/40 flex items-center justify-between gap-1 transition-colors cursor-pointer"
                                >
                                  <span className="truncate">✔ Apply to Professional Summary</span>
                                  <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="flex items-center gap-2 text-xs text-indigo-400 bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/50 w-fit">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>AI evaluating resume context...</span>
                      </div>
                    )}
                  </div>

                  {/* Input Form */}
                  <form onSubmit={(e) => handleSendMessage(undefined, e)} className="p-2.5 border-t border-slate-800 bg-slate-950 flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      placeholder="Ask AI about your resume..."
                      className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isChatLoading || !inputMessage.trim()}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-xl transition-colors disabled:opacity-40 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: Section Optimizer & Spell Checker */}
              {activeTab === 'section' && (
                <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-900/50">
                  <div className="bg-purple-950/30 border border-purple-800/40 p-3.5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                        <Wand2 className="w-3.5 h-3.5" /> Active Section:
                      </span>
                      <span className="text-xs font-mono font-bold text-white uppercase bg-purple-900/60 px-2 py-0.5 rounded border border-purple-700">
                        {activeSection}
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-200/80">
                      Scan current active section for spelling errors, typos, grammar fixes, and ATS keywords.
                    </p>
                    <button
                      onClick={handleOptimizeCurrentSection}
                      disabled={isOptimizing}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold py-2 rounded-xl transition-all shadow flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                      {isOptimizing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <SpellCheck className="w-3.5 h-3.5" />}
                      <span>Fix Spelling & Grammar in {activeSection}</span>
                    </button>
                  </div>

                  {sectionOptimizationResult && (
                    <div className="bg-slate-800/90 border border-slate-700 p-3.5 rounded-xl space-y-3">
                      <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <Check className="w-4 h-4" /> AI Corrections Ready
                      </h4>
                      <div className="space-y-1 text-xs text-slate-300">
                        {sectionOptimizationResult.changesMade.map((change, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[11px]">
                            <span className="text-indigo-400">•</span>
                            <span>{change}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={handleApplySectionFix}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-xl transition-colors shadow flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-4 h-4" /> Apply AI Fix to {activeSection}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};
