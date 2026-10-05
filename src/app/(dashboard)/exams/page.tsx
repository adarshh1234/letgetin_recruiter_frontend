"use client";

import React from "react";
import { GraduationCap } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function ExamsPage() {
  return (
    <ComingSoon
      title="Certification Exams"
      description="Proctored skill certification tests to earn verified badges for your LetGetIn profile."
      icon={GraduationCap}
    />
  );
}
