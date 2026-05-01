'use client';

import { useState, useEffect } from 'react';
import { fetchAPI } from '../lib/api';
import { getBackgroundConfig, saveBackgroundConfig, type BackgroundConfig } from '../lib/settings';

export function useDynamicBackground() {
  const [config, setConfig] = useState<BackgroundConfig>(getBackgroundConfig());
  const [index, setIndex] = useState(0);

  // Fix SSR hydration mismatch by re-reading localStorage after mount
  useEffect(() => {
    setConfig(getBackgroundConfig());
  }, []);

  // Sync with backend API and localStorage changes
  useEffect(() => {
    const fetchRemoteConfig = async () => {
      try {
        const res = await fetchAPI('/api/settings');
          if (res?.data?.app_appearance) {
          const remoteConfig = res.data.app_appearance;
          const currentLocal = getBackgroundConfig();
          
          // Helper to check if a value is effectively "set"
          const isSet = (val: any) => val !== undefined && val !== null && val !== '';

          const newConfig: BackgroundConfig = {
            ...currentLocal,
            ...remoteConfig,
            // Always use image background now since gradient feature is removed
            useImageBackground: true,
            backgroundImage: isSet(remoteConfig.backgroundImage) ? remoteConfig.backgroundImage : currentLocal.backgroundImage,
            titleStyle: remoteConfig.titleStyle ? { ...currentLocal.titleStyle, ...remoteConfig.titleStyle } : currentLocal.titleStyle,
            prizeStyle: remoteConfig.prizeStyle ? { ...currentLocal.prizeStyle, ...remoteConfig.prizeStyle } : currentLocal.prizeStyle,
          };
          
          // Only update if there's an actual change to avoid unnecessary re-renders
          if (JSON.stringify(newConfig) !== JSON.stringify(currentLocal)) {
            setConfig(newConfig);
            saveBackgroundConfig(newConfig);
          }
        }
      } catch (err) {
        console.error('Failed to fetch remote config, using local', err);
      }
    };

    fetchRemoteConfig();

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'undian_bg_config') {
        setConfig(getBackgroundConfig());
      }
    };
    window.addEventListener('storage', handleStorage);
    
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  useEffect(() => {
    if (config.gradients.length === 0) return;

    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % config.gradients.length);
    }, config.duration);

    return () => clearInterval(interval);
  }, [config.duration, config.gradients.length]);

  const currentGradient = config.gradients[index] || { from: '#e8192c', via: '#c01020', to: '#900a10' };

  return {
    ...currentGradient,
    useImageBackground: config.useImageBackground,
    backgroundImage: config.backgroundImage,
    customTitle: config.customTitle,
    titleStyle: config.titleStyle,
    prizeStyle: config.prizeStyle
  };
}
