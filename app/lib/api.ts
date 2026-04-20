import type { AppMode, DrawResult, ApiResponse } from '../types';
import { dummyParticipants, dummyPrizes } from './dummy';
import { getBackgroundConfig, saveBackgroundConfig } from './settings';

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
  const config = getBackgroundConfig();
  console.log('Lottery Config:', config);
  
  let prize;
  let winner;

  // Cek apakah ada jadwal pemenang yang mengantri
  if (config.scheduledWinners && config.scheduledWinners.length > 0) {
    // Ambil pemenang pertama yang dijadwalkan (FIFO)
    const sw = config.scheduledWinners[0];
    
    // Cari objek Prize yang sesuai di dummyPrizes berdasarkan Nama
    const matchedPrize = dummyPrizes.find(
      p => p.name.toLowerCase() === sw.prizeName.toLowerCase()
    );

    // Jika hadiah ditemukan, gunakan hadiah tersebut
    prize = matchedPrize || dummyPrizes[Math.floor(Math.random() * dummyPrizes.length)];
    
    winner = {
      id: `fixed-${Date.now()}-${sw.id}`,
      name: sw.name,
      ktpNumber: sw.nik,
      department: (sw as any).department || 'VVIP',
      shopName: (sw as any).shopName || 'Pemenang Tertentu',
      address: 'Pusat'
    };

    console.log('Scheduled winner triggered:', winner.name, 'for', prize.name);

    // Otomatis hapus dari daftar setelah menang
    const newScheduled = config.scheduledWinners.slice(1);
    saveBackgroundConfig({ ...config, scheduledWinners: newScheduled });
  } else {
    // Jalani undian acak normal
    prize = dummyPrizes[
      Math.floor(Math.random() * dummyPrizes.length)
    ];
    winner = dummyParticipants[
      Math.floor(Math.random() * dummyParticipants.length)
    ];
    console.log('Normal random draw:', winner.name, 'for', prize.name);
  }

  return { winner, prize };
}
