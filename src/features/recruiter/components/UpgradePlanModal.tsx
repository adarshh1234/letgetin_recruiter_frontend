"use client";

import React, { useState } from "react";
import { Check, Crown, Sparkles, X, Zap, Shield, ArrowRight } from "lucide-react";

interface UpgradePlanModalProps {
  open: boolean;
  onClose: () => void;
  currentPlanId?: string;
}

interface PlanTier {
  id: string;
  name: string;
  badge?: string;
  priceMonthly: number;
  priceAnnual: number;
  description: string;
  creditsPerMonth: number;
  features: string[];
  popular?: boolean;
}

const TIERS: PlanTier[] = [
  {
    id: "starter",
    name: "Starter",
    priceMonthly: 2999,
    priceAnnual: 2399,
    description: "Ideal for small teams and early-stage startups hiring occasionally.",
    creditsPerMonth: 50,
    features: [
      "Up to 5 active job postings",
      "50 hiring credits included / month",
      "Standard resume shortlisting",
      "Single-round candidate assessment",
      "Standard email support",
    ],
  },
  {
    id: "growth",
    name: "Growth Recruiter Pro",
    badge: "Most Popular",
    priceMonthly: 7999,
    priceAnnual: 6399,
    description: "For fast-scaling teams looking for automated AI matching and multi-round screening.",
    creditsPerMonth: 250,
    popular: true,
    features: [
      "Up to 25 active job postings",
      "250 hiring credits included / month",
      "AI resume shortlisting & auto-ranking",
      "Multi-round assessments & coding challenges",
      "AI Job Description & Skills Assistant",
      "Automated AI candidate video interviews",
      "Priority recruiter support",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise Suite",
    badge: "Unlimited Scale",
    priceMonthly: 19999,
    priceAnnual: 15999,
    description: "For large enterprises, agencies, and institutions hiring at scale.",
    creditsPerMonth: 1000,
    features: [
      "Unlimited active job postings",
      "1,000 hiring credits included / month",
      "Deep semantic candidate matching engine",
      "Custom proctored assessment round builder",
      "Dedicated account manager & talent partner",
      "Custom ATS / HRMS webhooks & API access",
      "24/7 dedicated enterprise support & SLA",
    ],
  },
];

export function UpgradePlanModal({
  open,
  onClose,
  currentPlanId = "growth",
}: UpgradePlanModalProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!open) return null;

  const handleSelectPlan = (tierId: string) => {
    setSelectedTier(tierId);
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setSelectedTier(null);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-surface border border-border rounded-3xl shadow-2xl p-6 sm:p-8 my-auto max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-glow bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-3">
            <Crown className="w-3.5 h-3.5" />
            Recruiter Subscription Plans
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
            Upgrade Your Hiring Power
          </h2>
          <p className="text-sm text-ink-soft mt-2">
            Unlock advanced AI candidate matching, automated assessments, and scale your talent acquisition with flexible credit allocations.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex items-center gap-1.5 p-1 bg-surface-alt border border-border rounded-2xl mt-5">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                billingCycle === "monthly"
                  ? "bg-white text-ink shadow-sm"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              Billed Monthly
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("annual")}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                billingCycle === "annual"
                  ? "bg-white text-ink shadow-sm"
                  : "text-ink-soft hover:text-ink"
              }`}
            >
              <span>Billed Annually</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {isSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center animate-fade-in">
            <p className="text-sm font-bold text-emerald-600 flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              Thank you! Your request to switch to the {TIERS.find((t) => t.id === selectedTier)?.name} plan has been received. Our account manager will contact you shortly.
            </p>
          </div>
        )}

        {/* Plan Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {TIERS.map((tier) => {
            const isCurrent = tier.id === currentPlanId;
            const price = billingCycle === "monthly" ? tier.priceMonthly : tier.priceAnnual;

            return (
              <div
                key={tier.id}
                className={`relative flex flex-col justify-between rounded-2xl p-6 border transition-all ${
                  tier.popular
                    ? "border-primary bg-gradient-to-b from-primary/5 via-surface to-surface shadow-elegant ring-2 ring-primary/20"
                    : "border-border bg-surface hover:border-primary/30 hover:shadow-sm"
                }`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm ${
                        tier.popular
                          ? "bg-gradient-brand text-white"
                          : "bg-surface-alt border border-border text-ink"
                      }`}
                    >
                      {tier.badge}
                    </span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-lg font-bold text-ink">{tier.name}</h3>
                    {isCurrent && (
                      <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        Current Plan
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-ink-soft min-h-[36px]">{tier.description}</p>

                  {/* Price */}
                  <div className="mt-4 mb-4 pb-4 border-b border-border/70">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-ink">
                        ₹{price.toLocaleString()}
                      </span>
                      <span className="text-xs font-semibold text-ink-soft">/ month</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-primary-glow">
                      <Zap className="w-3.5 h-3.5" />
                      <span>{tier.creditsPerMonth} credits included / mo</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2.5 mb-6">
                    <span className="text-[11px] font-bold text-ink uppercase tracking-wider block">
                      What&apos;s Included:
                    </span>
                    {tier.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 text-xs text-ink-soft">
                        <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 text-primary-glow" />
                        </div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4 border-t border-border/70">
                  {isCurrent ? (
                    <button
                      type="button"
                      disabled
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-ink-soft bg-surface-alt border border-border cursor-default text-center"
                    >
                      Active Current Plan
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSelectPlan(tier.id)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm hover:scale-[1.02] active:scale-95 cursor-pointer ${
                        tier.popular
                          ? "bg-gradient-brand text-white hover:shadow-glow"
                          : "bg-surface text-ink border border-border hover:bg-surface-alt hover:border-primary/40"
                      }`}
                    >
                      <span>Upgrade to {tier.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Security & Guarantee Footer */}
        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-soft">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary-glow" />
            <span>Secure 256-bit encrypted checkout. Cancel or upgrade anytime.</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Need custom seat pricing?</span>
            <button
              type="button"
              onClick={() => handleSelectPlan("enterprise")}
              className="font-bold text-primary-glow hover:underline"
            >
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
