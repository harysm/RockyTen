"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  Archive,
  Download,
  Filter,
  Search,
  ArrowUp,
  ArrowDown,
  Table2,
  LayoutGrid,
  CheckCircle2,
  XCircle,
  BarChart3,
  CheckSquare,
  AlertCircle,
  Newspaper,
  User,
  Clock
} from "lucide-react";
import CustomSelect from "@/components/CustomSelect";
import ArchivesSkeleton from "@/components/skeletons/ArchivesSkeleton";

import { useRouter } from "next/navigation";

type ArchiveModuleTab = "kpi" | "todos" | "issues" | "headlines";
type ArchiveViewMode = "grid" | "table";

export default function RebuiltArchivesPage() {
  const router = useRouter();
  const {
    metrics,
    metricValues,
    todos,
    issues,
    headlines,
    departments,
    currentProfile,
    language,
    showToast,
    addHistoryLog,
    isLoading
  } = useApp();

  const roleLower = (currentProfile.role || "").toLowerCase();
  const canViewAll = roleLower === "owner" || roleLower === "developer" || !currentProfile.departmentId;

  React.useEffect(() => {
    if (!canViewAll) {
      showToast("Akses Ditolak: Halaman Arsip khusus Owner & Developer", "error");
      router.replace("/");
    }
  }, [canViewAll, router, showToast]);

  // Active States
  const [activeTab, setActiveTab] = useState<ArchiveModuleTab>("kpi");
  const [viewMode, setViewMode] = useState<ArchiveViewMode>("grid");
  const [selectedDept, setSelectedDept] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const activeYear = new Date().getFullYear();
  const activeMonth = new Date().getMonth() + 1;

  // Filter 1: Scoreboard KPI Metrics
  const filteredMetrics = metrics.filter(m => {
    if (selectedDept !== "all" && m.departmentId !== selectedDept) return false;

    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const nameMatch = (m.name || "").toLowerCase().includes(q);
      const picMatch = (m.picName || "").toLowerCase().includes(q);
      if (!nameMatch && !picMatch) return false;
    }

    if (selectedStatus === "active" && m.isActive === false) return false;
    if (selectedStatus === "completed" && m.isActive !== false) return false;

    return true;
  });

  // Filter 2: Completed Todos
  const completedTodos = todos.filter(t => {
    if (selectedStatus === "completed" && t.status !== "completed") return false;
    if (selectedStatus === "pending" && t.status !== "pending") return false;
    if (selectedDept !== "all" && t.departmentId !== selectedDept) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      return (t.title || "").toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q));
    }
    return true;
  });

  // Filter 3: Issues (Filtered by selected status: solved, in_progress, open)
  const solvedIssues = issues.filter(i => {
    if (selectedStatus === "solved" && i.status !== "solved" && i.status !== "closed" && (i.status as string) !== "resolved") return false;
    if (selectedStatus === "in_progress" && i.status !== "in_progress") return false;
    if (selectedStatus === "open" && i.status !== "open") return false;
    if (selectedDept !== "all" && i.departmentId !== selectedDept) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const titleMatch = (i.title || "").toLowerCase().includes(q);
      const descMatch = (i.description || "").toLowerCase().includes(q);
      const picMatch = (i.picName || "").toLowerCase().includes(q);
      return titleMatch || descMatch || picMatch;
    }
    return true;
  });

  // Sorting States
  const [sortBy, setSortBy] = useState<string>("dept");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Priority Rank map
  const priorityRank: Record<string, number> = {
    critical: 4,
    high: 3,
    medium: 2,
    low: 1
  };

  // Status Rank map
  const issueStatusRank: Record<string, number> = {
    open: 1,
    in_progress: 2,
    solved: 3,
    closed: 3,
    resolved: 3
  };

  const todoStatusRank: Record<string, number> = {
    pending: 1,
    completed: 2,
    cancel: 3
  };

  // Sorted Metrics
  const sortedMetrics = [...filteredMetrics].sort((a, b) => {
    let res = 0;
    if (sortBy === "dept") {
      const deptA = departments.find(d => d.id === a.departmentId)?.name || "";
      const deptB = departments.find(d => d.id === b.departmentId)?.name || "";
      res = deptA.localeCompare(deptB);
    } else if (sortBy === "type") {
      const typeA = a.cycleType === "special" ? "Harian" : "Bulanan";
      const typeB = b.cycleType === "special" ? "Harian" : "Bulanan";
      res = typeA.localeCompare(typeB);
    } else if (sortBy === "name") {
      res = (a.name || "").localeCompare(b.name || "");
    } else if (sortBy === "target") {
      res = (a.target || 0) - (b.target || 0);
    }
    return sortOrder === "asc" ? res : -res;
  });

  // Sorted Todos
  const sortedTodos = [...completedTodos].sort((a, b) => {
    let res = 0;
    if (sortBy === "status") {
      res = (todoStatusRank[a.status] || 0) - (todoStatusRank[b.status] || 0);
    } else if (sortBy === "dept") {
      const deptA = departments.find(d => d.id === a.departmentId)?.name || "";
      const deptB = departments.find(d => d.id === b.departmentId)?.name || "";
      res = deptA.localeCompare(deptB);
    } else if (sortBy === "priority") {
      res = (priorityRank[a.priority] || 0) - (priorityRank[b.priority] || 0);
    } else if (sortBy === "title") {
      res = (a.title || "").localeCompare(b.title || "");
    }
    return sortOrder === "asc" ? res : -res;
  });

  // Sorted Issues
  const sortedIssues = [...solvedIssues].sort((a, b) => {
    let res = 0;
    if (sortBy === "status") {
      res = (issueStatusRank[a.status] || 0) - (issueStatusRank[b.status] || 0);
    } else if (sortBy === "dept") {
      const deptA = departments.find(d => d.id === a.departmentId)?.name || "";
      const deptB = departments.find(d => d.id === b.departmentId)?.name || "";
      res = deptA.localeCompare(deptB);
    } else if (sortBy === "priority") {
      res = (priorityRank[a.priority] || 0) - (priorityRank[b.priority] || 0);
    } else if (sortBy === "title") {
      res = (a.title || "").localeCompare(b.title || "");
    }
    return sortOrder === "asc" ? res : -res;
  });

  // Filter 4: Headlines (Company-wide + Dept headlines)
  const filteredHeadlines = headlines.filter(h => {
    if (selectedDept !== "all" && h.departmentId && h.departmentId !== selectedDept) return false;
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      const titleMatch = (h.title || "").toLowerCase().includes(q);
      const contentMatch = (h.content || "").toLowerCase().includes(q);
      const authorMatch = (h.authorName || "").toLowerCase().includes(q);
      return titleMatch || contentMatch || authorMatch;
    }
    return true;
  });

  // Sorted Headlines
  const sortedHeadlines = [...filteredHeadlines].sort((a, b) => {
    let res = 0;
    if (sortBy === "dept") {
      const deptA = a.departmentId ? (departments.find(d => d.id === a.departmentId)?.name || "Global") : "Global";
      const deptB = b.departmentId ? (departments.find(d => d.id === b.departmentId)?.name || "Global") : "Global";
      res = deptA.localeCompare(deptB);
    } else if (sortBy === "category") {
      res = (a.category || "").localeCompare(b.category || "");
    } else if (sortBy === "title") {
      res = (a.title || "").localeCompare(b.title || "");
    }
    return sortOrder === "asc" ? res : -res;
  });

  const formatUnitVal = (val: number, unit: string) => {
    if (unit === "percentage") return `${val.toFixed(1)}%`;
    if (unit === "currency") return `Rp ${val.toLocaleString("id-ID")}`;
    if (unit === "boolean") return val >= 1 ? "YA" : "TIDAK";
    return val.toLocaleString("id-ID");
  };

  const handleExportExcel = () => {
    let excelHtml = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style>
          th { background-color: #dc2626; color: #ffffff; font-weight: bold; padding: 10px; border: 1px solid #d1d5db; text-align: center; }
          td { padding: 8px; border: 1px solid #d1d5db; text-align: left; }
          .center { text-align: center; }
          .right { text-align: right; }
          .achieved { background-color: #dcfce7; color: #15803d; font-weight: bold; }
          .failed { background-color: #ffe4e6; color: #be123c; font-weight: bold; }
        </style>
      </head>
      <body>
        <h2>LAPORAN ARSIP SISTEM - NASI GERILYA</h2>
        <p><b>Tanggal Export:</b> ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</p>
        <p><b>Modul:</b> ${activeTab.toUpperCase()}</p>
        <br />
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Nama Metrik / Judul Item</th>
              <th>Divisi / Departemen</th>
              <th>Detail / Kategori</th>
              <th>Target</th>
              <th>Realisasi Aktual</th>
              <th>Status</th>
              <th>PIC / Penanggung Jawab</th>
            </tr>
          </thead>
          <tbody>
            ${filteredMetrics.map((m, index) => {
      const deptName = departments.find(d => d.id === m.departmentId)?.name || "Global";
      const cycleLabel = m.cycleType === "special" ? "Harian (Ad-Hoc)" : "Bulanan (Routine)";

      const currentValObj = metricValues.find(mv => mv.metricId === m.id && mv.year === activeYear && mv.month === activeMonth);
      let actualVal = 0;

      if (m.cycleType === "special") {
        if (currentValObj && currentValObj.dailyValues) {
          const validArr = currentValObj.dailyValues.filter((v: number | null): v is number => v !== null);
          if (validArr.length > 0) {
            actualVal = m.accumulationMode === "average"
              ? validArr.reduce((a: number, b: number) => a + b, 0) / validArr.length
              : validArr.reduce((a: number, b: number) => a + b, 0);
          }
        }
      } else {
        if (currentValObj && currentValObj.value !== null) {
          actualVal = currentValObj.value;
        }
      }

      const isMetricActive = m.isActive !== false;

      return `
                <tr>
                  <td class="center">${index + 1}</td>
                  <td><b>${m.name}</b></td>
                  <td>${deptName}</td>
                  <td>${cycleLabel}</td>
                  <td class="right">${m.target.toLocaleString("id-ID")}</td>
                  <td class="right">${actualVal.toLocaleString("id-ID")} (${m.unit})</td>
                  <td class="center ${isMetricActive ? "achieved" : "failed"}">${isMetricActive ? "AKTIF" : "SELESAI"}</td>
                  <td>${m.picName}</td>
                </tr>
              `;
    }).join("")}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([excelHtml], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Laporan_Arsip_${activeTab.toUpperCase()}_${new Date().toISOString().split("T")[0]}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast("Laporan Arsip Excel berhasil diunduh!", "success");
    addHistoryLog("Export Excel Arsip", `Mengunduh Laporan Rekapitulasi Data Arsip ${activeTab.toUpperCase()} Format Excel`, currentProfile.departmentId);
  };

  if (isLoading) {
    return <ArchivesSkeleton />;
  }

  return (
    <div className="space-y-6 w-full max-w-full font-sans">
      {/* 1. Header Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-6 rounded-xl shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
            {language === "id" ? "Arsip Sistem & Rekapitulasi Data" : "System Archives & Data Reports"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {language === "id"
              ? "Pusat histori lengkap rekapitulasi Scoreboard KPI, Agenda Kerja Selesai, Masalah Tuntas, dan Headline."
              : "Complete historical view of KPI metrics, completed tasks, solved issues, and headlines."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportExcel}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-md shadow-red-600/20 cursor-pointer transition-all active:scale-95 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>{language === "id" ? "Export Excel Laporan (.xlsx)" : "Export Excel Report (.xlsx)"}</span>
        </button>
      </div>

      {/* 2. Module Navigation Tabs */}
      <div className="flex items-center gap-2.5 border-b border-slate-200 dark:border-zinc-800 pb-3 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("kpi")}
          className={`px-4 py-2.5 rounded-lg text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${activeTab === "kpi"
              ? "bg-red-600 text-white shadow-md shadow-red-600/20"
              : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-zinc-800"
            }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Scoreboard KPI ({filteredMetrics.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("todos")}
          className={`px-4 py-2.5 rounded-lg text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${activeTab === "todos"
              ? "bg-red-600 text-white shadow-md shadow-red-600/20"
              : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-zinc-800"
            }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Agenda Kerja Selesai ({completedTodos.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("issues")}
          className={`px-4 py-2.5 rounded-lg text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${activeTab === "issues"
              ? "bg-red-600 text-white shadow-md shadow-red-600/20"
              : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-zinc-800"
            }`}
        >
          <AlertCircle className="w-4 h-4" />
          <span>Masalah Tuntas ({solvedIssues.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("headlines")}
          className={`px-4 py-2.5 rounded-lg text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${activeTab === "headlines"
              ? "bg-red-600 text-white shadow-md shadow-red-600/20"
              : "bg-white dark:bg-zinc-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-zinc-800"
            }`}
        >
          <Newspaper className="w-4 h-4" />
          <span>Headline ({filteredHeadlines.length})</span>
        </button>
      </div>

      {/* 3. Control Bar (Filter & Layout View Switcher) */}
      <div className="bg-white dark:bg-zinc-900 p-4 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xs flex flex-wrap items-center justify-between gap-4 w-full">
        <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="text-xs font-extrabold text-slate-700 dark:text-white uppercase tracking-wider">FILTER:</span>
          </div>

          {canViewAll && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">DIVISI:</span>
              <CustomSelect
                value={selectedDept}
                onChange={(val: string) => setSelectedDept(val)}
                triggerClass="bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white px-3.5 py-1.5 rounded-lg text-xs font-extrabold uppercase"
                options={[
                  { value: "all", label: "SEMUA DIVISI" },
                  ...departments.map((d) => ({ value: d.id, label: d.name.toUpperCase() })),
                ]}
              />
            </div>
          )}

          {activeTab !== "headlines" && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">STATUS:</span>
              <CustomSelect
                value={selectedStatus}
                onChange={(val: string) => setSelectedStatus(val)}
                triggerClass="bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white px-3.5 py-1.5 rounded-lg text-xs font-extrabold uppercase"
                options={
                  activeTab === "kpi"
                    ? [
                      { value: "all", label: "SEMUA STATUS" },
                      { value: "active", label: "🟢 AKTIF" },
                      { value: "completed", label: "🔵 SELESAI" },
                    ]
                    : activeTab === "todos"
                      ? [
                        { value: "all", label: "SEMUA STATUS" },
                        { value: "completed", label: "✅ SELESAI" },
                        { value: "pending", label: "⏳ PENDING" },
                      ]
                      : [
                        { value: "all", label: "SEMUA STATUS" },
                        { value: "solved", label: "✅ TUNTAS" },
                        { value: "in_progress", label: "⚠️ DALAM PROSES" },
                        { value: "open", label: "🔴 TERBUKA" },
                      ]
                }
              />
            </div>
          )}

          {/* SORT CONTROLS */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">URUTKAN:</span>
            <CustomSelect
              value={sortBy}
              onChange={(val: string) => setSortBy(val)}
              triggerClass="bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white px-3.5 py-1.5 rounded-lg text-xs font-extrabold uppercase"
              options={
                activeTab === "kpi"
                  ? [
                    { value: "dept", label: "🏢 DIVISI" },
                    { value: "type", label: "📅 TIPE (HARIAN/BULANAN)" },
                    { value: "target", label: "🎯 TARGET" },
                    { value: "name", label: "📝 NAMA METRIK" }
                  ]
                  : activeTab === "todos"
                    ? [
                      { value: "status", label: "⚡ STATUS" },
                      { value: "dept", label: "🏢 DIVISI" },
                      { value: "priority", label: "🔥 PRIORITAS" },
                      { value: "title", label: "📝 JUDUL" }
                    ]
                    : activeTab === "issues"
                      ? [
                        { value: "status", label: "⚡ STATUS" },
                        { value: "dept", label: "🏢 DIVISI" },
                        { value: "priority", label: "🔥 PRIORITAS" },
                        { value: "title", label: "📝 JUDUL" }
                      ]
                      : [
                        { value: "dept", label: "🏢 DIVISI" },
                        { value: "category", label: "🏷️ KATEGORI" },
                        { value: "title", label: "📝 JUDUL" }
                      ]
              }
            />
            <button
              type="button"
              onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
              title={sortOrder === "asc" ? "Urutkan Ascending (A-Z / 1-9)" : "Urutkan Descending (Z-A / 9-1)"}
              className="p-1.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer flex items-center gap-1 text-xs font-extrabold"
            >
              {sortOrder === "asc" ? <ArrowUp className="w-3.5 h-3.5 text-emerald-500" /> : <ArrowDown className="w-3.5 h-3.5 text-red-500" />}
              <span className="uppercase">{sortOrder}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari data arsip..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-lg text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-red-500 font-medium"
            />
          </div>

          {/* View Mode Toggle: Grid Kartu vs Tabel List */}
          <div className="flex items-center bg-slate-100 dark:bg-zinc-950 p-1 rounded-lg border border-slate-200 dark:border-zinc-800 shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${viewMode === "grid" ? "bg-white dark:bg-zinc-800 text-red-600 dark:text-red-500 shadow-xs" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Kartu</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${viewMode === "table" ? "bg-white dark:bg-zinc-800 text-red-600 dark:text-red-500 shadow-xs" : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
            >
              <Table2 className="w-4 h-4" />
              <span className="hidden sm:inline">Tabel</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Main Data Content (Grid vs Table) */}
      {activeTab === "kpi" && (
        <>
          {viewMode === "grid" ? (
            /* GRID MODE: 3 Column Modern Executive KPI Cards */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
              {sortedMetrics.map(m => {
                const deptName = departments.find(d => d.id === m.departmentId)?.name || "Global";
                const isSpecial = m.cycleType === "special";

                const currentValObj = metricValues.find(mv => mv.metricId === m.id && mv.year === activeYear && mv.month === activeMonth);
                let actualVal = 0;

                if (isSpecial) {
                  if (currentValObj && currentValObj.dailyValues) {
                    const validArr = currentValObj.dailyValues.filter((v: number | null): v is number => v !== null);
                    if (validArr.length > 0) {
                      actualVal = m.accumulationMode === "average"
                        ? validArr.reduce((a: number, b: number) => a + b, 0) / validArr.length
                        : validArr.reduce((a: number, b: number) => a + b, 0);
                    }
                  }
                } else {
                  if (currentValObj && currentValObj.value !== null) {
                    actualVal = currentValObj.value;
                  }
                }

                const isMetricActive = m.isActive !== false;

                return (
                  <div key={m.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-xl shadow-xs flex flex-col justify-between space-y-4 w-full">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                          {m.name}
                        </h4>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full ${isSpecial ? "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60" : "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60"
                            }`}>
                            {isSpecial ? "HARIAN" : "BULANAN"}
                          </span>
                          <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full border ${isMetricActive ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60" : "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-slate-300 border-slate-200 dark:border-zinc-700"
                            }`}>
                            {isMetricActive ? "AKTIF" : "SELESAI"}
                          </span>
                        </div>
                      </div>

                      {m.keterangan && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {m.keterangan}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-zinc-800 text-xs">
                      <div className="bg-slate-50 dark:bg-zinc-950/80 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800">
                        <span className="text-[10px] font-bold text-slate-500 block uppercase">Target</span>
                        <div className="flex items-center gap-1 font-extrabold text-slate-900 dark:text-white mt-0.5">
                          {m.targetType === "higher_better" ? <ArrowUp className="w-3 h-3 text-emerald-500" /> : <ArrowDown className="w-3 h-3 text-emerald-500" />}
                          <span>{formatUnitVal(m.target, m.unit)}</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-zinc-950/80 p-2.5 rounded-xl border border-slate-200 dark:border-zinc-800">
                        <span className="text-[10px] font-bold text-slate-500 block uppercase">Realisasi</span>
                        <span className="font-extrabold text-slate-900 dark:text-white mt-0.5 block">
                          {formatUnitVal(actualVal, m.unit)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-zinc-800 text-xs">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-zinc-950 text-slate-700 dark:text-slate-300 rounded-md text-[10px] font-extrabold uppercase border border-slate-200 dark:border-zinc-800">
                        {deptName}
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold">
                        <User className="w-3.5 h-3.5 text-red-500" />
                        <span>{m.picName}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* TABLE MODE */
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden w-full">
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <th className="py-3.5 px-4">Metrik KPI</th>
                      <th className="py-3.5 px-4">Divisi</th>
                      <th className="py-3.5 px-4">Tipe</th>
                      <th className="py-3.5 px-4 text-right">Target</th>
                      <th className="py-3.5 px-4 text-right">Realisasi</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                      <th className="py-3.5 px-4">PIC</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-zinc-800 text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {sortedMetrics.map(m => {
                      const deptName = departments.find(d => d.id === m.departmentId)?.name || "Global";
                      const isSpecial = m.cycleType === "special";

                      const currentValObj = metricValues.find(mv => mv.metricId === m.id && mv.year === activeYear && mv.month === activeMonth);
                      let actualVal = 0;

                      if (isSpecial) {
                        if (currentValObj && currentValObj.dailyValues) {
                          const validArr = currentValObj.dailyValues.filter((v: number | null): v is number => v !== null);
                          if (validArr.length > 0) {
                            actualVal = m.accumulationMode === "average"
                              ? validArr.reduce((a: number, b: number) => a + b, 0) / validArr.length
                              : validArr.reduce((a: number, b: number) => a + b, 0);
                          }
                        }
                      } else {
                        if (currentValObj && currentValObj.value !== null) {
                          actualVal = currentValObj.value;
                        }
                      }

                      const isMetricActive = m.isActive !== false;

                      return (
                        <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="space-y-0.5">
                              <span className="font-extrabold text-slate-900 dark:text-white">{m.name}</span>
                              {m.keterangan && (
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal leading-tight">{m.keterangan}</p>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-zinc-950 text-slate-700 dark:text-slate-300 rounded-md text-[10px] font-extrabold uppercase border border-slate-200 dark:border-zinc-800">
                              {deptName}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2 py-0.5 text-[9px] font-extrabold uppercase rounded-full ${isSpecial ? "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-400" : "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-400"
                              }`}>
                              {isSpecial ? "HARIAN" : "BULANAN"}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="inline-flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                              {m.targetType === "higher_better" ? <ArrowUp className="w-3.5 h-3.5 text-emerald-500" /> : <ArrowDown className="w-3.5 h-3.5 text-emerald-500" />}
                              <span>{formatUnitVal(m.target, m.unit)}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 dark:text-white">
                            {formatUnitVal(actualVal, m.unit)}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full uppercase inline-flex items-center gap-1 ${isMetricActive ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900" : "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-slate-300 border border-slate-200 dark:border-zinc-700"
                              }`}>
                              {isMetricActive ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                              <span>{isMetricActive ? "AKTIF" : "SELESAI"}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-medium">
                            {m.picName}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* TODOS TAB */}
      {activeTab === "todos" && (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
            {sortedTodos.map(todo => {
              const deptName = departments.find(d => d.id === todo.departmentId)?.name || "Global";
              return (
                <div key={todo.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-xl shadow-xs flex flex-col justify-between space-y-3 w-full">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400 rounded-full text-[9px] font-extrabold uppercase border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> SELESAI
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-zinc-950 text-slate-700 dark:text-slate-300 rounded-md text-[10px] font-extrabold uppercase border border-slate-200 dark:border-zinc-800">
                        {deptName}
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                      {todo.title}
                    </h4>
                    {todo.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {todo.description}
                      </p>
                    )}
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    <span>Deadline: {todo.deadline}</span>
                    <span>Prioritas: <strong className="uppercase text-slate-900 dark:text-white">{todo.priority}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden w-full">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Agenda Kerja</th>
                    <th className="py-3.5 px-4">Divisi</th>
                    <th className="py-3.5 px-4 text-center">Prioritas</th>
                    <th className="py-3.5 px-4 text-center">Deadline</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-zinc-800 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {sortedTodos.map(todo => {
                    const deptName = departments.find(d => d.id === todo.departmentId)?.name || "Global";
                    return (
                      <tr key={todo.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <span className="font-extrabold text-slate-900 dark:text-white">{todo.title}</span>
                            {todo.description && (
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal leading-tight">{todo.description}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-zinc-950 text-slate-700 dark:text-slate-300 rounded-md text-[10px] font-extrabold uppercase border border-slate-200 dark:border-zinc-800">
                            {deptName}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-400 rounded-full text-[9px] font-extrabold uppercase">
                            {todo.priority}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center text-slate-500 dark:text-slate-400">
                          {todo.deadline}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400 rounded-full text-[9px] font-extrabold uppercase border border-emerald-200 dark:border-emerald-900/60 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> SELESAI
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* ISSUES TAB */}
      {activeTab === "issues" && (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
            {sortedIssues.map(issue => {
              const deptName = departments.find(d => d.id === issue.departmentId)?.name || "Global";
              return (
                <div key={issue.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-xl shadow-xs flex flex-col justify-between space-y-3 w-full">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      {issue.status === "solved" || issue.status === "closed" || (issue.status as string) === "resolved" ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400 rounded-full text-[9px] font-extrabold uppercase border border-emerald-200 dark:border-emerald-900/60 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> TUNTAS
                        </span>
                      ) : issue.status === "in_progress" ? (
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-400 rounded-full text-[9px] font-extrabold uppercase border border-amber-200 dark:border-amber-900/60 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> PROSES
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-400 rounded-full text-[9px] font-extrabold uppercase border border-rose-200 dark:border-rose-900/60 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> TERBUKA
                        </span>
                      )}
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-zinc-950 text-slate-700 dark:text-slate-300 rounded-md text-[10px] font-extrabold uppercase border border-slate-200 dark:border-zinc-800">
                        {deptName}
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                      {issue.title}
                    </h4>
                    {issue.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        {issue.description}
                      </p>
                    )}
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    <span>PIC: <strong className="text-slate-900 dark:text-white">{issue.picName}</strong></span>
                    <span>{issue.createdAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden w-full">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Issue / Kendala</th>
                    <th className="py-3.5 px-4">Divisi</th>
                    <th className="py-3.5 px-4 text-center">Prioritas</th>
                    <th className="py-3.5 px-4 text-center">Status</th>
                    <th className="py-3.5 px-4">PIC</th>
                    <th className="py-3.5 px-4">Tanggal Dibuat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-zinc-800 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {sortedIssues.map(issue => {
                    const deptName = departments.find(d => d.id === issue.departmentId)?.name || "Global";
                    const isSolved = issue.status === "solved" || issue.status === "closed" || (issue.status as string) === "resolved";
                    const isInProgress = issue.status === "in_progress";
                    return (
                      <tr key={issue.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <span className="font-extrabold text-slate-900 dark:text-white">{issue.title}</span>
                            {issue.description && (
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal leading-relaxed whitespace-pre-line break-words">{issue.description}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-zinc-950 text-slate-700 dark:text-slate-300 rounded-md text-[10px] font-extrabold uppercase border border-slate-200 dark:border-zinc-800">
                            {deptName}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-400 rounded-full text-[9px] font-extrabold uppercase">
                            {issue.priority}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full uppercase inline-flex items-center gap-1 ${isSolved
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60"
                              : isInProgress
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60"
                                : "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60"
                            }`}>
                            {isSolved ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                            <span>{isSolved ? "TUNTAS" : isInProgress ? "PROSES" : "TERBUKA"}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-medium">
                          {issue.picName}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-normal text-[10px]">
                          {issue.createdAt}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* HEADLINES TAB */}
      {activeTab === "headlines" && (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
            {sortedHeadlines.map(headline => {
              const deptName = headline.departmentId ? (departments.find(d => d.id === headline.departmentId)?.name || "Global") : "Global";
              return (
                <div key={headline.id} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 p-5 rounded-xl shadow-xs flex flex-col justify-between space-y-3 w-full">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-400 rounded-full text-[9px] font-extrabold uppercase border border-blue-200 dark:border-blue-900/60">
                        {headline.category.replace("_", " ").toUpperCase()}
                      </span>
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-zinc-950 text-slate-700 dark:text-slate-300 rounded-md text-[10px] font-extrabold uppercase border border-slate-200 dark:border-zinc-800">
                        {deptName}
                      </span>
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white leading-snug">
                      {headline.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {headline.content}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    <span>Oleh: <strong className="text-slate-900 dark:text-white">{headline.authorName}</strong></span>
                    <span>{headline.createdAt}</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xs overflow-hidden w-full">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-zinc-950 border-b border-slate-200 dark:border-zinc-800 text-[10px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Judul Headline</th>
                    <th className="py-3.5 px-4">Kategori</th>
                    <th className="py-3.5 px-4">Divisi</th>
                    <th className="py-3.5 px-4">Penulis</th>
                    <th className="py-3.5 px-4">Tanggal Dibuat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-zinc-800 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  {sortedHeadlines.map(headline => {
                    const deptName = headline.departmentId ? (departments.find(d => d.id === headline.departmentId)?.name || "Global") : "Global";
                    return (
                      <tr key={headline.id} className="hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <span className="font-extrabold text-slate-900 dark:text-white">{headline.title}</span>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-normal leading-tight line-clamp-2">{headline.content}</p>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-400 rounded-full text-[9px] font-extrabold uppercase border border-blue-200 dark:border-blue-900/60">
                            {headline.category.replace("_", " ").toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-zinc-950 text-slate-700 dark:text-slate-300 rounded-md text-[10px] font-extrabold uppercase border border-slate-200 dark:border-zinc-800">
                            {deptName}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-medium">
                          {headline.authorName}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-normal text-[10px]">
                          {headline.createdAt}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}
    </div>
  );
}
