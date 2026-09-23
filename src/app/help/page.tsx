"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  HelpCircle,
  BookOpen,
  Cpu,
  Table2,
  Milestone,
  AlertCircle,
  AlertTriangle,
  CheckSquare,
  Settings,
  Sparkles,
  Search,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Layers,
  RefreshCw,
  Database,
  Users,
  CheckCircle2,
  Info,
  Lightbulb,
  Command,
  Clock,
  Building2,
  TrendingUp,
  TrendingDown,
  Percent,
  Coins,
  Hash,
  Share2,
  FileText,
  Key,
  Flame,
  Zap,
  X,
  Compass
} from "lucide-react";
import { Documentation3DBook } from "@/components/help/Documentation3DBook";

interface DocSection {
  id: string;
  titleId: string;
  titleEn: string;
  category: "guide" | "system" | "workflow";
  icon: React.ReactNode;
  summaryId: string;
  summaryEn: string;
}

export default function HelpSystemDocsPage() {
  const { language, currentProfile, departments } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeSectionId, setActiveSectionId] = useState<string>("overview");

  const isId = language === "id";

  const sections: DocSection[] = useMemo(
    () => [
      {
        id: "overview",
        titleId: "Ringkasan & Filosofi Platform",
        titleEn: "Overview & Platform Philosophy",
        category: "guide",
        icon: <Compass className="w-4 h-4 text-blue-500" />,
        summaryId: "Prinsip Traction EOS, irama kerja tim, dan ekosistem RockyTen",
        summaryEn: "Traction EOS principles, operational rhythm, and RockyTen ecosystem"
      },
      {
        id: "scoreboard",
        titleId: "Scoreboard KPI & Kalkulasi",
        titleEn: "Scoreboard KPI & Calculation Engine",
        category: "guide",
        icon: <Table2 className="w-4 h-4 text-emerald-500" />,
        summaryId: "Siklus metrik bulanan/khusus, akumulasi SUM/AVG, dan pengisian W1–W4",
        summaryEn: "Monthly/special cycles, SUM/AVG accumulation, and W1–W4 tracking"
      },
      {
        id: "rocks",
        titleId: "Modul Rocks (Prioritas 90 Hari)",
        titleEn: "Rocks Module (90-Day Priorities)",
        category: "guide",
        icon: <Milestone className="w-4 h-4 text-amber-500" />,
        summaryId: "Radar deteksi otomatis kesehatan status dan verifikasi direksi",
        summaryEn: "Automatic health radar status detection and leadership verification"
      },
      {
        id: "issues",
        titleId: "Pelacak Masalah (IDS Framework)",
        titleEn: "Issue Tracker (IDS Framework)",
        category: "guide",
        icon: <AlertCircle className="w-4 h-4 text-rose-500" />,
        summaryId: "Metodologi Identify, Discuss, Solve dan skala prioritas kendala",
        summaryEn: "Identify, Discuss, Solve methodology and issue priority triage"
      },
      {
        id: "todos-headlines",
        titleId: "Agenda To-Do & Berita Headline",
        titleEn: "To-Do Agenda & Headline News",
        category: "guide",
        icon: <CheckSquare className="w-4 h-4 text-indigo-500" />,
        summaryId: "Tindakan eksekusi tugas, berkas lampiran, dan siaran pengumuman",
        summaryEn: "Actionable tasks, file attachments, and broadcast announcements"
      },
      {
        id: "conversion",
        titleId: "Alur Konversi Universal",
        titleEn: "Universal Conversion Flow",
        category: "workflow",
        icon: <RefreshCw className="w-4 h-4 text-cyan-500" />,
        summaryId: "Transformasi data antar-modul dengan in-place sliding card",
        summaryEn: "Cross-module data transformation with in-place sliding card flow"
      },
      {
        id: "accounts",
        titleId: "Hierarki Akun & Simulator",
        titleEn: "Account Roles & Simulator",
        category: "system",
        icon: <Users className="w-4 h-4 text-purple-500" />,
        summaryId: "Hak akses Owner, Developer, dan PIC divisi serta akun master",
        summaryEn: "Access rights for Owner, Developer, and PIC roles with credentials"
      },
      {
        id: "architecture",
        titleId: "Arsitektur Teknis & Database",
        titleEn: "Technical Architecture & Database",
        category: "system",
        icon: <Cpu className="w-4 h-4 text-sky-500" />,
        summaryId: "Next.js 16 Turbopack, Local-First engine, dan integrasi Supabase",
        summaryEn: "Next.js 16 Turbopack, Local-First engine, and Supabase integration"
      },
      {
        id: "shortcuts",
        titleId: "Pintasan Cepat & Tips Kerja",
        titleEn: "Keyboard Shortcuts & Pro Tips",
        category: "workflow",
        icon: <Command className="w-4 h-4 text-fuchsia-500" />,
        summaryId: "Pintasan keyboard, navigasi cepat, dan efisiensi operasional",
        summaryEn: "Keyboard shortcuts, quick navigation, and operational productivity"
      }
    ],
    []
  );

  const filteredSections = useMemo(() => {
    return sections.filter((sec) => {
      const matchesCat =
        activeCategory === "all" ? true : sec.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCat;

      const title = isId ? sec.titleId.toLowerCase() : sec.titleEn.toLowerCase();
      const summary = isId
        ? sec.summaryId.toLowerCase()
        : sec.summaryEn.toLowerCase();
      return matchesCat && (title.includes(q) || summary.includes(q) || sec.id.includes(q));
    });
  }, [sections, activeCategory, searchQuery, isId]);

  const visibleSectionIds = useMemo(
    () => new Set(filteredSections.map((sec) => sec.id)),
    [filteredSections]
  );

  // Scrollspy: automatically highlight TOC item based on visible section during scroll
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = Array.from(document.querySelectorAll("section[id]")) as HTMLElement[];
      if (sectionElements.length === 0) return;

      const scrollPosition = window.scrollY + 140;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const section = sectionElements[i];
        if (section.offsetTop <= scrollPosition) {
          setActiveSectionId(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [filteredSections]);

  // Sync activeSectionId if current active section is filtered out
  useEffect(() => {
    if (filteredSections.length > 0 && !filteredSections.some((s) => s.id === activeSectionId)) {
      setActiveSectionId(filteredSections[0].id);
    }
  }, [filteredSections, activeSectionId]);

  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-200">
      {/* Top Banner / Docs Hero */}
      <div className="rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white/70 dark:bg-zinc-900/50 backdrop-blur-2xl p-6 sm:p-8 shadow-xl shadow-blue-500/5 dark:shadow-black/50 relative overflow-hidden transition-all">
        {/* Dynamic High-Contrast Aurora Mesh (Moving Blobs) */}
        <div className="absolute -right-16 -top-20 w-[420px] h-[420px] bg-gradient-to-br from-blue-600/40 via-indigo-500/35 to-cyan-400/30 dark:from-blue-500/45 dark:via-indigo-500/40 dark:to-cyan-400/35 rounded-full blur-[80px] pointer-events-none animate-aurora-1" />
        <div className="absolute -left-16 -bottom-16 w-[380px] h-[380px] bg-gradient-to-tr from-amber-500/35 via-rose-500/30 to-orange-400/30 dark:from-amber-500/35 dark:via-rose-600/30 dark:to-orange-500/30 rounded-full blur-[75px] pointer-events-none animate-aurora-2" />
        <div className="absolute left-1/3 top-1/4 w-[340px] h-[340px] bg-gradient-to-r from-purple-500/30 via-violet-500/25 to-blue-500/30 dark:from-purple-600/35 dark:via-violet-600/30 dark:to-blue-600/30 rounded-full blur-[85px] pointer-events-none animate-aurora-3" />

        {/* Ambient Frosted Glass Shimmer & Reflective Edge Light */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-white/55 dark:from-white/5 dark:via-transparent dark:to-zinc-950/40 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/50 via-indigo-400/40 via-amber-400/40 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold bg-blue-100/70 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200/70 dark:border-blue-900/70 uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>ROCKYTEN KNOWLEDGE HUB</span>
              <span className="opacity-50">•</span>
              <span>V.3.7</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {isId ? "Pusat Panduan & Dokumentasi Sistem" : "System Docs & Knowledge Portal"}
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium">
              {isId
                ? "Referensi komprehensif arsitektur, filosofi Traction EOS, tata kelola data Scoreboard, dan spesifikasi operasional platform Nasi Gerilya."
                : "Comprehensive architecture reference, Traction EOS principles, Scoreboard governance, and Nasi Gerilya platform specifications."}
            </p>
          </div>

          {/* 3D Floating Knowledge Book Illustration */}
          <Documentation3DBook isId={isId} />
        </div>

        {/* Search Bar & Category Filter */}
        <div className="mt-6 pt-5 border-t border-slate-200/90 dark:border-white/10 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between relative z-10">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isId ? "Cari panduan, rumus KPI, Rocks, atau konfigurasi..." : "Search docs, KPI formulas, Rocks, or setup..."}
              className="w-full pl-9 pr-4 py-2 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border border-slate-200/90 dark:border-zinc-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
              >
                Reset
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-2 px-1.5 -my-2 -mx-1.5 scrollbar-none shrink-0">
            {[
              { id: "all", labelId: "Semua Topik", labelEn: "All Topics" },
              { id: "guide", labelId: "Panduan Modul", labelEn: "Module Guides" },
              { id: "workflow", labelId: "Alur Kerja", labelEn: "Workflows" },
              { id: "system", labelId: "Sistem & Spesifikasi", labelEn: "System Specs" }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none ${
                  activeCategory === cat.id
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 shadow-md ring-1 ring-zinc-900/10 dark:ring-white/20"
                    : "bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md text-slate-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 hover:text-slate-950 dark:hover:text-white border border-slate-200/80 dark:border-zinc-700/80 shadow-2xs"
                }`}
              >
                {isId ? cat.labelId : cat.labelEn}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Documentation Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sticky Docs Navigation Sidebar */}
        <aside className="lg:col-span-3 sticky top-20 space-y-4 z-20">
          <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 shadow-xs">
            <div className="px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500 border-b border-slate-100 dark:border-zinc-800/80 mb-2 flex items-center justify-between">
              <span>{isId ? "Daftar Isi Dokumentasi" : "Table of Contents"}</span>
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
          {/* Empty State when no sections match */}
          {filteredSections.length === 0 && (
            <div className="rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isId ? "Tidak Ada Modul yang Cocok" : "No Matching Modules"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm mx-auto">
                  {isId
                    ? "Coba gunakan kata kunci lain atau setel ulang filter kategori untuk melihat seluruh panduan."
                    : "Try different search terms or reset the category filter to view all guides."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("all");
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                {isId ? "Reset Filter & Pencarian" : "Reset Filter & Search"}
              </button>
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
                  {isId ? "Fondasi sistem operasional terintegrasi Nasi Gerilya" : "Operational foundation of Nasi Gerilya integrated system"}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-normal">
              <p>
                <strong>RockyTen</strong> adalah platform manajemen operasional berbasis kerangka kerja <em>Traction EOS (Entrepreneurial Operating System)</em> yang dirancang khusus untuk memonitor kesehatan bisnis, menyelaraskan prioritas kuartalan, dan menuntaskan kendala harian gerai <strong>Nasi Gerilya</strong> secara terukur.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
                    <Table2 className="w-4 h-4 text-emerald-500" />
                    <span>Weekly Scoreboard</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    {isId ? "Monitoring denyut nadi metrik utama 5-15 indikator per divisi per minggu." : "Heartbeat monitoring of 5-15 vital weekly metrics per department."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
                    <Milestone className="w-4 h-4 text-amber-500" />
                    <span>Quarterly Rocks</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    {isId ? "Sasaran strategis 90 hari yang wajib dituntaskan tim tanpa kompromi." : "Strategic 90-day priorities committed by departments."}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
                    <AlertCircle className="w-4 h-4 text-rose-500" />
                    <span>IDS Issue Resolution</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                    {isId ? "Protokol bedah masalah tuntas di rapat L10 mingguan." : "Systematic root-cause problem solving during weekly L10 meetings."}
                  </p>
                </div>
              </div>

              {/* Callout Box */}
              <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/60 flex items-start gap-3 text-xs">
                <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-blue-950 dark:text-blue-200">
                  <span className="font-bold">{isId ? "Aturan Emas Traction L10" : "Golden Rule of Traction L10"}</span>
                  <p className="text-[11px] leading-relaxed">
                    {isId
                      ? "Scoreboard bukan tempat menyalahkan individu, melainkan alat deteksi dini (Early Warning Indicator). Bila angka merah, lempar ke modul Issue untuk dibedah solusinya bersama dalam rapat L10."
                      : "The Scoreboard is an early-warning radar, not a blaming tool. When a metric turns red, convert it into an Issue for collaborative IDS solving."}
                  </p>
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
                  2. {isId ? "Scoreboard KPI & Kalkulasi Metrik" : "Scoreboard KPI & Metric Engine"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  {isId ? "Metodologi pengukuran target mingguan dan harian" : "Target tracking methodology and weekly calculation modes"}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-normal">
              <p>
                Setiap metrik di Scoreboard memiliki target numerik, penanggung jawab (PIC), divisi terkait, serta konfigurasi kalkulasi akumulasi.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                {/* Mode Akumulasi */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 space-y-2">
                  <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>{isId ? "Metode Akumulasi Angka" : "Accumulation Calculation"}</span>
                  </div>
                  <ul className="space-y-2 text-[11px] text-slate-600 dark:text-zinc-400">
                    <li>
                      <strong className="text-slate-900 dark:text-white">Penjumlahan (SUM)</strong>: Nilai mingguan adalah akumulasi total (misal: Omset Penjualan, Jumlah Porsi Terjual, Jumlah Leads Baru).
                    </li>
                    <li>
                      <strong className="text-slate-900 dark:text-white">Rata-Rata (AVG)</strong>: Nilai mingguan adalah rata-rata harian (misal: Server Uptime 99.8%, Customer Satisfaction Score 4.8/5, Kecepatan Sajian).
                    </li>
                  </ul>
                </div>

                {/* Arah Target */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 space-y-2">
                  <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>{isId ? "Arah Capaian Target" : "Target Directionality"}</span>
                  </div>
                  <ul className="space-y-2 text-[11px] text-slate-600 dark:text-zinc-400">
                    <li className="flex items-start gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span><strong>≥ Lebih Tinggi Lebih Baik</strong> (Hijau saat $\ge$ target, Merah saat di bawah target).</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <TrendingDown className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span><strong>≤ Lebih Rendah Lebih Baik</strong> (Hijau saat $\le$ target, seperti Food Waste %, Komplain Pelanggan, Bug Count).</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Siklus Metrik Table */}
              <div className="rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden text-xs">
                <div className="bg-slate-100/70 dark:bg-zinc-850 px-4 py-2.5 font-bold text-slate-800 dark:text-zinc-200 text-[11px] uppercase tracking-wider">
                  {isId ? "Tipe Siklus Metrik" : "Metric Cycle Comparison"}
                </div>
                <div className="divide-y divide-slate-100 dark:divide-zinc-800 bg-white dark:bg-zinc-950 text-[11px]">
                  <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <strong className="text-slate-900 dark:text-white">Bulanan Standar (Monthly)</strong>
                      <p className="text-slate-500 dark:text-zinc-400 mt-0.5">Berisi 4 minggu aktif (W1, W2, W3, W4) dengan pengisian rutin tiap rapat mingguan.</p>
                    </div>
                    <span className="px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold shrink-0">Siklus 4 Minggu</span>
                  </div>
                  <div className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <strong className="text-slate-900 dark:text-white">Metrik Khusus / Ad-Hoc (Special)</strong>
                      <p className="text-slate-500 dark:text-zinc-400 mt-0.5">Dilengkapi tanggal batas akhir (deadline) khusus dan penghitung durasi hari aktif.</p>
                    </div>
                    <span className="px-2 py-1 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-bold shrink-0">Deadline Khusus</span>
                  </div>
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
                  3. {isId ? "Modul Rocks & Radar Kesehatan Otomatis" : "Rocks Module & Dynamic Health Radar"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  {isId ? "Sasaran prioritas 90 hari dan protokol persetujuan direksi" : "90-day priorities and dual-step leadership verification"}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-normal">
              <p>
                <strong>Rocks</strong> adalah inisiatif kuartalan berbobot tinggi. Sistem RockyTen menggunakan <strong>Radar Kesehatan Dinamis</strong> yang menghitung status kesehatan secara otomatis berdasarkan persentase capaian dan sisa batas waktu, mengeliminasi manipulasi status manual.
              </p>

              {/* Status Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>🟢 On Track</span>
                  </div>
                  <p className="text-[11px] text-emerald-900/80 dark:text-emerald-300/80">Progres berjalan sehat sesuai lini masa target kuartal.</p>
                </div>

                <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-rose-700 dark:text-rose-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                    <span>🔴 Off Track (Beresiko)</span>
                  </div>
                  <p className="text-[11px] text-rose-900/80 dark:text-rose-300/80">Peringatan dini: sisa waktu $\le 14$ hari namun progres masih di bawah 50%.</p>
                </div>

                <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-amber-700 dark:text-amber-300">
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>🟡 Siap Review</span>
                  </div>
                  <p className="text-[11px] text-amber-900/80 dark:text-amber-300/80">Progres mencapai 100%, terkunci menunggu verifikasi direksi di rapat L10.</p>
                </div>

                <div className="p-3.5 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-blue-700 dark:text-blue-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                    <span>🔵 Selesai (Verified)</span>
                  </div>
                  <p className="text-[11px] text-blue-900/80 dark:text-blue-300/80">Telah diverifikasi resmi oleh Owner/Direksi setelah tinjauan rapat.</p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-slate-700 dark:text-zinc-300">
                    <X className="w-3.5 h-3.5 text-slate-400" />
                    <span>⚪ Dropped</span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">Dibatalkan secara sadar oleh manajemen karena pivot strategi atau realokasi.</p>
                </div>

                <div className="p-3.5 rounded-xl border border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-950/20 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-xs text-purple-700 dark:text-purple-300">
                    <Share2 className="w-3.5 h-3.5 text-purple-500" />
                    <span>Lempar ke Issue</span>
                  </div>
                  <p className="text-[11px] text-purple-900/80 dark:text-purple-300/80">Tombol instan untuk eskalasi hambatan Rock langsung ke agenda rapat IDS.</p>
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
                  4. {isId ? "Pelacak Masalah & Metodologi IDS" : "Issue Tracker & IDS Methodology"}
                </h2>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  {isId ? "Prosedur pembedahan kendala: Identify, Discuss, Solve" : "Identify, Discuss, Solve framework for operational hurdles"}
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed font-normal">
              <p>
                Modul <strong>Issue</strong> menampung segala kendala operasional cabang maupun dapur. Dalam rapat L10, tim mengurutkan masalah berdasarkan prioritas (Critical $\rightarrow$ High $\rightarrow$ Medium $\rightarrow$ Low) dan menjalankan proses 3 langkah:
              </p>

              <div className="space-y-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-blue-600 text-white font-extrabold flex items-center justify-center shrink-0 text-xs">1</span>
                  <div>
                    <strong className="text-slate-900 dark:text-white text-xs">Identify (Kenali Akar Masalah)</strong>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">Jangan hanya melihat gejala permukaan. Cari tahu penyebab riil (Root Cause) menggunakan metode 5-Whys.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-amber-600 text-white font-extrabold flex items-center justify-center shrink-0 text-xs">2</span>
                  <div>
                    <strong className="text-slate-900 dark:text-white text-xs">Discuss (Diskusikan Alternatif)</strong>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">Bahas solusi terbuka tanpa saling menyalahkan. Batasi waktu agar rapat tetap efektif dan fokus pada aksi konkret.</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/70 dark:border-zinc-800 flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-extrabold flex items-center justify-center shrink-0 text-xs">3</span>
                  <div>
                    <strong className="text-slate-900 dark:text-white text-xs">Solve (Tuntaskan Jadi Action Item)</strong>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">Solusi wajib bermuara pada penugasan To-Do konkret dengan 1 penanggung jawab (PIC) dan tenggat waktu 7 hari.</p>
                  </div>
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
                  5. {isId ? "Agenda To-Do & Berita Headline" : "Actionable To-Do & Headline News"}
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
