const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

const SUPABASE_URL = "https://pmnswfpwwsylqlttjzvd.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtbnN3ZnB3d3N5bHFsdHRqenZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1NzAxOTMsImV4cCI6MjEwNjE0NjE5M30.DYjD2yOz7VhXR9JOmnOBJ7J1oeoTX2LD2L0UueqQ8eM";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 1. DATA ROCKS (10 Batu Sasaran Kuartal Q2 & Q3 2026)
const ROCKS = [
  {
    id: "rock-kitch-1",
    department_id: "dept-kitchen",
    title: "Standarisasi Resep Bumbu Inti & SOP Dapur 5 Cabang",
    description: "Memastikan konsistensi rasa sambal gerilya, bumbu ungkep ayam, dan kuah gulai di seluruh lini operasional dapur tanpa deviasi.",
    quarter: "Q3",
    year: 2026,
    status: "on_track",
    pic_id: "prof-pic-kitchen",
    pic_name: "Kitchen",
    due_date: "2026-09-30",
    created_at: "2026-07-01T08:00:00.000Z"
  },
  {
    id: "rock-kitch-2",
    department_id: "dept-kitchen",
    title: "Optimalisasi Food Cost & Waste Management di Bawah 28%",
    description: "Penerapan sistem FIFO ketat, timbangan digital bahan baku, dan kontrol porsi otomatis untuk menekan food waste.",
    quarter: "Q3",
    year: 2026,
    status: "on_track",
    pic_id: "prof-pic-kitchen",
    pic_name: "Kitchen",
    due_date: "2026-09-30",
    created_at: "2026-07-01T08:30:00.000Z"
  },
  {
    id: "rock-serv-1",
    department_id: "dept-service",
    title: "Peningkatan Customer Satisfaction Index (CSI) 4.8/5.0 Bintang",
    description: "Meningkatkan kualitas interaksi pelanggan, hospitality ramah, kebersihan area meja, dan kecepatan respon pelayanan.",
    quarter: "Q3",
    year: 2026,
    status: "on_track",
    pic_id: "prof-pic-service",
    pic_name: "Service",
    due_date: "2026-09-30",
    created_at: "2026-07-01T09:00:00.000Z"
  },
  {
    id: "rock-serv-2",
    department_id: "dept-service",
    title: "Program Pelatihan Hospitality & Up-selling Tim Front of House",
    description: "Sertifikasi 100% staf floor dan kasir dalam teknik cross-selling menu dessert dan minuman pendamping.",
    quarter: "Q2",
    year: 2026,
    status: "done",
    pic_id: "prof-pic-service",
    pic_name: "Service",
    due_date: "2026-06-30",
    created_at: "2026-04-01T08:00:00.000Z"
  },
  {
    id: "rock-mkt-1",
    department_id: "dept-marketing",
    title: "Kampanye Branding Nasi Gerilya Pedas Juara 2.0 (1.5M Impresi)",
    description: "Aktivasi konten viral TikTok/Reels bersama 15 micro-influencer kuliner dan promo bundling jam makan siang.",
    quarter: "Q3",
    year: 2026,
    status: "on_track",
    pic_id: "prof-pic-marketing",
    pic_name: "Marketing",
    due_date: "2026-09-30",
    created_at: "2026-07-01T09:15:00.000Z"
  },
  {
    id: "rock-mkt-2",
    department_id: "dept-marketing",
    title: "Ekspansi Kerjasama Corporate Catering 15 Perusahaan",
    description: "Penetrasi paket lunch box langganan kantor di kawasan perkantoran Sudirman, Thamrin, dan Kuningan.",
    quarter: "Q3",
    year: 2026,
    status: "off_track",
    pic_id: "prof-pic-marketing",
    pic_name: "Marketing",
    due_date: "2026-09-15",
    created_at: "2026-07-01T09:30:00.000Z"
  },
  {
    id: "rock-fin-1",
    department_id: "dept-finance",
    title: "Otomasi Rekonsiliasi Kas Harian & Nol Selisih Kas Bon Kasir",
    description: "Integrasi sistem pembukuan harian dengan mutasi bank real-time dan settlement QRIS otomatis.",
    quarter: "Q3",
    year: 2026,
    status: "on_track",
    pic_id: "prof-pic-finance",
    pic_name: "Finance",
    due_date: "2026-09-30",
    created_at: "2026-07-01T10:00:00.000Z"
  },
  {
    id: "rock-fin-2",
    department_id: "dept-finance",
    title: "Optimalisasi Operating Cash Flow Margin di Atas 22%",
    description: "Pengendalian biaya overhead, negosiasi term of payment 30 hari ke supplier utama, dan audit stok opname mingguan.",
    quarter: "Q3",
    year: 2026,
    status: "on_track",
    pic_id: "prof-pic-finance",
    pic_name: "Finance",
    due_date: "2026-09-30",
    created_at: "2026-07-01T10:15:00.000Z"
  },
  {
    id: "rock-it-1",
    department_id: "dept-it",
    title: "Mencapai Full Stability System (FSS) & Zero POS Downtime",
    description: "Redundansi dual-ISP dengan failover otomatis dan arsitektur database offline-first pada mesin kasir.",
    quarter: "Q3",
    year: 2026,
    status: "on_track",
    pic_id: "prof-pic-it",
    pic_name: "IT",
    due_date: "2026-09-30",
    created_at: "2026-07-01T10:30:00.000Z"
  },
  {
    id: "rock-it-2",
    department_id: "dept-it",
    title: "Pembaruan Infrastruktur Jaringan Wi-Fi Publik & KDS Dapur",
    description: "Pemasangan 3 access point WiFi 6 terisolasi dan layar Kitchen Display System tahan panas dan uap di area masak.",
    quarter: "Q2",
    year: 2026,
    status: "done",
    pic_id: "prof-pic-it",
    pic_name: "IT",
    due_date: "2026-06-30",
    created_at: "2026-04-01T09:00:00.000Z"
  }
];

