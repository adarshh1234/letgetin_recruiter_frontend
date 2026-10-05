import React from 'react';
import { 
  FileText, 
  Shield, 
  Scale, 
  Cookie, 
  Brain, 
  Database, 
  Lock, 
  Users, 
  Briefcase, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface PoliciesPageProps {
  onOpenDemo?: () => void;
  onNavigate?: (path: string) => void;
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({ onNavigate }) => {
  const policiesList = [
    {
      title: 'Privacy Policy',
      tag: 'Data Governance',
      desc: 'Details how LetGetIn collects, stores, processes, and protects personal candidate, employer, and HRMS data across global operations.',
      lastUpdated: 'September 2026',
      icon: Shield,
      path: '/privacy',
      actionLabel: 'Read Privacy Policy'
    },
    {
      title: 'Terms of Service',
      tag: 'Platform Agreement',
      desc: 'The master terms governing candidate sandbox participation, employer reverse bidding, HUREMASO HRMS usage, and enterprise accounts.',
      lastUpdated: 'September 2026',
      icon: Scale,
      path: '/terms',
      actionLabel: 'Read Terms of Service'
    },
    {
      title: 'Cookie & Tracking Policy',
      tag: 'Browser Storage',
      desc: 'Explains our use of essential session tokens, performance cookies, and analytics identifiers, with direct granular user consent controls.',
      lastUpdated: 'August 2026',
      icon: Cookie,
      path: '/privacy#cookies',
      actionLabel: 'View Cookie Policy'
    },
    {
      title: 'AI Usage & Empathy Policy',
      tag: 'Ethical AI',
      desc: 'Our commitment to zero-bias algorithmic screening, transparent sandbox benchmarks, and strict human-in-the-loop hiring decision frameworks.',
      lastUpdated: 'September 2026',
      icon: Brain,
      path: '/enterprise/ai',
      actionLabel: 'Explore AI Policy'
    },
    {
      title: 'Platform Security Policy',
      tag: 'Infrastructure',
      desc: 'Technical architecture safeguards, role-based access control, cryptographic data transport, and vulnerability disclosure protocols.',
      lastUpdated: 'September 2026',
      icon: Lock,
      path: '/security',
      actionLabel: 'View Security Policy'
    },
    {
      title: 'Acceptable Use Policy',
      tag: 'Platform Integrity',
      desc: 'Prohibits automated assessment scripting, benchmark tampering, candidate scraping, and malicious code payloads in sandboxed environments.',
      lastUpdated: 'July 2026',
      icon: FileText,
      path: '/terms#prohibited',
      actionLabel: 'Review Acceptable Use'
    },
    {
      title: 'Data Retention & Hygiene Policy',
      tag: 'Data Lifecycle',
      desc: 'Our guidelines for the lifecycle retention, archival, and cryptographic destruction of candidate sandbox logs and HRMS employee records.',
      lastUpdated: 'August 2026',
      icon: Database,
      path: '/privacy#retention',
      actionLabel: 'Read Retention Policy'
    },
    {
      title: 'Community & Safety Guidelines',
      tag: 'Conduct',
      desc: 'Rules promoting respectful professional communication, non-discrimination, anti-harassment, and inclusive technical collaboration across guilds.',
      lastUpdated: 'August 2026',
      icon: Users,
      path: '/terms#networking',
      actionLabel: 'View Community Guidelines'
    },
    {
      title: 'Recruitment & Employer Ethics',
      tag: 'Hiring Standards',
      desc: 'Standards requiring transparent compensation ranges, genuine hiring requisitions, zero candidate exploitation, and swift candidate feedback.',
      lastUpdated: 'September 2026',
      icon: Briefcase,
      path: '/employers',
      actionLabel: 'Review Hiring Standards'
    }
  ];

  return (
    <div className="bg-[#f8fbfe] text-slate-800 font-sans min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-14 md:pt-40 md:pb-20 relative overflow-hidden bg-white border-b border-sky-100">
        <div className="absolute inset-0 screenshot-ambient-glow pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0f8ff] border border-[#dbeafe] text-[#0066cc] text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#0066cc]" />
              <span>LETGETIN POLICY HUB</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#061f3d] tracking-[-0.035em] leading-[1.15] mb-6">
              Platform & Legal <span className="text-gradient-blue">Policies</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 leading-relaxed mb-8">
              Explore the legal, ethical, and operational standards that govern LetGetIn’s verified skill verification network, enterprise recruitment, and HUREMASO HRMS.
            </p>

          </div>
        </div>
      </section>

      {/* 2. CORE POLICY CARDS GRID */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {policiesList.map((policy, idx) => {
              const Icon = policy.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-[#e2edf8] p-7 sm:p-8 flex flex-col justify-between hover:border-[#bae6fd] hover:shadow-card-clean transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-[#f0f8ff] border border-[#dbeafe] flex items-center justify-center text-[#0066cc] group-hover:scale-105 transition-transform">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-mono font-semibold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/80">
                        {policy.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-[#061f3d] tracking-tight mb-2 group-hover:text-[#0066cc] transition-colors">
                      {policy.title}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
                      {policy.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400">
                      Updated: {policy.lastUpdated}
                    </span>
                    
                    <button
                      type="button"
                      onClick={() => {
                        if (onNavigate) {
                          onNavigate(policy.path);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0066cc] hover:text-[#004d99] transition-colors cursor-pointer"
                    >
                      <span>{policy.actionLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Governance summary banner */}
          <div className="mt-16 bg-[#f0f8ff] border border-[#dbeafe] rounded-3xl p-8 sm:p-10 text-center max-w-3xl mx-auto">
            <h3 className="text-xl font-bold text-[#061f3d] mb-2">
              Questions Regarding Our Policy Framework?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              Our legal and compliance team is available to address enterprise inquiries, compliance reviews, and data processing agreements.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('/customer-care')}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#063970] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                Contact Customer Care
              </button>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('/security')}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
              >
                Explore Security Architecture
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
