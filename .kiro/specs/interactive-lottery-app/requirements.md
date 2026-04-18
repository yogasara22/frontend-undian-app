# Dokumen Requirements

## Pendahuluan

Aplikasi Undian Interaktif adalah aplikasi frontend berbasis Next.js (App Router) yang memungkinkan penyelenggara acara menjalankan proses pengundian secara visual dan interaktif. Aplikasi berjalan sepenuhnya di Netlify menggunakan Client-Side Rendering (CSR), mendukung dua mode operasi: Demo Mode (data dummy tanpa backend) dan Live Mode (terhubung ke API Laravel eksternal). Antarmuka dirancang modern, responsif, dan profesional dengan animasi rolling yang menarik menggunakan Framer Motion.

## Glosarium

- **Aplikasi**: Aplikasi Undian Interaktif berbasis Next.js
- **Pengguna**: Operator/penyelenggara yang menjalankan undian melalui antarmuka
- **Peserta**: Individu yang terdaftar dalam daftar undian
- **Pemenang**: Peserta yang terpilih sebagai hasil undian
- **Hadiah**: Item atau reward yang diberikan kepada pemenang
- **Demo_Mode**: Mode operasi menggunakan data dummy tanpa koneksi backend
- **Live_Mode**: Mode operasi yang terhubung ke API Laravel eksternal
- **Rolling_Animation**: Animasi visual yang menampilkan nama peserta secara acak sebelum pemenang ditentukan
- **Winner_Box**: Komponen UI yang menampilkan status dan hasil undian
- **Prize_Section**: Komponen UI yang menampilkan informasi hadiah setelah undian selesai
- **useLottery**: Custom React hook yang mengelola seluruh state dan logika undian
- **API_Layer**: Modul `/lib/api.ts` yang menangani komunikasi dengan API eksternal
- **Dummy_Data**: Data peserta statis yang digunakan pada Demo Mode
- **Netlify_Functions**: Serverless functions opsional yang di-deploy di Netlify
- **CSR**: Client-Side Rendering — rendering dilakukan di browser pengguna
- **SSG**: Static Site Generation — halaman di-generate saat build time
- **NEXT_PUBLIC_API_URL**: Environment variable yang menyimpan URL API Laravel eksternal

---

## Requirements

### Requirement 1: Mode Operasi Ganda

**User Story:** Sebagai pengguna, saya ingin aplikasi dapat berjalan tanpa backend maupun dengan backend Laravel, sehingga saya bisa melakukan demo atau undian langsung sesuai kebutuhan.

#### Acceptance Criteria

1. THE Aplikasi SHALL mendukung dua mode operasi: Demo_Mode dan Live_Mode.
2. WHEN variabel lingkungan `NEXT_PUBLIC_API_URL` tidak dikonfigurasi, THE Aplikasi SHALL beroperasi dalam Demo_Mode secara otomatis.
3. WHEN variabel lingkungan `NEXT_PUBLIC_API_URL` dikonfigurasi dengan URL yang valid, THE Aplikasi SHALL beroperasi dalam Live_Mode dan mengirim permintaan ke API Laravel eksternal.
4. WHILE beroperasi dalam Demo_Mode, THE Aplikasi SHALL menggunakan Dummy_Data dari modul `/lib/dummy.ts` sebagai sumber data peserta.
5. WHILE beroperasi dalam Live_Mode, THE Aplikasi SHALL mengambil data hasil undian dari endpoint yang ditentukan oleh `NEXT_PUBLIC_API_URL`.
6. IF `NEXT_PUBLIC_API_URL` dikonfigurasi namun API eksternal tidak dapat dijangkau, THEN THE Aplikasi SHALL menampilkan pesan error yang informatif kepada pengguna.

---

### Requirement 2: Arsitektur Client-Side Rendering (CSR)

**User Story:** Sebagai pengguna, saya ingin aplikasi berjalan dengan lancar di Netlify tanpa ketergantungan pada server Node.js, sehingga deployment mudah dan stabil.

