"use client";

import React from "react";
import Image from "next/image";

export default function ExecutiveInsightLoading() {
  return (
    <div className="fixed inset-0 z-[99999] bg-slate-900/40 dark:bg-black/60 backdrop-blur-2xl flex flex-col items-center justify-center p-4 select-none animate-in fade-in duration-200">
      {/* Brand Logo with Breathing Pulse */}
      <div className="relative mb-3 animate-pulse">
        <Image
          src="/gerilya-logo-merah-transparent.svg"
          alt="Nasi Gerilya Logo"
          width={64}
          height={64}
          className="w-14 h-14 sm:w-16 sm:h-16 object-contain filter drop-shadow-sm"
          priority
        />
      </div>

      {/* Minimal Brand Label */}
      <p className="text-[11px] font-extrabold tracking-[0.2em] text-slate-800 dark:text-slate-200 uppercase">
        Nasi Gerilya
      </p>

      {/* Laser Line Progress Bar */}
      <div className="w-40 sm:w-48 h-0.5 bg-slate-200/80 dark:bg-zinc-800/80 rounded-full overflow-hidden mt-3 relative">
        <div className="h-full bg-zinc-900 dark:bg-white rounded-full animate-wave-shine" />
      </div>

      {/* Micro Status Indicator */}
      <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 tracking-wide mt-2">
        Menyinkronkan data...
      </p>
    </div>
  );
}
