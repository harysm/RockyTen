import { Department, Profile, Rock, Metric, MetricValue, Todo, Issue, Headline } from "@/types";

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
    email: "developer@garciafood.com" 
  },
  { 
    id: "prof-owner", 
    name: "Richard (Direktur / Owner)", 
    role: "owner", 
    departmentId: null, 
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80", 
    email: "owner@garciafood.com" 
  },
  { 
    id: "prof-pic-it", 
    name: "Devin Satria (Leader IT)", 
    role: "pic", 
    departmentId: "dept-it", 
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80", 
    email: "it@garciafood.com" 
  },
  { 
    id: "prof-pic-finance", 
    name: "Sarah Novita (Leader Finance)", 
    role: "pic", 
    departmentId: "dept-finance", 
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80", 
    email: "finance@garciafood.com" 
  },
  { 
    id: "prof-pic-kitchen", 
    name: "Chef Budi Santoso (Leader Kitchen)", 
    role: "pic", 
    departmentId: "dept-kitchen", 
    avatarUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=250&q=80", 
    email: "kitchen@garciafood.com" 
  },
  { 
    id: "prof-pic-service", 
    name: "Rian Pratama (Leader Service)", 
    role: "pic", 
    departmentId: "dept-service", 
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80", 
    email: "service@garciafood.com" 
  },
  { 
    id: "prof-pic-marketing", 
    name: "Dewi Lestari (Leader Marketing)", 
    role: "pic", 
    departmentId: "dept-marketing", 
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=250&q=80", 
    email: "marketing@garciafood.com" 
  }
];

export const DEFAULT_CREDENTIALS: Record<string, { password: string; profileId: string }> = {
  "developer@garciafood.com": { password: "dev123", profileId: "prof-dev" },
  "owner@garciafood.com": { password: "owner123", profileId: "prof-owner" },
  "it@garciafood.com": { password: "123456", profileId: "prof-pic-it" },
  "finance@garciafood.com": { password: "123456", profileId: "prof-pic-finance" },
  "kitchen@garciafood.com": { password: "123456", profileId: "prof-pic-kitchen" },
  "service@garciafood.com": { password: "123456", profileId: "prof-pic-service" },
  "marketing@garciafood.com": { password: "123456", profileId: "prof-pic-marketing" }
};

export const INITIAL_ROCKS: Rock[] = [
  {
    id: "rock-it-1",
    departmentId: "dept-it",
    title: "Otomasi Sistem Presensi & Migrasi Cloud Server",
    description: "Memindahkan seluruh server aplikasi lokal ke infrastruktur cloud dengan uptime 99.5% dan mengintegrasikan mesin absensi biometrik.",
    quarter: "Q3",
    year: 2026,
    status: "on_track",
    picId: "prof-pic-it",
    picName: "Devin Satria",
    dueDate: "2026-09-30",
    createdAt: "2026-07-01T08:00:00.000Z"
  },
  {
    id: "rock-kitchen-1",
    departmentId: "dept-kitchen",
    title: "Standardisasi Resep & Reduksi Food Waste 15%",
    description: "Pembaruan panduan gramasi baku masakan pusat dan sistem rotasi bahan FIFO untuk menekan sisa bahan terbuang di bawah 5%.",
    quarter: "Q3",
    year: 2026,
    status: "on_track",
    picId: "prof-pic-kitchen",
    picName: "Chef Budi Santoso",
    dueDate: "2026-09-30",
    createdAt: "2026-07-01T08:00:00.000Z"
  },
  {
    id: "rock-service-1",
    departmentId: "dept-service",
    title: "Pelatihan Hospitality & Peningkatan CSAT Layanan ke 4.8",
    description: "Pelatihan standar 5S untuk seluruh kru pelayanan frontliners dan penerapan sistem survei kepuasan pelanggan instan.",
    quarter: "Q3",
    year: 2026,
    status: "on_track",
    picId: "prof-pic-service",
    picName: "Rian Pratama",
    dueDate: "2026-09-30",
    createdAt: "2026-07-01T08:00:00.000Z"
  },
  {
    id: "rock-finance-1",
    departmentId: "dept-finance",
    title: "Audit Pajak & Otomasi Rekonsiliasi Kas Harian",
    description: "Implementasi integrasi POS kasir langsung ke jurnal akuntansi untuk menuntaskan rekon harian 100% tepat waktu.",
    quarter: "Q3",
    year: 2026,
    status: "on_track",
    picId: "prof-pic-finance",
    picName: "Sarah Novita",
    dueDate: "2026-09-30",
    createdAt: "2026-07-01T08:00:00.000Z"
  },
  {
    id: "rock-marketing-1",
    departmentId: "dept-marketing",
    title: "Kampanye Digital Menu Katering Korporat Q3",
    description: "Mendapatkan minimal 30 klien B2B korporat baru untuk paket makan siang mingguan via targeted ads dan direct sales.",
    quarter: "Q3",
    year: 2026,
    status: "off_track",
    picId: "prof-pic-marketing",
    picName: "Dewi Lestari",
    dueDate: "2026-09-30",
    createdAt: "2026-07-01T08:00:00.000Z"
  }
];

