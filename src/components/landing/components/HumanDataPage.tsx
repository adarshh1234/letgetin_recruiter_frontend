import React from 'react';
import { 
  ArrowRight, 
  Brain, 
  Users, 
  Database, 
  CheckCircle2, 
  ShieldCheck, 
  Cpu, 
  FileCode, 
  Stethoscope, 
  Calculator, 
  TrendingUp
} from 'lucide-react';

interface HumanDataPageProps {
  onOpenDemo: (context?: string) => void;
  onNavigate?: (path: string) => void;
}

export const HumanDataPage: React.FC<HumanDataPageProps> = ({ onOpenDemo, onNavigate }) => {
  const dataFlowSteps = [
    {
      num: '01',
      step: 'Human Expertise',
      desc: 'Top 5% verified engineers, quantitative modelers, clinical researchers, and domain experts.',
      icon: Users
    },
    {
      num: '02',
      step: 'High-Signal Data',
      desc: 'Ground-truth code architectures, multi-turn reasoning traces, and adversarial edge cases.',
      icon: Database
    },
    {
      num: '03',
      step: 'Rigorous Evaluation',
      desc: 'Standardized evaluation rubrics, RLHF feedback, and multi-dimensional verification audits.',
      icon: ShieldCheck
    },
    {
      num: '04',
      step: 'AI Intelligence',
      desc: 'Frontier models aligned on authentic human reasoning and verified domain accuracy.',
      icon: Brain
    },
    {
      num: '05',
      step: 'Better Decisions',
      desc: 'High-confidence hiring, precise workforce allocations, and trusted AI deployments.',
      icon: TrendingUp
    }
  ];

  const expertDomains = [
    {
      title: 'Systems & Software Engineering',
      desc: 'Staff engineers in Rust, C++, distributed algorithms, and kernel architecture providing code execution evaluations.',
      icon: FileCode,
      tag: 'Technical Evaluation'
    },
    {
      title: 'Frontier AI & Evaluation Science',
      desc: 'PhD researchers in LLM reasoning, alignment guardrails, and adversarial red-teaming benchmarks.',
      icon: Cpu,
      tag: 'AI Benchmarks'
    },
    {
      title: 'Quantitative Finance & Economics',
      desc: 'Derivatives modelers, SEC accounting evaluators, and risk analysts validating complex financial logic.',
      icon: Calculator,
      tag: 'Financial Logic'
    },
    {
      title: 'Biomedical & Clinical Sciences',
      desc: 'Clinical trial evaluators, genomics researchers, and medical protocol reviewers ensuring diagnostic fidelity.',
      icon: Stethoscope,
      tag: 'Healthcare Data'
    }
  ];

  const enterpriseUseCases = [
    {
      title: 'AI Model Benchmarking & Red-Teaming',
      desc: 'Deploy 120k+ pre-vetted specialists to stress-test your proprietary AI models against domain-specific edge cases, hallucinations, and safety vulnerabilities.',
      highlights: ['Domain-specific ground truth', 'Human-in-the-loop RLHF datasets', 'Adversarial jailbreak audits']
    },
    {
      title: 'Talent Intelligence & Capability Mapping',
      desc: 'Replace keyword guessing with audited human performance metrics across your candidate pool and internal engineering teams.',
      highlights: ['Multi-dimensional radar scores', 'STAR quantified impact audits', 'Demographic-free screening']
    },
    {
      title: 'Workforce Planning & Skill Gap Modeling',
      desc: 'Leverage real-time global talent telemetry to forecast emerging skill scarcity and calibrate compensation benchmarks.',
      highlights: ['Predictive talent availability', 'Cross-border rate parity', 'Internal mobility mapping']
    },
    {
      title: 'Human-in-the-Loop Workflow Automation',
      desc: 'Integrate verified human checkpoints into critical automated business workflows to maintain quality and ethical compliance.',
      highlights: ['Human review escalation tiers', 'Consensus grading models', 'Audit trail documentation']
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
              <Database className="w-3.5 h-3.5 text-[#0066cc]" />
              <span>HUMAN-IN-THE-LOOP INTELLIGENCE</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#061f3d] tracking-[-0.035em] leading-[1.15] mb-6">
              Better AI Starts with <span className="text-gradient-blue">Better Human Insight</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 leading-relaxed mb-8">
              Human-centered data and evaluation for better AI and workforce intelligence. We connect enterprise engineering teams with verified domain experts to build, benchmark, and deploy reliable intelligence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate ? onNavigate('/enterprise/contact-sales') : onOpenDemo('Human Data Enterprise')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white btn-gradient-blue shadow-xs hover:shadow-blue-glow transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Talk to our Enterprise Team</span>
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

      {/* 2. VISUAL DATA FLOW */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#061f3d] tracking-tight mb-3">
              The Human-to-Intelligence Value Flow
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              Transforming authentic domain expertise into high-fidelity AI models and workforce decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {dataFlowSteps.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-[#e2edf8] p-6 flex flex-col justify-between hover:border-[#bae6fd] hover:shadow-card-clean transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs font-bold text-[#0066cc]">
                        {item.num}
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-[#f0f8ff] text-[#0066cc] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <h3 className="text-base font-bold text-[#061f3d] mb-2">
                      {item.step}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. VERIFIED DOMAIN EXPERTISE POOL */}
      <section className="py-16 md:py-24 bg-white border-y border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f0f8ff] text-[#0066cc] border border-[#dbeafe] text-xs font-bold uppercase tracking-wider mb-3">
              <span>SPECIALIZED TALENT POOL</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#061f3d] tracking-tight mb-3">
              Audited Domain Expertise on Demand
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              Access pre-vetted specialists who have completed rigorous sandbox evaluations across key technical disciplines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertDomains.map((domain, i) => {
              const Icon = domain.icon;
              return (
                <div
                  key={i}
                  className="bg-[#f8fbfe] rounded-3xl border border-[#e2edf8] p-7 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-white border border-[#dbeafe] text-[#0066cc] flex items-center justify-center mb-5 shadow-2xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase text-[#0066cc] block mb-1">
                      {domain.tag}
                    </span>
                    <h3 className="text-base font-bold text-[#061f3d] mb-2">
                      {domain.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {domain.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. ENTERPRISE USE CASES */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#061f3d] tracking-tight mb-3">
              Enterprise Applications
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              How engineering and talent organizations deploy LetGetIn human data.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {enterpriseUseCases.map((uc, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-[#e2edf8] p-8 flex flex-col justify-between hover:border-[#bae6fd] hover:shadow-card-clean transition-all"
              >
                <div>
                  <h3 className="text-xl font-bold text-[#061f3d] mb-3">
                    {uc.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {uc.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-2">
                  {uc.highlights.map((h, hIdx) => (
                    <div key={hIdx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="py-16 bg-[#061a33] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Accelerate Your AI with Verified Human Insight
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8">
            Speak with our enterprise data solutions group to commission custom evaluation sets, RLHF cohorts, or workforce capability mapping.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate ? onNavigate('/enterprise/contact-sales') : onOpenDemo('Human Data Sales')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#061a33] font-bold text-sm transition-all shadow-xs cursor-pointer"
            >
              Talk to our Enterprise Team
            </button>
            <button
              type="button"
              onClick={() => onOpenDemo('Human Data Evaluation Specs')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-sm transition-all cursor-pointer"
            >
              Request Data Specifications
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
