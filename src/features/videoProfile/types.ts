export type VideoType = "short" | "long";

export interface VideoCloudinary {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  resourceType: string;
}

export interface VideoProfileItem {
  _id: string;
  userId: string;
  videoType: VideoType;
  originalName: string;
  mimeType: string;
  size: number;
  cloudinary: VideoCloudinary;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

// Mirrors the backend's centralized limits (src/modules/videoProfile/videoProfile.service.ts).
export const VIDEO_SIZE_LIMITS: Record<VideoType, number> = {
  short: 10 * 1024 * 1024,
  long: 50 * 1024 * 1024,
};
