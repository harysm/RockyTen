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
  Layers,
  Archive,
  Download,
  Filter,
  Users,
  ShieldAlert,
  ArrowDown
} from "lucide-react";
import GuideFlowchart, { ChartNode } from "./GuideFlowchart";

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
    },
    {
      id: "guide-archives",
      titleId: "Arsip & Rekap Data Laporan (Ekspor Excel)",
      titleEn: "Archives & Report Export (Excel/CSV)",
      category: "module",
      icon: <Archive className="w-4 h-4 text-purple-500" />,
      summaryId: "Meninjau data lampau seluruh modul dan mengunduh laporan resmi format Excel/CSV",
      summaryEn: "Reviewing historical data across all modules and exporting Excel/CSV reports"
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

  // ==========================================
  // TRUE FLOWCHART DATASETS (ChartNode[])
  // ==========================================

  // 1. Alur Rapat L10 (Weekly SOP Routine)
  const l10RoutineNodes: ChartNode[] = [
    { type: "start", emoji: "🗓️", titleId: "Mulai Rapat L10", titleEn: "Start L10 Meeting" },
    {
      type: "step",
      num: 1,
      emoji: "📊",
      titleId: "Baca Scoreboard KPI (5 mnt)",
      titleEn: "Review Scoreboard (5 min)",
      descId: "Baca capaian W1-W4 setiap divisi. Jangan perdebatkan solusi. Jika angka merah, catat untuk sesi IDS.",
      descEn: "Read weekly numbers. Do not debate solutions. Mark red metrics for IDS.",
      tipsId: "Hanya sebutkan angka dan status. Maksimal 5 menit!",
      tipsEn: "State number and status only. Strictly 5 minutes!",
      mockup: (
        <div className="space-y-1.5 text-[11px] font-sans">
          <div className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold text-[10px]">⏱️ 05:00</span>
              <span className="font-semibold text-slate-800 dark:text-zinc-200">Kitchen: {isId ? "Omset Harian" : "Daily Revenue"}</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-[10px]">108% 🟢</span>
          </div>
          <div className="flex items-center justify-between bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 shadow-2xs">
            <span className="text-slate-600 dark:text-zinc-400">Marketing: {isId ? "Leads Iklan" : "Ad Leads"}</span>
            <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-black text-[10px]">45% 🔴 ➔ {isId ? "Catat ke IDS" : "Push to IDS"}</span>
          </div>
        </div>
      )
    },
    {
      type: "step",
      num: 2,
      emoji: "🪨",
      titleId: "Cek Progres Rocks (5 mnt)",
      titleEn: "Check Rocks Progress (5 min)",
      descId: "Verifikasi apakah sasaran 90 hari setiap divisi masih On Track atau berisiko Off Track.",
      descEn: "Verify if 90-day goals are On Track or at risk of Off Track.",
      tipsId: "Jika Rock terancam meleset, langsung masukkan ke daftar Issue.",
      tipsEn: "If a Rock is at risk, push it to the Issues list immediately.",
      mockup: (
        <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-1.5 shadow-2xs text-[11px] font-sans">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 dark:text-zinc-200 truncate">{isId ? "Standardisasi Resep Sambal (Kitchen)" : "Recipe Standardization (Kitchen)"}</span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] shrink-0">🟢 On Track</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: "80%" }} />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400">
            <span>{isId ? "Progres 80%" : "Progress 80%"}</span>
            <span>{isId ? "Sisa 18 Hari" : "18 Days Left"}</span>
          </div>
        </div>
      )
    },
    {
      type: "step",
      num: 3,
      emoji: "📢",
      titleId: "Warta & Headlines (5 mnt)",
      titleEn: "Headlines & News (5 min)",
      descId: "Bagikan kabar baik, apresiasi tim, atau pengumuman operasional penting.",
      descEn: "Share achievements, customer wins, and important operational notices.",
      tipsId: "Fokus pada apresiasi dan kabar positif untuk membangun semangat tim.",
      tipsEn: "Focus on wins and positive feedback to boost morale.",
      mockup: (
        <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 flex items-start gap-2 text-[11px] font-sans shadow-2xs">
          <span className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-300 font-bold text-[10px] shrink-0">🎉 {isId ? "Kabar Baik" : "Good News"}</span>
          <div className="min-w-0">
            <span className="font-bold text-slate-800 dark:text-zinc-200 block truncate">{isId ? "Review Bintang 5 dari Food Vlogger Viral!" : "5-Star Review from Viral Food Vlogger!"}</span>
            <span className="text-[10px] text-slate-400 block">{isId ? "Apresiasi tinggi untuk kru outlet dan tim dapur." : "Kudos to the entire frontline & kitchen team."}</span>
          </div>
        </div>
      )
    },
    {
      type: "step",
      num: 4,
      emoji: "✅",
      titleId: "Review To-Do Minggu Lalu (5 mnt)",
      titleEn: "Review Last Week's To-Dos (5 min)",
      descId: "Konfirmasi apakah tugas 7 hari minggu lalu sudah tuntas (Done) atau belum.",
      descEn: "Confirm which 7-day commitments are Done or Not Done.",
      tipsId: "Targetkan rasio penyelesaian minimal 90% setiap minggunya.",
      tipsEn: "Target at least 90% completion rate on weekly commitments.",
      mockup: (
        <div className="space-y-1 text-[11px] font-sans">
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
            <span className="line-through text-slate-500 dark:text-zinc-400 truncate">☑️ {isId ? "Ganti sensor chiller dapur (Budi)" : "Replace chiller sensor (Budi)"}</span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">{isId ? "Tuntas" : "Done"}</span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
            <span className="line-through text-slate-500 dark:text-zinc-400 truncate">☑️ {isId ? "Cetak booklet menu promo (Dewi)" : "Print promo menu booklet (Dewi)"}</span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0">{isId ? "Tuntas" : "Done"}</span>
          </div>
          <div className="text-[10px] text-right font-bold text-slate-500">{isId ? "Pencapaian: 2/2 Selesai (100%)" : "Completion: 2/2 Done (100%)"}</div>
        </div>
      )
    },
    {
      type: "step",
      num: 5,
      emoji: "🔥",
      titleId: "Sesi Bedah IDS (60 mnt)",
      titleEn: "IDS Problem Solving (60 min)",
      descId: "Pilih 3 masalah paling kritis. Bedah akar penyebab, diskusikan solusi, dan putuskan tindakan konkret jadi To-Do.",
      descEn: "Pick top 3 issues. Identify root causes, discuss, and convert to actionable To-Dos.",
      tipsId: "Diskusi selesai hanya jika ada To-Do dengan 1 PIC yang jelas.",
      tipsEn: "A discussion is done only when converted into a To-Do with 1 PIC.",
      mockup: (
        <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-1.5 text-[11px] font-sans shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold text-[10px]">#1 {isId ? "Kritis (IDS)" : "Critical (IDS)"}</span>
            <span className="text-[10px] font-mono text-slate-400">⏱️ {isId ? "Sisa 45:00" : "45:00 Left"}</span>
          </div>
          <p className="font-bold text-slate-800 dark:text-zinc-200">{isId ? "Pasokan Beras Terlambat 3 Hari Berturut-turut" : "Rice Supply Delayed 3 Days In a Row"}</p>
          <div className="text-[10px] text-slate-500 dark:text-zinc-400 pl-2 border-l-2 border-rose-400 space-y-0.5">
            <div><strong>{isId ? "Akar:" : "Root:"}</strong> {isId ? "Supplier tunggal kehabisan stok" : "Sole supplier ran out of stock"}</div>
            <div><strong>{isId ? "Solusi:" : "Fix:"}</strong> {isId ? "Buat kontrak supplier cadangan (To-Do 7 Hari)" : "Establish backup supplier contract (7-Day To-Do)"}</div>
          </div>
        </div>
      )
    },
    {
      type: "decision",
      questionId: "Ada Masalah Baru Lagi?",
      questionEn: "Any New Issues?",
      yes: { labelId: "✅ Ya, Ada", labelEn: "✅ Yes", emoji: "📌", titleId: "Catat ke Daftar Issue", titleEn: "Log to Issue Tracker", descId: "Jangan bahas sekarang — tambahkan ke daftar Issue untuk rapat berikutnya.", descEn: "Don't debate now — add to Issues for next week's IDS session.", variant: "warning" },
      no: { labelId: "🎯 Tidak Ada", labelEn: "🎯 None", emoji: "🏁", titleId: "Rapat Selesai Tepat Waktu!", titleEn: "Meeting Complete On Time!", descId: "Selamat! Rapat L10 selesai dalam 90 menit. Semua tugas dan masalah sudah dicatat.", descEn: "Excellent! L10 meeting done in 90 minutes. All actions and issues are logged.", variant: "success" }
    },
    { type: "end", emoji: "🏁", titleId: "Sampai Jumpa Minggu Depan", titleEn: "See You Next Week" }
  ];

  // 2. Scoreboard KPI Nodes
  const scoreboardFlowNodes: ChartNode[] = [
    { type: "start", emoji: "📊", titleId: "Buka Scoreboard KPI", titleEn: "Open Scoreboard KPI" },
    {
      type: "step",
      num: 1,
      emoji: "🏢",
      titleId: "Pilih Divisi & Periode",
      titleEn: "Select Division & Cycle",
      descId: "Buka halaman Scoreboard, pilih tab divisi Anda, dan pastikan periode minggu aktif (W1–W4) sudah sesuai.",
      descEn: "Navigate to Scoreboard, select your division tab, and verify the active weekly cycle (W1–W4).",
      tipsId: "Untuk akun PIC, divisi otomatis terkunci ke divisi masing-masing demi keamanan data.",
      tipsEn: "For PIC accounts, the division is locked automatically to your department.",
      mockup: (
        <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-sans">
          <div className="flex items-center rounded-lg bg-slate-100 dark:bg-zinc-800 p-0.5 border border-slate-200 dark:border-zinc-700">
            <span className="px-2 py-0.5 rounded bg-white dark:bg-zinc-900 font-bold text-emerald-600 text-[10px] shadow-2xs">Kitchen</span>
            <span className="px-2 py-0.5 text-slate-500 text-[10px]">Floor</span>
            <span className="px-2 py-0.5 text-slate-500 text-[10px]">Marketing</span>
          </div>
          <span className="px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] border border-emerald-200 dark:border-emerald-800">
            📅 {isId ? "September 2026 • W3 Aktif" : "September 2026 • Active W3"}
          </span>
        </div>
      )
    },
    {
      type: "step",
      num: 2,
      emoji: "✏️",
      titleId: "Input Capaian Aktual",
      titleEn: "Input Actual Values",
      descId: "Klik baris metrik untuk membuka modal input. Masukkan angka harian (Senin–Minggu) atau langsung isi total minggu ini.",
      descEn: "Click any metric row to open input dialog. Fill daily numbers or direct weekly total.",
      tipsId: "Metrik SUM menjumlah otomatis; metrik AVG menghitung rata-rata harian.",
      tipsEn: "SUM metrics auto-aggregate; AVG metrics calculate daily mean.",
      mockup: (
        <div className="p-2 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-1 text-[11px] font-sans shadow-2xs">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>{isId ? "Input Harian (Sen-Min)" : "Daily Input (Mon-Sun)"}</span>
            <span className="font-bold text-emerald-600">{isId ? "Total Minggu Ini" : "Weekly Total"}: Rp 16.200.000</span>
          </div>
          <div className="grid grid-cols-4 gap-1 text-center font-mono text-[10px]">
            <div className="p-1 rounded bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">Sen: 2.4M</div>
            <div className="p-1 rounded bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">Sel: 2.8M</div>
            <div className="p-1 rounded bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">Rab: 2.5M</div>
            <div className="p-1 rounded bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">Kam: 3.1M</div>
          </div>
        </div>
      )
    },
    {
      type: "step",
      num: 3,
      emoji: "🎯",
      titleId: "Baca Radar Warna Status",
      titleEn: "Check Status Color Radar",
      descId: "Sistem otomatis membandingkan capaian aktual vs target. Badge warna muncul real-time: Hijau (On Track) atau Merah (Drop).",
      descEn: "System compares actual vs target automatically. Green = On Track, Red = Drop.",
      tipsId: "Metrik 'Lower is Better' (Waste/Biaya) — angka lebih kecil bernilai hijau.",
      tipsEn: "For 'Lower is Better' metrics, smaller numbers turn green.",
      mockup: (
        <div className="space-y-1 text-[11px] font-sans">
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
            <span className="font-bold text-emerald-800 dark:text-emerald-200">{isId ? "Omset Penjualan (108%)" : "Sales Revenue (108%)"}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-extrabold text-[9px]">🟢 On Track</span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800">
            <span className="font-bold text-rose-800 dark:text-rose-200">{isId ? "Biaya Waste Dapur (180%)" : "Kitchen Waste (180%)"}</span>
            <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-extrabold text-[9px]">🔴 Drop</span>
          </div>
        </div>
      )
    },
    {
      type: "decision",
      questionId: "Metrik Merah ≥ 2 Minggu?",
      questionEn: "Metric Red ≥ 2 Weeks?",
      yes: { labelId: "🔴 Ya, Merah", labelEn: "🔴 Yes, Red", emoji: "🔄", titleId: "Konversi 1-Klik ke Issue", titleEn: "1-Click Convert to Issue", descId: "Klik ikon Konversi (🔄) — metrik langsung masuk antrian IDS tanpa ketik ulang.", descEn: "Click Convert (🔄) — metric instantly queued for IDS without retyping.", variant: "danger" },
      no: { labelId: "🟢 On Track", labelEn: "🟢 On Track", emoji: "✅", titleId: "Pertahankan & Lanjut", titleEn: "Maintain & Continue", descId: "Bagus! Capaian sudah melampaui target. Pertahankan konsistensi minggu depan.", descEn: "Great! Performance exceeds target. Maintain the consistency next week.", variant: "success" }
    },
    { type: "end", emoji: "✅", titleId: "Scoreboard Minggu Ini Selesai", titleEn: "This Week's Scoreboard Done" }
  ];

  // 3. Rocks 90-Day Nodes
  const rocksFlowNodes: ChartNode[] = [
    { type: "start", emoji: "🪨", titleId: "Buka Halaman Rocks", titleEn: "Open Rocks Page" },
    {
      type: "step",
      num: 1,
      emoji: "🎯",
      titleId: "Tentukan Sasaran Kuartal",
      titleEn: "Set 90-Day Priority",
      descId: "Di awal kuartal (Q1–Q4), buat 3–7 sasaran utama divisi dengan target spesifik, batas waktu akhir kuartal, dan 1 PIC.",
      descEn: "At quarter start, define 3–7 key Rocks with clear milestones, quarter deadline, and 1 PIC.",
      tipsId: "Maksimal 3–7 Rock per divisi. Jika semuanya prioritas, berarti tidak ada prioritas!",
      tipsEn: "Limit to 3–7 Rocks per division. If everything is a priority, nothing is!",
      mockup: (
        <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-1 text-[11px] font-sans shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 dark:text-zinc-100 truncate">{isId ? "Standardisasi SOP Resep Dapur" : "Kitchen Recipe Standardization"}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold shrink-0">Q3 2026</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>PIC: Chef Juna</span>
            <span>{isId ? "Batas: 30 Sep 2026 (90 Hari)" : "Deadline: Sep 30, 2026 (90 Days)"}</span>
          </div>
        </div>
      )
    },
    {
      type: "step",
      num: 2,
      emoji: "📈",
      titleId: "Tautkan Metrik Pendukung",
      titleEn: "Link Supporting Metrics",
      descId: "Hubungkan metrik harian/mingguan dari Scoreboard ke Rock ini. Setiap update metrik mendorong progres Rock otomatis.",
      descEn: "Link daily/weekly Scoreboard metrics. Updating values automatically drives Rock progress.",
      tipsId: "Rock yang ditautkan metrik memiliki progres objektif berbasis data nyata, bukan perasaan.",
      tipsEn: "Metrics-driven Rocks have objective progress backed by real numbers.",
      mockup: (
        <div className="p-2 rounded-lg bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex items-center justify-between text-[11px] font-sans shadow-2xs">
          <div className="flex items-center gap-1.5 truncate">
            <span className="text-amber-600 font-bold">🔗 {isId ? "Tertaut:" : "Linked:"}</span>
            <span className="text-slate-700 dark:text-zinc-300 font-medium truncate">{isId ? "Metrik Food Waste Kitchen (% Omset)" : "Kitchen Food Waste (% Sales)"}</span>
          </div>
          <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold bg-amber-100 dark:bg-amber-900/60 px-2 py-0.5 rounded shrink-0">Auto Sync</span>
        </div>
      )
    },
    {
      type: "step",
      num: 3,
      emoji: "📡",
      titleId: "Pantau Radar Otomatis",
      titleEn: "Monitor Health Radar",
      descId: "Radar RockyTen memantau rasio progres vs sisa hari: On Track, Off Track Beresiko, atau Terlambat — otomatis.",
      descEn: "RockyTen radar calculates progress vs remaining days: On Track, Off Track at Risk, or Overdue.",
      tipsId: "Jika sisa waktu ≤ 14 hari namun progres < 50%, sistem menyalakan radar peringatan merah.",
      tipsEn: "If ≤ 14 days remain with < 50% progress, system triggers red warning radar.",
      mockup: (
        <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-1.5 text-[11px] font-sans shadow-2xs">
          <div className="flex items-center justify-between text-[10px]">
            <span className="font-bold text-slate-700 dark:text-zinc-300">{isId ? "Radar Kesehatan Sasaran" : "Strategic Health Radar"}</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black text-[9px]">🟢 On Track</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: "78%" }} />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>{isId ? "Progres: 78%" : "Progress: 78%"}</span>
            <span>{isId ? "Sisa: 18 Hari" : "18 Days Left"}</span>
          </div>
        </div>
      )
    },
    {
      type: "decision",
      questionId: "Progres Capai 100%?",
      questionEn: "Progress Reach 100%?",
      yes: { labelId: "✅ Sudah 100%", labelEn: "✅ Yes, 100%", emoji: "🏆", titleId: "Ajukan Verifikasi Owner", titleEn: "Request Owner Verification", descId: "Status berubah 'Siap Review'. Owner menekan tombol Verifikasi Selesai — Rock resmi tuntas!", descEn: "Status turns 'Ready for Review'. Owner presses Verify — Rock officially complete!", variant: "success" },
      no: { labelId: "⚠️ Belum Selesai", labelEn: "⚠️ Incomplete", emoji: "🚨", titleId: "Bawa ke Sesi IDS Rapat", titleEn: "Escalate to IDS Session", descId: "Rock beresiko meleset. Bawa ke sesi IDS rapat mingguan untuk cari solusi darurat.", descEn: "Rock at risk of missing deadline. Escalate to IDS session for emergency recovery plan.", variant: "danger" }
    },
    { type: "end", emoji: "🏆", titleId: "Rock Kuartal Ini Selesai", titleEn: "Quarterly Rock Complete" }
  ];

  // 4. Issues & IDS Nodes
  const issuesFlowNodes: ChartNode[] = [
    { type: "start", emoji: "⚠️", titleId: "Ada Kendala di Lapangan?", titleEn: "Operational Obstacle Found?" },
    {
      type: "step",
      num: 1,
      emoji: "📸",
      titleId: "Lapor Kendala + Foto Bukti",
      titleEn: "Report Issue + Photo Proof",
      descId: "Klik 'Tambah Masalah'. Pilih divisi, jelaskan masalah, dan lampirkan foto bukti (kompor rusak, bahan rusak, dll).",
      descEn: "Click 'Add Issue'. Pick division, describe the problem, and attach photo proof.",
      tipsId: "Foto langsung terbuka di modal aplikasi — tidak perlu buka tab baru.",
      tipsEn: "Photos open in-app lightbox — no new tab needed.",
      mockup: (
        <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-1.5 text-[11px] font-sans shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 dark:text-zinc-100 truncate">{isId ? "⚠️ Pintu Chiller Dapur Rusak" : "⚠️ Kitchen Chiller Door Broken"}</span>
            <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 dark:bg-rose-950 text-[10px] font-bold shrink-0">P1 (Kritis)</span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded bg-slate-50 dark:bg-zinc-800 text-[10px] text-slate-500">
            <span>📸 seal_bocor.jpg (1.4 MB)</span>
            <span className="text-blue-500 font-bold">{isId ? "[In-App Lightbox]" : "[In-App Lightbox]"}</span>
          </div>
        </div>
      )
    },
    {
      type: "step",
      num: 2,
      emoji: "🏆",
      titleId: "Pilih Top 3 Masalah Paling Kritis",
      titleEn: "Prioritize Top 3 Issues",
      descId: "Di sesi IDS rapat mingguan, sortir semua masalah dan pilih 3 yang paling krusial untuk dibedah mendalam.",
      descEn: "During IDS session, sort all issues and pick top 3 most critical for deep-dive.",
      tipsId: "Tuntaskan 3 masalah besar hingga akar, bukan 20 masalah secara dangkal.",
      tipsEn: "Fully resolve 3 big issues to root cause — don't rush through 20 superficially.",
      mockup: (
        <div className="space-y-1 text-[10px] font-sans">
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-800 dark:text-rose-200 font-bold">
            <span>#1 🔴 {isId ? "Chiller Dapur Rusak (Suhu Naik)" : "Kitchen Chiller Broken (Temp Rise)"}</span>
            <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[9px]">{isId ? "Prioritas IDS" : "IDS Priority"}</span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 text-amber-800 dark:text-amber-200 font-bold">
            <span>#2 🟡 {isId ? "Keterlambatan Pasokan Beras" : "Rice Supply Delay"}</span>
            <span className="px-1.5 py-0.5 rounded bg-amber-600 text-white text-[9px]">{isId ? "Prioritas IDS" : "IDS Priority"}</span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-zinc-800 border border-slate-200 text-slate-600 dark:text-zinc-400">
            <span>#3 ⚪ {isId ? "Lampu Gudang Padam" : "Storage Light Off"}</span>
            <span className="text-[9px] text-slate-400">{isId ? "Antrian Nanti" : "Queue Later"}</span>
          </div>
        </div>
      )
    },
    {
      type: "step",
      num: 3,
      emoji: "🔍",
      titleId: "Bedah Akar Masalah (Identify)",
      titleEn: "Identify Root Cause",
      descId: "Tanyakan 'Mengapa?' beberapa kali hingga menemukan akar sesungguhnya — bukan sekadar mengatasi gejala.",
      descEn: "Ask 'Why?' multiple times to uncover the real root cause, not just the surface symptom.",
      tipsId: "Mengatasi gejala = masalah berulang. Mengatasi akar = masalah lenyap selamanya.",
      tipsEn: "Treating symptoms = recurring bugs. Solving root cause = permanent fix.",
      mockup: (
        <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-1 text-[11px] font-sans shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">{isId ? "Analisis Akar Masalah (5 Whys)" : "Root Cause (5 Whys)"}</span>
          <div className="text-[10px] text-slate-600 dark:text-zinc-300 pl-2 border-l-2 border-rose-500 space-y-0.5">
            <div><strong>{isId ? "Gejala:" : "Symptom:"}</strong> {isId ? "Karet seal pintu sobek terbentur troli." : "Door seal torn by supply trolley."}</div>
            <div><strong>{isId ? "Akar Nyata:" : "Root Cause:"}</strong> {isId ? "Belum ada pelindung bemper pada kusen pintu chiller." : "No protective bumper guard on door frame."}</div>
          </div>
        </div>
      )
    },
    {
      type: "decision",
      questionId: "Sudah Ketemu Solusi?",
      questionEn: "Solution Found?",
      yes: { labelId: "✅ Ya, Ketemu", labelEn: "✅ Yes, Found", emoji: "🔄", titleId: "Konversi Jadi To-Do", titleEn: "Convert to To-Do", descId: "Gunakan tombol Konversi — solusi langsung jadi kartu To-Do 7 hari dengan 1 PIC tanpa ketik ulang.", descEn: "Click Convert — solution becomes a 7-day To-Do card with 1 PIC without retyping.", variant: "success" },
      no: { labelId: "❓ Belum Jelas", labelEn: "❓ Not Yet Clear", emoji: "📅", titleId: "Tunda & Riset Lebih Dalam", titleEn: "Defer & Investigate Deeper", descId: "Tandai sebagai 'Perlu Riset'. Lanjutkan bedah akar di rapat berikutnya dengan data lebih lengkap.", descEn: "Mark as 'Needs Research'. Continue root-cause analysis at next meeting with more data.", variant: "warning" }
    },
    { type: "end", emoji: "✅", titleId: "Masalah Terpecahkan", titleEn: "Issue Resolved" }
  ];

  // 5. Todos 7-Day Nodes
  const todosFlowNodes: ChartNode[] = [
    { type: "start", emoji: "✅", titleId: "Tugas Baru Masuk", titleEn: "New Task Incoming" },
    {
      type: "step",
      num: 1,
      emoji: "👤",
      titleId: "Terima Komitmen 7 Hari",
      titleEn: "Accept 7-Day Commitment",
      descId: "Setiap To-Do harus memiliki tepat 1 PIC penanggung jawab dan batas waktu maksimal 7 hari — tidak lebih.",
      descEn: "Every To-Do must have exactly 1 PIC owner and a max 7-day deadline — no exceptions.",
      tipsId: "Jika 2 orang bertanggung jawab atas 1 tugas, tidak ada yang benar-benar bertanggung jawab!",
      tipsEn: "If two people own a task, nobody truly owns it. Always 1 PIC.",
      mockup: (
        <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-1 text-[11px] font-sans shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 dark:text-zinc-100 truncate">{isId ? "Pasang pelat stainless pelindung chiller" : "Install stainless guard plate on chiller"}</span>
            <span className="px-1.5 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold shrink-0">7 Hari</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>{isId ? "PIC Tunggal: Budi (Maint)" : "Single PIC: Budi (Maint)"}</span>
            <span>{isId ? "Batas: Jumat 17:00" : "Deadline: Friday 17:00"}</span>
          </div>
        </div>
      )
    },
    {
      type: "step",
      num: 2,
      emoji: "📎",
      titleId: "Lampirkan Berkas / Foto Bukti",
      titleEn: "Attach Files & Proof",
      descId: "Unggah nota pembelian (PDF/Excel), instruksi kerja (Word), atau foto pemasangan sebagai bukti verifikasi rapat.",
      descEn: "Upload receipts (PDF/Excel), work SOPs (Word), or photo evidence for meeting verification.",
      tipsId: "Foto/video langsung tampil di web kita; dokumen lain otomatis buka tab baru.",
      tipsEn: "Photos/videos open in-app; documents automatically open in a new tab.",
      mockup: (
        <div className="space-y-1 text-[10px] font-sans">
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
            <span className="text-slate-700 dark:text-zinc-300 font-medium truncate">📎 nota_pembelian_bemper.pdf (180 KB)</span>
            <span className="text-blue-500 font-bold shrink-0">{isId ? "[Tab Baru]" : "[New Tab]"}</span>
          </div>
          <div className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
            <span className="text-slate-700 dark:text-zinc-300 font-medium truncate">📸 foto_pemasangan_selesai.jpg</span>
            <span className="text-emerald-500 font-bold shrink-0">{isId ? "[Lightbox]" : "[Lightbox]"}</span>
          </div>
        </div>
      )
    },
    {
      type: "step",
      num: 3,
      emoji: "⚡",
      titleId: "Eksekusi di Lapangan",
      titleEn: "Field Execution",
      descId: "PIC mengeksekusi tugas sebelum rapat mingguan berikutnya. Jika ada bloker, segera koordinasikan dengan tim.",
      descEn: "PIC completes the commitment before next week's meeting. Communicate blockers promptly.",
      tipsId: "To-Do adalah tugas taktis 7 hari, bukan backlog tahunan.",
      tipsEn: "To-Dos are 7-day tactical actions, not annual backlog items.",
      mockup: (
        <div className="p-2 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between text-[11px] font-sans shadow-2xs">
          <span className="font-bold text-indigo-900 dark:text-indigo-200">{isId ? "Status: Eksekusi Lapangan Tuntas" : "Status: Field Execution Complete"}</span>
          <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-black text-[10px]">☑️ {isId ? "Done" : "Done"}</span>
        </div>
      )
    },
    {
      type: "decision",
      questionId: "Tugas Selesai Sebelum Rapat?",
      questionEn: "Task Done Before Meeting?",
      yes: { labelId: "✅ Selesai", labelEn: "✅ Done", emoji: "🎉", titleId: "Centang & Konfirmasi di Rapat", titleEn: "Check-off & Confirm at Meeting", descId: "Centang kartu To-Do — tim mengkonfirmasi resmi di tahap 4 rapat L10 mingguan.", descEn: "Check the card — team officially confirms at step 4 of L10 meeting.", variant: "success" },
      no: { labelId: "❌ Belum Selesai", labelEn: "❌ Not Done", emoji: "🔁", titleId: "Jelaskan & Buat Ulang", titleEn: "Explain & Recreate", descId: "Jelaskan kendalanya di rapat. Buat To-Do baru dengan batas waktu yang diperbarui.", descEn: "Explain the blocker at the meeting. Create a new To-Do with an updated deadline.", variant: "danger" }
    },
    { type: "end", emoji: "🏁", titleId: "Tugas Tuntas", titleEn: "Task Complete" }
  ];

  // 6. Headlines Nodes
  const headlinesFlowNodes: ChartNode[] = [
    { type: "start", emoji: "📢", titleId: "Ada Kabar untuk Dibagikan?", titleEn: "Something to Share?" },
    {
      type: "step",
      num: 1,
      emoji: "🏷️",
      titleId: "Pilih Kategori Warta",
      titleEn: "Choose Category",
      descId: "Tentukan jenis: Kabar Baik 🎉, Pencapaian 🏆, Pengumuman Resmi 📢, Kendala Eksternal ⚠️, atau Pengingat 📅.",
      descEn: "Pick category: Good News 🎉, Achievement 🏆, Official Notice 📢, External Issue ⚠️, or Reminder 📅.",
      tipsId: "Gunakan 'Pencapaian' untuk merayakan rekor penjualan atau keberhasilan audit.",
      tipsEn: "Use 'Achievement' to celebrate sales records or flawless audit results.",
      mockup: (
        <div className="flex flex-wrap gap-1 text-[10px] font-sans">
          <span className="px-2 py-1 rounded bg-amber-100 text-amber-700 font-bold">🏆 {isId ? "Pencapaian" : "Achievement"}</span>
          <span className="px-2 py-1 rounded bg-cyan-100 text-cyan-700 font-bold">🎉 {isId ? "Kabar Baik" : "Good News"}</span>
          <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 font-bold">📢 {isId ? "Pengumuman" : "Notice"}</span>
          <span className="px-2 py-1 rounded bg-rose-100 text-rose-700 font-bold">⚠️ {isId ? "Kendala" : "Issue"}</span>
        </div>
      )
    },
    {
      type: "step",
      num: 2,
      emoji: "✍️",
      titleId: "Tulis Pesan & Lampiran",
      titleEn: "Compose Message & Media",
      descId: "Tulis judul berita yang menarik dan deskripsi padat. Lampirkan foto dokumentasi jika ada.",
      descEn: "Write a clear headline and concise summary. Attach documentation photos if applicable.",
      tipsId: "Pesan yang padat dan positif lebih mudah diingat oleh seluruh staf operasional.",
      tipsEn: "Short, positive headlines are more digestible for frontline restaurant staff.",
      mockup: (
        <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-1 text-[11px] font-sans shadow-2xs">
          <span className="font-bold text-slate-800 dark:text-zinc-100 block">{isId ? "🏆 Rekor 1.500 Porsi Nasi Gerilya Terjual!" : "🏆 1,500 Portions of Nasi Gerilya Sold!"}</span>
          <p className="text-[10px] text-slate-500">{isId ? "Apresiasi atas kerja keras luar biasa seluruh tim operasional weekend ini." : "Appreciation for the whole ops team this weekend."}</p>
          <span className="text-[9px] text-slate-400 block">{isId ? "Oleh: Manager Operational • Disiarkan Hari Ini" : "By: Operational Manager • Broadcast Today"}</span>
        </div>
      )
    },
    {
      type: "step",
      num: 3,
      emoji: "📡",
      titleId: "Publikasikan ke Tim",
      titleEn: "Broadcast to Team",
      descId: "Pilih target: 'Global' untuk seluruh perusahaan, atau pilih divisi spesifik (misal Kitchen saja).",
      descEn: "Select target: 'Global' for the whole company, or scope to a specific division.",
      tipsId: "Kebijakan resmi manajemen wajib disiarkan dengan cakupan Global.",
      tipsEn: "Official management policies must always be broadcast globally.",
      mockup: (
        <div className="p-2 rounded-lg bg-cyan-50/70 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800 flex items-center justify-between text-[11px] font-sans shadow-2xs">
          <span className="font-bold text-cyan-900 dark:text-cyan-200">🌐 {isId ? "Lingkup Siaran: Global (Semua Divisi)" : "Broadcast Scope: Global (All Depts)"}</span>
          <span className="px-2 py-0.5 rounded-full bg-cyan-600 text-white font-bold text-[9px]">{isId ? "Tersiar" : "Live"}</span>
        </div>
      )
    },
    {
      type: "decision",
      questionId: "Perlu Tindakan Nyata?",
      questionEn: "Needs Follow-up Action?",
      yes: { labelId: "✅ Ya, Perlu Aksi", labelEn: "✅ Yes, Action Needed", emoji: "🔄", titleId: "Konversi ke To-Do", titleEn: "Convert to To-Do", descId: "Klik Konversi — warta langsung jadi kartu To-Do 7 hari dengan PIC penanggung jawab.", descEn: "Click Convert — headline becomes a 7-day To-Do card with a responsible PIC.", variant: "info" },
      no: { labelId: "📌 Informasi Saja", labelEn: "📌 Info Only", emoji: "✅", titleId: "Tersimpan di Feed Tim", titleEn: "Saved in Team Feed", descId: "Warta tersimpan di feed tim sebagai rekam jejak informasi — tidak butuh aksi lebih lanjut.", descEn: "Headline saved in team feed as an information record — no further action needed.", variant: "success" }
    },
    { type: "end", emoji: "📬", titleId: "Warta Berhasil Disiarkan", titleEn: "Headline Successfully Broadcast" }
  ];

  // 7. Archives Nodes
  const archivesFlowNodes: ChartNode[] = [
    { type: "start", emoji: "🗂️", titleId: "Buka Halaman Arsip", titleEn: "Open Archives Page" },
    {
      type: "step",
      num: 1,
      emoji: "📂",
      titleId: "Pilih Tab Modul Arsip",
      titleEn: "Select Archive Module",
      descId: "Buka menu Arsip (Owner & Developer). Pilih tab: Metrik KPI, Agenda Tugas, Masalah Selesai, atau Warta Lama.",
      descEn: "Open Archives (Owner/Dev only). Pick tab: KPI Metrics, To-Dos, Solved Issues, or Headlines.",
      tipsId: "Arsip menyimpan rekam jejak lengkap — data tidak pernah terhapus atau tertimpa.",
      tipsEn: "Archives preserve the complete audit trail — data is never deleted or overwritten.",
      mockup: (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 text-[10px] font-sans text-center">
          <span className="p-1 rounded bg-purple-600 text-white font-bold">{isId ? "Metrik KPI" : "KPI Metrics"}</span>
          <span className="p-1 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600">{isId ? "Agenda Tugas" : "To-Dos"}</span>
          <span className="p-1 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600">{isId ? "Masalah Selesai" : "Resolved Issues"}</span>
          <span className="p-1 rounded bg-slate-100 dark:bg-zinc-800 text-slate-600">{isId ? "Warta Lama" : "Headlines"}</span>
        </div>
      )
    },
    {
      type: "step",
      num: 2,
      emoji: "🔍",
      titleId: "Filter Divisi & Rentang Waktu",
      titleEn: "Filter Dept & Timeframe",
      descId: "Gunakan dropdown untuk menyaring data divisi tertentu, status penyelesaian, atau kata kunci pencarian.",
      descEn: "Use dropdowns to filter by specific division, completion status, or search keywords.",
      tipsId: "Toggle mode 'Tabel' untuk data padat, atau mode 'Kartu' untuk visual rincian.",
      tipsEn: "Toggle 'Table' mode for dense data, or 'Card' mode for rich visual details.",
      mockup: (
        <div className="flex flex-wrap gap-1.5 text-[10px] font-sans">
          <div className="px-2 py-1 rounded bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">{isId ? "Divisi: Semua ▼" : "Dept: All ▼"}</div>
          <div className="px-2 py-1 rounded bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">{isId ? "Tahun: 2026 ▼" : "Year: 2026 ▼"}</div>
          <div className="px-2 py-1 rounded bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">{isId ? "Status: Selesai ▼" : "Status: Done ▼"}</div>
        </div>
      )
    },
    {
      type: "step",
      num: 3,
      emoji: "📊",
      titleId: "Analisis Ringkasan Kinerja",
      titleEn: "Inspect Historical Summary",
      descId: "Tinjau kartu ringkasan atas: lihat rasio completion rate, rata-rata durasi, dan performa divisi secara historis.",
      descEn: "Review top summary cards: completion rate, average duration, and division performance history.",
      tipsId: "Statistik historis sangat berharga saat evaluasi kinerja kuartalan manajemen.",
      tipsEn: "Historical metrics are invaluable for quarterly executive performance reviews.",
      mockup: (
        <div className="p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-1 text-[11px] font-sans shadow-2xs">
          <div className="flex justify-between text-[10px]">
            <span className="text-slate-500">{isId ? "Rasio Penyelesaian Tugas" : "Task Completion Rate"}</span>
            <span className="font-extrabold text-emerald-600">94.8% 🟢</span>
          </div>
          <div className="flex justify-between text-[10px]">
            <span className="text-slate-500">{isId ? "Total Masalah Terselesaikan" : "Total Solved Issues"}</span>
            <span className="font-extrabold text-purple-600">88 {isId ? "Kasus (100% IDS)" : "Cases (100% IDS)"}</span>
          </div>
        </div>
      )
    },
    {
      type: "decision",
      questionId: "Butuh Laporan Tercetak?",
      questionEn: "Need Printed Report?",
      yes: { labelId: "📥 Ya, Unduh", labelEn: "📥 Yes, Export", emoji: "📊", titleId: "Ekspor Excel / CSV", titleEn: "Export Excel / CSV", descId: "Klik 'Ekspor Data' — file .xlsx / .csv terunduh otomatis, siap dibuka di Excel atau Google Sheets.", descEn: "Click 'Export Data' — .xlsx/.csv downloads instantly, ready for Excel or Google Sheets.", variant: "info" },
      no: { labelId: "👁️ Lihat Saja", labelEn: "👁️ View Only", emoji: "✅", titleId: "Analisis Selesai di Platform", titleEn: "Analysis Complete In-Platform", descId: "Tidak perlu unduh — semua data tersedia langsung di platform secara online.", descEn: "No download needed — all data is available directly online in the platform.", variant: "success" }
    },
    { type: "end", emoji: "📋", titleId: "Pelaporan Selesai", titleEn: "Reporting Complete" }
  ];

  return (
    <div className="space-y-6">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
        {[
          { id: "all", labelId: "Semua Panduan", labelEn: "All Guides" },
          { id: "workflow", labelId: "Alur Rapat L10", labelEn: "L10 Routine" },
          { id: "module", labelId: "Cara Pakai Per Halaman", labelEn: "Page-by-Page Guides" }
        ].map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
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

          {/* Quick Info Box */}
          <div className="p-4 rounded-2xl border border-blue-100 dark:border-blue-900/40 bg-gradient-to-br from-blue-50/60 to-indigo-50/40 dark:from-blue-950/20 dark:to-indigo-950/20 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isId ? "Prinsip Utama" : "Key Principle"}</span>
            </span>
            <p className="text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-medium">
              {isId
                ? "Gunakan flowchart 1 ➔ 2 ➔ 3 ➔ 4 di setiap modul sebagai panduan standar kerja tim operasional."
                : "Follow the 1 ➔ 2 ➔ 3 ➔ 4 flowchart in each module as standard operating procedure for the ops team."}
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

              {/* True Flowchart — Top Down SOP Style */}
              <GuideFlowchart isId={isId} nodes={l10RoutineNodes} accent="blue" />

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

              {/* True Flowchart — Top Down SOP Style */}
              <GuideFlowchart isId={isId} nodes={scoreboardFlowNodes} accent="emerald" />
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

              {/* True Flowchart — Top Down SOP Style */}
              <GuideFlowchart isId={isId} nodes={rocksFlowNodes} accent="amber" />
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

              {/* True Flowchart — Top Down SOP Style */}
              <GuideFlowchart isId={isId} nodes={issuesFlowNodes} accent="rose" />
            </section>
          )}

          {/* Section 5: Panduan To-Do List */}
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

              {/* True Flowchart — Top Down SOP Style */}
              <GuideFlowchart isId={isId} nodes={todosFlowNodes} accent="indigo" />
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

              {/* True Flowchart — Top Down SOP Style */}
              <GuideFlowchart isId={isId} nodes={headlinesFlowNodes} accent="cyan" />
            </section>
          )}

          {/* Section 7: Panduan Arsip & Ekspor Laporan */}
          {visibleSectionIds.has("guide-archives") && (
            <section
              id="guide-archives"
              className="scroll-mt-24 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 sm:p-8 shadow-xs space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-zinc-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-900/60 flex items-center justify-center shrink-0">
                    <Archive className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      {isId ? "PANDUAN MODUL 6 (OWNER & DEVELOPER)" : "MODULE GUIDE 6 (OWNER & DEVELOPER)"}
                    </span>
                    <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      {isId ? "Arsip Data & Ekspor Laporan" : "Archives & Reporting Export"}
                    </h2>
                  </div>
                </div>
                <Link
                  href="/archives"
                  className="px-3.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold hover:bg-purple-100 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <span>{isId ? "Buka Halaman Arsip" : "Open Archives"}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* True Flowchart — Top Down SOP Style */}
              <GuideFlowchart isId={isId} nodes={archivesFlowNodes} accent="purple" />
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
