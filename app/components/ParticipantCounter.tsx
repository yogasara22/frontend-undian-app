'use client';

import { useState, useEffect } from 'react';
import { fetchAPI } from '../lib/api';

export function ParticipantCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetchAPI('/api/dashboard/stats');
        if (res?.data) {
          setCount(res.data.remainingParticipants ?? res.data.totalParticipants ?? 0);
        }
      } catch (err) {
        console.error('Error fetching participant count:', err);
      }
    };

    fetchStats();
    
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'REMOTE_DRAW_SUCCESS' && e.newValue) {
        fetchStats();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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
