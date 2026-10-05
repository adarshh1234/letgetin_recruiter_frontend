"use client";

import React, { useState, useMemo } from "react";
import {
  AppWindow,
  Search,
  Sparkles,
  Star,
  CheckCircle2,
  SlidersHorizontal,
  Download,
  ExternalLink,
  ShieldCheck,
  Zap,
  Bot,
  BrainCircuit,
  MessageSquare,
  FileCheck,
  Video,
  Layers,
  Settings,
  X,
  ChevronRight,
  TrendingUp,
  Cpu,
  BadgePercent,
} from "lucide-react";

interface AIApp {
  id: string;
  name: string;
  developer: string;
  category: "sourcing" | "interview" | "testing" | "verification" | "onboarding";
  categoryLabel: string;
  rating: number;
  reviewCount: number;
  installs: string;
  iconBg: string;
  iconColor: string;
  shortDesc: string;
  features: string[];
  isFeatured?: boolean;
  isInstalled: boolean;
  pricing: "Free" | "Pro" | "Enterprise Included";
  badge?: string;
}

const ALL_APPS: AIApp[] = [
  {
    id: "app-1",
    name: "Resume Matcher Ultra",
    developer: "LetGetIn Core AI",
    category: "sourcing",
    categoryLabel: "Sourcing & Screening",
    rating: 4.9,
    reviewCount: 840,
    installs: "14.2k",
    iconBg: "from-blue-600 to-indigo-600",
    iconColor: "text-white",
    shortDesc: "Semantic vector search parsing 1,000s of CVs per minute against JD benchmarks.",
    features: [
      "Dynamic skillset gap identification",
      "Blind recruitment anti-bias sanitization",
      "Automated rejection and shortlist emails",
    ],
    isFeatured: true,
    isInstalled: true,
    pricing: "Enterprise Included",
    badge: "Staff Pick",
  },
  {
    id: "app-2",
    name: "VoiceScreen Live AI",
    developer: "LetGetIn Labs & ElevenLabs",
    category: "interview",
    categoryLabel: "Interview & Voice AI",
    rating: 4.8,
    reviewCount: 620,
    installs: "9.8k",
    iconBg: "from-emerald-500 to-teal-600",
    iconColor: "text-white",
    shortDesc: "Autonomous conversational AI recruiter that conducts 10-minute preliminary phone screenings.",
    features: [
      "Natural conversational cadence & latency <300ms",
      "Dynamic follow-up probing questions",
      "Instant transcript & sentiment rubric generation",
    ],
    isFeatured: true,
    isInstalled: true,
    pricing: "Pro",
    badge: "Trending",
  },
  {
    id: "app-3",
    name: "Genius CodeExaminer Pro",
    developer: "CompilerAI Labs",
    category: "testing",
    categoryLabel: "Skills & Code Testing",
    rating: 4.9,
    reviewCount: 1120,
    installs: "22.5k",
    iconBg: "from-purple-600 to-pink-600",
    iconColor: "text-white",
    shortDesc: "Real-time AI proctored coding sandboxes across 40+ programming languages.",
    features: [
      "AI plagiarism and ChatGPT code generation detection",
      "Time and space algorithmic complexity grading",
      "Interactive debugger and live playback for interviewers",
    ],
    isFeatured: true,
    isInstalled: false,
    pricing: "Free",
    badge: "Popular",
  },
  {
    id: "app-4",
    name: "Candidate WhatsApp Co-Pilot",
    developer: "OmniReach Integration",
    category: "sourcing",
    categoryLabel: "Sourcing & Screening",
    rating: 4.7,
    reviewCount: 430,
    installs: "8.1k",
    iconBg: "from-green-500 to-emerald-700",
    iconColor: "text-white",
    shortDesc: "24/7 automated candidate engagement via WhatsApp for scheduling, reminders, and FAQs.",
    features: [
      "Automated interview rescheduling via chat",
      "Document collection and PDF validation",
      "94% open rate within 5 minutes",
    ],
    isInstalled: true,
    pricing: "Enterprise Included",
  },
  {
    id: "app-5",
    name: "CultureFit Sentinel",
    developer: "PsychoMetric AI Systems",
    category: "interview",
    categoryLabel: "Interview & Voice AI",
    rating: 4.6,
    reviewCount: 310,
    installs: "5.4k",
    iconBg: "from-amber-500 to-orange-600",
    iconColor: "text-white",
    shortDesc: "Evaluates teamwork, adaptability, and leadership values based on behavioral interview responses.",
    features: [
      "Big Five & OCEAN cognitive behavioral breakdown",
      "Cross-team synergy compatibility index",
      "Targeted interview guide for final executive round",
    ],
    isInstalled: false,
    pricing: "Pro",
  },
  {
    id: "app-6",
    name: "VeriCheck Instant Background",
    developer: "TrustID Global",
    category: "verification",
    categoryLabel: "Background & Verification",
    rating: 4.8,
    reviewCount: 512,
    installs: "11.0k",
    iconBg: "from-cyan-600 to-blue-700",
    iconColor: "text-white",
    shortDesc: "Automated identity, degree, criminal record, and employment verification checks.",
    features: [
      "Blockchain-verified degree certificates",
      "Automated reference check outreach surveys",
      "GDPR & SOC-2 Type II compliant",
    ],
    isInstalled: false,
    pricing: "Enterprise Included",
  },
  {
    id: "app-7",
    name: "OneClick Onboard Engine",
    developer: "Huremaso Workforce Tools",
    category: "onboarding",
    categoryLabel: "Onboarding & HR Automation",
    rating: 4.7,
    reviewCount: 290,
    installs: "4.8k",
    iconBg: "from-rose-500 to-red-600",
    iconColor: "text-white",
    shortDesc: "Generate offer letters, sign NDAs, provision email accounts, and assign buddy tasks in seconds.",
    features: [
      "Digital e-signature workflow with DocuSign & HelloSign",
      "Automated Slack / Teams workspace provisioning",
      "Pre-boarding engagement checklist for new hires",
    ],
    isInstalled: false,
    pricing: "Pro",
  },
  {
    id: "app-8",
    name: "LinkedIn AutoHeadhunter",
    developer: "TalentScout Pro",
    category: "sourcing",
    categoryLabel: "Sourcing & Screening",
    rating: 4.9,
    reviewCount: 950,
    installs: "18.3k",
    iconBg: "from-sky-600 to-indigo-700",
    iconColor: "text-white",
    shortDesc: "Autonomous passive candidate sourcing pipeline targeting top 5% performers in your industry.",
    features: [
      "Personalized hyper-customized InMail sequences",
      "Github & Behance portfolio scraping",
      "Salary expectation pre-qualification",
    ],
    isInstalled: true,
    pricing: "Pro",
    badge: "High ROI",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Applications" },
  { id: "sourcing", label: "Sourcing & Screening" },
  { id: "interview", label: "Interview & Voice AI" },
  { id: "testing", label: "Skills & Code Testing" },
  { id: "verification", label: "Verification" },
  { id: "onboarding", label: "Onboarding & HR" },
];

export default function AiAppMartPage() {
  const [apps, setApps] = useState<AIApp[]>(ALL_APPS);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApp, setSelectedApp] = useState<AIApp | null>(null);

  const toggleInstall = (appId: string) => {
    setApps((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, isInstalled: !a.isInstalled } : a))
    );
    if (selectedApp && selectedApp.id === appId) {
      setSelectedApp((prev) => (prev ? { ...prev, isInstalled: !prev.isInstalled } : null));
    }
  };

  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      if (selectedCategory !== "all" && app.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = app.name.toLowerCase().includes(q);
        const matchDesc = app.shortDesc.toLowerCase().includes(q);
        const matchDev = app.developer.toLowerCase().includes(q);
        if (!matchName && !matchDesc && !matchDev) return false;
      }
      return true;
    });
  }, [apps, selectedCategory, searchQuery]);

  const installedCount = apps.filter((a) => a.isInstalled).length;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8 lg:p-10 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-surface via-surface to-primary/5 p-6 sm:p-10 shadow-xs">
        <div className="max-w-2xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary-glow text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated AI Recruitment Ecosystem</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-ink tracking-tight">
            AiMart
          </h1>

          <p className="text-xs sm:text-sm text-ink-soft leading-relaxed">
            Supercharge your recruiter workspace with autonomous AI agents, voice interview screeners, proctored code sandboxes, and verification toolkits.
          </p>

          <div className="flex items-center gap-6 pt-2 text-xs font-semibold text-ink">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>{installedCount} Active Integrations</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Zero-code 1-click Install</span>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-500" />
              <span>SOC-2 & GDPR Verified</span>
            </div>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      </div>

      {/* Filter and Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-gradient-brand text-primary-foreground shadow-glow"
                    : "border border-border bg-surface text-ink-soft hover:text-ink hover:bg-surface-alt"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-ink-soft absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search apps or features..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface text-xs text-ink placeholder:text-ink-soft outline-none focus:border-primary transition"
            />
          </div>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredApps.map((app) => (
          <div
            key={app.id}
            onClick={() => setSelectedApp(app)}
            className="group rounded-2xl border border-border bg-surface hover:border-primary/50 transition-all duration-200 shadow-xs hover:shadow-elegant p-5 flex flex-col justify-between cursor-pointer relative"
          >
            {/* Top row: Icon, Badge, Rating */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-3.5">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${app.iconBg} ${app.iconColor} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0`}>
                  <Bot className="w-6 h-6" />
                </div>

                <div className="flex flex-col items-end gap-1">
                  {app.badge && (
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-primary-glow bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                      {app.badge}
                    </span>
                  )}
                  <div className="flex items-center gap-1 text-xs font-bold text-ink">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{app.rating}</span>
                    <span className="text-[10px] text-ink-soft font-normal">({app.reviewCount})</span>
                  </div>
                </div>
              </div>

              {/* Title & Developer */}
              <h3 className="text-sm font-extrabold text-ink group-hover:text-primary-glow transition truncate">
                {app.name}
              </h3>
              <p className="text-[11px] text-ink-soft truncate mb-2">{app.developer}</p>

              {/* Description */}
              <p className="text-xs text-ink-soft line-clamp-2 leading-relaxed mb-4">
                {app.shortDesc}
              </p>
            </div>

            {/* Bottom Meta & Action */}
            <div className="pt-3 border-t border-border/70 flex items-center justify-between gap-2">
              <div className="text-[10px] font-bold text-ink-soft">
                {app.pricing}
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleInstall(app.id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  app.isInstalled
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                    : "bg-gradient-brand text-primary-foreground shadow-xs hover:scale-105"
                }`}
              >
                {app.isInstalled ? "Configured" : "Install"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* App Details & Configuration Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface border border-border rounded-3xl shadow-2xl max-w-xl w-full p-6 space-y-5 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-3.5">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${selectedApp.iconBg} ${selectedApp.iconColor} flex items-center justify-center shadow-lg`}>
                  <Bot className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-ink">{selectedApp.name}</h2>
                    {selectedApp.badge && (
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary-glow border border-primary/20">
                        {selectedApp.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-soft">{selectedApp.developer} • {selectedApp.categoryLabel}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="p-1.5 rounded-xl hover:bg-surface-alt text-ink-soft hover:text-ink transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Description & Capabilities */}
            <div className="space-y-3 text-xs">
              <p className="text-ink text-xs leading-relaxed">{selectedApp.shortDesc}</p>

              <div className="space-y-2 pt-2">
                <h4 className="font-bold text-ink uppercase text-[10px] tracking-wider text-ink-soft">
                  Key Capabilities
                </h4>
                <div className="space-y-1.5">
                  {selectedApp.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-ink">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status and Permissions */}
              <div className="p-3.5 rounded-2xl bg-surface-alt/70 border border-border/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-ink-soft">Integration Status:</span>
                  <span className={`font-bold ${selectedApp.isInstalled ? "text-emerald-500" : "text-amber-500"}`}>
                    {selectedApp.isInstalled ? "Active & Syncing" : "Not Installed"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-soft">Required Permissions:</span>
                  <span className="font-semibold text-ink">Read Candidates, Post Interviews, Write Notes</span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <div className="text-xs font-bold text-ink">
                Tier: <span className="text-primary-glow">{selectedApp.pricing}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 rounded-xl border border-border text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => toggleInstall(selectedApp.id)}
                  className={`px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedApp.isInstalled
                      ? "bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive/20"
                      : "bg-gradient-brand text-primary-foreground shadow-glow hover:scale-105"
                  }`}
                >
                  {selectedApp.isInstalled ? "Uninstall App" : "Install to Workspace"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
