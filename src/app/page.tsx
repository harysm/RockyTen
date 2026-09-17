"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp, Metric, Todo, Issue } from "@/context/AppContext";
import { 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Clock, 
  Play, 
  Plus, 
  ChevronRight,
  TrendingDown,
  Activity,
  ThumbsUp,
  FileText,
  AlertOctagon,
  HelpCircle,
  CheckSquare,
  Newspaper,
  Check,
  Target
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
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
    updateTodoStatus,
    getFilteredData,
    getRockProgress,
    getHealthScore,
    language,
    isLoading
  } = useApp();

  const { metrics, todos, issues, headlines, historyLogs, rocks } = getFilteredData();
  const healthData = getHealthScore(null);
  const roleLower = (currentProfile.role || "").toLowerCase();
  const isOwner = roleLower === "owner";
  const isDeveloper = roleLower === "developer";
  const isOwnerOrDev = isOwner || isDeveloper;

  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    };
    setFormattedDate(today.toLocaleDateString(language === "id" ? "id-ID" : "en-US", options));
  }, [language]);

  // Modal Input state
  const [selectedMetricForInput, setSelectedMetricForInput] = useState<Metric | null>(null);
  const [inputValue, setInputValue] = useState("");

  const getDeptName = (id: string | null) => {
    if (!id) return "Semua Divisi (Owner)";
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
    } catch (e) {
      return dateStr;
    }
  };

  const formatLogDate = (dateStr: string) => {
    if (!dateStr) return "";
    if (dateStr.includes(",")) {
      return dateStr.replace(", ", " - Pukul ");
    }
    try {
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        const day = d.getDate();
        const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
        const month = months[d.getMonth()];
        const year = d.getFullYear();
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        return `${day} ${month} ${year} - Pukul ${hours}.${minutes}`;
      }
    } catch (e) {}
    return dateStr;
  };

  // 1. Statistics Calculations
  const totalMetricsCount = metrics.length;

  const isMetricCompleted = (m: Metric) => {
    return m.isActive === false;
  };
  
  const completedMetricsCount = metrics.filter(m => isMetricCompleted(m)).length;
  const activeMetricsCount = totalMetricsCount - completedMetricsCount;

  // Metrics that need to be filled this week (Week 3) but are empty
  const pendingWeekMetrics = metrics.filter(m => {
    const v = metricValues.find(val => {
      if (m.cycleType === "special") return val.metricId === m.id;
      return val.metricId === m.id && val.year === currentYear && val.month === currentMonth && val.week === currentWeek;
    });
    return !v || v.value === null;
  });

  const pendingWeekCount = pendingWeekMetrics.length;

  // Rocks statistics
  const totalRocksCount = rocks.length;
  const onTrackRocksCount = rocks.filter(r => r.status === "on_track").length;
  const offTrackRocksCount = rocks.filter(r => r.status === "off_track").length;
  const completedRocksCount = rocks.filter(r => r.status === "completed").length;

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

  // 1. Weekly Performance Trend Calculations per Division (Count ONLY completed metrics)
  const getDeptPoints = (deptId: string): number[] => {
    const deptMetrics = metrics.filter(m => m.departmentId === deptId);
    const completedCount = deptMetrics.filter(m => isMetricCompleted(m)).length;
    return [completedCount, completedCount, completedCount, completedCount];
  };

  const chartDepts = [
    { id: "dept-it", name: "IT", color: "#a1a1aa", strokeClass: "stroke-zinc-400", fillClass: "fill-zinc-400", bgClass: "bg-zinc-500/10", borderClass: "border-zinc-500/20", textClass: "text-zinc-400" },
    { id: "dept-finance", name: "Finance", color: "#71717a", strokeClass: "stroke-zinc-500", fillClass: "fill-zinc-500", bgClass: "bg-zinc-500/10", borderClass: "border-zinc-500/20", textClass: "text-zinc-500" },
    { id: "dept-kitchen", name: "Kitchen", color: "#d4d4d8", strokeClass: "stroke-zinc-300", fillClass: "fill-zinc-300", bgClass: "bg-zinc-500/10", borderClass: "border-zinc-500/20", textClass: "text-zinc-300" },
    { id: "dept-service", name: "Service", color: "#e4e4e7", strokeClass: "stroke-zinc-200", fillClass: "fill-zinc-200", bgClass: "bg-zinc-500/10", borderClass: "border-zinc-500/20", textClass: "text-zinc-200" },
    { id: "dept-marketing", name: "Marketing", color: "#f4f4f5", strokeClass: "stroke-zinc-100", fillClass: "fill-zinc-100", bgClass: "bg-zinc-500/10", borderClass: "border-zinc-500/20", textClass: "text-zinc-100" }
  ];

  const visibleDepts = isOwnerOrDev 
    ? chartDepts 
    : chartDepts.filter(d => d.id === currentProfile.departmentId);

  const maxMetricsInDepts = Math.max(...chartDepts.map(d => metrics.filter(m => m.departmentId === d.id).length), 5);

  const getChartY = (count: number) => {
    return 160 - (count / maxMetricsInDepts) * 130;
  };

  const getDynamicSummary = () => {
    const sortedDepts = [...visibleDepts].map(d => {
      const success = getDeptPoints(d.id)[currentWeek - 1] ?? 0;
      const total = metrics.filter(m => m.departmentId === d.id).length;
      return { ...d, success, total };
    }).sort((a, b) => b.success - a.success);

    const leader = sortedDepts[0] || { name: "IT", success: 0, total: 0 };
    const second = sortedDepts[1] || { name: "Kitchen", success: 0, total: 0 };
    const totalSuccess = visibleDepts.reduce((acc, d) => acc + (getDeptPoints(d.id)[currentWeek - 1] ?? 0), 0);
    const myDeptId = currentProfile.departmentId || "";
    
    if (language === "id") {
      if (isOwnerOrDev) {
        return `Divisi ${leader.name} memimpin penyelesaian metrik dengan ${leader.success}/${leader.total} metrik selesai, diikuti oleh ${second.name} dengan ${second.success}/${second.total} metrik selesai. Total metrik selesai: ${totalSuccess} metrik.`;
      } else {
        const myDept = chartDepts.find(d => d.id === myDeptId);
        const mySuccess = getDeptPoints(myDeptId)[currentWeek - 1] ?? 0;
        const myTotal = metrics.filter(m => m.departmentId === myDeptId).length;
        return `Divisi Anda (${myDept?.name}) telah berhasil menyelesaikan ${mySuccess}/${myTotal} metrik.`;
      }
    } else {
      if (isOwnerOrDev) {
        return `${leader.name} division leads metric completion with ${leader.success}/${leader.total} metrics completed, followed by ${second.name} with ${second.success}/${second.total} metrics completed. Total metrics completed: ${totalSuccess} metrics.`;
      } else {
        const myDept = chartDepts.find(d => d.id === myDeptId);
        const mySuccess = getDeptPoints(myDeptId)[currentWeek - 1] ?? 0;
        const myTotal = metrics.filter(m => m.departmentId === myDeptId).length;
        return `Your division (${myDept?.name}) has successfully completed ${mySuccess}/${myTotal} metrics.`;
      }
    }
  };

  // Weekly Performance Trend Calculations (Rate of metrics meeting targets) for PIC's division
  const getPicWeeklyTrend = () => {
    const deptId = currentProfile.departmentId || "";
    return [1, 2, 3, 4].map(w => {
      let totalFilled = 0;
      let achieved = 0;
      
      const deptMetrics = metrics.filter(m => m.departmentId === deptId);
      deptMetrics.forEach(metric => {
        const val = getMetricWeeklyValue(metric, w);
        if (val !== null && !isNaN(val)) {
          totalFilled++;
          const targetNum = Number(metric.target);
          const success = metric.targetType === "higher_better"
            ? val >= targetNum
            : val <= targetNum;
          if (success) achieved++;
        }
      });
      
      const successRate = totalFilled > 0 ? Math.round((achieved / totalFilled) * 100) : 0;
      return {
        week: `Week ${w}`,
        shortWeek: `W${w}`,
        successRate,
        totalFilled,
        achieved
      };
    });
  };

  const picTrendData = getPicWeeklyTrend();
  const getPicChartY = (rate: number) => {
    return 160 - (rate / 100) * 130;
  };
  const picY1 = getPicChartY(picTrendData[0].successRate);
  const picY2 = getPicChartY(picTrendData[1].successRate);
  const picY3 = getPicChartY(picTrendData[2].successRate);
  const picY4 = getPicChartY(picTrendData[3].successRate);

  const getPicLinePath = () => {
    if (currentWeek === 1) return `M 50 ${picY1}`;
    if (currentWeek === 2) return `M 50 ${picY1} C 100 ${picY1}, 100 ${picY2}, 150 ${picY2}`;
    if (currentWeek === 3) return `M 50 ${picY1} C 100 ${picY1}, 100 ${picY2}, 150 ${picY2} C 200 ${picY2}, 200 ${picY3}, 250 ${picY3}`;
    return `M 50 ${picY1} C 100 ${picY1}, 100 ${picY2}, 150 ${picY2} C 200 ${picY2}, 200 ${picY3}, 250 ${picY3} C 300 ${picY3}, 300 ${picY4}, 350 ${picY4}`;
  };

  const getPicAreaPath = () => {
    if (currentWeek === 1) return `M 50 160 L 50 ${picY1} L 50 160 Z`;
    if (currentWeek === 2) return `M 50 160 L 50 ${picY1} C 100 ${picY1}, 100 ${picY2}, 150 ${picY2} L 150 160 Z`;
    if (currentWeek === 3) return `M 50 160 L 50 ${picY1} C 100 ${picY1}, 100 ${picY2}, 150 ${picY2} C 200 ${picY2}, 200 ${picY3}, 250 ${picY3} L 250 160 Z`;
    return `M 50 160 L 50 ${picY1} C 100 ${picY1}, 100 ${picY2}, 150 ${picY2} C 200 ${picY2}, 200 ${picY3}, 250 ${picY3} C 300 ${picY3}, 300 ${picY4}, 350 ${picY4} L 350 160 Z`;
  };

  // Handle Weekly Input Submission
  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMetricForInput) return;
    
    const valueNum = inputValue === "" ? null : Number(inputValue);
    updateMetricValue(selectedMetricForInput.id, currentWeek, valueNum);
    
    setSelectedMetricForInput(null);
    setInputValue("");
  };

  const openInputModal = (metric: Metric) => {
    setSelectedMetricForInput(metric);
    const existingVal = metricValues.find(
      v => v.metricId === metric.id && v.year === currentYear && v.month === currentMonth && v.week === currentWeek
    );
    setInputValue(existingVal?.value !== null && existingVal?.value !== undefined ? String(existingVal.value) : "");
  };

  // Helper formatting for status display in weekly input
  const getMetricStatus = (metric: Metric) => {
    const val = metricValues.find(
      v => v.metricId === metric.id && v.year === currentYear && v.month === currentMonth && v.week === currentWeek
    );
    if (!val || val.value === null) {
      return { text: "Belum Diisi", color: "text-red-500 font-semibold" };
    }
    
    // Check if achieved target
    const isSuccess = metric.targetType === "higher_better" 
      ? val.value >= metric.target 
      : val.value <= metric.target;

    const unitStr = metric.unit === "percentage" ? "%" : metric.unit === "currency" ? "rb" : "";
    return {
      text: `${val.value}${unitStr} (${isSuccess ? "Achieved" : "Under Target"})`,
      color: isSuccess ? "text-emerald-500 font-semibold" : "text-amber-500 font-semibold"
    };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-rose-500";
      case "high": return "bg-red-500";
      case "medium": return "bg-amber-500";
      default: return "bg-slate-400";
    }
  };

  const getPriorityBadgeClass = (p: string) => {
    switch (p) {
      case "critical": return "badge-status-gagal";
      case "high": return "badge-status-gagal";
      case "medium": return "badge-status-berjalan";
      default: return "badge-glass";
    }
  };

  const getHeadlineIcon = (cat: string) => {
    switch (cat) {
      case "good_news": return "🎉";
      case "bad_news": return "⚠️";
      case "reminder": return "📌";
      case "announcement": return "📢";
      default: return "🏆";
    }
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            {language === "id" ? `Halo, ${currentProfile.name}! 👋` : `Hello, ${currentProfile.name}! 👋`}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            {getDeptName(currentProfile.departmentId)}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {formattedDate || (language === "id" ? "Sabtu, 18 Juli 2026" : "Saturday, 18 July 2026")}
          </span>
        </div>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Card 1: Rocks (90 Hari) */}
        <Link href="/rocks" className="group">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3.5 sm:p-5 rounded-xl shadow-xs hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all relative overflow-hidden text-zinc-900 dark:text-zinc-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Rocks (90 Hari)</p>
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mt-1 sm:mt-1.5">{totalRocksCount}</h3>
                <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 sm:mt-1 truncate">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{onTrackRocksCount} On Track</span> • {offTrackRocksCount} Off Track
                </p>
              </div>
              <div className="p-2 sm:p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/50 rounded-lg flex-shrink-0">
                <Target className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>
        </Link>

        {/* Card 2: Scoreboard */}
        <Link href="/scoreboard" className="group">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3.5 sm:p-5 rounded-xl shadow-xs hover:border-zinc-400 dark:hover:border-zinc-600 transition-all relative overflow-hidden text-zinc-900 dark:text-zinc-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Scoreboard</p>
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mt-1 sm:mt-1.5">{totalMetricsCount}</h3>
                <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 sm:mt-1 truncate">
                  {activeMetricsCount} Aktif • {completedMetricsCount} Selesai
                </p>
              </div>
              <div className="p-2 sm:p-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-lg flex-shrink-0">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>
        </Link>

        {/* Card 3: Todo */}
        <Link href="/todos" className="group">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3.5 sm:p-5 rounded-xl shadow-xs hover:border-zinc-400 dark:hover:border-zinc-600 transition-all relative overflow-hidden text-zinc-900 dark:text-zinc-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">To Do List</p>
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mt-1 sm:mt-1.5">{pendingTodos.length}</h3>
                <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 sm:mt-1 truncate">
                  {completedTodosCount} Selesai
                </p>
              </div>
              <div className="p-2 sm:p-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-lg flex-shrink-0">
                <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>
        </Link>

        {/* Card 4: Issues */}
        <Link href="/issues" className="group">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3.5 sm:p-5 rounded-xl shadow-xs hover:border-zinc-400 dark:hover:border-zinc-600 transition-all relative overflow-hidden text-zinc-900 dark:text-zinc-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Issue (IDS)</p>
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mt-1 sm:mt-1.5">{openIssues.length}</h3>
                <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 sm:mt-1 truncate">
                  {closedIssuesCount} Selesai
                </p>
              </div>
              <div className="p-2 sm:p-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-lg flex-shrink-0">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>
        </Link>

        {/* Card 5: Headlines */}
        <Link href="/headlines" className="group col-span-2 sm:col-span-1">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-3.5 sm:p-5 rounded-xl shadow-xs hover:border-zinc-400 dark:hover:border-zinc-600 transition-all relative overflow-hidden text-zinc-900 dark:text-zinc-100">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[10px] sm:text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Headline</p>
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-white mt-1 sm:mt-1.5">{headlines.length}</h3>
                <p className="text-[10px] sm:text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 sm:mt-1 truncate">
                  {headlines.length > 0 ? `${headlines.length} Berita` : "0 Baru"}
                </p>
              </div>
              <div className="p-2 sm:p-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-lg flex-shrink-0">
                <Newspaper className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Rocks (90-Day Priorities) Traction L10 Highlight */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/50">
              <Target className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                Prioritas Rocks (Target Kuartalan 90 Hari)
                <span className="px-2 py-0.5 text-[9px] font-bold rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/50">
                  Traction L10
                </span>
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Progres pencapaian dihitung otomatis dari sub-metrik Scoreboard terkait
              </p>
            </div>
          </div>
          <Link
            href="/rocks"
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
          >
            Kelola Semua Rocks <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {rocks.slice(0, 3).map(rock => {
            const { progress, totalMetrics, onTrackMetrics } = getRockProgress(rock.id);
            return (
              <div
                key={rock.id}
                className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 space-y-2.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 uppercase">
                    {getDeptName(rock.departmentId)}
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[9px] font-bold rounded-full ${
                      rock.status === "on_track"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800"
                        : rock.status === "off_track"
                        ? "bg-rose-50 text-rose-700 border border-rose-300 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800"
                        : "bg-blue-50 text-blue-700 border border-blue-300 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800"
                    }`}
                  >
                    {rock.status === "on_track" ? "🟢 On Track" : rock.status === "off_track" ? "🔴 Off Track" : "🔵 Selesai"}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">{rock.title}</h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                    PIC: <strong className="text-zinc-700 dark:text-zinc-300">{rock.picName}</strong> • {rock.quarter} {rock.year}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px] text-zinc-500 dark:text-zinc-400">
                    <span>Progres: {progress}%</span>
                    <span>{onTrackMetrics}/{totalMetrics} Sub-Metrik</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        rock.status === "completed" || progress >= 90
                          ? "bg-emerald-500"
                          : rock.status === "off_track"
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
        </div>
      </div>

      {/* Main Widgets Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isOwnerOrDev ? (
          <>
            {/* Owner: Widget 1: Scoreboard / Division Performance List */}
            <div className="bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850 p-6 sm:p-7 rounded-[24px] shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  📊 {language === "id" ? "Ketercapaian Metrik per Divisi" : "Metric Achievement per Division"}
                </h3>
                <Link href="/scoreboard" className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:underline flex items-center gap-0.5 transition-colors">
                  {language === "id" ? "Detail" : "Details"} <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              
              <p className="text-[10px] text-slate-400 dark:text-zinc-500 font-semibold mb-6">
                {language === "id" 
                  ? "Jumlah metrik yang telah diselesaikan per divisi" 
                  : "Number of completed metrics per division"}
              </p>

              <div className="flex-grow flex flex-col justify-between space-y-6">
                {/* Executive Horizontal Progress List */}
                <div className="space-y-5 sm:space-y-6 my-auto py-1">
                  {visibleDepts.map((dept) => {
                    const points = getDeptPoints(dept.id);
                    const currentCount = points[currentWeek - 1] ?? 0;
                    const deptMetrics = metrics.filter(m => m.departmentId === dept.id);
                    const totalCount = deptMetrics.length;
                    const percentage = totalCount > 0 ? Math.round((currentCount / totalCount) * 100) : 0;

                    return (
                      <div key={dept.id} className="space-y-2.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="px-2.5 py-0.5 text-[9px] font-extrabold rounded-full uppercase badge-glass">
                            {dept.name}
                          </span>
                          <div className="flex items-center gap-2.5">
                            <span className="text-[11px] font-bold text-slate-900 dark:text-white">
                              {currentCount}/{totalCount}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-zinc-400 w-10 text-right">
                              {percentage}%
                            </span>
                          </div>
                        </div>

                        {/* Smooth Progress Track */}
                        <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-zinc-900 dark:bg-white transition-all duration-500 shadow-xs"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Dynamic Analysis Box */}
                <div className="mt-6 p-4 bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800/80 rounded-2xl text-[10.5px] text-slate-600 dark:text-zinc-300 leading-relaxed font-semibold">
                  💡 <strong>{language === "id" ? "Analisis Performa:" : "Performance Analysis:"}</strong>{" "}
                  {getDynamicSummary()}
                </div>
              </div>
            </div>

            {/* Owner: Widget 3: Headlines */}
            <div className="bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850 p-6 rounded-[24px] shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    📰 Headlines
                  </h3>
                </div>
                <Link href="/headlines" className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors flex items-center gap-0.5">
                  Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Dynamic Headline Count Banner */}
              <div className="mb-4 p-3 bg-slate-50 dark:bg-zinc-900/80 border border-slate-200/60 dark:border-zinc-800 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Headline Hari Ini</p>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400">Pengumuman & kabar terkini tim</p>
                </div>
                {(() => {
                  const totalHeadlines = headlines.length;
                  const todayStr = new Date().toISOString().split("T")[0];
                  const todayCount = headlines.filter(h => {
                    if (!h.createdAt) return false;
                    return h.createdAt.includes(todayStr) || h.createdAt.toLowerCase().includes("hari ini");
                  }).length;

                  const labelText = todayCount > 0 ? `+${todayCount} Hari Ini` : `${totalHeadlines} Total`;

                  return (
                    <span className="px-2.5 py-1 tab-active-glass text-xs font-extrabold rounded-lg">
                      {labelText}
                    </span>
                  );
                })()}
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px] pr-1">
                {headlines.slice(0, 3).map((hl) => (
                  <div key={hl.id} className="p-3.5 bg-slate-50 dark:bg-zinc-900/50 border border-slate-100/60 dark:border-zinc-800/80 rounded-xl hover:bg-slate-100/55 dark:hover:bg-zinc-850 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-full border badge-glass flex items-center gap-1`}>
                        <span>{getHeadlineIcon(hl.category)}</span>
                        {hl.category.replace("_", " ")}
                      </span>

                      {(() => {
                        const scope = hl.departmentId ? getDeptName(hl.departmentId).replace(" Division", "").toUpperCase() : "GLOBAL";
                        return (
                          <span className="px-2 py-0.5 text-[9px] font-extrabold rounded-full uppercase badge-glass">
                            {scope}
                          </span>
                        );
                      })()}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {hl.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {hl.content}
                    </p>
                    <div className="flex justify-between items-center text-[9px] text-slate-400 dark:text-zinc-500 font-semibold mt-2.5 pt-1.5 border-t border-slate-200/50 dark:border-zinc-800/60">
                      <span>Oleh: {hl.authorName}</span>
                      <span>{formatCardDate(hl.createdAt)}</span>
                    </div>
                  </div>
                ))}
                
                {headlines.length === 0 && (
                  <div className="text-center py-12 text-xs text-slate-400 dark:text-zinc-500 font-medium">
                    Belum ada headline terbaru.
                  </div>
                )}
              </div>
            </div>

            {/* Owner: Widget 4: Issue Terbuka */}
            <div className="col-span-1 md:col-span-2 bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  ⚠️ Issue Terbuka
                </h3>
                <Link href="/issues" className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors flex items-center gap-0.5">
                  Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px] pr-1">
                {openIssues.slice(0, 3).map((issue) => {
                  const dept = departments.find(d => d.id === issue.departmentId);
                  return (
                    <div key={issue.id} className="p-4 bg-slate-50 border border-slate-100/60 rounded-xl hover:bg-slate-100/55 transition-colors space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`px-1.5 py-0.5 text-[8px] font-extrabold uppercase rounded border ${getPriorityBadgeClass(issue.priority)}`}>
                          {issue.priority} Priority
                        </span>
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[8px] font-bold uppercase rounded">
                          {issue.status.replace("_", " ")}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {issue.title}
                        </h4>
                        {issue.description && (
                          <p className="text-[10px] text-slate-500 mt-1 line-clamp-1 leading-relaxed">
                            {issue.description}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-between items-center text-[9px] text-slate-400 font-semibold pt-1 border-t border-slate-100/60">
                        <span>PIC: {issue.picName} {isOwnerOrDev && `(${dept?.name})`}</span>
                        <span>{formatCardDate(issue.createdAt)}</span>
                      </div>
                    </div>
                  );
                })}
                
                {openIssues.length === 0 && (
                  <div className="text-center py-12 text-xs text-slate-400 font-medium">
                    Bagus! Tidak ada issue terbuka saat ini.
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* PIC Dashboard Layout (Standard 2x2 Grid) */}
            {/* PIC: Widget 1: Scoreboard Terbaru (List of Division Metrics) */}
            <div className="bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  📊 {language === "id" ? "Scoreboard Terbaru" : "Latest Scoreboard"}
                </h3>
                <Link href="/scoreboard" className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors flex items-center gap-0.5">
                  {language === "id" ? "Buka Scoreboard" : "Open Scoreboard"} <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px] pr-1">
                {metrics
                  .filter(m => m.departmentId === (currentProfile.departmentId || ""))
                  .map((metric) => {
                    const valObj = metricValues.find(
                      v => v.metricId === metric.id && v.year === currentYear && v.month === currentMonth && v.week === currentWeek
                    );
                    const isFilled = valObj && valObj.value !== null && valObj.value !== undefined;
                    const value = isFilled ? valObj.value : null;

                    let status: "achieved" | "failed" | "running" | "not_started" = "running";
                    if (isFilled && value !== null) {
                      const success = metric.targetType === "higher_better"
                        ? value >= metric.target
                        : value <= metric.target;
                      status = success ? "achieved" : "failed";
                    } else {
                      if (currentWeek > 4) {
                        status = "not_started";
                      } else {
                        status = "running";
                      }
                    }

                    const getStatusBadge = (s: typeof status) => {
                       switch (s) {
                         case "achieved":
                           return (
                             <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider">
                               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                               {language === "id" ? "Tercapai" : "Achieved"}
                             </span>
                           );
                         case "failed":
                           return (
                             <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200/60 rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider">
                               <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                               {language === "id" ? "Gagal Target" : "Gagal Target"}
                             </span>
                           );
                         case "running":
                           return (
                             <span className="inline-flex items-center gap-1.5 bg-amber-55/40 text-amber-700 border border-amber-200/60 rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider">
                               <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                               {language === "id" ? "Berjalan" : "Berjalan"}
                             </span>
                           );
                         default:
                           return (
                             <span className="inline-flex items-center gap-1.5 bg-slate-50/75 text-slate-650 border border-slate-200/80 rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider">
                               <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                               {language === "id" ? "Belum Mulai" : "Belum Mulai"}
                             </span>
                           );
                       }
                     };

                    return (
                      <div 
                        key={metric.id}
                        onClick={() => openInputModal(metric)}
                        className="p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-slate-100/40 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-zinc-400 transition-colors leading-snug truncate">
                            {metric.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500 font-semibold">
                            <span>Target: {metric.target}{metric.unit === "percentage" ? "%" : ` ${metric.unit}`}</span>
                            <span>•</span>
                            <span>
                              {language === "id" ? "Realisasi: " : "Actual: "} 
                              <strong className={isFilled ? "text-slate-800 font-extrabold" : "text-slate-450 font-semibold"}>
                                {isFilled ? `${value}${metric.unit === "percentage" ? "%" : ` ${metric.unit}`}` : (language === "id" ? "Belum Diisi" : "Not Filled")}
                              </strong>
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          {getStatusBadge(status)}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* PIC: Widget 2: Todo List */}
            <div className="bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  ✅ Todo List
                </h3>
                <Link href="/todos" className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors flex items-center gap-0.5">
                  Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px] pr-1">
                {pendingTodos.slice(0, 3).map((todo) => {
                  return (
                    <div 
                      key={todo.id} 
                      className="p-4 bg-slate-50/50 border border-slate-100/60 rounded-xl hover:bg-slate-100/40 transition-colors flex items-start gap-3"
                    >
                      <button
                        type="button"
                        disabled={todo.status === "cancel"}
                        onClick={() => updateTodoStatus(todo.id, todo.status === "completed" ? "pending" : "completed")}
                        className={`custom-todo-checkbox ${todo.status === "completed" ? "checked" : ""} ${todo.status === "cancel" ? "opacity-40 cursor-not-allowed" : ""}`}
                        title={todo.status === "completed" ? "Tandai Belum Selesai" : "Tandai Selesai"}
                      >
                        {todo.status === "completed" && <Check className="w-3.5 h-3.5" />}
                      </button>
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`px-1.5 py-0.5 text-[8px] font-extrabold uppercase rounded border ${getPriorityBadgeClass(todo.priority)}`}>
                            {todo.priority} Priority
                          </span>
                          <span className="text-[9px] font-bold text-slate-400">
                            {todo.deadline.split("-")[2]} {["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"][parseInt(todo.deadline.split("-")[1]) - 1]}
                          </span>
                        </div>
                        <h4 className={`text-xs font-bold text-slate-900 leading-snug truncate ${todo.status === "completed" ? "line-through text-slate-450" : ""}`}>
                          {todo.title}
                        </h4>
                        {todo.description && (
                          <p className="text-[10px] text-slate-500 line-clamp-1 leading-relaxed">
                            {todo.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {pendingTodos.length === 0 && (
                  <div className="text-center py-12 text-xs text-slate-400 font-medium">
                    Tidak ada tugas hari ini.
                  </div>
                )}
              </div>
            </div>

            {/* PIC: Widget 3: Headlines */}
            <div className="bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850 p-6 rounded-[24px] shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  📰 Headlines
                </h3>
                <Link href="/headlines" className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors flex items-center gap-0.5">
                  Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Dynamic Headline Count Banner */}
              <div className="mb-4 p-3 bg-slate-50 dark:bg-zinc-900/80 border border-slate-200/60 dark:border-zinc-800 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Headline Hari Ini</p>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400">Pengumuman & kabar terkini tim</p>
                </div>
                {(() => {
                  const totalHeadlines = headlines.length;
                  const todayStr = new Date().toISOString().split("T")[0];
                  const todayCount = headlines.filter(h => {
                    if (!h.createdAt) return false;
                    return h.createdAt.includes(todayStr) || h.createdAt.toLowerCase().includes("hari ini");
                  }).length;

                  const labelText = todayCount > 0 ? `+${todayCount} Hari Ini` : `${totalHeadlines} Total`;

                  return (
                    <span className="px-2.5 py-1 tab-active-glass text-xs font-extrabold rounded-lg">
                      {labelText}
                    </span>
                  );
                })()}
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px] pr-1">
                {headlines.slice(0, 3).map((hl) => (
                  <div key={hl.id} className="p-3.5 bg-slate-50 dark:bg-zinc-900/50 border border-slate-100/60 dark:border-zinc-800/80 rounded-xl hover:bg-slate-100/55 dark:hover:bg-zinc-850 transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-full border badge-glass flex items-center gap-1`}>
                        <span>{getHeadlineIcon(hl.category)}</span>
                        {hl.category.replace("_", " ")}
                      </span>

                      {(() => {
                        const scope = hl.departmentId ? getDeptName(hl.departmentId).replace(" Division", "").toUpperCase() : "GLOBAL";
                        
                        return (
                          <span className="px-2.5 py-0.5 text-[9px] font-extrabold rounded-full uppercase badge-glass shadow-2xs">
                            {scope}
                          </span>
                        );
                      })()}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {hl.title}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                      {hl.content}
                    </p>
                    <div className="flex justify-between items-center text-[9px] text-slate-400 dark:text-zinc-500 font-semibold mt-2.5 pt-1.5 border-t border-slate-200/50 dark:border-zinc-800/60">
                      <span>Oleh: {hl.authorName}</span>
                      <span>{formatCardDate(hl.createdAt)}</span>
                    </div>
                  </div>
                ))}
                
                {headlines.length === 0 && (
                  <div className="text-center py-12 text-xs text-slate-400 dark:text-zinc-500 font-medium">
                    Belum ada headline terbaru.
                  </div>
                )}
              </div>
            </div>

            {/* PIC: Widget 4: Issue Terbuka */}
            <div className="bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  ⚠️ Issue Terbuka
                </h3>
                <Link href="/issues" className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors flex items-center gap-0.5">
                  Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px] pr-1">
                {openIssues.slice(0, 3).map((issue) => {
                  const dept = departments.find(d => d.id === issue.departmentId);
                  return (
                    <div key={issue.id} className="p-4 bg-slate-50 border border-slate-100/60 rounded-xl hover:bg-slate-100/55 transition-colors space-y-2">
                      <div className="flex justify-between items-center">
                        <span className={`px-1.5 py-0.5 text-[8px] font-extrabold uppercase rounded border ${getPriorityBadgeClass(issue.priority)}`}>
                          {issue.priority} Priority
                        </span>
                        <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 text-[8px] font-bold uppercase rounded">
                          {issue.status.replace("_", " ")}
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {issue.title}
                        </h4>
                        {issue.description && (
                          <p className="text-[10px] text-slate-500 mt-1 line-clamp-1 leading-relaxed">
                            {issue.description}
                          </p>
                        )}
                      </div>
                      <div className="flex justify-between items-center text-[9px] text-slate-400 font-semibold pt-1 border-t border-slate-100/60">
                        <span>PIC: {issue.picName} {isOwnerOrDev && `(${dept?.name})`}</span>
                        <span>{formatCardDate(issue.createdAt)}</span>
                      </div>
                    </div>
                  );
                })}
                
                {openIssues.length === 0 && (
                  <div className="text-center py-12 text-xs text-slate-400 font-medium">
                    Bagus! Tidak ada issue terbuka saat ini.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Row: Aktivitas Terakhir */}
      <div className="bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
            Aktivitas Terakhir
          </h3>
          <Link href="/history" className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors flex items-center gap-0.5">
            Lihat Semua <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="space-y-4">
          {historyLogs.slice(0, 3).map((log) => (
            <div key={log.id} className="flex justify-between items-center text-xs pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-bold">{formatLogDate(log.createdAt)}</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">
                  {log.profileName === currentProfile.name ? "Anda" : log.profileName} {log.details.replace("Anda ", "")}
                </span>
              </div>
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 font-semibold rounded-md">
                {log.action}
              </span>
            </div>
          ))}
          {historyLogs.length === 0 && (
            <div className="text-center py-4 text-xs text-slate-400 font-medium">Belum ada catatan aktivitas.</div>
          )}
        </div>
      </div>

      {/* Modal Dialog: Input Metrik Mingguan */}
      {selectedMetricForInput && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 overflow-hidden animate-in zoom-in-95 duration-150">
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
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
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
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-slate-900 dark:text-white font-semibold"
                  />
                  {selectedMetricForInput.unit === "percentage" && (
                    <span className="absolute right-4 top-3 text-slate-400 font-bold">%</span>
                  )}
                </div>
                {selectedMetricForInput.keterangan && (
                  <p className="text-[10px] text-slate-400 mt-1.5">{selectedMetricForInput.keterangan}</p>
                )}
              </div>

              <div className="flex justify-between text-xs text-slate-500 bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
                <span>Target Divisi: <strong className="text-slate-800 dark:text-slate-300">{selectedMetricForInput.target}{selectedMetricForInput.unit === "percentage" ? "%" : ""}</strong></span>
                <span>Tipe: <strong>{selectedMetricForInput.targetType === "higher_better" ? "Lebih Tinggi Lebih Baik" : "Lebih Rendah Lebih Baik"}</strong></span>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedMetricForInput(null)}
                  className="px-4 py-2.5 text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 text-xs font-bold bg-red-600 text-white rounded-xl hover:bg-red-500 transition-colors"
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
