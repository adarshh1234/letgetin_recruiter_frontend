"use client";

import { Award } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function PromotionsPage() {
  return (
    <ComingSoon
      title="Promotions"
      description="Plan and manage promotion cycles for your growing team."
      icon={Award}
      badge="Workforce Suite · Coming Soon"
      backHref="/recruiter/dashboard"
      backLabel="Back to Dashboard"
    />
  );
}
