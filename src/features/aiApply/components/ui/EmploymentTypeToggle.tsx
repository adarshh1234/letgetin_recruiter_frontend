'use client';

import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { EmploymentTypePref } from '../../types';

const OPTIONS: { value: EmploymentTypePref; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract-freelance', label: 'Contract/Freelance' },
];

interface EmploymentTypeToggleProps {
  value?: EmploymentTypePref;
  onChange: (value: EmploymentTypePref) => void;
}

export function EmploymentTypeToggle({ value, onChange }: EmploymentTypeToggleProps) {
  return (
    <ToggleGroup
      variant="outline"
      value={value ? [value] : []}
      onValueChange={(next) => {
        if (next.length > 0) onChange(next[0] as EmploymentTypePref);
      }}
      className="flex-wrap"
    >
      {OPTIONS.map((opt) => (
        <ToggleGroupItem key={opt.value} value={opt.value} className="text-xs font-semibold px-3.5">
          {opt.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
