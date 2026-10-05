"use client";

import React from "react";
import { MessageSquare } from "lucide-react";
import { ComingSoonPage } from "@/components/recruiter/ComingSoonPage";

export default function CandidateChatPage() {
  return (
    <ComingSoonPage
      section="Hiring Suite"
      title="Candidate Chat"
      description="Direct real-time conversational messaging between recruiters and candidates with instant notifications, scheduled reminders, and automated screening triggers."
      icon={MessageSquare}
      highlights={[
        "Real-time instant messaging with active job applicants",
        "Direct calendar scheduling link embeds within conversations",
        "AI response drafting and quick screening question templates",
        "Automatic chat transcripts synced to candidate profile dossiers",
      ]}
    />
  );
}