export const INITIAL_METRICS: Metric[] = [
  // IT Division
  {
    id: "met-it-1",
    departmentId: "dept-it",
    rockId: "rock-it-1", // Sub-metrik Rock IT
    name: "Server Uptime Cloud",
    target: 99.5,
    unit: "percentage",
    targetType: "higher_better",
    picId: "prof-pic-it",
    picName: "Devin Satria",
    keterangan: "Sub-metrik Rock Migrasi Cloud Server",
    isActive: true,
    cycleType: "monthly",
    createdAt: "2026-07-01T08:00:00.000Z",
    accumulationMode: "average"
  },
  {
    id: "met-it-2",
    departmentId: "dept-it",
    rockId: "rock-it-1", // Sub-metrik Rock IT
    name: "Tiket Trouble IT Selesai < 2 Jam",
    target: 30,
    unit: "number",
    targetType: "higher_better",
    picId: "prof-pic-it",
    picName: "Devin Satria",
    keterangan: "Resolusi cepat kendala operasional cabang",
    isActive: true,
    cycleType: "monthly",
    createdAt: "2026-07-01T08:00:00.000Z",
    accumulationMode: "sum"
  },
  {
    id: "met-it-3",
    departmentId: "dept-it",
    rockId: null, // METRIK MANDIRI
    name: "Audit Keamanan & Patching Mingguan",
    target: 4,
    unit: "number",
    targetType: "higher_better",
    picId: "prof-pic-it",
    picName: "Devin Satria",
    keterangan: "Metrik mandiri operasional IT",
    isActive: true,
    cycleType: "monthly",
    createdAt: "2026-07-01T08:00:00.000Z",
    accumulationMode: "sum"
  },

  // Kitchen Division
  {
    id: "met-kt-1",
    departmentId: "dept-kitchen",
    rockId: "rock-kitchen-1", // Sub-metrik Rock Kitchen
    name: "Persentase Food Waste Dapur",
    target: 5.0,
    unit: "percentage",
    targetType: "lower_better",
    picId: "prof-pic-kitchen",
    picName: "Chef Budi Santoso",
    keterangan: "Toleransi limbah sisa bahan olahan dapur",
    isActive: true,
    cycleType: "monthly",
    createdAt: "2026-07-01T08:00:00.000Z",
    accumulationMode: "average"
  },
  {
    id: "met-kt-2",
    departmentId: "dept-kitchen",
    rockId: "rock-kitchen-1", // Sub-metrik Rock Kitchen
    name: "Ketepatan Waktu Prep Masakan (< 15 Mnt)",
    target: 95.0,
    unit: "percentage",
    targetType: "higher_better",
    picId: "prof-pic-kitchen",
    picName: "Chef Budi Santoso",
    keterangan: "Kelancaran alur produksi pesanan",
    isActive: true,
    cycleType: "monthly",
    createdAt: "2026-07-01T08:00:00.000Z",
    accumulationMode: "average"
  },
  {
    id: "met-kt-3",
    departmentId: "dept-kitchen",
    rockId: null, // METRIK MANDIRI
    name: "Sanitasi & Pembersihan Deep Clean Mingguan",
    target: 4,
    unit: "number",
    targetType: "higher_better",
    picId: "prof-pic-kitchen",
    picName: "Chef Budi Santoso",
    keterangan: "Metrik mandiri higienitas area kitchen",
    isActive: true,
    cycleType: "monthly",
    createdAt: "2026-07-01T08:00:00.000Z",
    accumulationMode: "sum"
  },

  // Service Division
  {
    id: "met-sv-1",
    departmentId: "dept-service",
    rockId: "rock-service-1", // Sub-metrik Rock Service
    name: "Skor Kepuasan Pelanggan (CSAT %)",
    target: 95.0,
    unit: "percentage",
    targetType: "higher_better",
    picId: "prof-pic-service",
    picName: "Rian Pratama",
    keterangan: "Tingkat kepuasan layanan frontline",
    isActive: true,
    cycleType: "monthly",
    createdAt: "2026-07-01T08:00:00.000Z",
    accumulationMode: "average"
  },
  {
    id: "met-sv-2",
    departmentId: "dept-service",
    rockId: "rock-service-1", // Sub-metrik Rock Service
    name: "Kecepatan Respon Komplain (< 5 Menit)",
    target: 90.0,
    unit: "percentage",
    targetType: "higher_better",
    picId: "prof-pic-service",
    picName: "Rian Pratama",
    keterangan: "SLA penanganan keluhan tamu di outlet",
    isActive: true,
    cycleType: "monthly",
    createdAt: "2026-07-01T08:00:00.000Z",
    accumulationMode: "average"
  },
  {
    id: "met-sv-3",
    departmentId: "dept-service",
    rockId: null, // METRIK MANDIRI
    name: "Briefing Standar Layanan Frontline (Sesi)",
    target: 12,
    unit: "number",
    targetType: "higher_better",
    picId: "prof-pic-service",
    picName: "Rian Pratama",
    keterangan: "Metrik mandiri kedisiplinan briefing shift",
    isActive: true,
    cycleType: "monthly",
    createdAt: "2026-07-01T08:00:00.000Z",
    accumulationMode: "sum"
  },

  // Finance Division
  {
    id: "met-fn-1",
    departmentId: "dept-finance",
    rockId: "rock-finance-1", // Sub-metrik Rock Finance
    name: "Ketepatan Rekonsiliasi Bank Mingguan",
    target: 100.0,
    unit: "percentage",
    targetType: "higher_better",
    picId: "prof-pic-finance",
    picName: "Sarah Novita",
    keterangan: "Kesesuaian saldo mutasi bank vs sistem POS",
    isActive: true,
    cycleType: "monthly",
    createdAt: "2026-07-01T08:00:00.000Z",
    accumulationMode: "average"
  },
  {
    id: "met-fn-2",
    departmentId: "dept-finance",
    rockId: "rock-finance-1", // Sub-metrik Rock Finance
    name: "Pembayaran Tagihan Supplier Tepat Waktu",
    target: 95.0,
    unit: "percentage",
    targetType: "higher_better",
    picId: "prof-pic-finance",
    picName: "Sarah Novita",
    keterangan: "Disiplin termin pembayaran logistik",
    isActive: true,
    cycleType: "monthly",
    createdAt: "2026-07-01T08:00:00.000Z",
    accumulationMode: "average"
  },
  {
    id: "met-fn-3",
    departmentId: "dept-finance",
    rockId: null, // METRIK MANDIRI
    name: "Audit Kas Kecil Fisik (Petty Cash)",
    target: 4,
    unit: "number",
    targetType: "higher_better",
    picId: "prof-pic-finance",
    picName: "Sarah Novita",
    keterangan: "Metrik mandiri pemeriksaan uang tunai kasir",
    isActive: true,
    cycleType: "monthly",
    createdAt: "2026-07-01T08:00:00.000Z",
    accumulationMode: "sum"
  },

  // Marketing Division
  {
    id: "met-mk-1",
    departmentId: "dept-marketing",
    rockId: "rock-marketing-1", // Sub-metrik Rock Marketing
    name: "Leads Korporat Baru (Akun B2B)",
    target: 25,
    unit: "number",
    targetType: "higher_better",
    picId: "prof-pic-marketing",
    picName: "Dewi Lestari",
    keterangan: "Calon klien instansi untuk katering",
    isActive: true,
    cycleType: "monthly",
    createdAt: "2026-07-01T08:00:00.000Z",
    accumulationMode: "sum"
  },
  {
    id: "met-mk-2",
    departmentId: "dept-marketing",
    rockId: "rock-marketing-1", // Sub-metrik Rock Marketing
    name: "Konversi Closing Sales Katering",
    target: 20.0,
    unit: "percentage",
    targetType: "higher_better",
    picId: "prof-pic-marketing",
    picName: "Dewi Lestari",
    keterangan: "Rasio penutupan kesepakatan kontrak",
    isActive: true,
    cycleType: "monthly",
    createdAt: "2026-07-01T08:00:00.000Z",
    accumulationMode: "average"
  },
  {
    id: "met-mk-3",
    departmentId: "dept-marketing",
    rockId: null, // METRIK MANDIRI
    name: "Jangkauan Iklan Media Sosial (Ribu Akun)",
    target: 80,
    unit: "number",
    targetType: "higher_better",
    picId: "prof-pic-marketing",
    picName: "Dewi Lestari",
    keterangan: "Metrik mandiri brand awareness mingguan",
    isActive: true,
    cycleType: "monthly",
    createdAt: "2026-07-01T08:00:00.000Z",
    accumulationMode: "sum"
  }
];

