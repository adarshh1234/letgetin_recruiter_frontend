"use client";

import React from "react";
import { Compass } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function MyDivePage() {
  return (
    <ComingSoon
      title="My Dive Analytics"
      description="Deep-dive career analytics, salary benchmarks, and market demand insights tailored to your resume stack."
      icon={Compass}
    />
  );
}
