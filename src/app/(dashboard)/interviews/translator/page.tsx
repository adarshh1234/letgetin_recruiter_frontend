"use client";

import React from "react";
import { Languages } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function ResumeTranslatorPage() {
  return (
    <ComingSoon
      title="Resume Translator"
      description="Translate and localize your resume into multiple languages with AI precision for global companies."
      icon={Languages}
    />
  );
}
