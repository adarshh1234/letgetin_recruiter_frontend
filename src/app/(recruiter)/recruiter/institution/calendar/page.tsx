"use client";

import React from "react";
import { CalendarWorkspace } from "@/components/calendar/CalendarWorkspace";

export default function InstitutionCalendarPage() {
  return (
    <CalendarWorkspace
      title="Institution Academic & Placement Calendar"
      subtitle="Placement drives, written aptitude assessments, and faculty interview panel schedules"
      badgeLabel="Institution Calendar"
      defaultView="week"
      moduleContext="institution"
    />
  );
}
