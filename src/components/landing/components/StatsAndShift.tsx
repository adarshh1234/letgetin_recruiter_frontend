import React, { useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { PLATFORM_STATS, LIVE_OPPORTUNITIES } from '../constants/landing.constants';

export const StatsAndShift: React.FC = () => {
  const [activeRoleFilter, setActiveRoleFilter] = useState('All');

  const filteredRoles = activeRoleFilter === 'All' 
    ? LIVE_OPPORTUNITIES 
    : LIVE_OPPORTUNITIES.filter(r => r.field === activeRoleFilter || activeRoleFilter === 'All');

  return (
    <section id="shift" className="py-20 md:py-28 bg-white border-b border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Numbers Row - Royal Blue Numbers matching screenshot */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-16 border-b border-sky-100">
          {PLATFORM_STATS.map((stat) => (
            <div key={stat.id} className="flex flex-col">
              <span className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-gradient-blue font-display">
                {stat.value}
              </span>
              <span className="text-sm sm:text-base font-bold text-[#06284f] mt-2">
                {stat.label}
              </span>
              <span className="text-xs text-slate-500 mt-0.5">
                {stat.sub}
              </span>
            </div>
          ))}
        </div>

        {/* Section Header: The Shift */}
        <div className="pt-20 pb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pill-bg border border-pill-border text-pill-text text-xs font-semibold uppercase tracking-wider mb-4">
            <span>THE SHIFT</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-[#06284f] tracking-[-0.035em] leading-tight mb-4">
            CVs are broken.<br />
            Trust is <span className="text-gradient-blue">broken.</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Companies waste 80% of time on unqualified candidates. Great talent gets lost in the noise. <br className="hidden sm:inline" />
            <strong className="text-[#06284f] font-bold">LetGetIn fixes this.</strong>
          </p>
        </div>

        {/* The Old Way vs The LetGetIn Way */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
          
          {/* Card 1: The Old Way (Soft rose card from PDF Page 2) */}
          <div className="lg:col-span-6 bg-[#fff7f7] border border-rose-200/80 rounded-[2rem] p-7 sm:p-9 flex flex-col justify-between shadow-2xs">
            <div>
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 mb-6">
                <X className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h3 className="text-2xl font-bold text-[#0a192f] tracking-tight mb-2">
                The Old Way
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                Outdated keyword searching, unverified claims, and opaque hiring funnels.
              </p>

              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                  <span><strong>CVs are self-reported:</strong> No proof of actual technical proficiency or design execution.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                  <span><strong>Hiring is biased:</strong> Evaluated by pedigree, networks, and keyword algorithms.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                  <span><strong>Candidates are passive:</strong> Applying blindly and waiting weeks to be found.</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
                  <span><strong>No transparency:</strong> Zero visibility into benchmark ranking or skill fit progress.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-rose-200/50 text-xs text-rose-500 font-mono">
              Status quo: 80% screening time wasted & high mis-hire rates
            </div>
          </div>

          {/* Card 2: The LetGetIn Way (Signature Horizontal Navy -> Bright Blue Gradient) */}
          <div className="lg:col-span-6 card-gradient-blue rounded-[2rem] p-7 sm:p-9 text-white shadow-xl shadow-[#062b63]/20 flex flex-col justify-between relative overflow-hidden">
            {/* Soft inner glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white mb-6">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-2xl font-bold tracking-tight text-white">
                  The LetGetIn Way
                </h3>
                <span className="px-3 py-1 text-xs font-bold bg-white/20 text-white rounded-full">
                  Verified OS
                </span>
              </div>
              <p className="text-sm text-sky-100 mb-6">
                Proof of work, adaptive AI benchmarks, and merit-first transparent bidding.
              </p>

              <div className="space-y-4 text-sm text-white/95">
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full border border-white flex items-center justify-center text-white shrink-0 mt-0.5">
                    <span className="text-[9px] font-bold">✓</span>
                  </div>
                  <span><strong>Verified Proof of Work:</strong> AI interviews, code execution audits, and verified portfolios.</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full border border-white flex items-center justify-center text-white shrink-0 mt-0.5">
                    <span className="text-[9px] font-bold">✓</span>
                  </div>
                  <span><strong>Blind skill screening:</strong> Zero bias, pure merit. Evaluated across 6 objective dimensions.</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full border border-white flex items-center justify-center text-white shrink-0 mt-0.5">
                    <span className="text-[9px] font-bold">✓</span>
                  </div>
                  <span><strong>Companies bid for you:</strong> You stay in control with pre-aligned compensation offers.</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full border border-white flex items-center justify-center text-white shrink-0 mt-0.5">
                    <span className="text-[9px] font-bold">✓</span>
                  </div>
                  <span><strong>Live analytics:</strong> Real-time visibility into your ranking, skill gaps, and market value.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/20 flex items-center justify-between relative text-xs">
              <span className="text-sky-200 font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                4x faster hiring · 98% retention rate
              </span>
              <span className="text-white font-semibold">
                Pure Merit Screening
              </span>
            </div>
          </div>

        </div>

        {/* Live Opportunities Market Box */}
        <div className="mt-12 bg-[#f0f8ff] border border-sky-200/70 rounded-[2rem] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-sky-200/60">
            <div>
              <h4 className="text-lg font-bold text-[#0a192f]">Live Verified Opportunities</h4>
              <p className="text-xs text-slate-500">Real-time roles actively bidding for verified LetGetIn members</p>
            </div>
            {/* Filter pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'Engineering', 'AI Research', 'Design', 'Fintech'].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActiveRoleFilter(f)}
                  className={`px-4 py-1 text-xs font-bold rounded-full transition-colors whitespace-nowrap cursor-pointer ${
                    activeRoleFilter === f
                      ? 'bg-[#063970] text-white shadow-xs'
                      : 'bg-white border border-sky-200 text-slate-600 hover:bg-sky-50'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
            {filteredRoles.map((role) => (
              <div 
                key={role.id} 
                className="bg-white p-4 rounded-2xl border border-sky-100 hover:border-brand-400 transition-all hover:shadow-xs flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-bold text-pill-text bg-pill-bg px-2 py-0.5 rounded-md border border-pill-border inline-block mb-2">
                    {role.field}
                  </span>
                  <h5 className="font-bold text-[#0a192f] text-sm leading-snug line-clamp-2">
                    {role.title}
                  </h5>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#0066cc] font-mono">{role.rate}</span>
                  <span className="text-slate-500 text-[11px]">{role.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
