import React, { useState } from 'react';
import { 
  Brain, 
  ShieldCheck, 
  Globe, 
  Handshake, 
  Trophy, 
  BarChart2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Briefcase, 
  Lock 
} from 'lucide-react';

interface FeaturesPageProps {
  onOpenDemo: () => void;
  onNavigate?: (path: string) => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onOpenDemo, onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ai' | 'candidates' | 'recruiters' | 'trust'>('all');

  const featureList = [
    {
      id: 'pathfinder-ai',
      category: 'ai',
      icon: Brain,
      title: 'Pathfinder AI Engine',
      tagline: 'Semantic Skill Matching Beyond Keywords',
      description: 'Matches talent, opportunities, and career learning paths based on verified skill proficiencies and multidimensional fit rather than superficial resume keywords.',
      badge: 'Core AI',
      highlights: [
        'Fit score and automated skill gap analysis',
        'Direct career progression mapping',
        'Semantic role taxonomy'
      ]
    },
    {
      id: 'verification-hub',
      category: 'candidates',
      icon: ShieldCheck,
      title: 'Skill Verification Hub',
      tagline: 'Adaptive AI Sandbox & Live Evaluations',
      description: 'Interactive coding environments, adaptive AI interviews, real-world case simulations, and peer endorsements that generate cryptographic proof of craft.',
      badge: 'Proof of Work',
      highlights: [
        'Live 10-minute adaptive technical sandbox',
        'Zero CV bias evaluation architecture',
        'Instant benchmark certifications'
      ]
    },
    {
      id: 'agentic-headhunter',
      category: 'recruiters',
      icon: Handshake,
      title: 'Agentic Headhunter & Bidding',
      tagline: 'AI-to-AI Autonomous Alignment',
      description: 'Autonomous AI agents negotiate candidate preferences, compensation bands, culture fit, and skill expectations before human interview stages begin.',
      badge: 'Reverse Bidding',
      highlights: [
        'Direct company salary and role bids',
        'Automated screening reducing hire time by 60%',
        'Transparent mutual interest matching'
      ]
    },
    {
      id: 'community-guilds',
      category: 'candidates',
      icon: Globe,
      title: 'Authentic Community & Guilds',
      tagline: 'Global Network Across 150+ Countries',
      description: 'High-signal technical guilds, local emerging market hubs, and collaborative knowledge circles designed for engineers, researchers, and creators.',
      badge: '150+ Countries',
      highlights: [
        'AI-curated technical discussions',
        'Peer problem solving and code reviews',
        'Global compensation benchmarks'
      ]
    },
    {
      id: 'gamified-apex',
      category: 'candidates',
      icon: Trophy,
      title: 'Gamified APEX Benchmarks',
      tagline: 'Competitive Hackathons & Leaderboards',
      description: 'Weekly skill challenges and real-world system architecture evaluations that directly update candidate ranking and surface profiles to top engineering leaders.',
      badge: 'Leaderboards',
      highlights: [
        'Global APEX engineering index',
        'Earn verifiable achievement badges',
        'Direct fast-track interview unlocks'
      ]
    },
    {
      id: 'trust-analytics',
      category: 'trust',
      icon: BarChart2,
      title: 'Trust & Reputation Analytics',
      tagline: 'SOC2 Certified · Zero Bias Verified',
      description: 'Comprehensive analytics dashboards showing dynamic reputation scores, algorithmic bias audits, and real-time application progression telemetry.',
      badge: 'Enterprise Security',
      highlights: [
        'Real-time percentile rankings',
        'Audited non-discriminatory hiring models',
        'SOC2 Type II & GDPR compliant data tier'
      ]
    },
    {
      id: 'dimensions-engine',
      category: 'ai',
      icon: Layers,
      title: '6 Dimensions Talent Matrix',
      tagline: 'Holistic Evaluation Framework',
      description: 'Deep profiling evaluating educational foundations, verified skills, performance history, cognitive agility, communication, and adaptability.',
      badge: 'Talent Model',
      highlights: [
        'Structured 6-pillar radar score',
        'STAR methodology impact mapping',
        'Comprehensive candidate summaries'
      ]
    },
    {
      id: 'recruiter-command',
      category: 'recruiters',
      icon: Briefcase,
      title: 'Recruiter Command Dashboard',
      tagline: 'Precision Sourcing & Pipeline Intelligence',
      description: 'Instant search across 120k+ pre-vetted candidates with 1-click interview requests, automated pipeline sync, and ATS/HRMS integrations.',
      badge: 'HR Workflows',
      highlights: [
        'Real-time filter by verified benchmark',
        '1-click interview scheduling & sandbox links',
        'Export to Greenhouse, Lever, and Workday'
      ]
    },
    {
      id: 'privacy-guardian',
      category: 'trust',
      icon: Lock,
      title: 'Zero Data Selling & Candidate Privacy',
      tagline: 'Candidate-Controlled Exposure',
      description: 'Candidates maintain granular control over who can view their profile, salary expectations, and current employment status.',
      badge: 'Privacy First',
      highlights: [
        'Stealth mode for employed candidates',
        'No data harvesting or contact spamming',
        'End-to-end encrypted profile metadata'
      ]
    }
  ];

