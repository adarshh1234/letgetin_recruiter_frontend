"use client";

import React from "react";
import { Hourglass } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function ProbationPage() {
  return (
    <ComingSoon
      title="Probation"
      description="Probation timeline tracking, evaluation milestones, and confirmation assessments."
      icon={Hourglass}
    />
  );
}
