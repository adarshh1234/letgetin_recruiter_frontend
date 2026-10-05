"use client";

import React from "react";
import { UserPlus } from "lucide-react";
import { ComingSoonPage } from "@/components/recruiter/ComingSoonPage";

export default function CollabAndHirePage() {
  return (
    <ComingSoonPage
      section="Recruitment Marketing"
      title="Collab & Hire"
      description="Empower engineering leads, managers, and team members to collaborate on candidate reviews, share feedback, vote, and run employee referral programs."
      icon={UserPlus}
      highlights={[
        "Private internal candidate evaluation notes and feedback voting threads",
        "Employee referral link generator with tracking rewards dashboard",
        "Role-based visibility controls preserving candidate salary confidentiality",
        "Slack & Microsoft Teams instant notifications for pending interview feedback",
      ]}
    />
  );
}
