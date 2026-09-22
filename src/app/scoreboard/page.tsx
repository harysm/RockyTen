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
  RefreshCw,
  Eye,
  BarChart2,
  Check,
  Building2,
  Target,
  Hash,
  Percent,
  Coins
} from "lucide-react";
import CustomSelect from "@/components/CustomSelect";
import FormSelect from "@/components/FormSelect";
import FormDatePicker from "@/components/FormDatePicker";
import UniversalConvertModal, { UniversalConvertItem } from "@/components/UniversalConvertModal";
import ScoreboardSkeleton from "@/components/skeletons/ScoreboardSkeleton";
import { ScoreboardSummaryCards } from "@/components/scoreboard/ScoreboardSummaryCards";
import { ScoreboardDetailModal } from "@/components/scoreboard/ScoreboardDetailModal";

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

  // Drawer State for Option A (Focus Side Drawer)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerMetric, setDrawerMetric] = useState<Metric | null>(null);
  const [drawerWeek, setDrawerWeek] = useState<number>(currentWeek);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const handleOpenDrawer = (metric: Metric, week?: number) => {
    setDrawerMetric(metric);
    const activeW = metric.cycleType === "special" ? 1 : getMetricActiveWeek(metric);
    setDrawerWeek(week !== undefined ? week : activeW);
    setIsDrawerOpen(true);
  };

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
  const [sortOption, setSortOption] = useState<string>("dept_asc");
  const [sortBy, setSortBy] = useState<string>("dept");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSortChange = (val: string) => {
    setSortOption(val);
    const [field, order] = val.split("_");
    setSortBy(field);
    setSortOrder(order as "asc" | "desc");
  };

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



  const formatUnitValue = (val: number | null, unit: Metric["unit"]): string => {
    if (val === null) return "-";
    if (unit === "percentage") return `${val}%`;
    if (unit === "currency") return `Rp ${val}rb`;
    if (unit === "boolean") return val === 1 ? "YA" : "TIDAK";
    return String(val);
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
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Scoreboard KPI
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 font-medium text-sm mt-1">
            {language === "id"
              ? "Pantau target, ketercapaian, dan performa metrik KPI operasional secara terukur dan transparan."
              : "Track operational KPI targets, achievements, and team performance metrics transparently."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Panduan Siklus Button */}
          <button
            onClick={() => setIsGuideOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-200 dark:border-zinc-800"
            title="Buka Panduan Siklus Scoreboard"
          >
            <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="hidden sm:inline">Panduan Siklus</span>
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

      {/* Executive KPI Summary Cards */}
      <ScoreboardSummaryCards
        activeMetrics={activeMetrics}
        rocks={rocks}
        getMetricProgress={getMetricProgress}
        language={language}
      />

      {/* Scoreboard Unified Filter & Tab Switch Bar */}
      <div className="bg-white dark:bg-zinc-900/80 p-3 sm:p-3.5 border border-slate-100 dark:border-zinc-800 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        {/* Left Side: Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {/* Divisi Dropdown */}
          {canViewAll && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">Divisi :</span>
              <CustomSelect
                value={selectedDeptFilter}
                onChange={(val) => setSelectedDeptFilter(val)}
                triggerClass="bg-slate-100 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 px-3 py-1.5 rounded-lg text-xs font-bold"
                options={[
                  { value: "all", label: "Semua Divisi" },
                  ...departments.map((d) => ({ value: d.id, label: d.name })),
                ]}
              />
            </div>
          )}

          {/* Urutan Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">Urutan :</span>
            <CustomSelect
              value={sortOption}
              onChange={handleSortChange}
              triggerClass="bg-slate-100 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 px-3 py-1.5 rounded-lg text-xs font-bold"
              options={[
                { value: "dept_asc", label: "Divisi ↑" },
                { value: "dept_desc", label: "Divisi ↓" },
                { value: "target_asc", label: "Target ↑" },
                { value: "target_desc", label: "Target ↓" },
                { value: "name_asc", label: "Nama Metrik ↑" },
                { value: "name_desc", label: "Nama Metrik ↓" },
              ]}
            />
          </div>

          {/* Metrik Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">Metrik :</span>
            <CustomSelect
              value={rockFilter}
              onChange={(val) => setRockFilter(val as "all" | "submetric" | "standalone")}
              triggerClass="bg-slate-100 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 px-3 py-1.5 rounded-lg text-xs font-bold"
              options={[
                { value: "all", label: "Semua Metrik" },
                { value: "submetric", label: "Rocks Metrik" },
                { value: "standalone", label: "Metrik Mandiri" },
              ]}
            />
          </div>
        </div>

        {/* Right Side: Animated Sliding Tab Switcher */}
        <div className="relative grid grid-cols-2 p-1 bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl w-full sm:w-auto min-w-[260px] sm:ml-auto">
          {/* Animated Sliding Pill Indicator */}
          <div
            className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-lg bg-zinc-900 dark:bg-zinc-100 shadow-sm shadow-zinc-900/20 dark:shadow-none transition-transform duration-300 ease-out pointer-events-none ${
              scoreboardTab === "special" ? "translate-x-full" : "translate-x-0"
            }`}
          />

          <button
            type="button"
            onClick={() => {
              setScoreboardTab("monthly");
              setSelectedWeekTab(currentWeek);
            }}
            className={`relative z-10 px-3.5 py-1.5 text-xs font-bold text-center rounded-lg transition-colors duration-200 cursor-pointer select-none ${
              scoreboardTab === "monthly"
                ? "text-white dark:text-zinc-950 font-extrabold"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {language === "id" ? "Bulanan" : "Monthly"}
          </button>

          <button
            type="button"
            onClick={() => {
              setScoreboardTab("special");
              setSelectedWeekTab(1);
            }}
            className={`relative z-10 px-3.5 py-1.5 text-xs font-bold text-center rounded-lg transition-colors duration-200 cursor-pointer select-none ${
              scoreboardTab === "special"
                ? "text-white dark:text-zinc-950 font-extrabold"
                : "text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {language === "id" ? "Harian / Khusus" : "Daily / Special"}
          </button>
        </div>
      </div>

      {/* Main Scoreboard Table */}
      <div className="hidden md:block bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden space-y-0">
        {/* Title Header Banner */}
        <div className="px-6 py-4 bg-slate-50/80 dark:bg-zinc-900/60 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">
              {scoreboardTab === "monthly" ? "Target & Progress KPI Bulanan (W1 - W4)" : "Target & Progress KPI Harian / Khusus"}
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
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[110px]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                {sortedActiveMetrics.map((metric) => {
                  const { statusColor, statusText } = getMetricProgress(metric);
                  const isHigherBetter = metric.targetType === "higher_better";
                  const dept = departments.find(d => d.id === metric.departmentId);
                  const deptName = dept?.name || "Semua Divisi";

                  return (
                    <tr
                      key={metric.id}
                      className="hover:bg-slate-50/30 dark:hover:bg-zinc-900/30 transition-all"
                    >
                      {/* Metric Name & Info */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                            {metric.name}
                          </h4>
                          <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium block">
                            Dibuat: {formatDateSimple(metric.createdAt)} oleh {deptName}
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
                            onClick={() => handleOpenDrawer(metric, w)}
                            title={`Klik untuk buka input data W${w}`}
                            className={`p-3 text-center cursor-pointer transition-all group hover:bg-red-500/10 dark:hover:bg-red-500/15 ${
                              isCurrentWeekCell ? "bg-slate-50/70 dark:bg-zinc-900/50 font-bold border-x border-slate-100 dark:border-zinc-800" : ""
                            }`}
                          >
                            <div className="flex flex-col items-center justify-center min-h-[30px] rounded-lg p-1 group-hover:bg-white/80 dark:group-hover:bg-zinc-800/80 transition-all">
                              <span className={`text-xs ${textClass}`}>
                                {formatUnitValue(val, metric.unit)}
                              </span>
                              {isCurrentWeekCell && (
                                <span className="text-[7.5px] font-extrabold text-red-600 dark:text-red-400 mt-0.5 uppercase tracking-wider">
                                  Aktif
                                </span>
                              )}
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

                            if (isSelesai) {
                              badgeClass = "badge-status-selesai";
                            } else if (isGagal) {
                              badgeClass = "badge-status-gagal";
                            } else if (isBerjalan) {
                              badgeClass = "badge-status-berjalan";
                            }

                            return (
                              <span className={`inline-flex items-center px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md border ${badgeClass}`}>
                                {statusText}
                              </span>
                            );
                          })()}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenDrawer(metric, getMetricActiveWeek(metric))}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 rounded-xl text-xs font-bold transition-all inline-flex items-center justify-center shadow-2xs hover:shadow-xs cursor-pointer border border-slate-200/80 dark:border-zinc-700"
                          title="Lihat Detail & Input Data Scoreboard"
                        >
                          Detail
                        </button>
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
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[110px]">Aksi</th>
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
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                            {metric.name}
                          </h4>
                          <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium block">
                            Dibuat: {formatDateSimple(metric.createdAt)} oleh {departments.find(d => d.id === metric.departmentId)?.name || "Semua Divisi"}
                          </span>
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
                      <td
                        onClick={() => handleOpenDrawer(metric, 1)}
                        title="Klik untuk buka input data harian"
                        className="p-4 text-center cursor-pointer group hover:bg-red-500/10 dark:hover:bg-red-500/15 transition-all"
                      >
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
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-md border ${statusText === "Tercapai" || statusText === "Selesai"
                            ? "badge-status-selesai"
                            : (statusText === "Gagal" || statusText === "Gagal Target")
                              ? "badge-status-gagal"
                              : statusText === "Berjalan"
                                ? "badge-status-berjalan"
                                : "badge-glass"
                          }`}>
                          {statusText}
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenDrawer(metric, 1)}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 rounded-xl text-xs font-bold transition-all inline-flex items-center justify-center shadow-2xs hover:shadow-xs cursor-pointer border border-slate-200/80 dark:border-zinc-700"
                          title="Lihat Detail & Input Data Scoreboard"
                        >
                          Detail
                        </button>
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
              <div key={metric.id} className="bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850 rounded-xl p-5 shadow-sm space-y-4">
                {/* Card Title, Department & Target */}
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-1 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {metric.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium block">
                      Dibuat: {formatDateSimple(metric.createdAt)} oleh {dept?.name || "Semua Divisi"}
                    </span>
                    <div className="text-[10px] text-slate-450 font-semibold pt-1">
                      Target: <span className="text-slate-800 dark:text-slate-200 font-bold">{metric.target}{metric.unit === "percentage" ? "%" : ""}</span>
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
                          onClick={() => handleOpenDrawer(metric, w)}
                          className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 ${bgClass} ${borderClass} active:scale-95 cursor-pointer`}
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
                <div className="pt-3 border-t border-slate-100 dark:border-zinc-855">
                  <button
                    type="button"
                    onClick={() => handleOpenDrawer(metric, getMetricActiveWeek(metric))}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-750 rounded-xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                  >
                    Detail
                  </button>
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
              <div key={metric.id} className="bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850 rounded-xl p-5 shadow-sm space-y-4">
                {/* Header info */}
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-1.5 flex-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {metric.name}
                    </h4>
                    <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium block">
                      Dibuat: {formatDateSimple(metric.createdAt)} oleh {dept?.name || "Semua Divisi"}
                    </span>
                    <div className="text-[10px] text-slate-450 font-semibold space-y-0.5">
                      {metric.deadline && <div>Deadline: <span className="text-red-550 font-bold">{formatDateSimple(metric.deadline)}</span></div>}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded border ${statusText === "Tercapai" || statusText === "Selesai"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-255 dark:bg-emerald-950/20 dark:text-emerald-450 dark:border-emerald-900"
                        : (statusText === "Gagal" || statusText === "Gagal Target")
                          ? "bg-rose-50 text-rose-700 border-rose-255 dark:bg-rose-950/20 dark:text-rose-450 dark:border-rose-900"
                          : "bg-slate-50 text-slate-650 border-slate-200 dark:bg-zinc-900 dark:text-slate-450 dark:border-zinc-800"
                      }`}>
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
                <div className="pt-3 border-t border-slate-100 dark:border-zinc-855">
                  <button
                    type="button"
                    onClick={() => handleOpenDrawer(metric, 1)}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-850 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-750 rounded-xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                  >
                    Detail
                  </button>
                </div>
              </div>
            );
          })
        )}

        {activeMetrics.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-400 font-medium bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850 rounded-xl">
            {scoreboardTab === "monthly"
              ? "Belum ada metrik bulanan aktif untuk divisi ini."
              : "Belum ada metrik khusus aktif untuk divisi ini."}
          </div>
        )}
      </div>

      {/* Modal Dialog: Add Metric */}
      {isAddMetricOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">

            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 sm:px-8 py-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/30">
              <div>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">Tambah Metrik Baru</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Buat metrik target KPI bulanan atau ad-hoc untuk divisi.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddMetricOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-white flex items-center justify-center transition-all text-sm font-bold cursor-pointer"
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
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/15 focus:border-zinc-400 dark:focus:border-zinc-600 text-slate-900 dark:text-white shadow-2xs hover:border-slate-350 dark:hover:border-zinc-700 hover:bg-slate-50/70 dark:hover:bg-zinc-900/70 transition-all duration-200"
                  />
                </div>

                {canViewAll && (
                  <div>
                    <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Target Divisi <span className="text-red-500">*</span>
                    </label>
                    <FormSelect
                      value={newMetricDept}
                      onChange={(val) => setNewMetricDept(val)}
                      placeholder="Pilih Divisi Penanggung Jawab..."
                      options={departments.map((d) => ({
                        value: d.id,
                        label: `${d.name} Division`,
                        icon: <Building2 className="w-3.5 h-3.5" />
                      }))}
                    />
                  </div>
                )}

                {/* Hubungkan ke Prioritas Rock (90 Hari) */}
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Hubungkan ke Prioritas Rock (90 Hari) <span className="text-slate-400 font-normal">(Opsional)</span>
                  </label>
                  <FormSelect
                    value={newMetricRockId}
                    onChange={(val) => setNewMetricRockId(val)}
                    placeholder="— Metrik Mandiri (Bukan bagian dari Rock) —"
                    options={[
                      {
                        value: "",
                        label: "— Metrik Mandiri (Bukan bagian dari Rock) —",
                        sublabel: "Metrik mandiri tanpa keterkaitan target kuartalan"
                      },
                      ...rocks
                        .filter(r => canViewAll ? (newMetricDept ? r.departmentId === newMetricDept : true) : r.departmentId === currentProfile.departmentId)
                        .map((r) => ({
                          value: r.id,
                          label: r.title,
                          badge: `${r.quarter} ${r.year}`,
                          sublabel: `${getDeptName(r.departmentId)} Division`,
                          icon: <Target className="w-3.5 h-3.5" />
                        }))
                    ]}
                  />
                  <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
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
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/15 focus:border-zinc-400 dark:focus:border-zinc-600 text-slate-900 dark:text-white font-bold tracking-wide shadow-2xs hover:border-slate-350 dark:hover:border-zinc-700 hover:bg-slate-50/70 dark:hover:bg-zinc-900/70 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Unit Satuan <span className="text-red-500">*</span>
                  </label>
                  <FormSelect
                    value={newMetricUnit}
                    onChange={(val) => setNewMetricUnit(val as Metric["unit"])}
                    options={[
                      {
                        value: "number",
                        label: "Number (Angka Murni)",
                        sublabel: "Contoh: 10, 50, 100",
                        icon: <Hash className="w-3.5 h-3.5" />
                      },
                      {
                        value: "percentage",
                        label: "Percentage (Persen %)",
                        sublabel: "Contoh: 85%, 99.5%",
                        icon: <Percent className="w-3.5 h-3.5" />
                      },
                      {
                        value: "currency",
                        label: "Currency (Mata Uang Rp)",
                        sublabel: "Contoh: Rp 500rb, Rp 1.500rb",
                        icon: <Coins className="w-3.5 h-3.5" />
                      },
                      {
                        value: "boolean",
                        label: "Boolean (Ya / Tidak)",
                        sublabel: "Contoh: 1 (Ya) atau 0 (Tidak)",
                        icon: <CheckSquare className="w-3.5 h-3.5" />
                      }
                    ]}
                  />
                </div>
              </div>

              {/* Accumulation Mode selection for number / currency / percentage */}
              {(newMetricUnit === "number" || newMetricUnit === "currency" || newMetricUnit === "percentage") && (
                <div className="p-4 bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-900/40 rounded-2xl space-y-2.5 animate-in fade-in duration-150">
                  <label className="block text-[11px] font-extrabold text-teal-800 dark:text-teal-300 uppercase tracking-wider">
                    Metode Akumulasi Harian ke Mingguan
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setNewMetricAccumulationMode("sum")}
                      className={`p-3 border rounded-xl text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                        newMetricAccumulationMode === "sum"
                          ? "bg-white dark:bg-zinc-900 border-teal-500 shadow-xs ring-1 ring-teal-500/30 font-bold text-teal-900 dark:text-teal-200"
                          : "bg-white/60 dark:bg-zinc-950/60 border-teal-200/60 dark:border-teal-900/40 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-zinc-900"
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        newMetricAccumulationMode === "sum"
                          ? "bg-teal-600 text-white"
                          : "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300"
                      }`}>
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold leading-tight">Total Penjumlahan (SUM)</p>
                        <p className="text-[10px] opacity-70 mt-0.5 truncate">Input harian dijumlahkan</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setNewMetricAccumulationMode("average")}
                      className={`p-3 border rounded-xl text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                        newMetricAccumulationMode === "average"
                          ? "bg-white dark:bg-zinc-900 border-teal-500 shadow-xs ring-1 ring-teal-500/30 font-bold text-teal-900 dark:text-teal-200"
                          : "bg-white/60 dark:bg-zinc-950/60 border-teal-200/60 dark:border-teal-900/40 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-zinc-900"
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        newMetricAccumulationMode === "average"
                          ? "bg-teal-600 text-white"
                          : "bg-teal-100 text-teal-700 dark:bg-teal-900/50 dark:text-teal-300"
                      }`}>
                        <BarChart2 className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold leading-tight">Rata-Rata (AVG)</p>
                        <p className="text-[10px] opacity-70 mt-0.5 truncate">Input harian dirata-ratakan</p>
                      </div>
                    </button>
                  </div>
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
                    className={`p-3.5 border rounded-2xl text-left transition-all flex items-center justify-between cursor-pointer ${
                      newMetricCycleType === "monthly"
                        ? "bg-zinc-900/10 text-zinc-900 border-zinc-900/30 dark:bg-white/15 dark:text-white dark:border-white/40 shadow-sm font-extrabold"
                        : "bg-white text-slate-700 hover:bg-slate-50 dark:bg-zinc-900 dark:text-slate-300 border-slate-200 dark:border-zinc-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        newMetricCycleType === "monthly"
                          ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                          : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-slate-300"
                      }`}>
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold">Bulanan (4 Minggu)</p>
                        <p className="text-[10px] opacity-70 mt-0.5">Metrik rutin bulanan (W1-W4)</p>
                      </div>
                    </div>
                    {newMetricCycleType === "monthly" && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewMetricCycleType("special")}
                    className={`p-3.5 border rounded-2xl text-left transition-all flex items-center justify-between cursor-pointer ${
                      newMetricCycleType === "special"
                        ? "bg-zinc-900/10 text-zinc-900 border-zinc-900/30 dark:bg-white/15 dark:text-white dark:border-white/40 shadow-sm font-extrabold"
                        : "bg-white text-slate-700 hover:bg-slate-50 dark:bg-zinc-900 dark:text-slate-300 border-slate-200 dark:border-zinc-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        newMetricCycleType === "special"
                          ? "bg-amber-500 text-white"
                          : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-slate-300"
                      }`}>
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold">Khusus (Ad-Hoc / Short)</p>
                        <p className="text-[10px] opacity-70 mt-0.5">Target durasi hari tertentu (1-14 Hari)</p>
                      </div>
                    </div>
                    {newMetricCycleType === "special" && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                  </button>
                </div>

                {newMetricCycleType === "special" && (
                  <div className="pt-2 animate-in slide-in-from-top-2 duration-150 space-y-3">
                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Tanggal Deadline (Tenggat Waktu) <span className="text-red-500">*</span>
                      </label>
                      <FormDatePicker
                        required
                        value={newMetricDeadline}
                        minDate={new Date().toISOString().split("T")[0]}
                        onChange={(dl) => {
                          setNewMetricDeadline(dl);
                          const today = new Date().toISOString().split("T")[0];
                          const days = getDaysBetween(today, dl);
                          setNewMetricDurationDays(days);
                        }}
                        placeholder="Pilih tanggal tenggat waktu..."
                      />
                    </div>
                    {newMetricDeadline && (
                      <p className="text-[10px] text-slate-500 font-semibold bg-slate-50 dark:bg-zinc-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800">
                        Durasi Terhitung: <strong className="text-red-600 dark:text-red-400">{newMetricDurationDays} Hari</strong> (Dibuat s.d Deadline)
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
                    className={`p-4 border rounded-2xl text-left transition-all cursor-pointer ${
                      newMetricTargetType === "higher_better"
                        ? "border-emerald-500/50 bg-emerald-500/5 text-slate-900 dark:text-white ring-2 ring-emerald-500/20 font-bold"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                      </div>
                      <span>Makin Tinggi Makin Baik</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed pl-8.5">
                      Contoh: Sales Revenue, Uptime, Rating, Keuntungan.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewMetricTargetType("lower_better")}
                    className={`p-4 border rounded-2xl text-left transition-all cursor-pointer ${
                      newMetricTargetType === "lower_better"
                        ? "border-rose-500/50 bg-rose-500/5 text-slate-900 dark:text-white ring-2 ring-rose-500/20 font-bold"
                        : "border-slate-200 bg-white text-slate-650 hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                      <div className="w-6 h-6 rounded-lg bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center shrink-0">
                        <TrendingDown className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 stroke-[2.5]" />
                      </div>
                      <span>Makin Rendah Makin Baik</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed pl-8.5">
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
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/15 focus:border-zinc-400 dark:focus:border-zinc-600 text-slate-900 dark:text-white h-20 resize-none font-medium leading-relaxed shadow-2xs hover:border-slate-350 dark:hover:border-zinc-700 hover:bg-slate-50/70 dark:hover:bg-zinc-900/70 transition-all duration-200"
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
                    <span className="flex items-center gap-1.5">
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                      <span>Buat Metrik Baru</span>
                    </span>
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
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Edit Metrik KPI
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Perbarui rincian target dan parameter metrik ini.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingMetric(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors text-xs font-bold cursor-pointer"
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
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-white shadow-2xs hover:border-slate-350 dark:hover:border-zinc-700 hover:bg-slate-50/70 dark:hover:bg-zinc-900/70 transition-all duration-200"
                  required
                />
              </div>

              {/* Target Divisi / Divisi Terkendala */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Divisi Terkendala <span className="text-red-500">*</span>
                </label>
                <FormSelect
                  value={editMetricDept}
                  onChange={(val) => setEditMetricDept(val)}
                  options={departments.map(d => ({
                    value: d.id,
                    label: `${d.name} Division`,
                    icon: <Building2 className="w-3.5 h-3.5" />
                  }))}
                />
              </div>

              {/* Hubungkan ke Prioritas Rock (90 Hari) */}
              <div>
                <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Hubungkan ke Prioritas Rock (90 Hari)
                </label>
                <FormSelect
                  value={editMetricRockId}
                  onChange={(val) => setEditMetricRockId(val)}
                  placeholder="— Metrik Mandiri (Bukan bagian dari Rock) —"
                  options={[
                    {
                      value: "",
                      label: "— Metrik Mandiri (Bukan bagian dari Rock) —",
                      sublabel: "Metrik mandiri tanpa keterkaitan target kuartalan"
                    },
                    ...rocks
                      .filter(r => canViewAll ? (editMetricDept ? r.departmentId === editMetricDept : true) : r.departmentId === (editMetricDept || editingMetric?.departmentId))
                      .map((r) => ({
                        value: r.id,
                        label: r.title,
                        badge: `${r.quarter} ${r.year}`,
                        sublabel: `${getDeptName(r.departmentId)} Division`,
                        icon: <Target className="w-3.5 h-3.5" />
                      }))
                  ]}
                />
                <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
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
                    className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-white shadow-2xs hover:border-slate-350 dark:hover:border-zinc-700 hover:bg-slate-50/70 dark:hover:bg-zinc-900/70 transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Satuan Nilai
                  </label>
                  <FormSelect
                    value={editMetricUnit}
                    onChange={(val) => setEditMetricUnit(val as Metric["unit"])}
                    options={[
                      {
                        value: "number",
                        label: "Number (Angka Murni)",
                        sublabel: "Contoh: 10, 50, 100",
                        icon: <Hash className="w-3.5 h-3.5" />
                      },
                      {
                        value: "percentage",
                        label: "Percentage (Persen %)",
                        sublabel: "Contoh: 85%, 99.5%",
                        icon: <Percent className="w-3.5 h-3.5" />
                      },
                      {
                        value: "currency",
                        label: "Currency (Mata Uang Rp)",
                        sublabel: "Contoh: Rp 500rb, Rp 1.500rb",
                        icon: <Coins className="w-3.5 h-3.5" />
                      },
                      {
                        value: "boolean",
                        label: "Boolean (Ya / Tidak)",
                        sublabel: "Contoh: 1 (Ya) atau 0 (Tidak)",
                        icon: <CheckSquare className="w-3.5 h-3.5" />
                      }
                    ]}
                  />
                </div>
              </div>

              {/* Accumulation Mode selection for number / currency / percentage */}
              {(editMetricUnit === "number" || editMetricUnit === "currency" || editMetricUnit === "percentage") && (
                <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 rounded-2xl space-y-2.5 animate-in fade-in duration-150">
                  <label className="block text-[11px] font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
                    Metode Akumulasi Harian ke Mingguan
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setEditMetricAccumulationMode("sum")}
                      className={`p-3 border rounded-xl text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                        editMetricAccumulationMode === "sum"
                          ? "bg-white dark:bg-zinc-900 border-amber-500 shadow-xs ring-1 ring-amber-500/30 font-bold text-amber-900 dark:text-amber-200"
                          : "bg-white/60 dark:bg-zinc-950/60 border-amber-200/60 dark:border-amber-900/40 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-zinc-900"
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        editMetricAccumulationMode === "sum"
                          ? "bg-amber-600 text-white"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                      }`}>
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold leading-tight">Total Penjumlahan (SUM)</p>
                        <p className="text-[10px] opacity-70 mt-0.5 truncate">Input harian dijumlahkan</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setEditMetricAccumulationMode("average")}
                      className={`p-3 border rounded-xl text-left transition-all flex items-center gap-2.5 cursor-pointer ${
                        editMetricAccumulationMode === "average"
                          ? "bg-white dark:bg-zinc-900 border-amber-500 shadow-xs ring-1 ring-amber-500/30 font-bold text-amber-900 dark:text-amber-200"
                          : "bg-white/60 dark:bg-zinc-950/60 border-amber-200/60 dark:border-amber-900/40 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-zinc-900"
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        editMetricAccumulationMode === "average"
                          ? "bg-amber-600 text-white"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                      }`}>
                        <BarChart2 className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold leading-tight">Rata-Rata (AVG)</p>
                        <p className="text-[10px] opacity-70 mt-0.5 truncate">Input harian dirata-ratakan</p>
                      </div>
                    </button>
                  </div>
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
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        editMetricCycleType === "monthly"
                          ? "bg-amber-500 text-white"
                          : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-slate-300"
                      }`}>
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold">Bulanan (4 Minggu)</p>
                        <p className="text-[10px] opacity-70 mt-0.5">Metrik rutin bulanan (W1-W4)</p>
                      </div>
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
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        editMetricCycleType === "special"
                          ? "bg-red-500 text-white"
                          : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-slate-300"
                      }`}>
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold">Khusus (Ad-Hoc / Short)</p>
                        <p className="text-[10px] opacity-70 mt-0.5">Target durasi hari tertentu (1-14 Hari)</p>
                      </div>
                    </div>
                    {editMetricCycleType === "special" && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                  </button>
                </div>

                {editMetricCycleType === "special" && (
                  <div className="pt-2 animate-in slide-in-from-top-2 duration-150 space-y-3">
                    <div>
                      <label className="block text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                        Tanggal Deadline (Tenggat Waktu) <span className="text-red-500">*</span>
                      </label>
                      <FormDatePicker
                        required
                        value={editMetricDeadline}
                        minDate={new Date().toISOString().split("T")[0]}
                        onChange={(dl) => {
                          setEditMetricDeadline(dl);
                          const startStr = (editingMetric?.createdAt || (editingMetric as any)?.created_at || new Date().toISOString()).split("T")[0];
                          const days = getDaysBetween(startStr, dl);
                          setEditMetricDurationDays(days > 0 ? days : 1);
                        }}
                        placeholder="Pilih tanggal tenggat waktu..."
                      />
                    </div>
                    {editMetricDeadline && (
                      <p className="text-[10px] text-slate-500 font-semibold bg-slate-50 dark:bg-zinc-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800">
                        Durasi Terhitung: <strong className="text-amber-600 dark:text-amber-400">{editMetricDurationDays} Hari</strong> (Dibuat s.d Deadline)
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
                    <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      <div className="w-6 h-6 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center shrink-0">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                      </div>
                      <span>Makin Tinggi Makin Baik</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed pl-8.5">
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
                    <div className="flex items-center gap-2.5 text-xs font-bold text-rose-600 dark:text-rose-400">
                      <div className="w-6 h-6 rounded-lg bg-rose-500/10 dark:bg-rose-500/20 flex items-center justify-center shrink-0">
                        <TrendingDown className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 stroke-[2.5]" />
                      </div>
                      <span>Makin Rendah Makin Baik</span>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 font-medium leading-relaxed pl-8.5">
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
                  className="w-full px-4 py-3 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-slate-900 dark:text-white h-20 resize-none shadow-2xs hover:border-slate-350 dark:hover:border-zinc-700 hover:bg-slate-50/70 dark:hover:bg-zinc-900/70 transition-all duration-200"
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
                  <Check className="w-4 h-4 stroke-[2.5]" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Scoreboard Detail Center Popup Modal */}
      <ScoreboardDetailModal
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        metric={drawerMetric}
        departments={departments}
        rocks={rocks}
        selectedWeek={drawerWeek}
        onSelectWeek={(w) => setDrawerWeek(w)}
        activeWeek={drawerMetric ? getMetricActiveWeek(drawerMetric) : currentWeek}
        getMetricDurationDays={getMetricDurationDays}
        dailyValues={
          drawerMetric
            ? (getWeeklyValueObj(drawerMetric.id, drawerMetric.cycleType === "special" ? 1 : drawerWeek)?.dailyValues ?? Array(getMetricDurationDays(drawerMetric)).fill(null))
            : []
        }
        currentAccumulationValue={
          drawerMetric
            ? (getWeeklyValueObj(drawerMetric.id, drawerMetric.cycleType === "special" ? 1 : drawerWeek)?.value ?? null)
            : null
        }
        onDailyValueChange={handleDailyValChange}
        savedCellKeys={savedCellKeys}
        isOwner={isOwner}
        canViewAll={canViewAll}
        language={language}
        formatUnitValue={formatUnitValue}
        onEdit={handleOpenEditMetric}
        onDelete={(m) => {
          showConfirm({
            title: "Hapus Metrik KPI",
            message: `Apakah Anda yakin ingin menghapus metrik "${m.name}" secara permanen?`,
            variant: "danger",
            confirmText: "Ya, Hapus",
            onConfirm: () => deleteMetric(m.id)
          });
        }}
        onConvert={(m) => {
          setConvertItem({
            id: m.id,
            title: m.name,
            description: m.keterangan,
            departmentId: m.departmentId,
            picName: m.picName
          });
        }}
        onComplete={(m) => {
          showConfirm({
            title: "Selesaikan Metrik",
            message: `Apakah Anda yakin ingin menyelesaikan metrik "${m.name}" secara manual?`,
            variant: "warning",
            confirmText: "Ya, Selesaikan",
            onConfirm: () => completeMetric(m.id)
          });
        }}
      />

      {/* Panduan Siklus Dialog Modal */}
      {isGuideOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  ℹ️
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Panduan Siklus Scoreboard</h3>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400">Cara kerja siklus waktu & akumulasi data KPI</p>
                </div>
              </div>
              <button
                onClick={() => setIsGuideOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="p-3.5 bg-slate-50 dark:bg-zinc-800/60 rounded-2xl border border-slate-200/60 dark:border-zinc-700/60 space-y-1.5">
                <p className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                  📅 Siklus Metrik Bulanan (W1 s.d W4)
                </p>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                  <li>Setiap metrik berjalan <strong>4 minggu penuh (W1 - W4)</strong> terhitung sejak tanggal metrik dibuat.</li>
                  <li>Kolom harian menggunakan format <strong>H1 s.d H7</strong> (Hari ke-1 s.d ke-7 pada minggu berjalan).</li>
                  <li>Klik tombol <strong>"Isi Data"</strong> atau salah satu sel <strong>W1 - W4</strong> pada tabel untuk membuka panel input harian.</li>
                  <li>Nilai mingguan otomatis terhitung dan tersimpan secara real-time berdasarkan metode (SUM atau AVG).</li>
                </ul>
              </div>

              <div className="p-3.5 bg-blue-50/50 dark:bg-blue-950/30 rounded-2xl border border-blue-200/60 dark:border-blue-900/60 space-y-1.5">
                <p className="font-extrabold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                  ⚡ Siklus Metrik Khusus (Ad-Hoc / Event)
                </p>
                <ul className="list-disc pl-4 space-y-1 text-[11px] text-blue-800 dark:text-blue-300">
                  <li>Metrik Khusus memiliki <strong>1 Timeline Kontinyu</strong> dari tanggal dibuat s.d deadline (misal H1 s.d H14).</li>
                  <li>Bebas dari pengaruh pergantian minggu kalender, data tersimpan aman secara kontinu.</li>
                </ul>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsGuideOpen(false)}
                className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 text-xs font-bold rounded-xl cursor-pointer"
              >
                Mengerti
              </button>
            </div>
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
