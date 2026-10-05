import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useResumeStore } from "../../store/useResumeStore";
import { useAuthStore } from "../../../auth/store/useAuthStore";
import { Logo } from "@/components/landing/Logo";
import { UserDropdown } from "@/components/layout/UserDropdown";
import {
  Check,
  Cloud,
  RefreshCw,
  AlertCircle,
  Download,
  Sparkles,
  LayoutTemplate,
  User,
  UserCheck,
  Pencil,
  Save,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { TemplateModal } from "@/features/templates/components/TemplateModal";
import { useTailorResumeStore } from "@/features/tailorResume/store/useTailorResumeStore";

interface EditorHeaderProps {
  onToggleAi: () => void;
  isAiOpen: boolean;
  onDownloadPdf: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  onToggleAi,
  isAiOpen,
  onDownloadPdf,
}) => {
  const router = useRouter();
  const { resume, updateTitle, saveStatus, lastSavedAt, isDirty, syncFromProfile, saveResume } =
    useResumeStore();
  const { isAuthenticated } = useAuthStore();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(resume.title);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isSyncingProfile, setIsSyncingProfile] = useState(false);

  const handleSaveAndReturn = async () => {
    // While a Tailor Resume session is active, this header is shared with that workspace's own
    // "Save Tailored Resume" button. Route through the same finalize flow rather than a plain
    // save - that's what actually applies accepted suggestions, handles the rename-creates-a-
    // new-resume case, deletes the staging session, and re-enables autosave afterwards.
    if (useResumeStore.getState().isTailorModeActive) {
      const result = await useTailorResumeStore.getState().finalize();
      if (result) {
        toast.success(result.isNew ? "Saved as a new resume in My Resume!" : "Tailored resume saved!");
        router.push("/resume");
      } else {
        toast.error(useTailorResumeStore.getState().error || "Failed to save resume. Please try again.");
      }
      return;
    }

    await saveResume();
    if (useResumeStore.getState().saveStatus !== "error") {
      router.push("/resume");
    } else {
      toast.error("Failed to save resume. Please try again.");
    }
  };

  const handleSyncProfile = async () => {
    setIsSyncingProfile(true);
    try {
      await syncFromProfile();
      toast.success("Resume synchronized with your profile details!");
    } catch {
      toast.error("Failed to sync from profile.");
    } finally {
      setIsSyncingProfile(false);
    }
  };

  const handleTitleSubmit = () => {
    if (titleInput.trim()) {
      updateTitle(titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <>
      <header className="glass border-b border-white/20 text-ink px-6 h-16 flex items-center justify-between sticky top-0 z-30 shadow-elegant no-print">
        {/* Left: Brand & Document Title */}
        <div className="flex items-center gap-4">
          {/* <Logo /> */}
          <div className="h-5 w-px bg-border mx-1 hidden sm:block" />

          {isEditingTitle ? (
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === "Enter" && handleTitleSubmit()}
              autoFocus
              className="input-base text-xs px-3 py-1 font-semibold max-w-[200px]"
            />
          ) : (
            <button
              onClick={() => {
                setTitleInput(resume.title);
                setIsEditingTitle(true);
              }}
              className="text-ink hover:text-primary-glow text-sm font-semibold hover:bg-surface-alt px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 group cursor-pointer"
              title="Click to rename"
            >
              <span>{resume.title}</span>
              <Pencil className="w-3.5 h-3.5 text-ink-soft group-hover:text-primary-glow transition-colors" />
            </button>
          )}

          {/* Save Status Indicator */}
          <div className="flex items-center gap-1.5 text-xs text-ink-soft bg-surface-alt px-3 py-1 rounded-full border border-border">
            {saveStatus === "saving" && (
              <>
                <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span className="text-amber-400 font-semibold">Saving...</span>
              </>
            )}
            {saveStatus === "saved" && (
              <>
                <Check className="w-3.5 h-3.5 text-success" />
                <span className="text-success font-semibold">
                  Saved {lastSavedAt ? `at ${lastSavedAt}` : ""}
                </span>
              </>
            )}
            {saveStatus === "unsaved" && isDirty && (
              <>
                <Cloud className="w-3.5 h-3.5 text-primary-glow" />
                <span>Unsaved changes</span>
              </>
            )}
            {saveStatus === "error" && (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                <span className="text-destructive font-semibold">
                  Save failed
                </span>
              </>
            )}
            {saveStatus === "idle" && (
              <>
                <Cloud className="w-3.5 h-3.5 text-ink-soft" />
                <span>
                  {isAuthenticated ? "Cloud Synced" : "Offline Draft"}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Right: Controls & Actions */}
        <div className="flex items-center gap-2.5">
          {/* Sync from Profile Button */}
          <button
            onClick={handleSyncProfile}
            disabled={isSyncingProfile}
            className="flex items-center gap-1.5 text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 px-3 py-2 rounded-xl transition-all shadow-xs disabled:opacity-50"
            title="Import and sync personal, education, experience, and skill details from your Profile"
          >
            <UserCheck className={`w-3.5 h-3.5 ${isSyncingProfile ? "animate-spin" : ""}`} />
            <span className="hidden md:inline">Sync Profile</span>
          </button>

          {/* Template Selector Modal Trigger */}
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="flex items-center gap-2 text-xs font-semibold bg-surface-alt hover:bg-surface text-ink px-3.5 py-2 rounded-xl border border-border transition-all shadow-xs hover:border-primary-glow"
            title="Choose Resume Template Layout"
          >
            <LayoutTemplate className="w-4 h-4 text-primary-glow" />
            <span className="hidden sm:inline">Templates</span>
          </button>

          {/* AI Assistant Button */}
          <button
            onClick={onToggleAi}
            className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-elegant ${
              isAiOpen
                ? "bg-gradient-brand text-primary-foreground ring-2 ring-primary-glow/50"
                : "bg-surface-alt hover:bg-surface text-primary-glow border border-primary/20"
            }`}
          >
            <Sparkles className="w-4 h-4 text-primary-glow" />
            <span className="hidden sm:inline">AI Assistant</span>
          </button>

          {/* Save & Return to My Resume */}
          <button
            onClick={handleSaveAndReturn}
            disabled={saveStatus === "saving"}
            className="flex items-center gap-2 text-xs font-semibold bg-surface-alt hover:bg-surface text-ink px-3.5 py-2 rounded-xl border border-border transition-all shadow-xs disabled:opacity-60"
            title="Save and return to My Resume"
          >
            {saveStatus === "saving" ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4 text-primary-glow" />
            )}
            <span className="hidden sm:inline">Save</span>
          </button>

          {/* Download PDF Button */}
          <button
            onClick={onDownloadPdf}
            className="flex items-center gap-2 text-xs font-semibold bg-gradient-brand text-primary-foreground px-4 py-2 rounded-xl shadow-elegant hover:shadow-glow transition-all hover:scale-[1.02] active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>

          {/* User Account Dropdown / Login */}

          {/* {isAuthenticated ? (
            <UserDropdown />
          ) : (
            <Link
              href="/auth"
              className="text-xs font-semibold text-ink bg-surface-alt hover:bg-surface px-4 py-2 rounded-xl border border-border transition-colors flex items-center gap-2"
            >
              <User className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
          )} */}
        </div>
      </header>

      {/* Template Selection Modal */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
      />
    </>
  );
};
