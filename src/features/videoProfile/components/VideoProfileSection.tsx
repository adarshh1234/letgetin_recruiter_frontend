"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Plus, Loader2 } from "lucide-react";
import { videoProfileService } from "../services/videoProfileService";
import { VideoCard } from "./VideoCard";
import { VideoUploadModal } from "./VideoUploadModal";
import { VideoPreviewModal } from "./VideoPreviewModal";
import { VideoProfileItem, VideoType, VIDEO_SIZE_LIMITS } from "../types";

interface VideoColumnProps {
  title: string;
  videos: VideoProfileItem[];
  onAddMore?: () => void;
  onPlay: (v: VideoProfileItem) => void;
  onArchive?: (v: VideoProfileItem) => void;
  onDelete: (v: VideoProfileItem) => void;
  busyId: string | null;
  emptyLabel?: string;
}

function VideoColumn({ title, videos, onAddMore, onPlay, onArchive, onDelete, busyId, emptyLabel }: VideoColumnProps) {
  return (
    <div className="bg-surface/40 border border-border rounded-2xl p-4 space-y-3 h-full">
      <h3 className="text-sm font-bold text-ink">{title}</h3>
      <div className="grid grid-cols-1 gap-4">
        {videos.map((v) => (
          <VideoCard key={v._id} video={v} onPlay={onPlay} onArchive={onArchive} onDelete={onDelete} isBusy={busyId === v._id} />
        ))}
        {videos.length === 0 && emptyLabel && <p className="text-xs text-ink-soft">{emptyLabel}</p>}
        {onAddMore && (
          <button
            type="button"
            onClick={onAddMore}
            className="aspect-video rounded-2xl border-2 border-dashed border-border hover:border-primary-glow/60 hover:bg-secondary/40 transition flex flex-col items-center justify-center gap-1.5 text-ink-soft hover:text-ink cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span className="text-xs font-bold">Add More</span>
          </button>
        )}
      </div>
    </div>
  );
}

export function VideoProfileSection() {
  const [videos, setVideos] = useState<VideoProfileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadModalType, setUploadModalType] = useState<VideoType | null>(null);
  const [previewVideo, setPreviewVideo] = useState<VideoProfileItem | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadVideos = useCallback(async () => {
    setIsLoading(true);
    // videoProfileService.list() never throws - it resolves to [] on failure (same convention
    // as coverLetterService.list()), so there's no error branch to handle here.
    const list = await videoProfileService.list();
    setVideos(list);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const shortVideos = videos.filter((v) => v.videoType === "short" && !v.isArchived);
  const longVideos = videos.filter((v) => v.videoType === "long" && !v.isArchived);
  const archivedVideos = videos.filter((v) => v.isArchived);

  const handleUploadSuccess = (video: VideoProfileItem) => {
    setVideos((prev) => [video, ...prev]);
  };

  const handleArchive = async (video: VideoProfileItem) => {
    setBusyId(video._id);
    try {
      const updated = await videoProfileService.archive(video._id);
      setVideos((prev) => prev.map((v) => (v._id === updated._id ? updated : v)));
    } catch (err) {
      console.warn("Failed to archive video:", err);
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (video: VideoProfileItem) => {
    if (!confirm(`Delete "${video.originalName}"? This cannot be undone.`)) return;
    setBusyId(video._id);
    try {
      await videoProfileService.remove(video._id);
      setVideos((prev) => prev.filter((v) => v._id !== video._id));
    } catch (err) {
      console.warn("Failed to delete video:", err);
    } finally {
      setBusyId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-primary-glow animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <VideoColumn
          title="Short Video"
          videos={shortVideos}
          onAddMore={() => setUploadModalType("short")}
          onPlay={setPreviewVideo}
          onArchive={handleArchive}
          onDelete={handleDelete}
          busyId={busyId}
        />

        <VideoColumn
          title="Long Video"
          videos={longVideos}
          onAddMore={() => setUploadModalType("long")}
          onPlay={setPreviewVideo}
          onArchive={handleArchive}
          onDelete={handleDelete}
          busyId={busyId}
        />

        <VideoColumn
          title="Video Archives"
          videos={archivedVideos}
          onPlay={setPreviewVideo}
          onDelete={handleDelete}
          busyId={busyId}
          emptyLabel="No archived videos yet."
        />
      </div>

      {uploadModalType && (
        <VideoUploadModal
          isOpen
          videoType={uploadModalType}
          maxSizeBytes={VIDEO_SIZE_LIMITS[uploadModalType]}
          onClose={() => setUploadModalType(null)}
          onSuccess={handleUploadSuccess}
        />
      )}

      <VideoPreviewModal video={previewVideo} onClose={() => setPreviewVideo(null)} />
    </div>
  );
}
