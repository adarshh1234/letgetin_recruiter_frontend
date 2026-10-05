import { useState, useRef, RefObject } from 'react';

export interface UseVideoPlayerReturn {
  videoRef: RefObject<HTMLVideoElement | null>;
  isPlaying: boolean;
  isMuted: boolean;
  progress: number;
  togglePlay: () => void;
  toggleMute: () => void;
  handleTimeUpdate: () => void;
}

export const useVideoPlayer = (initialPlaying: boolean = true, initialMuted: boolean = true): UseVideoPlayerReturn => {
  const [isPlaying, setIsPlaying] = useState(initialPlaying);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);

  const safePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    const promise = video.play();
    if (promise !== undefined) {
      playPromiseRef.current = promise;
      promise
        .then(() => {
          playPromiseRef.current = null;
          setIsPlaying(true);
        })
        .catch((err: any) => {
          playPromiseRef.current = null;
          // Silently handle AbortError / interrupted by pause or autoplay policy restrictions
          if (err?.name !== 'AbortError' && err?.name !== 'NotAllowedError') {
            console.warn('[Video Player] Playback error:', err);
          }
          setIsPlaying(false);
        });
    } else {
      setIsPlaying(true);
    }
  };

  const safePause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (playPromiseRef.current) {
      playPromiseRef.current
        .then(() => {
          video.pause();
          setIsPlaying(false);
        })
        .catch(() => {
          video.pause();
          setIsPlaying(false);
        });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying || !video.paused) {
      safePause();
    } else {
      safePlay();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (video) {
      const current = video.currentTime;
      const duration = video.duration || 1;
      setProgress((current / duration) * 100);
    }
  };

  return {
    videoRef,
    isPlaying,
    isMuted,
    progress,
    togglePlay,
    toggleMute,
    handleTimeUpdate
  };
};
