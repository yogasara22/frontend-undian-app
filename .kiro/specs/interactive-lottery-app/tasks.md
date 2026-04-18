# Rencana Implementasi: Aplikasi Undian Interaktif

## Ikhtisar

Implementasi aplikasi undian interaktif berbasis Next.js App Router (CSR) dengan TypeScript, Tailwind CSS, dan Framer Motion. Aplikasi mendukung dua mode operasi (Demo dan Live), dilengkapi animasi rolling dramatis, dan di-deploy ke Netlify sebagai static export.

## Tasks

- [x] 1. Setup proyek dan konfigurasi dasar
  - Inisialisasi proyek Next.js dengan TypeScript dan konfigurasi App Router
  - Pasang dependensi: `framer-motion`, `vitest`, `@testing-library/react`, `@testing-library/user-event`, `fast-check`, `jsdom`
  - Buat `next.config.ts` dengan `output: 'export'`, `trailingSlash: true`, dan `images.unoptimized: true`
  - Buat `netlify.toml` dengan build command `npm run build`, publish directory `.next`, dan plugin `@netlify/plugin-nextjs`
  - Buat `.env.local.example` dengan dokumentasi `NEXT_PUBLIC_API_URL`
  - Buat `vitest.config.ts` dengan environment `jsdom` dan `globals: true`
  - Buat file `app/globals.css` dengan Tailwind directives
  - _Requirements: 2.3, 2.5, 11.4, 11.5_

- [x] 2. Definisi TypeScript types
  - [x] 2.1 Buat `app/types/index.ts` dengan semua interface
    - Definisikan `Participant`, `Winner`, `Prize`, `DrawResult`, `LotteryState`, `AppMode`, `ApiResponse`
    - Pastikan semua field opsional ditandai dengan `?`
    - _Requirements: 11.1, 11.6_

