"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useRecruiterStore } from "@/features/recruiter/store/useRecruiterStore";

export default function RecruiterIndexPage() {
  const router = useRouter();
  const { loadOrgProfile } = useRecruiterStore();

  useEffect(() => {
    loadOrgProfile()
      .then((profile) => {
        router.replace(profile ? "/recruiter/dashboard" : "/recruiter/setup");
      })
      .catch(() => {
        router.replace("/recruiter/setup");
      });
  }, [loadOrgProfile, router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-ink-soft">
      <Loader2 className="w-8 h-8 animate-spin text-primary-glow mb-4" />
      <p className="text-sm font-medium">Loading your recruiter workspace...</p>
    </div>
  );
}
