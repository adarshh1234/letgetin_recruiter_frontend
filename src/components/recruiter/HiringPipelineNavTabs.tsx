"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { GitCommit, KanbanSquare, FileCheck2, Award, ListChecks } from "lucide-react";

export const HIRING_PIPELINE_TABS = [
  {
    name: "Hiring Timeline",
    href: "/recruiter/jobs?tab=timeline",
    tabKey: "timeline",
    icon: GitCommit,
    badge: "Funnel",
  },
  {
    name: "Kanban",
    href: "/recruiter/jobs?tab=kanban",
    tabKey: "kanban",
    icon: KanbanSquare,
    badge: "Live",
  },
  {
    name: "Resume Shortlisting",
    href: "/recruiter/hiring-pipeline/resume-screening",
    tabKey: "resume-screening",
    icon: FileCheck2,
    badge: "Qualification",
  },
  {
    name: "Final Shortlist",
    href: "/recruiter/hiring-pipeline/final-shortlist",
    tabKey: "final-shortlist",
    icon: Award,
    badge: "Decisions",
  },
  {
    name: "Candidate Listing",
    href: "/recruiter/jobs?tab=candidates",
    tabKey: "candidates",
    icon: ListChecks,
    badge: "Directory",
  },
];

interface HiringPipelineNavTabsProps {
  jobId?: string;
}

export function HiringPipelineNavTabs({ jobId }: HiringPipelineNavTabsProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentJobId = jobId || searchParams.get("jobId");
  const currentTab = searchParams.get("tab") || "timeline";
  const isJobsBoard = pathname === "/recruiter/jobs";

  return (
    <div className="flex items-center gap-1.5 p-1 bg-surface-alt/80 border border-border/80 rounded-2xl w-fit max-w-full overflow-x-auto shadow-xs mb-6">
      {HIRING_PIPELINE_TABS.map((tab) => {
        const Icon = tab.icon;
        const separator = tab.href.includes("?") ? "&" : "?";
        const targetHref = currentJobId ? `${tab.href}${separator}jobId=${currentJobId}` : tab.href;

        let isActive = false;
        if (tab.tabKey === "resume-screening") {
          isActive = pathname?.startsWith("/recruiter/hiring-pipeline/resume-screening");
        } else if (tab.tabKey === "final-shortlist") {
          isActive = pathname?.startsWith("/recruiter/hiring-pipeline/final-shortlist");
        } else if (isJobsBoard) {
          isActive = currentTab === tab.tabKey;
        } else if (tab.tabKey === "timeline" && pathname?.includes("/timeline")) {
          isActive = true;
        } else if (tab.tabKey === "kanban" && pathname?.includes("/kanban")) {
          isActive = true;
        } else if (tab.tabKey === "candidates" && pathname?.includes("/candidates")) {
          isActive = true;
        }

        return (
          <Link
            key={tab.name}
            href={targetHref}
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
