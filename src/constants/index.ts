import { Department, Profile, Rock, Metric, MetricValue, Todo, Issue, Headline, HistoryLog } from "@/types";

export const DEPARTMENTS: Department[] = [
  { id: "dept-it", name: "IT" },
  { id: "dept-finance", name: "Finance" },
  { id: "dept-kitchen", name: "Kitchen" },
  { id: "dept-service", name: "Service" },
  { id: "dept-marketing", name: "Marketing" }
];

export const DEFAULT_PROFILES: Profile[] = [
  { 
    id: "prof-dev", 
    name: "Developer", 
    role: "developer", 
    departmentId: null, 
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80", 
    email: "developer@ng.com" 
  },
  { 
    id: "prof-owner", 
    name: "Owner", 
    role: "owner", 
    departmentId: null, 
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80", 
    email: "owner@ng.com" 
  },
  { 
    id: "prof-pic-it", 
    name: "IT", 
    role: "pic", 
    departmentId: "dept-it", 
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80", 
    email: "it@ng.com" 
  },
  { 
    id: "prof-pic-finance", 
    name: "Finance", 
    role: "pic", 
    departmentId: "dept-finance", 
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80", 
    email: "finance@ng.com" 
  },
  { 
    id: "prof-pic-kitchen", 
    name: "Kitchen", 
    role: "pic", 
    departmentId: "dept-kitchen", 
    avatarUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=250&q=80", 
    email: "kitchen@ng.com" 
  },
  { 
    id: "prof-pic-service", 
    name: "Service", 
    role: "pic", 
    departmentId: "dept-service", 
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80", 
    email: "service@ng.com" 
  },
  { 
    id: "prof-pic-marketing", 
    name: "Marketing", 
    role: "pic", 
    departmentId: "dept-marketing", 
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=250&q=80", 
    email: "marketing@ng.com" 
  }
];

export const DEFAULT_CREDENTIALS: Record<string, { password: string; profileId: string }> = {
  // Akun Resmi @ng.com
  "developer@ng.com": { password: "dev123", profileId: "prof-dev" },
  "dev@ng.com": { password: "dev123", profileId: "prof-dev" },
  "owner@ng.com": { password: "owner123", profileId: "prof-owner" },
  "it@ng.com": { password: "123456", profileId: "prof-pic-it" },
  "finance@ng.com": { password: "123456", profileId: "prof-pic-finance" },
  "kitchen@ng.com": { password: "123456", profileId: "prof-pic-kitchen" },
  "service@ng.com": { password: "123456", profileId: "prof-pic-service" },
  "marketing@ng.com": { password: "123456", profileId: "prof-pic-marketing" },

  // Alias kompatibilitas
  "richard@gmail.com": { password: "owner123", profileId: "prof-owner" },
  "kim@gmail.com": { password: "owner123", profileId: "prof-kim" },
  "developer@garciafood.com": { password: "dev123", profileId: "prof-dev" },
  "owner@garciafood.com": { password: "owner123", profileId: "prof-owner" },
  "it@garciafood.com": { password: "123456", profileId: "prof-pic-it" },
  "finance@garciafood.com": { password: "123456", profileId: "prof-pic-finance" },
  "kitchen@garciafood.com": { password: "123456", profileId: "prof-pic-kitchen" },
  "service@garciafood.com": { password: "123456", profileId: "prof-pic-service" },
  "marketing@garciafood.com": { password: "123456", profileId: "prof-pic-marketing" }
};

// Data Operasional Bervariasi & Komprehensif (Dummy Dataset Lengkap Nasi Gerilya)
export const INITIAL_ROCKS: Rock[] = [
  {
    "id": "rock-kitch-1",
    "departmentId": "dept-kitchen",
    "title": "Standarisasi Resep Bumbu Inti & SOP Dapur 5 Cabang",
    "description": "Memastikan konsistensi rasa sambal gerilya, bumbu ungkep ayam, dan kuah gulai di seluruh lini operasional dapur tanpa deviasi.",
    "quarter": "Q3",
    "year": 2026,
    "status": "on_track",
    "picId": "prof-pic-kitchen",
    "picName": "Kitchen",
    "dueDate": "2026-09-30",
    "createdAt": "2026-07-01T08:00:00.000Z"
  },
  {
    "id": "rock-kitch-2",
    "departmentId": "dept-kitchen",
    "title": "Optimalisasi Food Cost & Waste Management di Bawah 28%",
    "description": "Penerapan sistem FIFO ketat, timbangan digital bahan baku, dan kontrol porsi otomatis untuk menekan food waste.",
    "quarter": "Q3",
    "year": 2026,
    "status": "on_track",
    "picId": "prof-pic-kitchen",
    "picName": "Kitchen",
    "dueDate": "2026-09-30",
    "createdAt": "2026-07-01T08:30:00.000Z"
  },
  {
    "id": "rock-serv-1",
    "departmentId": "dept-service",
    "title": "Peningkatan Customer Satisfaction Index (CSI) 4.8/5.0 Bintang",
    "description": "Meningkatkan kualitas interaksi pelanggan, hospitality ramah, kebersihan area meja, dan kecepatan respon pelayanan.",
    "quarter": "Q3",
    "year": 2026,
    "status": "on_track",
    "picId": "prof-pic-service",
    "picName": "Service",
    "dueDate": "2026-09-30",
    "createdAt": "2026-07-01T09:00:00.000Z"
  },
  {
    "id": "rock-serv-2",
    "departmentId": "dept-service",
    "title": "Program Pelatihan Hospitality & Up-selling Tim Front of House",
    "description": "Sertifikasi 100% staf floor dan kasir dalam teknik cross-selling menu dessert dan minuman pendamping.",
    "quarter": "Q2",
    "year": 2026,
    "status": "completed",
    "picId": "prof-pic-service",
    "picName": "Service",
    "dueDate": "2026-06-30",
    "createdAt": "2026-04-01T08:00:00.000Z"
  },
  {
    "id": "rock-mkt-1",
    "departmentId": "dept-marketing",
    "title": "Kampanye Branding Nasi Gerilya Pedas Juara 2.0 (1.5M Impresi)",
    "description": "Aktivasi konten viral TikTok/Reels bersama 15 micro-influencer kuliner dan promo bundling jam makan siang.",
    "quarter": "Q3",
    "year": 2026,
    "status": "on_track",
    "picId": "prof-pic-marketing",
    "picName": "Marketing",
    "dueDate": "2026-09-30",
    "createdAt": "2026-07-01T09:15:00.000Z"
  },
  {
    "id": "rock-mkt-2",
    "departmentId": "dept-marketing",
    "title": "Ekspansi Kerjasama Corporate Catering 15 Perusahaan",
    "description": "Penetrasi paket lunch box langganan kantor di kawasan perkantoran Sudirman, Thamrin, dan Kuningan.",
    "quarter": "Q3",
    "year": 2026,
    "status": "off_track",
    "picId": "prof-pic-marketing",
    "picName": "Marketing",
    "dueDate": "2026-09-15",
    "createdAt": "2026-07-01T09:30:00.000Z"
  },
  {
    "id": "rock-fin-1",
    "departmentId": "dept-finance",
    "title": "Otomasi Rekonsiliasi Kas Harian & Nol Selisih Kas Bon Kasir",
    "description": "Integrasi sistem pembukuan harian dengan mutasi bank real-time dan settlement QRIS otomatis.",
    "quarter": "Q3",
    "year": 2026,
    "status": "on_track",
    "picId": "prof-pic-finance",
    "picName": "Finance",
    "dueDate": "2026-09-30",
    "createdAt": "2026-07-01T10:00:00.000Z"
  },
  {
    "id": "rock-fin-2",
    "departmentId": "dept-finance",
    "title": "Optimalisasi Operating Cash Flow Margin di Atas 22%",
    "description": "Pengendalian biaya overhead, negosiasi term of payment 30 hari ke supplier utama, dan audit stok opname mingguan.",
    "quarter": "Q3",
    "year": 2026,
    "status": "on_track",
    "picId": "prof-pic-finance",
    "picName": "Finance",
    "dueDate": "2026-09-30",
    "createdAt": "2026-07-01T10:15:00.000Z"
  },
  {
    "id": "rock-it-1",
    "departmentId": "dept-it",
    "title": "Mencapai Full Stability System (FSS) & Zero POS Downtime",
    "description": "Redundansi dual-ISP dengan failover otomatis dan arsitektur database offline-first pada mesin kasir.",
    "quarter": "Q3",
    "year": 2026,
    "status": "on_track",
    "picId": "prof-pic-it",
    "picName": "IT",
    "dueDate": "2026-09-30",
    "createdAt": "2026-07-01T10:30:00.000Z"
  },
  {
    "id": "rock-it-2",
    "departmentId": "dept-it",
    "title": "Pembaruan Infrastruktur Jaringan Wi-Fi Publik & KDS Dapur",
    "description": "Pemasangan 3 access point WiFi 6 terisolasi dan layar Kitchen Display System tahan panas dan uap di area masak.",
    "quarter": "Q2",
    "year": 2026,
    "status": "completed",
    "picId": "prof-pic-it",
    "picName": "IT",
    "dueDate": "2026-06-30",
    "createdAt": "2026-04-01T09:00:00.000Z"
  }
];

