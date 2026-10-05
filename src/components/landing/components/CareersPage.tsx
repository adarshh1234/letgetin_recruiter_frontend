import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Code2, 
  Brain, 
  Palette, 
  Users, 
  Globe2, 
  Zap, 
  CheckCircle2 
} from 'lucide-react';

interface CareersPageProps {
  onOpenDemo: (careerTitle?: string) => void;
  onNavigate?: (path: string) => void;
}

export const CareersPage: React.FC<CareersPageProps> = ({ onOpenDemo, onNavigate }) => {
  const departments = [
    {
      title: 'Engineering & Systems',
      icon: Code2,
      description: 'Distributed execution engines, sandboxed compilers, cryptographic verification protocols, and real-time telemetry.',
      roles: ['Staff Backend Engineer (Rust / Go)', 'Senior Full-Stack Engineer (React / TypeScript)', 'DevOps & Cloud Security Architect']
    },
    {
      title: 'AI Research & Evaluation Science',
      icon: Brain,
      description: 'Adaptive assessment benchmarks, demographic masking algorithms, adversarial red-teaming, and LLM reasoning scoring.',
      roles: ['Lead AI Evaluation Scientist', 'Adversarial Machine Learning Researcher', 'Psychometric & Cognitive Modeler']
    },
    {
      title: 'Product & UI/UX Design',
      icon: Palette,
      description: 'Design craft that translates complex multi-dimensional scoring into intuitive, empowering user experiences.',
      roles: ['Senior Product Designer', 'Design Systems & Motion Specialist']
    },
    {
      title: 'Recruitment & Talent Operations',
      icon: Users,
      description: 'Connecting enterprise engineering leaders with verified talent and cultivating global technical guilds.',
      roles: ['Enterprise Talent Partner', 'Community Guild Director (Global)']
    }
  ];

  return (
    <div className="bg-[#f8fbfe] text-slate-800 font-sans min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden bg-white border-b border-sky-100">
        <div className="absolute inset-0 screenshot-ambient-glow pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0f8ff] border border-[#dbeafe] text-[#0066cc] text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#0066cc]" />
              <span>CAREERS AT LETGETIN</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#061f3d] tracking-[-0.035em] leading-[1.15] mb-6">
              Build the Future of <span className="text-gradient-blue">Verified Talent</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 leading-relaxed mb-8">
              Join a high-agency, remote-first team reimagining how global talent proves skill, connects with opportunity, and eliminates unconscious hiring bias.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => onOpenDemo('Careers Expression of Interest')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white btn-gradient-blue shadow-xs hover:shadow-blue-glow transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Express Interest in Joining</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('/about')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
                >
                  Read Our Mission
                </button>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 2. WHY WORK WITH US (CULTURE PILLARS) */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#061f3d] tracking-tight mb-3">
              Why Work at LetGetIn
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              We practice internally what we champion externally: proof of work, high agency, and merit.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'High Agency & Autonomy',
                desc: 'We operate in small, highly autonomous pods where individual contribution and clear reasoning drive architectural decisions.',
                icon: Zap,
              },
              {
                title: 'Global & Remote-First',
                desc: 'We collaborate across time zones with strong asynchronous writing and documentation habits.',
                icon: Globe2,
              },
              {
                title: 'Frontier AI & Real Impact',
                desc: 'You work directly on algorithmic sandboxes and evaluation science that genuinely shifts life trajectories for candidates worldwide.',
                icon: Brain,
              },
            ].map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-[#e2edf8] p-7 sm:p-8 flex flex-col justify-between hover:border-[#bae6fd] hover:shadow-card-clean transition-all"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#f0f8ff] border border-[#dbeafe] flex items-center justify-center text-[#0066cc] mb-6">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-[#061f3d] mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. FUNCTIONAL DEPARTMENTS & GROWING TEAMS */}
      <section className="py-16 md:py-20 bg-white border-y border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#061f3d] tracking-tight mb-3">
              Our Functional Areas
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              Explore where your skills can create maximum leverage on our mission.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {departments.map((dept, i) => {
              const Icon = dept.icon;
              return (
                <div
                  key={i}
                  className="bg-[#f8fbfe] rounded-3xl border border-[#e2edf8] p-7 sm:p-8 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-white border border-[#dbeafe] text-[#0066cc] flex items-center justify-center shadow-2xs">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-bold text-[#061f3d]">
                        {dept.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                      {dept.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      <span className="text-xs font-mono font-bold uppercase text-slate-400 block mb-1">
                        Active Disciplines
                      </span>
                      {dept.roles.map((role, rIdx) => (
                        <div key={rIdx} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{role}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200/70 flex items-center justify-between">
                    <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md font-semibold">
                      Accepting Expressions
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenDemo(`LetGetIn Career - ${dept.title}`)}
                      className="text-xs font-bold text-[#0066cc] hover:underline cursor-pointer"
                    >
                      Express Interest →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. GENERAL EXPRESSION OF INTEREST CTA */}
      <section className="py-16 bg-[#061a33] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Don't See an Exact Match?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8">
            We are always excited to connect with exceptional systems engineers, AI researchers, and builders who care deeply about meritocracy.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onOpenDemo('General Careers Application')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#061a33] font-bold text-sm transition-all shadow-xs cursor-pointer"
            >
              Submit General Application
            </button>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('/contact')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-sm transition-all cursor-pointer"
              >
                Contact Talent Team
              </button>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};
