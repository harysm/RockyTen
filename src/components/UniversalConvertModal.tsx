"use client";

import React, { useState, useEffect } from "react";
import { useApp, AttachmentInfo } from "@/context/AppContext";
import {
  ArrowRight,
  ArrowDown,
  RefreshCw,
  Sparkles,
  Check,
  AlertTriangle,
  FileText,
  X,
  Paperclip,
  Link as LinkIcon,
  ExternalLink,
  User,
  Calendar,
  Loader2,
  Building2,
  Target,
  ClipboardList,
  AlertOctagon,
  Megaphone,
  Layers,
  ArrowUpRight
} from "lucide-react";
import FormDatePicker from "@/components/FormDatePicker";

export type ConvertSourceType = "todo" | "headline" | "issue" | "metric";
export type ConvertTargetType = "todo" | "headline" | "issue" | "metric";

export interface UniversalConvertItem {
  id: string;
  title: string;
  description?: string;
  content?: string;
  departmentId?: string | null;
  priority?: string;
  category?: string;
  attachments?: AttachmentInfo[];
  picName?: string;
}

interface UniversalConvertModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourceType: ConvertSourceType;
  sourceItem: UniversalConvertItem | null;
}

const getDaysBetween = (startStr: string, endStr: string) => {
  if (!startStr || !endStr) return 7;
  const start = new Date(startStr);
  const end = new Date(endStr);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays || 1;
};

