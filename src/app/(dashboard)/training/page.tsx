"use client";

import React from "react";
import { GraduationCap } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function TrainingPage() {
  return (
    <ComingSoon
      title="Training & Onboarding"
      description="Workforce training modules, onboarding tracks, and employee talent development."
      icon={GraduationCap}
    />
  );
}
