"use client";

import React, { useState } from "react";
import { useApp, Issue, AttachmentInfo } from "@/context/AppContext";
import { Plus, AlertCircle, Calendar, User, FileText, AlertOctagon, HelpCircle, Paperclip, Edit3, Trash2, RefreshCw, Link as LinkIcon, ExternalLink, Loader2 } from "lucide-react";
import UniversalConvertModal, { UniversalConvertItem } from "@/components/UniversalConvertModal";
import IssueDetailModal from "@/components/issues/IssueDetailModal";
import CustomSelect from "@/components/CustomSelect";
import IssuesSkeleton from "@/components/skeletons/IssuesSkeleton";
import { compressImageFile } from "@/lib/imageCompressor";

export default function IssuesPage() {
  const {
    currentProfile,
    departments,
    issues,
    addIssue,
    editIssue,
    deleteIssue,
    updateIssueStatus,
    updateIssuePriority,
    getFilteredData,
    language,
    isLoading,
    showToast,
    showConfirm
  } = useApp();

  const { issues: filteredIssues } = getFilteredData();

  // Filters
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  // Modal Add Issue state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState<Issue["priority"]>("medium");
  const [newDept, setNewDept] = useState("");

  // Modal Edit Issue state
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPriority, setEditPriority] = useState<Issue["priority"]>("medium");
  const [editDept, setEditDept] = useState("");
  const [editStatus, setEditStatus] = useState<Issue["status"]>("open");
  const [editPicName, setEditPicName] = useState("");

  const handleOpenEditIssue = (issue: Issue) => {
    setEditingIssue(issue);
    setEditTitle(issue.title);
    setEditDesc(issue.description || "");
    setEditPriority(issue.priority);
    setEditDept(issue.departmentId);
    setEditStatus(issue.status);
    setEditPicName(issue.picName);
  };

  const handleSaveEditIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIssue) return;
    if (!editTitle.trim()) {
      alert("⚠️ Harap isi judul issue terlebih dahulu.");
      return;
    }

    editIssue(editingIssue.id, {
      title: editTitle.trim(),
      description: editDesc.trim(),
      priority: editPriority,
      departmentId: editDept || editingIssue.departmentId,
      status: editStatus,
      picName: editPicName.trim() || editingIssue.picName
    });

    setEditingIssue(null);
  };

  // File & Link upload state
  const [attachmentFiles, setAttachmentFiles] = useState<AttachmentInfo[]>([]);
  const [linkInputUrl, setLinkInputUrl] = useState("");
  const [linkInputName, setLinkInputName] = useState("");

  // Universal Convert state
  const [convertItem, setConvertItem] = useState<UniversalConvertItem | null>(null);

  // Detail Issue Modal state
  const [detailIssue, setDetailIssue] = useState<Issue | null>(null);

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(async (file) => {
      try {
        const compressed = await compressImageFile(file);
        setAttachmentFiles((prev) => [
          ...prev,
          {
            name: compressed.name,
            size: compressed.size,
            type: compressed.type,
            dataUrl: compressed.dataUrl
          }
        ]);
      } catch (err) {
        console.error("Compress error:", err);
      }
    });
  };

  const handleAddLink = () => {
    if (!linkInputUrl.trim()) return;
    let formattedUrl = linkInputUrl.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl;
    }
    const newLinkItem: AttachmentInfo = {
      name: linkInputName.trim() || formattedUrl,
      size: 0,
      type: "link",
      dataUrl: formattedUrl
    };
    setAttachmentFiles((prev) => [...prev, newLinkItem]);
    setLinkInputUrl("");
    setLinkInputName("");
  };

  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const downloadAttachment = (name: string, dataUrl?: string, type?: string) => {
    if (!dataUrl) {
      alert("File data tidak ditemukan.");
      return;
    }

    try {
      const parts = dataUrl.split(",");
      if (parts.length < 2) {
        window.open(dataUrl, "_blank");
        return;
      }
      const mime = parts[0].match(/:(.*?);/)?.[1] || type || "application/octet-stream";
      const bstr = atob(parts[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const blob = new Blob([u8arr], { type: mime });
      const blobUrl = URL.createObjectURL(blob);

      if (mime === "application/pdf" || mime.startsWith("image/")) {
        const opened = window.open(blobUrl, "_blank");
        if (!opened) {
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = name;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (e) {
      console.error("Error opening file blob:", e);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const roleLower = (currentProfile.role || "").toLowerCase();
  const isOwner = roleLower === "owner";
  const isDeveloper = roleLower === "developer";
  const canViewAll = isOwner || isDeveloper;

  // Filter list
  const displayedIssues = filteredIssues.filter(i => {
    // 1. Division filter (only for owner/developer)
    if (canViewAll && selectedDeptFilter !== "all" && i.departmentId !== selectedDeptFilter) {
      return false;
    }
    // 2. Status filter
    if (statusFilter !== "all" && i.status !== statusFilter) {
      return false;
    }
    // 3. Priority filter
    if (priorityFilter !== "all" && i.priority !== priorityFilter) {
      return false;
    }
    return true;
  });

  // Sorting State (Matching Scoreboard Unified Sort Filter)
  const [sortOption, setSortOption] = useState<string>("status_asc");
  const [sortBy, setSortBy] = useState<string>("status");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSortChange = (val: string) => {
    setSortOption(val);
    const [field, order] = val.split("_");
    setSortBy(field);
    setSortOrder(order as "asc" | "desc");
  };

  const issueStatusRank: Record<string, number> = { open: 1, in_progress: 2, solved: 3, closed: 3, resolved: 3 };
  const priorityRank: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };

  const sortedIssues = [...displayedIssues].sort((a, b) => {
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

  const getDeptName = (id: string | null) => {
    if (!id) return "Global";
    const dept = departments.find(d => d.id === id);
    return dept ? dept.name : "PIC";
  };

  const getPriorityStyles = (p: string) => {
    switch (p) {
      case "critical": return "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/50 font-black animate-pulse";
      case "high": return "bg-red-50 text-red-600 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50";
      case "medium": return "bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50";
      default: return "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700/50";
    }
  };

  const getStatusStyles = (s: string) => {
    switch (s) {
      case "open": return "bg-red-100/60 dark:bg-red-950/20 text-red-600 dark:text-red-400";
      case "in_progress": return "bg-amber-100/60 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400";
      case "solved": return "bg-emerald-100/60 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400";
      default: return "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400";
    }
  };

  const getPriorityTextColor = (priority: Issue["priority"]) => {
    switch (priority) {
      case "low":
        return "text-slate-500 dark:text-zinc-400";
      case "medium":
        return "text-amber-600 dark:text-amber-400";
      case "high":
        return "text-orange-600 dark:text-orange-400";
      case "critical":
        return "text-rose-600 dark:text-rose-400 font-extrabold";
      default:
        return "text-slate-700 dark:text-zinc-300";
    }
  };

  const getStatusTextColor = (status: Issue["status"]) => {
    switch (status) {
      case "open":
        return "text-rose-600 dark:text-rose-400";
      case "in_progress":
        return "text-amber-600 dark:text-amber-400";
      case "solved":
        return "text-emerald-600 dark:text-emerald-400";
      case "closed":
        return "text-slate-500 dark:text-zinc-400";
      default:
        return "text-slate-700 dark:text-zinc-300";
    }
  };

  const getStatusLabel = (status: Issue["status"]) => {
    switch (status) {
      case "open":
        return "Open";
      case "in_progress":
        return "In Progress";
      case "solved":
        return "Solved";
      case "closed":
        return "Closed";
      default:
        return status;
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && !navigator.onLine) {
      showToast("Koneksi terputus! Mohon periksa internet Anda sebelum menyimpan.", "error");
      return;
    }
    setIsSubmitting(true);
    try {
      const targetDept = canViewAll
        ? (newDept || departments[0]?.id || "dept-kitchen")
        : (currentProfile.departmentId || departments[0]?.id || "dept-kitchen");

      await addIssue({
        departmentId: targetDept,
        title: newTitle,
        description: newDesc,
        priority: newPriority,
        status: "open",
        picId: currentProfile.id,
        picName: currentProfile.name,
        attachments: attachmentFiles
      });

      setIsAddOpen(false);
      setNewTitle("");
      setNewDesc("");
      setNewPriority("medium");
      setNewDept("");
      setAttachmentFiles([]);
    } catch (err) {
      showToast("Gagal menyimpan issue. Silakan coba lagi.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCardDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const options: Intl.DateTimeFormatOptions = {
        day: "numeric",
        month: "short",
        year: "numeric"
      };
      return d.toLocaleDateString("id-ID", options);
    } catch (e) {
      return dateStr;
    }
  };

  const statuses = [
    { key: "all", label: "Semua" },
    { key: "open", label: "Open" },
    { key: "in_progress", label: "In Progress" },
    { key: "solved", label: "Solved" },
    { key: "closed", label: "Closed" }
  ];

  if (isLoading) {
    return <IssuesSkeleton />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {language === "id" ? "Issue" : "Issues"}
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 font-medium text-sm mt-1">
            {language === "id"
              ? "Identifikasi, diskusikan, dan tuntaskan kendala serta hambatan operasional (IDS) tim."
              : "Identify, discuss, and solve operational roadblocks and cross-functional challenges."}
          </p>
        </div>

        <button
          onClick={() => {
            setIsAddOpen(true);
            setNewDept(currentProfile.departmentId || departments[0]?.id || "");
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-bold rounded-xl shadow-md shadow-zinc-900/10 transition-all cursor-pointer border border-zinc-900 dark:border-zinc-100"
        >
          <Plus className="w-4 h-4" /> Buat Issue Baru
        </button>
      </div>

      {/* Filter Row (Scoreboard Parity Design) */}
      <div className="bg-white dark:bg-zinc-900/80 p-3 sm:p-3.5 border border-slate-100 dark:border-zinc-800 rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {/* Division Filter Dropdown (First, matching Scoreboard) */}
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

          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">Status :</span>
            <CustomSelect
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              triggerClass="bg-slate-100 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 px-3 py-1.5 rounded-lg text-xs font-bold"
              options={[
                { value: "all", label: "Semua Status" },
                { value: "open", label: "Terbuka (Open)" },
                { value: "in_progress", label: "Dalam Proses" },
                { value: "solved", label: "Tuntas (Solved)" },
                { value: "closed", label: "Ditutup (Closed)" },
              ]}
            />
          </div>

          {/* Priority Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">Prioritas :</span>
            <CustomSelect
              value={priorityFilter}
              onChange={(val) => setPriorityFilter(val)}
              triggerClass="bg-slate-100 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 px-3 py-1.5 rounded-lg text-xs font-bold"
              options={[
                { value: "all", label: "Semua Prioritas" },
                { value: "low", label: "Rendah (Low)" },
                { value: "medium", label: "Sedang (Medium)" },
                { value: "high", label: "Tinggi (High)" },
                { value: "critical", label: "Kritis (Critical)" },
              ]}
            />
          </div>

          {/* Urutan Dropdown (Scoreboard Unified Format) */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 dark:text-zinc-400">Urutan :</span>
            <CustomSelect
              value={sortOption}
              onChange={handleSortChange}
              triggerClass="bg-slate-100 dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 px-3 py-1.5 rounded-lg text-xs font-bold"
              options={[
                { value: "status_asc", label: "Status ↑" },
                { value: "status_desc", label: "Status ↓" },
                { value: "dept_asc", label: "Divisi ↑" },
                { value: "dept_desc", label: "Divisi ↓" },
                { value: "priority_asc", label: "Prioritas ↑" },
                { value: "priority_desc", label: "Prioritas ↓" },
                { value: "title_asc", label: "Judul Kendala ↑" },
                { value: "title_desc", label: "Judul Kendala ↓" },
              ]}
            />
          </div>
        </div>

        {/* Reset Filter Button */}
        {(statusFilter !== "all" || selectedDeptFilter !== "all" || priorityFilter !== "all") && (
          <button
            type="button"
            onClick={() => {
              setStatusFilter("all");
              setSelectedDeptFilter("all");
              setPriorityFilter("all");
            }}
            className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Issues Table Card (Desktop only) */}
      <div className="hidden md:block bg-white border border-slate-100 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Issue / Kendala</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[100px]">Divisi</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[120px]">Prioritas</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[155px]">Status</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[120px]">PIC</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[140px]">Dibuat</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center w-[100px]">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {sortedIssues.map((issue) => {
                const dept = departments.find(d => d.id === issue.departmentId);

                return (
                  <tr
                    key={issue.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors"
                  >
                    {/* Issue name & detail */}
                    <td className="p-4">
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-snug">
                          {issue.title}
                        </h4>
                        {issue.description && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 whitespace-pre-line break-words leading-relaxed">
                            {issue.description}
                          </p>
                        )}
                        {issue.attachments && issue.attachments.length > 0 && (() => {
                          const linkAndDocAtts = issue.attachments.filter(
                            (att) => att.type === "link" || att.dataUrl?.startsWith("http") || !att.type.startsWith("image/")
                          );
                          const imageAtts = issue.attachments.filter(
                            (att) => att.type.startsWith("image/") && att.type !== "link" && !att.dataUrl?.startsWith("http")
                          );

                          return (
                            <div className="mt-3 space-y-2.5">
                              {/* 1. Links & Documents (Atas) */}
                              {linkAndDocAtts.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                  {linkAndDocAtts.map((att, idx) => (
                                    <div key={idx} className="flex items-center">
                                      {att.type === "link" || att.dataUrl?.startsWith("http") ? (
                                        <a
                                          href={att.dataUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 rounded-xl text-[10px] font-bold text-blue-700 dark:text-blue-300 transition-all text-left shadow-2xs group"
                                        >
                                          <ExternalLink className="w-3.5 h-3.5 text-blue-500 shrink-0 group-hover:scale-110 transition-transform" />
                                          <span className="truncate max-w-[180px]">{att.name}</span>
                                        </a>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => downloadAttachment(att.name, att.dataUrl, att.type)}
                                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 border border-slate-200 dark:border-zinc-800 rounded-xl text-[10px] font-bold text-slate-600 dark:text-slate-400 transition-all text-left shadow-2xs"
                                        >
                                          <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                          <span className="truncate max-w-[180px]">{att.name}</span>
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* 2. Images / Gambar (Bawah - Sejajar & Rapi) */}
                              {imageAtts.length > 0 && (
                                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                                  {imageAtts.map((att, idx) => (
                                    <div
                                      key={idx}
                                      className="relative w-14 h-14 rounded-xl border border-slate-250 dark:border-zinc-800 overflow-hidden bg-slate-100 dark:bg-zinc-900 flex items-center justify-center group cursor-pointer shadow-2xs hover:shadow-md hover:border-red-400 dark:hover:border-red-600 transition-all"
                                      onClick={() => setLightboxImage(att.dataUrl || null)}
                                      title={att.name || "Gambar Lampiran"}
                                    >
                                      <img src={att.dataUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200" alt={att.name || "attachment"} />
                                      <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-[9px] text-white font-bold bg-black/60 px-1.5 py-0.5 rounded">Zoom</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </td>

                    {/* Division */}
                    <td className="p-4 text-center">
                      <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300">
                        {dept?.name || "Global"}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="p-4 text-center">
                      <span className={`text-xs font-bold capitalize ${getPriorityTextColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4 text-center">
                      <span className={`text-xs font-bold ${getStatusTextColor(issue.status)}`}>
                        {getStatusLabel(issue.status)}
                      </span>
                    </td>

                    {/* PIC */}
                    <td className="p-4 text-center text-xs font-semibold text-slate-600 dark:text-slate-400">
                      {issue.picName}
                    </td>

                    {/* Dibuat */}
                    <td className="p-4 text-center text-xs text-slate-400 font-semibold">
                      {formatCardDate(issue.createdAt)}
                    </td>

                    {/* Aksi */}
                    <td className="p-4 text-center">
                      <button
                        type="button"
                        onClick={() => setDetailIssue(issue)}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 rounded-lg text-xs font-bold transition-all inline-flex items-center justify-center shadow-2xs hover:shadow-xs cursor-pointer border border-slate-200/80 dark:border-zinc-700"
                        title="Lihat Detail Masalah / Issue"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                );
              })}

              {sortedIssues.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-slate-400 font-medium">
                    Tidak ada issue/kendala yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile view: List of Cards */}
      <div className="block md:hidden space-y-4">
        {sortedIssues.map((issue) => {
          const dept = departments.find(d => d.id === issue.departmentId);

          return (
            <div key={issue.id} className="bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850 rounded-xl p-5 shadow-sm space-y-3.5">
              {/* Card Header: Title & Priority */}
              <div className="flex justify-between items-start gap-3">
                <div className="space-y-1 flex-grow">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    {issue.title}
                  </h4>
                  {issue.description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      {issue.description}
                    </p>
                  )}
                  {issue.attachments && issue.attachments.length > 0 && (() => {
                    const linkAndDocAtts = issue.attachments.filter(
                      (att) => att.type === "link" || att.dataUrl?.startsWith("http") || !att.type.startsWith("image/")
                    );
                    const imageAtts = issue.attachments.filter(
                      (att) => att.type.startsWith("image/") && att.type !== "link" && !att.dataUrl?.startsWith("http")
                    );

                    return (
                      <div className="mt-3 space-y-2.5">
                        {/* 1. Links & Documents (Atas) */}
                        {linkAndDocAtts.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {linkAndDocAtts.map((att, idx) => (
                              <div key={idx} className="flex items-center">
                                {att.type === "link" || att.dataUrl?.startsWith("http") ? (
                                  <a
                                    href={att.dataUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800 rounded-xl text-[10px] font-bold text-blue-700 dark:text-blue-300 transition-all text-left shadow-2xs group"
                                  >
                                    <ExternalLink className="w-3.5 h-3.5 text-blue-500 shrink-0 group-hover:scale-110 transition-transform" />
                                    <span className="truncate max-w-[180px]">{att.name}</span>
                                  </a>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => downloadAttachment(att.name, att.dataUrl, att.type)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-800/80 border border-slate-200 dark:border-zinc-800 rounded-xl text-[10px] font-bold text-slate-600 dark:text-slate-400 transition-all text-left shadow-2xs"
                                  >
                                    <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                    <span className="truncate max-w-[180px]">{att.name}</span>
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 2. Images / Gambar (Bawah - Sejajar & Rapi) */}
                        {imageAtts.length > 0 && (
                          <div className="flex flex-wrap items-center gap-2 pt-0.5">
                            {imageAtts.map((att, idx) => (
                              <div
                                key={idx}
                                className="relative w-14 h-14 rounded-xl border border-slate-250 dark:border-zinc-800 overflow-hidden bg-slate-100 dark:bg-zinc-900 flex items-center justify-center group cursor-pointer shadow-2xs hover:shadow-md hover:border-red-400 dark:hover:border-red-600 transition-all"
                                onClick={() => setLightboxImage(att.dataUrl || null)}
                                title={att.name || "Gambar Lampiran"}
                              >
                                <img src={att.dataUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200" alt={att.name || "attachment"} />
                                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <span className="text-[9px] text-white font-bold bg-black/60 px-1.5 py-0.5 rounded">Zoom</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
                <span className={`text-xs font-bold capitalize flex-shrink-0 ${getPriorityTextColor(issue.priority)}`}>
                  {issue.priority}
                </span>
              </div>

              {/* Card Details: Department, PIC & CreatedAt */}
              <div className="flex items-center justify-between text-[10px] text-slate-450 dark:text-slate-500 border-t border-b border-slate-50 dark:border-zinc-900 py-2.5">
                <div className="space-y-1">
                  <div>
                    <span className="font-semibold text-slate-400">Divisi: </span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {dept?.name || "Global"}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-400">PIC: </span>
                    <span className="font-bold text-slate-700 dark:text-slate-350">{issue.picName}</span>
                  </div>
                </div>

                <div className="text-right text-[10px] text-slate-450 font-semibold">
                  <span>Dibuat: </span>
                  <span className="text-slate-600 dark:text-slate-450">{formatCardDate(issue.createdAt)}</span>
                </div>
              </div>

              {/* Status & Detail Action Button */}
              <div className="flex justify-between items-center pt-2 gap-2">
                <div>
                  <span className={`text-xs font-bold ${getStatusTextColor(issue.status)}`}>
                    {getStatusLabel(issue.status)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailIssue(issue)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 rounded-lg text-xs font-bold transition-all inline-flex items-center justify-center shadow-2xs hover:shadow-xs cursor-pointer border border-slate-200/80 dark:border-zinc-700"
                >
                  Detail
                </button>
              </div>
            </div>
          );
        })}

        {displayedIssues.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-400 font-medium bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850 rounded-xl">
            Tidak ada issue/kendala yang ditemukan.
          </div>
        )}
      </div>

      {/* Modal Dialog: Add Issue */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md max-h-[90vh] rounded-2xl shadow-2xl p-6 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start mb-4 flex-shrink-0">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Laporkan Issue Baru</h3>
                <p className="text-xs text-slate-500 mt-1">Laporkan kendala operasional agar tim segera menindaklanjuti.</p>
              </div>
              <button
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {/* Scope Selection (Only Owner/Developer) */}
                {canViewAll && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Divisi Terkendala
                    </label>
                    <select
                      required
                      value={newDept}
                      onChange={(e) => setNewDept(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none text-slate-900 dark:text-white"
                    >
                      <option value="">Pilih Divisi...</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Judul Kendala / Masalah
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Contoh: Stove Bocor, Printer Kasir Mati..."
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Detail / Deskripsi Masalah
                  </label>
                  <textarea
                    required
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Ceritakan kendala, dampak operasional, atau bantuan yang dibutuhkan..."
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white h-24 resize-none"
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Prioritas Penanganan
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Issue["priority"])}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none text-slate-900 dark:text-white"
                  >
                    <option value="low">🟢 Low Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="high">🔴 High Priority</option>
                    <option value="critical">🚨 Critical / Blocked</option>
                  </select>
                </div>

                {/* Attachment Section (File + Link) */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Foto Bukti / Lampiran & Link (Opsional)
                  </label>

                  {/* File Upload Dropzone */}
                  <label className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl p-3 text-center cursor-pointer transition-colors block">
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFilesChange}
                      accept="image/*,.pdf,.xls,.xlsx,.csv,.ppt,.pptx"
                    />
                    <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <Paperclip className="w-4 h-4 text-slate-400" />
                      <span>Pilih File Lampiran...</span>
                    </div>
                    <p className="text-[9px] text-slate-400 mt-0.5">
                      Foto, PDF, Excel, CSV, PPT (Maks 5MB/file)
                    </p>
                  </label>

                  {/* Add External Link Section */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2.5 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                      <LinkIcon className="w-3.5 h-3.5 text-blue-500" />
                      <span>Sematkan Link / URL Tautan</span>
                    </div>
                    <div className="space-y-2 min-w-0">
                      <input
                        type="url"
                        value={linkInputUrl}
                        onChange={(e) => setLinkInputUrl(e.target.value)}
                        placeholder="URL Link (cth: https://drive.google.com/...)"
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                      />
                      <div className="flex gap-2 min-w-0">
                        <input
                          type="text"
                          value={linkInputName}
                          onChange={(e) => setLinkInputName(e.target.value)}
                          placeholder="Nama / Label Link (Opsional)..."
                          className="flex-1 min-w-0 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={handleAddLink}
                          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-bold rounded-xl transition-all flex items-center gap-1 shrink-0 shadow-xs cursor-pointer"
                        >
                          + Link
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* List of Attached Files & Links */}
                  {attachmentFiles.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Daftar Lampiran ({attachmentFiles.length})</span>
                      {attachmentFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 rounded-lg px-3 py-1.5 text-xs">
                          <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                            {file.type === "link" || file.dataUrl?.startsWith("http") ? (
                              <>
                                <ExternalLink className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                                <a
                                  href={file.dataUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 dark:text-blue-400 font-bold truncate hover:underline"
                                >
                                  {file.name}
                                </a>
                                <span className="text-[9px] text-slate-400 font-medium flex-shrink-0">(Link Tautan)</span>
                              </>
                            ) : (
                              <>
                                <Paperclip className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                <span className="text-slate-800 dark:text-slate-200 font-bold truncate">{file.name}</span>
                                <span className="text-[10px] text-slate-400 font-medium flex-shrink-0">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                              </>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => setAttachmentFiles(prev => prev.filter((_, i) => i !== idx))}
                            className="text-red-500 hover:text-red-700 font-bold text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2.5 text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2.5 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 rounded-xl transition-colors shadow-md shadow-zinc-900/10 cursor-pointer border border-zinc-900 dark:border-zinc-100 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white dark:text-zinc-950" />
                      <span>Verifikasi & Memasukkan Data ke Database...</span>
                    </>
                  ) : (
                    <span>Laporkan Issue</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Dialog: Edit Issue */}
      {editingIssue && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md max-h-[90vh] rounded-2xl shadow-2xl p-6 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start mb-4 flex-shrink-0">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit Issue / Kendala</h3>
                <p className="text-xs text-slate-500 mt-1">Perbarui judul, deskripsi, prioritas, atau status kendala.</p>
              </div>
              <button
                onClick={() => setEditingIssue(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditIssue} className="space-y-4 overflow-y-auto flex-1 pr-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Kendala <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Judul issue..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi Masalah
                </label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Detail kendala..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-900 dark:text-white h-20 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Prioritas
                  </label>
                  <CustomSelect
                    value={editPriority}
                    onChange={(val) => setEditPriority(val as Issue["priority"])}
                    triggerClass="w-full justify-between bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white px-3 py-2 rounded-xl text-xs font-bold"
                    options={[
                      { value: "low", label: "Low", icon: <span>🟢</span> },
                      { value: "medium", label: "Medium", icon: <span>🟡</span> },
                      { value: "high", label: "High", icon: <span>🔴</span> },
                      { value: "critical", label: "Critical", icon: <span>🚨</span> },
                    ]}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Status Kendala
                  </label>
                  <CustomSelect
                    value={editStatus}
                    onChange={(val) => setEditStatus(val as Issue["status"])}
                    triggerClass="w-full justify-between bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-white px-3 py-2 rounded-xl text-xs font-bold"
                    options={[
                      { value: "open", label: "Open", icon: <span>🔴</span> },
                      { value: "in_progress", label: "In Progress", icon: <span>🟡</span> },
                      { value: "solved", label: "Solved", icon: <span>🟢</span> },
                      { value: "closed", label: "Closed", icon: <span>⚫</span> },
                    ]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {canViewAll && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Divisi
                    </label>
                    <select
                      value={editDept}
                      onChange={(e) => setEditDept(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none text-slate-900 dark:text-white"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name} Division</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama PIC
                  </label>
                  <input
                    type="text"
                    value={editPicName}
                    onChange={(e) => setEditPicName(e.target.value)}
                    placeholder="Nama PIC..."
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingIssue(null)}
                  className="px-4 py-2 text-xs font-bold border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white rounded-xl shadow-md shadow-amber-500/10"
                >
                  💾 Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-transparent overflow-hidden rounded-2xl shadow-2xl">
            <img
              src={lightboxImage}
              className="max-w-full max-h-[85vh] object-contain rounded-xl select-none"
              alt="attachment-popup"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 text-xs font-bold leading-none cursor-pointer w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>
      )}
      {/* Universal Convert Modal */}
      <UniversalConvertModal
        isOpen={!!convertItem}
        onClose={() => setConvertItem(null)}
        sourceType="issue"
        sourceItem={convertItem}
      />

      {/* Issue Detail Modal */}
      <IssueDetailModal
        isOpen={!!detailIssue}
        onClose={() => setDetailIssue(null)}
        issue={detailIssue}
        departments={departments}
        onConvert={(issue) => setConvertItem(issue)}
        onEdit={(issue) => handleOpenEditIssue(issue)}
        onDelete={(issue) => {
          showConfirm({
            title: "Hapus Masalah / Issue",
            message: `Apakah Anda yakin ingin menghapus issue "${issue.title}" secara permanen?`,
            variant: "danger",
            confirmText: "Ya, Hapus",
            onConfirm: () => deleteIssue(issue.id)
          });
        }}
        formatCardDate={formatCardDate}
        downloadAttachment={downloadAttachment}
        setLightboxImage={setLightboxImage}
      />
    </div>
  );
}
