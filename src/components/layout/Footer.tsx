"use client";

import React from "react";
import Link from "next/link";
import { Logo } from "@/components/landing/Logo";
import { ShieldCheck, Sparkles, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-surface border-t border-border text-ink-soft text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Description Column */}
          <div className="md:col-span-2 space-y-4">
            <div className="inline-block">
              <Logo />
            </div>
            <p className="text-ink-soft leading-relaxed max-w-sm text-xs">
              LetGetIn AI is an enterprise-grade AI resume builder and career
              identity suite. Build ATS-friendly, verified resumes that get you
              hired by top tech companies.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-success/10 text-success rounded-full font-semibold text-[11px] border border-success/20">
                <ShieldCheck className="w-3.5 h-3.5" /> 256-bit Encrypted
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary-glow rounded-full font-semibold text-[11px] border border-primary/20">
                <Sparkles className="w-3.5 h-3.5" /> Powered by Gemini AI
              </span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-ink font-bold text-xs uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/resume"
                  className="hover:text-primary-glow transition"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/builder"
                  className="hover:text-primary-glow transition"
                >
                  Resume Builder
                </Link>
              </li>
              <li>
                <Link
                  href="/demo"
                  className="hover:text-primary-glow transition"
                >
                  AI Career Onboarding
                </Link>
              </li>
              <li>
                <Link
                  href="/ats"
                  className="hover:text-primary-glow transition"
                >
                  ATS Score Optimization
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Security */}
          <div className="space-y-3">
            <h4 className="text-ink font-bold text-xs uppercase tracking-wider">
              Security & Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-primary-glow transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-glow transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary-glow transition">
                  Security Architecture
                </a>
              </li>
              <li>
                <span className="inline-flex items-center gap-1.5 text-success font-semibold">
                  <span className="w-2 h-2 rounded-full bg-success animate-ping" />
                  All Systems Operational
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-ink-soft">
            © {new Date().getFullYear()} LetGetIn AI SaaS Inc. All rights
            reserved.
          </p>
          <div className="flex items-center gap-1 text-[11px] text-ink-soft">
            <span>Built for modern tech professionals with</span>
            <Heart className="w-3 h-3 text-destructive fill-destructive inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
