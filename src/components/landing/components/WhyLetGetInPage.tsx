import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Zap, 
  CheckCircle2 
} from 'lucide-react';

interface WhyLetGetInPageProps {
  onOpenDemo: () => void;
  onNavigate?: (path: string) => void;
}

export const WhyLetGetInPage: React.FC<WhyLetGetInPageProps> = ({ onOpenDemo, onNavigate }) => {
  return (
    <div className="bg-[#f8fbfe] text-slate-800 font-sans min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 screenshot-ambient-glow pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0f8ff] border border-[#dbeafe] text-[#0066cc] text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#0066cc]" />
              <span>THE SHIFT IN TALENT DISCOVERY</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#061f3d] tracking-[-0.035em] leading-[1.15] mb-6">
              Why <span className="text-gradient-blue">LetGetIn</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 leading-relaxed mb-8">
              The professional identity and skill verification layer built for a world where verified proof of work matters more than static CVs.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={onOpenDemo}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white btn-gradient-blue shadow-xs hover:shadow-blue-glow transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Experience LetGetIn</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('/features')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
                >
                  Explore Platform Features
                </button>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 2. CORE PHILOSOPHY & PILLARS SCAFFOLD */}
      <section className="py-16 bg-white border-y border-sky-100/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#061f3d] tracking-tight mb-3">
              Built on Modern Principles
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              Replacing legacy CV screening with verified skill dimensions, zero bias, and real-time reverse bidding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-[#f8fbfe] rounded-3xl border border-[#e2edf8] p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#f0f8ff] border border-[#dbeafe] flex items-center justify-center text-[#0066cc] mb-6">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#061f3d] tracking-tight mb-3">
                  Proof Over Claims
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Candidates demonstrate real technical and critical abilities through live sandbox assessments and verified benchmarks rather than inflated bullet points.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200/60 text-xs font-mono text-[#0066cc] font-semibold">
                01 · Zero CV Bias
              </div>
            </div>

            <div className="bg-[#f8fbfe] rounded-3xl border border-[#e2edf8] p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#f0f8ff] border border-[#dbeafe] flex items-center justify-center text-[#0066cc] mb-6">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#061f3d] tracking-tight mb-3">
                  Multi-Dimensional Evaluation
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Evaluating candidates across the 6 core dimensions of talent — foundation, skills, performance history, cognitive agility, communication, and adaptability.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200/60 text-xs font-mono text-[#0066cc] font-semibold">
                02 · 6-D Scoring Model
              </div>
            </div>

            <div className="bg-[#f8fbfe] rounded-3xl border border-[#e2edf8] p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#f0f8ff] border border-[#dbeafe] flex items-center justify-center text-[#0066cc] mb-6">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#061f3d] tracking-tight mb-3">
                  Reverse Bidding & Direct Fit
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Companies discover and bid on verified talent profiles with pre-evaluated skills, reducing screening time by over 60%.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200/60 text-xs font-mono text-[#0066cc] font-semibold">
                03 · Instant Candidate Alignment
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. CONTENT PLACEHOLDER SCAFFOLD CONTAINER (Ready for custom provided content) */}
      <section className="py-16 bg-[#f8fbfe]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="bg-white rounded-3xl border border-dashed border-[#bae6fd] p-8 sm:p-12 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#f0f8ff] text-[#0066cc] flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-[#061f3d] mb-2">
              Why LetGetIn Detailed Breakdown
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mb-6">
              This dedicated route is fully connected and ready for the upcoming custom content, narrative case studies, and comparison frameworks.
            </p>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-50 px-3.5 py-1.5 rounded-lg border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Route /why-letgetin active</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. FINAL CTA */}
      <section className="py-16 bg-[#061a33] text-white border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            See the Difference in Action
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8">
            Join the talent layer trusted by over 120k+ verified professionals and forward-thinking engineering organizations.
          </p>
          <button
            type="button"
            onClick={onOpenDemo}
            className="px-8 py-3.5 rounded-xl bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#061a33] font-bold text-sm transition-all shadow-xs cursor-pointer"
          >
            Get In — Free Skill Verification
          </button>
        </div>
      </section>

    </div>
  );
};
