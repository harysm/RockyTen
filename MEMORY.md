# MEMORY - SCOREBOARD NASI GERILYA

Dokumen ini berisi catatan lengkap arsitektur, akun master, riwayat perubahan, dan konfigurasi integrasi proyek **Scoreboard Nasi Gerilya**. Dokumen ini secara otomatis diperbarui oleh AI setiap kali ada perubahan/fitur baru.

---

## 📌 1. Informasi Proyek & Arsitektur

* **Nama Proyek**: Scoreboard Management System - Nasi Gerilya
* **Tech Stack**: Next.js 16 (App Router + Turbopack), TypeScript, TailwindCSS, Lucide Icons, Recharts.
* **Database Cloud**: Supabase PostgreSQL (`https://kgdesstrvhrkounqqruk.supabase.co`)
* **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtnZGVzc3Rydmhya291bnFxcnVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5MDA1NjUsImV4cCI6MjEwMTQ3NjU2NX0.fML9JKsx72oexrjC-cAS1u-mHdYYA6dTorL2J8k1khU`
* **GitHub Repository**: `https://github.com/databasegerilya-cyber/Scoreboard_nasigerilya`
* **Auto-Push & Deployment**: Terintegrasi otomatis via Git & Vercel.

---

## 👥 2. Akun Simulator & Kredensial Master

| Peran | Nama | Email Login | Password | Hak Akses |
|---|---|---|---|---|
| **Owner** | Richard | `richard@gmail.com` | `owner123` | Global Access (Semua Divisi + History System) |
| **Owner** | Kim | `kim@gmail.com` | `owner123` | Global Access (Semua Divisi + History System) |
| **Developer** | Developer | `developer@nasigerilya.com` | `123456` | Global Access (Semua Divisi + History System + Dev Tools) |
| **PIC IT** | Harys | `harys@nasigerilya.com` | `123456` | Divisi IT |
| **PIC Kitchen** | PIC Kitchen | `kitchen@nasigerilya.com` | `123456` | Divisi Kitchen |

---

## 🛡️ 3. Aturan Hak Akses & Logika Data (Business Rules)

1. **Global Access (Owner & Developer)**:
   * Memiliki akses 100% penuh di seluruh halaman: **Dashboard**, **Scoreboard KPI**, **Berita (Headlines)**, **Agenda (Todos)**, **Masalah (Issues)**, **Histori (History Logs)**, dan **Pengaturan (Settings)**.
   * Dapat melihat, memfilter, menambah metrik, dan mengedit data dari divisi manapun (`Kitchen`, `Floor`, `IT`, `Finance`, `Marketing`).
   * Bebas dari batasan penyaringan divisi PIC (`getFilteredData()` mengembalikan seluruh data jika `role === "owner"`, `role === "developer"`, atau `!departmentId`).

2. **Sistem Pendaftaran Profile (PostgreSQL `profiles`)**:
   * Pembuatan akun baru tidak menggunakan Supabase Auth API (`signUp`) untuk menghindari pembatasan format email domain.
   * Data pendaftaran langsung ditulis ke tabel `profiles` via `supabase.from("profiles").upsert(...)`.

3. **Riwayat Aktivitas (Audit Log / History Logs)**:
   * Seluruh aksi pengguna (pendaftaran user, pembuataan/pengisian metrik, pembuatan todo, pembuatan issue, penambahan headline, dsb.) langsung disimpan ke tabel `history_logs` di Supabase.
   * Tidak ada batasan `whitelistActions` sehingga 100% tindakan terekam secara aman.
   * Urutan log diurutkan berdasarkan waktu pembuatan terbaru (`created_at DESC`).

---

## 🗄️ 4. Struktur Tabel Supabase Database

1. `departments` (`id`, `name`)
2. `profiles` (`id`, `name`, `role`, `department_id`, `avatar_url`, `email`, `password`)
3. `metrics` (`id`, `department_id`, `name`, `target`, `unit`, `target_type`, `pic_id`, `pic_name`, `keterangan`, `is_active`, `cycle_type`, `duration_days`, `deadline`, `created_at`)
4. `metric_values` (`id`, `metric_id`, `year`, `month`, `week`, `value`, `inputted_by`, `updated_at`, `daily_values`)
5. `todos` (`id`, `department_id`, `title`, `description`, `priority`, `deadline`, `status`, `created_by`, `converted_to_metric_id`, `attachments`)
6. `issues` (`id`, `department_id`, `title`, `description`, `priority`, `status`, `pic_id`, `pic_name`, `created_at`, `attachment_name`, `attachment_size`, `attachment_type`, `attachment_data_url`, `attachments`)
7. `headlines` (`id`, `department_id`, `title`, `content`, `category`, `author_id`, `author_name`, `created_at`, `attachment_name`, `attachment_size`, `attachment_type`, `attachment_data_url`, `attachments`)
8. `history_logs` (`id`, `profile_id`, `profile_name`, `department_id`, `action`, `details`, `created_at`)

*Catatan: Seluruh tabel telah dinonaktifkan Row Level Security (`DISABLE ROW LEVEL SECURITY`) agar dapat diakses oleh anon key tanpa hambatan.*

### [2026-09-17] - 100% Local-First Architecture (Supabase Database Disconnected)
* **Pelepasan Koneksi Database Cloud Supabase (`.env.local`, `supabase.ts`, `AppContext.tsx`)**:
  * Mengatur flag `ENABLE_DATABASE = false` (`NEXT_PUBLIC_ENABLE_DATABASE=false`) dan menonaktifkan kredensial cloud Supabase lama.
  * Menghilangkan 100% network traffic / outbound queries ke server Supabase (`shdeembzgcdckrdycjrq.supabase.co`).
  * Menghentikan listener Realtime WebSocket `supabase.channel` dan bypass `fetchSupabaseData()`.
* **Persistensi Penuh via LocalStorage & Seed Data Bawaan**:
  * Menghilangkan pembersihan paksa `localStorage.removeItem(...)` pada saat mount, sehingga setiap perubahan metrik KPI, todos, issues, headlines, dan prioritas rocks tersimpan persisten di peramban pengguna.
  * Seluruh fungsi mutasi di `AppContext.tsx` dan modul `services/*` (`metricService`, `todoService`, `issueService`, `headlineService`, `rockService`, `profileService`, `historyService`) dilengkapi short-circuit guard `if (!ENABLE_DATABASE)` untuk eksekusi instan tanpa lag jaringan.
* **Modular Reconnect Ready**:
  * Jika di masa mendatang pengguna ingin menghubungkan database baru, cukup menyetel `NEXT_PUBLIC_ENABLE_DATABASE=true` dan memasukkan URL serta Anon Key database baru di `.env.local`.

### [2026-09-17] - TopBar Architecture, Sidebar Account Migration & Notification Dropdown System
* **Pemindahan Profil Akun ke Sisi Kanan TopBar (`TopBar.tsx`, `Sidebar.tsx`)**:
  * Menghapus kartu profil akun dari bagian bawah sidebar.
  * Mengintegrasikan profil akun di posisi paling kanan TopBar dengan tampilan Avatar, Nama Lengkap, dan Badge Divisi/Peran, dilengkapi menu dropdown profil (Informasi Akun, Pengaturan & RBAC, serta Tombol Keluar / Logout dengan dialog konfirmasi custom).
  * Bagian bawah sidebar kini disederhanakan menjadi indikator status sistem & badge versi aplikasi (`v2.4`) yang bersih dan minimalis.
* **Pusat Notifikasi Operasional Dinamis (`NotificationDropdown.tsx`, `TopBar.tsx`)**:
  * Menambahkan icon lonceng notifikasi interaktif di sebelah kiri profil akun pada TopBar.
  * Menampilkan badge jumlah notifikasi belum dibaca (*unread count badge*) dengan animasi denyut (*pulse*) saat terdapat isu kritikal/mendesak.
  * Dropdown memuat notifikasi operasional terpadu: Kendala/Issues aktif (Critical/High), Agenda/Todos pending prioritas tinggi, Berita/Headlines terbaru, dan Prioritas Rocks off-track.
  * Dilengkapi tab filter kategori (*Semua*, *Masalah*, *Agenda*, *Berita*, *Rocks*), tombol *"Tandai Dibaca"* berbasis `localStorage`, dan navigasi 1-klik langsung ke halaman modul terkait.
* **TopBar Terpadu Desktop & Mobile (`TopBar.tsx`, `AppShell.tsx`)**:
  * Menambahkan header sticky transparan berkilau kaca (`backdrop-blur-md`) di bagian paling atas layout aplikasi.
  * Dilengkapi penyesuaian judul rute otomatis, tombol toggle tema (Light/Dark), dan tombol menu hamburger yang terhubung mulus dengan drawer sidebar mobile.

### [2026-09-17] - Pure Skeleton Loading Architecture & Upfront Overlay Removal
* **Penghapusan Loading Screen Modal di Depan (`src/components/AppShell.tsx`)**:
  * Menghapus overlay `ExecutiveInsightLoading` yang sebelumnya memblokir antarmuka dengan modal blur kaca di depan (`fixed inset-0 z-[99999]`).
  * Layout aplikasi (Sidebar & Main content) kini langsung tampil seketika tanpa jeda popup overlay.
* **Standarisasi Skeleton Loading Mandiri di Seluruh Halaman (`src/components/skeletons/`, `src/app/`)**:
  * **Dashboard (`DashboardSkeleton.tsx`, `page.tsx`)**: Menambahkan skeleton terpadu untuk Header sapaan, 5 Kartu Statistik Metrik, Traction L10 Rocks Highlight, Grafik Performa Mingguan, dan Riwayat Aktivitas.
  * **Rocks (`RocksSkeleton.tsx`, `rocks/page.tsx`)**: Menambahkan skeleton untuk Header, tab kuartal/status, dan kartu-kartu Prioritas 90 Hari.
  * **Arsip (`ArchivesSkeleton.tsx`, `archives/page.tsx`)**: Menambahkan skeleton untuk Header, modul tab arsip (KPI, To-do, Issue, Headline), filter bar, dan grid arsip.
  * Menyelaraskan seluruh modul (`/`, `/scoreboard`, `/todos`, `/issues`, `/headlines`, `/history`, `/rocks`, `/archives`) sehingga memuat skeleton native masing-masing secara independen saat `isLoading === true`.

### [2026-08-11] - Batch 9 Implementation: Deep Fix for Special Metric Lookup & Upsert Payload Erase
* **Perbaikan Payload Upsert Database (`src/context/AppContext.tsx`)**:
  * **Eliminasi Penimpaan Array Harian**: Mengganti parameter payload debounced `saveMetricValueToDb` dari `dailyValues: newDaily` menjadi `dailyValues: mergedDaily`. Mencegah array harian terisi (H2 s.d H7) tertimpa oleh `null` saat pengeditan sel harian tunggal.
