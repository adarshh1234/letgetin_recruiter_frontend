import React from "react";

export function Stats() {
  const stats = [
    ["120K+", "Verified Professionals"],
    ["8.2K", "Companies Hiring"],
    ["96%", "Match Accuracy"],
    ["150+", "Countries"],
  ];
  return (
    <section className="py-12 px-4 sm:px-6 border-t border-border bg-surface/60">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {stats.map(([num, label]) => (
          <div key={label} className="text-center">
            <div className="text-3xl md:text-4xl font-extrabold text-gradient-brand">
              {num}
            </div>
            <div className="text-sm text-ink-soft font-medium mt-1">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Stats;