#### Acceptance Criteria

1. THE Aplikasi SHALL menggunakan Client-Side Rendering (CSR) sebagai mode rendering utama.
2. THE Aplikasi SHALL mendeklarasikan direktif `'use client'` pada setiap komponen yang menggunakan state, event handler, atau animasi.
3. THE Aplikasi SHALL kompatibel dengan deployment di Netlify menggunakan konfigurasi build command `npm run build` dan publish directory `.next`.
4. THE Aplikasi SHALL menghindari penggunaan `getServerSideProps`, Server Actions berat, atau API Route Next.js untuk logika inti undian.
5. WHEN proses build dijalankan, THE Aplikasi SHALL berhasil di-build tanpa error menggunakan perintah `npm run build`.

---

### Requirement 3: Manajemen State Undian

**User Story:** Sebagai pengguna, saya ingin status undian selalu akurat dan konsisten di seluruh antarmuka, sehingga saya dapat memantau proses undian dengan jelas.

#### Acceptance Criteria

1. THE useLottery SHALL mengelola state berikut: `isRolling` (boolean), `isLoading` (boolean), `winner` (null atau objek pemenang), `prize` (null atau objek hadiah), dan `error` (null atau string pesan error).
2. WHEN fungsi `startDraw` dipanggil, THE useLottery SHALL mengubah `isRolling` menjadi `true` dan `error` menjadi `null`.
3. WHEN proses undian selesai, THE useLottery SHALL mengubah `isRolling` menjadi `false` dan mengisi `winner` dengan data pemenang.
4. IF terjadi error selama proses undian, THEN THE useLottery SHALL mengubah `isRolling` menjadi `false`, mengisi `error` dengan pesan yang deskriptif, dan mempertahankan `winner` sebagai `null`.
5. WHILE `isRolling` bernilai `true`, THE useLottery SHALL memperbarui tampilan nama peserta secara acak setiap 100 milidetik menggunakan `setInterval`.
6. WHEN `startDraw` dipanggil, THE useLottery SHALL menunggu selama 3000 milidetik sebelum menghentikan animasi rolling dan menampilkan hasil akhir.
7. THE useLottery SHALL membersihkan interval animasi menggunakan `clearInterval` ketika komponen di-unmount atau ketika `isRolling` berubah menjadi `false`.

---

### Requirement 4: API Layer

**User Story:** Sebagai pengguna, saya ingin aplikasi dapat berkomunikasi dengan API Laravel eksternal secara andal, sehingga hasil undian yang ditampilkan akurat dan real-time.

#### Acceptance Criteria

1. THE API_Layer SHALL mengekspor fungsi `drawLottery` yang mengirim permintaan HTTP ke URL yang dikonfigurasi melalui `NEXT_PUBLIC_API_URL`.
2. WHEN fungsi `drawLottery` dipanggil, THE API_Layer SHALL mengembalikan data pemenang dan hadiah dalam format yang telah ditentukan.
3. IF respons API mengembalikan status HTTP selain 2xx, THEN THE API_Layer SHALL melempar error dengan pesan yang deskriptif.
4. IF permintaan jaringan gagal atau timeout, THEN THE API_Layer SHALL melempar error dengan pesan yang dapat ditampilkan kepada pengguna.
5. THE API_Layer SHALL menggunakan prefix `NEXT_PUBLIC_` pada semua environment variable agar dapat diakses di sisi klien di Netlify.

---

### Requirement 5: Animasi Rolling

**User Story:** Sebagai pengguna, saya ingin melihat animasi rolling yang menarik saat undian berlangsung, sehingga pengalaman undian terasa seru dan dramatis.

#### Acceptance Criteria

