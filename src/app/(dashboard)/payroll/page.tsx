"use client";

import React from "react";
import { Wallet } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function PayrollPage() {
  return (
    <ComingSoon
      title="Payroll"
      description="Salary structures, compensation packages, and payroll disbursement histories."
      icon={Wallet}
    />
  );
}
