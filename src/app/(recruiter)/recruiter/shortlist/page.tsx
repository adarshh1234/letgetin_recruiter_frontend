"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ShortlistRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");

  useEffect(() => {
    const target = jobId
      ? `/recruiter/hiring-pipeline/resume-screening?jobId=${jobId}`
      : `/recruiter/hiring-pipeline/resume-screening`;
    router.replace(target);
  }, [jobId, router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}
