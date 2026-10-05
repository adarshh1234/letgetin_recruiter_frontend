"use client";

import React from "react";
import { IdCard } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function EmployeeDetailsPage() {
  return (
    <ComingSoon
      title="Employee Details"
      description="Workforce organization directory, talent records, and verified professional profiles."
      icon={IdCard}
    />
  );
}
