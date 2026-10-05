"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Sparkles,
  Share2,
  Copy,
  ExternalLink,
  FileText,
  Eye,
  Download,
  CheckCircle2,
  Clock,
  Users,
  ArrowRight,
  X,
  ChevronRight,
  ChevronDown,
  Mail,
  Send,
  Layers,
  BarChart3,
  PieChart,
  ShieldCheck,
  AlertCircle,
  GripVertical,
  KanbanSquare,
  Table as TableIcon,
  Bot,
  Building2,
  SlidersHorizontal,
  RefreshCw,
  Award,
  Globe,
  Flame,
  Check,
} from "lucide-react";
import { useRecruiterStore } from "@/features/recruiter/store/useRecruiterStore";
import { useStartupStore } from "@/features/startup/store/useStartupStore";
import { startupService } from "@/features/startup/services/startupService";
import {
  FundraisingStage,
  InvestorTier,
  InvestorDeal,
  RoundConfig,
} from "@/features/startup/types";
import { toast } from "sonner";

export type { FundraisingStage, InvestorTier, InvestorDeal, RoundConfig };

const STAGE_CONFIG: Record<
  FundraisingStage,
  {
    label: string;
    description: string;
    badgeBg: string;
    badgeText: string;
    dotColor: string;
    borderAccent: string;
  }
> = {
  prospect: {
    label: "1. Prospect & Match",
    description: "Vetted active investors matching your sector (60k+ directory)",
    badgeBg: "bg-slate-500/10",
    badgeText: "text-slate-600 dark:text-slate-400",
    dotColor: "bg-slate-500",
    borderAccent: "border-slate-500/20",
  },
  contacted: {
    label: "2. Contacted / Pitch Sent",
    description: "AI-personalized cold outreach dispatched & tracked",
    badgeBg: "bg-blue-500/10",
    badgeText: "text-blue-600 dark:text-blue-400",
    dotColor: "bg-blue-500",
    borderAccent: "border-blue-500/20",
  },
  engaged: {
    label: "3. Replied & Engaged",
    description: "Positive response received, deck link opened",
    badgeBg: "bg-indigo-500/10",
    badgeText: "text-indigo-600 dark:text-indigo-400",
    dotColor: "bg-indigo-500",
    borderAccent: "border-indigo-500/20",
  },
  meeting: {
    label: "4. Partner Meeting",
    description: "Introductory pitch call or partner review scheduled",
    badgeBg: "bg-purple-500/10",
    badgeText: "text-purple-600 dark:text-purple-400",
    dotColor: "bg-purple-500",
    borderAccent: "border-purple-500/20",
  },
  diligence: {
    label: "5. Due Diligence",
    description: "Data room access, cap table & tech audit active",
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-600 dark:text-amber-400",
    dotColor: "bg-amber-500",
    borderAccent: "border-amber-500/20",
  },
  termsheet: {
    label: "6. Term Sheet / Committed",
    description: "SAFE or term sheet signed, wire transfer pending",
    badgeBg: "bg-emerald-500/10",
    badgeText: "text-emerald-600 dark:text-emerald-400",
    dotColor: "bg-emerald-500",
    borderAccent: "border-emerald-500/20",
  },
  passed: {
    label: "Passed / Nurture",
    description: "Archived for next round; feedback saved",
    badgeBg: "bg-rose-500/10",
    badgeText: "text-rose-600 dark:text-rose-400",
    dotColor: "bg-rose-500",
    borderAccent: "border-rose-500/20",
  },
};

const INITIAL_ROUND_CONFIG: RoundConfig = {
  roundName: "Seed Round",
  targetAmount: 2000000,
  valuationCap: 12000000,
  instrument: "Post-Money SAFE (with MFN)",
  currency: "$",
  closeDate: "Nov 30, 2026",
  startupSlug: "neuropulse-ai",
};

