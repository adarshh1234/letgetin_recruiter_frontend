"use client";

import { Hourglass } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function ProbationPage() {
  return (
    <ComingSoon
      title="Probation"
      description="Track probation timelines and review outcomes for recently hired employees."
      icon={Hourglass}
      badge="Workforce Suite · Coming Soon"
      backHref="/recruiter/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}
