import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  Calendar, 
  ThumbsUp, 
  ThumbsDown, 
  CheckCircle2, 
  Info, 
  AlertTriangle, 
  Lightbulb, 
  ArrowLeft,
  Share2,
  MessageSquare
} from 'lucide-react';
import { HelpArticleItem, ALL_HELP_ARTICLES } from './helpData';

interface HelpArticleProps {
  article: HelpArticleItem;
  onSelectArticle: (articleSlug: string) => void;
  onGoBack: () => void;
  onOpenSupportModal?: () => void;
  onNavigate?: (path: string) => void;
}

export const HelpArticle: React.FC<HelpArticleProps> = ({
  article,
  onSelectArticle,
  onGoBack,
  onNavigate
}) => {
  const [feedbackGiven, setFeedbackGiven] = useState<'yes' | 'no' | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Find previous and next articles in the global article list
  const currentIndex = ALL_HELP_ARTICLES.findIndex(a => a.id === article.id);
  const prevArticle = currentIndex > 0 ? ALL_HELP_ARTICLES[currentIndex - 1] : null;
  const nextArticle = currentIndex < ALL_HELP_ARTICLES.length - 1 ? ALL_HELP_ARTICLES[currentIndex + 1] : null;

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const renderCallout = (callout: { type: 'info' | 'tip' | 'warning' | 'success'; text: string }) => {
    const styles = {
      info: 'bg-sky-50 border-sky-200 text-sky-900',
      tip: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      warning: 'bg-amber-50 border-amber-200 text-amber-900',
      success: 'bg-teal-50 border-teal-200 text-teal-900'
    };

    const icons = {
      info: <Info className="w-4 h-4 text-[#0066cc] shrink-0 mt-0.5" />,
      tip: <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />,
      warning: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />,
      success: <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
    };

    return (
      <div className={`p-4 rounded-xl border flex items-start gap-3 my-4 ${styles[callout.type]}`}>
        {icons[callout.type]}
        <p className="text-xs sm:text-sm font-medium leading-relaxed">
          {callout.text}
        </p>
      </div>
    );
  };

  return (
    <article className="bg-white rounded-3xl border border-sky-100/80 p-6 sm:p-8 md:p-10 shadow-xs animate-in fade-in duration-200">
      {/* Top Breadcrumb & Back button */}
      <div className="flex items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
        <button
          onClick={onGoBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0066cc] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to all guides</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-medium transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Article Header */}
      <div className="space-y-3 mb-8">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0066cc] text-[11px] font-bold font-mono border border-sky-200/60 uppercase tracking-wide">
            {article.categoryTitle}
          </span>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
            <Clock className="w-3 h-3" />
            <span>{article.readTime}</span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
            <Calendar className="w-3 h-3" />
            <span>Updated {article.lastUpdated}</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#061f3d] tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          {article.description}
        </p>
      </div>

      {/* Summary Box */}
      {article.content.summary && (
        <div className="p-5 rounded-2xl bg-[#f8fbfe] border border-sky-100/90 text-xs sm:text-sm text-slate-700 leading-relaxed mb-8">
          <strong className="font-semibold text-[#061f3d] block mb-1">Quick Summary</strong>
          <p>{article.content.summary}</p>
        </div>
      )}

      {/* Main Structured Content Sections */}
      <div className="space-y-8 text-slate-700 text-xs sm:text-sm leading-relaxed border-b border-slate-100 pb-10">
        {article.content.sections.map((sec, idx) => (
          <section key={idx} className="space-y-3.5">
            <h2 className="text-lg sm:text-xl font-bold text-[#061f3d] tracking-tight">
              {sec.heading}
            </h2>

            {sec.body.map((p, pIdx) => (
              <p key={pIdx} className="text-slate-600">
                {p}
              </p>
            ))}

            {sec.callout && renderCallout(sec.callout)}

            {sec.bullets && sec.bullets.length > 0 && (
              <ul className="space-y-2 pl-2">
                {sec.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0066cc] mt-2 shrink-0" />
                    <span className="text-slate-600">{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {sec.steps && sec.steps.length > 0 && (
              <div className="space-y-3 my-4 pl-1">
                {sec.steps.map((step) => (
                  <div key={step.stepNumber} className="flex items-start gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                    <span className="w-6 h-6 rounded-full bg-[#0066cc] text-white text-xs font-bold font-mono flex items-center justify-center shrink-0">
                      {step.stepNumber}
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#061f3d] mb-0.5">
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {step.details}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Tags */}
      {article.tags.length > 0 && (
        <div className="pt-6 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Tags:</span>
          {article.tags.map((tag) => (
            <span key={tag} className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Helpful Feedback Widget */}
      <div className="my-8 p-6 rounded-2xl bg-[#f8fbfe] border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-[#061f3d]">
            Was this article helpful?
          </h4>
          <p className="text-xs text-slate-500">
            Your feedback helps us refine and improve our technical guides.
          </p>
        </div>

        {feedbackGiven ? (
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200">
            <CheckCircle2 className="w-4 h-4" />
            <span>Thank you for your feedback!</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFeedbackGiven('yes')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-sky-50 border border-slate-200 text-xs font-bold text-slate-700 hover:text-[#0066cc] transition-colors cursor-pointer"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-slate-400 hover:text-[#0066cc]" />
              <span>Yes</span>
            </button>
            <button
              onClick={() => setFeedbackGiven('no')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-rose-50 border border-slate-200 text-xs font-bold text-slate-700 hover:text-rose-600 transition-colors cursor-pointer"
            >
              <ThumbsDown className="w-3.5 h-3.5 text-slate-400 hover:text-rose-600" />
              <span>No</span>
            </button>
          </div>
        )}
      </div>

      {/* Prev / Next Article Pagination Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
        {prevArticle ? (
          <button
            onClick={() => onSelectArticle(prevArticle.slug)}
            className="p-4 rounded-2xl border border-slate-200 hover:border-[#0066cc]/40 hover:bg-sky-50/50 transition-all text-left flex flex-col justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400 uppercase font-mono mb-1">
              <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Previous Guide</span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#061f3d] group-hover:text-[#0066cc] transition-colors line-clamp-1">
              {prevArticle.title}
            </span>
          </button>
        ) : <div />}

        {nextArticle ? (
          <button
            onClick={() => onSelectArticle(nextArticle.slug)}
            className="p-4 rounded-2xl border border-slate-200 hover:border-[#0066cc]/40 hover:bg-sky-50/50 transition-all text-right flex flex-col justify-between cursor-pointer group sm:col-start-2"
          >
            <div className="flex items-center justify-end gap-1 text-[11px] font-bold text-slate-400 uppercase font-mono mb-1">
              <span>Next Guide</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-[#061f3d] group-hover:text-[#0066cc] transition-colors line-clamp-1">
              {nextArticle.title}
            </span>
          </button>
        ) : <div />}
      </div>

      {/* Still need help banner */}
      <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-[#062447] to-[#07498c] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h4 className="text-sm sm:text-base font-bold text-white">
            Still have questions or need specialized help?
          </h4>
          <p className="text-xs text-sky-200">
            Reach out to our customer care team or file a ticket directly.
          </p>
        </div>
        <button
          onClick={() => {
            if (onNavigate) {
              onNavigate('/customer-care');
            }
          }}
          className="px-4 py-2.5 rounded-xl bg-white text-[#061f3d] hover:bg-sky-50 text-xs font-bold transition-all shrink-0 cursor-pointer shadow-xs flex items-center gap-1.5"
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#0066cc]" />
          <span>Contact Customer Care</span>
        </button>
      </div>
    </article>
  );
};
