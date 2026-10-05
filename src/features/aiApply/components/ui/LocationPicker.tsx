'use client';

import React from 'react';

const COUNTRIES = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'Singapore', 'UAE'];

interface LocationPickerProps {
  country: string;
  state: string;
  location: string;
  onChangeCountry: (v: string) => void;
  onChangeState: (v: string) => void;
  onChangeLocation: (v: string) => void;
}

export function LocationPicker({
  country,
  state,
  location,
  onChangeCountry,
  onChangeState,
  onChangeLocation,
}: LocationPickerProps) {
  const countryOptions = country && !COUNTRIES.includes(country) ? [country, ...COUNTRIES] : COUNTRIES;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
      <select
        value={country}
        onChange={(e) => onChangeCountry(e.target.value)}
        className="input-base text-xs py-2 px-3 bg-surface text-ink font-medium"
      >
        <option value="" disabled>
          Country
        </option>
        {countryOptions.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={state}
        onChange={(e) => onChangeState(e.target.value)}
        placeholder="State"
        className="input-base text-xs px-3 py-2 bg-surface text-ink"
      />
      <input
        type="text"
        value={location}
        onChange={(e) => onChangeLocation(e.target.value)}
        placeholder="City / Location"
        className="input-base text-xs px-3 py-2 bg-surface text-ink"
      />
    </div>
  );
}
