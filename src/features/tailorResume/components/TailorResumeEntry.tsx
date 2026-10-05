"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Sparkles, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import { StorageProviderFactory } from "@/features/resume/storage/factory";
import { IResume } from "@/features/resume/types";
import { useTailorResumeStore } from "../store/useTailorResumeStore";

type Step = "jobDescription" | "resumeSelection" | "analyzing";

export function TailorResumeEntry() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("jobDescription");
  const [jobDescription, setJobDescription] = useState("");
  const [jdError, setJdError] = useState<string | null>(null);

  const [resumes, setResumes] = useState<IResume[]>([]);
  const [isLoadingResumes, setIsLoadingResumes] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(null);

  const { loadOrCreateSession, session, error, reset } = useTailorResumeStore();

  // Every fresh visit to this entry screen starts a clean journey - defensively clear any
  // leftover session/state from a previous Tailor Resume visit that wasn't explicitly
  // saved or discarded (e.g. the user navigated away without finishing).
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleContinueFromJd = async () => {
    if (!jobDescription.trim() || jobDescription.trim().length < 20) {
      setJdError("Please paste a complete job description to continue.");
      return;
    }
    setJdError(null);
    setIsLoadingResumes(true);
    try {
      const provider = StorageProviderFactory.getProvider();
      const list = await provider.list();
      const items = Array.isArray(list) ? list : [];
      setResumes(items);
      if (items.length === 1) {
        setSelectedResumeId(items[0].id);
        setStep("analyzing");
      } else {
        setStep("resumeSelection");
      }
    } catch {
      setResumes([]);
      setStep("resumeSelection");
    } finally {
      setIsLoadingResumes(false);
    }
  };

  const handleSelectResumeAndContinue = () => {
    if (!selectedResumeId) return;
    setStep("analyzing");
  };

  useEffect(() => {
    if (step === "analyzing" && selectedResumeId) {
      loadOrCreateSession(selectedResumeId, jobDescription);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, selectedResumeId]);

  useEffect(() => {
    if (session && selectedResumeId) {
      router.push(`/builder?id=${selectedResumeId}&tailor=${session._id}`);
    }
  }, [session, selectedResumeId, router]);

  if (step === "jobDescription") {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-5">
        <div className="text-center space-y-1.5">
          <h2 className="text-xl font-extrabold text-ink">Tailor Your Resume</h2>
          <p className="text-xs text-ink-soft">
            Paste the complete job description. Our AI will find real gaps between your resume and this role.
          </p>
        </div>

        <textarea
          value={jobDescription}
          onChange={(e) => {
            setJobDescription(e.target.value);
            if (jdError) setJdError(null);
          }}
          rows={12}
          placeholder="Paste the complete job description here - title, company, requirements, responsibilities..."
          className="input-base resize-none text-sm"
        />

        {jdError && (
          <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-500/10 border border-rose-500/20 px-3.5 py-2.5 rounded-xl">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{jdError}</span>
          </div>
        )}

        <button
          type="button"
          onClick={handleContinueFromJd}
          disabled={isLoadingResumes}
          className="w-full inline-flex items-center justify-center gap-2 bg-gradient-brand text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-elegant hover:shadow-glow transition disabled:opacity-60 cursor-pointer"
        >
          {isLoadingResumes ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>{isLoadingResumes ? "Loading your resumes..." : "Continue"}</span>
        </button>
      </div>
    );
  }

  if (step === "resumeSelection") {
    return (
      <div className="max-w-2xl mx-auto py-8 space-y-5">
        <div className="text-center space-y-1.5">
          <h2 className="text-xl font-extrabold text-ink">Select a Resume to Tailor</h2>
          <p className="text-xs text-ink-soft">Choose which resume this job description should be matched against.</p>
        </div>

        {resumes.length === 0 ? (
          <div className="text-center py-16 bg-surface/40 border border-dashed border-border rounded-3xl space-y-3">
            <FileText className="w-8 h-8 text-ink-soft mx-auto" />
            <p className="text-sm font-bold text-ink">No resumes found</p>
            <p className="text-xs text-ink-soft">Create a resume under My Resume before tailoring it to a job.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {resumes.map((resume) => {
              const isSelected = selectedResumeId === resume.id;
              return (
                <button
                  key={resume.id}
                  type="button"
                  onClick={() => setSelectedResumeId(resume.id)}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3.5 rounded-xl border text-left transition cursor-pointer ${
                    isSelected
                      ? "bg-primary/10 border-primary-glow ring-2 ring-primary-glow/30"
                      : "bg-surface border-border hover:border-primary-glow/40"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-4 h-4 text-ink-soft shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink truncate">{resume.title}</p>
                      {resume.updatedAt && (
                        <p className="text-[11px] text-ink-soft">
                          Updated {new Date(resume.updatedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-primary-glow shrink-0" />}
                </button>
              );
            })}
          </div>
        )}

        <button
          type="button"
          onClick={handleSelectResumeAndContinue}
          disabled={!selectedResumeId}
          className="w-full inline-flex items-center justify-center gap-2 bg-gradient-brand text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-elegant hover:shadow-glow transition disabled:opacity-40 cursor-pointer"
        >
          <span>Continue</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto py-24 text-center space-y-4">
      <Loader2 className="w-8 h-8 text-primary-glow animate-spin mx-auto" />
      <p className="text-sm font-bold text-ink">Analyzing your resume against the job description...</p>
      <p className="text-xs text-ink-soft">Matching keywords, skills, and experience. This takes a few seconds.</p>
      {error && (
        <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-500/10 border border-rose-500/20 px-3.5 py-2.5 rounded-xl text-left">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {error && (
        <button
          type="button"
          onClick={() => setStep("jobDescription")}
          className="text-xs font-bold text-primary-glow hover:underline cursor-pointer"
        >
          Try again
        </button>
      )}
    </div>
  );
}
