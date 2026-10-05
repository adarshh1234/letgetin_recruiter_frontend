import { 
  Brain, 
  ShieldCheck, 
  Globe, 
  Handshake, 
  Trophy, 
  BarChart2
} from 'lucide-react';
import { 
  HeroProfile, 
  PlatformStat, 
  LiveRoleOpportunity, 
  CoreFeatureOS, 
  TalentDimension, 
  BlogArticle, 
  ShowcaseVideo, 
  TestimonialItem 
} from '../types/landing.types';
import { NavLinkItem } from '../types/navigation.types';

export const HERO_PROFILES: HeroProfile[] = [
  {
    id: 'aisha-kapoor',
    initials: 'AK',
    name: 'Aisha Kapoor',
    role: 'Product Designer · Verified',
    fitScore: '98% Fit',
    interviewStatus: 'AI Interview Passed',
    interviewDuration: '5 min · Adaptive',
    portfolioStatus: 'Portfolio · 12 projects',
    portfolioRating: '97% peer rated',
    ranking: 'Top 5% · Design Community',
    tier: '🏆 Gold',
    activeBids: '3 companies viewing your profile',
    offerCompany: 'Stripe · hiring',
    offerDetails: 'Offered $185k · 2d ago',
  },
  {
    id: 'marcus-chen',
    initials: 'MC',
    name: 'Marcus Chen',
    role: 'Staff ML Engineer · Verified',
    fitScore: '99% Fit',
    interviewStatus: 'APEX-SWE Bench Passed',
    interviewDuration: '12 min · Sandbox',
    portfolioStatus: 'Verified Repos · 8 audits',
    portfolioRating: '99.4% benchmark',
    ranking: 'Top 1% · Systems Guild',
    tier: '💎 Diamond',
    activeBids: '5 companies competing',
    offerCompany: 'Anthropic Partner · hiring',
    offerDetails: 'Offered $310k · 4h ago',
  }
];

export const PLATFORM_STATS: PlatformStat[] = [
  { id: 'stat-verified', value: '120K+', label: 'Verified Professionals', sub: 'Across 150+ countries' },
  { id: 'stat-companies', value: '8.2K', label: 'Companies Hiring', sub: 'From fast-growth startups to enterprise' },
  { id: 'stat-accuracy', value: '96%', label: 'Match Accuracy', sub: 'Evaluated on real proof of work' },
  { id: 'stat-countries', value: '150+', label: 'Countries', sub: 'Global merit-based network' },
];

export const LIVE_OPPORTUNITIES: LiveRoleOpportunity[] = [
  { id: 'opp-1', title: 'Frontier AI Evaluation Specialist', rate: '$90 - $130/hr', status: '842 recently matched', field: 'AI Research' },
  { id: 'opp-2', title: 'Senior Distributed Systems Architect', rate: '$180k - $240k', status: '154 recently hired', field: 'Engineering' },
  { id: 'opp-3', title: 'Quantitative Risk & KYC Modeling Lead', rate: '$110/hr', status: '312 recently hired', field: 'Fintech' },
  { id: 'opp-4', title: 'Product & Design Systems Engineer', rate: '$150k - $195k', status: '489 recently hired', field: 'Design' },
];

export const CORE_FEATURES_LIST: CoreFeatureOS[] = [
  {
    id: 1,
    icon: Brain,
    title: 'Pathfinder AI',
    description: 'Matches jobs, people, and learning based on verified skills, not keywords.',
    tag: 'Fit score + skill gap analysis',
  },
  {
    id: 2,
    icon: ShieldCheck,
    title: 'Skill Verification Hub',
    description: 'AI interviews, project uploads, peer endorsements — proof over claims.',
    tag: 'Mercor-style live vetting',
  },
  {
    id: 3,
    icon: Globe,
    title: 'Authentic Community',
    description: 'Niche groups, AI-facilitated networking, and local hubs in emerging markets.',
    tag: '150+ countries',
  },
  {
    id: 4,
    icon: Handshake,
    title: 'Agentic Headhunter',
    description: 'AI-to-AI negotiation for salary, culture fit, and skills — before humans talk.',
    tag: 'Zero friction hiring',
  },
  {
    id: 5,
    icon: Trophy,
    title: 'Gamified Engagement',
    description: 'Skill challenges, hackathons, and leaderboards that directly improve job prospects.',
    tag: 'Earn badges + rewards',
  },
  {
    id: 6,
    icon: BarChart2,
    title: 'Trust & Analytics',
    description: 'Dynamic reputation scores, bias detection, and live application insights.',
    tag: 'See your ranking',
  },
];

export const SIX_DIMENSIONS_LIST: TalentDimension[] = [
  {
    num: '01',
    title: 'Educational Foundations',
    description: 'Consistency + Specialization. Tier 1 reputation matters, but so does relevancy.',
  },
  {
    num: '02',
    title: 'Verified Skill Sets',
    description: 'Technical proficiency, certifications, and domain expertise — proven, not claimed.',
  },
  {
    num: '03',
    title: 'Performance History',
    description: 'Promotion velocity + quantifiable ROI. STAR results beat years of tenure.',
  },
  {
    num: '04',
    title: 'Psychometric & Cognitive',
    description: 'Aptitude, SJT, personality (DISC/Big Five), and EQ — raw ability minus bias.',
  },
  {
    num: '05',
    title: 'Communication & Language',
    description: 'Professional fluency, cross-cultural agility, and public speaking.',
  },
  {
    num: '06',
    title: 'Soft Power & Adaptability',
    description: 'Learnability (AQ), critical thinking, collaboration, and digital literacy.',
  }
];

