"use client";

import React from "react";
import { BarChart3 } from "lucide-react";
import { ComingSoonPage } from "@/components/recruiter/ComingSoonPage";

export default function AIAnalyticsPage() {
  return (
    <ComingSoonPage
      section="Workforce"
      title="AI Analytics"
      description="Deep predictive workforce intelligence and talent pipeline analytics powered by AI to measure hiring velocity, sourcing efficiency, and retention trends."
      icon={BarChart3}
      highlights={[
        "Real-time pipeline velocity tracking from sourcing to offer acceptance",
        "AI predictive modeling on candidate attrition risk and retention likelihood",
        "Talent acquisition cost analysis and channel ROI breakdown",
        "Diversity, equity, and inclusion (DEI) benchmarking statistics",
      ]}
    />
  );
}
