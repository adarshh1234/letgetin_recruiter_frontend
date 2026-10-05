import React, { useState } from 'react';
import { Play, Sparkles, Video, CheckCircle2 } from 'lucide-react';
import { VIDEO_SHOWCASE_LIST } from '../constants/landing.constants';

interface VideoContentSectionProps {
  onOpenVideoDemo: () => void;
}

export const VideoContentSection: React.FC<VideoContentSectionProps> = ({ onOpenVideoDemo }) => {
  const [selectedVideo, setSelectedVideo] = useState(0);

  const currentVideo = VIDEO_SHOWCASE_LIST[selectedVideo] || VIDEO_SHOWCASE_LIST[0];

  return (
    <section id="video-showcase" className="py-20 md:py-28 bg-white border-b border-navy-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-semibold uppercase tracking-wider mb-4">
            <Video className="w-3.5 h-3.5 text-brand-700" />
            <span>VIDEO & CONTENT SHOWCASE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-navy-900 tracking-tight leading-tight mb-4">
            See the Platform in Action
          </h2>
          <p className="text-base sm:text-lg text-navy-700 leading-relaxed">
            Watch how verified assessments, candidate scoring, and autonomous bidding function in real time.
          </p>
        </div>

        {/* Video Player Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Video Display Card */}
          <div className="lg:col-span-8 bg-brand-50/40 border border-brand-200/70 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              {/* Interactive Video Preview Box */}
              <div 
                onClick={onOpenVideoDemo}
                className="w-full aspect-video rounded-2xl bg-gradient-to-br from-[#073b80] via-[#0052cc] to-[#081a36] text-white flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer shadow-md"
              >
                {/* Radial Lighting */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18),transparent_70%)] pointer-events-none" />
                
                {/* Play Button Trigger */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-navy-900 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform z-10">
                  <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-navy-900 ml-1" />
                </div>

                <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-navy-950/80 backdrop-blur-md text-xs font-bold text-white border border-white/20">
                    {currentVideo.tag}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-xs font-bold text-white">
                    HD · {currentVideo.duration}
                  </span>
                </div>

                <div className="absolute bottom-4 inset-x-4 z-10 flex items-center justify-between text-xs text-brand-100">
                  <span className="font-semibold">{currentVideo.speaker}</span>
                  <span className="font-mono bg-navy-950/70 px-2.5 py-1 rounded-md text-white">Click to preview</span>
                </div>
              </div>

              {/* Video Details */}
              <div className="mt-6">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700 font-mono mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{currentVideo.category}</span>
                </div>

                <h3 className="text-2xl font-bold text-navy-900 tracking-tight mb-2">
                  {currentVideo.title}
                </h3>

                <p className="text-sm text-navy-700 leading-relaxed">
                  {currentVideo.description}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-200/60 flex flex-wrap items-center justify-between gap-2 text-xs text-navy-600">
              <span className="flex items-center gap-1.5 font-medium text-brand-700">
                <CheckCircle2 className="w-4 h-4" />
                <span>Interactive sandbox simulation included</span>
              </span>
              <button
                type="button"
                onClick={onOpenVideoDemo}
                className="font-bold text-brand-700 hover:text-navy-900 cursor-pointer"
              >
                Launch Full Video →
              </button>
            </div>
          </div>

          {/* Right Playlist Cards */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-navy-600 font-mono px-1">
              SELECT EPISODE / TOUR
            </span>

            {VIDEO_SHOWCASE_LIST.map((vid) => {
              const isSelected = selectedVideo === vid.id;
              return (
                <div
                  key={vid.id}
                  onClick={() => setSelectedVideo(vid.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-brand-50 border-brand-500 shadow-xs ring-1 ring-brand-500/20'
                      : 'bg-white border-navy-200/70 hover:border-brand-300 hover:bg-brand-50/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[10px] font-bold text-brand-700 bg-white px-2 py-0.5 rounded border border-brand-200 font-mono">
                      {vid.duration}
                    </span>
                    <span className={`text-[11px] font-bold ${isSelected ? 'text-brand-800' : 'text-navy-600/70'}`}>
                      {vid.badge}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-navy-900 leading-snug mb-1">
                    {vid.title}
                  </h4>

                  <p className="text-xs text-navy-600 line-clamp-2 mt-1">
                    {vid.speaker}
                  </p>
                </div>
              );
            })}

            <div className="p-5 rounded-2xl bg-brand-50/50 border border-brand-200/80 text-center shadow-2xs mt-auto">
              <p className="text-xs text-navy-700 mb-2 font-medium">Want a tailored walkthrough for your team?</p>
              <button
                type="button"
                onClick={onOpenVideoDemo}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-brand-700 bg-white hover:bg-brand-50 border border-brand-200 transition-colors shadow-2xs cursor-pointer"
              >
                Request Custom Live Demo
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
