import { apiClient } from "@/shared/services/apiClient";
import { VideoProfileItem, VideoType } from "../types";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const videoProfileService = {
  async list(): Promise<VideoProfileItem[]> {
    try {
      const res = await apiClient.get<never, ApiResponse<{ videos: VideoProfileItem[] }>>("/video-profile");
      return res.data.videos || [];
    } catch (error) {
      console.warn("videoProfileService.list error (returning empty list):", error);
      return [];
    }
  },

  async upload(
    file: File,
    videoType: VideoType,
    onProgress?: (percent: number) => void
  ): Promise<VideoProfileItem> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("videoType", videoType);

    const res = await apiClient.post<never, ApiResponse<{ video: VideoProfileItem }>>(
      "/video-profile/upload",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && onProgress) {
            onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          }
        },
      }
    );
    return res.data.video;
  },

  async archive(id: string): Promise<VideoProfileItem> {
    const res = await apiClient.patch<never, ApiResponse<{ video: VideoProfileItem }>>(`/video-profile/${id}/archive`);
    return res.data.video;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/video-profile/${id}`);
  },
};
