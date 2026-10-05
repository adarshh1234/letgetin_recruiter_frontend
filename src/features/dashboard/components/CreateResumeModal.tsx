import React, { useState } from "react";
import { X, Sparkles, LayoutTemplate } from "lucide-react";
import { useRouter } from "next/navigation";
import { useResumeStore } from "../../resume/store/useResumeStore";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

interface CreateResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateResumeModal: React.FC<CreateResumeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const { updateTitle, updateTemplateId } = useResumeStore();
  const [title, setTitle] = useState("My Professional Resume");
  const [selectedTemplate, setSelectedTemplate] = useState("modern-sleek");

  if (!isOpen) return null;

  const templates = [
    {
      id: "modern-sleek",
      name: "Modern Sleek",
      category: "Contemporary Accent",
      desc: "Vibrant colors, dark mode accents",
    },
    {
      id: "classic-ats",
      name: "Classic ATS",
      category: "High ATS Compatibility",
      desc: "Traditional serif structure for scanners",
    },
    {
      id: "minimal-clean",
      name: "Minimal Clean",
      category: "Clean & Spacious",
      desc: "Minimalist whitespace design",
    },
    {
      id: "executive-pro",
      name: "Executive Pro",
      category: "Two-Column Layout",
      desc: "Sidebar contact and core skills",
    },
  ];

  const handleCreate = () => {
    updateTitle(title.trim() || "My Professional Resume");
    updateTemplateId(selectedTemplate);
    useAuthStore.getState().completeOnboarding().catch(() => {});
    onClose();
    router.push("/builder");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-surface border border-white/20 rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-elegant space-y-6 text-ink">
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center text-primary-foreground font-bold text-xs shadow-glow">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-ink">Create New Resume</h2>
          </div>
          <button
            onClick={onClose}
            className="text-ink-soft hover:text-ink p-1 rounded-xl hover:bg-surface-alt transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink mb-1.5">
            Document Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Senior Software Engineer Resume"
            className="input-base"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink mb-3">
            Select Initial Template
          </label>
          <div className="grid grid-cols-2 gap-3">
            {templates.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => setSelectedTemplate(tpl.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedTemplate === tpl.id
                    ? "bg-primary/10 border-primary-glow text-ink ring-2 ring-primary-glow/40 shadow-glow"
                    : "bg-surface-alt border-border text-ink-soft hover:border-primary-glow/40"
                }`}
              >
                <div className="flex items-center  p-0 gap-2 mb-1.5">
                  <LayoutTemplate
                    className={`w-4 h-4 ${selectedTemplate === tpl.id ? "text-primary-glow" : "text-ink-soft"}`}
                  />
                  <span className="text-xs font-bold text-ink">{tpl.name}</span>
                </div>
                <p className="text-[11px] text-ink-soft leading-tight">
                  {tpl.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-border flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-semibold text-ink-soft hover:text-ink transition-colors rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-6 py-2.5 text-xs font-semibold bg-gradient-brand text-primary-foreground rounded-xl shadow-elegant hover:shadow-glow transition-all hover:scale-[1.02] active:scale-95"
          >
            Launch Builder
          </button>
        </div>
      </div>
    </div>
  );
};