export const INITIAL_METRIC_VALUES: MetricValue[] = [
  // IT
  { id: "val-it-1-w1", metricId: "met-it-1", year: 2026, month: 7, week: 1, value: 99.8, dailyValues: [99.8, 99.9, 100, 99.7, 99.8, 99.9, 99.8] },
  { id: "val-it-1-w2", metricId: "met-it-1", year: 2026, month: 7, week: 2, value: 99.6, dailyValues: [99.6, 99.5, 99.7, 99.6, 99.8, 99.5, 99.6] },
  { id: "val-it-1-w3", metricId: "met-it-1", year: 2026, month: 7, week: 3, value: 99.7, dailyValues: [99.8, 99.7, 99.6, 99.8, 99.7, null, null] },
  { id: "val-it-2-w1", metricId: "met-it-2", year: 2026, month: 7, week: 1, value: 28, dailyValues: [4, 5, 4, 3, 5, 4, 3] },
  { id: "val-it-2-w2", metricId: "met-it-2", year: 2026, month: 7, week: 2, value: 31, dailyValues: [5, 4, 5, 4, 5, 4, 4] },
  { id: "val-it-2-w3", metricId: "met-it-2", year: 2026, month: 7, week: 3, value: 20, dailyValues: [4, 4, 5, 4, 3, null, null] },
  { id: "val-it-3-w1", metricId: "met-it-3", year: 2026, month: 7, week: 1, value: 1 },
  { id: "val-it-3-w2", metricId: "met-it-3", year: 2026, month: 7, week: 2, value: 1 },
  { id: "val-it-3-w3", metricId: "met-it-3", year: 2026, month: 7, week: 3, value: 1 },

  // Kitchen
  { id: "val-kt-1-w1", metricId: "met-kt-1", year: 2026, month: 7, week: 1, value: 4.2, dailyValues: [4.1, 4.3, 4.0, 4.2, 4.5, 4.1, 4.2] },
  { id: "val-kt-1-w2", metricId: "met-kt-1", year: 2026, month: 7, week: 2, value: 4.6, dailyValues: [4.5, 4.4, 4.8, 4.6, 4.7, 4.5, 4.6] },
  { id: "val-kt-1-w3", metricId: "met-kt-1", year: 2026, month: 7, week: 3, value: 4.0, dailyValues: [4.1, 3.9, 4.0, 4.0, 4.1, null, null] },
  { id: "val-kt-2-w1", metricId: "met-kt-2", year: 2026, month: 7, week: 1, value: 96.5, dailyValues: [96, 97, 96, 98, 95, 97, 96] },
  { id: "val-kt-2-w2", metricId: "met-kt-2", year: 2026, month: 7, week: 2, value: 94.8, dailyValues: [94, 95, 93, 96, 95, 96, 95] },
  { id: "val-kt-2-w3", metricId: "met-kt-2", year: 2026, month: 7, week: 3, value: 96.0, dailyValues: [96, 97, 95, 96, 96, null, null] },
  { id: "val-kt-3-w1", metricId: "met-kt-3", year: 2026, month: 7, week: 1, value: 1 },
  { id: "val-kt-3-w2", metricId: "met-kt-3", year: 2026, month: 7, week: 2, value: 1 },
  { id: "val-kt-3-w3", metricId: "met-kt-3", year: 2026, month: 7, week: 3, value: 1 },

  // Service
  { id: "val-sv-1-w1", metricId: "met-sv-1", year: 2026, month: 7, week: 1, value: 96.0 },
  { id: "val-sv-1-w2", metricId: "met-sv-1", year: 2026, month: 7, week: 2, value: 97.2 },
  { id: "val-sv-1-w3", metricId: "met-sv-1", year: 2026, month: 7, week: 3, value: 95.8 },
  { id: "val-sv-2-w1", metricId: "met-sv-2", year: 2026, month: 7, week: 1, value: 92.0 },
  { id: "val-sv-2-w2", metricId: "met-sv-2", year: 2026, month: 7, week: 2, value: 89.5 },
  { id: "val-sv-2-w3", metricId: "met-sv-2", year: 2026, month: 7, week: 3, value: 91.0 },
  { id: "val-sv-3-w1", metricId: "met-sv-3", year: 2026, month: 7, week: 1, value: 3 },
  { id: "val-sv-3-w2", metricId: "met-sv-3", year: 2026, month: 7, week: 2, value: 3 },
  { id: "val-sv-3-w3", metricId: "met-sv-3", year: 2026, month: 7, week: 3, value: 2 },

  // Finance
  { id: "val-fn-1-w1", metricId: "met-fn-1", year: 2026, month: 7, week: 1, value: 100.0 },
  { id: "val-fn-1-w2", metricId: "met-fn-1", year: 2026, month: 7, week: 2, value: 100.0 },
  { id: "val-fn-1-w3", metricId: "met-fn-1", year: 2026, month: 7, week: 3, value: 100.0 },
  { id: "val-fn-2-w1", metricId: "met-fn-2", year: 2026, month: 7, week: 1, value: 96.0 },
  { id: "val-fn-2-w2", metricId: "met-fn-2", year: 2026, month: 7, week: 2, value: 94.0 },
  { id: "val-fn-2-w3", metricId: "met-fn-2", year: 2026, month: 7, week: 3, value: 97.0 },
  { id: "val-fn-3-w1", metricId: "met-fn-3", year: 2026, month: 7, week: 1, value: 1 },
  { id: "val-fn-3-w2", metricId: "met-fn-3", year: 2026, month: 7, week: 2, value: 1 },
  { id: "val-fn-3-w3", metricId: "met-fn-3", year: 2026, month: 7, week: 3, value: 1 },

  // Marketing (Off Track)
  { id: "val-mk-1-w1", metricId: "met-mk-1", year: 2026, month: 7, week: 1, value: 14 },
  { id: "val-mk-1-w2", metricId: "met-mk-1", year: 2026, month: 7, week: 2, value: 12 },
  { id: "val-mk-1-w3", metricId: "met-mk-1", year: 2026, month: 7, week: 3, value: 10 },
  { id: "val-mk-2-w1", metricId: "met-mk-2", year: 2026, month: 7, week: 1, value: 15.0 },
  { id: "val-mk-2-w2", metricId: "met-mk-2", year: 2026, month: 7, week: 2, value: 13.5 },
  { id: "val-mk-2-w3", metricId: "met-mk-2", year: 2026, month: 7, week: 3, value: 12.0 },
  { id: "val-mk-3-w1", metricId: "met-mk-3", year: 2026, month: 7, week: 1, value: 85 },
  { id: "val-mk-3-w2", metricId: "met-mk-3", year: 2026, month: 7, week: 2, value: 82 },
  { id: "val-mk-3-w3", metricId: "met-mk-3", year: 2026, month: 7, week: 3, value: 68 }
];