// 2. DATA METRICS (15 Metrik KPI across 5 Departemen)
const METRICS = [
  // Kitchen
  {
    id: "met-kitch-1",
    department_id: "dept-kitchen",
    name: "Food Cost Percentage",
    target: 28,
    unit: "percentage",
    target_type: "lower_better",
    pic_id: "prof-pic-kitchen",
    pic_name: "Kitchen",
    keterangan: "Batas maksimal biaya bahan baku terhadap omset makanan. Target di bawah 28%.",
    is_active: true,
    cycle_type: "monthly",
    duration_days: 7,
    deadline: null,
    accumulation_mode: "average",
    created_at: "2026-07-01T11:00:00.000Z"
  },
  {
    id: "met-kitch-2",
    department_id: "dept-kitchen",
    name: "Kitchen Ticket Time (Kecepatan Sajian)",
    target: 12,
    unit: "number",
    target_type: "lower_better",
    pic_id: "prof-pic-kitchen",
    pic_name: "Kitchen",
    keterangan: "Rata-rata waktu penyajian dari tiket kasir masuk hingga makanan siap disajikan (menit).",
    is_active: true,
    cycle_type: "monthly",
    duration_days: 7,
    deadline: null,
    accumulation_mode: "average",
    created_at: "2026-07-01T11:05:00.000Z"
  },
  {
    id: "met-kitch-3",
    department_id: "dept-kitchen",
    name: "Waste Bahan Makanan Harian",
    target: 2.5,
    unit: "percentage",
    target_type: "lower_better",
    pic_id: "prof-pic-kitchen",
    pic_name: "Kitchen",
    keterangan: "Persentase bahan mentah atau makanan jadi yang terbuang karena kadaluarsa / rusak.",
    is_active: true,
    cycle_type: "monthly",
    duration_days: 7,
    deadline: null,
    accumulation_mode: "average",
    created_at: "2026-07-01T11:10:00.000Z"
  },

  // Service
  {
    id: "met-serv-1",
    department_id: "dept-service",
    name: "Rating Kepuasan Pelanggan (CSI)",
    target: 4.8,
    unit: "number",
    target_type: "higher_better",
    pic_id: "prof-pic-service",
    pic_name: "Service",
    keterangan: "Rata-rata rating ulasan pelanggan dari Google Maps dan formulir feedback meja (skala 1-5).",
    is_active: true,
    cycle_type: "monthly",
    duration_days: 7,
    deadline: null,
    accumulation_mode: "average",
    created_at: "2026-07-01T11:15:00.000Z"
  },
  {
    id: "met-serv-2",
    department_id: "dept-service",
    name: "Add-on Rate Minuman & Dessert",
    target: 35,
    unit: "percentage",
    target_type: "higher_better",
    pic_id: "prof-pic-service",
    pic_name: "Service",
    keterangan: "Persentase struk transaksi yang menyertakan pesanan minuman khusus atau makanan penutup.",
    is_active: true,
    cycle_type: "monthly",
    duration_days: 7,
    deadline: null,
    accumulation_mode: "average",
    created_at: "2026-07-01T11:20:00.000Z"
  },
  {
    id: "met-serv-3",
    department_id: "dept-service",
    name: "Table Turnaround Time Jam Sibuk",
    target: 45,
    unit: "number",
    target_type: "lower_better",
    pic_id: "prof-pic-service",
    pic_name: "Service",
    keterangan: "Durasi rata-rata pelanggan menempati meja saat jam makan siang dan malam (menit).",
    is_active: true,
    cycle_type: "monthly",
    duration_days: 7,
    deadline: null,
    accumulation_mode: "average",
    created_at: "2026-07-01T11:25:00.000Z"
  },

  // Marketing
  {
    id: "met-mkt-1",
    department_id: "dept-marketing",
    name: "Total Transaksi Penjualan Mingguan",
    target: 3150,
    unit: "number",
    target_type: "higher_better",
    pic_id: "prof-pic-marketing",
    pic_name: "Marketing",
    keterangan: "Jumlah total struk penjualan berhasil (dine-in, takeaway, dan online delivery) per pekan.",
    is_active: true,
    cycle_type: "monthly",
    duration_days: 7,
    deadline: null,
    accumulation_mode: "sum",
    created_at: "2026-07-01T11:30:00.000Z"
  },
  {
    id: "met-mkt-2",
    department_id: "dept-marketing",
    name: "Omset Penjualan Bersih Mingguan",
    target: 125000000,
    unit: "currency",
    target_type: "higher_better",
    pic_id: "prof-pic-marketing",
    pic_name: "Marketing",
    keterangan: "Total pendapatan kotor dikurangi diskon & promo sebelum pajak dalam 1 pekan.",
    is_active: true,
    cycle_type: "monthly",
    duration_days: 7,
    deadline: null,
    accumulation_mode: "sum",
    created_at: "2026-07-01T11:35:00.000Z"
  },
  {
    id: "met-mkt-3",
    department_id: "dept-marketing",
    name: "Engagement Rate Media Sosial",
    target: 8.5,
    unit: "percentage",
    target_type: "higher_better",
    pic_id: "prof-pic-marketing",
    pic_name: "Marketing",
    keterangan: "Rasio interaksi (likes, comments, shares, saves) per total views di akun TikTok & IG Nasi Gerilya.",
    is_active: true,
    cycle_type: "monthly",
    duration_days: 7,
    deadline: null,
    accumulation_mode: "average",
    created_at: "2026-07-01T11:40:00.000Z"
  },

  // Finance
  {
    id: "met-fin-1",
    department_id: "dept-finance",
    name: "Gross Profit Margin (GPM)",
    target: 65,
    unit: "percentage",
    target_type: "higher_better",
    pic_id: "prof-pic-finance",
    pic_name: "Finance",
    keterangan: "Marjin laba kotor terhadap omset penjualan setelah dikurangi HPP bahan baku.",
    is_active: true,
    cycle_type: "monthly",
    duration_days: 7,
    deadline: null,
    accumulation_mode: "average",
    created_at: "2026-07-01T11:45:00.000Z"
  },
  {
    id: "met-fin-2",
    department_id: "dept-finance",
    name: "Total Selisih Kasir Mingguan",
    target: 0,
    unit: "currency",
    target_type: "lower_better",
    pic_id: "prof-pic-finance",
    pic_name: "Finance",
    keterangan: "Total selisih fisik uang kas kasir dengan catatan sistem POS di akhir shift mingguan.",
    is_active: true,
    cycle_type: "monthly",
    duration_days: 7,
    deadline: null,
    accumulation_mode: "sum",
    created_at: "2026-07-01T11:50:00.000Z"
  },
  {
    id: "met-fin-3",
    department_id: "dept-finance",
    name: "Ketepatan Waktu Pembayaran Vendor",
    target: 98,
    unit: "percentage",
    target_type: "higher_better",
    pic_id: "prof-pic-finance",
    pic_name: "Finance",
    keterangan: "Persentase tagihan supplier bahan makanan yang diselesaikan sebelum jatuh tempo invoice.",
    is_active: true,
    cycle_type: "monthly",
    duration_days: 7,
    deadline: null,
    accumulation_mode: "average",
    created_at: "2026-07-01T11:55:00.000Z"
  },

  // IT
  {
    id: "met-it-1",
    department_id: "dept-it",
    name: "Uptime Sistem POS & Cloud Server",
    target: 99.8,
    unit: "percentage",
    target_type: "higher_better",
    pic_id: "prof-pic-it",
    pic_name: "IT",
    keterangan: "Persentase waktu aktif sistem kasir, printer dapur, dan sinkronisasi server tanpa downtime.",
    is_active: true,
    cycle_type: "monthly",
    duration_days: 7,
    deadline: null,
    accumulation_mode: "average",
    created_at: "2026-07-01T12:00:00.000Z"
  },
  {
    id: "met-it-2",
    department_id: "dept-it",
    name: "Waktu Respons Penanganan Tiket IT",
    target: 20,
    unit: "number",
    target_type: "lower_better",
    pic_id: "prof-pic-it",
    pic_name: "IT",
    keterangan: "Mean Time to Resolve (MTTR) penanganan kendala hardware/software kasir dan jaringan (menit).",
    is_active: true,
    cycle_type: "monthly",
    duration_days: 7,
    deadline: null,
    accumulation_mode: "average",
    created_at: "2026-07-01T12:05:00.000Z"
  },
  {
    id: "met-it-3",
    department_id: "dept-it",
    name: "Sukses Backup Database Harian",
    target: 100,
    unit: "percentage",
    target_type: "higher_better",
    pic_id: "prof-pic-it",
    pic_name: "IT",
    keterangan: "Persentase keberhasilan snapshot data transaksi dan log sistem ke secondary storage.",
    is_active: true,
    cycle_type: "monthly",
    duration_days: 7,
    deadline: null,
    accumulation_mode: "average",
    created_at: "2026-07-01T12:10:00.000Z"
  }
];

