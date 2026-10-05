import React from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Server, 
  Code2, 
  Activity, 
  FileCheck2, 
  AlertCircle, 
  Mail, 
  CheckCircle2, 
  Bug, 
  Layers
} from 'lucide-react';

interface SecurityPageProps {
  onOpenDemo?: () => void;
  onNavigate?: (path: string) => void;
}

export const SecurityPage: React.FC<SecurityPageProps> = ({ onNavigate }) => {
  const securityPillars = [
    {
      title: '1. Our Security Approach',
      desc: 'Security at LetGetIn is designed as a foundational layer. We combine defense-in-depth principles, automated runtime sandbox isolation, and continuous vulnerability assessments to safeguard sensitive candidate and enterprise data.',
      icon: ShieldCheck,
      details: ['Defense-in-depth architecture', 'Segregated evaluation sandboxes', 'Regular internal vulnerability reviews']
    },
    {
      title: '2. Data Protection & Encryption',
      desc: 'All data transmitted between your browser and LetGetIn services is encrypted in transit using modern Transport Layer Security (TLS 1.2+ / HTTPS). Sensitive database stores are encrypted at rest using industry-standard cryptographic algorithms.',
      icon: Lock,
      details: ['Enforced TLS 1.2+ in transit', 'AES-256 equivalent encryption at rest', 'Cryptographic hashing for credentials']
    },
    {
      title: '3. Access Control & Least Privilege',
      desc: 'Access to production environments and user data is strictly limited to authorized personnel based on the principle of least privilege. Administrative access requires multi-factor authentication (MFA) and is audited continuously.',
      icon: KeyRound,
      details: ['Role-based access control (RBAC)', 'Enforced Multi-Factor Authentication', 'Audit logging of administrative actions']
    },
    {
      title: '4. Authentication & Authorization',
      desc: 'User accounts are protected through cryptographically salted password hashes and secure session management. Enterprise SSO and SAML integrations enable organizations to enforce centralized corporate identity policies.',
      icon: KeyRound,
      details: ['Salted password hashing', 'Secure HTTP-only session tokens', 'Enterprise SSO integration capabilities']
    },
    {
      title: '5. Infrastructure & Cloud Security',
      desc: 'Our applications run on tier-1 cloud infrastructure providers with physical data center security, automated DDoS mitigation, redundant power, and automated backup routines.',
      icon: Server,
      details: ['Redundant cloud infrastructure', 'Automated network DDoS mitigation', 'Daily snapshot backups and recovery drills']
    },
    {
      title: '6. Application Security & Isolation',
      desc: 'Candidate code execution sandboxes are executed in containerized, air-gapped runtimes with restricted system call interfaces, strict memory/CPU quotas, and zero direct access to internal database networks.',
      icon: Code2,
      details: ['Containerized sandbox isolation', 'Strict CPU & memory execution quotas', 'Automated dependency vulnerability audits']
    },
    {
      title: '7. Monitoring, Telemetry & Logging',
      desc: 'We maintain real-time application monitoring and telemetry to identify anomalous traffic patterns, detect potential brute-force attempts, and track service reliability.',
      icon: Activity,
      details: ['Centralized telemetry logging', 'Real-time anomaly & brute-force detection', 'Proactive service health alerts']
    },
    {
      title: '8. Secure Development Lifecycle',
      desc: 'Our engineering workflow incorporates automated linting, type-checking, code review gates, and continuous static analysis (SAST) prior to code deployment.',
      icon: FileCheck2,
      details: ['Mandatory peer code reviews', 'Continuous automated static code analysis', 'Pre-deployment testing pipelines']
    },
    {
      title: '9. Data Privacy & Governance',
      desc: 'We adhere to privacy-by-design principles, minimizing data collection to only what is necessary to perform objective skill benchmarking and HRMS operations.',
      icon: Layers,
      details: ['Strict data minimization', 'Candidate deletion workflows on request', 'Clear data processing boundaries']
    },
    {
      title: '10. Incident Response & Continuity',
      desc: 'LetGetIn maintains a documented incident response protocol outlining triage, containment, resolution, and communication procedures in the event of an operational anomaly.',
      icon: AlertCircle,
      details: ['Documented incident response framework', 'Designated engineering escalation on-call', 'Transparent status communication protocols']
    },
    {
      title: '11. Third-Party Vendor Management',
      desc: 'We evaluate third-party cloud infrastructure vendors, email gateways, and payment partners against rigorous security, availability, and privacy benchmarks.',
      icon: Server,
      details: ['Vendor security risk reviews', 'Contractual data protection terms', 'Minimal data sharing scopes']
    },
    {
      title: '12. Responsible Vulnerability Disclosure',
      desc: 'We value the contributions of the security research community. If you discover a potential vulnerability in our platform, we invite you to report it to us responsibly.',
      icon: Bug,
      details: ['Coordinated disclosure protocol', 'Expedited triaging by our engineering team', 'Safe-harbor for good-faith research']
    }
  ];

  return (
    <div className="bg-[#f8fbfe] text-slate-800 font-sans min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="pt-32 pb-14 md:pt-40 md:pb-20 relative overflow-hidden bg-white border-b border-sky-100">
        <div className="absolute inset-0 screenshot-ambient-glow pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f0f8ff] border border-[#dbeafe] text-[#0066cc] text-xs font-bold uppercase tracking-wider mb-6 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0066cc]" />
              <span>PLATFORM SECURITY</span>
            </div>

            <h1 className="font-display text-4xl sm:text-6xl font-extrabold text-[#061f3d] tracking-[-0.035em] leading-[1.15] mb-6">
              Security Built into the <span className="text-gradient-blue">LetGetIn Ecosystem</span>
            </h1>

            <p className="text-base sm:text-xl text-slate-600 leading-relaxed mb-8">
              Protecting verified candidate records, evaluation sandboxes, and enterprise HRMS data with transparent, defense-in-depth engineering practices.
            </p>

          </div>
        </div>
      </section>

      {/* 2. SECURITY PILLARS GRID */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl border border-[#e2edf8] p-7 sm:p-8 flex flex-col justify-between hover:border-[#bae6fd] hover:shadow-card-clean transition-all"
                >
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-[#f0f8ff] border border-[#dbeafe] flex items-center justify-center text-[#0066cc] mb-5">
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="text-lg font-bold text-[#061f3d] tracking-tight mb-2">
                      {pillar.title}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    {pillar.details.map((d, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 13. RESPONSIBLE DISCLOSURE & CONTACT SECURITY */}
          <div className="mt-16 bg-[#061f3d] text-white rounded-3xl p-8 sm:p-12 shadow-hero-card">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sky-200 text-xs font-mono font-bold uppercase">
                <Mail className="w-3.5 h-3.5 text-sky-300" />
                <span>SECURITY POINT OF CONTACT</span>
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                13. Contact Security & Vulnerability Reporting
              </h2>

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                If you believe you have found a security vulnerability or have questions regarding our technical architecture, please contact our security engineering group:
              </p>

              <div className="p-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 inline-block text-left text-xs font-mono space-y-1">
                <div><strong>Security Inquiries:</strong> <span className="text-sky-300">[security@letgetin.com]</span></div>
                <div><strong>PGP Key Fingerprint:</strong> <span className="text-slate-300">[PGP Key ID Placeholder]</span></div>
                <div><strong>Response SLA:</strong> <span className="text-emerald-300">Within 24 business hours</span></div>
              </div>

              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('/customer-care')}
                  className="px-6 py-2.5 rounded-xl bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#061a33] font-bold text-xs transition-all shadow-xs cursor-pointer"
                >
                  Contact Security Team
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};
