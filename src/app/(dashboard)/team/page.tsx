"use client";

import React from "react";
import { Users } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function TeamPage() {
  return (
    <ComingSoon
      title="My Team"
      description="Collaborate seamlessly with team members, share talent profiles, and coordinate candidate recommendations."
      icon={Users}
    />
  );
}
