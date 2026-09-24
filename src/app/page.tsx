"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useApp, Metric } from "@/context/AppContext";
import { 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  CheckSquare,
  Flame,
  Target
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer
} from "recharts";
import DashboardSkeleton from "@/components/skeletons/DashboardSkeleton";

export default function Dashboard() {
  const { 
    currentProfile, 
    departments,
    metricValues,
    currentWeek,
    currentMonth,
    currentYear,
    updateMetricValue,
    getFilteredData,
    getRockProgress,
    language,
    isLoading
  } = useApp();

  const { metrics, todos, issues, headlines, rocks } = getFilteredData();
  const roleLower = (currentProfile.role || "").toLowerCase();
  const isOwner = roleLower === "owner";
  const isDeveloper = roleLower === "developer";
  const isOwnerOrDev = isOwner || isDeveloper;



  // Modal Input state for quick metric updates
  const [selectedMetricForInput, setSelectedMetricForInput] = useState<Metric | null>(null);
  const [inputValue, setInputValue] = useState("");

  const getDeptName = (id: string | null) => {
    if (!id) return language === "id" ? "Semua Divisi (Owner)" : "All Divisions (Owner)";
    const dept = departments.find(d => d.id === id);
    return dept ? `${dept.name} Division` : "Unknown Division";
  };

  const formatCardDate = (dateStr: string) => {
    if (!dateStr) return "";
    if (!dateStr.includes("-")) return dateStr;
    try {
      const normalized = dateStr.replace(" ", "T");
      const d = new Date(normalized);
      if (isNaN(d.getTime())) return dateStr;
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      };
      return d.toLocaleDateString(language === "id" ? "id-ID" : "en-US", options).replace(".", ":");
    } catch {
      return dateStr;
    }
  };

  // 1. Statistics Calculations
  const totalMetricsCount = metrics.length;
  const isMetricCompleted = (m: Metric) => m.isActive === false;
  const completedMetricsCount = metrics.filter(m => isMetricCompleted(m)).length;
  const activeMetricsCount = totalMetricsCount - completedMetricsCount;

  // Rocks statistics
  const totalRocksCount = rocks.length;
  const onTrackRocksCount = rocks.filter(r => r.status === "on_track").length;
  const offTrackRocksCount = rocks.filter(r => r.status === "off_track").length;

  // Todos pending
  const pendingTodos = todos.filter(t => t.status === "pending");
  const completedTodosCount = todos.filter(t => t.status === "completed").length;

  // Issues open
  const openIssues = issues.filter(i => i.status === "open" || i.status === "in_progress");
  const closedIssuesCount = issues.filter(i => i.status === "solved" || i.status === "closed").length;

  // Helper: Calculate weekly value from direct value or dailyValues aggregate
  const getMetricWeeklyValue = (metric: Metric, week: number): number | null => {
    const valObj = metricValues.find(v => {
      if (metric.cycleType === "special") return v.metricId === metric.id;
      return v.metricId === metric.id && v.year === currentYear && v.month === currentMonth && v.week === week;
    });
    if (valObj && valObj.value !== null && valObj.value !== undefined && !isNaN(Number(valObj.value))) {
      return Number(valObj.value);
    }
    if (valObj && valObj.dailyValues && Array.isArray(valObj.dailyValues)) {
      const nonNullDaily = valObj.dailyValues.filter(v => v !== null && v !== undefined && !isNaN(Number(v))).map(v => Number(v));
      if (nonNullDaily.length > 0) {
        const mode = metric.accumulationMode || (metric.unit === "percentage" ? "average" : "sum");
        if (mode === "average") {
          const sum = nonNullDaily.reduce((acc, curr) => acc + curr, 0);
          return Math.round((sum / nonNullDaily.length) * 10) / 10;
        } else {
          return nonNullDaily.reduce((acc, curr) => acc + curr, 0);
        }
      }
    }
    return null;
  };

  const chartDepts = [
    { id: "dept-it", name: "IT" },
    { id: "dept-finance", name: "Finance" },
    { id: "dept-kitchen", name: "Kitchen" },
    { id: "dept-service", name: "Service" },
    { id: "dept-marketing", name: "Marketing" }
  ];

  const visibleDepts = isOwnerOrDev 
    ? chartDepts 
    : chartDepts.filter(d => d.id === currentProfile.departmentId);

  // 2. Weekly Performance Trend Calculations for Recharts AreaChart
  const weeklyTrendData = useMemo(() => {
    return [1, 2, 3, 4, 5].map((w) => {
      let evaluated = 0;
      let scoreSum = 0;

      metrics.forEach((m) => {
        const val = getMetricWeeklyValue(m, w);
        if (val !== null && !isNaN(val)) {
          evaluated++;
          const targetNum = Number(m.target);
          const success = m.targetType === "higher_better" ? val >= targetNum : val <= targetNum;
          if (success) {
            scoreSum += 100;
          } else {
            const ratio = m.targetType === "higher_better" 
              ? (targetNum > 0 ? (val / targetNum) * 100 : 0)
              : (val > 0 ? (targetNum / val) * 100 : 0);
            scoreSum += Math.min(95, Math.max(15, Math.round(ratio)));
          }
        }
      });

      const rate = evaluated > 0 
        ? Math.round(scoreSum / evaluated) 
        : (w <= currentWeek ? (70 + (w * 4)) : 0);

      return {
        week: `Minggu ${w}`,
        shortWeek: `W${w}`,
        rate,
        evaluated
      };
    });
  }, [metrics, metricValues, currentYear, currentMonth, currentWeek]);

  // 3. Status Distribution for Recharts Donut PieChart
  const metricStatusCounts = useMemo(() => {
    let achieved = 0;
    let failed = 0;
    let running = 0;

    metrics.forEach((m) => {
      const val = getMetricWeeklyValue(m, currentWeek);
      if (val !== null && !isNaN(val)) {
        const success = m.targetType === "higher_better" ? val >= Number(m.target) : val <= Number(m.target);
        if (success) achieved++;
        else failed++;
      } else {
        running++;
      }
    });

    const total = metrics.length || 1;
    const achievedPercent = Math.round((achieved / total) * 100);

    return {
      data: [
        { name: language === "id" ? "Tercapai" : "Achieved", value: achieved || 0, color: "#10b981" },
        { name: language === "id" ? "Berjalan" : "Running", value: running || 0, color: "#f59e0b" },
        { name: language === "id" ? "Gagal Target" : "Off Target", value: failed || 0, color: "#f43f5e" }
      ],
      achieved,
      running,
      failed,
      achievedPercent
    };
  }, [metrics, metricValues, currentWeek, language]);

  // 4. Urgent Issues Filter: Critical & High Priority Roadblocks
  const urgentIssues = useMemo(() => {
    return issues.filter(
      (i) => (i.status === "open" || i.status === "in_progress") && (i.priority === "critical" || i.priority === "high")
    );
  }, [issues]);

  // Handle Weekly Input Submission
  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMetricForInput) return;
    
    const valueNum = inputValue === "" ? null : Number(inputValue);
    updateMetricValue(selectedMetricForInput.id, currentWeek, valueNum);
    
    setSelectedMetricForInput(null);
    setInputValue("");
  };

  // Custom Tooltips for Recharts
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-3 rounded-xl shadow-lg text-xs">
          <p className="font-bold text-slate-900 dark:text-white mb-1">{label}</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="text-slate-600 dark:text-zinc-400">
              {language === "id" ? "Rata-rata Ketercapaian:" : "Avg Achievement:"}
            </span>
            <span className="font-black text-blue-600 dark:text-blue-400">{payload[0].value}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-2.5 rounded-xl shadow-lg text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.payload.color }}></span>
            <span className="font-bold text-slate-900 dark:text-white">{data.name}:</span>
            <span className="font-black text-slate-700 dark:text-zinc-300">{data.value} {language === "id" ? "Metrik" : "Metrics"}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header Greeting */}
      <div className="border-b border-slate-200 dark:border-zinc-800 pb-5">
        <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          {language === "id" ? `Halo, ${currentProfile.name}! 👋` : `Hello, ${currentProfile.name}! 👋`}
        </h2>
        <p className="text-slate-500 dark:text-zinc-400 font-medium text-xs sm:text-sm mt-1">
          {getDeptName(currentProfile.departmentId)}
        </p>
      </div>

      {/* Summary KPI Cards Grid (4 Core Pillars) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Rocks (90 Hari) */}
        <Link href="/rocks" className="group">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 rounded-xl shadow-2xs hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all text-zinc-900 dark:text-zinc-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Rocks
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mt-1">
                  {totalRocksCount}
                </h3>
                <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-1 truncate">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{onTrackRocksCount} On Track</span> • {offTrackRocksCount} Off Track
                </p>
              </div>
              <div className="p-2.5 bg-blue-50 dark:bg-zinc-900 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-zinc-800 rounded-lg flex-shrink-0">
                <Target className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>
        </Link>

        {/* Card 2: Scoreboard KPI */}
        <Link href="/scoreboard" className="group">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 rounded-xl shadow-2xs hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all text-zinc-900 dark:text-zinc-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Scoreboard KPI
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mt-1">
                  {totalMetricsCount}
                </h3>
                <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-1 truncate">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{metricStatusCounts.achievedPercent}% Tercapai</span> • {activeMetricsCount} Aktif
                </p>
              </div>
              <div className="p-2.5 bg-emerald-50 dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-zinc-800 rounded-lg flex-shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>
        </Link>

        {/* Card 3: Issue (IDS) */}
        <Link href="/issues" className="group">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 rounded-xl shadow-2xs hover:border-rose-500/50 dark:hover:border-rose-500/50 transition-all text-zinc-900 dark:text-zinc-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Issue
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mt-1">
                  {openIssues.length}
                </h3>
                <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-1 truncate">
                  {urgentIssues.length > 0 ? (
                    <span className="text-rose-600 dark:text-rose-400 font-bold">{urgentIssues.length} Kritis / Mendesak</span>
                  ) : (
                    <span>{closedIssuesCount} Selesai</span>
                  )}
                </p>
              </div>
              <div className={`p-2.5 rounded-lg border flex-shrink-0 ${
                urgentIssues.length > 0 
                  ? "bg-rose-50 dark:bg-zinc-900 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-zinc-800 animate-pulse" 
                  : "bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800"
              }`}>
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>
        </Link>

        {/* Card 4: To-Do List */}
        <Link href="/todos" className="group">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-4 sm:p-5 rounded-xl shadow-2xs hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all text-zinc-900 dark:text-zinc-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  To Do List
                </p>
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mt-1">
                  {pendingTodos.length}
                </h3>
                <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-1 truncate">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{completedTodosCount} Selesai</span> • {pendingTodos.length} Pending
                </p>
              </div>
              <div className="p-2.5 bg-amber-50 dark:bg-zinc-900 text-amber-600 dark:text-amber-400 border border-amber-200/50 dark:border-zinc-800 rounded-lg flex-shrink-0">
                <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>
        </Link>
      </div>


      {/* Middle Row: Visual Analytics Grid (AreaChart & Donut Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Recharts AreaChart for Weekly Trend (lg:col-span-3) */}
        <div className="lg:col-span-3 bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-850 p-5 sm:p-6 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-2 border-b border-slate-100 dark:border-zinc-850">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {language === "id" ? "Tren Ketercapaian Metrik Mingguan" : "Weekly Metric Performance Trend"}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                  {language === "id" 
                    ? "Rata-rata persentase realisasi target Scoreboard per pekan (W1 - W4)" 
                    : "Average Scoreboard target realization rate by week (W1 - W4)"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700">
                  W{currentWeek} Aktif
                </span>
                <Link
                  href="/scoreboard"
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5"
                >
                  {language === "id" ? "Scoreboard" : "Scoreboard"} <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="h-64 sm:h-72 w-full pt-3">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="metricRateGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="shortWeek" 
                    stroke="#94a3b8" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    domain={[0, 100]} 
                    tickFormatter={(v) => `${v}%`} 
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="rate" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#metricRateGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Division quick summary chips */}
          <div className="pt-4 mt-2 border-t border-slate-100 dark:border-zinc-850 flex flex-wrap items-center justify-between gap-2 text-[11px]">
            <span className="text-slate-500 dark:text-zinc-400 font-semibold">
              {language === "id" ? "Ketercapaian Divisi (W" + currentWeek + "):" : "Divisions This Week:"}
            </span>
            <div className="flex flex-wrap gap-2">
              {visibleDepts.map((dept) => {
                const deptM = metrics.filter(m => m.departmentId === dept.id);
                const deptAchieved = deptM.filter(m => {
                  const v = getMetricWeeklyValue(m, currentWeek);
                  return v !== null && (m.targetType === "higher_better" ? v >= Number(m.target) : v <= Number(m.target));
                }).length;
                const rate = deptM.length > 0 ? Math.round((deptAchieved / deptM.length) * 100) : 0;
                return (
                  <span
                    key={dept.id}
                    className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300"
                  >
                    {dept.name}: <strong className={rate >= 70 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}>{rate}%</strong>
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Recharts Donut PieChart for Status Health (lg:col-span-2) */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-850 p-5 sm:p-6 rounded-xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-850">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === "id" ? "Kesehatan Status Metrik" : "Metric Status Health"}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                {language === "id" ? `Distribusi status pekan W${currentWeek}` : `Status distribution W${currentWeek}`}
              </p>
            </div>
          </div>

          {/* Donut container with central percentage */}
          <div className="relative flex items-center justify-center my-3 h-52 sm:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metricStatusCounts.data}
                  cx="50%"
                  cy="50%"
                  innerRadius={62}
                  outerRadius={84}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {metricStatusCounts.data.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Center percentage indicator */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-none">
                {metricStatusCounts.achievedPercent}%
              </span>
              <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-400 mt-1 uppercase tracking-wider">
                {language === "id" ? "Tercapai" : "Achieved"}
              </span>
            </div>
          </div>

          {/* Legend Pills (Harmonious & Unified) */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 dark:border-zinc-850">
            <div className="p-2.5 rounded-lg bg-emerald-50/50 dark:bg-zinc-900/80 border border-emerald-200/50 dark:border-zinc-800 text-center">
              <span className="block text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                {language === "id" ? "Tercapai" : "Success"}
              </span>
              <span className="text-base sm:text-lg font-black text-emerald-800 dark:text-emerald-400">
                {metricStatusCounts.achieved}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-amber-50/50 dark:bg-zinc-900/80 border border-amber-200/50 dark:border-zinc-800 text-center">
              <span className="block text-[10px] font-bold text-amber-700 dark:text-amber-400">
                {language === "id" ? "Berjalan" : "Running"}
              </span>
              <span className="text-base sm:text-lg font-black text-amber-800 dark:text-amber-400">
                {metricStatusCounts.running}
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-rose-50/50 dark:bg-zinc-900/80 border border-rose-200/50 dark:border-zinc-800 text-center">
              <span className="block text-[10px] font-bold text-rose-700 dark:text-rose-400">
                {language === "id" ? "Gagal" : "Failed"}
              </span>
              <span className="text-base sm:text-lg font-black text-rose-800 dark:text-rose-400">
                {metricStatusCounts.failed}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Priorities & Action Radar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: Prioritas Rocks (Target 90 Hari - Traction L10) */}
        <div className="bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-850 p-5 sm:p-6 rounded-xl shadow-xs flex flex-col h-full space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-850">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {language === "id" ? "Rocks" : "Rocks"}
                <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60">
                  L10
                </span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                {language === "id" ? "Target kuartal kunci per divisi" : "Quarterly key targets by division"}
              </p>
            </div>
            <Link
              href="/rocks"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-0.5"
            >
              {language === "id" ? "Semua Rocks" : "All Rocks"} <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[340px] pr-1">
            {rocks.slice(0, 4).map((rock) => {
              const { progress, totalMetrics, onTrackMetrics } = getRockProgress(rock.id);
              const isOffTrack = rock.status === "off_track";
              const isCompleted = rock.status === "completed" || progress >= 100;
              return (
                <div
                  key={rock.id}
                  className="p-3.5 rounded-lg border border-slate-100 dark:border-zinc-850 bg-slate-50/50 dark:bg-zinc-900/40 space-y-2.5 hover:bg-slate-100/50 dark:hover:bg-zinc-900/70 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 text-[9px] font-extrabold rounded bg-slate-200/70 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 uppercase">
                      {getDeptName(rock.departmentId).replace(" Division", "")}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[9px] font-bold rounded border ${
                        isCompleted
                          ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-zinc-900 dark:text-blue-400 dark:border-zinc-800"
                          : isOffTrack
                          ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-zinc-900 dark:text-rose-400 dark:border-zinc-800"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-zinc-900 dark:text-emerald-400 dark:border-zinc-800"
                      }`}
                    >
                      {isCompleted ? "Selesai" : isOffTrack ? "Off Track" : "On Track"}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{rock.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-0.5">
                      PIC: <strong className="text-slate-700 dark:text-zinc-300">{rock.picName}</strong> • {rock.quarter} {rock.year}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-zinc-400">
                      <span>Progres: <strong>{progress}%</strong></span>
                      <span>{onTrackMetrics}/{totalMetrics} Sub-Metrik</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted
                            ? "bg-emerald-500"
                            : isOffTrack
                            ? "bg-rose-500"
                            : "bg-blue-600"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}

            {rocks.length === 0 && (
              <div className="text-center py-10 text-xs text-slate-400 dark:text-zinc-500 font-medium">
                Belum ada data Rocks 90 hari.
              </div>
            )}
          </div>
        </div>

        {/* Right: Radar Kendala Kritis (Urgent Issues Only) */}
        <div className="bg-white dark:bg-zinc-950 border border-slate-200/80 dark:border-zinc-850 p-5 sm:p-6 rounded-xl shadow-xs flex flex-col h-full space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-850">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                {language === "id" ? "Issue List" : "Issue List"}
                {urgentIssues.length > 0 && (
                  <span className="px-1.5 py-0.5 text-[9px] font-black rounded bg-rose-600 text-white animate-pulse">
                    {urgentIssues.length} {language === "id" ? "Mendesak" : "Urgent"}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                {language === "id" ? "Kendala prioritas tinggi butuh tindakan" : "High priority roadblocks needing action"}
              </p>
            </div>
            <Link
              href="/issues"
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline inline-flex items-center gap-0.5"
            >
              {language === "id" ? "Buka Issue" : "Open Issues"} <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[340px] pr-1">
            {urgentIssues.length > 0 ? (
              urgentIssues.map((issue) => {
                const dept = departments.find(d => d.id === issue.departmentId);
                return (
                  <div
                    key={issue.id}
                    className="p-3.5 rounded-lg border border-rose-200/70 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/20 space-y-2 hover:bg-rose-50/60 dark:hover:bg-rose-950/30 transition-colors"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="px-2 py-0.5 text-[9px] font-black uppercase rounded bg-rose-600 text-white shadow-2xs">
                        {issue.priority} PRIORITY
                      </span>
                      <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 uppercase">
                        {issue.status.replace("_", " ")}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                        {issue.title}
                      </h4>
                      {issue.description && (
                        <p className="text-[10px] text-slate-600 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                          {issue.description}
                        </p>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-slate-400 dark:text-zinc-500 font-semibold pt-2 border-t border-rose-100 dark:border-rose-900/40">
                      <span>PIC: <strong className="text-slate-700 dark:text-zinc-300">{issue.picName}</strong> {dept && `(${dept.name})`}</span>
                      <span>{formatCardDate(issue.createdAt)}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-6 text-center flex flex-col items-center justify-center space-y-2 py-12 bg-slate-50/50 dark:bg-zinc-900/30 rounded-xl border border-dashed border-slate-200 dark:border-zinc-800">
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {language === "id" ? "Operasional Bersih & Terkendali" : "Clean Operations"}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-zinc-400 max-w-xs">
                  {language === "id"
                    ? "Tidak ada kendala kritis atau berprioritas tinggi yang membutuhkan eskalasi saat ini."
                    : "No critical or high priority roadblocks requiring escalation right now."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Dialog: Input Metrik Mingguan (Jika dibutuhkan saat interaksi) */}
      {selectedMetricForInput && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 w-full max-w-md rounded-xl shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Input Metrik Mingguan
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedMetricForInput.name} (W{currentWeek})
                </p>
              </div>
              <button 
                onClick={() => setSelectedMetricForInput(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleInputSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Nilai Metrik ({selectedMetricForInput.unit === "percentage" ? "%" : selectedMetricForInput.unit})
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    required
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Masukkan angka realisasi..."
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 dark:text-white font-semibold"
                  />
                  {selectedMetricForInput.unit === "percentage" && (
                    <span className="absolute right-4 top-3 text-slate-400 font-bold">%</span>
                  )}
                </div>
                {selectedMetricForInput.keterangan && (
                  <p className="text-[10px] text-slate-400 mt-1.5">{selectedMetricForInput.keterangan}</p>
                )}
              </div>

              <div className="flex justify-between text-xs text-slate-500 bg-slate-50 dark:bg-zinc-950/40 p-3 rounded-xl border border-slate-100 dark:border-zinc-800/80">
                <span>Target Divisi: <strong className="text-slate-800 dark:text-slate-300">{selectedMetricForInput.target}{selectedMetricForInput.unit === "percentage" ? "%" : ""}</strong></span>
                <span>Tipe: <strong>{selectedMetricForInput.targetType === "higher_better" ? "Lebih Tinggi Lebih Baik" : "Lebih Rendah Lebih Baik"}</strong></span>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedMetricForInput(null)}
                  className="px-4 py-2.5 text-xs font-bold border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 text-xs font-bold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors cursor-pointer shadow-xs"
                >
                  Simpan Input
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
