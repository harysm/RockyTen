'use strict';

const {
  Paragraph, TextRun, AlignmentType, LineRuleType
} = require('docx');

const {
  CM, FONT, SIZE_BODY, SIZE_HEADING1, SIZE_SUBHEADING, SIZE_TABLE,
  SPACING_15, SPACING_10, INDENT_ALINEA,
  T, TBold, TItalic, TBoldItalic,
  P, PIndent, PCenter, PLeft, PSingle, PEmpty,
  BabTitle, SubBab, SubSubBab,
  ListItem, ListAlpha,
  CaptionTabel, CaptionGambar, FigureBox,
  createStyledTable
} = require('./helpers');

function getBab3Children() {
  return [
    ...BabTitle('BAB III', 'METODE PENELITIAN'),

    SubBab('3.1', 'Gambaran Umum Perusahaan'),

    SubSubBab('3.1.1', 'Sejarah Perusahaan PT Garciafood Nusantara Gemilang'),
    PIndent([
      T('PT Garciafood Nusantara Gemilang merupakan badan usaha swasta yang bergerak di sektor industri kuliner nusantara ('),
      TItalic('food and beverage'),
      T(') yang berkedudukan di Jalan Gg. Rukun No.1, Kelurahan Bantan, Kecamatan Medan Tembung, Kota Medan, Provinsi Sumatera Utara 20223. Perusahaan ini secara resmi didirikan dan dikembangkan oleh wirausahawan visioner, Bapak Richard dan Bapak Kim, dengan komitmen utama menghadirkan sajian kuliner khas Indonesia berkualitas prima melalui merek dagang unggulan '),
      TBold('“Nasi Gerilya”'),
      T('.'),
    ]),
    PEmpty(),
    PIndent([
      T('Filosofi nama "Gerilya" terinspirasi dari semangat juang pantang menyerah, ketangkasan, dan keuletan strategi dalam menembus pasar kuliner yang kompetitif. Sejak awal berdirinya, PT Garciafood Nusantara Gemilang berfokus pada penyajian hidangan nasi berbumbu otentik dengan racikan rempah nusantara pilihan, didukung oleh rantai pasok bahan baku segar dan standar higienitas produksi yang ketat. Seiring dengan peningkatan volume penjualan dan ekspansi basis konsumen di kawasan Medan dan sekitarnya, perusahaan mentransformasi tata kelola operasionalnya dari skala rintisan ('),
      TItalic('startup/booth'),
      T(') menjadi entitas bisnis berbadan hukum perseroan terbatas (PT) dengan struktur organisasi fungsional yang terbagi ke dalam lima divisi utama: Divisi IT, Divisi Keuangan ('),
      TItalic('Finance'),
      T('), Divisi Produksi Dapur ('),
      TItalic('Kitchen'),
      T('), Divisi Pelayanan & Kasir ('),
      TItalic('Service/Floor'),
      T('), serta Divisi Pemasaran & Media ('),
      TItalic('Marketing'),
      T(').'),
    ]),
    PEmpty(),

    SubSubBab('3.1.2', 'Visi Perusahaan'),
    PIndent([
      T('Visi dari PT Garciafood Nusantara Gemilang adalah:'),
    ]),
    PIndent([
      TBoldItalic('“Menjadi perusahaan kuliner nusantara terdepan, terpercaya, dan berdaya saing tinggi di Sumatera Utara yang mengintegrasikan keaslian cita rasa rempah nusantara dengan sistem manajemen modern berbasis teknologi informasi yang akuntabel dan efisien.”'),
    ]),
    PEmpty(),

    SubSubBab('3.1.3', 'Misi Perusahaan'),
    PIndent([
      T('Guna mewujudkan visi strategis tersebut, PT Garciafood Nusantara Gemilang menetapkan lima misi utama operasional sebagai berikut:'),
    ]),
    ListItem('1', [
      T('Menyajikan hidangan kuliner nusantara yang lezat, higienis, halal, dan konsisten mutunya melalui standarisasi resep dan pengawasan kualitas bahan baku yang ketat.'),
    ]),
    ListItem('2', [
      T('Membangun rantai pasok ('),
      TItalic('supply chain'),
      T(') bahan mentah yang andal dan berkesinambungan melalui kemitraan strategis dengan petani dan pemasok lokal di Sumatera Utara.'),
    ]),
    ListItem('3', [
      T('Mentransformasi tata kelola manajemen operasional dan keuangan melalui implementasi sistem informasi berbasis web guna mewujudkan efisiensi, akurasi, dan transparansi kinerja bisnis.'),
    ]),
    ListItem('4', [
      T('Memberikan pengalaman pelayanan yang ramah, santun, cepat, dan profesional demi terciptanya kepuasan serta loyalitas pelanggan yang berkesinambungan.'),
    ]),
    ListItem('5', [
      T('Menciptakan budaya kerja organisasi yang disiplin, akuntabel, kolaboratif, dan adaptif terhadap inovasi teknologi melalui format evaluasi kinerja terstruktur.'),
    ]),
    PEmpty(),

    SubSubBab('3.1.4', 'Struktur Organisasi dan Uraian Tugas'),
    PIndent([
      T('PT Garciafood Nusantara Gemilang menerapkan struktur organisasi lini fungsional yang dipimpin langsung oleh jajaran Direksi / Pemilik Perusahaan ('),
      TItalic('Owner'),
      T(') dan didelegasikan kepada penanggung jawab tiap unit divisi bisnis (PIC). Bagan struktur organisasi disajikan pada Gambar 3.1.'),
    ]),
    PEmpty(),
    FigureBox('BAGAN STRUKTUR ORGANISASI PT GARCIAFOOD NUSANTARA GEMILANG', 'Owner (Richard & Kim) → Pembimbing Lapangan (Annisa) → PIC IT, Finance, Kitchen, Service, Marketing'),
    CaptionGambar('Gambar 3.1', 'Struktur Organisasi PT Garciafood Nusantara Gemilang'),
    PEmpty(),
    PIndent([
      T('Uraian tugas, wewenang, dan tanggung jawab dari masing-masing posisi dalam struktur organisasi PT Garciafood Nusantara Gemilang dijelaskan sebagai berikut:'),
    ]),
    ListItem('1', [
      TBold('Direksi / Pemilik (Owner — Bapak Richard & Bapak Kim): '),
      T('Merupakan pemegang otoritas manajerial tertinggi yang bertanggung jawab dalam menentukan arah haluan strategis perusahaan, mengevaluasi laporan neraca kinerja dan keuangan konsolidasi seluruh divisi, menetapkan kebijakan ekspansi usaha, serta mengambil keputusan final dalam rapat koordinasi.'),
    ]),
    ListItem('2', [
      TBold('Pembimbing Lapangan / Koordinator Teknis (Ibu Annisa): '),
      T('Bertanggung jawab dalam mengoordinasikan operasional harian, mengawasi ketercapaian target antar bagian, memfasilitasi pelaksanaan program magang mahasiswa, menjembatani komunikasi teknis antara pengembang sistem dengan pihak manajemen, serta mengevaluasi implementasi sistem di lingkungan kerja.'),
    ]),
    ListItem('3', [
      TBold('Penanggung Jawab Divisi IT (PIC IT): '),
      T('Bertanggung jawab atas pemeliharaan infrastruktur teknologi informasi, keandalan jaringan internet outlet, pemeliharaan basis data sistem, keamanan berkas digital, serta memastikan kelancaran operasional perangkat lunak RockyTen.'),
    ]),
    ListItem('4', [
      TBold('Penanggung Jawab Divisi Keuangan (PIC Finance): '),
      T('Bertanggung jawab dalam pencatatan arus kas ('),
      TItalic('cash flow'),
      T(') harian, pelaporan laba rugi, rekonsiliasi penerimaan kasir, pengendalian anggaran belanja bahan baku dapur, serta pemantauan efisiensi biaya operasional perusahaan.'),
    ]),
    ListItem('5', [
      TBold('Penanggung Jawab Divisi Dapur (PIC Kitchen): '),
      T('Bertanggung jawab atas seluruh proses produksi makanan di dapur, menjaga konsistensi cita rasa sesuai resep baku, mengawasi kebersihan dan sanitasi area masak, meminimalkan sisa bahan terbuang ('),
      TItalic('waste management'),
      T('), serta mengelola ketersediaan stok bahan baku harian.'),
    ]),
    ListItem('6', [
      TBold('Penanggung Jawab Divisi Layanan Lantai (PIC Service/Floor): '),
      T('Bertanggung jawab atas standar pelayanan langsung kepada pelanggan di area bersantap dan meja kasir, kecepatan penyajian hidangan, penanganan keluhan pengunjung, serta pemeliharaan kebersihan dan kenyamanan suasana gerai.'),
    ]),
    ListItem('7', [
      TBold('Penanggung Jawab Divisi Pemasaran (PIC Marketing): '),
      T('Bertanggung jawab dalam merancang strategi kampanye promosi digital di media sosial, pengelolaan kemitraan platform pesan antar online (GrabFood/GoFood), periklanan visual, peninjauan ulasan pelanggan, serta peningkatan pangsa pasar merek Nasi Gerilya.'),
    ]),
    PEmpty(),

    SubSubBab('3.1.5', 'Logo Perusahaan dan Makna Filosofis'),
    PIndent([
      T('Identitas visual PT Garciafood Nusantara Gemilang direpresentasikan melalui logo resmi merek dagang "Nasi Gerilya" yang tertera pada Gambar 3.2.'),
    ]),
    PEmpty(),
    FigureBox('LOGO RESMI PT GARCIAFOOD NUSANTARA GEMILANG / NASI GERILYA', 'Lambang Simbolik Nasi Gerilya dengan Nuansa Merah Menyala dan Tipografi Nusantara'),
    CaptionGambar('Gambar 3.2', 'Logo Resmi PT Garciafood Nusantara Gemilang / Nasi Gerilya'),
    PEmpty(),
    PIndent([
      T('Logo perusahaan memiliki elemen-elemen desain yang sarat akan makna filosofis:'),
    ]),
    ListItem('1', [
      TBold('Warna Merah Menyala (Dominan): '),
      T('Melambangkan keberanian, gelora semangat pantang menyerah khas perjuangan gerilya, energi yang dinamis, serta kehangatan cita rasa hidangan rempah nusantara yang menggugah selera makan.'),
    ]),
    ListItem('2', [
      TBold('Tipografi Tegas dan Modern: '),
      T('Gaya huruf kapital yang solid dan terstruktur mencerminkan integritas, profesionalisme manajemen, keterbukaan, dan kesiapan perusahaan dalam menyongsong digitalisasi bisnis modern.'),
    ]),
    ListItem('3', [
      TBold('Aksen Grafis Ornamen Kuliner: '),
      T('Melambangkan kesatuan lima divisi bisnis yang solid dalam menyajikan kualitas hidangan dan pelayanan terbaik bagi seluruh masyarakat pelanggan.'),
    ]),
    PEmpty(),

    SubBab('3.2', 'Tempat dan Waktu Penelitian'),
    PIndent([
      T('Kegiatan Praktik Kerja Lapangan (PKL) dan penelitian rekayasa perangkat lunak ini dilaksanakan secara langsung pada lingkungan kerja PT Garciafood Nusantara Gemilang yang berlokasi di Jalan Gg. Rukun No.1, Kelurahan Bantan, Kecamatan Medan Tembung, Kota Medan, Sumatera Utara 20223.'),
    ]),
    PEmpty(),
    PIndent([
      T('Penelitian berlangsung selama tiga bulan penuh, terhitung mulai tanggal 1 September 2026 sampai dengan 30 November 2026. Jadwal pembagian tahapan kegiatan magang dan rancang bangun perangkat lunak mengacu pada model Waterfall yang dirinci dalam bentuk matriks 13 minggu pada Tabel 3.1.'),
    ]),
    PEmpty(),
    CaptionTabel('Tabel 3.1', 'Matriks Jadwal Rencana dan Realisasi Kegiatan Magang PKL'),
    createStyledTable(
      ['No', 'Tahapan Kegiatan Penelitian', 'September 2026 (Mgg)', 'Oktober 2026 (Mgg)', 'November 2026 (Mgg)'],
      [
        ['1', 'Orientasi lapangan & Analisis Kebutuhan Sistem', '1, 2, 3, 4', '—', '—'],
        ['2', 'Perancangan Arsitektur, DFD, ERD & Antarmuka UI', '—', '5, 6', '—'],
        ['3', 'Konstruksi Kode Program (Next.js, Supabase, RBAC)', '—', '7, 8, 9', '10'],
        ['4', 'Pengujian Sistem (Black Box Testing & Uji RBAC)', '—', '—', '11, 12'],
        ['5', 'Evaluasi Akhir, Deployment Vercel & Penulisan Laporan', '—', '—', '12, 13'],
      ],
      [600, 3600, 1600, 1600, 1600]
    ),
    PEmpty(),

    SubBab('3.3', 'Jenis dan Sumber Data'),

    SubSubBab('3.3.1', 'Jenis Data'),
    PIndent([
      T('Dalam merancang dan membangun sistem informasi '),
      TItalic('RockyTen'),
      T(', penulis menghimpun dua kategori data:'),
    ]),
    ListItem('1', [
      TBold('Data Kualitatif: '),
      T('Data deskriptif non-numerik yang diperoleh dari proses wawancara mendalam dan observasi, meliputi struktur organisasi, alur komunikasi antar divisi saat rapat, kendala manajerial yang dirasakan oleh para PIC divisi, format instruksi kerja, serta umpan balik subyektif dari pembimbing lapangan mengenai kenyamanan antarmuka pengguna.'),
    ]),
    ListItem('2', [
      TBold('Data Kuantitatif: '),
      T('Data terukur berupa angka-angka faktual yang dihimpun dari operasional perusahaan, mencakup jumlah divisi aktif (5 divisi), target kuantitatif mingguan di '),
      TItalic('Scoreboard'),
      T(' (misal: persentase komplain pelanggan, batas biaya bahan baku harian, target penjualan harian), jumlah sasaran 90 hari ('),
      TItalic('Rocks'),
      T('), data akun pengguna sistem, durasi rapat, serta hasil skor keberhasilan pengujian fungsionalitas perangkat lunak.'),
    ]),
    PEmpty(),

    SubSubBab('3.3.2', 'Sumber Data'),
    PIndent([
      T('Sumber data yang dipergunakan dalam penelitian ini terbagi atas dua kelompok:'),
    ]),
    ListItem('1', [
      TBold('Data Primer: '),
      T('Merupakan data yang digali dan dihimpun secara langsung dari sumber pertama di lokasi penelitian melalui observasi partisipatif terhadap alur kerja kasir dan dapur, wawancara langsung dengan Ibu Annisa selaku pembimbing lapangan, wawancara dengan para PIC divisi, serta hasil pencatatan langsung saat pengujian simulasi sistem.'),
    ]),
    ListItem('2', [
      TBold('Data Sekunder: '),
      T('Merupakan data pendukung yang diperoleh dari media dan dokumentasi yang telah ada sebelumnya, meliputi literatur ilmiah berupa buku teks '),
      TItalic('Traction'),
      T(' karya Gino Wickman (2011), publikasi jurnal bereputasi terkait kontrol akses RBAC dan arsitektur Next.js/Supabase, berkas rekapitulasi penjualan manual internal perusahaan, serta buku pedoman penulisan laporan PKL Politeknik Ganesha Medan 2025.'),
    ]),
    PEmpty(),

    SubBab('3.4', 'Metode Pengumpulan Data'),
    PIndent([
      T('Guna menjamin validitas dan kelengkapan data kebutuhan perancangan sistem, penulis menerapkan empat teknik pengumpulan data terstruktur:'),
    ]),
    ListItem('1', [
      TBold('Observasi Partisipatif (Field Research): '),
      T('Penulis melakukan pengamatan langsung terhadap aktivitas kerja sehari-hari di gerai PT Garciafood Nusantara Gemilang, memantau bagaimana para pimpinan divisi bertukar informasi, mencatat kendala pada buku log, serta mengamati jalannya rapat koordinasi mingguan yang berjalan saat ini.'),
    ]),
    ListItem('2', [
      TBold('Wawancara Terstruktur: '),
      T('Melakukan sesi tanya jawab secara formal dan terencana dengan panduan instrumen kuesioner kepada Ibu Annisa (Pembimbing Lapangan) dan para PIC dari lima divisi kerja guna menggali rincian kebutuhan modul, alur wewenang otorisasi data, dan ekspektasi fitur yang diharapkan pada aplikasi RockyTen.'),
    ]),
    ListItem('3', [
      TBold('Studi Kepustakaan (Library Research): '),
      T('Menghimpun teori, formula, dan standar teknis dari sumber-sumber literatur terpercaya (buku teks, jurnal ilmiah nasional/internasional, dan dokumentasi resmi perangkat lunak) untuk memperkuat basis teoritis perancangan perangkat lunak dan arsitektur keamanan RBAC.'),
    ]),
    ListItem('4', [
      TBold('Dokumentasi Sistem: '),
      T('Mendokumentasikan berkas formulir fisik, alur pesan WhatsApp, diagram arsitektur kode, struktur basis data, serta tangkapan layar antarmuka sistem yang dihasilkan selama pelaksanaan magang.'),
    ]),
    PEmpty(),

    SubBab('3.5', 'Analisa Sistem yang Sedang Berjalan'),

    SubSubBab('3.5.1', 'Prosedur Pengolahan Data Saat Ini'),
    PIndent([
      T('Berdasarkan hasil observasi dan wawancara di PT Garciafood Nusantara Gemilang, prosedur pemantauan kinerja dan koordinasi operasional yang sedang berjalan saat ini masih dilakukan secara manual dan konvensional:'),
    ]),
    ListItem('1', [
      T('Setiap PIC divisi mencatat metrik capaian harian pada lembar buku tulis kasir atau dokumen spreadsheet terpisah pada komputer lokal masing-masing tanpa adanya basis data terpusat.'),
    ]),
    ListItem('2', [
      T('Penyampaian informasi mendesak atau kendala kerusakan peralatan dapur dilaporkan secara acak melalui grup pesan instan WhatsApp, yang kerap kali tertimbun oleh percakapan lain sehingga lambat ditindaklanjuti.'),
    ]),
    ListItem('3', [
      T('Pelaksanaan rapat mingguan dipimpin oleh Owner tanpa adanya agenda terstandarisasi. Tidak ada catatan resmi mengenai siapa yang bertanggung jawab atas suatu tugas ('),
      TItalic('action item'),
      T(') dan tidak ada mekanisme penelusuran status komitmen dari rapat sebelumnya.'),
    ]),
    ListItem('4', [
      T('Ketiadaan kontrol akses privasi memungkinkan siapa saja membaca catatan keuangan atau komisi pemasaran yang tertinggal di area kasir, menciptakan kerentanan keamanan informasi internal perusahaan.'),
    ]),
    PEmpty(),

    SubSubBab('3.5.2', 'Data Flow Diagram (DFD) Sistem yang Sedang Berjalan'),
    PIndent([
      T('Aliran data koordinasi kinerja manual pada sistem yang sedang berjalan dimodelkan menggunakan Diagram Konteks (Level 0) pada Gambar 3.3 dan DFD Level 1 pada Gambar 3.4.'),
    ]),
    PEmpty(),
    FigureBox('DIAGRAM KONTEKS (LEVEL 0) SISTEM KOORDINASI KINERJA MANUAL', 'PIC Divisi ↔ Pengiriman Rekap Kertas/Chat WhatsApp ↔ Owner (Evaluasi Manual Tanpa Sentralisasi)'),
    CaptionGambar('Gambar 3.3', 'Diagram Konteks (Level 0) Sistem Koordinasi Kinerja Manual'),
    PEmpty(),
    FigureBox('DATA FLOW DIAGRAM (DFD) LEVEL 1 SISTEM KOORDINASI MANUAL', 'Proses 1.0 Pencatatan Manual → Proses 2.0 Rekap WhatsApp → Proses 3.0 Rapat Lisan → Arsip Kertas'),
    CaptionGambar('Gambar 3.4', 'Data Flow Diagram (DFD) Level 1 Sistem Koordinasi Manual'),
    PEmpty(),

    SubSubBab('3.5.3', 'Evaluasi Kelemahan Sistem Berjalan (Matriks PIECES)'),
    PIndent([
      T('Guna membedah secara ilmiah seluruh kelemahan sistem koordinasi manual saat ini, penulis melakukan evaluasi menggunakan kerangka kerja PIECES ('),
      TItalic('Performance, Information, Economics, Control, Efficiency, Service'),
      T(') yang disajikan pada Tabel 3.2.'),
    ]),
    PEmpty(),
    CaptionTabel('Tabel 3.2', 'Analisis Kelemahan Sistem Manual Menggunakan Kerangka PIECES'),
    createStyledTable(
      ['Kategori PIECES', 'Kondisi Sistem Manual Saat Ini', 'Kebutuhan Sistem Baru (RockyTen)'],
      [
        ['Performance (Kinerja)', 'Pemantauan indikator kinerja lambat karena harus merekap catatan kertas dan pesan chat secara manual.', 'Penyajian metrik Scoreboard dan progres Rocks kuartalan secara real-time dan otomatis.'],
        ['Information (Informasi)', 'Informasi kinerja terfragmentasi, rawan hilang, dan tidak memiliki riwayat arsip yang tersusun rapi.', 'Penyimpanan terpusat pada basis data Supabase PostgreSQL dengan pelacakan status indikator visual.'],
        ['Economics (Ekonomi)', 'Biaya terbuang akibat rapat yang berlarut-larut tanpa keputusan konkrit dan risiko salah penganggaran.', 'Efisiensi waktu rapat hingga 90 menit disiplin L10 Meeting dan penekanan biaya operasional.'],
        ['Control (Pengendalian)', 'Tidak ada pembatasan hak akses; data sensitif keuangan divisi dapat dilihat oleh pihak yang tidak berhak.', 'Penerapan Role-Based Access Control (RBAC) 3 peran (Developer, Owner, PIC per divisi).'],
        ['Efficiency (Efisiensi)', 'Banyak waktu operasional tersita untuk menanyakan progres tugas berulang kali secara manual.', 'Modul To-Do List dan Issues IDS yang terstruktur dengan PIC penanggung jawab yang tegas.'],
        ['Service (Pelayanan)', 'Keterlambatan penanganan kendala peralatan dapur berdampak pada lambatnya layanan ke konsumen.', 'Fitur eskalasi instan kendala operasional ke daftar Issues IDS untuk penuntasan segera.'],
      ],
      [1800, 3600, 3600]
    ),
    PEmpty(),

    SubBab('3.6', 'Langkah-Langkah Rancang Bangun Aplikasi RockyTen'),
    PIndent([
      T('Proses rekayasa perangkat lunak aplikasi '),
      TItalic('RockyTen'),
      T(' dilaksanakan secara disiplin dengan menerapkan tahapan metode '),
      TItalic('Waterfall'),
      T(' yang meliputi lima fase kegiatan:'),
    ]),
    PEmpty(),

    SubSubBab('3.6.1', 'Analisis Kebutuhan Sistem (Fungsional dan Non-Fungsional)'),
    PIndent([
      T('Fase analisis kebutuhan merumuskan spesifikasi kemampuan sistem yang harus disediakan oleh perangkat lunak guna mengatasi kelemahan operasional yang telah diidentifikasi pada analisis PIECES. Spesifikasi kebutuhan dikelompokkan menjadi:'),
    ]),
    ListItem('1', [
      TBold('Kebutuhan Fungsional (Functional Requirements / FR): '),
      T('Menjelaskan fungsi-fungsi spesifik yang wajib dieksekusi oleh sistem perangkat lunak, sebagaimana dirangkum pada Tabel 3.3.'),
    ]),
    PEmpty(),
    CaptionTabel('Tabel 3.3', 'Spesifikasi Kebutuhan Fungsional (Functional Requirements)'),
    createStyledTable(
      ['Kode FR', 'Nama Modul / Fitur', 'Deskripsi Kebutuhan Fungsional'],
      [
        ['FR-01', 'Dashboard Eksekutif', 'Menampilkan ringkasan visual status metrik, progres 3 Rocks teratas, To-Do tertunda, jumlah Issues aktif, dan pengumuman terbaru dalam satu layar ringkas.'],
        ['FR-02', 'Scoreboard Metrik', 'Menyediakan tabel pemantauan metrik mingguan per divisi dengan dua kategori (sub-metrik Rocks dan metrik mandiri), kalkulasi target vs aktual, serta penanda status on track / off track otomatis.'],
        ['FR-03', 'Manajemen Rocks', 'Mengelola target prioritas kuartalan 90 hari (Q1–Q4) per divisi, persentase progres otomatis dari sub-metrik Scoreboard, serta tombol eskalasi instan ke Issues jika off track.'],
        ['FR-04', 'Papan Headlines', 'Menampilkan informasi dan pengumuman penting perusahaan dengan pembedaan tingkat urgensi prioritas (High, Medium, Low) dan penyaringan per divisi.'],
        ['FR-05', 'Daftar To-Do List', 'Mencatat komitmen tugas mingguan hasil rapat L10, penunjukan PIC penanggung jawab, tanggal jatuh tempo, dan pembaruan status penyelesaian (Pending/Done).'],
        ['FR-06', 'Daftar Issues (IDS)', 'Mengelola daftar permasalahan operasional dengan alur Identify, Discuss, Solve (IDS), penetapan pemilik masalah, serta penentuan prioritas penyelesaian rapat.'],
        ['FR-07', 'Keamanan RBAC', 'Mengontrol tampilan antarmuka dan akses basis data: Developer (akses penuh + debug log), Owner (seluruh divisi), PIC (hanya divisi sendiri).'],
        ['FR-08', 'Panel Role Switcher', 'Menyediakan panel pengujian bagi peran Developer dan Owner untuk mensimulasikan perspektif tampilan antarmuka akun PIC divisi manapun secara langsung.'],
        ['FR-09', 'Dukungan Tema Tampilan', 'Menyediakan fitur pergantian mode tampilan visual terang (Light Mode) dan gelap (Dark Mode) untuk kenyamanan pengguna saat bekerja di berbagai kondisi pencahayaan.'],
        ['FR-10', 'Sinkronisasi Realtime', 'Menyinkronkan data pembaruan nilai metrik dan tugas antar peramban pengguna secara otomatis melalui koneksi Supabase Realtime.'],
      ],
      [900, 2200, 5900]
    ),
    PEmpty(),
    ListItem('2', [
      TBold('Kebutuhan Non-Fungsional (Non-Functional Requirements / NFR): '),
      T('Mendefinisikan kriteria kualitas perilaku sistem, keandalan, batasan teknologi, dan keamanan operasional pada Tabel 3.4.'),
    ]),
    PEmpty(),
    CaptionTabel('Tabel 3.4', 'Spesifikasi Kebutuhan Non-Fungsional (Non-Functional Requirements)'),
    createStyledTable(
      ['Kode NFR', 'Parameter Kualitas', 'Deskripsi Kebutuhan Non-Fungsional'],
      [
        ['NFR-01', 'Security (Keamanan)', 'Penerapan isolasi data berbasis peran (RBAC) pada lapisan frontend dan query basis data Supabase PostgreSQL untuk mencegah akses data tanpa izin.'],
        ['NFR-02', 'Performance (Performa)', 'Waktu respons peramban saat memuat halaman utama dan beralih menu tidak boleh melebihi 2 detik pada koneksi internet pita lebar standar (10 Mbps).'],
        ['NFR-03', 'Availability (Ketersediaan)', 'Sistem di-deploy pada infrastruktur komputasi awan Vercel dengan garansi ketersediaan operasional (uptime) minimal 99,5% tanpa kebutuhan instalasi server lokal.'],
        ['NFR-04', 'Usability (Kemudahan Pakai)', 'Desain antarmuka bersih (clean layout) dengan kontras warna standar WCAG, navigasi konsisten, serta tipografi proporsional yang ramah bagi pengguna non-teknis.'],
        ['NFR-05', 'Maintainability (Pemeliharaan)', 'Kode program disusun secara modular menggunakan arsitektur komponen React, TypeScript type safety, dan manajemen state terpusat (AppContext).'],
      ],
      [1100, 2200, 5700]
    ),
    PEmpty(),

    SubSubBab('3.6.2', 'Perancangan Sistem (Arsitektur, DFD, ERD, Matriks RBAC)'),
    PIndent([
      T('Tahap perancangan sistem menghasilkan cetak biru arsitektur teknis perangkat lunak sebelum fase pengodean dimulai:'),
    ]),
    ListItem('1', [
      TBold('Arsitektur Sistem (Jamstack Cloud Architecture): '),
      T('Aplikasi RockyTen memadukan Next.js 16 sebagai antarmuka pengguna interaktif (Client) dan backend API layer, yang terhubung melalui protokol aman HTTPS/WebSockets ke platform Supabase Cloud (PostgreSQL Database). Manajemen status global aplikasi diorganisir menggunakan React Context API ('),
      TItalic('AppContext.tsx'),
      T(') sebagai sumber kebenaran tunggal ('),
      TItalic('single source of truth'),
      T(').'),
    ]),
    ListItem('2', [
      TBold('Pemodelan Aliran Data (Data Flow Diagram / DFD): '),
      T('Aliran interaksi data sistem baru digambarkan melalui Diagram Konteks pada Gambar 3.5 dan DFD Level 1 pada Gambar 3.6.'),
    ]),
    PEmpty(),
    FigureBox('DIAGRAM KONTEKS (LEVEL 0) APLIKASI ROCKYTEN', 'Entitas Luar: Developer, Owner, PIC Divisi ↔ Sistem RockyTen ↔ Basis Data Supabase'),
    CaptionGambar('Gambar 3.5', 'Diagram Konteks (Level 0) Sistem Baru Aplikasi RockyTen'),
    PEmpty(),
    FigureBox('DATA FLOW DIAGRAM (DFD) LEVEL 1 SISTEM ROCKYTEN', 'Proses 1.0 Autentikasi & RBAC → Proses 2.0 Scoreboard & Rocks → Proses 3.0 Headlines & Todos → Proses 4.0 Issues IDS'),
    CaptionGambar('Gambar 3.6', 'Data Flow Diagram (DFD) Level 1 Aplikasi RockyTen'),
    PEmpty(),
    ListItem('3', [
      TBold('Perancangan Basis Data Relasional (Supabase PostgreSQL): '),
      T('Struktur tabel dan atribut basis data relasional yang menopang seluruh modul aplikasi RockyTen dimodelkan secara komprehensif pada Tabel 3.5 dan relasi antar entitas disajikan melalui ERD pada Gambar 3.7.'),
    ]),
    PEmpty(),
    CaptionTabel('Tabel 3.5', 'Spesifikasi Struktur Basis Data Relasional PostgreSQL Supabase'),
    createStyledTable(
      ['Nama Tabel', 'Kunci Utama (PK)', 'Kunci Tamu (FK)', 'Deskripsi Entitas dan Atribut Kunci'],
      [
        ['departments', 'id (TEXT)', '—', 'Menyimpan 5 divisi operasional: id, name (IT, Finance, Kitchen, Service, Marketing).'],
        ['profiles', 'id (TEXT)', 'department_id', 'Menyimpan data pengguna: id, name, role (developer/owner/pic), email, password, avatar_url.'],
        ['rocks', 'id (TEXT)', 'department_id, pic_id', 'Menyimpan target 90 hari: id, title, description, quarter, year, status, due_date.'],
        ['metrics', 'id (TEXT)', 'department_id, rock_id', 'Menyimpan metrik mingguan: id, title, unit, target_value, direction, frequency (rock_id NULL = metrik mandiri).'],
        ['metric_values', 'id (TEXT)', 'metric_id', 'Menyimpan nilai aktual periodik: id, period_date, actual_value, notes.'],
        ['todos', 'id (TEXT)', 'department_id, pic_id', 'Menyimpan tugas komitmen rapat L10: id, title, due_date, completed (BOOLEAN), pic_name.'],
        ['issues', 'id (TEXT)', 'department_id, owner_id', 'Menyimpan kendala metode IDS: id, title, description, status, priority (high/medium/low).'],
        ['headlines', 'id (TEXT)', 'department_id', 'Menyimpan papan pengumuman: id, title, body, priority, is_active, created_by.'],
      ],
      [1300, 1100, 1800, 4800]
    ),
    PEmpty(),
    FigureBox('ENTITY RELATIONSHIP DIAGRAM (ERD) BASIS DATA ROCKYTEN', 'Relasi Antar Entitas: departments (1:N) profiles, rocks (1:N) metrics (1:N) metric_values, todos, issues, headlines'),
    CaptionGambar('Gambar 3.7', 'Entity Relationship Diagram (ERD) Basis Data Supabase'),
    PEmpty(),
    ListItem('4', [
      TBold('Perancangan Matriks Hak Akses RBAC: '),
      T('Batasan wewenang operasi data (Create, Read, Update, Delete) antar ketiga peran pengguna dipetakan secara formal pada Tabel 3.6.'),
    ]),
    PEmpty(),
    CaptionTabel('Tabel 3.6', 'Matriks Otorisasi Hak Akses Role-Based Access Control (RBAC)'),
    createStyledTable(
      ['Modul / Fitur Sistem', 'Peran Developer', 'Peran Owner', 'Peran PIC Divisi'],
      [
        ['Dashboard Ringkasan', 'Melihat seluruh 5 divisi', 'Melihat seluruh 5 divisi', 'Hanya melihat divisinya sendiri'],
        ['Scoreboard (Metrik)', 'CRUD seluruh divisi', 'Melihat (Read) seluruh divisi', 'CRUD hanya divisinya sendiri'],
        ['Rocks (Target 90 Hari)', 'CRUD seluruh divisi', 'Melihat (Read) seluruh divisi', 'CRUD hanya divisinya sendiri'],
        ['Headlines (Pengumuman)', 'CRUD seluruh divisi', 'CRUD seluruh divisi', 'CRUD hanya divisinya sendiri'],
        ['To-Do List (Tugas)', 'CRUD seluruh divisi', 'Melihat (Read) seluruh divisi', 'CRUD hanya divisinya sendiri'],
        ['Issues (Penyelesaian IDS)', 'CRUD seluruh divisi', 'Melihat (Read) seluruh divisi', 'CRUD hanya divisinya sendiri'],
        ['Log Debugging & Error', 'Akses penuh', 'Tidak dapat mengakses', 'Tidak dapat mengakses'],
        ['Role Switcher Panel', 'Tersedia untuk pengujian', 'Tersedia untuk simulasi', 'Tidak tersedia'],
      ],
      [2200, 2200, 2200, 2400]
    ),
    PEmpty(),

    SubSubBab('3.6.3', 'Implementasi Sistem dan Antarmuka Modul RockyTen'),
    PIndent([
      T('Tahap konstruksi implementasi menerjemahkan seluruh rancangan menjadi aplikasi web fungsional. Lingkungan perangkat keras yang digunakan meliputi Laptop ASUS/Intel Core i7, memori RAM 16GB, dan penyimpanan NVMe SSD 512GB di bawah sistem operasi Windows 11 64-bit. Lingkungan perangkat lunak meliputi Visual Studio Code, Node.js versi 24, Git, Supabase Cloud Platform, dan Vercel Platform.'),
    ]),
    PEmpty(),
    PIndent([
      T('Implementasi antarmuka pengguna aplikasi '),
      TItalic('RockyTen'),
      T(' terbagi ke dalam tujuh halaman modul fungsional:'),
    ]),
    ListItem('1', [
      TBold('Halaman Dashboard Eksekutif: '),
      T('Menyajikan kartu ringkasan instan kondisi perusahaan, mencakup total target Rocks aktif, metrik Scoreboard, tugas To-Do yang tertunda, jumlah permasalahan Issues aktif, pengumuman Headlines, serta widget progres 3 Rocks teratas.'),
    ]),
    PEmpty(),
    FigureBox('TAMPILAN ANTARMUKA HALAMAN DASHBOARD EKSEKUTIF ROCKYTEN', 'Tampilan 5 Kartu Statistik Utama, Widget Progres 3 Rocks Teratas, dan Indikator Status'),
    CaptionGambar('Gambar 3.8', 'Tampilan Antarmuka Halaman Dashboard Eksekutif RockyTen'),
    PEmpty(),
    ListItem('2', [
      TBold('Halaman Scoreboard (Metrik Kinerja Mingguan): '),
      T('Menampilkan tabel KPI terperinci per divisi. Metrik dikategorikan menjadi sub-metrik target Rocks dan metrik mandiri. Dilengkapi status otomatis (hijau untuk on-track, merah untuk off-track) berdasarkan deviasi nilai aktual terhadap target mingguan.'),
    ]),
    PEmpty(),
    FigureBox('TAMPILAN HALAMAN SCOREBOARD (METRIK SUB-ROCKS DAN MANDIRI)', 'Tabel Metrik Interaktif dengan Target, Nilai Riil, Satuan, dan Status On/Off Track Otomatis'),
    CaptionGambar('Gambar 3.9', 'Tampilan Halaman Scoreboard (Metrik Sub-Rocks dan Mandiri)'),
    PEmpty(),
    ListItem('3', [
      TBold('Halaman Rocks (Target 90 Hari): '),
      T('Menampilkan sasaran strategis kuartalan (Q1–Q4). Setiap kartu Rocks menghitung persentase ketercapaian secara matematis dari sub-metrik di Scoreboard, serta dilengkapi tombol khusus "🚨 Lempar ke Issue (IDS)" untuk mengeskalasi target yang bermasalah langsung ke agenda rapat L10.'),
    ]),
    PEmpty(),
    FigureBox('TAMPILAN HALAMAN ROCKS (TARGET 90 HARI DAN FITUR ESKALASI IDS)', 'Kartu Target Kuartalan, Bar Progres Persentase Otomatis, PIC, dan Tombol Eskalasi Masalah'),
    CaptionGambar('Gambar 3.10', 'Tampilan Halaman Rocks (Target 90 Hari dan Tombol Eskalasi IDS)'),
    PEmpty(),
    ListItem('4', [
      TBold('Halaman Headlines (Papan Informasi): '),
      T('Menyajikan kabar dan pengumuman strategis internal antar divisi dengan label prioritas warna yang kontras (Tinggi, Sedang, Rendah) untuk menyelaraskan informasi sebelum pembahasan rapat dimulai.'),
    ]),
    PEmpty(),
    FigureBox('TAMPILAN HALAMAN HEADLINES (PAPAN PENGUMUMAN BERPRIORITAS)', 'Daftar Kabar Penting Lintas Divisi dengan Label Urgensi dan Penyaringan Departemen'),
    CaptionGambar('Gambar 3.11', 'Tampilan Halaman Headlines (Papan Pengumuman Berprioritas)'),
    PEmpty(),
    ListItem('5', [
      TBold('Halaman To-Do List (Manajemen Tugas Rapat): '),
      T('Menyajikan daftar tugas komitmen 7 hari yang dihasilkan dari rapat L10 sebelumnya. Dilengkapi kotak centang penyelesaian tugas, tanggal tenggat waktu, dan penanggung jawab PIC yang akuntabel.'),
    ]),
    PEmpty(),
    FigureBox('TAMPILAN HALAMAN TO-DO LIST (MANAJEMEN TUGAS AKUNTABILITAS RAPAT)', 'Daftar Tugas Mingguan, Kotak Centang Selesai, Tenggat Waktu, dan Indikator PIC Divisi'),
    CaptionGambar('Gambar 3.12', 'Tampilan Halaman To-Do List (Manajemen Tugas Akuntabilitas Rapat)'),
    PEmpty(),
    ListItem('6', [
      TBold('Halaman Issues List (Penyelesaian Kendala Metode IDS): '),
      T('Mengorganisir permasalahan operasional gerai berdasarkan tingkat keparahan, pemilik kendala, dan status penanganan. Halaman ini menjadi fokus utama diskusi 60 menit rapat mingguan L10 untuk menelusuri akar masalah hingga tuntas.'),
    ]),
    PEmpty(),
    FigureBox('TAMPILAN HALAMAN ISSUES LIST (PENYELESAIAN MASALAH METODE IDS)', 'Tabel Isu Operasional, Identifikasi Masalah, Diskusi Solusi, dan Penetapan Tindak Lanjut'),
    CaptionGambar('Gambar 3.13', 'Tampilan Halaman Issues List (Penyelesaian Masalah Metode IDS)'),
    PEmpty(),
    ListItem('7', [
      TBold('Halaman Settings dan Panel Role Switcher: '),
      T('Merupakan modul administrasi hak akses pengguna yang memuat panel Role Switcher. Fitur ini memungkinkan peran Developer dan Owner berpindah simulasi perspektif peran secara instan guna memverifikasi efektivitas pembatasan isolasi data RBAC pada masing-masing divisi.'),
    ]),
    PEmpty(),
    FigureBox('TAMPILAN HALAMAN SETTINGS DAN PANEL ROLE SWITCHER RBAC', 'Konfigurasi Profil Pengguna, Manajemen Hak Akses Peran, dan Panel Simulasi Otorisasi Data'),
    CaptionGambar('Gambar 3.14', 'Tampilan Halaman Settings dan Panel Role Switcher RBAC'),
    PEmpty(),

    SubSubBab('3.6.4', 'Pengujian Sistem (Black Box Testing dan Uji RBAC)'),
    PIndent([
      T('Pengujian perangkat lunak dilakukan secara komprehensif menggunakan metode '),
      TItalic('Black Box Testing'),
      T('. Metode ini memfokuskan pengujian pada fungsionalitas luar antarmuka sistem tanpa melihat struktur internal kode program, memastikan bahwa setiap input menghasilkan output yang sesuai dengan dokumen spesifikasi kebutuhan. Pengujian terbagi atas dua domain:'),
    ]),
    ListItem('1', [
      TBold('Pengujian Fungsionalitas Modul: '),
      T('Menguji 10 skenario operasi pada Tabel 3.7.'),
    ]),
    PEmpty(),
    CaptionTabel('Tabel 3.7', 'Rencana dan Hasil Pengujian Fungsional Modul (Black Box Testing)'),
    createStyledTable(
      ['No', 'Skenario Pengujian', 'Tindakan Pengujian (Input)', 'Hasil yang Diharapkan', 'Status'],
      [
        ['1', 'Navigasi Antarmuka', 'Mengklik menu navigasi samping (Sidebar)', 'Halaman berpindah secara instan tanpa reload penuh', 'Berhasil'],
        ['2', 'Kalkulasi Scoreboard', 'Menginput nilai aktual metrik mingguan', 'Status on/off track berubah otomatis sesuai target', 'Berhasil'],
        ['3', 'Progres Otomatis Rocks', 'Memperbarui sub-metrik di Scoreboard', 'Persentase progres Rocks terhitung otomatis', 'Berhasil'],
        ['4', 'Eskalasi Cepat IDS', 'Menekan tombol "Lempar ke Issue" pada Rocks', 'Isu baru langsung terbentuk di modul Issues', 'Berhasil'],
        ['5', 'Penyaringan Divisi', 'Memilih filter divisi (misal: Kitchen)', 'Tabel hanya menyajikan data milik divisi terpilih', 'Berhasil'],
        ['6', 'Manajemen Tugas To-Do', 'Mencentang status tugas To-Do List', 'Status tersimpan sebagai selesai (done)', 'Berhasil'],
        ['7', 'Papan Headlines', 'Menambahkan pengumuman dengan prioritas High', 'Headlines tampil dengan aksen warna merah mencolok', 'Berhasil'],
        ['8', 'Penyelesaian Isu IDS', 'Mengubah status isu dari open ke resolved', 'Isu berpindah ke daftar riwayat terselesaikan', 'Berhasil'],
        ['9', 'Tema Dark / Light Mode', 'Menekan ikon penggantian tema di bilah atas', 'Seluruh warna kontras antarmuka berubah seketika', 'Berhasil'],
        ['10', 'Sinkronisasi Realtime', 'Memperbarui data di satu tab peramban', 'Tab peramban lain menerima pembaruan secara live', 'Berhasil'],
      ],
      [500, 1600, 2400, 3600, 900]
    ),
    PEmpty(),
    ListItem('2', [
      TBold('Pengujian Keamanan Hak Akses Peran RBAC: '),
      T('Memverifikasi segregasi data antar peran pengguna pada Tabel 3.8.'),
    ]),
    PEmpty(),
    CaptionTabel('Tabel 3.8', 'Hasil Pengujian Keamanan Hak Akses Peran RBAC RockyTen'),
    createStyledTable(
      ['Peran Pengguna', 'Aktivitas yang Diuji', 'Hasil yang Diharapkan', 'Hasil Pengujian Riil', 'Kesimpulan'],
      [
        ['Developer', 'Mengakses seluruh menu divisi dan membuka panel debug log', 'Sistem memberikan akses penuh tanpa pembatasan data', 'Akses penuh terbuka dan log galat tampil', 'Valid'],
        ['Owner', 'Memantau seluruh divisi (IT, Finance, Kitchen, Service, Mkt)', 'Dapat melihat seluruh data divisi, panel debug tertutup', 'Seluruh metrik 5 divisi terpantau, debug tersembunyi', 'Valid'],
        ['PIC IT', 'Mencoba mengakses data keuangan di menu Finance', 'Sistem membatasi akses; data Finance tidak ditampilkan', 'Data keuangan terisolasi; hanya data IT yang tampil', 'Valid'],
        ['PIC Kitchen', 'Melihat target Scoreboard dan Rocks divisi Kitchen', 'Hanya data Kitchen yang tampil di layar', 'Data operasional Kitchen tampil sempurna', 'Valid'],
        ['PIC Marketing', 'Menambah pengumuman Headlines dan tugas To-Do', 'Pengumuman dan tugas terasosiasi ke divisi Marketing', 'Data tersimpan dengan label Marketing', 'Valid'],
      ],
      [1200, 2000, 2400, 2400, 1000]
    ),
    PEmpty(),

    SubSubBab('3.6.5', 'Evaluasi Akhir dan Deployment Cloud'),
    PIndent([
      T('Pada fase akhir siklus Waterfall, aplikasi '),
      TItalic('RockyTen'),
      T(' secara resmi di-'),
      TItalic('deploy'),
      T(' ke lingkungan produksi komputasi awan menggunakan platform Vercel yang terintegrasi secara otomatis ('),
      TItalic('Continuous Deployment'),
      T(') dengan repositori Git. Aplikasi dapat diakses secara publik oleh seluruh jajaran manajemen PT Garciafood Nusantara Gemilang melalui peramban web modern tanpa kendala konfigurasi perangkat keras lokal.'),
    ]),
    PEmpty(),
    PIndent([
      T('Sesi demonstrasi dan evaluasi sistem dilakukan bersama Ibu Annisa selaku Pembimbing Lapangan dan jajaran pimpinan PT Garciafood Nusantara Gemilang. Berdasarkan evaluasi akhir, pihak manajemen menyatakan kepuasan tinggi terhadap kehadiran aplikasi RockyTen. Desain antarmuka dinilai sangat bersih, intuitif, dan responsif. Mekanisme keamanan RBAC dinilai berhasil menuntaskan kekhawatiran utama manajemen mengenai kerahasiaan data finansial antar divisi, sementara modul Traction L10 terbukti mampu memangkas waktu rapat mingguan dari yang sebelumnya tidak menentu menjadi tepat 90 menit dengan hasil keputusan yang terukur.'),
    ]),
    PEmpty(),

    SubBab('3.7', 'Kesimpulan dan Saran'),

    SubSubBab('3.7.1', 'Kesimpulan'),
    PIndent([
      T('Berdasarkan keseluruhan tahapan pelaksanaan Praktik Kerja Lapangan (PKL), mulai dari observasi lapangan, analisis kebutuhan, perancangan, pembangunan sistem, hingga pengujian dan evaluasi aplikasi '),
      TItalic('RockyTen'),
      T(' pada PT Garciafood Nusantara Gemilang, maka dapat ditarik beberapa kesimpulan pokok sebagai berikut:'),
    ]),
    ListItem('1', [
      T('Telah berhasil dirancang dan dibangun aplikasi manajemen kinerja kolaboratif berbasis web bernama '),
      TBold('RockyTen'),
      T(' menggunakan tumpukan teknologi modern Next.js 16 (App Router), Supabase PostgreSQL, Tailwind CSS, dan TypeScript dengan mengadopsi instrumen manajerial '),
      TItalic('Traction Level 10 Meeting'),
      T(' (Scoreboard, Rocks, Headlines, To-Do List, dan Issues) yang mampu mentransformasi sistem koordinasi manual PT Garciafood Nusantara Gemilang menjadi sistem digital yang terpadu dan real-time.'),
    ]),
    ListItem('2', [
      T('Telah berhasil diimplementasikan arsitektur keamanan '),
      TBold('Role-Based Access Control (RBAC)'),
      T(' tiga tingkat wewenang (Developer, Owner, dan PIC Divisi) yang secara efektif membatasi akses data kinerja dan finansial antar 5 divisi (IT, Finance, Kitchen, Service, Marketing), sehingga menjamin privasi data internal dan mencegah kebocoran informasi strategis perusahaan.'),
    ]),
    ListItem('3', [
      T('Hasil pengujian fungsionalitas dan keamanan menggunakan metode '),
      TBold('Black Box Testing'),
      T(' membuktikan bahwa seluruh 10 skenario pengujian fungsional modul dan 5 skenario pengujian wewenang RBAC berjalan dengan tingkat keberhasilan 100% (valid), di mana aplikasi terbukti andal, responsif, dan siap digunakan secara riil untuk meningkatkan efektivitas rapat mingguan di PT Garciafood Nusantara Gemilang.'),
    ]),
    PEmpty(),

    SubSubBab('3.7.2', 'Saran'),
    PIndent([
      T('Guna pengembangan dan penyempurnaan sistem informasi aplikasi '),
      TItalic('RockyTen'),
      T(' di masa yang akan datang, penulis memberikan beberapa saran konstruktif:'),
    ]),
    ListItem('1', [
      TBold('Integrasi Notifikasi Otomatis (WhatsApp API): '),
      T('Disarankan untuk menambahkan fitur bot notifikasi otomatis terintegrasi dengan WhatsApp Business API guna mengingatkan PIC divisi terkait tugas To-Do yang mendekati tenggat waktu dan jadwal rapat L10 mingguan.'),
    ]),
    ListItem('2', [
      TBold('Modul Ekspor Laporan Formal (PDF & Excel): '),
      T('Disarankan untuk melengkapi modul pelaporan dengan kemampuan ekspor rekapitulasi capaian Scoreboard dan evaluasi kuartalan Rocks ke dalam berkas format PDF dan Microsoft Excel untuk kebutuhan audit korporasi berkala.'),
    ]),
    ListItem('3', [
      TBold('Fitur Audit Trail (Riwayat Aktivitas Rinci): '),
      T('Disarankan untuk meningkatkan kapabilitas log audit sistem dengan mencatat riwayat setiap perubahan nilai target dan penghapusan data secara mendalam guna memperkuat transparansi akuntabilitas tim.'),
    ]),
    ListItem('4', [
      TBold('Autentikasi Ganda (Two-Factor Authentication / 2FA): '),
      T('Disarankan untuk menerapkan mekanisme keamanan verifikasi dua langkah (2FA) melalui email atau aplikasi autentikator, khususnya pada akun dengan hak akses tingkat Owner dan Developer.'),
    ]),
    ListItem('5', [
      TBold('Pengembangan Aplikasi Mobile Native (Android / iOS): '),
      T('Disarankan untuk mengembangkan aplikasi versi mobile native guna memberikan kemudahan pemantauan metrik secara lebih fleksibel bagi para manajer operasional yang memiliki mobilitas tinggi di luar outlet gerai.'),
    ]),
  ];
}

module.exports = {
  getBab3Children,
};
