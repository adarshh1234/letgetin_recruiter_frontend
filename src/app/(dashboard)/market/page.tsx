"use client";

import React from "react";
import { Store } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

export default function MarketPage() {
  return (
    <ComingSoon
      title="App Market"
      description="Discover and integrate third-party career tools, portfolio extensions, and recruiter integrations with your LetGetIn workspace."
      icon={Store}
    />
  );
}
