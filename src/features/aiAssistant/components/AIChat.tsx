'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, BrainCircuit, Search } from 'lucide-react';
import { AIChatPanel } from './AIChatPanel';
import { useAIAssistantStore } from '../store/useAIAssistantStore';
import { AssistantContextType, AssistantContextPayload } from '../types';
import { CONTEXT_LABELS } from '../config/suggestedQuestions.config';

interface AIChatProps {
  context: AssistantContextType;
  contextPayload?: AssistantContextPayload;
}

export function AIChat({ context, contextPayload }: AIChatProps) {
  const { isOpen, isThinking, isSearching } = useAIAssistantStore((state) => state.byContext[context]);
  const setOpen = useAIAssistantStore((state) => state.setOpen);
  const assistantTitle = CONTEXT_LABELS[context] || 'AI Assistant';

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="ai-chat-panel"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 z-40 w-[min(26rem,calc(100vw-2rem))] h-[min(38rem,calc(100vh-6.5rem))]"
          >
            <AIChatPanel
              context={context}
              contextPayload={contextPayload}
              onClose={() => setOpen(context, false)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.button
          type="button"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setOpen(context, true)}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-2 pl-3.5 pr-4 py-2.5 rounded-full bg-gradient-brand text-white shadow-elegant hover:shadow-glow transition-all duration-200 cursor-pointer border border-white/20"
          title={`Open ${assistantTitle}`}
        >
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12 duration-200" />
            {(isThinking || isSearching) && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-sky-400 animate-ping" />
            )}
          </div>
          <span className="text-xs font-bold tracking-tight">{assistantTitle}</span>

          {/* Quick Active Indicators in trigger badge */}
          <div className="hidden sm:flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
            {isThinking && <BrainCircuit className="w-3 h-3 text-indigo-200" />}
            {isSearching && <Search className="w-3 h-3 text-sky-200" />}
          </div>
        </motion.button>
      )}
    </>
  );
}

