'use client';

export interface GradientEntry {
  from: string;
  via: string;
  to: string;
}

export interface BackgroundConfig {
  duration: number; // in milliseconds
  gradients: GradientEntry[];
}

const DEFAULT_GRADIENTS: GradientEntry[] = [
  { from: '#e8192c', via: '#c01020', to: '#900a10' }, // Red
  { from: '#1a5bcc', via: '#154aa3', to: '#0d327a' }, // Blue
  { from: '#7c3aed', via: '#6d28d9', to: '#4c1d95' }, // Purple
  { from: '#0d9488', via: '#0f766e', to: '#134e4a' }, // Teal
  { from: '#4a3721', via: '#382a19', to: '#261c11' }, // Premium Brown
  { from: '#be123c', via: '#9f1239', to: '#881337' }, // Rose
];

const STORAGE_KEY = 'undian_bg_config';

export const getBackgroundConfig = (): BackgroundConfig => {
  if (typeof window === 'undefined') {
    return { duration: 60000, gradients: DEFAULT_GRADIENTS };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse background config', e);
    }
  }

  return { duration: 60000, gradients: DEFAULT_GRADIENTS };
};

export const saveBackgroundConfig = (config: BackgroundConfig) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }
};
