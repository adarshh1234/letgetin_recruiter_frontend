"use client";

import React from "react";
import { Compass } from "lucide-react";
import { ComingSoonPage } from "@/components/recruiter/ComingSoonPage";

export default function PersonalCareerCounsellingPage() {
  return (
    <ComingSoonPage
      section="Career Guidance"
      title="Personal Career Counselling"
      description="Connect directly with verified senior leaders, career psychologists, and industry hiring executives for dedicated 1-on-1 career guidance sessions."
      icon={Compass}
      highlights={[
        "Vetted network of senior engineering leaders, product heads, and executive mentors",
        "Private 45-minute video advisory sessions with calendar booking",
        "Confidential executive coaching, negotiation strategies, and career pivoting",
        "Actionable written post-session takeaway reports and goal tracking",
      ]}
    />
  );
}
