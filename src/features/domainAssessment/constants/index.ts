import { AssessmentDifficulty, TestingMode } from '../types';

export interface DomainOption {
  value: string;
  label: string;
  description: string;
  defaultSkills: string[];
}

export const DOMAIN_OPTIONS: DomainOption[] = [
  {
    value: 'fullstack',
    label: 'Full Stack Development',
    description: 'End-to-end web & mobile applications, client architecture & distributed backend APIs',
    defaultSkills: ['Programming & Algorithms', 'Frontend Architecture', 'Backend APIs', 'Databases', 'System Design', 'CI/CD & DevOps'],
  },
  {
    value: 'frontend',
    label: 'Frontend Development',
    description: 'Interactive UI, modern component architecture, state management & client web performance',
    defaultSkills: ['React', 'TypeScript', 'CSS/Tailwind', 'State Management', 'Web Performance', 'Testing (Jest/RTL)'],
  },
  {
    value: 'backend',
    label: 'Backend Development',
    description: 'High-throughput microservices, REST/GraphQL APIs, distributed persistence & caching',
    defaultSkills: ['Node.js/Express', 'REST & GraphQL APIs', 'SQL & NoSQL Databases', 'Caching & Redis', 'System Architecture', 'Security'],
  },
  {
    value: 'devops',
    label: 'DevOps / SRE',
    description: 'Container orchestration, CI/CD automation, cloud infrastructure & reliability engineering',
    defaultSkills: ['Docker & Kubernetes', 'CI/CD Pipelines', 'Cloud Architecture (AWS/GCP)', 'Infrastructure as Code', 'Monitoring & SRE', 'Linux & Networking'],
  },
  {
    value: 'data',
    label: 'Data Engineering / Science',
    description: 'Data modeling, distributed ETL/ELT pipelines, streaming analytics & data warehousing',
    defaultSkills: ['Python', 'SQL & Data Modeling', 'ETL/ELT Pipelines', 'Data Warehousing', 'Spark/Distributed Computing', 'Data Quality'],
  },
  {
    value: 'mobile',
    label: 'Mobile Development',
    description: 'Cross-platform & native mobile apps, offline-first sync, reactive state & mobile security',
    defaultSkills: ['React Native / Flutter', 'Mobile Architecture', 'Offline Storage', 'App Performance', 'API Integration', 'App Security'],
  },
  {
    value: 'cloud',
    label: 'Cloud Architecture',
    description: 'Enterprise cloud topology, serverless frameworks, multi-region high availability & disaster recovery',
    defaultSkills: ['Cloud Architecture', 'Microservices Patterns', 'Serverless', 'High Availability', 'IAM & Cloud Security', 'Cost Optimization'],
  },
  {
    value: 'security',
    label: 'Cybersecurity',
    description: 'AppSec auditing, penetration testing, cryptographic protocols & zero-trust identity architectures',
    defaultSkills: ['OWASP Top 10', 'Authentication & JWT', 'Data Encryption', 'Penetration Testing Concepts', 'Network Security', 'Code Audit'],
  },
  {
    value: 'ml',
    label: 'Machine Learning / AI',
    description: 'Neural networks, LLM agent engineering, vector databases & production MLOps deployment',
    defaultSkills: ['Python & PyTorch', 'Feature Engineering', 'Model Evaluation', 'LLM & Prompt Engineering', 'Vector Databases & RAG', 'MLOps'],
  },
];

export interface TestingModeCard {
  id: TestingMode;
  title: string;
  icon: string;
  badge: string;
  badgeColor: string;
  badgeBg: string;
  description: string;
  actionText: string;
}

export const TESTING_MODE_CARDS: TestingModeCard[] = [
  {
    id: 'coding',
    title: 'Live Coding Challenge',
    icon: '💻',
    badge: 'Live Coding',
    badgeColor: '#166534',
    badgeBg: '#dcfce7',
    description: 'Real-time coding problems with an integrated IDE. Evaluates problem-solving, code quality, and efficiency.',
    actionText: 'Start Challenge',
  },
  {
    id: 'architecture',
    title: 'Software Architecture Design',
    icon: '🏗️',
    badge: 'Customizable',
    badgeColor: '#854d0e',
    badgeBg: '#fef9c3',
    description: 'Design system architecture, choose patterns, justify decisions. Evaluates architectural thinking and trade-off analysis.',
    actionText: 'Configure & Start',
  },
  {
    id: 'system',
    title: 'System Design Round',
    icon: '⚙️',
    badge: 'AI-Evaluated',
    badgeColor: '#6b21a8',
    badgeBg: '#f3e8ff',
    description: 'Design scalable distributed systems. Covers load balancing, caching, databases, and microservices patterns.',
    actionText: 'Begin Assessment',
  },
  {
    id: 'debugging',
    title: 'Code Debugging & Review',
    icon: '🐛',
    badge: 'Timed',
    badgeColor: '#991b1b',
    badgeBg: '#fee2e2',
    description: 'Find and fix bugs in existing codebases. Evaluates attention to detail, debugging methodology, and code review skills.',
    actionText: 'Start Debugging',
  },
  {
    id: 'database',
    title: 'Database & API Design',
    icon: '🗄️',
    badge: 'Adaptive',
    badgeColor: '#1e40af',
    badgeBg: '#dbeafe',
    description: 'Schema design, query optimization, RESTful/GraphQL API design. Tests data modeling and API architecture skills.',
    actionText: 'Explore Drills',
  },
  {
    id: 'security',
    title: 'Security & Best Practices',
    icon: '🛡️',
    badge: '360° Mock',
    badgeColor: '#155e75',
    badgeBg: '#cffafe',
    description: 'Identify vulnerabilities, implement secure coding practices. Covers OWASP top 10, authentication, and encryption.',
    actionText: 'Start Assessment',
  },
];

export const DIFFICULTY_LEVELS: { value: AssessmentDifficulty; label: string; sliderValue: number }[] = [
  { value: 'junior', label: 'Junior', sliderValue: 1 },
  { value: 'mid', label: 'Mid', sliderValue: 2 },
  { value: 'senior', label: 'Senior', sliderValue: 3 },
  { value: 'lead', label: 'Lead', sliderValue: 4 },
  { value: 'principal', label: 'Principal', sliderValue: 5 },
];

export const TIME_LIMIT_OPTIONS = [
  { value: 30, label: '30 min', tier: 'Quick' },
  { value: 60, label: '60 min', tier: 'Standard' },
  { value: 90, label: '90 min', tier: 'Extended' },
  { value: 120, label: '120 min', tier: 'Deep' },
];

export const ALL_SKILL_TAGS = [
  'Programming',
  'Software Architecture',
  'System Design',
  'Data Structures',
  'Algorithms',
  'Databases',
  'API Design',
  'Testing',
  'Debugging',
  'Security',
  'Performance',
  'CI/CD',
  'React',
  'Node.js',
  'TypeScript',
  'Python',
  'Microservices',
  'Cloud Infrastructure',
  'Docker & K8s',
  'Redis & Caching',
];
