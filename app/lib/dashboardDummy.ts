// app/lib/dashboardDummy.ts

export interface Category {
  id: number;
  name: string;
  description: string;
  color: string;
  prizeCount: number;
}

export interface DashboardWinner {
  id: number;
  name: string;
  department: string;
  prize: string;
  category: string;
  drawnAt: string;
}

export const dummyCategories: Category[] = [
  { id: 1, name: 'Hadiah Utama', description: 'Hadiah bernilai tinggi untuk pemenang beruntung', color: 'amber', prizeCount: 2 },
  { id: 2, name: 'Hadiah Elektronik', description: 'Gadget dan perangkat elektronik terkini', color: 'violet', prizeCount: 3 },
  { id: 3, name: 'Hadiah Hiburan', description: 'Voucher dan pengalaman hiburan', color: 'cyan', prizeCount: 1 },
  { id: 4, name: 'Hadiah Konsolasi', description: 'Hadiah tambahan untuk peserta beruntung', color: 'emerald', prizeCount: 1 },
];

export const dummyWinners: DashboardWinner[] = [
  { id: 1, name: 'Ahmad Fauzi', department: 'Engineering', prize: 'Laptop Gaming', category: 'Hadiah Utama', drawnAt: '2026-04-17 14:30' },
  { id: 2, name: 'Siti Rahayu', department: 'Marketing', prize: 'Smartphone Premium', category: 'Hadiah Elektronik', drawnAt: '2026-04-17 14:45' },
  { id: 3, name: 'Budi Santoso', department: 'Finance', prize: 'Smart TV 55 Inch', category: 'Hadiah Elektronik', drawnAt: '2026-04-17 15:00' },
  { id: 4, name: 'Dewi Lestari', department: 'HR', prize: 'Sepeda Listrik', category: 'Hadiah Utama', drawnAt: '2026-04-17 15:15' },
  { id: 5, name: 'Eko Prasetyo', department: 'Operations', prize: 'Voucher Belanja', category: 'Hadiah Hiburan', drawnAt: '2026-04-17 15:30' },
  { id: 6, name: 'Fitri Handayani', department: 'Sales', prize: 'Kamera Mirrorless', category: 'Hadiah Elektronik', drawnAt: '2026-04-17 15:45' },
  { id: 7, name: 'Gunawan Wibowo', department: 'Engineering', prize: 'Headphone Wireless', category: 'Hadiah Konsolasi', drawnAt: '2026-04-17 16:00' },
];
