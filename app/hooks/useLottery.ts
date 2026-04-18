'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import type { LotteryState } from '../types';
import { drawLottery } from '../lib/api';
import { dummyParticipants } from '../lib/dummy';

export function useLottery() {
  const [state, setState] = useState<LotteryState>({
    isRolling: false,
    isLoading: false,
    winner: null,
    prize: null,
    error: null,
    currentDisplay: '???',
  });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startDraw = useCallback(async () => {
    setState(prev => ({ ...prev, isRolling: true, isLoading: true, error: null }));

    intervalRef.current = setInterval(() => {
      const random = dummyParticipants[Math.floor(Math.random() * dummyParticipants.length)];
      setState(prev => ({ ...prev, currentDisplay: random.name }));
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
    } catch (err) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setState(prev => ({
        ...prev,
        isRolling: false,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Terjadi kesalahan tidak diketahui',
        currentDisplay: '???',
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
      currentDisplay: '???',
    });
  }, []);

  return { ...state, startDraw, reset };
}
