"use client";

import React, { useState } from "react";
import { useApp, Todo, Metric, Profile } from "@/context/AppContext";
import { Plus, CheckSquare, Calendar, Trash2, ArrowUpRight, HelpCircle, FileText, Paperclip, Edit3, RefreshCw, Link as LinkIcon, ExternalLink, Check, Archive, Loader2 } from "lucide-react";
import { AttachmentInfo } from "@/context/AppContext";
import UniversalConvertModal, { UniversalConvertItem } from "@/components/UniversalConvertModal";
import CustomSelect from "@/components/CustomSelect";
import TodosSkeleton from "@/components/skeletons/TodosSkeleton";

export default function TodoPage() {
  const {
    currentProfile,
    departments,
    allProfiles,
    todos,
    addTodo,
    editTodo,
    deleteTodo,
    updateTodoStatus,
    convertTodoToMetric,
    getFilteredData,
    language,
    showToast,
    showConfirm,
    isLoading
  } = useApp();

  const { todos: filteredTodos } = getFilteredData();

  // Filters
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  // Universal Convert state
  const [convertItem, setConvertItem] = useState<UniversalConvertItem | null>(null);

  // Modal Add Todo state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState<Todo["priority"]>("medium");
  const [newDept, setNewDept] = useState("");
  const [attachmentFiles, setAttachmentFiles] = useState<AttachmentInfo[]>([]);
  const [linkInputUrl, setLinkInputUrl] = useState("");
  const [linkInputName, setLinkInputName] = useState("");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Modal Edit Todo state
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editPriority, setEditPriority] = useState<Todo["priority"]>("medium");
  const [editDept, setEditDept] = useState("");

  const handleOpenEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setEditTitle(todo.title);
    setEditDesc(todo.description || "");
    setEditPriority(todo.priority);
    setEditDept(todo.departmentId);
  };

  const handleSaveEditTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTodo) return;
    if (!editTitle.trim()) {
      alert("⚠️ Harap isi judul todo terlebih dahulu.");
      return;
    }

    editTodo(editingTodo.id, {
      title: editTitle.trim(),
      description: editDesc.trim(),
      priority: editPriority,
      departmentId: editDept || editingTodo.departmentId
    });

    setEditingTodo(null);
  };

  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`⚠️ File "${file.name}" melebihi batas 5MB.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result as string;
        setAttachmentFiles((prev) => [
          ...prev,
          {
            name: file.name,
            size: file.size,
            type: file.type,
            dataUrl: base64Data
          }
        ]);
      };
      reader.readAsDataURL(file);
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

  // Modal Convert to Metric state
  const [todoToConvert, setTodoToConvert] = useState<Todo | null>(null);
  const [metricTarget, setMetricTarget] = useState("");
  const [metricUnit, setMetricUnit] = useState<Metric["unit"]>("number");
  const [metricTargetType, setMetricTargetType] = useState<Metric["targetType"]>("higher_better");
  const [metricPic, setMetricPic] = useState("");
  const [metricKeterangan, setMetricKeterangan] = useState("");

  const roleLower = (currentProfile.role || "").toLowerCase();
  const isOwner = roleLower === "owner";
  const isDeveloper = roleLower === "developer";
  const canViewAll = isOwner || isDeveloper;

  // Filter list
  const displayedTodos = filteredTodos.filter(t => {
    // 1. Division filter (only for owner/developer)
    if (canViewAll && selectedDeptFilter !== "all" && t.departmentId !== selectedDeptFilter) {
      return false;
    }
    // 2. Status filter
    if (statusFilter !== "all" && t.status !== statusFilter) {
      return false;
    }
    // 3. Priority filter
    if (priorityFilter !== "all" && t.priority !== priorityFilter) {
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

  const todoStatusRank: Record<string, number> = { pending: 1, completed: 2, cancel: 3 };
  const priorityRank: Record<string, number> = { high: 3, medium: 2, low: 1 };

  const sortedTodos = [...displayedTodos].sort((a, b) => {
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

  const getDeptName = (id: string | null) => {
    if (!id) return "Global";
    const dept = departments.find(d => d.id === id);
    return dept ? dept.name : "PIC";
  };

  const getPriorityStyles = (p: string) => {
    switch (p) {
      case "high": return "badge-status-gagal";
      case "medium": return "badge-status-berjalan";
      default: return "badge-glass";
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

      await addTodo({
        departmentId: targetDept,
        title: newTitle,
        description: newDesc,
        priority: newPriority,
        deadline: new Date().toISOString().split("T")[0],
        status: "pending",
        attachments: attachmentFiles
      });

      // Reset
      setIsAddOpen(false);
      setNewTitle("");
      setNewDesc("");
      setNewPriority("medium");
      setNewDept("");
      setAttachmentFiles([]);
    } catch (err) {
      showToast("Gagal menyimpan todo. Silakan coba lagi.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenConvert = (todo: Todo) => {
    setTodoToConvert(todo);
    setMetricPic(currentProfile.id); // default to current user
    setMetricKeterangan(todo.description || "");
  };

  const handleConvertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!todoToConvert) return;
    if (typeof window !== "undefined" && !navigator.onLine) {
      showToast("Koneksi terputus! Mohon periksa internet Anda.", "error");
      return;
    }

    const selectedPicProfile = allProfiles.find(p => p.id === metricPic);
    if (!selectedPicProfile) return;

    setIsSubmitting(true);
    try {
      await convertTodoToMetric(todoToConvert.id, {
        departmentId: todoToConvert.departmentId,
        name: todoToConvert.title,
        target: Number(metricTarget),
        unit: metricUnit,
        targetType: metricTargetType,
        picId: selectedPicProfile.id,
        picName: selectedPicProfile.name,
        keterangan: metricKeterangan
      });

      showToast("Berhasil dikonversi ke Metrik KPI & disimpan ke Database!", "success");

      // Reset
      setTodoToConvert(null);
      setMetricTarget("");
      setMetricUnit("number");
      setMetricTargetType("higher_better");
      setMetricPic("");
      setMetricKeterangan("");
    } catch (err) {
      console.error("Convert error:", err);
      showToast("⚠️ Gagal memproses konversi ke database.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFormPicOptions = (deptId: string) => {
    return allProfiles.filter(p => p.departmentId === deptId);
  };

  if (isLoading) {
    return <TodosSkeleton />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 dark:border-zinc-800 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {language === "id" ? "To-do List" : "To-do List"}
          </h2>
          <p className="text-slate-500 dark:text-zinc-400 font-medium text-sm mt-1">
            {language === "id"
              ? "Kelola komitmen tugas mingguan dan rencana aksi operasional tim secara terstruktur."
              : "Manage weekly action items, operational task commitments, and team deliverables."}
          </p>
        </div>

        <button
          onClick={() => {
            setIsAddOpen(true);
            setNewDept(currentProfile.departmentId || "");
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-bold rounded-xl shadow-md shadow-zinc-900/10 transition-all cursor-pointer border border-zinc-900 dark:border-zinc-100"
        >
          <Plus className="w-4 h-4" /> {language === "id" ? "Tambah Agenda Baru" : "Add New To-do"}
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
                { value: "pending", label: "Pending" },
                { value: "completed", label: "Selesai" },
                { value: "cancel", label: "Dibatalkan" },
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
                { value: "title_asc", label: "Judul Agenda ↑" },
                { value: "title_desc", label: "Judul Agenda ↓" },
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

      {/* Todo List Card container */}
      <div className="bg-white border border-slate-100 rounded-xl shadow-sm divide-y divide-slate-100 overflow-hidden">
        {sortedTodos.map((todo) => {
          const dept = departments.find(d => d.id === todo.departmentId);
          const isCompleted = todo.status === "completed";
          const isCancelled = todo.status === "cancel";

          return (
            <div
              key={todo.id}
              className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${isCompleted ? "bg-slate-50/20" : ""
                }`}
            >
              {/* Checkbox & Title */}
              <div className="flex items-start gap-4 flex-1">
                <button
                  type="button"
                  disabled={isCancelled}
                  onClick={() => {
                    updateTodoStatus(todo.id, isCompleted ? "pending" : "completed");
                  }}
                  className={`custom-todo-checkbox ${isCompleted ? "checked" : ""} ${isCancelled ? "opacity-40 cursor-not-allowed" : ""}`}
                  title={isCompleted ? "Tandai Belum Selesai" : "Tandai Selesai"}
                >
                  {isCompleted && <Check className="w-3.5 h-3.5" />}
                </button>

                <div className="space-y-1">
                  <h3 className={`text-sm font-bold leading-snug ${isCompleted ? "line-through text-slate-400 dark:text-slate-500" : isCancelled ? "line-through text-slate-400" : "text-slate-900 dark:text-white"
                    }`}>
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p className={`text-xs ${isCompleted ? "text-slate-350 dark:text-slate-650" : "text-slate-500 dark:text-slate-400"}`}>
                      {todo.description}
                    </p>
                  )}

                  {todo.attachments && todo.attachments.length > 0 && (() => {
                    const linkAndDocAtts = todo.attachments.filter(
                      (att) => att.type === "link" || att.dataUrl?.startsWith("http") || !att.type.startsWith("image/")
                    );
                    const imageAtts = todo.attachments.filter(
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

                  <div className="flex items-center gap-2 flex-wrap pt-1.5">
                    {canViewAll && (
                      <span className="px-2 py-0.5 text-[8px] font-extrabold rounded-full uppercase badge-glass">
                        {dept?.name}
                      </span>
                    )}
                    <span className={`px-2 py-0.5 text-[8px] font-extrabold uppercase rounded-full border ${getPriorityStyles(todo.priority)}`}>
                      {todo.priority} Priority
                    </span>
                    <span className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold">
                      <Calendar className="w-3.5 h-3.5" />
                      Dibuat: {formatDateSimple(todo.deadline)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center flex-wrap">
                {!isCompleted && !isCancelled && (
                  <button
                    onClick={() => setConvertItem(todo)}
                    title="Konversi Item Ke Modul Lain"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-200/80 dark:border-zinc-800 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-zinc-800/80 text-[10px] font-bold rounded-xl transition-all shadow-2xs cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3 text-slate-700 dark:text-white" />
                    <span>Convert</span>
                  </button>
                )}

                {/* Edit Button */}
                <button
                  onClick={() => handleOpenEditTodo(todo)}
                  title="Edit Todo"
                  className="p-1.5 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-slate-700 hover:text-slate-900 dark:text-white dark:hover:text-white border border-slate-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-xl transition-all shadow-2xs"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => {
                    showConfirm({
                      title: "Hapus Agenda Kerja",
                      message: `Apakah Anda yakin ingin menghapus todo "${todo.title}" secara permanen?`,
                      variant: "danger",
                      confirmText: "Ya, Hapus",
                      onConfirm: () => deleteTodo(todo.id)
                    });
                  }}
                  title="Hapus Todo Permanent"
                  className="p-1.5 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-slate-700 hover:text-slate-900 dark:text-white dark:hover:text-white border border-slate-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-xl transition-all shadow-2xs"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {isCompleted && (
                  <button
                    onClick={() => {
                      showToast(`To-do "${todo.title}" berhasil diarsipkan ke Modul Arsip!`, "info");
                    }}
                    title="Arsipkan ke Modul Arsip"
                    className="p-1.5 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-slate-700 hover:text-slate-900 dark:text-white border border-slate-200/80 dark:border-zinc-800 rounded-xl transition-all shadow-2xs flex items-center gap-1"
                  >
                    <Archive className="w-3.5 h-3.5 text-amber-500" />
                  </button>
                )}


              </div>
            </div>
          );
        })}

        {displayedTodos.length === 0 && (
          <div className="p-12 text-center">
            <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum ada agenda</h3>
            <p className="text-xs text-slate-400 mt-1">Gunakan tombol di atas untuk membuat agenda baru.</p>
          </div>
        )}
      </div>

      {/* Modal Dialog: Add Todo */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md max-h-[90vh] rounded-2xl shadow-2xl p-6 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start mb-4 flex-shrink-0">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{language === "id" ? "Tambah Agenda Baru" : "Add New To-do"}</h3>
                <p className="text-xs text-slate-500 mt-1">Buat agenda tugas atau kpi berkala baru.</p>
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
                      Divisi Pelaksana
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
                    Judul Todo
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Contoh: Backup Database, Update Menu..."
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Deskripsi / Keterangan
                  </label>
                  <textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Tulis detail rincian tugas..."
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white h-20 resize-none"
                  />
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                    Prioritas
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { val: "low" as const, label: "Low", color: "text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900" },
                      { val: "medium" as const, label: "Medium", color: "text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/20" },
                      { val: "high" as const, label: "High", color: "text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/50 hover:bg-orange-50/50 dark:hover:bg-orange-950/20" },
                    ].map((p) => (
                      <button
                        key={p.val}
                        type="button"
                        onClick={() => setNewPriority(p.val)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold border text-center transition-all cursor-pointer ${
                          newPriority === p.val
                            ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border-zinc-900 dark:border-white shadow-xs"
                            : `bg-white dark:bg-zinc-950 ${p.color}`
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Attachment Section (File + Link) */}
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Lampiran File & Link Tautan (Opsional)
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
                    <span>Tambah Todo</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Dialog: Convert Todo to Metric */}
      {todoToConvert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg max-h-[90vh] rounded-2xl shadow-2xl p-6 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start mb-4 flex-shrink-0">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Convert Todo to Metric KPI
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Ubah agenda rutin &ldquo;{todoToConvert.title}&rdquo; menjadi metrik Scoreboard bulanan tetap.
                </p>
              </div>
              <button
                onClick={() => setTodoToConvert(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConvertSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* Metric Name */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Nama Metrik (KPI)
                    </label>
                    <input
                      type="text"
                      required
                      value={todoToConvert.title}
                      disabled
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-450 dark:text-slate-400 cursor-not-allowed font-bold"
                    />
                  </div>

                  {/* Target */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Target Nilai
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      autoFocus
                      value={metricTarget}
                      onChange={(e) => setMetricTarget(e.target.value)}
                      placeholder="Contoh: 100, 30, 99..."
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white font-semibold"
                    />
                  </div>

                  {/* Unit */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Satuan Unit
                    </label>
                    <select
                      value={metricUnit}
                      onChange={(e) => setMetricUnit(e.target.value as Metric["unit"])}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none text-slate-900 dark:text-white"
                    >
                      <option value="number">Number (Angka Murni)</option>
                      <option value="percentage">Percentage (Persen %)</option>
                      <option value="currency">Currency (Mata Uang Rp)</option>
                    </select>
                  </div>

                  {/* PIC Dropdown */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      PIC Penanggung Jawab
                    </label>
                    <select
                      required
                      value={metricPic}
                      onChange={(e) => setMetricPic(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none text-slate-900 dark:text-white"
                    >
                      <option value="">Pilih PIC...</option>
                      {getFormPicOptions(todoToConvert.departmentId).map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Target Type direction */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Metode Evaluasi Target
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-semibold cursor-pointer">
                        <input
                          type="radio"
                          name="targetType"
                          checked={metricTargetType === "higher_better"}
                          onChange={() => setMetricTargetType("higher_better")}
                          className="text-red-600 focus:ring-red-500"
                        />
                        Makin Tinggi Makin Baik
                      </label>
                      <label className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 font-semibold cursor-pointer">
                        <input
                          type="radio"
                          name="targetType"
                          checked={metricTargetType === "lower_better"}
                          onChange={() => setMetricTargetType("lower_better")}
                          className="text-red-600 focus:ring-red-500"
                        />
                        Makin Rendah Makin Baik
                      </label>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                      Keterangan Metrik
                    </label>
                    <textarea
                      value={metricKeterangan}
                      onChange={(e) => setMetricKeterangan(e.target.value)}
                      placeholder="Tulis petunjuk pengisian KPI..."
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white h-16 resize-none"
                    />
                  </div>

                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setTodoToConvert(null)}
                  className="px-4 py-2.5 text-xs font-bold border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2.5 text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors shadow-md shadow-emerald-500/10 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                      <span>Verifikasi & Memasukkan Data ke Database...</span>
                    </>
                  ) : (
                    <span>Selesaikan Todo &amp; Buat Metrik</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Dialog: Edit Todo */}
      {editingTodo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md max-h-[90vh] rounded-2xl shadow-2xl p-6 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start mb-4 flex-shrink-0">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit Agenda Todo</h3>
                <p className="text-xs text-slate-500 mt-1">Perbarui judul, deskripsi, atau prioritas agenda.</p>
              </div>
              <button
                onClick={() => setEditingTodo(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditTodo} className="space-y-4 overflow-y-auto flex-1 pr-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Todo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Judul agenda..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Deskripsi / Catatan
                </label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Detail tugas..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-900 dark:text-white h-20 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Prioritas
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { val: "low" as const, label: "Low", color: "text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-900" },
                    { val: "medium" as const, label: "Medium", color: "text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/20" },
                    { val: "high" as const, label: "High", color: "text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-900/50 hover:bg-orange-50/50 dark:hover:bg-orange-950/20" },
                  ].map((p) => (
                    <button
                      key={p.val}
                      type="button"
                      onClick={() => setEditPriority(p.val)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold border text-center transition-all cursor-pointer ${
                        editPriority === p.val
                          ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-950 border-zinc-900 dark:border-white shadow-xs"
                          : `bg-white dark:bg-zinc-950 ${p.color}`
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {canViewAll && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Divisi Terkendala
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

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingTodo(null)}
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
        sourceType="todo"
        sourceItem={convertItem}
      />
    </div>
  );
}
