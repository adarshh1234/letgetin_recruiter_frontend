import React from 'react';

export type ViewType = 
  | 'landing' 
  | 'roles' 
  | 'refer-and-earn' 
  | 'why-letgetin' 
  | 'features' 
  | 'the-6-dimensions'
  | 'jobs-ai-engineering'
  | 'jobs-finance-accounting'
  | 'jobs-healthcare'
  | 'direct-company-bids'
  | 'resources'
  | 'about'
  | 'employers'
  | 'careers'
  | 'blog'
  | 'contact'
  | 'enterprise-ai-recruitment-suite'
  | 'enterprise-ai'
  | 'enterprise-huremaso'
  | 'enterprise-human-data'
  | 'enterprise-contact-sales'
  | 'privacy'
  | 'terms'
  | 'policies'
  | 'security'
  | 'customer-care'
  | 'help-centre'
  | 'cookie-policy';

export interface NavLinkItem {
  label: string;
  href: string;
}

export interface FooterLinkItem {
  label: string;
  href?: string;
  onClick?: () => void;
  target?: string;
  rel?: string;
}

export interface FooterSectionItem {
  title: string;
  links: FooterLinkItem[];
}

export interface SocialLinkItem {
  label: string;
  href: string;
  icon: React.FC<{ className?: string }>;
}