1. WHEN `isRolling` bernilai `true`, THE Winner_Box SHALL menampilkan nama peserta yang berubah secara acak setiap 100 milidetik.
2. WHEN `isRolling` bernilai `false` dan `winner` tidak null, THE Winner_Box SHALL menampilkan nama pemenang dengan animasi highlight menggunakan Framer Motion.
3. WHILE `isRolling` bernilai `false` dan `winner` bernilai `null`, THE Winner_Box SHALL menampilkan teks "???" sebagai placeholder.
4. THE Aplikasi SHALL mengimplementasikan animasi rolling menggunakan `useEffect` dengan `setInterval` yang hanya berjalan di sisi klien (client-only).
5. WHEN pemenang ditampilkan, THE Winner_Box SHALL menampilkan animasi transisi yang halus menggunakan Framer Motion untuk menyorot nama pemenang.
6. THE Aplikasi SHALL menggunakan Framer Motion untuk semua animasi UI termasuk transisi masuk/keluar komponen dan efek highlight pemenang.

---

### Requirement 6: Komponen Winner Box

**User Story:** Sebagai pengguna, saya ingin melihat status undian secara jelas di satu area terpusat, sehingga saya dan audiens dapat mengikuti proses undian dengan mudah.

#### Acceptance Criteria

1. THE Winner_Box SHALL menampilkan tiga kondisi visual yang berbeda: Idle (menampilkan "???"), Rolling (menampilkan nama acak), dan Result (menampilkan nama pemenang dengan highlight).
2. WHEN kondisi berpindah dari Rolling ke Result, THE Winner_Box SHALL menerapkan animasi transisi yang terlihat jelas menggunakan Framer Motion.
3. THE Winner_Box SHALL menampilkan nama pemenang dengan ukuran font yang besar dan mudah dibaca dari jarak jauh (cocok untuk layar event).
4. WHILE kondisi Idle, THE Winner_Box SHALL menampilkan elemen visual yang menarik perhatian (misalnya ikon atau efek visual) untuk mengindikasikan kesiapan sistem.

---

### Requirement 7: Komponen Prize Section

**User Story:** Sebagai pengguna, saya ingin informasi hadiah ditampilkan setelah pemenang diumumkan, sehingga audiens mengetahui hadiah yang diterima pemenang.

#### Acceptance Criteria

1. WHILE `winner` bernilai `null`, THE Prize_Section SHALL disembunyikan dari tampilan.
2. WHEN `winner` tidak null, THE Prize_Section SHALL ditampilkan dengan animasi masuk yang halus menggunakan Framer Motion.
3. THE Prize_Section SHALL menampilkan informasi hadiah yang diterima oleh pemenang.
4. WHEN Prize_Section muncul, THE Aplikasi SHALL menerapkan animasi Framer Motion dengan efek fade-in atau slide-in.

---

### Requirement 8: Tombol Mulai Undian

**User Story:** Sebagai pengguna, saya ingin tombol undian yang jelas dan responsif, sehingga saya dapat memulai proses undian dengan mudah.

#### Acceptance Criteria

1. THE Aplikasi SHALL menampilkan tombol "Mulai Undian" yang dapat diklik oleh pengguna.
2. WHEN tombol "Mulai Undian" diklik, THE Aplikasi SHALL memanggil fungsi `startDraw` dari useLottery.
3. WHILE `isRolling` bernilai `true`, THE Aplikasi SHALL menonaktifkan tombol "Mulai Undian" untuk mencegah pemanggilan ganda.
4. WHILE `isLoading` bernilai `true`, THE Aplikasi SHALL menampilkan indikator loading pada tombol.
5. WHEN undian selesai dan pemenang telah ditampilkan, THE Aplikasi SHALL menampilkan tombol "Undian Lagi" untuk memungkinkan pengguna mereset dan memulai undian baru.
6. WHEN tombol "Undian Lagi" diklik, THE useLottery SHALL mereset state `winner`, `prize`, dan `error` ke nilai awal (null).

---

### Requirement 9: Tampilan Responsif

**User Story:** Sebagai pengguna, saya ingin aplikasi tampil optimal di berbagai ukuran layar, sehingga dapat digunakan baik di layar besar saat event maupun di perangkat mobile.

