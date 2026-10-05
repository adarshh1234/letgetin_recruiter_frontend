"use client";

import React, { useState } from "react";
import { BookOpenCheck, GraduationCap } from "lucide-react";
import { ComingSoon } from "@/components/common/ComingSoon";

type SkillEnhancementSection = "edupie" | "exams";

// Top navigation for the Skill Enhancement area, matching the same in-page tab bar pattern
// used by My Profile and My Jobs.
const SKILL_ENHANCEMENT_TABS: { id: SkillEnhancementSection; label: string; icon: typeof BookOpenCheck }[] = [
  { id: "edupie", label: "Edupie", icon: BookOpenCheck },
  { id: "exams", label: "Certification Exams", icon: GraduationCap },
];

export default function EdupyePage() {
  const [activeSection, setActiveSection] = useState<SkillEnhancementSection>("edupie");

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto space-y-6">
      {/* Top Header Navigation Tabs - Skill Enhancement */}
      <div className="bg-surface border border-border rounded-2xl p-2 shadow-xs flex items-center gap-1.5 overflow-x-auto no-scrollbar select-none">
        {SKILL_ENHANCEMENT_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-gradient-brand text-white shadow-elegant"
                  : "text-ink-soft hover:text-ink hover:bg-secondary/60"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-primary-glow"}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeSection === "edupie" && (
        <ComingSoon
          title="Edupye Learning Suite"
          description="Personalized AI learning paths and targeted course recommendations to close skill gaps identified on your resume."
          icon={BookOpenCheck}
        />
      )}

      {activeSection === "exams" && (
        <ComingSoon
          title="Certification Exams"
          description="Proctored skill certification tests to earn verified badges for your LetGetIn profile."
          icon={GraduationCap}
        />
      )}
    </div>
  );
}
