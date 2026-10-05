import React, { useRef, useState } from "react";
import { useResumeStore } from "../../store/useResumeStore";
import { useAiCoachStore } from "../../store/useAiCoachStore";
import { FolderGit2, Plus, Trash2, ChevronUp, ChevronDown, Sparkles, SlidersHorizontal } from "lucide-react";
import { IProject } from "../../types";
import { AiBulletRerankModal } from "../ai/AiBulletRerankModal";
import { AIWritingAssistant } from "@/features/aiWriting/components/AIWritingAssistant";

export const ProjectsForm: React.FC = () => {
  const { resume, addProject, updateProject, removeProject, reorderProjects, setActiveResumeContext } =
    useResumeStore();
  const { triggerProjectDescriptionAi, triggerProjectBulletsAi } = useAiCoachStore();
  const projects = resume.content.projects;

  // Track bullet count selection per project (default: 3)
  const [bulletCounts, setBulletCounts] = useState<Record<string, number>>({});
  // Track modal open state for reranking bullet count
  const [modalProjId, setModalProjId] = useState<string | null>(null);
  const descriptionRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});
  const bulletRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});
  const getDescriptionRefObject = (key: string): React.RefObject<HTMLTextAreaElement | null> => ({
    current: descriptionRefs.current[key] || null,
  });
  const getBulletRefObject = (key: string): React.RefObject<HTMLTextAreaElement | null> => ({
    current: bulletRefs.current[key] || null,
  });

  const getBulletCount = (projId: string) => bulletCounts[projId] || 3;

  const setBulletCount = (projId: string, count: number) => {
    setBulletCounts((prev) => ({ ...prev, [projId]: count }));
  };

  const handleAdd = () => {
    const newProj: IProject = {
      id: `proj-${Date.now()}`,
      title: "New Project Title",
      subtitle: "Short project overview",
      link: "https://github.com/example/project",
      startDate: "2023-01",
      endDate: "Present",
      description:
        "Built an interactive web application that streamlines user workflows.",
      highlights: [""],
      technologies: ["React", "TypeScript", "Node.js"],
    };
    addProject(newProj);
  };

  const handleHighlightChange = (
    projId: string,
    index: number,
    value: string,
  ) => {
    const proj = projects.find((p) => p.id === projId);
    if (!proj) return;
    const newHighlights = [...(proj.highlights || [])];
    newHighlights[index] = value;
    updateProject(projId, { highlights: newHighlights });
  };

  const addHighlight = (projId: string) => {
    const proj = projects.find((p) => p.id === projId);
    if (!proj) return;
    updateProject(projId, {
      highlights: [
        ...(proj.highlights || []),
        "",
      ],
    });
  };

  const removeHighlight = (projId: string, index: number) => {
    const proj = projects.find((p) => p.id === projId);
    if (!proj) return;
    updateProject(projId, {
      highlights: (proj.highlights || []).filter((_, i) => i !== index),
    });
  };

  const moveProject = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;
    const items = [...projects];
    const [moved] = items.splice(index, 1);
    items.splice(targetIndex, 0, moved);
    reorderProjects(items);
  };

  const getTechArray = (tech: any): string[] => {
    if (Array.isArray(tech)) return tech;
    if (typeof tech === 'string') return tech.split(',').map((t) => t.trim()).filter(Boolean);
    return [];
  };

  const activeModalProj = projects.find((p) => p.id === modalProjId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-surface p-4 rounded-2xl border border-border shadow-sm">
        <div className="flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-primary-glow" />
          <h3 className="text-sm font-bold text-ink">Projects</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleAdd}
            className="flex items-center gap-1.5 text-xs font-semibold bg-gradient-brand text-primary-foreground px-3 py-1.5 rounded-xl shadow-elegant transition-all hover:shadow-glow cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Project</span>
          </button>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-8 bg-surface/50 rounded-2xl border border-dashed border-border text-ink-soft text-xs">
          No projects added yet. Click &quot;Add Project&quot; to showcase your
          portfolio.
        </div>
      ) : (
        projects.map((proj, idx) => {
          const count = getBulletCount(proj.id);
          const techArray = getTechArray(proj.technologies);

          return (
            <div
              key={proj.id}
              className="bg-surface p-5 rounded-2xl border border-border space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary-glow bg-primary/10 px-2 py-0.5 rounded-md border border-primary/20">
                    #{idx + 1}
                  </span>
                  <span className="text-xs font-semibold text-ink">
                    {proj.title || "Project"}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveProject(idx, "up")}
                    className="p-1 text-ink-soft hover:text-ink disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === projects.length - 1}
                    onClick={() => moveProject(idx, "down")}
                    className="p-1 text-ink-soft hover:text-ink disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeProject(proj.id)}
                    className="p-1 text-destructive hover:opacity-80 ml-2 cursor-pointer"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-ink-soft font-semibold mb-1">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={proj.title}
                    onChange={(e) =>
                      updateProject(proj.id, { title: e.target.value })
                    }
                    placeholder="e.g. E-Commerce Platform"
                    className="input-base text-xs"
                  />
                </div>

                <div>
                  <label className="block text-ink-soft font-semibold mb-1">
                    Subtitle / Subheadline
                  </label>
                  <input
                    type="text"
                    value={proj.subtitle || ""}
                    onChange={(e) =>
                      updateProject(proj.id, { subtitle: e.target.value })
                    }
                    placeholder="e.g. Full Stack Web Application"
                    className="input-base text-xs"
                  />
                </div>

                <div>
                  <label className="block text-ink-soft font-semibold mb-1">
                    Live Demo / Repository Link
                  </label>
                  <input
                    type="text"
                    value={proj.link || ""}
                    onChange={(e) =>
                      updateProject(proj.id, { link: e.target.value })
                    }
                    placeholder="https://github.com/username/project"
                    className="input-base text-xs"
                  />
                </div>

                <div>
                  <label className="block text-ink-soft font-semibold mb-1">
                    Technologies / Tech Stack
                  </label>
                  <input
                    type="text"
                    value={
                      Array.isArray(proj.technologies)
                        ? proj.technologies.join(", ")
                        : proj.technologies || ""
                    }
                    onChange={(e) =>
                      updateProject(proj.id, {
                        technologies: e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="React, Next.js, Node.js, MongoDB"
                    className="input-base text-xs"
                  />
                </div>

                <div>
                  <label className="block text-ink-soft font-semibold mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={proj.startDate || ""}
                    onChange={(e) =>
                      updateProject(proj.id, { startDate: e.target.value })
                    }
                    placeholder="2023-01"
                    className="input-base text-xs"
                  />
                </div>

                <div>
                  <label className="block text-ink-soft font-semibold mb-1">
                    End Date
                  </label>
                  <input
                    type="text"
                    value={proj.endDate || ""}
                    onChange={(e) =>
                      updateProject(proj.id, { endDate: e.target.value })
                    }
                    placeholder="Present or 2023-06"
                    className="input-base text-xs"
                  />
                </div>
              </div>

              {/* Description Textarea */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-ink-soft font-semibold text-xs">
                    Project Description
                  </label>
                  <button
                    type="button"
                    onClick={() => triggerProjectDescriptionAi(proj.id, proj.title, techArray)}
                    className="text-[11px] text-primary-glow hover:text-primary font-semibold flex items-center gap-1 bg-primary/10 hover:bg-primary/20 px-2 py-0.5 rounded-md border border-primary/25 transition-all cursor-pointer shadow-xs"
                    title="Generate project description with LetGetIn AI Coach"
                  >
                    <Sparkles className="w-3 h-3 text-primary-glow" />
                    <span>Write with AI</span>
                  </button>
                </div>
                <textarea
                  ref={(el) => {
                    descriptionRefs.current[proj.id] = el;
                  }}
                  rows={2}
                  value={proj.description || ""}
                  onChange={(e) =>
                    updateProject(proj.id, { description: e.target.value })
                  }
                  onFocus={(e) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.max(60, e.target.scrollHeight)}px`;
                  }}
                  onInput={(e: any) => {
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.max(48, e.target.scrollHeight)}px`;
                  }}
                  placeholder="Brief summary of what this project does, user scale, and the problem it solves..."
                  className="input-base text-xs leading-relaxed resize-y overflow-hidden transition-all min-h-[48px]"
                />
                {(proj.description || "").trim().length > 0 && (
                  <div className="mt-1.5">
                    <AIWritingAssistant
                      value={proj.description || ""}
                      context="resume-project"
                      metadata={{ projectName: proj.title }}
                      textareaRef={getDescriptionRefObject(proj.id)}
                      onApply={(next) => updateProject(proj.id, { description: next })}
                      label="AI Improve"
                    />
                  </div>
                )}
              </div>

              {/* Highlights Bullet Points with Count Modal & Per-Bullet AI Improve */}
              <div className="space-y-2.5 pt-2 border-t border-border">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-ink">
                    Key Features & Achievements
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Sleek Count Picker Button opening Modal */}
                    <button
                      type="button"
                      onClick={() => setModalProjId(proj.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-alt hover:bg-surface border border-border text-ink text-xs font-semibold shadow-xs hover:border-primary-glow/40 transition-all cursor-pointer"
                      title="Customize bullet count & rerank"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-primary-glow" />
                      <span>{count} Bullets</span>
                    </button>

                    {/* Write with AI Button */}
                    <button
                      type="button"
                      onClick={() => triggerProjectBulletsAi(proj.id, proj.title, techArray, count)}
                      className="text-xs text-primary-glow hover:text-primary font-semibold flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-lg border border-primary/25 transition-all cursor-pointer shadow-xs"
                      title={`Generate ${count} achievement bullets with LetGetIn AI Coach`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-primary-glow" />
                      <span>Write with AI</span>
                    </button>

                    {/* Add Bullet Button */}
                    <button
                      type="button"
                      onClick={() => addHighlight(proj.id)}
                      className="text-xs text-primary-glow hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Bullet</span>
                    </button>
                  </div>
                </div>

                {/* Bullet List with Expandable Textareas & Per-Bullet AI Icon */}
                <div className="space-y-2">
                  {(proj.highlights || []).map((bullet, hIdx) => {
                    const bulletStr = typeof bullet === 'string' ? bullet : typeof bullet === 'object' && bullet ? ((bullet as any).text || (bullet as any).bullet || (bullet as any).highlight || (bullet as any).description || Object.values(bullet)[0] || '') : String(bullet || '');
                    return (
                    <div key={hIdx} className="flex items-start gap-2 group">
                      <span className="text-ink-soft text-xs mt-2.5 shrink-0">•</span>

                      {/* Expandable / Auto-Growing Bullet Textarea */}
                      <textarea
                        ref={(el) => {
                          bulletRefs.current[`${proj.id}-${hIdx}`] = el;
                        }}
                        rows={1}
                        value={bulletStr}
                        onChange={(e) => {
                          handleHighlightChange(proj.id, hIdx, e.target.value);
                          setActiveResumeContext({
                            section: 'projects',
                            itemId: proj.id,
                            field: 'bullet',
                            bulletIndex: hIdx,
                            value: e.target.value,
                            title: proj.title,
                          });
                        }}
                        onFocus={(e) => {
                          e.target.style.height = 'auto';
                          e.target.style.height = `${Math.max(48, e.target.scrollHeight)}px`;
                          setActiveResumeContext({
                            section: 'projects',
                            itemId: proj.id,
                            field: 'bullet',
                            bulletIndex: hIdx,
                            value: bulletStr,
                            title: proj.title,
                          });
                        }}
                        onInput={(e: any) => {
                          e.target.style.height = 'auto';
                          e.target.style.height = `${Math.max(38, e.target.scrollHeight)}px`;
                        }}
                        placeholder="Describe key features built, architectural choices, and performance optimizations..."
                        className="flex-1 input-base text-xs leading-relaxed resize-y overflow-hidden transition-all focus:ring-1 focus:ring-primary-glow min-h-[38px] py-2"
                      />

                      {/* Per-Bullet AI Writing Assistant */}
                      <div className="mt-1 shrink-0">
                        <AIWritingAssistant
                          value={bulletStr}
                          context="resume-project"
                          metadata={{ projectName: proj.title }}
                          textareaRef={getBulletRefObject(`${proj.id}-${hIdx}`)}
                          onApply={(next) => handleHighlightChange(proj.id, hIdx, next)}
                          iconOnly
                          title="Improve this bullet point with AI"
                        />
                      </div>

                      {/* Delete Bullet Button */}
                      <button
                        type="button"
                        onClick={() => removeHighlight(proj.id, hIdx)}
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
      {activeModalProj && (
        <AiBulletRerankModal
          isOpen={!!modalProjId}
          onClose={() => setModalProjId(null)}
          title={activeModalProj.title || 'Project'}
          currentCount={(activeModalProj.highlights || []).length}
          initialTargetCount={getBulletCount(activeModalProj.id)}
          onConfirm={(targetCount, customContext) => {
            setBulletCount(activeModalProj.id, targetCount);
            triggerProjectBulletsAi(
              activeModalProj.id,
              activeModalProj.title,
              getTechArray(activeModalProj.technologies),
              targetCount,
              customContext
            );
          }}
        />
      )}
    </div>
  );
};
