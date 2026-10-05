import React from 'react';
import { ArrowRight, UserCheck, Building2, Cpu, CheckCircle } from 'lucide-react';

interface SolutionsGridProps {
  onOpenDemo: () => void;
  onOpenEnterprise: () => void;
}

export const SolutionsGrid: React.FC<SolutionsGridProps> = ({ onOpenDemo, onOpenEnterprise }) => {
  const solutions = [
    {
      icon: UserCheck,
      category: 'FOR TALENT',
      title: 'Prove your craft & let companies bid for you',
      description: 'Stop sending hundreds of unread resumes. Build an AI-verified proof-of-work portfolio and receive direct offers from premier tech teams.',
      bullets: [
        '120k+ peers in specialized engineering and design guilds',
        'Adaptive 10-minute AI interview replaces repetitive screens',
        'Real-time market compensation benchmarks and bidding',
      ],
      ctaText: 'Start Verification',
      action: onOpenDemo,
      isPrimary: false,
    },
    {
      icon: Building2,
      category: 'FOR ENTERPRISES',
      title: 'Hire verified top 5% talent with zero CV noise',
      description: 'Cut hiring latency from 25 days to 1.2 days. Access pre-audited candidates scored across the 6 Dimensions of Talent with pure merit screening.',
      bullets: [
        'Eliminate 80% screening overhead with verified proof of work',
        'Demographic-masked evaluation for true zero-bias merit',
        'Direct autonomous scheduling & structured offer alignment',
      ],
      ctaText: 'Book Enterprise Demo',
      action: onOpenEnterprise,
      isPrimary: true,
    },
    {
      icon: Cpu,
      category: 'FOR AI LABS & RESEARCH',
      title: 'Expert evaluation & frontier benchmarks',
      description: 'Power next-generation frontier AI models with rigorously evaluated domain experts across software, medicine, finance, and engineering.',
      bullets: [
        'Access top domain experts for complex RLHF and evaluations',
        'APEX-style task environments and benchmark verification',
        'Automated anonymization and enterprise-grade privacy',
      ],
      ctaText: 'Partner with LetGetIn',
      action: onOpenEnterprise,
      isPrimary: false,
    },
  ];

  return (
    <section id="solutions" className="py-20 md:py-28 bg-[#fafafa] border-b border-zinc-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 font-mono">
            ECOSYSTEM SOLUTIONS
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 tracking-tight leading-tight mt-2 mb-4">
            Built for individuals.<br />
            Engineered for modern enterprise teams.
          </h2>
          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed">
            LetGetIn connects verified talent, autonomous matching agents, and forward-thinking engineering organizations.
          </p>
        </div>

        {/* 3 Prominent Columns - Mercor Page 4 Aesthetic */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {solutions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`rounded-2xl border p-8 sm:p-9 flex flex-col justify-between transition-all duration-200 ${
                  item.isPrimary
                    ? 'bg-white border-brand-300 shadow-md ring-1 ring-brand-500/20'
                    : 'bg-white border-zinc-200/90 hover:border-zinc-300 hover:shadow-xs'
                }`}
              >
                <div>
                  {/* Top Icon Artwork & Category */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      item.isPrimary ? 'bg-brand-50 text-brand-600' : 'bg-zinc-100 text-zinc-700'
                    }`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-zinc-400">
                      {item.category}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-zinc-950 tracking-tight mb-3 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* Bullet points */}
                  <div className="space-y-3 pt-2 border-t border-zinc-100">
                    {item.bullets.map((b, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-700">
                        <CheckCircle className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom CTA Button */}
                <div className="mt-8 pt-6 border-t border-zinc-100">
                  <button
                    onClick={item.action}
                    className={`w-full py-3 px-4 rounded-xl text-sm font-semibold tracking-tight flex items-center justify-center gap-2 transition-all ${
                      item.isPrimary
                        ? 'bg-zinc-950 text-white hover:bg-zinc-800 shadow-xs'
                        : 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200/80 border border-zinc-200'
                    }`}
                  >
                    <span>{item.ctaText}</span>
                    <ArrowRight className="w-4 h-4 opacity-80" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
