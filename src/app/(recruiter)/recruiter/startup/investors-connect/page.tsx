"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Handshake,
  Search,
  Users,
  ExternalLink,
  CheckCircle2,
  DollarSign,
  Filter,
  Sparkles,
  Building2,
  MapPin,
  Tag,
  Plus,
  Bot,
  Eye,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  Send,
  Loader2,
  Copy,
  KanbanSquare,
} from "lucide-react";
import { useStartupStore } from "@/features/startup/store/useStartupStore";
import { startupService } from "@/features/startup/services/startupService";
import { Investor } from "@/features/startup/types";
import { toast } from "sonner";

export default function StartupInvestorsConnectPage() {
  const {
    investors,
    isLoadingInvestors,
    loadInvestors,
    createDeal,
    deals,
    loadDeals,
  } = useStartupStore();

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedStage, setSelectedStage] = useState("all");
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  // Modals
  const [selectedInvestorProfile, setSelectedInvestorProfile] = useState<Investor | null>(null);
  const [pitchInvestor, setPitchInvestor] = useState<Investor | null>(null);
  const [isGeneratingPitch, setIsGeneratingPitch] = useState(false);
  const [pitchDraft, setPitchDraft] = useState<{
    subject: string;
    emailBody: string;
    talkingPoints: string[];
  } | null>(null);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [addingDealId, setAddingDealId] = useState<string | null>(null);

  // Fetch investors and pipeline deals on mount
  const fetchInvestors = useCallback(() => {
    loadInvestors({
      search: search.trim() || undefined,
      type: selectedType !== "all" ? selectedType : undefined,
      sector: selectedSector !== "all" ? selectedSector : undefined,
      stage: selectedStage !== "all" ? selectedStage : undefined,
    });
  }, [search, selectedType, selectedSector, selectedStage, loadInvestors]);

  useEffect(() => {
    fetchInvestors();
    loadDeals();
  }, [fetchInvestors, loadDeals]);

  // Check if an investor is already in the founder's active pipeline
  const isInvestorInPipeline = (investor: Investor) => {
    return deals.some(
      (d) =>
        (d.investorId && d.investorId === investor._id) ||
        d.fundName.toLowerCase() === investor.name.toLowerCase() ||
        d.fundName.toLowerCase() === investor.firm.toLowerCase()
    );
  };

  // Add to pipeline handler
  const handleAddToPipeline = async (investor: Investor) => {
    setAddingDealId(investor._id);
    try {
      await createDeal({
        investorId: investor._id,
        fundName: investor.name,
        fundLogoText: investor.name.slice(0, 2).toUpperCase(),
        tier: investor.type.includes("Angel")
          ? "Angel Syndicate"
          : investor.type.includes("Accelerator")
          ? "Micro VC"
          : "Tier 1 VC",
        leadPartner: investor.contactPerson?.name || "Lead Partner",
        partnerRole: investor.contactPerson?.role || "General Partner",
        partnerEmail: investor.contactPerson?.email || "",
        linkedinUrl: investor.contactPerson?.linkedinUrl || investor.website || "",
        stage: "prospect",
        checkSize: investor.minTicket || 500000,
        checkSizeText: investor.typicalTicket || "$500,000",
        focusTags: investor.sectors.slice(0, 3),
        notes: `Identified via Verified Investor Directory. Match Score: ${investor.matchScore || 85}%.`,
        recentDeal: investor.portfolioCompanies.slice(0, 2).join(", "),
      });
      toast.success(`Added ${investor.name} to your Fundraising Pipeline!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to add to pipeline");
    } finally {
      setAddingDealId(null);
    }
  };

  // Generate AI Pitch Draft
  const handleOpenPitchModal = async (investor: Investor) => {
    setPitchInvestor(investor);
    setIsGeneratingPitch(true);
    setPitchDraft(null);

    try {
      const draft = await startupService.generateAIPersonalizedPitch({
        investorId: investor._id,
        investorName: investor.name,
        investorFirm: investor.firm,
        partnerName: investor.contactPerson?.name,
      });
      setPitchDraft(draft);
    } catch (err) {
      toast.error("Failed to generate AI pitch draft. Using fallback template.");
      setPitchDraft({
        subject: `Partnership Introduction — Seed Round Opportunity`,
        emailBody: `Hi ${investor.contactPerson?.name || investor.name},\n\nI’ve been following ${investor.firm}'s investments in ${investor.sectors.slice(0, 2).join(" & ")} and wanted to introduce our venture.\n\nWe are building a scalable, AI-powered platform tailored to high-growth enterprises.\n\nGiven your thesis around ${investor.thesis ? investor.thesis.slice(0, 100) + '...' : 'early-stage technology companies'}, I'd love to schedule a brief 15-minute introductory call next week.\n\nBest regards,\nFounding Team`,
        talkingPoints: [
          `Aligned with ${investor.firm}'s sector focus`,
          `Typical check (${investor.typicalTicket}) matches our round parameters`,
        ],
      });
    } finally {
      setIsGeneratingPitch(false);
    }
  };

  const handleCopyPitch = () => {
    if (!pitchDraft) return;
    navigator.clipboard.writeText(`Subject: ${pitchDraft.subject}\n\n${pitchDraft.emailBody}`);
    setCopiedPitch(true);
    toast.success("Pitch email copied to clipboard!");
    setTimeout(() => setCopiedPitch(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto select-none">
      {/* ===== Header ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-black text-ink tracking-tight">
              Investors Connect
            </h1>
            <span className="inline-flex items-center gap-1 text-xs font-bold text-primary-glow bg-primary/10 border border-primary/20 px-3 py-0.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" /> Deterministic AI Matching
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink-soft mt-1">
            Discover verified venture capital funds, angels, and family offices. Compare explainable thesis fit scores and bridge directly into your deal pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/recruiter/startup/fundraising-pipeline"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface border border-border hover:bg-surface-alt text-ink font-bold text-xs shadow-xs transition"
          >
            <KanbanSquare className="w-4 h-4 text-primary" />
            <span>View Pipeline ({deals.length})</span>
          </Link>
        </div>
      </div>

      {/* ===== Search & Filter Toolbar ===== */}
      <div className="p-4 rounded-2xl bg-surface border border-border shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-ink-soft absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by fund name, partner, sector, or investment thesis..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-alt/50 border border-border text-xs font-medium text-ink placeholder:text-ink-soft/70 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary-glow"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-xl border border-border bg-surface text-xs font-semibold text-ink focus:outline-none cursor-pointer"
            >
              <option value="all">All Investor Types</option>
              <option value="Venture Capital">Venture Capital (VC)</option>
              <option value="Angel">Angel Syndicate</option>
              <option value="Family Office">Family Office</option>
              <option value="Accelerator">Accelerator / Incubator</option>
            </select>

            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-3 py-2 rounded-xl border border-border bg-surface text-xs font-semibold text-ink focus:outline-none cursor-pointer"
            >
              <option value="all">All Sectors</option>
              <option value="Enterprise AI">Enterprise AI / ML</option>
              <option value="B2B SaaS">B2B SaaS</option>
              <option value="Fintech">Fintech</option>
              <option value="Consumer Tech">Consumer Tech</option>
              <option value="DeepTech">DeepTech</option>
            </select>

            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="px-3 py-2 rounded-xl border border-border bg-surface text-xs font-semibold text-ink focus:outline-none cursor-pointer"
            >
              <option value="all">All Stages</option>
              <option value="Pre-seed">Pre-Seed</option>
              <option value="Seed">Seed Stage</option>
              <option value="Series A">Series A</option>
            </select>
          </div>
        </div>
      </div>

      {/* ===== Investors Grid ===== */}
      {isLoadingInvestors ? (
        <div className="py-24 text-center space-y-3 bg-surface border border-border rounded-3xl">
          <Loader2 className="w-8 h-8 text-primary-glow animate-spin mx-auto" />
          <p className="text-xs font-medium text-ink-soft">
            Querying verified investor directory and computing explainable match scores...
          </p>
        </div>
      ) : investors.length === 0 ? (
        <div className="py-16 text-center space-y-4 bg-surface border border-border rounded-3xl p-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Handshake className="w-6 h-6" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h3 className="text-base font-bold text-ink">No matching investors found</h3>
            <p className="text-xs text-ink-soft">
              Try adjusting your search criteria or resetting filters to explore our directory of 250+ verified investors.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedType("all");
              setSelectedSector("all");
              setSelectedStage("all");
            }}
            className="px-4 py-2 rounded-xl bg-primary text-white font-bold text-xs hover:bg-primary-glow transition cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {investors.map((inv) => {
            const inPipeline = isInvestorInPipeline(inv);
            const isMatchExpanded = expandedMatchId === inv._id;

            return (
              <div
                key={inv._id}
                className="p-5 rounded-3xl border border-border bg-surface shadow-xs space-y-4 hover:border-primary-glow/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  {/* Top Row: Firm Name & Match Score Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-ink truncate">{inv.name}</h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface-alt border border-border text-ink-soft shrink-0">
                          {inv.type}
                        </span>
                      </div>
                      <p className="text-xs text-ink-soft flex items-center gap-1.5 truncate">
                        <Building2 className="w-3.5 h-3.5 text-ink-soft shrink-0" />
                        <span className="font-semibold text-ink">{inv.firm}</span>
                        <span>•</span>
                        <MapPin className="w-3 h-3 text-ink-soft shrink-0" />
                        <span>{inv.location}</span>
                      </p>
                    </div>

                    {/* Deterministic Match Score Badge */}
                    {inv.matchScore !== undefined && (
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedMatchId(isMatchExpanded ? null : inv._id)
                        }
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 text-xs font-extrabold shadow-2xs hover:bg-emerald-500/20 transition cursor-pointer shrink-0"
                        title="Click to view explainable match breakdown"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{inv.matchScore}% Match</span>
                        {isMatchExpanded ? (
                          <ChevronUp className="w-3 h-3 ml-0.5" />
                        ) : (
                          <ChevronDown className="w-3 h-3 ml-0.5" />
                        )}
                      </button>
                    )}
                  </div>

                  {/* Explainable Match Breakdown Drawer (Expandable) */}
                  {isMatchExpanded && inv.matchReasons && (
                    <div className="p-3 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2 text-xs animate-in fade-in zoom-in-98 duration-150">
                      <div className="font-bold text-ink text-[11px] uppercase tracking-wider">
                        Why this is an explainable match:
                      </div>
                      <ul className="space-y-1 text-ink-soft">
                        {inv.matchReasons.map((reason, rIdx) => (
                          <li key={rIdx} className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
                            <Check className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                            <span>{reason}</span>
                          </li>
                        ))}
                      </ul>
                      {inv.potentialMismatches && inv.potentialMismatches.length > 0 && (
                        <ul className="space-y-1 pt-1 border-t border-emerald-500/20 text-amber-700 dark:text-amber-300">
                          {inv.potentialMismatches.map((mis, mIdx) => (
                            <li key={mIdx} className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold">⚠</span>
                              <span>{mis}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  {/* Thesis & Description */}
                  {inv.thesis && (
                    <p className="text-xs text-ink-soft line-clamp-2 leading-relaxed">
                      {inv.thesis}
                    </p>
                  )}

                  {/* Check Size & Portfolio Summary Box */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-surface-alt/50 border border-border/80 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-ink-soft block">
                        Typical Ticket
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {inv.typicalTicket || "$500k - $2M"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-ink-soft block">
                        Recent Portfolio
                      </span>
                      <span className="font-semibold text-ink truncate block">
                        {inv.portfolioCompanies && inv.portfolioCompanies.length > 0
                          ? inv.portfolioCompanies.slice(0, 3).join(", ")
                          : "Early Seed Backer"}
                      </span>
                    </div>
                  </div>

                  {/* Sector Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {inv.sectors.map((sec, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-semibold px-2.5 py-0.5 rounded-lg bg-surface-alt border border-border text-ink-soft"
                      >
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedInvestorProfile(inv)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-ink-soft hover:text-ink transition cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Profile</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenPitchModal(inv)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-alt hover:bg-primary/10 hover:text-primary border border-border hover:border-primary/20 text-ink font-bold text-xs transition cursor-pointer"
                    >
                      <Bot className="w-3.5 h-3.5 text-primary" />
                      <span>Draft AI Pitch</span>
                    </button>

                    <button
                      type="button"
                      disabled={inPipeline || addingDealId === inv._id}
                      onClick={() => handleAddToPipeline(inv)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                        inPipeline
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 cursor-default"
                          : "bg-gradient-brand text-primary-foreground shadow-xs hover:scale-105"
                      }`}
                    >
                      {addingDealId === inv._id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : inPipeline ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Plus className="w-3.5 h-3.5" />
                      )}
                      <span>{inPipeline ? "In Pipeline" : "Add to Pipeline"}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== Investor Full Profile Modal ===== */}
      {selectedInvestorProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-surface border border-border rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-ink">{selectedInvestorProfile.name}</h3>
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {selectedInvestorProfile.type}
                  </span>
                </div>
                <p className="text-xs text-ink-soft">
                  {selectedInvestorProfile.firm} • {selectedInvestorProfile.location}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInvestorProfile(null)}
                className="p-1.5 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Match Score Banner */}
            {selectedInvestorProfile.matchScore !== undefined && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-ink">
                    Compatibility Score:{" "}
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                      {selectedInvestorProfile.matchScore}%
                    </span>
                  </span>
                </div>
                <span className="text-[11px] text-ink-soft font-semibold">
                  Deterministic Thesis Match
                </span>
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-ink-soft block">
                  Investment Thesis
                </span>
                <p className="text-ink-soft leading-relaxed bg-surface-alt/40 p-3 rounded-2xl border border-border/80">
                  {selectedInvestorProfile.thesis || selectedInvestorProfile.description || "General venture capital deployment across high-growth startups."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-surface-alt/60 border border-border">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-ink-soft block">
                    Typical Check
                  </span>
                  <span className="font-bold text-emerald-600">
                    {selectedInvestorProfile.typicalTicket || "$500,000 - $2,000,000"}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-ink-soft block">
                    Stages Backed
                  </span>
                  <span className="font-bold text-ink">
                    {selectedInvestorProfile.stages?.join(", ") || "Seed, Series A"}
                  </span>
                </div>
              </div>

              {selectedInvestorProfile.portfolioCompanies && selectedInvestorProfile.portfolioCompanies.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-ink-soft block">
                    Selected Portfolio Companies
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedInvestorProfile.portfolioCompanies.map((c, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-xl bg-surface-alt border border-border text-ink font-semibold text-xs"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedInvestorProfile.contactPerson?.name && (
                <div className="p-3 rounded-2xl bg-surface-alt/40 border border-border flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-ink-soft block">
                      Lead Partner / Contact
                    </span>
                    <span className="font-bold text-ink">
                      {selectedInvestorProfile.contactPerson.name}
                      {selectedInvestorProfile.contactPerson.role ? ` (${selectedInvestorProfile.contactPerson.role})` : ""}
                    </span>
                  </div>
                  {selectedInvestorProfile.contactPerson.email && (
                    <span className="text-primary font-mono text-[11px]">
                      {selectedInvestorProfile.contactPerson.email}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedInvestorProfile(null)}
                className="px-4 py-2 rounded-xl border border-border text-ink text-xs font-bold hover:bg-surface-alt"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const inv = selectedInvestorProfile;
                  setSelectedInvestorProfile(null);
                  handleAddToPipeline(inv);
                }}
                disabled={isInvestorInPipeline(selectedInvestorProfile)}
                className="px-5 py-2 rounded-xl bg-gradient-brand text-primary-foreground text-xs font-bold shadow-glow hover:scale-105 disabled:opacity-50 transition"
              >
                {isInvestorInPipeline(selectedInvestorProfile) ? "Already in Pipeline" : "Add to Pipeline"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== AI Pitch Email Generator Modal ===== */}
      {pitchInvestor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-surface border border-border rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-border pb-3">
              <div className="space-y-0.5">
                <h3 className="text-base font-extrabold text-ink flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary-glow" />
                  <span>AI Personalized Investor Pitch</span>
                </h3>
                <p className="text-xs text-ink-soft">
                  Tailored to {pitchInvestor.name} ({pitchInvestor.firm})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPitchInvestor(null)}
                className="p-1.5 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isGeneratingPitch ? (
              <div className="py-12 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-primary-glow animate-spin mx-auto" />
                <p className="text-xs font-medium text-ink-soft">
                  Synthesizing startup traction, target round, and investor thesis with Gemini AI...
                </p>
              </div>
            ) : pitchDraft ? (
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-ink">Subject Line</label>
                  <input
                    type="text"
                    value={pitchDraft.subject}
                    onChange={(e) =>
                      setPitchDraft({ ...pitchDraft, subject: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-surface-alt border border-border text-ink font-semibold focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-ink">Personalized Email Body</label>
                  <textarea
                    rows={8}
                    value={pitchDraft.emailBody}
                    onChange={(e) =>
                      setPitchDraft({ ...pitchDraft, emailBody: e.target.value })
                    }
                    className="w-full p-3 rounded-xl bg-surface-alt border border-border text-ink focus:outline-none focus:border-primary resize-none leading-relaxed"
                  />
                </div>

                {pitchDraft.talkingPoints && pitchDraft.talkingPoints.length > 0 && (
                  <div className="p-3 rounded-2xl bg-primary/5 border border-primary/20 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-primary block">
                      AI Suggested Talking Points
                    </span>
                    <ul className="space-y-0.5 text-ink-soft text-[11px]">
                      {pitchDraft.talkingPoints.map((tp, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                          <span>{tp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <button
                type="button"
                onClick={() => setPitchInvestor(null)}
                className="px-4 py-2 rounded-xl border border-border text-ink text-xs font-bold hover:bg-surface-alt"
              >
                Cancel
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyPitch}
                  disabled={!pitchDraft}
                  className="px-3.5 py-2 rounded-xl bg-surface-alt hover:bg-surface border border-border text-ink font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedPitch ? "Copied!" : "Copy Email"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const inv = pitchInvestor;
                    setPitchInvestor(null);
                    handleAddToPipeline(inv);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-brand text-primary-foreground text-xs font-bold shadow-glow hover:scale-105 transition cursor-pointer"
                >
                  Add to Pipeline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
