import React, { useState } from 'react';
import { 
  MapPin, 
  Handshake, 
  Search, 
  SlidersHorizontal, 
  Zap, 
  CheckCircle2, 
  ArrowRight 
} from 'lucide-react';

export interface CompanyBid {
  id: string;
  companyName: string;
  companyLogoBg: string;
  companyInitial: string;
  industry: string;
  position: string;
  requiredSkills: string[];
  experience: 'Mid-Level' | 'Senior' | 'Staff / Principal' | 'Lead';
  location: string;
  isRemote: boolean;
  salaryRange: string;
  hourlyRate: string;
  openings: number;
  postedDate: string;
  bidStatus: 'Active Bidding' | 'Immediate Offer' | 'Fast-Track Evaluation' | 'Escrow Guaranteed';
  bidAmount: string;
  candidateResponses: number;
  description: string;
}

interface DirectCompanyBidsPageProps {
  onOpenDemo: (position?: string) => void;
  onNavigate?: (path: string) => void;
}

export const DirectCompanyBidsPage: React.FC<DirectCompanyBidsPageProps> = ({ onOpenDemo }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedExp, setSelectedExp] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [respondedBids, setRespondedBids] = useState<string[]>([]);
  const [selectedBidDetail, setSelectedBidDetail] = useState<CompanyBid | null>(null);

  const industries = [
    'All',
    'AI & Frontier Research',
    'Quantitative Trading & Fintech',
    'Healthcare & Biotechnology',
    'Enterprise Cloud & Security',
    'Autonomous Systems & Robotics'
  ];

  const bidsData: CompanyBid[] = [
    {
      id: 'bid-101',
      companyName: 'Anthropic Scaled Systems Group',
      companyLogoBg: 'bg-[#d97706]',
      companyInitial: 'A',
      industry: 'AI & Frontier Research',
      position: 'Staff Distributed Inference Engineer',
      requiredSkills: ['CUDA', 'C++', 'vLLM', 'High-Performance Computing', 'PyTorch'],
      experience: 'Staff / Principal',
      location: 'San Francisco, CA',
      isRemote: true,
      salaryRange: '$280k - $360k / year',
      hourlyRate: '$160 - $210 / hr',
      openings: 3,
      postedDate: '3 hours ago',
      bidStatus: 'Active Bidding',
      bidAmount: '$210/hr Max Bid',
      candidateResponses: 14,
      description: 'Placing direct reverse bids for engineers who have benchmarked top 5% on distributed model parallelization. Direct skip to technical architecture round.'
    },
    {
      id: 'bid-102',
      companyName: 'Citadel Horizon Research',
      companyLogoBg: 'bg-[#0f766e]',
      companyInitial: 'C',
      industry: 'Quantitative Trading & Fintech',
      position: 'Senior High-Frequency Algorithmic Modeler',
      requiredSkills: ['C++20', 'Low-Latency Linux', 'Statistical Arbitrage', 'Order Book Dynamics'],
      experience: 'Senior',
      location: 'New York, NY',
      isRemote: false,
      salaryRange: '$350k - $550k + Bonus',
      hourlyRate: '$200 - $280 / hr',
      openings: 2,
      postedDate: '5 hours ago',
      bidStatus: 'Immediate Offer',
      bidAmount: '$280/hr Max Bid',
      candidateResponses: 8,
      description: 'Direct company bid for proven quant modelers with verified math/algorithmic scores. Guaranteed 48-hour decision turnaround.'
    },
    {
      id: 'bid-103',
      companyName: 'BioSynthetix Precision Therapeutics',
      companyLogoBg: 'bg-[#4338ca]',
      companyInitial: 'B',
      industry: 'Healthcare & Biotechnology',
      position: 'Lead Computational Biologist & NGS Architect',
      requiredSkills: ['Python', 'Bioconductor', 'Transcriptomics', 'CRISPR Target Modeling'],
      experience: 'Lead',
      location: 'Cambridge, MA',
      isRemote: true,
      salaryRange: '$220k - $290k / year',
      hourlyRate: '$135 - $175 / hr',
      openings: 4,
      postedDate: '1 day ago',
      bidStatus: 'Escrow Guaranteed',
      bidAmount: '$175/hr Max Bid',
      candidateResponses: 19,
      description: 'Direct institutional budget allocated for computational genomicists. Ready to initiate contracts immediately upon sandbox verification.'
    },
    {
      id: 'bid-104',
      companyName: 'Stripe Security Infrastructure',
      companyLogoBg: 'bg-[#6366f1]',
      companyInitial: 'S',
      industry: 'Enterprise Cloud & Security',
      position: 'Senior Cloud Security & Zero-Trust Architect',
      requiredSkills: ['AWS Security', 'Terraform', 'Vault', 'Zero Trust', 'Go'],
      experience: 'Senior',
      location: 'Seattle, WA',
      isRemote: true,
      salaryRange: '$240k - $310k / year',
      hourlyRate: '$140 - $185 / hr',
      openings: 2,
      postedDate: '1 day ago',
      bidStatus: 'Fast-Track Evaluation',
      bidAmount: '$185/hr Max Bid',
      candidateResponses: 23,
      description: 'Actively bidding on candidates with verified security audit credentials. Bypass initial recruiter screening directly to engineering hiring manager.'
    },
    {
      id: 'bid-105',
      companyName: 'Skydio Autonomous Flight Labs',
      companyLogoBg: 'bg-[#b91c1c]',
      companyInitial: 'S',
      industry: 'Autonomous Systems & Robotics',
      position: 'Senior Computer Vision & SLAM Engineer',
      requiredSkills: ['ROS2', 'Visual SLAM', 'C++', 'Embedded CUDA', 'State Estimation'],
      experience: 'Senior',
      location: 'San Mateo, CA',
      isRemote: false,
      salaryRange: '$230k - $300k / year',
      hourlyRate: '$130 - $170 / hr',
      openings: 3,
      postedDate: '2 days ago',
      bidStatus: 'Active Bidding',
      bidAmount: '$170/hr Max Bid',
      candidateResponses: 11,
      description: 'Direct bids placed for engineers with proven 3D perception and real-time obstacle avoidance experience.'
    },
    {
      id: 'bid-106',
      companyName: 'Databricks Storage & Indexing Engine',
      companyLogoBg: 'bg-[#ea580c]',
      companyInitial: 'D',
      industry: 'Enterprise Cloud & Security',
      position: 'Staff Query Optimization & Database Architect',
      requiredSkills: ['Rust', 'Apache Arrow', 'Parquet Internals', 'SIMD Vectorization', 'C++'],
      experience: 'Staff / Principal',
      location: 'San Francisco, CA',
      isRemote: true,
      salaryRange: '$300k - $400k / year',
      hourlyRate: '$175 - $225 / hr',
      openings: 2,
      postedDate: '3 days ago',
      bidStatus: 'Immediate Offer',
      bidAmount: '$225/hr Max Bid',
      candidateResponses: 16,
      description: 'Competitive reverse bids for core database engine architects. Complete your proof of work session to unlock immediate interview bids.'
    }
  ];

  const filteredBids = bidsData.filter((bid) => {
    const matchesSearch = 
      bid.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bid.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bid.requiredSkills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      bid.industry.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesIndustry = selectedIndustry === 'All' || bid.industry === selectedIndustry;
    const matchesExp = selectedExp === 'All' || bid.experience === selectedExp;
    const matchesStatus = selectedStatus === 'All' || bid.bidStatus === selectedStatus;

    return matchesSearch && matchesIndustry && matchesExp && matchesStatus;
  });

  const handleRespondToBid = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (!respondedBids.includes(id)) {
      setRespondedBids([...respondedBids, id]);
    }
  };

  return (
    <div className="bg-[#f8fbfe] text-slate-800 font-sans min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-14 md:pt-40 md:pb-20 relative overflow-hidden bg-white border-b border-sky-100">
        <div className="absolute inset-0 screenshot-ambient-glow pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0f8ff] border border-[#dbeafe] text-[#0066cc] text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
              <Handshake className="w-3.5 h-3.5 text-[#0066cc]" />
              <span>REVERSE HIRING MARKETPLACE</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#061f3d] tracking-[-0.035em] leading-[1.15] mb-6">
              Get Direct Opportunities <span className="text-gradient-blue">From Companies</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 leading-relaxed mb-8">
              Top organizations post verified hiring bids and direct budget commitments. Once your skills are verified in our sandbox, companies bid for you directly with transparent rates and fast-track interviews.
            </p>

            {/* Marketplace Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto text-left">
              <div className="bg-[#f8fbfe] p-4 rounded-2xl border border-[#e2edf8] flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#063970] text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  01
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#061f3d]">Pre-Allocated Budget</h4>
                  <p className="text-[11px] text-slate-500">Bids backed by approved hiring requisition budgets.</p>
                </div>
              </div>

              <div className="bg-[#f8fbfe] p-4 rounded-2xl border border-[#e2edf8] flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#0066cc] text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  02
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#061f3d]">Zero Recruiter Gatekeeping</h4>
                  <p className="text-[11px] text-slate-500">Direct connection to engineering hiring leaders.</p>
                </div>
              </div>

              <div className="bg-[#f8fbfe] p-4 rounded-2xl border border-[#e2edf8] flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                  03
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#061f3d]">Guaranteed Response</h4>
                  <p className="text-[11px] text-slate-500">Average 48-hour feedback and interview scheduling.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SEARCH & FILTER CONTROLS */}
      <section className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 py-4 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            
            {/* Search */}
            <div className="relative flex-1 max-w-xl">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search direct company bids, positions, technologies, or organizations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 focus:border-[#0066cc] transition-all"
              />
            </div>

            {/* Dropdowns */}
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-4 h-4 text-slate-400 shrink-0" />
              
              <select
                value={selectedExp}
                onChange={(e) => setSelectedExp(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20"
              >
                <option value="All">All Experience Levels</option>
                <option value="Mid-Level">Mid-Level</option>
                <option value="Senior">Senior</option>
                <option value="Lead">Lead</option>
                <option value="Staff / Principal">Staff / Principal</option>
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20"
              >
                <option value="All">All Bid Types</option>
                <option value="Active Bidding">Active Bidding</option>
                <option value="Immediate Offer">Immediate Offer</option>
                <option value="Fast-Track Evaluation">Fast-Track Evaluation</option>
                <option value="Escrow Guaranteed">Escrow Guaranteed</option>
              </select>

              <span className="text-xs font-mono text-slate-500 whitespace-nowrap hidden sm:inline-block">
                <strong>{filteredBids.length}</strong> active bids
              </span>
            </div>

          </div>

          {/* Industry Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 mt-3 border-t border-slate-100">
            {industries.map((ind) => (
              <button
                key={ind}
                type="button"
                onClick={() => setSelectedIndustry(ind)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedIndustry === ind
                    ? 'bg-[#063970] text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {ind}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 3. BIDS LISTINGS */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="space-y-6">
            {filteredBids.map((bid) => {
              const isResponded = respondedBids.includes(bid.id);

              return (
                <div
                  key={bid.id}
                  onClick={() => setSelectedBidDetail(bid)}
                  className="bg-white rounded-3xl border border-[#e2edf8] p-6 sm:p-8 hover:border-[#bae6fd] hover:shadow-card-clean transition-all cursor-pointer group"
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    
                    {/* Left: Company & Position Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-2xl ${bid.companyLogoBg} text-white font-bold text-lg flex items-center justify-center shadow-xs shrink-0 font-display`}>
                        {bid.companyInitial}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <h3 className="text-base sm:text-xl font-bold text-[#061f3d] group-hover:text-[#0066cc] transition-colors">
                            {bid.position}
                          </h3>
                          
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                            bid.bidStatus === 'Immediate Offer' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : bid.bidStatus === 'Escrow Guaranteed'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-sky-100 text-sky-800'
                          }`}>
                            <Zap className="w-3 h-3" />
                            <span>{bid.bidStatus}</span>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mb-3">
                          <span className="font-bold text-slate-800">{bid.companyName}</span>
                          <span>·</span>
                          <span className="text-slate-500">{bid.industry}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{bid.location} {bid.isRemote && '(Remote Option)'}</span>
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 max-w-2xl">
                          {bid.description}
                        </p>

                        {/* Skill Badges */}
                        <div className="flex flex-wrap gap-1.5">
                          {bid.requiredSkills.map((skill, i) => (
                            <span key={i} className="px-2.5 py-1 bg-slate-50 border border-slate-200/80 rounded-lg text-xs font-mono text-slate-600">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right: Compensation & Bidding Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 shrink-0 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      
                      <div className="text-left lg:text-right">
                        <span className="text-xs font-mono text-emerald-600 font-bold block">
                          {bid.bidAmount}
                        </span>
                        <div className="text-base sm:text-xl font-black text-[#063970] font-display">
                          {bid.salaryRange}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {bid.openings} open slots · {bid.postedDate}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={(e) => handleRespondToBid(bid.id, e)}
                          className={`w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5 ${
                            isResponded 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-[#063970] hover:bg-[#07498c] text-white'
                          }`}
                        >
                          {isResponded ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Interest Expressed</span>
                            </>
                          ) : (
                            <>
                              <span>Respond to Bid</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. MODAL FOR BID DETAILS */}
      {selectedBidDetail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          onClick={() => setSelectedBidDetail(null)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 relative overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                {selectedBidDetail.bidStatus}
              </span>
              <button
                type="button"
                onClick={() => setSelectedBidDetail(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-800 p-1"
              >
                Close ✕
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl ${selectedBidDetail.companyLogoBg} text-white font-bold text-sm flex items-center justify-center font-display`}>
                {selectedBidDetail.companyInitial}
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#061f3d]">
                  {selectedBidDetail.position}
                </h3>
                <span className="text-xs text-slate-500 font-medium">{selectedBidDetail.companyName}</span>
              </div>
            </div>

            <div className="p-4 bg-[#f8fbfe] rounded-2xl border border-[#e2edf8] mb-6 grid grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <span className="text-slate-400 block">Verified Rate Bid:</span>
                <strong className="text-base text-[#0066cc] font-bold">{selectedBidDetail.hourlyRate}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Annual Comp Target:</span>
                <strong className="text-base text-[#063970] font-bold">{selectedBidDetail.salaryRange}</strong>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
              <div>
                <h4 className="font-bold text-slate-800 mb-1">Bid Requisition Scope:</h4>
                <p>{selectedBidDetail.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1.5">Required Skills:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedBidDetail.requiredSkills.map((s, i) => (
                    <span key={i} className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-mono text-slate-700">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
              <span className="text-xs text-slate-400 font-mono">
                {selectedBidDetail.candidateResponses} candidates in review
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedBidDetail(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleRespondToBid(selectedBidDetail.id);
                    setSelectedBidDetail(null);
                    onOpenDemo(selectedBidDetail.position);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#063970] hover:bg-[#07498c] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  {respondedBids.includes(selectedBidDetail.id) ? 'Interest Registered' : 'Confirm Interest'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
