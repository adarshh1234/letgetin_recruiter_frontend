import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Users, 
  UserPlus, 
  UserCheck, 
  Calendar, 
  Award, 
  Bell, 
  Settings, 
  Brain, 
  BarChart3, 
  Heart, 
  Zap, 
  CheckCircle2, 
  Workflow 
} from 'lucide-react';

interface HuremasoPageProps {
  onOpenDemo: (context?: string) => void;
  onNavigate?: (path: string) => void;
}

export const HuremasoPage: React.FC<HuremasoPageProps> = ({ onOpenDemo, onNavigate }) => {
  const lifecycleStages = [
    {
      stage: 'Recruit',
      num: '01',
      desc: 'Seamless candidate import from LetGetIn AI-vetted sandbox assessments directly into HRMS records.',
      icon: Users
    },
    {
      stage: 'Onboard',
      num: '02',
      desc: 'Automated document collection, IT equipment provisioning, and personalized welcoming workflows.',
      icon: UserPlus
    },
    {
      stage: 'Manage',
      num: '03',
      desc: 'Intuitive self-service employee directory, attendance tracking, leave requests, and digital document vaults.',
      icon: UserCheck
    },
    {
      stage: 'Develop',
      num: '04',
      desc: 'Continuous skill telemetry, multi-dimensional feedback loops, and automated career progression plans.',
      icon: Award
    },
    {
      stage: 'Engage',
      num: '05',
      desc: 'Pulse sentiment surveys, peer appreciation rewards, and empathetic manager check-in cadences.',
      icon: Heart
    },
    {
      stage: 'Retain',
      num: '06',
      desc: 'Predictive retention modeling, transparent internal mobility, and proactive compensation benchmarks.',
      icon: Zap
    }
  ];

  const huremasoFeatures = [
    {
      title: 'Employee Management',
      tag: 'Core HR',
      desc: 'Unified employee profiles housing verified skill credentials, role history, compensation details, and organizational charts.',
      icon: Users,
      highlights: ['Dynamic org hierarchy', 'Digital document vault', 'Custom custom fields']
    },
    {
      title: 'Recruitment Integration',
      tag: 'Talent Acquisition',
      desc: 'Native bridge to LetGetIn AI Recruitment Suite. One-click transition from verified sandbox candidate to hired employee.',
      icon: Workflow,
      highlights: ['Zero data re-entry', 'Pre-hire test telemetry', 'Automated offer generation']
    },
    {
      title: 'Onboarding & Offboarding',
      tag: 'Lifecycle Ops',
      desc: 'Automate paperwork, compliance attestations, equipment logistics, and exit interviews with empathetic care.',
      icon: UserPlus,
      highlights: ['Configurable checklist templates', 'E-signature integration', 'Automated asset de-provisioning']
    },
    {
      title: 'Performance Management',
      tag: 'Growth & Review',
      desc: 'Continuous 360-degree reviews, quarterly OKRs, and STAR impact tracking that replaces annual stressful performance reviews.',
      icon: Award,
      highlights: ['Goal & OKR tracking', 'Peer feedback integration', 'Growth milestones']
    },
    {
      title: 'Leave & Attendance Operations',
      tag: 'Workforce Logistics',
      desc: 'Frictionless PTO accrual calculation, shift scheduling, regional holiday calendars, and mobile check-in capabilities.',
      icon: Calendar,
      highlights: ['Multi-region holiday support', 'Automated leave accruals', 'Overtime calculation']
    },
    {
      title: 'Real-Time Notifications',
      tag: 'Communication',
      desc: 'Smart notifications across Slack, Microsoft Teams, and email alerting managers to anniversaries, approvals, and reviews.',
      icon: Bell,
      highlights: ['Slack & Teams bot alerts', 'Approval request reminders', 'Team milestone broadcasts']
    },
    {
      title: 'Flexible HR Configuration',
      tag: 'Governance',
      desc: 'Granular role-based permissions, custom approval workflows, multi-entity corporate structures, and audit logs.',
      icon: Settings,
      highlights: ['Multi-subsidiary support', 'Role-based access control', 'Full audit trails']
    },
    {
      title: 'AI Assistance & Policy Co-Pilot',
      tag: 'Intelligent Support',
      desc: 'AI assistant trained on company handbooks and employment policies that answers routine employee HR questions instantly.',
      icon: Brain,
      highlights: ['Instant policy answering', 'Smart document summarization', 'Manager coaching cues']
    },
    {
      title: 'Workforce Insights & Analytics',
      tag: 'Executive Telemetry',
      desc: 'Executive dashboards tracking headcount growth, retention rates, diversity metrics, and compensation benchmark parity.',
      icon: BarChart3,
      highlights: ['Headcount & turnover metrics', 'Pay parity analysis', 'Customizable reporting exports']
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
              <span>THE MODERN HRMS ECOSYSTEM</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#061f3d] tracking-[-0.035em] leading-[1.15] mb-6">
              HUREMASO: AI-Powered HRMS with a <span className="text-gradient-blue">Human Touch</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 leading-relaxed mb-8">
              An innovative AI-vetted, human-empathy-integrated HRMS platform. HUREMASO unifies employee records, onboarding, leave logistics, performance development, and workforce analytics into one cohesive human-centered operating system.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate ? onNavigate('/enterprise/contact-sales') : onOpenDemo('HUREMASO Demo')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white btn-gradient-blue shadow-xs hover:shadow-blue-glow transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Explore HUREMASO</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                type="button"
                onClick={() => onOpenDemo('HUREMASO Interactive Walkthrough')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
              >
                Schedule Platform Demo
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 2. VISUAL EMPLOYEE LIFECYCLE */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#061f3d] tracking-tight mb-3">
              The Complete Employee Lifecycle
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              One connected thread from candidate discovery to leadership retention.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
            {lifecycleStages.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#e2edf8] p-5 flex flex-col justify-between hover:border-[#bae6fd] hover:shadow-xs transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-xs font-bold text-[#0066cc]">
                        {item.num}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-[#f0f8ff] text-[#0066cc] flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <h3 className="text-sm font-bold text-[#061f3d] mb-1.5">
                      {item.stage}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. MORE THAN AN HRMS (FORMULA) */}
      <section className="py-16 md:py-20 bg-white border-y border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#061f3d] tracking-tight mb-3">
              More than an HRMS
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Legacy HR systems are rigid databases. HUREMASO is an intelligent human operations engine built on four harmonious pillars.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#f8fbfe] rounded-3xl border border-[#e2edf8] p-7 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#f0f8ff] text-[#0066cc] flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#061f3d] mb-2">AI Intelligence</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Skill benchmarking, automated transcription, policy assistance, and retention telemetry.
              </p>
            </div>

            <div className="bg-[#f8fbfe] rounded-3xl border border-[#e2edf8] p-7 text-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mx-auto mb-4">
                <Workflow className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#061f3d] mb-2">HR Automation</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Effortless leave accruals, e-signature onboarding, and zero-touch compliance workflows.
              </p>
            </div>

            <div className="bg-[#f8fbfe] rounded-3xl border border-[#e2edf8] p-7 text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#061f3d] mb-2">Human Empathy</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Respectful candidate communications, wellness sentiment cues, and dignified feedback loops.
              </p>
            </div>

            <div className="bg-[#f8fbfe] rounded-3xl border border-[#e2edf8] p-7 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#061f3d] mb-2">Employee Experience</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Intuitive self-service apps that employees actually enjoy using every day.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. FEATURE CARDS GRID */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-2xl sm:text-4xl font-extrabold text-[#061f3d] tracking-tight mb-3">
              Built for HR Teams. Designed for People.
            </h2>
            <p className="text-sm sm:text-base text-slate-500">
              Everything required to manage a global, distributed, high-performance organization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {huremasoFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
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

      {/* 5. FINAL CTA */}
      <section className="py-16 bg-[#061a33] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Experience the Future of Human Resource Management
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8">
            Upgrade your team from disconnected spreadsheets to HUREMASO’s unified, empathetic HRMS intelligence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate ? onNavigate('/enterprise/contact-sales') : onOpenDemo('HUREMASO Sales Demo')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#061a33] font-bold text-sm transition-all shadow-xs cursor-pointer"
            >
              Contact Sales for HUREMASO
            </button>
            <button
              type="button"
              onClick={() => onOpenDemo('HUREMASO Custom Sandbox')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-sm transition-all cursor-pointer"
            >
              Request Custom Walkthrough
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
