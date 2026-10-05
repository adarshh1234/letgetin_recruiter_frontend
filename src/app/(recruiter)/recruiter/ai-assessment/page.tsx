"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AIAssessmentRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/recruiter/domain-assessments");
  }, [router]);

  return (
    <div className="min-h-screen bg-surface-alt/20 p-8 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-ink-soft">Redirecting to Domain Specific Assessments...</p>
      </div>
    </div>
  );
}
