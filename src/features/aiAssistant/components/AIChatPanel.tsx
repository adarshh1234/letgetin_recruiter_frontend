"use client";

import React from "react";
import {
  X,
  RotateCcw,
  Sparkles,
  FileText,
  User,
  Compass,
  FolderOpen,
  BrainCircuit,
  Search,
} from "lucide-react";
import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "@/components/ui/message-scroller";
import { AIChatMessageItem } from "./AIChatMessage";
import { AIChatInput } from "./AIChatInput";
import { AIChatModeSelector } from "./AIChatModeSelector";
import { SuggestedQuestions } from "./SuggestedQuestions";
import {
  CONTEXT_LABELS,
  CONTEXT_SUBTITLES,
  SUGGESTED_QUESTIONS,
} from "../config/suggestedQuestions.config";
import { useAIAssistantStore } from "../store/useAIAssistantStore";
import { AssistantContextType, AssistantContextPayload } from "../types";

interface AIChatPanelProps {
  context: AssistantContextType;
  contextPayload?: AssistantContextPayload;
  onClose: () => void;
}

const CONTEXT_ICONS: Record<AssistantContextType, React.ElementType> = {
  resume: FileText,
  profile: User,
  explore: Compass,
  drive: FolderOpen,
};

const CONTEXT_PLACEHOLDERS: Record<AssistantContextType, string> = {
  resume: "Ask about your resume, ATS score, bullet points…",
  profile: "Ask about your career profile, skills, bio…",
  explore: "Ask about jobs, salary benchmarks, opportunities…",
  drive: "Ask about your uploaded files & documents…",
};

export function AIChatPanel({
  context,
  contextPayload,
  onClose,
}: AIChatPanelProps) {
  const { messages, isLoading, mode, isThinking, isSearching } =
    useAIAssistantStore((state) => state.byContext[context]);
  const setMode = useAIAssistantStore((state) => state.setMode);
  const toggleThinking = useAIAssistantStore((state) => state.toggleThinking);
  const toggleSearching = useAIAssistantStore((state) => state.toggleSearching);
  const clearConversation = useAIAssistantStore(
    (state) => state.clearConversation,
  );
  const sendMessage = useAIAssistantStore((state) => state.sendMessage);

  const handleSend = (text: string) => {
    sendMessage(context, text, contextPayload);
  };

  const suggestedStarterQuestions = SUGGESTED_QUESTIONS[context][mode];
  const ContextIcon = CONTEXT_ICONS[context] || Sparkles;

  return (
    <div className="flex flex-col h-full w-full bg-surface border border-border rounded-2xl sm:rounded-3xl shadow-elegant overflow-hidden transition-all">
      {/* Top Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-border bg-surface-alt/70 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-brand text-white flex items-center justify-center shrink-0 shadow-xs ring-2 ring-primary/10">
            <ContextIcon className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-ink truncate">
                {CONTEXT_LABELS[context]}
              </span>
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
            </div>
            <span className="text-[10px] text-ink-soft truncate">
              {CONTEXT_SUBTITLES[context]}
            </span>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => clearConversation(context)}
            title="Reset conversation"
            className="p-1.5 rounded-lg text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Close Assistant"
            className="p-1.5 rounded-lg text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mode & Active Capabilities Bar */}
      <div className="px-3.5 py-1.5 border-b border-border/80 bg-surface/90 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-ink-soft uppercase tracking-wider">
            Mode:
          </span>
          <AIChatModeSelector
            mode={mode}
            onChange={(m) => setMode(context, m)}
            disabled={isLoading}
          />
        </div>

        {/* Quick capability status pills */}
        <div className="flex items-center gap-1">
          {isThinking && (
            <span
              title="Thinking active"
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-[10px] font-medium border border-indigo-200 dark:border-indigo-800"
            >
              <BrainCircuit className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Thinking</span>
            </span>
          )}
          {isSearching && (
            <span
              title="Search active"
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 text-[10px] font-medium border border-sky-200 dark:border-sky-800"
            >
              <Search className="w-3 h-3 text-sky-600 dark:text-sky-400" />
              <span className="hidden sm:inline">Search</span>
            </span>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <MessageScrollerProvider>
        <MessageScroller className="flex-1 min-h-0 bg-surface-alt/20">
          <MessageScrollerViewport>
            <MessageScrollerContent className="px-3.5 py-3">
              {messages.map((m) => (
                <MessageScrollerItem key={m.id}>
                  <AIChatMessageItem
                    message={m}
                    onSelectSuggestion={handleSend}
                    disabled={isLoading}
                  />
                </MessageScrollerItem>
              ))}

              {/* Starter suggested questions without extra bulky box */}
              {messages.length <= 1 && (
                <MessageScrollerItem>
                  <div className="pt-1 pb-2">
                    <SuggestedQuestions
                      questions={suggestedStarterQuestions}
                      onSelect={handleSend}
                      disabled={isLoading}
                    />
                  </div>
                </MessageScrollerItem>
              )}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton direction="end" />
        </MessageScroller>
      </MessageScrollerProvider>

      {/* Footer Chat Input with Thinking and Searching Toggles */}
      <AIChatInput
        onSend={handleSend}
        disabled={isLoading}
        isThinking={isThinking}
        onToggleThinking={() => toggleThinking(context)}
        isSearching={isSearching}
        onToggleSearching={() => toggleSearching(context)}
        placeholder={CONTEXT_PLACEHOLDERS[context]}
      />
    </div>
  );
}
