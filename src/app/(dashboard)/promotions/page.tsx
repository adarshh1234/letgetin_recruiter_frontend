"use client";

import React from "react";
import { Award } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function PromotionsPage() {
  return (
    <ComingSoon
      title="Promotions"
      description="Career progression ladders, internal mobility tracks, and promotion recommendations."
      icon={Award}
    />
  );
}
