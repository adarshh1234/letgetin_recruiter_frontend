"use client";

import React from "react";
import { UserCheck } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function CareerGuidancePersonalPage() {
  return (
    <ComingSoon
      title="Personal Career Mentoring"
      description="Book 1-on-1 counseling, resume reviews, and portfolio feedback with verified industry coaches."
      icon={UserCheck}
      backHref="/career-guidance"
      backLabel="Back to Career Guidance"
    />
  );
}
