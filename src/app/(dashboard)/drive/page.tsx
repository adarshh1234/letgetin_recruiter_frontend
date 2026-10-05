"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Grid,
  List,
  Filter,
  ArrowUpDown,
  RefreshCw,
  HardDrive,
  FolderOpen,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FilePlus,
  Star,
  FileText,
  Image as ImageIcon,
  FileArchive,
  ShieldCheck,
} from "lucide-react";
import {
  DriveService,
  DriveFile,
  StorageStats,
  DriveCategory,
} from "@/features/drive/services/driveService";
import { StorageQuotaBar } from "@/features/drive/components/StorageQuotaBar";
import { DriveFileUploadModal } from "@/features/drive/components/DriveFileUploadModal";
import { DriveFilePreviewModal } from "@/features/drive/components/DriveFilePreviewModal";
import { DriveFileCard } from "@/features/drive/components/DriveFileCard";
import { DriveFileTable } from "@/features/drive/components/DriveFileTable";
import { DriveFileEditModal } from "@/features/drive/components/DriveFileEditModal";
import { AIChat } from "@/features/aiAssistant/components/AIChat";

export default function DrivePage() {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filters & Controls
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Modals
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<DriveFile | null>(null);
  const [editFile, setEditFile] = useState<DriveFile | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const loadDriveData = useCallback(async () => {
    setIsLoading(true);
    setErrorNotice(null);
    try {
      const data = await DriveService.getDriveFiles({
        search,
        category: activeCategory !== "all" && activeCategory !== "starred" ? activeCategory : undefined,
        starred: activeCategory === "starred" || showStarredOnly ? true : undefined,
        sortBy,
        sortOrder,
      });
      setFiles(data.files);
      setStats(data.stats);
    } catch (err: any) {
      setErrorNotice(
        err?.message || err?.error?.message || "Failed to load drive storage contents"
      );
    } finally {
      setIsLoading(false);
    }
  }, [search, activeCategory, showStarredOnly, sortBy, sortOrder]);

  useEffect(() => {
    loadDriveData();
  }, [loadDriveData]);

  const handleToggleStar = async (id: string) => {
    try {
      const updated = await DriveService.toggleStar(id);
      setFiles((prev) =>
        prev.map((f) => (f._id === id ? { ...f, starred: updated.starred } : f))
      );
      if (previewFile?._id === id) {
        setPreviewFile((prev) => (prev ? { ...prev, starred: updated.starred } : null));
      }
      showToast(updated.starred ? "File starred" : "File unstarred");
    } catch (err: any) {
      alert(err?.message || "Failed to update star status");
    }
  };

  const handleDeleteFile = async (id: string) => {
    if (!confirm("Are you sure you want to delete this file from your drive? This action cannot be undone.")) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await DriveService.deleteFile(id);
      setFiles((prev) => prev.filter((f) => f._id !== id));
      setStats(res.stats);
      if (previewFile?._id === id) {
        setPreviewFile(null);
      }
      showToast("File deleted and storage space reclaimed!");
    } catch (err: any) {
      alert(err?.message || "Failed to delete file");
    } finally {
      setDeletingId(null);
    }
  };

  const categoryFilterTabs = [
    { id: "all", label: "All Files", icon: FolderOpen },
    { id: "profile", label: "Profile Docs", icon: ShieldCheck },
    { id: "resume", label: "Resumes", icon: Sparkles },
    { id: "document", label: "Documents", icon: FileText },
    { id: "image", label: "Images", icon: ImageIcon },
    { id: "pdf", label: "PDFs", icon: FileText },
    { id: "archive", label: "Archives", icon: FileArchive },
    { id: "starred", label: "Starred", icon: Star },
  ];

  const remainingBytes = stats?.remainingBytes ?? 50 * 1024 * 1024;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white font-bold text-xs px-4 py-3 rounded-2xl shadow-glow flex items-center gap-2.5 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Unified Storage Quota Header Bar Card */}
      <StorageQuotaBar
        stats={stats}
        onUploadClick={() => setIsUploadModalOpen(true)}
        onRefresh={loadDriveData}
        isLoading={isLoading}
      />

      {/* Control & Toolbar Row */}
      <div className="bg-surface border border-border rounded-2xl p-4 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categoryFilterTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-gradient-brand text-white shadow-sm"
                      : "bg-surface-alt/60 text-ink-soft hover:text-ink hover:bg-surface-alt"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-primary-glow"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search, Sort & View Mode Controls */}
          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 md:w-60">
              <Search className="w-4 h-4 text-ink-soft absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search drive files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full input-base text-xs pl-9 py-2 bg-surface text-ink font-medium"
              />
            </div>

            {/* Sort Selector */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-base text-xs py-2 px-3 bg-surface text-ink font-semibold"
              >
                <option value="createdAt">Date Uploaded</option>
                <option value="name">File Name</option>
                <option value="size">File Size</option>
              </select>
            </div>

            {/* Sort Order Toggle */}
            <button
              onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
              className="p-2 border border-border text-ink-soft hover:text-ink hover:bg-surface rounded-xl transition cursor-pointer"
              title={`Sort ${sortOrder === "asc" ? "Ascending" : "Descending"}`}
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>

            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-surface-alt/80 rounded-xl border border-border">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "grid"
                    ? "bg-surface text-primary-glow shadow-xs font-bold"
                    : "text-ink-soft hover:text-ink"
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition ${
                  viewMode === "table"
                    ? "bg-surface text-primary-glow shadow-xs font-bold"
                    : "text-ink-soft hover:text-ink"
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Files Display Area */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3 bg-surface border border-border rounded-3xl">
          <Loader2 className="w-8 h-8 text-primary-glow animate-spin mx-auto" />
          <p className="text-xs font-bold text-ink-soft">Loading drive storage...</p>
        </div>
      ) : errorNotice ? (
        <div className="p-8 text-center bg-rose-500/10 border border-rose-500/30 rounded-3xl space-y-3">
          <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
          <h3 className="font-bold text-rose-600 text-sm">Failed to Load Drive</h3>
          <p className="text-xs text-rose-700/80">{errorNotice}</p>
          <button
            onClick={loadDriveData}
            className="px-4 py-2 bg-rose-600 text-white font-bold text-xs rounded-xl hover:bg-rose-700 transition"
          >
            Retry
          </button>
        </div>
      ) : files.length === 0 ? (
        /* Empty State */
        <div className="py-16 px-6 text-center space-y-4 bg-surface border border-border rounded-3xl">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 text-primary-glow flex items-center justify-center mx-auto shadow-inner">
            <HardDrive className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="font-bold text-ink text-base">No files found</h3>
            <p className="text-xs text-ink-soft mt-1">
              {search || activeCategory !== "all"
                ? "No drive files match your selected filters or search terms."
                : "Your drive is empty. Start uploading your resumes, certificates, images, and documents up to 50 MB."}
            </p>
          </div>
          <div>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="inline-flex items-center gap-2 bg-gradient-brand text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition"
            >
              <FilePlus className="w-4 h-4" />
              <span>Upload First File</span>
            </button>
          </div>
        </div>
      ) : (
        /* Render Grid or Table View */
        <div>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {files.map((file) => (
                <DriveFileCard
                  key={file._id}
                  file={file}
                  onPreview={(f) => setPreviewFile(f)}
                  onDelete={handleDeleteFile}
                  onToggleStar={handleToggleStar}
                  onEdit={(f) => setEditFile(f)}
                />
              ))}
            </div>
          ) : (
            <DriveFileTable
              files={files}
              onPreview={(f) => setPreviewFile(f)}
              onDelete={handleDeleteFile}
              onToggleStar={handleToggleStar}
              onEdit={(f) => setEditFile(f)}
            />
          )}
        </div>
      )}

      {/* Upload File Modal */}
      <DriveFileUploadModal
        isOpen={isUploadModalOpen}
        remainingBytes={remainingBytes}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={(data) => {
          setFiles((prev) => [data.file, ...prev]);
          setStats(data.stats);
          showToast("File uploaded successfully to your Cloud Drive!");
        }}
      />

      {/* File Preview Modal */}
      <DriveFilePreviewModal
        file={previewFile}
        onClose={() => setPreviewFile(null)}
        onStarToggle={handleToggleStar}
      />

      {/* File Edit Details Modal */}
      <DriveFileEditModal
        file={editFile}
        onClose={() => setEditFile(null)}
        onSuccess={(updated) => {
          setFiles((prev) => prev.map((f) => (f._id === updated._id ? updated : f)));
          showToast("File details updated");
        }}
      />

      {/* Contextual AI Assistant */}
      <AIChat context="drive" contextPayload={{ driveFileId: previewFile?._id }} />
    </div>
  );
}
