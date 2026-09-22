"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp, Rock, Metric } from "@/context/AppContext";
import {
  Target,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronUp,
  Edit3,
  Trash2,
  AlertOctagon,
  ArrowRight,
  Building2,
  Calendar,
  Layers,
  BarChart3,
  X,
  MoreVertical,
  RotateCcw,
  Ban,
  CheckCheck
} from "lucide-react";
import RocksSkeleton from "@/components/skeletons/RocksSkeleton";
import CustomSelect from "@/components/CustomSelect";

// Helper interface for calculated dynamic health status
export type RockHealthStatus = "completed" | "dropped" | "review" | "off_track" | "on_track";

interface RockStatusInfo {
  status: RockHealthStatus;
  label: string;
  badgeClass: string;
  dotClass: string;
  subtext: string;
  isOffTrack: boolean;
  isReadyForReview: boolean;
  daysRemaining: number;
  isOverdue: boolean;
}

// Pure function to calculate dynamic health status
export function getDynamicRockStatus(rock: Rock, progress: number): RockStatusInfo {
  // 1. Manually verified completed by leadership
  if (rock.status === "completed") {
    return {
      status: "completed",
      label: "Selesai",
      badgeClass: "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/60",
      dotClass: "bg-blue-500",
      subtext: "Terverifikasi oleh manajemen",
      isOffTrack: false,
      isReadyForReview: false,
      daysRemaining: 0,
      isOverdue: false
    };
  }

  // 2. Officially dropped / cancelled by leadership
  if (rock.status === "dropped") {
    return {
      status: "dropped",
      label: "Dropped",
      badgeClass: "text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700",
      dotClass: "bg-zinc-400",
      subtext: "Dibatalkan resmi oleh direksi",
      isOffTrack: false,
      isReadyForReview: false,
      daysRemaining: 0,
      isOverdue: false
    };
  }

  // Calculate days remaining towards deadline
  let daysRemaining = 999;
  let isOverdue = false;
  if (rock.dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(rock.dueDate);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - today.getTime();
    daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    isOverdue = daysRemaining < 0;
  }

  // 3. Technical 100% progress achieved, awaiting leadership sign-off
  if (progress >= 100) {
    return {
      status: "review",
      label: "Siap Review",
      badgeClass: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60",
      dotClass: "bg-amber-500",
      subtext: "Progres 100% • Menunggu verifikasi atasan",
      isOffTrack: false,
      isReadyForReview: true,
      daysRemaining,
      isOverdue: false
    };
  }

  // 4. Overdue and incomplete -> Off Track
  if (isOverdue) {
    return {
      status: "off_track",
      label: "Off Track (Terlambat)",
      badgeClass: "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/60",
      dotClass: "bg-rose-500",
      subtext: `Lewat batas waktu (${Math.abs(daysRemaining)} hari lalu) • Perlu IDS`,
      isOffTrack: true,
      isReadyForReview: false,
      daysRemaining,
      isOverdue: true
    };
  }

  // 5. Early warning: Sisa <= 14 hari tapi progres < 50%
  if (daysRemaining <= 14 && progress < 50) {
    return {
      status: "off_track",
      label: "Off Track (Beresiko)",
      badgeClass: "text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/60",
      dotClass: "bg-rose-500",
      subtext: `Sisa ${daysRemaining} hari, progres ${progress}% • Butuh IDS`,
      isOffTrack: true,
      isReadyForReview: false,
      daysRemaining,
      isOverdue: false
    };
  }

  // 6. Healthy Active Progress -> On Track
  return {
    status: "on_track",
    label: "On Track",
    badgeClass: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/60",
    dotClass: "bg-emerald-500",
    subtext: "Berjalan normal sesuai lini masa",
    isOffTrack: false,
    isReadyForReview: false,
    daysRemaining,
    isOverdue: false
  };
}

