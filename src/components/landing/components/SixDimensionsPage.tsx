import React, { useState } from 'react';
import { 
  GraduationCap, 
  Code2, 
  TrendingUp, 
  BrainCircuit, 
  MessagesSquare, 
  Compass, 
  Sparkles, 
  ArrowRight, 
  Award 
} from 'lucide-react';

interface SixDimensionsPageProps {
  onOpenDemo: () => void;
  onNavigate?: (path: string) => void;
}

export const SixDimensionsPage: React.FC<SixDimensionsPageProps> = ({ onOpenDemo, onNavigate }) => {
  const [activeDimension, setActiveDimension] = useState<number>(0);

  const dimensions = [
    {
      num: '01',
      title: 'Educational Foundations',
      subtitle: 'Consistency + Specialization',
      icon: GraduationCap,
      summary: 'Tier 1 reputation matters, but so does relevancy. Assessing continuous learning paths and verified degrees.',
      whyItMatters: 'Foundational theory, algorithmic depth, and domain specialization establish a candidate’s capacity to master complex domains.',
      howLetGetInSupports: 'Automated credential validation, course curriculum relevancy scoring, and ongoing academic research tracking.',
      radarValue: 92,
    },
    {
      num: '02',
      title: 'Verified Skill Sets',
      subtitle: 'Technical Proficiency & Domain Expertise',
      icon: Code2,
      summary: 'Technical proficiency, certifications, and domain expertise — proven through live sandboxes, not claimed on a CV.',
      whyItMatters: 'Resumes exaggerate; live code and architecture sandboxes demonstrate true runtime problem-solving capabilities.',
      howLetGetInSupports: 'Adaptive 10-minute AI technical sandbox, live code execution, real-world bug recreation, and algorithmic benchmarks.',
      radarValue: 98,
    },
    {
      num: '03',
      title: 'Performance History',
      subtitle: 'Promotion Velocity + Quantifiable ROI',
      icon: TrendingUp,
      summary: 'Promotion velocity + quantifiable ROI. Structured STAR results beat arbitrary years of tenure.',
      whyItMatters: 'High performers accelerate within organizations, deliver measurable business outcomes, and leave lasting impact.',
      howLetGetInSupports: 'Quantified STAR impact audits, peer endorsements with cryptographic signatures, and project contribution verification.',
      radarValue: 88,
    },
    {
      num: '04',
      title: 'Psychometric & Cognitive',
      subtitle: 'Aptitude, SJT, & Raw Problem-Solving',
      icon: BrainCircuit,
      summary: 'Aptitude, Situational Judgment (SJT), cognitive agility (DISC/Big Five), and EQ — raw ability minus unconscious bias.',
      whyItMatters: 'Cognitive horsepower dictates how quickly talent handles novel obstacles and dynamic engineering shifts.',
      howLetGetInSupports: 'Algorithmic situational judgment simulations and bias-free psychometric assessment engines.',
      radarValue: 94,
    },
    {
      num: '05',
      title: 'Communication & Language',
      subtitle: 'Professional Fluency & Articulation',
      icon: MessagesSquare,
      summary: 'Professional fluency, cross-cultural agility, technical writing, and asynchronous leadership articulation.',
      whyItMatters: 'Clear communication aligns distributed engineering teams, prevents architectural misalignments, and builds consensus.',
      howLetGetInSupports: 'AI audio/video conversational analysis, PR documentation reviews, and cross-functional technical presentation grading.',
      radarValue: 90,
    },
    {
      num: '06',
      title: 'Soft Power & Adaptability',
      subtitle: 'Learnability (AQ) & Critical Thinking',
      icon: Compass,
      summary: 'Learnability (AQ), critical thinking, collaborative empathy, and rapid adaptation to emerging AI workflows.',
      whyItMatters: 'Tools and frameworks evolve every quarter; the ability to unlearn and master new paradigms is the ultimate edge.',
      howLetGetInSupports: 'Adaptive learning speed metrics and novel problem response tracking within live sandbox scenarios.',
      radarValue: 96,
    }
  ];

  return (
    <div className="bg-[#f8fbfe] text-slate-800 font-sans min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 screenshot-ambient-glow pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0f8ff] border border-[#dbeafe] text-[#0066cc] text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#0066cc]" />
              <span>THE 2026 EVALUATION PARADIGM</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#061f3d] tracking-[-0.035em] leading-[1.15] mb-6">
              The <span className="text-gradient-blue">6 Dimensions</span> of Talent
            </h1>

            <p className="text-base sm:text-xl text-slate-600 leading-relaxed mb-8">
              Legacy hiring evaluates 1 dimension: a static, keyword-stuffed CV. LetGetIn benchmarks candidates across 6 verified dimensions to surface genuine capability with zero bias.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={onOpenDemo}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white btn-gradient-blue shadow-xs hover:shadow-blue-glow transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Get Evaluated in 6 Dimensions</span>
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

      {/* 2. INTERACTIVE 6 DIMENSIONS DEEP DIVE */}
      <section className="py-16 md:py-20 bg-white border-y border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#061f3d] tracking-tight mb-3">
              Explore Every Dimension
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              Click any dimension below to inspect its methodology, significance, and verification proof.
            </p>
          </div>

          {/* 6 Dimension Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {dimensions.map((dim, i) => {
              const Icon = dim.icon;
              const isSelected = activeDimension === i;

              return (
                <div
                  key={dim.num}
                  onClick={() => setActiveDimension(i)}
                  className={`rounded-3xl p-7 transition-all duration-200 flex flex-col justify-between cursor-pointer border ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#f0f8ff] to-white border-[#0066cc] shadow-card-clean ring-2 ring-[#0066cc]/20'
                      : 'bg-white border-[#e2edf8] hover:border-[#bae6fd] hover:shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs font-bold text-[#0066cc]">
                        DIMENSION {dim.num}
                      </span>
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                        isSelected ? 'bg-[#0066cc] text-white' : 'bg-[#f0f8ff] text-[#0066cc]'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="text-lg font-bold text-[#061f3d] tracking-tight mb-1">
                      {dim.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#0066cc] mb-3">
                      {dim.subtitle}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
                      {dim.summary}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-mono">Proof Score</span>
                    <strong className="text-emerald-600 font-bold font-mono">{dim.radarValue}% Match</strong>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Dimension Detail Box */}
          <div className="bg-[#f8fbfe] border border-[#dbeafe] rounded-3xl p-6 sm:p-10 shadow-card-clean">
            <div className="max-w-4xl mx-auto">
              
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[#063970] text-white font-mono text-xs font-bold rounded-lg">
                  Dimension {dimensions[activeDimension].num} Deep Dive
                </span>
                <span className="text-xs font-semibold text-[#0066cc]">
                  {dimensions[activeDimension].subtitle}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#061f3d] mb-6">
                {dimensions[activeDimension].title}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-200/80">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono mb-2">
                    Why It Matters
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {dimensions[activeDimension].whyItMatters}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#0066cc] font-mono mb-2">
                    How LetGetIn Supports & Verifies It
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {dimensions[activeDimension].howLetGetInSupports}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. EXPERT INSIGHT & RADAR COMPARISON */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-gradient-to-br from-[#061f3d] via-[#062b63] to-[#08498c] rounded-3xl p-8 sm:p-12 text-white shadow-hero-card relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="max-w-3xl mx-auto text-center relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sky-200 text-xs font-mono font-bold uppercase mb-4">
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>EXPERT INSIGHT 2026</span>
              </div>

              <h3 className="font-display text-2xl sm:text-4xl font-bold tracking-tight mb-4">
                "Verified Proof of Work Beats CV Claims Every Time"
              </h3>

              <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-8">
                In 2026, progressive technology companies have moved away from unverified PDF resumes. With LetGetIn's 6 Dimensions, hiring teams review audited sandbox outputs, architectural reasoning, and peer-reviewed code before conducting a single interview.
              </p>

              <div className="inline-flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-white/15 text-xs text-sky-200 font-mono">
                <span>✓ Zero Bias Audits</span>
                <span>✓ 60% Faster Sourcing</span>
                <span>✓ Multi-Dimensional Radar Scoring</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. FINAL CTA */}
      <section className="py-16 bg-[#061a33] text-white border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Benchmark Your 6 Dimensions Today
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8">
            Take a 10-minute adaptive assessment and unlock your verified multi-dimensional talent card.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onOpenDemo}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#061a33] font-bold text-sm transition-all shadow-xs cursor-pointer"
            >
              Start Proof of Work Free
            </button>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('/refer-and-earn')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-sm transition-all cursor-pointer"
              >
                Refer & Earn 150 Coins
              </button>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};
