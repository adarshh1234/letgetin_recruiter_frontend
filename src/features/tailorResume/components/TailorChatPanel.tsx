"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Bot, CheckCircle, PlusCircle, Edit3, Search, Loader2, Sparkles, Check } from "lucide-react";
import { apiClient } from "@/shared/services/apiClient";
import { extractBulletStrings } from "@/features/resume/store/useAiCoachStore";
import { useTailorResumeStore } from "../store/useTailorResumeStore";
import { TailoringSection, TailoringChangeType } from "../types";

interface AiChatDraft {
  section?: string;
  content?: unknown;
}

interface AiChatAction {
  type?: string;
  payload?: Record<string, unknown>;
}

interface AiChatApiResponse {
  reply?: string;
  draft?: AiChatDraft | null;
  action?: AiChatAction | null;
  data?: AiChatApiResponse;
}

interface ChatBubble {
  id: string;
  sender: "user" | "ai";
  text: string;
  applyAction: null | {
    section: TailoringSection;
    changeType: TailoringChangeType;
    proposedText: string;
    originalText: string;
    reason: string;
  };
  applied?: boolean;
}

export function TailorChatPanel() {
  const { session, addChatSuggestion } = useTailorResumeStore();
  const [messages, setMessages] = useState<ChatBubble[]>([
    {
      id: "greeting",
      sender: "ai",
      text: "Hi there! I can help you improve your resume for this role. Ask me for feedback, or improvements for specific sections I can directly suggest as edits.",
      applyAction: null,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const idCounterRef = useRef(0);
  const nextId = useCallback((prefix: string) => {
    idCounterRef.current += 1;
    return `${prefix}-${idCounterRef.current}`;
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading || !session) return;
    const userMsg: ChatBubble = { id: nextId("u"), sender: "user", text, applyAction: null };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await apiClient.post<never, AiChatApiResponse>("/ai/chat", {
        message: text,
        resumeContext: {},
        activeResumeContext: {
          section: "tailorResume",
          jobDescription: session.jobDescription.slice(0, 3000),
        },
        conversationHistory: messages.slice(-10).map((m) => ({ sender: m.sender, text: m.text })),
        stream: false,
      });
      const data = res.data || res;

      let applyAction: ChatBubble["applyAction"] = null;
      const draft = data.draft;
      const action = data.action;

      if (action?.type === "UPDATE_SUMMARY" || draft?.section === "summary") {
        const raw = action?.payload ?? draft?.content;
        const proposedText = typeof raw === "string" ? raw : extractBulletStrings(raw).join(" ");
        if (proposedText?.trim()) {
          applyAction = {
            section: "summary",
            changeType: "rewrite",
            proposedText: proposedText.trim(),
            originalText: "",
            reason: "Suggested via AI chat based on the target job description.",
          };
        }
      } else if (draft?.section === "experiences" || action?.type === "ADD_EXPERIENCE_BULLETS") {
        const bullets = extractBulletStrings(action?.payload?.bullets || action?.payload || draft?.content);
        if (bullets.length > 0) {
          applyAction = {
            section: "experience",
            changeType: "addition",
            proposedText: bullets[0],
            originalText: "",
            reason: "Suggested via AI chat based on the target job description.",
          };
        }
      } else if (draft?.section === "skills" || action?.type === "ADD_SKILLS") {
        const skills = extractBulletStrings(action?.payload?.skills || action?.payload || draft?.content);
        if (skills.length > 0) {
          applyAction = {
            section: "skills",
            changeType: "addition",
            proposedText: skills[0],
            originalText: "",
            reason: "Suggested via AI chat based on the target job description.",
          };
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: nextId("a"),
          sender: "ai",
          text: data.reply || "I looked into that for you.",
          applyAction,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId("a"),
          sender: "ai",
          text: "I couldn't reach the AI service just now. Please try again in a moment.",
          applyAction: null,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = async (msgId: string, action: NonNullable<ChatBubble["applyAction"]>) => {
    await addChatSuggestion({
      section: action.section,
      changeType: action.changeType,
      originalText: action.originalText,
      proposedText: action.proposedText,
      reason: action.reason,
      relatedKeywords: [],
    });
    setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, applied: true } : m)));
  };

  const starterCards = [
    {
      icon: CheckCircle,
      color: "amber",
      title: "How does my resume compare to top candidates with my job title? What am I missing and how can I improve?",
      subtitle: "Get a prioritized, actionable review",
    },
    {
      icon: PlusCircle,
      color: "sky",
      title: "Help me add a new experience to my resume",
      subtitle: "Add work experience, projects, or achievements",
    },
    {
      icon: Edit3,
      color: "emerald",
      title: "Help me improve an existing experience in my resume",
      subtitle: "Enhance bullet points and descriptions",
    },
    {
      icon: Search,
      color: "indigo",
      title: "Highlight the top keywords I'm missing for ATS",
      subtitle: "Boost ATS match by filling gaps",
    },
  ];

  return (
    <div className="h-full flex flex-col bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="p-3 border-b border-border flex items-center gap-2">
        <div className="w-7 h-7 rounded-xl bg-gradient-brand text-white flex items-center justify-center shrink-0">
          <Bot className="w-4 h-4" />
        </div>
        <span className="text-xs font-bold text-ink">JobSuit AI</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-alt/30">
        {messages.length <= 1 && (
          <div className="grid grid-cols-1 gap-2.5">
            {starterCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => sendMessage(card.title)}
                  className="text-left bg-surface border border-border hover:border-primary-glow/50 p-3 rounded-2xl transition shadow-xs hover:shadow-sm group cursor-pointer"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-primary/10 text-primary-glow flex items-center justify-center shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-ink leading-tight">{card.title}</h4>
                      <p className="text-[11px] text-ink-soft mt-1">{card.subtitle}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
            <div
              className={`max-w-[90%] rounded-2xl p-3 text-xs leading-relaxed ${
                msg.sender === "user"
                  ? "bg-gradient-brand text-white rounded-br-none"
                  : "bg-surface border border-border text-ink rounded-bl-none"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
              {msg.applyAction && (
                <button
                  type="button"
                  onClick={() => handleApply(msg.id, msg.applyAction!)}
                  disabled={msg.applied}
                  className={`mt-2.5 w-full inline-flex items-center justify-center gap-1.5 text-[11px] font-bold px-3 py-2 rounded-xl border transition cursor-pointer ${
                    msg.applied
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 cursor-default"
                      : "bg-primary/10 hover:bg-primary/20 border-primary/30 text-ink"
                  }`}
                >
                  {msg.applied ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5 text-primary-glow" />}
                  <span>{msg.applied ? "Added to suggestions" : "Apply Suggestion"}</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-primary-glow bg-primary/10 p-2 rounded-xl border border-primary/20 w-fit">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Thinking...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="p-3 border-t border-border flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message..."
          className="flex-1 bg-surface-alt/70 border border-border rounded-xl px-3.5 py-2 text-xs text-ink focus:outline-none focus:border-primary-glow"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-gradient-brand disabled:opacity-40 text-white font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
        >
          Send
        </button>
      </form>
    </div>
  );
}
