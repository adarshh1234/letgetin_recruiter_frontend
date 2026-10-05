"use client";

import { IdCard } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function EmployeeDetailsPage() {
  return (
    <ComingSoon
      title="Employee Details"
      description="Manage employee records, documents, and organizational details in one place."
      icon={IdCard}
      badge="Workforce Suite · Coming Soon"
      backHref="/recruiter/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}
