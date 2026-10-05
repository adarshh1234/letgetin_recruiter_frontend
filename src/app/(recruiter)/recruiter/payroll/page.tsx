"use client";

import { Wallet } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function PayrollPage() {
  return (
    <ComingSoon
      title="Payroll"
      description="Run payroll, manage compensation, and generate payslips for your team."
      icon={Wallet}
      badge="Workforce Suite · Coming Soon"
      backHref="/recruiter/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}