export const INITIAL_METRICS: Metric[] = [
  {
    "id": "met-kitch-1",
    "departmentId": "dept-kitchen",
    "rockId": null,
    "name": "Food Cost Percentage",
    "target": 28,
    "unit": "percentage",
    "targetType": "lower_better",
    "picId": "prof-pic-kitchen",
    "picName": "Kitchen",
    "keterangan": "Batas maksimal biaya bahan baku terhadap omset makanan. Target di bawah 28%.",
    "isActive": true,
    "cycleType": "monthly",
    "durationDays": 7,
    "accumulationMode": "average",
    "createdAt": "2026-07-01T11:00:00.000Z"
  },
  {
    "id": "met-kitch-2",
    "departmentId": "dept-kitchen",
    "rockId": null,
    "name": "Kitchen Ticket Time (Kecepatan Sajian)",
    "target": 12,
    "unit": "number",
    "targetType": "lower_better",
    "picId": "prof-pic-kitchen",
    "picName": "Kitchen",
    "keterangan": "Rata-rata waktu penyajian dari tiket kasir masuk hingga makanan siap disajikan (menit).",
    "isActive": true,
    "cycleType": "monthly",
    "durationDays": 7,
    "accumulationMode": "average",
    "createdAt": "2026-07-01T11:05:00.000Z"
  },
  {
    "id": "met-kitch-3",
    "departmentId": "dept-kitchen",
    "rockId": null,
    "name": "Waste Bahan Makanan Harian",
    "target": 2.5,
    "unit": "percentage",
    "targetType": "lower_better",
    "picId": "prof-pic-kitchen",
    "picName": "Kitchen",
    "keterangan": "Persentase bahan mentah atau makanan jadi yang terbuang karena kadaluarsa / rusak.",
    "isActive": true,
    "cycleType": "monthly",
    "durationDays": 7,
    "accumulationMode": "average",
    "createdAt": "2026-07-01T11:10:00.000Z"
  },
  {
    "id": "met-serv-1",
    "departmentId": "dept-service",
    "rockId": null,
    "name": "Rating Kepuasan Pelanggan (CSI)",
    "target": 4.8,
    "unit": "number",
    "targetType": "higher_better",
    "picId": "prof-pic-service",
    "picName": "Service",
    "keterangan": "Rata-rata rating ulasan pelanggan dari Google Maps dan formulir feedback meja (skala 1-5).",
    "isActive": true,
    "cycleType": "monthly",
    "durationDays": 7,
    "accumulationMode": "average",
    "createdAt": "2026-07-01T11:15:00.000Z"
  },
  {
    "id": "met-serv-2",
    "departmentId": "dept-service",
    "rockId": null,
    "name": "Add-on Rate Minuman & Dessert",
    "target": 35,
    "unit": "percentage",
    "targetType": "higher_better",
    "picId": "prof-pic-service",
    "picName": "Service",
    "keterangan": "Persentase struk transaksi yang menyertakan pesanan minuman khusus atau makanan penutup.",
    "isActive": true,
    "cycleType": "monthly",
    "durationDays": 7,
    "accumulationMode": "average",
    "createdAt": "2026-07-01T11:20:00.000Z"
  },
  {
    "id": "met-serv-3",
    "departmentId": "dept-service",
    "rockId": null,
    "name": "Table Turnaround Time Jam Sibuk",
    "target": 45,
    "unit": "number",
    "targetType": "lower_better",
    "picId": "prof-pic-service",
    "picName": "Service",
    "keterangan": "Durasi rata-rata pelanggan menempati meja saat jam makan siang dan malam (menit).",
    "isActive": true,
    "cycleType": "monthly",
    "durationDays": 7,
    "accumulationMode": "average",
    "createdAt": "2026-07-01T11:25:00.000Z"
  },
  {
    "id": "met-mkt-1",
    "departmentId": "dept-marketing",
    "rockId": null,
    "name": "Total Transaksi Penjualan Mingguan",
    "target": 3150,
    "unit": "number",
    "targetType": "higher_better",
    "picId": "prof-pic-marketing",
    "picName": "Marketing",
    "keterangan": "Jumlah total struk penjualan berhasil (dine-in, takeaway, dan online delivery) per pekan.",
    "isActive": true,
    "cycleType": "monthly",
    "durationDays": 7,
    "accumulationMode": "sum",
    "createdAt": "2026-07-01T11:30:00.000Z"
  },
  {
    "id": "met-mkt-2",
    "departmentId": "dept-marketing",
    "rockId": null,
    "name": "Omset Penjualan Bersih Mingguan",
    "target": 125000000,
    "unit": "currency",
    "targetType": "higher_better",
    "picId": "prof-pic-marketing",
    "picName": "Marketing",
    "keterangan": "Total pendapatan kotor dikurangi diskon & promo sebelum pajak dalam 1 pekan.",
    "isActive": true,
    "cycleType": "monthly",
    "durationDays": 7,
    "accumulationMode": "sum",
    "createdAt": "2026-07-01T11:35:00.000Z"
  },
  {
    "id": "met-mkt-3",
    "departmentId": "dept-marketing",
    "rockId": null,
    "name": "Engagement Rate Media Sosial",
    "target": 8.5,
    "unit": "percentage",
    "targetType": "higher_better",
    "picId": "prof-pic-marketing",
    "picName": "Marketing",
    "keterangan": "Rasio interaksi (likes, comments, shares, saves) per total views di akun TikTok & IG Nasi Gerilya.",
    "isActive": true,
    "cycleType": "monthly",
    "durationDays": 7,
    "accumulationMode": "average",
    "createdAt": "2026-07-01T11:40:00.000Z"
  },
  {
    "id": "met-fin-1",
    "departmentId": "dept-finance",
    "rockId": null,
    "name": "Gross Profit Margin (GPM)",
    "target": 65,
    "unit": "percentage",
    "targetType": "higher_better",
    "picId": "prof-pic-finance",
    "picName": "Finance",
    "keterangan": "Marjin laba kotor terhadap omset penjualan setelah dikurangi HPP bahan baku.",
    "isActive": true,
    "cycleType": "monthly",
    "durationDays": 7,
    "accumulationMode": "average",
    "createdAt": "2026-07-01T11:45:00.000Z"
  },
  {
    "id": "met-fin-2",
    "departmentId": "dept-finance",
    "rockId": null,
    "name": "Total Selisih Kasir Mingguan",
    "target": 0,
    "unit": "currency",
    "targetType": "lower_better",
    "picId": "prof-pic-finance",
    "picName": "Finance",
    "keterangan": "Total selisih fisik uang kas kasir dengan catatan sistem POS di akhir shift mingguan.",
    "isActive": true,
    "cycleType": "monthly",
    "durationDays": 7,
    "accumulationMode": "sum",
    "createdAt": "2026-07-01T11:50:00.000Z"
  },
  {
    "id": "met-fin-3",
    "departmentId": "dept-finance",
    "rockId": null,
    "name": "Ketepatan Waktu Pembayaran Vendor",
    "target": 98,
    "unit": "percentage",
    "targetType": "higher_better",
    "picId": "prof-pic-finance",
    "picName": "Finance",
    "keterangan": "Persentase tagihan supplier bahan makanan yang diselesaikan sebelum jatuh tempo invoice.",
    "isActive": true,
    "cycleType": "monthly",
    "durationDays": 7,
    "accumulationMode": "average",
    "createdAt": "2026-07-01T11:55:00.000Z"
  },
  {
    "id": "met-it-1",
    "departmentId": "dept-it",
    "rockId": null,
    "name": "Uptime Sistem POS & Cloud Server",
    "target": 99.8,
    "unit": "percentage",
    "targetType": "higher_better",
    "picId": "prof-pic-it",
    "picName": "IT",
    "keterangan": "Persentase waktu aktif sistem kasir, printer dapur, dan sinkronisasi server tanpa downtime.",
    "isActive": true,
    "cycleType": "monthly",
    "durationDays": 7,
    "accumulationMode": "average",
    "createdAt": "2026-07-01T12:00:00.000Z"
  },
  {
    "id": "met-it-2",
    "departmentId": "dept-it",
    "rockId": null,
    "name": "Waktu Respons Penanganan Tiket IT",
    "target": 20,
    "unit": "number",
    "targetType": "lower_better",
    "picId": "prof-pic-it",
    "picName": "IT",
    "keterangan": "Mean Time to Resolve (MTTR) penanganan kendala hardware/software kasir dan jaringan (menit).",
    "isActive": true,
    "cycleType": "monthly",
    "durationDays": 7,
    "accumulationMode": "average",
    "createdAt": "2026-07-01T12:05:00.000Z"
  },
  {
    "id": "met-it-3",
    "departmentId": "dept-it",
    "rockId": null,
    "name": "Sukses Backup Database Harian",
    "target": 100,
    "unit": "percentage",
    "targetType": "higher_better",
    "picId": "prof-pic-it",
    "picName": "IT",
    "keterangan": "Persentase keberhasilan snapshot data transaksi dan log sistem ke secondary storage.",
    "isActive": true,
    "cycleType": "monthly",
    "durationDays": 7,
    "accumulationMode": "average",
    "createdAt": "2026-07-01T12:10:00.000Z"
  }
];

