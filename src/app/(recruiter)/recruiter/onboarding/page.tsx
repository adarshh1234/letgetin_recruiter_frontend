"use client";

import { UserCheck } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function OnboardingPage() {
  return (
    <ComingSoon
      title="Onboarding & Induction"
      description="Streamline pre-boarding workflows, employee documents, and structured orientation tracks for accepted finalists."
      icon={UserCheck}
      badge="Hiring Funnel · Coming Soon"
      backHref="/recruiter/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}
