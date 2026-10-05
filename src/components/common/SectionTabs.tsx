"use client";

import React from "react";

export interface SectionTabOption<T extends string> {
  id: T;
  label: string;
}

interface SectionTabsProps<T extends string> {
  options: SectionTabOption<T>[];
  active: T;
  onChange: (id: T) => void;
}

export function SectionTabs<T extends string>({ options, active, onChange }: SectionTabsProps<T>) {
  return (
    <div className="flex items-center gap-5 border-b border-border">
      {options.map((option, index) => {
        const isActive = active === option.id;
        return (
          <React.Fragment key={option.id}>
            {index > 0 && <span className="text-border select-none">|</span>}
            <button
              type="button"
              onClick={() => onChange(option.id)}
              className={`pb-2.5 text-sm font-bold border-b-2 -mb-px transition-colors cursor-pointer ${
                isActive
                  ? "text-ink border-primary-glow"
                  : "text-ink-soft border-transparent hover:text-ink"
              }`}
            >
              {option.label}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
}
