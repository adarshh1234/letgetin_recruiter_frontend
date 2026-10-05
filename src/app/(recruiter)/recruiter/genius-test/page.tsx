"use client";

import React from "react";
import { Lightbulb } from "lucide-react";
import { ComingSoonPage } from "@/components/recruiter/ComingSoonPage";

export default function GeniusTestPage() {
  return (
    <ComingSoonPage
      section="Career Guidance"
      title="Genius Test"
      description="Advanced cognitive horsepower, numerical reasoning, logical puzzle solving, and rapid algorithmic thinking assessments."
      icon={Lightbulb}
      highlights={[
        "Cognitive ability and rapid problem solving aptitude tests",
        "Spatial, abstract pattern recognition, and numerical deduction modules",
        "Standardized percentile score calibrated across top engineering talent",
        "Anti-cheating screen monitoring and randomized question banks",
      ]}
    />
  );
}
