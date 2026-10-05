"use client";

import React from "react";
import { Play, Archive, Trash2, Loader2 } from "lucide-react";
import { VideoProfileItem } from "../types";

interface VideoCardProps {
  video: VideoProfileItem;
  onPlay: (video: VideoProfileItem) => void;
  onArchive?: (video: VideoProfileItem) => void;
  onDelete: (video: VideoProfileItem) => void;
  isBusy?: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function VideoCard({ video, onPlay, onArchive, onDelete, isBusy }: VideoCardProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xs group">
      <button
        type="button"
        onClick={() => onPlay(video)}
        className="relative w-full aspect-video bg-surface-alt/80 flex items-center justify-center cursor-pointer overflow-hidden"
      >
        <video src={video.cloudinary.secureUrl} preload="metadata" className="w-full h-full object-cover" muted />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <Play className="w-4 h-4 text-ink ml-0.5" fill="currentColor" />
          </div>
        </div>
      </button>

      <div className="p-3 space-y-2">
        <p className="text-xs font-bold text-ink truncate" title={video.originalName}>
          {video.originalName}
        </p>
        <div className="flex items-center justify-between text-[10px] text-ink-soft">
          <span>{formatFileSize(video.size)}</span>
          <span>{new Date(video.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-1.5 pt-1">
          {onArchive && (
            <button
              type="button"
              onClick={() => onArchive(video)}
              disabled={isBusy}
              title="Archive video"
              className="flex-1 inline-flex items-center justify-center gap-1 text-[11px] font-semibold text-ink-soft hover:text-ink border border-border rounded-lg py-1.5 hover:bg-surface-alt transition cursor-pointer disabled:opacity-50"
            >
              {isBusy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Archive className="w-3 h-3" />}
              <span>Archive</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => onDelete(video)}
            disabled={isBusy}
            title="Delete video"
            className="flex-1 inline-flex items-center justify-center gap-1 text-[11px] font-semibold text-rose-600 border border-rose-500/20 bg-rose-500/5 rounded-lg py-1.5 hover:bg-rose-500/10 transition cursor-pointer disabled:opacity-50"
          >
            {isBusy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
