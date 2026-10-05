"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  Bell,
  CheckCircle2,
  Lock,
  type LucideIcon,
} from "lucide-react";

interface ComingSoonPageProps {
  section: string;
  title: string;
  description: string;
  icon: LucideIcon;
  highlights?: string[];
  eta?: string;
}

export function ComingSoonPage({
  section,
  title,
  description,
  icon: Icon,
  highlights = [
    "Seamless real-time synchronization with recruiter candidate pipelines",
    "Intelligent AI automations and conversational analytics",
    "Enterprise-grade role-based access control and notifications",
  ],
  eta = "Coming in Next Release",
}: ComingSoonPageProps) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) return;
    setSubscribed(true);
  };

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto">
      {/* Top Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-ink-soft">
        <Link
          href="/recruiter/dashboard"
          className="hover:text-primary-glow flex items-center gap-1 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
        </Link>
        <span>/</span>
        <span className="text-ink font-bold">{section}</span>
        <span>/</span>
        <span className="text-primary-glow">{title}</span>
      </div>

      {/* Hero Showcase Card */}
      <div className="relative rounded-3xl bg-surface border border-border overflow-hidden shadow-elegant p-8 sm:p-12">
        {/* Glow ambient background effects */}
        <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 bg-primary-glow/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          {/* Tag & Status */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-glow bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-primary-glow" />
              {section}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
              <Lock className="w-3 h-3" />
              {eta}
            </span>
          </div>

          {/* Title with Icon */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-brand text-primary-foreground flex items-center justify-center shadow-glow shrink-0">
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight">
                {title}
              </h1>
              <p className="text-sm sm:text-base text-ink-soft mt-2 leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          {/* Highlights */}
          <div className="mt-8 space-y-3 bg-surface-alt/50 border border-border/80 rounded-2xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
              What to expect:
            </h3>
            <ul className="space-y-2.5">
              {highlights.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-ink font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Early Access / Notify Me Form */}
          <div className="mt-8 pt-6 border-t border-border">
            {subscribed ? (
              <div className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                You&apos;re on the early access priority list! We&apos;ll notify you when {title} goes live.
              </div>
            ) : (
              <form
                onSubmit={handleSubscribe}
                className="flex flex-col sm:flex-row items-stretch gap-2.5 max-w-md"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email for early preview..."
                  required
                  className="input-base text-xs flex-1"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-bold bg-gradient-brand text-primary-foreground px-4 py-2.5 rounded-xl shadow-glow hover:scale-[1.02] active:scale-95 transition cursor-pointer shrink-0"
                >
                  <Bell className="w-3.5 h-3.5" />
                  Notify Me
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
