"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { History, Search, Filter, User } from "lucide-react";
import CustomSelect from "@/components/CustomSelect";
import HistorySkeleton from "@/components/skeletons/HistorySkeleton";

export default function HistoryPage() {
  const {
    currentProfile,
    departments,
    getFilteredData,
    language,
    isLoading
  } = useApp();

  const { historyLogs } = getFilteredData();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActionFilter, setSelectedActionFilter] = useState("all");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("all");

  const isOwner = currentProfile.role === "owner";
  const isDeveloper = currentProfile.role === "developer";
  const canViewAll = isOwner || isDeveloper;

  const getDeptName = (id: string | null) => {
    if (!id) return "Global";
    const dept = departments.find(d => d.id === id);
    return dept ? dept.name : "PIC";
  };

  // Get unique action types for filter
  const uniqueActions = ["all", ...Array.from(new Set(historyLogs.map(l => l.action)))];

  // Filter logs
  const filteredLogs = historyLogs.filter(log => {
    // 1. Division filter (only for owner/developer)
    if (canViewAll && selectedDeptFilter !== "all" && log.departmentId !== selectedDeptFilter) {
      return false;
    }

    // 2. Search Query filter
    const matchesSearch =
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.profileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());

    // 3. Action filter
    const matchesAction = selectedActionFilter === "all" ? true : log.action === selectedActionFilter;

    return matchesSearch && matchesAction;
  });

  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case "Fill Metric":
      case "FILL DAILY METRICS":
        return "bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-600";
      case "Create Metric":
      case "CREATE METRIC":
        return "bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-600";
      case "Complete Todo":
        return "bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-600";
      case "Create Todo":
        return "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700";
      case "Create Issue":
        return "bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-600";
      case "Update Issue":
        return "bg-zinc-100 text-zinc-700 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-600";
      default:
        return "bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700";
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
    } catch (e) { }
    return dateStr;
  };

  if (isLoading) {
    return <HistorySkeleton />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {language === "id" ? "Histori" : "Audit Log"}
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 font-medium text-sm mt-1">
            {language === "id"
              ? "Rekam jejak kronologis setiap aksi, perubahan data, dan aktivitas pengguna di seluruh sistem."
              : "Chronological audit trail of system activities, data changes, and operational events."}
          </p>
        </div>
      </div>

      {/* Filter and Search Row */}
      <div className="bg-white dark:bg-zinc-900/80 border border-slate-100 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center p-4">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari aktivitas..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-amber-500/20 text-slate-900 dark:text-white font-medium"
          />
        </div>

        {/* Action Type & Division Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />

          <CustomSelect
            value={selectedActionFilter}
            onChange={(val) => setSelectedActionFilter(val)}
            triggerClass="bg-slate-100 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white px-3 py-1.5 rounded-xl text-xs font-bold"
            options={uniqueActions.map((act) => ({
              value: act,
              label: act === "all" ? "Semua Aksi" : act,
            }))}
          />

          {canViewAll && (
            <div className="flex items-center gap-1.5 sm:border-l border-slate-200 dark:border-zinc-800 sm:pl-3">
              <CustomSelect
                value={selectedDeptFilter}
                onChange={(val) => setSelectedDeptFilter(val)}
                triggerClass="bg-slate-100 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white px-3 py-1.5 rounded-xl text-xs font-bold"
                options={[
                  { value: "all", label: "Semua Divisi" },
                  ...departments.map((d) => ({ value: d.id, label: d.name })),
                ]}
              />
            </div>
          )}

          {(selectedActionFilter !== "all" || selectedDeptFilter !== "all" || searchQuery !== "") && (
            <button
              type="button"
              onClick={() => {
                setSelectedActionFilter("all");
                setSelectedDeptFilter("all");
                setSearchQuery("");
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Timeline Logs Container */}
      <div className="bg-white dark:bg-zinc-900/80 border border-slate-100 dark:border-zinc-800 rounded-2xl shadow-sm p-6">
        <div className="relative border-l border-slate-200 dark:border-zinc-700 pl-6 space-y-8 py-2">

          {filteredLogs.map((log) => {
            const logDept = departments.find(d => d.id === log.departmentId);
            return (
              <div key={log.id} className="relative">
                {/* Timeline Dot Indicator */}
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white dark:bg-zinc-900 border-2 border-zinc-400 dark:border-zinc-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-zinc-500 dark:bg-zinc-400" />
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 bg-slate-50/50 dark:bg-zinc-900/50 p-4 border border-slate-100 dark:border-zinc-800 rounded-xl">
                  <div className="space-y-1.5">
                    {/* User and Action */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {log.profileName}
                      </span>
                      <span className={`px-2 py-0.5 text-[8px] font-extrabold uppercase rounded border ${getActionBadgeColor(log.action)}`}>
                        {log.action}
                      </span>
                      {canViewAll && (
                        <span className="px-2 py-0.5 text-[8px] font-extrabold rounded uppercase badge-glass">
                          {logDept?.name ?? "Global"}
                        </span>
                      )}
                    </div>
                    {/* Detail content */}
                    <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                      {log.details}
                    </p>
                  </div>

                  {/* Timestamp */}
                  <div className="text-[10px] text-slate-400 font-bold self-start md:self-center bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-100 dark:border-slate-800">
                    {formatLogDate(log.createdAt)}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
            <div className="text-center py-12 -ml-6">
              <History className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-750 dark:text-slate-300">Aktivitas tidak ditemukan</h3>
              <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter aksi.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
