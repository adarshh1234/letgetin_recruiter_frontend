"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowLeft, Clock, Rocket, LucideIcon } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  badge?: string;
  /** Use inside a nested section/panel instead of as full tab content - shorter height, no "Back to Dashboard" action. */
  compact?: boolean;
  /** Where the "Back" action links to. */
  backHref?: string;
  /** Label for the back action link. */
  backLabel?: string;
}

export function ComingSoon({
  title,
  description = "This feature is currently under active development. Stay tuned for AI-powered career analytics, smart tools, and professional identity suite.",
  icon: Icon = Rocket,
  badge = "Pro Feature · Coming Soon",
  compact = false,
  backHref = "/dashboard",
  backLabel = "Back to Dashboard",
}: ComingSoonProps) {
  return (
    <div
      className={`p-6 sm:p-12 max-w-5xl mx-auto flex flex-col items-center justify-center text-center animate-fade-up ${
        compact ? "py-14" : "min-h-[calc(100vh-8rem)]"
      }`}
    >
      {/* Ambient Glow */}
      <div className="relative mb-6">
        <div className="absolute -inset-4 bg-primary-glow/20 rounded-full blur-2xl animate-pulse" />
        <div className="relative w-20 h-20 rounded-3xl bg-gradient-brand text-primary-foreground flex items-center justify-center shadow-glow">
          <Icon className="w-10 h-10" />
        </div>
      </div>

      {/* Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary-glow mb-4">
        <Sparkles className="w-3.5 h-3.5" />
        <span>{badge}</span>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight max-w-xl">
        <span className="text-gradient-brand">{title}</span> is coming soon
      </h1>

      {/* Description */}
      <p className="mt-3 text-sm sm:text-base text-ink-soft max-w-lg leading-relaxed">
        {description}
      </p>

      {/* Release Notice */}
      <div className="mt-6 flex items-center gap-2 text-xs text-ink-soft bg-surface-alt/60 border border-border px-4 py-2 rounded-xl">
        <Clock className="w-4 h-4 text-primary-glow" />
        <span>Expected release in upcoming LetGetIn AI sprint</span>
      </div>

      {/* Action Buttons */}
      {!compact && (
        <div className="mt-8 flex items-center gap-4">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-xs font-semibold bg-gradient-brand text-primary-foreground px-6 py-3 rounded-xl shadow-elegant hover:shadow-glow transition-all hover:scale-[1.02] active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{backLabel}</span>
          </Link>
        </div>
      )}
    </div>
  );
}

export default ComingSoon;
