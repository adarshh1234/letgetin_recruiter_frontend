"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Eye, EyeOff, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useResumeStore } from "@/features/resume/store/useResumeStore";
import { LivePreviewCanvas } from "@/features/resume/components/preview/LivePreviewCanvas";
import { useTailorResumeStore } from "../store/useTailorResumeStore";
import { applyAcceptedSuggestions } from "../utils/applySuggestions";
import { usePreviewHighlight } from "../hooks/usePreviewHighlight";
import { TailoringSuggestionsPanel } from "./TailoringSuggestionsPanel";
import { TailorCenterColumn } from "./TailorCenterColumn";

interface TailorModeWorkspaceProps {
  sessionId: string;
}

export function TailorModeWorkspace({ sessionId }: TailorModeWorkspaceProps) {
  const router = useRouter();
  const { session, isLoading, error, loadExistingSession, finalize, discard, originalContent, isSaving } =
    useTailorResumeStore();
  // Visualization-only toggle - never swaps the underlying working Resume content, only
  // whether the green change overlay is drawn on top of the (always up to date) preview.
  const [showChanges, setShowChanges] = useState(true);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const resume = useResumeStore((s) => s.resume);

  useEffect(() => {
    loadExistingSession(sessionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  // The preview always shows the working Resume (original + currently accepted/edited
  // suggestions) regardless of the Show Changes toggle - that toggle only controls the
  // highlight overlay below, never the underlying data (see usePreviewHighlight).
  useEffect(() => {
    if (!session || !originalContent) return;
    const { resume: currentResume, setResume } = useResumeStore.getState();
    const nextContent = applyAcceptedSuggestions(originalContent, session.suggestions);
    setResume({ ...currentResume, content: nextContent });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.suggestions]);

  usePreviewHighlight(previewContainerRef, session?.suggestions || [], showChanges, resume.content);

  const handleSaveAndExit = async () => {
    const result = await finalize();
    if (result) {
      toast.success(result.isNew ? "Saved as a new resume in My Resume!" : "Tailored resume saved!");
      router.replace("/resume");
    }
  };

  const handleDecline = async () => {
    const resumeId = session?.sourceResumeId;
    await discard();
    if (resumeId) router.replace(`/builder?id=${resumeId}`);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center gap-3 text-ink-soft">
        <Loader2 className="w-6 h-6 animate-spin text-primary-glow" />
        <span className="text-sm font-medium">Loading tailoring session...</span>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center">
        <AlertCircle className="w-8 h-8 text-rose-500" />
        <p className="text-sm font-bold text-ink">{error || "Tailoring session not found."}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-3 p-3 min-h-0 overflow-hidden">
      <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
        <button
          type="button"
          onClick={handleSaveAndExit}
          disabled={isSaving}
          className="inline-flex items-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl shadow-elegant transition disabled:opacity-60 cursor-pointer"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Save Tailored Resume</span>
        </button>

        <button
          type="button"
          onClick={() => setShowChanges((v) => !v)}
          className={`inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl shadow-elegant transition cursor-pointer ${
            showChanges ? "bg-sky-600 hover:bg-sky-700 text-white" : "bg-surface-alt text-ink-soft border border-border"
          }`}
        >
          {showChanges ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>{showChanges ? "Show Changes" : "Changes Hidden"}</span>
        </button>

        <button
          type="button"
          onClick={handleDecline}
          disabled={isSaving}
          className="inline-flex items-center gap-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl shadow-elegant transition disabled:opacity-60 cursor-pointer"
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Discard &amp; Exit</span>
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-3 min-h-0 overflow-hidden">
        <div className="h-full min-h-0 overflow-hidden">
          <TailoringSuggestionsPanel />
        </div>
        <div className="h-full min-h-0 overflow-hidden">
          <TailorCenterColumn />
        </div>
        <div ref={previewContainerRef} className="h-full min-h-0 overflow-hidden bg-surface/30 border border-border rounded-2xl">
          <LivePreviewCanvas />
        </div>
      </div>
    </div>
  );
}