// Helper to generate daily values & calculate aggregate
function createMetricValues() {
  const values = [];

  // Data generator table per metric
  const specs = {
    "met-kitch-1": { // target: 28 lower_better avg
      m6: [
        [27.6, 28.1, 27.8, 28.5, 27.9, 27.4, 27.2], // avg: 27.8
        [26.9, 27.3, 27.1, 27.5, 26.8, 27.0, 26.7], // avg: 27.0
        [27.2, 26.8, 27.0, 27.4, 26.9, 26.5, 26.8], // avg: 26.9
        [28.4, 28.9, 29.5, 28.8, 29.1, 28.6, 28.3]  // avg: 28.8 (off track)
      ],
      m7: [
        [27.5, 27.8, 27.2, 27.6, 27.4, 27.0, 27.1], // avg: 27.4
        [26.8, 27.1, 26.5, 26.9, 27.0, 26.6, 26.4], // avg: 26.8
        [26.5, 26.7, 26.2, 26.4, null, null, null]  // avg: 26.5
      ]
    },
    "met-kitch-2": { // target: 12 lower_better avg
      m6: [
        [11.5, 12.1, 11.8, 13.2, 12.8, 11.4, 11.0], // avg: 12.0
        [10.8, 11.2, 10.9, 11.5, 11.0, 10.7, 10.5], // avg: 10.9
        [11.2, 10.9, 11.1, 11.4, 11.0, 10.6, 10.8], // avg: 11.0
        [12.8, 13.5, 14.2, 13.6, 13.0, 12.5, 12.2]  // avg: 13.1
      ],
      m7: [
        [11.2, 11.6, 11.0, 11.8, 11.4, 10.8, 10.9], // avg: 11.2
        [10.5, 10.8, 10.2, 10.6, 10.7, 10.3, 10.1], // avg: 10.5
        [10.2, 10.5, 9.8, 10.1, null, null, null]   // avg: 10.2
      ]
    },
    "met-kitch-3": { // target: 2.5 lower_better avg
      m6: [
        [2.3, 2.6, 2.4, 2.8, 2.5, 2.2, 2.1], // avg: 2.4
        [2.1, 2.2, 2.0, 2.3, 2.1, 1.9, 1.8], // avg: 2.1
        [2.2, 2.0, 2.1, 2.4, 2.2, 1.9, 2.0], // avg: 2.1
        [2.7, 3.1, 3.4, 2.9, 2.8, 2.6, 2.5]  // avg: 2.9 (warning)
      ],
      m7: [
        [2.2, 2.4, 2.1, 2.3, 2.2, 2.0, 1.9], // avg: 2.2
        [1.9, 2.1, 1.8, 2.0, 2.0, 1.8, 1.7], // avg: 1.9
        [1.8, 1.9, 1.7, 1.8, null, null, null] // avg: 1.8
      ]
    },
    "met-serv-1": { // target: 4.8 higher_better avg
      m6: [
        [4.8, 4.9, 4.8, 4.7, 4.8, 4.9, 4.9], // avg: 4.83
        [4.9, 4.9, 4.8, 4.9, 4.9, 5.0, 4.9], // avg: 4.90
        [4.8, 4.8, 4.7, 4.8, 4.9, 4.9, 4.8], // avg: 4.81
        [4.6, 4.7, 4.6, 4.7, 4.8, 4.8, 4.7]  // avg: 4.70 (slightly below)
      ],
      m7: [
        [4.8, 4.9, 4.8, 4.9, 4.9, 5.0, 4.9], // avg: 4.89
        [4.9, 5.0, 4.9, 4.9, 5.0, 5.0, 4.9], // avg: 4.94
        [4.9, 5.0, 4.8, 5.0, null, null, null] // avg: 4.93
      ]
    },
    "met-serv-2": { // target: 35 higher_better avg
      m6: [
        [34.2, 35.8, 36.1, 37.4, 38.2, 39.5, 38.0], // avg: 37.0
        [35.5, 36.2, 35.9, 37.1, 38.0, 39.2, 38.5], // avg: 37.2
        [34.8, 35.2, 35.0, 36.4, 37.5, 38.8, 37.9], // avg: 36.5
        [32.1, 33.4, 32.8, 33.9, 34.5, 35.2, 34.0]  // avg: 33.7
      ],
      m7: [
        [36.2, 37.1, 36.5, 38.0, 39.2, 40.5, 39.8], // avg: 38.2
        [37.5, 38.8, 38.2, 39.5, 41.0, 42.4, 41.2], // avg: 39.8
        [38.2, 39.5, 38.8, 40.2, null, null, null]  // avg: 39.2
      ]
    },
    "met-serv-3": { // target: 45 lower_better avg
      m6: [
        [44, 45, 43, 46, 47, 48, 45], // avg: 45.4
        [42, 43, 41, 44, 45, 46, 43], // avg: 43.4
        [43, 44, 42, 45, 46, 47, 44], // avg: 44.4
        [47, 49, 51, 48, 50, 52, 49]  // avg: 49.4 (red)
      ],
      m7: [
        [43, 44, 42, 44, 45, 46, 43], // avg: 43.9
        [41, 42, 40, 43, 44, 45, 42], // avg: 42.4
        [40, 41, 39, 42, null, null, null] // avg: 40.5
      ]
    },
    "met-mkt-1": { // target: 3150 higher_better sum
      m6: [
        [420, 440, 435, 460, 510, 580, 540], // sum: 3385
        [430, 450, 440, 470, 520, 600, 560], // sum: 3470
        [425, 445, 430, 465, 515, 590, 550], // sum: 3420
        [390, 410, 400, 425, 470, 530, 490]  // sum: 3115 (close to target)
      ],
      m7: [
        [440, 465, 450, 485, 540, 620, 580], // sum: 3580
        [455, 480, 470, 505, 565, 650, 610], // sum: 3735
        [460, 490, 475, 510, null, null, null] // sum: 1935 (partial week)
      ]
    },
    "met-mkt-2": { // target: 125000000 higher_better sum
      m6: [
        [16800000, 17500000, 17200000, 18400000, 21200000, 24800000, 22600000], // sum: 138,500,000
        [17200000, 18100000, 17800000, 18900000, 22100000, 25600000, 23400000], // sum: 143,100,000
        [16900000, 17600000, 17400000, 18600000, 21800000, 25100000, 22900000], // sum: 140,300,000
        [15200000, 16100000, 15800000, 16900000, 19500000, 22400000, 20800000]  // sum: 126,700,000
      ],
      m7: [
        [17800000, 18900000, 18400000, 19600000, 23200000, 26900000, 24500000], // sum: 149,300,000
        [18500000, 19600000, 19100000, 20400000, 24100000, 28200000, 25800000], // sum: 155,700,000
        [18800000, 20100000, 19500000, 20900000, null, null, null]              // sum: 79,300,000 (partial)
      ]
    },
    "met-mkt-3": { // target: 8.5 higher_better avg
      m6: [
        [8.2, 8.6, 8.4, 8.9, 9.4, 10.2, 9.8], // avg: 9.07
        [8.5, 8.9, 8.7, 9.2, 9.8, 10.6, 10.1], // avg: 9.39
        [8.3, 8.7, 8.5, 9.0, 9.5, 10.3, 9.9], // avg: 9.17
        [7.4, 7.8, 7.6, 8.1, 8.5, 9.1, 8.7]   // avg: 8.17 (yellow)
      ],
      m7: [
        [8.8, 9.2, 9.0, 9.6, 10.2, 11.0, 10.5], // avg: 9.76
        [9.2, 9.6, 9.4, 10.1, 10.8, 11.8, 11.2], // avg: 10.3
        [9.5, 9.9, 9.7, 10.4, null, null, null]  // avg: 9.88
      ]
    },
    "met-fin-1": { // target: 65 higher_better avg
      m6: [
        [65.4, 66.1, 65.8, 66.5, 67.2, 68.0, 67.5], // avg: 66.6
        [66.0, 66.8, 66.3, 67.1, 67.8, 68.5, 68.1], // avg: 67.2
        [65.7, 66.4, 66.0, 66.8, 67.4, 68.2, 67.7], // avg: 66.9
        [63.8, 64.5, 64.1, 64.9, 65.4, 66.1, 65.6]  // avg: 64.9 (close)
      ],
      m7: [
        [66.2, 67.0, 66.5, 67.3, 68.1, 69.0, 68.4], // avg: 67.5
        [67.1, 67.9, 67.4, 68.2, 69.0, 70.1, 69.3], // avg: 68.4
        [67.5, 68.2, 67.8, 68.6, null, null, null]  // avg: 68.0
      ]
    },
    "met-fin-2": { // target: 0 lower_better sum
      m6: [
        [0, 15000, 0, 0, 25000, 0, 0], // sum: 40000
        [0, 0, 0, 10000, 0, 0, 0],     // sum: 10000
        [0, 0, 0, 0, 0, 15000, 0],     // sum: 15000
        [25000, 0, 35000, 0, 50000, 0, 0] // sum: 110000 (red)
      ],
      m7: [
        [0, 0, 0, 0, 15000, 0, 0],     // sum: 15000
        [0, 0, 0, 0, 0, 0, 0],         // sum: 0 (perfect!)
        [0, 0, 0, 0, null, null, null] // sum: 0
      ]
    },
    "met-fin-3": { // target: 98 higher_better avg
      m6: [
        [98.5, 99.0, 98.8, 99.2, 99.5, 100.0, 99.8], // avg: 99.3
        [99.0, 99.5, 99.2, 99.8, 100.0, 100.0, 99.9], // avg: 99.6
        [98.8, 99.2, 99.0, 99.5, 99.8, 100.0, 99.7], // avg: 99.4
        [96.2, 97.0, 96.5, 97.4, 98.0, 98.5, 98.1]  // avg: 97.4 (yellow)
      ],
      m7: [
        [99.2, 99.6, 99.4, 99.8, 100.0, 100.0, 99.9], // avg: 99.7
        [99.5, 100.0, 99.8, 100.0, 100.0, 100.0, 100.0], // avg: 99.9
        [100.0, 100.0, 100.0, 100.0, null, null, null]   // avg: 100.0
      ]
    },
    "met-it-1": { // target: 99.8 higher_better avg
      m6: [
        [99.9, 100.0, 99.9, 99.8, 100.0, 100.0, 99.9], // avg: 99.93
        [100.0, 100.0, 99.9, 100.0, 100.0, 100.0, 100.0], // avg: 99.99
        [99.9, 99.9, 99.8, 100.0, 100.0, 100.0, 99.9], // avg: 99.93
        [98.5, 99.1, 98.9, 99.2, 99.5, 99.8, 99.6]  // avg: 99.23 (warning)
      ],
      m7: [
        [100.0, 100.0, 99.9, 100.0, 100.0, 100.0, 100.0], // avg: 99.99
        [100.0, 100.0, 100.0, 100.0, 100.0, 100.0, 100.0], // avg: 100.0
        [100.0, 100.0, 100.0, 100.0, null, null, null]     // avg: 100.0
      ]
    },
    "met-it-2": { // target: 20 lower_better avg
      m6: [
        [18, 19, 17, 21, 22, 19, 18], // avg: 19.1
        [16, 17, 15, 18, 19, 17, 16], // avg: 16.9
        [17, 18, 16, 19, 20, 18, 17], // avg: 17.9
        [22, 25, 27, 24, 26, 23, 21]  // avg: 24.0 (red)
      ],
      m7: [
        [16, 17, 15, 18, 19, 16, 15], // avg: 16.6
        [14, 15, 13, 16, 17, 15, 14], // avg: 14.9
        [13, 14, 12, 15, null, null, null] // avg: 13.5
      ]
    },
    "met-it-3": { // target: 100 higher_better avg
      m6: [
        [100, 100, 100, 100, 100, 100, 100], // avg: 100
        [100, 100, 100, 100, 100, 100, 100], // avg: 100
        [100, 100, 100, 100, 100, 100, 100], // avg: 100
        [100, 0, 100, 100, 100, 100, 100]    // avg: 85.7 (red, 1 fail)
      ],
      m7: [
        [100, 100, 100, 100, 100, 100, 100], // avg: 100
        [100, 100, 100, 100, 100, 100, 100], // avg: 100
        [100, 100, 100, 100, null, null, null] // avg: 100
      ]
    }
  };

  METRICS.forEach(m => {
    const spec = specs[m.id];
    if (!spec) return;

    // Month 6 (June 2026) - Weeks 1..4
    spec.m6.forEach((daily, idx) => {
      const week = idx + 1;
      const valid = daily.filter(v => v !== null && v !== undefined);
      let aggregated = null;
      if (valid.length > 0) {
        if (m.accumulation_mode === "sum") {
          aggregated = valid.reduce((a, b) => a + b, 0);
        } else {
          aggregated = Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 10) / 10;
        }
      }
      values.push({
        id: `mv-${m.id}-2026-6-${week}`,
        metric_id: m.id,
        year: 2026,
        month: 6,
        week: week,
        value: aggregated,
        inputted_by: m.pic_id,
        daily_values: daily,
        updated_at: `2026-06-${week * 7 < 10 ? '0' + week * 7 : week * 7}T18:00:00.000Z`
      });
    });

    // Month 7 (July 2026) - Weeks 1..3
    spec.m7.forEach((daily, idx) => {
      const week = idx + 1;
      const valid = daily.filter(v => v !== null && v !== undefined);
      let aggregated = null;
      if (valid.length > 0) {
        if (m.accumulation_mode === "sum") {
          aggregated = valid.reduce((a, b) => a + b, 0);
        } else {
          aggregated = Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 10) / 10;
        }
      }
      values.push({
        id: `mv-${m.id}-2026-7-${week}`,
        metric_id: m.id,
        year: 2026,
        month: 7,
        week: week,
        value: aggregated,
        inputted_by: m.pic_id,
        daily_values: daily,
        updated_at: `2026-07-${week * 7 < 10 ? '0' + week * 7 : week * 7}T18:00:00.000Z`
      });
    });
  });

  return values;
}