export const INITIAL_METRIC_VALUES: MetricValue[] = [
  {
    "id": "mv-met-kitch-1-2026-6-1",
    "metricId": "met-kitch-1",
    "year": 2026,
    "month": 6,
    "week": 1,
    "value": 27.8,
    "inputtedBy": "prof-pic-kitchen",
    "dailyValues": [
      27.6,
      28.1,
      27.8,
      28.5,
      27.9,
      27.4,
      27.2
    ],
    "updatedAt": "2026-06-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-kitch-1-2026-6-2",
    "metricId": "met-kitch-1",
    "year": 2026,
    "month": 6,
    "week": 2,
    "value": 27,
    "inputtedBy": "prof-pic-kitchen",
    "dailyValues": [
      26.9,
      27.3,
      27.1,
      27.5,
      26.8,
      27,
      26.7
    ],
    "updatedAt": "2026-06-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-kitch-1-2026-6-3",
    "metricId": "met-kitch-1",
    "year": 2026,
    "month": 6,
    "week": 3,
    "value": 26.9,
    "inputtedBy": "prof-pic-kitchen",
    "dailyValues": [
      27.2,
      26.8,
      27,
      27.4,
      26.9,
      26.5,
      26.8
    ],
    "updatedAt": "2026-06-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-kitch-1-2026-6-4",
    "metricId": "met-kitch-1",
    "year": 2026,
    "month": 6,
    "week": 4,
    "value": 28.8,
    "inputtedBy": "prof-pic-kitchen",
    "dailyValues": [
      28.4,
      28.9,
      29.5,
      28.8,
      29.1,
      28.6,
      28.3
    ],
    "updatedAt": "2026-06-28T18:00:00.000Z"
  },
  {
    "id": "mv-met-kitch-1-2026-7-1",
    "metricId": "met-kitch-1",
    "year": 2026,
    "month": 7,
    "week": 1,
    "value": 27.4,
    "inputtedBy": "prof-pic-kitchen",
    "dailyValues": [
      27.5,
      27.8,
      27.2,
      27.6,
      27.4,
      27,
      27.1
    ],
    "updatedAt": "2026-07-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-kitch-1-2026-7-2",
    "metricId": "met-kitch-1",
    "year": 2026,
    "month": 7,
    "week": 2,
    "value": 26.8,
    "inputtedBy": "prof-pic-kitchen",
    "dailyValues": [
      26.8,
      27.1,
      26.5,
      26.9,
      27,
      26.6,
      26.4
    ],
    "updatedAt": "2026-07-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-kitch-1-2026-7-3",
    "metricId": "met-kitch-1",
    "year": 2026,
    "month": 7,
    "week": 3,
    "value": 26.5,
    "inputtedBy": "prof-pic-kitchen",
    "dailyValues": [
      26.5,
      26.7,
      26.2,
      26.4,
      null,
      null,
      null
    ],
    "updatedAt": "2026-07-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-kitch-2-2026-6-1",
    "metricId": "met-kitch-2",
    "year": 2026,
    "month": 6,
    "week": 1,
    "value": 12,
    "inputtedBy": "prof-pic-kitchen",
    "dailyValues": [
      11.5,
      12.1,
      11.8,
      13.2,
      12.8,
      11.4,
      11
    ],
    "updatedAt": "2026-06-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-kitch-2-2026-6-2",
    "metricId": "met-kitch-2",
    "year": 2026,
    "month": 6,
    "week": 2,
    "value": 10.9,
    "inputtedBy": "prof-pic-kitchen",
    "dailyValues": [
      10.8,
      11.2,
      10.9,
      11.5,
      11,
      10.7,
      10.5
    ],
    "updatedAt": "2026-06-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-kitch-2-2026-6-3",
    "metricId": "met-kitch-2",
    "year": 2026,
    "month": 6,
    "week": 3,
    "value": 11,
    "inputtedBy": "prof-pic-kitchen",
    "dailyValues": [
      11.2,
      10.9,
      11.1,
      11.4,
      11,
      10.6,
      10.8
    ],
    "updatedAt": "2026-06-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-kitch-2-2026-6-4",
    "metricId": "met-kitch-2",
    "year": 2026,
    "month": 6,
    "week": 4,
    "value": 13.1,
    "inputtedBy": "prof-pic-kitchen",
    "dailyValues": [
      12.8,
      13.5,
      14.2,
      13.6,
      13,
      12.5,
      12.2
    ],
    "updatedAt": "2026-06-28T18:00:00.000Z"
  },
  {
    "id": "mv-met-kitch-2-2026-7-1",
    "metricId": "met-kitch-2",
    "year": 2026,
    "month": 7,
    "week": 1,
    "value": 11.2,
    "inputtedBy": "prof-pic-kitchen",
    "dailyValues": [
      11.2,
      11.6,
      11,
      11.8,
      11.4,
      10.8,
      10.9
    ],
    "updatedAt": "2026-07-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-kitch-2-2026-7-2",
    "metricId": "met-kitch-2",
    "year": 2026,
    "month": 7,
    "week": 2,
    "value": 10.5,
    "inputtedBy": "prof-pic-kitchen",
    "dailyValues": [
      10.5,
      10.8,
      10.2,
      10.6,
      10.7,
      10.3,
      10.1
    ],
    "updatedAt": "2026-07-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-kitch-2-2026-7-3",
    "metricId": "met-kitch-2",
    "year": 2026,
    "month": 7,
    "week": 3,
    "value": 10.2,
    "inputtedBy": "prof-pic-kitchen",
    "dailyValues": [
      10.2,
      10.5,
      9.8,
      10.1,
      null,
      null,
      null
    ],
    "updatedAt": "2026-07-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-kitch-3-2026-6-1",
    "metricId": "met-kitch-3",
    "year": 2026,
    "month": 6,
    "week": 1,
    "value": 2.4,
    "inputtedBy": "prof-pic-kitchen",
    "dailyValues": [
      2.3,
      2.6,
      2.4,
      2.8,
      2.5,
      2.2,
      2.1
    ],
    "updatedAt": "2026-06-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-kitch-3-2026-6-2",
    "metricId": "met-kitch-3",
    "year": 2026,
    "month": 6,
    "week": 2,
    "value": 2.1,
    "inputtedBy": "prof-pic-kitchen",
    "dailyValues": [
      2.1,
      2.2,
      2,
      2.3,
      2.1,
      1.9,
      1.8
    ],
    "updatedAt": "2026-06-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-kitch-3-2026-6-3",
    "metricId": "met-kitch-3",
    "year": 2026,
    "month": 6,
    "week": 3,
    "value": 2.1,
    "inputtedBy": "prof-pic-kitchen",
    "dailyValues": [
      2.2,
      2,
      2.1,
      2.4,
      2.2,
      1.9,
      2
    ],
    "updatedAt": "2026-06-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-kitch-3-2026-6-4",
    "metricId": "met-kitch-3",
    "year": 2026,
    "month": 6,
    "week": 4,
    "value": 2.9,
    "inputtedBy": "prof-pic-kitchen",
    "dailyValues": [
      2.7,
      3.1,
      3.4,
      2.9,
      2.8,
      2.6,
      2.5
    ],
    "updatedAt": "2026-06-28T18:00:00.000Z"
  },
  {
    "id": "mv-met-kitch-3-2026-7-1",
    "metricId": "met-kitch-3",
    "year": 2026,
    "month": 7,
    "week": 1,
    "value": 2.2,
    "inputtedBy": "prof-pic-kitchen",
    "dailyValues": [
      2.2,
      2.4,
      2.1,
      2.3,
      2.2,
      2,
      1.9
    ],
    "updatedAt": "2026-07-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-kitch-3-2026-7-2",
    "metricId": "met-kitch-3",
    "year": 2026,
    "month": 7,
    "week": 2,
    "value": 1.9,
    "inputtedBy": "prof-pic-kitchen",
    "dailyValues": [
      1.9,
      2.1,
      1.8,
      2,
      2,
      1.8,
      1.7
    ],
    "updatedAt": "2026-07-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-kitch-3-2026-7-3",
    "metricId": "met-kitch-3",
    "year": 2026,
    "month": 7,
    "week": 3,
    "value": 1.8,
    "inputtedBy": "prof-pic-kitchen",
    "dailyValues": [
      1.8,
      1.9,
      1.7,
      1.8,
      null,
      null,
      null
    ],
    "updatedAt": "2026-07-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-serv-1-2026-6-1",
    "metricId": "met-serv-1",
    "year": 2026,
    "month": 6,
    "week": 1,
    "value": 4.8,
    "inputtedBy": "prof-pic-service",
    "dailyValues": [
      4.8,
      4.9,
      4.8,
      4.7,
      4.8,
      4.9,
      4.9
    ],
    "updatedAt": "2026-06-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-serv-1-2026-6-2",
    "metricId": "met-serv-1",
    "year": 2026,
    "month": 6,
    "week": 2,
    "value": 4.9,
    "inputtedBy": "prof-pic-service",
    "dailyValues": [
      4.9,
      4.9,
      4.8,
      4.9,
      4.9,
      5,
      4.9
    ],
    "updatedAt": "2026-06-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-serv-1-2026-6-3",
    "metricId": "met-serv-1",
    "year": 2026,
    "month": 6,
    "week": 3,
    "value": 4.8,
    "inputtedBy": "prof-pic-service",
    "dailyValues": [
      4.8,
      4.8,
      4.7,
      4.8,
      4.9,
      4.9,
      4.8
    ],
    "updatedAt": "2026-06-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-serv-1-2026-6-4",
    "metricId": "met-serv-1",
    "year": 2026,
    "month": 6,
    "week": 4,
    "value": 4.7,
    "inputtedBy": "prof-pic-service",
    "dailyValues": [
      4.6,
      4.7,
      4.6,
      4.7,
      4.8,
      4.8,
      4.7
    ],
    "updatedAt": "2026-06-28T18:00:00.000Z"
  },
  {
    "id": "mv-met-serv-1-2026-7-1",
    "metricId": "met-serv-1",
    "year": 2026,
    "month": 7,
    "week": 1,
    "value": 4.9,
    "inputtedBy": "prof-pic-service",
    "dailyValues": [
      4.8,
      4.9,
      4.8,
      4.9,
      4.9,
      5,
      4.9
    ],
    "updatedAt": "2026-07-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-serv-1-2026-7-2",
    "metricId": "met-serv-1",
    "year": 2026,
    "month": 7,
    "week": 2,
    "value": 4.9,
    "inputtedBy": "prof-pic-service",
    "dailyValues": [
      4.9,
      5,
      4.9,
      4.9,
      5,
      5,
      4.9
    ],
    "updatedAt": "2026-07-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-serv-1-2026-7-3",
    "metricId": "met-serv-1",
    "year": 2026,
    "month": 7,
    "week": 3,
    "value": 4.9,
    "inputtedBy": "prof-pic-service",
    "dailyValues": [
      4.9,
      5,
      4.8,
      5,
      null,
      null,
      null
    ],
    "updatedAt": "2026-07-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-serv-2-2026-6-1",
    "metricId": "met-serv-2",
    "year": 2026,
    "month": 6,
    "week": 1,
    "value": 37,
    "inputtedBy": "prof-pic-service",
    "dailyValues": [
      34.2,
      35.8,
      36.1,
      37.4,
      38.2,
      39.5,
      38
    ],
    "updatedAt": "2026-06-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-serv-2-2026-6-2",
    "metricId": "met-serv-2",
    "year": 2026,
    "month": 6,
    "week": 2,
    "value": 37.2,
    "inputtedBy": "prof-pic-service",
    "dailyValues": [
      35.5,
      36.2,
      35.9,
      37.1,
      38,
      39.2,
      38.5
    ],
    "updatedAt": "2026-06-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-serv-2-2026-6-3",
    "metricId": "met-serv-2",
    "year": 2026,
    "month": 6,
    "week": 3,
    "value": 36.5,
    "inputtedBy": "prof-pic-service",
    "dailyValues": [
      34.8,
      35.2,
      35,
      36.4,
      37.5,
      38.8,
      37.9
    ],
    "updatedAt": "2026-06-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-serv-2-2026-6-4",
    "metricId": "met-serv-2",
    "year": 2026,
    "month": 6,
    "week": 4,
    "value": 33.7,
    "inputtedBy": "prof-pic-service",
    "dailyValues": [
      32.1,
      33.4,
      32.8,
      33.9,
      34.5,
      35.2,
      34
    ],
    "updatedAt": "2026-06-28T18:00:00.000Z"
  },
  {
    "id": "mv-met-serv-2-2026-7-1",
    "metricId": "met-serv-2",
    "year": 2026,
    "month": 7,
    "week": 1,
    "value": 38.2,
    "inputtedBy": "prof-pic-service",
    "dailyValues": [
      36.2,
      37.1,
      36.5,
      38,
      39.2,
      40.5,
      39.8
    ],
    "updatedAt": "2026-07-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-serv-2-2026-7-2",
    "metricId": "met-serv-2",
    "year": 2026,
    "month": 7,
    "week": 2,
    "value": 39.8,
    "inputtedBy": "prof-pic-service",
    "dailyValues": [
      37.5,
      38.8,
      38.2,
      39.5,
      41,
      42.4,
      41.2
    ],
    "updatedAt": "2026-07-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-serv-2-2026-7-3",
    "metricId": "met-serv-2",
    "year": 2026,
    "month": 7,
    "week": 3,
    "value": 39.2,
    "inputtedBy": "prof-pic-service",
    "dailyValues": [
      38.2,
      39.5,
      38.8,
      40.2,
      null,
      null,
      null
    ],
    "updatedAt": "2026-07-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-serv-3-2026-6-1",
    "metricId": "met-serv-3",
    "year": 2026,
    "month": 6,
    "week": 1,
    "value": 45.4,
    "inputtedBy": "prof-pic-service",
    "dailyValues": [
      44,
      45,
      43,
      46,
      47,
      48,
      45
    ],
    "updatedAt": "2026-06-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-serv-3-2026-6-2",
    "metricId": "met-serv-3",
    "year": 2026,
    "month": 6,
    "week": 2,
    "value": 43.4,
    "inputtedBy": "prof-pic-service",
    "dailyValues": [
      42,
      43,
      41,
      44,
      45,
      46,
      43
    ],
    "updatedAt": "2026-06-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-serv-3-2026-6-3",
    "metricId": "met-serv-3",
    "year": 2026,
    "month": 6,
    "week": 3,
    "value": 44.4,
    "inputtedBy": "prof-pic-service",
    "dailyValues": [
      43,
      44,
      42,
      45,
      46,
      47,
      44
    ],
    "updatedAt": "2026-06-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-serv-3-2026-6-4",
    "metricId": "met-serv-3",
    "year": 2026,
    "month": 6,
    "week": 4,
    "value": 49.4,
    "inputtedBy": "prof-pic-service",
    "dailyValues": [
      47,
      49,
      51,
      48,
      50,
      52,
      49
    ],
    "updatedAt": "2026-06-28T18:00:00.000Z"
  },
  {
    "id": "mv-met-serv-3-2026-7-1",
    "metricId": "met-serv-3",
    "year": 2026,
    "month": 7,
    "week": 1,
    "value": 43.9,
    "inputtedBy": "prof-pic-service",
    "dailyValues": [
      43,
      44,
      42,
      44,
      45,
      46,
      43
    ],
    "updatedAt": "2026-07-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-serv-3-2026-7-2",
    "metricId": "met-serv-3",
    "year": 2026,
    "month": 7,
    "week": 2,
    "value": 42.4,
    "inputtedBy": "prof-pic-service",
    "dailyValues": [
      41,
      42,
      40,
      43,
      44,
      45,
      42
    ],
    "updatedAt": "2026-07-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-serv-3-2026-7-3",
    "metricId": "met-serv-3",
    "year": 2026,
    "month": 7,
    "week": 3,
    "value": 40.5,
    "inputtedBy": "prof-pic-service",
    "dailyValues": [
      40,
      41,
      39,
      42,
      null,
      null,
      null
    ],
    "updatedAt": "2026-07-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-mkt-1-2026-6-1",
    "metricId": "met-mkt-1",
    "year": 2026,
    "month": 6,
    "week": 1,
    "value": 3385,
    "inputtedBy": "prof-pic-marketing",
    "dailyValues": [
      420,
      440,
      435,
      460,
      510,
      580,
      540
    ],
    "updatedAt": "2026-06-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-mkt-1-2026-6-2",
    "metricId": "met-mkt-1",
    "year": 2026,
    "month": 6,
    "week": 2,
    "value": 3470,
    "inputtedBy": "prof-pic-marketing",
    "dailyValues": [
      430,
      450,
      440,
      470,
      520,
      600,
      560
    ],
    "updatedAt": "2026-06-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-mkt-1-2026-6-3",
    "metricId": "met-mkt-1",
    "year": 2026,
    "month": 6,
    "week": 3,
    "value": 3420,
    "inputtedBy": "prof-pic-marketing",
    "dailyValues": [
      425,
      445,
      430,
      465,
      515,
      590,
      550
    ],
    "updatedAt": "2026-06-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-mkt-1-2026-6-4",
    "metricId": "met-mkt-1",
    "year": 2026,
    "month": 6,
    "week": 4,
    "value": 3115,
    "inputtedBy": "prof-pic-marketing",
    "dailyValues": [
      390,
      410,
      400,
      425,
      470,
      530,
      490
    ],
    "updatedAt": "2026-06-28T18:00:00.000Z"
  },
  {
    "id": "mv-met-mkt-1-2026-7-1",
    "metricId": "met-mkt-1",
    "year": 2026,
    "month": 7,
    "week": 1,
    "value": 3580,
    "inputtedBy": "prof-pic-marketing",
    "dailyValues": [
      440,
      465,
      450,
      485,
      540,
      620,
      580
    ],
    "updatedAt": "2026-07-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-mkt-1-2026-7-2",
    "metricId": "met-mkt-1",
    "year": 2026,
    "month": 7,
    "week": 2,
    "value": 3735,
    "inputtedBy": "prof-pic-marketing",
    "dailyValues": [
      455,
      480,
      470,
      505,
      565,
      650,
      610
    ],
    "updatedAt": "2026-07-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-mkt-1-2026-7-3",
    "metricId": "met-mkt-1",
    "year": 2026,
    "month": 7,
    "week": 3,
    "value": 1935,
    "inputtedBy": "prof-pic-marketing",
    "dailyValues": [
      460,
      490,
      475,
      510,
      null,
      null,
      null
    ],
    "updatedAt": "2026-07-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-mkt-2-2026-6-1",
    "metricId": "met-mkt-2",
    "year": 2026,
    "month": 6,
    "week": 1,
    "value": 138500000,
    "inputtedBy": "prof-pic-marketing",
    "dailyValues": [
      16800000,
      17500000,
      17200000,
      18400000,
      21200000,
      24800000,
      22600000
    ],
    "updatedAt": "2026-06-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-mkt-2-2026-6-2",
    "metricId": "met-mkt-2",
    "year": 2026,
    "month": 6,
    "week": 2,
    "value": 143100000,
    "inputtedBy": "prof-pic-marketing",
    "dailyValues": [
      17200000,
      18100000,
      17800000,
      18900000,
      22100000,
      25600000,
      23400000
    ],
    "updatedAt": "2026-06-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-mkt-2-2026-6-3",
    "metricId": "met-mkt-2",
    "year": 2026,
    "month": 6,
    "week": 3,
    "value": 140300000,
    "inputtedBy": "prof-pic-marketing",
    "dailyValues": [
      16900000,
      17600000,
      17400000,
      18600000,
      21800000,
      25100000,
      22900000
    ],
    "updatedAt": "2026-06-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-mkt-2-2026-6-4",
    "metricId": "met-mkt-2",
    "year": 2026,
    "month": 6,
    "week": 4,
    "value": 126700000,
    "inputtedBy": "prof-pic-marketing",
    "dailyValues": [
      15200000,
      16100000,
      15800000,
      16900000,
      19500000,
      22400000,
      20800000
    ],
    "updatedAt": "2026-06-28T18:00:00.000Z"
  },
  {
    "id": "mv-met-mkt-2-2026-7-1",
    "metricId": "met-mkt-2",
    "year": 2026,
    "month": 7,
    "week": 1,
    "value": 149300000,
    "inputtedBy": "prof-pic-marketing",
    "dailyValues": [
      17800000,
      18900000,
      18400000,
      19600000,
      23200000,
      26900000,
      24500000
    ],
    "updatedAt": "2026-07-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-mkt-2-2026-7-2",
    "metricId": "met-mkt-2",
    "year": 2026,
    "month": 7,
    "week": 2,
    "value": 155700000,
    "inputtedBy": "prof-pic-marketing",
    "dailyValues": [
      18500000,
      19600000,
      19100000,
      20400000,
      24100000,
      28200000,
      25800000
    ],
    "updatedAt": "2026-07-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-mkt-2-2026-7-3",
    "metricId": "met-mkt-2",
    "year": 2026,
    "month": 7,
    "week": 3,
    "value": 79300000,
    "inputtedBy": "prof-pic-marketing",
    "dailyValues": [
      18800000,
      20100000,
      19500000,
      20900000,
      null,
      null,
      null
    ],
    "updatedAt": "2026-07-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-mkt-3-2026-6-1",
    "metricId": "met-mkt-3",
    "year": 2026,
    "month": 6,
    "week": 1,
    "value": 9.1,
    "inputtedBy": "prof-pic-marketing",
    "dailyValues": [
      8.2,
      8.6,
      8.4,
      8.9,
      9.4,
      10.2,
      9.8
    ],
    "updatedAt": "2026-06-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-mkt-3-2026-6-2",
    "metricId": "met-mkt-3",
    "year": 2026,
    "month": 6,
    "week": 2,
    "value": 9.4,
    "inputtedBy": "prof-pic-marketing",
    "dailyValues": [
      8.5,
      8.9,
      8.7,
      9.2,
      9.8,
      10.6,
      10.1
    ],
    "updatedAt": "2026-06-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-mkt-3-2026-6-3",
    "metricId": "met-mkt-3",
    "year": 2026,
    "month": 6,
    "week": 3,
    "value": 9.2,
    "inputtedBy": "prof-pic-marketing",
    "dailyValues": [
      8.3,
      8.7,
      8.5,
      9,
      9.5,
      10.3,
      9.9
    ],
    "updatedAt": "2026-06-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-mkt-3-2026-6-4",
    "metricId": "met-mkt-3",
    "year": 2026,
    "month": 6,
    "week": 4,
    "value": 8.2,
    "inputtedBy": "prof-pic-marketing",
    "dailyValues": [
      7.4,
      7.8,
      7.6,
      8.1,
      8.5,
      9.1,
      8.7
    ],
    "updatedAt": "2026-06-28T18:00:00.000Z"
  },
  {
    "id": "mv-met-mkt-3-2026-7-1",
    "metricId": "met-mkt-3",
    "year": 2026,
    "month": 7,
    "week": 1,
    "value": 9.8,
    "inputtedBy": "prof-pic-marketing",
    "dailyValues": [
      8.8,
      9.2,
      9,
      9.6,
      10.2,
      11,
      10.5
    ],
    "updatedAt": "2026-07-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-mkt-3-2026-7-2",
    "metricId": "met-mkt-3",
    "year": 2026,
    "month": 7,
    "week": 2,
    "value": 10.3,
    "inputtedBy": "prof-pic-marketing",
    "dailyValues": [
      9.2,
      9.6,
      9.4,
      10.1,
      10.8,
      11.8,
      11.2
    ],
    "updatedAt": "2026-07-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-mkt-3-2026-7-3",
    "metricId": "met-mkt-3",
    "year": 2026,
    "month": 7,
    "week": 3,
    "value": 9.9,
    "inputtedBy": "prof-pic-marketing",
    "dailyValues": [
      9.5,
      9.9,
      9.7,
      10.4,
      null,
      null,
      null
    ],
    "updatedAt": "2026-07-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-fin-1-2026-6-1",
    "metricId": "met-fin-1",
    "year": 2026,
    "month": 6,
    "week": 1,
    "value": 66.6,
    "inputtedBy": "prof-pic-finance",
    "dailyValues": [
      65.4,
      66.1,
      65.8,
      66.5,
      67.2,
      68,
      67.5
    ],
    "updatedAt": "2026-06-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-fin-1-2026-6-2",
    "metricId": "met-fin-1",
    "year": 2026,
    "month": 6,
    "week": 2,
    "value": 67.2,
    "inputtedBy": "prof-pic-finance",
    "dailyValues": [
      66,
      66.8,
      66.3,
      67.1,
      67.8,
      68.5,
      68.1
    ],
    "updatedAt": "2026-06-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-fin-1-2026-6-3",
    "metricId": "met-fin-1",
    "year": 2026,
    "month": 6,
    "week": 3,
    "value": 66.9,
    "inputtedBy": "prof-pic-finance",
    "dailyValues": [
      65.7,
      66.4,
      66,
      66.8,
      67.4,
      68.2,
      67.7
    ],
    "updatedAt": "2026-06-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-fin-1-2026-6-4",
    "metricId": "met-fin-1",
    "year": 2026,
    "month": 6,
    "week": 4,
    "value": 64.9,
    "inputtedBy": "prof-pic-finance",
    "dailyValues": [
      63.8,
      64.5,
      64.1,
      64.9,
      65.4,
      66.1,
      65.6
    ],
    "updatedAt": "2026-06-28T18:00:00.000Z"
  },
  {
    "id": "mv-met-fin-1-2026-7-1",
    "metricId": "met-fin-1",
    "year": 2026,
    "month": 7,
    "week": 1,
    "value": 67.5,
    "inputtedBy": "prof-pic-finance",
    "dailyValues": [
      66.2,
      67,
      66.5,
      67.3,
      68.1,
      69,
      68.4
    ],
    "updatedAt": "2026-07-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-fin-1-2026-7-2",
    "metricId": "met-fin-1",
    "year": 2026,
    "month": 7,
    "week": 2,
    "value": 68.4,
    "inputtedBy": "prof-pic-finance",
    "dailyValues": [
      67.1,
      67.9,
      67.4,
      68.2,
      69,
      70.1,
      69.3
    ],
    "updatedAt": "2026-07-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-fin-1-2026-7-3",
    "metricId": "met-fin-1",
    "year": 2026,
    "month": 7,
    "week": 3,
    "value": 68,
    "inputtedBy": "prof-pic-finance",
    "dailyValues": [
      67.5,
      68.2,
      67.8,
      68.6,
      null,
      null,
      null
    ],
    "updatedAt": "2026-07-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-fin-2-2026-6-1",
    "metricId": "met-fin-2",
    "year": 2026,
    "month": 6,
    "week": 1,
    "value": 40000,
    "inputtedBy": "prof-pic-finance",
    "dailyValues": [
      0,
      15000,
      0,
      0,
      25000,
      0,
      0
    ],
    "updatedAt": "2026-06-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-fin-2-2026-6-2",
    "metricId": "met-fin-2",
    "year": 2026,
    "month": 6,
    "week": 2,
    "value": 10000,
    "inputtedBy": "prof-pic-finance",
    "dailyValues": [
      0,
      0,
      0,
      10000,
      0,
      0,
      0
    ],
    "updatedAt": "2026-06-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-fin-2-2026-6-3",
    "metricId": "met-fin-2",
    "year": 2026,
    "month": 6,
    "week": 3,
    "value": 15000,
    "inputtedBy": "prof-pic-finance",
    "dailyValues": [
      0,
      0,
      0,
      0,
      0,
      15000,
      0
    ],
    "updatedAt": "2026-06-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-fin-2-2026-6-4",
    "metricId": "met-fin-2",
    "year": 2026,
    "month": 6,
    "week": 4,
    "value": 110000,
    "inputtedBy": "prof-pic-finance",
    "dailyValues": [
      25000,
      0,
      35000,
      0,
      50000,
      0,
      0
    ],
    "updatedAt": "2026-06-28T18:00:00.000Z"
  },
  {
    "id": "mv-met-fin-2-2026-7-1",
    "metricId": "met-fin-2",
    "year": 2026,
    "month": 7,
    "week": 1,
    "value": 15000,
    "inputtedBy": "prof-pic-finance",
    "dailyValues": [
      0,
      0,
      0,
      0,
      15000,
      0,
      0
    ],
    "updatedAt": "2026-07-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-fin-2-2026-7-2",
    "metricId": "met-fin-2",
    "year": 2026,
    "month": 7,
    "week": 2,
    "value": 0,
    "inputtedBy": "prof-pic-finance",
    "dailyValues": [
      0,
      0,
      0,
      0,
      0,
      0,
      0
    ],
    "updatedAt": "2026-07-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-fin-2-2026-7-3",
    "metricId": "met-fin-2",
    "year": 2026,
    "month": 7,
    "week": 3,
    "value": 0,
    "inputtedBy": "prof-pic-finance",
    "dailyValues": [
      0,
      0,
      0,
      0,
      null,
      null,
      null
    ],
    "updatedAt": "2026-07-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-fin-3-2026-6-1",
    "metricId": "met-fin-3",
    "year": 2026,
    "month": 6,
    "week": 1,
    "value": 99.3,
    "inputtedBy": "prof-pic-finance",
    "dailyValues": [
      98.5,
      99,
      98.8,
      99.2,
      99.5,
      100,
      99.8
    ],
    "updatedAt": "2026-06-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-fin-3-2026-6-2",
    "metricId": "met-fin-3",
    "year": 2026,
    "month": 6,
    "week": 2,
    "value": 99.6,
    "inputtedBy": "prof-pic-finance",
    "dailyValues": [
      99,
      99.5,
      99.2,
      99.8,
      100,
      100,
      99.9
    ],
    "updatedAt": "2026-06-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-fin-3-2026-6-3",
    "metricId": "met-fin-3",
    "year": 2026,
    "month": 6,
    "week": 3,
    "value": 99.4,
    "inputtedBy": "prof-pic-finance",
    "dailyValues": [
      98.8,
      99.2,
      99,
      99.5,
      99.8,
      100,
      99.7
    ],
    "updatedAt": "2026-06-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-fin-3-2026-6-4",
    "metricId": "met-fin-3",
    "year": 2026,
    "month": 6,
    "week": 4,
    "value": 97.4,
    "inputtedBy": "prof-pic-finance",
    "dailyValues": [
      96.2,
      97,
      96.5,
      97.4,
      98,
      98.5,
      98.1
    ],
    "updatedAt": "2026-06-28T18:00:00.000Z"
  },
  {
    "id": "mv-met-fin-3-2026-7-1",
    "metricId": "met-fin-3",
    "year": 2026,
    "month": 7,
    "week": 1,
    "value": 99.7,
    "inputtedBy": "prof-pic-finance",
    "dailyValues": [
      99.2,
      99.6,
      99.4,
      99.8,
      100,
      100,
      99.9
    ],
    "updatedAt": "2026-07-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-fin-3-2026-7-2",
    "metricId": "met-fin-3",
    "year": 2026,
    "month": 7,
    "week": 2,
    "value": 99.9,
    "inputtedBy": "prof-pic-finance",
    "dailyValues": [
      99.5,
      100,
      99.8,
      100,
      100,
      100,
      100
    ],
    "updatedAt": "2026-07-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-fin-3-2026-7-3",
    "metricId": "met-fin-3",
    "year": 2026,
    "month": 7,
    "week": 3,
    "value": 100,
    "inputtedBy": "prof-pic-finance",
    "dailyValues": [
      100,
      100,
      100,
      100,
      null,
      null,
      null
    ],
    "updatedAt": "2026-07-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-it-1-2026-6-1",
    "metricId": "met-it-1",
    "year": 2026,
    "month": 6,
    "week": 1,
    "value": 99.9,
    "inputtedBy": "prof-pic-it",
    "dailyValues": [
      99.9,
      100,
      99.9,
      99.8,
      100,
      100,
      99.9
    ],
    "updatedAt": "2026-06-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-it-1-2026-6-2",
    "metricId": "met-it-1",
    "year": 2026,
    "month": 6,
    "week": 2,
    "value": 100,
    "inputtedBy": "prof-pic-it",
    "dailyValues": [
      100,
      100,
      99.9,
      100,
      100,
      100,
      100
    ],
    "updatedAt": "2026-06-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-it-1-2026-6-3",
    "metricId": "met-it-1",
    "year": 2026,
    "month": 6,
    "week": 3,
    "value": 99.9,
    "inputtedBy": "prof-pic-it",
    "dailyValues": [
      99.9,
      99.9,
      99.8,
      100,
      100,
      100,
      99.9
    ],
    "updatedAt": "2026-06-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-it-1-2026-6-4",
    "metricId": "met-it-1",
    "year": 2026,
    "month": 6,
    "week": 4,
    "value": 99.2,
    "inputtedBy": "prof-pic-it",
    "dailyValues": [
      98.5,
      99.1,
      98.9,
      99.2,
      99.5,
      99.8,
      99.6
    ],
    "updatedAt": "2026-06-28T18:00:00.000Z"
  },
  {
    "id": "mv-met-it-1-2026-7-1",
    "metricId": "met-it-1",
    "year": 2026,
    "month": 7,
    "week": 1,
    "value": 100,
    "inputtedBy": "prof-pic-it",
    "dailyValues": [
      100,
      100,
      99.9,
      100,
      100,
      100,
      100
    ],
    "updatedAt": "2026-07-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-it-1-2026-7-2",
    "metricId": "met-it-1",
    "year": 2026,
    "month": 7,
    "week": 2,
    "value": 100,
    "inputtedBy": "prof-pic-it",
    "dailyValues": [
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ],
    "updatedAt": "2026-07-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-it-1-2026-7-3",
    "metricId": "met-it-1",
    "year": 2026,
    "month": 7,
    "week": 3,
    "value": 100,
    "inputtedBy": "prof-pic-it",
    "dailyValues": [
      100,
      100,
      100,
      100,
      null,
      null,
      null
    ],
    "updatedAt": "2026-07-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-it-2-2026-6-1",
    "metricId": "met-it-2",
    "year": 2026,
    "month": 6,
    "week": 1,
    "value": 19.1,
    "inputtedBy": "prof-pic-it",
    "dailyValues": [
      18,
      19,
      17,
      21,
      22,
      19,
      18
    ],
    "updatedAt": "2026-06-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-it-2-2026-6-2",
    "metricId": "met-it-2",
    "year": 2026,
    "month": 6,
    "week": 2,
    "value": 16.9,
    "inputtedBy": "prof-pic-it",
    "dailyValues": [
      16,
      17,
      15,
      18,
      19,
      17,
      16
    ],
    "updatedAt": "2026-06-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-it-2-2026-6-3",
    "metricId": "met-it-2",
    "year": 2026,
    "month": 6,
    "week": 3,
    "value": 17.9,
    "inputtedBy": "prof-pic-it",
    "dailyValues": [
      17,
      18,
      16,
      19,
      20,
      18,
      17
    ],
    "updatedAt": "2026-06-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-it-2-2026-6-4",
    "metricId": "met-it-2",
    "year": 2026,
    "month": 6,
    "week": 4,
    "value": 24,
    "inputtedBy": "prof-pic-it",
    "dailyValues": [
      22,
      25,
      27,
      24,
      26,
      23,
      21
    ],
    "updatedAt": "2026-06-28T18:00:00.000Z"
  },
  {
    "id": "mv-met-it-2-2026-7-1",
    "metricId": "met-it-2",
    "year": 2026,
    "month": 7,
    "week": 1,
    "value": 16.6,
    "inputtedBy": "prof-pic-it",
    "dailyValues": [
      16,
      17,
      15,
      18,
      19,
      16,
      15
    ],
    "updatedAt": "2026-07-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-it-2-2026-7-2",
    "metricId": "met-it-2",
    "year": 2026,
    "month": 7,
    "week": 2,
    "value": 14.9,
    "inputtedBy": "prof-pic-it",
    "dailyValues": [
      14,
      15,
      13,
      16,
      17,
      15,
      14
    ],
    "updatedAt": "2026-07-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-it-2-2026-7-3",
    "metricId": "met-it-2",
    "year": 2026,
    "month": 7,
    "week": 3,
    "value": 13.5,
    "inputtedBy": "prof-pic-it",
    "dailyValues": [
      13,
      14,
      12,
      15,
      null,
      null,
      null
    ],
    "updatedAt": "2026-07-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-it-3-2026-6-1",
    "metricId": "met-it-3",
    "year": 2026,
    "month": 6,
    "week": 1,
    "value": 100,
    "inputtedBy": "prof-pic-it",
    "dailyValues": [
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ],
    "updatedAt": "2026-06-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-it-3-2026-6-2",
    "metricId": "met-it-3",
    "year": 2026,
    "month": 6,
    "week": 2,
    "value": 100,
    "inputtedBy": "prof-pic-it",
    "dailyValues": [
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ],
    "updatedAt": "2026-06-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-it-3-2026-6-3",
    "metricId": "met-it-3",
    "year": 2026,
    "month": 6,
    "week": 3,
    "value": 100,
    "inputtedBy": "prof-pic-it",
    "dailyValues": [
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ],
    "updatedAt": "2026-06-21T18:00:00.000Z"
  },
  {
    "id": "mv-met-it-3-2026-6-4",
    "metricId": "met-it-3",
    "year": 2026,
    "month": 6,
    "week": 4,
    "value": 85.7,
    "inputtedBy": "prof-pic-it",
    "dailyValues": [
      100,
      0,
      100,
      100,
      100,
      100,
      100
    ],
    "updatedAt": "2026-06-28T18:00:00.000Z"
  },
  {
    "id": "mv-met-it-3-2026-7-1",
    "metricId": "met-it-3",
    "year": 2026,
    "month": 7,
    "week": 1,
    "value": 100,
    "inputtedBy": "prof-pic-it",
    "dailyValues": [
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ],
    "updatedAt": "2026-07-07T18:00:00.000Z"
  },
  {
    "id": "mv-met-it-3-2026-7-2",
    "metricId": "met-it-3",
    "year": 2026,
    "month": 7,
    "week": 2,
    "value": 100,
    "inputtedBy": "prof-pic-it",
    "dailyValues": [
      100,
      100,
      100,
      100,
      100,
      100,
      100
    ],
    "updatedAt": "2026-07-14T18:00:00.000Z"
  },
  {
    "id": "mv-met-it-3-2026-7-3",
    "metricId": "met-it-3",
    "year": 2026,
    "month": 7,
    "week": 3,
    "value": 100,
    "inputtedBy": "prof-pic-it",
    "dailyValues": [
      100,
      100,
      100,
      100,
      null,
      null,
      null
    ],
    "updatedAt": "2026-07-21T18:00:00.000Z"
  }
];

