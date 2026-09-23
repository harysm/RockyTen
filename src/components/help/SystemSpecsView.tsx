"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  Table2,
  Milestone,
  AlertCircle,
  CheckSquare,
  RefreshCw,
  Cpu,
  Users,
  Command,
  ChevronRight,
  Database,
  Zap,
  ArrowRight,
  Search,
  HelpCircle,
  Lightbulb
} from "lucide-react";

interface SystemSpecsViewProps {
  isId: boolean;
  searchQuery: string;
}

interface SystemSection {
  id: string;
  titleId: string;
  titleEn: string;
  category: "all" | "concept" | "architecture" | "specs";
  icon: React.ReactNode;
  summaryId: string;
  summaryEn: string;
}

export function SystemSpecsView({ isId, searchQuery }: SystemSpecsViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSectionId, setActiveSectionId] = useState<string>("overview");

  const systemSections: SystemSection[] = [
    {
      id: "overview",
      titleId: "1. Filosofi Platform & Traction EOS",
      titleEn: "1. Platform Philosophy & Traction EOS",
      category: "concept",
      icon: <Compass className="w-4 h-4 text-blue-500" />,
      summaryId: "Prinsip Traction EOS, irama kerja tim, dan ekosistem RockyTen",
      summaryEn: "Traction EOS principles, operational rhythm, and RockyTen ecosystem"
    },
    {
      id: "scoreboard",
      titleId: "2. Mesin Kalkulasi Scoreboard (SUM/AVG)",
      titleEn: "2. Scoreboard KPI & Calculation Engine",
      category: "concept",
      icon: <Table2 className="w-4 h-4 text-emerald-500" />,
      summaryId: "Siklus metrik bulanan/khusus, akumulasi SUM/AVG, dan pengisian W1–W4",
      summaryEn: "Monthly/special cycles, SUM/AVG accumulation, and W1–W4 tracking"
    },
    {
      id: "rocks",
      titleId: "3. Logika Radar Otomatis Rocks",
      titleEn: "3. Rocks Health Radar Algorithm",
      category: "concept",
      icon: <Milestone className="w-4 h-4 text-amber-500" />,
      summaryId: "Radar deteksi otomatis kesehatan status dan verifikasi direksi",
      summaryEn: "Automatic health radar status detection and leadership verification"
    },
    {
      id: "issues",
      titleId: "4. Spesifikasi Framework IDS",
      titleEn: "4. IDS Framework Specification",
      category: "concept",
      icon: <AlertCircle className="w-4 h-4 text-rose-500" />,
      summaryId: "Metodologi Identify, Discuss, Solve dan skala prioritas kendala",
      summaryEn: "Identify, Discuss, Solve methodology and issue priority triage"
    },
    {
      id: "todos-headlines",
      titleId: "5. Standar Format To-Do & Headlines",
      titleEn: "5. To-Do & Headline Specifications",
      category: "concept",
      icon: <CheckSquare className="w-4 h-4 text-indigo-500" />,
      summaryId: "Tindakan eksekusi tugas, berkas lampiran, dan siaran pengumuman",
      summaryEn: "Actionable tasks, file attachments, and broadcast announcements"
    },
    {
      id: "conversion",
      titleId: "6. Alur Transformasi Data (Universal Convert)",
      titleEn: "6. Universal Cross-Module Conversion",
      category: "architecture",
      icon: <RefreshCw className="w-4 h-4 text-cyan-500" />,
      summaryId: "Mekanisme pengalihan item tanpa kehilangan konteks data",
      summaryEn: "Transforming operational items without data loss"
    },
    {
      id: "accounts",
      titleId: "7. Hierarki Akun & Simulator Pengguna",
      titleEn: "7. Account Hierarchy & Role Simulator",
      category: "specs",
      icon: <Users className="w-4 h-4 text-purple-500" />,
      summaryId: "Matriks kewenangan akses dan daftar akun master simulator",
      summaryEn: "Access matrix and master simulator credentials"
    },
    {
      id: "architecture",
      titleId: "8. Spesifikasi Teknis & Skema Database",
      titleEn: "8. Technical Specs & Database Schema",
      category: "specs",
      icon: <Cpu className="w-4 h-4 text-sky-500" />,
      summaryId: "Stack teknologi, arsitektur Local-First, dan database Supabase",
      summaryEn: "Tech stack, Local-First engine, and Supabase database"
    },
    {
      id: "shortcuts",
      titleId: "9. Pintasan Keyboard & Tips Sistem",
      titleEn: "9. Keyboard Shortcuts & Pro Tips",
      category: "specs",
      icon: <Command className="w-4 h-4 text-fuchsia-500" />,
      summaryId: "Pintasan tombol keyboard untuk efisiensi navigasi operasional",
      summaryEn: "Keyboard navigation shortcuts and system power tips"
    }
  ];

  const filteredSections = systemSections.filter((sec) => {
    const matchesCategory = activeCategory === "all" || sec.category === activeCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      sec.titleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.summaryId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.summaryEn.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const visibleSectionIds = new Set(filteredSections.map((s) => s.id));

  // Sync active section if filtered out
  useEffect(() => {
    if (filteredSections.length > 0 && !filteredSections.some((s) => s.id === activeSectionId)) {
      setActiveSectionId(filteredSections[0].id);
    }
  }, [filteredSections, activeSectionId]);

  // Scrollspy tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (let i = filteredSections.length - 1; i >= 0; i--) {
        const sec = filteredSections[i];
        const el = document.getElementById(sec.id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSectionId(sec.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [filteredSections]);

  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: "all", labelId: "Semua Spesifikasi", labelEn: "All Specs" },
          { id: "concept", labelId: "Logika & Konsep", labelEn: "Logic & Concepts" },
          { id: "architecture", labelId: "Arsitektur Data", labelEn: "Data Architecture" },
          { id: "specs", labelId: "Database & Akun", labelEn: "Database & Accounts" }
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === cat.id
                ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-sm ring-1 ring-zinc-900/10 dark:ring-white/20"
                : "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:bg-slate-200 dark:hover:bg-zinc-700 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {isId ? cat.labelId : cat.labelEn}
          </button>
        ))}
      </div>

      {/* Main Grid Layout: Sidebar TOC (Left) + Content Canvas (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sticky TOC Sidebar */}
        <aside className="lg:col-span-3 sticky top-20 space-y-4 z-20">
          <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 shadow-xs">
            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500 border-b border-slate-100 dark:border-zinc-800/80 mb-2 flex items-center justify-between">
              <span>{isId ? "Daftar Spesifikasi" : "Specs Index"}</span>
              <span className="font-bold text-blue-600 dark:text-blue-400">{filteredSections.length}</span>
            </div>

            <nav className="space-y-1">
              {filteredSections.map((sec) => {
                const isActive = activeSectionId === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors group cursor-pointer ${
                      isActive
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/60"
                        : "text-slate-600 dark:text-zinc-400 hover:bg-slate-50 dark:hover:bg-zinc-850 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate pr-2">
                      <span className="shrink-0">{sec.icon}</span>
                      <span className="truncate">{isId ? sec.titleId : sec.titleEn}</span>
                    </div>
                    <ChevronRight
                      className={`w-3.5 h-3.5 shrink-0 transition-colors ${
                        isActive
                          ? "text-blue-600 dark:text-blue-400 opacity-100"
                          : "text-slate-400 opacity-40 group-hover:opacity-100"
                      }`}
                    />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Quick Help Card */}
          <div className="rounded-2xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-950/20 p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-amber-800 dark:text-amber-300">
              <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{isId ? "Butuh Bantuan Teknis?" : "Need Technical Help?"}</span>
            </div>
            <p className="text-[11px] text-amber-900/80 dark:text-amber-400/80 leading-relaxed">
              {isId
                ? "Untuk penambahan akun baru, migrasi Supabase Cloud, atau pelaporan kendala arsitektur, hubungi PIC IT atau login sebagai Developer."
                : "For new user onboarding, Supabase migration, or architecture feedback, reach out to IT PIC or login as Developer."}
            </p>
          </div>
        </aside>

        {/* Center / Main Reading Canvas */}
        <main className="lg:col-span-9 space-y-8">
          {/* Empty State */}
          {filteredSections.length === 0 && (
            <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isId ? "Spesifikasi Tidak Ditemukan" : "Specification Not Found"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
                  {isId
                    ? "Coba gunakan kata kunci pencarian yang lebih umum atau pilih Semua Spesifikasi."
                    : "Try a broader keyword or switch to All Specs filter."}
                </p>
              </div>
            </div>
          )}

          {/* Section 1: Overview */}
          {visibleSectionIds.has("overview") && (
            <section id="overview" className="scroll-mt-24 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/60 flex items-center justify-center shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    1. {isId ? "Ringkasan & Filosofi Platform" : "Overview & Platform Philosophy"}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    {isId ? "Fondasi sistem operasional terintegrasi Nasi Gerilya" : "Operational foundation for Nasi Gerilya"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-normal">
                <p>
                  <strong>RockyTen</strong> adalah platform manajemen operasional berbasis kerangka kerja <em>Traction EOS (Entrepreneurial Operating System)</em> yang dirancang khusus untuk memonitor kesehatan bisnis, menyelaraskan prioritas kuartalan, dan menuntaskan kendala harian gerai <strong>Nasi Gerilya</strong> secara terukur.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">Prinsip 1</span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">Transparansi Angka Riil</h4>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">Setiap divisi memiliki metrik Scoreboard objektif tanpa asumsi subjektif.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400">Prinsip 2</span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">Fokus 90 Hari (Rocks)</h4>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">Mempersempit sasaran kuartalan agar energi tim tidak terpecah ke terlalu banyak hal.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400">Prinsip 3</span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">Eksekusi Cepat (IDS)</h4>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">Mengidentifikasi akar masalah dan menyelesaikannya jadi komitmen tugas 7 hari.</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Section 2: Scoreboard KPI */}
          {visibleSectionIds.has("scoreboard") && (
            <section id="scoreboard" className="scroll-mt-24 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/60 flex items-center justify-center shrink-0">
                  <Table2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    2. {isId ? "Scoreboard KPI & Logika Kalkulasi" : "Scoreboard KPI & Calculation Engine"}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    {isId ? "Mekanisme pengisian data mingguan, akumulasi harian, dan evaluasi target" : "Weekly data tracking, daily aggregation, and target evaluation"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-normal">
                <p>
                  Scoreboard adalah denyut nadi operasional mingguan. Setiap metrik dikelola oleh satu <strong>PIC (Person In Charge)</strong> dan dipantau selama 4 pekan (W1 s/d W4) dalam satu bulan.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Akumulasi Harian ke Mingguan</span>
                    <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-zinc-400">
                      <li><strong>Total Penjumlahan (SUM)</strong>: Cocok untuk metrik kumulatif seperti omset penjualan, porsi terjual, atau total jam lembur.</li>
                      <li><strong>Rata-Rata (AVG)</strong>: Cocok untuk metrik kualitas seperti rating kepuasan pelanggan, food waste %, atau waktu tunggu saji.</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400">Tipe Siklus Metrik</span>
                    <ul className="space-y-1.5 text-[11px] text-slate-600 dark:text-zinc-400">
                      <li><strong>Siklus Bulanan Standar</strong>: Berjalan otomatis mengikuti bulan aktif (W1–W4) dan direset setiap awal bulan.</li>
                      <li><strong>Siklus Khusus / Ad-Hoc</strong>: Metrik proyek atau kampanye dengan durasi hari fleksibel dan tenggat waktu pasti.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Section 3: Rocks */}
          {visibleSectionIds.has("rocks") && (
            <section id="rocks" className="scroll-mt-24 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/60 flex items-center justify-center shrink-0">
                  <Milestone className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    3. {isId ? "Logika Radar Otomatis Status Rocks" : "Rocks Automatic Health Radar Algorithm"}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    {isId ? "Deteksi dini kesehatan sasaran kuartalan dan hak verifikasi direksi" : "Automatic 90-day goal status radar and executive sign-off"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-normal">
                <p>
                  Modul <strong>Rocks</strong> mengeliminasi dropdown manual yang rawan bias dengan <strong>Radar Kesehatan Otomatis</strong>:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-1">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xs">🟢 On Track</span>
                    <p className="text-[11px] text-slate-600 dark:text-zinc-400">Laju pencapaian seimbang dengan sisa waktu kuartal berjalan.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 space-y-1">
                    <span className="font-bold text-amber-700 dark:text-amber-400 text-xs">🟡 Siap Review (100%)</span>
                    <p className="text-[11px] text-slate-600 dark:text-zinc-400">Progres telah tuntas 100%, sistem mengunci dan menunggu verifikasi atasan.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 space-y-1">
                    <span className="font-bold text-rose-700 dark:text-rose-400 text-xs">🔴 Off Track (Peringatan Dini)</span>
                    <p className="text-[11px] text-slate-600 dark:text-zinc-400">Sisa waktu $\le 14$ hari namun progres masih di bawah 50%.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20 space-y-1">
                    <span className="font-bold text-blue-700 dark:text-blue-400 text-xs">🔵 Selesai (Terverifikasi)</span>
                    <p className="text-[11px] text-slate-600 dark:text-zinc-400">Telah ditinjau dan diverifikasi resmi oleh Owner/Direksi pada rapat L10.</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Section 4: Issues */}
          {visibleSectionIds.has("issues") && (
            <section id="issues" className="scroll-mt-24 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/60 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    4. {isId ? "Spesifikasi Framework IDS Masalah" : "IDS Framework Specification"}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    {isId ? "Metodologi penuntasan kendala operasional (Identify, Discuss, Solve)" : "Operational obstacle resolution methodology"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-normal">
                <p>
                  Modul <strong>Issues</strong> mengadopsi kerangka kerja IDS:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 space-y-1">
                    <span className="w-6 h-6 rounded-lg bg-rose-600 text-white font-extrabold flex items-center justify-center text-xs">1</span>
                    <strong className="text-slate-900 dark:text-white text-xs block pt-1">Identify (Akar Masalah)</strong>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">Bedakan antara gejala (*symptom*) dan akar masalah sebenarnya (*root cause*).</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 space-y-1">
                    <span className="w-6 h-6 rounded-lg bg-amber-600 text-white font-extrabold flex items-center justify-center text-xs">2</span>
                    <strong className="text-slate-900 dark:text-white text-xs block pt-1">Discuss (Diskusi Ringkas)</strong>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">Setiap orang boleh berpendapat satu kali secara padat tanpa saling menyela.</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 space-y-1">
                    <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-extrabold flex items-center justify-center text-xs">3</span>
                    <strong className="text-slate-900 dark:text-white text-xs block pt-1">Solve (Action Item)</strong>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400">Wajib bermuara pada penugasan To-Do konkret dengan 1 PIC dan tenggat waktu 7 hari.</p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Section 5: Todos & Headlines */}
          {visibleSectionIds.has("todos-headlines") && (
            <section id="todos-headlines" className="scroll-mt-24 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-900/60 flex items-center justify-center shrink-0">
                  <CheckSquare className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    5. {isId ? "Standar Format To-Do & Headlines" : "To-Do & Headline Specifications"}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    {isId ? "Eksekusi komitmen tugas 7 hari dan siaran pengumuman penting" : "7-day commitment execution and cross-division announcements"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-normal">
                <p>
                  <strong>To-Do</strong> adalah komitmen eksekusi jangka pendek (7 hari) yang disepakati dalam rapat mingguan. To-Do mendukung lampiran berkas multi-format (gambar, PDF, dokumen hingga 5MB) serta tautan link web.
                </p>
                <p>
                  <strong>Headlines</strong> berfungsi sebagai papan pengumuman internal lintas divisi untuk merayakan prestasi (*Achievement*), membagikan kabar gembira (*Good News*), pengumuman resmi (*Announcement*), kendala (*Bad News*), maupun tenggat waktu (*Reminder*).
                </p>
              </div>
            </section>
          )}

          {/* Section 6: Universal Convert */}
          {visibleSectionIds.has("conversion") && (
            <section id="conversion" className="scroll-mt-24 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 border border-cyan-200/60 dark:border-cyan-900/60 flex items-center justify-center shrink-0">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    6. {isId ? "Alur Konversi Universal (Transformasi Data)" : "Universal Cross-Module Conversion"}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    {isId ? "Mekanisme pengalihan item tanpa kehilangan konteks data" : "Transforming operational items without data loss"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-normal">
                <p>
                  Setiap item di RockyTen (Scoreboard, Issue, Todo, Headline) dapat dikonversi ke modul lain secara instan dengan alur <strong>In-Place Sliding Dual-Card</strong>:
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white">
                    <Zap className="w-4 h-4 text-cyan-500" />
                    <span>{isId ? "Contoh Transformasi Operasional Nyata" : "Real Operational Transformation Examples"}</span>
                  </div>
                  <ul className="space-y-2 text-[11px] text-slate-600 dark:text-zinc-400">
                    <li>
                      <strong>Kendala Dapur $\rightarrow$ To-Do</strong>: Masalah <em>"Mesin chiller mati"</em> dikonversi jadi To-Do teknisi <em>"Panggil vendor service chiller"</em>.
                    </li>
                    <li>
                      <strong>Metrik Scoreboard Gagal $\rightarrow$ Issue</strong>: Capaian <em>"Food waste di atas target"</em> dikonversi menjadi Issue untuk dibedah pada rapat IDS.
                    </li>
                    <li>
                      <strong>Pencapaian Target $\rightarrow$ Headline</strong>: Penjualan rekor <em>"Omset cabang melampaui 120%"</em> dikonversi menjadi Headline kategori Achievement untuk apresiasi tim.
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          )}

          {/* Section 7: Account Hierarchy & Simulator */}
          {visibleSectionIds.has("accounts") && (
            <section id="accounts" className="scroll-mt-24 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-900/60 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    7. {isId ? "Hierarki Akun & Simulator Pengguna" : "Account Hierarchy & Role Simulator"}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    {isId ? "Matriks kewenangan akses dan daftar akun master simulator" : "Access matrix and master simulator credentials"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-normal">
                <p>
                  RockyTen menyediakan fitur <strong>Simulator Profil Cepat</strong> (di pojok kanan atas) untuk memungkinkan pengujian pengalaman pengguna dari berbagai perspektif peran tanpa perlu log out manual.
                </p>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-zinc-800 text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100/70 dark:bg-zinc-850 text-slate-700 dark:text-zinc-300 text-[11px] uppercase tracking-wider font-extrabold border-b border-slate-200 dark:border-zinc-800">
                        <th className="py-2.5 px-4">{isId ? "Peran" : "Role"}</th>
                        <th className="py-2.5 px-4">{isId ? "Nama Akun" : "Name"}</th>
                        <th className="py-2.5 px-4">Email Login</th>
                        <th className="py-2.5 px-4">Password</th>
                        <th className="py-2.5 px-4">{isId ? "Hak Akses" : "Access Rights"}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-[11px]">
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-850/30">
                        <td className="py-2.5 px-4 font-bold text-amber-600 dark:text-amber-400">Owner</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Richard</td>
                        <td className="py-2.5 px-4 font-mono text-slate-500">richard@gmail.com</td>
                        <td className="py-2.5 px-4 font-mono text-slate-400">owner123</td>
                        <td className="py-2.5 px-4">Global (Semua Divisi & Verifikasi Rocks)</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-850/30">
                        <td className="py-2.5 px-4 font-bold text-amber-600 dark:text-amber-400">Owner</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Kim</td>
                        <td className="py-2.5 px-4 font-mono text-slate-500">kim@gmail.com</td>
                        <td className="py-2.5 px-4 font-mono text-slate-400">owner123</td>
                        <td className="py-2.5 px-4">Global (Semua Divisi & Verifikasi Rocks)</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-850/30">
                        <td className="py-2.5 px-4 font-bold text-blue-600 dark:text-blue-400">Developer</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Developer</td>
                        <td className="py-2.5 px-4 font-mono text-slate-500">developer@nasigerilya.com</td>
                        <td className="py-2.5 px-4 font-mono text-slate-400">123456</td>
                        <td className="py-2.5 px-4">Global + Akses Fitur Debug & Reset</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-850/30">
                        <td className="py-2.5 px-4 font-bold text-slate-600 dark:text-zinc-400">PIC Divisi</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Harys (IT)</td>
                        <td className="py-2.5 px-4 font-mono text-slate-500">harys@nasigerilya.com</td>
                        <td className="py-2.5 px-4 font-mono text-slate-400">123456</td>
                        <td className="py-2.5 px-4">Divisi IT Saja</td>
                      </tr>
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-zinc-850/30">
                        <td className="py-2.5 px-4 font-bold text-slate-600 dark:text-zinc-400">PIC Divisi</td>
                        <td className="py-2.5 px-4 font-bold text-slate-900 dark:text-white">Kitchen Lead</td>
                        <td className="py-2.5 px-4 font-mono text-slate-500">kitchen@nasigerilya.com</td>
                        <td className="py-2.5 px-4 font-mono text-slate-400">123456</td>
                        <td className="py-2.5 px-4">Divisi Kitchen Saja</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Section 8: Technical Architecture & Specs */}
          {visibleSectionIds.has("architecture") && (
            <section id="architecture" className="scroll-mt-24 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 border border-sky-200/60 dark:border-sky-900/60 flex items-center justify-center shrink-0">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    8. {isId ? "Spesifikasi Teknis & Database" : "Technical Specs & Architecture"}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    {isId ? "Stack teknologi, penyimpanan Local-First, dan integrasi cloud" : "Technology stack, Local-First engine, and cloud database"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-normal">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Frontend Engine</span>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white">Next.js 16 (App Router) + React 19</p>
                      <p className="text-[11px] text-slate-500">Turbopack compiler, TailwindCSS modern design tokens (Tier 1-4), Lucide Outline Icons.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 space-y-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Database & Storage</span>
                    <div className="space-y-1">
                      <p className="font-bold text-slate-900 dark:text-white">Supabase PostgreSQL + LocalStorage Fallback</p>
                      <p className="text-[11px] text-slate-500">Local-First architecture, 100% resilient saat offline atau tanpa koneksi internet.</p>
                    </div>
                  </div>
                </div>

                {/* Database Schema Map */}
                <div className="p-4 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/50 space-y-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-blue-500" />
                    <span>Struktur Tabel Database Supabase</span>
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                    <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800">departments</div>
                    <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800">profiles</div>
                    <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800">metrics</div>
                    <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800">metric_values</div>
                    <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800">todos</div>
                    <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800">issues</div>
                    <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800">headlines</div>
                    <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800">history_logs</div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Section 9: Shortcuts & Productivity Tips */}
          {visibleSectionIds.has("shortcuts") && (
            <section id="shortcuts" className="scroll-mt-24 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-100 dark:border-zinc-800 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-fuchsia-50 dark:bg-fuchsia-950/50 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-200/60 dark:border-fuchsia-900/60 flex items-center justify-center shrink-0">
                  <Command className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                    9. {isId ? "Pintasan Keyboard & Tips Produktivitas" : "Keyboard Shortcuts & Pro Tips"}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    {isId ? "Akselerasi navigasi dan tips efisiensi kerja tim" : "Navigation shortcuts and team productivity tips"}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-normal">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-800 dark:text-zinc-200">{isId ? "Tutup Modal / Popup Terbuka" : "Close Open Modal / Dialog"}</span>
                    <kbd className="px-2 py-1 rounded bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-[10px] font-mono font-bold text-slate-600 dark:text-zinc-300 shadow-2xs">ESC</kbd>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-800 dark:text-zinc-200">{isId ? "Buka / Tutup Sidebar Mobile" : "Toggle Mobile Menu"}</span>
                    <kbd className="px-2 py-1 rounded bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-[10px] font-mono font-bold text-slate-600 dark:text-zinc-300 shadow-2xs">Tap Hamburger</kbd>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-800 dark:text-zinc-200">{isId ? "Ganti Bahasa (ID / EN)" : "Toggle Language"}</span>
                    <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">Header TopBar</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-800 dark:text-zinc-200">{isId ? "Mode Gelap / Terang" : "Theme Switcher"}</span>
                    <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">Header TopBar</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Bottom Navigation Quick Links */}
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {isId ? "Siap Melanjutkan Operasional?" : "Ready to Continue Operations?"}
              </span>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                {isId ? "Kembali ke Scoreboard KPI atau tinjau pengaturan sistem." : "Return to Scoreboard KPI or check settings."}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/settings"
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-200 text-xs font-bold hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors shadow-2xs"
              >
                {isId ? "Buka Pengaturan" : "Open Settings"}
              </Link>
              <Link
                href="/scoreboard"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5"
              >
                <span>{isId ? "Buka Scoreboard" : "Open Scoreboard"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
