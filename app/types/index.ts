// app/types/index.ts

export interface Participant {
  id: string | number;
  name: string;
  email?: string;
  department?: string;
  shopName?: string;
  ktpNumber?: string;
  phoneNumber?: string;
  address?: string;
}

export interface Winner {
  id: string | number;
  name: string;
  email?: string;
  department?: string;
  shopName?: string;
  ktpNumber?: string;
  phoneNumber?: string;
  address?: string;
}

export interface Prize {
  id: string | number;
  name: string;
  description?: string;
  imageUrl?: string;
  value?: string;
  qty?: number;
  remainingQty?: number;
}

export interface DrawResult {
  winner: Winner;
  prize: Prize;
}

export interface LotteryState {
  isRolling: boolean;
  isLoading: boolean;
  winner: Winner | null;
  prize: Prize | null;
  error: string | null;
  currentDisplay: string;
}

export type AppMode = 'demo' | 'live';

export interface ApiResponse {
  success: boolean;
  data: DrawResult;
  message?: string;
}
