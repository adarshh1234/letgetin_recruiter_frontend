"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/landing/Logo";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { useRecruiterStore } from "@/features/recruiter/store/useRecruiterStore";
import {
  LogOut,
  X,
  LayoutGrid,
  PlusCircle,
  KanbanSquare,
  Search,
  Users,
  ListChecks,
  Mic,
  ClipboardCheck,
  GraduationCap,
  Hourglass,
  IdCard,
  Wallet,
  TrendingUp,
  Award,
  Building2,
  Rocket,
  Sparkles,
  Contact,
  Briefcase,
  CheckCircle2,
  CalendarDays,
  BarChart3,
  Gavel,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronsUpDown,
  ChevronRight,
  ChevronDown,
  ShieldCheck,
  ArrowLeftRight,
  UserCheck,
  MessageSquare,
  Bot,
  Video,
  Megaphone,
  UserPlus,
  BrainCircuit,
  Lightbulb,
  Compass,
  Share2,
  Layers,
  AppWindow,
  Building,
  DollarSign,
  Handshake,
  Send,
  Landmark,
  FileCheck,
  Presentation,
  Folder,
  FlaskConical,
  GitBranch,
  GitCommit,
  type LucideIcon,
} from "lucide-react";

interface NavSubItem {
  name: string;
  shortName?: string;
  href: string;
  soon?: boolean;
}

interface NavItem {
  name: string;
  shortName: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  soon?: boolean;
  subItems?: NavSubItem[];
}

const TOP_ITEMS: NavItem[] = [
  {
    name: "Dashboard",
    shortName: "Dashboard",
    href: "/recruiter/dashboard",
    icon: LayoutGrid,
    description: "Recruiter command center & key metrics",
  },
  {
    name: "AI Hire",
    shortName: "AI Hire",
    href: "/recruiter/ai-hire",
    icon: Sparkles,
    description: "Autonomous AI sourcing & screening engine",
  },
  {
    name: "Profile",
    shortName: "Profile",
    href: "/recruiter/profile",
    icon: Contact,
    description: "Organization profile, team & settings",
  },
  {
    name: "Calendar",
    shortName: "Calendar",
    href: "/recruiter/calendar",
    icon: CalendarDays,
    description: "Company events, workforce schedules & shifts",
  },
  {
    name: "Taskmite",
    shortName: "Taskmite",
    href: "/recruiter/taskmite",
    icon: ListChecks,
    description: "Team task delegation, sprint tracking & productivity",
  },
  {
    name: "Verified Resumes",
    shortName: "Verified",
    href: "/recruiter/verified-resumes",
    icon: ShieldCheck,
    description: "Pre-screened candidates with 100% verified credentials",
  },
  {
    name: "Talent Pool",
    shortName: "Talent",
    href: "/recruiter/talent-pool",
    icon: Users,
    description: "Talent pool, CV search & applicant tracking",
    subItems: [
      { name: "Talent Pool", shortName: "Overview", href: "/recruiter/talent-pool" },
      { name: "CV Search", shortName: "CV Search", href: "/recruiter/cv-search" },
      { name: "Candidate List", shortName: "Candidates", href: "/recruiter/candidates" },
      { name: "Track Applicants", shortName: "Track", href: "/recruiter/track" },
    ],
  },
];

const HIRING_ITEMS: NavItem[] = [
  {
    name: "Create Job",
    shortName: "Post Job",
    href: "/recruiter/jobs/create",
    icon: PlusCircle,
    description: "Create and publish new job postings",
  },
  {
    name: "Timeline",
    shortName: "Timeline",
    href: "/recruiter/jobs?tab=timeline",
    icon: GitCommit,
    description: "Stage timeline & progress of currently posted jobs",
  },
  {
    name: "Jobs",
    shortName: "Jobs",
    href: "/recruiter/jobs",
    icon: KanbanSquare,
    description: "Manage active jobs & dynamic hiring pipeline",
    subItems: [
      { name: "Create Job", shortName: "Post Job", href: "/recruiter/jobs/create" },
      { name: "Hiring Timeline", shortName: "Timeline", href: "/recruiter/jobs?tab=timeline" },
      { name: "Kanban Board", shortName: "Kanban", href: "/recruiter/jobs?tab=kanban" },
      { name: "Resume Shortlisting", shortName: "Shortlisting", href: "/recruiter/hiring-pipeline/resume-screening" },
      { name: "Final Shortlist", shortName: "Finalists", href: "/recruiter/hiring-pipeline/final-shortlist" },
      { name: "Candidate Listing", shortName: "Candidates", href: "/recruiter/jobs?tab=candidates" },
    ],
  },
  {
    name: "Candidate Chat",
    shortName: "Chat",
    href: "/recruiter/candidate-chat",
    icon: MessageSquare,
    soon: true,
    description: "Real-time communication with active applicants",
  },
];

