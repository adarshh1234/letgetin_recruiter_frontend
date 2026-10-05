import React from "react";

export interface SectionHeaderProps {
  eyebrow: string;
  children: React.ReactNode;
  desc?: React.ReactNode;
}

export function SectionHeader({
  eyebrow,
  children,
  desc,
}: SectionHeaderProps) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary-glow bg-primary/5 px-3 py-1 rounded-full border border-primary/10">
        {eyebrow}
      </span>
      <h2 className="text-3xl md:text-4xl font-extrabold text-ink mt-4 leading-tight">
        {children}
      </h2>
      {desc && <p className="text-lg text-ink-soft mt-4 leading-relaxed">{desc}</p>}
    </div>
  );
}

export default SectionHeader;
