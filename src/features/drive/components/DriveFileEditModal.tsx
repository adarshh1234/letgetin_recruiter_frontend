import React, { useState, useEffect } from "react";
import { X, Edit2, Check, Loader2 } from "lucide-react";
import { DriveFile, DriveService } from "../services/driveService";

interface DriveFileEditModalProps {
  file: DriveFile | null;
  onClose: () => void;
  onSuccess: (updatedFile: DriveFile) => void;
}

export const DriveFileEditModal: React.FC<DriveFileEditModalProps> = ({
  file,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (file) {
      setName(file.originalName);
      setDescription(file.description || "");
      setTagsInput(file.tags?.join(", ") || "");
    }
  }, [file]);

  if (!file) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);
    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const updated = await DriveService.updateFile(file._id, {
        originalName: name.trim(),
        description: description.trim(),
        tags,
      });

      onSuccess(updated);
      onClose();
    } catch (err: any) {
      alert(err?.message || "Failed to update file details");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-surface border border-border rounded-3xl shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Edit2 className="w-4 h-4 text-primary-glow" />
            <h3 className="font-bold text-ink text-sm">Edit File Details</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-ink-soft hover:text-ink hover:bg-surface-alt rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-ink-soft mb-1">
              File Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full input-base px-3 py-2 bg-surface text-ink font-medium"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-ink-soft mb-1">
              Description / Notes (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Add optional notes or description about this document..."
              className="w-full input-base px-3 py-2 bg-surface text-ink font-medium resize-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-ink-soft mb-1">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="resume, certificate, 2026, tech"
              className="w-full input-base px-3 py-2 bg-surface text-ink font-medium"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-bold text-ink-soft hover:text-ink rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 bg-gradient-brand text-white font-bold px-4 py-2 rounded-xl shadow-sm hover:shadow-glow transition disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
