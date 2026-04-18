# Dokumen Desain: Aplikasi Undian Interaktif

## Ikhtisar

Aplikasi Undian Interaktif adalah aplikasi web frontend berbasis Next.js App Router yang memungkinkan penyelenggara acara menjalankan proses pengundian secara visual dan dramatis. Aplikasi ini dirancang untuk tampil memukau di layar besar saat event sekaligus responsif di perangkat mobile.

Aplikasi mendukung dua mode operasi:
- **Demo Mode**: Berjalan mandiri menggunakan data dummy, tanpa backend
- **Live Mode**: Terhubung ke API Laravel eksternal melalui environment variable

Seluruh rendering dilakukan di sisi klien (CSR) sehingga deployment ke Netlify berjalan tanpa konfigurasi server tambahan.

---

## Arsitektur

### Gambaran Umum

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (CSR)                        │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                   Next.js App Router                  │   │
│  │                                                      │   │
│  │   ┌─────────────────────────────────────────────┐   │   │
│  │   │              app/page.tsx (Root)             │   │   │
│  │   │                                             │   │   │
│  │   │  ┌──────────────┐   ┌────────────────────┐ │   │   │
│  │   │  │  WinnerBox   │   │   PrizeSection     │ │   │   │
│  │   │  │  Component   │   │   Component        │ │   │   │
│  │   │  └──────────────┘   └────────────────────┘ │   │   │
│  │   │                                             │   │   │
│  │   │  ┌──────────────┐   ┌────────────────────┐ │   │   │
│  │   │  │  DrawButton  │   │   ErrorDisplay     │ │   │   │
│  │   │  │  Component   │   │   Component        │ │   │   │
│  │   │  └──────────────┘   └────────────────────┘ │   │   │
│  │   └─────────────────────────────────────────────┘   │   │
│  │                                                      │   │
│  │   ┌─────────────────────────────────────────────┐   │   │
│  │   │           app/hooks/useLottery.ts            │   │   │
│  │   │     (State Management & Animation Logic)     │   │   │
│  │   └─────────────────────────────────────────────┘   │   │
│  │                                                      │   │
│  │   ┌──────────────────┐  ┌──────────────────────┐    │   │
│  │   │  app/lib/api.ts  │  │ app/lib/dummy.ts      │    │   │
│  │   │  (API Layer)     │  │ (Demo Data)           │    │   │
│  │   └──────────────────┘  └──────────────────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
         │                              │
         ▼ (Live Mode)                  ▼ (Demo Mode)
┌─────────────────┐            ┌─────────────────┐
│  Laravel API    │            │  Dummy Data     │
│  (Eksternal)    │            │  (In-memory)    │
└─────────────────┘            └─────────────────┘
```

### Alur Data

```
User Click "Mulai Undian"
        │
        ▼
  useLottery.startDraw()
        │
        ├─── Set isRolling = true
        ├─── Set error = null
        │
        ├─── Start setInterval (100ms) ──► Update currentDisplay (nama acak)
        │
        ├─── Call drawLottery()
        │         │
        │    Demo Mode ──► Pick random from dummyParticipants
        │    Live Mode ──► fetch(NEXT_PUBLIC_API_URL)
        │         │
        │    ┌────┴────┐
        │  Success    Error
        │    │          │
        │    ▼          ▼
        │  winner    error state
        │    │
        ├─── Wait 3000ms (animation duration)
        │
        ├─── clearInterval
        ├─── Set isRolling = false
        └─── Set winner & prize
```

---

## Komponen dan Antarmuka

### Diagram Komponen

```
app/
├── page.tsx                    # Root page, orchestrator utama
├── layout.tsx                  # Root layout dengan metadata
├── globals.css                 # Global styles (Tailwind directives)
│
├── components/
│   ├── WinnerBox.tsx           # Komponen utama display undian
│   ├── PrizeSection.tsx        # Komponen tampilan hadiah
│   ├── DrawButton.tsx          # Tombol aksi undian
│   ├── ErrorDisplay.tsx        # Komponen tampilan error
│   ├── ParticipantCounter.tsx  # Counter jumlah peserta
│   └── ModeIndicator.tsx       # Indikator Demo/Live mode
│
├── hooks/
│   └── useLottery.ts           # Custom hook state management
│
├── lib/
│   ├── api.ts                  # API layer (fetch ke Laravel)
│   └── dummy.ts                # Data dummy untuk Demo Mode
│
└── types/
    └── index.ts                # TypeScript type definitions
