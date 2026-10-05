"use client";

import { GraduationCap } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function TrainingPage() {
  return (
    <ComingSoon
      title="Training"
      description="Onboard new hires with structured training programs and progress tracking."
      icon={GraduationCap}
      badge="Workforce Suite · Coming Soon"
      backHref="/recruiter/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}
