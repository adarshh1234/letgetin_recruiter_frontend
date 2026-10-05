import React from 'react';
import { Shield } from 'lucide-react';

const XIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.64 1.64 0 1 0-.02-3.28 1.64 1.64 0 0 0 .02 3.28m1.39 9.74V9.93H5.07v8.57h2.78z"/>
  </svg>
);

const YoutubeIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const GithubIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

interface FooterLink {
  label: string;
  href?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
}

interface FooterProps {
  onOpenSignIn?: () => void;
  onOpenSignUp?: () => void;
  onNavigate?: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSignIn: _onOpenSignIn, onOpenSignUp: _onOpenSignUp, onNavigate }) => {
  const footerSections: { title: string; links: FooterLink[] }[] = [
    {
      title: 'PLATFORM',
      links: [
        {
          label: 'Help centre',
          href: '/help-centre',
        },
        {
          label: 'Refer & Earn',
          href: '/refer-and-earn',
        },
        {
          label: 'Why LetGetIn',
          href: '/why-letgetin',
        },
        {
          label: 'Features',
          href: '/features',
        },
        {
          label: 'The 6 Dimensions',
          href: '/the-6-dimensions',
        },
      ],
    },
    {
      title: 'EXPLORE JOBS',
      links: [
        { label: 'AI & Engineering', href: '/jobs/ai-engineering' },
        { label: 'Finance and Accounting', href: '/jobs/finance-accounting' },
        { label: 'Health Sector Jobs', href: '/jobs/healthcare' },
        { label: 'Direct Company Bids', href: '/direct-company-bids' },
        { label: 'Resources', href: '/resources' },
      ],
    },
    {
      title: 'ENTERPRISE',
      links: [
        { label: 'AI Recruitment Suite', href: '/enterprise/ai-recruitment-suite' },
        { label: 'Enterprise AI', href: '/enterprise/ai' },
        { label: 'HUREMASO', href: '/enterprise/huremaso' },
        { label: 'Human Data', href: '/enterprise/human-data' },
        { label: 'Contact Sales', href: '/enterprise/contact-sales' },
      ],
    },
    {
      title: 'COMPANY',
      links: [
        { label: 'About', href: '/about' },
        { label: 'Employers', href: '/employers' },
        { label: 'Careers', href: '/careers' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'LEGAL',
      links: [
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
        { label: 'Policies', href: '/policies' },
        { label: 'Security', href: '/security' },
        { label: 'Customer Care', href: '/customer-care' },
      ],
    },
  ];

  const socialLinks = [
    { label: 'X', href: 'https://x.com/letgetin', icon: XIcon },
    { label: 'Instagram', href: 'https://www.instagram.com/let.getin2000/', icon: InstagramIcon },
    { label: 'Facebook', href: 'https://www.facebook.com/login/', icon: FacebookIcon },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/let-getin-62021a436/', icon: LinkedinIcon },
    { label: 'YouTube', href: 'https://www.youtube.com', icon: YoutubeIcon },
    { label: 'GitHub', href: 'https://github.com/letgetin', icon: GithubIcon },
  ];

  return (
    <footer className="bg-[#061a33] text-white border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid from PDF Page 6 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-8 pb-16 border-b border-white/10">
          
          {/* Brand Column (2 cols wide) */}
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              {/* Logo matching screenshot */}
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#063970] border border-white/20 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                  <span className="font-display">L</span>
                </div>
                <span className="font-display text-2xl font-bold tracking-tight text-white">
                  Let<span className="text-[#38bdf8]">Get</span>In
                </span>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed max-w-sm mb-6 font-normal">
                The professional identity layer where verified skills, not CVs, get you hired.
              </p>

              {/* Status Indicator */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs font-mono text-sky-200 mb-4">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verification Engine: Live (120k+ members)</span>
              </div>

              {/* App Download Badges */}
              <div className="flex flex-col sm:flex-row items-start gap-2.5">
                {/* Apple App Store Badge */}
                {/* TODO: Replace href with actual App Store URL when available */}
                <a
                  href="#app-store"
                  aria-label="Download LetGetIn on the App Store"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all group cursor-pointer"
                >
                  {/* Apple icon */}
                  <svg className="w-5 h-5 text-white shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="leading-tight">
                    <p className="text-[9px] font-medium text-white/70 uppercase tracking-wider">Download on the</p>
                    <p className="text-xs font-bold text-white">App Store</p>
                  </div>
                </a>

                {/* Google Play Badge */}
                {/* TODO: Replace href with actual Google Play URL when available */}
                <a
                  href="#google-play"
                  aria-label="Get LetGetIn on Google Play"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 transition-all group cursor-pointer"
                >
                  {/* Google Play icon */}
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M3.18 23.76a2 2 0 0 1-1.18-1.85V2.09A2 2 0 0 1 3.18.33l11.7 11.72-11.7 11.71Z" fill="#32BBFF"/>
                    <path d="m14.88 12.05-3-3L3.18.33A2 2 0 0 1 5.42.47l10.93 6.12-1.47 5.46Z" fill="#32BBFF"/>
                    <path d="M3.18 23.76a2 2 0 0 0 2.24-.13l10.93-6.12-1.47-5.46-3 3L3.18 23.76Z" fill="#32BBFF"/>
                    <path d="M3.18.33A2 2 0 0 0 2 2.09v19.82a2 2 0 0 0 1.18 1.85l12.03-12.03L3.18.33Z" fill="#2C9FD9"/>
                    <path d="m16.35 6.59-10.93-6.12a2 2 0 0 0-2.24.14l11.7 11.71 3-3-1.53-.86v2.26Z" fill="#29CC5E"/>
                    <path d="m5.42 23.67 10.93-6.12 1.47-5.46-3 3-11.64 8.44a2 2 0 0 0 2.24-.86Z" fill="#D93F21"/>
                    <path d="M22.15 10.73 19.4 9.2l-2.05 2.85 2.05 2.85 2.78-1.55a2 2 0 0 0 0-2.62Z" fill="#FFD500"/>
                    <path d="m19.4 9.2-3.05-1.74L3.18.33l13.17 11.72 3.05-1.74V9.2Z" fill="#FFAA00"/>
                    <path d="m3.18 23.76 13.17-11.71 3.05 1.74-1.47.82-1.58.86-10.93 6.12a2 2 0 0 1-2.24-.03Z" fill="#EA4435"/>
                  </svg>
                  <div className="leading-tight">
                    <p className="text-[9px] font-medium text-white/70 uppercase tracking-wider">Get it on</p>
                    <p className="text-xs font-bold text-white">Google Play</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8 pt-6 border-t border-white/10 max-w-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-300 font-mono block mb-3">
                CONNECT
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-2.5 py-2 rounded-lg bg-white/[0.04] hover:bg-sky-500/15 border border-white/10 hover:border-sky-400/40 text-slate-300 hover:text-white transition-all text-xs group"
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-sky-300 transition-colors" />
                      <span className="font-medium truncate">{item.label}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {footerSections.map((sec) => (
            <div key={sec.title} className="flex flex-col space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-sky-300 font-mono">
                {sec.title}
              </h5>
              <ul className="space-y-2.5 text-xs text-slate-300">
                {sec.links.map((link) => {
                  if (link.onClick) {
                    return (
                      <li key={link.label}>
                        <button
                          type="button"
                          onClick={link.onClick}
                          className="hover:text-white transition-colors duration-150 text-left block py-0.5 text-sky-300 hover:underline cursor-pointer"
                        >
                          {link.label}
                        </button>
                      </li>
                    );
                  }

                  const isInternal = link.href?.startsWith('/');

                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={link.target}
                        rel={link.rel}
                        onClick={(e) => {
                          if (isInternal && onNavigate) {
                            e.preventDefault();
                            onNavigate(link.href!);
                          }
                        }}
                        className="hover:text-white transition-colors duration-150 block py-0.5"
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-mono">
          <div>
            © 2026 LetGetIn, Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Shield className="w-3.5 h-3.5 text-brand-400" />
              <span>SOC2 Certified · Zero Bias Verified</span>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
