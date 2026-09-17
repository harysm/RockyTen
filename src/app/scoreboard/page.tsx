"use client";

import React, { useState } from "react";
import { useApp, Metric, Profile } from "@/context/AppContext";
import {
  Plus,
  HelpCircle,
  ChevronRight,
  FileText,
  Edit3,
  Trash2,
  User,
  Filter,
  Download,
  Calendar,
  CheckSquare,
  AlertOctagon,
  Sparkles,
  Award,
  Flame,
  CheckCircle2,
  Clock,
  Zap,
  TrendingUp,
  TrendingDown,
  Loader2,
  LineChart,
  ArrowUp,
  ArrowDown,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  RefreshCw
} from "lucide-react";
import CustomSelect from "@/components/CustomSelect";
import UniversalConvertModal, { UniversalConvertItem } from "@/components/UniversalConvertModal";
import ScoreboardSkeleton from "@/components/skeletons/ScoreboardSkeleton";

export default function ScoreboardPage() {
  const {
    currentProfile,
    departments,
    allProfiles,
    metricValues,
    currentYear,
    currentMonth,
    currentWeek,
    addMetric,
    editMetric,
    deleteMetric,
    updateMetricDailyValues,
    getMetricActiveWeek,
    getFilteredData,
    language,
    completeMetric,
    reactivateMetric,
    showToast,
    showConfirm,
    isLoading
  } = useApp();

  const { metrics, rocks } = getFilteredData();

  const getDeptName = (id: string | null) => {
    if (!id) return "Owner / Management";
    const dept = departments.find(d => d.id === id);
    return dept ? `${dept.name} Division` : "Unknown Division";
  };

  // Owner Division Filter
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>("all");

  // Rock Sub-Metric vs Standalone Filter ("all" | "submetric" | "standalone")
  const [rockFilter, setRockFilter] = useState<"all" | "submetric" | "standalone">("all");

  // Selected Week Tab for Daily Input Table
  const [selectedWeekTab, setSelectedWeekTab] = useState<number>(currentWeek);

  // Scoreboard Tab Selection ("monthly" | "special")
  const [scoreboardTab, setScoreboardTab] = useState<"monthly" | "special">("monthly");

  // History Cycle Filter Selection ("all" | "monthly" | "special")
  const [historyCycleFilter, setHistoryCycleFilter] = useState<"all" | "monthly" | "special">("all");

  // Modal Add Metric state
  const [isAddMetricOpen, setIsAddMetricOpen] = useState(false);
  const [newMetricName, setNewMetricName] = useState("");
  const [newMetricRockId, setNewMetricRockId] = useState<string>("");
  const [newMetricTarget, setNewMetricTarget] = useState("");
  const [newMetricUnit, setNewMetricUnit] = useState<Metric["unit"]>("number");
  const [newMetricTargetType, setNewMetricTargetType] = useState<Metric["targetType"]>("higher_better");
  const [newMetricDept, setNewMetricDept] = useState("");
  const [newMetricPic, setNewMetricPic] = useState("");
  const [newMetricKeterangan, setNewMetricKeterangan] = useState("");
  const [newMetricCycleType, setNewMetricCycleType] = useState<"monthly" | "special">("monthly");
  const [newMetricDurationDays, setNewMetricDurationDays] = useState<number>(3);
  const [newMetricDeadline, setNewMetricDeadline] = useState("");
  const [newMetricAccumulationMode, setNewMetricAccumulationMode] = useState<"sum" | "average">("sum");

  // Universal Convert state
  const [convertItem, setConvertItem] = useState<UniversalConvertItem | null>(null);

  // Modal Edit Metric state
  const [editingMetric, setEditingMetric] = useState<Metric | null>(null);
  const [editMetricName, setEditMetricName] = useState("");
  const [editMetricRockId, setEditMetricRockId] = useState<string>("");
  const [editMetricTarget, setEditMetricTarget] = useState("");
  const [editMetricUnit, setEditMetricUnit] = useState<Metric["unit"]>("number");
  const [editMetricTargetType, setEditMetricTargetType] = useState<Metric["targetType"]>("higher_better");
  const [editMetricDept, setEditMetricDept] = useState("");
  const [editMetricKeterangan, setEditMetricKeterangan] = useState("");
  const [editMetricAccumulationMode, setEditMetricAccumulationMode] = useState<"sum" | "average">("sum");
  const [editMetricCycleType, setEditMetricCycleType] = useState<"monthly" | "special">("monthly");
  const [editMetricDurationDays, setEditMetricDurationDays] = useState<number>(7);
  const [editMetricDeadline, setEditMetricDeadline] = useState("");
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  const getDaysBetween = (date1Str: string, date2Str: string) => {
    if (!date1Str || !date2Str) return 0;
    const d1 = new Date(date1Str.split("T")[0]);
    const d2 = new Date(date2Str.split("T")[0]);
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getMetricDurationDays = (m: Metric) => {
    if (m.cycleType !== "special") return 7;
    if (m.deadline) {
      const startStr = (m.createdAt || (m as any).created_at || "").split("T")[0];
      const endStr = m.deadline.split("T")[0];
      if (startStr && endStr) {
        const computed = getDaysBetween(startStr, endStr);
        if (computed > 0) return Math.max(computed, m.durationDays || 0);
      }
    }
    return m.durationDays || 7;
  };

  const handleOpenEditMetric = (m: Metric) => {
    setEditingMetric(m);
    setEditMetricName(m.name);
    setEditMetricRockId(m.rockId || "");
    setEditMetricTarget(m.target.toString());
    setEditMetricUnit(m.unit === "boolean" ? "number" : m.unit);
    setEditMetricTargetType(m.targetType || "higher_better");
    setEditMetricDept(m.departmentId);
    setEditMetricKeterangan(m.keterangan || "");
    setEditMetricAccumulationMode(m.accumulationMode || (m.unit === "percentage" ? "average" : "sum"));
    setEditMetricCycleType(m.cycleType || "monthly");
    setEditMetricDurationDays(getMetricDurationDays(m));
    setEditMetricDeadline(m.deadline || "");
  };

  const handleSaveEditMetric = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMetric || isSubmittingEdit) return;
    if (!editMetricName.trim()) {
      showToast("⚠️ Harap isi nama metrik terlebih dahulu.", "warning");
      return;
    }

    try {
      setIsSubmittingEdit(true);
      const targetDept = editMetricDept || currentProfile.departmentId || departments[0]?.id || "dept-kitchen";
      const selectedPic = allProfiles.find(p => p.departmentId === targetDept && p.role === "pic")
        || allProfiles.find(p => p.departmentId === targetDept)
        || currentProfile;

      const startDate = (editingMetric.createdAt || (editingMetric as any).created_at || new Date().toISOString()).split("T")[0];
      const computedDuration = editMetricCycleType === "special" && editMetricDeadline
        ? getDaysBetween(startDate, editMetricDeadline)
        : (editingMetric.durationDays || 7);
      const finalDurationDays = computedDuration > 0 ? computedDuration : editMetricDurationDays;

      await editMetric(editingMetric.id, {
        name: editMetricName.trim(),
        rockId: editMetricRockId ? editMetricRockId : null,
        target: Number(editMetricTarget) || 0,
        unit: editMetricUnit,
        targetType: editMetricTargetType,
        picId: selectedPic.id,
        picName: selectedPic.name,
        departmentId: targetDept,
        keterangan: editMetricKeterangan.trim(),
        cycleType: editMetricCycleType,
        accumulationMode: editMetricAccumulationMode,
        durationDays: editMetricCycleType === "special" ? finalDurationDays : 7,
        deadline: editMetricCycleType === "special" ? (editMetricDeadline || undefined) : undefined
      });

      setEditingMetric(null);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const formatDateSimple = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" };
      return d.toLocaleDateString("id-ID", options);
    } catch (e) {
      return dateStr;
    }
  };

  // Helper: Get value for metric, year, month, week
  const getWeeklyValueObj = (metricId: string, week: number) => {
    const metric = activeMetrics.find(m => m.id === metricId) || metrics.find(m => m.id === metricId);
    return metricValues.find(v => {
      if (metric?.cycleType === "special") {
        return v.metricId === metricId;
      }
      return v.metricId === metricId && v.year === currentYear && v.month === currentMonth && v.week === week;
    });
  };

  const getWeeklyValue = (metricId: string, week: number) => {
    const valObj = getWeeklyValueObj(metricId, week);
    return valObj?.value ?? null;
  };

  // Helper to determine if a metric is finished / completed (hanya jika diselesaikan secara manual oleh Owner/Dev)
  const isMetricCompleted = (metric: Metric) => {
    return metric.isActive === false;
  };

  // Filter metrics based on role, selected dropdown (for owner), and scoreboard tab
  const roleLower = (currentProfile.role || "").toLowerCase();
  const isOwner = roleLower === "owner";
  const isDeveloper = roleLower === "developer";
  const canViewAll = isOwner || isDeveloper;

  // Active metrics for top tables and daily input table
  const activeMetrics = metrics.filter(m => {
    const cycle = m.cycleType || "monthly";
    if (cycle !== scoreboardTab) return false;
    if (isMetricCompleted(m)) return false;

    // Filter by Rock hierarchy
    if (rockFilter === "submetric" && !m.rockId) return false;
    if (rockFilter === "standalone" && m.rockId) return false;

    if (canViewAll) {
      return selectedDeptFilter === "all" ? true : m.departmentId === selectedDeptFilter;
    }
    return true; // PIC is already filtered by getFilteredData()
  });

  // Sorting State
  const [sortBy, setSortBy] = useState<string>("dept");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sortedActiveMetrics = [...activeMetrics].sort((a, b) => {
    let res = 0;
    if (sortBy === "dept") {
      const deptA = departments.find(d => d.id === a.departmentId)?.name || "";
      const deptB = departments.find(d => d.id === b.departmentId)?.name || "";
      res = deptA.localeCompare(deptB);
    } else if (sortBy === "target") {
      res = (a.target || 0) - (b.target || 0);
    } else if (sortBy === "name") {
      res = (a.name || "").localeCompare(b.name || "");
    }
    return sortOrder === "asc" ? res : -res;
  });

  // Completed / Expired metrics for bottom history table
  const completedMetrics = metrics.filter(m => {
    if (!isMetricCompleted(m)) return false;
    if (historyCycleFilter !== "all" && (m.cycleType || "monthly") !== historyCycleFilter) return false;

    if (canViewAll) {
      return selectedDeptFilter === "all" ? true : m.departmentId === selectedDeptFilter;
    }
    return true;
  });

  const getMetricProgress = (metric: Metric) => {
    if (!metric.isActive) {
      return {
        statusColor: "bg-emerald-500",
        statusText: language === "id" ? "Selesai" : "Completed",
        percentage: 100,
        filledWeeks: 1
      };
    }

    if (metric.cycleType === "special") {
      const valObj = getWeeklyValueObj(metric.id, 1);
      const hasValue = valObj && valObj.value !== null;
      const value = hasValue ? valObj.value : null;

      let statusColor = "bg-slate-300 dark:bg-zinc-800";
      let statusText = "Belum Mulai";
      let percentage = 0;

      if (hasValue && value !== null) {
        const success = metric.targetType === "higher_better"
          ? value >= metric.target
          : value <= metric.target;
        if (success) {
          statusColor = "bg-emerald-500";
          statusText = "Tercapai";
          percentage = 100;
        } else {
          statusColor = "bg-rose-500";
          statusText = "Gagal";
          percentage = 0;
        }
      }
      return { statusColor, statusText, percentage, filledWeeks: hasValue ? 1 : 0 };
    }

    let filledWeeks = 0;
    let achievedWeeks = 0;

    for (let w = 1; w <= 4; w++) {
      const val = getWeeklyValue(metric.id, w);
      if (val !== null) {
        filledWeeks++;
        const success = metric.targetType === "higher_better"
          ? val >= metric.target
          : val <= metric.target;
        if (success) achievedWeeks++;
      }
    }

    // Status logic:
    // - filledWeeks === 0: Belum Mulai
    // - filledWeeks 1..3: Berjalan (tetap Berjalan selama belum 4 minggu penuh)
    // - filledWeeks === 4: Evaluasi akhir -> Tercapai atau Gagal
    let statusColor = "bg-slate-300 dark:bg-slate-700";
    let statusText = "Belum Mulai";

    if (filledWeeks > 0 && filledWeeks < 4) {
      statusColor = "bg-amber-500";
      statusText = "Berjalan";
    } else if (filledWeeks === 4) {
      if (achievedWeeks >= 3) {
        statusColor = "bg-emerald-500";
        statusText = "Tercapai";
      } else {
        statusColor = "bg-rose-500";
        statusText = "Gagal";
      }
    }

    const percentage = filledWeeks > 0 ? Math.round((achievedWeeks / filledWeeks) * 100) : 0;

    return { statusColor, statusText, percentage, filledWeeks };
  };

  const getMetricWeekDateRange = (metric: Metric, weekNum: number) => {
    const createdDate = new Date(metric.createdAt);
    const start = new Date(createdDate.getTime());
    start.setDate(createdDate.getDate() + (weekNum - 1) * 7);

    const end = new Date(start.getTime());
    end.setDate(start.getDate() + 6);

    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return `${start.toLocaleDateString('id-ID', options)} - ${end.toLocaleDateString('id-ID', options)}`;
  };
  const handleCellClick = (metric: Metric, week: number) => {
    setSelectedWeekTab(week);
  };

  // Saved cell animation state for auto-save feedback
  const [savedCellKeys, setSavedCellKeys] = useState<Record<string, boolean>>({});

  const handleDailyValChange = (metricId: string, week: number, dayIdx: number, valStr: string) => {
    const metric = activeMetrics.find(m => m.id === metricId) || metrics.find(m => m.id === metricId);
    const targetWeek = metric?.cycleType === "special" ? 1 : week;
    const valObj = getWeeklyValueObj(metricId, targetWeek);
    const daysCount = metric ? getMetricDurationDays(metric) : 7;
    const currentDaily = valObj?.dailyValues && Array.isArray(valObj.dailyValues)
      ? [...valObj.dailyValues]
      : Array(daysCount).fill(null);

    while (currentDaily.length < daysCount) {
      currentDaily.push(null);
    }

    currentDaily[dayIdx] = valStr.trim() === "" ? null : Number(valStr);
    updateMetricDailyValues(metricId, targetWeek, currentDaily);

    // Trigger visual auto-save feedback (1.8 seconds)
    const cellKey = `${metricId}-${targetWeek}-${dayIdx}`;
    setSavedCellKeys(prev => ({ ...prev, [cellKey]: true }));
    setTimeout(() => {
      setSavedCellKeys(prev => {
        const next = { ...prev };
        delete next[cellKey];
        return next;
      });
    }, 1800);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddMetricSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && !navigator.onLine) {
      showToast("Koneksi terputus! Mohon periksa internet Anda sebelum menyimpan.", "error");
      return;
    }
    setIsSubmitting(true);

    try {
      const targetDeptId = canViewAll
        ? (newMetricDept || departments[0]?.id || "dept-kitchen")
        : (currentProfile.departmentId || departments[0]?.id || "dept-kitchen");

      const selectedPicProfile = canViewAll
        ? (allProfiles.find(p => p.departmentId === targetDeptId && p.role === "pic") || allProfiles.find(p => p.departmentId === targetDeptId) || currentProfile)
        : currentProfile;

      await addMetric({
        departmentId: targetDeptId,
        rockId: newMetricRockId ? newMetricRockId : null,
        name: newMetricName,
        target: Number(newMetricTarget),
        unit: newMetricUnit,
        targetType: newMetricTargetType,
        accumulationMode: newMetricAccumulationMode,
        picId: selectedPicProfile.id,
        picName: selectedPicProfile.name,
        keterangan: newMetricKeterangan,
        cycleType: newMetricCycleType,
        durationDays: newMetricCycleType === "special" ? newMetricDurationDays : 7,
        deadline: newMetricCycleType === "special" ? newMetricDeadline : undefined
      });

      // Reset Form
      setIsAddMetricOpen(false);
      setNewMetricName("");
      setNewMetricRockId("");
      setNewMetricTarget("");
      setNewMetricUnit("number");
      setNewMetricTargetType("higher_better");
      setNewMetricAccumulationMode("sum");
      setNewMetricPic("");
      setNewMetricDept("");
      setNewMetricKeterangan("");
      setNewMetricCycleType("monthly");
      setNewMetricDurationDays(3);
      setNewMetricDeadline("");
    } catch (err) {
      showToast("Gagal menyimpan metrik. Silakan coba lagi.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };



  const formatUnitValue = (val: number | null, unit: Metric["unit"]) => {
    if (val === null) return "-";
    if (unit === "percentage") return `${val}%`;
    if (unit === "currency") return `Rp ${val}rb`;
    if (unit === "boolean") return val === 1 ? "YA" : "TIDAK";
    return val;
  };

  const renderAccumulatedValue = (metric: Metric, valuesList: (number | null)[]) => {
    const filled = valuesList.filter(v => v !== null) as number[];
    if (filled.length === 0) {
      return <span className="text-xs text-slate-400 font-bold">-</span>;
    }

    const sum = filled.reduce((acc, curr) => acc + curr, 0);
    const avg = Math.round((sum / filled.length) * 10) / 10;
    const mode = metric.accumulationMode || (metric.unit === "percentage" ? "average" : "sum");
    const isAvgMode = mode === "average";

    if (metric.unit === "number") {
      return (
        <div className="flex flex-col items-center justify-center leading-tight">
          <span className="text-xs font-extrabold text-slate-900 dark:text-white">
            {isAvgMode ? `Avg: ${avg}` : `Tot: ${sum}`}
          </span>
          <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400">
            {isAvgMode ? `Tot: ${sum}` : `Avg: ${avg}`}
          </span>
        </div>
      );
    }

    if (metric.unit === "percentage") {
      return (
        <span className="text-xs font-extrabold text-slate-900 dark:text-white">
          {avg}%
        </span>
      );
    }

    if (metric.unit === "currency") {
      return (
        <div className="flex flex-col items-center justify-center leading-tight">
          <span className="text-xs font-extrabold text-slate-900 dark:text-white">
            {isAvgMode ? `Avg: Rp ${avg}rb` : `Rp ${sum}rb`}
          </span>
          <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400">
            {isAvgMode ? `Tot: Rp ${sum}rb` : `Avg: Rp ${avg}rb`}
          </span>
        </div>
      );
    }

    return (
      <span className="text-xs font-extrabold text-slate-900 dark:text-white">
        {sum === 1 ? "YA" : "TIDAK"}
      </span>
    );
  };

  const handleExportExcel = () => {
    const exportList = metrics.filter(m => {
      if (canViewAll) {
        return selectedDeptFilter === "all" ? true : m.departmentId === selectedDeptFilter;
      }
      return true;
    });

    if (exportList.length === 0) {
      alert("Belum ada data metrik untuk diexport.");
      return;
    }

    let excelHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <!--[if gte mso 9]>
        <xml>
          <x:ExcelWorkbook>
            <x:ExcelWorksheets>
              <x:ExcelWorksheet>
                <x:Name>Scoreboard KPI</x:Name>
                <x:WorksheetOptions>
                  <x:DisplayGridlines/>
                </x:WorksheetOptions>
              </x:ExcelWorksheet>
            </x:ExcelWorksheets>
          </x:ExcelWorkbook>
        </xml>
        <![endif]-->
        <style>
          th { background-color: #108c8c; color: #ffffff; font-weight: bold; padding: 8px; border: 1px solid #d1d5db; text-align: center; }
          td { padding: 6px; border: 1px solid #d1d5db; text-align: left; }
          .center { text-align: center; }
          .right { text-align: right; }
        </style>
      </head>
      <body>
        <h2>Scoreboard KPI Nasi Gerilya (${scoreboardTab === "special" ? "Metrik Khusus" : "Metrik Bulanan"})</h2>
        <table>
          <thead>
            <tr>
              <th>Divisi</th>
              <th>Nama Metrik</th>
              <th>Status Aktif</th>
              <th>Target</th>
              <th>Satuan</th>
              <th>Tipe Target</th>
              <th>PIC</th>
              <th>Keterangan</th>
              <th>Siklus</th>
              <th>W1</th>
              <th>W2</th>
              <th>W3</th>
              <th>W4</th>
            </tr>
          </thead>
          <tbody>
    `;

    exportList.forEach(m => {
      const dept = departments.find(d => d.id === m.departmentId)?.name || "Global";
      const getVal = (w: number) => {
        const mv = metricValues.find(v => v.metricId === m.id && v.week === w);
        return (mv?.value !== undefined && mv?.value !== null) ? mv.value : "-";
      };
      const w1 = getVal(1);
      const w2 = getVal(2);
      const w3 = getVal(3);
      const w4 = getVal(4);

      excelHtml += `
        <tr>
          <td>${dept}</td>
          <td><b>${m.name}</b></td>
          <td>${isMetricCompleted(m) ? "Selesai" : "Aktif"}</td>
          <td class="right">${m.target}</td>
          <td class="center">${m.unit}</td>
          <td>${m.targetType === "higher_better" ? "Lebih Tinggi Lebih Baik" : "Lebih Rendah Lebih Baik"}</td>
          <td>${m.picName}</td>
          <td>${m.keterangan || "-"}</td>
          <td class="center">${m.cycleType === "special" ? `Khusus (${m.durationDays || 7} Hari)` : "Bulanan"}</td>
          <td class="center">${w1}</td>
          <td class="center">${w2}</td>
          <td class="center">${w3}</td>
          <td class="center">${w4}</td>
        </tr>
      `;
    });

    excelHtml += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelHtml], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Scoreboard_Nasi_Gerilya_${scoreboardTab === "special" ? "Khusus" : "Bulanan"}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return <ScoreboardSkeleton />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Scoreboard KPI
          </h2>
          <p className="text-slate-500 font-medium mt-1 flex flex-wrap items-center gap-2">
            <span>{canViewAll ? "Owner View: Seluruh Divisi" : `${getDeptName(currentProfile.departmentId)}`}</span>
            <span className="text-[11px] font-extrabold badge-glass px-3 py-1 rounded-full shadow-2xs">
              {scoreboardTab === "special"
                ? "*Metrik khusus berjalan jangka pendek dengan siklus hari dinamis"
                : "*Setiap metrik memiliki siklus 4 minggu (W1-W4) terhitung sejak tanggal dibuat"}
            </span>
          </p>
        </div>

        <div className="flex gap-3">
          {/* Export Button */}
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-50 shadow-sm transition-all"
          >
            <Download className="w-4 h-4" /> Export Excel
          </button>

          <button
            onClick={() => {
              setIsAddMetricOpen(true);
              setNewMetricDept(currentProfile.departmentId || departments[0]?.id || "dept-kitchen");
              setNewMetricCycleType(scoreboardTab);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-bold rounded-xl shadow-md shadow-zinc-900/10 transition-all cursor-pointer border border-zinc-900 dark:border-zinc-100"
          >
            <Plus className="w-4 h-4" /> Tambah Metrik Baru
          </button>
        </div>
      </div>

      {/* Scoreboard Tab Switcher (Segmented Button Control) */}
      <div className="inline-flex p-1.5 bg-slate-200/60 dark:bg-zinc-900 border border-slate-300 dark:border-zinc-800 rounded-2xl gap-2 shadow-inner">
        <button
          onClick={() => {
            setScoreboardTab("monthly");
            setSelectedWeekTab(currentWeek);
          }}
          className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 flex items-center gap-2.5 cursor-pointer ${
            scoreboardTab === "monthly"
              ? "bg-red-600 text-white shadow-md shadow-red-600/20 border border-red-500 scale-[1.02]"
              : "bg-white dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-zinc-700/80 hover:bg-slate-50 dark:hover:bg-zinc-700 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <span className="text-sm">📅</span>
          <span>{language === "id" ? "Bulanan" : "Monthly"}</span>
        </button>
        <button
          onClick={() => {
            setScoreboardTab("special");
            setSelectedWeekTab(1);
          }}
          className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all duration-200 flex items-center gap-2.5 cursor-pointer ${
            scoreboardTab === "special"
              ? "bg-red-600 text-white shadow-md shadow-red-600/20 border border-red-500 scale-[1.02]"
              : "bg-white dark:bg-zinc-800 text-slate-700 dark:text-slate-300 border border-slate-200/90 dark:border-zinc-700/80 hover:bg-slate-50 dark:hover:bg-zinc-700 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <span className="text-sm">⚡</span>
          <span>{language === "id" ? "Harian / Khusus" : "Daily / Special"}</span>
        </button>
      </div>

      {/* Scoreboard Control & Filter Bar */}
      <div className="bg-white dark:bg-zinc-900/80 p-4 border border-slate-100 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
          {canViewAll && (
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
              <CustomSelect
                value={selectedDeptFilter}
                onChange={(val) => setSelectedDeptFilter(val)}
                triggerClass="bg-slate-100 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase"
                options={[
                  { value: "all", label: "SEMUA DIVISI" },
                  ...departments.map((d) => ({ value: d.id, label: d.name.toUpperCase() })),
                ]}
              />
            </div>
          )}

          {/* SORT CONTROLS */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">URUTKAN:</span>
            <CustomSelect
              value={sortBy}
              onChange={(val) => setSortBy(val)}
              triggerClass="bg-slate-100 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase"
              options={[
                { value: "dept", label: "🏢 DIVISI" },
                { value: "target", label: "🎯 TARGET" },
                { value: "name", label: "📝 NAMA METRIK" }
              ]}
            />
            <button
              type="button"
              onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
              title={sortOrder === "asc" ? "Urutkan Ascending (A-Z / Low-High)" : "Urutkan Descending (Z-A / High-Low)"}
              className="p-1.5 bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer flex items-center gap-1 text-xs font-extrabold"
            >
              {sortOrder === "asc" ? <ArrowUp className="w-3.5 h-3.5 text-emerald-500" /> : <ArrowDown className="w-3.5 h-3.5 text-red-500" />}
              <span className="uppercase">{sortOrder}</span>
            </button>
          </div>

          {/* Rock Hierarchy Filter */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-zinc-950 p-1 rounded-xl border border-slate-200 dark:border-zinc-800 text-xs">
            <button
              type="button"
              onClick={() => setRockFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                rockFilter === "all"
                  ? "bg-white dark:bg-zinc-800 text-slate-900 dark:text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              Semua
            </button>
            <button
              type="button"
              onClick={() => setRockFilter("submetric")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                rockFilter === "submetric"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              <span>🎯 Sub-Metrik Rock</span>
            </button>
            <button
              type="button"
              onClick={() => setRockFilter("standalone")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                rockFilter === "standalone"
                  ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white"
              }`}
            >
              <span>📋 Metrik Mandiri</span>
            </button>
          </div>
        </div>

        {selectedDeptFilter !== "all" && (
          <button
            type="button"
            onClick={() => setSelectedDeptFilter("all")}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Main Scoreboard Table */}
      <div className="hidden md:block bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden space-y-0">
        {/* Title Header Banner */}
        <div className="px-6 py-4 bg-slate-50/80 dark:bg-zinc-900/60 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              {scoreboardTab === "monthly" ? "📊 Target & Progress KPI Bulanan (W1 - W4)" : "⚡ Target & Progress KPI Harian / Khusus"}
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {scoreboardTab === "monthly" 
                ? "Memantau akumulasi data mingguan W1 s.d W4 untuk divisi terdaftar."
                : "Memantau target durasi harian tertentu (Ad-Hoc / Short Event)."}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          {scoreboardTab === "monthly" ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 dark:bg-zinc-900/40 border-b border-slate-100 dark:border-zinc-800">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[240px]">Metric</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[130px]">Target</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">W1</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">W2</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">W3</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">W4</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[100px]">Status</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[120px]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {sortedActiveMetrics.map((metric) => {
                  const { statusColor, statusText } = getMetricProgress(metric);
                  const isHigherBetter = metric.targetType === "higher_better";

                  return (
                    <tr
                      key={metric.id}
                      className="hover:bg-slate-50/30 dark:hover:bg-zinc-900/30 transition-all"
                    >
                      {/* Metric Name & Info */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-1.5 flex-wrap">
                            {metric.name}
                            {canViewAll && (() => {
                              const dept = departments.find(d => d.id === metric.departmentId);
                              const name = (dept?.name || "").toUpperCase();

                              return (
                                <span className="px-2 py-0.5 text-[8px] font-extrabold rounded-full uppercase badge-glass shadow-2xs">
                                  {name}
                                </span>
                              );
                            })()}
                            {metric.rockId ? (() => {
                              const linkedRock = rocks.find(r => r.id === metric.rockId);
                              return (
                                <span className="px-2 py-0.5 text-[8px] font-bold rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/50">
                                  🎯 Rock: {linkedRock?.title ? (linkedRock.title.length > 20 ? linkedRock.title.slice(0, 20) + '...' : linkedRock.title) : "Sub-Metrik"}
                                </span>
                              );
                            })() : (
                              <span className="px-1.5 py-0.5 text-[8px] font-semibold rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                                📋 Mandiri
                              </span>
                            )}
                          </h4>
                          <span className="text-[10px] text-slate-450 font-medium block">
                            Dibuat: {formatDateSimple(metric.createdAt)}
                          </span>
                        </div>
                      </td>

                      {/* Target with Direction Icon */}
                      <td className="p-4 text-center">
                        <div 
                          className="inline-flex items-center justify-center gap-1 text-xs font-extrabold text-slate-900 dark:text-white"
                          title={isHigherBetter ? "Makin Tinggi Lebih Baik" : "Makin Rendah Lebih Baik"}
                        >
                          {isHigherBetter ? (
                            <ArrowUp className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 stroke-[2.5]" />
                          ) : (
                            <ArrowDown className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 stroke-[2.5]" />
                          )}
                          <span>
                            {metric.unit === "boolean" ? (metric.target === 1 ? "YA" : "TIDAK") : `${metric.target}${metric.unit === "percentage" ? "%" : metric.unit === "currency" ? "rb" : ""}`}
                          </span>
                        </div>
                      </td>

                      {/* W1-W4 Cells */}
                      {[1, 2, 3, 4].map((w) => {
                        const val = getWeeklyValue(metric.id, w);
                        const isCurrentWeekCell = w === getMetricActiveWeek(metric);
                        const hasValue = val !== null;

                        // Highlight target match
                        let textClass = "text-slate-800 dark:text-slate-300";
                        if (hasValue) {
                          const targetMet = metric.targetType === "higher_better"
                            ? val >= metric.target
                            : val <= metric.target;
                          textClass = targetMet ? "text-emerald-600 dark:text-emerald-500 font-bold" : "text-rose-600 dark:text-rose-500 font-bold";
                        }

                        return (
                          <td
                            key={w}
                            onClick={() => {
                              if (!isOwner) {
                                handleCellClick(metric, w);
                              }
                            }}
                            className={`p-4 text-center ${!isOwner ? "cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-all" : ""
                              } ${isCurrentWeekCell ? "bg-slate-50/50 dark:bg-slate-800/10 font-bold border-x border-slate-100 dark:border-slate-800" : ""
                              }`}
                          >
                            <div className="flex items-center justify-center min-h-[28px]">
                              <span className={`text-xs ${textClass}`}>
                                {formatUnitValue(val, metric.unit)}
                              </span>
                            </div>
                          </td>
                        );
                      })}

                      {/* Status badge */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center">
                          {(() => {
                            const isSelesai = statusText === "Selesai" || statusText === "Completed" || statusText === "Tercapai";
                            const isGagal = statusText === "Gagal" || statusText === "Gagal Target" || statusText === "Failed Target";
                            const isBerjalan = statusText === "Berjalan" || statusText === "Running";

                            let badgeClass = "badge-glass";
                            let dotClass = "bg-slate-400";

                            if (isSelesai) {
                              badgeClass = "badge-status-selesai";
                              dotClass = "bg-emerald-500 dark:bg-emerald-400";
                            } else if (isGagal) {
                              badgeClass = "badge-status-gagal";
                              dotClass = "bg-rose-500 dark:bg-rose-400";
                            } else if (isBerjalan) {
                              badgeClass = "badge-status-berjalan";
                              dotClass = "bg-amber-500 dark:bg-amber-400";
                            }

                            return (
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-full border ${badgeClass}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
                                {statusText}
                              </span>
                            );
                          })()}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setConvertItem({ id: metric.id, title: metric.name, description: metric.keterangan, departmentId: metric.departmentId, picName: metric.picName })}
                            title="Konversi Metrik Ke Modul Lain"
                            className="p-1.5 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-slate-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white border border-slate-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-xl transition-all shadow-2xs cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditMetric(metric)}
                            title="Edit Metrik"
                            className="p-1.5 bg-transparent hover:bg-amber-500/10 text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 border border-slate-200/80 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700/60 rounded-xl transition-all shadow-2xs"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              showConfirm({
                                title: "Hapus Metrik KPI",
                                message: `Apakah Anda yakin ingin menghapus metrik "${metric.name}" secara permanen?`,
                                variant: "danger",
                                confirmText: "Ya, Hapus",
                                onConfirm: () => deleteMetric(metric.id)
                              });
                            }}
                            title="Hapus Metrik"
                            className="p-1.5 bg-transparent hover:bg-rose-500/10 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 border border-slate-200/80 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-700/60 rounded-xl transition-all shadow-2xs"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          {canViewAll && (
                            metric.isActive ? (
                              <button
                                onClick={() => {
                                  showConfirm({
                                    title: "Selesaikan Metrik",
                                    message: `Apakah Anda yakin ingin menyelesaikan metrik "${metric.name}" secara manual?`,
                                    variant: "warning",
                                    confirmText: "Ya, Selesaikan",
                                    onConfirm: () => completeMetric(metric.id)
                                  });
                                }}
                                className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 border border-zinc-900 dark:border-white text-[10px] font-bold rounded-lg transition-all shadow-xs cursor-pointer"
                              >
                                Selesai
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-bold">Selesai</span>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {activeMetrics.length === 0 && (
                  <tr>
                    <td colSpan={canViewAll ? 8 : 7} className="p-12 text-center text-xs text-slate-400 font-medium">
                      Belum ada metrik bulanan aktif untuk divisi ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider w-[200px]">Metric</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[120px]">Dibuat</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[120px]">Deadline</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[80px]">Durasi</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[80px]">Target</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[100px]">Realisasi</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[100px]">Status</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[100px]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {sortedActiveMetrics.map((metric) => {
                  const valObj = getWeeklyValueObj(metric.id, 1);
                  const hasValue = valObj && valObj.value !== null;
                  const value = hasValue ? valObj.value : null;
                  const { statusColor, statusText } = getMetricProgress(metric);

                  return (
                    <tr
                      key={metric.id}
                      className="hover:bg-slate-50/30 transition-all"
                    >
                      {/* Metric Name */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight flex items-center gap-1.5 flex-wrap">
                            {metric.name}
                            {canViewAll && (() => {
                              const dept = departments.find(d => d.id === metric.departmentId);
                              const name = (dept?.name || "").toUpperCase();

                              return (
                                <span className="px-2 py-0.5 text-[8px] font-extrabold rounded-full uppercase badge-glass shadow-2xs">
                                  {name}
                                </span>
                              );
                            })()}
                            {metric.rockId ? (() => {
                              const linkedRock = rocks.find(r => r.id === metric.rockId);
                              return (
                                <span className="px-2 py-0.5 text-[8px] font-bold rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/50">
                                  🎯 Rock: {linkedRock?.title ? (linkedRock.title.length > 20 ? linkedRock.title.slice(0, 20) + '...' : linkedRock.title) : "Sub-Metrik"}
                                </span>
                              );
                            })() : (
                              <span className="px-1.5 py-0.5 text-[8px] font-semibold rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                                📋 Mandiri
                              </span>
                            )}
                          </h4>
                        </div>
                      </td>

                      {/* Tanggal Dibuat */}
                      <td className="p-4 text-center">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          {formatDateSimple(metric.createdAt)}
                        </span>
                      </td>

                      {/* Deadline */}
                      <td className="p-4 text-center">
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                          {metric.deadline ? formatDateSimple(metric.deadline) : "-"}
                        </span>
                      </td>

                      {/* Durasi */}
                      <td className="p-4 text-center">
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/20 px-2.5 py-1 rounded-full text-[9px] uppercase border border-blue-200/40">
                          {getMetricDurationDays(metric)} Hari
                        </span>
                      </td>

                      {/* Target */}
                      <td className="p-4 text-center">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-355">
                          {metric.target}{metric.unit === "percentage" ? "%" : ""}
                        </span>
                      </td>

                      {/* Realisasi */}
                      <td className="p-4 text-center">
                        <span className={`text-xs font-extrabold ${hasValue
                            ? (metric.targetType === "higher_better" ? (value ?? 0) >= metric.target : (value ?? 0) <= metric.target)
                              ? "text-emerald-600 dark:text-emerald-450"
                              : "text-rose-600 dark:text-rose-400"
                            : "text-slate-400"
                          }`}>
                          {hasValue ? formatUnitValue(value, metric.unit) : "Belum Diisi"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-full border ${statusText === "Tercapai" || statusText === "Selesai"
                            ? "badge-status-selesai"
                            : (statusText === "Gagal" || statusText === "Gagal Target")
                              ? "badge-status-gagal"
                              : statusText === "Berjalan"
                                ? "badge-status-berjalan"
                                : "badge-glass"
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
                          {statusText}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setConvertItem({ id: metric.id, title: metric.name, description: metric.keterangan, departmentId: metric.departmentId, picName: metric.picName })}
                            title="Konversi Metrik Ke Modul Lain"
                            className="p-1.5 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-slate-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white border border-slate-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-xl transition-all shadow-2xs cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditMetric(metric)}
                            title="Edit Metrik"
                            className="p-1.5 bg-transparent hover:bg-amber-500/10 text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 border border-slate-200/80 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700/60 rounded-xl transition-all shadow-2xs"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              showConfirm({
                                title: "Hapus Metrik KPI",
                                message: `Apakah Anda yakin ingin menghapus metrik "${metric.name}" secara permanen?`,
                                variant: "danger",
                                confirmText: "Ya, Hapus",
                                onConfirm: () => deleteMetric(metric.id)
                              });
                            }}
                            title="Hapus Metrik"
                            className="p-1.5 bg-transparent hover:bg-rose-500/10 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 border border-slate-200/80 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-700/60 rounded-xl transition-all shadow-2xs"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          {canViewAll && (
                            metric.isActive ? (
                              <button
                                onClick={() => {
                                  showConfirm({
                                    title: "Selesaikan Metrik",
                                    message: `Apakah Anda yakin ingin menyelesaikan metrik "${metric.name}" secara manual?`,
                                    variant: "warning",
                                    confirmText: "Ya, Selesaikan",
                                    onConfirm: () => completeMetric(metric.id)
                                  });
                                }}
                                className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 border border-zinc-900 dark:border-white text-[10px] font-bold rounded-lg transition-all shadow-xs cursor-pointer"
                              >
                                Selesai
                              </button>
                            ) : (
                              <span className="text-[10px] text-slate-400 font-bold">Selesai</span>
                            )
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}

                {activeMetrics.length === 0 && (
                  <tr>
                    <td colSpan={canViewAll ? 8 : 7} className="p-12 text-center text-xs text-slate-400 font-medium">
                      Belum ada metrik khusus aktif untuk divisi ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {/* Mobile view: List of Cards */}
      <div className="block md:hidden space-y-4">
        {scoreboardTab === "monthly" ? (
          activeMetrics.map((metric) => {
            const { statusColor, statusText, percentage } = getMetricProgress(metric);
            const dept = departments.find(d => d.id === metric.departmentId);

            return (
              <div key={metric.id} className="bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850 rounded-[20px] p-5 shadow-sm space-y-4">
                {/* Card Title, Department & Target */}
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-1 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {metric.name}
                    </h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      {canViewAll && dept && (
                        <span className="px-1.5 py-0.5 text-[8px] font-extrabold rounded uppercase bg-slate-50 dark:bg-zinc-900 text-slate-650 dark:text-slate-400 border border-slate-200 dark:border-zinc-800">
                          {dept.name}
                        </span>
                      )}
                      {metric.rockId && (
                        <span className="px-1.5 py-0.5 text-[8px] font-bold rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/50">
                          🎯 {rocks.find(r => r.id === metric.rockId)?.title || "Rock"}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-450 font-semibold">
                        Target: <span className="text-slate-800 dark:text-slate-200 font-bold">{metric.target}{metric.unit === "percentage" ? "%" : ""}</span>
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  {(() => {
                    const isSelesai = statusText === "Selesai" || statusText === "Completed" || statusText === "Tercapai";
                    const isGagal = statusText === "Gagal" || statusText === "Gagal Target" || statusText === "Failed Target";
                    const isBerjalan = statusText === "Berjalan" || statusText === "Running";

                    let badgeClass = "bg-slate-50 text-slate-650 border-slate-200 dark:bg-zinc-900 dark:text-slate-450 dark:border-zinc-800";
                    if (isSelesai) badgeClass = "bg-emerald-50 text-emerald-700 border-emerald-250 dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-900";
                    else if (isGagal) badgeClass = "bg-rose-50 text-rose-700 border-rose-250 dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-900";
                    else if (isBerjalan) badgeClass = "bg-amber-50 text-amber-700 border-amber-250 dark:bg-amber-950/20 dark:text-amber-450 dark:border-amber-900";

                    return (
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full border ${badgeClass}`}>
                          {statusText}
                        </span>
                      </div>
                    );
                  })()}
                </div>

                {/* W1-W4 Weekly Progress Steps Grid */}
                <div className="space-y-2">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">Progres Mingguan (W1 - W4)</span>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((w) => {
                      const val = getWeeklyValue(metric.id, w);
                      const isCurrentWeekCell = w === getMetricActiveWeek(metric);
                      const hasValue = val !== null;

                      let bgClass = "bg-slate-50/50 dark:bg-zinc-900/40";
                      let borderClass = "border-slate-100 dark:border-zinc-850/60";
                      let textClass = "text-slate-600 dark:text-slate-450";

                      if (hasValue) {
                        const targetMet = metric.targetType === "higher_better"
                          ? val >= metric.target
                          : val <= metric.target;
                        bgClass = targetMet ? "bg-emerald-50/30 dark:bg-emerald-950/20" : "bg-rose-50/30 dark:bg-rose-950/20";
                        borderClass = targetMet ? "border-emerald-100 dark:border-emerald-900/40" : "border-rose-100 dark:border-rose-900/40";
                        textClass = targetMet ? "text-emerald-700 dark:text-emerald-450 font-bold" : "text-rose-700 dark:text-rose-450 font-bold";
                      } else if (isCurrentWeekCell) {
                        borderClass = "border-red-500 dark:border-red-500/80 ring-1 ring-red-500/20";
                      }

                      return (
                        <button
                          key={w}
                          disabled={isOwner}
                          onClick={() => handleCellClick(metric, w)}
                          className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 ${bgClass} ${borderClass} ${!isOwner ? "active:scale-95 cursor-pointer" : "cursor-default"}`}
                        >
                          <span className="text-[8px] font-extrabold uppercase tracking-wider opacity-60">W{w}</span>
                          <span className={`text-[11px] font-bold ${textClass}`}>
                            {hasValue ? formatUnitValue(val, metric.unit) : "-"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Mobile Action Bar Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-zinc-850 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setConvertItem({ id: metric.id, title: metric.name, description: metric.keterangan, departmentId: metric.departmentId, picName: metric.picName })}
                      title="Konversi Metrik Ke Modul Lain"
                      className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-zinc-800 rounded-xl transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Konversi</span>
                    </button>
                    <button
                      onClick={() => handleOpenEditMetric(metric)}
                      title="Edit Metrik"
                      className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900/60 rounded-xl transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        showConfirm({
                          title: "Hapus Metrik KPI",
                          message: `Apakah Anda yakin ingin menghapus metrik "${metric.name}" secara permanen?`,
                          variant: "danger",
                          confirmText: "Ya, Hapus",
                          onConfirm: () => deleteMetric(metric.id)
                        });
                      }}
                      title="Hapus Metrik"
                      className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/60 rounded-xl transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Hapus</span>
                    </button>
                  </div>

                  {canViewAll && (
                    metric.isActive ? (
                      <button
                        onClick={() => {
                          showConfirm({
                            title: "Selesaikan Metrik",
                            message: `Apakah Anda yakin ingin menyelesaikan metrik "${metric.name}" secara manual?`,
                            variant: "warning",
                            confirmText: "Ya, Selesaikan",
                            onConfirm: () => completeMetric(metric.id)
                          });
                        }}
                        className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-[10px] font-extrabold rounded-xl transition-all shadow-xs cursor-pointer"
                      >
                        Selesai
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-bold">Selesai</span>
                    )
                  )}
                </div>
              </div>
            );
          })
        ) : (
          activeMetrics.map((metric) => {
            const valObj = getWeeklyValueObj(metric.id, 1);
            const hasValue = valObj && valObj.value !== null;
            const value = hasValue ? valObj.value : null;
            const { statusColor, statusText } = getMetricProgress(metric);
            const dept = departments.find(d => d.id === metric.departmentId);

            return (
              <div key={metric.id} className="bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850 rounded-[20px] p-5 shadow-sm space-y-4">
                {/* Header info */}
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-1.5 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {metric.name}
                    </h4>
                    <div className="flex items-center gap-2 flex-wrap">
                      {canViewAll && dept && (
                        <span className="px-1.5 py-0.5 text-[8px] font-extrabold rounded uppercase bg-slate-50 dark:bg-zinc-900 text-slate-650 dark:text-slate-450 border border-slate-200 dark:border-zinc-800">
                          {dept.name}
                        </span>
                      )}
                      {metric.rockId && (
                        <span className="px-1.5 py-0.5 text-[8px] font-bold rounded bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/50">
                          🎯 {rocks.find(r => r.id === metric.rockId)?.title || "Rock"}
                        </span>
                      )}
                      <span className="px-1.5 py-0.5 text-[8px] font-extrabold rounded uppercase bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-100/40">
                        ⚡ {getMetricDurationDays(metric)} Hari
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-450 font-semibold space-y-0.5">
                      <div>Dibuat: <span className="text-slate-800 dark:text-slate-200">{formatDateSimple(metric.createdAt)}</span></div>
                      {metric.deadline && <div>Deadline: <span className="text-red-550 font-bold">{formatDateSimple(metric.deadline)}</span></div>}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-full border ${statusText === "Tercapai" || statusText === "Selesai"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-255 dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-900"
                        : (statusText === "Gagal" || statusText === "Gagal Target")
                          ? "bg-rose-50 text-rose-700 border-rose-255 dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-900"
                          : "bg-slate-50 text-slate-650 border-slate-200 dark:bg-zinc-900 dark:text-slate-450 dark:border-zinc-800"
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusColor}`} />
                      {statusText}
                    </span>
                  </div>
                </div>

                {/* Targets Summary Grid */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-50 dark:border-zinc-900">
                  <div className="bg-slate-50/50 dark:bg-zinc-900/30 p-2.5 rounded-xl border border-slate-100 dark:border-zinc-850/50 flex flex-col justify-center">
                    <span className="text-[8px] font-extrabold text-slate-450 uppercase">Target Angka</span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {metric.target}{metric.unit === "percentage" ? "%" : ""}
                    </span>
                  </div>
                  <div className="bg-slate-50/50 dark:bg-zinc-900/30 p-2.5 rounded-xl border border-slate-100 dark:border-zinc-850/50 flex flex-col justify-center">
                    <span className="text-[8px] font-extrabold text-slate-450 uppercase">Realisasi Total</span>
                    <span className={`text-xs font-extrabold ${hasValue
                        ? (metric.targetType === "higher_better" ? (value ?? 0) >= metric.target : (value ?? 0) <= metric.target)
                          ? "text-emerald-600 dark:text-emerald-450"
                          : "text-rose-600 dark:text-rose-400"
                        : "text-slate-400"
                      }`}>
                      {hasValue ? formatUnitValue(value, metric.unit) : "Belum Diisi"}
                    </span>
                  </div>
                </div>

                {/* Mobile Action Bar Footer */}
                <div className="pt-3 border-t border-slate-100 dark:border-zinc-850 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setConvertItem({ id: metric.id, title: metric.name, description: metric.keterangan, departmentId: metric.departmentId, picName: metric.picName })}
                      title="Konversi Metrik Ke Modul Lain"
                      className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-zinc-800 rounded-xl transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Konversi</span>
                    </button>
                    <button
                      onClick={() => handleOpenEditMetric(metric)}
                      title="Edit Metrik"
                      className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-amber-900/60 rounded-xl transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        showConfirm({
                          title: "Hapus Metrik KPI",
                          message: `Apakah Anda yakin ingin menghapus metrik "${metric.name}" secara permanen?`,
                          variant: "danger",
                          confirmText: "Ya, Hapus",
                          onConfirm: () => deleteMetric(metric.id)
                        });
                      }}
                      title="Hapus Metrik"
                      className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-200/80 dark:border-rose-900/60 rounded-xl transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Hapus</span>
                    </button>
                  </div>

                  {canViewAll && (
                    metric.isActive ? (
                      <button
                        onClick={() => {
                          showConfirm({
                            title: "Selesaikan Metrik",
                            message: `Apakah Anda yakin ingin menyelesaikan metrik "${metric.name}" secara manual?`,
                            variant: "warning",
                            confirmText: "Ya, Selesaikan",
                            onConfirm: () => completeMetric(metric.id)
                          });
                        }}
                        className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:hover:bg-zinc-100 dark:text-zinc-950 text-[10px] font-extrabold rounded-xl transition-all shadow-xs cursor-pointer"
                      >
                        Selesai
                      </button>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-bold">Selesai</span>
                    )
                  )}
                </div>
              </div>
            );
          })
        )}

        {activeMetrics.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-400 font-medium bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850 rounded-[20px]">
            {scoreboardTab === "monthly"
              ? "Belum ada metrik bulanan aktif untuk divisi ini."
              : "Belum ada metrik khusus aktif untuk divisi ini."}
          </div>
        )}
      </div>

      {/* Rincian Input Harian Section */}
      {!isOwner && (
        <div className="bg-white border border-slate-100 p-6 rounded-[24px] shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                {scoreboardTab === "special"
                  ? "⚡ Rincian Input Harian Metrik Khusus (H1 s.d H[Durasi])"
                  : "📅 Rincian Input Harian (Tabel Mingguan W1 - W4)"}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {scoreboardTab === "special"
                  ? "Masukkan data harian metrik khusus secara berurutan. Data tersimpan kontinu tanpa terpengaruh pergantian minggu."
                  : "Masukkan data harian untuk otomatis mengakumulasikan nilai mingguan di atas. Klik sel W1-W4 di atas untuk beralih minggu secara cepat."}
              </p>
            </div>

            {/* Week Selector Tabs (Only for Monthly view) */}
            {scoreboardTab === "monthly" && (
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {[1, 2, 3, 4].map((w) => {
                  const isCurrentSimWeek = w === currentWeek;
                  const isSel = selectedWeekTab === w;
                  return (
                    <button
                      key={w}
                      onClick={() => setSelectedWeekTab(w)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isSel
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                        }`}
                    >
                      Week {w}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Relative Cycle Guide Banner */}
          {scoreboardTab === "monthly" ? (
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-[20px] text-xs leading-relaxed text-slate-600 space-y-2">
              <p className="font-bold text-slate-900 flex items-center gap-1.5">
                ℹ️ Panduan Pengisian Data Relatif (Siklus 1 Bulan):
              </p>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                <li>Setiap metrik berjalan selama **4 minggu penuh (W1 s.d W4)** terhitung sejak tanggal metrik tersebut dibuat.</li>
                <li>Kolom pengisian harian menggunakan format **H1 s.d H7** (Hari ke-1 s.d Hari ke-7 pada minggu berjalan) karena hari pengisian menyesuaikan tanggal pembuatan metrik.</li>
                <li>Anda hanya dapat mengisi data harian pada minggu yang berwarna hijau 🟢 <strong className="text-emerald-700 font-bold">W[X]</strong> untuk masing-masing metrik di bawah.</li>
                <li>Minggu yang berlabel <strong className="text-slate-700 font-bold">Selesai</strong> (minggu lalu) atau <strong className="text-amber-700 font-bold">Belum Mulai</strong> (minggu depan) akan otomatis dikunci untuk menjaga integritas data harian.</li>
              </ul>
            </div>
          ) : (
            <div className="p-4 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-900/40 rounded-[20px] text-xs leading-relaxed text-blue-900 dark:text-blue-200 space-y-1.5">
              <p className="font-bold flex items-center gap-1.5 text-blue-800 dark:text-blue-300">
                ⚡ Panduan Timeline Mandiri Metrik Khusus / Ad-Hoc:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-blue-800 dark:text-blue-300">
                <li>Metrik Khusus bersifat <strong>1 Timeline Kontinyu</strong> dari tanggal dibuat s.d deadline (misal **H1 s.d H12**).</li>
                <li>Tabel ini <strong>tidak menggunakan sistem minggu W1-W4</strong> sehingga data Anda 100% aman dan tidak akan berpindah/hilang saat pergantian minggu kalender.</li>
              </ul>
            </div>
          )}

          {/* Daily Input Table (Desktop only) */}
          <div className="hidden md:block overflow-x-auto">
            {(() => {
              const maxDuration = scoreboardTab === "special"
                ? activeMetrics.reduce((max, m) => Math.max(max, getMetricDurationDays(m)), 0)
                : 7;
              const dayIndexes = Array.from({ length: maxDuration }, (_, i) => i);

              return (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="p-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider w-[200px]">Metrik</th>
                      {dayIndexes.map((dayIdx) => (
                        <th key={dayIdx} className="p-3.5 text-xs font-bold text-slate-450 uppercase text-center">H{dayIdx + 1}</th>
                      ))}
                      <th className="p-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[120px]">Akumulasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeMetrics.map((metric) => {
                      const targetWeek = metric.cycleType === "special" ? 1 : selectedWeekTab;
                      const valObj = getWeeklyValueObj(metric.id, targetWeek);
                      const isCurrentWeek = metric.cycleType === "special" ? true : (selectedWeekTab === getMetricActiveWeek(metric));
                      const isPastWeek = metric.cycleType === "special" ? false : (selectedWeekTab < getMetricActiveWeek(metric));

                      const daysCount = metric.cycleType === "special" ? getMetricDurationDays(metric) : 7;
                      const dailyVals = valObj?.dailyValues ?? Array(daysCount).fill(null);
                      const weeklyAccum = valObj?.value ?? null;

                      return (
                        <tr
                          key={metric.id}
                          className="hover:bg-slate-50/30 transition-colors"
                        >
                          <td className="p-3.5">
                            <div className="space-y-1">
                              <span className="text-xs font-bold text-slate-900 block leading-tight">
                                {metric.name}
                              </span>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`px-1.5 py-0.5 text-[8px] font-extrabold rounded uppercase ${metric.cycleType === "special"
                                    ? "bg-blue-50 text-blue-650 border border-blue-100"
                                    : isCurrentWeek
                                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                      : isPastWeek
                                        ? "bg-slate-100 text-slate-500"
                                        : "bg-amber-50 text-amber-600 border border-amber-100"
                                  }`}>
                                  {metric.cycleType === "special" ? "Khusus" : isCurrentWeek ? `w${selectedWeekTab}` : isPastWeek ? "Lewat" : "Belum Mulai"}
                                </span>
                                <span className="text-[9px] text-slate-400 font-bold">
                                  TARGET: {metric.target}{metric.unit === "percentage" ? "%" : ""}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Daily values inputs */}
                          {dayIndexes.map((dayIdx) => {
                            if (dayIdx >= daysCount) {
                              return (
                                <td key={dayIdx} className="p-2 text-center text-slate-300 dark:text-zinc-800 font-bold text-xs">-</td>
                              );
                            }

                            const val = dailyVals[dayIdx];
                            const isDisabled = !isCurrentWeek;
                            const cellKey = `${metric.id}-${targetWeek}-${dayIdx}`;
                            const isJustSaved = !!savedCellKeys[cellKey];

                            return (
                              <td key={dayIdx} className="p-2 text-center relative">
                                <div className="flex items-center justify-center gap-1 relative">
                                  <input
                                    type="number"
                                    step="any"
                                    disabled={isDisabled}
                                    value={(val !== null && val !== undefined) ? val : ""}
                                    onChange={(e) => handleDailyValChange(metric.id, targetWeek, dayIdx, e.target.value)}
                                    placeholder="-"
                                    className={`w-14 px-2 py-1.5 rounded-lg text-xs font-bold text-center focus:outline-none focus:ring-1 focus:ring-red-500 text-slate-800 dark:text-slate-100 disabled:opacity-40 disabled:bg-slate-100/50 disabled:cursor-not-allowed transition-all ${
                                      isJustSaved
                                        ? "bg-emerald-500/10 border-emerald-500 ring-2 ring-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-extrabold"
                                        : "bg-slate-50/50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                                    }`}
                                  />
                                  {isJustSaved && (
                                    <span className="absolute -top-2.5 -right-1 flex items-center gap-0.5 bg-emerald-600 text-white text-[8px] font-extrabold px-1 py-0.5 rounded-md shadow-xs animate-in zoom-in-75 duration-150 z-20 pointer-events-none">
                                      <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                                      <span>OK</span>
                                    </span>
                                  )}
                                  {metric.unit === "percentage" && val !== null && !isJustSaved && (
                                    <span className="text-[9px] font-extrabold text-slate-400">%</span>
                                  )}
                                </div>
                              </td>
                            );
                          })}

                          {/* Weekly Accumulation Column */}
                          <td className="p-3.5 text-center">
                            <span className={`text-xs font-extrabold ${weeklyAccum !== null
                                ? (metric.targetType === "higher_better" ? weeklyAccum >= metric.target : weeklyAccum <= metric.target)
                                  ? "text-emerald-600 font-extrabold"
                                  : "text-rose-600 font-extrabold"
                                : "text-slate-400"
                              }`}>
                              {formatUnitValue(weeklyAccum, metric.unit)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}

                    {activeMetrics.length === 0 && (
                      <tr>
                        <td colSpan={maxDuration + 2} className="p-8 text-center text-xs text-slate-450 font-medium">
                          Belum ada metrik aktif.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              );
            })()}
          </div>

          {/* Mobile view: Daily Input Cards */}
          <div className="block md:hidden space-y-4">
            {activeMetrics.map((metric) => {
              const targetWeek = metric.cycleType === "special" ? 1 : selectedWeekTab;
              const valObj = getWeeklyValueObj(metric.id, targetWeek);
              const isCurrentWeek = metric.cycleType === "special" ? true : (selectedWeekTab === getMetricActiveWeek(metric));
              const isPastWeek = metric.cycleType === "special" ? false : (selectedWeekTab < getMetricActiveWeek(metric));

              const daysCount = metric.cycleType === "special" ? getMetricDurationDays(metric) : 7;
              const dailyVals = valObj?.dailyValues ?? Array(daysCount).fill(null);
              const weeklyAccum = valObj?.value ?? null;

              const loopArray = Array.from({ length: daysCount }, (_, i) => i);

              return (
                <div key={metric.id} className="bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850 rounded-[20px] p-5 shadow-sm space-y-4">
                  {/* Header: Title and Week Info */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                        {metric.name}
                      </h4>
                      <span className={`px-1.5 py-0.5 text-[8px] font-extrabold rounded uppercase flex-shrink-0 ${metric.cycleType === "special"
                          ? "bg-blue-50 text-blue-650 border border-blue-100"
                          : isCurrentWeek
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : isPastWeek
                              ? "bg-slate-100 text-slate-500"
                              : "bg-amber-50 text-amber-600 border border-amber-100"
                        }`}>
                        {metric.cycleType === "special" ? "Khusus" : isCurrentWeek ? `w${selectedWeekTab}` : isPastWeek ? "Lewat" : "Belum Mulai"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-400 font-bold">
                        Target: <span className="text-slate-800 dark:text-slate-200">{metric.target}{metric.unit === "percentage" ? "%" : ""}</span>
                      </span>
                      <span className="text-blue-500 font-bold flex items-center gap-0.5">
                        📅 {getMetricWeekDateRange(metric, selectedWeekTab)}
                      </span>
                    </div>
                  </div>

                  {/* H1-H7 Inputs Grid */}
                  <div className="space-y-2 pt-2 border-t border-slate-50 dark:border-zinc-900">
                    <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">Input Data Harian</span>
                    <div className="grid grid-cols-4 gap-3">
                      {loopArray.map((dayIdx) => {
                        const val = dailyVals[dayIdx];
                        const isDisabled = !isCurrentWeek;
                        const cellKey = `${metric.id}-${targetWeek}-${dayIdx}`;
                        const isJustSaved = !!savedCellKeys[cellKey];

                        return (
                          <div key={dayIdx} className={`flex flex-col items-center gap-1 p-1.5 rounded-xl border relative transition-all ${
                            isJustSaved
                              ? "bg-emerald-500/10 border-emerald-500/60 ring-1 ring-emerald-500/30"
                              : "bg-slate-50/50 dark:bg-zinc-900/30 border-slate-100 dark:border-zinc-900"
                          }`}>
                            <div className="flex items-center justify-between w-full px-0.5">
                              <span className="text-[8px] font-extrabold text-slate-400">H{dayIdx + 1}</span>
                              {isJustSaved && (
                                <span className="text-[8px] font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 animate-in zoom-in-75 duration-150">
                                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-0.5 justify-center w-full">
                              <input
                                type="number"
                                step="any"
                                disabled={isDisabled}
                                value={(val !== null && val !== undefined) ? val : ""}
                                onChange={(e) => handleDailyValChange(metric.id, targetWeek, dayIdx, e.target.value)}
                                placeholder="-"
                                className="w-full bg-transparent text-xs font-bold text-center focus:outline-none text-slate-800 dark:text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                              />
                              {metric.unit === "percentage" && val !== null && (
                                <span className="text-[8px] font-extrabold text-slate-400">%</span>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Accumulation block inside the grid */}
                      <div className="flex flex-col items-center justify-center gap-0.5 bg-slate-50 dark:bg-zinc-900/50 p-1.5 rounded-xl border border-dashed border-slate-200 dark:border-zinc-800 col-span-1">
                        <span className="text-[8px] font-extrabold text-slate-400">Total</span>
                        <span className={`text-[10px] font-extrabold ${weeklyAccum !== null
                            ? (metric.targetType === "higher_better" ? weeklyAccum >= metric.target : weeklyAccum <= metric.target)
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-rose-600 dark:text-rose-400"
                            : "text-slate-400"
                          }`}>
                          {formatUnitValue(weeklyAccum, metric.unit)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Modal Dialog: Add Metric */}
      {isAddMetricOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">

            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 sm:px-8 py-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-lg">
                  🎯
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">Tambah Metrik Baru</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Buat metrik target KPI bulanan atau ad-hoc untuk divisi.</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddMetricOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition-all text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Form Body (Scrollable) */}
            <form onSubmit={handleAddMetricSubmit} className="p-6 sm:p-8 space-y-6 overflow-y-auto flex-1">

              {/* Section 1: Nama Metrik & Divisi */}
              <div className="space-y-4 p-4 rounded-2xl bg-slate-50/60 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-800/60">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Nama Metrik <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newMetricName}
                    onChange={(e) => setNewMetricName(e.target.value)}
                    placeholder="Contoh: Website Uptime, Food Quality Rating, Sales Revenue..."
                    className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-900 dark:text-white shadow-xs transition-all"
                  />
                </div>

                {canViewAll && (
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Target Divisi <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={newMetricDept}
                      onChange={(e) => setNewMetricDept(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-900 dark:text-white shadow-xs transition-all"
                    >
                      <option value="">Pilih Divisi Penanggung Jawab...</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name} Division</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Hubungkan ke Prioritas Rock (90 Hari) */}
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Hubungkan ke Prioritas Rock (90 Hari) <span className="text-slate-400 font-normal">(Opsional)</span>
                  </label>
                  <select
                    value={newMetricRockId}
                    onChange={(e) => setNewMetricRockId(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 dark:text-white shadow-xs transition-all cursor-pointer"
                  >
                    <option value="">— Metrik Mandiri (Bukan bagian dari Rock) —</option>
                    {rocks
                      .filter(r => canViewAll ? (newMetricDept ? r.departmentId === newMetricDept : true) : r.departmentId === currentProfile.departmentId)
                      .map((r) => (
                        <option key={r.id} value={r.id}>
                          🎯 [{r.quarter} {r.year}] {r.title} ({getDeptName(r.departmentId)})
                        </option>
                      ))}
                  </select>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">
                    Jika dihubungkan, nilai capaian metrik ini akan otomatis mengkalkulasi progres Rock kuartalan.
                  </p>
                </div>
              </div>

              {/* Section 2: Target Angka & Unit Satuan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Target Angka <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={newMetricTarget}
                    onChange={(e) => setNewMetricTarget(e.target.value)}
                    placeholder="Contoh: 99, 100, 5000..."
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-900 dark:text-white font-bold tracking-wide shadow-xs transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Unit Satuan <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newMetricUnit}
                    onChange={(e) => setNewMetricUnit(e.target.value as Metric["unit"])}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-900 dark:text-white shadow-xs transition-all"
                  >
                    <option value="number">Number (Angka Murni)</option>
                    <option value="percentage">Percentage (Persen %)</option>
                    <option value="currency">Currency (Mata Uang Rp)</option>
                    <option value="boolean">Boolean (Ya / Tidak)</option>
                  </select>
                </div>
              </div>

              {/* Accumulation Mode selection for number / currency / percentage */}
              {(newMetricUnit === "number" || newMetricUnit === "currency" || newMetricUnit === "percentage") && (
                <div className="p-3.5 bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-900/40 rounded-2xl space-y-2 animate-in fade-in duration-150">
                  <label className="block text-[11px] font-extrabold text-teal-800 dark:text-teal-300 uppercase tracking-wider">
                    Metode Akumulasi Harian ke Mingguan
                  </label>
                  <select
                    value={newMetricAccumulationMode}
                    onChange={(e) => setNewMetricAccumulationMode(e.target.value as "sum" | "average")}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-teal-300 dark:border-teal-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
                  >
                    <option value="sum">➕ Total Penjumlahan (SUM) — Input harian dijumlahkan</option>
                    <option value="average">📊 Rata-Rata (AVG) — Input harian dirata-ratakan</option>
                  </select>
                  <p className="text-[10px] text-teal-700 dark:text-teal-400 font-medium">
                    {newMetricAccumulationMode === "sum"
                      ? "PILIHAN TOTAL: Input harian H1 s.d H7 akan dijumlahkan menjadi nilai total sepekan."
                      : "PILIHAN RATA-RATA: Input harian H1 s.d H7 akan dihitung rata-ratanya (AVG) menjadi nilai sepekan."}
                  </p>
                </div>
              )}

              {/* Section 3: Siklus Metrik */}
              <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Siklus & Periode Metrik
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewMetricCycleType("monthly")}
                    className={`p-3.5 border rounded-2xl text-left transition-all flex items-center justify-between ${newMetricCycleType === "monthly"
                        ? "bg-zinc-900/10 text-zinc-900 border-zinc-900/30 dark:bg-white/15 dark:text-white dark:border-white/40 shadow-sm font-extrabold"
                        : "bg-white text-slate-700 hover:bg-slate-50 dark:bg-zinc-900 dark:text-slate-300 border-slate-200 dark:border-zinc-800"
                      }`}
                  >
                    <div>
                      <p className="text-xs font-bold">📅 Bulanan (4 Minggu)</p>
                      <p className="text-[10px] opacity-70 mt-0.5">Metrik rutin bulanan (W1-W4)</p>
                    </div>
                    {newMetricCycleType === "monthly" && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewMetricCycleType("special")}
                    className={`p-3.5 border rounded-2xl text-left transition-all flex items-center justify-between ${newMetricCycleType === "special"
                        ? "bg-zinc-900/10 text-zinc-900 border-zinc-900/30 dark:bg-white/15 dark:text-white dark:border-white/40 shadow-sm font-extrabold"
                        : "bg-white text-slate-700 hover:bg-slate-50 dark:bg-zinc-900 dark:text-slate-300 border-slate-200 dark:border-zinc-800"
                      }`}
                  >
                    <div>
                      <p className="text-xs font-bold">⚡ Khusus (Ad-Hoc / Short)</p>
                      <p className="text-[10px] opacity-70 mt-0.5">Target durasi hari tertentu (1-14 Hari)</p>
                    </div>
                    {newMetricCycleType === "special" && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                  </button>
                </div>

                {newMetricCycleType === "special" && (
                  <div className="pt-2 animate-in slide-in-from-top-2 duration-150 space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        Tanggal Deadline (Tenggat Waktu) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={newMetricDeadline}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => {
                          const dl = e.target.value;
                          setNewMetricDeadline(dl);
                          const today = new Date().toISOString().split("T")[0];
                          const days = getDaysBetween(today, dl);
                          setNewMetricDurationDays(days);
                        }}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-900 dark:text-white dark:[color-scheme:dark] cursor-pointer"
                      />
                    </div>
                    {newMetricDeadline && (
                      <p className="text-[10px] text-slate-500 font-semibold bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-250/20">
                        Durasi Terhitung: <strong className="text-red-600">{newMetricDurationDays} Hari</strong> (Dibuat s.d Deadline)
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Section 4: Jenis Evaluasi Target */}
              <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Arah Evaluasi Target
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewMetricTargetType("higher_better")}
                    className={`p-4 border rounded-2xl text-left transition-all ${newMetricTargetType === "higher_better"
                        ? "border-emerald-500/50 bg-emerald-500/5 text-slate-900 dark:text-white ring-2 ring-emerald-500/20 font-bold"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300"
                      }`}
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      📈 Makin Tinggi Makin Baik
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium leading-relaxed">
                      Contoh: Sales Revenue, Uptime, Rating, Keuntungan.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewMetricTargetType("lower_better")}
                    className={`p-4 border rounded-2xl text-left transition-all ${newMetricTargetType === "lower_better"
                        ? "border-rose-500/50 bg-rose-500/5 text-slate-900 dark:text-white ring-2 ring-rose-500/20 font-bold"
                        : "border-slate-200 bg-white text-slate-650 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300"
                      }`}
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400">
                      📉 Makin Rendah Makin Baik
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium leading-relaxed">
                      Contoh: Response Time, Sisa Makanan, Komplain.
                    </p>
                  </button>
                </div>
              </div>

              {/* Section 5: Keterangan (Opsional) */}
              <div className="pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Keterangan Tambahan <span className="text-slate-400 font-normal">(Opsional)</span>
                </label>
                <textarea
                  value={newMetricKeterangan}
                  onChange={(e) => setNewMetricKeterangan(e.target.value)}
                  placeholder="Tulis instruksi pengisian atau detail pendukung lainnya..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-slate-900 dark:text-white h-20 resize-none font-medium leading-relaxed"
                />
              </div>

              {/* Modal Action Buttons Footer */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsAddMetricOpen(false)}
                  className="px-5 py-2.5 text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 rounded-xl transition-all shadow-md shadow-zinc-900/10 flex items-center gap-2 cursor-pointer border border-zinc-900 dark:border-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white dark:text-zinc-950" />
                      <span>Verifikasi & Memasukkan Data ke Database...</span>
                    </>
                  ) : (
                    <span>✨ Buat Metrik Baru</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Edit Metric Modal */}
      {editingMetric && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    Edit Metrik KPI
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Perbarui rincian target dan parameter metrik ini.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingMetric(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveEditMetric} className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Nama Metrik */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Nama Metrik KPI <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editMetricName}
                  onChange={(e) => setEditMetricName(e.target.value)}
                  placeholder="Contoh: Omset Harian Kasir, Kebersihan Area Dapur..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-white"
                  required
                />
              </div>

              {/* Target Divisi / Divisi Terkendala */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Divisi Terkendala <span className="text-red-500">*</span>
                </label>
                <select
                  value={editMetricDept}
                  onChange={(e) => setEditMetricDept(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-white cursor-pointer"
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name} Division</option>
                  ))}
                </select>
              </div>

              {/* Hubungkan ke Prioritas Rock (90 Hari) */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Hubungkan ke Prioritas Rock (90 Hari)
                </label>
                <select
                  value={editMetricRockId}
                  onChange={(e) => setEditMetricRockId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-white cursor-pointer"
                >
                  <option value="">— Metrik Mandiri (Bukan bagian dari Rock) —</option>
                  {rocks
                    .filter(r => canViewAll ? (editMetricDept ? r.departmentId === editMetricDept : true) : r.departmentId === (editMetricDept || editingMetric?.departmentId))
                    .map((r) => (
                      <option key={r.id} value={r.id}>
                        🎯 [{r.quarter} {r.year}] {r.title} ({getDeptName(r.departmentId)})
                      </option>
                    ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">
                  Ubah status keterikatan metrik ini dengan Prioritas Rock kuartalan.
                </p>
              </div>

              {/* Target & Satuan */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Target Angka <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={editMetricTarget}
                    onChange={(e) => setEditMetricTarget(e.target.value)}
                    placeholder="100, 1500000..."
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Satuan Nilai
                  </label>
                  <select
                    value={editMetricUnit}
                    onChange={(e) => setEditMetricUnit(e.target.value as Metric["unit"])}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-white cursor-pointer"
                  >
                    <option value="number">Angka Murni (10, 50, 100)</option>
                    <option value="percentage">Persentase (%)</option>
                    <option value="currency">Mata Uang (Rp)</option>
                    <option value="boolean">Boolean (Ya / Tidak)</option>
                  </select>
                </div>
              </div>

              {/* Accumulation Mode selection for number / currency / percentage */}
              {(editMetricUnit === "number" || editMetricUnit === "currency" || editMetricUnit === "percentage") && (
                <div className="p-3.5 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl space-y-2 animate-in fade-in duration-150">
                  <label className="block text-[11px] font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                    Metode Akumulasi Harian ke Mingguan
                  </label>
                  <select
                    value={editMetricAccumulationMode}
                    onChange={(e) => setEditMetricAccumulationMode(e.target.value as "sum" | "average")}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-950 border border-amber-300 dark:border-amber-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                  >
                    <option value="sum">➕ Total Penjumlahan (SUM) — Input harian dijumlahkan</option>
                    <option value="average">📊 Rata-Rata (AVG) — Input harian dirata-ratakan</option>
                  </select>
                </div>
              )}

              {/* Siklus & Periode Metrik */}
              <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Siklus & Periode Metrik
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditMetricCycleType("monthly")}
                    className={`p-3.5 border rounded-2xl text-left transition-all flex items-center justify-between cursor-pointer ${
                      editMetricCycleType === "monthly"
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/40 shadow-sm font-extrabold"
                        : "bg-white text-slate-700 hover:bg-slate-50 dark:bg-zinc-900 dark:text-slate-300 border-slate-200 dark:border-zinc-800"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">📅 Bulanan (4 Minggu)</p>
                      <p className="text-[10px] opacity-70 mt-0.5">Metrik rutin bulanan (W1-W4)</p>
                    </div>
                    {editMetricCycleType === "monthly" && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditMetricCycleType("special")}
                    className={`p-3.5 border rounded-2xl text-left transition-all flex items-center justify-between cursor-pointer ${
                      editMetricCycleType === "special"
                        ? "bg-red-500/10 text-red-600 border-red-500/30 dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/40 shadow-sm font-extrabold"
                        : "bg-white text-slate-700 hover:bg-slate-50 dark:bg-zinc-900 dark:text-slate-300 border-slate-200 dark:border-zinc-800"
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">⚡ Khusus (Ad-Hoc / Short)</p>
                      <p className="text-[10px] opacity-70 mt-0.5">Target durasi hari tertentu (1-14 Hari)</p>
                    </div>
                    {editMetricCycleType === "special" && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                  </button>
                </div>

                {editMetricCycleType === "special" && (
                  <div className="pt-2 animate-in slide-in-from-top-2 duration-150 space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                        Tanggal Deadline (Tenggat Waktu) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        required
                        value={editMetricDeadline}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => {
                          const dl = e.target.value;
                          setEditMetricDeadline(dl);
                          const startStr = (editingMetric?.createdAt || (editingMetric as any)?.created_at || new Date().toISOString()).split("T")[0];
                          const days = getDaysBetween(startStr, dl);
                          setEditMetricDurationDays(days > 0 ? days : 1);
                        }}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-white dark:[color-scheme:dark] cursor-pointer"
                      />
                    </div>
                    {editMetricDeadline && (
                      <p className="text-[10px] text-slate-500 font-semibold bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border border-slate-250/20">
                        Durasi Terhitung: <strong className="text-red-600">{editMetricDurationDays} Hari</strong> (Dibuat s.d Deadline)
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Jenis Evaluasi Target */}
              <div className="space-y-3 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Arah Evaluasi Target
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setEditMetricTargetType("higher_better")}
                    className={`p-4 border rounded-2xl text-left transition-all cursor-pointer ${
                      editMetricTargetType === "higher_better"
                        ? "border-emerald-500/50 bg-emerald-500/5 text-slate-900 dark:text-white ring-2 ring-emerald-500/20 font-bold"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      📈 Makin Tinggi Makin Baik
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium leading-relaxed">
                      Contoh: Sales Revenue, Uptime, Rating, Keuntungan.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditMetricTargetType("lower_better")}
                    className={`p-4 border rounded-2xl text-left transition-all cursor-pointer ${
                      editMetricTargetType === "lower_better"
                        ? "border-rose-500/50 bg-rose-500/5 text-slate-900 dark:text-white ring-2 ring-rose-500/20 font-bold"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400">
                      📉 Makin Rendah Makin Baik
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium leading-relaxed">
                      Contoh: Response Time, Sisa Makanan, Komplain.
                    </p>
                  </button>
                </div>
              </div>

              {/* Keterangan */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Keterangan Tambahan
                </label>
                <textarea
                  value={editMetricKeterangan}
                  onChange={(e) => setEditMetricKeterangan(e.target.value)}
                  placeholder="Instruksi pengisian atau detail pendukung..."
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-white h-20 resize-none"
                />
              </div>

              {/* Actions Footer */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setEditingMetric(null)}
                  className="px-5 py-2.5 text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white rounded-xl transition-all shadow-md shadow-amber-600/20 flex items-center gap-2 cursor-pointer"
                >
                  💾 Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Universal Convert Modal */}
      <UniversalConvertModal
        isOpen={!!convertItem}
        onClose={() => setConvertItem(null)}
        sourceType="metric"
        sourceItem={convertItem}
      />
    </div>
  );
}