```

### Antarmuka Komponen

#### `WinnerBox`

```typescript
interface WinnerBoxProps {
  isRolling: boolean;
  winner: Winner | null;
  currentDisplay: string;
}
```

Menampilkan tiga kondisi visual:
- **Idle**: Ikon tanda tanya animasi + teks "???"
- **Rolling**: Nama peserta berganti cepat + efek blur/glow
- **Result**: Nama pemenang dengan animasi highlight + confetti effect

#### `PrizeSection`

```typescript
interface PrizeSectionProps {
  winner: Winner | null;
  prize: Prize | null;
}
```

Tersembunyi saat `winner === null`, muncul dengan animasi slide-up saat pemenang ditentukan.

#### `DrawButton`

```typescript
interface DrawButtonProps {
  isRolling: boolean;
  isLoading: boolean;
  hasWinner: boolean;
  onDraw: () => void;
  onReset: () => void;
}
```

Menampilkan tiga state: Normal, Loading/Rolling (disabled), dan Reset (setelah ada pemenang).

#### `ErrorDisplay`

```typescript
interface ErrorDisplayProps {
  error: string | null;
}
```

Muncul dengan animasi fade-in saat ada error, tersembunyi saat `error === null`.

---

## Model Data

### TypeScript Types

```typescript
// app/types/index.ts

export interface Participant {
  id: string | number;
  name: string;
  email?: string;
  department?: string;
}

export interface Winner {
  id: string | number;
  name: string;
  email?: string;
  department?: string;
}

