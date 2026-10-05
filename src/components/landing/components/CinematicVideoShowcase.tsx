import React from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize2
} from 'lucide-react';
import { useVideoPlayer } from '../hooks/useVideoPlayer';

interface CinematicVideoShowcaseProps {
  onOpenDemo: () => void;
  onViewRoles?: () => void;
}

export const CinematicVideoShowcase: React.FC<CinematicVideoShowcaseProps> = ({ onOpenDemo, onViewRoles }) => {
  const {
    videoRef,
    isPlaying,
    isMuted,
    progress,
    togglePlay,
    toggleMute,
    handleTimeUpdate
  } = useVideoPlayer(true, true);

  return (
    <section 
      id="video-showcase" 
      className="relative w-full h-screen min-h-[600px] max-h-[960px] bg-[#061a33] text-white overflow-hidden flex flex-col justify-between py-4 sm:py-6"
    >
      {/* 1. Fullscreen Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        autoPlay
        muted={isMuted}
        loop
        playsInline
        onTimeUpdate={handleTimeUpdate}
        poster="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1600&auto=format&fit=crop"
      >
        <source
          src="https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-code-41315-large.mp4"
          type="video/mp4"
        />
        <source
          src="https://assets.mixkit.co/videos/preview/mixkit-young-woman-working-on-a-laptop-42171-large.mp4"
          type="video/mp4"
        />
      </video>

      {/* 2. Cinematic Contrast Vignette Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/75 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 pointer-events-none" />

      {/* 3. Top Bar (Experts + Sound Toggle) */}
      <div className="relative z-20 w-full px-6 sm:px-12 md:px-16 pt-4 sm:pt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-base sm:text-lg font-semibold text-white/95 tracking-tight font-display">
            Experts
          </span>
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-sky-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Adaptive Assessment Sandbox</span>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleMute}
          className="p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white transition-all shadow-md active:scale-95 cursor-pointer"
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label="Toggle Mute"
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* 4. Middle Section (Left Stats + Right Roles Card matching reference UI) */}
      <div className="relative z-20 w-full px-6 sm:px-12 md:px-16 my-auto py-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* LEFT METRICS */}
          <div className="lg:col-span-7 flex flex-col space-y-4 sm:space-y-6">
            <div>
              <div className="text-4xl sm:text-6xl md:text-[64px] font-extrabold tracking-tight text-white font-display leading-none">
                $113<span className="text-xl sm:text-2xl font-medium text-slate-300 font-sans">/hr</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">Average contracted rate</p>
            </div>

            <div>
              <div className="text-4xl sm:text-6xl md:text-[64px] font-extrabold tracking-tight text-white font-display leading-none">
                435<span className="text-2xl sm:text-3xl font-semibold">k</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">Roles created</p>
            </div>

            <div>
              <div className="text-4xl sm:text-6xl md:text-[64px] font-extrabold tracking-tight text-white font-display leading-none">
                $4<span className="text-2xl sm:text-3xl font-semibold">M+</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">Daily payouts</p>
            </div>
          </div>

          {/* RIGHT OVERLAY CARD: Latest roles */}
          <div className="lg:col-span-5 flex justify-start lg:justify-end">
            <div className="w-full max-w-md bg-gradient-to-r from-[#062b63]/90 via-[#07498c]/90 to-[#087bc1]/90 backdrop-blur-xl border border-white/20 rounded-3xl p-5 sm:p-6 text-white shadow-[0_25px_60px_rgba(0,0,0,0.5)]">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-sm font-semibold text-white/90">Latest roles</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span className="w-2 h-2 rounded-full bg-white/40" />
                  <span className="w-2 h-2 rounded-full bg-white/40" />
                </div>
              </div>

              {/* Roles List */}
              <div className="py-3 space-y-3">
                <div className="border-b border-white/10 pb-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                      Clinicians Survey – Ambulatory & Comm...
                    </span>
                    <span className="text-xs font-bold font-mono text-emerald-300 shrink-0">
                      $90
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">1203 recently hired</p>
                </div>

                <div className="border-b border-white/10 pb-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                      Financial Crime, AML & KYC Anal...
                    </span>
                    <span className="text-xs font-bold font-mono text-emerald-300 shrink-0">
                      $75-$100/hr
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">315 recently hired</p>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                      Medicare Advantage Members (Devo...
                    </span>
                    <span className="text-xs font-bold font-mono text-emerald-300 shrink-0">
                      $120/hr
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">263 recently hired</p>
                </div>
              </div>

              {/* Bottom Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={onViewRoles || onOpenDemo}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
                >
                  View all roles
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* 5. Bottom Controls Bar */}
      <div className="relative z-20 w-full px-6 sm:px-12 md:px-16 pb-8 sm:pb-10 flex items-center justify-between text-xs text-white">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={togglePlay}
            className="p-2.5 rounded-full bg-white/15 hover:bg-white/30 backdrop-blur-md transition-all text-white active:scale-95 cursor-pointer"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
          </button>

          <span className="hidden sm:inline font-mono text-xs text-sky-200">
            {isPlaying ? 'Live Sandbox Feed • 1080p HD' : 'Paused'}
          </span>
        </div>

        <div className="flex-1 max-w-xs mx-6 hidden md:block">
          <div className="w-full bg-white/20 rounded-full h-1 overflow-hidden">
            <div
              className="bg-[#0088ff] h-1 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenDemo}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-md font-semibold text-xs transition-all text-white active:scale-95 cursor-pointer"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Inspect Platform OS</span>
        </button>
      </div>

    </section>
  );
};
