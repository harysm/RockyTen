"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  X,
  HelpCircle,
  Cpu,
  BookOpen,
  Table2,
  Milestone,
  AlertCircle,
  CheckSquare,
  Settings,
  Sparkles
} from "lucide-react";

interface HelpSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpSystemModal: React.FC<HelpSystemModalProps> = ({ isOpen, onClose }) => {
  const { language } = useApp();
  const [activeTab, setActiveTab] = useState<"guide" | "system">("guide");

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-zinc-800 flex items-center justify-between bg-slate-50/50 dark:bg-zinc-950/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/60 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white tracking-tight">
                {language === "id" ? "Bantuan & Sistem" : "Help & System"}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                {language === "id"
                  ? "Panduan operasional dan status sistem RockyTen"
                  : "Operational guide and RockyTen system status"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-3 border-b border-slate-100 dark:border-zinc-800 flex gap-2 bg-white dark:bg-zinc-900">
          <button
            type="button"
            onClick={() => setActiveTab("guide")}
            className={`pb-2.5 px-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "guide"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{language === "id" ? "Panduan Modul" : "Module Guide"}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("system")}
            className={`pb-2.5 px-2 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "system"
                ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                : "border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>{language === "id" ? "Informasi Sistem" : "System Info"}</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs text-slate-600 dark:text-zinc-300">
          {activeTab === "guide" ? (
            <div className="space-y-3">
              {/* Item 1: Scoreboard */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-200/70 dark:border-zinc-800 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Table2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Scoreboard KPI</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-zinc-400">
                  {language === "id"
                    ? "Tabel KPI mingguan (W1-W4) dan metrik khusus harian. Mendukung metode kalkulasi akumulasi Total (SUM) atau Rata-rata (AVG)."
                    : "Weekly KPI scoreboard and special ad-hoc metrics. Supports SUM (Total) or AVG (Average) calculation modes."}
                </p>
              </div>

              {/* Item 2: Rocks */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-200/70 dark:border-zinc-800 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Milestone className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>Rocks (Traction L10)</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-zinc-400">
                  {language === "id"
                    ? "Target prioritas strategis kuartalan (90 hari) per divisi untuk memastikan tim fokus mengeksekusi inisiatif berbobot tinggi."
                    : "Quarterly 90-day priority goals per department based on Traction L10 methodology to maintain focus."}
                </p>
              </div>

              {/* Item 3: Issue */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-200/70 dark:border-zinc-800 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span>Issue (IDS System)</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-zinc-400">
                  {language === "id"
                    ? "Manajemen kendala operasional dengan tahapan Identify, Discuss, and Solve. Dilengkapi prioritas Critical hingga Low."
                    : "Operational problem tracking using Identify, Discuss, and Solve methodology with priority levels."}
                </p>
              </div>

              {/* Item 4: To-Do & Headline */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950/50 border border-slate-200/70 dark:border-zinc-800 space-y-1">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>To-Do List & Headline</span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500 dark:text-zinc-400">
                  {language === "id"
                    ? "Daftar agenda tugas terstruktur dengan dukungan berkas lampiran dan pengumuman berita penting lintas divisi."
                    : "Actionable todo tasks with multi-attachment support and internal cross-division news broadcasting."}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* System Specs Table */}
              <div className="rounded-xl border border-slate-200 dark:border-zinc-800 overflow-hidden divide-y divide-slate-100 dark:divide-zinc-850">
                <div className="flex justify-between items-center px-4 py-2.5 bg-slate-50/50 dark:bg-zinc-950/40">
                  <span className="text-slate-500 dark:text-zinc-400">{language === "id" ? "Aplikasi" : "Application"}</span>
                  <span className="font-bold text-slate-900 dark:text-white">RockyTen Scoreboard</span>
                </div>
                <div className="flex justify-between items-center px-4 py-2.5">
                  <span className="text-slate-500 dark:text-zinc-400">{language === "id" ? "Versi Rilis" : "Release Version"}</span>
                  <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 font-extrabold text-[11px] border border-blue-200/60 dark:border-blue-900/60">
                    v2.4 (Enterprise)
                  </span>
                </div>
                <div className="flex justify-between items-center px-4 py-2.5 bg-slate-50/50 dark:bg-zinc-950/40">
                  <span className="text-slate-500 dark:text-zinc-400">{language === "id" ? "Mode Database" : "Data Mode"}</span>
                  <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Local-First / Offline Mode
                  </span>
                </div>
                <div className="flex justify-between items-center px-4 py-2.5">
                  <span className="text-slate-500 dark:text-zinc-400">{language === "id" ? "Penyimpanan" : "Storage Engine"}</span>
                  <span className="font-medium text-slate-700 dark:text-zinc-300">Browser LocalStorage</span>
                </div>
                <div className="flex justify-between items-center px-4 py-2.5 bg-slate-50/50 dark:bg-zinc-950/40">
                  <span className="text-slate-500 dark:text-zinc-400">{language === "id" ? "Framework Web" : "Web Framework"}</span>
                  <span className="font-medium text-slate-700 dark:text-zinc-300">Next.js 16 + React 19 (Turbopack)</span>
                </div>
              </div>

              {/* Status Note */}
              <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/50 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-blue-800 dark:text-blue-300 leading-relaxed">
                  {language === "id"
                    ? "Sistem berjalan cepat tanpa hambatan jaringan. Jika ingin mengaktifkan sinkronisasi database cloud Supabase, konfigurasi dapat diatur melalui file .env.local."
                    : "System runs lightning-fast with zero network latency. Cloud database sync can be re-enabled anytime via .env.local."}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40 flex items-center justify-between gap-3">
          <Link
            href="/settings"
            onClick={onClose}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{language === "id" ? "Buka Pengaturan Lengkap" : "Open Full Settings"}</span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            {language === "id" ? "Tutup" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};