const HIRING_FUNNEL_ITEMS: NavItem[] = [
  {
    name: "Shortlist",
    shortName: "Shortlist",
    href: "/recruiter/hiring-pipeline/resume-screening",
    icon: FileCheck,
    description: "Candidate screening, scoring & ATS matching",
  },
  {
    name: "Domain Assessment",
    shortName: "Assessment",
    href: "/recruiter/domain-assessments",
    icon: BrainCircuit,
    description: "Technical, aptitude & domain assessment tests",
  },
  {
    name: "Interview",
    shortName: "Interview",
    href: "/recruiter/interview-schedule",
    icon: Video,
    description: "Schedules, AI interview & video assessment rounds",
    subItems: [
      {
        name: "Interview Schedule",
        shortName: "Schedule",
        href: "/recruiter/interview-schedule",
      },
      {
        name: "AI Interview",
        shortName: "AI Interview",
        href: "/recruiter/ai-interview",
        soon: true,
      },
      {
        name: "Video Interview",
        shortName: "Video",
        href: "/recruiter/video-interview",
        soon: true,
      },
      {
        name: "Interview Buddy",
        shortName: "Buddy",
        href: "/recruiter/interview-buddy",
        soon: true,
      },
    ],
  },
  {
    name: "Background Verification",
    shortName: "Verification",
    href: "/recruiter/background-verification",
    icon: ShieldCheck,
    description: "Employment history, education, identity & police verification",
  },
  {
    name: "Onboarding",
    shortName: "Onboarding",
    href: "/recruiter/onboarding",
    icon: UserCheck,
    description: "Pre-boarding & talent induction workflows",
  },
  {
    name: "Finalist",
    shortName: "Finalist",
    href: "/recruiter/final-list",
    icon: ClipboardCheck,
    soon: true,
    description: "Offer stage, final selections & hire outcomes",
  },
];

const RECRUITMENT_MARKETING_ITEMS: NavItem[] = [
  {
    name: "Ad Management",
    shortName: "Ads",
    href: "/recruiter/ad-management",
    icon: Megaphone,
    soon: true,
    description: "Campaigns and advertising across job portals",
  },
  {
    name: "Collab & Hire",
    shortName: "Collab",
    href: "/recruiter/collab-and-hire",
    icon: UserPlus,
    soon: true,
    description: "Collaborative recruiting and team hiring panels",
  },
  {
    name: "Promote a Job Ad",
    shortName: "Promote",
    href: "/recruiter/promote-job",
    icon: TrendingUp,
    soon: true,
    description: "Boost job listing reach and impression volume",
  },
];

const CAREER_GUIDANCE_ITEMS: NavItem[] = [
  {
    name: "Psychometric Test",
    shortName: "Psychometric",
    href: "/recruiter/psychometric-test",
    icon: BrainCircuit,
    soon: true,
    description: "Behavioral personality and cognitive profiling",
  },
  {
    name: "Genius Test",
    shortName: "Genius",
    href: "/recruiter/genius-test",
    icon: Lightbulb,
    soon: true,
    description: "High-acuity aptitude & logic evaluation",
  },
  {
    name: "Career Counselling",
    shortName: "Counselling",
    href: "/recruiter/career-counselling",
    icon: Compass,
    soon: true,
    description: "AI-guided and expert career guidance",
    subItems: [
      { name: "AI Counselling", shortName: "AI", href: "/recruiter/career-counselling/ai", soon: true },
      { name: "Personal Counselling", shortName: "Personal", href: "/recruiter/career-counselling/personal", soon: true },
    ],
  },
];

const WORKFORCE_ITEMS: NavItem[] = [
  {
    name: "Training",
    shortName: "Training",
    href: "/recruiter/training",
    icon: GraduationCap,
    soon: true,
    description: "Onboarding & talent development tracks",
  },
  {
    name: "Network",
    shortName: "Network",
    href: "/network",
    icon: Share2,
    description: "Professional talent community and contacts",
  },
  {
    name: "Hub",
    shortName: "Hub",
    href: "/myhub",
    icon: Layers,
    description: "Centralized workspace and assets",
  },
  {
    name: "AI Analytics",
    shortName: "Analytics",
    href: "/recruiter/ai-analytics",
    icon: BarChart3,
    soon: true,
    description: "Workforce talent insights & reporting",
    subItems: [
      { name: "AI Analytics", shortName: "Analytics", href: "/recruiter/ai-analytics", soon: true },
      { name: "Report", shortName: "Report", href: "/recruiter/ai-analytics/report", soon: true },
    ],
  },
];

const MANAGEMENT_ITEMS: NavItem[] = [
  {
    name: "Huremaso",
    shortName: "Huremaso",
    href: "/recruiter/huremaso",
    icon: Briefcase,
    soon: true,
    description: "Enterprise workforce operations platform",
  },
  {
    name: "AiMart",
    shortName: "AiMart",
    href: "/recruiter/ai-app-mart",
    icon: AppWindow,
    description: "Curated recruitment AI apps, agents & extensions",
  },
  {
    name: "My Twin Employee",
    shortName: "Twin AI",
    href: "/recruiter/my-twin-employee",
    icon: Bot,
    description: "Autonomous digital recruiter clone & agent workforce",
  },
  {
    name: "Performance",
    shortName: "Reviews",
    href: "/recruiter/performance",
    icon: TrendingUp,
    soon: true,
    description: "Performance appraisals & KPIs",
  },
  {
    name: "Promotion",
    shortName: "Promote",
    href: "/recruiter/promotions",
    icon: Award,
    soon: true,
    description: "Career tracks & internal promotions",
  },
];