// 3. DATA TODOS (15 Agenda Tugas 7 Hari across 5 Departemen)
const TODOS = [
  // Kitchen
  {
    id: "todo-kitch-1",
    department_id: "dept-kitchen",
    title: "Audit Berkala Suhu Chiller & Deep Freezer Dapur",
    description: "Pemeriksaan log suhu harian chiller (target 2-4°C) dan freezer (target -18°C) untuk mencegah kontaminasi daging ayam.",
    priority: "high",
    deadline: "2026-07-16",
    status: "completed",
    created_by: "prof-pic-kitchen",
    attachments: [{ name: "form_log_suhu_chiller_w2.pdf", size: 184000, type: "application/pdf" }]
  },
  {
    id: "todo-kitch-2",
    department_id: "dept-kitchen",
    title: "Penyusunan Jadwal Deep Cleaning Exhaust Hood & Saluran Minyak",
    description: "Koordinasi dengan vendor cleaning spesialis untuk pembersihan kerak minyak exhaust hood dapur demi pencegahan risiko kebakaran.",
    priority: "medium",
    deadline: "2026-07-22",
    status: "pending",
    created_by: "prof-pic-kitchen",
    attachments: []
  },
  {
    id: "todo-kitch-3",
    department_id: "dept-kitchen",
    title: "Uji Coba Batch Tester Resep Menu Nasi Pedas Cumi Hitam",
    description: "Trial cooking 20 porsi sample menu baru bersama tim Chef & evaluasi daya simpan bumbu cumi di suhu chiller.",
    priority: "high",
    deadline: "2026-07-25",
    status: "pending",
    created_by: "prof-pic-kitchen",
    attachments: [{ name: "lembar_skor_blind_taste.xlsx", size: 92000, type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }]
  },

  // Service
  {
    id: "todo-serv-1",
    department_id: "dept-service",
    title: "Pelatihan Ulang Standar Table Setup & Greeting 5S",
    description: "Briefing dan roleplay 30 menit bagi seluruh waiter dan kasir terkait senyum, salam, dan penawaran menu minuman signature.",
    priority: "medium",
    deadline: "2026-07-15",
    status: "completed",
    created_by: "prof-pic-service",
    attachments: []
  },
  {
    id: "todo-serv-2",
    department_id: "dept-service",
    title: "Pengecekan Stok Sendok, Garpu, & Piring Saji Keramik",
    description: "Inventarisasi peralatan makan saji lantai 1 dan 2 untuk mengantisipasi lonjakan tamu pada akhir pekan.",
    priority: "low",
    deadline: "2026-07-17",
    status: "completed",
    created_by: "prof-pic-service",
    attachments: []
  },
  {
    id: "todo-serv-3",
    department_id: "dept-service",
    title: "Pemasangan Barcode QR Feedback & Menu Digital Meja 1 - 24",
    description: "Memasang akrilik stand barcode baru di setiap meja makan agar pelanggan dapat langsung memberikan review Google Maps.",
    priority: "high",
    deadline: "2026-07-23",
    status: "pending",
    created_by: "prof-pic-service",
    attachments: [{ name: "desain_akrilik_qr_meja.png", size: 312000, type: "image/png" }]
  },

  // Marketing
  {
    id: "todo-mkt-1",
    department_id: "dept-marketing",
    title: "Produksi Konten Video TikTok 'Behind The Scene Bumbu Gerilya'",
    description: "Shooting proses pembuatan sambal rahasia dari 50kg cabai segar untuk mendongkrak brand awareness organik.",
    priority: "high",
    deadline: "2026-07-21",
    status: "pending",
    created_by: "prof-pic-marketing",
    attachments: [{ name: "storyboard_tiktok_sambal.pdf", size: 420000, type: "application/pdf" }]
  },
  {
    id: "todo-mkt-2",
    department_id: "dept-marketing",
    title: "Distribusi Brosur Paket Katering Bento ke Gedung Sudirman",
    description: "Penyebaran 500 leaflet promosi corporate discount 15% ke resepsionis gedung perkantoran tier 1.",
    priority: "medium",
    deadline: "2026-07-24",
    status: "pending",
    created_by: "prof-pic-marketing",
    attachments: []
  },
  {
    id: "todo-mkt-3",
    department_id: "dept-marketing",
    title: "Setting Kampanye Meta Ads Promo Gajian Payday Special",
    description: "Memasang target audiens radius 5km outlet dengan materi promo voucher diskon 20% dine-in.",
    priority: "high",
    deadline: "2026-07-18",
    status: "completed",
    created_by: "prof-pic-marketing",
    attachments: [{ name: "banner_payday_promo.jpg", size: 285000, type: "image/jpeg" }]
  },

  // Finance
  {
    id: "todo-fin-1",
    department_id: "dept-finance",
    title: "Rekonsiliasi Settlement EDC & QRIS Bank BCA / Mandiri W2",
    description: "Pencocokan mutasi rekening penampungan dengan rekap laporan transaksi POS kasir periode 8-14 Juli.",
    priority: "high",
    deadline: "2026-07-16",
    status: "completed",
    created_by: "prof-pic-finance",
    attachments: [{ name: "rekap_settlement_w2_juli.xlsx", size: 145000, type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }]
  },
  {
    id: "todo-fin-2",
    department_id: "dept-finance",
    title: "Pengecekan Invoice Faktur Pajak Supplier Ayam & Beras",
    description: "Validasi nominal faktur dengan purchase order dan surat jalan penerimaan barang dari tim kitchen.",
    priority: "medium",
    deadline: "2026-07-22",
    status: "pending",
    created_by: "prof-pic-finance",
    attachments: []
  },
  {
    id: "todo-fin-3",
    department_id: "dept-finance",
    title: "Penyusunan Draft Proyeksi Cash Flow Operasional Agustus 2026",
    description: "Menghitung estimasi penerimaan omset dan alokasi pembayaran sewa tempat, gaji karyawan, dan HPP bahan baku.",
    priority: "high",
    deadline: "2026-07-26",
    status: "pending",
    created_by: "prof-pic-finance",
    attachments: []
  },

  // IT
  {
    id: "todo-it-1",
    department_id: "dept-it",
    title: "Penggantian Kabel Patch UTP Cat6 Switch Kasir 1 & 2",
    description: "Mengganti kabel LAN lama yang sering goyang untuk menjamin kestabilan koneksi printer thermal kasir.",
    priority: "high",
    deadline: "2026-07-17",
    status: "completed",
    created_by: "prof-pic-it",
    attachments: []
  },
  {
    id: "todo-it-2",
    department_id: "dept-it",
    title: "Uji Coba Script Auto-Sync Database ke Secondary Storage",
    description: "Simulasi recovery restore data SQLite/PostgreSQL untuk memastikan backup snapshot berjalan tanpa error.",
    priority: "medium",
    deadline: "2026-07-16",
    status: "completed",
    created_by: "prof-pic-it",
    attachments: [{ name: "backup_health_check_log.txt", size: 45000, type: "text/plain" }]
  },
  {
    id: "todo-it-3",
    department_id: "dept-it",
    title: "Pemasangan Access Point Wi-Fi Kedua Area Outdoor Lantai 2",
    description: "Instalasi perangkat WiFi 6 tambahan agar pengunjung area smoking dan outdoor mendapatkan sinyal kuat.",
    priority: "medium",
    deadline: "2026-07-24",
    status: "pending",
    created_by: "prof-pic-it",
    attachments: []
  }
];

