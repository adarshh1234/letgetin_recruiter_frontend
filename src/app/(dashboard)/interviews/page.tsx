"use client";

import React from "react";
import { Mic } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function InterviewsPage() {
  return (
    <ComingSoon
      title="Interviews"
      description="AI & live video interview scheduling, candidate assessments, and automated scoring."
      icon={Mic}
    />
  );
}
