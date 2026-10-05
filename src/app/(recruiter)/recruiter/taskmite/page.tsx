"use client";

import React from "react";
import { TaskmiteWorkspace } from "@/components/taskmite/TaskmiteWorkspace";

export default function TaskmitePage() {
  return (
    <TaskmiteWorkspace
      title="Taskmite Workspace & Productivity"
      subtitle="Sprint task delegation, backlog waiting list, time estimation, and team capacity planning."
      badgeLabel="Taskmite Productivity"
    />
  );
}