// 4. DATA ISSUES (12 Kendala Operasional IDS across 5 Departemen)
const ISSUES = [
  // Kitchen
  {
    id: "iss-kitch-1",
    department_id: "dept-kitchen",
    title: "Kenaikan Harga Minyak Goreng & Cabai Rawit dari Pasar Induk",
    description: "Harga cabai rawit merah melonjak 35% akibat gagal panen cuaca ekstrem. Berisiko menaikkan food cost sambal gerilya jika tidak dicari pemasok alternatif.",
    priority: "high",
    status: "in_progress",
    pic_id: "prof-pic-kitchen",
    pic_name: "Kitchen",
    created_at: "2026-07-14T09:30:00.000Z",
    attachments: [{ name: "faktur_harga_pasar_induk.jpg", size: 215000, type: "image/jpeg" }]
  },
  {
    id: "iss-kitch-2",
    department_id: "dept-kitchen",
    title: "Kulkas Chiller 2 Sempat Mengalami Fluktuasi Suhu Naik ke 9°C",
    description: "Suhu chiller daging ayam naik melampaui batas aman (target 4°C). Telah dipanggil teknisi servis pendingin dan filter kondensor dibersihkan.",
    priority: "critical",
    status: "solved",
    pic_id: "prof-pic-kitchen",
    pic_name: "Kitchen",
    created_at: "2026-07-12T11:00:00.000Z",
    attachments: [{ name: "laporan_servis_kompresor.pdf", size: 142000, type: "application/pdf" }]
  },

  // Service
  {
    id: "iss-serv-1",
    department_id: "dept-service",
    title: "Antrean Kasir Menumpuk di Jam 12.30 WIB Akibat Respon Mesin EDC Lambat",
    description: "Mesin EDC BCA lambat mencetak struk saat sinyal seluler drop di jam makan siang, menyebabkan antrean 6 orang di depan meja kasir.",
    priority: "high",
    status: "in_progress",
    pic_id: "prof-pic-service",
    pic_name: "Service",
    created_at: "2026-07-16T13:00:00.000Z",
    attachments: []
  },
  {
    id: "iss-serv-2",
    department_id: "dept-service",
    title: "Komplain Pelanggan Terkait Waktu Tunggu Meja 14 Melebihi 25 Menit",
    description: "Pesanan ayam bakar madu meja 14 terlewat di antrean KDS dapur saat jam ramai Sabtu malam. Pelanggan telah diberikan complimentary dessert.",
    priority: "medium",
    status: "solved",
    pic_id: "prof-pic-service",
    pic_name: "Service",
    created_at: "2026-07-11T20:30:00.000Z",
    attachments: []
  },

  // Marketing
  {
    id: "iss-mkt-1",
    department_id: "dept-marketing",
    title: "Kemasan Bento Box Katering Pesanan 50 Porsi Rembes Kuah Gulai",
    description: "Kardus bento box lama tidak memiliki lapisan penahan minyak/kuah sehingga terjadi rembesan pada tutup saat pengiriman kurir motor.",
    priority: "critical",
    status: "solved",
    pic_id: "prof-pic-marketing",
    pic_name: "Marketing",
    created_at: "2026-07-13T10:15:00.000Z",
    attachments: [{ name: "foto_kemasan_rembes.jpg", size: 340000, type: "image/jpeg" }]
  },
  {
    id: "iss-mkt-2",
    department_id: "dept-marketing",
    title: "Biaya CPM Iklan Instagram Ads Meningkat 28% di Awal Pekan",
    description: "Efektivitas iklan promo makan siang menurun akibat tingginya kompetisi iklan kuliner di feed audiens Jakarta Selatan.",
    priority: "medium",
    status: "open",
    pic_id: "prof-pic-marketing",
    pic_name: "Marketing",
    created_at: "2026-07-15T14:40:00.000Z",
    attachments: []
  },

  // Finance
  {
    id: "iss-fin-1",
    department_id: "dept-finance",
    title: "Selisih Kasir Shift Malam Sebesar Rp 85.000 pada 16 Juli",
    description: "Ditemukan selisih fisik uang kas dengan laporan POS kasir 2. Setelah dicocokkan dengan log struk, ditemukan kesalahan kembalian tunai.",
    priority: "medium",
    status: "solved",
    pic_id: "prof-pic-finance",
    pic_name: "Finance",
    created_at: "2026-07-17T08:10:00.000Z",
    attachments: [{ name: "berita_acara_selisih_kas.pdf", size: 120000, type: "application/pdf" }]
  },
  {
    id: "iss-fin-2",
    department_id: "dept-finance",
    title: "Keterlambatan Pengiriman Faktur Pajak dari Supplier Sayuran",
    description: "Vendor sayur CV Berkah belum menyerahkan faktur pajak masa Juni sehingga menunda proses rekonsiliasi PPN masukan.",
    priority: "low",
    status: "open",
    pic_id: "prof-pic-finance",
    pic_name: "Finance",
    created_at: "2026-07-16T11:20:00.000Z",
    attachments: []
  },

  // IT
  {
    id: "iss-it-1",
    department_id: "dept-it",
    title: "Printer Kasir Thermal Sering Macet saat Cetak Struk Panjang",
    description: "Roller pemotong kertas (auto-cutter) thermal printer kasir 1 tumpul akibat serbuk kertas struk menumpuk. Perlu deep cleaning cutter.",
    priority: "medium",
    status: "solved",
    pic_id: "prof-pic-it",
    pic_name: "IT",
    created_at: "2026-07-14T16:00:00.000Z",
    attachments: []
  },
  {
    id: "iss-it-2",
    department_id: "dept-it",
    title: "Koneksi Provider Internet Backup Mengalami Latensi Tinggi",
    description: "Jaringan secondary ISP mengalami packet loss 15% sehingga perpindahan jaringan kasir saat failover terasa tersendat.",
    priority: "high",
    status: "in_progress",
    pic_id: "prof-pic-it",
    pic_name: "IT",
    created_at: "2026-07-17T15:30:00.000Z",
    attachments: [{ name: "ping_mtr_report.txt", size: 38000, type: "text/plain" }]
  },

  // Owner
  {
    id: "iss-own-1",
    department_id: "dept-kitchen",
    title: "Perluasan Area Parkir Motor Karyawan Dapur & Floor",
    description: "Parkir motor tim operasional menyita space parkir pelanggan di jam sibuk makan siang. Perlu sewa lahan penitipan sebelah outlet.",
    priority: "medium",
    status: "in_progress",
    pic_id: "prof-owner",
    pic_name: "Owner",
    created_at: "2026-07-15T16:00:00.000Z",
    attachments: []
  },
  {
    id: "iss-own-2",
    department_id: "dept-service",
    title: "Penyesuaian Jam Buka Outlet Menjadi Pukul 09.30 WIB",
    description: "Permintaan pelanggan sarapan pagi meningkat. Operasional siap buka 30 menit lebih awal mulai minggu depan.",
    priority: "low",
    status: "solved",
    pic_id: "prof-owner",
    pic_name: "Owner",
    created_at: "2026-07-10T09:00:00.000Z",
    attachments: []
  }
];

