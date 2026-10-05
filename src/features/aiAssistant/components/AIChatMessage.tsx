'use client';

import React from 'react';
import { Sparkles, BrainCircuit, Search, Loader2 } from 'lucide-react';
import { MarkdownRenderer } from '@/shared/components/MarkdownRenderer';
import { SuggestedQuestions } from './SuggestedQuestions';
import { AssistantChatMessage } from '../types';

interface AIChatMessageProps {
  message: AssistantChatMessage;
  onSelectSuggestion: (text: string) => void;
  disabled?: boolean;
}

export function AIChatMessageItem({
  message,
  onSelectSuggestion,
  disabled,
}: AIChatMessageProps) {
  const isUser = message.sender === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end mb-3">
        <div className="bg-primary text-primary-foreground text-xs px-3.5 py-2 rounded-2xl rounded-tr-xs max-w-[85%] leading-relaxed shadow-2xs">
          {message.text}
        </div>
      </div>
    );
  }

  const isPlaceholder =
    message.text === 'Thinking…' ||
    message.text === 'Searching…' ||
    message.text === 'Thinking & Searching…';

  return (
    <div className="flex items-start gap-2.5 mb-3.5 group">
      {/* AI Avatar */}
      <div className="w-6 h-6 rounded-lg bg-gradient-brand text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
        <Sparkles className="w-3.5 h-3.5" />
      </div>

      <div className="flex flex-col gap-2 max-w-[88%] min-w-0">
        {/* AI Message Bubble */}
        <div className="bg-surface-alt/80 border border-border/80 text-ink text-xs px-3.5 py-2.5 rounded-2xl rounded-tl-xs leading-relaxed shadow-2xs">
          {isPlaceholder ? (
            <div className="flex items-center gap-2 text-ink-soft py-0.5">
              {message.isThinking && message.isSearching ? (
                <>
                  <BrainCircuit className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                  <Search className="w-3.5 h-3.5 text-sky-500 animate-bounce" />
                </>
              ) : message.isThinking ? (
                <BrainCircuit className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
              ) : message.isSearching ? (
                <Search className="w-3.5 h-3.5 text-sky-500 animate-bounce" />
              ) : (
                <Loader2 className="w-3.5 h-3.5 text-primary animate-spin" />
              )}
              <span className="font-medium text-xs">{message.text}</span>
            </div>
          ) : (
            <MarkdownRenderer content={message.text} />
          )}
        </div>

        {/* Follow-up suggestions */}
        {!isPlaceholder && message.suggestions && message.suggestions.length > 0 && (
          <div className="pt-0.5">
            <SuggestedQuestions
              questions={message.suggestions}
              onSelect={onSelectSuggestion}
              disabled={disabled}
            />
          </div>
        )}
      </div>
    </div>
  );
}