const STARTUP_WORKFORCE_ITEMS: NavItem[] = [
  {
    name: "Training",
    shortName: "Training",
    href: "/recruiter/training",
    icon: GraduationCap,
    soon: true,
    description: "Onboarding & talent development tracks",
  },
  {
    name: "Network",
    shortName: "Network",
    href: "/network",
    icon: Share2,
    description: "Professional talent community and contacts",
  },
  {
    name: "Hub",
    shortName: "Hub",
    href: "/myhub",
    icon: Layers,
    description: "Centralized workspace and assets",
  },
  {
    name: "AI Analytics",
    shortName: "Analytics",
    href: "/recruiter/ai-analytics",
    icon: BarChart3,
    soon: true,
    description: "Workforce talent insights & reporting",
    subItems: [
      { name: "AI Analytics", shortName: "Analytics", href: "/recruiter/ai-analytics", soon: true },
      { name: "Report", shortName: "Report", href: "/recruiter/ai-analytics/report", soon: true },
    ],
  },
];

const STARTUP_FUNDRAISING_ITEMS: NavItem[] = [
  {
    name: "Fundraising Pipeline",
    shortName: "Pipeline",
    href: "/recruiter/startup/fundraising-pipeline",
    icon: DollarSign,
    description: "Venture capital & angel investor stage tracking",
  },
  {
    name: "Investors Connect",
    shortName: "Investors",
    href: "/recruiter/startup/investors-connect",
    icon: Handshake,
    description: "Direct network with active angels & seed VCs",
  },
  {
    name: "Auto OutReach",
    shortName: "OutReach",
    href: "/recruiter/startup/auto-outreach",
    icon: Send,
    description: "Automated investor pitch distribution engine",
  },
];

const STARTUP_ECOSYSTEM_ITEMS: NavItem[] = [
  {
    name: "Accelerate",
    shortName: "Accelerate",
    href: "/recruiter/startup/accelerate",
    icon: Rocket,
    description: "Startup growth accelerator programs & tracks",
  },
  {
    name: "Incubator",
    shortName: "Incubator",
    href: "/recruiter/startup/incubator",
    icon: Building,
    description: "Ecosystem incubators, lab space & mentorship",
  },
  {
    name: "Grants",
    shortName: "Grants",
    href: "/recruiter/startup/grants",
    icon: Award,
    description: "Non-dilutive equity grants & competition prizes",
  },
  {
    name: "Govt Schemes",
    shortName: "Govt Schemes",
    href: "/recruiter/startup/govt-schemes",
    icon: Landmark,
    description: "Startup India, state seed fund & tax benefits",
  },
];

const STARTUP_DOCUMENTATION_ITEMS: NavItem[] = [
  {
    name: "Pitch Decks",
    shortName: "Pitch Decks",
    href: "/recruiter/startup/pitch-decks",
    icon: Presentation,
    description: "Investor slides, pitch versions & engagement analytics",
  },
  {
    name: "Data Room & Docs",
    shortName: "Data Room",
    href: "/recruiter/startup/other-documents",
    icon: Folder,
    description: "Cap table, financial model, SAFEs & due diligence room",
  },
  {
    name: "Incorporation documents",
    shortName: "Incorporation",
    href: "/recruiter/startup/incorporation-documents",
    icon: FileCheck,
    description: "Articles of association, MoA & legal bylaws",
  },
  {
    name: "Registrations",
    shortName: "Registrations",
    href: "/recruiter/startup/registrations",
    icon: ClipboardCheck,
    description: "GST, DPIIT, MSME, trademark & IP filings",
  },
];

const STARTUP_BUSINESS_PLUS_ITEMS: NavItem[] = [
  {
    name: "Marketing+",
    shortName: "Marketing+",
    href: "/recruiter/startup/marketing-plus",
    icon: Megaphone,
    description: "Viral loop growth, PR campaigns & early traction",
  },
  {
    name: "R&D",
    shortName: "R&D",
    href: "/recruiter/startup/rnd",
    icon: FlaskConical,
    description: "Research labs, IP prototyping & patent pipeline",
  },
];

const STARTUP_MANAGEMENT_ITEMS: NavItem[] = [
  {
    name: "Huremaso",
    shortName: "Huremaso",
    href: "/recruiter/huremaso",
    icon: Briefcase,
    soon: true,
    description: "Enterprise workforce operations platform",
  },
  {
    name: "AiMart",
    shortName: "AiMart",
    href: "/recruiter/ai-app-mart",
    icon: AppWindow,
    description: "Curated recruitment AI apps, agents & extensions",
  },
  {
    name: "My Twin Employee",
    shortName: "Twin AI",
    href: "/recruiter/my-twin-employee",
    icon: Bot,
    description: "Autonomous digital recruiter clone & agent workforce",
  },
  {
    name: "Performance",
    shortName: "Reviews",
    href: "/recruiter/performance",
    icon: TrendingUp,
    soon: true,
    description: "Performance appraisals & KPIs",
  },
  {
    name: "Promotion",
    shortName: "Promote",
    href: "/recruiter/promotions",
    icon: Award,
    soon: true,
    description: "Career tracks & internal promotions",
  },
  {
    name: "Curemaso",
    shortName: "Curemaso",
    href: "/recruiter/startup/curemaso",
    icon: Briefcase,
    description: "Startup clinical & wellbeing workforce systems",
  },
  {
    name: "Acmaso",
    shortName: "Acmaso",
    href: "/recruiter/startup/acmaso",
    icon: GraduationCap,
    description: "Academic and research institutional partnerships",
  },
  {
    name: "Collask",
    shortName: "Collask",
    href: "/recruiter/startup/collask",
    icon: Users,
    description: "Collaborative workforce and ecosystem syndicates",
  },
];

