import React, { useState } from 'react';
import { 
  Shield, 
  ArrowUp, 
  FileText, 
  AlertTriangle, 
  ChevronRight
} from 'lucide-react';

interface PrivacyPolicyPageProps {
  onOpenDemo?: () => void;
  onNavigate?: (path: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = () => {
  const [activeSection, setActiveSection] = useState<string>('intro');

  const sections = [
    { id: 'intro', num: '1', title: 'Introduction' },
    { id: 'info-collect', num: '2', title: 'Information We Collect' },
    { id: 'info-provided', num: '3', title: 'Information You Provide' },
    { id: 'info-auto', num: '4', title: 'Information Collected Automatically' },
    { id: 'how-use', num: '5', title: 'How We Use Information' },
    { id: 'how-share', num: '6', title: 'How We Share Information' },
    { id: 'cookies', num: '7', title: 'Cookies and Similar Technologies' },
    { id: 'storage-security', num: '8', title: 'Data Storage and Security' },
    { id: 'retention', num: '9', title: 'Data Retention' },
    { id: 'user-rights', num: '10', title: 'User Rights and Choices' },
    { id: 'account-info', num: '11', title: 'Account Information' },
    { id: 'communications', num: '12', title: 'Communications' },
    { id: 'third-party', num: '13', title: 'Third-Party Services' },
    { id: 'children', num: '14', title: "Children's Privacy" },
    { id: 'transfers', num: '15', title: 'International Data Transfers' },
    { id: 'changes', num: '16', title: 'Changes to This Privacy Policy' },
    { id: 'contact', num: '17', title: 'Contact Us' },
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
              <Shield className="w-3.5 h-3.5 text-[#0066cc]" />
              <span>LEGAL GOVERNANCE</span>
            </div>
            
            <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#061f3d] tracking-tight mb-4">
              Privacy Policy
            </h1>
            
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
              This Privacy Policy explains how LetGetIn collects, uses, protects, and discloses personal information when you use our platform, skill verification sandboxes, HRMS services, and associated enterprise offerings.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500">
              <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                Last Updated: September 2026
              </span>
              <span className="bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                Version 2.4
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LEGAL REVIEW ADVISORY NOTICE */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-semibold block text-amber-950">Legal Notice & Compliance Disclaimer</strong>
            <p className="text-amber-800 leading-relaxed text-xs">
              This document represents LetGetIn’s operational privacy framework. Bracketed parameters such as <code>[LetGetIn Legal Entity Name]</code>, <code>[Corporate Office Address]</code>, and specific regional disclosures must be finalized and reviewed by qualified legal counsel prior to formal statutory filing.
            </p>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT: 2-COLUMN DOCUMENT LAYOUT */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Sticky Table of Contents (4 Cols) */}
            <aside className="lg:col-span-4 lg:sticky lg:top-28 bg-white rounded-2xl border border-[#e2edf8] p-5 shadow-xs max-h-[calc(100vh-8rem)] overflow-y-auto hidden lg:block">
              <div className="flex items-center gap-2 pb-3 mb-3 border-b border-slate-100 text-xs font-bold text-[#061f3d] uppercase tracking-wider font-mono">
                <FileText className="w-4 h-4 text-[#0066cc]" />
                <span>Table of Contents</span>
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

            {/* Right Column: Policy Document Body (8 Cols) */}
            <article className="lg:col-span-8 bg-white rounded-3xl border border-[#e2edf8] p-6 sm:p-10 shadow-xs space-y-12 leading-relaxed text-slate-700 text-sm">
              
              {/* 1. Introduction */}
              <section id="intro" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  1. Introduction
                </h2>
                <p>
                  Welcome to LetGetIn (operated by <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-800">[LetGetIn Legal Entity Name]</span>, "we", "us", or "our"). LetGetIn is a professional platform designed to verify skills, eliminate hiring bias, and facilitate direct connections between talent and enterprise organizations.
                </p>
                <p>
                  This Privacy Policy describes our practices regarding the collection, processing, storage, and transfer of personal data when you interact with our websites, APIs, technical sandboxes, recruitment tools, and HUREMASO HRMS software (collectively, the "Services").
                </p>
                <p>
                  By accessing or using our Services, you acknowledge that you have read and understood this Privacy Policy. If you do not agree with our policies and practices, please do not use our Services.
                </p>
              </section>

              {/* 2. Information We Collect */}
              <section id="info-collect" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  2. Information We Collect
                </h2>
                <p>
                  We collect information necessary to provide verified skill assessments, power direct company bidding, manage employee lifecycles in HUREMASO, and safeguard platform integrity. We categorize collected information into data you provide directly and data collected automatically.
                </p>
              </section>

              {/* 3. Information You Provide */}
              <section id="info-provided" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  3. Information You Provide
                </h2>
                <p>Depending on how you use our Services, you may provide:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Account Profile Data:</strong> Full name, professional work email, password hash, phone number, and geographic location.
                  </li>
                  <li>
                    <strong>Candidate & Skill Data:</strong> Code samples, sandbox execution logs, technical portfolio links, domain credentials, and desired compensation preferences.
                  </li>
                  <li>
                    <strong>Employer & Enterprise Data:</strong> Company name, corporate domain, hiring requisition details, compensation brackets, and team member contact records.
                  </li>
                  <li>
                    <strong>HUREMASO HRMS Data:</strong> Employee directory profiles, attendance and leave submissions, performance goals, and internal organizational hierarchy metadata.
                  </li>
                  <li>
                    <strong>Communications & Feedback:</strong> Inquiries sent to our customer care, sales consultation requests, or feedback surveys.
                  </li>
                </ul>
              </section>

              {/* 4. Information Collected Automatically */}
              <section id="info-auto" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  4. Information Collected Automatically
                </h2>
                <p>
                  When you browse or interact with our web applications, our systems automatically log technical telemetry:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>Device & Network Information:</strong> IP address, browser type, operating system version, screen resolution, and language settings.
                  </li>
                  <li>
                    <strong>Usage Data:</strong> Pages visited, navigation paths, timestamps, click events, and sandbox execution duration.
                  </li>
                  <li>
                    <strong>Cookie & Session Identifiers:</strong> Anonymous session tokens and preference states stored via standard browser storage mechanisms.
                  </li>
                </ul>
              </section>

              {/* 5. How We Use Information */}
              <section id="how-use" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  5. How We Use Information
                </h2>
                <p>We process your personal information for specific, legitimate business purposes:</p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>To administer assessments and generate objective, multi-dimensional skill evaluations.</li>
                  <li>To power reverse talent matching and notify candidates of relevant company bids.</li>
                  <li>To provide HRMS workflows including employee onboarding, leave management, and organizational analytics.</li>
                  <li>To detect, investigate, and prevent fraudulent evaluations, security incidents, or abuse.</li>
                  <li>To respond to sales inquiries, technical support tickets, and legal obligations.</li>
                </ul>
              </section>

              {/* 6. How We Share Information */}
              <section id="how-share" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  6. How We Share Information
                </h2>
                <p>
                  We do not sell your personal data. We share information only under strict operational conditions:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <strong>With Prospective Employers:</strong> When a candidate opts in to showcase verified skill vectors or apply to open requisitions.
                  </li>
                  <li>
                    <strong>Within Enterprise Workspaces:</strong> Authorized enterprise administrators have access to employee and candidate records provisioned for their company organization.
                  </li>
                  <li>
                    <strong>Service Providers:</strong> Third-party infrastructure providers (e.g., cloud hosting, transactional email delivery) under confidentiality agreements.
                  </li>
                  <li>
                    <strong>Legal & Regulatory Authorities:</strong> Where required by valid subpoenas, court orders, or applicable law.
                  </li>
                </ul>
              </section>

              {/* 7. Cookies and Similar Technologies */}
              <section id="cookies" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  7. Cookies and Similar Technologies
                </h2>
                <p>
                  We use cookies and localStorage tokens to authenticate sessions, remember preference settings, and analyze site performance. You can manage or revoke your consent preferences at any time via our Cookie Preferences Modal or browser settings.
                </p>
              </section>

              {/* 8. Data Storage and Security */}
              <section id="storage-security" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  8. Data Storage and Security
                </h2>
                <p>
                  We maintain industry-standard physical, technical, and administrative safeguards designed to protect personal information against unauthorized access, destruction, loss, or alteration. These include encrypted network transport (HTTPS/TLS), role-based access control, and segregated cloud storage.
                </p>
                <p className="text-xs text-slate-500 italic">
                  Note: No method of transmission over the Internet or electronic storage is completely infallible. We encourage users to maintain secure, unique credentials.
                </p>
              </section>

              {/* 9. Data Retention */}
              <section id="retention" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  9. Data Retention
                </h2>
                <p>
                  We retain personal information for as long as your account remains active or as needed to provide you with Services. We also retain and use information to comply with our legal obligations, resolve disputes, and enforce our agreements.
                </p>
                <p>
                  Upon receiving a verified account deletion request, we anonymize or securely purge candidate performance logs in accordance with our data retention schedule.
                </p>
              </section>

              {/* 10. User Rights and Choices */}
              <section id="user-rights" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  10. User Rights and Choices
                </h2>
                <p>
                  Subject to local jurisdiction laws, you may have rights regarding your personal information:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Access & Portability:</strong> The right to request copies of personal data we hold about you.</li>
                  <li><strong>Correction:</strong> The right to request rectification of inaccurate or incomplete records.</li>
                  <li><strong>Erasure:</strong> The right to request deletion of your account and associated personal data.</li>
                  <li><strong>Restriction & Objection:</strong> The right to limit or object to specific processing activities.</li>
                </ul>
                <p>
                  To exercise these rights, please contact our data governance team at <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-800">[privacy@letgetin.com]</span>.
                </p>
              </section>

              {/* 11. Account Information */}
              <section id="account-info" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  11. Account Information
                </h2>
                <p>
                  You can update your personal information, candidate bio, notification preferences, and contact details by logging into your LetGetIn dashboard account settings.
                </p>
              </section>

              {/* 12. Communications */}
              <section id="communications" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  12. Communications
                </h2>
                <p>
                  We may send you service-related notifications, verification milestone alerts, and administrative messages necessary for the functioning of the platform. You may opt out of non-essential marketing emails at any time using the unsubscribe link included in the footer of such communications.
                </p>
              </section>

              {/* 13. Third-Party Services */}
              <section id="third-party" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  13. Third-Party Services
                </h2>
                <p>
                  Our Services may contain links to third-party websites or integrate with external productivity tools (e.g., enterprise calendars, ATS platforms). This Privacy Policy does not apply to the practices of third-party platforms that we do not own or control.
                </p>
              </section>

              {/* 14. Children's Privacy */}
              <section id="children" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  14. Children's Privacy
                </h2>
                <p>
                  Our Services are not intended for or directed toward individuals under the age of 18 (or the age of majority in your jurisdiction). We do not knowingly collect personal data from minors. If you believe a minor has registered an account, please notify us immediately.
                </p>
              </section>

              {/* 15. International Data Transfers */}
              <section id="transfers" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  15. International Data Transfers
                </h2>
                <p>
                  LetGetIn provides global candidate discovery and recruitment workflows. Your information may be transferred to and maintained on cloud servers located outside your country of residence, where data protection standards may differ.
                </p>
              </section>

              {/* 16. Changes to This Privacy Policy */}
              <section id="changes" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  16. Changes to This Privacy Policy
                </h2>
                <p>
                  We may update this Privacy Policy from time to time to reflect operational changes, security enhancements, or legal requirements. When updates occur, we will revise the "Last Updated" timestamp at the top of this page.
                </p>
              </section>

              {/* 17. Contact Us */}
              <section id="contact" className="scroll-mt-28 space-y-4">
                <h2 className="text-xl font-bold text-[#061f3d] tracking-tight pb-2 border-b border-slate-100">
                  17. Contact Us
                </h2>
                <p>
                  If you have questions, concerns, or requests regarding this Privacy Policy or our data handling practices, please contact our legal affairs team:
                </p>
                <div className="bg-[#f8fbfe] border border-[#e2edf8] rounded-2xl p-5 space-y-2 text-xs font-mono">
                  <div><strong>Legal Entity:</strong> <span className="text-slate-600">[LetGetIn Legal Entity Name]</span></div>
                  <div><strong>Privacy Inquiries:</strong> <span className="text-[#0066cc]">[privacy@letgetin.com]</span></div>
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
