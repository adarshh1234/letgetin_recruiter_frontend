"use client";

import React from "react";
import { Video } from "lucide-react";
import { ComingSoonPage } from "@/components/recruiter/ComingSoonPage";

export default function VideoInterviewPage() {
  return (
    <ComingSoonPage
      section="Interview Suite"
      title="HD Video Interview Studio"
      description="Integrated browser-based video meeting rooms built directly into your recruitment pipeline with cloud recordings, collaborative coding sandboxes, and interactive system design whiteboards."
      icon={Video}
      highlights={[
        "Zero-download browser video calls for candidates, recruiters, and panel interviewers",
        "Built-in collaborative code editor supporting TypeScript, Python, and Java",
        "Interactive system design whiteboard with real-time architectural diagramming",
        "Encrypted cloud recording with instant AI playback and timestamped competency bookmarks",
        "One-click invite links with automated microphone, camera, and network latency checks",
      ]}
      eta="Coming in Q4 Release"
    />
  );
}