export default function RocksPage() {
  const {
    currentProfile,
    departments,
    allProfiles,
    getFilteredData,
    getRockProgress,
    addRock,
    editRock,
    deleteRock,
    toggleRockStatus,
    addIssue,
    showToast,
    showConfirm,
    isLoading,
    language
  } = useApp();

  const { rocks, metrics } = getFilteredData();

  // Role checks
  const roleLower = (currentProfile.role || "").toLowerCase();
  const isOwner = roleLower === "owner";
  const isDeveloper = roleLower === "developer";
  const isOwnerOrDev = isOwner || isDeveloper;

  // Filters
  const [selectedQuarter, setSelectedQuarter] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>("all");
  const [sortOption, setSortOption] = useState<string>("quarter_desc");
  const [expandedRockIds, setExpandedRockIds] = useState<Record<string, boolean>>({});
  const [activeMenuRockId, setActiveMenuRockId] = useState<string | null>(null);

  // Add Rock Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDeptId, setNewDeptId] = useState(currentProfile.departmentId || "dept-it");
  const [newPicId, setNewPicId] = useState(currentProfile.id);
  const [newQuarter, setNewQuarter] = useState<"Q1" | "Q2" | "Q3" | "Q4">("Q3");
  const [newYear, setNewYear] = useState<number>(2026);
  const [newDueDate, setNewDueDate] = useState("2026-09-30");
  const [newInitialProgress, setNewInitialProgress] = useState<number>(0);

  // Edit Rock Modal State
  const [editingRock, setEditingRock] = useState<Rock | null>(null);

  // Close kebab dropdown when clicking anywhere outside
  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveMenuRockId(null);
    };
    window.addEventListener("click", handleGlobalClick);
    return () => window.removeEventListener("click", handleGlobalClick);
  }, []);

  // Toggle accordion expand
  const toggleExpand = (rockId: string) => {
    setExpandedRockIds(prev => ({ ...prev, [rockId]: !prev[rockId] }));
  };

  const getDeptName = (id: string | null) => {
    if (!id) return "Semua Divisi";
    const dept = departments.find(d => d.id === id);
    return dept ? dept.name : "Divisi";
  };

  // Filtered & Sorted Rocks
  const filteredRocks = rocks
    .filter(rock => {
      if (selectedQuarter !== "all" && rock.quarter !== selectedQuarter) return false;
      if (isOwnerOrDev && selectedDeptFilter !== "all" && rock.departmentId !== selectedDeptFilter) return false;

      if (selectedStatus !== "all") {
        const { progress } = getRockProgress(rock.id);
        const info = getDynamicRockStatus(rock, progress);
        if (selectedStatus === "on_track" && info.status !== "on_track") return false;
        if (selectedStatus === "off_track" && info.status !== "off_track") return false;
        if (selectedStatus === "review" && info.status !== "review") return false;
        if (selectedStatus === "completed" && info.status !== "completed") return false;
        if (selectedStatus === "dropped" && info.status !== "dropped") return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOption === "quarter_asc") return a.quarter.localeCompare(b.quarter);
      if (sortOption === "quarter_desc") return b.quarter.localeCompare(a.quarter);
      if (sortOption === "title_asc") return a.title.localeCompare(b.title);
      if (sortOption === "title_desc") return b.title.localeCompare(a.title);
      if (sortOption === "progress_asc") {
        const pA = getRockProgress(a.id).progress;
        const pB = getRockProgress(b.id).progress;
        return pA - pB;
      }
      if (sortOption === "progress_desc") {
        const pA = getRockProgress(a.id).progress;
        const pB = getRockProgress(b.id).progress;
        return pB - pA;
      }
      return 0;
    });

  // Calculate dynamic global counters across active rocks
  let totalRocks = rocks.length;
  let dynamicOnTrackCount = 0;
  let dynamicOffTrackCount = 0;
  let dynamicReviewCount = 0;
  let dynamicCompletedCount = 0;

  rocks.forEach(r => {
    const { progress } = getRockProgress(r.id);
    const info = getDynamicRockStatus(r, progress);
    if (info.status === "completed") dynamicCompletedCount++;
    else if (info.status === "review") dynamicReviewCount++;
    else if (info.status === "off_track") dynamicOffTrackCount++;
    else if (info.status === "on_track") dynamicOnTrackCount++;
  });

  // Handle Add Rock
  const handleCreateRock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast("Harap masukkan judul Rock!", "warning");
      return;
    }

    const pic = allProfiles.find(p => p.id === newPicId) || currentProfile;

    addRock({
      departmentId: newDeptId,
      title: newTitle.trim(),
      description: newDesc.trim() || undefined,
      quarter: newQuarter,
      year: newYear,
      status: "on_track",
      progress: Math.min(100, Math.max(0, newInitialProgress || 0)),
      picId: pic.id,
      picName: pic.name,
      dueDate: newDueDate
    });

    setIsAddModalOpen(false);
    setNewTitle("");
    setNewDesc("");
    setNewInitialProgress(0);
    showToast("Rock prioritas baru berhasil dibuat!", "success");
  };

  // Handle Edit Rock
  const handleUpdateRock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRock || !editingRock.title.trim()) return;

    editRock(editingRock.id, {
      title: editingRock.title.trim(),
      description: editingRock.description?.trim() || undefined,
      departmentId: editingRock.departmentId,
      picId: editingRock.picId,
      picName: editingRock.picName,
      quarter: editingRock.quarter,
      year: editingRock.year,
      dueDate: editingRock.dueDate,
      status: editingRock.status,
      progress: editingRock.progress !== undefined ? Math.min(100, Math.max(0, editingRock.progress)) : undefined
    });

    setEditingRock(null);
    showToast("Perubahan Rock berhasil disimpan!", "success");
  };

  // Leader Action: Verify & Mark Completed
  const handleVerifyComplete = (rock: Rock) => {
    showConfirm({
      title: "Verifikasi Selesai (ACC Atasan)",
      message: `Tandai prioritas Rock "${rock.title}" sebagai SELESAI resmi setelah direview dalam rapat?`,
      confirmText: "Ya, Verifikasi Selesai",
      cancelText: "Batal",
      variant: "info",
      onConfirm: () => {
        toggleRockStatus(rock.id, "completed");
        showToast(`Rock "${rock.title}" resmi diverifikasi selesai! 🎉`, "success");
      }
    });
  };

  // Leader Action: Drop Rock (Strategic Pivot)
  const handleDropRock = (rock: Rock) => {
    showConfirm({
      title: "Batalkan Prioritas Rock (Drop)",
      message: `Apakah rapat manajemen memutuskan untuk membatalkan (Drop) Rock "${rock.title}" karena perubahan strategi atau alokasi resource?`,
      confirmText: "Ya, Batalkan (Drop)",
      cancelText: "Batal",
      variant: "danger",
      onConfirm: () => {
        toggleRockStatus(rock.id, "dropped");
        showToast(`Rock "${rock.title}" telah diubah statusnya menjadi Dropped.`, "info");
      }
    });
  };

  // Reactivate Rock from Completed / Dropped
  const handleReactivateRock = (rock: Rock) => {
    showConfirm({
      title: "Aktifkan Kembali Rock",
      message: `Kembalikan Rock "${rock.title}" menjadi aktif berjalan (On Track)?`,
      confirmText: "Ya, Aktifkan",
      cancelText: "Batal",
      variant: "info",
      onConfirm: () => {
        toggleRockStatus(rock.id, "on_track");
        showToast(`Rock "${rock.title}" kembali berstatus aktif.`, "success");
      }
    });
  };

  // Push Off-Track Rock to Issues (L10 IDS Protocol)
  const handlePushToIssue = (rock: Rock) => {
    showConfirm({
      title: "Eskalasi ke Issue (IDS Meeting)",
      message: `Buat tiket issue otomatis untuk Rock "${rock.title}" agar dibahas pada sesi IDS rapat L10 mingguan?`,
      confirmText: "Ya, Buat Issue",
      cancelText: "Batal",
      variant: "warning",
      onConfirm: () => {
        addIssue({
          departmentId: rock.departmentId,
          title: `[KENDALA ROCK] ${rock.title}`,
          description: `Rock kuartal ${rock.quarter} ${rock.year} berstatus OFF TRACK dan memerlukan pemecahan masalah (Identify, Discuss, Solve - IDS) dalam rapat mingguan. PIC: ${rock.picName}. Batas Waktu: ${rock.dueDate}.`,
          priority: "high",
          status: "open",
          picId: rock.picId,
          picName: rock.picName
        });
        showToast("Issue otomatis berhasil dibuat untuk Rock ini!", "success");
      }
    });
  };

  // Handle Delete Rock
  const handleDeleteRock = (rock: Rock) => {
    showConfirm({
      title: "Hapus Prioritas Rock",
      message: `Apakah Anda yakin ingin menghapus Rock "${rock.title}"? Sub-metrik yang terhubung akan berubah menjadi Metrik Mandiri.`,
      confirmText: "Hapus",
      cancelText: "Batal",
      variant: "danger",
      onConfirm: () => {
        deleteRock(rock.id);
      }
    });
  };

  if (isLoading) {
    return <RocksSkeleton />;
  }

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Rocks
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 font-medium text-sm mt-1">
            {language === "id"
              ? "Prioritas sasaran strategis 90 hari untuk mencapai target kuartalan kunci tim dan perusahaan."
              : "90-day strategic priorities to achieve key quarterly team and organizational milestones."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setNewDeptId(currentProfile.departmentId || "dept-it");
              setNewPicId(currentProfile.id);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-bold rounded-xl shadow-md shadow-zinc-900/10 transition-all cursor-pointer border border-zinc-900 dark:border-zinc-100"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Rock</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Total Prioritas
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{totalRocks}</span>
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">90-Day Goals</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            On Track
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{dynamicOnTrackCount}</span>
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              {totalRocks > 0 ? `${Math.round((dynamicOnTrackCount / totalRocks) * 100)}%` : "0%"}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <span className="text-[11px] font-medium text-rose-600 dark:text-rose-400 uppercase tracking-wider">
            Off Track
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">{dynamicOffTrackCount}</span>
            <span className="text-[11px] font-medium text-rose-500">Perlu IDS</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Selesai / Review
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {dynamicCompletedCount + dynamicReviewCount}
            </span>
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              {dynamicReviewCount > 0 ? `${dynamicReviewCount} Menunggu ACC` : "Tercapai"}
            </span>
          </div>
        </div>
      </div>

      {/* Rocks Unified Filter Bar (Matches Scoreboard & Issues Layout) */}
      <div className="bg-white dark:bg-zinc-900/80 p-3 sm:p-3.5 border border-slate-100 dark:border-zinc-800 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        {/* Left Side: Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {/* Divisi Dropdown */}
          {isOwnerOrDev && (
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

          {/* Kuartal Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">Kuartal :</span>
            <CustomSelect
              value={selectedQuarter}
              onChange={(val) => setSelectedQuarter(val)}
              triggerClass="bg-slate-100 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 px-3 py-1.5 rounded-lg text-xs font-bold"
              options={[
                { value: "all", label: "Semua Kuartal" },
                { value: "Q1", label: "Q1" },
                { value: "Q2", label: "Q2" },
                { value: "Q3", label: "Q3" },
                { value: "Q4", label: "Q4" },
              ]}
            />
          </div>

          {/* Status Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">Status :</span>
            <CustomSelect
              value={selectedStatus}
              onChange={(val) => setSelectedStatus(val)}
              triggerClass="bg-slate-100 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 px-3 py-1.5 rounded-lg text-xs font-bold"
              options={[
                { value: "all", label: "Semua Status" },
                { value: "on_track", label: "🟢 On Track" },
                { value: "off_track", label: "🔴 Off Track (Perlu IDS)" },
                { value: "review", label: "🟡 Siap Review (100%)" },
                { value: "completed", label: "🔵 Selesai" },
                { value: "dropped", label: "⚪ Dropped" },
              ]}
            />
          </div>

          {/* Urutan Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">Urutan :</span>
            <CustomSelect
              value={sortOption}
              onChange={(val) => setSortOption(val)}
              triggerClass="bg-slate-100 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 px-3 py-1.5 rounded-lg text-xs font-bold"
              options={[
                { value: "quarter_desc", label: "Kuartal ↓" },
                { value: "quarter_asc", label: "Kuartal ↑" },
                { value: "title_asc", label: "Judul Rock ↑" },
                { value: "title_desc", label: "Judul Rock ↓" },
                { value: "progress_desc", label: "Progres ↓" },
                { value: "progress_asc", label: "Progres ↑" },
              ]}
            />
          </div>
        </div>

        {/* Right Side: Total Counter Badge */}
        <div className="text-xs font-bold text-slate-500 dark:text-zinc-400 sm:ml-auto">
          Total: <span className="text-slate-900 dark:text-white font-extrabold">{filteredRocks.length} Rocks</span>
        </div>
      </div>

      {/* Rocks List / Grid */}
      {filteredRocks.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <Target className="w-10 h-10 mx-auto text-zinc-400 dark:text-zinc-600 mb-3" />
          <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Tidak ada Prioritas Rock ditemukan</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto">
            Sesuaikan filter di atas atau buat Rock baru untuk periode 90 hari ini.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRocks.map(rock => {
            const { progress, totalMetrics, onTrackMetrics } = getRockProgress(rock.id);
            const statusInfo = getDynamicRockStatus(rock, progress);
            const linkedMetrics = metrics.filter(m => m.rockId === rock.id);
            const isExpanded = !!expandedRockIds[rock.id];

            return (
              <div
                key={rock.id}
                className="rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all p-5 shadow-xs"
              >
                {/* Top Row: Division Badge, Quarter Badge, Deadline (Left) & Dynamic Status, Actions (Right) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
                  {/* Left: Division Badge & Quarter Badge Adjacent */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                      {getDeptName(rock.departmentId)}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/50">
                      {rock.quarter} {rock.year}
                    </span>
                    <span className={`inline-flex items-center gap-1 text-xs ${statusInfo.isOverdue ? "text-rose-600 dark:text-rose-400 font-bold" : "text-zinc-500 dark:text-zinc-400"}`}>
                      <Calendar className="w-3.5 h-3.5" />
                      {statusInfo.isOverdue ? (
                        <span>Lewat {Math.abs(statusInfo.daysRemaining)} hari ({rock.dueDate})</span>
                      ) : statusInfo.daysRemaining === 0 ? (
                        <span>Deadline hari ini! ({rock.dueDate})</span>
                      ) : (
                        <span>Sisa {statusInfo.daysRemaining} hari ({rock.dueDate})</span>
                      )}
                    </span>
                  </div>

                  {/* Right: Dynamic Status Indicator & Actions Menu */}
                  <div className="flex items-center gap-2">
                    {/* Dynamic Status Badge */}
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${statusInfo.badgeClass}`}
                      title={statusInfo.subtext}
                    >
                      <span className={`w-2 h-2 rounded-full ${statusInfo.dotClass}`} />
                      <span>{statusInfo.label}</span>
                    </div>

                    {/* Action Kebab Menu Popover */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuRockId(activeMenuRockId === rock.id ? null : rock.id);
                        }}
                        className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors cursor-pointer"
                        title="Opsi Menu Rock"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuRockId === rock.id && (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="absolute right-0 mt-1.5 w-48 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl z-20 p-1 animate-in fade-in zoom-in-95 duration-100"
                        >
                          <button
                            onClick={() => {
                              setActiveMenuRockId(null);
                              setEditingRock(rock);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-zinc-500" />
                            <span>Edit Rock</span>
                          </button>

                          {/* Leader Exclusive Options: Complete / Reactivate / Drop */}
                          {isOwnerOrDev && (
                            <>
                              {rock.status !== "completed" ? (
                                <button
                                  onClick={() => {
                                    setActiveMenuRockId(null);
                                    handleVerifyComplete(rock);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors cursor-pointer"
                                >
                                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Tandai Selesai</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setActiveMenuRockId(null);
                                    handleReactivateRock(rock);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg transition-colors cursor-pointer"
                                >
                                  <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
                                  <span>Batalkan Selesai</span>
                                </button>
                              )}

                              {rock.status !== "dropped" ? (
                                <button
                                  onClick={() => {
                                    setActiveMenuRockId(null);
                                    handleDropRock(rock);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg transition-colors cursor-pointer"
                                >
                                  <Ban className="w-3.5 h-3.5 text-amber-600" />
                                  <span>Batalkan Rock (Drop)</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setActiveMenuRockId(null);
                                    handleReactivateRock(rock);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                                >
                                  <RotateCcw className="w-3.5 h-3.5 text-zinc-500" />
                                  <span>Aktifkan Kembali</span>
                                </button>
                              )}
                            </>
                          )}

                          <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-1" />

                          <button
                            onClick={() => {
                              setActiveMenuRockId(null);
                              handleDeleteRock(rock);
                            }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Hapus Rock</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Main Content: Title, Description, PIC */}
                <div className="mt-3">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                    {rock.title}
                  </h3>
                  {rock.description && (
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                      {rock.description}
                    </p>
                  )}
                  <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                    Penanggung Jawab (PIC): <span className="font-semibold text-zinc-800 dark:text-zinc-200">{rock.picName}</span>
                  </div>
                </div>

                {/* Progress Bar & Sub-Metrics Status */}
                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
                      <BarChart3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      Progres Pencapaian: <strong className="text-zinc-900 dark:text-zinc-100">{progress}%</strong>
                    </span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {totalMetrics > 0
                        ? `${onTrackMetrics} dari ${totalMetrics} Sub-Metrik On Track`
                        : "Target Prioritas Mandiri"}
                    </span>
                  </div>

                  {/* Clean Minimalist Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        rock.status === "completed" || progress >= 100
                          ? "bg-emerald-500"
                          : statusInfo.isOffTrack
                          ? "bg-rose-500"
                          : statusInfo.isReadyForReview
                          ? "bg-amber-500"
                          : "bg-blue-600"
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                    />
                  </div>
                </div>

                {/* Sub-Metrics Accordion Toggle & Scoreboard Link */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                  <button
                    onClick={() => toggleExpand(rock.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-blue-500" />
                    <span>
                      {isExpanded ? "Sembunyikan Sub-Metrik" : `Lihat ${linkedMetrics.length} Sub-Metrik Scoreboard`}
                    </span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Quick Action: Leader Verify & Complete Button (when 100% and role is Owner / Developer) */}
                    {statusInfo.isReadyForReview && isOwnerOrDev && (
                      <button
                        onClick={() => handleVerifyComplete(rock)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
                        title="Verifikasi dan selesaikan Rock ini secara resmi"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verifikasi Selesai</span>
                      </button>
                    )}

                    {/* Quick Action: Eskalasi ke Issue (IDS) if Off Track */}
                    {statusInfo.isOffTrack && (
                      <button
                        onClick={() => handlePushToIssue(rock)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
                        title="Eskalasi ke Issue untuk dibahas di rapat IDS"
                      >
                        <AlertOctagon className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                        <span>Lempar ke Issue</span>
                      </button>
                    )}

                    <Link
                      href="/scoreboard"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 shadow-2xs transition-colors"
                    >
                      <span>Buka di Scoreboard</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Expanded Sub-Metrics Table */}
                {isExpanded && (
                  <div className="mt-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400 pb-1 border-b border-zinc-200 dark:border-zinc-800">
                      <span>Nama Sub-Metrik (Scoreboard KPI)</span>
                      <span>Target & PIC</span>
                    </div>

                    {linkedMetrics.length === 0 ? (
                      <div className="py-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
                        Belum ada metrik Scoreboard yang dihubungkan ke Rock ini.
                        <div className="mt-1">
                          <Link href="/scoreboard" className="text-blue-600 hover:underline font-semibold">
                            + Tambah Sub-Metrik di Scoreboard
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {linkedMetrics.map(m => (
                          <div
                            key={m.id}
                            className="flex items-center justify-between p-2 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-500" />
                              <span className="font-medium text-zinc-900 dark:text-zinc-100">{m.name}</span>
                            </div>
                            <div className="flex items-center gap-3 text-zinc-600 dark:text-zinc-400">
                              <span>Target: <strong className="text-zinc-800 dark:text-zinc-200">{m.target} {m.unit}</strong></span>
                              <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                                {m.picName}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Tambah Rock */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Tambah Prioritas Rock (90 Hari)
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRock} className="p-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Judul Rock (Sasaran 90 Hari) *
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Contoh: Implementasi POS & Kasir Baru Seluruh Outlet"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Deskripsi / Kriteria Sukses
                </label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Penjelasan detail apa yang menandakan Rock ini sukses dicapai..."
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Divisi Penanggung Jawab
                  </label>
                  <select
                    value={newDeptId}
                    disabled={!isOwnerOrDev}
                    onChange={e => setNewDeptId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} Division
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    PIC (Person In Charge)
                  </label>
                  <select
                    value={newPicId}
                    onChange={e => setNewPicId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {allProfiles.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.role.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Kuartal
                  </label>
                  <select
                    value={newQuarter}
                    onChange={e => setNewQuarter(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Q1">Q1 (Jan-Mar)</option>
                    <option value="Q2">Q2 (Apr-Jun)</option>
                    <option value="Q3">Q3 (Jul-Sep)</option>
                    <option value="Q4">Q4 (Okt-Des)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Tahun
                  </label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={e => setNewYear(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Batas Waktu (Due Date)
                  </label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={e => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Progres Mandiri Awal (%)
                  <span className="text-[11px] font-normal text-zinc-500 dark:text-zinc-400 ml-1">
                    (Jika Rock tidak terhubung ke sub-metrik Scoreboard)
                  </span>
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={newInitialProgress}
                  onChange={e => setNewInitialProgress(Number(e.target.value))}
                  placeholder="0 - 100"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
                >
                  Simpan Rock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Rock */}
      {editingRock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Edit Prioritas Rock
                </h3>
              </div>
              <button
                onClick={() => setEditingRock(null)}
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateRock} className="p-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Judul Rock *
                </label>
                <input
                  type="text"
                  required
                  value={editingRock.title}
                  onChange={e => setEditingRock({ ...editingRock, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Deskripsi / Kriteria Sukses
                </label>
                <textarea
                  rows={2}
                  value={editingRock.description || ""}
                  onChange={e => setEditingRock({ ...editingRock, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Status Manajemen
                  </label>
                  <select
                    value={editingRock.status}
                    onChange={e => setEditingRock({ ...editingRock, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="on_track">🟢 Aktif (Otomatis)</option>
                    <option value="completed">🔵 Selesai (ACC Direksi)</option>
                    <option value="dropped">⚪ Dropped (Dibatalkan)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    PIC (Person In Charge)
                  </label>
                  <select
                    value={editingRock.picId}
                    onChange={e => {
                      const sel = allProfiles.find(p => p.id === e.target.value);
                      setEditingRock({
                        ...editingRock,
                        picId: e.target.value,
                        picName: sel ? sel.name : editingRock.picName
                      });
                    }}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {allProfiles.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.role.toUpperCase()})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Kuartal
                  </label>
                  <select
                    value={editingRock.quarter}
                    onChange={e => setEditingRock({ ...editingRock, quarter: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Q1">Q1</option>
                    <option value="Q2">Q2</option>
                    <option value="Q3">Q3</option>
                    <option value="Q4">Q4</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Batas Waktu (Due Date)
                  </label>
                  <input
                    type="date"
                    value={editingRock.dueDate}
                    onChange={e => setEditingRock({ ...editingRock, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Progress Override (for rocks without sub-metrics) */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Progres Mandiri (%)
                  <span className="text-[11px] font-normal text-zinc-500 dark:text-zinc-400 ml-1">
                    (Hanya digunakan jika tidak ada sub-metrik di Scoreboard)
                  </span>
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={editingRock.progress ?? 0}
                  onChange={e => setEditingRock({ ...editingRock, progress: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRock(null)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
