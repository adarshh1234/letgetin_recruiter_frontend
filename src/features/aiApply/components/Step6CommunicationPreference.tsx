'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useAiApplyStore } from '../store/useAiApplyStore';
import { ContactChannel, ContactTiming } from '../types';

const CHANNELS: { value: ContactChannel; label: string }[] = [
  { value: 'email', label: 'Email' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'inbox', label: 'Inbox' },
  { value: 'linkedin', label: 'LinkedIn' },
];

const TIMINGS: { value: ContactTiming; label: string }[] = [
  { value: 'morning', label: 'Morning — 9 AM to 12 PM' },
  { value: 'noon', label: 'Noon — 12 PM to 3 PM' },
  { value: 'evening', label: 'Evening — 3 PM to 7 PM' },
  { value: 'night', label: 'Night — 7 PM to 9 PM' },
];

export function Step6CommunicationPreference() {
  const preferences = useAiApplyStore((s) => s.preferences);
  const setField = useAiApplyStore((s) => s.setField);

  const toggleChannel = (channel: ContactChannel) => {
    const has = preferences.contactChannels.includes(channel);
    setField(
      'contactChannels',
      has ? preferences.contactChannels.filter((c) => c !== channel) : [...preferences.contactChannels, channel]
    );
  };

  return (
    <div className="space-y-7">
      <h2 className="text-lg font-bold text-ink">Communication Preference</h2>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-ink">How should employers reach you?</label>
        <div className="grid grid-cols-2 gap-2">
          {CHANNELS.map((c) => {
            const isSelected = preferences.contactChannels.includes(c.value);
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => toggleChannel(c.value)}
                className={`flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition cursor-pointer ${
                  isSelected
                    ? 'bg-primary/10 border-primary-glow text-ink ring-2 ring-primary-glow/30'
                    : 'bg-surface border-border text-ink-soft hover:border-primary-glow/40'
                }`}
              >
                <span>{c.label}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-ink">Preferred timing</label>
        <div className="space-y-1.5">
          {TIMINGS.map((t) => {
            const isSelected = preferences.contactTiming === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setField('contactTiming', t.value)}
                className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition cursor-pointer ${
                  isSelected
                    ? 'bg-primary/10 border-primary-glow text-ink ring-2 ring-primary-glow/30'
                    : 'bg-surface border-border text-ink-soft hover:border-primary-glow/40'
                }`}
              >
                <span>{t.label}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-primary" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
