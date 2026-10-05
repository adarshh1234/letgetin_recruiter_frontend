"use client";

import { ClipboardCheck } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function FinalListPage() {
  return (
    <ComingSoon
      title="Final List"
      description="Review and confirm your shortlisted candidates before extending offers."
      icon={ClipboardCheck}
      badge="Hiring Suite · Coming Soon"
      backHref="/recruiter/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}