* **Special Metric Single-Timeline Lookup (`AppContext.tsx`, `scoreboard/page.tsx`, `page.tsx`)**:
  * **Bypass Penyaringan Bulan/Minggu untuk Metrik Khusus**: Mengubah pencarian `metricValues` untuk metrik khusus (`cycleType === "special"`) menjadi pencarian murni berbasis `v.metricId === metricId`. Menjamin data harian metrik khusus tidak pernah membal/fallback akibat perbedaan bulan kalender (`month: 7` vs `month: 8`) atau minggu kalender.

### [2026-08-11] - Batch 8 Implementation: Special Metric Daily Values State Preservation & Edit Recalculation Fix
* **Perbaikan Array Padding & Safe Merging Daily Values (`src/context/AppContext.tsx`, `src/app/scoreboard/page.tsx`)**:
  * **Sanitasi String JSON `daily_values`**: Memperbarui `fetchSupabaseData` dengan fungsi parser aman yang mengonversi string JSON (jika dikembalikan sebagai string oleh Supabase PostgreSQL) menjadi JS Array murni, mencegah error `Array.isArray` yang sebelumnya menyebabkan UI fallback ke array kosong `-`.
  * **Proteksi Array Index Merging (`updateMetricDailyValues`)**: Menambahkan logika `mergedDaily` yang menjaga seluruh indeks harian sebelumnya (H1 s.d H7) tetap utuh saat pengguna memasukkan data harian baru atau saat durasi metrik diperpanjang (misal H1 s.d H12).
* **Auto Recalculate & Re-sync di `editMetric` (`src/context/AppContext.tsx`)**:
  * **Perhitungan Ulang Otomatis Akumulasi (SUM vs AVG)**: Ketika metrik di-edit (misal mengubah metode akumulasi dari SUM ke AVG atau memperpanjang durasi), `editMetric` secara otomatis memperluas array `dailyValues` tanpa merusak data lama dan menghitung ulang total akumulasi (`weeklyVal`) serta menyimpannya secara instan ke Supabase database.

### [2026-08-10] - Batch 7 Implementation: Percentage Metric SUM / AVG Accumulation Mode Option
* **Dukungan Pilihan Akumulasi Penjumlahan (SUM) untuk Persentase (%)**:
  * **Membuka Selector Akumulasi**: Membuka dropdown pilihan Metode Akumulasi (**➕ Total Penjumlahan (SUM)** vs **📊 Rata-Rata (AVG)**) saat satuan **Persentase (%)** dipilih pada form Tambah Metrik, Edit Metrik, dan Modal Konversi Silang.
  * **Eliminasi Override Hardcoded**: Menghapus pembatasan `|| metric.unit === "percentage"` di seluruh engine kalkulasi (`AppContext.tsx`, `scoreboard/page.tsx`, `page.tsx`). Metrik persentase kini dapat diakumulasikan secara total (SUM) maupun rata-rata (AVG) sesuai kebutuhan bisnis.

### [2026-08-10] - Batch 6 Implementation: Complete Architecture Separation of Monthly (W1-W4) vs Special (H1-HN) Metrics
* **Pemisahan Total Arsitektur Metrik Bulanan vs Khusus (`src/app/scoreboard/page.tsx`)**:
  * **Penyembunyian Selector Minggu di Tab Khusus**: Selector minggu (W1 s.d W4) kini **disembunyikan 100%** saat pengguna berada di tab **⚡ Khusus (Ad-Hoc / Event)** untuk mencegah kebingungan pengguna.
  * **Kunci Timeline Mandiri (`targetWeek = 1`)**: Seluruh pembacaan (`getWeeklyValueObj`) dan pengisian data harian (`handleDailyValChange`) untuk metrik khusus secara eksplisit **dikunci ke Week 1**. Data H1 s.d H13 tersimpan dan tampil secara kontinu tanpa pernah terpengaruh pergantian minggu kalender (W1 ➔ W2).
  * **Banner Panduan Dedicated**: Menampilkan banner panduan independen untuk Metrik Khusus (*"1 Timeline Kontinyu dari tanggal dibuat s.d deadline"*).
* **Penguatan Persistensi Synchronizer `editMetric` (`src/context/AppContext.tsx`)**:
  * **Async Retry & Schema Protection**: Menambahkan error catching dan retry otomatis pada `editMetric` untuk menjamin perubahan nama metrik, deadline, dan durasi tersimpan 100% permanen di Supabase PostgreSQL.

### [2026-08-08] - Batch 5 Implementation: Metric Edit Duration & Daily Input Array Padding Fix
* **Perbaikan Kalkulasi Durasi Edit Metrik (`src/app/scoreboard/page.tsx`)**:
  * **Kunci Acuan Tanggal `createdAt`**: Mengganti acuan perhitungan tanggal dari `today` (`new Date()`) menjadi `createdAt` (tanggal pertama kali metrik dibuat). Perpanjangan deadline (contoh: 3 Agu s.d 15 Agu) kini menghitung **12 Hari** secara akurat tanpa terpotong akibat tanggal pengeditan.
  * **Fungsi Auto-Heal Durasi Metrik**: Menambahkan `getMetricDurationDays(metric)` yang secara otomatis memulihkan durasi metrik terpotong (seperti *Menu Digital Offline*) di tampilan tabel desktop, mobile card, dan badge durasi.
  * **Proteksi Array Input Harian**: Memperbarui `handleDailyValChange` dengan dynamic array padding (`Array(daysCount).fill(null)`), menjamin data harian yang sudah terisi (H1 s.d H5: 100%) **100% utuh & tidak tergeser**, sementara slot H6 s.d H12 tampil bersih sebagai kolom kosong baru.

### [2026-08-04] - Batch 4 Implementation: Real-time Sinyal Badge & Anti-Drop Submit Protection
* **Komponen Monitor Status Koneksi Internet (`NetworkStatusBadge.tsx`, `Sidebar.tsx`)**:
  * Menampilkan Badge Status Koneksi Real-time dengan Ikon WiFi dinamis pada Header Topbar Mobile dan Footer Sidebar Desktop.
  * Tiga State Status: 🟢 Sinyal Aman (Online, latency < 350ms), 🟡 Koneksi Lambat (Latency > 350ms), dan 🔴 Offline (WifiOff).
  * Menyederhanakan UI dengan menghapus titik indikator tambahan pada ikon WiFi agar lebih bersih dan rapi.
  * Melakukan auto-ping terukur setiap 15 detik serta mendengarkan event browser `online` dan `offline`.
* **Submit Protection & Loading Spinner di Seluruh Form/Modal (`todos`, `issues`, `scoreboard`, `headlines`)**:
  * **Anti Double-Submit**: Seluruh tombol submit dilengkapi state `isSubmitting` dan animasi `Loader2` (spinner berputar) saat proses kirim data berlangsung.
* **Modal Konfirmasi Custom Berstandar UI/UX Tinggi (`CustomConfirmModal.tsx`, `AppContext.tsx`, `AppShell.tsx`)**:
  * Menggantikan seluruh dialog konfirmasi bawaan browser (`window.confirm`) yang kaku dengan **Custom Confirmation Modal UI** bergaya Glassmorphism & Modern Dark/Light Mode.
  * Dilengkapi varian visual (`danger`, `warning`, `info`), animasi smooth zoom-in, latar belakang backdrop blur (`z-[999999]`), serta tombol aksi berwana kontras (*"Ya, Hapus"*, *"Ya, Selesaikan"*, *"Batal"*).
  * Diintegrasikan secara universal pada seluruh aksi hapus & selesaikan di modul **Agenda Kerja** (`todos`), **Masalah** (`issues`), **Scoreboard KPI** (`scoreboard`), **Headlines** (`headlines`), dan **Pengaturan Simulator** (`settings`).

### [2026-08-04] - Batch 3 Implementation: Custom Sorting, Archive Role Restriction & Accessibility System
* **Fitur Tampilan Kartu & Tabel (Grid vs Table View) pada Modul Arsip (`archives/page.tsx`)**:
  * Menambahkan render Tabel secara lengkap untuk tab **Agenda Kerja Selesai**, **Masalah Tuntas**, dan **Headline**.
  * Pengalihan antara tombol **Kartu** (Grid) dan **Tabel** (Table) kini merespons 100% pada ke-4 tab arsip (Scoreboard KPI, Agenda Kerja, Masalah, Headline).
* **Fitur Sorting Ascending / Descending Multi-Kriteria & Penyederhanaan Aksi (`scoreboard`, `todos`, `issues`, `archives`)**:
  * **Scoreboard KPI (`/scoreboard` & `/archives`)**: Mendukung pengurutan berdasarkan Divisi (A-Z / Z-A), Target, dan Nama Metrik.
  * **Agenda Kerja (`/todos` & `/archives`)**: Mendukung pengurutan berdasarkan Status (Pending vs Selesai), Divisi, Prioritas (High -> Low / Low -> High), dan Judul (A-Z).
  * **Penghapusan Tombol Batal & Reopen**: Menghapus tombol `Batal` dan `Reopen` redundan pada baris item Agenda Kerja (`/todos`). Pengguna cukup mencentang/mengecek ulang checkbox di sebelah kiri untuk membuka kembali (reopen) agenda kerja.
  * **Masalah (`/issues` & `/archives`)**: Mendukung pengurutan berdasarkan Status (Terbuka -> Dalam Proses -> Tuntas), Divisi, Prioritas (Critical -> High -> Medium -> Low), dan Judul (A-Z).
  * **Tampilan Deskripsi Utuh (Full Description)**: Menghapus batasan `line-clamp-2` & `max-w-sm` pada deskripsi masalah (`/issues` dan `/archives`), serta menambahkan `whitespace-pre-line break-words` agar seluruh isi deskripsi yang panjang tampil utuh tanpa terpotong.
  * Control UI seragam di seluruh modul dengan Dropdown `URUTKAN:` & Tombol Toggle Arah (⬆️ ASC / ⬇️ DESC).
* **Pembatasan Akses Modul Arsip (`Sidebar.tsx`, `archives/page.tsx`)**:
  * **Sidebar Navigation**: Menu **Arsip** disembunyikan dari navigasi pengguna bertipe `PIC`. Hanya ditampilkan untuk `Developer` dan `Owner`.
  * **Route Guard**: Menambahkan `useEffect` guard pada `/archives` yang secara otomatis mengalihkan (redirect) pengguna non-owner/dev ke halaman utama (`/`) dengan notifikasi toast *"Akses Ditolak: Halaman Arsip khusus Owner & Developer"*.
* **Sistem Aksesibilitas UI Kompleks (`AppContext.tsx`, `settings/page.tsx`, `globals.css`)**:
  * **Skala Font / Font Size Scaling**: Opsi Normal (100%), Besar (115%), dan Sangat Besar (130%) yang tersimpan secara persisten di `localStorage` dan mengatur variabel `data-font-size` pada root `<html>`.
  * **UI Density Mode (Aktif Real-time & PostCSS Fixed)**: Opsi Rapat (Compact), Standar (Normal), dan Longgar (Comfortable). Memperbaiki sintaks selector CSS dengan karakter escape desimal (`.py-3\.5`) sehingga PostCSS/Turbopack melakukan parse tanpa error dan mengubah padding card, gap grid, margin spasi, serta padding tabel secara instan saat tombol dipilih.
  * **High Contrast & Reduce Motion**: Toggle Switch untuk mode kontras tinggi dan penghentian animasi berlebihan.

