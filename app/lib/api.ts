import type { AppMode, DrawResult, ApiResponse } from '../types';
import { dummyParticipants, dummyPrizes } from './dummy';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function getAppMode(): AppMode {
  return API_URL ? 'live' : 'demo';
}

export async function drawLottery(): Promise<DrawResult> {
  if (!API_URL) {
    // Demo Mode: pilih pemenang dari dummy data
    return drawFromDummy();
  }

  // Live Mode: fetch dari Laravel API
  let response: Response;
  try {
    response = await fetch(`${API_URL}/api/lottery/draw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
  }

  if (!response.ok) {
    const status = response.status;
    if (status >= 500) {
      throw new Error(`Server error (${status}): Silakan coba beberapa saat lagi`);
    }
    if (status === 404) {
      throw new Error('Endpoint API tidak ditemukan. Periksa konfigurasi URL');
    }
    throw new Error(`Permintaan gagal dengan status ${status}`);
  }

  const json: ApiResponse = await response.json();
  return json.data;
}

function drawFromDummy(): DrawResult {
  const winner = dummyParticipants[
    Math.floor(Math.random() * dummyParticipants.length)
  ];
  const prize = dummyPrizes[
    Math.floor(Math.random() * dummyPrizes.length)
  ];
  return { winner, prize };
}
