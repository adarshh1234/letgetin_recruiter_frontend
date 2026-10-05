"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function MyTwinPage() {
  return (
    <ComingSoon
      title="My Twin"
      description="Your personal AI career twin that represents you, learns your preferences, and works on your behalf."
      icon={Sparkles}
    />
  );
}