export const INITIAL_TODOS: Todo[] = [
  {
    id: "todo-it-1",
    departmentId: "dept-it",
    title: "Konfigurasi SSL Wildcard & DNS Failover Cloud",
    description: "Memastikan sertifikat TLS terbarukan otomatis dan endpoint failover siap jika server utama down.",
    priority: "high",
    deadline: "2026-07-25",
    status: "completed",
    createdBy: "Devin Satria"
  },
  {
    id: "todo-kt-1",
    departmentId: "dept-kitchen",
    title: "Uji Coba Resep Saus Rendang Formula Kemasan Pouch",
    description: "Memastikan umur simpan saus mencapai minimal 6 bulan tanpa bahan pengawet berbahaya.",
    priority: "medium",
    deadline: "2026-07-24",
    status: "in_progress",
    createdBy: "Chef Budi Santoso"
  },
  {
    id: "todo-mk-1",
    departmentId: "dept-marketing",
    title: "Rapat Khusus Evaluasi Penurunan Leads B2B (Terkait Rock Off Track)",
    description: "Meninjau landing page penawaran katering dan targeting iklan Meta/LinkedIn yang meleset dari KPI.",
    priority: "high",
    deadline: "2026-07-22",
    status: "pending",
    createdBy: "Dewi Lestari"
  },
  {
    id: "todo-fn-1",
    departmentId: "dept-finance",
    title: "Kirim Surat Konfirmasi Piutang ke Klien Korporat Area Sudirman",
    description: "Pengecekan termin invoice tempo 30 hari yang jatuh tempo minggu ini.",
    priority: "medium",
    deadline: "2026-07-26",
    status: "in_progress",
    createdBy: "Sarah Novita"
  },
  {
    id: "todo-sv-1",
    departmentId: "dept-service",
    title: "Pembaruan Form Checklist Grooming & Seragam Staf Outlet",
    description: "Memastikan atribut name tag dan standar kebersihan seragam dipatuhi sebelum jam buka outlet.",
    priority: "low",
    deadline: "2026-07-23",
    status: "completed",
    createdBy: "Rian Pratama"
  }
];