- [x] 3. Implementasi data dummy dan API layer
  - [x] 3.1 Buat `app/lib/dummy.ts` dengan data peserta dan hadiah
    - Buat array `dummyParticipants` dengan minimal 20 peserta (nama, department)
    - Buat array `dummyPrizes` dengan minimal 5 hadiah (nama, value dalam Rupiah)
    - Ekspor kedua array tersebut
    - _Requirements: 1.4, 11.3_

  - [x] 3.2 Buat `app/lib/api.ts` dengan fungsi `drawLottery` dan `getAppMode`
    - Implementasikan `getAppMode()` yang membaca `NEXT_PUBLIC_API_URL`
    - Implementasikan `drawLottery()` dengan cabang Demo Mode (pilih acak dari dummy) dan Live Mode (fetch ke Laravel API)
    - Tangani semua HTTP error: 404 → pesan spesifik, 5xx → pesan server error, lainnya → pesan dengan status code
    - Tangani network failure dengan pesan yang dapat ditampilkan pengguna
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ]* 3.3 Tulis property test untuk `drawLottery` — Properti 4
    - **Properti 4: API Layer Melempar Error untuk Semua Non-2xx Status**
    - Mock `fetch` dengan status code yang di-generate `fc.integer({ min: 400, max: 599 })`
    - Verifikasi `drawLottery()` selalu melempar error untuk setiap status non-2xx
    - **Memvalidasi: Requirements 4.3, 4.4**

  - [ ]* 3.4 Tulis property test untuk `drawLottery` — Properti 5
    - **Properti 5: Format Output API Konsisten**
    - Generate response API yang valid dengan `fc.record`
    - Verifikasi `drawLottery()` selalu mengembalikan objek `{ winner: Winner, prize: Prize }` yang lengkap
    - **Memvalidasi: Requirements 4.2**

  - [ ]* 3.5 Tulis unit test untuk `api.ts`
    - Test Demo Mode mengembalikan data dari `dummyParticipants`
    - Test Live Mode memanggil URL yang benar
    - Test HTTP 404 melempar error dengan pesan spesifik
    - Test network failure melempar error yang dapat ditampilkan
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 4. Implementasi `useLottery` hook
  - [x] 4.1 Buat `app/hooks/useLottery.ts` dengan state management lengkap
    - Tambahkan direktif `'use client'`
    - Inisialisasi `LotteryState` dengan semua field: `isRolling`, `isLoading`, `winner`, `prize`, `error`, `currentDisplay`
    - Implementasikan `startDraw`: set `isRolling=true`, `error=null`, mulai `setInterval` 100ms untuk update `currentDisplay` dengan nama acak, panggil `drawLottery()`, tunggu 3000ms, `clearInterval`, set `winner` dan `prize`
    - Implementasikan error handling di `catch`: `clearInterval`, set `isRolling=false`, `isLoading=false`, `error=err.message`, `currentDisplay='???'`
    - Implementasikan `reset`: kembalikan semua state ke nilai awal
    - Tambahkan `useEffect` cleanup untuk `clearInterval` saat unmount
    - Gunakan `useCallback` pada `startDraw` dan `reset`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 8.6_

  - [ ]* 4.2 Tulis property test untuk `useLottery` — Properti 1
    - **Properti 1: Transisi State startDraw**
    - Generate state awal dengan kombinasi `winner` dan `error` yang bervariasi menggunakan `fc.record`
    - Verifikasi `startDraw` selalu menghasilkan `isRolling=true` dan `error=null`
    - **Memvalidasi: Requirements 3.2**

  - [ ]* 4.3 Tulis property test untuk `useLottery` — Properti 2
    - **Properti 2: Konsistensi State Error**
    - Generate berbagai jenis error (network, HTTP, timeout) menggunakan `fc.string()`
    - Verifikasi state setelah error selalu: `isRolling=false`, `error` berisi pesan, `winner=null`
    - **Memvalidasi: Requirements 3.4, 10.1, 10.3**

  - [ ]* 4.4 Tulis property test untuk `useLottery` — Properti 3
    - **Properti 3: State Setelah Undian Berhasil**
    - Generate data pemenang yang valid menggunakan `fc.record({ id: fc.integer(), name: fc.string() })`
    - Verifikasi state setelah undian berhasil: `isRolling=false`, `winner` berisi data pemenang
    - **Memvalidasi: Requirements 3.3**

  - [ ]* 4.5 Tulis property test untuk `useLottery` — Properti 7
    - **Properti 7: Reset Mengembalikan State ke Nilai Awal**
    - Generate state dengan kombinasi `winner`, `prize`, dan `error` yang terisi menggunakan `fc.record`
    - Verifikasi `reset` selalu mengembalikan semua nilai ke `null` dan `currentDisplay` ke `"???"`
    - **Memvalidasi: Requirements 8.6**

  - [ ]* 4.6 Tulis unit test untuk `useLottery`
    - Test state awal memiliki semua field dengan nilai yang benar
    - Test `startDraw` mengubah `isRolling` menjadi `true`
    - Test `reset` mengembalikan semua state ke nilai awal
    - Test interval dibersihkan saat komponen unmount (fake timers)
    - Test `currentDisplay` berubah setiap 100ms saat rolling (fake timers)
    - Test rolling berhenti setelah 3000ms (fake timers)
    - _Requirements: 3.1, 3.2, 3.3, 3.5, 3.6, 3.7_

- [x] 5. Checkpoint — Pastikan semua tests lulus
  - Pastikan semua tests lulus, tanyakan kepada pengguna jika ada pertanyaan.

