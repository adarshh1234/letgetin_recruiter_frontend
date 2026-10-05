import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Brain, 
  Heart, 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  Video, 
  BarChart3, 
  Workflow, 
  ShieldCheck, 
  Handshake, 
  ChevronRight
} from 'lucide-react';

interface AiRecruitmentSuitePageProps {
  onOpenDemo: (context?: string) => void;
  onNavigate?: (path: string) => void;
}

export const AiRecruitmentSuitePage: React.FC<AiRecruitmentSuitePageProps> = ({ onOpenDemo, onNavigate }) => {
  const workflowSteps = [
    {
      num: '01',
      step: 'Discover',
      title: 'Semantic Skill Sourcing',
      desc: 'AI proactively identifies candidates across 150+ countries based on verified abilities and technical depth rather than keyword matching.',
      icon: Search
    },
    {
      num: '02',
      step: 'Screen',
      title: 'Zero Bias Vetting',
      desc: 'Demographic-free automated screening that evaluates candidates strictly against role competencies and objective benchmarks.',
      icon: Filter
    },
    {
      num: '03',
      step: 'Evaluate',
      title: 'Adaptive Sandbox Proof',
      desc: 'Interactive 10-minute AI technical sandboxes that test runtime problem-solving, code architecture, and cognitive agility.',
      icon: Brain
    },
    {
      num: '04',
      step: 'Interview',
      title: 'Interview Intelligence',
      desc: 'Structured interview guides, automated transcription, and real-time competency alignment insights for hiring panels.',
      icon: Video
    },
    {
      num: '05',
      step: 'Collaborate',
      title: 'Panel Consensus',
      desc: 'Asynchronous scorecard calibration, hiring manager alignment, and automated feedback aggregation.',
      icon: Users
    },
    {
      num: '06',
      step: 'Hire',
      title: 'Reverse Bidding & Offer',
      desc: 'Pre-negotiated compensation bands, direct company bids, and seamless handoff to onboarding workflows.',
      icon: Handshake
    }
  ];

  const suiteFeatures = [
    {
      title: 'AI Candidate Matching',
      tag: 'Discovery Engine',
      desc: 'Semantic matching that maps verified skill vectors to open requisitions with transparent fit scoring and skill gap telemetry.',
      icon: Brain,
      highlights: ['Predictive performance fit', 'Multi-dimensional skill mapping', 'Automated talent rediscovery']
    },
    {
      title: 'Candidate Evaluation',
      tag: 'Proof of Work',
      desc: 'Live sandboxed environments where candidates prove real craft in coding, systems design, quantitative modeling, or healthcare.',
      icon: ShieldCheck,
      highlights: ['Audited code sandboxes', 'STAR methodology impact scoring', 'Demographic masking']
    },
    {
      title: 'Interview Intelligence',
      tag: 'Decision Support',
      desc: 'AI-assisted interview structuring with conversational analytics that highlight key competencies without replacing human judgment.',
      icon: Video,
      highlights: ['Automated interview synthesis', 'Real-time competency cues', 'Anti-bias scoring rubrics']
    },
    {
      title: 'Recruitment Pipeline OS',
      tag: 'Workflow Automation',
      desc: 'Automated stage progression, candidate communication triggers, and SLA tracking that reduces hiring cycles by 60%.',
      icon: Workflow,
      highlights: ['Customizable pipeline stages', 'Automated candidate updates', 'ATS 2-way synchronization']
    },
    {
      title: 'Hiring Collaboration',
      tag: 'Team Calibration',
      desc: 'Unify hiring managers, recruiters, and cross-functional interviewers with structured evaluation scorecards and panel alignment.',
      icon: Users,
      highlights: ['Blind scorecard submission', 'Instant panel divergence alerts', 'Hiring committee summaries']
    },
    {
      title: 'Recruitment Analytics & Insights',
      tag: 'Executive Telemetry',
      desc: 'Comprehensive talent intelligence dashboards monitoring source efficiency, interview velocity, candidate dropoff, and diversity.',
      icon: BarChart3,
      highlights: ['Velocity & bottleneck metrics', 'Cost-per-verified-hire tracking', 'Predictive pipeline forecasting']
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
              <span>ENTERPRISE RECRUITMENT PLATFORM</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#061f3d] tracking-[-0.035em] leading-[1.15] mb-6">
              AI Recruitment Suite with <span className="text-gradient-blue">Human Empathy</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 leading-relaxed mb-8">
              LetGetIn is an innovative AI-vetted, human-empathy-integrated recruitment suite. We pair high-precision artificial intelligence with human judgment to discover, evaluate, and hire extraordinary talent.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate ? onNavigate('/enterprise/contact-sales') : onOpenDemo('AI Recruitment Suite')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white btn-gradient-blue shadow-xs hover:shadow-blue-glow transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Talk to Sales</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('/jobs/ai-engineering')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
                >
                  Explore Recruitment
                </button>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 2. AI INTELLIGENCE + HUMAN JUDGMENT */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-gradient-to-br from-[#061f3d] via-[#062b63] to-[#08498c] rounded-3xl p-8 sm:p-12 text-white shadow-hero-card relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative z-10">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sky-200 text-xs font-mono font-bold uppercase mb-4">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>CORE PHILOSOPHY</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                  AI Intelligence. Human Judgment.
                </h2>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-6">
                  Algorithms excel at processing massive datasets, evaluating code performance, and discovering non-obvious skill patterns. Humans excel at understanding cultural nuance, motivation, empathy, and organizational chemistry.
                </p>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                  LetGetIn never replaces human hiring managers with black-box algorithms. Instead, our AI automates screening toil and surfaces audited proofs of work, giving recruiters the clarity to make thoughtful, empathetic hiring decisions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15">
                  <div className="w-10 h-10 rounded-xl bg-sky-400/20 text-sky-300 flex items-center justify-center mb-4">
                    <Brain className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">What AI Does</h4>
                  <ul className="text-xs text-sky-100 space-y-1.5 mt-3">
                    <li>• Sandboxed runtime code execution</li>
                    <li>• Demographic-free bias screening</li>
                    <li>• Semantic skill gap diagnostic</li>
                    <li>• Automated interview transcript cues</li>
                  </ul>
                </div>

                <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15">
                  <div className="w-10 h-10 rounded-xl bg-rose-400/20 text-rose-300 flex items-center justify-center mb-4">
                    <Heart className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1">What Humans Do</h4>
                  <ul className="text-xs text-rose-100 space-y-1.5 mt-3">
                    <li>• Culture & values calibration</li>
                    <li>• Empathetic career conversations</li>
                    <li>• Team chemistry assessment</li>
                    <li>• Final hiring decisions</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. VISUAL WORKFLOW: DISCOVER TO HIRE */}
      <section className="py-16 md:py-24 bg-white border-y border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#061f3d] tracking-tight mb-3">
              From Candidate Discovery to Hiring
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              A unified 6-stage lifecycle engineered to accelerate hiring while elevating candidate experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workflowSteps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#f8fbfe] rounded-3xl border border-[#e2edf8] p-7 flex flex-col justify-between hover:border-[#bae6fd] hover:shadow-card-clean transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs font-bold text-[#0066cc] bg-white px-2.5 py-1 rounded-md border border-[#dbeafe]">
                        STAGE {item.num} · {item.step.toUpperCase()}
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-[#f0f8ff] text-[#0066cc] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-[#061f3d] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. BUILT FOR MODERN RECRUITING TEAMS */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0f8ff] text-[#0066cc] border border-[#dbeafe] text-xs font-bold uppercase tracking-wider mb-3">
              <span>ENTERPRISE CAPABILITIES</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#061f3d] tracking-tight mb-3">
              Built for Modern Recruiting Teams
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              End-to-end recruitment infrastructure supporting high-growth engineering, finance, and enterprise talent pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {suiteFeatures.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-3xl border border-[#e2edf8] p-7 sm:p-8 flex flex-col justify-between hover:border-[#bae6fd] hover:shadow-card-clean transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-[#f0f8ff] border border-[#dbeafe] flex items-center justify-center text-[#0066cc]">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-mono font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
                        {feat.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#061f3d] tracking-tight mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    {feat.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. CONNECTED TO LETGETIN ECOSYSTEM */}
      <section className="py-16 bg-white border-t border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-4">
                <span>SEAMLESS PLATFORM UNIFICATION</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#061f3d] tracking-tight mb-4">
                Connected to the Full LetGetIn Ecosystem
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                The AI Recruitment Suite doesn't operate in a silo. It links directly with LetGetIn's reverse hiring marketplace, HUREMASO HRMS, and employee lifecycle management.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#f0f8ff] text-[#0066cc] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#061f3d]">HUREMASO HRMS Integration</h4>
                    <p className="text-xs text-slate-500">Hired candidates automatically transition into onboarding and employee records with zero data re-entry.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#f0f8ff] text-[#0066cc] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#061f3d]">Continuous Skill Telemetry</h4>
                    <p className="text-xs text-slate-500">Pre-hire verified sandbox benchmarks feed into post-hire internal mobility and career progression plans.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#f0f8ff] text-[#0066cc] flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#061f3d]">Enterprise Security & SOC2 Trust</h4>
                    <p className="text-xs text-slate-500">End-to-end encrypted candidate records, role-based access control, and GDPR data isolation.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#f8fbfe] border border-[#e2edf8] rounded-3xl p-8 shadow-card-clean space-y-6">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Ecosystem Workflow Bridge
              </span>

              <div className="space-y-3">
                <div 
                  onClick={() => onNavigate && onNavigate('/enterprise/huremaso')}
                  className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-[#0066cc] transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#f0f8ff] text-[#0066cc] flex items-center justify-center font-bold">
                      H
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#061f3d] group-hover:text-[#0066cc] transition-colors">HUREMASO HRMS</h4>
                      <p className="text-xs text-slate-500">AI-powered employee management & lifecycle operations</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0066cc] group-hover:translate-x-0.5 transition-all" />
                </div>

                <div 
                  onClick={() => onNavigate && onNavigate('/enterprise/ai')}
                  className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-[#0066cc] transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                      AI
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#061f3d] group-hover:text-[#0066cc] transition-colors">Enterprise AI</h4>
                      <p className="text-xs text-slate-500">Workforce intelligence & human-in-the-loop decisions</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0066cc] group-hover:translate-x-0.5 transition-all" />
                </div>

                <div 
                  onClick={() => onNavigate && onNavigate('/enterprise/human-data')}
                  className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-[#0066cc] transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                      HD
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#061f3d] group-hover:text-[#0066cc] transition-colors">Human Data</h4>
                      <p className="text-xs text-slate-500">Domain expert evaluations & AI benchmark ground truth</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0066cc] group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. FINAL ENTERPRISE CTA */}
      <section className="py-16 bg-[#061a33] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Build a Smarter Hiring Operation with LetGetIn
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8">
            Deploy the AI Recruitment Suite to discover verified candidates, eliminate interview bias, and cut screening time by 60%.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate ? onNavigate('/enterprise/contact-sales') : onOpenDemo('Contact Sales - AI Recruitment Suite')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#061a33] font-bold text-sm transition-all shadow-xs cursor-pointer"
            >
              Contact Sales
            </button>
            <button
              type="button"
              onClick={() => onOpenDemo('AI Recruitment Suite Walkthrough')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-sm transition-all cursor-pointer"
            >
              Request Platform Demo
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
