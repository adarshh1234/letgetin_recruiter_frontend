import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Image as ImageIcon,
  FileArchive,
  File,
  Download,
  Star,
  Trash2,
  Eye,
  Copy,
  Check,
  Edit2,
  ExternalLink,
  ShieldCheck,
  Clock,
  Sparkles,
  Award,
} from "lucide-react";
import { DriveFile, DriveCategory } from "../services/driveService";
import { downloadDriveFile } from "../utils/downloadHelper";

interface DriveFileCardProps {
  file: DriveFile;
  onPreview: (file: DriveFile) => void;
  onDelete: (id: string) => void;
  onToggleStar: (id: string) => void;
  onEdit: (file: DriveFile) => void;
}

export const DriveFileCard: React.FC<DriveFileCardProps> = ({
  file,
  onPreview,
  onDelete,
  onToggleStar,
  onEdit,
}) => {
  const [copied, setCopied] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const isImage = file.category === "image" || file.mimeType.startsWith("image/");
  const isResume = file.source === "resume";
  const isProfile = file.source === "profile";
  const fileUrl = file.cloudinary?.secureUrl || file.cloudinary?.url || "";

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isResume) {
      const fullBuilderUrl = `${window.location.origin}/builder?resumeId=${file.resumeId || file._id}`;
      navigator.clipboard.writeText(fullBuilderUrl);
    } else {
      navigator.clipboard.writeText(fileUrl);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isResume) {
      window.open(`/builder?resumeId=${file.resumeId || file._id}`, "_blank");
    } else {
      downloadDriveFile(fileUrl, file.originalName);
    }
  };

  const categoryBadgeColors: Record<DriveCategory, string> = {
    pdf: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    image: "bg-sky-500/10 text-sky-500 border-sky-500/20",
    document: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    archive: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    audio: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    video: "bg-violet-500/10 text-violet-500 border-violet-500/20",
    other: "bg-slate-500/10 text-slate-500 border-slate-500/20",
  };

  const getCategoryIcon = () => {
    if (isResume) {
      return <Sparkles className="w-6 h-6 text-purple-500" />;
    }
    if (isProfile) {
      return <ShieldCheck className="w-6 h-6 text-indigo-500" />;
    }
    switch (file.category) {
      case "pdf":
        return <FileText className="w-6 h-6 text-rose-500" />;
      case "image":
        return <ImageIcon className="w-6 h-6 text-sky-500" />;
      case "document":
        return <FileText className="w-6 h-6 text-emerald-500" />;
      case "archive":
        return <FileArchive className="w-6 h-6 text-amber-500" />;
      default:
        return <File className="w-6 h-6 text-primary-glow" />;
    }
  };

  return (
    <div
      onClick={() => onPreview(file)}
      className="group relative bg-surface border border-border hover:border-primary-glow/50 rounded-2xl p-4 transition-all duration-200 shadow-xs hover:shadow-glow flex flex-col justify-between cursor-pointer space-y-3"
    >
      {/* Top Bar: Icon / Thumbnail & Star Toggle */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {isImage ? (
            <div className="w-12 h-12 rounded-xl border border-border overflow-hidden bg-secondary shrink-0 relative group-hover:scale-105 transition">
              <img
                src={fileUrl}
                alt={file.originalName}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 group-hover:scale-105 transition ${
              isResume
                ? "bg-purple-500/10 border-purple-500/20 text-purple-500"
                : isProfile
                ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-500"
                : "bg-secondary/70 border-border"
            }`}>
              {getCategoryIcon()}
            </div>
          )}

          <div className="min-w-0">
            <h4 className="font-bold text-ink text-xs truncate group-hover:text-primary-glow transition" title={file.originalName}>
              {file.originalName}
            </h4>

            {/* Source & Category Badges */}
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              {isProfile ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  {file.section || "Profile"}
                </span>
              ) : isResume ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider bg-purple-500/10 text-purple-500 border border-purple-500/20">
                  <Sparkles className="w-2.5 h-2.5" />
                  Resume
                </span>
              ) : (
                <span
                  className={`inline-block px-2 py-0.5 rounded-md border text-[10px] font-extrabold uppercase tracking-wider ${
                    categoryBadgeColors[file.category]
                  }`}
                >
                  {file.category}
                </span>
              )}

              {/* Verification status badge for profile documents */}
              {isProfile && file.verificationStatus && (
                <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
                  file.verificationStatus === "verified"
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : file.verificationStatus === "rejected"
                    ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                    : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                }`}>
                  {file.verificationStatus === "verified" ? (
                    <Check className="w-2.5 h-2.5" />
                  ) : (
                    <Clock className="w-2.5 h-2.5" />
                  )}
                  {file.verificationStatus}
                </span>
              )}

              {/* ATS score badge for resumes */}
              {isResume && file.atsScore !== undefined && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  <Award className="w-2.5 h-2.5" />
                  ATS {file.atsScore}%
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleStar(file._id);
          }}
          className={`p-1.5 rounded-lg border transition ${
            file.starred
              ? "text-amber-500 bg-amber-500/10 border-amber-500/30"
              : "text-ink-soft opacity-40 group-hover:opacity-100 hover:text-amber-500 hover:bg-surface border-transparent"
          }`}
          title={file.starred ? "Unstar file" : "Star file"}
        >
          <Star className={`w-4 h-4 ${file.starred ? "fill-amber-500 text-amber-500" : ""}`} />
        </button>
      </div>

      {/* Meta Specs */}
      <div className="text-[11px] text-ink-soft flex items-center justify-between pt-1">
        <span>{formatFileSize(file.size)}</span>
        <span>{new Date(file.createdAt).toLocaleDateString()}</span>
      </div>

      {/* Description / Tags if present */}
      {file.description && (
        <p className="text-[11px] text-ink-soft/80 line-clamp-1 italic">
          "{file.description}"
        </p>
      )}

      {/* Action Buttons Bar */}
      <div className="pt-2 border-t border-border flex items-center justify-between text-xs text-ink-soft">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(file);
            }}
            className="p-1.5 hover:text-primary-glow hover:bg-surface-alt rounded-lg transition"
            title="Preview file"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>

          {isResume ? (
            <Link
              href={`/builder?resumeId=${file.resumeId || file._id}`}
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 hover:text-purple-500 hover:bg-purple-500/10 rounded-lg transition text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1"
              title="Open in Resume Builder"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleDownload}
              className="p-1.5 hover:text-primary-glow hover:bg-surface-alt rounded-lg transition"
              title="Download file"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyLink}
            className="p-1.5 hover:text-primary-glow hover:bg-surface-alt rounded-lg transition"
            title={isResume ? "Copy Resume Link" : "Copy download link"}
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(file);
            }}
            className="p-1.5 hover:text-ink hover:bg-surface-alt rounded-lg transition"
            title="Edit details"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(file._id);
          }}
          className="p-1.5 text-ink-soft hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
          title="Delete file"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