  const filteredFeatures = selectedCategory === 'all' 
    ? featureList 
    : featureList.filter(f => f.category === selectedCategory);

  return (
    <div className="bg-[#f8fbfe] text-slate-800 font-sans min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 screenshot-ambient-glow pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0f8ff] border border-[#dbeafe] text-[#0066cc] text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#0066cc]" />
              <span>THE LETGETIN PLATFORM</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#061f3d] tracking-[-0.035em] leading-[1.15] mb-6">
              Powerful Features. <span className="text-gradient-blue">One Connected Platform.</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 leading-relaxed mb-8">
              Explore how LetGetIn unifies adaptive AI evaluations, candidate dimensions, reverse hiring bids, global networking, and enterprise recruiting into a single high-trust layer.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={onOpenDemo}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white btn-gradient-blue shadow-xs hover:shadow-blue-glow transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Get In — Free Sandbox Demo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('/the-6-dimensions')}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors shadow-2xs cursor-pointer"
                >
                  View the 6 Dimensions
                </button>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 2. CATEGORY SELECTOR TABS */}
      <section className="sticky top-20 z-30 bg-white/90 backdrop-blur-md border-y border-sky-100/80 py-4 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {([
              { key: 'all' as const, label: 'All Capabilities' },
              { key: 'ai' as const, label: 'AI & Evaluation Engines' },
              { key: 'candidates' as const, label: 'Candidate Experience' },
              { key: 'recruiters' as const, label: 'Recruiter & Hiring OS' },
              { key: 'trust' as const, label: 'Trust & Security' },
            ]).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setSelectedCategory(tab.key)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === tab.key
                    ? 'bg-[#063970] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
        </div>
      </section>

      {/* 3. FEATURE CARDS GRID */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFeatures.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl border border-[#e2edf8] p-7 sm:p-8 flex flex-col justify-between hover:border-[#bae6fd] hover:shadow-[0_10px_30px_rgba(2,132,199,0.08)] transition-all group"
                >
                  <div>
                    {/* Header with Icon & Badge */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-[#f0f8ff] border border-[#dbeafe] flex items-center justify-center text-[#0066cc] group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="px-3 py-1 bg-slate-50 text-slate-600 font-mono text-[11px] font-semibold rounded-lg border border-slate-200/80">
                        {item.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#061f3d] tracking-tight mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-[#0066cc] mb-3">
                      {item.tagline}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
                      {item.description}
                    </p>
                  </div>

                  {/* Highlights List */}
                  <div className="pt-5 border-t border-slate-100 space-y-2">
                    {item.highlights.map((bullet, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. WORKFLOW ARCHITECTURE HIGHLIGHT */}
      <section className="py-16 bg-white border-y border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-4">
                <span>SEAMLESS INTEGRATION</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-[#061f3d] tracking-tight mb-4">
                Connects Directly With Your Existing HR Stack
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
                Whether you are an individual engineer proving your skills or an enterprise team hiring top 5% performers, LetGetIn hooks smoothly into current workflows without friction.
              </p>

              <div className="space-y-3.5">
                {[
                  'Sync candidate scores directly with Greenhouse, Lever, and Ashby',
                  'Instant sandbox evaluations without downloading local tools',
                  'Cryptographic verification badges exportable to GitHub & LinkedIn',
                ].map((point, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 font-medium">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#f8fbfe] border border-[#e2edf8] rounded-3xl p-8 shadow-card-clean">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 mb-6">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                  Telemetry & Platform Stats
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  99.98% Uptime
                </span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80">
                  <span className="text-2xl font-black text-[#063970] font-display block">120k+</span>
                  <span className="text-xs text-slate-500">Verified Candidates</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80">
                  <span className="text-2xl font-black text-[#0066cc] font-display block">60%</span>
                  <span className="text-xs text-slate-500">Screening Time Cut</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80">
                  <span className="text-2xl font-black text-[#063970] font-display block">150+</span>
                  <span className="text-xs text-slate-500">Global Communities</span>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80">
                  <span className="text-2xl font-black text-emerald-600 font-display block">0%</span>
                  <span className="text-xs text-slate-500">CV Bias Allowed</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="py-16 bg-[#061a33] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Ready to Build on LetGetIn?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8">
            Experience the new standard of talent discovery and proof of work today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onOpenDemo}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#061a33] font-bold text-sm transition-all shadow-xs cursor-pointer"
            >
              Get In Free — Start Proving
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
