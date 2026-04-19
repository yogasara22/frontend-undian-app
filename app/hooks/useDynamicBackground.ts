'use client';

import { useState, useEffect } from 'react';
import { getBackgroundConfig, type BackgroundConfig } from '../lib/settings';

export function useDynamicBackground() {
  const [config, setConfig] = useState<BackgroundConfig>(getBackgroundConfig());
  const [index, setIndex] = useState(0);

  // Sync with localStorage changes (if open in another tab/window)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'undian_bg_config') {
        setConfig(getBackgroundConfig());
      }
    };
    window.addEventListener('storage', handleStorage);
    
    // Initial fetch to be sure
    setConfig(getBackgroundConfig());

    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (config.gradients.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % config.gradients.length);
    }, config.duration);

    return () => clearInterval(interval);
  }, [config.duration, config.gradients.length]);

  return config.gradients[index] || { from: '#e8192c', via: '#c01020', to: '#900a10' };
}
