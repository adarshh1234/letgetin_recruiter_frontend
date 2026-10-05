import React, { useState } from 'react';
import { ArrowUpRight, Sparkles, BookOpen, Clock } from 'lucide-react';
import { BLOG_ARTICLES_LIST } from '../constants/landing.constants';

export const BlogMatrix: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const categories = ['All', 'Proof of Work', 'Autonomous Bidding', 'Talent Economy', '6 Dimensions'];

  const filtered = activeFilter === 'All' 
    ? BLOG_ARTICLES_LIST 
    : BLOG_ARTICLES_LIST.filter(a => a.category === activeFilter);

  const featuredArticle = filtered.find(a => a.featured) || filtered[0];
  const gridArticles = filtered.filter(a => a.id !== featuredArticle?.id);

  return (
    <section id="blog-matrix" className="py-20 md:py-28 bg-[#f8fbfe] border-b border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-sky-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pill-bg text-pill-text border border-pill-border text-xs font-semibold uppercase tracking-wider mb-3">
              <BookOpen className="w-3.5 h-3.5 text-brand-500" />
              <span>EDITORIAL & RESEARCH MATRIX</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0a192f] tracking-tight">
              Insights on Verified Talent & Merit Hiring
            </h2>
          </div>

          {/* Topic Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pt-4 md:pt-0">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === cat
                    ? 'bg-[#063970] text-white shadow-xs'
                    : 'bg-white border border-sky-200 text-slate-600 hover:bg-sky-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Magazine Editorial Matrix */}
        <div className="space-y-6">
          
          {/* Featured Large Card */}
          {featuredArticle && (
            <div className="bg-white rounded-[2rem] border border-sky-100 overflow-hidden hover:border-brand-400 transition-all group shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
                
                {/* Left Visual Area */}
                <div className={`lg:col-span-6 bg-gradient-to-br ${featuredArticle.imageGradient} p-8 sm:p-12 text-white flex flex-col justify-between min-h-[280px] relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_60%)] pointer-events-none" />
                  
                  <div className="relative flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white border border-white/30">
                      {featuredArticle.badge}
                    </span>
                    <Sparkles className="w-5 h-5 text-white/90" />
                  </div>

                  <div className="relative mt-10">
                    <div className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-white">
                      "BEYOND A RESUME"
                    </div>
                    <p className="text-sm text-sky-100 mt-2 font-medium">
                      A professional identity layer where verified skills and proof of work get you hired.
                    </p>
                  </div>
                </div>

                {/* Right Content */}
                <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-4 font-mono">
                      <span>{featuredArticle.date}</span>
                      <span className="text-[#0284c7] font-bold uppercase text-[11px] bg-pill-bg px-2.5 py-0.5 rounded-full border border-pill-border">
                        {featuredArticle.category}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-bold text-[#0a192f] tracking-tight group-hover:text-[#0066cc] transition-colors leading-tight mb-4">
                      {featuredArticle.title}
                    </h3>

                    <p className="text-sm text-slate-600 leading-relaxed mb-6">
                      {featuredArticle.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="font-bold text-[#0a192f]">{featuredArticle.author}</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{featuredArticle.readTime}</span>
                      </span>
                    </div>

                    <div className="flex items-center text-xs font-bold text-[#0066cc] group-hover:translate-x-0.5 transition-transform">
                      <span>Read article</span>
                      <ArrowUpRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Secondary Cards Matrix Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-[2rem] border border-sky-100 p-6 sm:p-7 flex flex-col justify-between hover:border-brand-400 hover:shadow-sm transition-all group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4 font-mono">
                    <span>{article.date}</span>
                    <span className="text-[10px] font-bold text-[#0284c7] bg-pill-bg px-2.5 py-0.5 rounded-full border border-pill-border">
                      {article.category}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-[#0a192f] tracking-tight group-hover:text-[#0066cc] transition-colors leading-snug mb-3">
                    {article.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {article.description}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-bold text-[#0a192f]">{article.author}</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.readTime}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
