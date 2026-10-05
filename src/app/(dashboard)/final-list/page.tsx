"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function FinalListPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/applications");
  }, [router]);

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
      <p className="text-xs text-ink-soft">Redirecting to your applications and tracking timeline...</p>
    </div>
  );
}

