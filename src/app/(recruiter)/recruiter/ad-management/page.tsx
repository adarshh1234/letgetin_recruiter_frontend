"use client";

import React from "react";
import { Megaphone } from "lucide-react";
import { ComingSoonPage } from "@/components/recruiter/ComingSoonPage";

export default function AdManagementPage() {
  return (
    <ComingSoonPage
      section="Recruitment Marketing"
      title="Ad Management"
      description="Centralized multi-channel job advertisement management. Create, track, and optimize hiring campaigns across LinkedIn, Indeed, Google Jobs, and social feeds."
      icon={Megaphone}
      highlights={[
        "One-click multi-board job distribution across top employment platforms",
        "Performance tracking for CPC (Cost Per Click) and CPA (Cost Per Applicant)",
        "Automated budget allocation and campaign schedule management",
        "A/B testing for job titles, salary badges, and call-to-action headlines",
      ]}
    />
  );
}
