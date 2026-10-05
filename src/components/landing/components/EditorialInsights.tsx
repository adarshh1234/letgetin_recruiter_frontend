import React from 'react';
import { ArrowUpRight, Sparkles, BookOpen } from 'lucide-react';

export const EditorialInsights: React.FC = () => {
  const secondaryArticles = [
    {
      date: 'Sep 4, 2026',
      tag: 'RESEARCH',
      title: 'The Death of the Traditional Resume: Why Verified Proof of Work Outperforms CVs by 4x',
      category: 'Talent Architecture',
      readTime: '4 min read'
    },
    {
      date: 'Aug 27, 2026',
      tag: 'ENTERPRISE',
      title: 'Why AI Matching Agents Get Stuck in Keyword Filters — And How Proof of Work Solves It',
      category: 'Enterprise AI',
      readTime: '6 min read'
    },
    {
      date: 'Aug 8, 2026',
      tag: 'TALENT ECONOMY',
      title: 'Reverse Job Bidding: How Domain Experts Earn True Market Value in the 2026 AI Economy',
      category: 'Future of Work',
      readTime: '5 min read'
    },
  ];

  return (
    <section id="insights" className="py-20 md:py-28 bg-white border-b border-zinc-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-zinc-200">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-xs font-semibold uppercase tracking-wider mb-3">
              <BookOpen className="w-3 h-3 text-brand-600" />
              <span>STORIES & RESEARCH</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
              Perspectives on the Future of Work
            </h2>
          </div>
          <p className="text-sm text-zinc-500 max-w-md mt-4 md:mt-0">
            Insights on AI verification, meritocratic evaluation, and talent market dynamics.
          </p>
        </div>

        {/* Mercor Page 5 Layout: Large Featured Hero Card + 3 Column Grid */}
        <div className="space-y-6">
          
          {/* Main Featured Article Card */}
          <div className="bg-white rounded-2xl border border-zinc-200/90 overflow-hidden hover:border-zinc-300 transition-all group shadow-xs">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              
              {/* Left Visual Gradient Header (Mercor Purple/Blue/Pink Gradient) */}
              <div className="lg:col-span-6 bg-gradient-to-br from-brand-600 via-indigo-600 to-purple-800 p-8 sm:p-12 text-white flex flex-col justify-between min-h-[260px] relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.2),transparent_60%)] pointer-events-none" />
                
                <div className="relative flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium border border-white/30 text-white">
                    Featured Insight
                  </span>
                  <Sparkles className="w-5 h-5 text-white/80" />
                </div>

                <div className="relative mt-8">
                  <div className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-white/95">
                    "Beyond a Resume"
                  </div>
                  <p className="text-sm text-white/80 mt-2">
                    A professional identity layer where actions, verified skills, and community participation define your credentials.
                  </p>
                </div>
              </div>

              {/* Right Article Body */}
              <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-4">
                    <span className="font-mono">Sep 8, 2026</span>
                    <span className="text-brand-700 font-semibold uppercase tracking-wider text-[11px]">Special Report</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-zinc-950 tracking-tight group-hover:text-brand-700 transition-colors leading-tight mb-4">
                    LetGetIn Launches Autonomous Benchmark-Driven Matching for 300+ Tech Disciplines
                  </h3>

                  <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                    With over 120,000 verified engineers and designers, LetGetIn's adaptive AI evaluation suite enables companies to evaluate real skills in sandboxed task environments — bypassing the noise of traditional keyword-stuffed CVs.
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <span className="text-xs text-zinc-500 font-medium">Company Announcement · 5 min read</span>
                  <div className="flex items-center text-xs font-semibold text-zinc-950 group-hover:text-brand-600 transition-colors">
                    <span>Read report</span>
                    <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* 3 Secondary Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {secondaryArticles.map((article, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-zinc-200/90 p-6 sm:p-7 flex flex-col justify-between hover:border-zinc-300 transition-all group shadow-xs cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-zinc-500 mb-4">
                    <span className="font-mono">{article.date}</span>
                    <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                      {article.tag}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-zinc-950 tracking-tight group-hover:text-brand-600 transition-colors leading-snug mb-3">
                    {article.title}
                  </h4>
                </div>

                <div className="mt-8 pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                  <span>{article.category}</span>
                  <span className="font-mono">{article.readTime}</span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
