import React, { useState } from 'react';
import { 
  FileText, 
  ArrowUp, 
  AlertTriangle, 
  ChevronRight,
  Scale
} from 'lucide-react';

interface TermsOfServicePageProps {
  onOpenDemo?: () => void;
  onNavigate?: (path: string) => void;
}

export const TermsOfServicePage: React.FC<TermsOfServicePageProps> = () => {
  const [activeSection, setActiveSection] = useState<string>('intro');

  const sections = [
    { id: 'intro', num: '1', title: 'Introduction' },
    { id: 'eligibility', num: '2', title: 'Eligibility' },
    { id: 'registration', num: '3', title: 'Account Registration' },
    { id: 'user-responsibilities', num: '4', title: 'User Responsibilities' },
    { id: 'candidate-responsibilities', num: '5', title: 'Candidate Responsibilities' },
    { id: 'employer-responsibilities', num: '6', title: 'Employer & Recruiter Responsibilities' },
    { id: 'job-listings', num: '7', title: 'Job Listings & Reverse Bids' },
    { id: 'applications', num: '8', title: 'Applications & Evaluations' },
    { id: 'networking', num: '9', title: 'Networking Features' },
    { id: 'ai-features', num: '10', title: 'AI-Powered Features' },
    { id: 'hrms-services', num: '11', title: 'HUREMASO HRMS Services' },
    { id: 'ugc', num: '12', title: 'User-Generated Content' },
    { id: 'ip', num: '13', title: 'Intellectual Property' },
    { id: 'prohibited', num: '14', title: 'Prohibited Activities' },
    { id: 'third-party', num: '15', title: 'Third-Party Services' },
    { id: 'availability', num: '16', title: 'Service Availability' },
    { id: 'disclaimers', num: '17', title: 'Disclaimers' },
    { id: 'liability', num: '18', title: 'Limitation of Liability' },
    { id: 'indemnification', num: '19', title: 'Indemnification' },
    { id: 'termination', num: '20', title: 'Termination' },
    { id: 'changes', num: '21', title: 'Changes to Terms' },
    { id: 'governing-law', num: '22', title: 'Governing Law & Jurisdiction' },
    { id: 'contact', num: '23', title: 'Contact Information' },
  ];

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-[#f8fbfe] text-slate-800 font-sans min-h-screen">
      
      {/* 1. HERO HEADER */}
      <section className="pt-32 pb-12 md:pt-40 md:pb-16 relative bg-white border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f0f8ff] border border-[#dbeafe] text-[#0066cc] text-xs font-mono font-bold uppercase tracking-wider mb-4">
              <Scale className="w-3.5 h-3.5 text-[#0066cc]" />
              <span>TERMS OF AGREEMENT</span>
            </div>
            
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#061f3d] tracking-tight mb-4">
              Terms of Service
            </h1>
            
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
              These Terms of Service govern your access to and use of LetGetIn, our AI evaluation sandboxes, reverse talent marketplace, and HUREMASO HRMS ecosystem.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500">
              <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                Last Updated: September 2026
              </span>
              <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                Version 3.1
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LEGAL REVIEW NOTICE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-semibold block text-amber-950">Legal Framework Advisory</strong>
            <p className="text-amber-800 leading-relaxed text-xs">
              This document outlines the standard contractual structure for LetGetIn. Placeholders marked with brackets (e.g. <code>[LetGetIn Legal Entity Name]</code>, <code>[Governing Jurisdiction]</code>) should be finalized by corporate legal counsel prior to formal publication.
            </p>
          </div>
        </div>
      </div>

      {/* 3. 2-COLUMN TERMS DOCUMENT */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left: Sticky Table of Contents (4 Cols) */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 bg-white rounded-2xl border border-[#e2edf8] p-5 shadow-xs max-h-[calc(100vh-8rem)] overflow-y-auto hidden lg:block">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 text-xs font-bold text-[#061f3d] uppercase tracking-wider font-mono">
                <FileText className="w-4 h-4 text-[#0066cc]" />
                <span>Sections ({sections.length})</span>
              </div>
              
              <nav className="space-y-1">
                {sections.map((sec) => (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                      activeSection === sec.id
                        ? 'bg-[#f0f8ff] text-[#0066cc] font-bold border border-[#dbeafe]'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <span className="truncate">
                      <span className="font-mono text-slate-400 mr-2">{sec.num}.</span>
                      {sec.title}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0" />
                  </button>
                ))}
              </nav>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <button
                  onClick={scrollToTop}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Back to Top</span>
                </button>
              </div>
            </aside>

            {/* Right: Terms Document Body (8 Cols) */}
            <article className="lg:col-span-8 bg-white rounded-3xl border border-[#e2edf8] p-6 sm:p-10 shadow-xs space-y-12 leading-relaxed text-slate-700 text-sm">
              
              {/* 1. Introduction */}
              <section id="intro" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  1. Introduction
                </h2>
                <p>
                  These Terms of Service ("Terms") constitute a legally binding agreement between you ("User", "you", or "your") and <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-800">[LetGetIn Legal Entity Name]</span> ("LetGetIn", "Company", "we", "us", or "our").
                </p>
                <p>
                  By registering an account, completing technical assessments, posting hiring requisitions, or accessing any part of the LetGetIn web applications or HUREMASO HRMS software, you agree to be bound by these Terms and our Privacy Policy.
                </p>
              </section>

              {/* 2. Eligibility */}
              <section id="eligibility" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  2. Eligibility
                </h2>
                <p>
                  You must be at least 18 years of age (or the legal age of majority in your jurisdiction) to use our Services. By accessing LetGetIn, you represent and warrant that you have the legal capacity and authority to enter into these Terms.
                </p>
              </section>

              {/* 3. Account Registration */}
              <section id="registration" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  3. Account Registration
                </h2>
                <p>
                  Users must provide accurate, current, and complete information during registration. You are responsible for safeguarding your credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized access.
                </p>
              </section>

              {/* 4. User Responsibilities */}
              <section id="user-responsibilities" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  4. User Responsibilities
                </h2>
                <p>
                  All users agree to interact respectfully and maintain professional conduct. You agree not to misrepresent your identity, credentials, employment history, or company affiliations.
                </p>
              </section>

              {/* 5. Candidate Responsibilities */}
              <section id="candidate-responsibilities" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  5. Candidate Responsibilities
                </h2>
                <p>
                  Candidates participating in LetGetIn technical sandboxes and skill assessments agree to complete evaluations independently without unauthorized third-party intervention, automated scripting, or plagiarism. Verified skill vectors are awarded based on authentic runtime proof of work.
                </p>
              </section>

              {/* 6. Employer/Recruiter Responsibilities */}
              <section id="employer-responsibilities" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  6. Employer/Recruiter Responsibilities
                </h2>
                <p>
                  Employers and recruiting representatives agree to post authentic, lawful employment opportunities with genuine compensation ranges. Employers shall not solicit fees, illegal payments, or confidential personal data from candidates during evaluation.
                </p>
              </section>

              {/* 7. Job Listings & Reverse Bids */}
              <section id="job-listings" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  7. Job Listings & Reverse Bids
                </h2>
                <p>
                  LetGetIn provides a direct reverse bidding marketplace where verified candidates may receive direct company offers. While we verify technical competencies through sandboxes, LetGetIn does not act as an employer of record unless explicitly contracted under a separate enterprise master services agreement.
                </p>
              </section>

              {/* 8. Applications & Evaluations */}
              <section id="applications" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  8. Applications & Evaluations
                </h2>
                <p>
                  Submission of an application or assessment does not guarantee employment or candidate engagement. Hiring decisions remain the sole discretion of prospective employers.
                </p>
              </section>

              {/* 9. Networking Features */}
              <section id="networking" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  9. Networking Features
                </h2>
                <p>
                  LetGetIn may provide messaging, guild collaborations, and referral networks. Unsolicited commercial advertising, spamming, harassment, or predatory recruitment behavior is strictly prohibited.
                </p>
              </section>

              {/* 10. AI-Powered Features */}
              <section id="ai-features" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  10. AI-Powered Features
                </h2>
                <p>
                  LetGetIn utilizes artificial intelligence to assist in candidate discovery, automated test synthesis, and semantic skill alignment. Our AI systems operate as decision-support tools; final hiring, promotion, and termination determinations remain with human decision-makers.
                </p>
              </section>

              {/* 11. HRMS Services (HUREMASO) */}
              <section id="hrms-services" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  11. HRMS Services (HUREMASO)
                </h2>
                <p>
                  For organizations subscribing to HUREMASO, access to employee record management, leave tracking, and workforce telemetry is governed by the organization’s enterprise agreement. Enterprise administrators are responsible for configuring appropriate role-based permissions for their personnel.
                </p>
              </section>

              {/* 12. User-Generated Content */}
              <section id="ugc" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  12. User-Generated Content
                </h2>
                <p>
                  You retain ownership of code snippets, articles, or profile media you post on LetGetIn. By submitting content, you grant LetGetIn a non-exclusive, worldwide, royalty-free license to host, evaluate, and display such content solely for the purpose of operating the Services.
                </p>
              </section>

              {/* 13. Intellectual Property */}
              <section id="ip" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  13. Intellectual Property
                </h2>
                <p>
                  The LetGetIn platform, APEX verification engine, HUREMASO branding, UI designs, code sandboxes, and logos are the proprietary property of LetGetIn. You may not copy, reverse engineer, or decompile any part of the platform without prior written consent.
                </p>
              </section>

              {/* 14. Prohibited Activities */}
              <section id="prohibited" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  14. Prohibited Activities
                </h2>
                <p>Users shall not:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Deploy automated scrapers, bots, or spiders to harvest candidate data.</li>
                  <li>Circumvent or attempt to tamper with sandbox evaluation scoring mechanisms.</li>
                  <li>Introduce malware, viruses, or malicious payloads into code execution sandboxes.</li>
                  <li>Impersonate another person, employer, or hiring entity.</li>
                </ul>
              </section>

              {/* 15. Third-Party Services */}
              <section id="third-party" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  15. Third-Party Services
                </h2>
                <p>
                  We are not responsible for third-party websites, ATS integrations, or external developer repositories linked through the Services.
                </p>
              </section>

              {/* 16. Service Availability */}
              <section id="availability" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  16. Service Availability
                </h2>
                <p>
                  We endeavor to maintain high platform availability; however, we do not warrant that the Services will be uninterrupted, error-free, or free of scheduled maintenance downtime.
                </p>
              </section>

              {/* 17. Disclaimers */}
              <section id="disclaimers" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  17. Disclaimers
                </h2>
                <p className="uppercase text-xs font-mono text-slate-600">
                  THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
                </p>
              </section>

              {/* 18. Limitation of Liability */}
              <section id="liability" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  18. Limitation of Liability
                </h2>
                <p className="uppercase text-xs font-mono text-slate-600">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, LETGETIN SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR LOSS OF PROFITS, DATA, OR GOODWILL ARISING FROM YOUR USE OF THE SERVICES.
                </p>
              </section>

              {/* 19. Indemnification */}
              <section id="indemnification" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  19. Indemnification
                </h2>
                <p>
                  You agree to defend, indemnify, and hold harmless LetGetIn, its officers, directors, and employees against any claims, liabilities, damages, or expenses arising from your violation of these Terms or misuse of the Services.
                </p>
              </section>

              {/* 20. Termination */}
              <section id="termination" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  20. Termination
                </h2>
                <p>
                  We reserve the right to suspend or terminate your account at any time for violation of these Terms, fraudulent activity, or conduct harmful to the LetGetIn community.
                </p>
              </section>

              {/* 21. Changes to Terms */}
              <section id="changes" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  21. Changes to Terms
                </h2>
                <p>
                  We may revise these Terms from time to time. Continued use of the Services after revisions become effective constitutes your acceptance of the revised Terms.
                </p>
              </section>

              {/* 22. Governing Law & Jurisdiction */}
              <section id="governing-law" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  22. Governing Law & Jurisdiction
                </h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-800">[Governing Jurisdiction / Applicable State or Country Placeholder]</span>, without regard to its conflict of law principles.
                </p>
              </section>

              {/* 23. Contact Information */}
              <section id="contact" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  23. Contact Information
                </h2>
                <p>
                  For inquiries regarding these Terms of Service, please contact our legal counsel:
                </p>
                <div className="bg-[#f8fbfe] border border-[#e2edf8] rounded-2xl p-5 space-y-2 text-xs font-mono">
                  <div><strong>Legal Entity:</strong> <span className="text-slate-600">[LetGetIn Legal Entity Name]</span></div>
                  <div><strong>Legal Department:</strong> <span className="text-[#0066cc]">[legal@letgetin.com]</span></div>
                  <div><strong>Corporate Office:</strong> <span className="text-slate-600">[Corporate Office Address Placeholder]</span></div>
                </div>
              </section>

            </article>

          </div>

        </div>
      </section>

    </div>
  );
};
