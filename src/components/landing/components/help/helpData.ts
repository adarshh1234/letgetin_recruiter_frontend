export interface HelpArticleItem {
  id: string;
  slug: string;
  categoryId: string;
  categoryTitle: string;
  title: string;
  description: string;
  readTime: string;
  lastUpdated: string;
  tags: string[];
  keywords: string[];
  content: {
    summary: string;
    sections: {
      heading: string;
      body: string[];
      bullets?: string[];
      callout?: {
        type: 'info' | 'tip' | 'warning' | 'success';
        text: string;
      };
      steps?: {
        stepNumber: number;
        title: string;
        details: string;
      }[];
    }[];
  };
}

export interface HelpCategoryItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  iconName: string;
  badge?: string;
  articles: HelpArticleItem[];
}

export const HELP_CATEGORIES: HelpCategoryItem[] = [
  {
    id: 'getting-started',
    slug: 'getting-started',
    title: 'Getting Started',
    description: 'Everything you need to set up your LetGetIn account, understand verification, and get started.',
    iconName: 'Sparkles',
    badge: 'Essential',
    articles: [
      {
        id: 'welcome',
        slug: 'welcome',
        categoryId: 'getting-started',
        categoryTitle: 'Getting Started',
        title: 'Welcome to LetGetIn',
        description: 'An overview of LetGetIn — the talent platform powered by verified skills and zero bias matching.',
        readTime: '3 min read',
        lastUpdated: 'Sep 2026',
        tags: ['Overview', 'Basics', 'Getting Started'],
        keywords: ['welcome', 'introduction', 'what is letgetin', 'merit', 'verified skills', 'how it works'],
        content: {
          summary: 'LetGetIn is a next-generation merit-based career and hiring platform where verified skills, code sandboxes, and real-world evaluation replace outdated resumes.',
          sections: [
            {
              heading: 'What is LetGetIn?',
              body: [
                'LetGetIn replaces keyword-stuffed CVs with objective skill verification and direct company bidding.',
                'Whether you are an engineer, designer, finance specialist, or healthcare professional, your actual competence is measured through audited sandboxes, adaptive AI evaluations, and real work history.'
              ],
              callout: {
                type: 'info',
                text: 'All members undergo skill benchmarking so companies can make direct bids without months of redundant screening.'
              }
            },
            {
              heading: 'Core Platform Pillars',
              body: [
                'Our ecosystem is built on four core capabilities designed to eliminate hiring friction:'
              ],
              bullets: [
                'Verified Skill Graphs: Multidimensional radar scores across architecture, problem-solving, and speed.',
                'Pathfinder AI: Intelligent matching engine connecting talent to high-impact opportunities in real time.',
                'Direct Company Bids: Verified companies submit compensation bids directly to your talent profile.',
                'Zero-Bias Architecture: Identity-shielded evaluation preserving true meritocracy.'
              ]
            },
            {
              heading: 'Next Steps to Get Moving',
              body: [
                'Follow this sequence to ensure your profile is fully verified and discoverable by top engineering teams:'
              ],
              steps: [
                {
                  stepNumber: 1,
                  title: 'Create & Verify Your Account',
                  details: 'Sign up using your work email or OAuth credentials (GitHub / Google) and confirm your email address.'
                },
                {
                  stepNumber: 2,
                  title: 'Complete Identity & Work Setup',
                  details: 'Upload proof-of-work repositories, link professional identities, and choose your focus tracks.'
                },
                {
                  stepNumber: 3,
                  title: 'Take the Adaptive Assessment',
                  details: 'Spend 10-15 minutes in the APEX evaluation sandbox to earn your verified badge and unlock company bids.'
                }
              ]
            }
          ]
        }
      },
      {
        id: 'creating-your-account',
        slug: 'creating-your-account',
        categoryId: 'getting-started',
        categoryTitle: 'Getting Started',
        title: 'Creating Your Account',
        description: 'How to sign up, verify your identity, and select your primary role profile on LetGetIn.',
        readTime: '2 min read',
        lastUpdated: 'Sep 2026',
        tags: ['Account', 'Sign Up', 'Authentication'],
        keywords: ['register', 'create account', 'sign in', 'oauth', 'github', 'google', 'email verification'],
        content: {
          summary: 'Learn the steps required to register an account on LetGetIn, verify your email, and choose your account persona.',
          sections: [
            {
              heading: 'Registration Methods',
              body: [
                'You can register for LetGetIn using single sign-on (SSO) or standard email authentication:',
                'We support GitHub SSO (recommended for developers and AI engineers), Google SSO, and traditional email with one-time verification tokens.'
              ],
              bullets: [
                'GitHub OAuth: Instantly sync public repo contributions and commit history.',
                'Google OAuth: Quick 1-click account verification.',
                'Work / Personal Email: Secure magic-link or OTP verification.'
              ]
            },
            {
              heading: 'Selecting Your Platform Role',
              body: [
                'During onboarding, you will select your primary role focus:',
                '• Candidate / Specialist: Access job discovery, take skill assessments, and receive direct company bids.',
                '• Employer / Talent Team: Post requisitions, search verified talent pools, and initiate direct bids.',
                '• Enterprise Partner: Access HUREMASO data pipelines, customized benchmarks, and dedicated ATS integrations.'
              ],
              callout: {
                type: 'tip',
                text: 'You can switch personas or invite team members from your Account Settings after initial signup.'
              }
            }
          ]
        }
      },
      {
        id: 'setting-up-your-profile',
        slug: 'setting-up-your-profile',
        categoryId: 'getting-started',
        categoryTitle: 'Getting Started',
        title: 'Setting Up Your Profile',
        description: 'Optimize your LetGetIn profile with verified projects, skill benchmarks, and compensation preferences.',
        readTime: '4 min read',
        lastUpdated: 'Sep 2026',
        tags: ['Profile', 'Verification', 'Projects'],
        keywords: ['profile setup', 'add repo', 'compensation', 'target salary', 'portfolio', 'radar graph'],
        content: {
          summary: 'A well-structured LetGetIn profile highlights your verified competencies, work samples, and target availability.',
          sections: [
            {
              heading: 'Key Elements of a Verified Profile',
              body: [
                'Unlike conventional resumes, LetGetIn profiles are structured around quantifiable verification modules:'
              ],
              bullets: [
                'Identity & Verification Badge: Authenticated email, verified GitHub/portfolio ownership.',
                'The 6 Dimensions Radar: Objective scoring across Technical Depth, Velocity, System Design, Communication, Problem Solving, and Reliability.',
                'Verified Repositories & Artifacts: Code audits run through our security and quality sandbox.',
                'Target Role & Compensation Range: Specify hourly rate or annual salary expectations so you only receive aligned offers.'
              ]
            },
            {
              heading: 'How to Showcase Proof of Work',
              body: [
                'Navigate to Profile > Proof of Work to connect active repositories, design files, or published papers. Our background evaluation engine automatically scans code structure, test coverage, and commit velocity to construct your benchmark score.'
              ]
            }
          ]
        }
      },
      {
        id: 'getting-started-quickstart',
        slug: 'getting-started-quickstart',
        categoryId: 'getting-started',
        categoryTitle: 'Getting Started',
        title: 'Getting Started: 5-Minute Quickstart',
        description: 'Fast-track your onboarding journey and unlock company bids in 5 straightforward steps.',
        readTime: '3 min read',
        lastUpdated: 'Sep 2026',
        tags: ['Quickstart', 'Fast Track', 'Tutorial'],
        keywords: ['quickstart', '5 minute guide', 'first steps', 'start here'],
        content: {
          summary: 'Get up and running on LetGetIn quickly with this 5-minute action checklist.',
          sections: [
            {
              heading: 'Quickstart Checklist',
              body: [
                'Follow this rapid sequence to complete your initial setup:'
              ],
              steps: [
                {
                  stepNumber: 1,
                  title: 'Confirm Email & 2FA',
                  details: 'Activate two-factor authentication under Account Settings for maximum security.'
                },
                {
                  stepNumber: 2,
                  title: 'Select Your Primary Discipline',
                  details: 'Choose AI Engineering, Systems, Frontend/Design, Quantitative Finance, or Healthcare.'
                },
                {
                  stepNumber: 3,
                  title: 'Complete 1 Sandbox Challenge',
                  details: 'Complete a brief 10-minute coding or domain assessment to generate your first verified benchmark score.'
                },
                {
                  stepNumber: 4,
                  title: 'Set Your Availability Status',
                  details: 'Toggle your status to "Actively Open to Bids" or "Casually Browsing".'
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    id: 'platform-guides',
    slug: 'platform-guides',
    title: 'Platform Guides',
    description: 'Detailed instructions on using the dashboard, applications, assessments, AI interviews, and payments.',
    iconName: 'BookOpen',
    badge: 'Guides',
    articles: [
      {
        id: 'dashboard',
        slug: 'dashboard',
        categoryId: 'platform-guides',
        categoryTitle: 'Platform Guides',
        title: 'Dashboard Overview',
        description: 'Navigate your candidate or recruiter control center, monitor real-time metrics, and review active bids.',
        readTime: '3 min read',
        lastUpdated: 'Sep 2026',
        tags: ['Dashboard', 'Analytics', 'Metrics'],
        keywords: ['dashboard', 'home', 'metrics', 'views', 'active bids', 'interview invitations'],
        content: {
          summary: 'The LetGetIn Dashboard acts as your central command hub for viewing match analytics, interview requests, and incoming bids.',
          sections: [
            {
              heading: 'Dashboard Modules Explained',
              body: [
                'Your dashboard is divided into real-time operational tiles:'
              ],
              bullets: [
                'Live Bids Feed: Shows companies actively reviewing your profile with offer ceilings and terms.',
                'Skill Growth Radar: Tracks updates to your verified scores across each dimension.',
                'Upcoming Interviews: Syncs scheduled AI interviews and team meetings with Google/Outlook calendars.',
                'Market Value Index: Displays benchmark compensation percentiles for your verified skill tier.'
              ]
            },
            {
              heading: 'Customizing Your View',
              body: [
                'You can toggle between "Candidate Mode" and "Recruiter Mode" (if authorized) using the perspective switcher in the top navigation.'
              ]
            }
          ]
        }
      },
      {
        id: 'applications',
        slug: 'applications',
        categoryId: 'platform-guides',
        categoryTitle: 'Platform Guides',
        title: 'Applications & Direct Bids',
        description: 'How to discover curated roles, submit proof-of-work applications, and manage incoming company bids.',
        readTime: '4 min read',
        lastUpdated: 'Sep 2026',
        tags: ['Applications', 'Bids', 'Job Search'],
        keywords: ['applications', 'apply', 'direct company bids', 'interview requests', 'accept bid', 'decline bid'],
        content: {
          summary: 'Learn how applications work on LetGetIn and how companies bid directly on your talent profile.',
          sections: [
            {
              heading: 'How Direct Company Bids Work',
              body: [
                'Unlike traditional job boards where you send hundreds of cold resumes, LetGetIn operates with inbound bids: vetted companies inspect your verified skill radar and make formal bids directly.'
              ],
              callout: {
                type: 'success',
                text: 'When a company bids on you, you can accept, negotiate terms, or decline with a single click — without revealing private contact info until you approve.'
              }
            },
            {
              heading: 'Managing Applications',
              body: [
                'You can also proactively browse verified openings in the Explore Roles directory. When you apply, your verified score is submitted immediately, bypassing initial recruiter filters.'
              ]
            }
          ]
        }
      },
      {
        id: 'assessments',
        slug: 'assessments',
        categoryId: 'platform-guides',
        categoryTitle: 'Platform Guides',
        title: 'Assessments & APEX Benchmarking',
        description: 'Understand how our adaptive coding sandbox and domain assessments evaluate technical proficiency.',
        readTime: '5 min read',
        lastUpdated: 'Sep 2026',
        tags: ['Assessments', 'APEX', 'Sandbox', 'Scoring'],
        keywords: ['assessment', 'test', 'coding challenge', 'apex benchmark', 'evaluations', 'sandbox'],
        content: {
          summary: 'LetGetIn assessments evaluate real-world engineering problem solving in interactive sandboxes without trick questions.',
          sections: [
            {
              heading: 'The APEX Evaluation Philosophy',
              body: [
                'Traditional LeetCode-style riddles fail to predict on-the-job effectiveness. Our APEX benchmark simulates realistic scenarios: debugging production codebases, designing microservice schemas, and optimizing runtime bottlenecks.'
              ],
              bullets: [
                'Full IDE Environment: Pre-configured with popular frameworks, linters, and test suites.',
                'Adaptive Difficulty: Questions adjust dynamically based on your solution velocity and architectural choices.',
                'Zero-Cheat Sandbox: Browser-sandboxed execution with tamper-proof audit trails.'
              ]
            },
            {
              heading: 'Retaking Assessments',
              body: [
                'If you wish to improve your score, you can retake an assessment once every 30 days. Your highest verified score is preserved on your public profile.'
              ]
            }
          ]
        }
      },
      {
        id: 'interviews',
        slug: 'interviews',
        categoryId: 'platform-guides',
        categoryTitle: 'Platform Guides',
        title: 'AI Interviews & Live Screening',
        description: 'Prepare for conversational AI technical interviews and company video rounds.',
        readTime: '3 min read',
        lastUpdated: 'Sep 2026',
        tags: ['Interviews', 'AI Screening', 'Preparation'],
        keywords: ['interview', 'ai interview', 'video call', 'screening', 'voice interview', 'tips'],
        content: {
          summary: 'Get ready for conversational AI technical interviews that evaluate system design, communication clarity, and problem decomposition.',
          sections: [
            {
              heading: 'What to Expect in an AI Interview',
              body: [
                'AI interviews on LetGetIn are low-stress, conversational evaluations lasting 5 to 15 minutes. The AI asks probing technical questions about your past projects, tradeoff analysis, and code design decisions.'
              ],
              callout: {
                type: 'tip',
                text: 'Speak naturally, outline your reasoning, and feel free to ask the AI interviewer for clarifications or constraints.'
              }
            },
            {
              heading: 'System Requirements',
              body: [
                'Ensure you have a working microphone, stable internet connection (>5 Mbps), and a supported modern browser (Chrome, Edge, Firefox, or Safari).'
              ]
            }
          ]
        }
      },
      {
        id: 'projects',
        slug: 'projects',
        categoryId: 'platform-guides',
        categoryTitle: 'Platform Guides',
        title: 'Projects & Verified Proof of Work',
        description: 'Connect GitHub repositories, live demo URLs, and design artifacts to earn verification badges.',
        readTime: '3 min read',
        lastUpdated: 'Sep 2026',
        tags: ['Projects', 'Proof of Work', 'GitHub'],
        keywords: ['projects', 'github audit', 'repositories', 'portfolio', 'proof of work'],
        content: {
          summary: 'Showcase authentic proof of work. Learn how our automated code auditors evaluate repository quality.',
          sections: [
            {
              heading: 'Audited Repository Criteria',
              body: [
                'When you link a project repository, LetGetIn analyzes:',
                '• Code Modularization & Architecture',
                '• Test Coverage & CI/CD configuration',
                '• Documentation clarity & README completeness',
                '• Commit cadence and pull-request collaboration patterns'
              ]
            }
          ]
        }
      },
      {
        id: 'payments',
        slug: 'payments',
        categoryId: 'platform-guides',
        categoryTitle: 'Platform Guides',
        title: 'Payments, Contracts & Payouts',
        description: 'Set up your bank accounts, international payout methods, invoices, and tax documentation.',
        readTime: '4 min read',
        lastUpdated: 'Sep 2026',
        tags: ['Payments', 'Billing', 'Contracts', 'Invoices'],
        keywords: ['payments', 'payout', 'bank account', 'stripe', 'invoicing', 'tax form', 'w8ben', 'w9'],
        content: {
          summary: 'Understand contract types, global direct deposit methods, currency conversion, and tax compliance on LetGetIn.',
          sections: [
            {
              heading: 'Global Payout Channels',
              body: [
                'LetGetIn supports automated international contractor payouts across 150+ countries through Stripe Connect, Direct ACH/SEPA bank transfers, and Wise.'
              ],
              bullets: [
                'Direct Deposit (ACH/SEPA): Zero processing fee for USD/EUR domestic transfers.',
                'International Wire: Supported in 120+ local currencies.',
                'Instant Card Payouts: Available in select regions for rapid disbursement.'
              ]
            },
            {
              heading: 'Tax Forms & Compliance',
              body: [
                'US-based professionals can complete W-9 forms digitally. International contractors submit W-8BEN forms through our automated compliance wizard before their first withdrawal.'
              ]
            }
          ]
        }
      }
    ]
  },
  {
    id: 'account-settings',
    slug: 'account-settings',
    title: 'Account & Settings',
    description: 'Manage your profile preferences, privacy controls, email notifications, and enterprise security.',
    iconName: 'Settings',
    badge: 'Account',
    articles: [
      {
        id: 'profile-settings',
        slug: 'profile-settings',
        categoryId: 'account-settings',
        categoryTitle: 'Account & Settings',
        title: 'Profile Settings & Visibility',
        description: 'Control what hiring teams see, manage your custom vanity URL, and adjust stealth mode.',
        readTime: '2 min read',
        lastUpdated: 'Sep 2026',
        tags: ['Profile', 'Visibility', 'Privacy', 'Stealth Mode'],
        keywords: ['profile settings', 'stealth mode', 'hide from current employer', 'custom url', 'visibility'],
        content: {
          summary: 'Tailor your public presence and control which companies can search or view your profile.',
          sections: [
            {
              heading: 'Stealth Mode & Employer Blocking',
              body: [
                'If you are currently employed and want to explore opportunities privately, you can enable Stealth Mode. This automatically masks your identity, current employer name, and contact details from your current organization and affiliated recruiters.'
              ],
              callout: {
                type: 'info',
                text: 'In Stealth Mode, only your verified skills radar and benchmark metrics are visible to hiring companies.'
              }
            }
          ]
        }
      },
      {
        id: 'account-settings-general',
        slug: 'account-settings-general',
        categoryId: 'account-settings',
        categoryTitle: 'Account & Settings',
        title: 'General Account Settings',
        description: 'Update your login email, connected OAuth accounts, preferred language, and data exports.',
        readTime: '3 min read',
        lastUpdated: 'Sep 2026',
        tags: ['Account', 'Email', 'OAuth', 'Data Export'],
        keywords: ['email change', 'delete account', 'data export', 'gdpr', 'connected apps'],
        content: {
          summary: 'Manage your core account credentials, linked authentication providers, and export full platform activity.',
          sections: [
            {
              heading: 'Updating Your Primary Email',
              body: [
                'To change your registered email, go to Account Settings > Login & Security. A confirmation link will be dispatched to both your old and new email addresses to prevent unauthorized transfers.'
              ]
            },
            {
              heading: 'GDPR & Data Export',
              body: [
                'You can download a complete archive of your profile data, assessment results, and interaction logs by clicking "Request Data Export" at the bottom of the Account tab.'
              ]
            }
          ]
        }
      },
      {
        id: 'notifications',
        slug: 'notifications',
        categoryId: 'account-settings',
        categoryTitle: 'Account & Settings',
        title: 'Notifications & Communication Preferences',
        description: 'Configure real-time alerts for incoming bids, interview schedules, and platform news.',
        readTime: '2 min read',
        lastUpdated: 'Sep 2026',
        tags: ['Notifications', 'Email Preferences', 'Alerts'],
        keywords: ['notifications', 'email alerts', 'slack notifications', 'unsubscribe', 'digest'],
        content: {
          summary: 'Customize how and when LetGetIn reaches out to you regarding high-priority hiring events.',
          sections: [
            {
              heading: 'Notification Channels',
              body: [
                'Choose the delivery mechanism for each alert category:'
              ],
              bullets: [
                'Instant Email: Critical alerts such as direct bids, contract offers, and interview schedules.',
                'Weekly Talent Digest: Summary of profile views, skill percentile changes, and trending tech roles.',
                'In-App Badges: Non-intrusive status updates in your dashboard notification center.'
              ]
            }
          ]
        }
      },
      {
        id: 'security-2fa',
        slug: 'security-2fa',
        categoryId: 'account-settings',
        categoryTitle: 'Account & Settings',
        title: 'Security & Two-Factor Authentication (2FA)',
        description: 'Protect your account using TOTP authenticator apps, security keys, and session audit logs.',
        readTime: '3 min read',
        lastUpdated: 'Sep 2026',
        tags: ['Security', '2FA', 'Authentication', 'Passkeys'],
        keywords: ['security', '2fa', 'two factor', 'authenticator', 'totp', 'passkey', 'sessions', 'soc2'],
        content: {
          summary: 'Enforce two-factor authentication and review all active device sessions on your account.',
          sections: [
            {
              heading: 'Setting Up 2FA',
              body: [
                'We recommend enabling TOTP-based two-factor authentication using Google Authenticator, 1Password, or Authy.'
              ],
              steps: [
                {
                  stepNumber: 1,
                  title: 'Navigate to Security Settings',
                  details: 'Go to Settings > Security > Two-Factor Authentication.'
                },
                {
                  stepNumber: 2,
                  title: 'Scan the QR Code',
                  details: 'Open your authenticator app and scan the provided secret QR code.'
                },
                {
                  stepNumber: 3,
                  title: 'Save Recovery Codes',
                  details: 'Download and safely store your single-use recovery codes in an encrypted password manager.'
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    id: 'support',
    slug: 'support',
    title: 'Support & Troubleshooting',
    description: 'Find quick answers to common questions, reach our support team, or submit diagnostic reports.',
    iconName: 'HelpCircle',
    badge: 'Help',
    articles: [
      {
        id: 'faq',
        slug: 'faq',
        categoryId: 'support',
        categoryTitle: 'Support & Troubleshooting',
        title: 'Frequently Asked Questions (FAQ)',
        description: 'Answers to the most common questions from candidates, recruiters, and enterprise teams.',
        readTime: '5 min read',
        lastUpdated: 'Sep 2026',
        tags: ['FAQ', 'Questions', 'Answers'],
        keywords: ['faq', 'frequently asked questions', 'pricing', 'is it free', 'how long assessment', 'recruiter cost'],
        content: {
          summary: 'Quick solutions and answers to common queries regarding pricing, assessment duration, and matching logic.',
          sections: [
            {
              heading: 'Is LetGetIn free for candidates?',
              body: [
                'Yes. LetGetIn is 100% free for individual candidates, engineers, and specialists. You will never be charged for taking assessments, earning verification badges, receiving bids, or signing contracts.'
              ]
            },
            {
              heading: 'How long do assessments take?',
              body: [
                'Most APEX sandbox assessments take between 10 to 20 minutes. You can take them at your own convenience from any modern desktop browser.'
              ]
            },
            {
              heading: 'How are verified skills evaluated?',
              body: [
                'Scores are computed by evaluating code execution speed, algorithmic correctness, architectural modularity, test suite coverage, and real-time problem decomposition.'
              ]
            },
            {
              heading: 'Can I keep my current job private?',
              body: [
                'Yes. Activate Stealth Mode in Profile Settings to conceal your name, contact details, and employer history while remaining discoverable based solely on verified capabilities.'
              ]
            }
          ]
        }
      },
      {
        id: 'contact-support',
        slug: 'contact-support',
        categoryId: 'support',
        categoryTitle: 'Support & Troubleshooting',
        title: 'Contacting Support',
        description: 'How to connect with our specialized customer engineering and candidate support teams.',
        readTime: '2 min read',
        lastUpdated: 'Sep 2026',
        tags: ['Contact', 'Support', 'Help Desk', 'SLA'],
        keywords: ['contact support', 'email support', 'live chat', 'response time', 'customer care'],
        content: {
          summary: 'Get in touch with our team for account assistance, technical bugs, or enterprise onboarding queries.',
          sections: [
            {
              heading: 'Direct Support Inboxes',
              body: [
                'Our global support engineers operate 24/7. Reach out directly via the dedicated inboxes below:'
              ],
              bullets: [
                'Candidate & Technical Support: support@letgetin.com (Average response: < 2 hours)',
                'Employer & Recruiter Queries: hiring@letgetin.com',
                'Enterprise & HUREMASO Partnerships: enterprise@letgetin.com',
                'Security & Privacy Inquiries: security@letgetin.com'
              ]
            },
            {
              heading: 'Customer Care Portal',
              body: [
                'You can also log tickets directly through our internal Customer Care form with attached diagnostic files and screenshots.'
              ]
            }
          ]
        }
      },
      {
        id: 'report-a-problem',
        slug: 'report-a-problem',
        categoryId: 'support',
        categoryTitle: 'Support & Troubleshooting',
        title: 'Reporting a Problem or Bug',
        description: 'Guidelines for submitting reproducible bug reports, sandbox errors, or security disclosures.',
        readTime: '3 min read',
        lastUpdated: 'Sep 2026',
        tags: ['Bug Report', 'Troubleshooting', 'Diagnostics'],
        keywords: ['report bug', 'sandbox error', 'issue', 'problem', 'crash', 'feedback'],
        content: {
          summary: 'Help us resolve issues quickly by including diagnostic information when submitting bug reports.',
          sections: [
            {
              heading: 'What to Include in a Problem Report',
              body: [
                'When reporting an unexpected issue or sandbox crash, please provide:'
              ],
              bullets: [
                'A clear, concise summary of the observed behavior versus expected outcome.',
                'The step-by-step reproduction sequence.',
                'Your browser brand, operating system, and screen resolution.',
                'Console error logs or screenshot attachments if available.'
              ]
            }
          ]
        }
      }
    ]
  }
];

export const ALL_HELP_ARTICLES: HelpArticleItem[] = HELP_CATEGORIES.flatMap(cat => cat.articles);

export const getArticleBySlug = (slug: string): HelpArticleItem | undefined => {
  return ALL_HELP_ARTICLES.find(article => article.slug === slug || article.id === slug);
};

export const getCategoryById = (id: string): HelpCategoryItem | undefined => {
  return HELP_CATEGORIES.find(cat => cat.id === id || cat.slug === id);
};