const INSTITUTION_TOP_ITEMS: NavItem[] = [
  {
    name: "AI Placement",
    shortName: "Placement AI",
    href: "/recruiter/institution/ai-placement",
    icon: Sparkles,
    description: "Autonomous campus placement & candidate matching engine",
  },
  {
    name: "Profile",
    shortName: "Profile",
    href: "/recruiter/profile",
    icon: Contact,
    description: "Organization profile, accreditation & settings",
  },
];

const INSTITUTION_RECORDS_ITEMS: NavItem[] = [
  {
    name: "Students",
    shortName: "Students",
    href: "/recruiter/institution/students",
    icon: Users,
    description: "Student directory & verified resumes",
  },
  {
    name: "Recruiters",
    shortName: "Recruiters",
    href: "/recruiter/institution/recruiters",
    icon: Building2,
    description: "Partner corporate relations & recruiters",
  },
];

const INSTITUTION_PLACEMENT_SUITE_ITEMS: NavItem[] = [
  {
    name: "Companys Onboard",
    shortName: "Onboard",
    href: "/recruiter/institution/companies-onboard",
    icon: Handshake,
    description: "Corporate recruiter onboarding & MOUs",
  },
  {
    name: "Campus recruitment",
    shortName: "Drives",
    href: "/recruiter/institution/campus-recruitment",
    icon: Building2,
    description: "Campus placement drives & schedules",
    subItems: [
      { name: "Kanban", shortName: "Kanban", href: "/recruiter/institution/campus-recruitment/kanban" },
      { name: "Calendar", shortName: "Calendar", href: "/recruiter/institution/campus-recruitment/calendar" },
    ],
  },
  {
    name: "Jobs",
    shortName: "Jobs",
    href: "/recruiter/institution/jobs",
    icon: Briefcase,
    description: "Campus drive listings & employment tracks",
    subItems: [
      { name: "Create Job", shortName: "Post Job", href: "/recruiter/institution/jobs/create" },
      { name: "Kanban", shortName: "Kanban", href: "/recruiter/institution/jobs/kanban" },
      { name: "Jobs Fair", shortName: "Jobs Fair", href: "/recruiter/institution/jobs/jobs-fair" },
      { name: "Internships", shortName: "Internships", href: "/recruiter/institution/jobs/internships" },
      { name: "Apprenticeships", shortName: "Apprentice", href: "/recruiter/institution/jobs/apprenticeships" },
      { name: "Junior Trainee", shortName: "Trainee", href: "/recruiter/institution/jobs/junior-trainee" },
    ],
  },
  {
    name: "TrackApplicant",
    shortName: "Track",
    href: "/recruiter/institution/track-applicant",
    icon: UserCheck,
    description: "Student application tracker & status",
  },
  {
    name: "Finalists",
    shortName: "Finalists",
    href: "/recruiter/institution/finalists",
    icon: ClipboardCheck,
    description: "Selected candidates & offer letter tracking",
  },
];

const INSTITUTION_PLACEMENT_MARKETING_ITEMS: NavItem[] = [
  {
    name: "Ad Management",
    shortName: "Ads",
    href: "/recruiter/ad-management",
    icon: Megaphone,
    description: "Placement campaigns and portal sponsorships",
  },
  {
    name: "Colab and Placement",
    shortName: "Placement Collab",
    href: "/recruiter/institution/colab-and-placement",
    icon: Handshake,
    description: "Inter-college & corporate placement syndicates",
  },
  {
    name: "Colab and Hire",
    shortName: "Collab",
    href: "/recruiter/collab-and-hire",
    icon: UserPlus,
    description: "Joint placement panels & shared recruitment",
  },
  {
    name: "Promote Admission",
    shortName: "Admissions",
    href: "/recruiter/institution/promote-admission",
    icon: TrendingUp,
    description: "Campus admission promotion & enrollment reach",
  },
];

const ENTITY_ICON: Record<string, LucideIcon> = {
  company: Building2,
  institution: GraduationCap,
  startup: Rocket,
};

interface RecruiterShellProps {
  isOpen?: boolean;
  onClose?: () => void;
}

function resolveActiveHref(
  pathname: string,
  allItems: NavItem[],
): string | null {
  let best: string | null = null;
  for (const item of allItems) {
    const list = [item.href, ...(item.subItems?.map((s) => s.href) || [])];
    for (const href of list) {
      const cleanHref = href.split("?")[0];
      const matches =
        pathname === cleanHref ||
        (cleanHref !== "/recruiter" && pathname.startsWith(cleanHref + "/"));
      if (
        matches &&
        (!best || cleanHref.length > (best.split("?")[0]?.length || 0))
      ) {
        best = href;
      }
    }
  }
  return best;
}

