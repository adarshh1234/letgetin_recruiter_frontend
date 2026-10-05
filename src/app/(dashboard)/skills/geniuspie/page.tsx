"use client";

import React from "react";
import { Brain } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function GeniusPiePage() {
  return (
    <ComingSoon
      title="Geniuspie.com"
      description="Advanced cognitive analytics, psychometric talent benchmarking, and competitive learning gamification."
      icon={Brain}
      backHref="/skills"
      backLabel="Back to Skill Enhancement"
    />
  );
}
