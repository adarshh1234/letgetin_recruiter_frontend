"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifiedResumesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/recruiter/verified-resumes");
  }, [router]);

  return null;
}
