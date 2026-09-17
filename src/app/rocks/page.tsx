"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp, Rock, Metric } from "@/context/AppContext";
import {
  Target,
  Plus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronUp,
  Edit3,
  Trash2,
  AlertOctagon,
  ArrowRight,
  TrendingUp,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  BarChart3,
  X
} from "lucide-react";
import RocksSkeleton from "@/components/skeletons/RocksSkeleton";

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
  const [expandedRockIds, setExpandedRockIds] = useState<Record<string, boolean>>({});

  // Add Rock Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDeptId, setNewDeptId] = useState(currentProfile.departmentId || "dept-it");
  const [newPicId, setNewPicId] = useState(currentProfile.id);
  const [newQuarter, setNewQuarter] = useState<"Q1" | "Q2" | "Q3" | "Q4">("Q3");
  const [newYear, setNewYear] = useState<number>(2026);
  const [newDueDate, setNewDueDate] = useState("2026-09-30");

  // Edit Rock Modal
  const [editingRock, setEditingRock] = useState<Rock | null>(null);

  // Toggle accordion expand
  const toggleExpand = (rockId: string) => {
    setExpandedRockIds(prev => ({ ...prev, [rockId]: !prev[rockId] }));
  };

  const getDeptName = (id: string | null) => {
    if (!id) return "Semua Divisi";
    const dept = departments.find(d => d.id === id);
    return dept ? dept.name : "Divisi";
  };

  // Filtered Rocks
  const filteredRocks = rocks.filter(rock => {
    if (selectedQuarter !== "all" && rock.quarter !== selectedQuarter) return false;
    if (selectedStatus !== "all" && rock.status !== selectedStatus) return false;
    if (isOwnerOrDev && selectedDeptFilter !== "all" && rock.departmentId !== selectedDeptFilter) return false;
    return true;
  });

  // Calculate global summary counters
  const totalRocks = rocks.length;
  const onTrackRocks = rocks.filter(r => r.status === "on_track").length;
  const offTrackRocks = rocks.filter(r => r.status === "off_track").length;
  const completedRocks = rocks.filter(r => r.status === "completed").length;

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
      picId: pic.id,
      picName: pic.name,
      dueDate: newDueDate
    });

    setIsAddModalOpen(false);
    setNewTitle("");
    setNewDesc("");
  };

  // Handle Edit Rock
  const handleUpdateRock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRock || !editingRock.title.trim()) return;

    editRock(editingRock.id, {
      title: editingRock.title,
      description: editingRock.description,
      departmentId: editingRock.departmentId,
      picId: editingRock.picId,
      picName: editingRock.picName,
      quarter: editingRock.quarter,
      year: editingRock.year,
      dueDate: editingRock.dueDate,
      status: editingRock.status
    });

    setEditingRock(null);
  };

  // Handle Push Off-Track Rock to Issues (L10 IDS Protocol)
  const handlePushToIssue = (rock: Rock) => {
    showConfirm({
      title: "Eskalasi ke Issue (IDS Meeting)",
      message: `Buat tiket issue otomatis untuk Rock "${rock.title}" agar dibahas pada sesi IDS rapat L10?`,
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
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/60">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Rocks (Prioritas 90 Hari)
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Target kuartalan strategis Traction L10 — PT Garciafood Nusantara Gemilang
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setNewDeptId(currentProfile.departmentId || "dept-it");
              setNewPicId(currentProfile.id);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Rock</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Total Prioritas
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{totalRocks}</span>
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">90-Day Goals</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            On Track
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{onTrackRocks}</span>
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              {totalRocks > 0 ? `${Math.round((onTrackRocks / totalRocks) * 100)}%` : "0%"}
            </span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <span className="text-[11px] font-medium text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Off Track
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{offTrackRocks}</span>
            <span className="text-[11px] font-medium text-rose-500">Perlu IDS</span>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
          <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Selesai (Completed)
          </span>
          <div className="flex items-baseline justify-between mt-1">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{completedRocks}</span>
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Tercapai</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
        <div className="flex flex-wrap items-center gap-2">
          {/* Quarter Filter */}
          <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5 text-xs">
            {["all", "Q1", "Q2", "Q3", "Q4"].map(q => (
              <button
                key={q}
                onClick={() => setSelectedQuarter(q)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  selectedQuarter === q
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                {q === "all" ? "Semua Kuartal" : q}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-0.5 text-xs">
            {[
              { id: "all", label: "Semua Status" },
              { id: "on_track", label: "On Track" },
              { id: "off_track", label: "Off Track" },
              { id: "completed", label: "Selesai" }
            ].map(st => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  selectedStatus === st.id
                    ? "bg-blue-600 text-white font-semibold"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Division Filter for Owner / Developer */}
        {isOwnerOrDev && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Divisi:</span>
            <select
              value={selectedDeptFilter}
              onChange={e => setSelectedDeptFilter(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Semua Divisi (Global)</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Rocks List / Grid */}
      {filteredRocks.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
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
            const linkedMetrics = metrics.filter(m => m.rockId === rock.id);
            const isExpanded = !!expandedRockIds[rock.id];

            return (
              <div
                key={rock.id}
                className="rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all p-5"
              >
                {/* Top Row: Department, Quarter, Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      <Building2 className="w-3 h-3" />
                      {getDeptName(rock.departmentId)}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/50">
                      {rock.quarter} {rock.year}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Deadline: <strong className="text-zinc-700 dark:text-zinc-300">{rock.dueDate}</strong>
                    </span>
                  </div>

                  {/* Status Badges with Quick Toggle */}
                  <div className="flex items-center gap-2">
                    <select
                      value={rock.status}
                      onChange={e => toggleRockStatus(rock.id, e.target.value as Rock["status"])}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-md border transition-colors cursor-pointer focus:outline-none ${
                        rock.status === "on_track"
                          ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800"
                          : rock.status === "off_track"
                          ? "bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800"
                          : rock.status === "completed"
                          ? "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-800"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-700"
                      }`}
                    >
                      <option value="on_track">🟢 On Track</option>
                      <option value="off_track">🔴 Off Track (Perlu IDS)</option>
                      <option value="completed">🔵 Selesai</option>
                      <option value="dropped">⚪ Dropped</option>
                    </select>

                    <button
                      onClick={() => setEditingRock(rock)}
                      className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                      title="Edit Rock"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteRock(rock)}
                      className="p-1.5 rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/30 text-zinc-500 hover:text-rose-600 transition-colors"
                      title="Hapus Rock"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Main Content: Title, Description, PIC */}
                <div className="mt-3">
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
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
                      Progres Pencapaian Rock: <strong className="text-zinc-900 dark:text-zinc-100">{progress}%</strong>
                    </span>
                    <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      {totalMetrics > 0
                        ? `${onTrackMetrics} dari ${totalMetrics} Sub-Metrik On Track`
                        : "Belum ada Sub-Metrik Scoreboard"}
                    </span>
                  </div>

                  {/* Clean Minimalist Progress Bar */}
                  <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        rock.status === "completed" || progress >= 90
                          ? "bg-emerald-500"
                          : rock.status === "off_track"
                          ? "bg-rose-500"
                          : "bg-blue-600"
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                    />
                  </div>
                </div>

                {/* Sub-Metrics Accordion & Action Buttons */}
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                  <button
                    onClick={() => toggleExpand(rock.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5 text-blue-500" />
                    <span>
                      {isExpanded ? "Sembunyikan Sub-Metrik" : `Lihat ${linkedMetrics.length} Sub-Metrik Scoreboard`}
                    </span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <div className="flex items-center gap-2">
                    {/* If Off Track, show quick button to raise as an Issue for IDS meeting */}
                    {rock.status === "off_track" && (
                      <button
                        onClick={() => handlePushToIssue(rock)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-900 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"
                      >
                        <AlertOctagon className="w-3.5 h-3.5" />
                        <span>🚨 Lempar ke Issue (IDS)</span>
                      </button>
                    )}

                    <Link
                      href="/scoreboard"
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 transition-colors"
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
                      <span>Nama Sub-Metrik (Judul Kecil)</span>
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
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRock} className="p-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Judul Rock (Target Besar 90 Hari) *
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

              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
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
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
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
                    Status
                  </label>
                  <select
                    value={editingRock.status}
                    onChange={e => setEditingRock({ ...editingRock, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="on_track">🟢 On Track</option>
                    <option value="off_track">🔴 Off Track</option>
                    <option value="completed">🔵 Selesai</option>
                    <option value="dropped">⚪ Dropped</option>
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

              <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingRock(null)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors"
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
