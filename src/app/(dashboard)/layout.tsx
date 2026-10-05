"use client";

import React, { useState } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { UserDropdown } from "@/components/layout/UserDropdown";
import { Menu, Sparkles } from "lucide-react";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const pageTitles: Record<string, string> = {
    "/ai-apply": "AI Apply",
    "/applications": "Applied Job Status",
    "/resume": "Resume Workspace",
    "/builder": "Resume Builder",
    "/demo": "AI Career Onboarding",
    "/explore": "Explore Opportunities",
    "/profile": "User Profile & Identity",
    "/drive": "LetGetIn Cloud Drive",
    "/myhub": "My Hub Command Center",
    "/skills": "Skill Enhancement Hub",
    "/edupie": "Edupie Learning Suite",
    "/geniustest": "Genius Test AI",
    "/calendar": "Calendar",
    "/tasks": "Task Mite",
    "/talent-score": "Talent Score",
    "/talent-boost": "Talent Boost",
    "/career-guidance": "Career Guidance",
    "/career-guidance/ai": "AI Career Guidance",
    "/career-guidance/personal": "Personal Career Guidance",
    "/skills/language": "Language+",
    "/skills/short-term": "Short Term Courses",
    "/skills/admissions": "Admissions",
    "/skills/geniuspie": "Geniuspie.com",
    "/exams": "Certification Exams",
    "/network": "My Network",
    "/team": "My Team",
    "/market": "App Mart",
    "/interviews": "Interviews",
    "/interviews/assessment": "AI Assessment",
    "/interviews/ai-practice": "AI Interview Practice",
    "/interviews/buddy": "Interview Buddy",
    "/interviews/mock": "Mock up Interview",
    "/interviews/schedule": "Interview Schedule",
    "/interviews/translator": "Resume Translator",
    "/my-twin": "My Twin AI",
    "/final-list": "Final List",
    "/training": "Training",
    "/probation": "Probation",
    "/employee-details": "Employee Details",
    "/payroll": "Payroll",
    "/performance": "Performance",
    "/promotions": "Promotions",
    "/mydive": "My Dive Analytics",
  };

  const currentTitle = pageTitles[pathname] || "Dashboard Workspace";

  if (
    pathname === "/geniustest" ||
    pathname?.startsWith("/geniustest/") ||
    pathname === "/myhub" ||
    pathname?.startsWith("/myhub/")
  ) {
    return <AuthGuard>{children}</AuthGuard>;
  }

  return (
    <AuthGuard>
      <div className="min-h-screen flex bg-background text-foreground">
        {/* Left Sidebar */}
        <DashboardSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar Header */}

          {/* <header className="sticky top-0 z-20 h-16 border-b border-border glass px-4 sm:px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl border border-border text-ink-soft hover:text-ink hover:bg-surface-alt transition"
                aria-label="Open Sidebar Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-base font-bold text-ink tracking-tight">
                  {currentTitle}
                </h1>
                <p className="text-[11px] text-ink-soft hidden sm:block">
                  LetGetIn AI Career Workspace
                </p>
              </div>
            </div>

           
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-primary-glow bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
                <Sparkles className="w-3 h-3 text-primary-glow" /> Pro Career
                v2.0
              </span>
              <UserDropdown />
            </div>
          </header> */}

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
