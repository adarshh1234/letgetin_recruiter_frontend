import React, { useState } from 'react';
import { 
  HelpCircle, 
  User, 
  Briefcase, 
  Users, 
  Layers, 
  Building2, 
  KeyRound, 
  Wrench, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Paperclip,
  Search,
  ChevronDown,
  ChevronUp,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface CustomerCarePageProps {
  onOpenDemo?: () => void;
  onNavigate?: (path: string) => void;
}

export const CustomerCarePage: React.FC<CustomerCarePageProps> = ({ onOpenDemo: _onOpenDemo, onNavigate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    accountType: 'Candidate',
    category: 'Technical Issues',
    subject: '',
    message: '',
    attachment: null as File | null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const supportCategories = [
    {
      title: 'Candidate Support',
      desc: 'Assistance with sandbox assessments, APEX skill vectors, reverse bidding profiles, and verification badges.',
      icon: User,
      categoryKey: 'Candidate Support'
    },
    {
      title: 'Employer Support',
      desc: 'Hiring pipeline management, candidate reverse bidding workflows, and candidate interview coordination.',
      icon: Briefcase,
      categoryKey: 'Employer Support'
    },
    {
      title: 'Recruiter Support',
      desc: 'Talent sourcing filters, automated interview intelligence synthesis, and team scorecard calibration.',
      icon: Users,
      categoryKey: 'Recruiter Support'
    },
    {
      title: 'HUREMASO / HRMS Support',
      desc: 'Employee directory configuration, leave & attendance tracking, and HRMS lifecycle integration.',
      icon: Layers,
      categoryKey: 'HUREMASO / HRMS Support'
    },
    {
      title: 'Enterprise Support',
      desc: 'Dedicated account management, custom SLA escalation, SAML SSO integration, and enterprise billing.',
      icon: Building2,
      categoryKey: 'Enterprise Support'
    },
    {
      title: 'Account & Login Support',
      desc: 'Password recovery, two-factor authentication reset, and work email verification.',
      icon: KeyRound,
      categoryKey: 'Account & Login Support'
    },
    {
      title: 'Technical Issues',
      desc: 'Browser sandbox compatibility, runtime execution errors, and platform telemetry troubleshooting.',
      icon: Wrench,
      categoryKey: 'Technical Issues'
    }
  ];

  const faqs = [
    {
      q: 'How does LetGetIn verify candidate skills without a traditional CV?',
      a: 'LetGetIn uses containerized, live technical sandboxes where candidates solve authentic engineering, data, and analytical challenges. Our APEX engine benchmarks execution runtime, architectural decisions, and code efficiency without relying on keyword-stuffed resumes.'
    },
    {
      q: 'How long does a typical skill assessment sandbox take?',
      a: 'Most interactive skill sandboxes are calibrated for 10 to 30 minutes of focused technical execution. Scores are generated immediately upon completion.'
    },
    {
      q: 'How does HUREMASO connect with the recruitment suite?',
      a: 'When an employer extends a direct bid and a candidate accepts, verified sandbox telemetry and profile data are automatically provisioned into HUREMASO with zero manual data re-entry.'
    },
    {
      q: 'Where do I manage my cookie and data privacy preferences?',
      a: 'You can update your cookie preferences at any time via the Cookie Preferences link or by reviewing our Privacy Policy at /privacy.'
    },
    {
      q: 'What are the official customer care response hours?',
      a: 'Our standard customer care team responds Monday through Friday, 8:00 AM – 8:00 PM EST. Enterprise accounts with active SLAs receive priority round-the-clock escalation.'
    }
  ];

  const filteredFaqs = faqs.filter(
    f => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Please enter a subject.';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Please provide details about your issue or question.';
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
    
    // Isolated support submission handler
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        accountType: 'Candidate',
        category: 'Technical Issues',
        subject: '',
        message: '',
        attachment: null
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
              <HelpCircle className="w-3.5 h-3.5 text-[#0066cc]" />
              <span>LETGETIN CUSTOMER CARE</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#061f3d] tracking-[-0.035em] leading-[1.15] mb-6">
              How Can We <span className="text-gradient-blue">Help?</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 leading-relaxed mb-8">
              Find help, contact our support team, or get assistance with your LetGetIn experience.
            </p>

            {/* Quick Link to Internal Docs */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('/help-centre')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-[#0066cc] text-xs font-semibold border border-slate-200 hover:border-sky-200 transition-all cursor-pointer shadow-2xs group"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#0066cc]" />
                <span>Visit Help Centre & Documentation</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0066cc] group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 2. SUPPORT CATEGORIES */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#061f3d] tracking-tight mb-2">
              Select a Support Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Browse tailored resources or quickly prefill your care request.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {supportCategories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, category: cat.categoryKey }));
                    const formEl = document.getElementById('care-form');
                    if (formEl) {
                      formEl.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="bg-white rounded-3xl border border-[#e2edf8] p-6 flex flex-col justify-between hover:border-[#0066cc] hover:shadow-card-clean transition-all cursor-pointer group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#f0f8ff] text-[#0066cc] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-[#061f3d] mb-1.5 group-hover:text-[#0066cc] transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {cat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 3. CONTACT FORM & FAQ SECTION */}
      <section id="care-form" className="py-16 bg-white border-t border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Contact Customer Care Form (7 Cols) */}
            <div className="lg:col-span-7 bg-[#f8fbfe] rounded-3xl border border-[#e2edf8] p-7 sm:p-10 shadow-xs">
              
              {isSuccess ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#061f3d]">
                    Care Request Logged
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Your request has been routed to our customer support team. An agent will review your details and respond to your email.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-[#063970] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  
                  <div>
                    <h3 className="text-xl font-bold text-[#061f3d] mb-1">
                      Contact Customer Care
                    </h3>
                    <p className="text-xs text-slate-500 mb-6">
                      Provide details so our specialized support engineers can resolve your query efficiently.
                    </p>
                  </div>

                  {/* Full Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Taylor Swift"
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 ${
                          errors.fullName
                            ? 'border-rose-300 bg-rose-50/40 focus:ring-rose-200'
                            : 'border-slate-200 bg-white focus:ring-[#0066cc]/20 focus:border-[#0066cc]'
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
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="taylor@example.com"
                        className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 ${
                          errors.email
                            ? 'border-rose-300 bg-rose-50/40 focus:ring-rose-200'
                            : 'border-slate-200 bg-white focus:ring-[#0066cc]/20 focus:border-[#0066cc]'
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

                  {/* Account Type & Issue Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                        Account Type
                      </label>
                      <select
                        value={formData.accountType}
                        onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 focus:border-[#0066cc]"
                      >
                        <option value="Candidate">Candidate</option>
                        <option value="Recruiter">Recruiter</option>
                        <option value="Employer">Employer</option>
                        <option value="Enterprise">Enterprise</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                        Issue Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 focus:border-[#0066cc]"
                      >
                        <option value="Candidate Support">Candidate Support</option>
                        <option value="Employer Support">Employer Support</option>
                        <option value="Recruiter Support">Recruiter Support</option>
                        <option value="HUREMASO / HRMS Support">HUREMASO / HRMS Support</option>
                        <option value="Enterprise Support">Enterprise Support</option>
                        <option value="Account & Login Support">Account & Login Support</option>
                        <option value="Technical Issues">Technical Issues</option>
                      </select>
                    </div>
                  </div>

                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                      Subject <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Summary of your inquiry..."
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.subject
                          ? 'border-rose-300 bg-rose-50/40 focus:ring-rose-200'
                          : 'border-slate-200 bg-white focus:ring-[#0066cc]/20 focus:border-[#0066cc]'
                      }`}
                    />
                    {errors.subject && (
                      <span className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.subject}
                      </span>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please describe what you are experiencing or what assistance you require..."
                      className={`w-full px-4 py-2.5 rounded-xl border text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 ${
                        errors.message
                          ? 'border-rose-300 bg-rose-50/40 focus:ring-rose-200'
                          : 'border-slate-200 bg-white focus:ring-[#0066cc]/20 focus:border-[#0066cc]'
                      }`}
                    />
                    {errors.message && (
                      <span className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.message}
                      </span>
                    )}
                  </div>

                  {/* Optional Attachment */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 font-mono flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                      <span>Optional Screenshot / Log File</span>
                    </label>
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setFormData({ ...formData, attachment: file });
                      }}
                      className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-white file:text-slate-700 hover:file:bg-slate-100 file:border-slate-200 cursor-pointer"
                    />
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
                        <span>Submitting Request...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Request</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                </form>
              )}

            </div>

            {/* Right: FAQ Accordion Section (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-[#061f3d] mb-1">
                  Frequently Asked Questions
                </h3>
                <p className="text-xs text-slate-500">
                  Quick answers to common questions about LetGetIn.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search FAQ..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 focus:border-[#0066cc]"
                />
              </div>

              {/* FAQ Accordions */}
              <div className="space-y-3">
                {filteredFaqs.map((faq, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <div
                      key={i}
                      className="bg-[#f8fbfe] rounded-2xl border border-[#e2edf8] overflow-hidden transition-all"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : i)}
                        className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-[#061f3d] hover:text-[#0066cc] cursor-pointer"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-200/50 pt-3">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Direct Channels Box */}
              <div className="p-5 rounded-2xl bg-[#f0f8ff] border border-[#dbeafe] text-xs text-slate-600 space-y-2">
                <strong className="font-semibold text-[#061f3d] block">Direct Escalation Channels</strong>
                <p>Candidate Support: <span className="font-mono text-[#0066cc]">support@letgetin.com</span></p>
                <p>Enterprise Support: <span className="font-mono text-[#0066cc]">enterprise@letgetin.com</span></p>
                <p>Security Response: <span className="font-mono text-[#0066cc]">security@letgetin.com</span></p>
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
};
