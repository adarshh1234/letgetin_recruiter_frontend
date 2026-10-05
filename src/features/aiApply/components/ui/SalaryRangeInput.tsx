'use client';

import React from 'react';
import { Slider } from '@/components/ui/slider';

interface SalaryRangeInputProps {
  min: number | undefined;
  max: number | undefined;
  currency: string;
  onChange: (min: number, max: number) => void;
  onCurrencyChange: (currency: string) => void;
  bounds?: [number, number];
}

const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP'];

export function SalaryRangeInput({
  min,
  max,
  currency,
  onChange,
  onCurrencyChange,
  bounds = [0, 5000000],
}: SalaryRangeInputProps) {
  const values: [number, number] = [min ?? bounds[0], max ?? bounds[1]];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <select
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value)}
          className="input-base text-xs py-2 px-2.5 bg-surface text-ink font-semibold w-20"
        >
          {CURRENCIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={min ?? ''}
          onChange={(e) => onChange(Number(e.target.value) || 0, values[1])}
          placeholder="Min"
          className="input-base text-xs px-3 py-2 bg-surface text-ink flex-1"
        />
        <span className="text-ink-soft text-xs">to</span>
        <input
          type="number"
          value={max ?? ''}
          onChange={(e) => onChange(values[0], Number(e.target.value) || 0)}
          placeholder="Max"
          className="input-base text-xs px-3 py-2 bg-surface text-ink flex-1"
        />
      </div>
      <Slider
        min={bounds[0]}
        max={bounds[1]}
        step={10000}
        value={values}
        onValueChange={(next) => {
          if (Array.isArray(next) && next.length === 2) {
            onChange(next[0], next[1]);
          }
        }}
        className="py-1"
      />
    </div>
  );
}
