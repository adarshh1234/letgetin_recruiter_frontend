import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  ArrowUpRight, 
  Clock, 
  Play, 
  Video 
} from 'lucide-react';

interface BlogArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  featured?: boolean;
  gradient: string;
  badge?: string;
}

interface BlogPageProps {
  onOpenVideoDemo: () => void;
  onOpenDemo: () => void;
  onNavigate?: (path: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onOpenVideoDemo, onOpenDemo }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeArticleModal, setActiveArticleModal] = useState<BlogArticle | null>(null);

  const categories = [
    'All',
    'News & Announcements',
    'AI & Technology',
    'Recruitment & Merit',
    'Career & Proof of Work',
    'HR & Compliance',
    'Platform Updates'
  ];

  const articles: BlogArticle[] = [
    {
      id: 'blog-1',
      title: 'The Death of the Traditional Resume: Why Verified Proof of Work Outperforms CVs by 4x',
      description: 'An empirical study of 120,000 engineering candidates evaluated across standardized sandboxes versus keyword-driven ATS pipelines.',
      category: 'Recruitment & Merit',
      date: 'Sep 04, 2026',
      readTime: '4 min read',
      author: 'LetGetIn Research Lab',
      featured: true,
      badge: 'FLAGSHIP STUDY',
      gradient: 'from-[#063970] via-[#08498f] to-[#0a192f]'
    },
    {
      id: 'blog-2',
      title: 'Reverse Job Bidding: How Domain Experts Earn True Market Value in the 2026 AI Economy',
      description: 'When companies compete for pre-vetted engineers with transparent salary floors, placement velocity jumps by 300%.',
      category: 'Career & Proof of Work',
      date: 'Aug 29, 2026',
      readTime: '5 min read',
      author: 'Aiden Vance',
      featured: false,
      badge: 'MARKET TRENDS',
      gradient: 'from-[#063970] to-[#0066cc]'
    },
    {
      id: 'blog-3',
      title: 'Demographic Masking & Cognitive Testing: The End of Unconscious Hiring Bias',
      description: 'How LetGetIn evaluates the 6 Dimensions of Talent without revealing personal identifiers until the final handshake.',
      category: 'Recruitment & Merit',
      date: 'Aug 21, 2026',
      readTime: '6 min read',
      author: 'Dr. Elena Rostova',
      featured: false,
      badge: 'DEI & MERIT',
      gradient: 'from-[#0a192f] to-[#063970]'
    },
    {
      id: 'blog-4',
      title: 'Why AI Agents Get Stuck in Keyword Filters (And How Sandboxed Audits Fix It)',
      description: 'Keyword-based screening algorithms inadvertently reject 72% of qualified engineers with non-traditional backgrounds.',
      category: 'AI & Technology',
      date: 'Aug 14, 2026',
      readTime: '3 min read',
      author: 'Tariq Al-Mansoor',
      featured: false,
      badge: 'TECH INSIGHT',
      gradient: 'from-[#0066cc] to-[#38bdf8]'
    },
    {
      id: 'blog-5',
      title: 'Building Verifiable Identity: From Project Sandboxes to Cryptographic Proof',
      description: 'A deep-dive into how LetGetIn verifies GitHub commits, system architecture diagrams, and adaptive test responses.',
      category: 'Platform Updates',
      date: 'Aug 06, 2026',
      readTime: '7 min read',
      author: 'Engineering Team',
      featured: false,
      badge: 'ARCHITECTURE',
      gradient: 'from-[#083361] to-[#061a33]'
    },
    {
      id: 'blog-6',
      title: 'SOC2 Type II & Zero Bias Certification: What Enterprise Leaders Need to Know',
      description: 'Detailed compliance breakdown of LetGetIn’s demographic-free candidate evaluation layer and data isolation architecture.',
      category: 'HR & Compliance',
      date: 'Jul 28, 2026',
      readTime: '5 min read',
      author: 'Compliance Group',
      featured: false,
      badge: 'ENTERPRISE',
      gradient: 'from-[#062b63] to-[#0284c7]'
    }
  ];

  const videos = [
    {
      id: 'vid-1',
      title: 'LetGetIn Platform Tour: How Verified Proof of Work Replaces Resumes',
      duration: '02:45',
      speaker: 'Alex Rivera, Head of Product',
      category: 'Platform Walkthrough',
      description: 'See the end-to-end flow from taking an adaptive 10-minute skill test to receiving direct company bids.'
    },
    {
      id: 'vid-2',
      title: 'How Global Engineering Teams Evaluate LetGetIn Candidates',
      duration: '03:12',
      speaker: 'Sarah Mitchell, VP Talent',
      category: 'Partner Case Study',
      description: 'Why leading technical teams use LetGetIn’s 6 Dimensions to cut interview cycles by 60%.'
    },
    {
      id: 'vid-3',
      title: 'Behind the Benchmark: How We Test Code Architecture in Sandboxes',
      duration: '04:05',
      speaker: 'Dr. Nathan Reed, Chief Scientist',
      category: 'Technical Deep Dive',
      description: 'An inside look at our sandboxed code execution engine, edge case generator, and demographic masking layer.'
    }
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesSearch = 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredArticle = filteredArticles.find(a => a.featured) || filteredArticles[0];
  const gridArticles = filteredArticles.filter(a => a.id !== featuredArticle?.id);

  return (
    <div className="bg-[#f8fbfe] text-slate-800 font-sans min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-14 md:pt-40 md:pb-20 relative overflow-hidden bg-white border-b border-sky-100">
        <div className="absolute inset-0 screenshot-ambient-glow pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0f8ff] border border-[#dbeafe] text-[#0066cc] text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
              <BookOpen className="w-3.5 h-3.5 text-[#0066cc]" />
              <span>LETGETIN BLOG & EDITORIAL MATRIX</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#061f3d] tracking-[-0.035em] leading-[1.15] mb-6">
              Insights on Verified Talent & <span className="text-gradient-blue">Merit Hiring</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 leading-relaxed mb-8">
              Stay ahead of the shift from resume claims to audited proof of work. Explore technical research, hiring market analyses, and platform updates.
            </p>

            {/* Search Input */}
            <div className="relative max-w-xl mx-auto">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search articles, research papers, and technical insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 focus:border-[#0066cc] shadow-xs transition-all"
              />
            </div>

          </div>
        </div>
      </section>

      {/* 2. CATEGORY SELECTOR */}
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

      {/* 3. ARTICLES SECTION */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Featured Article */}
          {featuredArticle && (
            <div
              onClick={() => setActiveArticleModal(featuredArticle)}
              className="bg-white rounded-3xl border border-[#e2edf8] overflow-hidden hover:border-[#bae6fd] hover:shadow-card-clean transition-all cursor-pointer group mb-12 shadow-xs"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                
                {/* Visual Side */}
                <div className={`lg:col-span-6 bg-gradient-to-br ${featuredArticle.gradient} p-8 sm:p-12 text-white flex flex-col justify-between min-h-[280px] relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_60%)] pointer-events-none" />
                  
                  <div className="relative flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white border border-white/30">
                      {featuredArticle.badge}
                    </span>
                    <Sparkles className="w-5 h-5 text-sky-200" />
                  </div>

                  <div className="relative mt-8">
                    <div className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white mb-2">
                      "BEYOND A RESUME"
                    </div>
                    <p className="text-xs sm:text-sm text-sky-100">
                      A professional identity layer where verified skills get you hired.
                    </p>
                  </div>
                </div>

                {/* Content Side */}
                <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4 font-mono">
                      <span>{featuredArticle.date}</span>
                      <span className="text-[#0066cc] font-bold uppercase text-[11px] bg-[#f0f8ff] px-2.5 py-0.5 rounded-full border border-[#dbeafe]">
                        {featuredArticle.category}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-[#061f3d] group-hover:text-[#0066cc] transition-colors leading-tight mb-4">
                      {featuredArticle.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                      {featuredArticle.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="font-bold text-slate-800">{featuredArticle.author}</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{featuredArticle.readTime}</span>
                      </span>
                    </div>

                    <div className="flex items-center text-xs font-bold text-[#0066cc] group-hover:translate-x-1 transition-transform">
                      <span>Read article</span>
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Secondary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {gridArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => setActiveArticleModal(art)}
                className="bg-white rounded-3xl border border-[#e2edf8] p-7 flex flex-col justify-between hover:border-[#bae6fd] hover:shadow-card-clean transition-all cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4 font-mono">
                    <span>{art.date}</span>
                    <span className="text-[10px] font-bold text-[#0066cc] bg-[#f0f8ff] px-2.5 py-0.5 rounded-full border border-[#dbeafe]">
                      {art.category}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-[#061f3d] group-hover:text-[#0066cc] transition-colors leading-snug mb-3">
                    {art.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-6">
                    {art.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-slate-800 truncate max-w-[140px]">{art.author}</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{art.readTime}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 4. DEDICATED BLOG VIDEOS SECTION */}
          <div className="bg-[#f8fbfe] border border-[#e2edf8] rounded-3xl p-8 sm:p-12 shadow-card-clean">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-bold uppercase tracking-wider mb-2">
                  <Video className="w-3.5 h-3.5 text-[#0066cc]" />
                  <span>FEATURED VIDEO SERIES</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#061f3d]">
                  Watch Platform Walkthroughs & Deep Dives
                </h3>
              </div>
              <button
                type="button"
                onClick={onOpenVideoDemo}
                className="px-4 py-2 bg-[#063970] hover:bg-[#07498c] text-white text-xs font-bold rounded-xl shadow-2xs cursor-pointer"
              >
                Launch Video Player
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {videos.map((vid) => (
                <div
                  key={vid.id}
                  onClick={onOpenVideoDemo}
                  className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between hover:border-[#bae6fd] hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div>
                    <div className="w-full aspect-video rounded-xl bg-gradient-to-br from-[#062b63] via-[#07498c] to-[#087bc1] text-white flex items-center justify-center relative overflow-hidden mb-4 group-hover:scale-[1.02] transition-transform">
                      <div className="w-10 h-10 rounded-full bg-white text-[#061f3d] flex items-center justify-center shadow-md">
                        <Play className="w-4 h-4 fill-[#061f3d] ml-0.5" />
                      </div>
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-xs text-[10px] font-mono font-bold rounded">
                        {vid.duration}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono font-bold uppercase text-[#0066cc] block mb-1">
                      {vid.category}
                    </span>
                    <h4 className="text-sm font-bold text-[#061f3d] mb-2 leading-snug group-hover:text-[#0066cc] transition-colors">
                      {vid.title}
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
                      {vid.description}
                    </p>
                  </div>

                  <span className="text-[11px] text-slate-400 font-medium">
                    {vid.speaker}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 5. ARTICLE MODAL */}
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
                In empirical trials with 120k+ candidates, our researchers observed that keyword screening rejected over 70% of high-aptitude programmers and researchers from non-traditional backgrounds.
              </p>
              <p>
                By shifting to an audited proof-of-work model across the 6 Dimensions of Talent, hiring teams experience 60% faster candidate placement and zero unconscious resume bias.
              </p>
            </div>

            <div className="p-4 bg-[#f8fbfe] border border-[#dbeafe] rounded-2xl flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-[#061f3d]">Test your proof of work</h4>
                <p className="text-[11px] text-slate-500">Take a 10-minute skill sandbox session.</p>
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

    </div>
  );
};