// 5. DATA HEADLINES (10 Warta Tim Nasi Gerilya)
const HEADLINES = [
  {
    id: "head-1",
    department_id: "dept-kitchen",
    title: "Menu Spesial Nasi Cakalang Suwir Tembus 1.200 Porsi di Bulan Ini!",
    content: "Apresiasi luar biasa untuk seluruh tim Kitchen! Menu kreasi baru Nasi Cakalang Suwir Pedas Asap sukses mencatat penjualan tertinggi sejak pertama kali diluncurkan. Pertahankan standar kelezatan dan kecepatan masak!",
    category: "achievement",
    author_id: "prof-owner",
    author_name: "Owner",
    created_at: "2026-07-17T10:00:00.000Z",
    attachments: [{ name: "foto_nasi_cakalang_juara.jpg", size: 280000, type: "image/jpeg" }]
  },
  {
    id: "head-2",
    department_id: "dept-marketing",
    title: "Rekor Omset Penjualan Bersih Harian Tertinggi Rp 28.5 Juta!",
    content: "Pada puncak promo akhir pekan kemarin, Nasi Gerilya berhasil memecahkan rekor omset harian tertinggi sepanjang tahun 2026. Terima kasih kepada kerja keras solid seluruh divisi dari persiapan dapur, pelayanan kasir, hingga tim promosi digital!",
    category: "achievement",
    author_id: "prof-owner",
    author_name: "Owner",
    created_at: "2026-07-13T09:00:00.000Z",
    attachments: []
  },
  {
    id: "head-3",
    department_id: "dept-service",
    title: "Rating Ulasan Google Maps Outlet Naik ke Angka Sempurna 4.9 Bintang!",
    content: "Total ulasan positif pelanggan di Google Maps kini telah melampaui 400 ulasan dengan rata-rata 4.9 bintang. Pelanggan secara khusus memuji keramahan waiter dan kebersihan area makan yang selalu terjaga.",
    category: "good_news",
    author_id: "prof-pic-service",
    author_name: "Service",
    created_at: "2026-07-16T14:30:00.000Z",
    attachments: []
  },
  {
    id: "head-4",
    department_id: "dept-service",
    title: "Seluruh Tim Front of House Meraih Sertifikasi Pelayanan Hospitality",
    content: "Selamat kepada 8 staf floor dan kasir yang telah menyelesaikan modul pelatihan Hospitality Service & Handling Complaint dengan nilai rata-rata 94%.",
    category: "good_news",
    author_id: "prof-pic-service",
    author_name: "Service",
    created_at: "2026-07-15T11:00:00.000Z",
    attachments: [{ name: "sertifikat_kelulusan_tim_service.pdf", size: 310000, type: "application/pdf" }]
  },
  {
    id: "head-5",
    department_id: "dept-marketing",
    title: "Peluncuran Paket Langganan Bento Box Korporat Mulai Senin Depan",
    content: "Mulai hari Senin tanggal 20 Juli, Nasi Gerilya resmi meluncurkan paket lunch box korporat dengan minimal pemesanan 10 pax dan gratis ongkir radius 3 km.",
    category: "announcement",
    author_id: "prof-pic-marketing",
    author_name: "Marketing",
    created_at: "2026-07-16T16:00:00.000Z",
    attachments: [{ name: "katalog_bento_box_korporat.pdf", size: 450000, type: "application/pdf" }]
  },
  {
    id: "head-6",
    department_id: "dept-kitchen",
    title: "Penerapan Standar Baru SOP Penerimaan Sayur & Daging Segar",
    content: "Diinfokan kepada seluruh cook helper bahwa setiap penerimaan bahan segar dari vendor wajib dilakukan penimbangan ulang di depan kurir dan pencatatan suhu armada pengantar.",
    category: "announcement",
    author_id: "prof-pic-kitchen",
    author_name: "Kitchen",
    created_at: "2026-07-14T08:00:00.000Z",
    attachments: []
  },
  {
    id: "head-7",
    department_id: "dept-it",
    title: "Pemberitahuan Pemeliharaan Server Cloud Hari Minggu Pukul 23.30 WIB",
    content: "Akan dilakukan update patch keamanan sistem database dan restart router utama pada hari Minggu malam setelah outlet tutup. Sinkronisasi data POS offline aktif otomatis.",
    category: "reminder",
    author_id: "prof-pic-it",
    author_name: "IT",
    created_at: "2026-07-17T17:00:00.000Z",
    attachments: []
  },
  {
    id: "head-8",
    department_id: "dept-finance",
    title: "Batas Waktu Pengumpulan Nota Reimbursement Petty Cash Tanggal 22 Juli",
    content: "Dimohon kepada seluruh PIC divisi untuk menyerahkan nota fisik pengeluaran operasional minggu ini ke bagian Finance paling lambat Rabu sore pukul 17.00 WIB.",
    category: "reminder",
    author_id: "prof-pic-finance",
    author_name: "Finance",
    created_at: "2026-07-15T15:00:00.000Z",
    attachments: []
  },
  {
    id: "head-9",
    department_id: "dept-kitchen",
    title: "Kenaikan Harga Minyak Goreng & Cabai Merah Diperkirakan Berlanjut",
    content: "Pemberitahuan dari asosiasi pasar tradisional bahwa lonjakan harga bahan baku cabai dan minyak diperkirakan bertahan hingga 2 pekan ke depan. Tim dapur dihimbau mengontrol porsi dan mencegah sisa masakan berlebih.",
    category: "bad_news",
    author_id: "prof-pic-kitchen",
    author_name: "Kitchen",
    created_at: "2026-07-14T10:00:00.000Z",
    attachments: []
  },
  {
    id: "head-10",
    department_id: "dept-it",
    title: "Kendala Gangguan Jaringan ISP Utama Mengalami Penurunan Kecepatan",
    content: "Jaringan fiber optik ISP utama di wilayah jalan utama mengalami degradasi kecepatan sejak siang hari. Koneksi kasir telah dialihkan ke backup seluler Telkomsel Orbit.",
    category: "bad_news",
    author_id: "prof-pic-it",
    author_name: "IT",
    created_at: "2026-07-16T12:45:00.000Z",
    attachments: []
  }
];

