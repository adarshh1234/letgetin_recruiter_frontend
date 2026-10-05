"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, AlertCircle, Download } from "lucide-react";
import { VideoProfileItem } from "../types";

interface VideoPreviewModalProps {
  video: VideoProfileItem | null;
  onClose: () => void;
}

export function VideoPreviewModal({ video, onClose }: VideoPreviewModalProps) {
  const [mounted, setMounted] = useState(false);
  const [playbackError, setPlaybackError] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setPlaybackError(false);
  }, [video]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (video) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [video, onClose]);

  if (!video || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-surface border border-border rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 animate-in zoom-in-95">
        <div className="px-5 py-4 bg-surface/90 backdrop-blur border-b border-border flex items-center justify-between gap-3 shrink-0">
          <div className="min-w-0">
            <h3 className="font-bold text-ink text-sm truncate" title={video.originalName}>
              {video.originalName}
            </h3>
            <p className="text-[11px] text-ink-soft capitalize">{video.videoType} Video</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-ink-soft hover:text-rose-500 rounded-xl border border-border hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer shrink-0"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-center bg-black">
          {!playbackError ? (
            <video
              src={video.cloudinary.secureUrl}
              controls
              autoPlay
              className="w-full max-h-[70vh]"
              onError={() => setPlaybackError(true)}
            />
          ) : (
            <div className="p-10 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary-glow mx-auto flex items-center justify-center">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div>
                <p className="text-sm font-bold text-ink">Preview not available</p>
                <p className="text-xs text-ink-soft mt-1">This format can&apos;t be previewed in your browser.</p>
              </div>
              <a
                href={video.cloudinary.secureUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-brand text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-elegant hover:shadow-glow transition"
              >
                <Download className="w-4 h-4" />
                <span>Download instead</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
