import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  Menu, 
  Sparkles, 
  MessageSquare, 
  ChevronRight
} from 'lucide-react';
import { 
  HELP_CATEGORIES, 
  getArticleBySlug, 
  HelpCategoryItem, 
  HelpArticleItem 
} from './helpData';
import { HelpSidebar } from './HelpSidebar';
import { HelpSearch } from './HelpSearch';
import { HelpCategoryCard } from './HelpCategoryCard';
import { HelpArticle } from './HelpArticle';

interface HelpCentrePageProps {
  onOpenDemo?: () => void;
  onNavigate?: (path: string) => void;
}

export const HelpCentrePage: React.FC<HelpCentrePageProps> = ({
  onOpenDemo,
  onNavigate
}) => {
  // State for active article slug (null = show Welcome & category cards)
  const [selectedArticleSlug, setSelectedArticleSlug] = useState<string | null>(null);
  // State for selected category view filter (null = all categories)
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);
  // Mobile sidebar drawer state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sync with URL query or hash if user navigated to a specific article (e.g. #welcome or ?article=welcome)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#/, '');
      if (hash && getArticleBySlug(hash)) {
        setSelectedArticleSlug(hash);
      }
    }
  }, []);

  const handleSelectArticle = (slug: string) => {
    setSelectedArticleSlug(slug);
    setSelectedCategoryFilter(null);
    if (typeof window !== 'undefined') {
      window.location.hash = slug;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (categoryId: string) => {
    setSelectedCategoryFilter(categoryId);
    setSelectedArticleSlug(null);
    if (typeof window !== 'undefined') {
      window.location.hash = `cat-${categoryId}`;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleGoToHome = () => {
    setSelectedArticleSlug(null);
    setSelectedCategoryFilter(null);
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const activeArticle = selectedArticleSlug ? getArticleBySlug(selectedArticleSlug) : null;
  const filteredCategory = selectedCategoryFilter 
    ? HELP_CATEGORIES.find(c => c.id === selectedCategoryFilter) 
    : null;

  return (
    <div className="min-h-screen bg-[#f8fbfe] pt-20 md:pt-24 pb-20">
      
      {/* 1. TOP HERO / SEARCH BANNER */}
      <section className="bg-gradient-to-b from-[#061f3d] via-[#062a54] to-[#07366b] text-white py-12 md:py-16 px-4 sm:px-6 lg:px-8 border-b border-sky-900/40 relative overflow-hidden">
        {/* Subtle background glow circles */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0066cc]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#38bdf8]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-sky-200">
            <HelpCircle className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Official LetGetIn Help Centre</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white font-display">
            Welcome to the Help Centre
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Everything you need to get started, verify proof of work, master APEX benchmarks, and get the most out of the platform.
          </p>

          {/* Big Search Bar */}
          <div className="pt-4 max-w-2xl mx-auto">
            <HelpSearch 
              onSelectArticle={handleSelectArticle}
            />
          </div>

          {/* Popular Quick-links */}
          <div className="pt-2 flex items-center justify-center gap-2 flex-wrap text-xs text-sky-200">
            <span className="text-slate-400 font-mono">Trending:</span>
            <button 
              onClick={() => handleSelectArticle('welcome')}
              className="hover:text-white underline decoration-sky-400/50 hover:decoration-white transition-colors cursor-pointer"
            >
              Getting Started
            </button>
            <span className="text-slate-500">·</span>
            <button 
              onClick={() => handleSelectArticle('assessments')}
              className="hover:text-white underline decoration-sky-400/50 hover:decoration-white transition-colors cursor-pointer"
            >
              APEX Sandbox
            </button>
            <span className="text-slate-500">·</span>
            <button 
              onClick={() => handleSelectArticle('applications')}
              className="hover:text-white underline decoration-sky-400/50 hover:decoration-white transition-colors cursor-pointer"
            >
              Direct Bids
            </button>
            <span className="text-slate-500">·</span>
            <button 
              onClick={() => handleSelectArticle('payments')}
              className="hover:text-white underline decoration-sky-400/50 hover:decoration-white transition-colors cursor-pointer"
            >
              Payouts & Stripe
            </button>
          </div>

        </div>
      </section>

      {/* 2. MAIN DOCUMENTATION WORKSPACE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-10">
        
        {/* Mobile Navigation Trigger Bar */}
        <div className="md:hidden mb-6 flex items-center justify-between p-3.5 bg-white rounded-2xl border border-sky-100 shadow-2xs">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="flex items-center gap-2 text-xs font-bold text-[#061f3d] hover:text-[#0066cc] cursor-pointer"
          >
            <Menu className="w-4 h-4 text-[#0066cc]" />
            <span>Browse Documentation Topics</span>
          </button>
          {activeArticle && (
            <span className="text-[11px] font-mono text-slate-400 truncate max-w-[140px]">
              {activeArticle.categoryTitle}
            </span>
          )}
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Left Documentation Sidebar */}
          <HelpSidebar 
            activeArticleSlug={selectedArticleSlug}
            onSelectArticle={handleSelectArticle}
            onGoToHome={handleGoToHome}
            isOpenMobile={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
          />

          {/* Right Main Content Area */}
          <main className="flex-1 w-full min-w-0">
            
            {activeArticle ? (
              /* Single Article Reader View */
              <HelpArticle 
                article={activeArticle}
                onSelectArticle={handleSelectArticle}
                onGoBack={handleGoToHome}
                onNavigate={onNavigate}
              />
            ) : filteredCategory ? (
              /* Specific Category Detail View */
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-xs">
                  <button
                    onClick={handleGoToHome}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0066cc] mb-4 transition-colors cursor-pointer"
                  >
                    <span>← All Categories</span>
                  </button>
                  <h2 className="text-2xl sm:text-3xl font-bold text-[#061f3d] mb-2">
                    {filteredCategory.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mb-6">
                    {filteredCategory.description}
                  </p>

                  <div className="divide-y divide-slate-100">
                    {filteredCategory.articles.map((art: HelpArticleItem) => (
                      <div 
                        key={art.id}
                        onClick={() => handleSelectArticle(art.slug)}
                        className="py-4 hover:bg-sky-50/50 px-3 rounded-xl transition-all cursor-pointer group flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-[#061f3d] group-hover:text-[#0066cc] transition-colors">
                            {art.title}
                          </h4>
                          <p className="text-xs text-slate-500">
                            {art.description}
                          </p>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono pt-1">
                            <span>{art.readTime}</span>
                            <span>·</span>
                            <span>Updated {art.lastUpdated}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0066cc] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Default Welcome / Category Hub View */
              <div className="space-y-10">
                
                {/* Category Cards 2x2 Grid */}
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-[#061f3d] tracking-tight mb-1">
                      Browse Documentation by Category
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Explore detailed user manuals, technical guides, account settings, and FAQs.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {HELP_CATEGORIES.map((category: HelpCategoryItem) => (
                      <HelpCategoryCard
                        key={category.id}
                        category={category}
                        onSelectCategory={handleSelectCategory}
                        onSelectArticle={handleSelectArticle}
                      />
                    ))}
                  </div>
                </div>

                {/* Quick Start Featured Banner */}
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#062447] via-[#063970] to-[#07498c] text-white shadow-md relative overflow-hidden">
                  <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div className="space-y-2 max-w-xl">
                      <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-[11px] font-mono text-sky-200 border border-white/15">
                        <Sparkles className="w-3.5 h-3.5 text-[#38bdf8]" />
                        <span>Featured Walkthrough</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white">
                        New to LetGetIn? Start with the APEX Skill Benchmark
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        Earn verified badges, connect your GitHub proof of work, and unlock direct company bids with no recruiter friction.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                      <button
                        onClick={() => handleSelectArticle('assessments')}
                        className="px-5 py-2.5 rounded-xl bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#061a33] text-xs font-bold transition-all cursor-pointer shadow-xs"
                      >
                        Read APEX Guide
                      </button>
                      {onOpenDemo && (
                        <button
                          onClick={onOpenDemo}
                          className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold transition-all cursor-pointer"
                        >
                          Sign Up Free
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Direct Support Section */}
                <div className="bg-white rounded-3xl border border-sky-100 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-1.5 text-center md:text-left">
                    <h3 className="text-lg font-bold text-[#061f3d]">
                      Can&apos;t find what you are looking for?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-lg">
                      Our customer engineering team is available 24/7 to resolve technical inquiries, sandbox diagnostics, or account queries.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        if (onNavigate) {
                          onNavigate('/customer-care');
                        }
                      }}
                      className="px-5 py-2.5 rounded-xl bg-[#063970] hover:bg-[#07498c] text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-2"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Contact Support</span>
                    </button>
                    <button
                      onClick={() => handleSelectArticle('faq')}
                      className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                    >
                      <span>View FAQ</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

          </main>

        </div>

      </div>

    </div>
  );
};
export default HelpCentrePage;
