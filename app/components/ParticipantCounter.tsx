'use client';

import { dummyParticipants } from '../lib/dummy';

export function ParticipantCounter() {
  const count = dummyParticipants.length;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center bg-white text-orange-600 min-w-[3rem] px-3 py-1.5 rounded-xl border border-white shadow-md">
        <span className="font-black text-xl md:text-2xl">{count}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-white/90 text-[10px] md:text-[11px] font-extrabold uppercase tracking-[0.2em] leading-tight">Total</span>
        <span className="text-white text-sm md:text-base font-black uppercase tracking-wide leading-tight drop-shadow-md text-stroke-thin">Peserta Aktif</span>
      </div>
    </div>
  );
}
