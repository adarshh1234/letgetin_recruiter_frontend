"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Search, ListChecks, UserCheck } from "lucide-react";

export const TALENT_POOL_TABS = [
  {
    name: "Talent Pool",
    href: "/recruiter/talent-pool",
    icon: Users,
    badge: "Overview",
  },
  {
    name: "CV Search",
    href: "/recruiter/cv-search",
    icon: Search,
  },
  {
    name: "Candidate List",
    href: "/recruiter/candidates",
    icon: UserCheck,
  },
  {
    name: "Track Applicants",
    href: "/recruiter/track",
    icon: ListChecks,
  },
];

export function TalentPoolNavTabs() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1.5 p-1 bg-surface-alt/80 border border-border/80 rounded-2xl w-fit max-w-full overflow-x-auto shadow-xs mb-6">
      {TALENT_POOL_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              isActive
                ? "bg-surface text-primary shadow-xs border border-border/60"
                : "text-ink-soft hover:text-ink hover:bg-surface/50"
            }`}
          >
            <Icon
              className={`w-3.5 h-3.5 ${
                isActive ? "text-primary-glow" : "text-ink-soft"
              }`}
            />
            <span>{tab.name}</span>
            {tab.badge && (
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? "bg-primary/10 text-primary-glow"
                    : "bg-surface text-ink-soft"
                }`}
              >
                {tab.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
