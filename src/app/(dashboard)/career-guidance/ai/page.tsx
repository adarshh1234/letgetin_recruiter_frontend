"use client";

import React from "react";
import { Bot } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function CareerGuidanceAIPage() {
  return (
    <ComingSoon
      title="AI Career Guidance"
      description="24/7 intelligent career counseling, personalized roadmaps, and instant skill gap analysis."
      icon={Bot}
      backHref="/career-guidance"
      backLabel="Back to Career Guidance"
    />
  );
}
