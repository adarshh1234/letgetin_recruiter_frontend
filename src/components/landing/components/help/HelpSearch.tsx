import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { HelpArticleItem, ALL_HELP_ARTICLES } from './helpData';

interface HelpSearchProps {
  onSelectArticle: (articleSlug: string) => void;
  className?: string;
  placeholder?: string;
}

export const HelpSearch: React.FC<HelpSearchProps> = ({
  onSelectArticle,
  className = '',
  placeholder = 'Search articles, topics, keywords (e.g. APEX, 2FA, bids, payouts)...'
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut (press '/' to focus)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current && !['INPUT', 'TEXTAREA'].includes((document.activeElement?.tagName || ''))) {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter articles based on query
  const filteredArticles = query.trim() === '' 
    ? [] 
    : ALL_HELP_ARTICLES.filter((article: HelpArticleItem) => {
        const q = query.toLowerCase();
        const inTitle = article.title.toLowerCase().includes(q);
        const inDesc = article.description.toLowerCase().includes(q);
        const inCategory = article.categoryTitle.toLowerCase().includes(q);
        const inTags = article.tags.some(t => t.toLowerCase().includes(q));
        const inKeywords = article.keywords.some(k => k.toLowerCase().includes(q));
        const inSummary = article.content.summary.toLowerCase().includes(q);
        return inTitle || inDesc || inCategory || inTags || inKeywords || inSummary;
      });

  const popularSearches = ['APEX Benchmark', 'Direct Company Bids', '2FA Setup', 'Payouts & Stripe', 'AI Interviews', 'Stealth Mode'];

  const handleSelect = (slug: string) => {
    onSelectArticle(slug);
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div ref={searchContainerRef} className={`relative w-full ${className}`}>
      {/* Search Input Box */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400 group-focus-within:text-[#0066cc] transition-colors" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-11 pr-24 py-3 sm:py-3.5 bg-white rounded-2xl border border-sky-100 text-xs sm:text-sm text-[#061f3d] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 focus:border-[#0066cc] shadow-xs hover:border-sky-300/80 transition-all"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
          {query ? (
            <button
              onClick={() => {
                setQuery('');
                inputRef.current?.focus();
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-mono font-medium text-slate-400 bg-slate-100 border border-slate-200 rounded-md">
              /
            </kbd>
          )}
        </div>
      </div>

      {/* Live Dropdown / Modal Results */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-sky-100 shadow-xl z-50 overflow-hidden max-h-[440px] flex flex-col animate-in fade-in-50 zoom-in-95 duration-150">
          {query.trim() === '' ? (
            /* Recent / Popular suggestions when empty query */
            <div className="p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#0066cc]" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Popular Topics
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      inputRef.current?.focus();
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-[#0066cc] border border-slate-200/80 hover:border-sky-200 transition-colors cursor-pointer"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : filteredArticles.length > 0 ? (
            /* Results List */
            <div className="overflow-y-auto divide-y divide-slate-100 max-h-[380px]">
              <div className="px-4 py-2 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between text-[11px] font-medium text-slate-500">
                <span>Found {filteredArticles.length} matching {filteredArticles.length === 1 ? 'article' : 'articles'}</span>
                <span className="font-mono text-[10px]">Select to read</span>
              </div>
              {filteredArticles.map((article: HelpArticleItem) => (
                <button
                  key={article.id}
                  onClick={() => handleSelect(article.slug)}
                  className="w-full text-left p-3.5 sm:p-4 hover:bg-sky-50/60 transition-colors flex items-start justify-between gap-3 group cursor-pointer"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md bg-sky-100/70 text-[#0066cc] font-mono">
                        {article.categoryTitle}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">· {article.readTime}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-[#061f3d] group-hover:text-[#0066cc] transition-colors truncate">
                      {article.title}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {article.description}
                    </p>
                  </div>
                  <div className="pt-1 text-slate-300 group-hover:text-[#0066cc] group-hover:translate-x-0.5 transition-all shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            /* Useful Empty State */
            <div className="p-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-slate-400 mx-auto flex items-center justify-center">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <h4 className="text-sm font-bold text-[#061f3d]">
                No articles matching &ldquo;{query}&rdquo;
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching for alternative keywords like <span className="font-semibold text-slate-700">sandbox</span>, <span className="font-semibold text-slate-700">verification</span>, or <span className="font-semibold text-slate-700">support</span>.
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <button
                  onClick={() => setQuery('')}
                  className="px-3 py-1.5 text-xs font-semibold text-[#0066cc] bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors cursor-pointer"
                >
                  Clear search
                </button>
              </div>
            </div>
          )}

          {/* Bottom Bar Info */}
          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Press ESC to close</span>
            <span className="flex items-center gap-1">
              <span>Navigate with click</span>
              <CornerDownLeft className="w-3 h-3 text-slate-400" />
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
