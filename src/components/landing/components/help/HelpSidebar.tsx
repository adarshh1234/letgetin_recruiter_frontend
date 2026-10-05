import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Settings, 
  HelpCircle, 
  ChevronDown, 
  ChevronRight, 
  Home, 
  X,
  FileText
} from 'lucide-react';
import { HELP_CATEGORIES, HelpCategoryItem, HelpArticleItem } from './helpData';

interface HelpSidebarProps {
  activeArticleSlug: string | null;
  onSelectArticle: (articleSlug: string) => void;
  onGoToHome: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const HelpSidebar: React.FC<HelpSidebarProps> = ({
  activeArticleSlug,
  onSelectArticle,
  onGoToHome,
  isOpenMobile = false,
  onCloseMobile
}) => {
  // Track open state for collapsible categories (default: all open)
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategory = (categoryId: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-4 h-4 text-[#0066cc]" />;
      case 'BookOpen':
        return <BookOpen className="w-4 h-4 text-[#0284c7]" />;
      case 'Settings':
        return <Settings className="w-4 h-4 text-[#0369a1]" />;
      case 'HelpCircle':
      default:
        return <HelpCircle className="w-4 h-4 text-[#2563eb]" />;
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Top Sidebar Header */}
      <div className="p-4 border-b border-sky-100 flex items-center justify-between">
        <button
          onClick={() => {
            onGoToHome();
            if (onCloseMobile) onCloseMobile();
          }}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeArticleSlug === null
              ? 'bg-[#0066cc] text-white shadow-xs'
              : 'text-[#061f3d] hover:bg-sky-50'
          }`}
        >
          <Home className={`w-4 h-4 ${activeArticleSlug === null ? 'text-white' : 'text-[#0066cc]'}`} />
          <span>Help Centre Home</span>
        </button>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Categories */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {HELP_CATEGORIES.map((category: HelpCategoryItem) => {
          const isCollapsed = collapsedCategories[category.id];
          const hasActiveChild = category.articles.some(a => a.slug === activeArticleSlug);

          return (
            <div key={category.id} className="space-y-1">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider font-mono transition-colors cursor-pointer ${
                  hasActiveChild ? 'text-[#0066cc] bg-sky-50/50' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {getCategoryIcon(category.iconName)}
                  <span className="truncate">{category.title}</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] text-slate-400 font-normal">
                    {category.articles.length}
                  </span>
                  {isCollapsed ? (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Category Articles */}
              {!isCollapsed && (
                <div className="pl-4 space-y-0.5 pt-0.5">
                  {category.articles.map((article: HelpArticleItem) => {
                    const isActive = activeArticleSlug === article.slug;

                    return (
                      <button
                        key={article.id}
                        onClick={() => {
                          onSelectArticle(article.slug);
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer group ${
                          isActive
                            ? 'bg-sky-50 text-[#0066cc] font-semibold border-l-2 border-[#0066cc] pl-2.5 shadow-2xs'
                            : 'text-slate-600 hover:text-[#061f3d] hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#0066cc]' : 'text-slate-400 group-hover:text-slate-600'}`} />
                          <span className="truncate">{article.title}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sidebar Footer Info */}
      <div className="p-4 border-t border-sky-100 bg-sky-50/40 rounded-b-2xl">
        <div className="text-[11px] text-slate-500 font-medium">
          <p className="font-bold text-[#061f3d] mb-0.5">Need customized assistance?</p>
          <p className="text-[11px] text-slate-500 leading-snug">
            Our support engineers respond in &lt; 2 hours.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden md:block w-72 lg:w-80 shrink-0">
        <div className="sticky top-28 bg-white rounded-2xl border border-sky-100/80 shadow-xs max-h-[calc(100vh-130px)] flex flex-col">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Drawer Body */}
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
