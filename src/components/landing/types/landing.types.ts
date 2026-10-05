import { LucideIcon } from 'lucide-react';

export interface HeroProfile {
  id: string;
  initials: string;
  name: string;
  role: string;
  fitScore: string;
  interviewStatus: string;
  interviewDuration: string;
  portfolioStatus: string;
  portfolioRating: string;
  ranking: string;
  tier: string;
  activeBids: string;
  offerCompany: string;
  offerDetails: string;
}

export interface PlatformStat {
  id: string;
  value: string;
  label: string;
  sub: string;
}

export interface LiveRoleOpportunity {
  id: string;
  title: string;
  rate: string;
  status: string;
  field: 'Engineering' | 'AI Research' | 'Design' | 'Fintech' | string;
}

export interface CoreFeatureOS {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
  tag: string;
}

export interface TalentDimension {
  num: string;
  title: string;
  description: string;
}

export interface BlogArticle {
  id: number;
  title: string;
  description: string;
  category: 'Proof of Work' | 'Autonomous Bidding' | 'Talent Economy' | '6 Dimensions' | string;
  date: string;
  readTime: string;
  author: string;
  featured: boolean;
  badge: string;
  imageGradient: string;
}

export interface ShowcaseVideo {
  id: number;
  title: string;
  duration: string;
  category: string;
  speaker: string;
  description: string;
  badge: string;
  tag: string;
}

export interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  initials: string;
  rating: number;
}

export interface DemoModalSubmission {
  email: string;
  role?: string;
  mode: 'signup' | 'video' | 'enterprise' | 'signin';
}
