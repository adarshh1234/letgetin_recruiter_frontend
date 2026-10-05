"use client";

import React from "react";
import { BrainCircuit } from "lucide-react";
import { ComingSoonPage } from "@/components/recruiter/ComingSoonPage";

export default function PsychometricTestPage() {
  return (
    <ComingSoonPage
      section="Career Guidance"
      title="Psychometric Test"
      description="Scientifically validated psychological personality, workplace behavior, cultural alignment, and emotional intelligence evaluations."
      icon={BrainCircuit}
      highlights={[
        "Big Five (OCEAN) and DISC behavioral alignment profiling",
        "Situational judgment tests assessing leadership, resilience, and teamwork",
        "Visual psychometric breakdown charts generated automatically per candidate",
        "Benchmark matches against top-performing internal company cohorts",
      ]}
    />
  );
}
