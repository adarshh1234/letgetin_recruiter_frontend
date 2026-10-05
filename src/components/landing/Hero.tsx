"use client";

import React from "react";
import { Sparkles, PlayCircle, CheckCircle2, Building2, ArrowRight } from "lucide-react";
import Link from "./NavLink";
import { useAuthStore } from "@/features/auth/store/useAuthStore";

export function Hero() {
  const { isAuthenticated, user } = useAuthStore();
  const dashboardHref = user?.role === "recruiter" ? "/recruiter/dashboard" : "/resume";

  return (
    <section className="pt-28 md:pt-36 pb-16 md:pb-24 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.05] bg-[radial-gradient(ellipse_at_top_right,_var(--primary-glow)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/2 opacity-[0.04] bg-[radial-gradient(ellipse_at_bottom_left,_var(--primary-deep)_0%,_transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-7 animate-fade-up">
            <div className="flex items-center gap-2 text-sm font-medium text-primary-glow bg-primary/5 px-4 py-1.5 rounded-full w-fit border border-primary/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-glow opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-glow" />
              </span>
              <Sparkles className="w-3.5 h-3.5" /> The future of professional identity
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.08] tracking-tight">
              <span className="text-ink">Stop Claiming.</span>
              <br />
              <span className="text-gradient-brand">Start Proving.</span>
            </h1>

            <p className="text-lg md:text-xl text-ink-soft max-w-lg leading-relaxed">
              The professional network where verified skills, not CVs, get you hired.{" "}
              <span className="font-semibold text-ink">
                Companies bid for talent — not the other way around.
              </span>
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              {isAuthenticated ? (
                <Link
                  to={dashboardHref}
                  className="bg-gradient-brand text-primary-foreground font-semibold px-8 py-3.5 rounded-xl shadow-elegant hover:shadow-glow transition-all hover:scale-[1.02] active:scale-95 text-base flex items-center gap-2"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <Link
                  to="/auth"
                  className="bg-gradient-brand text-primary-foreground font-semibold px-8 py-3.5 rounded-xl shadow-elegant hover:shadow-glow transition-all hover:scale-[1.02] active:scale-95 text-base"
                >
                  Get In — It's Free
                </Link>
              )}

              <a
                href="#features"
                className="text-ink font-medium px-6 py-3.5 rounded-xl border border-border hover:border-primary-glow transition flex items-center gap-2"
              >
                <PlayCircle className="w-5 h-5" />
                Watch Demo
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-4 text-sm text-ink-soft">
              {["AI-verified skills", "Zero bias hiring", "Global talent pool"].map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-primary-glow" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary-glow/15 rounded-full blur-3xl" />
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-primary-deep/15 rounded-full blur-3xl" />

              <div className="relative glass rounded-3xl p-6 shadow-elegant border border-white/60">
                <div className="flex items-center gap-4 pb-5 border-b border-border">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-brand flex items-center justify-center text-primary-foreground font-bold text-xl shadow-glow shrink-0">
                    AK
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-ink text-lg truncate">Aisha Kapoor</div>
                    <div className="text-sm text-ink-soft">Product Designer · Verified</div>
                  </div>
                  <div className="ml-auto shrink-0">
                    <span className="bg-success/10 text-success text-xs font-semibold px-3 py-1 rounded-full border border-success/20 whitespace-nowrap">
                      ★ 98% Fit
                    </span>
                  </div>
                </div>

                <div className="py-4 space-y-3">
                  {[
                    { label: "AI Interview Passed", meta: "5 min · Adaptive" },
                    { label: "Portfolio · 12 projects", meta: "97% peer rated" },
                    { label: "Top 5% · Design Community", meta: "🏆 Gold" },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center gap-3 text-sm">
                      <CheckCircle2 className="w-5 h-5 text-primary-glow shrink-0" />
                      <span className="font-medium text-ink truncate">{r.label}</span>
                      <span className="ml-auto text-ink-soft text-xs whitespace-nowrap">
                        {r.meta}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-border">
                  <div className="bg-gradient-brand rounded-xl px-4 py-3 text-primary-foreground text-sm font-medium flex items-center justify-between gap-3">
                    <span className="truncate">3 companies viewing your profile</span>
                    <span className="text-xs opacity-80 shrink-0">Active now</span>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 sm:-left-8 bg-surface rounded-2xl shadow-elegant px-4 py-2.5 border border-border flex items-center gap-3 animate-float">
                <Building2 className="w-6 h-6 text-primary-glow" />
                <div>
                  <div className="text-xs font-semibold text-ink">Stripe · hiring</div>
                  <div className="text-xs text-ink-soft">Offered $185k · 2d ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
