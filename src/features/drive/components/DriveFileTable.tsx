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
  ShieldCheck,
  Sparkles,
  ExternalLink,
  Clock,
  Award,
} from "lucide-react";
import { DriveFile, DriveCategory } from "../services/driveService";
import { downloadDriveFile } from "../utils/downloadHelper";

interface DriveFileTableProps {
  files: DriveFile[];
  onPreview: (file: DriveFile) => void;
  onDelete: (id: string) => void;
  onToggleStar: (id: string) => void;
  onEdit: (file: DriveFile) => void;
}

export const DriveFileTable: React.FC<DriveFileTableProps> = ({
  files,
  onPreview,
  onDelete,
  onToggleStar,
  onEdit,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleCopy = (e: React.MouseEvent, file: DriveFile) => {
    e.stopPropagation();
    if (file.source === "resume") {
      const fullBuilderUrl = `${window.location.origin}/builder?resumeId=${file.resumeId || file._id}`;
      navigator.clipboard.writeText(fullBuilderUrl);
    } else {
      const url = file.cloudinary?.secureUrl || file.cloudinary?.url || "";
      navigator.clipboard.writeText(url);
    }
    setCopiedId(file._id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (e: React.MouseEvent, file: DriveFile) => {
    e.stopPropagation();
    if (file.source === "resume") {
      window.open(`/builder?resumeId=${file.resumeId || file._id}`, "_blank");
    } else {
      const url = file.cloudinary?.secureUrl || file.cloudinary?.url || "";
      downloadDriveFile(url, file.originalName);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-ink">
          <thead className="bg-surface-alt/60 border-b border-border text-[11px] font-bold uppercase tracking-wider text-ink-soft select-none">
            <tr>
              <th className="py-3 px-4 w-10 text-center">⭐</th>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Source & Category</th>
              <th className="py-3 px-4">Size</th>
              <th className="py-3 px-4">Uploaded / Modified</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {files.map((file) => {
              const fileUrl = file.cloudinary?.secureUrl || file.cloudinary?.url || "";
              const isImage = file.category === "image" || file.mimeType.startsWith("image/");
              const isResume = file.source === "resume";
              const isProfile = file.source === "profile";

              return (
                <tr
                  key={file._id}
                  onClick={() => onPreview(file)}
                  className="hover:bg-surface-alt/50 transition cursor-pointer group"
                >
                  <td className="py-3 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onToggleStar(file._id)}
                      className="text-ink-soft hover:text-amber-500 transition"
                    >
                      <Star
                        className={`w-4 h-4 mx-auto ${
                          file.starred ? "fill-amber-500 text-amber-500" : "opacity-40 group-hover:opacity-100"
                        }`}
                      />
                    </button>
                  </td>

                  <td className="py-3 px-4 font-semibold max-w-xs truncate">
                    <div className="flex items-center gap-2.5">
                      {isImage ? (
                        <img
                          src={fileUrl}
                          alt={file.originalName}
                          className="w-7 h-7 rounded-lg object-cover border border-border shrink-0"
                        />
                      ) : isResume ? (
                        <div className="w-7 h-7 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                      ) : isProfile ? (
                        <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary-glow flex items-center justify-center shrink-0">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <span className="truncate group-hover:text-primary-glow transition" title={file.originalName}>
                        {file.originalName}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {isProfile ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-500 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          Profile • {file.section || "Doc"}
                        </span>
                      ) : isResume ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-500 text-[10px] font-bold uppercase tracking-wider border border-purple-500/20">
                          <Sparkles className="w-2.5 h-2.5" />
                          Resume Builder
                        </span>
                      ) : (
                        <span className="capitalize px-2 py-0.5 rounded-md bg-secondary text-[11px] font-semibold border border-border">
                          {file.category}
                        </span>
                      )}

                      {isProfile && file.verificationStatus && (
                        <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
                          file.verificationStatus === "verified"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : file.verificationStatus === "rejected"
                            ? "bg-rose-500/10 text-rose-500 border-rose-500/20"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        }`}>
                          {file.verificationStatus}
                        </span>
                      )}

                      {isResume && file.atsScore !== undefined && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          ATS {file.atsScore}%
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-ink-soft font-mono text-[11px]">
                    {formatFileSize(file.size)}
                  </td>

                  <td className="py-3 px-4 text-ink-soft text-[11px]">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </td>

                  <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onPreview(file)}
                        className="p-1.5 hover:text-primary-glow hover:bg-surface rounded-lg transition"
                        title="Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {isResume ? (
                        <Link
                          href={`/builder?resumeId=${file.resumeId || file._id}`}
                          className="p-1.5 hover:text-purple-500 hover:bg-purple-500/10 rounded-lg transition text-purple-600 dark:text-purple-400"
                          title="Open in Builder"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleDownload(e, file)}
                          className="p-1.5 hover:text-primary-glow hover:bg-surface rounded-lg transition"
                          title="Download"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => handleCopy(e, file)}
                        className="p-1.5 hover:text-primary-glow hover:bg-surface rounded-lg transition"
                        title="Copy Link"
                      >
                        {copiedId === file._id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit(file)}
                        className="p-1.5 hover:text-ink hover:bg-surface rounded-lg transition"
                        title="Edit Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onDelete(file._id)}
                        className="p-1.5 text-ink-soft hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
