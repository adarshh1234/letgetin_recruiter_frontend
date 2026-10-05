"use client";

import React from "react";
import { CalendarWorkspace } from "@/components/calendar/CalendarWorkspace";

export default function WorkforceCalendarPage() {
  return (
    <CalendarWorkspace
      title="Workforce Calendar & Day Planner"
      subtitle="Unified daily & weekly schedules, corporate events, and team capacity tracking."
      badgeLabel="Workforce Calendar"
      defaultView="week"
    />
  );
}