export const INITIAL_ISSUES: Issue[] = [
  {
    id: "iss-mk-1",
    departmentId: "dept-marketing",
    title: "Tingkat Konversi Leads B2B Q3 Turun Drastis di Bawah 15%",
    description: "Penyebab utama Rock Kampanye Katering Off Track. Tim sales kesulitan follow up karena materi presentasi belum diperbarui dengan katalog harga terkini.",
    priority: "critical",
    status: "open",
    picId: "prof-pic-marketing",
    picName: "Dewi Lestari",
    createdAt: "2026-07-18 09:30"
  },
  {
    id: "iss-kt-1",
    departmentId: "dept-kitchen",
    title: "Kenaikan Harga Minyak Goreng Curah 12% dari Supplier Utama",
    description: "Berpotensi menekan margin kotor produk olahan gorengan. Perlu negosiasi kontrak harga tetap atau cari supplier alternatif.",
    priority: "high",
    status: "in_progress",
    picId: "prof-pic-kitchen",
    picName: "Chef Budi Santoso",
    createdAt: "2026-07-17 14:15"
  },
  {
    id: "iss-it-1",
    departmentId: "dept-it",
    title: "Printer Thermal Kasir Stasiun 2 Sering Putus Koneksi LAN",
    description: "Mengakibatkan antrean pesanan tersendat saat peak hour makan siang. Kabel LAN perlu diganti kabel shielded CAT6.",
    priority: "medium",
    status: "solved",
    picId: "prof-pic-it",
    picName: "Devin Satria",
    createdAt: "2026-07-16 11:00"
  },
  {
    id: "iss-fn-1",
    departmentId: "dept-finance",
    title: "Keterlambatan Pengiriman Bukti Potong PPh 23 dari Mitra Platform",
    description: "Menghambat penyusunan SPT Masa. Tim finance sudah mengirimkan surat teguran resmi ke bagian akunting mitra.",
    priority: "medium",
    status: "in_progress",
    picId: "prof-pic-finance",
    picName: "Sarah Novita",
    createdAt: "2026-07-15 16:45"
  }
];

