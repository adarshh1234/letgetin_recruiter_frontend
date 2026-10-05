"use client";

import React from "react";
import { Compass } from "lucide-react";
import { ComingSoonPage } from "@/components/recruiter/ComingSoonPage";

export default function CareerCounsellingPage() {
  return (
    <ComingSoonPage
      section="Career Guidance"
      title="Career Counselling"
      description="Personalized career trajectory planning and skill gap navigation connecting candidates and employees to mentorship, coaching, and growth pathways."
      icon={Compass}
      highlights={[
        "Autonomous AI career advisor tailored to candidate CVs and aspirations",
        "1-on-1 personal counselling session booking with industry mentors",
        "Structured career ladder mapping for organizational employee retention",
        "Actionable skill enhancement and certification recommendations",
      ]}
    />
  );
}
