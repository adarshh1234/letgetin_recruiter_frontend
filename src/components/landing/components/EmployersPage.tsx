import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Search, 
  SlidersHorizontal, 
  Briefcase, 
  ChevronRight, 
  ShieldCheck
} from 'lucide-react';

export interface EmployerEntity {
  id: string;
  name: string;
  logoBg: string;
  initial: string;
  type: 'Company' | 'Startup' | 'Institution' | 'Recruiter';
  industry: string;
  location: string;
  isRemote: boolean;
  openJobsCount: number;
  description: string;
  verifiedPartner: boolean;
  targetSectorPath?: string;
}

interface EmployersPageProps {
  onOpenDemo: (companyName?: string) => void;
  onNavigate?: (path: string) => void;
}

export const EmployersPage: React.FC<EmployersPageProps> = ({ onOpenDemo, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');

  const types = ['All', 'Companies', 'Startups', 'Institutions', 'Recruiters'];
  const industries = [
    'All',
    'AI & Machine Learning',
    'Quantitative Finance & Risk',
    'Biotechnology & Healthcare',
    'Cloud & Infrastructure',
    'Autonomous Systems & Robotics'
  ];

  // Real & consistent partner organizations from the LetGetIn codebase
  const employersList: EmployerEntity[] = [
    {
      id: 'emp-1',
      name: 'Synthetix AI Lab',
      logoBg: 'bg-[#063970]',
      initial: 'S',
      type: 'Company',
      industry: 'AI & Machine Learning',
      location: 'San Francisco, CA',
      isRemote: true,
      openJobsCount: 14,
      description: 'Developing next-generation reasoning architectures, RLHF alignment pipelines, and adaptive intelligence sandboxes.',
      verifiedPartner: true,
      targetSectorPath: '/jobs/ai-engineering'
    },
    {
      id: 'emp-2',
      name: 'AlphaEdge Capital',
      logoBg: 'bg-[#0f766e]',
      initial: 'A',
      type: 'Company',
      industry: 'Quantitative Finance & Risk',
      location: 'New York, NY',
      isRemote: true,
      openJobsCount: 8,
      description: 'High-frequency algorithmic quantitative trading firm deploying real-time statistical modeling and options analytics.',
      verifiedPartner: true,
      targetSectorPath: '/jobs/finance-accounting'
    },
    {
      id: 'emp-3',
      name: 'BioNova Therapeutics',
      logoBg: 'bg-[#4338ca]',
      initial: 'B',
      type: 'Startup',
      industry: 'Biotechnology & Healthcare',
      location: 'Cambridge, MA',
      isRemote: true,
      openJobsCount: 6,
      description: 'Translational genomics startup designing target validation pipelines and adaptive clinical trial evaluation endpoints.',
      verifiedPartner: true,
      targetSectorPath: '/jobs/healthcare'
    },
    {
      id: 'emp-4',
      name: 'Nexus Scale Systems',
      logoBg: 'bg-[#0066cc]',
      initial: 'N',
      type: 'Startup',
      industry: 'Cloud & Infrastructure',
      location: 'Austin, TX',
      isRemote: true,
      openJobsCount: 11,
      description: 'Ultra-low latency distributed database engines and consensus systems for high-throughput AI workloads.',
      verifiedPartner: true,
      targetSectorPath: '/jobs/ai-engineering'
    },
    {
      id: 'emp-5',
      name: 'Grant & Sterling Advisory',
      logoBg: 'bg-[#b45309]',
      initial: 'G',
      type: 'Recruiter',
      industry: 'Quantitative Finance & Risk',
      location: 'Chicago, IL',
      isRemote: true,
      openJobsCount: 19,
      description: 'Specialized executive recruitment collective placing verified SEC reporting, corporate controllership, and audit talent.',
      verifiedPartner: true,
      targetSectorPath: '/jobs/finance-accounting'
    },
    {
      id: 'emp-6',
      name: 'Genomic Frontiers Institute',
      logoBg: 'bg-[#047857]',
      initial: 'G',
      type: 'Institution',
      industry: 'Biotechnology & Healthcare',
      location: 'Boston, MA',
      isRemote: false,
      openJobsCount: 12,
      description: 'Non-profit biomedical research institution benchmarking RNA transcriptomics and CRISPR target mechanisms.',
      verifiedPartner: true,
      targetSectorPath: '/jobs/healthcare'
    },
    {
      id: 'emp-7',
      name: 'Skydio Autonomous Labs',
      logoBg: 'bg-[#b91c1c]',
      initial: 'S',
      type: 'Company',
      industry: 'Autonomous Systems & Robotics',
      location: 'San Mateo, CA',
      isRemote: false,
      openJobsCount: 7,
      description: 'Frontier visual-inertial odometry, SLAM robotics, and computer vision systems for autonomous flight.',
      verifiedPartner: true,
      targetSectorPath: '/direct-company-bids'
    },
    {
      id: 'emp-8',
      name: 'SafeGuard AI Verification',
      logoBg: 'bg-[#7c3aed]',
      initial: 'S',
      type: 'Startup',
      industry: 'AI & Machine Learning',
      location: 'Seattle, WA',
      isRemote: true,
      openJobsCount: 5,
      description: 'Adversarial red-teaming lab assessing safety benchmarks, prompt injection vectors, and model alignment guardrails.',
      verifiedPartner: true,
      targetSectorPath: '/jobs/ai-engineering'
    }
  ];

  const filteredEmployers = employersList.filter((emp) => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.location.toLowerCase().includes(searchQuery.toLowerCase());

    const typeNormalized = selectedType === 'Companies' ? 'Company' : selectedType === 'Startups' ? 'Startup' : selectedType === 'Institutions' ? 'Institution' : selectedType === 'Recruiters' ? 'Recruiter' : 'All';
    const matchesType = typeNormalized === 'All' || emp.type === typeNormalized;
    const matchesIndustry = selectedIndustry === 'All' || emp.industry === selectedIndustry;

    return matchesSearch && matchesType && matchesIndustry;
  });

  return (
    <div className="bg-[#f8fbfe] text-slate-800 font-sans min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-14 md:pt-40 md:pb-20 relative overflow-hidden bg-white border-b border-sky-100">
        <div className="absolute inset-0 screenshot-ambient-glow pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0f8ff] border border-[#dbeafe] text-[#0066cc] text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-[#0066cc]" />
              <span>EMPLOYER DIRECTORY & HIRING NETWORK</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#061f3d] tracking-[-0.035em] leading-[1.15] mb-6">
              Employers on <span className="text-gradient-blue">LetGetIn</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 leading-relaxed mb-8">
              Discover verified companies, forward-thinking startups, research institutions, and specialized recruitment partners hiring top talent through adaptive proof of work.
            </p>

            {/* Search Input */}
            <div className="relative max-w-xl mx-auto">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search employers by name, industry, location, or focus area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 focus:border-[#0066cc] shadow-xs transition-all"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 2. FILTER BAR */}
      <section className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 py-4 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
              {types.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedType(t)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedType === t
                      ? 'bg-[#063970] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Industry Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20"
              >
                {industries.map((ind) => (
                  <option key={ind} value={ind}>
                    {ind === 'All' ? 'All Industries' : ind}
                  </option>
                ))}
              </select>

              <span className="text-xs font-mono text-slate-500 whitespace-nowrap hidden md:inline-block">
                <strong>{filteredEmployers.length}</strong> employers
              </span>
            </div>

          </div>

        </div>
      </section>

      {/* 3. EMPLOYER CARDS GRID */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEmployers.map((emp) => (
              <div
                key={emp.id}
                className="bg-white rounded-3xl border border-[#e2edf8] p-7 flex flex-col justify-between hover:border-[#bae6fd] hover:shadow-card-clean transition-all group"
              >
                <div>
                  
                  {/* Top Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl ${emp.logoBg} text-white font-bold text-lg flex items-center justify-center font-display shadow-2xs`}>
                        {emp.initial}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base sm:text-lg font-bold text-[#061f3d] group-hover:text-[#0066cc] transition-colors">
                            {emp.name}
                          </h3>
                          {emp.verifiedPartner && (
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                        </div>
                        <span className="text-xs text-slate-500 font-medium">{emp.industry}</span>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="px-2.5 py-0.5 bg-[#f0f8ff] text-[#0066cc] text-[11px] font-semibold rounded-md border border-[#dbeafe]">
                      {emp.type}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 font-mono bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/80">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{emp.location}</span>
                    </span>
                    {emp.isRemote && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold">
                        Remote Active
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3">
                    {emp.description}
                  </p>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-[#063970] font-bold">
                    <Briefcase className="w-3.5 h-3.5 text-[#0066cc]" />
                    <span>{emp.openJobsCount} Open Roles</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (emp.targetSectorPath && onNavigate) {
                          onNavigate(emp.targetSectorPath);
                        } else {
                          onOpenDemo(emp.name);
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-[#063970] hover:bg-[#07498c] text-white text-xs font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Roles</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. BECOME A HIRING PARTNER CTA */}
      <section className="py-16 bg-[#061a33] text-white border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Are You an Employer or Recruiter?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8">
            Connect your hiring pipeline with LetGetIn and start receiving verified top 5% talent with zero CV screening overhead.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onOpenDemo('Enterprise Walkthrough')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#061a33] font-bold text-sm transition-all shadow-xs cursor-pointer"
            >
              Request Enterprise Access
            </button>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('/contact')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-sm transition-all cursor-pointer"
              >
                Contact Partnership Team
              </button>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};