export const INITIAL_HEADLINES: Headline[] = [
  {
    id: "head-1",
    departmentId: "dept-marketing",
    title: "Penandatanganan MoU Katering Makan Siang dengan PT Bank Mandiri Cabang Medan",
    content: "Mulai 1 Agustus 2026, PT Garciafood Nusantara Gemilang resmi menjadi penyedia paket makan siang harian 120 pax untuk kantor regional.",
    category: "achievement",
    authorId: "prof-pic-marketing",
    authorName: "Dewi Lestari",
    createdAt: "2026-07-18 10:00"
  },
  {
    id: "head-2",
    departmentId: "dept-it",
    title: "Jadwal Pemeliharaan Server Cloud & Update Keamanan Aplikasi",
    content: "Maintenance sistem berkala akan dilaksanakan pada Sabtu malam pukul 23.00 - 01.00 WIB. Seluruh endpoint API akan dialihkan ke mode standby.",
    category: "announcement",
    authorId: "prof-pic-it",
    authorName: "Devin Satria",
    createdAt: "2026-07-17 15:30"
  },
  {
    id: "head-3",
    departmentId: "dept-kitchen",
    title: "Implementasi SOP Kebersihan Chiller & Penyimpanan Daging Beku",
    content: "Mengingatkan seluruh kru dapur untuk selalu mencatat suhu chiller pada lembar logbook harian pagi dan sore tanpa terkecuali.",
    category: "reminder",
    authorId: "prof-pic-kitchen",
    authorName: "Chef Budi Santoso",
    createdAt: "2026-07-16 08:45"
  },
  {
    id: "head-4",
    departmentId: "dept-service",
    title: "Apresiasi Bintang 5 dari Klien Resepsi Pernikahan Akhir Pekan",
    content: "Keluarga Bapak Hendra memberikan ulasan istimewa atas kesigapan kru pelayanan dan kerapian susunan buffet.",
    category: "good_news",
    authorId: "prof-pic-service",
    authorName: "Rian Pratama",
    createdAt: "2026-07-15 13:20"
  }
];
