"use client";

import { Mic } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function InterviewsPage() {
  return (
    <ComingSoon
      title="Interviews"
      description="Schedule, conduct, and track candidate interviews from a single workspace."
      icon={Mic}
      badge="Hiring Suite · Coming Soon"
      backHref="/recruiter/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}
