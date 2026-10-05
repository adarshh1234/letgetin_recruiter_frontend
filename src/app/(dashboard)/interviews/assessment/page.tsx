"use client";

import React from "react";
import { ClipboardCheck } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function AIAssessmentPage() {
  return (
    <ComingSoon
      title="AI Assessment"
      description="Automated AI-driven evaluations and technical assessments for target roles."
      icon={ClipboardCheck}
    />
  );
}
