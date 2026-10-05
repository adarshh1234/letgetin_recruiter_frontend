"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";

/**
 * Legacy prototype route: /recruiter/hiring-pipeline/timeline/[stage]
 * Safely redirects to the authoritative dynamic Kanban pipeline.
 */
export default function LegacyStagePrototypeRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const jobId = searchParams.get("jobId");
    const targetUrl = jobId
      ? `/recruiter/jobs?tab=kanban&jobId=${jobId}`
      : `/recruiter/jobs?tab=kanban`;
    router.replace(targetUrl);
  }, [router, searchParams]);

  return (
    <div className="p-16 flex flex-col items-center justify-center space-y-3">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
      <p className="text-xs font-semibold text-ink-soft">
        Redirecting to dynamic hiring stage pipeline...
      </p>
    </div>
  );
}
