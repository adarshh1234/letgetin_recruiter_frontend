"use client";

import React, { useRef, useState } from "react";
import { UploadCloud, X, Loader2, AlertCircle, Video as VideoIcon } from "lucide-react";
import { videoProfileService } from "../services/videoProfileService";
import { VideoProfileItem, VideoType } from "../types";

interface VideoUploadModalProps {
  isOpen: boolean;
  videoType: VideoType;
  maxSizeBytes: number;
  onClose: () => void;
  onSuccess: (video: VideoProfileItem) => void;
}

function formatMb(bytes: number): string {
  return (bytes / (1024 * 1024)).toFixed(bytes % (1024 * 1024) === 0 ? 0 : 2);
}

export function VideoUploadModal({ isOpen, videoType, maxSizeBytes, onClose, onSuccess }: VideoUploadModalProps) {
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const label = videoType === "short" ? "Short Video" : "Long Video";
  const maxMb = formatMb(maxSizeBytes);

  const validateFile = (file: File): boolean => {
    setErrorMessage(null);
    if (!file.type.startsWith("video/")) {
      setErrorMessage("Please select a video file.");
      return false;
    }
    if (file.size > maxSizeBytes) {
      const fileMb = formatMb(file.size);
      setErrorMessage(`${label} must be ${maxMb} MB or smaller (this file is ${fileMb} MB).`);
      return false;
    }
    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setErrorMessage(null);
    setUploadProgress(0);
    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleStartUpload = async () => {
    if (!selectedFile || isUploading) return;
    if (!validateFile(selectedFile)) return;

    setIsUploading(true);
    setUploadProgress(0);
    setErrorMessage(null);

    try {
      const video = await videoProfileService.upload(selectedFile, videoType, (progress) => {
        setUploadProgress(progress);
      });
      onSuccess(video);
      handleReset();
      onClose();
    } catch (err) {
      const apiError = err as { error?: { message?: string }; message?: string };
      setErrorMessage(apiError?.error?.message || apiError?.message || "Failed to upload video.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5 animate-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary-glow flex items-center justify-center font-bold">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-ink text-base">Upload {label}</h3>
              <p className="text-[11px] text-ink-soft">Max file size {maxMb} MB</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (!isUploading) {
                handleReset();
                onClose();
              }
            }}
            disabled={isUploading}
            className="p-1.5 text-ink-soft hover:text-ink hover:bg-surface-alt rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="bg-rose-500/10 border border-rose-500/30 text-rose-600 text-xs p-3 rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {!selectedFile ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition cursor-pointer flex flex-col items-center justify-center space-y-3 ${
              dragOver ? "border-primary-glow bg-primary/5 scale-[0.99]" : "border-border hover:border-primary-glow/60 hover:bg-secondary/40"
            }`}
          >
            <input ref={fileInputRef} type="file" accept="video/*" onChange={handleInputChange} className="hidden" />
            <div className="w-14 h-14 rounded-2xl bg-secondary text-primary-glow flex items-center justify-center shadow-inner">
              <UploadCloud className="w-7 h-7 animate-bounce" />
            </div>
            <div>
              <p className="font-bold text-ink text-sm">Click to browse or drag & drop a video here</p>
              <p className="text-xs text-ink-soft mt-1">Any common video format, up to {maxMb} MB</p>
            </div>
          </div>
        ) : (
          <div className="bg-secondary/50 border border-border rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary-glow flex items-center justify-center shrink-0">
                  <VideoIcon className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-ink text-xs truncate">{selectedFile.name}</p>
                  <p className="text-[10px] text-ink-soft">{formatMb(selectedFile.size)} MB</p>
                </div>
              </div>
              {!isUploading && (
                <button onClick={handleReset} className="text-xs text-rose-500 hover:underline font-bold">
                  Change
                </button>
              )}
            </div>

            {isUploading && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-ink flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-primary-glow" />
                    Uploading...
                  </span>
                  <span className="text-primary-glow font-bold">{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden border border-border">
                  <div className="h-full bg-gradient-brand transition-all duration-300 rounded-full" style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
          <button
            type="button"
            onClick={() => {
              handleReset();
              onClose();
            }}
            disabled={isUploading}
            className="px-4 py-2 text-xs font-bold text-ink-soft hover:text-ink rounded-xl transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleStartUpload}
            disabled={!selectedFile || isUploading}
            className="inline-flex items-center gap-2 bg-gradient-brand text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition cursor-pointer disabled:opacity-40"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>Upload</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
