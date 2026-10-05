import React, { useState } from 'react';
import { X, CheckCircle2, Sparkles, ArrowRight, ShieldCheck, Play, Loader2 } from 'lucide-react';
import { leadService } from '../services/lead.service';

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signup' | 'video' | 'enterprise' | 'signin';
}

export const DemoModal: React.FC<DemoModalProps> = ({ isOpen, onClose, mode }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Software Engineering');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      await leadService.submitDemoRequest({
        email: email.trim(),
        role: mode !== 'signin' ? role : undefined,
        mode
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit demo request', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setSubmitted(false);
    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl border border-sky-100 shadow-2xl max-w-lg w-full overflow-hidden relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={handleModalClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-navy-900 hover:bg-sky-50 transition-colors z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Video Demo Mode */}
        {mode === 'video' ? (
          <div className="p-7 sm:p-9">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700 font-mono mb-2">
              <Play className="w-3.5 h-3.5 fill-brand-700" />
              <span>Interactive Platform Tour</span>
            </div>
            <h3 className="text-2xl font-bold text-navy-900 tracking-tight mb-2">
              How LetGetIn Proves Real Skill
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              Watch a 2-minute walkthrough of our adaptive AI assessment sandbox, candidate dimension scoring, and reverse bidding workflow.
            </p>

            <div className="bg-gradient-to-br from-brand-900 to-navy-900 rounded-2xl p-6 text-white aspect-video flex flex-col items-center justify-center relative overflow-hidden shadow-inner group cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-white text-brand-700 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform z-10">
                <Play className="w-7 h-7 fill-brand-700 ml-1" />
              </div>
              <span className="text-xs font-mono text-sky-200 mt-4 z-10">
                Preview Sandbox Simulation (02:45)
              </span>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Zero software installation required</span>
              <button
                type="button"
                onClick={handleModalClose}
                className="font-bold text-brand-700 hover:text-brand-800 cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        ) : submitted ? (
          /* Success State */
          <div className="p-8 sm:p-10 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-navy-900 tracking-tight mb-2">
              You're on the Priority List!
            </h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              We've dispatched your invitation and sandbox credentials to <strong className="text-navy-900">{email || 'your email'}</strong>. Your AI skill verification session is ready to initialize.
            </p>
            <button
              type="button"
              onClick={handleModalClose}
              className="w-full py-3.5 rounded-xl bg-brand-700 text-white text-sm font-bold hover:bg-brand-600 transition-colors shadow-sm cursor-pointer"
            >
              Back to Homepage
            </button>
          </div>
        ) : (
          /* Form Modal */
          <div className="p-7 sm:p-9">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700 font-mono mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {mode === 'enterprise' ? 'Enterprise Access' : mode === 'signin' ? 'Sign In to LetGetIn' : 'Start Proof of Work'}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-navy-900 tracking-tight mb-2">
              {mode === 'enterprise' 
                ? 'Hire Verified Top 5% Talent' 
                : mode === 'signin'
                ? 'Access Your Verified Profile'
                : 'Get In — Start Proving Free'}
            </h3>

            <p className="text-sm text-slate-600 mb-6">
              {mode === 'enterprise'
                ? 'Discover how our 6 Dimensions of Talent cut screening time by 60% with zero CV bias.'
                : mode === 'signin'
                ? 'Sign in to view your live bids, active verification scores, and company offers.'
                : 'Complete a 10-minute adaptive AI session to prove your craft and unlock direct company bids.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                  Work / Personal Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all text-navy-900"
                />
              </div>

              {mode !== 'signin' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                    Primary Discipline
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-600 transition-all text-navy-900 bg-white"
                  >
                    <option>Software Engineering (Full Stack / Systems)</option>
                    <option>AI / Machine Learning & Research</option>
                    <option>Product & UI/UX Design</option>
                    <option>Quantitative Finance & Risk</option>
                    <option>Engineering Management & Product Leadership</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold tracking-tight text-white btn-gradient-blue transition-all flex items-center justify-center gap-2 group mt-2 shadow-sm hover:shadow-blue-glow cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {mode === 'enterprise' ? 'Request Enterprise Walkthrough' : mode === 'signin' ? 'Sign In Securely' : 'Begin Skill Verification'}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero data selling</span>
              </span>
              <span className="font-mono">120k+ Verified</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
