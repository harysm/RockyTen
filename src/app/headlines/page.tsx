"use client";

import React, { useState } from "react";
import { useApp, Headline, AttachmentInfo } from "@/context/AppContext";
import { Plus, Newspaper, Calendar, User, Tag, HelpCircle, FileText, Paperclip, Edit3, Trash2, RefreshCw, Link as LinkIcon, ExternalLink, Filter, Loader2 } from "lucide-react";
import UniversalConvertModal, { UniversalConvertItem } from "@/components/UniversalConvertModal";
import CustomSelect from "@/components/CustomSelect";
import HeadlinesSkeleton from "@/components/skeletons/HeadlinesSkeleton";

export default function HeadlinesPage() {
  const {
    currentProfile,
    departments,
    headlines,
    addHeadline,
    editHeadline,
    deleteHeadline,
    getFilteredData,
    language,
    isLoading,
    showToast,
    showConfirm
  } = useApp();

  const { headlines: filteredHeadlines } = getFilteredData();

  // Tab filter & Division filter
  const [activeTab, setActiveTab] = useState<string>("all");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>("all");
  
  // Modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newCategory, setNewCategory] = useState<Headline["category"]>("good_news");
  const [newDeptScope, setNewDeptScope] = useState<string>("global"); // "global" or department ID

  // File & Link upload state
  const [attachmentFiles, setAttachmentFiles] = useState<AttachmentInfo[]>([]);
  const [linkInputUrl, setLinkInputUrl] = useState("");
  const [linkInputName, setLinkInputName] = useState("");

  // Universal Convert state
  const [convertItem, setConvertItem] = useState<UniversalConvertItem | null>(null);

  // Modal Edit Headline state
  const [editingHeadline, setEditingHeadline] = useState<Headline | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCategory, setEditCategory] = useState<Headline["category"]>("good_news");
  const [editDeptScope, setEditDeptScope] = useState<string>("global");

  const handleOpenEditHeadline = (hl: Headline) => {
    setEditingHeadline(hl);
    setEditTitle(hl.title);
    setEditContent(hl.content);
    setEditCategory(hl.category);
    setEditDeptScope(hl.departmentId || "global");
  };

  const handleSaveEditHeadline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHeadline) return;
    if (!editTitle.trim()) {
      alert("⚠️ Harap isi judul headline terlebih dahulu.");
      return;
    }

    let targetDeptId: string | null = null;
    if (canViewAll) {
      targetDeptId = editDeptScope === "global" ? null : editDeptScope;
    } else {
      targetDeptId = editingHeadline.departmentId;
    }

    editHeadline(editingHeadline.id, {
      title: editTitle.trim(),
      content: editContent.trim(),
      category: editCategory,
      departmentId: targetDeptId
    });

    setEditingHeadline(null);
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

  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const downloadAttachment = (name: string, dataUrl?: string, type?: string) => {
    if (!dataUrl) {
      alert("File data tidak ditemukan.");
      return;
    }

    try {
      // Convert base64 dataUrl to Blob
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

      // Open PDF & images in a new browser tab; download PPT, Excel, Word, CSV, ZIP
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

  const isOwner = currentProfile.role === "owner";
  const isDeveloper = currentProfile.role === "developer";
  const canViewAll = isOwner || isDeveloper;

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

  // Filter headlines by category tab & division filter
  const displayedHeadlines = filteredHeadlines.filter(hl => {
    // 1. Division filter
    if (canViewAll && selectedDeptFilter !== "all") {
      if (selectedDeptFilter === "global" && hl.departmentId !== null) return false;
      if (selectedDeptFilter !== "global" && hl.departmentId !== selectedDeptFilter) return false;
    }
    // 2. Category filter
    if (activeTab !== "all" && hl.category !== activeTab) {
      return false;
    }
    return true;
  });

  const getDeptName = (id: string | null) => {
    if (!id) return "Global";
    const dept = departments.find(d => d.id === id);
    return dept ? dept.name : "PIC";
  };

  const getCategoryStyles = (category: string) => {
    return "badge-glass rounded-full px-2.5 py-0.5 font-extrabold shadow-2xs";
  };

  const getCategoryLabel = (category: string) => {
    return category.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && !navigator.onLine) {
      showToast("Koneksi terputus! Mohon periksa internet Anda sebelum menyimpan.", "error");
      return;
    }
    setIsSubmitting(true);
    
    try {
      // Determine scope
      let targetDeptId: string | null = null;
      if (canViewAll) {
        targetDeptId = newDeptScope === "global" ? null : newDeptScope;
      } else {
        targetDeptId = currentProfile.departmentId;
      }

      await addHeadline({
        title: newTitle,
        content: newContent,
        category: newCategory,
        departmentId: targetDeptId,
        attachments: attachmentFiles
      });

      // Reset Form
      setIsAddOpen(false);
      setNewTitle("");
      setNewContent("");
      setNewCategory("good_news");
      setNewDeptScope("global");
      setAttachmentFiles([]);
    } catch (err) {
      showToast("Gagal menyimpan headline. Silakan coba lagi.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories: { key: string; label: string }[] = [
    { key: "all", label: "Semua" },
    { key: "good_news", label: "Good News" },
    { key: "bad_news", label: "Bad News" },
    { key: "reminder", label: "Reminder" },
    { key: "announcement", label: "Announcement" },
    { key: "achievement", label: "Achievement" }
  ];

  if (isLoading) {
    return <HeadlinesSkeleton />;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {language === "id" ? "Berita" : "Headlines"}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {canViewAll ? "Owner View: Seluruh Headline" : `${getDeptName(currentProfile.departmentId)} Division`}
          </p>
        </div>

        <button
          onClick={() => {
            setIsAddOpen(true);
            if (!canViewAll) {
              setNewDeptScope(currentProfile.departmentId || "global");
            }
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 text-xs font-bold rounded-xl shadow-md shadow-zinc-900/10 transition-all cursor-pointer border border-zinc-900 dark:border-zinc-100"
        >
          <Plus className="w-4 h-4" /> Buat Headline
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

          {/* Category Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">KATEGORI:</span>
            <CustomSelect
              value={activeTab}
              onChange={(val) => setActiveTab(val)}
              triggerClass="bg-slate-100 dark:bg-zinc-950/90 border-slate-200/80 dark:border-zinc-800 text-slate-900 dark:text-white px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase"
              options={[
                { value: "all", label: "SEMUA KATEGORI" },
                { value: "good_news", label: "GOOD NEWS", icon: <span>🎉</span> },
                { value: "bad_news", label: "BAD NEWS", icon: <span>⚠️</span> },
                { value: "reminder", label: "REMINDER", icon: <span>📌</span> },
                { value: "announcement", label: "ANNOUNCEMENT", icon: <span>📢</span> },
                { value: "achievement", label: "ACHIEVEMENT", icon: <span>🏆</span> },
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
                    { value: "global", label: "GLOBAL (MANAGEMENT)" },
                    ...departments.map((d) => ({ value: d.id, label: d.name.toUpperCase() })),
                  ]}
                />
              </div>
            </>
          )}
        </div>

        {/* Reset Filter Button */}
        {(activeTab !== "all" || selectedDeptFilter !== "all") && (
          <button
            type="button"
            onClick={() => {
              setActiveTab("all");
              setSelectedDeptFilter("all");
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Grid Headlines */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedHeadlines.map((hl) => (
          <div 
            key={hl.id} 
            className="bg-white border border-slate-100 rounded-2xl shadow-sm hover-lift flex flex-col h-full overflow-hidden"
          >
            {/* Card Header Tag & Actions */}
            <div className="p-6 pb-0 flex justify-between items-center">
              <span className={`px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded-full border ${getCategoryStyles(hl.category)} flex items-center gap-1`}>
                <span>{getHeadlineIcon(hl.category)}</span>
                {getCategoryLabel(hl.category)}
              </span>

              <div className="flex items-center gap-1.5">
                {(() => {
                  const scope = hl.departmentId ? getDeptName(hl.departmentId).replace(" Division", "").toUpperCase() : "GLOBAL";
                  
                  return (
                    <span className="px-2.5 py-0.5 text-[9px] font-extrabold rounded-full uppercase badge-glass shadow-2xs">
                      {scope}
                    </span>
                  );
                })()}

                {/* Convert Button */}
                <button
                  onClick={() => setConvertItem(hl)}
                  title="Konversi Headline Ke Modul Lain"
                  className="p-1 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-slate-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white border border-slate-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-xl transition-all shadow-2xs cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>

                {/* Edit Button */}
                <button
                  onClick={() => handleOpenEditHeadline(hl)}
                  title="Edit Headline"
                  className="p-1 bg-transparent hover:bg-amber-500/10 text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 border border-slate-200/80 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700/60 rounded-xl transition-all shadow-2xs"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => {
                    showConfirm({
                      title: "Hapus Headline",
                      message: `Apakah Anda yakin ingin menghapus headline "${hl.title}" secara permanen?`,
                      variant: "danger",
                      confirmText: "Ya, Hapus",
                      onConfirm: () => deleteHeadline(hl.id)
                    });
                  }}
                  title="Hapus Headline Permanent"
                  className="p-1 bg-transparent hover:bg-rose-500/10 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 border border-slate-200/80 dark:border-slate-800 hover:border-rose-300 dark:hover:border-rose-700/60 rounded-xl transition-all shadow-2xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6 flex-1 space-y-3">
              <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                {hl.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {hl.content}
              </p>
              {hl.attachments && hl.attachments.length > 0 && (() => {
                const linkAndDocAtts = hl.attachments.filter(
                  (att) => att.type === "link" || att.dataUrl?.startsWith("http") || !att.type.startsWith("image/")
                );
                const imageAtts = hl.attachments.filter(
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

            {/* Card Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-semibold bg-slate-50/30">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" />
                {hl.authorName}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formatCardDate(hl.createdAt)}
              </span>
            </div>
          </div>
        ))}

        {displayedHeadlines.length === 0 && (
          <div className="col-span-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center rounded-2xl shadow-sm">
            <Newspaper className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Belum ada headline</h3>
            <p className="text-xs text-slate-400 mt-1">Gunakan tombol di atas untuk membuat headline baru.</p>
          </div>
        )}
      </div>

      {/* Modal Dialog: Add Headline */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md max-h-[90vh] rounded-2xl shadow-2xl p-6 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start mb-4 flex-shrink-0">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Buat Headline Baru</h3>
                <p className="text-xs text-slate-500 mt-1">Bagikan berita, pengingat, atau pencapaian terbaru.</p>
              </div>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* Scope Selection (Only Owner/Developer) */}
              {canViewAll && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Scope Headline
                  </label>
                  <select
                    value={newDeptScope}
                    onChange={(e) => setNewDeptScope(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none text-slate-900 dark:text-white"
                  >
                    <option value="global">Global (Dilihat Semua Divisi)</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>Khusus Divisi {d.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Kategori
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as Headline["category"])}
                  className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none text-slate-900 dark:text-white"
                >
                  <option value="good_news">Good News 🎉</option>
                  <option value="bad_news">Bad News ⚠️</option>
                  <option value="reminder">Reminder 📌</option>
                  <option value="announcement">Announcement 📢</option>
                  <option value="achievement">Achievement 🏆</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Judul Headline
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Tulis judul berita yang padat..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Konten / Detail Berita
                </label>
                <textarea
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Tulis informasi detail berita di sini..."
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-900 dark:text-white h-24 resize-none"
                />
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
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Buat Headline</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Dialog: Edit Headline */}
      {editingHeadline && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md max-h-[90vh] rounded-2xl shadow-2xl p-6 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start mb-4 flex-shrink-0">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit Headline</h3>
                <p className="text-xs text-slate-500 mt-1">Perbarui judul, konten, atau kategori pengumuman.</p>
              </div>
              <button 
                onClick={() => setEditingHeadline(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditHeadline} className="space-y-4 overflow-y-auto flex-1 pr-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Judul Headline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Judul pengumuman..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Konten / Isi Berita <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Isi berita lengkap..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-slate-900 dark:text-white h-24 resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Kategori
                </label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as Headline["category"])}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none text-slate-900 dark:text-white"
                >
                  <option value="good_news">🎉 Good News</option>
                  <option value="bad_news">⚠️ Bad News</option>
                  <option value="reminder">📌 Reminder</option>
                  <option value="announcement">📢 Announcement</option>
                  <option value="achievement">🏆 Achievement</option>
                </select>
              </div>

              {canViewAll && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Cakupan Divisi
                  </label>
                  <select
                    value={editDeptScope}
                    onChange={(e) => setEditDeptScope(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none text-slate-900 dark:text-white"
                  >
                    <option value="global">Semua Divisi (Global)</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name} Division</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex gap-2 justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingHeadline(null)}
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
        sourceType="headline"
        sourceItem={convertItem}
      />
    </div>
  );
}
