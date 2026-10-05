import React from 'react';
import { Star, CheckCircle2 } from 'lucide-react';

export const SocialProofAndPress: React.FC = () => {
  const pressQuotes = [
    {
      source: 'CNBC',
      headline: 'LetGetIn builds the verified talent identity layer, replacing legacy CVs with AI-audited proof of work.',
      tag: 'FINANCIAL MEDIA'
    },
    {
      source: 'Forbes',
      headline: "The next era of hiring: Recruiting domain specialists based on verified sandboxes, not resume pedigree.",
      tag: 'ENTERPRISE TECH'
    },
    {
      source: 'TIME',
      headline: 'How blind AI skill verification is eliminating hiring bias and giving sovereignty back to candidates.',
      tag: 'INNOVATION'
    },
    {
      source: 'Bloomberg',
      headline: 'Frontier talent network connects global engineers to direct enterprise bids across 150+ countries.',
      tag: 'GLOBAL MARKETS'
    }
  ];

  const testimonials = [
    {
      quote: "I got hired in 11 days. The adaptive AI interview was actually fun and rigorous, and for the first time I could see exactly where my skill ranking stood without guessing.",
      author: "Rahul Khanna",
      role: "Senior Data Scientist",
      status: "AI-Verified · Top 2%",
      initials: "RK",
      rating: 5
    },
    {
      quote: "We reduced our technical screening time by 60%. The Pathfinder AI delivers candidates that actually match our architecture and code quality standards on day one.",
      author: "Sarah Mitchell",
      role: "VP Talent & Eng Operations",
      status: "Enterprise Hiring Partner",
      initials: "SM",
      rating: 5
    },
    {
      quote: "The community and proof layer are incredible. I found high-leverage collaborators, proved my design craft through the 6 Dimensions, and got 3 direct bids without sending a single CV.",
      author: "Amara Okafor",
      role: "Principal Product Designer",
      status: "Verified Guild Fellow · Lagos",
      initials: "AO",
      rating: 5
    }
  ];

  return (
    <section id="why-letgetin" className="py-20 md:py-28 bg-[#fafafa] border-b border-zinc-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Press & Media Quotes - Mercor Page 6 Style */}
        <div className="mb-20 pb-16 border-b border-zinc-200">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 font-mono">
              PRESS & INDUSTRY RECOGNITION
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pressQuotes.map((press, i) => (
              <div key={i} className="flex flex-col justify-between p-6 rounded-2xl bg-white border border-zinc-200/90 shadow-2xs hover:border-zinc-300 transition-all">
                <div>
                  <div className="font-display font-black text-2xl tracking-tighter text-zinc-950 mb-3">
                    {press.source}
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed font-medium">
                    "{press.headline}"
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-zinc-100 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                  <span>{press.tag}</span>
                  <span>2026</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-800 text-xs font-semibold uppercase tracking-wider mb-3">
            <Star className="w-3 h-3 text-brand-600 fill-brand-600" />
            <span>TESTIMONIALS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
            Trusted by Professionals Worldwide
          </h2>
          <p className="text-sm sm:text-base text-zinc-500 mt-2">
            Real outcomes from verified engineers, designers, and hiring leaders.
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-zinc-200/90 p-7 sm:p-8 flex flex-col justify-between shadow-2xs hover:shadow-xs transition-all"
            >
              <div>
                {/* 5 stars */}
                <div className="flex items-center gap-1 mb-5">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-zinc-700 leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              {/* Author info */}
              <div className="pt-4 border-t border-zinc-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-zinc-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {t.initials}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-zinc-900 text-sm">{t.author}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
                  </div>
                  <div className="text-xs text-zinc-500 font-medium">{t.role}</div>
                  <div className="text-[11px] text-brand-700 font-mono mt-0.5">{t.status}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
