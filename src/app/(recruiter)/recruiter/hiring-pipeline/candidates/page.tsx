"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function HiringCandidatesRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const stageId = searchParams.get("stageId");

  useEffect(() => {
    let target = `/recruiter/jobs?tab=candidates`;
    if (jobId) target += `&jobId=${jobId}`;
    if (stageId) target += `&stageId=${stageId}`;
    router.replace(target);
  }, [jobId, stageId, router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}
