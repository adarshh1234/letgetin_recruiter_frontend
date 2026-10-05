"use client";

import React, { useState } from "react";
import { Check, X, Pencil, Info, Loader2, FileText, Briefcase, Wrench, FolderGit2 } from "lucide-react";
import { useTailorResumeStore } from "../store/useTailorResumeStore";
import { TailoringSection, TailoringSuggestion } from "../types";
import { diffWords } from "../utils/diffWords";
import { MissingInfoSection } from "./MissingInfoSection";
import { ResumeFormContainer } from "@/features/resume/components/editor/ResumeFormContainer";

type FilterTab = "active" | "matched" | "rejected";

// Same section icons/labels the real Resume Editor accordion uses, so AI interventions read
// as belonging to that section rather than a disconnected generic list.
const SECTION_META: Record<TailoringSection, { label: string; icon: React.ElementType }> = {
  summary: { label: "Professional Summary", icon: FileText },
  experience: { label: "Work Experience", icon: Briefcase },
  skills: { label: "Skills", icon: Wrench },
  projects: { label: "Projects", icon: FolderGit2 },
};

/** Renders proposedText with only the changed/added words wrapped in a green highlight. */
function DiffHighlightedText({
  originalText,
  proposedText,
  applied,
}: {
  originalText: string;
  proposedText: string;
  applied: boolean;
}) {
  const segments = diffWords(originalText, proposedText);
  return (
    <>
      {segments
        .filter((s) => s.type !== "removed")
        .map((seg, idx) =>
          seg.type === "added" ? (
            <mark
              key={idx}
              className={
                applied
                  ? "bg-emerald-400/70 dark:bg-emerald-400/40 text-emerald-950 dark:text-emerald-50 font-semibold rounded px-0.5"
                  : "bg-emerald-200 dark:bg-emerald-500/30 text-emerald-950 dark:text-emerald-100 rounded px-0.5"
              }
            >
              {seg.text}
            </mark>
          ) : (
            <React.Fragment key={idx}>{seg.text}</React.Fragment>
          )
        )}
    </>
  );
}

