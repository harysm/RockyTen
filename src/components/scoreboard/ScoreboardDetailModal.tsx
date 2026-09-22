"use client";

import React, { useState, useEffect } from "react";
import { Metric, Department, Rock } from "@/types";
import {
  X,
  Sparkles,
  Info,
  Edit3,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Check,
  Calendar,
  Layers,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import ConvertTargetForm from "@/components/convert/ConvertTargetForm";

interface ScoreboardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  metric: Metric | null;
  departments: Department[];
  rocks: Rock[];
  selectedWeek: number;
  onSelectWeek: (w: number) => void;
  activeWeek: number;
  getMetricDurationDays: (m: Metric) => number;
  dailyValues: (number | null)[];
  currentAccumulationValue: number | null;
  onDailyValueChange: (metricId: string, week: number, dayIdx: number, valStr: string) => void;
  savedCellKeys: Record<string, boolean>;
  isOwner: boolean;
  canViewAll: boolean;
  language: "id" | "en";
  formatUnitValue: (val: number | null, unit: Metric["unit"]) => string;
  onEdit: (metric: Metric) => void;
  onDelete: (metric: Metric) => void;
  onConvert: (metric: Metric) => void;
  onComplete: (metric: Metric) => void;
}

export const ScoreboardDetailModal: React.FC<ScoreboardDetailModalProps> = ({
  isOpen,
  onClose,
  metric,
  departments,
  rocks,
  selectedWeek,
  onSelectWeek,
  activeWeek,
  getMetricDurationDays,
  dailyValues,
  currentAccumulationValue,
  onDailyValueChange,
  savedCellKeys,
  isOwner,
  canViewAll,
  language,
  formatUnitValue,
  onEdit,
  onDelete,
  onConvert,
  onComplete
}) => {
  const [isConverting, setIsConverting] = useState(false);

  // Reset convert mode whenever modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsConverting(false);
    }
  }, [isOpen]);

  // Lock background scroll when modal is open & Close on Escape
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          if (isConverting) {
            setIsConverting(false);
          } else {
            onClose();
          }
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow || "unset";
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose, isConverting]);

  if (!isOpen || !metric) return null;

  const dept = departments.find((d) => d.id === metric.departmentId);
  const isSpecial = metric.cycleType === "special";
  const daysCount = isSpecial ? getMetricDurationDays(metric) : 7;
  const safeActiveWeek = Math.min(4, Math.max(1, activeWeek));
  const safeSelectedWeek = Math.min(4, Math.max(1, selectedWeek));
  const isCurrentWeek = isSpecial ? true : safeSelectedWeek === safeActiveWeek;
  const isPastWeek = isSpecial ? false : safeSelectedWeek < safeActiveWeek;
  const isFutureWeek = isSpecial ? false : safeSelectedWeek > safeActiveWeek;

  // Target comparison
  const isHigherBetter = metric.targetType === "higher_better";
  const hasAccumulation = currentAccumulationValue !== null;
  const targetAchieved = hasAccumulation
    ? isHigherBetter
      ? currentAccumulationValue >= metric.target
      : currentAccumulationValue <= metric.target
    : false;

  const isAvgMode = metric.accumulationMode === "average";

  const formatDateSimple = (dateStr?: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  // Calculate day name and date dynamically
  const getDayDateInfo = (currentMetric: Metric, weekNum: number, dayIdx: number) => {
    let targetDate: Date;

    if (isSpecial) {
      let anchorDate: Date;
      if (currentMetric.deadline && /^\d{4}-\d{2}-\d{2}/.test(currentMetric.deadline)) {
        const parts = currentMetric.deadline.slice(0, 10).split("-").map(Number);
        const deadlineDate = new Date(parts[0], parts[1] - 1, parts[2]);
        const dur = getMetricDurationDays(currentMetric);
        // Anchor to start date calculated backwards from deadline
        anchorDate = new Date(deadlineDate.getFullYear(), deadlineDate.getMonth(), deadlineDate.getDate() - (dur - 1));
      } else if (currentMetric.createdAt) {
        if (/^\d{4}-\d{2}-\d{2}/.test(currentMetric.createdAt)) {
          const parts = currentMetric.createdAt.slice(0, 10).split("-").map(Number);
          anchorDate = new Date(parts[0], parts[1] - 1, parts[2]);
        } else {
          anchorDate = new Date(currentMetric.createdAt);
        }
      } else {
        anchorDate = new Date();
      }

      if (isNaN(anchorDate.getTime())) anchorDate = new Date();
      targetDate = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), anchorDate.getDate() + dayIdx);
    } else {
      // Monthly metric: Standard Indonesian business work-week starting on Monday (Senin s/d Minggu)
      let year = 2026;
      let month = 7;
      if (currentMetric.createdAt) {
        if (/^\d{4}-\d{2}-\d{2}/.test(currentMetric.createdAt)) {
          const parts = currentMetric.createdAt.slice(0, 10).split("-").map(Number);
          year = parts[0];
          month = parts[1];
        } else {
          const parsed = new Date(currentMetric.createdAt);
          if (!isNaN(parsed.getTime())) {
            year = parsed.getFullYear();
            month = parsed.getMonth() + 1;
          }
        }
      }

      const firstDayOfMonth = new Date(year, month - 1, 1);
      const dow = firstDayOfMonth.getDay(); // 0 is Min, 1 is Sen...
      const mondayOffset = dow === 0 ? -6 : 1 - dow;
      const totalDays = mondayOffset + (weekNum - 1) * 7 + dayIdx;
      targetDate = new Date(year, month - 1, 1 + totalDays);
    }

    const dayNamesId = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const dayNamesEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthNamesId = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const monthNamesEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const isId = language === "id";
    const dayNames = isId ? dayNamesId : dayNamesEn;
    const monthNames = isId ? monthNamesId : monthNamesEn;

    return {
      dayShort: dayNames[targetDate.getDay()],
      dateStr: `${targetDate.getDate()} ${monthNames[targetDate.getMonth()]}`
    };
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
      <div
        className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* STEP 2: FORMULIR KONVERSI (Smooth In-Place Step Slide) */}
        {isConverting ? (
          <div className="flex-1 flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-right-6 duration-200 transform-gpu will-change-transform">
            <ConvertTargetForm
              sourceType="metric"
              sourceItem={{
                id: metric.id,
                title: metric.name,
                description: metric.keterangan,
                departmentId: metric.departmentId,
                picName: metric.picName,
                picId: metric.picId,
                target: metric.target,
                unit: metric.unit,
                createdAt: metric.createdAt,
                deadline: metric.deadline
              }}
              onBack={() => setIsConverting(false)}
              onCancel={onClose}
              onSuccess={() => {
                setIsConverting(false);
                onClose();
              }}
            />
          </div>
        ) : (
          /* STEP 1: DETAIL SCOREBOARD ASAL */
          <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in slide-in-from-left-6 duration-200 transform-gpu will-change-transform">
            {/* Header Modal */}
            <div className="px-6 py-5 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1 flex-1 min-w-0">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-snug">
                    {metric.name}
                  </h3>
                  {metric.keterangan && (
                    <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                      {metric.keterangan}
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition-all text-sm font-bold cursor-pointer shrink-0"
                  aria-label="Tutup"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Target & Accumulation Info Cards */}
            <div className="px-6 py-3.5 bg-slate-50/70 dark:bg-zinc-950/20 border-b border-slate-100 dark:border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target</span>
                <span className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                  {isHigherBetter ? (
                    <ArrowUp className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5]" />
                  ) : (
                    <ArrowDown className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5]" />
                  )}
                  {metric.target}{metric.unit === "percentage" ? "%" : metric.unit === "currency" ? "rb" : ""}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Akumulasi</span>
                <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {isAvgMode ? "Rata-Rata (AVG)" : "Penjumlahan (SUM)"}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Dibuat</span>
                <span className="font-medium text-slate-600 dark:text-zinc-400">
                  {formatDateSimple(metric.createdAt)}
                </span>
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Divisi</span>
                <span className="font-semibold text-slate-800 dark:text-zinc-200 truncate block">
                  {dept?.name || "Semua Divisi"}
                </span>
              </div>
            </div>

            {/* Body Modal (Scrollable) */}
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Week Selector (For Monthly Metrics) */}
              {!isSpecial && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                      Periode Mingguan
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      Minggu Aktif: W{safeActiveWeek}
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 p-1.5 bg-slate-100 dark:bg-zinc-950 rounded-2xl border border-slate-200/80 dark:border-zinc-800">
                    {[1, 2, 3, 4].map((w) => {
                      const isSelected = safeSelectedWeek === w;
                      const isCur = w === safeActiveWeek;
                      const isPast = w < safeActiveWeek;

                      return (
                        <button
                          key={w}
                          type="button"
                          onClick={() => onSelectWeek(w)}
                          className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                            isSelected
                              ? "bg-white dark:bg-zinc-850 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-zinc-700"
                              : "text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
                          }`}
                        >
                          <span className="font-extrabold">Week {w}</span>
                          <span className={`text-[8.5px] uppercase font-bold ${
                            isCur
                              ? "text-emerald-600 dark:text-emerald-400"
                              : isPast
                                ? "text-slate-400"
                                : "text-amber-500"
                          }`}>
                            {isCur ? "Aktif" : isPast ? "Selesai" : "Terkunci"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Alert if not current week */}
              {!isSpecial && !isCurrentWeek && (
                <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-300">
                  <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    {isPastWeek
                      ? "Minggu ini telah selesai. Kolom input dikunci untuk menjaga integritas riwayat data."
                      : "Minggu ini belum dimulai. Input baru akan terbuka otomatis saat jadwal minggu berjalan."}
                  </p>
                </div>
              )}

              {/* Daily Inputs Grid */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-extrabold text-slate-500 dark:text-zinc-400 uppercase tracking-wider block">
                      Input Harian
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                      {isSpecial ? `Durasi Metrik: ${daysCount} Hari` : `Minggu ke-${safeSelectedWeek}`}
                    </span>
                  </div>

                  <span className="text-[10px] font-semibold text-slate-400 dark:text-zinc-500">
                    Perubahan tersimpan otomatis
                  </span>
                </div>

                <div className={`grid gap-2 ${
                  isSpecial
                    ? daysCount > 10
                      ? "grid-cols-4 sm:grid-cols-7"
                      : "grid-cols-3 sm:grid-cols-5 md:grid-cols-7"
                    : "grid-cols-4 sm:grid-cols-7"
                }`}>
                  {Array.from({ length: daysCount }).map((_, idx) => {
                    const rawVal = dailyValues[idx] ?? null;
                    const dateInfo = getDayDateInfo(metric, safeSelectedWeek, idx);
                    const cellKey = `${metric.id}-${isSpecial ? 1 : safeSelectedWeek}-${idx}`;
                    const isSaved = !!savedCellKeys[cellKey];
                    const isDisabled = !isCurrentWeek;

                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-2xl border transition-all text-center flex flex-col justify-between min-h-[82px] ${
                          isDisabled
                            ? "bg-slate-50 dark:bg-zinc-950/60 border-slate-200/60 dark:border-zinc-800/60 opacity-60"
                            : rawVal !== null
                              ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/80 dark:border-blue-900/60 shadow-xs"
                              : "bg-white dark:bg-zinc-900 border-slate-200/80 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700"
                        }`}
                      >
                        <div className="flex flex-col items-center">
                          <span className="text-[11px] font-extrabold text-slate-800 dark:text-zinc-200 leading-tight">
                            {dateInfo.dayShort}
                          </span>
                          <span className="text-[9.5px] font-semibold text-slate-400 dark:text-zinc-500 leading-tight">
                            {dateInfo.dateStr}
                          </span>
                        </div>

                        <div className="mt-1 relative">
                          <input
                            type="number"
                            step="any"
                            disabled={isDisabled}
                            value={rawVal !== null ? rawVal : ""}
                            placeholder="-"
                            onChange={(e) =>
                              onDailyValueChange(
                                metric.id,
                                isSpecial ? 1 : safeSelectedWeek,
                                idx,
                                e.target.value
                              )
                            }
                            className={`w-full py-1 text-center font-black text-xs rounded-lg border transition-all focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                              isDisabled
                                ? "bg-slate-100/70 dark:bg-zinc-900 text-slate-400 border-transparent cursor-not-allowed"
                                : rawVal !== null
                                  ? "bg-white dark:bg-zinc-850 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800 shadow-2xs"
                                  : "bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-white border-slate-200 dark:border-zinc-800"
                            }`}
                          />
                          {isSaved && (
                            <span className="absolute -top-1 -right-1 flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Accumulation Summary Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/70 border border-slate-200/80 dark:border-zinc-800 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">
                    Akumulasi Realisasi ({isSpecial ? "Total Siklus" : `Week ${safeSelectedWeek}`})
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      {formatUnitValue(currentAccumulationValue, metric.unit)}
                    </span>
                    {hasAccumulation && (
                      <span className={`text-[11px] font-bold flex items-center gap-0.5 ${
                        targetAchieved ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
                      }`}>
                        {targetAchieved ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Mencapai Target</span>
                          </>
                        ) : (
                          <>
                            <Info className="w-3.5 h-3.5" />
                            <span>Belum Capai Target</span>
                          </>
                        )}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Target Divisi:
                  </span>
                  <span className="text-sm font-black text-slate-700 dark:text-zinc-300">
                    {formatUnitValue(metric.target, metric.unit)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Modal Action Bar */}
            <div className="px-6 py-4 bg-slate-50/80 dark:bg-zinc-950/40 border-t border-slate-100 dark:border-zinc-800 flex flex-wrap justify-between items-center gap-3">
              {/* Left Actions: Konversi, Edit, Hapus */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsConverting(true)}
                  title="Konversi Metrik Ke Modul Lain"
                  className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60 rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Konversi Modul</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onEdit(metric);
                  }}
                  title="Edit Metrik"
                  className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900/60 rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onDelete(metric);
                  }}
                  title="Hapus Metrik"
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/60 rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>

              {/* Right Complete & Close Actions */}
              <div className="flex items-center gap-2">
                {canViewAll && metric.isActive && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onComplete(metric);
                    }}
                    className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 border border-zinc-900 dark:border-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Selesai</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
