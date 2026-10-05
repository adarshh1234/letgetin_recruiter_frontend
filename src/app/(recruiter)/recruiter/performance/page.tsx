"use client";

import { TrendingUp } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function PerformancePage() {
  return (
    <ComingSoon
      title="Performance"
      description="Set goals, run performance reviews, and track growth across your team."
      icon={TrendingUp}
      badge="Workforce Suite · Coming Soon"
      backHref="/recruiter/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}
