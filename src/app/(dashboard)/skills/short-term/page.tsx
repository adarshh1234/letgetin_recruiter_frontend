"use client";

import React from "react";
import { GraduationCap } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function ShortTermCoursesPage() {
  return (
    <ComingSoon
      title="Short Term Courses"
      description="Fast-track intensive bootcamps, masterclasses, and hands-on project micro-credentials."
      icon={GraduationCap}
      backHref="/skills"
      backLabel="Back to Skill Enhancement"
    />
  );
}
