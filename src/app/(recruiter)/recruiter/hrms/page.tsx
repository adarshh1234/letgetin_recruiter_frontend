"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import { ComingSoonPage } from "@/components/recruiter/ComingSoonPage";

export default function HRMSPage() {
  return (
    <ComingSoonPage
      section="Enterprise Management"
      title="HRMS"
      description="All-in-one Human Resource Management System for onboarding, employee records, document management, time-off requests, and compliance tracking."
      icon={ShieldCheck}
      highlights={[
        "Digital employee onboarding and self-service document verification",
        "Leave management, holiday calendars, and PTO approval workflows",
        "Centralized employee record repository with SOC-2 compliant encryption",
        "Role-based hierarchy permissions for managers and department leads",
      ]}
    />
  );
}
