import { create } from 'zustand';
import { streamAiChat } from '@/shared/services/aiStream';
import { aiAssistantService } from '../services/aiAssistantService';
import {
  CONTEXT_GREETINGS,
  CONTEXT_STATUS_BADGES,
  CONTEXT_THOUGHT_SUMMARIES,
} from '../config/suggestedQuestions.config';
import {
  AssistantContextType,
  AssistantMode,
  AssistantContextPayload,
  AssistantChatMessage,
  AssistantResponseData,
} from '../types';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
const CONTEXTS: AssistantContextType[] = ['explore', 'profile', 'resume', 'drive'];

export interface ContextState {
  isOpen: boolean;
  mode: AssistantMode;
  isThinking: boolean;
  isSearching: boolean;
  messages: AssistantChatMessage[];
  isLoading: boolean;
}

function getTimestamp(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function createInitialContextState(context: AssistantContextType): ContextState {
  return {
    isOpen: false,
    mode: 'instant',
    isThinking: false,
    isSearching: false,
    messages: [
      {
        id: `greeting-${context}`,
        sender: 'ai',
        text: CONTEXT_GREETINGS[context],
        timestamp: getTimestamp(),
      },
    ],
    isLoading: false,
  };
}

interface AIAssistantStoreState {
  byContext: Record<AssistantContextType, ContextState>;
  setOpen: (context: AssistantContextType, open: boolean) => void;
  setMode: (context: AssistantContextType, mode: AssistantMode) => void;
  setThinking: (context: AssistantContextType, enabled: boolean) => void;
  toggleThinking: (context: AssistantContextType) => void;
  setSearching: (context: AssistantContextType, enabled: boolean) => void;
  toggleSearching: (context: AssistantContextType) => void;
  clearConversation: (context: AssistantContextType) => void;
  sendMessage: (context: AssistantContextType, text: string, contextPayload?: AssistantContextPayload) => Promise<void>;
}

function initialByContext(): Record<AssistantContextType, ContextState> {
  return CONTEXTS.reduce(
    (acc, ctx) => {
      acc[ctx] = createInitialContextState(ctx);
      return acc;
    },
    {} as Record<AssistantContextType, ContextState>
  );
}

export const useAIAssistantStore = create<AIAssistantStoreState>((set, get) => ({
  byContext: initialByContext(),

  setOpen: (context, open) =>
    set((state) => ({
      byContext: { ...state.byContext, [context]: { ...state.byContext[context], isOpen: open } },
    })),

  setMode: (context, mode) =>
    set((state) => ({
      byContext: { ...state.byContext, [context]: { ...state.byContext[context], mode } },
    })),

  setThinking: (context, enabled) =>
    set((state) => ({
      byContext: { ...state.byContext, [context]: { ...state.byContext[context], isThinking: enabled } },
    })),

  toggleThinking: (context) =>
    set((state) => ({
      byContext: {
        ...state.byContext,
        [context]: { ...state.byContext[context], isThinking: !state.byContext[context].isThinking },
      },
    })),

  setSearching: (context, enabled) =>
    set((state) => ({
      byContext: { ...state.byContext, [context]: { ...state.byContext[context], isSearching: enabled } },
    })),

  toggleSearching: (context) =>
    set((state) => ({
      byContext: {
        ...state.byContext,
        [context]: { ...state.byContext[context], isSearching: !state.byContext[context].isSearching },
      },
    })),

  clearConversation: (context) =>
    set((state) => ({
      byContext: {
        ...state.byContext,
        [context]: {
          ...createInitialContextState(context),
          isOpen: state.byContext[context].isOpen,
          mode: state.byContext[context].mode,
          isThinking: state.byContext[context].isThinking,
          isSearching: state.byContext[context].isSearching,
        },
      },
    })),

  sendMessage: async (context, text, contextPayload) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (get().byContext[context].isLoading) return;

    const currentContextState = get().byContext[context];
    const mode = currentContextState.mode;
    const isThinking = currentContextState.isThinking || mode === 'expert';
    const isSearching = currentContextState.isSearching;

    const timestamp = getTimestamp();
    const userMsg: AssistantChatMessage = { id: `user-${Date.now()}`, sender: 'user', text: trimmed, timestamp };
    const aiMsgId = `ai-${Date.now()}`;

    let loadingPlaceholder = 'Thinking…';
    if (isThinking && isSearching) {
      loadingPlaceholder = 'Thinking & Searching…';
    } else if (isSearching) {
      loadingPlaceholder = 'Searching…';
    } else if (isThinking) {
      loadingPlaceholder = 'Thinking…';
    }

    const placeholderMsg: AssistantChatMessage = {
      id: aiMsgId,
      sender: 'ai',
      text: loadingPlaceholder,
      timestamp,
      isThinking,
      isSearching,
    };

    set((state) => ({
      byContext: {
        ...state.byContext,
        [context]: {
          ...state.byContext[context],
          messages: [...state.byContext[context].messages, userMsg, placeholderMsg],
          isLoading: true,
        },
      },
    }));

    const historyPayload = get()
      .byContext[context].messages.filter((m) => m.id !== aiMsgId)
      .slice(-20)
      .map((m) => ({ sender: m.sender, text: m.text }));

    const mergedPayload: AssistantContextPayload = {
      ...(contextPayload || {}),
      enableThinking: isThinking,
      enableDeepSearch: isSearching,
    };

    const applyPartial = (partialText: string) => {
      set((state) => ({
        byContext: {
          ...state.byContext,
          [context]: {
            ...state.byContext[context],
            messages: state.byContext[context].messages.map((m) => (m.id === aiMsgId ? { ...m, text: partialText } : m)),
          },
        },
      }));
    };

    const applyFinal = (data: AssistantResponseData) => {
      set((state) => ({
        byContext: {
          ...state.byContext,
          [context]: {
            ...state.byContext[context],
            messages: state.byContext[context].messages.map((m) =>
              m.id === aiMsgId
                ? {
                    ...m,
                    text: data.reply,
                    suggestions: data.suggestions,
                    relevant: data.relevant,
                    isThinking,
                    isSearching,
                    timestamp: getTimestamp(),
                  }
                : m
            ),
            isLoading: false,
          },
        },
      }));
    };

    const applyFallback = (error: unknown) => {
      console.warn(`[useAIAssistantStore] Falling back for context "${context}":`, error);
      const fallbackText = "I'm having trouble reaching the assistant right now. Please try again in a moment.";
      set((state) => ({
        byContext: {
          ...state.byContext,
          [context]: {
            ...state.byContext[context],
            messages: state.byContext[context].messages.map((m) =>
              m.id === aiMsgId
                ? {
                    ...m,
                    text: fallbackText,
                    isLoading: false,
                  }
                : m
            ),
            isLoading: false,
          },
        },
      }));
    };

    try {
      const data = await streamAiChat<AssistantResponseData>({
        url: `${NEXT_PUBLIC_API_URL}/ai/assistant`,
        body: {
          message: trimmed,
          context,
          mode,
          contextPayload: mergedPayload,
          conversationHistory: historyPayload,
        },
        onPartialReply: applyPartial,
      });
      applyFinal(data);
    } catch (streamError) {
      console.warn('[useAIAssistantStore] Streaming fetch fallback to standard API client:', streamError);
      try {
        const data = await aiAssistantService.chat({
          message: trimmed,
          context,
          mode,
          contextPayload: mergedPayload,
          conversationHistory: historyPayload,
        });
        applyFinal(data);
      } catch (err) {
        applyFallback(err);
      }
    }
  },
}));

