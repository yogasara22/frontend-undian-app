'use client';

export interface GradientEntry {
  from: string;
  via: string;
  to: string;
}

export interface TypographyConfig {
  fontSize: number;
  color: string;
  fontWeight: string;
  fontFamily: string;
  letterSpacing: number;
  textShadow: boolean;
}

export interface ScheduledWinner {
  id: string;
  name: string;
  nik: string;
  prizeId: string | number;
  prizeName: string;
  department?: string;
  shopName?: string;
}

export interface BackgroundConfig {
  duration: number; // in milliseconds
  gradients: GradientEntry[];
  useImageBackground: boolean;
  backgroundImage: string;
  customTitle: string;
  titleStyle: TypographyConfig;
  prizeStyle: TypographyConfig;
  scheduledWinners: ScheduledWinner[];
}

const DEFAULT_TITLE_STYLE: TypographyConfig = {
  fontSize: 32,
  color: '#FFFFFF',
  fontWeight: '800',
  fontFamily: 'Inter',
  letterSpacing: 4,
  textShadow: true
};

const DEFAULT_PRIZE_STYLE: TypographyConfig = {
  fontSize: 80,
  color: '#FFFFFF',
  fontWeight: '900',
  fontFamily: 'Inter',
  letterSpacing: 0,
  textShadow: true
};

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
  const defaults: BackgroundConfig = { 
    duration: 60000, 
    gradients: [],
    useImageBackground: true,
    backgroundImage: '',
    customTitle: 'UNDIAN BERHADIAH',
    titleStyle: DEFAULT_TITLE_STYLE,
    prizeStyle: DEFAULT_PRIZE_STYLE,
    scheduledWinners: []
  };

  if (typeof window === 'undefined') return defaults;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Deep merge to ensure nested style objects are complete
      return {
        ...defaults,
        ...parsed,
        titleStyle: parsed.titleStyle ? { ...defaults.titleStyle, ...parsed.titleStyle } : defaults.titleStyle,
        prizeStyle: parsed.prizeStyle ? { ...defaults.prizeStyle, ...parsed.prizeStyle } : defaults.prizeStyle,
        scheduledWinners: parsed.scheduledWinners || []
      };
    } catch (e) {
      console.error('Failed to parse background config', e);
    }
  }

  return defaults;
};

export const saveBackgroundConfig = (config: BackgroundConfig) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }
};