export const INITIAL_TODOS: Todo[] = [
  {
    "id": "todo-kitch-1",
    "departmentId": "dept-kitchen",
    "title": "Audit Berkala Suhu Chiller & Deep Freezer Dapur",
    "description": "Pemeriksaan log suhu harian chiller (target 2-4°C) dan freezer (target -18°C) untuk mencegah kontaminasi daging ayam.",
    "priority": "high",
    "deadline": "2026-07-16",
    "status": "completed",
    "createdBy": "prof-pic-kitchen",
    "attachments": [
      {
        "name": "form_log_suhu_chiller_w2.pdf",
        "size": 184000,
        "type": "application/pdf"
      }
    ]
  },
  {
    "id": "todo-kitch-2",
    "departmentId": "dept-kitchen",
    "title": "Penyusunan Jadwal Deep Cleaning Exhaust Hood & Saluran Minyak",
    "description": "Koordinasi dengan vendor cleaning spesialis untuk pembersihan kerak minyak exhaust hood dapur demi pencegahan risiko kebakaran.",
    "priority": "medium",
    "deadline": "2026-07-22",
    "status": "pending",
    "createdBy": "prof-pic-kitchen",
    "attachments": []
  },
  {
    "id": "todo-kitch-3",
    "departmentId": "dept-kitchen",
    "title": "Uji Coba Batch Tester Resep Menu Nasi Pedas Cumi Hitam",
    "description": "Trial cooking 20 porsi sample menu baru bersama tim Chef & evaluasi daya simpan bumbu cumi di suhu chiller.",
    "priority": "high",
    "deadline": "2026-07-25",
    "status": "pending",
    "createdBy": "prof-pic-kitchen",
    "attachments": [
      {
        "name": "lembar_skor_blind_taste.xlsx",
        "size": 92000,
        "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      }
    ]
  },
  {
    "id": "todo-serv-1",
    "departmentId": "dept-service",
    "title": "Pelatihan Ulang Standar Table Setup & Greeting 5S",
    "description": "Briefing dan roleplay 30 menit bagi seluruh waiter dan kasir terkait senyum, salam, dan penawaran menu minuman signature.",
    "priority": "medium",
    "deadline": "2026-07-15",
    "status": "completed",
    "createdBy": "prof-pic-service",
    "attachments": []
  },
  {
    "id": "todo-serv-2",
    "departmentId": "dept-service",
    "title": "Pengecekan Stok Sendok, Garpu, & Piring Saji Keramik",
    "description": "Inventarisasi peralatan makan saji lantai 1 dan 2 untuk mengantisipasi lonjakan tamu pada akhir pekan.",
    "priority": "low",
    "deadline": "2026-07-17",
    "status": "completed",
    "createdBy": "prof-pic-service",
    "attachments": []
  },
  {
    "id": "todo-serv-3",
    "departmentId": "dept-service",
    "title": "Pemasangan Barcode QR Feedback & Menu Digital Meja 1 - 24",
    "description": "Memasang akrilik stand barcode baru di setiap meja makan agar pelanggan dapat langsung memberikan review Google Maps.",
    "priority": "high",
    "deadline": "2026-07-23",
    "status": "pending",
    "createdBy": "prof-pic-service",
    "attachments": [
      {
        "name": "desain_akrilik_qr_meja.png",
        "size": 312000,
        "type": "image/png"
      }
    ]
  },
  {
    "id": "todo-mkt-1",
    "departmentId": "dept-marketing",
    "title": "Produksi Konten Video TikTok 'Behind The Scene Bumbu Gerilya'",
    "description": "Shooting proses pembuatan sambal rahasia dari 50kg cabai segar untuk mendongkrak brand awareness organik.",
    "priority": "high",
    "deadline": "2026-07-21",
    "status": "pending",
    "createdBy": "prof-pic-marketing",
    "attachments": [
      {
        "name": "storyboard_tiktok_sambal.pdf",
        "size": 420000,
        "type": "application/pdf"
      }
    ]
  },
  {
    "id": "todo-mkt-2",
    "departmentId": "dept-marketing",
    "title": "Distribusi Brosur Paket Katering Bento ke Gedung Sudirman",
    "description": "Penyebaran 500 leaflet promosi corporate discount 15% ke resepsionis gedung perkantoran tier 1.",
    "priority": "medium",
    "deadline": "2026-07-24",
    "status": "pending",
    "createdBy": "prof-pic-marketing",
    "attachments": []
  },
  {
    "id": "todo-mkt-3",
    "departmentId": "dept-marketing",
    "title": "Setting Kampanye Meta Ads Promo Gajian Payday Special",
    "description": "Memasang target audiens radius 5km outlet dengan materi promo voucher diskon 20% dine-in.",
    "priority": "high",
    "deadline": "2026-07-18",
    "status": "completed",
    "createdBy": "prof-pic-marketing",
    "attachments": [
      {
        "name": "banner_payday_promo.jpg",
        "size": 285000,
        "type": "image/jpeg"
      }
    ]
  },
  {
    "id": "todo-fin-1",
    "departmentId": "dept-finance",
    "title": "Rekonsiliasi Settlement EDC & QRIS Bank BCA / Mandiri W2",
    "description": "Pencocokan mutasi rekening penampungan dengan rekap laporan transaksi POS kasir periode 8-14 Juli.",
    "priority": "high",
    "deadline": "2026-07-16",
    "status": "completed",
    "createdBy": "prof-pic-finance",
    "attachments": [
      {
        "name": "rekap_settlement_w2_juli.xlsx",
        "size": 145000,
        "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      }
    ]
  },
  {
    "id": "todo-fin-2",
    "departmentId": "dept-finance",
    "title": "Pengecekan Invoice Faktur Pajak Supplier Ayam & Beras",
    "description": "Validasi nominal faktur dengan purchase order dan surat jalan penerimaan barang dari tim kitchen.",
    "priority": "medium",
    "deadline": "2026-07-22",
    "status": "pending",
    "createdBy": "prof-pic-finance",
    "attachments": []
  },
  {
    "id": "todo-fin-3",
    "departmentId": "dept-finance",
    "title": "Penyusunan Draft Proyeksi Cash Flow Operasional Agustus 2026",
    "description": "Menghitung estimasi penerimaan omset dan alokasi pembayaran sewa tempat, gaji karyawan, dan HPP bahan baku.",
    "priority": "high",
    "deadline": "2026-07-26",
    "status": "pending",
    "createdBy": "prof-pic-finance",
    "attachments": []
  },
  {
    "id": "todo-it-1",
    "departmentId": "dept-it",
    "title": "Penggantian Kabel Patch UTP Cat6 Switch Kasir 1 & 2",
    "description": "Mengganti kabel LAN lama yang sering goyang untuk menjamin kestabilan koneksi printer thermal kasir.",
    "priority": "high",
    "deadline": "2026-07-17",
    "status": "completed",
    "createdBy": "prof-pic-it",
    "attachments": []
  },
  {
    "id": "todo-it-2",
    "departmentId": "dept-it",
    "title": "Uji Coba Script Auto-Sync Database ke Secondary Storage",
    "description": "Simulasi recovery restore data SQLite/PostgreSQL untuk memastikan backup snapshot berjalan tanpa error.",
    "priority": "medium",
    "deadline": "2026-07-16",
    "status": "completed",
    "createdBy": "prof-pic-it",
    "attachments": [
      {
        "name": "backup_health_check_log.txt",
        "size": 45000,
        "type": "text/plain"
      }
    ]
  },
  {
    "id": "todo-it-3",
    "departmentId": "dept-it",
    "title": "Pemasangan Access Point Wi-Fi Kedua Area Outdoor Lantai 2",
    "description": "Instalasi perangkat WiFi 6 tambahan agar pengunjung area smoking dan outdoor mendapatkan sinyal kuat.",
    "priority": "medium",
    "deadline": "2026-07-24",
    "status": "pending",
    "createdBy": "prof-pic-it",
    "attachments": []
  }
];

export const INITIAL_ISSUES: Issue[] = [
  {
    "id": "iss-kitch-1",
    "departmentId": "dept-kitchen",
    "title": "Kenaikan Harga Minyak Goreng & Cabai Rawit dari Pasar Induk",
    "description": "Harga cabai rawit merah melonjak 35% akibat gagal panen cuaca ekstrem. Berisiko menaikkan food cost sambal gerilya jika tidak dicari pemasok alternatif.",
    "priority": "high",
    "status": "in_progress",
    "picId": "prof-pic-kitchen",
    "picName": "Kitchen",
    "createdAt": "2026-07-14T09:30:00.000Z",
    "attachments": [
      {
        "name": "faktur_harga_pasar_induk.jpg",
        "size": 215000,
        "type": "image/jpeg"
      }
    ]
  },
  {
    "id": "iss-kitch-2",
    "departmentId": "dept-kitchen",
    "title": "Kulkas Chiller 2 Sempat Mengalami Fluktuasi Suhu Naik ke 9°C",
    "description": "Suhu chiller daging ayam naik melampaui batas aman (target 4°C). Telah dipanggil teknisi servis pendingin dan filter kondensor dibersihkan.",
    "priority": "critical",
    "status": "solved",
    "picId": "prof-pic-kitchen",
    "picName": "Kitchen",
    "createdAt": "2026-07-12T11:00:00.000Z",
    "attachments": [
      {
        "name": "laporan_servis_kompresor.pdf",
        "size": 142000,
        "type": "application/pdf"
      }
    ]
  },
  {
    "id": "iss-serv-1",
    "departmentId": "dept-service",
    "title": "Antrean Kasir Menumpuk di Jam 12.30 WIB Akibat Respon Mesin EDC Lambat",
    "description": "Mesin EDC BCA lambat mencetak struk saat sinyal seluler drop di jam makan siang, menyebabkan antrean 6 orang di depan meja kasir.",
    "priority": "high",
    "status": "in_progress",
    "picId": "prof-pic-service",
    "picName": "Service",
    "createdAt": "2026-07-16T13:00:00.000Z",
    "attachments": []
  },
  {
    "id": "iss-serv-2",
    "departmentId": "dept-service",
    "title": "Komplain Pelanggan Terkait Waktu Tunggu Meja 14 Melebihi 25 Menit",
    "description": "Pesanan ayam bakar madu meja 14 terlewat di antrean KDS dapur saat jam ramai Sabtu malam. Pelanggan telah diberikan complimentary dessert.",
    "priority": "medium",
    "status": "solved",
    "picId": "prof-pic-service",
    "picName": "Service",
    "createdAt": "2026-07-11T20:30:00.000Z",
    "attachments": []
  },
  {
    "id": "iss-mkt-1",
    "departmentId": "dept-marketing",
    "title": "Kemasan Bento Box Katering Pesanan 50 Porsi Rembes Kuah Gulai",
    "description": "Kardus bento box lama tidak memiliki lapisan penahan minyak/kuah sehingga terjadi rembesan pada tutup saat pengiriman kurir motor.",
    "priority": "critical",
    "status": "solved",
    "picId": "prof-pic-marketing",
    "picName": "Marketing",
    "createdAt": "2026-07-13T10:15:00.000Z",
    "attachments": [
      {
        "name": "foto_kemasan_rembes.jpg",
        "size": 340000,
        "type": "image/jpeg"
      }
    ]
  },
  {
    "id": "iss-mkt-2",
    "departmentId": "dept-marketing",
    "title": "Biaya CPM Iklan Instagram Ads Meningkat 28% di Awal Pekan",
    "description": "Efektivitas iklan promo makan siang menurun akibat tingginya kompetisi iklan kuliner di feed audiens Jakarta Selatan.",
    "priority": "medium",
    "status": "open",
    "picId": "prof-pic-marketing",
    "picName": "Marketing",
    "createdAt": "2026-07-15T14:40:00.000Z",
    "attachments": []
  },
  {
    "id": "iss-fin-1",
    "departmentId": "dept-finance",
    "title": "Selisih Kasir Shift Malam Sebesar Rp 85.000 pada 16 Juli",
    "description": "Ditemukan selisih fisik uang kas dengan laporan POS kasir 2. Setelah dicocokkan dengan log struk, ditemukan kesalahan kembalian tunai.",
    "priority": "medium",
    "status": "solved",
    "picId": "prof-pic-finance",
    "picName": "Finance",
    "createdAt": "2026-07-17T08:10:00.000Z",
    "attachments": [
      {
        "name": "berita_acara_selisih_kas.pdf",
        "size": 120000,
        "type": "application/pdf"
      }
    ]
  },
  {
    "id": "iss-fin-2",
    "departmentId": "dept-finance",
    "title": "Keterlambatan Pengiriman Faktur Pajak dari Supplier Sayuran",
    "description": "Vendor sayur CV Berkah belum menyerahkan faktur pajak masa Juni sehingga menunda proses rekonsiliasi PPN masukan.",
    "priority": "low",
    "status": "open",
    "picId": "prof-pic-finance",
    "picName": "Finance",
    "createdAt": "2026-07-16T11:20:00.000Z",
    "attachments": []
  },
  {
    "id": "iss-it-1",
    "departmentId": "dept-it",
    "title": "Printer Kasir Thermal Sering Macet saat Cetak Struk Panjang",
    "description": "Roller pemotong kertas (auto-cutter) thermal printer kasir 1 tumpul akibat serbuk kertas struk menumpuk. Perlu deep cleaning cutter.",
    "priority": "medium",
    "status": "solved",
    "picId": "prof-pic-it",
    "picName": "IT",
    "createdAt": "2026-07-14T16:00:00.000Z",
    "attachments": []
  },
  {
    "id": "iss-it-2",
    "departmentId": "dept-it",
    "title": "Koneksi Provider Internet Backup Mengalami Latensi Tinggi",
    "description": "Jaringan secondary ISP mengalami packet loss 15% sehingga perpindahan jaringan kasir saat failover terasa tersendat.",
    "priority": "high",
    "status": "in_progress",
    "picId": "prof-pic-it",
    "picName": "IT",
    "createdAt": "2026-07-17T15:30:00.000Z",
    "attachments": [
      {
        "name": "ping_mtr_report.txt",
        "size": 38000,
        "type": "text/plain"
      }
    ]
  },
  {
    "id": "iss-own-1",
    "departmentId": "dept-kitchen",
    "title": "Perluasan Area Parkir Motor Karyawan Dapur & Floor",
    "description": "Parkir motor tim operasional menyita space parkir pelanggan di jam sibuk makan siang. Perlu sewa lahan penitipan sebelah outlet.",
    "priority": "medium",
    "status": "in_progress",
    "picId": "prof-owner",
    "picName": "Owner",
    "createdAt": "2026-07-15T16:00:00.000Z",
    "attachments": []
  },
  {
    "id": "iss-own-2",
    "departmentId": "dept-service",
    "title": "Penyesuaian Jam Buka Outlet Menjadi Pukul 09.30 WIB",
    "description": "Permintaan pelanggan sarapan pagi meningkat. Operasional siap buka 30 menit lebih awal mulai minggu depan.",
    "priority": "low",
    "status": "solved",
    "picId": "prof-owner",
    "picName": "Owner",
    "createdAt": "2026-07-10T09:00:00.000Z",
    "attachments": []
  }
];

export const INITIAL_HEADLINES: Headline[] = [
  {
    "id": "head-1",
    "departmentId": "dept-kitchen",
    "title": "Menu Spesial Nasi Cakalang Suwir Tembus 1.200 Porsi di Bulan Ini!",
    "content": "Apresiasi luar biasa untuk seluruh tim Kitchen! Menu kreasi baru Nasi Cakalang Suwir Pedas Asap sukses mencatat penjualan tertinggi sejak pertama kali diluncurkan. Pertahankan standar kelezatan dan kecepatan masak!",
    "category": "achievement",
    "authorId": "prof-owner",
    "authorName": "Owner",
    "createdAt": "2026-07-17T10:00:00.000Z",
    "attachments": [
      {
        "name": "foto_nasi_cakalang_juara.jpg",
        "size": 280000,
        "type": "image/jpeg"
      }
    ]
  },
  {
    "id": "head-2",
    "departmentId": "dept-marketing",
    "title": "Rekor Omset Penjualan Bersih Harian Tertinggi Rp 28.5 Juta!",
    "content": "Pada puncak promo akhir pekan kemarin, Nasi Gerilya berhasil memecahkan rekor omset harian tertinggi sepanjang tahun 2026. Terima kasih kepada kerja keras solid seluruh divisi dari persiapan dapur, pelayanan kasir, hingga tim promosi digital!",
    "category": "achievement",
    "authorId": "prof-owner",
    "authorName": "Owner",
    "createdAt": "2026-07-13T09:00:00.000Z",
    "attachments": []
  },
  {
    "id": "head-3",
    "departmentId": "dept-service",
    "title": "Rating Ulasan Google Maps Outlet Naik ke Angka Sempurna 4.9 Bintang!",
    "content": "Total ulasan positif pelanggan di Google Maps kini telah melampaui 400 ulasan dengan rata-rata 4.9 bintang. Pelanggan secara khusus memuji keramahan waiter dan kebersihan area makan yang selalu terjaga.",
    "category": "good_news",
    "authorId": "prof-pic-service",
    "authorName": "Service",
    "createdAt": "2026-07-16T14:30:00.000Z",
    "attachments": []
  },
  {
    "id": "head-4",
    "departmentId": "dept-service",
    "title": "Seluruh Tim Front of House Meraih Sertifikasi Pelayanan Hospitality",
    "content": "Selamat kepada 8 staf floor dan kasir yang telah menyelesaikan modul pelatihan Hospitality Service & Handling Complaint dengan nilai rata-rata 94%.",
    "category": "good_news",
    "authorId": "prof-pic-service",
    "authorName": "Service",
    "createdAt": "2026-07-15T11:00:00.000Z",
    "attachments": [
      {
        "name": "sertifikat_kelulusan_tim_service.pdf",
        "size": 310000,
        "type": "application/pdf"
      }
    ]
  },
  {
    "id": "head-5",
    "departmentId": "dept-marketing",
    "title": "Peluncuran Paket Langganan Bento Box Korporat Mulai Senin Depan",
    "content": "Mulai hari Senin tanggal 20 Juli, Nasi Gerilya resmi meluncurkan paket lunch box korporat dengan minimal pemesanan 10 pax dan gratis ongkir radius 3 km.",
    "category": "announcement",
    "authorId": "prof-pic-marketing",
    "authorName": "Marketing",
    "createdAt": "2026-07-16T16:00:00.000Z",
    "attachments": [
      {
        "name": "katalog_bento_box_korporat.pdf",
        "size": 450000,
        "type": "application/pdf"
      }
    ]
  },
  {
    "id": "head-6",
    "departmentId": "dept-kitchen",
    "title": "Penerapan Standar Baru SOP Penerimaan Sayur & Daging Segar",
    "content": "Diinfokan kepada seluruh cook helper bahwa setiap penerimaan bahan segar dari vendor wajib dilakukan penimbangan ulang di depan kurir dan pencatatan suhu armada pengantar.",
    "category": "announcement",
    "authorId": "prof-pic-kitchen",
    "authorName": "Kitchen",
    "createdAt": "2026-07-14T08:00:00.000Z",
    "attachments": []
  },
  {
    "id": "head-7",
    "departmentId": "dept-it",
    "title": "Pemberitahuan Pemeliharaan Server Cloud Hari Minggu Pukul 23.30 WIB",
    "content": "Akan dilakukan update patch keamanan sistem database dan restart router utama pada hari Minggu malam setelah outlet tutup. Sinkronisasi data POS offline aktif otomatis.",
    "category": "reminder",
    "authorId": "prof-pic-it",
    "authorName": "IT",
    "createdAt": "2026-07-17T17:00:00.000Z",
    "attachments": []
  },
  {
    "id": "head-8",
    "departmentId": "dept-finance",
    "title": "Batas Waktu Pengumpulan Nota Reimbursement Petty Cash Tanggal 22 Juli",
    "content": "Dimohon kepada seluruh PIC divisi untuk menyerahkan nota fisik pengeluaran operasional minggu ini ke bagian Finance paling lambat Rabu sore pukul 17.00 WIB.",
    "category": "reminder",
    "authorId": "prof-pic-finance",
    "authorName": "Finance",
    "createdAt": "2026-07-15T15:00:00.000Z",
    "attachments": []
  },
  {
    "id": "head-9",
    "departmentId": "dept-kitchen",
    "title": "Kenaikan Harga Minyak Goreng & Cabai Merah Diperkirakan Berlanjut",
    "content": "Pemberitahuan dari asosiasi pasar tradisional bahwa lonjakan harga bahan baku cabai dan minyak diperkirakan bertahan hingga 2 pekan ke depan. Tim dapur dihimbau mengontrol porsi dan mencegah sisa masakan berlebih.",
    "category": "bad_news",
    "authorId": "prof-pic-kitchen",
    "authorName": "Kitchen",
    "createdAt": "2026-07-14T10:00:00.000Z",
    "attachments": []
  },
  {
    "id": "head-10",
    "departmentId": "dept-it",
    "title": "Kendala Gangguan Jaringan ISP Utama Mengalami Penurunan Kecepatan",
    "content": "Jaringan fiber optik ISP utama di wilayah jalan utama mengalami degradasi kecepatan sejak siang hari. Koneksi kasir telah dialihkan ke backup seluler Telkomsel Orbit.",
    "category": "bad_news",
    "authorId": "prof-pic-it",
    "authorName": "IT",
    "createdAt": "2026-07-16T12:45:00.000Z",
    "attachments": []
  }
];

export const INITIAL_LOGS_DATA: HistoryLog[] = [
  {
    "id": "log-1",
    "profileId": "prof-owner",
    "profileName": "Owner",
    "departmentId": null,
    "action": "Publikasi Headline",
    "details": "Mempublikasikan warta pencapaian: \"Menu Spesial Nasi Cakalang Suwir Tembus 1.200 Porsi di Bulan Ini!\"",
    "createdAt": "2026-07-17T10:00:00.000Z"
  },
  {
    "id": "log-2",
    "profileId": "prof-pic-it",
    "profileName": "IT",
    "departmentId": "dept-it",
    "action": "Selesaikan Todo",
    "details": "Menandai selesai tugas: \"Penggantian Kabel Patch UTP Cat6 Switch Kasir 1 & 2\"",
    "createdAt": "2026-07-17T09:30:00.000Z"
  },
  {
    "id": "log-3",
    "profileId": "prof-pic-finance",
    "profileName": "Finance",
    "departmentId": "dept-finance",
    "action": "Selesaikan Issue",
    "details": "Menyelesaikan kendala IDS: \"Selisih Kasir Shift Malam Sebesar Rp 85.000 pada 16 Juli\"",
    "createdAt": "2026-07-17T08:15:00.000Z"
  },
  {
    "id": "log-4",
    "profileId": "prof-pic-marketing",
    "profileName": "Marketing",
    "departmentId": "dept-marketing",
    "action": "Input Nilai Metrik",
    "details": "Memperbarui nilai aktual W3 Juli untuk \"Omset Penjualan Bersih Mingguan\": Rp 79.300.000",
    "createdAt": "2026-07-16T18:00:00.000Z"
  },
  {
    "id": "log-5",
    "profileId": "prof-pic-kitchen",
    "profileName": "Kitchen",
    "departmentId": "dept-kitchen",
    "action": "Input Nilai Metrik",
    "details": "Memperbarui nilai aktual W3 Juli untuk \"Food Cost Percentage\": 26.5%",
    "createdAt": "2026-07-16T17:45:00.000Z"
  },
  {
    "id": "log-6",
    "profileId": "prof-pic-service",
    "profileName": "Service",
    "departmentId": "dept-service",
    "action": "Input Nilai Metrik",
    "details": "Memperbarui nilai aktual W3 Juli untuk \"Rating Kepuasan Pelanggan (CSI)\": 4.93",
    "createdAt": "2026-07-16T17:30:00.000Z"
  },
  {
    "id": "log-7",
    "profileId": "prof-pic-it",
    "profileName": "IT",
    "departmentId": "dept-it",
    "action": "Input Nilai Metrik",
    "details": "Memperbarui nilai aktual W3 Juli untuk \"Uptime Sistem POS & Cloud Server\": 100.0%",
    "createdAt": "2026-07-16T17:15:00.000Z"
  },
  {
    "id": "log-8",
    "profileId": "prof-pic-finance",
    "profileName": "Finance",
    "departmentId": "dept-finance",
    "action": "Selesaikan Todo",
    "details": "Menandai selesai tugas: \"Rekonsiliasi Settlement EDC & QRIS Bank BCA / Mandiri W2\"",
    "createdAt": "2026-07-16T16:00:00.000Z"
  },
  {
    "id": "log-9",
    "profileId": "prof-pic-kitchen",
    "profileName": "Kitchen",
    "departmentId": "dept-kitchen",
    "action": "Selesaikan Todo",
    "details": "Menandai selesai tugas: \"Audit Berkala Suhu Chiller & Deep Freezer Dapur\"",
    "createdAt": "2026-07-16T15:30:00.000Z"
  },
  {
    "id": "log-10",
    "profileId": "prof-pic-service",
    "profileName": "Service",
    "departmentId": "dept-service",
    "action": "Tambah Todo",
    "details": "Membuat agenda tugas baru: \"Pemasangan Barcode QR Feedback & Menu Digital Meja 1 - 24\"",
    "createdAt": "2026-07-16T11:00:00.000Z"
  },
  {
    "id": "log-11",
    "profileId": "prof-owner",
    "profileName": "Owner",
    "departmentId": "dept-service",
    "action": "Selesaikan Issue",
    "details": "Menyelesaikan kendala: \"Penyesuaian Jam Buka Outlet Menjadi Pukul 09.30 WIB\"",
    "createdAt": "2026-07-15T17:00:00.000Z"
  },
  {
    "id": "log-12",
    "profileId": "prof-pic-marketing",
    "profileName": "Marketing",
    "departmentId": "dept-marketing",
    "action": "Tambah Todo",
    "details": "Membuat agenda tugas baru: \"Produksi Konten Video TikTok Behind The Scene Bumbu Gerilya\"",
    "createdAt": "2026-07-15T14:00:00.000Z"
  },
  {
    "id": "log-13",
    "profileId": "prof-pic-service",
    "profileName": "Service",
    "departmentId": "dept-service",
    "action": "Selesaikan Todo",
    "details": "Menandai selesai tugas: \"Pelatihan Ulang Standar Table Setup & Greeting 5S\"",
    "createdAt": "2026-07-15T11:30:00.000Z"
  },
  {
    "id": "log-14",
    "profileId": "prof-pic-kitchen",
    "profileName": "Kitchen",
    "departmentId": "dept-kitchen",
    "action": "Tambah Issue",
    "details": "Melaporkan kendala IDS: \"Kenaikan Harga Minyak Goreng & Cabai Rawit dari Pasar Induk\"",
    "createdAt": "2026-07-14T09:30:00.000Z"
  },
  {
    "id": "log-15",
    "profileId": "prof-pic-it",
    "profileName": "IT",
    "departmentId": "dept-it",
    "action": "Selesaikan Issue",
    "details": "Menyelesaikan kendala: \"Printer Kasir Thermal Sering Macet saat Cetak Struk Panjang\"",
    "createdAt": "2026-07-14T17:00:00.000Z"
  },
  {
    "id": "log-16",
    "profileId": "prof-pic-marketing",
    "profileName": "Marketing",
    "departmentId": "dept-marketing",
    "action": "Selesaikan Issue",
    "details": "Menyelesaikan kendala: \"Kemasan Bento Box Katering Pesanan 50 Porsi Rembes Kuah Gulai\"",
    "createdAt": "2026-07-13T16:00:00.000Z"
  },
  {
    "id": "log-17",
    "profileId": "prof-owner",
    "profileName": "Owner",
    "departmentId": null,
    "action": "Publikasi Headline",
    "details": "Mempublikasikan warta pencapaian: \"Rekor Omset Penjualan Bersih Harian Tertinggi Rp 28.5 Juta!\"",
    "createdAt": "2026-07-13T09:00:00.000Z"
  },
  {
    "id": "log-18",
    "profileId": "prof-pic-kitchen",
    "profileName": "Kitchen",
    "departmentId": "dept-kitchen",
    "action": "Selesaikan Issue",
    "details": "Menyelesaikan kendala IDS: \"Kulkas Chiller 2 Sempat Mengalami Fluktuasi Suhu Naik ke 9°C\"",
    "createdAt": "2026-07-12T15:00:00.000Z"
  },
  {
    "id": "log-19",
    "profileId": "prof-pic-service",
    "profileName": "Service",
    "departmentId": "dept-service",
    "action": "Selesaikan Issue",
    "details": "Menyelesaikan kendala: \"Komplain Pelanggan Terkait Waktu Tunggu Meja 14 Melebihi 25 Menit\"",
    "createdAt": "2026-07-11T21:00:00.000Z"
  },
  {
    "id": "log-20",
    "profileId": "prof-owner",
    "profileName": "Owner",
    "departmentId": null,
    "action": "Update Rock",
    "details": "Memperbarui progres Batu Sasaran: \"Standarisasi Resep Bumbu Inti & SOP Dapur 5 Cabang\"",
    "createdAt": "2026-07-10T14:00:00.000Z"
  }
];
