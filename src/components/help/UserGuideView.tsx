"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  Table2,
  Milestone,
  AlertCircle,
  CheckSquare,
  Megaphone,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Check,
  Zap,
  Clock,
  PlayCircle,
  HelpCircle,
  FileText,
  Upload,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Building2,
  Calendar,
  CheckCircle2,
  RefreshCw,
  Eye,
  Camera,
  Layers
} from "lucide-react";

interface UserGuideViewProps {
  isId: boolean;
  searchQuery: string;
}

interface GuideSection {
  id: string;
  titleId: string;
  titleEn: string;
  category: "all" | "workflow" | "module";
  icon: React.ReactNode;
  summaryId: string;
  summaryEn: string;
}

export function UserGuideView({ isId, searchQuery }: UserGuideViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSectionId, setActiveSectionId] = useState<string>("l10-routine");

  const guideSections: GuideSection[] = [
    {
      id: "l10-routine",
      titleId: "Alur Rapat Mingguan (SOP Rapat L10)",
      titleEn: "Weekly Meeting Workflow (L10 SOP)",
      category: "workflow",
      icon: <PlayCircle className="w-4 h-4 text-blue-500" />,
      summaryId: "Urutan 5 langkah rapat mingguan tim: Scoreboard, Rocks, Warta, Tugas, dan IDS",
      summaryEn: "5-step weekly meeting flow: Scoreboard, Rocks, Headlines, To-Dos, and IDS"
    },
    {
      id: "guide-scoreboard",
      titleId: "Scoreboard KPI (Cara Input & Evaluasi)",
      titleEn: "Scoreboard KPI (Data Input & Review)",
      category: "module",
      icon: <Table2 className="w-4 h-4 text-emerald-500" />,
      summaryId: "Panduan input angka harian/mingguan W1–W4, membaca status, dan konversi ke Issue",
      summaryEn: "How to input weekly W1–W4 values, read metric health, and convert failing metrics"
    },
    {
      id: "guide-rocks",
      titleId: "Batu Sasaran / Rocks (Prioritas 90 Hari)",
      titleEn: "Rocks (90-Day Strategic Priorities)",
      category: "module",
      icon: <Milestone className="w-4 h-4 text-amber-500" />,
      summaryId: "Membuat sasaran kuartalan, memantau radar otomatis, dan verifikasi selesai direksi",
      summaryEn: "Setting quarterly goals, monitoring automatic radar health, and executive verification"
    },
    {
      id: "guide-issues",
      titleId: "Pusat Kendala (Lapor Masalah & IDS)",
      titleEn: "Issue Tracker (Reporting & IDS Solving)",
      category: "module",
      icon: <AlertCircle className="w-4 h-4 text-rose-500" />,
      summaryId: "Melaporkan masalah dapur/lapangan, melampirkan foto bukti, dan alur bedah IDS",
      summaryEn: "Reporting operational issues, attaching photo evidence, and IDS solving flow"
    },
    {
      id: "guide-todos",
      titleId: "Agenda Tugas 7 Hari (To-Do List)",
      titleEn: "Actionable To-Do List (7-Day Tasks)",
      category: "module",
      icon: <CheckSquare className="w-4 h-4 text-indigo-500" />,
      summaryId: "Menetapkan komitmen tugas jangka pendek dengan 1 PIC dan tenggat waktu pasti",
      summaryEn: "Assigning 7-day commitments with 1 clear PIC and hard deadlines"
    },
    {
      id: "guide-headlines",
      titleId: "Warta & Pengumuman (Headlines)",
      titleEn: "Team Headlines & Announcements",
      category: "module",
      icon: <Megaphone className="w-4 h-4 text-cyan-500" />,
      summaryId: "Menyiarkan prestasi tim, pengumuman resmi, kabar gembira, dan pengingat",
      summaryEn: "Broadcasting achievements, official company news, good news, and reminders"
    }
  ];

  const filteredSections = guideSections.filter((sec) => {
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
          { id: "all", labelId: "Semua Panduan", labelEn: "All Guides" },
          { id: "workflow", labelId: "Alur Rapat L10", labelEn: "L10 Routine" },
          { id: "module", labelId: "Cara Pakai Per Halaman", labelEn: "Page-by-Page Guides" }
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeCategory === cat.id
                ? "bg-blue-600 text-white shadow-sm ring-1 ring-blue-600/20"
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
              <span>{isId ? "Daftar Panduan SOP" : "SOP Table of Contents"}</span>
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

          {/* Practical Tip Card */}
          <div className="rounded-2xl border border-blue-200/80 dark:border-blue-900/50 bg-blue-50/60 dark:bg-blue-950/20 p-4 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-blue-900 dark:text-blue-300">
              <Lightbulb className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>{isId ? "Tips Irama Rapat L10" : "L10 Meeting Best Practice"}</span>
            </div>
            <p className="text-[11px] text-blue-900/80 dark:text-blue-400/80 leading-relaxed">
              {isId
                ? "Rapat mingguan efektif berdurasi 90 menit. 60 menit porsi terbesar dialokasikan murni untuk memecahkan kendala pada sesi IDS."
                : "A high-performing weekly meeting lasts 90 minutes, with the majority (60 mins) dedicated to IDS problem solving."}
            </p>
          </div>
        </aside>

        {/* Center / Main Reading Canvas */}
        <main className="lg:col-span-9 space-y-8">
          {/* Empty State */}
          {filteredSections.length === 0 && (
            <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-400 flex items-center justify-center mx-auto">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isId ? "Panduan Tidak Ditemukan" : "Guide Not Found"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
                  {isId
                    ? "Coba gunakan kata kunci pencarian yang lebih umum atau pilih filter Semua Panduan."
                    : "Try a broader keyword or switch to All Guides filter."}
                </p>
              </div>
            </div>
          )}

          {/* Section 1: Alur Rapat Mingguan (SOP L10 Routine) */}
          {visibleSectionIds.has("l10-routine") && (
            <section
              id="l10-routine"
              className="scroll-mt-24 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xs space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/60 flex items-center justify-center shrink-0">
                    <PlayCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      {isId ? "STANDAR OPERASIONAL PROSEDUR" : "STANDARD OPERATING PROCEDURE"}
                    </span>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      {isId ? "Alur Rapat Mingguan (The EOS L10 Workflow)" : "Weekly L10 Meeting Routine"}
                    </h2>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-zinc-800 text-[11px] font-bold text-slate-600 dark:text-zinc-300 shrink-0 self-start sm:self-auto">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  <span>{isId ? "Durasi Ideal: 90 Menit" : "Ideal Duration: 90 Mins"}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                {isId
                  ? "Rapat mingguan (Level 10 Meeting) wajib dimulai tepat waktu setiap minggu. Buka platform RockyTen sebagai layar proyektor utama dan ikuti 5 tahap berurutan berikut tanpa berdebat panjang di awal:"
                  : "The weekly Level 10 Meeting begins on time every week using RockyTen as the central dashboard. Follow these 5 consecutive steps:"}
              </p>

              {/* 5-Step Pipeline Card Visual */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {[
                  {
                    step: "1",
                    titleId: "Scoreboard KPI",
                    titleEn: "Scoreboard KPI",
                    timeId: "5 Menit",
                    timeEn: "5 Mins",
                    descId: "Input capaian W1-W4. Jika angka merah, lempar langsung ke Issue.",
                    descEn: "Input weekly numbers. If red, throw directly to Issue.",
                    color: "border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300",
                    badge: "bg-emerald-600 text-white"
                  },
                  {
                    step: "2",
                    titleId: "Review Rocks",
                    titleEn: "Rocks Review",
                    timeId: "5 Menit",
                    timeEn: "5 Mins",
                    descId: "Cek progres 90 hari. Status On Track atau Off Track. Jangan diskusikan solusi di sini.",
                    descEn: "Check 90-day progress. On track or off track. Avoid solutions here.",
                    color: "border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300",
                    badge: "bg-amber-600 text-white"
                  },
                  {
                    step: "3",
                    titleId: "Warta Headlines",
                    titleEn: "Headlines News",
                    timeId: "5 Menit",
                    timeEn: "5 Mins",
                    descId: "Bagi kabar baik, prestasi cabang, pengumuman resmi divisi.",
                    descEn: "Share team wins, customer feedback, and company news.",
                    color: "border-cyan-200 dark:border-cyan-900/50 bg-cyan-50/40 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-300",
                    badge: "bg-cyan-600 text-white"
                  },
                  {
                    step: "4",
                    titleId: "Daftar To-Do",
                    titleEn: "To-Do List",
                    timeId: "5 Menit",
                    timeEn: "5 Mins",
                    descId: "Tandai tugas yang selesai dalam 7 hari lalu. Target kepatuhan > 90%.",
                    descEn: "Check off 7-day completed tasks. Goal is > 90% completion rate.",
                    color: "border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/40 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300",
                    badge: "bg-indigo-600 text-white"
                  },
                  {
                    step: "5",
                    titleId: "Sesi IDS",
                    titleEn: "IDS Solving",
                    timeId: "60 Menit",
                    timeEn: "60 Mins",
                    descId: "Pilih 3 issue paling kritis. Bedah akar masalah, putuskan jadi To-Do minggu depan.",
                    descEn: "Pick top 3 issues. Identify root cause, discuss, solve into To-Dos.",
                    color: "border-rose-200 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300",
                    badge: "bg-rose-600 text-white"
                  }
                ].map((item) => (
                  <div
                    key={item.step}
                    className={`p-3.5 rounded-2xl border ${item.color} space-y-2 flex flex-col justify-between`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`w-5 h-5 rounded-md ${item.badge} text-[11px] font-black flex items-center justify-center`}>
                          {item.step}
                        </span>
                        <span className="text-[10px] font-bold opacity-80">{isId ? item.timeId : item.timeEn}</span>
                      </div>
                      <h4 className="font-extrabold text-xs text-slate-900 dark:text-white pt-1">
                        {isId ? item.titleId : item.titleEn}
                      </h4>
                      <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-snug">
                        {isId ? item.descId : item.descEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Golden Rule Callout */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
                  <strong>{isId ? "Aturan Emas Rapat L10" : "L10 Golden Rule"}:</strong>{" "}
                  {isId
                    ? "Dilarang memperdebatkan solusi masalah saat sedang membaca Scoreboard, Rocks, atau Headlines! Catat langsung kendala tersebut ke menu Masalah (Issues), lalu bahas secara tuntas pada Sesi IDS (Tahap 5)."
                    : "Do not debate solutions during Scoreboard or Rocks review! Log the issue into the Issue Tracker, and resolve it during the 60-minute IDS session."}
                </div>
              </div>
            </section>
          )}

          {/* Section 2: Panduan Scoreboard KPI */}
          {visibleSectionIds.has("guide-scoreboard") && (
            <section
              id="guide-scoreboard"
              className="scroll-mt-24 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xs space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/60 flex items-center justify-center shrink-0">
                    <Table2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      {isId ? "PANDUAN MODUL 1" : "MODULE GUIDE 1"}
                    </span>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      {isId ? "Cara Menggunakan Scoreboard KPI" : "How to Use Scoreboard KPI"}
                    </h2>
                  </div>
                </div>
                <Link
                  href="/scoreboard"
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>{isId ? "Buka Halaman Scoreboard" : "Open Scoreboard"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 space-y-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-extrabold flex items-center justify-center text-xs">
                    1
                  </div>
                  <strong className="text-xs text-slate-900 dark:text-white block">
                    {isId ? "Input Nilai Harian / Mingguan" : "Input Weekly Values"}
                  </strong>
                  <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                    {isId
                      ? "Klik salah satu baris metrik di tabel Scoreboard untuk membuka dialog input harian Senin–Minggu. Angka harian akan diakumulasi otomatis (SUM atau AVG)."
                      : "Click any metric row in the Scoreboard to open daily inputs (Mon–Sun). Values are automatically summed or averaged."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 space-y-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-extrabold flex items-center justify-center text-xs">
                    2
                  </div>
                  <strong className="text-xs text-slate-900 dark:text-white block">
                    {isId ? "Evaluasi Warna Status" : "Status Color Evaluation"}
                  </strong>
                  <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                    {isId
                      ? "Badge Hijau (Aman): Capaian memenuhi target. Badge Merah (Masalah): Capaian di bawah target dan perlu tindakan perbaikan."
                      : "Green Badge: Target met or exceeded. Red Badge: Failing metric that requires corrective action."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 space-y-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-extrabold flex items-center justify-center text-xs">
                    3
                  </div>
                  <strong className="text-xs text-slate-900 dark:text-white block">
                    {isId ? "Konversi Cepat ke Issue" : "Instant Conversion to Issue"}
                  </strong>
                  <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                    {isId
                      ? "Jika metrik gagal berturut-turut, klik tombol 'Konversi' di modal detail untuk melempar metrik langsung ke Pusat Kendala (Issues) tanpa ketik ulang."
                      : "If a metric fails repeatedly, click 'Convert' in the detail modal to push it directly into the Issue Tracker without retyping."}
                  </p>
                </div>
              </div>

              {/* Interactive Mockup Visual */}
              <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-zinc-950/60 border border-slate-200/80 dark:border-zinc-800 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{isId ? "Ilustrasi Tampilan Baris Scoreboard" : "Scoreboard Row Visual Preview"}</span>
                </span>
                <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200/70 dark:border-zinc-800 flex items-center justify-between text-xs font-mono">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 dark:text-white font-sans text-xs">
                      Omset Penjualan Harian (Kitchen)
                    </span>
                    <span className="text-[11px] text-slate-500 font-sans block">Target: Rp 15.000.000 / hari</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                      Rp 16.200.000 (108% 🟢)
                    </span>
                    <span className="text-slate-400 text-[10px]">W3 Aktif</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Section 3: Panduan Rocks (Batu Sasaran) */}
          {visibleSectionIds.has("guide-rocks") && (
            <section
              id="guide-rocks"
              className="scroll-mt-24 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xs space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/60 flex items-center justify-center shrink-0">
                    <Milestone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      {isId ? "PANDUAN MODUL 2" : "MODULE GUIDE 2"}
                    </span>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      {isId ? "Cara Mengelola Prioritas 90 Hari (Rocks)" : "Managing 90-Day Priorities (Rocks)"}
                    </h2>
                  </div>
                </div>
                <Link
                  href="/rocks"
                  className="px-3.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold hover:bg-amber-100 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>{isId ? "Buka Halaman Rocks" : "Open Rocks"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 space-y-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-600 text-white font-extrabold flex items-center justify-center text-xs">
                    1
                  </div>
                  <strong className="text-xs text-slate-900 dark:text-white block">
                    {isId ? "Tentukan 3-7 Sasaran Kunci" : "Set 3-7 Key Goals"}
                  </strong>
                  <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                    {isId
                      ? "Setiap kuartal (90 hari), setiap divisi hanya boleh memiliki maksimal 3–7 Rock prioritas tinggi. Tetapkan PIC tunggal dan due date."
                      : "Each division should focus on only 3–7 high-priority Rocks per quarter, each owned by 1 clear PIC."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 space-y-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-600 text-white font-extrabold flex items-center justify-center text-xs">
                    2
                  </div>
                  <strong className="text-xs text-slate-900 dark:text-white block">
                    {isId ? "Pantau Radar Kesehatan Otomatis" : "Monitor Automatic Health Radar"}
                  </strong>
                  <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                    {isId
                      ? "Sistem otomatis mendeteksi status: On Track (progres sehat), Off Track Beresiko (sisa waktu <= 14 hari tp progres < 50%), atau Terlambat."
                      : "The radar engine flags Rocks automatically: On Track, Off Track at Risk (<= 14 days left with < 50% progress), or Overdue."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 space-y-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-600 text-white font-extrabold flex items-center justify-center text-xs">
                    3
                  </div>
                  <strong className="text-xs text-slate-900 dark:text-white block">
                    {isId ? "Verifikasi Selesai Dua Langkah" : "Two-Step Done Verification"}
                  </strong>
                  <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                    {isId
                      ? "Ketika progres mencapai 100%, status berubah jadi 'Siap Review'. Khusus akun Owner yang dapat menekan tombol resmi 'Verifikasi Selesai'."
                      : "When progress reaches 100%, status shifts to 'Ready for Review'. Only Owners can officially click 'Verify Completed'."}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Section 4: Panduan Issues & IDS */}
          {visibleSectionIds.has("guide-issues") && (
            <section
              id="guide-issues"
              className="scroll-mt-24 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xs space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/60 flex items-center justify-center shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                      {isId ? "PANDUAN MODUL 3" : "MODULE GUIDE 3"}
                    </span>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      {isId ? "Cara Melaporkan Masalah & Alur IDS" : "Reporting Issues & The IDS Framework"}
                    </h2>
                  </div>
                </div>
                <Link
                  href="/issues"
                  className="px-3.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold hover:bg-rose-100 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>{isId ? "Buka Halaman Masalah" : "Open Issues"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 space-y-2">
                  <div className="w-6 h-6 rounded-lg bg-rose-600 text-white font-extrabold flex items-center justify-center text-xs">
                    1
                  </div>
                  <strong className="text-xs text-slate-900 dark:text-white block">
                    {isId ? "Lapor Kendala + Upload Bukti Foto" : "Report Issue + Upload Photo"}
                  </strong>
                  <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                    {isId
                      ? "Klik 'Tambah Masalah', pilih divisi, tulis kendala secara jelas, dan lampirkan foto/file (misal foto kompor rusak atau chiller bocor hingga 5MB)."
                      : "Click 'Add Issue', pick division, describe the obstacle, and upload photo/file evidence up to 5MB."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 space-y-2">
                  <div className="w-6 h-6 rounded-lg bg-rose-600 text-white font-extrabold flex items-center justify-center text-xs">
                    2
                  </div>
                  <strong className="text-xs text-slate-900 dark:text-white block">
                    {isId ? "Pilih 3 Masalah Prioritas Teratas" : "Triage Top 3 Issues"}
                  </strong>
                  <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                    {isId
                      ? "Saat rapat L10, jangan bahas semua masalah sekaligus! Pilih masalah urutan 1, 2, dan 3 yang paling berdampak besar ke operasional."
                      : "During L10, avoid tackling all issues! Vote and pick the top 3 highest-impact obstacles to solve."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 space-y-2">
                  <div className="w-6 h-6 rounded-lg bg-rose-600 text-white font-extrabold flex items-center justify-center text-xs">
                    3
                  </div>
                  <strong className="text-xs text-slate-900 dark:text-white block">
                    {isId ? "Selesaikan Menjadi Action Item To-Do" : "Solve into Actionable To-Do"}
                  </strong>
                  <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                    {isId
                      ? "Diskusi IDS dianggap tuntas HANYA jika menghasilkan To-Do konkret dengan 1 PIC pelaksana dan tenggat waktu 7 hari ke depan."
                      : "An IDS discussion is solved ONLY when it produces an action item To-Do with 1 owner and a 7-day deadline."}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Section 5: Panduan To-Do & Headlines */}
          {visibleSectionIds.has("guide-todos") && (
            <section
              id="guide-todos"
              className="scroll-mt-24 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xs space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-900/60 flex items-center justify-center shrink-0">
                    <CheckSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      {isId ? "PANDUAN MODUL 4" : "MODULE GUIDE 4"}
                    </span>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      {isId ? "Cara Mengelola Agenda Tugas (To-Do)" : "Actionable To-Do Execution"}
                    </h2>
                  </div>
                </div>
                <Link
                  href="/todos"
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>{isId ? "Buka Halaman To-Do" : "Open To-Dos"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-zinc-300">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 space-y-2">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                    <span>{isId ? "Prinsip Komitmen 7 Hari" : "7-Day Commitment Principle"}</span>
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                    {isId
                      ? "To-Do bukan daftar impian panjang, melainkan janji tugas yang bisa diselesaikan dalam kurun 7 hari sebelum rapat minggu berikutnya."
                      : "To-Dos are short-term tactical commitments that must be executed within 7 days before the next team meeting."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 space-y-2">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                    <RefreshCw className="w-4 h-4 text-cyan-500" />
                    <span>{isId ? "Konversi To-Do Jadi Metrik Permanen" : "Promote To-Do to Scoreboard"}</span>
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed">
                    {isId
                      ? "Jika suatu tugas terbukti perlu dipantau rutin setiap minggu, klik 'Konversi' pada tugas tersebut untuk menjadikannya metrik resmi di Scoreboard."
                      : "If a task requires ongoing weekly tracking, convert it directly into a permanent Scoreboard metric."}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Section 6: Panduan Headlines */}
          {visibleSectionIds.has("guide-headlines") && (
            <section
              id="guide-headlines"
              className="scroll-mt-24 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xs space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-50 dark:bg-cyan-950/50 text-cyan-600 dark:text-cyan-400 border border-cyan-200/60 dark:border-cyan-900/60 flex items-center justify-center shrink-0">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                      {isId ? "PANDUAN MODUL 5" : "MODULE GUIDE 5"}
                    </span>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      {isId ? "Cara Menyiarkan Warta (Headlines)" : "Broadcasting Team Headlines"}
                    </h2>
                  </div>
                </div>
                <Link
                  href="/headlines"
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 text-xs font-bold hover:bg-cyan-100 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>{isId ? "Buka Halaman Warta" : "Open Headlines"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { tag: "Achievement", labelId: "Prestasi / Rekor", descId: "Rayakan capaian omset atau rekor cabang", color: "text-amber-500 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60" },
                  { tag: "Good News", labelId: "Kabar Baik", descId: "Ulasan positif pelanggan / ekspansi", color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60" },
                  { tag: "Bad News", labelId: "Kendala Eksternal", descId: "Kenaikan harga bahan baku pasar", color: "text-rose-500 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60" },
                  { tag: "Reminder", labelId: "Pengingat Jadwal", descId: "Batas waktu audit atau stok opname", color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/60" },
                  { tag: "Announcement", labelId: "Pengumuman Resmi", descId: "SOP baru atau kebijakan manajemen", color: "text-blue-500 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60" }
                ].map((cat) => (
                  <div key={cat.tag} className={`p-3 rounded-2xl border ${cat.color} space-y-1`}>
                    <span className="text-[10px] font-black uppercase tracking-wider block">{cat.tag}</span>
                    <strong className="text-xs text-slate-900 dark:text-white block">{cat.labelId}</strong>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-snug">{cat.descId}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