- [x] 6. Implementasi komponen UI dasar
  - [x] 6.1 Buat `app/layout.tsx` dengan metadata dan font
    - Tambahkan metadata aplikasi (title, description)
    - Konfigurasi font dan global styles
    - _Requirements: 11.1_

  - [x] 6.2 Buat `app/components/ModeIndicator.tsx`
    - Tambahkan direktif `'use client'`
    - Tampilkan badge "DEMO MODE" atau "LIVE MODE" berdasarkan `getAppMode()`
    - Gunakan warna berbeda untuk setiap mode (kuning untuk demo, hijau untuk live)
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 6.3 Buat `app/components/ParticipantCounter.tsx`
    - Tampilkan jumlah peserta yang terdaftar
    - Gunakan data dari `dummyParticipants` di Demo Mode
    - _Requirements: 11.1_

  - [x] 6.4 Buat `app/components/ErrorDisplay.tsx`
    - Tambahkan direktif `'use client'`
    - Render `null` saat `error === null`
    - Tampilkan pesan error dengan animasi fade-in Framer Motion saat `error !== null`
    - Gunakan styling: border merah, background merah transparan, ikon warning
    - Tambahkan `aria-live="assertive"` untuk aksesibilitas
    - _Requirements: 10.1, 10.4, 12.2_

  - [ ]* 6.5 Tulis property test untuk `ErrorDisplay` — Properti 10
    - **Properti 10: Tombol Tetap Aktif Saat Error**
    - Generate berbagai string error menggunakan `fc.string()`
    - Verifikasi `ErrorDisplay` selalu dirender saat `error !== null`
    - **Memvalidasi: Requirements 10.2**

- [x] 7. Implementasi komponen `WinnerBox`
  - [x] 7.1 Buat `app/components/WinnerBox.tsx` dengan tiga kondisi visual
    - Tambahkan direktif `'use client'`
    - Implementasikan kondisi **Idle**: tampilkan ikon tanda tanya + teks "???" dengan opacity 50%
    - Implementasikan kondisi **Rolling**: tampilkan `currentDisplay` dengan efek blur/glow menggunakan Framer Motion variants
    - Implementasikan kondisi **Result**: tampilkan nama pemenang dengan animasi highlight (scale + glow) menggunakan Framer Motion
    - Gunakan `AnimatePresence` untuk transisi antar kondisi
    - Tambahkan `aria-live="polite"` dan `aria-label` yang deskriptif
    - Gunakan font besar: `text-6xl md:text-8xl font-black`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 6.1, 6.2, 6.3, 6.4, 12.2, 12.5_

  - [ ]* 7.2 Tulis property test untuk `WinnerBox` — Properti 9
    - **Properti 9: Winner Box Menampilkan Kondisi yang Tepat**
    - Generate semua kombinasi `(isRolling, winner)` menggunakan `fc.boolean()` dan `fc.option(fc.record(...))`
    - Verifikasi kondisi visual yang tepat untuk setiap kombinasi state
    - **Memvalidasi: Requirements 6.1, 5.1, 5.2, 5.3**

  - [ ]* 7.3 Tulis unit test untuk `WinnerBox`
    - Test menampilkan "???" saat idle (`!isRolling && !winner`)
    - Test menampilkan `currentDisplay` saat rolling
    - Test menampilkan nama pemenang saat result
    - _Requirements: 6.1, 5.1, 5.2, 5.3_

- [x] 8. Implementasi komponen `PrizeSection`
  - [x] 8.1 Buat `app/components/PrizeSection.tsx`
    - Tambahkan direktif `'use client'`
    - Render `null` saat `winner === null`
    - Tampilkan informasi hadiah dengan animasi slide-up Framer Motion saat `winner !== null`
    - Tampilkan nama hadiah, deskripsi, dan value
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 8.2 Tulis property test untuk `PrizeSection` — Properti 8
    - **Properti 8: Prize Section Visibility**
    - Generate state dengan `winner = null` dan `winner !== null` menggunakan `fc.option(fc.record(...))`
    - Verifikasi `PrizeSection` tidak dirender saat `winner = null` dan dirender saat `winner !== null`
    - **Memvalidasi: Requirements 7.1, 7.2**

  - [ ]* 8.3 Tulis unit test untuk `PrizeSection`
    - Test tidak dirender saat `winner = null`
    - Test dirender dengan informasi hadiah saat `winner !== null`
    - _Requirements: 7.1, 7.2, 7.3_

