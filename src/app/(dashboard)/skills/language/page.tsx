"use client";

import React from "react";
import { Languages } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function LanguagePlusPage() {
  return (
    <ComingSoon
      title="Language+"
      description="Professional communication mastery, business English, and multi-lingual corporate language certifications."
      icon={Languages}
      backHref="/skills"
      backLabel="Back to Skill Enhancement"
    />
  );
}
