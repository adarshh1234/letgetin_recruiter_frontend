"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Globe, Sparkles, ExternalLink } from "lucide-react";

interface UrlAutoSuggestInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
  required?: boolean;
  autoFocus?: boolean;
}

const COMMON_EXTENSIONS = [".com", ".io", ".ai", ".co", ".org", ".tech", ".net"];

const POPULAR_DOMAINS = [
  "google.com",
  "microsoft.com",
  "amazon.com",
  "apple.com",
  "meta.com",
  "stripe.com",
  "netflix.com",
  "spotify.com",
  "airbnb.com",
  "uber.com",
  "openai.com",
  "github.com",
  "notion.so",
  "slack.com",
  "salesforce.com",
  "adobe.com",
  "twitter.com",
  "linkedin.com",
];

export function UrlAutoSuggestInput({
  value,
  onChange,
  placeholder = "https://your-company.com",
  disabled = false,
  className = "",
  id,
  required = false,
  autoFocus = false,
}: UrlAutoSuggestInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const suggestions = useMemo(() => {
    const raw = value.trim();
    if (!raw || raw.length < 2) return [];

    // Strip protocols & www for processing base name
    const cleaned = raw
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .split("/")[0]
      .trim();

    if (!cleaned) return [];

    const list: string[] = [];

    // Check popular domain matches
    const popularMatches = POPULAR_DOMAINS.filter((d) =>
      d.toLowerCase().includes(cleaned.toLowerCase())
    ).slice(0, 3);

    for (const d of popularMatches) {
      list.push(`https://${d}`);
      if (!list.includes(`https://www.${d}`)) {
        list.push(`https://www.${d}`);
      }
    }

    // Has a specific extension already? e.g. "acme.io"
    const hasExtension = /\.[a-z]{2,}$/i.test(cleaned);

    if (hasExtension) {
      if (!list.includes(`https://${cleaned}`)) list.push(`https://${cleaned}`);
      if (!list.includes(`https://www.${cleaned}`)) list.push(`https://www.${cleaned}`);
    } else {
      // Generate common extension suggestions
      COMMON_EXTENSIONS.forEach((ext) => {
        const item = `https://${cleaned}${ext}`;
        if (!list.includes(item)) list.push(item);
      });
      // Also suggest www.
      const wwwItem = `https://www.${cleaned}.com`;
      if (!list.includes(wwwItem)) list.push(wwwItem);
    }

    // Return unique suggestions (capped at 5)
    return Array.from(new Set(list)).slice(0, 5);
  }, [value]);

  const handleSelect = (suggestedUrl: string) => {
    onChange(suggestedUrl);
    setIsOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "ArrowDown" && suggestions.length > 0) {
        setIsOpen(true);
        setHighlightedIndex(0);
        e.preventDefault();
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[highlightedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative flex items-center">
        <Globe className="w-4 h-4 text-ink-soft absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          ref={inputRef}
          id={id}
          type="url"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoFocus={autoFocus}
          autoComplete="off"
          className={`input-base pl-10 pr-24 ${className}`}
        />
        {value.trim().length > 1 && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-semibold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full pointer-events-none">
            <Sparkles className="w-2.5 h-2.5" /> Suggesting
          </span>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-surface dark:bg-slate-900 border border-border dark:border-slate-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-border/60 bg-surface-alt/40 flex items-center justify-between text-[11px] text-ink-soft">
            <span className="font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-primary-glow" /> URL Suggestions
            </span>
            <span>Tab / Click to select</span>
          </div>

          <div className="p-1.5 space-y-1 max-h-56 overflow-y-auto">
            {suggestions.map((item, idx) => {
              const isSelected = idx === highlightedIndex;
              const displayDomain = item.replace(/^https?:\/\//i, "");

              return (
                <button
                  key={item}
                  type="button"
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  onClick={() => handleSelect(item)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-xs text-left transition cursor-pointer ${
                    isSelected
                      ? "bg-primary/15 text-primary-glow font-bold border border-primary/20 shadow-xs"
                      : "text-ink hover:bg-surface-alt/70"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <Globe className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-primary-glow" : "text-ink-soft"}`} />
                    <span className="truncate font-mono text-[11px]">{displayDomain}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] text-ink-soft font-medium shrink-0">
                    <ExternalLink className="w-2.5 h-2.5" /> Complete
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
