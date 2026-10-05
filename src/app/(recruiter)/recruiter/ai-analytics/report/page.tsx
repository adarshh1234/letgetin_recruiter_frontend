"use client";

import React from "react";
import { BarChart3 } from "lucide-react";
import { ComingSoonPage } from "@/components/recruiter/ComingSoonPage";

export default function AIAnalyticsReportPage() {
  return (
    <ComingSoonPage
      section="Workforce"
      title="Workforce Reports"
      description="Automated executive reports, hiring board slide generation, department KPIs, and compliance audit exports in PDF, Excel, and CSV formats."
      icon={BarChart3}
      highlights={[
        "One-click executive board summary reports generated with AI narratives",
        "Scheduled weekly & monthly email report digests for department leadership",
        "Exportable raw data sets in CSV, Excel, and formatted PDF presentation slides",
        "Customizable KPI scorecards for department hiring targets vs achievements",
      ]}
    />
  );
}
