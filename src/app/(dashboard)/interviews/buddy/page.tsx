"use client";

import React from "react";
import { Users } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function InterviewBuddyPage() {
  return (
    <ComingSoon
      title="Interview Buddy"
      description="Connect and match with peers in your industry domain for collaborative mock interview sessions."
      icon={Users}
    />
  );
}
