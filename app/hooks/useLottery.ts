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
    error: null,
    currentDisplay: '✧ ✧ ✧',
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animationNamesRef = useRef<string[]>(['Mengacak...', 'Mencari Pemenang...', 'Memutar...']);

  const startDraw = useCallback(async () => {
    setState(prev => ({ ...prev, isRolling: true, isLoading: true, error: null }));

    intervalRef.current = setInterval(() => {
      const names = animationNamesRef.current;
      const randomName = names[Math.floor(Math.random() * names.length)];
      setState(prev => ({ ...prev, currentDisplay: randomName }));
    }, 100);

    try {
      const result = await drawLottery();
      setState(prev => ({ ...prev, isLoading: false }));

      await new Promise(resolve => setTimeout(resolve, 3000));

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
        currentDisplay: '✧ ✧ ✧',
      }));
    }
  }, []);

  const reset = useCallback(() => {
    setState({
      isRolling: false,
      isLoading: false,
      winner: null,
      prize: null,
      error: null,
      currentDisplay: '✧ ✧ ✧',
    });
  }, []);

  // Cleanup on unmount and listen to remote triggers
  useEffect(() => {
    // Fetch real names for the rolling animation
    const fetchNames = async () => {
      try {
        const res = await fetchAPI('/api/participants?per_page=100');
        if (res?.data && res.data.length > 0) {
          animationNamesRef.current = res.data.map((p: any) => p.name);
        }
      } catch (e) {
        console.error('Failed to fetch names for animation', e);
      }
    };
    fetchNames();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'REMOTE_DRAW_TRIGGER' && e.newValue) {
        // Trigger draw when Admin clicks the button in another tab
        if (!state.isRolling) {
          startDraw();
        }
      }
    };
    
    window.addEventListener('storage', handleStorage);
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      window.removeEventListener('storage', handleStorage);
    };
  }, [startDraw, state.isRolling]);

  return { ...state, startDraw, reset };
}
