'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { LotteryState } from '../types';
import { drawLottery, fetchAPI } from '../lib/api';

export function useLottery() {
  const [state, setState] = useState<LotteryState>({
    isRolling: false,
    isLoading: false,
    winner: null,
    prize: null,
    activePrize: null,
    error: null,
    currentDisplay: '—',
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animationNamesRef = useRef<string[]>(['Peserta 1', 'Peserta 2', 'Peserta 3']);
  // Ref to track isRolling without causing stale closure in event handlers
  const isRollingRef = useRef(false);

  // Keep isRollingRef in sync with state
  useEffect(() => {
    isRollingRef.current = state.isRolling;
  }, [state.isRolling]);

  const startDraw = useCallback(async (prizeId?: number | null) => {
    // Immediately show first name from the list
    const names = animationNamesRef.current;
    if (names.length > 0) {
      setState(prev => ({ ...prev, isRolling: true, isLoading: true, error: null, currentDisplay: names[0] }));
    } else {
      setState(prev => ({ ...prev, isRolling: true, isLoading: true, error: null }));
    }

    // Clear any existing interval before starting a new one
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const currentNames = animationNamesRef.current;
      if (currentNames.length > 0) {
        const randomName = currentNames[Math.floor(Math.random() * currentNames.length)];
        setState(prev => ({ ...prev, currentDisplay: randomName }));
      }
    }, 100);

    try {
      const result = await drawLottery(prizeId);
      setState(prev => ({ ...prev, isLoading: false }));

      await new Promise(resolve => setTimeout(resolve, 5000));

      if (intervalRef.current) clearInterval(intervalRef.current);
      setState(prev => ({
        ...prev,
        isRolling: false,
        winner: result.winner,
        prize: result.prize,
        currentDisplay: result.winner.name,
      }));
      
      // Play premium doorprize sound
      if (typeof window !== 'undefined') {
        try {
          const audio = new Audio('/doorprize.mp3');
          audio.play().catch(e => console.log('Audio playback prevented by browser:', e));
        } catch (e) {
          console.error('Audio playback error', e);
        }
      }
      
      // Notify admin dashboard that draw is complete
      localStorage.setItem('REMOTE_DRAW_SUCCESS', Date.now().toString());
    } catch (err) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setState(prev => ({
        ...prev,
        isRolling: false,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Terjadi kesalahan tidak diketahui',
        currentDisplay: '—',
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState(prev => ({
      isRolling: false,
      isLoading: false,
      winner: null,
      prize: null,
      activePrize: prev.activePrize, // Keep active prize if still selected
      error: null,
      currentDisplay: '—',
    }));
  }, []);

  // Fetch participant names and listen to remote draw triggers.
  // NOTE: state.isRolling is intentionally NOT in the dependency array — putting it
  // there caused the cleanup to fire clearInterval every time rolling started,
  // which immediately killed the animation interval. We use isRollingRef instead.
  useEffect(() => {
    const fetchNames = async () => {
      try {
        const res = await fetchAPI('/api/participants?per_page=200');
        const participants = res?.data || res || [];
        if (Array.isArray(participants) && participants.length > 0) {
          const names = participants
            .map((p: any) => p.name || p.participant_name || p.full_name || p.nama)
            .filter((n: string) => n && n.trim().length > 0);
          if (names.length > 0) {
            animationNamesRef.current = names;
            console.log(`Loaded ${names.length} participant names for animation`);
          }
        }
      } catch (e) {
        console.error('Failed to fetch names for animation', e);
      }
    };
    fetchNames();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'REMOTE_DRAW_TRIGGER' && e.newValue) {
        // Use isRollingRef instead of state to avoid stale closure
        if (!isRollingRef.current) {
          try {
            const data = JSON.parse(e.newValue);
            if (data.prizeId) {
               startDraw(data.prizeId);
            } else {
               startDraw();
            }
          } catch {
            startDraw(); // Fallback for old trigger format
          }
        }
      } else if (e.key === 'ACTIVE_PRIZE_TRIGGER' && e.newValue) {
        try {
          const data = JSON.parse(e.newValue);
          setState(prev => ({ ...prev, activePrize: data.prize || null }));
        } catch {
          setState(prev => ({ ...prev, activePrize: null }));
        }
      }
    };
    
    window.addEventListener('storage', handleStorage);
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener('storage', handleStorage);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDraw]); // state.isRolling intentionally omitted — see comment above

  return { ...state, startDraw, reset };
}
