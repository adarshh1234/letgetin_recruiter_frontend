import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  SlidersHorizontal,
  ChevronRight,
  Building2,
  Check
} from 'lucide-react';

export type JobSector = 'ai-engineering' | 'finance-accounting' | 'healthcare';

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  rate: string;
  type: 'Full-time' | 'Contract' | 'Part-time';
  experience: 'Entry-Level' | 'Mid-Level' | 'Senior' | 'Lead / Principal';
  category: string;
  skills: string[];
  postedTime: string;
  isVerifiedOnly?: boolean;
  isOneClickApply?: boolean;
  hiredCount?: string;
  referralBonus?: string;
  description: string;
}

interface JobDiscoveryPageProps {
  sector: JobSector;
  onOpenDemo: (roleTitle?: string) => void;
  onNavigate?: (path: string) => void;
}

export const JobDiscoveryPage: React.FC<JobDiscoveryPageProps> = ({ sector, onOpenDemo, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedExp, setSelectedExp] = useState('All');
  const [appliedJobs, setAppliedJobs] = useState<string[]>([]);
  const [selectedJobForModal, setSelectedJobForModal] = useState<JobListing | null>(null);

  // Sector-specific metadata
  const sectorConfig = {
    'ai-engineering': {
      title: 'AI & Engineering Jobs',
      badge: 'TECHNICAL & RESEARCH ROLES',
      tagline: 'High-signal roles for Machine Learning researchers, Systems Engineers, and Full-Stack builders.',
      stats: { activeRoles: '3,840+', avgRate: '$95/hr', placementVelocity: '4.2 days' },
      subCategories: [
        'All',
        'Machine Learning & LLMs',
        'Full Stack Development',
        'Backend & Distributed Systems',
        'Frontend & UI/UX Engineering',
        'Cloud, DevOps & Infra',
        'Data Science & Analytics',
        'AI Security & Alignment'
      ]
    },
    'finance-accounting': {
      title: 'Finance & Accounting Jobs',
      badge: 'FINANCIAL & QUANTITATIVE ROLES',
      tagline: 'Direct opportunities for Quantitative Analysts, Controllers, Audit Specialists, and Corporate Finance leaders.',
      stats: { activeRoles: '2,150+', avgRate: '$105/hr', placementVelocity: '3.8 days' },
      subCategories: [
        'All',
        'Corporate Finance & FP&A',
        'Quantitative Analysis & Risk',
        'Audit & Internal Controls',
        'Tax & Regulatory Compliance',
        'Investment Banking & M&A',
        'Accounting & Controllership',
        'Financial Crime & AML'
      ]
    },
    'healthcare': {
      title: 'Health Sector Jobs',
      badge: 'HEALTHCARE & LIFE SCIENCES',
      tagline: 'Connecting clinical evaluators, biomedical researchers, health informatics specialists, and pharmaceutical experts.',
      stats: { activeRoles: '1,420+', avgRate: '$110/hr', placementVelocity: '5.1 days' },
      subCategories: [
        'All',
        'Biotechnology & Genomics',
        'Clinical Research & Trials',
        'Health Informatics & EHR',
        'Medical AI & Imaging',
        'Pharmaceutical Sciences',
        'Healthcare Compliance & Policy',
        'Medical Writing & Evaluation'
      ]
    }
  }[sector];

  // Comprehensive dataset categorized for the 3 sectors
  const allJobs: Record<JobSector, JobListing[]> = {
    'ai-engineering': [
      {
        id: 'ai-1',
        title: 'Senior LLM Evaluation & RLHF Engineer',
        company: 'Synthetix AI Lab',
        location: 'San Francisco, CA',
        isRemote: true,
        rate: '$120 - $160 / hour',
        type: 'Contract',
        experience: 'Senior',
        category: 'Machine Learning & LLMs',
        skills: ['Python', 'PyTorch', 'RLHF', 'Eval Frameworks', 'DSPy'],
        postedTime: '2 hours ago',
        isVerifiedOnly: true,
        isOneClickApply: true,
        hiredCount: '18 hired this week',
        referralBonus: '$500',
        description: 'Design rigorous benchmark datasets and reinforcement learning feedback pipelines for next-gen reasoning models.'
      },
      {
        id: 'ai-2',
        title: 'Distributed Systems & Rust Core Engineer',
        company: 'Nexus Scale Systems',
        location: 'New York, NY',
        isRemote: true,
        rate: '$140 - $185 / hour',
        type: 'Full-time',
        experience: 'Lead / Principal',
        category: 'Backend & Distributed Systems',
        skills: ['Rust', 'gRPC', 'Raft Consensus', 'Kubernetes', 'High Throughput'],
        postedTime: '5 hours ago',
        isVerifiedOnly: true,
        isOneClickApply: true,
        hiredCount: '9 hired this week',
        referralBonus: '$600',
        description: 'Build ultra-low latency state machine replication and database storage engines for real-time AI inference.'
      },
      {
        id: 'ai-3',
        title: 'Full Stack AI Platform Engineer (React + Python)',
        company: 'Cortex Interactive',
        location: 'Austin, TX',
        isRemote: true,
        rate: '$85 - $115 / hour',
        type: 'Full-time',
        experience: 'Mid-Level',
        category: 'Full Stack Development',
        skills: ['React', 'TypeScript', 'FastAPI', 'TailwindCSS', 'PostgreSQL'],
        postedTime: '1 day ago',
        isVerifiedOnly: false,
        isOneClickApply: true,
        hiredCount: '34 hired this month',
        referralBonus: '$350',
        description: 'Build adaptive sandbox interfaces and real-time visualization tooling for candidate skill diagnostics.'
      },
      {
        id: 'ai-4',
        title: 'Data Science & Causal Inference Specialist',
        company: 'Vanguard Analytics',
        location: 'Seattle, WA',
        isRemote: true,
        rate: '$90 - $130 / hour',
        type: 'Contract',
        experience: 'Senior',
        category: 'Data Science & Analytics',
        skills: ['Python', 'R', 'Causal ML', 'A/B Testing', 'Snowflake'],
        postedTime: '1 day ago',
        isVerifiedOnly: true,
        isOneClickApply: false,
        referralBonus: '$400',
        description: 'Conduct observational causal inference studies and build automated experimentation platforms.'
      },
      {
        id: 'ai-5',
        title: 'Cloud Infrastructure & MLOps Architect',
        company: 'Aether Cloud',
        location: 'Boston, MA',
        isRemote: true,
        rate: '$110 - $150 / hour',
        type: 'Full-time',
        experience: 'Senior',
        category: 'Cloud, DevOps & Infra',
        skills: ['Terraform', 'AWS', 'Kubernetes', 'Ray', 'vLLM Infra'],
        postedTime: '2 days ago',
        isVerifiedOnly: true,
        isOneClickApply: true,
        hiredCount: '14 hired this month',
        referralBonus: '$450',
        description: 'Scale multi-region GPU clusters and automate model checkpointing across heterogeneous cloud environments.'
      },
      {
        id: 'ai-6',
        title: 'AI Alignment & Adversarial Red Teamer',
        company: 'SafeGuard AI',
        location: 'San Francisco, CA',
        isRemote: true,
        rate: '$100 - $145 / hour',
        type: 'Contract',
        experience: 'Mid-Level',
        category: 'AI Security & Alignment',
        skills: ['Jailbreak Analysis', 'Safety Benchmarks', 'Prompt Injection', 'Python'],
        postedTime: '3 days ago',
        isVerifiedOnly: true,
        isOneClickApply: true,
        referralBonus: '$480',
        description: 'Probe frontier models for vulnerabilities, automated safety guardrails bypass, and systematic bias.'
      }
    ],
    'finance-accounting': [
      {
        id: 'fin-1',
        title: 'Quantitative Risk & Derivative Valuation Lead',
        company: 'AlphaEdge Capital',
        location: 'New York, NY',
        isRemote: true,
        rate: '$130 - $180 / hour',
        type: 'Full-time',
        experience: 'Senior',
        category: 'Quantitative Analysis & Risk',
        skills: ['Python', 'Stochastic Calculus', 'Monte Carlo', 'Options Pricing', 'SQL'],
        postedTime: '3 hours ago',
        isVerifiedOnly: true,
        isOneClickApply: true,
        hiredCount: '12 hired this month',
        referralBonus: '$600',
        description: 'Develop algorithmic volatility surfaces, value complex exotic derivatives, and perform stress testing.'
      },
      {
        id: 'fin-2',
        title: 'Technical Accounting & SEC Reporting Specialist',
        company: 'Grant & Sterling Advisory',
        location: 'Chicago, IL',
        isRemote: true,
        rate: '$80 - $120 / hour',
        type: 'Contract',
        experience: 'Senior',
        category: 'Accounting & Controllership',
        skills: ['US GAAP', 'SEC 10-K/10-Q', 'ASC 606', 'ASC 842', 'SOX 404'],
        postedTime: '6 hours ago',
        isVerifiedOnly: true,
        isOneClickApply: true,
        hiredCount: '299 hired this month',
        referralBonus: '$480',
        description: 'Evaluate technical accounting memoranda, revenue recognition structures, and quarterly SEC regulatory filings.'
      },
      {
        id: 'fin-3',
        title: 'Financial Crime, AML & KYC Senior Analyst',
        company: 'Global FinTrust',
        location: 'London, UK',
        isRemote: true,
        rate: '$75 - $100 / hour',
        type: 'Contract',
        experience: 'Mid-Level',
        category: 'Financial Crime & AML',
        skills: ['AML/CFT', 'Sanctions Screening', 'SAR Filings', 'Transaction Monitoring'],
        postedTime: '1 day ago',
        isVerifiedOnly: true,
        isOneClickApply: true,
        hiredCount: '716 hired this month',
        referralBonus: '$400',
        description: 'Investigate high-complexity anomalous financial flows, suspicious transaction reports, and cross-border regulatory filings.'
      },
      {
        id: 'fin-4',
        title: 'Strategic FP&A & Revenue Economics Evaluator',
        company: 'Meridian Holdings',
        location: 'San Francisco, CA',
        isRemote: true,
        rate: '$80 - $120 / hour',
        type: 'Full-time',
        experience: 'Senior',
        category: 'Corporate Finance & FP&A',
        skills: ['Financial Modeling', 'Unit Economics', 'Cohort Analysis', 'Tableau', 'Excel'],
        postedTime: '2 days ago',
        isVerifiedOnly: false,
        isOneClickApply: true,
        hiredCount: '444 hired this month',
        referralBonus: '$480',
        description: 'Build predictive cash flow projections, customer acquisition payback models, and enterprise pricing matrixes.'
      },
      {
        id: 'fin-5',
        title: 'Internal Audit & Controls Specialist (Enterprise)',
        company: 'Apex Controls Corp',
        location: 'Dallas, TX',
        isRemote: true,
        rate: '$80 - $120 / hour',
        type: 'Contract',
        experience: 'Mid-Level',
        category: 'Audit & Internal Controls',
        skills: ['SOX Controls', 'COSO Framework', 'Risk Assessment', 'Audit Trail Testing'],
        postedTime: '3 days ago',
        isVerifiedOnly: true,
        isOneClickApply: true,
        hiredCount: '233 hired this month',
        referralBonus: '$480',
        description: 'Perform operational audit walk-throughs, sample control testing, and remediate compliance deficiencies.'
      },
      {
        id: 'fin-6',
        title: 'Cross-Border Tax Advisory & Transfer Pricing Specialist',
        company: 'Vanguard Tax Partners',
        location: 'Boston, MA',
        isRemote: true,
        rate: '$95 - $135 / hour',
        type: 'Contract',
        experience: 'Senior',
        category: 'Tax & Regulatory Compliance',
        skills: ['Transfer Pricing', 'OECD BEPS', 'International Tax', 'Corporate Restructuring'],
        postedTime: '4 days ago',
        isVerifiedOnly: true,
        isOneClickApply: false,
        referralBonus: '$500',
        description: 'Structure intercompany transaction benchmarks and defend cross-border transfer pricing documentation.'
      }
    ],
    'healthcare': [
      {
        id: 'health-1',
        title: 'Clinical Research & Protocol Design Evaluator',
        company: 'BioNova Therapeutics',
        location: 'Cambridge, MA',
        isRemote: true,
        rate: '$90 - $140 / hour',
        type: 'Contract',
        experience: 'Senior',
        category: 'Clinical Research & Trials',
        skills: ['GCP Compliance', 'Phase II/III Protocol', 'EDC Systems', 'FDA IND/NDA'],
        postedTime: '4 hours ago',
        isVerifiedOnly: true,
        isOneClickApply: true,
        hiredCount: '42 hired this month',
        referralBonus: '$500',
        description: 'Review clinical trial endpoints, investigational new drug applications, and Good Clinical Practice compliance audit logs.'
      },
      {
        id: 'health-2',
        title: 'Biomedical AI & Diagnostic Imaging Scientist',
        company: 'MedCognition AI',
        location: 'San Diego, CA',
        isRemote: true,
        rate: '$110 - $160 / hour',
        type: 'Full-time',
        experience: 'Senior',
        category: 'Medical AI & Imaging',
        skills: ['PyTorch', 'DICOM', 'Computer Vision', 'FDA SaMD', 'Histopathology'],
        postedTime: '7 hours ago',
        isVerifiedOnly: true,
        isOneClickApply: true,
        hiredCount: '19 hired this month',
        referralBonus: '$550',
        description: 'Train deep convolutional and vision transformer models on 3D CT/MRI scans for early oncological lesion detection.'
      },
      {
        id: 'health-3',
        title: 'Biology Research Scientist (BA, MS, PhDs)',
        company: 'Genomic Frontiers Lab',
        location: 'Boston, MA',
        isRemote: true,
        rate: '$60 - $100 / hour',
        type: 'Contract',
        experience: 'Mid-Level',
        category: 'Biotechnology & Genomics',
        skills: ['CRISPR', 'Next-Gen Sequencing (NGS)', 'Bioinformatics', 'Cell Culture'],
        postedTime: '1 day ago',
        isVerifiedOnly: true,
        isOneClickApply: true,
        hiredCount: '655 hired this month',
        referralBonus: '$500',
        description: 'Evaluate genomic sequencing pipelines, RNA transcriptomics data, and targeted enzyme pathway kinetics.'
      },
      {
        id: 'health-4',
        title: 'Health Informatics & FHIR EHR Integration Architect',
        company: 'CareGrid Systems',
        location: 'Austin, TX',
        isRemote: true,
        rate: '$95 - $135 / hour',
        type: 'Full-time',
        experience: 'Lead / Principal',
        category: 'Health Informatics & EHR',
        skills: ['HL7 / FHIR', 'Epic Interconnect', 'Cerner API', 'HIPAA Security', 'OAuth2'],
        postedTime: '2 days ago',
        isVerifiedOnly: true,
        isOneClickApply: true,
        hiredCount: '27 hired this month',
        referralBonus: '$480',
        description: 'Build bi-directional interoperability bridges between patient telemetry endpoints and hospital electronic health records.'
      },
      {
        id: 'health-5',
        title: 'Pharmaceutical Regulatory Affairs & Compliance Reviewer',
        company: 'Aegis Pharma Global',
        location: 'Philadelphia, PA',
        isRemote: true,
        rate: '$85 - $125 / hour',
        type: 'Contract',
        experience: 'Senior',
        category: 'Pharmaceutical Sciences',
        skills: ['eCTD Submissions', 'FDA 21 CFR', 'EMA Guidelines', 'Post-Market Vigilance'],
        postedTime: '3 days ago',
        isVerifiedOnly: true,
        isOneClickApply: false,
        referralBonus: '$450',
        description: 'Ensure electronic Common Technical Document compliance for multinational pharmaceutical product marketing authorisations.'
      },
      {
        id: 'health-6',
        title: 'Medical Communication & Clinical Manuscript Specialist',
        company: 'Ascent Scientific Communications',
        location: 'New York, NY',
        isRemote: true,
        rate: '$70 - $105 / hour',
        type: 'Contract',
        experience: 'Mid-Level',
        category: 'Medical Writing & Evaluation',
        skills: ['ICMJE Guidelines', 'Peer-Review Manuscripts', 'Statistical Reporting', 'Medical Literature'],
        postedTime: '4 days ago',
        isVerifiedOnly: false,
        isOneClickApply: true,
        hiredCount: '118 hired this month',
        referralBonus: '$350',
        description: 'Draft peer-reviewed scientific manuscripts, executive clinical study summaries, and investigator brochures.'
      }
    ]
  };

  const currentSectorJobs = allJobs[sector] || [];

  const filteredJobs = currentSectorJobs.filter((job) => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSubCategory = selectedSubCategory === 'All' || job.category === selectedSubCategory;
    const matchesType = selectedType === 'All' || job.type === selectedType;
    const matchesExp = selectedExp === 'All' || job.experience === selectedExp;

    return matchesSearch && matchesSubCategory && matchesType && matchesExp;
  });

  const handleApply = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (!appliedJobs.includes(id)) {
      setAppliedJobs([...appliedJobs, id]);
    }
  };

  return (
    <div className="bg-[#f8fbfe] text-slate-800 font-sans min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-14 md:pt-38 md:pb-18 relative overflow-hidden bg-white border-b border-sky-100">
        <div className="absolute inset-0 screenshot-ambient-glow pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0f8ff] border border-[#dbeafe] text-[#0066cc] text-xs font-bold uppercase tracking-wider mb-4 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#0066cc]" />
              <span>{sectorConfig.badge}</span>
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#061f3d] tracking-[-0.035em] leading-tight mb-4">
              {sectorConfig.title}
            </h1>

            {/* Tagline */}
            <p className="text-sm sm:text-lg text-slate-600 leading-relaxed mb-8">
              {sectorConfig.tagline}
            </p>

            {/* Stats Bar */}
            <div className="grid grid-cols-3 gap-4 max-w-lg bg-[#f8fbfe] p-4 rounded-2xl border border-[#e2edf8]">
              <div>
                <span className="text-xs text-slate-500 block font-medium">Verified Roles</span>
                <strong className="text-lg font-bold text-[#063970] font-display">{sectorConfig.stats.activeRoles}</strong>
              </div>
              <div>
                <span className="text-xs text-slate-500 block font-medium">Average Rate</span>
                <strong className="text-lg font-bold text-[#0066cc] font-display">{sectorConfig.stats.avgRate}</strong>
              </div>
              <div>
                <span className="text-xs text-slate-500 block font-medium">Placement Time</span>
                <strong className="text-lg font-bold text-emerald-600 font-display">{sectorConfig.stats.placementVelocity}</strong>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <section className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 py-4 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search Box */}
            <div className="relative flex-1 max-w-xl">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by title, technology, skill, or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 focus:border-[#0066cc] transition-all"
              />
            </div>

            {/* Quick Dropdown Filters */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20"
                >
                  <option value="All">All Job Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Contract">Contract</option>
                </select>

                <select
                  value={selectedExp}
                  onChange={(e) => setSelectedExp(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20"
                >
                  <option value="All">All Experience</option>
                  <option value="Entry-Level">Entry-Level</option>
                  <option value="Mid-Level">Mid-Level</option>
                  <option value="Senior">Senior</option>
                  <option value="Lead / Principal">Lead / Principal</option>
                </select>
              </div>

              <span className="text-xs font-mono text-slate-500 whitespace-nowrap hidden sm:inline-block">
                Showing <strong>{filteredJobs.length}</strong> roles
              </span>
            </div>

          </div>

          {/* Subcategory Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 mt-3 border-t border-slate-100">
            {sectorConfig.subCategories.map((sub) => (
              <button
                key={sub}
                type="button"
                onClick={() => setSelectedSubCategory(sub)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedSubCategory === sub
                    ? 'bg-[#063970] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 3. JOB CARDS GRID */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800 mb-2">No Matching Roles Found</h3>
              <p className="text-xs text-slate-500 mb-6">
                Try clearing your search filters or browse other discipline categories.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSubCategory('All');
                  setSelectedType('All');
                  setSelectedExp('All');
                }}
                className="px-4 py-2 bg-[#063970] text-white text-xs font-bold rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job) => {
                const isApplied = appliedJobs.includes(job.id);

                return (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJobForModal(job)}
                    className="bg-white rounded-2xl sm:rounded-3xl border border-[#e2edf8] p-6 sm:p-7 flex flex-col justify-between hover:border-[#bae6fd] hover:shadow-[0_10px_25px_rgba(2,132,199,0.07)] transition-all cursor-pointer group"
                  >
                    <div>
                      {/* Top Row */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="text-[11px] font-mono font-semibold text-[#0066cc] bg-[#f0f8ff] px-2.5 py-0.5 rounded-md border border-[#dbeafe]">
                          {job.category}
                        </span>
                        {job.isOneClickApply && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                            <Check className="w-2.5 h-2.5 text-emerald-600" />
                            <span>1-click apply</span>
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-base sm:text-lg font-bold text-[#061f3d] tracking-tight group-hover:text-[#0066cc] transition-colors leading-snug mb-2">
                        {job.title}
                      </h3>

                      {/* Company & Location */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4">
                        <span className="font-semibold text-slate-700 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.company}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.location}</span>
                        </span>
                        {job.isRemote && (
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">
                            Remote
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
                        {job.description}
                      </p>

                      {/* Skills Pills */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {job.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-slate-50 border border-slate-200/80 rounded-md text-[10px] font-mono text-slate-600"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Info Bar */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-[#061f3d] block font-mono">
                          {job.rate}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {job.postedTime}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {job.referralBonus && (
                          <span className="text-[11px] font-mono text-slate-500 hidden sm:inline-block">
                            <span className="text-slate-400">&</span> {job.referralBonus}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={(e) => handleApply(job.id, e)}
                          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isApplied
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-[#063970] hover:bg-[#07498c] text-white shadow-2xs'
                          }`}
                        >
                          {isApplied ? 'Applied ✓' : 'Apply'}
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>
      </section>

      {/* 4. SECTOR CROSS-NAVIGATION & CTA */}
      <section className="py-16 bg-white border-t border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#061f3d] tracking-tight mb-2">
              Explore Other Specialized Disciplines
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Browse thousands of AI-vetted opportunities across our core platform sectors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                id: 'ai-engineering',
                title: 'AI & Engineering',
                desc: 'Frontier AI research, Distributed Systems, ML Infrastructure, and Full Stack.',
                path: '/jobs/ai-engineering',
              },
              {
                id: 'finance-accounting',
                title: 'Finance & Accounting',
                desc: 'Quantitative modeling, Audit, SEC compliance, FP&A, and AML analytics.',
                path: '/jobs/finance-accounting',
              },
              {
                id: 'healthcare',
                title: 'Health Sector Jobs',
                desc: 'Clinical evaluation, Diagnostic AI, Healthcare informatics, and Biotechnology.',
                path: '/jobs/healthcare',
              },
            ]
              .filter((s) => s.id !== sector)
              .map((item) => (
                <div
                  key={item.id}
                  onClick={() => onNavigate && onNavigate(item.path)}
                  className="bg-[#f8fbfe] rounded-2xl border border-[#e2edf8] p-6 hover:border-[#0066cc] transition-all cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <h3 className="text-base font-bold text-[#061f3d] group-hover:text-[#0066cc] transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4">
                      {item.desc}
                    </p>
                  </div>
                  <div className="flex items-center text-xs font-bold text-[#0066cc] group-hover:translate-x-1 transition-transform">
                    <span>View Opportunities</span>
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              ))}

            {/* Direct Company Bids Callout */}
            <div
              onClick={() => onNavigate && onNavigate('/direct-company-bids')}
              className="bg-gradient-to-br from-[#062b63] to-[#087bc1] text-white rounded-2xl p-6 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-sky-200 block mb-1">
                  MARKETPLACE
                </span>
                <h3 className="text-base font-bold text-white mb-2">
                  Direct Company Bids
                </h3>
                <p className="text-xs text-sky-100 leading-relaxed mb-4">
                  Discover companies actively placing reverse bids and hiring verified talent.
                </p>
              </div>
              <div className="flex items-center text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
                <span>Browse Live Bids</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. JOB DETAILS MODAL */}
      {selectedJobForModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedJobForModal(null)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 relative overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <span className="text-xs font-mono font-bold text-[#0066cc] bg-[#f0f8ff] px-2.5 py-1 rounded-lg border border-[#dbeafe]">
                {selectedJobForModal.category}
              </span>
              <button
                type="button"
                onClick={() => setSelectedJobForModal(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-800 p-1"
              >
                Close ✕
              </button>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#061f3d] mb-2">
              {selectedJobForModal.title}
            </h3>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mb-6">
              <span className="font-bold text-slate-800">{selectedJobForModal.company}</span>
              <span>·</span>
              <span>{selectedJobForModal.location}</span>
              <span>·</span>
              <span className="font-bold text-[#0066cc]">{selectedJobForModal.rate}</span>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Overview:</h4>
                <p>{selectedJobForModal.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1.5">Required Skills:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJobForModal.skills.map((s, idx) => (
                    <span key={idx} className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-mono text-slate-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <div className="text-xs text-slate-400 font-mono">
                {selectedJobForModal.hiredCount || 'Active hiring pipeline'}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedJobForModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleApply(selectedJobForModal.id);
                    setSelectedJobForModal(null);
                    onOpenDemo(selectedJobForModal.title);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#063970] hover:bg-[#07498c] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  {appliedJobs.includes(selectedJobForModal.id) ? 'Already Applied' : 'Confirm Application'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
