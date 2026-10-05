import React from 'react';
import {
  Cookie,
  ShieldCheck,
  BarChart2,
  Megaphone,
  Settings,
  Globe,
  Clock,
  RefreshCw,
  Mail,
  ChevronRight,
  Info,
} from 'lucide-react';

interface CookiePolicyPageProps {
  onOpenDemo?: () => void;
  onNavigate?: (path: string) => void;
}

// ─────────────────────────────────────────────
// Reusable section components
// ─────────────────────────────────────────────

const SectionHeading: React.FC<{
  icon: React.FC<{ className?: string }>;
  title: string;
  id: string;
}> = ({ icon: Icon, title, id }) => (
  <div id={id} className="flex items-center gap-3 mb-4 scroll-mt-28">
    <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center shrink-0">
      <Icon className="w-4.5 h-4.5 text-[#0066cc]" />
    </div>
    <h2 className="text-xl sm:text-2xl font-bold text-[#061f3d] tracking-tight">{title}</h2>
  </div>
);

const Prose: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-sm sm:text-[15px] text-slate-600 leading-relaxed space-y-3">{children}</div>
);

const CookieTable: React.FC<{
  rows: { name: string; purpose: string; duration: string }[];
}> = ({ rows }) => (
  <div className="overflow-x-auto mt-4 rounded-xl border border-sky-100">
    <table className="min-w-full text-xs sm:text-sm text-left">
      <thead className="bg-sky-50 border-b border-sky-100">
        <tr>
          <th className="px-4 py-3 font-bold text-[#061f3d] w-1/3">Cookie / Identifier</th>
          <th className="px-4 py-3 font-bold text-[#061f3d]">Purpose</th>
          <th className="px-4 py-3 font-bold text-[#061f3d] w-1/5">Retention</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 bg-white">
        {rows.map((r) => (
          <tr key={r.name} className="hover:bg-sky-50/40 transition-colors">
            <td className="px-4 py-3 font-mono text-[#0066cc] font-medium">{r.name}</td>
            <td className="px-4 py-3 text-slate-600">{r.purpose}</td>
            <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{r.duration}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Callout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex gap-3 p-4 rounded-xl bg-sky-50 border border-sky-200 my-5">
    <Info className="w-4 h-4 text-[#0066cc] shrink-0 mt-0.5" />
    <p className="text-xs sm:text-sm text-sky-900 leading-relaxed">{children}</p>
  </div>
);

const Divider = () => <hr className="border-sky-100 my-10" />;

// ─────────────────────────────────────────────
// Table of Contents
// ─────────────────────────────────────────────

const sections = [
  { id: 'introduction',       label: 'Introduction' },
  { id: 'what-are-cookies',   label: 'What Are Cookies?' },
  { id: 'how-we-use',         label: 'How We Use Cookies' },
  { id: 'necessary',          label: 'Necessary Cookies' },
  { id: 'analytics',          label: 'Analytics Cookies' },
  { id: 'marketing',          label: 'Marketing & Advertising Cookies' },
  { id: 'managing',           label: 'Managing Cookie Preferences' },
  { id: 'third-party',        label: 'Third-Party Cookies' },
  { id: 'retention',          label: 'Cookie Retention' },
  { id: 'changes',            label: 'Changes to This Policy' },
  { id: 'contact',            label: 'Contact / Support' },
];

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────

export const CookiePolicyPage: React.FC<CookiePolicyPageProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#f8fbfe] text-slate-800 font-sans min-h-screen">

      {/* ── HERO ─────────────────────────────────── */}
      <section className="pt-32 pb-14 md:pt-40 md:pb-20 bg-white border-b border-sky-100 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-sky-50/60 to-transparent" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200 text-[#0066cc] text-xs font-bold uppercase tracking-wider">
            <Cookie className="w-3.5 h-3.5" />
            <span>Cookie Policy</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#061f3d] tracking-tight leading-tight">
            Cookie &amp; Tracking{' '}
            <span className="bg-gradient-to-r from-[#0066cc] to-[#38bdf8] bg-clip-text text-transparent">
              Policy
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
            This policy explains how LetGetIn uses cookies and similar technologies,
            what choices you have, and how to manage your preferences.
          </p>

          <p className="text-xs text-slate-400 font-mono">
            Last updated: September 2026 &nbsp;·&nbsp;{' '}
            {/* ⚠️ LEGAL REVIEW REQUIRED: confirm effective date before publishing */}
            Effective: September 2026
          </p>
        </div>
      </section>

      {/* ── MAIN CONTENT ─────────────────────────── */}
      <section className="py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-10 items-start">

            {/* ── STICKY TABLE OF CONTENTS (desktop) ── */}
            <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
              <div className="sticky top-28 bg-white rounded-2xl border border-sky-100 p-5 shadow-xs">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-3">
                  On This Page
                </p>
                <nav className="space-y-1">
                  {sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="flex items-center gap-2 text-xs text-slate-600 hover:text-[#0066cc] py-1.5 px-2 rounded-lg hover:bg-sky-50 transition-colors group"
                    >
                      <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-[#0066cc] shrink-0" />
                      {s.label}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* ── ARTICLE BODY ─────────────────────── */}
            <article className="flex-1 min-w-0 bg-white rounded-3xl border border-sky-100 p-6 sm:p-10 shadow-xs space-y-0">

              {/* 1. Introduction */}
              <SectionHeading icon={Cookie} title="Introduction" id="introduction" />
              <Prose>
                <p>
                  LetGetIn ("we", "us", or "our") uses cookies and similar browser technologies on our
                  website and platform. This Cookie Policy explains what these technologies are, why we
                  use them, and the rights you have to control their use.
                </p>
                <p>
                  By continuing to use LetGetIn after viewing the cookie consent banner, you accept our
                  use of cookies in accordance with this policy. You can withdraw or modify your
                  consent at any time using the Cookie Preferences panel accessible from the banner or
                  from the footer.
                </p>
                {/* ⚠️ LEGAL REVIEW REQUIRED: confirm jurisdiction and governing law */}
                <Callout>
                  <strong>Legal note:</strong> This policy is provided for transparency purposes. Specific
                  legal obligations (GDPR, CCPA, ePrivacy, LGPD, etc.) applicable to your jurisdiction
                  should be confirmed with qualified legal counsel before this page is published.
                </Callout>
              </Prose>

              <Divider />

              {/* 2. What Are Cookies */}
              <SectionHeading icon={Info} title="What Are Cookies?" id="what-are-cookies" />
              <Prose>
                <p>
                  Cookies are small text files placed on your device by a website server. They allow the
                  website to recognise your device across requests and between sessions. Cookies can be:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <strong>Session cookies</strong> — temporary files deleted when you close your browser.
                  </li>
                  <li>
                    <strong>Persistent cookies</strong> — files that remain on your device for a defined
                    period or until manually deleted.
                  </li>
                  <li>
                    <strong>First-party cookies</strong> — set directly by LetGetIn.
                  </li>
                  <li>
                    <strong>Third-party cookies</strong> — set by our analytics, advertising, or
                    infrastructure partners.
                  </li>
                </ul>
                <p>
                  We also use similar technologies such as local storage, session storage, and pixel tags
                  where mentioned in this policy.
                </p>
              </Prose>

              <Divider />

              {/* 3. How We Use Cookies */}
              <SectionHeading icon={Settings} title="How We Use Cookies" id="how-we-use" />
              <Prose>
                <p>We use cookies to:</p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>Keep you logged in and maintain your session security.</li>
                  <li>Remember your cookie consent preferences.</li>
                  <li>Measure platform performance and diagnose errors.</li>
                  <li>Understand how candidates, employers, and recruiters navigate our platform.</li>
                  <li>Serve contextually relevant content and, where consented, personalised recommendations.</li>
                </ul>
              </Prose>

              <Divider />

              {/* 4. Necessary Cookies */}
              <SectionHeading icon={ShieldCheck} title="Necessary Cookies" id="necessary" />
              <Prose>
                <p>
                  Necessary cookies are essential for the LetGetIn platform to function. They cannot be
                  disabled. Without these cookies, services such as secure login, session management,
                  and fraud prevention would not operate correctly.
                </p>
              </Prose>
              <CookieTable
                rows={[
                  {
                    name: 'lgi_session',
                    purpose: 'Maintains your authenticated platform session.',
                    duration: 'Session',
                  },
                  {
                    name: 'lgi_csrf',
                    purpose: 'CSRF protection token to prevent cross-site request forgery.',
                    duration: 'Session',
                  },
                  {
                    name: 'cookieConsent',
                    purpose:
                      'Stores your cookie consent preferences so you are not asked again on return visits.',
                    duration: '12 months',
                  },
                  {
                    name: 'lgi_device_id',
                    purpose: 'Identifies the device for security and fraud detection.',
                    duration: '30 days',
                  },
                ]}
              />

              <Divider />

              {/* 5. Analytics Cookies */}
              <SectionHeading icon={BarChart2} title="Analytics Cookies" id="analytics" />
              <Prose>
                <p>
                  With your consent, we use analytics cookies to understand how users interact with our
                  platform — which pages they visit, how long they stay, and where they encounter
                  friction. This data is used exclusively to improve the platform experience.
                </p>
                <p>
                  Analytics data is aggregated and does not identify you personally. You can opt out at
                  any time via the Cookie Preferences panel.
                </p>
              </Prose>
              <CookieTable
                rows={[
                  {
                    name: '_ga / _ga_*',
                    purpose:
                      'Google Analytics — distinguishes unique users to measure page traffic and usage patterns.',
                    duration: '2 years',
                  },
                  {
                    name: '_gid',
                    purpose: 'Google Analytics — stores and updates a unique value for each page visited.',
                    duration: '24 hours',
                  },
                  {
                    name: 'lgi_perf',
                    purpose: 'Internal performance diagnostics — measures API latency and render timing.',
                    duration: '7 days',
                  },
                ]}
              />

              <Divider />

              {/* 6. Marketing Cookies */}
              <SectionHeading
                icon={Megaphone}
                title="Marketing &amp; Advertising Cookies"
                id="marketing"
              />
              <Prose>
                <p>
                  With your consent, marketing cookies allow us and our partners to deliver more
                  relevant job recommendations, campaign content, and platform announcements — including
                  retargeting across third-party websites. These cookies track your browsing activity
                  across sites.
                </p>
                <p>
                  Rejecting marketing cookies will not affect your ability to use the platform. You may
                  still see generic content and advertisements.
                </p>
              </Prose>
              <CookieTable
                rows={[
                  {
                    name: '_fbp',
                    purpose:
                      'Meta (Facebook) Pixel — used to deliver advertisements and measure campaign effectiveness.',
                    duration: '3 months',
                  },
                  {
                    name: 'li_fat_id',
                    purpose:
                      'LinkedIn Insight Tag — measures conversions from LinkedIn ad campaigns.',
                    duration: '30 days',
                  },
                  {
                    name: 'lgi_ref',
                    purpose:
                      'Internal referral tracking — attributes a visit to a specific campaign or referral partner.',
                    duration: '30 days',
                  },
                ]}
              />

              <Divider />

              {/* 7. Managing Preferences */}
              <SectionHeading icon={Settings} title="Managing Cookie Preferences" id="managing" />
              <Prose>
                <p>
                  You can adjust or withdraw your cookie consent at any time. We provide three methods:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <strong>Cookie Preferences Panel:</strong> Click the "Customize My Choices" button
                    in the cookie banner or manage preferences through the footer.
                  </li>
                  <li>
                    <strong>Browser settings:</strong> Most browsers allow you to refuse, delete, or
                    manage cookies. Refer to your browser's help documentation for instructions.
                  </li>
                  <li>
                    <strong>Opt-out tools:</strong> For Google Analytics, visit{' '}
                    <a
                      href="https://tools.google.com/dlpage/gaoptout"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0066cc] underline underline-offset-2 hover:text-[#004d99] transition-colors"
                    >
                      Google Analytics Opt-out
                    </a>
                    . For interest-based ads, visit{' '}
                    <a
                      href="https://www.youronlinechoices.eu"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0066cc] underline underline-offset-2 hover:text-[#004d99] transition-colors"
                    >
                      Your Online Choices
                    </a>{' '}
                    (EU) or{' '}
                    <a
                      href="https://optout.aboutads.info"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0066cc] underline underline-offset-2 hover:text-[#004d99] transition-colors"
                    >
                      AboutAds
                    </a>{' '}
                    (US).
                  </li>
                </ul>
                <Callout>
                  Disabling necessary cookies may prevent you from signing in or using core platform
                  features. Analytics and marketing cookies can be disabled without affecting access.
                </Callout>
              </Prose>

              <Divider />

              {/* 8. Third-Party Cookies */}
              <SectionHeading icon={Globe} title="Third-Party Cookies" id="third-party" />
              <Prose>
                <p>
                  Some cookies on the LetGetIn platform are set by third-party service providers we
                  engage for analytics, advertising, security, and infrastructure purposes. These
                  providers may independently collect data in accordance with their own privacy policies:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  <li>
                    <strong>Google Analytics</strong> —{' '}
                    <a
                      href="https://policies.google.com/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0066cc] underline underline-offset-2 hover:text-[#004d99]"
                    >
                      Google Privacy Policy
                    </a>
                  </li>
                  <li>
                    <strong>Meta (Facebook) Pixel</strong> —{' '}
                    <a
                      href="https://www.facebook.com/privacy/policy/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0066cc] underline underline-offset-2 hover:text-[#004d99]"
                    >
                      Meta Privacy Policy
                    </a>
                  </li>
                  <li>
                    <strong>LinkedIn Insight Tag</strong> —{' '}
                    <a
                      href="https://www.linkedin.com/legal/privacy-policy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0066cc] underline underline-offset-2 hover:text-[#004d99]"
                    >
                      LinkedIn Privacy Policy
                    </a>
                  </li>
                </ul>
                <p>
                  We do not control third-party cookies and are not responsible for data collected by
                  those services independently.
                </p>
              </Prose>

              <Divider />

              {/* 9. Cookie Retention */}
              <SectionHeading icon={Clock} title="Cookie Retention" id="retention" />
              <Prose>
                <p>
                  Cookie retention periods vary by type. Session cookies are automatically deleted when
                  you close your browser. Persistent cookies remain on your device for the duration
                  specified in the tables above, or until you manually delete them.
                </p>
                <p>
                  We periodically review cookie usage and retention periods to ensure they remain
                  proportionate to their purpose. We will update this policy when retention periods
                  change.
                </p>
              </Prose>

              <Divider />

              {/* 10. Changes */}
              <SectionHeading icon={RefreshCw} title="Changes to This Cookie Policy" id="changes" />
              <Prose>
                <p>
                  We may update this Cookie Policy from time to time to reflect changes in the
                  technologies we use or to comply with applicable law. Any material updates will be
                  communicated via the platform banner or, where required, direct notification.
                </p>
                <p>
                  The "Last updated" date at the top of this page indicates when the most recent changes
                  were made. Continued use of LetGetIn after changes are published constitutes
                  acceptance of the updated policy.
                </p>
              </Prose>

              <Divider />

              {/* 11. Contact */}
              <SectionHeading icon={Mail} title="Contact / Support" id="contact" />
              <Prose>
                <p>
                  If you have questions about this Cookie Policy or wish to exercise any rights relating
                  to cookie-based data, please contact us:
                </p>
                <ul className="list-disc pl-5 space-y-1.5">
                  {/* ⚠️ LEGAL REVIEW REQUIRED: confirm official privacy / DPO contact email */}
                  <li>
                    <strong>General privacy enquiries:</strong>{' '}
                    <a
                      href="mailto:privacy@letgetin.com"
                      className="text-[#0066cc] underline underline-offset-2 hover:text-[#004d99]"
                    >
                      privacy@letgetin.com
                    </a>
                  </li>
                  <li>
                    <strong>Security disclosures:</strong>{' '}
                    <a
                      href="mailto:security@letgetin.com"
                      className="text-[#0066cc] underline underline-offset-2 hover:text-[#004d99]"
                    >
                      security@letgetin.com
                    </a>
                  </li>
                  <li>
                    <strong>General support:</strong>{' '}
                    <a
                      href="mailto:support@letgetin.com"
                      className="text-[#0066cc] underline underline-offset-2 hover:text-[#004d99]"
                    >
                      support@letgetin.com
                    </a>
                  </li>
                </ul>
                <p>
                  You can also open a support ticket via our{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('/customer-care')}
                    className="text-[#0066cc] underline underline-offset-2 hover:text-[#004d99] transition-colors cursor-pointer"
                  >
                    Customer Care page
                  </button>
                  .
                </p>
              </Prose>

              {/* ── CTA Banner ──────────────────────── */}
              <div className="mt-12 p-7 rounded-2xl bg-gradient-to-r from-[#062447] to-[#07498c] text-white flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Manage your cookie preferences
                  </h3>
                  <p className="text-xs text-sky-200">
                    You can update your choices at any time without affecting your account.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('/privacy')}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold transition-all cursor-pointer"
                  >
                    Privacy Policy
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate && onNavigate('/policies')}
                    className="px-4 py-2.5 rounded-xl bg-[#38bdf8] hover:bg-[#0ea5e9] text-[#061a33] text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    All Platform Policies
                  </button>
                </div>
              </div>

            </article>
          </div>
        </div>
      </section>
    </div>
  );
};