export interface Prize {
  id: string | number;
  name: string;
  description?: string;
  imageUrl?: string;
  value?: string;
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
```

### Struktur Data Dummy

```typescript
// app/lib/dummy.ts

export const dummyParticipants: Participant[] = [
  { id: 1, name: "Ahmad Fauzi", department: "Engineering" },
  { id: 2, name: "Siti Rahayu", department: "Marketing" },
  // ... 50+ peserta dummy
];

export const dummyPrizes: Prize[] = [
  { id: 1, name: "Laptop Gaming", value: "Rp 15.000.000" },
  { id: 2, name: "Smartphone Premium", value: "Rp 8.000.000" },
  // ... beberapa hadiah dummy
];
```

---

## Desain UI/UX

### Tema Visual

Aplikasi menggunakan tema **dark gradient** yang modern dan profesional:

- **Background**: Gradient gelap dari `#0a0a0f` ke `#1a0a2e` (deep space purple)
- **Aksen Utama**: Gradient `#6366f1` → `#8b5cf6` → `#a855f7` (indigo-violet-purple)
- **Aksen Sekunder**: `#06b6d4` (cyan) untuk highlight dan glow effects
- **Teks Utama**: `#f8fafc` (hampir putih)
- **Teks Sekunder**: `#94a3b8` (slate-400)
- **Error**: `#ef4444` (red-500)
- **Success**: `#22c55e` (green-500)

### Layout Responsif

```
Desktop (≥1024px):
┌─────────────────────────────────────────────────────┐
│              HEADER: Logo + Mode Indicator           │
├─────────────────────────────────────────────────────┤
│                                                     │
│         ┌─────────────────────────────┐             │
│         │        WINNER BOX           │             │
│         │   (Large, centered, glow)   │             │
│         └─────────────────────────────┘             │
│                                                     │
│         ┌─────────────────────────────┐             │
│         │       PRIZE SECTION         │             │
│         │   (Animated, slide-up)      │             │
│         └─────────────────────────────┘             │
│                                                     │
│         ┌──────────┐  ┌──────────────┐              │
│         │  BUTTON  │  │ PARTICIPANT  │              │
│         │  (Draw)  │  │   COUNTER   │              │
│         └──────────┘  └──────────────┘              │
│                                                     │
└─────────────────────────────────────────────────────┘

Mobile (<768px):
┌─────────────────────┐
│  HEADER (compact)   │
├─────────────────────┤
│    WINNER BOX       │
│  (Full width)       │
├─────────────────────┤
│   PRIZE SECTION     │
│  (Full width)       │
├─────────────────────┤
│   DRAW BUTTON       │
│  (Full width)       │
├─────────────────────┤
│ PARTICIPANT COUNTER │
└─────────────────────┘
```

### Tailwind CSS Classes Utama

```
Background: bg-gradient-to-br from-[#0a0a0f] via-[#0f0a1e] to-[#1a0a2e]
Winner Box: bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl
Glow Effect: shadow-[0_0_60px_rgba(139,92,246,0.3)]
Button: bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500
Font Winner: text-6xl md:text-8xl font-black tracking-tight
```

---

## Implementasi Detail

### `useLottery` Hook

```typescript
// app/hooks/useLottery.ts
'use client';

export function useLottery() {
  const [state, setState] = useState<LotteryState>({
    isRolling: false,
    isLoading: false,
    winner: null,
    prize: null,
    error: null,
    currentDisplay: '???',
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const participants = useRef<Participant[]>(getParticipants());

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startDraw = useCallback(async () => {
    // 1. Set rolling state
    setState(prev => ({ ...prev, isRolling: true, isLoading: true, error: null }));

    // 2. Start rolling animation
    intervalRef.current = setInterval(() => {
      const random = participants.current[
        Math.floor(Math.random() * participants.current.length)
      ];
      setState(prev => ({ ...prev, currentDisplay: random.name }));
    }, 100);

    try {
      // 3. Fetch result
      const result = await drawLottery();
      setState(prev => ({ ...prev, isLoading: false }));

      // 4. Wait for animation duration (3000ms)
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 5. Stop animation, show winner
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
```

### `API Layer`

```typescript
// app/lib/api.ts

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
  const response = await fetch(`${API_URL}/api/lottery/draw`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

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
```

### Algoritma Animasi Rolling

Animasi rolling menggunakan dua lapisan:

**Lapisan 1 — Data Layer** (`useLottery`):
- `setInterval` setiap 100ms memilih peserta acak dari array
- Update `currentDisplay` state dengan nama peserta terpilih
- Berjalan selama 3000ms sebelum dihentikan

**Lapisan 2 — Visual Layer** (`WinnerBox` + Framer Motion):
- Setiap perubahan `currentDisplay` memicu re-render
- Framer Motion `AnimatePresence` + `motion.div` memberikan transisi halus
- Efek blur dan scale pada teks saat rolling
- Efek glow dan highlight saat pemenang ditampilkan

```typescript
// Algoritma pemilihan nama acak (Fisher-Yates inspired)
const getRandomParticipant = (participants: Participant[]): Participant => {
  const index = Math.floor(Math.random() * participants.length);
  return participants[index];
};

// Framer Motion variants untuk WinnerBox
const nameVariants = {
  rolling: {
    opacity: [1, 0.3, 1],
    scale: [1, 0.95, 1],
    filter: ['blur(0px)', 'blur(2px)', 'blur(0px)'],
    transition: { duration: 0.1, repeat: Infinity },
  },
  winner: {
    opacity: 1,
    scale: [1, 1.05, 1],
    filter: 'blur(0px)',
    transition: { duration: 0.5, ease: 'easeOut' },
  },
  idle: {
    opacity: 0.5,
    scale: 1,
    filter: 'blur(0px)',
  },
};
```

---

## Properti Kebenaran

*Properti adalah karakteristik atau perilaku yang harus berlaku di semua eksekusi sistem yang valid — pada dasarnya, pernyataan formal tentang apa yang seharusnya dilakukan sistem. Properti berfungsi sebagai jembatan antara spesifikasi yang dapat dibaca manusia dan jaminan kebenaran yang dapat diverifikasi mesin.*

### Properti 1: Transisi State startDraw

*Untuk semua* state awal yang valid (dengan atau tanpa error, dengan atau tanpa winner sebelumnya), memanggil `startDraw` harus menghasilkan `isRolling = true` dan `error = null`.

**Memvalidasi: Requirements 3.2**

### Properti 2: Konsistensi State Error

*Untuk semua* jenis error yang mungkin terjadi selama proses undian (network error, HTTP error, timeout), state setelah error harus selalu konsisten: `isRolling = false`, `error` berisi pesan deskriptif, dan `winner = null`.

**Memvalidasi: Requirements 3.4, 10.1, 10.3**

### Properti 3: State Setelah Undian Berhasil

*Untuk semua* data pemenang yang valid yang dikembalikan oleh API atau dummy data, setelah proses undian selesai state harus memiliki `isRolling = false` dan `winner` berisi data pemenang yang dikembalikan.

**Memvalidasi: Requirements 3.3**

### Properti 4: API Layer Melempar Error untuk Semua Non-2xx Status

*Untuk semua* HTTP status code di luar rentang 2xx (400, 401, 403, 404, 500, 503, dll.), fungsi `drawLottery` harus melempar error dengan pesan yang dapat ditampilkan kepada pengguna.

**Memvalidasi: Requirements 4.3, 4.4**

### Properti 5: Format Output API Konsisten

*Untuk semua* response API yang valid, fungsi `drawLottery` harus selalu mengembalikan objek dengan struktur `{ winner: Winner, prize: Prize }` yang lengkap dan valid.

**Memvalidasi: Requirements 4.2**

### Properti 6: Tombol Disabled Saat Rolling

*Untuk semua* state dengan `isRolling = true`, tombol "Mulai Undian" harus dalam kondisi `disabled` untuk mencegah pemanggilan ganda.

**Memvalidasi: Requirements 8.3**

### Properti 7: Reset Mengembalikan State ke Nilai Awal

*Untuk semua* state dengan kombinasi `winner`, `prize`, dan `error` yang terisi, memanggil fungsi `reset` harus mengembalikan semua nilai tersebut ke `null` dan `currentDisplay` ke `"???"`.

**Memvalidasi: Requirements 8.6**

### Properti 8: Prize Section Visibility

*Untuk semua* state dengan `winner = null`, komponen `PrizeSection` tidak boleh dirender atau ditampilkan. *Untuk semua* state dengan `winner` tidak null, `PrizeSection` harus dirender dan terlihat.

**Memvalidasi: Requirements 7.1, 7.2**

### Properti 9: Winner Box Menampilkan Kondisi yang Tepat

*Untuk semua* kombinasi state `(isRolling, winner)`, `WinnerBox` harus menampilkan kondisi visual yang tepat: Idle saat `!isRolling && !winner`, Rolling saat `isRolling`, dan Result saat `!isRolling && winner !== null`.

**Memvalidasi: Requirements 6.1, 5.1, 5.2, 5.3**

### Properti 10: Tombol Tetap Aktif Saat Error

*Untuk semua* state dengan `error !== null` dan `isRolling = false`, tombol undian harus dalam kondisi aktif (tidak disabled) sehingga pengguna dapat mencoba kembali.

**Memvalidasi: Requirements 10.2**

### Properti 11: Elemen Interaktif Memiliki Aria Label

*Untuk semua* state aplikasi, semua elemen interaktif (tombol, input) harus memiliki atribut `aria-label` yang deskriptif.

**Memvalidasi: Requirements 12.2**

---

## Penanganan Error

### Kategori Error

| Kategori | Kondisi | Pesan kepada Pengguna |
|----------|---------|----------------------|
| Network Error | `fetch` gagal / timeout | "Tidak dapat terhubung ke server. Periksa koneksi internet Anda." |
| Server Error (5xx) | HTTP 500-599 | "Server sedang mengalami gangguan. Silakan coba beberapa saat lagi." |
| Client Error (4xx) | HTTP 400-499 | "Permintaan tidak valid (kode: {status}). Periksa konfigurasi API." |
| Not Found (404) | HTTP 404 | "Endpoint API tidak ditemukan. Periksa konfigurasi NEXT_PUBLIC_API_URL." |
| Unknown Error | Error tidak terduga | "Terjadi kesalahan tidak diketahui. Silakan coba lagi." |

### Alur Penanganan Error

```
drawLottery() throws Error
        │
        ▼
useLottery catch block
        │
        ├── clearInterval (hentikan animasi)
        ├── isRolling = false
        ├── isLoading = false
        ├── error = err.message
        └── currentDisplay = '???'
                │
                ▼
        ErrorDisplay Component
        (Tampilkan pesan error dengan styling merah)
                │
                ▼
        DrawButton tetap aktif
        (Pengguna dapat mencoba kembali)
```

### Komponen ErrorDisplay

```typescript
// Tampil dengan animasi fade-in menggunakan Framer Motion
// Styling: border merah, background merah transparan, ikon warning
// Tidak mengganggu layout utama (absolute positioning atau di bawah button)
```

---

## Strategi Pengujian

### Pendekatan Pengujian Ganda

Aplikasi ini menggunakan dua pendekatan pengujian yang saling melengkapi:

1. **Unit Tests** — Menguji contoh spesifik, edge case, dan kondisi error
2. **Property-Based Tests** — Menguji properti universal di berbagai input

Library yang digunakan:
- **Vitest** — Test runner utama
- **@testing-library/react** — Testing komponen React
- **fast-check** — Property-based testing library untuk TypeScript
- **@testing-library/user-event** — Simulasi interaksi pengguna

### Unit Tests

**`useLottery` Hook:**
- State awal memiliki semua field dengan nilai yang benar
- `startDraw` mengubah `isRolling` menjadi `true`
- `reset` mengembalikan semua state ke nilai awal
- Interval dibersihkan saat komponen unmount
- `currentDisplay` berubah setiap 100ms saat rolling (fake timers)
- Rolling berhenti setelah 3000ms (fake timers)

**`drawLottery` API Layer:**
- Demo mode mengembalikan data dari `dummyParticipants`
- Live mode memanggil URL yang benar
- HTTP 404 melempar error dengan pesan spesifik
- Network failure melempar error yang dapat ditampilkan

**Komponen:**
- `WinnerBox` menampilkan "???" saat idle
- `PrizeSection` tidak dirender saat `winner = null`
- `DrawButton` disabled saat `isRolling = true`
- `ErrorDisplay` tidak dirender saat `error = null`

### Property-Based Tests

Setiap property test dikonfigurasi dengan minimum **100 iterasi** menggunakan `fast-check`.

Format tag: `Feature: interactive-lottery-app, Property {N}: {deskripsi}`

```typescript
// Contoh property test menggunakan fast-check

// Property 1: Transisi State startDraw
it('Feature: interactive-lottery-app, Property 1: startDraw selalu set isRolling=true dan error=null', () => {
  fc.assert(
    fc.asyncProperty(
      fc.record({
        winner: fc.option(fc.record({ id: fc.integer(), name: fc.string() })),
        error: fc.option(fc.string()),
      }),
      async (initialState) => {
        // Setup hook dengan state awal yang di-generate
        // Panggil startDraw
        // Verifikasi isRolling=true dan error=null
      }
    ),
    { numRuns: 100 }
  );
});

// Property 4: API Layer melempar error untuk semua non-2xx status
it('Feature: interactive-lottery-app, Property 4: drawLottery melempar error untuk semua HTTP error status', () => {
  fc.assert(
    fc.asyncProperty(
      fc.integer({ min: 400, max: 599 }),
      async (statusCode) => {
        // Mock fetch dengan status code yang di-generate
        // Verifikasi drawLottery() throws error
      }
    ),
    { numRuns: 100 }
  );
});
```

### Integration Tests

- Verifikasi aplikasi berjalan dalam Demo Mode saat `NEXT_PUBLIC_API_URL` tidak ada
- Verifikasi aplikasi berjalan dalam Live Mode saat `NEXT_PUBLIC_API_URL` dikonfigurasi
- End-to-end flow: klik tombol → animasi → tampil pemenang

### Konfigurasi Pengujian

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
  },
});
```

---

## Konfigurasi Deployment

### Netlify Configuration

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[build.environment]
  NEXT_PUBLIC_API_URL = ""  # Override di Netlify dashboard
```

### Environment Variables

```bash
# .env.local.example
# URL API Laravel eksternal (kosongkan untuk Demo Mode)
NEXT_PUBLIC_API_URL=https://your-laravel-api.com

# Contoh untuk development dengan backend lokal:
# NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Next.js Configuration

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  output: 'export',  // Static export untuk Netlify
  trailingSlash: true,
  images: {
    unoptimized: true,  // Required untuk static export
  },
};
```

---

## Pertimbangan Performa

- **Bundle Size**: Framer Motion di-import secara selektif (`motion`, `AnimatePresence`) untuk menghindari bundle bloat
- **Animation Performance**: Animasi menggunakan CSS `transform` dan `opacity` yang di-akselerasi GPU
- **Interval Cleanup**: `clearInterval` dipanggil di `useEffect` cleanup untuk mencegah memory leak
- **Re-render Optimization**: `useCallback` pada `startDraw` dan `reset` untuk stabilitas referensi
- **Static Export**: Halaman di-generate sebagai static HTML saat build, meminimalkan waktu load awal
