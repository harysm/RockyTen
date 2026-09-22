"use client";

import React from "react";
import { Metric, Rock } from "@/types";
import { Target, TrendingUp, AlertTriangle } from "lucide-react";

interface ScoreboardSummaryCardsProps {
  activeMetrics: Metric[];
  rocks: Rock[];
  getMetricProgress: (metric: Metric) => {
    statusColor: string;
    statusText: string;
    percentage: number;
    filledWeeks: number;
  };
  language: "id" | "en";
}

export const ScoreboardSummaryCards: React.FC<ScoreboardSummaryCardsProps> = ({
  activeMetrics,
  rocks,
  getMetricProgress,
  language
}) => {
  // Calculate stats
  const totalCount = activeMetrics.length;
  const subMetricCount = activeMetrics.filter((m) => !!m.rockId).length;
  const standaloneCount = totalCount - subMetricCount;

  let achievedCount = 0;
  let runningCount = 0;
  let failedCount = 0;

  activeMetrics.forEach((metric) => {
    const { statusText } = getMetricProgress(metric);
    if (statusText === "Tercapai" || statusText === "Selesai" || statusText === "Completed") {
      achievedCount++;
    } else if (statusText === "Gagal" || statusText === "Gagal Target" || statusText === "Failed Target") {
      failedCount++;
    } else {
      runningCount++;
    }
  });

  const onTrackCount = achievedCount;
  const onTrackPercent = totalCount > 0 ? Math.round((onTrackCount / totalCount) * 100) : 0;
  const needsAttentionCount = failedCount;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {/* Card 1: Total Metrik */}
      <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 p-4 sm:p-5 rounded-xl shadow-xs transition-all hover:border-blue-500/40">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              {language === "id" ? "Metrik Aktif" : "Active Metrics"}
            </p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {totalCount}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
              <span className="text-blue-600 dark:text-blue-400 font-semibold">{subMetricCount} Sub-Rock</span> • {standaloneCount} Mandiri
            </p>
          </div>
          <div className="p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/50 rounded-lg flex-shrink-0">
            <Target className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>

      {/* Card 2: Ketercapaian Target */}
      <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 p-4 sm:p-5 rounded-xl shadow-xs transition-all hover:border-emerald-500/40">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              {language === "id" ? "Ketercapaian Target" : "Target Achievement"}
            </p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {onTrackPercent}%
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">{onTrackCount} Metrik</span> {language === "id" ? "memenuhi target" : "on-track"}
            </p>
          </div>
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/50 rounded-lg flex-shrink-0">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>

      {/* Card 3: Perlu Perhatian */}
      <div className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 p-4 sm:p-5 rounded-xl shadow-xs transition-all hover:border-rose-500/40">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
              {language === "id" ? "Perlu Perhatian" : "Needs Attention"}
            </p>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {needsAttentionCount}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium">
              {failedCount > 0 ? (
                <span className="text-rose-600 dark:text-rose-400 font-bold">{failedCount} Gagal Target</span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Semua target aman</span>
              )}
              {" • "}{runningCount} {language === "id" ? "berjalan" : "running"}
            </p>
          </div>
          <div className={`p-2.5 rounded-lg border flex-shrink-0 ${
            needsAttentionCount > 0
              ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-900/50 animate-pulse"
              : "bg-slate-50 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-zinc-800"
          }`}>
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