const INITIAL_DEALS: InvestorDeal[] = [
  {
    id: "rf-1",
    fundName: "Peak XV Surge",
    fundLogoText: "PX",
    tier: "Tier 1 VC",
    leadPartner: "Rajan Anandan",
    partnerRole: "Managing Director",
    partnerEmail: "rajan@peakxv.com",
    stage: "diligence",
    checkSize: 1000000,
    checkSizeText: "$1,000,000",
    focusTags: ["Enterprise AI", "B2B SaaS", "DevTools"],
    lastTouch: "Yesterday",
    lastTouchType: "data_room",
    deckViewsCount: 7,
    timeSpentOnDeck: "6m 45s",
    notes: "Data room reviewed. Requested technical IP breakdown and unit economics sheet.",
    followUpDate: "Tomorrow",
    probability: 75,
    recentDeal: "Invested in Atlan & InVideo (active 2 mos ago)",
  },
  {
    id: "rf-2",
    fundName: "Blume Ventures",
    fundLogoText: "BV",
    tier: "Tier 1 VC",
    leadPartner: "Sajith Pai",
    partnerRole: "Partner",
    partnerEmail: "sajith@blume.vc",
    stage: "termsheet",
    checkSize: 500000,
    checkSizeText: "$500,000",
    focusTags: ["HRTech", "AI Workflows", "Future of Work"],
    lastTouch: "Today",
    lastTouchType: "call",
    deckViewsCount: 12,
    timeSpentOnDeck: "9m 10s",
    notes: "Soft-committed $500k lead check. Final investment committee sign-off on Monday.",
    followUpDate: "Sep 15",
    probability: 90,
    recentDeal: "Invested in Classplus & GreyOrange (active 1 mo ago)",
  },
  {
    id: "rf-3",
    fundName: "Kalaari Capital",
    fundLogoText: "KC",
    tier: "Tier 1 VC",
    leadPartner: "Vani Kola",
    partnerRole: "Founder & Managing Director",
    partnerEmail: "vani@kalaari.com",
    stage: "meeting",
    checkSize: 750000,
    checkSizeText: "$750,000",
    focusTags: ["GenAI", "Productivity", "Enterprise"],
    lastTouch: "2 days ago",
    lastTouchType: "meeting",
    deckViewsCount: 4,
    timeSpentOnDeck: "4m 20s",
    notes: "First partner meeting went well. Discussed ARR trajectory and CAC payback period.",
    followUpDate: "Sep 18",
    probability: 50,
    recentDeal: "Invested in Dream11 & Curefit (active 3 mos ago)",
  },
  {
    id: "rf-4",
    fundName: "Titan Capital",
    fundLogoText: "TC",
    tier: "Angel Syndicate",
    leadPartner: "Kunal Bahl & Rohit Bansal",
    partnerRole: "General Partners",
    partnerEmail: "deals@titancapital.vc",
    stage: "termsheet",
    checkSize: 250000,
    checkSizeText: "$250,000",
    focusTags: ["SaaS", "Founders First", "Seed"],
    lastTouch: "3 days ago",
    lastTouchType: "email",
    deckViewsCount: 9,
    timeSpentOnDeck: "5m 30s",
    notes: "SAFE note finalized. Signed and confirmed wire transfer pending syndicate close.",
    followUpDate: "Sep 12",
    probability: 95,
    recentDeal: "Invested in Razorpay & Ola (active 2 mos ago)",
  },
  {
    id: "rf-5",
    fundName: "Lightspeed India",
    fundLogoText: "LS",
    tier: "Tier 1 VC",
    leadPartner: "Hemant Mohapatra",
    partnerRole: "Partner",
    partnerEmail: "hemant@lsvp.com",
    stage: "engaged",
    checkSize: 1500000,
    checkSizeText: "$1,500,000",
    focusTags: ["Infrastructure", "Agentic AI", "Global Enterprise"],
    lastTouch: "4 hours ago",
    lastTouchType: "deck_view",
    deckViewsCount: 5,
    timeSpentOnDeck: "7m 15s",
    notes: "Replied requesting introductory Zoom call with the core tech co-founder.",
    followUpDate: "Tomorrow 3 PM",
    probability: 40,
    recentDeal: "Invested in Innovaccer & Oyo (active 1 mo ago)",
  },
  {
    id: "rf-6",
    fundName: "Nexus Venture Partners",
    fundLogoText: "NV",
    tier: "Tier 1 VC",
    leadPartner: "Pratik Poddar",
    partnerRole: "Partner",
    partnerEmail: "pratik@nexusvp.com",
    stage: "contacted",
    checkSize: 1000000,
    checkSizeText: "$1,000,000",
    focusTags: ["Product-Led Growth", "AI Automation"],
    lastTouch: "Yesterday",
    lastTouchType: "email",
    deckViewsCount: 1,
    timeSpentOnDeck: "1m 45s",
    notes: "AI personalized outreach email sent via connected Gmail account. Open tracked.",
    followUpDate: "Sep 16",
    probability: 25,
    recentDeal: "Invested in Postman & Hasura (active 3 mos ago)",
  },
  {
    id: "rf-7",
    fundName: "Antler Global",
    fundLogoText: "AG",
    tier: "Micro VC",
    leadPartner: "Nitin Sharma",
    partnerRole: "General Partner",
    partnerEmail: "nitin@antler.co",
    stage: "prospect",
    checkSize: 200000,
    checkSizeText: "$200,000",
    focusTags: ["Day Zero", "Pre-Seed", "Founder Led"],
    lastTouch: "3 days ago",
    lastTouchType: "data_room",
    deckViewsCount: 0,
    timeSpentOnDeck: "—",
    notes: "Identified via RoundFunded 60k+ active investor directory. Sector match score 94%.",
    followUpDate: "Queue for outreach",
    probability: 15,
    recentDeal: "Active investor: 14 checks written in last 6 mos",
  },
  {
    id: "rf-8",
    fundName: "Sequoia Capital (US Seed)",
    fundLogoText: "SC",
    tier: "Tier 1 VC",
    leadPartner: "Stephanie Zhan",
    partnerRole: "Partner",
    partnerEmail: "szhan@sequoiacap.com",
    stage: "prospect",
    checkSize: 1500000,
    checkSizeText: "$1,500,000",
    focusTags: ["AI Infrastructure", "Autonomous Software"],
    lastTouch: "5 days ago",
    lastTouchType: "email",
    deckViewsCount: 0,
    timeSpentOnDeck: "—",
    notes: "High-priority prospect. Strong affinity for autonomous recruiting agent architectures.",
    followUpDate: "Draft warm intro",
    probability: 20,
    recentDeal: "Invested in Linear & Retool",
  },
];

const STORAGE_KEY = "letgetin_roundfunded_pipeline_v1";