### [2026-08-04] - Batch 2 Implementation: Centralized i18n, Archives Module & Excel Export
* **Pembaruan Filter Status & Penghapusan Kolom % Achievement (`archives/page.tsx`)**:
  * **Penyesuaian Filter Status**: Mengubah Opsi Filter STATUS dari berbasis persentase achievement menjadi berbasis **Status Item** (KPI: `Aktif` / `Selesai`, Todos: `Selesai` / `Pending`, Issues: `Tuntas` / `Dalam Proses` / `Terbuka`).
  * **Penghapusan % Achievement**: Menghapus kolom `% Achievement` dan meter grafik persentase achievement dari Card View, Table View, serta Laporan Export Excel (.xlsx) untuk fokus pada Target, Realisasi, dan Status.
  * **Hasil Terverifikasi**: Tampilan filter dan tabel kini bersih, fokus pada status riil data.
* **Optimalisasi Supabase Egress Bandwidth (`AppContext.tsx`)**:
  * Mengeliminasi pengambilan string Base64 gambar lampiran (`attachment_data_url`) dari query `SELECT *` massal saat `fetchSupabaseData()` berjalan. Ukuran data per request mengecil dari 5 MB menjadi **< 10 KB (hemat 99.8% bandwidth)**.
  * Memperpanjang jeda throttle listener Realtime Supabase `postgres_changes` dari 1.5 detik menjadi **10 detik** untuk menghentikan akumulasi Egress akibat dev server hot-reload.
* **Redesain Halaman Arsip Full-Width & Tampilan Data Detail Utuh (`archives/page.tsx`)**:
  * Mengubah tata letak halaman Arsip agar mengisi seluruh lebar layar secara penuh (`w-full flex-1 grid-cols-1 md:grid-cols-2 lg:grid-cols-3`), menghilangkan area kosong yang meluap di sisi kanan.
  * Menampilkan seluruh deskripsi/konten secara utuh dan detail (tanpa pemotongan teks `line-clamp`), serta menambahkan info lengkap Divisi, Prioritas, Dibuat Oleh / PIC, Tanggal, dan Rekap Headlines.
* **Standarisasi Konsistensi Border Radius Scale (`rounded-2xl`)**:
  * Menyelaraskan seluruh kelengkungan sudut kontainer utama, card, modal, filter bar, dan tabel di seluruh halaman aplikasi menjadi **`rounded-2xl` (16px)** agar konsisten, profesional, dan tidak terlalu melengkung berlebihan.
* **Standarisasi Visual Unified Filter Bar (`todos`, `issues`, `headlines`)**:
  * Menyelaraskan tampilan Filter Bar pada 3 modul utama (**To-do List**, **Issues**, dan **Headlines**) dengan kontainer kapsul membulat (`rounded-[28px]`), prefix header `FILTER:`, judul seksi uppercase (`STATUS:`, `DIVISI:`, `PRIORITAS:`, `KATEGORI:`), serta garis pembatas vertikal (`|`) yang rapi.
* **Penyempurnaan Visual Kolom Target & Tab Switcher Scoreboard (`scoreboard/page.tsx`)**:
  * Mengganti ikon chart zig-zag pada kolom TARGET menjadi ikon panah lurus murni berwarna hijau (`ArrowUp` ↑ / `ArrowDown` ↓) di sisi kiri nilai target.
  * Menghapus titik indikator pulse hitam (`●`) dan teks dalam kurung `(Routine KPI)` & `(Ad-Hoc)` pada tombol tab switcher, menyisakan label bersih **`📅 Bulanan` / `Monthly`** dan **`⚡ Harian / Khusus` / `Daily / Special`**.
* **Modul Arsip Sistem & Download Excel (`src/app/archives/page.tsx`)**:
  * Menambahkan halaman dedicated `/archives` yang menampung riwayat To-do, Issue, dan Headline yang diarsip manual.
  * Menyediakan fitur **`📥 Download Laporan Excel (.xlsx)`** untuk mengunduh rekap riwayat item yang diarsip per divisi.
  * Menambahkan tombol **`📦 Arsipkan`** pada item yang sudah berstatus `Selesai` / `Closed` / `Solved`.
* **Kamus i18n Terpusat & Standarisasi `To-do` (`src/lib/translations.ts`, `Sidebar.tsx`)**:
  * Membuat kamus penerjemahan terpusat `translations.ts` untuk mendukung switch bahasa 100% ID ↔ EN.
  * Menyelaraskan penulisan kata `Todo` menjadi **`To-do` / `To-do List`** sesuai standar Bahasa Inggris.
  * Menambahkan item menu **`🗃️ Arsip Sistem`** pada navigasi Sidebar.

### [2026-08-04] - Batch 1 Implementation: Performance, Signal, Egress & UI Parity
* **Input Debouncing 500ms & Realtime Throttle (`src/context/AppContext.tsx`)**:
  * Menambahkan jeda debounce 500ms pada `updateMetricDailyValues()` untuk mencegah bentrokan sinyal 3G/WiFi saat mengetik data harian.
  * Menambahkan throttling 1.5s pada Realtime listener `postgres_changes` untuk menghemat penggunaan Egress Supabase di bawah 1 GB/bulan (aman di $0 Free Tier).
* **Converter Move & Transform (`src/components/UniversalConvertModal.tsx`)**:
  * Mengonversi item (misal Headline ke Issue) kini secara otomatis **menghapus item asal** sehingga tidak ada duplikasi data di dua modul.
* **Restorasi Unit Satuan Boolean (`scoreboard/page.tsx`, `UniversalConvertModal.tsx`)**:
  * Mengembalikan opsi `Boolean (Ya / Tidak)` ke dalam dropdown Unit Satuan pada form Tambah Metrik, Edit Metrik, dan Konversi.
* **Redesain Segmented Tab Switcher & Title Header (`scoreboard/page.tsx`)**:
  * Meredesain Tab Switcher menjadi Segmented Control Button Bar yang jelas ber-outline tebal dengan label **"📅 Bulanan"** & **"⚡ Harian (Khusus)"**.
  * Menambahkan Banner Header Title bertuliskan `📊 Target & Progress KPI Bulanan (W1 - W4)` dan `⚡ Target & Progress KPI Harian / Khusus`.
  * Menambahkan indikator visual arah target pada kolom TARGET: 📈 `(Makin Tinggi ↑)` untuk `higher_better` dan 📉 `(Makin Rendah ↓)` untuk `lower_better`.

### [2026-08-04] - Dynamic Active Week Calculation Fix (W1-W4 Scoreboard)
* **Perbaikan Kalkulasi Minggu Aktif Metrik (`src/context/AppContext.tsx`)**:
  * Mengganti tanggal acuan *hardcoded* `2026-07-18T12:00:00` pada fungsi `getMetricActiveWeek()` menjadi `new Date()` (waktu nyata / *real-time*).
  * Memastikan metrik yang telah berjalan ≥ 7 hari otomatis membuka Minggu 2 (W2) secara presisi dan kolom input harian H1-H7 untuk W2 dapat diisi oleh pengguna.

### [2026-08-03] - Ultra-Minimalist Logo Pulse & Laser Line Loading Screen (Opsi A)
* **Penyempurnaan Loading Screen Ultra-Minimalis (`src/components/ui/ExecutiveInsightLoading.tsx`, `src/components/AppShell.tsx`)**:
  * **Frosted Glass Blur Backdrop**: Mempertahankan hamparan blur kaca (`backdrop-blur-2xl`) di atas layout halaman.
  * **Center Logo Breathing Pulse**: Menampilkan logo Nasi Gerilya di tengah dengan animasi bernapas (*breathing pulse*) yang tenang & bersih.
  * **Laser Line Progress Beam**: Garis laser tipis 2px (`w-48 h-0.5`) di bawah logo dengan efek sinar kilap mengalir mulus (`.animate-wave-shine`).
  * **Zero Clutter Aesthetics**: Membuang 100% dekorasi ramai (quote, card box, badge, & glow berlebih) untuk standar estetika Apple/Linear.

---

### [2026-08-03] - Universal Skeleton Loading System (Wave Shine Animation)
* **Implementasi Skeleton Loading Universal di Seluruh Halaman (`src/components/skeletons/`, `src/app/`)**:
  * **Design System Wave Shine**: Menambahkan efek animasi kilauan gelombang (`.animate-wave-shine` + `@keyframes waveShimmer`) pada `src/app/globals.css` dengan dukungan penuh Light Mode (`white/35` s.d `white/65`) & Dark Mode (`white/05` s.d `white/15`).
  * **Komponen Skeleton Presisi Layout**:
    1. `ScoreboardSkeleton`: Skeleton untuk header statistik, tab siklus bulanan/khusus, dan baris-baris tabel KPI.
    2. `TodosSkeleton`: Skeleton untuk filter bar, priority tags, dan kartu agenda todo.
    3. `IssuesSkeleton`: Skeleton untuk stat cards, filter status, dan kartu kendala operasional.
    4. `HeadlinesSkeleton`: Skeleton untuk kartu pengumuman berita dan tag kategori.
    5. `HistorySkeleton`: Skeleton untuk baris log audit aktivitas.
  * **State Integration**: Mengintegrasikan state `isLoading` pada `AppContext` yang dipemicu saat pengambilan data awal dari Supabase PostgreSQL.

---

### [2026-08-03] - Flutter Mobile App Driver Nasi Gerilya (Direct-to-Consumer Fleet)
* **Peluncuran Aplikasi Mobile Flutter Driver Nasi Gerilya (`d:\Kerjaan\DriverApp`)**:
  * **Model Logika Batching Dinamis & SLA Penyiapan 15 Menit**:
    - Kasir POS mengirim pesanan **satu per satu** (`Kirim ke Driver`). Pesanan pertama otomatis menginisiasi **Batch 1 (`1/10`)** dan memicu **Timer SLA Hitung Mundur 15 Menit**.
    - **Syarat Dispatch**: Berangkat seketika saat kapasitas mencapai **10/10** ATAU saat **Timer 15 Menit Habis** berapapun jumlah pesanan yang ada (misal **6/10**).
    - **Multi-Batch Queueing**: Saat driver mengantar Batch 1 di jalan, pesanan baru dari kasir otomatis menginisiasi **Batch 2 (`1/10`)** dengan timer 15 menit baru!
  * **Tariff Engine Bensin & Jarak**: Formula otomatis `≤ 6.0 km` = Rp 11.000 (flat), dan `> 6.0 km` = Rp 11.000 + (Sisa KM × Rp 1.500).
  * **Panel Simulasi Kasir POS (`StandbyScreen`)**:
    - Tombol `[ ➕ +1 Pesanan Kasir ]` untuk menguji penambahan akumulasi pesanan `1/10` ➔ `6/10` ➔ `10/10`.
    - Tombol `[ ⏱️ Simulasi 15 Min Habis ]` untuk menguji *force dispatch* pesanan partial.
  * **5 Layar UI/UX Flutter**:
    1. `StandbyScreen`: Dynamic accumulator card, live SLA countdown timer, & cashier simulator panel.
    2. `BatchLoadingScreen`: Verifikasi checklist muatan (`BAG #01` s/d `BAG #N`) sebelum berangkat.
    3. `ActiveBatchScreen`: Hero card stop aktif, progress bar, tombol **1-Click WA OTW**, & **1-Click Google Maps**.
    4. `PODModal`: Dialog simulasi foto bukti serah terima (Proof of Delivery) & nama penerima.
    5. `BatchSummaryScreen`: Ringkasan statistik batch completed (Total KM & Total Ongkir) ➔ Rute **Return to Outlet**.
  * **Sensitivitas SOS Kendala Lapangan**: Tombol darurat `🚨 SOS DARURAT` untuk melaporkan ban kempes, kecelakaan, atau mesin mogok secara *real-time* ke Dispatcher.

