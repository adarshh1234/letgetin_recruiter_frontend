import React from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Settings, 
  HelpCircle, 
  ArrowRight,
  ChevronRight,
  FileText
} from 'lucide-react';
import { HelpCategoryItem, HelpArticleItem } from './helpData';

interface HelpCategoryCardProps {
  category: HelpCategoryItem;
  onSelectCategory: (categoryId: string) => void;
  onSelectArticle: (articleSlug: string) => void;
}

export const HelpCategoryCard: React.FC<HelpCategoryCardProps> = ({
  category,
  onSelectCategory,
  onSelectArticle
}) => {
  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#0066cc]" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-[#0284c7]" />;
      case 'Settings':
        return <Settings className="w-5 h-5 text-[#0369a1]" />;
      case 'HelpCircle':
      default:
        return <HelpCircle className="w-5 h-5 text-[#2563eb]" />;
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-sky-100/80 p-6 md:p-7 shadow-xs hover:shadow-md hover:border-[#0066cc]/40 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Category Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
            {getCategoryIcon(category.iconName)}
          </div>
          {category.badge && (
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0066cc] border border-sky-200/60 tracking-wide font-mono">
              {category.badge}
            </span>
          )}
        </div>

        {/* Title & Description */}
        <h3 
          onClick={() => onSelectCategory(category.id)}
          className="text-lg font-bold text-[#061f3d] group-hover:text-[#0066cc] transition-colors cursor-pointer mb-2 flex items-center gap-1.5"
        >
          <span>{category.title}</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-5">
          {category.description}
        </p>

        {/* Article Quick Links */}
        <div className="space-y-2 border-t border-slate-100 pt-4 mb-5">
          {category.articles.slice(0, 4).map((article: HelpArticleItem) => (
            <button
              key={article.id}
              onClick={() => onSelectArticle(article.slug)}
              className="w-full text-left flex items-center justify-between py-1.5 px-2 rounded-lg text-xs font-medium text-slate-700 hover:text-[#0066cc] hover:bg-sky-50/70 transition-all group/link cursor-pointer"
            >
              <div className="flex items-center gap-2 truncate pr-2">
                <FileText className="w-3.5 h-3.5 text-slate-400 group-hover/link:text-[#0066cc] shrink-0" />
                <span className="truncate">{article.title}</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover/link:text-[#0066cc] group-hover/link:translate-x-0.5 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Footer link to view all */}
      <div className="pt-2">
        <button
          onClick={() => onSelectCategory(category.id)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0066cc] hover:text-[#07498c] transition-colors cursor-pointer group/btn"
        >
          <span>View all {category.articles.length} guides</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
