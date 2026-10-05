"use client";

import React from "react";
import { TrendingUp } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function PerformancePage() {
  return (
    <ComingSoon
      title="Performance"
      description="Performance appraisals, quarterly goals, KPI tracking, and peer reviews."
      icon={TrendingUp}
    />
  );
}