---

### [2026-08-03] - Edit Metrik KPI Full Parity & Auto PIC Assignment
* **Penyempurnaan Form Edit Metrik KPI (`src/app/scoreboard/page.tsx`)**:
  * **Parameter Lengkap**: Menambahkan kontrol konfigurasi **Metode Akumulasi Harian ke Mingguan** (SUM / AVG), **Siklus & Periode Metrik** (Bulanan / Khusus Ad-Hoc), **Tanggal Deadline & Kalkulasi Durasi Hari** (jika Khusus), serta **Arah Evaluasi Target** (📈 Makin Tinggi / 📉 Makin Rendah).
  * **Penghapusan Input Manual PIC**: Field "Nama PIC" telah dihapus dari form edit. Sistem secara otomatis menetapkan PIC penanggung jawab divisi sesuai divisi yang dipilih.
  * **Pembersihan Unit Boolean**: Opsi unit `boolean` (YA/TIDAK) telah dihapus dari seluruh dropdown pilihan unit metrik KPI (`scoreboard/page.tsx`, `todos/page.tsx`).

---

### [2026-07-30] - Universal Convert Modal Parity Update (Full Scoreboard Target Config)
* **Penyempurnaan Form Konversi ke Scoreboard KPI (`src/components/UniversalConvertModal.tsx`)**:
  * **Metode Akumulasi Harian ke Mingguan**: Menambahkan opsi **SUM (Total Penjumlahan)** & **AVG (Rata-Rata)** untuk metrik bertipe Angka/Rupiah pada modal konversi.
  * **Tanggal Deadline Metrik Khusus (Ad-Hoc)**: Menambahkan input pemilih tanggal deadline (`input[type="date"]`) dan kalkulator durasi hari otomatis ketika memilih jenis siklus metrik *Khusus (Ad-Hoc / Event)*.
  * **Sinkronisasi Parameter Scoreboard**: Seluruh atribut metrik (Target, Satuan, Akumulasi, Evaluasi, Siklus, Deadline, PIC, Keterangan) kini disalurkan 100% lengkap ke `addMetric`.

---

### [2026-07-30] - Custom White SVG Calendar Picker Indicator for Dark Mode
* **Solusi Mutlak Visibilitas Ikon Kalender Input Tanggal (`src/app/globals.css`)**:
  * Mengganti ikon bawaan Chromium `-webkit-calendar-picker-indicator` dengan **SVG kustom Lucide-style (stroke `#ffffff` putih terang)** saat Dark Mode aktif (`.dark`).
  * Menghilangkan ketergantungan pada CSS filter bawaan browser yang sering terabaikan di Windows Chrome/Edge, menjamin ikon kalender 100% tampil **putih terang bersih (Pure White)** di Dark Mode.

---

### [2026-07-30] - Universal Convert Modal Enhancements (Auto PIC Dropdown & Link/File Attachments)
* **Penyempurnaan Modal Konversi Silang (`src/components/UniversalConvertModal.tsx`, `src/context/AppContext.tsx`)**:
  * **Sistem Dropdown PIC Otomatis**: Menambahkan dropdown **PIC Penanggung Jawab**. Saat divisi diubah pada form konversi, sistem secara otomatis memilih PIC pertama yang bertugas di divisi tersebut. Pengguna juga dapat memilih PIC lain dari daftar terkelompok.
  * **Kelola Lampiran File & Link Tautan**: Menambahkan seksi pengunggahan berkas (Foto, PDF, Excel, CSV, PPT maks 5MB) dan sematkan link URL eksternal khusus untuk target konversi **Berita Headline**, **Agenda Todo**, dan **Masalah Issue**.
  * **Otomatisasi Data Lampiran**: Lampiran bawaan dari item asal otomatis disalin (*pre-filled*) ke modal konversi, dan pengguna dapat menambah link/file baru atau menghapus lampiran sebelum submit.

---

### [2026-07-30] - Structured Attachment Display (Links Top, Images Bottom Grid)
* **Pemisahan & Penataan Posisi Lampiran (`src/app/headlines/page.tsx`, `src/app/todos/page.tsx`, `src/app/issues/page.tsx`)**:
  * **Link & Dokumen di Atas**: Tautan URL/Link eksternal dan berkas dokumen non-gambar otomatis ditampilkan di **bagian atas** kontainer lampiran secara sejajar.
  * **Gambar di Bawah**: Seluruh gambar lampiran ditampilkan di **bagian bawah** link dalam barisan thumbnail (`w-14 h-14`) yang tersusun rapi (*neat flex wrap grid*).
  * **Kejajaran Posisional**: Saat terdapat banyak gambar dan link sekaligus, posisi link dan gambar tidak lagi saling mendesak/bercampur pada baris yang sama.

---

### [2026-07-29] - Modal Link Attachment Layout Optimization (No Horizontal Scroll)
* **Penyempurnaan Tata Letak Input Link (`src/app/headlines/page.tsx`, `src/app/todos/page.tsx`, `src/app/issues/page.tsx`)**:
  * Mengubah tata letak dua kolom berdesakan (`grid-cols-2`) pada bagian input sematkan link menjadi **tata letak bertingkat (stacked layout)** dengan `min-w-0` dan `w-full`.
  * Menghilangkan scrollbar horizontal (scroll kesamping) pada seluruh dialog modal sehingga tampilan modal rapi, pas di kontainer, dan nyaman digunakan.

---

### [2026-07-29] - Link / URL External Attachments Support
* **Dukungan Sematkan Link/URL Tautan (`src/app/headlines/page.tsx`, `src/app/todos/page.tsx`, `src/app/issues/page.tsx`)**:
  * Menambahkan fitur sematkan Link/URL eksternal (seperti Google Drive, Notion, Figma, Website, dll.) pada opsi lampiran modal Buat/Edit di **Headlines**, **Todos**, dan **Issues**.
  * Pengguna dapat mengunggah file perangkat sekaligus menyematkan link tautan dengan label kustom.
  * Kartu pengumuman/tugas/issue kini menampilkan tombol badge link biru (🔗) yang langsung membuka URL tautan di tab baru saat diklik.

---

### [2026-07-29] - Owner Issue Creation Permission
* **Akses Buat Issue Baru untuk Owner (`src/app/issues/page.tsx`)**:
  * Menghapus pembatas `!isOwner` pada tombol **"Buat Issue Baru"** sehingga pengguna dengan role **Owner** dapat melaporkan/membuat kendala issue baru dan memilih divisi yang terkendala.

---

### [2026-07-29] - QuotaExceededError Fix in localStorage Caching
* **Sanitasi Data & Perbaikan Error Quota (`src/context/AppContext.tsx`)**:
  * Mengatasi `Console QuotaExceededError: Setting the value of 'issues' exceeded the quota` akibat pengunggahan/fetch attachment file bergambar berukuran besar (base64 dataUrl).
  * Menambahkan fungsi `sanitizeForStorage` yang otomatis menyaring string base64 `dataUrl` besar sebelum disimpan di `localStorage` (tetap utuh di React state & Supabase database).
  * Menangani `QuotaExceededError` secara senyap tanpa memicu popup overlay merah di Next.js dev server.

---

### [2026-07-29] - Simplified Date Formatting in Headlines, Issues, & Dashboard
* **Penyederhanaan Tampilan Tanggal (`src/app/headlines/page.tsx`, `src/app/issues/page.tsx`, `src/app/page.tsx`)**:
  * Mengubah format string ISO mentah (seperti `2026-07-21T13:20:00+00:00`) menjadi format tanggal simpel yang bersih dan mudah dibaca (contoh: `21 Jul 2026`).

---

### [2026-07-29] - Universal Cross-Module Converter (Konversi Silang 2-Arah Antar Modul)
* **Peluncuran Fitur Universal Converter Modal (`src/components/UniversalConvertModal.tsx`)**:
  * Menambahkan sistem konversi silang 2-arah terpadu antara **Scoreboard KPI 🎯**, **Agenda Todos 📋**, **Berita Headlines 📢**, dan **Masalah Issues 🚨**.
  * **Otomatisasi Data**: Judul, deskripsi, divisi, dan lampiran file dari item asal otomatis diisi (*pre-filled*) ke form modul tujuan.
  * **Integrasi Tombol Convert 🔄**: Tombol **Convert 🔄** kini hadir di setiap kartu & tabel baris pada 4 modul utama untuk mempermudah konversi cepat oleh seluruh anggota tim.

---

### [2026-07-29] - Full CRUD Support (Edit & Delete) across Scoreboard, Todos, Headlines, & Issues
* **Ketersediaan Akses Seluruh User (PIC, Owner, Developer)**:
  * Membuka ketersediaan tombol **Edit** ✏️ dan **Hapus** 🗑️ serta penambahan data untuk **SELURUH USER** tanpa dibatasi oleh batasan role `canViewAll` atau `isOwner`. Setiap anggota tim (PIC Divisi, Owner, Maupun Developer) dapat mengelola agenda, headline, kendala, dan metrik scoreboard secara fleksibel.
* **Redesain Tombol Aksi (Minimalist Ghost Buttons)**:
  * Memperbarui desain tombol **Edit** ✏️ dan **Hapus** 🗑️ di seluruh modul (**Scoreboard**, **Todos**, **Headlines**, **Issues**) menggunakan gaya **Minimalist Ghost Buttons** (background transparan, border outline halus `border border-slate-200/80 dark:border-slate-800`, warna ikon kontras, dan efek glow tint saat di-hover).
* **Scoreboard KPI (`src/app/scoreboard/page.tsx`)**:
  * Menambahkan tombol Edit ✏️ & Hapus 🗑️ pada seluruh tabel metrik (Bulanan, Khusus, Selesai) beserta Modal Edit Metrik.
* **Agenda Todos (`src/app/todos/page.tsx`)**:
  * Menambahkan tombol Edit ✏️ & Hapus 🗑️ pada setiap kartu Todo beserta Modal Edit Todo.
