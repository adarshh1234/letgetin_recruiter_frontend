import React from "react";
import SectionHeader from "./SectionHeader";

export function Dimensions() {
  const items = [
    ["Educational Foundations", "Consistency + Specialization. Tier 1 reputation matters, but so does relevancy."],
    ["Verified Skill Sets", "Technical proficiency, certifications, and domain expertise — proven, not claimed."],
    ["Performance History", "Promotion velocity + quantifiable ROI. STAR results beat years of tenure."],
    ["Psychometric & Cognitive", "Aptitude, SJT, personality (DISC/Big Five), and EQ — raw ability minus bias."],
    ["Communication & Language", "Professional fluency, cross-cultural agility, and public speaking."],
    ["Soft Power & Adaptability", "Learnability (AQ), critical thinking, collaboration, and digital literacy."],
  ];
  return (
    <section id="dimensions" className="py-20 md:py-28 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          eyebrow="Modern Hiring"
          desc="How forward-thinking companies evaluate candidates in 2026."
        >
          The <span className="text-gradient-brand">6 Dimensions</span> of Talent
        </SectionHeader>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map(([title, desc], i) => (
            <div
              key={title}
              className="bg-surface rounded-xl p-6 border border-border card-hover"
            >
              <div className="text-sm font-semibold text-primary-glow mb-1">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h4 className="font-bold text-ink text-lg">{title}</h4>
              <p className="text-sm text-ink-soft mt-1 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 bg-surface-alt rounded-2xl p-6 border border-border max-w-3xl mx-auto text-center">
          <p className="text-sm text-ink-soft">
            <span className="font-semibold text-ink">Expert Insight:</span> In 2026, the most
            valued parameter is{" "}
            <span className="font-bold text-primary-glow">"Verified Proof of Work."</span>{" "}
            Companies are moving away from trusting CVs toward audited portfolios and AI-vetted
            live assessments.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Dimensions;
