import React, { useRef, useState } from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { useAiCoachStore } from "../../store/useAiCoachStore";
import { Briefcase, Plus, Trash2, ChevronUp, ChevronDown, Sparkles, SlidersHorizontal } from "lucide-react";
import { IExperience } from "../../types";
import { AiBulletRerankModal } from "../ai/AiBulletRerankModal";
import { AIWritingAssistant } from "@/features/aiWriting/components/AIWritingAssistant";

export const ExperienceForm: React.FC = () => {
  const {
    resume,
    addExperience,
    updateExperience,
    removeExperience,
    reorderExperiences,
    setActiveResumeContext,
  } = useResumeStore();
  const { triggerExperienceAi } = useAiCoachStore();
  const experiences = resume.content.experiences;

  // Track bullet count selection per experience (default: 3)
  const [bulletCounts, setBulletCounts] = useState<Record<string, number>>({});
  // Track modal open state for reranking bullet count
  const [modalExpId, setModalExpId] = useState<string | null>(null);
  const bulletRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});
  const getBulletRefObject = (key: string): React.RefObject<HTMLTextAreaElement | null> => ({
    current: bulletRefs.current[key] || null,
  });

  const getBulletCount = (expId: string) => bulletCounts[expId] || 3;

  const setBulletCount = (expId: string, count: number) => {
    setBulletCounts((prev) => ({ ...prev, [expId]: count }));
  };

  const handleAdd = () => {
    const newExp: IExperience = {
      id: `exp-${Date.now()}`,
      company: "New Company",
      position: "Software Engineer",
      location: "Remote",
      startDate: "2023-01",
      endDate: "Present",
      isCurrent: true,
      highlights: [""],
    };
    addExperience(newExp);
  };

  const handleHighlightChange = (
    expId: string,
    index: number,
    value: string,
  ) => {
    const exp = experiences.find((e) => e.id === expId);
    if (!exp) return;
    const newHighlights = [...exp.highlights];
    newHighlights[index] = value;
    updateExperience(expId, { highlights: newHighlights });
  };

  const addHighlight = (expId: string) => {
    const exp = experiences.find((e) => e.id === expId);
    if (!exp) return;
    updateExperience(expId, {
      highlights: [...exp.highlights, ""],
    });
  };

  const removeHighlight = (expId: string, index: number) => {
    const exp = experiences.find((e) => e.id === expId);
    if (!exp) return;
    updateExperience(expId, {
      highlights: exp.highlights.filter((_, i) => i !== index),
    });
  };

  const moveExperience = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experiences.length) return;
    const items = [...experiences];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);
    reorderExperiences(items);
  };

  const activeModalExp = experiences.find((e) => e.id === modalExpId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-surface p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-primary-glow" />
          <h3 className="text-sm font-bold text-ink">Work Experience</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 text-xs font-semibold bg-gradient-brand text-primary-foreground px-3 py-1.5 rounded-xl shadow-elegant transition-all hover:shadow-glow cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Position</span>
          </button>
        </div>
      </div>

      {experiences.length === 0 ? (
        <div className="text-center py-8 bg-surface/50 rounded-2xl border border-dashed border-border text-ink-soft text-xs">
          No work experiences added yet. Click &quot;Add Position&quot; to
          begin.
        </div>
      ) : (
        experiences.map((exp, idx) => {
          const count = getBulletCount(exp.id);

          return (
            <div
              key={exp.id}
              className="bg-surface p-5 rounded-2xl border border-border space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                    #{idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-ink">
                    {exp.company || "Company"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveExperience(idx, "up")}
                    className="p-1 text-ink-soft hover:text-ink disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    disabled={idx === experiences.length - 1}
                    onClick={() => moveExperience(idx, "down")}
                    className="p-1 text-ink-soft hover:text-ink disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeExperience(exp.id)}
                    className="p-1 text-destructive hover:opacity-80 ml-2 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-ink-soft font-semibold mb-1">
                    Position / Job Title
                  </label>
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) =>
                      updateExperience(exp.id, { position: e.target.value })
                    }
                    className="input-base text-xs"
                  />
                </div>

                <div>
                  <label className="block text-ink-soft font-semibold mb-1">
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) =>
                      updateExperience(exp.id, { company: e.target.value })
                    }
                    className="input-base text-xs"
                  />
                </div>

                <div>
                  <label className="block text-ink-soft font-semibold mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={exp.startDate}
                    onChange={(e) =>
                      updateExperience(exp.id, { startDate: e.target.value })
                    }
                    placeholder="YYYY-MM"
                    className="input-base text-xs"
                  />
                </div>

                <div>
                  <label className="block text-ink-soft font-semibold mb-1">
                    End Date
                  </label>
                  <input
                    type="text"
                    value={exp.endDate}
                    onChange={(e) =>
                      updateExperience(exp.id, { endDate: e.target.value })
                    }
                    placeholder="YYYY-MM or Present"
                    disabled={exp.isCurrent}
                    className="input-base text-xs disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Highlights Bullet Points with Count Modal Trigger & Per-Bullet AI Improve */}
              <div className="space-y-2.5 pt-2 border-t border-border">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-ink">
                    Key Achievements & Bullet Points
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Sleek Count Picker Button opening Modal */}
                    <button
                      type="button"
                      onClick={() => setModalExpId(exp.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-alt hover:bg-surface border border-border text-ink text-xs font-semibold shadow-xs hover:border-primary-glow/40 transition-all cursor-pointer"
                      title="Customize bullet count & rerank"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-primary-glow" />
                      <span>{count} Bullets</span>
                    </button>

                    {/* Write with AI Button */}
                    <button
                      type="button"
                      onClick={() => triggerExperienceAi(exp.id, exp.position, exp.company, count)}
                      className="text-xs text-primary-glow hover:text-primary font-semibold flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-lg border border-primary/25 transition-all cursor-pointer shadow-xs"
                      title={`Generate ${count} bullet points with LetGetIn AI Coach`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-primary-glow" />
                      <span>Write with AI</span>
                    </button>

                    {/* Add Bullet Button */}
                    <button
                      type="button"
                      onClick={() => addHighlight(exp.id)}
                      className="text-xs text-primary-glow hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Bullet</span>
                    </button>
                  </div>
                </div>

                {/* Bullet List with Expandable Textareas & Per-Bullet AI Icon */}
                <div className="space-y-2">
                  {exp.highlights.map((bullet, hIdx) => {
                    const bulletStr = typeof bullet === 'string' ? bullet : typeof bullet === 'object' && bullet ? ((bullet as any).text || (bullet as any).bullet || (bullet as any).highlight || (bullet as any).description || Object.values(bullet)[0] || '') : String(bullet || '');
                    return (
                    <div key={hIdx} className="flex items-start gap-2 group">
                      <span className="text-ink-soft text-xs mt-2.5 shrink-0">•</span>

                      {/* Expandable / Auto-Growing Bullet Textarea */}
                      <textarea
                        ref={(el) => {
                          bulletRefs.current[`${exp.id}-${hIdx}`] = el;
                        }}
                        rows={1}
                        value={bulletStr}
                        onChange={(e) => {
                          handleHighlightChange(exp.id, hIdx, e.target.value);
                          setActiveResumeContext({
                            section: 'experience',
                            itemId: exp.id,
                            field: 'bullet',
                            bulletIndex: hIdx,
                            value: e.target.value,
                            position: exp.position,
                            company: exp.company,
                          });
                        }}
                        onFocus={(e) => {
                          e.target.style.height = 'auto';
                          e.target.style.height = `${Math.max(48, e.target.scrollHeight)}px`;
                          setActiveResumeContext({
                            section: 'experience',
                            itemId: exp.id,
                            field: 'bullet',
                            bulletIndex: hIdx,
                            value: bulletStr,
                            position: exp.position,
                            company: exp.company,
                          });
                        }}
                        onInput={(e: any) => {
                          e.target.style.height = 'auto';
                          e.target.style.height = `${Math.max(38, e.target.scrollHeight)}px`;
                        }}
                        placeholder="Describe quantifiable achievements, systems built, and percentage metrics..."
                        className="flex-1 input-base text-xs leading-relaxed resize-y overflow-hidden transition-all focus:ring-1 focus:ring-primary-glow min-h-[38px] py-2"
                      />

                      {/* Per-Bullet AI Writing Assistant */}
                      <div className="mt-1 shrink-0">
                        <AIWritingAssistant
                          value={bulletStr}
                          context="resume-experience"
                          metadata={{ position: exp.position, company: exp.company }}
                          textareaRef={getBulletRefObject(`${exp.id}-${hIdx}`)}
                          onApply={(next) => handleHighlightChange(exp.id, hIdx, next)}
                          iconOnly
                          title="Improve this bullet point with AI"
                        />
                      </div>

                      {/* Delete Bullet Button */}
                      <button
                        type="button"
                        onClick={() => removeHighlight(exp.id, hIdx)}
                        className="p-1.5 text-ink-soft hover:text-destructive hover:bg-surface-alt rounded-lg transition-colors cursor-pointer mt-1 shrink-0"
                        title="Delete bullet point"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
                </div>
              </div>
            </div>
          );
        })
      )}

      {/* Rerank / Customize Bullet Count Modal */}
      {activeModalExp && (
        <AiBulletRerankModal
          isOpen={!!modalExpId}
          onClose={() => setModalExpId(null)}
          title={`${activeModalExp.position || 'Role'} at ${activeModalExp.company || 'Company'}`}
          currentCount={activeModalExp.highlights.length}
          initialTargetCount={getBulletCount(activeModalExp.id)}
          onConfirm={(targetCount, customContext) => {
            setBulletCount(activeModalExp.id, targetCount);
            triggerExperienceAi(activeModalExp.id, activeModalExp.position, activeModalExp.company, targetCount, customContext);
          }}
        />
      )}
    </div>
  );
};