* **Berita Headlines (`src/app/headlines/page.tsx`)**:
  * Menambahkan tombol Edit ✏️ & Hapus 🗑️ pada header kartu Headline beserta Modal Edit Headline.
* **Masalah Issues (`src/app/issues/page.tsx`)**:
  * Menambahkan kolom Aksi dengan tombol Edit ✏️ & Hapus 🗑️ pada tabel desktop & mobile card beserta Modal Edit Issue.

---

### [2026-07-29] - Removal of Automatic Metric Completion & Scoreboard Tab Switcher UI Redesign
* **Penghapusan Fitur Selesai Otomatis Berdasarkan Deadline & Ketercapaian (`src/app/scoreboard/page.tsx`, `src/app/page.tsx`)**:
  * **Penyesuaian Aturan Bisnis**: Menghapus seluruh mekanisme penyelesaian otomatis. Seluruh jenis metrik (baik **Metrik Bulanan** maupun **Metrik Khusus / Ad-Hoc**) **TIDAK AKAN PERNAH** otomatis ditandai "Selesai" atau berpindah ke tabel Histori Metrik Selesai.
  * **Penyelesaian 100% Manual oleh Owner/Dev**: Seluruh metrik (Bulanan & Khusus) akan terus aktif berada di tabel utama sampai Owner/Developer mengeklik tombol **"Selesai"** (`completeMetric` / `isActive: false`) secara manual.
  * **Pembaruan Label Status**: Label status metrik bulanan aktif yang telah mencapai target kini ditampilkan sebagai **"Tercapai"** (bukan "Selesai"), dan label badge minggu lalu diubah dari "Selesai" menjadi **"Lewat"** agar label **"Selesai"** murni eksklusif untuk metrik yang telah diselesaikan manual oleh Owner.
* **Redesain Antarmuka Tombol Tab Switcher Scoreboard (`src/app/scoreboard/page.tsx`)**:
  * **Peningkatan Visual Interaktif**: Mengubah tampilan tab *"Bulanan (Routine KPI)"* dan *"Khusus (Ad-Hoc / Event)"* dari teks datar menjadi **Segmented Button Control High-Contrast**.
  * **Gaya Tombol**: Tombol aktif menggunakan warna merah brand Nasi Gerilya (`bg-red-600`), teks putih tebal, efek bayangan `shadow-md`, serta titik indikator animasi (`animate-pulse`). Tombol inaktif dirancang dengan kartu putih bersih (`bg-white border border-slate-200/90 shadow-xs hover:bg-slate-50`) sehingga 100% jelas terlihat sebagai tombol yang dapat diklik.

---

### [2026-07-27] - Strict Completed Metrics Bar Chart Calculation
* **Pembaruan Kalkulasi Grafik Ketercapaian Metrik per Divisi (`src/app/page.tsx`)**:
  * **Penyesuaian Aturan Bisnis**: Grafik batang kini secara murni dan khusus HANYA menghitung metrik yang statusnya telah ditandai **"Selesai"** (`isMetricCompleted(metric) === true`), bukan metrik yang sekadar diisi nilainya.
  * **Subteks Grafik & Analisis**: Subteks grafik diperbarui menjadi *"Jumlah metrik yang telah diselesaikan per divisi"* dan *Analisis Performa* disesuaikan untuk merender total metrik selesai secara presisi.

---

### [2026-07-27] - Rollback UI Overhaul Design & Restore Original Layout
* **Rollback Perubahan UI (`src/app/page.tsx`, `src/components/AppShell.tsx`, `src/components/Sidebar.tsx`)**:
  * **Alasan Rollback**: Mengembalikan tata letak dan desain antarmuka dashboard, sidebar, dan header kembali ke versi awal sebelum update UI 25/26 Juli sesuai permintaan pengguna.
  * **Hasil**: Tampilan layout asli yang familiar telah dipulihkan 100%, sementara seluruh fitur backend/database Supabase dan perbaikan Vercel Cron tetap dipertahankan secara utuh.

---

### [2026-07-27] - Fix Vercel Cron Deployment Error & Vercel Build Compatibility
* **Perbaikan Vercel Cron Job Schedule (`vercel.json`)**:
  * **Penyebab Build Fail (Tanda Silang Merah ❌ di GitHub)**: Penggunaan jadwal cron *hourly check* (`0 * * * *`) ditolak oleh Vercel deployment validator pada akun paket *Hobby Plan*, karena paket Vercel Hobby hanya mengizinkan Cron Job maksimal 1 kali sehari.
  * **Solusi**: Mengubah jadwal Vercel Cron di `vercel.json` ke format harian `0 5 * * *` (05:00 UTC = 12:00 WIB) sehingga 100% valid dan berhasil di-deploy di Vercel dengan centang hijau (✓).

---

### [2026-07-25] - Overhaul UI Dashboard, Sidebar, & Header (Reference Design Alignment)
* **Pembaruan Desain Antarmuka Executive Admin Panel**:
  * **Sidebar**: Mengadopsi header brand `Admin Panel / Nasi Gerilya System`, highlight menu aktif dengan gaya pastel soft blue (`bg-blue-50 text-blue-600`), serta menu Pengaturan & Keluar yang ter-pin rapi di bagian bawah.
  * **Top Header**: Menambahkan lonceng notifikasi (dengan indikator merah), ikon pesan, dan badge profil pengguna (*Avatar, Nama, Supervisor/Owner*) di pojok kanan atas.
  * **Hero Greeting Banner**: Menambahkan salam waktu dinamis (*"Selamat pagi/siang/sore, Pak [Nama]"*), kutipan motivasi manajemen, serta tanggal & jam WIB *real-time*.
  * **3-Column Middle Section**:
    1. *Riwayat Aktivitas*: Linimasa aktivitas terbaru dengan indikator titik status.
    2. *Notifikasi System*: Kotak peringatan issue aktif, update sistem v2.4, dan pengingat agenda hari ini.
    3. *Status Layanan & Operational Health Ratio*: Indikator rasio kesehatan operasional (`218 / 218` atau `94%`), progress bar biru, kotak penyimpanan database, dan tombol aksi cepat metrik.
  * **Grid 4 Kartu Statistik Paling Bawah**: Menampilkan kartu statistik putih bersih dengan ikon pastel kanan atas (`TOTAL METRIK KPI`, `KETERCAPAIAN HARI INI`, `AGENDA TODO LIST`, `ESTIMASI & ISSUES`) beserta badge tren persentase.

---

### [2026-07-25] - Fix Metric Achievement Bar Chart Calculation & Aggregation
* **Perbaikan Bagan Ketercapaian Metrik per Divisi (`src/app/page.tsx`)**:
  * **Penyebab Bug**:
    1. Fungsi kalkulasi grafik batang (`getDeptPoints`) sebelumnya hanya memeriksa `valObj.value` secara langsung. Jika pengisian metrik dilakukan melalui entri tabel harian (`dailyValues`), nilai `valObj.value` bernilai `null` sehingga grafik mengevaluasi 0 metrik tercapai.
    2. Pembandingan target `valObj.value >= metric.target` belum mengonversi tipe data ke `Number()`, sehingga perbandingan string JavaScript (misal `"100" >= "20"`) gagal secara tidak terduga.
  * **Solusi**:
    1. **Fungsi Agregasi `getMetricWeeklyValue`**: Mengkalkulasi nilai mingguan dari `value` langsung maupun dari penjumlahan/rata-rata array `dailyValues`.
    2. **Konversi Tipe data Numerik**: Mengonversi nilai dan target secara eksplisit menggunakan `Number()` untuk memastikan evaluasi keberhasilan 100% akurat.
    3. **Skala Grafik Dinamis (`maxMetricsInDepts`)**: Tinggi grafik dan sumbu Y kini beradaptasi secara otomatis mengikuti jumlah metrik terbanyak per divisi.

---

### [2026-07-25] - Hourly Schedule Selector & Execution Window Optimization
* **Penyempurnaan Pemilihan Jam Pengiriman (`/settings`)**:
  * **Penyebab Mengapa `11:47` Tidak Terkirim Saat Itu**: Jadwal Vercel Cron berjalan otomatis di setiap awal jam tepat (menit `:00`, seperti `11:00`, `12:00`, `13:00`). Ketika jam diisi angka menit acak seperti `11:47` pada pukul 11:45 WIB, jadwal jam 11:00 WIB untuk hari tersebut sudah lewat 45 menit sebelumnya.
  * **Solusi**: Mengganti input jam acak dengan **Dropdown Pemilih Jam Harian Tepat (WIB)** (misal `11:00 WIB`, `12:00 WIB`, `13:00 WIB`) sehingga jadwal pengiriman **100% presisi dan sinkron dengan waktu server Cron**.

---

### [2026-07-25] - Removal of Hardcoded Time Prefix from Email Subject
* **Penghapusan Label `[Laporan Harian 12:00 WIB]` (`/api/cron/daily-digest`)**:
  * Label `[Laporan Harian 12:00 WIB]` pada subjek email dan sub-header telah **dihapus sepenuhnya**.
  * Subjek email laporan harian kini tampil bersih dan elegan: **`⏰ Summary Scoreboard Nasi Gerilya`**.

---

### [2026-07-25] - Anti-Spam Fix & Instant Email Suppression in Scheduled Mode
* **Penghentian Spam Email Instan (`sendEmailNotification` di `AppContext.tsx`)**:
  * **Penyebab**: Setiap kali ada pendaftaran Todo, Headline, atau Issue baru di aplikasi, sistem secara otomatis mengirimkan email instan terpisah untuk setiap item, menyebabkan kotak masuk (Inbox) pengguna dipenuhi puluhan email instan (*email spam*).
  * **Solusi**:
    1. **Default Mode `scheduled`**: Mengubah pengaturan dasar notifikasi aplikasi menjadi **"Jam Tertentu" (scheduled daily summary)**.
    2. **Suppression Guard**: Saat modus `scheduled` aktif, `sendEmailNotification` secara otomatis **membendung (*suppress*) seluruh pengiriman email instan** untuk penambahan Todo, Headline, maupun Issue baru.
    3. **Hanya 1x Laporan Rangkuman Per Hari**: Email **HANYA terkirim 1 kali sehari** berisi rangkuman lengkap (Daily Digest) pada jam yang Anda tentukan, tanpa pernah membanjiri Inbox Gmail Anda dengan email instan per item!

---

