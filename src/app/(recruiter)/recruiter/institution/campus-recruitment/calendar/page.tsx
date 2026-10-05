"use client";

import React from "react";
import { CalendarWorkspace } from "@/components/calendar/CalendarWorkspace";

export default function CampusRecruitmentCalendarPage() {
  return (
    <CalendarWorkspace
      title="Campus Recruitment Drive Calendar"
      subtitle="Auditorium, test lab, and interview room booking schedule for visiting corporate recruiters"
      badgeLabel="Campus Placement Drives"
      defaultView="week"
      moduleContext="institution"
    />
  );
}
