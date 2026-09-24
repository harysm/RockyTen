"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  BookOpen,
  Search,
  Cpu,
  Layers,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { Documentation3DBook } from "@/components/help/Documentation3DBook";
import { UserGuideView } from "@/components/help/UserGuideView";
import { SystemSpecsView } from "@/components/help/SystemSpecsView";

export default function HelpSystemDocsPage() {
  const { language } = useApp();
  const [activeMainTab, setActiveMainTab] = useState<"guide" | "system">("guide");
  const [searchQuery, setSearchQuery] = useState("");

  const isId = language === "id";

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
                ? "Panduan terpadu cara penggunaan aplikasi operasional (SOP) dan spesifikasi arsitektur platform Nasi Gerilya."
                : "Unified operational user guide (SOP) and platform architecture specifications for Nasi Gerilya."}
            </p>
          </div>

          {/* 3D Floating Knowledge Book Illustration */}
          <Documentation3DBook isId={isId} />
        </div>

        {/* Live Search Input */}
        <div className="mt-6 pt-5 border-t border-slate-200/90 dark:border-white/10 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between relative z-10">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeMainTab === "guide"
                  ? isId
                    ? "Cari cara pakai Scoreboard, Rocks, Issues, atau alur L10..."
                    : "Search how to use Scoreboard, Rocks, Issues, or L10 flow..."
                  : isId
                  ? "Cari rumus KPI, skema tabel, akun simulator, atau pintasan..."
                  : "Search KPI formulas, table schema, simulator accounts..."
              }
              className="w-full pl-9 pr-4 py-2 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border border-slate-200/90 dark:border-zinc-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white shadow-xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

          {/* Mode Switcher Pill with Animated Smooth Slide */}
          <div className="relative grid grid-cols-2 p-1 rounded-2xl bg-slate-100/90 dark:bg-zinc-950/90 border border-slate-200/80 dark:border-zinc-800 shadow-2xs w-full sm:w-auto sm:min-w-[420px]">
            {/* Animated Sliding Pill Indicator */}
            <div
              className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-xl bg-blue-600 shadow-md shadow-blue-600/30 ring-1 ring-blue-500/40 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none ${
                activeMainTab === "system" ? "translate-x-full" : "translate-x-0"
              }`}
            />

            <button
              type="button"
              onClick={() => setActiveMainTab("guide")}
              className={`relative z-10 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-colors duration-200 cursor-pointer select-none ${
                activeMainTab === "guide"
                  ? "text-white"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isId ? "Panduan Cara Pakai (SOP)" : "User Manual (SOP)"}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMainTab("system")}
              className={`relative z-10 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition-colors duration-200 cursor-pointer select-none ${
                activeMainTab === "system"
                  ? "text-white"
                  : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>{isId ? "Spesifikasi & Sistem" : "Specs & System"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tab Content Canvas */}
      <div key={activeMainTab} className="animate-tab-fade">
        {activeMainTab === "guide" ? (
          <UserGuideView isId={isId} searchQuery={searchQuery} />
        ) : (
          <SystemSpecsView isId={isId} searchQuery={searchQuery} />
        )}
      </div>
    </div>
  );
}
