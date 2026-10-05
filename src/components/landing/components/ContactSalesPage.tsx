import React, { useState } from 'react';
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Zap
} from 'lucide-react';

interface ContactSalesPageProps {
  onOpenDemo?: () => void;
  onNavigate?: (path: string) => void;
}

export const ContactSalesPage: React.FC<ContactSalesPageProps> = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    companyName: '',
    jobTitle: '',
    phoneNumber: '',
    companySize: '51-200 employees',
    areaOfInterest: 'AI Recruitment Suite',
    message: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    }
    if (!formData.workEmail.trim()) {
      newErrors.workEmail = 'Please enter your work email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.workEmail.trim())) {
      newErrors.workEmail = 'Please enter a valid work email (e.g. name@company.com).';
    }
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Please enter your company name.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Simulate enterprise sales lead ingestion
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        fullName: '',
        workEmail: '',
        companyName: '',
        jobTitle: '',
        phoneNumber: '',
        companySize: '51-200 employees',
        areaOfInterest: 'AI Recruitment Suite',
        message: ''
      });
    }, 950);
  };

  return (
    <div className="bg-[#f8fbfe] text-slate-800 font-sans min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-14 md:pt-40 md:pb-20 relative overflow-hidden bg-white border-b border-sky-100">
        <div className="absolute inset-0 screenshot-ambient-glow pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0f8ff] border border-[#dbeafe] text-[#0066cc] text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-[#0066cc]" />
              <span>LETGETIN ENTERPRISE SALES</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#061f3d] tracking-[-0.035em] leading-[1.15] mb-6">
              Let’s Build Your <span className="text-gradient-blue">Future Workforce</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 leading-relaxed mb-8">
              Talk to the LetGetIn team about recruitment, HRMS, Enterprise AI, workforce intelligence, and customized enterprise solutions.
            </p>

          </div>
        </div>
      </section>

      {/* 2. TWO-COLUMN LAYOUT: CONTACT INFO & ENTERPRISE FORM */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Enterprise Contact Info (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-[#061f3d] tracking-tight mb-2">
                  Enterprise Solutions Group
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  Our dedicated solutions architects assist enterprise leaders in configuring zero-bias recruitment workflows and HRMS intelligence.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-[#e2edf8] p-6 sm:p-7 space-y-5 shadow-xs">
                
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#f0f8ff] text-[#0066cc] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-semibold text-slate-400 uppercase">Sales Inquiries</span>
                    <h3 className="text-sm font-bold text-[#061f3d]">sales@letgetin.com</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Enterprise proposals, RFPs, and custom pilot requests.</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-semibold text-slate-400 uppercase">Direct Sales Line</span>
                    <h3 className="text-sm font-bold text-[#061f3d]">+1 (800) LET-GET-IN</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Available Mon – Fri, 8:00 AM – 6:00 PM EST.</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-semibold text-slate-400 uppercase">Global Headquarters</span>
                    <h3 className="text-sm font-bold text-[#061f3d]">San Francisco · New York · London</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Serving enterprise organizations across 150+ countries.</p>
                  </div>
                </div>

              </div>

              {/* Enterprise Guarantee SLA Pill */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-[#061f3d] to-[#08498c] text-white space-y-3 shadow-md">
                <div className="flex items-center gap-2 text-xs font-mono text-sky-300 font-bold uppercase">
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Enterprise SLA Guarantee</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  Enterprise enquiries receive a dedicated solution architect consultation and custom pilot proposal within <strong>2 business hours</strong>.
                </p>
                <div className="flex items-center gap-4 text-[11px] text-sky-200 font-mono pt-2 border-t border-white/15">
                  <span>✓ SOC2 Type II</span>
                  <span>✓ GDPR Compliant</span>
                  <span>✓ Dedicated TAM</span>
                </div>
              </div>

            </div>

            {/* Right: Contact Sales Form (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-[#e2edf8] p-7 sm:p-10 shadow-card-clean">
              
              {isSuccess ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#061f3d]">
                    Thank You for Reaching Out
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Your enterprise consultation request has been dispatched to our sales leadership team. A senior solution architect will reach out to your work email shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-[#063970] text-white text-xs font-bold transition-all shadow-xs"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  
                  <div>
                    <h3 className="text-xl font-bold text-[#061f3d] mb-1">
                      Request Enterprise Consultation
                    </h3>
                    <p className="text-xs text-slate-500 mb-6">
                      Complete the details below to connect with an enterprise account executive.
                    </p>
                  </div>

                  {/* Full Name & Work Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Sarah Jenkins"
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 ${
                          errors.fullName
                            ? 'border-rose-300 bg-rose-50/40 focus:ring-rose-200'
                            : 'border-slate-200 bg-slate-50 focus:bg-white focus:ring-[#0066cc]/20 focus:border-[#0066cc]'
                        }`}
                      />
                      {errors.fullName && (
                        <span className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.fullName}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                        Work Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.workEmail}
                        onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                        placeholder="s.jenkins@enterprise.com"
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 ${
                          errors.workEmail
                            ? 'border-rose-300 bg-rose-50/40 focus:ring-rose-200'
                            : 'border-slate-200 bg-slate-50 focus:bg-white focus:ring-[#0066cc]/20 focus:border-[#0066cc]'
                        }`}
                      />
                      {errors.workEmail && (
                        <span className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.workEmail}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Company Name & Job Title */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                        Company Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="Acme Technologies"
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 ${
                          errors.companyName
                            ? 'border-rose-300 bg-rose-50/40 focus:ring-rose-200'
                            : 'border-slate-200 bg-slate-50 focus:bg-white focus:ring-[#0066cc]/20 focus:border-[#0066cc]'
                        }`}
                      />
                      {errors.companyName && (
                        <span className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.companyName}
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                        Job Title
                      </label>
                      <input
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        placeholder="VP Talent / Head of Engineering"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 focus:border-[#0066cc]"
                      />
                    </div>
                  </div>

                  {/* Phone & Company Size */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 focus:border-[#0066cc]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                        Company Size
                      </label>
                      <select
                        value={formData.companySize}
                        onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 focus:border-[#0066cc]"
                      >
                        <option value="1-50 employees">1 - 50 employees</option>
                        <option value="51-200 employees">51 - 200 employees</option>
                        <option value="201-1,000 employees">201 - 1,000 employees</option>
                        <option value="1,000-5,000 employees">1,000 - 5,000 employees</option>
                        <option value="5,000+ employees">5,000+ employees</option>
                      </select>
                    </div>
                  </div>

                  {/* Area of Interest */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                      Primary Area of Interest <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={formData.areaOfInterest}
                      onChange={(e) => setFormData({ ...formData, areaOfInterest: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 focus:border-[#0066cc]"
                    >
                      <option value="AI Recruitment Suite">AI Recruitment Suite</option>
                      <option value="Enterprise AI">Enterprise AI & Workforce Telemetry</option>
                      <option value="HUREMASO">HUREMASO HRMS Platform</option>
                      <option value="Human Data">Human Data & AI Evaluation</option>
                      <option value="Recruitment">Direct Reverse Bids & Hiring</option>
                      <option value="Other">Custom Enterprise Rollout</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                      Project Scope & Requirements
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your hiring goals, timeline, and candidate requirements..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs sm:text-sm transition-all focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 focus:border-[#0066cc]"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#063970] hover:bg-[#07498c] text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Contact Sales</span>
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
