"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Check,
  RefreshCw,
  X,
  RotateCcw,
  CheckCircle,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Edit3,
  Search,
  Mic,
  MicOff,
  Bot,
  Zap,
  Copy,
  Sparkles,
  Plus,
} from "lucide-react";
import { useAiCoachStore } from "../../store/useAiCoachStore";
import { useResumeStore } from "../../store/useResumeStore";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface EmbeddedAiChatProps {
  onClose?: () => void;
}

export const EmbeddedAiChat: React.FC<EmbeddedAiChatProps> = ({ onClose }) => {
  const {
    messages,
    isChatLoading,
    appliedNotice,
    copiedMsgId,
    sendMessage,
    setCopiedMsgId,
    clearChat,
    triggerExperienceAi,
    triggerSkillsAi,
  } = useAiCoachStore();

  const { resume } = useResumeStore();
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [appliedActionIds, setAppliedActionIds] = useState<Set<string>>(
    new Set(),
  );
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const existingSkillsSet = new Set(
    (resume.content.skills || []).map((s) =>
      (typeof s === "string" ? s : s.name).trim().toLowerCase(),
    ),
  );

  // Scroll to bottom on updates
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isChatLoading]);

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleActionClick = (actionId: string, actionFn: () => void) => {
    actionFn();
    setAppliedActionIds((prev) => new Set(prev).add(actionId));
  };

  const toggleListening = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert(
        "Speech recognition is not supported in this browser. Please type your message.",
      );
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInputMessage((prev) =>
            prev ? `${prev} ${transcript}` : transcript,
          );
        }
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;
    const text = inputMessage.trim();
    setInputMessage("");
    sendMessage(text);
  };

  const cleanUserText = (raw: string) => {
    return raw.replace(/\*\*/g, "").trim();
  };

  return (
    <div className="h-full flex flex-col bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
      {/* Top Header Bar */}
      <div className="p-3 bg-surface border-b border-border flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-brand text-primary-foreground flex items-center justify-center shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-ink tracking-tight block">
              LetGetIn AI Coach
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Context Active
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={clearChat}
            className="text-xs font-semibold text-ink-soft hover:text-ink px-2.5 py-1.5 rounded-xl border border-border hover:bg-surface-alt transition-all flex items-center gap-1.5 cursor-pointer"
            title="Reset Chat History"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-ink-soft hover:text-ink px-2.5 py-1.5 rounded-xl border border-border hover:bg-surface-alt transition-all flex items-center gap-1 cursor-pointer"
              title="Close Chat Panel"
            >
              <span>Close</span>
              <X className="w-3.5 h-3.5 text-rose-500" />
            </button>
          )}
        </div>
      </div>

      {/* Main Chat Stream Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-surface-alt/30">
        {/* Applied Action Notification Banner */}
        {appliedNotice && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-3.5 py-2.5 rounded-xl flex items-center gap-2 animate-fade-up shadow-sm">
            <Check className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>{appliedNotice}</span>
          </div>
        )}

        {/* 4 Interactive Recommendation Starter Cards */}
        {messages.length <= 1 && (
          <div className="grid grid-cols-1 gap-2.5">
            {/* Card 1: Benchmark Comparison */}
            <button
              type="button"
              onClick={() =>
                sendMessage(
                  "How does my resume compare to top candidates with my job title? What am I missing and how can I improve?",
                )
              }
              className="text-left bg-surface border border-amber-200/80 hover:border-amber-400 p-3 rounded-2xl transition-all shadow-xs hover:shadow-sm group cursor-pointer"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink group-hover:text-amber-600 leading-tight">
                    How does my resume compare to top candidates? What am I
                    missing?
                  </h4>
                  <p className="text-[11px] text-ink-soft mt-1">
                    Get a prioritized recruiter benchmark review
                  </p>
                </div>
              </div>
            </button>

            {/* Card 2: Suggest Skills */}
            <button
              type="button"
              onClick={() => triggerSkillsAi()}
              className="text-left bg-surface border border-sky-200/80 hover:border-sky-400 p-3 rounded-2xl transition-all shadow-xs hover:shadow-sm group cursor-pointer"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-sky-100 dark:bg-sky-950/50 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                  <PlusCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink group-hover:text-sky-600 leading-tight">
                    Suggest high-demand technical skills for my role
                  </h4>
                  <p className="text-[11px] text-ink-soft mt-1">
                    Boost ATS match with 1-click skill additions
                  </p>
                </div>
              </div>
            </button>

            {/* Card 3: Improve Existing Experience */}
            <button
              type="button"
              onClick={() =>
                sendMessage(
                  "Review and strengthen my work experience bullet points with action verbs and quantifiable metrics.",
                )
              }
              className="text-left bg-surface border border-emerald-200/80 hover:border-emerald-400 p-3 rounded-2xl transition-all shadow-xs hover:shadow-sm group cursor-pointer"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink group-hover:text-emerald-600 leading-tight">
                    Enhance bullet points with action verbs & metric impact
                  </h4>
                  <p className="text-[11px] text-ink-soft mt-1">
                    Generate high-converting recruiter bullets
                  </p>
                </div>
              </div>
            </button>

            {/* Card 4: ATS Keywords */}
            <button
              type="button"
              onClick={() =>
                sendMessage(
                  "Highlight top keywords and ATS gaps in my resume content.",
                )
              }
              className="text-left bg-surface border border-indigo-200/80 hover:border-indigo-400 p-3 rounded-2xl transition-all shadow-xs hover:shadow-sm group cursor-pointer"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Search className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink group-hover:text-indigo-600 leading-tight">
                    Highlight top keywords I am missing for ATS
                  </h4>
                  <p className="text-[11px] text-ink-soft mt-1">
                    Find missing keyword keywords and section gaps
                  </p>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Conversation Thread */}
        <div className="space-y-4 pt-1">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[95%] w-full rounded-2xl p-3.5 text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-gradient-brand text-primary-foreground font-medium rounded-br-none shadow-sm ml-auto max-w-[85%]"
                    : "bg-surface border border-border text-ink rounded-bl-none shadow-xs"
                }`}
              >
                {/* AI Bubble Header */}
                {msg.sender === "ai" && (
                  <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-border text-[11px]">
                    <span className="font-bold text-ink flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary-glow" />
                      LetGetIn AI Coach
                    </span>
                  </div>
                )}

                {/* User-Visible Resume Analysis Box */}
                {msg.sender === "ai" &&
                  msg.analysis &&
                  (msg.analysis.knownFacts.length > 0 ||
                    msg.analysis.missingFacts.length > 0 ||
                    msg.analysis.reason) && (
                    <div className="mb-3 p-3 rounded-xl border bg-surface-alt/70 border-border/80 shadow-2xs space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-ink text-[11px] uppercase tracking-wider">
                          <Search className="w-3.5 h-3.5 text-primary-glow" />
                          <span>Resume Analysis</span>
                        </div>
                        {msg.status === "NEEDS_INFORMATION" && (
                          <span className="text-[10px] font-bold bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />
                            Needs Details
                          </span>
                        )}
                        {msg.status === "READY" && (
                          <span className="text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                            Ready to Apply
                          </span>
                        )}
                        {msg.status === "ANSWER" && (
                          <span className="text-[10px] font-bold bg-sky-500/15 text-sky-700 dark:text-sky-400 border border-sky-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-sky-500 shrink-0" />
                            Context Verified
                          </span>
                        )}
                      </div>

                      {/* Detected Facts */}
                      {msg.analysis.knownFacts &&
                        msg.analysis.knownFacts.length > 0 && (
                          <div className="space-y-1 pt-1.5 border-t border-border/50">
                            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                              <Check className="w-3 h-3 text-emerald-500" />{" "}
                              Detected Profile Facts:
                            </span>
                            <ul className="space-y-0.5 pl-3.5 text-[11px] text-ink-soft">
                              {msg.analysis.knownFacts.map((fact, fIdx) => (
                                <li
                                  key={fIdx}
                                  className="list-disc leading-tight"
                                >
                                  {fact}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {/* Missing Information */}
                      {msg.analysis.missingFacts &&
                        msg.analysis.missingFacts.length > 0 && (
                          <div className="space-y-1 pt-1.5 border-t border-border/50">
                            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3 text-amber-500" />{" "}
                              Missing Information:
                            </span>
                            <ul className="space-y-0.5 pl-3.5 text-[11px] text-ink-soft">
                              {msg.analysis.missingFacts.map((miss, mIdx) => (
                                <li
                                  key={mIdx}
                                  className="list-disc leading-tight"
                                >
                                  {miss}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                      {/* Concise conclusion/reason */}
                      {msg.analysis.reason && (
                        <p className="text-[10px] text-ink-soft italic pt-1 border-t border-border/40">
                          {msg.analysis.reason}
                        </p>
                      )}
                    </div>
                  )}

                {/* Message Body */}
                {msg.sender === "user" ? (
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {cleanUserText(msg.text)}
                  </p>
                ) : (
                  <MarkdownRenderer content={msg.text} />
                )}

                {/* Quick Reply Suggestion Chips */}
                {msg.sender === "ai" &&
                  msg.quickReplies &&
                  msg.quickReplies.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-border/60 flex flex-wrap gap-1.5">
                      {msg.quickReplies.map((qr, qrIdx) => (
                        <button
                          key={qrIdx}
                          type="button"
                          onClick={() => sendMessage(qr)}
                          className="text-[10px] font-semibold bg-surface-alt hover:bg-primary/15 text-ink border border-border hover:border-primary/40 px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-primary-glow shrink-0" />
                          <span>{qr}</span>
                        </button>
                      ))}
                    </div>
                  )}

                {/* 1-Click Interactive Actions */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-border space-y-2">
                    <span className="text-[10px] font-bold text-primary-glow uppercase tracking-wider block">
                      ⚡ 1-Click Resume Actions:
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {msg.suggestions.map((sug, sIdx) => {
                        const isApplied = appliedActionIds.has(
                          sug.id || `sug-${sIdx}`,
                        );
                        const isSkillChip = sug.label.startsWith('+ Add "');
                        const skillNameMatch =
                          sug.label.match(/\+ Add "(.*?)"/);
                        const isAlreadyInSkills = skillNameMatch
                          ? existingSkillsSet.has(
                              skillNameMatch[1].trim().toLowerCase(),
                            )
                          : false;

                        if (isSkillChip) {
                          return (
                            <button
                              key={sug.id || sIdx}
                              type="button"
                              disabled={isApplied || isAlreadyInSkills}
                              onClick={() =>
                                handleActionClick(
                                  sug.id || `sug-${sIdx}`,
                                  sug.action,
                                )
                              }
                              className={`text-xs text-left px-3 py-2 rounded-xl border flex items-center justify-between transition-all font-semibold cursor-pointer shadow-xs ${
                                isApplied || isAlreadyInSkills
                                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 cursor-default opacity-85"
                                  : "bg-surface-alt hover:bg-primary/10 border-border hover:border-primary/40 text-ink"
                              }`}
                            >
                              <span className="truncate pr-2">{sug.label}</span>
                              {isApplied || isAlreadyInSkills ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              ) : (
                                <Plus className="w-3.5 h-3.5 text-primary-glow shrink-0" />
                              )}
                            </button>
                          );
                        }

                        return (
                          <button
                            key={sug.id || sIdx}
                            type="button"
                            onClick={() =>
                              handleActionClick(
                                sug.id || `sug-${sIdx}`,
                                sug.action,
                              )
                            }
                            className={`w-full text-xs text-left p-2.5 rounded-xl border flex items-center justify-between transition-all font-bold cursor-pointer shadow-xs group ${
                              isApplied
                                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600"
                                : "bg-primary/10 hover:bg-primary/20 text-ink border-primary/30"
                            }`}
                          >
                            <span className="truncate pr-2 group-hover:text-primary-glow">
                              {isApplied
                                ? `✔ Applied: ${sug.label.replace(/^✔\s*/, "")}`
                                : sug.label}
                            </span>
                            {isApplied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ) : (
                              <Zap className="w-3.5 h-3.5 text-primary-glow shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              <span className="text-[9px] text-ink-soft mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {isChatLoading && (
            <div className="flex items-center gap-2 text-xs text-primary-glow bg-primary/10 p-2.5 rounded-xl border border-primary/20 w-fit shadow-xs animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>LetGetIn AI Coach is analyzing your resume data...</span>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>
      </div>

      {/* Input Form & Footer */}
      <div className="p-3 border-t border-border bg-surface space-y-2">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask AI Coach advice or request section improvements..."
            className="flex-1 bg-surface-alt/70 border border-border rounded-xl px-3.5 py-2 text-xs text-ink focus:outline-none focus:border-primary-glow placeholder-ink-soft font-medium"
          />

          {/* Voice Input */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isListening
                ? "bg-rose-500/20 border-rose-500 text-rose-500 animate-pulse"
                : "bg-surface-alt border-border text-ink-soft hover:text-ink"
            }`}
            title={isListening ? "Stop listening" : "Start voice input"}
          >
            {isListening ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>

          {/* Send Button */}
          <button
            type="submit"
            disabled={isChatLoading || !inputMessage.trim()}
            className="bg-gradient-brand disabled:opacity-40 text-primary-foreground font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-elegant flex items-center justify-center shrink-0 cursor-pointer hover:shadow-glow"
          >
            <span>Send</span>
          </button>
        </form>

        <p className="text-[10px] text-center text-ink-soft">
          LetGetIn AI Coach operates directly on your open resume data.
          Unlimited SaaS tokens enabled.
        </p>
      </div>
    </div>
  );
};
