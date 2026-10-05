import type { Metadata } from "next";
import AuthPage from "@/components/auth/AuthPage";

export const metadata: Metadata = {
  title: "Join LetGetIn — Create your verified profile",
  description:
    "Create your LetGetIn account. Continue with Google or verify via email / WhatsApp OTP to unlock your verified professional identity.",
  openGraph: {
    title: "Join LetGetIn — Create your verified profile",
    description: "Verified professional identity. Get in — it's free.",
  },
};

export default function Page() {
  return <AuthPage />;
}
