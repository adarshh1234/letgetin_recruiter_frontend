"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { ComingSoonPage } from "@/components/recruiter/ComingSoonPage";

export default function PromoteJobPage() {
  return (
    <ComingSoonPage
      section="Recruitment Marketing"
      title="Promote a Job Ad"
      description="Supercharge your job postings with featured employer badges, top-of-feed placement, targeted candidate pushes, and boosted social media impressions."
      icon={TrendingUp}
      highlights={[
        "Priority placement at the top of candidate search results & mobile feeds",
        "Targeted push notifications to high-match passive candidates in the Letgetin pool",
        "Branded employer spotlight badge on all job search cards",
        "Comprehensive impressions, clicks, and conversion analytics reporting",
      ]}
    />
  );
}
