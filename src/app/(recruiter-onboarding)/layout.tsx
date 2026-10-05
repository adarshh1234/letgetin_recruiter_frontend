"use client";

import React from "react";
import { RecruiterGuard } from "@/components/auth/RecruiterGuard";

export default function RecruiterOnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RecruiterGuard>{children}</RecruiterGuard>;
}
