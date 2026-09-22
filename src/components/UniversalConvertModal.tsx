"use client";

import React, { useEffect } from "react";
import {
  ArrowRight,
  ArrowDown,
  Building2,
  User,
  Paperclip,
  X,
  FileText,
  Sparkles
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import ConvertTargetForm, {
  ConvertSourceType,
  ConvertTargetType,
  UniversalConvertItem
} from "@/components/convert/ConvertTargetForm";

export type { ConvertSourceType, ConvertTargetType, UniversalConvertItem };

interface UniversalConvertModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceType: ConvertSourceType;
  sourceItem: UniversalConvertItem | null;
}

const getSourceTypeName = (type: ConvertSourceType): string => {
  switch (type) {
    case "metric": return "Scoreboard KPI";
    case "todo": return "Agenda Todo";
    case "issue": return "Masalah Issue";
    case "headline": return "Berita Headline";
    default: return "Item";
  }
};

const getSourceBadgeColor = (type: ConvertSourceType): string => {
  switch (type) {
    case "metric": return "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    case "todo": return "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    case "issue": return "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800";
    case "headline": return "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800";
    default: return "bg-slate-50 text-slate-700 border-slate-200";
  }
};

export default function UniversalConvertModal({
  isOpen,
  onClose,
  sourceType,
  sourceItem
}: UniversalConvertModalProps) {
  const { departments } = useApp();

  // Escape key handler & scroll lock
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow || "unset";
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen || !sourceItem) return null;

  const getDeptName = (deptId?: string | null) => {
    if (!deptId || deptId === "global") return "Semua Divisi";
    const d = departments.find(item => item.id === deptId);
    return d ? d.name : "Divisi Terkait";
  };

  return (
    <div
      className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto overscroll-contain animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-6xl transition-all duration-300 ease-out flex flex-col lg:flex-row items-center justify-center gap-3 sm:gap-4">
        {/* Left Card: Source Item Details (Read-only Reference) */}
        <div
          className="w-full lg:w-[480px] shrink-0 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Active Reference Banner */}
          <div className="px-5 py-2.5 bg-blue-50 dark:bg-blue-950/60 border-b border-blue-100 dark:border-blue-900/60 flex items-center justify-between text-xs text-blue-700 dark:text-blue-300">
            <div className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>Data Sumber Asal (Referensi)</span>
            </div>
            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border ${getSourceBadgeColor(sourceType)}`}>
              {getSourceTypeName(sourceType)}
            </span>
          </div>

          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40 flex items-start justify-between">
            <div className="space-y-1 flex-1 min-w-0 pr-2">
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
                Judul Item
              </span>
              <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                {sourceItem.title}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition-all text-xs font-bold cursor-pointer shrink-0"
              title="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
            {/* Meta tags (Division, PIC, Priority) */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-200/70 dark:border-zinc-800">
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 block mb-0.5 uppercase">
                  Divisi
                </span>
                <span className="font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1 truncate">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{getDeptName(sourceItem.departmentId)}</span>
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 block mb-0.5 uppercase">
                  PIC
                </span>
                <span className="font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-1 truncate">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{sourceItem.picName || "-"}</span>
                </span>
              </div>

              {sourceItem.priority && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 block mb-0.5 uppercase">
                    Prioritas
                  </span>
                  <span className="font-extrabold capitalize text-slate-800 dark:text-zinc-200">
                    {sourceItem.priority}
                  </span>
                </div>
              )}

              {sourceItem.category && (
                <div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 block mb-0.5 uppercase">
                    Kategori
                  </span>
                  <span className="font-extrabold capitalize text-slate-800 dark:text-zinc-200">
                    {sourceItem.category.replace("_", " ")}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">
                Deskripsi / Keterangan Asli
              </span>
              <div className="p-3.5 bg-slate-50 dark:bg-zinc-950 rounded-2xl border border-slate-200/70 dark:border-zinc-800 text-xs text-slate-700 dark:text-zinc-300 leading-relaxed font-medium whitespace-pre-wrap max-h-48 overflow-y-auto">
                {sourceItem.description || sourceItem.content || "(Tidak ada catatan deskripsi tambahan)"}
              </div>
            </div>

            {/* Attachments */}
            {sourceItem.attachments && sourceItem.attachments.length > 0 && (
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block mb-1">
                  Lampiran ({sourceItem.attachments.length})
                </span>
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {sourceItem.attachments.map((att, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-zinc-950 rounded-xl border border-slate-200/70 dark:border-zinc-800 text-xs truncate"
                    >
                      <Paperclip className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-medium text-slate-700 dark:text-zinc-300">{att.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="px-6 py-3 bg-slate-50/70 dark:bg-zinc-950/40 border-t border-slate-100 dark:border-zinc-800 text-[11px] text-slate-500 dark:text-zinc-400 flex items-center justify-between">
            <span>Data sumber dijadikan referensi konversi</span>
            <button
              type="button"
              onClick={onClose}
              className="font-bold text-slate-700 dark:text-zinc-300 hover:underline cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>

        {/* Middle Connector Arrow */}
        <div className="hidden lg:flex flex-col items-center justify-center shrink-0 z-20 animate-in zoom-in-75 fade-in duration-300">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center border-2 border-white dark:border-zinc-900 animate-pulse">
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 mt-1 uppercase tracking-wider">
            Konversi
          </span>
        </div>

        {/* Mobile Connector Bar */}
        <div className="flex lg:hidden items-center justify-center py-1 text-blue-600 dark:text-blue-400 font-bold text-xs gap-1.5 animate-in fade-in duration-200">
          <ArrowDown className="w-4 h-4" />
          <span>Konversi Ke Modul Baru</span>
        </div>

        {/* Right Card: Convert Target Form */}
        <div
          className="w-full lg:w-[500px] shrink-0 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative z-10 animate-in fade-in slide-in-from-right-8 duration-300 ring-2 ring-blue-500/20"
          onClick={(e) => e.stopPropagation()}
        >
          <ConvertTargetForm
            sourceType={sourceType}
            sourceItem={sourceItem}
            onCancel={onClose}
            onSuccess={onClose}
          />
        </div>
      </div>
    </div>
  );
}
