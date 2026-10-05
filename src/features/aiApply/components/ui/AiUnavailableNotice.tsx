'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

export function AiUnavailableNotice() {
  return (
    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
      <span>AI suggestions are temporarily unavailable. You can continue manually.</span>
    </div>
  );
}
