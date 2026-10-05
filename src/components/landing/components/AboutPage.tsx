import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  Target, 
  Compass, 
  Layers, 
  Users, 
  Building2, 
  ArrowRight, 
  TrendingUp, 
  HeartHandshake, 
  Globe 
} from 'lucide-react';

interface AboutPageProps {
  onOpenDemo: () => void;
  onNavigate?: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenDemo, onNavigate }) => {
  return (
    <div className="bg-[#f8fbfe] text-slate-800 font-sans min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden bg-white border-b border-sky-100">
        <div className="absolute inset-0 screenshot-ambient-glow pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0f8ff] border border-[#dbeafe] text-[#0066cc] text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#0066cc]" />
              <span>ABOUT LETGETIN</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#061f3d] tracking-[-0.035em] leading-[1.15] mb-6">
              The Intelligent <span className="text-gradient-blue">Professional OS</span> for Verified Talent
            </h1>

            <p className="text-base sm:text-xl text-slate-600 leading-relaxed mb-8">
              We are building the professional identity layer where proven capabilities, audited code, and multi-dimensional benchmarks replace outdated PDF resumes and keyword noise.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={onOpenDemo}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white btn-gradient-blue shadow-xs hover:shadow-blue-glow transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Join the Ecosystem</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('/the-6-dimensions')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
                >
                  Explore the 6 Dimensions
                </button>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 2. WHO WE ARE */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider mb-4">
                <span>WHO WE ARE</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#061f3d] tracking-tight mb-6">
                Ending the Resume Bias Cycle
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
                Traditional hiring relies on claims, pedigree, and keyword-stuffed CVs. Highly capable engineers and domain experts get lost in algorithmic filters, while companies spend months filtering unqualified applicants.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                LetGetIn was built by engineers and researchers who believe that talent is globally distributed, but opportunity has been constrained by outdated screening mechanisms. We provide adaptive sandboxes where craft is proven runtime.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200/80">
                <div>
                  <span className="text-2xl font-black text-[#063970] font-display block">120k+</span>
                  <span className="text-xs text-slate-500 font-medium">Verified Community</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-[#0066cc] font-display block">150+</span>
                  <span className="text-xs text-slate-500 font-medium">Countries Connected</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#061f3d] via-[#062b63] to-[#08498c] rounded-3xl p-8 sm:p-10 text-white shadow-hero-card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-400/10 rounded-full blur-2xl pointer-events-none" />
              <div className="relative z-10 space-y-6">
                <span className="text-xs font-mono font-bold uppercase text-sky-300">
                  OUR CONVICTION
                </span>
                <blockquote className="text-xl sm:text-2xl font-bold font-display leading-snug">
                  "When you evaluate real code, system design, and cognitive agility instead of static CVs, the best talent rises regardless of background."
                </blockquote>
                <div className="pt-4 border-t border-white/15 text-xs text-slate-300 font-mono">
                  LetGetIn Research & Talent Collective
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. MISSION & VISION */}
      <section className="py-16 md:py-20 bg-white border-y border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Mission Card */}
            <div className="bg-[#f8fbfe] rounded-3xl border border-[#e2edf8] p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#f0f8ff] border border-[#dbeafe] flex items-center justify-center text-[#0066cc] mb-6">
                  <Target className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-[#0066cc] uppercase tracking-wider block mb-2">
                  OUR MISSION
                </span>
                <h3 className="text-2xl font-bold text-[#061f3d] tracking-tight mb-4">
                  Prove Skill. Eliminate Bias.
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Our mission is to establish a verified proof-of-work identity standard for global talent. We give candidates the tools to prove runtime capability and allow employers to hire based on audited merit.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200/70 flex items-center gap-2 text-xs font-bold text-[#0066cc]">
                <span>Merit-first technical evaluation</span>
              </div>
            </div>

            {/* Vision Card */}
            <div className="bg-[#f8fbfe] rounded-3xl border border-[#e2edf8] p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#f0f8ff] border border-[#dbeafe] flex items-center justify-center text-[#0066cc] mb-6">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-[#0066cc] uppercase tracking-wider block mb-2">
                  OUR VISION
                </span>
                <h3 className="text-2xl font-bold text-[#061f3d] tracking-tight mb-4">
                  The Global Autonomous Talent Economy
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  A future where candidates maintain verifiable cryptographic skill cards, companies compete with transparent direct reverse bids, and hiring friction drops from months to days.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-200/70 flex items-center gap-2 text-xs font-bold text-[#0066cc]">
                <span>Zero friction reverse hiring</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. WHAT WE BELIEVE (CORE PILLARS) */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#061f3d] tracking-tight mb-3">
              What We Believe
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              The fundamental principles guiding every evaluation and product feature we build.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Proof Over Claims',
                desc: 'A 10-minute sandbox code assessment communicates more genuine ability than a 3-page embellished resume.',
                icon: ShieldCheck,
                tag: 'Principle 01'
              },
              {
                title: 'Multi-Dimensional Depth',
                desc: 'True talent involves education foundation, technical skills, problem velocity, cognitive agility, communication, and adaptability.',
                icon: Layers,
                tag: 'Principle 02'
              },
              {
                title: 'Complete Candidate Agency',
                desc: 'Candidates should control their data, view transparent salary bids, and never be subjected to automated resume ghosting.',
                icon: HeartHandshake,
                tag: 'Principle 03'
              },
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-[#e2edf8] p-7 sm:p-8 flex flex-col justify-between hover:border-[#bae6fd] hover:shadow-card-clean transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs font-bold text-[#0066cc]">
                        {pillar.tag}
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-[#f0f8ff] text-[#0066cc] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-[#061f3d] mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-4">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. CONNECTED ECOSYSTEM */}
      <section className="py-16 md:py-20 bg-white border-t border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#061f3d] tracking-tight mb-3">
              One Connected Ecosystem
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              Unifying all participants in the modern talent lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Candidates & Builders',
                desc: 'Take adaptive assessments, benchmark your craft, and receive direct company bids.',
                icon: Users,
              },
              {
                title: 'Startups & Scaleups',
                desc: 'Source pre-vetted top 5% talent in days with zero initial screening overhead.',
                icon: TrendingUp,
              },
              {
                title: 'Enterprises & Recruiters',
                desc: 'Integrate multi-dimensional talent telemetry with ATS pipelines and compliance workflows.',
                icon: Building2,
              },
              {
                title: 'Global Communities',
                desc: 'Connect across 150+ countries in technical guilds and collaborative skill hackathons.',
                icon: Globe,
              },
            ].map((eco, idx) => {
              const Icon = eco.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#f8fbfe] rounded-2xl border border-[#e2edf8] p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#dbeafe] text-[#0066cc] flex items-center justify-center mb-4 shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-[#061f3d] mb-2">
                      {eco.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {eco.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. FINAL CTA */}
      <section className="py-16 bg-[#061a33] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Be Part of the Shift
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8">
            Whether you are an engineer proving your craft or a hiring leader seeking verified ability, get started with LetGetIn today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onOpenDemo}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#061a33] font-bold text-sm transition-all shadow-xs cursor-pointer"
            >
              Get In Free — Start Verification
            </button>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('/employers')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-sm transition-all cursor-pointer"
              >
                Browse Employers Directory
              </button>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};