export default function UniversalConvertModal({
  isOpen,
  onClose,
  sourceType,
  sourceItem
}: UniversalConvertModalProps) {
  const {
    currentProfile,
    departments,
    allProfiles,
    addMetric,
    addTodo,
    addHeadline,
    addIssue,
    deleteTodo,
    deleteIssue,
    deleteHeadline,
    deleteMetric,
    showToast,
    addHistoryLog
  } = useApp();

  const availableTargets: { type: ConvertTargetType; label: string; icon: React.ReactNode; desc: string }[] = [
    { type: "metric" as ConvertTargetType, label: "Scoreboard KPI", icon: <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" />, desc: "Ubah jadi sasaran berkala" },
    { type: "todo" as ConvertTargetType, label: "Agenda Todo", icon: <ClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400" />, desc: "Ubah jadi tindakan tim" },
    { type: "issue" as ConvertTargetType, label: "Masalah Issue", icon: <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400" />, desc: "Ubah jadi kendala rapat IDS" },
    { type: "headline" as ConvertTargetType, label: "Berita Headline", icon: <Megaphone className="w-4 h-4 text-purple-600 dark:text-purple-400" />, desc: "Ubah jadi pengumuman tim" },
  ].filter(t => t.type !== sourceType);

  const [targetType, setTargetType] = useState<ConvertTargetType>(availableTargets[0]?.type || "todo");

  // Form states (Pre-filled)
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [deptId, setDeptId] = useState("");

  // PIC States
  const [selectedPicId, setSelectedPicId] = useState("");
  const [selectedPicName, setSelectedPicName] = useState("");

  // Target Specific States
  // Metric
  const [metricTarget, setMetricTarget] = useState<string>("100");
  const [metricUnit, setMetricUnit] = useState<"number" | "currency" | "percentage">("number");
  const [metricAccumulationMode, setMetricAccumulationMode] = useState<"sum" | "average">("sum");
  const [metricTargetType, setMetricTargetType] = useState<"higher_better" | "lower_better">("higher_better");
  const [metricCycle, setMetricCycle] = useState<"monthly" | "special">("monthly");
  const [metricDeadline, setMetricDeadline] = useState("");
  const [metricDurationDays, setMetricDurationDays] = useState(7);

  // Todo / Issue
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "critical">("medium");

  // Headline
  const [headlineCategory, setHeadlineCategory] = useState<"good_news" | "bad_news" | "reminder" | "announcement" | "achievement">("announcement");

  // Attachment States (For Todo, Headline, Issue)
  const [attachmentFiles, setAttachmentFiles] = useState<AttachmentInfo[]>([]);
  const [linkInputUrl, setLinkInputUrl] = useState("");
  const [linkInputName, setLinkInputName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Escape key handler & scroll lock
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          onClose();
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = originalOverflow || "unset";
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  // Reset/Initialize form when sourceItem or isOpen changes
  useEffect(() => {
    if (sourceItem && isOpen) {
      const initialTitle = sourceItem.title || "";
      const initialDesc = sourceItem.description || sourceItem.content || "";
      const initialDept = sourceItem.departmentId || currentProfile.departmentId || (departments[0]?.id || "");

      setTitle(initialTitle);
      setDesc(initialDesc);
      setDeptId(initialDept);
      setAttachmentFiles(sourceItem.attachments ? [...sourceItem.attachments] : []);
      setLinkInputUrl("");
      setLinkInputName("");
      setMetricCycle("monthly");
      setMetricDeadline("");
      setMetricDurationDays(7);
      setMetricAccumulationMode("sum");

      // Auto-set PIC based on initialDept
      const matchingPics = initialDept && initialDept !== "global"
        ? allProfiles.filter(p => p.departmentId === initialDept)
        : allProfiles;

      if (matchingPics.length > 0) {
        setSelectedPicId(matchingPics[0].id);
        setSelectedPicName(matchingPics[0].name);
      } else {
        setSelectedPicId(currentProfile.id);
        setSelectedPicName(sourceItem.picName || currentProfile.name);
      }

      // Set default target
      const firstTarget = availableTargets[0]?.type || "todo";
      setTargetType(firstTarget);
    }
  }, [sourceItem, isOpen]);

  if (!isOpen || !sourceItem) return null;

  const getDeptName = (id?: string | null) => {
    if (!id || id === "global") return "Semua Divisi";
    const dept = departments.find(d => d.id === id);
    return dept ? dept.name : "Divisi";
  };

  // Handle Division Change & Auto Update PIC
  const handleDeptChange = (newDept: string) => {
    setDeptId(newDept);

    if (newDept && newDept !== "global") {
      const matchingPics = allProfiles.filter(p => p.departmentId === newDept);
      if (matchingPics.length > 0) {
        setSelectedPicId(matchingPics[0].id);
        setSelectedPicName(matchingPics[0].name);
        return;
      }
    }

    // Fallback if global or no PIC found for that division
    setSelectedPicId(currentProfile.id);
    setSelectedPicName(currentProfile.name);
  };

  // Handle PIC Selection Change
  const handlePicChange = (pid: string) => {
    setSelectedPicId(pid);
    const prof = allProfiles.find(p => p.id === pid);
    if (prof) {
      setSelectedPicName(prof.name);
    }
  };

  // Handle File Selection
  const handleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selectedFiles = Array.from(e.target.files);

    const newAtts: AttachmentInfo[] = [];
    let processedCount = 0;

    selectedFiles.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`⚠️ Ukuran file "${file.name}" melebihi batas 5MB.`);
        processedCount++;
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        newAtts.push({
          name: file.name,
          size: file.size,
          type: file.type || "application/octet-stream",
          dataUrl: reader.result as string,
        });
        processedCount++;
        if (processedCount === selectedFiles.length) {
          setAttachmentFiles((prev) => [...prev, ...newAtts]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  // Handle Add Link
  const handleAddLink = () => {
    if (!linkInputUrl.trim()) {
      alert("⚠️ Harap isi URL link terlebih dahulu.");
      return;
    }

    let finalUrl = linkInputUrl.trim();
    if (!finalUrl.startsWith("http://") && !finalUrl.startsWith("https://")) {
      finalUrl = `https://${finalUrl}`;
    }

    const linkName = linkInputName.trim() || finalUrl;

    setAttachmentFiles((prev) => [
      ...prev,
      {
        name: linkName,
        size: 0,
        type: "link",
        dataUrl: finalUrl,
      },
    ]);

    setLinkInputUrl("");
    setLinkInputName("");
  };

  const getSourceTypeName = (st: ConvertSourceType) => {
    switch (st) {
      case "todo": return "Agenda Todo";
      case "headline": return "Berita Headline";
      case "issue": return "Masalah Issue";
      case "metric": return "Scoreboard KPI";
    }
  };

  const getSourceBadgeColor = (st: ConvertSourceType) => {
    switch (st) {
      case "todo": return "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900";
      case "headline": return "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-900";
      case "issue": return "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900";
      case "metric": return "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900";
    }
  };

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined" && !navigator.onLine) {
      showToast("Koneksi terputus! Mohon periksa internet Anda.", "error");
      return;
    }
    if (!title.trim()) {
      showToast("Judul tidak boleh kosong.", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const targetDept = deptId || currentProfile.departmentId || departments[0]?.id || "";

      if (targetType === "metric") {
        if (metricCycle === "special" && !metricDeadline) {
          showToast("Harap tentukan Tanggal Deadline untuk metrik khusus Ad-Hoc.", "warning");
          setIsSubmitting(false);
          return;
        }

        const selectedPicObj = allProfiles.find(p => p.id === selectedPicId) || currentProfile;
        await addMetric({
          name: title.trim(),
          target: Number(metricTarget) || 100,
          unit: metricUnit,
          targetType: metricTargetType,
          departmentId: targetDept,
          picId: selectedPicObj.id,
          picName: selectedPicObj.name,
          keterangan: desc.trim(),
          cycleType: metricCycle,
          accumulationMode: metricAccumulationMode,
          durationDays: metricCycle === "special" ? metricDurationDays : 7,
          deadline: metricCycle === "special" && metricDeadline ? metricDeadline : undefined
        });
      } else if (targetType === "todo") {
        await addTodo({
          title: title.trim(),
          description: desc.trim(),
          priority: (priority === "critical" ? "high" : priority) as "low" | "medium" | "high",
          deadline: new Date().toISOString().split("T")[0],
          status: "pending",
          departmentId: targetDept,
          createdBy: selectedPicName || currentProfile.name,
          attachments: attachmentFiles
        });
      } else if (targetType === "headline") {
        await addHeadline({
          title: title.trim(),
          content: desc.trim() || title.trim(),
          category: headlineCategory,
          departmentId: targetDept === "global" ? null : targetDept,
          authorId: selectedPicId || currentProfile.id,
          authorName: selectedPicName || currentProfile.name,
          attachments: attachmentFiles
        });
      } else if (targetType === "issue") {
        await addIssue({
          title: title.trim(),
          description: desc.trim(),
          priority: priority,
          status: "open",
          departmentId: targetDept,
          picId: selectedPicId || currentProfile.id,
          picName: selectedPicName || currentProfile.name,
          attachments: attachmentFiles
        });
      }

      // Auto delete origin item on convert
      if (sourceType === "todo") {
        deleteTodo(sourceItem.id);
      } else if (sourceType === "issue") {
        deleteIssue(sourceItem.id);
      } else if (sourceType === "headline") {
        deleteHeadline(sourceItem.id);
      } else if (sourceType === "metric") {
        deleteMetric(sourceItem.id);
      }

      addHistoryLog("Universal Convert", `Mengonversi ${getSourceTypeName(sourceType)} "${sourceItem.title}" ke ${targetType.toUpperCase()}`, targetDept);
      showToast("Berhasil dikonversi & diperbarui di sistem!", "success");
      onClose();
    } catch (err) {
      console.error("Convert error:", err);
      showToast("Gagal memproses konversi.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered PIC list for dropdown: prioritize PICs of selected department
  const isSpecificDept = deptId && deptId !== "global";
  const deptPics = isSpecificDept ? allProfiles.filter(p => p.departmentId === deptId) : [];
  const otherPics = isSpecificDept ? allProfiles.filter(p => p.departmentId !== deptId) : allProfiles;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[999] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto animate-in fade-in duration-200">
      {/* Unified Split-Card Container */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-5xl max-h-[92vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-250 ease-out">
        
        {/* Unified Modal Header */}
        <div className="flex justify-between items-center px-5 sm:px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex-shrink-0 bg-zinc-50/60 dark:bg-zinc-950/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/60">
              <RefreshCw className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 leading-snug">
                Konversi Antar Modul (Before &rarr; After)
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 hidden sm:block">
                Transformasikan data tanpa kehilangan konteks referensi item sumber aslinya.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Tutup Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Split-Body Canvas: Left Panel (Before) & Right Panel (After) */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0 relative">

          {/* PANEL KIRI: Data Sumber Asal (Before - Read Only Context) */}
          <div className="w-full lg:w-[350px] flex-shrink-0 bg-slate-50/80 dark:bg-zinc-950/70 p-5 border-b lg:border-b-0 lg:border-r border-zinc-200 dark:border-zinc-800 flex flex-col justify-between overflow-y-auto max-h-[35vh] lg:max-h-full">
            <div className="space-y-3.5">
              {/* Source Tag Badge */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  📦 DATA SUMBER ASAL
                </span>
                <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-md border ${getSourceBadgeColor(sourceType)} flex items-center gap-1`}>
                  {getSourceTypeName(sourceType)}
                </span>
              </div>

              {/* Source Card Content */}
              <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-2xs space-y-3">
                <div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Judul Item Asli
                  </span>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                    {sourceItem.title}
                  </h4>
                </div>

                {/* Meta Pills (Division & PIC) */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                    <Building2 className="w-3 h-3 text-zinc-500" />
                    {getDeptName(sourceItem.departmentId)}
                  </span>
                  {sourceItem.picName && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                      <User className="w-3 h-3 text-zinc-500" />
                      {sourceItem.picName}
                    </span>
                  )}
                  {sourceItem.priority && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[11px] font-bold uppercase text-zinc-700 dark:text-zinc-300">
                      {sourceItem.priority}
                    </span>
                  )}
                </div>

                {/* Source Description */}
                {(sourceItem.description || sourceItem.content) ? (
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      Deskripsi / Keterangan Asli
                    </span>
                    <div className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed bg-zinc-50 dark:bg-zinc-950 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 max-h-36 overflow-y-auto">
                      {sourceItem.description || sourceItem.content}
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-zinc-400 italic">
                    (Tidak ada catatan deskripsi)
                  </div>
                )}

                {/* Source Attachments (if any) */}
                {sourceItem.attachments && sourceItem.attachments.length > 0 && (
                  <div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      Lampiran Asli ({sourceItem.attachments.length})
                    </span>
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {sourceItem.attachments.map((att, i) => (
                        <div key={i} className="flex items-center gap-1.5 text-[11px] text-zinc-600 dark:text-zinc-400 truncate">
                          <Paperclip className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                          <span className="truncate font-medium">{att.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Left Bottom Context Callout */}
            <div className="mt-4 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-900/40 text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">
              💡 <strong>Konteks Terjaga:</strong> Data asal di sebelah kiri dijadikan acuan. Silakan lengkapi formulir modul baru di sebelah kanan.
            </div>
          </div>

          {/* FLOATING CONNECTOR BRIDGE (Desktop Center Arrow) */}
          <div className="hidden lg:flex absolute left-[350px] top-1/2 -translate-y-1/2 -translate-x-1/2 z-10">
            <div className="w-8 h-8 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-950 shadow-md border-2 border-white dark:border-zinc-900 flex items-center justify-center transition-transform hover:scale-110">
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* MOBILE CONNECTOR BAR */}
          <div className="flex lg:hidden items-center justify-center py-1.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[11px] font-bold gap-1 border-y border-zinc-200 dark:border-zinc-700">
            <ArrowDown className="w-3.5 h-3.5" />
            <span>Konversi Menuju Target Baru</span>
          </div>

          {/* PANEL KANAN: Form Target Konversi (After - Active Form) */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto flex flex-col justify-between max-h-[60vh] lg:max-h-full">
            <form onSubmit={handleConvert} className="space-y-4">
              
              {/* Target Type Selector */}
              <div>
                <label className="block text-[11px] font-extrabold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                  Pilih Modul Tujuan Baru <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {availableTargets.map((t) => (
                    <button
                      key={t.type}
                      type="button"
                      onClick={() => setTargetType(t.type)}
                      className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                        targetType === t.type
                          ? "bg-blue-50/80 dark:bg-blue-950/40 border-blue-500 dark:border-blue-600 text-zinc-900 dark:text-zinc-100 shadow-xs ring-1 ring-blue-500/30"
                          : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      }`}
                    >
                      <div className="p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex-shrink-0 mt-0.5">
                        {t.icon}
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-bold block leading-tight truncate">{t.label}</span>
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block mt-0.5 line-clamp-1">{t.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Judul Item Baru <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                  Deskripsi / Keterangan Baru
                </label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100 h-20 resize-none"
                />
              </div>

              {/* Division Selector & PIC Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Divisi Terkait <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={deptId}
                    onChange={(e) => handleDeptChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100 cursor-pointer"
                  >
                    <option value="global">Semua Divisi (Global)</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name} Division</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    PIC (Person In Charge) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedPicId}
                    onChange={(e) => handlePicChange(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100 cursor-pointer"
                  >
                    {deptPics.length > 0 && (
                      <optgroup label="PIC Divisi Ini">
                        {deptPics.map((p) => (
                          <option key={p.id} value={p.id}>{p.name} ({p.role.toUpperCase()})</option>
                        ))}
                      </optgroup>
                    )}
                    <optgroup label="Anggota Lainnya">
                      {otherPics.map((p) => (
                        <option key={p.id} value={p.id}>{p.name} ({p.role.toUpperCase()})</option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* DYNAMIC FIELDS PER TARGET */}

              {/* TARGET: METRIC */}
              {targetType === "metric" && (
                <div className="p-3.5 bg-amber-50/40 dark:bg-amber-950/20 rounded-xl border border-amber-200/60 dark:border-amber-900/40 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
                    <Target className="w-3.5 h-3.5" />
                    <span>Konfigurasi Target Scoreboard KPI</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Target Angka <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={metricTarget}
                        onChange={(e) => setMetricTarget(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-amber-500 text-zinc-900 dark:text-zinc-100"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Satuan Unit
                      </label>
                      <select
                        value={metricUnit}
                        onChange={(e) => setMetricUnit(e.target.value as any)}
                        className="w-full px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs font-semibold focus:outline-none text-zinc-900 dark:text-zinc-100 cursor-pointer"
                      >
                        <option value="number">Angka / Jumlah (#)</option>
                        <option value="currency">Mata Uang (Rp)</option>
                        <option value="percentage">Persentase (%)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Mode Akumulasi
                      </label>
                      <select
                        value={metricAccumulationMode}
                        onChange={(e) => setMetricAccumulationMode(e.target.value as any)}
                        className="w-full px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs font-semibold focus:outline-none text-zinc-900 dark:text-zinc-100 cursor-pointer"
                      >
                        <option value="sum">Penjumlahan (SUM)</option>
                        <option value="average">Rata-Rata (AVG)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Arah Evaluasi
                      </label>
                      <select
                        value={metricTargetType}
                        onChange={(e) => setMetricTargetType(e.target.value as any)}
                        className="w-full px-3 py-1.5 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs font-semibold focus:outline-none text-zinc-900 dark:text-zinc-100 cursor-pointer"
                      >
                        <option value="higher_better">Semakin Tinggi Lebih Baik (&ge;)</option>
                        <option value="lower_better">Semakin Rendah Lebih Baik (&le;)</option>
                      </select>
                    </div>
                  </div>

                  {/* Cycle Type */}
                  <div className="pt-2 border-t border-amber-200/50 dark:border-amber-900/30">
                    <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Siklus Waktu Metrik
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setMetricCycle("monthly")}
                        className={`p-2 rounded-lg border text-left text-xs font-semibold cursor-pointer ${
                          metricCycle === "monthly"
                            ? "bg-white dark:bg-zinc-900 border-amber-500 text-amber-700 dark:text-amber-300 shadow-2xs font-bold"
                            : "bg-transparent border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        📅 Bulanan (4 Minggu)
                      </button>
                      <button
                        type="button"
                        onClick={() => setMetricCycle("special")}
                        className={`p-2 rounded-lg border text-left text-xs font-semibold cursor-pointer ${
                          metricCycle === "special"
                            ? "bg-white dark:bg-zinc-900 border-amber-500 text-amber-700 dark:text-amber-300 shadow-2xs font-bold"
                            : "bg-transparent border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                        }`}
                      >
                        ⚡ Khusus / Ad-Hoc
                      </button>
                    </div>

                    {metricCycle === "special" && (
                      <div className="mt-2.5">
                        <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                          Tanggal Deadline Khusus <span className="text-rose-500">*</span>
                        </label>
                        <FormDatePicker
                          value={metricDeadline}
                          onChange={(val) => {
                            setMetricDeadline(val);
                            if (val) {
                              const todayStr = new Date().toISOString().split("T")[0];
                              const days = getDaysBetween(todayStr, val);
                              setMetricDurationDays(days);
                            }
                          }}
                          placeholder="Pilih batas tanggal deadline"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TARGET: TODO / ISSUE (Priority Selector) */}
              {(targetType === "todo" || targetType === "issue") && (
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Tingkat Prioritas <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { val: "low", label: "Low", color: "text-slate-600 border-slate-300" },
                      { val: "medium", label: "Medium", color: "text-amber-600 border-amber-400" },
                      { val: "high", label: "High", color: "text-orange-600 border-orange-400" },
                      ...(targetType === "issue" ? [{ val: "critical", label: "Critical", color: "text-rose-600 border-rose-400" }] : [])
                    ].map((p) => (
                      <button
                        key={p.val}
                        type="button"
                        onClick={() => setPriority(p.val as any)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-bold border text-center transition-all cursor-pointer ${
                          priority === p.val
                            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 border-zinc-900 dark:border-zinc-100 shadow-2xs"
                            : `bg-white dark:bg-zinc-950 ${p.color}`
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TARGET: HEADLINE (Category Selector) */}
              {targetType === "headline" && (
                <div>
                  <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                    Kategori Berita <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={headlineCategory}
                    onChange={(e) => setHeadlineCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg text-xs font-semibold focus:outline-none text-zinc-900 dark:text-zinc-100 cursor-pointer"
                  >
                    <option value="announcement">Pengumuman (Announcement)</option>
                    <option value="achievement">Pencapaian (Achievement)</option>
                    <option value="good_news">Kabar Baik (Good News)</option>
                    <option value="bad_news">Kendala / Kabar Buruk (Bad News)</option>
                    <option value="reminder">Pengingat (Reminder)</option>
                  </select>
                </div>
              )}

              {/* ATTACHMENTS (For Todo, Headline, Issue) */}
              {targetType !== "metric" && (
                <div className="space-y-2 pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                      Lampiran Dokumen / Tautan
                    </label>
                    <span className="text-[10px] text-zinc-400">(Maks 5MB per file)</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* File Upload Button */}
                    <label className="flex items-center justify-center gap-1.5 p-2 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs text-zinc-600 dark:text-zinc-300 cursor-pointer transition-colors">
                      <Paperclip className="w-3.5 h-3.5" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={handleFilesChange}
                      />
                    </label>

                    {/* Add Link Input */}
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        placeholder="Tempel URL Tautan..."
                        value={linkInputUrl}
                        onChange={(e) => setLinkInputUrl(e.target.value)}
                        className="flex-1 px-2.5 py-1.5 text-xs bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-lg focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddLink}
                        className="px-2.5 py-1.5 text-xs font-bold bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* List of Attached Files */}
                  {attachmentFiles.length > 0 && (
                    <div className="space-y-1 max-h-24 overflow-y-auto pt-1">
                      {attachmentFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between p-1.5 bg-zinc-50 dark:bg-zinc-950 rounded-md border border-zinc-200 dark:border-zinc-800 text-xs">
                          <div className="flex items-center gap-1.5 truncate">
                            <Paperclip className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                            <span className="truncate text-zinc-800 dark:text-zinc-200">{file.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setAttachmentFiles((prev) => prev.filter((_, i) => i !== idx))}
                            className="text-rose-500 hover:text-rose-700 text-xs font-bold px-1 cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Submit Action Footer */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold rounded-lg border border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 shadow-md shadow-zinc-900/10 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-zinc-900 dark:border-zinc-100"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Mengonversi & Memperbarui Sistem...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Konfirmasi & Konversi Sekarang</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