function SuggestionCard({ suggestion }: { suggestion: TailoringSuggestion }) {
  const { setSuggestionStatus } = useTailorResumeStore();
  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(suggestion.proposedText);
  const [isBusy, setIsBusy] = useState(false);

  const sectionLabel = SECTION_META[suggestion.section].label;

  const handleAccept = async () => {
    setIsBusy(true);
    await setSuggestionStatus(suggestion.id, "accepted");
    setIsBusy(false);
  };

  const handleDecline = async () => {
    setIsBusy(true);
    await setSuggestionStatus(suggestion.id, "declined");
    setIsBusy(false);
  };

  const handleSaveEdit = async () => {
    setIsBusy(true);
    await setSuggestionStatus(suggestion.id, "edited", draftText);
    setIsEditing(false);
    setIsBusy(false);
  };

  const isApplied = suggestion.status === "accepted" || suggestion.status === "edited";

  return (
    <div
      className={`relative border rounded-2xl p-4 space-y-3 shadow-xs transition-colors duration-300 ${
        isApplied
          ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/40"
          : "bg-surface border-border"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p
            className={`text-[10px] font-bold uppercase tracking-wider ${isApplied ? "text-emerald-700 dark:text-emerald-400" : "text-primary-glow"}`}
          >
            {suggestion.changeType === "addition" ? "New Addition" : "Suggested Edit"}
          </p>
          <p className="text-xs font-bold text-ink mt-0.5">{suggestion.relatedKeywords[0] || sectionLabel}</p>
          <p className="text-[10px] text-ink-soft mt-0.5">Placement: {sectionLabel}</p>
        </div>
        {suggestion.status === "accepted" && (
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full shrink-0 inline-flex items-center gap-1">
            <Check className="w-3 h-3" />
            Applied
          </span>
        )}
        {suggestion.status === "edited" && (
          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full shrink-0 inline-flex items-center gap-1">
            <Check className="w-3 h-3" />
            Edited &amp; Applied
          </span>
        )}
        {suggestion.status === "declined" && (
          <span className="text-[10px] font-bold text-ink-soft bg-surface-alt border border-border px-2 py-0.5 rounded-full shrink-0">
            Rejected
          </span>
        )}
      </div>

      {suggestion.originalText && (
        <div className="space-y-1">
          <p className="text-[10px] font-bold text-ink-soft uppercase tracking-wide">Original</p>
          <p
            className={`text-xs rounded-xl p-2.5 leading-relaxed ${
              isApplied ? "text-ink-soft/80 bg-white/60 dark:bg-black/10 line-through decoration-rose-400/60" : "text-ink-soft bg-surface-alt/60"
            }`}
          >
            {suggestion.originalText}
          </p>
        </div>
      )}

      <div className="space-y-1">
        <p
          className={`text-[10px] font-bold uppercase tracking-wide ${isApplied ? "text-emerald-700 dark:text-emerald-400" : "text-primary-glow"}`}
        >
          {isApplied ? "Applied Bullet" : "Modified Bullet"}
        </p>
        {isEditing ? (
          <textarea
            value={draftText}
            onChange={(e) => setDraftText(e.target.value)}
            rows={3}
            className="w-full text-xs bg-primary/5 border border-primary-glow/40 rounded-xl p-2.5 leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary-glow resize-none"
          />
        ) : (
          <p
            className={`text-xs rounded-xl p-2.5 leading-relaxed ${
              isApplied ? "text-emerald-950 dark:text-emerald-50 bg-emerald-100/80 dark:bg-emerald-500/15" : "text-ink bg-primary/10"
            }`}
          >
            <DiffHighlightedText originalText={suggestion.originalText} proposedText={suggestion.proposedText} applied={isApplied} />
          </p>
        )}
      </div>

      {suggestion.reason && (
        <div className="flex items-start gap-1.5 text-[11px] text-ink-soft">
          <Info className={`w-3 h-3 mt-0.5 shrink-0 ${isApplied ? "text-emerald-600" : "text-primary-glow"}`} />
          <p className="leading-relaxed">
            <span className="font-bold text-ink">Reasoning: </span>
            {suggestion.reason}
          </p>
        </div>
      )}

      {suggestion.status === "pending" && (
        <div className="flex items-center gap-2 pt-1">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isBusy}
                className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-gradient-brand text-white rounded-xl py-2 shadow-elegant disabled:opacity-50 cursor-pointer"
              >
                {isBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Save &amp; Accept</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setDraftText(suggestion.proposedText);
                  setIsEditing(false);
                }}
                className="text-xs font-bold text-ink-soft hover:text-ink px-3 py-2 cursor-pointer"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={handleAccept}
                disabled={isBusy}
                className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-gradient-brand text-white rounded-xl py-2 shadow-elegant disabled:opacity-50 cursor-pointer"
              >
                {isBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Accept Revision</span>
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                disabled={isBusy}
                title="Edit before accepting"
                className="p-2 text-ink-soft hover:text-ink border border-border rounded-xl hover:bg-surface-alt transition cursor-pointer disabled:opacity-50"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleDecline}
                disabled={isBusy}
                title="Reject"
                className="p-2 text-rose-500 border border-rose-500/20 rounded-xl hover:bg-rose-500/10 transition cursor-pointer disabled:opacity-50"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      )}

      {(suggestion.status === "accepted" || suggestion.status === "edited") && (
        <button
          type="button"
          onClick={handleDecline}
          disabled={isBusy}
          title="Undo this change - restores the original text, other accepted changes are unaffected"
          className="text-[11px] font-bold text-ink-soft hover:text-rose-500 cursor-pointer disabled:opacity-50"
        >
          Undo
        </button>
      )}

      {suggestion.status === "declined" && (
        <button
          type="button"
          onClick={handleAccept}
          disabled={isBusy}
          className="text-[11px] font-bold text-primary-glow hover:underline cursor-pointer disabled:opacity-50"
        >
          Restore this suggestion
        </button>
      )}
    </div>
  );
}

function JobDescriptionCard({ jobDescription }: { jobDescription: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = jobDescription.length > 220;
  const preview = isLong && !expanded ? `${jobDescription.slice(0, 220)}...` : jobDescription;

  return (
    <div className="px-4 py-3 border-b border-border shrink-0">
      <p className="text-[10px] font-bold text-ink-soft uppercase tracking-wide mb-1">Job Description</p>
      <p className="text-xs text-ink-soft leading-relaxed whitespace-pre-wrap">{preview}</p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="text-[11px] font-bold text-primary-glow hover:underline mt-1 cursor-pointer"
        >
          {expanded ? "Show less" : "Show full description"}
        </button>
      )}
    </div>
  );
}

export function TailoringSuggestionsPanel() {
  const { session } = useTailorResumeStore();
  const [tab, setTab] = useState<FilterTab>("active");

  if (!session) return null;

  const active = session.suggestions.filter((s) => s.status === "pending");
  const matched = session.suggestions.filter((s) => s.status === "accepted" || s.status === "edited");
  const rejected = session.suggestions.filter((s) => s.status === "declined");

  const total = session.suggestions.length;
  const integratedPct = total > 0 ? Math.round((matched.length / total) * 100) : 0;

  const visibleSuggestions = tab === "active" ? active : tab === "matched" ? matched : rejected;

  return (
    <div className="h-full flex flex-col bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-border space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-ink">Keyword match</p>
            <p className="text-[10px] text-ink-soft">Tailoring against your target role</p>
          </div>
          {integratedPct < 60 && (
            <span className="text-[10px] font-bold text-amber-700 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              Needs work
            </span>
          )}
        </div>
        <div>
          <p className="text-3xl font-extrabold text-ink">{integratedPct}%</p>
          <p className="text-[11px] text-ink-soft">
            {matched.length} of {total} keywords integrated &middot; {active.length} to go
          </p>
          <div className="h-2 w-full bg-surface-alt rounded-full overflow-hidden border border-border mt-2">
            <div className="h-full bg-gradient-brand transition-all duration-500 rounded-full" style={{ width: `${integratedPct}%` }} />
          </div>
        </div>
      </div>

      <JobDescriptionCard jobDescription={session.jobDescription} />

      <MissingInfoSection missingSections={session.missingSections || []} jobDescription={session.jobDescription} />

      <div className="flex items-center border-b border-border shrink-0 px-2">
        {[
          { id: "active" as const, label: "Active", count: active.length },
          { id: "matched" as const, label: "Already Matched", count: matched.length },
          { id: "rejected" as const, label: "Rejected", count: rejected.length },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold border-b-2 -mb-px transition cursor-pointer ${
              tab === t.id ? "text-ink border-primary-glow" : "text-ink-soft border-transparent hover:text-ink"
            }`}
          >
            <span>{t.label}</span>
            <span className="text-[10px] bg-surface-alt border border-border rounded-full px-1.5 py-0.5">{t.count}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {visibleSuggestions.length === 0 ? (
          <p className="text-xs text-ink-soft text-center py-6">Nothing here yet.</p>
        ) : (
          (Object.keys(SECTION_META) as TailoringSection[]).map((sectionKey) => {
            const inSection = visibleSuggestions.filter((s) => s.section === sectionKey);
            if (inSection.length === 0) return null;
            const { label, icon: Icon } = SECTION_META[sectionKey];
            return (
              <div key={sectionKey} className="space-y-2.5">
                <div className="flex items-center gap-1.5 pt-1">
                  <Icon className="w-3.5 h-3.5 text-ink-soft" />
                  <span className="text-[11px] font-bold text-ink-soft uppercase tracking-wide">{label}</span>
                </div>
                {inSection.map((s) => (
                  <SuggestionCard key={s.id} suggestion={s} />
                ))}
              </div>
            );
          })
        )}

        {/* Full existing Resume Editor - same component/state used outside Tailor Resume.
            Accepting a suggestion above updates this editor's fields immediately since both
            read from the same resume store; edits made here are the normal editor behavior. */}
        <div className="pt-4 mt-2 border-t border-border">
          <p className="text-xs font-bold text-ink mb-3">Full Resume Editor</p>
          <ResumeFormContainer />
        </div>
      </div>
    </div>
  );
}
