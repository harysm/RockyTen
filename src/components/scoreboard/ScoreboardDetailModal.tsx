"use client";

import React, { useEffect } from "react";
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
  // Lock background scroll when modal is open & Close on Escape
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
        className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] relative z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal - Clean without badges above title */}
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

        {/* Target & Accumulation Info Cards: Target, Akumulasi, Dibuat, Divisi */}
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
              <span className="text-[11px] font-extrabold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                Input Harian
              </span>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold">
                Perubahan tersimpan otomatis
              </span>
            </div>

            {/* Grid 7 Kolom atau responsive dengan Nama Hari & Tanggal */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {Array.from({ length: daysCount }).map((_, dayIdx) => {
                const val = dailyValues[dayIdx];
                const hasVal = val !== null && val !== undefined;
                const targetWeek = isSpecial ? 1 : safeSelectedWeek;
                const cellKey = `${metric.id}-${targetWeek}-${dayIdx}`;
                const isJustSaved = !!savedCellKeys[cellKey];
                const isDisabled = !isCurrentWeek || isOwner;
                const dayInfo = getDayDateInfo(
                  metric,
                  targetWeek,
                  dayIdx
                );

                return (
                  <div
                    key={dayIdx}
                    className={`flex flex-col justify-between p-2.5 rounded-2xl border transition-all relative ${
                      isJustSaved
                        ? "bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/20"
                        : hasVal
                          ? "bg-slate-50/90 dark:bg-zinc-900/90 border-slate-200 dark:border-zinc-800"
                          : "bg-white dark:bg-zinc-900/50 border-slate-200/80 dark:border-zinc-800"
                    }`}
                  >
                    <div className="flex items-start justify-between w-full mb-2 px-0.5">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-700 dark:text-zinc-200 leading-tight">
                          {dayInfo.dayShort}
                        </span>
                        <span className="text-[9px] font-semibold text-slate-400 dark:text-zinc-500 leading-tight">
                          {dayInfo.dateStr}
                        </span>
                      </div>
                      {isJustSaved && (
                        <span className="text-emerald-600 dark:text-emerald-400 animate-in zoom-in-75 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </span>
                      )}
                    </div>

                    <input
                      type="number"
                      step="any"
                      disabled={isDisabled}
                      value={hasVal ? val : ""}
                      onChange={(e) => onDailyValueChange(metric.id, targetWeek, dayIdx, e.target.value)}
                      placeholder="-"
                      className={`w-full py-1.5 px-1 rounded-xl text-xs font-black text-center border focus:outline-none transition-all ${
                        isDisabled
                          ? "bg-slate-100/70 dark:bg-zinc-950/60 text-slate-400 dark:text-zinc-600 border-transparent cursor-not-allowed opacity-60"
                          : "bg-slate-100/60 dark:bg-zinc-950/50 text-slate-900 dark:text-white border-slate-200/60 dark:border-zinc-800 focus:bg-white dark:focus:bg-zinc-900 focus:border-red-500 focus:ring-1.5 focus:ring-red-500/20"
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Realization Progress Summary Box */}
          <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-zinc-950/60 border border-slate-200/80 dark:border-zinc-800 flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className="text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-wider block">
                {isSpecial ? "Total Realisasi Durasi" : `Akumulasi Realisasi (Week ${safeSelectedWeek})`}
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-xl font-black ${
                  hasAccumulation
                    ? targetAchieved
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                    : "text-slate-400"
                }`}>
                  {hasAccumulation ? formatUnitValue(currentAccumulationValue, metric.unit) : "-"}
                </span>
                {hasAccumulation && (
                  <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full ${
                    targetAchieved
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900"
                      : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900"
                  }`}>
                    {targetAchieved ? "Target Tercapai" : "Belum Tercapai"}
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-semibold">Target Divisi:</span>
              <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                {metric.target}{metric.unit === "percentage" ? "%" : metric.unit === "currency" ? "rb" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer: Action Buttons */}
        <div className="p-4 sm:px-6 sm:py-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/60 flex items-center justify-between gap-2 flex-wrap">
          {/* Left Management Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => {
                onClose();
                onConvert(metric);
              }}
              title="Konversi Metrik Ke Modul Lain"
              className="px-3 py-1.5 bg-white hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 rounded-xl transition-all text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Konversi</span>
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
                className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 border border-zinc-900 dark:border-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1"
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
    </div>
  );
};