// 6. DATA HISTORY LOGS (20 Log Aktivitas Sistem)
const HISTORY_LOGS = [
  {
    id: "log-1",
    profile_id: "prof-owner",
    profile_name: "Owner",
    department_id: null,
    action: "Publikasi Headline",
    details: 'Mempublikasikan warta pencapaian: "Menu Spesial Nasi Cakalang Suwir Tembus 1.200 Porsi di Bulan Ini!"',
    created_at: "2026-07-17T10:00:00.000Z"
  },
  {
    id: "log-2",
    profile_id: "prof-pic-it",
    profile_name: "IT",
    department_id: "dept-it",
    action: "Selesaikan Todo",
    details: 'Menandai selesai tugas: "Penggantian Kabel Patch UTP Cat6 Switch Kasir 1 & 2"',
    created_at: "2026-07-17T09:30:00.000Z"
  },
  {
    id: "log-3",
    profile_id: "prof-pic-finance",
    profile_name: "Finance",
    department_id: "dept-finance",
    action: "Selesaikan Issue",
    details: 'Menyelesaikan kendala IDS: "Selisih Kasir Shift Malam Sebesar Rp 85.000 pada 16 Juli"',
    created_at: "2026-07-17T08:15:00.000Z"
  },
  {
    id: "log-4",
    profile_id: "prof-pic-marketing",
    profile_name: "Marketing",
    department_id: "dept-marketing",
    action: "Input Nilai Metrik",
    details: 'Memperbarui nilai aktual W3 Juli untuk "Omset Penjualan Bersih Mingguan": Rp 79.300.000',
    created_at: "2026-07-16T18:00:00.000Z"
  },
  {
    id: "log-5",
    profile_id: "prof-pic-kitchen",
    profile_name: "Kitchen",
    department_id: "dept-kitchen",
    action: "Input Nilai Metrik",
    details: 'Memperbarui nilai aktual W3 Juli untuk "Food Cost Percentage": 26.5%',
    created_at: "2026-07-16T17:45:00.000Z"
  },
  {
    id: "log-6",
    profile_id: "prof-pic-service",
    profile_name: "Service",
    department_id: "dept-service",
    action: "Input Nilai Metrik",
    details: 'Memperbarui nilai aktual W3 Juli untuk "Rating Kepuasan Pelanggan (CSI)": 4.93',
    created_at: "2026-07-16T17:30:00.000Z"
  },
  {
    id: "log-7",
    profile_id: "prof-pic-it",
    profile_name: "IT",
    department_id: "dept-it",
    action: "Input Nilai Metrik",
    details: 'Memperbarui nilai aktual W3 Juli untuk "Uptime Sistem POS & Cloud Server": 100.0%',
    created_at: "2026-07-16T17:15:00.000Z"
  },
  {
    id: "log-8",
    profile_id: "prof-pic-finance",
    profile_name: "Finance",
    department_id: "dept-finance",
    action: "Selesaikan Todo",
    details: 'Menandai selesai tugas: "Rekonsiliasi Settlement EDC & QRIS Bank BCA / Mandiri W2"',
    created_at: "2026-07-16T16:00:00.000Z"
  },
  {
    id: "log-9",
    profile_id: "prof-pic-kitchen",
    profile_name: "Kitchen",
    department_id: "dept-kitchen",
    action: "Selesaikan Todo",
    details: 'Menandai selesai tugas: "Audit Berkala Suhu Chiller & Deep Freezer Dapur"',
    created_at: "2026-07-16T15:30:00.000Z"
  },
  {
    id: "log-10",
    profile_id: "prof-pic-service",
    profile_name: "Service",
    department_id: "dept-service",
    action: "Tambah Todo",
    details: 'Membuat agenda tugas baru: "Pemasangan Barcode QR Feedback & Menu Digital Meja 1 - 24"',
    created_at: "2026-07-16T11:00:00.000Z"
  },
  {
    id: "log-11",
    profile_id: "prof-owner",
    profile_name: "Owner",
    department_id: "dept-service",
    action: "Selesaikan Issue",
    details: 'Menyelesaikan kendala: "Penyesuaian Jam Buka Outlet Menjadi Pukul 09.30 WIB"',
    created_at: "2026-07-15T17:00:00.000Z"
  },
  {
    id: "log-12",
    profile_id: "prof-pic-marketing",
    profile_name: "Marketing",
    department_id: "dept-marketing",
    action: "Tambah Todo",
    details: 'Membuat agenda tugas baru: "Produksi Konten Video TikTok Behind The Scene Bumbu Gerilya"',
    created_at: "2026-07-15T14:00:00.000Z"
  },
  {
    id: "log-13",
    profile_id: "prof-pic-service",
    profile_name: "Service",
    department_id: "dept-service",
    action: "Selesaikan Todo",
    details: 'Menandai selesai tugas: "Pelatihan Ulang Standar Table Setup & Greeting 5S"',
    created_at: "2026-07-15T11:30:00.000Z"
  },
  {
    id: "log-14",
    profile_id: "prof-pic-kitchen",
    profile_name: "Kitchen",
    department_id: "dept-kitchen",
    action: "Tambah Issue",
    details: 'Melaporkan kendala IDS: "Kenaikan Harga Minyak Goreng & Cabai Rawit dari Pasar Induk"',
    created_at: "2026-07-14T09:30:00.000Z"
  },
  {
    id: "log-15",
    profile_id: "prof-pic-it",
    profile_name: "IT",
    department_id: "dept-it",
    action: "Selesaikan Issue",
    details: 'Menyelesaikan kendala: "Printer Kasir Thermal Sering Macet saat Cetak Struk Panjang"',
    created_at: "2026-07-14T17:00:00.000Z"
  },
  {
    id: "log-16",
    profile_id: "prof-pic-marketing",
    profile_name: "Marketing",
    department_id: "dept-marketing",
    action: "Selesaikan Issue",
    details: 'Menyelesaikan kendala: "Kemasan Bento Box Katering Pesanan 50 Porsi Rembes Kuah Gulai"',
    created_at: "2026-07-13T16:00:00.000Z"
  },
  {
    id: "log-17",
    profile_id: "prof-owner",
    profile_name: "Owner",
    department_id: null,
    action: "Publikasi Headline",
    details: 'Mempublikasikan warta pencapaian: "Rekor Omset Penjualan Bersih Harian Tertinggi Rp 28.5 Juta!"',
    created_at: "2026-07-13T09:00:00.000Z"
  },
  {
    id: "log-18",
    profile_id: "prof-pic-kitchen",
    profile_name: "Kitchen",
    department_id: "dept-kitchen",
    action: "Selesaikan Issue",
    details: 'Menyelesaikan kendala IDS: "Kulkas Chiller 2 Sempat Mengalami Fluktuasi Suhu Naik ke 9°C"',
    created_at: "2026-07-12T15:00:00.000Z"
  },
  {
    id: "log-19",
    profile_id: "prof-pic-service",
    profile_name: "Service",
    department_id: "dept-service",
    action: "Selesaikan Issue",
    details: 'Menyelesaikan kendala: "Komplain Pelanggan Terkait Waktu Tunggu Meja 14 Melebihi 25 Menit"',
    created_at: "2026-07-11T21:00:00.000Z"
  },
  {
    id: "log-20",
    profile_id: "prof-owner",
    profile_name: "Owner",
    department_id: null,
    action: "Update Rock",
    details: 'Memperbarui progres Batu Sasaran: "Standarisasi Resep Bumbu Inti & SOP Dapur 5 Cabang"',
    created_at: "2026-07-10T14:00:00.000Z"
  }
];

