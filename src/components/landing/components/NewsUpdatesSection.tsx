import React from 'react';
import { Star, Sparkles, X } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../constants/landing.constants';

export const NewsUpdatesSection: React.FC = () => {
  return (
    <section id="compare" className="py-20 md:py-28 bg-[#f8fbfe] border-b border-sky-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* "BEYOND A RESUME" Section from Screenshot 5 */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#f0f8ff] border border-[#dbeafe] text-[#0066cc] text-xs font-semibold uppercase tracking-wider mb-4 shadow-2xs">
            <span>WHY LETGETIN</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-[#061f3d] tracking-tight leading-tight mb-4">
            "BEYOND A RESUME"
          </h2>
          <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
            It's a professional identity layer where your actions, verified skills, and community participation are your credentials.
          </p>
        </div>

        {/* Problem vs Solution 2 Cards from Screenshot 5 */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-28">
          
          {/* Others / Problem Card */}
          <div className="bg-white rounded-[2rem] p-7 sm:p-8 border border-[#e2edf8] shadow-2xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                  OT
                </div>
                <h3 className="font-bold text-[#061f3d] text-base">Others</h3>
                <span className="ml-auto text-xs font-semibold text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-full">
                  Problem
                </span>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>"Claims" not proof</strong> — CVs are self-reported</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Spammy feeds,</strong> low engagement</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>No transparency</strong> for candidates</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <X className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span><strong>Hiring bias</strong> from profiles</span>
                </li>
              </ul>
            </div>
          </div>

          {/* LetGetIn / Solution Card (Signature Horizontal Navy -> Bright Blue Gradient) */}
          <div className="card-gradient-blue rounded-[2rem] p-7 sm:p-8 text-white shadow-xl shadow-[#062b63]/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-base">LetGetIn</h3>
                <span className="ml-auto text-xs font-semibold text-emerald-300 bg-white/15 px-2.5 py-0.5 rounded-full">
                  Solution
                </span>
              </div>

              <ul className="space-y-3.5 text-xs sm:text-sm text-white/95">
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full border border-white flex items-center justify-center text-white shrink-0 mt-0.5">
                    <span className="text-[9px] font-bold">✓</span>
                  </div>
                  <span><strong>Verified skill profiles</strong> — AI interviews + portfolios</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full border border-white flex items-center justify-center text-white shrink-0 mt-0.5">
                    <span className="text-[9px] font-bold">✓</span>
                  </div>
                  <span><strong>Gamified challenges</strong> — live events that boost prospects</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full border border-white flex items-center justify-center text-white shrink-0 mt-0.5">
                    <span className="text-[9px] font-bold">✓</span>
                  </div>
                  <span><strong>Live analytics</strong> — views, ranking, improvement tips</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-4 h-4 rounded-full border border-white flex items-center justify-center text-white shrink-0 mt-0.5">
                    <span className="text-[9px] font-bold">✓</span>
                  </div>
                  <span><strong>Blind screening</strong> + bias-detection AI</span>
                </li>
              </ul>
            </div>
          </div>

        </div>

        {/* Testimonials Header from Screenshot 5 */}
        <div id="testimonials" className="pt-6">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#f0f8ff] border border-[#dbeafe] text-[#0066cc] text-xs font-semibold uppercase tracking-wider mb-4 shadow-2xs">
              <span>TESTIMONIALS</span>
            </div>
            <h3 className="font-display text-3xl sm:text-5xl font-extrabold text-[#061f3d] tracking-[-0.035em]">
              Trusted by <span className="text-gradient-blue">Professionals</span> Worldwide
            </h3>
          </div>

          {/* 3 Testimonial Cards from Screenshot 5 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS_DATA.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-[1.75rem] border border-[#e2edf8] p-7 sm:p-8 flex flex-col justify-between shadow-2xs hover:border-[#bae6fd] hover:shadow-[0_10px_25px_rgba(2,132,199,0.06)] transition-all"
              >
                <div>
                  <div className="flex items-center gap-1 mb-5">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed italic mb-8">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#063970] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-bold text-[#061f3d] text-sm">{t.author}</div>
                    <div className="text-xs text-slate-500 font-medium">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
