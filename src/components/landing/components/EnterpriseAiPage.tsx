import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Brain, 
  Heart, 
  ShieldCheck, 
  TrendingUp, 
  Workflow, 
  CheckCircle2, 
  Cpu, 
  BarChart2, 
  LineChart 
} from 'lucide-react';

interface EnterpriseAiPageProps {
  onOpenDemo: (context?: string) => void;
  onNavigate?: (path: string) => void;
}

export const EnterpriseAiPage: React.FC<EnterpriseAiPageProps> = ({ onOpenDemo, onNavigate }) => {
  const enterpriseBenefits = [
    {
      title: 'Faster, More Accurate Decisions',
      desc: 'Screen thousands of global candidates against verified technical competencies in minutes without quality degradation.',
      metric: '60% Faster',
      icon: TrendingUp
    },
    {
      title: 'Precision Candidate Alignment',
      desc: 'Multi-dimensional 6-pillar radar scoring eliminates resume keyword distortion and matches candidates by actual capability.',
      metric: '98% Fit Accuracy',
      icon: Brain
    },
    {
      title: 'Elimination of Repetitive HR Toil',
      desc: 'Automate pipeline routing, evaluation scheduling, scorecard synthesis, and basic employee HR queries.',
      metric: '18+ hrs saved/wk',
      icon: Workflow
    },
    {
      title: 'Real-Time Workforce Visibility',
      desc: 'Continuous skill telemetry across internal teams enables data-driven succession planning and internal mobility.',
      metric: '100% Skill Audit',
      icon: BarChart2
    },
    {
      title: 'Elevated Employee & Candidate Experience',
      desc: 'Transparent reverse bidding and personalized onboarding workflows that prioritize human empathy and dignity.',
      metric: '4.9/5 Rating',
      icon: Heart
    },
    {
      title: 'SOC2 Type II & Zero Bias Architecture',
      desc: 'Enterprise-grade encryption, role-based data isolation, and algorithmic bias masking audited for global compliance.',
      metric: 'SOC2 & GDPR',
      icon: ShieldCheck
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
              <Brain className="w-3.5 h-3.5 text-[#0066cc]" />
              <span>ENTERPRISE INTELLIGENCE</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#061f3d] tracking-[-0.035em] leading-[1.15] mb-6">
              Enterprise AI Built <span className="text-gradient-blue">Around People</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 leading-relaxed mb-8">
              Enterprise AI for smarter hiring, workforce decisions, and people operations. We combine artificial intelligence with human empathy rather than trying to replace people.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate ? onNavigate('/enterprise/contact-sales') : onOpenDemo('Enterprise AI')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white btn-gradient-blue shadow-xs hover:shadow-blue-glow transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Talk to our Enterprise Team</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('/enterprise/human-data')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
                >
                  Explore Human Data
                </button>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 2. THE AI + HUMAN PARADIGM */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#061f3d] tracking-tight mb-3">
              Human-Centered Decision Making
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              How LetGetIn bridges artificial intelligence with organizational empathy.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* AI Compute */}
            <div className="bg-white rounded-3xl border border-[#e2edf8] p-8 flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#f0f8ff] text-[#0066cc] flex items-center justify-center mb-6">
                  <Cpu className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-[#0066cc] uppercase tracking-wider block mb-2">
                  SCALE & PRECISION
                </span>
                <h3 className="text-xl font-bold text-[#061f3d] mb-3">
                  AI Intelligence
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Processes millions of multi-dimensional skill data points, runs adaptive code execution sandboxes, and flags unconscious demographic bias in real time.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 text-xs font-mono text-slate-500">
                Continuous Telemetry
              </div>
            </div>

            {/* The Plus / Nexus Bridge */}
            <div className="bg-gradient-to-br from-[#061f3d] to-[#08498c] text-white rounded-3xl p-8 flex flex-col justify-between shadow-hero-card">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/10 text-sky-300 flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-sky-300 uppercase tracking-wider block mb-2">
                  THE LETGETIN NEXUS
                </span>
                <h3 className="text-xl font-bold text-white mb-3">
                  AI + Human Empathy
                </h3>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-6">
                  Our system augments hiring leaders with structured evidence, objective benchmarks, and transparent communication — keeping the human in control.
                </p>
              </div>
              <div className="pt-4 border-t border-white/15 text-xs font-mono text-sky-200">
                Ethical AI Architecture
              </div>
            </div>

            {/* Human Empathy */}
            <div className="bg-white rounded-3xl border border-[#e2edf8] p-8 flex flex-col justify-between shadow-xs">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6">
                  <Heart className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-rose-600 uppercase tracking-wider block mb-2">
                  INTUITION & VALUES
                </span>
                <h3 className="text-xl font-bold text-[#061f3d] mb-3">
                  Human Judgment
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Evaluates team culture fit, emotional resonance, executive vision, and complex human nuances that algorithms should never arbitrate alone.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 text-xs font-mono text-slate-500">
                Empathetic Hiring
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. THREE CORE ENTERPRISE PILLARS */}
      <section className="py-16 md:py-24 bg-white border-y border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#061f3d] tracking-tight mb-3">
              Three Pillars of Enterprise Intelligence
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              Purpose-built systems driving performance across the entire talent lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-[#f8fbfe] rounded-3xl border border-[#e2edf8] p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[#f0f8ff] text-[#0066cc] flex items-center justify-center mb-6">
                  <Brain className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#061f3d] mb-3">
                  AI Recruitment Intelligence
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Semantic role mapping, multi-dimensional candidate evaluation sandboxes, and automated reverse bidding that reduce screening time by 60%.
                </p>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 pt-4 border-t border-slate-200/80">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Zero-bias skill scoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Adaptive code execution</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#f8fbfe] rounded-3xl border border-[#e2edf8] p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-6">
                  <LineChart className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#061f3d] mb-3">
                  Workforce & Skill Insights
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Map organizational capabilities in real time, forecast talent shortages, and identify internal candidates for leadership transitions.
                </p>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 pt-4 border-t border-slate-200/80">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Internal mobility telemetry</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Predictive attrition signals</span>
                </li>
              </ul>
            </div>

            <div className="bg-[#f8fbfe] rounded-3xl border border-[#e2edf8] p-8 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-6">
                  <Workflow className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#061f3d] mb-3">
                  AI-Assisted HR Operations
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  Automate routine HR workflows, intelligent policy synthesis, and seamless employee onboarding connected directly to HUREMASO HRMS.
                </p>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 pt-4 border-t border-slate-200/80">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Automated policy assistance</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>HUREMASO HRMS integration</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 4. ENTERPRISE BENEFITS GRID */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#061f3d] tracking-tight mb-3">
              Measurable Enterprise Impact
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              Tangible efficiency, precision, and governance improvements for modern organizations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enterpriseBenefits.map((b, idx) => {
              const Icon = b.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-[#e2edf8] p-7 flex flex-col justify-between hover:border-[#bae6fd] hover:shadow-card-clean transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#f0f8ff] text-[#0066cc] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-mono text-xs font-bold rounded-lg">
                        {b.metric}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#061f3d] mb-2">
                      {b.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. FINAL ENTERPRISE CTA */}
      <section className="py-16 bg-[#061a33] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Transform Your Workforce with Enterprise AI
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8">
            Connect with our enterprise architecture specialists to design a customized AI and HR intelligence rollout for your team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate ? onNavigate('/enterprise/contact-sales') : onOpenDemo('Enterprise AI Sales')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#061a33] font-bold text-sm transition-all shadow-xs cursor-pointer"
            >
              Talk to our Enterprise Team
            </button>
            <button
              type="button"
              onClick={() => onOpenDemo('Enterprise AI Security Walkthrough')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-sm transition-all cursor-pointer"
            >
              Review Architecture & Security
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
