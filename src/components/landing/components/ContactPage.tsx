import React, { useState } from 'react';
import { 
  MessageSquare, 
  Building2, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  HelpCircle
} from 'lucide-react';

interface ContactPageProps {
  onOpenDemo?: () => void;
  onNavigate?: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'General Enquiry',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g. name@domain.com).';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Please enter a brief subject.';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Please provide your message.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate frontend submission processing
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        category: 'General Enquiry',
        subject: '',
        message: ''
      });
    }, 900);
  };

  return (
    <div className="bg-[#f8fbfe] text-slate-800 font-sans min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-14 md:pt-40 md:pb-20 relative overflow-hidden bg-white border-b border-sky-100">
        <div className="absolute inset-0 screenshot-ambient-glow pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0f8ff] border border-[#dbeafe] text-[#0066cc] text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
              <MessageSquare className="w-3.5 h-3.5 text-[#0066cc]" />
              <span>SUPPORT & PARTNERSHIPS</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#061f3d] tracking-[-0.035em] leading-[1.15] mb-6">
              Get in <span className="text-gradient-blue">Touch</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 leading-relaxed mb-8">
              Have questions about candidate verification, enterprise hiring bids, or technical partnerships? Our team is here to assist you.
            </p>

          </div>
        </div>
      </section>

      {/* 2. CONTACT CHANNELS & FORM GRID */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Contact Information Cards (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#061f3d] tracking-tight mb-2">
                  Contact Channels
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Select the appropriate team for expedited routing.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-[#e2edf8] p-6 sm:p-7 space-y-5 shadow-xs">
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#f0f8ff] text-[#0066cc] flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#061f3d]">Employer & Enterprise Sourcing</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Direct hiring pipelines, ATS sync, and reverse bidding walkthroughs.</p>
                    <span className="text-xs font-mono font-semibold text-[#0066cc] mt-1.5 block">enterprise@letgetin.com</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#061f3d]">Candidate Skill Verification Support</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Assistance with sandbox assessments, APEX scores, and profile verification.</p>
                    <span className="text-xs font-mono font-semibold text-[#0066cc] mt-1.5 block">support@letgetin.com</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#061f3d]">Research & Academic Partnerships</h3>
                    <p className="text-xs text-slate-500 mt-0.5">University guilds, cognitive testing research, and zero-bias studies.</p>
                    <span className="text-xs font-mono font-semibold text-[#0066cc] mt-1.5 block">research@letgetin.com</span>
                  </div>
                </div>

              </div>

              {/* Status Note */}
              <div className="p-4 rounded-2xl bg-[#f0f8ff] border border-[#dbeafe] text-xs text-slate-600 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span>Average support response time: <strong>&lt; 12 hours</strong></span>
              </div>
            </div>

            {/* Right: Contact Form (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-[#e2edf8] p-7 sm:p-10 shadow-card-clean">
              
              {isSuccess ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#061f3d]">
                    Message Received
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out. Your enquiry has been routed to our team and a representative will respond to your email shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-[#063970] text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  
                  <div>
                    <h3 className="text-xl font-bold text-[#061f3d] mb-1">
                      Send Us a Message
                    </h3>
                    <p className="text-xs text-slate-500 mb-6">
                      Fill out the form below and our team will get in touch.
                    </p>
                  </div>

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                        Your Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Alex Morgan"
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 ${
                          errors.name
                            ? 'border-rose-300 bg-rose-50/40 focus:ring-rose-200'
                            : 'border-slate-200 bg-slate-50 focus:bg-white focus:ring-[#0066cc]/20 focus:border-[#0066cc]'
                        }`}
                      />
                      {errors.name && (
                        <span className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.name}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@company.com"
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 ${
                          errors.email
                            ? 'border-rose-300 bg-rose-50/40 focus:ring-rose-200'
                            : 'border-slate-200 bg-slate-50 focus:bg-white focus:ring-[#0066cc]/20 focus:border-[#0066cc]'
                        }`}
                      />
                      {errors.email && (
                        <span className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.email}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Category & Subject */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 focus:border-[#0066cc]"
                      >
                        <option value="General Enquiry">General Enquiry</option>
                        <option value="Employer Access">Employer & Recruiter Access</option>
                        <option value="Candidate Verification">Candidate Verification</option>
                        <option value="Partnership & Guilds">Partnership & Research</option>
                        <option value="Media & Press">Media & Press</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                        Subject <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="Brief summary..."
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 ${
                          errors.subject
                            ? 'border-rose-300 bg-rose-50/40 focus:ring-rose-200'
                            : 'border-slate-200 bg-slate-50 focus:bg-white focus:ring-[#0066cc]/20 focus:border-[#0066cc]'
                        }`}
                      />
                      {errors.subject && (
                        <span className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.subject}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Message Body */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can our team help you?"
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.message
                          ? 'border-rose-300 bg-rose-50/40 focus:ring-rose-200'
                          : 'border-slate-200 bg-slate-50 focus:bg-white focus:ring-[#0066cc]/20 focus:border-[#0066cc]'
                      }`}
                    />
                    {errors.message && (
                      <span className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.message}
                      </span>
                    )}
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#063970] hover:bg-[#07498c] text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Message</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                </form>
              )}

            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