export function RecruiterShell({
  isOpen = false,
  onClose,
}: RecruiterShellProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { orgProfile, loadOrgProfile } = useRecruiterStore();

  const checkSubActive = (subHref: string) => {
    if (subHref.includes("?")) {
      const [subPath, subQuery] = subHref.split("?");
      const params = new URLSearchParams(subQuery);
      const tabParam = params.get("tab");
      if (tabParam && pathname === subPath) {
        return (searchParams.get("tab") || "timeline") === tabParam;
      }
    }
    return subHref === pathname || activeHref === subHref;
  };

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const profileRef = useRef<HTMLDivElement>(null);

  const toggleSubmenu = (href: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [href]: !prev[href] }));
  };

  // Load collapsed preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("recruiter_sidebar_collapsed");
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {
      // ignore localStorage errors
    }
  }, []);

  // Click outside to close profile popover
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    }
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isProfileOpen]);

  useEffect(() => {
    loadOrgProfile().catch(() => {});
  }, [loadOrgProfile]);

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("recruiter_sidebar_collapsed", String(next));
      } catch {}
      return next;
    });
  };

  const handleLogout = async () => {
    setIsProfileOpen(false);
    if (onClose) onClose();
    await logout();
    router.push("/auth");
  };

  const displayName = user?.fullName || user?.username || "Recruiter Account";
  const firstName = displayName.split(" ")[0] || "Recruiter";
  const email = user?.email || "";
  const firstLetter = (displayName || email || "R").charAt(0).toUpperCase();
  const avatarUrl = user?.avatarUrl || user?.avatar;
  const EntityIcon = orgProfile
    ? ENTITY_ICON[orgProfile.entity] || Building2
    : Building2;
  const isInstitution = orgProfile?.entity === "institution";
  const isStartup = orgProfile?.entity === "startup";

  const allItems = [
    ...(isInstitution
      ? [
          ...INSTITUTION_TOP_ITEMS,
          ...INSTITUTION_RECORDS_ITEMS,
          ...INSTITUTION_PLACEMENT_SUITE_ITEMS,
          ...HIRING_ITEMS,
          ...HIRING_FUNNEL_ITEMS,
          ...INSTITUTION_PLACEMENT_MARKETING_ITEMS,
          ...CAREER_GUIDANCE_ITEMS,
          ...WORKFORCE_ITEMS,
          ...MANAGEMENT_ITEMS,
        ]
      : isStartup
      ? [
          ...TOP_ITEMS,
          ...HIRING_ITEMS,
          ...HIRING_FUNNEL_ITEMS,
          ...RECRUITMENT_MARKETING_ITEMS,
          ...CAREER_GUIDANCE_ITEMS,
          ...STARTUP_WORKFORCE_ITEMS,
          ...STARTUP_FUNDRAISING_ITEMS,
          ...STARTUP_ECOSYSTEM_ITEMS,
          ...STARTUP_DOCUMENTATION_ITEMS,
          ...STARTUP_BUSINESS_PLUS_ITEMS,
          ...STARTUP_MANAGEMENT_ITEMS,
        ]
      : [
          ...TOP_ITEMS,
          ...HIRING_ITEMS,
          ...HIRING_FUNNEL_ITEMS,
          ...RECRUITMENT_MARKETING_ITEMS,
          ...CAREER_GUIDANCE_ITEMS,
          ...WORKFORCE_ITEMS,
          ...MANAGEMENT_ITEMS,
        ]),
  ];
  const activeHref = resolveActiveHref(pathname, allItems);

  const isItemActive = (item: NavItem) => {
    // If item has a query param (e.g. Timeline: "/recruiter/jobs?tab=timeline")
    if (item.href.includes("?")) {
      const [subPath, subQuery] = item.href.split("?");
      const params = new URLSearchParams(subQuery);
      const tabParam = params.get("tab");
      if (tabParam && pathname === subPath) {
        return (searchParams?.get("tab") || "timeline") === tabParam;
      }
      return false;
    }

    // Check if any child sub-item is active
    if (item.subItems?.some((s) => checkSubActive(s.href))) {
      return true;
    }

    // Special handling for "/recruiter/jobs" (Jobs menu)
    if (item.href === "/recruiter/jobs") {
      const currentTab = searchParams?.get("tab");
      if (
        (pathname === "/recruiter/jobs" && currentTab === "timeline") ||
        pathname === "/recruiter/jobs/timeline"
      ) {
        return false;
      }
      if (pathname === "/recruiter/jobs/create") {
        return false;
      }
      return (
        pathname === "/recruiter/jobs" ||
        (pathname.startsWith("/recruiter/jobs/") && pathname !== "/recruiter/jobs/create")
      );
    }

    // Shortlist / Resume Screening
    if (item.href === "/recruiter/hiring-pipeline/resume-screening") {
      return (
        pathname === "/recruiter/hiring-pipeline/resume-screening" ||
        pathname === "/recruiter/shortlist"
      );
    }

    // Domain Assessment
    if (
      item.href === "/recruiter/domain-assessments" ||
      item.href === "/recruiter/ai-assessment"
    ) {
      return (
        pathname.startsWith("/recruiter/domain-assessments") ||
        pathname === "/recruiter/ai-assessment" ||
        pathname === "/recruiter/domain-assessment"
      );
    }

    // General matching
    return (
      item.href === activeHref ||
      pathname === item.href ||
      (item.href !== "/recruiter" && pathname.startsWith(item.href + "/"))
    );
  };

  // Renders a navigation group in full or mini mode
  const renderNavGroup = (title: string, items: NavItem[]) => {
    if (isCollapsed) {
      return (
        <div className="space-y-1.5">
          {items.map((item) => {
            const Icon = item.icon;
            const hasSub = !!item.subItems?.length;
            const isActive = isItemActive(item);

            return (
              <div
                key={item.href}
                className="relative group flex justify-center w-full"
              >
                <Link
                  href={item.href}
                  onClick={onClose}
                  className={`w-[68px] py-2 px-1 rounded-2xl flex flex-col items-center justify-center transition-all group/item ${
                    isActive
                      ? "bg-gradient-brand text-primary-foreground shadow-glow font-bold"
                      : "text-ink-soft hover:text-ink hover:bg-surface-alt/70"
                  }`}
                  aria-label={item.name}
                >
                  <div className="relative">
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-transform group-hover/item:scale-110 ${
                        isActive
                          ? "text-primary-foreground"
                          : "text-primary-glow"
                      }`}
                    />
                    {item.soon && !isActive && (
                      <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
                    )}
                  </div>
                  <span
                    className={`text-[9.5px] font-semibold tracking-tight text-center truncate max-w-[62px] leading-none mt-1.5 ${
                      isActive
                        ? "text-primary-foreground"
                        : "text-ink-soft group-hover/item:text-ink"
                    }`}
                  >
                    {item.shortName}
                  </span>
                </Link>

                {/* Floating Tooltip / Flyout in Mini Mode */}
                <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3.5 py-2.5 bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold rounded-2xl shadow-2xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity z-50 border border-slate-700 min-w-[150px]">
                  <div className="flex items-center justify-between gap-2">
                    <span>{item.name}</span>
                    {item.soon && (
                      <span className="text-[9px] font-bold text-primary-glow bg-primary/20 px-1.5 py-0.5 rounded-full">
                        Soon
                      </span>
                    )}
                  </div>
                  {item.description && (
                    <div className="text-[10px] text-slate-300 font-normal mt-0.5 max-w-[200px] whitespace-normal">
                      {item.description}
                    </div>
                  )}

                  {/* Flyout Subitems */}
                  {hasSub && (
                    <div className="mt-2 pt-2 border-t border-slate-700/80 space-y-1">
                      {item.subItems!.map((sub) => {
                        const isSubActive = checkSubActive(sub.href);
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={onClose}
                            className={`flex items-center justify-between gap-2 px-2 py-1 rounded-lg text-[10.5px] transition ${
                              isSubActive
                                ? "bg-primary text-white font-bold"
                                : "text-slate-300 hover:text-white hover:bg-slate-700/60 font-medium"
                            }`}
                          >
                            <span>{sub.name}</span>
                            {sub.soon && (
                              <span className="text-[8px] bg-primary/30 text-primary-glow px-1 py-0.2 rounded-full">
                                Soon
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    // Full Expanded View
    return (
      <div>
        {title && (
          <div className="px-3 mb-2 text-[10px] font-extrabold uppercase tracking-widest text-ink-soft">
            {title}
          </div>
        )}
        <nav className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const hasSub = !!item.subItems?.length;
            const isHighlighted = isItemActive(item);
            const isOpen =
              openSubmenus[item.href] !== undefined
                ? openSubmenus[item.href]
                : isHighlighted;

            return (
              <div key={item.href} className="space-y-0.5">
                <div
                  className={`group relative flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                    isHighlighted
                      ? "bg-gradient-brand text-primary-foreground shadow-glow font-bold"
                      : "text-ink-soft hover:text-ink hover:bg-surface-alt/70"
                  }`}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isHighlighted
                          ? "text-primary-foreground"
                          : "text-primary-glow"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="truncate">{item.name}</div>
                      {!isHighlighted && item.description && (
                        <div className="text-[10px] text-ink-soft/70 truncate group-hover:text-ink-soft transition">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {item.soon && !isHighlighted && (
                      <span className="text-[9px] font-bold text-primary-glow bg-primary/10 px-1.5 py-0.5 rounded-full">
                        Soon
                      </span>
                    )}
                    {hasSub ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleSubmenu(item.href);
                        }}
                        className="p-1 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition cursor-pointer"
                        aria-label="Toggle Submenu"
                      >
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          } ${isHighlighted ? "text-primary-foreground" : "text-ink-soft"}`}
                        />
                      </button>
                    ) : (
                      isHighlighted && (
                        <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-80 text-primary-foreground" />
                      )
                    )}
                  </div>
                </div>

                {/* Submenu Accordion */}
                {hasSub && isOpen && (
                  <div className="ml-4 pl-3.5 border-l-2 border-primary/20 space-y-1 py-1">
                    {item.subItems!.map((sub) => {
                      const isSubActive = checkSubActive(sub.href);

                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          onClick={onClose}
                          className={`flex items-center justify-between px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all ${
                            isSubActive
                              ? "bg-primary/15 text-primary-glow font-bold border border-primary/25"
                              : "text-ink-soft hover:text-ink hover:bg-surface-alt/60"
                          }`}
                        >
                          <span className="truncate">{sub.name}</span>
                          {sub.soon && (
                            <span className="text-[8px] font-bold text-primary-glow bg-primary/10 px-1 py-0.2 rounded-full">
                              Soon
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    );
  };

  const sidebarContent = (
    <div
      className={`flex flex-col h-full bg-surface border-r border-border select-none shadow-sm transition-all duration-300 ease-in-out relative ${
        isCollapsed ? "w-20" : "w-64 lg:w-60"
      }`}
    >
      {/* Sidebar Header with Brand Logo & Minimize Toggle Button */}
      <div
        className={`p-4 border-b border-border flex items-center ${
          isCollapsed
            ? "justify-center flex-col gap-2.5 py-4"
            : "justify-between"
        }`}
      >
        {isCollapsed ? (
          <>
            <Link
              href="/recruiter/dashboard"
              className="w-10 h-10 rounded-2xl bg-gradient-brand flex items-center justify-center text-primary-foreground font-extrabold text-base shadow-glow hover:scale-105 transition shrink-0"
              title="LetGetIn Recruiter"
            >
              L
            </Link>
            <button
              type="button"
              onClick={toggleCollapsed}
              className="p-1.5 rounded-xl text-ink-soft hover:text-primary-glow hover:bg-surface-alt transition cursor-pointer"
              title="Expand Sidebar"
              aria-label="Expand Sidebar"
            >
              <PanelLeftOpen className="w-4 h-4 text-primary-glow" />
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2.5 min-w-0">
              <Logo href="/recruiter/dashboard" />
            </div>

            <div className="flex items-center gap-1">
              {/* Minimize Sidebar Button for Desktop */}
              <button
                type="button"
                onClick={toggleCollapsed}
                className="hidden lg:flex p-2 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
                title="Minimize Sidebar"
                aria-label="Minimize Sidebar"
              >
                <PanelLeftClose className="w-5 h-5 text-ink-soft hover:text-primary-glow" />
              </button>

              {/* Close Drawer Button for Mobile */}
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="lg:hidden p-1.5 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
                  aria-label="Close Sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Organization Identity Card */}
      {isCollapsed ? (
        <div className="p-2 border-b border-border flex justify-center">
          <div className="relative group">
            <Link
              href="/recruiter/profile"
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-gradient-brand text-primary-foreground flex items-center justify-center shadow-glow hover:scale-105 transition shrink-0"
            >
              <EntityIcon className="w-4 h-4" />
            </Link>
            <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-slate-900 dark:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-2xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 border border-slate-700">
              <div className="font-bold">
                {orgProfile?.name || "Organization Profile"}
              </div>
              <div className="text-[10px] text-slate-300 capitalize">
                {orgProfile?.entity || user?.entityType || "Recruiter"}{" "}
                Workspace
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Link
          href="/recruiter/profile"
          onClick={onClose}
          className="mx-3 my-2.5 px-3 py-2.5 rounded-2xl border border-border/80 bg-surface-alt/50 hover:bg-surface-alt transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-brand text-primary-foreground flex items-center justify-center shadow-glow shrink-0 group-hover:scale-105 transition-transform">
              <EntityIcon className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-ink truncate group-hover:text-primary-glow transition-colors">
                {orgProfile?.name || "Setup Organization"}
              </div>
              <div className="text-[10px] text-ink-soft capitalize flex items-center gap-1">
                <span>
                  {orgProfile?.entity || user?.entityType || "Recruiter"}
                </span>
                <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block" />
                <span className="text-emerald-500 font-medium">Pro</span>
              </div>
            </div>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-ink-soft group-hover:text-primary-glow group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>
      )}

      {/* Main Navigation Scroll Area */}
      <div
        className={`flex-1 overflow-y-auto ${
          isCollapsed ? "p-2 space-y-3" : "p-3 space-y-5"
        } scrollbar-thin`}
      >
        {renderNavGroup("", isInstitution ? INSTITUTION_TOP_ITEMS : TOP_ITEMS)}
        {isInstitution ? (
          <>
            {renderNavGroup("Records", INSTITUTION_RECORDS_ITEMS)}
            {renderNavGroup("Placement Suite", INSTITUTION_PLACEMENT_SUITE_ITEMS)}
            {renderNavGroup("Hiring Suite", HIRING_ITEMS)}
            {renderNavGroup("Hiring Funnel", HIRING_FUNNEL_ITEMS)}
            {renderNavGroup("Placement Marketing", INSTITUTION_PLACEMENT_MARKETING_ITEMS)}
            {renderNavGroup("Career Guidance", CAREER_GUIDANCE_ITEMS)}
            {renderNavGroup("Workforce", WORKFORCE_ITEMS)}
            {renderNavGroup("Management", MANAGEMENT_ITEMS)}
          </>
        ) : isStartup ? (
          <>
            {renderNavGroup("Hiring Suite", HIRING_ITEMS)}
            {renderNavGroup("Hiring Funnel", HIRING_FUNNEL_ITEMS)}
            {renderNavGroup("Recruitment Marketing", RECRUITMENT_MARKETING_ITEMS)}
            {renderNavGroup("Career Guidance", CAREER_GUIDANCE_ITEMS)}
            {renderNavGroup("Workforce", STARTUP_WORKFORCE_ITEMS)}
            {renderNavGroup("Fundraising", STARTUP_FUNDRAISING_ITEMS)}
            {renderNavGroup("Ecosystem", STARTUP_ECOSYSTEM_ITEMS)}
            {renderNavGroup("Documentation", STARTUP_DOCUMENTATION_ITEMS)}
            {renderNavGroup("Business+", STARTUP_BUSINESS_PLUS_ITEMS)}
            {renderNavGroup("Management", STARTUP_MANAGEMENT_ITEMS)}
          </>
        ) : (
          <>
            {renderNavGroup("Hiring Suite", HIRING_ITEMS)}
            {renderNavGroup("Hiring Funnel", HIRING_FUNNEL_ITEMS)}
            {renderNavGroup("Recruitment Marketing", RECRUITMENT_MARKETING_ITEMS)}
            {renderNavGroup("Career Guidance", CAREER_GUIDANCE_ITEMS)}
            {renderNavGroup("Workforce", WORKFORCE_ITEMS)}
            {renderNavGroup("Management", MANAGEMENT_ITEMS)}
          </>
        )}
      </div>

      {/* User Profile SaaS Footer Trigger & Popover Box */}
      <div
        ref={profileRef}
        className={`border-t border-border bg-surface-alt/40 relative ${
          isCollapsed ? "p-2 flex flex-col items-center" : "p-2.5"
        }`}
      >
        {/* Profile Card Trigger Button */}
        {isCollapsed ? (
          <div className="flex flex-col items-center gap-1 w-full">
            <button
              type="button"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              className="relative p-0.5 rounded-2xl hover:ring-2 hover:ring-primary-glow/50 transition-all cursor-pointer group"
              aria-label="Open User Profile Menu"
            >
              {avatarUrl ? (
                <div className="w-10 h-10 rounded-2xl overflow-hidden ring-1 ring-border shadow-sm shrink-0">
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-2xl bg-gradient-brand text-primary-foreground font-extrabold text-sm flex items-center justify-center shadow-glow shrink-0 group-hover:scale-105 transition-transform">
                  {firstLetter}
                </div>
              )}
              {/* Online Indicator */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-surface" />
            </button>
            <span className="text-[9.5px] font-semibold text-ink-soft text-center truncate max-w-[58px] leading-tight">
              {firstName}
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className="w-full flex items-center justify-between p-2 rounded-2xl hover:bg-surface-alt transition-all group/profile cursor-pointer border border-transparent hover:border-border/60 text-left"
            aria-label="Open User Profile Menu"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                {avatarUrl ? (
                  <div className="w-9 h-9 rounded-xl overflow-hidden ring-1 ring-border shadow-xs">
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-xl bg-gradient-brand text-primary-foreground font-extrabold text-xs flex items-center justify-center shadow-glow group-hover/profile:scale-105 transition-transform">
                    {firstLetter}
                  </div>
                )}
                {/* Online Indicator */}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-surface" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-ink truncate group-hover/profile:text-primary-glow transition-colors">
                  {displayName}
                </div>
                <div className="text-[10px] text-ink-soft truncate">
                  {email}
                </div>
              </div>
            </div>
            <ChevronsUpDown
              className={`w-4 h-4 text-ink-soft transition-transform duration-200 shrink-0 ${
                isProfileOpen
                  ? "rotate-180 text-primary-glow"
                  : "group-hover/profile:text-ink"
              }`}
            />
          </button>
        )}

        {/* ======================================================== */}
        {/* SAAS USER PROFILE MODAL / POPOVER BOX                    */}
        {/* ======================================================== */}
        {isProfileOpen && (
          <div
            className={`absolute z-50 bg-surface border border-border rounded-3xl shadow-2xl p-4 space-y-3.5 animate-in fade-in zoom-in-95 duration-150 ${
              isCollapsed
                ? "left-[calc(100%+12px)] bottom-2 w-72"
                : "bottom-[calc(100%+8px)] left-2 right-2 w-[calc(100%-16px)] sm:w-72"
            }`}
          >
            {/* User Identity Header */}
            <div className="flex items-start gap-3 pb-3 border-b border-border">
              <div className="relative shrink-0">
                {avatarUrl ? (
                  <div className="w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-primary-glow/30 shadow-md">
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-gradient-brand text-primary-foreground font-extrabold text-base flex items-center justify-center shadow-glow">
                    {firstLetter}
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-surface" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-extrabold text-ink truncate">
                  {displayName}
                </h4>
                <p className="text-[11px] text-ink-soft truncate">{email}</p>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-2.5 h-2.5 text-primary-glow" />
                    {isInstitution ? "Institution" : "Recruiter Pro"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[9.5px] font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-2.5 h-2.5 text-emerald-500" />
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Organization Snapshot */}
            <div className="bg-surface-alt/70 border border-border/80 rounded-2xl p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-gradient-brand text-primary-foreground flex items-center justify-center shrink-0 shadow-xs">
                  <EntityIcon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-ink truncate">
                    {orgProfile?.name || "Organization Hub"}
                  </div>
                  <div className="text-[9.5px] text-ink-soft capitalize">
                    {orgProfile?.entity || user?.entityType || "Recruiter"}{" "}
                    Workspace
                  </div>
                </div>
              </div>
              <Link
                href="/recruiter/profile"
                onClick={() => {
                  setIsProfileOpen(false);
                  if (onClose) onClose();
                }}
                className="text-[10px] font-bold text-primary-glow hover:underline shrink-0 px-2 py-1 bg-primary/10 rounded-lg"
              >
                Settings
              </Link>
            </div>

            {/* Quick SaaS Menu Actions */}
            <div className="space-y-1 pt-1">
              <Link
                href="/recruiter/profile"
                onClick={() => {
                  setIsProfileOpen(false);
                  if (onClose) onClose();
                }}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-ink hover:text-primary-glow hover:bg-surface-alt transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="w-4 h-4 text-primary-glow" />
                  <span>Account & Company Profile</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-ink-soft opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                href="/recruiter/ai-hire"
                onClick={() => {
                  setIsProfileOpen(false);
                  if (onClose) onClose();
                }}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-ink hover:text-primary-glow hover:bg-surface-alt transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-primary-glow" />
                  <span>AI Hire Suite</span>
                </div>
                <span className="text-[9px] font-bold text-primary-glow bg-primary/10 px-1.5 py-0.5 rounded-full">
                  AI
                </span>
              </Link>
            </div>

            {/* Divider */}
            <div className="border-t border-border pt-1" />

            {/* Logout Action */}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 border border-destructive/20 hover:border-destructive/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <LogOut className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span>Sign Out</span>
              </div>
              <span className="text-[10px] text-destructive/70 font-semibold bg-destructive/10 px-1.5 py-0.5 rounded-md">
                Log Out
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`hidden lg:block sticky top-0 h-screen shrink-0 z-30 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-64 lg:w-60"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in"
            onClick={onClose}
          />
          <div className="relative z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
