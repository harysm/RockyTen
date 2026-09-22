"use client";

import React, { useState } from "react";
import { Wrench, ShieldCheck, Zap, Database, Clock, Lock, ArrowRight, Sparkles } from "lucide-react";

export const MaintenanceScreen: React.FC<{ onBypass?: () => void }> = ({ onBypass }) => {
  const [showSecretInput, setShowSecretInput] = useState(false);
  const [secretPass, setSecretPass] = useState("");
  const [passError, setPassError] = useState(false);

  const handleBypassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretPass.trim() === "gerilya123" || secretPass.trim() === "owner123" || secretPass.trim() === "123456") {
      if (typeof window !== "undefined") {
        localStorage.setItem("maintenance_bypass", "true");
      }
      if (onBypass) onBypass();
      window.location.reload();
    } else {
      setPassError(true);
    }
  };

  return (
    <div className="min-h-screen w-full bg-zinc-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6 md:p-10 relative overflow-hidden font-sans selection:bg-red-500 selection:text-white">
      {/* Background Ambient Glowing Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-amber-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container Card */}
      <div className="max-w-2xl w-full bg-zinc-900/80 border border-zinc-800 backdrop-blur-2xl rounded-2xl p-6 sm:p-10 shadow-2xl relative z-10 space-y-8 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Header Badge & Brand */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-extrabold uppercase tracking-widest shadow-lg shadow-red-500/10">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <Wrench className="w-3.5 h-3.5 text-red-400" />
            <span>PEMELIHARAAN SISTEM BERJALAN</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Nasi Gerilya Command Center
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 font-medium max-w-lg mx-auto leading-relaxed">
              Kami sedang melakukan <span className="text-slate-200 font-bold">pemeliharaan rutin & optimasi kinerja mendalam</span> malam ini untuk memastikan sistem Scoreboard 100% cepat, akurat, dan aman.
            </p>
          </div>
        </div>

        {/* Live Status Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white">Egress Bandwidth</h4>
              <p className="text-[11px] text-zinc-400">Optimasi query selective & penyeragaman batas data.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white">Kompresi Database</h4>
              <p className="text-[11px] text-zinc-400">WebP Engine aktif (98.5% efisiensi kapasitas ruang).</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white">Hak Akses & Role</h4>
              <p className="text-[11px] text-zinc-400">Audit menyeluruh tombol aksi PIC vs Owner/Dev.</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-white">Audit 5-Pass Bug</h4>
              <p className="text-[11px] text-zinc-400">Pembersihan bug & verifikasi performa jaringan.</p>
            </div>
          </div>
        </div>

        {/* Estimated Completion Timer Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/30 via-zinc-900 to-zinc-950 border border-red-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <div className="text-xs font-bold text-white">Target Penyelesaian</div>
              <div className="text-[11px] text-zinc-400">Malam Ini (05 Agustus 2026)</div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-lg bg-red-500/20 text-red-300 text-[10px] font-extrabold uppercase tracking-wider border border-red-500/30">
            Sistem Akan Segera Kembali Online
          </span>
        </div>

        {/* Secret Developer Bypass Trigger */}
        <div className="pt-2 text-center border-t border-zinc-800/80">
          {!showSecretInput ? (
            <button
              onClick={() => setShowSecretInput(true)}
              className="text-[11px] font-medium text-zinc-500 hover:text-zinc-300 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3 h-3" /> Login Bypass Khas Dev / Owner
            </button>
          ) : (
            <form onSubmit={handleBypassSubmit} className="max-w-xs mx-auto space-y-2 animate-in fade-in duration-200">
              <div className="flex gap-2">
                <input
                  type="password"
                  value={secretPass}
                  onChange={(e) => {
                    setSecretPass(e.target.value);
                    setPassError(false);
                  }}
                  placeholder="Password Bypass (Owner/Dev)"
                  className="flex-1 px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 transition-all"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {passError && <div className="text-[10px] text-rose-500 font-bold">Password bypass salah!</div>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