export default function StartupFundraisingPipelinePage() {
  const { orgProfile } = useRecruiterStore();
  const {
    deals: storeDeals,
    profile: startupProfile,
    summary,
    isLoadingDeals,
    loadDeals,
    loadProfile,
    loadSummary,
    moveDealStage,
    createDeal,
    updateDeal,
    deleteDeal,
    updateProfile,
    addDealActivity,
  } = useStartupStore();

  const [roundConfig, setRoundConfig] = useState<RoundConfig>(INITIAL_ROUND_CONFIG);
  const [viewMode, setViewMode] = useState<"kanban" | "table" | "dataroom">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>("all");
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>("all");
  const [copiedLink, setCopiedLink] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAiOutreachOpen, setIsAiOutreachOpen] = useState(false);
  const [selectedDealForModal, setSelectedDealForModal] = useState<InvestorDeal | null>(null);
  const [isEditRoundOpen, setIsEditRoundOpen] = useState(false);
  const [dealNoteText, setDealNoteText] = useState("");

  // AI Outreach State
  const [outreachInvestor, setOutreachInvestor] = useState<InvestorDeal | null>(null);
  const [generatedPitchEmail, setGeneratedPitchEmail] = useState("");
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Load from backend on mount
  useEffect(() => {
    loadDeals();
    loadProfile();
    loadSummary();
  }, [loadDeals, loadProfile, loadSummary]);

  // Sync profile data to roundConfig
  useEffect(() => {
    if (startupProfile?.fundraisingProfile) {
      setRoundConfig((prev) => ({
        ...prev,
        ...startupProfile.fundraisingProfile,
        roundName: startupProfile.fundraisingProfile.roundName || prev.roundName,
        targetAmount: startupProfile.fundraisingProfile.targetAmount || prev.targetAmount,
        valuationCap: startupProfile.fundraisingProfile.valuationCap || prev.valuationCap,
        instrument: startupProfile.fundraisingProfile.instrument || prev.instrument,
        closeDate: startupProfile.fundraisingProfile.closeDate || prev.closeDate,
        currency: startupProfile.fundraisingProfile.currency || prev.currency,
        startupSlug: startupProfile.fundraisingProfile.startupSlug || prev.startupSlug,
      }));
    }
  }, [startupProfile]);

  // Active Deals
  const deals: InvestorDeal[] = storeDeals && storeDeals.length > 0 ? storeDeals : INITIAL_DEALS;

  // Metrics Calculations
  const metrics = useMemo(() => {
    const committedDeals = deals.filter((d) => d.stage === "termsheet");
    const committedTotal = committedDeals.reduce((acc, curr) => acc + curr.checkSize, 0);

    const activeDiligenceDeals = deals.filter(
      (d) => d.stage === "diligence" || d.stage === "meeting"
    );
    const activeDiligenceTotal = activeDiligenceDeals.reduce((acc, curr) => acc + curr.checkSize, 0);

    const target = roundConfig.targetAmount || 2000000;
    const progressPercent = Math.min(100, Math.round((committedTotal / target) * 100));
    const remaining = Math.max(0, target - committedTotal);

    const totalDeckViews = deals.reduce((acc, curr) => acc + (curr.deckViewsCount || 0), 0);

    return {
      committedTotal: summary?.committedAmount ?? committedTotal,
      activeDiligenceTotal,
      progressPercent: summary?.progressPercentage ?? progressPercent,
      remaining: summary?.remainingAmount ?? remaining,
      totalDeckViews,
      totalContacts: summary?.totalDeals ?? deals.length,
      activeDealsCount: deals.filter((d) => d.stage !== "passed").length,
    };
  }, [deals, roundConfig, summary]);

  // Stage Totals for Kanban column headers
  const stageSums = useMemo(() => {
    const sums: Record<FundraisingStage, { count: number; totalSum: number }> = {
      prospect: { count: 0, totalSum: 0 },
      contacted: { count: 0, totalSum: 0 },
      engaged: { count: 0, totalSum: 0 },
      meeting: { count: 0, totalSum: 0 },
      diligence: { count: 0, totalSum: 0 },
      termsheet: { count: 0, totalSum: 0 },
      passed: { count: 0, totalSum: 0 },
    };

    deals.forEach((d) => {
      if (sums[d.stage]) {
        sums[d.stage].count += 1;
        sums[d.stage].totalSum += d.checkSize || 0;
      }
    });

    return sums;
  }, [deals]);

  // Filtered Deals
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      if (selectedTierFilter !== "all" && deal.tier !== selectedTierFilter) return false;
      if (selectedStageFilter !== "all" && deal.stage !== selectedStageFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = deal.fundName.toLowerCase().includes(q);
        const matchPartner = deal.leadPartner.toLowerCase().includes(q);
        const matchTags = (deal.focusTags || []).some((t) => t.toLowerCase().includes(q));
        if (!matchName && !matchPartner && !matchTags) return false;
      }
      return true;
    });
  }, [deals, selectedTierFilter, selectedStageFilter, searchQuery]);

  // Drag and Drop Handler with optimistic persistence
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, targetStage: FundraisingStage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData("text/plain");
    if (!dealId) return;

    await moveDealStage(dealId, targetStage);
    toast.success(`Deal moved to ${STAGE_CONFIG[targetStage]?.label || targetStage}`);
  };

  // Copy shareable raise link
  const handleCopyLink = () => {
    const link = `https://letgetin.com/raise/${roundConfig.startupSlug || "startup-round"}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    toast.success("Public investor raise link copied!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Trigger AI Outreach generator
  const handleOpenAiOutreach = async (deal: InvestorDeal) => {
    setOutreachInvestor(deal);
    setIsGeneratingAi(true);
    setIsAiOutreachOpen(true);

    try {
      const res = await startupService.generateAIPersonalizedPitch({
        dealId: deal._id || deal.id,
        investorName: deal.fundName,
        partnerName: deal.leadPartner,
      });
      if (res && res.emailBody) {
        setGeneratedPitchEmail(res.emailBody);
      }
    } catch (err) {
      const startupName = orgProfile?.name || "NeuroPulse AI";
      const founders = orgProfile?.founders || "Founding Team";
      const product = orgProfile?.productDetails || "Autonomous AI Recruiting & Talent Engine";

      setGeneratedPitchEmail(`Hi ${deal.leadPartner.split(" ")[0] || "there"},

I noticed your investments at ${deal.fundName} (${deal.recentDeal || "active early-stage backer"}) and your focus on ${deal.focusTags?.[0] || "AI"}.

We are building ${product} at ${startupName}.
Highlights on our traction:
• Seed Round Target: $${((roundConfig.targetAmount || 2000000) / 1000000).toFixed(1)}M (${metrics.progressPercent}% committed)
• Post-Money SAFE valuation cap: $${((roundConfig.valuationCap || 12000000) / 1000000).toFixed(1)}M
• Growth: 32% MoM revenue retention

Would you have 15 minutes next week for an introductory conversation?

Best regards,
${founders.split("&")[0].trim()} | Co-Founder, ${startupName}`);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto select-none">
      {/* ===== 1. ROUNDFUNDED LIVE RAISE HEADER & METRICS ===== */}
      <header className="rounded-3xl border border-border bg-surface p-5 sm:p-6 shadow-sm relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Round Title & Details */}
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-3 py-1 rounded-full bg-primary/15 text-primary-glow border border-primary/25">
                <Flame className="w-3.5 h-3.5 text-primary" /> Active Fundraise
              </span>
              <span className="text-xs font-bold text-ink-soft bg-surface-alt px-2.5 py-0.5 rounded-full border border-border">
                {roundConfig.instrument}
              </span>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                Target Close: {roundConfig.closeDate}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight flex items-center gap-3">
              <span>{roundConfig.roundName} Pipeline</span>
              <button
                type="button"
                onClick={() => setIsEditRoundOpen(true)}
                className="text-xs font-semibold text-primary-glow hover:underline cursor-pointer"
              >
                Edit Target
              </button>
            </h1>

            <p className="text-xs sm:text-sm text-ink-soft">
              All-in-one investor CRM, recency-filtered active investor pipeline, and shareable Data Room analytics based on RoundFunded.
            </p>
          </div>

          {/* Shareable Data Room Link Bar (RoundFunded Signature) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="flex items-center gap-2 p-1.5 pl-3 rounded-2xl bg-surface-alt border border-border">
              <div className="flex items-center gap-1.5 text-xs text-ink-soft font-mono">
                <Globe className="w-3.5 h-3.5 text-primary-glow shrink-0" />
                <span className="truncate max-w-[210px]">
                  letgetin.com/raise/{roundConfig.startupSlug}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1 rounded-xl bg-surface border border-border text-ink hover:text-primary-glow text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-brand text-primary-foreground text-xs font-bold shadow-glow hover:opacity-95 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Investor</span>
            </button>
          </div>
        </div>

        {/* Raise Progress & Key Metrics Bar */}
        <div className="mt-6 pt-5 border-t border-border/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-ink-soft flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-primary-glow" /> Target Raise Ask
            </span>
            <div className="text-lg sm:text-2xl font-black text-ink">
              ${(roundConfig.targetAmount / 1000000).toFixed(2)}M
            </div>
            <div className="text-[11px] text-ink-soft">
              Valuation Cap: ${(roundConfig.valuationCap / 1000000).toFixed(1)}M
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-emerald-500 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Committed / Term Sheets
            </span>
            <div className="text-lg sm:text-2xl font-black text-emerald-500">
              ${(metrics.committedTotal / 1000000).toFixed(2)}M
            </div>
            <div className="text-[11px] font-bold text-emerald-500">
              {metrics.progressPercent}% of target round
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-amber-500 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> In Active Diligence
            </span>
            <div className="text-lg sm:text-2xl font-black text-amber-500">
              ${(metrics.activeDiligenceTotal / 1000000).toFixed(2)}M
            </div>
            <div className="text-[11px] text-ink-soft">
              {deals.filter((d) => d.stage === "diligence" || d.stage === "meeting").length} funds reviewing deck
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-primary-glow flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> Data Room Engagement
            </span>
            <div className="text-lg sm:text-2xl font-black text-ink">
              {metrics.totalDeckViews} Pitch Views
            </div>
            <div className="text-[11px] text-ink-soft">
              Avg Deck Time: <span className="font-bold text-ink">6m 12s</span>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="w-full h-2.5 rounded-full bg-surface-alt overflow-hidden border border-border flex">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${metrics.progressPercent}%` }}
              title={`Committed: ${metrics.progressPercent}%`}
            />
            <div
              className="h-full bg-amber-500/70 transition-all duration-500"
              style={{
                width: `${Math.min(
                  100 - metrics.progressPercent,
                  Math.round((metrics.activeDiligenceTotal / roundConfig.targetAmount) * 100)
                )}%`,
              }}
              title="In Diligence"
            />
          </div>
          <div className="flex items-center justify-between text-[10px] text-ink-soft">
            <span>
              ${(metrics.committedTotal / 1000).toLocaleString()}k soft-committed
            </span>
            <span>
              ${(metrics.remaining / 1000).toLocaleString()}k remaining to fill round
            </span>
          </div>
        </div>
      </header>

      {/* ===== 2. CONTROLS BAR: TABS, SEARCH, FILTERS ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-3 rounded-2xl border border-border">
        {/* View Mode Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-surface-alt border border-border self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("kanban")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === "kanban"
                ? "bg-gradient-brand text-primary-foreground shadow-glow"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            <KanbanSquare className="w-3.5 h-3.5" />
            <span>Kanban Funnel</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === "table"
                ? "bg-gradient-brand text-primary-foreground shadow-glow"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Table CRM</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("dataroom")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === "dataroom"
                ? "bg-gradient-brand text-primary-foreground shadow-glow"
                : "text-ink-soft hover:text-ink"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Data Room Analytics</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative min-w-[180px]">
            <Search className="w-3.5 h-3.5 text-ink-soft absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search funds, partners, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-surface-alt border border-border text-xs text-ink placeholder:text-ink-soft/60 focus:outline-none focus:border-primary"
            />
          </div>

          <select
            value={selectedTierFilter}
            onChange={(e) => setSelectedTierFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-surface-alt border border-border text-xs text-ink font-semibold focus:outline-none focus:border-primary"
          >
            <option value="all">All Investor Tiers</option>
            <option value="Tier 1 VC">Tier 1 VCs</option>
            <option value="Growth VC">Growth VCs</option>
            <option value="Angel Syndicate">Angel Syndicates</option>
            <option value="Micro VC">Micro VCs</option>
          </select>

          <span className="text-xs font-bold text-ink-soft px-2">
            {filteredDeals.length} Investors
          </span>
        </div>
      </div>

      {/* ===== 3. MAIN CONTENT: KANBAN vs TABLE vs DATAROOM ===== */}
      {viewMode === "kanban" && (
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {(
            [
              "prospect",
              "contacted",
              "engaged",
              "meeting",
              "diligence",
              "termsheet",
              "passed",
            ] as FundraisingStage[]
          ).map((stageKey) => {
            const config = STAGE_CONFIG[stageKey];
            const stageDeals = filteredDeals.filter((d) => d.stage === stageKey);
            const sumData = stageSums[stageKey];

            return (
              <div
                key={stageKey}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stageKey)}
                className="w-80 shrink-0 bg-surface border border-border rounded-3xl p-3.5 flex flex-col min-h-[580px] shadow-2xs space-y-3"
              >
                {/* Column Header */}
                <div className="pb-2 border-b border-border/70 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${config.dotColor}`} />
                      <h3 className="text-xs font-bold text-ink truncate">
                        {config.label}
                      </h3>
                    </div>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${config.badgeBg} ${config.badgeText}`}
                    >
                      {stageDeals.length}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-ink-soft font-semibold">
                    <span>{config.description}</span>
                  </div>

                  {sumData.totalSum > 0 && (
                    <div className="text-[11px] font-extrabold text-ink pt-0.5">
                      Sum: ${(sumData.totalSum / 1000).toLocaleString()}k
                    </div>
                  )}
                </div>

                {/* Deal Cards */}
                <div className="flex-1 space-y-3 overflow-y-auto scrollbar-thin pr-1">
                  {stageDeals.map((deal) => (
                    <div
                      key={deal._id || deal.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal._id || deal.id || "")}
                      onClick={() => setSelectedDealForModal(deal)}
                      className="p-3.5 rounded-2xl bg-surface-alt/60 border border-border hover:border-primary/40 transition-all cursor-grab active:cursor-grabbing group shadow-2xs space-y-2.5 hover:shadow-md"
                    >
                      {/* Fund Header & Check Size */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-7 h-7 rounded-xl bg-gradient-brand text-primary-foreground font-black text-[11px] flex items-center justify-center shrink-0 shadow-xs">
                            {deal.fundLogoText}
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-ink truncate group-hover:text-primary-glow transition-colors">
                              {deal.fundName}
                            </h4>
                            <span className="text-[10px] text-ink-soft">
                              {deal.tier}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-xs font-black text-emerald-500">
                            {deal.checkSizeText}
                          </div>
                          <span className="text-[9.5px] font-bold text-primary-glow bg-primary/10 px-1.5 py-0.5 rounded-md">
                            {deal.probability}% Prob
                          </span>
                        </div>
                      </div>

                      {/* Lead Partner & Touchpoint */}
                      <div className="text-[11px] space-y-1">
                        <div className="text-ink font-semibold flex items-center justify-between">
                          <span>{deal.leadPartner}</span>
                          <span className="text-[10px] text-ink-soft font-normal">
                            {deal.lastTouch}
                          </span>
                        </div>
                        <p className="text-[10.5px] text-ink-soft line-clamp-2 leading-relaxed">
                          {deal.notes}
                        </p>
                      </div>

                      {/* Recency deal filter tag (RoundFunded feature) */}
                      <div className="text-[9.5px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-500/20 truncate">
                        ⚡ {deal.recentDeal}
                      </div>

                      {/* Deck Views / Engagement & AI Outreach Button */}
                      <div className="flex items-center justify-between pt-1 border-t border-border/70 text-[10px]">
                        <div className="flex items-center gap-1 text-ink-soft">
                          <Eye className="w-3 h-3 text-primary-glow" />
                          <span>
                            {(deal.deckViewsCount ?? 0) > 0
                              ? `${deal.deckViewsCount} views (${deal.timeSpentOnDeck || "0m"})`
                              : "Deck unviewed"}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenAiOutreach(deal);
                          }}
                          className="px-2 py-0.5 rounded-lg bg-primary/15 text-primary-glow hover:bg-primary/25 font-bold transition flex items-center gap-1 cursor-pointer"
                          title="Generate AI Outreach Email"
                        >
                          <Bot className="w-3 h-3" />
                          <span>AI Pitch</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {stageDeals.length === 0 && (
                    <div className="h-32 border border-dashed border-border/70 rounded-2xl flex flex-col items-center justify-center text-center p-3 text-ink-soft text-[11px]">
                      <span>No investors in this stage</span>
                      <span className="text-[9.5px] text-ink-soft/60 mt-0.5">
                        Drag deals here to update stage
                      </span>
                    </div>
                  )}
                </div>

                {/* Column Quick Add */}
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(true);
                  }}
                  className="w-full py-2 rounded-xl text-xs font-semibold text-ink-soft hover:text-ink hover:bg-surface-alt border border-transparent hover:border-border transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Investor to {config.label.split(". ")[1]}</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === "table" && (
        <div className="bg-surface rounded-3xl border border-border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-alt/70 border-b border-border text-ink-soft font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Investor / Fund</th>
                  <th className="p-3.5">Lead Partner</th>
                  <th className="p-3.5">Pipeline Stage</th>
                  <th className="p-3.5">Check Size</th>
                  <th className="p-3.5">Probability</th>
                  <th className="p-3.5">Deck Engagement</th>
                  <th className="p-3.5">Recent Activity</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredDeals.map((deal) => {
                  const stageConfig = STAGE_CONFIG[deal.stage];
                  return (
                    <tr
                      key={deal._id || deal.id}
                      onClick={() => setSelectedDealForModal(deal)}
                      className="hover:bg-surface-alt/40 transition cursor-pointer group"
                    >
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-gradient-brand text-primary-foreground font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                            {deal.fundLogoText}
                          </div>
                          <div>
                            <div className="font-bold text-ink group-hover:text-primary-glow transition-colors">
                              {deal.fundName}
                            </div>
                            <div className="text-[10px] text-ink-soft">
                              {deal.tier}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <div className="font-semibold text-ink">
                          {deal.leadPartner}
                        </div>
                        <div className="text-[10px] text-ink-soft">
                          {deal.partnerEmail}
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${stageConfig.badgeBg} ${stageConfig.badgeText} ${stageConfig.borderAccent}`}
                        >
                          {stageConfig.label}
                        </span>
                      </td>

                      <td className="p-3.5 font-bold text-emerald-500">
                        {deal.checkSizeText}
                      </td>

                      <td className="p-3.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-12 h-1.5 rounded-full bg-surface-alt overflow-hidden border border-border">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${deal.probability}%` }}
                            />
                          </div>
                          <span className="font-bold text-[10px]">
                            {deal.probability}%
                          </span>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className="text-[11px] font-medium text-ink flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-primary-glow" />
                          <span>{deal.deckViewsCount} views</span>
                          <span className="text-ink-soft">({deal.timeSpentOnDeck})</span>
                        </span>
                      </td>

                      <td className="p-3.5">
                        <div className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                          {deal.recentDeal}
                        </div>
                        <div className="text-[10px] text-ink-soft mt-0.5">
                          Touch: {deal.lastTouch}
                        </div>
                      </td>

                      <td className="p-3.5 text-right">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenAiOutreach(deal);
                          }}
                          className="px-2.5 py-1 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary-glow font-bold text-[11px] transition inline-flex items-center gap-1"
                        >
                          <Bot className="w-3.5 h-3.5" />
                          <span>Pitch</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {viewMode === "dataroom" && (
        <div className="space-y-6">
          {/* Data Room Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-surface border border-border space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-ink-soft">
                <span>Unique Investor Visits</span>
                <Users className="w-4 h-4 text-primary-glow" />
              </div>
              <div className="text-2xl font-black text-ink">48 Funds</div>
              <div className="text-[11px] text-emerald-500 font-semibold">
                +14 new views in last 7 days
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-surface border border-border space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-ink-soft">
                <span>Average Time Per Slide Deck</span>
                <Clock className="w-4 h-4 text-primary-glow" />
              </div>
              <div className="text-2xl font-black text-ink">6m 12s</div>
              <div className="text-[11px] text-emerald-500 font-semibold">
                Industry benchmark: 3m 40s (Top 5% engagement)
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-surface border border-border space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-ink-soft">
                <span>Data Room Downloads</span>
                <Download className="w-4 h-4 text-primary-glow" />
              </div>
              <div className="text-2xl font-black text-ink">38 Downloads</div>
              <div className="text-[11px] text-ink-soft">
                Financial model & IP patent papers
              </div>
            </div>
          </div>

          {/* Slide-by-Slide Drop-Off & Engagement Chart */}
          <div className="p-6 rounded-3xl bg-surface border border-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-ink">
                  Pitch Deck Slide-by-Slide Engagement
                </h3>
                <p className="text-xs text-ink-soft">
                  Where visiting venture capitalists spend the most viewing time.
                </p>
              </div>
              <span className="text-xs font-bold text-primary-glow bg-primary/10 px-3 py-1 rounded-full">
                12 Slides Active
              </span>
            </div>

            <div className="space-y-3 pt-2">
              {[
                { slide: "Slide 1: Problem & Macro Market", time: "42s", score: 85 },
                { slide: "Slide 2: Solution & Autonomous Recruiter", time: "1m 15s", score: 95 },
                { slide: "Slide 3: Technology & Proprietary AI IP", time: "1m 35s", score: 98 },
                { slide: "Slide 4: Business Model & Pricing", time: "52s", score: 80 },
                { slide: "Slide 5: MoM Traction & Net Retention", time: "1m 40s", score: 100 },
                { slide: "Slide 6: Founding Team & Pedigree", time: "38s", score: 70 },
                { slide: "Slide 7: Use of Funds ($2M Ask)", time: "50s", score: 90 },
              ].map((item, index) => (
                <div key={item.slide} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-ink font-semibold">{item.slide}</span>
                    <span className="text-ink-soft">{item.time} avg</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-surface-alt overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-brand transition-all"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== 4. AI OUTREACH EMAIL MODAL (RoundFunded Feature) ===== */}
      {isAiOutreachOpen && outreachInvestor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-surface border border-border rounded-3xl shadow-2xl p-6 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-brand text-primary-foreground flex items-center justify-center shadow-glow">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">
                    AI-Personalized Outreach Draft
                  </h3>
                  <p className="text-[11px] text-ink-soft">
                    Tailored to {outreachInvestor.fundName} ({outreachInvestor.leadPartner})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAiOutreachOpen(false)}
                className="p-1.5 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin">
              <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
                ✨ RoundFunded Intelligence: Auto-detected {outreachInvestor.recentDeal} and highlighted your ${roundConfig.targetAmount / 1000000}M raise terms.
              </div>

              {isGeneratingAi ? (
                <div className="h-48 flex flex-col items-center justify-center text-center p-4 text-ink-soft">
                  <RefreshCw className="w-6 h-6 animate-spin text-primary-glow mb-2" />
                  <span className="text-xs font-semibold">
                    Drafting personalized investor pitch...
                  </span>
                </div>
              ) : (
                <textarea
                  rows={12}
                  value={generatedPitchEmail}
                  onChange={(e) => setGeneratedPitchEmail(e.target.value)}
                  className="w-full p-4 rounded-2xl bg-surface-alt border border-border text-xs text-ink font-mono focus:outline-none focus:border-primary leading-relaxed"
                />
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-[11px] text-ink-soft">
                Connects directly to your Gmail or Outlook.
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(generatedPitchEmail);
                    alert("Outreach pitch email copied to clipboard!");
                  }}
                  className="px-3.5 py-2 rounded-xl bg-surface border border-border text-xs font-bold hover:bg-surface-alt transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Pitch</span>
                </button>

                <a
                  href={`mailto:${outreachInvestor.partnerEmail}?subject=${encodeURIComponent(
                    `NeuroPulse AI ($${roundConfig.targetAmount / 1000000}M Seed Raise)`
                  )}&body=${encodeURIComponent(generatedPitchEmail)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-gradient-brand text-primary-foreground text-xs font-bold shadow-glow hover:opacity-95 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send via Email Client</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== 5. ADD INVESTOR MODAL ===== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-surface border border-border rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-sm font-bold text-ink">Add Investor Deal</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as any;
                const checkVal = Number(form.checkSize.value) || 500000;
                const newDeal = {
                  fundName: form.fundName.value,
                  fundLogoText: (form.fundName.value || "VC").slice(0, 2).toUpperCase(),
                  tier: form.tier.value,
                  leadPartner: form.partner.value,
                  partnerRole: "Partner",
                  partnerEmail: form.email.value || "contact@fund.vc",
                  stage: form.stage.value,
                  checkSize: checkVal,
                  checkSizeText: `$${checkVal.toLocaleString()}`,
                  focusTags: [form.tag.value || "AI/ML"],
                  lastTouch: "Today",
                  notes: form.notes.value || "Added to fundraising pipeline.",
                  recentDeal: "Active seed backer",
                };
                try {
                  await createDeal(newDeal);
                  toast.success("Investor added to pipeline!");
                } catch (err: any) {
                  toast.error(err.message || "Failed to add deal");
                }
                setIsAddModalOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div className="space-y-1">
                <label className="font-bold text-ink">Fund / Investor Name *</label>
                <input
                  name="fundName"
                  required
                  placeholder="e.g. Accel Partners / Sequoia"
                  className="w-full px-3 py-2 rounded-xl bg-surface-alt border border-border text-ink focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-ink">Investor Tier</label>
                  <select
                    name="tier"
                    defaultValue="Tier 1 VC"
                    className="w-full px-3 py-2 rounded-xl bg-surface-alt border border-border text-ink focus:outline-none focus:border-primary"
                  >
                    <option value="Tier 1 VC">Tier 1 VC</option>
                    <option value="Growth VC">Growth VC</option>
                    <option value="Angel Syndicate">Angel Syndicate</option>
                    <option value="Family Office">Family Office</option>
                    <option value="Micro VC">Micro VC</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Pipeline Stage</label>
                  <select
                    name="stage"
                    defaultValue="prospect"
                    className="w-full px-3 py-2 rounded-xl bg-surface-alt border border-border text-ink focus:outline-none focus:border-primary"
                  >
                    {Object.entries(STAGE_CONFIG).map(([k, cfg]) => (
                      <option key={k} value={k}>
                        {cfg.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-ink">Lead Partner Name</label>
                  <input
                    name="partner"
                    placeholder="e.g. Roelof Botha"
                    className="w-full px-3 py-2 rounded-xl bg-surface-alt border border-border text-ink focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Partner Email</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="partner@fund.vc"
                    className="w-full px-3 py-2 rounded-xl bg-surface-alt border border-border text-ink focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-ink">Target Check Size ($)</label>
                  <input
                    name="checkSize"
                    type="number"
                    defaultValue={500000}
                    className="w-full px-3 py-2 rounded-xl bg-surface-alt border border-border text-ink focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Sector Tag</label>
                  <input
                    name="tag"
                    placeholder="e.g. Enterprise AI"
                    className="w-full px-3 py-2 rounded-xl bg-surface-alt border border-border text-ink focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-ink">Initial Notes</label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="e.g. Met at Demo Day. Very bullish on autonomous agents."
                  className="w-full p-2.5 rounded-xl bg-surface-alt border border-border text-ink focus:outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-border text-ink hover:bg-surface-alt font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-brand text-primary-foreground font-bold shadow-glow text-xs"
                >
                  Add to Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== 4. EDIT ROUND MODAL ===== */}
      {isEditRoundOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-surface border border-border rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="text-base font-extrabold text-ink flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-primary-glow" />
                <span>Configure Live Round</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsEditRoundOpen(false)}
                className="p-1 rounded-lg text-ink-soft hover:text-ink hover:bg-surface-alt"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as any;
                const newConfig = {
                  roundName: form.roundName.value,
                  targetAmount: Number(form.targetAmount.value),
                  valuationCap: Number(form.valuationCap.value),
                  instrument: form.instrument.value,
                  closeDate: form.closeDate.value,
                };
                try {
                  await updateProfile({ fundraisingProfile: newConfig });
                  setRoundConfig((prev) => ({ ...prev, ...newConfig }));
                  toast.success("Round configuration saved!");
                } catch (err: any) {
                  toast.error(err.message || "Failed to update round config");
                }
                setIsEditRoundOpen(false);
              }}
              className="space-y-3 text-xs"
            >
              <div className="space-y-1">
                <label className="font-bold text-ink">Round Name</label>
                <input
                  name="roundName"
                  defaultValue={roundConfig.roundName}
                  className="w-full px-3 py-2 rounded-xl bg-surface-alt border border-border text-ink focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-ink">Target Raise ($)</label>
                  <input
                    name="targetAmount"
                    type="number"
                    defaultValue={roundConfig.targetAmount}
                    className="w-full px-3 py-2 rounded-xl bg-surface-alt border border-border text-ink focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Valuation Cap ($)</label>
                  <input
                    name="valuationCap"
                    type="number"
                    defaultValue={roundConfig.valuationCap}
                    className="w-full px-3 py-2 rounded-xl bg-surface-alt border border-border text-ink focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-ink">Investment Instrument</label>
                <select
                  name="instrument"
                  defaultValue={roundConfig.instrument}
                  className="w-full px-3 py-2 rounded-xl bg-surface-alt border border-border text-ink font-semibold focus:outline-none focus:border-primary"
                >
                  <option value="Post-Money SAFE (with MFN)">Post-Money SAFE (with MFN)</option>
                  <option value="Priced Equity (Series Seed)">Priced Equity (Series Seed)</option>
                  <option value="Convertible Promissory Note">Convertible Promissory Note</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-ink">Target Close Date</label>
                <input
                  name="closeDate"
                  defaultValue={roundConfig.closeDate}
                  className="w-full px-3 py-2 rounded-xl bg-surface-alt border border-border text-ink focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsEditRoundOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-ink-soft hover:text-ink"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-brand text-primary-foreground font-bold shadow-glow hover:opacity-95"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== 7. INVESTOR DETAIL MODAL ===== */}
      {selectedDealForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-surface border border-border rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-brand text-primary-foreground font-black text-xs flex items-center justify-center shadow-xs">
                  {selectedDealForModal.fundLogoText}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-ink">
                    {selectedDealForModal.fundName}
                  </h3>
                  <span className="text-[10px] text-ink-soft">
                    {selectedDealForModal.tier}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDealForModal(null)}
                className="p-1.5 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-surface-alt/60 border border-border space-y-2">
                <div className="flex items-center justify-between font-bold text-ink">
                  <span>Lead Partner: {selectedDealForModal.leadPartner}</span>
                  <span className="text-emerald-500 font-extrabold">
                    {selectedDealForModal.checkSizeText}
                  </span>
                </div>
                <div className="text-[11px] text-ink-soft">
                  Contact: {selectedDealForModal.partnerEmail}
                </div>
                <div className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  ⚡ Recency: {selectedDealForModal.recentDeal}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-ink">Pipeline Stage</label>
                <select
                  value={selectedDealForModal.stage}
                  onChange={async (e) => {
                    const newStage = e.target.value as FundraisingStage;
                    const dealId = selectedDealForModal._id || selectedDealForModal.id;
                    if (dealId) {
                      await moveDealStage(dealId, newStage);
                      setSelectedDealForModal({ ...selectedDealForModal, stage: newStage });
                      toast.success(`Deal moved to ${STAGE_CONFIG[newStage]?.label || newStage}`);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-surface-alt border border-border font-bold text-ink focus:outline-none focus:border-primary"
                >
                  {Object.entries(STAGE_CONFIG).map(([k, cfg]) => (
                    <option key={k} value={k}>
                      {cfg.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-ink">Interaction Notes & Feedback</label>
                <textarea
                  rows={3}
                  value={selectedDealForModal.notes}
                  onChange={(e) => {
                    const updatedNotes = e.target.value;
                    const dealId = selectedDealForModal._id || selectedDealForModal.id;
                    if (dealId) {
                      updateDeal(dealId, { notes: updatedNotes });
                    }
                    setSelectedDealForModal({ ...selectedDealForModal, notes: updatedNotes });
                  }}
                  className="w-full p-3 rounded-xl bg-surface-alt border border-border text-ink focus:outline-none focus:border-primary resize-none"
                />
              </div>

              {/* Touchpoint & Activity Timeline */}
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-ink">Activity Timeline & Notes</label>
                  <span className="text-[10px] text-ink-soft">
                    {selectedDealForModal.activities?.length || 0} touchpoints
                  </span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Log founder call note or meeting update..."
                    value={dealNoteText}
                    onChange={(e) => setDealNoteText(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter" && dealNoteText.trim()) {
                        const dealId = selectedDealForModal._id || selectedDealForModal.id;
                        if (!dealId) return;
                        const updated = await addDealActivity(dealId, {
                          type: "note",
                          note: dealNoteText.trim(),
                        });
                        setSelectedDealForModal(updated);
                        setDealNoteText("");
                        toast.success("Touchpoint note logged");
                      }
                    }}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-surface-alt border border-border text-xs text-ink focus:outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={async () => {
                      if (!dealNoteText.trim()) return;
                      const dealId = selectedDealForModal._id || selectedDealForModal.id;
                      if (!dealId) return;
                      const updated = await addDealActivity(dealId, {
                        type: "note",
                        note: dealNoteText.trim(),
                      });
                      setSelectedDealForModal(updated);
                      setDealNoteText("");
                      toast.success("Touchpoint note logged");
                    }}
                    className="px-3 py-1.5 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-glow cursor-pointer shrink-0"
                  >
                    Log
                  </button>
                </div>

                <div className="max-h-32 overflow-y-auto space-y-1.5 pt-1 scrollbar-thin">
                  {selectedDealForModal.activities && selectedDealForModal.activities.length > 0 ? (
                    selectedDealForModal.activities.map((act) => (
                      <div
                        key={act.id}
                        className="p-2 rounded-lg bg-surface-alt/70 border border-border/70 text-[11px] flex items-start justify-between gap-2"
                      >
                        <div className="space-y-0.5">
                          <p className="text-ink font-medium">{act.note}</p>
                          <span className="text-[10px] text-ink-soft">
                            {act.date} • {act.author || "Founder"}
                          </span>
                        </div>
                        <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-surface border text-ink-soft shrink-0">
                          {act.type}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-ink-soft italic">No touchpoints logged yet.</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={async () => {
                    const dealId = selectedDealForModal._id || selectedDealForModal.id;
                    if (dealId) {
                      await deleteDeal(dealId);
                      toast.success("Deal removed from pipeline");
                    }
                    setSelectedDealForModal(null);
                  }}
                  className="text-rose-500 hover:underline font-bold text-xs cursor-pointer"
                >
                  Delete Deal
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const deal = selectedDealForModal;
                      setSelectedDealForModal(null);
                      handleOpenAiOutreach(deal);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-primary/15 text-primary-glow font-bold text-xs hover:bg-primary/25 transition flex items-center gap-1 cursor-pointer"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>AI Pitch Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedDealForModal(null)}
                    className="px-4 py-1.5 rounded-xl bg-gradient-brand text-primary-foreground font-bold shadow-glow text-xs cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
