"use client";

import React from "react";
import { Landmark } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function AdmissionsPage() {
  return (
    <ComingSoon
      title="Admissions & Degree Programs"
      description="Connect directly with top universities and specialized higher education institutions worldwide."
      icon={Landmark}
      backHref="/skills"
      backLabel="Back to Skill Enhancement"
    />
  );
}
