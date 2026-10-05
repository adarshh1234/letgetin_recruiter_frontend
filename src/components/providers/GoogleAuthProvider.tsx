"use client";

import React from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";

const rawClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const hasValidClientId = Boolean(
  rawClientId &&
  !rawClientId.includes("placeholder") &&
  rawClientId.trim().length > 10
);

export function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
  if (!hasValidClientId) {
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={rawClientId!}>
      {children}
    </GoogleOAuthProvider>
  );
}
