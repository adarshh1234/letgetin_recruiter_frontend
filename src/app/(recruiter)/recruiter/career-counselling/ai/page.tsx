"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { ComingSoonPage } from "@/components/recruiter/ComingSoonPage";

export default function AICareerCounsellingPage() {
  return (
    <ComingSoonPage
      section="Career Guidance"
      title="AI Career Counselling"
      description="24/7 intelligent AI career coach providing personalized career path modeling, market salary benchmarks, and interview readiness recommendations."
      icon={Sparkles}
      highlights={[
        "Instant resume gap analysis and career transition roadmaps",
        "Salary benchmarks and compensation growth forecasts",
        "Personalized technical and soft skill development milestones",
        "Direct matching with relevant recruiter job openings",
      ]}
    />
  );
}
