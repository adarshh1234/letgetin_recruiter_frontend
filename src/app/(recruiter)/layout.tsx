"use client";

import React, { useState } from "react";
import { RecruiterGuard } from "@/components/auth/RecruiterGuard";
import { RecruiterShell } from "@/components/layout/RecruiterShell";
import { Logo } from "@/components/landing/Logo";
import { Menu, Sparkles } from "lucide-react";

export default function RecruiterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <RecruiterGuard>
      <div className="min-h-screen flex bg-background text-foreground">
        <RecruiterShell isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Top Header */}
          <header className="lg:hidden sticky top-0 z-20 h-14 border-b border-border bg-surface/90 backdrop-blur-md px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-xl border border-border text-ink-soft hover:text-ink hover:bg-surface-alt transition cursor-pointer"
                aria-label="Open Sidebar Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <Logo href="/recruiter/dashboard" />
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-primary-glow bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
              <Sparkles className="w-3 h-3 text-primary-glow" />
              Recruiter
            </span>
          </header>

          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </RecruiterGuard>
  );
}
