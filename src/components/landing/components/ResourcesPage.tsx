import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  ArrowUpRight, 
  Clock 
} from 'lucide-react';

interface ResourceArticle {
  id: string;
  title: string;
  description: string;
  category: 'Career Guides' | 'Interview Preparation' | 'Proof of Work & CVs' | 'AI & Technical' | 'Employer & HR' | 'LetGetIn Updates';
  readTime: string;
  date: string;
  author: string;
  featured?: boolean;
  gradient: string;
  tags: string[];
}

interface ResourcesPageProps {
  onOpenDemo: () => void;
  onNavigate?: (path: string) => void;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ onOpenDemo, onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticleModal, setActiveArticleModal] = useState<ResourceArticle | null>(null);

  const categories = [
    'All',
    'Career Guides',
    'Interview Preparation',
    'Proof of Work & CVs',
    'AI & Technical',
    'Employer & HR',
    'LetGetIn Updates'
  ];

  const resourcesData: ResourceArticle[] = [
    {
      id: 'res-1',
      title: 'Mastering the AI Skill Sandbox: How to Benchmark in the Top 5% Without CV Inflation',
      description: 'A step-by-step breakdown of how LetGetIn adaptive technical evaluations score candidates on runtime problem-solving, code structure, and architectural depth.',
      category: 'Proof of Work & CVs',
      readTime: '6 min read',
      date: 'Sep 08, 2026',
      author: 'LetGetIn Research Lab',
      featured: true,
      gradient: 'from-[#062b63] via-[#07498c] to-[#087bc1]',
      tags: ['Proof of Work', 'Sandbox Evaluation', 'Benchmark Guide']
    },
    {
      id: 'res-2',
      title: 'The Modern Technical Interview: Navigating Real-Time System Architecture Challenges',
      description: 'How to communicate tradeoffs, handle edge cases, and articulate distributed systems design during live technical evaluations.',
      category: 'Interview Preparation',
      readTime: '5 min read',
      date: 'Sep 02, 2026',
      author: 'Aiden Vance, Lead Architect',
      featured: false,
      gradient: 'from-[#063970] to-[#0066cc]',
      tags: ['System Design', 'Interview Prep', 'Architecture']
    },
    {
      id: 'res-3',
      title: 'Evaluating the 6 Dimensions of Talent: An Employer’s Guide to Zero Bias Hiring',
      description: 'How engineering organizations cut screening time by 60% while dramatically improving offer-to-hire ratios using audited dimension scoring.',
      category: 'Employer & HR',
      readTime: '7 min read',
      date: 'Aug 28, 2026',
      author: 'Dr. Elena Rostova',
      featured: false,
      gradient: 'from-[#0a192f] to-[#063970]',
      tags: ['6 Dimensions', 'HR Strategy', 'Zero Bias']
    },
    {
      id: 'res-4',
      title: 'Reverse Job Bidding Explained: How Top Engineers Let Companies Compete for Them',
      description: 'Understanding the mechanics of company bids, minimum salary thresholds, and direct interview fast-tracks on LetGetIn.',
      category: 'Career Guides',
      readTime: '4 min read',
      date: 'Aug 22, 2026',
      author: 'Tariq Al-Mansoor',
      featured: false,
      gradient: 'from-[#0066cc] to-[#38bdf8]',
      tags: ['Reverse Bidding', 'Compensation', 'Career Strategy']
    },
    {
      id: 'res-5',
      title: 'From Static Resumes to Cryptographic Proof: The 2026 Talent Identity Standard',
      description: 'Why leading tech companies in San Francisco and New York are phasing out keyword parsing in favor of verified GitHub and sandbox proofs.',
      category: 'LetGetIn Updates',
      readTime: '5 min read',
      date: 'Aug 15, 2026',
      author: 'Product Engineering Team',
      featured: false,
      gradient: 'from-[#061a33] to-[#063970]',
      tags: ['Platform Update', 'Merit Standard', 'SOC2']
    },
    {
      id: 'res-6',
      title: 'Frontier AI & LLM Evaluation Frameworks: Benchmarking Complex Reasoning',
      description: 'An in-depth look at how LetGetIn designs adversarial evaluations, code synthesis challenges, and domain-specific benchmarks for research scientists.',
      category: 'AI & Technical',
      readTime: '8 min read',
      date: 'Aug 10, 2026',
      author: 'AI Research Group',
      featured: false,
      gradient: 'from-[#072e5b] to-[#0284c7]',
      tags: ['LLM Benchmark', 'AI Research', 'Technical Guide']
    }
  ];

  const filteredResources = resourcesData.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredResource = filteredResources.find(r => r.featured) || filteredResources[0];
  const gridResources = filteredResources.filter(r => r.id !== featuredResource?.id);

  return (
    <div className="bg-[#f8fbfe] text-slate-800 font-sans min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-14 md:pt-40 md:pb-20 relative overflow-hidden bg-white border-b border-sky-100">
        <div className="absolute inset-0 screenshot-ambient-glow pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0f8ff] border border-[#dbeafe] text-[#0066cc] text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
              <BookOpen className="w-3.5 h-3.5 text-[#0066cc]" />
              <span>LETGETIN KNOWLEDGE & RESEARCH HUB</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#061f3d] tracking-[-0.035em] leading-[1.15] mb-6">
              Resources & <span className="text-gradient-blue">Insights</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 leading-relaxed mb-8">
              Explore in-depth guides, technical benchmarks, zero-bias recruitment research, and strategic advice for candidates, recruiters, and engineering leaders.
            </p>

            {/* Quick Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search across all guides, technical articles, and research..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 focus:border-[#0066cc] shadow-xs transition-all"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 2. CATEGORY PILLS */}
      <section className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 py-4 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#063970] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED ARTICLE & ARTICLES GRID */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Featured Hero Card */}
          {featuredResource && (
            <div
              onClick={() => setActiveArticleModal(featuredResource)}
              className="bg-white rounded-3xl border border-[#e2edf8] overflow-hidden hover:border-[#bae6fd] hover:shadow-card-clean transition-all cursor-pointer group mb-12 shadow-xs"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                
                {/* Visual Side */}
                <div className={`lg:col-span-6 bg-gradient-to-br ${featuredResource.gradient} p-8 sm:p-12 text-white flex flex-col justify-between min-h-[280px] relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_60%)] pointer-events-none" />
                  
                  <div className="relative flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white border border-white/30">
                      FEATURED GUIDE
                    </span>
                    <Sparkles className="w-5 h-5 text-sky-200" />
                  </div>

                  <div className="relative mt-8">
                    <div className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white mb-2">
                      {featuredResource.title}
                    </div>
                    <p className="text-xs sm:text-sm text-sky-100">
                      Essential reading for candidates taking adaptive skill verification.
                    </p>
                  </div>
                </div>

                {/* Content Side */}
                <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4 font-mono">
                      <span>{featuredResource.date}</span>
                      <span className="text-[#0066cc] font-bold uppercase text-[11px] bg-[#f0f8ff] px-2.5 py-0.5 rounded-full border border-[#dbeafe]">
                        {featuredResource.category}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-[#061f3d] group-hover:text-[#0066cc] transition-colors leading-tight mb-4">
                      {featuredResource.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                      {featuredResource.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {featuredResource.tags.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-mono text-slate-600">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="font-bold text-slate-800">{featuredResource.author}</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{featuredResource.readTime}</span>
                      </span>
                    </div>

                    <div className="flex items-center text-xs font-bold text-[#0066cc] group-hover:translate-x-1 transition-transform">
                      <span>Read Guide</span>
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Grid of Other Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridResources.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveArticleModal(item)}
                className="bg-white rounded-3xl border border-[#e2edf8] p-7 flex flex-col justify-between hover:border-[#bae6fd] hover:shadow-card-clean transition-all cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4 font-mono">
                    <span>{item.date}</span>
                    <span className="text-[10px] font-bold text-[#0066cc] bg-[#f0f8ff] px-2.5 py-0.5 rounded-full border border-[#dbeafe]">
                      {item.category}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-[#061f3d] group-hover:text-[#0066cc] transition-colors leading-snug mb-3">
                    {item.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-6">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {item.tags.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-50 border border-slate-200/80 rounded text-[10px] font-mono text-slate-600">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-slate-800 truncate max-w-[140px]">{item.author}</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{item.readTime}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. RESOURCE DETAIL MODAL */}
      {activeArticleModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveArticleModal(null)}
        >
          <div
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-9 relative overflow-hidden animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <span className="text-xs font-mono font-bold text-[#0066cc] bg-[#f0f8ff] px-2.5 py-1 rounded-lg border border-[#dbeafe]">
                {activeArticleModal.category}
              </span>
              <button
                type="button"
                onClick={() => setActiveArticleModal(null)}
                className="text-xs font-bold text-slate-400 hover:text-slate-800 p-1"
              >
                Close ✕
              </button>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-[#061f3d] mb-4">
              {activeArticleModal.title}
            </h3>

            <div className="flex items-center gap-4 text-xs text-slate-500 mb-6 font-mono border-b border-slate-100 pb-4">
              <span>By <strong>{activeArticleModal.author}</strong></span>
              <span>·</span>
              <span>{activeArticleModal.date}</span>
              <span>·</span>
              <span>{activeArticleModal.readTime}</span>
            </div>

            <div className="space-y-4 text-sm text-slate-700 leading-relaxed mb-8">
              <p className="font-semibold text-slate-900 text-base">
                {activeArticleModal.description}
              </p>
              <p>
                In traditional recruiting pipelines, 70%+ of top talent gets lost in resume filters before human review. LetGetIn’s research shows that benchmarking via real runtime environments generates a 4x more predictive hiring signal.
              </p>
              <p>
                Whether you are refining your system design presentation or preparing for our adaptive AI evaluation, focusing on verified proof of work ensures your real capabilities stand out directly to hiring teams.
              </p>
            </div>

            <div className="p-4 bg-[#f8fbfe] border border-[#dbeafe] rounded-2xl flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-[#061f3d]">Ready to test your skills?</h4>
                <p className="text-[11px] text-slate-500">Take a 10-minute sandbox assessment.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveArticleModal(null);
                  onOpenDemo();
                }}
                className="px-4 py-2 bg-[#063970] text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Start Verification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. BOTTOM CTA */}
      <section className="py-16 bg-[#061a33] text-white border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Stay Ahead in the Verified Talent Economy
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto mb-8">
            Subscribe to our weekly research memos and get early access to new technical benchmark sandboxes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={onOpenDemo}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#061a33] font-bold text-sm transition-all shadow-xs cursor-pointer"
            >
              Get In Free — Prove Your Skills
            </button>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('/jobs/ai-engineering')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-sm transition-all cursor-pointer"
              >
                Explore AI & Engineering Jobs
              </button>
            )}
          </div>
        </div>
      </section>

    </div>
  );
};