- [x] 9. Implementasi komponen `DrawButton`
  - [x] 9.1 Buat `app/components/DrawButton.tsx`
    - Tambahkan direktif `'use client'`
    - Tampilkan tombol "Mulai Undian" saat `!hasWinner`
    - Tampilkan tombol "Undian Lagi" saat `hasWinner`
    - Nonaktifkan tombol (`disabled`) saat `isRolling === true`
    - Tampilkan indikator loading (spinner) saat `isLoading === true`
    - Panggil `onDraw` saat tombol "Mulai Undian" diklik
    - Panggil `onReset` saat tombol "Undian Lagi" diklik
    - Tambahkan `aria-label` yang deskriptif pada tombol
    - Gunakan styling gradient: `bg-gradient-to-r from-indigo-600 to-purple-600`
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 12.2, 12.4_

  - [ ]* 9.2 Tulis property test untuk `DrawButton` — Properti 6
    - **Properti 6: Tombol Disabled Saat Rolling**
    - Generate state dengan `isRolling = true` menggunakan `fc.constant(true)`
    - Verifikasi tombol selalu dalam kondisi `disabled` saat `isRolling = true`
    - **Memvalidasi: Requirements 8.3**

  - [ ]* 9.3 Tulis property test untuk `DrawButton` — Properti 11
    - **Properti 11: Elemen Interaktif Memiliki Aria Label**
    - Generate berbagai kombinasi props menggunakan `fc.record`
    - Verifikasi tombol selalu memiliki atribut `aria-label` yang tidak kosong
    - **Memvalidasi: Requirements 12.2**

  - [ ]* 9.4 Tulis unit test untuk `DrawButton`
    - Test tombol disabled saat `isRolling = true`
    - Test tombol aktif saat `isRolling = false` dan `error !== null`
    - Test menampilkan "Undian Lagi" saat `hasWinner = true`
    - Test memanggil `onDraw` saat diklik
    - Test memanggil `onReset` saat tombol reset diklik
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

- [x] 10. Checkpoint — Pastikan semua tests lulus
  - Pastikan semua tests lulus, tanyakan kepada pengguna jika ada pertanyaan.

- [x] 11. Implementasi halaman utama dan integrasi komponen
  - [x] 11.1 Buat `app/page.tsx` sebagai orchestrator utama
    - Tambahkan direktif `'use client'`
    - Gunakan `useLottery` hook untuk mendapatkan semua state dan fungsi
    - Susun layout dengan background gradient dark: `bg-gradient-to-br from-[#0a0a0f] via-[#0f0a1e] to-[#1a0a2e]`
    - Integrasikan semua komponen: `ModeIndicator`, `WinnerBox`, `PrizeSection`, `DrawButton`, `ErrorDisplay`, `ParticipantCounter`
    - Implementasikan layout responsif: desktop centered fullscreen, mobile stack vertikal
    - _Requirements: 2.1, 2.2, 9.1, 9.2, 9.3, 9.4, 11.1_

  - [ ]* 11.2 Tulis integration test untuk halaman utama
    - Test aplikasi berjalan dalam Demo Mode saat `NEXT_PUBLIC_API_URL` tidak ada
    - Test flow lengkap: klik tombol → animasi rolling → tampil pemenang
    - Test tombol "Undian Lagi" mereset state
    - _Requirements: 1.2, 1.4, 8.5, 8.6_

- [ ] 12. Implementasi Netlify Function (opsional)
  - [ ] 12.1 Buat `/netlify/functions/draw.js` sebagai serverless function
    - Implementasikan handler untuk endpoint `/api/draw`
    - Kembalikan response dengan format `{ success: true, data: { winner, prize } }`
    - Tambahkan CORS headers yang diperlukan
    - _Requirements: 11.5_

- [x] 13. Checkpoint final — Verifikasi build dan semua tests
  - Jalankan `npm run build` dan pastikan tidak ada error
  - Pastikan semua tests lulus, tanyakan kepada pengguna jika ada pertanyaan.

## Catatan

- Task bertanda `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap task mereferensikan requirements spesifik untuk keterlacakan
- Checkpoint memastikan validasi inkremental di setiap tahap
- Property tests memvalidasi properti kebenaran universal dari design document
- Unit tests memvalidasi contoh spesifik dan edge case
- Semua komponen harus menggunakan direktif `'use client'` karena menggunakan state/animasi