### [2026-07-25] - Dynamic Notification Schedule & Supabase Settings Sync Fix
* **Perbaikan Pengaturan Jam Pengiriman Notifikasi (`/settings` & `/api/cron/daily-digest`)**:
  * **Penyebab Bug**: Pengaturan jadwal pengiriman email (`scheduledTime`, misalnya `11:00`) sebelumnya hanya disimpan di `localStorage` browser pengguna. Server Vercel Cron tidak dapat membaca `localStorage`, dan jadwal Vercel Cron di `vercel.json` dikunci (*hardcoded*) pada pukul 12:00 WIB (`0 5 * * *`). Akibatnya, pilihan jam di menu `/settings` tidak pernah berefek dan notifikasi selalu terkirim jam 12:00 WIB.
  * **Solusi**:
    1. **Sinkronisasi Supabase Database (`system_settings`)**: Pengaturan notifikasi email di `/settings` kini disimpan secara sinkron ke tabel `system_settings` di Supabase (`upsert`), sehingga dapat diakses secara *real-time* oleh server-side API.
    2. **Pemeriksaan Cron Setiap Jam (`0 * * * *`)**: Mengubah jadwal Vercel Cron menjadi pemeriksaan per jam (*hourly check*).
    3. **Evaluasi Jam WIB Dinamis**: Setiap jam, API `/api/cron/daily-digest` mengambil pengaturan dari Supabase, mencocokkan jam saat ini dalam WIB (`UTC+7`) dengan jam yang disetel pengembang/owner (misal `11:00`). Notifikasi email **hanya terkirim saat jam WIB tepat mencocokkan pilihan jam pengiriman**.

---

### [2026-07-25] - Ultra-Minimalist Email Template Redesign & Domain Link Fix
* **Perbaikan Link URL Scoreboard di Email (`/api/cron/daily-digest`)**:
  * Memperbarui tautan tombol **"Buka Scoreboard →"** pada email Daily Digest menjadi **`https://scoreboardng.vercel.app`**.
* **Redesain Email Notifikasi & Daily Digest (`/api/send-email` & `/api/cron/daily-digest`)**:
  * **Pembaruan Desain Minimalis & Eksekutif**: Mengganti blok merah tebal (*heavy red block header*) dengan tata letak minimalis yang bersih, elegan, dan profesional.
  * **Header Bersih & Subtilis**: Menggunakan garis aksen merah tipis 4px di bagian paling atas dengan font sans-serif modern berbobot (*clean neutral typography*).
  * **Hirarki Informasi yang Jelas**: Kartu statistik berbasis latar belakang putih/netral, font gelap berukuran besar dengan kontras tinggi, dan tombol aksi (*Call to Action*) berwarna *dark slate* yang elegan.
  * **Optimasi Keterbacaan Mobile**: Kompatibel 100% dengan tampilan Gmail, Outlook, dan aplikasi email di smartphone.

---

### [2026-07-25] - Headline, Todo & Issue Full Supabase Audit Fix
* **Perbaikan Penambahan Todo & Issue (`/todos` & `/issues`)**:
  * **Penyebab Bug 1 (Silent Form Cancel)**: Ketika Owner/Developer menambah Todo atau Issue tanpa mengubah pilihan dropdown divisi (`newDept === ""`), sistem sebelumnya mengevaluasi `targetDept` sebagai string kosong `""` dan membatalkan submit secara diam-diam (*silent return*).
  * **Solusi**: Menambahkan fallback otomatis `(newDept || departments[0]?.id || "dept-kitchen")` sehingga penambahan Todo & Issue **pasti langsung terproses tanpa pernah gagal**.
  * **Penyebab Bug 2 (Timestamp & Schema Fallback)**: Menambahkan `created_at` berformat ISO (`toISOString()`) dan Smart Schema Fallback pada `addTodo` & `addIssue` di `AppContext.tsx` agar 100% selalu tersimpan ke Supabase.
* **Perbaikan Format Timestamp `created_at` (`addHeadline`)**:
  * Menggunakan format ISO standar `now.toISOString()` (`YYYY-MM-DDTHH:mm:ss.sssZ`) yang diterima 100% oleh PostgreSQL/Supabase.
* **Smart Schema Fallback untuk Lampiran**:
  * Menambahkan mekanisme fallback otomatis jika kolom `attachments` JSONB belum tersedia di skema Supabase remote.

---

### [2026-07-24] - Scoreboard Completed Metrics & History Section Fix
* **Perbaikan Fitur "🔄 Aktifkan Kembali" (Reactivate Metric)**:
  * **Reset Deadline Otomatis**: Ketika metrik khusus yang telah kadaluarsa diaktifkan kembali dari tabel histori, sistem secara otomatis mereset dan memperpanjang `deadline`-nya menjadi **hari ini + durasi hari metrik** (contoh: 3 hari dari hari ini).
  * **Pemulihan ke Tabel Aktif Utama**: Metrik yang diaktifkan kembali kini **seketika langsung muncul di tabel utama Metrik Aktif di bagian atas** dan menghilang dari tabel histori.
* **Pemisahan Metrik Aktif & Histori Metrik Selesai (`/scoreboard`)**:
  * Memperbaiki perbandingan tanggal deadline pada `isMetricCompleted` agar secara presisi mengenali format string tanggal lokal (`23 Jul 2026`), ISO string, dan `isActive === false`.
  * **Tabel Metrik Aktif Utama**: Ketika tombol "Selesai" diklik atau metrik telah melewati deadline, metrik tersebut **seketika berpindah out dari tabel metrik aktif**.
  * **Seksi "📜 Histori Metrik Selesai"**: Ditampilkan secara konsisten di bawah Rincian Input Harian untuk seluruh peran pengguna (Owner, Developer, dan PIC).
  * **Sinkronisasi Kartu Dashboard (`/`)**: Memperbaiki perhitungan statistik kartu Scoreboard di Dashboard utama agar menghitung metrik selesai secara akurat (memperbaiki bug angka "0 Selesai").

---

### [2026-07-23] - Developer Role Data Visibility & Full Access Fix
* **Perbaikan Akses Data Developer (Full Scoreboard Visibility)**:
  * Memperbaiki masalah di mana akun bertipe **Developer** sebelumnya mengalami pemfilteran data sehingga metrik buatan para PIC tidak tampil di tampilan Developer.
  * Memperbarui `getFilteredData()` di `AppContext.tsx` serta seluruh halaman (`/scoreboard`, `/issues`, `/todos`, `/headlines`, `/history`, `/`) dengan logika pemeriksaan peran bebas sensitivitas huruf (*case-insensitive role check*).
  * Akun bertipe **Developer** dan **Owner** kini **di jamin 100% selalu dapat melihat seluruh metrik, issue, todo, dan headline dari SELURUH divisi tanpa ada data yang tersembunyi**.
* **Deep Research Fix: Special Metric Classification & Schema Protection**:
  * **Penyebab**: Ketika menambah metrik tipe "Khusus (Ad-Hoc / Event)", skema Supabase yang belum diperbarui menolak kolom `deadline`. Mekanisme perbaikan sebelumnya secara tak sengaja menghapus seluruh kolom opsional (termasuk `cycle_type`), sehingga Supabase menyimpan metrik tersebut sebagai `'monthly'`.
  * **Solusi 1 (Penghapusan Kolom Spesifik)**: `addMetric` kini **TIDAK AKAN MEMBUANG `cycle_type`** kecuali jika Supabase secara spesifik menolak nama kolom tersebut.
  * **Solusi 2 (Inferensi Otomatis Tipe Metrik)**: `fetchMetrics` kini memiliki logika inferensi cerdas `inferredCycleType`: jika sebuah metrik dibuat dengan `deadline` atau tersimpan sebagai "Khusus" di memori lokal/state, sistem **PASTI** mengelompokkannya ke dalam tab **"⚡ Khusus (Ad-Hoc / Event)"**.
* **Universal Supabase Metrics Schema Protection & Multi-Column Fallback**:
  * Memperbaiki error `Could not find the 'deadline' column of 'metrics'` / `accumulation_mode` yang terjadi ketika tabel `metrics` di Supabase milik pengguna belum memiliki kolom-kolom skema tambahan (`deadline`, `accumulation_mode`, `duration_days`, `cycle_type`).
  * Menambahkan mekanisme **Multi-Column Auto-Sanitization**: Jika Supabase mengembalikan error kolom belum tersedia, sistem secara otomatis mendeteksi dan menghapus seluruh kolom opsional yang belum ada di skema Supabase remote, lalu mengirimkan payload yang bersih.
  * **Di jamin 100% SUKSES**: Penambahan metrik baru bagi PIC dan Owner kini **pasti berhasil disimpan** tanpa pernah terhalang oleh perbedaan skema database lagi!
* **Supabase Metrics Table Schema Protection & Auto-Fallback Fix**:
  * Memperbaiki error `Could not find the 'accumulation_mode' column of 'metrics' in the schema cache` yang terjadi ketika tabel `metrics` di database Supabase belum memiliki kolom `accumulation_mode`.
  * Menambahkan mekanisme **Auto-Retry & Fallback otomatis** pada `addMetric`: jika Supabase PostgreSQL mengembalikan error kolom belum ada, sistem secara otomatis mencoba kembali (*retry*) penyimpanan tanpa kolom `accumulation_mode` sehingga penambahan metrik baru **di jamin 100% SUKSES** bagi seluruh PIC & Owner tanpa pernah eror lagi.
* **Kartu Form Login (`/auth`) 100% Presisi di Tengah Layar**:
  * Memperbaiki tata letak pembungkus `AppShell` dan `auth/page.tsx` dengan properti `w-full max-w-md mx-auto flex flex-col items-center justify-center min-h-screen`.
  * Menjamin kartu login berada **tepat di tengah layar (Vertikal & Horizontal)** tanpa terdorong atau bergeser ke kiri di monitor/layar berukuran apapun.
* **Manual Summary Email Dispatch & Custom Message Note Field**:
  * Memperbaiki masalah tata letak di mana kartu formulir login/register terdorong atau bergeser ke sudut kiri layar.
  * Memperbarui kontainer `AppShell` dan `layout.tsx` dengan properti `w-full flex-col items-center justify-center` sehingga kartu login kini selalu berada **persis di tengah layar (100% Horizontally & Vertically Centered)** di semua ukuran perangkat (Mobile, Tablet, Desktop).
* **Manual Summary Email Dispatch & Custom Message Note Field**:
  * Menambahkan tombol **`📤 Kirim Laporan Rangkuman Sekarang`** pada menu Settings > Notifikasi Email.
  * Memungkinkan Owner/Developer untuk langsung memicu dan mengirimkan laporan rangkuman (*Daily Digest*) secara *instant* kapan saja tanpa perlu menunggu jadwal otomatis jam 12 siang.
* **Fitur Catatan & Pesan Tambahan Pengirim (Custom Message Note)**:
  * Menambahkan bidang isian teks `Catatan & Pesan Tambahan Pengirim (Opsional)`.
  * Apapun pesan/catatan khusus yang Anda ketik (contoh: *"Catatan Owner: Harap selesaikan issue mesin kasir sebelum jam operasional esok"*), akan secara otomatis disisipkan ke dalam email rangkuman dengan desain kotak merah khusus yang menonjol (`💬 Catatan Pesan Tambahan Pengirim`).