#### Acceptance Criteria

1. THE Aplikasi SHALL menerapkan layout responsif menggunakan Tailwind CSS yang mendukung breakpoint mobile, tablet, dan desktop.
2. WHILE diakses dari perangkat desktop, THE Aplikasi SHALL menampilkan layout fullscreen dengan elemen terpusat dan ukuran font yang besar untuk keterbacaan dari jarak jauh.
3. WHILE diakses dari perangkat mobile, THE Aplikasi SHALL menampilkan layout stack vertikal yang dapat di-scroll.
4. THE Aplikasi SHALL menggunakan Tailwind CSS sebagai satu-satunya framework styling tanpa CSS custom yang berlebihan.

---

### Requirement 10: Penanganan Error

**User Story:** Sebagai pengguna, saya ingin mendapatkan informasi yang jelas ketika terjadi kesalahan, sehingga saya dapat mengambil tindakan yang tepat.

#### Acceptance Criteria

1. IF terjadi error saat proses undian, THEN THE Aplikasi SHALL menampilkan pesan error yang deskriptif dan mudah dipahami kepada pengguna.
2. WHEN pesan error ditampilkan, THE Aplikasi SHALL tetap memungkinkan pengguna untuk mencoba kembali dengan mengklik tombol undian.
3. IF koneksi ke API eksternal gagal saat Live_Mode, THEN THE Aplikasi SHALL menampilkan pesan error spesifik yang membedakan antara error jaringan dan error server.
4. THE Aplikasi SHALL menampilkan pesan error dengan styling yang konsisten dan tidak mengganggu layout utama.

---

### Requirement 11: Struktur Proyek dan Konfigurasi

**User Story:** Sebagai developer, saya ingin struktur proyek yang terorganisir dan konfigurasi yang tepat, sehingga pengembangan dan deployment berjalan lancar.

#### Acceptance Criteria

1. THE Aplikasi SHALL mengorganisir kode dalam struktur folder berikut: `/app` (halaman utama), `/app/components` (komponen UI), `/app/hooks` (custom hooks), `/app/lib` (utilitas dan API layer), `/app/types` (definisi TypeScript).
2. THE Aplikasi SHALL menyediakan file `/app/lib/api.ts` yang mengekspor fungsi `drawLottery`.
3. THE Aplikasi SHALL menyediakan file `/app/lib/dummy.ts` yang mengekspor data `dummyParticipants` untuk Demo_Mode.
4. THE Aplikasi SHALL menyediakan file `.env.local.example` yang mendokumentasikan semua environment variable yang diperlukan termasuk `NEXT_PUBLIC_API_URL`.
5. WHERE Netlify_Functions digunakan, THE Aplikasi SHALL menyediakan file `/netlify/functions/draw.js` sebagai alternatif serverless untuk logika undian.
6. THE Aplikasi SHALL menggunakan TypeScript untuk semua file komponen, hook, dan utilitas.

---

### Requirement 12: Performa dan Aksesibilitas

**User Story:** Sebagai pengguna, saya ingin aplikasi yang cepat dan dapat diakses oleh semua orang, sehingga pengalaman undian berjalan mulus tanpa hambatan.

#### Acceptance Criteria

1. THE Aplikasi SHALL memuat halaman utama dalam waktu kurang dari 3 detik pada koneksi broadband standar.
2. THE Aplikasi SHALL menyediakan atribut `aria-label` yang deskriptif pada semua elemen interaktif (tombol, input).
3. THE Aplikasi SHALL memastikan kontras warna antara teks dan latar belakang memenuhi rasio minimum 4.5:1 untuk teks normal.
4. THE Aplikasi SHALL menampilkan indikator fokus yang terlihat pada semua elemen yang dapat difokus menggunakan keyboard.
5. WHEN animasi rolling berjalan, THE Aplikasi SHALL memastikan perubahan konten diumumkan kepada screen reader menggunakan atribut `aria-live`.
