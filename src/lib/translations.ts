export type Language = "id" | "en";

export const translations = {
  id: {
    // Navigation & General
    dashboard: "Dashboard",
    scoreboard: "Scoreboard KPI",
    todos: "Agenda Kerja",
    issues: "Masalah Operasional",
    headlines: "Berita & Headlines",
    history: "Riwayat Aktivitas",
    archives: "Arsip Sistem",
    settings: "Pengaturan",
    logout: "Keluar",
    
    // Statuses
    active: "Aktif",
    running: "Berjalan",
    achieved: "Tercapai",
    failed: "Gagal",
    completed: "Selesai",
    pending: "Pending",
    open: "Open",
    closed: "Closed",
    solved: "Solved",
    
    // Scoreboard
    monthlyKpi: "Bulanan (Routine KPI)",
    dailySpecialKpi: "Harian / Khusus (Ad-Hoc)",
    higherIsBetter: "Makin Tinggi ↑",
    lowerIsBetter: "Makin Rendah ↓",
    target: "Target",
    metric: "Metrik",
    action: "Aksi",
    status: "Status",
    addMetric: "Tambah Metrik Baru",
    editMetric: "Edit Metrik",
    
    // Actions & Tools
    convert: "Convert",
    archive: "Arsipkan",
    unarchive: "Pulihkan",
    downloadExcel: "Download Laporan Excel",
    edit: "Edit",
    delete: "Hapus",
    save: "Simpan",
    cancel: "Batal",
    compactMode: "Mode Compact (Rapat)",
    spaciousMode: "Mode Spacious (Lega)",
    readerTheme: "Tema Tampilan Data"
  },
  en: {
    // Navigation & General
    dashboard: "Dashboard",
    scoreboard: "KPI Scoreboard",
    todos: "To-do List",
    issues: "Operational Issues",
    headlines: "News & Headlines",
    history: "Audit Logs",
    archives: "System Archives",
    settings: "Settings",
    logout: "Sign Out",
    
    // Statuses
    active: "Active",
    running: "Running",
    achieved: "Achieved",
    failed: "Failed",
    completed: "Completed",
    pending: "Pending",
    open: "Open",
    closed: "Closed",
    solved: "Solved",
    
    // Scoreboard
    monthlyKpi: "Monthly (Routine KPI)",
    dailySpecialKpi: "Daily / Special (Ad-Hoc)",
    higherIsBetter: "Higher is Better ↑",
    lowerIsBetter: "Lower is Better ↓",
    target: "Target",
    metric: "Metric",
    action: "Action",
    status: "Status",
    addMetric: "Add New Metric",
    editMetric: "Edit Metric",
    
    // Actions & Tools
    convert: "Convert",
    archive: "Archive",
    unarchive: "Restore",
    downloadExcel: "Export Excel Report",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    compactMode: "Compact UI Mode",
    spaciousMode: "Spacious UI Mode",
    readerTheme: "Data Reader Theme"
  }
};

export const t = (key: keyof typeof translations.id, lang: Language = "id"): string => {
  return translations[lang]?.[key] || translations.id[key] || key;
};
