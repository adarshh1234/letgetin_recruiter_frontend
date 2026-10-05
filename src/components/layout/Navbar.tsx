"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/landing/Logo";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { UserDropdown } from "./UserDropdown";
import {
  Sparkles,
  Menu,
  X,
  ArrowRight,
  LayoutDashboard,
  FileText,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", href: "/resume", icon: LayoutDashboard },
    { name: "Resume Builder", href: "/builder", icon: FileText },
    { name: "AI Onboarding", href: "/demo", icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass border-b border-border text-ink transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Version Badge */}
        <div className="flex items-center gap-4">
          <Logo href="/" />
          <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary-glow bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
            <Sparkles className="w-3 h-3 text-primary-glow" /> Pro Career v2.0
          </span>
        </div>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-surface-alt/60 p-1 rounded-2xl border border-border">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-white text-ink shadow-sm border border-border"
                    : "text-ink-soft hover:text-ink hover:bg-white/50"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${isActive ? "text-primary-glow" : "text-ink-soft"}`}
                />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Auth State */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <UserDropdown />
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/auth"
                className="text-xs font-semibold text-ink-soft hover:text-ink px-3 py-2 rounded-xl transition"
              >
                Sign In
              </Link>
              <Link
                href="/auth"
                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-gradient-brand text-primary-foreground px-4 py-2 rounded-xl shadow-elegant hover:shadow-glow transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-xl border border-border text-ink-soft hover:text-ink hover:bg-surface-alt transition"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? "bg-primary/10 text-primary-glow border border-primary/20"
                    : "text-ink-soft hover:text-ink hover:bg-surface-alt"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
