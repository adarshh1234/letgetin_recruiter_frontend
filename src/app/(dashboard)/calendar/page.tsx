"use client";

import React from "react";
import { CalendarWorkspace } from "@/components/calendar/CalendarWorkspace";

export default function CandidateCalendarPage() {
  return (
    <CalendarWorkspace
      title="My Calendar & Schedule Planner"
      subtitle="Organize interview schedules, assessment deadlines, and professional networking events in one fluid timeline."
      badgeLabel="Personal Calendar"
      defaultView="week"
    />
  );
}