async function seed() {
  console.log("🚀 Starting comprehensive dummy data seeding to Supabase...");

  // 1. Purge existing records in reverse dependency order
  console.log("🧹 Clearing old operational tables in Supabase...");
  await supabase.from("metric_values").delete().neq("id", "none");
  await supabase.from("todos").delete().neq("id", "none");
  await supabase.from("issues").delete().neq("id", "none");
  await supabase.from("headlines").delete().neq("id", "none");
  await supabase.from("history_logs").delete().neq("id", "none");
  await supabase.from("metrics").delete().neq("id", "none");
  await supabase.from("rocks").delete().neq("id", "none");

  // 2. Insert Rocks
  console.log(`📌 Inserting ${ROCKS.length} Rocks...`);
  const { error: rErr } = await supabase.from("rocks").insert(ROCKS);
  if (rErr) console.error("Error inserting rocks:", rErr);
  else console.log("✅ Rocks inserted successfully!");

  // 3. Insert Metrics
  console.log(`📊 Inserting ${METRICS.length} Metrics...`);
  const { error: mErr } = await supabase.from("metrics").insert(METRICS);
  if (mErr) console.error("Error inserting metrics:", mErr);
  else console.log("✅ Metrics inserted successfully!");

  // 4. Insert Metric Values
  const METRIC_VALUES = createMetricValues();
  console.log(`📈 Inserting ${METRIC_VALUES.length} Metric Values across June & July 2026...`);
  // Insert in batches of 25
  for (let i = 0; i < METRIC_VALUES.length; i += 25) {
    const chunk = METRIC_VALUES.slice(i, i + 25);
    const { error: vErr } = await supabase.from("metric_values").insert(chunk);
    if (vErr) console.error(`Error inserting chunk ${i}:`, vErr);
  }
  console.log("✅ Metric Values inserted successfully!");

  // 5. Insert Todos
  console.log(`📝 Inserting ${TODOS.length} Todos...`);
  const { error: tErr } = await supabase.from("todos").insert(TODOS);
  if (tErr) console.error("Error inserting todos:", tErr);
  else console.log("✅ Todos inserted successfully!");

  // 6. Insert Issues
  console.log(`⚠️ Inserting ${ISSUES.length} Issues...`);
  const { error: iErr } = await supabase.from("issues").insert(ISSUES);
  if (iErr) console.error("Error inserting issues:", iErr);
  else console.log("✅ Issues inserted successfully!");

  // 7. Insert Headlines
  console.log(`📰 Inserting ${HEADLINES.length} Headlines...`);
  const { error: hErr } = await supabase.from("headlines").insert(HEADLINES);
  if (hErr) console.error("Error inserting headlines:", hErr);
  else console.log("✅ Headlines inserted successfully!");

  // 8. Insert History Logs
  console.log(`📜 Inserting ${HISTORY_LOGS.length} History Logs...`);
  const { error: lErr } = await supabase.from("history_logs").insert(HISTORY_LOGS);
  if (lErr) console.error("Error inserting history logs:", lErr);
  else console.log("✅ History Logs inserted successfully!");

  console.log("🎉 All data seeded to Supabase PostgreSQL successfully!");
}

module.exports = {
  ROCKS,
  METRICS,
  TODOS,
  ISSUES,
  HEADLINES,
  HISTORY_LOGS,
  createMetricValues
};

if (require.main === module) {
  seed();
}

