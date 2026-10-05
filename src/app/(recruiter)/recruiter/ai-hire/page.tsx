"use client";

import { Sparkles } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function AiHirePage() {
  return (
    <ComingSoon
      title="AI Hire"
      description="AI-powered hiring is coming soon. We're building intelligent hiring tools to help you discover, evaluate and hire the right candidates faster."
      icon={Sparkles}
      badge="AI · Coming Soon"
      backHref="/recruiter/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}
