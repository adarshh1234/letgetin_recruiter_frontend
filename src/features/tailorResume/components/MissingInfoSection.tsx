"use client";

import React, { useState } from "react";
import { AlertCircle, Loader2, Sparkles, Check } from "lucide-react";
import { apiClient } from "@/shared/services/apiClient";
import { useTailorResumeStore } from "../store/useTailorResumeStore";
import { MissingSection, TailoringChangeType, TailoringSection } from "../types";

const SECTION_LABELS: Record<TailoringSection, string> = {
  summary: "Professional Summary",
  experience: "Experience",
  skills: "Skills",
  projects: "Projects",
};

interface AiChatApiResponse {
  reply?: string;
  data?: AiChatApiResponse;
}

function MissingSectionCard({ missing, jobDescription }: { missing: MissingSection; jobDescription: string }) {
  const { addChatSuggestion } = useTailorResumeStore();
  const [rawInput, setRawInput] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleGetAiHelp = async () => {
    if (!rawInput.trim() || isBusy) return;
    setIsBusy(true);
    try {
      const res = await apiClient.post<never, AiChatApiResponse>("/ai/chat", {
        message: `The job description requires strengths related to the "${SECTION_LABELS[missing.section]}" section. Here is the raw information I can provide, in my own words: "${rawInput.trim()}". Please write professional resume-ready ${SECTION_LABELS[missing.section].toLowerCase()} content based ONLY on what I just told you - do not add any experience, skills, or metrics I didn't mention.`,
        resumeContext: {},
        activeResumeContext: {
          section: "tailorResumeMissingInfo",
          targetSection: missing.section,
          jobDescription: jobDescription.slice(0, 3000),
        },
        conversationHistory: [],
        stream: false,
      });
      const data = res.data || res;
      const proposedText = (data.reply || "").trim();
      if (proposedText) {
        const changeType: TailoringChangeType = "addition";
        await addChatSuggestion({
          section: missing.section,
          changeType,
          originalText: "",
          proposedText,
          reason: `Added from the information you provided for ${SECTION_LABELS[missing.section]}.`,
          relatedKeywords: [],
        });
        setIsDone(true);
      }
    } catch {
      // Non-fatal: the user can just retry: no partial/corrupt suggestion is ever created.
    } finally {
      setIsBusy(false);
    }
  };

  if (isDone) {
    return (
      <div className="border border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl p-3.5 flex items-center gap-2">
        <Check className="w-4 h-4 text-emerald-600 shrink-0" />
        <p className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
          Added {SECTION_LABELS[missing.section]} content to your suggestions - review it below.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-amber-300/60 bg-amber-50/60 dark:bg-amber-500/10 dark:border-amber-500/30 rounded-2xl p-3.5 space-y-2.5">
      <div className="flex items-start gap-2">
        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-bold text-ink">{SECTION_LABELS[missing.section]}</p>
          <p className="text-[11px] text-ink-soft mt-0.5">{missing.reason}</p>
        </div>
      </div>
      <textarea
        value={rawInput}
        onChange={(e) => setRawInput(e.target.value)}
        rows={3}
        placeholder={`Tell us about your ${SECTION_LABELS[missing.section].toLowerCase()} in your own words...`}
        className="w-full text-xs bg-surface border border-border rounded-xl p-2.5 leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary-glow resize-none"
      />
      <button
        type="button"
        onClick={handleGetAiHelp}
        disabled={isBusy || !rawInput.trim()}
        className="inline-flex items-center gap-1.5 text-xs font-bold bg-gradient-brand text-white px-3.5 py-2 rounded-xl shadow-elegant disabled:opacity-50 cursor-pointer"
      >
        {isBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
        <span>{isBusy ? "Writing..." : "Get AI Help"}</span>
      </button>
    </div>
  );
}

export function MissingInfoSection({ missingSections, jobDescription }: { missingSections: MissingSection[]; jobDescription: string }) {
  if (missingSections.length === 0) return null;

  return (
    <div className="p-4 border-b border-border space-y-2.5">
      <p className="text-xs font-bold text-ink">A few things would help</p>
      <p className="text-[11px] text-ink-soft -mt-1.5">
        This role needs more than your resume currently has in these areas. Add real details and AI will turn them into
        resume-ready content for you to review.
      </p>
      {missingSections.map((m) => (
        <MissingSectionCard key={m.section} missing={m} jobDescription={jobDescription} />
      ))}
    </div>
  );
}