export const BLOG_ARTICLES_LIST: BlogArticle[] = [
  {
    id: 1,
    title: 'The Death of the Traditional Resume: Why Verified Proof of Work Outperforms CVs by 4x',
    description: 'An empirical study of 120,000 engineering candidates evaluated across standardized sandboxes versus keyword-driven ATS pipelines.',
    category: 'Proof of Work',
    date: 'Sep 4, 2026',
    readTime: '4 min read',
    author: 'LetGetIn Research Lab',
    featured: true,
    badge: 'FLAGSHIP RESEARCH',
    imageGradient: 'from-[#063970] via-[#08498f] to-[#0a192f]'
  },
  {
    id: 2,
    title: 'Reverse Job Bidding: How Domain Experts Earn True Market Value in the 2026 AI Economy',
    description: 'When companies compete for pre-vetted engineers with transparent salary floors, placement velocity jumps by 300%.',
    category: 'Autonomous Bidding',
    date: 'Aug 29, 2026',
    readTime: '5 min read',
    author: 'Aiden Vance',
    featured: false,
    badge: 'MARKET TRENDS',
    imageGradient: 'from-[#063970] to-[#0066cc]'
  },
  {
    id: 3,
    title: 'Demographic Masking & Cognitive Testing: The End of Unconscious Hiring Bias',
    description: 'How LetGetIn evaluates the 6 Dimensions of Talent without revealing personal identifiers until the final handshake.',
    category: '6 Dimensions',
    date: 'Aug 21, 2026',
    readTime: '6 min read',
    author: 'Dr. Elena Rostova',
    featured: false,
    badge: 'DEI & MERIT',
    imageGradient: 'from-[#0a192f] to-[#063970]'
  },
  {
    id: 4,
    title: 'Why AI Agents Get Stuck in Keyword Filters (And How Sandboxed Audits Fix It)',
    description: 'Keyword-based screening algorithms inadvertently reject 72% of qualified engineers with non-traditional backgrounds.',
    category: 'Talent Economy',
    date: 'Aug 14, 2026',
    readTime: '3 min read',
    author: 'Tariq Al-Mansoor',
    featured: false,
    badge: 'TECH INSIGHT',
    imageGradient: 'from-[#0066cc] to-[#38bdf8]'
  },
  {
    id: 5,
    title: 'Building Verifiable Identity: From Project Sandboxes to Cryptographic Proof',
    description: 'A deep-dive into how LetGetIn verifies GitHub commits, system architecture diagrams, and adaptive test responses.',
    category: 'Proof of Work',
    date: 'Aug 06, 2026',
    readTime: '7 min read',
    author: 'Engineering Team',
    featured: false,
    badge: 'ARCHITECTURE',
    imageGradient: 'from-[#083361] to-[#061a33]'
  }
];

export const VIDEO_SHOWCASE_LIST: ShowcaseVideo[] = [
  {
    id: 0,
    title: 'LetGetIn Platform Tour: How Verified Proof of Work Replaces Resumes',
    duration: '02:45',
    category: 'PLATFORM WALKTHROUGH',
    speaker: 'Alex Rivera, Head of Product',
    description: 'See the end-to-end flow: from taking an adaptive 10-minute AI skill assessment to receiving pre-negotiated direct company bids.',
    badge: 'Featured Video',
    tag: 'Live Demo',
  },
  {
    id: 1,
    title: 'How Stripe & Global Tech Teams Evaluate LetGetIn Candidates',
    duration: '03:12',
    category: 'HIRING PARTNER CASE STUDY',
    speaker: 'Sarah Mitchell, VP Talent',
    description: 'Why leading engineering leaders use LetGetIn’s 6 Dimensions to cut interview cycles by 60%.',
    badge: 'Case Study',
    tag: 'Enterprise',
  },
  {
    id: 2,
    title: 'Behind the Benchmark: How We Test Code Architecture in Sandboxes',
    duration: '04:05',
    category: 'TECHNICAL DEEP DIVE',
    speaker: 'Dr. Nathan Reed, Chief Scientist',
    description: 'An inside look at our sandboxed code execution engine, edge case generator, and demographic masking layer.',
    badge: 'Engineering',
    tag: 'Research',
  }
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 'testimonial-rahul',
    quote: "I got hired in 11 days. The AI interview was actually fun, and I could see exactly where I stood.",
    author: "Rahul Khanna",
    role: "Data Scientist · Verified",
    initials: "RK",
    rating: 5
  },
  {
    id: 'testimonial-sarah',
    quote: "We reduced our time-to-hire by 60%. The Pathfinder AI delivers candidates that actually match our culture.",
    author: "Sarah Mitchell",
    role: "VP Talent · Stripe",
    initials: "SM",
    rating: 5
  },
  {
    id: 'testimonial-amara',
    quote: "The community is incredible. I've found collaborators, mentors, and my current role — all through LetGetIn.",
    author: "Amara Okafor",
    role: "Product Designer · Lagos",
    initials: "AO",
    rating: 5
  }
];

export const LANDING_NAV_LINKS: NavLinkItem[] = [
  { label: 'Features', href: '#features' },
  { label: 'The 6 Dimensions', href: '#dimensions' },
  { label: 'Why LetGetIn', href: '#shift' },
  { label: 'Testimonials', href: '#updates' },
  { label: 'Blog Matrix', href: '#blog-matrix' },
  { label: 'Video Hub', href: '#video-showcase' },
];
