"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  SendHorizontal,
  Loader2,
  BrainCircuit,
  Globe,
  Paperclip,
  Mic,
  MicOff,
} from "lucide-react";

interface AIChatInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
  isThinking?: boolean;
  onToggleThinking?: () => void;
  isSearching?: boolean;
  onToggleSearching?: () => void;
}

export function AIChatInput({
  onSend,
  disabled,
  placeholder,
  isThinking = false,
  onToggleThinking,
  isSearching = false,
  onToggleSearching,
}: AIChatInputProps) {
  const [value, setValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [value]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value.trim());
    setValue("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleVoiceToggle = () => {
    if (
      !("webkitSpeechRecognition" in window) &&
      !("SpeechRecognition" in window)
    ) {
      alert(
        "Voice dictation is not natively supported in this browser. Please type your message.",
      );
      return;
    }

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      if (!isListening) {
        setIsListening(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          const transcript = event.results[0]?.[0]?.transcript || "";
          if (transcript) {
            setValue((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
          setIsListening(false);
        };
        recognition.onerror = () => {
          setIsListening(false);
        };
        recognition.onend = () => {
          setIsListening(false);
        };
        recognition.start();
      }
    } catch {
      setIsListening(false);
    }
  };

  const defaultPlaceholder =
    placeholder || "Ask assistant anything... (Shift + Enter for new line)";

  return (
    <div className="p-3 bg-surface/95 border-t border-border/80 shrink-0">
      {/* Unified Input Card Container */}
      <form
        onSubmit={handleSubmit}
        className="relative flex flex-col bg-surface-alt/60 hover:bg-surface-alt/80 focus-within:bg-surface border border-border focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 rounded-2xl sm:rounded-3xl shadow-xs transition-all duration-200 overflow-hidden"
      >
        {/* Top Textarea Section */}
        <div className="px-3.5 pt-3 pb-1">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder={defaultPlaceholder}
            rows={1}
            className="w-full bg-transparent text-xs text-ink placeholder:text-ink-soft/60 outline-none border-none resize-none p-0 max-h-36 min-h-[36px] leading-relaxed scrollbar-thin"
          />
        </div>

        {/* Bottom Toolbar & Action Bar */}
        <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-border/60">
          {/* Left Action Buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Thinking Button */}
            <button
              type="button"
              onClick={onToggleThinking}
              disabled={disabled}
              title={
                isThinking
                  ? "Thinking Mode Active: AI reasons step-by-step"
                  : "Turn on Thinking: Enable deep step-by-step reasoning"
              }
              className={`group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all duration-200 cursor-pointer border ${
                isThinking
                  ? "bg-indigo-50/90 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 shadow-2xs"
                  : "bg-surface/60 hover:bg-surface border-border/70 text-ink-soft hover:text-ink"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <BrainCircuit
                className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 ${
                  isThinking
                    ? "text-indigo-600 dark:text-indigo-400 animate-pulse"
                    : "text-ink-soft"
                }`}
              />
              <span>Think</span>
              {isThinking && (
                <span className="relative flex h-1.5 w-1.5 ml-0.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-600" />
                </span>
              )}
            </button>

            {/* Search Web / Search Button */}
            <button
              type="button"
              onClick={onToggleSearching}
              disabled={disabled}
              title={
                isSearching
                  ? "Search Mode Active: Searches across documents and context"
                  : "Turn on Search: Scan and index across documents and records"
              }
              className={`group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all duration-200 cursor-pointer border ${
                isSearching
                  ? "bg-sky-50/90 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300 shadow-2xs"
                  : "bg-surface/60 hover:bg-surface border-border/70 text-ink-soft hover:text-ink"
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Globe
                className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:scale-110 ${
                  isSearching
                    ? "text-sky-600 dark:text-sky-400"
                    : "text-ink-soft"
                }`}
              />
              <span>Search </span>
              {isSearching && (
                <span className="relative flex h-1.5 w-1.5 ml-0.5">
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-sky-500" />
                </span>
              )}
            </button>

            {/* Voice Dictation Button */}
            {/* <button
              type="button"
              onClick={handleVoiceToggle}
              disabled={disabled}
              title={isListening ? "Listening... click to stop" : "Voice input"}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                isListening
                  ? "text-rose-500 bg-rose-50 dark:bg-rose-950/40 animate-pulse"
                  : "text-ink-soft hover:text-ink hover:bg-surface-alt"
              } disabled:opacity-40 disabled:cursor-not-allowed`}
            >
              {isListening ? (
                <MicOff className="w-3.5 h-3.5" />
              ) : (
                <Mic className="w-3.5 h-3.5" />
              )}
            </button> */}
          </div>

          {/* Right Action: Shortcut Hint & Circular Send Button */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-ink-soft/70 hidden sm:inline-flex items-center gap-1 select-none">
              Press{" "}
              <kbd className="px-1 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-ink-soft shadow-2xs">
                Enter
              </kbd>{" "}
              to send
            </span>

            <button
              type="submit"
              disabled={disabled || !value.trim()}
              className="w-8 h-8 rounded-full bg-gradient-brand text-white shadow-elegant hover:shadow-glow active:scale-95 disabled:opacity-35 disabled:cursor-not-allowed disabled:shadow-none transition-all flex items-center justify-center cursor-pointer shrink-0"
              aria-label="Send message"
            >
              {disabled ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <SendHorizontal className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