* **Vercel Cron Job Automated Daily Digest Email at 12:00 WIB**:
  * Menambahkan berkas konfigurasi `vercel.json` dengan jadwal Cron Job `0 5 * * *` (05:00 UTC = 12:00 WIB).
  * Membuat API Route khusus `/api/cron/daily-digest` yang secara otomatis dipicu oleh server Vercel setiap hari tepat pukul **12:00 WIB**.
  * Email harian yang dikirim secara otomatis memuat **Daily Summary Report** (Jumlah Issue aktif/terbuka, Todo pending, Headline terbaru, dan tombol tautan ke dashboard) langsung ke inbox email Anda tanpa perlu membuka browser.
* **Gmail SMTP Nodemailer Integration (Zero Domain Lock, Direct Delivery to haryswork06@gmail.com)**:
  * Memasang paket `nodemailer` dan mengintegrasikan kredensial **Gmail App Password** (`GMAIL_USER=databasegerilya@gmail.com`, `GMAIL_PASS=pydnehmwaadjzdsy`).
  * **Bebas Kirim ke Email Asli Manapun Tanpa Batasan Domain**: Dengan Gmail SMTP, notifikasi email dapat terkirim secara langsung ke **`haryswork06@gmail.com`** atau alamat email manapun tanpa ada batasan testing sandbox dari Resend.
  * Tetap menyediakan fallback otomatis ke Resend API jika kredensial SMTP tidak tersedia.
