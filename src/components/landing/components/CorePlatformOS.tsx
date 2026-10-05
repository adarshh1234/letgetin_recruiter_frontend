import React from 'react';
import { CORE_FEATURES_LIST } from '../constants/landing.constants';
import { SectionHeader } from './ui/SectionHeader';

interface CorePlatformOSProps {
  onOpenDemo?: () => void;
}

export const CorePlatformOS: React.FC<CorePlatformOSProps> = () => {
  return (
    <section id="features" className="py-20 md:py-28 bg-[#f8fbfe] border-b border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <SectionHeader
          badge="CORE FEATURES"
          title={
            <>
              The <span className="text-gradient-blue">Intelligent</span> Professional OS
            </>
          }
          subtitle="Everything you need to prove, connect, and get hired — all in one platform."
          className="mb-16"
        />

        {/* 6 Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CORE_FEATURES_LIST.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-[1.75rem] border border-[#e2edf8] p-7 transition-all duration-200 hover:border-[#bae6fd] hover:shadow-[0_10px_25px_rgba(2,132,199,0.06)] flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-full bg-[#f0f8ff] border border-[#dbeafe] flex items-center justify-center text-[#0066cc] mb-5">
                    <Icon className="w-5 h-5" />
                  </div>

                  <h3 className="text-lg font-bold text-[#061f3d] tracking-tight mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-slate-500 leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="text-xs font-semibold text-[#0066cc]">
                    {item.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
