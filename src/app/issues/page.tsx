"use client";

import React, { useState } from "react";
import { useApp, Issue, AttachmentInfo } from "@/context/AppContext";
import { Plus, AlertCircle, Calendar, User, FileText, Filter, AlertOctagon, HelpCircle, Paperclip, Edit3, Trash2, RefreshCw, Link as LinkIcon, ExternalLink, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import UniversalConvertModal, { UniversalConvertItem } from "@/components/UniversalConvertModal";
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

  // Sorting State
  const [sortBy, setSortBy] = useState<string>("status");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

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
            {language === "id" ? "Masalah" : "Issues"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
            {canViewAll ? "Owner View: Seluruh Issue Kendala" : `${getDeptName(currentProfile.departmentId)} Division`}
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

      {/* Filter Row */}
      <div className="bg-white dark:bg-zinc-900/90 p-3.5 border border-slate-100 dark:border-zinc-800 rounded-2xl shadow-sm flex flex-wrap items-center justify-between gap-3 min-w-0 max-w-full">
        <div className="flex flex-wrap items-center gap-3.5 w-full sm:w-auto">
          <div className="flex items-center gap-2 mr-1">
            <Filter className="w-4 h-4 text-slate-400 dark:text-zinc-500 shrink-0" />
            <span className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              FILTER:
            </span>
          </div>

          {/* Status Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">STATUS:</span>
            <CustomSelect
              value={statusFilter}
              onChange={(val) => setStatusFilter(val)}
              triggerClass="bg-slate-100 dark:bg-zinc-950/90 border-slate-200/80 dark:border-zinc-800 text-slate-900 dark:text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase"
              options={[
                { value: "all", label: "SEMUA STATUS" },
                { value: "open", label: "OPEN", icon: <span>🔴</span> },
                { value: "in_progress", label: "IN PROGRESS", icon: <span>🟡</span> },
                { value: "solved", label: "SOLVED", icon: <span>🟢</span> },
                { value: "closed", label: "CLOSED", icon: <span>⚫</span> },
              ]}
            />
          </div>

          {/* Division Filter Dropdown */}
          {canViewAll && (
            <>
              <div className="h-4 w-[1px] bg-slate-200 dark:bg-zinc-800 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">DIVISI:</span>
                <CustomSelect
                  value={selectedDeptFilter}
                  onChange={(val) => setSelectedDeptFilter(val)}
                  triggerClass="bg-slate-100 dark:bg-zinc-950/90 border-slate-200/80 dark:border-zinc-800 text-slate-900 dark:text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase"
                  options={[
                    { value: "all", label: "SEMUA DIVISI" },
                    ...departments.map((d) => ({ value: d.id, label: d.name.toUpperCase() })),
                  ]}
                />
              </div>
            </>
          )}

          {/* Priority Filter Dropdown */}
          <div className="h-4 w-[1px] bg-slate-200 dark:bg-zinc-800 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">PRIORITAS:</span>
            <CustomSelect
              value={priorityFilter}
              onChange={(val) => setPriorityFilter(val)}
              triggerClass="bg-slate-100 dark:bg-zinc-950/90 border-slate-200/80 dark:border-zinc-800 text-slate-900 dark:text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase"
              options={[
                { value: "all", label: "SEMUA PRIORITAS" },
                { value: "low", label: "LOW", icon: <span>🟢</span> },
                { value: "medium", label: "MEDIUM", icon: <span>🟡</span> },
                { value: "high", label: "HIGH", icon: <span>🔴</span> },
                { value: "critical", label: "CRITICAL", icon: <span>🚨</span> },
              ]}
            />
          </div>

          {/* Sort Controls (URUTKAN + ASC/DESC Toggle) */}
          <div className="h-4 w-[1px] bg-slate-200 dark:bg-zinc-800 hidden sm:block" />
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">URUTKAN:</span>
            <CustomSelect
              value={sortBy}
              onChange={(val) => setSortBy(val)}
              triggerClass="bg-slate-100 dark:bg-zinc-950/90 border-slate-200/80 dark:border-zinc-800 text-slate-900 dark:text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase"
              options={[
                { value: "status", label: "⚡ STATUS" },
                { value: "dept", label: "🏢 DIVISI" },
                { value: "priority", label: "🔥 PRIORITAS" },
                { value: "title", label: "📝 JUDUL" }
              ]}
            />
            <button
              type="button"
              onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
              title={sortOrder === "asc" ? "Urutkan Ascending (A-Z / Low-High)" : "Urutkan Descending (Z-A / High-Low)"}
              className="p-1.5 bg-slate-100 dark:bg-zinc-950/90 border border-slate-200/80 dark:border-zinc-800 rounded-xl text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer flex items-center gap-1 text-xs font-extrabold"
            >
              {sortOrder === "asc" ? <ArrowUp className="w-3.5 h-3.5 text-emerald-500" /> : <ArrowDown className="w-3.5 h-3.5 text-red-500" />}
              <span className="uppercase">{sortOrder}</span>
            </button>
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
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Issues Table Card (Desktop only) */}
      <div className="hidden md:block bg-white border border-slate-100 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
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
                      <span className="px-2.5 py-0.5 text-[9px] font-extrabold rounded-full uppercase badge-glass">
                        {dept?.name}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="p-4 text-center">
                      {isOwner ? (
                        <CustomSelect
                          value={issue.priority}
                          onChange={(val) => updateIssuePriority(issue.id, val as Issue["priority"])}
                          triggerClass={getPriorityStyles(issue.priority)}
                          options={[
                            { value: "low", label: "Low" },
                            { value: "medium", label: "Medium" },
                            { value: "high", label: "High" },
                            { value: "critical", label: "Critical" },
                          ]}
                        />
                      ) : (
                        <span className={`px-2.5 py-0.5 text-[9px] font-extrabold uppercase rounded-full border ${getPriorityStyles(issue.priority)}`}>
                          {issue.priority}
                        </span>
                      )}
                    </td>

                    {/* Status selection dropdown / badge */}
                    <td className="p-4 text-center">
                      {isOwner ? (
                        <CustomSelect
                          value={issue.status}
                          onChange={(val) => updateIssueStatus(issue.id, val as Issue["status"])}
                          triggerClass={getStatusStyles(issue.status)}
                          options={[
                            { value: "open", label: "Open", icon: <span>🔴</span> },
                            { value: "in_progress", label: "In Progress", icon: <span>🟡</span> },
                            { value: "solved", label: "Solved", icon: <span>🟢</span> },
                            { value: "closed", label: "Closed", icon: <span>⚫</span> },
                          ]}
                        />
                      ) : (
                        <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border border-transparent shadow-sm inline-block ${getStatusStyles(issue.status)}`}>
                          {issue.status === "open" && "🔴 Open"}
                          {issue.status === "in_progress" && "🟡 In Progress"}
                          {issue.status === "solved" && "🟢 Solved"}
                          {issue.status === "closed" && "⚫ Closed"}
                        </span>
                      )}
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
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setConvertItem(issue)}
                          title="Konversi Issue Ke Modul Lain"
                          className="p-1.5 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-slate-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white border border-slate-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-xl transition-all shadow-2xs cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEditIssue(issue)}
                          title="Edit Issue"
                          className="p-1.5 bg-transparent hover:bg-amber-500/10 text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 border border-slate-200/80 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700/60 rounded-xl transition-all shadow-2xs"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            showConfirm({
                              title: "Hapus Masalah / Issue",
                              message: `Apakah Anda yakin ingin menghapus issue "${issue.title}" secara permanen?`,
                              variant: "danger",
                              confirmText: "Ya, Hapus",
                              onConfirm: () => deleteIssue(issue.id)
                            });
                          }}
                          title="Hapus Issue Permanent"
                          className="p-1.5 bg-transparent hover:bg-rose-500/10 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 border border-slate-200/80 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-700/60 rounded-xl transition-all shadow-2xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
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
            <div key={issue.id} className="bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850 rounded-[20px] p-5 shadow-sm space-y-3.5">
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
                {isOwner ? (
                  <select
                    value={issue.priority}
                    onChange={(e) => updateIssuePriority(issue.id, e.target.value as Issue["priority"])}
                    className={`px-2 py-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[9px] font-extrabold outline-none cursor-pointer transition-all flex-shrink-0 ${getPriorityStyles(issue.priority)}`}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                ) : (
                  <span className={`px-2 py-0.5 text-[8px] font-extrabold uppercase rounded-full border flex-shrink-0 ${getPriorityStyles(issue.priority)}`}>
                    {issue.priority}
                  </span>
                )}
              </div>

              {/* Card Details: Department, PIC & CreatedAt */}
              <div className="flex items-center justify-between text-[10px] text-slate-450 dark:text-slate-500 border-t border-b border-slate-50 dark:border-zinc-900 py-2.5">
                <div className="space-y-1">
                  <div>
                    <span className="font-semibold text-slate-400">Divisi: </span>
                    {canViewAll && dept && (
                      <span className="px-2 py-0.5 text-[8px] font-extrabold rounded-full uppercase badge-glass">
                        {dept.name}
                      </span>
                    )}
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

              {/* Status Selector Dropdown & Actions */}
              <div className="flex justify-between items-center pt-1.5 gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setConvertItem(issue)}
                    title="Konversi Issue Ke Modul Lain"
                    className="p-1.5 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-slate-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white border border-slate-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-xl transition-all shadow-2xs cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenEditIssue(issue)}
                    title="Edit Issue"
                    className="p-1.5 bg-transparent hover:bg-amber-500/10 text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 border border-slate-200/80 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700/60 rounded-xl transition-all shadow-2xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      showConfirm({
                        title: "Hapus Masalah / Issue",
                        message: `Apakah Anda yakin ingin menghapus issue "${issue.title}" secara permanen?`,
                        variant: "danger",
                        confirmText: "Ya, Hapus",
                        onConfirm: () => deleteIssue(issue.id)
                      });
                    }}
                    title="Hapus Issue Permanent"
                    className="p-1.5 bg-transparent hover:bg-rose-500/10 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 border border-slate-200/80 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-700/60 rounded-xl transition-all shadow-2xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isOwner ? (
                  <select
                    value={issue.status}
                    onChange={(e) => updateIssueStatus(issue.id, e.target.value as Issue["status"])}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold outline-none border border-transparent shadow-sm cursor-pointer ${getStatusStyles(issue.status)}`}
                  >
                    <option value="open">🔴 Open</option>
                    <option value="in_progress">🟡 In Progress</option>
                    <option value="solved">🟢 Solved</option>
                    <option value="closed">⚫ Closed</option>
                  </select>
                ) : (
                  <span className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border border-transparent shadow-sm ${getStatusStyles(issue.status)}`}>
                    {issue.status === "open" && "🔴 Open"}
                    {issue.status === "in_progress" && "🟡 In Progress"}
                    {issue.status === "solved" && "🟢 Solved"}
                    {issue.status === "closed" && "⚫ Closed"}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {displayedIssues.length === 0 && (
          <div className="p-8 text-center text-xs text-slate-400 font-medium bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-850 rounded-[20px]">
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
    </div>
  );
}