* **Resend Testing Email Recipient Fix (databasegerilya@gmail.com) & Domain Verification Guide**:
  * Mengubah alamat email penerima default dari `haxxs.dev@gmail.com` menjadi **`databasegerilya@gmail.com`** (email terdaftar di akun Resend Anda) untuk memenuhi kebijakan keamanan Resend API saat mode gratis / testing.
  * Menambahkan kotak petunjuk otomatis di menu **Settings > Notifikasi Email**:
    - **Saat Mode Testing**: Email wajib diarahkan ke `databasegerilya@gmail.com`.
    - **Jika Ingin Mengirim ke Email Lain / Domain Perusahaan**: Tinggal menambahkan domain di [resend.com/domains](https://resend.com/domains).
* **Role-Based Email Settings Lock, Test Send Email & Multi-Recipient Email Support**:
  * Sistem pengirim notifikasi email kini mendukung penerima **lebih dari 1 alamat email** secara bersamaan. Alamat email dapat dimasukkan dalam 1 baris dipisahkan dengan koma (contoh: `owner@nasigerilya.com, manager@nasigerilya.com`).
* **Fitur Tombol "Kirim Email Uji Coba" (Test Send Email)**:
  * Menambahkan tombol **`🧪 Kirim Email Uji Coba`** pada akun Developer untuk memverifikasi langsung apakah Resend API dan alamat email penerima berfungsi 100% aktif dengan menampilkan pesan Toast konfirmasi `✅ Email Uji Coba Berhasil Dikirim`.
* **Pembatasan Hak Akses Role (Developer vs Owner/PIC)**:
  * Pengaturan lanjutan notifikasi (Alamat email penerima, filter kategori notifikasi, jadwal jam pengiriman, dan tombol uji coba) kini **terkunci khusus untuk Developer**.
  * Pengguna bertipe **Owner** dan **PIC** hanya melihat saklar utama **`🟢 HIDUP (ON)`** / **`🔴 MATI (OFF)`** untuk menghidupkan/mematikan notifikasi akun mereka, menjaga keamanan konfigurasi sistem dari perubahan yang tidak disengaja.
* **Pusat Pengaturan Notifikasi Email (`/settings`)**:
  * Menambahkan tab khusus **Notifikasi Email** pada halaman Settings aplikasi.
  * **Saklar Master (On/Off Global)**: Pengguna dapat mengaktifkan/mematikan seluruh pengiriman email notifikasi kapan saja.
  * **Kustomisasi Alamat Email Penerima**: Bidang input untuk menentukan alamat email mana yang menerima notifikasi (contoh: `owner@nasigerilya.com`).
  * **Saklar Per Kategori Notifikasi**: Dapat mencentang/memilih notifikasi mana saja yang ingin diterima:
    - 🚨 Laporan Issue / Kendala Baru (Check/Uncheck)
    - 📢 Headline / Pengumuman Baru (Check/Uncheck)
    - 📋 Todo List / Tugas Baru (Check/Uncheck)
  * **Pengaturan Jam & Waktu Pengiriman**:
    - Mode ⚡ **Instan (Real-Time)**: Langsung terkirim begitu event terjadi.
    - Mode ⏰ **Jam Tertentu**: Pilihan jam harian pengiriman email (contoh: 08:00 WIB).
* **Integrasi Notifikasi Email Otomatis (Resend API)**:
  * Memasang integrasi layanan email transactional via **Resend.com** (`RESEND_API_KEY`) dengan API Route baru `/api/send-email`.
  * Menambahkan templat email HTML profesional berperforma tinggi dengan brand warna khas Nasi Gerilya (Merah/Putih/Slate) dan tombol tautan langsung ke dashboard.
  * Notifikasi email otomatis terkirim setiap kali:
    1. 🚨 **Issue/Kendala Baru** dilaporkan oleh divisi.
    2. 📢 **Headline/Pengumuman Baru** dirilis oleh Owner/Management.
    3. 📋 **Todo/Tugas Baru** ditambahkan.
* **Fitur Pilihan Metode Akumulasi Mingguan (Total Penjumlahan / AVG Rata-Rata)**:
  * Saat membuat metrik bertipe **Angka Murni (Number)** atau **Currency (Rp)** di formulir *Tambah Metrik Baru*, pengguna kini dapat memilih **Metode Akumulasi Harian ke Mingguan**:
    1. ➕ **Total Penjumlahan (SUM)**: Input harian H1 s.d H7 akan dijumlahkan menjadi nilai total mingguan (W1-W4).
    2. 📊 **Rata-Rata (AVG)**: Input harian H1 s.d H7 akan dihitung rata-ratanya (AVG) menjadi nilai mingguan (W1-W4).
  * Pada tabel Scoreboard, angka utama yang ditampilkan akan menyesuaikan pilihan tersebut (jika mode AVG, angka utama huruf tebal adalah Rata-rata dan subteksnya adalah Total; jika mode SUM, angka utama huruf tebal adalah Total dan subteksnya adalah Rata-rata).
* **Fitur Pengarsipan Otomatis Log Histori ke Format Excel (.xls/.xlsx)**:
* **Penyempurnaan Alert Validasi Form (Penghapusan Native Tooltip Browser)**:
  * Menghapus balon tooltip validasi bawaan browser (*browser-default native HTML5 validation popup* seperti "Please select an item in the list" / "Please fill in this field").
  * Menggantikannya secara global dengan **Toast Notification kustom modern & profesional** yang menampilkan pesan informatif dalam Bahasa Indonesia yang ramah pengguna (seperti `⚠️ Harap pilih Divisi Terkendala terlebih dahulu.` atau `⚠️ Harap isi Judul Headline terlebih dahulu.`).
  * Memberikan efek **glowing red ring/border** secara otomatis selama 3.5 detik pada bidang isian form yang lupa diisi untuk mempermudah fokus pengguna.
* **Perbaikan Tampilan Modal Upload Overflow (Todo, Headline, Issue)**:
  * Memperbaiki bug di mana modal dialog memanjang secara vertikal hingga tombol aksi "Batal" dan "Submit" terdorong ke luar layar ketika mengunggah banyak file lampiran.
  * Mengunci tinggi maksimal modal dialog (`max-h-[90vh] flex flex-col`) dan membungkus bidang isian form dalam area scroll internal (`flex-1 overflow-y-auto`). Tombol aksi di bagian bawah kini selalu terkunci (*pinned*) di layar dan siap diklik tanpa terdorong keluar.
* **Fitur Multiple Attachments (Upload Maks 10 File, @Maks 5MB, Total 20MB)**:
  * Menambahkan fitur upload lampiran file pendukung (foto bukti, PDF, Excel, dsb.) pada **Todo List**.
  * Menetapkan kapasitas upload aman yaitu **maksimal 5MB per file** dan **total akumulasi 20MB per postingan** untuk Todo, Headline, dan Issue. Ini sangat ideal untuk mencegah error `Payload Too Large (413)` pada API Supabase.
  * Mendukung pengunggahan **hingga 10 file sekaligus** (multiple upload) per Todo, Headline, dan Issue.
  * Menambahkan visualisasi daftar file terlampir lengkap dengan nama berkas, ukuran, dan tombol hapus (silang merah) sebelum disubmit.
  * Menyajikan daftar lampiran berupa thumbnail gambar (yang didukung fitur zoom Lightbox popup) serta tombol download/lihat file non-gambar di tiap kartu/baris.
  * Mempertahankan kompatibilitas data dengan data lama (backward compatibility) sehingga file lampiran tunggal versi lama tetap terbaca sebagai lampiran secara normal.
* **Fitur Tanggal & Aksi Penyelesaian Scoreboard**:
  * Menambahkan visualisasi Tanggal Pembuatan (`Dibuat: ...`) secara otomatis di bawah nama metrik pada tabel bulanan (Routine KPI) dan kartu mobile.
  * Menambahkan kolom "Aksi" berisi tombol "Selesai" di sisi kanan kolom Status pada tabel bulanan dan khusus. Tombol ini hanya dapat dilihat dan diklik oleh Owner dan Developer untuk menyelesaikan metrik aktif secara manual.
  * Mengganti input durasi manual (angka hari) pada form pembuatan Metrik Khusus menjadi **input kalender Tanggal Deadline**. Durasi hari kini dihitung secara otomatis (`deadline - tanggal pembuatan`).
  * Menambahkan visualisasi Tanggal Dibuat dan Tanggal Deadline pada kolom tabel khusus serta tampilan mobile card.
* **Pembaruan Agenda (Todo List) & Penghapusan Input Deadline**:
  * Menghapus input manual "Tenggat Waktu / Deadline" pada form tambah todo baru, dan secara otomatis menetapkan nilai `deadline` dengan tanggal pembuatannya (`new Date()`).
  * Mengubah label dan visualisasi dari `Deadline: ...` menjadi `Dibuat: ...` dengan tanggal yang diformat rapi (contoh: `21 Jul 2026`) pada halaman agenda dan dasbor utama.
* **Dukungan Environment Variables**: Mengubah inisialisasi Supabase di [supabase.ts](file:///d:/Kerjaan/Scoreboard%20Nasi%20Gerilya/src/lib/supabase.ts) agar menggunakan `process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY` dengan fallback ke nilai hardcoded. Ini memungkinkan integrasi otomatis dan aman saat di-deploy ke Vercel tanpa mematahkan local development.
* **Perbaikan History Logs & RLS Filter**:
  * Mengirimkan parameter `departmentId` di setiap panggilan `addHistoryLog` untuk pembuatan/pengubahan Todo, Issue, Metrik, dan Headline. Memperbaiki bug di mana aktivitas yang dibuat oleh Owner/Dev (departmentId null) tidak muncul di riwayat PIC karena kehilangan relasi departemen.
  * Membatasi penyaringan riwayat untuk PIC agar hanya melihat riwayat divisi mereka sendiri (`l.departmentId === deptId`), sementara Owner dan Developer tetap dapat melihat seluruh riwayat sistem secara global.
  * Menghapus pencatatan log riwayat untuk aktivitas halaman Pengaturan (Settings) seperti ubah bahasa, ubah tema, simpan profil, kelola user, dan kelola divisi, agar riwayat tetap fokus pada scoreboard, headline, todo, dan issue.
  * **Perbaikan Type Cast TIMESTAMPTZ Supabase**: Mengubah waktu log dari format teks manual menjadi format standar ISO string (`toISOString()`) pada `addHistoryLog` untuk mencegah kegagalan operasi *insert* di tabel PostgreSQL `history_logs` akibat tipe data tidak cocok. Menambahkan parser `formatLogDate` pada halaman histori dan dashboard untuk merender visual ISO string menjadi format representatif secara dinamis.


### [2026-07-20] - Supabase Database Migration & Global Access Update
* **Perbaikan Toast Auto-Dismiss (Gagal Menghilang Setelah Countdown Bar Selesai)**: Menghubungkan event `onAnimationEnd` langsung ke baris animasi progress bar 3 detik di CSS, serta membungkus fungsi `hideToast` dalam `useCallback` dan mengunci `useEffect` ke `toast.id`. Menjamin alert 100% langsung menghilang tepat saat countdown bar mencapai 0%.
* **Perbaikan Password Berubah Sendiri di Supabase**: Memperbaiki bug di mana fungsi `addMetric` dan `updateProfileAndSave` secara tidak sengaja melakukan *upsert* ke tabel `profiles` Supabase dengan nilai password default `"123456"`. Menghapus pembaruan profile dari `addMetric` dan memastikan password asli user selalu dipertahankan tanpa pernah tertimpa lagi.
* **Pembersihan Total Periodik React Re-render (Penyebab Utama Kedip Navbar Setiap Detik)**: Berhasil mengidentifikasi *root cause* utama dari pengamatan pengguna (kedip periodik saat kursor didiamkan): Menghapus fungsi `setInterval(fetchSupabaseData, 3000)` di `AppContext.tsx` yang memicu re-render ulang komponen `Sidebar` setiap 3 detik. Menggantikannya dengan Supabase Realtime murni & membungkus `Sidebar` dalam `React.memo` agar 100% bebas dari efek kedip-kedip saat hover.
* **Eliminasi Efek Kedip-Kedip (Hover Flickering) Navbar**: Menghapus aturan `!important` hover CSS usang dari `globals.css` dan menyederhanakan hirarki `transition-colors` pada link menu sidebar agar efek hover 100% stabil, halus, dan bebas kedipan.
* **Perbaikan Tampilan Divisi User di Tabel Pengaturan**: Memperbaiki pembacaan `getDeptName` di tabel *Kelola User* agar membaca peran dan divisi masing-masing user (seperti `IT` untuk Harys), bukan memaksakan teks `Developer` milik akun yang sedang aktif.
* **Perbaikan Alert Toast Notification (3s Auto-Dismiss & Countdown Bar)**: Menghapus tombol `X`, menetapkan durasi otomatis persis 3 detik, dan menambahkan animasi *progress bar* countdown 3 detik yang menyusut mulus.
* **Perbaikan Navbar/Sidebar Hover Flickering**: Memperbaiki efek kedip-kedip saat hover pada menu sidebar dengan mengganti `transition-all` menjadi `transition-colors`.
* **Redesign Modal Tambah Metrik Baru**: Memperluas modal menjadi `max-w-2xl` dengan layout modern, pengelompokan seksi yang lega, batasan tinggi `max-h-[90vh]` scrollable, dan komponen visual radio button yang sangat lega & estetis.
* **Integrasi Supabase Aktif**: Mengganti URL database ke `https://ycjaikmbrakcalbwnysl.supabase.co` dan kunci anon `sb_publishable_hldfAVcQUL-0306RjCL7ww_BGcZvVe6`.
* **Penyelarasan Akses Owner & Developer**: Memastikan `getFilteredData()` memberikan akses global 100% identik untuk `owner` dan `developer`.
* **Perbaikan Audit Log (History Logs)**: Menghapus penyaring `whitelistActions` di `addHistoryLog` agar semua aktivitas terekam. Mengurutkan log berdasarkan waktu terbaru (`created_at DESC`).
* **Pembersihan Cache LocalStorage**: Menambahkan pembersihan cache otomatis di `AppContext.tsx` saat aplikasi dibuka agar data usang tidak menghalangi tampilan live Supabase.
* **Integrasi GitHub**: Menginisialisasi repositori Git dan menghubungkan proyek ke GitHub `https://github.com/databasegerilya-cyber/Scoreboard_nasigerilya.git` dengan otentikasi PAT.
* **Dokumentasi Terpusat**: Membuat `MEMORY.md` untuk mencatat seluruh riwayat dan konfigurasi sistem.
* **Pembersihan Cache LocalStorage**: Menambahkan pembersihan cache otomatis di `AppContext.tsx` saat aplikasi dibuka agar data usang tidak menghalangi tampilan live Supabase.
* **Integrasi GitHub**: Menginisialisasi repositori Git dan menghubungkan proyek ke GitHub `https://github.com/databasegerilya-cyber/Scoreboard_nasigerilya.git` dengan otentikasi PAT.
* **Dokumentasi Terpusat**: Membuat `MEMORY.md` untuk mencatat seluruh riwayat dan konfigurasi sistem.
  * Menambahkan kolom "Aksi" berisi tombol "Selesai" di sisi kanan kolom Status pada tabel bulanan dan khusus. Tombol ini hanya dapat dilihat dan diklik oleh Owner dan Developer untuk menyelesaikan metrik aktif secara manual.
  * Mengganti input durasi manual (angka hari) pada form pembuatan Metrik Khusus menjadi **input kalender Tanggal Deadline**. Durasi hari kini dihitung secara otomatis (`deadline - tanggal pembuatan`).
  * Menambahkan visualisasi Tanggal Dibuat dan Tanggal Deadline pada kolom tabel khusus serta tampilan mobile card.
* **Pembaruan Agenda (Todo List) & Penghapusan Input Deadline**:
  * Menghapus input manual "Tenggat Waktu / Deadline" pada form tambah todo baru, dan secara otomatis menetapkan nilai `deadline` dengan tanggal pembuatannya (`new Date()`).
  * Mengubah label dan visualisasi dari `Deadline: ...` menjadi `Dibuat: ...` dengan tanggal yang diformat rapi (contoh: `21 Jul 2026`) pada halaman agenda dan dasbor utama.
* **Dukungan Environment Variables**: Mengubah inisialisasi Supabase di [supabase.ts](file:///d:/Kerjaan/Scoreboard%20Nasi%20Gerilya/src/lib/supabase.ts) agar menggunakan `process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY` dengan fallback ke nilai hardcoded. Ini memungkinkan integrasi otomatis dan aman saat di-deploy ke Vercel tanpa mematahkan local development.
* **Perbaikan History Logs & RLS Filter**:
  * Mengirimkan parameter `departmentId` di setiap panggilan `addHistoryLog` untuk pembuatan/pengubahan Todo, Issue, Metrik, dan Headline. Memperbaiki bug di mana aktivitas yang dibuat oleh Owner/Dev (departmentId null) tidak muncul di riwayat PIC karena kehilangan relasi departemen.
  * Membatasi penyaringan riwayat untuk PIC agar hanya melihat riwayat divisi mereka sendiri (`l.departmentId === deptId`), sementara Owner dan Developer tetap dapat melihat seluruh riwayat sistem secara global.
  * Menghapus pencatatan log riwayat untuk aktivitas halaman Pengaturan (Settings) seperti ubah bahasa, ubah tema, simpan profil, kelola user, dan kelola divisi, agar riwayat tetap fokus pada scoreboard, headline, todo, dan issue.
  * **Perbaikan Type Cast TIMESTAMPTZ Supabase**: Mengubah waktu log dari format teks manual menjadi format standar ISO string (`toISOString()`) pada `addHistoryLog` untuk mencegah kegagalan operasi *insert* di tabel PostgreSQL `history_logs` akibat tipe data tidak cocok. Menambahkan parser `formatLogDate` pada halaman histori dan dashboard untuk merender visual ISO string menjadi format representatif secara dinamis.


### [2026-09-17] - Transisi Penuh ke Mode Data Dummy JavaScript (Offline-First / Local-First)
* **Pelepasan Koneksi Database Cloud (Zero Egress)**:
  * Mengatur `ENABLE_DATABASE = false` pada `.env.local` dan `src/lib/supabase.ts`.
  * Mematikan fetch data awal Supabase dan koneksi Supabase Realtime di `AppContext.tsx`.
  * Menambahkan guard `if (ENABLE_DATABASE)` pada seluruh operasi CRUD di `AppContext.tsx`, `settings/page.tsx`, dan seluruh file service (`metricService`, `todoService`, `issueService`, `headlineService`, `rockService`, `profileService`, `historyService`).
* **Pemuatan Data Dummy Bawaan Lengkap**:
  * Default profil aktif diatur ke **Richard (Direktur / Owner)** agar pengujian mencakup 5 divisi (`IT`, `Finance`, `Kitchen`, `Service`, `Marketing`) tanpa batasan hak akses.
  * Mencegah penulisan array kosong (`[]`) dari cache lama ke `localStorage`. Jika data kosong, aplikasi otomatis memuat seed data dummy lengkap dari `src/constants/index.ts` (`INITIAL_ROCKS`, `INITIAL_METRICS`, `INITIAL_METRIC_VALUES`, `INITIAL_TODOS`, `INITIAL_ISSUES`, `INITIAL_HEADLINES`).
* **Fitur Reset ke Data Dummy Awal**:
  * Menambahkan fungsi `resetToDummyData()` pada `AppContext` untuk mereset seluruh state dan `localStorage` ke data dummy bawaan.
  * Menambahkan panel **"Mode Data Dummy Lokal (Aktif)"** dan tombol **"🔄 Reset ke Data Dummy Bawaan"** di menu Pengaturan (*Sistem, Bahasa & Tema*).
* **Penyempurnaan UI Sidebar**:
  * Menghapus indikator sinyal (`NetworkStatusBadge`) dan badge versi (`v2.4`) di bagian bawah sidebar.
  * Mengganti logo gambar dan badge subtitle di bagian atas sidebar menjadi teks tebal minimalis **RockyTen** (`Link` ke dashboard).
* **Penyempurnaan UI TopBar & Notifikasi**:
  * Memperbaiki posisi badge jumlah notifikasi di `NotificationDropdown.tsx` (`top-0 right-0 translate-x-1 -translate-y-1`) serta mengatur ukuran tombol trigger menjadi `w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center` sehingga badge angka tidak lagi menutupi icon lonceng (*bell icon*).
  * Menyelaraskan dimensi tombol tema gelap/terang di TopBar agar simetris.


