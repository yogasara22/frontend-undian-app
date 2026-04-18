'use client';

import { getAppMode } from '../lib/api';

export function ModeIndicator() {
  const mode = getAppMode();
  const isDemo = mode === 'demo';

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-widest ${
        isDemo
          ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
          : 'bg-green-500/20 text-green-400 border border-green-500/30'
      }`}
    >
      <span
        className={`w-2 h-2 rounded-full animate-pulse ${isDemo ? 'bg-yellow-400' : 'bg-green-400'}`}
      />
      {isDemo ? 'DEMO MODE' : 'LIVE MODE'}
    </div>
  );
}
