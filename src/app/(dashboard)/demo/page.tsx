"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  FileText,
  Upload,
  ArrowRight,
  Wand2,
  ShieldCheck,
  Zap,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useResumeStore } from "@/features/resume/store/useResumeStore";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { StorageProviderFactory } from "@/features/resume/storage/factory";
import { ResumeUploadModal } from "@/features/resume/components/onboarding/ResumeUploadModal";

export default function DemoOnboardingPage() {
  const router = useRouter();
  const { resetToBlank } = useResumeStore();
  const { user, completeOnboarding } = useAuthStore();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if user already built a resume or has resumes in DB. If so, redirect to workspace
  useEffect(() => {
    let isMounted = true;
    const verifyNewUser = async () => {
      // 1. If database flag hasBuiltResume is true, immediately redirect away
      if (user?.hasBuiltResume) {
        router.replace("/resume");
        return;
      }

      // 2. Also check if user has existing resumes in MongoDB
      try {
        const provider = StorageProviderFactory.getProvider();
        const list = await provider.list();
        if (isMounted && Array.isArray(list) && list.length > 0) {
          await completeOnboarding().catch(() => {});
          router.replace("/resume");
          return;
        }
      } catch (err) {
        console.warn("Error checking resumes on demo page:", err);
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };

    verifyNewUser();

    return () => {
      isMounted = false;
    };
  }, [user, router, completeOnboarding]);

  const handleStartFromScratch = async () => {
    // Persist hasBuiltResume: true in database so this page is never shown again
    await completeOnboarding().catch(() => {});
    resetToBlank();
    router.push("/builder");
  };

  if (isChecking) {
    return (
      <div className="min-h-full flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 text-primary-glow animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background text-foreground flex flex-col justify-between relative overflow-hidden p-6 sm:p-8">
      {/* Background Ambient Glows */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--primary-glow)_0%,_transparent_70%)] opacity-20 pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_bottom_right,_var(--primary-deep)_0%,_transparent_70%)] opacity-20 pointer-events-none rounded-full" />

      {/* Main Content Hero */}
      <main className="w-full max-w-5xl mx-auto py-8 flex-1 flex flex-col items-center justify-center z-10 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold text-primary-glow mb-6 backdrop-blur-md shadow-sm"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Next-Generation Resume Onboarding</span>
        </motion.div>

        {/* Question Title */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-5xl font-extrabold tracking-tight text-ink max-w-3xl leading-tight"
        >
          How would you like to start building with{" "}
          <span className="text-gradient-brand">LetGetIn AI</span>?
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-4 text-base text-ink-soft max-w-xl font-normal leading-relaxed"
        >
          Select your workflow below. Our AI carrier engine will format, score,
          and optimize your resume in real time.
        </motion.p>

        {/* Two Interactive Workflows Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mt-10 text-left">
          {/* Card 1: Start from Scratch */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            onClick={handleStartFromScratch}
            className="group relative bg-surface border border-border hover:border-primary-glow/60 rounded-3xl p-8 cursor-pointer shadow-elegant hover:shadow-glow transition-all flex flex-col justify-between overflow-hidden card-hover"
          >
            {/* Top Glow on Hover */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-brand opacity-0 group-hover:opacity-100 transition-opacity" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-brand rounded-2xl text-primary-foreground shadow-glow group-hover:scale-105 transition-all">
                  <FileText className="w-7 h-7" />
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-surface-alt text-ink-soft group-hover:text-primary-glow transition-colors">
                  Blank Canvas
                </span>
              </div>

              <h3 className="text-xl font-bold text-ink group-hover:text-primary-glow transition-colors">
                Build Resume from Scratch
              </h3>

              <p className="mt-3 text-xs sm:text-sm text-ink-soft leading-relaxed">
                Start with a clean resume and let AI help you build every
                section step by step. Ideal for fresh graduates or creating a
                tailored new resume from ground up.
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-border flex items-center justify-between text-xs sm:text-sm font-semibold text-ink group-hover:text-primary-glow">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary-glow" />
                Start from Scratch
              </span>
              <div className="p-2 rounded-xl bg-gradient-brand text-primary-foreground transition-all transform group-hover:translate-x-1 shadow-glow">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>

          {/* Card 2: Upload Existing Resume */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            onClick={() => setIsUploadModalOpen(true)}
            className="group relative bg-surface border border-border hover:border-primary-glow/60 rounded-3xl p-8 cursor-pointer shadow-elegant hover:shadow-glow transition-all flex flex-col justify-between overflow-hidden card-hover"
          >
            {/* Top Glow on Hover */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-brand opacity-0 group-hover:opacity-100 transition-opacity" />

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-4 bg-gradient-brand rounded-2xl text-primary-foreground shadow-glow group-hover:scale-105 transition-all">
                  <Upload className="w-7 h-7" />
                </div>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-surface-alt text-ink-soft group-hover:text-primary-glow transition-colors">
                  AI Auto-Extract
                </span>
              </div>

              <h3 className="text-xl font-bold text-ink group-hover:text-primary-glow transition-colors">
                Upload Existing Resume
              </h3>

              <p className="mt-3 text-xs sm:text-sm text-ink-soft leading-relaxed">
                Already have a resume? Upload a PDF or DOCX and we’ll
                automatically extract your information using AI, populating all
                sections instantly.
              </p>
            </div>

            <div className="mt-8 pt-5 border-t border-border flex items-center justify-between text-xs sm:text-sm font-semibold text-ink group-hover:text-primary-glow">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary-glow" />
                Upload Resume
              </span>
              <div className="p-2 rounded-xl bg-gradient-brand text-primary-foreground transition-all transform group-hover:translate-x-1 shadow-glow">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Security / Quality guarantee bar */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-ink-soft font-medium">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-success" />
            256-bit Encrypted & Privacy Protected
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-primary-glow" />
            Powered by LetGetIn AI Engine
          </span>
        </div>
      </main>

      {/* Modal for Option 2 Upload */}
      <ResumeUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </div>
  );
}
