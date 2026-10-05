"use client";

import React from "react";
import { TaskmiteWorkspace } from "@/components/taskmite/TaskmiteWorkspace";

export default function CandidateTasksPage() {
  return (
    <TaskmiteWorkspace
      title="My Tasks & Career Action Planner"
      subtitle="Organize daily career tasks, resume improvements, and application follow-ups with intelligent tracking."
      badgeLabel="Personal Productivity"
    />
  );
}
