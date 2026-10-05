"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useResumeStore } from "@/features/resume/store/useResumeStore";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useAutosave } from "@/features/resume/hooks/useAutosave";
import { useAiCoachStore } from "@/features/resume/store/useAiCoachStore";
import { EditorHeader } from "@/features/resume/components/common/EditorHeader";
import { SectionNav } from "@/features/resume/components/editor/SectionNav";
import { FormAtsHeader } from "@/features/resume/components/editor/FormAtsHeader";
import { ResumeFormContainer } from "@/features/resume/components/editor/ResumeFormContainer";
import { EmbeddedAiChat } from "@/features/resume/components/ai/EmbeddedAiChat";
import { AIChat } from "@/features/aiAssistant/components/AIChat";
import { LivePreviewCanvas } from "@/features/resume/components/preview/LivePreviewCanvas";
import { triggerPdfDownload } from "@/features/resume/utils/downloadPdf";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { TailorModeWorkspace } from "@/features/tailorResume/components/TailorModeWorkspace";
import { Loader2, FileText, MessageSquare, Eye, Sparkles } from "lucide-react";

function BuilderContent() {
  const searchParams = useSearchParams();
  const resumeId = searchParams.get("id");
  const tailorSessionId = searchParams.get("tailor");
  const { loadResume, syncFromProfile, resume, activeResumeContext } = useResumeStore();
  const { isAuthenticated, user, completeOnboarding } = useAuthStore();
  const {
    isOpen: isChatOpen,
    setIsOpen: setIsChatOpen,
    activeMobileTab,
    setActiveMobileTab,
  } = useAiCoachStore();

  // Initialize Autosave Hook (self-suppresses while a Tailor Resume session is active)
  useAutosave();

  useEffect(() => {
    if (isAuthenticated && user && !user.hasBuiltResume) {
      completeOnboarding().catch(() => {});
    }
  }, [isAuthenticated, user, completeOnboarding]);

  useEffect(() => {
    if (resumeId) {
      loadResume(resumeId);
    } else if (isAuthenticated) {
      // Automatically bind / populate from user Profile
      syncFromProfile();
    }
  }, [resumeId, isAuthenticated, loadResume, syncFromProfile]);

  if (tailorSessionId) {
    return (
      <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
        <EditorHeader
          onToggleAi={() => setIsChatOpen(!isChatOpen)}
          isAiOpen={isChatOpen}
          onDownloadPdf={triggerPdfDownload}
        />
        <TailorModeWorkspace sessionId={tailorSessionId} />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Editor Header Toolbar */}
      <EditorHeader
        onToggleAi={() => setIsChatOpen(!isChatOpen)}
        isAiOpen={isChatOpen}
        onDownloadPdf={triggerPdfDownload}
      />

      {/* Mobile/Tablet Workspace Tab Selector (< lg screens) */}
      <div className="flex lg:hidden bg-surface border-b border-border p-1.5 gap-1.5 no-print select-none">
        <button
          onClick={() => setActiveMobileTab("form")}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeMobileTab === "form"
              ? "bg-gradient-brand text-primary-foreground font-bold shadow-elegant"
              : "text-ink-soft hover:text-ink hover:bg-surface-alt"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Form Editor</span>
        </button>
        <button
          onClick={() => setActiveMobileTab("chat")}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeMobileTab === "chat"
              ? "bg-gradient-brand text-primary-foreground font-bold shadow-elegant"
              : "text-ink-soft hover:text-ink hover:bg-surface-alt"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>AI Chat</span>
        </button>
        <button
          onClick={() => setActiveMobileTab("preview")}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
            activeMobileTab === "preview"
              ? "bg-gradient-brand text-primary-foreground font-bold shadow-elegant"
              : "text-ink-soft hover:text-ink hover:bg-surface-alt"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Resume Show</span>
        </button>
      </div>

      {/* Main Responsive Split Layout (Desktop: 40% Form | 60% Chat + Resume Area) */}
      <main className="flex-1 flex flex-col lg:flex-row gap-4 p-4 min-h-0 overflow-hidden bg-background">
        {/* PART 1: FORM SECTION (Fixed 40% width on desktop) */}
        <section
          className={`w-full lg:w-[40%] shrink-0 flex flex-col h-full overflow-hidden bg-surface/50 border border-border rounded-2xl p-4 shadow-sm ${
            activeMobileTab === "form" ? "flex" : "hidden lg:flex"
          }`}
        >
          {/* 1. ATS Section ON TOP of the form */}
          <FormAtsHeader />

          {/* 2. Horizontal Form Navigation Tabs */}
          {/* <div className="mb-3">
            <SectionNav />
          </div> */}

          {/* 3. Active Form Fields Container */}
          <div className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-border">
            <ResumeFormContainer />
          </div>
        </section>

        {/* RIGHT AREA: 60% Width Area containing Chat & Resume Preview with Smooth Animations */}
        <div className="w-full lg:w-[60%] flex-1 flex gap-4 h-full overflow-hidden relative">
          {/* PART 2: CHAT SECTION (Smooth left-to-right collapse/expand animation) */}
          <AnimatePresence initial={false}>
            {isChatOpen && (
              <motion.section
                key="ai-chat-panel"
                initial={{ width: 0, opacity: 0, scale: 0.95 }}
                animate={{ width: "40%", opacity: 1, scale: 1 }}
                exit={{ width: 0, opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
                className={`flex flex-col h-full shrink-0 overflow-hidden ${
                  activeMobileTab === "chat" ? "flex w-full" : "hidden lg:flex"
                }`}
              >
                <EmbeddedAiChat onClose={() => setIsChatOpen(false)} />
              </motion.section>
            )}
          </AnimatePresence>

          {/* PART 3: RESUME SHOW SECTION (Smooth right-to-left layout expansion to 100% of the 60% area) */}
          <motion.section
            layout
            transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
            className={`flex-1 flex flex-col h-full overflow-hidden bg-surface/30 border border-border rounded-2xl print:border-none print:p-0 shadow-sm relative ${
              activeMobileTab === "preview" ? "flex w-full" : "hidden lg:flex"
            }`}
          >
            {/* Floating Re-Open Chat Button (Visible on desktop when Chat section is closed) */}
            {!isChatOpen && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setIsChatOpen(true)}
                className="absolute top-4 right-6 z-30 bg-gradient-brand text-primary-foreground text-xs font-semibold px-3.5 py-2 rounded-xl shadow-elegant hover:shadow-glow transition-all flex items-center gap-2"
                title="Open AI Chat Advisor"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Open AI Chat</span>
              </motion.button>
            )}

            <LivePreviewCanvas />
          </motion.section>
        </div>
      </main>

      {/* Contextual AI Assistant (separate from the resume-editing co-pilot above) */}
      <AIChat
        context="resume"
        contextPayload={{ resumeId: resume.id, activeResumeContext: activeResumeContext ?? undefined }}
      />
    </div>
  );
}

export default function BuilderPage() {
  return (
    <AuthGuard>
      <Suspense
        fallback={
          <div className="h-screen bg-background flex flex-col items-center justify-center text-ink-soft gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-primary-glow" />
            <p className="text-sm font-medium">Loading Builder Workspace...</p>
          </div>
        }
      >
        <BuilderContent />
      </Suspense>
    </AuthGuard>
  );
}
