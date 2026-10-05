import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from './ui/Button';

interface FinalCTAProps {
  onOpenDemo: () => void;
  onOpenEnterprise: () => void;
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onOpenDemo, onOpenEnterprise }) => {
  return (
    <section className="py-24 md:py-32 bg-gradient-to-r from-[#062b63] via-[#07498c] to-[#087bc1] text-white relative overflow-hidden">
      {/* Subtle atmospheric center glow from PDF Page 6 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-brand-400/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        
        {/* Badge from PDF Page 6 */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold uppercase tracking-wider mb-8 backdrop-blur-md shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Join 120,000+ professionals</span>
        </div>

        {/* Big Headline from PDF Page 6 */}
        <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tighter leading-tight mb-6 text-white font-display">
          Ready to Get In?
        </h2>

        {/* Subtitle from PDF Page 6 */}
        <p className="text-base sm:text-xl text-sky-100 max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
          Stop claiming. Start proving. Join the network where your verified skills, not your CV, define your future.
        </p>

        {/* CTA Buttons from PDF Page 6 */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <Button
            onClick={onOpenDemo}
            variant="white"
            size="lg"
            className="group"
          >
            <span>Get In — Free</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform text-[#0066cc]" />
          </Button>

          <Button
            onClick={onOpenEnterprise}
            variant="secondary"
            size="lg"
            icon={<ShieldCheck className="w-4 h-4 text-sky-200" />}
          >
            <span>Learn More</span>
          </Button>
        </div>

        {/* Micro-assurances from PDF Page 6 */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-sky-200 font-mono">
          <span>No credit card required</span>
          <span>•</span>
          <span>Free forever for individuals</span>
          <span>•</span>
          <span>Instant 10-minute AI skill evaluation</span>
        </div>

      </div>
    </section>
  );
};
